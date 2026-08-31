if (typeof AOS !== 'undefined') {
    AOS.init();
}

document.addEventListener('DOMContentLoaded', function () {
    var reels = document.querySelectorAll('.reel-video');
    var galleryImages = document.querySelectorAll('.gallery-grid img, .gallery-page-grid img');

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

    if (!galleryImages.length) {
        return;
    }

    var lightbox = document.createElement('div');
    lightbox.className = 'lightbox-overlay';
    lightbox.innerHTML = '' +
        '<div class="lightbox-dialog" role="dialog" aria-modal="true" aria-label="Image preview">' +
        '<button class="lightbox-close" type="button" aria-label="Close image preview"><i class="fa-solid fa-xmark"></i></button>' +
        '<img class="lightbox-image" alt="Expanded gallery image">' +
        '</div>';
 
    document.body.appendChild(lightbox);

    var lightboxImage = lightbox.querySelector('.lightbox-image');
    var lightboxClose = lightbox.querySelector('.lightbox-close');

    function closeLightbox() {
        lightbox.classList.remove('is-open');
        document.body.style.overflow = '';
    }

    galleryImages.forEach(function (image) {
        image.addEventListener('click', function () {
            lightboxImage.src = image.src;
            lightboxImage.alt = image.alt || 'Expanded gallery image';
            lightbox.classList.add('is-open');
            document.body.style.overflow = 'hidden';
        });
    });

    lightboxClose.addEventListener('click', closeLightbox);

    lightbox.addEventListener('click', function (event) {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && lightbox.classList.contains('is-open')) {
            closeLightbox();
        }
    });
});
