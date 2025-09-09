/* portfolioFaqBuilder.js
   Dual-language (en / hi) FAQ builder for portfolio homepage.
   Keeps class names / attributes used by interviewFaqToggle.js and interviewAudio.js.
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

/* ========== small utilities for dual-language rendering ========== */
const ensureString = (v) => (typeof v === 'string' ? v : '');
const getLangText = (obj, enKey, hiKey) => {
  // Accept several shapes: obj.en / obj.hi, obj.enText / obj.hiText, or fallback to string at obj
  if (!obj) return { en: '', hi: '' };
  if (typeof obj === 'string') return { en: obj, hi: obj };
  const en = obj[enKey] || obj.en || obj.text || obj.q || '';
  const hi = obj[hiKey] || obj.hi || obj.text_hi || obj.textHi || obj.q_hi || en;
  return { en: ensureString(en), hi: ensureString(hi || en) };
};

const renderLangSpans = (enText, hiText) => {
  // returns two spans (en then hi)
  const en = escapeHTML(enText || '');
  const hi = escapeHTML(hiText || enText || '');
  return `<span lang="en" class="lang-hidden">${en}</span><span lang="hi" class="lang-visible">${hi}</span>`;
};

/* ========== builder helpers for mixed formatting blocks (dual lang) ========== */
const pieceToHTML = (part) => {
  if (typeof part === 'string') return escapeHTML(part);
  if (part && part.strong) return `<strong>${escapeHTML(part.strong)}</strong>`;
  if (part && part.code) return `<code>${escapeHTML(part.code)}</code>`;
  return '';
};

const buildParagraphFromPartsDual = (partsEn = [], partsHi = []) => {
  const en = (partsEn || []).map(pieceToHTML).join('');
  const hiParts = (partsHi && partsHi.length) ? partsHi : partsEn;
  const hi = (hiParts || []).map(pieceToHTML).join('') || en;
  return `<p>${renderLangSpans(en, hi)}</p>`;
};

const buildULDual = (items = []) => {
  // items: can be strings, or objects like:
  // { en: 'text', hi: 'हिंदी', type: 'link', href: '...' } OR { type: 'link', text: 'Email ...', href: 'mailto:...' }
  let out = '<ul class="faq-bullets">';
  items.forEach((it) => {
    if (typeof it === 'string') {
      // duplicate english into hi as fallback
      out += `<li>${renderLangSpans(it, it)}</li>`;
    } else if (it && it.type === 'link' && it.href) {
      // link may have multilingual text fields
      const enText = it.text_en || it.en || it.text || '';
      const hiText = it.text_hi || it.hi || enText;
      const safeHref = escapeAttr(it.href);
      out += `<li><a href="${safeHref}" target="_blank" rel="noopener noreferrer">${renderLangSpans(enText, hiText)}</a></li>`;
    } else if (it && it.note) {
      out += `<li><em>${renderLangSpans(it.note, it.note_hi || it.note)}</em></li>`;
    } else if (it && (it.en || it.hi)) {
      // generic multilingual item shape
      const enText = it.en || it.text || '';
      const hiText = it.hi || it.text_hi || enText;
      out += `<li>${renderLangSpans(enText, hiText)}</li>`;
    } else {
      out += `<li>${renderLangSpans(String(it || ''), String((it && it.hi) || String(it || '')))}</li>`;
    }
  });
  out += '</ul>';
  return out;
};

