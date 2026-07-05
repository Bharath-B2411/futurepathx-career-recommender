/* ============================================================
   FUTURE PATHX – DASHBOARD JS
   Handles: animations, goals, chat, modal, progress rings
   ============================================================ */

/* ─── Utility ─── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ─── Personalization ─── */
const student = {
  name: 'Bharath',
  avatar: 'B',
  streak: 7,
  overallPct: 68,
};

function initPersonalization() {
  const greetName = $('#greetName');
  const userName = $('#userName');
  const userAvatar = $('#userAvatar');
  const chatGreet = $('#chatGreet');

  if (greetName)   greetName.textContent = student.name;
  if (userName)    userName.textContent  = student.name;
  if (userAvatar)  userAvatar.textContent = student.avatar;
  if (chatGreet)   chatGreet.textContent  = student.name;

  const streakEl = $('#streakCount');
  if (streakEl) streakEl.textContent = student.streak;
}

/* ─── SVG Gradient Defs (inject into page) ─── */
function injectSVGDefs() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '0');
  svg.setAttribute('height', '0');
  svg.style.position = 'absolute';
  svg.innerHTML = `
    <defs>
      <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%"   stop-color="#38bdf8"/>
        <stop offset="100%" stop-color="#818cf8"/>
      </linearGradient>
      <linearGradient id="resumeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%"   stop-color="#34d399"/>
        <stop offset="100%" stop-color="#38bdf8"/>
      </linearGradient>
    </defs>`;
  document.body.prepend(svg);
}

/* ─── Circular Progress Ring ─── */
function animateRing(el, pct, circumference) {
  if (!el) return;
  const offset = circumference - (circumference * pct) / 100;
  el.style.strokeDashoffset = offset;
}

function initRings() {
  // Welcome overview ring (circumference = 2π × 50 ≈ 314)
  const ring = $('#progressRing');
  if (ring) {
    setTimeout(() => animateRing(ring, student.overallPct, 314), 400);
  }

  // Resume arc (circumference = 2π × 42 ≈ 264)
  const resumeArc = $('#resumeArc');
  if (resumeArc) {
    setTimeout(() => animateRing(resumeArc, 78, 264), 500);
  }
}

/* ─── Score bar animations (career & skill gap) ─── */
function animateBars() {
  const bars = $$('[data-target]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = el.dataset.target;
        el.style.width = target + '%';
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.2 });

  bars.forEach(bar => observer.observe(bar));
}

/* ─── Skill gap bars ─── */
function animateSkillBars() {
  const bars = $$('.skill-bar-fill');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const target = bar.dataset.target;
        if (target) { bar.style.width = target + '%'; }
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.2 });

  bars.forEach(b => observer.observe(b));
}

/* ─── Fade-up on scroll ─── */
function initScrollReveal() {
  const revealEls = $$('.glass-card, .career-card, .resource-card, .trend-item');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(18px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });

  // Add revealed CSS directly
  document.head.insertAdjacentHTML('beforeend', `
    <style>.revealed { opacity: 1 !important; transform: translateY(0) !important; }</style>
  `);
}

/* ─── Goals / Tasks ─── */
let activeFilter = 'all';

function filterGoals(period, btn) {
  activeFilter = period;
  $$('.goal-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');

  const items = $$('.goal-item');
  items.forEach(item => {
    const itemPeriod = item.dataset.period;
    const show = period === 'all' || itemPeriod === period;
    item.style.display = show ? 'flex' : 'none';
  });
}

function toggleGoal(btn) {
  const item = btn.closest('.goal-item');
  const isDone = item.dataset.done === 'true';
  item.dataset.done = (!isDone).toString();

  const titleEl = item.querySelector('.goal-title');
  const priorityEl = item.querySelector('.goal-priority');

  if (!isDone) {
    btn.classList.add('done');
    btn.querySelector('.check-inner').textContent = '✓';
    titleEl.classList.add('goal-done-text');
    priorityEl.textContent = 'Done';
    priorityEl.className = 'goal-priority low-p';
  } else {
    btn.classList.remove('done');
    btn.querySelector('.check-inner').textContent = '';
    titleEl.classList.remove('goal-done-text');
    priorityEl.textContent = 'High';
    priorityEl.className = 'goal-priority high-p';
  }

  updateGoalCounts();
}

function updateGoalCounts() {
  const items = $$('.goal-item');
  const done = items.filter(i => i.dataset.done === 'true').length;
  const pend = items.length - done;
  const doneEl = $('#doneCount');
  const pendEl = $('#pendCount');
  const fillEl = $('#monthFill');
  if (doneEl) doneEl.textContent = done;
  if (pendEl) pendEl.textContent = pend;
  if (fillEl) {
    const pct = Math.round((done / items.length) * 100);
    fillEl.style.width = pct + '%';
  }
}

/* Add Goal Modal */
function openAddGoal() {
  $('#goalModal').classList.add('open');
  // Set default date to tomorrow
  const tmr = new Date();
  tmr.setDate(tmr.getDate() + 1);
  $('#newGoalDate').value = tmr.toISOString().split('T')[0];
}

function closeAddGoal() {
  $('#goalModal').classList.remove('open');
}

function closeModal(e) {
  if (e.target.id === 'goalModal') closeAddGoal();
}

