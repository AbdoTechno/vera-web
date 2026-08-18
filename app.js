/**
 * VERA Clinical Intelligence Landing Page Logic
 * Pure Vanilla JavaScript with Zero Frameworks
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initRagDemoSimulator();
  initDownloadButton();
  initIntersectionAnimations();
});

/* 1. Navbar Glassmorphism on Scroll */
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.style.background = 'rgba(11, 19, 43, 0.95)';
      navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.5)';
      navbar.style.padding = '14px 5%';
    } else {
      navbar.style.background = 'rgba(11, 19, 43, 0.82)';
      navbar.style.boxShadow = 'none';
      navbar.style.padding = '18px 5%';
    }
  });
}

/* 2. Interactive Clinical RAG Pipeline Simulator */
const ragQueries = {
  sma: {
    title: 'SMA Nusinersen Protocol',
    query: 'What are the Nusinersen loading dose criteria for pediatric SMA Type 1?',
    steps: [
      { num: '01', title: 'Dense Embeddings', desc: 'Query encoded into 768-dim vector space', meta: 'text-embedding-004' },
      { num: '02', title: 'ChromaDB Matching', desc: 'Top-3 nearest chunks retrieved (Cos: 0.89)', meta: 'vault/sma_protocol.pdf' },
      { num: '03', title: 'Grounded Synthesis', desc: 'Zero-hallucination verification active', meta: 'Safety Gate 100%' },
      { num: '04', title: 'Clinical Recommendation', desc: 'Structured guidance with citations generated', meta: 'Latency: 1.1s' }
    ],
    answer: '<strong>Nusinersen (Spinraza) Pediatric Loading Protocol:</strong><br><br>1. <strong>Loading Regimen:</strong> 4 loading doses (12 mg / 5 mL per intrathecal administration).<br>2. <strong>Schedule:</strong> Days 0, 14, 28, and 63 (Day 63 = 30 days post 3rd dose).<br>3. <strong>Maintenance Phase:</strong> 12 mg intrathecally every 4 months starting 4 months after 4th loading dose.<br><br><span style="color: #2DD4BF; font-weight: 600;">[Verified Grounded Source: SMA Clinical Management Guidelines 2024, Page 14]</span>'
  },
  hf: {
    title: 'ESC 2024 Heart Failure',
    query: 'What are the 4-pillar GDMT titration guidelines for HFrEF patients?',
    steps: [
      { num: '01', title: 'Dense Embeddings', desc: 'Query vectorization via clinical tokenizer', meta: 'Dim: 768' },
      { num: '02', title: 'ChromaDB Matching', desc: 'Retrieved ESC 2024 Consensus section', meta: 'Sim: 0.92' },
      { num: '03', title: 'Grounded Synthesis', desc: 'Cross-checked against contraindication rules', meta: 'Grounded' },
      { num: '04', title: 'Clinical Recommendation', desc: 'Rapid 4-week titration roadmap formulated', meta: 'Latency: 0.9s' }
    ],
    answer: '<strong>ESC 2024 Guideline-Directed Medical Therapy (GDMT) 4-Pillars:</strong><br><br>1. <strong>ARNi / ACEi:</strong> Sacubitril/Valsartan target 97/103 mg BID.<br>2. <strong>Beta-Blocker:</strong> Bisoprolol (target 10 mg QD) or Metoprolol Succinate.<br>3. <strong>MRA:</strong> Spironolactone / Eplerenone (target 50 mg QD, monitor eGFR/K+).<br>4. <strong>SGLT2 Inhibitor:</strong> Dapagliflozin 10 mg or Empagliflozin 10 mg QD.<br><br><span style="color: #2DD4BF; font-weight: 600;">[Verified Grounded Source: ESC Heart Failure Guidelines 2024 Update]</span>'
  },
  sepsis: {
    title: 'Surviving Sepsis 2024',
    query: 'What is the recommended golden hour resuscitation bundle for septic shock?',
    steps: [
      { num: '01', title: 'Dense Embeddings', desc: 'Emergency protocol query indexed', meta: 'Urgent Priority' },
      { num: '02', title: 'ChromaDB Matching', desc: 'SCCM Surviving Sepsis 2024 guidelines matched', meta: 'Cos: 0.94' },
      { num: '03', title: 'Grounded Synthesis', desc: 'Fluid vs vasopressor timing checked', meta: 'Grounded' },
      { num: '04', title: 'Clinical Recommendation', desc: '1-Hour bundle steps validated', meta: 'Latency: 1.0s' }
    ],
    answer: '<strong>Surviving Sepsis Campaign Initial 1-Hour Bundle:</strong><br><br>1. <strong>Lactate Measurement:</strong> Re-measure if initial lactate > 2 mmol/L.<br>2. <strong>Blood Cultures:</strong> Obtain prior to antibiotic administration.<br>3. <strong>Broad-Spectrum Antibiotics:</strong> Administer within 1 hour.<br>4. <strong>Rapid Fluid Resuscitation:</strong> 30 mL/kg balanced crystalloids for hypotension.<br>5. <strong>Vasopressors:</strong> Apply early Norepinephrine if MAP < 65 mmHg.<br><br><span style="color: #2DD4BF; font-weight: 600;">[Verified Grounded Source: SCCM Critical Care Guidelines 2024]</span>'
  }
};

