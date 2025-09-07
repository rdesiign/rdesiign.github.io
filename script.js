// Industrial Design Loading Screen - VERSION 3.0
// Show loading screen for 2 seconds with industrial theme animation
window.addEventListener('load', function() {
    console.log('🏭 Industrial Loading Screen Initialized - 2 seconds');
    
    // Add loading class to body
    document.body.classList.add('loading');
    
    // Remove loading screen after exactly 2 seconds
    setTimeout(function() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('fade-out');
            
            // Remove loading screen from DOM after fade out completes
            setTimeout(function() {
                document.body.classList.remove('loading');
                if (loadingScreen.parentNode) {
                    loadingScreen.parentNode.removeChild(loadingScreen);
                }
                console.log('🎯 Loading screen removed after 2 seconds');
            }, 500); // Wait for fade-out transition
        }
    }, 2000); // 2 seconds exactly
});

// Navigation functionality - VERSION 3.0 - WITH INDUSTRIAL LOADING SCREEN
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 SCRIPT VERSION 2.0 LOADED - LOADING SCREEN REMOVED!');
    
    // Prevent browser from restoring scroll position
    if (history.scrollRestoration) {
        history.scrollRestoration = 'manual';
    }
    
    // Scroll to top on page load
    window.scrollTo(0, 0);
    
    // Remove no-js class as JavaScript is working
    document.documentElement.classList.remove('no-js');
    
    // Initialize theme
    initializeTheme();
    
    // Initialize slideshow
    initializeSlideshow();
    
    // Initialize project modals
    initializeProjectModals();
    
    // Debug: Test if modal elements exist
    console.log('=== DEBUGGING INFO ===');
    console.log('Modal element exists:', !!document.getElementById('project-modal'));
    console.log('Project cards found:', document.querySelectorAll('.project-card').length);
    console.log('Script loaded successfully');
    console.log('=== END DEBUG INFO ===');
    
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            const isOpen = navLinks.classList.contains('mobile-open');
            navLinks.classList.toggle('mobile-open');
            
            // Update aria-expanded for accessibility
            menuToggle.setAttribute('aria-expanded', !isOpen);
        });
        
        // Close mobile menu when clicking on a link
        navLinks.addEventListener('click', function(e) {
            if (e.target.classList.contains('nav-link')) {
                navLinks.classList.remove('mobile-open');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('mobile-open');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }
    
    // Smooth scrolling for navigation links
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const navHeight = document.querySelector('.navigation').offsetHeight;
                const targetPosition = targetSection.offsetTop - navHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Navigation background on scroll
    const navigation = document.querySelector('.navigation');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            navigation.style.background = 'var(--nav-bg)';
            navigation.style.backdropFilter = 'blur(20px)';
        } else {
            navigation.style.background = 'var(--glass-bg)';
            navigation.style.backdropFilter = 'blur(20px)';
        }
        
        // Keep navigation visible (removed hide/show behavior)
        navigation.style.transform = 'translateX(-50%) translateY(0)';
        
        lastScrollY = currentScrollY;
    });
    
    // Active navigation link highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinksAll = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const scrollPosition = window.scrollY + window.innerHeight / 3;
            
            if (scrollPosition >= sectionTop && scrollPosition <= sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinksAll.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
    
    // Scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe elements with fade-in class and make initially visible elements visible immediately
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach((el, index) => {
        // Make elements in viewport immediately visible
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            el.classList.add('visible');
        }
        observer.observe(el);
    });
    
