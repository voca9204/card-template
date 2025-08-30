# 입금 안내문 이미지 생성기

은행 계좌 정보를 입력하면 깔끔한 디자인의 입금 안내문 이미지를 자동으로 생성해주는 웹 애플리케이션입니다.

## 🚀 주요 기능

- **간편한 정보 입력**: 예금주, 은행명, 계좌번호를 간단히 입력
- **4가지 템플릿**: 클래식, 모던, 미니멀, 비즈니스 스타일 제공
- **실시간 미리보기**: 입력한 정보가 즉시 이미지로 변환
- **고품질 이미지**: 2배 해상도로 선명한 이미지 생성
- **다운로드 지원**: PNG/JPEG 형식으로 다운로드 가능
- **Firebase 연동**: 생성된 템플릿을 클라우드에 저장

## 🛠 기술 스택

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI Framework**: Material-UI v7
- **Image Generation**: HTML5 Canvas API
- **Backend**: Firebase (Firestore, Storage)
- **Styling**: Emotion (CSS-in-JS)

## 📦 설치 및 실행

### 필수 요구사항
- Node.js 18+ 
- npm 또는 yarn
- Firebase 프로젝트 (선택사항)

### 설치
```bash
# 의존성 설치
npm install
```

### 환경 설정
1. `.env.example` 파일을 `.env`로 복사
2. Firebase 프로젝트 정보 입력 (선택사항)

### 실행
```bash
# 개발 서버 실행 (포트 3130)
npm run dev

# 또는 포트 관리 시스템 사용
python3 start.py
```

### 빌드
```bash
# 프로덕션 빌드
npm run build

# 빌드 미리보기
npm run preview
```

## 🎨 템플릿 종류

### 1. 클래식 (Classic)
- 전통적인 레이아웃
- 명확한 정보 구분
- 비즈니스 문서에 적합

### 2. 모던 (Modern)
- 카드 스타일 디자인
- 그라데이션 배경
- 세련된 느낌

### 3. 미니멀 (Minimal)
- 중앙 정렬 레이아웃
- 최소한의 장식
- 깔끔한 스타일

### 4. 비즈니스 (Business)
- 전문적인 디자인
- 2단 레이아웃
- 헤더/푸터 포함

## 📁 프로젝트 구조

```
card_template/
├── src/
│   ├── components/         # React 컴포넌트
│   │   ├── BankInfoForm.tsx
│   │   ├── TemplateSelector.tsx
│   │   └── ImagePreview.tsx
│   ├── templates/          # 템플릿 설정
│   ├── utils/              # 유틸리티
│   │   └── imageGenerator.ts
│   ├── services/           # Firebase 서비스
│   │   ├── firebase.ts
│   │   └── templateService.ts
│   └── types/              # TypeScript 타입
├── .env                    # 환경 변수 (Git 제외)
├── firebase.json           # Firebase 설정
└── vite.config.ts          # Vite 설정
```

## 🔒 보안

- 환경 변수는 `.env` 파일에 저장
- `.env` 파일은 절대 Git에 커밋하지 않음
- Firebase 보안 규칙 적용

## 🚢 배포

### Firebase Hosting
```bash
# Firebase CLI 설치
npm install -g firebase-tools

# Firebase 로그인
firebase login

# 프로젝트 초기화
firebase init

# 배포
npm run build
firebase deploy
```

## 📝 라이선스

MIT License

## 🤝 기여

버그 리포트나 기능 제안은 GitHub Issues를 통해 제출해주세요.

---

Made with ❤️ using React and Firebase