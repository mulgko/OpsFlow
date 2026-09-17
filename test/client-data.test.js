const fs = require("node:fs");
const vm = require("node:vm");
const test = require("node:test");
const assert = require("node:assert/strict");

const source = fs.readFileSync("public/requests-data.js", "utf8");

function loadData(storedValue) {
  const window = {};
  const removedKeys = [];
  const context = {
    window,
    localStorage: {
      getItem: () => storedValue,
      removeItem: (key) => removedKeys.push(key),
    },
  };
  vm.runInNewContext(source, context);
  return { data: window.OpsFlowRequests, removedKeys };
}

test("shared request data combines stored and sample requests", () => {
  const stored = JSON.stringify([{
    id: "REQ-2001",
    title: "새 요청",
    description: "요청 내용",
    owner: "미배정",
    status: "접수",
    statusClass: "status-received",
    createdAt: "2026. 9. 17.",
    createdAtIso: "2026-09-17",
    changes: [],
  }]);
  const result = loadData(stored).data.load();

  assert.equal(result.error, null);
  assert.equal(result.requests.length, 6);
  assert.equal(result.requests[0].id, "REQ-2001");
  assert.equal(result.requests[1].id, "REQ-1005");
});

test("shared request data reports malformed storage", () => {
  const result = loadData("{invalid").data.load();

  assert.equal(result.error, "INVALID_REQUEST_DATA");
  assert.equal(result.requests.length, 0);
});

test("shared request data can reset local storage", () => {
  const { data, removedKeys } = loadData("[]");
  data.reset();

  assert.deepEqual(removedKeys, ["opsflow.requests"]);
});
