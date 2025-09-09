/* ========== helper: escape functions ========== */
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

/* ========== FAQ data (curated for portfolio) ========== */
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
      "Govt. Insurance CRM — SEO-first insurance portal (100/100 Lighthouse, 3× inquiry growth, featured in Google AI Overview)",
      "Zedemy — Serverless LMS with verifiable UUID certificates and real-time notifications",
      "AgriBot — Bilingual voice-first Android chatbot (Hindi + English) with offline fallback and LLM orchestration",
      "EventEase — Unified MERN event dashboard with role-based auth and calendar sync",
      "ConnectNow — Peer-to-peer video calling app with WebRTC + Firebase integration",
      "SEO Case Studies — Proven ranking results, indexed in Google AI Overviews"
    ]
  },
  {
    q: "How does Sanjay ensure SEO visibility and performance?",
    a: [
      "Server-side rendering (SSR) and pre-rendered pages for fast indexing",
      "Structured JSON-LD, semantic HTML, and React Helmet metadata",
      "Brotli compression, CDN caching (CloudFront), and asset optimization",
      "Consistently achieving 100/100 Lighthouse scores and <800ms LCP",
      "SEO-first blog platforms driving 1.8M+ impressions in 2 months"
    ]
  },
  {
    q: "Are these projects live and verified?",
    a: [
      "Yes — all projects are publicly deployed with working URLs",
      "Govt. Insurance CRM delivered under a signed Letter of Engagement with full SRS",
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
    a: [
      { type: 'link', text: 'Email: sanjay.deploys@gmail.com', href: 'mailto:sanjay.deploys@gmail.com' },
      { type: 'link', text: 'LinkedIn: linkedin.com/in/sanjay-patidar', href: 'https://www.linkedin.com/in/sanjay-patidar/' },
      { type: 'link', text: 'GitHub: github.com/sanjaydeploys', href: 'https://github.com/sanjaydeploys' }
    ]
  }
];

/* ========== builder: builds FAQ HTML ========== */
const buildPortfolioFAQSection = (id, title, qaArray) => {
  let faqList = '<div class="faq-list">';
  qaArray.forEach((item, index) => {
    const uniqueId = `${id}-q${index + 1}`;
    faqList += `
      <div class="faq-item" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
        <h3 class="faq-question" data-toggle aria-controls="${uniqueId}" aria-expanded="false" itemprop="name">
          ${escapeHTML(item.q)}
        </h3>
        <button class="speak-btn" data-faq-id="${uniqueId}">▶ Play Audio</button>
        <button class="copy-btn" data-faq-id="${uniqueId}">📋 Copy</button>
        <div class="faq-answer" id="${uniqueId}" itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
          <ul class="faq-bullets" itemprop="text">
    `;

    item.a.forEach((li) => {
      if (typeof li === 'object' && li.type === 'link' && li.href) {
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

/* ========== copy-to-clipboard functionality ========== */
document.addEventListener('click', (e) => {
  if (e.target && e.target.classList.contains('copy-btn')) {
    const faqId = e.target.dataset.faqId;
    const answerEl = document.getElementById(faqId);
    if (answerEl) {
      const text = Array.from(answerEl.querySelectorAll('li')).map(li => li.textContent.trim()).join('\n');
      navigator.clipboard.writeText(text).then(() => {
        e.target.textContent = '✅ Copied';
        setTimeout(() => { e.target.textContent = '📋 Copy'; }, 1500);
      });
    }
  }
});

/* ========== injection ========== */
function injectPortfolioFAQs() {
  const container = document.getElementById('faqs-container') || document.querySelector('#faqs');
  if (!container) return false;
  if (container.dataset.faqsInjected === '1') return true;

  const html = buildPortfolioFAQSection('portfolio', 'Portfolio FAQs', portfolioQA);
  container.innerHTML = html;
  container.dataset.faqsInjected = '1';

  // init collapsed state
  container.querySelectorAll('.faq-question[data-toggle]').forEach((q) => q.setAttribute('aria-expanded', 'false'));
  container.querySelectorAll('.faq-answer').forEach((a) => {
    a.classList.remove('active');
    a.style.maxHeight = '0';
  });

  return true;
}

window.reinitializeFAQ = injectPortfolioFAQs;
injectPortfolioFAQs();
if (!document.getElementById('faqs-container') || document.getElementById('faqs-container').dataset.faqsInjected !== '1') {
  document.addEventListener('DOMContentLoaded', injectPortfolioFAQs);
}
