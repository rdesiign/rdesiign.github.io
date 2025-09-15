// Service Worker Cleanup
(function() {
    'use strict';
    
    // Unregister any existing service workers to prevent loading loops
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(function(registrations) {
            for(let registration of registrations) {
                registration.unregister();
            }
        }).catch(function(error) {
            console.log('Service worker cleanup error:', error);
        });
    }
})();

// Main app initialization
document.addEventListener('DOMContentLoaded', function() {
    console.log('Main app initialization');
    
    // Production environment setup
    try {
    
    // Prevent browser from restoring scroll position
    if (history.scrollRestoration) {
        history.scrollRestoration = 'manual';
    }
    
    // Force scroll to top immediately
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    // Remove no-js class as JavaScript is working
    document.documentElement.classList.remove('no-js');
    
    // Initialize components
    initializeTheme();
    initializeSlideshow();
    initializeNavigation();
    
    } catch (error) {
        console.error('Error in main initialization:', error);
    }
});

// Theme toggle functionality
function initializeTheme() {
    console.log('Initializing theme');
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    // Set up theme toggle button event listener
    const themeToggle = document.getElementById('theme-toggle');
    console.log('Theme toggle element:', themeToggle);
    if (themeToggle) {
        // Remove any existing event listeners to prevent duplicates
        themeToggle.removeEventListener('click', handleThemeToggle);
        themeToggle.addEventListener('click', handleThemeToggle);
        console.log('Theme toggle event listener added');
    } else {
        console.log('Theme toggle element not found');
    }
}

function handleThemeToggle(e) {
    console.log('Theme toggle clicked');
    toggleTheme();
}

function toggleTheme() {
    console.log('Toggling theme');
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    console.log('Current theme:', currentTheme, 'New theme:', newTheme);
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
    
    // Dispatch a custom event to notify other components of theme change
    const event = new CustomEvent('themeChange', { detail: newTheme });
    window.dispatchEvent(event);
}

function updateThemeIcon(theme) {
    console.log('Updating theme icon for theme:', theme);
    const themeIcon = document.getElementById('theme-icon');
    if (themeIcon) {
        // Show sun for dark theme (to switch to light), moon for light theme (to switch to dark)
        themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
        console.log('Theme icon updated to:', themeIcon.textContent);
    } else {
        console.log('Theme icon element not found');
    }
}

// Navigation functionality
function initializeNavigation() {
    console.log('Initializing navigation');
    // Initialize navigation highlighting
    updateNav();
    
    // Scroll handler for navigation
    var scrollTimer;
    window.addEventListener('scroll', function() {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(updateNav, 50);
    });
    
    // Also update navigation when window is resized
    window.addEventListener('resize', function() {
        setTimeout(updateNav, 100);
    });
    
    // Click handlers for navigation links
    var navLinks = document.querySelectorAll('.nav-link');
    console.log('Found nav links:', navLinks.length);
    for (var i = 0; i < navLinks.length; i++) {
        navLinks[i].addEventListener('click', function(e) {
            e.preventDefault();
            var sectionId = this.getAttribute('data-section');
            console.log('Nav link clicked:', sectionId);
            var section = document.getElementById(sectionId);
            
            if (section) {
                var offset = 0;
                if (sectionId !== 'home') {
                    var navbarHeight = document.querySelector('.floating-navbar').offsetHeight;
                    offset = section.offsetTop - navbarHeight - 20;
                }
                
                window.scrollTo({
                    top: offset,
                    behavior: 'smooth'
                });
                
                // Update navigation after scrolling
                setTimeout(updateNav, 100);
            }
        });
    }
    
    // Listen for theme changes to update navigation styling
    window.addEventListener('themeChange', function() {
        // Update navigation background based on theme
        const navbar = document.querySelector('.floating-navbar');
        if (navbar) {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            if (currentTheme === 'dark') {
                navbar.style.background = 'rgba(0, 0, 0, 0.1)';
                navbar.style.border = '1px solid rgba(255, 255, 255, 0.1)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.1)';
                navbar.style.border = '1px solid rgba(0, 0, 0, 0.1)';
            }
        }
    });
}

