#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🖼️  Запуск оптимизации изображений...\n');

// Функция для получения размера файла
function getFileSize(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return stats.size;
  } catch (error) {
    return 0;
  }
}

// Функция для форматирования размера
function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// Проверка наличия ImageMagick
function checkImageMagick() {
  try {
    execSync('convert -version', { stdio: 'pipe' });
    return true;
  } catch (error) {
    console.log('❌ ImageMagick не установлен');
    console.log('💡 Для установки на Ubuntu/Debian: sudo apt-get install imagemagick');
    console.log('💡 Для установки на macOS: brew install imagemagick');
    return false;
  }
}

// Оптимизация PNG изображения
function optimizePNG(inputPath, outputPath, quality = 85) {
  const originalSize = getFileSize(inputPath);
  
  if (!fs.existsSync(inputPath)) {
    console.log(`❌ Файл не найден: ${inputPath}`);
    return;
  }

  console.log(`📸 Оптимизация: ${path.basename(inputPath)}`);
  console.log(`   Исходный размер: ${formatSize(originalSize)}`);

  try {
    // Создаем оптимизированную версию с помощью ImageMagick
    const command = `convert "${inputPath}" -strip -interlace Plane -gaussian-blur 0.05 -quality ${quality} "${outputPath}"`;
    execSync(command, { stdio: 'pipe' });
    
    const newSize = getFileSize(outputPath);
    const savings = ((originalSize - newSize) / originalSize * 100).toFixed(1);
    
    console.log(`   Новый размер: ${formatSize(newSize)}`);
    console.log(`   Экономия: ${savings}%`);
    console.log(`✅ Сохранено как: ${outputPath}\n`);
    
    return { originalSize, newSize, savings: parseFloat(savings) };
  } catch (error) {
    console.log(`❌ Ошибка при оптимизации ${inputPath}:`, error.message);
    return null;
  }
}

// Создание WebP версий
function createWebP(inputPath) {
  const inputDir = path.dirname(inputPath);
  const inputName = path.basename(inputPath, path.extname(inputPath));
  const webpPath = path.join(inputDir, `${inputName}.webp`);
  
  try {
    const command = `convert "${inputPath}" -strip -quality 80 "${webpPath}"`;
    execSync(command, { stdio: 'pipe' });
    
    const webpSize = getFileSize(webpPath);
    const originalSize = getFileSize(inputPath);
    const savings = ((originalSize - webpSize) / originalSize * 100).toFixed(1);
    
    console.log(`🌐 WebP создан: ${path.basename(webpPath)}`);
    console.log(`   Размер WebP: ${formatSize(webpSize)}`);
    console.log(`   Экономия: ${savings}%\n`);
    
    return webpPath;
  } catch (error) {
    console.log(`❌ Ошибка создания WebP для ${inputPath}:`, error.message);
    return null;
  }
}

// Основная функция
function main() {
  if (!checkImageMagick()) {
    console.log('\n🔄 Попытка установить ImageMagick...');
    try {
      // Попробуем установить через apt (для Ubuntu/Debian)
      if (fs.existsSync('/usr/bin/apt-get')) {
        console.log('📦 Установка ImageMagick через apt...');
        execSync('sudo apt-get update && sudo apt-get install -y imagemagick', { stdio: 'inherit' });
      }
    } catch (error) {
      console.log('❌ Не удалось установить ImageMagick автоматически');
      console.log('   Пожалуйста, установите вручную и повторите попытку');
      process.exit(1);
    }
  }

  const assetsDir = 'frontend/assets/images';
  
  // Главная цель - character.png
  const characterPath = path.join(assetsDir, 'character.png');
  
  if (fs.existsSync(characterPath)) {
    console.log('🎯 Основная цель: character.png (2MB)\n');
    
    // Создаем резервную копию
    const backupPath = characterPath.replace('.png', '.original.png');
    if (!fs.existsSync(backupPath)) {
      fs.copyFileSync(characterPath, backupPath);
      console.log('💾 Создана резервная копия: character.original.png\n');
    }
    
    // Оптимизируем оригинал
    const optimizedPath = characterPath.replace('.png', '.optimized.png');
    const result = optimizePNG(characterPath, optimizedPath, 85);
    
    // Создаем WebP версию
    createWebP(characterPath);
    
    // Если оптимизация прошла успешно и экономия значительная
    if (result && result.savings > 20) {
      console.log('🔄 Заменяем оригинальный файл оптимизированным...');
      fs.copyFileSync(optimizedPath, characterPath);
      fs.unlinkSync(optimizedPath);
      console.log('✅ Замена завершена\n');
    }
  } else {
    console.log(`❌ character.png не найден по пути: ${characterPath}`);
  }
  
  // Оптимизируем остальные крупные изображения
  const imageFiles = [
    'barcode-component.png',
    'footer.png'
  ];
  
  let totalSavings = 0;
  let filesOptimized = 0;
  
  imageFiles.forEach(fileName => {
    const filePath = path.join(assetsDir, fileName);
    if (fs.existsSync(filePath)) {
      const optimizedPath = filePath.replace(/\.(png|jpg|jpeg)$/, '.optimized.$1');
      const result = optimizePNG(filePath, optimizedPath, 90);
      
      if (result && result.savings > 10) {
        fs.copyFileSync(optimizedPath, filePath);
        fs.unlinkSync(optimizedPath);
        totalSavings += result.originalSize - result.newSize;
        filesOptimized++;
      } else if (fs.existsSync(optimizedPath)) {
        fs.unlinkSync(optimizedPath);
      }
      
      // Создаем WebP версии для всех изображений
      createWebP(filePath);
    }
  });
  
  console.log('\n📊 Итоговый отчет:');
  console.log(`   Файлов оптимизировано: ${filesOptimized + 1}`);
  console.log(`   Общая экономия: ${formatSize(totalSavings)}`);
  console.log('\n💡 Рекомендации:');
  console.log('   - Используйте WebP формат для современных браузеров');
  console.log('   - Рассмотрите ленивую загрузку для больших изображений');
  console.log('   - Добавьте responsive images для разных размеров экранов');
  
  console.log('\n✨ Оптимизация изображений завершена!');
}

main();