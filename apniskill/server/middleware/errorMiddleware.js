export function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
  });
  response.end(JSON.stringify(payload));
}

export function sendError(response, statusCode, message) {
  sendJson(response, statusCode, { message });
}

export async function parseJsonBody(request) {
  if (!['POST', 'PUT', 'PATCH'].includes(request.method)) {
    return {};
  }

  let body = '';

  for await (const chunk of request) {
    body += chunk;
  }

  if (!body) {
    return {};
  }

  try {
    return JSON.parse(body);
  } catch (error) {
    return null;
  }
}
