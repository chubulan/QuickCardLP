"use strict";

// Loading screen and animation coordination
const loadingScreen = document.getElementById('loading-screen');
const fvbgDecors = document.querySelector('.fv-bg-decors');
const heroContent = document.querySelector('.hero-content');
const keyvisual = document.querySelector('.keyvisual');
const underlines = document.querySelectorAll('.underline');
const images = document.querySelectorAll('.masked-image');
let imageInterval; // Store interval ID for image rotation

// Keep track of completed animations
let completedAnimations = 0;
const totalAnimations = 3; // fvbgDecors, heroContent, keyvisual

// Remove initial animations
fvbgDecors.style.animation = 'none';
heroContent.style.animation = 'none';
keyvisual.style.animation = 'none';

// Image rotation functions
let currentIndex = 0;

function startImageRotation() {
    // Ensure first image is active
    images[0].classList.add('active');
    
    function nextImage() {
        images[currentIndex].classList.remove('active');
        currentIndex = (currentIndex + 1) % images.length;
        images[currentIndex].classList.add('active');
    }

    imageInterval = setInterval(nextImage, 3000);
}

// Function to check if all animations are complete
function checkAllAnimationsComplete() {
    completedAnimations++;
    if (completedAnimations === totalAnimations) {
        // All fade-up animations are complete
        setTimeout(() => {
            startAnimation(); // Start dot color transitions
            startImageRotation(); // Start image rotation after another brief delay 
        }, 100);
    }
}

// Function to start first view animations
function startFirstViewAnimations() {
    // Start background decors first
    setTimeout(() => {
        fvbgDecors.style.animation = '';
        fvbgDecors.style.animation = 'fadeUp 0.8s ease-out forwards';
    }, 200);

    // Start hero content with slight delay
    setTimeout(() => {
        heroContent.style.animation = '';
        heroContent.style.animation = 'fadeUp 0.8s ease-out forwards';
    }, 400);
    
    // Start keyvisual last
    setTimeout(() => {
        keyvisual.style.animation = '';
        keyvisual.style.animation = 'fadeUp 0.8s ease-out forwards';
    }, 800);

    // Add animation end listeners to all animated elements
    fvbgDecors.addEventListener('animationend', checkAllAnimationsComplete, { once: true });
    heroContent.addEventListener('animationend', checkAllAnimationsComplete, { once: true });
    keyvisual.addEventListener('animationend', checkAllAnimationsComplete, { once: true });
}

// Function to handle when fade-up animation ends
function onFadeUpComplete() {
    underlines.forEach((underline, index) => {
        setTimeout(() => {
            underline.classList.add('fade-in');
        }, index * 100);
    });

    // Start observing underlines for intersection
    underlines.forEach(element => {
        underlineObserver.observe(element);
    });
}

// Listen for when the hero content fade-up animation ends
heroContent.addEventListener('animationend', onFadeUpComplete);

// Intersection Observer for underlines
const underlineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && entry.target.classList.contains('fade-in')) {
            entry.target.classList.add('active');
        } else {
            entry.target.classList.remove('active');
        }
    });
}, {
    threshold: 0.7
});

// Modified loading screen handler
window.addEventListener('load', function() {
    setTimeout(function() {
        loadingScreen.classList.add('hidden');
        
        // Start first view animations immediately after loading screen starts to fade
        startFirstViewAnimations();
        
        // Remove the loading screen from DOM after transition
        setTimeout(function() {
            loadingScreen.remove();
        }, 500);
    }, 1000);
});

// Clean up function for page unload
window.addEventListener('beforeunload', function() {
    if (imageInterval) {
        clearInterval(imageInterval);
    }
});



