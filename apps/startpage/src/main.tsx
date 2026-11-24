import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ClerkProvider } from '@clerk/chrome-extension'
import { extensionUrl } from '../lib/browser'

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
const clerkSyncHost = import.meta.env.VITE_CLERK_SYNC_HOST

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {publishableKey && extensionUrl ? (
      <ClerkProvider
        publishableKey={publishableKey}
        syncHost={clerkSyncHost}
        __experimental_syncHostListener
      >
        <App />
      </ClerkProvider>
    ) : <App />}
  </StrictMode>,
)
