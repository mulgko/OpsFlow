const form = document.querySelector("#request-form");
const fields = [
  { input: form.elements.title, message: "제목을 입력해 주세요." },
  { input: form.elements.description, message: "내용을 입력해 주세요." },
];

function validateField({ input, message }) {
  const error = document.querySelector(`#${input.id}-error`);
  const isValid = input.value.trim().length > 0;
  input.setAttribute("aria-invalid", String(!isValid));
  error.textContent = isValid ? "" : message;
  return isValid;
}

for (const field of fields) {
  field.input.addEventListener("blur", () => validateField(field));
  field.input.addEventListener("input", () => {
    if (field.input.getAttribute("aria-invalid") === "true") validateField(field);
  });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const isValid = fields.map(validateField).every(Boolean);

  if (!isValid) {
    fields.find((field) => field.input.getAttribute("aria-invalid") === "true").input.focus();
    return;
  }

  let savedRequests = [];
  try {
    savedRequests = JSON.parse(localStorage.getItem("opsflow.requests") || "[]");
    if (!Array.isArray(savedRequests)) savedRequests = [];
  } catch {
    savedRequests = [];
  }

  const now = new Date();
  const id = `REQ-${String(now.getTime()).slice(-7)}`;
  const createdAt = new Intl.DateTimeFormat("ko-KR", { dateStyle: "medium" }).format(now);
  savedRequests.unshift({
    id,
    title: form.elements.title.value.trim(),
    description: form.elements.description.value.trim(),
    owner: "미배정",
    status: "접수",
    statusClass: "status-received",
    createdAt,
    createdAtIso: now.toISOString().slice(0, 10),
    changes: [[`${createdAt} ${now.toTimeString().slice(0, 5)}`, "요청 생성", "요청자"]],
  });
  localStorage.setItem("opsflow.requests", JSON.stringify(savedRequests));
  location.assign(`/?created=${encodeURIComponent(id)}`);
});
