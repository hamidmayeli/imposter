#!/bin/bash

echo "🚀 Setting up Imposter development environment..."

# Ensure pnpm is available
echo "📦 Setting up pnpm..."
export PNPM_HOME="/home/node/.local/share/pnpm"
export PATH="$PNPM_HOME:$PATH"

# Install dependencies
echo "📥 Installing project dependencies..."
pnpm install

# Create a .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    echo "# Imposter Environment Variables
VITE_APP_TITLE=Imposter
VITE_APP_VERSION=0.0.0" > .env
fi

# Set git safe directory (for when workspace is mounted)
echo "🔧 Configuring git..."
git config --global --add safe.directory /workspace

echo "✅ Development environment setup complete!"
echo ""
echo "Available commands:"
echo "  pnpm dev     - Start development server"
echo "  pnpm build   - Build for production"
echo "  pnpm lint    - Run ESLint"
echo "  pnpm preview - Preview production build"
echo ""
echo "Happy coding! 🎉"