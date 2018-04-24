const passport = require('passport')
const Strategy = require('passport-local').Strategy
const users = require('./users')
const pwd = require('./password')

// Configure the local strategy for use by Passport.
passport.use(new Strategy(
    (username, password, done) => {
        users.findByUsername(username, (err, user) => {
            if (err || ! user) {
                return done(null, false, { message: err.message })
            } else {
                pwd.compare(password, user.password, (err, res) => {
                    if (err || ! res) {
                        return done(null, false, { message: "Incorrect password" })
                    } else {
                        return done(null, user)
                    }
                })
            }
        })
    })
)

// Configure Passport authenticated session persistence.
passport.serializeUser((user, cb) => {
    cb(null, user.id)
})

passport.deserializeUser((id, cb) => {
    users.findById(id, (err, user) => {
        cb(err, user)
    })
})

module.exports = {
    loadUsers: users.loadUsers,
    getProfile: users.getProfile,
    initialize: passport.initialize.bind(passport),
    session: passport.session.bind(passport),
    authenticate: passport.authenticate.bind(passport)
}
