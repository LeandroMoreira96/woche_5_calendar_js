/* Layout + Sidebar */

/* SIDEBAR EIN-/AUSBLENDEN */
function toggleSidebar() {
  var sidebarElement = document.querySelector(".sidebar");
  var contentElement = document.querySelector(".content");
  var toggleButton = document.getElementById("sidebar-toggle-button");

  if (!sidebarElement || !contentElement) return;

  var isHidden = sidebarElement.classList.contains("sidebar--hidden");

  if (isHidden) {
    sidebarElement.classList.remove("sidebar--hidden");
    contentElement.classList.add("content--with-sidebar");
    if (toggleButton) toggleButton.classList.add("sidebar-toggle--active");
  } else {
    sidebarElement.classList.add("sidebar--hidden");
    contentElement.classList.remove("content--with-sidebar");
    if (toggleButton) toggleButton.classList.remove("sidebar-toggle--active");
  }
}
