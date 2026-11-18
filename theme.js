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
