import React, { useState, useEffect } from 'react'
import {
  Paper,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  IconButton,
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Tooltip
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import DownloadIcon from '@mui/icons-material/Download'
import EditIcon from '@mui/icons-material/Edit'
import RefreshIcon from '@mui/icons-material/Refresh'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { SavedTemplate, getTemplates, deleteTemplate } from '../services/templateService'
import { BankInfo, TemplateConfig } from '../types'

interface SavedTemplatesProps {
  onLoadTemplate: (bankInfo: BankInfo, templateConfig: TemplateConfig) => void
  refreshTrigger?: number
}

const SavedTemplates: React.FC<SavedTemplatesProps> = ({ onLoadTemplate, refreshTrigger }) => {
  const [templates, setTemplates] = useState<SavedTemplate[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<SavedTemplate | null>(null)

  const loadTemplates = async () => {
    setLoading(true)
    setError(null)
    try {
      const loadedTemplates = await getTemplates(12)
      setTemplates(loadedTemplates)
    } catch (err) {
      console.error('Error loading templates:', err)
      setError('加载模板时出错')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTemplates()
  }, [refreshTrigger])

  const handleDelete = async () => {
    if (!selectedTemplate?.id) return

    try {
      await deleteTemplate(selectedTemplate.id, selectedTemplate.imageUrl)
      setTemplates(templates.filter(t => t.id !== selectedTemplate.id))
      setDeleteConfirmOpen(false)
      setSelectedTemplate(null)
    } catch (err) {
      console.error('Error deleting template:', err)
      setError('删除模板时出错')
    }
  }

  const handleDeleteClick = (template: SavedTemplate) => {
    setSelectedTemplate(template)
    setDeleteConfirmOpen(true)
  }

  const handleLoad = (template: SavedTemplate) => {
    onLoadTemplate(template.bankInfo, template.templateConfig)
    // Scroll to top to show the loaded data
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDownload = (template: SavedTemplate) => {
    if (!template.imageUrl) return

    const link = document.createElement('a')
    link.href = template.imageUrl
    link.download = `转账通知_${template.bankInfo.accountHolder}_${new Date().toISOString().slice(0, 10)}.png`
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const formatDate = (timestamp: any) => {
    if (!timestamp) return ''
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleDateString('ko-KR') + ' ' + date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
  }

  if (loading && templates.length === 0) {
    return (
      <Paper elevation={3} sx={{ p: 3, maxWidth: 1200, mx: 'auto', mt: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
          <CircularProgress />
        </Box>
      </Paper>
    )
  }

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 1200, mx: 'auto', mt: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">
          保存的模板
        </Typography>
        <Tooltip title="刷新">
          <IconButton onClick={loadTemplates} disabled={loading}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {templates.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
          <Typography variant="body1">
            没有保存的模板
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            保存生成的模板后将在此处显示
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {templates.map((template) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={template.id}>
              <Card>
                <CardMedia
                  component="img"
                  height="180"
                  image={template.imageUrl || ''}
                  alt={`${template.bankInfo.accountHolder} 模板`}
                  sx={{ objectFit: 'cover', backgroundColor: '#f5f5f5' }}
                />
                <CardContent sx={{ pb: 1 }}>
                  <Typography variant="h6" noWrap>
                    {template.bankInfo.accountHolder}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {template.bankInfo.bankName} | {template.bankInfo.accountNumber}
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <Chip 
                      label={template.templateConfig.name} 
                      size="small" 
                      color="primary" 
                      variant="outlined" 
                    />
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                    {formatDate(template.createdAt)}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'space-between', px: 2 }}>
                  <Box>
                    <Tooltip title="编辑并使用">
                      <IconButton 
                        size="small" 
                        onClick={() => handleLoad(template)}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="复制信息">
                      <IconButton 
                        size="small" 
                        onClick={() => handleLoad(template)}
                        color="secondary"
                      >
                        <ContentCopyIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="下载图片">
                      <IconButton size="small" onClick={() => handleDownload(template)}>
                        <DownloadIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Tooltip title="删除">
                    <IconButton size="small" color="error" onClick={() => handleDeleteClick(template)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>删除模板</DialogTitle>
        <DialogContent>
          <Typography>
            确定要删除 "{selectedTemplate?.bankInfo.accountHolder}" 的模板吗？
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            此操作无法撤销。
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>取消</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            删除
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  )
}

export default SavedTemplates