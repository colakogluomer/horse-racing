import { test, expect } from '@playwright/test'

test.describe('Horse Racing Game Flow', () => {
  test('should generate program, start race, and show results', async ({ page }) => {
    // Navigate to the home page
    await page.goto('/')

    // Check if title is correct
    await expect(page.locator('h1.title')).toHaveText('Horse Racing')

    // Generate program
    const generateBtn = page.locator('button:has-text("GENERATE PROGRAM")')
    await generateBtn.click()

    // Verify program is populated (should have 6 rounds)
    const programRounds = page.locator('.program-section .round-group')
    await expect(programRounds).toHaveCount(6)

    // Start race
    const startBtn = page.locator('button:has-text("START")')
    await startBtn.click()

    // Verify button changes to PAUSE
    await expect(page.locator('button:has-text("PAUSE")')).toBeVisible()

    // Wait for the race to finish (this might take a few seconds depending on speed)
    // We look for the "START" button to reappear (or wait for results)
    await page.waitForSelector('button:has-text("START")', { timeout: 30000 })

    // Verify results section has at least one entry
    const resultRounds = page.locator('.results-section .round-group')
    await expect(resultRounds).toHaveCount(1)
    
    // Check results table content
    const firstResultPosition = resultRounds.first().locator('td').first()
    await expect(firstResultPosition).toHaveText('1')
  })

  test('should correctly pause and resume a race', async ({ page }) => {
    await page.goto('/')
    await page.locator('button:has-text("GENERATE PROGRAM")').click()
    
    // Start race
    await page.locator('button:has-text("START")').click()
    
    // Wait a bit then pause
    await page.waitForTimeout(1000)
    await page.locator('button:has-text("PAUSE")').click()
    
    // Verify button changes to RESUME
    await expect(page.locator('button:has-text("RESUME")')).toBeVisible()
    
    // Resume race
    await page.locator('button:has-text("RESUME")').click()
    await expect(page.locator('button:has-text("PAUSE")')).toBeVisible()
    
    // Wait for the race to finish
    await page.waitForSelector('button:has-text("START")', { timeout: 30000 })
    await expect(page.locator('.results-section .round-group')).toHaveCount(1)
  })

  test('should complete a full 6-lap season and show completion message', async ({ page }) => {
    test.setTimeout(180000) // Increase timeout for this long test (3 mins)
    await page.goto('/')
    await page.locator('button:has-text("GENERATE PROGRAM")').click()
    
    // Loop through 6 rounds
    for (let i = 1; i <= 6; i++) {
      // Start the race for the current round
      const startBtn = page.locator('button:has-text("START")')
      await expect(startBtn).toBeEnabled()
      await startBtn.click()
      
      // Wait for the race to finish and START button to reappear (or the next lap to be ready)
      // Since it's a real-time race, this might take a while.
      // 30s per lap is safe as 2200m is the max.
      await page.waitForSelector('button:has-text("START")', { timeout: 60000 })
      
      // Verify results count
      await expect(page.locator('.results-section .round-group')).toHaveCount(i)
      
      // Verify upcoming program count (should decrease)
      if (i < 6) {
        await expect(page.locator('.program-section .round-group')).toHaveCount(6 - i)
      }
    }
    
    // After 6th round
    // 1. ALL RACES COMPLETED message should be visible
    await expect(page.locator('text=ALL RACES COMPLETED!')).toBeVisible()
    
    // 2. START button should be disabled
    const lastStartBtn = page.locator('button:has-text("START")')
    await expect(lastStartBtn).toBeDisabled()
  })
})
