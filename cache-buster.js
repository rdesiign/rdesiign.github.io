/**
 * Global Cache-Busting System for rdesiign.github.io
 * Ensures all assets are always fresh by appending unique timestamps
 */

(function() {
    'use strict';
    
    // Generate unique cache-busting string
    const CACHE_BUST = Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    const VERSION = '3.0';
    
    console.log(`🔄 Global Cache-Buster v${VERSION} Active - ID: ${CACHE_BUST}`);
    
    // Cache-bust CSS files
    function cacheBustCSS() {
        const links = document.querySelectorAll('link[rel="stylesheet"]');
        links.forEach(link => {
            const href = link.getAttribute('href');
            if (href && !href.includes('?')) {
                link.href = href + '?cb=' + CACHE_BUST;
                console.log('Cache-busted CSS:', href);
            }
        });
    }
    
    // Cache-bust JavaScript files
    function cacheBustJS() {
        const scripts = document.querySelectorAll('script[src]');
        scripts.forEach(script => {
            const src = script.getAttribute('src');
            if (src && !src.includes('?cb=') && !src.includes('cache-buster')) {
                const newScript = document.createElement('script');
                newScript.src = src + '?cb=' + CACHE_BUST;
                newScript.async = script.async;
                newScript.defer = script.defer;
                
                // Copy all attributes
                Array.from(script.attributes).forEach(attr => {
                    if (attr.name !== 'src') {
                        newScript.setAttribute(attr.name, attr.value);
                    }
                });
                
                script.parentNode.replaceChild(newScript, script);
                console.log('Cache-busted JS:', src);
            }
        });
    }
    
    // Cache-bust images
    function cacheBustImages() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            const src = img.getAttribute('src');
            if (src && !src.includes('?cb=') && !src.startsWith('data:')) {
                img.src = src + '?cb=' + CACHE_BUST;
                console.log('Cache-busted Image:', src);
            }
        });
    }
    
    // Cache-bust background images in CSS
    function cacheBustBackgroundImages() {
        const elements = document.querySelectorAll('*');
        elements.forEach(element => {
            const style = window.getComputedStyle(element);
            const bgImage = style.backgroundImage;
            if (bgImage && bgImage !== 'none' && bgImage.includes('url(')) {
                const urlMatch = bgImage.match(/url\(['"]?([^'"]*?)['"]?\)/);
                if (urlMatch && urlMatch[1] && !urlMatch[1].includes('?cb=')) {
                    element.style.backgroundImage = `url("${urlMatch[1]}?cb=${CACHE_BUST}")`;
                    console.log('Cache-busted Background:', urlMatch[1]);
                }
            }
        });
    }
    
    // Clear browser caches
    function clearBrowserCache() {
        if ('caches' in window) {
            caches.keys().then(function(names) {
                names.forEach(function(name) {
                    caches.delete(name);
                    console.log('Cleared cache:', name);
                });
            });
        }
        
        // Clear localStorage cache entries
        try {
            Object.keys(localStorage).forEach(key => {
                if (key.includes('cache') || key.includes('asset')) {
                    localStorage.removeItem(key);
                    console.log('Cleared localStorage:', key);
                }
            });
        } catch (e) {
            console.log('localStorage clearing skipped:', e.message);
        }
    }
    
    // Set aggressive no-cache headers via meta tags
    function setNoCacheHeaders() {
        const metaTags = [
            { name: 'Cache-Control', content: 'no-cache, no-store, must-revalidate, max-age=0' },
            { name: 'Pragma', content: 'no-cache' },
            { name: 'Expires', content: '0' },
            { name: 'Last-Modified', content: new Date().toISOString() },
            { name: 'ETag', content: CACHE_BUST }
        ];
        
        metaTags.forEach(tag => {
            let meta = document.querySelector(`meta[http-equiv="${tag.name}"]`);
            if (!meta) {
                meta = document.createElement('meta');
                meta.setAttribute('http-equiv', tag.name);
                document.head.appendChild(meta);
            }
            meta.setAttribute('content', tag.content);
        });
    }
    
    // Monitor for dynamically added elements
    function setupDynamicCacheBusting() {
        if (typeof MutationObserver !== 'undefined') {
            const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === 1) { // Element node
                            // Cache-bust new images
                            if (node.tagName === 'IMG') {
                                const src = node.getAttribute('src');
                                if (src && !src.includes('?cb=')) {
                                    node.src = src + '?cb=' + CACHE_BUST;
                                }
                            }
                            
                            // Cache-bust new scripts
                            if (node.tagName === 'SCRIPT' && node.src) {
                                const src = node.getAttribute('src');
                                if (src && !src.includes('?cb=')) {
                                    node.src = src + '?cb=' + CACHE_BUST;
                                }
                            }
                            
                            // Cache-bust new stylesheets
                            if (node.tagName === 'LINK' && node.rel === 'stylesheet') {
                                const href = node.getAttribute('href');
                                if (href && !href.includes('?cb=')) {
                                    node.href = href + '?cb=' + CACHE_BUST;
                                }
                            }
                        }
                    });
                });
            });
            
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    }
    
    // Force reload on focus (for when user returns to tab)
    function setupFocusReload() {
        let isHidden = false;
        
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                isHidden = true;
            } else if (isHidden) {
                // User returned to tab, check if we need to reload
                const lastBust = sessionStorage.getItem('lastCacheBust');
                if (lastBust && lastBust !== CACHE_BUST) {
                    console.log('🔄 Tab focus detected - refreshing for latest content');
                    window.location.reload(true);
                }
                isHidden = false;
            }
        });
        
        sessionStorage.setItem('lastCacheBust', CACHE_BUST);
    }
    
    // Listen for service worker messages
    function setupServiceWorkerListener() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.addEventListener('message', function(event) {
                if (event.data && event.data.type === 'CACHE_UPDATED') {
                    console.log('🔄 Service Worker cache updated - version:', event.data.version);
                    // Optionally reload the page for fresh content
                    setTimeout(() => {
                        window.location.reload(true);
                    }, 1000);
                }
            });
        }
    }
    
    // Initialize cache-busting system
    function init() {
        console.log('🚀 Initializing Global Cache-Busting System...');
        
        setNoCacheHeaders();
        clearBrowserCache();
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                cacheBustCSS();
                cacheBustJS();
                setTimeout(() => {
                    cacheBustImages();
                    cacheBustBackgroundImages();
                }, 100);
                setupDynamicCacheBusting();
                setupFocusReload();
                setupServiceWorkerListener();
            });
        } else {
            cacheBustCSS();
            cacheBustJS();
            setTimeout(() => {
                cacheBustImages();
                cacheBustBackgroundImages();
            }, 100);
            setupDynamicCacheBusting();
            setupFocusReload();
            setupServiceWorkerListener();
        }
        
        console.log('✅ Cache-Busting System Initialized');
    }
    
    // Expose global cache-busting function
    window.cacheBust = {
        version: VERSION,
        id: CACHE_BUST,
        refresh: function() {
            window.location.reload(true);
        },
        assets: function() {
            cacheBustImages();
            cacheBustBackgroundImages();
        }
    };
    
    // Start the system
    init();
})();