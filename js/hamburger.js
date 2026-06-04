
(function () {
  document.addEventListener("DOMContentLoaded", function () {
    const hamburger  = document.getElementById("hamburger-btn");
    const mobileMenu = document.getElementById("mobile-menu");

    if (!hamburger || !mobileMenu) return;

    hamburger.addEventListener("click", function () {
      const isOpen = mobileMenu.classList.contains("open");
      mobileMenu.classList.toggle("open");
      hamburger.classList.toggle("open");
      hamburger.setAttribute("aria-expanded", String(!isOpen));
      mobileMenu.setAttribute("aria-hidden", String(isOpen));
    });

    // Close menu when any mobile nav link is clicked
    mobileMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mobileMenu.classList.remove("open");
        hamburger.classList.remove("open");
        hamburger.setAttribute("aria-expanded", "false");
        mobileMenu.setAttribute("aria-hidden", "true");
      });
    });
  });
})();
