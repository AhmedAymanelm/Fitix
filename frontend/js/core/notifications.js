/* ==========================================================
   notifications.js — نظام الإشعارات الكامل
   ========================================================== */

// ── Wizard State ──
window._wizData = {};
window._wizStep = 1;
const WIZ_TOTAL = 4;

function openWizard() {
  window._wizData = {};
  window._wizStep = 1;
  // Reset all inputs
  ['wiz_full_name','wiz_phone','wiz_username','wiz_password',
   'wiz_weight','wiz_height','wiz_age','wiz_sub_start','wiz_sub_end',
   'wiz_workout_days','wiz_sport_type','wiz_injury_type','wiz_injury_date',
   'wiz_medication_name','wiz_health_issues','wiz_notes'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  document.querySelectorAll('.wiz-radio-btn').forEach(b => b.classList.remove('selected'));
  document.querySelectorAll('.wiz-toggle').forEach(t => t.classList.remove('on'));
  document.getElementById('workoutDetailsSection').style.display = 'none';
  document.getElementById('injuryDetailsSection').style.display = 'none';
  document.getElementById('medicationSection').style.display = 'none';
  document.getElementById('healthIssuesSection').style.display = 'none';
  document.getElementById('medPhotoPreview').style.display = 'none';
  _wizUpdateUI();
  document.getElementById('wizardModalBg').classList.add('show');
}

function closeWizard() {
  document.getElementById('wizardModalBg').classList.remove('show');
}

function wizSelect(key, value, btn) {
  // Deselect siblings in same group
  btn.closest('.wiz-radio-group').querySelectorAll('.wiz-radio-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  window._wizData[key] = value;
}

function wizToggle(key) {
  const toggle = document.getElementById('toggle_' + key);
  const current = window._wizData[key] || false;
  window._wizData[key] = !current;
  toggle.classList.toggle('on', !current);

  // Show/hide dependent sections
  if (key === 'is_active_workout') {
    document.getElementById('workoutDetailsSection').style.display = !current ? 'block' : 'none';
  } else if (key === 'has_injury') {
    document.getElementById('injuryDetailsSection').style.display = !current ? 'block' : 'none';
  } else if (key === 'takes_medication') {
    document.getElementById('medicationSection').style.display = !current ? 'block' : 'none';
  } else if (key === 'has_health_issues') {
    document.getElementById('healthIssuesSection').style.display = !current ? 'block' : 'none';
  }
}

function _wizUpdateUI() {
  const step = window._wizStep;
  // Show correct panel
  for (let i = 1; i <= WIZ_TOTAL; i++) {
    const panel = document.getElementById('wizStep' + i);
    if (panel) panel.classList.toggle('active', i === step);
  }
  // Update step dots
  document.querySelectorAll('.wizard-step-dot').forEach(dot => {
    const s = parseInt(dot.dataset.step);
    dot.classList.toggle('active', s === step);
    dot.classList.toggle('done', s < step);
  });
  // Buttons
  document.getElementById('wizPrevBtn').style.display = step > 1 ? '' : 'none';
  document.getElementById('wizNextBtn').style.display = step < WIZ_TOTAL ? '' : 'none';
  document.getElementById('wizSubmitBtn').style.display = step === WIZ_TOTAL ? '' : 'none';
}

function wizNext() {
  if (window._wizStep === 1) {
    const name = document.getElementById('wiz_full_name').value.trim();
    const user = document.getElementById('wiz_username').value.trim();
    const pass = document.getElementById('wiz_password').value.trim();
    if (!name || !user || !pass) { toast('⚠️ الاسم واليوزر والباسورد مطلوبين'); return; }
  }
  if (window._wizStep < WIZ_TOTAL) {
    window._wizStep++;
    _wizUpdateUI();
  }
}

function wizPrev() {
  if (window._wizStep > 1) {
    window._wizStep--;
    _wizUpdateUI();
  }
}

function previewMedPhoto(input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = (e) => {
      document.getElementById('medPhotoImg').src = e.target.result;
      document.getElementById('medPhotoPreview').style.display = 'block';
    };
    reader.readAsDataURL(input.files[0]);
  }
}

async function wizSubmit() {
  const btn = document.getElementById('wizSubmitBtn');
  btn.disabled = true;
  btn.innerText = 'جاري الإنشاء...';

  try {
    // Collect schedule
    const scheduleMap = {};
    document.querySelectorAll('.workout-time').forEach(inp => {
      if (inp.value) scheduleMap[inp.dataset.day] = inp.value;
    });

    // Collect injury details
    let injuryDetails = null;
    if (window._wizData.has_injury) {
      injuryDetails = JSON.stringify([{
        type: document.getElementById('wiz_injury_type').value,
        date: document.getElementById('wiz_injury_date').value,
        recovered: window._wizData.injury_recovered || 'غير محدد'
      }]);
    }

    // Collect medication
    let medDetails = null;
    if (window._wizData.takes_medication) {
      const medPhotoFile = document.getElementById('wiz_medication_photo').files[0];
      let medPhotoUrl = null;
      if (medPhotoFile) {
        // Upload medication photo first
        // We'll do it inline — for now just use name
      }
      medDetails = JSON.stringify([{
        name: document.getElementById('wiz_medication_name').value,
        photo_url: null
      }]);
    }

    const payload = {
      full_name: document.getElementById('wiz_full_name').value.trim(),
      phone: document.getElementById('wiz_phone').value.trim(),
      username: document.getElementById('wiz_username').value.trim(),
      password: document.getElementById('wiz_password').value.trim(),
      gender: window._wizData.gender || null,
      weight: parseFloat(document.getElementById('wiz_weight').value) || null,
      height: parseFloat(document.getElementById('wiz_height').value) || null,
      age: parseInt(document.getElementById('wiz_age').value) || null,
      // Subscription
      service_type: window._wizData.service_type || null,
      subscription_type: window._wizData.subscription_type || null,
      subscription_start: document.getElementById('wiz_sub_start').value || null,
      subscription_end: document.getElementById('wiz_sub_end').value || null,
      goal: window._wizData.goal || null,
      // Workout
      is_active_workout: !!window._wizData.is_active_workout,
      workout_days_per_week: parseInt(document.getElementById('wiz_workout_days').value) || null,
      workout_type: window._wizData.workout_type || null,
      workout_schedule: Object.keys(scheduleMap).length > 0 ? JSON.stringify(scheduleMap) : null,
      sport_type: document.getElementById('wiz_sport_type').value || null,
      // Health
      has_injury: !!window._wizData.has_injury,
      injury_details: injuryDetails,
      takes_medication: !!window._wizData.takes_medication,
      medication_details: medDetails,
      has_health_issues: !!window._wizData.has_health_issues,
      health_issues_details: document.getElementById('wiz_health_issues').value || null,
      notes: document.getElementById('wiz_notes').value || null,
    };

    const result = await apiFetch('/admin/clients', { method: 'POST', body: JSON.stringify(payload) });
    toast('✅ تم إنشاء حساب العميل بنجاح!');
    closeWizard();
    goView('a-clients');
  } catch(e) {
    toast('❌ ' + e.message);
    btn.disabled = false;
    btn.innerText = '✅ إنشاء الحساب';
  }
}

// Backward compat: keep old openModal working for existing code
function openModal() { openWizard(); }
function closeModal() { closeWizard(); }
async function createClient() { /* wizard handles it */ }


/* ==========================================================
   NOTIFICATIONS SYSTEM
   ========================================================== */
let _notifOpen = false;
let _lastNotifCount = 0;

function playNotifSound() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880.00, ctx.currentTime + 0.1); // A5
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.05);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch(e) {}
}

