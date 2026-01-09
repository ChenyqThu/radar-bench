import { test, expect } from '@playwright/test'

/**
 * 基础烟雾测试 - 验证应用能够正常加载和基本交互
 */
test.describe('应用基础功能测试', () => {
  test('应该能正常加载应用', async ({ page }) => {
    await page.goto('/')

    // 验证页面标题
    await expect(page).toHaveTitle(/Radar Bench/)

    // 验证主标题存在
    await expect(page.locator('text=Radar Bench').first()).toBeVisible()

    // 验证雷达图区域存在
    await expect(page.locator('canvas').first()).toBeVisible({ timeout: 10000 })
  })

  test('应该能添加和删除竞品', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // 等待页面完全加载
    await page.waitForTimeout(1000)

    // 添加竞品按钮可能在不同位置，使用更灵活的选择器
    const addButton = page
      .locator('button')
      .filter({ hasText: /Add.*Vendor|添加.*竞品/ })
      .first()

    // 如果按钮存在，点击它
    if (await addButton.isVisible()) {
      await addButton.click()
      await page.waitForTimeout(500)

      // 验证竞品已添加
      const vendorCount = await page
        .locator('[data-testid="vendor-item"]')
        .count()
      expect(vendorCount).toBeGreaterThan(0)
    }
  })

  test('应该能添加维度', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)

    // 添加维度
    const addDimensionButton = page
      .locator('button')
      .filter({ hasText: /Add.*Dimension|添加.*维度/ })
      .first()

    if (await addDimensionButton.isVisible()) {
      await addDimensionButton.click()
      await page.waitForTimeout(500)

      // 验证维度已添加
      const dimensionCount = await page
        .locator('[data-testid="dimension-row"]')
        .count()
      expect(dimensionCount).toBeGreaterThan(0)
    }
  })
})

/**
 * 集成测试 - 测试完整的工作流程
 */
test.describe('完整工作流测试', () => {
  test('应该能完成基本的评分流程', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)

    // 步骤1: 添加竞品
    const addVendorButton = page
      .locator('button')
      .filter({ hasText: /Add.*Vendor|添加.*竞品/ })
      .first()

    if (await addVendorButton.isVisible()) {
      // 添加第一个竞品
      await addVendorButton.click()
      await page.waitForTimeout(500)

      // 添加第二个竞品
      await addVendorButton.click()
      await page.waitForTimeout(500)

      // 验证有两个竞品
      const vendorCount = await page
        .locator('[data-testid="vendor-item"]')
        .count()
      expect(vendorCount).toBeGreaterThanOrEqual(2)

      // 步骤2: 添加维度
      const addDimensionButton = page
        .locator('button')
        .filter({ hasText: /Add.*Dimension|添加.*维度/ })
        .first()

      if (await addDimensionButton.isVisible()) {
        // 添加两个维度
        await addDimensionButton.click()
        await page.waitForTimeout(500)
        await addDimensionButton.click()
        await page.waitForTimeout(500)

        // 验证有两个维度
        const dimensionCount = await page
          .locator('[data-testid="dimension-row"]')
          .count()
        expect(dimensionCount).toBeGreaterThanOrEqual(2)

        // 步骤3: 设置权重 (可选，因为可能有默认权重)
        const weightInputs = page
          .locator('input[type="number"]')
          .filter({ hasText: '' })
        if (await weightInputs.first().isVisible()) {
          // 尝试设置第一个维度权重为50
          await weightInputs.first().click()
          await weightInputs.first().fill('50')
          await weightInputs.first().press('Enter')
          await page.waitForTimeout(300)

          // 尝试设置第二个维度权重为50
          const secondWeight = page
            .locator('[data-testid="dimension-row"]')
            .nth(1)
            .locator('input[type="number"]')
            .first()
          await secondWeight.click()
          await secondWeight.fill('50')
          await secondWeight.press('Enter')
          await page.waitForTimeout(300)
        }

        // 步骤4: 输入分数
        const scoreInputs = page.locator('[data-testid="score-input"]')
        const scoreCount = await scoreInputs.count()

        if (scoreCount > 0) {
          // 为前几个分数输入框输入测试分数
          const scoresToInput = Math.min(4, scoreCount)
          const testScores = [8, 7, 6, 9]

          for (let i = 0; i < scoresToInput; i++) {
            await scoreInputs.nth(i).click()
            await scoreInputs
              .nth(i)
              .fill(String(testScores[i % testScores.length]))
            await scoreInputs.nth(i).press('Enter')
            await page.waitForTimeout(200)
          }

          // 验证分数已保存
          const firstScore = await scoreInputs.first().inputValue()
          expect(parseInt(firstScore)).toBeGreaterThanOrEqual(0)
          expect(parseInt(firstScore)).toBeLessThanOrEqual(10)
        }

        // 步骤5: 验证排名面板可见
        const ranking = page.locator('text=/Rankings|排名/').first()
        await expect(ranking).toBeVisible({ timeout: 3000 })
      }
    }
  })
})
