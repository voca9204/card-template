import React, { useEffect, useRef } from 'react'
import {
  Paper,
  Typography,
  Box,
  Button,
  ButtonGroup,
  CircularProgress,
  Divider
} from '@mui/material'
import DownloadIcon from '@mui/icons-material/Download'
import ImageIcon from '@mui/icons-material/Image'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'

interface ImagePreviewProps {
  imageDataUrl: string | null
  isGenerating: boolean
  onDownload: (format: 'png' | 'jpeg') => void
  onSaveToCloud?: () => void
  isSaving?: boolean
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  imageDataUrl,
  isGenerating,
  onDownload,
  onSaveToCloud,
  isSaving = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (imageDataUrl && canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const img = new Image()
      img.onload = () => {
        // Set canvas size to match image
        canvas.width = img.width
        canvas.height = img.height
        
        // Draw image
        ctx.drawImage(img, 0, 0)
      }
      img.src = imageDataUrl
    }
  }, [imageDataUrl])

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 900, mx: 'auto', mt: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        미리보기
      </Typography>

      <Box
        sx={{
          position: 'relative',
          minHeight: 400,
          backgroundColor: '#f5f5f5',
          borderRadius: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden'
        }}
      >
        {isGenerating ? (
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress size={60} />
            <Typography variant="body1" sx={{ mt: 2 }}>
              이미지 생성 중...
            </Typography>
          </Box>
        ) : imageDataUrl ? (
          <Box sx={{ width: '100%', textAlign: 'center' }}>
            <canvas
              ref={canvasRef}
              style={{
                maxWidth: '100%',
                height: 'auto',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}
            />
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', color: 'text.secondary' }}>
            <ImageIcon sx={{ fontSize: 80, mb: 2, opacity: 0.3 }} />
            <Typography variant="body1">
              입금 정보를 입력하고 '안내문 생성하기' 버튼을 클릭하세요
            </Typography>
          </Box>
        )}
      </Box>

      {imageDataUrl && !isGenerating && (
        <Box sx={{ mt: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <ButtonGroup variant="contained" size="large">
              <Button
                startIcon={<DownloadIcon />}
                onClick={() => onDownload('png')}
              >
                PNG 下载
              </Button>
              <Button
                startIcon={<DownloadIcon />}
                onClick={() => onDownload('jpeg')}
              >
                JPEG 下载
              </Button>
            </ButtonGroup>
          </Box>
          {onSaveToCloud && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button
                variant="outlined"
                size="large"
                startIcon={<CloudUploadIcon />}
                onClick={onSaveToCloud}
                disabled={isSaving}
              >
                {isSaving ? '保存中...' : '保存到云端'}
              </Button>
            </Box>
          )}
        </Box>
      )}
    </Paper>
  )
}

export default ImagePreview