#!/bin/bash

echo "Starting TypeScript compilation test..."
cd /Users/heifets/Desktop/MSD/PRIVATE/Development/test-dev-tool

echo "Running tsc --noEmit..."
npx tsc --noEmit

echo "Running npm run build..."
npm run build