function updateNav() {
    // Get scroll position
    var scrollPos = window.scrollY + 100; // Add offset to detect sections early
    
    // Get all nav links and remove active class
    var navLinks = document.querySelectorAll('.nav-link');
    for (var i = 0; i < navLinks.length; i++) {
        navLinks[i].classList.remove('active');
    }
    
    // Get sections
    var homeSection = document.getElementById('home');
    var aboutSection = document.getElementById('about');
    var experienceSection = document.getElementById('experience');
    var contactSection = document.getElementById('contact');
    
    // Determine active section based on scroll position
    var activeSection = 'home'; // default
    
    // Check sections from bottom to top for better accuracy
    if (contactSection && scrollPos >= contactSection.offsetTop) {
        activeSection = 'contact';
    } else if (experienceSection && scrollPos >= experienceSection.offsetTop) {
        activeSection = 'experience';
    } else if (aboutSection && scrollPos >= aboutSection.offsetTop) {
        activeSection = 'about';
    }
    
    // Activate the correct nav link
    var activeLink = document.querySelector('.nav-link[data-section="' + activeSection + '"]');
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

// Slideshow functionality
let currentSlideIndex = 0;
let slideInterval;

window.changeSlide = function(n) {
    currentSlideIndex += n;
    showSlide(currentSlideIndex);
    resetAutoSlide();
};

window.currentSlide = function(n) {
    currentSlideIndex = n - 1;
    showSlide(currentSlideIndex);
    resetAutoSlide();
};

window.toggleTheme = toggleTheme;

function initializeSlideshow() {
    showSlide(currentSlideIndex);
    
    // Add touch gesture support
    initializeTouchGestures();
    
    // Start auto-slide
    startAutoSlide();
    
    // Pause auto-slide on hover
    const slideshowContainer = document.querySelector('.slideshow-container');
    if (slideshowContainer) {
        slideshowContainer.addEventListener('mouseenter', stopAutoSlide);
        slideshowContainer.addEventListener('mouseleave', startAutoSlide);
    }
}

function showSlide(n) {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.nav-dot');
    
    if (slides.length === 0) return;
    
    if (n >= slides.length) currentSlideIndex = 0;
    if (n < 0) currentSlideIndex = slides.length - 1;
    
    // Remove active class from all slides and dots
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    // Add active class to current slide and dot
    if (slides[currentSlideIndex]) {
        slides[currentSlideIndex].classList.add('active');
    }
    if (dots[currentSlideIndex]) {
        dots[currentSlideIndex].classList.add('active');
    }
}

function startAutoSlide() {
    slideInterval = setInterval(() => {
        currentSlideIndex++;
        showSlide(currentSlideIndex);
    }, 5000);
}

function stopAutoSlide() {
    if (slideInterval) {
        clearInterval(slideInterval);
    }
}

function resetAutoSlide() {
    stopAutoSlide();
    startAutoSlide();
}

// Touch gesture support for mobile slideshow
function initializeTouchGestures() {
    const slideshowContainer = document.querySelector('.slideshow-container');
    if (!slideshowContainer) return;
    
    let startX = 0;
    let endX = 0;
    const minSwipeDistance = 50;
    
    slideshowContainer.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
        stopAutoSlide();
    }, { passive: true });
    
    slideshowContainer.addEventListener('touchend', function(e) {
        endX = e.changedTouches[0].clientX;
        const deltaX = endX - startX;
        
        if (Math.abs(deltaX) > minSwipeDistance) {
            if (deltaX > 0) {
                changeSlide(-1); // Swipe right
            } else {
                changeSlide(1);  // Swipe left
            }
        }
        
        startAutoSlide();
    }, { passive: true });
}