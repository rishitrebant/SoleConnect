// Signup form functionality
document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.querySelector('.signup-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const termsCheckbox = document.getElementById('terms');
    const signupButton = document.querySelector('.signup-button');
    const scanEmailBtn = document.getElementById('scanEmailBtn');
    
    // Password strength elements
    const strengthFill = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');
    const passwordStrength = document.querySelector('.password-strength');
    
    // Password match element
    const passwordMatch = document.getElementById('passwordMatch');
    
    // Real-time password strength checking
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        checkPasswordStrength(password);
        checkPasswordMatch();
    });
    
    // Real-time password match checking
    confirmPasswordInput.addEventListener('input', checkPasswordMatch);
    
    // Check password strength
    function checkPasswordStrength(password) {
        let strength = 0;
        let feedback = '';
        
        if (password.length === 0) {
            passwordStrength.classList.remove('show');
            return;
        }
        
        passwordStrength.classList.add('show');
        
        // Length check
        if (password.length >= 8) strength++;
        
        // Contains lowercase
        if (/[a-z]/.test(password)) strength++;
        
        // Contains uppercase
        if (/[A-Z]/.test(password)) strength++;
        
        // Contains numbers
        if (/[0-9]/.test(password)) strength++;
        
        // Contains special characters
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        
        // Update UI based on strength
        if (strength <= 2) {
            strengthFill.className = 'strength-fill weak';
            strengthText.className = 'strength-text weak';
            strengthText.textContent = 'Weak';
        } else if (strength <= 4) {
            strengthFill.className = 'strength-fill medium';
            strengthText.className = 'strength-text medium';
            strengthText.textContent = 'Medium';
        } else {
            strengthFill.className = 'strength-fill strong';
            strengthText.className = 'strength-text strong';
            strengthText.textContent = 'Strong';
        }
    }
    
    // Check if passwords match
    function checkPasswordMatch() {
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        
        if (confirmPassword.length === 0) {
            passwordMatch.classList.remove('show');
            return;
        }
        
        if (password === confirmPassword && password.length > 0) {
            passwordMatch.classList.add('show');
        } else {
            passwordMatch.classList.remove('show');
        }
    }
    
    // Scan email functionality
    scanEmailBtn.addEventListener('click', function() {
        // This would typically integrate with an email scanning service
        // For demo purposes, we'll simulate finding an email
        
        // Show loading state
        const originalText = scanEmailBtn.innerHTML;
        scanEmailBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 1V4M8 12V15M3 8H1M15 8H12M3.5 3.5L1.5 1.5M12.5 3.5L14.5 1.5M3.5 12.5L1.5 14.5M12.5 12.5L14.5 14.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            Scanning...
        `;
        
        setTimeout(() => {
            // Simulate finding an email (in real app, this would be the actual email)
            const sampleEmails = [
                'john.doe@gmail.com',
                'jane.smith@outlook.com',
                'user123@yahoo.com'
            ];
            
            const randomEmail = sampleEmails[Math.floor(Math.random() * sampleEmails.length)];
            emailInput.value = randomEmail;
            
            // Reset button
            scanEmailBtn.innerHTML = originalText;
            
            // Show success message
            showMessage('Email found and auto-filled!', 'success');
        }, 1500);
    });
    
    // Form submission
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();
        
        // Validation
        if (!email || !password || !confirmPassword) {
            showMessage('Please fill in all fields', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showMessage('Please enter a valid email address', 'error');
            return;
        }
        
        if (password !== confirmPassword) {
            showMessage('Passwords do not match', 'error');
            return;
        }
        
        if (!termsCheckbox.checked) {
            showMessage('Please agree to the Terms of Service and Privacy Policy', 'error');
            return;
        }
        
        if (getPasswordStrength(password) === 'weak') {
            showMessage('Please choose a stronger password', 'error');
            return;
        }
        
        // Simulate signup process
        simulateSignup(email, password);
    });
    
    // Email validation
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Get password strength for validation
    function getPasswordStrength(password) {
        let strength = 0;
        
        if (password.length >= 8) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        
        if (strength <= 2) return 'weak';
        if (strength <= 4) return 'medium';
        return 'strong';
    }
    
    // Show message
    function showMessage(message, type) {
        // Remove existing message if any
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create message element
        const messageElement = document.createElement('div');
        messageElement.className = `form-message ${type}`;
        messageElement.style.cssText = `
            background: ${type === 'error' ? '#FEF2F2' : '#F0FDF4'};
            color: ${type === 'error' ? '#DC2626' : '#16A34A'};
            padding: 12px 16px;
            border-radius: 8px;
            margin-bottom: 20px;
            font-size: 14px;
            border: 1px solid ${type === 'error' ? '#FECACA' : '#BBF7D0'};
        `;
        messageElement.textContent = message;
        
        // Insert message before the form
        signupForm.insertBefore(messageElement, signupForm.firstChild);
        
        // Remove message after 5 seconds
        setTimeout(() => {
            messageElement.remove();
        }, 5000);
    }
    
    // Simulate signup process
    function simulateSignup(email, password) {
        // Show loading state
        signupButton.innerHTML = 'Creating Account...';
        signupButton.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            // Reset button state
            signupButton.innerHTML = 'Create Account';
            signupButton.disabled = false;
            
            // Show success message
            showMessage('Account created successfully! Redirecting to login...', 'success');
            
            // Redirect to login page after 2 seconds
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
            
        }, 2000);
    }
    
    // Social login button handlers
    const googleButton = document.querySelector('.social-button.google');
    const appleButton = document.querySelector('.social-button.apple');
    
    googleButton.addEventListener('click', function() {
        // Implement Google OAuth signup
        showMessage('Google signup would be implemented here', 'info');
    });
    
    appleButton.addEventListener('click', function() {
        // Implement Apple OAuth signup
        showMessage('Apple signup would be implemented here', 'info');
    });
});