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

    it('#getProfile - with wrong ID', (done) => {
        const wrongId = "7fcf7c51------------"
        users.getProfile(wrongId, (err, response) => {

            const expectedErr = new Error(`User not found by id: "${wrongId}"`)
            expect(err).toEqual(expectedErr)
            expect(response).toHaveProperty('headers')
            expect(response).toHaveProperty('body')
            done()
        })
    })
})
