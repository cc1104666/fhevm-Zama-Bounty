#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing Hello FHEVM Tutorial Setup Issues...\n');

// 1. Install missing Tailwind plugins
console.log('📦 Installing missing Tailwind CSS plugins...');
try {
  execSync('npm install @tailwindcss/typography @tailwindcss/forms --save-dev', { stdio: 'inherit' });
  console.log('✅ Tailwind plugins installed successfully\n');
} catch (error) {
  console.error('❌ Failed to install Tailwind plugins:', error.message);
}

// 2. Create a simplified Tailwind config without the problematic plugins initially
console.log('⚙️ Creating simplified Tailwind config...');
const simpleTailwindConfig = `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        secondary: {
          50: '#f0f9ff',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
        },
      },
      fontFamily: {
        mono: ['Monaco', 'Menlo', 'Ubuntu Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};`;

fs.writeFileSync('tailwind.config.js', simpleTailwindConfig);
console.log('✅ Simplified Tailwind config created\n');

// 3. Create a basic .env.local file
console.log('📝 Creating environment configuration...');
const envContent = `# Local development configuration
NEXT_PUBLIC_CHAIN_ID=31337
NEXT_PUBLIC_RPC_URL="http://127.0.0.1:8545"

# Optional: For contract deployment
MNEMONIC="test test test test test test test test test test test junk"
`;

if (!fs.existsSync('.env.local')) {
  fs.writeFileSync('.env.local', envContent);
  console.log('✅ Created .env.local file\n');
} else {
  console.log('✅ .env.local already exists\n');
}

// 4. Create a basic next-env.d.ts
console.log('📄 Creating Next.js type definitions...');
const nextEnvContent = `/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/basic-features/typescript for more information.
`;

fs.writeFileSync('next-env.d.ts', nextEnvContent);
console.log('✅ Created next-env.d.ts\n');

console.log('🎉 Setup fixes completed!');
console.log('\n📋 Next steps:');
console.log('1. Run: npm run dev');
console.log('2. Open: http://localhost:3000');
console.log('3. Start learning FHEVM! 🚀\n');

console.log('💡 If you still see issues, try:');
console.log('- Delete node_modules and run: npm install');
console.log('- Clear Next.js cache: rm -rf .next');
console.log('- Restart your terminal/IDE\n');
