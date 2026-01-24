



// Temporarily disable service worker for debugging
(function() {
    'use strict';
    
    // Unregister any existing service workers to prevent interference
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(function(registrations) {
            for(let registration of registrations) {
                console.log(' unregistering service worker:', registration);
                registration.unregister();
            }
        }).catch(function(error) {
            console.log('Service worker cleanup error:', error);
        });
    }
    
    // Clear all caches for debugging
    if ('caches' in window) {
        caches.keys().then(function(cacheNames) {
            cacheNames.forEach(function(cacheName) {
                console.log('Clearing cache:', cacheName);
                caches.delete(cacheName);
            });
        });
    }
})();

// Preload critical images with error handling
function preloadImages() {
    const imagesToPreload = [
        'Projects/MMM/MMM8.png',
        'Projects/MMM/MMM1.png',
        'Assets/Profile raw 4.jpg'
    ];
    
    imagesToPreload.forEach(src => {
        const img = new Image();
        img.onload = function() {
            console.log('Image loaded successfully:', src);
        };
        img.onerror = function() {
            console.error('Failed to load image:', src);
        };
        img.src = src;
    });
}

// Aggressive image optimization for slow connections
function optimizeImagesForPerformance() {
    // Reduce image quality for initial load
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        // Add loading attributes if missing
        if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
        }
        
        // Add decoding hint
        img.setAttribute('decoding', 'async');
        
        // For large images, consider using lower quality versions
        const src = img.getAttribute('src');
        if (src && (src.includes('Semi') || src.includes('MMM'))) {
            // Could implement WebP conversion or quality reduction here
            console.log('Optimizing image:', src);
        }
    });
}

// Enhanced lazy loading with timeout fallback
function enhancedLazyLoad() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                // Add slight delay to prevent layout shift
                setTimeout(() => {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    img.classList.add('loaded');
                }, 100);
            }
        });
    }, {
        rootMargin: '50px 0px', // Start loading 50px before entering viewport
        threshold: 0.01
    });
    
    images.forEach(img => imageObserver.observe(img));
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
            
    // Initialize performance optimizations
    optimizeImagesForPerformance();
            
    // Initialize enhanced lazy loading
    enhancedLazyLoad();
    
    
    
    // Initialize components
    initializeComponents();
            
    initializeContactForm();
            
    initializeGraphBackground();
            
    initializeShowreelBanner();
            
    initializeNavigation();
    
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
    
    console.log('=== INITIALIZING THEME ===');
    console.log('Current theme from localStorage:', currentTheme);
    
    // Set the initial theme
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    // Update icon based on current theme
    updateThemeIcon(currentTheme);
    
    // Add manual test function to window for debugging
    window.testThemeIcons = function() {
        console.log('=== MANUAL THEME ICON TEST (SVG VERSION) ===');
        const sunIcons = document.querySelectorAll('.sun-icon');
        const moonIcons = document.querySelectorAll('.moon-icon');
        
        console.log('Sun icons found:', sunIcons.length);
        console.log('Moon icons found:', moonIcons.length);
        
        sunIcons.forEach((icon, index) => {
            console.log(`Sun icon ${index}:`, {
                display: icon.style.display,
                computedDisplay: window.getComputedStyle(icon).display,
                visibility: window.getComputedStyle(icon).visibility,
                opacity: window.getComputedStyle(icon).opacity
            });
        });
        
        moonIcons.forEach((icon, index) => {
            console.log(`Moon icon ${index}:`, {
                display: icon.style.display,
                computedDisplay: window.getComputedStyle(icon).display,
                visibility: window.getComputedStyle(icon).visibility,
                opacity: window.getComputedStyle(icon).opacity
            });
        });
    };
    
    // Function to toggle theme
    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        console.log('=== TOGGLING THEME ===');
        console.log('Current theme:', currentTheme);
        console.log('New theme:', newTheme);
        
        // Update the theme
        document.documentElement.setAttribute('data-theme', newTheme);
        
        // Update the icon
        updateThemeIcon(newTheme);
        
        // Save the theme to localStorage
        localStorage.setItem('theme', newTheme);
    }
    
    // Add event listener to desktop theme toggle
    if (themeToggle) {
        console.log('Adding event listener to theme toggle');
        themeToggle.addEventListener('click', toggleTheme);
    } else {
        console.log('Theme toggle element not found!');
    }
    
    // Add event listener to mobile theme toggle
    if (mobileThemeToggle) {
        mobileThemeToggle.addEventListener('click', toggleTheme);
    }
    
    // Run initial test after a short delay
    setTimeout(() => {
        console.log('=== INITIAL PAGE LOAD TEST ===');
        window.testThemeIcons();
    }, 500);
}

