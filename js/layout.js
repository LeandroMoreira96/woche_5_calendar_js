/* =========================================================
   LAYOUT.JS – Layout-Steuerung und Sidebar-Toggle
   Eigenes Modul für alles was mit dem Seitenlayout zu tun hat.
   ========================================================= */


/* =========================================================
   1) SIDEBAR EIN- ODER AUSBLENDEN
   ========================================================= */

// Standard: Sidebar ist versteckt, Kalender und Info-Box
// stehen nebeneinander (horizontales Layout).
// Wenn die Sidebar eingeblendet wird, wechselt das Layout
// auf vertikal (Kalender oben, Info unten) und der Content
// wird schmaler damit die Sidebar Platz hat.
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
