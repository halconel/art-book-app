const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function takeDebugScreenshot() {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    
    // Перехватываем все сообщения консоли
    const consoleMessages = [];
    page.on('console', msg => {
      const message = `Console ${msg.type()}: ${msg.text()}`;
      console.log(message);
      consoleMessages.push(message);
    });
    
    // Перехватываем сетевые ошибки
    page.on('response', response => {
      if (!response.ok()) {
        console.log(`Network error: ${response.status()} ${response.url()}`);
      } else if (response.url().includes('main.bundle.js')) {
        console.log(`✅ main.bundle.js загружен успешно: ${response.status()}`);
      }
    });
    
    // Перехватываем ошибки JavaScript
    page.on('pageerror', error => {
      console.log(`❌ JavaScript error: ${error.toString()}`);
    });
    
    // Перехватываем ошибки при загрузке ресурсов
    page.on('requestfailed', request => {
      console.log(`❌ Request failed: ${request.url()} - ${request.failure()?.errorText}`);
    });
    
    console.log('🔄 Загружаем localhost:8080...');
    await page.goto('http://localhost:8080', { 
      waitUntil: 'networkidle0',
      timeout: 10000 
    });
    
    // Ждем немного для загрузки React
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Проверяем наличие элемента #root
    const rootElement = await page.$('#root');
    console.log('Root element found:', !!rootElement);
    
    if (rootElement) {
      const innerHTML = await page.evaluate(() => {
        const root = document.getElementById('root');
        return root ? root.innerHTML : 'No content';
      });
      console.log('Root innerHTML:', innerHTML.substring(0, 200));
    }
    
    // Создаем папку для скриншотов если её нет
    const tmpDir = path.resolve(__dirname, '../tmp');
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }
    
    // Делаем скриншот
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const screenshotPath = path.resolve(tmpDir, `debug-${timestamp}.png`);
    
    await page.screenshot({ 
      path: screenshotPath,
      fullPage: true 
    });
    
    console.log('✅ Debug скриншот сохранен:', screenshotPath);
    
    console.log('\n=== Все сообщения консоли ===');
    consoleMessages.forEach(msg => console.log(msg));
    
    return screenshotPath;
  } finally {
    await browser.close();
  }
}

takeDebugScreenshot().catch(console.error);