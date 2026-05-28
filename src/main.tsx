import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router'
import { TRPCProvider } from '@/providers/trpc'
import './i18n/i18n.ts'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <TRPCProvider>
        <App />
      </TRPCProvider>
    </HashRouter>
  </StrictMode>,
)
