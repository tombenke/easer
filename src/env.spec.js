import { expect } from 'chai'
import { getBoolEnv, getIntEnv } from './env'

before((done) => {
    done()
})
after((done) => {
    done()
})

describe('env', () => {
    it('getBoolEnv', (done) => {
        delete process.env.TEST
        expect(getBoolEnv('TEST', false)).to.equal(false)
        expect(getBoolEnv('TEST', true)).to.equal(true)

        process.env.TEST = ''
        expect(getBoolEnv('TEST', false)).to.equal(false)
        expect(getBoolEnv('TEST', true)).to.equal(false)

        process.env.TEST = 'x42'
        expect(getBoolEnv('TEST', false)).to.equal(false)
        expect(getBoolEnv('TEST', true)).to.equal(false)

        process.env.TEST = 'false'
        expect(getBoolEnv('TEST', false)).to.equal(false)
        process.env.TEST = 'true'
        expect(getBoolEnv('TEST', false)).to.equal(true)

        process.env.TEST = 'false'
        expect(getBoolEnv('TEST', false)).to.equal(false)
        expect(getBoolEnv('TEST', true)).to.equal(false)
        done()
    })

    it('getIntEnv', (done) => {
        delete process.env.TEST
        expect(getIntEnv('TEST', 42)).to.equal(42)
        expect(getIntEnv('TEST', '42')).to.equal(42)

        process.env.TEST = ''
        expect(getIntEnv('TEST', 42)).to.equal(0)
        expect(getIntEnv('TEST', '42')).to.equal(0)

        process.env.TEST = '24'
        expect(getIntEnv('TEST', 42)).to.equal(24)
        expect(getIntEnv('TEST', '42')).to.equal(24)

        process.env.TEST = 'xy24'
        expect(getIntEnv('TEST', 42)).to.equal(0)
        expect(getIntEnv('TEST', '42')).to.equal(0)

        done()
    })
})
