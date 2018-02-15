'use strict';

var expect = require('expect');
var password = require('./password');

describe('password', function () {

    it('encode and compare', function () {
        var ppwd = "12WWert gsdf SS-~";
        expect(password.compare(ppwd, password.encript(ppwd))).toEqual(true);
    });
});