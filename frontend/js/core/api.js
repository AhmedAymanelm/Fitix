async function apiFetch(path, options={}) {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if(token) headers['Authorization'] = `Bearer ${token}`;
  
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json();
  if(!res.ok) throw new Error(data.detail || 'حدث خطأ في السيرفر');
  return data;
}

function syncSidebarToggleState(isOpen) {
  const toggleBtn = document.getElementById('sidebarToggleBtn');
  if (!toggleBtn) return;
  toggleBtn.classList.toggle('open', isOpen);
  toggleBtn.setAttribute('aria-label', isOpen ? 'إغلاق القائمة' : 'فتح القائمة');
  toggleBtn.title = isOpen ? 'إغلاق القائمة' : 'القائمة';
}

const MOBILE_BP = 881; // matches CSS breakpoint

function isMobile() {
  return window.innerWidth < MOBILE_BP;
}

function openSidebar() {
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('sidebarBackdrop');
  if (!sidebar) return;

  sidebar.classList.add('open');

  if (isMobile()) {
    // Force inline styles for mobile — bypasses all CSS stacking issues
    sidebar.style.cssText = `
      display: flex !important;
      position: fixed !important;
      top: 0 !important;
      right: 0 !important;
      bottom: 0 !important;
      left: auto !important;
      width: 280px !important;
      max-width: 85vw !important;
      z-index: 9999 !important;
      background: linear-gradient(180deg, #12131a, #0d0e10) !important;
      border-left: 1px solid rgba(200,255,61,0.15) !important;
      border-radius: 20px 0 0 20px !important;
      box-shadow: -6px 0 40px rgba(0,0,0,0.95) !important;
      padding-top: 64px !important;
      overflow-y: auto !important;
      flex-direction: column !important;
      gap: 4px !important;
      transform: none !important;
    `;
  }

  if (backdrop) {
    backdrop.classList.add('open');
    if (isMobile()) {
      backdrop.style.cssText = `
        display: block !important;
        position: fixed !important;
        inset: 0 !important;
        z-index: 9998 !important;
        background: rgba(0,0,0,0.7) !important;
        opacity: 1 !important;
        pointer-events: auto !important;
      `;
    }
  }

  document.body.classList.add('sidebar-open');
  if (isMobile()) document.body.style.overflow = 'hidden';
  syncSidebarToggleState(true);
}

function closeSidebar() {
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('sidebarBackdrop');
  if (!sidebar) return;

  sidebar.classList.remove('open');

  if (isMobile()) {
    // Reset inline styles - sidebar hides
    sidebar.style.cssText = `
      display: none !important;
      position: fixed !important;
      right: -100% !important;
    `;
    setTimeout(() => {
      // After transition allow CSS to take over again
      sidebar.style.cssText = '';
    }, 300);
  }

  if (backdrop) {
    backdrop.classList.remove('open');
    if (isMobile()) {
      backdrop.style.cssText = '';
    }
  }

  document.body.classList.remove('sidebar-open');
  document.body.style.overflow = '';
  syncSidebarToggleState(false);
}

function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;
  if (sidebar.classList.contains('open')) {
    closeSidebar();
  } else {
    openSidebar();
  }
}

async function goView(id){
  currentView = id;

  // تحديث الـ active في الـ sidebar والـ mobile nav
  document.querySelectorAll('.nav-item, .mobile-nav-item').forEach(el =>
    el.classList.toggle('active', el.dataset.nav === id)
  );

  // إغلاق القائمة الجانبية في الموبايل عند الضغط على أي صفحة
  if (typeof closeSidebar === 'function') {
    closeSidebar();
  }

  const content = document.getElementById('content');
  if(!views[id]){
    content.innerHTML = '<p>قريباً</p>';
    return;
  }

  
  content.innerHTML = '<div style="text-align:center;padding:50px;color:var(--text-dim)"><span class="pulse-dot"></span> جاري التحميل...</div>';
  
  try {
    const html = await views[id]();
    content.innerHTML = html;
  } catch(e) {
    content.innerHTML = `<p style="color:var(--coral);padding:20px">❌ ${e.message}</p>`;
    console.error(e);
  }
  
  // Scroll للأعلى (مع مراعاة الـ mobile nav)
  window.scrollTo({top:0, behavior:'smooth'});
  closeSidebar();
  requestAnimationFrame(()=>{ if(id==='u-dash') bindTimerless(); if(window.initFns && initFns[id]) initFns[id](); });
}
