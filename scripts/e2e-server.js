#!/usr/bin/env node
/**
 * Cross-platform script to build and start the Next.js server for E2E tests.
 * Avoids shell operator (&&) issues on Windows when used as playwright webServer command.
 */
const { execSync, spawn } = require('child_process')
const path = require('path')

const projectRoot = path.resolve(__dirname, '..')
const nextBin = path.join(
  projectRoot,
  'node_modules',
  'next',
  'dist',
  'bin',
  'next'
)

// Build the app first
console.log('[e2e-server] Building Next.js app...')
execSync(`node ${JSON.stringify(nextBin)} build`, {
  stdio: 'inherit',
  cwd: projectRoot,
})

// Start the production server
console.log('[e2e-server] Starting Next.js server on port 3100...')
const server = spawn('node', [nextBin, 'start', '-p', '3100'], {
  stdio: 'inherit',
  shell: false,
  cwd: projectRoot,
})

server.on('error', (err) => {
  console.error('[e2e-server] Failed to start server:', err)
  process.exit(1)
})

process.on('SIGTERM', () => server.kill('SIGTERM'))
process.on('SIGINT', () => server.kill('SIGINT'))
