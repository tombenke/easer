import { expect } from 'chai'
import config from './config'

before(done => { done() })
after(done => { done() })

describe('pmdsHemera.config', () => {

    it('#defaults', done => {
        const expected = {
            pdms: {
                natsUri: "nats://demo.nats.io:4222"
            }
        }
        
        const defaults = config
        expect(defaults).to.eql(expected)
        done()
    })
})
