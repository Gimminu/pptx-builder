# PPTX Builder 2.0 - AI-Powered Presentation Generator

🤖 **Gamma.app 수준의 AI 기반 프레젠테이션 자동 생성 시스템**

GitHub 저장소를 분석하여 전문적인 PowerPoint 프레젠테이션을 **AI가 자동으로 디자인**합니다.

## ✨ 특징

### 🎨 5가지 프로페셔널 템플릿
- **Professional** - 기업용, 딥블루 + 골드, 안정적
- **Modern** - 테크 중심, 인디고 + 핑크, 미니멀
- **Minimal** - 스위스 디자인, 흑백 + 레드, 초간결
- **Creative** - 창의적, 다채로운 색상, 그라디언트
- **Bold** - 대담한, 블랙 + 네온, 강렬한 타이포

### 🤖 AI 디자인 엔진
- ✅ **자동 템플릿 선택** - 프로젝트 성격 분석 후 최적 템플릿 선택
- ✅ **슬라이드 최적화** - 각 슬라이드마다 레이아웃 자동 결정
- ✅ **스마트 차트** - 데이터에 맞는 차트 타입 자동 선택
- ✅ **한국어 콘텐츠** - 고품질 한국어 슬라이드 생성

### 📊 GitHub 심층 분석
- 📦 저장소 메타데이터 (이름, 설명, 토픽, 언어)
- 🏷️  태그/릴리스 분석 및 버전 진화 추적
- 📈 커밋 타임라인 및 활동 패턴
- 👥 기여자 분석 및 팀 구성
- 💻 프로그래밍 언어 분포

## 🚀 빠른 시작

```bash
# 1. 설치
git clone https://github.com/Gimminu/pptx-builder.git
cd pptx-builder
npm install
pip install -r python/requirements.txt

# 2. API 키 설정 (선택사항 - fallback 생성기 사용 가능)
cp .env.example .env
# .env 파일을 열어서 GEMINI_API_KEY 입력

# 3. AI가 자동으로 템플릿 선택
npm start -- https://github.com/user/repo

# 또는 특정 템플릿 지정
npm start -- https://github.com/user/repo --theme modern

# 4. 결과 확인
open output/presentation.pptx
```

## 📐 템플릿 선택 가이드

| 템플릿 | 용도 | 색상 | 특징 |
|--------|------|------|------|
| **professional** | 기업 발표, 투자 유치 | 딥블루 + 골드 | 안정적, 신뢰감 |
| **modern** | 테크 컨퍼런스, 개발자 | 인디고 + 핑크 | 세련됨, 미니멀 |
| **minimal** | 학술 발표, 간결한 자료 | 흑백 + 레드 | 초간결, 여백 중시 |
| **creative** | 디자인 쇼케이스, 창의적 | 다채로운 색상 | 화려함, 임팩트 |
| **bold** | 스타트업 피칭, 혁신적 | 블랙 + 네온 | 강렬함, 대담함 |

## 🎯 사용 예시

```bash
# 기업용 프레젠테이션
npm start -- https://github.com/mycompany/product --theme professional

# 오픈소스 프로젝트 소개
npm start -- https://github.com/username/opensource-project --theme modern

# 스타트업 피칭덱
npm start -- https://github.com/mystartup/mvp --theme bold

# 학술 발표 자료
npm start -- https://github.com/researcher/paper-impl --theme minimal
```

## 📋 사전 요구사항

