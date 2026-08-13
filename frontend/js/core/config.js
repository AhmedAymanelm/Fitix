
const ic = {
  dash:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></svg>`,
  chat:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>`,
  users:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  dumbbell:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6.5 6.5l11 11M4 4l3 3M17 17l3 3M9 4l1 1M14 19l1 1M2 8l3-3M19 16l3 3M6 6l3-3M15 15l3-3"/></svg>`,
  spark:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v3M12 18v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M3 12h3M18 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/><circle cx="12" cy="12" r="3"/></svg>`,
  scan:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/><line x1="3" y1="12" x2="21" y2="12"/></svg>`,
  timer:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M9 2h6"/></svg>`,
  cam:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>`,
  upload:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>`,
  file:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
};

/* ============ NAV CONFIG ============ */
const ic2 = {
  analytics:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
  settings:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
  aichat:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><circle cx="12" cy="12" r="10"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
};
const adminNav = [
  {id:'a-dash', label:'لوحة التحكم', icon:ic.dash},
  {id:'a-chat', label:'المحادثات', icon:ic.chat},
  {id:'a-clients', label:'العملاء', icon:ic.users},
  {id:'a-library', label:'مكتبة التمارين', icon:ic.dumbbell},
  {id:'a-foods', label:'قاعدة التغذية', icon:ic.file},
  {id:'a-ai', label:'توليد نظام غذائي AI', icon:ic.spark},
  {id:'a-aichat', label:'مساعد AI', icon:ic2.aichat},
  {id:'a-inbody', label:'قراءة InBody (OCR)', icon:ic.scan},
  {id:'a-analytics', label:'التحليلات', icon:ic2.analytics},
  {id:'a-settings', label:'الإعدادات', icon:ic2.settings},
];
const userNav = [
  {id:'u-dash', label:'تمارين النهاردة', icon:ic.dash},
  {id:'u-nutrition', label:'نظام التغذية 🥗', icon:ic.file},
  {id:'u-chat', label:'المحادثة مع الكابتن', icon:ic.chat},
  {id:'u-notifs', label:'إشعاراتي 🔔', icon:ic.chat},
  {id:'u-cv', label:'اختبار اللياقة (كاميرا)', icon:ic.cam},
  {id:'u-inbody', label:'بياناتي (InBody)', icon:ic.upload},
  {id:'u-aichat', label:'مساعد AI', icon:ic2.aichat},
  {id:'u-analytics', label:'تقدمي', icon:ic2.analytics},
  {id:'u-settings', label:'إعداداتي', icon:ic2.settings},
];

let mode = 'admin';
let currentView = 'a-dash';

function setMode(m, forceView){
  mode = m;
  
  let firstName = '';
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.full_name) {
      firstName = user.full_name.split(' ')[0];
    }
  } catch(e){}
  
  const initial = firstName ? firstName.charAt(0).toUpperCase() : (m==='admin' ? 'C' : 'A');
  document.getElementById('topbarAvatar').textContent = initial;
  
  const label = document.getElementById('topbarRoleLabel');
  if(label) {
    label.textContent = '';
  }
  
  renderSidebar();

  // Restore last visited page (after refresh) or go to dashboard
  const defaultView = m === 'admin' ? 'a-dash' : 'u-dash';
  const savedView = sessionStorage.getItem('lastView');
  const viewToGo = forceView || (savedView && savedView.startsWith(m === 'admin' ? 'a-' : 'u-') ? savedView : defaultView);
  goView(viewToGo);
}

function renderSidebar(){
  let firstName = '';
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.full_name) firstName = user.full_name.split(' ')[0];
  } catch(e){}

  const nav = mode==='admin' ? adminNav : userNav;
  const groupLabel = mode==='admin' ? 'إدارة السيستم' : 'حسابي';
  const gs = window._gymSettings || { gym_name: 'FORM Fitness', primary_color: '#c8ff3d', logo_url: null };

  // الـ logo في الـ sidebar (كبيرة، في المنتصف) — بدل الترحيب
  const sidebarLogoHtml = gs.logo_url
    ? `<div style="padding:20px 16px 16px; text-align:center; border-bottom:1px solid var(--border); margin-bottom:8px;">
        <img src="${gs.logo_url}" style="width:100px;height:100px;object-fit:contain;border-radius:16px;display:block;margin:0 auto;">
       </div>`
    : '';

  const sidebarEl = document.getElementById('sidebar');
  sidebarEl.innerHTML = `
    ${sidebarLogoHtml}
    <div class="side-title">${groupLabel}</div>
    ${nav.map(n=>`
      <div class="nav-item ${n.id===currentView?'active':''}" data-nav="${n.id}" style="touch-action:manipulation;cursor:pointer;">
        ${n.icon}<span>${n.label}</span>
        ${n.badge?`<span class="nav-badge">${n.badge}</span>`:''}
      </div>`).join('')}
  `;

  // Add event listeners after rendering (more reliable than inline onclick on mobile)
  sidebarEl.querySelectorAll('.nav-item[data-nav]').forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      const viewId = this.dataset.nav;
      if (viewId && typeof goView === 'function') {
        goView(viewId);
      }
    });
    // Touch support
    item.addEventListener('touchend', function(e) {
      e.preventDefault();
      const viewId = this.dataset.nav;
      if (viewId && typeof goView === 'function') {
        goView(viewId);
      }
    }, { passive: false });
  });

  // رسم الـ bottom nav للموبايل
  renderMobileNav(nav);

  // Re-apply chat badge after re-render (badges survive via nav config object)
  if (typeof updateChatBadge === 'function') {
    // Only update DOM (nav config already has the badge value)
    ['a-chat', 'u-chat'].forEach(navId => {
      const navItem = document.querySelector(`.nav-item[data-nav="${navId}"]`);
      if (!navItem) return;
      const n = [...adminNav, ...userNav].find(x => x.id === navId);
      if (n && n.badge) {
        const old = navItem.querySelector('.nav-badge');
        if (old) old.remove();
        navItem.insertAdjacentHTML('beforeend',
          `<span class="nav-badge" style="background:#cda434;color:#000;font-weight:800;">${n.badge}</span>`
        );
      }
    });
  }
}

