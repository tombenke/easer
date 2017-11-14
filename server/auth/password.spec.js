const expect = require('expect')
const password = require('./password')

describe('password', () => {

    it('encode and compare', () => {
        const ppwd = "12WWert gsdf SS-~"
        expect(password.compare(ppwd, password.encript(ppwd))).toEqual(true)
    })
})