### 필수 설치
- **Node.js** 18+ ([다운로드](https://nodejs.org/))
- **Python** 3.9+ (macOS/Linux는 기본 설치됨)
- **GitHub CLI** ([다운로드](https://cli.github.com/))

### GitHub CLI 설치 (Mac)
```bash
brew install gh
gh auth login
```

### Python 패키지
```bash
python3 -m pip install python-dotenv google-generativeai
```

## 🔑 API 키 설정

### Google Gemini API 키 받기
1. https://makersuite.google.com/app/apikey 방문
2. "Create API key" 클릭
3. 키 복사

### `.env` 파일 설정
```bash
# .env 파일 생성
GEMINI_API_KEY=여기에_복사한_API_키_붙여넣기
```

## 💻 사용법

### 기본 사용
```bash
npm start -- <GitHub_레포_URL>
```

### 옵션 지정
```bash
npm start -- <레포_URL> --theme modern --output my-presentation.pptx
```

### 예시
```bash
# 기본
npm start -- https://github.com/Gimminu/capstone-design

# 커스텀 출력 파일명
npm start -- https://github.com/user/repo --output demo.pptx

# 다른 테마
npm start -- https://github.com/user/repo --theme minimal
```

## 📁 프로젝트 구조

```
pptx-builder/
├── python/                          # Python 분석 모듈
│   ├── github_analyzer_advanced.py  # GitHub API 분석
│   ├── ai_generator_advanced.py     # AI 콘텐츠 생성
│   └── requirements.txt             # Python 의존성
├── src/
│   ├── cli.js                       # 메인 CLI
│   └── templates/                   # PPTX 템플릿 (추가 예정)
├── data/                            # 중간 데이터
│   ├── github_analysis.json         # 분석 결과
│   └── presentation_content.json    # 생성된 콘텐츠
├── output/                          # 생성된 PPTX 파일
├── .env                             # API 키 (gitignore됨)
├── .env.example                     # API 키 템플릿
└── package.json
```

## 🔄 워크플로우

```
1. GitHub Repository
      ↓
2. [Python] 고급 분석
   - 레포 메타데이터
   - Tags & Releases
   - Tag 간 변경 이력
   - Commit 타임라인
   - Contributors
   - 언어 분석
      ↓
3. [Python] AI 콘텐츠 생성
   - Google Gemini API
   - 프로젝트 진화 스토리
   - 전문적인 슬라이드 구성
      ↓
4. [Node.js] PPTX 생성
   - 템플릿 적용
   - 슬라이드 생성
   - 스타일링
      ↓
5. presentation.pptx ✅
```

## 📊 분석 항목

### GitHub 레포지토리 분석
- ✅ 기본 정보 (이름, 설명, 스타, 포크)
- ✅ Tags/Releases 목록
- ✅ Tag 간 변경 이력 (commits, features, fixes)
- ✅ Commit 타임라인 (월별 활동)
- ✅ Contributors 분석
- ✅ 언어 구성 비율
- ✅ 프로젝트 목표 추출 (README 파싱)

### 생성되는 슬라이드
1. 제목 슬라이드
2. 프로젝트 개요
3. 기술 스택
4. 버전 진화 과정 (Tags 분석)
5. 개발 활동 타임라인
6. 팀 & Contributors
7. 통계 요약

## ⚙️ 고급 사용법

### Python 스크립트 직접 실행
```bash
# 1. GitHub 분석만
python3 python/github_analyzer_advanced.py https://github.com/user/repo

# 2. AI 콘텐츠 생성만
python3 python/ai_generator_advanced.py data/github_analysis.json

# 3. Node.js로 PPTX 생성
node src/cli.js https://github.com/user/repo
```

### 프로그래밍 방식 사용
```javascript
import PPTXBuilder from './src/cli.js';

const builder = new PPTXBuilder('https://github.com/user/repo', {
  theme: 'professional',
  output: 'my-deck.pptx'
});

await builder.build();
```

## 🎨 템플릿 (향후 추가)

현재 지원: `professional` (기본)

계획:
- `modern` - 현대적이고 미니멀한 디자인
- `minimal` - 깔끔하고 단순한 디자인
- `colorful` - 활기찬 컬러풀한 디자인

## 🐛 문제 해결

### "gh CLI not found"
```bash
# Mac
brew install gh
gh auth login

# Linux
# https://github.com/cli/cli/blob/trunk/docs/install_linux.md

# Windows
# https://github.com/cli/cli#installation
```

### "GEMINI_API_KEY not found"
1. `.env` 파일이 프로젝트 루트에 있는지 확인
2. 파일 내용: `GEMINI_API_KEY=실제_API_키`
3. API 키에 공백이나 따옴표 없이 바로 입력

### "Python module not found"
```bash
python3 -m pip install python-dotenv google-generativeai
```

### AI 생성 실패 시
- Fallback으로 기본 콘텐츠가 자동 생성됩니다
- 품질은 낮지만 분석 데이터는 포함됩니다
- API 키를 확인하고 다시 시도하세요

## 📝 라이선스

MIT License

## 🤝 기여

Issue와 Pull Request 환영합니다!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing feature`)
5. Open a Pull Request

## 📧 문의

GitHub Issues: https://github.com/Gimminu/pptx-builder/issues
