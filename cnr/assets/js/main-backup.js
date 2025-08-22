/**
 * CNR - Comunicação Corporativa
 * Main JavaScript file for interactive features
 * Features: Mobile menu, smooth scroll, form validation, back-to-top, animations
 */

(function() {
    'use strict';

    // DOM elements
    const elements = {
        navToggle: document.getElementById('nav-toggle'),
        navMenu: document.getElementById('nav-menu'),
        navClose: document.getElementById('nav-close'),
        navLinks: document.querySelectorAll('.nav__link'),
        backToTop: document.getElementById('back-to-top'),
        contactForm: document.getElementById('contact-form'),
        phoneInput: document.getElementById('phone'),
        header: document.getElementById('header')
    };

    // Initialize all features when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        initMobileMenu();
        initSmoothScroll();
        initBackToTop();
        initFormValidation();
        initPhoneMask();
        initScrollAnimations();
        initHeaderScroll();
    });

    /**
     * Mobile Menu Toggle
     */
    function initMobileMenu() {
        if (!elements.navToggle || !elements.navMenu || !elements.navClose) return;

        // Open menu
        elements.navToggle.addEventListener('click', function() {
            elements.navMenu.classList.add('show');
            document.body.style.overflow = 'hidden'; // Prevent background scroll
        });

        // Close menu
        elements.navClose.addEventListener('click', closeMenu);

        // Close menu when clicking on nav links
        elements.navLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!elements.navMenu.contains(e.target) && !elements.navToggle.contains(e.target)) {
                closeMenu();
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeMenu();
            }
        });

        function closeMenu() {
            elements.navMenu.classList.remove('show');
            document.body.style.overflow = ''; // Restore scroll
        }
    }

    /**
     * Smooth Scroll for Anchor Links
     */
    function initSmoothScroll() {
        // Handle all anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const headerHeight = elements.header ? elements.header.offsetHeight : 70;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    /**
     * Back to Top Button
     */
    function initBackToTop() {
        if (!elements.backToTop) return;

        // Show/hide button based on scroll position
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                elements.backToTop.classList.add('show');
            } else {
                elements.backToTop.classList.remove('show');
            }
        });

        // Scroll to top when clicked
        elements.backToTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    /**
     * Header Scroll Effect
     */
    function initHeaderScroll() {
        if (!elements.header) return;

        let lastScrollTop = 0;
        
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Add shadow when scrolled
            if (scrollTop > 10) {
                elements.header.style.boxShadow = '0 2px 20px rgba(0, 51, 102, 0.15)';
            } else {
                elements.header.style.boxShadow = '0 2px 8px rgba(0, 51, 102, 0.1)';
            }
            
            lastScrollTop = scrollTop;
        });
    }

    /**
     * Form Validation
     */
    function initFormValidation() {
        if (!elements.contactForm) return;

        const formFields = {
            name: elements.contactForm.querySelector('#name'),
            email: elements.contactForm.querySelector('#email'),
            phone: elements.contactForm.querySelector('#phone'),
            message: elements.contactForm.querySelector('#message')
        };

        // Real-time validation
        Object.keys(formFields).forEach(fieldName => {
            const field = formFields[fieldName];
            if (field) {
                field.addEventListener('blur', () => validateField(field));
                field.addEventListener('input', () => clearError(field));
            }
        });

        // Form submission
        elements.contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            
            // Validate all fields
            Object.keys(formFields).forEach(fieldName => {
                const field = formFields[fieldName];
                if (field && !validateField(field)) {
                    isValid = false;
                }
            });

            if (isValid) {
                handleFormSubmission();
            }
        });

        function validateField(field) {
            const value = field.value.trim();
            const fieldName = field.name;
            let isValid = true;
            let errorMessage = '';

            // Clear previous error
            clearError(field);

            // Required field validation
            if (field.hasAttribute('required') && !value) {
                errorMessage = 'Este campo é obrigatório.';
                isValid = false;
            }
            // Email validation
            else if (fieldName === 'email' && value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    errorMessage = 'Por favor, insira um e-mail válido.';
                    isValid = false;
                }
            }
            // Phone validation (optional but if filled, must be valid)
            else if (fieldName === 'phone' && value) {
                const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
                if (!phoneRegex.test(value)) {
                    errorMessage = 'Por favor, insira um telefone válido. Ex: (11) 99999-9999';
                    isValid = false;
                }
            }
            // Name validation
            else if (fieldName === 'name' && value) {
                if (value.length < 2) {
                    errorMessage = 'Nome deve ter pelo menos 2 caracteres.';
                    isValid = false;
                }
            }
            // Message validation
            else if (fieldName === 'message' && value) {
                if (value.length < 10) {
                    errorMessage = 'Mensagem deve ter pelo menos 10 caracteres.';
                    isValid = false;
                }
            }

            if (!isValid) {
                showError(field, errorMessage);
            }

            return isValid;
        }

        function showError(field, message) {
            const errorElement = document.getElementById(field.name + '-error');
            if (errorElement) {
                errorElement.textContent = message;
                field.classList.add('error');
            }
        }

        function clearError(field) {
            const errorElement = document.getElementById(field.name + '-error');
            if (errorElement) {
                errorElement.textContent = '';
                field.classList.remove('error');
            }
        }

        function handleFormSubmission() {
            // Show success message
            const submitButton = elements.contactForm.querySelector('.form__submit');
            const originalText = submitButton.textContent;
            
            submitButton.textContent = 'Enviando...';
            submitButton.disabled = true;
            
            // Simulate form submission (replace with actual form handling)
            setTimeout(() => {
                alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
                elements.contactForm.reset();
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }, 1500);
        }
    }

    /**
     * Phone Number Mask
     */
    function initPhoneMask() {
        if (!elements.phoneInput) return;

        elements.phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
            
            // Apply mask based on length
            if (value.length <= 11) {
                if (value.length <= 2) {
                    value = value.replace(/(\d{0,2})/, '($1');
                } else if (value.length <= 6) {
                    value = value.replace(/(\d{2})(\d{0,4})/, '($1) $2');
                } else if (value.length <= 10) {
                    value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
                } else {
                    value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
                }
            }
            
            e.target.value = value;
        });

        // Handle backspace
        elements.phoneInput.addEventListener('keydown', function(e) {
            if (e.key === 'Backspace') {
                const value = e.target.value;
                if (value.endsWith(') ') || value.endsWith('-')) {
                    e.target.value = value.slice(0, -1);
                }
            }
        });
    }

    /**
     * Scroll Animations using Intersection Observer
     */
    function initScrollAnimations() {
        // Check if user prefers reduced motion
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in-up');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const animateElements = document.querySelectorAll(
            '.card, .differential__item, .timeline__item, .stat__item, .client__item, .section__title'
        );

        animateElements.forEach(el => {
            observer.observe(el);
        });

        // Special animation for timeline items (alternating left/right)
        const timelineItems = document.querySelectorAll('.timeline__item');
        timelineItems.forEach((item, index) => {
            const timelineObserver = new IntersectionObserver(function(entries) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        if (index % 2 === 0) {
                            entry.target.classList.add('animate-fade-in-left');
                        } else {
                            entry.target.classList.add('animate-fade-in-right');
                        }
                        timelineObserver.unobserve(entry.target);
                    }
                });
            }, observerOptions);

            timelineObserver.observe(item);
        });
    }

    /**
     * Utility Functions
     */
    
    // Debounce function for performance optimization
    function debounce(func, wait) {
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

    // Throttle function for scroll events
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Error handling
    window.addEventListener('error', function(e) {
        console.error('JavaScript Error:', e.error);
        // In production, you might want to send this to an error tracking service
    });

    // Performance monitoring (optional)
    if ('performance' in window) {
        window.addEventListener('load', function() {
            setTimeout(function() {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log('Page Load Time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
            }, 0);
        });
    }

    // Accessibility improvements
    document.addEventListener('keydown', function(e) {
        // Skip to main content with Tab key
        if (e.key === 'Tab' && !e.shiftKey && document.activeElement === document.body) {
            const mainContent = document.querySelector('main');
            if (mainContent) {
                mainContent.focus();
            }
        }
    });

    // Add focus indicators for keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });

    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });

})();

/**
 * MINIFICATION NOTES:
 * 1. Remove all comments and console.log statements
 * 2. Minify variable names (but keep meaningful ones for debugging)
 * 3. Remove unnecessary whitespace and newlines
 * 4. Combine similar functions where possible
 * 5. Use shorter syntax where applicable (arrow functions, ternary operators)
 * 6. Consider using a build tool like Terser for automatic minification
 */
