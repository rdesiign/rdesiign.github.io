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

// Navigation toggle functionality
function initializeNavigationToggle() {
    // Only initialize desktop navigation on screens wider than 768px
    if (window.innerWidth <= 768) {
        return;
    }
    
    const navToggle = document.getElementById('nav-toggle');
    const navContainer = document.getElementById('nav-container');
    const navbar = document.getElementById('main-navbar');
    const navToggleIcon = document.querySelector('.nav-toggle-icon');
    const navLinks = document.querySelectorAll('.nav-link');
    const themeToggle = document.getElementById('theme-toggle');
    
    if (navToggle && navContainer && navbar) {
        // Initially hide navigation links and theme toggle
        navLinks.forEach(link => link.style.display = 'none');
        if (themeToggle) themeToggle.style.display = 'none';
        
        navToggle.addEventListener('click', function() {
            // Toggle expanded class on navbar
            navbar.classList.toggle('expanded');
            
            // Toggle navigation links and theme toggle visibility
            if (navbar.classList.contains('expanded')) {
                // Show all navigation elements
                navLinks.forEach(link => link.style.display = 'flex');
                if (themeToggle) themeToggle.style.display = 'flex';
                navToggleIcon.textContent = '−'; // Minus sign
            } else {
                // Hide navigation links and theme toggle, keep nav-toggle visible
                navLinks.forEach(link => link.style.display = 'none');
                if (themeToggle) themeToggle.style.display = 'none';
                navToggleIcon.textContent = '+'; // Plus sign
            }
        });
    }
}

// Mobile Navigation Popup Functionality
function initializeMobileNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const mobileNavPopup = document.getElementById('mobile-nav-popup');
    const mobileNavClose = document.getElementById('mobile-nav-close');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    const mobileThemeToggle = document.getElementById('mobile-theme-toggle');
    const mainThemeToggle = document.getElementById('theme-toggle');
    
    // Function to open mobile nav popup
    function openMobileNav() {
        mobileNavPopup.classList.add('active');
        // Prevent body scroll when popup is open
        document.body.style.overflow = 'hidden';
    }
    
    // Function to close mobile nav popup
    function closeMobileNav() {
        mobileNavPopup.classList.remove('active');
        // Restore body scroll
        document.body.style.overflow = '';
    }
    
    // Event listeners for opening/closing the popup
    if (navToggle) {
        navToggle.addEventListener('click', function(e) {
            // Prevent default behavior
            e.preventDefault();
            openMobileNav();
        });
    }
    
    if (mobileNavClose) {
        mobileNavClose.addEventListener('click', closeMobileNav);
    }
    
    // Close popup when clicking outside the content
    mobileNavPopup.addEventListener('click', function(e) {
        if (e.target === mobileNavPopup) {
            closeMobileNav();
        }
    });
    
    // Close popup when clicking on any mobile nav link
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', closeMobileNav);
    });
    
    // Sync theme toggle between mobile and desktop
    if (mobileThemeToggle && mainThemeToggle) {
        // Update mobile theme toggle when main theme changes
        mainThemeToggle.addEventListener('click', function() {
            // Small delay to ensure the theme change has been processed
            setTimeout(() => {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                updateThemeIcon(currentTheme);
            }, 10);
        });
        
        // Update main theme toggle when mobile theme changes
        mobileThemeToggle.addEventListener('click', function() {
            // Trigger click on main theme toggle
            mainThemeToggle.click();
            // Update mobile theme icon
            const currentTheme = document.documentElement.getAttribute('data-theme');
            updateThemeIcon(currentTheme);
        });
    }
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
    
    // Initialize navigation toggle
    initializeNavigationToggle();
    
    // Initialize mobile navigation
    initializeMobileNavigation();
    
    initializeComponents();
    initializeNavigation();
    initializeContactForm();
    initializeGraphBackground();
    initializeShowreelBanner(); // Add this line
    
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
    // The icon is now handled purely by CSS based on the data-theme attribute
    // This function is kept for consistency but doesn't need to do anything
    console.log('Theme updated to:', theme);
}

