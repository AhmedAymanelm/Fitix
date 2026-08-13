/* ---- User Dashboard (Today's Workout) ---- */
views['u-dash'] = async () => {
  const data = await apiFetch('/workouts/today');
  
  if (!data.exercises || data.exercises.length === 0) {
    return `<div class="page-head"><h1>تمارين النهاردة</h1><p>مفيش تمارين مخصصة ليك النهاردة، تقدر تريح!</p></div>`;
  }
  
  // State Management
  const todayDate = new Date().toISOString().split('T')[0];
  const currentExIds = data.exercises.map(ex => ex.id).join(',');
  
  let stateStr = localStorage.getItem('workoutState');
  let state = stateStr ? JSON.parse(stateStr) : null;
  
  if (!state || state.plan_id !== data.plan_id || state.date !== todayDate || state.ex_ids !== currentExIds) {
    state = { plan_id: data.plan_id, date: todayDate, ex_ids: currentExIds, completed_sets: {}, partial_sets: {} };
    localStorage.setItem('workoutState', JSON.stringify(state));
  }
  
  window.currentWorkoutState = state;
  window.currentWorkoutData = data.exercises;
  
  // Calculate if the entire workout is already finished based on state
  let isAllFinished = false;
  if (data.exercises.length > 0) {
      isAllFinished = data.exercises.every(ex => {
          let comp = state.completed_sets[ex.id] || [];
          return comp.length >= ex.sets;
      });
  }

  // Automatic sync makes manual buttons obsolete.

  if (!data.plan_id) {
    return `
    <div class="page-head" style="margin-bottom: 20px;">
      <h1 style="margin-bottom:5px;">يوم راحة 🧘‍♂️</h1>
      <p style="color:var(--text-dim); margin:0;">${data.plan_name}</p>
    </div>
    <div style="text-align:center; padding:50px 20px; background:var(--surface-2); border:1px solid var(--border); border-radius:16px;">
        <div style="font-size:60px; margin-bottom:15px;">😴</div>
        <h2 style="color:var(--text); margin-bottom:10px;">استمتع بيومك!</h2>
        <p style="color:var(--text-dim);">ليس لديك أي تمارين مخصصة لليوم. الراحة جزء مهم جداً من الاستشفاء والتطور العضلي.</p>
    </div>
    `;
  }

  return `
  <div class="page-head" style="margin-bottom: 20px;">
    <h1 style="margin-bottom:5px;">تمارين النهاردة 🔥</h1>
    <p style="color:var(--text-dim); margin:0;">خطة اليوم: ${data.plan_name}</p>
  </div>
  
  <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap:20px; padding-bottom:10px; width:100%;">
    ${data.exercises.map((ex, index) => {
      let setRows = '';
      let exCompletedSets = state.completed_sets[ex.id] || [];
      
      for (let i = 1; i <= ex.sets; i++) {
          const isDone = exCompletedSets.includes(i);
          const partialInfo = (state.partial_sets && state.partial_sets[ex.id]) ? state.partial_sets[ex.id].find(s => s.set === i) : null;
          
          let bg = 'background:var(--bg); color:var(--text);';
          let textStyle = '';
          let icon = i;
          let label = `${ex.reps} عادي`;
          
          if (partialInfo) {
              bg = 'background:var(--coral); color:#fff; border:none;';
              icon = '⏱';
              label = `ناقص ${partialInfo.timeLeft}s`;
          } else if (isDone) {
              bg = 'background:var(--lime); color:#000; border:none;';
              textStyle = 'text-decoration:line-through; opacity:0.5;';
              icon = '✓';
          }
          
          let actualWeight = ex.weight || '-';
          if (state.logged_weights && state.logged_weights[ex.id] && state.logged_weights[ex.id][i]) {
              actualWeight = state.logged_weights[ex.id][i];
          }

          setRows += `
          <div style="display:flex; justify-content:space-between; align-items:center; padding:12px 0; border-bottom:1px solid var(--border); font-size:14px; color:var(--text); ${textStyle}">
              <div style="flex:1; display:flex; justify-content:center;">
                <span style="display:flex; align-items:center; justify-content:center; width:28px; height:28px; border:1px solid var(--border); border-radius:6px; font-weight:bold; ${bg} font-size:13px;" title="${partialInfo ? 'لم يكمل الوقت: باقي ' + partialInfo.timeLeft + ' ثانية' : ''}">${icon}</span>
              </div>
              <div style="flex:1; text-align:center;">${label}</div>
              <div style="flex:1; text-align:center; color:${(actualWeight !== ex.weight && actualWeight !== '-') ? 'var(--gold)' : 'inherit'}; font-weight:${(actualWeight !== ex.weight && actualWeight !== '-') ? 'bold' : 'normal'};">${actualWeight}</div>
              <div style="flex:1; text-align:center; color:var(--text-dim);">${ex.rest_seconds}s</div>
          </div>
          `;
      }
      
      const imgUrl = ex.video_url || ex.gif_url;
      
      return `
      <div style="background:var(--surface-2); border:1px solid var(--border); border-radius:12px; overflow:hidden; display:flex; flex-direction:column;">
        <div style="padding:20px 20px 15px 20px; display:flex; justify-content:space-between; align-items:center;">
          <div style="flex:1; padding-left:15px;">
            <h2 style="margin:0 0 5px 0; font-size:18px; color:var(--text); font-family:sans-serif">${ex.name}</h2>
            <div style="color:var(--text-dim); font-size:13px;">${ex.muscle_group ? ex.muscle_group.replace(/,/g, ' • ') : 'عام'}</div>
          </div>
          ${imgUrl ? `<img src="${imgUrl}" style="width:90px; height:90px; border-radius:10px; object-fit:contain; border:1px solid var(--border); background:#fff; flex-shrink:0; cursor:pointer; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'" onclick="openImageModal('${imgUrl}')" title="اضغط لتكبير الصورة">` : `<div style="width:90px; height:90px; border-radius:10px; border:1px solid var(--border); background:var(--surface-3); display:flex; align-items:center; justify-content:center; font-size:32px; flex-shrink:0;">🏋️</div>`}
        </div>
        
        <div style="padding:0 20px 20px 20px; flex:1; display:flex; flex-direction:column;">
          <div style="display:flex; justify-content:space-between; padding-bottom:12px; border-bottom:1px solid var(--border); font-size:12px; color:var(--text-dim); font-weight:bold;">
            <div style="flex:1; text-align:center;">المجموعات</div>
            <div style="flex:1; text-align:center;">عدات</div>
            <div style="flex:1; text-align:center;">الوزن (كجم)</div>
            <div style="flex:1; text-align:center;">راحة</div>
          </div>
          
          <div style="flex:1;">
            ${setRows}
          </div>
          
          <div style="margin-top:20px;">
            <button class="btn btn-ghost" style="width:100%; color:var(--primary); font-weight:bold; border:1px solid var(--primary); padding:10px; border-radius:8px" onclick="window.currentExerciseIndex=${index}; goView('u-active-workout')">بدء التمرين 🚀</button>
          </div>
        </div>
      </div>
      `;
    }).join('')}
  </div>
  `;
}

window.submitWorkoutLog = async function(isCompleted, silent = false) {
    const state = window.currentWorkoutState;
    if (!state || !state.plan_id) return silent ? null : toast('لا يوجد خطة حالية');
    
    // Format session_data for API
    let session_data = [];
    for (const exId in state.completed_sets) {
        session_data.push({
            exercise_id: parseInt(exId),
            completed_sets: state.completed_sets[exId],
            partial_sets: state.partial_sets ? state.partial_sets[exId] || [] : [],
            skipped_rests: state.skipped_rests ? state.skipped_rests[exId] || [] : [],
            logged_weights: state.logged_weights ? state.logged_weights[exId] || {} : {}
        });
    }
    
    try {
        await apiFetch('/workouts/log', {
            method: 'POST',
            body: JSON.stringify({
                plan_id: state.plan_id,
                is_completed: isCompleted,
                session_data: session_data
            })
        });
        
        if (!silent) {
            // Keep the state in localStorage so the user can still see their completed exercises. 
            // It will naturally reset the next day because of the date check in u-dash.
            toast('تم حفظ سجل التدريب بنجاح');
            goView('u-dash');
        }
    } catch(e) {
        if (!silent) toast('حدث خطأ أثناء حفظ السجل');
    }
}


