document.addEventListener('DOMContentLoaded', () => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const glow = document.getElementById('cursor-glow');

    // Avoid unnecessary pointer tracking for touch and reduced-motion users.
    if (glow && window.matchMedia('(hover: hover) and (pointer: fine)').matches && !reducedMotion.matches) {
        document.addEventListener('pointermove', event => {
            glow.style.left = event.clientX + 'px';
            glow.style.top = event.clientY + 'px';
        }, { passive: true });
    }

    const sections = [...document.querySelectorAll('section[id]')];
    const navItems = [...document.querySelectorAll('.nav-item[data-section]')];

    function activateNav(id) {
        navItems.forEach(item => {
            const active = item.dataset.section === id;
            item.classList.toggle('active', active);
            if (active) item.setAttribute('aria-current', 'location');
            else item.removeAttribute('aria-current');
        });
    }

    // Preserve native anchor behaviour: deep links, browser history, and keyboard navigation.
    navItems.forEach(link => {
        link.addEventListener('click', () => activateNav(link.dataset.section));
    });

    if (location.hash) {
        const target = sections.find(section => '#' + section.id === location.hash);
        if (target) activateNav(target.id);
    }

    window.addEventListener('hashchange', () => {
        const id = decodeURIComponent(location.hash.slice(1));
        if (sections.some(section => section.id === id)) activateNav(id);
    });

    if ('IntersectionObserver' in window) {
        const scrollObserver = new IntersectionObserver(entries => {
            for (const entry of entries) {
                if (entry.isIntersecting) activateNav(entry.target.id);
            }
        }, { rootMargin: '-40% 0px -40% 0px', threshold: 0 });
        sections.forEach(section => scrollObserver.observe(section));
    }

    const fadeItems = document.querySelectorAll('.timeline-entry, .project-card, .cert-item, .skill-row');
    if (!reducedMotion.matches && 'IntersectionObserver' in window) {
        const fadeObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08 });

        fadeItems.forEach(element => {
            element.classList.add('reveal');
            fadeObserver.observe(element);
        });
    }
});
