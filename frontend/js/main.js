/* ============ INIT ============ */
function toggleLoginRole(){
  const btn = document.getElementById('roleToggleBtn');
  const t = document.getElementById('loginTitle');
  const sub = document.getElementById('loginSub');
  const u = document.getElementById('loginUser');
  const p = document.getElementById('loginPass');
  
  u.value = '';
  p.value = '';
  
  if(btn.innerText.includes('ادمن')){
    btn.innerText = '🏋️ أنا عميل';
    t.innerText = 'تسجيل دخول المدرب (الادمن)';
    sub.innerText = 'ادخل لادارة الجيم الخاص بك';
    u.placeholder = 'اسم مستخدم المدرب';
    document.getElementById('loginIcon').innerHTML = ic.dash;
  } else {
    btn.innerText = '🧑‍💼 أنا ادمن';
    t.innerText = 'تسجيل دخول العميل';
    sub.innerText = 'ادخل اليوزر والباسورد اللي دّهملك كابتنك';
    u.placeholder = 'مثال: omar.fit';
    document.getElementById('loginIcon').innerHTML = ic.users;
  }
}

async function doLogin(){
  const user = document.getElementById('loginUser').value.trim().toLowerCase();
  const pass = document.getElementById('loginPass').value.trim();
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
    if (data.user.role === 'admin') {
      toast('أهلاً بيك يا كابتن 👋');
    } else {
      toast(`أهلاً بيك يا ${data.user.full_name}`);
    }
    startNotifPolling();
    loadGymSettings();
    
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
  
  const hideStyle = document.getElementById('hideLoginWrap');
  if(hideStyle) hideStyle.remove();
  
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
      startNotifPolling();
      loadGymSettings();
    } catch(e) {
      logout();
    }
  }
});
