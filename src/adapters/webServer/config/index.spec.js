import { expect } from 'chai'
import config from './index'
import path from 'path'
//import thisPackage from '../../../../package.json'

before(done => { done() })
after(done => { done() })

describe('server/config', () => {

    it('defaults', done => {
        const expected = {
            webServer: {
                port: 3007,
                privatePagesPath: path.resolve("./src/adapters/webServer/config/defaults/content/private/"),
                publicPagesPath: path.resolve("./src/adapters/webServer/config/defaults/content/public/"),
                users: path.resolve("./src/adapters/webServer/config/defaults/users.yml"),
                viewsPath: path.resolve("./src/adapters/webServer/config/defaults/views/")
            }
        }
        
        const defaults = config
        expect(defaults).to.eql(expected)
        done()
    })
})
