document.addEventListener('DOMContentLoaded', () => {
    const mobileInput = document.getElementById('mobile');
    const submitBtn = document.getElementById('submit-btn');
    const form = document.getElementById('register-form');
    const validationMsg = document.getElementById('validation-msg');

    // Auto-enable/disable button based on length
    mobileInput.addEventListener('input', (e) => {
        // Ensure numbers only
        e.target.value = e.target.value.replace(/[^0-9]/g, '');
        
        if (e.target.value.length === 11) {
            submitBtn.disabled = false;
            validationMsg.style.display = 'none';
            mobileInput.classList.remove('input-invalid');
        } else {
            submitBtn.disabled = true;
        }
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // UI Loading State
        submitBtn.disabled = true;
        const originalText = submitBtn.innerHTML;
        submitBtn.querySelector('.btn-text').textContent = 'در حال ارسال...';

        try {
            // Simulated API Call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Redirect to Verification Page on Success
            window.location.href = 'verify.html';
            
        } catch (error) {
            // Error State
            document.getElementById('error-banner').style.display = 'block';
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
});
