(function() {
  var menu = document.querySelector(".js-nav-list");
  var btn = document.querySelector(".js-nav-menu-btn");

  btn.addEventListener("click", function(e) {
    e.preventDefault();
    menu.classList.toggle("nav-list--open");
  });
})();