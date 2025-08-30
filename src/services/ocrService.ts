interface ExtractedBankInfo {
  accountHolder?: string
  bankName?: string
  branch?: string
  accountNumber?: string
  amount?: string
}

export class OCRService {
  private apiKey: string
  
  constructor() {
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY || ''
    if (!this.apiKey) {
      console.warn('OpenAI API key not found in environment variables')
    }
  }

  async extractBankInfoFromImage(imageBase64: string): Promise<ExtractedBankInfo> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key is not configured')
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: `Please extract bank account information from this image. Look for:
                  - Account holder name (收款人/예금주)
                  - Bank name (银行名称/은행명)
                  - Branch name (支行/지점)
                  - Account number (账号/계좌번호)
                  - Amount (金额/금액)
                  
                  Return the information in this exact JSON format:
                  {
                    "accountHolder": "extracted name or null",
                    "bankName": "extracted bank name or null",
                    "branch": "extracted branch or null",
                    "accountNumber": "extracted account number or null",
                    "amount": "extracted amount or null"
                  }
                  
                  If you cannot find certain information, set it to null. Only return the JSON object, no other text.`
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: imageBase64
                  }
                }
              ]
            }
          ],
          max_tokens: 500
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error?.message || 'Failed to process image')
      }

      const data = await response.json()
      let content = data.choices[0]?.message?.content

      if (!content) {
        throw new Error('No response from OpenAI')
      }

      // Remove markdown code blocks if present
      content = content.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim()

      // Parse the JSON response
      try {
        const parsed = JSON.parse(content)
        return {
          accountHolder: parsed.accountHolder !== 'null' && parsed.accountHolder !== null ? parsed.accountHolder : undefined,
          bankName: parsed.bankName !== 'null' && parsed.bankName !== null ? parsed.bankName : undefined,
          branch: parsed.branch !== 'null' && parsed.branch !== null ? parsed.branch : undefined,
          accountNumber: parsed.accountNumber !== 'null' && parsed.accountNumber !== null ? parsed.accountNumber : undefined,
          amount: parsed.amount !== 'null' && parsed.amount !== null ? parsed.amount : undefined
        }
      } catch (parseError) {
        console.error('Failed to parse OCR response:', content)
        // Try to extract information with regex as fallback
        return this.extractWithRegex(content)
      }
    } catch (error) {
      console.error('OCR extraction failed:', error)
      throw error
    }
  }

  private extractWithRegex(text: string): ExtractedBankInfo {
    const info: ExtractedBankInfo = {}
    
    // Try to extract account holder
    const holderMatch = text.match(/(?:收款人|예금주|Account Holder)[:\s]*([^\n,]+)/i)
    if (holderMatch) info.accountHolder = holderMatch[1].trim()
    
    // Try to extract bank name
    const bankMatch = text.match(/(?:银行|은행|Bank)[:\s]*([^\n,]+)/i)
    if (bankMatch) info.bankName = bankMatch[1].trim()
    
    // Try to extract account number
    const accountMatch = text.match(/(?:账号|계좌|Account)[:\s]*([\d\-]+)/i)
    if (accountMatch) info.accountNumber = accountMatch[1].trim()
    
    // Try to extract amount
    const amountMatch = text.match(/(?:金额|금액|Amount)[:\s]*([\d,]+)/i)
    if (amountMatch) info.amount = amountMatch[1].trim()
    
    return info
  }

  async processImageFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        const result = e.target?.result as string
        resolve(result)
      }
      
      reader.onerror = (error) => {
        reject(error)
      }
      
      reader.readAsDataURL(file)
    })
  }
}

export const ocrService = new OCRService()