// Project Modal Functionality
function initializeProjectModals() {
    // Project card interactions (excluding the first project which opens as a separate page)
    const projectCards = document.querySelectorAll('.project-card:not(.project-link)');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        // Click handler to open project modal
        card.addEventListener('click', function() {
            const projectId = this.getAttribute('data-project');
            console.log('Clicked project:', projectId); // Debug log
            openProjectModal(projectId);
        });
    });
    
    // Handle hover effects for the project link (first project)
    const projectLink = document.querySelector('.project-link');
    if (projectLink) {
        projectLink.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        projectLink.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    }
    
    // Modal close functionality
    const modal = document.getElementById('project-modal');
    const closeBtn = document.querySelector('.modal-close');
    
    // Close button
    if (closeBtn) {
        closeBtn.addEventListener('click', closeProjectModal);
    }
    
    // Close on overlay click
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeProjectModal();
            }
        });
    }
    
    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            closeProjectModal();
        }
    });
}
    
    // Skill item animations removed - no skill cards in About section
    
    // Contact link interactions
    const contactLinks = document.querySelectorAll('.contact-link');
    contactLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Parallax effect for banner slideshow
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const banner = document.querySelector('.banner-slideshow');
        const slideContent = document.querySelector('.slide-content');
        
        if (banner && slideContent && scrolled < window.innerHeight) {
            const speed = scrolled * 0.3;
            slideContent.style.transform = `translateY(${speed}px)`;
        }
    });
    
    // Remove deprecated typing effect and CTA button pulse
    // (These were for the old hero section)
    
    // Add loading animation
    window.addEventListener('load', function() {
        // Ensure page starts at top
        setTimeout(() => {
            window.scrollTo(0, 0);
        }, 100);
        
        document.body.classList.add('loaded');
        
        // Add stagger animation to elements
        const animatedElements = document.querySelectorAll('.project-card, .experience-item');
        animatedElements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('fade-in');
                element.classList.add('visible');
            }, index * 100);
        });
    });
});

// Utility functions
function smoothScrollTo(targetId, offset = 0) {
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
        const targetPosition = targetElement.offsetTop - offset;
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// Theme utilities (for future dark/light mode toggle)
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

function getTheme() {
    return localStorage.getItem('theme') || 'light';
}

// Performance optimization
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Debounce function for scroll events
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Theme toggle functionality
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const themeIcon = document.getElementById('theme-icon');
    if (themeIcon) {
        themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
}

// Slideshow functionality
let currentSlideIndex = 0;
let slideInterval;

function initializeSlideshow() {
    // Set initial slide
    currentSlideIndex = 0;
    
    // Debug: Check if slides exist
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.nav-dot');
    console.log('Found slides:', slides.length);
    console.log('Found dots:', dots.length);
    
    showSlide(currentSlideIndex);
    
    // Add touch gesture support for mobile
    initializeTouchGestures();
    
    // Start auto-slide after a short delay
    setTimeout(() => {
        startAutoSlide();
    }, 1000);
    
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
    
    console.log('showSlide called with:', n);
    console.log('Current slide index:', currentSlideIndex);
    console.log('Slides found:', slides.length);
    
    if (slides.length === 0) return; // Safety check
    
    if (n >= slides.length) currentSlideIndex = 0;
    if (n < 0) currentSlideIndex = slides.length - 1;
    
    // Remove active class from all slides and dots
    slides.forEach((slide, index) => {
        slide.classList.remove('active');
        console.log(`Slide ${index} active:`, slide.classList.contains('active'));
    });
    dots.forEach(dot => dot.classList.remove('active'));
    
    // Add active class to current slide and dot
    if (slides[currentSlideIndex]) {
        slides[currentSlideIndex].classList.add('active');
        console.log(`Activating slide ${currentSlideIndex}`);
    }
    if (dots[currentSlideIndex]) {
        dots[currentSlideIndex].classList.add('active');
    }
}

function changeSlide(n) {
    currentSlideIndex += n;
    showSlide(currentSlideIndex);
    stopAutoSlide();
    startAutoSlide(); // Restart auto-slide
}

function currentSlide(n) {
    currentSlideIndex = n - 1;
    showSlide(currentSlideIndex);
    stopAutoSlide();
    startAutoSlide(); // Restart auto-slide
}

function startAutoSlide() {
    slideInterval = setInterval(() => {
        currentSlideIndex++;
        showSlide(currentSlideIndex);
    }, 5000); // Change slide every 5 seconds
}

function stopAutoSlide() {
    if (slideInterval) {
        clearInterval(slideInterval);
    }
}

// Touch gesture support for mobile slideshow
function initializeTouchGestures() {
    const slideshowContainer = document.querySelector('.slideshow-container');
    if (!slideshowContainer) return;
    
    let startX = 0;
    let endX = 0;
    let startY = 0;
    let endY = 0;
    const minSwipeDistance = 50;
    
    slideshowContainer.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        stopAutoSlide();
    }, { passive: true });
    
    slideshowContainer.addEventListener('touchmove', function(e) {
        // Prevent default scrolling if swiping horizontally
        const deltaX = Math.abs(e.touches[0].clientX - startX);
        const deltaY = Math.abs(e.touches[0].clientY - startY);
        
        if (deltaX > deltaY) {
            e.preventDefault();
        }
    }, { passive: false });
    
    slideshowContainer.addEventListener('touchend', function(e) {
        endX = e.changedTouches[0].clientX;
        endY = e.changedTouches[0].clientY;
        
        const deltaX = endX - startX;
        const deltaY = endY - startY;
        
        // Only respond to horizontal swipes that are greater than vertical movement
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
            if (deltaX > 0) {
                // Swipe right - previous slide
                changeSlide(-1);
            } else {
                // Swipe left - next slide
                changeSlide(1);
            }
        }
        
        startAutoSlide();
    }, { passive: true });
}

