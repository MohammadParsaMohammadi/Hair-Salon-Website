document.addEventListener('DOMContentLoaded', () => {
    
    // Element Selectors
    const otpContainer = document.getElementById('otp-container');
    const inputs = document.querySelectorAll('.otp-input');
    const verifyBtn = document.getElementById('verify-btn');
    const otpForm = document.getElementById('otp-form');
    const errorBanner = document.getElementById('error-banner');
    const errorText = document.getElementById('error-text');
    const card = document.getElementById('verification-card');
    const btnSpinner = document.getElementById('btn-spinner');
    const successOverlay = document.getElementById('success-overlay');
    const phoneLink = document.getElementById('phone-number-link');
    
    // Countdown Selectors
    const timerDisplay = document.getElementById('timer');
    const resendBtn = document.getElementById('resend-action');
    const countdownDesc = document.getElementById('countdown-desc');

    // Focus first input immediately on load
    if (inputs.length > 0) {
        inputs[0].focus();
    }

    /* ==============================================
       1. OTP Input Multi-Behavior Controls
       ============================================== */
    
    // Function checking if all 4 digit boxes are complete
    const checkFormCompletion = () => {
        const isComplete = Array.from(inputs).every(input => input.value.trim().length === 1);
        verifyBtn.disabled = !isComplete;
    };

    inputs.forEach((input, index) => {
        
        // Prevent typing non-numeric keys on keydown directly (early filter)
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace') {
                if (input.value === '') {
                    // Backspace on empty input: Focus previous sibling
                    if (index > 0) {
                        inputs[index - 1].focus();
                        inputs[index - 1].value = '';
                        checkFormCompletion();
                    }
                } else {
                    // Clear current box value
                    input.value = '';
                    checkFormCompletion();
                }
                e.preventDefault();
            } else if (e.key === 'Enter' && !verifyBtn.disabled) {
                // Submit Form on Enter keypress
                otpForm.requestSubmit();
            } else if (e.key === 'ArrowLeft' && index > 0) {
                inputs[index - 1].focus();
                e.preventDefault();
            } else if (e.key === 'ArrowRight' && index < inputs.length - 1) {
                inputs[index + 1].focus();
                e.preventDefault();
            }
        });

        // Event to manage auto-forward cursor shifting
        input.addEventListener('input', (e) => {
            const val = e.target.value;
            
            // Strip any non-numeric parameters
            const cleanedVal = val.replace(/[^0-9]/g, '');
            e.target.value = cleanedVal;

            if (cleanedVal.length > 0) {
                // Focus next sibling input
                if (index < inputs.length - 1) {
                    inputs[index + 1].focus();
                }
            }
            checkFormCompletion();
        });

        // Prevent typing alphabetic characters or space
        input.addEventListener('keypress', (e) => {
            if (!/[0-9]/.test(e.key)) {
                e.preventDefault();
            }
        });
    });

    // Paste handling: auto distribute 4 digits across inputs
    const handlePaste = (e) => {
        e.preventDefault();
        const clipboardData = (e.clipboardData || window.clipboardData).getData('text');
        
        // Match first 4 digits from the pasted text
        const cleanedData = clipboardData.replace(/[^0-9]/g, '').substring(0, 4);
        
        if (cleanedData.length > 0) {
            cleanedData.split('').forEach((char, index) => {
                if (inputs[index]) {
                    inputs[index].value = char;
                }
            });

            // Put focus on the last populated box or final box
            const focusIndex = Math.min(cleanedData.length - 1, inputs.length - 1);
            inputs[focusIndex].focus();
            
            checkFormCompletion();
        }
    };

    // Attach paste handler to container
    otpContainer.addEventListener('paste', handlePaste);


    /* ==============================================
       2. Countdown Timer Settings
       ============================================== */
    let timerDuration = 90; // 01:30 in seconds
    let countdownInterval;

    const startCountdown = () => {
        clearInterval(countdownInterval);
        timerDuration = 90;
        resendBtn.disabled = true;
        resendBtn.classList.remove('active-link');
        countdownDesc.style.display = 'block';

        countdownInterval = setInterval(() => {
            const minutes = Math.floor(timerDuration / 60);
            const seconds = timerDuration % 60;
            
            const formatMin = minutes.toString().padStart(2, '0');
            const formatSec = seconds.toString().padStart(2, '0');

            timerDisplay.textContent = `${formatMin}:${formatSec}`;
            resendBtn.innerHTML = `ارسال مجدد کد تا <span id="timer">${formatMin}:${formatSec}</span>`;

            if (timerDuration <= 0) {
                clearInterval(countdownInterval);
                // Shift countdown display text to action state
                countdownDesc.style.display = 'none';
                resendBtn.innerHTML = 'ارسال مجدد کد';
                resendBtn.disabled = false;
                resendBtn.classList.add('active-link');
            }
            timerDuration--;
        }, 1000);
    };

    // Start timer on load
    startCountdown();

    // Bind Resend Action
    resendBtn.addEventListener('click', () => {
        if (resendBtn.disabled) return;
        
        // Hide existing banners on reset
        errorBanner.style.display = 'none';
        
        // Reset Inputs
        inputs.forEach(input => {
            input.value = '';
            input.classList.remove('error-border');
        });
        inputs[0].focus();
        checkFormCompletion();

        // Simulate OTP Send API Call
        startCountdown();
    });


    /* ==============================================
       3. Navigation Links back to Registration
       ============================================== */
    const navigateBackToRegister = () => {
        window.location.href = 'register.html';
    };

    phoneLink.addEventListener('click', navigateBackToRegister);


    /* ==============================================
       4. Form Verification & Error Simulation Flows
       ============================================== */
    otpForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (verifyBtn.disabled) return;

        // Collect code values
        const enteredCode = Array.from(inputs).map(input => input.value).join('');

        // Disable elements during validation progress
        verifyBtn.disabled = true;
        inputs.forEach(input => input.disabled = true);
        btnSpinner.style.display = 'block';
        verifyBtn.querySelector('.btn-text').textContent = 'در حال بررسی...';
        errorBanner.style.display = 'none';

        // Simulate Verification Endpoint Request
        setTimeout(() => {
            
            // Simple mock evaluation: Let's treat "1111" as trigger for "expired", other values except "1234" as incorrect.
            if (enteredCode === '1234') {
                // --- SUCCESS ---
                successOverlay.classList.add('active');
                
                setTimeout(() => {
                    // Redirect path
                    window.location.href = 'customer-dashboard.html'; 
                }, 1200);

            } else if (enteredCode === '1111') {
                // --- EXPIRED CODE STATE ---
                errorText.innerHTML = 'این کد منقضی شده است.<br>لطفاً کد جدیدی درخواست کنید.';
                errorBanner.style.display = 'flex';
                
                // Shake elements animation
                triggerShakeAnimation();
                resetFormInputs();

            } else {
                // --- GENERAL CODE INCORRECT ERROR ---
                errorText.textContent = 'کد تأیید وارد شده نادرست است.';
                errorBanner.style.display = 'flex';
                
                // Shake elements animation
                triggerShakeAnimation();
                resetFormInputs();
            }

        }, 1200);
    });

    const triggerShakeAnimation = () => {
        otpContainer.classList.add('shake');
        inputs.forEach(input => input.classList.add('error-border'));
        
        // Remove shake class post-duration so it can be re-triggered later
        setTimeout(() => {
            otpContainer.classList.remove('shake');
        }, 350);
    };

    const resetFormInputs = () => {
        // Re-enable and reset controls
        inputs.forEach(input => {
            input.disabled = false;
            input.value = '';
        });
        verifyBtn.disabled = true;
        btnSpinner.style.display = 'none';
        verifyBtn.querySelector('.btn-text').textContent = 'تأیید';
        inputs[0].focus();
    };

});
