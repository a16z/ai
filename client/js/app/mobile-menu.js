export default function () {
  const menuBtn = document.querySelector('.hamburger-menu');
  const mainNav = document.querySelector('.main-nav');
  const menuClose = document.querySelector('.mobile-close');
  if (menuBtn) {
    menuBtn.addEventListener('click', (evt) => {
      evt.preventDefault();
      mainNav.classList.add('active');
    });
  }
  if (menuClose) {
    menuClose.addEventListener('click', (evt) => {
      evt.preventDefault();
      mainNav.classList.remove('active');
    });
  }
}
