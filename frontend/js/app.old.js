/* ============ ICONS ============ */
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
  {id:'u-chat', label:'المحادثة مع الكابتن', icon:ic.chat},
  {id:'u-cv', label:'اختبار اللياقة (كاميرا)', icon:ic.cam},
  {id:'u-inbody', label:'بياناتي (InBody)', icon:ic.upload},
  {id:'u-aichat', label:'مساعد AI', icon:ic2.aichat},
  {id:'u-analytics', label:'تقدمي', icon:ic2.analytics},
  {id:'u-settings', label:'إعداداتي', icon:ic2.settings},
];

let mode = 'admin';
let currentView = 'a-dash';

function setMode(m){
  mode = m;
  document.getElementById('topbarAvatar').textContent = m==='admin' ? 'C' : 'A';
  const label = document.getElementById('topbarRoleLabel');
  if(label) label.textContent = m==='admin' ? '🧑‍💼 المدرب' : '🏋️ العميل';
  renderSidebar();
  goView(m==='admin' ? 'a-dash' : 'u-dash');
}

function renderSidebar(){
  const nav = mode==='admin' ? adminNav : userNav;
  const groupLabel = mode==='admin' ? 'إدارة السيستم' : 'حسابي';
  document.getElementById('sidebar').innerHTML = `
    <div class="side-title">${groupLabel}</div>
    ${nav.map(n=>`
      <div class="nav-item ${n.id===currentView?'active':''}" onclick="goView('${n.id}')" data-nav="${n.id}">
        ${n.icon}<span>${n.label}</span>
        ${n.badge?`<span class="nav-badge">${n.badge}</span>`:''}
      </div>`).join('')}
  `;
}

const API_BASE = 'http://localhost:8000/api';

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
  document.querySelectorAll('.nav-item').forEach(el=>el.classList.toggle('active', el.dataset.nav===id));
  
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
  
  window.scrollTo({top:0, behavior:'smooth'});
  requestAnimationFrame(()=>{ if(id==='u-dash') bindTimerless(); if(window.initFns && initFns[id]) initFns[id](); });
}

function toast(msg){
  const t = document.getElementById('toast');
  t.innerHTML = msg;
  t.classList.add('show');
  clearTimeout(window._toastT);
  window._toastT = setTimeout(()=>t.classList.remove('show'), 2600);
}

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
const views = {};

