#!/usr/bin/env node

/**
 * Claude Code Custom Command: screenshot-admin
 * Создает скриншот административной панели приложения
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
    console.log('🔄 Создание скриншота административной панели...');

    // Переходим прямо на административную панель React SPA
    await page.goto('http://127.0.0.1:3000/#/admin', { waitUntil: 'networkidle2' });
    
    // Ждем загрузки React компонентов
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Проверяем, есть ли форма входа и заполняем её
    const loginExists = await page.$('input[type="email"], input[name="email"]');
    if (loginExists) {
      console.log('🔑 Найдена форма входа, заполняем данные админа...');
      
      await page.type('input[type="email"], input[name="email"]', 'admin@example.com');
      await page.type('input[type="password"], input[name="password"]', 'password123');
      
      // Ищем кнопку входа и кликаем
      const loginButton = await page.$('button[type="submit"], input[type="submit"]');
      if (loginButton) {
        await loginButton.click();
        
        // Ждем загрузки после входа
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }
    
    // Ждем, пока загрузятся данные
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

    console.log(`✅ Скриншот админской панели сохранен: ${filepath}`);
  } catch (error) {
    console.error('❌ Ошибка при создании скриншота админской панели:', error);
    
    // Создаем скриншот текущего состояния для отладки
    const timestamp = new Date()
      .toISOString()
      .replace(/[:.]/g, '-')
      .slice(0, -5);
    const debugFilename = `admin-debug-${timestamp}.png`;
    const debugFilepath = path.join(tmpDir, debugFilename);
    
    await page.screenshot({
      path: debugFilepath,
      fullPage: true,
    });
    
    console.log(`🔍 Отладочный скриншот сохранен: ${debugFilepath}`);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();