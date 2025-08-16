import footer_content from "./include/footer.js";
import nav_content from "./include/header.js";

window.addEventListener('load', () => {
  const main_header = document.getElementById("main-header");
  const main_footer = document.getElementById("main-footer");

  // adding the nav
  main_header.innerHTML = nav_content;
  // adding the footer
  main_footer.innerHTML = footer_content;
})

