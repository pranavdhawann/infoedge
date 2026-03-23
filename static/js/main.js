// Main JavaScript for Stock Sentiment Analyzer — Dark Glass Terminal

document.addEventListener('DOMContentLoaded', function() {
    // Top nav hamburger menu
    const hamburger = document.getElementById('navHamburger');
    const navLinks = document.getElementById('navLinks');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('show');
            const icon = this.querySelector('i');
            icon.className = navLinks.classList.contains('show') ? 'fas fa-times' : 'fas fa-bars';
        });

        navLinks.querySelectorAll('.nav-link-item').forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    navLinks.classList.remove('show');
                    hamburger.querySelector('i').className = 'fas fa-bars';
                }
            });
        });

        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                navLinks.classList.remove('show');
                hamburger.querySelector('i').className = 'fas fa-bars';
            }
        });
    }

    // Active nav link highlighting
    // Skip tab links (data-tab) — those are managed by index-page.js
    const currentPath = window.location.pathname;
    document.querySelectorAll('.nav-link-item').forEach(link => {
        if (!link.dataset.tab && link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });

    // Responsive search placeholder
    function updateSearchPlaceholder() {
        const input = document.getElementById('stockSearch');
        if (!input) return;
        if (window.innerWidth <= 480) {
            input.placeholder = 'Search stock (e.g., AAPL)';
        } else if (window.innerWidth <= 768) {
            input.placeholder = 'Enter stock symbol (e.g., AAPL, TSLA)';
        } else {
            input.placeholder = 'Enter stock symbol or company name (e.g., AAPL, TSLA, Microsoft)';
        }
    }
    updateSearchPlaceholder();
    window.addEventListener('resize', debounce(updateSearchPlaceholder, 150));

    // Initialize tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            if (href && href.length > 1) {
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });

    // Fade-in animation on scroll
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

    document.querySelectorAll('.card').forEach(card => {
        card.classList.add('fade-in');
        observer.observe(card);
    });

    // Global error handler
    window.addEventListener('unhandledrejection', function(event) {
        console.error('Unhandled promise rejection:', event.reason);
    });

    // Accessibility
    function improveAccessibility() {
        const searchInput = document.getElementById('stockSearch');
        if (searchInput) {
            searchInput.setAttribute('aria-label', 'Search for stock symbol or company name');
        }
        const autocompleteDropdown = document.getElementById('autocompleteDropdown');
        if (autocompleteDropdown) {
            autocompleteDropdown.setAttribute('role', 'listbox');
            autocompleteDropdown.setAttribute('aria-label', 'Stock search suggestions');
        }
    }
    improveAccessibility();

    // Back to top
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        window.addEventListener('scroll', function() {
            backToTopBtn.classList.toggle('visible', window.pageYOffset > 300);
        });
    }

    // Weekend / market closed indicator
    const statusDot = document.getElementById('statusDot');
    const statusLabel = document.getElementById('statusLabel');
    if (statusDot && statusLabel) {
        const day = new Date().getDay();
        if (day === 0 || day === 6) {
            statusDot.classList.add('closed');
            statusDot.title = 'Market Closed';
            statusLabel.textContent = 'MARKET CLOSED';
        }
    }
});

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

