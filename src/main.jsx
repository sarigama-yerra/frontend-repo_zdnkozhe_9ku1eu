import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import './index.css'

function AssessmentPage(){
  return <App />
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/assessment" element={<App />} />
        <Route path="/breath" element={<App />} />
        <Route path="/journal" element={<App />} />
        <Route path="/edu" element={<App />} />
        <Route path="/safety" element={<App />} />
        <Route path="/articles/:slug" element={<App />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
