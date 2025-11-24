const fs = require('fs');

// Store user data temporarily
        let userData = [];
        let generatedOTP = '';
        let timerInterval;

        // Page Navigation
        function showPage(pageName) {
            const pages = document.querySelectorAll('.page');
            pages.forEach(page => page.classList.remove('active'));

            const pageElement = document.getElementById(pageName + 'Page');
            pageElement.classList.add('active');

            // Update header
            const titles = {
                login: { title: 'Welcome Back', subtitle: 'Login to manage your finances' },
                signup: { title: 'Create Account', subtitle: 'Join us to manage your finances' },
                otp: { title: 'Verify Email', subtitle: 'Enter the code we sent to your email' },
                forgot: { title: 'Reset Password', subtitle: 'Recover your account access' }
            };

            document.getElementById('pageTitle').textContent = titles[pageName].title;
            document.getElementById('pageSubtitle').textContent = titles[pageName].subtitle;

            // Hide messages
            hideAllMessages();
        }

        // Toggle Password Visibility
        function togglePassword(inputId) {
            const input = document.getElementById(inputId);
            input.type = input.type === 'password' ? 'text' : 'password';
        }

        // Hide all messages
        function hideAllMessages() {
            document.querySelectorAll('.success-message, .error-message').forEach(msg => {
                msg.style.display = 'none';
            });
        }

        // Show message
        function showMessage(elementId, message, type = 'success') {
            const messageElement = document.getElementById(elementId);
            messageElement.textContent = message;
            messageElement.className = type === 'success' ? 'success-message' : 'error-message';
            messageElement.style.display = 'block';
        }

        // Generate 6-digit OTP
        function generateOTP() {
            return Math.floor(100000 + Math.random() * 900000).toString();
        }

        // Send OTP to email (In production, this would be an API call to your backend)
        async function sendOTPEmail(email, otp) {
            // DEMO: In production, send this to your backend API
            console.log(`Sending OTP ${otp} to email: ${email}`);
            
            // For demo purposes, show OTP in console
            alert(`DEMO MODE: Your OTP is ${otp}\n\n(In production, this will be sent to your email: ${email})`);
            
            /* 
            PRODUCTION CODE - Replace the alert above with this:
            
            try {
                const response = await fetch('YOUR_BACKEND_API/send-otp', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: email,
                        otp: otp
                    })
                });
                
                const data = await response.json();
                return data.success;
            } catch (error) {
                console.error('Error sending OTP:', error);
                return false;
            }
            */
        }

        // Login Form Handler
        document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            // Simulate login
            if (email && password) {
                showMessage('loginMessage', '✓ Login successful! Redirecting...', 'success');
                
            }
        });

        // Signup Form Handler
        document.getElementById('signupForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const password = document.getElementById('signupPassword').value;
            const confirmPassword = document.getElementById('signupConfirmPassword').value;

            if (password !== confirmPassword) {
                showMessage('signupMessage', '✗ Passwords do not match!', 'error');
                return;
            }

            if (password.length < 6) {
                showMessage('signupMessage', '✗ Password must be at least 6 characters!', 'error');
                return;
            }

            // Store user data temporarily
            const Data = {
                name: document.getElementById('signupName').value,
                email: document.getElementById('signupEmail').value,
                phone: document.getElementById('signupPhone').value,
                password: password
            };

            userData.push(Data);

            fs.writeFile('userData.txt', JSON.stringify(userData), (err) => {
                if (err) throw err;
                console.log('User data saved!');
            });

            // Generate and send OTP
            generatedOTP = generateOTP();
            sendOTPEmail(userData.email, generatedOTP);

            // Show OTP page
            document.getElementById('otpEmail').textContent = userData.email;
            showPage('otp');
            startTimer();
            
            // Focus first OTP input
            setTimeout(() => {
                document.getElementById('otp1').focus();
            }, 100);
        });

        // OTP Navigation
        function moveToNext(current, nextFieldID) {
            if (current.value.length >= 1) {
                if (nextFieldID) {
                    document.getElementById(nextFieldID).focus();
                }
            }
        }

        function moveToPrev(event, current, prevFieldID) {
            if (event.key === 'Backspace' && current.value.length === 0) {
                if (prevFieldID) {
                    document.getElementById(prevFieldID).focus();
                }
            }
        }

        // OTP Form Handler
        document.getElementById('otpForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get OTP from inputs
            const otp = 
                document.getElementById('otp1').value +
                document.getElementById('otp2').value +
                document.getElementById('otp3').value +
                document.getElementById('otp4').value +
                document.getElementById('otp5').value +
                document.getElementById('otp6').value;

            if (otp.length !== 6) {
                showMessage('otpMessage', '✗ Please enter all 6 digits!', 'error');
                return;
            }

            // Verify OTP
            if (otp === generatedOTP) {
                showMessage('otpMessage', '✓ Email verified successfully!', 'success');
                
                // Clear timer
                clearInterval(timerInterval);
                
                // In production, send user data to backend to create account
                setTimeout(() => {
                    showMessage('loginMessage', '✓ Account created successfully! Please login.', 'success');
                    showPage('login');
                    
                    // Reset OTP inputs
                    document.getElementById('otpForm').reset();
                    userData = {};
                    generatedOTP = '';
                }, 1500);
            } else {
                showMessage('otpMessage', '✗ Invalid OTP! Please try again.', 'error');
                // Clear OTP inputs
                document.getElementById('otp1').value = '';
                document.getElementById('otp2').value = '';
                document.getElementById('otp3').value = '';
                document.getElementById('otp4').value = '';
                document.getElementById('otp5').value = '';
                document.getElementById('otp6').value = '';
                document.getElementById('otp1').focus();
            }
        });

        // Resend OTP Timer
        function startTimer() {
            let timeLeft = 60;
            document.getElementById('resendBtn').disabled = true;
            document.getElementById('timerSection').style.display = 'inline';
            
            timerInterval = setInterval(() => {
                timeLeft--;
                document.getElementById('timer').textContent = timeLeft;
                
                if (timeLeft <= 0) {
                    clearInterval(timerInterval);
                    document.getElementById('resendBtn').disabled = false;
                    document.getElementById('timerSection').style.display = 'none';
                }
            }, 1000);
        }

        // Resend OTP
        function resendOTP() {
            generatedOTP = generateOTP();
            sendOTPEmail(userData.email, generatedOTP);
            startTimer();
            
            // Clear OTP inputs
            document.getElementById('otpForm').reset();
            document.getElementById('otp1').focus();
            
            showMessage('otpMessage', '✓ New OTP sent to your email!', 'success');
            setTimeout(() => {
                hideAllMessages();
            }, 3000);
        }

        // Forgot Password Form Handler
        document.getElementById('forgotForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('forgotEmail').value;

            if (email) {
                showMessage('forgotMessage', '✓ Password reset link sent to your email!', 'success');
                setTimeout(() => {
                    showPage('login');
                    this.reset();
                }, 2000);
            }
        });

        // Allow only numbers in OTP inputs
        document.querySelectorAll('.otp-input').forEach(input => {
            input.addEventListener('input', function(e) {
                this.value = this.value.replace(/[^0-9]/g, '');
            });
        });