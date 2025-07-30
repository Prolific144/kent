/**
 * Main JavaScript file for K.ent Entertainment website
 * Handles all interactive features including music player, navigation,
 * lighting controls, modals, gallery, and form submission
 */

document.addEventListener('DOMContentLoaded', () => {
    // === Preloader ===
    const loader = document.querySelector('.loader');
    const hideLoader = () => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 500);
    };

    if (document.readyState === 'complete') {
        hideLoader();
    } else {
        window.addEventListener('load', hideLoader);
    }

    // === Music Player ===
    const musicPlayer = {
        player: document.querySelector('.music-player'),
        playPauseBtn: document.querySelector('#playPauseBtn'),
        closePlayerBtn: document.querySelector('#closePlayerBtn'),
        miniPlayerBtn: document.querySelector('.mini-player-btn'),
        progressBar: document.querySelector('.progress-bar'),
        trackName: document.querySelector('.track-name'),
        tracks: document.querySelectorAll('.track'),
        currentAudio: null,
        isPlaying: false,
        currentTrackIndex: 0,

        init() {
            this.tracks.forEach((track, index) => {
                track.addEventListener('click', () => {
                    this.currentTrackIndex = index;
                    const trackTitle = track.querySelector('.track-name').textContent;
                    const audioSrc = track.getAttribute('data-src');
                    this.playTrack(trackTitle, audioSrc);
                });
            });

            this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
            this.closePlayerBtn.addEventListener('click', () => this.closePlayer());
            this.miniPlayerBtn.addEventListener('click', () => this.togglePlayer());
        },

        playTrack(title, src) {
            this.tracks.forEach(t => t.classList.remove('active'));
            this.tracks[this.currentTrackIndex].classList.add('active');

            if (this.currentAudio) {
                this.currentAudio.pause();
                this.currentAudio.currentTime = 0;
                this.currentAudio.removeEventListener('timeupdate', this.updateProgress);
            }

            this.currentAudio = new Audio(src);
            this.currentAudio.volume = 0.7;
            this.trackName.textContent = title;
            this.playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            this.isPlaying = true;

            if (!this.player.classList.contains('active')) {
                this.player.classList.add('active');
                this.miniPlayerBtn.style.display = 'none';
            }

            this.currentAudio.play().catch(error => console.error('Audio playback error:', error));
            this.currentAudio.addEventListener('timeupdate', () => this.updateProgress());
            this.currentAudio.addEventListener('ended', () => this.nextTrack());
        },

        updateProgress() {
            if (this.currentAudio) {
                const { currentTime, duration } = this.currentAudio;
                const progressPercent = (currentTime / duration) * 100;
                this.progressBar.style.width = `${progressPercent}%`;
            }
        },

        togglePlayPause() {
            if (!this.currentAudio) {
                const firstTrack = this.tracks[0];
                if (firstTrack) {
                    const trackTitle = firstTrack.querySelector('.track-name').textContent;
                    const audioSrc = firstTrack.getAttribute('data-src');
                    this.playTrack(trackTitle, audioSrc);
                }
                return;
            }

            if (this.isPlaying) {
                this.currentAudio.pause();
                this.playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            } else {
                this.currentAudio.play().catch(error => console.error('Audio playback error:', error));
                this.playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            }
            this.isPlaying = !this.isPlaying;
        },

        nextTrack() {
            this.currentTrackIndex = (this.currentTrackIndex + 1) % this.tracks.length;
            const nextTrack = this.tracks[this.currentTrackIndex];
            const trackTitle = nextTrack.querySelector('.track-name').textContent;
            const audioSrc = nextTrack.getAttribute('data-src');
            this.playTrack(trackTitle, audioSrc);
        },

        closePlayer() {
            if (this.currentAudio) {
                this.currentAudio.pause();
                this.currentAudio.currentTime = 0;
                this.isPlaying = false;
                this.playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
                this.progressBar.style.width = '0%';
            }
            this.player.classList.remove('active');
            this.miniPlayerBtn.style.display = 'flex';
        },

        togglePlayer() {
            if (this.player.classList.contains('active')) {
                this.closePlayer();
            } else {
                this.player.classList.add('active');
                this.miniPlayerBtn.style.display = 'none';
            }
        }
    };

    musicPlayer.init();

    // === Navigation ===
    const navigation = {
        navLinks: document.querySelectorAll('.nav-link'),
        hamburger: document.querySelector('.hamburger'),
        navMenu: document.querySelector('.nav-links'),

        init() {
            this.navLinks.forEach(link => {
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
                    if (this.navMenu.classList.contains('active')) {
                        this.navMenu.classList.remove('active');
                        this.hamburger.classList.remove('active');
                    }
                });
            });

            this.hamburger.addEventListener('click', () => {
                this.hamburger.classList.toggle('active');
                this.navMenu.classList.toggle('active');
            });
        }
    };

    navigation.init();

    // === Theme Toggle ===
    const themeToggle = document.querySelector('.theme-toggle');
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        const isLightMode = document.body.classList.contains('light-mode');
        themeToggle.innerHTML = isLightMode ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
        localStorage.setItem('theme', isLightMode ? 'light' : 'dark');
    });

    if (localStorage.getItem('theme') === 'light') {
        document.body.classList.add('light-mode');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }

    // === Sticky Navbar and Back to Top ===
    const stickyElements = {
        navbar: document.querySelector('.navbar'),
        backToTop: document.querySelector('.back-to-top'),
        stickyBook: document.querySelector('.sticky-book'),
        
        init() {
            let lastInteraction = Date.now();
            
            // Function to get random position
            const repositionBookButton = () => {
                const maxX = window.innerWidth - 150;
                const maxY = window.innerHeight - 100;
                const newX = Math.random() * maxX;
                const newY = Math.random() * maxY;
                
                this.stickyBook.style.right = 'auto';
                this.stickyBook.style.bottom = 'auto';
                this.stickyBook.style.left = `${newX}px`;
                this.stickyBook.style.top = `${newY}px`;
                this.stickyBook.style.transform = 'none';
                this.stickyBook.style.display = 'block';
                
                setTimeout(() => {
                    this.stickyBook.style.opacity = '0';
                    setTimeout(() => {
                        this.stickyBook.style.display = 'none';
                        this.stickyBook.style.opacity = '1';
                    }, 300);
                }, 5000);
            };

            // Show button after 30 seconds of interaction
            document.addEventListener('mousemove', () => {
                lastInteraction = Date.now();
            });

            document.addEventListener('click', () => {
                lastInteraction = Date.now();
            });

            setInterval(() => {
                if (Date.now() - lastInteraction > 30000) {
                    repositionBookButton();
                    lastInteraction = Date.now();
                }
            }, 1000);

            window.addEventListener('scroll', () => {
                if (window.scrollY > 100) {
                    this.navbar.classList.add('scrolled');
                    this.backToTop.classList.add('active');
                } else {
                    this.navbar.classList.remove('scrolled');
                    this.backToTop.classList.remove('active');
                }
            });

            this.backToTop.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });

            this.stickyBook.addEventListener('click', () => {
                const bookingSection = document.querySelector('#booking');
                if (bookingSection) {
                    window.scrollTo({
                        top: bookingSection.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });
        }
    };

    stickyElements.init();

    // === Reveal Animations ===
    const revealElements = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            if (elementTop < windowHeight - 100) {
                element.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();

    // === Video Modal ===
    const videoModal = {
        modal: document.querySelector('.video-modal'),
        videoBtns: document.querySelectorAll('.pyro-video-btn'),
        closeModal: document.querySelector('.video-modal .close-modal'),
        modalVideo: document.querySelector('#modalVideo'),

        init() {
            this.videoBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const videoName = btn.getAttribute('data-video');
                    this.modalVideo.querySelector('source').src = `assets/${videoName}.mp4`;
                    this.modalVideo.load();
                    this.modal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                });
            });

            this.closeModal.addEventListener('click', () => this.close());
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) this.close();
            });
        },

        close() {
            this.modal.classList.remove('active');
            this.modalVideo.pause();
            document.body.style.overflow = 'auto';
        }
    };

    videoModal.init();

    // === Service Modals ===
    const serviceModals = {
        modals: document.querySelectorAll('.service-modal'),
        triggers: document.querySelectorAll('.modal-trigger'),
        closeButtons: document.querySelectorAll('.service-modal .close-modal'),

        init() {
            this.triggers.forEach(trigger => {
                trigger.addEventListener('click', () => {
                    const modalId = trigger.getAttribute('data-modal');
                    const modal = document.getElementById(modalId);
                    if (modal) {
                        modal.classList.add('active');
                        document.body.style.overflow = 'hidden';
                    }
                });
            });

            this.closeButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    const modal = btn.closest('.service-modal');
                    modal.classList.remove('active');
                    document.body.style.overflow = 'auto';
                });
            });

            this.modals.forEach(modal => {
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        modal.classList.remove('active');
                        document.body.style.overflow = 'auto';
                    }
                });
            });
        }
    };

    serviceModals.init();

    // === Lighting Playground ===
    const lightingPlayground = {
        toggleBtn: document.querySelector('.playground-collapse-toggle'),
        collapsibleContent: document.querySelector('.lighting-playground-collapsible'),
        sliders: document.querySelectorAll('.lighting-slider'),
        colorPicker: document.querySelector('.lighting-color'),
        effectSelect: document.querySelector('.lighting-effect'),
        zones: document.querySelectorAll('.zone-toggle input'),
        stage: document.querySelector('.stage'),
        stageFront: document.querySelector('.stage-front'),
        danceFloor: document.querySelector('.dance-floor'),
        leftWall: document.querySelector('.left-wall'),
        rightWall: document.querySelector('.right-wall'),
        backWall: document.querySelector('.back-wall'),
        ceiling: document.querySelector('.ceiling'),
        presetColors: document.querySelectorAll('.preset-color'),
        saveBtn: document.querySelector('.action-btn.save'),
        resetBtn: document.querySelector('.action-btn.reset'),
        currentEffect: 'none',

        init() {
            // Ensure toggle starts closed
            if (this.collapsibleContent) {
                this.collapsibleContent.classList.remove('active');
            }

            this.toggleBtn.addEventListener('click', () => {
                this.collapsibleContent.classList.toggle('active');
                this.toggleBtn.innerHTML = this.collapsibleContent.classList.contains('active')
                    ? '<i class="fas fa-chevron-up"></i> Hide Lighting Designer'
                    : '<i class="fas fa-chevron-down"></i> Try Our Lighting Designer';
            });

            this.sliders.forEach(slider => {
                slider.addEventListener('input', () => this.updateLighting());
            });

            this.colorPicker.addEventListener('input', () => this.updateLighting());

            this.effectSelect.addEventListener('change', () => {
                this.currentEffect = this.effectSelect.value;
                this.updateLighting();
            });

            this.zones.forEach(zone => {
                zone.addEventListener('change', () => this.updateLighting());
            });

            this.presetColors.forEach(color => {
                color.addEventListener('click', () => {
                    this.colorPicker.value = color.getAttribute('data-color');
                    this.updateLighting();
                });
            });

            this.saveBtn.addEventListener('click', () => this.saveConfig());
            this.resetBtn.addEventListener('click', () => this.resetConfig());

            // Load saved config if exists
            const savedConfig = localStorage.getItem('lightingConfig');
            if (savedConfig) {
                const config = JSON.parse(savedConfig);
                this.sliders[0].value = config.brightness;
                this.sliders[1].value = config.speed;
                this.colorPicker.value = config.color;
                this.effectSelect.value = config.effect;
                this.currentEffect = config.effect;
                this.zones.forEach((zone, index) => {
                    zone.checked = config.zones[Object.keys(config.zones)[index]];
                });
            }

            this.updateLighting();
        },

        updateLighting() {
            const brightness = this.sliders[0].value / 100;
            const speed = this.sliders[1].value / 100;
            const color = this.colorPicker.value;

            const zones = {
                stage: this.zones[0].checked,
                stageFront: this.zones[1].checked,
                danceFloor: this.zones[2].checked,
                walls: this.zones[2].checked,
                ceiling: this.zones[3].checked
            };

            const elements = {
                stage: this.stage,
                stageFront: this.stageFront,
                danceFloor: this.danceFloor,
                leftWall: this.leftWall,
                rightWall: this.rightWall,
                backWall: this.backWall,
                ceiling: this.ceiling
            };

            Object.keys(elements).forEach(key => {
                const el = elements[key];
                if (zones[key] || (key === 'leftWall' && zones.walls) || (key === 'rightWall' && zones.walls) || (key === 'backWall' && zones.walls)) {
                    el.style.backgroundColor = color;
                    el.style.opacity = brightness;
                    el.style.animation = this.currentEffect !== 'none' ? `${this.currentEffect} ${1 / speed}s infinite` : 'none';
                } else {
                    el.style.backgroundColor = 'var(--dark-gray)';
                    el.style.opacity = 1;
                    el.style.animation = 'none';
                }
            });
        },

        saveConfig() {
            const config = {
                brightness: this.sliders[0].value,
                speed: this.sliders[1].value,
                color: this.colorPicker.value,
                effect: this.effectSelect.value,
                zones: {
                    stage: this.zones[0].checked,
                    stageFront: this.zones[1].checked,
                    danceFloor: this.zones[2].checked,
                    walls: this.zones[3].checked,
                    ceiling: this.zones[4].checked
                }
            };
            localStorage.setItem('lightingConfig', JSON.stringify(config));
            alert('Lighting configuration saved!');
        },

        resetConfig() {
            this.sliders[0].value = 100;
            this.sliders[1].value = 50;
            this.colorPicker.value = '#FF0033';
            this.effectSelect.value = 'none';
            this.zones.forEach(zone => zone.checked = true);
            this.currentEffect = 'none';
            this.updateLighting();
            localStorage.removeItem('lightingConfig');
        }
    };

    lightingPlayground.init();

    // === Gallery Lightbox ===
    const galleryLightbox = {
        lightbox: document.querySelector('.gallery-lightbox'),
        img: document.querySelector('.lightbox-img img'),
        caption: document.querySelector('.lightbox-caption'),
        closeBtn: document.querySelector('.close-lightbox'),
        prevBtn: document.querySelector('.lightbox-nav.prev'),
        nextBtn: document.querySelector('.lightbox-nav.next'),
        viewBtns: document.querySelectorAll('.view-btn'),
        items: document.querySelectorAll('.gallery-item'),
        currentImageIndex: 0,

        init() {
            this.viewBtns.forEach((btn, index) => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.currentImageIndex = index;
                    this.openLightbox(index);
                });
            });

            this.closeBtn.addEventListener('click', () => this.close());
            this.prevBtn.addEventListener('click', () => {
                this.currentImageIndex = (this.currentImageIndex - 1 + this.items.length) % this.items.length;
                this.openLightbox(this.currentImageIndex);
            });
            this.nextBtn.addEventListener('click', () => {
                this.currentImageIndex = (this.currentImageIndex + 1) % this.items.length;
                this.openLightbox(this.currentImageIndex);
            });

            this.lightbox.addEventListener('click', (e) => {
                if (e.target === this.lightbox) this.close();
            });
        },

        openLightbox(index) {
            const item = this.items[index];
            const imgSrc = item.querySelector('img').src;
            const title = item.querySelector('h3').textContent;
            const desc = item.querySelector('p').textContent;

            this.img.src = imgSrc;
            this.caption.querySelector('h3').textContent = title;
            this.caption.querySelector('p').textContent = desc;

            this.lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        },

        close() {
            this.lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    };

    galleryLightbox.init();

    // === Gallery Filtering ===
    const galleryFilter = {
        buttons: document.querySelectorAll('.filter-btn'),
        items: document.querySelectorAll('.gallery-item'),

        init() {
            this.buttons.forEach(btn => {
                btn.addEventListener('click', () => {
                    this.buttons.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');

                    const filter = btn.getAttribute('data-filter');
                    this.items.forEach(item => {
                        const category = item.getAttribute('data-category');
                        item.style.display = filter === 'all' || filter === category ? 'block' : 'none';
                    });
                });
            });
        }
    };

    galleryFilter.init();

    // === Testimonials Slider ===
    new Swiper('.testimonial-slider', {
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        spaceBetween: 20,
        slidesPerView: 1,
        speed: 800,
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        },
        breakpoints: {
            768: {
                slidesPerView: 2,
                spaceBetween: 20,
            },
            992: {
                slidesPerView: 3,
                spaceBetween: 20,
            }
        }
    });

    // === Event Ticker ===
    const eventTicker = {
        ticker: document.querySelector('.event-ticker'),
        events: [
        'Friday, 15th Aug 2025 @ Slevin Event',
        'Friday, 13th September 2025 @ Meru Town',
        'Homecoming Event 2025',
        ],
        currentIndex: 0,

        cycleEvents() {
            if (!this.ticker) {
                console.error('Event ticker element not found. Ensure .event-ticker exists in the DOM.');
                return;
            }
            this.ticker.style.opacity = '0';
            setTimeout(() => {
                this.ticker.textContent = this.events[this.currentIndex];
                this.ticker.style.opacity = '1';
                this.currentIndex = (this.currentIndex + 1) % this.events.length;
            }, 300);
        },

        init() {
            if (this.ticker) {
                this.cycleEvents();
                setInterval(() => this.cycleEvents(), 5000);
            } else {
                console.error('Failed to initialize event ticker: .event-ticker not found.');
            }
        }
    };
    // === Form Submission ===
    const bookingForm = {
        form: document.getElementById('bookingForm'),
        successModal: document.querySelector('.success-modal'),
        closeSuccessModal: document.querySelector('.close-success-modal'),

        init() {
            if (this.form) {
                this.form.addEventListener('submit', async (e) => {
                    e.preventDefault();
                        const submitBtn = this.form.querySelector('.submit-btn');
                        submitBtn.classList.add('loading');

                        try {
                            const formData = new FormData(this.form);
                            const response = await fetch('https://formspree.io/f/mblkygoa', {
                                method: 'POST',
                                body: formData,
                                headers: { 'Accept': 'application/json' }
                            });

                            if (response.ok) {
                                submitBtn.classList.remove('loading');
                                this.successModal.classList.add('active');
                                document.body.style.overflow = 'hidden';
                                this.form.reset();
                            } else {
                                throw new Error('Form submission failed');
                            }
                        } catch (error) {
                            console.error('Form submission error:', error);
                            submitBtn.classList.remove('loading');
                            alert('There was an error submitting your request. Please try again.');
                        }
                    });

                this.closeSuccessModal.addEventListener('click', () => {
                    this.successModal.classList.remove('active');
                    document.body.style.overflow = 'auto';
                });

                this.successModal.addEventListener('click', (e) => {
                    if (e.target === this.successModal) {
                        this.successModal.classList.remove('active');
                        document.body.style.overflow = 'auto';
                    }
                });
            }
        }
    };

    bookingForm.init();

