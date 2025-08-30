import React, { useState, useEffect } from 'react'
import {
  Container,
  Paper,
  TextField,
  Button,
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Chip,
  AppBar,
  Toolbar,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress
} from '@mui/material'
import {
  ArrowBack,
  Download,
  Settings,
  Delete,
  CloudUpload,
  Scanner
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { ImageGenerator } from '../utils/imageGenerator'
import { getTemplates, SavedTemplate, deleteTemplate } from '../services/templateService'
import BankSettings from './BankSettings'
import { ocrService } from '../services/ocrService'

interface BankInfo {
  accountHolder: string
  bankName: string
  branch?: string
  accountNumber: string
  amount: string
}

const defaultBanks = [
  '中国工商银行',
  '中国建设银行',
  '中国银行',
  '中国农业银行',
  '交通银行',
  '招商银行',
  '中信银行',
  '民生银行',
  '兴业银行',
  '浦发银行',
  '平安银行',
  '华夏银行',
  '广发银行',
  '邮政储蓄银行',
  '其他'
]

const QuickDownload: React.FC = () => {
  const navigate = useNavigate()
  const [cloudTemplates, setCloudTemplates] = useState<SavedTemplate[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<SavedTemplate | null>(null)
  const [loading, setLoading] = useState(true)
  const [bankInfo, setBankInfo] = useState<BankInfo>({
    accountHolder: '',
    bankName: '',
    accountNumber: '',
    amount: ''
  })
  const [imageDataUrl, setImageDataUrl] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [bankList, setBankList] = useState<string[]>(() => {
    const saved = localStorage.getItem('customBanks')
    return saved ? JSON.parse(saved) : defaultBanks
  })
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [templateToDelete, setTemplateToDelete] = useState<SavedTemplate | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isProcessingOCR, setIsProcessingOCR] = useState(false)
  const [ocrError, setOcrError] = useState<string>('')

  // Load cloud templates on mount
  useEffect(() => {
    loadCloudTemplates()
  }, [])

  const loadCloudTemplates = async () => {
    try {
      setLoading(true)
      const templates = await getTemplates(50) // Load up to 50 templates
      setCloudTemplates(templates)
    } catch (err) {
      console.error('Failed to load templates:', err)
      setError('无法加载模板')
    } finally {
      setLoading(false)
    }
  }

  // 生成预览图
  useEffect(() => {
    if (selectedTemplate && bankInfo.accountHolder && bankInfo.bankName && bankInfo.accountNumber && bankInfo.amount) {
      generatePreview()
    }
  }, [selectedTemplate, bankInfo])

  const generatePreview = async () => {
    if (!selectedTemplate) return

    const generator = new ImageGenerator()
    
    try {
      // Use the original template's notice and style, but with new bank info
      const dataUrl = await generator.generate(
        {
          ...bankInfo,
          notice: selectedTemplate.bankInfo.notice || '',
          additionalInfo: selectedTemplate.bankInfo.additionalInfo
        },
        selectedTemplate.templateConfig,
        {
          format: 'png',
          quality: 0.95,
          scale: 2
        }
      )
      setImageDataUrl(dataUrl)
    } catch (err) {
      console.error('生成预览失败:', err)
    }
  }

  const handleDownload = () => {
    if (!imageDataUrl) {
      setError('请先填写完整信息并选择模板')
      return
    }

    // Check if mobile device
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    
    if (isMobile) {
      // For mobile devices, handle download differently
      fetch(imageDataUrl)
        .then(res => res.blob())
        .then(blob => {
          const url = URL.createObjectURL(blob)
          const fileName = `转账通知_${new Date().getTime()}.png`
          
          // For iOS devices, open in new tab to allow long-press save
          if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
            // Open in new window for iOS users to save
            const newWindow = window.open('', '_blank')
            if (newWindow) {
              newWindow.document.title = fileName
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
            link.download = fileName
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
          link.download = `转账通知_${new Date().getTime()}.png`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        })
    } else {
      // Desktop download
      const link = document.createElement('a')
      link.href = imageDataUrl
      link.download = `转账通知_${new Date().getTime()}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const isFormValid = () => {
    return bankInfo.accountHolder && bankInfo.bankName && bankInfo.accountNumber && bankInfo.amount && selectedTemplate
  }

  const handleDeleteClick = (template: SavedTemplate, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent selecting the template
    setTemplateToDelete(template)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!templateToDelete || !templateToDelete.id) return

    try {
      setIsDeleting(true)
      await deleteTemplate(templateToDelete.id, templateToDelete.imageUrl)
      
      // Reload templates after deletion
      await loadCloudTemplates()
      
      // If deleted template was selected, clear selection
      if (selectedTemplate?.id === templateToDelete.id) {
        setSelectedTemplate(null)
        setImageDataUrl('')
      }
      
      setDeleteDialogOpen(false)
      setTemplateToDelete(null)
    } catch (error) {
      console.error('Failed to delete template:', error)
      setError('템플릿 삭제에 실패했습니다.')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false)
    setTemplateToDelete(null)
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      setOcrError('请上传图片文件')
      return
    }

    try {
      setIsProcessingOCR(true)
      setOcrError('')

      // Convert file to base64
      const base64Image = await ocrService.processImageFile(file)
      
      // Extract bank info using OCR
      const extractedInfo = await ocrService.extractBankInfoFromImage(base64Image)
      
      // Update form with extracted information
      setBankInfo(prevInfo => ({
        ...prevInfo,
        accountHolder: extractedInfo.accountHolder || prevInfo.accountHolder,
        bankName: extractedInfo.bankName || prevInfo.bankName,
        branch: extractedInfo.branch || prevInfo.branch,
        accountNumber: extractedInfo.accountNumber || prevInfo.accountNumber,
        amount: extractedInfo.amount || prevInfo.amount
      }))
      
      // Show success message
      setError('')
      console.log('OCR extraction successful:', extractedInfo)
      
    } catch (error) {
      console.error('OCR processing failed:', error)
      setOcrError('图片识别失败，请手动输入信息')
    } finally {
      setIsProcessingOCR(false)
      // Reset file input
      event.target.value = ''
    }
  }


  return (
    <>
      <AppBar position="static" sx={{ mb: 3 }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigate('/')}
            sx={{ mr: 2 }}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            快速下载
          </Typography>
          <Button
            color="inherit"
            onClick={() => navigate('/')}
          >
            高级编辑
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg">
        <Grid container spacing={3}>
          {/* 左侧：信息输入 */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                1. 输入账户信息
              </Typography>
              
              {/* OCR Upload Section */}
              <Box sx={{ mb: 3 }}>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="ocr-image-upload"
                  type="file"
                  onChange={handleImageUpload}
                  disabled={isProcessingOCR}
                />
                <label htmlFor="ocr-image-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    fullWidth
                    startIcon={isProcessingOCR ? <CircularProgress size={20} /> : <Scanner />}
                    disabled={isProcessingOCR}
                    sx={{ 
                      py: 1.5,
                      borderStyle: 'dashed',
                      borderWidth: 2,
                      '&:hover': {
                        borderStyle: 'dashed',
                        borderWidth: 2,
                        backgroundColor: 'action.hover'
                      }
                    }}
                  >
                    {isProcessingOCR ? '正在识别图片中的账户信息...' : '上传图片自动识别账户信息'}
                  </Button>
                </label>
                {ocrError && (
                  <Alert severity="error" sx={{ mt: 1 }} onClose={() => setOcrError('')}>
                    {ocrError}
                  </Alert>
                )}
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  支持上传包含银行账户信息的图片，系统将自动识别并填充表单
                </Typography>
              </Box>
              
              <TextField
                fullWidth
                label="收款人"
                value={bankInfo.accountHolder}
                onChange={(e) => setBankInfo({ ...bankInfo, accountHolder: e.target.value })}
                margin="normal"
                required
              />

              <Box sx={{ display: 'flex', gap: 1 }}>
                <FormControl fullWidth margin="normal" required>
                  <InputLabel>银行名称</InputLabel>
                  <Select
                    value={bankInfo.bankName}
                    onChange={(e) => setBankInfo({ ...bankInfo, bankName: e.target.value })}
                    label="银行名称"
                  >
                    {bankList.map((bank) => (
                      <MenuItem key={bank} value={bank}>
                        {bank}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <IconButton 
                  onClick={() => setSettingsOpen(true)}
                  sx={{ alignSelf: 'center', mt: 1 }}
                  title="管理银行列表"
                >
                  <Settings />
                </IconButton>
              </Box>

              <TextField
                fullWidth
                label="支行名称（选填）"
                value={bankInfo.branch || ''}
                onChange={(e) => setBankInfo({ ...bankInfo, branch: e.target.value })}
                margin="normal"
                placeholder="例：北京分行朝阳支行"
              />

              <TextField
                fullWidth
                label="账号"
                value={bankInfo.accountNumber}
                onChange={(e) => setBankInfo({ ...bankInfo, accountNumber: e.target.value })}
                margin="normal"
                required
                placeholder="请输入银行账号"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    '& fieldset': {
                      borderWidth: 2,
                      borderColor: 'primary.main'
                    }
                  },
                  '& .MuiInputLabel-root': {
                    fontWeight: 'bold'
                  }
                }}
              />

              <TextField
                fullWidth
                label="转账金额"
                value={bankInfo.amount || ''}
                onChange={(e) => setBankInfo({ ...bankInfo, amount: e.target.value })}
                margin="normal"
                required
                placeholder="例：10,000"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    color: 'error.main',
                    '& fieldset': {
                      borderWidth: 2,
                      borderColor: 'error.light'
                    },
                    '&:hover fieldset': {
                      borderColor: 'error.main'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'error.main'
                    }
                  },
                  '& .MuiInputLabel-root': {
                    fontWeight: 'bold',
                    color: 'error.main',
                    '&.Mui-focused': {
                      color: 'error.main'
                    }
                  }
                }}
              />

              {error && (
                <Alert severity="error" sx={{ mt: 2 }} onClose={() => setError('')}>
                  {error}
                </Alert>
              )}
            </Paper>
          </Grid>

          {/* 中间：模板选择 */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                2. 选择保存的模板
              </Typography>

              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <Typography color="text.secondary">加载模板中...</Typography>
                </Box>
              ) : cloudTemplates.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography color="text.secondary" gutterBottom>
                    没有保存的模板
                  </Typography>
                  <Button 
                    variant="outlined" 
                    onClick={() => navigate('/')}
                    sx={{ mt: 2 }}
                  >
                    去创建模板
                  </Button>
                </Box>
              ) : (
                <Box sx={{ maxHeight: 500, overflowY: 'auto' }}>
                  {cloudTemplates.map((template) => (
                    <Card
                      key={template.id}
                      sx={{
                        mb: 2,
                        cursor: 'pointer',
                        border: selectedTemplate?.id === template.id ? 2 : 0,
                        borderColor: 'primary.main',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                      onClick={() => setSelectedTemplate(template)}
                    >
                      {template.imageUrl && (
                        <Box
                          sx={{
                            height: 120,
                            backgroundImage: `url(${template.imageUrl})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            opacity: 0.3
                          }}
                        />
                      )}
                      <CardContent sx={{ position: 'relative', zIndex: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {template.bankInfo.accountHolder} - {template.bankInfo.bankName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              {template.bankInfo.accountNumber}
                            </Typography>
                          </Box>
                          <IconButton
                            size="small"
                            onClick={(e) => handleDeleteClick(template, e)}
                            sx={{ 
                              color: 'error.main',
                              '&:hover': {
                                backgroundColor: 'error.light',
                                color: 'error.dark'
                              }
                            }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Box>
                        <Box sx={{ mt: 1 }}>
                          <Chip
                            size="small"
                            label={`${template.templateConfig.width}x${template.templateConfig.height}`}
                            sx={{ mr: 1 }}
                          />
                          <Chip
                            size="small"
                            label={template.templateConfig.layout}
                            color="primary"
                            variant="outlined"
                          />
                        </Box>
                        {template.createdAt && (
                          <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                            创建于: {new Date(template.createdAt.seconds * 1000).toLocaleDateString('zh-CN')}
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              )}
            </Paper>
          </Grid>

          {/* 右侧：预览 */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                3. 预览
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  minHeight: 400,
                  bgcolor: '#f5f5f5',
                  borderRadius: 1,
                  p: 2
                }}
              >
                {imageDataUrl ? (
                  <img
                    src={imageDataUrl}
                    alt="预览"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '500px',
                      objectFit: 'contain'
                    }}
                  />
                ) : (
                  <Typography color="text.secondary">
                    请填写信息并选择模板
                  </Typography>
                )}
              </Box>
            </Paper>

            {/* Download button below preview */}
            <Paper sx={{ p: 3, mt: 3 }}>
              <Button
                fullWidth
                variant="contained"
                size="large"
                startIcon={<Download />}
                onClick={handleDownload}
                disabled={!isFormValid()}
              >
                下载图片
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
      
      <BankSettings
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        banks={bankList}
        onBanksChange={setBankList}
      />
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          确认删除
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            确定要删除这个模板吗？此操作无法撤销。
            {templateToDelete && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  收款人: {templateToDelete.bankInfo.accountHolder}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  银行: {templateToDelete.bankInfo.bankName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  账号: {templateToDelete.bankInfo.accountNumber}
                </Typography>
              </Box>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            取消
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained"
            disabled={isDeleting}
          >
            {isDeleting ? '删除中...' : '删除'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default QuickDownload