import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { LandscapeGate } from './components/LandscapeGate'
import './style.css'

createRoot(document.getElementById('app')!).render(
  <StrictMode>
    <LandscapeGate>
      <App />
    </LandscapeGate>
  </StrictMode>,
)

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => undefined)
  })
}
