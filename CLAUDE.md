# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**입금 안내문 이미지 생성 시스템**

이 프로젝트는 은행 계좌 정보를 입력받아 깔끔한 디자인의 입금 안내문 이미지를 자동으로 생성하는 웹 애플리케이션입니다.

### Port Configuration
- **Port Range**: 3130-3139
- **Default Port**: 3130
- **Project Type**: vite-react
- **Port Management**: Integrated with workspace port management system

### 주요 기능
- 계좌 정보 입력 (예금주, 은행명, 계좌번호, 주의사항)
- 4가지 템플릿 디자인 (클래식, 모던, 미니멀, 비즈니스)
- Canvas 기반 고품질 이미지 생성
- PNG/JPEG 형식 다운로드 지원
- 실시간 미리보기
- **✨ Firebase 클라우드 저장/불러오기**
- **🎨 템플릿 커스터마이징** (색상, 폰트, 크기 조절)
- **⚡ 성능 최적화** (Lazy Loading, Debouncing, 성능 모니터링)
- **📋 클립보드 복사 기능**

## Development Environment

### Project Location
- **Path**: `/Users/sinclair/projects/card_template/`
- **Context**: Part of a larger workspace with multiple projects using React, Firebase, and Vite

### Technology Stack
- **Frontend**: React 18+, TypeScript
- **Build Tool**: Vite
- **UI Framework**: Material-UI v7
- **Image Generation**: HTML5 Canvas API
- **Canvas Library**: Fabric.js (installed but optional)
- **Backend**: Firebase (Firestore, Storage)
- **Package Manager**: npm

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
# Or use: python start.py

# Open browser at http://localhost:3130
```

## Development Commands

```bash
# Start development server (port 3130)
npm run dev

