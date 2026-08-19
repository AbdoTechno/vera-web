/**
 * VERA Clinical Intelligence Landing Page Logic v3.0
 * Enhanced: Canvas Particles | VERA AI Simulator | Scroll Reveal | Counter Animations
 */

document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initNavbarScroll();
  initScrollReveal();
  initCounterAnimations();
  initRagDemoSimulator();
  initDownloadButton();
});

/* ═══════════════════════════════════════════
   1. CANVAS PARTICLE SYSTEM
═══════════════════════════════════════════ */
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W = canvas.width = window.innerWidth;
  let H = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  });

  const PARTICLE_COUNT = 60;
  const particles = [];

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.5 + 0.4,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.5 + 0.1
    });
  }

  function drawParticles() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach((p, i) => {
      // Move
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      // Draw dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 212, 200, ${p.alpha})`;
      ctx.fill();

      // Draw connecting lines to nearby particles
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dist = Math.hypot(p.x - q.x, p.y - q.y);
        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(0, 212, 200, ${0.07 * (1 - dist / 130)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    });
    requestAnimationFrame(drawParticles);
  }

  drawParticles();
}

/* ═══════════════════════════════════════════
   2. NAVBAR SCROLL EFFECT
═══════════════════════════════════════════ */
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.style.background = 'rgba(5, 13, 26, 0.97)';
      navbar.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.6)';
      navbar.style.padding = '14px 5%';
    } else {
      navbar.style.background = 'rgba(5, 13, 26, 0.88)';
      navbar.style.boxShadow = 'none';
      navbar.style.padding = '18px 5%';
    }
  });
}

/* ═══════════════════════════════════════════
   3. SCROLL REVEAL ANIMATIONS
═══════════════════════════════════════════ */
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ═══════════════════════════════════════════
   4. COUNTER ANIMATIONS
═══════════════════════════════════════════ */
function initCounterAnimations() {
  const counters = document.querySelectorAll('[data-count-target]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-count-target'));
      const duration = 1800;
      const start = Date.now();

      function tick() {
        const elapsed = Date.now() - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * target);
        el.textContent = target >= 1000 ? (current >= 1000 ? Math.round(current / 1000) + 'k+' : current) : current + '%';
        if (progress < 1) requestAnimationFrame(tick);
      }
      tick();
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

