# OpsFlow

OpsFlow는 운영 요청의 등록, 담당자 배정, 처리, 검토, 완료와 변경 이력을 하나의 흐름으로 관리하기 위한 프로젝트입니다.

## 현재 상태

- GitHub 저장소 연결 완료
- 제품 범위와 기술 구성 확정 전
- 외부 패키지 없이 실행 가능한 초기 화면 구성

## 기본 업무 흐름

`접수 → 진행 → 검토 → 완료`

## 개발 시작 전 확인 사항

- 대상 사용자와 역할 확정
- v1 범위 및 제외 범위 확정
- 기술 스택과 패키지 관리자 확정
- 첫 화면의 데이터 구조와 완료 기준 확정

## 로컬 저장소

```bash
git clone https://github.com/mulgko/OpsFlow.git opsflow
cd opsflow
```

## 로컬 실행

Node.js 22 이상이 필요합니다.

```bash
npm run dev
```

브라우저에서 `http://localhost:3000`을 엽니다. 다른 포트를 사용하려면 `PORT=3001 npm run dev`처럼 실행합니다.
