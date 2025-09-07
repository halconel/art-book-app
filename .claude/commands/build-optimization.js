#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Запуск оптимизации и проверки билда...\n');

// Функция для выполнения команд с обработкой ошибок
function runCommand(command, description) {
  console.log(`📋 ${description}`);
  try {
    const output = execSync(command, { 
      encoding: 'utf8',
      cwd: process.cwd(),
      stdio: 'pipe'
    });
    console.log('✅ Успешно\n');
    return output;
  } catch (error) {
    console.log('❌ Ошибка:', error.message);
    if (error.stdout) console.log('stdout:', error.stdout);
    if (error.stderr) console.log('stderr:', error.stderr);
    console.log('');
    return null;
  }
}

// Функция для анализа размеров файлов
function analyzeAssets() {
  console.log('📊 Анализ размеров ресурсов:');
  
  const assetsDir = path.join(process.cwd(), 'frontend/assets');
  if (!fs.existsSync(assetsDir)) {
    console.log('❌ Каталог assets не найден');
    return;
  }

  function getFileSize(filePath) {
    try {
      const stats = fs.statSync(filePath);
      return stats.size;
    } catch (error) {
      return 0;
    }
  }

  function formatSize(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  function scanDirectory(dir, basePath = '') {
    const items = fs.readdirSync(dir);
    const files = [];
    
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const relativePath = path.join(basePath, item);
      
      if (fs.statSync(fullPath).isDirectory()) {
        files.push(...scanDirectory(fullPath, relativePath));
      } else {
        const size = getFileSize(fullPath);
        files.push({ path: relativePath, size, fullPath });
      }
    });
    
    return files;
  }

  const files = scanDirectory(assetsDir);
  
  // Сортируем по размеру (убывание)
  files.sort((a, b) => b.size - a.size);
  
  console.log('\n📁 Крупнейшие файлы:');
  files.slice(0, 10).forEach(file => {
    const sizeFormatted = formatSize(file.size);
    const warning = file.size > 500 * 1024 ? ' ⚠️' : file.size > 100 * 1024 ? ' ⚡' : '';
    console.log(`  ${file.path}: ${sizeFormatted}${warning}`);
  });

  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  console.log(`\n📦 Общий размер ресурсов: ${formatSize(totalSize)}\n`);
  
  return files;
}

// Основная функция
async function main() {
  console.log('🏁 Начинаем оптимизацию...\n');

  // 1. Анализ текущих ресурсов
  analyzeAssets();

  // 2. Проверка ESLint
  runCommand('npm run lint', 'Проверка ESLint');

  // 3. Проверка TypeScript (если есть)
  if (fs.existsSync('tsconfig.json')) {
    runCommand('npx tsc --noEmit', 'Проверка TypeScript');
  }

  // 4. Запуск тестов без verbose для экономии контекста
  runCommand('npm test -- --watchAll=false', 'Запуск тестов');

  // 5. Создание production билда
  console.log('🔨 Создание production билда...');
  const buildOutput = runCommand('NODE_ENV=production npm run build', 'Production билд');
  
  if (buildOutput) {
    console.log('📊 Анализ размеров билда:');
    // Попробуем найти информацию о размерах в выводе webpack
    const lines = buildOutput.split('\n');
    lines.forEach(line => {
      if (line.includes('main.') || line.includes('vendor.') || line.includes('chunk') || line.includes('KB') || line.includes('MB')) {
        console.log(`  ${line.trim()}`);
      }
    });
  }

  // 6. Анализ публичных ресурсов после билда
  if (fs.existsSync('public')) {
    console.log('\n📊 Анализ размеров публичных файлов после билда:');
    try {
      const output = execSync('find public -name "*.js" -o -name "*.css" -o -name "*.png" -o -name "*.jpg" -o -name "*.svg" | head -20 | xargs ls -lh', { encoding: 'utf8' });
      console.log(output);
    } catch (error) {
      console.log('❌ Не удалось проанализировать публичные файлы');
    }
  }

  console.log('\n✨ Оптимизация завершена!');
  console.log('\n💡 Рекомендации:');
  console.log('   - Изображения > 500KB требуют оптимизации ⚠️');
  console.log('   - Изображения > 100KB желательно оптимизировать ⚡');
  console.log('   - Рассмотрите использование WebP формата для больших изображений');
  console.log('   - Проверьте возможность ленивой загрузки для неcritical ресурсов');
}

// Запуск с обработкой ошибок
main().catch(error => {
  console.error('❌ Критическая ошибка:', error);
  process.exit(1);
});