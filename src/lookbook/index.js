import React from 'react'
import ReactDOM from 'react-dom'
import './styles.css'
import App from './app'

function Overlay() {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', width: '100%', height: '100%' }}>      
    </div>
  )
}

ReactDOM.render(
  <>
    <App />
    <Overlay />
    {/* <Logo style={{ position: 'absolute', bottom: 40, left: 40, width: 30 }} /> */}
  </>,
  document.getElementById('root')
)
