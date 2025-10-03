#!/bin/bash

# Color Generator Build Script

set -e

echo "🔍 Type checking..."
pnpm typecheck

echo "✅ Build completed successfully!"
