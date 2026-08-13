function toast(msg){
  const t = document.getElementById('toast');
  t.innerHTML = msg;
  t.classList.add('show');
  clearTimeout(window._toastT);
  window._toastT = setTimeout(()=>t.classList.remove('show'), 2600);
}
window.showNotification = toast;

/* ============ MODAL: add client ============ */
function openModal(){
  document.getElementById('newClientName').value='';
  document.getElementById('modalBg').classList.add('show');
}
function closeModal(){ document.getElementById('modalBg').classList.remove('show'); }
document.addEventListener('input', e=>{
  if(e.target.id==='newClientName'){
    const v = e.target.value.trim();
    const user = v ? v.split(' ')[0].toLowerCase()+Math.floor(Math.random()*90+10) : '';
    document.getElementById('newClientUser').value = user ? user+'.fit' : '';
    document.getElementById('newClientPass').value = user ? 'Fx'+Math.floor(Math.random()*9000+1000)+'!' : '';
  }
});
async function createClient(){
  const name = document.getElementById('newClientName').value.trim();
  const phone = document.querySelector('input[placeholder="01xxxxxxxxx"]').value.trim();
  const user = document.getElementById('newClientUser').value;
  const pass = document.getElementById('newClientPass').value;
  
  if(!name){ toast('❌ اكتب اسم العميل الأول'); return; }
  
  try {
    await apiFetch('/admin/clients', {
      method: 'POST',
      body: JSON.stringify({
        full_name: name,
        phone: phone,
        username: user,
        password: pass
      })
    });
    closeModal();
    toast(`✅ اتعمل حساب لـ ${name} — هيوصله اليوزر والباسورد`);
    if (currentView === 'a-clients') goView('a-clients');
  } catch(e) {
    toast(`❌ خطأ: ${e.message}`);
  }
}

/* ============ RING helper ============ */
function ring(pct, color, value, label, sub){
  const r=48, c=2*Math.PI*r, off = c - (pct/100)*c;
  return `
  <div>
    <div class="ring">
      <svg width="118" height="118">
        <circle cx="59" cy="59" r="${r}" stroke="var(--surface-3)" stroke-width="10" fill="none"/>
        <circle cx="59" cy="59" r="${r}" stroke="${color}" stroke-width="10" fill="none"
          stroke-dasharray="${c}" stroke-dashoffset="${off}" stroke-linecap="round"/>
      </svg>
      <div class="ring-val"><b>${value}</b><span>${sub}</span></div>
    </div>
    <div class="ring-label">${label}</div>
  </div>`;
}

/* ============ CUSTOM CONFIRM MODAL ============ */
window.appConfirm = function(msg, confirmText = 'نعم، متأكد', cancelText = 'إلغاء') {
  return new Promise((resolve) => {
    let m = document.getElementById('globalAppConfirm');
    if (!m) {
      m = document.createElement('div');
      m.id = 'globalAppConfirm';
      document.body.appendChild(m);
    }
    m.innerHTML = `
      <div style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);z-index:99999;display:flex;justify-content:center;align-items:center;padding:20px; animation:fadeIn 0.2s;">
        <div style="background:var(--surface-2);border-radius:24px;width:100%;max-width:400px;border:1px solid var(--border);padding:30px;text-align:center;box-shadow:0 20px 40px rgba(0,0,0,0.5); animation:slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);">
          <div style="font-size:50px; margin-bottom:15px; text-shadow: 0 4px 15px rgba(0,0,0,0.5);">⚠️</div>
          <h3 style="margin-bottom:25px;font-size:20px;color:var(--text);line-height:1.5; font-weight:800;">${msg}</h3>
          <div style="display:flex;gap:12px;">
            <button class="btn btn-primary" style="flex:1;background:var(--coral);color:#fff;border:none;padding:12px;font-size:16px;border-radius:12px;font-weight:bold;" id="globalConfirmBtnOk">${confirmText}</button>
            <button class="btn btn-ghost" style="flex:1;padding:12px;font-size:16px;border-radius:12px;border:1px solid var(--border);font-weight:bold;" id="globalConfirmBtnCancel">${cancelText}</button>
          </div>
        </div>
      </div>
      <style>
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      </style>
    `;
    
    document.getElementById('globalConfirmBtnOk').onclick = () => { m.innerHTML = ''; resolve(true); };
    document.getElementById('globalConfirmBtnCancel').onclick = () => { m.innerHTML = ''; resolve(false); };
  });
};

/* ============ VIEWS ============ */
