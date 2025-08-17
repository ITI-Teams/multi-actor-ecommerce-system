import footer_content from "./include/footer.js";
import nav_content from "./include/header.js";

const main_header = document.getElementById("main-header");
const main_footer = document.getElementById("main-footer");
main_header.innerHTML = nav_content;
main_footer.innerHTML = footer_content;
