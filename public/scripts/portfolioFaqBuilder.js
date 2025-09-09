

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

/* ========== builder helpers for mixed formatting blocks ========== */
const buildParagraphFromParts = (parts = []) => {
  // parts: array of either plain strings or objects { strong: 'text' } or { code: 'text' }
  return '<p>' + parts.map((part) => {
    if (typeof part === 'string') return escapeHTML(part);
    if (part && part.strong) return `<strong>${escapeHTML(part.strong)}</strong>`;
    if (part && part.code) return `<code>${escapeHTML(part.code)}</code>`;
    return '';
  }).join('') + '</p>';
};

const buildUL = (items = []) => {
  // items: string or { type:'link', text:'', href:'' } or { note: '' }
  let out = '<ul class="faq-bullets">';
  items.forEach((it) => {
    if (typeof it === 'string') {
      out += `<li>${escapeHTML(it)}</li>`;
    } else if (it && it.type === 'link' && it.href) {
      out += `<li><a href="${escapeAttr(it.href)}" target="_blank" rel="noopener noreferrer">${escapeHTML(it.text)}</a></li>`;
    } else if (it && it.note) {
      out += `<li><em>${escapeHTML(it.note)}</em></li>`;
    } else {
      out += `<li>${escapeHTML(String(it))}</li>`;
    }
  });
  out += '</ul>';
  return out;
};