document.getElementById('bookingForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const form = e.target;
    const submitBtn = form.querySelector('.submit-btn');
    submitBtn.classList.add('loading');

    try {
        const response = await fetch(form.action, {
            method: form.method,
            body: new FormData(form),
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            document.querySelector('.success-modal').classList.add('active');
            form.reset();
        } else {
            alert('There was an error submitting your request. Please try again.');
        }
    } catch (error) {
        alert('There was an error submitting your request. Please try again.');
    } finally {
        submitBtn.classList.remove('loading');
    }
});

// Close success modal
document.querySelector('.close-success-modal').addEventListener('click', function () {
    document.querySelector('.success-modal').classList.remove('active');
});

    // === Easter Egg ===
    const easterEgg = {
        element: document.querySelector('.easter-egg'),
        konamiCode: ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'],
        konamiIndex: 0,

        init() {
            document.addEventListener('keydown', (e) => {
                if (e.key === this.konamiCode[this.konamiIndex]) {
                    this.konamiIndex++;
                    if (this.konamiIndex === this.konamiCode.length) {
                        this.triggerConfetti();
                        this.konamiIndex = 0;
                    }
                } else {
                    this.konamiIndex = 0;
                }
            });
        },

        triggerConfetti() {
            const canvas = document.createElement('canvas');
            Object.assign(canvas.style, {
                position: 'fixed',
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
                zIndex: '1001'
            });
            document.body.appendChild(canvas);

            const confettiSettings = {
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#FF0033', '#FF6F00', '#FFFFFF']
            };

            confetti(confettiSettings);

            this.element.style.display = 'block';
            setTimeout(() => {
                this.element.style.display = 'none';
                document.body.removeChild(canvas);
            }, 5000);
        }
    };

    easterEgg.init();
});
