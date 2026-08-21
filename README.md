# store.front

posselect.com 쇼핑몰의 **메인/랜딩 프론트엔드**. Next.js 15(App Router) + React 19 + Tailwind 4.
프로덕션에서는 `home.posselect.com`과 `www.posselect.com`으로 서비스된다.

> 저장소 이름은 `store.front`, K8s 리소스/이미지 이름은 `store-front`, 도메인은 `home.posselect.com`으로
> 셋 다 다르다. (2026-08-13에 `home.front` → `store.front`로 rename하면서 도메인은 그대로 뒀다.)

## 페이지

| 경로 | 내용 |
| --- | --- |
| `/` | 메인 — 배너, 베스트/신상품, 카테고리별 상품 |
| `/notices`, `/notices/[id]` | 공지사항 (`app/notices/data.ts`의 정적 데이터) |
| `/terms`, `/privacy` | 이용약관 / 개인정보처리방침 |
| `/profile` | 프로필 |
| `/health` | 헬스체크 (`{"status":"ok"}`) |

## 데이터를 어떻게 가져오는가

메인 페이지는 **서버 컴포넌트**이고, `lib/product-api.ts`의 `fetchProductApi()`가 클러스터 내부의
product-api를 직접 호출한다. 브라우저가 동일 출처로 부르는 다른 프론트와 다른 점이다.

```
app/page.tsx (SSR, revalidate 300~600s)
  └─ lib/product-api.ts → $PRODUCT_API_URL
                          (기본 http://product-api.customer.svc.cluster.local:8080)
       /api/products/main/{best,new,by-category,banners}, /api/categories
```

- 조회 실패는 전부 `catch` 후 빈 배열/빈 객체로 처리된다 → **인프라가 막혀도 에러가 아니라 "상품 없음"으로
  보인다.** 화면이 비면 `~/msa/customer/networkpolicy.yaml`의 `allow-product-api`에 `app: store-front`가
  있는지부터 확인할 것(2026-08-20 장애 원인).
- `app/api/store/main/*` 라우트 핸들러는 목업이며 현재 어디에서도 호출되지 않는다.

## 게이트웨이 경유 구조

모든 도메인의 단일 진입점은 Spring Cloud Gateway(`lee-dohyun/gateway`)다. 이 저장소는 직접 노출되지 않는다.

```
브라우저 → Traefik(Ingress) → spring-cloud-gateway → store-front.customer.svc.cluster.local:3000
```

게이트웨이 `application.yml`의 관련 라우트:

- `auth-api-home` — `home/www.posselect.com`의 `/api/auth/**` → auth-api
- `store-front-block-write` — 그 외 경로의 **POST/PUT/PATCH/DELETE를 403으로 차단**(msa #155 대응)
- `store-front` — 나머지 전부 → 이 앱

즉 이 저장소에 POST route handler나 Server Action을 추가하면 프로덕션에서 403이 된다. 자세한 함정은
`AGENTS.md` 참고.

## UI 공통 자산

- `@posselect/ui` — 디자인 시스템(git 의존성, `transpilePackages`로 트랜스파일). 고쳐도 이 저장소를
  재빌드해야 반영된다.
- 헤더/푸터는 `posselect-shell`(`shell.posselect.com/v1/*.js`)이 웹 컴포넌트로 제공한다.

## 로컬 개발

```bash
npm install
npm run dev        # http://localhost:3000

npm run typecheck  # tsc --noEmit — push 전 필수
npm run lint
```

로컬에서는 게이트웨이를 거치지 않으므로, 인증/쓰기 차단/화이트리스트 관련 동작은 로컬 결과만으로 판단할
수 없다. `PRODUCT_API_URL`이 클러스터 내부 주소를 기본값으로 쓰므로 메인 페이지 데이터는 로컬에서 비어
보이는 것이 정상이다.

## 배포 (K3s, CD 자동)

`.github/workflows/docker-image.yml`

1. main push / PR → Docker 이미지 빌드 후 `leedohyun1985/store.front:{latest,<sha>}`로 push
2. Trivy 취약점 스캔 (`exit-code: "0"` — **리포트 전용, 빌드를 막지 않는다**)
3. main push일 때만 self-hosted 러너(`k3s-home`)에서
   `kubectl set image deployment/store-front -n customer` → rollout 대기

**main에 push하면 곧바로 프로덕션에 반영된다.** CI는 lint/typecheck를 돌리지 않으므로 검증은 로컬 책임이다.
문서/설정만 바꾼 커밋에는 메시지 끝에 `[skip ci]`를 붙일 것.

## 관련 저장소

`gateway`(단일 진입점/인증) · `product.api`(상품) · `auth.api`(회원) · `posselect-ui` · `posselect-shell` ·
매니페스트는 `~/msa`.
