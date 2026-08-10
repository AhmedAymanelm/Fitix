function renderAnalyticsDashboard(history, workoutHistory = []) {
  let workoutHtml = '';
  if (workoutHistory && workoutHistory.length > 0) {
      workoutHtml = `
      <div class="card" style="padding:20px; margin-bottom:20px;">
          <h3 style="color:var(--text); margin-bottom:15px">سجل التمارين</h3>
          <div style="display:flex; flex-direction:column; gap:10px;">
              ${workoutHistory.map(w => {
                  const d = new Date(w.date);
                  const dateStr = d.toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' });
                  const timeStr = d.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
                  const bg = w.is_completed ? 'var(--surface-3)' : 'rgba(255, 107, 107, 0.1)';
                  const border = w.is_completed ? 'var(--border)' : 'var(--coral)';
                  const isToday = d.toDateString() === new Date().toDateString();
                  const statusIcon = w.is_completed ? '✅ مكتمل' : (isToday ? '⏳ جاري التدريب...' : '❌ أُنهي مبكراً');
                  return `
                  <div style="background:${bg}; border:1px solid ${border}; border-radius:8px; padding:15px; display:flex; justify-content:space-between; align-items:center;">
                      <div>
                          <div style="font-weight:bold; margin-bottom:5px;">${dateStr} - ${timeStr}</div>
                          <div style="font-size:12px; color:var(--text-dim);">عدد التمارين الملعوبة: ${w.session_data ? w.session_data.length : 0}</div>
                      </div>
                      <div style="font-weight:bold; color:${w.is_completed ? 'var(--lime)' : 'var(--coral)'}; font-size:14px;">
                          ${statusIcon}
                      </div>
                  </div>
                  `;
              }).join('')}
          </div>
      </div>
      `;
  }

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
    ${workoutHtml}
    
    <div class="grid grid-2" style="margin-bottom:20px; gap:20px">
      <!-- Line Chart -->
      <div class="card" style="padding:20px">
        <h3 style="color:var(--gold); margin-bottom:15px">التطور الزمني (الوزن والدهون والعضلات)</h3>
        <canvas id="analyticsLineChart" style="width:100%; height:300px"></canvas>
      </div>
      <!-- Bar Chart -->
      <div class="card" style="padding:20px">
        <h3 style="color:var(--cyan); margin-bottom:15px">صافي التغير (أول قراءة vs أحدث قراءة)</h3>
        <canvas id="analyticsBarChart" style="width:100%; height:300px"></canvas>
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
