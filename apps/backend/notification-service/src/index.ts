import express, { Request, Response, NextFunction } from "express";
import { createServer } from "http";
import { Server, Namespace, Socket } from "socket.io";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import jwt from "jsonwebtoken";
import Redis from "ioredis";
import { createAdapter } from "@socket.io/redis-adapter";
import { z } from "zod";

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const PORT = parseInt(process.env.PORT || "3003", 10);
const JWT_SECRET = process.env.JWT_SECRET || "robotforge-dev-secret";
const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";
const CORS_ORIGINS = (
  process.env.CORS_ORIGIN || "http://localhost:5173,http://localhost:5174"
).split(",");

// ---------------------------------------------------------------------------
// Express app
// ---------------------------------------------------------------------------

const app = express();
app.use(helmet());
app.use(cors({ origin: CORS_ORIGINS }));
app.use(morgan("combined"));
app.use(express.json());

const httpServer = createServer(app);

// ---------------------------------------------------------------------------
// Socket.io server
// ---------------------------------------------------------------------------

const io = new Server(httpServer, {
  cors: {
    origin: CORS_ORIGINS,
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
});

// ---------------------------------------------------------------------------
// Redis adapter for horizontal scaling
// ---------------------------------------------------------------------------

async function attachRedisAdapter(): Promise<void> {
  try {
    const pubClient = new Redis(REDIS_URL);
    const subClient = pubClient.duplicate();

    await Promise.all([
      new Promise<void>((res, rej) => {
        pubClient.on("connect", res);
        pubClient.on("error", rej);
      }),
      new Promise<void>((res, rej) => {
        subClient.on("connect", res);
        subClient.on("error", rej);
      }),
    ]);

    io.adapter(createAdapter(pubClient, subClient));
    console.log("[redis] adapter attached");
  } catch (err) {
    console.warn(
      "[redis] adapter unavailable – running in single-instance mode",
      err
    );
  }
}

// ---------------------------------------------------------------------------
// JWT auth middleware for Socket.io connections
// ---------------------------------------------------------------------------

interface DecodedToken {
  sub: string;
  userId: string;
  email?: string;
  iat?: number;
  exp?: number;
}

function socketAuthMiddleware(socket: Socket, next: (err?: Error) => void) {
  const token = socket.handshake.auth?.token || socket.handshake.query?.token;

  if (!token || typeof token !== "string") {
    return next(new Error("Authentication error: token required"));
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    (socket as any).userId = decoded.userId || decoded.sub;
    next();
  } catch {
    next(new Error("Authentication error: invalid token"));
  }
}

// ---------------------------------------------------------------------------
// Namespace helpers
// ---------------------------------------------------------------------------

function getUserId(socket: Socket): string {
  return (socket as any).userId;
}

function setupNamespace(
  nsp: Namespace,
  name: string,
  eventHandlers?: (socket: Socket) => void
): void {
  nsp.use(socketAuthMiddleware);

  nsp.on("connection", (socket: Socket) => {
    const userId = getUserId(socket);
    console.log(`[${name}] connected: ${socket.id} (user: ${userId})`);

    // Join user-specific room for targeted messages
    socket.join(userId);

    if (eventHandlers) {
      eventHandlers(socket);
    }

    socket.on("disconnect", (reason) => {
      console.log(
        `[${name}] disconnected: ${socket.id} (user: ${userId}) reason: ${reason}`
      );
    });

    socket.on("error", (err) => {
      console.error(`[${name}] socket error: ${socket.id}`, err);
    });
  });
}

// ---------------------------------------------------------------------------
// /teleoperation — robot command / feedback loop events (50 Hz state)
// ---------------------------------------------------------------------------

const teleoperationNsp = io.of("/teleoperation");
setupNamespace(teleoperationNsp, "teleoperation", (socket) => {
  // Operator sends commands to the robot
  socket.on("robot:command", (data: unknown) => {
    const userId = getUserId(socket);
    // Broadcast command to all other participants in the user's room
    socket.to(userId).emit("robot:command", data);
    console.log(`[teleoperation] robot:command from ${userId}`);
  });

  // Robot publishes state at ~50 Hz — relay to room participants
  socket.on("robot:state", (data: unknown) => {
    const userId = getUserId(socket);
    socket.to(userId).emit("robot:state", data);
  });

  socket.on("robot:emergency_stop", (data: unknown) => {
    const userId = getUserId(socket);
    teleoperationNsp.to(userId).emit("robot:emergency_stop", data);
    console.log(`[teleoperation] EMERGENCY STOP from ${userId}`);
  });
});

// ---------------------------------------------------------------------------
// /collection — episode recording state events
// ---------------------------------------------------------------------------

const collectionNsp = io.of("/collection");
setupNamespace(collectionNsp, "collection", (socket) => {
  socket.on("episode:started", (data: unknown) => {
    const userId = getUserId(socket);
    collectionNsp.to(userId).emit("episode:started", data);
    console.log(`[collection] episode:started from ${userId}`);
  });

  socket.on("episode:complete", (data: unknown) => {
    const userId = getUserId(socket);
    collectionNsp.to(userId).emit("episode:complete", data);
    console.log(`[collection] episode:complete from ${userId}`);
  });

  socket.on("session:update", (data: unknown) => {
    const userId = getUserId(socket);
    collectionNsp.to(userId).emit("session:update", data);
    console.log(`[collection] session:update from ${userId}`);
  });
});

// ---------------------------------------------------------------------------
// /processing — real-time processing job updates
// ---------------------------------------------------------------------------

const processingNsp = io.of("/processing");
setupNamespace(processingNsp, "processing", (socket) => {
  socket.on("job:progress", (data: unknown) => {
    const userId = getUserId(socket);
    processingNsp.to(userId).emit("job:progress", data);
  });

  socket.on("job:complete", (data: unknown) => {
    const userId = getUserId(socket);
    processingNsp.to(userId).emit("job:complete", data);
    console.log(`[processing] job:complete from ${userId}`);
  });

  socket.on("job:failed", (data: unknown) => {
    const userId = getUserId(socket);
    processingNsp.to(userId).emit("job:failed", data);
    console.log(`[processing] job:failed from ${userId}`);
  });
});

// ---------------------------------------------------------------------------
// /marketplace — new dataset / purchase notifications
// ---------------------------------------------------------------------------

const marketplaceNsp = io.of("/marketplace");
setupNamespace(marketplaceNsp, "marketplace", (socket) => {
  // Clients may only receive purchase confirmations for themselves.
  // dataset:new / dataset:updated are server-initiated via the /notify REST
  // endpoint — clients cannot broadcast these to prevent fake event injection.

  socket.on("purchase:confirmed", (data: unknown) => {
    const userId = getUserId(socket);
    marketplaceNsp.to(userId).emit("purchase:confirmed", data);
    console.log(`[marketplace] purchase:confirmed for ${userId}`);
  });
});

// ---------------------------------------------------------------------------
// Validation schemas
// ---------------------------------------------------------------------------

const NotifyBodySchema = z.object({
  userId: z.string().optional(),
  channel: z.enum(["teleoperation", "collection", "processing", "marketplace"]),
  event: z.string().min(1),
  data: z.unknown(),
});

// ---------------------------------------------------------------------------
// Internal service-to-service auth middleware
// ---------------------------------------------------------------------------

function requireInternalAuth(req: Request, res: Response, next: NextFunction) {
  const secret = req.headers['x-internal-secret'];
  const expected = process.env.INTERNAL_SECRET;
  if (!expected || secret !== expected) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  next();
}

// ---------------------------------------------------------------------------
// REST endpoints
// ---------------------------------------------------------------------------

app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", service: "notification-service", uptime: process.uptime() });
});

