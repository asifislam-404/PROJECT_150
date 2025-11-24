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
            console.log(`Sending OTP ৳{otp} to email: ৳{email}`);
            
            // For demo purposes, show OTP in console
            alert(`DEMO MODE: Your OTP is ৳{otp}\n\n(In production, this will be sent to your email: ৳{email})`);
            
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

    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Find user with matching email and password
    const user = users.find(u => u.email === email && u.password === password);

    window.location.href = '../dashBoard/dashboard.html';
    if (user) {
        // Save current user to localStorage
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        showMessage('loginMessage', '✓ Login successful! Redirecting...', 'success');
        
        setTimeout(() => {
            // Redirect to dashboard
        }, 1500);
    } else {
        showMessage('loginMessage', '✗ Invalid email or password!', 'error');
    }
});


    

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


        // Create Account Form Handler
document.getElementById('createAccount').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get all form values
    const formData = {
        // Personal Information
        name: document.getElementById('accountName').value,
        dob: document.getElementById('accountDOB').value,
        gender: document.getElementById('accountGender').value,
        nationality: document.getElementById('accountNationality').value,
        nationalID: document.getElementById('accountID').value,
        
        // Contact Information
        email: document.getElementById('accountEmail').value,
        phone: document.getElementById('accountPhone').value,
        address: document.getElementById('accountAddress').value,
        city: document.getElementById('accountCity').value,
        state: document.getElementById('accountState').value,
        zip: document.getElementById('accountZip').value,
        country: document.getElementById('accountCountry').value,
        
        // Account Details
        accountType: document.getElementById('accountType').value,
        currency: document.getElementById('accountCurrency').value,
        initialDeposit: document.getElementById('initialDeposit').value,
        
        // Employment Information
        employmentStatus: document.getElementById('employmentStatus').value,
        employerName: document.getElementById('employerName').value,
        annualIncome: document.getElementById('annualIncome').value,
        
        // Security
        pin: document.getElementById('transactionPIN').value,
        confirmPIN: document.getElementById('confirmPIN').value,
        securityQuestion: document.getElementById('securityQuestion').value,
        securityAnswer: document.getElementById('securityAnswer').value,
        
        // Generate unique account number
        accountNumber: 'ACC' + Date.now() + Math.floor(Math.random() * 1000),
        createdDate: new Date().toISOString()
    };
    
    // Validate PIN match
    if (formData.pin !== formData.confirmPIN) {
        showMessage('accountMessage', '✗ Transaction PINs do not match!', 'error');
        return;
    }
    
    // Validate PIN is 4 digits
    if (formData.pin.length !== 4 || !/^\d{4}$/.test(formData.pin)) {
        showMessage('accountMessage', '✗ PIN must be exactly 4 digits!', 'error');
        return;
    }
    
    // Validate initial deposit
    if (parseFloat(formData.initialDeposit) < 100) {
        showMessage('accountMessage', '✗ Initial deposit must be at least $100!', 'error');
        return;
    }
    
    // Store account in localStorage
    let accounts = JSON.parse(localStorage.getItem('bankAccounts')) || [];
    accounts.push(formData);
    localStorage.setItem('bankAccounts', JSON.stringify(accounts));
    
    // Show success message
    showMessage('accountMessage', '✓ Bank account created successfully! Account Number: ' + formData.accountNumber, 'success');
    
    // Reset form and redirect after 3 seconds
    setTimeout(() => {
        this.reset();
        alert('Your account has been created!\nAccount Number: ' + formData.accountNumber + '\nPlease save this for your records.');
        showPage('login'); // Redirect to login or dashboard
    }, 2000);
});

// PIN validation - only numbers
document.getElementById('transactionPIN').addEventListener('input', function(e) {
    this.value = this.value.replace(/[^0-9]/g, '');
});

document.getElementById('confirmPIN').addEventListener('input', function(e) {
    this.value = this.value.replace(/[^0-9]/g, '');
});

// Age validation - must be 18+
document.getElementById('accountDOB').addEventListener('change', function(e) {
    const dob = new Date(this.value);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
    }
    
    if (age < 18) {
        alert('You must be at least 18 years old to open a bank account.');
        this.value = '';
    }
});