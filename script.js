document.addEventListener('DOMContentLoaded', function() {
    // Preloader - Optimized for faster loading
    const loader = document.querySelector('.loader');
    const loadContent = function() {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
                document.body.style.overflow = 'auto';
            }, 500);
        }, 500);
    };

    // Check if all critical assets are loaded
    if (document.readyState === 'complete') {
        loadContent();
    } else {
        window.addEventListener('load', loadContent);
    }

    // Music Player - Complete implementation
    const musicPlayer = document.querySelector('.music-player');
    const playPauseBtn = document.querySelector('#playPauseBtn');
    const closePlayerBtn = document.querySelector('#closePlayerBtn');
    const miniPlayerBtn = document.querySelector('.mini-player-btn');
    const progressBar = document.querySelector('.progress-bar');
    const trackName = document.querySelector('.track-name');
    const tracks = document.querySelectorAll('.track');
    let currentAudio = null;
    let isPlaying = false;
    let currentTrackIndex = 0;

    // Initialize player
    function initPlayer() {
        tracks.forEach((track, index) => {
            track.addEventListener('click', function() {
                currentTrackIndex = index;
                const trackTitle = this.querySelector('.track-name').textContent;
                const audioSrc = this.getAttribute('data-src');
                playTrack(trackTitle, audioSrc);
            });
        });

        playPauseBtn.addEventListener('click', togglePlayPause);
        closePlayerBtn.addEventListener('click', closePlayer);
        miniPlayerBtn.addEventListener('click', togglePlayer);
    }

    function playTrack(title, src) {
        // Reset all tracks
        tracks.forEach(t => t.classList.remove('active'));
        
        // Highlight current track
        tracks[currentTrackIndex].classList.add('active');
        
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
            currentAudio.removeEventListener('timeupdate', updateProgress);
        }

        currentAudio = new Audio(src);
        currentAudio.volume = 0.7;
        trackName.textContent = title;
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        isPlaying = true;
        
        // Show player if hidden
        if (!musicPlayer.classList.contains('active')) {
            musicPlayer.classList.add('active');
            miniPlayerBtn.style.display = 'none';
        }

        currentAudio.play();
        currentAudio.addEventListener('timeupdate', updateProgress);
        currentAudio.addEventListener('ended', nextTrack);
    }

    function updateProgress() {
        const { currentTime, duration } = currentAudio;
        const progressPercent = (currentTime / duration) * 100;
        progressBar.style.width = `${progressPercent}%`;
    }

    function togglePlayPause() {
        if (!currentAudio) {
            // If no audio is selected, play the first track
            const firstTrack = document.querySelector('.track');
            if (firstTrack) {
                const trackTitle = firstTrack.querySelector('.track-name').textContent;
                const audioSrc = firstTrack.getAttribute('data-src');
                playTrack(trackTitle, audioSrc);
            }
            return;
        }

        if (isPlaying) {
            currentAudio.pause();
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        } else {
            currentAudio.play();
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        }
        isPlaying = !isPlaying;
    }

    function nextTrack() {
        currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
        const nextTrack = tracks[currentTrackIndex];
        const trackTitle = nextTrack.querySelector('.track-name').textContent;
        const audioSrc = nextTrack.getAttribute('data-src');
        playTrack(trackTitle, audioSrc);
    }

    function closePlayer() {
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
            isPlaying = false;
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            progressBar.style.width = '0%';
        }
        musicPlayer.classList.remove('active');
        miniPlayerBtn.style.display = 'flex';
    }

    function togglePlayer() {
        if (musicPlayer.classList.contains('active')) {
            closePlayer();
        } else {
            musicPlayer.classList.add('active');
            miniPlayerBtn.style.display = 'none';
        }
    }

    // Initialize the player
    initPlayer();

    // Navigation - Smooth scrolling and active link highlighting
    const navLinks = document.querySelectorAll('.nav-link');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-links');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
            
            // Close mobile menu if open
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    });

    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Theme toggle
    const themeToggle = document.querySelector('.theme-toggle');
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        const isLightMode = document.body.classList.contains('light-mode');
        themeToggle.textContent = isLightMode ? '🌙' : '☀️';
        localStorage.setItem('theme', isLightMode ? 'light' : 'dark');
    });

    // Check for saved theme preference
    if (localStorage.getItem('theme') === 'light') {
        document.body.classList.add('light-mode');
        themeToggle.textContent = '🌙';
    }

    // Sticky navbar on scroll
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        const backToTop = document.querySelector('.back-to-top');
        
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
            backToTop.classList.add('active');
        } else {
            navbar.classList.remove('scrolled');
            backToTop.classList.remove('active');
        }
    });

    // Back to top button
    const backToTop = document.querySelector('.back-to-top');
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Reveal animations on scroll
    const revealElements = document.querySelectorAll('.reveal');
    const revealOnScroll = function() {
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Initial check

    // Video modal functionality
    const videoModal = document.querySelector('.video-modal');
    const videoBtns = document.querySelectorAll('.pyro-video-btn');
    const closeVideoModal = document.querySelector('.video-modal .close-modal');
    const modalVideo = document.querySelector('#modalVideo');

    videoBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const videoName = btn.getAttribute('data-video');
            modalVideo.querySelector('source').src = `assets/${videoName}.mp4`;
            modalVideo.load();
            videoModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    closeVideoModal.addEventListener('click', () => {
        videoModal.classList.remove('active');
        modalVideo.pause();
        document.body.style.overflow = 'auto';
    });

    // Service modals functionality
    const serviceModals = document.querySelectorAll('.service-modal');
    const modalTriggers = document.querySelectorAll('.modal-trigger');
    const closeModalBtns = document.querySelectorAll('.service-modal .close-modal');

    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const modalId = trigger.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.service-modal');
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });

    // Close modals when clicking outside
    serviceModals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    });

    videoModal.addEventListener('click', (e) => {
        if (e.target === videoModal) {
            videoModal.classList.remove('active');
            modalVideo.pause();
            document.body.style.overflow = 'auto';
        }
    });

    // Gallery lightbox functionality
    const galleryLightbox = document.querySelector('.gallery-lightbox');
    const lightboxImg = document.querySelector('.lightbox-img');
    const lightboxCaption = document.querySelector('.lightbox-caption');
    const closeLightbox = document.querySelector('.close-lightbox');
    const viewBtns = document.querySelectorAll('.view-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    let currentImageIndex = 0;

    viewBtns.forEach((btn, index) => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            currentImageIndex = index;
            openLightbox(index);
        });
    });

    function openLightbox(index) {
        const item = galleryItems[index];
        const imgSrc = item.querySelector('img').src;
        const title = item.querySelector('h3').textContent;
        const desc = item.querySelector('p').textContent;
        
        lightboxImg.src = imgSrc;
        lightboxCaption.querySelector('h3').textContent = title;
        lightboxCaption.querySelector('p').textContent = desc;
        
        galleryLightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeLightbox.addEventListener('click', () => {
        galleryLightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    });

    // Navigation between gallery images
    const prevBtn = document.querySelector('.lightbox-nav.prev');
    const nextBtn = document.querySelector('.lightbox-nav.next');

    prevBtn.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex - 1 + galleryItems.length) % galleryItems.length;
        openLightbox(currentImageIndex);
    });

    nextBtn.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex + 1) % galleryItems.length;
        openLightbox(currentImageIndex);
    });

    // Gallery filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active filter button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            galleryItems.forEach(item => {
                const category = item.getAttribute('data-category');
                if (filter === 'all' || filter === category) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // Testimonials slider
    const testimonialSlider = new Swiper('.testimonial-slider', {
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
    });

    // Form submission
    const bookingForm = document.getElementById('bookingForm');
    const successModal = document.querySelector('.success-modal');
    const closeSuccessModal = document.querySelector('.close-success-modal');

    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show loading state
            const submitBtn = this.querySelector('.submit-btn');
            submitBtn.classList.add('loading');
            
            // Simulate form submission
            setTimeout(() => {
                submitBtn.classList.remove('loading');
                successModal.classList.add('active');
                document.body.style.overflow = 'hidden';
                this.reset();
            }, 2000);
        });
    }

    closeSuccessModal.addEventListener('click', () => {
        successModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    });

    // Easter egg - Konami code
    const easterEgg = document.querySelector('.easter-egg');
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;

    document.addEventListener('keydown', (e) => {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                easterEgg.style.display = 'block';
                setTimeout(() => {
                    easterEgg.style.display = 'none';
                }, 3000);
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });

    // Lighting controls
    const intensitySlider = document.getElementById('intensity');
    const colorPicker = document.getElementById('lighting-color');
    const effectSelect = document.getElementById('lighting-effect');
    const stageLight = document.getElementById('stage-light');
    const danceFloorLight = document.getElementById('dance-floor-light');
    const wallLights = document.getElementById('wall-lights');

    function updateLighting() {
        const intensity = intensitySlider.value;
        const color = colorPicker.value;
        const effect = effectSelect.value;
        
        // Apply to all lighting elements
        const lightingElements = [stageLight, danceFloorLight, wallLights];
        
        lightingElements.forEach(el => {
            el.style.backgroundColor = color;
            el.style.opacity = intensity / 100;
            
            // Reset animations
            el.style.animation = 'none';
            
            // Apply effects
            if (effect === 'pulse') {
                el.style.animation = 'pulse 2s infinite';
            } else if (effect === 'strobe') {
                el.style.animation = 'strobe 0.5s infinite';
            } else if (effect === 'rainbow') {
                el.style.animation = 'rainbow 5s infinite';
            }
        });
    }

    // Add event listeners
    intensitySlider.addEventListener('input', updateLighting);
    colorPicker.addEventListener('input', updateLighting);
    effectSelect.addEventListener('change', updateLighting);

    // Initial update
    updateLighting();

    // Lazy loading for images
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    const lazyLoad = function() {
        lazyImages.forEach(img => {
            if (img.getBoundingClientRect().top < window.innerHeight + 100 && !img.src) {
                img.src = img.dataset.src;
            }
        });
    };

    window.addEventListener('scroll', lazyLoad);
    window.addEventListener('resize', lazyLoad);
    lazyLoad(); // Initial load
});

// Lighting animations
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 0.8; }
    }
    
    @keyframes strobe {
        0%, 100% { opacity: 0; }
        50% { opacity: 1; }
    }
    
    @keyframes rainbow {
        0% { background-color: #ff0000; }
        16% { background-color: #ff7f00; }
        33% { background-color: #ffff00; }
        50% { background-color: #00ff00; }
        66% { background-color: #0000ff; }
        83% { background-color: #4b0082; }
        100% { background-color: #9400d3; }
    }
`;
document.head.appendChild(style);
