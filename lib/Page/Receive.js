var http = require('http')

var Log = require('../Log.js'),
    ReceivingFile = require('../ReceivingFile.js')

var sessionNode = require('../../config.js').sessionNode

var host = sessionNode.host,
    port = sessionNode.port

var logPrefix = 'session-node-client: ' + host + ':' + port + ': fileNode/requestFile: '

module.exports = (sendingFiles, receivingFiles) => {
    return (req, res, parsedUrl) => {

        var token = parsedUrl.query.token
        var sendingFile = sendingFiles[token]
        if (sendingFile === undefined) {
            res.setHeader('Content-Type', 'application/json')
            res.end('"INVALID_TOKEN"')
            return
        }

        var file = sendingFile.file

        sendingFile.destroy()
        res.setHeader('Content-Type', 'application/octet-stream')
        receivingFiles[token] = ReceivingFile(file, chunk => {
            res.write(chunk)
        }, () => {
            res.end()
            delete receivingFiles[token]
            Log.info(token + ' no longer receiving')
        })
        Log.info(token + ' receiving')

        ;(() => {

            function errorListener (err) {
                Log.error(logPrefix + err.code)
            }

            var proxyReq = http.request({
                host: host,
                port: port,
                path: '/fileNode/requestFile' +
                    '?token=' + encodeURIComponent(file.sessionToken) +
                    '&fileToken=' + encodeURIComponent(token),
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

        })()
    }
}
