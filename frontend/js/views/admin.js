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
  <div style="text-align:center; padding:32px 0 24px; margin-bottom:8px;">
    <h1 style="font-size:36px; font-weight:900; margin-bottom:6px;">أهلاً كابتن 👋</h1>
    <p style="color:var(--text-dim); font-size:15px;">نظرة سريعة على متابعيك النهاردة</p>
  </div>
  
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
let _chatPollTimer = null;  // Live polling timer
let _chatLastMsgId = 0;    // Track last seen message ID

// Stop polling when user navigates away
const _origGoView = window.goView;
if (typeof goView === 'function') {
  const _origGoView = goView;
  window._stopChatPoll = function() {
    if (_chatPollTimer) { clearInterval(_chatPollTimer); _chatPollTimer = null; }
  };
}
views['a-chat'] = async () => {
  const convos = await apiFetch('/chat/conversations');
  const isMobile = window.innerWidth < 700;
  
  // On desktop, auto-select first conversation if none selected
  if (convos.length > 0 && !activeChatUserId && !isMobile) {
    activeChatUserId = convos[0].user_id;
  }

  // Common UI Elements
  const getEmptyState = () => `
    <div class="chat-main chat-empty-state">
      <div class="chat-empty-icon">📬</div>
      <div class="chat-empty-sub">لا توجد رسائل سابقة. ابدأ المحادثة الآن!</div>
    </div>`;

  const getChatListHtml = (mobileBg) => `
    <div class="chat-list" style="${mobileBg ? 'width:100%;height:100%;flex:1;' : ''}">
      <div style="padding:20px 20px 10px;text-align:center;">
        <div style="font-size:20px;font-weight:700;color:#e2e8f0;margin-bottom:16px;">جهات التواصل</div>
        <input type="text" id="chatSearch" placeholder="بحث عن عميل..." style="width:100%;border-radius:24px;border:none;padding:12px 16px;background:#fff;color:#1a202c;font-size:14px;outline:none;" onkeyup="
          const q = this.value.toLowerCase();
          document.querySelectorAll('.chat-item').forEach(i => {
            const n = i.querySelector('.chat-item-name').innerText.toLowerCase();
            i.style.display = n.includes(q) ? 'flex' : 'none';
          })
        ">
      </div>
      <div style="flex:1;overflow-y:auto;padding-top:10px;">
        ${convos.length === 0 ? `
          <div class="chat-list-empty">
            <div style="font-size:40px;margin-bottom:12px">💬</div>
            <div style="font-weight:500;margin-bottom:4px;color:#e2e8f0">لا توجد محادثات</div>
          </div>
        ` : ''}
        ${convos.map(c => {
          const initial = (c.name && c.name.length > 0) ? c.name[0].toUpperCase() : '?';
          const nameStr = c.name || 'مستخدم غير معروف';
          return `
          <div class="chat-item ${c.user_id === activeChatUserId ? 'active' : ''}" onclick="activeChatUserId=${c.user_id}; goView('a-chat')">
            <div class="chat-item-avatar">${initial}</div>
            <div class="chat-item-info">
              <div class="chat-item-header-row">
                <div class="chat-item-name">${nameStr}</div>
              </div>
              <div class="chat-item-msg-row">
                <div class="chat-item-msg">${c.last_message || 'لا توجد رسائل'}</div>
                ${c.unread ? `<div class="chat-unread-badge">${c.unread}</div>` : ''}
              </div>
            </div>
          </div>`;
        }).join('')}
      </div>
    </div>`;

  const getChatMainHtml = async () => {
    const activeConvo = convos.find(c => c.user_id === activeChatUserId);
    const msgs = await apiFetch(`/chat/${activeChatUserId}`);
    const initial = (activeConvo && activeConvo.name && activeConvo.name.length > 0) ? activeConvo.name[0].toUpperCase() : '?';
    const name = activeConvo ? (activeConvo.name || 'مستخدم غير معروف') : '';
    const lastMsgId = msgs.length > 0 ? msgs[msgs.length - 1].id : 0;

    setTimeout(() => {
      const body = document.getElementById('chatBody');
      if (body) { body.scrollTop = body.scrollHeight; startChatPoll(lastMsgId); }
    }, 100);

    return `
    <div class="chat-main" style="${isMobile ? 'width:100%;height:100%;flex:1;' : ''}">
      <div class="chat-head">
        <button class="chat-back-btn" onclick="activeChatUserId=null; goView('a-chat')" title="رجوع">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        </button>
        <div class="chat-head-info" style="align-items:flex-end;">
          <div class="chat-head-name">${name}</div>
        </div>
        <div class="chat-head-avatar">${initial}</div>
      </div>
      <div class="chat-body" id="chatBody">
        ${msgs.length === 0 ? `<div class="chat-no-msgs">لا توجد رسائل بعد — ابدأ المحادثة! 👋</div>` : ''}
        ${msgs.map(m => {
          const timeStr = m.created_at ? new Date(m.created_at).toLocaleTimeString('ar-EG', {hour:'2-digit',minute:'2-digit'}) : '12:00';
          return `
          <div class="bubble-wrap ${m.is_me ? 'out-wrap' : 'in-wrap'}">
            <div class="bubble ${m.is_me ? 'out' : 'in'}">
              ${m.content}
            </div>
          </div>`;
        }).join('')}
      </div>
      <div class="chat-input-area">
        <button class="chat-send-btn" onclick="sendChat()">إرسال</button>
        <input id="chatInput" class="chat-text-input" placeholder="اكتب رسالتك..." onkeypress="if(event.key==='Enter') sendChat()">
      </div>
    </div>`;
  };

  // ─── MOBILE: show only the chat window ───
  if (isMobile && activeChatUserId) {
    const mainHtml = await getChatMainHtml();
    return `<div style="display:flex;flex-direction:column;height:calc(100dvh - 60px);margin:-18px -18px 0 -18px;">${mainHtml}</div>`;
  }

  // ─── MOBILE: show only the chat list ───
  if (isMobile && !activeChatUserId) {
    return `
    <div style="display:flex;flex-direction:column;height:calc(100dvh - 60px);background:#1a202c;margin:-18px -18px 0 -18px;">
      <div style="padding:16px;text-align:center;font-size:20px;font-weight:700;color:#e2e8f0;background:#11151a;">مركز التواصل 💬</div>
      ${getChatListHtml(true)}
    </div>`;
  }

  // ─── DESKTOP: show list + chat side by side ───
  let chatMainHtml = activeChatUserId ? await getChatMainHtml() : getEmptyState();
  
  return `
  <div class="page-head">
    <div style="display:flex;justify-content:space-between;align-items:center;">
      <div>
        <h1 style="display:flex;align-items:center;gap:8px;">مركز التواصل 💬</h1>
        <p>تواصل مع أي عميل لديك بسهولة</p>
      </div>
    </div>
  </div>
  <div class="chat-wrap">
    ${getChatListHtml(false)}
    ${chatMainHtml}
  </div>
  `;
}

// ── Live polling for new messages (admin side) ──
async function fetchChatUpdates() {
  if (!activeChatUserId) return;
  const body = document.getElementById('chatBody');
  if (!body) return;
  try {
    const msgs = await apiFetch(`/chat/${activeChatUserId}`);
    if (!msgs || msgs.length === 0) return;
    const latestId = msgs[msgs.length - 1].id;
    if (latestId <= _chatLastMsgId) return;
    const newMsgs = msgs.filter(m => m.id > _chatLastMsgId);
    _chatLastMsgId = latestId;
    newMsgs.forEach(m => {
      const noMsgs = body.querySelector('.chat-no-msgs');
      if (noMsgs) noMsgs.remove();
      const timeStr = m.created_at ? new Date(m.created_at).toLocaleTimeString('ar-EG', {hour:'2-digit',minute:'2-digit'}) : '';
      body.insertAdjacentHTML('beforeend', `
        <div class="bubble-wrap ${m.is_me ? 'out-wrap' : 'in-wrap'}">
          <div class="bubble ${m.is_me ? 'out' : 'in'}">
            ${m.content}
            <div class="bubble-meta">
              <span class="bubble-time">${timeStr}</span>
            </div>
          </div>
        </div>`);
    });
    body.scrollTop = body.scrollHeight;
  } catch(e) { /* ignore */ }
}

function startChatPoll(initialLastId) {
  if (_chatPollTimer) clearInterval(_chatPollTimer);
  _chatLastMsgId = initialLastId || 0;
  _chatPollTimer = setInterval(fetchChatUpdates, 3000);
}