/* ═══════════════════════════════════════════
   5. VERA CHAT SIMULATOR + RAG PIPELINE
═══════════════════════════════════════════ */
const ragQueries = {
  sma: {
    title: 'SMA Nusinersen Protocol',
    userMsg: 'What are the Nusinersen loading dose criteria for pediatric SMA Type 1?',
    steps: [
      { num: '01', title: 'Dense Embeddings', desc: 'Query encoded into 768-dim vector space', meta: 'text-embedding-004' },
      { num: '02', title: 'ChromaDB Matching', desc: 'Top-3 nearest chunks (Cos: 0.89)', meta: 'vault/sma_protocol.pdf' },
      { num: '03', title: 'Grounded Synthesis', desc: 'Zero-hallucination verification active', meta: 'Safety Gate 100%' },
      { num: '04', title: 'Clinical Recommendation', desc: 'Structured guidance + citations generated', meta: '⚡ Latency: 1.1s' }
    ],
    latency: '⚡ Verified in 1.1s',
    paragraphs: [
      'Retrieving from indexed SMA clinical vault...',
      '<strong>Nusinersen (Spinraza) Pediatric Loading Protocol:</strong>',
      '1. <strong>Loading Regimen:</strong> 4 intrathecal doses of 12 mg / 5 mL each.<br>2. <strong>Schedule:</strong> Days 0, 14, 28, and 63.<br>3. <strong>Maintenance:</strong> 12 mg IT every 4 months after Day 63.',
      '<div class="chat-citation">📋 [Grounded Source] SMA Clinical Management Guidelines 2024, Page 14 — Cosine Similarity: 0.89</div>'
    ]
  },
  hf: {
    title: 'ESC 2024 Heart Failure',
    userMsg: 'What are the 4-pillar GDMT titration guidelines for HFrEF patients?',
    steps: [
      { num: '01', title: 'Dense Embeddings', desc: 'Query vectorized via clinical tokenizer', meta: 'Dim: 768' },
      { num: '02', title: 'ChromaDB Matching', desc: 'ESC 2024 Consensus section retrieved', meta: 'Sim: 0.92' },
      { num: '03', title: 'Grounded Synthesis', desc: 'Cross-checked contraindication rules', meta: 'Grounded ✓' },
      { num: '04', title: 'Clinical Recommendation', desc: '4-week titration roadmap formulated', meta: '⚡ Latency: 0.9s' }
    ],
    latency: '⚡ Verified in 0.9s',
    paragraphs: [
      'Querying ESC 2024 Heart Failure Guideline vault...',
      '<strong>ESC 2024 GDMT 4-Pillars for HFrEF:</strong>',
      '1. <strong>ARNi / ACEi:</strong> Sacubitril/Valsartan 97/103 mg BID.<br>2. <strong>Beta-Blocker:</strong> Bisoprolol target 10 mg QD.<br>3. <strong>MRA:</strong> Spironolactone 50 mg QD — monitor eGFR/K⁺.<br>4. <strong>SGLT2i:</strong> Dapagliflozin 10 mg or Empagliflozin 10 mg QD.',
      '<div class="chat-citation">📋 [Grounded Source] ESC Heart Failure Guidelines 2024 Update — Cosine Similarity: 0.92</div>'
    ]
  },
  sepsis: {
    title: 'Surviving Sepsis 2024',
    userMsg: 'What is the recommended golden hour resuscitation bundle for septic shock?',
    steps: [
      { num: '01', title: 'Dense Embeddings', desc: 'Emergency protocol query indexed', meta: 'Urgent Priority' },
      { num: '02', title: 'ChromaDB Matching', desc: 'SCCM 2024 Sepsis guidelines matched', meta: 'Cos: 0.94' },
      { num: '03', title: 'Grounded Synthesis', desc: 'Fluid vs vasopressor timing verified', meta: 'Grounded ✓' },
      { num: '04', title: 'Clinical Recommendation', desc: '1-Hour bundle steps validated', meta: '⚡ Latency: 1.0s' }
    ],
    latency: '⚡ Verified in 1.0s',
    paragraphs: [
      'Activating emergency sepsis protocol lookup...',
      '<strong>Surviving Sepsis Campaign — 1-Hour Bundle:</strong>',
      '1. <strong>Lactate:</strong> Re-measure if initial &gt; 2 mmol/L.<br>2. <strong>Blood Cultures:</strong> Obtain before antibiotic administration.<br>3. <strong>Antibiotics:</strong> Broad-spectrum within 1 hour of recognition.<br>4. <strong>Fluids:</strong> 30 mL/kg balanced crystalloids for hypotension.<br>5. <strong>Vasopressors:</strong> Norepinephrine early if MAP &lt; 65 mmHg.',
      '<div class="chat-citation">📋 [Grounded Source] SCCM Surviving Sepsis Guidelines 2024 — Cosine Similarity: 0.94</div>'
    ]
  }
};

let currentSimTimeout = null;

