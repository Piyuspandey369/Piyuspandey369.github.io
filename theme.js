const buttons = document.querySelectorAll('.theme-toggle');
let dark = true;
try { dark = localStorage.getItem('theme') !== 'light'; } catch (error) { /* Use the default theme. */ }
function applyTheme() {
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  buttons.forEach(button => {
    button.textContent = dark ? '☀' : '☾';
    button.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
    button.setAttribute('aria-pressed', String(dark));
  });
}
buttons.forEach(button => button.addEventListener('click', () => {
  dark = !dark;
  try { localStorage.setItem('theme', dark ? 'dark' : 'light'); } catch (error) { /* Keep the current page usable. */ }
  applyTheme();
}));
applyTheme();

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#primary-nav');
if (menuButton && navigation) {
  menuButton.addEventListener('click', () => {
    const expanded = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!expanded));
    menuButton.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
    navigation.classList.toggle('is-open', !expanded);
  });
  navigation.addEventListener('click', event => {
    if (event.target.closest('a')) {
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Open navigation');
      navigation.classList.remove('is-open');
    }
  });
}


const evidenceLinks = document.querySelectorAll('.case-page a[href^="case-study-evidence/"]');
if (evidenceLinks.length && typeof HTMLDialogElement !== 'undefined') {
  const viewer = document.createElement('dialog');
  viewer.className = 'image-viewer';
  viewer.setAttribute('aria-label', 'Enlarged case study image');
  viewer.innerHTML = '<div class="image-viewer-header"><span>Case study image</span><div class="image-viewer-actions"><button type="button" class="image-viewer-zoom" aria-pressed="false">Zoom in</button><button type="button" class="image-viewer-close" aria-label="Close image">Close</button></div></div><div class="image-viewer-content" tabindex="0" aria-label="Case study image, scroll when zoomed"></div><p class="image-viewer-hint" aria-live="polite">Zoom in to read details</p>';
  document.body.appendChild(viewer);
  const content = viewer.querySelector('.image-viewer-content');
  const closeButton = viewer.querySelector('.image-viewer-close');
  const zoomButton = viewer.querySelector('.image-viewer-zoom');
  const hint = viewer.querySelector('.image-viewer-hint');
  let opener;

  function resetZoom() {
    content.classList.remove('is-zoomed');
    content.scrollLeft = 0;
    content.scrollTop = 0;
    zoomButton.textContent = 'Zoom in';
    zoomButton.setAttribute('aria-pressed', 'false');
    hint.textContent = 'Zoom in to read details';
  }

  evidenceLinks.forEach(link => link.addEventListener('click', event => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const image = link.querySelector('img');
    if (!image) return;
    event.preventDefault();
    opener = link;
    const frame = link.querySelector('.result-frame');
    const enlarged = (frame || image).cloneNode(true);
    const enlargedImage = enlarged.matches('img') ? enlarged : enlarged.querySelector('img');
    enlargedImage.loading = 'eager';
    content.replaceChildren(enlarged);
    resetZoom();
    viewer.showModal();
    closeButton.focus();
  }));
  zoomButton.addEventListener('click', () => {
    if (content.classList.contains('is-zoomed')) {
      resetZoom();
      return;
    }
    content.classList.add('is-zoomed');
    zoomButton.textContent = 'Fit image';
    zoomButton.setAttribute('aria-pressed', 'true');
    hint.textContent = 'Swipe or scroll to explore the image';
    const highlight = content.querySelector('.result-highlight');
    if (highlight) {
      const contentRect = content.getBoundingClientRect();
      const highlightRect = highlight.getBoundingClientRect();
      content.scrollLeft += highlightRect.left + highlightRect.width / 2 - contentRect.left - contentRect.width / 2;
      content.scrollTop += highlightRect.top + highlightRect.height / 2 - contentRect.top - contentRect.height / 2;
    }
  });
  closeButton.addEventListener('click', () => viewer.close());
  viewer.addEventListener('click', event => {
    if (event.target === viewer) viewer.close();
  });
  viewer.addEventListener('close', () => {
    content.replaceChildren();
    if (opener) opener.focus();
  });
}
