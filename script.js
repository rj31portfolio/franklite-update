if (typeof AOS !== 'undefined') {
    AOS.init();
}

document.addEventListener('DOMContentLoaded', function () {
    var categoryProductsGrid = document.querySelector('[data-category-products]');

    if (categoryProductsGrid) {
        var categories = {
            rideon: {
                name: 'Rideon',
                description: 'Explore our Rideon collection for little explorers.',
                image: 'image/prod-1.png',
                products: [
                    ['JIMNY', 'image/rideon/1.png'],
                    ['FERRARI', 'image/rideon/2.png'],
                    ['CITY BIKE', 'image/rideon/3.png'],
                    ['PANDA BAZUKA', 'image/rideon/4.png'],
                    ['SHERA BAZUKA', 'image/rideon/5.png']
                ]
            },
            'baby-pedal-bikes': {
                name: 'Baby Pedal Bikes',
                description: 'Discover fun pedal bikes made for young riders.',
                image: 'image/padelbike.png',
                products: [
                    ['GTR', 'image/peddlebike/GTR.png'],
                    ['SNIPER', 'image/peddlebike/sniper.png'],
                    ['PUSHA RAAJ', 'image/peddlebike/pushpa.png'],
                    ['TARZAN', 'image/peddlebike/Tarzan.png'],
                    ['DUKE', 'image/peddlebike/duke.png'],
                    ['PANTHER', 'image/peddlebike/panther.png'],
                    ['ROWDY', 'image/peddlebike/Rowdy.png'],
                    ['PUSHA', 'image/peddlebike/Pusha.png'],
                    ['DON', 'image/peddlebike/Don.png'],
                ]
            },
            'baby-bikes-ev': {
                name: 'Baby Bikes EV',
                description: 'Explore electric bikes designed for little adventures.',
                image: 'image/dollerbikenew.png',
                products: [
                    ['BMW EV', 'image/evbike/18.png'],
                    ['DOLLER EV', 'image/evbike/17.png'],
                    ['ANGRY BIRD EV', 'image/evbike/18.png'],
                    ['ANGRY BIRD EV', 'image/evbike/']
                ]
            }
        };
        var categoryKey = new URLSearchParams(window.location.search).get('category');
        var selectedCategoryKey = categories[categoryKey] ? categoryKey : 'all';
        var selectedCategory = categories[selectedCategoryKey];
        var categoryTitle = document.querySelector('[data-category-title]');
        var heroTitle = document.querySelector('[data-category-hero-title]');
        var heroDescription = document.querySelector('[data-category-hero-description]');
        var categoryKicker = document.querySelector('[data-category-kicker]');
        var categoryFilters = document.querySelector('[data-category-filters]');
        var products = [];

        if (selectedCategory) {
            document.title = selectedCategory.name + ' | Franklite';
            categoryTitle.textContent = selectedCategory.name + ' Products';
            heroTitle.textContent = selectedCategory.name;
            heroDescription.textContent = selectedCategory.description;
            categoryKicker.textContent = selectedCategory.name;
            products = selectedCategory.products;
        } else {
            document.title = 'Shop | Franklite';
            heroTitle.textContent = 'Find Their Next Adventure';
            heroDescription.textContent = 'Choose a category to find the perfect ride for every little explorer.';
            products = Object.keys(categories).reduce(function (allProducts, key) {
                return allProducts.concat(categories[key].products);
            }, []);
        }

        categoryFilters.insertAdjacentHTML('beforeend',
            '<a class="shop-filter-link' + (selectedCategoryKey === 'all' ? ' is-active' : '') + '" href="shop.html">All</a>');

        Object.keys(categories).forEach(function (key) {
            var category = categories[key];
            categoryFilters.insertAdjacentHTML('beforeend',
                '<a class="shop-filter-link' + (selectedCategoryKey === key ? ' is-active' : '') + '" href="shop.html?category=' + key + '">' + category.name + '</a>');
        });

        products.forEach(function (product) {
            var productName = product[0];
            var productImage = product[1];
            var enquiryText = encodeURIComponent('Hello, I want to enquire about ' + productName + '.');

            categoryProductsGrid.insertAdjacentHTML('beforeend',
                '<article class="product-card">' +
                '<img src="' + productImage + '" alt="' + productName + '">' +
                '<h3>' + productName + '</h3>' +
                '<div class="product-actions"><a class="btn theme-btn enquiry-btn" href="https://wa.me/917428900713?text=' + enquiryText + '" target="_blank" rel="noopener noreferrer">Enquiry</a></div>' +
                '</article>');
        });
    }

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
