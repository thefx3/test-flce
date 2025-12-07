import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom"
import 'shared-ui/index.css'
import AdminRouter from './App.jsx'
import { AdminProvider } from './context/AdminContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AdminProvider>
      <BrowserRouter>
        <AdminRouter />
      </BrowserRouter>
    </AdminProvider>
  </StrictMode>,
)
