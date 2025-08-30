import React, { useState } from 'react'
import {
  Paper,
  Typography,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Box,
  Chip,
  Button,
  useMediaQuery,
  useTheme,
  Tabs,
  Tab
} from '@mui/material'
import TuneIcon from '@mui/icons-material/Tune'
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid'
import ComputerIcon from '@mui/icons-material/Computer'
import ChatIcon from '@mui/icons-material/Chat'
import { TemplateConfig } from '../types'
import { defaultTemplates } from '../templates/defaultTemplates'

interface TemplateSelectorProps {
  selectedTemplate: TemplateConfig
  onTemplateSelect: (template: TemplateConfig) => void
  onCustomizeClick?: () => void
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplate,
  onTemplateSelect,
  onCustomizeClick
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [tabValue, setTabValue] = useState(0)

  // Filter templates by category
  const mobileTemplates = defaultTemplates.filter(t => t.id.startsWith('mobile'))
  const desktopTemplates = defaultTemplates.filter(t => !t.id.startsWith('mobile') && !t.id.startsWith('chat'))
  const chatTemplates = defaultTemplates.filter(t => t.id.startsWith('chat'))

  const templateGroups = [
    { label: '모바일', icon: <PhoneAndroidIcon />, templates: mobileTemplates },
    { label: '데스크톱', icon: <ComputerIcon />, templates: desktopTemplates },
    { label: '채팅', icon: <ChatIcon />, templates: chatTemplates }
  ]

  const currentTemplates = templateGroups[tabValue].templates

  return (
    <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant={isMobile ? "h6" : "h5"}>
          템플릿 선택
        </Typography>
        {onCustomizeClick && (
          <Button
            variant="outlined"
            size="small"
            startIcon={<TuneIcon />}
            onClick={onCustomizeClick}
            sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}
          >
            {isMobile ? '커스텀' : '커스터마이징'}
          </Button>
        )}
      </Box>

      <Tabs 
        value={tabValue} 
        onChange={(_, newValue) => setTabValue(newValue)}
        variant="fullWidth"
        sx={{ mb: 2 }}
      >
        {templateGroups.map((group, index) => (
          <Tab 
            key={index}
            icon={group.icon}
            label={group.label}
            iconPosition="start"
            sx={{ minHeight: 48 }}
          />
        ))}
      </Tabs>

      <Grid container spacing={isMobile ? 1 : 2}>
        {currentTemplates.map((template) => (
          <Grid size={isMobile ? 12 : 6} key={template.id}>
            <Card
              variant={selectedTemplate.id === template.id ? 'elevation' : 'outlined'}
              sx={{
                border: selectedTemplate.id === template.id ? 2 : 1,
                borderColor: selectedTemplate.id === template.id ? 'primary.main' : 'grey.300',
                transition: 'all 0.3s'
              }}
            >
              <CardActionArea onClick={() => onTemplateSelect(template)}>
                <CardContent sx={{ p: isMobile ? 1.5 : 2 }}>
                  <Box
                    sx={{
                      width: '100%',
                      height: isMobile ? 60 : 80,
                      backgroundColor: template.backgroundColor,
                      border: template.borderWidth ? `${template.borderWidth}px solid ${template.borderColor}` : 'none',
                      mb: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 1
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{ 
                        color: template.textColor,
                        fontFamily: template.fontFamily,
                        fontSize: isMobile ? '0.65rem' : '0.75rem'
                      }}
                    >
                      {template.width} × {template.height}
                    </Typography>
                  </Box>
                  <Typography variant={isMobile ? "body1" : "h6"} gutterBottom>
                    {template.name}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {template.hasLogo && (
                      <Chip label="로고" size="small" color="primary" variant="outlined" />
                    )}
                    {template.hasQRCode && (
                      <Chip label="QR코드" size="small" color="secondary" variant="outlined" />
                    )}
                    {template.id.includes('mobile') && (
                      <Chip label="모바일" size="small" color="success" variant="outlined" />
                    )}
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Paper>
  )
}

export default TemplateSelector