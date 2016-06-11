var http = require('http'),
    url = require('url')

var config = require('./config.js'),
    Error404Page = require('./lib/Error404Page.js'),
    Log = require('./lib/Log.js')

var sendingFiles = Object.create(null),
    receivingFiles = Object.create(null)

var pages = Object.create(null)
pages['/'] = require('./lib/IndexPage.js')
pages['/frontNode/receive'] = require('./lib/ReceivePage.js')(sendingFiles, receivingFiles)
pages['/sessionNode/send'] = require('./lib/SendPage.js')(sendingFiles)

http.createServer((req, res) => {
    Log.http(req.method + ' ' + req.url)
    var parsedUrl = url.parse(req.url, true)
    var page = pages[parsedUrl.pathname]
    if (page === undefined) page = Error404Page
    page(req, res, parsedUrl)
}).listen(config.port, config.host)
