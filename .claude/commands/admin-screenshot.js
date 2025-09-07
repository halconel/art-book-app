#!/usr/bin/env node

/**
 * Claude Code Custom Command: admin-screenshot
 * Создает скриншот страницы админ-дашборда
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Создаем каталог tmp если его нет
const tmpDir = path.join(process.cwd(), 'tmp');
if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir, { recursive: true });
}

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Устанавливаем размер экрана
  await page.setViewport({ width: 1920, height: 1080 });

  try {
    console.log('🔄 Создание скриншота админ-дашборда...');

    // Переходим на админ-дашборд
    await page.goto('http://localhost:3000/#/admin', { waitUntil: 'networkidle2' });

    // Ждем, пока загрузится админ-дашборд
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Создаем уникальное имя файла с временной меткой
    const timestamp = new Date()
      .toISOString()
      .replace(/[:.]/g, '-')
      .slice(0, -5);
    const filename = `admin-dashboard-${timestamp}.png`;
    const filepath = path.join(tmpDir, filename);

    // Делаем скриншот
    await page.screenshot({
      path: filepath,
      fullPage: true,
    });

    console.log(`✅ Скриншот админ-дашборда сохранен: ${filepath}`);
  } catch (error) {
    console.error('❌ Ошибка при создании скриншота:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
