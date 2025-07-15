// === Home Page Logic ===
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the home page
    if (document.querySelector('.home-page-wrapper')) {
        // Mobile Navigation Toggle
        const mobileNavToggle = document.getElementById('mobileNavToggle');
        const mobileNavOverlay = document.getElementById('mobileNavOverlay');
        const closeMobileNav = document.getElementById('closeMobileNav');
        const mobileLoginIcon = document.getElementById('mobileLoginIcon');
        
        if (mobileNavToggle && mobileNavOverlay) {
            mobileNavToggle.addEventListener('click', function() {
                mobileNavOverlay.style.width = '100%';
            });
        }
        
        if (closeMobileNav) {
            closeMobileNav.addEventListener('click', function() {
                mobileNavOverlay.style.width = '0';
            });
        }
        
        if (mobileLoginIcon) {
            mobileLoginIcon.addEventListener('click', function() {
                window.location.href = 'C:\\Users\\AL_YOUSSEF\\Desktop\\Hala 2\\Entry\\login.html';
            });
        }
        
        // Desktop Login Button
        const loginButton = document.getElementById('loginButton');
        if (loginButton) {
            loginButton.addEventListener('click', function() {
                window.location.href = 'C:\\Users\\AL_YOUSSEF\\Desktop\\Hala 2\\Entry\\login.html';
            });
        }

         // Header background change on scroll
        window.addEventListener('scroll', function() {
            const header = document.querySelector('header');
            if (header) {
                if (window.scrollY > 50) {
                    header.style.backgroundColor = 'rgba(13, 13, 13, 0.9)';
                } else {
                    header.style.backgroundColor = 'transparent';
                }
            }
        });
            // === Blog Card Interaction Logic ===
    const blogCards = document.querySelectorAll('.blog-card');

    blogCards.forEach(card => {
        const heartIcon = card.querySelector('.heart-icon');
        const isMobileOrTabletView = window.matchMedia("(max-width: 768px)").matches;

        // Heart Icon Click Logic
        if (heartIcon) {
            heartIcon.addEventListener('click', function(event) {
                event.stopPropagation(); // Prevent the card flip/hover from triggering
                heartIcon.classList.toggle('liked');
                // You could add logic here to save the liked state to a backend
            });
        }

        // Card Flip/Hover Logic
        if (isMobileOrTabletView) {
            // For mobile/tablet, toggle 'flipped' class on click
            card.addEventListener('click', function() {
                card.classList.toggle('flipped');
            });
        } else {
            // For desktop, CSS :hover handles the effect. No JS needed for hover.
            // Ensure no 'flipped' class is present from previous mobile interaction
            card.classList.remove('flipped');
        }
       }
    )}
});
