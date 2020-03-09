//@ts-check

/** 
 * Called from {@link restart} or from play music button on home screen
 * @function playAudio
 */
const playAudio = () => {
    //@ts-ignore
    gameAudio.play();
}


/** 
 * Called from pause music button on home screen
 * @function pauseAudio
 */
const pauseAudio = () => {
    //@ts-ignore
    gameAudio.pause();
}


/**
 * Called from handleSuccess when composerName found offers youtube video in composerClues div on home screen
 */
const playVideo = () => {
    gameVideo.html(gameVideoSRC);
    animateCSS('#composerClues', 'zoomInRight');
}




/**
 * Called from various points to animate unload load of content in divs,
 *      from GitHub animate.css library
 * @async
 * @function animateCSS
 * @param {*} element div id/class/tag to be modified
 * @param {*} animationName from list of animateCSS classes
 * @param {*} [callback] required if unloading before loading div with content, async
 */
const animateCSS = (element, animationName, callback) => {
    const node = document.querySelector(element)
    node.classList.add('animated', animationName)

    function handleAnimationEnd() {
        node.classList.remove('animated', animationName)
        node.removeEventListener('animationend', handleAnimationEnd)

        if (typeof callback === 'function') callback()
    }

    node.addEventListener('animationend', handleAnimationEnd)
}

