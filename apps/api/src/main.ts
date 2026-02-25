import { Hono } from 'hono';
import { serve } from '@hono/node-server';

const app = new Hono();

app.get('/', (c) => {
  return c.json({ message: 'Hello from TTRPG Long-Term Goals API!' });
});

app.get('/api/health', (c) => {
  return c.json({ status: 'ok' });
});

const port = 3000;
console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
