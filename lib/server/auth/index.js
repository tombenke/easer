const passport = require('passport')
const Strategy = require('passport-local').Strategy
const users = require('./users')
const pwd = require('./password')

// Configure the local strategy for use by Passport.
passport.use(new Strategy(
    (username, password, cb) => {
        users.findByUsername(username, (err, user) => {
            if (err) { return cb(err) }
            if (!user) { return cb(null, false) }
            if ( pwd.compare(password, user.password)) { return cb(null, user) }
            return cb(null, false)
        })
    }))


// Configure Passport authenticated session persistence.
passport.serializeUser((user, cb) => {
    cb(null, user.id)
})

passport.deserializeUser((id, cb) => {
    users.findById(id, (err, user) => {
        if (err) { return cb(err) }
        cb(null, user)
    })
})

module.exports = {
    initialize: passport.initialize.bind(passport),
    session: passport.session.bind(passport),
    authenticate: passport.authenticate.bind(passport)
}
