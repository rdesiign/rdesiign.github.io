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
    initializeContactForm();
    
    } catch (error) {
        console.error('Error in main initialization:', error);
    }
});

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
    }, 5000); // Change slide every 5 seconds
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
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // In a real implementation, you would send this data to a server
            // For now, we'll just show an alert
            alert(`Thank you for your message, ${name}! I'll get back to you soon.`);
            
            // Reset form
            contactForm.reset();
        });
    }
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