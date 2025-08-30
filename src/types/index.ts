export interface BankInfo {
  accountHolder: string  // 예금주명
  bankName: string      // 은행명
  branch?: string       // 지점명 (선택)
  accountNumber: string // 계좌번호
  amount: string        // 금액 (필수)
  notice?: string       // 주의사항
  additionalInfo?: string // 추가 정보
}

export interface TemplateConfig {
  id: string
  name: string
  width: number
  height: number
  backgroundColor: string
  borderColor?: string
  borderWidth?: number
  padding: number
  fontFamily: string
  titleFontSize: number
  contentFontSize: number
  lineHeight: number
  textColor: string
  accentColor: string
  hasLogo?: boolean
  hasQRCode?: boolean
  layout: 'classic' | 'modern' | 'minimal' | 'business'
}

export interface ImageGeneratorOptions {
  format: 'png' | 'jpeg'
  quality: number
  scale: number
}