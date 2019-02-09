import { loadJsonFileSync } from 'datafile'
import uuidv1 from 'uuid/v1'
import eraro from 'eraro'
import { encript } from './password'

const error = eraro({ package: 'users' })
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
        cb(new Error(`User not found by ${prop}: "${value}"`), null)
    })
}

const findById = (id, cb) => findByProp('id', id, cb)

const findByUsername = (username, cb) => findByProp('username', username, cb)

const getProfile = (id, cb) => {
    findById(id, (err, userRecord) => {
        if (err) {
            cb(error('profile_not_found', { headers: {}, status: 404, body: {} }))
        } else {
            cb(null, {
                headers: {},
                body: {
                    id: userRecord.id,
                    username: userRecord.username,
                    fullName: userRecord.fullName,
                    email: userRecord.email,
                    avatar: userRecord.avatar || 'avatars/undefined.png'
                }
            })
        }
    })
}

const postRegistration = (username, password, cb) => {
    findByUsername(username, (err, record) => {
        if (err) {
            // User not found by username, so create it
            const newUser = {
                id: uuidv1(),
                username: username,
                password: encript(password),
                fullName: username,
                email: '',
                avatar: 'avatars/undefined.png'
            }
            records.push(newUser)
            cb(null, {
                headers: {},
                status: 201,
                body: {
                    id: newUser.id,
                    username: newUser.username
                }
            })
        } else {
            // User already exists, so return with error
            cb(error('user_already_exists', { headers: {}, status: 409, body: {} }))
        }
    })
}

module.exports = {
    loadUsers: loadUsers,
    findById: findById,
    findByUsername: findByUsername,
    getProfile: getProfile,
    postRegistration: postRegistration
}
