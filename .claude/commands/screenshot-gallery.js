#!/usr/bin/env node

/**
 * Claude Code Custom Command: screenshot-gallery
 * Создает скриншот страницы галереи
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

  // Устанавливаем размер экрана 1440px
  await page.setViewport({ width: 1440, height: 900 });

  try {
    console.log('🔄 Создание скриншота страницы галереи...');

    // Переходим на страницу галереи
    await page.goto('http://localhost:3000/#/gallery', { waitUntil: 'networkidle2' });

    // Ждем, пока загрузятся изображения
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Проверяем Grid item структуру
    const debugInfo = await page.evaluate(() => {
      const gallery = document.querySelector('.public-gallery');
      const imgs = gallery ? gallery.querySelectorAll('img') : [];
      const firstImg = imgs[0];
      const imgBox = firstImg ? firstImg.parentElement : null; // Box containing image
      const gridItem = imgBox ? imgBox.parentElement : null; // Grid item
      const gridContainer = gridItem ? gridItem.parentElement : null; // Grid container

      return {
        width: window.innerWidth,
        imagesCount: imgs.length,
        imgBoxClasses: imgBox ? imgBox.className : 'no box',
        gridItemClasses: gridItem ? gridItem.className : 'no grid item',
        gridItemWidth: gridItem ? gridItem.offsetWidth : 0,
        gridItemStyles: gridItem ? {
          width: window.getComputedStyle(gridItem).width,
          flexBasis: window.getComputedStyle(gridItem).flexBasis,
          maxWidth: window.getComputedStyle(gridItem).maxWidth,
          flexGrow: window.getComputedStyle(gridItem).flexGrow
        } : null,
        gridContainerClasses: gridContainer ? gridContainer.className : 'no container'
      };
    });
    console.log('Debug info:', JSON.stringify(debugInfo, null, 2));

    // Создаем уникальное имя файла с временной меткой
    const timestamp = new Date()
      .toISOString()
      .replace(/[:.]/g, '-')
      .slice(0, -5);
    const filename = `gallery-${timestamp}.png`;
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
