1. 개요 (Executive Summary)
MEMIT은 "Memory + It"의 합성어로, 사용자가 기억하고 싶은 정보(숫자, 비밀번호, 사람 이름, 연설문 등)를 입력하면 자체 구축된 0~100 숫자 변환 시스템과 생성형 AI를 활용하여 즉시 '기억하기 쉬운 이미지와 스토리'로 변환해주는 서비스다. 복잡한 기억술 훈련 없이도 누구나 천재적인 기억력을 가질 수 있도록 돕는 "제2의 두뇌(Digital Brain)"를 지향한다.

2. 문제 정의 (Problem Statement)
비밀번호 관리의 고통: 사이트마다 제각각인 비밀번호 규칙으로 인해 관리가 어렵고, 보안에 취약한 쉬운 비밀번호를 사용하거나 메모장에 적어두는 위험을 감수한다.

사회적 기억 실패: 비즈니스 미팅 후 상대방의 이름이나 특징을 잊어버려 신뢰를 잃는 경우가 빈번하다.

기억술의 높은 진입장벽: '기억의 궁전'이 효과적인 것은 알지만, 장소를 설정하고 이미지를 상상하는 과정이 번거롭고 어려워 일반인이 시도하기 힘들다.

3. 핵심 가치 및 목표 (Value Proposition)
Instant Encoding: "입력하는 순간 기억된다." (AI가 상상 과정을 자동화)

Pain-Free Security: 뇌를 가장 안전한 보안 저장소로 활용 (해킹 불가능).

Action-Oriented Memory: "고민하지 말고, 그냥 메밋하세요 (Just Memit)."

4. 타겟 유저 (Target Audience)
Primary: 수많은 비밀번호와 핀 번호 관리에 지친 현대인.

Secondary: 많은 사람을 만나는 영업직/CEO/프리랜서.

Tertiary: 암기 과목 공부가 필요한 수험생 및 자기계발러.

5. 핵심 기능 (Key Features) - MVP Scope
5.1. [Killer] 양방향 보안 변환기 (Bi-Directional Converter)
가장 우선순위가 높은 킬러 기능으로, 메인 화면 최상단에 배치한다.

Mode 1: 숫자 → 스토리 (Number to Story)

입력: 신용카드 번호, 계좌번호, 도어락 비번 (예: 7082)

로직: 자체 DB(0~100 리스트) 매핑 (70=총알, 82=파리)

출력: "총알이 날아와 파리를 맞추는 이미지" + 스토리 텍스트 생성.

**[Advanced Interaction]** 사용자가 생성된 키워드를 제어할 수 있는 고급 기능을 제공한다:
- **수동 키워드 교체**: 생성된 각 단어 카드를 클릭하여 2~4개의 후보 단어 중 하나를 직접 선택할 수 있다.
- **키워드 고정(Pin/Lock)**: 자물쇠 아이콘을 통해 특정 단어를 고정할 수 있으며, 이 단어들은 재변환 시에도 유지된다.
- **스토리 최적화**: 사용자가 직접 선택하거나 고정한 단어들을 기반으로 AI가 스토리를 재생성하여 암기 효율을 극대화한다.

Mode 2: 스토리 → 숫자 (Story to Number) = 강력한 비밀번호 생성

입력: 기억하기 쉬운 문구 (예: "우리집 강아지 뽀삐")

로직: 텍스트 분석(NLP) → 숫자/특수문자 변환 (뽀삐=88, 강아지=706)

출력: 88dog706! 같은 강력한 조합 생성 및 시각화.

5.2. 6대 카테고리별 맞춤 입력 (Context-Aware Inputs)
사용자가 선택한 카테고리에 따라 입력 폼(Form) 형식이 최적화되어야 한다.

🔐 보안 & 금융 (Security & Finance)

Input: 숫자 키패드 위주 (카드번호 포맷팅 0000-0000...).

Output: 4컷 만화 형태의 분할 이미지.

🤝 인맥 & 비즈니스 (People & Network)

Input: 사진 촬영/업로드 + 이름 텍스트 필드.

Output: 얼굴 랜드마크 위에 이름 연상 아이콘(자음 기반) 합성.

📚 학습 & 지식 (Study & Knowledge)

Input: 사건명 + 연도/수치.

Output: 사건 이미지와 숫자 이미지가 결합된 플래시카드.

🎤 발표 & 스피치 (Speech & Presentation)

Input: 대본(Script) 텍스트 에어리어.

Output: 핵심 키워드 추출 후 장소(기억의 궁전 경로) 순서대로 배치.

