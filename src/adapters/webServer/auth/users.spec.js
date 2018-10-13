const expect = require('expect')
const users = require('./users')

describe('users', () => {

    const fakeContainer = {
        logger: console.log,
        config: {
            webServer: {
                users: __dirname + '/fixtures.yml'
            }
        }
    }

    it('#loadUsers', () => {
        users.loadUsers(fakeContainer)
        console.log('loadUsers done')
    })

    it('#findById', (done) => {
        users.findById("7fcf7c51-7439-4d40-a5c4-b9a4f2c9a1ba", (err, user) => {
            expect(err).toBeNull()
            expect(user.username).toEqual("tombenke")
            done()
        })
    })

    it('#findByUsername', (done) => {
        users.findByUsername("tombenke", (err, user) => {
            expect(err).toBeNull()
            expect(user.username).toEqual("tombenke")
            expect(user.fullName).toEqual("Tamás Benke")
            done()
        })
    })

    it('#getProfile', (done) => {
        users.getProfile("7fcf7c51-7439-4d40-a5c4-b9a4f2c9a1ba", (err, response) => {
            expect(err).toBeNull()
            expect(response).toHaveProperty('headers')
            expect(response).toHaveProperty('body')
            expect(response.body.username).toEqual("tombenke")
            expect(response.body.fullName).toEqual("Tamás Benke")
            done()
        })
    })

    it('#postRegistration - new user', (done) => {
        const username = 'newuser'
        const password = 'secretpassword'
        users.postRegistration(username, password, (err, response) => {

            expect(err).toBeNull()
            expect(response).toHaveProperty('headers')
            expect(response).toHaveProperty('body')
            expect(response.body).toHaveProperty('id')
            expect(response.body.username).toEqual(username)
            done()
        })
    })

    it('#postRegistration - user already exists', (done) => {
        const username = 'newuserToExists'
        const password = 'secretpassword'
        // First create a new user to exist
        users.postRegistration(username, password, (err, response) => {

            expect(err).toBeNull()
            expect(response).toHaveProperty('headers')
            expect(response).toHaveProperty('body')
            expect(response.body).toHaveProperty('id')
            expect(response.body.username).toEqual(username)

            // Try to register again with the same user name
            users.postRegistration(username, password, (err, response) => {
                expect(err).toEqual(new Error(`User '${username}' already exists`))
                done()
            })
        })
    })

    it('#getProfile', (done) => {
        users.getProfile("7fcf7c51-7439-4d40-a5c4-b9a4f2c9a1ba", (err, response) => {
            expect(err).toBeNull()
            expect(response).toHaveProperty('headers')
            expect(response).toHaveProperty('body')
            expect(response.body.username).toEqual("tombenke")
            expect(response.body.fullName).toEqual("Tamás Benke")
            done()
        })
    })
})
