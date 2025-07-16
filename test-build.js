#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('Starting TypeScript compilation test...');

try {
  console.log('Running tsc --noEmit...');
  const tscOutput = execSync('npx tsc --noEmit', { 
    cwd: '/Users/heifets/Desktop/MSD/PRIVATE/Development/test-dev-tool',
    encoding: 'utf8',
    stdio: 'pipe'
  });
  console.log('TypeScript compilation successful!');
  console.log(tscOutput);
} catch (error) {
  console.error('TypeScript compilation failed:');
  console.error(error.stdout);
  console.error(error.stderr);
}

try {
  console.log('\nRunning npm run build...');
  const buildOutput = execSync('npm run build', { 
    cwd: '/Users/heifets/Desktop/MSD/PRIVATE/Development/test-dev-tool',
    encoding: 'utf8',
    stdio: 'pipe'
  });
  console.log('Build successful!');
  console.log(buildOutput);
} catch (error) {
  console.error('Build failed:');
  console.error(error.stdout);
  console.error(error.stderr);
}