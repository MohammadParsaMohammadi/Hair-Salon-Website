document.addEventListener('DOMContentLoaded', () => {

    /* ==============================================
       1. Custom Dropdown & Conditional Logic
       ============================================== */
    const dropdownTrigger = document.querySelector('.dropdown-trigger');
    const dropdownMenu = document.querySelector('.custom-dropdown');
    const dropdownOptions = document.querySelectorAll('.dropdown-options li');
    const searchInput = document.getElementById('service-search');
    const selectedText = document.querySelector('.selected-text');
    
    const otherServiceContainer = document.getElementById('other-service-container');
    const otherDescriptionInput = document.getElementById('other-description');

    // Toggle Dropdown
    dropdownTrigger.addEventListener('click', () => {
        dropdownMenu.classList.toggle('open');
        dropdownTrigger.classList.toggle('active');
        if (dropdownMenu.classList.contains('open')) {
            searchInput.focus();
        }
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.custom-dropdown')) {
            dropdownMenu.classList.remove('open');
            dropdownTrigger.classList.remove('active');
        }
    });

    // Search Filtering
    searchInput.addEventListener('input', (e) => {
        const filter = e.target.value.toLowerCase();
        dropdownOptions.forEach(option => {
            const text = option.querySelector('.opt-name').textContent.toLowerCase();
            option.style.display = text.includes(filter) ? 'flex' : 'none';
        });
    });

    // Option Selection Logic
    dropdownOptions.forEach(option => {
        option.addEventListener('click', () => {
            // Reset styles
            dropdownOptions.forEach(opt => opt.classList.remove('selected'));
            dropdownTrigger.classList.remove('error');
            
            // Set active
            option.classList.add('selected');
            const val = parseFloat(option.getAttribute('data-value'));
            const name = option.getAttribute('data-name');
            
            selectedText.textContent = name;
            selectedText.classList.add('has-value');
            
            // Handle "Other" field condition
            if (name === 'Other' || name === 'سایر') {
                otherServiceContainer.classList.add('show');
            } else {
                otherServiceContainer.classList.remove('show');
                otherDescriptionInput.value = ''; // Reset
                otherDescriptionInput.classList.remove('error');
            }

            // Close dropdown
            dropdownMenu.classList.remove('open');
            dropdownTrigger.classList.remove('active');

            // Trigger Live Update
            updateOrderSummary(name, val);
        });
    });


    /* ==============================================
       2. Live Order Summary & Count Animation
       ============================================== */
    let currentPrice = 0;
    let currentDiscount = 0;
    
    const summaryEmpty = document.getElementById('summary-empty');
    const summaryContent = document.getElementById('summary-content');
    const sumServiceName = document.getElementById('sum-service-name');
    const sumPrice = document.getElementById('sum-price');
    const sumDiscount = document.getElementById('sum-discount');
    const sumFinal = document.getElementById('sum-final');
    const submitBtn = document.getElementById('submit-btn');

    function animateValue(obj, start, end, duration, prefix = "$") {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            
            // Calculate current value ensuring proper rounding
            const currentVal = Math.floor(progress * (end - start) + start);
            obj.textContent = prefix + currentVal;
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                obj.textContent = prefix + end; // Ensure it ends exactly on the target
            }
        };
        window.requestAnimationFrame(step);
    }

    function updateOrderSummary(name, price) {
        // Toggle view states
        summaryEmpty.style.display = 'none';
        summaryContent.style.display = 'block';

        sumServiceName.textContent = name;
        
        // Count animation for base price (0.4s rule)
        animateValue(sumPrice, currentPrice, price, 400);
        
        // Calculate Final
        let finalAmount = price - currentDiscount;
        if (finalAmount < 0) finalAmount = 0;
        
        // Count animation for final price
        const previousFinal = currentPrice - currentDiscount > 0 ? currentPrice - currentDiscount : 0;
        animateValue(sumFinal, previousFinal, finalAmount, 400);
        
        currentPrice = price;

        // Button validation rule
        if (price > 0) {
            submitBtn.disabled = false;
        } else {
            submitBtn.disabled = true;
        }
    }


    /* ==============================================
       3. Textarea Character Counter
       ============================================== */
    const notesInput = document.getElementById('additional-notes');
    const charCounter = document.getElementById('char-counter');

    notesInput.addEventListener('input', function() {
        const length = this.value.length;
        charCounter.textContent = `${length} / 1000`;
    });


    /* ==============================================
       4. Discount Code Logic
       ============================================== */
    const couponInput = document.getElementById('coupon-input');
    const applyCouponBtn = document.getElementById('apply-coupon-btn');
    const couponMessage = document.getElementById('coupon-message');

    applyCouponBtn.addEventListener('click', () => {
        const code = couponInput.value.trim().toUpperCase();
        if (code === '') return;

        // Clear previous states
        couponInput.classList.remove('success', 'invalid');
        couponMessage.classList.remove('success', 'invalid');

        // Simulation mock for discount validation
        if (code === 'LUMIERE10') {
            couponInput.classList.add('success');
            couponMessage.textContent = 'کد تخفیف با موفقیت اعمال شد.';
            couponMessage.classList.add('success');
            
            currentDiscount = 10;
            sumDiscount.textContent = '-$10';
            
            // Re-run summary update to adjust final amount
            if (currentPrice > 0) {
                const finalAmount = Math.max(currentPrice - currentDiscount, 0);
                animateValue(sumFinal, currentPrice, finalAmount, 400);
            }
        } else {
            couponInput.classList.add('invalid');
            couponMessage.textContent = 'کد تخفیف نامعتبر است.';
            couponMessage.classList.add('invalid');
            
            // Reset discount
            currentDiscount = 0;
            sumDiscount.textContent = '-$0';
            if (currentPrice > 0) {
                animateValue(sumFinal, currentPrice - 10 /* mock old val */, currentPrice, 400);
            }
        }
    });


    /* ==============================================
       5. Form Submission & Validation States
       ============================================== */
    const reservationForm = document.getElementById('reservation-form');
    const errorBanner = document.getElementById('global-error-banner');
    const btnText = submitBtn.querySelector('.btn-text');
    const spinner = document.getElementById('submit-spinner');
    const successModal = document.getElementById('success-modal');

    reservationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;
        errorBanner.style.display = 'none';

        // Validation Rule 1: No service selected
        if (currentPrice === 0 && (selectedText.textContent === 'Select a service' || selectedText.textContent === 'انتخاب سرویس')) {
            dropdownTrigger.classList.add('error');
            isValid = false;
        }

        // Validation Rule 2: "Other" selected but description empty
        if (selectedText.textContent === 'Other' || selectedText.textContent === 'سایر') {
            if (otherDescriptionInput.value.trim() === '') {
                otherDescriptionInput.classList.add('error');
                isValid = false;
            }
        }

        if (!isValid) {
            errorBanner.style.display = 'block';
            errorBanner.textContent = 'لطفاً تمامی فیلدهای الزامی را به درستی تکمیل کنید.';
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        // Trigger Loading State
        submitBtn.disabled = true;
        spinner.style.display = 'block';
        btnText.textContent = 'در حال پردازش...';

        // Skeleton loading class on summary to simulate processing
        summaryContent.classList.add('summary-loading');

        // Simulate Gateway Redirect & Success Return delay
        setTimeout(() => {
            summaryContent.classList.remove('summary-loading');
            spinner.style.display = 'none';
            btnText.textContent = 'ادامه جهت پرداخت';
            
            // Show Success Modal
            successModal.classList.add('active');
        }, 2000);
    });

    // Clear description error on typing
    otherDescriptionInput.addEventListener('input', function() {
        if (this.value.trim() !== '') {
            this.classList.remove('error');
        }
    });
});
