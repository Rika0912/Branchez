// script.js

// === Layout Page Logic ===
let currentVideoIndex = 1; // Start at 0 for array indexing
const layoutAnimationVideo = document.getElementById('layout-animation-video');
const layoutVideoSource = document.getElementById('layout-video-source');
const layoutPageBody = document.querySelector('.layout-page');

// Define video sources for different device types
const desktopVideos = [
    'assets//frame 1.mp4', // Desktop Part 1
    'assets//frame 2.mp4', // Desktop Part 2
    'assets//frame 3.mp4', // Desktop Part 3
    'assets//frame 4.mp4'  // Desktop Part 4
];

const mobileTabletVideos = [
    'assets//cracking egg 1-1.mp4', // Mobile/Tablet Part 1 (PLACEHOLDER - REPLACE WITH YOUR ACTUAL MOBILE VIDEO PATHS)
    'assets//1-2.mp4', // Mobile/Tablet Part 2
    'assets//cracking egg 1-3.mp4', // Mobile/Tablet Part 3
    'assets//cracking egg 1-4.mp4'  // Mobile/Tablet Part 4
];

// Create an Audio object for the breaking shell sound
const shellBreakSound = new Audio('https://freesound.org/data/previews/321/321151_5482392-lq.mp3');
shellBreakSound.volume = 0.7;

