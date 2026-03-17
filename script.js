'use strict';

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

// ─── Custom Cursor ──────────────────────────────────────────────────
function initializeCustomCursor() {
    var cursor = document.querySelector('.custom-cursor');
    if (!cursor) return;

    var links = document.querySelectorAll('a, button, .project-card');

    function getBackgroundBrightness(x, y) {
        var el = document.elementFromPoint(x, y);
        if (!el) return 128;
        var bg = window.getComputedStyle(el).backgroundColor;
        if (bg === 'rgba(0, 0, 0, 0)' || bg === 'transparent') {
            var parent = el.parentElement;
            while (parent) {
                var pbg = window.getComputedStyle(parent).backgroundColor;
                if (pbg !== 'rgba(0, 0, 0, 0)' && pbg !== 'transparent') return calcBrightness(pbg);
                parent = parent.parentElement;
            }
            return calcBrightness(window.getComputedStyle(document.body).backgroundColor);
        }
        return calcBrightness(bg);
    }

    function calcBrightness(rgb) {
        var m = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (!m) return 128;
        return (parseInt(m[1]) * 299 + parseInt(m[2]) * 587 + parseInt(m[3]) * 114) / 1000;
    }

    document.addEventListener('mousemove', function (e) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        var brightness = getBackgroundBrightness(e.clientX, e.clientY);
        cursor.classList.toggle('light-bg', brightness > 128);
        cursor.classList.toggle('dark-bg', brightness <= 128);
    });

    cursor.style.display = 'block';

    links.forEach(function (link) {
        link.addEventListener('mouseenter', function () {
            cursor.classList.add('target');
            if (this.classList.contains('nav-link')) cursor.classList.add('no-dot');
        });
        link.addEventListener('mouseleave', function () {
            cursor.classList.remove('target', 'light-bg', 'dark-bg', 'no-dot');
        });
    });

    document.addEventListener('mouseleave', function () { cursor.style.display = 'none'; });
    document.addEventListener('mouseenter', function () { cursor.style.display = 'block'; });
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

    initializeTheme();
    initializeNavigation();
    initializeCustomCursor();
    initializeBackToTop();
});