async function sendChat(){
  if(!activeChatUserId) return;
  const inp = document.getElementById('chatInput');
  const txt = inp.value.trim();
  if(!txt) return;
  
  inp.value = '';
  const body = document.getElementById('chatBody');
  const noMsgs = body.querySelector('.chat-no-msgs');
  if (noMsgs) noMsgs.remove();
  
  const tempId = 'temp-' + Date.now();
  body.insertAdjacentHTML('beforeend', `
    <div id="${tempId}" class="bubble-wrap out-wrap" style="opacity:0.5">
      <div class="bubble out">
        ${txt}
        <div class="bubble-meta">
          <span class="bubble-time">...</span>
        </div>
      </div>
    </div>
  `);
  body.scrollTop = body.scrollHeight;
  
  try {
    await apiFetch('/chat', {
      method: 'POST',
      body: JSON.stringify({ receiver_id: activeChatUserId, content: txt })
    });
    const tempEl = document.getElementById(tempId);
    if(tempEl) tempEl.remove();
    await fetchChatUpdates();
  } catch(e) {
    const tempEl = document.getElementById(tempId);
    if(tempEl) tempEl.remove();
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
  
  let workouts = [];
  let workoutsHistory = [];
  try {
    workouts = await apiFetch('/workouts/admin/client/' + window.currentClientId);
    workoutsHistory = await apiFetch('/workouts/history/' + window.currentClientId);
  } catch(e) { console.error(e); }
  
  const todayDate = new Date();
  const arabicDays = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const arabicMonths = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
  
  const calendarDays = [];
  for (let i = 0; i < 7; i++) {
      const d = new Date(todayDate);
      d.setDate(todayDate.getDate() + i);
      calendarDays.push({
          name: arabicDays[d.getDay()],
          dateStr: `${d.getDate()} ${arabicMonths[d.getMonth()]}`
      });
  }
  
  let workoutsHtml = '<div style="display:flex; flex-direction:column; gap:20px;">';
  
  calendarDays.forEach(dayObj => {
      const day = dayObj.name;
      const dayPlans = workouts.filter(p => p.day_of_week === day);
      
      let dayHtml = `
      <div style="background:var(--surface-2); border-radius:12px; border:1px solid var(--border); overflow:hidden;">
          <div style="background:var(--bg); padding:15px; border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center;">
              <h3 style="margin:0; font-size:16px; color:var(--text); display:flex; align-items:center; gap:10px;"><span style="font-size:20px;">📅</span> ${day} <span style="font-size:12px; color:var(--text-dim); font-weight:normal;">${dayObj.dateStr}</span></h3>
              <button class="btn btn-ghost btn-sm" style="color:var(--primary); font-size:12px; padding:4px 8px; border:1px solid var(--primary);" onclick="openAddPlanModal('${day}')">+ إضافة خطة لليوم</button>
          </div>
          <div style="padding:15px; display:flex; flex-direction:column; gap:15px;">
      `;
      
      if (dayPlans.length > 0) {
          dayHtml += dayPlans.map(p => `
              <div class="card" style="margin-bottom:0; border:1px solid var(--border); padding:0; overflow:hidden; background:var(--bg);">
                  <div style="display:flex; justify-content:space-between; align-items:center; padding:15px; cursor:pointer;" onclick="const content = this.nextElementSibling; const icon = this.querySelector('.toggle-icon'); if(content.style.display==='none'){content.style.display='flex'; icon.textContent='⬆️';}else{content.style.display='none'; icon.textContent='⬇️';}">
                      <div>
                          <h3 style="color:var(--text); margin-bottom:5px">${p.name} <span style="font-size:12px; font-weight:normal; color:var(--text-dim); margin-right:10px;">(${p.exercises.length} تمارين)</span></h3>
                      </div>
                      <div style="display:flex; gap:10px; align-items:center;">
                          <button class="btn btn-ghost" style="color:var(--coral); padding:4px 8px; font-size:12px" onclick="event.stopPropagation(); deleteAdminWorkoutPlan(${p.id})">حذف</button>
                          <span class="toggle-icon" style="color:var(--text-dim); font-size:18px; margin-right:10px;">⬇️</span>
                      </div>
                  </div>
                  <div style="display:none; flex-direction:column; gap:10px; padding:15px; background:var(--surface-2); border-top:1px solid var(--border);">
                      ${p.exercises.map(ex => {
                          const imgUrl = ex.video_url || ex.gif_url;
                          const bg = imgUrl ? "background: url('" + imgUrl + "') center/cover no-repeat;" : "background:#222;";
                          
                          let setRows = '';
                          for (let i = 1; i <= ex.sets; i++) {
                              setRows += `
                              <div style="display:flex; justify-content:space-between; align-items:center; padding:12px 0; border-bottom:1px solid var(--border); font-size:14px; color:var(--text);">
                                  <div style="flex:1; text-align:center;">
                                      <span style="display:inline-block; width:28px; height:28px; line-height:26px; border:1px solid var(--border); border-radius:6px; font-weight:bold; background:var(--bg);">${i}</span>
                                  </div>
                                  <div style="flex:1; text-align:center;">${ex.reps} عادي</div>
                                  <div style="flex:1; text-align:center;">${ex.weight}</div>
                                  <div style="flex:1; text-align:center; color:var(--text-dim);">${ex.rest_seconds}s</div>
                              </div>
                              `;
                          }
              
                          return `
                          <div style="background:var(--surface-2); border-radius:12px; border:1px solid var(--border); overflow:hidden; margin-bottom:10px;">
                            <div style="display:flex; justify-content:space-between; align-items:center; padding:15px; border-bottom:1px solid var(--border); background:var(--bg);">
                              <div style="display:flex; flex-direction:column; gap:5px;">
                                <h3 style="margin:0; font-size:16px; color:var(--text);">${ex.name}</h3>
                                <div style="font-size:12px; color:var(--text-dim);">عام</div>
                              </div>
                              <div style="width:60px; height:60px; border-radius:8px; border:1px solid var(--border); ${bg} flex-shrink:0;"></div>
                            </div>
                            
                            <div style="padding:0 15px; background:var(--surface-2);">
                              <div style="display:flex; justify-content:space-between; align-items:center; padding:12px 0; border-bottom:1px solid var(--border); font-size:12px; color:var(--text-dim); font-weight:bold;">
                                  <div style="flex:1; text-align:center;">المجموعات</div>
                                  <div style="flex:1; text-align:center;">عدات</div>
                                  <div style="flex:1; text-align:center;">الوزن (كجم)</div>
                                  <div style="flex:1; text-align:center;">راحة</div>
                              </div>
                              
                              ${setRows}
                              
                              <div style="display:flex; gap:10px; padding:15px 0; justify-content:center;">
                                  <button class="btn btn-ghost btn-sm" style="color:var(--primary); font-size:12px; padding:6px 15px; border:1px solid var(--primary); flex:1;" onclick="openEditExerciseModal(${ex.id}, ${ex.sets}, ${ex.reps}, ${ex.rest_seconds}, '${ex.weight}')">تعديل التمرين</button>
                                  <button class="btn btn-ghost btn-sm" style="color:var(--coral); font-size:12px; padding:6px 15px; border:1px solid var(--coral); flex:1;" onclick="deleteAdminExercise(${ex.id})">مسح التمرين</button>
                              </div>
                            </div>
                          </div>
                          `;
                      }).join('')}
                      <button class="btn btn-ghost" style="width:100%; border-color:var(--primary); color:var(--primary)" onclick="openAddExerciseModal(${p.id})">+ إضافة تمرين لهذه الخطة</button>
                  </div>
              </div>
          `).join('');
      } else {
          dayHtml += `<div style="text-align:center; color:var(--text-dim); padding:20px 0; font-size:14px;">لا توجد خطة مسجلة ليوم ${day}</div>`;
      }
      
      dayHtml += `</div></div>`;
      workoutsHtml += dayHtml;
  });
  
  const otherPlans = workouts.filter(p => !arabicDays.includes(p.day_of_week));
  if (otherPlans.length > 0) {
      let otherHtml = `
      <div style="background:var(--surface-2); border-radius:12px; border:1px solid var(--border); overflow:hidden;">
          <div style="background:var(--bg); padding:15px; border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center;">
              <h3 style="margin:0; font-size:16px; color:var(--text); display:flex; align-items:center; gap:10px;"><span style="font-size:20px;">📅</span> أيام أخرى / غير محدد</h3>
          </div>
          <div style="padding:15px; display:flex; flex-direction:column; gap:15px;">
      `;
      otherHtml += otherPlans.map(p => `
              <div class="card" style="margin-bottom:0; border:1px solid var(--border); padding:0; overflow:hidden; background:var(--bg);">
                  <div style="display:flex; justify-content:space-between; align-items:center; padding:15px; cursor:pointer;" onclick="const content = this.nextElementSibling; const icon = this.querySelector('.toggle-icon'); if(content.style.display==='none'){content.style.display='flex'; icon.textContent='⬆️';}else{content.style.display='none'; icon.textContent='⬇️';}">
                      <div>
                          <h3 style="color:var(--text); margin-bottom:5px">${p.name} <span style="font-size:12px; font-weight:normal; color:var(--text-dim); margin-right:10px;">(${p.exercises.length} تمارين)</span></h3>
                      </div>
                      <div style="display:flex; gap:10px; align-items:center;">
                          <button class="btn btn-ghost" style="color:var(--coral); padding:4px 8px; font-size:12px" onclick="event.stopPropagation(); deleteAdminWorkoutPlan(${p.id})">حذف</button>
                          <span class="toggle-icon" style="color:var(--text-dim); font-size:18px; margin-right:10px;">⬇️</span>
                      </div>
                  </div>
                  <div style="display:none; flex-direction:column; gap:10px; padding:15px; background:var(--surface-2); border-top:1px solid var(--border);">
                      <button class="btn btn-ghost" style="width:100%; border-color:var(--primary); color:var(--primary)" onclick="openAddExerciseModal(${p.id})">+ إضافة تمرين لهذه الخطة</button>
                  </div>
              </div>
      `).join('');
      otherHtml += `</div></div>`;
      workoutsHtml += otherHtml;
  }
  workoutsHtml += '</div>';
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
          ${activePlan.meals.map(m => {
            let altsHtml = '';
            try {
              const parsed = JSON.parse(m.items);
              if (parsed.alternatives && parsed.alternatives.length > 0) {
                 altsHtml = parsed.alternatives.map((alt, idx) => `
                   <div style="margin-bottom:8px">
                     <div style="color:var(--text-dim);font-size:11px;margin-bottom:3px">الخيار ${idx+1}:</div>
                     ${(alt.items||[]).map(i => `<div style="padding-left:10px; position:relative"><span style="position:absolute; right:0; top:0; color:var(--text-dim)">•</span> ${i.food_name || i.name} (${i.quantity_grams || i.amount || 0}g)</div>`).join('')}
                   </div>
                 `).join('');
              } else {
                 altsHtml = "لا يوجد بيانات للوجبة";
              }
            } catch(e) {
              altsHtml = m.items.split('+').map(item => `<div style="padding-left:10px; position:relative"><span style="position:absolute; right:0; top:0; color:var(--text-dim)">•</span> ${item.trim()}</div>`).join('');
            }
            return `
            <div style="padding:15px; background:var(--surface-2); border-radius:8px; border-left:3px solid var(--gold)">
              <div style="display:flex; justify-content:space-between; margin-bottom:8px">
                <b>${m.name}</b>
                <span style="font-size:12px; color:var(--gold)">${m.calories} سعرة</span>
              </div>
              <div style="font-size:13px; color:var(--text); line-height:1.6">
                ${altsHtml}
              </div>
            </div>
            `;
          }).join('')}
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
  
  const activeTab = window.currentClientTabId || 't1';

  return `
  <div class="page-head">
    <div class="client-top" style="margin-bottom:6px">
      <div class="client-avatar" style="width:52px;height:52px;font-size:18px">${c.full_name[0]}</div>
      <div>
        <h1 style="font-size:22px">${c.full_name}</h1>
        <p>${c.subscription || 'غير مشترك'} — انضم ${c.joined}
          ${c.service_type ? `<span class="tag" style="margin-right:8px;background:rgba(200,255,61,0.12);color:var(--lime);border:1px solid rgba(200,255,61,0.3);font-size:11px">${c.service_type === 'nutrition' ? '🥗 تغذية' : c.service_type === 'nutrition_fitness' ? '🥗💪 تغذية+فيتنس' : '🏋️ جيم'}</span>` : ''}
          ${c.subscription_end ? `<span style="font-size:12px;color:var(--gold)">⏰ ينتهي: ${c.subscription_end}</span>` : ''}
        </p>
      </div>
    </div>
  </div>
  <div class="tabs" style="flex-wrap:wrap;gap:4px">
    <button class="tab-btn ${activeTab === 't1' ? 'active' : ''}" data-tab="t1" onclick="switchTab(this,'t1')">نظرة عامة</button>
    <button class="tab-btn ${activeTab === 'thealth' ? 'active' : ''}" style="color:var(--gold)" data-tab="thealth" onclick="switchTab(this,'thealth')">🏥 الصحة والتمارين</button>
    <button class="tab-btn ${activeTab === 'tphotos' ? 'active' : ''}" style="color:var(--steel)" data-tab="tphotos" onclick="switchTab(this,'tphotos')">📸 صور الجسم</button>
    <button class="tab-btn ${activeTab === 't2' ? 'active' : ''}" data-tab="t2" onclick="switchTab(this,'t2')">بيانات InBody</button>
    <button class="tab-btn ${activeTab === 't3' ? 'active' : ''}" data-tab="t3" onclick="switchTab(this,'t3')">التمارين</button>
    <button class="tab-btn ${activeTab === 't4' ? 'active' : ''}" data-tab="t4" onclick="switchTab(this,'t4')">النظام الغذائي</button>
    <button class="tab-btn ${activeTab === 'treminder' ? 'active' : ''}" style="color:var(--cyan)" data-tab="treminder" onclick="switchTab(this,'treminder')">📅 تذكير موعد</button>
    <button class="tab-btn ${activeTab === 't6' ? 'active' : ''}" style="color:var(--cyan)" data-tab="t6" onclick="switchTab(this,'t6')">التحليلات</button>
    <button class="tab-btn ${activeTab === 't7' ? 'active' : ''}" style="color:var(--primary)" data-tab="t7" onclick="switchTab(this,'t7')">CV</button>
    <button class="tab-btn ${activeTab === 't5' ? 'active' : ''}" style="color:var(--coral)" data-tab="t5" onclick="switchTab(this,'t5')">إعدادات الحساب</button>
    <button class="tab-btn no-print" style="background:var(--lime);color:#000;margin-right:auto" onclick="printClientReport(${c.id})">🖨️ طباعة التقرير</button>
  </div>

  <div class="tab-panel ${activeTab === 't1' ? 'active' : ''}" id="t1">
    <div class="grid grid-3" style="margin-bottom:20px">
      <div class="card"><div class="stat-label">الوزن الحالي</div><div class="stat-num" style="font-size:22px">${c.weight ? c.weight + ' كجم' : '—'}</div></div>
      <div class="card"><div class="stat-label">تليفون</div><div class="stat-num" style="font-size:18px">${c.phone || 'غير مسجل'}</div></div>
      <div class="card"><div class="stat-label">نسبة الدهون</div><div class="stat-num" style="font-size:22px">${c.body_fat ? c.body_fat + '%' : '—'}</div></div>
    </div>
    ${(c.body_photo_front || c.body_photo_back || c.body_photo_side) ? `
    <div class="card" style="margin-bottom:16px">
      <h3 style="color:var(--steel); margin-bottom:12px; font-size:15px">📸 آخر صور الجسم ${c.body_photo_date ? '(' + c.body_photo_date + ')' : ''}</h3>
      <div class="photos-upload-grid" style="max-width:500px">
        ${c.body_photo_front ? `<div class="photo-slot"><img src="${c.body_photo_front}"><div class="photo-date-badge">الوش</div></div>` : ''}
        ${c.body_photo_back ? `<div class="photo-slot"><img src="${c.body_photo_back}"><div class="photo-date-badge">الظهر</div></div>` : ''}
        ${c.body_photo_side ? `<div class="photo-slot"><img src="${c.body_photo_side}"><div class="photo-date-badge">الجنب</div></div>` : ''}
      </div>
    </div>` : ''}
  </div>

  <!-- Health & Workout Tab -->
  <div class="tab-panel ${activeTab === 'thealth' ? 'active' : ''}" id="thealth">
    <div class="section-title">🏥 الحالة الصحية والتمارين</div>
    <div class="grid grid-2">
      <div class="card">
        <h3 style="color:var(--gold); margin-bottom:14px; font-size:15px">🏋️ معلومات التمرين</h3>
        <div style="display:flex; flex-direction:column; gap:10px; font-size:14px">
          <div style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid var(--border)">
            <span style="color:var(--text-dim)">بيتمرن؟</span>
            <span style="color:${c.is_active_workout ? 'var(--lime)' : 'var(--coral)'}">${c.is_active_workout ? '✅ نعم' : '❌ لا'}</span>
          </div>
          ${c.is_active_workout ? `
          <div style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid var(--border)">
            <span style="color:var(--text-dim)">أيام التمرين</span>
            <span>${c.workout_days_per_week || '—'} أيام/أسبوع</span>
          </div>
          <div style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid var(--border)">
            <span style="color:var(--text-dim)">نوع التمرين</span>
            <span>${c.workout_type || '—'}</span>
          </div>
          <div style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid var(--border)">
            <span style="color:var(--text-dim)">نوع الرياضة</span>
            <span>${c.sport_type || '—'}</span>
          </div>
          ${c.workout_schedule ? (() => {
            try {
              const sched = JSON.parse(c.workout_schedule);
              return `<div style="padding:8px 0">
                <div style="color:var(--text-dim); margin-bottom:6px">جدول التمرين:</div>
                ${Object.entries(sched).map(([day, time]) => `<div style="display:flex; justify-content:space-between; font-size:12px; padding:3px 0"><span>${day}</span><span style="color:var(--gold)">${time}</span></div>`).join('')}
              </div>`;
            } catch(e) { return `<div>${c.workout_schedule}</div>`; }
          })() : ''}
          ` : ''}
        </div>
      </div>
      <div class="card">
        <h3 style="color:var(--coral); margin-bottom:14px; font-size:15px">🏥 الحالة الصحية</h3>
        <div style="display:flex; flex-direction:column; gap:10px; font-size:14px">
          <div style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid var(--border)">
            <span style="color:var(--text-dim)">إصابات سابقة</span>
            <span style="color:${c.has_injury ? 'var(--coral)' : 'var(--lime)'}">${c.has_injury ? '⚠️ نعم' : '✅ لا'}</span>
          </div>
          ${c.has_injury && c.injury_details ? `
          <div style="padding:8px 0; border-bottom:1px solid var(--border)">
            <div style="color:var(--text-dim); font-size:12px; margin-bottom:4px">تفاصيل الإصابة:</div>
            <div style="font-size:13px; color:var(--text)">${(() => { try { const d = JSON.parse(c.injury_details); return d.map(i => `${i.type} (${i.date}) — ${i.recovered}`).join('<br>'); } catch(e) { return c.injury_details; } })()}</div>
          </div>` : ''}
          <div style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid var(--border)">
            <span style="color:var(--text-dim)">بياخد أدوية</span>
            <span style="color:${c.takes_medication ? 'var(--gold)' : 'var(--lime)'}">${c.takes_medication ? '💊 نعم' : '✅ لا'}</span>
          </div>
          ${c.takes_medication && c.medication_details ? `
          <div style="padding:8px 0; border-bottom:1px solid var(--border)">
            <div style="color:var(--text-dim); font-size:12px; margin-bottom:4px">الأدوية:</div>
            <div style="font-size:13px">${(() => { try { const d = JSON.parse(c.medication_details); return d.map(m => m.name).join('، '); } catch(e) { return c.medication_details; } })()}</div>
          </div>` : ''}
          <div style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid var(--border)">
            <span style="color:var(--text-dim)">مشاكل صحية</span>
            <span style="color:${c.has_health_issues ? 'var(--coral)' : 'var(--lime)'}">${c.has_health_issues ? '⚠️ نعم' : '✅ لا'}</span>
          </div>
          ${c.has_health_issues && c.health_issues_details ? `
          <div style="padding:8px 0">
            <div style="color:var(--text-dim); font-size:12px; margin-bottom:4px">التفاصيل:</div>
            <div style="font-size:13px">${c.health_issues_details}</div>
          </div>` : ''}
          ${c.notes ? `<div style="padding:8px 0; color:var(--text-dim); font-size:12px">ملاحظات: ${c.notes}</div>` : ''}
        </div>
      </div>
    </div>
  </div>

  <!-- Body Photos Tab -->
  <div class="tab-panel ${activeTab === 'tphotos' ? 'active' : ''}" id="tphotos">
    <div class="section-title">📸 صور تقدم الجسم <span>الوش / الظهر / الجنب</span></div>
    ${(c.body_photo_front || c.body_photo_back || c.body_photo_side) ? `
    <div class="card" style="margin-bottom:20px">
      <h3 style="color:var(--steel); margin-bottom:12px; font-size:14px">الصور الحالية ${c.body_photo_date ? '— رُفعت ' + c.body_photo_date : ''}</h3>
      <div class="photos-upload-grid">
        <div class="photo-slot">
          ${c.body_photo_front ? `<img src="${c.body_photo_front}"><div class="photo-date-badge">📸 الوش</div>` : `<div class="photo-icon">👤</div><div class="photo-label">الوش</div>`}
        </div>
        <div class="photo-slot">
          ${c.body_photo_back ? `<img src="${c.body_photo_back}"><div class="photo-date-badge">📸 الظهر</div>` : `<div class="photo-icon">🔄</div><div class="photo-label">الظهر</div>`}
        </div>
        <div class="photo-slot">
          ${c.body_photo_side ? `<img src="${c.body_photo_side}"><div class="photo-date-badge">📸 الجنب</div>` : `<div class="photo-icon">👤</div><div class="photo-label">الجنب</div>`}
        </div>
      </div>
    </div>` : ''}
    <div class="card">
      <h3 style="color:var(--lime); margin-bottom:16px; font-size:15px">📤 رفع صور جديدة</h3>
      <div class="photos-upload-grid">
        <div>
          <div class="photo-slot" id="slotFront" onclick="document.getElementById('bodyPhotoFront').click()">
            <div class="photo-icon">👤</div>
            <div class="photo-label">صورة الوش</div>
          </div>
          <input type="file" id="bodyPhotoFront" accept="image/*" style="display:none" onchange="previewBodyPhoto(this,'slotFront')">
        </div>
        <div>
          <div class="photo-slot" id="slotBack" onclick="document.getElementById('bodyPhotoBack').click()">
            <div class="photo-icon">🔄</div>
            <div class="photo-label">صورة الظهر</div>
          </div>
          <input type="file" id="bodyPhotoBack" accept="image/*" style="display:none" onchange="previewBodyPhoto(this,'slotBack')">
        </div>
        <div>
          <div class="photo-slot" id="slotSide" onclick="document.getElementById('bodyPhotoSide').click()">
            <div class="photo-icon">👤</div>
            <div class="photo-label">صورة الجنب</div>
          </div>
          <input type="file" id="bodyPhotoSide" accept="image/*" style="display:none" onchange="previewBodyPhoto(this,'slotSide')">
        </div>
      </div>
      <p style="font-size:12px; color:var(--text-dim); margin-bottom:12px">اضغط على أي صورة لاختيار الملف. بعد الاختيار اضغط رفع.</p>
      <button class="btn btn-primary" id="uploadPhotosBtn" onclick="uploadBodyPhotos(${c.id})">📤 رفع الصور</button>
    </div>
  </div>

  <!-- Appointment Reminder Tab -->
  <div class="tab-panel ${activeTab === 'treminder' ? 'active' : ''}" id="treminder">
    <div class="section-title">📅 إرسال تذكير موعد</div>
    <div class="card" style="max-width:500px">
      <p style="color:var(--text-dim); font-size:13px; margin-bottom:16px">ابعت تذكير لـ ${c.full_name} بموعده القادم — هيوصله إشعار في الأبلكيشن.</p>
      <div class="field" style="margin-bottom:12px">
        <label>تاريخ الموعد</label>
        <input type="date" id="reminderDate_${c.id}" class="settings-input" style="width:100%" min="${new Date().toISOString().split('T')[0]}">
      </div>
      <div class="field" style="margin-bottom:16px">
        <label>ملاحظة للعميل (اختياري)</label>
        <input type="text" id="reminderNote_${c.id}" placeholder="مثال: فضلاً الجهوز ١٠ دقائق قبل الموعد" class="settings-input" style="width:100%">
      </div>
      <button class="btn btn-primary" onclick="sendAppointmentReminder(${c.id})">📅 إرسال التذكير</button>
    </div>
  </div>

  <div class="tab-panel ${activeTab === 't2' ? 'active' : ''}" id="t2">
    ${renderInBodyDashboard(history)}
  </div>

  <div class="tab-panel ${activeTab === 't6' ? 'active' : ''}" id="t6">
    <div class="section-title">لوحة التحليلات المتقدمة <span>الرسوم البيانية وسجل التمارين</span></div>
    ${renderAnalyticsDashboard(history, workoutsHistory)}
  </div>

  <div class="tab-panel ${activeTab === 't3' ? 'active' : ''}" id="t3">
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px">
      <div class="section-title" style="margin:0">التمارين المخصصة</div>
      <button class="btn btn-primary" style="padding:5px 10px; font-size:12px" onclick="openAddPlanModal()">+ إنشاء خطة</button>
    </div>
    ${workoutsHtml}
  </div>

  <div class="tab-panel ${activeTab === 't4' ? 'active' : ''}" id="t4">
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px">
      <div class="section-title" style="margin:0">النظام الغذائي <span>الخطة الحالية</span></div>
      <button class="btn btn-outline" style="padding:5px 10px; font-size:12px; color:var(--lime); border-color:var(--lime)" onclick="openManualNutritionModal(${c.id})">🛠️ إنشاء نظام يدوياً</button>
    </div>
    ${nutritionHtml}
  </div>

  <div class="tab-panel ${activeTab === 't7' ? 'active' : ''}" id="t7">
    <div class="section-title">فيديوهات التمارين (CV) <span>المسجلة بالذكاء الاصطناعي</span></div>
    <div class="grid grid-2">
      ${(c.fitness_tests && c.fitness_tests.length > 0) ? c.fitness_tests.map(t => `
        <div class="card" style="padding:15px; border-left:3px solid var(--primary)">
          <div style="display:flex; justify-content:space-between; margin-bottom:10px">
            <span style="color:var(--lime); font-weight:bold">${t.date}</span>
            <span style="color:var(--text-dim)">⏱ ${t.duration} ثانية</span>
          </div>
          <div style="display:flex; justify-content:space-between; margin-bottom:15px; font-size:18px">
            <span>العدات: <b style="color:var(--primary)">${t.reps}</b></span>
          </div>
          <a href="http://localhost:8000${t.video_url}" target="_blank" class="btn btn-primary" style="display:block; text-align:center; text-decoration:none">▶ مشاهدة الفيديو</a>
        </div>
      `).join('') : '<div style="color:var(--text-dim); padding:20px; text-align:center; grid-column:1/-1">لا توجد فيديوهات مسجلة للعميل حتى الآن.</div>'}
    </div>
  </div>

  <div class="tab-panel ${activeTab === 't5' ? 'active' : ''}" id="t5">
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
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:15px">
        <div>
          <b style="font-size:16px">تصريح الـ CV: ${c.cv_access ? '<span style="color:var(--lime)">مفعل</span>' : '<span style="color:var(--coral)">موقوف</span>'}</b>
          <div class="stat-sub" style="margin-top:4px">لما توقف التصريح، العميل مش هيقدر يستخدم كاميرا الموبايل لتسجيل التمارين.</div>
        </div>
        <button class="btn btn-ghost" style="color:${c.cv_access ? 'var(--coral)' : 'var(--lime)'}" onclick="toggleClientCVAccess()">${c.cv_access ? 'إيقاف التصريح' : 'تفعيل التصريح'}</button>
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

async function toggleClientCVAccess() {
  if(!window.currentClientId) return;
  try {
    await apiFetch('/admin/clients/' + window.currentClientId + '/toggle-cv-access', { method: 'POST' });
    toast('تم تغيير صلاحية الكاميرا');
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
  
  if (id.startsWith('t')) {
      window.currentClientTabId = id;
  }
}

let adminExercisesCache = [];
let adminCategoriesCache = [];
let currentAdminExLimit = 50;

/* ---- Admin Exercise Library (Sections Mode) ---- */
views['a-library'] = async () => {
  [adminExercisesCache, adminCategoriesCache] = await Promise.all([
    apiFetch('/admin/exercises'),
    apiFetch('/admin/exercise-categories'),
  ]);
  return renderLibraryPage();
};

function renderLibraryPage() {
  const cats = adminCategoriesCache;
  const catsHtml = cats.length === 0
    ? `<div style="text-align:center;padding:60px 20px;color:var(--text-dim);">
        <div style="font-size:48px;margin-bottom:16px;">📂</div>
        <h3 style="margin-bottom:8px;">لا يوجد أقسام بعد</h3>
        <p style="margin-bottom:20px;">ابدأ بإضافة قسم جديد (مثل: صدر، ظهر، أرجل)</p>
        <button class="btn btn-primary" onclick="openAddCategoryModal()">+ إضافة أول قسم</button>
      </div>`
    : cats.map(cat => renderCategoryCard(cat)).join('');

  return `
  <div class="page-head" style="display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:15px;margin-bottom:24px;">
    <div>
      <h1>مكتبة التمارين</h1>
      <p style="color:var(--text-dim)">${cats.length} قسم · ${adminExercisesCache.length} تمرين في قاعدة البيانات</p>
    </div>
    <div style="display:flex;gap:10px;">
      <button class="btn btn-ghost" style="border:1px solid var(--border)" onclick="openUploadExerciseModal()">📤 رفع تمرين جديد</button>
      <button class="btn btn-primary" onclick="openAddCategoryModal()">+ إضافة قسم</button>
    </div>
  </div>
  <div id="categoriesContainer">
    ${catsHtml}
  </div>

  <!-- Add/Edit Category Modal -->
  <div class="modal-overlay" id="categoryModal">
    <div class="modal-box" style="max-width:440px;">
      <div class="modal-head">
        <h3 id="categoryModalTitle">إضافة قسم جديد</h3>
        <button class="btn btn-icon" onclick="closeCategoryModal()">✕</button>
      </div>
      <div style="padding:20px;display:flex;flex-direction:column;gap:14px;">
        <div>
          <label class="settings-label">اسم القسم *</label>
          <input id="catName" class="settings-input" placeholder="مثال: تمارين الصدر">
        </div>
        <div>
          <label class="settings-label">أيقونة (إيموجي اختياري)</label>
          <input id="catIcon" class="settings-input" placeholder="مثال: 💪" maxlength="4" style="width:80px">
        </div>
        <div>
          <label class="settings-label">وصف اختياري</label>
          <textarea id="catDesc" class="settings-input" rows="2" placeholder="وصف القسم..."></textarea>
        </div>
        <div style="display:flex;gap:10px;justify-content:flex-end;">
          <button class="btn btn-ghost" onclick="closeCategoryModal()">إلغاء</button>
          <button class="btn btn-primary" onclick="saveCategoryModal()">حفظ القسم</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Add Exercise to Category Modal -->
  <div class="modal-overlay" id="addExToCatModal">
    <div class="modal-box" style="max-width:560px;">
      <div class="modal-head">
        <h3>إضافة تمرين للقسم</h3>
        <button class="btn btn-icon" onclick="closeAddExToCatModal()">✕</button>
      </div>
      <div style="padding:20px;display:flex;flex-direction:column;gap:14px;">
        <input id="exSearchInModal" class="settings-input" placeholder="بحث عن تمرين..." oninput="filterExInModal(this.value)">
        <div id="exListInModal" style="max-height:320px;overflow-y:auto;display:flex;flex-direction:column;gap:6px;"></div>
        <div style="border-top:1px solid var(--border);padding-top:14px;display:flex;flex-direction:column;gap:10px;">
          <div style="display:flex;gap:10px;">
            <div style="flex:1">
              <label class="settings-label">السيتات</label>
              <input id="exSets" class="settings-input" type="number" placeholder="مثال: 4" min="1" max="20">
            </div>
            <div style="flex:1">
              <label class="settings-label">التكرارات</label>
              <input id="exReps" class="settings-input" placeholder="مثال: 8-12">
            </div>
          </div>
          <div>
            <label class="settings-label">ملاحظة اختيارية</label>
            <input id="exNote" class="settings-input" placeholder="مثال: ركز على الشد">
          </div>
        </div>
        <div style="display:flex;gap:10px;justify-content:flex-end;">
          <button class="btn btn-ghost" onclick="closeAddExToCatModal()">إلغاء</button>
          <button class="btn btn-primary" onclick="confirmAddExToCategory()">إضافة التمرين</button>
        </div>
      </div>
    </div>
  </div>
  `;
}

function renderCategoryCard(cat) {
  const exRows = cat.exercises.length === 0
    ? `<div style="text-align:center;padding:20px;color:var(--text-dimmer);font-size:13px;">لا يوجد تمارين في هذا القسم بعد</div>`
    : cat.exercises.map(ex => `
      <div style="display:flex;align-items:center;gap:12px;padding:10px 14px;background:var(--surface);border-radius:10px;border:1px solid var(--border);">
        ${ex.gif_url || ex.video_url
          ? `<img src="${ex.gif_url || ex.video_url}" style="width:48px;height:48px;border-radius:8px;object-fit:cover;flex-shrink:0;" onerror="this.style.display='none'">`
          : `<div style="width:48px;height:48px;border-radius:8px;background:var(--surface-3);display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;">🏋️</div>`}
        <div style="flex:1;min-width:0;">
          <div style="font-weight:700;font-size:14px;">${ex.name}</div>
          <div style="font-size:12px;color:var(--text-dim);">${ex.muscle_group}${ex.sets ? ` · ${ex.sets} سيت` : ''}${ex.reps ? ` × ${ex.reps}` : ''}${ex.notes ? ` · ${ex.notes}` : ''}</div>
        </div>
        <button class="btn btn-icon" style="color:var(--coral);background:rgba(230,57,70,.1);" onclick="removeExFromCategory(${cat.id}, ${ex.cat_exercise_id})" title="إزالة">✕</button>
      </div>`).join('');

  return `
  <div class="card" style="margin-bottom:20px;" id="cat-${cat.id}">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;flex-wrap:wrap;gap:10px;">
      <div style="display:flex;align-items:center;gap:10px;">
        <span style="font-size:28px;">${cat.icon || '📌'}</span>
        <div>
          <h3 style="font-size:18px;font-weight:800;">${cat.name}</h3>
          ${cat.description ? `<p style="font-size:12px;color:var(--text-dim);margin-top:2px;">${cat.description}</p>` : ''}
        </div>
        <span style="background:var(--surface-2);border:1px solid var(--border);border-radius:999px;padding:2px 10px;font-size:12px;color:var(--text-dim);">${cat.exercises.length} تمرين</span>
      </div>
      <div style="display:flex;gap:8px;">
        <button class="btn btn-ghost btn-sm" style="border:1px solid var(--border)" onclick="openEditCategoryModal(${cat.id})">✏️ تعديل</button>
        <button class="btn btn-ghost btn-sm" style="border:1px solid var(--border);color:var(--coral)" onclick="deleteCategoryConfirm(${cat.id})">🗑️ حذف</button>
        <button class="btn btn-primary btn-sm" onclick="openAddExToCatModal(${cat.id})">+ إضافة تمرين</button>
      </div>
    </div>
    <div style="display:flex;flex-direction:column;gap:8px;" id="exList-${cat.id}">
      ${exRows}
    </div>
  </div>`;
}

// ── Category Modal Logic ──────────────────────────────────────
let _editingCatId = null;
function openAddCategoryModal() {
  _editingCatId = null;
  document.getElementById('categoryModalTitle').innerText = 'إضافة قسم جديد';
  document.getElementById('catName').value = '';
  document.getElementById('catIcon').value = '';
  document.getElementById('catDesc').value = '';
  document.getElementById('categoryModal').classList.add('show');
}
function openEditCategoryModal(catId) {
  const cat = adminCategoriesCache.find(c => c.id === catId);
  if (!cat) return;
  _editingCatId = catId;
  document.getElementById('categoryModalTitle').innerText = 'تعديل القسم';
  document.getElementById('catName').value = cat.name;
  document.getElementById('catIcon').value = cat.icon || '';
  document.getElementById('catDesc').value = cat.description || '';
  document.getElementById('categoryModal').classList.add('show');
}
function closeCategoryModal() {
  document.getElementById('categoryModal').classList.remove('show');
}
async function saveCategoryModal() {
  const name = document.getElementById('catName').value.trim();
  if (!name) return toast('يرجى كتابة اسم القسم!');
  const data = {
    name,
    icon: document.getElementById('catIcon').value.trim() || null,
    description: document.getElementById('catDesc').value.trim() || null,
  };
  try {
    if (_editingCatId) {
      await apiFetch('/admin/exercise-categories/' + _editingCatId, { method: 'PUT', body: JSON.stringify(data) });
      toast('✅ تم تعديل القسم');
    } else {
      await apiFetch('/admin/exercise-categories', { method: 'POST', body: JSON.stringify(data) });
      toast('✅ تم إضافة القسم');
    }
    closeCategoryModal();
    adminCategoriesCache = await apiFetch('/admin/exercise-categories');
    document.getElementById('categoriesContainer').innerHTML =
      adminCategoriesCache.length === 0
        ? `<div style="text-align:center;padding:60px;color:var(--text-dim);">لا يوجد أقسام — اضغط "+ إضافة قسم"</div>`
        : adminCategoriesCache.map(renderCategoryCard).join('');
  } catch(e) { toast('❌ ' + e.message); }
}
async function deleteCategoryConfirm(catId) {
  const cat = adminCategoriesCache.find(c => c.id === catId);
  showConfirm(`هل تريد حذف قسم "${cat?.name}" وكل تمارينه؟`, async () => {
    try {
      await apiFetch('/admin/exercise-categories/' + catId, { method: 'DELETE' });
      toast('✅ تم حذف القسم');
      adminCategoriesCache = adminCategoriesCache.filter(c => c.id !== catId);
      const el = document.getElementById('cat-' + catId);
      if (el) el.remove();
    } catch(e) { toast('❌ ' + e.message); }
  });
}

// ── Add Exercise to Category Modal ─────────────────────────────
let _targetCatId = null;
let _selectedExId = null;
function openAddExToCatModal(catId) {
  _targetCatId = catId;
  _selectedExId = null;
  document.getElementById('exSearchInModal').value = '';
  document.getElementById('exSets').value = '';
  document.getElementById('exReps').value = '';
  document.getElementById('exNote').value = '';
  renderExListInModal(adminExercisesCache);
  document.getElementById('addExToCatModal').classList.add('show');
}
function closeAddExToCatModal() {
  document.getElementById('addExToCatModal').classList.remove('show');
  _targetCatId = null; _selectedExId = null;
}
function renderExListInModal(exercises) {
  const container = document.getElementById('exListInModal');
  if (!container) return;
  container.innerHTML = exercises.slice(0, 60).map(ex => `
    <div id="exOpt-${ex.id}" onclick="selectExInModal(${ex.id})" style="display:flex;align-items:center;gap:10px;padding:8px 12px;border-radius:8px;border:2px solid var(--border);cursor:pointer;transition:.15s;background:var(--surface);">
      <div style="flex:1;">
        <div style="font-weight:700;font-size:14px;">${ex.name}</div>
        <div style="font-size:11px;color:var(--text-dim);">${ex.muscle_group} · ${ex.difficulty || 'عام'}</div>
      </div>
    </div>`).join('');
}
function filterExInModal(query) {
  const q = query.toLowerCase();
  const filtered = adminExercisesCache.filter(ex =>
    ex.name.toLowerCase().includes(q) || ex.muscle_group.toLowerCase().includes(q));
  renderExListInModal(filtered);
}
function selectExInModal(exId) {
  _selectedExId = exId;
  document.querySelectorAll('[id^="exOpt-"]').forEach(el => {
    el.style.borderColor = 'var(--border)';
    el.style.background = 'var(--surface)';
  });
  const el = document.getElementById('exOpt-' + exId);
  if (el) { el.style.borderColor = 'var(--accent)'; el.style.background = 'rgba(74,144,226,.1)'; }
}
async function confirmAddExToCategory() {
  if (!_selectedExId) return toast('اختار تمرين الأول!');
  const data = {
    exercise_id: _selectedExId,
    sets: parseInt(document.getElementById('exSets').value) || null,
    reps: document.getElementById('exReps').value.trim() || null,
    notes: document.getElementById('exNote').value.trim() || null,
  };
  try {
    await apiFetch('/admin/exercise-categories/' + _targetCatId + '/exercises', { method: 'POST', body: JSON.stringify(data) });
    toast('✅ تم إضافة التمرين');
    closeAddExToCatModal();
    // refresh categories
    adminCategoriesCache = await apiFetch('/admin/exercise-categories');
    const cat = adminCategoriesCache.find(c => c.id === _targetCatId);
    if (cat) {
      const el = document.getElementById('cat-' + _targetCatId);
      if (el) {
        const tmp = document.createElement('div');
        tmp.innerHTML = renderCategoryCard(cat);
        el.replaceWith(tmp.firstElementChild);
      }
    }
  } catch(e) { toast('❌ ' + e.message); }
}
async function removeExFromCategory(catId, itemId) {
  try {
    await apiFetch('/admin/exercise-categories/' + catId + '/exercises/' + itemId, { method: 'DELETE' });
    toast('✅ تمت الإزالة');
    adminCategoriesCache = await apiFetch('/admin/exercise-categories');
    const cat = adminCategoriesCache.find(c => c.id === catId);
    if (cat) {
      const el = document.getElementById('cat-' + catId);
      if (el) {
        const tmp = document.createElement('div');
        tmp.innerHTML = renderCategoryCard(cat);
        el.replaceWith(tmp.firstElementChild);
      }
    }
  } catch(e) { toast('❌ ' + e.message); }
}
window.openAddCategoryModal = openAddCategoryModal;
window.closeCategoryModal = closeCategoryModal;
window.saveCategoryModal = saveCategoryModal;
window.openEditCategoryModal = openEditCategoryModal;
window.deleteCategoryConfirm = deleteCategoryConfirm;
window.openAddExToCatModal = openAddExToCatModal;
window.closeAddExToCatModal = closeAddExToCatModal;
window.selectExInModal = selectExInModal;
window.filterExInModal = filterExInModal;
window.confirmAddExToCategory = confirmAddExToCategory;
window.removeExFromCategory = removeExFromCategory;

function filterAdminExercises(query, resetLimit=true) {
    if(resetLimit) currentAdminExLimit = 50;
    query = query.toLowerCase();
    const filtered = adminExercisesCache.filter(ex =>
        ex.name.toLowerCase().includes(query) ||
        ex.muscle_group.toLowerCase().includes(query)
    );
    const grid = document.getElementById('exGrid');
    if (grid) grid.innerHTML = renderAdminExercises(filtered);
    const lbl = document.getElementById('exCountLbl');
    if (lbl) lbl.innerText = `التمارين المتوفرة في قاعدة البيانات (${filtered.length})`;
}

function loadMoreAdminExercises() {
    currentAdminExLimit += 50;
    const query = document.getElementById('exSearch') ? document.getElementById('exSearch').value : '';
    filterAdminExercises(query, false);
}

function renderAdminExercises(exercises) {
    if (exercises.length === 0) return '<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text-dim)">مفيش تمارين مطابقة</div>';
    const visibleExercises = exercises.slice(0, currentAdminExLimit);
    let html = visibleExercises.map(ex=>{
      const imgUrl = ex.video_url || ex.gif_url;
      const bg = imgUrl ? `background: url('${imgUrl}') center/cover no-repeat;` : 'background:#222;';
      return `
      <div class="card ex-card" style="cursor:pointer; padding:0; overflow:hidden;" onclick="openExercisePreviewModal(${ex.id}, '${ex.name.replace(/'/g, "\\'")}', '${imgUrl || ''}', '${ex.muscle_group}')">
        <div class="ex-thumb" style="${bg} display:flex;align-items:center;justify-content:center;position:relative;height:160px;">
          <span class="tag" style="position:absolute;top:10px;right:10px">${ex.muscle_group}</span>
          <div class="play" style="opacity:0.8;background:rgba(0,0,0,0.5);border-radius:50%;width:40px;height:40px;display:flex;align-items:center;justify-content:center;color:white;">▶</div>
          <span class="gif-lbl" style="position:absolute;bottom:10px;left:10px;background:rgba(0,0,0,0.7);padding:2px 8px;border-radius:4px;font-size:11px">${ex.difficulty || 'عام'}</span>
        </div>
        <div class="ex-info" style="padding:15px">
          <div class="ex-name" style="font-weight:bold;font-size:16px;">${ex.name}</div>
          <div class="ex-meta" style="color:var(--text-dim);font-size:12px;margin-top:5px">انقر للعرض أو الحذف</div>
        </div>
      </div>`
    }).join('');
    if (exercises.length > currentAdminExLimit) {
        html += `<div style="grid-column:1/-1;text-align:center;padding:20px;"><button class="btn btn-ghost" style="border:1px solid var(--border);" onclick="loadMoreAdminExercises()">عرض المزيد... (${exercises.length - currentAdminExLimit} تمرين)</button></div>`;
    }
    return html;
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
    const res = await apiFetch('/ai/generate-plan', {
      method: 'POST',
      body: JSON.stringify({
        client_id: parseInt(clientId),
        goal: goal
      })
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
    
    let mealsHtml = plan.meals.map(m => {
      let mealBody = '';
      try {
        const parsed = JSON.parse(m.items);
        const mealTime = parsed.meal_time || '';
        const mealRole = parsed.meal_role || '';
        const alts = parsed.alternatives || [];
        
        if (alts.length > 0) {
          mealBody = alts.map((alt, idx) => `
            <div style="margin-bottom:12px; background:var(--surface-3); border-radius:8px; padding:12px;">
              <div style="font-size:12px; font-weight:800; color:var(--gold); margin-bottom:8px;">🔄 ${alt.alternative_label || 'الخيار ' + (idx+1)}</div>
              ${(alt.items||[]).map(item => `
                <div style="display:flex; justify-content:space-between; padding:4px 0; border-bottom:1px dashed var(--border); font-size:13px">
                  <span>• ${item.food_name || item.name}</span>
                  <span style="color:var(--text-dim)">${item.quantity_grams || item.amount || 0}g</span>
                </div>`).join('')}
            </div>
          `).join('');
        } else {
          mealBody = `<p style="color:var(--text-dim); font-size:13px">لا يوجد بيانات للوجبة</p>`;
        }
        
        return `
          <div class="card" style="margin-bottom:15px; border-left:4px solid var(--lime)">
            <div style="display:flex; justify-content:space-between; margin-bottom:10px">
              <div>
                <h4 style="color:var(--lime); margin-bottom:3px">${m.name}</h4>
                ${mealTime ? `<div style="font-size:12px; color:var(--text-dim)">${mealTime}${mealRole ? ' · ' + mealRole : ''}</div>` : ''}
              </div>
              <span class="tag" style="background:rgba(204,255,0,0.1); color:var(--lime)">${m.calories} سعرة</span>
            </div>
            <div style="color:var(--text); line-height:1.6; font-size:14px">
              ${mealBody}
            </div>
          </div>
        `;
      } catch(e) {
        // fallback for old plain-text items
        return `
          <div class="card" style="margin-bottom:15px; border-left:4px solid var(--lime)">
            <div style="display:flex; justify-content:space-between; margin-bottom:10px">
              <h4 style="color:var(--lime)">${m.name}</h4>
              <span class="tag" style="background:rgba(204,255,0,0.1); color:var(--lime)">${m.calories} سعرة</span>
            </div>
            <div style="color:var(--text); line-height:1.6; font-size:14px">
              ${m.items.split('+').map(item => `<div style="padding-left:15px; position:relative"><span style="position:absolute; right:0; top:0; color:var(--gold)">•</span> ${item.trim()}</div>`).join('')}
            </div>
          </div>
        `;
      }
    }).join('');

    
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
    await apiFetch(`/admin/plans/${currentPendingPlanId}/approve`, { method: 'PUT' });
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
    await apiFetch(`/admin/plans/${currentPendingPlanId}`, { method: 'DELETE' });
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
views['a-settings'] = () => {
  const gs = window._gymSettings || { gym_name: 'FORM Fitness', primary_color: '#c8ff3d', logo_url: null };
  setTimeout(() => { loadNotifSettings(); }, 100);
  return `
  <div class="page-head"><h1>الإعدادات</h1><p>تحكم في إعدادات النظام والإشعارات والهوية البصرية</p></div>

  <!-- Gym Branding -->
  <div class="notif-settings-card" style="margin-bottom:20px">
    <h4>🏋️ هوية الجيم (الاسم + اللوجو + اللون)</h4>
    <p style="font-size:12px;color:var(--text-dim);margin-bottom:18px">التغييرات دي هتظهر في الـ sidebar وعلى الأبلكيشن كله.</p>

    <!-- Logo Upload -->
    <div style="display:flex;gap:16px;align-items:center;margin-bottom:16px">
      <div id="logoPreviewBox" style="width:80px;height:80px;border-radius:12px;border:2px dashed var(--border);display:flex;align-items:center;justify-content:center;overflow:hidden;cursor:pointer;background:var(--surface-2)" onclick="document.getElementById('logoFileInput').click()">
        ${gs.logo_url
          ? `<img id="logoPreviewImg" src="${gs.logo_url}" style="width:100%;height:100%;object-fit:contain">`
          : `<span id="logoPreviewImg" style="font-size:28px">🏋️</span>`}
      </div>
      <div>
        <div style="font-weight:700;font-size:14px;margin-bottom:6px">لوجو الجيم</div>
        <div style="font-size:12px;color:var(--text-dim);margin-bottom:10px">PNG / JPG / SVG — بيظهر في الـ sidebar</div>
        <input type="file" id="logoFileInput" accept="image/*" style="display:none" onchange="previewAndUploadLogo(this)">
        <button class="btn btn-ghost btn-sm" onclick="document.getElementById('logoFileInput').click()">📷 رفع لوجو</button>
        ${gs.logo_url ? `<button class="btn btn-ghost btn-sm" style="color:var(--coral);margin-right:6px" onclick="removeLogo()">🗑️ إزالة</button>` : ''}
      </div>
    </div>

    <!-- Gym Name -->
    <div class="notif-settings-row" style="margin-bottom:12px">
      <label style="flex:1">🏷️ اسم الجيم / البراند</label>
      <input id="gymNameInput" class="settings-input" value="${gs.gym_name}" style="width:200px;margin:0" oninput="document.querySelectorAll('.brand small').forEach(e=>e.textContent=this.value)">
    </div>

    <!-- Color Picker -->
    <div class="notif-settings-row" style="margin-bottom:16px">
      <label style="flex:1">🎨 اللون الأساسي (Accent Color)</label>
      <div style="display:flex;gap:8px;align-items:center">
        <input type="color" id="gymColorInput" value="${gs.primary_color}"
          style="width:44px;height:36px;border:none;background:none;cursor:pointer;border-radius:8px"
          oninput="document.documentElement.style.setProperty('--primary', this.value); document.getElementById('colorHexDisplay').textContent = this.value">
        <code id="colorHexDisplay" style="font-size:13px;color:var(--text-dim)">${gs.primary_color}</code>
        <!-- Presets -->
        <div style="display:flex;gap:4px">
          ${['#c8ff3d','#00d4ff','#ff6b35','#a855f7','#22d3ee','#f43f5e','#84cc16'].map(c =>
            `<div onclick="document.getElementById('gymColorInput').value='${c}';document.documentElement.style.setProperty('--primary','${c}');document.getElementById('colorHexDisplay').textContent='${c}'"
              style="width:22px;height:22px;border-radius:50%;background:${c};cursor:pointer;border:2px solid ${c===gs.primary_color?'#fff':'transparent'};flex-shrink:0"></div>`
          ).join('')}
        </div>
      </div>
    </div>

    <button class="btn btn-primary" onclick="saveGymBranding()">💾 حفظ هوية الجيم</button>
  </div>

  <!-- Notification Settings -->
  <div class="notif-settings-card" style="margin-bottom:20px">
    <h4>🔔 إعدادات الإشعارات التلقائية</h4>
    <p style="font-size:12px;color:var(--text-dim);margin-bottom:16px">النظام هيبعت إشعارات تلقائية للعملاء حسب الإعدادات دي.</p>
    <div class="notif-settings-row">
      <label>📅 التذكير بالموعد — كام يوم قبل؟</label>
      <input type="number" id="notifApptDays" class="notif-days-input" min="1" max="30" value="1" placeholder="1">
      <span style="font-size:12px;color:var(--text-dim)">يوم</span>
    </div>
    <div class="notif-settings-row">
      <label>⏰ تذكير انتهاء الاشتراك — كام يوم قبل؟</label>
      <input type="number" id="notifSubDays" class="notif-days-input" min="1" max="30" value="3" placeholder="3">
      <span style="font-size:12px;color:var(--text-dim)">يوم</span>
    </div>
    <div style="display:flex;gap:10px;margin-top:16px;flex-wrap:wrap">
      <button class="btn btn-primary" onclick="saveNotifSettings()">💾 حفظ إعدادات الإشعارات</button>
      <button class="btn btn-ghost" id="runCheckBtn" onclick="runDailyNotifCheck()">🔄 فحص يدوي الآن</button>
    </div>
  </div>

  <!-- Notification Channels -->
  <div class="notif-settings-card">
    <h4>📱 قنوات الإشعارات</h4>
    <div class="setting-row">
      <div class="setting-info"><div class="setting-name">إشعارات داخل الأبلكيشن</div><div class="setting-desc">الإشعارات هتظهر في الجرس</div></div>
      <label class="toggle"><input type="checkbox" checked disabled><div class="toggle-slider"></div></label>
    </div>
    <div class="setting-row" style="margin-top:10px">
      <div class="setting-info"><div class="setting-name">Browser Push Notifications</div><div class="setting-desc">إشعارات المتصفح لما تكون خارج الأبلكيشن</div></div>
      <label class="toggle"><input type="checkbox" id="browserPushToggle" onchange="if(this.checked){Notification.requestPermission()}"><div class="toggle-slider"></div></label>
    </div>
  </div>
`};

async function saveGymBranding() {
  const name = document.getElementById('gymNameInput').value.trim();
  const color = document.getElementById('gymColorInput').value;
  try {
    await apiFetch('/gym-settings', {
      method: 'PUT',
      body: JSON.stringify({ gym_name: name, primary_color: color })
    });
    // تطبيق فوري
    document.documentElement.style.setProperty('--primary', color);

    // تحديث اسم الجيم فوراً في كل الأماكن
    const appBrand = document.getElementById('appBrandName');
    if (appBrand) appBrand.textContent = name;
    const loginBrand = document.getElementById('loginBrandName');
    if (loginBrand) loginBrand.textContent = name;
    document.title = name + ' — نظام إدارة الجيم';

    await loadGymSettings();
    toast('✅ تم حفظ هوية الجيم بنجاح!');
  } catch(e) {
    toast('❌ ' + e.message);
  }
}


async function previewAndUploadLogo(input) {
  if (!input.files || !input.files[0]) return;
  const file = input.files[0];

  // Preview
  const reader = new FileReader();
  reader.onload = (e) => {
    const box = document.getElementById('logoPreviewBox');
    if (box) box.innerHTML = `<img src="${e.target.result}" style="width:100%;height:100%;object-fit:contain">`;
  };
  reader.readAsDataURL(file);

  // Upload
  const formData = new FormData();
  formData.append('file', file);
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(API_BASE + '/gym-settings/logo', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + token },
      body: formData
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || 'فشل الرفع');
    await loadGymSettings();
    toast('✅ تم رفع اللوجو وحفظه!');
  } catch(e) {
    toast('❌ ' + e.message);
  }
}

async function removeLogo() {
  try {
    await apiFetch('/gym-settings', { method: 'PUT', body: JSON.stringify({ logo_url: null }) });
    window._gymSettings.logo_url = null;
    await loadGymSettings();
    toast('✅ تم إزالة اللوجو');
    goView('a-settings');
  } catch(e) { toast('❌ ' + e.message); }
}



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

let allExercisesForAdmin = [];

async function loadAllExercises() {
    if (allExercisesForAdmin.length > 0) return;
    try {
        allExercisesForAdmin = await apiFetch('/admin/exercises');
    } catch(e) { console.error(e); }
}

function openAddPlanModal(dayStr = '') {
    let m = document.getElementById('adminPlanModal');
    if (!m) {
        m = document.createElement('div');
        m.id = 'adminPlanModal';
        m.innerHTML = `
        <div style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);z-index:9999;display:flex;justify-content:center;align-items:center;">
          <div style="background:var(--surface-2);padding:20px;border-radius:12px;width:90%;max-width:400px;border:1px solid var(--border)">
            <h3 style="margin-bottom:15px">إنشاء خطة جديدة</h3>
            <div class="field" style="margin-bottom:20px"><label>اسم الخطة (مثلاً: أرجل، بوش)</label><input type="text" id="pName" class="settings-input" style="width:100%"></div>
            <input type="hidden" id="pDay">
            <div style="display:flex;gap:10px">
              <button class="btn btn-primary" style="flex:1" onclick="saveAdminPlan()">حفظ</button>
              <button class="btn btn-ghost" style="flex:1" onclick="document.getElementById('adminPlanModal').style.display='none'">إلغاء</button>
            </div>
          </div>
        </div>`;
        document.body.appendChild(m);
    }
    document.getElementById('pName').value = '';
    document.getElementById('pDay').value = dayStr;
    m.style.display = 'flex';
}

async function saveAdminPlan() {
    const name = document.getElementById('pName').value.trim();
    const day = document.getElementById('pDay').value.trim();
    if (!name) return toast('ادخل اسم الخطة');
    
    try {
        await apiFetch('/workouts/admin/client/' + window.currentClientId, {
            method: 'POST',
            body: JSON.stringify({name: name, day_of_week: day})
        });
        toast('تم إضافة الخطة');
        document.getElementById('adminPlanModal').style.display = 'none';
        goView('a-client-detail');
    } catch(e) { toast('❌ ' + e.message); }
}

let selectedExercisesInModal = new Set();

function toggleExerciseInModal(cb) {
    const id = parseInt(cb.value);
    if (cb.checked) {
        selectedExercisesInModal.add(id);
    } else {
        selectedExercisesInModal.delete(id);
    }
    const btn = document.getElementById('exSaveBtn');
    if (btn) btn.innerText = `إضافة (${selectedExercisesInModal.size}) تمرين`;
}

window.filterModalExercises = function(query) {
    const list = document.getElementById('exModalList');
    if (!list) return;
    let filtered = allExercisesForAdmin;
    if (query) {
        query = query.toLowerCase();
        filtered = filtered.filter(e => e.name.toLowerCase().includes(query) || e.muscle_group.toLowerCase().includes(query));
    }
    
    // Sort so already selected items appear first in the filtered list
    filtered.sort((a, b) => {
        const aSel = selectedExercisesInModal.has(a.id);
        const bSel = selectedExercisesInModal.has(b.id);
        return (aSel === bSel) ? 0 : aSel ? -1 : 1;
    });

    const limited = filtered.slice(0, 50);
    list.innerHTML = limited.map(e => {
        const imgUrl = e.video_url || e.gif_url;
        const bg = imgUrl ? `background: url('${imgUrl}') center/cover no-repeat;` : 'background:#222;';
        return `
        <label style="display:flex; align-items:center; gap:10px; cursor:pointer; padding:8px; border-radius:6px; transition:0.2s;" onmouseover="this.style.background='var(--surface-3)'" onmouseout="this.style.background='transparent'">
            <input type="checkbox" class="ex-modal-cb" value="${e.id}" onchange="toggleExerciseInModal(this)" ${selectedExercisesInModal.has(e.id) ? 'checked' : ''} style="accent-color:var(--primary); width:18px; height:18px; cursor:pointer; flex-shrink:0;">
            <div style="width:40px; height:40px; border-radius:4px; ${bg} flex-shrink:0;"></div>
            <span style="flex-grow:1;">${e.name} <small style="color:var(--primary)">(${e.muscle_group})</small></span>
        </label>
        `;
    }).join('');
    
    if (filtered.length > 50) {
        list.innerHTML += `<div style="text-align:center; padding:10px; color:var(--text-dim); font-size:12px;">ابحث لعرض باقي التمارين...</div>`;
    }
}

window.forceEnglishNumbers = function(input) {
    const arabicNumbers = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g];
    let val = input.value;
    for (let i = 0; i < 10; i++) {
        val = val.replace(arabicNumbers[i], i);
    }
    input.value = val;
}

async function openAddExerciseModal(planId) {
    await loadAllExercises();
    selectedExercisesInModal.clear();
    
    let m = document.getElementById('adminExModal');
    if (!m) {
        m = document.createElement('div');
        m.id = 'adminExModal';
        document.body.appendChild(m);
    }
    m.innerHTML = `
    <div style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);z-index:9999;display:flex;justify-content:center;align-items:center;">
      <div style="background:var(--surface-2);padding:20px;border-radius:12px;width:90%;max-width:450px;border:1px solid var(--border)">
        <h3 style="margin-bottom:15px">إضافة تمارين للخطة</h3>
        <input type="text" id="exModalSearch" placeholder="بحث عن تمرين (مثال: صدر، ظهر)..." class="settings-input" style="width:100%; margin-bottom:10px; min-width:0; background:var(--bg);" onkeyup="filterModalExercises(this.value)">
        <div id="exModalList" style="max-height:220px; overflow-y:auto; background:var(--bg); border:1px solid var(--border); border-radius:8px; padding:10px; margin-bottom:15px; display:flex; flex-direction:column; gap:2px;">
        </div>
        <div class="grid grid-2" style="gap:10px; margin-bottom:10px">
          <div class="field"><label>مجموعات (للكل)</label><input type="number" id="exSets" class="settings-input" value="3" dir="ltr" oninput="forceEnglishNumbers(this)" style="width:100%; min-width:0; background:var(--bg); text-align:center;"></div>
          <div class="field"><label>عدات (للكل)</label><input type="number" id="exReps" class="settings-input" value="10" dir="ltr" oninput="forceEnglishNumbers(this)" style="width:100%; min-width:0; background:var(--bg); text-align:center;"></div>
        </div>
        <div class="grid grid-2" style="gap:10px; margin-bottom:15px">
          <div class="field"><label>وزن (اختياري)</label><input type="text" id="exWeight" class="settings-input" value="-" dir="ltr" oninput="forceEnglishNumbers(this)" style="width:100%; min-width:0; background:var(--bg); text-align:center;"></div>
          <div class="field"><label>راحة (ثانية)</label><input type="number" id="exRest" class="settings-input" value="60" dir="ltr" oninput="forceEnglishNumbers(this)" style="width:100%; min-width:0; background:var(--bg); text-align:center;"></div>
        </div>
        <input type="hidden" id="exPlanId" value="${planId}">
        <div style="display:flex;gap:10px">
          <button class="btn btn-primary" style="flex:1" id="exSaveBtn" onclick="saveAdminExercise()">إضافة (0) تمرين</button>
          <button class="btn btn-ghost" style="flex:1" onclick="document.getElementById('adminExModal').style.display='none'">إلغاء</button>
        </div>
      </div>
    </div>`;
    
    filterModalExercises(''); // Initial render
    m.style.display = 'flex';
}

async function saveAdminExercise() {
    const planId = document.getElementById('exPlanId').value;
    if (selectedExercisesInModal.size === 0) return toast('اختر تمريناً واحداً على الأقل');
    
    const sets = parseInt(document.getElementById('exSets').value);
    const reps = parseInt(document.getElementById('exReps').value);
    const rest = parseInt(document.getElementById('exRest').value);
    const weight = document.getElementById('exWeight').value.trim() || '-';
    
    const btn = document.getElementById('exSaveBtn');
    btn.disabled = true;
    btn.innerText = 'جاري الإضافة...';
    
    try {
        for (let exId of selectedExercisesInModal) {
            await apiFetch('/workouts/admin/plan/' + planId + '/exercise', {
                method: 'POST',
                body: JSON.stringify({exercise_id: exId, sets: sets, reps: reps, rest_seconds: rest, weight: weight})
            });
        }
        toast('تم إضافة ' + selectedExercisesInModal.size + ' تمارين بنجاح!');
        document.getElementById('adminExModal').style.display = 'none';
        goView('a-client-detail');
} catch(e) { 
        toast('❌ ' + e.message); 
    } finally {
        btn.disabled = false;
        btn.innerText = `إضافة (${selectedExercisesInModal.size}) تمرين`;
    }
}

function openEditExerciseModal(id, sets, reps, rest, weight) {
    let m = document.getElementById('editExModal');
    if (!m) {
        m = document.createElement('div');
        m.id = 'editExModal';
        document.body.appendChild(m);
    }
    m.innerHTML = `
    <div style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);z-index:9999;display:flex;justify-content:center;align-items:center;">
      <div style="background:var(--surface-2);padding:25px;border-radius:12px;width:90%;max-width:400px;border:1px solid var(--border)">
        <h3 style="margin-bottom:20px; color:var(--text);">تعديل تفاصيل التمرين</h3>
        
        <div class="grid grid-2" style="gap:15px; margin-bottom:15px">
          <div class="field"><label>مجموعات</label><input type="number" id="editExSets" class="settings-input" dir="ltr" oninput="forceEnglishNumbers(this)" style="width:100%; min-width:0; background:var(--bg); text-align:center;"></div>
          <div class="field"><label>عدات</label><input type="number" id="editExReps" class="settings-input" dir="ltr" oninput="forceEnglishNumbers(this)" style="width:100%; min-width:0; background:var(--bg); text-align:center;"></div>
        </div>
        
        <div class="grid grid-2" style="gap:15px; margin-bottom:20px">
          <div class="field"><label>الوزن</label><input type="text" id="editExWeight" class="settings-input" dir="ltr" oninput="forceEnglishNumbers(this)" style="width:100%; min-width:0; background:var(--bg); text-align:center;"></div>
          <div class="field"><label>وقت الراحة (ث)</label><input type="number" id="editExRest" class="settings-input" dir="ltr" oninput="forceEnglishNumbers(this)" style="width:100%; min-width:0; background:var(--bg); text-align:center;"></div>
        </div>
        
        <input type="hidden" id="editExId">
        
        <div style="display:flex;gap:10px">
          <button class="btn btn-primary" style="flex:1" id="editExBtn" onclick="saveEditAdminExercise()">حفظ التعديل</button>
          <button class="btn btn-ghost" style="flex:1" onclick="document.getElementById('editExModal').style.display='none'">إلغاء</button>
        </div>
      </div>
    </div>`;
    
    document.getElementById('editExId').value = id;
    document.getElementById('editExSets').value = sets;
    document.getElementById('editExReps').value = reps;
    document.getElementById('editExRest').value = rest;
    document.getElementById('editExWeight').value = weight;
    
    m.style.display = 'flex';
}

async function saveEditAdminExercise() {
    const id = document.getElementById('editExId').value;
    const sets = parseInt(document.getElementById('editExSets').value);
    const reps = parseInt(document.getElementById('editExReps').value);
    const rest = parseInt(document.getElementById('editExRest').value);
    const weight = document.getElementById('editExWeight').value.trim() || '-';
    
    const btn = document.getElementById('editExBtn');
    btn.disabled = true;
    btn.innerText = 'جاري الحفظ...';
    
    try {
        await apiFetch('/workouts/admin/exercise/' + id, {
            method: 'PUT',
            body: JSON.stringify({sets: sets, reps: reps, rest_seconds: rest, weight: weight})
        });
        toast('تم تحديث التمرين بنجاح! 🚀');
        document.getElementById('editExModal').style.display = 'none';
        goView('a-client-detail');
    } catch(e) {
        toast('❌ ' + e.message);
    } finally {
        btn.disabled = false;
        btn.innerText = 'حفظ التعديل';
    }
}

function deleteAdminWorkoutPlan(id) {
    customConfirm('متأكد إنك عاوز تمسح الخطة دي؟', async () => {
        try {
            await apiFetch('/workouts/admin/plan/' + id, {method: 'DELETE'});
            goView('a-client-detail');
        } catch(e) { toast('❌ ' + e.message); }
    });
}

function deleteAdminExercise(id) {
    customConfirm('متأكد إنك عاوز تمسح التمرين ده من الخطة؟', async () => {
        try {
            await apiFetch('/workouts/admin/exercise/' + id, {method: 'DELETE'});
            goView('a-client-detail');
        } catch(e) { toast('❌ ' + e.message); }
    });
}

function openExercisePreviewModal(id, name, url, muscle) {
    let m = document.getElementById('exercisePreviewModal');
    if (!m) {
        m = document.createElement('div');
        m.id = 'exercisePreviewModal';
        document.body.appendChild(m);
    }
    
    let mediaHtml = '';
    if (url) {
        if (url.endsWith('.mp4')) {
             mediaHtml = `<video src="${url}" controls autoplay loop style="width:100%; border-radius:8px; max-height:400px; background:#000"></video>`;
        } else {
             mediaHtml = `<img src="${url}" style="width:100%; border-radius:8px; max-height:400px; object-fit:contain; background:#000">`;
        }
    } else {
        mediaHtml = `<div style="width:100%; height:200px; background:#222; border-radius:8px; display:flex; align-items:center; justify-content:center; color:var(--text-dim)">لا توجد صورة أو فيديو</div>`;
    }

    m.innerHTML = `
    <div style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);z-index:9999;display:flex;justify-content:center;align-items:center;padding:20px;">
      <div style="background:var(--surface-2);padding:20px;border-radius:12px;width:100%;max-width:500px;border:1px solid var(--border);position:relative;">
        <h3 style="margin-bottom:5px; color:var(--text)">${name}</h3>
        <p style="color:var(--primary); margin-bottom:15px; font-size:13px;">العضلة: ${muscle}</p>
        
        ${mediaHtml}
        
        <div style="margin-top:20px; display:flex; justify-content:space-between; align-items:center;">
          <button class="btn btn-ghost" style="color:var(--coral);border:1px solid var(--coral);" onclick="deleteLibraryExercise(${id})">حذف التمرين</button>
          <button class="btn btn-ghost" onclick="document.getElementById('exercisePreviewModal').style.display='none'">إغلاق</button>
        </div>
      </div>
    </div>`;
    m.style.display = 'flex';
}

function customConfirm(message, onConfirm) {
    let m = document.getElementById('customConfirmModal');
    if (!m) {
        m = document.createElement('div');
        m.id = 'customConfirmModal';
        document.body.appendChild(m);
    }
    m.innerHTML = `
    <div style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);z-index:10000;display:flex;justify-content:center;align-items:center;padding:20px;backdrop-filter:blur(5px);">
      <div style="background:var(--surface-2);padding:30px;border-radius:16px;width:100%;max-width:400px;border:1px solid var(--border);text-align:center;box-shadow:0 10px 30px rgba(0,0,0,0.5);">
        <div style="font-size:45px; margin-bottom:15px; text-shadow:0 0 15px rgba(255,107,107,0.5);">⚠️</div>
        <h3 style="margin-bottom:10px; color:var(--text); font-size:20px;">تأكيد الإجراء</h3>
        <p style="color:var(--text-dim); margin-bottom:25px; line-height:1.5;">${message}</p>
        <div style="display:flex;gap:10px;">
          <button class="btn btn-primary" style="flex:1; background:var(--coral); color:#fff; border:none;" id="confirmBtnOk">نعم، متأكد</button>
          <button class="btn btn-ghost" style="flex:1; background:var(--surface-3);" onclick="document.getElementById('customConfirmModal').style.display='none'">إلغاء</button>
        </div>
      </div>
    </div>`;
    m.style.display = 'flex';
    document.getElementById('confirmBtnOk').onclick = () => {
        m.style.display = 'none';
        onConfirm();
    };
}

function deleteLibraryExercise(id) {
    customConfirm('هل أنت متأكد من حذف هذا التمرين نهائياً من قاعدة البيانات؟ لا يمكن التراجع عن هذه الخطوة.', async () => {
        try {
            await apiFetch('/admin/exercises/' + id, { method: 'DELETE' });
            document.getElementById('exercisePreviewModal').style.display='none';
            toast('تم حذف التمرين بنجاح');
            goView('a-library');
        } catch(e) {
            toast('❌ ' + e.message);
        }
    });
}

function openUploadExerciseModal() {
    let m = document.getElementById('uploadExModal');
    if (!m) {
        m = document.createElement('div');
        m.id = 'uploadExModal';
        document.body.appendChild(m);
    }
    m.innerHTML = `
    <div style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);z-index:9999;display:flex;justify-content:center;align-items:center;padding:20px;">
      <div style="background:var(--surface-2);padding:20px;border-radius:12px;width:100%;max-width:500px;border:1px solid var(--border);">
        <h3 style="margin-bottom:15px">رفع تمرين جديد</h3>
        <form id="uploadExForm" onsubmit="submitUploadExercise(event)">
            <div class="field" style="margin-bottom:10px">
              <label>اسم التمرين</label>
              <input type="text" id="upExName" class="settings-input" style="width:100%" required>
            </div>
            <div class="field" style="margin-bottom:10px">
              <label>العضلة المستهدفة</label>
              <input type="text" id="upExMuscle" class="settings-input" style="width:100%" placeholder="أرجل، ظهر، عام" required>
            </div>
            <div class="field" style="margin-bottom:10px">
              <label>شرح خفيف (اختياري)</label>
              <textarea id="upExDesc" class="settings-input" style="width:100%;height:60px"></textarea>
            </div>
            <div class="field" style="margin-bottom:20px">
              <label>صورة متحركة (GIF) أو فيديو</label>
              <div style="position:relative; width:100%; border:2px dashed var(--primary); border-radius:8px; padding:30px; text-align:center; cursor:pointer; background:rgba(205,255,0,0.05); transition:0.3s;" onmouseover="this.style.background='rgba(205,255,0,0.1)'" onmouseout="this.style.background='rgba(205,255,0,0.05)'" onclick="document.getElementById('upExFile').click()">
                <div style="font-size:30px; margin-bottom:10px;">📁</div>
                <div style="color:var(--text); font-weight:bold; margin-bottom:5px;">اضغط هنا لاختيار الملف</div>
                <div style="color:var(--text-dim); font-size:12px;">GIF, MP4, JPEG, PNG (الحد الأقصى 20MB)</div>
                <div id="upExFileName" style="margin-top:15px; color:var(--primary); font-weight:bold; font-size:14px; display:none;"></div>
                <input type="file" id="upExFile" accept="image/gif, video/mp4, image/*" style="display:none;" required onchange="document.getElementById('upExFileName').style.display='block'; document.getElementById('upExFileName').innerText='تم اختيار: ' + this.files[0].name;">
              </div>
            </div>
            <div style="display:flex;gap:10px">
              <button type="submit" class="btn btn-primary" style="flex:1" id="upExBtn">رفع التمرين</button>
              <button type="button" class="btn btn-ghost" style="flex:1" onclick="document.getElementById('uploadExModal').style.display='none'">إلغاء</button>
            </div>
        </form>
      </div>
    </div>`;
    m.style.display = 'flex';
}

async function submitUploadExercise(e) {
    e.preventDefault();
    const btn = document.getElementById('upExBtn');
    btn.disabled = true;
    btn.innerText = 'جاري الرفع... (قد يستغرق بعض الوقت)';
    
    const formData = new FormData();
    formData.append('name', document.getElementById('upExName').value);
    formData.append('muscle_group', document.getElementById('upExMuscle').value || 'عام');
    formData.append('description', document.getElementById('upExDesc').value || '');
    formData.append('file', document.getElementById('upExFile').files[0]);
    
    try {
        const token = localStorage.getItem('token');
        const res = await fetch(API_BASE + '/admin/exercises', {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + token },
            body: formData
        });
        
        if (!res.ok) {
            const data = await res.json();
            throw new Error(data.detail || 'فشل رفع التمرين');
        }
        
        toast('تم الرفع وإضافة التمرين بنجاح! 🚀');
        document.getElementById('uploadExModal').style.display = 'none';
        goView('a-library');
    } catch(e) {
        toast('❌ ' + e.message);
        btn.disabled = false;
        btn.innerText = 'رفع التمرين';
    }
}

// ── طباعة تقرير العميل ──
window.printClientReport = async function(clientId) {
    const btn = event.currentTarget;
    const oldText = btn.innerHTML;
    btn.innerHTML = 'جاري التحضير...';
    
    try {
        const clients = await apiFetch('/admin/clients');
        const client = clients.find(x => x.id == clientId);
        if(!client) throw new Error('Client not found');
        
        const plans = await apiFetch(`/admin/plans/${clientId}`);
        const activePlan = plans.find(p => p.status === 'active');
        
        if(!activePlan) {
            alert('لا يوجد نظام غذائي نشط لطباعته.');
            btn.innerHTML = oldText;
            return;
        }

        function formatPrintMeal(m) {
            if (!m) return '';
            try {
                const parsed = JSON.parse(m.items);
                const alts = parsed.alternatives || [];
                if (alts.length > 0) {
                    return alts.slice(0, 4).map((alt, idx) => {
                        let html = `<div style="margin-bottom:8px;">`;
                        if (alts.length > 1) {
                            html += `<div style="color:var(--olive); font-size:11px; font-weight:800; margin-bottom:2px;">— خيـار ${idx+1} —</div>`;
                        }
                        html += alt.items.map(i => `<div style="margin-bottom:2px;">• ${i.food_name || i.name} (${i.quantity_grams || i.amount || 0}g)</div>`).join('');
                        html += `</div>`;
                        return html;
                    }).join('');
                }
                return '';
            } catch(e) {
                return m.items.split('+').map(item => `<div style="margin-bottom:2px;">• ${item.trim()}</div>`).join('');
            }
        }

        const m1 = activePlan.meals[0];
        const m2 = activePlan.meals[1];
        const m3 = activePlan.meals[2];
        const m4 = activePlan.meals[3];
        const clientNotes = activePlan.client_notes || activePlan.notes || activePlan.goal || '';

        const today = new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: '2-digit', day: '2-digit' });

        const printWin = window.open('', '_blank');
        printWin.document.write(`
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<title>FITIX - خطة الوجبات</title>
<link href="https://fonts.googleapis.com/css2?family=Almarai:wght@400;700;800&family=Poppins:wght@700;800&display=swap" rel="stylesheet">
<style>
  :root{
    --cream: #FBF1DE;
    --cream-soft: #FDF6E9;
    --olive: #7A8A3C;
    --forest: #2E4A1F;
    --forest-deep: #1F3815;
    --peach: #FBE4C4;
    --ink: #2B2B22;
    --line: #33331f;
  }
  *{ box-sizing: border-box; }
  html,body{
    margin:0; padding:0;
    background:#e9e2d0;
    font-family:'Almarai', sans-serif;
    color:var(--ink);
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .page{
    width: 210mm;
    min-height: 297mm;
    margin: 0 auto;
    background: var(--cream);
    position: relative;
    overflow: hidden;
  }

  /* header */
  .header{
    position:relative;
    background: linear-gradient(135deg, #dcdf9e 0%, #c9d17a 45%, #b9c661 100%);
    padding: 34px 40px 22px 40px;
    display:flex;
    align-items:flex-start;
    justify-content:space-between;
    min-height: 180px;
    z-index:2;
  }
  .header-text{
    position:relative;
    z-index:2;
    width:100%;
    padding-top: 6px;
  }
  .name-field{
    font-size: 34px;
    font-weight: 800;
    color: var(--forest-deep);
    margin: 0 0 22px 0;
  }
  .meta-row{
    display:flex;
    justify-content:space-between;
    align-items:center;
    font-size: 16px;
    font-weight: 700;
    color: var(--forest-deep);
    gap: 20px;
  }
  .meta-row .field{
    white-space:nowrap;
  }
  .dots-row{
    display:flex;
    gap: 14px;
    padding: 22px 40px 0 40px;
    position:relative;
    z-index:2;
  }
  .dots-row span{
    width:12px; height:12px; border-radius:50%;
    background: var(--olive);
    display:inline-block;
  }

  /* meals grid */
  .meals{
    position:relative;
    z-index:2;
    display:grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px 34px;
    padding: 34px 44px 10px 44px;
  }
  .meal-pill{
    display:inline-block;
    padding: 8px 20px;
    border-radius: 24px;
    color:#fff;
    font-weight:800;
    font-size: 16px;
    margin-bottom: 14px;
  }
  .pill-dark{ background: var(--forest-deep); }
  .pill-olive{ background: var(--olive); }

  .meal-sub{
    font-weight:700;
    font-size: 15px;
    color: var(--ink);
    margin-bottom: 10px;
  }
  .meal-box{
    border: 2.5px dashed var(--line);
    border-radius: 20px;
    min-height: 180px;
    background: rgba(255,255,255,0.35);
    padding: 16px;
    font-size: 13px;
    line-height: 1.5;
  }

  /* notes + footer photo */
  .footer{
    position:relative;
    z-index:2;
    display:flex;
    justify-content:space-between;
    align-items:flex-end;
    padding: 18px 44px 40px 44px;
    gap: 30px;
  }
  .notes{
    flex: 1;
    background: var(--peach);
    border-radius: 16px;
    padding: 18px 26px 22px 26px;
    font-size: 14px;
    font-weight: 700;
    line-height: 1.8;
    min-height: 140px;
  }
  .notes h3{
    text-align:center;
    color: var(--forest);
    font-size: 19px;
    margin: 0 0 14px 0;
    font-weight:800;
  }
  .footer-brand{
    width: 190px;
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
    gap: 12px;
  }
  .footer-brand .wordmark{
    font-family: 'Poppins', sans-serif;
    font-size: 34px;
    font-weight: 800;
    letter-spacing: 3px;
    background: linear-gradient(135deg, var(--forest-deep) 0%, var(--olive) 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
  .footer-dots{
    display:flex; gap:10px;
  }
  .footer-dots span{
    width:10px; height:10px; border-radius:50%;
    background: var(--olive);
    display:inline-block;
  }

  @media print { 
    .no-print { display: none !important; } 
    body, html { background: #fff; }
    .page { box-shadow: none; margin: 0; width: 100%; min-height: 100%; }
    @page { size: A4; margin: 0; }
  }
</style>
</head>
<body>
<div class="no-print" style="padding:15px; background:#d4edda; color:#155724; text-align:center; font-size:16px; font-family:'Almarai', sans-serif;">
    ✅ جاهز للطباعة — اضغط Ctrl+P أو ⌘+P<br>
    <button onclick="window.print()" style="margin-top:10px; padding:10px 20px; font-size:16px; background:#28a745; color:#fff; border:none; border-radius:8px; cursor:pointer;">🖨️ طباعة / تحميل PDF</button>
</div>
<div class="page">
  <div class="header">
    <div class="header-text">
      <div class="name-field">الاسم / ${client.full_name || 'العميل'}</div>
      <div class="meta-row">
        <span class="field">التاريخ : ${today}</span>
        <span class="field">موعد الميزان القادم : بعد أسبوعين</span>
      </div>
    </div>
  </div>

  <div class="dots-row">
    <span></span><span></span><span></span><span></span>
  </div>

  <div class="meals">
    <div>
      <span class="meal-pill pill-dark">الوجبه الاولى</span>
      <div class="meal-sub">${m1?.name || 'الفطور'}</div>
      <div class="meal-box">${formatPrintMeal(m1)}</div>
    </div>
    <div>
      <span class="meal-pill pill-olive">الوجبة الثانية</span>
      <div class="meal-sub">${m2?.name || 'اسناك قبل التمرين'}</div>
      <div class="meal-box">${formatPrintMeal(m2)}</div>
    </div>
    <div>
      <span class="meal-pill pill-olive">الوجبة الثالثة</span>
      <div class="meal-sub">${m3?.name || 'الغداء / وجبة بعد التمرين'}</div>
      <div class="meal-box">${formatPrintMeal(m3)}</div>
    </div>
    <div>
      <span class="meal-pill pill-dark">الوجبة الرابعة</span>
      <div class="meal-sub">${m4?.name || 'العشاء'}</div>
      <div class="meal-box">${formatPrintMeal(m4)}</div>
    </div>
  </div>

  <div class="footer">
    <div class="notes">
      <h3>ملاحظات</h3>
      ${clientNotes || 'لا توجد ملاحظات إضافية.'}
    </div>
    <div class="footer-brand">
      <div class="wordmark">FITIX</div>
      <div class="footer-dots"><span></span><span></span><span></span><span></span></div>
    </div>
  </div>
</div>
<script>setTimeout(() => { window.print(); }, 800);</script>
</body>
</html>
        `);
        printWin.document.close();
        
    } catch(e) {
        console.error(e);
        alert('حدث خطأ أثناء تجهيز الطباعة.');
    } finally {
        btn.innerHTML = oldText;
    }
}

// --- Manual Nutrition Plan ---
window.allFoodsData = [];
window.manualMeals = [];
window.currentManualClientId = null;

window.openManualNutritionModal = async function(clientId) {
  window.currentManualClientId = clientId;
  try {
    const foods = await apiFetch('/admin/nutrition/foods');
    window.allFoodsData = foods;
    window.manualMeals = [{ name: 'الفطور', items: [] }, { name: 'الغداء', items: [] }]; 
    
    let m = document.getElementById('manualNutritionModal');
    if (!m) {
      m = document.createElement('div');
      m.id = 'manualNutritionModal';
      m.className = 'modal-bg';
      document.body.appendChild(m);
    }
    
    m.innerHTML = window.buildManualNutritionModal();
    m.style.display = 'flex';
  } catch(e) {
    alert(e.message);
  }
};

window.buildManualNutritionModal = function() {
  let mealsHtml = window.manualMeals.map((meal, mIndex) => `
    <div class="card" style="margin-bottom:15px; border-left:3px solid var(--lime); background:var(--bg-card)">
      <div style="display:flex; justify-content:space-between; margin-bottom:10px">
        <input type="text" class="settings-input" style="width:150px" value="${meal.name}" onchange="window.updateManualMealName(${mIndex}, this.value)" placeholder="اسم الوجبة">
        <button class="btn btn-outline" style="color:var(--coral);border-color:var(--coral);padding:5px 10px;font-size:12px" onclick="window.removeManualMeal(${mIndex})">حذف الوجبة</button>
      </div>
      <div id="items-container-${mIndex}">
        ${meal.items.map((item, iIndex) => `
          <div style="display:flex; gap:10px; margin-bottom:10px; align-items:center">
            <select class="settings-input" style="flex:1" onchange="window.updateManualFood(${mIndex}, ${iIndex}, 'food_id', this.value)">
              <option value="">اختر الصنف...</option>
              ${window.allFoodsData.map(f => `<option value="${f.id}" ${f.id == item.food_id ? 'selected' : ''}>${f.name} (${f.calories} kcal/100g)</option>`).join('')}
            </select>
            <input type="number" class="settings-input" style="width:100px" placeholder="جرام" value="${item.grams}" onchange="window.updateManualFood(${mIndex}, ${iIndex}, 'grams', this.value)">
            <button class="btn btn-ghost" style="color:var(--coral);padding:5px" onclick="window.removeManualFood(${mIndex}, ${iIndex})">✖</button>
          </div>
        `).join('')}
      </div>
      <button class="btn btn-ghost" style="font-size:12px; margin-top:5px; color:var(--lime)" onclick="window.addManualFoodItem(${mIndex})">+ إضافة صنف</button>
    </div>
  `).join('');

  return `
    <div class="modal" style="max-width:600px; width:95%; max-height:90vh; overflow-y:auto; background:var(--surface);">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px">
        <h2>🛠️ إنشاء نظام غذائي يدوياً</h2>
        <button class="btn btn-ghost" style="font-size:24px" onclick="document.getElementById('manualNutritionModal').style.display='none'">&times;</button>
      </div>
      
      <div id="manualMealsContainer">
        ${mealsHtml}
      </div>
      
      <button class="btn btn-outline" style="width:100%; margin-bottom:20px; border-style:dashed; color:var(--text)" onclick="window.addManualMeal()">+ إضافة وجبة جديدة</button>
      
      <button class="btn btn-primary" style="width:100%" onclick="window.submitManualNutrition(event)">💾 حفظ الخطة واعتمادها</button>
    </div>
  `;
};

window.updateManualMealName = function(mIndex, val) { window.manualMeals[mIndex].name = val; };
window.addManualMeal = function() { 
  window.manualMeals.push({ name: `وجبة ${window.manualMeals.length+1}`, items: [] });
  document.getElementById('manualNutritionModal').innerHTML = window.buildManualNutritionModal();
};
window.removeManualMeal = function(mIndex) {
  window.manualMeals.splice(mIndex, 1);
  document.getElementById('manualNutritionModal').innerHTML = window.buildManualNutritionModal();
};
window.addManualFoodItem = function(mIndex) {
  window.manualMeals[mIndex].items.push({ food_id: '', grams: 100 });
  document.getElementById('manualNutritionModal').innerHTML = window.buildManualNutritionModal();
};
window.updateManualFood = function(mIndex, iIndex, key, val) {
  window.manualMeals[mIndex].items[iIndex][key] = val;
};
window.removeManualFood = function(mIndex, iIndex) {
  window.manualMeals[mIndex].items.splice(iIndex, 1);
  document.getElementById('manualNutritionModal').innerHTML = window.buildManualNutritionModal();
};

window.submitManualNutrition = async function(event) {
  let payload = { meals: [] };
  for (let m of window.manualMeals) {
    if (m.items.length === 0) continue;
    let validItems = m.items.filter(i => i.food_id && i.grams > 0).map(i => ({ food_id: parseInt(i.food_id), grams: parseInt(i.grams) }));
    if (validItems.length > 0) {
      payload.meals.push({
        name: m.name,
        alternatives: [{ items: validItems }]
      });
    }
  }
  
  if (payload.meals.length === 0) return alert('يجب إضافة وجبات وأصناف صحيحة.');

  const btn = event.target;
  const oldText = btn.innerHTML;
  btn.innerHTML = 'جاري الحفظ...';
  btn.disabled = true;

  try {
    const res = await apiFetch(`/admin/plans/manual/${window.currentManualClientId}`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    alert(res.message);
    document.getElementById('manualNutritionModal').style.display = 'none';
    goView('a-client-detail'); 
  } catch(e) {
    alert(e.message);
  } finally {
    btn.innerHTML = oldText;
    btn.disabled = false;
  }
};
