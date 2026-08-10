/* =========================================================
   Fitix — Mobile Drawer Navigation
   Uses the existing sidebar navigation; no duplicate routes.
   ========================================================= */
(function () {
  function injectMobileFixes() {
    if (document.getElementById('fitix-mobile-final-fixes')) return;
    const style = document.createElement('style');
    style.id = 'fitix-mobile-final-fixes';
    style.textContent = `
      @media (max-width: 768px) {
        .mobile-menu-btn {
          position: fixed !important;
          top: 6px !important;
          right: 84px !important;
          left: auto !important;
          width: 52px !important;
          height: 52px !important;
          min-width: 52px !important;
          min-height: 52px !important;
          z-index: 1400 !important;
          outline: none !important;
          pointer-events: auto !important;
          touch-action: manipulation !important;
        }
        .mobile-menu-btn:focus,
        .mobile-menu-btn:focus-visible,
        .mobile-menu-btn:active {
          outline: none !important;
          box-shadow: 0 5px 18px rgba(0,0,0,.28) !important;
        }
        .sidebar {
          pointer-events: none !important;
        }
        .mobile-menu-open .sidebar {
          pointer-events: auto !important;
        }
        .sidebar .nav-item {
          pointer-events: auto !important;
          cursor: pointer !important;
          touch-action: manipulation !important;
        }
      }
      @media (max-width: 430px) {
        .mobile-menu-btn {
          top: 6px !important;
          right: 84px !important;
          left: auto !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function initMobileDrawer() {
    const appShell = document.getElementById('appShell');
    const topbar = document.querySelector('.topbar');
    const sidebar = document.getElementById('sidebar');
    if (!appShell || !topbar || !sidebar) return;

    injectMobileFixes();

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

    /*
      Use capture phase so mobile navigation is reliable even when
      renderSidebar() replaces the nav DOM after goView().
    */
    if (!sidebar.dataset.mobileClickBound) {
      sidebar.dataset.mobileClickBound = '1';
      sidebar.addEventListener('click', function (event) {
        const item = event.target.closest('.nav-item');
        if (!item || !appShell.classList.contains('mobile-menu-open')) return;

        const viewId = item.dataset.nav;
        if (!viewId) return;

        event.preventDefault();
        event.stopImmediatePropagation();

        if (typeof window.goView === 'function') {
          window.goView(viewId);
        } else {
          item.click();
        }

        closeMobileDrawer();
      }, true);
    }

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
