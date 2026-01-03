document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const introScreen = document.getElementById('intro-screen');
    const mainContent = document.getElementById('main-content');
    const openBtn = document.getElementById('open-btn');
    const bgMusic = document.getElementById('bg-music');
    const musicBtn = document.getElementById('music-btn');
    const currentDateSpan = document.getElementById('current-date');

    // Set Date
    const today = new Date();
    currentDateSpan.textContent = today.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Audio State
    let isMusicPlaying = false;

    // Initially lock scrolling
    document.body.classList.add('intro-active');

    // Open Event
    openBtn.addEventListener('click', () => {
        // Remove intro
        introScreen.classList.add('hidden');

        // Allow scrolling
        document.body.classList.remove('intro-active');

        // Show main content
        setTimeout(() => {
            mainContent.classList.add('active');
            triggerConfetti();
        }, 800);

        // Try to play music
        playMusic();
    });

    // Music Control
    musicBtn.addEventListener('click', () => {
        if (isMusicPlaying) {
            bgMusic.pause();
            musicBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
        } else {
            bgMusic.play();
            musicBtn.innerHTML = '<i class="fas fa-music"></i>';
        }
        isMusicPlaying = !isMusicPlaying;
    });

    function playMusic() {
        bgMusic.play().then(() => {
            isMusicPlaying = true;
            musicBtn.innerHTML = '<i class="fas fa-music"></i>';
        }).catch(err => {
            console.log("Autoplay prevented:", err);
            isMusicPlaying = false;
            musicBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
        });
    }

    // Floating Hearts Background Effect
    function createFloatingHeart() {
        const heart = document.createElement('div');
        heart.classList.add('floating-heart');
        heart.innerText = '❤️';

        // Random Position & Animation
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.animationDuration = Math.random() * 3 + 2 + 's';
        heart.style.fontSize = Math.random() * 20 + 10 + 'px';

        document.getElementById('hearts-bg').appendChild(heart);

        // Cleanup
        setTimeout(() => {
            heart.remove();
        }, 5000);
    }

    // Add style for floating hearts dynamically
    const style = document.createElement('style');
    style.innerHTML = `
        .floating-heart {
            position: absolute;
            bottom: -20px;
            color: rgba(255, 77, 109, 0.5);
            animation: floatUp linear forwards;
            pointer-events: none;
        }
        @keyframes floatUp {
            0% { transform: translateY(0) rotate(0deg); opacity: 1; }
            100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    // Create hearts periodically
    setInterval(createFloatingHeart, 500);

    // Confetti Effect
    function triggerConfetti() {
        const count = 200;
        const defaults = {
            origin: { y: 0.7 }
        };

        function fire(particleRatio, opts) {
            confetti(Object.assign({}, defaults, opts, {
                particleCount: Math.floor(count * particleRatio)
            }));
        }

        fire(0.25, { spread: 26, startVelocity: 55 });
        fire(0.2, { spread: 60 });
        fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
        fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
        fire(0.1, { spread: 120, startVelocity: 45 });
    }

    // Carousel Variables
    let currentSlide = 0;
    let carouselInterval;
    const images = [
        'image1.jpg', 'image2.jpg', 'image3.jpg', 'image4.jpg',
        'image7.jpg', 'image10.jpg', 'image13.jpg', 'image14.jpg',
        'image15.jpg', 'image18.jpg', 'image7.jpeg', 'image9.jpeg',
        'image11.jpeg', 'image6.jpeg'
    ];

    // Initialize Carousel
    function initCarousel() {
        const carouselTrack = document.getElementById('carousel-track');
        const indicatorsContainer = document.getElementById('carousel-indicators');

        if (!carouselTrack) return;

        // Create slides
        images.forEach((imgName, index) => {
            const slide = document.createElement('div');
            slide.className = 'carousel-slide';
            
            const img = document.createElement('img');
            img.src = `photos/${imgName}`;
            img.alt = `Memory ${index + 1}`;
            img.loading = index === 0 ? 'eager' : 'lazy';
            
            slide.appendChild(img);
            carouselTrack.appendChild(slide);

            // Create indicator
            const indicator = document.createElement('div');
            indicator.className = 'carousel-indicator';
            if (index === 0) indicator.classList.add('active');
            indicator.addEventListener('click', () => goToSlide(index));
            indicatorsContainer.appendChild(indicator);
        });

        // Carousel controls
        document.getElementById('carousel-prev').addEventListener('click', () => {
            prevSlide();
            resetAutoPlay();
        });

        document.getElementById('carousel-next').addEventListener('click', () => {
            nextSlide();
            resetAutoPlay();
        });

        // Start auto-play
        startAutoPlay();
    }

    function goToSlide(index) {
        const carouselTrack = document.getElementById('carousel-track');
        const indicators = document.querySelectorAll('.carousel-indicator');
        
        currentSlide = index;
        carouselTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        indicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === currentSlide);
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % images.length;
        goToSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + images.length) % images.length;
        goToSlide(currentSlide);
    }

    function startAutoPlay() {
        carouselInterval = setInterval(nextSlide, 3000); // Change slide every 3 seconds
    }

    function resetAutoPlay() {
        clearInterval(carouselInterval);
        startAutoPlay();
    }

    // Dynamic Photo Gallery for Columns
    function createPhotoGallery() {
        const leftColumn = document.getElementById('left-photos');
        const rightColumn = document.getElementById('right-photos');

        images.forEach((imgName, index) => {
            const polaroid = document.createElement('div');
            polaroid.className = 'polaroid';
            polaroid.setAttribute('data-caption', `❤️`);

            const img = document.createElement('img');
            img.src = `photos/${imgName}`;
            img.alt = `Our Memory ${index + 1}`;
            img.loading = 'lazy';

            polaroid.appendChild(img);

            // Add delay for staggered animation
            polaroid.style.animationDelay = `${index * 0.1}s`;

            // Distribute: even indices to left, odd to right
            if (index % 2 === 0) {
                leftColumn.appendChild(polaroid);
            } else {
                rightColumn.appendChild(polaroid);
            }
        });
    }

    // Initialize photo gallery when content is shown
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.target.classList.contains('active')) {
                createPhotoGallery();
                initCarousel(); // Initialize carousel for mobile
                observer.disconnect();
            }
        });
    });

    observer.observe(mainContent, { attributes: true, attributeFilter: ['class'] });
});
