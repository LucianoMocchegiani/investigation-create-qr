import express from 'express';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { createOrdersRouter } from './routes/orders.routes.js';
import { openApiDocument } from './docs/openapi.js';

const app = express();
const PORT = process.env.PORT || 3000;
const PUBLIC_URL = process.env.PUBLIC_URL ?? `http://localhost:${PORT}`;

app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));

app.use('/api', createOrdersRouter({ baseUrl: PUBLIC_URL }));

export { app, PORT };

