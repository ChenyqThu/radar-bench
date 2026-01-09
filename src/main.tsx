import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './i18n/config'

ReactDOM.createRoot(document.getElementById('root')!).render(
  // 暂时禁用 StrictMode 以避免 echarts-for-react 的已知问题
  // TODO: 在 v0.4.0 中添加 Error Boundary 来处理这类错误
  // <React.StrictMode>
  <App />
  // </React.StrictMode>
)
