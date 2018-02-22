import { loadJsonFileSync } from 'datafile'

let records = []

const loadUsers = container => {
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

const findById = (id, cb) => findByProp('id', id, cb)

const findByUsername = (username, cb) => findByProp('username', username, cb)

const getProfile = (id, cb) => {
    findById(id, (err, userRecord) => {
        if (err) {
            cb(err, null)
        } else {
            if (userRecord === null) {
                cb(new Error(`User with id: '${id}' not found`), null)
            } else {
                cb(null, {
                    headers: {},
                    body: {
                        id: userRecord.id,
                        fullName: userRecord.fullName,
                        email: userRecord.email,
                        avatar: userRecord.avatar || 'avatars/undefined.png'
                    }
                })
            }
        }
    })
}

module.exports = {
    loadUsers: loadUsers,
    findById: findById,
    findByUsername: findByUsername,
    getProfile: getProfile
}
