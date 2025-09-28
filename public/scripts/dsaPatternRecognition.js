/* dsaPatternRecognition.js
   Dual-language (en/hi) FAQ builder for Sanjay Patidar's DSA Pattern Recognition blog page.
   Maintains class names/attributes for compatibility with interviewFaqToggle.js and interviewAudio.js.
   Covers 15 DSA patterns with in-depth FAQs for FAANG interview prep.
*/

/* ========== helpers (reused from blogFaq.js) ========== */
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
  if (part && part.em) return `<em>${escapeHTML(part.em)}</em>`;
  if (part && part.link) return `<a href="${escapeAttr(part.link.href)}" target="_blank" rel="noopener noreferrer">${escapeHTML(part.link.text)}</a>`;
  return '';
};

const buildParagraphFromPartsDual = (partsEn = [], partsHi = []) => {
  const en = (partsEn || []).map(pieceToHTML).join('');
  const hiParts = (partsHi && partsHi.length) ? partsHi : partsEn;
  const hi = (hiParts || []).map(pieceToHTML).join('') || en;
  return `<p>${renderLangSpans(en, hi)}</p>`;
};

const buildSubheading = (textEn, textHi) => {
  return `<h5>${renderLangSpans(textEn, textHi)}</h5>`;
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

/* ========== FAQ data for DSA Pattern Recognition page (15 FAQs, one per pattern) ========== */
const dsaPatternQA = [
  {
    q: { en: "What is the Sum / Pair Patterns (Two Sum Family)?", hi: "सम / पेयर पैटर्न्स (Two Sum परिवार) क्या है?" },
    a: [
      { type: 'subheading', en: "In-Depth Explanation", hi: "गहन व्याख्या" },
      { type: 'p', parts_en: [
        "This pattern identifies pairs or k-elements summing to a target. Optimize with hash maps or sort + pointers."
      ], parts_hi: [
        "यह पैटर्न लक्ष्य तक योग करने वाले जोड़ों या k-तत्वों की पहचान करता है। हैश मैप्स या सॉर्ट + पॉइंटर्स से अनुकूलित करें।"
      ]},
      { type: 'subheading', en: "Recognition Cues", hi: "पहचान संकेत" },
      { type: 'ul', items: [
        "Find pairs/triplets summing to target.",
        "Unique combinations or closest sum."
      ] },
      { type: 'subheading', en: "What Interviewer Will Ask", hi: "साक्षात्कारकर्ता क्या पूछेंगे" },
      { type: 'ul', items: [
        "Time/space trade-offs (hash vs. pointers).",
        "Handle duplicates/overflow."
      ] },
      { type: 'link', text: "Explore More", href: "https://sanjay-patidar.vercel.app/dsa-pattern-recognition#pattern-1" }
    ]
  },
  {
    q: { en: "What is the Sliding Window Pattern (Fixed & Variable)?", hi: "स्लाइडिंग विंडो पैटर्न (फिक्स्ड और वेरिएबल) क्या है?" },
    a: [
      { type: 'subheading', en: "In-Depth Explanation", hi: "गहन व्याख्या" },
      { type: 'p', parts_en: [
        "Maintains a window for subarray/string ops. Fixed for constant size; variable shrinks/expands dynamically."
      ], parts_hi: [
        "सबअरे/स्ट्रिंग ऑप्स के लिए विंडो बनाए रखता है। फिक्स्ड निरंतर आकार के लिए; वेरिएबल डायनामिक रूप से सिकुड़ता/विस्तारित होता है।"
      ]},
      { type: 'subheading', en: "Recognition Cues", hi: "पहचान संकेत" },
      { type: 'ul', items: [
        "Longest/shortest subarray with property.",
        "Max sum of k elements."
      ] },
      { type: 'subheading', en: "What Interviewer Will Ask", hi: "साक्षात्कारकर्ता क्या पूछेंगे" },
      { type: 'ul', items: [
        "Prove O(n) single pass.",
        "Adapt to min/max windows."
      ] },
      { type: 'link', text: "Explore More", href: "https://sanjay-patidar.vercel.app/dsa-pattern-recognition#pattern-2" }
    ]
  },
  {
    q: { en: "What is the Prefix Sum & Monotonic Queue Pattern?", hi: "प्रिफिक्स सम और मोनोटोनिक क्यू पैटर्न क्या है?" },
    a: [
      { type: 'subheading', en: "In-Depth Explanation", hi: "गहन व्याख्या" },
      { type: 'p', parts_en: [
        "Prefix sums for O(1) ranges; monotonic queue for window max/min with deque maintaining order."
      ], parts_hi: [
        "O(1) रेंज के लिए प्रिफिक्स सम; विंडो मैक्स/मिन के लिए मोनोटोनिक क्यू डेक ऑर्डर बनाए रखता है।"
      ]},
      { type: 'subheading', en: "Recognition Cues", hi: "पहचान संकेत" },
      { type: 'ul', items: [
        "Subarray sum = k.",
        "Max in sliding window."
      ] },
      { type: 'subheading', en: "What Interviewer Will Ask", hi: "साक्षात्कारकर्ता क्या पूछेंगे" },
      { type: 'ul', items: [
        "Prove deque O(n).",
        "Extend to 2D prefix."
      ] },
      { type: 'link', text: "Explore More", href: "https://sanjay-patidar.vercel.app/dsa-pattern-recognition#pattern-3" }
    ]
  },
  {
    q: { en: "What is the Two-Pointer Family & k-Sum Pattern?", hi: "टू-पॉइंटर परिवार और k-सम पैटर्न क्या है?" },
    a: [
      { type: 'subheading', en: "In-Depth Explanation", hi: "गहन व्याख्या" },
      { type: 'p', parts_en: [
        "Pointers converge on sorted data; k-sum fixes elements, reduces to pointers."
      ], parts_hi: [
        "सॉर्टेड डेटा पर पॉइंटर्स कन्वर्ज; k-सम फिक्स तत्व, पॉइंटर्स तक कम करता है।"
      ]},
      { type: 'subheading', en: "Recognition Cues", hi: "पहचान संकेत" },
      { type: 'ul', items: [
        "Pairs in sorted array.",
        "Unique triplets/quads."
      ] },
      { type: 'subheading', en: "What Interviewer Will Ask", hi: "साक्षात्कारकर्ता क्या पूछेंगे" },
      { type: 'ul', items: [
        "Handle duplicates.",
        "Extend to larger k."
      ] },
      { type: 'link', text: "Explore More", href: "https://sanjay-patidar.vercel.app/dsa-pattern-recognition#pattern-4" }
    ]
  },
  {
    q: { en: "What is the Backtracking / Permutations Pattern?", hi: "बैकट्रैकिंग / परमुटेशन्स पैटर्न क्या है?" },
    a: [
      { type: 'subheading', en: "In-Depth Explanation", hi: "गहन व्याख्या" },
      { type: 'p', parts_en: [
        "Recursive exploration, backtrack on dead ends; perms via swaps or used flags."
      ], parts_hi: [
        "रिकर्सिव खोज, डेड एंड पर बैकट्रैक; परमुटेशन्स स्वैप या यूज्ड फ्लैग्स से।"
      ]},
      { type: 'subheading', en: "Recognition Cues", hi: "पहचान संकेत" },
      { type: 'ul', items: [
        "All possible combinations/perms.",
        "Small n for exponential ok."
      ] },
      { type: 'subheading', en: "What Interviewer Will Ask", hi: "साक्षात्कारकर्ता क्या पूछेंगे" },
      { type: 'ul', items: [
        "Pruning techniques.",
        "Unique results handling."
      ] },
      { type: 'link', text: "Explore More", href: "https://sanjay-patidar.vercel.app/dsa-pattern-recognition#pattern-5" }
    ]
  },
  {
    q: { en: "What is the Binary Search & Search-on-Answer Pattern?", hi: "बाइनरी सर्च और सर्च-ऑन-आंसर पैटर्न क्या है?" },
    a: [
      { type: 'subheading', en: "In-Depth Explanation", hi: "गहन व्याख्या" },
      { type: 'p', parts_en: [
        "Halves search space; search-on-answer binaries possible answers, checks feasibility."
      ], parts_hi: [
        "सर्च स्पेस को आधा करता है; सर्च-ऑन-आंसर संभावित उत्तरों को बाइनरी करता है, संभाव्यता जांचता है।"
      ]},
      { type: 'subheading', en: "Recognition Cues", hi: "पहचान संकेत" },
      { type: 'ul', items: [
        "Target in sorted array.",
        "Min/max value satisfying condition."
      ] },
      { type: 'subheading', en: "What Interviewer Will Ask", hi: "साक्षात्कारकर्ता क्या पूछेंगे" },
      { type: 'ul', items: [
        "Define monotonic function.",
        "Handle boundaries/duplicates."
      ] },
      { type: 'link', text: "Explore More", href: "https://sanjay-patidar.vercel.app/dsa-pattern-recognition#pattern-6" }
    ]
  },
  {
    q: { en: "What is the Dynamic Programming 1D → 2D Pattern?", hi: "डायनेमिक प्रोग्रामिंग 1D → 2D पैटर्न क्या है?" },
    a: [
      { type: 'subheading', en: "In-Depth Explanation", hi: "गहन व्याख्या" },
      { type: 'p', parts_en: [
        "Solves overlapping subproblems; 1D for single state, 2D for multi-states."
      ], parts_hi: [
        "ओवरलैपिंग सबप्रॉब्लम्स हल करता है; 1D एकल राज्य के लिए, 2D बहु-राज्यों के लिए।"
      ]},
      { type: 'subheading', en: "Recognition Cues", hi: "पहचान संकेत" },
      { type: 'ul', items: [
        "Optimal value/count ways.",
        "Longest/shortest sequence."
      ] },
      { type: 'subheading', en: "What Interviewer Will Ask", hi: "साक्षात्कारकर्ता क्या पूछेंगे" },
      { type: 'ul', items: [
        "State/transition definition.",
        "Space optimization."
      ] },
      { type: 'link', text: "Explore More", href: "https://sanjay-patidar.vercel.app/dsa-pattern-recognition#pattern-7" }
    ]
  },
  {
    q: { en: "What is the Graphs — BFS / DFS Patterns?", hi: "ग्राफ्स — BFS / DFS पैटर्न क्या है?" },
    a: [
      { type: 'subheading', en: "In-Depth Explanation", hi: "गहन व्याख्या" },
      { type: 'p', parts_en: [
        "BFS for shortest paths; DFS for cycles/components."
      ], parts_hi: [
        "BFS सबसे छोटे पथों के लिए; DFS साइकल/कंपोनेंट्स के लिए।"
      ]},
      { type: 'subheading', en: "Recognition Cues", hi: "पहचान संकेत" },
      { type: 'ul', items: [
        "Shortest path in unweighted graph.",
        "Detect cycle/connected components."
      ] },
      { type: 'subheading', en: "What Interviewer Will Ask", hi: "साक्षात्कारकर्ता क्या पूछेंगे" },
      { type: 'ul', items: [
        "BFS vs. DFS choice.",
        "Graph representation."
      ] },
      { type: 'link', text: "Explore More", href: "https://sanjay-patidar.vercel.app/dsa-pattern-recognition#pattern-8" }
    ]
  },
  {
    q: { en: "What is the Greedy Algorithms Pattern?", hi: "ग्रीडी एल्गोरिदम पैटर्न क्या है?" },
    a: [
      { type: 'subheading', en: "In-Depth Explanation", hi: "गहन व्याख्या" },
      { type: 'p', parts_en: [
        "Local optimal choices for global optimum; works when greedy property holds."
      ], parts_hi: [
        "ग्लोबल ऑप्टिमम के लिए लोकल ऑप्टिमल चॉइस; ग्रीडी प्रॉपर्टी होने पर काम करता है।"
      ]},
      { type: 'subheading', en: "Recognition Cues", hi: "पहचान संकेत" },
      { type: 'ul', items: [
        "Maximize/minimize value.",
        "Non-overlapping selection."
      ] },
      { type: 'subheading', en: "What Interviewer Will Ask", hi: "साक्षात्कारकर्ता क्या पूछेंगे" },
      { type: 'ul', items: [
        "Prove greedy optimality.",
        "Compare with DP."
      ] },
      { type: 'link', text: "Explore More", href: "https://sanjay-patidar.vercel.app/dsa-pattern-recognition#pattern-9" }
    ]
  },
  {
    q: { en: "What is the Heap / Priority Queue Pattern?", hi: "हीप / प्रायोरिटी क्यू पैटर्न क्या है?" },
    a: [
      { type: 'subheading', en: "In-Depth Explanation", hi: "गहन व्याख्या" },
      { type: 'p', parts_en: [
        "Maintains min/max; priority queue for custom order."
      ], parts_hi: [
        "मिन/मैक्स बनाए रखता है; कस्टम ऑर्डर के लिए प्रायोरिटी क्यू।"
      ]},
      { type: 'subheading', en: "Recognition Cues", hi: "पहचान संकेत" },
      { type: 'ul', items: [
        "Top k elements.",
        "Merge sorted lists."
      ] },
      { type: 'subheading', en: "What Interviewer Will Ask", hi: "साक्षात्कारकर्ता क्या पूछेंगे" },
      { type: 'ul', items: [
        "Custom comparators.",
        "Heap vs. sort trade-offs."
      ] },
      { type: 'link', text: "Explore More", href: "https://sanjay-patidar.vercel.app/dsa-pattern-recognition#pattern-10" }
    ]
  },
  {
    q: { en: "What is the Trie Pattern?", hi: "ट्राई पैटर्न क्या है?" },
    a: [
      { type: 'subheading', en: "In-Depth Explanation", hi: "गहन व्याख्या" },
      { type: 'p', parts_en: [
        "Prefix tree for string operations like insert/search/prefix."
      ], parts_hi: [
        "स्ट्रिंग ऑपरेशन्स जैसे इंसर्ट/सर्च/प्रिफिक्स के लिए प्रिफिक्स ट्री।"
      ]},
      { type: 'subheading', en: "Recognition Cues", hi: "पहचान संकेत" },
      { type: 'ul', items: [
        "Prefix-based search.",
        "Autocomplete/word search."
      ] },
      { type: 'subheading', en: "What Interviewer Will Ask", hi: "साक्षात्कारकर्ता क्या पूछेंगे" },
      { type: 'ul', items: [
        "Trie node implementation.",
        "Space optimization."
      ] },
      { type: 'link', text: "Explore More", href: "https://sanjay-patidar.vercel.app/dsa-pattern-recognition#pattern-11" }
    ]
  },
  {
    q: { en: "What is the Union-Find Pattern?", hi: "यूनियन-फाइंड पैटर्न क्या है?" },
    a: [
      { type: 'subheading', en: "In-Depth Explanation", hi: "गहन व्याख्या" },
      { type: 'p', parts_en: [
        "Manages disjoint sets with union/find; optimizes with path compression/rank."
      ], parts_hi: [
        "डिसजॉइंट सेट्स को यूनियन/फाइंड से मैनेज करता है; पाथ कम्प्रेशन/रैंक से अनुकूलित।"
      ]},
      { type: 'subheading', en: "Recognition Cues", hi: "पहचान संकेत" },
      { type: 'ul', items: [
        "Detect cycles/groups.",
        "Connected components."
      ] },
      { type: 'subheading', en: "What Interviewer Will Ask", hi: "साक्षात्कारकर्ता क्या पूछेंगे" },
      { type: 'ul', items: [
        "Path compression/rank.",
        "Component size extensions."
      ] },
      { type: 'link', text: "Explore More", href: "https://sanjay-patidar.vercel.app/dsa-pattern-recognition#pattern-12" }
    ]
  },
  {
    q: { en: "What is the Stack Pattern?", hi: "स्टैक पैटर्न क्या है?" },
    a: [
      { type: 'subheading', en: "In-Depth Explanation", hi: "गहन व्याख्या" },
      { type: 'p', parts_en: [
        "LIFO for matching/monotonic ops; monotonic stack for next greater."
      ], parts_hi: [
        "मैचिंग/मोनोटोनिक ऑप्स के लिए LIFO; नेक्स्ट ग्रेटर के लिए मोनोटोनिक स्टैक।"
      ]},
      { type: 'subheading', en: "Recognition Cues", hi: "पहचान संकेत" },
      { type: 'ul', items: [
        "Validate parentheses.",
        "Next greater/smaller."
      ] },
      { type: 'subheading', en: "What Interviewer Will Ask", hi: "साक्षात्कारकर्ता क्या पूछेंगे" },
      { type: 'ul', items: [
        "Monotonic stack optimization.",
        "Stack vs. queue."
      ] },
      { type: 'link', text: "Explore More", href: "https://sanjay-patidar.vercel.app/dsa-pattern-recognition#pattern-13" }
    ]
  },
  {
    q: { en: "What is the Divide and Conquer Pattern?", hi: "डिवाइड एंड कंकर पैटर्न क्या है?" },
    a: [
      { type: 'subheading', en: "In-Depth Explanation", hi: "गहन व्याख्या" },
      { type: 'p', parts_en: [
        "Splits problem, solves subproblems, merges; e.g., merge sort."
      ], parts_hi: [
        "समस्या को विभाजित करता है, सबप्रॉब्लम्स हल करता है, मर्ज करता है; उदाहरण: मर्ज सॉर्ट।"
      ]},
      { type: 'subheading', en: "Recognition Cues", hi: "पहचान संकेत" },
      { type: 'ul', items: [
        "Sort/process halves.",
        "Tree from traversals."
      ] },
      { type: 'subheading', en: "What Interviewer Will Ask", hi: "साक्षात्कारकर्ता क्या पूछेंगे" },
      { type: 'ul', items: [
        "Divide/merge steps.",
        "Optimize recursion."
      ] },
      { type: 'link', text: "Explore More", href: "https://sanjay-patidar.vercel.app/dsa-pattern-recognition#pattern-14" }
    ]
  },
  {
    q: { en: "What is the Bit Manipulation Pattern?", hi: "बिट मैनिपुलेशन पैटर्न क्या है?" },
    a: [
      { type: 'subheading', en: "In-Depth Explanation", hi: "गहन व्याख्या" },
      { type: 'p', parts_en: [
        "Bitwise ops for efficient computation; XOR for unique elements."
      ], parts_hi: [
        "कुशल गणना के लिए बिटवाइज ऑप्स; यूनिक तत्वों के लिए XOR।"
      ]},
      { type: 'subheading', en: "Recognition Cues", hi: "पहचान संकेत" },
      { type: 'ul', items: [
        "Find unique/missing number.",
        "Count/set bits."
      ] },
      { type: 'subheading', en: "What Interviewer Will Ask", hi: "साक्षात्कारकर्ता क्या पूछेंगे" },
      { type: 'ul', items: [
        "Bitwise properties (XOR).",
        "Handle signed numbers."
      ] },
      { type: 'link', text: "Explore More", href: "https://sanjay-patidar.vercel.app/dsa-pattern-recognition#pattern-15" }
    ]
  },
  {
    q: { en: "How to Prepare for FAANG Interviews with DSA Patterns?", hi: "DSA पैटर्न्स से FAANG साक्षात्कार की तैयारी कैसे करें?" },
    a: [
      { type: 'subheading', en: "In-Depth Guide", hi: "गहन गाइड" },
      { type: 'p', parts_en: [
        "Focus on 15 patterns, solve 50-75 problems in 20-25 days."
      ], parts_hi: [
        "15 पैटर्न पर ध्यान दें, 20-25 दिनों में 50-75 समस्याएँ हल करें।"
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask", hi: "साक्षात्कारकर्ता क्या पूछेंगे" },
      { type: 'ul', items: [
        "Pattern identification.",
        "Approach optimization."
      ] },
      { type: 'link', text: "FAANG Prep Guide", href: "https://sanjay-patidar.vercel.app/dsa-prep-easy" }
    ]
  },
  {
    q: { en: "Why Learn DSA Patterns for Coding Interviews?", hi: "कोडिंग साक्षात्कार के लिए DSA पैटर्न क्यों सीखें?" },
    a: [
      { type: 'subheading', en: "In-Depth Benefits", hi: "गहन लाभ" },
      { type: 'p', parts_en: [
        "Patterns like DP and Graphs solve 80% LeetCode problems efficiently."
      ], parts_hi: [
        "DP और Graphs जैसे पैटर्न 80% LeetCode समस्याओं को कुशलतापूर्वक हल करते हैं।"
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask", hi: "साक्षात्कारकर्ता क्या पूछेंगे" },
      { type: 'ul', items: [
        "Pattern application.",
        "Edge case handling."
      ] },
      { type: 'link', text: "Explore Patterns", href: "https://sanjay-patidar.vercel.app/dsa-pattern-recognition" }
    ]
  },
  {
    q: { en: "Top DSA Patterns for LeetCode Success", hi: "LeetCode सफलता के लिए शीर्ष DSA पैटर्न" },
    a: [
      { type: 'subheading', en: "In-Depth Overview", hi: "गहन अवलोकन" },
      { type: 'p', parts_en: [
        "Master 15 patterns from Sum/Pair to Bit Manipulation for FAANG."
      ], parts_hi: [
        "FAANG के लिए Sum/Pair से Bit Manipulation तक 15 पैटर्न मास्टर करें।"
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask", hi: "साक्षात्कारकर्ता क्या पूछेंगे" },
      { type: 'ul', items: [
        "Pattern trade-offs.",
        "Scalability for large data."
      ] },
      { type: 'link', text: "DSA Prep Guide", href: "https://sanjay-patidar.vercel.app/dsa-prep-medium" }
    ]
  },
  {
    q: { en: "Common Mistakes in DSA Patterns", hi: "DSA पैटर्न्स में सामान्य गलतियाँ" },
    a: [
      { type: 'subheading', en: "In-Depth Analysis", hi: "गहन विश्लेषण" },
      { type: 'p', parts_en: [
        "Avoid off-by-one in pointers; handle dups in backtracking."
      ], parts_hi: [
        "पॉइंटर्स में ऑफ-बाय-वन से बचें; बैकट्रैकिंग में डुप्स हैंडल करें।"
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask", hi: "साक्षात्कारकर्ता क्या पूछेंगे" },
      { type: 'ul', items: [
        "Debug common errors.",
        "Edge case strategies."
      ] },
      { type: 'link', text: "Explore Tips", href: "https://sanjay-patidar.vercel.app/dsa-pattern-recognition" }
    ]
  },
  {
    q: { en: "Time Management for DSA Prep in 20-25 Days", hi: "20-25 दिनों में DSA तैयारी के लिए समय प्रबंधन" },
    a: [
      { type: 'subheading', en: "In-Depth Plan", hi: "गहन योजना" },
      { type: 'p', parts_en: [
        "1-2 days per pattern, solve 3-5 problems each."
      ], parts_hi: [
        "प्रति पैटर्न 1-2 दिन, प्रत्येक में 3-5 समस्याएँ हल करें।"
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask", hi: "साक्षात्कारकर्ता क्या पूछेंगे" },
      { type: 'ul', items: [
        "Preparation strategy.",
        "Weak area focus."
      ] },
      { type: 'link', text: "Prep Guide", href: "https://sanjay-patidar.vercel.app/dsa-prep-easy" }
    ]
  }
];

/* ========== builder: renders dual-language FAQ HTML ========== */
const buildDSAPatternFAQSection = (id, title, qaArray) => {
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
      if (block.type === 'subheading') {
        const enText = block.en || '';
        const hiText = block.hi || enText;
        faqList += buildSubheading(enText, hiText);
      } else if (block.type === 'p') {
        faqList += buildParagraphFromPartsDual(block.parts_en || block.parts || [], block.parts_hi || []);
      } else if (block.type === 'ul') {
        faqList += buildULDual(block.items || []);
      } else if (block.type === 'link') {
        const enText = block.text_en || block.text || '';
        const hiText = block.text_hi || enText;
        const safeHref = escapeAttr(block.href);
        faqList += `<p><a href="${safeHref}" target="_blank" rel="noopener noreferrer">${renderLangSpans(enText, hiText)}</a></p>`;
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
        "Explore in-depth FAQs on 15 DSA patterns for FAANG prep, with recognition cues and interview tips.",
        "FAANG तैयारी के लिए 15 DSA पैटर्न्स पर गहन FAQs देखें, पहचान संकेतों और साक्षात्कार टिप्स के साथ।"
      )}</p>
      ${faqList}
    </section>
  `;
};

/* ========== injection + initial active state ========== */
function injectDSAPatternFAQs() {
  const container = document.getElementById('faqs-container') || document.querySelector('#faqs');
  if (!container) return false;

  if (container.dataset.faqsInjected === '1') return true;

  const html = buildDSAPatternFAQSection('dsa-pattern-faqs', 'DSA Pattern Recognition FAQs', dsaPatternQA);
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
      const h = firstAnswer.scrollHeight;
      firstAnswer.classList.add('active');
      firstAnswer.style.maxHeight = h ? `${h}px` : '800px';
    }
  })();

  return true;
}

window.reinitializeDSAPatternFAQ = injectDSAPatternFAQs;

injectDSAPatternFAQs();

if (!document.getElementById('faqs-container') || document.getElementById('faqs-container').dataset.faqsInjected !== '1') {
  document.addEventListener('DOMContentLoaded', () => {
    injectDSAPatternFAQs();
  });
}
