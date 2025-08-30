import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Box,
  Typography,
  Divider,
  Chip,
  Paper,
  FormControlLabel,
  Switch
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

export interface NoticeTemplate {
  id: string
  title: string
  category: string
  content: string
  tags?: string[]
}

interface NoticeTemplatesProps {
  open: boolean
  onClose: () => void
  onSelect: (template: NoticeTemplate) => void
}

const templates: NoticeTemplate[] = [
  {
    id: 'simple-30min',
    title: '简单版本',
    category: '30分钟限时',
    content: `⏰ 必须30分钟内存款！超时需重新申请
请按申请金额存款。存款单据必须提供！`,
    tags: ['30分钟', '简洁']
  },
  {
    id: 'emphasis-30min',
    title: '强调版本',
    category: '30分钟限时',
    content: `[重要] 此账户仅30分钟有效！
• 必须按申请金额存款
• 超时需要申请新账号
• 金额不符我司不负责
• 必须提交存款凭证（含收款人姓名、金额、时间）`,
    tags: ['30分钟', '重要']
  },
  {
    id: 'warning-30min',
    title: '时间警告版本',
    category: '30分钟限时',
    content: `⚠️ 注意：此存款账户30分钟后自动失效
必须在30分钟内按准确申请金额存款，否则无法处理！
金额变更须提前通知 / 存款凭证必须提供`,
    tags: ['30分钟', '警告']
  },
  {
    id: 'checklist-30min',
    title: '检查清单版本',
    category: '30分钟限时',
    content: `✓ 30分钟内存款（严守时限！）
✓ 与申请金额完全一致
✓ 准备存款凭证（收款人、金额、时间显示）
※ 超时或金额错误需重新申请`,
    tags: ['30分钟', '清单']
  },
  {
    id: 'timer-30min',
    title: '计时器强调版本',
    category: '30分钟限时',
    content: `🕐 计时开始！30分钟倒计时
从现在起只能在30分钟内存款
• 准确存入申请金额
• 超时 = 无法存款
• 完整存款凭证必须`,
    tags: ['30分钟', '倒计时']
  },
  {
    id: 'urgent-30min',
    title: '紧急版本',
    category: '30分钟限时',
    content: `[紧急] 30分钟限时存款账户
⏱️ 从生成时刻起仅30分钟有效
⏱️ 非申请金额存入时无法退还/处理
⏱️ 金额变更须在存款前联系
⏱️ 提交含时间/金额/收款人的凭证`,
    tags: ['30分钟', '紧急']
  },
  {
    id: 'steps-30min',
    title: '步骤说明版本',
    category: '30分钟限时',
    content: `存款流程（30分钟限时）
第1步：确认申请金额
第2步：30分钟内完成存款
第3步：提交存款凭证
※ 超时需从第1步重新开始`,
    tags: ['30分钟', '步骤']
  },
  {
    id: 'alert-30min',
    title: '警告信息版本',
    category: '30分钟限时',
    content: `❗30分钟后此账户将无法使用❗
务必在时限内只存入申请金额
金额不符/超时 = 我司不负责
凭证：收款人姓名+金额+时间必须`,
    tags: ['30分钟', '警告']
  },
  {
    id: 'countdown-30min',
    title: '倒计时版本',
    category: '30分钟限时',
    content: `⏰ 30分钟倒计时已开始！
• 29分59秒... 28分钟... 时间在流逝
• 请迅速按准确金额存款
• 时限到期前必须提交存款凭证`,
    tags: ['30分钟', '倒计时']
  },
  {
    id: 'final-30min',
    title: '最终警告版本',
    category: '30分钟限时',
    content: `[最终通知] 本存款账户有效时间：30分钟
严守时间！严守申请金额！严守凭证要求！
违反任一规定将无法处理存款，需重新申请
我司对不遵守规定造成的问题不承担责任`,
    tags: ['30分钟', '最终']
  }
]

const NoticeTemplates: React.FC<NoticeTemplatesProps> = ({ open, onClose, onSelect }) => {
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all')

  const categories = React.useMemo(() => {
    const cats = new Set<string>()
    templates.forEach(t => cats.add(t.category))
    return ['all', ...Array.from(cats)]
  }, [])

  const filteredTemplates = React.useMemo(() => {
    if (selectedCategory === 'all') return templates
    return templates.filter(t => t.category === selectedCategory)
  }, [selectedCategory])

  const handleSelect = (template: NoticeTemplate) => {
    onSelect(template)
    onClose()
  }

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { height: '80vh' }
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">选择公告模板</Typography>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <Chip
              key={cat}
              label={cat === 'all' ? '全部' : cat}
              onClick={() => setSelectedCategory(cat)}
              color={selectedCategory === cat ? 'primary' : 'default'}
              variant={selectedCategory === cat ? 'filled' : 'outlined'}
            />
          ))}
        </Box>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ p: 0 }}>
        <List sx={{ p: 0 }}>
          {filteredTemplates.map((template, index) => (
            <React.Fragment key={template.id}>
              {index > 0 && <Divider />}
              <ListItem 
                component="button" 
                onClick={() => handleSelect(template)}
                sx={{ 
                  p: 2,
                  '&:hover': {
                    backgroundColor: 'action.hover'
                  }
                }}
              >
                <Box sx={{ width: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', flex: 1 }}>
                      {template.title}
                    </Typography>
                    {template.tags && (
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        {template.tags.map(tag => (
                          <Chip key={tag} label={tag} size="small" variant="outlined" />
                        ))}
                      </Box>
                    )}
                  </Box>
                  <Paper 
                    variant="outlined" 
                    sx={{ 
                      p: 1.5, 
                      backgroundColor: 'grey.50',
                      whiteSpace: 'pre-wrap',
                      fontSize: '0.875rem',
                      maxHeight: 150,
                      overflow: 'auto'
                    }}
                  >
                    {template.content}
                  </Paper>
                  <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
                    <Chip 
                      label={template.category} 
                      size="small" 
                      color="primary" 
                      variant="outlined"
                    />
                    <Box sx={{ flex: 1 }} />
                    <CheckCircleIcon sx={{ color: 'success.main', fontSize: 20 }} />
                    <Typography variant="caption" sx={{ ml: 0.5, color: 'text.secondary' }}>
                      点击使用
                    </Typography>
                  </Box>
                </Box>
              </ListItem>
            </React.Fragment>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  )
}

export default NoticeTemplates