import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { TRPCProvider } from '@/providers/trpc'
import { AnalyticsProvider } from '@/providers/AnalyticsProvider'
import './i18n/i18n.ts'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <TRPCProvider>
        <AnalyticsProvider><App /></AnalyticsProvider>
      </TRPCProvider>
    </BrowserRouter>
  </StrictMode>,
)
