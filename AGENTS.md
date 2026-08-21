# store.front AI 개발 지침

> **캐논 참조**: 공통 개발 원칙(DB/트랜잭션/보안/배포 규칙 등)은 `~/msa/AGENTS.md`를 따른다.
> 이 문서에는 **이 저장소에서만 통하는 사실과 함정**만 적는다.

## 이 저장소는 무엇인가

`home.posselect.com` / `www.posselect.com`을 서비스하는 Next.js(App Router) **쇼핑몰 메인/랜딩** 프론트엔드다.
게이트웨이 라우트 `store-front`(`~/git/gateway/src/main/resources/application.yml`)가 이 호스트를
`store-front.customer.svc.cluster.local:3000`으로 프록시하고, K3s에는 `customer` 네임스페이스의
`deployment/store-front`로 떠 있다.

페이지: `/`(메인), `/notices`, `/notices/[id]`, `/terms`, `/privacy`, `/profile`, `/health`(헬스체크).

## 실제 함정 (전부 이 저장소 코드/설정에서 확인된 것)

### 1. 메인 페이지는 게이트웨이가 아니라 클러스터 내부로 직접 나간다 → NetworkPolicy가 곧 장애 지점

`app/page.tsx`는 서버 컴포넌트이고, `lib/product-api.ts`의 `fetchProductApi()`가
`PRODUCT_API_URL`(기본 `http://product-api.customer.svc.cluster.local:8080`)로 **직접** 호출한다.
브라우저에서 동일 출처로 부르는 다른 프론트와 다르다.

- 따라서 `~/msa/customer/networkpolicy.yaml`의 `allow-product-api` ingress에 `app: store-front`가
  **반드시** 있어야 한다. 2026-08-20에 이게 빠져서 home.posselect.com의 상품/배너가 전부 비어 보이는
  장애가 났다(해당 파일 주석에 경위가 기록돼 있음).
- 더 나쁜 점: `getBestProducts()` 등 모든 조회 함수가 `catch` 후 `[]` / `{}`를 반환한다. 즉
  **인프라가 막혀도 에러가 아니라 "상품 없음"으로 보인다.** 화면이 비면 코드보다 netpol/서비스 상태를
  먼저 의심할 것.

### 2. 이 호스트는 게이트웨이에서 쓰기 요청이 전부 차단돼 있다

