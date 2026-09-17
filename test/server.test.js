const { Readable } = require("node:stream");
const test = require("node:test");
const assert = require("node:assert/strict");
const { handleRequest } = require("../server");

async function request(method, url, body) {
  const incoming = Readable.from(body === undefined ? [] : [Buffer.from(body)]);
  incoming.method = method;
  incoming.url = url;
  incoming.headers = { host: "localhost" };

  const result = { statusCode: null, headers: null, body: "" };
  const response = {
    writeHead(statusCode, headers) {
      result.statusCode = statusCode;
      result.headers = headers;
      return this;
    },
    end(chunk = "") {
      result.body += chunk;
    },
  };

  await handleRequest(incoming, response);
  return { ...result, json: JSON.parse(result.body) };
}

test("GET returns the request collection without a body", async () => {
  const response = await request("GET", "/api/requests");

  assert.equal(response.statusCode, 200);
  assert.deepEqual(response.json, { requests: [] });
});

test("POST creates a request from a JSON body", async () => {
  const response = await request("POST", "/api/requests", JSON.stringify({
    title: "계약서 검토",
    description: "신규 계약서 검토가 필요합니다.",
  }));

  assert.equal(response.statusCode, 201);
  assert.equal(response.json.request.title, "계약서 검토");
  assert.equal(response.json.request.status, "접수");

  const listResponse = await request("GET", "/api/requests");
  assert.equal(listResponse.json.requests.length, 1);
});

test("POST rejects missing fields and malformed JSON", async () => {
  const missingField = await request("POST", "/api/requests", JSON.stringify({ title: "제목만 있음" }));
  const malformed = await request("POST", "/api/requests", "{invalid");

  assert.equal(missingField.statusCode, 400);
  assert.equal(malformed.statusCode, 400);
});

test("unsupported methods return 405 and an Allow header", async () => {
  const response = await request("DELETE", "/api/requests");

  assert.equal(response.statusCode, 405);
  assert.equal(response.headers.Allow, "GET, POST");
});
