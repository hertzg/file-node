module.exports = (file, chunkListener, destroyListener) => {

    function startTimeout () {
        timeout = setTimeout(destroyListener, 1000 * 60)
    }

    var fed = 0
    var timeout = 0
    startTimeout()

    return {
        feed: chunk => {
            chunkListener(chunk)
            fed += chunk.length
            clearTimeout(timeout)
            if (fed >= file.size) destroyListener()
            else startTimeout()
        },
    }

}
