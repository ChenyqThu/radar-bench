import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './i18n/config'

ReactDOM.createRoot(document.getElementById('root')!).render(
  // 注意: 暂时禁用 StrictMode 以避免 echarts-for-react 的已知问题
  // echarts-for-react 在 StrictMode 下可能会有重复渲染的问题
  // 应用已添加 Error Boundary 来捕获和处理运行时错误
  <App />
)
