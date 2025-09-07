#!/usr/bin/env node

/**
 * Claude Code Custom Command: screenshot
 * Создает скриншот главной страницы приложения
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
    console.log('🔄 Создание скриншота главной страницы...');

    // Переходим на главную страницу
    await page.goto('http://localhost:3001/', { waitUntil: 'networkidle2' });

    // Ждем, пока загрузятся изображения
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Создаем уникальное имя файла с временной меткой
    const timestamp = new Date()
      .toISOString()
      .replace(/[:.]/g, '-')
      .slice(0, -5);
    const filename = `homepage-${timestamp}.png`;
    const filepath = path.join(tmpDir, filename);

    // Делаем скриншот
    await page.screenshot({
      path: filepath,
      fullPage: true,
    });

    console.log(`✅ Скриншот сохранен: ${filepath}`);
  } catch (error) {
    console.error('❌ Ошибка при создании скриншота:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
