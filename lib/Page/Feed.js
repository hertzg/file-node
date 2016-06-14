module.exports = receivingFiles => {
    return (req, res, parsedUrl) => {

        var token = parsedUrl.query.token
        var receivingFile = receivingFiles[token]
        if (receivingFile === undefined) {
            res.setHeader('Content-Type', 'application/json')
            res.end('"INVALID_TOKEN"')
            return
        }

        req.on('data', receivingFile.feed)
        req.on('end', () => {
            res.setHeader('Content-Type', 'application/json')
            res.end('true')
        })

    }
}
