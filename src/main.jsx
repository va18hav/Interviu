import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './utils/authInterceptor.js' // Enable global 401 detection
import App from './App.jsx'

createRoot(document.getElementById('root')).render(

  <App />

)
