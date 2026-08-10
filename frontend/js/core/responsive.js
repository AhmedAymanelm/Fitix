/* =========================================================
   Fitix — Mobile Drawer Navigation
   Uses the existing sidebar navigation; no duplicate routes.
   ========================================================= */
(function () {
  function initMobileDrawer() {
    const appShell = document.getElementById('appShell');
    const topbar = document.querySelector('.topbar');
    const sidebar = document.getElementById('sidebar');
    if (!appShell || !topbar || !sidebar) return;

    if (!document.getElementById('mobileMenuBtn')) {
      const btn = document.createElement('button');
      btn.id = 'mobileMenuBtn';
      btn.className = 'mobile-menu-btn';
      btn.type = 'button';
      btn.setAttribute('aria-label', 'فتح القائمة');
      btn.setAttribute('aria-expanded', 'false');
      btn.innerHTML = '<span></span><span></span><span></span>';
      btn.addEventListener('click', toggleMobileDrawer);
      topbar.appendChild(btn);
    }

    if (!document.getElementById('mobileMenuOverlay')) {
      const overlay = document.createElement('div');
      overlay.id = 'mobileMenuOverlay';
      overlay.className = 'mobile-menu-overlay';
      overlay.addEventListener('click', closeMobileDrawer);
      appShell.insertBefore(overlay, appShell.firstChild);
    }

    sidebar.addEventListener('click', function (event) {
      const item = event.target.closest('.nav-item');
      if (item) closeMobileDrawer();
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') closeMobileDrawer();
    });
  }

  window.toggleMobileMenu = function () {
    const shell = document.getElementById('appShell');
    const btn = document.getElementById('mobileMenuBtn');
    if (!shell || !btn) return;
    const open = shell.classList.toggle('mobile-menu-open');
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'إغلاق القائمة' : 'فتح القائمة');
    document.body.classList.toggle('mobile-drawer-open', open);
  };

  window.toggleMobileDrawer = window.toggleMobileMenu;

  window.closeMobileMenu = function () {
    closeMobileDrawer();
  };

  function closeMobileDrawer() {
    const shell = document.getElementById('appShell');
    const btn = document.getElementById('mobileMenuBtn');
    if (!shell) return;
    shell.classList.remove('mobile-menu-open');
    document.body.classList.remove('mobile-drawer-open');
    if (btn) {
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-label', 'فتح القائمة');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileDrawer, { once: true });
  } else {
    initMobileDrawer();
  }
})();
