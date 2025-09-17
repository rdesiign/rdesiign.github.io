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
    // Get navigation elements
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.getElementById('main-navbar');
    
    // Function to update active link based on scroll position
    function updateActiveLink() {
        // Remove active class from all links first
        navLinks.forEach(link => link.classList.remove('active'));
        
        // Get current scroll position
        const scrollPos = window.scrollY + 150; // Small offset for better detection
        
        // Define sections in the order they appear in the page
        const sections = [
            { id: 'home', element: document.getElementById('home') },
            { id: 'intro', element: document.getElementById('intro') },
            { id: 'projects', element: document.getElementById('projects') },
            { id: 'experience', element: document.getElementById('experience') },
            { id: 'contact', element: document.getElementById('contact') }
        ].filter(section => section.element !== null); // Filter out any sections that don't exist
        
        // Find the section that's currently in view
        let activeSection = 'home'; // Default to home
        
        // Special case: if we're at the very top of the page, make sure home is active
        if (window.scrollY < 50) {
            activeSection = 'home';
        } else {
            // Check if we're at the bottom of the page (for contact section)
            const scrollBottom = window.scrollY + window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            
            // If we're near the bottom of the page, activate contact section
            if (scrollBottom >= documentHeight - 100) {
                activeSection = 'contact';
            } else {
                // Check sections from bottom to top to find the first one that's in view
                for (let i = sections.length - 1; i >= 0; i--) {
                    const section = sections[i];
                    const sectionTop = section.element.offsetTop;
                    
                    if (scrollPos >= sectionTop) {
                        activeSection = section.id;
                        break;
                    }
                }
            }
        }
        
        // Add active class to the corresponding link
        const activeLink = document.querySelector(`.nav-link[data-section="${activeSection}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        } else {
            // Fallback: if no data-section link found, try to match by href
            const fallbackLink = document.querySelector(`.nav-link[href="#${activeSection}"]`);
            if (fallbackLink) {
                fallbackLink.classList.add('active');
            }
        }
    }
    
    // Set up scroll listener with throttling
    let ticking = false;
    function updateActiveLinkThrottled() {
        if (!ticking) {
            requestAnimationFrame(function() {
                updateActiveLink();
                ticking = false;
            });
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', updateActiveLinkThrottled);
    
    // Set up click handlers for smooth scrolling
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const sectionId = this.getAttribute('data-section');
            
            // Handle external links (About)
            if (sectionId === 'about') {
                return; // Let it navigate normally
            }
            
            e.preventDefault();
            
            // Find target section
            const targetSection = document.getElementById(sectionId);
            if (targetSection) {
                // Calculate offset (account for navbar height)
                let offsetTop = targetSection.offsetTop;
                if (sectionId !== 'home' && navbar) {
                    offsetTop -= navbar.offsetHeight + 20;
                }
                
                // Smooth scroll to section
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Update active link after scroll
                setTimeout(updateActiveLink, 100);
            }
        });
    });
    
    // Initialize on load
    setTimeout(updateActiveLink, 100);
    
    // Update on window resize
    window.addEventListener('resize', function() {
        setTimeout(updateActiveLink, 100);
    });
    
    // Listen for theme changes to update navigation styling
    window.addEventListener('themeChange', function() {
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

// Typing animation for About section - CURSOR BLINKS AT END & PROFILE PICTURE TRIGGER
let aboutAnimationStarted = false;

// Typing animation for Intro section
let introAnimationStarted = false;
let hasScrolled = false; // Track if user has scrolled

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

// Check if intro section is in viewport
function isIntroSectionInViewport() {
    const introSection = document.getElementById('intro');
    if (introSection) {
        const rect = introSection.getBoundingClientRect();
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
        // console.log('Intro section is in viewport, user has scrolled, and animation not started');
        const typewriterContainer = document.getElementById('intro-typewriter');
        if (typewriterContainer) {
            // console.log('Typewriter container found');
            const heading1 = typewriterContainer.querySelector('h1');
            const heading2 = typewriterContainer.querySelector('h2');
            
            if (heading1 && heading2) {
                // console.log('Heading elements found');
                // Store original content - use innerHTML to preserve HTML tags
                const originalHeading1 = heading1.innerHTML;
                const originalHeading2 = heading2.innerHTML; // Changed from textContent to innerHTML
                
                // console.log('Original heading1:', originalHeading1);
                // console.log('Original heading2:', originalHeading2);
                
                // Clear content
                heading1.textContent = '';
                heading2.textContent = '';
                
                // Show elements
                heading1.style.opacity = '1';
                heading2.style.opacity = '1';
                
                // Create cursor element
                const cursorElement = document.createElement('span');
                cursorElement.className = 'blinking-cursor';
                cursorElement.textContent = '|'; // Add a visible character for the cursor
                cursorElement.style.color = '#ff6b35'; // Orange color like the cursor
                cursorElement.style.marginLeft = '5px';
                cursorElement.style.animation = 'blink 1s infinite';
                cursorElement.style.verticalAlign = 'baseline'; // Align with text baseline
                
                // Start typing animation - heading first, then subtitle
                typeTextWithCursor([heading1, heading2], [originalHeading1, originalHeading2], cursorElement, 3000);
                
                introAnimationStarted = true;
            }
        }
    }
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

// Typing function for intro section with moving cursor
function typeTextWithCursor(elements, texts, cursorElement, duration) {
    // console.log('Starting typing animation');
    // console.log('Elements:', elements);
    // console.log('Texts:', texts);
    
    const [heading1, heading2] = elements;
    const [heading1Text, heading2Text] = texts;
    
    // Calculate timing for each element
    const totalLength = heading1Text.length + heading2Text.length;
    const heading1Duration = (heading1Text.length / totalLength) * duration;
    const heading2Duration = (heading2Text.length / totalLength) * duration;
    
    let heading1Index = 0;
    let heading2Index = 0;
    
    // Type heading1
    function typeHeading1() {
        // console.log('Typing heading1, index:', heading1Index);
        if (heading1Index < heading1Text.length) {
            // Handle HTML tags properly
            if (heading1Text.charAt(heading1Index) === '<') {
                // Find the end of the tag
                const tagEnd = heading1Text.indexOf('>', heading1Index) + 1;
                const currentText = heading1Text.substring(0, heading1Index);
                const tagText = heading1Text.substring(heading1Index, tagEnd);
                
                // Set the HTML content correctly
                heading1.innerHTML = currentText + tagText;
                heading1.appendChild(cursorElement);
                
                heading1Index = tagEnd;
            } else {
                const textBeforeCursor = heading1Text.substring(0, heading1Index);
                const currentChar = heading1Text.charAt(heading1Index);
                
                // Reconstruct the HTML with cursor in the right place
                heading1.innerHTML = textBeforeCursor + currentChar;
                heading1.appendChild(cursorElement);
                
                heading1Index++;
            }
            setTimeout(typeHeading1, heading1Duration / heading1Text.length);
        } else {
            // Complete the heading1 text
            heading1.innerHTML = heading1Text;
            // Move to heading2
            setTimeout(typeHeading2, 300);
        }
    }
    
    // Type heading2
    function typeHeading2() {
        // console.log('Typing heading2, index:', heading2Index);
        if (heading2Index < heading2Text.length) {
            // Handle HTML tags properly for heading2 as well
            if (heading2Text.charAt(heading2Index) === '<') {
                // Find the end of the tag
                const tagEnd = heading2Text.indexOf('>', heading2Index) + 1;
                const currentText = heading2Text.substring(0, heading2Index);
                const tagText = heading2Text.substring(heading2Index, tagEnd);
                
                // Set the HTML content correctly
                heading2.innerHTML = currentText + tagText;
                heading2.appendChild(cursorElement);
                
                heading2Index = tagEnd;
            } else {
                const textBeforeCursor = heading2Text.substring(0, heading2Index);
                const currentChar = heading2Text.charAt(heading2Index);
                
                // Reconstruct the HTML with cursor in the right place
                heading2.innerHTML = textBeforeCursor + currentChar;
                heading2.appendChild(cursorElement);
                
                heading2Index++;
            }
            setTimeout(typeHeading2, heading2Duration / heading2Text.length);
        } else {
            // Animation complete - ensure the full text is displayed
            heading1.innerHTML = heading1Text;
            heading2.innerHTML = heading2Text;
            
            // Position cursor at the end and ensure it continues blinking
            heading2.appendChild(cursorElement);
            
            // Ensure cursor is visible and blinking at the end
            cursorElement.style.display = 'inline';
            cursorElement.style.visibility = 'visible';
            
            // Make sure the blinking animation continues
            if (!cursorElement.classList.contains('blinking-cursor')) {
                cursorElement.classList.add('blinking-cursor');
            }
        }
    }
    
    // Start the animation with heading1
    typeHeading1();
}

// Initialize scroll listener
document.addEventListener('DOMContentLoaded', function() {
    // Track initial scroll position
    let initialScrollY = window.scrollY;
    
    // Add scroll event listener
    window.addEventListener('scroll', function() {
        // Set hasScrolled to true when user scrolls
        if (!hasScrolled && window.scrollY !== initialScrollY) {
            hasScrolled = true;
        }
        
        checkProfilePictureVisibility();
        checkIntroSectionVisibility();
    });
    
    // Check on initial load in case already in view
    setTimeout(function() {
        checkProfilePictureVisibility();
        checkIntroSectionVisibility();
    }, 1000);
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
