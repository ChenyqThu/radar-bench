import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright 配置文件
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './e2e',

  /* 并行运行测试 */
  fullyParallel: true,

  /* 在CI上失败时禁止重试，本地可以重试 */
  forbidOnly: !!process.env.CI,

  /* 在CI上重试失败的测试 */
  retries: process.env.CI ? 2 : 0,

  /* 并行worker数量 */
  workers: process.env.CI ? 1 : undefined,

  /* 测试报告器 */
  reporter: 'html',

  /* 共享设置 */
  use: {
    /* 基础URL */
    baseURL: 'http://localhost:5173',

    /* 截图设置 */
    screenshot: 'only-on-failure',

    /* 视频设置 */
    video: 'retain-on-failure',

    /* 追踪设置 */
    trace: 'on-first-retry',
  },

  /* 配置不同的浏览器项目 */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    // 可选的其他浏览器（需要先安装: pnpm exec playwright install）
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* 移动端测试 */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },
  ],

  /* 运行测试前启动开发服务器 */
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
})
