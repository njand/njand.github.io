document.addEventListener('DOMContentLoaded', () => {
    // 1. Interactive HF Space Deferred Loading
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

    // 2. Email Links & Copy to Clipboard
    // The address is split across data attributes and only assembled on click, so it never
    // sits in the HTML or DOM for scrapers. Without JS, the links fall back to their LinkedIn href.
    const copyEmailBtn = document.getElementById('copy-email-btn');
    const copyEmailText = document.getElementById('copy-email-text');

    document.querySelectorAll('.email-link').forEach(link => {
        link.addEventListener('click', (event) => {
            const user = link.getAttribute('data-user');
            const domain = link.getAttribute('data-domain');
            if (user && domain) {
                event.preventDefault();
                window.location.href = `mailto:${user}@${domain}`;
            }
        });
    });

    if (copyEmailBtn && copyEmailText) {
        copyEmailBtn.addEventListener('click', () => {
            const user = copyEmailBtn.getAttribute('data-user');
            const domain = copyEmailBtn.getAttribute('data-domain');
            if (user && domain) {
                const email = `${user}@${domain}`;
                const copied = navigator.clipboard ? navigator.clipboard.writeText(email) : Promise.reject();
                copied.then(() => {
                    copyEmailText.textContent = 'Copied to Clipboard!';
                    setTimeout(() => {
                        copyEmailText.textContent = 'Copy Email Address';
                    }, 2500);
                }).catch(() => {
                    // Clipboard access can be blocked; show the address so it can be copied manually
                    copyEmailText.textContent = email;
                });
            }
        });
    }

    // 3. Analytics Event Listeners & Navigation
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

    // 4. Light/Dark Theme Toggle (initial theme is applied by the inline script in <head>)
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isDark = document.documentElement.classList.toggle('dark');
            try {
                localStorage.setItem('theme', isDark ? 'dark' : 'light');
            } catch (e) {
                // Storage can be blocked; the toggle still works for this page view
            }
        });
    }

    // 5. Mobile Navigation Menu
    const toggleBtn = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const openIcon = document.getElementById('menu-icon-open');
    const closeIcon = document.getElementById('menu-icon-close');

    if (toggleBtn && mobileMenu) {
        toggleBtn.setAttribute('aria-expanded', 'false');
        toggleBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            toggleBtn.setAttribute('aria-expanded', String(!mobileMenu.classList.contains('hidden')));
            if (openIcon) openIcon.classList.toggle('hidden');
            if (closeIcon) closeIcon.classList.toggle('hidden');
        });

        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                toggleBtn.setAttribute('aria-expanded', 'false');
                if (openIcon) openIcon.classList.remove('hidden');
                if (closeIcon) closeIcon.classList.add('hidden');
            });
        });
    }
});