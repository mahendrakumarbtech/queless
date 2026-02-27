#!/bin/bash

# QueLess - Queue Management System Startup Script

echo "🚀 QueLess Startup Script"
echo "=========================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed!${NC}"
    echo "Please install Node.js from https://nodejs.org"
    exit 1
fi

echo -e "${GREEN}✅ Node.js found: $(node --version)${NC}"

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo -e "${YELLOW}⚠️  MongoDB is not running${NC}"
    echo "Starting MongoDB..."

    # Try to start MongoDB (macOS with Homebrew)
    if command -v brew &> /dev/null; then
        brew services start mongodb-community 2>/dev/null || echo "Please start MongoDB manually: mongod"
    else
        echo "Please start MongoDB manually in another terminal: mongod"
    fi

    sleep 2
fi

# Check backend .env file
if [ ! -f "backend/.env" ]; then
    echo -e "${YELLOW}⚠️  Backend .env file not found${NC}"
    if [ -f "backend/.env.example" ]; then
        echo "Creating .env from .env.example..."
        cp backend/.env.example backend/.env
        echo -e "${GREEN}✅ Created backend/.env${NC}"
        echo -e "${YELLOW}⚠️  Please edit backend/.env and set your JWT_SECRET${NC}"
    else
        echo -e "${RED}❌ .env.example not found!${NC}"
    fi
fi

# Check frontend .env file
if [ ! -f "frontend/.env" ]; then
    echo -e "${YELLOW}⚠️  Frontend .env file not found${NC}"
    echo "NODE_API_BASE_URL=http://localhost:5000" > frontend/.env
    echo -e "${GREEN}✅ Created frontend/.env${NC}"
fi

# Check if node_modules exist
if [ ! -d "backend/node_modules" ]; then
    echo -e "${YELLOW}⚠️  Backend dependencies not installed${NC}"
    echo "Installing backend dependencies..."
    cd backend && npm install && cd ..
    echo -e "${GREEN}✅ Backend dependencies installed${NC}"
fi

if [ ! -d "frontend/node_modules" ]; then
    echo -e "${YELLOW}⚠️  Frontend dependencies not installed${NC}"
    echo "Installing frontend dependencies..."
    cd frontend && npm install && cd ..
    echo -e "${GREEN}✅ Frontend dependencies installed${NC}"
fi

echo ""
echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo "Starting servers..."
echo ""
echo "📝 Note: You need 3 terminal windows:"
echo "   1. MongoDB (if not running as service)"
echo "   2. Backend (npm run dev)"
echo "   3. Frontend (npm start)"
echo ""
echo "Or use these commands:"
echo ""
echo "Terminal 1 - Backend:"
echo "  cd backend && npm run dev"
echo ""
echo "Terminal 2 - Frontend:"
echo "  cd frontend && npm start"
echo ""
