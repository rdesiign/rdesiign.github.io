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

// Preload critical images
function preloadImages() {
    const imagesToPreload = [
        'Projects/MMM/MMM8.png',
        'Projects/MMM/MMM1.png',
        'Assets/Profile raw 4.jpg'
    ];
    
    imagesToPreload.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

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
    
    // Preload critical images
    preloadImages();
    
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

// Slideshow functionality with performance optimizations
let slideIndex = 0;
let slideInterval;
let slidesLoaded = false;

function initializeSlideshow() {
    // Preload slideshow images
    const slideImages = document.querySelectorAll('.slide-image');
    let loadedCount = 0;
    
    slideImages.forEach(slide => {
        const bgImage = slide.style.backgroundImage;
        if (bgImage && bgImage.includes('url')) {
            const url = bgImage.match(/url\(['"]?(.*?)['"]?\)/)[1];
            const img = new Image();
            img.onload = function() {
                loadedCount++;
                if (loadedCount === slideImages.length) {
                    slidesLoaded = true;
                    showSlides();
                    startSlideShow();
                }
            };
            img.src = url;
        }
    });
    
    // Fallback in case images fail to load
    setTimeout(() => {
        if (!slidesLoaded) {
            showSlides();
            startSlideShow();
        }
    }, 3000);
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
        
        // Create a subtle parallax effect on the dotted background
        const xOffset = (x - 0.5) * 5;
        const yOffset = (y - 0.5) * 5;
        
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
    const interactiveElements = document.querySelectorAll('a, button, .project-card, .nav-link, img, .project-image, .profile-image, .btn');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            cursor.classList.add('target');
            cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
            // Ensure cursor stays orange
            cursor.style.borderColor = '#ff6b35';
            cursorInner.style.backgroundColor = '#ff6b35';
        });
        
        element.addEventListener('mouseleave', function() {
            cursor.classList.remove('target');
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            // Ensure cursor stays orange
            cursor.style.borderColor = '#ff6b35';
            cursorInner.style.backgroundColor = '#ff6b35';
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

// Typing animation for About section - CURSOR BLINKS AT END & PROFILE PICTURE TRIGGER
let aboutAnimationStarted = false;

function typeTextMovingCursor(elements, texts, cursorElement, duration) {
    const [heading, paragraph, button] = elements;
    const [headingText, paragraphText, buttonText] = texts;
    
    // Calculate timing for each element
    const totalLength = headingText.length + paragraphText.length + buttonText.length;
    const headingDuration = (headingText.length / totalLength) * duration;
    const paragraphDuration = (paragraphText.length / totalLength) * duration;
    const buttonDuration = (buttonText.length / totalLength) * duration;
    
    let headingIndex = 0;
    let paragraphIndex = 0;
    let buttonIndex = 0;
    
    // Type heading
    function typeHeading() {
        if (headingIndex < headingText.length) {
            // Move cursor to current element
            if (cursorElement.parentNode !== heading) {
                if (cursorElement.parentNode) cursorElement.parentNode.removeChild(cursorElement);
                heading.appendChild(cursorElement);
            }
            
            heading.textContent = headingText.substring(0, headingIndex);
            heading.appendChild(cursorElement);
            headingIndex++;
            setTimeout(typeHeading, headingDuration / headingText.length);
        } else {
            heading.textContent = headingText;
            setTimeout(typeParagraph, 0);
        }
    }
    
    // Type paragraph
    function typeParagraph() {
        if (paragraphIndex < paragraphText.length) {
            // Move cursor to current element
            if (cursorElement.parentNode !== paragraph) {
                if (cursorElement.parentNode) cursorElement.parentNode.removeChild(cursorElement);
                paragraph.appendChild(cursorElement);
            }
            
            paragraph.textContent = paragraphText.substring(0, paragraphIndex);
            paragraph.appendChild(cursorElement);
            paragraphIndex++;
            setTimeout(typeParagraph, paragraphDuration / paragraphText.length);
        } else {
            paragraph.textContent = paragraphText;
            setTimeout(typeButton, 0);
        }
    }
    
    // Type button - with special handling to ensure all characters display
    function typeButton() {
        if (buttonIndex < buttonText.length) {
            // Move cursor to current element
            if (cursorElement.parentNode !== button) {
                if (cursorElement.parentNode) cursorElement.parentNode.removeChild(cursorElement);
                button.appendChild(cursorElement);
            }
            
            // Ensure we're properly setting the text content
            const currentText = buttonText.substring(0, buttonIndex);
            button.textContent = currentText;
            button.appendChild(cursorElement);
            buttonIndex++;
            setTimeout(typeButton, buttonDuration / buttonText.length);
        } else {
            // Animation complete - ensure the full text is displayed
            button.textContent = buttonText;
            
            // Position cursor at the end of the paragraph (after "ideas") and ensure it continues blinking
            if (cursorElement.parentNode) cursorElement.parentNode.removeChild(cursorElement);
            // Make sure we're appending to the right element - it should be at the end of the paragraph
            paragraph.appendChild(cursorElement);
            
            // Ensure cursor is visible and blinking at the end
            cursorElement.style.display = 'inline-block';
            cursorElement.style.visibility = 'visible';
            
            // Make sure the blinking animation continues by ensuring the class is present
            if (!cursorElement.classList.contains('blinking-cursor')) {
                cursorElement.classList.add('blinking-cursor');
            }
            
            // Ensure the animation is not paused
            cursorElement.style.animationPlayState = 'running';
        }
    }
    
    // Start the animation
    typeHeading();
}

// Check if profile picture is in viewport
function isProfilePictureInViewport() {
    const profilePicture = document.querySelector('.profile-image');
    if (profilePicture) {
        const rect = profilePicture.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.bottom >= 0
        );
    }
    return false;
}

// Scroll event listener to trigger animation when profile picture is visible
function checkProfilePictureVisibility() {
    if (isProfilePictureInViewport() && !aboutAnimationStarted) {
        const typewriterContainer = document.getElementById('about-typewriter');
        if (typewriterContainer) {
            const heading = typewriterContainer.querySelector('h3');
            const paragraph = typewriterContainer.querySelector('p');
            const button = typewriterContainer.querySelector('a');
            
            if (heading && paragraph && button) {
                // Store original content
                const originalHeading = heading.textContent;
                const originalParagraph = paragraph.textContent;
                const originalButton = "Download my CV"; // Explicitly set the button text to ensure the "V" is included
                
                // Clear content
                heading.textContent = '';
                paragraph.textContent = '';
                button.textContent = '';
                
                // Show elements
                heading.style.opacity = '1';
                paragraph.style.opacity = '1';
                button.style.opacity = '1';
                
                // Create cursor element
                const cursorElement = document.createElement('span');
                cursorElement.className = 'blinking-cursor';
                heading.appendChild(cursorElement);
                
                // Start typing animation for 3 seconds
                typeTextMovingCursor(
                    [heading, paragraph, button], 
                    [originalHeading, originalParagraph, originalButton], 
                    cursorElement, 
                    3000
                );
                
                aboutAnimationStarted = true;
            }
        }
    }
}

// Initialize scroll listener
document.addEventListener('DOMContentLoaded', function() {
    // Add scroll event listener
    window.addEventListener('scroll', checkProfilePictureVisibility);
    
    // Check on initial load in case already in view
    setTimeout(checkProfilePictureVisibility, 1000);
});

// Add functionality for the animated arrow to scroll to projects section
document.addEventListener('DOMContentLoaded', function() {
    const arrow = document.getElementById('arrow-down');
    arrow.addEventListener('click', function(e) {
        e.preventDefault();
        const projectsSection = document.getElementById('projects');
        if (projectsSection) {
            const navbarHeight = document.querySelector('.floating-navbar').offsetHeight;
            const offset = projectsSection.offsetTop - navbarHeight - 20;
            
            window.scrollTo({
                top: offset,
                behavior: 'smooth'
            });
        }
    });
});