const portfolioQA = [
  {
    q: "Who is Sanjay Patidar?",
    a: [
      { type: 'p', parts: [
        "I'm Sanjay Patidar, a full-stack product engineer passionate about building digital platforms that combine engineering precision with business results. My journey is self-driven — I didn’t rely on bootcamps or big-name internships, instead I learned by solving real-world problems with real users."
      ]},
      { type: 'ul', items: [
        "Delivered 12+ production-ready applications across insurance, education, events, and communication domains.",
        "Recognized by hiring managers at Amazon and Microsoft for shipping production-grade work.",
        "Focused on measurable outcomes: faster load times, improved SEO visibility, and scalable systems."
      ]}
    ]
  },

  {
    q: "What kind of projects has Sanjay Patidar built?",
    a: [
      { type: 'p', parts: [
        "My projects are centered around solving inefficiencies and creating scalable, serverless products. Each one ties engineering choices directly to business outcomes."
      ]},
      { type: 'ul', items: [
        "Govt. Insurance CRM — a serverless lead-generation portal that achieved top Google rankings and 3× inquiry growth.",
        "Zedemy — a serverless learning platform with UUID-backed certificate verification and automated workflows.",
        "AgriBot — a bilingual Android chatbot for farmers with voice support, offline fallback, and LLM orchestration.",
        "EventEase — a MERN event dashboard with role-based authentication and calendar sync."
      ]}
    ]
  },

  {
    q: "What challenges has Sanjay faced and how were they solved?",
    a: [
      { type: 'p', parts: [
        "Every project brought unique obstacles — from scaling systems under heavy traffic to making apps accessible in poor connectivity zones. I approach challenges with experimentation, iteration, and a product-first mindset."
      ]},
      { type: 'ul', items: [
        "Low connectivity: solved with offline fallbacks in AgriBot so farmers could still use the chatbot without internet.",
        "SEO competition: tackled with semantic HTML, JSON-LD, and server-side rendering that led to top search rankings.",
        "Performance bottlenecks: optimized with Brotli compression, CloudFront CDN, and pre-rendered routes to achieve 100/100 Lighthouse scores."
      ]}
    ]
  },

  {
    q: "Why does Sanjay prefer serverless architecture?",
    a: [
      { type: 'p', parts: [
        "Serverless lets me move fast without managing infrastructure while keeping costs aligned with actual traffic. It’s ideal for projects where scalability and efficiency matter."
      ]},
      { type: 'ul', items: [
        "Zero maintenance overhead and instant scaling with AWS Lambda.",
        "Cost-effective: only pay per request instead of idle servers.",
        "Better security: secrets and orchestration handled server-side.",
        "Cold start trade-offs mitigated with provisioned concurrency."
      ]}
    ]
  },

  {
    q: "How does Sanjay achieve high SEO visibility?",
    a: [
      { type: 'p', parts: [
        "I design products with SEO baked in from the start, not as an afterthought. This ensures fast indexing and long-term visibility."
      ]},
      { type: 'ul', items: [
        "Server-side rendering and static pre-rendering for instant crawlability.",
        "Structured JSON-LD, React Helmet, and Open Graph for rich snippets.",
        "Optimized assets: Brotli compression, lazy loading, and critical CSS inlining.",
        "Multiple blogs and portals featured in Google AI Overview and ranking in top results."
      ]}
    ]
  },

  {
    q: "How does Sanjay measure product success?",
    a: [
      { type: 'p', parts: [
        "Success to me isn’t just about writing code — it’s about whether the product meets business goals and improves user experience."
      ]},
      { type: 'ul', items: [
        "Govt. Insurance CRM: tracked 3× inquiry growth through SEO and form submissions.",
        "Zedemy: measured certificate issuances as definitive learner outcomes.",
        "Content platforms: monitored organic impressions via Google Search Console.",
        "AgriBot: evaluated adoption in rural areas based on daily active users."
      ]}
    ]
  },

  {
    q: "What makes Sanjay Patidar’s career journey unique?",
    a: [
      { type: 'p', parts: [
        "Unlike a traditional path through internships or bootcamps, my career has been about building from the ground up. I worked directly with stakeholders, experimented fast, and iterated based on feedback."
      ]},
      { type: 'ul', items: [
        "Self-taught engineer delivering production systems used by real users.",
        "Bridged engineering with product strategy by focusing on measurable KPIs.",
        "Earned recognition from industry professionals and global reach across 127 countries."
      ]}
    ]
  },

  {
    q: "How to contact Sanjay Patidar?",
    a: [
      { type: 'p', parts: [
        "I’m always open to collaboration, freelance work, or product-focused roles. Feel free to connect through the channels below:"
      ]},
      { type: 'ul', items: [
        { type: 'link', text: 'Email: sanjay.deploys@gmail.com', href: 'mailto:sanjay.deploys@gmail.com' },
        { type: 'link', text: 'LinkedIn: linkedin.com/in/sanjay-patidar', href: 'https://www.linkedin.com/in/sanjay-patidar/' },
        { type: 'link', text: 'GitHub: github.com/sanjaydeploys', href: 'https://github.com/sanjaydeploys' }
      ]}
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
    `;

    // each answer block may be an array of blocks like {type:'p', parts: [...] } or {type:'ul', items: [...]}
    (item.a || []).forEach((block) => {
      if (!block) return;
      if (block.type === 'p') {
        faqList += buildParagraphFromParts(block.parts || []);
      } else if (block.type === 'ul') {
        faqList += buildUL(block.items || []);
      } else if (block.type === 'note') {
        // render as emphasized small note
        faqList += `<p><em>${escapeHTML(block.note || '')}</em></p>`;
      }
    });

    faqList += `
        </div>
      </div>
    `;
  });
  faqList += '</div>';

  return `
    <section class="section faq-section" id="${id}">
      <h2>${escapeHTML(title)}</h2>
      <p>Explore answers about Sanjay’s technical skills, project execution, SEO capabilities, and product outcomes.</p>
      ${faqList}
    </section>
  `;
};

/* ========== injection + initial active state ========== */
function injectPortfolioFAQs() {
  const container = document.getElementById('faqs-container') || document.querySelector('#faqs');
  if (!container) return false;

  if (container.dataset.faqsInjected === '1') return true;

  const html = buildPortfolioFAQSection('portfolio', 'Portfolio FAQs', portfolioQA);
  container.innerHTML = html;
  container.dataset.faqsInjected = '1';

  // set minimal collapsed state (so interviewFaqToggle.js can still bind if it runs after)
  container.querySelectorAll('.faq-question[data-toggle]').forEach((q) => q.setAttribute('aria-expanded', 'false'));
  container.querySelectorAll('.faq-answer').forEach((a) => {
    a.classList.remove('active');
    a.style.maxHeight = '0';
  });

  // EXPAND first FAQ by default (active look)
  (function expandFirst() {
    const firstQuestion = container.querySelector('.faq-question[data-toggle]');
    const firstAnswer = container.querySelector('.faq-answer');
    if (firstQuestion && firstAnswer) {
      firstQuestion.setAttribute('aria-expanded', 'true');
      firstQuestion.classList.add('active');
      firstAnswer.classList.add('active');
      // compute scrollHeight synchronously to set maxHeight for CSS transition
      const h = firstAnswer.scrollHeight;
      firstAnswer.style.maxHeight = h ? `${h}px` : '800px';
    }
  })();

  return true;
}

// expose reinitialize hook for compatibility with interviewMain.js
window.reinitializeFAQ = injectPortfolioFAQs;

// immediate injection (if the container exists at script time)
injectPortfolioFAQs();

// fallback to DOMContentLoaded if needed
if (!document.getElementById('faqs-container') || document.getElementById('faqs-container').dataset.faqsInjected !== '1') {
  document.addEventListener('DOMContentLoaded', () => {
    injectPortfolioFAQs();
  });
}