async function loadNotifications() {
  try {
    const data = await apiFetch('/notifications');
    const count = await apiFetch('/notifications/unread-count');
    const badge = document.getElementById('notifBadge');
    const list = document.getElementById('notifList');
    if (!badge || !list) return;

    if (count.count > 0) {
      badge.style.display = 'flex';
      badge.innerText = count.count > 99 ? '99+' : count.count;
      
      if (count.count > _lastNotifCount) {
        playNotifSound();
        if (data && data.length > 0) {
          showBrowserNotif(data[0].title, data[0].message);
        }
      }
    } else {
      badge.style.display = 'none';
    }
    _lastNotifCount = count.count;

    if (!data || data.length === 0) {
      list.innerHTML = '<div class="notif-empty">🔔 لا توجد إشعارات حالياً</div>';
      return;
    }

    const icons = {
      appointment_reminder: '📅',
      subscription_expiry: '⏰',
      new_client: '🎉',
      general: '📢'
    };

    list.innerHTML = data.map(n => `
      <div class="notif-item ${!n.is_read ? 'unread' : ''}" onclick="markNotifRead(${n.id})">
        <div class="notif-item-icon">${icons[n.type] || '📢'}</div>
        <div class="notif-item-body">
          <div class="notif-item-title">${n.title}</div>
          <div class="notif-item-msg">${n.message}</div>
          <div class="notif-item-time">${n.created_at}</div>
        </div>
      </div>
    `).join('');
  } catch(e) { /* silent */ }
}

