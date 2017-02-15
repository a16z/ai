export default function () {
  const menuBtn = document.getElementById('icon-bars');
  const sideBar = document.getElementById('sidebar');
  const menuClose = document.getElementById('close-menu');
  const body = document.body;
  if (menuBtn) {
    menuBtn.addEventListener('click', (evt) => {
      evt.preventDefault();
      sideBar.classList.add('active');
      body.classList.add('menu-open');
    });
  }
  if (menuClose) {
    menuClose.addEventListener('click', (evt) => {
      evt.preventDefault();
      sideBar.classList.remove('active');
      body.classList.remove('menu-open');
    });
  }
}
