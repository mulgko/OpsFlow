(function initializeRequestData(global) {
  const storageKey = "opsflow.requests";
  const sampleRequests = [
    { id: "REQ-1005", title: "신규 파트너 계약서 검토 요청", owner: "김도경", status: "검토 대기", statusClass: "status-review", createdAt: "2026. 9. 9.", createdAtIso: "2026-09-09", description: "신규 파트너사와 체결할 표준 계약서의 운영 조건과 개인정보 처리 조항을 검토해 주세요.", changes: [["2026. 9. 9. 14:20", "상태를 ‘진행 중’에서 ‘검토 대기’로 변경", "김도경"], ["2026. 9. 9. 10:05", "담당자를 김도경으로 지정", "이서연"], ["2026. 9. 9. 09:42", "요청 생성", "이서연"]] },
    { id: "REQ-1004", title: "9월 정산 자료 업로드 확인", owner: "이서연", status: "진행 중", statusClass: "status-progress", createdAt: "2026. 9. 8.", createdAtIso: "2026-09-08", description: "9월 정산에 필요한 거래 내역과 증빙 자료가 공용 폴더에 모두 등록되었는지 확인해 주세요.", changes: [["2026. 9. 8. 16:10", "상태를 ‘접수’에서 ‘진행 중’으로 변경", "이서연"], ["2026. 9. 8. 11:30", "요청 생성", "박민준"]] },
    { id: "REQ-1003", title: "고객사 온보딩 일정 배정", owner: "박민준", status: "배정 완료", statusClass: "status-assigned", createdAt: "2026. 9. 7.", createdAtIso: "2026-09-07", description: "신규 고객사의 관리자 교육과 초기 설정 일정을 담당자 캘린더에 배정해 주세요.", changes: [["2026. 9. 7. 15:00", "담당자를 박민준으로 지정", "김도경"], ["2026. 9. 7. 13:20", "요청 생성", "김도경"]] },
    { id: "REQ-1002", title: "서비스 이용 권한 변경", owner: "최유진", status: "완료", statusClass: "status-done", createdAt: "2026. 9. 6.", createdAtIso: "2026-09-06", description: "조직 개편에 따라 운영 관리자 3명의 접근 권한을 변경해 주세요.", changes: [["2026. 9. 6. 17:45", "처리를 완료하고 상태를 ‘완료’로 변경", "최유진"], ["2026. 9. 6. 09:10", "요청 생성", "정현우"]] },
    { id: "REQ-1001", title: "월간 운영 리포트 생성 요청", owner: "정현우", status: "진행 중", statusClass: "status-progress", createdAt: "2026. 9. 5.", createdAtIso: "2026-09-05", description: "8월 운영 지표와 주요 이슈를 정리한 월간 리포트를 작성해 주세요.", changes: [["2026. 9. 5. 13:35", "상태를 ‘접수’에서 ‘진행 중’으로 변경", "정현우"], ["2026. 9. 5. 09:00", "요청 생성", "김도경"]] },
  ];

  function isRequest(request) {
    return request
      && typeof request.id === "string"
      && typeof request.title === "string"
      && typeof request.description === "string"
      && typeof request.owner === "string"
      && typeof request.status === "string"
      && typeof request.createdAt === "string"
      && Array.isArray(request.changes);
  }

  function load() {
    try {
      const stored = JSON.parse(localStorage.getItem(storageKey) || "[]");
      if (!Array.isArray(stored) || !stored.every(isRequest)) throw new Error("INVALID_REQUEST_DATA");
      return { requests: [...stored, ...sampleRequests], error: null };
    } catch {
      return { requests: [], error: "INVALID_REQUEST_DATA" };
    }
  }

  function reset() {
    localStorage.removeItem(storageKey);
  }

  global.OpsFlowRequests = { load, reset };
})(window);