/* ========== FAQ data (EN by default; HI fallback = EN) ==========
   You can optionally provide bilingual content by using objects:
   - For question: { en: 'Who is ...', hi: 'कौन हैं ...' } or q_en / q_hi
   - For paragraph blocks: { type:'p', parts_en: [...], parts_hi: [...] }
   - For UL blocks: { type:'ul', items: [ 'one', { en:'E', hi:'H' }, {type:'link', href:'..', text:'E', text_hi:'H'} ] }
   For now, existing English-only items are left as-is and will render English in both lang spans.
*/
const portfolioQA = [
  {
    q: { en: "Who is Sanjay Patidar?", hi: "संजय पाटीदार कौन हैं?" },
    a: [
      { type: 'p', parts_en: [
        "I'm Sanjay Patidar, a full-stack product engineer passionate about building digital platforms that combine engineering precision with business results. My journey has been focused on solving real-world problems with practical, measurable solutions."
      ], parts_hi: [
        "मैं संजय पाटीदार हूँ, एक फुल-स्टैक प्रोडक्ट इंजीनियर जो इंजीनियरिंग सटीकता को व्यावसायिक परिणामों के साथ जोड़ने वाले डिजिटल प्लेटफॉर्म बनाते हैं। मेरा फोकस व्यावहारिक और मापनीय समाधान बनाने पर रहा है।"
      ]},
      { type: 'ul', items: [
        "Delivered 12+ production-ready applications across insurance, education, events, and communication domains.",
        "Recognized by hiring managers at Amazon and Microsoft for shipping production-grade work.",
        "Focused on measurable outcomes: faster load times, improved SEO visibility, and scalable systems."
      ]}
    ]
  },

  {
    q: { en: "What kind of projects has Sanjay Patidar built?", hi: "संजय पाटीदार ने किस तरह की परियोजनाएँ बनाई हैं?" },
    a: [
      { type: 'p', parts_en: [
        "My projects are centered around solving inefficiencies and creating scalable, serverless products. Each one ties engineering choices directly to business outcomes."
      ], parts_hi: [
        "मेरी परियोजनाएँ अक्षमताओं को हल करने और स्केलेबल, सर्वरलेस उत्पाद बनाने के इर्द-गिर्द केंद्रित हैं। हर परियोजना में इंजीनियरिंग निर्णय सीधे व्यावसायिक परिणामों से जुड़े होते हैं।"
      ]},
      { type: 'ul', items: [
        "Govt. Insurance CRM — a serverless lead-generation portal that achieved top Google rankings and inquiry growth.",
        "Zedemy — a serverless learning platform with UUID-backed certificate verification and automated workflows.",
        "AgriBot — a bilingual Android chatbot for farmers with voice support, offline fallback, and LLM orchestration.",
        "EventEase — a MERN event dashboard with role-based authentication and calendar sync."
      ]}
    ]
  },

  {
    q: { en: "What challenges has Sanjay faced and how were they solved?", hi: "संजय को किन चुनौतियों का सामना करना पड़ा और उन्हें कैसे हल किया गया?" },
    a: [
      { type: 'p', parts_en: [
        "Every project brought unique obstacles — from scaling systems under heavy traffic to making apps accessible in poor connectivity zones. I approach challenges with experimentation, iteration, and a product-first mindset."
      ], parts_hi: [
        "प्रत्येक परियोजना ने अलग चुनौतियाँ पेश कीं — भारी ट्रैफ़िक में स्केलिंग से लेकर कमजोर कनेक्टिविटी वाले क्षेत्रों में ऐप पहुँचाने तक। मैं परीक्षण, पुनरावृत्ति और उत्पाद-प्रथम मानसिकता के साथ चुनौतियों का समाधान करता हूँ।"
      ]},
      { type: 'ul', items: [
        "Low connectivity: solved with offline fallbacks in AgriBot so farmers could still use the chatbot without internet.",
        "SEO competition: tackled with semantic HTML, JSON-LD, and server-side rendering for better indexing.",
        "Performance bottlenecks: optimized with Brotli compression, CloudFront CDN, and pre-rendered routes."
      ]}
    ]
  },

  {
    q: { en: "Why does Sanjay prefer serverless architecture?", hi: "संजय सर्वरलेस आर्किटेक्चर को क्यों पसंद करते हैं?" },
    a: [
      { type: 'p', parts_en: [
        "Serverless lets me move fast without managing infrastructure while keeping costs aligned with actual traffic. It’s ideal for projects where scalability and efficiency matter."
      ], parts_hi: [
        "सर्वरलेस मुझे इंफ्रा प्रबंधन के बिना तेज़ी से काम करने देता है और लागत को वास्तविक ट्रैफ़िक के साथ संरेखित रखता है। यह उन परियोजनाओं के लिए उपयुक्त है जहाँ स्केलेबिलिटी और दक्षता मायने रखती हैं।"
      ]},
      { type: 'ul', items: [
        "Zero maintenance overhead and instant scaling with AWS Lambda.",
        "Cost-effective: only pay per request instead of idle servers.",
        "Better security: secrets and orchestration handled server-side."
      ]}
    ]
  },

  {
    q: { en: "How does Sanjay achieve high SEO visibility?", hi: "संजय उच्च SEO दृश्यता कैसे प्राप्त करते हैं?" },
    a: [
      { type: 'p', parts_en: [
        "I design products with SEO baked in from the start, not as an afterthought. This ensures fast indexing and long-term visibility."
      ], parts_hi: [
        "मैं उत्पादों को शुरुआत से ही SEO के साथ डिज़ाइन करता हूँ, न कि बाद में। इससे तेज़ इंडेक्सिंग और दीर्घकालिक दृश्यता सुनिश्चित होती है।"
      ]},
      { type: 'ul', items: [
        "Server-side rendering and static pre-rendering for instant crawlability.",
        "Structured JSON-LD, React Helmet, and Open Graph for rich snippets.",
        "Optimized assets: Brotli compression, lazy loading, and critical CSS inlining."
      ]}
    ]
  },

  {
    q: { en: "How does Sanjay measure product success?", hi: "संजय उत्पाद सफलता को कैसे मापते हैं?" },
    a: [
      { type: 'p', parts_en: [
        "Success to me isn’t just about writing code — it’s about whether the product meets business goals and improves user experience."
      ], parts_hi: [
        "मेरे लिए सफलता केवल कोड लिखना नहीं है — यह देखना है कि उत्पाद व्यावसायिक लक्ष्यों को पूरा करता है और उपयोगकर्ता अनुभव में सुधार करता है।"
      ]},
      { type: 'ul', items: [
        "Lead and conversion tracking (forms & analytics) for CRM projects.",
        "Certificate issuance counts for learning platforms.",
        "Organic impressions and Search Console metrics for content platforms."
      ]}
    ]
  },

  {
    q: { en: "How to contact Sanjay Patidar?", hi: "संजय पाटीदार से संपर्क कैसे करें?" },
    a: [
      { type: 'p', parts_en: [
        "I'm open to freelance work, product roles, and collaboration. Reach out through any channel below:"
      ], parts_hi: [
        "मैं फ्रीलांस, प्रोडक्ट रोल और सहयोग के लिए उपलब्ध हूँ। नीचे दिए गए किसी भी माध्यम से संपर्क करें:"
      ]},
      { type: 'ul', items: [
        { type: 'link', en: 'Email: sanjay.deploys@gmail.com', hi: 'ईमेल: sanjay.deploys@gmail.com', href: 'mailto:sanjay.deploys@gmail.com' },
        { type: 'link', en: 'LinkedIn: linkedin.com/in/sanjay-patidar', hi: 'LinkedIn: linkedin.com/in/sanjay-patidar', href: 'https://www.linkedin.com/in/sanjay-patidar/' },
        { type: 'link', en: 'GitHub: github.com/sanjaydeploys', hi: 'GitHub: github.com/sanjaydeploys', href: 'https://github.com/sanjaydeploys' }
      ]}
    ]
  }
];

