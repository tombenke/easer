import { expect } from 'chai'
import config from './config'

before(done => { done() })
after(done => { done() })

describe('pmdsHemera/config', () => {

    it('defaults', done => {
        const expected = {
            pmds: {
            }
        }
        
        const defaults = config
        expect(defaults).to.eql(expected)
        done()
    })
})
