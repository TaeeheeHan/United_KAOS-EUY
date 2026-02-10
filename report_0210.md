# Kaos EUY! - 개발 보고서 (2026.02.10)

## 1. 개요

2월 9일 Duitku 결제 연동 이후 추가로 진행된 작업들을 정리한다.
주로 **Docker 컨테이너화**, **Docker 환경에서의 오류 해결**, **이미지 표시 문제 수정**에 대한 내용이다.

---

## 2. Docker 컨테이너화 (커밋 433720b)

Next.js 앱을 Docker로 배포할 수 있도록 컨테이너화를 완료했다.

### 생성한 파일

| 파일 | 설명 |
|------|------|
| `Dockerfile` | 멀티 스테이지 빌드 (node:20-alpine 기반, standalone 출력) |
| `docker-compose.yml` | 원커맨드 실행 설정 |
| `.dockerignore` | Docker 빌드 시 제외할 파일 목록 |
| `setup.sh` | 초기 셋업 스크립트 |

### 주요 설정

**Dockerfile (멀티 스테이지 빌드):**
- Stage 1 (`deps`): `npm ci`로 의존성 설치
- Stage 2 (`builder`): `npm run build`로 Next.js 빌드
- Stage 3 (`runner`): standalone 출력물만 복사하여 경량 이미지 생성

**next.config.js 변경:**
- `output: 'standalone'` 추가 → Docker 배포에 최적화된 빌드 출력

**database.types.ts 변경:**
- orders 테이블에 결제 관련 필드 타입 추가 (`payment_status`, `payment_method`, `payment_reference`, `paid_at`)

### Docker 실행 방법

```bash
# Docker 이미지 빌드 + 실행
docker compose up --build

# 백그라운드 실행
docker compose up --build -d

# 종료
docker compose down
```

---

## 3. Docker 환경 오류 해결

### 3-1. 환경변수 로딩 문제 (커밋 f285883)

**문제:** Docker 컨테이너 내에서 Duitku/Supabase 환경변수가 제대로 로딩되지 않음

**원인:** `docker-compose.yml`의 `environment` 섹션에 직접 명시한 값과 `.env.local` 파일의 값이 충돌

**해결:**
- `docker-compose.yml`에서 `env_file: .env.local`로 환경변수 파일을 직접 로드
- `environment` 섹션에서 중복되는 Duitku/Supabase 키를 제거
- Supabase URL만 `host.docker.internal:54321`로 오버라이드

### 3-2. 브라우저/서버 Supabase URL 분리 (커밋 195cc7d)

**문제:** Docker 컨테이너 안에서 Supabase URL이 `host.docker.internal`로 설정되면 브라우저에서 접근 불가

**원인:**
- **브라우저** (클라이언트): `localhost:54321`로 접근해야 함 (사용자 PC 기준)
- **서버** (컨테이너 내부): `host.docker.internal:54321`로 접근해야 함 (Docker 네트워크 기준)
- `NEXT_PUBLIC_` 변수는 빌드 타임에 번들에 포함되므로 단일 URL로는 양쪽 모두 대응 불가

**해결:** `docker-compose.yml`에서 빌드/런타임 URL을 분리

```yaml
build:
  args:
    # 빌드 타임 (브라우저용) - localhost로 번들에 포함
    NEXT_PUBLIC_SUPABASE_URL: http://localhost:54321
environment:
  # 런타임 (서버용) - 컨테이너에서 호스트 접근
  NEXT_PUBLIC_SUPABASE_URL: http://host.docker.internal:54321
```

---

## 4. 이미지 표시 + 결제 에러 메시지 개선 (커밋 e6c98ed)

### 4-1. 이미지 표시 문제 수정

**문제:** Docker 환경에서 제품 이미지가 표시되지 않음

**해결:**
- `next.config.js`에서 `images.unoptimized: true` 설정 → Next.js Image 최적화 비활성화 (Docker에서 sharp 의존성 문제 회피)
- 이미지 업로드 시 자동 리사이즈 (최대 1200px, 85% 압축) 기능 추가
- 이미지 로드 실패 시 fallback placeholder 표시
- 제품 카드 높이 통일 (`flex-col`, `mt-auto`)

**수정한 파일:**

| 파일 | 변경 내용 |
|------|-----------|
| `next.config.js` | 이미지 최적화 설정 변경 (34줄 제거 후 단순화) |
| `src/app/products/[slug]/page.tsx` | 이미지 fallback 처리 |
| `src/components/products/ProductCard.tsx` | 카드 높이 통일 + fallback 이미지 |
| `src/components/cart/CartItem.tsx` | 장바구니 이미지 fallback |
| `src/app/admin/products/page.tsx` | 관리자 페이지 이미지 표시 수정 |
| `src/lib/utils.ts` | 이미지 리사이즈/압축 유틸리티 함수 추가 (52줄) |

### 4-2. Duitku 결제 에러 메시지 개선

**문제:** 결제 생성 실패 시 "Payment creation failed"라는 일반적인 에러만 표시됨

**해결:**
- `src/app/api/payment/create/route.ts`에서 Duitku API 응답의 상세 에러 정보를 파싱
- 프론트엔드에 구체적인 에러 원인 전달 (예: "Merchant not found", "Invalid signature" 등)

---

## 5. 변경 요약

| 커밋 | 시간 | 내용 |
|------|------|------|
| `433720b` | 17:30 | Docker 컨테이너화 (Dockerfile, docker-compose, standalone) |
| `f285883` | 17:33 | Docker 환경변수 충돌 해결 (env_file 방식) |
| `195cc7d` | 17:38 | 브라우저/서버 Supabase URL 분리 |
| `e6c98ed` | 17:58 | 이미지 표시 수정 + 결제 에러 메시지 개선 |

---

## 6. 현재 실행 환경

### 로컬 개발 (npm run dev)
```bash
supabase start
npm run dev
# → http://localhost:3000
```

### Docker 컨테이너
```bash
supabase start
docker compose up --build
# → http://localhost:3000
```

두 환경 모두 로컬 Supabase (`localhost:54321`)를 사용하며, Docker 환경에서는 `host.docker.internal`을 통해 호스트의 Supabase에 접근한다.
