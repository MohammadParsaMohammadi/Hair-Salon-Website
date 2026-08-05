document.addEventListener('DOMContentLoaded', () => {

    /* ==============================================
       1. Staggered Entrance Animations (Intersection Observer)
       ============================================== */
    const staggerObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Unobserve after animating once
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.stagger-children').forEach(el => {
        staggerObserver.observe(el);
    });

    /* ==============================================
       2. Services Filtering Logic
       ============================================== */
    const filterPills = document.querySelectorAll('.filter-pill');
    const serviceCards = document.querySelectorAll('.service-card:not(.skeleton-card)');
    const emptyState = document.getElementById('services-empty-state');
    const servicesGrid = document.getElementById('services-grid');

    if (filterPills.length > 0 && serviceCards.length > 0) {
        filterPills.forEach(pill => {
            pill.addEventListener('click', () => {
                // Remove active class from all pills
                filterPills.forEach(p => p.classList.remove('active'));
                // Add active class to clicked pill
                pill.classList.add('active');

                const filterValue = pill.getAttribute('data-filter');
                let visibleCount = 0;

                // Temporarily remove stagger class to prevent re-triggering entrance animation weirdly
                servicesGrid.classList.remove('stagger-children', 'visible');
                
                serviceCards.forEach((card, index) => {
                    const categories = card.getAttribute('data-category').split(' ');
                    
                    if (filterValue === 'all' || categories.includes(filterValue)) {
                        card.style.display = 'flex';
                        // Re-assign CSS variable for smooth manual stagger if needed
                        card.style.setProperty('--i', index + 1); 
                        
                        // Force a tiny reflow to allow CSS opacity transition if we wanted to add one
                        card.style.opacity = '1'; 
                        card.style.transform = 'translateY(0)';
                        visibleCount++;
                    } else {
                        card.style.display = 'none';
                    }
                });

                // Handle Empty State display
                if (visibleCount === 0) {
                    emptyState.style.display = 'block';
                } else {
                    emptyState.style.display = 'none';
                }
                
                // Hide skeletons when filtering is active (for demo realism)
                document.querySelectorAll('.skeleton-card').forEach(skel => {
                    skel.style.display = (filterValue === 'all') ? 'flex' : 'none';
                });
            });
        });
    }

    /* ==============================================
       3. Optional: Sticky Filter Shadow on Scroll
       ============================================== */
    const filterWrapper = document.querySelector('.services-filter-wrapper');
    if (filterWrapper) {
        window.addEventListener('scroll', () => {
            // Add a slight shadow when sticky is engaged
            if (filterWrapper.getBoundingClientRect().top <= 81) {
                filterWrapper.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.05)';
            } else {
                filterWrapper.style.boxShadow = 'none';
            }
        });
    }
});
