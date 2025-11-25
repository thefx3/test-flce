import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'shared-ui/index.css'
import App from './App.jsx'
import { AuthProvider } from 'shared-ui/contexts/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)
