/* backtrackingPermutationsQA.js
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


/* ========== FAQ data for Prefix Sum & Monotonic Queue Patterns ========== */
const prefixSumMonotonicQueueQA = [
 {
    q: { en: "What is the Binary Search Pattern?" },
    level: 'fresher',
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Binary Search Definition" },
      { type: 'ul', items: [
        "The interviewer might ask 'What is Binary Search?' to test core understanding.",
        "Follow-up: 'When is it applicable?'",
        "Deeper: 'How does it differ from linear search?'"
      ]},
      { type: 'subheading', en: "Binary Search Definition" },
      { type: 'ul', items: [
        "Binary Search: Finds a target in a sorted array by halving the search space.",
        "Key Idea: Compare mid-point, eliminate half based on comparison.",
        "Time: O(log n) (halves n each step), Space: O(1) iterative, O(log n) recursive.",
        "Applicability: Sorted arrays (LC704), monotonic functions (LC278, LC1011)."
      ]},
      { type: 'ascii', ascii: `
nums=[1,3,5,7,9], target=5
[1,3,5,7,9] -> mid=5 (found)
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Emphasize 'sorted' requirement in interviews."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you recognize Binary Search problems?",
        "How do you implement Binary Search?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Recognize Binary Search Problems?" },
    level: 'fresher',
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Recognition Cues" },
      { type: 'ul', items: [
        "The interviewer might ask 'When do you use Binary Search?' to test problem identification.",
        "Follow-up: 'What are the cues?'",
        "Deeper: 'How do you adapt for variations?'"
      ]},
      { type: 'subheading', en: "Recognition Cues" },
      { type: 'ul', items: [
        "Sorted Data: Array or range is sorted (LC704, LC35).",
        "Monotonic Property: Function increases/decreases (LC278, LC1011).",
        "Halving Space: Can eliminate half the search space (LC153).",
        "Examples: Find target (LC704), first true (LC278), pivot (LC153)."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Look for 'sorted' or 'monotonic' in problem statements."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you implement Binary Search?",
        "What is Search-on-Answer?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Implement Binary Search?" },
    level: 'fresher',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Implementation" },
      { type: 'ul', items: [
        "The interviewer might ask 'Can you code Binary Search?' to test coding skills.",
        "Follow-up: 'Iterative or recursive?'",
        "Deeper: 'How do you handle edge cases?'"
      ]},
      { type: 'subheading', en: "Binary Search Implementation" },
      { type: 'ul', items: [
        "Iterative: Use low, high pointers, compute mid, adjust based on comparison.",
        "Recursive: Divide search space, recurse on half.",
        "Time: O(log n), Space: O(1) iterative, O(log n) recursive.",
        "Key: Avoid mid-point overflow (low + (high - low) / 2)."
      ]},
      { type: 'codeBlock', codeBlock: `
function binarySearch(nums, target) {
  let low = 0, high = nums.length - 1;
  while (low <= high) {
    let mid = Math.floor(low + (high - low) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return -1;
}
      ` },
      { type: 'ascii', ascii: `
nums=[1,3,5,7,9], target=5
low=0, high=4, mid=2: nums[2]=5 (found)
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Use iterative Binary Search for simplicity."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What is Search-on-Answer?",
        "How do you handle mid-point calculation?"
      ] }
    ]
  },
  {
    q: { en: "What is Search-on-Answer?" },
    level: 'intermediate',
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Search-on-Answer" },
      { type: 'ul', items: [
        "The interviewer might ask 'What is Search-on-Answer?' to test pattern understanding.",
        "Follow-up: 'How does it differ from standard Binary Search?'",
        "Deeper: 'How do you apply it?'"
      ]},
      { type: 'subheading', en: "Search-on-Answer Definition" },
      { type: 'ul', items: [
        "Search-on-Answer: Binary Search on a range of possible answers, not array indices.",
        "Key Idea: Test mid-point answer, adjust based on feasibility.",
        "Time: O(log R) * O(check), where R is answer range, check is validation.",
        "Examples: LC278 (version), LC1011 (capacity), LC875 (speed)."
      ]},
      { type: 'ascii', ascii: `
LC1011: capacity range [1, max]
mid=500: Can ship in D days? -> Adjust low/high
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Identify answer range for Search-on-Answer."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle mid-point calculation?",
        "How do you handle boundary selection?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Mid-Point Calculation in Binary Search?" },
    level: 'fresher',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Mid-Point Calculation" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you compute the mid-point?' to test precision.",
        "Follow-up: 'How do you avoid overflow?'",
        "Deeper: 'What if mid-point splits unevenly?'"
      ]},
      { type: 'subheading', en: "Mid-Point Calculation" },
      { type: 'ul', items: [
        "Formula: mid = low + (high - low) / 2 (avoids overflow vs. (low + high) / 2).",
        "Integer Division: Use Math.floor for JavaScript.",
        "Uneven Split: Doesn’t affect correctness (one half always smaller).",
        "Edge Case: Ensure low <= high to avoid infinite loops."
      ]},
      { type: 'codeBlock', codeBlock: `
let mid = Math.floor(low + (high - low) / 2); // Safe mid-point
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Always use low + (high - low) / 2."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle boundary selection?",
        "How do you handle edge cases in Binary Search?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Boundary Selection in Binary Search?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Boundary Selection" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you choose boundaries?' to test logic.",
        "Follow-up: 'How do you adjust low/high?'",
        "Deeper: 'How do you handle Search-on-Answer boundaries?'"
      ]},
      { type: 'subheading', en: "Boundary Selection" },
      { type: 'ul', items: [
        "Standard: low=0, high=nums.length-1 (LC704, LC35).",
        "Search-on-Answer: low=min answer, high=max answer (LC278: 1 to n, LC1011: max weight).",
        "Adjustment: low=mid+1 (target > mid), high=mid-1 (target < mid).",
        "Edge Case: Handle low > high (target not found)."
      ]},
      { type: 'ascii', ascii: `
LC704: nums=[1,3,5,7,9], target=5
low=0, high=4 -> mid=2, nums[2]=5 (found)
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Clarify boundary range in interviews."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle edge cases in Binary Search?",
        "What are common mistakes in Binary Search?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Edge Cases in Binary Search?" },
    level: 'fresher',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Edge Cases" },
      { type: 'ul', items: [
        "The interviewer might ask 'What edge cases do you handle?' to test robustness.",
        "Follow-up: 'How do you handle empty arrays?'",
        "Deeper: 'What if target is outside range?'"
      ]},
      { type: 'subheading', en: "Edge Cases" },
      { type: 'ul', items: [
        "Empty Array: Return -1 (LC704) or 0 (LC35).",
        "Single Element: Check nums[0] (LC704, LC35).",
        "Target Outside Range: Return -1 (LC704) or nums.length/0 (LC35).",
        "n ≤ 20: Ensures O(log n) is fast (LC704, LC35)."
      ]},
      { type: 'codeBlock', codeBlock: `
function binarySearch(nums, target) {
  if (nums.length === 0) return -1; // Edge case
  // Proceed with binary search
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Handle empty array first in code."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What are common mistakes in Binary Search?",
        "How do you optimize Binary Search?"
      ] }
    ]
  },
  {
    q: { en: "What Are Common Mistakes in Binary Search?" },
    level: 'fresher',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Common Mistakes" },
      { type: 'ul', items: [
        "The interviewer might ask 'What mistakes do people make in Binary Search?' to test awareness.",
        "Follow-up: 'How do you avoid them?'",
        "Deeper: 'How do you debug them?'"
      ]},
      { type: 'subheading', en: "Common Mistakes" },
      { type: 'ul', items: [
        "Mid-Point Overflow: Using (low + high) / 2 instead of low + (high - low) / 2.",
        "Infinite Loop: Not updating low=mid+1 or high=mid-1 correctly.",
        "Off-by-One: Incorrect boundary checks (e.g., low < high vs. low <= high).",
        "Unsorted Input: Assuming array is sorted without validation."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Dry run with small inputs to catch mistakes."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you optimize Binary Search?",
        "How do you explain Binary Search clearly?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Optimize Binary Search?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Optimization" },
      { type: 'ul', items: [
        "The interviewer might ask 'Can you optimize Binary Search?' to test efficiency.",
        "Follow-up: 'Is O(log n) optimal?'",
        "Deeper: 'How do you handle large inputs?'"
      ]},
      { type: 'subheading', en: "Binary Search Optimization" },
      { type: 'ul', items: [
        "Iterative: Avoid recursion stack, O(1) space vs. O(log n).",
        "Mid-Point: Use low + (high - low) / 2 to prevent overflow.",
        "Early Exit: Return on exact match to minimize iterations.",
        "O(log n) is optimal for comparison-based search."
      ]},
      { type: 'codeBlock', codeBlock: `
function binarySearch(nums, target) {
  let low = 0, high = nums.length - 1;
  while (low <= high) {
    let mid = Math.floor(low + (high - low) / 2);
    if (nums[mid] === target) return mid; // Early exit
    if (nums[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return -1;
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Use iterative Binary Search for FAANG interviews."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you explain Binary Search clearly?",
        "What is the approach to solve LC704?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Explain Binary Search Clearly in Interviews?" },
    level: 'fresher',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Explanation" },
      { type: 'ul', items: [
        "The interviewer might ask 'Can you explain Binary Search?' to test communication.",
        "Follow-up: 'How do you simplify it?'",
        "Deeper: 'How do you handle follow-ups?'"
      ]},
      { type: 'subheading', en: "Explaining Binary Search" },
      { type: 'ul', items: [
        "Break down: Problem, sorted array, halve space, compare mid-point.",
        "Use example: nums=[1,3,5,7,9], target=5, show low, mid, high.",
        "Draw search space: Visualize halving process.",
        "Address follow-ups: Duplicates, edge cases, Search-on-Answer."
      ]},
      { type: 'ascii', ascii: `
nums=[1,3,5,7,9], target=5
[1,3,5,7,9] -> mid=2, nums[2]=5 (found)
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Draw search space in interviews."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What is the approach to solve LC704?",
        "How do you handle iterative vs. recursive Binary Search?"
      ] }
    ]
  },
  // LC704: Binary Search
  {
    q: { en: "What is the Approach to Solve LC704 (Binary Search)?" },
    level: 'fresher',
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: LC704 Approach" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you solve LC704?' to test basic Binary Search.",
        "Follow-up: 'What’s the complexity?'",
        "Deeper: 'How do you handle duplicates?'"
      ]},
      { type: 'subheading', en: "LC704 Approach" },
      { type: 'ul', items: [
        "Problem: Find target in sorted array, return index or -1.",
        "Binary Search: Halve search space, compare mid-point.",
        "Time: O(log n), Space: O(1) iterative.",
        "Steps: Initialize low=0, high=n-1, adjust based on nums[mid] vs. target."
      ]},
      { type: 'codeBlock', codeBlock: `
function search(nums, target) {
  let low = 0, high = nums.length - 1;
  while (low <= high) {
    let mid = Math.floor(low + (high - low) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return -1;
}
      ` },
      { type: 'ascii', ascii: `
nums=[1,3,5,7,9], target=5
low=0, high=4 -> mid=2, nums[2]=5 (found)
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Practice LC704 for core Binary Search."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle duplicates in LC704?",
        "How do you handle edge cases in LC704?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Duplicates in LC704?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: LC704 Duplicates" },
      { type: 'ul', items: [
        "The interviewer might ask 'What if LC704 has duplicates?' to test adaptability.",
        "Follow-up: 'How do you find first/last occurrence?'",
        "Deeper: 'How does it affect complexity?'"
      ]},
      { type: 'subheading', en: "LC704 Duplicate Handling" },
      { type: 'ul', items: [
        "LC704 assumes unique elements, but variation (LC34) finds first/last occurrence.",
        "Modify Binary Search: If nums[mid] === target, search left/right for boundaries.",
        "Time: O(log n) per boundary, Space: O(1).",
        "Key: Adjust low/high to find first or last position."
      ]},
      { type: 'codeBlock', codeBlock: `
function searchRange(nums, target) {
  const findBound = (isFirst) => {
    let low = 0, high = nums.length - 1, result = -1;
    while (low <= high) {
      let mid = Math.floor(low + (high - low) / 2);
      if (nums[mid] === target) {
        result = mid;
        if (isFirst) high = mid - 1;
        else low = mid + 1;
      } else if (nums[mid] < target) low = mid + 1;
      else high = mid - 1;
    }
    return result;
  };
  return [findBound(true), findBound(false)];
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Practice LC34 for duplicate handling."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle edge cases in LC704?",
        "How do you optimize LC704?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Edge Cases in LC704?" },
    level: 'fresher',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: LC704 Edge Cases" },
      { type: 'ul', items: [
        "The interviewer might ask 'What edge cases do you handle in LC704?' to test robustness.",
        "Follow-up: 'How do you handle empty arrays?'",
        "Deeper: 'What if target is outside range?'"
      ]},
      { type: 'subheading', en: "LC704 Edge Cases" },
      { type: 'ul', items: [
        "Empty Array: Return -1.",
        "Single Element: Check nums[0] === target.",
        "Target Outside Range: Return -1 (low > high).",
        "n ≤ 10^5: Ensures O(log n) is fast."
      ]},
      { type: 'codeBlock', codeBlock: `
function search(nums, target) {
  if (nums.length === 0) return -1; // Edge case
  // Proceed with binary search
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Check empty array first in LC704."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you optimize LC704?",
        "What are follow-up questions for LC704?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Optimize LC704?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: LC704 Optimization" },
      { type: 'ul', items: [
        "The interviewer might ask 'Can you optimize LC704?' to test efficiency.",
        "Follow-up: 'Is O(log n) optimal?'",
        "Deeper: 'How do you handle large inputs?'"
      ]},
      { type: 'subheading', en: "LC704 Optimization" },
      { type: 'ul', items: [
        "Iterative: O(1) space vs. O(log n) recursive.",
        "Early Exit: Return on nums[mid] === target.",
        "Mid-Point: Use low + (high - low) / 2 to avoid overflow.",
        "O(log n) is optimal for comparison-based search."
      ]},
      { type: 'codeBlock', codeBlock: `
function search(nums, target) {
  let low = 0, high = nums.length - 1;
  while (low <= high) {
    let mid = Math.floor(low + (high - low) / 2);
    if (nums[mid] === target) return mid; // Early exit
    if (nums[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return -1;
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Use early exit for LC704 in interviews."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What are follow-up questions for LC704?",
        "How do you test LC704 solutions?"
      ] }
    ]
  },
  {
    q: { en: "What Are Follow-Up Questions for LC704?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: LC704 Follow-Ups" },
      { type: 'ul', items: [
        "The interviewer might ask 'What follow-ups do you expect for LC704?' to test preparedness.",
        "Follow-up: 'How do you handle duplicates?'",
        "Deeper: 'What if array is rotated?'"
      ]},
      { type: 'subheading', en: "LC704 Follow-Up Questions" },
      { type: 'ul', items: [
        "Duplicates: Find first/last occurrence (LC34).",
        "Rotated Array: Search in rotated sorted array (LC33).",
        "Insert Position: Return insertion index (LC35).",
        "Count Occurrences: Modify to count matches."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Practice LC34, LC33 for LC704 follow-ups."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you test LC704 solutions?",
        "What is the approach to solve LC278?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Test LC704 Solutions?" },
    level: 'fresher',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: LC704 Testing" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you test your LC704 solution?' to test thoroughness.",
        "Follow-up: 'What test cases do you prioritize?'",
        "Deeper: 'How do you ensure correctness?'"
      ]},
      { type: 'subheading', en: "LC704 Testing" },
      { type: 'ul', items: [
        "Test small inputs: [1,3,5] target=3 → 2, target=4 → -1.",
        "Test edge cases: [] → -1, [1] → 0 or -1.",
        "Test boundaries: Target < nums[0], target > nums[n-1].",
        "Verify: O(log n) iterations, correct index or -1."
      ]},
      { type: 'ascii', ascii: `
nums=[1,3,5], target=3
low=0, high=2 -> mid=1, nums[1]=3 (found)
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Test edge cases first for LC704."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What is the approach to solve LC278?",
        "How do you handle iterative vs. recursive Binary Search?"
      ] }
    ]
  },
  // LC278: First Bad Version
  {
    q: { en: "What is the Approach to Solve LC278 (First Bad Version)?" },
    level: 'intermediate',
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: LC278 Approach" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you solve LC278?' to test Search-on-Answer.",
        "Follow-up: 'What’s the complexity?'",
        "Deeper: 'How do you find the first true?'"
      ]},
      { type: 'subheading', en: "LC278 Approach" },
      { type: 'ul', items: [
        "Problem: Find first bad version in [1,n], given isBadVersion API.",
        "Search-on-Answer: Binary Search on version range, find first true.",
        "Time: O(log n) (halves range), Space: O(1).",
        "Key: If mid is bad, search left (mid could be first); else search right."
      ]},
      { type: 'codeBlock', codeBlock: `
function firstBadVersion(n) {
  let low = 1, high = n;
  while (low < high) {
    let mid = Math.floor(low + (high - low) / 2);
    if (isBadVersion(mid)) high = mid; // Search left
    else low = mid + 1; // Search right
  }
  return low;
}
      ` },
      { type: 'ascii', ascii: `
n=5, bad=4
[1,2,3,4,5] -> mid=3 (good) -> low=4
[4,5] -> mid=4 (bad) -> high=4
low=4 (found)
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Practice LC278 for Search-on-Answer."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle boundary selection in LC278?",
        "How do you handle edge cases in LC278?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Boundary Selection in LC278?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: LC278 Boundary Selection" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you choose boundaries in LC278?' to test logic.",
        "Follow-up: 'Why low=1, high=n?'",
        "Deeper: 'How do you ensure first bad version?'"
      ]},
      { type: 'subheading', en: "LC278 Boundary Selection" },
      { type: 'ul', items: [
        "Boundaries: low=1, high=n (version range).",
        "Key: If isBadVersion(mid), high=mid (mid could be first).",
        "If !isBadVersion(mid), low=mid+1 (first bad is right).",
        "Exit: low == high returns first bad version."
      ]},
      { type: 'codeBlock', codeBlock: `
function firstBadVersion(n) {
  let low = 1, high = n;
  while (low < high) {
    let mid = Math.floor(low + (high - low) / 2);
    if (isBadVersion(mid)) high = mid;
    else low = mid + 1;
  }
  return low;
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Explain why high=mid in LC278."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle edge cases in LC278?",
        "How do you optimize LC278?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Edge Cases in LC278?" },
    level: 'fresher',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: LC278 Edge Cases" },
      { type: 'ul', items: [
        "The interviewer might ask 'What edge cases do you handle in LC278?' to test robustness.",
        "Follow-up: 'What if n=1?'",
        "Deeper: 'What if all versions are good/bad?'"
      ]},
      { type: 'subheading', en: "LC278 Edge Cases" },
      { type: 'ul', items: [
        "n=1: Return 1 if isBadVersion(1).",
        "All Good: Return n+1 (not applicable per constraints).",
        "All Bad: Return 1 (first version is bad).",
        "n ≤ 2^31-1: Ensures O(log n) is manageable."
      ]},
      { type: 'codeBlock', codeBlock: `
function firstBadVersion(n) {
  if (n === 1) return isBadVersion(1) ? 1 : -1; // Edge case
  // Proceed with binary search
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Handle n=1 first in LC278."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you optimize LC278?",
        "What are follow-up questions for LC278?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Optimize LC278?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: LC278 Optimization" },
      { type: 'ul', items: [
        "The interviewer might ask 'Can you optimize LC278?' to test efficiency.",
        "Follow-up: 'Is O(log n) optimal?'",
        "Deeper: 'How do you minimize API calls?'"
      ]},
      { type: 'subheading', en: "LC278 Optimization" },
      { type: 'ul', items: [
        "Minimize API Calls: Cache isBadVersion results (if allowed).",
        "Iterative: O(1) space vs. O(log n) recursive.",
        "Early Exit: Not applicable (must find first bad).",
        "O(log n) is optimal for binary search on range."
      ]},
      { type: 'codeBlock', codeBlock: `
function firstBadVersion(n) {
  let low = 1, high = n;
  while (low < high) {
    let mid = Math.floor(low + (high - low) / 2);
    if (isBadVersion(mid)) high = mid;
    else low = mid + 1;
  }
  return low;
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Use iterative approach for LC278."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What are follow-up questions for LC278?",
        "How do you test LC278 solutions?"
      ] }
    ]
  },
  {
    q: { en: "What Are Follow-Up Questions for LC278?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: LC278 Follow-Ups" },
      { type: 'ul', items: [
        "The interviewer might ask 'What follow-ups do you expect for LC278?' to test preparedness.",
        "Follow-up: 'How do you handle noisy API?'",
        "Deeper: 'What if you need last good version?'"
      ]},
      { type: 'subheading', en: "LC278 Follow-Up Questions" },
      { type: 'ul', items: [
        "Noisy API: Retry isBadVersion, use majority voting.",
        "Last Good Version: Modify to find last false (low=mid).",
        "Count Bad Versions: Track bad versions after finding first.",
        "Multiple Bad Ranges: Find all bad segments (modified LC34)."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Practice last good version variation."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you test LC278 solutions?",
        "How do you explain LC278 clearly?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Test LC278 Solutions?" },
    level: 'fresher',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: LC278 Testing" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you test your LC278 solution?' to test thoroughness.",
        "Follow-up: 'What test cases do you prioritize?'",
        "Deeper: 'How do you mock isBadVersion?'"
      ]},
      { type: 'subheading', en: "LC278 Testing" },
      { type: 'ul', items: [
        "Test small inputs: n=5, first bad=4 → 4.",
        "Test edge cases: n=1 → 1, all bad → 1, all good → n+1.",
        "Mock API: Simulate isBadVersion with fixed bad version.",
        "Verify: Returns first version where isBadVersion is true."
      ]},
      { type: 'ascii', ascii: `
n=5, first bad=4
[1,2,3,4,5] -> mid=3 (good) -> low=4
[4,5] -> mid=4 (bad) -> high=4
Output: 4
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Mock isBadVersion for LC278 testing."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you explain LC278 clearly?",
        "How do you handle iterative vs. recursive Binary Search?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Explain LC278 Clearly in Interviews?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: LC278 Explanation" },
      { type: 'ul', items: [
        "The interviewer might ask 'Can you explain LC278?' to test communication.",
        "Follow-up: 'How do you simplify Search-on-Answer?'",
        "Deeper: 'How do you handle follow-ups?'"
      ]},
      { type: 'subheading', en: "LC278 Explanation" },
      { type: 'ul', items: [
        "Break down: Problem, range [1,n], binary search for first true.",
        "Use example: n=5, first bad=4, show low, mid, high.",
        "Draw range: Visualize halving to find first bad version.",
        "Address follow-ups: Last good version, noisy API."
      ]},
      { type: 'ascii', ascii: `
n=5, first bad=4
[1,2,3,4,5] -> mid=3 (good) -> low=4
[4,5] -> mid=4 (bad) -> high=4
Output: 4
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Draw range halving for LC278."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle iterative vs. recursive Binary Search?",
        "How do you revise Binary Search for FAANG interviews?"
      ] }
    ]
  },
  // Cross-Cutting Concepts
  {
    q: { en: "How Do You Handle Iterative vs. Recursive Binary Search?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Iterative vs. Recursive" },
      { type: 'ul', items: [
        "The interviewer might ask 'Iterative or recursive Binary Search?' to test trade-offs.",
        "Follow-up: 'What are the pros and cons?'",
        "Deeper: 'When is one better?'"
      ]},
      { type: 'subheading', en: "Iterative vs. Recursive" },
      { type: 'ul', items: [
        "Iterative: O(1) space, simpler to debug, no stack overflow.",
        "Recursive: O(log n) stack space, clearer for complex variations (LC153).",
        "Iterative Better: LC704, LC278 (simple logic).",
        "Recursive Better: LC33, LC153 (complex conditions)."
      ]},
      { type: 'codeBlock', codeBlock: `
function binarySearchRecursive(nums, target, low, high) {
  if (low > high) return -1;
  let mid = Math.floor(low + (high - low) / 2);
  if (nums[mid] === target) return mid;
  if (nums[mid] < target) return binarySearchRecursive(nums, target, mid + 1, high);
  return binarySearchRecursive(nums, target, low, mid - 1);
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Use iterative for FAANG interviews."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you revise Binary Search for FAANG interviews?",
        "How do you debug Binary Search?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Revise Binary Search for FAANG Interviews?" },
    level: 'intermediate',
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: FAANG Revision" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you prepare Binary Search for FAANG?' to test study plan.",
        "Follow-up: 'Which problems do you prioritize?'",
        "Deeper: 'How do you retain concepts?'"
      ]},
      { type: 'subheading', en: "FAANG Revision Strategy" },
      { type: 'ul', items: [
        "Week 1: LC704, LC278 (core Binary Search, Search-on-Answer).",
        "Week 2: LC35, LC153 (variations, rotated arrays).",
        "Week 3: LC1011, LC33, LC875 (Search-on-Answer, complex conditions).",
        "Daily: 1-2 problems, verbalize logic, test edge cases.",
        "Weekly: Review LC704, LC278, LC35, mock interviews."
      ]},
      { type: 'ascii', ascii: `
Revision Plan:
Week 1: LC704, LC278
Week 2: LC35, LC153
Week 3: LC1011, LC33, LC875
Daily: Verbalize, test edge cases
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Use LeetCode’s Binary Search tag for practice."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you debug Binary Search?",
        "How do you handle whiteboard strategies?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Debug Binary Search?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Debugging" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you debug Binary Search?' to test problem-solving.",
        "Follow-up: 'What bugs do you look for?'",
        "Deeper: 'How do you use logs?'"
      ]},
      { type: 'subheading', en: "Debugging Binary Search" },
      { type: 'ul', items: [
        "Bugs: Off-by-one (low <= high vs. low < high), mid-point overflow.",
        "Logs: Print low, high, mid each iteration.",
        "Dry Run: Trace with small input (e.g., [1,3,5], target=3).",
        "Test: Edge cases (empty, single element, target not found)."
      ]},
      { type: 'codeBlock', codeBlock: `
function search(nums, target) {
  let low = 0, high = nums.length - 1;
  while (low <= high) {
    let mid = Math.floor(low + (high - low) / 2);
    console.log(\`low=\${low}, high=\${high}, mid=\${mid}\`);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return -1;
}
      ` },
      { type: 'ascii', ascii: `
nums=[1,3,5], target=3
low=0, high=2, mid=1: nums[1]=3 (found)
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Log low, high, mid for debugging."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle whiteboard strategies?",
        "How do you handle ambiguous requirements?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Whiteboard Strategies for Binary Search?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Whiteboard Strategies" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you manage whiteboard space?' to test organization.",
        "Follow-up: 'How do you keep code clear?'",
        "Deeper: 'How do you visualize the search?'"
      ]},
      { type: 'subheading', en: "Whiteboard Strategies" },
      { type: 'ul', items: [
        "Write Steps: Initialize low/high, compute mid, adjust boundaries.",
        "Use Concise Names: low, high, mid.",
        "Draw Array: Show halving process (LC704, LC278).",
        "Erase Brute Force: After writing optimized code."
      ]},
      { type: 'ascii', ascii: `
nums=[1,3,5,7,9], target=5
[1,3,5,7,9] -> mid=2, nums[2]=5
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Draw search space on whiteboard."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle ambiguous requirements?",
        "How do you engage the interviewer?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Ambiguous Requirements in Binary Search?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Ambiguous Requirements" },
      { type: 'ul', items: [
        "The interviewer might ask 'What if requirements are unclear?' to test problem-solving.",
        "Follow-up: 'What questions do you ask?'",
        "Deeper: 'How do you adapt to clarifications?'"
      ]},
      { type: 'subheading', en: "Ambiguous Requirements" },
      { type: 'ul', items: [
        "Ask: Is array sorted? Duplicates allowed? Return first/last?",
        "Assume: Sorted array (LC704), unique elements unless specified.",
        "Adapt: Modify for duplicates (LC34), rotated arrays (LC33).",
        "Validate: Test with small inputs after clarification."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Clarify sorting and duplicates early."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you engage the interviewer?",
        "How do you handle cross-questions?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Engage the Interviewer During Binary Search Problems?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Interviewer Engagement" },
      { type: 'ul', items: [
        "The interviewer might ask 'Can you walk me through your thought process?' to test communication.",
        "Follow-up: 'How do you incorporate feedback?'",
        "Deeper: 'How do you handle hints?'"
      ]},
      { type: 'subheading', en: "Engaging the Interviewer" },
      { type: 'ul', items: [
        "Verbalize: Problem, sorted/monotonic, halving logic, boundaries.",
        "Ask Clarifications: Duplicates? Rotated array? Answer range?",
        "Incorporate Hints: Adjust boundaries (LC278), handle rotations (LC153).",
        "Use Diagrams: Draw array halving (LC704), range (LC278)."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Explain halving process aloud."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle cross-questions?",
        "How do you handle time pressure?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Cross-Questions in Binary Search?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Cross-Questions" },
      { type: 'ul', items: [
        "The interviewer might ask 'How does Binary Search compare to other patterns?' to test pattern knowledge.",
        "Follow-up: 'When is Binary Search better?'",
        "Deeper: 'How do you relate LC704 to LC278?'"
      ]},
      { type: 'subheading', en: "Cross-Questions Handling" },
      { type: 'ul', items: [
        "LC704 vs. LC278: Array search vs. Search-on-Answer (range).",
        "Binary Search vs. Linear: O(log n) vs. O(n), requires sorted data.",
        "Binary Search vs. Backtracking: Logarithmic vs. exponential, no backtracking needed.",
        "Explain Trade-offs: Binary Search for sorted/monotonic, Backtracking for combinatorial."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Compare Binary Search to linear search."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle time pressure?",
        "How do you prioritize Binary Search problems?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Time Pressure in Binary Search Interviews?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Time Pressure" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you manage time in Binary Search interviews?' to test efficiency.",
        "Follow-up: 'How do you avoid getting stuck?'",
        "Deeper: 'How do you balance coding and explanation?'"
      ]},
      { type: 'subheading', en: "Time Management" },
      { type: 'ul', items: [
        "Allocate: 5 min clarify, 10 min design, 15 min code, 5 min test.",
        "Start Simple: Write standard Binary Search, adapt for variations.",
        "Explain While Coding: Verbalize low, high, mid logic.",
        "If Stuck: Fall back to linear search, optimize to Binary Search."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Practice 30-min timed sessions."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you prioritize Binary Search problems?",
        "How do you ensure code readability?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Prioritize Binary Search Problems for FAANG Interviews?" },
    level: 'fresher',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Problem Prioritization" },
      { type: 'ul', items: [
        "The interviewer might ask 'Which Binary Search problems to practice?' to test preparation.",
        "Follow-up: 'Why prioritize these?'",
        "Deeper: 'How do you build intuition?'"
      ]},
      { type: 'subheading', en: "Problem Prioritization" },
      { type: 'ul', items: [
        "Start: LC704, LC278 (core Binary Search, Search-on-Answer).",
        "Intermediate: LC35, LC153 (insert position, rotated arrays).",
        "Advanced: LC1011, LC33, LC875 (Search-on-Answer, complex conditions).",
        "Focus: FAANG favorites (LC704, LC278, LC153)."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Start with LC704 for quick wins."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you ensure code readability?",
        "How do you handle unexpected constraints?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Ensure Code Readability in Binary Search?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Code Readability" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you make Binary Search code readable?' to test coding style.",
        "Follow-up: 'What naming conventions do you use?'",
        "Deeper: 'How do you structure code?'"
      ]},
      { type: 'subheading', en: "Code Readability" },
      { type: 'ul', items: [
        "Names: Use clear variables (low, high, mid).",
        "Structure: Single loop, clear if-else conditions.",
        "Comments: Explain boundary updates, mid-point calculation.",
        "LC278 Example: Comment isBadVersion checks, boundary logic."
      ]},
      { type: 'codeBlock', codeBlock: `
function firstBadVersion(n) {
  let low = 1, high = n; // Initialize range
  while (low < high) {
    let mid = Math.floor(low + (high - low) / 2); // Avoid overflow
    if (isBadVersion(mid)) high = mid; // Search left for first bad
    else low = mid + 1; // Search right
  }
  return low; // First bad version
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Comment boundary updates for clarity."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle unexpected constraints?",
        "How do you summarize Binary Search learnings?"
      ] }
    ]
  },
   {
    q: { en: "What is the Approach to Solve LC35 (Search Insert Position)?" },
    level: 'fresher',
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: LC35 Approach" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you solve LC35?' to test Binary Search adaptation.",
        "Follow-up: 'What’s the complexity?'",
        "Deeper: 'How do you handle duplicates?'"
      ]},
      { type: 'subheading', en: "LC35 Approach" },
      { type: 'ul', items: [
        "Problem: Find target in sorted array or return insertion index.",
        "Binary Search: Halve search space, return low when target not found.",
        "Time: O(log n), Space: O(1) iterative.",
        "Key: low > high gives insertion point (low)."
      ]},
      { type: 'codeBlock', codeBlock: `
function searchInsert(nums, target) {
  let low = 0, high = nums.length - 1;
  while (low <= high) {
    let mid = Math.floor(low + (high - low) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return low; // Insertion point
}
      ` },
      { type: 'ascii', ascii: `
nums=[1,3,5,6], target=2
[1,3,5,6] -> mid=1, nums[1]=3 > 2 -> high=0
[1] -> mid=0, nums[0]=1 < 2 -> low=1
Output: 1 (insert at index 1)
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Practice LC35 for insertion logic."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle duplicates in LC35?",
        "How do you handle edge cases in LC35?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Duplicates in LC35?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: LC35 Duplicates" },
      { type: 'ul', items: [
        "The interviewer might ask 'What if LC35 has duplicates?' to test adaptability.",
        "Follow-up: 'How do you return first insertion point?'",
        "Deeper: 'How does it affect complexity?'"
      ]},
      { type: 'subheading', en: "LC35 Duplicate Handling" },
      { type: 'ul', items: [
        "LC35 assumes unique elements, but variation asks for first insertion point.",
        "Modify Binary Search: If nums[mid] === target, search left for first position.",
        "Time: O(log n), Space: O(1).",
        "Key: Return low when nums[mid] >= target."
      ]},
      { type: 'codeBlock', codeBlock: `
function searchInsertFirst(nums, target) {
  let low = 0, high = nums.length - 1;
  while (low <= high) {
    let mid = Math.floor(low + (high - low) / 2);
    if (nums[mid] >= target) high = mid - 1;
    else low = mid + 1;
  }
  return low;
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Practice first insertion for LC35 variations."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle edge cases in LC35?",
        "How do you optimize LC35?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Edge Cases in LC35?" },
    level: 'fresher',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: LC35 Edge Cases" },
      { type: 'ul', items: [
        "The interviewer might ask 'What edge cases do you handle in LC35?' to test robustness.",
        "Follow-up: 'What if array is empty?'",
        "Deeper: 'What if target is outside range?'"
      ]},
      { type: 'subheading', en: "LC35 Edge Cases" },
      { type: 'ul', items: [
        "Empty Array: Return 0 (insert at start).",
        "Single Element: Return 0 or 1 based on comparison.",
        "Target Outside Range: Return 0 (target < nums[0]) or nums.length (target > nums[n-1]).",
        "n ≤ 10^4: Ensures O(log n) is fast."
      ]},
      { type: 'codeBlock', codeBlock: `
function searchInsert(nums, target) {
  if (nums.length === 0) return 0; // Edge case
  // Proceed with binary search
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Handle empty array first in LC35."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you optimize LC35?",
        "What are follow-up questions for LC35?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Optimize LC35?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: LC35 Optimization" },
      { type: 'ul', items: [
        "The interviewer might ask 'Can you optimize LC35?' to test efficiency.",
        "Follow-up: 'Is O(log n) optimal?'",
        "Deeper: 'How do you handle large inputs?'"
      ]},
      { type: 'subheading', en: "LC35 Optimization" },
      { type: 'ul', items: [
        "Iterative: O(1) space vs. O(log n) recursive.",
        "Early Exit: Return mid on nums[mid] === target.",
        "Mid-Point: Use low + (high - low) / 2 to avoid overflow.",
        "O(log n) is optimal for comparison-based search."
      ]},
      { type: 'codeBlock', codeBlock: `
function searchInsert(nums, target) {
  let low = 0, high = nums.length - 1;
  while (low <= high) {
    let mid = Math.floor(low + (high - low) / 2);
    if (nums[mid] === target) return mid; // Early exit
    if (nums[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return low;
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Use early exit for LC35 in interviews."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What are follow-up questions for LC35?",
        "How do you test LC35 solutions?"
      ] }
    ]
  },
  {
    q: { en: "What Are Follow-Up Questions for LC35?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: LC35 Follow-Ups" },
      { type: 'ul', items: [
        "The interviewer might ask 'What follow-ups do you expect for LC35?' to test preparedness.",
        "Follow-up: 'How do you handle duplicates?'",
        "Deeper: 'What if array is rotated?'"
      ]},
      { type: 'subheading', en: "LC35 Follow-Up Questions" },
      { type: 'ul', items: [
        "Duplicates: Return first insertion point (modified LC34).",
        "Rotated Array: Handle insertion in rotated sorted array (LC33 variation).",
        "Count Smaller: Find number of elements < target.",
        "Range Insertion: Insert into range of duplicates."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Practice LC34 for LC35 duplicate follow-ups."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you test LC35 solutions?",
        "What is the approach to solve LC153?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Test LC35 Solutions?" },
    level: 'fresher',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: LC35 Testing" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you test your LC35 solution?' to test thoroughness.",
        "Follow-up: 'What test cases do you prioritize?'",
        "Deeper: 'How do you ensure correctness?'"
      ]},
      { type: 'subheading', en: "LC35 Testing" },
      { type: 'ul', items: [
        "Test small inputs: [1,3,5] target=2 → 1, target=3 → 1.",
        "Test edge cases: [] → 0, [1] → 0 or 1.",
        "Test boundaries: Target < nums[0] → 0, target > nums[n-1] → n.",
        "Verify: Correct insertion index."
      ]},
      { type: 'ascii', ascii: `
nums=[1,3,5], target=2
low=0, high=2 -> mid=1, nums[1]=3 > 2 -> high=0
low=0, high=0 -> mid=0, nums[0]=1 < 2 -> low=1
Output: 1
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Test boundary targets for LC35."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What is the approach to solve LC153?",
        "How do you handle pivot detection?"
      ] }
    ]
  },
  // LC153: Find Minimum in Rotated Sorted Array
  {
    q: { en: "What is the Approach to Solve LC153 (Find Minimum in Rotated Sorted Array)?" },
    level: 'intermediate',
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: LC153 Approach" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you solve LC153?' to test rotated array handling.",
        "Follow-up: 'What’s the complexity?'",
        "Deeper: 'How do you find the pivot?'"
      ]},
      { type: 'subheading', en: "LC153 Approach" },
      { type: 'ul', items: [
        "Problem: Find minimum in rotated sorted array.",
        "Binary Search: Find pivot (where nums[mid] > nums[high]), minimum is next.",
        "Time: O(log n), Space: O(1).",
        "Key: If nums[mid] > nums[high], pivot in right half; else in left."
      ]},
      { type: 'codeBlock', codeBlock: `
function findMin(nums) {
  let low = 0, high = nums.length - 1;
  while (low < high) {
    let mid = Math.floor(low + (high - low) / 2);
    if (nums[mid] > nums[high]) low = mid + 1;
    else high = mid;
  }
  return nums[low];
}
      ` },
      { type: 'ascii', ascii: `
nums=[4,5,6,7,0,1,2]
low=0, high=6 -> mid=3, nums[3]=7 > nums[6]=2 -> low=4
low=4, high=6 -> mid=5, nums[5]=1 < nums[6]=2 -> high=5
low=4, high=5 -> mid=4, nums[4]=0 < nums[5]=1 -> high=4
Output: 0
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Practice LC153 for pivot detection."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle pivot detection in LC153?",
        "How do you handle edge cases in LC153?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Pivot Detection in LC153?" },
    level: 'intermediate',
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: LC153 Pivot Detection" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you find the pivot in LC153?' to test rotated array logic.",
        "Follow-up: 'Why compare with nums[high]?'",
        "Deeper: 'How do you handle no rotation?'"
      ]},
      { type: 'subheading', en: "LC153 Pivot Detection" },
      { type: 'ul', items: [
        "Pivot: Point where nums[i] > nums[i+1] (minimum).",
        "Logic: If nums[mid] > nums[high], pivot in right half (low=mid+1).",
        "If nums[mid] <= nums[high], pivot in left half or at mid (high=mid).",
        "No Rotation: nums[0] is minimum (handled by low == high)."
      ]},
      { type: 'ascii', ascii: `
nums=[4,5,6,7,0,1,2]
[4,5,6,7,0,1,2] -> mid=3, nums[3]=7 > nums[6]=2 -> low=4
[0,1,2] -> mid=5, nums[5]=1 < nums[6]=2 -> high=5
Pivot at index 4 (nums[4]=0)
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Explain pivot logic with nums[high] comparison."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle edge cases in LC153?",
        "How do you optimize LC153?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Edge Cases in LC153?" },
    level: 'fresher',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: LC153 Edge Cases" },
      { type: 'ul', items: [
        "The interviewer might ask 'What edge cases do you handle in LC Binary Search & Search-on-Answer Pattern FAQs (Batch 2) - Continued to test robustness.",
        "Follow-up: 'What if array is not rotated?'",
        "Deeper: 'What if array has one element?'"
      ]},
      { type: 'subheading', en: "LC153 Edge Cases" },
      { type: 'ul', items: [
        "Single Element: Return nums[0].",
        "No Rotation: Return nums[0] (nums[0] < nums[n-1]).",
        "Two Elements: Return Math.min(nums[0], nums[1]).",
        "n ≤ 500: Ensures O(log n) is fast."
      ]},
      { type: 'codeBlock', codeBlock: `
function findMin(nums) {
  if (nums.length === 1) return nums[0]; // Edge case
  if (nums[0] < nums[nums.length - 1]) return nums[0]; // No rotation
  // Proceed with binary search
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Handle single element first in LC153."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you optimize LC153?",
        "What are follow-up questions for LC153?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Optimize LC153?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: LC153 Optimization" },
      { type: 'ul', items: [
        "The interviewer might ask 'Can you optimize LC153?' to test efficiency.",
        "Follow-up: 'Is O(log n) optimal?'",
        "Deeper: 'How do you minimize comparisons?'"
      ]},
      { type: 'subheading', en: "LC153 Optimization" },
      { type: 'ul', items: [
        "Iterative: O(1) space vs. O(log n) recursive.",
        "Minimize Comparisons: Compare nums[mid] with nums[high].",
        "Early Exit: Check no rotation (nums[0] < nums[n-1]).",
        "O(log n) is optimal for finding pivot."
      ]},
      { type: 'codeBlock', codeBlock: `
function findMin(nums) {
  if (nums[0] < nums[nums.length - 1]) return nums[0]; // Early exit
  let low = 0, high = nums.length - 1;
  while (low < high) {
    let mid = Math.floor(low + (high - low) / 2);
    if (nums[mid] > nums[high]) low = mid + 1;
    else high = mid;
  }
  return nums[low];
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Check no rotation early in LC153."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What are follow-up questions for LC153?",
        "How do you test LC153 solutions?"
      ] }
    ]
  },
  {
    q: { en: "What Are Follow-Up Questions for LC153?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: LC153 Follow-Ups" },
      { type: 'ul', items: [
        "The interviewer might ask 'What follow-ups do you expect for LC153?' to test preparedness.",
        "Follow-up: 'Can you find the pivot index?'",
        "Deeper: 'What if duplicates are allowed?'"
      ]},
      { type: 'subheading', en: "LC153 Follow-Up Questions" },
      { type: 'ul', items: [
        "Pivot Index: Return index of minimum (same logic, return low).",
        "Duplicates: Handle duplicates (LC154, requires O(n) worst case).",
        "Search Target: Find target in rotated array (LC33).",
        "Count Rotations: Number of times array was rotated."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Practice LC33 for LC153 follow-ups."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you test LC153 solutions?",
        "What is the approach to solve LC33?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Test LC153 Solutions?" },
    level: 'fresher',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: LC153 Testing" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you test your LC153 solution?' to test thoroughness.",
        "Follow-up: 'What test cases do you prioritize?'",
        "Deeper: 'How do you ensure correctness?'"
      ]},
      { type: 'subheading', en: "LC153 Testing" },
      { type: 'ul', items: [
        "Test small inputs: [4,5,6,7,0,1,2] → 0, [3,4,5,1,2] → 1.",
        "Test edge cases: [1] → 1, [1,2] → 1, [2,1] → 1.",
        "Test no rotation: [1,2,3,4] → 1.",
        "Verify: Correct minimum returned."
      ]},
      { type: 'ascii', ascii: `
nums=[4,5,6,7,0,1,2]
low=0, high=6 -> mid=3, nums[3]=7 > nums[6]=2 -> low=4
Output: 0
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Test no rotation case for LC153."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What is the approach to solve LC33?",
        "How do you handle duplicates in rotated arrays?"
      ] }
    ]
  },
  // LC33: Search in Rotated Sorted Array
  {
    q: { en: "What is the Approach to Solve LC33 (Search in Rotated Sorted Array)?" },
    level: 'intermediate',
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: LC33 Approach" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you solve LC33?' to test complex Binary Search.",
        "Follow-up: 'What’s the complexity?'",
        "Deeper: 'How do you handle the pivot?'"
      ]},
      { type: 'subheading', en: "LC33 Approach" },
      { type: 'ul', items: [
        "Problem: Find target in rotated sorted array, return index or -1.",
        "Binary Search: Find pivot, search in sorted half.",
        "Time: O(log n), Space: O(1).",
        "Key: Check if left or right half is sorted, search accordingly."
      ]},
      { type: 'codeBlock', codeBlock: `
function search(nums, target) {
  let low = 0, high = nums.length - 1;
  while (low <= high) {
    let mid = Math.floor(low + (high - low) / 2);
    if (nums[mid] === target) return mid;
    if (nums[low] <= nums[mid]) { // Left half sorted
      if (nums[low] <= target && target < nums[mid]) high = mid - 1;
      else low = mid + 1;
    } else { // Right half sorted
      if (nums[mid] < target && target <= nums[high]) low = mid + 1;
      else high = mid - 1;
    }
  }
  return -1;
}
      ` },
      { type: 'ascii', ascii: `
nums=[4,5,6,7,0,1,2], target=0
low=0, high=6 -> mid=3, nums[3]=7, left sorted, target < nums[0]=4 -> low=4
low=4, high=6 -> mid=5, nums[5]=1 > 0 -> high=4
low=4, high=4 -> mid=4, nums[4]=0 (found)
Output: 4
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Practice LC33 for rotated array search."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle duplicates in LC33?",
        "How do you handle edge cases in LC33?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Duplicates in LC33?" },
    level: 'senior',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: LC33 Duplicates" },
      { type: 'ul', items: [
        "The interviewer might ask 'What if LC33 has duplicates?' to test advanced handling.",
        "Follow-up: 'How does it affect complexity?'",
        "Deeper: 'How do you solve LC81?'"
      ]},
      { type: 'subheading', en: "LC33 Duplicate Handling (LC81)" },
      { type: 'ul', items: [
        "LC33 assumes unique elements; LC81 allows duplicates.",
        "Problem: Duplicates make sorted half detection ambiguous (e.g., [1,1,1,2,1]).",
        "Solution: If nums[low] == nums[mid] == nums[high], skip low/high, linear check worst case.",
        "Time: O(log n) average, O(n) worst case; Space: O(1)."
      ]},
      { type: 'codeBlock', codeBlock: `
function searchDuplicates(nums, target) {
  let low = 0, high = nums.length - 1;
  while (low <= high) {
    let mid = Math.floor(low + (high - low) / 2);
    if (nums[mid] === target) return true;
    if (nums[low] === nums[mid] && nums[mid] === nums[high]) {
      low++; high--;
    } else if (nums[low] <= nums[mid]) {
      if (nums[low] <= target && target < nums[mid]) high = mid - 1;
      else low = mid + 1;
    } else {
      if (nums[mid] < target && target <= nums[high]) low = mid + 1;
      else high = mid - 1;
    }
  }
  return false;
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Practice LC81 for duplicate handling."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle edge cases in LC33?",
        "How do you optimize LC33?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Edge Cases in LC33?" },
    level: 'fresher',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: LC33 Edge Cases" },
      { type: 'ul', items: [
        "The interviewer might ask 'What edge cases do you handle in LC33?' to test robustness.",
        "Follow-up: 'What if array is not rotated?'",
        "Deeper: 'What if target is not present?'"
      ]},
      { type: 'subheading', en: "LC33 Edge Cases" },
      { type: 'ul', items: [
        "Single Element: Return 0 if nums[0] === target, else -1.",
        "No Rotation: Standard Binary Search (nums[0] < nums[n-1]).",
        "Target Not Present: Return -1 (low > high).",
        "n ≤ 5000: Ensures O(log n) is fast."
      ]},
      { type: 'codeBlock', codeBlock: `
function search(nums, target) {
  if (nums.length === 1) return nums[0] === target ? 0 : -1; // Edge case
  // Proceed with binary search
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Handle single element first in LC33."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you optimize LC33?",
        "What are follow-up questions for LC33?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Optimize LC33?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: LC33 Optimization" },
      { type: 'ul', items: [
        "The interviewer might ask 'Can you optimize LC33?' to test efficiency.",
        "Follow-up: 'Is O(log n) optimal?'",
        "Deeper: 'How do you minimize comparisons?'"
      ]},
      { type: 'subheading', en: "LC33 Optimization" },
      { type: 'ul', items: [
        "Iterative: O(1) space vs. O(log n) recursive.",
        "Early Exit: Return mid on nums[mid] === target.",
        "Sorted Half Check: Use nums[low] <= nums[mid] to detect sorted half.",
        "O(log n) is optimal for unique elements."
      ]},
      { type: 'codeBlock', codeBlock: `
function search(nums, target) {
  let low = 0, high = nums.length - 1;
  while (low <= high) {
    let mid = Math.floor(low + (high - low) / 2);
    if (nums[mid] === target) return mid; // Early exit
    if (nums[low] <= nums[mid]) {
      if (nums[low] <= target && target < nums[mid]) high = mid - 1;
      else low = mid + 1;
    } else {
      if (nums[mid] < target && target <= nums[high]) low = mid + 1;
      else high = mid - 1;
    }
  }
  return -1;
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Use early exit for LC33 in interviews."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What are follow-up questions for LC33?",
        "How do you test LC33 solutions?"
      ] }
    ]
  },
  {
    q: { en: "What Are Follow-Up Questions for LC33?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: LC33 Follow-Ups" },
      { type: 'ul', items: [
        "The interviewer might ask 'What follow-ups do you expect for LC33?' to test preparedness.",
        "Follow-up: 'How do you handle duplicates?'",
        "Deeper: 'What if you need pivot index?'"
      ]},
      { type: 'subheading', en: "LC33 Follow-Up Questions" },
      { type: 'ul', items: [
        "Duplicates: Solve LC81 (O(n) worst case).",
        "Pivot Index: Find pivot like LC153, then search.",
        "Multiple Rotations: Handle multiple rotation points.",
        "Count Elements: Count elements in range in rotated array."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Practice LC81 for LC33 duplicate follow-ups."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you test LC33 solutions?",
        "What is the approach to solve LC875?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Test LC33 Solutions?" },
    level: 'fresher',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: LC33 Testing" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you test your LC33 solution?' to test thoroughness.",
        "Follow-up: 'What test cases do you prioritize?'",
        "Deeper: 'How do you ensure correctness?'"
      ]},
      { type: 'subheading', en: "LC33 Testing" },
      { type: 'ul', items: [
        "Test small inputs: [4,5,6,7,0,1,2] target=0 → 4, target=3 → -1.",
        "Test edge cases: [1] → 0 or -1, [2,1] → 0 or 1.",
        "Test no rotation: [1,2,3] target=2 → 1.",
        "Verify: Correct index or -1."
      ]},
      { type: 'ascii', ascii: `
nums=[4,5,6,7,0,1,2], target=0
low=0, high=6 -> mid=3, left sorted, target < nums[0] -> low=4
Output: 4
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Test no rotation case for LC33."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What is the approach to solve LC875?",
        "How do you handle Search-on-Answer boundaries?"
      ] }
    ]
  },
  // LC875: Koko Eating Bananas
  {
    q: { en: "What is the Approach to Solve LC875 (Koko Eating Bananas)?" },
    level: 'intermediate',
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: LC875 Approach" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you solve LC875?' to test Search-on-Answer.",
        "Follow-up: 'What’s the complexity?'",
        "Deeper: 'How do you choose boundaries?'"
      ]},
      { type: 'subheading', en: "LC875 Approach" },
      { type: 'ul', items: [
        "Problem: Find min speed k to eat all bananas in h hours.",
        "Search-on-Answer: Binary Search on speed [1, max(piles)].",
        "Time: O(n log m), where n is piles.length, m is max pile.",
        "Key: If canEat(k) > h, speed too slow (low=mid+1); else high=mid."
      ]},
      { type: 'codeBlock', codeBlock: `
function minEatingSpeed(piles, h) {
  let low = 1, high = Math.max(...piles);
  while (low < high) {
    let mid = Math.floor(low + (high - low) / 2);
    let hours = piles.reduce((sum, pile) => sum + Math.ceil(pile / mid), 0);
    if (hours > h) low = mid + 1;
    else high = mid;
  }
  return low;
}
      ` },
      { type: 'ascii', ascii: `
piles=[3,6,7,11], h=8
low=1, high=11 -> mid=6, hours=10 > 8 -> low=7
low=7, high=11 -> mid=9, hours=8 <= 8 -> high=9
Output: 9
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Practice LC875 for Search-on-Answer."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle Search-on-Answer boundaries in LC875?",
        "How do you handle edge cases in LC875?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Search-on-Answer Boundaries in LC875?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: LC875 Boundaries" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you choose boundaries in LC875?' to test logic.",
        "Follow-up: 'Why low=1, high=max(piles)?'",
        "Deeper: 'How do you ensure minimum speed?'"
      ]},
      { type: 'subheading', en: "LC875 Boundary Selection" },
      { type: 'ul', items: [
        "Boundaries: low=1 (min speed), high=max(piles) (max possible speed).",
        "Key: If hours > h, low=mid+1 (speed too slow).",
        "If hours <= h, high=mid (speed sufficient, try lower).",
        "Exit: low == high gives minimum speed."
      ]},
      { type: 'codeBlock', codeBlock: `
function minEatingSpeed(piles, h) {
  let low = 1, high = Math.max(...piles);
  while (low < high) {
    let mid = Math.floor(low + (high - low) / 2);
    let hours = piles.reduce((sum, pile) => sum + Math.ceil(pile / mid), 0);
    if (hours > h) low = mid + 1;
    else high = mid;
  }
  return low;
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Explain boundary logic for LC875."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle edge cases in LC875?",
        "How do you optimize LC875?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Edge Cases in LC875?" },
    level: 'fresher',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: LC875 Edge Cases" },
      { type: 'ul', items: [
        "The interviewer might ask 'What edge cases do you handle in LC875?' to test robustness.",
        "Follow-up: 'What if h equals piles.length?'",
        "Deeper: 'What if piles has one element?'"
      ]},
      { type: 'subheading', en: "LC875 Edge Cases" },
      { type: 'ul', items: [
        "h == piles.length: Return max(piles) (one pile per hour).",
        "Single Pile: Return Math.ceil(piles[0] / h).",
        "h > sum(piles): Return 1 (min speed).",
        "n ≤ 10^4, piles[i] ≤ 10^9: Ensures O(n log m) is feasible."
      ]},
      { type: 'codeBlock', codeBlock: `
function minEatingSpeed(piles, h) {
  if (h === piles.length) return Math.max(...piles); // Edge case
  // Proceed with binary search
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Handle h == piles.length first in LC875."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you optimize LC875?",
        "What are follow-up questions for LC875?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Optimize LC875?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: LC875 Optimization" },
      { type: 'ul', items: [
        "The interviewer might ask 'Can you optimize LC875?' to test efficiency.",
        "Follow-up: 'Can you reduce time complexity?'",
        "Deeper: 'How do you optimize the check function?'"
      ]},
      { type: 'subheading', en: "LC875 Optimization" },
      { type: 'ul', items: [
        "Iterative: O(1) space vs. O(log m) recursive.",
        "Optimize Check: Precompute sum for small piles, cache results.",
        "Boundary Tuning: Start low = Math.ceil(sum(piles) / h) for tighter bound.",
        "O(n log m) is optimal for Search-on-Answer."
      ]},
      { type: 'codeBlock', codeBlock: `
function minEatingSpeed(piles, h) {
  let low = Math.ceil(piles.reduce((a, b) => a + b, 0) / h);
  let high = Math.max(...piles);
  while (low < high) {
    let mid = Math.floor(low + (high - low) / 2);
    let hours = piles.reduce((sum, pile) => sum + Math.ceil(pile / mid), 0);
    if (hours > h) low = mid + 1;
    else high = mid;
  }
  return low;
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Use tighter low bound for LC875."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What are follow-up questions for LC875?",
        "How do you test LC875 solutions?"
      ] }
    ]
  },
  {
    q: { en: "What Are Follow-Up Questions for LC875?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: LC875 Follow-Ups" },
      { type: 'ul', items: [
        "The interviewer might ask 'What follow-ups do you expect for LC875?' to test preparedness.",
        "Follow-up: 'What if piles have weights?'",
        "Deeper: 'What if multiple monkeys?'"
      ]},
      { type: 'subheading', en: "LC875 Follow-Up Questions" },
      { type: 'ul', items: [
        "Weighted Piles: Adjust hours calculation for weights.",
        "Multiple Monkeys: Divide piles among k monkeys, minimize max speed.",
        "Max Hours: Find max hours for given speed.",
        "Dynamic Piles: Handle changing pile sizes."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Practice multiple monkeys variation for LC875."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you test LC875 solutions?",
        "How do you handle monotonicity in Search-on-Answer?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Test LC875 Solutions?" },
    level: 'fresher',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: LC875 Testing" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you test your LC875 solution?' to test thoroughness.",
        "Follow-up: 'What test cases do you prioritize?'",
        "Deeper: 'How do you verify minimum speed?'"
      ]},
      { type: 'subheading', en: "LC875 Testing" },
      { type: 'ul', items: [
        "Test small inputs: [3,6,7,11] h=8 → 4, [30,11,23,4,20] h=5 → 30.",
        "Test edge cases: [30] h=1 → 30, h=30 → 1.",
        "Test boundary: h == piles.length → max(piles).",
        "Verify: Minimum speed where hours <= h."
      ]},
      { type: 'ascii', ascii: `
piles=[3,6,7,11], h=8
low=1, high=11 -> mid=6, hours=10 > 8 -> low=7
Output: 4
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Test h == piles.length for LC875."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle monotonicity in Search-on-Answer?",
        "How do you profile Binary Search performance?"
      ] }
    ]
  },
  // Advanced Concepts
  {
    q: { en: "How Do You Handle Monotonicity in Search-on-Answer?" },
    level: 'senior',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Monotonicity" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you ensure monotonicity in Search-on-Answer?' to test understanding.",
        "Follow-up: 'How do you define the check function?'",
        "Deeper: 'How do you handle non-monotonic cases?'"
      ]},
      { type: 'subheading', en: "Monotonicity in Search-on-Answer" },
      { type: 'ul', items: [
        "Monotonicity: Answer feasibility (e.g., hours in LC875) decreases as value increases.",
        "Check Function: Returns true/false (LC278) or value (LC875 hours).",
        "Non-Monotonic: Requires different approach (e.g., ternary search).",
        "Examples: LC278 (isBadVersion), LC875 (hours <= h)."
      ]},
      { type: 'ascii', ascii: `
LC875: piles=[3,6,7,11], h=8
k=3 -> hours=15 > h (false)
k=4 -> hours=8 <= h (true)
Monotonic: Higher k -> fewer hours
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Verify monotonicity in Search-on-Answer."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you profile Binary Search performance?",
        "How do you handle duplicates in rotated arrays?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Profile Binary Search Performance?" },
    level: 'senior',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Performance Profiling" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you profile Binary Search performance?' to test optimization.",
        "Follow-up: 'What metrics do you track?'",
        "Deeper: 'How do you optimize bottlenecks?'"
      ]},
      { type: 'subheading', en: "Performance Profiling" },
      { type: 'ul', items: [
        "Metrics: Number of iterations (O(log n)), check function cost (LC875).",
        "Tools: Console.time, profilers for iteration count.",
        "LC875: Profile hours calculation (O(n) per iteration).",
        "Optimize: Tighter boundaries, cache check results."
      ]},
      { type: 'codeBlock', codeBlock: `
function minEatingSpeed(piles, h) {
  console.time('minEatingSpeed');
  let low = 1, high = Math.max(...piles);
  while (low < high) {
    let mid = Math.floor(low + (high - low) / 2);
    let hours = piles.reduce((sum, pile) => sum + Math.ceil(pile / mid), 0);
    console.log(\`Speed=\${mid}, hours=\${hours}\`);
    if (hours > h) low = mid + 1;
    else high = mid;
  }
  console.timeEnd('minEatingSpeed');
  return low;
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Log iterations for profiling."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle duplicates in rotated arrays?",
        "How do you tune Search-on-Answer boundaries?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Duplicates in Rotated Arrays?" },
    level: 'senior',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Rotated Array Duplicates" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you handle duplicates in rotated arrays?' to test advanced logic.",
        "Follow-up: 'How does it affect complexity?'",
        "Deeper: 'How do you optimize LC81?'"
      ]},
      { type: 'subheading', en: "Rotated Array Duplicates" },
      { type: 'ul', items: [
        "Problem: LC81 extends LC33 with duplicates.",
        "Issue: nums[low] == nums[mid] == nums[high] makes sorted half unclear.",
        "Solution: Skip duplicates (low++, high--), then check sorted half.",
        "Time: O(log n) average, O(n) worst case; Space: O(1)."
      ]},
      { type: 'codeBlock', codeBlock: `
function searchDuplicates(nums, target) {
  let low = 0, high = nums.length - 1;
  while (low <= high) {
    let mid = Math.floor(low + (high - low) / 2);
    if (nums[mid] === target) return true;
    if (nums[low] === nums[mid] && nums[mid] === nums[high]) {
      low++; high--;
    } else if (nums[low] <= nums[mid]) {
      if (nums[low] <= target && target < nums[mid]) high = mid - 1;
      else low = mid + 1;
    } else {
      if (nums[mid] < target && target <= nums[high]) low = mid + 1;
      else high = mid - 1;
    }
  }
  return false;
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Discuss O(n) worst case for LC81."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you tune Search-on-Answer boundaries?",
        "How do you compare Binary Search to other patterns?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Tune Search-on-Answer Boundaries?" },
    level: 'senior',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Boundary Tuning" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you optimize boundaries in Search-on-Answer?' to test efficiency.",
        "Follow-up: 'How do you choose initial bounds?'",
        "Deeper: 'How do you tighten bounds?'"
      ]},
      { type: 'subheading', en: "Boundary Tuning" },
      { type: 'ul', items: [
        "Initial Bounds: low=min feasible (e.g., 1 in LC875), high=max feasible (max(piles)).",
        "Tighter Low: LC875 uses Math.ceil(sum(piles) / h).",
        "Tighter High: Use problem constraints (e.g., LC1011 max weight).",
        "Impact: Reduces iterations, improves O(log R)."
      ]},
      { type: 'codeBlock', codeBlock: `
function minEatingSpeed(piles, h) {
  let low = Math.ceil(piles.reduce((a, b) => a + b, 0) / h); // Tighter low
  let high = Math.max(...piles);
  // Proceed with binary search
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Calculate tighter low bound in Search-on-Answer."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you compare Binary Search to other patterns?",
        "What are real-world applications of Binary Search?"
      ] }
    ]
  },
  // Cross-Cutting Concepts
  {
    q: { en: "How Do You Compare Binary Search to Other Patterns?" },
    level: 'senior',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Pattern Comparison" },
      { type: 'ul', items: [
        "The interviewer might ask 'How does Binary Search compare to other patterns?' to test pattern knowledge.",
        "Follow-up: 'When is Binary Search preferred?'",
        "Deeper: 'How do you choose between patterns?'"
      ]},
      { type: 'subheading', en: "Pattern Comparison" },
      { type: 'ul', items: [
        "Binary Search: O(log n) for sorted/monotonic data (LC704, LC278).",
        "Backtracking: O(n!) or O(2^n) for combinatorial (LC46, LC78).",
        "Two-Pointer: O(n) for linear problems (e.g., sum pairs).",
        "Choose Binary Search: Sorted arrays, monotonic functions."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Compare to linear search in interviews."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What are real-world applications of Binary Search?",
        "How do you handle iterative vs. recursive trade-offs?"
      ] }
    ]
  },
  {
    q: { en: "What Are Real-World Applications of Binary Search?" },
    level: 'senior',
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Real-World Applications" },
      { type: 'ul', items: [
        "The interviewer might ask 'Where is Binary Search used in real-world systems?' to test practical knowledge.",
        "Follow-up: 'How does it scale in production?'",
        "Deeper: 'How do you optimize for real-world use?'"
      ]},
      { type: 'subheading', en: "Real-World Applications" },
      { type: 'ul', items: [
        "Databases: Index lookups for sorted data.",
        "Version Control: Find first bad commit (LC278).",
        "Resource Allocation: Optimize capacity (LC875, LC1011).",
        "Search Systems: Autocomplete, sorted list queries."
      ]},
      { type: 'ascii', ascii: `
Database Index:
[1,3,5,7,9] -> Query=5
Binary Search -> Index 2
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Relate Binary Search to database lookups."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle iterative vs. recursive trade-offs?",
        "How do you conduct mock interviews for Binary Search?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Iterative vs. Recursive Trade-Offs in Binary Search?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Iterative vs. Recursive" },
      { type: 'ul', items: [
        "The interviewer might ask 'Iterative or recursive Binary Search?' to test trade-offs.",
        "Follow-up: 'What are the pros and cons?'",
        "Deeper: 'When is one better?'"
      ]},
      { type: 'subheading', en: "Iterative vs. Recursive Trade-Offs" },
      { type: 'ul', items: [
        "Iterative: O(1) space, no stack overflow, simpler for LC704, LC35.",
        "Recursive: O(log n) stack space, clearer for LC33, LC153.",
        "Iterative Better: Simple problems, production code.",
        "Recursive Better: Complex conditions (rotated arrays)."
      ]},
      { type: 'codeBlock', codeBlock: `
function findMinRecursive(nums, low, high) {
  if (low === high) return nums[low];
  let mid = Math.floor(low + (high - low) / 2);
  if (nums[mid] > nums[high]) return findMinRecursive(nums, mid + 1, high);
  return findMinRecursive(nums, low, mid);
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Use iterative for FAANG interviews."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you conduct mock interviews for Binary Search?",
        "How do you handle stress in Binary Search interviews?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Conduct Mock Interviews for Binary Search?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Mock Interviews" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you simulate FAANG interviews?' to test preparation.",
        "Follow-up: 'How do you handle follow-ups?'",
        "Deeper: 'How do you mimic FAANG conditions?'"
      ]},
      { type: 'subheading', en: "Mock Interviews" },
      { type: 'ul', items: [
        "Time: 30-45 min per problem (LC704, LC35, LC153, LC33, LC875).",
        "Explain: Verbalize boundaries, mid-point, pivot logic.",
        "Whiteboard: Draw search space, pivot for LC33, LC153.",
        "Peers: Practice with hints (e.g., boundary tuning, duplicates)."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Record mock sessions for LC33, LC875."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle stress in Binary Search interviews?",
        "How do you explain complex Binary Search logic?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Stress in Binary Search Interviews?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Stress Handling" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you stay calm in Binary Search interviews?' to test composure.",
        "Follow-up: 'What if you get stuck?'",
        "Deeper: 'How do you recover from mistakes?'"
      ]},
      { type: 'subheading', en: "Stress Handling" },
      { type: 'ul', items: [
        "Break down: Clarify sorted/monotonic, boundaries, mid-point.",
        "If stuck: Fall back to linear search, optimize to Binary Search.",
        "Verbalize: Explain low, high, mid to stay focused.",
        "Practice: Timed sessions (30 min) for confidence."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Breathe and clarify boundaries to reduce stress."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you explain complex Binary Search logic?",
        "How do you handle edge case strategies?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Explain Complex Binary Search Logic in Interviews?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Complex Logic" },
      { type: 'ul', items: [
        "The interviewer might ask 'Can you explain LC33 or LC875 clearly?' to test communication.",
        "Follow-up: 'How do you simplify pivot or boundary logic?'",
        "Deeper: 'How do you handle follow-ups?'"
      ]},
      { type: 'subheading', en: "Explaining Complex Logic" },
      { type: 'ul', items: [
        "LC33: Explain pivot detection, sorted half search.",
        "LC875: Explain speed range, hours check, monotonicity.",
        "Visualize: Draw array (LC33), range (LC875).",
        "Follow-ups: Duplicates (LC81), boundary tuning."
      ]},
      { type: 'ascii', ascii: `
LC33: nums=[4,5,6,7,0,1,2], target=0
[4,5,6,7,0,1,2] -> mid=3, left sorted, target < nums[0] -> low=4
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Use diagrams for LC33, LC875 explanations."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle edge case strategies?",
        "How do you handle follow-up questions in FAANG interviews?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Edge Case Strategies in Binary Search?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Edge Case Strategies" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you handle edge cases in Binary Search?' to test robustness.",
        "Follow-up: 'What edge cases are common?'",
        "Deeper: 'How do you test edge cases?'"
      ]},
      { type: 'subheading', en: "Edge Case Strategies" },
      { type: 'ul', items: [
        "Empty Inputs: LC35 ([] → 0), LC704 ([] → -1).",
        "Single Element: LC33, LC153 (check nums[0]).",
        "No Rotation: LC153, LC33 (standard Binary Search).",
        "Test: Run small inputs, verify boundaries."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "List edge cases before coding."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle follow-up questions in FAANG interviews?",
        "How do you summarize Binary Search learnings?"
      ] }
    ]
  },
  {
    q: { en: "What is the Approach to Solve LC1011 (Capacity to Ship Packages Within D Days)?" },
    level: 'intermediate',
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: LC1011 Approach" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you solve LC1011?' to test Search-on-Answer.",
        "Follow-up: 'What’s the complexity?'",
        "Deeper: 'How do you determine capacity bounds?'"
      ]},
      { type: 'subheading', en: "LC1011 Approach" },
      { type: 'ul', items: [
        "Problem: Find minimum capacity to ship weights in D days.",
        "Search-on-Answer: Binary Search on capacity [max(weights), sum(weights)].",
        "Time: O(n log S), where n is weights.length, S is sum(weights).",
        "Key: If days needed > D, low=mid+1; else high=mid."
      ]},
      { type: 'codeBlock', codeBlock: `
function shipWithinDays(weights, days) {
  let low = Math.max(...weights), high = weights.reduce((a, b) => a + b, 0);
  while (low < high) {
    let mid = Math.floor(low + (high - low) / 2);
    let currDays = 1, currSum = 0;
    for (let w of weights) {
      if (currSum + w > mid) {
        currDays++;
        currSum = w;
      } else {
        currSum += w;
      }
    }
    if (currDays > days) low = mid + 1;
    else high = mid;
  }
  return low;
}
      ` },
      { type: 'ascii', ascii: `
weights=[1,2,3,4,5,6,7,8,9,10], days=5
low=10, high=55 -> mid=32, days=3 <= 5 -> high=32
low=10, high=32 -> mid=21, days=5 <= 5 -> high=21
Output: 15
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Practice LC1011 for Search-on-Answer capacity problems."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle boundary selection in LC1011?",
        "How do you handle edge cases in LC1011?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Boundary Selection in LC1011?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: LC1011 Boundary Selection" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you choose boundaries in LC1011?' to test logic.",
        "Follow-up: 'Why low=max(weights)?'",
        "Deeper: 'How do you ensure minimum capacity?'"
      ]},
      { type: 'subheading', en: "LC1011 Boundary Selection" },
      { type: 'ul', items: [
        "Boundaries: low=max(weights) (min capacity), high=sum(weights) (max capacity).",
        "Key: If days needed > D, low=mid+1 (capacity too small).",
        "If days needed <= D, high=mid (try smaller capacity).",
        "Exit: low == high gives minimum capacity."
      ]},
      { type: 'codeBlock', codeBlock: `
function shipWithinDays(weights, days) {
  let low = Math.max(...weights), high = weights.reduce((a, b) => a + b, 0);
  while (low < high) {
    let mid = Math.floor(low + (high - low) / 2);
    let currDays = 1, currSum = 0;
    for (let w of weights) {
      if (currSum + w > mid) {
        currDays++;
        currSum = w;
      } else {
        currSum += w;
      }
    }
    if (currDays > days) low = mid + 1;
    else high = mid;
  }
  return low;
}
      ` },
      { type: 'ascii', ascii: `
weights=[1,2,3,4,5], days=2
low=5, high=15 -> mid=10, days=2 <= 2 -> high=10
low=5, high=10 -> mid=7, days=3 > 2 -> low=8
Output: 8
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Explain why low=max(weights) in LC1011."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle edge cases in LC1011?",
        "How do you optimize LC1011?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Edge Cases in LC1011?" },
    level: 'fresher',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: LC1011 Edge Cases" },
      { type: 'ul', items: [
        "The interviewer might ask 'What edge cases do you handle in LC1011?' to test robustness.",
        "Follow-up: 'What if days equals weights.length?'",
        "Deeper: 'What if weights has one element?'"
      ]},
      { type: 'subheading', en: "LC1011 Edge Cases" },
      { type: 'ul', items: [
        "days == weights.length: Return max(weights) (one weight per day).",
        "Single Weight: Return weights[0] (one day needed).",
        "days >= sum(weights): Return max(weights) (ample days).",
        "Constraints: n ≤ 10^4, weights[i] ≤ 500, ensures O(n log S) is feasible."
      ]},
      { type: 'codeBlock', codeBlock: `
function shipWithinDays(weights, days) {
  if (days === weights.length) return Math.max(...weights); // Edge case
  // Proceed with binary search
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Handle days == weights.length first in LC1011."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you optimize LC1011?",
        "What are follow-up questions for LC1011?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Optimize LC1011?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: LC1011 Optimization" },
      { type: 'ul', items: [
        "The interviewer might ask 'Can you optimize LC1011?' to test efficiency.",
        "Follow-up: 'Can you reduce time complexity?'",
        "Deeper: 'How do you optimize the check function?'"
      ]},
      { type: 'subheading', en: "LC1011 Optimization" },
      { type: 'ul', items: [
        "Iterative: O(1) space vs. O(log S) recursive.",
        "Tighter Low: Use Math.ceil(sum(weights) / days) for better low bound.",
        "Optimize Check: Early exit if currDays > days.",
        "O(n log S) is optimal for Search-on-Answer."
      ]},
      { type: 'codeBlock', codeBlock: `
function shipWithinDays(weights, days) {
  let low = Math.max(Math.ceil(weights.reduce((a, b) => a + b, 0) / days), Math.max(...weights));
  let high = weights.reduce((a, b) => a + b, 0);
  while (low < high) {
    let mid = Math.floor(low + (high - low) / 2);
    let currDays = 1, currSum = 0;
    for (let w of weights) {
      if (currSum + w > mid) {
        currDays++;
        currSum = w;
        if (currDays > days) break; // Early exit
      } else {
        currSum += w;
      }
    }
    if (currDays > days) low = mid + 1;
    else high = mid;
  }
  return low;
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Use tighter low bound for LC1011."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What are follow-up questions for LC1011?",
        "How do you test LC1011 solutions?"
      ] }
    ]
  },
  {
    q: { en: "What Are Follow-Up Questions for LC1011?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: LC1011 Follow-Ups" },
      { type: 'ul', items: [
        "The interviewer might ask 'What follow-ups do you expect for LC1011?' to test preparedness.",
        "Follow-up: 'What if multiple ships are available?'",
        "Deeper: 'What if weights have priorities?'"
      ]},
      { type: 'subheading', en: "LC1011 Follow-Up Questions" },
      { type: 'ul', items: [
        "Multiple Ships: Divide weights among k ships, minimize max capacity.",
        "Prioritized Weights: Sort by priority, adjust capacity checks.",
        "Max Days: Find max days for given capacity.",
        "Dynamic Weights: Handle changing weights over time."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Practice multiple ships variation for LC1011."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you test LC1011 solutions?",
        "How do you handle parallel Binary Search?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Test LC1011 Solutions?" },
    level: 'fresher',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: LC1011 Testing" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you test your LC1011 solution?' to test thoroughness.",
        "Follow-up: 'What test cases do you prioritize?'",
        "Deeper: 'How do you verify minimum capacity?'"
      ]},
      { type: 'subheading', en: "LC1011 Testing" },
      { type: 'ul', items: [
        "Test small inputs: [1,2,3,4,5,6,7,8,9,10] days=5 → 15.",
        "Test edge cases: [3] days=1 → 3, days=3 → 3.",
        "Test boundary: days == weights.length → max(weights).",
        "Verify: Minimum capacity where days needed <= D."
      ]},
      { type: 'ascii', ascii: `
weights=[1,2,3,4,5], days=2
low=5, high=15 -> mid=10, days=2 <= 2 -> high=10
Output: 6
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Test days == weights.length for LC1011."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle parallel Binary Search?",
        "How do you handle performance bottlenecks in Binary Search?"
      ] }
    ]
  },
  // Advanced Concepts
  {
    q: { en: "How Do You Handle Parallel Binary Search?" },
    level: 'senior',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Parallel Binary Search" },
      { type: 'ul', items: [
        "The interviewer might ask 'Can you parallelize Binary Search?' to test advanced optimization.",
        "Follow-up: 'When is it useful?'",
        "Deeper: 'How do you implement it?'"
      ]},
      { type: 'subheading', en: "Parallel Binary Search" },
      { type: 'ul', items: [
        "Concept: Split search space, run Binary Search in parallel threads.",
        "Use Case: Large datasets, multiple cores (e.g., LC1011 with huge weights).",
        "Implementation: Divide [low, high] into k subranges, search each.",
        "Trade-off: O(log n / k) with k cores, but sync overhead."
      ]},
      { type: 'codeBlock', codeBlock: `
async function parallelBinarySearch(nums, target, threads = 2) {
  let low = 0, high = nums.length - 1;
  const chunk = Math.ceil((high - low + 1) / threads);
  const promises = [];
  for (let i = 0; i < threads; i++) {
    let start = low + i * chunk;
    let end = Math.min(start + chunk - 1, high);
    promises.push(binarySearch(nums, target, start, end));
  }
  const results = await Promise.all(promises);
  return results.find(idx => idx !== -1) ?? -1;
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Discuss parallelization for large-scale problems."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle performance bottlenecks in Binary Search?",
        "How do you model constraints in Search-on-Answer?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Performance Bottlenecks in Binary Search?" },
    level: 'senior',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Performance Bottlenecks" },
      { type: 'ul', items: [
        "The interviewer might ask 'What bottlenecks exist in Binary Search?' to test optimization.",
        "Follow-up: 'How do you address them?'",
        "Deeper: 'How do you optimize LC1011’s check function?'"
      ]},
      { type: 'subheading', en: "Performance Bottlenecks" },
      { type: 'ul', items: [
        "Bottleneck: Check function cost (e.g., LC1011 O(n) weight summation).",
        "Optimize: Early exit in check (LC1011 currDays > days).",
        "Cache: Store check results for recurring values.",
        "Parallelize: Use parallel Binary Search for large inputs."
      ]},
      { type: 'codeBlock', codeBlock: `
function shipWithinDays(weights, days) {
  let low = Math.max(...weights), high = weights.reduce((a, b) => a + b, 0);
  while (low < high) {
    let mid = Math.floor(low + (high - low) / 2);
    let currDays = 1, currSum = 0;
    for (let w of weights) {
      if (currSum + w > mid) {
        currDays++;
        currSum = w;
        if (currDays > days) break; // Early exit
      } else {
        currSum += w;
      }
    }
    if (currDays > days) low = mid + 1;
    else high = mid;
  }
  return low;
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Add early exit in LC1011 check function."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you model constraints in Search-on-Answer?",
        "How do you compare Binary Search to ternary search?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Model Constraints in Search-on-Answer?" },
    level: 'senior',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Constraint Modeling" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you model constraints in Search-on-Answer?' to test problem-solving.",
        "Follow-up: 'How do you define the check function?'",
        "Deeper: 'How do you handle complex constraints?'"
      ]},
      { type: 'subheading', en: "Constraint Modeling" },
      { type: 'ul', items: [
        "Define Range: LC1011 (max(weights), sum(weights)), LC875 (1, max(piles)).",
        "Check Function: Returns feasibility (LC278 isBadVersion, LC1011 days <= D).",
        "Complex Constraints: Combine multiple checks (e.g., capacity and priority).",
        "Optimize: Tighten bounds, early exit in check."
      ]},
      { type: 'ascii', ascii: `
LC1011: weights=[1,2,3,4,5], days=2
Range: [5, 15]
Check: days <= 2 for capacity=6 -> true
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Clearly define check function in interviews."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you compare Binary Search to ternary search?",
        "How do you handle large inputs in Binary Search?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Compare Binary Search to Ternary Search?" },
    level: 'senior',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Binary vs. Ternary Search" },
      { type: 'ul', items: [
        "The interviewer might ask 'How does Binary Search compare to ternary search?' to test algorithm knowledge.",
        "Follow-up: 'When is ternary search better?'",
        "Deeper: 'How do you apply ternary search?'"
      ]},
      { type: 'subheading', en: "Binary vs. Ternary Search" },
      { type: 'ul', items: [
        "Binary Search: O(log n) for monotonic functions (LC704, LC1011).",
        "Ternary Search: O(log3 n) for unimodal functions (e.g., find peak).",
        "Binary Better: Sorted arrays, Search-on-Answer (LC875, LC1011).",
        "Ternary Better: Single peak/valley (e.g., LC162 Find Peak Element)."
      ]},
      { type: 'codeBlock', codeBlock: `
function ternarySearch(nums, low, high) {
  while (low <= high) {
    let mid1 = low + Math.floor((high - low) / 3);
    let mid2 = high - Math.floor((high - low) / 3);
    if (nums[mid1] > nums[mid2]) high = mid2 - 1;
    else low = mid1 + 1;
  }
  return low;
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Use Binary Search for FAANG Search-on-Answer problems."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle large inputs in Binary Search?",
        "How do you manage time in FAANG interviews?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Large Inputs in Binary Search?" },
    level: 'senior',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Large Inputs" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you handle large inputs in Binary Search?' to test scalability.",
        "Follow-up: 'How do you avoid overflow?'",
        "Deeper: 'How do you optimize for big data?'"
      ]},
      { type: 'subheading', en: "Handling Large Inputs" },
      { type: 'ul', items: [
        "Avoid Overflow: Use low + (high - low) / 2 for mid-point.",
        "Optimize Check: Early exit (LC1011), cache results.",
        "Parallelize: Split search space for large n (e.g., LC1011).",
        "Constraints: LC1011 (n ≤ 10^4, weights ≤ 500), LC875 (piles ≤ 10^9)."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Test with large inputs in practice."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you manage time in FAANG interviews?",
        "How do you connect Binary Search to system design?"
      ] }
    ]
  },
  // FAANG Prep
  {
    q: { en: "How Do You Manage Time in FAANG Interviews for Binary Search?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Time Management" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you manage time in Binary Search interviews?' to test efficiency.",
        "Follow-up: 'How do you avoid getting stuck?'",
        "Deeper: 'How do you balance coding and explanation?'"
      ]},
      { type: 'subheading', en: "Time Management" },
      { type: 'ul', items: [
        "Allocate: 5 min clarify, 10 min design, 15 min code, 5 min test.",
        "Start Simple: Standard Binary Search (LC704), adapt for LC1011, LC33.",
        "Explain While Coding: Verbalize low, high, mid, check function.",
        "If Stuck: Fall back to linear, optimize to Binary Search."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Practice 30-min timed sessions for LC1011."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you connect Binary Search to system design?",
        "How do you handle tricky Binary Search questions?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Connect Binary Search to System Design?" },
    level: 'senior',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: System Design Connection" },
      { type: 'ul', items: [
        "The interviewer might ask 'How does Binary Search apply to system design?' to test practical application.",
        "Follow-up: 'What systems use Binary Search?'",
        "Deeper: 'How do you scale Binary Search?'"
      ]},
      { type: 'subheading', en: "System Design Connection" },
      { type: 'ul', items: [
        "Databases: B-tree index lookups (LC704-like).",
        "Distributed Systems: Load balancing (LC1011-like capacity).",
        "Search Engines: Autocomplete with sorted prefixes.",
        "Scale: Parallel Binary Search, distributed index shards."
      ]},
      { type: 'ascii', ascii: `
Database B-tree:
[1,3,5,7,9] -> Query=5
Binary Search -> Node at index 2
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Relate LC1011 to load balancing in system design."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle tricky Binary Search questions?",
        "How do you build confidence for Binary Search interviews?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Tricky Binary Search Questions?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Tricky Questions" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you handle tricky Binary Search problems?' to test adaptability.",
        "Follow-up: 'What if constraints are unclear?'",
        "Deeper: 'How do you handle variations?'"
      ]},
      { type: 'subheading', en: "Handling Tricky Questions" },
      { type: 'ul', items: [
        "Clarify: Sorted? Duplicates? Rotated? Answer range?",
        "Start Simple: Standard Binary Search (LC704), adapt for LC1011, LC33.",
        "Handle Variations: Duplicates (LC81), rotated (LC33), capacity (LC1011).",
        "Test: Run small inputs to verify logic."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Ask clarifying questions early for tricky problems."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you build confidence for Binary Search interviews?",
        "How do you prioritize Binary Search problems for FAANG?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Build Confidence for Binary Search Interviews?" },
    level: 'fresher',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Confidence Building" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you prepare confidently for Binary Search?' to test preparation.",
        "Follow-up: 'How do you handle pressure?'",
        "Deeper: 'How do you retain concepts?'"
      ]},
      { type: 'subheading', en: "Confidence Building" },
      { type: 'ul', items: [
        "Practice Core: LC704, LC278, LC35 daily.",
        "Explain Aloud: Verbalize LC1011, LC33 logic to peers.",
        "Timed Sessions: 30 min for LC1011, LC875.",
        "Mock Interviews: Simulate FAANG with LC153, LC33."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Verbalize LC1011 logic to build confidence."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you prioritize Binary Search problems for FAANG?",
        "How do you handle interviewer hints in Binary Search?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Prioritize Binary Search Problems for FAANG?" },
    level: 'fresher',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Problem Prioritization" },
      { type: 'ul', items: [
        "The interviewer might ask 'Which Binary Search problems to practice for FAANG?' to test preparation.",
        "Follow-up: 'Why prioritize these?'",
        "Deeper: 'How do you build intuition?'"
      ]},
      { type: 'subheading', en: "Problem Prioritization" },
      { type: 'ul', items: [
        "Core: LC704, LC278, LC35 (standard, Search-on-Answer, insertion).",
        "Intermediate: LC153, LC33 (rotated arrays).",
        "Advanced: LC1011, LC875 (Search-on-Answer capacity).",
        "FAANG Favorites: LC704, LC33, LC1011."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Focus on LC1011 for FAANG Search-on-Answer."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle interviewer hints in Binary Search?",
        "How do you test Binary Search solutions effectively?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Interviewer Hints in Binary Search?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Interviewer Hints" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you incorporate hints?' to test adaptability.",
        "Follow-up: 'How do you respond to boundary hints?'",
        "Deeper: 'How do you pivot from wrong approaches?'"
      ]},
      { type: 'subheading', en: "Handling Interviewer Hints" },
      { type: 'ul', items: [
        "Listen: Hints on boundaries (LC1011 low=max(weights)), pivot (LC153).",
        "Incorporate: Adjust low/high, check function (LC1011 days <= D).",
        "Clarify: Ask if hint implies duplicates (LC81) or rotation (LC33).",
        "Pivot: If linear suggested, optimize to Binary Search."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Repeat hint to confirm understanding."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you test Binary Search solutions effectively?",
        "How do you explain Binary Search to non-technical audiences?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Test Binary Search Solutions Effectively?" },
    level: 'fresher',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Testing Solutions" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you test Binary Search solutions?' to test thoroughness.",
        "Follow-up: 'What test cases do you prioritize?'",
        "Deeper: 'How do you ensure robustness?'"
      ]},
      { type: 'subheading', en: "Testing Solutions" },
      { type: 'ul', items: [
        "Core: LC704 ([1,3,5] target=3 → 2), LC1011 ([1,2,3] days=2 → 6).",
        "Edge Cases: Empty ([], single element), no rotation (LC153), days=n (LC1011).",
        "Boundaries: Target outside range (LC33), max capacity (LC1011).",
        "Verify: Correct index, capacity, or -1."
      ]},
      { type: 'ascii', ascii: `
LC1011: weights=[1,2,3], days=2
low=3, high=6 -> mid=4, days=2 <= 2 -> high=4
Output: 4
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Test edge cases first for robustness."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you explain Binary Search to non-technical audiences?",
        "What are common pitfalls in Binary Search?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Explain Binary Search to Non-Technical Audiences?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Non-Technical Explanation" },
      { type: 'ul', items: [
        "The interviewer might ask 'Can you explain Binary Search simply?' to test communication.",
        "Follow-up: 'How do you make it relatable?'",
        "Deeper: 'How do you explain LC1011?'"
      ]},
      { type: 'subheading', en: "Non-Technical Explanation" },
      { type: 'ul', items: [
        "Analogy: Finding a page in a sorted book by splitting in half.",
        "LC704: Like finding a name in a sorted phonebook.",
        "LC1011: Like choosing a truck size to ship packages in few trips.",
        "Key: Emphasize halving, checking, and repeating."
      ]},
      { type: 'ascii', ascii: `
Book pages=[1,2,3,4,5], target=3
[1,2,3,4,5] -> mid=3 (found)
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Use book analogy for Binary Search."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What are common pitfalls in Binary Search?",
        "How do you handle cross-pattern questions?"
      ] }
    ]
  },
  {
    q: { en: "What Are Common Pitfalls in Binary Search?" },
    level: 'fresher',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Common Pitfalls" },
      { type: 'ul', items: [
        "The interviewer might ask 'What mistakes do people make in Binary Search?' to test awareness.",
        "Follow-up: 'How do you avoid them?'",
        "Deeper: 'How do you debug them?'"
      ]},
      { type: 'subheading', en: "Common Pitfalls" },
      { type: 'ul', items: [
        "Mid-Point Overflow: (low + high) / 2 vs. low + (high - low) / 2.",
        "Infinite Loop: Wrong low=mid+1 or high=mid-1.",
        "Boundary Errors: low < high vs. low <= high (LC1011, LC875).",
        "Unsorted Input: Assuming sorted without validation."
      ]},
      { type: 'codeBlock', codeBlock: `
function search(nums, target) {
  let low = 0, high = nums.length - 1;
  while (low <= high) {
    let mid = Math.floor(low + (high - low) / 2); // Avoid overflow
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return -1;
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Dry run small inputs to avoid pitfalls."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle cross-pattern questions?",
        "How do you scale Binary Search in real-world systems?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Cross-Pattern Questions in Binary Search?" },
    level: 'senior',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Cross-Pattern Questions" },
      { type: 'ul', items: [
        "The interviewer might ask 'How does Binary Search relate to other patterns?' to test pattern knowledge.",
        "Follow-up: 'When is Binary Search better?'",
        "Deeper: 'How do you combine with other patterns?'"
      ]},
      { type: 'subheading', en: "Cross-Pattern Questions" },
      { type: 'ul', items: [
        "Binary Search vs. Two-Pointer: O(log n) vs. O(n), sorted vs. unsorted.",
        "Binary Search vs. Greedy: LC1011 (Search-on-Answer) vs. greedy scheduling.",
        "Combine: Use Binary Search for subproblems in greedy (e.g., LC1011).",
        "Backtracking: No overlap, use for combinatorial (LC46)."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Compare Binary Search to greedy in interviews."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you scale Binary Search in real-world systems?",
        "How do you handle mock interview variations?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Scale Binary Search in Real-World Systems?" },
    level: 'senior',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Real-World Scaling" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you scale Binary Search?' to test system knowledge.",
        "Follow-up: 'How do you handle distributed systems?'",
        "Deeper: 'How do you optimize for big data?'"
      ]},
      { type: 'subheading', en: "Real-World Scaling" },
      { type: 'ul', items: [
        "Distributed: Shard data, parallel Binary Search (LC1011-like).",
        "Caching: Store frequent query results (LC704).",
        "Indexing: Use B-trees for database lookups.",
        "Optimize: Tighter bounds, early exits (LC1011)."
      ]},
      { type: 'ascii', ascii: `
Distributed Search:
Shard 1: [1,3,5]
Shard 2: [7,9]
Parallel Binary Search -> Target=5 in Shard 1
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Discuss sharding for scalability."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle mock interview variations?",
        "How do you summarize Binary Search learnings?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Mock Interview Variations for Binary Search?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Mock Interview Variations" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you handle variations in mock interviews?' to test adaptability.",
        "Follow-up: 'How do you prepare for follow-ups?'",
        "Deeper: 'How do you simulate FAANG variations?'"
      ]},
      { type: 'subheading', en: "Mock Interview Variations" },
      { type: 'ul', items: [
        "Variations: Duplicates (LC81), rotated arrays (LC33), capacity (LC1011).",
        "Prepare: Practice LC704, LC33, LC1011 with twists (e.g., noisy data).",
        "Simulate: Time pressure (30 min), hints (boundary tweaks).",
        "Explain: Verbalize logic for LC1011, LC875."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Simulate LC1011 with multiple ships variation."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you summarize Binary Search learnings?",
        "How do you create a sidebar for Binary Search FAQs?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Summarize Binary Search Learnings for FAANG Interviews?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Summarizing Learnings" },
      { type: 'ul', items: [
        "The interviewer might ask 'What are key Binary Search takeaways?' to test understanding.",
        "Follow-up: 'What’s most important for FAANG?'",
        "Deeper: 'How do you apply learnings?'"
      ]},
      { type: 'subheading', en: "Summarizing Learnings" },
      { type: 'ul', items: [
        "Core: O(log n) for sorted/monotonic data (LC704, LC278).",
        "Variations: Rotated arrays (LC33, LC153), Search-on-Answer (LC1011, LC875).",
        "Key Skills: Boundary selection, pivot detection, check functions.",
        "FAANG: Practice LC704, LC33, LC1011, verbalize logic."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Summarize LC1011 as capacity optimization."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you create a sidebar for Binary Search FAQs?",
        "How do you handle ambiguous requirements in Binary Search?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Create a Sidebar for Binary Search FAQs?" },
    level: 'intermediate',
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Sidebar Navigation" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you organize key Binary Search concepts?' to test clarity.",
        "Follow-up: 'Which FAQs are most important?'",
        "Deeper: 'How do you structure for quick access?'"
      ]},
      { type: 'subheading', en: "Sidebar Navigation" },
      { type: 'ul', items: [
        "Include: Important FAQs (11 total) from Batches 1-3.",
        "Structure: HTML nav with links to FAQs.",
        "Key FAQs: Binary Search definition, LC704, LC278, LC35, LC153, LC33, LC875, LC1011 approaches, pivot detection, Search-on-Answer, sidebar.",
        "Purpose: Quick access for revision."
      ]},
      { type: 'codeBlock', codeBlock: `
<nav class="sidebar">
  <ul>
    <li><a href="#what-is-binary-search">What is Binary Search?</a></li>
    <li><a href="#recognize-binary-search">How Do You Recognize Binary Search Problems?</a></li>
    <li><a href="#search-on-answer">What is Search-on-Answer?</a></li>
    <li><a href="#lc704-approach">LC704 Approach</a></li>
    <li><a href="#lc278-approach">LC278 Approach</a></li>
    <li><a href="#lc35-approach">LC35 Approach</a></li>
    <li><a href="#lc153-approach">LC153 Approach</a></li>
    <li><a href="#lc33-approach">LC33 Approach</a></li>
    <li><a href="#lc875-approach">LC875 Approach</a></li>
    <li><a href="#lc1011-approach">LC1011 Approach</a></li>
    <li><a href="#pivot-detection">Pivot Detection in LC153</a></li>
  </ul>
</nav>
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Use sidebar to quickly review key FAQs."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle ambiguous requirements in Binary Search?",
        "How do you revise Binary Search for FAANG interviews?"
      ] }
    ]
  }


];
/* ========== builder: renders FAQ HTML without sidebar navigation ========== */
const buildSlidingWindowFAQSection = (id, title, qaArray) => {
  let faqList = '<div class="faq-list">';
  let importantCount = 1;
  let sidebarLinks = '';
  qaArray.forEach((item, index) => {
    const uniqueId = `${id}-q${index + 1}`;
    const qObj = getLangText(item.q, 'en');
    const qEn = qObj.en;

    let faqItemId = '';
    let levelClass = item.level ? ` level-${item.level}` : '';
    if (item.important) {
      faqItemId = `id="important${importantCount}"`;
      sidebarLinks += `<a href="#important${importantCount}" class="sidebar-link">${qEn}</a>`;
      importantCount++;
    }

    faqList += `
      <div class="faq-item${levelClass}" ${faqItemId}>
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

  return {
    html: `
    <section class="section faq-section" id="${id}">
      <h2>${titleEn}</h2>
      <p>
        In-depth FAQs on Sliding Window Patterns for FAANG prep, including basics, problem breakdowns, code, and interview cross-questions.
      </p>
      ${faqList}
    </section>
  `,
    sidebarLinks
  };
};

