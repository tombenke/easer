import { expect } from 'chai'
import config from './config'

before(done => { done() })
after(done => { done() })

describe('encpwd.config', () => {

    it('#defaults', done => {
        const expected = {
            encpwd: {
            }
        }
        
        const defaults = config
        expect(defaults).to.eql(expected)
        done()
    })
})
