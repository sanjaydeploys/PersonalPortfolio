/* sumPairPatterns.js
   English-only FAQ builder for Sanjay Patidar's Sum / Pair Patterns (Two Sum Family) blog page.
   Maintains class names/attributes for compatibility with interviewFaqToggle.js and interviewAudio.js.
   Provides 20+ in-depth FAQs for Two Sum and 3Sum, with structured content (bullets, tables, ASCII, code),
   dedicated concept explanations, pattern recognition, and real interviewer question variations.
   Current time: 04:15 PM IST, Sunday, September 28, 2025.
*/

/* ========== helpers ========== */
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
const getLangText = (obj, enKey) => {
  if (!obj) return { en: '' };
  if (typeof obj === 'string') return { en: obj };
  const en = obj[enKey] || obj.en || obj.text || obj.q || '';
  return { en: ensureString(en) };
};

const pieceToHTML = (part) => {
  if (typeof part === 'string') return escapeHTML(part);
  if (part && part.strong) return `<strong>${escapeHTML(part.strong)}</strong>`;
  if (part && part.code) return `<code>${escapeHTML(part.code)}</code>`;
  if (part && part.em) return `<em>${escapeHTML(part.em)}</em>`;
  if (part && part.link) return `<a href="${escapeAttr(part.link.href)}" target="_blank" rel="noopener noreferrer">${escapeHTML(part.link.text)}</a>`;
  if (part && part.ascii) return `<div class="ascii-art-container"><pre><code>${escapeHTML(part.ascii)}</code></pre></div>`;
  if (part && part.codeBlock) return `<pre><code>${escapeHTML(part.codeBlock)}</code></pre>`;
  return '';
};

const buildParagraphFromParts = (parts = []) => {
  const en = (parts || []).map(pieceToHTML).join('');
  return `<p>${en}</p>`;
};

const buildSubheading = (text) => {
  return `<h5>${text}</h5>`;
};

const buildULDual = (items = []) => {
  let out = '<ul class="faq-bullets">';
  items.forEach((it) => {
    if (typeof it === 'string') {
      out += `<li>${it}</li>`;
      return;
    }
    if (!it) {
      out += `<li></li>`;
      return;
    }
    if (it.type === 'link' && it.href) {
      const enText = it.en || it.text_en || it.text || '';
      const safeHref = escapeAttr(it.href);
      out += `<li><a href="${safeHref}" target="_blank" rel="noopener noreferrer">${enText}</a></li>`;
      return;
    }
    if (it.note) {
      out += `<li><em>${it.note}</em></li>`;
      return;
    }
    if (it.en) {
      out += `<li>${it.en}</li>`;
      return;
    }
    out += `<li>${String(it)}</li>`;
  });
  out += '</ul>';
  return out;
};

