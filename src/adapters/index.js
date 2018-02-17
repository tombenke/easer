import encpwd from './encpwd/'
import webServer from './webServer/'
import _ from 'lodash'

module.exports = {
    defaults: _.merge({}, encpwd.defaults, webServer.defaults),
    mediators: {
        webServer: webServer
    },
    commands: {
        encpwd: encpwd.execute
    }
}
