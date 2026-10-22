// Progressive enhancement: readable content and install prompt work without JS.
const copyButton = document.querySelector('.copy-prompt');
const installPrompt = document.querySelector('#install-prompt');
const copyStatus = document.querySelector('.copy-status');
if (copyButton && installPrompt && copyStatus) {
  copyButton.hidden = false;
  copyButton.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(installPrompt.value.trim());
      copyButton.classList.add('is-copied');
      copyButton.querySelector('.copy-label').textContent = 'Copied';
      copyStatus.textContent = 'Paste it into Codex or Claude Code to get started.';
    } catch {
      copyButton.classList.remove('is-copied');
      copyButton.querySelector('.copy-label').textContent = 'Copy';
      installPrompt.closest('details').open = true;
      installPrompt.focus();
      installPrompt.select();
      copyStatus.textContent = 'Automatic copy is unavailable. Copy the selected prompt below.';
    }
  });
}
const sections = [...document.querySelectorAll('main section[id]')];
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      document.querySelectorAll('nav a').forEach(link => {
        const active = link.getAttribute('href') === `#${entry.target.id}`;
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }
  }, { rootMargin: '-20% 0px -60% 0px' });
  sections.forEach(section => observer.observe(section));
}

// One-shot editorial entrances. Content stays visible without JS or with reduced motion.
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
// Reveal meaningful groups rather than animating every letter or tiny icon.
const entranceGroups = [
  '.navigation > *', '.hero-art', '.hero-copy > *', '.scroll-cue',
  '.intro > .eyebrow', '.intro-grid > *', '.product-definition > *',
  '.workflow .section-heading > *', '.steps > li', '.workspace-shot',
  '.director .eyebrow', '.director h2', '.director-shot', '.director-copy',
  '.brand > *', '.details-heading > *', '.details > article',
  '.get-started > *', '.faq > h2', '.faq-items > details', 'footer > *',
];
document.querySelectorAll(entranceGroups.join(',')).forEach(element => {
  if (!element.hasAttribute('data-reveal')) element.dataset.reveal = '';
});
if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('[data-reveal]').forEach((element, index) => {
    element.style.setProperty('--reveal-delay', `${index % 2 * 100}ms`);
    revealObserver.observe(element);
  });
  document.documentElement.classList.add('reveal-ready');
  // Keyboard navigation and preference changes must never leave content hidden.
  document.addEventListener('focusin', event => {
    event.target.closest('[data-reveal]')?.classList.add('is-visible');
  });
  reducedMotion.addEventListener('change', event => {
    if (!event.matches) return;
    document.documentElement.classList.remove('reveal-ready');
    revealObserver.disconnect();
  });
}
