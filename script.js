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

// Function to trigger intro animation directly
function triggerIntroAnimation() {
    console.log('triggerIntroAnimation called');
    // Set hasScrolled to true to bypass scroll check
    hasScrolled = true;
    
    // Also directly trigger the animation since we want it to show immediately
    if (!introAnimationStarted) {
        const typewriterContainer = document.getElementById('intro-typewriter');
        console.log('typewriterContainer:', typewriterContainer);
        const introSection = document.getElementById('intro');
        console.log('introSection:', introSection);
        if (typewriterContainer) {
            // Create heading elements if they don't exist
            let heading1 = typewriterContainer.querySelector('h1');
            let heading2 = typewriterContainer.querySelector('h2');
            
            console.log('heading1 before creation:', heading1);
            console.log('heading2 before creation:', heading2);
            
            if (!heading1) {
                heading1 = document.createElement('h1');
                typewriterContainer.appendChild(heading1);
            }
            
            if (!heading2) {
                heading2 = document.createElement('h2');
                typewriterContainer.appendChild(heading2);
            }
            
            console.log('heading1 after creation:', heading1);
            console.log('heading2 after creation:', heading2);
            
            // Define the content that should be typed
            const originalHeading1 = "Hello! I'm Rishi.";
            const originalHeading2 = 'I design to make the complex simple and the simple exciting. Based in  ●Delft, The Netherlands';
            
            // Create cursor element
            const cursorElement = document.createElement('span');
            cursorElement.className = 'blinking-cursor';
            // Remove the visible character to avoid conflict with custom cursor
            cursorElement.style.marginLeft = '2px';
            cursorElement.style.verticalAlign = 'baseline';
            
            console.log('Starting typing animation');
            // Start typing animation - heading first, then subtitle
            typeTextWithCursor([heading1, heading2], [originalHeading1, originalHeading2], cursorElement, 1500);
            
            introAnimationStarted = true;
        }
    }
}

