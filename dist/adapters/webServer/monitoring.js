"use strict";

var getMonitoringIsAlive = function getMonitoringIsAlive(req, cb) {
    cb(null, {
        status: "OK"
        // TODO: Add further info got from the container
    });
};

module.exports = {
    getMonitoringIsAlive: getMonitoringIsAlive
};