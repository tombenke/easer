'use strict';

var expect = require('expect');
var password = require('./password');

describe('password', function () {

    it('encode and compare', function () {
        var ppwd = "12WWert gsdf SS-~";
        password.compare(ppwd, password.encript(ppwd), function (err, res) {
            expect(res).toEqual(true);
        });
    });

    it('encode and compareSync', function () {
        var ppwd = "12WWert gsdf SS-~";
        expect(password.compareSync(ppwd, password.encript(ppwd))).toEqual(true);
    });
});