/* ---- Admin Dashboard ---- */
views['a-dash'] = async () => {
  const stats = await apiFetch('/admin/dashboard');
  const avg = stats.averages || {};
  
  // Schedule charts after DOM ready
  window._dashStats = stats;
  setTimeout(() => initDashboardCharts(), 200);

  // Build recent readings table
  let recentReadingsHtml = '';
  if (stats.recent_readings && stats.recent_readings.length > 0) {
    recentReadingsHtml = `
    <div class="card" style="padding:20px; height:100%">
      <h3 style="color:var(--gold); margin-bottom:15px; font-size:16px">📊 آخر قراءات InBody</h3>
      <div style="overflow-x:auto">
        <table style="width:100%; border-collapse:collapse; font-size:13px">
          <thead>
            <tr style="border-bottom:2px solid var(--border); color:var(--text-dim)">
              <th style="padding:10px; text-align:right">العميل</th>
              <th style="padding:10px; text-align:center">الوزن</th>
              <th style="padding:10px; text-align:center">الدهون</th>
              <th style="padding:10px; text-align:center">العضلات</th>
              <th style="padding:10px; text-align:center">التاريخ</th>
            </tr>
          </thead>
          <tbody>
            ${stats.recent_readings.map(r => `
              <tr style="border-bottom:1px solid var(--border)">
                <td style="padding:8px 10px; font-weight:bold">${r.client_name}</td>
                <td style="padding:8px 10px; text-align:center" dir="ltr">${r.weight} kg</td>
                <td style="padding:8px 10px; text-align:center; color:var(--coral)" dir="ltr">${r.body_fat}%</td>
                <td style="padding:8px 10px; text-align:center; color:var(--lime)" dir="ltr">${r.muscle_mass}%</td>
                <td style="padding:8px 10px; text-align:center; color:var(--text-dim)">${r.date}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>`;
  } else {
    recentReadingsHtml = `
    <div class="card" style="padding:30px; text-align:center; color:var(--text-dim); height:100%">
      <div style="font-size:30px; margin-bottom:10px">📊</div>
      <p>لا توجد قراءات InBody بعد. <b style="color:var(--lime); cursor:pointer" onclick="goView('a-inbody')">ارفع أول صورة</b></p>
    </div>`;
  }

  // Build leaderboard
  let leaderboardHtml = '';
  if (stats.leaderboard && stats.leaderboard.length > 0) {
    const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];
    leaderboardHtml = `
    <div class="card" style="padding:20px; height:100%">
      <h3 style="color:var(--gold); margin-bottom:15px; font-size:16px">🏆 أفضل العملاء تحسّناً</h3>
      ${stats.leaderboard.map((l, i) => `
        <div style="display:flex; align-items:center; gap:10px; padding:10px 0; ${i < stats.leaderboard.length - 1 ? 'border-bottom:1px solid var(--border)' : ''}" onclick="window.currentClientId=${l.id}; goView('a-client-detail')" style="cursor:pointer">
          <span style="font-size:20px; min-width:30px">${medals[i]}</span>
          <div style="flex:1">
            <b>${l.name}</b>
            <div style="font-size:11px; color:var(--text-dim); margin-top:2px">${l.readings} قراءات</div>
          </div>
          <div style="text-align:left; font-size:12px">
            <div style="color:${l.fat_change <= 0 ? 'var(--lime)' : 'var(--coral)'}">دهون: ${l.fat_change > 0 ? '+' : ''}${l.fat_change}%</div>
            <div style="color:${l.muscle_change >= 0 ? 'var(--lime)' : 'var(--coral)'}">عضلات: ${l.muscle_change > 0 ? '+' : ''}${l.muscle_change}%</div>
          </div>
        </div>
      `).join('')}
    </div>`;
  } else {
    leaderboardHtml = `
    <div class="card" style="padding:30px; text-align:center; color:var(--text-dim); height:100%">
      <div style="font-size:30px; margin-bottom:10px">🏆</div>
      <p>يحتاج قراءتين InBody على الأقل لتحديد الترتيب</p>
    </div>`;
  }

  // Build recent messages
  let messagesHtml = '';
  if (stats.recent_messages && stats.recent_messages.length > 0) {
    messagesHtml = `
    <div class="card" style="padding:20px; height:100%">
      <h3 style="color:var(--cyan); margin-bottom:15px; font-size:16px">💬 آخر الرسائل</h3>
      ${stats.recent_messages.map(m => `
        <div style="display:flex; align-items:center; gap:10px; padding:10px 0; border-bottom:1px solid var(--border); cursor:pointer" onclick="activeChatUserId=${m.sender_id}; goView('a-chat')">
          <div class="client-avatar" style="width:32px;height:32px;font-size:11px;flex-shrink:0">${m.sender_name[0]}</div>
          <div style="flex:1; min-width:0">
            <div style="display:flex; justify-content:space-between; align-items:center">
              <b style="font-size:13px">${m.sender_name}</b>
              ${!m.is_read ? '<span style="width:8px;height:8px;border-radius:50%;background:var(--lime);display:inline-block"></span>' : ''}
            </div>
            <div style="font-size:12px; color:var(--text-dim); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; margin-top:2px">${m.content}</div>
          </div>
          <div style="font-size:10px; color:var(--text-dimmer); white-space:nowrap">${m.time}</div>
        </div>
      `).join('')}
    </div>`;
  } else {
    messagesHtml = `
    <div class="card" style="padding:30px; text-align:center; color:var(--text-dim); height:100%">
      <div style="font-size:30px; margin-bottom:10px">💬</div>
      <p>لا توجد رسائل بعد</p>
    </div>`;
  }

  // Build alerts
  let alertsHtml = '';
  if (stats.alerts && stats.alerts.length > 0) {
    const alertIcons = { inactive: '🔴', no_reading: '⏰', weight_up: '⚠️' };
    const alertColors = { inactive: 'var(--coral)', no_reading: 'var(--gold)', weight_up: 'var(--coral)' };
    alertsHtml = `
    <div class="card" style="padding:20px; margin-bottom:20px; border:1px solid rgba(255,200,0,0.2); background:rgba(255,200,0,0.03)">
      <h3 style="color:var(--gold); margin-bottom:15px; font-size:16px">⚠️ تنبيهات ذكية <span style="font-size:12px; color:var(--text-dim); font-weight:normal">(${stats.alerts.length} تنبيه)</span></h3>
      <div style="display:flex; flex-wrap:wrap; gap:8px">
        ${stats.alerts.slice(0, 8).map(a => `
          <div style="display:flex; align-items:center; gap:8px; padding:8px 14px; background:var(--surface-2); border-radius:8px; border:1px solid var(--border); cursor:pointer; font-size:13px; transition:all 0.2s" onclick="window.currentClientId=${a.id}; goView('a-client-detail')" onmouseover="this.style.borderColor='${alertColors[a.type]}'" onmouseout="this.style.borderColor='var(--border)'">
            <span>${alertIcons[a.type] || '⚠️'}</span>
            <b>${a.name}</b>
            <span style="color:${alertColors[a.type]}; font-size:11px">${a.msg}</span>
          </div>
        `).join('')}
        ${stats.alerts.length > 8 ? `<div style="padding:8px 14px; color:var(--text-dim); font-size:12px">+${stats.alerts.length - 8} تنبيه آخر</div>` : ''}
      </div>
    </div>`;
  }

  // Build client overview table
  let clientOverviewHtml = '';
  if (stats.client_overview && stats.client_overview.length > 0) {
    clientOverviewHtml = `
    <div class="card" style="padding:20px; margin-bottom:20px">
      <h3 style="color:var(--cyan); margin-bottom:15px; font-size:16px">👥 نظرة على العملاء</h3>
      <div style="overflow-x:auto">
        <table style="width:100%; border-collapse:collapse; font-size:13px">
          <thead>
            <tr style="border-bottom:2px solid var(--border); color:var(--text-dim)">
              <th style="padding:10px; text-align:right">الاسم</th>
              <th style="padding:10px; text-align:center">الحالة</th>
              <th style="padding:10px; text-align:center">القراءات</th>
              <th style="padding:10px; text-align:center">الوزن</th>
              <th style="padding:10px; text-align:center">الدهون</th>
              <th style="padding:10px; text-align:center">آخر قراءة</th>
              <th style="padding:10px; text-align:center">إجراء</th>
            </tr>
          </thead>
          <tbody>
            ${stats.client_overview.map(c => `
              <tr style="border-bottom:1px solid var(--border); cursor:pointer" onclick="window.currentClientId=${c.id}; goView('a-client-detail')">
                <td style="padding:8px 10px; font-weight:bold">
                  <div style="display:flex; align-items:center; gap:8px">
                    <div class="client-avatar" style="width:28px;height:28px;font-size:10px">${c.name[0]}</div>
                    ${c.name}
                  </div>
                </td>
                <td style="padding:8px 10px; text-align:center">
                  <span style="color:${c.is_active ? 'var(--lime)' : 'var(--coral)'}; font-weight:bold; font-size:11px; padding:3px 8px; border-radius:20px; background:${c.is_active ? 'rgba(204,255,0,0.1)' : 'rgba(255,107,107,0.1)'}">${c.is_active ? 'نشط' : 'موقوف'}</span>
                </td>
                <td style="padding:8px 10px; text-align:center">${c.readings_count}</td>
                <td style="padding:8px 10px; text-align:center" dir="ltr">${c.weight ? c.weight + ' kg' : '-'}</td>
                <td style="padding:8px 10px; text-align:center; color:var(--coral)" dir="ltr">${c.body_fat ? c.body_fat + '%' : '-'}</td>
                <td style="padding:8px 10px; text-align:center; color:var(--text-dim)">${c.last_reading_date || '-'}</td>
                <td style="padding:8px 10px; text-align:center">
                  <button class="btn btn-ghost" style="font-size:11px; padding:4px 10px; color:var(--lime)" onclick="event.stopPropagation(); window.currentClientId=${c.id}; goView('a-client-detail')">عرض ←</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>`;
  }

  return `
  <div class="page-head"><h1>أهلاً كابتن 👋</h1><p>نظرة سريعة على متابعيك النهاردة</p></div>
  
  <!-- Row 1: Main Stats -->
  <div class="grid grid-4">
    <div class="card stat-card lime" onclick="goView('a-clients')" style="cursor:pointer">
      <div class="stat-label">${ic.users} العملاء النشطين</div>
      <div class="stat-num">${stats.active_clients}</div>
      <div class="stat-sub">من أصل ${stats.total_clients} عملاء</div>
    </div>
    <div class="card stat-card gold" onclick="goView('a-inbody')" style="cursor:pointer">
      <div class="stat-label">${ic.scan} قراءات InBody</div>
      <div class="stat-num">${stats.total_readings}</div>
      <div class="stat-sub">إجمالي القراءات</div>
    </div>
    <div class="card stat-card coral">
      <div class="stat-label">${ic.users} حسابات موقوفة</div>
      <div class="stat-num">${stats.inactive_clients}</div>
      <div class="stat-sub">عملاء غير نشطين</div>
    </div>
    <div class="card stat-card" onclick="goView('a-chat')" style="cursor:pointer">
      <div class="stat-label">${ic.chat} رسائل جديدة</div>
      <div class="stat-num">${stats.new_messages}</div>
      <div class="stat-sub">غير مقروءة</div>
    </div>
  </div>

  <!-- Row 2: Averages -->
  <div class="grid grid-3" style="margin-bottom:20px">
    <div class="card" style="text-align:center; padding:20px; border-top:3px solid var(--text)">
      <div style="font-size:12px; color:var(--text-dim); font-weight:700; margin-bottom:8px">⚖️ متوسط الوزن</div>
      <div style="font-size:28px; font-weight:900; font-family:'Cairo'">${avg.avg_weight} <span style="font-size:14px; color:var(--text-dim)">kg</span></div>
      <div style="font-size:11px; color:var(--text-dimmer); margin-top:4px">من ${avg.sample_size} عميل</div>
    </div>
    <div class="card" style="text-align:center; padding:20px; border-top:3px solid var(--coral)">
      <div style="font-size:12px; color:var(--text-dim); font-weight:700; margin-bottom:8px">🔥 متوسط الدهون</div>
      <div style="font-size:28px; font-weight:900; font-family:'Cairo'; color:var(--coral)">${avg.avg_fat}<span style="font-size:14px">%</span></div>
      <div style="font-size:11px; color:var(--text-dimmer); margin-top:4px">من ${avg.sample_size} عميل</div>
    </div>
    <div class="card" style="text-align:center; padding:20px; border-top:3px solid var(--lime)">
      <div style="font-size:12px; color:var(--text-dim); font-weight:700; margin-bottom:8px">💪 متوسط العضلات</div>
      <div style="font-size:28px; font-weight:900; font-family:'Cairo'; color:var(--lime)">${avg.avg_muscle}<span style="font-size:14px">%</span></div>
      <div style="font-size:11px; color:var(--text-dimmer); margin-top:4px">من ${avg.sample_size} عميل</div>
    </div>
  </div>

  <!-- Row 3: Donut Chart + Leaderboard -->
  <div class="grid grid-2" style="gap:20px; margin-bottom:20px">
    <div class="card" style="padding:20px">
      <h3 style="color:var(--text); margin-bottom:15px; font-size:16px">🥧 توزيع العملاء</h3>
      <div style="position:relative; height:250px; width:100%">
        <canvas id="dashDonutChart"></canvas>
      </div>
    </div>
    <div>${leaderboardHtml}</div>
  </div>

  <!-- Row 4: Recent Messages + Monthly Bar Chart -->
  <div class="grid grid-2" style="gap:20px; margin-bottom:20px">
    <div>${messagesHtml}</div>
    <div class="card" style="padding:20px">
      <h3 style="color:var(--lime); margin-bottom:15px; font-size:16px">📈 عدد القراءات شهرياً</h3>
      <div style="position:relative; height:250px; width:100%">
        <canvas id="dashMonthlyChart"></canvas>
      </div>
    </div>
  </div>

  <!-- Row 5: Smart Alerts -->
  ${alertsHtml}

  <!-- Row 6: Quick Actions -->
  <div class="section-title">إجراءات سريعة</div>
  <div class="grid grid-4" style="margin-bottom:20px">
    <div class="card" style="padding:16px; text-align:center; cursor:pointer; transition:all 0.2s; border:1px solid var(--border)" onclick="goView('a-inbody')" onmouseover="this.style.borderColor='var(--lime)'" onmouseout="this.style.borderColor='var(--border)'">
      <div style="font-size:28px; margin-bottom:8px">📸</div>
      <b style="font-size:13px">رفع InBody</b>
      <div style="font-size:11px; color:var(--text-dim); margin-top:4px">تحليل بالذكاء الاصطناعي</div>
    </div>
    <div class="card" style="padding:16px; text-align:center; cursor:pointer; transition:all 0.2s; border:1px solid var(--border)" onclick="goView('a-clients')" onmouseover="this.style.borderColor='var(--lime)'" onmouseout="this.style.borderColor='var(--border)'">
      <div style="font-size:28px; margin-bottom:8px">👤</div>
      <b style="font-size:13px">إضافة عميل</b>
      <div style="font-size:11px; color:var(--text-dim); margin-top:4px">إنشاء حساب جديد</div>
    </div>
    <div class="card" style="padding:16px; text-align:center; cursor:pointer; transition:all 0.2s; border:1px solid var(--border)" onclick="goView('a-ai')" onmouseover="this.style.borderColor='var(--gold)'" onmouseout="this.style.borderColor='var(--border)'">
      <div style="font-size:28px; margin-bottom:8px">🤖</div>
      <b style="font-size:13px">نظام غذائي AI</b>
      <div style="font-size:11px; color:var(--text-dim); margin-top:4px">نظام مخصص للعميل</div>
    </div>
    <div class="card" style="padding:16px; text-align:center; cursor:pointer; transition:all 0.2s; border:1px solid var(--border)" onclick="goView('a-chat')" onmouseover="this.style.borderColor='var(--cyan)'" onmouseout="this.style.borderColor='var(--border)'">
      <div style="font-size:28px; margin-bottom:8px">💬</div>
      <b style="font-size:13px">المحادثات</b>
      <div style="font-size:11px; color:var(--text-dim); margin-top:4px">تواصل مع العملاء</div>
    </div>
  </div>

  <!-- Row 7: Recent Readings Table -->
  <div class="grid grid-2" style="gap:20px; margin-bottom:20px">
    <div>${recentReadingsHtml}</div>
    <div>${clientOverviewHtml || '<div class="card" style="padding:30px; text-align:center; color:var(--text-dim)"><div style="font-size:30px; margin-bottom:10px">👥</div><p>لا يوجد عملاء بعد</p></div>'}</div>
  </div>
`;
}

// Dashboard Charts (Donut + Monthly Bar)
let dashDonutInstance = null;
let dashMonthlyInstance = null;

function initDashboardCharts() {
  const stats = window._dashStats;
  if (!stats) return;
  
  // Donut Chart: Active vs Inactive
  const donutCtx = document.getElementById('dashDonutChart');
  if (donutCtx) {
    if (dashDonutInstance) dashDonutInstance.destroy();
    dashDonutInstance = new Chart(donutCtx, {
      type: 'doughnut',
      data: {
        labels: ['نشط', 'موقوف'],
        datasets: [{
          data: [stats.active_clients, stats.inactive_clients],
          backgroundColor: ['rgba(204,255,0,0.8)', 'rgba(255,107,107,0.8)'],
          borderColor: ['rgba(204,255,0,1)', 'rgba(255,107,107,1)'],
          borderWidth: 2,
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: '#e0e0e0', font: { family: 'Cairo', size: 13 }, padding: 20 }
          }
        }
      }
    });
  }
  
  // Monthly Bar Chart
  const monthlyCtx = document.getElementById('dashMonthlyChart');
  if (monthlyCtx && stats.monthly_readings) {
    if (dashMonthlyInstance) dashMonthlyInstance.destroy();
    dashMonthlyInstance = new Chart(monthlyCtx, {
      type: 'bar',
      data: {
        labels: stats.monthly_readings.map(m => m.month),
        datasets: [{
          label: 'عدد القراءات',
          data: stats.monthly_readings.map(m => m.count),
          backgroundColor: 'rgba(204,255,0,0.6)',
          borderColor: 'rgba(204,255,0,1)',
          borderWidth: 1,
          borderRadius: 6,
          barPercentage: 0.6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: { ticks: { color: '#a0a0a0', font: { family: 'Cairo' } }, grid: { display: false } },
          y: { ticks: { color: '#a0a0a0', font: { family: 'Cairo' }, stepSize: 1 }, grid: { color: 'rgba(255,255,255,0.05)' }, beginAtZero: true }
        }
      }
    });
  }
}

let activeChatUserId = null;

views['a-chat'] = async () => {
  const convos = await apiFetch('/chat/conversations');
  
  if(convos.length > 0 && !activeChatUserId) {
    activeChatUserId = convos[0].user_id;
  }
  
  let chatMainHtml = '<div class="chat-main" style="display:flex;align-items:center;justify-content:center;color:var(--text-dim)">اختر محادثة</div>';
  
  if (activeChatUserId) {
    const activeConvo = convos.find(c => c.user_id === activeChatUserId);
    const msgs = await apiFetch(`/chat/${activeChatUserId}`);
    
    chatMainHtml = `
    <div class="chat-main">
      <div class="chat-head"><div class="client-avatar" style="width:30px;height:30px;font-size:11px">${activeConvo ? activeConvo.name[0] : ''}</div> ${activeConvo ? activeConvo.name : ''}</div>
      <div class="chat-body" id="chatBody">
        ${msgs.map(m => `<div class="bubble ${m.is_me ? 'out' : 'in'}">${m.content}</div>`).join('')}
      </div>
      <div class="chat-input">
        <input id="chatInput" placeholder="اكتب رسالتك..." onkeypress="if(event.key==='Enter') sendChat()">
        <button class="btn btn-primary" onclick="sendChat()">إرسال</button>
      </div>
    </div>`;
  }
  
  return `
  <div class="page-head"><h1>المحادثات</h1><p>كلم عملاءك مباشرة من هنا</p></div>
  <div class="chat-wrap">
    <div class="chat-list">
      ${convos.length === 0 ? '<div style="padding:20px;text-align:center;color:var(--text-dim)">مفيش محادثات</div>' : ''}
      ${convos.map(c => `
        <div class="chat-item ${c.user_id === activeChatUserId ? 'active' : ''}" onclick="activeChatUserId=${c.user_id}; goView('a-chat')">
          <div class="client-avatar" style="width:34px;height:34px;font-size:11px">${c.name[0]}</div>
          <div style="flex:1;min-width:0">
            <div class="ci-name">${c.name}</div>
            <div class="ci-msg">${c.last_message}</div>
          </div>
          ${c.unread ? `<span class="nav-badge">${c.unread}</span>` : ''}
        </div>`).join('')}
    </div>
    ${chatMainHtml}
  </div>
  `;
}

async function sendChat(){
  if(!activeChatUserId) return;
  const inp = document.getElementById('chatInput');
  const txt = inp.value.trim();
  if(!txt) return;
  
  const body = document.getElementById('chatBody');
  body.insertAdjacentHTML('beforeend', `<div class="bubble out">${txt}</div>`);
  inp.value='';
  body.scrollTop = body.scrollHeight;
  
  try {
    await apiFetch('/chat', {
      method: 'POST',
      body: JSON.stringify({ receiver_id: activeChatUserId, content: txt })
    });
  } catch(e) {
    toast(`❌ خطأ في الإرسال: ${e.message}`);
  }
}

/* ---- Admin Clients ---- */
views['a-clients'] = async () => {
  const clients = await apiFetch('/admin/clients');
  
  return `
  <div class="page-head" style="display:flex;justify-content:space-between;align-items:flex-end;">
    <div><h1>المتابعين</h1><p>${clients.length} متابع مسجل — دوس على أي شخص لعرض ملفه الكامل</p></div>
    <button class="btn btn-primary" onclick="openModal()">+ إضافة عميل جديد</button>
  </div>
  <div class="grid grid-3">
    ${clients.map(c=>`
      <div class="card client-card" onclick="window.currentClientId=${c.id}; goView('a-client-detail')">
        <div class="client-top">
          <div class="client-avatar">${c.full_name[0]}</div>
          <div><div class="client-name">${c.full_name}</div><div class="client-sub">${c.subscription}</div></div>
        </div>
        <div class="client-meta">
          <div class="mini-stat"><b>${c.weight}</b><span>الوزن</span></div>
          <div class="mini-stat"><b>${c.body_fat}</b><span>دهون</span></div>
        </div>
      </div>`).join('')}
  </div>
  `;
}

/* ---- Admin Client Detail (tabs) ---- */
views['a-client-detail'] = async () => {
  if (!window.currentClientId) return `<div class="page-head"><h1>خطأ</h1><p>مفيش عميل محدد</p></div>`;
  
  const c = await apiFetch('/admin/clients/' + window.currentClientId);
  let history = [];
  try {
    history = await apiFetch('/inbody/client/' + window.currentClientId);
  } catch(e) {
    console.error(e);
  }
  
  let activePlan = null;
  try {
    activePlan = await apiFetch('/admin/clients/' + window.currentClientId + '/active-plan');
  } catch(e) {
    console.error('No active plan found', e);
  }
  
  let nutritionHtml = '';
  if (activePlan) {
    nutritionHtml = `
      <div class="card" style="margin-bottom:20px; border:1px solid var(--lime); background:rgba(204,255,0,0.03)">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px">
          <div>
            <h3 style="color:var(--lime); margin-bottom:5px">النظام الغذائي المعتمد</h3>
            <div style="font-size:12px; color:var(--text-dim)">الهدف: ${activePlan.goal} | ${activePlan.daily_calories} سعرة يومياً</div>
          </div>
          <span class="tag" style="background:var(--lime); color:#000">نشط الآن</span>
        </div>
        <div style="display:flex; flex-direction:column; gap:10px">
          ${activePlan.meals.map(m => `
            <div style="padding:15px; background:var(--surface-2); border-radius:8px; border-left:3px solid var(--gold)">
              <div style="display:flex; justify-content:space-between; margin-bottom:8px">
                <b>${m.name}</b>
                <span style="font-size:12px; color:var(--gold)">${m.calories} سعرة</span>
              </div>
              <div style="font-size:13px; color:var(--text); line-height:1.6">
                ${m.items.split('+').map(item => `<div style="padding-left:10px; position:relative"><span style="position:absolute; right:0; top:0; color:var(--text-dim)">•</span> ${item.trim()}</div>`).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } else {
    nutritionHtml = `
      <div class="card" style="padding:40px 20px; text-align:center; color:var(--text-dim)">
        <div style="font-size:40px; margin-bottom:15px">🥗</div>
        <h3 style="margin-bottom:10px; color:var(--text)">لا يوجد نظام غذائي معتمد</h3>
        <p style="margin-bottom:20px">تقدر تستخدم الذكاء الاصطناعي عشان تولد نظام غذائي مخصص للعميل ده.</p>
        <button class="btn btn-primary" onclick="goView('a-ai')">توليد نظام غذائي بالـ AI</button>
      </div>
    `;
  }
  
  return `
  <div class="page-head">
    <div class="client-top" style="margin-bottom:6px">
      <div class="client-avatar" style="width:52px;height:52px;font-size:18px">${c.full_name[0]}</div>
      <div><h1 style="font-size:22px">${c.full_name}</h1><p>${c.subscription} — انضم ${c.joined}</p></div>
    </div>
  </div>
  <div class="tabs">
    <button class="tab-btn active" data-tab="t1" onclick="switchTab(this,'t1')">نظرة عامة</button>
    <button class="tab-btn" data-tab="t2" onclick="switchTab(this,'t2')">بيانات InBody والتحليل</button>
    <button class="tab-btn" data-tab="t3" onclick="switchTab(this,'t3')">التمارين المخصصة</button>
    <button class="tab-btn" data-tab="t4" onclick="switchTab(this,'t4')">النظام الغذائي</button>
    <button class="tab-btn" style="color:var(--cyan)" data-tab="t6" onclick="switchTab(this,'t6')">التحليلات المتقدمة</button>
    <button class="tab-btn" style="color:var(--coral)" data-tab="t5" onclick="switchTab(this,'t5')">إعدادات الحساب</button>
  </div>

  <div class="tab-panel active" id="t1">
    <div class="grid grid-3">
      <div class="card"><div class="stat-label">الوزن الحالي</div><div class="stat-num" style="font-size:22px">${c.weight} كجم</div></div>
      <div class="card"><div class="stat-label">تليفون</div><div class="stat-num" style="font-size:22px">${c.phone || 'غير مسجل'}</div></div>
      <div class="card"><div class="stat-label">نسبة الدهون</div><div class="stat-num" style="font-size:22px">${c.body_fat}%</div></div>
    </div>
  </div>

  <div class="tab-panel" id="t2">
    ${renderInBodyDashboard(history)}
  </div>

  <div class="tab-panel" id="t6">
    <div class="section-title">لوحة التحليلات المتقدمة <span>الرسوم البيانية</span></div>
    ${renderAnalyticsDashboard(history)}
  </div>

  <div class="tab-panel" id="t3">
    <div class="section-title">التمارين المخصصة <span></span></div>
    <div style="padding: 20px; color: var(--text-dim)">(جاري ربط نظام التمارين بالداتابيز)</div>
  </div>

  <div class="tab-panel" id="t4">
    <div class="section-title">النظام الغذائي <span>الخطة الحالية</span></div>
    ${nutritionHtml}
  </div>

  <div class="tab-panel" id="t5">
    <div class="section-title">إدارة الحساب <span>${c.username}</span></div>
    
    <div class="card" style="margin-bottom:16px">
      <b style="font-size:16px;display:block;margin-bottom:15px;color:var(--lime)">المعلومات التعريفية</b>
      <div class="field" style="margin-bottom:12px"><label>الاسم بالكامل</label><input type="text" id="editClientName" value="${c.full_name}" class="settings-input" style="width:100%"></div>
      <div class="field" style="margin-bottom:12px"><label>رقم التليفون</label><input type="text" id="editClientPhone" value="${c.phone || ''}" class="settings-input" style="width:100%"></div>
      <div class="field" style="margin-bottom:12px"><label>الطول (سم)</label><input type="number" id="editClientHeight" value="${c.height}" class="settings-input" style="width:100%"></div>
      <div class="field" style="margin-bottom:12px"><label>العمر (سنة)</label><input type="number" id="editClientAge" value="${c.age}" class="settings-input" style="width:100%"></div>
      <button class="btn btn-primary" style="width:100%;margin-top:10px" onclick="updateClientProfile()">حفظ المعلومات</button>
    </div>

    <div class="card" style="margin-bottom:16px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:15px">
        <div>
          <b style="font-size:16px">حالة الحساب: ${c.is_active ? '<span style="color:var(--lime)">مفعل نشط</span>' : '<span style="color:var(--coral)">موقوف مؤقتاً</span>'}</b>
          <div class="stat-sub" style="margin-top:4px">لما توقف الحساب، العميل مش هيقدر يدخل للتطبيق.</div>
        </div>
        <button class="btn btn-ghost" style="color:${c.is_active ? 'var(--coral)' : 'var(--lime)'}" onclick="toggleClientActive()">${c.is_active ? 'إيقاف الحساب' : 'تفعيل الحساب'}</button>
      </div>
      <hr style="border:none;border-top:1px solid var(--border);margin:15px 0">
      <div style="margin-bottom:15px">
        <b style="font-size:16px;display:block;margin-bottom:8px">تغيير كلمة السر</b>
        <div style="display:flex;gap:10px">
          <input type="text" id="newClientPwd" placeholder="اكتب الباسورد الجديد هنا..." style="flex:1;background:var(--surface-3);border:none;border-radius:8px;padding:0 12px;color:var(--text)">
          <button class="btn btn-primary" onclick="changeClientPassword()">تحديث</button>
        </div>
      </div>
    </div>
    
    <div class="section-title" style="color:var(--coral)">منطقة الخطر (Danger Zone)</div>
    <div class="card" style="border:1px solid var(--coral);background:rgba(255,107,107,0.05)">
      <b style="font-size:16px;color:var(--coral)">حذف العميل نهائياً</b>
      <div class="stat-sub" style="margin-top:4px;margin-bottom:15px;color:var(--text-dim)">الحذف هيمسح كل بيانات العميل وتطوره ورسايله، ومش هتقدر ترجعها تاني.</div>
      <button class="btn btn-primary" style="background:var(--coral);color:#fff" onclick="deleteClient()">حذف الحساب نهائياً</button>
    </div>
  </div>
`;
}

async function toggleClientActive() {
  if(!window.currentClientId) return;
  try {
    await apiFetch('/admin/clients/' + window.currentClientId + '/toggle-active', { method: 'POST' });
    toast('تم تغيير حالة الحساب');
    goView('a-client-detail'); // Refresh view
  } catch(e) {
    toast('❌ ' + e.message);
  }
}

async function changeClientPassword() {
  if(!window.currentClientId) return;
  const pwd = document.getElementById('newClientPwd').value.trim();
  if(!pwd) { toast('اكتب الباسورد الأول'); return; }
  
  try {
    await apiFetch('/admin/clients/' + window.currentClientId + '/password', {
      method: 'PUT',
      body: JSON.stringify({ new_password: pwd })
    });
    document.getElementById('newClientPwd').value = '';
    toast('✅ تم تغيير الباسورد بنجاح');
  } catch(e) {
    toast('❌ ' + e.message);
  }
}

async function updateClientProfile() {
  if(!window.currentClientId) return;
  const name = document.getElementById('editClientName').value.trim();
  const phone = document.getElementById('editClientPhone').value.trim();
  const height = document.getElementById('editClientHeight').value.trim();
  const age = document.getElementById('editClientAge').value.trim();
  
  try {
    await apiFetch('/admin/clients/' + window.currentClientId + '/profile', {
      method: 'PUT',
      body: JSON.stringify({
        full_name: name,
        phone: phone,
        height: height ? parseFloat(height) : null,
        age: age ? parseInt(age) : null
      })
    });
    toast('✅ تم تحديث المعلومات بنجاح');
    goView('a-client-detail');
  } catch(e) {
    toast('❌ ' + e.message);
  }
}

async function deleteClient() {
  if(!window.currentClientId) return;
  if(!confirm('متأكد إنك عايز تمسح العميل ده؟ كل بياناته هتطير!')) return;
  
  try {
    await apiFetch('/admin/clients/' + window.currentClientId, { method: 'DELETE' });
    toast('تم مسح العميل بنجاح');
    window.currentClientId = null;
    goView('a-clients'); // Go back to list
  } catch(e) {
    toast('❌ ' + e.message);
  }
}
function switchTab(btn, id){
  btn.parentElement.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  btn.closest('.content').querySelectorAll('.tab-panel').forEach(p=>p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

/* ---- Admin Exercise Library ---- */
views['a-library'] = async () => {
  const exercises = await apiFetch('/admin/exercises');
  return `
  <div class="page-head" style="display:flex;justify-content:space-between;align-items:flex-end;">
    <div><h1>مكتبة التمارين</h1><p>التمارين المتوفرة في قاعدة البيانات</p></div>
    <button class="btn btn-primary" onclick="toast('📤 الميزة دي لسه هتشتغل قريباً')">+ رفع تمرين جديد</button>
  </div>
  <div class="grid grid-4">
    ${exercises.length > 0 ? exercises.map(ex=>`
      <div class="card ex-card">
        <div class="ex-thumb" style="background:#222;display:flex;align-items:center;justify-content:center"><span class="tag">${ex.muscle_group}</span><div class="play" style="opacity:0.5">▶</div><span class="gif-lbl">${ex.difficulty}</span></div>
        <div class="ex-info"><div class="ex-name">${ex.name}</div><div class="ex-meta">دوس لتعيينه لعميل</div></div>
      </div>`).join('') : '<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text-dim)">مفيش تمارين مضافة لسه</div>'}
  </div>
  `;
}

/* ---- Admin Food Library ---- */
views['a-foods'] = async () => {
  const foods = await apiFetch('/admin/nutrition/foods');
  return `
  <div class="page-head" style="display:flex;justify-content:space-between;align-items:flex-end;">
    <div><h1>قاعدة التغذية</h1><p>${foods.length} صنف متاح في قاعدة البيانات</p></div>
    <button class="btn btn-primary" onclick="openFoodModal()">+ إضافة صنف جديد</button>
  </div>
  <div class="card" style="padding:0; overflow-x:auto;">
    <table style="width:100%; border-collapse:collapse; text-align:right;">
      <thead>
        <tr style="border-bottom:1px solid var(--surface-3); color:var(--text-dim);">
          <th style="padding:15px">الصنف</th>
          <th style="padding:15px">التصنيف</th>
          <th style="padding:15px">السعرات</th>
          <th style="padding:15px">البروتين (g)</th>
          <th style="padding:15px">الكارب (g)</th>
          <th style="padding:15px">الدهون (g)</th>
          <th style="padding:15px;text-align:left;">الإجراءات</th>
        </tr>
      </thead>
      <tbody>
        ${foods.length > 0 ? foods.map(f=>`
          <tr style="border-bottom:1px solid var(--surface-3);">
            <td style="padding:15px; font-weight:bold;">${f.name}</td>
            <td style="padding:15px; color:var(--text-dim);">${f.category || '-'}</td>
            <td style="padding:15px; color:var(--lime); font-weight:bold;">${f.calories}</td>
            <td style="padding:15px">${f.protein}</td>
            <td style="padding:15px">${f.carbs}</td>
            <td style="padding:15px">${f.fats}</td>
            <td style="padding:15px;text-align:left;">
              <button class="btn btn-icon" style="background:var(--surface-3); margin-left:5px;" onclick='editFoodItem(${JSON.stringify(f).replace(/'/g, "&apos;")})'>✏️</button>
              <button class="btn btn-icon" style="background:var(--coral); color:#fff;" onclick="deleteFoodItem(${f.id})">🗑️</button>
            </td>
          </tr>
        `).join('') : '<tr><td colspan="7" style="text-align:center;padding:30px;color:var(--text-dim);">لا توجد أصناف</td></tr>'}
      </tbody>
    </table>
  </div>
  `;
}

// Food CRUD Logic
let editingFoodId = null;
function openFoodModal() {
  editingFoodId = null;
  document.getElementById('foodModalTitle').innerText = 'إضافة صنف جديد';
  document.getElementById('fName').value = '';
  document.getElementById('fCategory').value = '';
  document.getElementById('fCalories').value = '';
  document.getElementById('fProtein').value = '';
  document.getElementById('fCarbs').value = '';
  document.getElementById('fFats').value = '';
  document.getElementById('foodModal').classList.add('show');
}
function closeFoodModal() {
  document.getElementById('foodModal').classList.remove('show');
}
function editFoodItem(f) {
  editingFoodId = f.id;
  document.getElementById('foodModalTitle').innerText = 'تعديل الصنف';
  document.getElementById('fName').value = f.name;
  document.getElementById('fCategory').value = f.category || '';
  document.getElementById('fCalories').value = f.calories;
  document.getElementById('fProtein').value = f.protein;
  document.getElementById('fCarbs').value = f.carbs;
  document.getElementById('fFats').value = f.fats;
  document.getElementById('foodModal').classList.add('show');
}
async function saveFoodItem() {
  const data = {
    name: document.getElementById('fName').value.trim(),
    category: document.getElementById('fCategory').value.trim() || null,
    calories: parseFloat(document.getElementById('fCalories').value) || 0,
    protein: parseFloat(document.getElementById('fProtein').value) || 0,
    carbs: parseFloat(document.getElementById('fCarbs').value) || 0,
    fats: parseFloat(document.getElementById('fFats').value) || 0,
  };
  if(!data.name) return toast('يرجى كتابة اسم الصنف!');
  
  try {
    if(editingFoodId) {
      await apiFetch('/admin/nutrition/foods/' + editingFoodId, { method: 'PUT', body: JSON.stringify(data) });
      toast('✅ تم تعديل الصنف');
    } else {
      await apiFetch('/admin/nutrition/foods', { method: 'POST', body: JSON.stringify(data) });
      toast('✅ تمت إضافة الصنف');
    }
    closeFoodModal();
    goView('a-foods');
  } catch(e) {
    toast('❌ خطأ: ' + e.message);
  }
}

// Custom Confirm Modal
let confirmCallback = null;
function showConfirm(msg, onConfirm) {
  document.getElementById('confirmModalText').innerText = msg;
  confirmCallback = onConfirm;
  document.getElementById('confirmModalBtn').onclick = () => {
    const cb = confirmCallback;
    closeConfirmModal();
    if(cb) cb();
  };
  document.getElementById('confirmModal').classList.add('show');
}
function closeConfirmModal() {
  document.getElementById('confirmModal').classList.remove('show');
  confirmCallback = null;
}

function deleteFoodItem(id) {
  showConfirm('هل أنت متأكد من حذف هذا الصنف نهائياً؟', async () => {
    try {
      await apiFetch('/admin/nutrition/foods/' + id, { method: 'DELETE' });
      toast('✅ تم الحذف');
      goView('a-foods');
    } catch(e) {
      toast('❌ خطأ: ' + e.message);
    }
  });
}

/* ---- Admin AI Nutrition Generator ---- */
/* ---- AI Nutrition Plan Generator ---- */
views['a-ai'] = async () => {
  const clients = await apiFetch('/admin/clients');
  const pendingPlans = await apiFetch('/admin/plans/pending');
  
  let pendingHtml = '';
  if (pendingPlans && pendingPlans.length > 0) {
    pendingHtml = `
    <div class="card" style="margin-bottom:20px; border:1px solid var(--gold); background:rgba(255, 200, 0, 0.05)">
      <h3 style="color:var(--gold); margin-bottom:15px">⏳ أنظمة بانتظار المراجعة (${pendingPlans.length})</h3>
      <div style="display:flex; flex-direction:column; gap:10px">
        ${pendingPlans.map(p => `
          <div style="display:flex; justify-content:space-between; align-items:center; padding:12px; background:var(--surface-2); border-radius:8px; border:1px solid var(--border)">
            <div>
              <b>${p.client_name}</b> <span style="font-size:12px; color:var(--text-dim); margin-right:10px">${p.created_at}</span>
              <div style="font-size:12px; color:var(--text-dim); margin-top:4px">الهدف: ${p.goal} | ${p.daily_calories} سعرة</div>
            </div>
            <div>
              <button class="btn btn-ghost" style="color:var(--lime); padding:6px 12px; font-size:12px" onclick="reviewPlan(${p.id})">مراجعة</button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>`;
  }

  return `
  <div class="page-head">
    <h1>توليد نظام غذائي بالـ AI 🤖🥗</h1>
    <p>بناء أنظمة غذائية ذكية للعملاء باستخدام الأطعمة المتاحة في قاعدة البيانات فقط</p>
  </div>
  
  ${pendingHtml}
  
  <div class="card" style="padding:30px; position:relative">
    <h3 style="margin-bottom:20px">توليد نظام جديد</h3>
    
    <div class="grid grid-2" style="gap:20px; margin-bottom:20px">
      <div class="field">
        <label>اختيار العميل</label>
        <select id="aiClientSelect" class="settings-input" style="width:100%; height:45px">
          <option value="">-- اختر العميل --</option>
          ${clients.map(c => `<option value="${c.id}">${c.full_name}</option>`).join('')}
        </select>
        <p style="font-size:11px; color:var(--text-dim); margin-top:5px">سيقوم الـ AI بقراءة بيانات العميل ونتائج آخر InBody لتحديد السعرات.</p>
      </div>
      <div class="field">
        <label>الهدف من النظام</label>
        <select id="aiGoalSelect" class="settings-input" style="width:100%; height:45px">
          <option value="تنشيف وحرق دهون">تنشيف وحرق دهون</option>
          <option value="تضخيم وزيادة عضلات">تضخيم وزيادة عضلات</option>
          <option value="لياقة وتثبيت الوزن">لياقة وتثبيت الوزن</option>
        </select>
      </div>
    </div>
    
    <button class="btn btn-primary" style="width:100%; height:50px; font-size:16px; display:flex; justify-content:center; align-items:center; gap:10px" onclick="generateAiPlan()" id="btnGenerate">
      <span>✨</span> توليد النظام الغذائي
    </button>
    
    <!-- Loading Overlay -->
    <div id="aiLoadingOverlay" style="display:none; position:absolute; top:0; left:0; width:100%; height:100%; background:rgba(18,18,18,0.9); z-index:10; border-radius:15px; flex-direction:column; justify-content:center; align-items:center; text-align:center">
      <div class="pulse-dot" style="width:20px; height:20px; margin-bottom:20px"></div>
      <h3 style="color:var(--lime); margin-bottom:10px">جاري بناء النظام الغذائي...</h3>
      <p style="color:var(--text-dim); font-size:13px; max-width:300px">يقوم الذكاء الاصطناعي الآن بدمج أصناف الطعام المتاحة وتوزيع السعرات بناءً على بيانات العميل وهدفه.</p>
    </div>
  </div>

  <div id="aiResultContainer" style="display:none; margin-top:30px">
    <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:20px">
      <h2 style="color:var(--gold)">النظام المقترح</h2>
      <div style="display:flex; gap:10px">
        <button class="btn btn-ghost" style="color:var(--coral)" onclick="rejectAiPlan()">رفض النظام</button>
        <button class="btn btn-primary" onclick="approveAiPlan()">اعتماد وإرسال للعميل</button>
      </div>
    </div>
    
    <!-- Plan Review Area -->
    <div id="planReviewArea"></div>
  </div>
  `;
};

let currentPendingPlanId = null;

async function generateAiPlan() {
  const clientId = document.getElementById('aiClientSelect').value;
  const goal = document.getElementById('aiGoalSelect').value;
  
  if (!clientId) {
    showNotification('يرجى اختيار العميل أولاً', 'error');
    return;
  }
  
  document.getElementById('aiLoadingOverlay').style.display = 'flex';
  document.getElementById('aiResultContainer').style.display = 'none';
  document.getElementById('btnGenerate').disabled = true;
  
  try {
    const res = await apiFetch('/ai/generate-plan', 'POST', {
      client_id: parseInt(clientId),
      goal: goal
    });
    
    currentPendingPlanId = res.plan_id;
    
    // Auto load the plan for review
    await reviewPlan(res.plan_id);
    showNotification('تم توليد النظام بنجاح!');
    
  } catch (err) {
    showNotification(err.message || 'حدث خطأ أثناء التوليد', 'error');
  } finally {
    document.getElementById('aiLoadingOverlay').style.display = 'none';
    document.getElementById('btnGenerate').disabled = false;
  }
}

async function reviewPlan(planId) {
  try {
    const plan = await apiFetch(`/admin/plans/${planId}`);
    currentPendingPlanId = plan.id;
    
    let mealsHtml = plan.meals.map(m => `
      <div class="card" style="margin-bottom:15px; border-left:4px solid var(--lime)">
        <div style="display:flex; justify-content:space-between; margin-bottom:10px">
          <h4 style="color:var(--lime)">${m.name}</h4>
          <span class="tag" style="background:rgba(204,255,0,0.1); color:var(--lime)">${m.calories} سعرة</span>
        </div>
        <div style="color:var(--text); line-height:1.6; font-size:14px">
          ${m.items.split('+').map(item => `<div style="padding-left:15px; position:relative"><span style="position:absolute; right:0; top:0; color:var(--gold)">•</span> ${item.trim()}</div>`).join('')}
        </div>
      </div>
    `).join('');
    
    document.getElementById('planReviewArea').innerHTML = `
      <div class="grid grid-3" style="gap:15px; margin-bottom:20px">
        <div class="card" style="padding:15px; text-align:center">
          <div style="font-size:12px; color:var(--text-dim)">العميل</div>
          <b style="font-size:16px">${plan.client_name}</b>
        </div>
        <div class="card" style="padding:15px; text-align:center">
          <div style="font-size:12px; color:var(--text-dim)">الهدف</div>
          <b style="font-size:16px; color:var(--cyan)">${plan.goal}</b>
        </div>
        <div class="card" style="padding:15px; text-align:center">
          <div style="font-size:12px; color:var(--text-dim)">السعرات</div>
          <b style="font-size:16px; color:var(--lime)">${plan.daily_calories} kcal</b>
        </div>
      </div>
      
      <div style="margin-top:20px">
        <h3 style="margin-bottom:15px">الوجبات المقترحة</h3>
        ${mealsHtml}
      </div>
    `;
    
    document.getElementById('aiResultContainer').style.display = 'block';
    // Scroll to it
    document.getElementById('aiResultContainer').scrollIntoView({behavior: 'smooth'});
    
  } catch (err) {
    showNotification('حدث خطأ أثناء جلب النظام', 'error');
  }
}

async function approveAiPlan() {
  if (!currentPendingPlanId) return;
  try {
    await apiFetch(`/admin/plans/${currentPendingPlanId}/approve`, 'PUT');
    showNotification('تم اعتماد النظام وإرساله للعميل بنجاح');
    document.getElementById('aiResultContainer').style.display = 'none';
    currentPendingPlanId = null;
    goView('a-ai'); // refresh
  } catch (err) {
    showNotification(err.message, 'error');
  }
}

async function rejectAiPlan() {
  if (!currentPendingPlanId) return;
  if (!confirm('هل أنت متأكد من رفض وحذف هذا النظام؟')) return;
  
  try {
    await apiFetch(`/admin/plans/${currentPendingPlanId}`, 'DELETE');
    showNotification('تم رفض النظام وحذفه');
    document.getElementById('aiResultContainer').style.display = 'none';
    currentPendingPlanId = null;
    goView('a-ai'); // refresh
  } catch (err) {
    showNotification(err.message, 'error');
  }
}

/* ---- Admin InBody OCR ---- */
views['a-inbody'] = async () => {
  const clients = await apiFetch('/admin/clients');
  return `
  <div class="page-head"><h1>قراءة InBody بالذكاء الاصطناعي</h1><p>ارفع صورة التقرير والـ AI هيستخرج الأرقام المهيكلة تلقائياً</p></div>
  
  <div class="card" style="text-align:center; padding:40px 20px; border: 2px dashed var(--border); background: var(--surface-2); position:relative" id="dropZone">
    <div style="font-size:40px; margin-bottom:10px;">📤</div>
    <h3 style="color:var(--text); margin-bottom:10px;">ارفع صورة تقرير InBody</h3>
    <p style="color:var(--text-dim); margin-bottom:20px;">اسحب الصورة هنا أو اضغط للاختيار</p>
    <input type="file" id="inbodyFile" accept="image/*" style="display:none" onchange="handleInbodyUpload(this.files[0])">
    <button class="btn btn-primary" onclick="document.getElementById('inbodyFile').click()">اختيار صورة</button>
    <div id="scanline" style="position:absolute; top:0; left:0; width:100%; height:4px; background:var(--lime); box-shadow:0 0 10px var(--lime); opacity:0; transition:0.3s; transform:translateY(-10px);"></div>
  </div>

  <div id="ocrLoading" style="display:none; text-align:center; padding:30px; color:var(--lime); font-weight:bold; font-size:16px;">
    <span class="pulse-dot" style="display:inline-block; margin-left:10px;"></span> جاري تحليل التقرير واستخراج الأرقام بالذكاء الاصطناعي...
  </div>

  <div id="ocrResult" style="display:none; margin-top:20px;">
    <div style="margin-bottom:15px; color:var(--text-dim); font-size:14px;" id="ocrStatusMsg"></div>
    <div class="grid grid-2">
      <div class="card">
        <h3 style="margin-bottom:15px; color:var(--lime)">البيانات التعريفية</h3>
        <div class="field" style="margin-bottom:10px"><label>الاسم</label><div class="settings-input" style="width:100%" id="rName"></div></div>
        <div class="grid grid-2" style="gap:10px">
          <div class="field"><label>تاريخ الفحص</label><div class="settings-input" style="width:100%" id="rDate"></div></div>
          <div class="field"><label>النوع</label><div class="settings-input" style="width:100%" id="rGender"></div></div>
        </div>
        <div class="grid grid-2" style="gap:10px; margin-top:10px">
          <div class="field"><label>الطول (سم)</label><div class="settings-input" style="width:100%" id="rHeight"></div></div>
          <div class="field"><label>العمر (سنة)</label><input type="number" class="settings-input" style="width:100%; border:1px solid var(--lime)" id="rAge"></div>
        </div>
      </div>
      <div class="card">
        <h3 style="margin-bottom:15px; color:var(--gold)">القياسات الحيوية (Body Metrics)</h3>
        <div class="grid grid-2" style="gap:10px">
          <div class="field"><label>الوزن (kg)</label><div class="settings-input" style="width:100%; font-weight:bold" id="rWeight"></div></div>
          <div class="field"><label>مؤشر الكتلة (BMI)</label><div class="settings-input" style="width:100%; font-weight:bold" id="rBmi"></div></div>
          <div class="field"><label>نسبة الدهون (TBF%)</label><div class="settings-input" style="width:100%; color:var(--coral); font-weight:bold" id="rTbf"></div></div>
          <div class="field"><label>العضلات الهيكلية (SM%)</label><div class="settings-input" style="width:100%; font-weight:bold" id="rSm"></div></div>
          <div class="field"><label>الدهون الحشوية (VFI)</label><div class="settings-input" style="width:100%; color:var(--coral)" id="rVfi"></div></div>
          <div class="field"><label>الكتلة بدون دهون (FFM)</label><div class="settings-input" style="width:100%" id="rFfm"></div></div>
          <div class="field"><label>كتلة الدهون (FM)</label><div class="settings-input" style="width:100%" id="rFm"></div></div>
          <div class="field"><label>نسبة المياه (TBW%)</label><div class="settings-input" style="width:100%; color:var(--cyan)" id="rTbw"></div></div>
        </div>
      </div>
      <div class="card">
        <h3 style="margin-bottom:15px; color:var(--cyan)">المعدلات الأيضية والسعرات</h3>
        <div class="grid grid-2" style="gap:10px">
          <div class="field"><label>معدل الحرق (BMR)</label><div class="settings-input" style="width:100%" id="rBmr"></div></div>
          <div class="field"><label>السعرات المقترحة</label><div class="settings-input" style="width:100%; font-weight:bold; color:var(--lime)" id="rIntake"></div></div>
          <div class="field"><label>التقييم الإجمالي</label><div class="settings-input" style="width:100%" id="rScore"></div></div>
          <div class="field"><label>العمر الحيوي</label><div class="settings-input" style="width:100%" id="rBioAge"></div></div>
        </div>
      </div>
      <div class="card">
        <h3 style="margin-bottom:15px; color:var(--text)">نصائح التحكم في الوزن</h3>
        <div class="field" style="margin-bottom:10px"><label>الوزن المستهدف تخفيضه</label><div class="settings-input" style="width:100%; color:var(--coral)" id="rcWeight"></div></div>
        <div class="field" style="margin-bottom:10px"><label>الدهون المطلوب تخفيضها</label><div class="settings-input" style="width:100%; color:var(--coral)" id="rcFat"></div></div>
        <div class="field" style="margin-bottom:10px"><label>العضلات المطلوب زيادتها</label><div class="settings-input" style="width:100%; color:var(--lime)" id="rcMuscle"></div></div>
        <div class="field"><label>المياه المطلوب زيادتها</label><div class="settings-input" style="width:100%; color:var(--cyan)" id="rcWater"></div></div>
      </div>
    </div>
    
    <div class="card" style="margin-top:20px; background:var(--surface-2); border:1px solid var(--border)">
      <h3 style="margin-bottom:15px">حفظ واعتماد القراءة</h3>
      <p style="color:var(--text-dim); margin-bottom:15px">اختر العميل لربط هذه القراءة بملفه الشخصي وتحديث بياناته.</p>
      <div style="display:flex; gap:10px; align-items:flex-end;">
        <div class="field" style="flex:1; margin-bottom:0">
          <label>اسم العميل</label>
          <select id="ocrClientSelect" class="settings-input" style="width:100%; height:42px;">
            <option value="">-- اختر العميل --</option>
            ${clients.map(c => `<option value="${c.id}">${c.full_name}</option>`).join('')}
          </select>
        </div>
        <button class="btn btn-primary" style="height:42px; padding:0 30px" onclick="saveOcrData()">حفظ في ملف العميل</button>
      </div>
      <hr style="border-top:1px dashed var(--border); margin:20px 0;">
      <div style="text-align:center;">
        <p style="color:var(--text-dim); margin-bottom:10px; font-size:14px">أو لو ده عميل جديد لسه مش مسجل في السيستم؟</p>
        <button class="btn" style="border:1px solid var(--lime); color:var(--lime); background:transparent" onclick="quickCreateClientFromOcr()">+ تسجيل كعميل جديد وإنشاء حساب فوراً</button>
      </div>
    </div>
  </div>
  
  <div class="modal-bg" id="ocrModalBg">
    <div class="modal" id="ocrModalBody" style="background:var(--surface); padding:20px;"></div>
  </div>
`;
}

async function handleInbodyUpload(file) {
  if(!file) return;
  document.getElementById('ocrResult').style.display = 'none';
  document.getElementById('ocrLoading').style.display = 'block';
  
  const scanline = document.getElementById('scanline');
  scanline.style.opacity = 1;
  scanline.style.animation = 'scan 2s infinite ease-in-out alternate';

  const formData = new FormData();
  formData.append('file', file);
  
  const token = localStorage.getItem('token');
  try {
    const res = await fetch(API_BASE + '/ai/inbody-ocr', {
      method: 'POST',
      headers: { ...(token ? {'Authorization': `Bearer ${token}`} : {}) },
      body: formData
    });
    const data = await res.json();
    if(!res.ok) throw new Error(data.detail || 'حدث خطأ أثناء تحليل الصورة');
    
    // Store data globally for saving later
    window.currentOcrData = data;
    
    // Fill data
    document.getElementById('rName').innerText = data.profile.name;
    document.getElementById('rDate').innerText = data.profile.date;
    document.getElementById('rHeight').innerText = data.profile.height;
    document.getElementById('rAge').value = data.profile.age; // Input field so trainer can edit it
    document.getElementById('rGender').innerText = data.profile.gender;
    
    document.getElementById('rWeight').innerText = data.metrics.weight;
    document.getElementById('rBmi').innerText = data.metrics.bmi;
    document.getElementById('rTbf').innerText = data.metrics.tbf_percent + '%';
    document.getElementById('rSm').innerText = data.metrics.sm_percent + '%';
    document.getElementById('rVfi').innerText = data.metrics.vfi;
    document.getElementById('rFfm').innerText = data.metrics.ffm + ' kg';
    document.getElementById('rFm').innerText = data.metrics.fm + ' kg';
    document.getElementById('rTbw').innerText = data.metrics.tbw_percent + '%';
    
    document.getElementById('rBmr').innerText = data.metabolism.bmr;
    document.getElementById('rIntake').innerText = data.metabolism.recommended_intake;
    document.getElementById('rScore').innerText = data.metabolism.total_score + ' / 100';
    document.getElementById('rBioAge').innerText = data.metabolism.bio_age;
    
    document.getElementById('rcWeight').innerText = data.weight_control.reduce_weight;
    document.getElementById('rcFat').innerText = data.weight_control.reduce_fat;
    document.getElementById('rcMuscle').innerText = data.weight_control.increase_muscle;
    document.getElementById('rcWater').innerText = data.weight_control.increase_water;
    
    const msg = data.is_mock ? '⚠️ تم عرض بيانات افتراضية للتجربة (يجب إضافة مفتاح Gemini في السيرفر)' : '✅ تم سحب البيانات بنجاح من الصورة بواسطة الذكاء الاصطناعي.';
    document.getElementById('ocrStatusMsg').innerHTML = msg;
    
    document.getElementById('ocrResult').style.display = 'block';
  } catch (e) {
    toast('❌ ' + e.message);
  } finally {
    document.getElementById('ocrLoading').style.display = 'none';
    scanline.style.opacity = 0;
    scanline.style.animation = '';
    document.getElementById('inbodyFile').value = '';
  }
}

async function saveOcrData() {
  if (!window.currentOcrData) return toast('❌ لا توجد بيانات لحفظها');
  const clientId = document.getElementById('ocrClientSelect').value;
  if (!clientId) return toast('❌ الرجاء اختيار العميل أولاً');
  
  // Update from UI in case trainer edited them
  window.currentOcrData.profile.age = document.getElementById('rAge').value;
  window.currentOcrData.profile.height = document.getElementById('rHeight').innerText;

  try {
    const res = await apiFetch('/inbody/save', {
      method: 'POST',
      body: JSON.stringify({
        user_id: parseInt(clientId),
        ocr_data: window.currentOcrData
      })
    });
    toast('✅ ' + res.message);
    document.getElementById('ocrResult').style.display = 'none';
    document.getElementById('ocrStatusMsg').innerHTML = '';
    window.currentOcrData = null;
  } catch(e) {
    toast('❌ خطأ في الحفظ: ' + e.message);
  }
}

function quickCreateClientFromOcr() {
  if (!window.currentOcrData) return toast('❌ لا توجد بيانات لحفظها');
  
  const msg = `
    <div style="text-align:center; padding:10px 0">
      <div style="font-size:50px; margin-bottom:15px">👤✨</div>
      <h3 style="color:var(--text); margin-bottom:15px; font-size:20px">تأكيد إنشاء حساب جديد</h3>
      <p style="color:var(--text-dim); margin-bottom:25px; line-height:1.6">
        هل أنت متأكد من رغبتك في إنشاء حساب جديد للعميل <b style="color:var(--lime)">${window.currentOcrData.profile.name}</b> بناءً على قراءة الـ InBody المرفوعة؟
      </p>
      <div style="display:flex; gap:10px; justify-content:center">
        <button class="btn" style="flex:1; border:1px solid var(--border); color:var(--text); background:transparent" onclick="closeModal()">إلغاء</button>
        <button class="btn btn-primary" style="flex:1" onclick="executeQuickCreateClientFromOcr()">نعم، إنشاء الحساب</button>
      </div>
    </div>
  `;
  document.getElementById('ocrModalBody').innerHTML = msg;
  document.getElementById('ocrModalBg').classList.add('show');
}

function closeOcrModal() {
  document.getElementById('ocrModalBg').classList.remove('show');
}

async function executeQuickCreateClientFromOcr() {
  try {
    // Update from UI in case trainer edited them
    if (window.currentOcrData && window.currentOcrData.profile) {
      window.currentOcrData.profile.age = document.getElementById('rAge').value;
      window.currentOcrData.profile.height = document.getElementById('rHeight').innerText;
    }

    // Show loading state in modal
    document.getElementById('ocrModalBody').innerHTML = '<div style="text-align:center; padding:30px"><span class="pulse-dot"></span><div style="margin-top:15px; color:var(--lime)">جاري إنشاء الحساب...</div></div>';
    
    const res = await apiFetch('/inbody/quick-create', {
      method: 'POST',
      body: JSON.stringify({
        ocr_data: window.currentOcrData
      })
    });
    
    // Show beautiful success modal with credentials
    const msg = `
      <div style="text-align:center; padding:10px 0">
        <div id="exportCard" style="background:var(--bg); padding:20px; border-radius:12px; border:2px solid var(--lime); margin-bottom:15px; text-align:center;">
          <div style="font-size:40px; margin-bottom:10px">🏋️</div>
          <h3 style="color:var(--lime); margin-bottom:10px; font-size:22px; font-family:'Cairo'">نادي FORM - Fitness OS</h3>
          <p style="color:var(--text); margin-bottom:15px; font-size:16px;">تم إنشاء حسابك بنجاح! 💪</p>
          <div style="background:var(--surface); padding:15px; border-radius:8px; border:1px solid var(--border); text-align:right">
            <div style="margin-bottom:10px; font-size:16px"><span style="color:var(--text-dim)">اسم العميل:</span> <b style="color:var(--text);">${res.full_name || 'عميل جديد'}</b></div>
            <div style="margin-bottom:10px; font-size:16px"><span style="color:var(--text-dim)">اسم المستخدم:</span> <b style="color:var(--text); letter-spacing:1px">${res.username}</b></div>
            <div style="font-size:16px"><span style="color:var(--text-dim)">كلمة المرور:</span> <b style="color:var(--text); letter-spacing:1px">${res.password}</b></div>
          </div>
          <p style="color:var(--text-dimmer); font-size:12px; margin-top:15px;">احتفظ بهذه البيانات لتسجيل الدخول لمعرفة تطوراتك.</p>
        </div>
        
        <div style="display:flex; gap:10px; justify-content:center; margin-bottom:15px">
          <button class="btn" style="flex:1; border:1px solid var(--lime); color:var(--lime); background:transparent" onclick="downloadPdf('${res.username}')">📄 حفظ PDF</button>
          <button class="btn btn-primary" style="flex:1; background:var(--steel); color:#fff" onclick="shareCredentials('${res.full_name}', '${res.username}', '${res.password}')">📤 مشاركة</button>
        </div>
        
        <button class="btn btn-ghost" style="width:100%" onclick="closeOcrModal()">إغلاق</button>
      </div>
    `;
    
    document.getElementById('ocrModalBody').innerHTML = msg;
    
    document.getElementById('ocrResult').style.display = 'none';
    document.getElementById('ocrStatusMsg').innerHTML = '';
    window.currentOcrData = null;
    
  } catch(e) {
    closeOcrModal();
    toast('❌ خطأ في الإنشاء: ' + e.message);
  }
}

function downloadPdf(username) {
  const element = document.getElementById('exportCard');
  const opt = {
    margin:       10,
    filename:     `FORM_${username}_credentials.pdf`,
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2, backgroundColor: '#0d0e10' },
    jsPDF:        { unit: 'mm', format: 'a5', orientation: 'portrait' }
  };
  html2pdf().set(opt).from(element).save();
}

function shareCredentials(name, user, pass) {
  const text = `مرحباً بك في نادي FORM! 💪\nتم إنشاء حسابك بنجاح.\n\n👤 اسم المستخدم: ${user}\n🔑 كلمة المرور: ${pass}\n\nنرجو لك رحلة رياضية ممتعة، وتقدر تتابع تطوراتك من خلال التطبيق!`;
  
  if (navigator.share) {
    navigator.share({
      title: 'بيانات حساب FORM',
      text: text
    }).catch(console.error);
  } else {
    // Fallback to WhatsApp wa.me
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  }
}

/* ---- Admin Analytics ---- */
views['a-analytics'] = async () => {
  const data = await apiFetch('/admin/analytics');
  return `
  <div class="page-head"><h1>التحليلات الشاملة</h1><p>أداء الجيم والعملاء الفعلي</p></div>
  <div class="analytics-kpi">
    <div class="kpi-card"><div class="kpi-num">${data.total_clients}</div><div class="kpi-label">إجمالي العملاء</div><div class="kpi-sub" style="color:var(--text-dim)">مسجلين بالنظام</div></div>
    <div class="kpi-card"><div class="kpi-num">${data.adherence_rate}%</div><div class="kpi-label">معدل الالتزام</div><div class="kpi-sub" style="color:var(--text-dim)">جاري التجميع</div></div>
    <div class="kpi-card"><div class="kpi-num">${data.ai_plans_generated}</div><div class="kpi-label">أنظمة AI تم توليدها</div><div class="kpi-sub" style="color:var(--text-dim)">الأسبوع ده</div></div>
    <div class="kpi-card"><div class="kpi-num">${data.upcoming_renewals}</div><div class="kpi-label">تجديدات قادمة</div><div class="kpi-sub" style="color:var(--text-dim)">محتاجين تنبيه</div></div>
  </div>
  <div class="grid grid-2">
    <div class="card">
      <div class="section-title" style="margin-top:0">الحضور والتفاعل (أسبوعي)</div>
      <div style="padding:40px 20px;text-align:center;color:var(--text-dim)">لا توجد بيانات كافية لرسم المنحنى</div>
    </div>
    <div class="card">
      <div class="section-title" style="margin-top:0">أفضل العملاء (Leaderboard)</div>
      <div style="padding:40px 20px;text-align:center;color:var(--text-dim)">لا توجد بيانات كافية لحساب الترتيب</div>
    </div>
  </div>
`;
}

/* ---- Admin Settings ---- */
views['a-settings'] = ()=>`
  <div class="page-head"><h1>الإعدادات</h1><p>تحكم في إعدادات النظام والتطبيق</p></div>
  <div class="settings-section">
    <h3>إشعارات النظام</h3>
    <div class="setting-row">
      <div class="setting-info"><div class="setting-name">إشعارات تجديد الاشتراك</div><div class="setting-desc">إرسال تنبيه قبل الانتهاء بـ 3 أيام</div></div>
      <label class="toggle"><input type="checkbox" checked><div class="toggle-slider"></div></label>
    </div>
    <div class="setting-row">
      <div class="setting-info"><div class="setting-name">تنبيهات الانقطاع</div><div class="setting-desc">لو العميل مجاش بقاله أسبوع</div></div>
      <label class="toggle"><input type="checkbox" checked><div class="toggle-slider"></div></label>
    </div>
  </div>
  <div class="settings-section">
    <h3>تخصيص التطبيق</h3>
    <div class="setting-row">
      <div class="setting-info"><div class="setting-name">لون الـ Theme الأساسي</div></div>
      <input type="color" value="#c8ff3d" style="width:50px;height:30px;border:none;background:none;cursor:pointer">
    </div>
    <div class="setting-row">
      <div class="setting-info"><div class="setting-name">اسم الجيم / البراند</div></div>
      <input class="settings-input" value="FORM Fitness">
    </div>
  </div>
  <button class="btn btn-primary" onclick="toast('تم الحفظ بنجاح')">حفظ الإعدادات</button>
`;

/* ---- Admin AI Assistant ---- */
views['a-aichat'] = ()=>`
  <div class="page-head"><h1>مساعد المدرب الذكي</h1><p>اسأل عن أي حاجة تخص الجيم، التغذية، أو تحليلات عملائك</p></div>
  <div class="ai-quick-btns">
    <button class="ai-quick-btn" onclick="document.getElementById('aiChatInput').value='مين العملاء اللي اشتراكهم هيخلص الأسبوع ده؟';sendAiChat()">"مين العملاء اللي اشتراكهم هيخلص الأسبوع ده؟"</button>
    <button class="ai-quick-btn" onclick="document.getElementById('aiChatInput').value='لخصلّي أداء عمر حسن آخر شهر';sendAiChat()">"لخصلّي أداء عمر حسن آخر شهر"</button>
    <button class="ai-quick-btn" onclick="document.getElementById('aiChatInput').value='اكتبلي بوست تشجيعي للجروب';sendAiChat()">"اكتبلي بوست تشجيعي للجروب"</button>
  </div>
  <div class="ai-chat-wrap">
    <div class="ai-chat-head"><div class="ai-icon">${ic.spark}</div> مساعد FORM</div>
    <div class="ai-chat-body" id="aiChatBody">
      <div class="ai-bubble assistant">أهلاً يا كابتن! أنا مساعدك الذكي. أقدر أحلل بيانات العملاء، أقترح أنظمة، أو أجاوب على أي سؤال. محتاج مساعدة في إيه النهاردة؟</div>
    </div>
    <div class="ai-chat-input">
      <input id="aiChatInput" placeholder="اكتب سؤالك هنا...">
      <button class="btn btn-primary" onclick="sendAiChat()">إرسال</button>
    </div>
  </div>
`;

function sendAiChat(){
  const inp = document.getElementById('aiChatInput');
  const txt = inp.value.trim();
  if(!txt) return;
  const body = document.getElementById('aiChatBody');
  body.insertAdjacentHTML('beforeend', `<div class="ai-bubble user">${txt}</div>`);
  inp.value = '';
  body.scrollTop = body.scrollHeight;
  
  const tid = 'ai-t-'+Date.now();
  body.insertAdjacentHTML('beforeend', `<div class="ai-bubble thinking" id="${tid}">جاري التفكير...</div>`);
  body.scrollTop = body.scrollHeight;
  
  setTimeout(()=>{
    const el = document.getElementById(tid);
    el.classList.remove('thinking');
    el.classList.add('assistant');
    if(txt.includes('اشتراك')){
      el.innerHTML = 'عندك 3 عملاء اشتراكهم هيخلص الأسبوع ده:<br><br>1. سارة إبراهيم (الخميس)<br>2. كريم سعيد (الجمعة)<br>3. ياسمين طارق (السبت)<br><br>تحب أبعتلهم رسائل تذكير تلقائية؟';
    } else if(txt.includes('عمر')){
      el.innerHTML = 'عمر حسن أداؤه ممتاز جداً! 📈<br><br>- نسبة الالتزام: 95%<br>- فقد 2 كجم دهون وزاد 0.8 كجم عضل في آخر 30 يوم.<br>- آخر تمرين: اليوم (سكوات 40ث).<br><br>أنصحك ترفع له السعرات شوية عشان يحافظ على الكتلة العضلية.';
    } else {
      el.innerHTML = 'كلام جميل جداً. لو احتجت أي تحليل للبيانات أو مساعدة في تصميم الأنظمة أنا موجود في أي وقت.';
    }
    body.scrollTop = body.scrollHeight;
  }, 1500);
}


/* ================= USER VIEWS ================= */

/* ---- User Dashboard (Today's Workout) ---- */
views['u-dash'] = async () => {
  const data = await apiFetch('/workouts/today');
  
  if (!data.exercises || data.exercises.length === 0) {
    return `<div class="page-head"><h1>تمارين النهاردة</h1><p>مفيش تمارين مخصصة ليك النهاردة، تقدر تريح!</p></div>`;
  }
  
  return `
  <div class="page-head"><h1>تمارين النهاردة 🔥</h1><p>جاهز يا وحش؟ دي التمارين المطلوبة منك النهاردة (${data.plan_name})</p></div>
  <div class="grid grid-1" style="max-width:600px">
    ${data.exercises.map(ex => `
    <div class="card uex-card" onclick="window.currentExerciseId=${ex.id}; goView('u-ex-detail')">
      <div class="uex-thumb">▶</div>
      <div class="uex-info"><b>${ex.name}</b><div>${ex.sets} مجموعات × ${ex.reps} عدة</div></div>
      <div class="uex-status ${ex.status === 'اكتمل' ? 'done' : ''}">${ex.status === 'اكتمل' ? 'اكتمل ✅' : 'لم يبدأ'}</div>
    </div>
    `).join('')}
  </div>
  `;
}

/* ---- User Exercise Detail (Timer) ---- */
views['u-ex-detail'] = ()=>`
  <div class="page-head" style="display:flex; gap:10px; align-items:center">
    <button class="btn btn-ghost btn-sm" onclick="goView('u-dash')">🔙 رجوع</button>
    <div style="margin-right:10px"><h1>سكوات بالبار</h1><p>4 مجموعات × 12 عدة — ركز في النزول ببطء</p></div>
  </div>
  
  <div class="ex-detail-hero">
    <div style="background:rgba(0,0,0,.6); padding:10px 20px; border-radius:999px; font-weight:800; font-size:14px; position:absolute; bottom:20px;">
      🎥 فيديو توضيحي للتمرين (GIF)
    </div>
  </div>

  <div class="timer-box" style="max-width:400px; margin:0 auto">
    <div class="timer-num" id="restTimer">00:45</div>
    <div class="timer-status">وقت الراحة بين المجموعات</div>
    <div class="timer-actions">
      <button class="btn btn-ghost" onclick="resetTimer()">إعادة</button>
      <button class="btn btn-primary" style="flex:1" onclick="startTimer()" id="timerBtn">ابدأ الراحة</button>
    </div>
    <div style="margin-top:24px; text-align:center">
      <button class="btn btn-ghost" style="width:100%; border-color:var(--lime); color:var(--lime)" onclick="toast('✅ تم تسجيل المجموعة!'); resetTimer();">تأكيد إنهاء المجموعة</button>
    </div>
  </div>
`;

let tInterval;
let tLeft = 45;
function initFns_u_ex_detail(){ tLeft=45; updateTimerDisp(); }
function bindTimerless(){} // dummy
window.initFns = { 'u-ex-detail': initFns_u_ex_detail };

function updateTimerDisp(){
  const d = document.getElementById('restTimer');
  if(d) d.innerText = '00:' + (tLeft<10?'0':'') + tLeft;
}
function startTimer(){
  const btn = document.getElementById('timerBtn');
  if(tInterval){
    clearInterval(tInterval); tInterval=null;
    btn.innerText = 'استكمال';
  } else {
    btn.innerText = 'إيقاف مؤقت';
    tInterval = setInterval(()=>{
      tLeft--; updateTimerDisp();
      if(tLeft<=0){
        clearInterval(tInterval); tInterval=null;
        btn.innerText = 'ابدأ الراحة';
        toast('⏰ وقت الراحة انتهى! ارجع للتمرين');
        tLeft = 45;
      }
    },1000);
  }
}
function resetTimer(){
  clearInterval(tInterval); tInterval=null;
  tLeft = 45; updateTimerDisp();
  document.getElementById('timerBtn').innerText = 'ابدأ الراحة';
}


/* ---- User CV Test ---- */
views['u-cv'] = ()=>`
  <div class="page-head"><h1>اختبار اللياقة بالكاميرا (CV)</h1><p>الـ AI هيعدلك العدات ويصلحلك الفورمة وأنت بتتمرن</p></div>
  <div class="cam-box">
    <div class="rec-dot"><i></i> جاري تحليل الحركة</div>
    <div class="rep-counter">
      <b>12</b>
      <span>عدد عدات السكوات الصحيحة</span>
    </div>
    <div class="skeleton" style="text-align:center">
      <div style="font-size:60px">🧍</div>
      <div style="background:var(--surface-3); padding:8px 16px; border-radius:8px; font-size:12px; font-weight:700; margin-top:10px; border:1px solid var(--lime); color:var(--lime)">
        استعد لبدء التمرين...
      </div>
    </div>
  </div>
  <div style="text-align:center; margin-top:20px">
    <button class="btn btn-primary" onclick="toast('تم إنهاء الاختبار وإرسال النتيجة للكابتن')">إنهاء الاختبار</button>
  </div>
`;
function renderAnalyticsDashboard(history) {
  if (!history || history.length === 0) {
    return `
      <div class="card" style="text-align:center;padding:50px 20px;color:var(--text-dim)">
        <div style="font-size:40px;margin-bottom:15px">📈</div>
        <h3 style="margin-bottom:10px;color:var(--text)">لا توجد بيانات كافية</h3>
        <p>لا يوجد قراءات InBody مسجلة لعرض التحليلات.</p>
      </div>`;
  }
  
  if (history.length < 2) {
    return `
      <div class="card" style="text-align:center;padding:50px 20px;color:var(--text-dim)">
        <div style="font-size:40px;margin-bottom:15px;color:var(--gold)">📊</div>
        <h3 style="margin-bottom:10px;color:var(--text)">قراءة واحدة غير كافية للتحليل</h3>
        <p>تحتاج إلى قراءتين InBody على الأقل لرسم منحنيات التطور والمقارنة.</p>
      </div>`;
  }

  // Schedule the charts initialization after DOM is ready
  window.currentAnalyticsHistory = history;
  setTimeout(() => initAnalyticsCharts(), 150);

  let tableRows = history.map(h => `
    <tr style="border-bottom:1px solid var(--border)">
      <td style="padding:12px;color:var(--lime);font-weight:bold">${h.reading_date}</td>
      <td style="padding:12px" dir="ltr">${h.weight} kg</td>
      <td style="padding:12px" dir="ltr">${h.body_fat}%</td>
      <td style="padding:12px" dir="ltr">${h.muscle_mass}%</td>
    </tr>
  `).join('');

  return `
    <div class="grid grid-2" style="margin-bottom:20px; gap:20px">
      <!-- Line Chart -->
      <div class="card" style="padding:20px">
        <h3 style="color:var(--gold); margin-bottom:15px">التطور الزمني (الوزن والدهون والعضلات)</h3>
        <div style="position: relative; height: 300px; width: 100%;">
          <canvas id="analyticsLineChart"></canvas>
        </div>
      </div>
      <!-- Bar Chart -->
      <div class="card" style="padding:20px">
        <h3 style="color:var(--cyan); margin-bottom:15px">صافي التغير (أول قراءة vs أحدث قراءة)</h3>
        <div style="position: relative; height: 300px; width: 100%;">
          <canvas id="analyticsBarChart"></canvas>
        </div>
      </div>
    </div>
    
    <div class="card" style="padding:20px; margin-bottom:20px">
      <h3 style="color:var(--text); margin-bottom:15px">جدول القراءات التفصيلي</h3>
      <div style="overflow-x:auto">
        <table style="width:100%; text-align:right; border-collapse:collapse; min-width:500px">
          <thead>
            <tr style="border-bottom:2px solid var(--border); color:var(--text-dim)">
              <th style="padding:12px">التاريخ</th>
              <th style="padding:12px">الوزن</th>
              <th style="padding:12px">نسبة الدهون</th>
              <th style="padding:12px">كتلة العضلات</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

let lineChartInstance = null;
let barChartInstance = null;

function initAnalyticsCharts() {
  const history = window.currentAnalyticsHistory;
  if(!history || history.length < 2) return;
  
  // Sort history chronologically for charts (oldest first)
  const sorted = [...history].reverse();
  const labels = sorted.map(h => h.reading_date);
  
  const weightData = sorted.map(h => h.weight);
  const fatData = sorted.map(h => h.body_fat);
  const muscleData = sorted.map(h => h.muscle_mass);
  
  // Initialize Line Chart
  const lineCtx = document.getElementById('analyticsLineChart');
  if(lineCtx) {
    if(lineChartInstance) lineChartInstance.destroy();
    lineChartInstance = new Chart(lineCtx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          { label: 'الوزن (kg)', data: weightData, borderColor: '#ffffff', backgroundColor: 'rgba(255,255,255,0.1)', tension: 0.4 },
          { label: 'الدهون (%)', data: fatData, borderColor: '#ff6b6b', backgroundColor: 'rgba(255,107,107,0.1)', tension: 0.4 },
          { label: 'العضلات (%)', data: muscleData, borderColor: '#ccff00', backgroundColor: 'rgba(204,255,0,0.1)', tension: 0.4 }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: '#e0e0e0', font: { family: 'Cairo' } } } },
        scales: {
          x: { ticks: { color: '#a0a0a0', font: { family: 'Cairo' } }, grid: { color: 'rgba(255,255,255,0.05)' } },
          y: { ticks: { color: '#a0a0a0', font: { family: 'Cairo' } }, grid: { color: 'rgba(255,255,255,0.05)' } }
        }
      }
    });
  }
  
  // Initialize Bar Chart for Net Change
  const barCtx = document.getElementById('analyticsBarChart');
  if(barCtx) {
    if(barChartInstance) barChartInstance.destroy();
    const first = sorted[0];
    const latest = sorted[sorted.length - 1];
    
    const wDiff = (latest.weight - first.weight).toFixed(1);
    const fDiff = (latest.body_fat - first.body_fat).toFixed(1);
    const mDiff = (latest.muscle_mass - first.muscle_mass).toFixed(1);
    
    barChartInstance = new Chart(barCtx, {
      type: 'bar',
      data: {
        labels: ['الوزن (kg)', 'الدهون (%)', 'العضلات (%)'],
        datasets: [{
          label: 'مقدار التغير',
          data: [wDiff, fDiff, mDiff],
          backgroundColor: [
            wDiff > 0 ? '#ff6b6b' : '#ccff00',
            fDiff > 0 ? '#ff6b6b' : '#ccff00',
            mDiff > 0 ? '#ccff00' : '#ff6b6b'
          ],
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { color: '#e0e0e0', font: { family: 'Cairo' } }, grid: { display: false } },
          y: { ticks: { color: '#a0a0a0' }, grid: { color: 'rgba(255,255,255,0.05)' } }
        }
      }
    });
  }
}