function addGoal() {
  const title    = $('#newGoalTitle').value.trim();
  const category = $('#newGoalCategory').value;
  const date     = $('#newGoalDate').value;
  const priority = $('#newGoalPriority').value;

  if (!title) {
    $('#newGoalTitle').focus();
    return;
  }

  const catLabels = {
    'cat-learn':  '📖 Learning',
    'cat-resume': '📄 Resume',
    'cat-skill':  '⚡ Skill',
    'cat-career': '🎯 Career',
  };
  const priLabels = {
    'high-p': 'High',
    'med-p':  'Medium',
    'low-p':  'Low',
  };
  const dateLabel = date
    ? new Date(date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
    : '';

  const item = document.createElement('div');
  item.className = 'goal-item';
  item.dataset.period = 'month';
  item.dataset.done = 'false';
  item.innerHTML = `
    <button class="goal-check" onclick="toggleGoal(this)" aria-label="Mark done">
      <span class="check-inner"></span>
    </button>
    <div class="goal-info">
      <span class="goal-title">${escapeHtml(title)}</span>
      <span class="goal-meta">
        <span class="goal-category ${category}">${catLabels[category]}</span>
        <span class="goal-due">${dateLabel}</span>
      </span>
    </div>
    <span class="goal-priority ${priority}">${priLabels[priority]}</span>
  `;

  $('#goalsList').prepend(item);
  updateGoalCounts();
  closeAddGoal();

  // Reset form
  $('#newGoalTitle').value = '';

  showToast('Goal added! ✅');
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

/* ─── Toast notification ─── */
function showToast(msg) {
  const toast = document.createElement('div');
  toast.className = 'db-toast';
  toast.textContent = msg;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('db-toast-show'));
  setTimeout(() => {
    toast.classList.remove('db-toast-show');
    setTimeout(() => toast.remove(), 400);
  }, 2800);
}

// Inject toast styles
document.head.insertAdjacentHTML('beforeend', `
<style>
.db-toast {
  position: fixed; bottom: 1.5rem; left: 50%; transform: translateX(-50%) translateY(20px);
  background: var(--surface2); border: 1px solid rgba(56,189,248,0.25); border-radius: 100px;
  padding: 0.6rem 1.5rem; color: var(--text); font-size: 0.88rem; z-index: 9999;
  opacity: 0; transition: all 0.35s ease; box-shadow: 0 8px 30px rgba(0,0,0,0.4);
  white-space: nowrap;
}
.db-toast-show { opacity: 1; transform: translateX(-50%) translateY(0); }
</style>
`);

/* ─── AI Chat Widget ─── */
const chatResponses = {
  keywords: [
    { keys: ['resume','cv'], reply: 'Your resume is 78% complete. Add your Projects and Certifications sections to boost it above 90! 📄' },
    { keys: ['skill','gap','missing'], reply: 'I found 4 critical skill gaps for AI Engineering: MLOps, Docker, Transformer Models, and GPU Programming. Start with the MLOps course I\'ve recommended! ⚡' },
    { keys: ['salary','pay','lpa','earn'], reply: 'Senior AI Engineers in India earn ₹20–40 LPA! Entry-level roles start at ₹8–12 LPA. Building a strong portfolio can accelerate your career significantly. 💰' },
    { keys: ['course','learn','study'], reply: 'Top picks for you: 1) Deep Learning Specialization (Coursera), 2) MLOps Full Course (YouTube), 3) NLP with Transformers (HuggingFace). All accessible from your Resources page! 📚' },
    { keys: ['career','job','engineer'], reply: 'AI Engineering is the #1 trending career in 2026 with 430% job growth! Your profile matches 92%. Keep building skills and portfolio projects! 🤖' },
    { keys: ['roadmap','plan','path'], reply: 'Your AI Engineer roadmap: Python ✓ → Data Science ✓ → ML ✓ → Deep Learning (in progress) → NLP → MLOps → Portfolio → Apply. You\'re 60% there! 🗺️' },
    { keys: ['hello','hi','hey'], reply: `Hi ${student.name}! 👋 How can I help with your career today? Ask me about skills, resume, careers, or resources!` },
  ],
  default: 'Great question! I\'d suggest exploring your personalized roadmap and skill gap analysis for more detailed guidance. You can also check the Resources page for expert courses! 🎯'
};

function toggleChat() {
  const panel = $('#chatPanel');
  panel.classList.toggle('open');
  if (panel.classList.contains('open')) {
    setTimeout(() => $('#chatInput')?.focus(), 100);
  }
}

function sendChat() {
  const input = $('#chatInput');
  const msgs  = $('#chatMessages');
  const text  = input.value.trim();
  if (!text) return;

  // User message
  const userMsg = document.createElement('div');
  userMsg.className = 'msg user';
  userMsg.textContent = text;
  msgs.appendChild(userMsg);
  input.value = '';
  msgs.scrollTop = msgs.scrollHeight;

  // Typing indicator
  const typing = document.createElement('div');
  typing.className = 'msg bot';
  typing.id = 'typing';
  typing.innerHTML = '<span style="opacity:0.7">● ● ●</span>';
  msgs.appendChild(typing);
  msgs.scrollTop = msgs.scrollHeight;

  setTimeout(() => {
    typing.remove();

    const lc = text.toLowerCase();
    let reply = chatResponses.default;
    for (const { keys, reply: r } of chatResponses.keywords) {
      if (keys.some(k => lc.includes(k))) { reply = r; break; }
    }

    const botMsg = document.createElement('div');
    botMsg.className = 'msg bot';
    botMsg.textContent = reply;
    msgs.appendChild(botMsg);
    msgs.scrollTop = msgs.scrollHeight;
  }, 900);
}

/* ─── Init ─── */
document.addEventListener('DOMContentLoaded', () => {
  injectSVGDefs();
  initPersonalization();
  initRings();
  animateBars();
  animateSkillBars();
  initScrollReveal();
  updateGoalCounts();
});
