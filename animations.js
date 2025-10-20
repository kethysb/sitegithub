document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    // Custom cursor
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');

    document.addEventListener('mousemove', e => {
        gsap.to(cursor, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.1
        });
        gsap.to(cursorFollower, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.3
        });
    });

    // Initialize animations
    initLoader();
    initPageAnimations();
});

function initLoader() {
    const loader = document.querySelector('.loader');
    const loaderBar = document.querySelector('.loader-bar');
    const loaderText = document.querySelector('.loader-text');
    
    gsap.to(loaderBar, {
        width: '100%',
        duration: 2,
        ease: 'power2.inOut',
        onUpdate: () => {
            const progress = Math.round(loaderBar.offsetWidth / loaderBar.parentElement.offsetWidth * 100);
            loaderText.textContent = `${progress}%`;
        },
        onComplete: () => {
            gsap.to(loader, {
                opacity: 0,
                duration: 0.5,
                onComplete: () => {
                    loader.style.display = 'none';
                }
            });
        }
    });
}

function initPageAnimations() {
    // Hero animations
    gsap.from('.hero-content h1', {
        y: 100,
        opacity: 0,
        duration: 1.5,
        ease: 'power4.out'
    });

    gsap.from('.hero-content p', {
        y: 50,
        opacity: 0,
        duration: 1.5,
        delay: 0.3,
        ease: 'power4.out'
    });

    // Scroll animations
    gsap.utils.toArray('.reveal-on-scroll').forEach(element => {
        gsap.from(element, {
            scrollTrigger: {
                trigger: element,
                start: 'top 80%',
                end: 'bottom 20%',
                scrub: 1
            },
            y: 100,
            opacity: 0,
            duration: 1
        });
    });

    // Project cards animation
    gsap.utils.toArray('.project-card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top bottom',
                end: 'top center',
                scrub: 1
            },
            y: 100,
            opacity: 0,
            rotation: 5,
            delay: i * 0.1
        });
    });

    // Stats counter
    gsap.utils.toArray('.stat-number').forEach(stat => {
        const value = parseInt(stat.dataset.value);
        ScrollTrigger.create({
            trigger: stat,
            start: 'top 80%',
            onEnter: () => {
                gsap.to(stat, {
                    innerHTML: value,
                    duration: 2,
                    snap: { innerHTML: 1 }
                });
            }
        });
    });

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                gsap.to(window, {
                    duration: 1,
                    scrollTo: target,
                    ease: 'power4.inOut'
                });
            }
        });
    });
}