function renderInBodyDashboard(history) {
  if (!history || history.length === 0) {
    return `
      <div class="card" style="text-align:center;padding:50px 20px;color:var(--text-dim)">
        <div style="font-size:40px;margin-bottom:15px">📊</div>
        <h3 style="margin-bottom:10px;color:var(--text)">لا توجد قراءات مسجلة</h3>
        <p>لم يقم الكابتن بتسجيل أي قراءة InBody لك حتى الآن.</p>
      </div>`;
  }

  const latest = history[0];
  const first = history[history.length - 1];

  window.currentInBodyHistory = history;
  setTimeout(() => updateInBodyComparison(), 100);

  return `
    <div id="inbodyComparisonContainer"></div>
    
    <div id="latestInBodyContainer">
    <div class="grid grid-2">
      <div class="card">
        <h3 style="margin-bottom:15px; color:var(--gold)">القياسات الحيوية</h3>
        <div class="grid grid-2" style="gap:10px">
          <div class="field"><label>الوزن</label><div class="settings-input" style="width:100%; font-weight:bold">${latest.weight} kg</div></div>
          <div class="field"><label>مؤشر الكتلة (BMI)</label><div class="settings-input" style="width:100%; font-weight:bold">${latest.bmi || '-'}</div></div>
          <div class="field"><label>نسبة الدهون (TBF%)</label><div class="settings-input" style="width:100%; color:var(--coral); font-weight:bold">${latest.body_fat}%</div></div>
          <div class="field"><label>العضلات (SM%)</label><div class="settings-input" style="width:100%; font-weight:bold">${latest.muscle_mass}%</div></div>
          <div class="field"><label>الدهون الحشوية</label><div class="settings-input" style="width:100%; color:var(--coral)">${latest.vfi || '-'}</div></div>
          <div class="field"><label>بدون دهون (FFM)</label><div class="settings-input" style="width:100%">${latest.ffm ? latest.ffm+' kg' : '-'}</div></div>
          <div class="field"><label>كتلة الدهون (FM)</label><div class="settings-input" style="width:100%">${latest.fat_mass ? latest.fat_mass+' kg' : '-'}</div></div>
          <div class="field"><label>نسبة المياه</label><div class="settings-input" style="width:100%; color:var(--cyan)">${latest.tbw_percent ? latest.tbw_percent+'%' : '-'}</div></div>
        </div>
      </div>
      <div class="card">
        <h3 style="margin-bottom:15px; color:var(--cyan)">المعدلات الأيضية</h3>
        <div class="grid grid-2" style="gap:10px">
          <div class="field"><label>معدل الحرق (BMR)</label><div class="settings-input" style="width:100%">${latest.bmr || '-'}</div></div>
          <div class="field"><label>التقييم الإجمالي</label><div class="settings-input" style="width:100%">${latest.score || '-'} / 100</div></div>
          <div class="field"><label>العمر الحيوي</label><div class="settings-input" style="width:100%">${latest.bio_age || '-'}</div></div>
        </div>
        
        <h3 style="margin-top:20px; margin-bottom:15px; color:var(--text)">نصائح التحكم</h3>
        <div class="grid grid-2" style="gap:10px">
          <div class="field"><label>الوزن المطلوب</label><div class="settings-input" style="width:100%; color:var(--coral)">${latest.target_weight || '-'}</div></div>
          <div class="field"><label>الدهون المطلوبة</label><div class="settings-input" style="width:100%; color:var(--coral)">${latest.target_fat || '-'}</div></div>
          <div class="field"><label>العضلات المطلوبة</label><div class="settings-input" style="width:100%; color:var(--lime)">${latest.target_muscle || '-'}</div></div>
          <div class="field"><label>المياه المطلوبة</label><div class="settings-input" style="width:100%; color:var(--cyan)">${latest.target_water || '-'}</div></div>
        </div>
      </div>
    </div>
    
    ${history.length > 1 ? `
    <h3 style="margin-top:30px; margin-bottom:15px; border-bottom:1px solid var(--border); padding-bottom:10px;">سجل القراءات السابقة</h3>
    <div class="grid grid-3">
      ${history.slice(1).map(h => `
        <div class="card" style="padding:15px">
          <div style="color:var(--lime); margin-bottom:10px; font-weight:bold">${h.reading_date}</div>
          <div style="display:flex; justify-content:space-between; margin-bottom:5px"><span>الوزن:</span> <b>${h.weight} kg</b></div>
          <div style="display:flex; justify-content:space-between; margin-bottom:5px"><span>الدهون:</span> <b>${h.body_fat}%</b></div>
          <div style="display:flex; justify-content:space-between;"><span>العضلات:</span> <b>${h.muscle_mass}%</b></div>
        </div>
      `).join('')}
    </div>
    ` : ''}
    </div> <!-- Closes latestInBodyContainer -->
  `;
}

