const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');
const parentDir = path.join(projectRoot, '..');
const localZip = path.join(projectRoot, 'jichangdingyue.xyz.zip');
const parentZip = path.join(parentDir, 'jichangdingyue.xyz.zip');
const sourceZip = path.join(parentDir, 'jichangdingyue.xyz-source.zip');

console.log('🚀 开始执行一键“生成网站与打包 ZIP”全流程...\n');

// 1. Hugo 生产环境编译
console.log('1️⃣ 正在使用 Hugo 进行生产环境编译 (--cleanDestinationDir --minify)...');
try {
  execSync('hugo --cleanDestinationDir --minify', { cwd: projectRoot, stdio: 'inherit' });
} catch (e) {
  console.log('Using hugo.cmd fallback...');
  const hugoBin = path.join(projectRoot, 'hugo.cmd');
  execSync(`"${hugoBin}" --cleanDestinationDir --minify`, { cwd: projectRoot, stdio: 'inherit' });
}

// 2. 运行全站自动化核验
console.log('\n2️⃣ 正在执行全站指标自动化核验...');
execSync('node scripts/verify-site.js', { cwd: projectRoot, stdio: 'inherit' });

// 3. 运行死链核验
console.log('\n3️⃣ 正在核验全站 Markdown 内链完整性...');
execSync('node scripts/check-links.js', { cwd: projectRoot, stdio: 'inherit' });

// 4. 打包 public 目录为生产部署包
console.log('\n4️⃣ 正在将 public/ 目录打包为生产部署压缩包 (jichangdingyue.xyz.zip)...');
const publicPath = path.join(projectRoot, 'public', '*');

[localZip, parentZip].forEach(z => {
  if (fs.existsSync(z)) {
    try { fs.unlinkSync(z); } catch (e) {}
  }
});

try {
  execSync(`powershell -NoProfile -Command "Compress-Archive -Path '${publicPath}' -DestinationPath '${parentZip}' -Force"`, {
    cwd: projectRoot,
    stdio: 'inherit'
  });
  if (fs.existsSync(parentZip)) {
    fs.copyFileSync(parentZip, localZip);
    const sizeMB = (fs.statSync(parentZip).size / (1024 * 1024)).toFixed(2);
    console.log(`✅ 生产部署压缩包生成成功:`);
    console.log(`   - ${parentZip} (${sizeMB} MB)`);
    console.log(`   - ${localZip} (${sizeMB} MB)`);
  }
} catch (e) {
  console.error('打包压缩包出错:', e.message);
}

// 5. 打包源码压缩包（排除 node_modules 和 public）
try {
  console.log('\n5️⃣ 正在打包完整源码归档 (jichangdingyue.xyz-source.zip)...');
  if (fs.existsSync(sourceZip)) {
    try { fs.unlinkSync(sourceZip); } catch (e) {}
  }
  execSync(`powershell -NoProfile -Command "Get-ChildItem -Path '${projectRoot}' -Exclude 'node_modules', 'public', '.git', '*.zip' | Compress-Archive -DestinationPath '${sourceZip}' -Force"`, {
    cwd: projectRoot,
    stdio: 'inherit'
  });
  if (fs.existsSync(sourceZip)) {
    const srcSizeMB = (fs.statSync(sourceZip).size / (1024 * 1024)).toFixed(2);
    console.log(`✅ 源码归档压缩包生成成功:`);
    console.log(`   - ${sourceZip} (${srcSizeMB} MB)`);
  }
} catch (e) {
  console.error('打包源码出错:', e.message);
}

console.log('\n🎉 网站生成与打包全部顺利完成！');
