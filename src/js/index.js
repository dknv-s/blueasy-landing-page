const menu = document.querySelector(".js-nav-list");
const btn = document.querySelector(".js-nav-menu-btn");

btn.addEventListener('click', (e) => {
  e.preventDefault();
  menu.classList.toggle("nav-list--open");
});
