import { expect } from 'chai'
import config from './config'
import path from 'path'
import thisPackage from '../package.json'

before((done) => {
    done()
})
after((done) => {
    done()
})

describe('config', () => {
    it('defaults', (done) => {
        const expected = {
            app: {
                name: thisPackage.name,
                version: thisPackage.version
            },
            configFileName: 'config.yml',
            useWebsocket: false,
            webServer: {
                ignoreApiOperationIds: true, // Ignore operationIds by default
                bodyParser: {
                    raw: true,
                    json: false,
                    xml: false,
                    urlencoded: false
                }
            },
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
