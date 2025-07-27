// --- HEADER INTERACTIVITY CODE STARTS HERE ---
const menuToggle = document.getElementById('menuToggle');
const mainMenu = document.getElementById('mainMenu');
const hamburgerIcon = document.getElementById('hamburgerIcon');
const cancelIcon = document.getElementById('cancelIcon');
const modeIcon = document.getElementById('modeIcon');
const toggleDark = document.getElementById('toggleDark');
const modeIconMobile = document.getElementById('modeIconMobile');
const toggleDarkMobile = document.getElementById('toggleDarkMobile');
let menuOpen = false;

function openMenu() {
  mainMenu.classList.remove('max-h-0', 'opacity-0', 'pointer-events-none');
  mainMenu.classList.add('max-h-[500px]', 'opacity-100', 'pointer-events-auto');
  if (hamburgerIcon) hamburgerIcon.classList.add('hidden');
  if (cancelIcon) cancelIcon.classList.remove('hidden');
}
function closeMenuFn() {
  mainMenu.classList.add('max-h-0', 'opacity-0', 'pointer-events-none');
  mainMenu.classList.remove('max-h-[500px]', 'opacity-100', 'pointer-events-auto');
  if (hamburgerIcon) hamburgerIcon.classList.remove('hidden');
  if (cancelIcon) cancelIcon.classList.add('hidden');
}

if (menuToggle) {
  menuToggle.addEventListener('click', function() {
    menuOpen = !menuOpen;
    if (menuOpen) {
      openMenu();
    } else {
      closeMenuFn();
    }
  });
}

window.addEventListener('resize', function() {
  if (window.innerWidth >= 768) {
    mainMenu.classList.remove('max-h-0', 'opacity-0', 'pointer-events-none');
    mainMenu.classList.add('opacity-100', 'pointer-events-auto');
    if (hamburgerIcon) hamburgerIcon.classList.remove('hidden');
    if (cancelIcon) cancelIcon.classList.add('hidden');
    menuOpen = false;
  } else {
    closeMenuFn();
  }
});

// Light/Dark mode toggle for desktop
if (toggleDark) {
  toggleDark.addEventListener('click', function(e) {
    e.preventDefault();
    const isDark = document.documentElement.classList.toggle('dark');
    if (modeIcon) modeIcon.textContent = isDark ? '☀️' : '🌙';
    if (modeIconMobile) modeIconMobile.textContent = isDark ? '☀️' : '🌙';
  });
}
// Light/Dark mode toggle for mobile
if (toggleDarkMobile) {
  toggleDarkMobile.addEventListener('click', function(e) {
    e.preventDefault();
    const isDark = document.documentElement.classList.toggle('dark');
    if (modeIconMobile) modeIconMobile.textContent = isDark ? '☀️' : '🌙';
    if (modeIcon) modeIcon.textContent = isDark ? '☀️' : '🌙';
  });
}
// --- HEADER INTERACTIVITY CODE ENDS HERE ---