window.openUserExerciseModal = function(exStr) {
  const ex = JSON.parse(decodeURIComponent(exStr));
  let m = document.getElementById('userExModal');
  if (!m) {
    m = document.createElement('div');
    m.id = 'userExModal';
    document.body.appendChild(m);
  }
  
  const imgUrl = ex.video_url || ex.gif_url;
  const mediaHtml = imgUrl ? `<img src="${BASE_URL}${imgUrl}" style="width:100%; max-height:280px; object-fit:contain; background:#fff; border-bottom:1px solid var(--border);">` : `<div style="width:100%; height:200px; background:var(--surface-3); display:flex; align-items:center; justify-content:center; font-size:40px;">🏋️</div>`;
  
  let setRows = '';
  for (let i = 1; i <= ex.sets; i++) {
      setRows += `
      <div style="display:flex; justify-content:space-between; align-items:center; padding:12px 0; border-bottom:1px solid var(--border); font-size:14px; color:var(--text);">
          <div style="flex:1; display:flex; justify-content:center;">
            <span style="display:flex; align-items:center; justify-content:center; width:28px; height:28px; border:1px solid var(--border); border-radius:6px; font-weight:bold; background:var(--surface-2); color:var(--text); font-size:13px;">${i}</span>
          </div>
          <div style="flex:1; text-align:center;">${ex.reps} عادي</div>
          <div style="flex:1; text-align:center;">${ex.weight}</div>
          <div style="flex:1; text-align:center; color:var(--text-dim);">${ex.rest_seconds}s</div>
      </div>
      `;
  }
  
  m.innerHTML = `
  <div style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);z-index:9999;display:flex;justify-content:center;align-items:flex-end; padding:15px; padding-bottom:max(15px, env(safe-area-inset-bottom));">
    <div style="background:var(--surface-2); border-radius:24px; width:100%; max-width:500px; max-height:90vh; overflow-y:auto; border:1px solid var(--border); position:relative; animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);">
      <button onclick="document.getElementById('userExModal').style.display='none'" style="position:absolute; top:15px; left:15px; background:rgba(0,0,0,0.6); color:#fff; border:none; width:35px; height:35px; border-radius:50%; font-size:18px; cursor:pointer; z-index:10; display:flex; justify-content:center; align-items:center;">✕</button>
      
      ${mediaHtml}
      
      <div style="padding:25px 20px;">
        <h2 style="margin:0 0 8px 0; font-size:22px; color:var(--text); text-align:center;">${ex.name}</h2>
        <div style="color:var(--primary); font-size:14px; text-align:center; margin-bottom:25px;">${ex.muscle_group ? ex.muscle_group.replace(/,/g, ' • ') : 'تمرين عام'}</div>
        
        <div style="background:var(--bg); border:1px solid var(--border); border-radius:16px; padding:0 15px; margin-bottom:25px;">
          <div style="display:flex; justify-content:space-between; padding:15px 0; border-bottom:1px solid var(--border); font-size:12px; color:var(--text-dim); font-weight:bold;">
            <div style="flex:1; text-align:center;">المجموعات</div>
            <div style="flex:1; text-align:center;">عدات</div>
            <div style="flex:1; text-align:center;">الوزن (كجم)</div>
            <div style="flex:1; text-align:center;">راحة</div>
          </div>
          ${setRows}
        </div>
        
        <button class="btn btn-primary" style="width:100%; padding:15px; font-size:16px; font-weight:bold; border-radius:14px;" onclick="document.getElementById('userExModal').style.display='none'; window.currentExerciseId=${ex.id}; goView('u-ex-detail')">بدء التمرين (مؤقت الراحة)</button>
      </div>
    </div>
  </div>
  <style>
    @keyframes slideUp { from { transform: translateY(50px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  </style>
  `;
  m.style.display = 'block';
};

window.openImageModal = function(url) {
  let m = document.getElementById('imageModal');
  if (!m) {
    m = document.createElement('div');
    m.id = 'imageModal';
    document.body.appendChild(m);
  }
  m.innerHTML = `
    <div style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); z-index:99999; display:flex; justify-content:center; align-items:center; flex-direction:column; padding:20px; cursor:zoom-out; animation: fadeIn 0.2s ease;" onclick="this.parentElement.style.display='none'">
      <button style="position:absolute; top:25px; left:25px; background:rgba(255,255,255,0.1); border:none; color:white; font-size:24px; width:45px; height:45px; border-radius:50%; cursor:pointer; display:flex; justify-content:center; align-items:center;">&times;</button>
      <img src="${url}" style="max-width:100%; max-height:85vh; border-radius:16px; background:#fff; object-fit:contain; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
    </div>
    <style>
      @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    </style>
  `;
  m.style.display = 'block';
};

/* ---- User Exercise Detail (Timer) ---- */
/* ---- User Guided Workout Flow ---- */
views['u-active-workout'] = () => {
  return `
  <div class="page-head" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
    <div>
      <h1 style="margin-bottom:5px; font-size:22px;">جاري التدريب 🔥</h1>
      <p style="margin:0; font-size:14px; color:var(--text-dim);" id="flowExSubtitle">يرجى الانتظار...</p>
    </div>
  </div>
  
  <div id="flowMediaContainer" style="display:flex; justify-content:center; margin-bottom:30px; width:100%; min-height:200px;">
    <!-- Media populated by JS -->
  </div>

  <div class="timer-box" id="flowContainer" style="max-width:400px; margin:0 auto; background:var(--surface-2); border:1px solid var(--border); border-radius:16px; padding:20px;">
    <!-- Populated by JS -->
  </div>
  `;
};

let exFlow = {
  exIndex: 0,
  currentSet: 1,
  phase: 'exercise',
  timeLeft: 60,
  interval: null,
  timeTaken: 0,
  maxExerciseTime: 60
};

function initFns_u_active_workout(){
  if (!window.currentWorkoutData || window.currentWorkoutData.length === 0 || window.currentExerciseIndex === undefined) {
      toast('لا توجد تمارين محددة!');
      goView('u-dash');
      return;
  }
  
  exFlow.exIndex = window.currentExerciseIndex;
  const ex = window.currentWorkoutData[exFlow.exIndex];
  
  const state = window.currentWorkoutState || JSON.parse(localStorage.getItem('workoutState') || '{"completed_sets":{}}');
  let completed = state.completed_sets[ex.id] || [];
  
  if (completed.length >= ex.sets) {
      toast('هذا التمرين مكتمل بالفعل! 🎉');
      goView('u-dash');
      return;
  }
  
  exFlow.currentSet = completed.length + 1;
  startPhase('exercise');
}

window.initFns = { 'u-active-workout': initFns_u_active_workout };

function startPhase(phase) {
  const ex = window.currentWorkoutData[exFlow.exIndex];
  exFlow.phase = phase;
  exFlow.timeTaken = 0;
  
  if (phase === 'exercise') {
    exFlow.timeLeft = exFlow.maxExerciseTime;
  } else {
    exFlow.timeLeft = ex.rest_seconds || 45;
  }
  
  renderFlowUI();
  
  if(exFlow.interval) clearInterval(exFlow.interval);
  exFlow.interval = setInterval(() => {
    exFlow.timeLeft--;
    exFlow.timeTaken++;
    updateFlowTimerDisp();
    if(exFlow.timeLeft <= 0) {
      clearInterval(exFlow.interval);
      handlePhaseEnd(true); // true means it auto-completed
    }
  }, 1000);
}

function updateFlowTimerDisp() {
  const d = document.getElementById('flowTimer');
  if(d) {
    let m = Math.floor(exFlow.timeLeft / 60);
    let s = exFlow.timeLeft % 60;
    d.innerText = (m < 10 ? '0'+m : m) + ':' + (s < 10 ? '0'+s : s);
  }
}

