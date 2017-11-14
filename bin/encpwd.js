#!/usr/bin/env node
const password = require('../lib/server/auth/password')

if (process.argv.length === 3) {
    const ppwd = process.argv[2]
    console.log(ppwd + ' >> ' + password.encript(ppwd))
} else {
    console.log('Usage: encpwd <password>')
}

