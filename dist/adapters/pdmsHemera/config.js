"use strict";

/**
 * The default configuration for the pmdsHemera adapter
 */
module.exports = {
    pdms: {
        natsUri: process.env.EASER_NATS_URI || "nats://demo.nats.io:4222"
    }
};