// Project Modal Functionality
const projectData = {
    'smart-home-assistant': {
        title: 'Smart Home Assistant Device',
        tags: ['Product Design', 'IoT', 'User Interface'],
        overview: 'A revolutionary voice-activated home assistant that seamlessly blends intuitive physical controls with ambient lighting, designed specifically for modern living spaces.',
        challenge: 'Traditional smart home devices often feel cold and disconnected from their environment. Users struggled with purely voice-based interfaces, especially in noisy environments or when privacy was a concern.',
        solution: 'Developed a hybrid interface combining voice activation with intuitive touch controls and visual feedback through ambient lighting. The design prioritizes both aesthetics and functionality.',
        features: [
            'Multi-modal interaction (voice, touch, gesture)',
            'Adaptive ambient lighting system',
            'Privacy-first design with physical mute switches',
            'Seamless integration with existing home decor',
            'Energy-efficient LED matrix display'
        ],
        impact: 'Improved user satisfaction by 85% and reduced interaction errors by 60% compared to voice-only alternatives.',
        role: 'Lead Industrial Designer',
        duration: '8 months',
        team: 'Design team of 4, collaborated with engineering and UX teams'
    },
    'sustainable-furniture': {
        title: 'Sustainable Office Furniture',
        tags: ['Sustainability', 'Furniture Design', 'Ergonomics'],
        overview: 'A modular workspace furniture system crafted from 100% recycled materials, designed to adapt to changing work environments while minimizing environmental impact.',
        challenge: 'Office furniture contributes significantly to waste due to rigid designs that become obsolete as work patterns evolve. Traditional manufacturing processes also have high environmental costs.',
        solution: 'Created a fully modular system using recycled ocean plastic and reclaimed wood, with components that can be reconfigured, upgraded, or completely repurposed.',
        features: [
            'Modular components for infinite configurations',
            '100% recycled and recyclable materials',
            'Tool-free assembly and reconfiguration',
            'Ergonomic design certified by health organizations',
            'Carbon-neutral manufacturing process'
        ],
        impact: 'Reduced material waste by 75% and achieved carbon neutrality in the production lifecycle.',
        role: 'Industrial Designer & Sustainability Lead',
        duration: '12 months',
        team: 'Cross-functional team of 8 including materials scientists'
    },
    'medical-device': {
        title: 'Medical Device Interface',
        tags: ['Medical Design', 'UX Design', 'Safety'],
        overview: 'Complete redesign of a critical medical monitoring device interface, focusing on reducing user error in high-stress hospital environments.',
        challenge: 'The existing interface had a high error rate during critical situations, with complex navigation that increased cognitive load for medical professionals.',
        solution: 'Streamlined the interface with clear visual hierarchies, intuitive iconography, and fail-safe mechanisms to prevent critical errors.',
        features: [
            'One-touch emergency protocols',
            'Color-coded status indicators',
            'Large, touch-friendly controls',
            'Contextual help system',
            'Compliance with medical device regulations'
        ],
        impact: 'Reduced user errors by 78% and decreased average task completion time by 45%.',
        role: 'UX/UI Designer',
        duration: '6 months',
        team: 'Healthcare design team of 5 with medical professionals'
    },
    'consumer-electronics': {
        title: 'Consumer Electronics',
        tags: ['Electronics', 'Audio', 'Premium Design'],
        overview: 'Premium portable audio device featuring breakthrough battery technology and high-end materials, balancing portability with uncompromised audio quality.',
        challenge: 'Consumers wanted high-quality audio on the go, but existing portable devices either compromised on sound quality or were too bulky for daily carry.',
        solution: 'Developed a compact form factor using advanced acoustic engineering and premium materials, with innovative battery technology for extended use.',
        features: [
            '48-hour battery life with fast charging',
            'Premium aluminum and ceramic construction',
            'Advanced noise cancellation technology',
            'Compact, pocket-friendly design',
            'Wireless and wired connectivity options'
        ],
        impact: 'Achieved 95% user satisfaction rating and won three industry design awards.',
        role: 'Product Designer',
        duration: '10 months',
        team: 'Product development team of 12 across design and engineering'
    },
    'transportation-solution': {
        title: 'Transportation Solution',
        tags: ['Transportation', 'Urban Design', 'Electric Mobility'],
        overview: 'Innovative urban mobility concept combining electric scooters with smart docking stations to create an integrated transportation ecosystem for modern cities.',
        challenge: 'Urban congestion and pollution require sustainable transportation alternatives, but existing solutions lack the infrastructure and user experience for mass adoption.',
        solution: 'Designed an integrated system of electric scooters and smart docking stations that work together to provide seamless, sustainable urban transportation.',
        features: [
            'Solar-powered charging stations',
            'Smart route optimization',
            'Weather-resistant design',
            'Integrated payment and tracking systems',
            'Modular station design for various urban environments'
        ],
        impact: 'Pilot program showed 40% reduction in short-distance car trips and 92% user approval rating.',
        role: 'Transportation Design Lead',
        duration: '14 months',
        team: 'Multidisciplinary team of 15 including urban planners'
    },
    'kitchen-innovation': {
        title: 'Kitchen Innovation',
        tags: ['Kitchen Design', 'Smart Home', 'Energy Efficiency'],
        overview: 'Smart kitchen appliance that revolutionizes cooking by combining multiple functions in a compact design, emphasizing energy efficiency and intuitive operation.',
        challenge: 'Modern kitchens are often cluttered with single-purpose appliances, while many households lack space and want more sustainable cooking solutions.',
        solution: 'Created an all-in-one cooking system that replaces multiple appliances while using 60% less energy than traditional cooking methods.',
        features: [
            'Multi-function cooking capabilities',
            'AI-powered recipe suggestions',
            'Energy-efficient induction technology',
            'Compact countertop design',
            'Easy-clean, modular components'
        ],
        impact: 'Users reported 60% reduction in cooking time and 40% decrease in energy consumption.',
        role: 'Product Innovation Designer',
        duration: '9 months',
        team: 'Kitchen innovation team of 6 plus culinary consultants'
    }
};

