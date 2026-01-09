/**
 * Error Boundary 组件
 * 捕获组件树中的错误并显示友好的错误界面
 */

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, RefreshCw, Home } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onReset?: () => void
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

/**
 * Error Boundary 组件类
 * 在组件树中捕获 JavaScript 错误，记录错误并显示降级 UI
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // 更新 state 使下一次渲染能够显示降级 UI
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 记录错误到错误报告服务
    console.error('ErrorBoundary caught an error:', error, errorInfo)

    this.setState({
      error,
      errorInfo,
    })
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })

    // 调用外部的重置回调
    if (this.props.onReset) {
      this.props.onReset()
    }
  }

  handleReload = () => {
    window.location.reload()
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      // 如果提供了自定义 fallback，使用它
      if (this.props.fallback) {
        return this.props.fallback
      }

      // 否则显示默认错误 UI
      return (
        <div className="flex min-h-screen items-center justify-center p-6 bg-muted/50">
          <Card className="max-w-2xl p-8">
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-5 w-5" />
              <AlertTitle className="text-lg font-semibold">
                抱歉，出现了一些问题
              </AlertTitle>
              <AlertDescription className="mt-2">
                应用程序遇到了一个意外错误。您可以尝试刷新页面或返回首页。
              </AlertDescription>
            </Alert>

            {/* 错误详情（仅在开发模式显示） */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6 space-y-4">
                <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
                  <h3 className="mb-2 font-mono text-sm font-semibold text-destructive">
                    错误信息:
                  </h3>
                  <pre className="overflow-x-auto text-xs text-destructive">
                    {this.state.error.toString()}
                  </pre>
                </div>

                {this.state.errorInfo && (
                  <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
                    <h3 className="mb-2 font-mono text-sm font-semibold text-destructive">
                      组件堆栈:
                    </h3>
                    <pre className="max-h-64 overflow-auto text-xs text-destructive">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </div>
                )}
              </div>
            )}

            {/* 操作按钮 */}
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={this.handleReset}
                variant="default"
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                重试
              </Button>
              <Button
                onClick={this.handleReload}
                variant="outline"
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                刷新页面
              </Button>
              <Button
                onClick={this.handleGoHome}
                variant="outline"
                className="gap-2"
              >
                <Home className="h-4 w-4" />
                返回首页
              </Button>
            </div>

            {/* 支持信息 */}
            <div className="mt-6 rounded-lg border bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground">
                如果问题持续存在，请尝试清除浏览器缓存或联系技术支持。
              </p>
            </div>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * Hook 形式的 Error Boundary 包装器
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode,
  onReset?: () => void
) {
  return function WithErrorBoundaryWrapper(props: P) {
    return (
      <ErrorBoundary fallback={fallback} onReset={onReset}>
        <Component {...props} />
      </ErrorBoundary>
    )
  }
}