// Navigation functionality
function initializeNavigation() {
    // Check if we're on the about page
    if (window.IS_ABOUT_PAGE) {
        console.log('Navigation initialization skipped for about page');
        return;
    }
    
    console.log('Initializing navigation');
    // Get navigation elements
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.getElementById('main-navbar');
    
    if (navLinks.length === 0) {
        console.log('No navigation links found');
    } else {
        console.log('Found', navLinks.length, 'navigation links');
    }
    
    if (!navbar) {
        console.log('Navbar not found');
    } else {
        console.log('Navbar found');
    }
    
    // Function to update active link based on scroll position
    function updateActiveLink() {
        // Check if we're on the about page
        if (window.IS_ABOUT_PAGE) {
            console.log('updateActiveLink skipped for about page');
            return;
        }
        
        try {
            console.log('Updating active link');
            // Remove active class from all links first
            navLinks.forEach(link => {
                link.classList.remove('active');
                console.log('Removed active class from', link.textContent);
            });
            
            // Get current scroll position
            const scrollPos = window.scrollY + 100; // Small offset for better detection
            
            // Define sections in the order they appear in the page
            const sections = [
                { id: 'intro', element: document.getElementById('intro') },
                { id: 'projects', element: document.getElementById('projects') },
                { id: 'experience', element: document.getElementById('experience') }
                // Removed contact section from navigation
            ].filter(section => {
                const exists = section.element !== null;
                console.log(`Section ${section.id} exists: ${exists}`);
                return exists;
            }); // // Filter out any sections that don't exist
            
            console.log('Sections to check:', sections.map(s => s.id));
            
            // Log section positions for debugging
            sections.forEach(section => {
                if (section.element) {
                    const sectionTop = section.element.offsetTop;
                    const sectionBottom = sectionTop + section.element.offsetHeight;
                    console.log(`Section ${section.id}: top=${sectionTop}, bottom=${sectionBottom}, height=${section.element.offsetHeight}`);
                }
            });
            
            // Find the section that's currently in view
            let activeSection = null;
            
            // Check if we're at the top of the page (for home/intro section)
            if (window.scrollY < 100) {
                activeSection = 'intro';
                console.log('Near top, activating intro section');
            } else {
                // Check sections from top to bottom to find the first one that's in view
                for (let i = 0; i < sections.length; i++) {
                    const section = sections[i];
                    if (section.element) {
                        const sectionTop = section.element.offsetTop;
                        const sectionBottom = sectionTop + section.element.offsetHeight;
                        
                        console.log(`Checking section ${section.id}: top=${sectionTop}, bottom=${sectionBottom}, scrollPos=${scrollPos}`);
                        
                        // Check if the section is in view
                        if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
                            activeSection = section.id;
                            console.log('Found active section:', activeSection);
                            break;
                        }
                    }
                }
            }
            
            // Only set an active link if we found a section in view
            if (activeSection) {
                // Add active class to the corresponding link
                const activeLink = document.querySelector(`.nav-link[data-section="${activeSection}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                    console.log('Added active class to', activeLink.textContent);
                } else {
                    // Fallback: if no data-section link found, try to match by href
                    const fallbackLink = document.querySelector(`.nav-link[href="#${activeSection}"]`);
                    if (fallbackLink) {
                        fallbackLink.classList.add('active');
                        console.log('Added active class to fallback link', fallbackLink.textContent);
                    } else {
                        console.log('No link found for section', activeSection);
                    }
                }
            } else {
                console.log('No active section found');
                // If no section is active, default to projects when at top of page
                if (window.scrollY < 200) {
                    const projectsLink = document.querySelector('.nav-link[data-section="projects"]');
                    if (projectsLink) {
                        projectsLink.classList.add('active');
                        console.log('Added active class to projects link (default at top)');
                    }
                }
            }
        } catch (error) {
            console.error('Error in updateActiveLink:', error);
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
            
            // Handle external links (About) - let them navigate normally
            if (sectionId === 'about') {
                return; // Let it navigate normally
            }
            
            // Handle links that don't have a corresponding section on this page
            const targetSection = document.getElementById(sectionId);
            if (!targetSection) {
                return; // Let it navigate normally (e.g., to another page)
            }
            
            e.preventDefault();
            
            // Find target section
            if (targetSection) {
                // Calculate offset (account for navbar height)
                let offsetTop = targetSection.offsetTop;
                if (navbar) {
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
    
    // Theme change listener removed as per user request
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
            const originalHeading2 = 'I design to make the complex simple and the simple exciting.';
            
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
        // Then add the "complex" span (normal weight)
        // Then add " "
        // Then add the "simple" span (bold, white)
        // Then add " "
        // Then add the "simple" span (light, normal color)
        // Then add " "
        // Then add the "exciting" span (bold, white)
        // Then add "."
        
        const parts = [
                { text: "I design to make the ", type: "plain" },
                { text: "complex", type: "normal" },
                { text: " ", type: "plain" },
                { text: "simple", type: "bold-white" },
                { text: " and the ", type: "plain" },
                { text: "simple", type: "light-normal" },
                { text: " ", type: "plain" },
                { text: "exciting", type: "bold-white" },
                { text: ".", type: "plain" }
            ];
        
        let currentPartIndex = 0;
        let currentPartCharIndex = 0;
        let accumulatedHTML = "";
        
        // Calculate total characters for timing
        const totalChars = parts.reduce((sum, part) => sum + part.text.length, 0);
        const charDelay = heading2Duration / totalChars;
        
        function typeNextPart() {
            if (currentPartIndex >= parts.length) {
                // Animation complete - ensure the full text is displayed
                heading2.innerHTML = 'I design to make the <span class="normal-weight">complex</span> <span class="bold-white">simple</span> and the <span class="light-normal">simple</span> <span class="bold-white">exciting</span>.';
                
                // Position cursor at the end and ensure it continues blinking
                if (cursorElement.parentNode) {
                    cursorElement.parentNode.removeChild(cursorElement);
                }
                heading2.appendChild(cursorElement);
                
                // Ensure cursor is visible and blinking at the end
                cursorElement.style.display = 'inline-block';
                cursorElement.style.visibility = 'visible';
                
                // Make sure the blinking animation continues
                if (!cursorElement.classList.contains('blinking-cursor')) {
                    cursorElement.classList.add('blinking-cursor');
                }
                
                // Ensure the animation is not paused
                cursorElement.style.animationPlayState = 'running';
                
                // Fade in the entire intro section
                const introSection = document.getElementById('intro');
                if (introSection) {
                    introSection.style.opacity = '1';
                }
                
                // Ensure all spans are visible after animation
                const normalWeights = heading2.querySelectorAll('.normal-weight');
                const boldWhites = heading2.querySelectorAll('.bold-white');
                const lightNormals = heading2.querySelectorAll('.light-normal');
                
                normalWeights.forEach(normal => {
                    normal.style.opacity = '1';
                });
                
                boldWhites.forEach(bold => {
                    bold.style.opacity = '1';
                });
                
                lightNormals.forEach(light => {
                    light.style.opacity = '1';
                });
                
                return;
            }
            
            const currentPart = parts[currentPartIndex];
            
            if (currentPartCharIndex < currentPart.text.length) {
                // Build the HTML content character by character
                if (currentPart.type === "plain") {
                    accumulatedHTML += currentPart.text[currentPartCharIndex];
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
                } else if (currentPart.type === "bold-white") {
                    // For the first character of a bold-white section, add the opening span tag
                    if (currentPartCharIndex === 0) {
                        accumulatedHTML += '<span class="bold-white">';
                    }
                    // Add the current character
                    accumulatedHTML += currentPart.text[currentPartCharIndex];
                    // For the last character of a bold-white section, add the closing span tag
                    if (currentPartCharIndex === currentPart.text.length - 1) {
                        accumulatedHTML += '</span>';
                    }
                } else if (currentPart.type === "light-normal") {
                    // For the first character of a light-normal section, add the opening span tag
                    if (currentPartCharIndex === 0) {
                        accumulatedHTML += '<span class="light-normal">';
                    }
                    // Add the current character
                    accumulatedHTML += currentPart.text[currentPartCharIndex];
                    // For the last character of a light-normal section, add the closing span tag
                    if (currentPartCharIndex === currentPart.text.length - 1) {
                        accumulatedHTML += '</span>';
                    }
                }
                
                // Update the heading content
                heading2.innerHTML = accumulatedHTML;
                
                // Position cursor correctly based on the current part type
                if (cursorElement.parentNode) {
                    cursorElement.parentNode.removeChild(cursorElement);
                }
                
                // For styled text, we need to append the cursor to the last span
                if (currentPart.type === "plain") {
                    heading2.appendChild(cursorElement);
                } else {
                    // Find the last span element and append cursor to it
                    const spans = heading2.querySelectorAll('span');
                    if (spans.length > 0) {
                        const lastSpan = spans[spans.length - 1];
                        // Only append cursor if we're at the end of that span
                        if (currentPartCharIndex === currentPart.text.length - 1) {
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
            } else {
                // Move to next part
                currentPartIndex++;
                currentPartCharIndex = 0;
                setTimeout(typeNextPart, charDelay);
            }
        }
        
        typeNextPart();
    }
    
    // Start the animation with heading1
    typeHeading1();
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