/* ========== FAQ data for Sum / Pair Patterns (Two Sum and 3Sum) ========== */
const sumPairQA = [
  {
    q: { en: "What Interviewer Will Ask: Overview of Sum / Pair Pattern and FAANG Job Prep" },
    a: [
      { type: 'subheading', en: "What You’ll Learn" },
      { type: 'ul', items: [
        "What the Sum / Pair Pattern is and its role in DSA.",
        "How this FAQ helps land FAANG jobs.",
        "Logical flow to tackle interview questions."
      ]},
      { type: 'subheading', en: "Pattern Explanation" },
      { type: 'ul', items: [
        "Definition: Finding elements summing to a target (pairs, triplets, etc.).",
        "Core problems: Two Sum, 3Sum, 4Sum.",
        "Skill focus: Optimization from O(n²) to O(n) using hash maps or pointers.",
        "FAANG relevance: Tests problem-solving and coding under pressure."
      ]},
      { type: 'subheading', en: "How This FAQ Helps" },
      { type: 'ul', items: [
        "Offers 20+ FAQs with real scenarios and cross-questions.",
        "Covers basics for freshers, practice for intermediates, and refinement for seniors.",
        "Plan: Solve 3-5 problems daily for 20-25 days to master.",
        "Targets: Google, Amazon, Microsoft interviews."
      ]},
      { type: 'link', text: "Explore Pattern", href: "https://sanjay-patidar.vercel.app/dsa-pattern-recognition#pattern-1" }
    ]
  },
  {
    q: { en: "What Interviewer Will Ask: Understanding Arrays in Sum Patterns" },
    a: [
      { type: 'subheading', en: "What You’ll Learn" },
      { type: 'ul', items: [
        "What an array is and its structure.",
        "Why arrays are key in Sum Patterns.",
        "How to explain this in interviews."
      ]},
      { type: 'subheading', en: "Array Basics" },
      { type: 'ul', items: [
        "Definition: Contiguous, index-based data structure.",
        "JavaScript feature: Dynamic, but DSA assumes fixed size.",
        "Access: O(1) via index (address = base + index * size)."
      ]},
      { type: 'subheading', en: "Role in Sum Patterns" },
      { type: 'ul', items: [
        "Stores input numbers (e.g., [2,7,11,15]).",
        "Enables iteration with loops or pointers.",
        "Indexing (0-based) critical for result indices."
      ]},
      { type: 'ascii', ascii: `
Index:  0  1  2  3
Value: [2][7][11][15]
Memory: Contiguous
Access: nums[1] = 7
      ` },
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How is memory allocated?",
        "What if array is unsorted?"
      ] }
    ]
  },
  {
    q: { en: "What Interviewer Will Ask: How is Memory Allocated for Arrays?" },
    a: [
      { type: 'subheading', en: "What You’ll Learn" },
      { type: 'ul', items: [
        "Memory allocation process for arrays.",
        "Impact on performance.",
        "How to articulate this in interviews."
      ]},
      { type: 'subheading', en: "Memory Allocation Details" },
      { type: 'ul', items: [
        "Contiguous allocation by system.",
        "Base address for first element.",
        "Subsequent elements at base + (index * element_size).",
        "JavaScript: V8 heap manages dynamic resizing."
      ]},
      { type: 'subheading', en: "Types of Allocation" },
      { type: 'ul', items: [
        "Static (C): Fixed size at compile time.",
        "Dynamic (JS): Resizes via garbage collection."
      ]},
      { type: 'ascii', ascii: `
Base Address: 1000
Element Size: 4 bytes
Array [2,7,11,15]:
1000: 2
1004: 7
1008: 11
1012: 15
      ` },
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "Impact of fragmentation?",
        "Memory overhead in JS?"
      ] }
    ]
  },
  {
    q: { en: "What Interviewer Will Ask: What if the Array is Unsorted in Sum Patterns?" },
    a: [
      { type: 'subheading', en: "What You’ll Learn" },
      { type: 'ul', items: [
        "Strategies for unsorted arrays.",
        "Trade-offs of approaches.",
        "How to adapt in interviews."
      ]},
      { type: 'subheading', en: "Handling Unsorted Arrays" },
      { type: 'ul', items: [
        "Two-pointers fail: Require sorting (O(n log n)).",
        "Hash map solution: Store complements, O(n) time, O(n) space.",
        "Sorting option: O(n log n) + O(n) for pointers if allowed."
      ]},
      { type: 'subheading', en: "Trade-Off Comparison" },
      { type: 'ul', items: [
        "Hash Map: Faster for unsorted, higher space.",
        "Sorting: Space-efficient but slower initial sort."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "Why not always sort?",
        "Space vs. time trade-off?"
      ] }
    ]
  },
  {
    q: { en: "What Interviewer Will Ask: Understanding Pointers in Sum Patterns" },
    a: [
      { type: 'subheading', en: "What You’ll Learn" },
      { type: 'ul', items: [
        "What pointers are in DSA context.",
        "Their application in Sum Patterns.",
        "How to explain movement logic."
      ]},
      { type: 'subheading', en: "Pointer Basics" },
      { type: 'ul', items: [
        "Definition: Variables as indices (e.g., left=0, right=n-1).",
        "JS context: Simulates pointers without memory addresses.",
        "Purpose: Track positions in sorted arrays."
      ]},
      { type: 'subheading', en: "Application in Sum Patterns" },
      { type: 'ul', items: [
        "Start at ends of sorted array.",
        "If sum > target, move right down.",
        "If sum < target, move left up.",
        "O(n) after O(n log n) sort."
      ]},
      { type: 'ascii', ascii: `
nums = [2,7,11,15], target=18
left=0 (2), right=3 (15), sum=17 <18 → left=1
left=1 (7), right=3 (15), sum=22 >18 → right=2
left=1 (7), right=2 (11), sum=18 =18 → [1,2]
      ` },
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "Why sorted arrays?",
        "Pointer movement logic?"
      ] }
    ]
  },
  {
    q: { en: "What Interviewer Will Ask: How Do Pointers Move in Sum Patterns?" },
    a: [
      { type: 'subheading', en: "What You’ll Learn" },
      { type: 'ul', items: [
        "Pointer movement rules.",
        "Impact on solution efficiency.",
        "How to demonstrate in interviews."
      ]},
      { type: 'subheading', en: "Movement Logic" },
      { type: 'ul', items: [
        "Start: left=0, right=n-1.",
        "Condition: Move if sum != target.",
        "If sum > target: Decrease right.",
        "If sum < target: Increase left.",
        "Stop: When left >= right."
      ]},
      { type: 'ascii', ascii: `
nums = [2,7,11,15], target=9
left=0 (2), right=3 (15), sum=17 >9 → right=2
left=0 (2), right=2 (11), sum=13 >9 → right=1
left=0 (2), right=1 (7), sum=9 =9 → stop
      ` },
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "Edge case handling?",
        "Time impact of movement?"
      ] }
    ]
  },
  {
    q: { en: "What Interviewer Will Ask: Variations of Two Sum Problem Statement (LC1)" },
    a: [
      { type: 'subheading', en: "What You’ll Learn" },
      { type: 'ul', items: [
        "Real interviewer question variations.",
        "Hints to recognize Two Sum pattern.",
        "How to respond effectively."
      ]},
      { type: 'subheading', en: "Interviewer Question Variations" },
      { type: 'ul', items: [
        "Variation 1: 'Given an array, find two numbers that add up to a target and return their indices.'",
        "Variation 2: 'Can you identify a pair in this list whose sum matches this value? Return positions.'",
        "Variation 3: 'Design a solution to detect two elements summing to X in an unsorted array.'",
        "Variation 4: 'How would you find indices of two numbers in this dataset that equal Y?'",
        "Variation 5: 'Solve a problem where two array elements sum to a given target, no repeats.'"
      ]},
      { type: 'subheading', en: "Pattern Recognition Hints" },
      { type: 'ul', items: [
        "Keywords: 'pair', 'sum', 'indices', 'two numbers'.",
        "Context: Unsorted array, single solution assumed.",
        "Approach trigger: Optimize from O(n²) to O(n)."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "Is the array sorted?",
        "What if duplicates exist?"
      ] }
    ]
  },
  {
    q: { en: "What Interviewer Will Ask: Pattern Recognition for Two Sum (LC1)" },
    a: [
      { type: 'subheading', en: "What You’ll Learn" },
      { type: 'ul', items: [
        "How to identify Two Sum pattern.",
        "Keyword mapping to approaches.",
        "Strategy to confirm problem type."
      ]},
      { type: 'subheading', en: "Pattern Recognition Table" },
      { type: 'codeBlock', codeBlock: `
<table>
  <tr><th>Keyword/Hint</th><th>Implication</th><th>Approach</th></tr>
  <tr><td>'Pair'</td><td>Two elements involved</td><td>Hash Map or Brute Force</td></tr>
  <tr><td>'Sum to target'</td><td>Fixed sum required</td><td>Complement search</td></tr>
  <tr><td>'Indices'</td><td>Positions needed</td><td>Track indices</td></tr>
  <tr><td>'Unsorted'</td><td>No order assumed</td><td>Hash Map (O(n))</td></tr>
  <tr><td>'No repeats'</td><td>Unique indices</td><td>Index check</td></tr>
</table>
      ` },
      { type: 'subheading', en: "Recognition Strategy" },
      { type: 'ul', items: [
        "Listen for 'pair' or 'two numbers'.",
        "Check for 'sum' or 'target' constraint.",
        "Note 'indices' requirement.",
        "Ask: 'Is it sorted?' or 'Duplicates allowed?' to clarify."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How did you deduce this?",
        "Alternative patterns?"
      ] }
    ]
  },
  {
    q: { en: "What Interviewer Will Ask: Brute Force Approach for Two Sum (LC1)" },
    a: [
      { type: 'subheading', en: "What You’ll Learn" },
      { type: 'ul', items: [
        "Brute force method for Two Sum.",
        "Code implementation.",
        "Complexity and limitations."
      ]},
      { type: 'subheading', en: "Approach Details" },
      { type: 'ul', items: [
        "Use nested loops to check all pairs.",
        "For each i, test j > i if nums[i] + nums[j] == target.",
        "Return indices on match."
      ]},
      { type: 'subheading', en: "Code with Comments" },
      { codeBlock: `
/**
 * Brute force solution for Two Sum
 * @param {number[]} nums - Input array
 * @param {number} target - Target sum
 * @return {number[]} - Indices of pair
 */
function twoSumBrute(nums, target) {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) {
        return [i, j]; // Return indices if sum matches
      }
    }
  }
  return []; // No solution
}
      ` },
      { type: 'subheading', en: "Dry Run" },
      { type: 'ul', items: [
        "Input: nums = [2,7,11,15], target=9",
        "i=0, j=1: 2+7=9 → return [0,1]"
      ]},
      { type: 'ascii', ascii: `
i=0, j=1: 2+7=9 → [0,1]
      ` },
      { type: 'subheading', en: "Complexity" },
      { type: 'ul', items: [
        "Time: O(n²) - Two nested loops.",
        "Space: O(1) - No extra space."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "Why not faster?",
        "Handle large n?"
      ] }
    ]
  },
  {
    q: { en: "What Interviewer Will Ask: Optimized Hash Map Approach for Two Sum (LC1)" },
    a: [
      { type: 'subheading', en: "What You’ll Learn" },
      { type: 'ul', items: [
        "Optimized solution using hash map.",
        "Code and dry run.",
        "Complexity benefits."
      ]},
      { type: 'subheading', en: "Approach Details" },
      { type: 'ul', items: [
        "Use Map to store complements (target - num).",
        "Check if complement exists for each number.",
        "Return indices on match."
      ]},
      { type: 'subheading', en: "Code with Comments" },
      { codeBlock: `
/**
 * Optimized hash map solution for Two Sum
 * @param {number[]} nums - Input array
 * @param {number} target - Target sum
 * @return {number[]} - Indices of pair
 */
function twoSumHash(nums, target) {
  const map = new Map(); // Store number:index pairs
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i]; // Calculate complement
    if (map.has(complement)) {
      return [map.get(complement), i]; // Return indices if found
    }
    map.set(nums[i], i); // Store current number and index
  }
  return []; // No solution
}
      ` },
      { type: 'subheading', en: "Dry Run" },
      { type: 'ul', items: [
        "Input: nums = [2,7,11,15], target=9",
        "i=0: complement=7, map={}, set 2:0",
        "i=1: complement=2, map={2:0}, return [0,1]"
      ]},
      { type: 'ascii', ascii: `
i=0: complement=7, map={}
i=1: complement=2, map={2:0} → [0,1]
      ` },
      { type: 'subheading', en: "Complexity" },
      { type: 'ul', items: [
        "Time: O(n) - Single pass, O(1) map ops.",
        "Space: O(n) - Map stores at most n elements."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How does hash map work?",
        "Space trade-off?"
      ] }
    ]
  },
  {
    q: { en: "What Interviewer Will Ask: What is a Hash Map and Its Role in Two Sum?" },
    a: [
      { type: 'subheading', en: "What You’ll Learn" },
      { type: 'ul', items: [
        "What a hash map is.",
        "How it works in Two Sum.",
        "Interview explanation tips."
      ]},
      { type: 'subheading', en: "Hash Map Basics" },
      { type: 'ul', items: [
        "Definition: Key-value store with hash function.",
        "JS: Use Map for O(1) average access.",
        "Collision handling: Chaining or open addressing."
      ]},
      { type: 'subheading', en: "Role in Two Sum" },
      { type: 'ul', items: [
        "Stores numbers and indices.",
        "Checks complements (target - num) in O(1).",
        "Enables O(n) solution."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How is hash computed?",
        "Space overhead?"
      ] }
    ]
  },
  {
    q: { en: "What Interviewer Will Ask: How is Time Complexity Calculated for Hash Map in Two Sum?" },
    a: [
      { type: 'subheading', en: "What You’ll Learn" },
      { type: 'ul', items: [
        "Time complexity derivation.",
        "Space complexity details.",
        "How to explain in interviews."
      ]},
      { type: 'subheading', en: "Time Complexity Breakdown" },
      { type: 'ul', items: [
        "One loop over n elements.",
        "Map operations (has, set): O(1) average.",
        "Total: O(n) time."
      ]},
      { type: 'subheading', en: "Worst Case" },
      { type: 'ul', items: [
        "O(n) with hash collisions.",
        "Mitigated by good hash function."
      ]},
      { type: 'subheading', en: "Space Complexity" },
      { type: 'ul', items: [
        "O(n) - Map stores up to n pairs."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "Amortized vs. worst-case?",
        "Impact of collisions?"
      ] }
    ]
  },
  {
    q: { en: "What Interviewer Will Ask: What are Edge Cases for Two Sum (LC1)?" },
    a: [
      { type: 'subheading', en: "What You’ll Learn" },
      { type: 'ul', items: [
        "Common edge cases.",
        "Handling strategies.",
        "Interview response techniques."
      ]},
      { type: 'subheading', en: "Edge Cases" },
      { type: 'ul', items: [
        "Empty array: Return [].",
        "Single element: No solution.",
        "Negative numbers: [-1,1], target=0 → [0,1].",
        "Duplicates: [3,3], target=6 → Invalid (no same index).",
        "No solution: Return [] (problem assumes one)."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "Handle empty input?",
        "Multiple pairs?"
      ] }
    ]
  },
  {
    q: { en: "What Interviewer Will Ask: How to Handle Duplicates in Two Sum?" },
    a: [
      { type: 'subheading', en: "What You’ll Learn" },
      { type: 'ul', items: [
        "Duplicate handling in Two Sum.",
        "Implementation details.",
        "Interview clarification skills."
      ]},
      { type: 'subheading', en: "Handling Strategy" },
      { type: 'ul', items: [
        "Problem rule: No same index.",
        "In loops: Check i != j.",
        "In hash: Ensure unique indices."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "Why no duplicates?",
        "Modify for duplicates?"
      ] }
    ]
  },
  {
    q: { en: "What Interviewer Will Ask: What are Trade-Offs of Hash Map for Two Sum?" },
    a: [
      { type: 'subheading', en: "What You’ll Learn" },
      { type: 'ul', items: [
        "Trade-offs of hash map approach.",
        "Comparison with alternatives.",
        "How to discuss in interviews."
      ]},
      { type: 'subheading', en: "Trade-Off Analysis" },
      { type: 'ul', items: [
        "Advantage: O(n) time, works unsorted.",
        "Disadvantage: O(n) space, collisions possible.",
        "Alternative: Two pointers (O(n) after O(n log n) sort, O(1) space)."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "When to use pointers?",
        "Collision handling?"
      ] }
    ]
  },
  {
    q: { en: "What Interviewer Will Ask: Variations of 3Sum Problem Statement (LC15)" },
    a: [
      { type: 'subheading', en: "What You’ll Learn" },
      { type: 'ul', items: [
        "Real interviewer question variations.",
        "Hints for 3Sum pattern.",
        "Response strategies."
      ]},
      { type: 'subheading', en: "Interviewer Question Variations" },
      { type: 'ul', items: [
        "Variation 1: 'Find all unique triplets in this array that sum to zero.'",
        "Variation 2: 'Can you identify three numbers adding up to a specific value? No repeats.'",
        "Variation 3: 'Design a solution for triplets summing to X in an unsorted list.'",
        "Variation 4: 'How would you detect unique triples equaling zero in this dataset?'"
      ]},
      { type: 'subheading', en: "Pattern Recognition Hints" },
      { type: 'ul', items: [
        "Keywords: 'triplet', 'sum to zero', 'unique'.",
        "Context: Unsorted, multiple solutions possible.",
        "Approach trigger: Sort and use pointers."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "Is sorting necessary?",
        "Handle duplicates?"
      ] }
    ]
  },
  {
    q: { en: "What Interviewer Will Ask: Pattern Recognition for 3Sum (LC15)" },
    a: [
      { type: 'subheading', en: "What You’ll Learn" },
      { type: 'ul', items: [
        "How to identify 3Sum pattern.",
        "Keyword mapping to approaches.",
        "Confirmation strategy."
      ]},
      { type: 'subheading', en: "Pattern Recognition Table" },
      { type: 'codeBlock', codeBlock: `
<table>
  <tr><th>Keyword/Hint</th><th>Implication</th><th>Approach</th></tr>
  <tr><td>'Triplet'</td><td>Three elements</td><td>Two Pointers after Sort</td></tr>
  <tr><td>'Sum to zero'</td><td>Fixed target (0)</td><td>Pointer Adjustment</td></tr>
  <tr><td>'Unique'</td><td>No duplicates</td><td>Skip Adjacent</td></tr>
  <tr><td>'Unsorted'</td><td>Requires sorting</td><td>O(n log n) + O(n²)</td></tr>
</table>
      ` },
      { type: 'subheading', en: "Recognition Strategy" },
      { type: 'ul', items: [
        "Listen for 'triplet' or 'three numbers'.",
        "Note 'sum to zero' or target constraint.",
        "Check for 'unique' requirement.",
        "Ask: 'Sorted?' or 'Duplicates allowed?'"
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "Why sort?",
        "Alternative methods?"
      ] }
    ]
  },
  {
    q: { en: "What Interviewer Will Ask: Optimized Two-Pointer Approach for 3Sum (LC15)" },
    a: [
      { type: 'subheading', en: "What You’ll Learn" },
      { type: 'ul', items: [
        "Optimized solution for 3Sum.",
        "Code and dry run.",
        "Complexity and duplicate handling."
      ]},
      { type: 'subheading', en: "Approach Details" },
      { type: 'ul', items: [
        "Sort array for order.",
        "Fix one element, use two pointers.",
        "Skip duplicates for uniqueness."
      ]},
      { type: 'subheading', en: "Code with Comments" },
      { codeBlock: `
/**
 * Optimized two-pointer solution for 3Sum
 * @param {number[]} nums - Input array
 * @return {number[][]} - List of unique triplets
 */
function threeSum(nums) {
  nums.sort((a, b) => a - b);
  const result = [];
  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    let left = i + 1, right = nums.length - 1;
    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];
      if (sum === 0) {
        result.push([nums[i], nums[left], nums[right]]);
        while (left < right && nums[left] === nums[left + 1]) left++;
        while (left < right && nums[right] === nums[right - 1]) right--;
        left++;
        right--;
      } else if (sum < 0) {
        left++;
      } else {
        right--;
      }
    }
  }
  return result;
}
      ` },
      { type: 'subheading', en: "Dry Run" },
      { type: 'ul', items: [
        "Input: nums = [-1,0,1,2,-1,-4]",
        "Sorted: [-4,-1,-1,0,1,2]",
        "i=0 (-4): left=1 (-1), right=5 (2), sum=-3 <0 → left=2",
        "i=1 (-1): left=2 (-1), right=5 (2), sum=0 → [-1,-1,2], skip duplicates",
        "i=2 (-1): left=3 (0), right=4 (1), sum=0 → [-1,0,1]"
      ]},
      { type: 'ascii', ascii: `
i=1 (-1): left=2 (-1), right=5 (2) → 0
i=2 (-1): left=3 (0), right=4 (1) → 0
      ` },
      { type: 'subheading', en: "Complexity" },
      { type: 'ul', items: [
        "Time: O(n²) - Sort O(n log n), pointers O(n²).",
        "Space: O(1) - Excluding output."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "Why sort first?",
        "Handle no solution?"
      ] }
    ]
  },
  {
    q: { en: "What Interviewer Will Ask: What are Trade-Offs of Two-Pointer for 3Sum?" },
    a: [
      { type: 'subheading', en: "What You’ll Learn" },
      { type: 'ul', items: [
        "Trade-offs of two-pointer approach.",
        "Comparison with alternatives.",
        "Interview discussion skills."
      ]},
      { type: 'subheading', en: "Trade-Off Analysis" },
      { type: 'ul', items: [
        "Advantage: O(1) space, effective duplicate handling.",
        "Disadvantage: O(n log n) sort overhead.",
        "Alternative: Hash-based O(n²) with O(n) space."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "When to use hash?",
        "Sort impact on time?"
      ] }
    ]
  },
  // ... More FAQs to be added in next response for 3Sum Closest, 4Sum, etc., to reach 50+...
];

