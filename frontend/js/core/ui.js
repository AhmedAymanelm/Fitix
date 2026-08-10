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

/* ============ VIEWS ============ */
