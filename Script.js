/* ===================================
   CYCLISTE - Optimized JavaScript
   Performance-First Implementation
   =================================== */

'use strict';

// ===================================
// CONFIGURATION
// ===================================
const CONFIG = {
    scrollThreshold: 50,
    backToTopThreshold: 300,
    debounceDelay: 150,
    loadingDelay: 800
};

// ===================================
// DOM ELEMENTS CACHE
// ===================================
const DOM = {
    loader: null,
    navbar: null,
    mobileToggle: null,
    mobileMenu: null,
    mobileClose: null,
    mobileLinks: null,
    filterBtns: null,
    bikeCards: null,
    backToTop: null,
    contactForm: null,
    navLinks: null
};

// ===================================
// UTILITY FUNCTIONS
// ===================================

/**
 * Debounce function for performance optimization
 */
const debounce = (func, wait = CONFIG.debounceDelay) => {
    let timeout;
    return function executedFunction(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
};

/**
 * Check if element is in viewport
 */
const isInViewport = (element) => {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= window.innerHeight &&
        rect.right <= window.innerWidth
    );
};

/**
 * Add multiple event listeners
 */
const addEvents = (element, events, handler) => {
    events.split(' ').forEach(event => element.addEventListener(event, handler));
};

/**
 * Remove multiple event listeners
 */
const removeEvents = (element, events, handler) => {
    events.split(' ').forEach(event => element.removeEventListener(event, handler));
};

// ===================================
// CACHE DOM ELEMENTS
// ===================================
const cacheDOMElements = () => {
    DOM.loader = document.getElementById('loader');
    DOM.navbar = document.getElementById('navbar');
    DOM.mobileToggle = document.getElementById('mobile-toggle');
    DOM.mobileMenu = document.getElementById('mobile-menu');
    DOM.mobileClose = document.getElementById('mobile-close');
    DOM.mobileLinks = document.querySelectorAll('.mobile-link');
    DOM.filterBtns = document.querySelectorAll('.filter-btn');
    DOM.bikeCards = document.querySelectorAll('.bike-card');
    DOM.backToTop = document.getElementById('backToTop');
    DOM.contactForm = document.getElementById('contact-form');
    DOM.navLinks = document.querySelectorAll('a[href^="#"]');
};

// ===================================
// LOADING SCREEN
// ===================================
const initLoader = () => {
    // Hide loader after page load
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (DOM.loader) {
                DOM.loader.style.opacity = '0';
                setTimeout(() => {
                    DOM.loader.style.display = 'none';
                }, 300);
            }
        }, CONFIG.loadingDelay);
    });
};

// ===================================
// NAVIGATION
// ===================================

/**
 * Handle navbar scroll effect
 */
const handleNavbarScroll = debounce(() => {
    if (!DOM.navbar) return;
    
    if (window.scrollY > CONFIG.scrollThreshold) {
        DOM.navbar.classList.add('scrolled');
    } else {
        DOM.navbar.classList.remove('scrolled');
    }
}, 10);

/**
 * Toggle mobile menu
 */
const toggleMobileMenu = (show) => {
    if (!DOM.mobileMenu) return;
    
    if (show) {
        DOM.mobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
    } else {
        DOM.mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
};

/**
 * Initialize navigation
 */
const initNavigation = () => {
    // Scroll effect
    window.addEventListener('scroll', handleNavbarScroll, { passive: true });
    
    // Mobile toggle
    if (DOM.mobileToggle) {
        DOM.mobileToggle.addEventListener('click', () => toggleMobileMenu(true));
    }
    
    // Mobile close
    if (DOM.mobileClose) {
        DOM.mobileClose.addEventListener('click', () => toggleMobileMenu(false));
    }
    
    // Close on link click
    if (DOM.mobileLinks) {
        DOM.mobileLinks.forEach(link => {
            link.addEventListener('click', () => toggleMobileMenu(false));
        });
    }
    
    // Close on outside click
    if (DOM.mobileMenu) {
        DOM.mobileMenu.addEventListener('click', (e) => {
            if (e.target === DOM.mobileMenu) {
                toggleMobileMenu(false);
            }
        });
    }
};

// ===================================
// SMOOTH SCROLL
// ===================================
const initSmoothScroll = () => {
    if (!DOM.navLinks) return;
    
    DOM.navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Only for internal links
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
};

// ===================================
// CATEGORY FILTER
// ===================================

/**
 * Filter bikes by category
 */
const filterBikes = (category) => {
    if (!DOM.bikeCards) return;
    
    DOM.bikeCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        const shouldShow = category === 'all' || cardCategory === category;
        
        if (shouldShow) {
            card.style.display = 'block';
            // Trigger reflow for animation
            void card.offsetWidth;
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
};

/**
 * Initialize category filter
 */
const initCategoryFilter = () => {
    if (!DOM.filterBtns) return;
    
    DOM.filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active state
            DOM.filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filter bikes
            const category = this.getAttribute('data-category');
            filterBikes(category);
        });
    });
};

