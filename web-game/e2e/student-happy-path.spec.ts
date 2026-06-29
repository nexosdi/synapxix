import { test, expect } from '@playwright/test';

test.describe('Student Happy Path', () => {
  test('Main flow: splash -> map -> play -> feedback', async ({ page }) => {
    // 1. Splash screen - Click play button
    await page.goto('/');
    
    const playButton = page.getByRole('button', { name: '▶' });
    await expect(playButton).toBeVisible();
    await playButton.click();

    // 2. Map screen - Verify history loaded and click first game
    await page.waitForURL('**/map');
    
    // Verify that the story title is visible
    await expect(page.getByText('Story Path')).toBeVisible();
    
    // Click on the first available game
    const firstPlayButton = page.getByRole('button', { name: /Play/i }).first();
    await expect(firstPlayButton).toBeVisible();
    await firstPlayButton.click();

    // 3. Game screen
    await page.waitForURL('**/game');
    
    // Wait for the game runner to load
    const gameRunner = page.locator('lib-game-runner');
    await expect(gameRunner).toBeVisible({ timeout: 10000 });
    
    // --- GAME 1: Intruder (odd-01) ---
    // Wait for prompt to appear
    await expect(page.getByText('¿Quién no vive en la selva?')).toBeVisible({ timeout: 10000 });
    // Click the correct answer
    await page.getByText('Pingüino').click();
    // Wait for the feedback modal (AI Feedback and Continue button)
    const continueBtn = page.locator('#feedback-continue-btn');
    await expect(continueBtn).toBeVisible({ timeout: 30000 });
    await continueBtn.click();

    // --- GAME 2: Read Select (read-select-forest-1) ---
    await expect(page.getByText('Tap every real word you can find before the vines grow back.')).toBeVisible({ timeout: 10000 });
    // Click the two correct real words
    await page.getByText('river').click();
    await page.getByText('bright').click();
    await expect(continueBtn).toBeVisible({ timeout: 30000 });
    await continueBtn.click();

    // --- GAME 3: Fill in the blanks (fill-blanks-story-1) ---
    await expect(page.getByText('Complete the sentence')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('The ___ fox jumps over the ___ dog.')).toBeVisible({ timeout: 10000 });
    // Click correct choices for blanks
    await page.getByRole('button', { name: 'quick' }).click();
    await page.getByRole('button', { name: 'lazy' }).click();
    await expect(continueBtn).toBeVisible({ timeout: 30000 });
    await continueBtn.click();

    // The student successfully finished 3 games and moved forward!
  });
});
