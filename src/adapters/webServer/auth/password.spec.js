const expect = require('expect')
const password = require('./password')

describe('password', () => {

    it('encode and compare', () => {
        const ppwd = "12WWert gsdf SS-~"
        password.compare(ppwd, password.encript(ppwd), (err, res) => {
            expect(err).toEqual(null)
            expect(res).toEqual(true)
        })
    })

    it('encode and compareSync', () => {
        const ppwd = "12WWert gsdf SS-~"
        expect(password.compareSync(ppwd, password.encript(ppwd))).toEqual(true)
    })
})
