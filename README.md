# PPTX Builder

마크다운 파일로 PowerPoint 프레젠테이션을 자동으로 만드는 도구입니다.

`notes/` 폴더의 `.md` 파일과 `images/` 폴더의 이미지를 읽어서 `.pptx` 파일을 생성합니다.

## 빠른 시작

```bash
# 1. 클론
git clone https://github.com/Gimminu/pptx-builder.git
cd pptx-builder

# 2. 설치
npm install

# 3. notes/ 폴더에 마크다운 파일 작성 (예시 파일 있음)

# 4. 생성
npm run build

# 5. 열기
open presentation.pptx
```

## 사용 방법

### 1. Node.js 설치

[Node.js 공식 사이트](https://nodejs.org/)에서 LTS 버전을 다운로드하여 설치하세요.

### 2. 프로젝트 설정

```bash
git clone https://github.com/Gimminu/pptx-builder.git
cd pptx-builder
npm install
```

### 3. 내용 작성

`notes/` 폴더에 마크다운 파일을 생성합니다.

**예시: `notes/my-presentation.md`**

```markdown
# 프레젠테이션 제목

## 슬라이드 1: 소개
- 첫 번째 포인트
- 두 번째 포인트
- 세 번째 포인트

## 슬라이드 2: 주요 내용
- 포인트 A
- 포인트 B
- 포인트 C

## 슬라이드 3: 결론
- 요약
- 감사합니다
```

**마크다운 규칙:**
- `# 제목` → 타이틀 슬라이드
- `## 제목` → 콘텐츠 슬라이드  
- `- 내용` 또는 `* 내용` → 불릿 포인트

**이미지 추가 (선택사항):**

`images/` 폴더에 `.jpg`, `.png`, `.gif` 파일을 넣으면 자동으로 슬라이드가 생성됩니다.

### 4. 프레젠테이션 생성

```bash
npm run build
```

### 5. 결과 확인

```bash
# macOS
open presentation.pptx

# Windows
start presentation.pptx

# Linux
libreoffice --impress presentation.pptx
```

## 라이선스

MIT License
