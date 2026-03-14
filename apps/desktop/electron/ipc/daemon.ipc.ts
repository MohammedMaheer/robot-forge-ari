/**
 * Daemon IPC Handlers
 *
 * Controls the CollectionDaemon from the renderer process —
 * start/stop/pause collection sessions, manage episode lifecycle.
 */

import type { IpcMain } from 'electron';
import type { CollectionDaemon } from '../daemon/CollectionDaemon';
import { daemonStartSchema, episodeIdSchema, validateIpc } from './schemas';

export function registerDaemonIpc(
  ipcMain: IpcMain,
  getDaemon: () => CollectionDaemon | null,
): void {
  function requireDaemon(): CollectionDaemon {
    const daemon = getDaemon();
    if (!daemon) throw new Error('Collection daemon not initialized');
    return daemon;
  }

  /**
   * Start the collection daemon with a session config.
   */
  ipcMain.handle('daemon:start', async (_event, rawConfig: unknown) => {
    const config = validateIpc(daemonStartSchema, rawConfig, 'daemon:start');
    const daemon = requireDaemon();
    await daemon.start(config);
  });

  /**
   * Stop the daemon and finalize any active episode.
   */
  ipcMain.handle('daemon:stop', async () => {
    const daemon = requireDaemon();
    await daemon.stop();
  });

  /**
   * Pause telemetry collection (does not end the episode).
   */
  ipcMain.handle('daemon:pause', async () => {
    const daemon = requireDaemon();
    daemon.pause();
  });

  /**
   * Resume a paused collection.
   */
  ipcMain.handle('daemon:resume', async () => {
    const daemon = requireDaemon();
    daemon.resume();
  });

  /**
   * Get current daemon status.
   */
  ipcMain.handle('daemon:get-status', async () => {
    const daemon = requireDaemon();
    return daemon.getStatus();
  });

  /**
   * Begin a new episode within the running session.
   */
  ipcMain.handle('daemon:start-episode', async () => {
    const daemon = requireDaemon();
    return daemon.startEpisode();
  });

  /**
   * Stop and finalize an episode.
   */
  ipcMain.handle('daemon:stop-episode', async (_event, rawEpisodeId: unknown) => {
    const episodeId = validateIpc(episodeIdSchema, rawEpisodeId, 'daemon:stop-episode');
    const daemon = requireDaemon();
    await daemon.stopEpisode(episodeId);
  });
}
