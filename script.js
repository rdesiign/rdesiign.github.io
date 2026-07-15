'use strict';

// ─── Button Stack (shared across all pages) ─────────────────────────
function renderButtonStack() {
    var path = window.location.pathname;
    var page = path.split('/').pop();
    var isIndex = page === '' || page === 'index.html';
    var isAbout = page === 'about.html';
    var isProject = page === 'MMM.html' || page === 'Semi.html' || page === 'patch.html';

    var projectsHref = isIndex ? '#projects' : 'index.html#projects';
    var aboutHref = 'about.html';

    var workActive = isProject ? ' active' : '';
    var aboutActive = isAbout ? ' active' : '';

    var navHTML = '<div class="nav-container" id="nav-container">'
        + '<nav class="expanded-nav" aria-label="Primary navigation">'
        + '<a href="' + aboutHref + '" class="nav-link' + aboutActive + '">About</a>'
        + '<a href="' + projectsHref + '" class="nav-link' + workActive + '">Work</a>'
        + '<a href="mailto:rishirameshdesign@gmail.com" class="nav-link">Email</a>'
        + '</nav></div>';

    var placeholder = document.getElementById('button-stack');
    if (placeholder) {
        placeholder.innerHTML = navHTML;
    }
}

// ─── Navigation ─────────────────────────────────────────────────────
function initializeNavigation() {
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

// ─── Deferred Videos ───────────────────────────────────────────────
function initializeDeferredVideos() {
    var videos = document.querySelectorAll('video[data-deferred-video]');
    if (!videos.length) return;

    function loadVideo(video) {
        if (video.dataset.loaded === 'true') return;

        video.querySelectorAll('source[data-src]').forEach(function (source) {
            source.src = source.dataset.src;
            source.removeAttribute('data-src');
        });

        video.dataset.loaded = 'true';
        video.load();
        var playPromise = video.play();
        if (playPromise) playPromise.catch(function () {});
    }

    if (!('IntersectionObserver' in window)) {
        videos.forEach(loadVideo);
        return;
    }

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            loadVideo(entry.target);
            observer.unobserve(entry.target);
        });
    }, { rootMargin: '600px 0px' });

    videos.forEach(function (video) { observer.observe(video); });
}

// ─── Initialization ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
    if (history.scrollRestoration) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);

    renderButtonStack();
    initializeNavigation();
    initializeBackToTop();
    initializeDeferredVideos();
});
