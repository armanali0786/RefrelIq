import React from 'react'
import ReactDOM from 'react-dom/client'
import { OverlayApp } from '@/overlay/App'

function mount() {
  if (document.getElementById('joblens-root')) return

  const host   = document.createElement('div')
  host.id      = 'joblens-root'
  document.body.appendChild(host)

  const shadow = host.attachShadow({ mode: 'open' })

  const style       = document.createElement('style')
  style.textContent = `
    * { box-sizing: border-box; }
    :host { all: initial; font-family: Inter, -apple-system, sans-serif; }
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400..700&family=JetBrains+Mono:wght@400;500&display=swap');
    .riq-scroll::-webkit-scrollbar { width: 4px; }
    .riq-scroll::-webkit-scrollbar-thumb { background: #EAE6E1; border-radius: 999px; }
    .riq-scroll::-webkit-scrollbar-track { background: transparent; }
  `
  shadow.appendChild(style)

  const container = document.createElement('div')
  shadow.appendChild(container)

  ReactDOM.createRoot(container).render(React.createElement(OverlayApp))
}

mount()
