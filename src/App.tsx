import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './components/HomePage'
import QuickDownload from './components/QuickDownload'
import PWAGuide from './components/PWAGuide'
import PWAInstallButton from './components/PWAInstallButton'

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/quick" element={<QuickDownload />} />
        <Route path="/pwa-guide" element={<PWAGuide />} />
      </Routes>
      <PWAInstallButton />
    </Router>
  )
}

export default App