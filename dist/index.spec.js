'use strict';

var _chai = require('chai');

var _index = require('./index');

describe('app', function () {
    before(function (done) {
        done();
    });

    after(function (done) {
        done();
    });

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
    it('#start - encpwd command', function (done) {
        var processArgv = ['node', 'src/index.js', 'encpwd', '--password', 'SecRetPWD0123!'];

        (0, _index.startEncpwd)(processArgv, function (err, res) {
            (0, _chai.expect)(err).to.equal(null);
            done();
        });
    });

    it('#start - server command', function (done) {
        /* TODO: start/stop the server
        const processArgv = [
            'node', 'src/index.js',
            'server',
            '--port', '3008'
        ]
        startWebServer(processArgv, (err, res) => {
            expect(err).to.equal(null)
            done()
        })
        */
        done();
    });
});