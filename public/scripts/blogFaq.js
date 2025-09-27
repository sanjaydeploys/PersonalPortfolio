/* blogFaq.js
   Dual-language (en/hi) FAQ builder for Sanjay Patidar's SSR blog page.
   Maintains class names/attributes for compatibility with interviewFaqToggle.js and interviewAudio.js.
   Covers blog topics: Full-Stack, DSA, React, AI, AWS, JavaScript, cold email, education reform, prompt engineering.
*/

/* ========== helpers (reused from portfolioFaqBuilder.js) ========== */
const escapeHTML = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
};

const escapeAttr = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str.replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
};

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

    out += `<li>${renderLangSpans(String(it), String((it && it.hi) || String(it)))}</li>`;
  });
  out += '</ul>';
  return out;
};

/* ========== FAQ data for blog page ========== */
const blogQA = [
  {
    q: { en: "What topics does Sanjay Patidar’s blog cover?", hi: "संजय पाटीदार का ब्लॉग किन विषयों को कवर करता है?" },
    a: [
      { type: 'p', parts_en: [
        "Sanjay Patidar’s blog offers guides on Full-Stack development, DSA, React, AI, AWS, JavaScript, and career strategies like cold email."
      ], parts_hi: [
        "संजय पाटीदार का ब्लॉग फुल-स्टैक डेवलपमेंट, DSA, React, AI, AWS, JavaScript और करियर रणनीतियों जैसे कोल्ड ईमेल पर गाइड प्रदान करता है।"
      ]},
      { type: 'ul', items: [
        { en: "Career & Interview: Full-Stack prep, DSA, AWS roadmaps.", hi: "करियर और साक्षात्कार: फुल-स्टैक तैयारी, DSA, AWS रोडमैप।" },
        { en: "Software Engineering: React, JavaScript, VS Code guides.", hi: "सॉफ्टवेयर इंजीनियरिंग: React, JavaScript, VS Code गाइड।" },
        { en: "Featured Research: Cold email, AI, education reform.", hi: "विशेष शोध: कोल्ड ईमेल, AI, शिक्षा सुधार।" }
      ]}
    ]
  },
  {
    q: { en: "What is Sanjay Patidar’s Full-Stack Interview Prep?", hi: "संजय पाटीदार की फुल-स्टैक साक्षात्कार तैयारी क्या है?" },
    a: [
      { type: 'p', parts_en: [
        "Sanjay Patidar’s Full-Stack Interview Prep guide offers 200+ categorized Q&A with toggle reveals and audio playback."
      ], parts_hi: [
        "संजय पाटीदार की फुल-स्टैक साक्षात्कार तैयारी गाइड 200+ वर्गीकृत प्रश्नोत्तर प्रदान करती है जिसमें टॉगल रिवील और ऑडियो प्लेबैक शामिल हैं।"
      ]},
      { type: 'ul', items: [
        { en: "Covers HR, Technical, Behavioral, and Product questions.", hi: "HR, तकनीकी, व्यवहारिक और उत्पाद प्रश्नों को कवर करता है।" },
        { en: "Interactive format with audio for effective learning.", hi: "प्रभावी शिक्षण के लिए ऑडियो के साथ इंटरैक्टिव प्रारूप।" },
        { type: 'link', en: "Explore the guide.", hi: "गाइड देखें।", href: "https://sanjay-patidar.vercel.app/interview-prep" }
      ]}
    ]
  },
  {
    q: { en: "How does Sanjay Patidar’s DSA Prep Guide help beginners?", hi: "संजय पाटीदार की DSA तैयारी गाइड शुरुआती लोगों की कैसे मदद करती है?" },
    a: [
      { type: 'p', parts_en: [
        "Sanjay Patidar’s DSA Prep Guide is a 20-day plan for LeetCode beginners, covering key data structures and algorithms."
      ], parts_hi: [
        "संजय पाटीदार की DSA तैयारी गाइड LeetCode शुरुआती लोगों के लिए 20-दिवसीय योजना है, जो प्रमुख डेटा संरचनाओं और एल्गोरिदम को कवर करती है।"
      ]},
      { type: 'ul', items: [
        { en: "Topics: Arrays, Linked Lists, Trees, Graphs, and more.", hi: "विषय: Arrays, Linked Lists, Trees, Graphs और बहुत कुछ।" },
        { en: "JavaScript solutions for practical coding practice.", hi: "प्रैक्टिकल कोडिंग अभ्यास के लिए JavaScript समाधान।" },
        { type: 'link', en: "Explore the guide.", hi: "गाइड देखें।", href: "https://sanjay-patidar.vercel.app/dsa-prep-easy" }
      ]}
    ]
  },
  {
    q: { en: "What does Sanjay Patidar’s AWS Career Roadmap cover?", hi: "संजय पाटीदार का AWS करियर रोडमैप क्या कवर करता है?" },
    a: [
      { type: 'p', parts_en: [
        "Sanjay Patidar’s AWS Career Roadmap explores certifications, core services, and hybrid architectures."
      ], parts_hi: [
        "संजय पाटीदार का AWS करियर रोडमैप प्रमाणन, मुख्य सेवाओं और हाइब्रिड आर्किटेक्चर को कवर करता है।"
      ]},
      { type: 'ul', items: [
        { en: "Guides on AWS certifications and career paths.", hi: "AWS प्रमाणन और करियर पथ पर गाइड।" },
        { en: "Real-world applications and cloud strategies.", hi: "वास्तविक दुनिया के अनुप्रयोग और क्लाउड रणनीतियाँ।" },
        { type: 'link', en: "Explore the guide.", hi: "गाइड देखें।", href: "https://eduxcel.vercel.app/careers/aws" }
      ]}
    ]
  },
  {
    q: { en: "Why follow Sanjay Patidar’s React and JavaScript blogs?", hi: "संजय पाटीदार के React और JavaScript ब्लॉग क्यों पढ़ें?" },
    a: [
      { type: 'p', parts_en: [
        "Sanjay Patidar’s blogs on React and JavaScript provide beginner-friendly guides and advanced setup tips."
      ], parts_hi: [
        "संजय पाटीदार के React और JavaScript ब्लॉग शुरुआती लोगों के लिए गाइड और उन्नत सेटअप टिप्स प्रदान करते हैं।"
      ]},
      { type: 'ul', items: [
        { en: "Covers React components, JSX, hooks, and Vite setups.", hi: "React कंपोनेंट्स, JSX, हुक और Vite सेटअप को कवर करता है।" },
        { en: "JavaScript basics with real code examples.", hi: "वास्तविक कोड उदाहरणों के साथ JavaScript मूल बातें।" },
        { type: 'link', en: "Read React blogs.", hi: "React ब्लॉग पढ़ें।", href: "https://zedemy.vercel.app/post/what-is-react-and-why-use-it-for-web-development" }
      ]}
    ]
  },
  {
    q: { en: "What is Sanjay Patidar’s Cold Email Strategy for 2025?", hi: "2025 के लिए संजय पाटीदार की कोल्ड ईमेल रणनीति क्या है?" },
    a: [
      { type: 'p', parts_en: [
        "Sanjay Patidar’s Cold Email Guide offers templates and strategies for jobs and internships, recognized by Amazon and Microsoft."
      ], parts_hi: [
        "संजय पाटीदार की कोल्ड ईमेल गाइड नौकरी और इंटर्नशिप के लिए टेम्पलेट और रणनीतियाँ प्रदान करती है, जिसे Amazon और Microsoft ने मान्यता दी है।"
      ]},
      { type: 'ul', items: [
        { en: "Ranked #4 on Google for cold email internship queries.", hi: "कोल्ड ईमेल इंटर्नशिप क्वेरी के लिए Google पर #4 रैंक।" },
        { en: "Practical tips for effective outreach.", hi: "प्रभावी आउटरीच के लिए व्यावहारिक टिप्स।" },
        { type: 'link', en: "Read the guide.", hi: "गाइड पढ़ें।", href: "https://sanjay-patidar.vercel.app/cold-email-guide" }
      ]}
    ]
  },
  {
    q: { en: "How does Sanjay Patidar address India’s education crisis?", hi: "संजय पाटीदार भारत की शिक्षा संकट को कैसे संबोधित करते हैं?" },
    a: [
      { type: 'p', parts_en: [
        "Sanjay Patidar’s blog on India’s education crisis proposes school reforms and is featured in Google AI Overview."
      ], parts_hi: [
        "संजय पाटीदार का भारत की शिक्षा संकट पर ब्लॉग स्कूल सुधारों का प्रस्ताव करता है और Google AI Overview में शामिल है।"
      ]},
      { type: 'ul', items: [
        { en: "Ranked #3 for education reform queries.", hi: "शिक्षा सुधार क्वेरी के लिए #3 रैंक।" },
        { en: "Guides policymakers and educators.", hi: "नीति निर्माताओं और शिक्षकों के लिए मार्गदर्शन।" },
        { type: 'link', en: "Read the blog.", hi: "ब्लॉग पढ़ें।", href: "https://sanjay-patidar.vercel.app/indian-education-crisis" }
      ]}
    ]
  },
  {
    q: { en: "What is Sanjay Patidar’s Prompt Engineering Guide?", hi: "संजय पाटीदार की प्रॉम्प्ट इंजीनियरिंग गाइड क्या है?" },
    a: [
      { type: 'p', parts_en: [
        "Sanjay Patidar’s Prompt Engineering Guide for AI in India is peer-reviewed by the ChatGPT team with 50k+ reads."
      ], parts_hi: [
        "संजय पाटीदार की भारत में AI के लिए प्रॉम्प्ट इंजीनियरिंग गाइड को ChatGPT टीम द्वारा समीक्षा की गई है और इसे 50k+ बार पढ़ा गया है।"
      ]},
      { type: 'ul', items: [
        { en: "Covers AI prompt strategies for 2025.", hi: "2025 के लिए AI प्रॉम्प्ट रणनीतियों को कवर करता है।" },
        { en: "In-depth guide for AI enthusiasts.", hi: "AI उत्साही लोगों के लिए गहन गाइड।" },
        { type: 'link', en: "Read the guide.", hi: "गाइड पढ़ें।", href: "https://sanjay-patidar.vercel.app/prompt-engineering-guide-2025" }
      ]}
    ]
  }
];

