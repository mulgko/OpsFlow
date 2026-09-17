const http = require("node:http");
const { readFile } = require("node:fs/promises");
const { extname, join, normalize } = require("node:path");

const port = Number(process.env.PORT) || 3000;
const host = process.env.HOST || "127.0.0.1";
const publicDir = join(__dirname, "public");
const requests = [];

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
};

function sendJson(response, statusCode, body) {
  response.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(body));
}

async function readJson(request) {
  const chunks = [];
  let size = 0;

  for await (const chunk of request) {
    size += chunk.length;
    if (size > 32_768) throw new Error("PAYLOAD_TOO_LARGE");
    chunks.push(chunk);
  }

  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    throw new Error("INVALID_JSON");
  }
}

async function handleApiRequest(request, response, pathname) {
  if (pathname !== "/api/requests") return false;

  if (request.method === "GET") {
    sendJson(response, 200, { requests });
    return true;
  }

  if (request.method === "POST") {
    try {
      const body = await readJson(request);
      const title = typeof body.title === "string" ? body.title.trim() : "";
      const description = typeof body.description === "string" ? body.description.trim() : "";

      if (!title || !description) {
        sendJson(response, 400, { error: "제목과 내용은 필수입니다." });
        return true;
      }

      const createdRequest = {
        id: `REQ-${Date.now()}`,
        title,
        description,
        status: "접수",
        createdAt: new Date().toISOString(),
      };
      requests.unshift(createdRequest);
      sendJson(response, 201, { request: createdRequest });
    } catch (error) {
      const statusCode = error.message === "PAYLOAD_TOO_LARGE" ? 413 : 400;
      const message = statusCode === 413 ? "요청 본문이 너무 큽니다." : "올바른 JSON 형식이 아닙니다.";
      sendJson(response, statusCode, { error: message });
    }
    return true;
  }

  response.writeHead(405, {
    Allow: "GET, POST",
    "Content-Type": "application/json; charset=utf-8",
  });
  response.end(JSON.stringify({ error: "지원하지 않는 요청 방식입니다." }));
  return true;
}

async function handleRequest(request, response) {
  const pathname = new URL(request.url, `http://${request.headers.host}`).pathname;
  if (await handleApiRequest(request, response, pathname)) return;

  const requestedPath = pathname === "/"
    ? "index.html"
    : pathname === "/requests/new" || pathname === "/requests/new/"
      ? "new-request.html"
    : /^\/requests\/[^/]+\/?$/.test(pathname)
      ? "request.html"
      : pathname.slice(1);
  const filePath = normalize(join(publicDir, requestedPath));

  if (!filePath.startsWith(publicDir)) {
    response.writeHead(403).end("Forbidden");
    return;
  }

  try {
    const file = await readFile(filePath);
    response.writeHead(200, {
      "Content-Type": contentTypes[extname(filePath)] || "application/octet-stream",
    });
    response.end(file);
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
  }
}

function createAppServer() {
  return http.createServer(handleRequest);
}

if (require.main === module) {
  createAppServer().listen(port, host, () => {
    console.log(`OpsFlow is running at http://${host}:${port}`);
  });
}

module.exports = { handleRequest };