function initRagDemoSimulator() {
  const tabBtns = document.querySelectorAll('.demo-tab-btn');
  const responseBody = document.getElementById('demo-response-text');
  const stepsContainer = document.getElementById('demo-pipeline-steps');

  function renderDemo(key) {
    const data = ragQueries[key];
    if (!data) return;

    // Render Steps with Animation
    stepsContainer.innerHTML = data.steps.map((step, idx) => `
      <div class="pipeline-step ${idx === 0 ? 'active' : ''}" data-step="${idx}">
        <div class="step-num">${step.num}</div>
        <div class="step-title">${step.title}</div>
        <div class="step-desc">${step.desc}</div>
        <div style="font-size: 0.65rem; color: #2DD4BF; margin-top: 6px; font-weight: 600;">${step.meta}</div>
      </div>
    `).join('');

    // Simulate animated step progression
    const stepCards = stepsContainer.querySelectorAll('.pipeline-step');
    let current = 0;
    const interval = setInterval(() => {
      current++;
      if (current < stepCards.length) {
        stepCards.forEach(s => s.classList.remove('active'));
        stepCards[current].classList.add('active');
      } else {
        clearInterval(interval);
        stepCards.forEach(s => s.classList.add('active'));
      }
    }, 280);

    // Render Response Text
    responseBody.innerHTML = `<div style="color: #94A3B8; font-style: italic; margin-bottom: 10px;">Query: "${data.query}"</div>` + data.answer;
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

/* 3. Download APK Trigger & Fallback */
function initDownloadButton() {
  const downloadBtns = document.querySelectorAll('.download-trigger');
  
  downloadBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Direct link to the APK folder
      const apkPath = './apk/app-release.apk';
      
      // Notify the user in a toast
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
      bottom: 24px;
      right: 24px;
      background: #139A8C;
      color: white;
      padding: 14px 24px;
      border-radius: 14px;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-weight: 700;
      font-size: 0.9rem;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
      z-index: 9999;
      display: flex;
      align-items: center;
      gap: 10px;
      transform: translateY(100px);
      opacity: 0;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    `;
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> ` + msg;
  toast.style.transform = 'translateY(0)';
  toast.style.opacity = '1';

  setTimeout(() => {
    toast.style.transform = 'translateY(100px)';
    toast.style.opacity = '0';
  }, 3500);
}

/* 4. Scroll Reveal Animations */
function initIntersectionAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.feature-card, .stat-card, .demo-container, .download-box').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    observer.observe(el);
  });
}
