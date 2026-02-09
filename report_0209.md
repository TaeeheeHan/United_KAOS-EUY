# Kaos EUY! - 개발 보고서 (2026.02.09)

## 1. 오늘 진행사항

### 1-1. Supabase 로컬 환경 구축
- **Docker Desktop** 설치 (Homebrew → 수동 DMG 설치)
- **Supabase CLI** 설치 (`brew install supabase/tap/supabase`)
- `supabase start`로 로컬 Supabase 실행
  - 마이그레이션 7개 자동 적용 (users, products, orders, custom_orders, cart_items, order_items, storage)
  - Seed 데이터 적용
- `.env.local` 생성 (Supabase URL + anon key + service role key)
- 관리자 계정 생성: `admin@local.test` / `Admin1234!`

### 1-2. Duitku 결제 게이트웨이 연동
Duitku 결제 기능 구현 완료 (Production 환경).

**생성한 파일:**
| 파일 | 설명 |
|------|------|
| `src/app/api/payment/create/route.ts` | Duitku invoice 생성 API (MD5 서명 + 결제 URL 반환) |
| `src/app/api/payment/callback/route.ts` | Duitku 결제 완료 콜백 수신 (서명 검증 + 주문 상태 업데이트) |
| `src/app/api/payment/status/route.ts` | 결제 상태 확인 API |
| `src/lib/supabase/admin.ts` | Supabase service role 클라이언트 (콜백에서 RLS 우회용) |
| `supabase/migrations/20260209000000_payment_fields.sql` | orders 테이블 payment 필드 추가 |

**수정한 파일:**
| 파일 | 변경 내용 |
|------|-----------|
| `.env.local` | Duitku API 키, service role key 추가 |
| `.env.example` | 새 환경 변수 문서화 |
| `src/app/checkout/page.tsx` | "Pay Now" 버튼 → 주문 생성 후 Duitku 결제 페이지로 리다이렉트 |
| `src/app/checkout/thank-you/page.tsx` | 결제 상태 표시 (Paid/Awaiting/Failed) + sessionStorage 복구 |

**결제 플로우:**
```
고객 Checkout → 결제 수단 선택 (ShopeePay / Indomaret / Retail) → Pay Now 클릭
  → DB에 주문 생성 (status: pending, payment_status: unpaid)
  → Duitku에 invoice 생성 (MD5 서명 + paymentMethod)
  → Duitku 결제 페이지로 리다이렉트
  → 고객이 결제 진행
  → 결제 완료
  → Duitku가 /api/payment/callback POST
  → 서명 검증 → 주문 상태 업데이트 (processing, paid)
  → 고객 returnUrl → Thank You 페이지
```

**지원 결제 수단:**
| 코드 | 이름 | 설명 |
|------|------|------|
| SP | ShopeePay | E-Wallet |
| I1 | Indomaret | 편의점 결제 |
| FT | Retail | 소매점 결제 |

**DB 변경 (orders 테이블 새 컬럼):**
- `payment_reference TEXT` - Duitku 트랜잭션 참조 ID
- `payment_method TEXT` - 사용된 결제 수단
- `payment_status TEXT` - unpaid / paid / expired / failed
- `paid_at TIMESTAMPTZ` - 결제 완료 시각

---

## 2. 실행 방법

### 사전 요구사항
- Node.js 18+
- Docker Desktop (Supabase 로컬 실행용)

### 실행 순서

```bash
# 1. 프로젝트 폴더 이동
cd /Users/taehee_han/VibeCoding/United_KAOS-EUY

# 2. Docker Desktop 실행 (이미 실행 중이면 생략)
open -a Docker

# 3. Supabase 로컬 시작 (이미 실행 중이면 생략)
supabase start

# 4. 개발 서버 실행
npm run dev
```

### 접속 URL
| 서비스 | URL |
|--------|-----|
| **Next.js 앱** | http://localhost:3000 |
| **Supabase Studio** (DB 관리) | http://127.0.0.1:54323 |
| **Supabase API** | http://127.0.0.1:54321 |
| **Mailpit** (이메일 테스트) | http://127.0.0.1:54324 |

### 관리자 로그인
- URL: http://localhost:3000/admin/login
- Email: `admin@local.test`
- Password: `Admin1234!`

### Duitku 결제 정보
- Merchant Code: `D18538` (Production)
- 결제 수단: ShopeePay, Indomaret, Retail
- 결제 테스트: Checkout에서 결제 수단 선택 → "Pay Now" → Duitku 결제 페이지

### 1-3. Duitku 결제 오류 수정
**문제:** "Payment creation failed" - Merchant not found 에러
**원인:**
1. Merchant Code D18538은 Production 전용 → Sandbox URL에서 인식 불가
2. Duitku v2/inquiry API는 `paymentMethod` 파라미터가 필수

**해결:**
- `.env.local`의 `DUITKU_BASE_URL`을 `https://passport.duitku.com/webapi/api`로 변경
- API route에 `paymentMethod` 필드 추가
- Checkout 페이지에 결제 수단 선택 UI 추가 (ShopeePay, Indomaret, Retail)

### 유용한 명령어
```bash
# Supabase 상태 확인
supabase status

# Supabase 중지
supabase stop

# DB 리셋 (마이그레이션 + 시드 재적용)
supabase db reset

# TypeScript 타입 재생성
npm run supabase:types
```

---

## 3. 프로젝트 구조 (핵심)

```
United_KAOS-EUY/
├── src/
│   ├── app/
│   │   ├── api/payment/          ← [NEW] 결제 API 라우트
│   │   │   ├── create/route.ts
│   │   │   ├── callback/route.ts
│   │   │   └── status/route.ts
│   │   ├── checkout/             ← [MODIFIED] 결제 연동
│   │   │   ├── page.tsx
│   │   │   └── thank-you/page.tsx
│   │   ├── products/             ← 제품 카탈로그
│   │   ├── cart/                 ← 장바구니
│   │   ├── order-lookup/         ← 주문 조회
│   │   └── admin/                ← 관리자 페이지
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── browser.ts
│   │   │   ├── server.ts
│   │   │   └── admin.ts          ← [NEW] service role client
│   │   ├── api/                  ← Supabase API 레이어
│   │   └── hooks/                ← React Query 훅
│   ├── stores/                   ← Zustand 상태 관리
│   └── types/                    ← TypeScript 타입
├── supabase/
│   ├── migrations/               ← DB 마이그레이션 (8개)
│   ├── seed.sql                  ← 초기 데이터
│   └── config.toml               ← 로컬 Supabase 설정
└── .env.local                    ← 환경 변수 (Git 제외)
```

---

## 4. 기술 스택

| 분류 | 기술 |
|------|------|
| Frontend | Next.js 14, React 18, TypeScript, Tailwind CSS |
| 상태관리 | Zustand (cart, order), React Query (서버 상태) |
| DB/Auth | Supabase (PostgreSQL + Auth + Storage) |
| 결제 | Duitku Payment Gateway (Production) |
| 폼 검증 | React Hook Form + Zod |
| 애니메이션 | Framer Motion |
| 아이콘 | Lucide React |