// ── Chat Unread Badge ──
let _chatBadgeInterval = null;

async function updateChatBadge() {
  try {
    const convos = await apiFetch('/chat/conversations');
    const totalUnread = convos.reduce((sum, c) => sum + (c.unread || 0), 0);

    // ── Update nav config objects so badge survives renderSidebar() calls ──
    const chatAdminNav = adminNav.find(n => n.id === 'a-chat');
    const chatUserNav  = userNav.find(n => n.id === 'u-chat');
    if (chatAdminNav) chatAdminNav.badge = totalUnread > 0 ? totalUnread : null;
    if (chatUserNav)  chatUserNav.badge  = totalUnread > 0 ? totalUnread : null;

    // ── Directly update DOM badge in case sidebar is already rendered ──
    ['a-chat', 'u-chat'].forEach(navId => {
      // Sidebar nav item
      const navItem = document.querySelector(`.nav-item[data-nav="${navId}"]`);
      if (navItem) {
        const old = navItem.querySelector('.nav-badge');
        if (old) old.remove();
        if (totalUnread > 0) {
          navItem.insertAdjacentHTML('beforeend',
            `<span class="nav-badge" style="background:#cda434;color:#000;font-weight:800;">${totalUnread}</span>`
          );
        }
      }

      // Mobile nav item
      const mobileItem = document.querySelector(`.mobile-nav-item[data-nav="${navId}"]`);
      if (mobileItem) {
        const oldM = mobileItem.querySelector('.mobile-badge');
        if (oldM) oldM.remove();
        if (totalUnread > 0) {
          mobileItem.style.position = 'relative';
          mobileItem.insertAdjacentHTML('beforeend',
            `<span class="mobile-badge" style="position:absolute;top:4px;right:4px;background:#cda434;color:#000;font-size:10px;font-weight:800;min-width:17px;height:17px;border-radius:999px;display:flex;align-items:center;justify-content:center;padding:0 4px;">${totalUnread}</span>`
          );
        }
      }
    });
  } catch(e) {}
}

function startChatBadgePolling() {
  updateChatBadge();
  if (_chatBadgeInterval) clearInterval(_chatBadgeInterval);
  _chatBadgeInterval = setInterval(updateChatBadge, 10000); // every 10s
}


function renderMobileNav(nav) {
  const mobileNav = document.getElementById('mobileNav');
  if (!mobileNav) return;

  mobileNav.innerHTML = nav.map(n => `
    <div class="mobile-nav-item ${n.id === currentView ? 'active' : ''}"
         onclick="goView('${n.id}')" data-nav="${n.id}">
      ${n.icon}
      <span>${n.label.replace(/\s*🥗|🔔|🤖|AI\s*/g, '').trim().split(' ')[0]}</span>
    </div>
  `).join('');
}

// تحميل إعدادات الجيم وتطبيقها عند بدء التطبيق
async function loadGymSettings() {
  try {
    const s = await apiFetch('/gym-settings');
    window._gymSettings = s;

    const name = s.gym_name || 'Fitix';

    // ── تطبيق اللون الأساسي ──
    if (s.primary_color) {
      document.documentElement.style.setProperty('--primary', s.primary_color);
    }

    // ── تحديث لوجو الجيم في الـ topbar ──
    ['topbarLogo', 'loginTopbarLogo'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        if (s.logo_url) {
          el.src = s.logo_url;
          el.style.display = 'inline-block';
        } else {
          el.style.display = 'none';
        }
      }
    });

    // تحديث عنوان الصفحة
    document.title = (s.gym_name || 'Fitix') + ' — نظام إدارة الجيم';

    // إعادة رسم الـ sidebar
    renderSidebar();
  } catch(e) {
    window._gymSettings = { gym_name: 'Fitix', primary_color: '#c8ff3d', logo_url: null };
  }
}



// Auto-detect backend URL:
// - In production (Railway): set window.BACKEND_URL before this script, or same origin
// - In local development: localhost:8000
const API_BASE = (() => {
  if (window.BACKEND_URL) return window.BACKEND_URL + '/api';
  if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
    return 'http://localhost:8000/api';
  }
  // Production: backend is same-domain (served via Railway)
  return window.location.origin + '/api';
})();