/* ========== injection + initial active state ========== */
function injectSlidingWindowFAQs() {
  const container = document.getElementById('faqs-container') || document.querySelector('#faqs');
  if (!container) return false;

  if (container.dataset.faqsInjected === '1') return true;

  const { html, sidebarLinks } = buildSlidingWindowFAQSection('sliding-window-faqs', 'Sliding Window Patterns FAQs', prefixSumMonotonicQueueQA);
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

  // Append additional important FAQ links to existing sidebar (retains current logic)
  const sidebarNav = document.querySelector('.sidebar-nav');
  if (sidebarNav && sidebarLinks) {
    sidebarNav.innerHTML += sidebarLinks;
  }

  return true;
}

window.reinitializeSlidingWindowFAQs = injectSlidingWindowFAQs;

injectSlidingWindowFAQs();

if (!document.getElementById('faqs-container') || document.getElementById('faqs-container').dataset.faqsInjected !== '1') {
  document.addEventListener('DOMContentLoaded', () => {
    injectSlidingWindowFAQs();
  });
}


const cssStyles = `
.level-fresher {
  border-left: 4px solid green;
  padding-left: 10px;
}
.level-intermediate {
  border-left: 4px solid orange;
  padding-left: 10px;
}
.level-senior {
  border-left: 4px solid red;
  padding-left: 10px;
}
.faq-item.problem-statement {
  background-color: #f0f8ff;
  font-weight: bold;
}
`;

// Inject CSS
const styleElement = document.createElement('style');
styleElement.textContent = cssStyles;
document.head.appendChild(styleElement);
