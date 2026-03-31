# RobotForge — Software Architecture

---

## 1. System Overview

RobotForge is a **monorepo full-stack platform** for robot training data: collect teleoperation demonstrations from physical hardware, process and quality-score them, and sell or share them through a marketplace. It is structured as a **pnpm workspace + Turborepo** monorepo with 9 independently deployable services, 2 client applications, and 4 shared libraries.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             CLIENT TIER                                      │
│                                                                              │
│   ┌──────────────────────────┐       ┌──────────────────────────────────┐   │
│   │   Web PWA  :5173         │       │   Desktop (Electron 30)          │   │
│   │   React 18 + Vite        │       │   Chromium + Node main process   │   │
│   │   Zustand + React Query  │       │   contextIsolation + sandbox     │   │
│   │   Socket.io-client       │       │   IPC: robot/storage/daemon      │   │
│   └──────────┬───────────────┘       └──────────────┬───────────────────┘   │
└──────────────┼────────────────────────────────────── ┼ ──────────────────────┘
               │  HTTP/REST + WebSocket                │  IPC (contextBridge)
               ▼                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                             API TIER                                         │
│                                                                              │
│   ┌──────────────────────────────────────────────────────────────────────┐  │
│   │                    API Gateway  :3000                                 │  │
│   │    http-proxy-middleware  •  Rate limit 100/15min  •  CORS           │  │
│   │    path rewrite:  /api/<service>/* → /*  on upstream                 │  │
│   └──┬────────┬────────┬───────────┬────────────┬──────────┬────────────┘  │
└──────┼────────┼────────┼───────────┼────────────┼──────────┼───────────────┘
       │        │        │           │            │          │
       ▼        ▼        ▼           ▼            ▼          ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          SERVICE TIER                                        │
│                                                                              │
│  ┌──────────┐ ┌──────────────┐ ┌────────────┐ ┌──────────┐ ┌───────────┐  │
│  │  auth    │ │ marketplace  │ │ collection │ │processing│ │ packaging │  │
│  │  :3001   │ │  :3002       │ │  :8001     │ │  :8002   │ │  :8003    │  │
│  │ Node/    │ │ Node/        │ │ Python/    │ │ Python/  │ │ Python/   │  │
│  │ Express  │ │ Express +    │ │ FastAPI    │ │ FastAPI  │ │ FastAPI   │  │
│  │ Prisma   │ │ Prisma + ES  │ │            │ │ +RabbitMQ│ │           │  │
│  │          │ │ + Stripe     │ │            │ │          │ │           │  │
│  └──────────┘ └──────────────┘ └────────────┘ └──────────┘ └───────────┘  │
│                                                                              │
│  ┌──────────────────────────────────┐  ┌──────────────────────────────────┐ │
│  │  notification  :3003             │  │  streaming  :3004                │ │
│  │  Node/Socket.io + Redis adapter  │  │  Node/Express + LiveKit SDK      │ │
│  └──────────────────────────────────┘  └──────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
       │              │            │           │          │          │
       ▼              ▼            ▼           ▼          ▼          ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         INFRASTRUCTURE TIER                                  │
│                                                                              │
│  PostgreSQL:5432   Redis:6379   MinIO:9000   RabbitMQ:5672   ES:9200        │
│  ClickHouse:8123   LiveKit:7880   Zenoh:7447                                │
└─────────────────────────────────────────────────────────────────────────────┘

### ROS 2 Control Plane & Edge Agent

The collection-service embeds a **ROS 2-first control plane** (inspired by [SO-101 ROS Physical AI](https://github.com/legalaspro/so101-ros-physical-ai)) that bridges edge robots into the cloud backend. All ROS 2 communication flows through server-side **rclpy** — no native ROS 2 bindings are needed on web or Electron clients.

#### Architecture

```
  Edge Robot(s)                   Collection Service (:8001)           Clients
  ┌──────────────┐               ┌────────────────────────────┐       ┌──────────┐
  │ ros2_control │  DDS/Zenoh    │  ROS 2 Bridge Manager      │  WS   │ Web PWA  │
  │ joint_states ├──────────────►│  ┌──────────────────────┐  ├──────►│ Desktop  │
  │ /tf          │               │  │ rclpy executor       │  │       │ Electron │
  │ cameras      │◄──────────────┤  │ per robot_id         │  │       └──────────┘
  │ cmd_vel      │  actions      │  │ namespace: /robot/<id>│  │
  └──────────────┘               │  └──────────────────────┘  │
                                 │                            │
  ┌──────────────┐               │  ┌──────────────────────┐  │       ┌──────────┐
  │ Policy Server│  gRPC/ZMQ    │  │ Policy Relay         │  │       │ LiveKit  │
  │ (GPU cloud)  │◄────────────►│  │ obs→action pipeline  │  │       │ WebRTC   │
  │ ACT/SmolVLA  │               │  └──────────────────────┘  │       │ cameras  │
  │ π₀           │               │                            │       └──────────┘
  └──────────────┘               │  ┌──────────────────────┐  │
                                 │  │ Rosbag2 Recorder     │  │
                                 │  │ MCAP per session      │  │
                                 │  │ → LeRobot v3.0 conv. │  │
                                 │  └──────────────────────┘  │
                                 └────────────────────────────┘
```

#### Key Components

| Component | Description |
|---|---|
| **ROS 2 Bridge Manager** | Lifecycle-managed rclpy node per connected robot. Subscribes to `/robot/<id>/joint_states`, `/robot/<id>/tf`, camera compressed topics. Sends commands via `ros2_control` action clients (`forward_controller`, `trajectory_controller`). Reports DDS graph and QoS health. |
| **Leader/Follower Teleop** | SO-101-inspired dual-arm mirroring. Leader joint states → follower via `forward_controller`. Supports both local desktop daemon (direct serial/USB) and remote WebSocket relay as leader sources. |
| **Rosbag2 Recorder** | Per-session MCAP recording with configurable topic filters. Automatic metadata tagging (operator, task, embodiment). Server-side conversion to LeRobot v3.0 datasets via `rosbag_to_lerobot` pipeline. |
| **Policy Server Relay** | gRPC/ZMQ bridge for remote GPU inference. Forwards observations (camera frames + joint states) to external policy servers (ACT, SmolVLA, π₀) and relays predicted actions back to `ros2_control`. Mirrors SO-101 `policy_server` architecture. |
| **Fleet Management** | Robots addressable by `robot_id`, grouped into sessions. Namespace isolation (`/robot/<id>/...`) prevents TF collisions. Horizontal scaling via per-robot rclpy executors + HPA on collection-service pods. |
| **Rerun/RViz Bridge** | Optional Rerun visualization stream for 3D debugging — multi-camera feeds + TF tree + joint overlays. |

#### NormaCore-Aligned Plugin Architecture

The orchestration layer (gateway + collection-service) supports pluggable ops/monitoring modules (fleet config, observability dashboards, custom robot adapters) without changing client API contracts — matching the "unified toolkit for physical system development & operations" positioning from [NormaCore](https://normacore.dev/).
```

---
## 2. Monorepo Structure

```
robotforge/
├── apps/
│   ├── web/                     React PWA (Vite, TypeScript)
│   ├── desktop/                 Electron 30 (Vite, TypeScript)
│   └── backend/
│       ├── gateway/             Node/Express reverse proxy
│       ├── auth-service/        Node/Express + Prisma (schema=auth)
│       ├── marketplace-service/ Node/Express + Prisma (schema=marketplace)
│       ├── notification-service/Node + Socket.io
│       ├── streaming-service/   Node + LiveKit
│       ├── collection-service/  Python FastAPI + rclpy ROS 2 bridge
│       ├── processing-service/  Python FastAPI + ONNX + aio-pika
│       └── packaging-service/   Python FastAPI + LeRobot v3.0
├── packages/
│   ├── types/                   Shared TypeScript interfaces
│   ├── ui/                      React component library
│   ├── api-client/              Typed API SDK (for desktop)
│   └── robot-sdk/               RobotDriver interface + drivers
└── infra/
    └── docker-compose.yml       All infrastructure dependencies
```

**Build graph (Turborepo):** `types` → `ui`, `api-client`, `robot-sdk` → all apps. `dev` is persistent (never cached). `build`/`typecheck` depend on `^build` (dependency-first ordering).

**Root dev command:** `turbo dev --filter=!./apps/desktop --concurrency 15`

---

## 3. Web Application

**Stack:** React 18 · Vite · TypeScript · React Router v6 · TanStack Query · Zustand · Axios · Socket.io-client · Three.js (via `@robotforge/ui`)

### 3.1 Route Tree

```
/login                    Public — reads ?code= for OAuth token exchange
/register                 Public
/forgot-password          Public

[ProtectedRoute]
  [AppLayout — sidebar + topbar]
    /dashboard              DashboardPage
    /collect                CollectionPage
    /collect/:id            ActiveSessionPage      (operator | admin)
    /episodes               EpisodesPage
    /episodes/:id           EpisodeDetailPage
    /marketplace            MarketplacePage
    /marketplace/cart       CartPage               ← must be before /:id
    /marketplace/:id        DatasetDetailPage
    /datasets               MyDatasetsPage
    /datasets/new           CreateDatasetPage
    /settings               SettingsPage
    /settings/api-keys      ApiKeysPage
    /admin                  AdminPage              (admin only)
```

### 3.2 State Management

```
┌────────────────────────────────────────────────────────┐
│                     State Layers                        │
│                                                         │
│  Zustand (persisted — localStorage)                     │
│    authStore       user, accessToken, isAuthenticated   │
│    uiStore         sidebar, theme, notifications        │
│                                                         │
│  Zustand (in-memory)                                    │
│    collectionStore activeSessions, activeRobots         │
│                                                         │
│  TanStack Query (server state, staleTime: 30s)          │
│    all API data — datasets, episodes, jobs, cart...     │
│                                                         │
│  React Contexts                                         │
│    ThemeContext         dark/light/system, OS media     │
│    NotificationContext  toast queue, auto-dismiss 5s    │
│    WebSocketContext     single shared Socket.io conn    │
└────────────────────────────────────────────────────────┘
```

### 3.3 Authentication & API Flow

```
Every Axios request (interceptor):
  1. Read accessToken from authStore
  2. Attach  Authorization: Bearer <token>
  3. On 401 TOKEN_EXPIRED:
       POST /auth/refresh  (withCredentials: true — sends HttpOnly cookie)
       → new tokens received
       → retry original request
  4. On refresh failure:
       logout() + redirect /login

Access token:   localStorage (15 min TTL)
Refresh token:  HttpOnly cookie (path=/auth, sameSite=lax, 30d TTL)
```

### 3.4 Real-time (WebSocket)

- Single Socket.io connection → `notification-service :3003`
- Auth via `socket.handshake.auth.token`
- Reconnects on token change (max 10 attempts, 1s delay)
- `subscribe(event, handler)` returns unsubscribe function
- Namespaces: `/teleoperation`, `/collection`, `/processing`, `/marketplace`

---

## 4. Desktop Application

**Stack:** Electron 30 · Vite + vite-plugin-electron-renderer · TypeScript · better-sqlite3 · electron-updater

### 4.1 Process Architecture

```
┌──────────────────────────────────────────────────────────┐
│  Main Process (Node.js)                                   │
│                                                           │
│  ┌──────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │ robots.ipc   │  │  storage.ipc    │  │ daemon.ipc  │ │
│  │ discover     │  │  SQLite WAL     │  │ Collection  │ │
│  │ connect      │  │  episodes       │  │ Daemon      │ │
│  │ disconnect   │  │  sync_queue     │  │ setInterval │ │
│  │ sendCommand  │  │  get/delete     │  │ 20–1000Hz   │ │
│  │ getStatus    │  │  triggerSync    │  │ start/stop  │ │
│  └──────┬───────┘  └───────┬─────────┘  └──────┬──────┘ │
│         └──────────────────┴───────────────────┘          │
│                     contextBridge (preload.ts)             │
│                     window.electronAPI                     │
└──────────────────────────┬───────────────────────────────┘
                           │  IPC (contextIsolation: true)
┌──────────────────────────▼───────────────────────────────┐
│  Renderer Process (Chromium)                              │
│  React SPA — /collect · /session/:id · /episodes · /sync │
│  Uses window.electronAPI only (no direct Node access)     │
└──────────────────────────────────────────────────────────┘
```

### 4.2 IPC Channel Map

| Namespace | Channel | Direction | Description |
|---|---|---|---|
| `robots:*` | `discover` | R→M→R | List available robots |
| | `connect` | R→M→R | Connect to robot hardware |
| | `disconnect` | R→M | Disconnect robot |
| | `send-command` | R→M | Send motor command |
| | `get-status` | R→M→R | Battery level (clamped 0–100), status |
| `storage:*` | `get-episodes` | R→M→R | Query local SQLite with optional filters |
| | `get-episode` | R→M→R | Single episode by id |
| | `delete-episode` | R→M | Deletes HDF5 file + DB record |
| | `get-sync-queue` | R→M→R | Pending cloud sync items |
| | `trigger-sync` | R→M→R | Process queue (3 retries) → `SyncResult` |
| | `get-stats` | R→M→R | Episode count, pending sync, disk Mb |
| `daemon:*` | `start` | R→M | Start recording session |
| | `stop/pause/resume` | R→M | Control recording |
| | `start-episode` | R→M | Begin a new episode |
| | `stop-episode` | R→M | Finalize episode → JSON file |
| | `get-status` | R→M→R | Daemon state |
| | `telemetry` | M→R | Push telemetry frames (20Hz) |
| | `episode-complete` | M→R | Episode finalized with path |
| | `error` | M→R | Error notification |
| `window:*` | `minimize/maximize/close` | R→M | Window controls |
| `platform:*` | `storage-paths` | R→M→R | OS-specific data directories |
| | `gpu-info` | R→M→R | Detected GPUs |
| | `usb-devices` | R→M→R | Enumerated USB devices |
| | `disk-space` | R→M→R | Available bytes at path |
| | `capabilities` | R→M→R | Platform feature flags |

### 4.3 SQLite Schema (Local Storage)

```sql
CREATE TABLE episodes (
  id               TEXT PRIMARY KEY,
  session_id       TEXT,
  robot_id         TEXT,
  task             TEXT,
  embodiment       TEXT,
  status           TEXT,    -- recording|processing|packaged|listed|failed
  duration_ms      INTEGER,
  quality_score    REAL,
  sensor_modalities TEXT,   -- JSON array
  metadata         TEXT,    -- JSON object
  hdf5_path        TEXT,
  created_at       TEXT,
  synced_at        TEXT
);

CREATE TABLE sync_queue (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  episode_id  TEXT UNIQUE REFERENCES episodes(id),
  status      TEXT,         -- pending|syncing|synced|failed
  retries     INTEGER DEFAULT 0,
  last_error  TEXT,
  created_at  TEXT,
  updated_at  TEXT
);
```

### 4.4 Desktop Routes

```
[DesktopLayout]
  /             → redirect to /collect
  /collect      CollectPage
  /session/:id  SessionPage
  /episodes     EpisodesPage
  /episodes/:id EpisodeDetailPage
  /sync         SyncPage
  /settings     SettingsPage
```

### 4.5 Platform Adapters

`WindowsAdapter` · `MacOSAdapter` · `LinuxAdapter` — selected by `process.platform`.

Common interface: `enumerateUsbDevices()`, `detectGpus()`, `getAvailableDiskSpace(path)` (uses `execFile(['df', '-k', path])` — no shell injection), `getStoragePaths()`, `openInFileManager(path)`.

---

## 5. API Gateway

**Port:** 3000 · Node/Express · `http-proxy-middleware`

```
Incoming request
    ↓
Helmet (security headers)
    ↓
CORS (allowlist from CORS_ORIGIN env, credentials: true)
    ↓
Morgan (access logging)
    ↓
Rate Limiter (100 req / 15min / IP)
    ↓
GET /health  →  200 OK  (terminates here, not proxied)
    ↓
Proxy router:
  /api/auth/*          strip /api/auth          →  auth-service    :3001
  /api/marketplace/*   strip /api/marketplace   →  marketplace     :3002
  /api/collection/*    strip /api/collection    →  collection      :8001
  /api/processing/*    strip /api/processing    →  processing      :8002
  /api/packaging/*     strip /api/packaging     →  packaging       :8003
  /api/notifications/* strip /api/notifications →  notification    :3003
  /api/streams/*       strip /api/streams       →  streaming       :3004
    ↓
404 catch-all
```

All upstream URLs configurable via env vars (`AUTH_SERVICE_URL`, etc.). On upstream error → 502 `{ error: "Bad Gateway", detail: "..." }`.

---

## 6. Auth Service

**Port:** 3001 · Node/Express · Prisma · PostgreSQL (`?schema=auth`) · jsonwebtoken · bcrypt · Passport.js

### 6.1 Endpoint Map

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/register` | Public | Create account → `{data: {user, tokens}}` |
| POST | `/login` | Public | Password auth → `{data: {user, tokens}}` |
| POST | `/refresh` | Public | Rotate refresh token (cookie OR body) |
| DELETE | `/logout` | Required | Revoke token + clear cookie |
| GET | `/me` | Required | Current user + apiKeys |
| GET | `/keys` | Required | List API keys |
| POST | `/keys` | Required | Create API key (`rf_<32hex>`) |
| DELETE | `/keys/:id` | Required | Revoke API key |
| PATCH | `/profile` | Required | Update name |
| DELETE | `/account` | Required | Delete account |
| GET | `/oauth/github` | Public | Start GitHub OAuth |
| GET | `/oauth/github/callback` | — | Redirect to `/login?code=<64hex>` |
| GET | `/oauth/google` | Public | Start Google OAuth |
| GET | `/oauth/google/callback` | — | Redirect to `/login?code=<64hex>` |
| POST | `/oauth/exchange` | Public | Exchange auth code → `{data: {tokens, user}}` |
| POST | `/forgot-password` | Public | Always 200 (no enumeration) |
| POST | `/reset-password` | Public | Verify token → new password + revoke all refresh tokens |

### 6.2 Token Lifecycle

```
Register / Login
  → bcrypt.hash(password, 12)
  → accessToken  = JWT(payload, JWT_SECRET, expiresIn: '15m')
  → refreshToken = JWT({sub}, JWT_REFRESH_SECRET, expiresIn: '30d')
  → store refreshToken hash in DB
  → set httpOnly cookie (path=/auth, sameSite: lax)
  → return { accessToken, refreshToken, expiresIn: 900 }

Refresh
  → verify refreshToken JWT
  → lookup in DB (not revoked)
  → revoke old token (rotation)
  → issue new token pair

OAuth
  → find or create user by email
  → generate token pair
  → store short-lived code in Map<code, {tokens, userId, expiresAt}> (60s)
  → redirect frontend to /login?code=<code>
  → frontend POSTs /oauth/exchange → receives tokens
  ⚠ In-memory Map — needs Redis for multi-replica deployments
```

### 6.3 Database Schema (`schema=auth`)

```
User
  id(uuid)  email(unique)  passwordHash  name
  role: developer | operator | enterprise | admin
  tier: starter | professional | enterprise

RefreshToken
  userId → User(Cascade)  token(unique)  expiresAt  revokedAt?
  @@index([userId])  @@index([token])

ApiKey
  userId → User(Cascade)  name  keyHash(unique)  prefix
  scopes[]  rateLimit(1000)  ipAllowlist[]  lastUsedAt?  expiresAt?
  @@index([userId])  @@index([keyHash])

PasswordResetToken
  userId → User(Cascade)  tokenHash(unique)  expiresAt  usedAt?
  @@index([userId])  @@index([tokenHash])
```

---

## 7. Marketplace Service

**Port:** 3002 · Node/Express · Prisma · PostgreSQL (`?schema=marketplace`) · Elasticsearch · Stripe

### 7.1 Endpoint Map

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/datasets` | Public | Search/filter (ES or Prisma fallback) |
| POST | `/datasets` | Required | Create + ES index + record provenance |
| GET | `/datasets/mine` | Required | Owner's datasets (all access levels) |
| GET | `/datasets/:id` | Optional | Private datasets → 403 unless owner |
| POST | `/datasets/:id/purchase` | Required | Free: create purchase / Paid: Stripe checkout |
| GET | `/datasets/:id/download` | Required | Purchase-gated presigned S3 URL |
| POST | `/datasets/:id/reviews` | Required | 1 review/user; paid requires purchase |
| GET | `/cart` | Required | Cart items with dataset details |
| POST | `/cart` | Required | Add `{datasetId}` (upsert) |
| DELETE | `/cart/:datasetId` | Required | Remove item |
| GET | `/marketplace/featured` | Public | qualityScore ≥ 80, by downloads, limit 8 |
| GET | `/marketplace/trending` | Public | Updated < 7d, by downloads, limit 10 |
| POST | `/webhooks/stripe` | Stripe-sig | `checkout.completed` / `payment_intent.failed` |

### 7.2 Dataset Search Flow

```
GET /datasets?q=bin+picking&task=manipulation&minQuality=80

if q present:
  → Elasticsearch full-text (name + description + tags)
  → filter: accessLevel: 'public'
  → fallback to Prisma on ES failure
else:
  → Prisma WHERE { accessLevel:'public', task?, minQuality? }
  → ORDER BY newest | downloads | quality | price
  → SKIP/TAKE pagination
```

### 7.3 Purchase & Payment Flow

```
Free dataset:
  POST /datasets/:id/purchase
  → check not already purchased (409 if duplicate)
  → Purchase.create(status: 'completed', amount: 0)
  → Dataset.update(downloads++)
  → return download URL

Paid dataset:
  POST /datasets/:id/purchase
  → Stripe.checkout.sessions.create({ metadata: {datasetId, userId} })
  → return { checkoutUrl }

Stripe webhook checkout.session.completed:
  → prisma.$transaction([
      purchases.create(status: 'completed'),
      datasets.update(downloads++)
    ])
  → recordProvenance('downloaded')

Stripe webhook payment_intent.payment_failed:
  → sessions.list({payment_intent: id}) → get metadata
  → purchase.upsert(status: 'failed')
```

### 7.4 Database Schema (`schema=marketplace`)

```
Dataset
  id(uuid)  name  description  ownerId  task  embodiments[]
  episodeCount  totalDurationHours  sizeGb  qualityScore
  format  pricingTier  pricePerEpisode?  tags[]
  downloads  rating  accessLevel  licenseType  storageUrl?
  @@index([ownerId, task, pricingTier, accessLevel, qualityScore, downloads, updatedAt])

Review
  id  datasetId → Dataset(Cascade)  userId  userName  rating(1–5)  comment
  @@unique([datasetId, userId])
  @@index([datasetId])

Purchase
  id  userId  datasetId → Dataset(Cascade)  amount(cents)  currency
  stripePaymentId?(unique)  status(pending|completed|refunded)
  @@index([userId, datasetId])

CartItem
  id  userId  datasetId → Dataset(Cascade)  addedAt
  @@unique([userId, datasetId])
  @@index([userId])

ProvenanceEvent
  id  datasetId → Dataset(Cascade)  actor  action  details(Json)?
  parentId? → ProvenanceEvent    (DAG lineage via self-referential relation)
  @@index([datasetId, actor])
```

---

## 8. Collection Service

**Port:** 8001 · Python FastAPI · rclpy · ros2_control · PyJWT · `python-dotenv` · CORS · In-memory state (dev) / Redis+TimescaleDB (prod)

### 8.1 Endpoint Map

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/sessions` | Required | Create session `{task, mode, robot_ids[], target_episodes?}` |
| GET | `/sessions` | Required | List (filtered to current user) |
| GET | `/sessions/:id` | Required | Owner-only |
| POST | `/sessions/:id/start` | Required | → status: `recording` |
| POST | `/sessions/:id/stop` | Required | → status: `processing` |
| POST | `/sessions/:id/pause` | Required | → status: `paused` |
| POST | `/robots/connect` | Required | `{name, embodiment, connection_type, ip_address, port?}` |
| POST | `/robots/:id/disconnect` | Required | Remove from registry |
| GET | `/robots/:id/telemetry` | Required | Snapshot telemetry |
| GET | `/robots` | Required | All connected robots |
| POST | `/episodes` | Required | Create + start (`?session_id&robot_id&task`) |
| GET | `/episodes` | Required | User's episodes; `?session_id=` filter |
| GET | `/episodes/:id` | Required | Owner-only |
| POST | `/episodes/:id/stop` | Required | → status: `processing` |
| GET | `/fleet/status` | Required | Fleet-wide status (all robots, namespaces, DDS graph) |
| GET | `/fleet/robots` | Required | All fleet robots with ROS 2 node health |
| POST | `/fleet/robots/:id/namespace` | Required | Assign robot to ROS 2 namespace |
| POST | `/recording/start` | Required | Start rosbag2 MCAP recording for session |
| POST | `/recording/stop` | Required | Stop recording, return bag metadata |
| GET | `/recording/:id` | Required | Recording status + MCAP file info |
| POST | `/recording/:id/convert` | Required | Convert rosbag2 → LeRobot v3.0 dataset |
| POST | `/policy/connect` | Required | Connect to remote policy server (gRPC/ZMQ) |
| POST | `/policy/disconnect` | Required | Disconnect policy server |
| POST | `/policy/infer` | Required | Send observation, receive action |
| GET | `/policy/status` | Required | Policy server connection health |
| GET | `/dashboard/kpis` | Required | `{totalEpisodes, weeklyGrowth, storageUsedGb, storageQuotaGb, activeRobots, avgQuality}` |
| GET | `/dashboard/activity` | Required | Recent episodes + sessions (top 10) |
| GET | `/dashboard/efficiency` | Required | 14-day daily quality averages |
| WS | `/ws/session/{id}?token=` | JWT query param | 20-50Hz telemetry stream (from rclpy bridge) |
| GET | `/health` | Public | — |

### 8.2 In-Memory State

> ⚠ Dev only — service restart clears all data. Needs Redis/DB persistence for production.

```python
_sessions: dict[str, CollectionSession] = {}   # routers/sessions.py
_robots:   dict[str, ConnectedRobot]    = {}   # routers/robots.py
_episodes: dict[str, Episode]           = {}   # routers/episodes.py
```

### 8.3 WebSocket Telemetry Frame (20-50Hz)

```json
{
  "robotId": "robot_<session[:8]>",
  "timestamp": 1710000000000,
  "jointPositions":  [0.0, 0.1, 0.2, 0.3, 0.4, 0.5],
  "jointVelocities": [0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  "jointTorques":    [0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  "endEffectorPose": { "x": 0.5, "y": 0.0, "z": 0.3,
                       "rx": 0.0, "ry": 0.0, "rz": 0.0 },
  "gripperPosition": 0.5,
  "ros2": {
    "controllerState": "active",
    "ddsConnected": true,
    "topicHz": { "joint_states": 50.0, "camera/color": 30.0 },
    "namespace": "/robot/abc12345"
  }
}
```

### 8.4 ROS 2 Bridge Integration

```
Robot hardware (DDS/Zenoh)
    ↓
rclpy node (per robot_id, namespaced /robot/<id>/)
    ├─── subscribes: /joint_states, /tf, /camera/color/compressed
    ├─── action client: /forward_position_controller, /joint_trajectory_controller
    ├─── health: DDS graph monitor, QoS mismatch detection
    ↓
WebSocket fan-out (20-50Hz frames to connected clients)
    ↓
Rosbag2 recorder (MCAP storage, session-scoped)
    ↓
Policy relay (optional: gRPC/ZMQ → remote GPU → actions back to ros2_control)
```

**Leader/Follower Teleop Flow (SO-101 pattern):**
1. Leader arm publishes `/leader/joint_states` (via desktop daemon serial or ROS 2 topic)
2. Collection-service rclpy node receives leader positions
3. Maps leader joints → follower joints (configurable mapping table)
4. Sends to `/follower/forward_position_controller/commands` action
5. Records both leader and follower streams in rosbag2 MCAP

**Policy Server Relay Flow:**
1. Client sends `POST /policy/connect` with policy server address + model name
2. Bridge opens gRPC/ZMQ channel to remote policy server
3. On each telemetry cycle: packages camera frame + joint state as observation
4. Sends observation → policy server → receives action tensor
5. Converts action to `ros2_control` command → publishes to robot
6. Latency target: <100ms round-trip for real-time control

---

## 9. Processing Service

**Port:** 8002 · Python FastAPI · PyJWT · aio-pika · `python-dotenv` · `.venv` (Python 3.12)

### 9.1 Endpoint Map

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/jobs/` | Required | Create job `{episode_id, pipeline_steps[], priority(0–10)}` → RabbitMQ |
| GET | `/jobs/` | Required | List user's jobs; `?status=` filter |
| GET | `/jobs/:id` | Required | Owner-only |
| POST | `/jobs/:id/cancel` | Required | → status: `cancelled` |
| GET | `/jobs/:id/report` | Required | `QualityReport` for completed jobs |
| POST | `/pipeline/run/:episode_id` | Required | Run full 5-step pipeline synchronously |
| GET | `/pipeline/steps` | Required | Available steps + descriptions |
| POST | `/pipeline/quality-score` | Required | Score raw telemetry `{data: [[...]]}` |
| GET | `/health` | Public | — |

### 9.2 5-Step Pipeline

```
episode_id
    ↓
[1] frame_filtering    detect blurry / redundant frames
    ↓
[2] compression        zstd / blosc HDF5 compression
    ↓
[3] annotation         auto-label action segments + grasp events
    ↓
[4] quality_scoring    smoothness, completeness, coverage, anomaly
    ↓
[5] packaging          emit target format (HDF5 / RLDS / LeRobot / Parquet)
    ↓
ProcessingJob { status: completed, qualityScore: 0–100 }
```

### 9.3 RabbitMQ Integration

```
POST /jobs/ → publish to queue 'processing_tasks' (durable, prefetch: 5)
           → if RabbitMQ unavailable: job saved in-memory + warning logged
           → graceful degradation: service continues without queue
```

---

## 10. Packaging Service

**Port:** 8003 · Python FastAPI · PyJWT · `python-dotenv` · CORS

### 10.1 Endpoint Map

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/formats/` | Required | List 6 supported formats |
| GET | `/formats/:name` | Required | Format details + compression ratio |
| POST | `/export/` | Required | Create export `{dataset_id, format, episode_ids[], include_raw_video, compression_level(0–9)}` |
| GET | `/export/:id` | Required | Export job status |
| GET | `/export/:id/download` | Required | Presigned S3 URL (3600s TTL) |
| GET | `/health` | Public | — |

### 10.2 Supported Export Formats

| Format | Compression | Compatible With |
|---|---|---|
| `hdf5` | 55% | robomimic, ACT, ALOHA |
| `rlds` | 60% | OpenVLA, Octo, RT-X (TensorFlow/JAX) |
| `lerobot` | 50% | HuggingFace LeRobot, SmolVLA |
| `huggingface` | 45% | Direct HF Hub push |
| `parquet` | 35% | Analytics, Mosaico-compatible |
| `raw` | 90% | No compression, debugging |

---

## 11. Notification Service

**Port:** 3003 · Node · Socket.io · Redis adapter (`@socket.io/redis-adapter`) · JWT

### 11.1 Socket.io Namespace / Event Map

All connections require JWT in `socket.handshake.auth.token` or `socket.handshake.query.token`. Users are joined to their `userId` room for targeted delivery.

| Namespace | Event | Direction | Description |
|---|---|---|---|
| `/teleoperation` | `robot:command` | C→S→room | Relay motor command |
| | `robot:state` | C→S→room | 50Hz robot state feedback |
| | `robot:emergency_stop` | C→S→room | Broadcast to entire user room |
| `/collection` | `episode:started` | C→S→room | Episode recording began |
| | `episode:complete` | C→S→room | Episode finalized |
| | `session:update` | C→S→room | Session status change |
| `/processing` | `job:progress` | C→S→room | Pipeline step progress |
| | `job:complete` | C→S→room | Job complete with result |
| | `job:failed` | C→S→room | Job failed with error |
| `/marketplace` | `purchase:confirmed` | C→S→room | Purchase completed |

### 11.2 Internal REST (`x-internal-secret` header)

| Method | Path | Description |
|---|---|---|
| POST | `/notify` | `{userId?, channel, event, data}` — push to socket room |
| GET | `/connections` | Connection counts per namespace |
| GET | `/health` | Public |

---

## 12. Streaming Service

**Port:** 3004 · Node/Express · LiveKit Server SDK · JWT auth

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/streams/rooms` | Required | Create LiveKit room (maxParticipants: 10, emptyTimeout: 300s) |
| GET | `/streams/rooms` | Required | List active rooms |
| DELETE | `/streams/rooms/:name` | Required | Delete room |
| GET | `/streams/token` | Required | Generate participant JWT (6h TTL) with `roomJoin`, `canPublish`, `canSubscribe`, `canPublishData` grants |
| GET | `/health` | Public | — |

> ⚠ No room authorization — any authenticated user can join any room.

---

## 13. Shared Packages

### 13.1 `@robotforge/types`

Central type authority. All services and clients import from here.

```typescript
// Auth
User             { id, email, name, role: UserRole, tier: UserTier, apiKeys: ApiKey[] }
UserRole         'operator' | 'developer' | 'enterprise' | 'admin'
UserTier         'starter' | 'professional' | 'enterprise'
ApiScope         'read:datasets' | 'write:episodes' | 'stream:teleoperation' | 'admin:platform'
AuthTokens       { accessToken, refreshToken, expiresIn }
JwtPayload       { sub, email, name, role, tier, iat, exp }

// Robot & Telemetry
RobotEmbodiment  ur5 | ur10 | franka_panda | xarm6 | xarm7 | unitree_h1 |
                 unitree_g1 | figure01 | agility_digit | boston_dynamics_spot |
                 clearpath_husky | custom
RobotTask        bin_picking | assembly | packing | palletizing | navigation |
                 inspection | surgical | manipulation | whole_body_loco | custom
SensorModality   rgb_camera | depth_camera | wrist_camera | joint_positions |
                 joint_velocities | joint_torques | end_effector_pose | gripper_state |
                 force_torque | lidar | imu | tactile

// ⚠ Pose6D uses EULER angles — NO rw quaternion field
Pose6D           { x, y, z (meters), rx, ry, rz (radians) }
ForceTorque      { fx, fy, fz (N), tx, ty, tz (Nm) }
RobotTelemetry   { robotId, timestamp, jointPositions[], jointVelocities[],
                   jointTorques[], endEffectorPose: Pose6D, gripperPosition(0–1), forceTorque? }

// Collection
CollectionSession { id, operatorId, robots[], status, mode, episodeCount, startedAt }
SessionStatus     'idle' | 'recording' | 'paused' | 'processing'
SessionMode       'manual' | 'ai_assisted'
ConnectedRobot    { id, name, embodiment, connectionType, ipAddress, status, batteryLevel?, cameras[] }

// Episodes & Datasets
Episode          { id, sessionId, robotId, embodiment, task, durationMs, frameCount,
                   qualityScore(0–100), status, sensorModalities, storageUrl?, thumbnailUrl?,
                   metadata, createdAt }
Dataset          { id, name, description, ownerId, task, embodiments[], episodeCount,
                   totalDurationHours, sizeGb, qualityScore, format, pricingTier,
                   pricePerEpisode?, tags[], downloads, rating, sampleEpisodes[],
                   accessLevel, licenseType, createdAt, updatedAt }

// API
ApiResponse<T>   { data: T, meta?: PaginationMeta }
PaginationMeta   { page, limit, total, totalPages }
ApiError         { code, message, details?: Record<string, string[]> }

// ⚠ SyncResult exact shape required by storage.ipc.ts
SyncResult       { syncedCount: number, failedCount: number, errors: string[] }
```

### 13.2 `@robotforge/ui`

React component library with Tailwind styling.

| Component | Key Details |
|---|---|
| `RobotViewer` | Three.js/React Three Fiber; `useMemo` deps: `[jointCount, showLabels, telemetryForLabels]` |
| `TeleoperationPanel` | `liveQualityScore` prop; `isPaused` → "Resume Recording" label; `onAiAssistChange` callback |
| `TelemetryChart` | `modalitiesKey` (joined string) for stable memo deps; exports `TelemetryDataPoint` |
| `EpisodePlayer` | `reachedEndRef` guards side effects outside state updater |
| `EpisodeTable` | Empty state checks on filtered rows |
| `DatasetCard` | `sampleEpisodes?.[0]?.thumbnailUrl` null-safe |

### 13.3 `@robotforge/api-client`

Typed SDK for Electron renderer. Key correctness notes:
- `login/register` → `setTokens(data.data.tokens)` (not `data.data`)
- `refreshToken()` → returns `data.data.tokens` (not `data.data`)
- Auto-refresh interceptor on 401

### 13.4 `@robotforge/robot-sdk`

```typescript
// Hardware driver abstraction
interface RobotDriver {
  connect(): Promise<void>
  disconnect(): Promise<void>
  sendCommand(cmd: RobotCommand): Promise<void>
  getTelemetry(): Promise<TelemetryFrame>
  getStatus(): RobotDriverStatus
  onTelemetry(cb: (frame: TelemetryFrame) => void): () => void
}

// Implementations
MockRobotDriver      — sinusoidal telemetry, 150ms connect latency
WebSocketRobotDriver — ws[s]://ipAddress:port, JSON TelemetryFrame
ROS2RobotDriver      — connects to collection-service ROS 2 bridge via WebSocket
                       subscribes to /robot/<id>/joint_states topic relay
                       supports ros2_control commands, fleet status, policy server relay

// Factory
createRobotDriver(type: 'mock' | 'websocket' | 'ros2', config, sampleRateHz) → RobotDriver

// Constants
ROBOT_TIMEOUT_MS = 5000
DEFAULT_SAMPLE_RATE_HZ = 50
```

---

## 14. Infrastructure

| Service | Image | Ports | Role |
|---|---|---|---|
| PostgreSQL | `timescale/timescaledb:latest-pg16` | 5432 | Relational metadata (auth + marketplace schemas) |
| Redis | `redis:7-alpine` | 6379 | Socket.io adapter, OAuth code store, session cache |
| MinIO | `minio/minio:latest` | 9000 / 9001 | S3-compatible object store (HDF5, packaged datasets, MCAP bags) |
| RabbitMQ | `rabbitmq:3-management` | 5672 / 15672 | Processing job queue (`processing_tasks`, durable) |
| Elasticsearch | `elasticsearch:8.11.0` | 9200 | Full-text dataset search |
| Kibana | `kibana:8.11.0` | 5601 | ES visualization |
| Logstash | `logstash:8.11.0` | 5044 / 9600 | Log aggregation (ELK stack) |
| ClickHouse | `clickhouse-server:latest` | 8123 / 19000 | Telemetry time-series analytics |
| LiveKit | `livekit/livekit-server:latest` | 7880 / 7881 / 7882 UDP | WebRTC robot camera streaming |
| Zenoh Router | `eclipse/zenoh:latest` | 7447 / 8000 | ROS 2 DDS bridge — relays robot topics between edge DDS network and cloud collection-service. Enables robots on separate subnets to reach the rclpy bridge without multicast. |

All services have Docker healthchecks. All data persisted via named volumes.

---

## 15. Cross-Cutting Concerns

### 15.1 Authentication Chain (end-to-end)

```
Browser                 Gateway              Service
  │                        │                    │
  ├─ POST /api/auth/login ─►│                    │
  │                        ├─ strip /api/auth → ►│ auth-service
  │                        │                    ├─ bcrypt.compare()
  │◄─ {data:{tokens,user}} ◄┤◄─ {data:{tokens}} ─┤
  │                        │                    │
  ├─ GET /api/collection/robots ───────────────►│
  │  Authorization: Bearer <accessToken>        │ collection-service
  │                        │                    ├─ HTTPBearer → PyJWT decode
  │                        │                    ├─ JWT_SECRET from .env
  │◄─ {data:[]} ───────────◄┤◄──────────────────  ┤
  │                        │                    │
  ├─ Socket.io connect ─────────────────────────►│ notification-service
  │  auth.token = accessToken                   ├─ socketAuthMiddleware
  │◄─ connected ────────────────────────────────  ┤
```

**Shared JWT secret:** `JWT_SECRET` must be identical across `auth-service`, `collection-service`, `processing-service`, `packaging-service`. Loaded via `load_dotenv()` in each Python `deps.py`.

**Service–service auth:** `x-internal-secret` header (notification REST endpoints only).

### 15.2 API Response Envelope

All Node services return:
```json
{ "data": <T>, "meta": { "page": 1, "limit": 20, "total": 100, "totalPages": 5 } }
```

All Python services (FastAPI) return the same envelope via `{"data": ...}` wrappers.

**Error response:**
```json
{ "code": "VALIDATION_ERROR", "message": "...", "details": { "field": ["message"] } }
```

### 15.3 PostgreSQL Schema Isolation

```
auth-service:
  DATABASE_URL=postgresql://user:pass@localhost:5432/robotforge?schema=auth

marketplace-service:
  DATABASE_URL=postgresql://user:pass@localhost:5432/robotforge?schema=marketplace
```

- Two schemas, one database — schemas are fully independent
- Each service has `output = "../src/generated/prisma"` in `schema.prisma`
- Each service imports from `'../generated/prisma'` (not `'@prisma/client'`)
- Run `npx prisma db push --skip-generate` from each service directory separately

### 15.4 Environment Variables (critical)

| Variable | Used By | Notes |
|---|---|---|
| `JWT_SECRET` | auth, collection, processing, packaging | Must match across all 4 services |
| `JWT_REFRESH_SECRET` | auth only | Separate from JWT_SECRET |
| `DATABASE_URL` | auth, marketplace | Must include `?schema=` |
| `CORS_ORIGIN` | all services | `http://localhost:5173` in dev |
| `INTERNAL_SECRET` | notification | Service-to-service auth header |
| `RABBITMQ_URL` | processing | `amqp://robotforge:pass@localhost:5672` |
| `STRIPE_SECRET_KEY` | marketplace | Required in production (warns in dev) |
| `STRIPE_WEBHOOK_SECRET` | marketplace | Required for webhook verification |
| `VITE_API_URL` | web | `http://localhost:3000/api` |
| `VITE_WS_URL` | web | `http://localhost:3003` (notification direct — not via gateway) |

---

## 16. Data Flow: Full Episode Lifecycle

```
1. CONNECT ROBOT
   Web/Desktop → POST /api/collection/robots/connect
              → ConnectedRobot stored in _robots{}

2. START SESSION
   Web/Desktop → POST /api/collection/sessions
              → CollectionSession stored in _sessions{}

3. RECORD EPISODE
   Web/Desktop → WS /ws/session/:id?token=<jwt>
              ← 20Hz telemetry frames (joint positions, end-effector pose, gripper)
              → POST /api/collection/episodes  (start recording)
   Desktop    → daemon.ipc accumulates frames → HDF5 file

4. STOP EPISODE
   → POST /api/collection/episodes/:id/stop
   → status: processing

5. SUBMIT FOR PROCESSING
   → POST /api/processing/jobs/
         { episode_id, pipeline_steps: [frame_filtering, compression,
                                        annotation, quality_scoring, packaging] }
   → Job published to RabbitMQ 'processing_tasks'
   ← Socket.io /processing : job:progress (per step)
   ← Socket.io /processing : job:complete (with qualityScore)

6. EXPORT DATASET
   → POST /api/packaging/export/
         { dataset_id, format: 'lerobot', episode_ids: [...] }
   → GET  /api/packaging/export/:id/download
   ← Presigned MinIO URL (3600s TTL)

7. PUBLISH TO MARKETPLACE
   → POST /api/marketplace/datasets
         { name, task, format, pricingTier, accessLevel: 'public', ... }
   → Indexed to Elasticsearch
   → Provenance event 'created' recorded

8. PURCHASE
   → POST /api/marketplace/datasets/:id/purchase
   → Stripe Checkout Session created (paid) or direct (free)
   ← Stripe webhook checkout.session.completed
   → Purchase record created, downloads++
   ← Socket.io /marketplace : purchase:confirmed
   → GET /api/marketplace/datasets/:id/download → presigned URL
```

---

## 17. Known Architectural Gaps

| Gap | Impact | Recommended Fix |
|---|---|---|
| OAuth auth codes in in-memory `Map` | Won't work with multiple auth-service replicas | Move to Redis with 60s TTL |
| Collection/processing/packaging state in-memory dicts | Service restart loses all sessions/episodes | Add TimescaleDB or SQLite persistence |
| `accessToken` in `localStorage` | XSS-accessible | Accept as tradeoff OR use memory-only with silent refresh |
| Streaming service: no room authorization | Any authenticated user joins any room | Check room ownership against collection sessions |
| Processing pipeline steps are mock stubs | `quality_scoring` outputs nothing real | Integrate `forge` library — `pip install forge`, call `QualityAnalyzer` |
| Python services use `guest:guest` for RabbitMQ | Auth failures if RabbitMQ enforces credentials | Set `RABBITMQ_URL` in collection-service and packaging-service `.env` |
| No production Docker config | All services run in dev/reload mode only | Add `Dockerfile` per service + production compose |
| ClickHouse provisioned but never written to | Telemetry analytics non-functional | Wire collection WebSocket frames → ClickHouse ingest |
| `/admin/stats` and `/admin/activity` not implemented | Admin page shows no real data | Implement Prisma aggregation queries across both schemas |
| Elasticsearch not seeded | Marketplace search returns empty on fresh install | Add seed script or populate on first dataset creation |
| ROS 2 bridge is mock in dev | No real `rclpy` without ROS 2 installed | Graceful fallback to mock telemetry; production requires ROS 2 Jazzy + rclpy |
| Zenoh router not in Docker Compose | DDS bridge not available for remote robots | Add `eclipse/zenoh:latest` to `docker-compose.yml` |
| Policy relay requires external GPU server | No local policy inference capability | Support optional local ONNX policy fallback in collection-service |
| Rosbag2 MCAP storage not integrated with MinIO | Recordings stored only locally | Add MinIO upload on recording stop + metadata index in TimescaleDB |
