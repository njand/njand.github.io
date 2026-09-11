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

    // 3. Skills Matrix Category Filter with Phased FLIP Animation
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

            // Update button active state UI
            filterButtons.forEach(b => {
                b.classList.remove('bg-sky-500', 'text-slate-950', 'shadow-md', 'shadow-sky-500/20', 'active-tab');
                b.classList.add('bg-slate-900', 'text-slate-300');
            });
            btn.classList.add('bg-sky-500', 'text-slate-950', 'shadow-md', 'shadow-sky-500/20', 'active-tab');
            btn.classList.remove('bg-slate-900', 'text-slate-300');

            // SCENARIO 1: Switching between two single categories
            if (currentFilter !== 'all' && filter !== 'all') {
                const currentCard = document.querySelector(`.skill-card[data-category="${currentFilter}"]`);
                const targetCard = document.querySelector(`.skill-card[data-category="${filter}"]`);

                if (currentCard) {
                    currentCard.style.transition = 'opacity 200ms ease, transform 200ms ease';
                    currentCard.style.opacity = '0';
                    currentCard.style.transform = 'scale(0.96)';
                    await new Promise(r => setTimeout(r, 200));
                    currentCard.classList.add('hidden');
                }

                if (targetCard) {
                    targetCard.classList.remove('hidden');
                    targetCard.style.transition = 'none';
                    targetCard.style.opacity = '0';
                    targetCard.style.transform = 'scale(0.96)';
                    targetCard.getBoundingClientRect(); // Force reflow

                    targetCard.style.transition = 'opacity 250ms ease, transform 250ms ease';
                    targetCard.style.opacity = '1';
                    targetCard.style.transform = 'scale(1)';
                    await new Promise(r => setTimeout(r, 250));
                }
                isAnimating = false;
                return;
            }

            // SCENARIO 2: Expanding from "All Capabilities" to a Single Filter
            if (currentFilter === 'all' && filter !== 'all') {
                const targetCard = document.querySelector(`.skill-card[data-category="${filter}"]`);
                const otherCards = Array.from(skillCards).filter(c => c !== targetCard);

                // Phase A: Fade out non-selected cards
                otherCards.forEach(c => {
                    c.style.transition = 'opacity 200ms ease, transform 200ms ease';
                    c.style.opacity = '0';
                    c.style.transform = 'scale(0.95)';
                });
                await new Promise(r => setTimeout(r, 200));

                // Phase B: Record initial position (FIRST)
                const first = targetCard.getBoundingClientRect();

                // Phase C: Hide unselected cards & adjust grid container
                otherCards.forEach(c => c.classList.add('hidden'));
                skillsGrid.className = 'flex flex-col gap-6 max-w-2xl mx-auto w-full';

                // Phase D: Record final position (LAST)
                const last = targetCard.getBoundingClientRect();

                // Phase E: Invert & Play FLIP transition
                const deltaX = first.left - last.left;
                const deltaY = first.top - last.top;
                const scaleX = first.width / last.width;
                const scaleY = first.height / last.height;

                targetCard.style.transition = 'none';
                targetCard.style.transformOrigin = 'top left';
                targetCard.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${scaleX}, ${scaleY})`;
                targetCard.getBoundingClientRect(); // Force reflow

                targetCard.style.transition = 'transform 350ms cubic-bezier(0.16, 1, 0.3, 1)';
                targetCard.style.transform = 'none';

                await new Promise(r => setTimeout(r, 350));
                targetCard.style.transformOrigin = '';
                isAnimating = false;
                return;
            }

            // SCENARIO 3: Returning from Single Filter back to "All Capabilities"
            if (currentFilter !== 'all' && filter === 'all') {
                const activeCard = document.querySelector(`.skill-card[data-category="${currentFilter}"]`);
                const otherCards = Array.from(skillCards).filter(c => c !== activeCard);

                // Phase A: Record initial position (FIRST)
                const first = activeCard ? activeCard.getBoundingClientRect() : null;

                // Phase B: Restore grid layout & unhide inactive cards with opacity 0
                skillsGrid.className = 'grid md:grid-cols-2 gap-6';
                otherCards.forEach(c => {
                    c.classList.remove('hidden');
                    c.style.transition = 'none';
                    c.style.opacity = '0';
                    c.style.transform = 'scale(0.95)';
                });

                // Phase C: Record final target position (LAST)
                const last = activeCard ? activeCard.getBoundingClientRect() : null;

                if (activeCard && first && last) {
                    const deltaX = first.left - last.left;
                    const deltaY = first.top - last.top;
                    const scaleX = first.width / last.width;
                    const scaleY = first.height / last.height;

                    activeCard.style.transition = 'none';
                    activeCard.style.transformOrigin = 'top left';
                    activeCard.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${scaleX}, ${scaleY})`;
                    activeCard.getBoundingClientRect(); // Force reflow

                    activeCard.style.transition = 'transform 350ms cubic-bezier(0.16, 1, 0.3, 1)';
                    activeCard.style.transform = 'none';
                }

                // Phase D: Fade other cards back in smoothly
                setTimeout(() => {
                    otherCards.forEach(c => {
                        c.style.transition = 'opacity 300ms ease 100ms, transform 300ms ease 100ms';
                        c.style.opacity = '1';
                        c.style.transform = 'scale(1)';
                    });
                }, 50);

                await new Promise(r => setTimeout(r, 380));
                if (activeCard) activeCard.style.transformOrigin = '';
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