/* ============================================
   MAIN — Entry point
   ============================================ */

import { Navigation } from './navigation.js';
import { Animations } from './animations.js';
import { initDiagrams } from './diagrams.js';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('presentation');
  if (!container) return;

  // Initialize navigation
  window.nav = new Navigation(container);

  // Initialize GSAP animations
  window.anims = new Animations(container);

  // Initialize Mermaid diagrams
  initDiagrams();

  // Expose goTo for debugging
  window.goTo = (i) => window.nav.goTo(i);
});
