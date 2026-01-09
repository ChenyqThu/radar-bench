import { test, expect } from '@playwright/test'

test.describe('完整编辑流程测试', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')

    // 等待页面加载完成
    await page.waitForLoadState('networkidle')

    // 清除IndexedDB，确保每次测试都从干净状态开始
    await page.evaluate(() => {
      return indexedDB.deleteDatabase('RadarBenchDB')
    })

    // 刷新页面以应用清除后的状态
    await page.reload()
    await page.waitForLoadState('networkidle')
  })

  test('应该能完成添加维度、设置权重、输入分数的完整流程', async ({ page }) => {
    // 1. 等待应用加载
    await expect(page.locator('text=Radar Bench')).toBeVisible()

    // 2. 添加第一个竞品
    const addVendorButton = page.locator(
      'button:has-text("Add Vendor"), button:has-text("添加竞品")'
    )
    await addVendorButton.first().click()

    // 验证竞品已添加（应该有一个vendor item）
    await expect(
      page.locator('[data-testid="vendor-item"]').first()
    ).toBeVisible({ timeout: 5000 })

    // 3. 添加第二个竞品
    await addVendorButton.first().click()

    // 等待第二个竞品出现
    await expect(
      page.locator('[data-testid="vendor-item"]').nth(1)
    ).toBeVisible({ timeout: 5000 })

    // 4. 添加第一个维度
    const addDimensionButton = page.locator(
      'button:has-text("Add Dimension"), button:has-text("添加维度")'
    )
    await addDimensionButton.first().click()

    // 等待维度行出现
    await expect(
      page.locator('[data-testid="dimension-row"]').first()
    ).toBeVisible({ timeout: 5000 })

    // 5. 设置第一个维度的权重为60
    const firstWeightInput = page.locator('input[type="number"]').first()
    await firstWeightInput.click()
    await firstWeightInput.fill('60')
    await firstWeightInput.press('Enter')

    // 等待权重更新
    await page.waitForTimeout(500)

    // 6. 添加第二个维度
    await addDimensionButton.first().click()
    await expect(
      page.locator('[data-testid="dimension-row"]').nth(1)
    ).toBeVisible({ timeout: 5000 })

    // 7. 设置第二个维度的权重为40
    const secondWeightInput = page
      .locator('[data-testid="dimension-row"]')
      .nth(1)
      .locator('input[type="number"]')
      .first()
    await secondWeightInput.click()
    await secondWeightInput.fill('40')
    await secondWeightInput.press('Enter')

    // 等待权重更新
    await page.waitForTimeout(500)

    // 8. 验证权重总和为100%（应该显示绿色勾）
    await expect(page.locator('text=✓, text=Weights sum to 100%')).toBeVisible({
      timeout: 5000,
    })

    // 9. 为第一个竞品的第一个维度输入分数
    const firstScoreInput = page.locator('[data-testid="score-input"]').first()
    await firstScoreInput.click()
    await firstScoreInput.fill('8')
    await firstScoreInput.press('Enter')

    await page.waitForTimeout(500)

    // 10. 为第一个竞品的第二个维度输入分数
    const secondScoreInput = page.locator('[data-testid="score-input"]').nth(2)
    await secondScoreInput.click()
    await secondScoreInput.fill('6')
    await secondScoreInput.press('Enter')

    await page.waitForTimeout(500)

    // 11. 为第二个竞品的第一个维度输入分数
    const thirdScoreInput = page.locator('[data-testid="score-input"]').nth(1)
    await thirdScoreInput.click()
    await thirdScoreInput.fill('7')
    await thirdScoreInput.press('Enter')

    await page.waitForTimeout(500)

    // 12. 为第二个竞品的第二个维度输入分数
    const fourthScoreInput = page.locator('[data-testid="score-input"]').nth(3)
    await fourthScoreInput.click()
    await fourthScoreInput.fill('9')
    await fourthScoreInput.press('Enter')

    await page.waitForTimeout(500)

    // 13. 验证排名面板显示正确的总分
    // 第一个竞品: 8*0.6 + 6*0.4 = 4.8 + 2.4 = 7.2
    // 第二个竞品: 7*0.6 + 9*0.4 = 4.2 + 3.6 = 7.8
    const scoreboard = page.locator('text=Rankings, text=排名')
    await expect(scoreboard).toBeVisible({ timeout: 5000 })

    // 验证至少有分数显示
    await expect(page.locator('text=7.2, text=7.8').first()).toBeVisible({
      timeout: 5000,
    })

    // 14. 验证雷达图已渲染（检查canvas元素）
    const radarChart = page.locator('canvas').first()
    await expect(radarChart).toBeVisible({ timeout: 5000 })
  })

  test('应该能添加子维度并自动计算父维度分数', async ({ page }) => {
    // 1. 等待应用加载
    await expect(page.locator('text=Radar Bench')).toBeVisible()

    // 2. 添加一个竞品
    const addVendorButton = page.locator(
      'button:has-text("Add Vendor"), button:has-text("添加竞品")'
    )
    await addVendorButton.first().click()
    await expect(
      page.locator('[data-testid="vendor-item"]').first()
    ).toBeVisible({ timeout: 5000 })

    // 3. 添加一个维度
    const addDimensionButton = page.locator(
      'button:has-text("Add Dimension"), button:has-text("添加维度")'
    )
    await addDimensionButton.first().click()
    await expect(
      page.locator('[data-testid="dimension-row"]').first()
    ).toBeVisible({ timeout: 5000 })

    // 4. 设置维度权重为100
    const weightInput = page.locator('input[type="number"]').first()
    await weightInput.click()
    await weightInput.fill('100')
    await weightInput.press('Enter')
    await page.waitForTimeout(500)

    // 5. 点击展开按钮，展开子维度区域
    const expandButton = page
      .locator('[data-testid="dimension-row"]')
      .first()
      .locator('button[aria-label*="Expand"], button[aria-label*="展开"]')
      .first()
    await expandButton.click()
    await page.waitForTimeout(500)

    // 6. 添加第一个子维度
    const addSubDimensionButton = page.locator(
      'button:has-text("Add Sub-dimension"), button:has-text("添加子维度")'
    )
    await addSubDimensionButton.first().click()
    await page.waitForTimeout(500)

    // 7. 添加第二个子维度
    await addSubDimensionButton.first().click()
    await page.waitForTimeout(500)

    // 8. 设置子维度权重
    const subDimensionRows = page.locator('[data-testid="sub-dimension-row"]')

    // 第一个子维度权重60
    const firstSubWeight = subDimensionRows
      .first()
      .locator('input[type="number"]')
      .first()
    await firstSubWeight.click()
    await firstSubWeight.fill('60')
    await firstSubWeight.press('Enter')
    await page.waitForTimeout(500)

    // 第二个子维度权重40
    const secondSubWeight = subDimensionRows
      .nth(1)
      .locator('input[type="number"]')
      .first()
    await secondSubWeight.click()
    await secondSubWeight.fill('40')
    await secondSubWeight.press('Enter')
    await page.waitForTimeout(500)

    // 9. 为子维度输入分数
    // 第一个子维度分数8
    const firstSubScore = subDimensionRows
      .first()
      .locator('[data-testid="score-input"]')
      .first()
    await firstSubScore.click()
    await firstSubScore.fill('8')
    await firstSubScore.press('Enter')
    await page.waitForTimeout(500)

    // 第二个子维度分数6
    const secondSubScore = subDimensionRows
      .nth(1)
      .locator('[data-testid="score-input"]')
      .first()
    await secondSubScore.click()
    await secondSubScore.fill('6')
    await secondSubScore.press('Enter')
    await page.waitForTimeout(1000)

    // 10. 验证父维度分数自动计算
    // 预期: 8*0.6 + 6*0.4 = 4.8 + 2.4 = 7.2
    // 父维度的分数输入框应该显示为只读或自动计算
    const parentScore = page
      .locator('[data-testid="dimension-row"]')
      .first()
      .locator('[data-testid="score-input"]')
      .first()
    const scoreValue = await parentScore.inputValue()
    expect(parseFloat(scoreValue)).toBeCloseTo(7.2, 1)
  })

  test('应该能删除维度和竞品', async ({ page }) => {
    // 1. 等待应用加载
    await expect(page.locator('text=Radar Bench')).toBeVisible()

    // 2. 添加竞品
    const addVendorButton = page.locator(
      'button:has-text("Add Vendor"), button:has-text("添加竞品")'
    )
    await addVendorButton.first().click()
    await expect(
      page.locator('[data-testid="vendor-item"]').first()
    ).toBeVisible({ timeout: 5000 })

    // 3. 添加维度
    const addDimensionButton = page.locator(
      'button:has-text("Add Dimension"), button:has-text("添加维度")'
    )
    await addDimensionButton.first().click()
    await expect(
      page.locator('[data-testid="dimension-row"]').first()
    ).toBeVisible({ timeout: 5000 })

    // 4. 删除竞品
    const deleteVendorButton = page
      .locator('[data-testid="vendor-item"]')
      .first()
      .locator('button[aria-label*="Delete"], button[aria-label*="删除"]')
    await deleteVendorButton.click()

    // 确认删除对话框
    const confirmButton = page
      .locator('button:has-text("Delete"), button:has-text("删除")')
      .last()
    await confirmButton.click()
    await page.waitForTimeout(500)

    // 验证竞品已删除
    await expect(page.locator('[data-testid="vendor-item"]')).toHaveCount(0, {
      timeout: 5000,
    })

    // 5. 添加两个维度以便测试删除
    await addDimensionButton.first().click()
    await page.waitForTimeout(500)
    await addDimensionButton.first().click()
    await page.waitForTimeout(500)

    // 6. 删除第一个维度
    const deleteDimensionButton = page
      .locator('[data-testid="dimension-row"]')
      .first()
      .locator('button[aria-label*="Delete"], button[aria-label*="删除"]')
    await deleteDimensionButton.click()

    // 确认删除对话框
    const confirmDimButton = page
      .locator('button:has-text("Delete"), button:has-text("删除")')
      .last()
    await confirmDimButton.click()
    await page.waitForTimeout(500)

    // 验证维度已删除（现在应该只有1个维度）
    await expect(page.locator('[data-testid="dimension-row"]')).toHaveCount(1, {
      timeout: 5000,
    })
  })
})
