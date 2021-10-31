import ReactDOM from 'react-dom'
import React, { Suspense } from 'react'
import App from './app'
import './styles.css'

ReactDOM.render(
  <Suspense fallback={null}>
    <App />
  </Suspense>,
  document.getElementById('root')
)
