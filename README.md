# PPTX Builder 2.0

**GitHub 레포지토리를 분석해서 AI로 자동으로 프레젠테이션을 생성하는 고급 도구**

## ✨ 특징

- 🔍 **GitHub 레포지토리 심층 분석**: Tags, commits, contributors, 변경 이력 자동 추적
- 🤖 **AI 콘텐츠 생성**: Google Gemini API로 고품질 슬라이드 콘텐츠 자동 생성
- 📊 **프로젝트 진화 추적**: Tag 간 변경사항 분석, 버전별 진화 과정 시각화
- 🎨 **전문적인 디자인**: 깔끔한 템플릿과 자동 레이아웃
- ⚡ **원클릭 실행**: 한 번의 명령으로 분석부터 PPTX 생성까지

## 🚀 빠른 시작

```bash
# 1. 설치
git clone https://github.com/Gimminu/pptx-builder.git
cd pptx-builder
npm install

# 2. API 키 설정
cp .env.example .env
# .env 파일을 열어서 GEMINI_API_KEY 입력

# 3. 실행
npm start -- https://github.com/user/repo

# 4. 결과 확인
open output/presentation.pptx
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
