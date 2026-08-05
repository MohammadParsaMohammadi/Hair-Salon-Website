document.addEventListener('DOMContentLoaded', () => {
    
    /* ==============================================
       1. Slider Logic (Drag, Snap, Arrows)
       ============================================== */
    const sliderWrappers = document.querySelectorAll('.slider-wrapper');

    sliderWrappers.forEach(wrapper => {
        const track = wrapper.querySelector('.slider-track');
        const prevBtn = wrapper.querySelector('.prev');
        const nextBtn = wrapper.querySelector('.next');
        
        if (!track) return;

        // --- Arrow Navigation ---
        const scrollAmount = () => {
            const card = track.querySelector('.portfolio-card');
            if(!card) return 0;
            const gap = 24; // Spec: 24px spacing
            return card.offsetWidth + gap;
        };

        const updateButtons = () => {
            if(!prevBtn || !nextBtn) return;
            // Disable prev if at start
            prevBtn.disabled = track.scrollLeft >= 0;
            // Disable next if at end (allow 2px threshold for rounding)
            nextBtn.disabled = Math.ceil(track.scrollLeft + track.clientWidth) >= track.scrollWidth - 2;
        };

        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => {
                track.scrollBy({ left: scrollAmount(), behavior: 'smooth' });
            });
            nextBtn.addEventListener('click', () => {
                track.scrollBy({ left: -scrollAmount(), behavior: 'smooth' });
            });
        }

        track.addEventListener('scroll', updateButtons);
        // Initial check
        updateButtons();
        window.addEventListener('resize', updateButtons);

        // --- Drag to Scroll Logic ---
        let isDown = false;
        let startX;
        let scrollLeft;

        track.addEventListener('mousedown', (e) => {
            isDown = true;
            track.classList.add('active'); // active class removes snap temporarily
            startX = e.pageX - track.offsetLeft;
            scrollLeft = track.scrollLeft;
        });

        track.addEventListener('mouseleave', () => {
            isDown = false;
            track.classList.remove('active');
        });

        track.addEventListener('mouseup', () => {
            isDown = false;
            track.classList.remove('active');
            // Re-eval snap on release
            setTimeout(updateButtons, 300);
        });

        track.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault(); // Stop text selection
            const x = e.pageX - track.offsetLeft;
            const walk = (x - startX) * 2; // Scroll fast multiplier
            track.scrollLeft = scrollLeft - walk;
        });
    });

    /* ==============================================
       2. Staggered Entrance Animations
       ============================================== */
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

    /* ==============================================
       3. Portfolio Modal Logic
       ============================================== */
    const modal = document.getElementById('portfolio-modal');
    const closeBtn = document.getElementById('modal-close');
    
    // Modal Elements
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const modalTag = document.getElementById('modal-tag');
    const modalService = document.getElementById('modal-service');
    const modalDate = document.getElementById('modal-date');

    const openModal = (card) => {
        // Extract data from clicked card
        const img = card.querySelector('img').src;
        const tag = card.querySelector('.card-tag').textContent;
        const title = card.querySelector('h3').textContent;
        const desc = card.querySelector('.desc-clamp').textContent;
        const service = card.getAttribute('data-service') || tag;
        const date = card.getAttribute('data-date') || 'اخیر';

        // Populate Modal
        modalImg.src = img;
        modalTag.textContent = tag;
        modalTitle.textContent = title;
        modalDesc.textContent = desc;
        modalService.textContent = service;
        modalDate.textContent = date;

        // Show Modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    };

    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        // Clear src after animation to prevent flicker next time
        setTimeout(() => { modalImg.src = ''; }, 300);
    };

    // Attach click events to all real cards (ignore skeletons)
    document.querySelectorAll('.portfolio-card:not(.skeleton-card)').forEach(card => {
        card.addEventListener('click', (e) => {
            // Only open if the user wasn't just dragging (checking parent track state)
            const track = card.closest('.slider-track');
            if (track && track.classList.contains('active')) return;
            openModal(card);
        });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (modal) modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal(); // Click outside to close
    });
});
