/**
 * Storage IPC Handlers
 *
 * Local SQLite database for offline episode storage,
 * sync queue management, and storage statistics.
 */

import type { IpcMain } from 'electron';
import Database from 'better-sqlite3';
import path from 'node:path';
import { app } from 'electron';
import { storageFilterSchema, storageEpisodeIdSchema, validateIpc } from './schemas';

let db: Database.Database | null = null;

function getDb(): Database.Database {
  if (!db) {
    const dbPath = path.join(app.getPath('userData'), 'robotforge.db');
    db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
    initSchema(db);
  }
  return db;
}

function initSchema(database: Database.Database): void {
  database.exec(`
    CREATE TABLE IF NOT EXISTS episodes (
      id TEXT PRIMARY KEY,
      session_id TEXT NOT NULL,
      robot_id TEXT,
      task TEXT NOT NULL,
      embodiment TEXT,
      status TEXT NOT NULL DEFAULT 'recording',
      duration_ms INTEGER DEFAULT 0,
      quality_score REAL,
      sensor_modalities TEXT, -- JSON array
      metadata TEXT,          -- JSON object
      hdf5_path TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      synced_at TEXT
    );

    CREATE TABLE IF NOT EXISTS sync_queue (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      episode_id TEXT NOT NULL UNIQUE REFERENCES episodes(id),
      status TEXT NOT NULL DEFAULT 'pending', -- pending | uploading | completed | failed
      retries INTEGER NOT NULL DEFAULT 0,
      last_error TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_episodes_session ON episodes(session_id);
    CREATE INDEX IF NOT EXISTS idx_episodes_status ON episodes(status);
    CREATE INDEX IF NOT EXISTS idx_sync_queue_status ON sync_queue(status);
  `);
}

export function registerStorageIpc(ipcMain: IpcMain): void {
  /**
   * Get episodes with optional filter.
   */
  ipcMain.handle('storage:get-episodes', async (_event, rawFilter?: unknown) => {
    const filter = validateIpc(storageFilterSchema, rawFilter, 'storage:get-episodes');
    const database = getDb();
    let sql = 'SELECT * FROM episodes WHERE 1=1';
    const params: Record<string, string> = {};

    if (filter?.sessionId) {
      sql += ' AND session_id = @sessionId';
      params.sessionId = filter.sessionId;
    }
    if (filter?.status) {
      sql += ' AND status = @status';
      params.status = filter.status;
    }
    if (filter?.task) {
      sql += ' AND task = @task';
      params.task = filter.task;
    }

    sql += ' ORDER BY created_at DESC';
    return database.prepare(sql).all(params);
  });

  /**
   * Get a single episode by ID.
   */
  ipcMain.handle('storage:get-episode', async (_event, rawId: unknown) => {
    const id = validateIpc(storageEpisodeIdSchema, rawId, 'storage:get-episode');
    const database = getDb();
    return database.prepare('SELECT * FROM episodes WHERE id = ?').get(id) ?? null;
  });

  /**
   * Delete an episode and its associated data.
   */
  ipcMain.handle('storage:delete-episode', async (_event, rawId: unknown) => {
    const id = validateIpc(storageEpisodeIdSchema, rawId, 'storage:delete-episode');
    const database = getDb();
    database.prepare('DELETE FROM sync_queue WHERE episode_id = ?').run(id);
    database.prepare('DELETE FROM episodes WHERE id = ?').run(id);
  });

  /**
   * Get pending sync queue items.
   */
  ipcMain.handle('storage:get-sync-queue', async () => {
    const database = getDb();
    return database
      .prepare("SELECT * FROM sync_queue WHERE status IN ('pending', 'failed') ORDER BY created_at ASC")
      .all();
  });

  /**
   * Trigger sync of pending episodes to the cloud.
   * In production: uploads HDF5 files to MinIO via presigned URLs.
   */
  ipcMain.handle('storage:trigger-sync', async () => {
    const database = getDb();
    const pending = database
      .prepare("SELECT * FROM sync_queue WHERE status IN ('pending', 'failed') AND retries < 3")
      .all() as Array<{ id: number; episode_id: string; retries: number }>;

    let synced = 0;
    let failed = 0;

    for (const item of pending) {
      try {
        // Mock sync — in production this uploads to MinIO
        database
          .prepare("UPDATE sync_queue SET status = 'completed', updated_at = datetime('now') WHERE id = ?")
          .run(item.id);
        database
          .prepare("UPDATE episodes SET synced_at = datetime('now') WHERE id = ?")
          .run(item.episode_id);
        synced++;
      } catch {
        database
          .prepare("UPDATE sync_queue SET status = 'failed', retries = retries + 1, updated_at = datetime('now') WHERE id = ?")
          .run(item.id);
        failed++;
      }
    }

    const remaining = database
      .prepare("SELECT COUNT(*) as count FROM sync_queue WHERE status IN ('pending', 'failed')")
      .get() as { count: number };

    return { synced, failed, remaining: remaining.count };
  });

  /**
   * Get storage statistics.
   */
  ipcMain.handle('storage:get-stats', async () => {
    const database = getDb();

    const totalEpisodes = (database.prepare('SELECT COUNT(*) as count FROM episodes').get() as { count: number }).count;
    const pendingSync = (
      database.prepare("SELECT COUNT(*) as count FROM sync_queue WHERE status IN ('pending', 'failed')").get() as {
        count: number;
      }
    ).count;

    // Estimate disk usage from episode count (rough heuristic)
    const diskUsageMb = totalEpisodes * 25; // ~25MB per episode average

    return { totalEpisodes, pendingSync, diskUsageMb };
  });
}
