  
  
   AOS.init();
document.addEventListener('DOMContentLoaded', function () {
    var reels = document.querySelectorAll('.reel-video');

    reels.forEach(function (video) {
        video.addEventListener('mouseenter', function () {
            video.currentTime = 0;
            video.muted = false;
            var playPromise = video.play();

            if (playPromise !== undefined) {
                playPromise.catch(function () {
                    video.muted = true;
                    video.play().catch(function () {});
                });
            }
        });

        video.addEventListener('mouseleave', function () {
            video.pause();
            video.currentTime = 0;
        });
    });
});