// Underline for Mobile //
document.addEventListener('DOMContentLoaded', function() {
    const underlines = document.querySelectorAll('.underline');
    const keyvisual = document.querySelector('.keyvisual');
    
    // Wait for keyvisual animation to complete before starting underline animations
    keyvisual.addEventListener('animationend', () => {
        // Add a small additional delay after keyvisual appears
        setTimeout(() => {
            // Initial fade in for underlines
            underlines.forEach((underline, index) => {
                setTimeout(() => {
                    underline.classList.add('fade-in');
                }, index * 100);
            });

            // Start observing for highlight animation after fade-in starts
            setTimeout(() => {
                // Intersection Observer for highlight animation
                const underlineObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting && entry.target.classList.contains('fade-in')) {
                            entry.target.classList.add('active');
                        } else {
                            entry.target.classList.remove('active');
                        }
                    });
                }, {
                    threshold: 0.7,
                    rootMargin: '0px 0px -10% 0px'
                });

                // Start observing all underline elements
                underlines.forEach(element => {
                    underlineObserver.observe(element);
                });
            }, 500); // Wait for fade-in animations to mostly complete
        }, 200); // Delay after keyvisual animation ends
    }, { once: true }); // Ensure event listener only fires once
});


// KV image changing for Mobile //
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('.masked-image');
    let currentIndex = 0;
    let imageInterval;
    let isAnimating = false;

    function startImageRotation() {
        // Ensure first image is active
        if (!images[0].classList.contains('active')) {
            images[0].classList.add('active');
        }
        
        function nextImage() {
            if (isAnimating) return;
            isAnimating = true;

            // Remove active class from current image
            images[currentIndex].classList.remove('active');
            
            // Move to next image
            currentIndex = (currentIndex + 1) % images.length;
            
            // Add active class to next image
            images[currentIndex].classList.add('active');

            // Reset animating flag after transition
            setTimeout(() => {
                isAnimating = false;
            }, 500); // Match transition duration
        }

        // Start the rotation interval
        imageInterval = setInterval(nextImage, 3000);
    }

    // Wait for the fadeUp animation to complete before starting image rotation
    const keyvisual = document.querySelector('.keyvisual');
    if (keyvisual) {
        keyvisual.addEventListener('animationend', () => {
            // Add small delay after fadeUp completes
            setTimeout(startImageRotation, 500);
        }, { once: true });
    } else {
        // Fallback if no animation
        setTimeout(startImageRotation, 1000);
    }

    // Handle page visibility changes
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            clearInterval(imageInterval);
        } else {
            startImageRotation();
        }
    });

    // Clean up on page unload
    window.addEventListener('beforeunload', () => {
        if (imageInterval) {
            clearInterval(imageInterval);
        }
    });
});