function renderFlowUI() {
  const ex = window.currentWorkoutData[exFlow.exIndex];
  
  // Update Header and Media
  const sub = document.getElementById('flowExSubtitle');
  if (sub) sub.innerText = `التمرين ${exFlow.exIndex + 1} من ${window.currentWorkoutData.length}: ${ex.name}`;
  
  const media = document.getElementById('flowMediaContainer');
  if (media) {
      if (exFlow.phase === 'rest') {
          const phrases = [
              "خد بريك يا وحش! 🦍",
              "عاش يا بطل! خد نفسك واستعد 🚀",
              "راحة محارب، متطولش! ⚔️",
              "وحش الجيم! ريح ثواني وارجع أقوى 🔥",
              "ممتاز جداً! اشرب مياه وخد نفسك 💧"
          ];
          const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
          media.innerHTML = `
              <div style="width:100%; max-width:280px; height:280px; background:linear-gradient(135deg, var(--surface-2), var(--surface-3)); border:1px solid var(--border); border-radius:16px; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:20px; text-align:center; box-shadow: 0 4px 20px rgba(0,0,0,0.4);">
                  <div style="font-size:60px; margin-bottom:15px; animation: bounce 2s infinite;">🧘‍♂️</div>
                  <h3 style="color:var(--gold); font-size:22px; line-height:1.4;">${randomPhrase}</h3>
              </div>
          `;
      } else {
          const imgUrl = ex.video_url || ex.gif_url;
          if (imgUrl) {
              media.innerHTML = `<img src="${imgUrl}" style="width:100%; max-width:280px; max-height:280px; height:auto; border-radius:16px; object-fit:contain; background:#fff; border:1px solid var(--border); box-shadow: 0 4px 20px rgba(0,0,0,0.4);">`;
          } else {
              media.innerHTML = `<div style="width:100%; max-width:280px; height:200px; background:var(--surface-2); border:1px solid var(--border); border-radius:16px; display:flex; flex-direction:column; align-items:center; justify-content:center;"><div style="font-size:40px; margin-bottom:10px;">🏋️</div><div style="color:var(--text-dim);">الصورة غير متوفرة</div></div>`;
          }
      }
  }

  // Update Container
  const container = document.getElementById('flowContainer');
  if (!container) return;
  
  if (exFlow.phase === 'exercise') {
    container.innerHTML = `
        <div style="text-align:center; margin-bottom:15px;">
            <span style="background:var(--primary); color:#000; padding:5px 15px; border-radius:20px; font-weight:bold; font-size:14px;">أداء المجموعة ${exFlow.currentSet} من ${ex.sets}</span>
        </div>
        <div style="text-align:center; color:var(--text-dim); font-size:14px; margin-bottom:5px;">وقت الأداء المتبقي</div>
        <div id="flowTimer" style="font-size:48px; font-weight:bold; text-align:center; color:var(--primary); font-family:monospace; margin-bottom:15px;">00:00</div>
        
        <div style="text-align:center; margin-bottom:15px; font-size:16px; font-weight:bold; color:var(--text);">
            الوزن المطلوب: ${ex.weight || 'عادي'} | العدات: ${ex.reps}
        </div>
        
        <div style="margin-bottom:20px;">
            <label style="display:block; text-align:center; color:var(--text-dim); margin-bottom:8px; font-size:14px;">الوزن الفعلي اللي شيلته (اختياري)</label>
            <input type="number" id="loggedWeightInput" placeholder="كجم" style="width:100%; text-align:center; font-size:18px; padding:12px; border-radius:12px; background:var(--surface-3); border:1px solid var(--border); color:white;">
        </div>
        
        <div style="display:flex; flex-direction:column; gap:10px;">
            <button class="btn btn-primary" style="padding:15px; border-radius:12px; font-weight:bold; font-size:16px; background:var(--lime); color:#000; box-shadow: 0 4px 15px rgba(204,255,0,0.3);" onclick="handlePhaseEnd(false)">✅ إنهاء المجموعة</button>
        </div>
    `;
  } else {
    container.innerHTML = `
        <div style="text-align:center; margin-bottom:15px;">
            <span style="background:var(--surface-3); color:var(--text); padding:5px 15px; border-radius:20px; font-weight:bold; font-size:14px;">استعد للمجموعة ${exFlow.currentSet} من ${ex.sets}</span>
        </div>
        <div style="text-align:center; color:var(--text-dim); font-size:14px; margin-bottom:5px;">وقت الراحة</div>
        <div id="flowTimer" style="font-size:48px; font-weight:bold; text-align:center; color:var(--gold); font-family:monospace; margin-bottom:15px;">00:00</div>
        
        <button class="btn btn-ghost" style="width:100%; padding:15px; border-radius:12px; font-weight:bold; border:1px solid var(--border);" onclick="handlePhaseEnd(false)">تخطي الراحة ⏭</button>
    `;
  }
  updateFlowTimerDisp();
}

window.handlePhaseEnd = function(isAutoCompleted) {
  const ex = window.currentWorkoutData[exFlow.exIndex];
  
  if (exFlow.phase === 'exercise') {
    const weightInput = document.getElementById('loggedWeightInput');
    const loggedWeight = weightInput ? weightInput.value.trim() : '';

    const state = window.currentWorkoutState || JSON.parse(localStorage.getItem('workoutState') || '{"completed_sets":{}, "partial_sets":{}, "logged_weights":{}}');
    if (!state.completed_sets) state.completed_sets = {};
    if (!state.partial_sets) state.partial_sets = {};
    if (!state.logged_weights) state.logged_weights = {};
    
    if (!state.completed_sets[ex.id]) state.completed_sets[ex.id] = [];
    if (!state.partial_sets[ex.id]) state.partial_sets[ex.id] = [];
    if (!state.logged_weights[ex.id]) state.logged_weights[ex.id] = {};

    // Manual or Auto completion in exercise phase are both treated as perfect sets.
    // The timer is just a stopwatch for reps.
    if (!state.completed_sets[ex.id].includes(exFlow.currentSet)) {
        state.completed_sets[ex.id].push(exFlow.currentSet);
        if (loggedWeight) {
            state.logged_weights[ex.id][exFlow.currentSet] = loggedWeight;
        }
        localStorage.setItem('workoutState', JSON.stringify(state));
        window.currentWorkoutState = state;
        submitWorkoutLog(false, true); // Auto-sync
    }
    
    progressToNextSetOrEnd(ex);
  } else {
    // Rest ended (either auto or skipped)
    if (!isAutoCompleted) {
        const state = window.currentWorkoutState || JSON.parse(localStorage.getItem('workoutState') || '{"completed_sets":{}, "partial_sets":{}, "skipped_rests":{}}');
        if (!state.skipped_rests) state.skipped_rests = {};
        if (!state.skipped_rests[ex.id]) state.skipped_rests[ex.id] = [];
        state.skipped_rests[ex.id].push({set: exFlow.currentSet - 1, timeLeft: exFlow.timeLeft});
        localStorage.setItem('workoutState', JSON.stringify(state));
        window.currentWorkoutState = state;
        submitWorkoutLog(false, true); // Auto-sync
    }
    startPhase('exercise');
  }
}

function progressToNextSetOrEnd(ex) {
    if (exFlow.currentSet >= ex.sets) {
        toast('🎉 عاش يا بطل! خلصت التمرين ده.');
        if(exFlow.interval) clearInterval(exFlow.interval);
        
        const state = window.currentWorkoutState;
        let allDone = true;
        if (state && window.currentWorkoutData) {
            for (let e of window.currentWorkoutData) {
                let comp = state.completed_sets[e.id] || [];
                if (comp.length < e.sets) {
                    allDone = false;
                    break;
                }
            }
        } else {
            allDone = false;
        }

        if (allDone) {
            submitWorkoutLog(true, true); // Auto-sync in background silently
            finishWorkoutSuccessfully();  // Show trophy screen
        } else {
            goView('u-dash'); // Go back to dashboard naturally
        }
    } else {
        exFlow.currentSet++;
        startPhase('rest');
    }
}

// Remove old abort function
// window.abortExerciseFlow = function() { ... }

function finishWorkoutSuccessfully() {
    if(exFlow.interval) clearInterval(exFlow.interval);
    
    document.getElementById('app').innerHTML = `
      <div class="page-head" style="text-align:center; padding-top:40px;">
        <div style="font-size:60px; margin-bottom:20px;">🏆</div>
        <h1 style="color:var(--lime); margin-bottom:10px;">عاش يا وحش!</h1>
        <p style="color:var(--text-dim); font-size:16px;">لقد أكملت تدريب اليوم بنجاح وتم تسجيله في تحليلاتك أوتوماتيكياً.</p>
      </div>
    `;
    
    // Auto-redirect after 3 seconds
    setTimeout(() => {
        goView('u-dash');
    }, 3000);
}