/* ========== builder: renders dual-language FAQ HTML while keeping same structure your JS expects ========== */
const buildPortfolioFAQSection = (id, title, qaArray) => {
  let faqList = '<div class="faq-list">';
  qaArray.forEach((item, index) => {
    const uniqueId = `${id}-q${index + 1}`;

    // question multilingual extraction
    const qObj = getLangText(item.q || item, 'en', 'hi');
    const qEn = qObj.en;
    const qHi = qObj.hi;

    faqList += `
      <div class="faq-item">
        <h3 class="faq-question" data-toggle aria-controls="${uniqueId}" aria-expanded="false">
          ${renderLangSpans(qEn, qHi)}
        </h3>
        <button class="speak-btn" data-faq-id="${uniqueId}">▶ Play Audio</button>
        <div class="faq-answer" id="${uniqueId}">
    `;

    // each answer block may be an array of blocks like {type:'p', parts_en: [...] , parts_hi: [...] } or {type:'ul', items: [...]}
    (item.a || []).forEach((block) => {
      if (!block) return;
      if (block.type === 'p') {
        faqList += buildParagraphFromPartsDual(block.parts_en || block.parts || [], block.parts_hi || []);
      } else if (block.type === 'ul') {
        faqList += buildULDual(block.items || []);
      } else if (block.type === 'note') {
        const noteEn = block.note || '';
        const noteHi = block.note_hi || noteEn;
        faqList += `<p><em>${renderLangSpans(noteEn, noteHi)}</em></p>`;
      }
    });

    faqList += `
        </div>
      </div>
    `;
  });
  faqList += '</div>';

  // section title support (dual)
  const titleObj = getLangText(title, 'en', 'hi');
  const titleEn = titleObj.en || title;
  const titleHi = titleObj.hi || title;

  return `
    <section class="section faq-section" id="${id}">
      <h2>${renderLangSpans(titleEn, titleHi)}</h2>
      <p>${renderLangSpans(
        "Explore answers about Sanjay’s technical skills, project execution, SEO capabilities, and product outcomes.",
        "संजय की तकनीकी क्षमताओं, प्रोजेक्ट निष्पादन, SEO विशेषज्ञता और उत्पाद परिणामों से संबंधित प्रश्नों के उत्तर देखें।"
      )}</p>
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
