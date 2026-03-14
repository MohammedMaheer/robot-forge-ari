<div align="center">

# ROBOTFORGE

**The open platform for robot teleoperation data collection, processing, and distribution.**

Built by [Acceleration Robotics](https://accelerationrobotics.com)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?logo=python&logoColor=white)](https://python.org)
[![pnpm](https://img.shields.io/badge/pnpm-10+-F69220?logo=pnpm&logoColor=white)](https://pnpm.io)
[![Turborepo](https://img.shields.io/badge/Turborepo-2.x-EF4444?logo=turborepo&logoColor=white)](https://turbo.build)
[![Electron](https://img.shields.io/badge/Electron-30-47848F?logo=electron&logoColor=white)](https://electronjs.org)

---

ROBOTFORGE is a full-stack monorepo platform that enables robotics teams to **record, process, annotate, score, package, and distribute** teleoperation episodes at scale. It pairs a cross-platform desktop app for on-robot data collection with a cloud microservice backend for processing pipelines and a marketplace for sharing datasets.

</div>

---

## Table of Contents

- [Features](#features)
- [Architecture Overview](#architecture-overview)
- [Repository Structure](#repository-structure)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [Infrastructure Services](#infrastructure-services)
- [Running the Platform](#running-the-platform)
- [Individual Services](#individual-services)
- [Desktop App](#desktop-app)
- [Web Application](#web-application)
- [API Reference](#api-reference)
- [Tech Stack](#tech-stack)
- [Production Deployment](#production-deployment)
- [Contributing](#contributing)
- [Developer](#developer)

---

## Features

- **Desktop Data Collection** — Electron 30 app with a sandboxed renderer, real-time robot telemetry visualization, local SQLite episode storage, and automatic sync queuing
- **Processing Pipeline** — 5-stage automated pipeline: frame filtering → compression (Zstandard) → ONNX action annotation → quality scoring → HDF5/Open X-Embodiment packaging
- **Quality Scoring** — Multi-factor scoring (trajectory smoothness, task completeness, workspace coverage, anomaly detection) with per-episode recommendations
- **Dataset Marketplace** — Upload, search (Elasticsearch), purchase (Stripe), and download robot datasets with full provenance tracking
- **Real-time Streaming** — LiveKit-based video + telemetry streaming during collection sessions
- **OAuth & JWT Auth** — GitHub and Google OAuth, bcrypt password auth, 15-minute access tokens with 30-day HttpOnly refresh tokens
- **Live Notifications** — Socket.io with Redis adapter for horizontally-scalable push events
- **Cloud-native Infrastructure** — Dockerized services, Helm chart, Kubernetes manifests, and Terraform for AWS (EKS, Aurora, ElastiCache, S3)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                   CLIENT LAYER                      │
│  ┌─────────────────┐      ┌───────────────────┐     │
│  │   Web App (PWA) │      │  Desktop App      │     │
│  │  React 18 + Vite│      │  Electron 30      │     │
│  │  :5173          │      │  SQLite + Daemon  │     │
│  └────────┬────────┘      └────────┬──────────┘     │
└───────────┼─────────────────────────┼───────────────┘
            │                         │
            ▼                         ▼
┌─────────────────────────────────────────────────────┐
│               API GATEWAY  :3000                    │
│         (Express + http-proxy-middleware)            │
└──┬──────┬──────┬───────┬──────────┬────────────────┘
   │      │      │       │          │
   ▼      ▼      ▼       ▼          ▼
┌──────┐ ┌────┐ ┌──────┐ ┌────────┐ ┌────────────────┐
│ Auth │ │Mkt │ │Notif.│ │Stream. │ │Python Services │
│:3001 │ │:3002│ │:3003 │ │:3004   │ │ Collection :8001│
│      │ │    │ │      │ │        │ │ Processing :8002│
│Prisma│ │ES  │ │Redis │ │LiveKit │ │ Packaging  :8003│
│+JWT  │ │    │ │Adapt.│ │        │ │                │
└──────┘ └────┘ └──────┘ └────────┘ └────────────────┘
            │
┌───────────┼──────────────────────────────────────────┐
│           INFRASTRUCTURE                             │
│  PostgreSQL │ Redis │ RabbitMQ │ MinIO │ Elasticsearch│
└─────────────────────────────────────────────────────┘
```

---

## Repository Structure

```
robotforge/
├── apps/
│   ├── web/                        # React 18 PWA (Vite + TypeScript)
│   ├── desktop/                    # Electron 30 desktop app
│   │   └── electron/
│   │       ├── main.ts             # Main process, CSP, auto-updater
│   │       ├── preload.ts          # Sandboxed contextBridge API
│   │       ├── daemon/             # Collection daemon
│   │       ├── ipc/                # IPC handler modules
│   │       └── adapters/           # Platform adapters (win/mac/linux)
│   └── backend/
│       ├── gateway/                # API gateway → port 3000
│       ├── auth-service/           # JWT + OAuth → port 3001
│       ├── marketplace-service/    # Datasets + Stripe → port 3002
│       ├── notification-service/   # Socket.io → port 3003
│       ├── streaming-service/      # LiveKit → port 3004
│       ├── collection-service/     # Python/FastAPI → port 8001
│       ├── processing-service/     # Python/FastAPI + ONNX → port 8002
│       └── packaging-service/      # Python/FastAPI + HDF5 → port 8003
├── packages/
│   ├── types/                      # Shared TypeScript types
│   ├── ui/                         # Shared React component library (Tailwind)
│   ├── utils/                      # Shared utilities
│   ├── api-client/                 # Typed Axios API client
│   └── robot-sdk/                  # Robot connection SDK
├── infra/
│   ├── docker-compose.yml          # Local infrastructure containers
│   ├── helm/robotforge/            # Helm chart
│   ├── k8s/                        # Kubernetes manifests
│   └── terraform/                  # AWS IaC (EKS, Aurora, ElastiCache, S3)
├── docs/
│   └── openapi.yaml                # OpenAPI 3.1.0 specification
├── turbo.json                      # Turborepo task configuration
├── pnpm-workspace.yaml             # pnpm workspace config
├── .env.example                    # Environment variable template
└── README.md
```

---

## Prerequisites

| Tool | Minimum Version | Purpose |
|---|---|---|
| **Node.js** | 20.0.0 | All TypeScript/JS services and apps |
| **pnpm** | 9.0.0 | Monorepo package manager |
| **Python** | 3.11 | Processing, collection, and packaging services |
| **Docker + Docker Compose** | Current stable | Local infrastructure (Postgres, Redis, etc.) |
| **Git** | 2.x | Version control |

**Platform-specific extras:**

| Platform | Requirement | Needed For |
|---|---|---|
| Windows | [Visual Studio Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/) (C++ workload) | `better-sqlite3` native module in desktop app |
| macOS | `xcode-select --install` | Native module compilation |
| Linux | `build-essential python3` | Native module compilation |
| Apple Silicon | Use `onnxruntime-silicon` instead of `onnxruntime` | processing-service ML inference |

---

## Quick Start

### 1. Clone

```bash
git clone https://github.com/MohammedMaheer/robot-forge-ari.git
cd robot-forge-ari
```

### 2. Configure environment

```bash
cp .env.example .env
```

Open `.env` and fill in the secrets that have no working defaults:

```ini
# Stripe — https://dashboard.stripe.com
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_STARTER_PRICE_ID=price_...
STRIPE_PROFESSIONAL_PRICE_ID=price_...

# GitHub OAuth — https://github.com/settings/developers
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...

# Google OAuth — https://console.cloud.google.com
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# Change these — never use the defaults in production
JWT_SECRET=<random-64-char-string>
JWT_REFRESH_SECRET=<random-64-char-string>
```

All database, Redis, RabbitMQ, MinIO, and LiveKit values in `.env.example` match the Docker Compose defaults and require no changes for local development.

### 3. Start infrastructure

```bash
cd infra
docker compose up -d
cd ..
```

> **Port conflict note:** ClickHouse native port and MinIO both default to `9000`. Before running, edit `infra/docker-compose.yml` and remap ClickHouse native to `19000:9000`.

### 4. Install Node.js dependencies

```bash
pnpm install
```

### 5. Run database migrations

```bash
(cd apps/backend/auth-service && pnpm db:generate && pnpm db:migrate)
(cd apps/backend/marketplace-service && pnpm db:generate && pnpm db:migrate)
```

### 6. Install Python dependencies

```bash
for svc in collection-service processing-service packaging-service; do
  cd apps/backend/$svc
  python -m venv .venv
  source .venv/bin/activate        # Windows: .venv\Scripts\activate
  pip install -r requirements.txt
  deactivate
  cd ../../..
done
```

### 7. Start everything

**Node services (all at once via Turborepo):**

```bash
pnpm dev
```

**Python services (each in a separate terminal):**

```bash
# Terminal 1 — Collection
cd apps/backend/collection-service && source .venv/bin/activate
uvicorn main:app --reload --port 8001

# Terminal 2 — Processing
cd apps/backend/processing-service && source .venv/bin/activate
uvicorn main:app --reload --port 8002

# Terminal 3 — Packaging
cd apps/backend/packaging-service && source .venv/bin/activate
uvicorn main:app --reload --port 8003
```

The web app will be accessible at **http://localhost:5173**.

---

## Environment Variables

All variables are documented in `.env.example`. Key sections:

| Section | Variables |
|---|---|
| Database | `DATABASE_URL`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` |
| Redis | `REDIS_URL` |
| Object Storage | `MINIO_ENDPOINT`, `MINIO_ACCESS_KEY`, `MINIO_SECRET_KEY`, `MINIO_BUCKET` |
| Message Queue | `RABBITMQ_URL`, `RABBITMQ_USER`, `RABBITMQ_PASS` |
| Search | `ELASTICSEARCH_URL` |
| Streaming | `LIVEKIT_HOST`, `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET` |
| Auth | `JWT_SECRET`, `JWT_REFRESH_SECRET`, `JWT_ACCESS_EXPIRY`, `JWT_REFRESH_EXPIRY` |
| OAuth | `GITHUB_CLIENT_ID/SECRET`, `GOOGLE_CLIENT_ID/SECRET`, callback URLs |
| Payments | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, price IDs |
| App | `CORS_ORIGIN`, `FRONTEND_URL`, `NODE_ENV` |
| Frontend (Vite) | `VITE_API_URL`, `VITE_LIVEKIT_URL`, `VITE_WS_URL` |

---

## Infrastructure Services

Started via `docker compose up -d` from the `infra/` directory:

| Service | Image | Port(s) | Credentials |
|---|---|---|---|
| PostgreSQL (TimescaleDB) | `timescale/timescaledb:latest-pg16` | 5432 | `robotforge` / `robotforge_dev` |
| Redis | `redis:7-alpine` | 6379 | — |
| MinIO | `minio/minio` | 9000 (API), 9001 (console) | `robotforge` / `robotforge_dev_secret` |
| RabbitMQ | `rabbitmq:3-management` | 5672, 15672 (UI) | `robotforge` / `robotforge_dev` |
| Elasticsearch | `elasticsearch:8.11.0` | 9200 | xpack.security disabled |
| Kibana | `kibana:8.11.0` | 5601 | — |
| ClickHouse | `clickhouse-server` | 8123 (HTTP), 19000 (native) | `robotforge` / `robotforge_dev` |
| LiveKit | `livekit-server` | 7880, 7881, 7882/UDP | key: `devkey` / secret: `devsecret1234567890abcdef` |

---

## Running the Platform

### Build all packages and apps

```bash
pnpm build
```

### Development mode (hot reload)

```bash
pnpm dev
```

### Type checking

```bash
pnpm typecheck
```

### Linting

```bash
pnpm lint
```

### Run tests

```bash
pnpm test
```

---

## Individual Services

### API Gateway — `:3000`

Routes all incoming traffic to downstream microservices. Single entrypoint for the frontend.

```bash
cd apps/backend/gateway
pnpm dev
```

### Auth Service — `:3001`

Handles registration, login, JWT issuance (15-min access + 30-day refresh), bcrypt password hashing, GitHub/Google OAuth via Passport.js, and refresh token rotation.

```bash
cd apps/backend/auth-service
pnpm dev
```

Database scripts:

```bash
pnpm db:generate   # generate Prisma client
pnpm db:migrate    # run migrations
pnpm db:push       # push schema (no migration files)
```

### Marketplace Service — `:3002`

Dataset listings, full-text search via Elasticsearch, Stripe payment processing, provenance tracking, and review system.

```bash
cd apps/backend/marketplace-service
pnpm dev
```

### Notification Service — `:3003`

Socket.io server with Redis adapter for scalable real-time push notifications to connected clients.

```bash
cd apps/backend/notification-service
pnpm dev
```

### Streaming Service — `:3004`

LiveKit integration for real-time video and telemetry streaming during collection sessions.

```bash
cd apps/backend/streaming-service
pnpm dev
```

### Collection Service (Python) — `:8001`

FastAPI service for initiating and managing robot teleoperation collection sessions. Writes episode data to object storage.

```bash
cd apps/backend/collection-service
source .venv/bin/activate
uvicorn main:app --reload --port 8001
```

### Processing Service (Python) — `:8002`

5-stage episode processing pipeline:

1. **Frame Filtering** — Laplacian-variance blur detection, removes degraded frames
2. **Compression** — Zstandard streaming compression
3. **Annotation** — ONNX action-segmentation model inference (falls back to velocity heuristics)
4. **Quality Scoring** — Jerk-based smoothness, task completeness, workspace coverage, z-score anomaly detection
5. **Packaging** — HDF5 output with observations, actions, and metadata groups

```bash
cd apps/backend/processing-service
source .venv/bin/activate
uvicorn main:app --reload --port 8002
```

### Packaging Service (Python) — `:8003`

Final packaging of episodes into LeRobot-compatible HDF5 and PyArrow/Parquet formats for distribution.

```bash
cd apps/backend/packaging-service
source .venv/bin/activate
uvicorn main:app --reload --port 8003
```

---

## Desktop App

The Electron 30 desktop application is the primary data collection interface. Key features:

- **Robot discovery and connection** via the platform adapter layer (supports multiple protocols)
- **Real-time telemetry visualization** with per-joint position/velocity charts
- **Collection daemon** — records episodes locally to SQLite with configurable sample rate
- **Automatic sync queue** — uploads completed episodes to the backend when online
- **Secure renderer** — `sandbox: true`, `contextIsolation: true`, `nodeIntegration: false`, strict CSP headers
- **Auto-updater** — electron-updater with manual download confirmation (user-driven, not forced)

```bash
cd apps/desktop
pnpm dev      # development mode (Vite + Electron)
pnpm build    # production build (electron-builder)
```

The preload script exposes a fully-typed `window.electronAPI` bridge via `contextBridge`:

```typescript
window.electronAPI.robots.discover()
window.electronAPI.daemon.start(config)
window.electronAPI.storage.getEpisodes()
window.electronAPI.daemon.onTelemetry(callback)
```

---

## Web Application

React 18 PWA built with Vite and TypeScript.

```bash
cd apps/web
pnpm dev     # → http://localhost:5173
pnpm build   # production build
```

Key dependencies:

| Library | Purpose |
|---|---|
| React 18 + React Router v6 | UI framework and routing |
| TanStack Query v5 | Server state, caching, and background sync |
| Zustand | Client-side state management |
| Three.js + @react-three/fiber | 3D robot visualization |
| Recharts | Telemetry and analytics charts |
| React Hook Form + Zod | Form validation |
| Socket.io-client | Real-time notifications |
| LiveKit client SDK | Streaming video |
| Tailwind CSS 3 | Utility-first styling |

---

## API Reference

A full OpenAPI 3.1.0 specification is available at:

```
docs/openapi.yaml
```

You can also view it live via Swagger UI when the gateway is running:

```
http://localhost:3000/docs
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Monorepo tooling | pnpm workspaces + Turborepo 2 |
| Frontend | React 18, Vite, TypeScript, Tailwind CSS |
| Desktop | Electron 30, better-sqlite3 |
| Node backend | Express.js, Prisma 5, Passport.js, Socket.io 4 |
| Python backend | FastAPI, Pydantic v2, aio-pika, Celery |
| ML / Inference | ONNX Runtime, NumPy, OpenCV |
| Data formats | HDF5 (h5py), PyArrow/Parquet, Zstandard |
| Databases | PostgreSQL/TimescaleDB (Prisma), Redis, SQLite |
| Search | Elasticsearch 8 |
| Message queue | RabbitMQ (aio-pika) |
| Object storage | MinIO (S3-compatible) |
| Streaming | LiveKit |
| Payments | Stripe |
| Auth | JWT, bcrypt, OAuth 2.0 (GitHub, Google) |
| Containerization | Docker, Docker Compose, Helm |
| Cloud (prod) | AWS EKS, Aurora PostgreSQL 16, ElastiCache Redis, S3, ALB |
| IaC | Terraform >= 1.7.0 |

---

## Production Deployment

Terraform configuration targeting AWS is in `infra/terraform/`. It provisions:

- **VPC** (10.0.0.0/16, 2 availability zones)
- **EKS** 1.29 cluster
- **Aurora PostgreSQL 16.1** cluster (primary + replica)
- **ElastiCache Redis 7** cluster
- **S3** bucket (versioned, KMS-encrypted, lifecycle tiering to IA/Glacier)
- **ALB** + **ACM** certificate
- **ECR** repositories for each service

**Pre-requisites before `terraform apply`:**

1. Create the S3 bucket `robotforge-terraform-state` + DynamoDB table `robotforge-terraform-lock` for remote state
2. Configure AWS credentials (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`)

```bash
cd infra/terraform
terraform init
terraform plan
terraform apply
```

Kubernetes manifests are in `infra/k8s/` and a Helm chart in `infra/helm/robotforge/` for GitOps-style deployment.

---

## Contributing

1. Fork this repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes (with Husky pre-commit hooks enforcing lint + format)
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

Code style is enforced by ESLint, Prettier, and Ruff (Python) via lint-staged on commit.

---

## Developer

**Mohammed Maheer**
Robotics Software Engineer
[Acceleration Robotics](https://accelerationrobotics.com)

---

<div align="center">

Built with precision for the robotics community.

</div>
