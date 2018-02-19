import encpwd from './encpwd/'
import pdmsHemera from './pdmsHemera/'
import webServer from './webServer/'
import _ from 'lodash'

module.exports = {
    defaults: _.merge({}, encpwd.defaults, webServer.defaults, pdmsHemera.defaults),
    mediators: {
        webServer: webServer,
        pdms: pdmsHemera
    },
    commands: {
        encpwd: encpwd.execute
    }
}
