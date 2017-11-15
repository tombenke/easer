const path = require('path')
const defaultsBasePath = __dirname + '/defaults'

module.exports = {
    users: process.env.EAUTH_USERS || defaultsBasePath + '/users.yml',
    port: process.env.EAUTH_PORT || 3007,
    viewsPath: process.env.EAUTH_VIEWSPATH || defaultsBasePath + '/views/',
    publicPagesPath: process.env.EAUTH_CONTENTPATH_PUBLIC || defaultsBasePath + '/content/public/',
    privatePagesPath: process.env.EAUTH_CONTENTPATH_PRIVATE || defaultsBasePath + '/content/private/'
}
