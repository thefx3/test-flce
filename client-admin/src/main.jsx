import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom"
import 'shared-ui/index.css'
import AdminRouter from './App.jsx'
import { AdminProvider } from './context/AdminContext.jsx'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";


const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AdminProvider>

      <BrowserRouter>

        <QueryClientProvider client={queryClient}>

          <AdminRouter />
          <ReactQueryDevtools initialIsOpen={false} />
          
        </QueryClientProvider>

      </BrowserRouter>

    </AdminProvider>
  </StrictMode>,
)
