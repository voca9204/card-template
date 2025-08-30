import React, { useState } from 'react'
import {
  Paper,
  Typography,
  Box,
  Slider,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Stack,
  Chip,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Collapse,
  IconButton
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill'
import TextFieldsIcon from '@mui/icons-material/TextFields'
import BorderStyleIcon from '@mui/icons-material/BorderStyle'
import RestoreIcon from '@mui/icons-material/Restore'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { TemplateConfig } from '../types'
import { defaultTemplates } from '../templates/defaultTemplates'

interface TemplateCustomizerProps {
  template: TemplateConfig
  onTemplateChange: (template: TemplateConfig) => void
  onReset?: () => void
  onBack?: () => void
}

const fontFamilies = [
  'Noto Sans KR',
  'Roboto',
  'Arial',
  'Georgia',
  'Times New Roman',
  'Courier New',
  'Verdana',
  'Helvetica'
]

const TemplateCustomizer: React.FC<TemplateCustomizerProps> = ({
  template,
  onTemplateChange,
  onReset,
  onBack
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const handleChange = (field: keyof TemplateConfig) => (
    event: any,
    newValue?: any
  ) => {
    const value = newValue !== undefined ? newValue : event.target.value
    onTemplateChange({
      ...template,
      [field]: value
    })
  }

  const handleColorChange = (field: keyof TemplateConfig) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    onTemplateChange({
      ...template,
      [field]: event.target.value
    })
  }

  const handleNumberChange = (field: keyof TemplateConfig) => (
    event: Event | React.SyntheticEvent,
    value: number | number[]
  ) => {
    onTemplateChange({
      ...template,
      [field]: value as number
    })
  }

  const handleResetToDefault = () => {
    const defaultTemplate = defaultTemplates.find(t => t.id === template.id)
    if (defaultTemplate) {
      onTemplateChange(defaultTemplate)
    }
    if (onReset) {
      onReset()
    }
  }

  return (
    <Paper elevation={3}>
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          p: 2,
          cursor: 'pointer',
          '&:hover': {
            bgcolor: 'action.hover'
          }
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Typography variant="h6">
          템플릿 커스터마이징
        </Typography>
        <IconButton size="small">
          {isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>
      
      <Collapse in={isOpen}>
        <Box sx={{ p: 3, pt: 0 }}>
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          {onBack && (
            <Button
              variant="text"
              size="small"
              startIcon={<ArrowBackIcon />}
              onClick={onBack}
            >
              템플릿 선택
            </Button>
          )}
          <Tooltip title="기본값으로 초기화">
            <Button
              startIcon={<RestoreIcon />}
              onClick={handleResetToDefault}
              size="small"
              variant="outlined"
            >
              초기화
            </Button>
          </Tooltip>
          </Box>

          <Stack spacing={2}>
        {/* 색상 설정 */}
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <FormatColorFillIcon sx={{ mr: 1 }} />
            <Typography>색상 설정</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={2}>
              <Box>
                <Typography variant="body2" gutterBottom>
                  배경색
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <TextField
                    type="color"
                    value={template.backgroundColor}
                    onChange={handleColorChange('backgroundColor')}
                    size="small"
                    sx={{ width: 80 }}
                  />
                  <TextField
                    value={template.backgroundColor}
                    onChange={handleColorChange('backgroundColor')}
                    size="small"
                    sx={{ flex: 1 }}
                  />
                </Box>
              </Box>

              <Box>
                <Typography variant="body2" gutterBottom>
                  텍스트 색상
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <TextField
                    type="color"
                    value={template.textColor}
                    onChange={handleColorChange('textColor')}
                    size="small"
                    sx={{ width: 80 }}
                  />
                  <TextField
                    value={template.textColor}
                    onChange={handleColorChange('textColor')}
                    size="small"
                    sx={{ flex: 1 }}
                  />
                </Box>
              </Box>

              <Box>
                <Typography variant="body2" gutterBottom>
                  강조 색상
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <TextField
                    type="color"
                    value={template.accentColor}
                    onChange={handleColorChange('accentColor')}
                    size="small"
                    sx={{ width: 80 }}
                  />
                  <TextField
                    value={template.accentColor}
                    onChange={handleColorChange('accentColor')}
                    size="small"
                    sx={{ flex: 1 }}
                  />
                </Box>
              </Box>
            </Stack>
          </AccordionDetails>
        </Accordion>

        {/* 텍스트 설정 */}
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <TextFieldsIcon sx={{ mr: 1 }} />
            <Typography>텍스트 설정</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={2}>
              <FormControl fullWidth size="small">
                <InputLabel>폰트</InputLabel>
                <Select
                  value={template.fontFamily}
                  label="폰트"
                  onChange={handleChange('fontFamily')}
                >
                  {fontFamilies.map((font) => (
                    <MenuItem key={font} value={font}>
                      <span style={{ fontFamily: font }}>{font}</span>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Box>
                <Typography variant="body2" gutterBottom>
                  제목 크기: {template.titleFontSize}px
                </Typography>
                <Slider
                  value={template.titleFontSize}
                  onChange={handleNumberChange('titleFontSize')}
                  min={18}
                  max={48}
                  marks
                  valueLabelDisplay="auto"
                />
              </Box>

              <Box>
                <Typography variant="body2" gutterBottom>
                  본문 크기: {template.contentFontSize}px
                </Typography>
                <Slider
                  value={template.contentFontSize}
                  onChange={handleNumberChange('contentFontSize')}
                  min={12}
                  max={24}
                  marks
                  valueLabelDisplay="auto"
                />
              </Box>

              <Box>
                <Typography variant="body2" gutterBottom>
                  줄 간격: {template.lineHeight}
                </Typography>
                <Slider
                  value={template.lineHeight}
                  onChange={handleNumberChange('lineHeight')}
                  min={1}
                  max={3}
                  step={0.1}
                  marks
                  valueLabelDisplay="auto"
                />
              </Box>
            </Stack>
          </AccordionDetails>
        </Accordion>

        {/* 레이아웃 설정 */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <BorderStyleIcon sx={{ mr: 1 }} />
            <Typography>레이아웃 설정</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={2}>
              <Box>
                <Typography variant="body2" gutterBottom>
                  여백: {template.padding}px
                </Typography>
                <Slider
                  value={template.padding}
                  onChange={handleNumberChange('padding')}
                  min={20}
                  max={80}
                  marks
                  valueLabelDisplay="auto"
                />
              </Box>

              {template.borderWidth !== undefined && (
                <Box>
                  <Typography variant="body2" gutterBottom>
                    테두리 두께: {template.borderWidth}px
                  </Typography>
                  <Slider
                    value={template.borderWidth}
                    onChange={handleNumberChange('borderWidth')}
                    min={0}
                    max={5}
                    marks
                    valueLabelDisplay="auto"
                  />
                </Box>
              )}

              {template.borderColor && (
                <Box>
                  <Typography variant="body2" gutterBottom>
                    테두리 색상
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <TextField
                      type="color"
                      value={template.borderColor}
                      onChange={handleColorChange('borderColor')}
                      size="small"
                      sx={{ width: 80 }}
                    />
                    <TextField
                      value={template.borderColor}
                      onChange={handleColorChange('borderColor')}
                      size="small"
                      sx={{ flex: 1 }}
                    />
                  </Box>
                </Box>
              )}

              <Box>
                <Typography variant="body2" gutterBottom>
                  크기
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    label="너비"
                    type="number"
                    value={template.width}
                    onChange={(e) => onTemplateChange({
                      ...template,
                      width: parseInt(e.target.value) || template.width
                    })}
                    size="small"
                    sx={{ flex: 1 }}
                  />
                  <TextField
                    label="높이"
                    type="number"
                    value={template.height}
                    onChange={(e) => onTemplateChange({
                      ...template,
                      height: parseInt(e.target.value) || template.height
                    })}
                    size="small"
                    sx={{ flex: 1 }}
                  />
                </Box>
              </Box>
            </Stack>
          </AccordionDetails>
        </Accordion>

        {/* 프리셋 색상 */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" gutterBottom>
            빠른 색상 테마
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip
              label="기본"
              onClick={() => {
                onTemplateChange({
                  ...template,
                  backgroundColor: '#ffffff',
                  textColor: '#333333',
                  accentColor: '#1976d2'
                })
              }}
              sx={{ cursor: 'pointer' }}
            />
            <Chip
              label="다크"
              onClick={() => {
                onTemplateChange({
                  ...template,
                  backgroundColor: '#1e1e1e',
                  textColor: '#ffffff',
                  accentColor: '#90caf9'
                })
              }}
              sx={{ cursor: 'pointer' }}
            />
            <Chip
              label="파스텔"
              onClick={() => {
                onTemplateChange({
                  ...template,
                  backgroundColor: '#fef3e2',
                  textColor: '#5d4e37',
                  accentColor: '#f4a460'
                })
              }}
              sx={{ cursor: 'pointer' }}
            />
            <Chip
              label="비즈니스"
              onClick={() => {
                onTemplateChange({
                  ...template,
                  backgroundColor: '#f8f9fa',
                  textColor: '#212529',
                  accentColor: '#0d6efd'
                })
              }}
              sx={{ cursor: 'pointer' }}
            />
          </Box>
        </Box>
          </Stack>
        </Box>
      </Collapse>
    </Paper>
  )
}

export default TemplateCustomizer