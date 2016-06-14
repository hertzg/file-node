var http = require('http')

var Log = require('./Log.js')

var sessionNode = require('../config.js').sessionNode

var host = sessionNode.host,
    port = sessionNode.port

var logPrefix = 'session-node-client: ' + host + ':' + port + ': fileNode/requestFile: '

module.exports = (fileToken, sessionToken) => {

    function errorListener (err) {
        Log.error(logPrefix + err.code)
    }

    var proxyReq = http.request({
        host: host,
        port: port,
        path: '/fileNode/requestFile' +
            '?token=' + encodeURIComponent(sessionToken) +
            '&fileToken=' + encodeURIComponent(fileToken),
    }, proxyRes => {

        proxyReq.removeListener('error', errorListener)

        var statusCode = proxyRes.statusCode
        if (statusCode !== 200) {
            Log.error(logPrefix + 'HTTP status code ' + statusCode)
            return
        }

    })
    proxyReq.end()
    proxyReq.on('error', errorListener)

}
