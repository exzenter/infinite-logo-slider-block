document.addEventListener('DOMContentLoaded', () => {
    const sliders = document.querySelectorAll('.logo-slider.has-slowdown-hover');

    sliders.forEach(slider => {
        const slowdownRatio = parseFloat(slider.getAttribute('data-slowdown-ratio') || '0.5');

        slider.addEventListener('mouseenter', () => {
            const animations = slider.getAnimations();
            animations.forEach(animation => {
                // Use updatePlaybackRate for smooth transition if available, otherwise playbackRate
                if (animation.updatePlaybackRate) {
                    animation.updatePlaybackRate(slowdownRatio);
                } else {
                    animation.playbackRate = slowdownRatio;
                }
            });
        });

        slider.addEventListener('mouseleave', () => {
            const animations = slider.getAnimations();
            animations.forEach(animation => {
                if (animation.updatePlaybackRate) {
                    animation.updatePlaybackRate(1);
                } else {
                    animation.playbackRate = 1;
                }
            });
        });
    });
});