function updateInBodyComparison() {
  const history = window.currentInBodyHistory;
  const container = document.getElementById('inbodyComparisonContainer');
  if(!container || !history || history.length === 0) return;
  
  if(history.length < 2) {
    container.innerHTML = `
      <div class="card" style="margin-bottom:20px; background:var(--surface-2); border:1px solid var(--border); text-align:center">
        <h3 style="margin:0; color:var(--gold); margin-bottom:10px">نظام المقارنة</h3>
        <p style="color:var(--text-dim)">النظام ده بيشتغل لما يكون عندك أكتر من قراءة InBody عشان يقارن بينهم ويوضحلك الفرق.</p>
      </div>
    `;
    return;
  }
  
  const targetSel = document.getElementById('compareTargetSel');
  const baseSel = document.getElementById('compareBaseSel');
  
  let targetIdx = targetSel ? parseInt(targetSel.value) : 0;
  let baseIdx = baseSel ? parseInt(baseSel.value) : history.length - 1;
  
  const target = history[targetIdx];
  const base = history[baseIdx];
  
  const weightDiff = (target.weight - base.weight).toFixed(1);
  const fatDiff = (target.body_fat - base.body_fat).toFixed(1);
  const muscleDiff = (target.muscle_mass - base.muscle_mass).toFixed(1);
  
  const wColor = weightDiff < 0 ? 'var(--lime)' : 'var(--coral)';
  const fColor = fatDiff < 0 ? 'var(--lime)' : 'var(--coral)';
  const mColor = muscleDiff > 0 ? 'var(--lime)' : 'var(--coral)';
  
  const html = `
    <div class="card" style="margin-bottom:20px; background:var(--surface-2); border:1px solid var(--border)">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap; gap:10px">
        <h3 style="margin:0; color:var(--gold)">نظام المقارنة</h3>
        <div style="display:flex; gap:10px; align-items:center">
          <span style="color:var(--text-dim)">قارن</span>
          <select id="compareTargetSel" class="settings-input" style="height:36px; padding:0 10px; background:var(--bg)" onchange="updateInBodyComparison()">
            ${history.map((h, i) => `<option value="${i}" ${i === targetIdx ? 'selected' : ''}>${h.reading_date}</option>`).join('')}
          </select>
          <span style="color:var(--text-dim)">مع</span>
          <select id="compareBaseSel" class="settings-input" style="height:36px; padding:0 10px; background:var(--bg)" onchange="updateInBodyComparison()">
            ${history.map((h, i) => `<option value="${i}" ${i === baseIdx ? 'selected' : ''}>${h.reading_date}</option>`).join('')}
          </select>
        </div>
      </div>
      
      <div class="grid grid-3">
        <div style="text-align:center; padding:15px; background:var(--bg); border-radius:8px">
          <div style="color:var(--text-dim); margin-bottom:5px">الوزن</div>
          <div style="font-size:24px; font-weight:bold; color:${wColor}" dir="ltr">${weightDiff > 0 ? '+' : ''}${weightDiff} kg</div>
        </div>
        <div style="text-align:center; padding:15px; background:var(--bg); border-radius:8px">
          <div style="color:var(--text-dim); margin-bottom:5px">الدهون</div>
          <div style="font-size:24px; font-weight:bold; color:${fColor}" dir="ltr">${fatDiff > 0 ? '+' : ''}${fatDiff} %</div>
        </div>
        <div style="text-align:center; padding:15px; background:var(--bg); border-radius:8px">
          <div style="color:var(--text-dim); margin-bottom:5px">العضلات</div>
          <div style="font-size:24px; font-weight:bold; color:${mColor}" dir="ltr">${muscleDiff > 0 ? '+' : ''}${muscleDiff} %</div>
        </div>
      </div>
    </div>
  `;
  if(container) container.innerHTML = html;
  
  // Also update the latest reading title if we want, but let's just leave it as "التفاصيل"
  const latestTitle = document.querySelector('#latestInBodyContainer h3');
  if(latestTitle) latestTitle.innerHTML = `تفاصيل القراءة (${target.reading_date})`;
}

