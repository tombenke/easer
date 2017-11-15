const path = require('path')
const defaultsBasePath = __dirname + '/defaults'

module.exports = {
    users: process.env.EASER_USERS || defaultsBasePath + '/users.yml',
    port: process.env.EASER_PORT || 3007,
    viewsPath: process.env.EASER_VIEWSPATH || defaultsBasePath + '/views/',
    publicPagesPath: process.env.EASER_CONTENTPATH_PUBLIC || defaultsBasePath + '/content/public/',
    privatePagesPath: process.env.EASER_CONTENTPATH_PRIVATE || defaultsBasePath + '/content/private/'
}
