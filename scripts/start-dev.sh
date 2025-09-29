#!/bin/bash

# Hello FHEVM Tutorial - Development Startup Script
# This script sets up the complete development environment

set -e

echo "🚀 Starting Hello FHEVM Tutorial Development Environment"
echo "=================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v20+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo "❌ Node.js version $NODE_VERSION is too old. Please install Node.js v20+ first."
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
else
    echo "✅ Dependencies already installed"
fi

# Create .env.local if it doesn't exist
if [ ! -f ".env.local" ]; then
    echo "⚙️  Creating environment configuration..."
    cp .env.example .env.local
    echo "✅ Created .env.local from .env.example"
    echo "📝 You can edit .env.local to customize your configuration"
fi

# Check if hardhat node is running
echo "🔍 Checking for running Hardhat node..."
if curl -s -X POST -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' http://127.0.0.1:8545 > /dev/null 2>&1; then
    echo "✅ Hardhat node is already running"
else
    echo "🔧 Starting Hardhat node in background..."
    npm run hardhat-node > hardhat.log 2>&1 &
    HARDHAT_PID=$!
    echo "⏳ Waiting for Hardhat node to start..."
    
    # Wait for hardhat node to be ready
    for i in {1..30}; do
        if curl -s -X POST -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' http://127.0.0.1:8545 > /dev/null 2>&1; then
            echo "✅ Hardhat node is ready (attempt $i)"
            break
        fi
        if [ $i -eq 30 ]; then
            echo "❌ Hardhat node failed to start after 30 seconds"
            exit 1
        fi
        sleep 1
    done
fi

# Deploy contracts
echo "📄 Deploying contracts to local network..."
npm run deploy:local

if [ $? -eq 0 ]; then
    echo "✅ Contracts deployed successfully"
else
    echo "❌ Contract deployment failed"
    exit 1
fi

# Start the development server
echo "🌐 Starting Next.js development server..."
echo ""
echo "🎉 Setup complete! Your tutorial will be available at:"
echo "   📱 Local:    http://localhost:3000"
echo "   🌍 Network:  http://$(hostname -I | awk '{print $1}'):3000"
echo ""
echo "📚 Tutorial sections:"
echo "   • Home:      http://localhost:3000"
echo "   • Tutorial:  http://localhost:3000/tutorial"
echo "   • Examples:  http://localhost:3000/examples"
echo ""
echo "🔧 Development tools:"
echo "   • Hardhat node: http://127.0.0.1:8545"
echo "   • Chain ID: 31337"
echo ""
echo "⚠️  Make sure to configure MetaMask with the local network:"
echo "   • Network Name: Hardhat"
echo "   • RPC URL: http://127.0.0.1:8545"
echo "   • Chain ID: 31337"
echo "   • Currency Symbol: ETH"
echo ""

# Start Next.js dev server
npm run dev
