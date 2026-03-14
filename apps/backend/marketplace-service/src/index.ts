import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { datasetsRouter } from './routes/datasets';
import { marketplaceRouter } from './routes/marketplace';
import { provenanceRouter } from './routes/provenance';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'marketplace-service', timestamp: new Date().toISOString() });
});

app.use('/datasets', datasetsRouter);
app.use('/datasets', provenanceRouter); // /datasets/:id/provenance
app.use('/marketplace', marketplaceRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`[marketplace-service] listening on port ${PORT}`);
});

export default app;
