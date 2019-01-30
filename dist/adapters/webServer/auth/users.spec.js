'use strict';

var expect = require('expect');
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
        users.findById("7fcf7c51-7439-4d40-a5c4-b9a4f2c9a1ba", function (err, user) {
            expect(err).toBeNull();
            expect(user.username).toEqual("tombenke");
            done();
        });
    });

    it('#findByUsername', function (done) {
        users.findByUsername("tombenke", function (err, user) {
            expect(err).toBeNull();
            expect(user.username).toEqual("tombenke");
            expect(user.fullName).toEqual("Tamás Benke");
            done();
        });
    });

    it('#getProfile', function (done) {
        users.getProfile("7fcf7c51-7439-4d40-a5c4-b9a4f2c9a1ba", function (err, response) {
            expect(err).toBeNull();
            expect(response).toHaveProperty('headers');
            expect(response).toHaveProperty('body');
            expect(response.body.username).toEqual("tombenke");
            expect(response.body.fullName).toEqual("Tamás Benke");
            done();
        });
    });

    it('#postRegistration - new user', function (done) {
        var username = 'newuser';
        var password = 'secretpassword';
        users.postRegistration(username, password, function (err, response) {

            expect(err).toBeNull();
            expect(response).toHaveProperty('headers');
            expect(response).toHaveProperty('body');
            expect(response.body).toHaveProperty('id');
            expect(response.body.username).toEqual(username);
            done();
        });
    });

    it('#postRegistration - user already exists', function (done) {
        var username = 'newuserToExists';
        var password = 'secretpassword';
        // First create a new user to exist
        users.postRegistration(username, password, function (err, response) {

            expect(err).toBeNull();
            expect(response).toHaveProperty('headers');
            expect(response).toHaveProperty('body');
            expect(response.body).toHaveProperty('id');
            expect(response.body.username).toEqual(username);

            // Try to register again with the same user name
            users.postRegistration(username, password, function (err, response) {
                expect(err.details.status).toEqual(409);
                done();
            });
        });
    });

    it('#getProfile', function (done) {
        users.getProfile("7fcf7c51-7439-4d40-a5c4-b9a4f2c9a1ba", function (err, response) {
            expect(err).toBeNull();
            expect(response).toHaveProperty('headers');
            expect(response).toHaveProperty('body');
            expect(response.body.username).toEqual("tombenke");
            expect(response.body.fullName).toEqual("Tamás Benke");
            done();
        });
    });
});