/* ---- User InBody ---- */
views['u-inbody'] = async () => {
  let history = [];
  try {
    history = await apiFetch('/inbody/me');
  } catch(e) {
    console.error(e);
  }
  
  return `
    <div class="page-head"><h1>بياناتي (InBody)</h1><p>سجل قراءاتك وتابع تطورك</p></div>
    ${renderInBodyDashboard(history)}
  `;
}

/* ---- User Analytics ---- */
views['u-analytics'] = async () => {
  let history = [];
  try {
    history = await apiFetch('/inbody/me');
  } catch(e) {
    console.error(e);
  }
  
  return `
    <div class="page-head"><h1>تقدمي</h1><p>متابعة التزامك وتطورك</p></div>
    ${renderAnalyticsDashboard(history)}
  `;
}

/* ---- User Settings ---- */
views['u-settings'] = ()=>`
  <div class="page-head"><h1>إعداداتي</h1><p>تعديل الحساب والإشعارات</p></div>
  <div class="card" style="text-align:center;padding:50px 20px;color:var(--text-dim)">
    <div style="font-size:40px;margin-bottom:15px">⚙️</div>
    <h3 style="margin-bottom:10px;color:var(--text)">الإعدادات</h3>
    <p>تعديل الإعدادات الشخصية هيكون متاح قريباً.</p>
  </div>
`;

