export default function () {
  const menuBtn = document.getElementById('icon-bars');
  const sideBar = document.getElementById('sidebar');
  if (menuBtn) {
    menuBtn.addEventListener('click', (evt) => {
      evt.preventDefault();
      sideBar.classList.add('active');
    });
  }
}
