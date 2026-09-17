const list = document.querySelector(".request-list");
const count = document.querySelector("#request-count");
const notice = document.querySelector("#created-notice");
const loadingState = document.querySelector("#loading-state");
const emptyState = document.querySelector("#empty-state");
const errorState = document.querySelector("#error-state");
const resetButton = document.querySelector("#reset-requests");

function appendTextElement(parent, tagName, text, className) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  element.textContent = text;
  parent.append(element);
  return element;
}

function showOnly(element) {
  for (const target of [list, loadingState, emptyState, errorState]) {
    target.hidden = target !== element;
  }
}

function renderRequests(requests) {
  list.replaceChildren();
  count.textContent = String(requests.length);

  if (requests.length === 0) {
    showOnly(emptyState);
    return;
  }

  for (const request of requests) {
    const row = document.createElement("a");
    row.className = "request-row";
    row.href = `/requests/${encodeURIComponent(request.id)}`;

    const title = appendTextElement(row, "span", "", "request-title");
    appendTextElement(title, "strong", request.title);
    appendTextElement(title, "small", request.id);
    appendTextElement(row, "span", request.owner, "owner");

    const statusContainer = appendTextElement(row, "span", "");
    appendTextElement(statusContainer, "span", request.status, `status ${request.statusClass || "status-received"}`);
    const time = appendTextElement(row, "time", request.createdAt);
    if (request.createdAtIso) time.dateTime = request.createdAtIso;
    list.append(row);
  }

  showOnly(list);
}

function loadRequests() {
  const forcedState = new URLSearchParams(location.search).get("state");
  if (forcedState === "loading") return;
  if (forcedState === "empty") return renderRequests([]);
  if (forcedState === "error") return showOnly(errorState);

  const result = window.OpsFlowRequests.load();
  if (result.error) {
    count.textContent = "-";
    showOnly(errorState);
    return;
  }
  renderRequests(result.requests);
}

resetButton.addEventListener("click", () => {
  window.OpsFlowRequests.reset();
  history.replaceState(null, "", location.pathname);
  showOnly(loadingState);
  requestAnimationFrame(loadRequests);
});

const createdId = new URLSearchParams(location.search).get("created");
if (createdId) {
  notice.textContent = `${createdId} 요청을 등록했습니다. 목록에서 확인할 수 있습니다.`;
  notice.hidden = false;
}

requestAnimationFrame(loadRequests);
