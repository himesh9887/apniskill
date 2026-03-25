import http from 'node:http';
import { fileURLToPath } from 'node:url';
import { ensureDatabase } from './config/db.js';
import { sendError, sendJson, parseJsonBody } from './middleware/errorMiddleware.js';
import { authRoutes } from './routes/authRoutes.js';
import { userRoutes } from './routes/userRoutes.js';
import { matchRoutes } from './routes/matchRoutes.js';
import { messageRoutes } from './routes/messageRoutes.js';

const routes = [...authRoutes, ...userRoutes, ...matchRoutes, ...messageRoutes];

function setCorsHeaders(response) {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
}

async function handleRequest(request, response) {
  setCorsHeaders(response);

  if (request.method === 'OPTIONS') {
    response.writeHead(204);
    response.end();
    return;
  }

  const url = new URL(request.url, `http://${request.headers.host || 'localhost'}`);
  const route = routes.find(
    (entry) => entry.method === request.method && entry.path === url.pathname,
  );

  if (request.method === 'GET' && url.pathname === '/api/health') {
    sendJson(response, 200, { status: 'ok', service: 'apniskill-server' });
    return;
  }

  if (!route) {
    sendError(response, 404, 'Route not found.');
    return;
  }

  const body = await parseJsonBody(request);

  if (body === null) {
    sendError(response, 400, 'Invalid JSON payload.');
    return;
  }

  try {
    await route.handler({
      request,
      response,
      body,
      query: Object.fromEntries(url.searchParams.entries()),
    });
  } catch (error) {
    console.error('Unhandled server error:', error);
    sendError(response, 500, 'Internal server error.');
  }
}

export async function createAppServer() {
  await ensureDatabase();
  return http.createServer((request, response) => {
    handleRequest(request, response).catch((error) => {
      console.error('Unhandled request failure:', error);

      if (!response.headersSent) {
        sendError(response, 500, 'Internal server error.');
      }
    });
  });
}

export async function startServer(port = Number(process.env.PORT) || 5000) {
  const server = await createAppServer();

  return new Promise((resolve) => {
    server.listen(port, () => {
      console.log(`ApniSkill server running on http://localhost:${port}`);
      resolve(server);
    });
  });
}

const currentFile = fileURLToPath(import.meta.url);

if (process.argv[1] === currentFile) {
  startServer();
}
