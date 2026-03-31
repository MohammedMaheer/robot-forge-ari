import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { datasetsRouter } from './routes/datasets';
import { marketplaceRouter } from './routes/marketplace';
import { provenanceRouter } from './routes/provenance';
import { cartRouter } from './routes/cart';
import { stripeWebhookHandler } from './routes/webhooks';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

// Validate required environment variables at startup
const REQUIRED_ENV = ['JWT_SECRET', 'DATABASE_URL'];
const STRIPE_ENV = ['STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET'];
const missingRequired = REQUIRED_ENV.filter((k) => !process.env[k]);
if (missingRequired.length > 0) {
  console.error(`[marketplace-service] FATAL: missing required env vars: ${missingRequired.join(', ')}`);
  process.exit(1);
}
const missingStripe = STRIPE_ENV.filter((k) => !process.env[k]);
if (missingStripe.length > 0) {
  if (process.env.NODE_ENV === 'production') {
    console.error(`[marketplace-service] FATAL: missing Stripe env vars in production: ${missingStripe.join(', ')}`);
    process.exit(1);
  } else {
    console.warn(`[marketplace-service] WARNING: Stripe env vars not set (${missingStripe.join(', ')}) — payment features disabled`);
  }
}

const app = express();
const PORT = process.env.PORT || 3002;

app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(morgan('combined'));

// Stripe webhook must receive the raw body — register BEFORE express.json()
app.post('/webhooks/stripe', express.raw({ type: 'application/json' }), stripeWebhookHandler);

app.use(express.json({ limit: '10mb' }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'marketplace-service', timestamp: new Date().toISOString() });
});

app.use('/datasets', datasetsRouter);
app.use('/datasets', provenanceRouter); // /datasets/:id/provenance
app.use('/marketplace', marketplaceRouter);
app.use('/cart', cartRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`[marketplace-service] listening on port ${PORT}`);
});

export default app;
