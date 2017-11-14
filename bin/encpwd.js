#!/usr/bin/env node
const password = require('../server/auth/password')

//const ppwd = "12WWert gsdf SS-~"

//console.log(password.compare(ppwd, password.encript(ppwd)))
const ppwd = process.argv[2]
console.log(ppwd + ' >> ' + password.encript(ppwd))
