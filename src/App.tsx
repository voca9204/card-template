import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './components/HomePage'
import QuickDownload from './components/QuickDownload'

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/quick" element={<QuickDownload />} />
      </Routes>
    </Router>
  )
}

export default App