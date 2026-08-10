async function apiFetch(path, options={}) {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if(token) headers['Authorization'] = `Bearer ${token}`;
  
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json();
  if(!res.ok) throw new Error(data.detail || 'حدث خطأ في السيرفر');
  return data;
}

async function goView(id){
  currentView = id;

  // تحديث الـ active في الـ sidebar والـ mobile nav
  document.querySelectorAll('.nav-item, .mobile-nav-item').forEach(el =>
    el.classList.toggle('active', el.dataset.nav === id)
  );

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
  requestAnimationFrame(()=>{ if(id==='u-dash') bindTimerless(); if(window.initFns && initFns[id]) initFns[id](); });
}
