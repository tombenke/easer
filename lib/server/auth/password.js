const bcrypt = require('bcrypt')
const saltRounds = 10

// Generate Password
const encript = plainTextPwd => bcrypt.hashSync(plainTextPwd, saltRounds)
const compare = (plainTextPwd, pwdHash) => bcrypt.compareSync(plainTextPwd, pwdHash)

module.exports = {
    encript,
    compare
}
