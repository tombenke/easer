import { expect } from 'chai'
import config from './config'
import path from 'path'
import thisPackage from '../package.json'

before(done => {
    done()
})
after(done => {
    done()
})

describe('config', () => {
    it('defaults', done => {
        const expected = {
            app: {
                name: thisPackage.name,
                version: thisPackage.version
            },
            configFileName: 'config.yml',
            useWebsocket: false,
            logger: {
                level: 'info',
                transports: {
                    console: {
                        format: 'plainText'
                    }
                }
            },
            installDir: path.resolve('./')
        }

        const defaults = config
        expect(defaults).to.eql(expected)
        done()
    })
})