function openProjectModal(projectId) {
    console.log('Opening modal for project:', projectId); // Debug log
    const project = projectData[projectId];
    if (!project) {
        console.error('Project data not found for:', projectId);
        return;
    }
    
    const modal = document.getElementById('project-modal');
    if (!modal) {
        console.error('Modal element not found');
        return;
    }
    
    console.log('Found project data and modal element'); // Debug log
    
    // Populate modal content
    document.getElementById('modal-title').textContent = project.title;
    document.getElementById('modal-overview').textContent = project.overview;
    document.getElementById('modal-challenge').textContent = project.challenge;
    document.getElementById('modal-solution').textContent = project.solution;
    document.getElementById('modal-impact').textContent = project.impact;
    document.getElementById('modal-role').textContent = project.role;
    document.getElementById('modal-duration').textContent = project.duration;
    document.getElementById('modal-team').textContent = project.team;
    
    // Populate tags
    const tagsContainer = document.getElementById('modal-tags');
    tagsContainer.innerHTML = '';
    project.tags.forEach(tag => {
        const tagElement = document.createElement('span');
        tagElement.className = 'project-tag';
        tagElement.textContent = tag;
        tagsContainer.appendChild(tagElement);
    });
    
    // Populate features
    const featuresContainer = document.getElementById('modal-features');
    featuresContainer.innerHTML = '';
    project.features.forEach(feature => {
        const featureElement = document.createElement('li');
        featureElement.textContent = feature;
        featuresContainer.appendChild(featureElement);
    });
    
    console.log('About to show modal'); // Debug log
    
    // Show modal
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.classList.add('active');
        console.log('Modal should now be visible'); // Debug log
    }, 10);
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
    const modal = document.getElementById('project-modal');
    modal.classList.remove('active');
    
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }, 300);
}