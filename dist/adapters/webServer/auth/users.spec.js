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

    it('#getProfile - with wrong ID', function (done) {
        var wrongId = "7fcf7c51------------";
        users.getProfile(wrongId, function (err, response) {

            var expectedErr = new Error('User not found by id: "' + wrongId + '"');
            expect(err).toEqual(expectedErr);
            expect(response).toHaveProperty('headers');
            expect(response).toHaveProperty('body');
            done();
        });
    });
});