function toggleNotifDropdown() {
  const dropdown = document.getElementById('notifDropdown');
  _notifOpen = !_notifOpen;
  dropdown.style.display = _notifOpen ? 'block' : 'none';
  if (_notifOpen) loadNotifications();
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
  const wrap = document.getElementById('notifBellWrap');
  if (wrap && !wrap.contains(e.target) && _notifOpen) {
    _notifOpen = false;
    const d = document.getElementById('notifDropdown');
    if (d) d.style.display = 'none';
  }
});

async function markNotifRead(id) {
  try {
    await apiFetch('/notifications/' + id + '/mark-read', { method: 'POST' });
    loadNotifications();
  } catch(e) {}
}

async function markAllNotifsRead() {
  try {
    await apiFetch('/notifications/mark-all-read', { method: 'POST' });
    loadNotifications();
    toast('✅ تم تعليم كل الإشعارات كمقروءة');
  } catch(e) {}
}

// Auto-refresh notifications every 60 seconds
function startNotifPolling() {
  loadNotifications();
  setInterval(loadNotifications, 60000);
  // Start chat badge polling
  startChatBadgePolling();
  // Browser push permission request
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
}

// Show native browser push notification
function showBrowserNotif(title, body) {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('FORM Fitness — ' + title, {
      body: body,
      icon: '/favicon.ico',
    });
  }
}


/* ==========================================================
   BODY PHOTOS UPLOAD (Admin Side)
   ========================================================== */
async function uploadBodyPhotos(clientId) {
  const front = document.getElementById('bodyPhotoFront');
  const back = document.getElementById('bodyPhotoBack');
  const side = document.getElementById('bodyPhotoSide');

  if (!front.files[0] && !back.files[0] && !side.files[0]) {
    toast('⚠️ اختر صورة واحدة على الأقل'); return;
  }

  const formData = new FormData();
  if (front.files[0]) formData.append('front', front.files[0]);
  if (back.files[0]) formData.append('back', back.files[0]);
  if (side.files[0]) formData.append('side', side.files[0]);

  const btn = document.getElementById('uploadPhotosBtn');
  btn.disabled = true;
  btn.innerText = 'جاري الرفع...';

  try {
    const token = localStorage.getItem('token');
    const res = await fetch(API_BASE + '/admin/clients/' + clientId + '/body-photos', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + token },
      body: formData
    });
    if (!res.ok) throw new Error('فشل رفع الصور');
    toast('✅ تم رفع الصور بنجاح!');
    goView('a-client-detail');
  } catch(e) {
    toast('❌ ' + e.message);
  } finally {
    btn.disabled = false;
    btn.innerText = '📤 رفع الصور';
  }
}

function previewBodyPhoto(input, slotId) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const slot = document.getElementById(slotId);
      if (slot) {
        slot.innerHTML = `<img src="${e.target.result}" style="width:100%;height:100%;object-fit:cover">
          <div class="photo-date-badge">📷 ${new Date().toLocaleDateString('ar-EG')}</div>`;
      }
    };
    reader.readAsDataURL(input.files[0]);
  }
}


/* ==========================================================
   CLIENT REPORT — Print
   ========================================================== */
