import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Box,
  Typography,
  Stack,
  Divider,
  Alert
} from '@mui/material'
import {
  Delete as DeleteIcon,
  DragIndicator as DragIcon,
  Add as AddIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
  RestartAlt as ResetIcon
} from '@mui/icons-material'
import { defaultBanks, addBankIfNotExists } from '../data/bankList'

interface BankSettingsProps {
  open: boolean
  onClose: () => void
  banks: string[]
  onBanksChange: (banks: string[]) => void
}

const BankSettings: React.FC<BankSettingsProps> = ({
  open,
  onClose,
  banks,
  onBanksChange
}) => {
  const [localBanks, setLocalBanks] = useState<string[]>(banks)
  const [newBank, setNewBank] = useState('')
  const [error, setError] = useState('')

  // Reset to default banks
  const handleReset = () => {
    setLocalBanks(defaultBanks)
  }

  // Add new bank
  const handleAddBank = () => {
    if (!newBank.trim()) {
      setError('请输入银行名称')
      return
    }
    if (localBanks.includes(newBank.trim())) {
      setError('该银行已存在')
      return
    }
    setLocalBanks([...localBanks, newBank.trim()])
    setNewBank('')
    setError('')
  }

  // Delete bank
  const handleDeleteBank = (index: number) => {
    setLocalBanks(localBanks.filter((_, i) => i !== index))
  }

  // Move bank up
  const handleMoveUp = (index: number) => {
    if (index === 0) return
    const newBanks = [...localBanks]
    const temp = newBanks[index]
    newBanks[index] = newBanks[index - 1]
    newBanks[index - 1] = temp
    setLocalBanks(newBanks)
  }

  // Move bank down
  const handleMoveDown = (index: number) => {
    if (index === localBanks.length - 1) return
    const newBanks = [...localBanks]
    const temp = newBanks[index]
    newBanks[index] = newBanks[index + 1]
    newBanks[index + 1] = temp
    setLocalBanks(newBanks)
  }

  // Save changes
  const handleSave = () => {
    onBanksChange(localBanks)
    localStorage.setItem('customBanks', JSON.stringify(localBanks))
    onClose()
  }

  // Cancel changes
  const handleCancel = () => {
    setLocalBanks(banks)
    setNewBank('')
    setError('')
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">银行管理</Typography>
          <Button
            startIcon={<ResetIcon />}
            onClick={handleReset}
            size="small"
            color="secondary"
          >
            恢复默认
          </Button>
        </Box>
      </DialogTitle>
      
      <DialogContent dividers>
        <Stack spacing={3}>
          {/* Add new bank section */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              添加新银行
            </Typography>
            <Stack direction="row" spacing={1}>
              <TextField
                fullWidth
                size="small"
                placeholder="输入银行名称"
                value={newBank}
                onChange={(e) => {
                  setNewBank(e.target.value)
                  setError('')
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAddBank()
                  }
                }}
                error={!!error}
                helperText={error}
              />
              <Button
                variant="contained"
                onClick={handleAddBank}
                startIcon={<AddIcon />}
                sx={{ minWidth: 100 }}
              >
                添加
              </Button>
            </Stack>
          </Box>

          <Divider />

          {/* Bank list */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              银行列表（{localBanks.length}个）
            </Typography>
            <Alert severity="info" sx={{ mb: 2 }}>
              使用箭头按钮调整银行顺序，点击删除按钮移除银行
            </Alert>
            <List sx={{ 
              maxHeight: 400, 
              overflow: 'auto',
              border: 1,
              borderColor: 'divider',
              borderRadius: 1
            }}>
              {localBanks.map((bank, index) => (
                <ListItem key={index} divider={index < localBanks.length - 1}>
                  <DragIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <ListItemText 
                    primary={bank}
                    primaryTypographyProps={{
                      fontWeight: index < 5 ? 'medium' : 'normal'
                    }}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                      size="small"
                    >
                      <ArrowUpIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      onClick={() => handleMoveDown(index)}
                      disabled={index === localBanks.length - 1}
                      size="small"
                      sx={{ mx: 0.5 }}
                    >
                      <ArrowDownIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      onClick={() => handleDeleteBank(index)}
                      size="small"
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Box>
        </Stack>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={handleCancel}>
          取消
        </Button>
        <Button onClick={handleSave} variant="contained">
          保存
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default BankSettings