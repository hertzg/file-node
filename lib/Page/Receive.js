var Log = require('../Log.js'),
    ReceivingFile = require('../ReceivingFile.js'),
    SendRequestFile = require('../SendRequestFile.js'),
    SendRemoveFile = require('../SendRemoveFile.js')

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
        res.setHeader('Content-Disposition', 'attachment; filename*=UTF-8\'\'' + encodeURIComponent(file.name))

        receivingFiles[token] = ReceivingFile(file, chunk => {
            res.write(chunk)
        }, () => {
            res.end()
            delete receivingFiles[token]
            Log.info(token + ' no longer receiving')
        })
        Log.info(token + ' receiving')

    }
}
