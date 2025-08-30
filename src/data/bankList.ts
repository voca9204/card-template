// Comprehensive bank list for China and Korea
// 中国和韩国的综合银行列表

export const defaultBanks = [
  // === 中国主要银行 (Chinese Major Banks) ===
  // 国有大型商业银行
  '中国工商银行',
  '中国建设银行',
  '中国银行',
  '中国农业银行',
  '交通银行',
  '邮政储蓄银行',
  
  // 全国性股份制商业银行
  '招商银行',
  '中信银行',
  '民生银行',
  '兴业银行',
  '浦发银行',
  '平安银行',
  '华夏银行',
  '广发银行',
  '光大银行',
  '浙商银行',
  '渤海银行',
  '恒丰银行',
  
  // 城市商业银行
  '北京银行',
  '上海银行',
  '南京银行',
  '宁波银行',
  '江苏银行',
  '杭州银行',
  '天津银行',
  '重庆银行',
  '成都银行',
  '西安银行',
  '长沙银行',
  '青岛银行',
  '大连银行',
  '哈尔滨银行',
  '徽商银行',
  
  // 农村商业银行
  '北京农商银行',
  '上海农商银行',
  '广州农商银行',
  '深圳农商银行',
  '重庆农商银行',
  '成都农商银行',
  
  // 外资银行
  '汇丰银行',
  '渣打银行',
  '花旗银行',
  '东亚银行',
  '星展银行',
  
  // 互联网银行
  '微众银行',
  '网商银行',
  '新网银行',
  '百信银行',
  
  // === 韩国银行 (Korean Banks) ===
  'KB국민은행',
  '신한은행',
  '우리은행',
  '하나은행',
  'NH농협은행',
  'IBK기업은행',
  'SC제일은행',
  '한국씨티은행',
  'KDB산업은행',
  '수협은행',
  '한국수출입은행',
  '케이뱅크',
  '카카오뱅크',
  '토스뱅크',
  '새마을금고',
  '신협',
  '우체국',
  'DGB대구은행',
  'BNK부산은행',
  'BNK경남은행',
  '광주은행',
  '전북은행',
  '제주은행',
  
  // === 国际银行 (International Banks) ===
  'Bank of America',
  'JPMorgan Chase',
  'Wells Fargo',
  'HSBC',
  'Standard Chartered',
  'Citibank',
  'Deutsche Bank',
  'Barclays',
  'BNP Paribas',
  'UBS',
  'Credit Suisse',
  'Mizuho Bank',
  'MUFG Bank',
  'SMBC',
  
  // === 支付平台 (Payment Platforms) ===
  '支付宝',
  '微信支付',
  'PayPal',
  'Alipay',
  'WeChat Pay',
  
  // 其他选项
  '其他'
]

// Bank name variations and aliases for better OCR matching
// 银行名称变体和别名，用于更好的OCR匹配
export const bankAliases: Record<string, string> = {
  // Chinese bank aliases
  'ICBC': '中国工商银行',
  '工行': '中国工商银行',
  '工商': '中国工商银行',
  'CCB': '中国建设银行',
  '建行': '中国建设银行',
  '建设': '中国建设银行',
  'BOC': '中国银行',
  '中行': '中国银行',
  'ABC': '中国农业银行',
  '农行': '中国农业银行',
  '农业': '中国农业银行',
  'BOCOM': '交通银行',
  '交行': '交通银行',
  'CMB': '招商银行',
  '招行': '招商银行',
  'CITIC': '中信银行',
  'CMBC': '民生银行',
  'CIB': '兴业银行',
  'SPDB': '浦发银行',
  '浦东发展银行': '浦发银行',
  'PAB': '平安银行',
  'HXB': '华夏银行',
  'CGB': '广发银行',
  'CEB': '光大银行',
  'PSBC': '邮政储蓄银行',
  '邮储': '邮政储蓄银行',
  '中国邮政': '邮政储蓄银行',
  
  // Korean bank aliases
  'KB': 'KB국민은행',
  '국민': 'KB국민은행',
  'Kookmin': 'KB국민은행',
  'Shinhan': '신한은행',
  'Woori': '우리은행',
  'Hana': '하나은행',
  'NH': 'NH농협은행',
  '농협': 'NH농협은행',
  'Nonghyup': 'NH농협은행',
  'IBK': 'IBK기업은행',
  '기업': 'IBK기업은행',
  'SC': 'SC제일은행',
  '제일': 'SC제일은행',
  'KDB': 'KDB산업은행',
  '산업': 'KDB산업은행',
  'Kakao': '카카오뱅크',
  'K bank': '케이뱅크',
  'Toss': '토스뱅크',
  
  // English to Chinese/Korean
  'Industrial and Commercial Bank of China': '中国工商银行',
  'China Construction Bank': '中国建设银行',
  'Bank of China': '中国银行',
  'Agricultural Bank of China': '中国农业银行',
  'Bank of Communications': '交通银行',
  'China Merchants Bank': '招商银行'
}

// Function to normalize bank name for matching
// 标准化银行名称以进行匹配
export function normalizeBankName(bankName: string): string {
  if (!bankName) return ''
  
  // Remove common suffixes and clean up
  let normalized = bankName
    .replace(/\s+/g, ' ')
    .replace(/银行|은행|Bank|BANK/gi, '')
    .replace(/\(.*?\)/g, '')
    .replace(/（.*?）/g, '')
    .trim()
  
  // Check if it's an alias
  const aliasMatch = bankAliases[normalized]
  if (aliasMatch) {
    return aliasMatch
  }
  
  // Try to find a partial match in the default banks
  const partialMatch = defaultBanks.find(bank => 
    bank.includes(normalized) || normalized.includes(bank.replace(/银行|은행|Bank/gi, ''))
  )
  
  if (partialMatch) {
    return partialMatch
  }
  
  // Return the original bank name if no match found
  return bankName
}

// Function to check if a bank name exists in the list
// 检查银行名称是否存在于列表中
export function isBankInList(bankName: string): boolean {
  const normalized = normalizeBankName(bankName)
  return defaultBanks.includes(normalized)
}

// Function to add a new bank to the list if it doesn't exist
// 如果银行不存在，则将其添加到列表中
export function addBankIfNotExists(bankName: string, bankList: string[]): string[] {
  if (!bankName || bankName.trim() === '') return bankList
  
  const normalized = normalizeBankName(bankName)
  
  // Check if it already exists
  if (bankList.includes(normalized)) {
    return bankList
  }
  
  // Add before "其他" if it exists, otherwise at the end
  const otherIndex = bankList.indexOf('其他')
  if (otherIndex > -1) {
    return [
      ...bankList.slice(0, otherIndex),
      normalized,
      ...bankList.slice(otherIndex)
    ]
  }
  
  return [...bankList, normalized]
}