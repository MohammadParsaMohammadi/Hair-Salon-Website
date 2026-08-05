document.addEventListener('DOMContentLoaded', () => {

    /* ==============================================
       1. Dynamic SPA Screen Selection Routing
       ============================================== */
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.content-section');
    const reservationsBtnLink = document.getElementById('go-to-reservations');

    const switchSection = (targetSectionId) => {
        // Remove active state classes everywhere
        sections.forEach(sec => {
            sec.classList.remove('active');
        });
        navItems.forEach(item => {
            item.classList.remove('active');
        });

        // Activate matching elements
        const targetSection = document.getElementById(targetSectionId);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        const correspondingNavItem = document.querySelector(`[data-target="${targetSectionId}"]`);
        if (correspondingNavItem) {
            correspondingNavItem.classList.add('active');
        }

        // Auto close navigation drawer wrapper on mobile view after selecting
        closeMobileDrawer();
    };

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const target = item.getAttribute('data-target');
            switchSection(target);
        });
    });

    // Special redirection trigger inside Profile Area to view full reservations
    if (reservationsBtnLink) {
        reservationsBtnLink.addEventListener('click', (e) => {
            e.preventDefault();
            switchSection('section-reservations');
        });
    }


    /* ==============================================
       2. Mobile Drawer Controls
       ============================================== */
    const drawerToggle = document.getElementById('drawer-toggle');
    const sidebar = document.getElementById('dashboard-sidebar');
    const overlay = document.getElementById('drawer-overlay');

    const openMobileDrawer = () => {
        sidebar.classList.add('drawer-open');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Block outer scrolls
    };

    const closeMobileDrawer = () => {
        sidebar.classList.remove('drawer-open');
        overlay.classList.remove('active');
        document.body.style.overflow = ''; // Re-enable body scrolling
    };

    if (drawerToggle && sidebar && overlay) {
        drawerToggle.addEventListener('click', openMobileDrawer);
        overlay.addEventListener('click', closeMobileDrawer);
    }


    /* ==============================================
       3. Interactive File Upload Preview System
       ============================================== */
    const fileInput = document.getElementById('support-file');
    const previewBox = document.getElementById('file-preview-box');
    const imagePreview = document.getElementById('image-preview');
    const removePreviewBtn = document.getElementById('remove-preview-btn');

    if (fileInput) {
        fileInput.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                // Size Validation (5MB Max)
                if (file.size > 5 * 1024 * 1024) {
                    alert('حجم فایل بیش از حد مجاز ۵ مگابایت است.');
                    this.value = '';
                    return;
                }

                const reader = new FileReader();
                reader.onload = function(e) {
                    imagePreview.src = e.target.result;
                    previewBox.style.display = 'inline-flex';
                }
                reader.readAsDataURL(file);
            }
        });
    }

    if (removePreviewBtn) {
        removePreviewBtn.addEventListener('click', () => {
            fileInput.value = '';
            previewBox.style.display = 'none';
            imagePreview.src = '#';
        });
    }


    /* ==============================================
       4. Premium Form Loading State Controls
       ============================================== */
    const supportForm = document.getElementById('support-form');
    const submitBtn = document.getElementById('support-submit-btn');
    const submitSpinner = document.getElementById('support-spinner');

    if (supportForm) {
        supportForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Activate button loading state
            submitBtn.disabled = true;
            submitSpinner.style.display = 'block';
            submitBtn.querySelector('.btn-text').textContent = 'در حال ارسال...';

            // Simulate support ticket API dispatch
            setTimeout(() => {
                alert('درخواست پشتیبانی با موفقیت ثبت شد!');
                
                // Reset form element inputs
                supportForm.reset();
                if (previewBox) previewBox.style.display = 'none';
                
                // Revert state indicators back
                submitBtn.disabled = false;
                submitSpinner.style.display = 'none';
                submitBtn.querySelector('.btn-text').textContent = 'ارسال پیام';
            }, 1500);
        });
    }

});

/* ==============================================
   5. Interactive Clipboard Copy Logic
   ============================================== */
function copyTrackingID(text, buttonElement) {
    navigator.clipboard.writeText(text).then(() => {
        const toast = document.getElementById('toast-notif');
        
        // Temporarily change button visual indicator
        const originalIcon = buttonElement.innerHTML;
        buttonElement.innerHTML = '✅';
        
        // Activate toast notification popup
        toast.classList.add('active');

        setTimeout(() => {
            buttonElement.innerHTML = originalIcon;
        }, 1500);

        setTimeout(() => {
            toast.classList.remove('active');
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy ID: ', err);
    });
}
