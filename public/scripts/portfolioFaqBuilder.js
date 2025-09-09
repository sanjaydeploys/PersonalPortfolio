/* ========== helper: escape functions (same style as your interview code) ========== */
const escapeHTML = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

const escapeAttr = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
};

/* ========== FAQ data (questions + answers as arrays of list-items) ========== */
const portfolioQA = [
  {
    q: "Which technologies and tools does Sanjay specialize in?",
    a: [
      "Full-stack JavaScript (React, Node.js, Express, Redux Toolkit)",
      "AWS Serverless (Lambda, S3, API Gateway, CloudFront, DynamoDB)",
      "Databases: MongoDB Atlas & DynamoDB",
      "WebRTC, CI/CD pipelines, API security best practices",
      "SEO-first engineering (React Helmet, JSON-LD, Open Graph)",
      "Performance optimization (SSR with Vite, Brotli, Lighthouse audits)"
    ]
  },
  {
    q: "What kind of real-world projects has Sanjay delivered?",
    a: [
      "LIC Neemuch — SEO-first insurance portal (100/100 Lighthouse, 50–60 leads/month, featured in Google AI Overview)",
      "Zedemy — Serverless LMS with verifiable UUID certificates and real-time notifications",
      "AgriBot — Bilingual voice-first Android chatbot (Hindi + English) with offline fallback and LLM orchestration",
      "EventEase — Unified MERN event dashboard with role-based auth and calendar sync"
    ]
  },
  {
    q: "How does Sanjay ensure SEO visibility and performance?",
    a: [
      "Server-side rendering (SSR) and pre-rendered pages for fast indexing",
      "Structured JSON-LD, semantic HTML, and React Helmet metadata",
      "Brotli compression, CDN caching (CloudFront), and asset optimization",
      "Consistently achieving 100/100 Lighthouse scores and sub-800ms LCP"
    ]
  },
  {
    q: "Are these projects live and verified?",
    a: [
      "Yes — all projects are publicly deployed with working URLs",
      "LIC portal was delivered under a signed Letter of Engagement and full SRS",
      "Measured outcomes: 3× inquiry growth, verified Lighthouse reports, SEO rankings",
      "GitHub repos and LinkedIn case studies validate the work"
    ]
  },
  {
    q: "What’s unique about Sanjay’s career journey?",
    a: [
      "Self-built, production-first career (no bootcamps / brand internships)",
      "End-to-end ownership: frontend, backend, infra, and SEO tied to business metrics",
      "Domain experience across Insurance, Education, Events, and Agriculture",
      "Recognition: 1.8M blog impressions in 2 months, recruiter outreach and community mentions"
    ]
  },
  {
    q: "How can someone reach or collaborate with Sanjay?",
    /* for contact links: use structured objects so we render safe clickable anchors */
    a: [
      { type: 'link', text: 'Email: sanjay.deploys@gmail.com', href: 'mailto:sanjay.deploys@gmail.com' },
      { type: 'link', text: 'LinkedIn: linkedin.com/in/sanjay-patidar', href: 'https://www.linkedin.com/in/sanjay-patidar/' },
      { type: 'link', text: 'GitHub: github.com/sanjaydeploys', href: 'https://github.com/sanjaydeploys' }
    ]
  }
];

/* ========== builder: renders FAQ HTML using the same structure your interview code expects ========== */
const buildPortfolioFAQSection = (id, title, qaArray) => {
  let faqList = '<div class="faq-list">';
  qaArray.forEach((item, index) => {
    const uniqueId = `${id}-q${index + 1}`;
    faqList += `
      <div class="faq-item">
        <h3 class="faq-question" data-toggle aria-controls="${uniqueId}" aria-expanded="false">
          ${escapeHTML(item.q)}
        </h3>
        <button class="speak-btn" data-faq-id="${uniqueId}">▶ Play Audio</button>
        <div class="faq-answer" id="${uniqueId}">
          <ul class="faq-bullets">
    `;

    item.a.forEach((li) => {
      if (typeof li === 'object' && li.type === 'link' && li.href) {
        // safe link insertion for contact items
        const safeHref = escapeAttr(li.href);
        const safeText = escapeHTML(li.text);
        faqList += `<li><a href="${safeHref}" target="_blank" rel="noopener noreferrer">${safeText}</a></li>`;
      } else {
        faqList += `<li>${escapeHTML(String(li))}</li>`;
      }
    });

    faqList += `
          </ul>
        </div>
      </div>
    `;
  });
  faqList += '</div>';

  return `
    <section class="section faq-section" id="${id}">
      <h2>${escapeHTML(title)}</h2>
      <p>Explore answers about Sanjay’s technical skills, projects, SEO expertise, and career journey.</p>
      ${faqList}
    </section>
  `;
};

/* ========== insertion + safe init ========== */
/* inject immediately if container exists; otherwise wait for DOMContentLoaded.
   Also expose a reinitialize function (interviewMain.js checks for this in some setups) */
function injectPortfolioFAQs() {
  const container = document.getElementById('faqs-container') || document.querySelector('#faqs');
  if (!container) {
    return false;
  }
  // avoid duplicate insertion
  if (container.dataset.faqsInjected === '1') return true;

  const html = buildPortfolioFAQSection('portfolio', 'Portfolio FAQs', portfolioQA);
  container.innerHTML = html;
  container.dataset.faqsInjected = '1';

  // Minimal initial state for collapse (helps interviewFaqToggle.js if it runs later)
  container.querySelectorAll('.faq-question[data-toggle]').forEach((q) => q.setAttribute('aria-expanded', 'false'));
  container.querySelectorAll('.faq-answer').forEach((a) => {
    a.classList.remove('active');
    a.style.maxHeight = '0';
  });

  return true;
}

// expose reinitialize hook for pages that load scripts in different orders
window.reinitializeFAQ = injectPortfolioFAQs;

// try immediate injection (if script placed where DOM already contains container)
injectPortfolioFAQs();

// fallback: try again after DOMContentLoaded (only if not injected)
if (!document.getElementById('faqs-container') || document.getElementById('faqs-container').dataset.faqsInjected !== '1') {
  document.addEventListener('DOMContentLoaded', () => {
    injectPortfolioFAQs();
  });
}
