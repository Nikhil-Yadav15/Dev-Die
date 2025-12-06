import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="311464647043-vdj5m06gf0t7jbqbv4b7c5gglkotj6sb.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </StrictMode>
)
