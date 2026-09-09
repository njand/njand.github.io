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

    document.querySelectorAll('section, .project-card').forEach(el => {
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

    // 3. Skills Matrix Category Filter
    const filterButtons = document.querySelectorAll('#skills-filter button');
    const skillCards = document.querySelectorAll('.skill-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => {
                b.classList.remove('bg-sky-500', 'text-slate-900');
                b.classList.add('bg-slate-800', 'text-slate-300');
            });
            btn.classList.add('bg-sky-500', 'text-slate-900');
            btn.classList.remove('bg-slate-800', 'text-slate-300');

            const filter = btn.getAttribute('data-filter');
            skillCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // 4. Interactive HF Space Lazy Loading Wrapper Button
    const loadHfBtn = document.querySelector('#load-hf-space-btn');
    const hfPlaceholder = document.querySelector('#hf-placeholder');
    const hfIframe = document.querySelector('#hf-space-iframe');

    if (loadHfBtn && hfIframe) {
        loadHfBtn.addEventListener('click', () => {
            hfIframe.src = "https://hf.space/embed/njand/latin-asr-demo/+/";
            hfPlaceholder.classList.add('hidden');
            hfIframe.classList.remove('hidden');

            if (typeof plausible === 'function') {
                plausible('Interactive Demo Loaded');
            }
        });
    }

    // 5. Analytics Custom Event Listeners
    const downloadBtn = document.querySelector('#download-cv-btn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            if (typeof plausible === 'function') {
                plausible('CV Download', { props: { source: 'Header / Hero' } });
            }
        });
    }

    document.querySelectorAll('.outbound-github').forEach(link => {
        link.addEventListener('click', function() {
            if (typeof plausible === 'function') {
                plausible('GitHub Outbound Click', { props: { repo: this.href } });
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
            openIcon.classList.toggle('hidden');
            closeIcon.classList.toggle('hidden');
        });

        // Close menu when clicking links
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                openIcon.classList.remove('hidden');
                closeIcon.classList.add('hidden');
            });
        });
    }
});
