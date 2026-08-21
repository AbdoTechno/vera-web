/**
 * VERA Clinical Intelligence Landing Page Logic v3.0
 * Enhanced: Canvas Particles | VERA AI Simulator | Scroll Reveal | Counter Animations
 */

document.addEventListener('DOMContentLoaded', () => {
  // particles removed
  initNavbarScroll();
  initScrollReveal();
  initCounterAnimations();
  initRagDemoSimulator();
  initDownloadButton();
  initHeroBackground();
});

/* ═══════════════════════════════════════════
   1. CANVAS PARTICLE SYSTEM — removed
═══════════════════════════════════════════ */

/* ═══════════════════════════════════════════
   1b. HERO VECTOR NETWORK BACKGROUND
═══════════════════════════════════════════ */
function initHeroBackground() {
  // Respect reduced-motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const hero = canvas.parentElement;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = hero.offsetWidth;
    canvas.height = hero.offsetHeight;
  }
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(hero);

  // Nodes represent vector embeddings in ChromaDB space
  const NODE_COUNT = 22;
  const CONNECT_DIST = 200;
  const nodes = Array.from({ length: NODE_COUNT }, () => ({
    x:      Math.random(),
    y:      Math.random(),
    vx:     (Math.random() - 0.5) * 0.00018,
    vy:     (Math.random() - 0.5) * 0.00018,
    r:      Math.random() * 2 + 1.2,
    phase:  Math.random() * Math.PI * 2,
    active: Math.random() < 0.22
  }));

  let rafId;
  let visible = true;

  // Pause when hero is off-screen
  const io = new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    if (visible && !rafId) rafId = requestAnimationFrame(draw);
  });
  io.observe(hero);

  function draw(ts) {
    rafId = null;
    if (!visible) return;

    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const t = ts / 1000;

    // Update & wrap positions
    nodes.forEach(n => {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0) n.x = 1;
      if (n.x > 1) n.x = 0;
      if (n.y < 0) n.y = 1;
      if (n.y > 1) n.y = 0;
    });

    // Draw connections first (under nodes)
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const dx = (a.x - b.x) * W;
        const dy = (a.y - b.y) * H;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECT_DIST) {
          const alpha = (1 - dist / CONNECT_DIST) * 0.055;
          ctx.beginPath();
          ctx.moveTo(a.x * W, a.y * H);
          ctx.lineTo(b.x * W, b.y * H);
          ctx.strokeStyle = `rgba(19,154,140,${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    // Draw nodes
    nodes.forEach(n => {
      const pulse = Math.sin(t * 1.2 + n.phase) * 0.5 + 0.5;
      const alpha = n.active ? 0.14 + pulse * 0.08 : 0.06 + pulse * 0.03;
      const r     = n.r + (n.active ? pulse * 1.2 : 0);
      ctx.beginPath();
      ctx.arc(n.x * W, n.y * H, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(19,154,140,${alpha})`;
      ctx.fill();
    });

    rafId = requestAnimationFrame(draw);
  }

  rafId = requestAnimationFrame(draw);
}

/* ═══════════════════════════════════════════
   2. NAVBAR SCROLL EFFECT
═══════════════════════════════════════════ */
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.style.background = 'rgba(255, 255, 255, 0.97)';
      navbar.style.boxShadow = '0 2px 20px rgba(15, 23, 42, 0.08)';
      navbar.style.padding = '10px 5%';
    } else {
      navbar.style.background = '';
      navbar.style.boxShadow = '';
      navbar.style.padding = '';
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
        const el = entry.target;
        el.style.willChange = 'opacity, transform';
        el.classList.add('visible');
        // Remove will-change after transition completes
        el.addEventListener('transitionend', () => {
          el.style.willChange = '';
        }, { once: true });
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // Pause float animation on phone frame when off-screen
  const phoneFrame = document.querySelector('.phone-frame');
  if (phoneFrame) {
    const floatObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        phoneFrame.classList.toggle('paused', !entry.isIntersecting);
      });
    }, { threshold: 0 });
    floatObserver.observe(phoneFrame);
  }
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
    bubble.style.transform = 'translateY(6px)';
    bubble.innerHTML = html;
    setTimeout(() => {
      bubble.style.transition = 'opacity 240ms cubic-bezier(0.2, 0, 0, 1), transform 240ms cubic-bezier(0.2, 0, 0, 1)';
      bubble.style.opacity = '1';
      bubble.style.transform = 'translateY(0)';
    }, 40);
    chatBody.scrollTop = chatBody.scrollHeight;
    if (onDone) onDone();
  }

  function activateStep(stepCards, idx) {
    stepCards.forEach((s, i) => {
      s.classList.toggle('active', i <= idx);
    });
    // Activate connectors up to previous step
    stepsContainer.querySelectorAll('.pipeline-connector').forEach((c, i) => {
      c.classList.toggle('active', i < idx);
    });
  }

  function renderDemo(key) {
    clearTimeouts();
    const data = ragQueries[key];
    if (!data) return;

    // Clear chat
    chatBody.innerHTML = '';
    if (veraAvatar) veraAvatar.classList.remove('speaking');
    setStatus('Online • Processing query...');

    // Render pipeline steps with connectors between them
    const connectorSVG = `<svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M0 8h14M10 3l6 5-6 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

    stepsContainer.innerHTML = data.steps.map((step, idx) => {
      const stepHTML = `<div class="pipeline-step" data-step="${idx}">
        <div class="step-num">${step.num}</div>
        <div class="step-title">${step.title}</div>
        <div class="step-desc">${step.desc}</div>
        <div class="step-meta">${step.meta}</div>
      </div>`;
      // Add connector after each step except the last
      return idx < data.steps.length - 1
        ? stepHTML + `<div class="pipeline-connector" data-connector="${idx}">${connectorSVG}</div>`
        : stepHTML;
    }).join('');

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
      bottom: 28px;
      right: 28px;
      background: #139A8C;
      color: white;
      padding: 14px 22px;
      border-radius: 14px;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-weight: 700;
      font-size: 13.5px;
      box-shadow: 0 8px 28px rgba(19, 154, 140, 0.35);
      z-index: 9999;
      display: flex; align-items: center; gap: 10px;
      transform: translateY(8px);
      opacity: 0;
      transition: transform 200ms cubic-bezier(0.2, 0, 0, 1), opacity 200ms cubic-bezier(0.2, 0, 0, 1);
    `;
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> <span>` + msg + `</span>`;
  toast.style.transform = 'translateY(0)';
  toast.style.opacity = '1';

  setTimeout(() => {
    // Subtle exit animation: small translateY(8px) instead of full height, ease-out
    toast.style.transform = 'translateY(8px)';
    toast.style.opacity = '0';
  }, 3500);
}

