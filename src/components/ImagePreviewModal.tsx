import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  IconButton
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import DownloadIcon from '@mui/icons-material/Download'

interface ImagePreviewModalProps {
  open: boolean
  imageUrl: string
  onClose: () => void
}

const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
  open,
  imageUrl,
  onClose
}) => {
  const handleDownload = (format: 'png' | 'jpeg') => {
    if (!imageUrl) return
    
    // Create a temporary link element
    const link = document.createElement('a')
    link.href = imageUrl
    link.download = `transfer-notice-${Date.now()}.${format}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2 }}>
        生成的图片
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent dividers>
        <Box sx={{ textAlign: 'center', p: 2 }}>
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Generated transfer notice"
              style={{
                maxWidth: '100%',
                height: 'auto',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                borderRadius: '4px'
              }}
            />
          )}
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 2 }}>
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={() => handleDownload('png')}
          sx={{ mr: 1 }}
        >
          下载 PNG
        </Button>
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={() => handleDownload('jpeg')}
          sx={{ mr: 1 }}
        >
          下载 JPEG
        </Button>
        <Button onClick={onClose} variant="outlined">
          关闭
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ImagePreviewModal