import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import CreateNote from './pages/CreateNote.jsx'
import ViewNote from './pages/ViewNote.jsx'
import UploadFile from './pages/UploadFile.jsx'
import ViewFile from './pages/ViewFile.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CreateNote />} />
        <Route path="/note/:slug" element={<ViewNote />} />
        <Route path="/upload" element={<UploadFile />} />
        <Route path="/file/:slug" element={<ViewFile />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
