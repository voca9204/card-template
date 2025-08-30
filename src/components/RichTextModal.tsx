import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import ArticleIcon from '@mui/icons-material/Article'
import RichTextEditor from './RichTextEditor'
import NoticeTemplates, { NoticeTemplate } from './NoticeTemplates'

interface RichTextModalProps {
  open: boolean
  onClose: () => void
  value: string
  onChange: (value: string) => void
  title?: string
}

const RichTextModal: React.FC<RichTextModalProps> = ({
  open,
  onClose,
  value,
  onChange,
  title = '编辑内容'
}) => {
  const [localValue, setLocalValue] = React.useState(value)
  const [templateDialogOpen, setTemplateDialogOpen] = React.useState(false)

  React.useEffect(() => {
    setLocalValue(value)
  }, [value])

  const handleSave = () => {
    onChange(localValue)
    onClose()
  }

  const handleCancel = () => {
    setLocalValue(value) // Reset to original value
    onClose()
  }

  const handleTemplateSelect = (template: NoticeTemplate) => {
    // Convert plain text newlines to HTML paragraphs
    const htmlContent = template.content
      .split('\n')
      .map(line => line.trim() ? `<p>${line}</p>` : '<p></p>')
      .join('')
    
    // If there's existing content, append the template
    const currentContent = localValue || ''
    const finalContent = currentContent.trim() 
      ? currentContent + '<br/><br/>' + htmlContent 
      : htmlContent
    
    setLocalValue(finalContent)
    setTemplateDialogOpen(false)
  }

  return (
    <Dialog 
      open={open} 
      onClose={handleCancel}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          height: '80vh',
          maxHeight: 800
        }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h6">{title}</Typography>
            <Button
              size="small"
              startIcon={<ArticleIcon />}
              onClick={() => setTemplateDialogOpen(true)}
              color="primary"
              variant="outlined"
            >
              选择模板
            </Button>
          </Box>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleCancel}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent dividers sx={{ p: 3 }}>
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            在这里您可以使用更大的编辑区域来编辑内容，支持格式化、对齐和列表等功能。
          </Typography>
          <Box sx={{ flexGrow: 1 }}>
            <RichTextEditor
              value={localValue}
              onChange={setLocalValue}
              placeholder="在此输入注意事项..."
              helperText=""
            />
          </Box>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleCancel}>
          取消
        </Button>
        <Button onClick={handleSave} variant="contained">
          确定
        </Button>
      </DialogActions>
      
      <NoticeTemplates
        open={templateDialogOpen}
        onClose={() => setTemplateDialogOpen(false)}
        onSelect={handleTemplateSelect}
      />
    </Dialog>
  )
}

export default RichTextModal