/**
 * POST /notify — programmatically push a notification via REST.
 * Body: { userId?: string, channel: string, event: string, data: any }
 * If userId is provided, emits to that user's room; otherwise broadcasts.
 */
app.post("/notify", requireInternalAuth, (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = NotifyBodySchema.parse(req.body);
    const { userId, channel, event, data } = parsed;

    const namespaceMap: Record<string, Namespace> = {
      teleoperation: teleoperationNsp,
      collection: collectionNsp,
      processing: processingNsp,
      marketplace: marketplaceNsp,
    };

    const nsp = namespaceMap[channel];
    if (!nsp) {
      res.status(400).json({ error: `Unknown channel: ${channel}` });
      return;
    }

    if (userId) {
      nsp.to(userId).emit(event, data);
    } else {
      nsp.emit(event, data);
    }

    res.json({ delivered: true, channel, event, targeted: !!userId });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(422).json({ error: "Validation failed", details: err.errors });
      return;
    }
    next(err);
  }
});

/**
 * GET /connections — active socket connection counts per namespace.
 */
app.get("/connections", requireInternalAuth, async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const namespaces: Record<string, number> = {};

    const entries: [string, Namespace][] = [
      ["teleoperation", teleoperationNsp],
      ["collection", collectionNsp],
      ["processing", processingNsp],
      ["marketplace", marketplaceNsp],
    ];

    for (const [name, nsp] of entries) {
      const sockets = await nsp.fetchSockets();
      namespaces[name] = sockets.length;
    }

    res.json({ namespaces, total: Object.values(namespaces).reduce((a, b) => a + b, 0) });
  } catch (err) {
    next(err);
  }
});

// ---------------------------------------------------------------------------
// Global error handler
// ---------------------------------------------------------------------------

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("[error]", err);
  res.status(500).json({ error: "Internal server error" });
});

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  await attachRedisAdapter();

  httpServer.listen(PORT, () => {
    console.log(`[notification-service] listening on :${PORT}`);
    console.log(`[notification-service] namespaces: /teleoperation, /collection, /processing, /marketplace`);
  });
}

main().catch((err) => {
  console.error("[notification-service] fatal:", err);
  process.exit(1);
});
