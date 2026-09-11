document.addEventListener('DOMContentLoaded', () => {
    // 1. Scroll Reveal Animation using IntersectionObserver
    const observerOptions = { threshold: 0.1 };
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('section, .skill-card').forEach(el => {
        el.classList.add('fade-in-up');
        revealObserver.observe(el);
    });

    // 2. Metric Counter Count-Up Animation
    const counterElements = document.querySelectorAll('[data-counter]');
    let countersAnimated = false;

    const animateCounters = () => {
        counterElements.forEach(counter => {
            const target = parseFloat(counter.getAttribute('data-counter'));
            const decimals = parseInt(counter.getAttribute('data-decimals') || '0', 10);
            const duration = 1500; // ms
            const stepTime = 20;
            const steps = duration / stepTime;
            const increment = target / steps;
            let current = 0;

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                counter.textContent = current.toFixed(decimals);
            }, stepTime);
        });
    };

    const heroSection = document.querySelector('#hero');
    if (heroSection) {
        const heroObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !countersAnimated) {
                countersAnimated = true;
                animateCounters();
            }
        }, { threshold: 0.3 });
        heroObserver.observe(heroSection);
    }

    // 3. Skills Matrix Category Filter with FLIP Slide Animation
    const filterButtons = document.querySelectorAll('#skills-filter button');
    const skillCards = document.querySelectorAll('.skill-card');
    const skillsGrid = document.getElementById('skills-grid');

    let isAnimating = false;

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (isAnimating || btn.classList.contains('active-tab')) return;

            const filter = btn.getAttribute('data-filter');

            // 1. Update button active states
            filterButtons.forEach(b => {
                b.classList.remove('bg-sky-500', 'text-slate-950', 'shadow-md', 'shadow-sky-500/20', 'active-tab');
                b.classList.add('bg-slate-900', 'text-slate-300');
            });
            btn.classList.add('bg-sky-500', 'text-slate-950', 'shadow-md', 'shadow-sky-500/20', 'active-tab');
            btn.classList.remove('bg-slate-900', 'text-slate-300');

            isAnimating = true;

            // --- PHASE 1: FIRST ---
            // Record current screen coordinates of all visible cards
            const firstPositions = new Map();
            skillCards.forEach(card => {
                if (!card.classList.contains('hidden')) {
                    firstPositions.set(card, card.getBoundingClientRect());
                }
            });

            // --- LAYOUT SWITCH ---
            // Instantly swap grid vs single-column list view
            if (filter === 'all') {
                skillsGrid.className = 'grid md:grid-cols-2 gap-6';
            } else {
                skillsGrid.className = 'flex flex-col gap-6 max-w-2xl mx-auto w-full';
            }

            // Apply DOM visibility
            skillCards.forEach(card => {
                const category = card.getAttribute('data-category');
                const isMatch = (filter === 'all' || category === filter);

                if (isMatch) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });

            // --- PHASE 2: LAST ---
            // Record target screen coordinates after layout re-flow
            const lastPositions = new Map();
            skillCards.forEach(card => {
                if (!card.classList.contains('hidden')) {
                    lastPositions.set(card, card.getBoundingClientRect());
                }
            });

            // --- PHASE 3 & 4: INVERT & PLAY ---
            skillCards.forEach(card => {
                if (card.classList.contains('hidden')) return;

                const first = firstPositions.get(card);
                const last = lastPositions.get(card);

                if (first && last) {
                    // Card was already visible: calculate offset vector
                    const deltaX = first.left - last.left;
                    const deltaY = first.top - last.top;

                    // Invert position instantly without transition
                    card.style.transition = 'none';
                    card.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
                    card.style.opacity = '1';

                    // Force browser layout repaint
                    card.getBoundingClientRect();

                    // Play animation to glided target position
                    requestAnimationFrame(() => {
                        card.style.transition = 'transform 380ms cubic-bezier(0.16, 1, 0.3, 1), opacity 300ms ease';
                        card.style.transform = 'translate(0, 0)';
                    });
                } else {
                    // Card is returning from hidden state: smooth fade/scale in
                    card.style.transition = 'none';
                    card.style.transform = 'scale(0.92)';
                    card.style.opacity = '0';

                    card.getBoundingClientRect();

                    requestAnimationFrame(() => {
                        card.style.transition = 'transform 300ms cubic-bezier(0.16, 1, 0.3, 1), opacity 300ms ease';
                        card.style.transform = 'scale(1)';
                        card.style.opacity = '1';
                    });
                }
            });

            setTimeout(() => {
                isAnimating = false;
            }, 380);
        });
    });

    // 4. Interactive HF Space Deferred Loading
    const loadHfBtn = document.querySelector('#load-hf-space-btn');
    const hfPlaceholder = document.querySelector('#hf-placeholder');
    const hfIframe = document.querySelector('#hf-space-iframe');

    if (loadHfBtn && hfIframe) {
        loadHfBtn.addEventListener('click', () => {
            const targetSrc = hfIframe.getAttribute('data-src') || "https://njand-latin-asr-demo.hf.space";
            if (!hfIframe.src || hfIframe.src === window.location.href) {
                hfIframe.src = targetSrc;
            }
            if (hfPlaceholder) {
                hfPlaceholder.classList.add('hidden');
            }
            loadHfBtn.classList.add('hidden');
            hfIframe.classList.remove('hidden');

            if (typeof umami !== 'undefined') {
                umami.track('Interactive Demo Loaded');
            }
        });
    }

    // 5. Email CTA Initialization & Copy to Clipboard
    const emailBtn = document.getElementById('email-cta');
    const copyEmailBtn = document.getElementById('copy-email-btn');
    const copyEmailText = document.getElementById('copy-email-text');

    if (emailBtn) {
        const user = emailBtn.getAttribute('data-user');
        const domain = emailBtn.getAttribute('data-domain');
        if (user && domain) {
            emailBtn.href = `mailto:${user}@${domain}`;
        }
    }

    if (copyEmailBtn && copyEmailText) {
        copyEmailBtn.addEventListener('click', () => {
            const user = copyEmailBtn.getAttribute('data-user');
            const domain = copyEmailBtn.getAttribute('data-domain');
            if (user && domain) {
                const email = `${user}@${domain}`;
                navigator.clipboard.writeText(email).then(() => {
                    copyEmailText.textContent = 'Copied to Clipboard!';
                    setTimeout(() => {
                        copyEmailText.textContent = 'Copy Email Address';
                    }, 2500);
                });
            }
        });
    }

    // 6. Experience Accordion Toggle
    document.querySelectorAll('.experience-toggle-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const parent = this.closest('.space-y-3');
            const details = parent ? parent.querySelector('.experience-details') : null;
            const svg = this.querySelector('svg');
            const span = this.querySelector('span');

            if (details) {
                details.classList.toggle('hidden');
                if (svg) svg.classList.toggle('rotate-180');
                
                if (span) {
                    const isExpanded = !details.classList.contains('hidden');
                    span.textContent = isExpanded ? 'Hide' : 'View More';
                }
            }
        });
    });

    // 7. Analytics Event Listeners & Navigation
    const downloadBtn = document.querySelector('#download-cv-btn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            if (typeof umami !== 'undefined') {
                umami.track('CV Download', { source: 'Header / Hero' });
            }
        });
    }

    document.querySelectorAll('.outbound-link').forEach(link => {
        link.addEventListener('click', function() {
            const platform = this.getAttribute('data-platform') || 'Outbound Link';
            if (typeof umami !== 'undefined') {
                umami.track('Outbound Click', { platform: platform, url: this.href });
            }
        });
    });

    const toggleBtn = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const openIcon = document.getElementById('menu-icon-open');
    const closeIcon = document.getElementById('menu-icon-close');

    if (toggleBtn && mobileMenu) {
        toggleBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            if (openIcon) openIcon.classList.toggle('hidden');
            if (closeIcon) closeIcon.classList.toggle('hidden');
        });

        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                if (openIcon) openIcon.classList.remove('hidden');
                if (closeIcon) closeIcon.classList.add('hidden');
            });
        });
    }
});