/* ---- User CV Test ---- */
views['u-cv'] = async () => {
    let userData = null;
    try {
        userData = await apiFetch('/auth/me');
    } catch (e) {
        console.error(e);
    }
    
    if (!userData || !userData.cv_access) {
        return `
            <div class="page-head"><h1>اختبار اللياقة بالكاميرا (CV)</h1><p>الـ AI هيعدلك العدات ويصلحلك الفورمة وأنت بتتمرن</p></div>
            <div class="card" style="text-align:center;padding:50px 20px;color:var(--text-dim); border: 1px solid rgba(255,107,107,0.3)">
                <div style="font-size:50px;margin-bottom:15px">🔒</div>
                <h3 style="margin-bottom:10px;color:var(--text)">الخاصية غير مفعلة</h3>
                <p style="font-size:16px;">لم يتم تفعيل خاصية الكاميرا الذكية لحسابك. <br>يرجى طلب التفعيل من كابتن الجيم.</p>
            </div>
        `;
    }

    return `
  <style>
    .cv-select {
        background-color: rgba(255,255,255,0.05);
        color: #fff;
        border: 1px solid rgba(255,255,255,0.2);
        padding: 12px 20px;
        border-radius: 12px;
        font-family: inherit;
        font-size: 16px;
        cursor: pointer;
        outline: none;
        transition: all 0.3s ease;
        -webkit-appearance: none;
        appearance: none;
        background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23bdff00' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
        background-repeat: no-repeat;
        background-position: left 15px center;
        background-size: 15px;
        padding-left: 40px; /* space for arrow on the left (RTL) */
    }
    .cv-select:hover, .cv-select:focus {
        border-color: var(--primary);
        background-color: rgba(189,255,0,0.05);
        box-shadow: 0 0 15px rgba(189,255,0,0.1);
    }
    .cv-select option {
        background-color: #1a1a1a;
        color: #fff;
    }
    .cv-controls {
        display: flex;
        justify-content: center;
        gap: 15px;
        margin-bottom: 25px;
        flex-wrap: wrap;
    }
  </style>
  <div class="page-head"><h1>اختبار اللياقة بالكاميرا (CV)</h1><p>الـ AI هيعدلك العدات ويصلحلك الفورمة وأنت بتتمرن</p></div>
  <div class="cv-controls">
    <select id="exerciseSelect" class="cv-select" style="width: 220px;">
      <option value="squat">سكوات (Squats)</option>
    </select>
    <select id="timerSelect" class="cv-select" style="width: 180px;">
      <option value="60">دقيقة واحدة</option>
      <option value="120">دقيقتين</option>
      <option value="300">5 دقائق</option>
      <option value="0">وقت مفتوح</option>
    </select>
  </div>
  <div class="cam-box" style="position: relative; overflow: hidden; height: 480px; max-width: 640px; margin: 0 auto; background: #000; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
    <div class="rec-dot" style="position: absolute; top: 15px; right: 15px; z-index: 10;"><i></i> جاري تحليل الحركة</div>
    
    <div style="position: absolute; top: 15px; left: 50%; transform: translateX(-50%); z-index: 10; background: rgba(0,0,0,0.6); padding: 5px 15px; border-radius: 20px;">
      <b id="cvTimerCount" style="color: #fff; font-size: 20px; font-family: monospace;">00:00</b>
    </div>

    <div class="rep-counter" style="position: absolute; top: 15px; left: 15px; z-index: 10; background: rgba(0,0,0,0.6); padding: 10px; border-radius: 8px;">
      <b id="cvRepCount" style="color: var(--primary); font-size: 24px;">0</b>
      <span style="display: block; font-size: 12px; color: #fff;">العدات الصحيحة</span>
    </div>
    
    <video id="cvVideo" autoplay playsinline muted style="display: none;"></video>
    <canvas id="cvCanvas" width="640" height="480" style="width: 100%; height: 100%; object-fit: cover;"></canvas>
    
    <div style="position: absolute; bottom: 15px; left: 50%; transform: translateX(-50%); z-index: 10; width: 90%; text-align: center;">
      <div id="cvFeedback" style="background:var(--surface-3); padding:8px 16px; border-radius:8px; font-size:14px; font-weight:700; border:1px solid var(--lime); color:var(--lime); text-shadow: 1px 1px 2px #000;">
        اختار التمرين واضغط ابدأ الاختبار
      </div>
    </div>
  </div>
  <div style="text-align:center; margin-top:20px">
    <button id="startCVBtn" class="btn btn-primary" onclick="startCVTest()">ابدأ الاختبار</button>
  </div>
`;
}
function renderAnalyticsDashboard(history, workoutHistory = []) {
  let workoutAnalyticsHtml = '';
  
  if (workoutHistory && workoutHistory.length > 0) {
      let totalTargetSets = 0;
      let totalPerfectSets = 0;
      let totalTarget = 0;
      let totalAttempted = 0;
      let skippedCounts = {};
      let totalSkippedRests = 0;
      
      workoutHistory.forEach(w => {
          totalTarget += w.total_exercises || 0;
          totalAttempted += w.attempted_exercises || 0;
          
          if (w.details) {
              w.details.forEach(ex => {
                  totalTargetSets += ex.target_sets || 0;
                  
                  const completed = ex.completed_sets ? ex.completed_sets.length : 0;
                  const partials = ex.partial_sets ? ex.partial_sets.length : 0;
                  const skippedRests = ex.skipped_rests ? ex.skipped_rests.length : 0;
                  
                  // A perfect set is completed full time. We penalize for partial sets and skipped rests.
                  let perfect = completed - partials - (skippedRests * 0.5); // Skipped rest is a half-penalty
                  if (perfect < 0) perfect = 0;
                  totalPerfectSets += perfect;
                  
                  if (completed === 0 && partials === 0) {
                      skippedCounts[ex.name] = (skippedCounts[ex.name] || 0) + 1;
                  }
                  if (ex.skipped_rests) {
                      totalSkippedRests += ex.skipped_rests.length;
                  }
              });
          }
      });
      
      const disciplineScore = totalTargetSets > 0 ? Math.round((totalPerfectSets / totalTargetSets) * 100) : 100;
      const completionRate = totalTarget > 0 ? Math.round((totalAttempted / totalTarget) * 100) : 0;
      
      const skippedLeaderboard = Object.entries(skippedCounts).sort((a, b) => b[1] - a[1]).slice(0, 3);
          
      let skippedHtml = '';
      if (skippedLeaderboard.length > 0) {
          skippedHtml = `
          <div class="card" style="padding:20px; background:rgba(255,107,107,0.05); border:1px solid var(--coral); margin-bottom:20px;">
              <h4 style="color:var(--coral); margin-bottom:10px;">⚠️ التمارين الأكثر تهرباً</h4>
              <ul style="margin:0; padding-right:20px; color:var(--text);">
                  ${skippedLeaderboard.map(item => `<li><b>${item[0]}</b>: تم تخطيه ${item[1]} مرات</li>`).join('')}
              </ul>
          </div>`;
      }

      workoutAnalyticsHtml = `
      <div style="margin-bottom:40px;">
          <h3 style="color:var(--text); margin-bottom:15px; display:flex; align-items:center; gap:10px;">
              <span style="font-size:24px;">🏃‍♂️</span> تحليل التمارين والالتزام
          </h3>
          <div class="grid grid-3" style="margin-bottom:20px; gap:20px">
              <div class="card" style="padding:20px; text-align:center; border-bottom:3px solid ${disciplineScore >= 80 ? 'var(--lime)' : 'var(--coral)'}">
                  <div style="font-size:14px; color:var(--text-dim); margin-bottom:5px;">معدل الانضباط (الالتزام بالوقت)</div>
                  <div style="font-size:36px; font-weight:bold; color:${disciplineScore >= 80 ? 'var(--lime)' : 'var(--coral)'};">${disciplineScore}%</div>
              </div>
              <div class="card" style="padding:20px; text-align:center; border-bottom:3px solid var(--cyan)">
                  <div style="font-size:14px; color:var(--text-dim); margin-bottom:5px;">معدل أداء التمارين المستهدفة</div>
                  <div style="font-size:36px; font-weight:bold; color:var(--cyan);">${completionRate}%</div>
              </div>
              <div class="card" style="padding:20px; text-align:center; border-bottom:3px solid ${totalSkippedRests > 0 ? 'var(--coral)' : 'var(--lime)'}">
                  <div style="font-size:14px; color:var(--text-dim); margin-bottom:5px;">إجمالي مرات تخطي الراحة</div>
                  <div style="font-size:36px; font-weight:bold; color:${totalSkippedRests > 0 ? 'var(--coral)' : 'var(--lime)'};">${totalSkippedRests} <span style="font-size:16px;">مرة</span></div>
              </div>
          </div>
          <div class="grid grid-2" style="margin-bottom:20px; gap:20px">
              <div class="card" style="padding:20px">
                  <h3 style="color:var(--primary); margin-bottom:15px">معدل الانضباط الشامل</h3>
                  <div style="position: relative; height: 250px; width: 100%; display:flex; justify-content:center;">
                      <canvas id="workoutDoughnutChart"></canvas>
                  </div>
              </div>
              <div class="card" style="padding:20px">
                  <h3 style="color:var(--cyan); margin-bottom:15px">التمارين المستهدفة مقابل الملعوبة</h3>
                  <div style="position: relative; height: 250px; width: 100%;">
                      <canvas id="workoutBarChart"></canvas>
                  </div>
              </div>
          </div>
          ${skippedHtml}
          <h4 style="color:var(--text); margin-bottom:15px;">سجل التدريبات الأخير</h4>
          <div style="display:flex; flex-direction:column; gap:15px;">
              ${workoutHistory.map(w => {
                  const d = new Date(w.date);
                  const isToday = d.toDateString() === new Date().toDateString();
                  const dateStr = d.toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' });
                  const timeStr = d.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
                  const bg = w.is_completed ? 'rgba(204, 255, 0, 0.05)' : (isToday ? 'rgba(0, 255, 255, 0.05)' : 'rgba(255, 107, 107, 0.05)');
                  const border = w.is_completed ? 'var(--lime)' : (isToday ? 'var(--cyan)' : 'var(--coral)');
                  const statusIcon = w.is_completed ? '✅ أكمل بنجاح' : (isToday ? '⏳ جاري التدريب...' : '🛑 إنهاء مبكر');
                  
                  let detailsHtml = '';
                  if (w.details && w.details.length > 0) {
                      const partials = [];
                      w.details.forEach(ex => {
                          if (ex.partial_sets) {
                              ex.partial_sets.forEach(ps => {
                                  partials.push(`تمرين ${ex.name}: نقص ${ps.timeLeft}ث في أداء المجموعة ${ps.set}`);
                              });
                          }
                          if (ex.skipped_rests) {
                              ex.skipped_rests.forEach(sr => {
                                  partials.push(`تمرين ${ex.name}: تخطى راحة بعد المجموعة ${sr.set} (وفر ${sr.timeLeft}ث)`);
                              });
                          }
                      });
                      if (partials.length > 0) {
                          detailsHtml = `
                          <div style="margin-top:10px; padding:10px; background:var(--bg); border-radius:8px; font-size:13px; border-right:3px solid var(--coral);">
                              <div style="color:var(--coral); font-weight:bold; margin-bottom:5px;">تجاوزات الوقت والراحة:</div>
                              ${partials.map(p => `<div>- ${p}</div>`).join('')}
                          </div>`;
                      }
                  }

                  return `
                  <div style="background:var(--surface-2); border:1px solid var(--border); border-radius:12px; overflow:hidden;">
                      <div style="background:${bg}; border-bottom:1px solid ${border}; padding:15px; display:flex; justify-content:space-between; align-items:center;">
                          <div>
                              <div style="font-weight:bold; font-size:16px;">${w.plan_name || 'تدريب حر'}</div>
                              <div style="font-size:12px; color:var(--text-dim);">${dateStr} - ${timeStr}</div>
                          </div>
                          <div style="font-weight:bold; color:${w.is_completed ? 'var(--lime)' : 'var(--coral)'}; font-size:14px; background:var(--bg); padding:5px 10px; border-radius:20px; border:1px solid ${border};">
                              ${statusIcon}
                          </div>
                      </div>
                      <div style="padding:15px;">
                          <div style="font-size:14px; color:var(--text); margin-bottom:5px;">لعب <b>${w.attempted_exercises || 0}</b> من أصل <b>${w.total_exercises || 0}</b> تمارين مستهدفة</div>
                          <div style="width:100%; height:8px; background:var(--bg); border-radius:4px; overflow:hidden; margin-bottom:5px;">
                              <div style="width:${w.total_exercises ? (w.attempted_exercises/w.total_exercises)*100 : 0}%; height:100%; background:var(--cyan);"></div>
                          </div>
                          ${detailsHtml}
                      </div>
                  </div>
                  `;
              }).join('')}
          </div>
      </div>
      <hr style="border:0; border-top:1px solid var(--border); margin:40px 0;">
      `;
  } else {
      workoutAnalyticsHtml = `
      <div class="card" style="text-align:center;padding:50px 20px;color:var(--text-dim); margin-bottom:30px;">
        <div style="font-size:40px;margin-bottom:15px">🏃‍♂️</div>
        <h3 style="margin-bottom:10px;color:var(--text)">لا يوجد سجل تمارين</h3>
        <p>لم يقم العميل بأي تدريب حتى الآن.</p>
      </div>`;
  }

  let inbodyHtml = '';
  if (!history || history.length === 0) {
    inbodyHtml = `
      <div class="card" style="text-align:center;padding:50px 20px;color:var(--text-dim)">
        <div style="font-size:40px;margin-bottom:15px">📈</div>
        <h3 style="margin-bottom:10px;color:var(--text)">لا توجد بيانات كافية</h3>
        <p>لا يوجد قراءات InBody مسجلة لعرض التحليلات.</p>
      </div>`;
  } else if (history.length < 2) {
    inbodyHtml = `
      <div class="card" style="text-align:center;padding:50px 20px;color:var(--text-dim)">
        <div style="font-size:40px;margin-bottom:15px;color:var(--gold)">📊</div>
        <h3 style="margin-bottom:10px;color:var(--text)">قراءة واحدة غير كافية للتحليل</h3>
        <p>تحتاج إلى قراءتين InBody على الأقل لرسم منحنيات التطور والمقارنة.</p>
      </div>`;
  } else {
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

    inbodyHtml = `
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

  window.currentWorkoutAnalytics = workoutHistory;
  setTimeout(() => {
    if (typeof initWorkoutCharts === 'function') initWorkoutCharts();
  }, 150);

  return workoutAnalyticsHtml + `
  <h3 style="color:var(--text); margin-bottom:15px; display:flex; align-items:center; gap:10px;">
      <span style="font-size:24px;">⚖️</span> تحليل القياسات (InBody)
  </h3>` + inbodyHtml;
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

let wLineChart = null;
let wBarChart = null;

function initWorkoutCharts() {
  const wHist = window.currentWorkoutAnalytics;
  if (!wHist || wHist.length === 0) return; // Show even if 1 workout
  
  // Use all history for the bar chart so live progress is visible
  const sorted = [...wHist].reverse();
  const labels = sorted.map(w => {
    const d = new Date(w.date);
    return d.toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' }) + ' ' + d.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
  });
  
  const targetEx = sorted.map(w => w.total_exercises || 0);
  const attemptedEx = sorted.map(w => w.attempted_exercises || 0);
  
  let chartTargetSets = 0;
  let chartPerfectSets = 0;
  
  wHist.forEach(w => {
      if (w.details) {
          w.details.forEach(ex => {
              chartTargetSets += ex.target_sets || 0;
              const completed = ex.completed_sets ? ex.completed_sets.length : 0;
              const partials = ex.partial_sets ? ex.partial_sets.length : 0;
              const skippedRests = ex.skipped_rests ? ex.skipped_rests.length : 0;
              let perfect = completed - partials - (skippedRests * 0.5);
              if (perfect < 0) perfect = 0;
              chartPerfectSets += perfect;
          });
      }
  });

  const dData = chartTargetSets === 0 ? [1, 0] : [chartPerfectSets, chartTargetSets - chartPerfectSets];
  
  const dCtx = document.getElementById('workoutDoughnutChart');
  if (dCtx) {
    if (wLineChart) wLineChart.destroy();
    wLineChart = new Chart(dCtx, {
      type: 'doughnut',
      data: {
        labels: ['أداء مثالي', 'تجاوزات وتهرب'],
        datasets: [{
          data: dData,
          backgroundColor: ['#ccff00', '#ff6b6b'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        cutout: '70%',
        plugins: { 
          legend: { position: 'bottom', labels: { color: '#e0e0e0', font: { family: 'Cairo' }, padding: 20 } }
        }
      }
    });
  }
  
  const barCtx = document.getElementById('workoutBarChart');
  if (barCtx) {
    if (wBarChart) wBarChart.destroy();
    wBarChart = new Chart(barCtx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          { label: 'المستهدفة', data: targetEx, backgroundColor: 'rgba(255, 107, 107, 0.8)', borderRadius: 4 },
          { label: 'الملعوبة', data: attemptedEx, backgroundColor: 'rgba(0, 242, 254, 0.8)', borderRadius: 4 }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { labels: { color: '#e0e0e0', font: { family: 'Cairo' } } } },
        scales: {
          x: { ticks: { color: '#a0a0a0', font: { family: 'Cairo', size: 10 } }, grid: { display: false } },
          y: { ticks: { color: '#a0a0a0', font: { family: 'Cairo' }, stepSize: 1 }, grid: { color: 'rgba(255,255,255,0.05)' } }
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
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:15px">
            <h3 style="margin:0; color:var(--gold)">القياسات الحيوية</h3>
            <button class="btn btn-ghost" style="color:var(--coral); padding:2px 8px; font-size:11px" onclick="deleteUserInBody(${latest.id})">مسح</button>
        </div>
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
          <div style="display:flex; justify-content:space-between; margin-bottom:10px">
            <div style="color:var(--lime); font-weight:bold">${h.reading_date}</div>
            <button class="btn btn-ghost" style="color:var(--coral); padding:2px 8px; font-size:11px" onclick="deleteUserInBody(${h.id})">مسح</button>
          </div>
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
    <div class="page-head" style="display:flex; justify-content:space-between; align-items:flex-end;">
      <div><h1>بياناتي (InBody)</h1><p>سجل قراءاتك وتابع تطورك</p></div>
      <button class="btn btn-primary" onclick="openUserInBodyModal()">+ إضافة قراءة</button>
    </div>
    ${renderInBodyDashboard(history)}
  `;
}

function openUserInBodyModal() {
  let m = document.getElementById('userInBodyModal');
  if(!m) {
    m = document.createElement('div');
    m.id = 'userInBodyModal';
    m.innerHTML = `
      <div style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);z-index:9999;display:flex;justify-content:center;align-items:center;">
        <div style="background:var(--surface-2);padding:20px;border-radius:12px;width:90%;max-width:400px;border:1px solid var(--border)">
          <h3 style="margin-bottom:15px">إضافة قراءة InBody</h3>
          <div class="field" style="margin-bottom:10px"><label>الوزن (kg)</label><input type="number" step="0.1" id="uiWeight" class="settings-input" style="width:100%"></div>
          <div class="field" style="margin-bottom:10px"><label>الدهون (%)</label><input type="number" step="0.1" id="uiFat" class="settings-input" style="width:100%"></div>
          <div class="field" style="margin-bottom:15px"><label>العضلات (%)</label><input type="number" step="0.1" id="uiMuscle" class="settings-input" style="width:100%"></div>
          <div style="display:flex;gap:10px">
            <button class="btn btn-primary" style="flex:1" onclick="saveUserInBody()">حفظ</button>
            <button class="btn btn-ghost" style="flex:1" onclick="document.getElementById('userInBodyModal').style.display='none'">إلغاء</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(m);
  }
  document.getElementById('uiWeight').value = '';
  document.getElementById('uiFat').value = '';
  document.getElementById('uiMuscle').value = '';
  m.style.display = 'flex';
}

async function saveUserInBody() {
  const w = parseFloat(document.getElementById('uiWeight').value);
  const f = parseFloat(document.getElementById('uiFat').value);
  const m = parseFloat(document.getElementById('uiMuscle').value);
  if(!w || !f || !m) return toast('يرجى تعبئة كل الحقول');
  try {
    await apiFetch('/inbody/manual', {
      method: 'POST',
      body: JSON.stringify({weight:w, body_fat:f, muscle_mass:m})
    });
    toast('✅ تم إضافة القراءة بنجاح');
    document.getElementById('userInBodyModal').style.display = 'none';
    goView('u-inbody'); // Refresh
  } catch(e) {
    toast('❌ ' + e.message);
  }
}

async function deleteUserInBody(id) {
  if(!(await appConfirm('متأكد إنك عاوز تمسح القراءة دي؟'))) return;
  try {
    await apiFetch('/inbody/' + id, {method: 'DELETE'});
    toast('✅ تم الحذف');
    goView('u-inbody');
  } catch(e) {
    toast('❌ ' + e.message);
  }
}

/* ---- User Analytics / Progress ---- */
views['u-analytics'] = async () => {
  let history = [];
  try { history = await apiFetch('/inbody/me'); } catch(e) { console.error(e); }

  let workoutHistory = [];
  try {
    const userRes = await apiFetch('/auth/me');
    if (userRes && userRes.id) workoutHistory = await apiFetch('/workouts/history/' + userRes.id);
  } catch(e) { console.error(e); }

  // Load existing body photos
  let photos = { front: null, back: null, side: null, date: null };
  try { photos = await apiFetch('/inbody/my-photos'); } catch(e) {}

  const hasPhotos = photos.front || photos.back || photos.side;

  return `
    <div class="page-head"><h1>تقدمي 📈</h1><p>متابعة التزامك وتطورك</p></div>

    <!-- Body Photos Section -->
    <div class="card" style="margin-bottom:24px">
      <div class="section-title">📸 صور تقدم الجسم <span>الوش / الظهر / الجنب</span></div>

      ${hasPhotos ? `
      <div style="margin-bottom:20px">
        <p style="color:var(--text-dim); font-size:13px; margin-bottom:12px">
          آخر تحديث: ${photos.date || '—'}
        </p>
        <div class="photos-upload-grid">
          <div style="position:relative">
            <div class="photo-slot" style="cursor:default">
              ${photos.front
                ? `<img src="${photos.front}" style="width:100%;height:100%;object-fit:cover"><div class="photo-date-badge">📸 الوش</div>`
                : `<div class="photo-icon">👤</div><div class="photo-label" style="color:var(--text-dim)">لم يُرفع</div>`}
            </div>
            ${photos.front ? `<button onclick="deleteMyPhoto('front')" style="position:absolute;top:6px;left:6px;width:26px;height:26px;border-radius:50%;background:rgba(220,50,50,0.85);border:none;color:#fff;font-size:14px;cursor:pointer;display:flex;align-items:center;justify-content:center;line-height:1;z-index:5" title="مسح صورة الوش">✕</button>` : ''}
          </div>
          <div style="position:relative">
            <div class="photo-slot" style="cursor:default">
              ${photos.back
                ? `<img src="${photos.back}" style="width:100%;height:100%;object-fit:cover"><div class="photo-date-badge">📸 الظهر</div>`
                : `<div class="photo-icon">🔄</div><div class="photo-label" style="color:var(--text-dim)">لم يُرفع</div>`}
            </div>
            ${photos.back ? `<button onclick="deleteMyPhoto('back')" style="position:absolute;top:6px;left:6px;width:26px;height:26px;border-radius:50%;background:rgba(220,50,50,0.85);border:none;color:#fff;font-size:14px;cursor:pointer;display:flex;align-items:center;justify-content:center;line-height:1;z-index:5" title="مسح صورة الظهر">✕</button>` : ''}
          </div>
          <div style="position:relative">
            <div class="photo-slot" style="cursor:default">
              ${photos.side
                ? `<img src="${photos.side}" style="width:100%;height:100%;object-fit:cover"><div class="photo-date-badge">📸 الجنب</div>`
                : `<div class="photo-icon">👤</div><div class="photo-label" style="color:var(--text-dim)">لم يُرفع</div>`}
            </div>
            ${photos.side ? `<button onclick="deleteMyPhoto('side')" style="position:absolute;top:6px;left:6px;width:26px;height:26px;border-radius:50%;background:rgba(220,50,50,0.85);border:none;color:#fff;font-size:14px;cursor:pointer;display:flex;align-items:center;justify-content:center;line-height:1;z-index:5" title="مسح صورة الجنب">✕</button>` : ''}
          </div>
        </div>
      </div>` : ''}

      <div>
        <p style="color:var(--text-dim); font-size:13px; margin-bottom:12px">
          ${hasPhotos ? '📤 رفع صور جديدة (ستحل محل السابقة وسيراها الكابتن)' : '📤 ارفع صورك حتى يتابع الكابتن تقدمك'}
        </p>
        <div class="photos-upload-grid">
          <div>
            <div class="photo-slot" id="uSlotFront" onclick="document.getElementById('uPhotoFront').click()">
              <div class="photo-icon">👤</div>
              <div class="photo-label">صورة الوش</div>
            </div>
            <input type="file" id="uPhotoFront" accept="image/*" style="display:none" onchange="previewBodyPhoto(this,'uSlotFront')">
          </div>
          <div>
            <div class="photo-slot" id="uSlotBack" onclick="document.getElementById('uPhotoBack').click()">
              <div class="photo-icon">🔄</div>
              <div class="photo-label">صورة الظهر</div>
            </div>
            <input type="file" id="uPhotoBack" accept="image/*" style="display:none" onchange="previewBodyPhoto(this,'uSlotBack')">
          </div>
          <div>
            <div class="photo-slot" id="uSlotSide" onclick="document.getElementById('uPhotoSide').click()">
              <div class="photo-icon">👤</div>
              <div class="photo-label">صورة الجنب</div>
            </div>
            <input type="file" id="uPhotoSide" accept="image/*" style="display:none" onchange="previewBodyPhoto(this,'uSlotSide')">
          </div>
        </div>
        <p style="font-size:12px; color:var(--text-dim); margin:10px 0">اضغط على أي صورة لاختيار الملف. بعد الاختيار اضغط رفع.</p>
        <button class="btn btn-primary" id="uUploadPhotosBtn" onclick="uploadMyBodyPhotos()">📤 رفع الصور</button>
      </div>
    </div>

    <!-- Analytics -->
    ${renderAnalyticsDashboard(history, workoutHistory)}
  `;
}

async function uploadMyBodyPhotos() {
  const front = document.getElementById('uPhotoFront');
  const back  = document.getElementById('uPhotoBack');
  const side  = document.getElementById('uPhotoSide');

  if (!front.files[0] && !back.files[0] && !side.files[0]) {
    toast('⚠️ اختر صورة واحدة على الأقل'); return;
  }

  const formData = new FormData();
  if (front.files[0]) formData.append('front', front.files[0]);
  if (back.files[0])  formData.append('back',  back.files[0]);
  if (side.files[0])  formData.append('side',  side.files[0]);

  const btn = document.getElementById('uUploadPhotosBtn');
  btn.disabled = true;
  btn.innerText = 'جاري الرفع...';

  try {
    const token = localStorage.getItem('token');
    const res = await fetch(API_BASE + '/inbody/my-photos', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + token },
      body: formData
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'فشل رفع الصور');
    }
    toast('✅ تم رفع صورك بنجاح! سيراها الكابتن على الفور.');
    setTimeout(() => goView('u-analytics'), 800);
  } catch(e) {
    toast('❌ ' + e.message);
    btn.disabled = false;
    btn.innerText = '📤 رفع الصور';
  }
}

async function deleteMyPhoto(slot) {
  const label = { front: 'الوش', back: 'الظهر', side: 'الجنب' }[slot] || slot;
  if (!(await appConfirm(`هل تريد مسح صورة ${label}؟`))) return;
  try {
    await apiFetch(`/inbody/my-photos/${slot}`, { method: 'DELETE' });
    toast(`✅ تم مسح صورة ${label} بنجاح`);
    setTimeout(() => goView('u-analytics'), 600);
  } catch(e) {
    toast('❌ ' + e.message);
  }
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
  // Stop any existing poll
  if (window._uChatPollTimer) { clearInterval(window._uChatPollTimer); window._uChatPollTimer = null; }
  
  const msgs = await apiFetch('/chat/1'); // Fetch chat with admin (ID: 1)
  const lastId = msgs.length > 0 ? msgs[msgs.length - 1].id : 0;

  
  const html = `
  <div class="page-head"><h1>المحادثة مع الكابتن</h1><p>لو عندك استفسار في التمرين أو الأكل، الكابتن هنا!</p></div>
  <div class="ai-chat-wrap" style="height:calc(100dvh - 160px); min-height:400px">
    <div class="ai-chat-head" style="background:linear-gradient(135deg,var(--surface-2),var(--surface-3))">
      <div class="ai-icon" style="background:var(--lime);color:#000;font-weight:900">C</div>
      <div>
        <div style="font-weight:700">كابتن الجيم</div>
      </div>
    </div>
    <div class="ai-chat-body chat-messages-area" id="uChatBody" style="flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:8px">
      ${msgs.length === 0 ? '<div style="text-align:center;color:var(--text-dim);padding:40px 20px">ابدأ المحادثة مع كابتنك 👋</div>' : ''}
      ${msgs.map(m => {
        const time = m.created_at ? new Date(m.created_at).toLocaleTimeString('ar-EG', {hour:'2-digit',minute:'2-digit'}) : '';
        if(m.is_me) {
          return `
            <div style="display:flex;flex-direction:column;align-items:flex-start;gap:2px">
              <div class="ai-bubble user" style="background:var(--surface-3);color:var(--text);border-radius:14px 14px 4px 14px;max-width:75%">${m.content}</div>
              ${time ? `<div style="font-size:10px;color:var(--text-dimmer);margin-right:4px">${time}</div>` : ''}
            </div>`;
        } else {
          return `
            <div style="display:flex;flex-direction:column;align-items:flex-end;gap:2px">
              <div class="ai-bubble assistant" style="background:var(--lime);color:#0d0e10;font-weight:600;border-radius:14px 14px 14px 4px;max-width:75%">${m.content}</div>
              ${time ? `<div style="font-size:10px;color:var(--text-dimmer);margin-left:4px">${time}</div>` : ''}
            </div>`;
        }
      }).join('')}
    </div>
    <div class="ai-chat-input">
      <input id="uChatInput" placeholder="اكتب رسالتك للكابتن..." onkeypress="if(event.key==='Enter') sendUChat()">
      <button class="btn btn-primary" onclick="sendUChat()">إرسال ↩</button>
    </div>
  </div>
  `;

  // Start polling after render
  setTimeout(() => {
    const body = document.getElementById('uChatBody');
    if (body) {
      body.scrollTop = body.scrollHeight;
      window._uChatLastMsgId = lastId;
      window._uChatPollTimer = setInterval(fetchUChatUpdates, 3000);
    }
  }, 100);

  return html;
}

async function fetchUChatUpdates() {
  const b = document.getElementById('uChatBody');
  if (!b) return;
  try {
    const newMsgs = await apiFetch('/chat/1');
    if (!newMsgs || newMsgs.length === 0) return;
    const latestId = newMsgs[newMsgs.length - 1].id;
    if (latestId <= window._uChatLastMsgId) return;
    const fresh = newMsgs.filter(m => m.id > window._uChatLastMsgId);
    window._uChatLastMsgId = latestId;
    fresh.forEach(m => {
      const time = m.created_at ? new Date(m.created_at).toLocaleTimeString('ar-EG', {hour:'2-digit',minute:'2-digit'}) : '';
      if(m.is_me) {
        b.insertAdjacentHTML('beforeend', `
          <div style="display:flex;flex-direction:column;align-items:flex-start;gap:2px">
            <div class="ai-bubble user" style="background:var(--surface-3);color:var(--text);border-radius:14px 14px 4px 14px;max-width:75%">${m.content}</div>
            ${time ? `<div style="font-size:10px;color:var(--text-dimmer);margin-right:4px">${time}</div>` : ''}
          </div>`);
      } else {
        b.insertAdjacentHTML('beforeend', `
          <div style="display:flex;flex-direction:column;align-items:flex-end;gap:2px">
            <div class="ai-bubble assistant" style="background:var(--lime);color:#0d0e10;font-weight:600;border-radius:14px 14px 14px 4px;max-width:75%">${m.content}</div>
            ${time ? `<div style="font-size:10px;color:var(--text-dimmer);margin-left:4px">${time}</div>` : ''}
          </div>`);
      }
    });
    b.scrollTop = b.scrollHeight;
  } catch(e) { /* ignore */ }
}

async function sendUChat(){
  const inp = document.getElementById('uChatInput');
  const txt = inp.value.trim();
  if(!txt) return;
  
  inp.value = '';
  const body = document.getElementById('uChatBody');
  const tempId = 'temp-' + Date.now();
  body.insertAdjacentHTML('beforeend', `
    <div id="${tempId}" style="display:flex;flex-direction:column;align-items:flex-start;gap:2px;opacity:0.5">
      <div class="ai-bubble user" style="background:var(--surface-3);color:var(--text);border-radius:14px 14px 4px 14px;max-width:75%">${txt}</div>
      <div style="font-size:10px;color:var(--text-dimmer);margin-right:4px">...</div>
    </div>`);
  body.scrollTop = body.scrollHeight;
  
  try {
    await apiFetch('/chat', {
      method: 'POST',
      body: JSON.stringify({ receiver_id: 1, content: txt })
    });
    const tempEl = document.getElementById(tempId);
    if(tempEl) tempEl.remove();
    await fetchUChatUpdates();
  } catch(e) {
    const tempEl = document.getElementById(tempId);
    if(tempEl) tempEl.remove();
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

/* ---- User Notifications ---- */
views['u-notifs'] = async () => {
  let data = [];
  try { data = await apiFetch('/notifications'); } catch(e) {}

  const icons = { appointment_reminder: '📅', subscription_expiry: '⏰', new_client: '🎉', general: '📢' };

  return `
  <div class="page-head"><h1>🔔 إشعاراتك</h1><p>كل التنبيهات والتذكيرات من الكابتن</p></div>
  ${data.length === 0 ? `
    <div class="card" style="text-align:center;padding:50px;color:var(--text-dim)">
      <div style="font-size:40px;margin-bottom:12px">🔔</div>
      <p>مفيش إشعارات جديدة حالياً</p>
    </div>` :
    data.map(n => `
    <div class="card" style="margin-bottom:10px;border-right:3px solid ${!n.is_read ? 'var(--lime)' : 'var(--border)'};padding:14px 18px;cursor:pointer;transition:all 0.2s" onclick="markNotifRead(${n.id});this.style.borderColor='var(--border)'">
      <div style="display:flex;gap:12px;align-items:flex-start">
        <span style="font-size:22px;flex-shrink:0">${icons[n.type] || '📢'}</span>
        <div style="flex:1">
          <div style="font-weight:700;font-size:14px;margin-bottom:4px;${!n.is_read ? 'color:var(--text)' : 'color:var(--text-dim)'}">${n.title}</div>
          <div style="font-size:13px;color:var(--text-dim);line-height:1.5">${n.message}</div>
          <div style="font-size:11px;color:var(--text-dimmer);margin-top:6px">${n.created_at}</div>
        </div>
        ${!n.is_read ? '<span style="width:8px;height:8px;border-radius:50%;background:var(--lime);flex-shrink:0;margin-top:4px"></span>' : ''}
      </div>
    </div>`).join('')
  }
  `;
};


/* ══════════════════════════════════════════
   نظام التغذية — للعميل فقط (بدون ماكروز)
══════════════════════════════════════════ */
views['u-nutrition'] = async () => {
  let plan = null;
  try {
    plan = await apiFetch('/workouts/my-nutrition');
  } catch(e) {}

  if (!plan || !plan.meals || plan.meals.length === 0) {
    return `
    <div class="page-head"><h1>🥗 نظام التغذية</h1><p>خطتك الغذائية من الكابتن</p></div>
    <div style="text-align:center;padding:60px 20px;background:var(--surface-2);border:1px solid var(--border);border-radius:20px">
      <div style="font-size:56px;margin-bottom:16px">🥗</div>
      <h3 style="color:var(--text);margin-bottom:8px">لسه ما جالكش نظام غذائي</h3>
      <p style="color:var(--text-dim)">الكابتن لسه بيجهز نظامك الغذائي. هتتنوتفاي لما يتجهز!</p>
    </div>`;
  }

  // ترتيب الوجبات حسب الوقت
  const mealOrder = ['فطار', 'سناك', 'غداء', 'عشاء', 'التمرين'];

  const gs = window._gymSettings || {};
  const logoUrl = gs.logo_url || null;
  const gymName = gs.gym_name || 'Fitix';
  const today = new Date().toLocaleDateString('ar-EG', { day: '2-digit', month: '2-digit', year: 'numeric' });

  // ── بناء الـ Cards بالديزاين المطلوب ──
  const mealsCards = plan.meals.map(m => {
    let parsed = null;
    try { parsed = JSON.parse(m.items); } catch(e) {}
    const alts = parsed?.alternatives || [];
    const mealTime = parsed?.meal_time || '';
    const mealRole = parsed?.meal_role || '';

    // عرض الخيارات للعميل — بدون أرقام كالوري/ماكروز
    const altsHtml = alts.map((alt, idx) => `
      <div style="margin-bottom:12px">
        <div style="font-size:12px;font-weight:700;color:var(--primary);margin-bottom:6px;display:flex;align-items:center;gap:6px">
          <span style="width:22px;height:22px;border-radius:50%;background:var(--primary);color:#000;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:900">${idx+1}</span>
          ${alt.alternative_label || 'خيار ' + (idx+1)}
        </div>
        <div style="padding-right:30px">
          ${(alt.items||[]).map(item => `
            <div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px dashed var(--border)">
              <span style="color:var(--primary);font-size:14px">•</span>
              <span style="font-size:13px;color:var(--text)">${item.food_name}</span>
              <span style="font-size:12px;color:var(--text-dim);margin-right:auto">${item.quantity_grams}g</span>
            </div>`).join('')}
        </div>
      </div>`).join('');

    return `
    <div style="background:var(--surface-2);border:1px solid var(--border);border-radius:16px;overflow:hidden;margin-bottom:16px;box-shadow:0 2px 12px rgba(0,0,0,0.15)">
      <!-- Meal Header -->
      <div style="background:var(--primary);padding:12px 18px;display:flex;justify-content:space-between;align-items:center">
        <div style="font-size:16px;font-weight:800;color:#000">${m.name}</div>
        <div style="font-size:12px;color:rgba(0,0,0,0.6)">${mealTime}${mealRole ? ' · ' + mealRole : ''}</div>
      </div>
      <!-- Meal Body -->
      <div style="padding:16px">
        ${alts.length > 0 ? altsHtml : `<p style="color:var(--text-dim);font-size:13px">${m.items}</p>`}
      </div>
    </div>`;
  });

  // ملاحظات للعميل (بدون ماكروز)
  const clientNotes = plan.client_notes || plan.notes || '';
  const workoutNotes = plan.workout_nutrition_notes || '';

  return `
  <!-- Header بالستايل بتاع الديزاين -->
  <div style="background:linear-gradient(135deg,var(--primary) 0%,#96c728 100%);border-radius:20px;padding:24px;margin-bottom:20px;position:relative;overflow:hidden">
    <div style="position:absolute;top:-20px;left:-20px;width:120px;height:120px;background:rgba(255,255,255,0.08);border-radius:50%"></div>
    <div style="position:absolute;bottom:-30px;right:20px;width:80px;height:80px;background:rgba(255,255,255,0.06);border-radius:50%"></div>
    <div style="position:relative;z-index:1;display:flex;justify-content:space-between;align-items:center">
      <div>
        <h1 style="color:#000;font-size:22px;font-weight:900;margin-bottom:4px">🥗 نظام التغذية</h1>
        <p style="color:rgba(0,0,0,0.65);font-size:13px">خطتك الغذائية من الكابتن — ${today}</p>
      </div>
      ${logoUrl ? `<img src="${logoUrl}" style="height:48px;object-fit:contain;border-radius:8px">` :
        `<div style="font-size:26px;font-weight:900;color:#000">${gymName}</div>`}
    </div>
  </div>

  <!-- زر تحميل النظام الغذائي -->
  <button onclick="printUserNutrition()" style="width:100%;display:flex;align-items:center;justify-content:center;gap:10px;background:var(--surface-2);border:1.5px solid var(--primary);color:var(--primary);border-radius:12px;padding:14px;font-size:15px;font-weight:700;cursor:pointer;margin-bottom:20px;transition:all 0.2s" onmouseover="this.style.background='var(--primary)';this.style.color='#000'" onmouseout="this.style.background='var(--surface-2)';this.style.color='var(--primary)'">
    📥 تحميل / طباعة النظام الغذائي
  </button>

  <!-- الوجبات -->
  ${mealsCards.join('')}

  <!-- ملاحظات التمرين والتغذية -->
  ${workoutNotes ? `
  <div style="background:var(--surface-2);border:1px solid var(--border);border-right:4px solid var(--cyan);border-radius:12px;padding:16px;margin-bottom:16px">
    <h4 style="color:var(--cyan);margin-bottom:8px">🏋️ التغذية والتمرين</h4>
    <p style="font-size:13px;color:var(--text);line-height:1.7">${workoutNotes}</p>
  </div>` : ''}

  <!-- ملاحظات عامة -->
  ${clientNotes ? `
  <div style="background:var(--surface-2);border:1px solid var(--border);border-right:4px solid var(--primary);border-radius:12px;padding:16px">
    <h4 style="color:var(--primary);margin-bottom:8px">💡 نصائح الكابتن</h4>
    <p style="font-size:13px;color:var(--text);line-height:1.7">${clientNotes}</p>
  </div>` : ''}
  `;
};

// ── طباعة / تحميل النظام الغذائي للعميل ──
window.printUserNutrition = async function() {
  try {
    const plan = await apiFetch('/workouts/my-nutrition');
    if (!plan || !plan.meals) { alert('لا يوجد نظام غذائي لتحميله.'); return; }

    const me = JSON.parse(localStorage.getItem('user') || '{}');
    const gs = window._gymSettings || {};
    const today = new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: '2-digit', day: '2-digit' });

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

    const m1 = plan.meals[0];
    const m2 = plan.meals[1];
    const m3 = plan.meals[2];
    const m4 = plan.meals[3];
    const clientNotes = plan.client_notes || plan.notes || plan.goal || '';

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
      <div class="name-field">الاسم / ${me.full_name || me.name || 'العميل'}</div>
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
  }
}


