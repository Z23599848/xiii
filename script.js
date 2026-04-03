document.addEventListener('DOMContentLoaded', () => {

    // ---- Scroll Reveal ----
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // Stagger children in grids
    document.querySelectorAll('.projects-grid, .skills-grid, .certs-grid, .about-stats').forEach(grid => {
        Array.from(grid.children).forEach((child, i) => {
            child.style.transitionDelay = `${i * 80}ms`;
            child.classList.add('reveal');
            observer.observe(child);
        });
    });

    // ---- Nav scroll effect ----
    const nav = document.getElementById('main-nav');
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });

    // ---- Smooth scroll ----
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ---- Parallax glow on mouse move ----
    const bgGlow = document.querySelector('.bg-glow');
    let rafId;
    document.addEventListener('mousemove', e => {
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
            const mx = (e.clientX / window.innerWidth - 0.5) * 40;
            const my = (e.clientY / window.innerHeight - 0.5) * 40;
            bgGlow.style.transform = `translate(${mx}px, ${my}px)`;
        });
    }, { passive: true });

    // ---- Tilt effect on project cards ----
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            card.style.transform = `translateY(-4px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // ---- Animate stat numbers ----
    const animateNum = (el) => {
        const target = parseFloat(el.dataset.target);
        const isFloat = el.dataset.target.includes('.');
        const duration = 1200;
        const start = performance.now();
        const update = (now) => {
            const elapsed = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - elapsed, 3);
            el.textContent = isFloat
                ? (eased * target).toFixed(1)
                : Math.round(eased * target);
            if (elapsed < 1) requestAnimationFrame(update);
        };
        requestAnimationFrame(update);
    };

    const numObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateNum(entry.target);
                numObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-num[data-target]').forEach(el => numObserver.observe(el));
});
