import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ClerkProvider } from '@clerk/chrome-extension'

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
const extensionUrl = typeof chrome !== 'undefined' && chrome.runtime?.id ? chrome.runtime.getURL('index.html') : undefined

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {publishableKey && extensionUrl ? (
      <ClerkProvider
        publishableKey={publishableKey}
        allowedRedirectProtocols={['chrome-extension:']}
        signInFallbackRedirectUrl={extensionUrl}
        signUpFallbackRedirectUrl={extensionUrl}
      >
        <App />
      </ClerkProvider>
    ) : <App />}
  </StrictMode>,
)
