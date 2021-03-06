var crypto = require('crypto')

var Log = require('../Log.js'),
    SendingFile = require('../SendingFile.js'),
    SendRequestFile = require('../SendRequestFile.js'),
    SendRemoveFile = require('../SendRemoveFile.js')

module.exports = sendingFiles => {
    return (req, res, parsedUrl) => {

        var query = parsedUrl.query

        var username = query.username
        if (username === undefined) {
            res.end('"INVALID_USERNAME"')
            return
        }

        var sessionToken = query.sessionToken
        if (sessionToken === undefined) {
            res.end('"INVALID_SESSION_TOKEN"')
            return
        }

        var name = query.name
        if (name === undefined) {
            res.end('"INVALID_NAME"')
            return
        }

        var size = parseInt(query.size, 10)
        if (!isFinite(size)) {
            res.end('"INVALID_SIZE"')
            return
        }

        var token = crypto.randomBytes(20).toString('hex')
        sendingFiles[token] = SendingFile({
            name: name,
            size: size,
        }, () => {

            delete sendingFiles[token]
            Log.info(token + ' no longer sending')

            SendRequestFile(token, sessionToken)
            SendRemoveFile(token, username)

        })
        Log.info(token + ' sending')
        res.end(JSON.stringify(token))

    }
}
