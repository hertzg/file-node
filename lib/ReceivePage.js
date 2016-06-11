var Log = require('./Log.js'),
    ReceivingFile = require('./ReceivingFile.js')

module.exports = (sendingFiles, receivingFiles) => {
    return (req, res, parsedUrl) => {

        var token = parsedUrl.query.token
        var sendingFile = sendingFiles[token]
        if (sendingFile === undefined) {
            res.setHeader('Content-Type', 'application/json')
            res.end('"INVALID_TOKEN"')
            return
        }

        sendingFile.destroy()
        receivingFiles[token] = ReceivingFile(() => {
            delete receivingFiles[token]
            Log.info(token + ' no longer receiving')
        })
        Log.info(token + ' receiving')

        res.setHeader('Content-Type', 'application/octet-stream')
        res.end('"FILE_FOUND"')

    }
}
