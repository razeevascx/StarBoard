import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ClerkProvider } from '@clerk/chrome-extension'
import { extensionUrl, extensionProtocol } from '../lib/browser'

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {publishableKey && extensionUrl ? (
      <ClerkProvider
        publishableKey={publishableKey}
        allowedRedirectProtocols={extensionProtocol ? [extensionProtocol] : []}
        signInFallbackRedirectUrl={extensionUrl}
        signUpFallbackRedirectUrl={extensionUrl}
      >
        <App />
      </ClerkProvider>
    ) : <App />}
  </StrictMode>,
)
