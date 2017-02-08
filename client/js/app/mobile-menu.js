export default function () {
  const menuBtn = document.getElementById('icon-bars');
  const sideBar = document.getElementById('sidebar');
  const menuClose = document.getElementById('close-menu');
  if (menuBtn) {
    menuBtn.addEventListener('click', (evt) => {
      evt.preventDefault();
      sideBar.classList.add('active');
    });
  }
  if (menuClose) {
    menuClose.addEventListener('click', (evt) => {
      evt.preventDefault();
      sideBar.classList.remove('active');
    });
  }
}