if (layoutPageBody && layoutAnimationVideo && layoutVideoSource) {
    let activeVideos;
    let nextVideoElement = null; // To pre-load the next video

    // Determine which set of videos to use based on screen width
    const isMobileOrTablet = window.matchMedia("(max-width: 768px)").matches;
    if (isMobileOrTablet) {
        activeVideos = mobileTabletVideos;
        console.log("Loading mobile/tablet videos.");
    } else {
        activeVideos = desktopVideos;
        console.log("Loading desktop videos.");
    }

    // Function to load and play a specific video
    function loadAndPlayVideo(videoIndex) {
        if (videoIndex >= activeVideos.length) {
            console.log("All videos played. Redirecting to home.html");
            window.location.href = 'home.html';
            return;
        }

        const videoPath = activeVideos[videoIndex];
        console.log(`Loading video: ${videoPath}`);

        // Set the source and load
        layoutVideoSource.src = videoPath;
        layoutAnimationVideo.load();

        // Play the video once it's ready
        layoutAnimationVideo.oncanplaythrough = () => {
            layoutAnimationVideo.play().catch(e => console.error(`Error playing video ${videoPath}:`, e));
            // Pre-load the next video if available
            if (videoIndex + 1 < activeVideos.length) {
                preloadNextVideo(videoIndex + 1);
            }
        };

        layoutAnimationVideo.onerror = (e) => {
            console.error('Video playback error for:', videoPath, e);
        };
    }

    // Function to preload the next video
    function preloadNextVideo(indexToPreload) {
        if (indexToPreload < activeVideos.length) {
            console.log(`Preloading video: ${activeVideos[indexToPreload]}`);
            if (!nextVideoElement) {
                nextVideoElement = document.createElement('video');
                nextVideoElement.style.display = 'none'; // Keep it hidden
                nextVideoElement.muted = true; // Mute preloaded video
                nextVideoElement.preload = 'auto'; // Important for preloading
                document.body.appendChild(nextVideoElement); // Add to DOM but hidden
            }
            nextVideoElement.src = activeVideos[indexToPreload];
            nextVideoElement.load();
        }
    }

    // Handle interaction to start the first video and subsequent transitions
    function handleLayoutPageInteraction(event) {
        event.preventDefault();

        // Only play sound if it's not the first video and a new video is starting
        if (currentVideoIndex > 0 && currentVideoIndex < activeVideos.length) {
            shellBreakSound.currentTime = 0; // Rewind sound to start
            shellBreakSound.play().catch(e => console.error("Error playing sound:", e));
        }

        // If the current video has ended, or it's the very first interaction
        // and we haven't started playing yet
        if (layoutAnimationVideo.ended || layoutAnimationVideo.paused) {
            // If there's a preloaded video, swap it in instantly
            if (nextVideoElement && nextVideoElement.src === activeVideos[currentVideoIndex]) {
                layoutAnimationVideo.src = nextVideoElement.src;
                layoutAnimationVideo.load(); // Load immediately from preloaded source
                layoutAnimationVideo.play().catch(e => console.error("Error playing preloaded video:", e));
                console.log(`Swapped to preloaded video ${currentVideoIndex + 1}`);

                // Remove the preloaded element, it will be recreated for the next one
                document.body.removeChild(nextVideoElement);
                nextVideoElement = null;

                // Pre-load the *next* next video
                if (currentVideoIndex + 1 < activeVideos.length) {
                    preloadNextVideo(currentVideoIndex + 1);
                }
            } else {
                // Otherwise, load and play the next video normally (this should ideally not happen
                // if preloading works correctly for subsequent videos after the first)
                loadAndPlayVideo(currentVideoIndex);
            }
        }

        // Increment index for the next interaction
        currentVideoIndex++;

        // Set up redirection for the very last video
        if (currentVideoIndex === activeVideos.length) { // This means the video at currentVideoIndex-1 is the last one
            layoutAnimationVideo.onended = () => {
                console.log("Last video ended. Redirecting to home.html");
                window.location.href = 'home.html';
            };
        }
    }

    // Initial setup: Show the video element but keep it paused until interaction
    layoutAnimationVideo.style.display = 'block';
    layoutAnimationVideo.muted = true; // Start muted due to autoplay policies
    layoutVideoSource.src = activeVideos[currentVideoIndex];
    layoutAnimationVideo.load();

    // Debugging listeners (optional, keep for development)
    layoutAnimationVideo.addEventListener('error', (e) => {
        console.error('Video playback error:', layoutVideoSource.src, e);
    });
    layoutAnimationVideo.addEventListener('loadeddata', () => {
        console.log(`Video loaded data: ${layoutVideoSource.src}`);
    });
    layoutAnimationVideo.addEventListener('canplay', () => {
        console.log(`Video can play: ${layoutVideoSource.src}`);
    });

    // Event listeners for clicks/taps to advance videos
    layoutPageBody.addEventListener('click', handleLayoutPageInteraction);
    layoutPageBody.addEventListener('touchend', handleLayoutPageInteraction);

    // Initial preloading of the *first* video to be ready for the first click
    preloadNextVideo(currentVideoIndex); // This actually preloads the first video

}

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
                window.location.href = 'entry//login.html';
            });
        }
        
        // Desktop Login Button
        const loginButton = document.getElementById('loginButton');
        if (loginButton) {
            loginButton.addEventListener('click', function() {
                window.location.href = 'entry//login.html';
            });
        }
        
        // Animated Photo on Scroll
        const animatedPhoto = document.getElementById('animated-photo');
        const section1 = document.getElementById('section1');
        const section2 = document.getElementById('section2');
        
        if (animatedPhoto && section1 && section2) {
            // Generate array of image paths (100.gif to 132.gif)
            const imageFrames = [
                'assets//Comp 100.gif',
        'assets//Comp 101.gif',
        'assets//Comp 102.gif',
        'assets//Comp 103.gif',
        'assets//Comp 104.gif',
        'assets//Comp 105.gif',
        'assets//Comp 106.gif',
        'assets//Comp 107.gif',
        'assets//Comp 108.gif',
        'assets//Comp 109.gif',
        'assets//Comp 110.gif',
        'assets//Comp 111.gif',
        'assets//Comp 112.gif',
        'assets//Comp 113.gif',
        'assets//Comp 114.gif',
        'assets//Comp 115.gif',
        'assets//Comp 116.gif',
        'assets//Comp 117.gif',
        'assets//Comp 118.gif',
        'assets//Comp 119.gif',
        'assets//Comp 120.gif',
        'assets//Comp 121.gif',
        'assets//Comp 122.gif',
        'assets//Comp 123.gif',
        'assets//Comp 124.gif',
        'assets//Comp 125.gif',
        'assets//Comp 126.gif',
        'assets//Comp 127.gif',
        'assets//Comp 128.gif',
        'assets//Comp 129.gif',
        'assets//Comp 130.gif',
        'assets//Comp 132.gif',
            ];

            let currentFrame = 1;
            
            function updateAnimationFrame() {
                const scrollPosition = window.scrollY;
                const section1Height = section1.offsetHeight;
                const windowHeight = window.innerHeight;
                
                // Calculate scroll percentage (0 to 1)
                const scrollPercentage = Math.min(scrollPosition / (section1Height - windowHeight), 1);
                
                // Determine which frame to show
                const frameIndex = Math.floor(scrollPercentage * (imageFrames.length - 1));
                
                if (frameIndex !== currentFrame) {
                    currentFrame = frameIndex;
                    animatedPhoto.src = imageFrames[currentFrame];
                }
            }
            
            window.addEventListener('scroll', updateAnimationFrame);
            updateAnimationFrame(); // Initialize
        }

// --- Scroll-based Photo Animation (Div-2: Services to Div-3) ---
const servicesAnimatedPhoto = document.getElementById('services-animated-photo');
const section3 = document.getElementById('section3');

const servicesToTrustedAnimationFrames = [
    'assets//1.png',
    'assets//2.png',
    'assets//3.png',
    'assets//4.png',
    'assets//5.png',
    'assets//6.png',
    'assets//7.png',
    'assets//8.png',
    'assets//9.png',
    'assets//10.png',
    'assets//11.png',
    'assets//12.png',
    'assets//13.png',
    'assets//14.png'
];

