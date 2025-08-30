import { BankInfo, TemplateConfig, ImageGeneratorOptions } from '../types'

export class ImageGenerator {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D

  constructor() {
    this.canvas = document.createElement('canvas')
    const ctx = this.canvas.getContext('2d')
    if (!ctx) {
      throw new Error('Canvas context not available')
    }
    this.ctx = ctx
  }

  private getChineseTimestamp(): string {
    // Get current time in China timezone (UTC+8)
    const now = new Date()
    const chinaTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Shanghai"}))
    
    const year = chinaTime.getFullYear()
    const month = String(chinaTime.getMonth() + 1).padStart(2, '0')
    const day = String(chinaTime.getDate()).padStart(2, '0')
    const hours = String(chinaTime.getHours()).padStart(2, '0')
    const minutes = String(chinaTime.getMinutes()).padStart(2, '0')
    
    return `${year}年${month}月${day}日 ${hours}:${minutes}`
  }

  generate(
    bankInfo: BankInfo,
    template: TemplateConfig,
    options: ImageGeneratorOptions = { format: 'png', quality: 0.95, scale: 2 }
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        // Ensure scale is a valid number
        const scale = options.scale || 1
        
        // Ensure template has valid dimensions
        const width = template.width || 480
        const height = template.height || 854
        
        console.log('Template dimensions:', width, 'x', height)
        console.log('Scale:', scale)
        
        // Calculate required height based on content
        const requiredHeight = this.calculateRequiredHeight(bankInfo, template)
        const finalHeight = Math.max(height, requiredHeight)
        
        // Set canvas dimensions with scale for high quality
        this.canvas.width = width * scale
        this.canvas.height = finalHeight * scale
        
        console.log('Canvas dimensions:', this.canvas.width, 'x', this.canvas.height)
        
        // Check if canvas is properly sized
        if (this.canvas.width === 0 || this.canvas.height === 0) {
          console.error('Canvas has zero dimensions', this.canvas.width, this.canvas.height)
          reject(new Error('Canvas has zero dimensions'))
          return
        }
        
        // Save the current context state
        this.ctx.save()
        
        // Scale context for high DPI
        this.ctx.scale(scale, scale)
        
        // Clear canvas
        this.ctx.clearRect(0, 0, width, finalHeight)
        
        // Draw background
        this.ctx.fillStyle = template.backgroundColor || '#ffffff'
        this.ctx.fillRect(0, 0, width, finalHeight)
        
        // Draw border if specified
        if (template.borderWidth && template.borderColor) {
          this.ctx.strokeStyle = template.borderColor
          this.ctx.lineWidth = template.borderWidth
          this.ctx.strokeRect(
            template.borderWidth / 2,
            template.borderWidth / 2,
            width - template.borderWidth,
            finalHeight - template.borderWidth
          )
        }
        
        // Apply template-specific layout
        switch (template.layout) {
          case 'classic':
            this.drawClassicLayout(bankInfo, template)
            break
          case 'modern':
            this.drawModernLayout(bankInfo, template)
            break
          case 'minimal':
            this.drawMinimalLayout(bankInfo, template)
            break
          case 'business':
            this.drawBusinessLayout(bankInfo, template)
            break
          default:
            this.drawClassicLayout(bankInfo, template)
        }
        
        // Restore the context state
        this.ctx.restore()
        
        // Use setTimeout to ensure canvas operations are complete
        setTimeout(() => {
          try {
            // Convert to image
            const dataUrl = this.canvas.toDataURL(
              options.format === 'jpeg' ? 'image/jpeg' : 'image/png',
              options.quality
            )
            
            // Validate the data URL
            if (!dataUrl || dataUrl === 'data:,' || dataUrl.length < 100) {
              console.error('Invalid data URL generated', dataUrl?.substring(0, 50))
              reject(new Error('Failed to generate valid image data'))
              return
            }
            
            resolve(dataUrl)
          } catch (error) {
            console.error('Error converting canvas to data URL:', error)
            reject(error)
          }
        }, 10)
      } catch (error) {
        console.error('Error in generate method:', error)
        reject(error)
      }
    })
  }

  private drawClassicLayout(bankInfo: BankInfo, template: TemplateConfig) {
    const { padding = 20, titleFontSize = 28, contentFontSize = 16, textColor = '#333333', accentColor = '#2196F3' } = template
    const fontFamily = template.fontFamily || 'sans-serif'
    const width = template.width || 480
    let yPosition = padding + titleFontSize

    // Title
    this.ctx.font = `bold ${titleFontSize}px ${fontFamily}`
    this.ctx.fillStyle = accentColor
    this.ctx.textAlign = 'center'
    this.ctx.fillText('转账通知', width / 2, yPosition)
    
    // Timestamp (below title)
    const timestamp = this.getChineseTimestamp()
    this.ctx.font = `${contentFontSize - 4}px ${fontFamily}`
    this.ctx.fillStyle = '#999999'
    this.ctx.textAlign = 'center'
    this.ctx.fillText(`发行时间: ${timestamp}`, width / 2, yPosition + titleFontSize + 5)
    
    yPosition += titleFontSize * 2

    // Divider
    this.ctx.strokeStyle = accentColor
    this.ctx.lineWidth = 2
    this.ctx.beginPath()
    this.ctx.moveTo(padding * 2, yPosition)
    this.ctx.lineTo(width - padding * 2, yPosition)
    this.ctx.stroke()
    
    yPosition += 40

    // Bank information
    this.ctx.font = `${contentFontSize}px ${fontFamily}`
    this.ctx.fillStyle = textColor
    this.ctx.textAlign = 'left'
    
    const leftMargin = padding * 2
    const lineSpacing = contentFontSize * template.lineHeight
    
    // Account holder
    this.ctx.font = `bold ${contentFontSize}px ${fontFamily}`
    this.ctx.fillText('收款人', leftMargin, yPosition)
    this.ctx.font = `${contentFontSize}px ${fontFamily}`
    this.ctx.fillText(bankInfo.accountHolder, leftMargin + 100, yPosition)
    yPosition += lineSpacing
    
    // Bank name
    this.ctx.font = `bold ${contentFontSize}px ${fontFamily}`
    this.ctx.fillText('银行名称', leftMargin, yPosition)
    this.ctx.font = `${contentFontSize}px ${fontFamily}`
    this.ctx.fillText(bankInfo.bankName, leftMargin + 100, yPosition)
    yPosition += lineSpacing
    
    // Branch (if provided)
    if (bankInfo.branch) {
      this.ctx.font = `bold ${contentFontSize}px ${fontFamily}`
      this.ctx.fillStyle = textColor
      this.ctx.fillText('支行', leftMargin, yPosition)
      this.ctx.font = `${contentFontSize}px ${fontFamily}`
      this.ctx.fillText(bankInfo.branch, leftMargin + 100, yPosition)
      yPosition += lineSpacing
    }
    
    // Account number (strongly emphasized with background)
    // Background highlight for account number
    this.ctx.fillStyle = 'rgba(33, 150, 243, 0.1)'
    this.ctx.fillRect(leftMargin - 10, yPosition - contentFontSize - 5, template.width - leftMargin - padding + 10, contentFontSize * 2 + 10)
    
    this.ctx.font = `bold ${contentFontSize + 3}px ${fontFamily}`
    this.ctx.fillStyle = textColor
    this.ctx.fillText('账号', leftMargin, yPosition)
    this.ctx.font = `bold ${contentFontSize + 5}px ${fontFamily}`
    this.ctx.fillStyle = accentColor
    this.ctx.fillText(bankInfo.accountNumber, leftMargin + 100, yPosition)
    yPosition += lineSpacing * 2
    
    // Amount (strongly emphasized with background)
    if (bankInfo.amount) {
      // Background highlight for amount
      this.ctx.fillStyle = 'rgba(255, 0, 0, 0.05)'
      this.ctx.fillRect(leftMargin - 10, yPosition - contentFontSize - 5, template.width - leftMargin - padding + 10, contentFontSize * 2 + 10)
      
      this.ctx.font = `bold ${contentFontSize + 3}px ${fontFamily}`
      this.ctx.fillStyle = textColor
      this.ctx.fillText('金额', leftMargin, yPosition)
      this.ctx.font = `bold ${contentFontSize + 6}px ${fontFamily}`
      this.ctx.fillStyle = '#FF0000'
      this.ctx.fillText(`¥${bankInfo.amount}`, leftMargin + 100, yPosition)
      yPosition += lineSpacing * 2
    }
    
    // Notice section
    if (bankInfo.notice) {
      this.ctx.fillStyle = textColor
      this.ctx.font = `bold ${contentFontSize}px ${fontFamily}`
      this.ctx.fillText('注意事项', leftMargin, yPosition)
      yPosition += lineSpacing
      
      this.ctx.font = `${contentFontSize - 2}px ${fontFamily}`
      const noticeLines = this.wrapText(bankInfo.notice, width - padding * 4)
      noticeLines.forEach((line, index) => {
        this.drawTextWithAlignment(line.text, leftMargin, yPosition, width - padding * 4, line.align, line.bold, line.italic)
        // Add extra spacing after empty lines (paragraph breaks)
        if (line.text === '' && index < noticeLines.length - 1) {
          yPosition += lineSpacing * 0.5
        } else {
          yPosition += lineSpacing * 0.9
        }
      })
    }
    
    // Additional info
    if (bankInfo.additionalInfo) {
      yPosition += lineSpacing * 0.5
      this.ctx.font = `${contentFontSize - 2}px ${fontFamily}`
      this.ctx.fillStyle = '#666666'
      const infoLines = this.wrapText(bankInfo.additionalInfo, width - padding * 4)
      infoLines.forEach((line, index) => {
        this.drawTextWithAlignment(line.text, leftMargin, yPosition, width - padding * 4, line.align, line.bold, line.italic)
        // Add extra spacing after empty lines (paragraph breaks)
        if (line.text === '' && index < infoLines.length - 1) {
          yPosition += lineSpacing * 0.5
        } else {
          yPosition += lineSpacing * 0.9
        }
      })
    }
  }

  private drawModernLayout(bankInfo: BankInfo, template: TemplateConfig) {
    const { padding, titleFontSize, contentFontSize, textColor, accentColor } = template
    
    // Background gradient effect
    const gradient = this.ctx.createLinearGradient(0, 0, 0, template.height)
    gradient.addColorStop(0, template.backgroundColor)
    gradient.addColorStop(1, this.adjustBrightness(template.backgroundColor, -10))
    this.ctx.fillStyle = gradient
    this.ctx.fillRect(0, 0, template.width, template.height)
    
    // Accent bar at top
    this.ctx.fillStyle = accentColor
    this.ctx.fillRect(0, 0, template.width, 5)
    
    let yPosition = padding + titleFontSize + 10

    // Title with shadow effect
    this.ctx.font = `300 ${titleFontSize}px ${template.fontFamily}`
    this.ctx.fillStyle = accentColor
    this.ctx.textAlign = 'center'
    this.ctx.fillText('转账通知', template.width / 2, yPosition)
    
    // Timestamp below title
    yPosition += titleFontSize * 0.5
    this.ctx.font = `${contentFontSize - 4}px ${fontFamily}`
    this.ctx.fillStyle = '#999999'
    this.ctx.fillText(`发行时间: ${this.getChineseTimestamp()}`, template.width / 2, yPosition)
    
    yPosition += titleFontSize * 1.3

    // Card-style container for bank info
    const cardX = padding * 1.5
    const cardY = yPosition
    const cardWidth = template.width - padding * 3
    const cardHeight = 200
    
    // Card shadow
    this.ctx.shadowColor = 'rgba(0, 0, 0, 0.1)'
    this.ctx.shadowBlur = 10
    this.ctx.shadowOffsetY = 2
    
    // Card background
    this.ctx.fillStyle = '#ffffff'
    this.roundRect(cardX, cardY, cardWidth, cardHeight, 10)
    this.ctx.fill()
    
    // Reset shadow
    this.ctx.shadowBlur = 0
    this.ctx.shadowOffsetY = 0
    
    // Card content
    const cardPadding = 30
    let cardContentY = cardY + cardPadding + contentFontSize
    
    this.ctx.textAlign = 'left'
    this.ctx.fillStyle = textColor
    
    // Bank info in card
    this.drawInfoRow('收款人', bankInfo.accountHolder, cardX + cardPadding, cardContentY, contentFontSize, template)
    cardContentY += contentFontSize * 2
    
    this.drawInfoRow('银行名称', bankInfo.bankName, cardX + cardPadding, cardContentY, contentFontSize, template)
    cardContentY += contentFontSize * 2
    
    // Branch (if provided)
    if (bankInfo.branch) {
      this.drawInfoRow('支行', bankInfo.branch, cardX + cardPadding, cardContentY, contentFontSize, template)
      cardContentY += contentFontSize * 2
    }
    
    // Account number (strongly emphasized)
    this.ctx.fillStyle = 'rgba(33, 150, 243, 0.1)'
    this.ctx.fillRect(cardX + cardPadding - 10, cardContentY - contentFontSize, cardWidth - cardPadding * 2 + 20, contentFontSize * 2)
    
    this.ctx.fillStyle = accentColor
    this.ctx.font = `bold ${contentFontSize + 5}px ${fontFamily}`
    this.drawInfoRow('账号', bankInfo.accountNumber, cardX + cardPadding, cardContentY, contentFontSize + 5, template)
    cardContentY += contentFontSize * 3
    
    // Amount (strongly emphasized)
    if (bankInfo.amount) {
      this.ctx.fillStyle = 'rgba(255, 0, 0, 0.05)'
      this.ctx.fillRect(cardX + cardPadding - 10, cardContentY - contentFontSize, cardWidth - cardPadding * 2 + 20, contentFontSize * 2)
      
      this.ctx.fillStyle = '#FF0000'
      this.ctx.font = `bold ${contentFontSize + 6}px ${fontFamily}`
      this.drawInfoRow('金额', `¥${bankInfo.amount}`, cardX + cardPadding, cardContentY, contentFontSize + 6, template)
    }
    
    // Notice below card
    if (bankInfo.notice || bankInfo.additionalInfo) {
      yPosition = cardY + cardHeight + 30
      this.ctx.fillStyle = textColor
      this.ctx.font = `${contentFontSize - 2}px ${fontFamily}`
      
      if (bankInfo.notice) {
        const noticeLines = this.wrapText(bankInfo.notice, template.width - padding * 3)
        noticeLines.forEach(line => {
          // Apply formatting for each line
          const originalFont = this.ctx.font
          if (line.bold || line.italic) {
            let fontStyle = ''
            if (line.italic) fontStyle += 'italic '
            if (line.bold) fontStyle += 'bold '
            this.ctx.font = `${fontStyle}${contentFontSize - 2}px ${template.fontFamily}`
          }
          this.ctx.fillText(line.text, cardX, yPosition)
          this.ctx.font = originalFont
          yPosition += contentFontSize * 1.5
        })
      }
    }
  }

  private drawMinimalLayout(bankInfo: BankInfo, template: TemplateConfig) {
    const { padding, titleFontSize, contentFontSize, textColor, accentColor } = template
    const centerX = template.width / 2
    let yPosition = template.height / 3

    // Centered layout
    this.ctx.textAlign = 'center'
    
    // Title
    this.ctx.font = `200 ${titleFontSize}px ${template.fontFamily}`
    this.ctx.fillStyle = accentColor
    this.ctx.fillText('转账通知', centerX, yPosition)
    
    // Timestamp below title
    yPosition += titleFontSize * 0.5
    this.ctx.font = `${contentFontSize - 4}px ${fontFamily}`
    this.ctx.fillStyle = '#999999'
    this.ctx.fillText(`发行时间: ${this.getChineseTimestamp()}`, centerX, yPosition)
    
    yPosition += titleFontSize * 2

    // Bank info - centered
    this.ctx.font = `${contentFontSize}px ${fontFamily}`
    this.ctx.fillStyle = textColor
    
    this.ctx.fillText(bankInfo.accountHolder, centerX, yPosition)
    yPosition += contentFontSize * 1.8
    
    this.ctx.fillText(bankInfo.bankName, centerX, yPosition)
    yPosition += contentFontSize * 1.8
    
    // Branch (if provided)
    if (bankInfo.branch) {
      this.ctx.font = `${contentFontSize}px ${fontFamily}`
      this.ctx.fillText(bankInfo.branch, centerX, yPosition)
      yPosition += contentFontSize * 1.8
    }
    
    // Account number (emphasized)
    this.ctx.font = `bold ${contentFontSize + 3}px ${template.fontFamily}`
    this.ctx.fillStyle = accentColor
    this.ctx.fillText(bankInfo.accountNumber, centerX, yPosition)
    yPosition += contentFontSize * 2
    
    // Amount (if provided, emphasized)
    if (bankInfo.amount) {
      this.ctx.font = `bold ${contentFontSize + 4}px ${template.fontFamily}`
      this.ctx.fillStyle = '#FF0000'
      this.ctx.fillText(`¥${bankInfo.amount}`, centerX, yPosition)
      yPosition += contentFontSize * 2
    }
    
    // Minimal notice
    if (bankInfo.notice) {
      yPosition += contentFontSize * 3
      this.ctx.font = `${contentFontSize - 3}px ${template.fontFamily}`
      this.ctx.fillStyle = '#999999'
      const noticeLines = this.wrapText(bankInfo.notice, template.width - padding * 2)
      noticeLines.forEach(line => {
        // Apply formatting for each line
        const originalFont = this.ctx.font
        if (line.bold || line.italic) {
          let fontStyle = ''
          if (line.italic) fontStyle += 'italic '
          if (line.bold) fontStyle += 'bold '
          this.ctx.font = `${fontStyle}${contentFontSize - 3}px ${template.fontFamily}`
        }
        this.ctx.fillText(line.text, centerX, yPosition)
        this.ctx.font = originalFont
        yPosition += contentFontSize * 1.3
      })
    }
  }

  private drawBusinessLayout(bankInfo: BankInfo, template: TemplateConfig) {
    const { padding, titleFontSize, contentFontSize, textColor, accentColor } = template
    
    // Header section with accent background
    this.ctx.fillStyle = accentColor
    this.ctx.fillRect(0, 0, template.width, 100)
    
    // Title in header
    this.ctx.font = `bold ${titleFontSize}px ${template.fontFamily}`
    this.ctx.fillStyle = '#ffffff'
    this.ctx.textAlign = 'center'
    this.ctx.fillText('转账通知', template.width / 2, 50)
    
    // Timestamp in header
    this.ctx.font = `${contentFontSize - 3}px ${template.fontFamily}`
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
    this.ctx.fillText(`发行时间: ${this.getChineseTimestamp()}`, template.width / 2, 75)
    
    // Main content area
    let yPosition = 150
    const leftColumn = padding * 2
    const rightColumn = template.width / 2 + padding
    
    // Two-column layout for bank info
    this.ctx.textAlign = 'left'
    this.ctx.fillStyle = textColor
    
    // Left column
    this.ctx.font = `bold ${contentFontSize}px ${fontFamily}`
    this.ctx.fillText('收款人', leftColumn, yPosition)
    this.ctx.font = `${contentFontSize}px ${fontFamily}`
    this.ctx.fillText(bankInfo.accountHolder, leftColumn, yPosition + 30)
    
    // Right column
    this.ctx.font = `bold ${contentFontSize}px ${fontFamily}`
    this.ctx.fillText('银行名称', rightColumn, yPosition)
    this.ctx.font = `${contentFontSize}px ${fontFamily}`
    this.ctx.fillText(bankInfo.bankName, rightColumn, yPosition + 30)
    
    yPosition += 80
    
    // Branch (if provided) - left column, Amount (if provided) - right column
    if (bankInfo.branch || bankInfo.amount) {
      if (bankInfo.branch) {
        this.ctx.font = `bold ${contentFontSize}px ${fontFamily}`
        this.ctx.fillStyle = textColor
        this.ctx.fillText('支行', leftColumn, yPosition)
        this.ctx.font = `${contentFontSize}px ${fontFamily}`
        this.ctx.fillText(bankInfo.branch, leftColumn, yPosition + 30)
      }
      
      if (bankInfo.amount) {
        this.ctx.font = `bold ${contentFontSize}px ${fontFamily}`
        this.ctx.fillStyle = textColor
        this.ctx.fillText('金额', rightColumn, yPosition)
        this.ctx.font = `bold ${contentFontSize + 4}px ${fontFamily}`
        this.ctx.fillStyle = '#FF0000'
        this.ctx.fillText(`¥${bankInfo.amount}`, rightColumn, yPosition + 30)
      }
      
      yPosition += 80
    }
    
    // Account number - full width (emphasized)
    this.ctx.font = `bold ${contentFontSize + 2}px ${fontFamily}`
    this.ctx.fillStyle = textColor
    this.ctx.fillText('账号', leftColumn, yPosition)
    this.ctx.font = `bold ${contentFontSize + 4}px ${template.fontFamily}`
    this.ctx.fillStyle = accentColor
    this.ctx.fillText(bankInfo.accountNumber, leftColumn, yPosition + 35)
    
    // Notice section with background
    if (bankInfo.notice) {
      yPosition += 100
      
      // Notice background
      this.ctx.fillStyle = '#f8f9fa'
      this.roundRect(padding, yPosition - 20, template.width - padding * 2, 150, 5)
      this.ctx.fill()
      
      // Notice text
      this.ctx.fillStyle = textColor
      this.ctx.font = `bold ${contentFontSize - 2}px ${template.fontFamily}`
      this.ctx.fillText('注意事项', leftColumn, yPosition + 10)
      
      this.ctx.font = `${contentFontSize - 3}px ${template.fontFamily}`
      const noticeLines = this.wrapText(bankInfo.notice, width - padding * 4)
      let noticeY = yPosition + 40
      noticeLines.forEach(line => {
        this.drawTextWithAlignment(line.text, leftColumn, noticeY, template.width - padding * 4, line.align, line.bold, line.italic)
        noticeY += contentFontSize * 1.4
      })
    }
    
    // Footer
    this.ctx.fillStyle = '#dee2e6'
    this.ctx.fillRect(0, template.height - 40, template.width, 40)
    this.ctx.fillStyle = '#868e96'
    this.ctx.font = `${contentFontSize - 4}px ${fontFamily}`
    this.ctx.textAlign = 'center'
    this.ctx.fillText('本通知由系统自动生成', template.width / 2, template.height - 15)
  }

  private drawInfoRow(label: string, value: string, x: number, y: number, fontSize: number, template: TemplateConfig) {
    this.ctx.font = `${fontSize - 2}px ${template.fontFamily}`
    this.ctx.fillStyle = '#999999'
    this.ctx.fillText(label, x, y)
    
    this.ctx.font = `${fontSize}px ${template.fontFamily}`
    this.ctx.fillStyle = template.textColor
    this.ctx.fillText(value, x + 120, y)
  }

  private roundRect(x: number, y: number, width: number, height: number, radius: number) {
    this.ctx.beginPath()
    this.ctx.moveTo(x + radius, y)
    this.ctx.lineTo(x + width - radius, y)
    this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
    this.ctx.lineTo(x + width, y + height - radius)
    this.ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
    this.ctx.lineTo(x + radius, y + height)
    this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
    this.ctx.lineTo(x, y + radius)
    this.ctx.quadraticCurveTo(x, y, x + radius, y)
    this.ctx.closePath()
  }

  private parseHtmlToLines(html: string): Array<{text: string, align?: string, bold?: boolean, italic?: boolean}> {
    // Create a temporary div to parse HTML
    const temp = document.createElement('div')
    temp.innerHTML = html
    
    const lines: Array<{text: string, align?: string, bold?: boolean, italic?: boolean}> = []
    
    // Process each block element
    const processNode = (node: Node, prefix: string = '', parentAlign?: string, parentBold?: boolean, parentItalic?: boolean) => {
      if (node.nodeType === Node.TEXT_NODE) {
        // Don't trim - preserve whitespace for proper formatting
        const text = node.textContent || ''
        if (text && text.trim()) {
          return { text: prefix + text, align: parentAlign, bold: parentBold, italic: parentItalic }
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as HTMLElement
        const tagName = element.tagName.toLowerCase()
        
        // Check for formatting tags
        const isBold = parentBold || tagName === 'strong' || tagName === 'b'
        const isItalic = parentItalic || tagName === 'em' || tagName === 'i'
        
        // Extract text alignment from style
        const style = element.getAttribute('style') || ''
        const alignMatch = style.match(/text-align:\s*(left|center|right|justify)/)
        const alignment = alignMatch ? alignMatch[1] : parentAlign
        
        if (tagName === 'li') {
          // Handle list items
          const parent = element.parentElement
          const isOrdered = parent?.tagName.toLowerCase() === 'ol'
          let listPrefix = '• '
          
          if (isOrdered && parent) {
            const index = Array.from(parent.children).indexOf(element) + 1
            listPrefix = `${index}. `
          }
          
          // Process list item content with formatting
          const processedContent: any[] = []
          Array.from(element.childNodes).forEach(child => {
            const result = processNode(child, '', alignment, isBold, isItalic)
            if (result && typeof result === 'object') {
              processedContent.push(result)
            }
          })
          
          if (processedContent.length > 0) {
            const firstItem = processedContent[0]
            lines.push({ 
              text: listPrefix + processedContent.map(c => c.text).join(''), 
              align: alignment,
              bold: firstItem.bold,
              italic: firstItem.italic
            })
          }
        } else if (tagName === 'p' || tagName === 'div') {
          // Handle paragraphs - process inline content with formatting
          const inlineContent: Array<{text: string, bold?: boolean, italic?: boolean}> = []
          
          Array.from(element.childNodes).forEach(child => {
            if (child.nodeType === Node.TEXT_NODE) {
              const text = child.textContent || ''
              // Preserve all spaces for indentation
              // Replace tabs with 4 spaces
              const processedText = text.replace(/\t/g, '    ')
              if (processedText) inlineContent.push({text: processedText, bold: isBold, italic: isItalic})
            } else if (child.nodeType === Node.ELEMENT_NODE) {
              const elem = child as HTMLElement
              const elemTag = elem.tagName.toLowerCase()
              
              if (elemTag === 'br') {
                // Add line break within paragraph
                if (inlineContent.length > 0) {
                  const combinedText = inlineContent.map(c => c.text).join('')
                  // const hasFormatting = inlineContent.some(c => c.bold || c.italic)
                  lines.push({ 
                    text: combinedText, 
                    align: alignment,
                    bold: inlineContent.some(c => c.bold),
                    italic: inlineContent.some(c => c.italic)
                  })
                  inlineContent.length = 0
                } else {
                  // Empty line break
                  lines.push({ text: '', align: alignment })
                }
              } else {
                // Process other inline elements with formatting
                const elemBold = isBold || elemTag === 'strong' || elemTag === 'b'
                const elemItalic = isItalic || elemTag === 'em' || elemTag === 'i'
                const text = elem.textContent || ''
                const processedText = text.replace(/\t/g, '    ')
                if (processedText) {
                  inlineContent.push({text: processedText, bold: elemBold, italic: elemItalic})
                }
              }
            }
          })
          
          if (inlineContent.length > 0) {
            const combinedText = inlineContent.map(c => c.text).join('')
            lines.push({ 
              text: combinedText, 
              align: alignment,
              bold: inlineContent.some(c => c.bold),
              italic: inlineContent.some(c => c.italic)
            })
          } else {
            // Empty paragraph - preserve it as an empty line
            lines.push({ text: '', align: alignment })
          }
        } else if (tagName === 'ul' || tagName === 'ol') {
          // Process list children
          Array.from(element.children).forEach(child => {
            processNode(child, prefix, alignment, isBold, isItalic)
          })
        } else if (tagName === 'br') {
          // Handle line breaks
          lines.push({ text: '', align: alignment })
        } else {
          // Process other elements' children
          Array.from(element.childNodes).forEach(child => {
            const result = processNode(child, prefix, alignment, isBold, isItalic)
            if (result && typeof result === 'object') {
              lines.push(result)
            }
          })
        }
      }
    }
    
    // Process all top-level nodes
    Array.from(temp.childNodes).forEach(node => {
      processNode(node)
    })
    
    // Return all lines including empty ones (for proper spacing)
    return lines
  }

  private wrapText(text: string, maxWidth: number): Array<{text: string, align?: string, bold?: boolean, italic?: boolean}> {
    // Check if text contains HTML
    const isHtml = text.includes('<') && text.includes('>')
    
    let linesToWrap: Array<{text: string, align?: string, bold?: boolean, italic?: boolean}>
    
    if (isHtml) {
      // Parse HTML to preserve structure
      linesToWrap = this.parseHtmlToLines(text)
    } else {
      // Plain text - split by newlines
      linesToWrap = text.split('\n').map(line => ({ text: line }))
    }
    
    const wrappedLines: Array<{text: string, align?: string, bold?: boolean, italic?: boolean}> = []
    
    // Wrap each line individually
    linesToWrap.forEach(line => {
      if (!line.text) {
        wrappedLines.push({ text: '', align: line.align, bold: line.bold, italic: line.italic })
        return
      }
      
      const words = line.text.split(' ')
      let currentLine = ''
      
      words.forEach(word => {
        const testLine = currentLine ? `${currentLine} ${word}` : word
        const metrics = this.ctx.measureText(testLine)
        
        if (metrics.width > maxWidth && currentLine) {
          wrappedLines.push({ text: currentLine, align: line.align, bold: line.bold, italic: line.italic })
          currentLine = word
        } else {
          currentLine = testLine
        }
      })
      
      if (currentLine) {
        wrappedLines.push({ text: currentLine, align: line.align, bold: line.bold, italic: line.italic })
      }
    })
    
    return wrappedLines
  }

  private drawTextWithAlignment(text: string, x: number, y: number, maxWidth: number, align?: string, bold?: boolean, italic?: boolean) {
    const originalAlign = this.ctx.textAlign
    const originalFont = this.ctx.font
    
    // Apply formatting to font
    if (bold || italic) {
      const fontParts = this.ctx.font.split(' ')
      const fontSize = fontParts.find(p => p.includes('px'))
      const fontFamily = fontParts[fontParts.length - 1]
      
      let fontStyle = ''
      if (italic) fontStyle += 'italic '
      if (bold) fontStyle += 'bold '
      
      this.ctx.font = `${fontStyle}${fontSize} ${fontFamily}`
    }
    
    // Preserve all spaces, including leading spaces for indentation
    // Replace regular spaces with non-breaking spaces to ensure they render
    const preservedText = text.replace(/ /g, '\u00A0')
    
    if (align === 'center') {
      this.ctx.textAlign = 'center'
      this.ctx.fillText(preservedText, x + maxWidth / 2, y)
    } else if (align === 'right') {
      this.ctx.textAlign = 'right'
      this.ctx.fillText(preservedText, x + maxWidth, y)
    } else {
      this.ctx.textAlign = 'left'
      this.ctx.fillText(preservedText, x, y)
    }
    
    this.ctx.textAlign = originalAlign
    this.ctx.font = originalFont
  }

  private adjustBrightness(color: string, percent: number): string {
    const num = parseInt(color.replace('#', ''), 16)
    const amt = Math.round(2.55 * percent)
    const R = (num >> 16) + amt
    const G = (num >> 8 & 0x00FF) + amt
    const B = (num & 0x0000FF) + amt
    return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255))
      .toString(16).slice(1)
  }

  private calculateRequiredHeight(bankInfo: BankInfo, template: TemplateConfig): number {
    const { padding = 20, titleFontSize = 28, contentFontSize = 16, lineHeight = 1.5 } = template
    const fontFamily = template.fontFamily || 'sans-serif'
    const width = template.width || 480
    const lineSpacing = contentFontSize * lineHeight
    let estimatedHeight = padding * 2 // Top and bottom padding
    
    // Add title height
    estimatedHeight += titleFontSize * 2
    
    // Add bank info section (3 lines)
    estimatedHeight += lineSpacing * 3.5
    
    // Calculate notice section height if present
    if (bankInfo.notice) {
      // Set font for measurement
      this.ctx.font = `${contentFontSize - 2}px ${fontFamily}`
      const noticeLines = this.wrapText(bankInfo.notice, width - padding * 4)
      estimatedHeight += lineSpacing + (noticeLines.length * lineSpacing * 0.9)
    }
    
    // Calculate additional info height if present
    if (bankInfo.additionalInfo) {
      this.ctx.font = `${contentFontSize - 2}px ${fontFamily}`
      const infoLines = this.wrapText(bankInfo.additionalInfo, width - padding * 4)
      estimatedHeight += lineSpacing * 0.5 + (infoLines.length * lineSpacing * 0.9)
    }
    
    // Add extra buffer for layout-specific elements
    switch (template.layout) {
      case 'modern':
        estimatedHeight += 100 // Card height
        break
      case 'business':
        estimatedHeight += 150 // Header and footer
        break
      default:
        estimatedHeight += 50 // General buffer
    }
    
    return Math.ceil(estimatedHeight)
  }
}