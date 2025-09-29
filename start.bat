@echo off
echo 🚀 Starting Hello FHEVM Tutorial
echo ================================

echo ✅ Current directory: %cd%
echo ✅ Checking Node.js version...
node --version

echo.
echo 📦 Installing any missing dependencies...
call npm install

echo.
echo 🌐 Starting Next.js development server...
echo 📱 Your tutorial will be available at: http://localhost:3000
echo.
echo 💡 Press Ctrl+C to stop the server
echo.

call npm run dev

pause
