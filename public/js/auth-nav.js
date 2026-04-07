/**
 * auth-nav.js — Checks session via API and updates the header-btn area
 * to show the logged-in user's name (far-right of every navbar).
 */
(function () {
    fetch('backend/auth_status.php')
        .then(function (r) { return r.json(); })
        .then(function (data) {
            var btn = document.querySelector('.header-btn');
            if (!btn) return;

            if (data.loggedIn) {
                // Replace sign-up / donate buttons with username + logout
                btn.innerHTML =
                    '<span class="nav-user-pill">' +
                        '<i class="fas fa-user-circle"></i> ' +
                        escHtml(data.name) +
                    '</span>' +
                    '<a href="backend/auth_logout.php" class="btn-default btn-signout">Sign out</a>';
            }
            // If not logged in — leave existing sign up / donate buttons in place
        })
        .catch(function () { /* silently ignore on static pages without PHP */ });

    function escHtml(s) {
        return s.replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;');
    }
})();