// Typing function for intro section with moving cursor
function typeTextWithCursor(elements, texts, cursorElement, duration) {
    const [heading1, heading2] = elements;
    const [heading1Text, heading2Text] = texts;
    
    // Keep elements hidden until animation starts
    heading1.style.opacity = '0';
    heading2.style.opacity = '0';
    
    // Ensure elements have fixed height to prevent layout shifts and reduce spacing
    heading1.style.position = 'relative';
    heading2.style.position = 'relative';
    heading1.style.margin = '0';
    heading2.style.margin = '-0.5em 0 0 0'; // Increased negative top margin to pull closer to h1
    heading1.style.padding = '0';
    heading2.style.padding = '0';
    heading1.style.lineHeight = '1.0'; // Further reduced line height
    heading2.style.lineHeight = '1.2'; // Further reduced line height
    
    // Additional styling to reduce spacing even further
    heading1.style.height = '1.5em'; // Match CSS height
    heading2.style.height = '1.8em'; // Match CSS height
    heading1.style.boxSizing = 'border-box';
    heading2.style.boxSizing = 'border-box';
    
    // Calculate timing for each element
    const totalLength = heading1Text.length + heading2Text.length;
    const heading1Duration = (heading1Text.length / totalLength) * duration;
    const heading2Duration = (heading2Text.length / totalLength) * duration;
    
    // Calculate delay per character for the desired total duration
    const heading1Delay = heading1Text.length > 0 ? heading1Duration / heading1Text.length : 25;
    const heading2Delay = heading2Text.length > 0 ? heading2Duration / heading2Text.length : 25;
    
    let heading1Index = 0;
    let heading2Index = 0;
    
    // Type heading1
    function typeHeading1() {
        // Make heading1 visible when we start typing
        if (heading1Index === 0) {
            heading1.style.opacity = '1';
        }
        
        if (heading1Index < heading1Text.length) {
            // Build text character by character
            const currentText = heading1Text.substring(0, heading1Index + 1);
            heading1.textContent = currentText;
            
            // Ensure cursor is always visible and properly positioned
            if (cursorElement.parentNode !== heading1) {
                if (cursorElement.parentNode) {
                    cursorElement.parentNode.removeChild(cursorElement);
                }
                heading1.appendChild(cursorElement);
            }
            
            heading1Index++;
            setTimeout(typeHeading1, heading1Delay); // Dynamic timing based on desired duration
        } else {
            // Complete the heading1 text
            heading1.textContent = heading1Text;
            
            // Move cursor to heading2
            if (cursorElement.parentNode) {
                cursorElement.parentNode.removeChild(cursorElement);
            }
            heading2.appendChild(cursorElement);
            
            // Move to heading2 after a short delay
            setTimeout(typeHeading2, 100); // Further reduced delay
        }
    }
    
    // Type heading2 - Handle HTML tags properly
    function typeHeading2() {
        // Make heading2 visible when we start typing
        if (heading2Index === 0) {
            heading2.style.opacity = '1';
        }
        
        // Special handling for the text with HTML tags
        // We need to type "I design to make the " first
        // Then add the "complex" span (normal weight as requested)
        // Then add " "
        // Then add the "simple" span (bold as requested)
        // Then add " "
        // Then add the "and the " span (normal weight)
        // Then add the "simple" span (normal weight as requested)
        // Then add " "
        // Then add the "exciting" span (bold)
        // Then add "."
        // Then add line break
        // Then add the location text with smaller font size
        // Then add "Based in "
        // Then add the blinking orange dot
        // Then add " " (space after the dot)
        // Then add the "Delft, The Netherlands" span (bold)
        
        const parts = [
                { text: "I design to make the ", type: "plain" },
                { text: "complex", type: "normal" }, // Changed to normal as requested
                { text: " ", type: "plain" },
                { text: "simple", type: "bold" }, // Changed to bold as requested
                { text: " ", type: "plain" },
                { text: "and the ", type: "plain" },
                { text: "simple", type: "normal" }, // Changed to normal as requested
                { text: " ", type: "plain" },
                { text: "exciting", type: "bold" }, // Keep bold
                { text: ".", type: "plain" },
                { text: " ", type: "linebreak" },
                { text: "Currently based in ", type: "plain" }, // Updated text
                { text: "●", type: "blinking-dot" },
                { text: "&nbsp;", type: "plain" }, // Non-breaking space after the dot
                { text: "Delft, The Netherlands", type: "bold" },
                { text: "", type: "location-end" } // Closing tag for location-text span
            ];
        
        let currentPartIndex = 0;
        let currentPartCharIndex = 0;
        let accumulatedHTML = "";
        
        // Calculate total characters for timing
        const totalChars = parts.reduce((sum, part) => sum + part.text.length, 0);
        const charDelay = Math.max(25, totalChars > 0 ? heading2Duration / totalChars : 25); // Minimum 25ms delay
        
        function typeNextPart() {
            // Check if we've completed all parts
            if (currentPartIndex >= parts.length) {
                // Animation complete - ensure the full text is displayed
                heading2.innerHTML = 'I design to make the <span class="normal-weight">complex</span> <span class="bold-white">simple</span> and the <span class="normal-weight">simple</span> <span class="bold-white">exciting</span>.<br><span class="location-text">Currently based in <span class="blinking-dot">●</span>&nbsp;<span class="bold-white">Delft, The Netherlands</span></span>';
                
                // Remove the cursor element entirely after animation is complete
                if (cursorElement.parentNode) {
                    cursorElement.parentNode.removeChild(cursorElement);
                }
                
                // Fade in the entire intro section
                const introSection = document.getElementById('intro');
                if (introSection) {
                    introSection.style.opacity = '1';
                }
                
                // Ensure all spans are visible after animation
                const normalWeights = heading2.querySelectorAll('.normal-weight');
                const boldWhites = heading2.querySelectorAll('.bold-white');
                const blinkingDots = heading2.querySelectorAll('.blinking-dot');
                const locationTexts = heading2.querySelectorAll('.location-text');
                
                normalWeights.forEach(normal => {
                    normal.style.opacity = '1';
                });
                
                boldWhites.forEach(bold => {
                    bold.style.opacity = '1';
                });
                
                blinkingDots.forEach(dot => {
                    dot.style.opacity = '1';
                });
                
                locationTexts.forEach(location => {
                    location.style.opacity = '1';
                });
                
                // Add the blinking dot content after the typing animation
                addLocationAndStatusContent();
                
                return;
            }
            
            const currentPart = parts[currentPartIndex];
            
            // Check if we've completed the current part
            if (currentPartCharIndex >= currentPart.text.length) {
                // Move to the next part
                currentPartIndex++;
                currentPartCharIndex = 0;
                
                // If we haven't completed all parts, continue with the next part
                if (currentPartIndex < parts.length) {
                    setTimeout(typeNextPart, charDelay);
                } else {
                    // We've completed all parts, finalize the animation
                    // Animation complete - ensure the full text is displayed
                    heading2.innerHTML = 'I design to make the <span class="normal-weight">complex</span> <span class="bold-white">simple</span> and the <span class="normal-weight">simple</span> <span class="bold-white">exciting</span>.<br><span class="location-text">Currently based in <span class="blinking-dot">●</span>&nbsp;<span class="bold-white">Delft, The Netherlands</span></span>';
                    
                    // Remove the cursor element entirely after animation is complete
                    if (cursorElement.parentNode) {
                        cursorElement.parentNode.removeChild(cursorElement);
                    }
                    
                    // Fade in the entire intro section
                    const introSection = document.getElementById('intro');
                    if (introSection) {
                        introSection.style.opacity = '1';
                    }
                    
                    // Ensure all spans are visible after animation
                    const normalWeights = heading2.querySelectorAll('.normal-weight');
                    const boldWhites = heading2.querySelectorAll('.bold-white');
                    const blinkingDots = heading2.querySelectorAll('.blinking-dot');
                    const locationTexts = heading2.querySelectorAll('.location-text');
                    
                    normalWeights.forEach(normal => {
                        normal.style.opacity = '1';
                    });
                    
                    boldWhites.forEach(bold => {
                        bold.style.opacity = '1';
                    });
                    
                    blinkingDots.forEach(dot => {
                        dot.style.opacity = '1';
                    });
                    
                    locationTexts.forEach(location => {
                        location.style.opacity = '1';
                    });
                    
                    // Add the blinking dot content after the typing animation
                    addLocationAndStatusContent();
                }
                return;
            }
            
            // Build the HTML content character by character
            if (currentPart.type === "plain") {
                // Handle space characters explicitly to prevent HTML space collapsing
                if (currentPart.text[currentPartCharIndex] === " ") {
                    accumulatedHTML += "&nbsp;";
                } else {
                    accumulatedHTML += currentPart.text[currentPartCharIndex];
                }
            } else if (currentPart.type === "normal") {
                // For the first character of a normal section, add the opening span tag
                if (currentPartCharIndex === 0) {
                    accumulatedHTML += '<span class="normal-weight">';
                }
                // Add the current character
                accumulatedHTML += currentPart.text[currentPartCharIndex];
                // For the last character of a normal section, add the closing span tag
                if (currentPartCharIndex === currentPart.text.length - 1) {
                    accumulatedHTML += '</span>';
                }
            } else if (currentPart.type === "bold") {
                // For the first character of a bold section, add the opening span tag
                if (currentPartCharIndex === 0) {
                    accumulatedHTML += '<span class="bold-white">';
                }
                // Add the current character
                accumulatedHTML += currentPart.text[currentPartCharIndex];
                // For the last character of a bold section, add the closing span tag
                if (currentPartCharIndex === currentPart.text.length - 1) {
                    accumulatedHTML += '</span>';
                }
            } else if (currentPart.type === "blinking-dot") {
                // For the first character of a blinking dot section, add the opening span tag
                if (currentPartCharIndex === 0) {
                    accumulatedHTML += '<span class="blinking-dot">';
                }
                // Add the current character
                accumulatedHTML += currentPart.text[currentPartCharIndex];
                // For the last character of a blinking dot section, add the closing span tag
                if (currentPartCharIndex === currentPart.text.length - 1) {
                    accumulatedHTML += '</span>';
                }
            } else if (currentPart.type === "linebreak") {
                // Add line break and start the location text span
                accumulatedHTML += '<br><span class="location-text">';
            } else if (currentPart.type === "location-end") {
                // Close the location text span
                accumulatedHTML += '</span>';
            }
            
            // Update the heading content
            heading2.innerHTML = accumulatedHTML;
            
            // Position cursor correctly based on the current part type
            if (cursorElement.parentNode) {
                cursorElement.parentNode.removeChild(cursorElement);
            }
            
            // For styled text, we need to append the cursor to the last span
            if (currentPart.type === "plain" || currentPart.type === "linebreak" || currentPart.type === "location-end") {
                // For linebreak and location-end, cursor should be appended to the location-text span if it exists
                if ((currentPart.type === "linebreak" || currentPart.type === "location-end") && currentPartCharIndex === currentPart.text.length - 1) {
                    const locationSpans = heading2.querySelectorAll('.location-text');
                    if (locationSpans.length > 0) {
                        locationSpans[locationSpans.length - 1].appendChild(cursorElement);
                    } else {
                        heading2.appendChild(cursorElement);
                    }
                } else if (currentPart.type === "plain") {
                    heading2.appendChild(cursorElement);
                } else {
                    heading2.appendChild(cursorElement);
                }
            } else {
                // Find the last span element and append cursor to it
                const spans = heading2.querySelectorAll('span');
                if (spans.length > 0) {
                    const lastSpan = spans[spans.length - 1];
                    // Only append cursor if we're at the end of that span
                    if (currentPartCharIndex === currentPart.text.length - 1 && 
                        (currentPart.type === "normal" || currentPart.type === "bold" || currentPart.type === "blinking-dot")) {
                        lastSpan.appendChild(cursorElement);
                    } else {
                        // Otherwise append to the heading
                        heading2.appendChild(cursorElement);
                    }
                } else {
                    heading2.appendChild(cursorElement);
                }
            }
            
            currentPartCharIndex++;
            setTimeout(typeNextPart, charDelay); // Dynamic timing based on desired duration
        }
        
        typeNextPart();
    }
    
    // Start the animation
    typeHeading1();
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
                
                // Create cursor element
                const cursorElement = document.createElement('span');
                cursorElement.className = 'blinking-cursor';
                cursorElement.style.marginLeft = '2px';
                cursorElement.style.verticalAlign = 'baseline';
                heading.appendChild(cursorElement);
                
                // Start typing animation for 1.5 seconds
                typeTextMovingCursor(
                    [heading, paragraph, button], 
                    [originalHeading, originalParagraph, originalButton], 
                    cursorElement, 
                    1500
                );
                
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