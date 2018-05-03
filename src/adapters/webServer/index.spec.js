import npac from 'npac'
import sinon from 'sinon'
import { expect } from 'chai'
import defaults from './config/'
import * as server from './index'
import * as pdms from 'npac-pdms-hemera-adapter'
import * as _ from 'lodash'
import fetch from 'isomorphic-fetch'
require('es6-promise').polyfill()
import cookie from 'cookie'

const getHeaders = (headers) => {
    let hmap = {}
    if (headers) {
        headers.forEach(function(value, name) {
            if (_.has(hmap, name)) {
                hmap[name].push(value)
            } else {
                hmap[name] = []
                hmap[name].push(value)
            }
        })
    }
    return hmap
}

const getCookies = headers => {
    if (_.has(headers, 'set-cookie')) {
        return _.map(headers['set-cookie'], c => {
            const cParsed = cookie.parse(c)
            return cParsed
        })
    } else {
        return []
    }
}
const findCookie = (cookies, cookieName) => {
    let result = null
    cookies.forEach(cookie => {
        if (! _.isUndefined(cookie[cookieName]))
            result = cookie[cookieName]
    })
    return result
}

/*
const runInBrowser = () => !(typeof window === 'undefined')
const getOriginHost = () => (runInBrowser() ? window.location.origin : 'http://localhost')
const getOrigin = () => getOriginHost() + (_.has(process.env, 'REST_API_PORT') ? `:${process.env.REST_API_PORT}` : '')
*/

export const makeRestCall = (uri, config) => {
    return fetch(uri, config)
        .then(response => {
            // console.log(JSON.stringify(response, null, '  '))
            const hmap = getHeaders(response.headers)
            const cookies = getCookies(hmap)

            console.log("response: ", uri, config, response, hmap)
            if (response.status === 401 ||
                response.status === 404 ||
                response.status === 302) {
                return Promise.resolve({
                    ok: response.ok,
                    status: response.status,
                    statusText: response.statusText,
                    headers: hmap,
                    cookies: getCookies(hmap)
                })
            } else {
                return response.json().then(data => {
                    if (response.ok) {
                        return Promise.resolve({
                            ok: response.ok,
                            status: response.status,
                            statusText: response.statusText,
                            headers: hmap,
                            cookies: getCookies(hmap),
                            body: data
                        })
                    } else {
                        console.log('Promise reject will happen from fetch...')
                        return Promise.reject({
                            ok: response.ok,
                            status: response.status,
                            statusText: response.statusText,
                            headers: hmap,
                            cookies: getCookies(hmap)
                        })
                    }
                })
            }
        })
        .catch(ex => {
            console.log('A fetch.catch happened: ', ex)
            return ex
        })
}

