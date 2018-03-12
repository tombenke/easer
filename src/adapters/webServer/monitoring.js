const getMonitoringIsAlive = (req, cb) => {
    cb(null, {
        headers: {
            "Content-Type": "pplication/json; charset=utf-8"
        },
        body: {
            status: "OK"
            // TODO: Add further info got from the container
        }
    })
}

module.exports = {
    getMonitoringIsAlive
}