/* ========== builder: renders dual-language FAQ HTML ========== */
const buildBlogFAQSection = (id, title, qaArray) => {
  let faqList = '<div class="faq-list">';
  qaArray.forEach((item, index) => {
    const uniqueId = `${id}-q${index + 1}`;

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

  const titleObj = getLangText(title, 'en', 'hi');
  const titleEn = titleObj.en || title;
  const titleHi = titleObj.hi || title;

  return `
    <section class="section faq-section" id="${id}">
      <h2>${renderLangSpans(titleEn, titleHi)}</h2>
      <p>${renderLangSpans(
        "Explore Sanjay Patidar’s blogs on Full-Stack, DSA, React, AI, AWS, and career strategies.",
        "संजय पाटीदार के फुल-स्टैक, DSA, React, AI, AWS और करियर रणनीतियों पर ब्लॉग देखें।"
      )}</p>
      ${faqList}
    </section>
  `;
};

/* ========== injection + initial active state ========== */
function injectBlogFAQs() {
  const container = document.getElementById('faqs-container') || document.querySelector('#faqs');
  if (!container) return false;

  if (container.dataset.faqsInjected === '1') return true;

  const html = buildBlogFAQSection('blog-faqs', 'Sanjay Patidar’s Blog FAQs', blogQA);
  container.innerHTML = html;
  container.dataset.faqsInjected = '1';

  container.querySelectorAll('.faq-question[data-toggle]').forEach((q) => q.setAttribute('aria-expanded', 'false'));
  container.querySelectorAll('.faq-answer').forEach((a) => {
    a.classList.remove('active');
    a.style.maxHeight = '0';
  });

  (function expandFirst() {
    const firstQuestion = container.querySelector('.faq-question[data-toggle]');
    const firstAnswer = container.querySelector('.faq-answer');
    if (firstQuestion && firstAnswer) {
      firstQuestion.setAttribute('aria-expanded', 'true');
      firstQuestion.classList.add('active');
      firstAnswer.classList.add('active');
      const h = firstAnswer.scrollHeight;
      firstAnswer.style.maxHeight = h ? `${h}px` : '800px';
    }
  })();

  return true;
}

window.reinitializeBlogFAQ = injectBlogFAQs;

injectBlogFAQs();

if (!document.getElementById('faqs-container') || document.getElementById('faqs-container').dataset.faqsInjected !== '1') {
  document.addEventListener('DOMContentLoaded', () => {
    injectBlogFAQs();
  });
}
