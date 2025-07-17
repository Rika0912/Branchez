// script.js

// === Layout Page Logic ===
let currentVideoIndex = 0; // Start at 0 for array indexing
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
    // We'll manage a hidden video element for preloading
    let preloadedVideoElement = document.createElement('video');
    preloadedVideoElement.style.display = 'none';
    preloadedVideoElement.muted = true; // Always mute preloaded videos
    preloadedVideoElement.preload = 'auto'; // Crucial for preloading
    document.body.appendChild(preloadedVideoElement);

    // Determine which set of videos to use based on screen width
    const isMobileOrTablet = window.matchMedia("(max-width: 768px)").matches;
    if (isMobileOrTablet) {
        activeVideos = mobileTabletVideos;
        console.log("Loading mobile/tablet videos.");
    } else {
        activeVideos = desktopVideos;
        console.log("Loading desktop videos.");
    }

    // --- Core Functions ---

    // Function to preload a specific video by index
    function preloadVideo(index) {
        if (index < activeVideos.length) {
            const videoPath = activeVideos[index];
            preloadedVideoElement.src = videoPath;
            preloadedVideoElement.load();
            console.log(`Preloading video: ${videoPath}`);
        }
    }

    // Function to play the video at the currentVideoIndex
    function playCurrentVideo() {
        if (currentVideoIndex >= activeVideos.length) {
            console.log("All videos played. Redirecting to home.html");
            window.location.href = 'home.html';
            return;
        }

        const videoPathToPlay = activeVideos[currentVideoIndex];
        console.log(`Now attempting to play video: ${videoPathToPlay}`);

        // If the preloaded video element holds the one we want to play, use it for instant swap
        // Also ensure the main video is unmuted if it's not already
        layoutAnimationVideo.muted = false; // Ensure it's unmuted before playing

        if (preloadedVideoElement.src.endsWith(videoPathToPlay)) {
            layoutVideoSource.src = videoPathToPlay; // Set the main player's source
            layoutAnimationVideo.load(); // Load instantly from the cached data
            layoutAnimationVideo.play().catch(e => console.error(`Error playing preloaded video ${videoPathToPlay}:`, e));
            console.log(`Swapped to preloaded video ${currentVideoIndex + 1}`);

            // Clear the preloaded element after using its source
            preloadedVideoElement.src = '';
            preloadedVideoElement.load();
        } else {
            // Fallback: If for some reason the desired video wasn't preloaded, load and play it directly
            console.warn(`Video ${videoPathToPlay} was not preloaded. Loading directly.`);
            layoutVideoSource.src = videoPathToPlay;
            layoutAnimationVideo.load();
            layoutAnimationVideo.play().catch(e => console.error(`Error playing video ${videoPathToPlay}:`, e));
        }

        // Set up the onended event for the currently playing video
        // This will only redirect AFTER the last video finishes, if no more clicks occur.
        // It's a fallback for the very last video.
        if (currentVideoIndex === activeVideos.length - 1) {
            layoutAnimationVideo.onended = () => {
                console.log("Last video ended. Redirecting to home.html");
                window.location.href = 'home.html';
            };
        } else {
            // For all other videos, clear the onended handler so it doesn't auto-advance
            // We want clicks to advance here.
            layoutAnimationVideo.onended = null;
        }

        // Immediately start preloading the *next* video in sequence
        preloadVideo(currentVideoIndex + 1);
    }

    // --- Event Handler for Clicks ---
    function handleLayoutPageInteraction(event) {
        event.preventDefault(); // Prevent default browser behavior

        // Play sound on every click (except potentially the very first one if it's purely for unmuting)
        shellBreakSound.currentTime = 0; // Rewind sound to start
        shellBreakSound.play().catch(e => console.error("Error playing sound:", e));

        // Increment index and play the next video
        currentVideoIndex++;
        playCurrentVideo();
    }

    // --- Initial Setup on Page Load ---

    // 1. Display the video element
    layoutAnimationVideo.style.display = 'block';

    // 2. Set the source of the first video
    layoutVideoSource.src = activeVideos[currentVideoIndex];
    layoutAnimationVideo.load();

    // 3. Attempt to play the first video immediately (it will be muted initially due to policies)
    layoutAnimationVideo.muted = true; // Start muted to allow autoplay
    layoutAnimationVideo.play().then(() => {
        console.log("Initial video started (muted).");
    }).catch(e => {
        console.warn("Autoplay of initial video (muted) failed:", e);
        // If even muted autoplay fails, you might show a "Click to Start" overlay.
    });

    // 4. Preload the *second* video so it's ready for the first user click
    preloadVideo(currentVideoIndex + 1);

    // 5. Attach event listeners for clicks/taps
    layoutPageBody.addEventListener('click', handleLayoutPageInteraction);
    layoutPageBody.addEventListener('touchend', handleLayoutPageInteraction);

    // --- Debugging Listeners (Optional) ---
    layoutAnimationVideo.addEventListener('error', (e) => {
        console.error('Video playback error:', layoutVideoSource.src, e);
    });
    layoutAnimationVideo.addEventListener('loadeddata', () => {
        console.log(`Video loaded data: ${layoutVideoSource.src}`);
    });
    layoutAnimationVideo.addEventListener('canplay', () => {
        console.log(`Video can play: ${layoutVideoSource.src}`);
    });
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
        const section2 = document.getElementById('section2'); // Ensure section2 is correctly identified

        if (animatedPhoto && section1 && section2) {
            // Image paths now directly refer to 'assets//' assuming it's accessible
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

            let currentFrameIndex = -1; // Initialize to -1 to force initial update

            // Function to preload all images for smoother animation
            function preloadAllAnimationImages() {
                const preloadPromises = imageFrames.map(src => {
                    return new Promise((resolve, reject) => {
                        const img = new Image();
                        img.src = src;
                        img.onload = () => resolve();
                        img.onerror = () => {
                            console.error(`Failed to preload image: ${src}`);
                            reject(new Error(`Failed to preload ${src}`));
                        };
                    });
                });

                Promise.allSettled(preloadPromises).then(results => {
                    results.forEach((result, index) => {
                        if (result.status === 'rejected') {
                            console.warn(`Preload failed for ${imageFrames[index]}: ${result.reason}`);
                        }
                    });
                    console.log('All scroll animation images attempted to preload.');
                });
            }

            // Function to update the image frame based on scroll position
            function updateAnimationFrame() {
                const scrollPosition = window.scrollY;
                const section1Top = section1.offsetTop; // Get the top absolute scroll position of section1
                const section2Top = section2.offsetTop; // Get the top absolute scroll position of section2
                const windowHeight = window.innerHeight;

                // --- The Key Change for Speed Control ---
                // Define the total scroll distance over which the animation should complete.
                // This is the main variable you'll adjust.
                // Option 1: Based on distance between section1 and section2
                let desiredAnimationLength = section2Top - section1Top;

                // Option 2: Define a fixed, custom scroll length (e.g., 2 times the window height)
                // This gives you more control regardless of actual section heights.
                // You can uncomment and modify this line if `section2Top - section1Top` is too short.
                // desiredAnimationLength = windowHeight * 3; // Example: user scrolls 3 full screens for animation

                // Ensure a minimum length to prevent division by zero or super fast animation
                if (desiredAnimationLength <= 0) {
                     // Fallback to a default if sections are overlapping or incorrectly positioned
                    desiredAnimationLength = windowHeight * 2; // A safe default length
                }

                // The animation starts when the top of section1 enters the viewport
                const animationStartPoint = section1Top;
                // The animation ends after the 'desiredAnimationLength' has been scrolled past this start point.
                const animationEndPoint = animationStartPoint + desiredAnimationLength;


                // Calculate scroll progress within the defined range (0 to 1)
                let scrollProgress = 0;
                if (scrollPosition >= animationStartPoint && scrollPosition <= animationEndPoint) {
                    scrollProgress = (scrollPosition - animationStartPoint) / desiredAnimationLength;
                } else if (scrollPosition > animationEndPoint) {
                    scrollProgress = 1; // Ensure it stays at 1 (last frame) if scrolled past end
                }
                // If scrollPosition < animationStartPoint, scrollProgress remains 0 (first frame)

                // Clamp scrollProgress between 0 and 1
                scrollProgress = Math.max(0, Math.min(1, scrollProgress));

                // Determine which frame to show
                const frameIndex = Math.floor(scrollProgress * (imageFrames.length - 1));
                const clampedFrameIndex = Math.max(0, Math.min(imageFrames.length - 1, frameIndex));

                if (clampedFrameIndex !== currentFrameIndex) {
                    currentFrameIndex = clampedFrameIndex;
                    animatedPhoto.src = imageFrames[currentFrameIndex];
                    // console.log(`Setting animatedPhoto.src to: ${imageFrames[currentFrameIndex]} (Frame: ${currentFrameIndex})`); // Debugging
                }
            }

            // --- Initialization ---

            // Preload all images for a smoother experience
            preloadAllAnimationImages();

            // Set the initial image immediately to the first frame
            animatedPhoto.src = imageFrames[0];
            currentFrameIndex = 0; // Set initial state of currentFrameIndex

            // Add event listener for scroll and call once initially
            window.addEventListener('scroll', () => {
                requestAnimationFrame(updateAnimationFrame);
            });
            // Also call updateAnimationFrame on initial load to set the correct frame based on current scroll position
            updateAnimationFrame();

            // Consider adding a 'resize' listener if section heights can change dynamically
            window.addEventListener('resize', () => {
                requestAnimationFrame(updateAnimationFrame); // Recalculate on resize
            });
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
