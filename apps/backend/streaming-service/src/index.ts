import express, { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import jwt from "jsonwebtoken";
import { z } from "zod";
import {
  RoomServiceClient,
  AccessToken,
  VideoGrant,
} from "livekit-server-sdk";

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const PORT = parseInt(process.env.PORT || "3004", 10);
const JWT_SECRET = process.env.JWT_SECRET || "robotforge-dev-secret";
const LIVEKIT_URL = process.env.LIVEKIT_URL || "ws://localhost:7880";
const LIVEKIT_API_KEY = process.env.LIVEKIT_API_KEY || "devkey";
const LIVEKIT_API_SECRET = process.env.LIVEKIT_API_SECRET || "devsecret";
const CORS_ORIGINS = (
  process.env.CORS_ORIGINS || "http://localhost:5173,http://localhost:5174"
).split(",");

// ---------------------------------------------------------------------------
// LiveKit client
// ---------------------------------------------------------------------------

const livekitHost = LIVEKIT_URL.replace(/^ws/, "http");
const roomService = new RoomServiceClient(
  livekitHost,
  LIVEKIT_API_KEY,
  LIVEKIT_API_SECRET
);

// ---------------------------------------------------------------------------
// Express app
// ---------------------------------------------------------------------------

const app = express();
app.use(helmet());
app.use(cors({ origin: CORS_ORIGINS }));
app.use(morgan("combined"));
app.use(express.json());

// ---------------------------------------------------------------------------
// JWT auth middleware
// ---------------------------------------------------------------------------

interface DecodedToken {
  sub: string;
  userId: string;
  email?: string;
  iat?: number;
  exp?: number;
}

function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Missing or invalid Authorization header" });
    return;
  }

  const token = authHeader.slice(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    (req as any).userId = decoded.userId || decoded.sub;
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

// ---------------------------------------------------------------------------
// Validation schemas
// ---------------------------------------------------------------------------

const CreateRoomSchema = z.object({
  name: z.string().min(1).max(128),
  maxParticipants: z.number().int().min(1).max(100).optional().default(10),
  emptyTimeout: z.number().int().min(0).optional().default(300),
});

const TokenQuerySchema = z.object({
  roomName: z.string().min(1),
  participantName: z.string().min(1),
  identity: z.string().min(1),
});

// ---------------------------------------------------------------------------
// Health check (public)
// ---------------------------------------------------------------------------

app.get("/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    service: "streaming-service",
    uptime: process.uptime(),
    livekit: LIVEKIT_URL,
  });
});

// ---------------------------------------------------------------------------
// Protected routes
// ---------------------------------------------------------------------------

/**
 * POST /streams/rooms — Create a new LiveKit room.
 */
app.post(
  "/streams/rooms",
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, maxParticipants, emptyTimeout } = CreateRoomSchema.parse(
        req.body
      );

      const room = await roomService.createRoom({
        name,
        maxParticipants,
        emptyTimeout,
      });

      res.status(201).json({
        room: {
          name: room.name,
          sid: room.sid,
          maxParticipants: room.maxParticipants,
          emptyTimeout: room.emptyTimeout,
          creationTime: room.creationTime,
        },
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        res
          .status(422)
          .json({ error: "Validation failed", details: err.errors });
        return;
      }
      next(err);
    }
  }
);

/**
 * GET /streams/rooms — List all active LiveKit rooms.
 */
app.get(
  "/streams/rooms",
  authMiddleware,
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const rooms = await roomService.listRooms();

      res.json({
        rooms: rooms.map((r) => ({
          name: r.name,
          sid: r.sid,
          numParticipants: r.numParticipants,
          maxParticipants: r.maxParticipants,
          creationTime: r.creationTime,
        })),
      });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * DELETE /streams/rooms/:name — Delete a LiveKit room by name.
 */
app.delete(
  "/streams/rooms/:name",
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await roomService.deleteRoom(req.params.name);
      res.json({ deleted: true, room: req.params.name });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * GET /streams/token — Generate a LiveKit participant access token.
 * Query params: roomName, participantName, identity
 */
app.get(
  "/streams/token",
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { roomName, participantName, identity } = TokenQuerySchema.parse(
        req.query
      );

      const grant: VideoGrant = {
        roomJoin: true,
        room: roomName,
        canPublish: true,
        canSubscribe: true,
        canPublishData: true,
      };

      const token = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
        identity,
        name: participantName,
        ttl: "6h",
      });
      token.addGrant(grant);

      const jwt = await token.toJwt();

      res.json({
        token: jwt,
        identity,
        room: roomName,
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        res
          .status(422)
          .json({ error: "Validation failed", details: err.errors });
        return;
      }
      next(err);
    }
  }
);

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

app.listen(PORT, () => {
  console.log(`[streaming-service] listening on :${PORT}`);
  console.log(`[streaming-service] LiveKit URL: ${LIVEKIT_URL}`);
});
