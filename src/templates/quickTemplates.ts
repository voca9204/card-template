// 快速下载页面的预定义模板
export interface QuickTemplate {
  id: string
  name: string
  description: string
  layout: 'classic' | 'modern' | 'minimal' | 'business'
  preset: {
    width: number
    height: number
    backgroundColor: string
    textColor: string
    accentColor: string
    fontFamily: string
    padding: number
    titleFontSize: number
    contentFontSize: number
  }
  defaultNotice: string
  category: 'general' | 'urgent' | 'business' | 'personal'
  thumbnail?: string
}

export const quickTemplates: QuickTemplate[] = [
  {
    id: 'quick-general-1',
    name: '标准转账通知',
    description: '适用于一般转账场景',
    layout: 'classic',
    category: 'general',
    preset: {
      width: 480,
      height: 854,
      backgroundColor: '#ffffff',
      textColor: '#333333',
      accentColor: '#2196F3',
      fontFamily: 'Noto Sans KR',
      padding: 20,
      titleFontSize: 28,
      contentFontSize: 16
    },
    defaultNotice: '请仔细核对账户信息\n确认无误后进行转账\n转账后请保留凭证'
  },
  {
    id: 'quick-urgent-1',
    name: '紧急转账通知',
    description: '需要立即处理的转账',
    layout: 'modern',
    category: 'urgent',
    preset: {
      width: 480,
      height: 854,
      backgroundColor: '#fff3e0',
      textColor: '#333333',
      accentColor: '#ff5722',
      fontFamily: 'Noto Sans KR',
      padding: 20,
      titleFontSize: 32,
      contentFontSize: 18
    },
    defaultNotice: '⚠️ 紧急通知\n请立即进行转账\n转账完成后请及时通知'
  },
  {
    id: 'quick-business-1',
    name: '商务转账',
    description: '正式商务往来转账',
    layout: 'business',
    category: 'business',
    preset: {
      width: 600,
      height: 800,
      backgroundColor: '#ffffff',
      textColor: '#2c3e50',
      accentColor: '#34495e',
      fontFamily: 'Noto Sans KR',
      padding: 30,
      titleFontSize: 28,
      contentFontSize: 16
    },
    defaultNotice: '贵公司您好：\n请按照以上账户信息进行汇款\n汇款后请发送汇款凭证至我司\n谢谢合作'
  },
  {
    id: 'quick-personal-1',
    name: '个人转账',
    description: '朋友间转账通知',
    layout: 'minimal',
    category: 'personal',
    preset: {
      width: 480,
      height: 640,
      backgroundColor: '#f8f9fa',
      textColor: '#495057',
      accentColor: '#28a745',
      fontFamily: 'Noto Sans KR',
      padding: 25,
      titleFontSize: 26,
      contentFontSize: 16
    },
    defaultNotice: '请按以上信息转账\n转账后请告知一声\n谢谢！'
  },
  {
    id: 'quick-wechat-1',
    name: '微信风格',
    description: '类似微信截图风格',
    layout: 'modern',
    category: 'general',
    preset: {
      width: 480,
      height: 720,
      backgroundColor: '#ededed',
      textColor: '#000000',
      accentColor: '#07c160',
      fontFamily: 'Noto Sans KR',
      padding: 20,
      titleFontSize: 24,
      contentFontSize: 16
    },
    defaultNotice: '转账信息如上\n请核对后转账'
  },
  {
    id: 'quick-alipay-1',
    name: '支付宝风格',
    description: '类似支付宝截图风格',
    layout: 'classic',
    category: 'general',
    preset: {
      width: 480,
      height: 720,
      backgroundColor: '#ffffff',
      textColor: '#333333',
      accentColor: '#1677ff',
      fontFamily: 'Noto Sans KR',
      padding: 20,
      titleFontSize: 26,
      contentFontSize: 16
    },
    defaultNotice: '请认真核对收款信息\n确认无误后转账'
  },
  {
    id: 'quick-bank-1',
    name: '银行公告风格',
    description: '正式银行通知风格',
    layout: 'business',
    category: 'business',
    preset: {
      width: 600,
      height: 850,
      backgroundColor: '#ffffff',
      textColor: '#1a1a1a',
      accentColor: '#c41230',
      fontFamily: 'Noto Sans KR',
      padding: 35,
      titleFontSize: 30,
      contentFontSize: 17
    },
    defaultNotice: '尊敬的客户：\n请您按照上述账户信息进行转账操作\n转账时请备注您的姓名和用途\n如有疑问请联系客服'
  },
  {
    id: 'quick-simple-1',
    name: '极简风格',
    description: '简洁明了的转账信息',
    layout: 'minimal',
    category: 'personal',
    preset: {
      width: 400,
      height: 500,
      backgroundColor: '#ffffff',
      textColor: '#000000',
      accentColor: '#000000',
      fontFamily: 'Noto Sans KR',
      padding: 30,
      titleFontSize: 22,
      contentFontSize: 15
    },
    defaultNotice: '请转账至上述账户'
  }
]

// 获取特定分类的模板
export const getTemplatesByCategory = (category: string) => {
  if (category === 'all') return quickTemplates
  return quickTemplates.filter(t => t.category === category)
}

// 获取模板
export const getTemplateById = (id: string) => {
  return quickTemplates.find(t => t.id === id)
}