// Scroll Animation //
document.addEventListener('DOMContentLoaded', function() {
    // Utility function to check if element is in viewport
    function isInViewport(element, tolerance = 0) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) - tolerance &&
            rect.bottom >= 0
        );
    }

    // Function to animate elements
    function animateElement(element, delay = 0) {
        setTimeout(() => {
            element.style.opacity = '1';
            // Check if element has translateX or translateY initially
            const currentTransform = window.getComputedStyle(element).transform;
            if (currentTransform.includes('translateX')) {
                element.style.transform = 'translateX(0)';
            } else {
                element.style.transform = 'translateY(0)';
            }
        }, delay);
    }

    // Combined function to handle all scroll animations
    function handleAllScrollAnimations() {
        // Handle general section animations with consistent tolerance
        const animateSections = document.querySelectorAll(
            '#problems, .about-grid, .about-pics.mb-only, .feature-box, #steps .step-item, .function-card'
        );
    
        const tolerance = 200; // Standardize tolerance
    
        animateSections.forEach(section => {
            if (isInViewport(section, tolerance) && !section.classList.contains('in-view')) {
                section.classList.add('in-view');
            }
        });
    
        // Handle about cards animations
        const aboutPicsMobile = document.querySelector('.about-pics.mb-only');
        if (aboutPicsMobile && isInViewport(aboutPicsMobile, tolerance) && !aboutPicsMobile.classList.contains('animated')) {
            aboutPicsMobile.classList.add('animated');
            
            const cards = aboutPicsMobile.querySelectorAll('.about-card-mb'); 
            cards.forEach((card, index) => {
                const timeoutId = setTimeout(() => {
                    card.classList.add('in-view');
                }, 200 * (index + 1));
                
                // Store timeout ID for cleanup if needed
                card.dataset.timeoutId = timeoutId;
            });
        }

        // Handle feature box animations
        const featureBoxes = document.querySelectorAll('.feature-box.in-view:not(.animated)');
        
        featureBoxes.forEach(box => {
            box.classList.add('animated');

                // Animate feature box elements in sequence
                const number = box.querySelector('.feature-number');
                const titleEn = box.querySelector('.feature-title span');
                const titleJp = box.querySelector('.feature-title h3');
                const desc = box.querySelector('.feature-desc');

                // Sequence of animations
                animateElement(number, 100);
                animateElement(titleEn, 100);
                animateElement(titleJp, 200);
                animateElement(desc, 400);

                // Feature 1: Business cards and mockup
                const businessCards = box.querySelectorAll('.business-cards');
                const mockupSp = box.querySelector('.mockup-sp');
                
                businessCards.forEach((card, index) => {
                    animateElement(card, 300 * (index + 1));
                });
                if (mockupSp) {
                    animateElement(mockupSp, 900);
                }

                // Feature 2: PC mockup and profile illustrations
                const mockupPc = box.querySelector('.mockup-pc');
                const profileIllusts = box.querySelectorAll('.people-illust');
                
                if (mockupPc) {
                    animateElement(mockupPc, 300);
                }
                profileIllusts.forEach((illust, index) => {
                    animateElement(illust, 600 + (200 * index));
                });

                // Feature 3: Share photos
                const sharePhotos = box.querySelectorAll('.share-photos');
                const shareIllusts = box.querySelectorAll('.share-illust');

                sharePhotos.forEach((photo, index) => {
                    animateElement(photo, 300 * (index + 1));
                });

                shareIllusts.forEach((illust, index) => {
                    animateElement(illust, 900 + (300 * index));
                });

                // Feature 4: Security Cards
                const securityCards = box.querySelector('.security-cards-container');
                if (securityCards) {
                    animateElement(securityCards, 300);
                }
        });
    }

    // Initial check
    handleAllScrollAnimations();

    // Add single scroll event listener
    // Optional: Add debounce for better performance
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            window.cancelAnimationFrame(scrollTimeout);
        }
        scrollTimeout = window.requestAnimationFrame(() => {
            handleAllScrollAnimations();
        });
    });
});


// Dot color transition //
const colors = {
    primary: getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim(),
    accent: getComputedStyle(document.documentElement).getPropertyValue('--color-accent').trim(),
    white: getComputedStyle(document.documentElement).getPropertyValue('--color-white').trim()
};

const fvdots = [
    document.querySelector('.dot1'),
    document.querySelector('.dot2'),
    document.querySelector('.dot3')
];

// Define the color sequence
const colorSequence = [
    colors.primary,   // green
    colors.accent,    // neon green
    colors.white      // white
];

// Define starting colors and their sequence indices
const dotConfigs = [
    { initialColor: colors.primary, startIndex: 0 },  // green -> neon green -> white
    { initialColor: colors.white, startIndex: 2 },    // white -> green -> neon green
    { initialColor: colors.accent, startIndex: 1 }    // neon green -> white -> green
];

let animationInterval;
const DELAY = 4000; 

function getNextColor(currentIndex) {
    return colorSequence[(currentIndex + 1) % colorSequence.length];
}

function animate() {
    fvdots.forEach((dot, index) => {
        dotConfigs[index].startIndex = (dotConfigs[index].startIndex + 1) % colorSequence.length;
        dot.style.backgroundColor = colorSequence[dotConfigs[index].startIndex];
    });
}

function startAnimation() {
    if (!animationInterval) {
        // Set initial colors
        fvdots.forEach((dot, index) => {
            dot.style.backgroundColor = dotConfigs[index].initialColor;
        });
        
        // Start the animation after a delay
        setTimeout(() => {
            animationInterval = setInterval(animate, DELAY);
        });
    }
}

function stopAnimation() {
    if (animationInterval) {
        clearInterval(animationInterval);
        animationInterval = null;
        
        // Reset to original colors and indices
        fvdots.forEach((dot, index) => {
            dot.style.backgroundColor = dotConfigs[index].initialColor;
            dotConfigs[index].startIndex = colorSequence.indexOf(dotConfigs[index].initialColor);
        });
    }
}

// Start the animation when the page loads
document.addEventListener('DOMContentLoaded', startAnimation);



// Header adds white fill //
const header = document.querySelector('.header');