describe('adapters/server', () => {
    let sandbox

    const config = _.merge({}, defaults, pdms.defaults, { /* Add command specific config parameters */ })

    const removeSignalHandlers = () => {
        const signals = ['SIGTERM', 'SIGINT', 'SIGHUP', 'SIGUSR1', 'SIGUSR2']
        for(const signal in signals) {
            process.removeAllListeners(signals[signal])
        }
    }

    beforeEach(done => {
        removeSignalHandlers()
        sandbox = sinon.sandbox.create({ useFakeTimers: false })
        done()
    })

    afterEach(done => {
        removeSignalHandlers()
        sandbox.restore()
        done()
    })

    const adapters = [
        npac.mergeConfig(config),
        npac.addLogger,
        pdms.startup,
        server.startup
    ]

    const terminators = [
        server.shutdown,
        pdms.shutdown
    ]

    it('#startup, #shutdown', done => {
        sandbox.stub(process, 'exit').callsFake((signal) => {
            console.log("process.exit", signal)
            done()
        })

        const testServer = (container, next) => {
            container.logger.info(`Run job to test server`)
            next(null, {})
        }

        npac.start(adapters, [testServer], terminators, (err, res) => {
            expect(err).to.equal(null)
            expect(res).to.eql([{}])
            console.log('npac startup process and run jobs successfully finished')

            console.log('Send SIGTERM signal')
            process.kill(process.pid, 'SIGTERM')
        })
    })

    it('GET /monitoring/isAlive', done => {
        sandbox.stub(process, 'exit').callsFake((signal) => {
            console.log("process.exit", signal)
            done()
        })

        const testServer = (container, next) => {
            container.logger.info(`Run job to test direct call to /monitoring/isAlive`)
            const port = container.config.webServer.port
            // GET /monitoring/isAlive call
            makeRestCall(
                `http://localhost:${port}/monitoring/isAlive`,
                {
                    method: 'GET',
                    credentials: 'same-origin',
                    headers: {
                        Accept: 'application/json'
                    }
                }).then(response => {
                    expect(response.body).to.eql({ status: 'OK' })
                    next(null, {})
                })
        }

        npac.start(adapters, [testServer], terminators, (err, res) => {
            expect(err).to.equal(null)
            expect(res).to.eql([{}])
            console.log('npac startup process and run jobs successfully finished')

            console.log('Send SIGTERM signal')
            process.kill(process.pid, 'SIGTERM')
        })
    })

    it('GET /monitoring/isAlive through PDMS', done => {
        sandbox.stub(process, 'exit').callsFake((signal) => {
            console.log("process.exit", signal)
            done()
        })

        const testServer = (container, next) => {
            container.logger.info(`Run job to test PDMS call to /monitoring/isAlive`)

            // GET /monitoring/isAlive call
            const port = container.config.webServer.port
            makeRestCall(
                `http://localhost:${port}/monitoring/isAlive`,
                {
                    method: 'GET',
                    credentials: 'same-origin',
                    headers: {
                        Accept: 'application/json'
                    }
                }).then(response => {
                    expect(response.body).to.eql({ status: 'OK' })
                    next(null, {})
                })
        }

        const teeContainerConf = (container, next) => {
            console.log('Container.config: ', JSON.stringify(container.config, null, '  '))
            next(null, {})
        }

        const adaptersWithPdms = [
            npac.mergeConfig(_.merge({}, config, {
                webServer: { usePdms: true },
                // pdms: { natsUri: 'nats://localhost:4222' }
            })),
            npac.addLogger,
            pdms.startup,
            server.startup,
            teeContainerConf
        ]

        npac.start(adaptersWithPdms, [testServer], terminators, (err, res) => {
            expect(err).to.equal(null)
            expect(res).to.eql([{}])
            console.log('npac startup process and run jobs successfully finished')

            console.log('Send SIGTERM signal')
            process.kill(process.pid, 'SIGTERM')
        })
    })

    const adaptersWithPdms = [
        npac.mergeConfig(_.merge({}, config, {
            webServer: { usePdms: true },
            // pdms: { natsUri: 'nats://localhost:4222' }
        })),
        npac.addLogger,
        pdms.startup,
        server.startup
    ]

    it('GET /missing/endpoint through PDMS', done => {
        sandbox.stub(process, 'exit').callsFake((signal) => {
            console.log("process.exit", signal)
            done()
        })

        const testServer = (container, next) => {
            container.logger.info(`Run job to test PDMS call to /missing/endpoint`)

            // GET /monitoring/isAlive call
            const port = container.config.webServer.port
            makeRestCall(
                `http://localhost:${port}/missing/endpoint`,
                {
                    method: 'GET',
                    credentials: 'same-origin',
                    headers: {
                        Accept: 'application/json'
                    }
                }).then(response => {
                    expect(response.ok).to.equal(false)
                    expect(response.status).to.equal(404)
                    next(null, {})
                })
        }

        npac.start(adaptersWithPdms, [testServer], terminators, (err, res) => {
            expect(err).to.equal(null)
            expect(res).to.eql([{}])
            console.log('npac startup process and run jobs successfully finished')

            console.log('Send SIGTERM signal')
            process.kill(process.pid, 'SIGTERM')
        })
    })

    it('GET /auth/profile - with NO user id', done => {
        sandbox.stub(process, 'exit').callsFake((signal) => {
            console.log("process.exit", signal)
            done()
        })

        const testServer = (container, next) => {
            const port = container.config.webServer.port
            // GET /auth/profile call
            makeRestCall(
                `http://localhost:${port}/auth/profile`,
                {
                    method: 'GET',
                    credentials: 'same-origin',
                    headers: {
                        Accept: 'application/json'
                    }
                }).then(response => {
                    expect(response.ok).to.equal(false)
                    next(null, {})
                })
        }

        npac.start(adapters, [testServer], terminators, (err, res) => {
            expect(err).to.equal(null)
            expect(res).to.eql([{}])
            console.log('npac startup process and run jobs successfully finished')

            console.log('Send SIGTERM signal')
            process.kill(process.pid, 'SIGTERM')
        })
    })

    it('GET /auth/profile - through PDMS - with NO user id', done => {
        sandbox.stub(process, 'exit').callsFake((signal) => {
            console.log("process.exit", signal)
            done()
        })

        const testServer = (container, next) => {
            const port = container.config.webServer.port
            // GET /auth/profile call
            makeRestCall(
                `http://localhost:${port}/auth/profile`,
                {
                    method: 'GET',
                    credentials: 'same-origin',
                    headers: {
                        Accept: 'application/json'
                    }
                }).then(response => {
                    // console.log('through PDMS - with NO user id:', response)
                    expect(response.ok).to.equal(false)
                    expect(response.status).to.equal(500)
                    next(null, {})
                })
        }

        npac.start(adaptersWithPdms, [testServer], terminators, (err, res) => {
            expect(err).to.equal(null)
            expect(res).to.eql([{}])
            console.log('npac startup process and run jobs successfully finished')

            console.log('Send SIGTERM signal')
            process.kill(process.pid, 'SIGTERM')
        })
    })

    it('POST /login then GET /logout, no redirects', done => {
        sandbox.stub(process, 'exit').callsFake((signal) => {
            console.log("process.exit", signal)
            done()
        })

        const testServer = (container, next) => {
            const port = container.config.webServer.port
            // POST /login call
            makeRestCall(
                `http://localhost:${port}/login`,
                {
                    method: 'POST',
                    credentials: 'same-origin',
                    redirect: 'follow',
                    headers: {
                        Accept: '*',
                        "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
                    },
                    body: "username=tombenke&password=secret"
                }).then(response => {
                    console.log('response: ', response)

                    const connectSid = findCookie(response.cookies, 'connect.sid')

                    // Now request the profile data
                    makeRestCall(
                        `http://localhost:${port}/auth/profile`,
                        {
                            method: 'GET',
                            credentials: 'same-origin',
                            headers: {
                                Accept: 'application/json',
                                Cookie: cookie.serialize('connect.sid', connectSid)
                            }
                        }).then(response => {
                            expect(response.body).to.eql({
                                "id": "7fcf7c51-7439-4d40-a5c4-b9a4f2c9a1ba",
                                "username": "tombenke",
                                "fullName": "Tamás Benke",
                                "email": "tombenke@gmail.com",
                                "avatar": "avatars/undefined.png"
                            })
                            // Now log out
                            //
                            makeRestCall(
                                `http://localhost:${port}/logout`,
                                {
                                    method: 'GET',
                                    credentials: 'same-origin',
                                    redirect: 'manual',
                                    headers: {
                                        Accept: '*'
                                    }
                                }).then(response => {
                                    const connectSid = findCookie(response.cookies, 'connect.sid')
                                    console.log('LOGGED OUT:', response, connectSid)
                                    expect(response.status).to.equal(200)
                                    expect(connectSid).to.equal(null)
                                    next(null, {})
                                })
                        })
                    })
        }

        npac.start(adapters, [testServer], terminators, (err, res) => {
            expect(err).to.equal(null)
            expect(res).to.eql([{}])
            console.log('npac startup process and run jobs successfully finished')

            console.log('Send SIGTERM signal')
            process.kill(process.pid, 'SIGTERM')
        })
    })

    const adaptersWithLogoutRedirection = [
        npac.mergeConfig(_.merge({}, config, {
            webServer: {
                auth: {
                    strategy: 'local',
                        logoutRedirect: '/'
                    }
                }
            })),
        npac.addLogger,
        pdms.startup,
        server.startup
    ]

    it('POST /login then GET /logout, with logoutRedirect to "/"', done => {
        sandbox.stub(process, 'exit').callsFake((signal) => {
            console.log("process.exit", signal)
            done()
        })

        const testServer = (container, next) => {
            const port = container.config.webServer.port
            // POST /login call
            makeRestCall(
                `http://localhost:${port}/login`,
                {
                    method: 'POST',
                    credentials: 'same-origin',
                    redirect: 'follow',
                    headers: {
                        Accept: '*',
                        "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
                    },
                    body: "username=tombenke&password=secret"
                }).then(response => {
                    console.log('response: ', response)

                    const connectSid = findCookie(response.cookies, 'connect.sid')

                    // Now log out
                    //
                    makeRestCall(
                        `http://localhost:${port}/logout`,
                        {
                            method: 'GET',
                            credentials: 'same-origin',
                            redirect: 'manual',
                            headers: {
                                Accept: '*'
                            }
                        }).then(response => {
                            const connectSid = findCookie(response.cookies, 'connect.sid')
                            console.log('LOGGED OUT:', response, connectSid)
                            expect(response.status).to.equal(302)
                            expect(response.headers.location[0]).to.equal(`http://localhost:${port}/`)
                            expect(connectSid).to.equal(null)
                            next(null, {})
                        })
                    })
        }

        npac.start(adaptersWithLogoutRedirection, [testServer], terminators, (err, res) => {
            expect(err).to.equal(null)
            expect(res).to.eql([{}])
            console.log('npac startup process and run jobs successfully finished')

            console.log('Send SIGTERM signal')
            process.kill(process.pid, 'SIGTERM')
        })
    })

    const adaptersWithAuthRedirections = [
        npac.mergeConfig(_.merge({}, config, {
            webServer: {
                useCompression: true,
                auth: {
                    strategy: 'local',
                        successRedirect: '/private/',
                        failureRedirect: '/login.html'
                    }
                }
            })),
        npac.addLogger,
        pdms.startup,
        server.startup
    ]

    it('POST /login with success redirection', done => {
        sandbox.stub(process, 'exit').callsFake((signal) => {
            console.log("process.exit", signal)
            done()
        })

        const testServer = (container, next) => {
            const port = container.config.webServer.port
            // POST /login call
            makeRestCall(
                `http://localhost:${port}/login`,
                {
                    method: 'POST',
                    credentials: 'same-origin',
                    redirect: 'manual',
                    headers: {
                        Accept: '*',
                        "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
                    },
                    body: "username=tombenke&password=secret"
                }).then(response => {
                    const connectSid = findCookie(response.cookies, 'connect.sid')
                    console.log('RESPONSE: ', response)
                    expect(response.status).to.equal(302)
                    expect(response.headers.location[0]).to.equal(`http://localhost:${port}/private/`)

                    // Now request the profile data
                    makeRestCall(
                        `http://localhost:${port}/auth/profile`,
                        {
                            method: 'GET',
                            credentials: 'same-origin',
                            headers: {
                                Accept: 'application/json',
                                Cookie: cookie.serialize('connect.sid', connectSid)
                            }
                        }).then(response => {
                            expect(response.body).to.eql({
                                "id": "7fcf7c51-7439-4d40-a5c4-b9a4f2c9a1ba",
                                "username": "tombenke",
                                "fullName": "Tamás Benke",
                                "email": "tombenke@gmail.com",
                                "avatar": "avatars/undefined.png"
                            })
                            next(null, {})
                        })
                    })
        }

        npac.start(adaptersWithAuthRedirections, [testServer], terminators, (err, res) => {
            expect(err).to.equal(null)
            expect(res).to.eql([{}])
            console.log('npac startup process and run jobs successfully finished')

            console.log('Send SIGTERM signal')
            process.kill(process.pid, 'SIGTERM')
        })
    })

    it('POST /login with failure redirection', done => {
        sandbox.stub(process, 'exit').callsFake((signal) => {
            console.log("process.exit", signal)
            done()
        })

        const testServer = (container, next) => {
            const port = container.config.webServer.port
            // POST /login call
            makeRestCall(
                `http://localhost:${port}/login`,
                {
                    method: 'POST',
                    credentials: 'same-origin',
                    redirect: 'manual',
                    headers: {
                        Accept: '*',
                        "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
                    },
                    body: "username=missinguser&password=wrongpassword"
                }).then(response => {
                    const connectSid = findCookie(response.cookies, 'connect.sid')
                    console.log('RESPONSE: ', response)
                    expect(response.status).to.equal(302)
                    expect(response.headers.location[0]).to.equal(`http://localhost:${port}/login.html`)
                    next(null, {})
                })
        }

        npac.start(adaptersWithAuthRedirections, [testServer], terminators, (err, res) => {
            expect(err).to.equal(null)
            expect(res).to.eql([{}])
            console.log('npac startup process and run jobs successfully finished')

            console.log('Send SIGTERM signal')
            process.kill(process.pid, 'SIGTERM')
        })
    })

    it('POST /login with missing user', done => {
        sandbox.stub(process, 'exit').callsFake((signal) => {
            console.log("process.exit", signal)
            done()
        })

        const testServer = (container, next) => {
            const port = container.config.webServer.port
            // POST /login call
            makeRestCall(
                `http://localhost:${port}/login`,
                {
                    method: 'POST',
                    credentials: 'same-origin',
                    redirect: 'manual',
                    headers: {
                        Accept: '*',
                        "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
                    },
                    body: "username=missinguser&password=secret"
                }).then(response => {
                    const connectSid = findCookie(response.cookies, 'connect.sid')
                    expect(response.status).to.equal(401)
                    expect(connectSid).to.equal(null)
                    next(null, {})
                })
        }

        npac.start(adapters, [testServer], terminators, (err, res) => {
            expect(err).to.equal(null)
            expect(res).to.eql([{}])
            console.log('npac startup process and run jobs successfully finished')

            console.log('Send SIGTERM signal')
            process.kill(process.pid, 'SIGTERM')
        })
    })


    it('POST /login with wrong password', done => {
        sandbox.stub(process, 'exit').callsFake((signal) => {
            console.log("process.exit", signal)
            done()
        })

        const testServer = (container, next) => {
            const port = container.config.webServer.port
            // POST /login call
            makeRestCall(
                `http://localhost:${port}/login`,
                {
                    method: 'POST',
                    credentials: 'same-origin',
                    redirect: 'manual',
                    headers: {
                        Accept: '*',
                        "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
                    },
                    body: "username=tombenke&password=wrongpassword"
                }).then(response => {
                    const connectSid = findCookie(response.cookies, 'connect.sid')
                    expect(response.status).to.equal(401)
                    expect(connectSid).to.equal(null)
                    next(null, {})
                })
        }

        npac.start(adapters, [testServer], terminators, (err, res) => {
            expect(err).to.equal(null)
            expect(res).to.eql([{}])
            console.log('npac startup process and run jobs successfully finished')

            console.log('Send SIGTERM signal')
            process.kill(process.pid, 'SIGTERM')
        })
    })

})