🛒 일상 & 생활 편의 (Daily Life)

Input: 체크리스트 (To-Do List).

Output: 신체 부위나 마트 경로에 물건 아이콘 배치.

🧠 두뇌 트레이닝 (Brain Training)

Content: 카드 외우기, 원주율 외우기 등 미니 게임.

Action: 랭킹 시스템 및 데일리 챌린지.

5.3. 커뮤니티: 명예의 전당 (Hall of Fame)
시나리오 공유: 사용자가 만든 기발한 암기 스토리(예: 주기율표 쉽게 외우기)를 공유.

추천/복사: 다른 사람의 시나리오를 '좋아요' 하거나 내 보관함(My Memit)으로 복사.

6. 정보 구조 (Information Architecture)
[App Structure]
├── 🏠 Home (Main Dashboard)
│   ├── Hero: 양방향 변환기 (Tab: 숫자암기 / 비번생성)
│   ├── Grid: 6대 카테고리 메뉴
│   └── Bottom: 명예의 전당 (추천 시나리오)
├── 📂 My Memit (Storage)
│   ├── 저장된 기억 목록 (검색/필터 지원)
│   └── 복습 테스트 (가리고 맞추기)
├── ⚙️ Settings
│   ├── 나만의 0~100 리스트 편집 (Customizing)
│   └── 알림 설정
└── 👤 Profile / Login
7. 기술 스택 (Tech Stack)
Frontend: Next.js (App Router), React, Tailwind CSS, Lucide React (Icons).

Backend/DB: Supabase (Auth, Postgres DB, Storage).

AI Engine: OpenAI API (GPT-4o or Claude 3.5 Sonnet) - 이미지 프롬프트 생성 및 텍스트 변환용.

Deployment: Vercel (Web), Capacitor (Mobile App Packaging).

8. 데이터베이스 스키마 설계 (Draft)
8.1. users (Supabase Auth 연동)
id (UUID), email, created_at

8.2. system_code_maps (Shared 2-digit & 3-digit Systems)
The system supports both 2-digit (00-99) and 3-digit (000-999) systems.

type (String): "2D" (00-99) or "3D" (000-999)

code (String): "00", "99", "000"...

keywords (Array<String>): ["얼음", "우유"...] (JSONB)

description (String, Optional): "현관", "장난감방" (Location context from 2-digit system) or others.

user_id (UUID, Nullable): NULL for system default, set for user custom.

8.3. memories (User Data)
id (UUID)

user_id (FK)

category (Enum): 'SECURITY', 'PEOPLE', 'STUDY'...

input_data (Text): 원본 데이터 (암호화 저장 필수)

encoded_story (Text): AI가 생성한 스토리

image_url (String): 생성된 결과 이미지

created_at (Timestamp)


9. UI/UX 가이드라인 (Design System)
Concept: "Digital Wallet for Brain" (깔끔함, 신뢰감, 지적임)

Color Palette:

Primary: Deep Indigo (#4F46E5) - 뇌, 심해, 우주를 상징.

Secondary: Violet (#7C3AED) - 창의성, 마법.

Background: Slate (#F8FAFC / Dark: #0F172A)

Typography:

Headings: Pretendard (Bold, Clean)

Body: Pretendard (Readable)

Interaction:

결과 화면은 "카드 뒤집기" 또는 "마법 가루가 뿌려지는" 듯한 애니메이션 효과로 '기억이 생성됨'을 시각적으로 강조.

입력 폼은 모바일 키패드가 바로 올라오도록 inputMode 설정 최적화.

**대시보드 (Dashboard) [IMPLEMENTED]**:
- `design/pcweb/3 memit_desktop_dashboard_-_variant_2_4` 기반 구현.
- Glassmorphism & Glow 효과 적용.
- 주요 위젯: AI Memory Gen, Mnemonic Key, Feature Cards, Brain Training.

10. 로드맵 (Roadmap)
Phase 1: MVP (W1 ~ W2)
프로젝트 세팅 (Next.js + Supabase).

[핵심] 0~100 변환 로직(JS) 구현.

메인 화면 UI (양방향 변환기) 구현.

보안/금융 카테고리 단일 기능 완성.

Phase 2: AI & Expansion (W3 ~ W4)
OpenAI API 연동 (스토리 자동 생성).

인맥/장보기 등 나머지 카테고리 UI 확장.

'My Memit' 보관함 및 데이터 저장 기능 구현.

Phase 3: Community & App (W5 ~ )
명예의 전당(커뮤니티) 기능 추가.

Capacitor를 이용한 Android/iOS 앱 패키징 및 출시.