/* ---- User Chat (With Admin) ---- */
views['u-chat'] = async () => {
  const msgs = await apiFetch('/chat/1'); // Fetch chat with admin (ID: 1)
  
  return `
  <div class="page-head"><h1>المحادثة مع الكابتن</h1><p>لو عندك استفسار في التمرين أو الأكل</p></div>
  <div class="ai-chat-wrap">
    <div class="ai-chat-head"><div class="ai-icon" style="background:var(--surface-3);color:var(--text)">C</div> كابتن الجيم</div>
    <div class="ai-chat-body" id="uChatBody">
      ${msgs.map(m => {
        if(m.is_me) {
          return `<div class="ai-bubble user" style="background:var(--surface-3);color:var(--text)">${m.content}</div>`;
        } else {
          return `<div class="ai-bubble assistant" style="background:var(--lime);color:#0d0e10;font-weight:bold">${m.content}</div>`;
        }
      }).join('')}
    </div>
    <div class="ai-chat-input">
      <input id="uChatInput" placeholder="اكتب رسالتك..." onkeypress="if(event.key==='Enter') sendUChat()">
      <button class="btn btn-primary" onclick="sendUChat()">إرسال</button>
    </div>
  </div>
  `;
}

async function sendUChat(){
  const inp = document.getElementById('uChatInput');
  const txt = inp.value.trim();
  if(!txt) return;
  
  const body = document.getElementById('uChatBody');
  body.insertAdjacentHTML('beforeend', `<div class="ai-bubble user" style="background:var(--surface-3);color:var(--text)">${txt}</div>`);
  inp.value = '';
  body.scrollTop = body.scrollHeight;
  
  try {
    await apiFetch('/chat', {
      method: 'POST',
      body: JSON.stringify({ receiver_id: 1, content: txt })
    });
  } catch(e) {
    toast(`❌ خطأ في الإرسال: ${e.message}`);
  }
}

