/* ============================================
   DIAGRAMS — Mermaid init + custom triggers
   ============================================ */

export function initDiagrams() {
  // Initialize Mermaid with dark theme
  if (window.mermaid) {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'dark',
      themeVariables: {
        darkMode: true,
        background: '#1a2040',
        primaryColor: '#1a2040',
        primaryTextColor: '#e8eaf0',
        primaryBorderColor: '#00d4ff',
        lineColor: '#00d4ff',
        secondaryColor: '#0f1528',
        tertiaryColor: '#222a50',
        edgeLabelBackground: '#1a2040',
        clusterBkg: '#0f1528',
        clusterBorder: '#00d4ff',
        titleColor: '#e8eaf0',
        nodeTextColor: '#e8eaf0',
        actorTextColor: '#e8eaf0',
        actorLineColor: '#00d4ff',
        signalColor: '#e8eaf0',
        signalTextColor: '#e8eaf0',
        noteBkgColor: '#1a2040',
        noteTextColor: '#e8eaf0',
        noteBorderColor: '#00d4ff',
        fontFamily: 'Inter, sans-serif',
        fontSize: '14px',
      },
      flowchart: {
        curve: 'basis',
        padding: 15,
        htmlLabels: true,
      },
      sequence: {
        mirrorActors: false,
      },
    });

    // Render all mermaid blocks
    renderMermaid();
  }
}

async function renderMermaid() {
  const blocks = document.querySelectorAll('.mermaid');
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const id = `mermaid-${i}`;
    try {
      const { svg } = await mermaid.render(id, block.textContent.trim());
      block.innerHTML = svg;
    } catch (err) {
      console.warn(`Mermaid render error for block ${i}:`, err);
      block.innerHTML = `<pre style="color: var(--accent-red); font-size: 0.75rem;">${block.textContent}</pre>`;
    }
  }
}
