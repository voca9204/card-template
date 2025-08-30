import React, { useEffect, useRef, useState } from 'react'
import { Paper, Box, Typography, Button, Stack } from '@mui/material'
import { BankInfo, TemplateConfig } from '../types'
import { ImageGenerator } from '../utils/imageGenerator'
import ImageIcon from '@mui/icons-material/Image'

interface LivePreviewProps {
  bankInfo: BankInfo
  template: TemplateConfig
  onGenerateFinal: () => void
  isGenerating?: boolean
}

const LivePreview: React.FC<LivePreviewProps> = ({
  bankInfo,
  template,
  onGenerateFinal,
  isGenerating = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const generatorRef = useRef<ImageGenerator>()

  // Initialize generator
  useEffect(() => {
    generatorRef.current = new ImageGenerator()
  }, [])

  // Update preview when data changes
  useEffect(() => {
    const updatePreview = async () => {
      if (!canvasRef.current) return
      
      // Initialize generator if needed
      if (!generatorRef.current) {
        generatorRef.current = new ImageGenerator()
      }
      
      // Check if minimum required fields are filled
      if (!bankInfo.accountHolder || !bankInfo.bankName || !bankInfo.accountNumber) {
        // Clear canvas if required fields are empty
        const ctx = canvasRef.current.getContext('2d')
        if (ctx) {
          // Set a default size for empty canvas
          canvasRef.current.width = 480
          canvasRef.current.height = 640
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
        }
        return
      }

      setIsUpdating(true)
      
      console.log('Generating preview with:', {
        bankInfo,
        template,
        hasGenerator: !!generatorRef.current
      })
      
      try {
        // Generate preview at lower quality for performance
        const imageData = await generatorRef.current.generate(bankInfo, template, {
          format: 'png',
          quality: 0.8,
          scale: 1 // Lower scale for preview
        }).catch(error => {
          console.error('Failed to generate image:', error)
          setIsUpdating(false)
          return null
        })
        
        if (!imageData) {
          console.error('No image data returned from generator')
          setIsUpdating(false)
          return
        }
        
        console.log('Generated image data URL length:', imageData.length)
        console.log('Image data URL prefix:', imageData.substring(0, 50))
        
        // Validate the data URL format
        if (!imageData.startsWith('data:image/')) {
          console.error('Invalid image data URL format:', imageData.substring(0, 100))
          setIsUpdating(false)
          return
        }
        
        // Draw to canvas
        const ctx = canvasRef.current.getContext('2d')
        if (ctx && canvasRef.current) {
          const img = new Image()
          
          img.onload = () => {
            // Ensure canvas ref is still valid
            if (!canvasRef.current) {
              console.error('Canvas ref lost during image load')
              setIsUpdating(false)
              return
            }
            
            // Set canvas dimensions to match the actual image dimensions
            canvasRef.current.width = img.width
            canvasRef.current.height = img.height
            
            // Get context again after resizing
            const newCtx = canvasRef.current.getContext('2d')
            if (newCtx) {
              // Clear and draw image
              newCtx.clearRect(0, 0, img.width, img.height)
              newCtx.drawImage(img, 0, 0, img.width, img.height)
              console.log('Image successfully drawn to canvas:', img.width, 'x', img.height)
            }
            setIsUpdating(false)
          }
          
          img.onerror = (error) => {
            console.error('Image load error:', error)
            console.error('Image src length:', imageData?.length)
            console.error('Image src preview:', imageData?.substring(0, 200))
            setIsUpdating(false)
          }
          
          // Set the image source
          img.src = imageData
        }
      } catch (error) {
        console.error('Preview update error:', error)
        setIsUpdating(false)
      }
    }

    // Debounce updates
    const timer = setTimeout(updatePreview, 300)
    return () => clearTimeout(timer)
  }, [bankInfo, template]) // Dependencies include all bankInfo changes

  const isReady = bankInfo.accountHolder && bankInfo.bankName && bankInfo.accountNumber

  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">
          实时预览
        </Typography>
        {isUpdating && (
          <Typography variant="caption" color="text.secondary">
            更新中...
          </Typography>
        )}
      </Box>

      <Box 
        sx={{ 
          position: 'relative',
          backgroundColor: '#f5f5f5',
          borderRadius: 1,
          p: 2,
          minHeight: 300,
          maxHeight: '70vh',
          overflowY: 'auto',
          display: 'flex',
          alignItems: !isReady ? 'center' : 'flex-start',
          justifyContent: 'center'
        }}
      >
        {!isReady ? (
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              请填写以下必要信息以查看预览：
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {!bankInfo.accountHolder && '• 收款人 '}
              {!bankInfo.bankName && '• 银行名称 '}
              {!bankInfo.accountNumber && '• 账号'}
            </Typography>
          </Box>
        ) : (
          <canvas
            ref={canvasRef}
            style={{
              maxWidth: '100%',
              width: '100%',
              height: 'auto',
              display: 'block',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              borderRadius: '4px'
            }}
          />
        )}
      </Box>

      <Stack direction="column" spacing={2} sx={{ mt: 2 }}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<ImageIcon />}
          onClick={onGenerateFinal}
          disabled={!isReady || isGenerating}
          size="large"
        >
          生成高质量图片
        </Button>
        
        {/* Debug button for testing */}
        {process.env.NODE_ENV === 'development' && (
          <Button
            fullWidth
            variant="outlined"
            onClick={() => {
              // Test with sample data
              const testCanvas = canvasRef.current
              if (testCanvas) {
                const ctx = testCanvas.getContext('2d')
                if (ctx) {
                  testCanvas.width = 480
                  testCanvas.height = 640
                  
                  // Draw test content
                  ctx.fillStyle = '#ffffff'
                  ctx.fillRect(0, 0, 480, 640)
                  
                  ctx.fillStyle = '#2196F3'
                  ctx.font = 'bold 28px sans-serif'
                  ctx.textAlign = 'center'
                  ctx.fillText('测试预览', 240, 100)
                  
                  ctx.fillStyle = '#333333'
                  ctx.font = '16px sans-serif'
                  ctx.textAlign = 'left'
                  ctx.fillText('这是一个测试预览', 40, 200)
                  
                  console.log('Test preview drawn successfully')
                }
              }
            }}
            size="small"
          >
            测试预览 (Debug)
          </Button>
        )}
      </Stack>
    </Paper>
  )
}

export default LivePreview