document.addEventListener('DOMContentLoaded', () => {

    // ---- Cursor glow follows mouse ----
    const glow = document.getElementById('cursor-glow');
    document.addEventListener('mousemove', e => {
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
    }, { passive: true });

    // ---- Active nav section highlight on scroll ----
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-item[data-section]');

    const activateNav = (id) => {
        navItems.forEach(item => {
            item.classList.toggle('active', item.dataset.section === id);
        });
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                activateNav(entry.target.id);
            }
        });
    }, {
        rootMargin: '-40% 0px -40% 0px',
        threshold: 0
    });

    sections.forEach(s => scrollObserver.observe(s));

    // ---- Smooth scroll for nav links ----
    document.querySelectorAll('.nav-item').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ---- Subtle entry fade-in on scroll ----
    const fadeItems = document.querySelectorAll('.timeline-entry, .project-card, .cert-item, .skill-row');
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                fadeObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08 });

    fadeItems.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(12px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        fadeObserver.observe(el);
    });

});
