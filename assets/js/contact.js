document.addEventListener('DOMContentLoaded', () => {

    /* ==============================================
       1. Contact Form Validations & Live States
       ============================================== */
    const contactForm = document.getElementById('contact-form');
    const nameInput = document.getElementById('contact-name');
    const phoneInput = document.getElementById('contact-phone');
    const msgInput = document.getElementById('contact-message');
    const submitBtn = document.getElementById('submit-message-btn');
    const charCounter = document.getElementById('char-counter');
    const errorBanner = document.getElementById('form-error-banner');
    
    // Check for empty info state (Simulation Hook)
    const MOCK_DB_HAS_INFO = true; // Switch to false to simulate empty database return
    if (!MOCK_DB_HAS_INFO) {
        const infoPanel = document.getElementById('contact-info-panel');
        if (infoPanel) {
            infoPanel.innerHTML = `
                <h2>Contact Information</h2>
                <div class="empty-info-state mt-4">
                    Contact information is currently unavailable.
                </div>
            `;
        }
    }

    // Input Filters (Numeric constraint for Phone Input)
    if(phoneInput) {
        phoneInput.addEventListener('keypress', (e) => {
            if (!/[0-9]/.test(e.key)) {
                e.preventDefault();
            }
        });
    }

    // Event Listeners for Live Validation Checks
    [nameInput, phoneInput, msgInput].forEach(input => {
        if(input) {
            input.addEventListener('input', () => {
                // Remove error styling if user starts typing again
                if (input.classList.contains('input-invalid')) {
                    input.classList.remove('input-invalid');
                }
                
                // Track characters for Textarea
                if (input.id === 'contact-message') {
                    charCounter.textContent = `${input.value.length} / 1500`;
                }

                validateFormFields();
            });
        }
    });

    function validateFormFields() {
        const isNameValid = nameInput.value.trim().length > 0;
        const isPhoneFilled = phoneInput.value.trim().length > 0;
        const isMsgValid = msgInput.value.trim().length > 0 && msgInput.value.length <= 1500;
        
        // Button enables only when all base fields have content
        submitBtn.disabled = !(isNameValid && isPhoneFilled && isMsgValid);
    }

    // Mobile Number Structure Regex (Validates structural input)
    function verifyMobileStructure(numberString) {
        const regexPattern = /^09\d{9}$/; // Standard generic matching for Iranian operators
        return regexPattern.test(numberString.trim().replace(/\s+/g, ''));
    }

    // Submit Handling Logic
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            errorBanner.style.display = 'none';

            // Validate specifically targeted field conditions
            if (!verifyMobileStructure(phoneInput.value)) {
                phoneInput.classList.add('input-invalid');
                return;
            }

            // Engage Loading State UI
            toggleFormLoadingState(true);

            // Simulation of API Call delay
            setTimeout(() => {
                // Math.random simulation for error state visibility check
                const simulateError = false; // Change to true to test error banner

                if (simulateError) {
                    toggleFormLoadingState(false);
                    errorBanner.style.display = 'block';
                } else {
                    // Success Reset
                    triggerToastNotification('✅ Your message has been sent successfully.');
                    contactForm.reset();
                    charCounter.textContent = '0 / 1500';
                    toggleFormLoadingState(false);
                    submitBtn.disabled = true; // Re-disable due to empty form
                }
            }, 1800);
        });
    }

    function toggleFormLoadingState(isLoading) {
        const spinner = document.getElementById('btn-spinner');
        const btnText = submitBtn.querySelector('.btn-text');

        nameInput.disabled = isLoading;
        phoneInput.disabled = isLoading;
        msgInput.disabled = isLoading;
        submitBtn.disabled = isLoading;

        if (isLoading) {
            spinner.style.display = 'block';
            btnText.textContent = 'Sending...';
        } else {
            spinner.style.display = 'none';
            btnText.textContent = 'Send Message';
        }
    }


    /* ==============================================
       2. Global Toast Dispatcher
       ============================================== */
    function triggerToastNotification(message) {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = 'toast-msg';
        toast.textContent = message;
        
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(-10px)';
            setTimeout(() => toast.remove(), 300);
        }, 4000); // 4 seconds read time
    }


    /* ==============================================
       3. Accordion Interaction Engine (FAQ)
       ============================================== */
    const accordionBtns = document.querySelectorAll('.accordion-btn');

    accordionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const currentItem = btn.parentElement;
            const collapseContent = btn.nextElementSibling;
            const isCurrentlyOpen = currentItem.classList.contains('open');

            // Collapse all elements gracefully
            document.querySelectorAll('.accordion-item').forEach(item => {
                item.classList.remove('open');
                item.querySelector('.accordion-content').style.maxHeight = null;
            });

            // Expand the target if it wasn't already open
            if (!isCurrentlyOpen) {
                currentItem.classList.add('open');
                collapseContent.style.maxHeight = collapseContent.scrollHeight + "px";
            }
        });
    });

    // Fire intersection observer rules for new `.info-item-card` elements on DOM load
    const staggerObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.stagger-children').forEach(el => {
        staggerObserver.observe(el);
    });

});
