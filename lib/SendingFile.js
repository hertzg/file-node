module.exports = (file, destroyListener) => {

    var timeout = setTimeout(destroyListener, 1000 * 60)

    return {
        file: file,
        destroy: () => {
            clearTimeout(timeout)
            destroyListener()
        },
    }

}
