/* portfolioFaqBuilder.js
   Safe, enhanced FAQ builder for portfolio homepage.
   Maintains classes/attributes used by interviewFaqToggle.js and interviewAudio.js.
*/

/* ========== helpers (same style as your interview code) ========== */
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

/* ========== FAQ data: mixed-format blocks (pulled & improved from your PDF) ========== */
/* NOTE: Project label: "Govt. Insurance CRM" used where appropriate (per your request). */
const portfolioQA = [
  {
    q: "Tell me about yourself (short intro)",
    a: [
      { type: 'p', parts: [
        "Hi — I'm Sanjay Patidar, a full-stack product engineer who builds SEO-first, serverless web platforms and mobile experiences that move metrics.",
        " I focus on fast load-times, cost-efficient infra, and measurable outcomes."
      ]},
      { type: 'ul', items: [
        "Govt. Insurance CRM — a serverless lead-gen system with strong SEO results.",
        "Zedemy — serverless LMS with verifiable UUID certificates and notification flows.",
        "AgriBot — bilingual, voice-first Android chatbot with offline fallback + LLM orchestration."
      ]}
    ]
  },

  {
    q: "Why should a team hire you?",
    a: [
      { type: 'p', parts: [
        "I deliver end-to-end product outcomes — not just code. I tie engineering choices to clear business metrics and shipping velocity."
      ]},
      { type: 'ul', items: [
        "Proven KPIs: SEO-first projects with measured lead uplift and featured search results.",
        "End-to-end ownership: frontend, backend, infra, CI/CD, and SEO monitoring.",
        "Able to mentor and transfer knowledge: small-team leadership and code-review practices."
      ]}
    ]
  },

  {
    q: "Why serverless (AWS Lambda) across your projects?",
    a: [
      { type: 'p', parts: [
        "Serverless reduces ops overhead and aligns cost with traffic while keeping secrets and orchestration secure."
      ]},
      { type: 'ul', items: [
        "Zero-maintenance infra for many public-facing endpoints.",
        "Cost control: pay-per-invocation vs always-on servers.",
        "Security: secrets in AWS Secrets Manager, keys never in clients.",
        "Trade-offs: cold starts and vendor lock-in mitigated with provisioned concurrency and decoupled logic."
      ]}
    ]
  },

  {
    q: "Explain the Govt. Insurance CRM (architecture summary)",
    a: [
      { type: 'p', parts: [
        "A concise, production-ready stack designed for speed, SEO, and secure lead capture."
      ]},
      { type: 'ul', items: [
        "Frontend: pre-rendered React pages + React Helmet for metadata (served via S3 or Vercel CDN).",
        "CDN & Performance: CloudFront (Brotli), font preloads, inline critical CSS for LCP < 800ms.",
        "Leads pipeline: API Gateway → Lambda validates & stores leads in MongoDB Atlas (indexed for queries).",
        "Observability: CloudWatch logs, structured events, and simple incident/runbook for rollbacks.",
        "Privacy: minimal PII storage, HTTPS (ACM), and documented data flow for compliance."
      ]}
    ]
  },

  {
    q: "How did you achieve 100/100 Lighthouse for key pages?",
    a: [
      { type: 'p', parts: [
        "A set of practical, repeatable steps produced consistent 100/100 Lighthouse scores."
      ]},
      { type: 'ul', items: [
        "Pre-render every route (SSR or static pre-rendering) so crawlers receive HTML instantly.",
        "Inline critical CSS, lazy-load below-the-fold, and remove render-blocking scripts.",
        "Optimize images (srcset), Brotli compression on CDN, and minimal third-party scripts.",
        "Result: LCP < 800ms, improved search ranking and conversion uplift."
      ]}
    ]
  },

  {
    q: "How does Zedemy's certificate pipeline work (short)",
    a: [
      { type: 'p', parts: [
        "Certificates are issued only after backend verification — preventing client-side spoofing while allowing public verification."
      ]},
      { type: 'ul', items: [
        "Client flags completion → request to a backend Lambda.",
        "Lambda recomputes completion logs, writes a UUID-backed certificate to DynamoDB.",
        "An email with the certificate link is sent; public GET /cert/{uuid} returns non-PII metadata for verification."
      ]},
      { type: 'note', note: "See the Zedemy case study for a live demo and verification workflow." }
    ]
  },

  {
    q: "AgriBot — offline fallback & LLM orchestration (how it actually works)",
    a: [
      { type: 'p', parts: [
        "AgriBot balances on-device resilience with server-side LLM orchestration to work in low-connectivity environments."
      ]},
      { type: 'ul', items: [
        "Client: Kotlin + SpeechRecognizer for STT, TTS for replies, SharedPreferences for local state.",
        "Fallback: Chaquopy caches canned responses when Lambda is unreachable.",
        "Server: client posts queries to API Gateway → Lambda reads secrets from Secrets Manager and orchestrates LLM (LangChain/Gemini).",
        "Observability: logs for prompts, token usage metrics and prompt versioning so I can iterate safely."
      ]}
    ]
  },

  {
    q: "How do you protect LLM prompts & API keys?",
    a: [
      { type: 'p', parts: [
        "Keys never live in client apps; prompts and orchestration live server-side so iteration is fast without APK releases."
      ]},
      { type: 'ul', items: [
        "Store all keys in Secrets Manager (server-side only).",
        "Android client calls API Gateway; no keys stored on device.",
        "Prompt shaping and response rules live in Lambdas for quick iteration and safe logging."
      ]}
    ]
  },

  {
    q: "What accessibility (a11y) steps do you take?",
    a: [
      { type: 'p', parts: [
        "Accessibility is baked into every build — semantic HTML, keyboard nav, and screen-reader considerations."
      ]},
      { type: 'ul', items: [
        "Proper heading hierarchy and ARIA labels on interactive controls.",
        "Keyboard operability & large touch targets for mobile-first UX.",
        "TTS support for AgriBot and FAQ schema so screen readers parse content well.",
        "Lighthouse accessibility audits and prioritized fixes before launch."
      ]}
    ]
  },

  {
    q: "How do you measure product success?",
    a: [
      { type: 'p', parts: [
        "I focus on tangible KPIs tied to the product's business goals — not vanity metrics."
      ]},
      { type: 'ul', items: [
        "Lead count / conversion (Govt. Insurance CRM): tracked via forms + Search Console signals.",
        "Certificate issuances (Zedemy): definitive completion metric.",
        "Organic impressions & ranking (blog platforms): Search Console + GSC reports.",
        "Engagement (DAU/MAU, completion funnels, notification clicks)."
      ]}
    ]
  },

  {
    q: "How can someone reach or collaborate with you?",
    a: [
      { type: 'p', parts: [
        "Open to freelance engagements, product roles, and collaboration on serverless + SEO-first projects."
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