// Get the height of the first section or viewport height
const firstSection = document.querySelector('section') || { offsetHeight: window.innerHeight };
const threshold = firstSection.offsetHeight;

function isMobile() {
    return window.matchMedia('(max-width: 1024px)').matches;
}

// Function to handle scroll
function handleScroll() {
    if (isMobile()) {
        if (window.scrollY > threshold) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }
    } else {
        // Remove the scrolled class on desktop regardless of scroll position
        header.classList.remove('header--scrolled');
    }
}

// Add scroll event listener
window.addEventListener('scroll', handleScroll);

// Add resize event listener to handle switching between mobile and desktop
window.addEventListener('resize', handleScroll);

// Run once on page load to set initial state
handleScroll();





// Ham menu //
document.addEventListener('DOMContentLoaded', function() {
    const hamburgerBtn = document.querySelector('.hamburger-menu');
    const header = document.querySelector('.header');
    const body = document.body;
    const mobileMenuLinks = document.querySelectorAll('.mobile-nav-links a');

    if (header && hamburgerBtn) {
        hamburgerBtn.addEventListener('click', function() {
            toggleMenu();
        });

        // Add click event listeners to all mobile menu links
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault(); // Prevent default scroll behavior
                
                // Get the target section id from the href
                const targetId = this.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    // First close the menu
                    toggleMenu();
                    
                    // Then instantly scroll to the section
                    window.scrollTo({
                        top: targetSection.offsetTop - header.offsetHeight,
                        behavior: "smooth"  // Use "instant" for no animation
                    });
                }
            });
        });
    }

    function toggleMenu() {
        header.classList.toggle('menu-open');
        
        if (header.classList.contains('menu-open')) {
            body.style.overflow = 'hidden';
        } else {
            body.style.overflow = '';
        }

        hamburgerBtn.setAttribute('aria-expanded', 
            hamburgerBtn.getAttribute('aria-expanded') === 'false' ? 'true' : 'false'
        );
    }
});


// Dots bouncing animation //
const dots = document.querySelectorAll('.problems-ttl .dot');

// Variable to track if animation is currently running
let isAnimating = false;

// Create intersection observer
const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !isAnimating) {
        // When section is visible and not currently animating
        animateDotsSequentially();
    } else if (!entries[0].isIntersecting) {
        // When section is out of view, reset dots
        resetDots();
    }
}, {
    threshold: 0.7 // Trigger when 50% of element is visible
});

// Observe the problems title section
const problemsSection = document.querySelector('.problems-ttl');
observer.observe(problemsSection);

// Function to animate dots one by one with overlap
function animateDotsSequentially() {
    isAnimating = true;
    const animationDuration = 600; // 1 second per animation
    const delay = animationDuration * 0.5; // Start next dot at 70% of previous animation
    
    dots.forEach((dot, index) => {
        setTimeout(() => {
            dot.classList.add('animate');
        }, delay * index);
    });

    // Calculate total animation duration and reset isAnimating flag
    const totalDuration = delay * (dots.length - 1) + animationDuration;
    setTimeout(() => {
        isAnimating = false;
    }, totalDuration);
}

// Function to reset dots by removing animation class
function resetDots() {
    dots.forEach(dot => {
        dot.classList.remove('animate');
    });
    isAnimating = false;
}


// Logo's color switching //
const logo = document.querySelector('.logo');
const aboutSection = document.querySelector('#about');

function isDesktop() {
    // Return true if screen width is larger than 768px (typical tablet/desktop breakpoint)
    // You can adjust this value to match your specific breakpoint
    return window.matchMedia('(min-width: 1024px)').matches;
}

function updateLogoColor() {
    // Only proceed if menu is not open AND we're on desktop
    if (!header.classList.contains('menu-open') && isDesktop()) {
        // Get the logo's position
        const logoRect = logo.getBoundingClientRect();
        const logoCenter = logoRect.top + logoRect.height / 2;
        
        // Get the about section's position
        const aboutRect = aboutSection.getBoundingClientRect();
        const aboutTop = aboutRect.top;
        const aboutBottom = aboutRect.bottom;
        
        // Check if logo is within the about section
        if (logoCenter >= aboutTop && logoCenter <= aboutBottom) {
            logo.classList.add('inverted');
        } else {
            logo.classList.remove('inverted');
        }
    } else if (!isDesktop()) {
        // Remove inverted class on mobile regardless of position
        logo.classList.remove('inverted');
    }
}

