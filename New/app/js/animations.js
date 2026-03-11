/* ============================================
   ANIMATIONS — GSAP ScrollTrigger registrations
   ============================================ */

export class Animations {
  constructor(container) {
    this.container = container;

    // Check for reduced motion preference
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (this.reducedMotion) {
      this._showAll();
      return;
    }

    this._registerAnimations();
  }

  _showAll() {
    document.querySelectorAll('.anim').forEach(el => {
      el.style.visibility = 'visible';
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
  }

  _registerAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    // Process each section
    const sections = this.container.querySelectorAll('.slide-section');
    sections.forEach(section => {
      // Create a timeline for each section
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          scroller: this.container,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none none', // only play once on enter
        }
      });

      // ── Fade Up ──
      const fadeUps = section.querySelectorAll('.anim-fade-up');
      if (fadeUps.length) {
        tl.from(fadeUps, {
          y: 60,
          opacity: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power3.out',
          onStart: () => fadeUps.forEach(el => el.style.visibility = 'visible'),
        }, 0);
      }

      // ── Fade In ──
      const fadeIns = section.querySelectorAll('.anim-fade-in');
      if (fadeIns.length) {
        tl.from(fadeIns, {
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power2.out',
          onStart: () => fadeIns.forEach(el => el.style.visibility = 'visible'),
        }, 0.1);
      }

      // ── Fly In Left ──
      const flyLefts = section.querySelectorAll('.anim-fly-left');
      if (flyLefts.length) {
        tl.from(flyLefts, {
          x: -100,
          opacity: 0,
          duration: 0.9,
          stagger: 0.15,
          ease: 'power3.out',
          onStart: () => flyLefts.forEach(el => el.style.visibility = 'visible'),
        }, 0.1);
      }

      // ── Fly In Right ──
      const flyRights = section.querySelectorAll('.anim-fly-right');
      if (flyRights.length) {
        tl.from(flyRights, {
          x: 100,
          opacity: 0,
          duration: 0.9,
          stagger: 0.15,
          ease: 'power3.out',
          onStart: () => flyRights.forEach(el => el.style.visibility = 'visible'),
        }, 0.1);
      }

      // ── Scale In ──
      const scaleIns = section.querySelectorAll('.anim-scale-in');
      if (scaleIns.length) {
        tl.from(scaleIns, {
          scale: 0.8,
          opacity: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: 'back.out(1.4)',
          onStart: () => scaleIns.forEach(el => el.style.visibility = 'visible'),
        }, 0.2);
      }

      // ── Blur In ──
      const blurIns = section.querySelectorAll('.anim-blur-in');
      if (blurIns.length) {
        tl.from(blurIns, {
          filter: 'blur(15px)',
          opacity: 0,
          duration: 1,
          stagger: 0.15,
          ease: 'power2.out',
          onStart: () => blurIns.forEach(el => el.style.visibility = 'visible'),
        }, 0);
      }

      // ── Stagger Children ──
      const staggerGroups = section.querySelectorAll('.anim-stagger');
      staggerGroups.forEach(group => {
        const children = group.children;
        if (children.length) {
          tl.from(children, {
            y: 30,
            opacity: 0,
            duration: 0.5,
            stagger: 0.08,
            ease: 'power2.out',
            onStart: () => {
              group.style.visibility = 'visible';
              Array.from(children).forEach(c => c.style.visibility = 'visible');
            },
          }, 0.3);
        }
      });

      // ── Counter Up ──
      const counters = section.querySelectorAll('.anim-counter');
      counters.forEach(counter => {
        const target = parseFloat(counter.dataset.target) || 0;
        const suffix = counter.dataset.suffix || '';
        const prefix = counter.dataset.prefix || '';
        const decimals = counter.dataset.decimals ? parseInt(counter.dataset.decimals) : 0;

        ScrollTrigger.create({
          trigger: counter,
          scroller: this.container,
          start: 'top 80%',
          once: true,
          onEnter: () => {
            counter.style.visibility = 'visible';
            gsap.to(counter, {
              innerText: target,
              duration: 2,
              ease: 'power1.out',
              snap: { innerText: decimals ? (1 / Math.pow(10, decimals)) : 1 },
              onUpdate: function () {
                const val = decimals
                  ? parseFloat(counter.innerText).toFixed(decimals)
                  : Math.round(parseFloat(counter.innerText));
                counter.innerText = `${prefix}${val}${suffix}`;
              },
            });
          }
        });
      });

      // ── Typewriter ──
      const typewriters = section.querySelectorAll('.anim-typewriter');
      typewriters.forEach(tw => {
        const text = tw.textContent;
        tw.textContent = '';
        tw.style.visibility = 'visible';

        ScrollTrigger.create({
          trigger: tw,
          scroller: this.container,
          start: 'top 80%',
          once: true,
          onEnter: () => {
            let i = 0;
            const interval = setInterval(() => {
              tw.textContent = text.slice(0, ++i);
              if (i >= text.length) clearInterval(interval);
            }, 30);
          }
        });
      });
    });

    // ── Parallax backgrounds ──
    const parallaxElements = this.container.querySelectorAll('.parallax-bg');
    parallaxElements.forEach(el => {
      gsap.to(el, {
        y: -80,
        ease: 'none',
        scrollTrigger: {
          trigger: el.closest('.slide-section'),
          scroller: this.container,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.5,
        }
      });
    });
  }
}