async function printClientReport(clientId) {
  try {
    const report = await apiFetch('/admin/clients/' + clientId + '/report');
    const c = report.client;
    const b = report.body;
    const sub = report.subscription;
    const w = report.workout;
    const h = report.health;
    const photos = report.body_photos;
    const plan = report.nutrition_plan;
    const readings = report.inbody_readings || [];

    const serviceLabels = { nutrition: 'تغذية فقط', nutrition_fitness: 'تغذية + فيتنس', gym_workout: 'جيم + تمارين' };

    const html = `
      <div class="print-report-container" id="printableReport">
        <div class="report-header" style="text-align:center; margin-bottom:24px; padding-bottom:16px; border-bottom:3px solid #000">
          <h1 style="font-size:28px; margin-bottom:4px">FORM Fitness OS</h1>
          <h2 style="font-size:18px; font-weight:400">تقرير عميل — ${c.full_name}</h2>
          <p style="font-size:12px; color:#666">تاريخ التقرير: ${report.report_date}</p>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:24px; margin-bottom:24px">
          <div>
            <h3 style="font-size:14px; border-bottom:1px solid #ccc; padding-bottom:6px; margin-bottom:12px">👤 البيانات الشخصية</h3>
            <table style="width:100%; border-collapse:collapse; font-size:13px">
              <tr><td style="padding:5px;color:#666;width:45%">الاسم</td><td style="padding:5px;font-weight:bold">${c.full_name}</td></tr>
              <tr><td style="padding:5px;color:#666">التليفون</td><td style="padding:5px">${c.phone || '—'}</td></tr>
              <tr><td style="padding:5px;color:#666">الوزن</td><td style="padding:5px">${b.weight ? b.weight + ' كجم' : '—'}</td></tr>
              <tr><td style="padding:5px;color:#666">الطول</td><td style="padding:5px">${b.height ? b.height + ' سم' : '—'}</td></tr>
              <tr><td style="padding:5px;color:#666">العمر</td><td style="padding:5px">${b.age ? b.age + ' سنة' : '—'}</td></tr>
              <tr><td style="padding:5px;color:#666">الجنس</td><td style="padding:5px">${b.gender || '—'}</td></tr>
            </table>
          </div>
          <div>
            <h3 style="font-size:14px; border-bottom:1px solid #ccc; padding-bottom:6px; margin-bottom:12px">📋 الاشتراك</h3>
            <table style="width:100%; border-collapse:collapse; font-size:13px">
              <tr><td style="padding:5px;color:#666;width:45%">نوع الخدمة</td><td style="padding:5px;font-weight:bold">${serviceLabels[sub.service_type] || sub.service_type || '—'}</td></tr>
              <tr><td style="padding:5px;color:#666">نوع الاشتراك</td><td style="padding:5px">${sub.type || '—'}</td></tr>
              <tr><td style="padding:5px;color:#666">الهدف</td><td style="padding:5px">${sub.goal || '—'}</td></tr>
              <tr><td style="padding:5px;color:#666">بداية الاشتراك</td><td style="padding:5px">${sub.start || '—'}</td></tr>
              <tr><td style="padding:5px;color:#666">نهاية الاشتراك</td><td style="padding:5px">${sub.end || '—'}</td></tr>
              <tr><td style="padding:5px;color:#666">تاريخ الانضمام</td><td style="padding:5px">${c.joined || '—'}</td></tr>
            </table>
          </div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:24px; margin-bottom:24px">
          <div>
            <h3 style="font-size:14px; border-bottom:1px solid #ccc; padding-bottom:6px; margin-bottom:12px">🏋️ التمارين</h3>
            <table style="width:100%; border-collapse:collapse; font-size:13px">
              <tr><td style="padding:5px;color:#666;width:45%">بيتمرن؟</td><td style="padding:5px;font-weight:bold">${w.is_active ? '✅ نعم' : '❌ لا'}</td></tr>
              ${w.is_active ? `
              <tr><td style="padding:5px;color:#666">أيام التمرين</td><td style="padding:5px">${w.days_per_week || '—'} أيام/أسبوع</td></tr>
              <tr><td style="padding:5px;color:#666">نوع التمرين</td><td style="padding:5px">${w.type || '—'}</td></tr>
              <tr><td style="padding:5px;color:#666">نوع الرياضة</td><td style="padding:5px">${w.sport_type || '—'}</td></tr>` : ''}
            </table>
          </div>
          <div>
            <h3 style="font-size:14px; border-bottom:1px solid #ccc; padding-bottom:6px; margin-bottom:12px">🏥 الحالة الصحية</h3>
            <table style="width:100%; border-collapse:collapse; font-size:13px">
              <tr><td style="padding:5px;color:#666;width:45%">إصابات سابقة؟</td><td style="padding:5px;font-weight:bold">${h.has_injury ? '⚠️ نعم' : '✅ لا'}</td></tr>
              ${h.has_injury && h.injury_details ? `<tr><td style="padding:5px;color:#666">تفاصيل الإصابة</td><td style="padding:5px;font-size:11px">${h.injury_details}</td></tr>` : ''}
              <tr><td style="padding:5px;color:#666">أدوية؟</td><td style="padding:5px;font-weight:bold">${h.takes_medication ? '💊 نعم' : '✅ لا'}</td></tr>
              ${h.takes_medication && h.medication_details ? `<tr><td style="padding:5px;color:#666">الأدوية</td><td style="padding:5px;font-size:11px">${h.medication_details}</td></tr>` : ''}
              <tr><td style="padding:5px;color:#666">مشاكل صحية؟</td><td style="padding:5px;font-weight:bold">${h.has_health_issues ? '⚠️ نعم' : '✅ لا'}</td></tr>
              ${h.has_health_issues && h.health_issues_details ? `<tr><td style="padding:5px;color:#666">التفاصيل</td><td style="padding:5px;font-size:11px">${h.health_issues_details}</td></tr>` : ''}
              ${h.notes ? `<tr><td style="padding:5px;color:#666">ملاحظات</td><td style="padding:5px;font-size:11px">${h.notes}</td></tr>` : ''}
            </table>
          </div>
        </div>

        ${(photos.front || photos.back || photos.side) ? `
        <div style="margin-bottom:24px">
          <h3 style="font-size:14px; border-bottom:1px solid #ccc; padding-bottom:6px; margin-bottom:12px">📸 صور تقدم الجسم ${photos.date ? '(' + photos.date + ')' : ''}</h3>
          <div style="display:flex; gap:16px">
            ${photos.front ? `<div style="flex:1; text-align:center"><img src="${photos.front}" style="width:100%; max-height:250px; object-fit:contain; border:1px solid #ccc; border-radius:8px"><p style="font-size:11px;color:#666;margin-top:4px">الوش</p></div>` : ''}
            ${photos.back ? `<div style="flex:1; text-align:center"><img src="${photos.back}" style="width:100%; max-height:250px; object-fit:contain; border:1px solid #ccc; border-radius:8px"><p style="font-size:11px;color:#666;margin-top:4px">الظهر</p></div>` : ''}
            ${photos.side ? `<div style="flex:1; text-align:center"><img src="${photos.side}" style="width:100%; max-height:250px; object-fit:contain; border:1px solid #ccc; border-radius:8px"><p style="font-size:11px;color:#666;margin-top:4px">الجنب</p></div>` : ''}
          </div>
        </div>` : ''}

        ${readings.length > 0 ? `
        <div style="margin-bottom:24px">
          <h3 style="font-size:14px; border-bottom:1px solid #ccc; padding-bottom:6px; margin-bottom:12px">📊 قراءات InBody</h3>
          <table style="width:100%; border-collapse:collapse; font-size:12px">
            <thead><tr style="background:#f0f0f0">
              <th style="padding:6px 10px; border:1px solid #ccc; text-align:right">التاريخ</th>
              <th style="padding:6px 10px; border:1px solid #ccc">الوزن</th>
              <th style="padding:6px 10px; border:1px solid #ccc">الدهون %</th>
              <th style="padding:6px 10px; border:1px solid #ccc">العضلات كجم</th>
              <th style="padding:6px 10px; border:1px solid #ccc">BMR</th>
              <th style="padding:6px 10px; border:1px solid #ccc">Score</th>
            </tr></thead>
            <tbody>
              ${readings.map(r => `
                <tr>
                  <td style="padding:5px 10px; border:1px solid #ccc; text-align:right">${r.date}</td>
                  <td style="padding:5px 10px; border:1px solid #ccc; text-align:center">${r.weight || '—'} كجم</td>
                  <td style="padding:5px 10px; border:1px solid #ccc; text-align:center">${r.body_fat || '—'}%</td>
                  <td style="padding:5px 10px; border:1px solid #ccc; text-align:center">${r.muscle_mass || '—'} كجم</td>
                  <td style="padding:5px 10px; border:1px solid #ccc; text-align:center">${r.bmr || '—'}</td>
                  <td style="padding:5px 10px; border:1px solid #ccc; text-align:center">${r.score || '—'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>` : ''}

        ${plan ? `
        <div style="margin-bottom:24px">
          <h3 style="font-size:14px; border-bottom:1px solid #ccc; padding-bottom:6px; margin-bottom:12px">🥗 النظام الغذائي الحالي — ${plan.goal} | ${plan.daily_calories} سعرة/يوم</h3>
          ${plan.meals.map(m => `
            <div style="margin-bottom:10px; padding:10px; border:1px solid #eee; border-radius:8px; border-right:3px solid #c8ff3d">
              <b style="font-size:13px">${m.name}</b>
              <span style="font-size:11px; color:#666; margin-right:8px">${m.calories} سعرة</span>
              <p style="font-size:12px; margin-top:4px; color:#444">${m.items}</p>
            </div>
          `).join('')}
        </div>` : ''}

        <div style="margin-top:30px; padding-top:16px; border-top:1px solid #ccc; text-align:center; font-size:11px; color:#999">
          تم إنشاء هذا التقرير بواسطة FORM Fitness OS — ${report.report_date}
        </div>
      </div>
    `;

    // Show in modal or new tab
    const w2 = window.open('', '_blank');
    w2.document.write(`
      <!DOCTYPE html><html lang="ar" dir="rtl">
      <head><meta charset="UTF-8">
      <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap" rel="stylesheet">
      <title>تقرير ${c.full_name}</title>
      <style>body{font-family:'Cairo',sans-serif;padding:20px;color:#000;background:#fff;}</style>
      </head><body>
      ${html}
      <br>
      <div style="text-align:center; margin:20px 0; display:flex; gap:12px; justify-content:center">
        <button onclick="window.print()" style="padding:10px 24px;background:#c8ff3d;border:none;border-radius:8px;font-size:14px;font-weight:700;cursor:pointer;font-family:Cairo">🖨️ طباعة / حفظ PDF</button>
        <button onclick="window.close()" style="padding:10px 24px;background:#eee;border:none;border-radius:8px;font-size:14px;font-weight:700;cursor:pointer;font-family:Cairo">✕ إغلاق</button>
      </div>
      </body></html>
    `);
    w2.document.close();
  } catch(e) {
    toast('❌ خطأ في تحميل التقرير: ' + e.message);
  }
}


/* ==========================================================
   NOTIFICATION SETTINGS (Admin Page Extension)
   ========================================================== */
async function loadNotifSettings() {
  try {
    const s = await apiFetch('/notifications/settings');
    const apptInp = document.getElementById('notifApptDays');
    const subInp = document.getElementById('notifSubDays');
    if (apptInp) apptInp.value = s.appointment_reminder_days;
    if (subInp) subInp.value = s.subscription_reminder_days;
  } catch(e) {}
}

async function saveNotifSettings() {
  const apptDays = parseInt(document.getElementById('notifApptDays').value);
  const subDays = parseInt(document.getElementById('notifSubDays').value);
  try {
    await apiFetch('/notifications/settings', {
      method: 'PUT',
      body: JSON.stringify({ appointment_reminder_days: apptDays, subscription_reminder_days: subDays })
    });
    toast('✅ تم حفظ إعدادات الإشعارات');
  } catch(e) {
    toast('❌ ' + e.message);
  }
}

async function runDailyNotifCheck() {
  const btn = document.getElementById('runCheckBtn');
  if (btn) { btn.disabled = true; btn.innerText = 'جاري الفحص...'; }
  try {
    const r = await apiFetch('/notifications/run-daily-check', { method: 'POST' });
    toast(`✅ تم الفحص — ${r.notifications_created} إشعار جديد`);
  } catch(e) {
    toast('❌ ' + e.message);
  } finally {
    if (btn) { btn.disabled = false; btn.innerText = '🔄 فحص يدوي الآن'; }
  }
}

async function sendAppointmentReminder(clientId) {
  const date = document.getElementById('reminderDate_' + clientId).value;
  const note = document.getElementById('reminderNote_' + clientId).value;
  if (!date) { toast('⚠️ اختر تاريخ الموعد'); return; }
  try {
    await apiFetch('/notifications/send-appointment-reminder', {
      method: 'POST',
      body: JSON.stringify({ client_id: clientId, appointment_date: date, note: note })
    });
    toast('✅ تم إرسال التذكير');
  } catch(e) {
    toast('❌ ' + e.message);
  }
}
