/* portfolioFaqBuilder.js
   Dual-language (en / hi) FAQ builder for portfolio homepage.
   Keeps class names / attributes used by interviewFaqToggle.js and interviewAudio.js.
*/

/* ========== helpers (same style as your interview code) ========== */
const escapeHTML = (str) => {
  if (!str || typeof str !== 'string') return '';
  // Escape the important HTML chars for safety, but keep single quote (') visible
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
    // NOTE: do NOT transform single-quote here so text like I'm remains readable
};

const escapeAttr = (str) => {
  if (!str || typeof str !== 'string') return '';
  // For attributes we still escape both quotes to be safe inside double-quoted attributes
  return str.replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
};

/* ========== small utilities for dual-language rendering ========== */
const ensureString = (v) => (typeof v === 'string' ? v : '');
const getLangText = (obj, enKey, hiKey) => {
  if (!obj) return { en: '', hi: '' };
  if (typeof obj === 'string') return { en: obj, hi: obj };
  const en = obj[enKey] || obj.en || obj.text || obj.q || '';
  const hi = obj[hiKey] || obj.hi || obj.text_hi || obj.textHi || obj.q_hi || en;
  return { en: ensureString(en), hi: ensureString(hi || en) };
};

const renderLangSpans = (enText, hiText) => {
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
  // items: each can be:
  // - string (treated as en==hi fallback)
  // - { en: 'English', hi: 'हिन्दी' }
  // - { type:'link', href:'...', en:'Email...', hi:'ईमेल...' }
  // - { note: 'Note', note_hi: 'नोट' }
  let out = '<ul class="faq-bullets">';
  items.forEach((it) => {
    if (typeof it === 'string') {
      out += `<li>${renderLangSpans(it, it)}</li>`;
      return;
    }

    if (!it) {
      out += `<li>${renderLangSpans('', '')}</li>`;
      return;
    }

    if (it.type === 'link' && it.href) {
      const enText = it.en || it.text_en || it.text || '';
      const hiText = it.hi || it.text_hi || enText;
      const safeHref = escapeAttr(it.href);
      out += `<li><a href="${safeHref}" target="_blank" rel="noopener noreferrer">${renderLangSpans(enText, hiText)}</a></li>`;
      return;
    }

    if (it.note) {
      const noteEn = it.note || '';
      const noteHi = it.note_hi || noteEn;
      out += `<li><em>${renderLangSpans(noteEn, noteHi)}</em></li>`;
      return;
    }

    if (it.en || it.hi) {
      const enText = it.en || it.text || '';
      const hiText = it.hi || it.text_hi || enText;
      out += `<li>${renderLangSpans(enText, hiText)}</li>`;
      return;
    }

    // fallback
    out += `<li>${renderLangSpans(String(it), String((it && it.hi) || String(it)))}</li>`;
  });
  out += '</ul>';
  return out;
};

