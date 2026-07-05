// ── Future PathX – Main JS ──

// Global Authentication Guard
(function() {
  const isLoginPage = window.location.pathname.includes('login.html');
  const isLoggedIn = localStorage.getItem('fpx_logged_in') === 'true';

  if (!isLoggedIn && !isLoginPage) {
    // If in root, go to pages/login.html. If in pages/, go to login.html
    const pathPrefix = window.location.pathname.includes('/pages/') ? '' : 'pages/';
    window.location.href = pathPrefix + 'login.html';
  }
})();

function handleLogout() {
  localStorage.removeItem('fpx_logged_in');
  localStorage.removeItem('fpx_user_name');
  const pathPrefix = window.location.pathname.includes('/pages/') ? '' : 'pages/';
  window.location.href = pathPrefix + 'login.html';
}

// Chat Widget
function toggleChat() {
  const panel = document.getElementById('chatPanel');
  panel.classList.toggle('open');
}

const botReplies = {
  python: "Python is great for Data Science, AI Engineering, and Backend Development. I'd recommend starting with Python basics, then moving into libraries like Pandas, NumPy, and TensorFlow.",
  data: "Data Scientist is one of the most in-demand roles! You'll need Python, SQL, Statistics, and Machine Learning skills. Check our roadmap for a step-by-step guide.",
  resume: "A strong resume should have clear sections: Personal Info, Education, Skills, Projects, and Experience. Use our Resume Builder to create one! Also check your ATS score.",
  career: "Based on common profiles, popular tech careers include AI Engineer, Data Scientist, Software Developer, and Cloud Architect. Take our Career Test for personalized suggestions!",
  skill: "Visit our Skill Gap Analyzer to see what skills you're missing for your target career. We also recommend learning resources for each missing skill.",
  ai: "AI Engineering involves Python, Machine Learning, Deep Learning, and frameworks like TensorFlow and PyTorch. Check our AI Engineer Roadmap for a complete guide.",
  default: "That's a great question! I'd recommend exploring our Career Test for personalized guidance, or browsing the Career Explorer for detailed career profiles. You can also check the Learning Resources section. 🚀"
};

function sendChat() {
  const input = document.getElementById('chatInput');
  const messages = document.getElementById('chatMessages');
  if (!input || !messages) return;
  const text = input.value.trim();
  if (!text) return;

  // User message
  const userMsg = document.createElement('div');
  userMsg.className = 'msg user';
  userMsg.textContent = text;
  messages.appendChild(userMsg);
  input.value = '';

  // Bot reply
  setTimeout(() => {
    const lower = text.toLowerCase();
    let reply = botReplies.default;
    for (const [key, val] of Object.entries(botReplies)) {
      if (lower.includes(key)) { reply = val; break; }
    }
    const botMsg = document.createElement('div');
    botMsg.className = 'msg bot';
    botMsg.textContent = reply;
    messages.appendChild(botMsg);
    messages.scrollTop = messages.scrollHeight;
  }, 600);

  messages.scrollTop = messages.scrollHeight;
}

// Animate progress bars on scroll
function animateOnScroll() {
  const bars = document.querySelectorAll('.progress-bar-fill, .score-fill');
  bars.forEach(bar => {
    const rect = bar.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      if (bar.style.width === '0%' || !bar.style.width) {
        const targetWidth = bar.getAttribute('data-width') || '0%';
        bar.style.width = targetWidth;
      }
      bar.style.transition = 'width 1.2s cubic-bezier(0.4,0,0.2,1)';
    }
  });
}
window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);

// Tag input helper (used in multiple pages)
function initTagInput(inputId, containerId, storageKey) {
  const input = document.getElementById(inputId);
  const container = document.getElementById(containerId);
  if (!input || !container) return;

  let tags = JSON.parse(localStorage.getItem(storageKey) || '[]');
  renderTags();

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = input.value.trim().replace(',', '');
      if (val && !tags.includes(val)) {
        tags.push(val);
        localStorage.setItem(storageKey, JSON.stringify(tags));
        renderTags();
      }
      input.value = '';
    }
  });

  function renderTags() {
    container.innerHTML = '';
    tags.forEach(t => {
      const tag = document.createElement('span');
      tag.className = 'tag';
      tag.innerHTML = `${t} <button onclick="removeTag('${storageKey}','${t}')">✕</button>`;
      container.appendChild(tag);
    });
  }
}

function removeTag(storageKey, val) {
  let tags = JSON.parse(localStorage.getItem(storageKey) || '[]');
  tags = tags.filter(t => t !== val);
  localStorage.setItem(storageKey, JSON.stringify(tags));
  location.reload();
}

// Global Personalization System - Updated for Anonymity
function applyPersonalization() {
  const userName = 'Innovator'; // No name mentioned
  const userId = 'FPX-SESSION-ACTIVE';
  
  // Update all Name placeholders
  document.querySelectorAll('.u-name').forEach(el => el.textContent = userName);
  
  // Update all ID placeholders
  document.querySelectorAll('.u-id').forEach(el => el.textContent = userId);
  
  // Create engaging but anonymous greetings
  const greetings = [
    `Welcome back 🚀`,
    `Ready for your next career move?`,
    `Great to see you again!`,
    `Let's level up your career!`
  ];
  
  const welcomeEl = document.querySelector('.welcome-text');
  if (welcomeEl) {
    welcomeEl.textContent = greetings[Math.floor(Math.random() * greetings.length)];
  }

  // Remove specific name from all placeholders globally
  document.querySelectorAll('input, textarea').forEach(input => {
    if (input.placeholder.includes('Bharath')) {
      input.placeholder = input.placeholder.replace('Bharath', 'User');
    }
  });
}

// Connect to the Backend (Test connection)
window.addEventListener('DOMContentLoaded', () => {
  applyPersonalization();
  
  console.log('Testing connection to backend...');
  fetch('/api/health')
    .then(response => response.json())
    .then(data => {
      console.log('✅ Backend Connection Successful:', data.message);
    })
    .catch(error => {
      console.error('❌ Backend Connection Failed:', error);
    });
    
  // Update user name from local storage
  const userNameEl = document.querySelector('.nav-user span');
  const avatarEl = document.querySelector('.avatar');
  
  if (userNameEl) {
    const storedName = localStorage.getItem('fpx_user_name');
    if (storedName) {
      userNameEl.textContent = storedName;
      if (avatarEl) avatarEl.textContent = storedName.charAt(0);
    }
  }
  
  // Add logout listener if a logout button exists
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
});