// Update on scroll
window.addEventListener('scroll', updateLogoColor);

// Update on resize to handle switching between mobile and desktop
window.addEventListener('resize', updateLogoColor);

// Initial check on page load
updateLogoColor();

// Optional: Update when menu closes
function onMenuToggle(isOpen) {
    if (!isOpen && isDesktop()) {
        // When menu closes, check if we need to update logo color (only on desktop)
        updateLogoColor();
    }
}



// Swipe Cards //
const swiper = new Swiper('.swiper', {
    slidesPerView: 'auto',
    spaceBetween: 16,
    centeredSlides: true,
    breakpoints: {
        1024: {
            enabled: false,
            slidesPerView: 2,
            width: 360, 
            slidesPerView: 'auto', // Let CSS control the width
            centeredSlides: false,
            spaceBetween: 72
        }
    }
});



// Functions Cards //
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.function-card');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentIndex = 0;
    let isMobile = window.innerWidth < 1024;

    // Touch handling variables
    let touchStartX = 0;
    let touchEndX = 0;
    const minSwipeDistance = 50; // Minimum distance for a swipe to register

    function showCard(index) {
        if (!isMobile) return;

        if (index < 0) {
            index = cards.length - 1;
        } else if (index >= cards.length) {
            index = 0;
        }

        currentIndex = index;

        cards.forEach((card, i) => {
            card.classList.toggle('active', i === currentIndex);
            card.style.display = ''; // Remove inline styles
        });
    }

    // Initialize
    function init() {
        isMobile = window.innerWidth < 1024;
        if (isMobile) {
            showCard(currentIndex);
        } else {
            cards.forEach(card => {
                card.classList.remove('active');
                card.style.display = ''; // Remove inline styles
            });
        }
    }

    // Swipe handlers
    function handleTouchStart(event) {
        touchStartX = event.touches[0].clientX;
    }

    function handleTouchMove(event) {
        // Prevent default scrolling when swiping
        event.preventDefault();
    }

    function handleTouchEnd(event) {
        touchEndX = event.changedTouches[0].clientX;
        handleSwipe();
    }

    function handleSwipe() {
        const swipeDistance = touchEndX - touchStartX;

        if (Math.abs(swipeDistance) > minSwipeDistance) {
            if (swipeDistance > 0) {
                // Swiped right - show previous card
                showCard(currentIndex - 1);
            } else {
                // Swiped left - show next card
                showCard(currentIndex + 1);
            }
        }
    }

    // Initialize on load
    init();

    // Add touch event listeners to the container
    const cardsContainer = cards[0].parentElement;
    cardsContainer.addEventListener('touchstart', handleTouchStart, false);
    cardsContainer.addEventListener('touchmove', handleTouchMove, { passive: false });
    cardsContainer.addEventListener('touchend', handleTouchEnd, false);

    // Navigation buttons
    prevBtn.addEventListener('click', () => showCard(currentIndex - 1));
    nextBtn.addEventListener('click', () => showCard(currentIndex + 1));

    // Debounced resize handler
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(init, 100);
    });
});


