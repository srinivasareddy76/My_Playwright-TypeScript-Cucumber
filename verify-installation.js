#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Playwright TypeScript Cucumber Framework Installation...\n');

// Check if required files exist
const requiredFiles = [
  'package.json',
  'tsconfig.json',
  'cucumber.js',
  '.env.example',
  'src/common/world.ts',
  'src/config/environment.ts',
  'tests/apps/frbsf/steps/homepage-steps.ts',
  'tests/apps/frbsf/steps/search-steps.ts',
  'tests/apps/frbsf/steps/research-steps.ts',
  'tests/apps/frbsf/steps/news-steps.ts',
  'tests/apps/frbsf/steps/responsive-steps.ts',
  'tests/apps/frbsf/steps/performance-steps.ts'
];

let allFilesExist = true;

console.log('📁 Checking required files:');
requiredFiles.forEach(file => {
  const exists = fs.existsSync(path.join(__dirname, file));
  console.log(`   ${exists ? '✅' : '❌'} ${file}`);
  if (!exists) allFilesExist = false;
});

// Check node_modules
console.log('\n📦 Checking dependencies:');
const nodeModulesExists = fs.existsSync(path.join(__dirname, 'node_modules'));
console.log(`   ${nodeModulesExists ? '✅' : '❌'} node_modules directory`);

if (nodeModulesExists) {
  const criticalDeps = [
    '@cucumber/cucumber',
    '@playwright/test',
    'typescript',
    'ts-node',
    'tsconfig-paths'
  ];
  
  criticalDeps.forEach(dep => {
    const depExists = fs.existsSync(path.join(__dirname, 'node_modules', dep));
    console.log(`   ${depExists ? '✅' : '❌'} ${dep}`);
    if (!depExists) allFilesExist = false;
  });
}

// Check package.json content
console.log('\n📋 Checking package.json configuration:');
try {
  const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
  
  const hasTestScripts = packageJson.scripts && packageJson.scripts['test:headed'];
  console.log(`   ${hasTestScripts ? '✅' : '❌'} Test scripts configured`);
  
  const hasTsconfigPaths = packageJson.devDependencies && packageJson.devDependencies['tsconfig-paths'];
  console.log(`   ${hasTsconfigPaths ? '✅' : '❌'} tsconfig-paths dependency`);
  
  const hasPlaywright = packageJson.devDependencies && packageJson.devDependencies['@playwright/test'];
  console.log(`   ${hasPlaywright ? '✅' : '❌'} Playwright dependency`);
  
} catch (error) {
  console.log('   ❌ Error reading package.json');
  allFilesExist = false;
}

// Final result
console.log('\n' + '='.repeat(50));
if (allFilesExist && nodeModulesExists) {
  console.log('🎉 Installation verification PASSED!');
  console.log('\n✅ You can now run:');
  console.log('   npm run test:headed');
  console.log('   npm run test:smoke:t3');
  console.log('   npm test');
} else {
  console.log('❌ Installation verification FAILED!');
  console.log('\n🔧 To fix issues, run:');
  console.log('   rm -rf node_modules package-lock.json');
  console.log('   npm install');
  console.log('   npx playwright install');
}
console.log('='.repeat(50));