function initRagDemoSimulator() {
  const tabBtns = document.querySelectorAll('.demo-tab-btn');
  const stepsContainer = document.getElementById('demo-pipeline-steps');
  const chatBody = document.getElementById('vera-chat-body');
  const veraAvatar = document.getElementById('vera-avatar');
  const veraStatus = document.getElementById('vera-status-text');
  const veraLatency = document.getElementById('vera-latency-badge');

  function clearTimeouts() {
    if (currentSimTimeout) clearTimeout(currentSimTimeout);
  }

  function setStatus(text) {
    if (veraStatus) veraStatus.textContent = text;
  }

  function addUserMessage(text) {
    const msg = document.createElement('div');
    msg.className = 'chat-msg-user';
    msg.innerHTML = `<div class="chat-bubble-user">${text}</div>`;
    chatBody.appendChild(msg);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function addVeraTyping() {
    const msg = document.createElement('div');
    msg.className = 'chat-msg-vera';
    msg.id = 'vera-typing-indicator';
    msg.innerHTML = `
      <div class="chat-msg-mini-avatar">V</div>
      <div class="chat-bubble-vera">
        <div class="typing-indicator">
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
        </div>
      </div>`;
    chatBody.appendChild(msg);
    chatBody.scrollTop = chatBody.scrollHeight;
    return msg;
  }

  function removeTyping() {
    const t = document.getElementById('vera-typing-indicator');
    if (t) t.remove();
  }

  function typeVeraMessage(html, onDone) {
    removeTyping();
    const msgWrap = document.createElement('div');
    msgWrap.className = 'chat-msg-vera';
    const miniAv = document.createElement('div');
    miniAv.className = 'chat-msg-mini-avatar';
    miniAv.textContent = 'V';
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble-vera';
    msgWrap.appendChild(miniAv);
    msgWrap.appendChild(bubble);
    chatBody.appendChild(msgWrap);

    // Use innerHTML for rich content, then animate in
    bubble.style.opacity = '0';
    bubble.innerHTML = html;
    setTimeout(() => {
      bubble.style.transition = 'opacity 0.4s ease';
      bubble.style.opacity = '1';
    }, 50);
    chatBody.scrollTop = chatBody.scrollHeight;
    if (onDone) onDone();
  }

  function activateStep(stepCards, idx) {
    stepCards.forEach(s => s.classList.remove('active'));
    if (idx < stepCards.length) stepCards[idx].classList.add('active');
  }

  function renderDemo(key) {
    clearTimeouts();
    const data = ragQueries[key];
    if (!data) return;

    // Clear chat
    chatBody.innerHTML = '';
    if (veraAvatar) veraAvatar.classList.remove('speaking');
    setStatus('Online • Processing query...');

    // Render pipeline steps
    stepsContainer.innerHTML = data.steps.map((step, idx) => `
      <div class="pipeline-step" data-step="${idx}">
        <div class="step-num">${step.num}</div>
        <div class="step-title">${step.title}</div>
        <div class="step-desc">${step.desc}</div>
        <div style="font-size: 0.63rem; color: #00FFE5; margin-top: 7px; font-family: monospace; font-weight: 600;">${step.meta}</div>
      </div>`).join('');

    const stepCards = stepsContainer.querySelectorAll('.pipeline-step');

    // Step 1: User sends message
    currentSimTimeout = setTimeout(() => {
      addUserMessage(data.userMsg);
      activateStep(stepCards, 0);
    }, 200);

    // Step 2: VERA starts typing
    currentSimTimeout = setTimeout(() => {
      if (veraAvatar) veraAvatar.classList.add('speaking');
      setStatus('Retrieving from ChromaDB vault...');
      addVeraTyping();
      activateStep(stepCards, 1);
    }, 900);

    // Step 3: Step 3 active
    currentSimTimeout = setTimeout(() => {
      setStatus('Verifying against clinical guidelines...');
      activateStep(stepCards, 2);
    }, 1700);

    // Step 4: Active
    currentSimTimeout = setTimeout(() => {
      setStatus('Synthesizing grounded response...');
      activateStep(stepCards, 3);
    }, 2500);

    // Final: All steps done, VERA speaks first line
    currentSimTimeout = setTimeout(() => {
      if (veraLatency) veraLatency.textContent = data.latency;
      stepCards.forEach(s => s.classList.add('active'));
      setStatus('Online • Evidence Verification Active');

      // First VERA message - retrieving notice
      typeVeraMessage(data.paragraphs[0]);
    }, 3300);

    // Second VERA message - main title
    currentSimTimeout = setTimeout(() => {
      typeVeraMessage(data.paragraphs[1]);
    }, 4000);

    // Third VERA message - clinical details
    currentSimTimeout = setTimeout(() => {
      typeVeraMessage(data.paragraphs[2]);
    }, 4800);

    // Fourth VERA message - citation
    currentSimTimeout = setTimeout(() => {
      typeVeraMessage(data.paragraphs[3]);
      if (veraAvatar) veraAvatar.classList.remove('speaking');
    }, 5800);
  }

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderDemo(btn.dataset.query);
    });
  });

  // Initial load
  renderDemo('sma');
}

/* ═══════════════════════════════════════════
   6. DOWNLOAD BUTTON & TOAST
═══════════════════════════════════════════ */
function initDownloadButton() {
  const downloadBtns = document.querySelectorAll('.download-trigger');
  downloadBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      showToast('Initiating VERA Clinical Assistant APK Download (v2.4.0)...');
    });
  });
}

function showToast(msg) {
  let toast = document.getElementById('vera-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'vera-toast';
    toast.style.cssText = `
      position: fixed;
      bottom: 30px;
      right: 30px;
      background: linear-gradient(135deg, #00D4C8, #0D9488);
      color: white;
      padding: 14px 24px;
      border-radius: 16px;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-weight: 700;
      font-size: 0.88rem;
      box-shadow: 0 16px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,255,229,0.3);
      z-index: 9999;
      display: flex; align-items: center; gap: 10px;
      transform: translateY(100px);
      opacity: 0;
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      border: 1px solid rgba(0,255,229,0.3);
    `;
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> ` + msg;
  toast.style.transform = 'translateY(0)';
  toast.style.opacity = '1';

  setTimeout(() => {
    toast.style.transform = 'translateY(100px)';
    toast.style.opacity = '0';
  }, 3500);
}
