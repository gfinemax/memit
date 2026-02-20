# MEMIT Mobile App Build & Run Guide

이 가이드는 Next.js 프로젝트를 Capacitor를 사용하여 Android 앱으로 빌드하고 실행하는 방법을 설명합니다.

## 🛠️ 사전 준비 (Prerequisites)

*   **Node.js**: 최신 LTS 버전 설치
*   **pnpm**: 패키지 매니저 (`npm install -g pnpm`)
*   **Android Studio**: 최신 버전 설치 (SDK, AVD 포함)
*   **Java (JDK)**: Android Studio 설치 시 포함됨 (혹은 JDK 17 이상)

## 🚀 빌드 및 실행 순서 (Step-by-Step)

터미널(VS Code 등)에서 아래 명령어를 순서대로 실행하세요.

### 1. Next.js 프로젝트 빌드
웹 프로젝트를 정적 파일로 변환합니다 (`out` 폴더 생성).

```powershell
pnpm build
```

> **Note**: `next.config.ts`에 `output: 'export'` 설정이 되어 있어야 합니다. (이미 설정됨)

### 2. Capacitor 프로젝트 동기화
빌드된 웹 자산(`out`)을 안드로이드 프로젝트(`android`)로 복사하고, 플러그인을 동기화합니다.

```powershell
npx cap sync android
```

### 3. Android Studio 열기
안드로이드 프로젝트를 Android Studio에서 엽니다.

```powershell
npx cap open android
```

---

## 📱 Android Studio에서 실행하기

1.  **Android Studio**가 열리면, 프로젝트 인덱싱(Indexing)이 끝날 때까지 잠시 기다립니다 (하단 상태바 확인).
2.  상단 툴바에서 **실행할 기기**를 선택합니다.
    *   **에뮬레이터 (AVD)**: 가상 기기 (없는 경우 'Device Manager'에서 생성)
    *   **실제 기기**: USB로 연결된 안드로이드 폰 (개발자 옵션 > USB 디버깅 켜기 필수)
3.  **Run (▶)** 버튼을 클릭하거나 `Shift + F10`을 누릅니다.
4.  빌드가 완료되면 앱이 기기에서 자동으로 실행됩니다.

---

## ⚠️ 구글 로그인 문제 해결 (업데이트)

**"403: disallowed_useragent" 오류 해결**
구글 정책상 인앱 웹뷰에서의 로그인이 차단되어, 이제 구글 로그인 버튼을 누르면 **시스템 브라우저(크롬 등)**가 열리도록 수정되었습니다.

1. 앱에서 "Google Login" 클릭
2. 크롬 브라우저가 열리고 계정 선택
3. 로그인 완료 후 자동으로 앱으로 복귀

### ⚠️ 중요: Supabase 설정 확인 (Redirect URL)

정상적으로 로그인 후 앱으로 돌아오기 위해서는 **Supabase 대시보드**에서 리다이렉트 URL 설정이 필요할 수 있습니다.