# Or use the port management system
python start.py        # Start server
python start.py stop   # Stop server
python start.py status # Check status

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
card_template/
├── src/
│   ├── components/
│   │   ├── BankInfoForm.tsx     # 계좌 정보 입력 폼
│   │   ├── TemplateSelector.tsx # 템플릿 선택 UI
│   │   ├── ImagePreview.tsx     # 이미지 미리보기 및 다운로드
│   │   ├── SavedTemplates.tsx   # 저장된 템플릿 관리
│   │   └── TemplateCustomizer.tsx # 템플릿 커스터마이징
│   ├── templates/
│   │   └── defaultTemplates.ts  # 템플릿 설정 정의
│   ├── utils/
│   │   ├── imageGenerator.ts    # Canvas 기반 이미지 생성 엔진
│   │   └── performanceUtils.ts  # 성능 최적화 유틸리티
│   ├── services/
│   │   ├── firebase.ts          # Firebase 초기화
│   │   └── templateService.ts   # 템플릿 저장/불러오기
│   ├── types/
│   │   └── index.ts             # TypeScript 타입 정의
│   ├── App.tsx                  # 메인 앱 컴포넌트
│   ├── main.tsx                 # React 진입점
│   └── index.css                # 글로벌 스타일
├── index.html                   # HTML 진입점
├── vite.config.ts               # Vite 설정
├── tsconfig.json                # TypeScript 설정
└── package.json                 # 프로젝트 의존성
```

## Key Development Principles

### File Size Management
- Keep all files under 600 lines (based on workspace DEVELOPMENT_RULES.md)
- Split large components into smaller, focused modules
- Separate business logic from UI components

### Security Best Practices
- Never commit `.env` files
- Store API keys and secrets in environment variables
- Use Firebase security rules for data protection
- Validate all user inputs

### Code Style
- Components: PascalCase (e.g., `CardComponent.tsx`)
- Utilities: camelCase (e.g., `cardUtils.ts`)
- Hooks: Start with 'use' (e.g., `useCardData.ts`)
- Constants: UPPER_SNAKE_CASE (e.g., `CARD_CONSTANTS.ts`)

## Common Workspace Patterns

### Firebase Integration
Most projects in this workspace use Firebase. Standard setup:
1. Create Firebase project
2. Configure in `.env`:
   ```
   VITE_FIREBASE_API_KEY=
   VITE_FIREBASE_AUTH_DOMAIN=
   VITE_FIREBASE_PROJECT_ID=
   VITE_FIREBASE_STORAGE_BUCKET=
   VITE_FIREBASE_MESSAGING_SENDER_ID=
   VITE_FIREBASE_APP_ID=
   ```
3. Initialize in `src/services/firebase.js`

### Vite Configuration
Standard Vite config for React projects:
```javascript
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Or another available port
    open: true
  }
})
```

### Port Management
The workspace uses a port management system. Common ports:
- 3000-3010: Reserved for backend services
- 5000-5999: Frontend development servers
- Check `start.py` scripts in other projects for port allocation patterns

## Key Components

### ImageGenerator Class (`src/utils/imageGenerator.ts`)
- Canvas 기반 이미지 생성 엔진
- 4가지 레이아웃 지원 (classic, modern, minimal, business)
- 고품질 이미지 생성 (2x 스케일링)
- 텍스트 래핑 및 자동 레이아웃

### Template System
- `TemplateConfig` 인터페이스로 템플릿 정의
- 크기, 색상, 폰트, 레이아웃 커스터마이징 가능
- 쉽게 새 템플릿 추가 가능

### Form Validation
- 필수 필드 검증 (예금주, 은행명, 계좌번호)
- Material-UI 폼 컴포넌트 사용
- 실시간 입력 상태 관리

## Common Development Tasks

### 새 템플릿 추가하기
1. `src/templates/defaultTemplates.ts`에 템플릿 정의 추가
2. `src/utils/imageGenerator.ts`에 레이아웃 함수 구현
3. 템플릿 선택기에 자동으로 표시됨

### 이미지 품질 조정
- `App.tsx`의 `handleGenerateImage` 함수에서 scale 값 조정
- 기본값: 2 (2배 해상도)

### 새 은행 추가
- `BankInfoForm.tsx`의 `banks` 배열에 추가

### Firebase 저장 기능 사용
```typescript
// 템플릿 저장
await saveTemplate(bankInfo, templateConfig, imageDataUrl)

// 템플릿 불러오기
const templates = await getTemplates(20)
```

### 성능 최적화 유틸리티
- `debounce`: 연속 호출 제한
- `throttle`: 호출 빈도 제한
- `memoize`: 결과 캐싱
- `PerformanceMonitor`: 성능 측정

## Firebase Configuration

### Environment Variables
프로젝트 루트에 `.env` 파일이 필요합니다:
```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### Firebase Services
- **Firestore**: 생성된 템플릿 정보 저장
- **Storage**: 생성된 이미지 파일 저장
- **Services Location**: `src/services/`
  - `firebase.ts`: Firebase 초기화
  - `templateService.ts`: 템플릿 저장/불러오기 기능

## Important Notes

1. **Canvas Rendering**: 이미지는 HTML5 Canvas API로 직접 렌더링됨
2. **High DPI Support**: 2x 스케일링으로 고해상도 디스플레이 지원
3. **Korean Font**: Noto Sans KR 폰트 사용 (Google Fonts)
4. **Responsive Design**: 모바일과 데스크탑 모두 지원
5. **Firebase Integration**: 생성된 템플릿을 클라우드에 저장 가능
6. **Security**: `.env` 파일은 반드시 `.gitignore`에 포함되어야 함

## Troubleshooting

### 폰트가 제대로 표시되지 않는 경우
- 인터넷 연결 확인 (Google Fonts 로드)
- `index.html`의 폰트 링크 확인

### 이미지 다운로드가 안 되는 경우
- 브라우저 다운로드 권한 확인
- 팝업 차단 해제

### Canvas 렌더링 문제
- 브라우저 개발자 도구 콘솔 확인
- Canvas 지원 브라우저 확인