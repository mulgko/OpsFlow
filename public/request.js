function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  })[character]);
}

const root = document.querySelector("#request-detail");
const pathId = decodeURIComponent(location.pathname.split("/").filter(Boolean).at(-1) || "");
const requestId = (new URLSearchParams(location.search).get("id") || pathId).toUpperCase();

function renderRequest(request) {
  const safeRequestId = escapeHtml(requestId);
  const safeStatusClass = ["status-received", "status-assigned", "status-progress", "status-review", "status-done"].includes(request.statusClass)
    ? request.statusClass
    : "status-received";
  document.title = `${request.title} | OpsFlow`;
  root.innerHTML = `
    <a class="back-link" href="/">← 요청 목록</a>
    <div class="detail-heading"><div><p class="request-number">${safeRequestId}</p><h1>${escapeHtml(request.title)}</h1></div><span class="status ${safeStatusClass}">${escapeHtml(request.status)}</span></div>
    <div class="detail-layout">
      <section class="detail-card" aria-labelledby="content-title"><h2 id="content-title">요청 내용</h2><p class="description">${escapeHtml(request.description)}</p><dl class="request-meta"><div><dt>담당자</dt><dd>${escapeHtml(request.owner)}</dd></div><div><dt>상태</dt><dd>${escapeHtml(request.status)}</dd></div><div><dt>생성일</dt><dd>${escapeHtml(request.createdAt)}</dd></div></dl></section>
      <section class="detail-card" aria-labelledby="changes-title"><h2 id="changes-title">변경 정보</h2><ol class="change-list">${request.changes.map(([date, text, actor]) => `<li><p>${escapeHtml(text)}</p><span>${escapeHtml(date)} · ${escapeHtml(actor)}</span></li>`).join("")}</ol></section>
    </div>`;
}

function renderDetail() {
  const forcedState = new URLSearchParams(location.search).get("state");
  if (forcedState === "loading") return;

  const result = window.OpsFlowRequests.load();
  if (forcedState === "error" || result.error) {
    document.title = "요청 오류 | OpsFlow";
    root.innerHTML = `<section class="not-found" role="alert"><p class="error-code">ERROR</p><h1>요청을 불러오지 못했습니다</h1><p>저장된 데이터가 올바른지 확인한 뒤 다시 시도해 주세요.</p><a class="secondary-action" href="/">요청 목록으로 돌아가기</a></section>`;
    return;
  }

  const request = result.requests.find((item) => item.id.toUpperCase() === requestId);
  if (!request) {
    document.title = "요청을 찾을 수 없음 | OpsFlow";
    root.innerHTML = `<section class="not-found"><p class="error-code">404</p><h1>요청을 찾을 수 없습니다</h1><p>요청 ID를 확인하거나 목록으로 돌아가 다시 선택해 주세요.</p><a class="secondary-action" href="/">요청 목록으로 돌아가기</a></section>`;
    return;
  }

  renderRequest(request);
}

requestAnimationFrame(renderDetail);
