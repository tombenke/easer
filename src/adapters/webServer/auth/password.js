const bcrypt = require('bcrypt')
const saltRounds = 10

// Generate Password
const encript = plainTextPwd => bcrypt.hashSync(plainTextPwd, saltRounds)
const compareSync = (plainTextPwd, pwdHash) => bcrypt.compareSync(plainTextPwd, pwdHash)
const compare = (plainTextPwd, pwdHash, cb) => bcrypt.compare(plainTextPwd, pwdHash, cb)

module.exports = {
    encript,
    compare,
    compareSync
}
