
/* blogFaq.js
   Dual-language (en/hi) FAQ builder for Sanjay Patidar's SSR blog page.
   Maintains class names/attributes for compatibility with interviewFaqToggle.js and interviewAudio.js.
   Covers guides for mastering DSA, LeetCode, Full-Stack, AWS, and FAANG interviews.
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
    q: { en: "What guides are available on this blog page?", hi: "इस ब्लॉग पेज पर कौन सी गाइड उपलब्ध हैं?" },
    a: [
      { type: 'p', parts_en: [
        "This page offers guides to excel in coding interviews with DSA, Full-Stack, AWS, and LeetCode solutions."
      ], parts_hi: [
        "यह पेज DSA, फुल-स्टैक, AWS और LeetCode समाधानों के साथ कोडिंग साक्षात्कार में उत्कृष्टता के लिए गाइड प्रदान करता है।"
      ]},
      { type: 'ul', items: [
        { en: "DSA Prep: Pattern recognition, easy/medium LeetCode guides.", hi: "DSA तैयारी: पैटर्न पहचान, आसान/मध्यम LeetCode गाइड।" },
        { en: "Full-Stack: 200+ Q&A for interview prep.", hi: "फुल-स्टैक: साक्षात्कार तैयारी के लिए 200+ प्रश्नोत्तर।" },
        { en: "AWS: Career roadmaps and cloud strategies.", hi: "AWS: करियर रोडमैप और क्लाउड रणनीतियाँ।" },
        { en: "LeetCode: Solutions for Two Sum, 3Sum, and more.", hi: "LeetCode: Two Sum, 3Sum और अन्य के लिए समाधान।" }
      ]}
    ]
  },
  {
    q: { en: "How does Sanjay Patidar’s Full-Stack guide help?", hi: "संजय पाटीदार की फुल-स्टैक गाइड कैसे मदद करती है?" },
    a: [
      { type: 'p', parts_en: [
        "Sanjay Patidar’s Full-Stack Interview Prep guide equips developers with tools to ace technical interviews."
      ], parts_hi: [
        "संजय पाटीदार की फुल-स्टैक साक्षात्कार गाइड डेवलपर्स को तकनीकी साक्षात्कार में सफलता के लिए उपकरण प्रदान करती है।"
      ]},
      { type: 'ul', items: [
        { en: "Includes 200+ Q&A on HR, Technical, and Behavioral topics.", hi: "HR, तकनीकी और व्यवहारिक विषयों पर 200+ प्रश्नोत्तर शामिल हैं।" },
        { en: "Features toggle reveals and audio for interactive learning.", hi: "इंटरैक्टिव शिक्षण के लिए टॉगल रिवील और ऑडियो शामिल हैं।" },
        { en: "Tailored for FAANG and top-tier tech interviews.", hi: "FAANG और शीर्ष तकनीकी साक्षात्कार के लिए तैयार।" },
        { type: 'link', en: "Explore the guide.", hi: "गाइड देखें।", href: "https://sanjay-patidar.vercel.app/interview-prep" }
      ]}
    ]
  },
  {
    q: { en: "What is covered in the DSA Prep Guidance Series?", hi: "DSA तैयारी गाइड सीरीज में क्या शामिल है?" },
    a: [
      { type: 'p', parts_en: [
        "The DSA Prep Guidance Series helps beginners tackle LeetCode with structured learning paths."
      ], parts_hi: [
        "DSA तैयारी गाइड सीरीज शुरुआती लोगों को संरचित शिक्षण पथ के साथ LeetCode से निपटने में मदद करती है।"
      ]},
      { type: 'ul', items: [
        { en: "Guides for easy and medium LeetCode problems.", hi: "आसान और मध्यम LeetCode समस्याओं के लिए गाइड।" },
        { en: "Focuses on pattern recognition for problem-solving.", hi: "समस्या समाधान के लिए पैटर्न पहचान पर ध्यान।" },
        { en: "Includes JavaScript solutions with Big O analysis.", hi: "Big O विश्लेषण के साथ JavaScript समाधान शामिल हैं।" },
        { type: 'link', en: "Explore pattern recognition.", hi: "पैटर्न पहचान देखें।", href: "https://sanjay-patidar.vercel.app/dsa-pattern-recognition" }
      ]}
    ]
  },
  {
    q: { en: "What does Sanjay Patidar’s AWS guide offer?", hi: "संजय पाटीदार की AWS गाइड क्या प्रदान करती है?" },
    a: [
      { type: 'p', parts_en: [
        "Sanjay Patidar’s AWS Career Roadmap guides developers through cloud career paths."
      ], parts_hi: [
        "संजय पाटीदार का AWS करियर रोडमैप डेवलपर्स को क्लाउड करियर पथ के माध्यम से मार्गदर्शन करता है।"
      ]},
      { type: 'ul', items: [
        { en: "Covers AWS certifications and core services.", hi: "AWS प्रमाणन और मुख्य सेवाओं को कवर करता है।" },
        { en: "Explores hybrid architectures and real-world use cases.", hi: "हाइब्रिड आर्किटेक्चर और वास्तविक उपयोग के मामलों की खोज।" },
        { en: "Ideal for building cloud-focused careers.", hi: "क्लाउड-केंद्रित करियर बनाने के लिए आदर्श।" },
        { type: 'link', en: "Explore the guide.", hi: "गाइड देखें।", href: "https://eduxcel.vercel.app/careers/aws" }
      ]}
    ]
  },
  {
    q: { en: "What are the In-Depth DSA LeetCode Solutions?", hi: "इन-डेप्थ DSA LeetCode समाधान क्या हैं?" },
    a: [
      { type: 'p', parts_en: [
        "In-Depth DSA LeetCode Solutions offer detailed guides for solving key coding problems."
      ], parts_hi: [
        "इन-डेप्थ DSA LeetCode समाधान प्रमुख कोडिंग समस्याओं को हल करने के लिए विस्तृत गाइड प्रदान करते हैं।"
      ]},
      { type: 'ul', items: [
        { en: "Covers Two Sum, 3Sum, and Sliding Window Maximum.", hi: "Two Sum, 3Sum और Sliding Window Maximum को कवर करता है।" },
        { en: "Includes JavaScript code with dry runs and edge cases.", hi: "ड्राई रन और एज केस के साथ JavaScript कोड शामिल है।" },
        { en: "Designed for FAANG interview coding rounds.", hi: "FAANG साक्षात्कार कोडिंग राउंड के लिए डिज़ाइन किया गया।" },
        { type: 'link', en: "Explore Two Sum solution.", hi: "Two Sum समाधान देखें।", href: "https://sanjay-patidar.vercel.app/two-sum-pattern" }
      ]}
    ]
  },
  {
    q: { en: "How do Sanjay Patidar’s LeetCode guides aid FAANG prep?", hi: "संजय पाटीदार की LeetCode गाइड FAANG तैयारी में कैसे मदद करती हैं?" },
    a: [
      { type: 'p', parts_en: [
        "Sanjay Patidar’s LeetCode solutions provide in-depth strategies for FAANG interviews."
      ], parts_hi: [
        "संजय पाटीदार की LeetCode समाधान FAANG साक्षात्कार के लिए गहन रणनीतियाँ प्रदान करते हैं।"
      ]},
      { type: 'ul', items: [
        { en: "Explains problems like 3Sum Closest and Find All Anagrams.", hi: "3Sum Closest और Find All Anagrams जैसे समस्याओं की व्याख्या।" },
        { en: "Includes multi-language code and interview tips.", hi: "बहु-भाषा कोड और साक्षात्कार टिप्स शामिल हैं।" },
        { en: "Focuses on patterns like two pointers and hash maps.", hi: "टू पॉइंटर्स और हैश मैप जैसे पैटर्न पर ध्यान।" },
        { type: 'link', en: "Explore 3Sum solution.", hi: "3Sum समाधान देखें।", href: "https://sanjay-patidar.vercel.app/three-sum" }
      ]}
    ]
  },
  {
    q: { en: "What techniques are used in Two Sum solutions?", hi: "Two Sum समाधानों में कौन सी तकनीकें उपयोग की जाती हैं?" },
    a: [
      { type: 'p', parts_en: [
        "Two Sum solutions teach efficient problem-solving for coding interviews."
      ], parts_hi: [
        "Two Sum समाधान कोडिंग साक्षात्कार के लिए कुशल समस्या समाधान सिखाते हैं।"
      ]},
      { type: 'ul', items: [
        { en: "Covers brute force, two pointers, and one-pass hash map.", hi: "ब्रूट फोर्स, टू पॉइंटर्स और वन-पास हैश मैप को कवर करता है।" },
        { en: "Includes dry runs and edge case analysis in JavaScript.", hi: "JavaScript में ड्राई रन और एज केस विश्लेषण शामिल हैं।" },
        { en: "Prepares for FAANG technical interviews.", hi: "FAANG तकनीकी साक्षात्कार के लिए तैयार करता है।" },
        { type: 'link', en: "Explore Two Sum solution.", hi: "Two Sum समाधान देखें।", href: "https://sanjay-patidar.vercel.app/two-sum-pattern" }
      ]}
    ]
  },
  {
    q: { en: "How does Sanjay Patidar’s Sliding Window guide work?", hi: "संजय पाटीदार की Sliding Window गाइड कैसे काम करती है?" },
    a: [
      { type: 'p', parts_en: [
        "Sanjay Patidar’s Sliding Window guides tackle complex LeetCode problems efficiently."
      ], parts_hi: [
        "संजय पाटीदार की Sliding Window गाइड जटिल LeetCode समस्याओं को कुशलतापूर्वक हल करती हैं।"
      ]},
      { type: 'ul', items: [
        { en: "Covers Minimum Window Substring and Sliding Window Maximum.", hi: "Minimum Window Substring और Sliding Window Maximum को कवर करता है।" },
        { en: "Uses two pointers and frequency maps for optimization.", hi: "अनुकूलन के लिए टू पॉइंटर्स और फ्रीक्वेंसी मैप का उपयोग।" },
        { en: "Includes ASCII dry runs and FAANG-focused tips.", hi: "ASCII ड्राई रन और FAANG-केंद्रित टिप्स शामिल हैं।" },
        { type: 'link', en: "Explore Sliding Window.", hi: "Sliding Window देखें।", href: "https://sanjay-patidar.vercel.app/minimum-variable-window-substring" }
      ]}
    ]
  },
  {
    q: { en: "Why are JavaScript solutions emphasized in LeetCode guides?", hi: "LeetCode गाइड में JavaScript समाधानों पर क्यों जोर दिया गया है?" },
    a: [
      { type: 'p', parts_en: [
        "JavaScript solutions make LeetCode guides practical for web developers."
      ], parts_hi: [
        "JavaScript समाधान LeetCode गाइड को वेब डेवलपर्स के लिए व्यावहारिक बनाते हैं।"
      ]},
      { type: 'ul', items: [
        { en: "Covers problems like Find All Anagrams and Subarray Sum.", hi: "Find All Anagrams और Subarray Sum जैसी समस्याओं को कवर करता है।" },
        { en: "Optimized for clarity and interview readiness.", hi: "स्पष्टता और साक्षात्कार तत्परता के लिए अनुकूलित।" },
        { en: "Includes Big O analysis and edge case handling.", hi: "Big O विश्लेषण और एज केस हैंडलिंग शामिल है।" },
        { type: 'link', en: "Explore Subarray Sum.", hi: "Subarray Sum देखें।", href: "https://sanjay-patidar.vercel.app/lc560-subarray-sum-k-solution" }
      ]}
    ]
  },
  {
    q: { en: "How does Sanjay Patidar’s DSA Pattern guide help?", hi: "संजय पाटीदार की DSA पैटर्न गाइड कैसे मदद करती है?" },
    a: [
      { type: 'p', parts_en: [
        "Sanjay Patidar’s DSA Pattern Recognition guide boosts LeetCode problem-solving skills."
      ], parts_hi: [
        "संजय पाटीदार की DSA पैटर्न पहचान गाइड LeetCode समस्या समाधान कौशल को बढ़ाती है।"
      ]},
      { type: 'ul', items: [
        { en: "Teaches 15 key patterns for FAANG interviews.", hi: "FAANG साक्षात्कार के लिए 15 प्रमुख पैटर्न सिखाता है।" },
        { en: "Includes strategies for Two Sum, 3Sum, and more.", hi: "Two Sum, 3Sum और अन्य के लिए रणनीतियाँ शामिल हैं।" },
        { en: "Offers practical JavaScript coding tips.", hi: "व्यावहारिक JavaScript कोडिंग टिप्स प्रदान करता है।" },
        { type: 'link', en: "Explore the guide.", hi: "गाइड देखें।", href: "https://sanjay-patidar.vercel.app/dsa-pattern-recognition" }
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
        "Explore Sanjay Patidar’s guides on DSA, Full-Stack, AWS, and LeetCode for coding interviews.",
        "संजय पाटीदार की DSA, फुल-स्टैक, AWS और LeetCode पर कोडिंग साक्षात्कार के लिए गाइड देखें।"
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

  const html = buildBlogFAQSection('blog-faqs', 'Blog FAQs', blogQA);
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