// Function to update theme icon based on current theme
function updateThemeIcon(theme) {
    // Select all theme toggle icons to ensure we catch both desktop and mobile
    const sunIcons = document.querySelectorAll('.sun-icon');
    const moonIcons = document.querySelectorAll('.moon-icon');
    
    console.log('=== THEME ICON UPDATE (SVG VERSION) ===');
    console.log('Updating theme icons for theme:', theme);
    console.log('Found sun icons:', sunIcons.length);
    console.log('Found moon icons:', moonIcons.length);
    
    // First, make sure all icons are visible by default
    sunIcons.forEach((icon, index) => {
        if (icon) {
            console.log(`Sun icon ${index} before: display=${icon.style.display}, visibility=${window.getComputedStyle(icon).visibility}`);
            icon.style.display = 'block';
            icon.style.visibility = 'visible';
            console.log(`Sun icon ${index} after: display=${icon.style.display}, visibility=${window.getComputedStyle(icon).visibility}`);
        }
    });
    
    moonIcons.forEach((icon, index) => {
        if (icon) {
            console.log(`Moon icon ${index} before: display=${icon.style.display}, visibility=${window.getComputedStyle(icon).visibility}`);
            icon.style.display = 'block';
            icon.style.visibility = 'visible';
            console.log(`Moon icon ${index} after: display=${icon.style.display}, visibility=${window.getComputedStyle(icon).visibility}`);
        }
    });
    
    // Then apply theme-specific visibility
    if (theme === 'light') {
        // In light mode, show moon icon and hide sun icon
        sunIcons.forEach((icon, index) => {
            if (icon) {
                icon.style.display = 'none';
                icon.style.visibility = 'hidden';
                console.log(`Hiding sun icon ${index} in light mode`);
            }
        });
        moonIcons.forEach((icon, index) => {
            if (icon) {
                icon.style.display = 'block';
                icon.style.visibility = 'visible';
                console.log(`Showing moon icon ${index} in light mode`);
            }
        });
    } else {
        // In dark mode, show sun icon and hide moon icon
        sunIcons.forEach((icon, index) => {
            if (icon) {
                icon.style.display = 'block';
                icon.style.visibility = 'visible';
                console.log(`Showing sun icon ${index} in dark mode`);
            }
        });
        moonIcons.forEach((icon, index) => {
            if (icon) {
                icon.style.display = 'none';
                icon.style.visibility = 'hidden';
                console.log(`Hiding moon icon ${index} in dark mode`);
            }
        });
    }
    
    // Final verification
    setTimeout(() => {
        console.log('=== FINAL VERIFICATION ===');
        sunIcons.forEach((icon, index) => {
            if (icon) {
                console.log(`Final sun icon ${index}: display=${icon.style.display}, computed=${window.getComputedStyle(icon).display}`);
            }
        });
        moonIcons.forEach((icon, index) => {
            if (icon) {
                console.log(`Final moon icon ${index}: display=${icon.style.display}, computed=${window.getComputedStyle(icon).display}`);
            }
        });
    }, 100);
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