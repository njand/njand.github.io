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

    // 3. Skills Matrix Category Filter with Smooth FLIP Animations
    const filterButtons = document.querySelectorAll('#skills-filter button');
    const skillCards = document.querySelectorAll('.skill-card');
    const skillsGrid = document.getElementById('skills-grid');

    let isAnimating = false;

    filterButtons.forEach(btn => {
        btn.addEventListener('click', async () => {
            const filter = btn.getAttribute('data-filter');
            const activeBtn = document.querySelector('#skills-filter button.active-tab');
            const currentFilter = activeBtn ? activeBtn.getAttribute('data-filter') : 'all';

            if (isAnimating || filter === currentFilter) return;
            isAnimating = true;

            // Update button UI states
            filterButtons.forEach(b => {
                b.classList.remove('bg-sky-500', 'text-slate-950', 'shadow-md', 'shadow-sky-500/20', 'active-tab');
                b.classList.add('bg-slate-900', 'text-slate-300');
            });
            btn.classList.add('bg-sky-500', 'text-slate-950', 'shadow-md', 'shadow-sky-500/20', 'active-tab');
            btn.classList.remove('bg-slate-900', 'text-slate-300');

            const easingCurve = 'cubic-bezier(0.16, 1, 0.3, 1)';

            // SCENARIO 1: Switching directly between single categories
            if (currentFilter !== 'all' && filter !== 'all') {
                const currentCard = document.querySelector(`.skill-card[data-category="${currentFilter}"]`);
                const targetCard = document.querySelector(`.skill-card[data-category="${filter}"]`);

                if (currentCard) {
                    currentCard.style.transition = `opacity 300ms ease, transform 300ms ${easingCurve}`;
                    currentCard.style.opacity = '0';
                    currentCard.style.transform = 'scale(0.95)';
                    await new Promise(r => setTimeout(r, 300));
                    currentCard.classList.add('hidden');
                }

                if (targetCard) {
                    targetCard.classList.remove('hidden');
                    targetCard.style.transition = 'none';
                    targetCard.style.opacity = '0';
                    targetCard.style.transform = 'scale(0.95)';
                    targetCard.getBoundingClientRect(); // Force reflow

                    targetCard.style.transition = `opacity 400ms ease, transform 400ms ${easingCurve}`;
                    targetCard.style.opacity = '1';
                    targetCard.style.transform = 'scale(1)';
                    await new Promise(r => setTimeout(r, 400));
                }
                isAnimating = false;
                return;
            }

            // SCENARIO 2: Expanding from "All Capabilities" to single category
            if (currentFilter === 'all' && filter !== 'all') {
                const targetCard = document.querySelector(`.skill-card[data-category="${filter}"]`);
                const otherCards = Array.from(skillCards).filter(c => c !== targetCard);

                // Phase A: Fade out non-selected cards
                otherCards.forEach(c => {
                    c.style.transition = `opacity 300ms ease, transform 300ms ${easingCurve}`;
                    c.style.opacity = '0';
                    c.style.transform = 'scale(0.95)';
                });
                await new Promise(r => setTimeout(r, 300));

                // Phase B: Record initial grid position (FIRST)
                const first = targetCard.getBoundingClientRect();

                // Phase C: Switch DOM layout to single centered column
                otherCards.forEach(c => c.classList.add('hidden'));
                skillsGrid.className = 'flex flex-col gap-6 max-w-2xl mx-auto w-full';

                // Phase D: Record target position (LAST)
                const last = targetCard.getBoundingClientRect();

                // Phase E: Invert transform (scale up from 0.5 -> 1.0)
                const deltaX = first.left - last.left;
                const deltaY = first.top - last.top;
                const scaleX = first.width / last.width;
                const scaleY = first.height / last.height;

                targetCard.style.transition = 'none';
                targetCard.style.transformOrigin = 'top left';
                targetCard.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${scaleX}, ${scaleY})`;
                targetCard.getBoundingClientRect(); // Force reflow

                targetCard.style.transition = `transform 650ms ${easingCurve}`;
                targetCard.style.transform = 'translate(0px, 0px) scale(1, 1)';

                await new Promise(r => setTimeout(r, 650));
                targetCard.style.transformOrigin = '';
                targetCard.style.transform = '';
                isAnimating = false;
                return;
            }

            // SCENARIO 3: Collapsing back to "All Capabilities" grid
            if (currentFilter !== 'all' && filter === 'all') {
                const activeCard = document.querySelector(`.skill-card[data-category="${currentFilter}"]`);
                const otherCards = Array.from(skillCards).filter(c => c !== activeCard);

                // Phase A: Record initial expanded position (FIRST)
                const first = activeCard ? activeCard.getBoundingClientRect() : null;

                // Phase B: Switch DOM back to 2x2 grid layout natively
                skillsGrid.className = 'grid md:grid-cols-2 gap-6';
                otherCards.forEach(c => {
                    c.classList.remove('hidden');
                    c.style.transition = 'none';
                    c.style.opacity = '0';
                    c.style.transform = 'scale(0.95)';
                });

                if (activeCard && first) {
                    // Phase C: Record target grid slot location (LAST)
                    const last = activeCard.getBoundingClientRect();

                    // Phase D: Invert transform (scale down from ~2.1 -> 1.0)
                    const deltaX = first.left - last.left;
                    const deltaY = first.top - last.top;
                    const scaleX = first.width / last.width;
                    const scaleY = first.height / last.height;

                    activeCard.style.transition = 'none';
                    activeCard.style.transformOrigin = 'top left';
                    activeCard.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${scaleX}, ${scaleY})`;
                    activeCard.getBoundingClientRect(); // Force reflow

                    // Smoothly glide and shrink to native scale(1)
                    activeCard.style.transition = `transform 650ms ${easingCurve}`;
                    activeCard.style.transform = 'translate(0px, 0px) scale(1, 1)';
                }

                // Phase E: Stagger fade-in of surrounding cards as active card lands
                setTimeout(() => {
                    otherCards.forEach(c => {
                        c.style.transition = `opacity 500ms ease, transform 500ms ${easingCurve}`;
                        c.style.opacity = '1';
                        c.style.transform = 'scale(1)';
                    });
                }, 150);

                await new Promise(r => setTimeout(r, 650));

                if (activeCard) {
                    activeCard.style.transition = '';
                    activeCard.style.transform = '';
                    activeCard.style.transformOrigin = '';
                }
                isAnimating = false;
            }
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