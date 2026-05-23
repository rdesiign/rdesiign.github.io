'use strict';

// ─── Button Stack (shared across all pages) ─────────────────────────
function renderButtonStack() {
    var path = window.location.pathname;
    var page = path.split('/').pop();
    var isIndex = page === '' || page === 'index.html';
    var isAbout = page === 'about.html';
    var isProject = page === 'MMM.html' || page === 'Semi.html';

    var homeHref = isIndex ? '#intro' : 'index.html#intro';
    var projectsHref = isIndex ? '#projects' : 'index.html#projects';
    var aboutHref = 'about.html';

    var homeActive = '';
    var projectActive = isProject ? ' active' : '';
    var aboutActive = isAbout ? ' active' : '';

    var navHTML = '<div class="nav-container" id="nav-container">'
        + '<div class="icon-circle nav-toggle" id="nav-toggle">'
        + '<svg class="nav-toggle-icon plus-icon" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
        + '<line x1="12" y1="5" x2="12" y2="19"></line>'
        + '<line x1="5" y1="12" x2="19" y2="12"></line>'
        + '</svg></div>'
        + '<div class="expanded-nav" id="expanded-nav" style="display: none;">'
        + '<a href="' + homeHref + '" class="nav-link' + homeActive + '">Home</a>'
        + '<a href="' + projectsHref + '" class="nav-link">Projects</a>'
        + '<a href="' + aboutHref + '" class="nav-link' + aboutActive + '">About</a>'
        + '<div class="icon-circle nav-close" id="nav-close">'
        + '<svg class="nav-toggle-icon minus-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
        + '<line x1="5" y1="12" x2="19" y2="12"></line>'
        + '</svg></div></div></div>';

    var contactHTML = '<div class="contact-icons-container">'
        + '<button class="icon-circle theme-toggle" id="theme-toggle" aria-label="Toggle theme"><span class="theme-icon">'
        + '<svg class="sun-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
        + '<circle cx="12" cy="12" r="5"></circle>'
        + '<line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line>'
        + '<line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>'
        + '<line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line>'
        + '<line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>'
        + '</svg>'
        + '<svg class="moon-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
        + '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>'
        + '</svg></span></button>'
        + '<div class="contact-icon-circle"><a href="mailto:rishirameshdesign@gmail.com" class="contact-icon-link" aria-label="Email">'
        + '<svg class="contact-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
        + '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>'
        + '<polyline points="22,6 12,13 2,6"></polyline></svg></a></div>'
        + '<div class="contact-icon-circle"><a href="https://www.linkedin.com/in/rishi-design/" class="contact-icon-link" target="_blank" aria-label="LinkedIn">'
        + '<svg class="contact-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
        + '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>'
        + '<rect x="2" y="9" width="4" height="12"></rect>'
        + '<circle cx="4" cy="4" r="2"></circle></svg></a></div>'
        + '</div>';

    var placeholder = document.getElementById('button-stack');
    if (placeholder) {
        placeholder.innerHTML = navHTML + contactHTML;
    }
}

// ─── Theme ──────────────────────────────────────────────────────────
function initializeTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const mobileThemeToggle = document.getElementById('mobile-theme-toggle');

    function toggleTheme() {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
    }

    if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
    if (mobileThemeToggle) mobileThemeToggle.addEventListener('click', toggleTheme);
}

// ─── Navigation ─────────────────────────────────────────────────────
function initializeNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navClose  = document.getElementById('nav-close');
    const expandedNav = document.getElementById('expanded-nav');

    if (!navToggle || !expandedNav) return;

    function isMobileTablet() { return window.innerWidth <= 1024; }

    function syncToggleIcon() {
        const open = isMobileTablet() && expandedNav.classList.contains('show');
        navToggle.classList.toggle('is-open', open);
    }

    if (navClose) navClose.style.display = 'none';
    syncToggleIcon();

    navToggle.addEventListener('click', function () {
        if (isMobileTablet()) {
            expandedNav.classList.toggle('show');
            syncToggleIcon();
        } else {
            expandedNav.style.display = 'flex';
            navToggle.style.display = 'none';
            if (navClose) navClose.style.display = 'flex';
        }
    });

    if (navClose) {
        navClose.addEventListener('click', function () {
            if (isMobileTablet()) {
                expandedNav.classList.remove('show');
                syncToggleIcon();
            } else {
                expandedNav.style.display = 'none';
                navToggle.style.display = 'flex';
                navClose.style.display = 'none';
            }
        });
    }

    // Close nav when clicking outside
    document.addEventListener('click', function (e) {
        var isOpen = isMobileTablet()
            ? expandedNav.classList.contains('show')
            : expandedNav.style.display === 'flex';
        if (!isOpen) return;

        var inside = navToggle.contains(e.target)
            || (navClose && navClose.contains(e.target))
            || expandedNav.contains(e.target);
        if (inside) return;

        if (isMobileTablet()) {
            expandedNav.classList.remove('show');
            syncToggleIcon();
        } else {
            expandedNav.style.display = 'none';
            navToggle.style.display = 'flex';
            if (navClose) navClose.style.display = 'none';
        }
    });

    window.addEventListener('resize', syncToggleIcon);

    // Nav highlighting (index only)
    var isIndex = window.location.pathname === '/'
        || window.location.pathname.includes('index.html');

    if (isIndex) {
        window.addEventListener('scroll', highlightNavigation);
        highlightNavigation();
    }

    // Smooth-scroll for anchor links
    document.querySelectorAll('.nav-link[href^="#"]').forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            var target = document.querySelector(this.getAttribute('href'));
            if (!target) return;
            document.querySelectorAll('.nav-link').forEach(function (l) { l.classList.remove('active'); });
            this.classList.add('active');
            window.scrollTo({ top: target.offsetTop, behavior: 'smooth' });
        });
    });
}

function highlightNavigation() {
    var isIndex = window.location.pathname === '/'
        || window.location.pathname.includes('index.html');
    if (!isIndex) return;

    var sections = document.querySelectorAll('section');
    var navLinks = document.querySelectorAll('.nav-link');
    var scrollPos = window.scrollY + 200;

    sections.forEach(function (section) {
        var top = section.offsetTop;
        var height = section.offsetHeight;
        var id = section.getAttribute('id');

        if (id === 'intro' && scrollPos <= height) {
            navLinks.forEach(function (l) {
                l.classList.remove('active');
                if (l.getAttribute('href') === '#intro' || l.textContent === 'Home') {
                    l.classList.add('active');
                }
            });
        } else if (scrollPos >= top && scrollPos < top + height) {
            navLinks.forEach(function (l) {
                l.classList.remove('active');
                if (l.getAttribute('href') === '#' + id) l.classList.add('active');
            });
        }
    });
}

// ─── Back to Top ────────────────────────────────────────────────────
function initializeBackToTop() {
    var btn = document.getElementById('back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', function () {
        btn.classList.toggle('visible', window.pageYOffset > 300);
    });

    btn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ─── Initialization ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
    if (history.scrollRestoration) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);

    renderButtonStack();
    initializeTheme();
    initializeNavigation();
    initializeBackToTop();
});
