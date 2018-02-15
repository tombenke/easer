import fs from 'fs'
import rimraf from 'rimraf'
import path from 'path'
import { expect } from 'chai'
/*
import {
    loadJsonFileSync,
    findFilesSync
} from 'datafile'
*/

import { start } from './index'

const testDirectory = path.resolve('./tmp')

const destCleanup = function(cb) {
    const dest = testDirectory
    rimraf(dest, cb)
}

describe('app', () => {

    before(function(done) {
        destCleanup(function() {
            fs.mkdirSync(testDirectory)
            done()
        })
    })

    after(function(done) {
        destCleanup(done)
    })

/*
    it('#start - with no arguments', (done) => {

        const processArgvEmpty = [
            'node', 'src/index.js'
        ]

        try {
            start(processArgvEmpty)
        } catch (err) {
            expect(err.message).to.equal('Must use a command!')
            done()
        }
    })
*/
    it('#start - encpwd command', (done) => {

        const processArgv = [
            'node', 'src/index.js',
            'encpwd',
            '--password', 'SecRetPWD0123!'
        ]

        start(processArgv, (err, res) => {
            expect(err).to.equal(null)
            done()
        })
    })

    it('#start - server command', (done) => {

/* TODO: start/stop the server
        const processArgv = [
            'node', 'src/index.js',
            'server',
            '--port', '3008'
        ]
        start(processArgv, (err, res) => {
            expect(err).to.equal(null)
            done()
        })
*/
        done()
    })
})
