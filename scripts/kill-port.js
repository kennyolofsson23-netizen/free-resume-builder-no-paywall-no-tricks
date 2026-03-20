#!/usr/bin/env node
/**
 * Cross-platform script to kill any process listening on port 3100
 * before e2e tests run, to prevent EADDRINUSE errors from orphaned servers.
 */
const { execSync } = require('child_process')

const PORT = 3100

try {
  if (process.platform === 'win32') {
    const output = execSync('netstat -ano', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] })
    const re = new RegExp(`:${PORT}\\s+\\S+\\s+LISTENING\\s+(\\d+)`, 'g')
    let match
    while ((match = re.exec(output)) !== null) {
      const pid = match[1]
      try {
        execSync(`taskkill /F /PID ${pid}`, { stdio: 'ignore' })
        console.log(`Killed process ${pid} on port ${PORT}`)
      } catch (_) {
        // Already dead
      }
    }
  } else {
    try {
      execSync(`fuser -k ${PORT}/tcp`, { stdio: 'ignore' })
      console.log(`Killed process on port ${PORT}`)
    } catch (_) {
      // No process on that port
    }
  }
} catch (_) {
  // Port not in use or command unavailable — that's fine
}
