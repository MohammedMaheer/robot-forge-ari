import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import passport from 'passport';
import { authRouter } from './routes/auth';
import { oauthRouter } from './routes/oauth';
import { passwordRouter } from './routes/password';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ── Middleware ─────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(passport.initialize());

// ── Health ────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'auth-service', timestamp: new Date().toISOString() });
});

// ── Routes ────────────────────────────────────────────────
app.use('/auth', authRouter);
app.use('/auth', passwordRouter);
app.use('/oauth', oauthRouter);

// ── Error handling ────────────────────────────────────────
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`[auth-service] listening on port ${PORT}`);
});

export default app;
