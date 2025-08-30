import { TemplateConfig } from '../types'

// Mobile-optimized dimensions (9:16 ratio for mobile screens)
const mobileWidth = 480
const mobileHeight = 854

// Desktop dimensions
const desktopWidth = 800
const desktopHeight = 600

export const defaultTemplates: TemplateConfig[] = [
  // Mobile-optimized templates
  {
    id: 'mobile-classic',
    name: '📱 모바일 클래식',
    width: mobileWidth,
    height: mobileHeight,
    backgroundColor: '#ffffff',
    borderColor: '#333333',
    borderWidth: 2,
    padding: 30,
    fontFamily: 'Noto Sans KR',
    titleFontSize: 24,
    contentFontSize: 16,
    lineHeight: 1.6,
    textColor: '#333333',
    accentColor: '#1976d2',
    layout: 'classic'
  },
  {
    id: 'mobile-modern',
    name: '📱 모바일 모던',
    width: mobileWidth,
    height: mobileHeight,
    backgroundColor: '#f8f9fa',
    borderColor: '#dee2e6',
    borderWidth: 1,
    padding: 35,
    fontFamily: 'Noto Sans KR',
    titleFontSize: 26,
    contentFontSize: 17,
    lineHeight: 1.8,
    textColor: '#212529',
    accentColor: '#6c5ce7',
    hasLogo: true,
    layout: 'modern'
  },
  {
    id: 'mobile-minimal',
    name: '📱 모바일 미니멀',
    width: mobileWidth,
    height: 720,
    backgroundColor: '#ffffff',
    padding: 40,
    fontFamily: 'Noto Sans KR',
    titleFontSize: 22,
    contentFontSize: 15,
    lineHeight: 2,
    textColor: '#495057',
    accentColor: '#868e96',
    layout: 'minimal'
  },
  // WeChat/KakaoTalk optimized (square format)
  {
    id: 'chat-square',
    name: '💬 채팅 정사각형',
    width: 600,
    height: 600,
    backgroundColor: '#ffffff',
    borderColor: '#e0e0e0',
    borderWidth: 1,
    padding: 35,
    fontFamily: 'Noto Sans KR',
    titleFontSize: 26,
    contentFontSize: 17,
    lineHeight: 1.7,
    textColor: '#333333',
    accentColor: '#00c73c', // KakaoTalk green
    layout: 'classic'
  },
  // Desktop templates
  {
    id: 'classic',
    name: '💻 데스크톱 클래식',
    width: desktopWidth,
    height: desktopHeight,
    backgroundColor: '#ffffff',
    borderColor: '#333333',
    borderWidth: 2,
    padding: 40,
    fontFamily: 'Noto Sans KR',
    titleFontSize: 28,
    contentFontSize: 18,
    lineHeight: 1.6,
    textColor: '#333333',
    accentColor: '#1976d2',
    layout: 'classic'
  },
  {
    id: 'modern',
    name: '💻 데스크톱 모던',
    width: desktopWidth,
    height: desktopHeight,
    backgroundColor: '#f8f9fa',
    borderColor: '#dee2e6',
    borderWidth: 1,
    padding: 50,
    fontFamily: 'Noto Sans KR',
    titleFontSize: 32,
    contentFontSize: 20,
    lineHeight: 1.8,
    textColor: '#212529',
    accentColor: '#6c5ce7',
    hasLogo: true,
    layout: 'modern'
  },
  {
    id: 'minimal',
    name: '💻 데스크톱 미니멀',
    width: desktopWidth,
    height: 500,
    backgroundColor: '#ffffff',
    padding: 60,
    fontFamily: 'Noto Sans KR',
    titleFontSize: 24,
    contentFontSize: 16,
    lineHeight: 2,
    textColor: '#495057',
    accentColor: '#868e96',
    layout: 'minimal'
  },
  {
    id: 'business',
    name: '💻 데스크톱 비즈니스',
    width: 900,
    height: desktopHeight,
    backgroundColor: '#f1f3f5',
    borderColor: '#495057',
    borderWidth: 3,
    padding: 45,
    fontFamily: 'Noto Sans KR',
    titleFontSize: 30,
    contentFontSize: 18,
    lineHeight: 1.7,
    textColor: '#212529',
    accentColor: '#087f5b',
    hasLogo: true,
    hasQRCode: true,
    layout: 'business'
  }
]