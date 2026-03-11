/* ============================================
   NAVIGATION — Keyboard, Dot Nav, Scroll Sync
   ============================================ */

export class Navigation {
  constructor(container) {
    this.container = container;
    this.sections = Array.from(container.querySelectorAll('.slide-section'));
    this.currentIndex = 0;
    this.isAnimating = false;
    this.lockDuration = 700; // ms debounce

    this.dotNav = null;
    this.slideCounter = null;

    this._buildDotNav();
    this._buildSlideCounter();
    this._buildKeyboardHint();
    this._bindEvents();
    this._syncNav();
  }

  /* ── Build dot navigation ── */
  _buildDotNav() {
    this.dotNav = document.createElement('nav');
    this.dotNav.className = 'dot-nav';
    this.dotNav.setAttribute('aria-label', 'Slide navigation');

    this.sections.forEach((section, i) => {
      const dot = document.createElement('button');
      dot.className = 'dot-nav__dot';
      dot.setAttribute('data-index', i);
      dot.setAttribute('data-title', section.dataset.title || `Slide ${i}`);
      dot.setAttribute('aria-label', `Go to ${section.dataset.title || `slide ${i + 1}`}`);
      dot.addEventListener('click', () => this.goTo(i));
      this.dotNav.appendChild(dot);
    });

    document.body.appendChild(this.dotNav);
  }

  /* ── Build slide counter ── */
  _buildSlideCounter() {
    this.slideCounter = document.createElement('div');
    this.slideCounter.className = 'slide-counter';
    document.body.appendChild(this.slideCounter);
  }

  /* ── Keyboard hint ── */
  _buildKeyboardHint() {
    this.keyHint = document.createElement('div');
    this.keyHint.className = 'keyboard-hint';
    this.keyHint.innerHTML = `
      <div class="keyboard-hint__key">▲</div>
      <div class="keyboard-hint__key">▼</div>
    `;
    document.body.appendChild(this.keyHint);

    // Hide after first interaction
    setTimeout(() => this.keyHint.classList.add('hidden'), 8000);
  }

  /* ── Bind all events ── */
  _bindEvents() {
    // Keyboard
    document.addEventListener('keydown', (e) => this._onKeydown(e));

    // Mouse wheel
    this.container.addEventListener('wheel', (e) => this._onWheel(e), { passive: false });

    // Touch (swipe)
    let touchStartY = 0;
    this.container.addEventListener('touchstart', (e) => {
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    this.container.addEventListener('touchend', (e) => {
      const diff = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(diff) > 50) {
        diff > 0 ? this.next() : this.prev();
      }
    }, { passive: true });

    // Scroll-based sync (IntersectionObserver)
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
          const idx = this.sections.indexOf(entry.target);
          if (idx !== -1 && idx !== this.currentIndex) {
            this.currentIndex = idx;
            this._syncNav();
          }
        }
      });
    }, {
      root: this.container,
      threshold: 0.5
    });

    this.sections.forEach(s => observer.observe(s));
  }

  _onKeydown(e) {
    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowRight':
      case 'PageDown':
      case ' ':
        e.preventDefault();
        this.next();
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
      case 'PageUp':
        e.preventDefault();
        this.prev();
        break;
      case 'Home':
        e.preventDefault();
        this.goTo(0);
        break;
      case 'End':
        e.preventDefault();
        this.goTo(this.sections.length - 1);
        break;
    }
    // Hide hint on first keypress
    this.keyHint?.classList.add('hidden');
  }

  _onWheel(e) {
    e.preventDefault();
    if (this.isAnimating) return;
    if (e.deltaY > 30) this.next();
    else if (e.deltaY < -30) this.prev();
  }

  /* ── Navigation methods ── */
  next() {
    if (this.currentIndex < this.sections.length - 1) {
      this.goTo(this.currentIndex + 1);
    }
  }

  prev() {
    if (this.currentIndex > 0) {
      this.goTo(this.currentIndex - 1);
    }
  }

  goTo(index) {
    if (this.isAnimating || index === this.currentIndex) return;
    if (index < 0 || index >= this.sections.length) return;

    this.isAnimating = true;
    this.currentIndex = index;

    const target = this.sections[index];

    // Use GSAP for smooth scroll if available
    if (window.gsap && window.ScrollToPlugin) {
      gsap.to(this.container, {
        scrollTo: { y: target, autoKill: false },
        duration: 0.8,
        ease: 'power2.inOut',
        onComplete: () => {
          this.isAnimating = false;
        }
      });
    } else {
      target.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => { this.isAnimating = false; }, this.lockDuration);
    }

    this._syncNav();
  }

  /* ── Sync UI ── */
  _syncNav() {
    // Dots
    const dots = this.dotNav?.querySelectorAll('.dot-nav__dot');
    dots?.forEach((dot, i) => {
      dot.classList.toggle('active', i === this.currentIndex);
    });

    // Counter
    if (this.slideCounter) {
      this.slideCounter.textContent = `${this.currentIndex + 1} / ${this.sections.length}`;
    }
  }
}
