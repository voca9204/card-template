import React from 'react'
import {
  Paper,
  TextField,
  Button,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  IconButton,
  SelectChangeEvent
} from '@mui/material'
import SettingsIcon from '@mui/icons-material/Settings'
import OpenInFullIcon from '@mui/icons-material/OpenInFull'
import ArticleIcon from '@mui/icons-material/Article'
import { BankInfo } from '../types'
import RichTextEditor from './RichTextEditor'
import BankSettings from './BankSettings'
import RichTextModal from './RichTextModal'
import NoticeTemplates, { NoticeTemplate } from './NoticeTemplates'
import { defaultBanks } from '../data/bankList'
import { getGlobalBanks, saveGlobalBanks, subscribeToBanks, migrateLocalStorageToFirebase } from '../services/bankService'

interface BankInfoFormProps {
  bankInfo: BankInfo
  onBankInfoChange: (info: BankInfo) => void
}

const BankInfoForm: React.FC<BankInfoFormProps> = ({
  bankInfo,
  onBankInfoChange
}) => {
  const [banks, setBanks] = React.useState<string[]>(defaultBanks)
  const [settingsOpen, setSettingsOpen] = React.useState(false)
  const [editorModalOpen, setEditorModalOpen] = React.useState(false)
  const [templateDialogOpen, setTemplateDialogOpen] = React.useState(false)
  
  // Load banks from Firebase on mount
  React.useEffect(() => {
    const loadBanks = async () => {
      try {
        // Migrate localStorage data if exists
        await migrateLocalStorageToFirebase()
        
        // Load banks from Firebase
        const banks = await getGlobalBanks()
        setBanks(banks)
      } catch (error) {
        console.error('Failed to load banks:', error)
      }
    }
    
    loadBanks()
    
    // Subscribe to bank changes
    const unsubscribe = subscribeToBanks((banks) => {
      setBanks(banks)
    })
    
    return () => unsubscribe()
  }, [])

  const handleChange = (field: keyof BankInfo) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent
  ) => {
    onBankInfoChange({
      ...bankInfo,
      [field]: event.target.value as string
    })
  }

  const handleTemplateSelect = (template: NoticeTemplate) => {
    // Convert plain text newlines to HTML paragraphs
    const htmlContent = template.content
      .split('\n')
      .map(line => line.trim() ? `<p>${line}</p>` : '<p></p>')
      .join('')
    
    // If there's existing content, append the template
    const currentNotice = bankInfo.notice || ''
    const finalContent = currentNotice.trim() 
      ? currentNotice + '<br/><br/>' + htmlContent 
      : htmlContent
    
    onBankInfoChange({ 
      ...bankInfo, 
      notice: finalContent 
    })
    
    setTemplateDialogOpen(false)
  }

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        转账信息输入
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        输入以下信息后，将自动生成整洁的转账通知。
      </Typography>

      <Stack spacing={3}>
        <TextField
          fullWidth
          label="收款人"
          variant="outlined"
          value={bankInfo.accountHolder}
          onChange={handleChange('accountHolder')}
          required
          placeholder="张三"
        />

        <Box sx={{ display: 'flex', gap: 1 }}>
          <FormControl fullWidth required>
            <InputLabel>银行名称</InputLabel>
            <Select
              value={bankInfo.bankName}
              label="银行名称"
              onChange={handleChange('bankName')}
            >
              {banks.map((bank) => (
                <MenuItem key={bank} value={bank}>
                  {bank}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <IconButton 
            onClick={() => setSettingsOpen(true)}
            sx={{ alignSelf: 'center' }}
            title="管理银行列表"
          >
            <SettingsIcon />
          </IconButton>
        </Box>

        <TextField
          fullWidth
          label="支行名称（选填）"
          variant="outlined"
          value={bankInfo.branch || ''}
          onChange={handleChange('branch')}
          placeholder="例：北京分行朝阳支行"
        />

        <TextField
          fullWidth
          label="账号"
          variant="outlined"
          value={bankInfo.accountNumber}
          onChange={handleChange('accountNumber')}
          required
          placeholder="1234-56-789012"
          helperText="请包含'-'输入"
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
          variant="outlined"
          value={bankInfo.amount || ''}
          onChange={handleChange('amount')}
          required
          placeholder="例：10,000"
          helperText="请输入转账金额"
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

        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              转账注意事项
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                size="small"
                startIcon={<ArticleIcon />}
                onClick={() => setTemplateDialogOpen(true)}
                sx={{ textTransform: 'none' }}
                color="primary"
              >
                选择模板
              </Button>
              <Button
                size="small"
                startIcon={<OpenInFullIcon />}
                onClick={() => setEditorModalOpen(true)}
                sx={{ textTransform: 'none' }}
              >
                全屏编辑
              </Button>
            </Box>
          </Box>
          <RichTextEditor
            value={bankInfo.notice || ''}
            onChange={(value) => onBankInfoChange({ ...bankInfo, notice: value })}
            placeholder="例：必须填写汇款人姓名、准确金额等"
            helperText="请输入转账时必须确认的事项"
          />
        </Box>

        <TextField
          fullWidth
          label="附加说明（可选）"
          variant="outlined"
          value={bankInfo.additionalInfo}
          onChange={handleChange('additionalInfo')}
          placeholder="例：如有疑问请联系 010-1234-5678"
          helperText="如有附加信息请输入"
        />

      </Stack>
      
      <BankSettings
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        banks={banks}
        onBanksChange={setBanks}
      />
      
      <RichTextModal
        open={editorModalOpen}
        onClose={() => setEditorModalOpen(false)}
        value={bankInfo.notice || ''}
        onChange={(value) => onBankInfoChange({ ...bankInfo, notice: value })}
        title="编辑转账注意事项"
      />
      
      <NoticeTemplates
        open={templateDialogOpen}
        onClose={() => setTemplateDialogOpen(false)}
        onSelect={handleTemplateSelect}
      />
    </Paper>
  )
}

export default BankInfoForm