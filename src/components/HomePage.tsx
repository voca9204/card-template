import React, { useState } from 'react'
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button
} from '@mui/material'
import { Rocket, Edit, PhoneIphone } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import BankInfoForm from './BankInfoForm'
import TemplateSelector from './TemplateSelector'
import TemplateCustomizer from './TemplateCustomizer'
import LivePreview from './LivePreview'
import ImagePreview from './ImagePreview'
import { defaultTemplates } from '../templates/defaultTemplates'
import { saveTemplate } from '../services/templateService'

interface BankInfo {
  accountHolder: string
  bankName: string
  accountNumber: string
  notice: string
  additionalInfo?: string
}

interface TemplateConfig {
  width: number
  height: number
  backgroundColor: string
  textColor: string
  accentColor: string
  fontFamily: string
  padding: number
  titleFontSize: number
  contentFontSize: number
  layout: 'classic' | 'modern' | 'minimal' | 'business'
}

const HomePage: React.FC = () => {
  const navigate = useNavigate()
  const [bankInfo, setBankInfo] = useState<BankInfo>({
    accountHolder: '',
    bankName: '',
    accountNumber: '',
    amount: '',
    notice: ''
  })

  // Use the first default template as initial selection
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateConfig>(
    defaultTemplates[0] || {
      width: 480,
      height: 854,
      backgroundColor: '#ffffff',
      textColor: '#333333',
      accentColor: '#2196F3',
      fontFamily: 'Noto Sans KR',
      padding: 20,
      titleFontSize: 28,
      contentFontSize: 16,
      layout: 'classic'
    }
  )

  const [imageDataUrl, setImageDataUrl] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleBankInfoChange = (newInfo: BankInfo) => {
    setBankInfo(newInfo)
  }

  const handleTemplateSelect = (template: any) => {
    setSelectedTemplate({
      ...selectedTemplate,
      ...template
    })
  }

  const handleTemplateCustomize = (config: TemplateConfig) => {
    setSelectedTemplate(config)
  }

  const handleGenerateImage = async () => {
    try {
      setIsGenerating(true)
      // Generate final high-quality image
      const generator = new (await import('../utils/imageGenerator')).ImageGenerator()
      const imageData = await generator.generate(bankInfo, selectedTemplate, {
        format: 'png',
        quality: 1,
        scale: 2 // High quality
      })
      
      console.log('Generated high quality image, length:', imageData?.length)
      setImageDataUrl(imageData)
    } catch (error) {
      console.error('Failed to generate image:', error)
    } finally {
      setIsGenerating(false)
    }
  }
  
  const handleDownload = (format: 'png' | 'jpeg') => {
    if (!imageDataUrl) return
    
    // Check if mobile device
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    
    if (isMobile) {
      // For mobile devices, handle download differently
      fetch(imageDataUrl)
        .then(res => res.blob())
        .then(blob => {
          const url = URL.createObjectURL(blob)
          
          // For iOS devices, open in new tab to allow long-press save
          if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
            // Create a temporary image element
            const img = new Image()
            img.src = imageDataUrl
            
            // Open in new window with proper filename hint
            const newWindow = window.open('', '_blank')
            if (newWindow) {
              newWindow.document.title = `transfer-notice-${Date.now()}.${format}`
              newWindow.document.body.style.margin = '0'
              newWindow.document.body.style.display = 'flex'
              newWindow.document.body.style.justifyContent = 'center'
              newWindow.document.body.style.alignItems = 'center'
              newWindow.document.body.style.backgroundColor = '#000'
              newWindow.document.body.innerHTML = `<img src="${imageDataUrl}" style="max-width:100%; height:auto;" />`
            }
          } else {
            // For Android, trigger direct download
            const link = document.createElement('a')
            link.href = url
            link.download = `transfer-notice-${Date.now()}.${format}`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
          }
          
          // Clean up
          setTimeout(() => URL.revokeObjectURL(url), 100)
        })
        .catch(err => {
          console.error('Download failed:', err)
          // Fallback to basic download
          const link = document.createElement('a')
          link.href = imageDataUrl
          link.download = `transfer-notice-${Date.now()}.${format}`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        })
    } else {
      // Desktop download
      const link = document.createElement('a')
      link.href = imageDataUrl
      link.download = `transfer-notice-${Date.now()}.${format}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }
  
  const handleSaveToCloud = async () => {
    if (!imageDataUrl) {
      console.error('No image data URL available')
      return
    }
    
    // Validate that imageDataUrl is a valid data URL
    if (!imageDataUrl.startsWith('data:image/')) {
      console.error('Invalid image data URL format')
      return
    }
    
    try {
      setIsSaving(true)
      
      // Save the template with the generated image
      // The saveTemplate function expects (bankInfo, templateConfig, imageDataUrl)
      await saveTemplate(
        bankInfo,
        selectedTemplate,
        imageDataUrl
      )
      
      console.log('Template saved to cloud successfully')
      alert('템플릿이 클라우드에 저장되었습니다!') // Success notification
    } catch (error) {
      console.error('Failed to save to cloud:', error)
      alert('클라우드 저장에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsSaving(false)
    }
  }


  return (
    <>
      {/* 顶部导航栏 */}
      <Box sx={{ 
        bgcolor: 'primary.main', 
        color: 'white', 
        p: 2,
        mb: 3
      }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" component="h1">
              转账通知生成器
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                color="inherit"
                startIcon={<PhoneIphone />}
                onClick={() => navigate('/pwa-guide')}
                sx={{ 
                  borderColor: 'white',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.1)',
                    borderColor: 'white'
                  }
                }}
              >
                安装教程
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                startIcon={<Rocket />}
                onClick={() => navigate('/quick')}
                sx={{ 
                  borderColor: 'white',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.1)',
                    borderColor: 'white'
                  }
                }}
              >
                快速下载
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg">
        <Grid container spacing={3}>
          {/* 左侧：输入区域 */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ mb: 3 }}>
              <BankInfoForm 
                bankInfo={bankInfo} 
                onBankInfoChange={handleBankInfoChange}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <TemplateSelector 
                selectedTemplate={selectedTemplate}
                onTemplateSelect={handleTemplateSelect}
              />
            </Box>

            <TemplateCustomizer 
              template={selectedTemplate}
              onTemplateChange={handleTemplateCustomize}
            />
          </Grid>

          {/* 右侧：预览和保存的模板 */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <LivePreview 
                bankInfo={bankInfo}
                template={selectedTemplate}
                onGenerateFinal={handleGenerateImage}
                isGenerating={isGenerating}
              />
            </Paper>
            
            {/* Image preview below live preview */}
            {imageDataUrl && (
              <Paper sx={{ p: 3 }}>
                <ImagePreview
                  imageDataUrl={imageDataUrl}
                  isGenerating={isGenerating}
                  onDownload={handleDownload}
                  onSaveToCloud={handleSaveToCloud}
                  isSaving={isSaving}
                />
              </Paper>
            )}

          </Grid>
        </Grid>
      </Container>
    </>
  )
}

export default HomePage