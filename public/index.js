const list = document.querySelector(".request-list");
const count = document.querySelector("#request-count");
const notice = document.querySelector("#created-notice");

function appendTextElement(parent, tagName, text, className) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  element.textContent = text;
  parent.append(element);
  return element;
}

try {
  const savedRequests = JSON.parse(localStorage.getItem("opsflow.requests") || "[]");
  if (Array.isArray(savedRequests)) {
    for (const request of [...savedRequests].reverse()) {
      if (!request?.id || !request?.title) continue;
      const row = document.createElement("a");
      row.className = "request-row";
      row.href = `/requests/${encodeURIComponent(request.id)}`;

      const title = appendTextElement(row, "span", "", "request-title");
      appendTextElement(title, "strong", request.title);
      appendTextElement(title, "small", request.id);
      appendTextElement(row, "span", request.owner || "미배정", "owner");

      const statusContainer = appendTextElement(row, "span", "");
      appendTextElement(statusContainer, "span", request.status || "접수", request.statusClass || "status status-received").classList.add("status");
      appendTextElement(row, "time", request.createdAt || "-");
      list.prepend(row);
    }
    count.textContent = String(list.children.length);
  }
} catch {
  localStorage.removeItem("opsflow.requests");
}

const createdId = new URLSearchParams(location.search).get("created");
if (createdId) {
  notice.textContent = `${createdId} 요청을 등록했습니다. 목록에서 확인할 수 있습니다.`;
  notice.hidden = false;
}
