module.exports = destroyListener => {
    setTimeout(destroyListener, 1000 * 60)
    return {}
}
