import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { cors } from 'hono/cors';
import { env } from './config/env';
import { errorHandler } from './lib/error-middleware';
import authRoutes from './features/auth/routes';
import campaignRoutes from './features/campaigns/routes';
import { partRoutes, sessionRoutes } from './features/parts/routes';
import { campaignLoreRoutes, loreRoutes } from './features/lore/routes';

const app = new Hono();

app.use(
  '*',
  cors({
    origin: env.WEB_URL,
    credentials: true,
  }),
);

app.onError(errorHandler);

app.get('/', (c) => {
  return c.json({ message: 'Hello from TTRPG Long-Term Goals API!' });
});

app.get('/api/health', (c) => {
  return c.json({ status: 'ok' });
});

app.route('/api/auth', authRoutes);
app.route('/api/campaigns', campaignRoutes);
app.route('/api/parts', partRoutes);
app.route('/api/sessions', sessionRoutes);
app.route('/api/lore', loreRoutes);
app.route('/api/campaigns/:id/lore', campaignLoreRoutes);

const port = 3000;
console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
