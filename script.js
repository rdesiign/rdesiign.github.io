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
    initializeContactForm();
    initializeGraphBackground();
    initializeShowreelBanner(); // Add this line
    initializeNavigation(); // Add navigation initialization
    
    } catch (error) {
        console.error('Error in main initialization:', error);
    }
});

// Add this new function for handling the showreel banner
function initializeShowreelBanner() {
    // Handle the banner image
    const bannerImage = document.querySelector('.showreel-image');
    if (bannerImage) {
        // Ensure the image is visible
        bannerImage.style.display = 'block';
        
        // Add load event to confirm image is loaded
        bannerImage.addEventListener('load', function() {
            console.log('Banner image loaded successfully');
            // Ensure the image is properly positioned
            bannerImage.style.opacity = '1';
        });
        
        // Handle error case
        bannerImage.addEventListener('error', function(e) {
            console.log('Banner image failed to load', e);
            // Try to show the fallback image if available
            const fallbackImage = document.querySelector('.showreel-image-fallback');
            if (fallbackImage) {
                fallbackImage.style.display = 'block';
            }
        });
        
        // Preload the image to ensure it displays
        const img = new Image();
        img.src = bannerImage.src;
        img.onload = function() {
            console.log('Banner image preloaded successfully');
            bannerImage.style.opacity = '1';
        };
    }
    
    // Also handle the fallback image
    const fallbackImage = document.querySelector('.showreel-image-fallback');
    if (fallbackImage) {
        fallbackImage.addEventListener('load', function() {
            console.log('Fallback banner image loaded successfully');
        });
    }
}

function initializeComponents() {
    // Initialize theme functionality
    initializeTheme();
}

// Navigation functionality
function initializeNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navClose = document.getElementById('nav-close');
    const expandedNav = document.getElementById('expanded-nav');
    
    // Initially hide the nav-close button
    if (navClose) {
        navClose.style.display = 'none';
    }
    
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            // Toggle navigation visibility
            if (expandedNav.style.display === 'none' || expandedNav.style.display === '') {
                // Expand navigation
                expandedNav.style.display = 'flex';
                // Hide the nav toggle button
                navToggle.style.display = 'none';
                // Show the nav close button
                if (navClose) {
                    navClose.style.display = 'flex';
                }
            }
        });
    }
    
    if (navClose) {
        navClose.addEventListener('click', function() {
            // Collapse navigation
            expandedNav.style.display = 'none';
            // Show the nav toggle button
            if (navToggle) {
                navToggle.style.display = 'flex';
            }
            // Hide the nav close button
            navClose.style.display = 'none';
        });
    }
    
    // Close navigation when clicking outside
    document.addEventListener('click', function(event) {
        if (expandedNav && expandedNav.style.display === 'flex') {
            const isClickInsideNav = navToggle.contains(event.target) || 
                                   (navClose && navClose.contains(event.target)) || 
                                   expandedNav.contains(event.target);
            if (!isClickInsideNav) {
                expandedNav.style.display = 'none';
                // Show the nav toggle button
                if (navToggle) {
                    navToggle.style.display = 'flex';
                }
                // Hide the nav close button
                if (navClose) {
                    navClose.style.display = 'none';
                }
            }
        }
    });
    
    // Add scroll event listener for navigation highlighting (only on index.html)
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        window.addEventListener('scroll', highlightNavigation);
        
        // Initial highlight check
        highlightNavigation();
    }
    
    // Add smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Only prevent default for anchor links on the same page
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    // Remove active class from all links
                    document.querySelectorAll('.nav-link').forEach(link => {
                        link.classList.remove('active');
                    });
                    
                    // Add active class to clicked link
                    this.classList.add('active');
                    
                    // Scroll to section
                    window.scrollTo({
                        top: targetSection.offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// Function to highlight navigation based on scroll position (only for index.html)
function highlightNavigation() {
    // Only run on index.html
    if (!window.location.pathname.includes('index.html') && window.location.pathname !== '/') {
        return;
    }
    
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollPos = window.scrollY + 200; // Offset for better highlighting
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        // Special handling for intro section
        if (sectionId === 'intro') {
            // For intro section, highlight when at the top of the page
            if (scrollPos <= sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#intro' || link.textContent === 'Home') {
                        link.classList.add('active');
                    }
                });
            }
        } 
        // For other sections
        else if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Theme toggle functionality
function initializeTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const mobileThemeToggle = document.getElementById('mobile-theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'dark';
    
    // Set the initial theme
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    // Update icon based on current theme
    updateThemeIcon(currentTheme);
    
    // Function to toggle theme
    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // Update the theme
        document.documentElement.setAttribute('data-theme', newTheme);
        
        // Update the icon
        updateThemeIcon(newTheme);
        
        // Save the theme to localStorage
        localStorage.setItem('theme', newTheme);
    }
    
    // Add event listener to desktop theme toggle
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Add event listener to mobile theme toggle
    if (mobileThemeToggle) {
        mobileThemeToggle.addEventListener('click', toggleTheme);
    }
}

// Function to update theme icon based on current theme
function updateThemeIcon(theme) {
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');
    
    if (theme === 'light') {
        if (sunIcon) sunIcon.style.display = 'none';
        if (moonIcon) moonIcon.style.display = 'block';
    } else {
        if (sunIcon) sunIcon.style.display = 'block';
        if (moonIcon) moonIcon.style.display = 'none';
    }
}

// Contact form functionality
function initializeContactForm() {
}

// Project card hover effects removed as per user request

// Graph paper background with cursor interaction
function initializeGraphBackground() {
    const body = document.body;
    
    // Removed parallax effect on background to prevent dots from disappearing when scrolling
    // Also removed because we're now using a solid color background
}

// Typing animation for About section - CURSOR BLINKS AT END & PROFILE PICTURE TRIGGER
let aboutAnimationStarted = false;

// Typing animation for Intro section
let introAnimationStarted = false;
let hasScrolled = false; // Track if user has scrolled

// Function to trigger intro animation directly
function triggerIntroAnimation() {
    console.log('triggerIntroAnimation called');
    // Since we've removed the typing animation, we just need to ensure the content is visible
    const introSection = document.getElementById('intro');
    if (introSection) {
        introSection.style.opacity = '1';
    }
    
    // Mark as started so we don't try to run it again
    introAnimationStarted = true;
}

// Add location and status content (blinking dot, etc.)
function addLocationAndStatusContent() {
    // This function is called after the typing animation is complete
    // It adds the blinking dot and other dynamic content
    const heading2 = document.querySelector('#intro-typewriter h2');
    if (heading2) {
        // Ensure the blinking dot is visible
        const blinkingDot = heading2.querySelector('.blinking-dot');
        if (blinkingDot) {
            blinkingDot.style.opacity = '1';
        }
        
        // Ensure the location text is visible
        const locationText = heading2.querySelector('.location-text');
        if (locationText) {
            locationText.style.opacity = '1';
        }
    }
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

// Check if intro section is in viewport
function isIntroSectionInViewport() {
    const introSection = document.getElementById('intro');
    if (introSection) {
        const rect = introSection.getBoundingClientRectBoundingClientRect();
        const inViewport = (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.bottom >= 0
        );
        // console.log('Intro section in viewport:', inViewport);
        // console.log('Intro section rect:', rect);
        return inViewport;
    }
    // console.log('Intro section not found');
    return false;
}

// Scroll event listener to trigger animation when intro section is visible AND user has scrolled
function checkIntroSectionVisibility() {
    // Check if user has scrolled before triggering animation
    if (hasScrolled && isIntroSectionInViewport() && !introAnimationStarted) {
        // Call the trigger function instead of duplicating logic
        triggerIntroAnimation();
    }
}

// Add scroll listener for intro section visibility
window.addEventListener('scroll', function() {
    // Set hasScrolled to true when user scrolls
    if (!hasScrolled) {
        hasScrolled = true;
    }
    // Check if intro section is visible
    checkIntroSectionVisibility();
});

// Scroll event listener to trigger animation when profile picture is visible
function checkProfilePictureVisibility() {
    // Only run on pages other than about.html
    if (window.location.pathname.includes('about.html')) {
        return;
    }
    
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
                
                // Make content visible since we removed the typing animation
                heading.style.opacity = '1';
                paragraph.style.opacity = '1';
                button.style.opacity = '1';
                
                aboutAnimationStarted = true;
            }
        }
    }
}

// Initialize animations with a 1-second delay
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM content loaded, setting up intro animation');
    // Start intro section animation after 1 second delay
    setTimeout(function() {
        console.log('1 second delay completed, triggering intro animation');
        // Only run these functions on pages other than about.html
        if (!window.location.pathname.includes('about.html')) {
            // Set hasScrolled to true to ensure animation triggers
            hasScrolled = true;
            // Trigger the animation directly without scroll listener conflicts
            if (!introAnimationStarted) {
                triggerIntroAnimation();
            }
        }
    }, 1000); // 1 second delay before starting the animation
});