document.addEventListener('DOMContentLoaded', () => {

    /* ==============================================
       1. Custom Dropdowns & Conditional Logic
       ============================================== */
    
    // Service Dropdown Elements (Updated to be ID-specific)
    const serviceDropdownTrigger = document.querySelector('#service-dropdown .dropdown-trigger');
    const serviceDropdownMenu = document.getElementById('service-dropdown');
    const serviceDropdownOptions = document.querySelectorAll('#service-options li');
    const searchInput = document.getElementById('service-search');
    const serviceSelectedText = document.querySelector('#service-dropdown .selected-text');
    
    const otherServiceContainer = document.getElementById('other-service-container');
    const otherDescriptionInput = document.getElementById('other-description');

    // Time Dropdown Elements (New)
    const timeDropdownTrigger = document.querySelector('#time-dropdown .dropdown-trigger');
    const timeDropdownMenu = document.getElementById('time-dropdown');
    const timeDropdownOptions = document.querySelectorAll('#time-options li');
    const timeSelectedText = document.getElementById('time-selected-text');
    
    let currentTime = null;

    // Helper: Close all dropdowns
    function closeAllDropdowns() {
        serviceDropdownMenu.classList.remove('open');
        serviceDropdownTrigger.classList.remove('active');
        timeDropdownMenu.classList.remove('open');
        timeDropdownTrigger.classList.remove('active');
    }

    // Toggle Service Dropdown
    serviceDropdownTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = serviceDropdownMenu.classList.contains('open');
        closeAllDropdowns();
        if (!isOpen) {
            serviceDropdownMenu.classList.add('open');
            serviceDropdownTrigger.classList.add('active');
            searchInput.focus();
        }
    });

    // Toggle Time Dropdown
    timeDropdownTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = timeDropdownMenu.classList.contains('open');
        closeAllDropdowns();
        if (!isOpen) {
            timeDropdownMenu.classList.add('open');
            timeDropdownTrigger.classList.add('active');
        }
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.custom-dropdown')) {
            closeAllDropdowns();
        }
    });

    // Service Search Filtering
    searchInput.addEventListener('input', (e) => {
        const filter = e.target.value.toLowerCase();
        serviceDropdownOptions.forEach(option => {
            const text = option.querySelector('.opt-name').textContent.toLowerCase();
            option.style.display = text.includes(filter) ? 'flex' : 'none';
        });
    });

    // Service Option Selection Logic
    serviceDropdownOptions.forEach(option => {
        option.addEventListener('click', () => {
            serviceDropdownOptions.forEach(opt => opt.classList.remove('selected'));
            serviceDropdownTrigger.classList.remove('error');
            
            option.classList.add('selected');
            const val = parseFloat(option.getAttribute('data-value'));
            const name = option.getAttribute('data-name');
            
            serviceSelectedText.textContent = name;
            serviceSelectedText.classList.add('has-value');
            
            if (name === 'Other' || name === 'سایر') {
                otherServiceContainer.classList.add('show');
            } else {
                otherServiceContainer.classList.remove('show');
                otherDescriptionInput.value = '';
                otherDescriptionInput.classList.remove('error');
            }

            closeAllDropdowns();
            updateOrderSummary(name, val);
        });
    });

    // Time Option Selection Logic (New)
    timeDropdownOptions.forEach(option => {
        option.addEventListener('click', () => {
            timeDropdownOptions.forEach(opt => opt.classList.remove('selected'));
            timeDropdownTrigger.classList.remove('error');
            
            option.classList.add('selected');
            const timeVal = option.getAttribute('data-time');
            
            timeSelectedText.textContent = timeVal;
            timeSelectedText.classList.add('has-value');
            
            closeAllDropdowns();

            // Update State & Summary
            currentTime = timeVal;
            document.getElementById('sum-time').textContent = timeVal;
            checkFormValidity();
        });
    });


    /* ==============================================
       2. Live Order Summary & Validation State
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

    // Centralized form validity check
    function checkFormValidity() {
        if (currentPrice > 0 && currentTime !== null) {
            submitBtn.disabled = false;
        } else {
            submitBtn.disabled = true;
        }
    }

    function animateValue(obj, start, end, duration, prefix = "$") {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const currentVal = Math.floor(progress * (end - start) + start);
            obj.textContent = prefix + currentVal;
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                obj.textContent = prefix + end; 
            }
        };
        window.requestAnimationFrame(step);
    }

    function updateOrderSummary(name, price) {
        summaryEmpty.style.display = 'none';
        summaryContent.style.display = 'block';

        sumServiceName.textContent = name;
        
        animateValue(sumPrice, currentPrice, price, 400);
        
        let finalAmount = price - currentDiscount;
        if (finalAmount < 0) finalAmount = 0;
        
        const previousFinal = currentPrice - currentDiscount > 0 ? currentPrice - currentDiscount : 0;
        animateValue(sumFinal, previousFinal, finalAmount, 400);
        
        currentPrice = price;
        checkFormValidity();
    }

    /* 
       Keep Sections 3 (Textarea) and 4 (Discount) exactly as they are in your file 
    */

    /* ==============================================
       5. Form Submission & Validation States
       ============================================== */
    const reservationForm = document.getElementById('reservation-form');
    const errorBanner = document.getElementById('global-error-banner');
    const btnText = submitBtn.querySelector('.btn-text') || submitBtn; // Fallback added due to HTML variation
    const spinner = document.getElementById('submit-spinner');
    const successModal = document.getElementById('success-modal');

    reservationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;
        errorBanner.style.display = 'none';

        // Validation Rule 1: No service selected
        if (currentPrice === 0) {
            serviceDropdownTrigger.classList.add('error');
            isValid = false;
        }

        // Validation Rule 2: No time selected (New)
        if (!currentTime) {
            timeDropdownTrigger.classList.add('error');
            isValid = false;
        }

        // Validation Rule 3: "Other" selected but description empty
        if (serviceSelectedText.textContent === 'Other' || serviceSelectedText.textContent === 'سایر') {
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
        if(submitBtn.querySelector('.btn-text')) {
             submitBtn.querySelector('.btn-text').textContent = 'در حال پردازش...';
        } else {
             // To handle the HTML commented text variance
             submitBtn.childNodes[0].textContent = 'در حال پردازش... '; 
        }

        summaryContent.classList.add('summary-loading');

        setTimeout(() => {
            summaryContent.classList.remove('summary-loading');
            spinner.style.display = 'none';
            if(submitBtn.querySelector('.btn-text')) {
                submitBtn.querySelector('.btn-text').textContent = 'ادامه جهت پرداخت';
            } else {
                submitBtn.childNodes[0].textContent = 'ادامه جهت پرداخت '; 
            }
            
            successModal.classList.add('active');
            
            // Outputting the final data exactly as requested conceptually
            console.log("Final Reservation State:", {
                service: serviceSelectedText.textContent,
                price: currentPrice,
                time: currentTime,
                discount: currentDiscount,
                notes: document.getElementById('additional-notes').value
            });
            
        }, 2000);
    });

    otherDescriptionInput.addEventListener('input', function() {
        if (this.value.trim() !== '') {
            this.classList.remove('error');
        }
    });
});
