import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { createProxyMiddleware, Options } from "http-proxy-middleware";

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------
const PORT = parseInt(process.env.PORT ?? "3000", 10);

const SERVICE_MAP: Record<string, string> = {
  "/api/auth":          "http://localhost:3001",
  "/api/marketplace":   "http://localhost:3002",
  "/api/collection":    "http://localhost:8001",
  "/api/processing":    "http://localhost:8002",
  "/api/packaging":     "http://localhost:8003",
  "/api/notifications": "http://localhost:3003",
  "/api/streams":       "http://localhost:3004",
};

// ---------------------------------------------------------------------------
// App
// ---------------------------------------------------------------------------
const app = express();

// --- Security & logging ----------------------------------------------------
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN ?? "*",
    credentials: true,
  }),
);
app.use(morgan("combined"));

// --- Rate limiting ---------------------------------------------------------
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                  // 100 requests per window per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." },
});
app.use(limiter);

// --- Health -----------------------------------------------------------------
app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", service: "gateway" });
});

// --- Proxy routes -----------------------------------------------------------
for (const [path, target] of Object.entries(SERVICE_MAP)) {
  const proxyOptions: Options = {
    target,
    changeOrigin: true,
    pathRewrite: { [`^${path}`]: "" },
    on: {
      error(err: Error, _req: Request, res: Response | any) {
        console.error(`[proxy] ${path} → ${target} error:`, err.message);
        if (res.writeHead) {
          res.writeHead(502, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              error: "Bad Gateway",
              detail: `Upstream service at ${target} is unavailable.`,
            }),
          );
        }
      },
    },
  };

  app.use(path, createProxyMiddleware(proxyOptions));
}

// --- 404 catch-all ----------------------------------------------------------
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "Not Found" });
});

// --- Global error handler ---------------------------------------------------
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("[gateway] unhandled error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`🚀 ROBOTFORGE Gateway listening on http://localhost:${PORT}`);
  console.log("   Proxying:");
  for (const [path, target] of Object.entries(SERVICE_MAP)) {
    console.log(`     ${path}/* → ${target}`);
  }
});
