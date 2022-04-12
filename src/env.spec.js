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
        expect(typeof getBoolEnv('TEST', false)).to.equal('boolean')
        expect(getBoolEnv('TEST', true)).to.equal(true)
        expect(typeof getBoolEnv('TEST', true)).to.equal('boolean')

        process.env.TEST = ''
        expect(getBoolEnv('TEST', false)).to.equal(false)
        expect(typeof getBoolEnv('TEST', false)).to.equal('boolean')
        expect(getBoolEnv('TEST', true)).to.equal(false)
        expect(typeof getBoolEnv('TEST', true)).to.equal('boolean')

        process.env.TEST = 'x42'
        expect(getBoolEnv('TEST', false)).to.equal(false)
        expect(typeof getBoolEnv('TEST', false)).to.equal('boolean')
        expect(getBoolEnv('TEST', true)).to.equal(false)
        expect(typeof getBoolEnv('TEST', true)).to.equal('boolean')

        process.env.TEST = 'false'
        expect(getBoolEnv('TEST', false)).to.equal(false)
        expect(typeof getBoolEnv('TEST', false)).to.equal('boolean')
        process.env.TEST = 'true'
        expect(getBoolEnv('TEST', false)).to.equal(true)
        expect(typeof getBoolEnv('TEST', false)).to.equal('boolean')

        process.env.TEST = 'false'
        expect(getBoolEnv('TEST', false)).to.equal(false)
        expect(typeof getBoolEnv('TEST', false)).to.equal('boolean')
        expect(getBoolEnv('TEST', true)).to.equal(false)
        expect(typeof getBoolEnv('TEST', true)).to.equal('boolean')
        done()
    })

    it('getIntEnv', (done) => {
        delete process.env.TEST
        expect(getIntEnv('TEST', 42)).to.equal(42)
        expect(typeof getIntEnv('TEST', 42)).to.equal('number')
        expect(getIntEnv('TEST', '42')).to.equal(42)
        expect(typeof getIntEnv('TEST', '42')).to.equal('number')

        process.env.TEST = ''
        expect(getIntEnv('TEST', 42)).to.equal(0)
        expect(typeof getIntEnv('TEST', 42)).to.equal('number')
        expect(getIntEnv('TEST', '42')).to.equal(0)
        expect(typeof getIntEnv('TEST', '42')).to.equal('number')

        process.env.TEST = '24'
        expect(getIntEnv('TEST', 42)).to.equal(24)
        expect(typeof getIntEnv('TEST', 42)).to.equal('number')
        expect(getIntEnv('TEST', '42')).to.equal(24)
        expect(typeof getIntEnv('TEST', '42')).to.equal('number')

        process.env.TEST = 'xy24'
        expect(getIntEnv('TEST', 42)).to.equal(0)
        expect(typeof getIntEnv('TEST', 42)).to.equal('number')
        expect(getIntEnv('TEST', '42')).to.equal(0)
        expect(typeof getIntEnv('TEST', '42')).to.equal('number')

        done()
    })
})