// ===================================
// BACK TO TOP
// ===================================

/**
 * Handle back to top visibility
 */
const handleBackToTop = debounce(() => {
    if (!DOM.backToTop) return;
    
    if (window.scrollY > CONFIG.backToTopThreshold) {
        DOM.backToTop.classList.add('visible');
    } else {
        DOM.backToTop.classList.remove('visible');
    }
}, 100);

/**
 * Initialize back to top button
 */
const initBackToTop = () => {
    if (!DOM.backToTop) return;
    
    // Show/hide on scroll
    window.addEventListener('scroll', handleBackToTop, { passive: true });
    
    // Click handler
    DOM.backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
};

// ===================================
// CONTACT FORM
// ===================================
const initContactForm = () => {
    if (!DOM.contactForm) return;
    
    DOM.contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Show success message
        alert('شكراً لرسالتك! سنتواصل معك قريباً.');
        
        // Reset form
        this.reset();
    });
};

// ===================================
// AOS (ANIMATE ON SCROLL)
// ===================================
const initAOS = () => {
    // Check if AOS is loaded
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 100,
            easing: 'ease-out-cubic',
            disable: 'mobile' // Disable on mobile for better performance
        });
    }
};

// ===================================
// LAZY LOADING IMAGES
// ===================================
const initLazyLoading = () => {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                }
            });
        }, {
            rootMargin: '50px'
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
};

// ===================================
// PERFORMANCE MONITORING
// ===================================
const logPerformance = () => {
    if (window.performance && window.performance.timing) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = window.performance.timing;
                const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
                const connectTime = perfData.responseEnd - perfData.requestStart;
                
                console.log(`%c⚡ Performance Stats`, 'color: #dc2626; font-weight: bold; font-size: 14px;');
                console.log(`Page Load Time: ${pageLoadTime}ms`);
                console.log(`Server Response: ${connectTime}ms`);
            }, 0);
        });
    }
};

// ===================================
// INITIALIZATION
// ===================================
const init = () => {
    // Cache DOM elements first
    cacheDOMElements();
    
    // Initialize features
    initLoader();
    initNavigation();
    initSmoothScroll();
    initCategoryFilter();
    initBackToTop();
    initContactForm();
    initLazyLoading();
    
    // Initialize AOS when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAOS);
    } else {
        initAOS();
    }
    
    // Log performance in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        logPerformance();
    }
    
    // Log initialization
    console.log('%c🏍️ CYCLISTE', 'color: #dc2626; font-size: 24px; font-weight: bold;');
    console.log('%c✅ Website initialized successfully', 'color: #10b981; font-size: 14px;');
};

// ===================================
// START APPLICATION
// ===================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// ===================================
// CLEANUP ON UNLOAD
// ===================================
window.addEventListener('beforeunload', () => {
    // Remove scroll listener
    window.removeEventListener('scroll', handleNavbarScroll);
    window.removeEventListener('scroll', handleBackToTop);
    
    // Clear any timeouts
    document.querySelectorAll('*').forEach(el => {
        const id = parseInt(el.dataset.timeoutId);
        if (id) clearTimeout(id);
    });
});

// ===================================
// EXPORT FOR MODULE USAGE (OPTIONAL)
// ===================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        init,
        filterBikes,
        toggleMobileMenu
    };
}