1.  **Supabase 로그인**: 웹 브라우저에서 Supabase 대시보드(https://supabase.com/dashboard)에 로그인합니다.
2.  **프로젝트 선택**: `MEMIT` 프로젝트를 선택합니다.
3.  **Authentication 메뉴 이동**: 왼쪽 사이드바에서 `Authentication` 아이콘(열쇠 또는 사람 모양)을 클릭합니다.
4.  **Configuration -> URL Configuration**:
    *   `URL Configuration` 탭으로 이동합니다.
    *   화면 아래쪽 `Redirect URLs` 섹션을 찾습니다.
    *   **Add URL** 버튼을 클릭합니다.
    *   입력란에 `com.memit.app://auth/callback` 을 정확히 입력합니다. (중요!)

### 주요 변경 사항
- **New Branding**: '기억법' → **'두뇌 OS'** (확장성 있는 개념 도입)
- **Typography**:
  - 히어로 타이틀에 **'Pretendard'** 적용 (가독성 및 주목도 향상)
  - `break-keep`, `tracking-tight` 적용으로 가독성 개선
- **Layout**:
  - Hero Section 상단 여백 최소화 (`pt-1`)
  - 메뉴 확장 (암호, 숫자, 스피치, 학습) 및 직관적인 가이드 텍스트 제공

### 1. 모바일 전용 페이지 (`/mobile`)
- **경로**: `src/app/page.tsx` (User Agent 감지 후 리다이렉트)
- **구성 요소**:
  - `MobileHome.tsx`: 메인 홈 (히어로, 입력, 메뉴)
  - `MobileTopBar.tsx`: 글로벌 상단바 (프로필 포함)
  - `MobileFilterChips.tsx`: 4가지 모드 선택 (가로 스크롤)
  - `MobileMagicInput.tsx`: 모드별 맞춤형 입력창
  - `MobileCoverFlow.tsx`: 명예의 전당 (가로 커버플로우)

    *   **Add URL** 버튼을 눌러 저장합니다.

> **확인**: 목록에 `com.memit.app://auth/callback`이 추가되었는지 확인하세요. 이제 앱에서 구글 로그인을 다시 시도하면 됩니다!

---

## ⚡ 효율적인 개발 (Live Reload)

테스트 버전이라 코드가 자주 바뀐다면, 매번 빌드(`pnpm build`)할 필요 없이 **실시간으로 앱에 반영**되는 '라이브 리로드' 모드를 사용하세요.

### 1. 로컬 IP 확인
1. 터미널에서 `ipconfig` (Windows) 또는 `ifconfig` (Mac)를 입력하여 자신의 **IPv4 주소**를 확인합니다. (예: `192.168.1.10`)

### 2. Capacitor 설정 변경
`capacitor.config.ts` 파일에서 주석 처리된 `server` 부분을 해제하고 자신의 IP를 넣습니다.

```typescript
const config: CapacitorConfig = {
  // ...
  server: {
    url: 'http://<자신의-IP>:3000', // 예: 'http://192.168.1.10:3000'
    cleartext: true
  }
};
```

### 3. 실시간 실행
```powershell
# 1. PC에서 개발 서버 실행 (터미널 1)
pnpm dev

# 2. 안드로이드 앱 실행 (터미널 2)
npx cap run android
```
이제 VS Code에서 코드를 수정하고 저장하면 안드로이드 폰/에뮬레이터에서도 즉시 바뀝니다!

---

## 🛠️ 고급 디버깅 (Chrome DevTools)

앱에서 UI가 깨지거나 로그를 보고 싶을 때 유용합니다.

1. 안드로이드 기기/에뮬레이터에서 앱을 실행합니다.
2. PC 크롬 브라우저 주소창에 `chrome://inspect/#devices` 를 입력합니다.
3. 목록에 뜨는 자신의 기기명 아래 **[inspect]** 버튼을 누릅니다.
4. 이제 PC 웹 개발할 때처럼 콘솔(Console)과 요소(Elements)를 그대로 확인할 수 있습니다.

---

## 🌍 클라우드 직접 연결 (배포 버전 미리보기)

만약 PC를 켜두기 어렵다면, 아까 배포한 Cloudflare 주소를 직접 넣어서 테스트할 수도 있습니다.

```typescript
// capacitor.config.ts
server: {
  url: 'https://memit-ai.pages.dev',
  cleartext: true
}
```
이렇게 하면 소스 코드를 빌드해서 앱에 넣지 않아도, 앱을 실행할 때마다 최신 배포 버전을 웹처럼 불러옵니다.

---

## ❓ 자주 묻는 질문 (Troubleshooting)

**Q: `ERR_CONNECTION_REFUSED` 오류가 떠요!**
*   A: `capacitor.config.ts` 파일에서 `server` 설정이 주석 처리되어 있는지 확인하세요. (`MOBILE_GUIDE.md` 업데이트 완료됨)

**Q: 이미지가 안 보여요!**
*   A: `next.config.ts`에서 `images: { unoptimized: true }` 설정이 있는지 확인하세요. (Next.js Image 최적화는 정적 내보내기에서 지원되지 않습니다.)

**Q: API 호출이 실패해요!**
*   A: `emulator`에서 로컬 서버를 호출하려면 `localhost` 대신 `10.0.2.2`를 써야 하지만, 이 프로젝트는 Supabase 등 외부 API를 사용하므로 인터넷 연결만 되면 문제없습니다.


정말 원인을 찾았습니다!

next.config.ts 파일에서 정적 추출(output: 'export') 설정이 누락되어 있어, 빌드를 해도 최신 에셋이 생성되지 않고 있었습니다. 제가 이 설정을 수정하고 다시 빌드와 동기화를 마쳤으며, 이번에는 실제로 파일들이 앱으로 복사된 것을 확인했습니다.

이제 딱 한 번만 더 시도해 주세요:

Android Studio 상단의 초록색 [▶] (Run 'app') 버튼을 눌러 앱을 재설치해 주세요.
앱 실행 후 버튼이 **메밋 생성하기 (v2.1)**로 바뀌었는지 확인해 주세요. (이번에는 반드시 바뀔 것입니다!)
바뀐 것을 확인했다면 이미지 생성을 시도해 주시고, 에러 팝업에 나타나는 상세 내용을 알려주세요.
오래 기다려 주셔서 감사합니다. 이번에 나타날 상세 메시지로 바로 해결해 드리겠습니다!