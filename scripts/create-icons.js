#!/usr/bin/env node
// Creates placeholder icon files. Replace with real icons before publishing.
import { writeFileSync, mkdirSync } from 'fs'

mkdirSync('assets', { recursive: true })

// Minimal 1x1 PNG in base64 (transparent)
const PNG_1x1 = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  'base64'
)

writeFileSync('assets/icon-16.png',  PNG_1x1)
writeFileSync('assets/icon-48.png',  PNG_1x1)
writeFileSync('assets/icon-128.png', PNG_1x1)

console.log('Placeholder icons created in assets/. Replace with real icons before publishing.')
