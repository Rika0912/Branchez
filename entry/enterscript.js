document.addEventListener('DOMContentLoaded', function() {
    // Function to show a custom message modal
    function showMessageModal(message, isError = false) {
        const modal = document.getElementById('messageModal');
        const modalMessage = document.getElementById('modalMessage');
        const modalCloseBtn = document.getElementById('modalCloseBtn');

        if (modal && modalMessage && modalCloseBtn) {
            modalMessage.textContent = message;
            if (isError) {
                modalMessage.style.color = '#FF4444'; // Red for errors
            } else {
                modalMessage.style.color = '#91CC1F'; // Green for success/info
            }
            modal.classList.add('show-modal');

            modalCloseBtn.onclick = function() {
                modal.classList.remove('show-modal');
            };

            // Close when clicking outside the modal content
            window.onclick = function(event) {
                if (event.target == modal) {
                    modal.classList.remove('show-modal');
                }
            };
        }
    }

    // === Sign Up Form Submission ===
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent default form submission

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const repeatPassword = document.getElementById('repeatPassword').value;

            // Basic validation
            if (password !== repeatPassword) {
                console.error("Passwords do not match!");
                showMessageModal("Passwords do not match!", true); // Use custom modal for error
                return;
            }

            console.log("Sign Up Attempt:", { email, password });
            // In a real application, this is where you'd send data to your backend
            // for traditional email/password registration.
            // On success, you would then redirect to home.html.

            showMessageModal("Sign Up successful! Redirecting to Home...", false);
            setTimeout(() => {
                window.location.href = 'c:\\Users\\AL_YOUSSEF\\Desktop\\Hala 2\\home.html'; // Redirect to homepage after successful sign-up
            }, 1500); // Redirect after 1.5 seconds
        });
    }

    // === Log In Form Submission ===
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        const loginEmailInput = document.getElementById('email');
        const loginPasswordInput = document.getElementById('password');
        const loginErrorMessage = document.getElementById('loginErrorMessage'); // Assuming this element exists in login.html

        loginForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent default form submission

            const email = loginEmailInput.value;
            const password = loginPasswordInput.value;

            // Clear previous error messages
            hideInlineErrorMessage('loginErrorMessage');

            // Basic validation (e.g., check if fields are not empty)
            if (!email || !password) {
                showInlineErrorMessage("Please enter both email and password.", 'loginErrorMessage');
                return;
            }

            // Mock invalid credentials for demonstration
            // In a real app, you'd send these to your backend for validation
            if (email === "invalid@example.com" || password === "wrongpass") {
                showInlineErrorMessage("Wrong email or password", 'loginErrorMessage');
                return;
            }

            console.log("Log In Attempt:", { email, password });
            // In a real application, you would send this data to your backend for authentication.
            // On successful authentication, your backend would issue a session token/cookie
            // and then redirect the user to home.html.

            showMessageModal("Log In successful! Redirecting to Home...", false);
            setTimeout(() => {
                window.location.href = 'c:\\Users\\AL_YOUSSEF\\Desktop\\Hala 2\\home.html'; // Simulate successful login and redirect
            }, 1500); // Redirect after 1.5 seconds
        });
    }

        // === Forgot Password Form Submission (New for forgetpassword.html) ===
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    if (forgotPasswordForm) {
        const emailInput = forgotPasswordForm.querySelector('#email'); // Get email input within this form

        forgotPasswordForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent default form submission

            const email = emailInput.value;

            // Basic validation
            if (!email) {
                showMessageModal("Please enter your email address.", true);
                return;
            }

            console.log("Forgot Password Request for:", email);
            // In a real application, you would send this email to your backend
            // to initiate the password reset process (e.g., send a verification code).

            showMessageModal("Verification code sent to your email! Redirecting to code entry page...", false);
            setTimeout(() => {
                window.location.href = 'code.html'; // Redirect to a new page for code entry
            }, 2000); // Redirect after 2 seconds
        });
    }

     // === Code Verification Form Submission ===
    const codeVerificationForm = document.getElementById('codeVerificationForm');
    if (codeVerificationForm) {
        const codeInputs = document.querySelectorAll('.code-input');
        const codeErrorMessage = document.getElementById('codeErrorMessage'); // Assuming this exists in code.html
        const correctCode = "12345"; // Mock correct code for demonstration

        // Add event listeners for input and keydown on code fields
        codeInputs.forEach((input, index) => {
            input.addEventListener('input', function() {
                // Move focus to the next input if a digit is entered
                if (this.value.length === 1 && index < codeInputs.length - 1) {
                    codeInputs[index + 1].focus();
                }
                // Clear error state on input
                input.classList.remove('error');
                hideInlineErrorMessage('codeErrorMessage');
            });

            input.addEventListener('keydown', function(event) {
                // Move focus to the previous input on backspace if current is empty
                if (event.key === 'Backspace' && this.value.length === 0 && index > 0) {
                    codeInputs[index - 1].focus();
                }
            });
        });

        codeVerificationForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent default form submission

            let enteredCode = '';
            codeInputs.forEach(input => {
                enteredCode += input.value;
            });

            // Clear previous error messages and error states
            hideInlineErrorMessage('codeErrorMessage');
            codeInputs.forEach(input => input.classList.remove('error'));

            // Basic validation: check if all fields are filled and then against mock code
            if (enteredCode.length !== codeInputs.length) {
                showInlineErrorMessage("Please enter the full 5-digit code.", 'codeErrorMessage');
                codeInputs.forEach(input => input.classList.add('error'));
                return;
            }

            if (enteredCode === correctCode) {
                console.log("Code verified successfully! Redirecting to new password page...");
                showMessageModal("Code verified! Redirecting to set new password...", false);
                setTimeout(() => {
                    window.location.href = 'newpassword.html'; // Redirect to new password page
                }, 1500); // Redirect after 1.5 seconds
            } else {
                console.error("Invalid verification code entered:", enteredCode);
                showInlineErrorMessage("Invalid verification code. Please try again.", 'codeErrorMessage');
                codeInputs.forEach(input => input.classList.add('error')); // Add error class to inputs
            }
        });
    }

        // === New Password Form Submission ===
    const newPasswordForm = document.getElementById('newPasswordForm');
    if (newPasswordForm) {
        const emailInput = newPasswordForm.querySelector('#email');
        const newPasswordInput = newPasswordForm.querySelector('#newPassword');
        const repeatNewPasswordInput = newPasswordForm.querySelector('#repeatNewPassword');
        const newPasswordErrorMessage = document.getElementById('newPasswordErrorMessage'); // Assuming this exists in newpassword.html

        newPasswordForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent default form submission

            const email = emailInput.value;
            const newPassword = newPasswordInput.value;
            const repeatNewPassword = repeatNewPasswordInput.value;

            // Clear previous error messages
            hideInlineErrorMessage('newPasswordErrorMessage');

            // Basic validation
            if (!email || !newPassword || !repeatNewPassword) {
                showInlineErrorMessage("All fields are required.", 'newPasswordErrorMessage');
                return;
            }
            if (newPassword !== repeatNewPassword) {
                showInlineErrorMessage("New passwords do not match.", 'newPasswordErrorMessage');
                return;
            }
            if (newPassword.length < 6) { // Example: minimum password length
                showInlineErrorMessage("Password must be at least 6 characters long.", 'newPasswordErrorMessage');
                return;
            }

            console.log("New Password Set Attempt for:", email);
            // In a real application, you would send this data to your backend
            // to update the user's password in the database.

            showMessageModal("Password updated successfully! Logging in and redirecting to Home...", false);
            setTimeout(() => {
                window.location.href = 'c:\\Users\\AL_YOUSSEF\\Desktop\\Hala 2\\home.html'; // Redirect to homepage after successful password update and "login"
            }, 1500); // Redirect after 1.5 seconds
        });
    }

      // === Social Login Buttons ===
    const googleButton = document.querySelector('.google-button');
    const facebookButton = document.querySelector('.facebook-button');

    if (googleButton) {
        googleButton.addEventListener('click', function() {
            console.log("Initiating Google OAuth flow...");

            // In a real application, you would configure your Google Cloud Project
            // to get a Client ID and set authorized redirect URIs.
            // This URL is a simplified example to initiate the flow.
            // You would typically use a library or your backend to construct this URL securely.
            const googleAuthUrl = 'https://accounts.google.com/o/oauth2/v2/auth?' +
                                 'client_id=YOUR_GOOGLE_CLIENT_ID&' + // REPLACE WITH YOUR ACTUAL GOOGLE CLIENT ID
                                 'redirect_uri=YOUR_SERVER_REDIRECT_URI&' + // REPLACE WITH YOUR SERVER'S REDIRECT URI
                                 'response_type=code&' +
                                 'scope=email%20profile&' + // Request email and profile data
                                 'access_type=offline&' + // Optional: request refresh token
                                 'prompt=consent'; // Optional: force consent screen

            // Redirect the user to Google's authentication page
            window.location.href = googleAuthUrl;

            // IMPORTANT: The following part (showMessageModal and setTimeout) is a SIMULATION.
            // In a real OAuth flow, Google would redirect back to your server,
            // your server would handle the token exchange and user registration/login,
            // and *then* your server would redirect the user to home.html.
            // This client-side JavaScript cannot perform the server-side steps.
            showMessageModal("Redirecting to Google for authentication. Simulating successful sign-up and redirect to Home...", false);
            setTimeout(() => {
                window.location.href = 'c:\\Users\\AL_YOUSSEF\\Desktop\\Hala 2\\home.html'; // Simulate successful sign-up and redirect
            }, 3000); // Give user time to read message before simulated redirect
        });
    }

    if (facebookButton) {
        facebookButton.addEventListener('click', function() {
            console.log("Initiating Facebook Login flow...");

            // In a real application, you would configure your Facebook App
            // to get an App ID and set authorized redirect URIs.
            // This URL is a simplified example to initiate the flow.
            // You would typically use a library or your backend to construct this URL securely.
            const facebookAuthUrl = 'https://www.facebook.com/v19.0/dialog/oauth?' + // Use a recent API version
                                  'client_id=YOUR_FACEBOOK_APP_ID&' + // REPLACE WITH YOUR ACTUAL FACEBOOK APP ID
                                  'redirect_uri=YOUR_SERVER_REDIRECT_URI&' + // REPLACE WITH YOUR SERVER'S REDIRECT URI
                                  'response_type=code&' +
                                  'scope=email%2Cpublic_profile'; // Request email and public profile data

            // Redirect the user to Facebook's authentication page
            window.location.href = facebookAuthUrl;

            // IMPORTANT: The following part (showMessageModal and setTimeout) is a SIMULATION.
            // In a real OAuth flow, Facebook would redirect back to your server,
            // your server would handle the token exchange and user registration/login,
            // and *then* your server would redirect the user to home.html.
            // This client-side JavaScript cannot perform the server-side steps.
            showMessageModal("Redirecting to Facebook for authentication. Simulating successful sign-up and redirect to Home...", false);
            setTimeout(() => {
                window.location.href = 'c:\\Users\\AL_YOUSSEF\\Desktop\\Hala 2\\home.html'; // Simulate successful sign-up and redirect
            }, 3000); // Give user time to read message before simulated redirect
        });
    }

    // === Login Link (Redirection for signup.html) / Sign Up Link (Redirection for login.html) ===
    // This element's class is 'login-link' but its href changes based on the page.
    const loginSignupLink = document.querySelector('.login-link');
    if (loginSignupLink) {
        loginSignupLink.addEventListener('click', function(event) {
            console.log(`Navigating to ${loginSignupLink.href}`);
            // The href attribute already handles the navigation.
            // No need for event.preventDefault() here unless you want to add more JS logic before redirect.
        });
    }

    // === Forgot Password Link (New for login.html) ===
    const forgotPasswordLink = document.querySelector('.forgot-password-link');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function(event) {
            console.log("Forgot password link clicked!");
            // The href="forgetpassword.html" already handles navigation.
        });
    }
});
