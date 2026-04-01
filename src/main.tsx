import React from 'react'
import ReactDOM from 'react-dom/client'

// ✅ Import Sellsuki DS CSS first (required)
import '@uxuissk/design-system/styles.css'

import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
