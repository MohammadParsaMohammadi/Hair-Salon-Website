document.addEventListener('DOMContentLoaded', () => {
    /* ==============================================
       1. Header Scroll Effect
       ============================================== */
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    /* ==============================================
       2. Mobile Drawer Toggle
       ============================================== */
    const menuToggle = document.getElementById('menu-toggle');
    const closeDrawer = document.getElementById('close-drawer');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const drawerOverlay = document.getElementById('drawer-overlay');

    function toggleDrawer() {
        mobileDrawer.classList.toggle('active');
        drawerOverlay.classList.toggle('active');
        document.body.style.overflow = mobileDrawer.classList.contains('active') ? 'hidden' : '';
    }

    if (menuToggle && closeDrawer) {
        menuToggle.addEventListener('click', toggleDrawer);
        closeDrawer.addEventListener('click', toggleDrawer);
        drawerOverlay.addEventListener('click', toggleDrawer);
    }

    /* ==============================================
       3. Button Ripple Effect
       ============================================== */
    const rippleButtons = document.querySelectorAll('.ripple-effect');
    rippleButtons.forEach(btn => {
        btn.addEventListener('click', function (e) {
            let ripple = document.createElement('span');
            ripple.classList.add('ripple');
            this.appendChild(ripple);

            let x = e.clientX - e.target.getBoundingClientRect().left;
            let y = e.clientY - e.target.getBoundingClientRect().top;

            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    /* ==============================================
       4. Intersection Observer (Fade Up Anim)
       ============================================== */
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal-on-scroll').forEach(section => {
        observer.observe(section);
    });

    /* ==============================================
   5. Testimonial Auto-Slider (RTL-aware)
   ============================================== */
const track = document.getElementById('testimonial-track');
const dotsContainer = document.getElementById('slider-dots');

if (track) {
    let currentIndex = 0;
    const cards = track.children;
    let autoSlideInterval = null;

    function getCardsVisible() {
        if (window.innerWidth <= 767) return 1;
        if (window.innerWidth <= 991) return 2;
        return 3;
    }

    function updateSlider() {
        const cardsVisible = getCardsVisible();
        const maxIndex = Math.max(0, cards.length - cardsVisible);
        
        if (currentIndex > maxIndex) {
            currentIndex = maxIndex;
        }

        const gap = 32;
        const cardWidth = cards[0].offsetWidth;
        const moveAmount = (cardWidth + gap) * currentIndex;
        
        // Use positive translateX when page is in RTL mode
        const isRTL = document.dir === 'rtl' || getComputedStyle(document.body).direction === 'rtl';
        const directionMultiplier = isRTL ? 1 : -1;

        track.style.transform = `translateX(${directionMultiplier * moveAmount}px)`;

        // Sync pagination dots
        if (dotsContainer) {
            const dots = dotsContainer.querySelectorAll('.dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }
    }

    function createDots() {
        if (!dotsContainer) return;
        dotsContainer.innerHTML = '';
        const cardsVisible = getCardsVisible();
        const totalDots = Math.max(1, cards.length - cardsVisible + 1);

        for (let i = 0; i < totalDots; i++) {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            dot.addEventListener('click', () => {
                currentIndex = i;
                updateSlider();
                resetInterval();
            });
            dotsContainer.appendChild(dot);
        }
    }

    function nextSlide() {
        const cardsVisible = getCardsVisible();
        const maxIndex = cards.length - cardsVisible;

        if (currentIndex >= maxIndex) {
            currentIndex = 0;
        } else {
            currentIndex++;
        }
        updateSlider();
    }

    function resetInterval() {
        clearInterval(autoSlideInterval);
        autoSlideInterval = setInterval(nextSlide, 6000);
    }

    // Initialize slider & controls
    createDots();
    updateSlider();
    autoSlideInterval = setInterval(nextSlide, 6000);

    // Recalculate layout on window resize
    window.addEventListener('resize', () => {
        createDots();
        updateSlider();
    });
}

    /* ==============================================
       6. Simulate Skeleton Loading (UX Spec)
       ============================================== */
    const skeletonCards = document.querySelectorAll('.skeleton-card');
    if (skeletonCards.length > 0) {
        setTimeout(() => {
            skeletonCards.forEach(card => {
                card.classList.remove('skeleton-card');
            });
        }, 1500); // Remove skeleton after 1.5s
    }

    /* ==============================================
       7. Footer Year Setup
       ============================================== */
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    /* ==============================================
       Services Details Modal Logic
       ============================================== */
    const modal = document.getElementById('service-modal');
    if (!modal) return; // Exit if not on a page with the modal

    const closeBtn = document.getElementById('service-modal-close');
    
    // Modal Target Elements
    const modalImg = document.getElementById('service-modal-img');
    const modalTitle = document.getElementById('service-modal-title');
    const modalDesc = document.getElementById('service-modal-desc');
    const modalTag = document.getElementById('service-modal-tag');
    const modalPrice = document.getElementById('service-modal-price');
    const modalDuration = document.getElementById('service-modal-duration');

    const openModal = (card) => {
        // Extract data - works for both index.html and about-services.html structures
        const img = card.querySelector('img').src;
        const title = card.querySelector('h3').textContent;
        
        // Extract from data attributes with fallbacks
        const desc = card.getAttribute('data-full-desc') || card.querySelector('p').textContent;
        const tag = card.getAttribute('data-category') || 'خدمات ویژه';
        const price = card.getAttribute('data-price') || card.querySelector('.price')?.textContent || 'متغیر';
        const duration = card.getAttribute('data-duration') || 'بسته به نوع خدمت';

        // Populate Modal
        modalImg.src = img;
        modalTitle.textContent = title;
        modalDesc.textContent = desc;
        modalTag.textContent = tag;
        modalPrice.textContent = price;
        modalDuration.textContent = duration;

        // Show Modal (uses existing .active CSS transitions from public.css)
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    };

    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Clear src after animation finishes to prevent flicker on next open
        setTimeout(() => { modalImg.src = ''; }, 300);
    };

    // Attach click events specifically to the "More Details" buttons
    document.querySelectorAll('.service-card .view-details-link').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const card = btn.closest('.service-card');
            if (card && !card.classList.contains('skeleton-card')) {
                openModal(card);
            }
        });
    });

    // Close Modals Triggers
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    
    // Click outside to close
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal(); 
    });
    
    // Accessibility: Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
});
