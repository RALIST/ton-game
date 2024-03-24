import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './Components/App/App.tsx'
import '@/assets/fonts/fallout.ttf'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)