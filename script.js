document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    mobileMenuBtn.addEventListener('click', function() {
        navLinks.classList.toggle('nav-active');
    });
    
    // Modal Handling
    const bookButtons = document.querySelectorAll('.book-now, .service-button, .sticky-book');
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close-modal, .close-offer');
    
    bookButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const targetModal = button.classList.contains('service-button') ? 
                (button.classList.contains('dj') ? 'bookModal' : 'bookModal') : 
                button.getAttribute('href').replace('#', '');
            document.getElementById(targetModal).style.display = 'block';
        });
    });
    
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = button.closest('.modal');
            modal.style.display = 'none';
        });
    });
    
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });
    
    // Close Modals on Escape Key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            modals.forEach(modal => modal.style.display = 'none');
        }
    });

    // Limited-Time Offer Modal
    const offerModal = document.getElementById('offerModal');
    setTimeout(() => {
        offerModal.style.display = 'block';
    }, 3000); // Show after 3 seconds
    
    // Form Handling with Validation
    const bookingForm = document.getElementById('bookingForm');
    const contactForm = document.getElementById('contactForm');
    
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const requiredFields = bookingForm.querySelectorAll('[required]');
            let isValid = true;
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.style.borderColor = 'red';
                } else {
                    field.style.borderColor = '';
                }
            });
            if (!isValid) {
                alert('Please fill out all required fields.');
                return;
            }
            const formData = new FormData(bookingForm);
            fetch(bookingForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    alert('Booking request sent successfully! We will contact you soon.');
                    bookingForm.reset();
                    document.getElementById('bookModal').style.display = 'none';
                } else {
                    throw new Error('Network response was not ok');
                }
            })
            .catch(error => {
                alert('There was a problem with your submission. Please try again.');
                console.error('Error:', error);
            });
        });
    }
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const requiredFields = contactForm.querySelectorAll('[required]');
            let isValid = true;
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.style.borderColor = 'red';
                } else {
                    field.style.borderColor = '';
                }
            });
            if (!isValid) {
                alert('Please fill out all required fields.');
                return;
            }
            const formData = new FormData(contactForm);
            fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    alert('Message sent successfully! We will get back to you soon.');
                    contactForm.reset();
                    document.getElementById('contactModal').style.display = 'none';
                } else {
                    throw new Error('Network response was not ok');
                }
            })
            .catch(error => {
                alert('There was a problem with your submission. Please try again.');
                console.error('Error:', error);
            });
        });
    }
    
    // Smooth Scrolling for Navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                if (window.innerWidth <= 768) {
                    navLinks.classList.remove('nav-active');
                }
            }
        });
    });
    
    // Video Autoplay on Intersection
    const video = document.querySelector('.service-image video');
    if (video) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    video.play().catch(() => {
                        video.muted = true;
                        video.play();
                    });
                } else {
                    video.pause();
                }
            });
        }, { threshold: 0.5 });
        observer.observe(video);
    }
    
    // Adjust hero section height on mobile
    function adjustHeroHeight() {
        const hero = document.querySelector('.hero');
        if (window.innerWidth <= 768) {
            hero.style.height = 'calc(100vh - 60px)';
        } else {
            hero.style.height = '100vh';
        }
    }
    
    window.addEventListener('resize', adjustHeroHeight);
    adjustHeroHeight();

    // Theme Toggle
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = '🌙';
    document.querySelector('.futuristic-nav').appendChild(themeToggle);
    
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        themeToggle.innerHTML = document.body.classList.contains('light-mode') ? '☀️' : '🌙';
    });

    // Sticky Book Now Tab
    const stickyBook = document.createElement('a');
    stickyBook.className = 'sticky-book';
    stickyBook.href = '#bookModal';
    stickyBook.textContent = 'Book Now →';
    document.body.appendChild(stickyBook);

    // Easter Egg (Shift + K)
    const easterEgg = document.createElement('div');
    easterEgg.className = 'easter-egg';
    easterEgg.textContent = '🔥 Light Show Activated!';
    document.body.appendChild(easterEgg);
    
    document.addEventListener('keydown', (e) => {
        if (e.shiftKey && e.key === 'K') {
            document.body.style.animation = 'pulse 0.5s 3';
            easterEgg.style.display = 'block';
            setTimeout(() => easterEgg.style.display = 'none', 2000);
        }
    });

    // Add glow-border to service sections
    document.querySelectorAll('.service-image').forEach(el => {
        el.classList.add('glow-border');
    });

    // Initialize particles.js if available
    if (typeof particlesJS !== 'undefined' && document.getElementById('particles-js')) {
        particlesJS('particles-js', {
            particles: {
                number: { value: 30, density: { enable: true, value_area: 800 } },
                color: { value: "#ff0033" },
                shape: { type: "circle" },
                opacity: { random: true, value: 0.5 },
                size: { random: true, value: 3 },
                line_linked: { enable: false },
                move: { enable: true, speed: 1 }
            }
        });
    }

    // Event Ticker
    const eventTicker = document.querySelector('.event-ticker');
    const events = [
        'Tomorrow @ Club XYZ',
        'Thursday, 31st July 2025 @ Burudani Address',
        'Friday, 29th August 2025 @ Arusha Tanzania'
    ];
    let currentEventIndex = 0;

    function cycleEvents() {
        eventTicker.style.animation = 'none'; // Reset animation
        eventTicker.offsetHeight; // Trigger reflow
        eventTicker.textContent = events[currentEventIndex];
        eventTicker.style.animation = 'fadeInOut 1.5s ease-in-out';
        currentEventIndex = (currentEventIndex + 1) % events.length;
    }

    // Initial event display
    cycleEvents();
    // Cycle every 8 seconds
    setInterval(cycleEvents, 8000);

    // Testimonials Carousel
    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    const navDots = document.querySelectorAll('.nav-dot');
    let currentSlideIndex = 0;

    function showSlide(index) {
        testimonialSlides.forEach((slide, i) => {
            slide.classList.remove('active');
            navDots[i].classList.remove('active');
        });
        testimonialSlides[index].classList.add('active');
        navDots[index].classList.add('active');
    }

    function nextSlide() {
        currentSlideIndex = (currentSlideIndex + 1) % testimonialSlides.length;
        showSlide(currentSlideIndex);
    }

    // Initial slide display
    showSlide(currentSlideIndex);
    // Auto cycle every 6 seconds
    setInterval(nextSlide, 6000);

    // Manual navigation
    navDots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            currentSlideIndex = i;
            showSlide(currentSlideIndex);
        });
    });

    // Event Type Modals
    const eventTypes = document.querySelectorAll('.event-type');
    const eventModal = document.getElementById('eventTypeModal');
    const eventModalTitle = document.querySelector('.event-modal-title');
    const eventModalImage = document.getElementById('eventModalImage');
    const eventModalDescription = document.getElementById('eventModalDescription');

    // Event type data
    const eventData = {
        weddings: {
            title: "Weddings",
            image: "images/wedding-event.jpg",
            description: "Make your special day unforgettable with our wedding services. We provide elegant DJ performances and tasteful pyrotechnics that will create magical moments you'll cherish forever."
        },
        corporate: {
            title: "Corporate Events",
            image: "images/corporate-event.jpg",
            description: "Impress your clients and employees with our professional corporate event services. From product launches to company parties, we'll help you create a memorable experience."
        },
        nightclubs: {
            title: "Nightclubs",
            image: "images/nightclub-event.jpg",
            description: "Bring the energy to your nightclub with our high-energy DJ sets and spectacular light shows. We'll keep the dance floor packed all night long."
        },
        private: {
            title: "Private Parties",
            image: "images/private-event.jpg",
            description: "Whether it's a birthday, anniversary, or just a gathering of friends, we'll tailor our services to make your private party an event to remember."
        }
    };

    // Add click event to each event type
    eventTypes.forEach(eventType => {
        eventType.addEventListener('click', () => {
            const eventKey = eventType.getAttribute('data-type');
            const event = eventData[eventKey];
            
            eventModalTitle.textContent = event.title;
            eventModalImage.src = event.image;
            eventModalImage.alt = `${event.title} Image`;
            eventModalDescription.textContent = event.description;
            
            eventModal.style.display = 'block';
        });
    });
});