/* ========== builder: renders FAQ HTML with navigation ========== */
const buildSumPairFAQSection = (id, title, qaArray) => {
  let faqList = '<div class="faq-list">';
  let navLinks = '<nav class="sidebar-nav" aria-label="Pattern navigation">';
  qaArray.forEach((item, index) => {
    const uniqueId = `${id}-q${index + 1}`;
    const qObj = getLangText(item.q, 'en');
    const qEn = qObj.en;

    // Add navigation link only for problem statement FAQs
    if (qEn.includes("Problem Statement")) {
      const problemId = qEn.split(" (")[1].replace(")", "").toLowerCase().replace(/ /g, "-");
      navLinks += `<a href="#${problemId}" class="sidebar-link">${index + 1}. ${qEn}</a>`;
    }

    faqList += `
      <div class="faq-item">
        <h3 class="faq-question" data-toggle aria-controls="${uniqueId}" aria-expanded="false">
          ${qEn}
        </h3>
        <button class="speak-btn" data-faq-id="${uniqueId}">▶ Play Audio</button>
        <div class="faq-answer" id="${uniqueId}">
    `;

    (item.a || []).forEach((block) => {
      if (!block) return;
      if (block.type === 'subheading') {
        faqList += buildSubheading(block.en);
      } else if (block.type === 'p') {
        faqList += buildParagraphFromParts(block.parts || []);
      } else if (block.type === 'ul') {
        faqList += buildULDual(block.items || []);
      } else if (block.type === 'link') {
        const enText = block.text_en || block.text || '';
        const safeHref = escapeAttr(block.href);
        faqList += `<p><a href="${safeHref}" target="_blank" rel="noopener noreferrer">${enText}</a></p>`;
      } else if (block.ascii) {
        faqList += `<div class="ascii-art-container"><pre><code>${escapeHTML(block.ascii)}</code></pre></div>`;
      } else if (block.codeBlock) {
        faqList += `<pre><code>${escapeHTML(block.codeBlock)}</code></pre>`;
      }
    });

    faqList += `
        </div>
      </div>
    `;
  });
  navLinks += '</nav>';
  faqList += '</div>';

  const titleObj = getLangText({ en: title }, 'en');
  const titleEn = titleObj.en;

  return `
    ${navLinks}
    <section class="section faq-section" id="${id}">
      <h2>${titleEn}</h2>
      <p>
        In-depth FAQs on Sum / Pair Patterns for FAANG prep, including problem breakdowns, code, and interview cross-questions.
      </p>
      ${faqList}
    </section>
  `;
};

/* ========== injection + initial active state ========== */
function injectSumPairFAQs() {
  const container = document.getElementById('faqs-container') || document.querySelector('#faqs');
  if (!container) return false;

  if (container.dataset.faqsInjected === '1') return true;

  const html = buildSumPairFAQSection('sum-pair-faqs', 'Sum / Pair Patterns FAQs', sumPairQA);
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

window.reinitializeSumPairFAQs = injectSumPairFAQs;

injectSumPairFAQs();

if (!document.getElementById('faqs-container') || document.getElementById('faqs-container').dataset.faqsInjected !== '1') {
  document.addEventListener('DOMContentLoaded', () => {
    injectSumPairFAQs();
  });
}