// Plan Photo Slider //
document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.plan-slide');
    let currentSlide = 0;
    let isMobile = window.innerWidth < 1024; // Adjust breakpoint as needed
    
    // Function to move to the next slide
    function nextSlide() {
        // Remove active class from current slide
        slides[currentSlide].classList.remove('plan-slide-active');
        
        if (isMobile) {
            // Vertical sliding for mobile
            slides[currentSlide].style.transform = 'translateY(-100%)';
        } else {
            // Horizontal sliding for desktop
            slides[currentSlide].style.transform = 'translateX(-100%)';
        }
        slides[currentSlide].style.opacity = '0';
        
        // Move to next slide
        currentSlide = (currentSlide + 1) % slides.length;
        
        // Add active class to new slide
        slides[currentSlide].style.transform = 'translateY(0)';
        slides[currentSlide].classList.add('plan-slide-active');
        slides[currentSlide].style.opacity = '1';
        
        // Prepare next slide
        const nextSlideIndex = (currentSlide + 1) % slides.length;
        if (isMobile) {
            slides[nextSlideIndex].style.transform = 'translateY(100%)';
        } else {
            slides[nextSlideIndex].style.transform = 'translateX(100%)';
        }
    }
    
    // Function to initialize slides
    function initializeSlides() {
        isMobile = window.innerWidth < 1024;
        
        slides.forEach((slide, index) => {
            if (index === 0) {
                slide.classList.add('plan-slide-active');
                slide.style.transform = 'translate(0)';
                slide.style.opacity = '1';
            } else {
                if (isMobile) {
                    slide.style.transform = 'translateY(100%)';
                } else {
                    slide.style.transform = 'translateX(100%)';
                }
                slide.style.opacity = '0';
            }
        });
    }
    
    // Initialize slides on load
    initializeSlides();
    
    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            initializeSlides();
        }, 250);
    });
    
    // Start automatic sliding
    setInterval(nextSlide, 3500);
});


// FAQ button //
document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
        const faqItem = button.parentElement;
        const isActive = faqItem.classList.contains('active');
        
        // Close all FAQ items
        document.querySelectorAll('.faq-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // If the clicked item wasn't active, open it
        if (!isActive) {
            faqItem.classList.add('active');
        }
    });
});



// Features rectangle color transition //
class ColorTransition {
    constructor() {
        this.rectangles = document.querySelectorAll('.rectangle-color');
        this.colors = [
            "linear-gradient(90deg, var(--color-white) 0%, var(--color-white) 100%)",  // Initial white "gradient"
            "linear-gradient(90deg, var(--color-white) 0%, var(--color-accent) 100%)", // White to lime gradient
            "linear-gradient(90deg, var(--color-white) 0%, var(--color-grey) 100%)"    // White to grey gradient
        ];
        
        // Initialize rectangles with different starting colors
        this.rectangles.forEach((rectangle, index) => {
            const startingColorIndex = index % this.colors.length;
            rectangle.style.background = this.colors[startingColorIndex];
            rectangle.dataset.currentIndex = startingColorIndex;
        });

        this.startTransition();
    }

    // Easing function for smooth animation
    easeInOutCubic(t) {
        return t < 0.5 
            ? 4 * t * t * t 
            : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    // Create interpolated gradient based on progress
    interpolateGradient(fromGradient, toGradient, progress) {
        let fromColor, toColor;
        
        if (fromGradient.includes('accent')) {
            fromColor = 'var(--color-accent)';
        } else if (fromGradient.includes('grey')) {
            fromColor = 'var(--color-grey)';
        } else {
            fromColor = 'var(--color-white)';
        }
        
        if (toGradient.includes('accent')) {
            toColor = 'var(--color-accent)';
        } else if (toGradient.includes('grey')) {
            toColor = 'var(--color-grey)';
        } else {
            toColor = 'var(--color-white)';
        }

        return `linear-gradient(90deg, var(--color-white) 0%, color-mix(in srgb, ${fromColor}, ${toColor} ${progress * 100}%) 100%)`;
    }

    animateColorTransition(rectangle, fromColorIndex, toColorIndex, duration) {
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = this.easeInOutCubic(progress);
            
            const fromGradient = this.colors[fromColorIndex];
            const toGradient = this.colors[toColorIndex];
            
            rectangle.style.background = this.interpolateGradient(fromGradient, toGradient, easedProgress);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    startTransition() {
        const transitionDuration = 1000; // Duration of each color transition
        const delayBetweenTransitions = 3000; // Time between color changes

        setInterval(() => {
            this.rectangles.forEach((rectangle, rectIndex) => {
                setTimeout(() => {
                    const currentIndex = parseInt(rectangle.dataset.currentIndex);
                    const nextIndex = (currentIndex + 1) % this.colors.length;
                    
                    this.animateColorTransition(
                        rectangle,
                        currentIndex,
                        nextIndex,
                        transitionDuration
                    );
                    
                    rectangle.dataset.currentIndex = nextIndex;
                }, rectIndex * 200); // Stagger the start of each rectangle's transition
            });
        }, delayBetweenTransitions);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ColorTransition();
});