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
  viewer.innerHTML = '<div class="image-viewer-header"><span>Case study image</span><button type="button" class="image-viewer-close" aria-label="Close image">Close</button></div><div class="image-viewer-content"></div><p class="image-viewer-hint">Scroll to see the full image</p>';
  document.body.appendChild(viewer);
  const content = viewer.querySelector('.image-viewer-content');
  const closeButton = viewer.querySelector('.image-viewer-close');
  let opener;

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
    viewer.showModal();
    closeButton.focus();
  }));
  closeButton.addEventListener('click', () => viewer.close());
  viewer.addEventListener('click', event => {
    if (event.target === viewer) viewer.close();
  });
  viewer.addEventListener('close', () => {
    content.replaceChildren();
    if (opener) opener.focus();
  });
}
