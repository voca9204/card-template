import React, { useState, useEffect } from 'react'
import { Button, Snackbar, Alert } from '@mui/material'
import { Download, PhoneIphone, CheckCircle } from '@mui/icons-material'
import { showInstallPrompt, isAppInstalled } from '../registerServiceWorker'

const PWAInstallButton: React.FC = () => {
  const [canInstall, setCanInstall] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [showIOSInstructions, setShowIOSInstructions] = useState(false)

  useEffect(() => {
    // Check if already installed
    setIsInstalled(isAppInstalled())

    // Check if iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    setIsIOS(iOS)

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setCanInstall(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // Check if app was just installed
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true)
      setShowSuccess(true)
      setCanInstall(false)
    })

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (isIOS) {
      // Show iOS installation instructions
      setShowIOSInstructions(true)
    } else if (canInstall) {
      const outcome = await showInstallPrompt()
      if (outcome === 'accepted') {
        setShowSuccess(true)
      }
    }
  }

  // Don't show button if already installed
  if (isInstalled && !showSuccess) {
    return null
  }

  // Don't show on desktop if can't install
  if (!isIOS && !canInstall && !isInstalled) {
    return null
  }

  return (
    <>
      {(canInstall || isIOS) && !isInstalled && (
        <Button
          id="install-button"
          variant="contained"
          color="primary"
          startIcon={isIOS ? <PhoneIphone /> : <Download />}
          onClick={handleInstallClick}
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            zIndex: 1000,
            borderRadius: '24px',
            padding: '10px 20px',
            boxShadow: 3,
            animation: 'pulse 2s infinite',
            '@keyframes pulse': {
              '0%': {
                boxShadow: '0 0 0 0 rgba(25, 118, 210, 0.7)',
              },
              '70%': {
                boxShadow: '0 0 0 10px rgba(25, 118, 210, 0)',
              },
              '100%': {
                boxShadow: '0 0 0 0 rgba(25, 118, 210, 0)',
              },
            },
          }}
        >
          {isIOS ? '安装到主屏幕' : '安装应用'}
        </Button>
      )}

      {/* iOS Installation Instructions */}
      <Snackbar
        open={showIOSInstructions}
        onClose={() => setShowIOSInstructions(false)}
        autoHideDuration={10000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowIOSInstructions(false)} 
          severity="info"
          sx={{ width: '100%', maxWidth: 400 }}
        >
          <strong>安装到 iPhone/iPad:</strong>
          <ol style={{ margin: '10px 0', paddingLeft: '20px' }}>
            <li>点击底部的分享按钮 ⬆️</li>
            <li>滚动并选择 "添加到主屏幕"</li>
            <li>点击 "添加" 完成安装</li>
          </ol>
        </Alert>
      </Snackbar>

      {/* Success Message */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowSuccess(false)} 
          severity="success"
          icon={<CheckCircle />}
          sx={{ width: '100%' }}
        >
          应用安装成功！您可以从主屏幕启动应用。
        </Alert>
      </Snackbar>
    </>
  )
}

export default PWAInstallButton