// Preload all images to ensure consistent sizing
function preloadImages() {
    servicesToTrustedAnimationFrames.forEach(src => {
        const img = new Image();
        img.src = src;
        // Set the same dimensions for all preloaded images
        img.width = servicesAnimatedPhoto.width;
        img.height = servicesAnimatedPhoto.height;
    });
}

let currentServicesToTrustedFrameIndex = 0;
const scrollPerFrameServicesToTrusted = window.innerHeight * 0.5;
const totalAnimationScrollHeightServicesToTrusted = servicesToTrustedAnimationFrames.length * scrollPerFrameServicesToTrusted;

if (section2) {
    section2.style.minHeight = `${totalAnimationScrollHeightServicesToTrusted + window.innerHeight}px`;
}

const updateServicesToTrustedAnimationFrame = () => {
    if (!servicesAnimatedPhoto || !section2 || !section3) return;

    const scrollRelativeToSection2 = window.scrollY - section2.offsetTop;
    const animationProgress = Math.max(0, Math.min(1, scrollRelativeToSection2 / totalAnimationScrollHeightServicesToTrusted));
    
    const frameIndex = Math.floor(animationProgress * (servicesToTrustedAnimationFrames.length - 1));

    if (frameIndex !== currentServicesToTrustedFrameIndex) {
        // Maintain the same dimensions when changing images
        const currentWidth = servicesAnimatedPhoto.width;
        const currentHeight = servicesAnimatedPhoto.height;
        
        servicesAnimatedPhoto.style.opacity = '0';
        
        setTimeout(() => {
            servicesAnimatedPhoto.src = servicesToTrustedAnimationFrames[frameIndex];
            // Explicitly set dimensions to prevent fluctuations
            servicesAnimatedPhoto.width = currentWidth;
            servicesAnimatedPhoto.height = currentHeight;
            servicesAnimatedPhoto.style.opacity = '1';
            currentServicesToTrustedFrameIndex = frameIndex;
        }, 100);
    }
};

// Initialize
if (servicesAnimatedPhoto && section2 && section3) {
    // Set initial dimensions
    servicesAnimatedPhoto.width = window.innerWidth * 0.75;
    servicesAnimatedPhoto.height = window.innerHeight * 0.75;
    
    preloadImages();
    
    window.addEventListener('scroll', () => {
        requestAnimationFrame(updateServicesToTrustedAnimationFrame);
    });
    
    // Handle window resize to maintain consistent sizing
    window.addEventListener('resize', () => {
        servicesAnimatedPhoto.width = window.innerWidth * 0.75;
        servicesAnimatedPhoto.height = window.innerHeight * 0.75;
    });
    
    updateServicesToTrustedAnimationFrame();
}
        
        // Video Modal
        const watchJourneyBtn = document.getElementById('watchJourneyBtn');
        const videoModal = document.getElementById('videoModal');
        const closeVideoBtn = document.getElementById('closeVideoBtn');
        const journeyVideo = document.getElementById('journeyVideo');
        
        if (watchJourneyBtn && videoModal) {
            watchJourneyBtn.addEventListener('click', function() {
                videoModal.style.display = 'flex';
                journeyVideo.play();
            });
            
            closeVideoBtn.addEventListener('click', function() {
                videoModal.style.display = 'none';
                journeyVideo.pause();
                journeyVideo.currentTime = 0;
            });
            
            window.addEventListener('click', function(event) {
                if (event.target === videoModal) {
                    videoModal.style.display = 'none';
                    journeyVideo.pause();
                    journeyVideo.currentTime = 0;
                }
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

       // --- Portfolio Download Logic (Div-4) ---
        const downloadPortfolioBtn = document.getElementById('downloadPortfolioBtn');
        if (downloadPortfolioBtn) {
            downloadPortfolioBtn.addEventListener('click', function() {
                const emailInput = document.getElementById('emailInput');
                const phoneInput = document.getElementById('phoneInput');
                const agreeCheckbox = document.getElementById('agreeCheckbox');

                // Basic validation
                if (!emailInput.value || !phoneInput.value) {
                    alert('Please enter both your email and phone number.');
                    return;
                }
                if (!agreeCheckbox.checked) {
                    alert('You must agree to receive marketing communications to download the portfolio.');
                    return;
                }

                // In a real application, you would send this data to a server
                // and then trigger the download. For this example, we'll directly
                // trigger a download of a placeholder PDF.
                console.log('Email:', emailInput.value);
                console.log('Phone:', phoneInput.value);
                console.log('Agreed to marketing:', agreeCheckbox.checked);

                // Create a dummy anchor element to trigger download
                const downloadLink = document.createElement('a');
                downloadLink.href = 'assets//Brancherz Portfolio June 2025 prv_compressed.pdf'; // Placeholder PDF URL
                downloadLink.download = 'Branchez_Portfolio.pdf'; // Suggested filename for download
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);

                alert('Thank you! Your portfolio download should begin shortly.'); // Use a custom modal in production
            });
        }
            }
});
