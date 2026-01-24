/**
 * Advanced Image Loading System
 * Loads low-quality placeholders first, then full-quality images
 */

class AdvancedImageLoader {
    constructor() {
        this.placeholderCache = new Map();
        this.loadedImages = new Set();
        this.isSlowConnection = this.detectSlowConnection();
    }

    detectSlowConnection() {
        // Detect slow connections using Network Information API
        if ('connection' in navigator) {
            const connection = navigator.connection;
            return connection.effectiveType === 'slow-2g' || 
                   connection.effectiveType === '2g' ||
                   connection.downlink < 0.5; // Less than 0.5 Mbps
        }
        return false;
    }

    // Create tiny placeholder from full image (10% quality)
    async createPlaceholder(src) {
        return new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = 'Anonymous';
            
            img.onload = () => {
                // Create canvas for tiny placeholder
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // Make it really small (10% of original size)
                canvas.width = Math.max(1, img.width * 0.1);
                canvas.height = Math.max(1, img.height * 0.1);
                
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                
                // Convert to low-quality data URL
                const placeholder = canvas.toDataURL('image/jpeg', 0.1);
                this.placeholderCache.set(src, placeholder);
                resolve(placeholder);
            };
            
            img.src = src;
        });
    }

    // Load image with progressive enhancement
    async loadImage(element, fullSrc) {
        if (this.loadedImages.has(fullSrc)) return;

        try {
            // For slow connections, use aggressive optimization
            if (this.isSlowConnection) {
                element.style.filter = 'blur(2px) brightness(1.1)';
                element.style.transform = 'scale(0.95)';
            }

            // Load full quality image
            const img = new Image();
            img.decoding = 'async';
            
            img.onload = () => {
                element.src = fullSrc;
                element.classList.add('fully-loaded');
                
                // Remove optimization effects
                if (this.isSlowConnection) {
                    element.style.filter = '';
                    element.style.transform = '';
                }
                
                this.loadedImages.add(fullSrc);
            };

            img.onerror = () => {
                console.error('Failed to load image:', fullSrc);
                // Fallback to placeholder if available
                if (this.placeholderCache.has(fullSrc)) {
                    element.src = this.placeholderCache.get(fullSrc);
                }
            };

            img.src = fullSrc;

        } catch (error) {
            console.error('Image loading error:', error);
        }
    }

    // Initialize advanced loading for all images
    init() {
        const images = document.querySelectorAll('img[data-fullsrc]');
        
        images.forEach(async (img) => {
            const fullSrc = img.getAttribute('data-fullsrc');
            if (!fullSrc) return;

            // Create placeholder first
            if (!this.placeholderCache.has(fullSrc)) {
                try {
                    const placeholder = await this.createPlaceholder(fullSrc);
                    img.src = placeholder;
                } catch (error) {
                    // If placeholder fails, use original
                    img.src = fullSrc;
                }
            } else {
                img.src = this.placeholderCache.get(fullSrc);
            }

            // Load full image after a delay or on interaction
            if (this.isSlowConnection) {
                // Very delayed loading for slow connections
                setTimeout(() => {
                    this.loadImage(img, fullSrc);
                }, 3000);
            } else {
                // Normal loading with intersection observer
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            this.loadImage(img, fullSrc);
                            observer.unobserve(img);
                        }
                    });
                }, { rootMargin: '100px' });

                observer.observe(img);
            }
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const loader = new AdvancedImageLoader();
    loader.init();
});

// Also initialize after page load for any dynamically added images
window.addEventListener('load', () => {
    const loader = new AdvancedImageLoader();
    loader.init();
});