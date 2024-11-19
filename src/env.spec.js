import expect from 'expect'
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
        expect(getBoolEnv('TEST', false)).toEqual(false)
        expect(typeof getBoolEnv('TEST', false)).toEqual('boolean')
        expect(getBoolEnv('TEST', true)).toEqual(true)
        expect(typeof getBoolEnv('TEST', true)).toEqual('boolean')

        process.env.TEST = ''
        expect(getBoolEnv('TEST', false)).toEqual(false)
        expect(typeof getBoolEnv('TEST', false)).toEqual('boolean')
        expect(getBoolEnv('TEST', true)).toEqual(false)
        expect(typeof getBoolEnv('TEST', true)).toEqual('boolean')

        process.env.TEST = 'x42'
        expect(getBoolEnv('TEST', false)).toEqual(false)
        expect(typeof getBoolEnv('TEST', false)).toEqual('boolean')
        expect(getBoolEnv('TEST', true)).toEqual(false)
        expect(typeof getBoolEnv('TEST', true)).toEqual('boolean')

        process.env.TEST = 'false'
        expect(getBoolEnv('TEST', false)).toEqual(false)
        expect(typeof getBoolEnv('TEST', false)).toEqual('boolean')
        process.env.TEST = 'true'
        expect(getBoolEnv('TEST', false)).toEqual(true)
        expect(typeof getBoolEnv('TEST', false)).toEqual('boolean')

        process.env.TEST = 'false'
        expect(getBoolEnv('TEST', false)).toEqual(false)
        expect(typeof getBoolEnv('TEST', false)).toEqual('boolean')
        expect(getBoolEnv('TEST', true)).toEqual(false)
        expect(typeof getBoolEnv('TEST', true)).toEqual('boolean')
        done()
    })

    it('getIntEnv', (done) => {
        delete process.env.TEST
        expect(getIntEnv('TEST', 42)).toEqual(42)
        expect(typeof getIntEnv('TEST', 42)).toEqual('number')
        expect(getIntEnv('TEST', '42')).toEqual(42)
        expect(typeof getIntEnv('TEST', '42')).toEqual('number')

        process.env.TEST = ''
        expect(getIntEnv('TEST', 42)).toEqual(0)
        expect(typeof getIntEnv('TEST', 42)).toEqual('number')
        expect(getIntEnv('TEST', '42')).toEqual(0)
        expect(typeof getIntEnv('TEST', '42')).toEqual('number')

        process.env.TEST = '24'
        expect(getIntEnv('TEST', 42)).toEqual(24)
        expect(typeof getIntEnv('TEST', 42)).toEqual('number')
        expect(getIntEnv('TEST', '42')).toEqual(24)
        expect(typeof getIntEnv('TEST', '42')).toEqual('number')

        process.env.TEST = 'xy24'
        expect(getIntEnv('TEST', 42)).toEqual(0)
        expect(typeof getIntEnv('TEST', 42)).toEqual('number')
        expect(getIntEnv('TEST', '42')).toEqual(0)
        expect(typeof getIntEnv('TEST', '42')).toEqual('number')

        done()
    })
})
