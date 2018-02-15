import { loadJsonFileSync } from 'datafile'

let records = []

exports.loadUsers = container => {
    records = loadJsonFileSync(container.config.webServer.users).users
    //container.logger.info(`users: ${container.config.webServer.users}, ${JSON.stringify(records, null, '')}`)
}

const findByProp = function(prop, value, cb) {
    process.nextTick(function() {
        for (let i = 0, len = records.length; i < len; i++) {
            let record = records[i]
            if (record[prop] === value) {
                return cb(null, record)
            }
        }
        return cb(null, null)
    })
}

exports.findById = (id, cb) => findByProp('id', id, cb)
exports.findByUsername = (username, cb) => findByProp('username', username, cb)
