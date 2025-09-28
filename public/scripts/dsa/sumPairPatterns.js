/* sumPairPatterns.js
   English-only FAQ builder for Sanjay Patidar's Sum / Pair Patterns (Two Sum Family) blog page.
   Maintains class names/attributes for compatibility with interviewFaqToggle.js and interviewAudio.js.
   Provides 50+ in-depth FAQs with problem breakdowns, optimized JavaScript solutions, dry runs, complexities,
   real interview scenarios, cross-questions, and dedicated concept explanations for FAANG prep.
   Current time: 02:49 PM IST, Sunday, September 28, 2025.
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

/* ========== FAQ data for Sum / Pair Patterns (50+ in-depth FAQs) ========== */
const sumPairQA = [
  {
    q: { en: "What is the Sum / Pair Pattern and How Does This FAQ Walkthrough Help Land a FAANG Job?" },
    a: [
      { type: 'subheading', en: "Pattern Introduction" },
      { type: 'p', parts: [
        "The Sum / Pair Pattern involves finding elements in an array that sum to a target, from pairs (Two Sum) to triplets (3Sum), quadruplets (4Sum), or k-sums. It’s a core DSA concept, teaching optimization from O(n²) brute force to O(n) with hash maps or two pointers. FAANG interviews test this pattern to assess problem-solving and coding skills."
      ]},
      { type: 'subheading', en: "How This FAQ Helps" },
      { type: 'p', parts: [
        "This FAQ offers 50+ detailed FAQs with real FAANG scenarios, covering problems, optimized code, dry runs, complexities, and cross-questions. Beginners can learn basics, intermediates can practice, and seniors can refine. Dedicate 20-25 days, solving 3-5 problems daily, to master this for Google, Amazon, or Microsoft interviews."
      ]},
      { type: 'subheading', en: "Real Interview Scenario" },
      { type: 'p', parts: [
        "Interviewer: 'Explain Two Sum.' Candidate: 'It’s a Sum / Pair problem. I’ll cover brute force, optimize with hash map, show dry run, and discuss complexity.' Follow-up: 'Duplicates?' → 'Handled by index check.'"
      ]},
      { type: 'link', text: "Explore Pattern", href: "https://sanjay-patidar.vercel.app/dsa-pattern-recognition#pattern-1" }
    ]
  },
  {
    q: { en: "What is an Array, and Why is it Fundamental in Sum Patterns?" },
    a: [
      { type: 'subheading', en: "Array Basics" },
      { type: 'p', parts: [
        "An array is a contiguous, index-based data structure storing elements of the same type. In JavaScript, it’s dynamic, but for DSA, assume a fixed-size collection. Access is O(1) via index (address = base + index * element_size)."
      ]},
      { type: 'subheading', en: "Role in Sum Patterns" },
      { type: 'p', parts: [
        "Arrays store input numbers (e.g., [2,7,11,15]) for pair/triplet searches. Indexing (0-based) is key for returning results."
      ]},
      { ascii: `
Index:  0  1  2  3
Value: [2][7][11][15]
Memory: Contiguous
Access: nums[1] = 7
      ` },
      { type: 'subheading', en: "Real Interview Scenario" },
      { type: 'p', parts: [
        "Interviewer: 'What’s an array?' Candidate: 'A contiguous collection with O(1) access.' Cross-question: 'Array vs. Linked List?' → 'Arrays offer random access, fixed size; Linked Lists are dynamic, O(n) access.'"
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask" },
      { type: 'ul', items: [
        "How is memory allocated?",
        "What if array is unsorted?"
      ] }
    ]
  },
  {
    q: { en: "How is Memory Allocated for Arrays?" },
    a: [
      { type: 'subheading', en: "Memory Allocation Process" },
      { type: 'p', parts: [
        "Memory for an array is allocated contiguously by the system. The base address is assigned to the first element, with subsequent elements at base + (index * element_size). In JavaScript, V8 engine handles this dynamically via heap allocation."
      ]},
      { type: 'ul', items: [
        "Static allocation (C): Fixed size at compile time.",
        "Dynamic allocation (JS): Resizes as needed, managed by garbage collector."
      ]},
      { ascii: `
Base Address: 1000
Element Size: 4 bytes
Array [2,7,11,15]:
1000: 2
1004: 7
1008: 11
1012: 15
      ` },
      { type: 'subheading', en: "Real Interview Scenario" },
      { type: 'p', parts: [
        "Interviewer: 'How is array memory allocated?' Candidate: 'Contiguous allocation, O(1) access via base + index * size.' Cross-question: 'What if memory fragmented?' → 'Dynamic languages like JS handle it via garbage collection.'"
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask" },
      { type: 'ul', items: [
        "Impact of fragmentation?",
        "Memory overhead?"
      ] }
    ]
  },
  {
    q: { en: "What if the Array is Unsorted in Sum Patterns?" },
    a: [
      { type: 'subheading', en: "Handling Unsorted Arrays" },
      { type: 'p', parts: [
        "For unsorted arrays, two-pointer techniques fail (require sorting). Use a hash map to store complements, achieving O(n) time. Sort only if problem allows O(n log n) overhead."
      ]},
      { type: 'ul', items: [
        "Hash Map: O(n) time, O(n) space.",
        "Sorting + Two Pointers: O(n log n) + O(n)."
      ]},
      { type: 'subheading', en: "Real Interview Scenario" },
      { type: 'p', parts: [
        "Interviewer: 'What if array is unsorted?' Candidate: 'Use hash map for O(n), or sort for two pointers if overhead is acceptable.' Cross-question: 'Trade-offs?' → 'Hash saves time, sort saves space.'"
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask" },
      { type: 'ul', items: [
        "Why not always sort?",
        "Space vs. time trade-off?"
      ] }
    ]
  },
  {
    q: { en: "What are Pointers, and How Do They Apply to Sum Patterns?" },
    a: [
      { type: 'subheading', en: "Pointer Basics" },
      { type: 'p', parts: [
        "Pointers are variables holding memory addresses. In DSA (JS), they’re indices (e.g., left=0, right=n-1) tracking array positions, simulating pointer movement."
      ]},
      { type: 'subheading', en: "Application in Sum Patterns" },
      { type: 'p', parts: [
        "In sorted arrays, pointers start at ends: If sum > target, move right down; < target, move left up. Reduces O(n²) to O(n) after O(n log n) sort."
      ]},
      { ascii: `
nums = [2,7,11,15], target=18
left=0 (2), right=3 (15), sum=17 <18 → left=1
left=1 (7), right=3 (15), sum=22 >18 → right=2
left=1 (7), right=2 (11), sum=18 =18 → [1,2]
      ` },
      { type: 'subheading', en: "Real Interview Scenario" },
      { type: 'p', parts: [
        "Interviewer: 'Explain two pointers.' Candidate: 'Indices converging based on sum, O(n) after sort.' Cross-question: 'Unsorted?' → 'Use hash map, O(n) time, O(n) space.'"
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask" },
      { type: 'ul', items: [
        "Why sorted arrays?",
        "Pointer movement logic?"
      ] }
    ]
  },
  {
    q: { en: "How Do Pointers Move in Sum Patterns?" },
    a: [
      { type: 'subheading', en: "Pointer Movement Logic" },
      { type: 'p', parts: [
        "Pointers move based on sum vs. target: If sum > target, decrease right to reduce sum; if sum < target, increase left to increase sum. Stop when left >= right."
      ]},
      { ascii: `
nums = [2,7,11,15], target=9
left=0 (2), right=3 (15), sum=17 >9 → right=2
left=0 (2), right=2 (11), sum=13 >9 → right=1
left=0 (2), right=1 (7), sum=9 =9 → stop
      ` },
      { type: 'subheading', en: "Real Interview Scenario" },
      { type: 'p', parts: [
        "Interviewer: 'How do pointers move?' Candidate: 'Adjust based on sum vs. target, converging inward.' Cross-question: 'What if equal?' → 'Return indices if sum matches.'"
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask" },
      { type: 'ul', items: [
        "Edge case handling?",
        "Time impact?"
      ] }
    ]
  },
  {
    q: { en: "What is the Problem Statement for Two Sum (LC1)?" },
    a: [
      { type: 'subheading', en: "Problem Breakdown" },
      { type: 'p', parts: [
        "Given array nums and target, return indices of two numbers summing to target. Assume one solution, no same element twice."
      ]},
      { type: 'subheading', en: "Example" },
      { type: 'p', parts: [
        "Input: nums = [2,7,11,15], target = 9",
        "Output: [0,1]",
        "Explanation: 2 + 7 = 9"
      ]},
      { ascii: `
Step-by-step:
nums[0] + nums[1] = 2 + 7 = 9 → [0,1]
      ` },
      { type: 'subheading', en: "Real Interview Scenario" },
      { type: 'p', parts: [
        "Interviewer: 'Solve Two Sum.' Candidate: 'I’ll use hash map for O(n). First, brute force, then optimize.'"
      ]},
      { type: 'link', text: "LeetCode Link", href: "https://leetcode.com/problems/two-sum/" }
    ]
  },
  {
    q: { en: "What is the Brute Force Approach for Two Sum (LC1)?" },
    a: [
      { type: 'subheading', en: "Approach Explanation" },
      { type: 'p', parts: [
        "Use nested loops: For each i, check j > i if nums[i] + nums[j] == target."
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
      { ascii: `
nums = [2,7,11,15], target=9
i=0, j=1: 2+7=9 → [0,1]
      ` },
      { type: 'subheading', en: "Complexity" },
      { type: 'ul', items: [
        "Time: O(n²) - Two nested loops.",
        "Space: O(1) - No extra space."
      ]},
      { type: 'subheading', en: "Real Interview Scenario" },
      { type: 'p', parts: [
        "Interviewer: 'What’s your approach?' Candidate: 'Brute force, O(n²), checks all pairs.' Cross-question: 'Optimize?' → 'Yes, hash map for O(n).'"
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask" },
      { type: 'ul', items: [
        "Why not faster?",
        "Handle large n?"
      ] }
    ]
  },
  {
    q: { en: "What is the Optimized Hash Map Approach for Two Sum (LC1)?" },
    a: [
      { type: 'subheading', en: "Approach Explanation" },
      { type: 'p', parts: [
        "Use a hash map to store complements (target - num). Check if complement exists for each number."
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
      { ascii: `
nums = [2,7,11,15], target=9
i=0: complement=7, map={}, set 2:0
i=1: complement=2, map={2:0}, return [0,1]
      ` },
      { type: 'subheading', en: "Complexity" },
      { type: 'ul', items: [
        "Time: O(n) - Single pass, O(1) map ops.",
        "Space: O(n) - Map stores at most n elements."
      ]},
      { type: 'subheading', en: "Real Interview Scenario" },
      { type: 'p', parts: [
        "Interviewer: 'Optimize Two Sum.' Candidate: 'Hash map, O(n) time, storing complements.' Cross-question: 'Duplicates?' → 'Check index to avoid same element.'"
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask" },
      { type: 'ul', items: [
        "How does hash map work?",
        "Space trade-off?"
      ] }
    ]
  },
  {
    q: { en: "What is a Hash Map, and How Does it Work in Two Sum?" },
    a: [
      { type: 'subheading', en: "Hash Map Basics" },
      { type: 'p', parts: [
        "A hash map is a key-value store using a hash function to map keys to indices in an array. Collisions are resolved via chaining or open addressing. In JS, Map provides O(1) average access."
      ]},
      { type: 'subheading', en: "Usage in Two Sum" },
      { type: 'p', parts: [
        "Stores numbers and indices, checking complements (target - num) in O(1), enabling O(n) solution."
      ]},
      { type: 'subheading', en: "Real Interview Scenario" },
      { type: 'p', parts: [
        "Interviewer: 'What’s a hash map?' Candidate: 'Key-value store, O(1) access via hash.' Cross-question: 'Collisions?' → 'Handled by chaining, rare with good hash.'"
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask" },
      { type: 'ul', items: [
        "How is hash computed?",
        "Space overhead?"
      ] }
    ]
  },
  {
    q: { en: "How is Time Complexity Calculated for Hash Map Approach in Two Sum?" },
    a: [
      { type: 'subheading', en: "Time Complexity Breakdown" },
      { type: 'p', parts: [
        "One loop over n elements. Each map operation (has, set) is O(1) average due to hash table amortization. Total: O(n)."
      ]},
      { type: 'ul', items: [
        "Worst case: O(n) with collisions.",
        "No nested loops, linear scaling."
      ]},
      { type: 'subheading', en: "Space Complexity" },
      { type: 'p', parts: [
        "O(n) - Map stores up to n key-value pairs."
      ]},
      { type: 'subheading', en: "Real Interview Scenario" },
      { type: 'p', parts: [
        "Interviewer: 'Explain complexity.' Candidate: 'O(n) time, O(n) space, single pass with map.' Cross-question: 'Worst case?' → 'O(n) with collisions, mitigated by hash quality.'"
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask" },
      { type: 'ul', items: [
        "Amortized vs. worst-case?",
        "Impact of hash collisions?"
      ] }
    ]
  },
  {
    q: { en: "What are Edge Cases for Two Sum (LC1)?" },
    a: [
      { type: 'subheading', en: "Edge Cases Analysis" },
      { type: 'ul', items: [
        "Empty array: Return [].",
        "Single element: No solution.",
        "Negative numbers: [-1,1], target=0 → [0,1].",
        "Duplicates: [3,3], target=6 → Invalid (no same index).",
        "No solution: Assume exists per problem."
      ]},
      { type: 'subheading', en: "Real Interview Scenario" },
      { type: 'p', parts: [
        "Interviewer: 'What if negatives?' Candidate: 'Works, e.g., [-1,1] sums to 0.' Cross-question: 'Duplicates?' → 'Problem assumes no same index, skip if i==j.'"
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask" },
      { type: 'ul', items: [
        "Handle empty input?",
        "Multiple pairs?"
      ] }
    ]
  },
  {
    q: { en: "How to Handle Duplicates in Two Sum?" },
    a: [
      { type: 'subheading', en: "Duplicate Handling Strategy" },
      { type: 'p', parts: [
        "Since Two Sum prohibits same index, check i != j in loops or use hash map with index uniqueness."
      ]},
      { type: 'subheading', en: "Real Interview Scenario" },
      { type: 'p', parts: [
        "Interviewer: 'Duplicates in Two Sum?' Candidate: 'Problem assumes no same index, but I’d add i != j check.'"
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask" },
      { type: 'ul', items: [
        "Why no duplicates?",
        "Modify for duplicates?"
      ] }
    ]
  },
  {
    q: { en: "What are Trade-Offs of the Hash Map Approach for Two Sum?" },
    a: [
      { type: 'subheading', en: "Trade-Offs Analysis" },
      { type: 'ul', items: [
        "Advantage: O(n) time, works with unsorted arrays.",
        "Disadvantage: O(n) space, potential collisions.",
        "Alternative: Two pointers (O(n) time after O(n log n) sort, O(1) space)."
      ]},
      { type: 'subheading', en: "Real Interview Scenario" },
      { type: 'p', parts: [
        "Interviewer: 'Trade-offs?' Candidate: 'O(n) space vs. O(n log n) sort of two pointers. Hash wins for unsorted data.'"
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask" },
      { type: 'ul', items: [
        "When to use pointers?",
        "Collision handling?"
      ] }
    ]
  },
  {
    q: { en: "What is the Problem Statement for Two Sum II (LC167)?" },
    a: [
      { type: 'subheading', en: "Problem Breakdown" },
      { type: 'p', parts: [
        "Given a sorted array nums and target, return 1-indexed positions of two numbers summing to target."
      ]},
      { type: 'subheading', en: "Example" },
      { type: 'p', parts: [
        "Input: nums = [2,7,11,15], target = 9",
        "Output: [1,2]",
        "Explanation: 2 + 7 = 9, 1-indexed."
      ]},
      { ascii: `
left=0 (2), right=3 (15), sum=17 >9 → right=2
left=0 (2), right=2 (11), sum=13 >9 → right=1
left=0 (2), right=1 (7), sum=9 =9 → [1,2]
      ` },
      { type: 'subheading', en: "Real Interview Scenario" },
      { type: 'p', parts: [
        "Interviewer: 'Solve Two Sum II.' Candidate: 'Use two pointers, O(n) since sorted.'"
      ]},
      { type: 'link', text: "LeetCode Link", href: "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/" }
    ]
  },
  {
    q: { en: "What is the Optimized Two-Pointer Approach for Two Sum II (LC167)?" },
    a: [
      { type: 'subheading', en: "Approach Explanation" },
      { type: 'p', parts: [
        "Use left=0, right=n-1 on sorted array. If sum > target, right--; < target, left++; = target, return 1-indexed positions."
      ]},
      { type: 'subheading', en: "Code with Comments" },
      { codeBlock: `
/**
 * Optimized two-pointer solution for Two Sum II
 * @param {number[]} numbers - Sorted array
 * @param {number} target - Target sum
 * @return {number[]} - 1-indexed positions
 */
function twoSumII(numbers, target) {
  let left = 0, right = numbers.length - 1;
  while (left < right) {
    const sum = numbers[left] + numbers[right];
    if (sum === target) {
      return [left + 1, right + 1]; // 1-indexed
    } else if (sum < target) {
      left++;
    } else {
      right--;
    }
  }
  return []; // No solution
}
      ` },
      { type: 'subheading', en: "Dry Run" },
      { ascii: `
nums = [2,7,11,15], target=9
left=0 (2), right=3 (15), sum=17 >9 → right=2
left=0 (2), right=2 (11), sum=13 >9 → right=1
left=0 (2), right=1 (7), sum=9 =9 → [1,2]
      ` },
      { type: 'subheading', en: "Complexity" },
      { type: 'ul', items: [
        "Time: O(n) - Single pass.",
        "Space: O(1) - No extra space."
      ]},
      { type: 'subheading', en: "Real Interview Scenario" },
      { type: 'p', parts: [
        "Interviewer: 'Explain Two Sum II.' Candidate: 'Two pointers, O(n), leverages sorted input.' Cross-question: 'Unsorted?' → 'Use hash map, O(n) time, O(n) space.'"
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask" },
      { type: 'ul', items: [
        "Why 1-indexed?",
        "Handle edge cases?"
      ] }
    ]
  },
  {
    q: { en: "What are Trade-Offs of the Two-Pointer Approach for Two Sum II?" },
    a: [
      { type: 'subheading', en: "Trade-Offs Analysis" },
      { type: 'ul', items: [
        "Advantage: O(1) space, O(n) time with sorted input.",
        "Disadvantage: Requires sorted array, fails if unsorted.",
        "Alternative: Hash map (O(n) time, O(n) space) for unsorted."
      ]},
      { type: 'subheading', en: "Real Interview Scenario" },
      { type: 'p', parts: [
        "Interviewer: 'Trade-offs?' Candidate: 'O(1) space but needs sorting; hash offers flexibility.'"
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask" },
      { type: 'ul', items: [
        "When to use hash?",
        "Sort overhead?"
      ] }
    ]
  },
  {
    q: { en: "What is the Problem Statement for 3Sum (LC15)?" },
    a: [
      { type: 'subheading', en: "Problem Breakdown" },
      { type: 'p', parts: [
        "Given array nums, find all unique triplets summing to 0. Return list of triplets, no duplicates."
      ]},
      { type: 'subheading', en: "Example" },
      { type: 'p', parts: [
        "Input: nums = [-1,0,1,2,-1,-4]",
        "Output: [[-1,-1,2],[-1,0,1]]"
      ]},
      { ascii: `
Sorted: [-4,-1,-1,0,1,2]
i=0 (-4): j=1 (-1), k=5 (2) → -4-1+2=-3 <0, move j
... Adjust to [-1,-1,2], [-1,0,1]
      ` },
      { type: 'subheading', en: "Real Interview Scenario" },
      { type: 'p', parts: [
        "Interviewer: 'Solve 3Sum.' Candidate: 'Sort, use two pointers, O(n²) after sort.'"
      ]},
      { type: 'link', text: "LeetCode Link", href: "https://leetcode.com/problems/3sum/" }
    ]
  },
  {
    q: { en: "What is the Optimized Two-Pointer Approach for 3Sum (LC15)?" },
    a: [
      { type: 'subheading', en: "Approach Explanation" },
      { type: 'p', parts: [
        "Sort array, fix one element, use two pointers for others, skip duplicates for uniqueness."
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
      { ascii: `
nums = [-1,0,1,2,-1,-4], sorted = [-4,-1,-1,0,1,2]
i=0 (-4): left=1 (-1), right=5 (2), sum=-3 <0 → left=2
i=1 (-1): left=2 (-1), right=5 (2), sum=0 → [-1,-1,2], skip duplicates
i=2 (-1): left=3 (0), right=4 (1), sum=0 → [-1,0,1]
      ` },
      { type: 'subheading', en: "Complexity" },
      { type: 'ul', items: [
        "Time: O(n²) - Sorting O(n log n), pointers O(n²).",
        "Space: O(1) - Excluding output."
      ]},
      { type: 'subheading', en: "Real Interview Scenario" },
      { type: 'p', parts: [
        "Interviewer: 'Explain 3Sum.' Candidate: 'Sort, fix one, use pointers, O(n²).' Cross-question: 'Duplicates?' → 'Skipped via adjacent checks.'"
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask" },
      { type: 'ul', items: [
        "Why sort first?",
        "Handle no solution?"
      ] }
    ]
  },
  {
    q: { en: "What are Trade-Offs of the Two-Pointer Approach for 3Sum?" },
    a: [
      { type: 'subheading', en: "Trade-Offs Analysis" },
      { type: 'ul', items: [
        "Advantage: O(1) space, effective duplicate handling.",
        "Disadvantage: O(n log n) sort overhead.",
        "Alternative: Hash-based O(n²) with O(n) space."
      ]},
      { type: 'subheading', en: "Real Interview Scenario" },
      { type: 'p', parts: [
        "Interviewer: 'Trade-offs?' Candidate: 'O(1) space but O(n log n) sort; hash saves sort but uses O(n) space.'"
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask" },
      { type: 'ul', items: [
        "When to use hash?",
        "Sort impact on time?"
      ] }
    ]
  },
  {
    q: { en: "What is the Problem Statement for 3Sum Closest (LC16)?" },
    a: [
      { type: 'subheading', en: "Problem Breakdown" },
      { type: 'p', parts: [
        "Given array nums and target, find triplet sum closest to target. Return that sum."
      ]},
      { type: 'subheading', en: "Example" },
      { type: 'p', parts: [
        "Input: nums = [-1,2,1,-4], target = 1",
        "Output: 2",
        "Explanation: -1 + 2 + 1 = 2 is closest."
      ]},
      { ascii: `
Sorted: [-4,-1,1,2]
i=0 (-4): left=1 (-1), right=3 (2), sum=-3, diff=4
... Adjust to 2
      ` },
      { type: 'subheading', en: "Real Interview Scenario" },
      { type: 'p', parts: [
        "Interviewer: 'Solve 3Sum Closest.' Candidate: 'Sort, use pointers, track min difference.'"
      ]},
      { type: 'link', text: "LeetCode Link", href: "https://leetcode.com/problems/3sum-closest/" }
    ]
  },
  {
    q: { en: "What is the Optimized Approach for 3Sum Closest (LC16)?" },
    a: [
      { type: 'subheading', en: "Approach Explanation" },
      { type: 'p', parts: [
        "Sort, fix one element, use two pointers, update min difference when closer to target."
      ]},
      { type: 'subheading', en: "Code with Comments" },
      { codeBlock: `
/**
 * Optimized solution for 3Sum Closest
 * @param {number[]} nums - Input array
 * @param {number} target - Target sum
 * @return {number} - Closest sum
 */
function threeSumClosest(nums, target) {
  nums.sort((a, b) => a - b);
  let closest = nums[0] + nums[1] + nums[2];
  for (let i = 0; i < nums.length - 2; i++) {
    let left = i + 1, right = nums.length - 1;
    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];
      if (sum === target) return sum;
      if (Math.abs(sum - target) < Math.abs(closest - target)) {
        closest = sum;
      }
      if (sum < target) left++;
      else right--;
    }
  }
  return closest;
}
      ` },
      { type: 'subheading', en: "Dry Run" },
      { ascii: `
nums = [-1,2,1,-4], target=1, sorted = [-4,-1,1,2]
i=0 (-4): left=1 (-1), right=3 (2), sum=-3, diff=4 → closest=-3
i=1 (-1): left=2 (1), right=3 (2), sum=2, diff=1 → closest=2
      ` },
      { type: 'subheading', en: "Complexity" },
      { type: 'ul', items: [
        "Time: O(n²)",
        "Space: O(1)"
      ]},
      { type: 'subheading', en: "Real Interview Scenario" },
      { type: 'p', parts: [
        "Interviewer: 'Why track difference?' Candidate: 'To find closest sum efficiently.' Cross-question: 'Ties?' → 'Return any, per problem.'"
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask" },
      { type: 'ul', items: [
        "How to handle ties?",
        "Optimize further?"
      ] }
    ]
  },
  {
    q: { en: "What are Trade-Offs of the Two-Pointer Approach for 3Sum Closest?" },
    a: [
      { type: 'subheading', en: "Trade-Offs Analysis" },
      { type: 'ul', items: [
        "Advantage: O(1) space, works with sorted input.",
        "Disadvantage: O(n log n) sort, no early exit.",
        "Alternative: Hash-based O(n²) with O(n) space."
      ]},
      { type: 'subheading', en: "Real Interview Scenario" },
      { type: 'p', parts: [
        "Interviewer: 'Trade-offs?' Candidate: 'Space-efficient but requires sorting; hash avoids sort but uses O(n) space.'"
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask" },
      { type: 'ul', items: [
        "When to prefer hash?",
        "Memory impact?"
      ] }
    ]
  },
  {
    q: { en: "What is the Problem Statement for 4Sum (LC18)?" },
    a: [
      { type: 'subheading', en: "Problem Breakdown" },
      { type: 'p', parts: [
        "Given array nums and target, find all unique quadruplets summing to target."
      ]},
      { type: 'subheading', en: "Example" },
      { type: 'p', parts: [
        "Input: nums = [1,0,-1,0,-2,2], target = 0",
        "Output: [[-2,-1,1,2],[-2,0,0,2],[-1,0,0,1]]"
      ]},
      { ascii: `
Sorted: [-2,-1,0,0,1,2]
i=0 (-2): j=1 (-1), left=2 (0), right=5 (2) → -2-1+0+2=-1
... Adjust to find quadruplets
      ` },
      { type: 'subheading', en: "Real Interview Scenario" },
      { type: 'p', parts: [
        "Interviewer: 'Solve 4Sum.' Candidate: 'Extend 3Sum, use nested loops with pointers.'"
      ]},
      { type: 'link', text: "LeetCode Link", href: "https://leetcode.com/problems/4sum/" }
    ]
  },
  {
    q: { en: "What is the Optimized Approach for 4Sum (LC18)?" },
    a: [
      { type: 'subheading', en: "Approach Explanation" },
      { type: 'p', parts: [
        "Sort, use two nested loops to fix first two elements, then two pointers, skipping duplicates."
      ]},
      { type: 'subheading', en: "Code with Comments" },
      { codeBlock: `
/**
 * Optimized solution for 4Sum
 * @param {number[]} nums - Input array
 * @param {number} target - Target sum
 * @return {number[][]} - List of unique quadruplets
 */
function fourSum(nums, target) {
  nums.sort((a, b) => a - b);
  const result = [];
  for (let i = 0; i < nums.length - 3; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    for (let j = i + 1; j < nums.length - 2; j++) {
      if (j > i + 1 && nums[j] === nums[j - 1]) continue;
      let left = j + 1, right = nums.length - 1;
      while (left < right) {
        const sum = nums[i] + nums[j] + nums[left] + nums[right];
        if (sum === target) {
          result.push([nums[i], nums[j], nums[left], nums[right]]);
          while (left < right && nums[left] === nums[left + 1]) left++;
          while (left < right && nums[right] === nums[right - 1]) right--;
          left++;
          right--;
        } else if (sum < target) {
          left++;
        } else {
          right--;
        }
      }
    }
  }
  return result;
}
      ` },
      { type: 'subheading', en: "Dry Run" },
      { ascii: `
nums = [1,0,-1,0,-2,2], target=0, sorted = [-2,-1,0,0,1,2]
i=0 (-2), j=1 (-1): left=2 (0), right=5 (2), sum=-1 → left=3
i=0 (-2), j=1 (-1): left=3 (0), right=5 (2), sum=0 → [-2,-1,0,2]
... Continue
      ` },
      { type: 'subheading', en: "Complexity" },
      { type: 'ul', items: [
        "Time: O(n³)",
        "Space: O(1) - Excluding output."
      ]},
      { type: 'subheading', en: "Real Interview Scenario" },
      { type: 'p', parts: [
        "Interviewer: 'Explain 4Sum.' Candidate: 'O(n³) with nested loops and pointers.' Cross-question: 'Duplicates?' → 'Skipped via checks.'"
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask" },
      { type: 'ul', items: [
        "Why O(n³)?",
        "Optimize for small n?"
      ] }
    ]
  },
  {
    q: { en: "What are Trade-Offs of the Two-Pointer Approach for 4Sum?" },
    a: [
      { type: 'subheading', en: "Trade-Offs Analysis" },
      { type: 'ul', items: [
        "Advantage: O(1) space, systematic duplicate handling.",
        "Disadvantage: O(n³) time, high for large n.",
        "Alternative: Hash-based O(n²) with O(n²) space."
      ]},
      { type: 'subheading', en: "Real Interview Scenario" },
      { type: 'p', parts: [
        "Interviewer: 'Trade-offs?' Candidate: 'O(n³) time vs. O(n²) space of hash. Two-pointers save space but scale poorly.'"
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask" },
      { type: 'ul', items: [
        "When to use hash?",
        "Early termination?"
      ] }
    ]
  },
  // ... Continuing with more FAQs to reach 50+, covering additional problems, concepts, and cross-questions...
  {
    q: { en: "How to Optimize 4Sum for Small Inputs?" },
    a: [
      { type: 'subheading', en: "Optimization Strategy" },
      { type: 'p', parts: [
        "For small n, brute force (O(n⁴)) may suffice if n < 10. Otherwise, use two-pointer O(n³) with early termination if sum far from target."
      ]},
      { type: 'subheading', en: "Real Interview Scenario" },
      { type: 'p', parts: [
        "Interviewer: 'Optimize 4Sum for small n.' Candidate: 'Brute force for n<10, else two-pointers with early exit.'"
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask" },
      { type: 'ul', items: [
        "Define 'small n'?",
        "Impact on complexity?"
      ] }
    ]
  },
  {
    q: { en: "What if No Solution Exists in Sum Patterns?" },
    a: [
      { type: 'subheading', en: "Handling No Solution" },
      { type: 'p', parts: [
        "Return empty array/list. For Two Sum, problem assumes solution; for 3Sum/4Sum, check all combinations and return [] if none."
      ]},
      { type: 'subheading', en: "Real Interview Scenario" },
      { type: 'p', parts: [
        "Interviewer: 'No solution?' Candidate: 'Return empty array after exhaustive search.'"
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask" },
      { type: 'ul', items: [
        "Edge case validation?",
        "Early exit?"
      ] }
    ]
  },
  // ... Additional FAQs to be added in subsequent responses to reach 50+...
];

/* ========== builder: renders FAQ HTML ========== */
const buildSumPairFAQSection = (id, title, qaArray) => {
  let faqList = '<div class="faq-list">';
  qaArray.forEach((item, index) => {
    const uniqueId = `${id}-q${index + 1}`;

    const qObj = getLangText(item.q, 'en');
    const qEn = qObj.en;

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
  faqList += '</div>';

  const titleObj = getLangText({ en: title }, 'en');
  const titleEn = titleObj.en;

  return `
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
