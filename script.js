if (typeof AOS !== 'undefined') {
    AOS.init();
}

document.addEventListener('DOMContentLoaded', function () {
    var productCarousel = document.querySelector('[data-product-carousel]');

    if (productCarousel) {
        var productTrack = productCarousel.querySelector('.product-track');
        var productCards = productTrack.querySelectorAll('.product-card');
        var previousButton = productCarousel.querySelector('[data-product-carousel-prev]');
        var nextButton = productCarousel.querySelector('[data-product-carousel-next]');
        var carouselOffset = 0;
        var autoplayTimer;
        var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        function getSlideWidth() {
            var firstCard = productCards[0];
            var trackStyles = window.getComputedStyle(productTrack);
            return firstCard.getBoundingClientRect().width + parseFloat(trackStyles.gap || 0);
        }

        function getMaximumOffset() {
            return Math.max(0, productTrack.scrollWidth - productCarousel.clientWidth);
        }

        function updateCarousel() {
            carouselOffset = Math.min(carouselOffset, getMaximumOffset());
            productTrack.style.transform = 'translateX(-' + carouselOffset + 'px)';
        }

        function moveCarousel(direction) {
            var slideWidth = getSlideWidth();
            var maximumOffset = getMaximumOffset();
            var nextOffset = carouselOffset + (direction * slideWidth);

            if (nextOffset > maximumOffset + 1) {
                carouselOffset = 0;
            } else if (nextOffset < 0) {
                carouselOffset = maximumOffset;
            } else {
                carouselOffset = nextOffset;
            }

            updateCarousel();
        }

        function stopAutoplay() {
            window.clearInterval(autoplayTimer);
        }

        function startAutoplay() {
            if (reducedMotion || productCards.length < 2) {
                return;
            }

            stopAutoplay();
            autoplayTimer = window.setInterval(function () {
                moveCarousel(1);
            }, 4500);
        }

        previousButton.addEventListener('click', function () {
            moveCarousel(-1);
            startAutoplay();
        });

        nextButton.addEventListener('click', function () {
            moveCarousel(1);
            startAutoplay();
        });

        productCarousel.addEventListener('mouseenter', stopAutoplay);
        productCarousel.addEventListener('mouseleave', startAutoplay);
        productCarousel.addEventListener('focusin', stopAutoplay);
        productCarousel.addEventListener('focusout', function (event) {
            if (!productCarousel.contains(event.relatedTarget)) {
                startAutoplay();
            }
        });

        window.addEventListener('resize', updateCarousel);
        updateCarousel();
        startAutoplay();
    }

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
