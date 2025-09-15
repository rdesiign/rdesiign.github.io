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
    
    initializeComponents();
    initializeSlideshow();
    initializeNavigation();
    initializeContactForm();
    initializeGraphBackground();
    initializeBlueprintCursor();
    
    } catch (error) {
        console.error('Error in main initialization:', error);
    }
});

function initializeComponents() {
    initializeTheme();
}

// Theme toggle functionality
function initializeTheme() {
    // Check for saved theme or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    // Set up theme toggle button event listener
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
    
    // Dispatch a custom event to notify other components of theme change
    const event = new CustomEvent('themeChange', { detail: newTheme });
    window.dispatchEvent(event);
}

function updateThemeIcon(theme) {
    const themeIcon = document.getElementById('theme-icon');
    if (themeIcon) {
        // Show sun for light theme, moon for dark theme
        themeIcon.textContent = theme === 'dark' ? '🌙' : '☀️';
    }
}

// Slideshow functionality
let slideIndex = 0;
let slideInterval;

function initializeSlideshow() {
    showSlides();
    startSlideShow();
}

function startSlideShow() {
    slideInterval = setInterval(() => {
        changeSlide(1);
    }, 3000); // Change slide every 3 seconds (updated from 2500ms)
}

function stopSlideShow() {
    clearInterval(slideInterval);
}

function changeSlide(n) {
    stopSlideShow();
    slideIndex += n;
    showSlides();
    startSlideShow();
}

function currentSlide(n) {
    stopSlideShow();
    slideIndex = n - 1;
    showSlides();
    startSlideShow();
}

function showSlides() {
    const slides = document.getElementsByClassName("slide");
    const dots = document.getElementsByClassName("dot");
    
    // Handle index boundaries
    if (slideIndex >= slides.length) {slideIndex = 0}
    if (slideIndex < 0) {slideIndex = slides.length - 1}
    
    // Hide all slides
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    
    // Remove active class from all dots
    for (let i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    
    // Show current slide and activate corresponding dot
    slides[slideIndex].style.display = "block";
    dots[slideIndex].className += " active";
}

// Navigation functionality
function initializeNavigation() {
    // Initialize navigation highlighting
    updateNav();
    
    // Scroll handler for navigation
    let scrollTimer;
    window.addEventListener('scroll', function() {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(updateNav, 50);
    });
    
    // Also update navigation when window is resized
    window.addEventListener('resize', function() {
        setTimeout(updateNav, 100);
    });
    
    // Click handlers for navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('data-section');
            const section = document.getElementById(sectionId);
            
            if (section) {
                let offset = 0;
                if (sectionId !== 'home') {
                    const navbarHeight = document.querySelector('.floating-navbar').offsetHeight;
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
    });
    
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
    // Get scroll position - using viewport middle for better detection
    const scrollPos = window.scrollY + window.innerHeight / 3;
    
    // Get all nav links and remove active class
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    
    // Get sections
    const homeSection = document.getElementById('home');
    const aboutSection = document.getElementById('about');
    const projectsSection = document.getElementById('projects');
    const experienceSection = document.getElementById('experience');
    const contactSection = document.getElementById('contact');
    
    // Determine active section based on scroll position
    let activeSection = 'home';
    
    // Check sections from bottom to top for better accuracy
    if (contactSection && scrollPos >= contactSection.offsetTop) {
        activeSection = 'contact';
    } else if (experienceSection && scrollPos >= experienceSection.offsetTop) {
        activeSection = 'experience';
    } else if (projectsSection && scrollPos >= projectsSection.offsetTop) {
        activeSection = 'projects';
    } else if (aboutSection && scrollPos >= aboutSection.offsetTop) {
        activeSection = 'about';
    }
    
    // Activate the correct nav link
    const activeLink = document.querySelector(`.nav-link[data-section="${activeSection}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

// Contact form functionality
function initializeContactForm() {
}

// Project card hover effects
document.addEventListener('DOMContentLoaded', function() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});

// Graph paper background with cursor interaction
function initializeGraphBackground() {
    const body = document.body;
    
    document.addEventListener('mousemove', function(e) {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        // Create a subtle parallax effect on the graph background
        const xOffset = (x - 0.5) * 10;
        const yOffset = (y - 0.5) * 10;
        
        body.style.backgroundPosition = `${xOffset}px ${yOffset}px`;
    });
}

// Blueprint cursor with trails and rolling effect
function initializeBlueprintCursor() {
    // Create cursor elements
    const cursor = document.createElement('div');
    cursor.className = 'cursor';
    
    const cursorInner = document.createElement('div');
    cursorInner.className = 'cursor-inner';
    
    cursor.appendChild(cursorInner);
    document.body.appendChild(cursor);
    
    // Track mouse movement
    document.addEventListener('mousemove', function(e) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        
        // Create trail effect
        createTrail(e.clientX, e.clientY);
    });
    
    // Click effect
    document.addEventListener('click', function(e) {
        createRollUpEffect();
    });
    
    // Hide cursor when leaving window
    document.addEventListener('mouseleave', function() {
        cursor.style.opacity = '0';
    });
    
    document.addEventListener('mouseenter', function() {
        cursor.style.opacity = '1';
    });
    
    // Add special effects for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .project-card, .nav-link');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
        });
        
        element.addEventListener('mouseleave', function() {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });
}

function createTrail(x, y) {
    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    trail.style.left = x + 'px';
    trail.style.top = y + 'px';
    
    document.body.appendChild(trail);
    
    // Add active class for animation
    setTimeout(() => {
        trail.classList.add('active');
    }, 10);
    
    // Remove trail after animation
    setTimeout(() => {
        trail.remove();
    }, 1000);
}

function createRollUpEffect() {
    const rollUp = document.createElement('div');
    rollUp.className = 'roll-up';
    document.body.appendChild(rollUp);
    
    // Add active class for animation
    setTimeout(() => {
        rollUp.classList.add('active');
    }, 10);
    
    // Remove element after animation
    setTimeout(() => {
        rollUp.remove();
    }, 1000);
}