/**
 * RBP App - Base JavaScript
 * Remote Business Partner custom application shell scripts.
 * Keep minimal - structural/shell behavior only.
 */

(function () {
    "use strict";

    // Highlight active nav item based on current path
    function setActiveNav() {
        var path = window.location.pathname;
        var navLinks = document.querySelectorAll(".rbp-nav a, .rbp-portal-nav a");
        navLinks.forEach(function (link) {
            var href = link.getAttribute("href");
            if (href === path || (href !== "/" && path.startsWith(href))) {
                link.classList.add("active");
            }
        });
    }

    // Run on DOM ready
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", setActiveNav);
    } else {
        setActiveNav();
    }
})();
