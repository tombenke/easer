'use strict';

var expect = require('chai').expect;
var users = require('./users');

describe('users', function () {
    var fakeContainer = {
        logger: console.log,
        config: {
            webServer: {
                users: __dirname + '/fixtures.yml'
            }
        }
    };

    it('#loadUsers', function () {
        users.loadUsers(fakeContainer);
        console.log('loadUsers done');
    });

    it('#findById', function (done) {
        users.findById('7fcf7c51-7439-4d40-a5c4-b9a4f2c9a1ba', function (err, user) {
            expect(err).to.be.null;
            expect(user.username).to.equal('tombenke');
            done();
        });
    });

    it('#findByUsername', function (done) {
        users.findByUsername('tombenke', function (err, user) {
            expect(err).to.be.null;
            expect(user.username).to.equal('tombenke');
            expect(user.fullName).to.equal('Tamás Benke');
            done();
        });
    });

    it('#getProfile', function (done) {
        users.getProfile('7fcf7c51-7439-4d40-a5c4-b9a4f2c9a1ba', function (err, response) {
            expect(err).to.be.null;
            expect(response).to.have.property('headers');
            expect(response).to.have.property('body');
            expect(response.body.username).to.equal('tombenke');
            expect(response.body.fullName).to.equal('Tamás Benke');
            done();
        });
    });

    it('#postRegistration - new user', function (done) {
        var username = 'newuser';
        var password = 'secretpassword';
        users.postRegistration(username, password, function (err, response) {
            expect(err).to.be.null;
            expect(response).to.have.property('headers');
            expect(response).to.have.property('body');
            expect(response.body).to.have.property('id');
            expect(response.body.username).to.equal(username);
            done();
        });
    });

    it('#postRegistration - user already exists', function (done) {
        var username = 'newuserToExists';
        var password = 'secretpassword';
        // First create a new user to exist
        users.postRegistration(username, password, function (err, response) {
            expect(err).to.eql(null);
            expect(response).to.have.property('headers');
            expect(response).to.have.property('body');
            expect(response.body).to.have.property('id');
            expect(response.body.username).to.equal(username);

            // Try to register again with the same user name
            users.postRegistration(username, password, function (err, response) {
                expect(err.details.status).to.equal(409);
                done();
            });
        });
    });

    it('#getProfile', function (done) {
        users.getProfile('7fcf7c51-7439-4d40-a5c4-b9a4f2c9a1ba', function (err, response) {
            expect(err).to.be.null;
            expect(response).to.have.property('headers');
            expect(response).to.have.property('body');
            expect(response.body.username).to.equal('tombenke');
            expect(response.body.fullName).to.equal('Tamás Benke');
            done();
        });
    });
});