/* ---- User AI Chat ---- */
views['u-aichat'] = ()=>`
  <div class="page-head"><h1>مساعد التدريب والتغذية (AI)</h1><p>اسألني عن أي تمرين، بدائل الأجهزة، أو السعرات الحرارية في الأكل</p></div>
  <div class="card" style="text-align:center;padding:50px 20px;color:var(--text-dim)">
    <div style="font-size:40px;margin-bottom:15px">🤖</div>
    <h3 style="margin-bottom:10px;color:var(--text)">المساعد الذكي</h3>
    <p>جاري تفعيل الـ AI الخاص بأسئلتك الرياضية قريباً.</p>
  </div>
`;

/* ============ INIT ============ */
function toggleLoginRole(){
  const btn = document.getElementById('roleToggleBtn');
  const t = document.getElementById('loginTitle');
  const sub = document.getElementById('loginSub');
  const u = document.getElementById('loginUser');
  if(btn.innerText.includes('ادمن')){
    btn.innerText = '🏋️ أنا عميل';
    t.innerText = 'تسجيل دخول المدرب (الادمن)';
    sub.innerText = 'ادخل لادارة الجيم الخاص بك';
    u.value = 'admin';
    document.getElementById('loginIcon').innerHTML = ic.dash;
  } else {
    btn.innerText = '🧑‍💼 أنا ادمن';
    t.innerText = 'تسجيل دخول العميل';
    sub.innerText = 'ادخل اليوزر والباسورد اللي دّهملك كابتنك';
    u.value = 'omar.fit';
    document.getElementById('loginIcon').innerHTML = ic.users;
  }
}

async function doLogin(){
  const user = document.getElementById('loginUser').value.trim();
  const pass = document.getElementById('loginPass').value;
  const btn = document.querySelector('.login-btn');
  const originalText = btn.innerText;
  
  try {
    btn.innerText = 'جاري الدخول...';
    btn.disabled = true;
    
    const data = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username: user, password: pass })
    });
    
    localStorage.setItem('token', data.access_token);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    document.getElementById('loginWrap').style.display = 'none';
    document.getElementById('appShell').classList.add('show');
    setMode(data.user.role);
    toast(`أهلاً بيك يا ${data.user.full_name}`);
    
  } catch (error) {
    toast(`❌ ${error.message}`);
  } finally {
    btn.innerText = originalText;
    btn.disabled = false;
  }
}

function logout(){
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  document.getElementById('appShell').classList.remove('show');
  document.getElementById('loginWrap').style.display = 'block';
}

// Auto-login if token exists
window.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  if(token){
    try {
      const userData = await apiFetch('/auth/me');
      localStorage.setItem('user', JSON.stringify(userData));
      document.getElementById('loginWrap').style.display = 'none';
      document.getElementById('appShell').classList.add('show');
      setMode(userData.role);
    } catch(e) {
      logout();
    }
  }
});
