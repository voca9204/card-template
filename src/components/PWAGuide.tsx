import React, { useState } from 'react'
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Tab,
  Tabs,
  Card,
  CardMedia,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Chip,
  IconButton,
  AppBar,
  Toolbar,
  Alert,
  useTheme,
  useMediaQuery
} from '@mui/material'
import {
  Apple,
  Android,
  PhoneIphone,
  TabletMac,
  DesktopMac,
  Share,
  Add,
  Home,
  MoreVert,
  GetApp,
  CheckCircle,
  ArrowBack,
  InstallMobile,
  TouchApp
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`device-tabpanel-${index}`}
      aria-labelledby={`device-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  )
}

const PWAGuide: React.FC = () => {
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [tabValue, setTabValue] = useState(0)
  const [activeStep, setActiveStep] = useState(0)

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
    setActiveStep(0)
  }

  const iOSSteps = [
    {
      label: '在 Safari 中打开网站',
      description: '请使用 Safari 浏览器访问本网站。其他浏览器（如 Chrome）无法安装到主屏幕。',
      icon: '🌐'
    },
    {
      label: '点击分享按钮',
      description: '点击底部工具栏中间的分享按钮（方框带向上箭头的图标）。',
      icon: '⬆️'
    },
    {
      label: '选择"添加到主屏幕"',
      description: '在分享菜单中向下滑动，找到"添加到主屏幕"选项并点击。',
      icon: '➕'
    },
    {
      label: '点击"添加"',
      description: '在弹出的对话框中，您可以修改应用名称，然后点击右上角的"添加"按钮。',
      icon: '✅'
    },
    {
      label: '完成安装',
      description: '应用图标将出现在您的主屏幕上，点击即可像原生应用一样使用！',
      icon: '🎉'
    }
  ]

  const androidSteps = [
    {
      label: '在 Chrome 中打开网站',
      description: '请使用 Chrome 浏览器访问本网站，以获得最佳体验。',
      icon: '🌐'
    },
    {
      label: '点击菜单按钮',
      description: '点击右上角的三个点菜单按钮。',
      icon: '⋮'
    },
    {
      label: '选择"安装应用"',
      description: '在菜单中找到"安装应用"或"添加到主屏幕"选项并点击。',
      icon: '📱'
    },
    {
      label: '确认安装',
      description: '在弹出的对话框中点击"安装"按钮。',
      icon: '✅'
    },
    {
      label: '完成安装',
      description: '应用将自动安装并在主屏幕创建图标，享受原生应用体验！',
      icon: '🎉'
    }
  ]

  const desktopSteps = [
    {
      label: '在 Chrome 或 Edge 中打开',
      description: '使用 Chrome 或 Microsoft Edge 浏览器访问本网站。',
      icon: '💻'
    },
    {
      label: '查看地址栏',
      description: '在地址栏右侧寻找安装图标（通常是一个 + 号或电脑图标）。',
      icon: '➕'
    },
    {
      label: '点击安装',
      description: '点击安装图标，在弹出窗口中确认安装。',
      icon: '📥'
    },
    {
      label: '完成安装',
      description: '应用将安装到您的电脑，可以从开始菜单或应用程序文件夹启动。',
      icon: '🎉'
    }
  ]

  const features = [
    { icon: '📱', title: '原生体验', description: '像原生应用一样运行，无浏览器边框' },
    { icon: '📴', title: '离线使用', description: '支持离线访问，随时随地使用' },
    { icon: '🚀', title: '快速启动', description: '从主屏幕一键启动，无需打开浏览器' },
    { icon: '🔔', title: '通知推送', description: '接收重要更新和提醒（即将推出）' },
    { icon: '💾', title: '本地存储', description: '数据保存在本地，快速访问' },
    { icon: '🔄', title: '自动更新', description: '应用自动保持最新版本' }
  ]

  return (
    <>
      {/* App Bar */}
      <AppBar position="static" sx={{ mb: 3 }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="back"
            onClick={() => navigate('/')}
            sx={{ mr: 2 }}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            PWA 安装指南
          </Typography>
          <Chip
            icon={<InstallMobile />}
            label="PWA"
            color="secondary"
            size="small"
            sx={{ bgcolor: 'white', color: 'primary.main' }}
          />
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg">
        {/* Hero Section */}
        <Paper
          elevation={3}
          sx={{
            p: 4,
            mb: 4,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            textAlign: 'center'
          }}
        >
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
            安装转账通知生成器
          </Typography>
          <Typography variant="h6" sx={{ mb: 3, opacity: 0.95 }}>
            将应用安装到您的设备，享受原生应用般的体验
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Chip icon={<Apple />} label="iOS" sx={{ bgcolor: 'white', color: 'black' }} />
            <Chip icon={<Android />} label="Android" sx={{ bgcolor: 'white', color: '#3DDC84' }} />
            <Chip icon={<DesktopMac />} label="Desktop" sx={{ bgcolor: 'white', color: 'primary.main' }} />
          </Box>
        </Paper>

        {/* Features Grid */}
        <Typography variant="h4" gutterBottom sx={{ mb: 3, textAlign: 'center' }}>
          为什么要安装 PWA？
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2, mb: 4 }}>
          {features.map((feature, index) => (
            <Card key={index} elevation={2}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h2" sx={{ mb: 1 }}>{feature.icon}</Typography>
                <Typography variant="h6" gutterBottom>{feature.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Installation Instructions */}
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
            安装步骤
          </Typography>

          {/* Device Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant={isMobile ? 'fullWidth' : 'standard'}
              aria-label="device installation tabs"
            >
              <Tab
                icon={<PhoneIphone />}
                label="iPhone/iPad"
                iconPosition="start"
              />
              <Tab
                icon={<Android />}
                label="Android"
                iconPosition="start"
              />
              <Tab
                icon={<DesktopMac />}
                label="电脑"
                iconPosition="start"
              />
            </Tabs>
          </Box>

          {/* iOS Instructions */}
          <TabPanel value={tabValue} index={0}>
            <Alert severity="info" sx={{ mb: 3 }}>
              <strong>重要：</strong>iOS 设备必须使用 Safari 浏览器才能安装 PWA
            </Alert>
            
            <Stepper activeStep={activeStep} orientation="vertical">
              {iOSSteps.map((step, index) => (
                <Step key={index}>
                  <StepLabel
                    optional={
                      index === iOSSteps.length - 1 ? (
                        <Typography variant="caption">最后一步</Typography>
                      ) : null
                    }
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="h5">{step.icon}</Typography>
                      <Typography>{step.label}</Typography>
                    </Box>
                  </StepLabel>
                  <StepContent>
                    <Typography>{step.description}</Typography>
                    <Box sx={{ mb: 2, mt: 2 }}>
                      {/* Visual Guide Cards */}
                      {index === 1 && (
                        <Card sx={{ maxWidth: 400 }}>
                          <CardContent sx={{ bgcolor: 'grey.100', p: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                              <Share sx={{ fontSize: 48, color: 'primary.main' }} />
                            </Box>
                            <Typography variant="caption" align="center" display="block">
                              底部工具栏中的分享按钮
                            </Typography>
                          </CardContent>
                        </Card>
                      )}
                      {index === 2 && (
                        <Card sx={{ maxWidth: 400 }}>
                          <CardContent sx={{ bgcolor: 'grey.100', p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                              <Add />
                              <Typography>添加到主屏幕</Typography>
                            </Box>
                            <Typography variant="caption">
                              在分享菜单中找到此选项
                            </Typography>
                          </CardContent>
                        </Card>
                      )}
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Button
                        variant="contained"
                        onClick={() => setActiveStep(index + 1)}
                        sx={{ mt: 1, mr: 1 }}
                        disabled={index === iOSSteps.length - 1}
                      >
                        下一步
                      </Button>
                      <Button
                        disabled={index === 0}
                        onClick={() => setActiveStep(index - 1)}
                        sx={{ mt: 1, mr: 1 }}
                      >
                        上一步
                      </Button>
                    </Box>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
          </TabPanel>

          {/* Android Instructions */}
          <TabPanel value={tabValue} index={1}>
            <Alert severity="success" sx={{ mb: 3 }}>
              <strong>提示：</strong>如果看到安装提示，直接点击即可快速安装！
            </Alert>
            
            <Stepper activeStep={activeStep} orientation="vertical">
              {androidSteps.map((step, index) => (
                <Step key={index}>
                  <StepLabel
                    optional={
                      index === androidSteps.length - 1 ? (
                        <Typography variant="caption">最后一步</Typography>
                      ) : null
                    }
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="h5">{step.icon}</Typography>
                      <Typography>{step.label}</Typography>
                    </Box>
                  </StepLabel>
                  <StepContent>
                    <Typography>{step.description}</Typography>
                    <Box sx={{ mb: 2, mt: 2 }}>
                      {/* Visual Guide Cards */}
                      {index === 1 && (
                        <Card sx={{ maxWidth: 400 }}>
                          <CardContent sx={{ bgcolor: 'grey.100', p: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                              <MoreVert sx={{ fontSize: 32 }} />
                            </Box>
                            <Typography variant="caption" align="center" display="block">
                              右上角的菜单按钮
                            </Typography>
                          </CardContent>
                        </Card>
                      )}
                      {index === 2 && (
                        <Card sx={{ maxWidth: 400 }}>
                          <CardContent sx={{ bgcolor: 'grey.100', p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                              <GetApp />
                              <Typography>安装应用</Typography>
                            </Box>
                            <Typography variant="caption">
                              在菜单中找到此选项
                            </Typography>
                          </CardContent>
                        </Card>
                      )}
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Button
                        variant="contained"
                        onClick={() => setActiveStep(index + 1)}
                        sx={{ mt: 1, mr: 1 }}
                        disabled={index === androidSteps.length - 1}
                      >
                        下一步
                      </Button>
                      <Button
                        disabled={index === 0}
                        onClick={() => setActiveStep(index - 1)}
                        sx={{ mt: 1, mr: 1 }}
                      >
                        上一步
                      </Button>
                    </Box>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
          </TabPanel>

          {/* Desktop Instructions */}
          <TabPanel value={tabValue} index={2}>
            <Alert severity="info" sx={{ mb: 3 }}>
              <strong>支持的浏览器：</strong>Chrome、Microsoft Edge、Opera
            </Alert>
            
            <Stepper activeStep={activeStep} orientation="vertical">
              {desktopSteps.map((step, index) => (
                <Step key={index}>
                  <StepLabel
                    optional={
                      index === desktopSteps.length - 1 ? (
                        <Typography variant="caption">最后一步</Typography>
                      ) : null
                    }
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="h5">{step.icon}</Typography>
                      <Typography>{step.label}</Typography>
                    </Box>
                  </StepLabel>
                  <StepContent>
                    <Typography>{step.description}</Typography>
                    <Box sx={{ mb: 2, mt: 2 }}>
                      {index === 1 && (
                        <Card sx={{ maxWidth: 400 }}>
                          <CardContent sx={{ bgcolor: 'grey.100', p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                              <Typography sx={{ flex: 1, bgcolor: 'white', p: 1, borderRadius: 1 }}>
                                card-template-2eae4.web.app
                              </Typography>
                              <IconButton color="primary" sx={{ border: '2px solid', borderColor: 'primary.main' }}>
                                <Add />
                              </IconButton>
                            </Box>
                            <Typography variant="caption" align="center" display="block">
                              地址栏右侧的安装按钮
                            </Typography>
                          </CardContent>
                        </Card>
                      )}
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Button
                        variant="contained"
                        onClick={() => setActiveStep(index + 1)}
                        sx={{ mt: 1, mr: 1 }}
                        disabled={index === desktopSteps.length - 1}
                      >
                        下一步
                      </Button>
                      <Button
                        disabled={index === 0}
                        onClick={() => setActiveStep(index - 1)}
                        sx={{ mt: 1, mr: 1 }}
                      >
                        上一步
                      </Button>
                    </Box>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
          </TabPanel>
        </Paper>

        {/* Success Message */}
        <Paper
          elevation={3}
          sx={{
            p: 3,
            mt: 4,
            mb: 4,
            bgcolor: 'success.light',
            color: 'white',
            textAlign: 'center'
          }}
        >
          <CheckCircle sx={{ fontSize: 48, mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            安装完成后
          </Typography>
          <Typography variant="body1">
            您可以像使用原生应用一样使用我们的 PWA，享受快速、流畅的体验！
          </Typography>
          <Button
            variant="contained"
            color="inherit"
            startIcon={<Home />}
            onClick={() => navigate('/')}
            sx={{ mt: 2, color: 'success.main' }}
          >
            返回主页
          </Button>
        </Paper>
      </Container>
    </>
  )
}

export default PWAGuide