const portfolioQA = [
  {
    q: { en: "Who is Sanjay Patidar?", hi: "संजय पाटीदार कौन हैं?" },
    a: [
      { type: 'p', parts_en: [
        "Sanjay Patidar is a Full-Stack Product Engineer who builds digital platforms that merge engineering precision with measurable business outcomes. His focus lies in solving real-world problems through scalable, serverless, and SEO-optimized solutions."
      ], parts_hi: [
        "संजय पाटीदार एक फुल-स्टैक प्रोडक्ट इंजीनियर हैं जो इंजीनियरिंग सटीकता को मापनीय व्यावसायिक परिणामों के साथ जोड़ने वाले डिजिटल प्लेटफ़ॉर्म बनाते हैं। उनका फोकस वास्तविक समस्याओं को स्केलेबल, सर्वरलेस और SEO-अनुकूल समाधानों से हल करने पर है।"
      ]},
      { type: 'ul', items: [
        { en: "Delivered 12+ production-ready applications across insurance, education, events, and communication.", hi: "बीमा, शिक्षा, इवेंट और संचार जैसे क्षेत्रों में 12+ प्रोडक्शन-रेडी एप्लिकेशन डिलीवर किए।" },
        { en: "Recognized by hiring managers at Amazon and Microsoft for shipping production-grade platforms.", hi: "उत्पादन-स्तर के प्लेटफ़ॉर्म देने के लिए Amazon और Microsoft के हायरिंग मैनेजर्स द्वारा मान्यता प्राप्त।" },
        { en: "Consistently focused on faster load times, stronger SEO visibility, and scalable system design.", hi: "तेज़ लोड समय, बेहतर SEO दृश्यता और स्केलेबल सिस्टम डिज़ाइन पर लगातार ध्यान केंद्रित।" }
      ]}
    ]
  },

  {
    q: { en: "What kind of projects has Sanjay Patidar built?", hi: "संजय पाटीदार ने किस तरह की परियोजनाएँ बनाई हैं?" },
    a: [
      { type: 'p', parts_en: [
        "Sanjay has developed projects aimed at eliminating inefficiencies and creating scalable, serverless products. Each project ties engineering decisions directly to measurable business outcomes."
      ], parts_hi: [
        "संजय ने ऐसी परियोजनाएँ विकसित की हैं जिनका उद्देश्य अक्षमताओं को समाप्त करना और स्केलेबल, सर्वरलेस उत्पाद बनाना है। हर परियोजना में इंजीनियरिंग निर्णय सीधे मापनीय व्यावसायिक परिणामों से जुड़े होते हैं।"
      ]},
      { type: 'ul', items: [
        { en: "Govt. Insurance CRM — a serverless lead-generation portal achieving top Google rankings and 80% conversion growth.", hi: "Govt. Insurance CRM — एक सर्वरलेस लीड-जनरेशन पोर्टल जिसने Google रैंकिंग में शीर्ष स्थान और 80% कन्वर्शन वृद्धि हासिल की।" },
        { en: "Zedemy — a serverless learning platform with certificate verification and automated workflows.", hi: "Zedemy — प्रमाणपत्र सत्यापन और स्वचालित वर्कफ़्लो के साथ एक सर्वरलेस लर्निंग प्लेटफ़ॉर्म।" },
        { en: "AgriBot — a bilingual Android chatbot for farmers with voice support, offline fallback, and LLM orchestration.", hi: "AgriBot — किसानों के लिए वॉयस सपोर्ट, ऑफ़लाइन फॉलबैक और LLM ऑर्केस्ट्रेशन के साथ द्विभाषी Android चैटबॉट।" },
        { en: "EventEase — a role-based event dashboard with Google Calendar sync.", hi: "EventEase — रोल-आधारित इवेंट डैशबोर्ड जिसमें Google Calendar सिंक है।" }
      ]}
    ]
  },

  {
    q: { en: "What challenges has Sanjay faced and how were they solved?", hi: "संजय को किन चुनौतियों का सामना करना पड़ा और उन्हें कैसे हल किया गया?" },
    a: [
      { type: 'p', parts_en: [
        "Sanjay has encountered diverse challenges, from scaling systems under high traffic to ensuring usability in low-connectivity environments. His approach blends experimentation, iteration, and a product-first mindset."
      ], parts_hi: [
        "संजय ने कई तरह की चुनौतियों का सामना किया है — भारी ट्रैफ़िक में सिस्टम स्केलिंग से लेकर कमजोर कनेक्टिविटी वाले क्षेत्रों में उपयोगिता सुनिश्चित करने तक। उनका दृष्टिकोण परीक्षण, पुनरावृत्ति और उत्पाद-प्रथम मानसिकता पर आधारित है।"
      ]},
      { type: 'ul', items: [
        { en: "Low connectivity: solved with offline fallbacks in AgriBot, enabling farmers to use the chatbot without internet.", hi: "कम कनेक्टिविटी: AgriBot में ऑफ़लाइन फॉलबैक जोड़ा गया ताकि किसान बिना इंटरनेट के भी चैटबॉट का उपयोग कर सकें।" },
        { en: "SEO competition: addressed with semantic HTML, JSON-LD, and server-side rendering for better indexing.", hi: "SEO प्रतियोगिता: बेहतर इंडेक्सिंग के लिए सेमांटिक HTML, JSON-LD और सर्वर-साइड रेंडरिंग का उपयोग किया।" },
        { en: "Performance bottlenecks: optimized using Brotli compression, CloudFront CDN, and pre-rendered routes.", hi: "प्रदर्शन बाधाएँ: Brotli संपीड़न, CloudFront CDN और प्री-रेंडर रूट्स के साथ अनुकूलित।" }
      ]}
    ]
  },

  {
    q: { en: "Why does Sanjay prefer serverless architecture?", hi: "संजय सर्वरलेस आर्किटेक्चर को क्यों पसंद करते हैं?" },
    a: [
      { type: 'p', parts_en: [
        "Sanjay prefers serverless architecture because it enables rapid development without infrastructure overhead while keeping costs aligned with real traffic. It is ideal for projects demanding scalability and efficiency."
      ], parts_hi: [
        "संजय सर्वरलेस आर्किटेक्चर को पसंद करते हैं क्योंकि यह उन्हें इंफ्रा ओवरहेड के बिना तेज़ विकास करने देता है और लागत को वास्तविक ट्रैफ़िक के साथ संरेखित रखता है। यह स्केलेबिलिटी और दक्षता की आवश्यकता वाली परियोजनाओं के लिए उपयुक्त है।"
      ]},
      { type: 'ul', items: [
        { en: "Zero maintenance overhead and instant scaling with AWS Lambda.", hi: "AWS Lambda के साथ शून्य मेंटेनेंस ओवरहेड और तुरंत स्केलिंग।" },
        { en: "Cost efficiency: pay per request instead of idle servers.", hi: "लागत-कुशल: निष्क्रिय सर्वरों के बजाय केवल अनुरोध के अनुसार भुगतान।" },
        { en: "Improved security with server-side handling of secrets and orchestration.", hi: "बेहतर सुरक्षा: सीक्रेट्स और ऑर्केस्ट्रेशन का सर्वर-साइड प्रबंधन।" }
      ]}
    ]
  },

  {
    q: { en: "How does Sanjay achieve high SEO visibility?", hi: "संजय उच्च SEO दृश्यता कैसे प्राप्त करते हैं?" },
    a: [
      { type: 'p', parts_en: [
        "Sanjay integrates SEO from the beginning of product design, ensuring faster indexing and long-term discoverability."
      ], parts_hi: [
        "संजय उत्पाद डिज़ाइन की शुरुआत से ही SEO को शामिल करते हैं, जिससे तेज़ इंडेक्सिंग और दीर्घकालिक दृश्यता सुनिश्चित होती है।"
      ]},
      { type: 'ul', items: [
        { en: "Server-side rendering and static pre-rendering for instant crawlability.", hi: "त्वरित क्रॉलिंग के लिए सर्वर-साइड रेंडरिंग और स्टैटिक प्री-रेंडरिंग।" },
        { en: "Structured JSON-LD, React Helmet, and Open Graph integration.", hi: "संरचित JSON-LD, React Helmet और Open Graph एकीकरण।" },
        { en: "Optimized assets: Brotli compression, lazy loading, and critical CSS inlining.", hi: "अनुकूलित एसेट्स: Brotli संपीड़न, लेज़ी लोडिंग और क्रिटिकल CSS इनलाइन।" }
      ]}
    ]
  },

  {
    q: { en: "How does Sanjay measure product success?", hi: "संजय उत्पाद सफलता को कैसे मापते हैं?" },
    a: [
      { type: 'p', parts_en: [
        "For Sanjay, product success goes beyond writing code — it is measured by achieving business goals and improving user experience."
      ], parts_hi: [
        "संजय के लिए, उत्पाद की सफलता केवल कोड लिखने से आगे है — इसे व्यावसायिक लक्ष्यों की प्राप्ति और उपयोगकर्ता अनुभव में सुधार से मापा जाता है।"
      ]},
      { type: 'ul', items: [
        { en: "Lead and conversion tracking for CRM platforms.", hi: "CRM प्लेटफ़ॉर्म के लिए लीड और कन्वर्शन ट्रैकिंग।" },
        { en: "Certificate issuance metrics for learning platforms.", hi: "लर्निंग प्लेटफ़ॉर्म के लिए प्रमाणपत्र जारी करने के आँकड़े।" },
        { en: "Organic impressions and Search Console metrics for content platforms.", hi: "कंटेंट प्लेटफ़ॉर्म के लिए ऑर्गेनिक इंप्रेशन्स और सर्च कंसोल मैट्रिक्स।" }
      ]}
    ]
  },

  {
    q: { en: "How to contact Sanjay Patidar?", hi: "संजय पाटीदार से संपर्क कैसे करें?" },
    a: [
      { type: 'p', parts_en: [
        "Sanjay is open to freelance work, product roles, and collaborations. He can be contacted through the following channels:"
      ], parts_hi: [
        "संजय फ्रीलांस कार्य, प्रोडक्ट रोल और सहयोग के लिए उपलब्ध हैं। उनसे नीचे दिए गए माध्यमों से संपर्क किया जा सकता है:"
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