게이트웨이 라우트 `store-front-block-write`가 `home.posselect.com`/`www.posselect.com`의
POST/PUT/PATCH/DELETE를 `SetStatus=403`으로 막는다(msa #155, Next.js RCE 침해 정황 대응 완화책).
`/api/auth/**`만 `auth-api-home` 라우트가 먼저 채간다.

- **route handler에 `POST`를 추가하거나 Server Action을 쓰면 프로덕션에서 403이 된다.** 로컬 dev에서는
  게이트웨이를 안 거치므로 멀쩡히 동작해서 배포 후에야 드러난다.
- 쓰기가 필요하면 이 저장소가 아니라 백엔드 API(auth-api/order-api)에 넣고, 게이트웨이에 해당 경로
  라우트를 별도로 추가해야 한다.

### 3. 로그인 전 접근이 필요한 페이지는 게이트웨이 화이트리스트도 같이 봐야 한다

현재 `home.posselect.com`은 게이트웨이 `protected-hosts`(기본값 `customer.posselect.com`)에 없어서
이 저장소 페이지는 기본 공개다. 하지만 이 저장소가 보호 호스트의 API를 부르거나 이 호스트가
`protected-hosts`에 추가되는 순간, **페이지 경로와 그 페이지가 부르는 API 경로는 각각 별개의
화이트리스트 항목**이 된다(2026-08-02 `customer.front` `/verify` 인시던트, gateway 커밋 `0565a01`).
판단이 필요하면 `.claude/agents/gateway-route-guard.md` 서브에이전트를 쓸 것.

### 4. `app/api/store/main/*` 라우트는 현재 아무도 안 부른다

`app/api/store/main/{banners,best,by-category,new}/route.ts`가 목업 데이터를 반환하지만,
`app/page.tsx`는 이걸 쓰지 않고 product-api의 `/api/products/main/*`를 직접 호출한다.
메인 데이터가 이상하면 이 목업 라우트가 아니라 **product-api와 DB 시드**를 봐야 한다.

### 5. `@posselect/ui`는 git 의존성이라 자동 반영되지 않는다

`package.json`의 `"@posselect/ui": "github:lee-dohyun/posselect-ui"` + `next.config.ts`의
`transpilePackages`. 버전이 고정돼 있지 않고, posselect-ui를 고쳐도 **이 저장소를 다시 빌드해야**
화면에 반영된다(소비 저장소 5곳 각각).

그리고 **정의되지 않은 CSS 변수는 조용히 죽는다.** `var(--color-primary)`처럼 posselect-ui의
`tokens.css`에 없는 변수를 배경색으로 쓰면 에러 없이 배경이 투명해져 텍스트만 흐릿하게 남는다
(hero 배너 인시던트). `app/api/store/main/banners/route.ts`의 `bgColor` 값이 그 사례다.
새 CSS 변수를 쓰기 전에 posselect-ui의 토큰 정의를 먼저 확인할 것.

### 6. 프로덕션 이미지는 최상위 파일을 골라서만 복사한다

`Dockerfile`의 production 스테이지는 `.next`, `node_modules`, `package.json`, `public`,
`next.config.ts`만 COPY한다. 런타임에 필요한 최상위 파일을 새로 추가하면 **Dockerfile도 같이 고쳐야
한다**(next.config.ts 누락으로 상품 이미지가 안 뜬 2026-08-20 사례).
`next.config.ts`의 `images.remotePatterns`에는 `posselect.com`, `image.posselect.com`만 등록돼
있으므로 새 이미지 호스트를 쓰면 여기도 추가해야 한다.

### 7. CI는 타입/린트를 안 본다. main push = 즉시 프로덕션

`.github/workflows/docker-image.yml`은 Docker 빌드/푸시 성공만을 게이트로 삼고 `lint`/`typecheck`를
돌리지 않는다(Trivy 스캔도 `exit-code: "0"` 리포트 전용). 이어지는 `deploy` 잡이 self-hosted 러너에서
`kubectl set image deployment/store-front -n customer`를 실행하므로 **main에 push하는 순간 프로덕션에
반영된다.**

→ push 전에 로컬에서 반드시 실행:

```bash
npm run typecheck   # tsc --noEmit
npm run lint
```

`.claude/hooks/pre-push-verify.sh`가 PreToolUse 훅으로 이걸 강제한다(정당한 사유가 있을 때만
`CLAUDE_SKIP_PUSH_VERIFY=1`).

## 작업 기록

`~/msa/AGENTS.md` §4의 Task Execution Workflow를 따른다. 이 저장소에 한정된 주의:

- **Draft Issue를 만들지 말 것.** 저장소에 연결되지 않은 Draft 카드는 추적이 끊기고, 과거 중복 카드가
  210여 건 쌓인 사고가 있었다. 반드시 `gh issue create -R lee-dohyun/store.front ...`로 **실제 저장소
  이슈**를 만든 뒤 GitHub Project #2에 연결하고 Status를 `In Progress`로 바꾼 다음 코드를 건드린다.
  (`gh`는 풀 경로 `~/.local/bin/gh`.)
- 완료 시 커밋 메시지의 `Closes #N` 또는 `gh issue close`로 반드시 닫는다.
- 상세 절차는 `msa-work-log` 스킬(사용자 레벨, 이 저장소 세션에서도 로드됨)을 따른다.

## 커밋

- 주석/문서 스타일은 `docs/COMMENT_STANDARDS.md`를 따른다.
- 문서·설정만 바꾼 커밋은 메시지 끝에 `[skip ci]` — 안 붙이면 불필요한 프로덕션 배포가 돈다.
