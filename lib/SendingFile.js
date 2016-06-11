module.exports = (sessionToken, name, size, destroyListener) => {

    var timeout = setTimeout(destroyListener, 1000 * 60)

    return {
        destroy: () => {
            clearTimeout(timeout)
            destroyListener()
        },
    }

}
