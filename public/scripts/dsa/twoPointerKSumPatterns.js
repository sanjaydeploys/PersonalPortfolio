/* prefixSumMonotonicQueueQA.js
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


/* ========== FAQ data for Two-Pointer Family & k-Sum Patterns ========== */
const twoPointerKSumQA = [
  {
    q: { en: "Overview of Two-Pointer Family & k-Sum Patterns and FAANG Job Preparation" },
    level: 'fresher',
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Pattern Overview" },
      { type: 'ul', items: [
        "The interviewer might ask 'What are the Two-Pointer and k-Sum patterns, and how are they used in FAANG interviews?' to gauge your understanding of these techniques.",
        "Follow-up: 'How do they optimize problems compared to brute force?' expecting O(n^2) or better solutions.",
        "Deeper: 'What types of problems benefit most from Two-Pointer approaches?' testing pattern recognition."
      ]},
      { type: 'subheading', en: "Pattern Overview" },
      { type: 'ul', items: [
        "Two-Pointer involves using two indices (left, right) to traverse arrays, often reducing time from O(n^2) to O(n) or O(n log n) by leveraging sorted order or spatial properties (e.g., LC11, LC167).",
        "k-Sum extends Two-Pointer to find k numbers summing to a target, typically after sorting, reducing O(n^k) brute force to O(n^(k-1)) (e.g., LC15 for 3Sum).",
        "Common in FAANG for array-based problems requiring sum, area, or closest matches, testing sorting, duplicate handling, and pointer movement logic.",
        "Problems: Container With Most Water (LC11), Two Sum II (LC167), 3Sum (LC15), 3Sum Closest (LC16)."
      ]},
      { type: 'subheading', en: "FAANG Prep Tips" },
      { type: 'ul', items: [
        "Master Two-Pointer for sorted arrays and spatial problems, and extend to k-Sum for multi-element sums.",
        "Practice duplicate skipping and edge case handling to show robustness.",
        "Justify sorting cost (O(n log n)) vs. hash map trade-offs in interviews."
      ]},
      { type: 'ascii', ascii: `
Two-Pointer (LC11): [1,8,6,2,5], move shorter height
[left=0, right=4]: area = min(1,5) * 4 = 4
[left=1, right=4]: area = min(8,5) * 3 = 15
k-Sum (LC15): [-1,0,1,2,-1,-4], sort, fix i, two-pointer j,k
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Start with simple Two-Pointer problems (LC167) before tackling k-Sum (LC15)."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What is the Two-Pointer pattern?",
        "What is the k-Sum pattern?"
      ] }
    ]
  },
  {
    q: { en: "What is the Two-Pointer Pattern?" },
    level: 'fresher',
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Two-Pointer Basics" },
      { type: 'ul', items: [
        "The interviewer might ask 'Explain the Two-Pointer pattern and how it works,' to test foundational knowledge.",
        "Follow-up: 'How does it reduce complexity?' expecting O(n) or O(n log n).",
        "Deeper: 'When is Two-Pointer better than hash maps?'"
      ]},
      { type: 'subheading', en: "Two-Pointer Explanation" },
      { type: 'ul', items: [
        "Two-Pointer uses two indices (left, right) to traverse an array, often from opposite ends or same direction, to find pairs or optimize metrics (e.g., max area in LC11, sum in LC167).",
        "Reduces O(n^2) brute force to O(n) by leveraging sorted order or monotonicity, moving pointers based on conditions (e.g., sum < target, move left; sum > target, move right).",
        "Types: Opposite-direction (LC11, LC167) for sorted arrays; same-direction (e.g., fast-slow for linked lists).",
        "FAANG favorite for array problems requiring linear scans or pair matching."
      ]},
      { type: 'ascii', ascii: `
Array: [1,2,3,4,5], target=7 (LC167)
left=0, right=4: 1+5=6 < 7, left++
left=1, right=4: 2+5=7, found
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Clarify if array is sorted or requires sorting."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What is the k-Sum pattern?",
        "What are common data structures?"
      ] }
    ]
  },
  {
    q: { en: "What is the k-Sum Pattern?" },
    level: 'intermediate',
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: k-Sum Basics" },
      { type: 'ul', items: [
        "The interviewer might ask 'Explain the k-Sum pattern and its applications,' to test your ability to generalize Two-Pointer.",
        "Follow-up: 'How does it extend Two-Pointer?' expecting O(n^(k-1)).",
        "Deeper: 'When is recursive k-Sum better than loops?'"
      ]},
      { type: 'subheading', en: "k-Sum Explanation" },
      { type: 'ul', items: [
        "k-Sum finds k numbers in an array summing to a target, typically after sorting, reducing O(n^k) to O(n^(k-1)) using Two-Pointer for the inner loop.",
        "For k=2 (LC167), use Two-Pointer; for k=3 (LC15), fix one number and solve 2Sum; generalize recursively for k>3.",
        "Requires sorting (O(n log n)), but Two-Pointer reduces inner complexity to O(n^(k-1)).",
        "Handles duplicates by skipping identical values to ensure unique results."
      ]},
      { type: 'ascii', ascii: `
3Sum: [-1,0,1,2], target=0
Sort: [-1,0,1,2]
Fix i=0 (-1), 2Sum(0,3,1): j=1, k=3 -> 0+2=2 > 1, k--
Fix i=1 (0),  2Sum(1,3,0): j=2, k=3 -> 1+2=3 > 0, k--
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Practice 3Sum before generalizing to k-Sum."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you identify a Two-Pointer or k-Sum problem?",
        "What are common data structures?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Identify a Two-Pointer or k-Sum Problem in an Interview?" },
    level: 'intermediate',
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Recognition Cues" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you recognize when to use Two-Pointer or k-Sum?' to test pattern recognition.",
        "Follow-up: 'What keywords or constraints hint at these patterns?'",
        "Deeper: 'How do you confirm it’s the best approach?'"
      ]},
      { type: 'subheading', en: "Recognition Cues" },
      { type: 'ul', items: [
        "Two-Pointer: Look for 'pair with sum,' 'max area,' 'sorted array,' or 'two indices' (e.g., LC11, LC167).",
        "k-Sum: Look for 'k numbers summing to target,' 'unique triplets,' or 'closest sum' (e.g., LC15, LC16).",
        "Constraints like O(n^2) or sorted input suggest Two-Pointer; large n (10^5) rules out O(n^3).",
        "Interviewer hints: 'Can you optimize this?' or 'What if the array is sorted?' point to Two-Pointer."
      ]},
      { type: 'ascii', ascii: `
+-------------------+--------------------+---------------------+
| Keyword           | Pattern            | Example Problem     |
+-------------------+--------------------+---------------------+
| Pair sum          | Two-Pointer        | LC167               |
| Max area          | Two-Pointer        | LC11                |
| Triplet sum       | k-Sum (3Sum)       | LC15, LC16          |
| Sorted array      | Two-Pointer        | LC167, LC15         |
+-------------------+--------------------+---------------------+
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Ask if array is sorted or if sorting is allowed to confirm Two-Pointer."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What are common data structures?",
        "What’s the role of sorting?"
      ] }
    ]
  },
  {
    q: { en: "What are Common Data Structures for Two-Pointer and k-Sum?" },
    level: 'fresher',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Data Structures" },
      { type: 'ul', items: [
        "The interviewer might ask 'What data structures do you use for Two-Pointer and k-Sum problems?' to test implementation choices.",
        "Follow-up: 'How do they affect complexity?'",
        "Deeper: 'When do you use hash maps vs pointers?'"
      ]},
      { type: 'subheading', en: "Data Structures" },
      { type: 'ul', items: [
        "Two-Pointer: Arrays for O(1) access, no extra space needed for opposite-direction pointers (LC11, LC167).",
        "k-Sum: Arrays for sorted input, optional hash maps for O(n) 2Sum but O(n) space (LC15 alternative).",
        "Sorting required for most k-Sum problems, costing O(n log n) time, O(1) or O(n) space depending on algorithm.",
        "In FAANG, prefer Two-Pointer for O(1) space unless hash map’s O(n) time is critical."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Default to Two-Pointer for sorted arrays to save space."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What’s the role of sorting?",
        "How do you handle duplicates?"
      ] }
    ]
  },
  {
    q: { en: "What’s the Role of Sorting in Two-Pointer and k-Sum?" },
    level: 'intermediate',
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Sorting Role" },
      { type: 'ul', items: [
        "The interviewer might ask 'Why is sorting important in Two-Pointer and k-Sum problems?' to test optimization understanding.",
        "Follow-up: 'What’s the cost of sorting?' expecting O(n log n).",
        "Deeper: 'When can you avoid sorting?'"
      ]},
      { type: 'subheading', en: "Sorting Role" },
      { type: 'ul', items: [
        "Sorting (O(n log n)) enables Two-Pointer by ensuring monotonicity, allowing efficient pair/triplet searches (e.g., LC15, LC167).",
        "In k-Sum, sorting allows fixing one element and using Two-Pointer for O(n^(k-1)) vs O(n^k) brute force.",
        "Facilitates duplicate skipping by grouping identical elements (e.g., LC15).",
        "Avoid sorting if input is pre-sorted (LC167) or hash map is viable (LC1)."
      ]},
      { type: 'ascii', ascii: `
Unsorted: [3,1,4,2], target=5
Sorted: [1,2,3,4]
left=0, right=3: 1+4=5, found
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Justify sorting cost vs. hash map in interviews."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle duplicates?",
        "What’s the impact of unsorted input?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Duplicates in Two-Pointer and k-Sum?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Duplicate Handling" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you handle duplicates in Two-Pointer or k-Sum problems?' to test robustness.",
        "Follow-up: 'What if duplicates are frequent?'",
        "Deeper: 'How does sorting help with duplicates?'"
      ]},
      { type: 'subheading', en: "Duplicate Handling" },
      { type: 'ul', items: [
        "In Two-Pointer (LC167), duplicates don’t affect pair finding, as first valid pair is returned.",
        "In k-Sum (LC15), after sorting, skip duplicate elements for i, j, k to ensure unique triplets (e.g., skip nums[j] if nums[j] === nums[j-1]).",
        "Sorting groups duplicates, making skipping O(1) per check.",
        "Frequent duplicates reduce effective search space but require careful skipping to avoid missing valid solutions."
      ]},
      { type: 'ascii', ascii: `
nums: [-1,-1,0,0,1], target=0
Sort: [-1,-1,0,0,1]
i=0: skip i=1 (-1)
i=2: j=3, k=4, skip j=4 (0), k=3 (0)
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Always check for duplicates after sorting in k-Sum."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What’s the impact of unsorted input?",
        "What’s the first problem?"
      ] }
    ]
  },
  {
    q: { en: "What’s the Impact of Unsorted Input in Two-Pointer and k-Sum?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Unsorted Input" },
      { type: 'ul', items: [
        "The interviewer might ask 'How does an unsorted array affect Two-Pointer or k-Sum solutions?' to test your preprocessing knowledge.",
        "Follow-up: 'Is sorting always necessary?'",
        "Deeper: 'How does it compare to hash map approaches?'"
      ]},
      { type: 'subheading', en: "Unsorted Input Impact" },
      { type: 'ul', items: [
        "Unsorted input requires O(n log n) sorting for Two-Pointer to work efficiently (e.g., LC15, LC16), as monotonicity is needed.",
        "Without sorting, Two-Pointer degrades to O(n^2) pair checks, losing efficiency.",
        "Hash map can avoid sorting (e.g., LC1), but uses O(n) space vs Two-Pointer’s O(1).",
        "Sorting is justified for k-Sum to handle duplicates and achieve O(n^(k-1))."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Ask if input is sorted to avoid unnecessary sorting."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What’s the first problem?",
        "How do you optimize pointer movement?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Optimize Pointer Movement in Two-Pointer?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Pointer Movement" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you decide which pointer to move in Two-Pointer problems?' to test your logic.",
        "Follow-up: 'How does it differ across problems?'",
        "Deeper: 'How do you ensure efficiency?'"
      ]},
      { type: 'subheading', en: "Pointer Movement Optimization" },
      { type: 'ul', items: [
        "In opposite-direction Two-Pointer (LC11, LC167), move left if sum/area is too small, right if too large, leveraging sorted order.",
        "In same-direction (e.g., fast-slow pointers), adjust based on condition (e.g., cycle detection).",
        "Ensure O(n) by moving one pointer per iteration, avoiding backtracking.",
        "For k-Sum, outer loop fixes elements, inner Two-Pointer optimizes pair search."
      ]},
      { type: 'ascii', ascii: `
LC11: [1,8,6,2]
left=0, right=3: area=min(1,2)*3=3, move left (shorter)
left=1, right=3: area=min(8,2)*2=4
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Explain movement logic clearly to show problem understanding."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What’s the first problem?",
        "How do you handle edge cases?"
      ] }
    ]
  },
  // Problem 1: Container With Most Water (LC11)
  {
    q: { en: "Problem Statement: Container With Most Water (LC11)" },
    level: 'intermediate',
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Problem Understanding" },
      { type: 'ul', items: [
        "The interviewer might state 'Given an array of heights, find the maximum area of water a container can hold.' This tests Two-Pointer for spatial optimization.",
        "Follow-up: 'What if the array has only two elements?'",
        "Deeper: 'Can you solve it in O(n)?'"
      ]},
      { type: 'subheading', en: "Problem Explanation" },
      { type: 'ul', items: [
        "Find two lines (indices i, j) that form a container with max area = min(height[i], height[j]) * (j-i) (e.g., height=[1,8,6,2,5,3,8,6,7], return 49).",
        "Constraints: 2 <= height.length <= 10^5, 0 <= height[i] <= 10^4, expecting O(n) solution.",
        "Two-Pointer: Start with left=0, right=n-1, move shorter height inward to maximize area.",
        "FAANG favorite for testing pointer movement and optimization intuition."
      ]},
      { type: 'ascii', ascii: `
height: [1,8,6,2]
left=0, right=3: area=min(1,2)*3=3
left=1, right=3: area=min(8,2)*2=4
left=1, right=2: area=min(8,6)*1=6
      ` },
      { type: 'subheading', en: "Key Interview Insight" },
      { type: 'ul', items: [
        "Explain why moving shorter height maximizes area."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What’s the brute force approach?",
        "How do you optimize with Two-Pointer?"
      ] }
    ]
  },
  {
    q: { en: "Brute Force Approach for Container With Most Water (LC11)" },
    level: 'fresher',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Brute Force" },
      { type: 'ul', items: [
        "The interviewer might ask 'How would you solve LC11 without optimization?' to establish a baseline.",
        "Follow-up: 'What’s the complexity?' expecting O(n^2).",
        "Deeper: 'Why is this inefficient?'"
      ]},
      { type: 'subheading', en: "Brute Force Approach" },
      { type: 'ul', items: [
        "Check all pairs (i,j) where i < j, compute area = min(height[i], height[j]) * (j-i), and track max.",
        "Time: O(n^2) for n*(n-1)/2 pairs; Space: O(1).",
        "Inefficient for large n (10^5), as it recomputes areas without leveraging monotonicity."
      ]},
      { type: 'codeBlock', codeBlock: `
function maxAreaBrute(height) {
  let maxArea = 0;
  for (let i = 0; i < height.length; i++) {
    for (let j = i + 1; j < height.length; j++) {
      maxArea = Math.max(maxArea, Math.min(height[i], height[j]) * (j - i));
    }
  }
  return maxArea;
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Explain brute force to set up Two-Pointer optimization."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you optimize with Two-Pointer?",
        "Why move the shorter height?"
      ] }
    ]
  },
  {
    q: { en: "Optimized Two-Pointer Approach for Container With Most Water (LC11)" },
    level: 'intermediate',
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Optimization" },
      { type: 'ul', items: [
        "The interviewer might ask 'How can you optimize LC11 using Two-Pointer?' expecting O(n).",
        "Follow-up: 'Why move the shorter height?' expecting area maximization logic.",
        "Deeper: 'How do you prove optimality?'"
      ]},
      { type: 'subheading', en: "Optimized Approach" },
      { type: 'ul', items: [
        "Use Two-Pointer: Start with left=0, right=n-1, compute area = min(height[left], height[right]) * (right-left).",
        "Move pointer with shorter height inward, as area is limited by min height and moving taller height reduces width without increasing min height.",
        "Update max area each step; stop when left >= right.",
        "Time: O(n), single pass; Space: O(1)."
      ]},
      { type: 'codeBlock', codeBlock: `
function maxArea(height) {
  let maxArea = 0, left = 0, right = height.length - 1;
  while (left < right) {
    maxArea = Math.max(maxArea, Math.min(height[left], height[right]) * (right - left));
    if (height[left] < height[right]) left++;
    else right--;
  }
  return maxArea;
}
      ` },
      { type: 'ascii', ascii: `
height: [1,8,6,2]
left=0, right=3: area=min(1,2)*3=3, left++ (1<2)
left=1, right=3: area=min(8,2)*2=4, right-- (2<8)
left=1, right=2: area=min(8,6)*1=6
Max: 6
      ` },
      { type: 'subheading', en: "Complexity" },
      { type: 'ul', items: [
        "Time: O(n), as pointers move n times total.",
        "Space: O(1), only variables used."
      ]},
      { type: 'subheading', en: "Key Interview Insight" },
      { type: 'ul', items: [
        "Explain why moving shorter height is optimal to impress interviewer."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "Why move the shorter height?",
        "What are edge cases?"
      ] }
    ]
  },
  {
    q: { en: "Why Move the Shorter Height in Container With Most Water (LC11)?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Movement Logic" },
      { type: 'ul', items: [
        "The interviewer might ask 'Why do you move the pointer with the shorter height in LC11?' to test your optimization reasoning.",
        "Follow-up: 'What happens if you move the taller height?'",
        "Deeper: 'How do you prove this maximizes area?'"
      ]},
      { type: 'subheading', en: "Movement Logic" },
      { type: 'ul', items: [
        "Area = min(height[left], height[right]) * (right-left); moving taller height keeps min height same or smaller while reducing width, never increasing area.",
        "Moving shorter height may increase min height (if next height is taller), potentially increasing area despite reduced width.",
        "Proof: All skipped pairs (by not moving shorter height) have area ≤ current area, as min height is same or smaller and width is smaller.",
        "Ensures O(n) by checking only necessary pairs."
      ]},
      { type: 'ascii', ascii: `
height: [1,8,6]
left=0, right=2: area=min(1,6)*2=2, move left (1<6)
left=1, right=2: area=min(8,6)*1=6
Move right instead: width=1, min(1,8)=1, area=1 < 2
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Explain movement logic with examples to show clarity."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What are edge cases?",
        "What are trade-offs?"
      ] }
    ]
  },
  {
    q: { en: "What are the Edge Cases for Container With Most Water (LC11)?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Edge Cases" },
      { type: 'ul', items: [
        "The interviewer might ask 'What edge cases do you need to handle for LC11?' to ensure robustness.",
        "Follow-up: 'What if n=2?'",
        "Deeper: 'How do you handle all equal heights?'"
      ]},
      { type: 'subheading', en: "Edge Cases" },
      { type: 'ul', items: [
        "n=2: Only one area possible, return min(height[0], height[1]) * 1.",
        "All equal heights: Area = height[0] * (n-1), computed in O(n) as pointers converge.",
        "All zeros: Return 0, as min height is 0.",
        "Large heights (10^4): No overflow in JS, but use BigInt if needed."
      ]},
      { type: 'codeBlock', codeBlock: `
function maxArea(height) {
  if (height.length < 2) return 0;
  // Proceed with Two-Pointer
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Check n=2 early to handle minimal input."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What are trade-offs?",
        "Can you solve it with a different approach?"
      ] }
    ]
  },
  {
    q: { en: "What are the Trade-Offs of the Two-Pointer Approach for Container With Most Water (LC11)?" },
    level: 'senior',
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Trade-Off Analysis" },
      { type: 'ul', items: [
        "The interviewer might ask 'What are the trade-offs of using Two-Pointer for LC11?' to test optimization awareness.",
        "Follow-up: 'How does it compare to brute force?'",
        "Deeper: 'When is Two-Pointer less effective?'"
      ]},
      { type: 'subheading', en: "Trade-Offs" },
      { type: 'ul', items: [
        "Two-Pointer achieves O(n) time vs brute force O(n^2), ideal for large n (10^5).",
        "Space is O(1) vs O(n) for hash map approaches (if attempted), making it memory-efficient.",
        "Requires understanding of why moving shorter height works, which is less intuitive than brute force.",
        "Less effective if problem requires all pairs or non-spatial metrics (e.g., sum-based)."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Compare to brute force to highlight efficiency."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "Can you solve it with a different approach?",
        "What’s the next problem?"
      ] }
    ]
  },
  {
    q: { en: "Can You Solve Container With Most Water (LC11) with a Different Approach?" },
    level: 'senior',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Alternative Approaches" },
      { type: 'ul', items: [
        "The interviewer might ask 'Can you solve LC11 without Two-Pointer?' to test creativity.",
        "Follow-up: 'What’s the complexity of alternatives?'",
        "Deeper: 'Why is Two-Pointer preferred?'"
      ]},
      { type: 'subheading', en: "Alternative Approaches" },
      { type: 'ul', items: [
        "Brute force: O(n^2) checks all pairs, as above.",
        "Stack-based: Use monotonic stack to track increasing heights, but still O(n^2) in worst case due to pair comparisons.",
        "Two-Pointer is preferred for O(n) time and O(1) space, as alternatives don’t improve complexity or are overly complex.",
        "In FAANG, stick to Two-Pointer unless asked for alternatives."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Mention alternatives briefly but emphasize Two-Pointer."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What’s the next problem?",
        "How do you debug Two-Pointer solutions?"
      ] }
    ]
  },
{
    q: { en: "Problem Statement: Two Sum II (LC167)" },
    level: 'fresher',
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Problem Understanding" },
      { type: 'ul', items: [
        "The interviewer might state 'Given a 1-indexed sorted array and a target, return the indices of two numbers that sum to the target.' This tests Two-Pointer on sorted arrays.",
        "Follow-up: 'What if there are multiple valid pairs?'",
        "Deeper: 'Can you solve it in O(n) with O(1) space?'"
      ]},
      { type: 'subheading', en: "Problem Explanation" },
      { type: 'ul', items: [
        "Find two numbers in a sorted array (1-indexed) that sum to target, return their indices [i,j] (e.g., numbers=[2,7,11,15], target=9, return [1,2]).",
        "Constraints: 2 <= numbers.length <= 3*10^4, -1000 <= numbers[i], target <= 1000, sorted in non-decreasing order, exactly one solution.",
        "Two-Pointer: Use left and right pointers, move based on sum vs target, leveraging sorted order for O(n) solution.",
        "FAANG easy problem to test Two-Pointer efficiency and sorted array handling."
      ]},
      { type: 'ascii', ascii: `
numbers: [2,7,11,15], target=9
left=0, right=3: 2+15=17 > 9, right--
left=0, right=2: 2+11=13 > 9, right--
left=0, right=1: 2+7=9, return [1,2]
      ` },
      { type: 'subheading', en: "Key Interview Insight" },
      { type: 'ul', items: [
        "Clarify if indices are 1-based or 0-based."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What’s the brute force approach?",
        "How do you optimize with Two-Pointer?"
      ] }
    ]
  },
  {
    q: { en: "Brute Force Approach for Two Sum II (LC167)" },
    level: 'fresher',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Brute Force" },
      { type: 'ul', items: [
        "The interviewer might ask 'How would you solve LC167 without optimization?' to establish a baseline.",
        "Follow-up: 'What’s the complexity?' expecting O(n^2).",
        "Deeper: 'Why is this inefficient?'"
      ]},
      { type: 'subheading', en: "Brute Force Approach" },
      { type: 'ul', items: [
        "Check all pairs (i,j) where i < j, compute sum, and return indices if sum equals target.",
        "Time: O(n^2) for n*(n-1)/2 pairs; Space: O(1).",
        "Inefficient for large n (3*10^4), as it ignores sorted order."
      ]},
      { type: 'codeBlock', codeBlock: `
function twoSumBrute(numbers, target) {
  for (let i = 0; i < numbers.length; i++) {
    for (let j = i + 1; j < numbers.length; j++) {
      if (numbers[i] + numbers[j] === target) return [i + 1, j + 1];
    }
  }
  return [];
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Explain brute force to set up Two-Pointer optimization."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you optimize with Two-Pointer?",
        "What’s the benefit of sorted input?"
      ] }
    ]
  },
  {
    q: { en: "Optimized Two-Pointer Approach for Two Sum II (LC167)" },
    level: 'fresher',
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Optimization" },
      { type: 'ul', items: [
        "The interviewer might ask 'How can you optimize LC167 using Two-Pointer?' expecting O(n).",
        "Follow-up: 'How does sorted input help?'",
        "Deeper: 'Why is O(1) space important?'"
      ]},
      { type: 'subheading', en: "Optimized Approach" },
      { type: 'ul', items: [
        "Use Two-Pointer: Start with left=0, right=n-1; compute sum = numbers[left] + numbers[right].",
        "If sum < target, move left++ (need larger sum); if sum > target, move right-- (need smaller sum); if sum === target, return [left+1, right+1].",
        "Sorted order ensures O(n) by moving one pointer per iteration.",
        "Time: O(n), single pass; Space: O(1)."
      ]},
      { type: 'codeBlock', codeBlock: `
function twoSum(numbers, target) {
  let left = 0, right = numbers.length - 1;
  while (left < right) {
    const sum = numbers[left] + numbers[right];
    if (sum === target) return [left + 1, right + 1];
    if (sum < target) left++;
    else right--;
  }
  return [];
}
      ` },
      { type: 'ascii', ascii: `
numbers: [2,7,11,15], target=9
left=0, right=3: 2+15=17 > 9, right--
left=0, right=2: 2+11=13 > 9, right--
left=0, right=1: 2+7=9, return [1,2]
      ` },
      { type: 'subheading', en: "Complexity" },
      { type: 'ul', items: [
        "Time: O(n), pointers move n times total.",
        "Space: O(1), only variables used."
      ]},
      { type: 'subheading', en: "Key Interview Insight" },
      { type: 'ul', items: [
        "Highlight sorted input’s role in O(n) efficiency."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What’s the benefit of sorted input?",
        "What are edge cases?"
      ] }
    ]
  },
  {
    q: { en: "What’s the Benefit of Sorted Input in Two Sum II (LC167)?" },
    level: 'fresher',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Sorted Input" },
      { type: 'ul', items: [
        "The interviewer might ask 'How does the sorted input help in LC167?' to test your understanding of Two-Pointer.",
        "Follow-up: 'What if the array wasn’t sorted?'",
        "Deeper: 'How does it compare to hash map?'"
      ]},
      { type: 'subheading', en: "Sorted Input Benefit" },
      { type: 'ul', items: [
        "Sorted input allows Two-Pointer to achieve O(n) by leveraging monotonicity: if sum < target, move left for larger values; if sum > target, move right for smaller values.",
        "Without sorting, would need O(n^2) pair checks or O(n log n) sort, as in LC1.",
        "Compared to hash map (O(n) time, O(n) space), Two-Pointer uses O(1) space, ideal for space constraints.",
        "Ensures exactly one solution is found efficiently."
      ]},
      { type: 'ascii', ascii: `
Sorted: [2,7,11,15], target=9
left=0, right=3: 2+15=17 > 9, right--
Unsorted: [15,2,11,7], requires O(n^2) or sorting
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Emphasize O(1) space advantage in interviews."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What are edge cases?",
        "How do you handle duplicates?"
      ] }
    ]
  },
  {
    q: { en: "What are the Edge Cases for Two Sum II (LC167)?" },
    level: 'fresher',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Edge Cases" },
      { type: 'ul', items: [
        "The interviewer might ask 'What edge cases do you need to handle for LC167?' to ensure robustness.",
        "Follow-up: 'What if n=2?'",
        "Deeper: 'How do you handle negative numbers?'"
      ]},
      { type: 'subheading', en: "Edge Cases" },
      { type: 'ul', items: [
        "n=2: Check if numbers[0] + numbers[1] === target, return [1,2] or [].",
        "No solution: Not applicable, as constraints guarantee one solution.",
        "Negative numbers: Handled naturally, as sorted order and Two-Pointer work regardless of sign.",
        "Duplicates: Don’t affect result, as first valid pair is returned."
      ]},
      { type: 'codeBlock', codeBlock: `
function twoSum(numbers, target) {
  if (numbers.length < 2) return [];
  // Proceed with Two-Pointer
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Validate n=2 to show edge case awareness."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle duplicates?",
        "What are trade-offs?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Duplicates in Two Sum II (LC167)?" },
    level: 'fresher',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Duplicate Handling" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do duplicates affect your solution for LC167?' to test robustness.",
        "Follow-up: 'What if duplicates are frequent?'",
        "Deeper: 'How does it differ from LC1?'"
      ]},
      { type: 'subheading', en: "Duplicate Handling" },
      { type: 'ul', items: [
        "Duplicates don’t affect LC167, as constraints guarantee one solution, and Two-Pointer returns first valid pair.",
        "Sorted order ensures duplicates are adjacent, but no special handling needed, as any valid pair suffices.",
        "Unlike LC1 (unsorted, hash map), LC167’s sorted input avoids duplicate issues by linear scan.",
        "Frequent duplicates reduce effective search space but don’t change logic."
      ]},
      { type: 'ascii', ascii: `
numbers: [2,2,7,7], target=9
left=0, right=3: 2+7=9, return [1,4]
No need to skip duplicates
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Clarify if multiple solutions are possible (not in LC167)."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What are trade-offs?",
        "Can you solve it with a hash map?"
      ] }
    ]
  },
  {
    q: { en: "What are the Trade-Offs of the Two-Pointer Approach for Two Sum II (LC167)?" },
    level: 'intermediate',
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Trade-Off Analysis" },
      { type: 'ul', items: [
        "The interviewer might ask 'What are the trade-offs of using Two-Pointer for LC167?' to test optimization awareness.",
        "Follow-up: 'How does it compare to hash map?'",
        "Deeper: 'When is Two-Pointer less effective?'"
      ]},
      { type: 'subheading', en: "Trade-Offs" },
      { type: 'ul', items: [
        "Two-Pointer achieves O(n) time and O(1) space, ideal for space-constrained problems vs hash map’s O(n) space.",
        "Requires sorted input; if unsorted, O(n log n) sorting needed, unlike hash map’s O(n) for unsorted (LC1).",
        "Simpler to implement than hash map but relies on sorted property.",
        "Less effective if multiple solutions or unsorted input is required."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Compare to hash map to show space-time trade-off."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "Can you solve it with a hash map?",
        "How do you handle negative numbers?"
      ] }
    ]
  },
  {
    q: { en: "Can You Solve Two Sum II (LC167) with a Hash Map?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Alternative Approach" },
      { type: 'ul', items: [
        "The interviewer might ask 'Can you solve LC167 using a hash map?' to test alternative approaches.",
        "Follow-up: 'What’s the complexity?' expecting O(n).",
        "Deeper: 'Why prefer Two-Pointer?'"
      ]},
      { type: 'subheading', en: "Hash Map Approach" },
      { type: 'ul', items: [
        "Use a hash map to store numbers and their indices; for each number, check if target-number exists in map.",
        "Time: O(n), single pass; Space: O(n) for map.",
        "Two-Pointer preferred in LC167 for O(1) space due to sorted input.",
        "Hash map useful if unsorted input or multiple solutions needed (e.g., LC1)."
      ]},
      { type: 'codeBlock', codeBlock: `
function twoSumHash(numbers, target) {
  const map = new Map();
  for (let i = 0; i < numbers.length; i++) {
    if (map.has(target - numbers[i])) return [map.get(target - numbers[i]) + 1, i + 1];
    map.set(numbers[i], i);
  }
  return [];
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Mention hash map as alternative but emphasize Two-Pointer’s space efficiency."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle negative numbers?",
        "What’s the next problem?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Negative Numbers in Two Sum II (LC167)?" },
    level: 'fresher',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Negative Numbers" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do negative numbers affect your solution for LC167?' to test edge case handling.",
        "Follow-up: 'What if all numbers are negative?'",
        "Deeper: 'How does it impact Two-Pointer logic?'"
      ]},
      { type: 'subheading', en: "Negative Number Handling" },
      { type: 'ul', items: [
        "Negative numbers work naturally in Two-Pointer, as sorted order ensures correct sum comparisons.",
        "If sum < target, move left for larger (less negative) values; if sum > target, move right for smaller values.",
        "All negative numbers (e.g., [-2,-1], target=-3) handled normally: [-2,-1] -> -2+-1=-3, return [1,2].",
        "No overflow risk for constraints (-1000 <= numbers[i] <= 1000)."
      ]},
      { type: 'ascii', ascii: `
numbers: [-2,-1,1,2], target=-3
left=0, right=3: -2+2=0 > -3, right--
left=0, right=2: -2+1=-1 > -3, right--
left=0, right=1: -2+-1=-3, return [1,2]
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Test with negative inputs to ensure robustness."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What’s the next problem?",
        "How do you debug Two-Pointer solutions?"
      ] }
    ]
  },
  // Additional Cross-Cutting Concepts
  {
    q: { en: "How Do You Initialize Pointers in Two-Pointer Problems?" },
    level: 'fresher',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Pointer Initialization" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you set up pointers in Two-Pointer problems?' to test basic setup.",
        "Follow-up: 'Does initialization differ across problems?'",
        "Deeper: 'How do you avoid off-by-one errors?'"
      ]},
      { type: 'subheading', en: "Pointer Initialization" },
      { type: 'ul', items: [
        "For opposite-direction Two-Pointer (LC11, LC167), initialize left=0, right=n-1 to maximize width or search space.",
        "For same-direction (e.g., fast-slow), initialize both at 0 or based on problem (not applicable here).",
        "Ensure left < right in loop to avoid overlap; check array length ≥ 2.",
        "Avoid off-by-one by using 0-based indices internally, adjusting for 1-based output (LC167)."
      ]},
      { type: 'codeBlock', codeBlock: `
function twoSum(numbers, target) {
  let left = 0, right = numbers.length - 1; // Initialize pointers
  while (left < right) {
    // Two-Pointer logic
  }
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Double-check pointer initialization for edge cases like n=2."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you debug Two-Pointer solutions?",
        "What’s the impact of cache efficiency?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Debug Two-Pointer Solutions?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Debugging" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you debug a Two-Pointer solution?' to test your problem-solving process.",
        "Follow-up: 'What common errors occur?'",
        "Deeper: 'How do you use dry runs?'"
      ]},
      { type: 'subheading', en: "Debugging Process" },
      { type: 'ul', items: [
        "Trace pointer movements and sum/area calculations with small inputs (e.g., [2,7], target=9).",
        "Log left, right, and sum/area each iteration to catch incorrect moves.",
        "Common errors: Incorrect pointer movement (e.g., moving taller height in LC11), off-by-one indices, missing edge case checks.",
        "Use ASCII diagrams to visualize pointer positions and conditions."
      ]},
      { type: 'ascii', ascii: `
numbers: [2,7], target=9
left=0, right=1: sum=2+7=9, correct
Error case: left++ instead, left=1, right=1, loop ends prematurely
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Dry run on paper with small inputs to catch logical errors."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What are common mistakes?",
        "What’s the impact of cache efficiency?"
      ] }
    ]
  },
  {
    q: { en: "What are Common Mistakes in Two-Pointer Solutions?" },
    level: 'fresher',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Common Errors" },
      { type: 'ul', items: [
        "The interviewer might ask 'What mistakes do candidates make in Two-Pointer problems?' to test awareness.",
        "Follow-up: 'How do you avoid them?'",
        "Deeper: 'How do they impact FAANG interviews?'"
      ]},
      { type: 'subheading', en: "Common Mistakes" },
      { type: 'ul', items: [
        "Incorrect pointer movement (e.g., moving taller height in LC11, wrong condition in LC167).",
        "Off-by-one errors in index handling, especially with 1-based output (LC167).",
        "Missing edge case checks (e.g., n=2, empty array).",
        "Assuming unsorted input when sorting is needed."
      ]},
      { type: 'subheading', en: "Avoidance" },
      { type: 'ul', items: [
        "Test with small inputs and edge cases.",
        "Log pointer states during development.",
        "Verify movement logic with dry runs."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Practice explaining errors to show debugging skills."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What’s the impact of cache efficiency?",
        "What’s the next problem?"
      ] }
    ]
  },
  {
    q: { en: "What’s the Impact of Cache Efficiency in Two-Pointer Solutions?" },
    level: 'senior',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Cache Efficiency" },
      { type: 'ul', items: [
        "The interviewer might ask 'How does cache efficiency affect Two-Pointer performance?' to test system-level understanding.",
        "Follow-up: 'How does it compare to hash map?'",
        "Deeper: 'How do you optimize for cache?'"
      ]},
      { type: 'subheading', en: "Cache Efficiency Impact" },
      { type: 'ul', items: [
        "Two-Pointer accesses array sequentially (left++, right--), leveraging cache locality for O(1) access, especially in sorted arrays (LC167).",
        "Hash map has O(1) average access but scattered memory access, worse for cache misses.",
        "Sorting (O(n log n)) may disrupt locality but is one-time; subsequent Two-Pointer scans are cache-friendly.",
        "Optimize by minimizing array jumps and using arrays over maps when possible."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Mention cache locality to show system awareness in senior interviews."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What’s the next problem?",
        "How do you handle time pressure?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Time Pressure in Two-Pointer Interviews?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Time Pressure" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you manage time pressure when solving Two-Pointer problems?' to test your process under stress.",
        "Follow-up: 'How do you prioritize steps?'",
        "Deeper: 'How do you recover from a wrong approach?'"
      ]},
      { type: 'subheading', en: "Time Pressure Handling" },
      { type: 'ul', items: [
        "Start with problem clarification (e.g., sorted input, index base).",
        "Sketch brute force quickly, then pivot to Two-Pointer, explaining optimization.",
        "Write code incrementally, testing with small inputs to catch errors early.",
        "If stuck, backtrack to brute force and optimize step-by-step; verbalize thought process."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Practice timed coding (30-45 min) to simulate interviews."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What’s the next problem?",
        "What’s the revision routine?"
      ] }
    ]
  },
  {
    q: { en: "Problem Statement: 3Sum (LC15)" },
    level: 'intermediate',
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Problem Understanding" },
      { type: 'ul', items: [
        "The interviewer might state 'Given an array of integers, find all unique triplets that sum to zero.' This tests k-Sum with duplicate handling.",
        "Follow-up: 'How do you ensure uniqueness?'",
        "Deeper: 'Can you solve it in O(n^2)?'"
      ]},
      { type: 'subheading', en: "Problem Explanation" },
      { type: 'ul', items: [
        "Find all unique triplets [nums[i], nums[j], nums[k]] where i < j < k and nums[i] + nums[j] + nums[k] = 0 (e.g., nums=[-1,0,1,2,-1,-4], return [[-1,-1,2],[-1,0,1]]).",
        "Constraints: 3 <= nums.length <= 3000, -10^5 <= nums[i] <= 10^5, unsorted input, return unique triplets.",
        "Sort + Two-Pointer: Sort array, fix i, use Two-Pointer for j,k to find pairs summing to -nums[i].",
        "FAANG favorite for testing sorting, Two-Pointer, and duplicate skipping."
      ]},
      { type: 'ascii', ascii: `
nums: [-1,0,1,2,-1,-4]
Sort: [-4,-1,-1,0,1,2]
i=0 (-4): j=1, k=5: -1+2=1 < 4, j++
i=1 (-1): j=2, k=5: -1+2=1 = -(-1), add [-1,-1,2]
      ` },
      { type: 'subheading', en: "Key Interview Insight" },
      { type: 'ul', items: [
        "Emphasize sorting and duplicate skipping for uniqueness."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What’s the brute force approach?",
        "How do you optimize with Two-Pointer?"
      ] }
    ]
  },
  {
    q: { en: "Brute Force Approach for 3Sum (LC15)" },
    level: 'fresher',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Brute Force" },
      { type: 'ul', items: [
        "The interviewer might ask 'How would you solve LC15 without optimization?' to establish a baseline.",
        "Follow-up: 'What’s the complexity?' expecting O(n^3).",
        "Deeper: 'Why is this inefficient?'"
      ]},
      { type: 'subheading', en: "Brute Force Approach" },
      { type: 'ul', items: [
        "Check all triplets (i,j,k) where i < j < k, compute sum, and add to result if sum = 0.",
        "Handle duplicates with a set or sorting results.",
        "Time: O(n^3) for n*(n-1)*(n-2)/6 triplets; Space: O(n) for result or set.",
        "Inefficient for large n (3000), as it doesn’t leverage sorting."
      ]},
      { type: 'codeBlock', codeBlock: `
function threeSumBrute(nums) {
  const result = new Set();
  for (let i = 0; i < nums.length - 2; i++) {
    for (let j = i + 1; j < nums.length - 1; j++) {
      for (let k = j + 1; k < nums.length; k++) {
        if (nums[i] + nums[j] + nums[k] === 0) {
          result.add(JSON.stringify([nums[i], nums[j], nums[k]].sort((a, b) => a - b)));
        }
      }
    }
  }
  return Array.from(result, JSON.parse);
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Explain brute force to set up Two-Pointer optimization."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you optimize with Two-Pointer?",
        "How do you handle duplicates?"
      ] }
    ]
  },
  {
    q: { en: "Optimized Two-Pointer Approach for 3Sum (LC15)" },
    level: 'intermediate',
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Optimization" },
      { type: 'ul', items: [
        "The interviewer might ask 'How can you optimize LC15 using Two-Pointer?' expecting O(n^2).",
        "Follow-up: 'How do you handle duplicates?'",
        "Deeper: 'How do you prove optimality?'"
      ]},
      { type: 'subheading', en: "Optimized Approach" },
      { type: 'ul', items: [
        "Sort array (O(n log n)), then for each i, use Two-Pointer (j,k) to find pairs summing to -nums[i].",
        "Skip duplicate i, j, k to ensure unique triplets.",
        "If sum < -nums[i], move j++; if sum > -nums[i], move k--.",
        "Time: O(n^2) (O(n log n) sort + O(n^2) for i-loop and Two-Pointer); Space: O(1) excluding result."
      ]},
      { type: 'codeBlock', codeBlock: `
function threeSum(nums) {
  nums.sort((a, b) => a - b);
  const result = [];
  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    let j = i + 1, k = nums.length - 1;
    while (j < k) {
      const sum = nums[j] + nums[k];
      if (sum === -nums[i]) {
        result.push([nums[i], nums[j], nums[k]]);
        while (j < k && nums[j] === nums[j + 1]) j++;
        while (j < k && nums[k] === nums[k - 1]) k--;
        j++;
        k--;
      } else if (sum < -nums[i]) j++;
      else k--;
    }
  }
  return result;
}
      ` },
      { type: 'ascii', ascii: `
Sort: [-4,-1,-1,0,1,2]
i=1 (-1): j=2, k=5: -1+2=1 = -(-1), add [-1,-1,2], skip j=3, k=4
i=2 (-1): skip (duplicate)
i=3 (0): j=4, k=5: 1+2=3 > 0, k--
      ` },
      { type: 'subheading', en: "Complexity" },
      { type: 'ul', items: [
        "Time: O(n^2), dominated by Two-Pointer loop.",
        "Space: O(1) excluding result, O(n) for sorting in some implementations."
      ]},
      { type: 'subheading', en: "Key Interview Insight" },
      { type: 'ul', items: [
        "Explain duplicate skipping to show robustness."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle duplicates?",
        "What are edge cases?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Duplicates in 3Sum (LC15)?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Duplicate Handling" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you ensure unique triplets in LC15?' to test robustness.",
        "Follow-up: 'What if duplicates are frequent?'",
        "Deeper: 'How does sorting help?'"
      ]},
      { type: 'subheading', en: "Duplicate Handling" },
      { type: 'ul', items: [
        "Sort array to group duplicates, then skip identical i, j, k values.",
        "For i: If nums[i] === nums[i-1], skip to avoid duplicate triplets.",
        "For j,k: After finding a valid triplet, skip duplicates (nums[j] === nums[j+1], nums[k] === nums[k-1]).",
        "Sorting ensures O(1) duplicate checks, reducing redundant work."
      ]},
      { type: 'ascii', ascii: `
Sort: [-1,-1,-1,0,1,2]
i=0 (-1): j=3, k=5: 0+2=2 > 1, k--
i=1 (-1): skip (duplicate)
i=2 (-1): skip (duplicate)
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Test with duplicate-heavy inputs like [-1,-1,-1,1,1]."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What are edge cases?",
        "What are trade-offs?"
      ] }
    ]
  },
  {
    q: { en: "What are the Edge Cases for 3Sum (LC15)?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Edge Cases" },
      { type: 'ul', items: [
        "The interviewer might ask 'What edge cases do you handle for LC15?' to ensure robustness.",
        "Follow-up: 'What if n=3?'",
        "Deeper: 'How do you handle all zeros?'"
      ]},
      { type: 'subheading', en: "Edge Cases" },
      { type: 'ul', items: [
        "n=3: Check if nums[0] + nums[1] + nums[2] = 0, return [[0,0,0]] or [].",
        "All zeros: Return [[0,0,0]] if n>=3, as all triplets sum to 0.",
        "No solution: Empty result if no triplets sum to 0 (e.g., [1,2,3]).",
        "Large numbers: No overflow in JS, but use BigInt if needed for constraints."
      ]},
      { type: 'codeBlock', codeBlock: `
function threeSum(nums) {
  if (nums.length < 3) return [];
  // Proceed with sorting and Two-Pointer
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Check n<3 early to handle small inputs."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What are trade-offs?",
        "Can you solve it with a hash map?"
      ] }
    ]
  },
  {
    q: { en: "What are the Trade-Offs of the Two-Pointer Approach for 3Sum (LC15)?" },
    level: 'senior',
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Trade-Off Analysis" },
      { type: 'ul', items: [
        "The interviewer might ask 'What are the trade-offs of using Two-Pointer for LC15?' to test optimization awareness.",
        "Follow-up: 'How does it compare to hash map?'",
        "Deeper: 'When is Two-Pointer less effective?'"
      ]},
      { type: 'subheading', en: "Trade-Offs" },
      { type: 'ul', items: [
        "Two-Pointer achieves O(n^2) time vs O(n^3) brute force, ideal for n=3000.",
        "Space: O(1) excluding result, vs O(n) for hash map approaches.",
        "Requires O(n log n) sorting, which hash map avoids but uses O(n) space.",
        "Less effective if problem requires all combinations or non-sum metrics."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Compare to hash map to highlight space efficiency."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "Can you solve it with a hash map?",
        "How do you handle negative numbers?"
      ] }
    ]
  },
  {
    q: { en: "Can You Solve 3Sum (LC15) with a Hash Map?" },
    level: 'senior',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Alternative Approach" },
      { type: 'ul', items: [
        "The interviewer might ask 'Can you solve LC15 using a hash map?' to test alternative approaches.",
        "Follow-up: 'What’s the complexity?' expecting O(n^2).",
        "Deeper: 'How do you handle duplicates?'"
      ]},
      { type: 'subheading', en: "Hash Map Approach" },
      { type: 'ul', items: [
        "Fix i, use hash map to solve 2Sum for -nums[i] with j,k pairs.",
        "Time: O(n^2) (O(n) for i-loop, O(n) for 2Sum); Space: O(n) for map.",
        "Handle duplicates by sorting triplets and using a set, or checking indices.",
        "Two-Pointer preferred for O(1) space and simpler duplicate handling."
      ]},
      { type: 'codeBlock', codeBlock: `
function threeSumHash(nums) {
  const result = new Set();
  for (let i = 0; i < nums.length - 2; i++) {
    const map = new Map();
    for (let j = i + 1; j < nums.length; j++) {
      const complement = -nums[i] - nums[j];
      if (map.has(complement)) {
        result.add(JSON.stringify([nums[i], complement, nums[j]].sort((a, b) => a - b)));
      }
      map.set(nums[j], j);
    }
  }
  return Array.from(result, JSON.parse);
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Mention hash map as alternative but prefer Two-Pointer for space."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle negative numbers?",
        "What’s the next problem?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Negative Numbers in 3Sum (LC15)?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Negative Numbers" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do negative numbers affect your solution for LC15?' to test edge case handling.",
        "Follow-up: 'What if all numbers are negative?'",
        "Deeper: 'How does sorting help?'"
      ]},
      { type: 'subheading', en: "Negative Number Handling" },
      { type: 'ul', items: [
        "Sorting handles negative numbers naturally, as Two-Pointer compares sum to -nums[i].",
        "If sum < -nums[i], move j++; if sum > -nums[i], move k--.",
        "All negative numbers (e.g., [-2,-1,-1]) may yield no solution unless balanced by positives.",
        "Constraints (-10^5 <= nums[i] <= 10^5) ensure no overflow in JS."
      ]},
      { type: 'ascii', ascii: `
nums: [-2,-1,1,2]
Sort: [-2,-1,1,2]
i=0 (-2): j=1, k=3: -1+2=1 < 2, j++
i=1 (-1): j=2, k=3: 1+2=3 > 1, k--
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Test with mixed positive/negative inputs."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What’s the next problem?",
        "How do you optimize duplicate skipping?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Optimize Duplicate Skipping in 3Sum (LC15)?" },
    level: 'senior',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Duplicate Optimization" },
      { type: 'ul', items: [
        "The interviewer might ask 'How can you optimize duplicate handling in LC15?' to test efficiency.",
        "Follow-up: 'What if duplicates are frequent?'",
        "Deeper: 'How does it affect performance?'"
      ]},
      { type: 'subheading', en: "Duplicate Optimization" },
      { type: 'ul', items: [
        "Sort array to group duplicates, enabling O(1) checks (nums[i] === nums[i-1]).",
        "Skip i if duplicate to avoid redundant outer loops.",
        "After finding a triplet, skip duplicate j,k to avoid duplicate results.",
        "Frequent duplicates reduce effective search space, improving runtime slightly."
      ]},
      { type: 'codeBlock', codeBlock: `
while (j < k && nums[j] === nums[j + 1]) j++; // Skip duplicate j
while (j < k && nums[k] === nums[k - 1]) k--; // Skip duplicate k
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Explain duplicate skipping to show attention to detail."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What’s the next problem?",
        "How do you debug 3Sum?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Debug 3Sum (LC15) Solutions?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Debugging" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you debug your 3Sum solution?' to test your process.",
        "Follow-up: 'What common errors occur?'",
        "Deeper: 'How do you use dry runs?'"
      ]},
      { type: 'subheading', en: "Debugging Process" },
      { type: 'ul', items: [
        "Trace i,j,k and sum for small inputs (e.g., [-1,0,1]).",
        "Log duplicate skips to ensure uniqueness.",
        "Common errors: Missing duplicate skips, incorrect pointer movement, off-by-one in indices.",
        "Use ASCII to visualize sorting and pointer positions."
      ]},
      { type: 'ascii', ascii: `
nums: [-1,0,1]
Sort: [-1,0,1]
i=0: j=1, k=2: 0+1=1 = -(-1), add [-1,0,1]
Error: Missing j++ skip -> duplicate triplets
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Dry run with duplicates to catch errors."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What’s the next problem?",
        "What’s the impact of sorting?"
      ] }
    ]
  },
  {
    q: { en: "What’s the Impact of Sorting in 3Sum (LC15)?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Sorting Impact" },
      { type: 'ul', items: [
        "The interviewer might ask 'How does sorting affect your 3Sum solution?' to test optimization understanding.",
        "Follow-up: 'Is sorting always necessary?'",
        "Deeper: 'How does it compare to hash map?'"
      ]},
      { type: 'subheading', en: "Sorting Impact" },
      { type: 'ul', items: [
        "Sorting (O(n log n)) enables Two-Pointer for O(n^2) vs O(n^3) brute force.",
        "Groups duplicates for easy skipping, ensuring unique triplets.",
        "Allows efficient Two-Pointer by leveraging monotonicity for sum comparisons.",
        "Hash map avoids sorting but uses O(n) space and complicates duplicate handling."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Justify sorting cost vs. hash map in interviews."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What’s the next problem?",
        "Can you generalize to k-Sum?"
      ] }
    ]
  },
  {
    q: { en: "Can You Generalize 3Sum (LC15) to k-Sum?" },
    level: 'senior',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Generalization" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you extend 3Sum to k-Sum?' to test scalability.",
        "Follow-up: 'What’s the complexity?' expecting O(n^(k-1)).",
        "Deeper: 'When is recursive k-Sum better?'"
      ]},
      { type: 'subheading', en: "k-Sum Generalization" },
      { type: 'ul', items: [
        "Sort array, then recursively reduce k-Sum to (k-1)-Sum by fixing one number.",
        "Base case: k=2, solve with Two-Pointer (O(n)).",
        "Time: O(n^(k-1)) for k nested loops + Two-Pointer; Space: O(k) for recursion stack.",
        "Recursive approach cleaner for large k; loop-based for small k (readability)."
      ]},
      { type: 'codeBlock', codeBlock: `
function kSum(nums, target, k, start) {
  if (k === 2) {
    const result = [];
    let left = start, right = nums.length - 1;
    while (left < right) {
      const sum = nums[left] + nums[right];
      if (sum === target) {
        result.push([nums[left], nums[right]]);
        while (left < right && nums[left] === nums[left + 1]) left++;
        while (left < right && nums[right] === nums[right - 1]) right--;
        left++;
        right--;
      } else if (sum < target) left++;
      else right--;
    }
    return result;
  }
  const result = [];
  for (let i = start; i < nums.length - k + 1; i++) {
    if (i > start && nums[i] === nums[i - 1]) continue;
    const subResults = kSum(nums, target - nums[i], k - 1, i + 1);
    for (let sub of subResults) {
      result.push([nums[i], ...sub]);
    }
  }
  return result;
}
function threeSum(nums) {
  nums.sort((a, b) => a - b);
  return kSum(nums, 0, 3, 0);
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Practice k-Sum for senior-level interviews."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What’s the next problem?",
        "What’s the revision routine?"
      ] }
    ]
  },
  // Problem 4: 3Sum Closest (LC16)
  {
    q: { en: "Problem Statement: 3Sum Closest (LC16)" },
    level: 'intermediate',
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Problem Understanding" },
      { type: 'ul', items: [
        "The interviewer might state 'Given an array of integers and a target, find the triplet sum closest to the target.' This tests k-Sum with optimization.",
        "Follow-up: 'How do you track the closest sum?'",
        "Deeper: 'Can you solve it in O(n^2)?'"
      ]},
      { type: 'subheading', en: "Problem Explanation" },
      { type: 'ul', items: [
        "Find a triplet [nums[i], nums[j], nums[k]] where i < j < k, with sum closest to target (e.g., nums=[-1,2,1,-4], target=1, return 2).",
        "Constraints: 3 <= nums.length <= 500, -1000 <= nums[i], target <= 1000, unsorted input, one solution.",
        "Sort + Two-Pointer: Sort array, fix i, use Two-Pointer for j,k, track min difference from target.",
        "FAANG problem for testing precision and optimization."
      ]},
      { type: 'ascii', ascii: `
nums: [-1,2,1,-4]
Sort: [-4,-1,1,2]
i=0 (-4): j=1, k=3: -1+2=1, diff=|1-1|=0, return 1
      ` },
      { type: 'subheading', en: "Key Interview Insight" },
      { type: 'ul', items: [
        "Explain how to track closest sum efficiently."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What’s the brute force approach?",
        "How do you optimize with Two-Pointer?"
      ] }
    ]
  },
  {
    q: { en: "Brute Force Approach for 3Sum Closest (LC16)" },
    level: 'fresher',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Brute Force" },
      { type: 'ul', items: [
        "The interviewer might ask 'How would you solve LC16 without optimization?' to establish a baseline.",
        "Follow-up: 'What’s the complexity?' expecting O(n^3).",
        "Deeper: 'Why is this inefficient?'"
      ]},
      { type: 'subheading', en: "Brute Force Approach" },
      { type: 'ul', items: [
        "Check all triplets (i,j,k) where i < j < k, compute sum, track sum with min |sum - target|.",
        "Time: O(n^3) for all triplets; Space: O(1).",
        "Inefficient for n=500, as it doesn’t leverage sorting."
      ]},
      { type: 'codeBlock', codeBlock: `
function threeSumClosestBrute(nums, target) {
  let closestSum = nums[0] + nums[1] + nums[2];
  for (let i = 0; i < nums.length - 2; i++) {
    for (let j = i + 1; j < nums.length - 1; j++) {
      for (let k = j + 1; k < nums.length; k++) {
        const sum = nums[i] + nums[j] + nums[k];
        if (Math.abs(sum - target) < Math.abs(closestSum - target)) {
          closestSum = sum;
        }
      }
    }
  }
  return closestSum;
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Explain brute force to set up Two-Pointer optimization."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you optimize with Two-Pointer?",
        "How do you track the closest sum?"
      ] }
    ]
  },
  {
    q: { en: "Optimized Two-Pointer Approach for 3Sum Closest (LC16)" },
    level: 'intermediate',
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Optimization" },
      { type: 'ul', items: [
        "The interviewer might ask 'How can you optimize LC16 using Two-Pointer?' expecting O(n^2).",
        "Follow-up: 'How do you track the closest sum?'",
        "Deeper: 'How do you handle early termination?'"
      ]},
      { type: 'subheading', en: "Optimized Approach" },
      { type: 'ul', items: [
        "Sort array (O(n log n)), fix i, use Two-Pointer (j,k) to find pairs summing closest to target-nums[i].",
        "Track min difference |sum - target| and update closest sum.",
        "If sum < target-nums[i], move j++; if sum > target-nums[i], move k--.",
        "Time: O(n^2); Space: O(1) excluding sort."
      ]},
      { type: 'codeBlock', codeBlock: `
function threeSumClosest(nums, target) {
  nums.sort((a, b) => a - b);
  let closestSum = nums[0] + nums[1] + nums[2];
  for (let i = 0; i < nums.length - 2; i++) {
    let j = i + 1, k = nums.length - 1;
    while (j < k) {
      const sum = nums[i] + nums[j] + nums[k];
      if (sum === target) return sum;
      if (Math.abs(sum - target) < Math.abs(closestSum - target)) {
        closestSum = sum;
      }
      if (sum < target) j++;
      else k--;
    }
  }
  return closestSum;
}
      ` },
      { type: 'ascii', ascii: `
Sort: [-4,-1,1,2], target=1
i=0 (-4): j=1, k=3: -1+2=1, sum=-3, diff=|-3-1|=4
i=1 (-1): j=2, k=3: 1+2=3, sum=2, diff=|2-1|=1, update closest=2
      ` },
      { type: 'subheading', en: "Complexity" },
      { type: 'ul', items: [
        "Time: O(n^2), dominated by Two-Pointer loop.",
        "Space: O(1) excluding sort, O(n) for some sort implementations."
      ]},
      { type: 'subheading', en: "Key Interview Insight" },
      { type: 'ul', items: [
        "Explain min difference tracking for precision."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you track the closest sum?",
        "What are edge cases?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Track the Closest Sum in 3Sum Closest (LC16)?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Closest Sum Tracking" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you track the closest sum in LC16?' to test optimization logic.",
        "Follow-up: 'What if multiple triplets have the same difference?'",
        "Deeper: 'How do you optimize comparisons?'"
      ]},
      { type: 'subheading', en: "Closest Sum Tracking" },
      { type: 'ul', items: [
        "Initialize closestSum with first triplet’s sum.",
        "For each sum = nums[i] + nums[j] + nums[k], compute |sum - target|.",
        "Update closestSum if |sum - target| < |closestSum - target|.",
        "If sum === target, return immediately (exact match)."
      ]},
      { type: 'codeBlock', codeBlock: `
if (sum === target) return sum;
if (Math.abs(sum - target) < Math.abs(closestSum - target)) {
  closestSum = sum;
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Test with target far from sums to verify tracking."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What are edge cases?",
        "What are trade-offs?"
      ] }
    ]
  },
  {
    q: { en: "What are the Edge Cases for 3Sum Closest (LC16)?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Edge Cases" },
      { type: 'ul', items: [
        "The interviewer might ask 'What edge cases do you handle for LC16?' to ensure robustness.",
        "Follow-up: 'What if n=3?'",
        "Deeper: 'How do you handle equal differences?'"
      ]},
      { type: 'subheading', en: "Edge Cases" },
      { type: 'ul', items: [
        "n=3: Return nums[0] + nums[1] + nums[2].",
        "Exact match: Return sum immediately if sum === target.",
        "Large differences: Handle |sum - target| up to 3000 with no overflow in JS.",
        "Equal differences: First valid sum is fine, as problem requires one solution."
      ]},
      { type: 'codeBlock', codeBlock: `
function threeSumClosest(nums, target) {
  if (nums.length < 3) return 0;
  // Proceed with sorting and Two-Pointer
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Check n=3 early to handle minimal input."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What are trade-offs?",
        "Can you optimize further?"
      ] }
    ]
  },
  {
    q: { en: "What are the Trade-Offs of the Two-Pointer Approach for 3Sum Closest (LC16)?" },
    level: 'senior',
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Trade-Off Analysis" },
      { type: 'ul', items: [
        "The interviewer might ask 'What are the trade-offs of using Two-Pointer for LC16?' to test optimization awareness.",
        "Follow-up: 'How does it compare to brute force?'",
        "Deeper: 'When is Two-Pointer less effective?'"
      ]},
      { type: 'subheading', en: "Trade-Offs" },
      { type: 'ul', items: [
        "Two-Pointer achieves O(n^2) vs O(n^3) brute force, suitable for n=500.",
        "Space: O(1) excluding sort, vs O(n) for hash map.",
        "Requires O(n log n) sorting, which hash map avoids but uses more space.",
        "Less effective if problem requires all triplets or non-sum metrics."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Highlight O(n^2) efficiency in interviews."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "Can you optimize further?",
        "How do you handle negative numbers?"
      ] }
    ]
  },
  {
    q: { en: "Can You Optimize 3Sum Closest (LC16) Further?" },
    level: 'senior',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Further Optimization" },
      { type: 'ul', items: [
        "The interviewer might ask 'Can you optimize LC16 beyond Two-Pointer?' to test creativity.",
        "Follow-up: 'What’s the impact of early termination?'",
        "Deeper: 'How do you balance accuracy and speed?'"
      ]},
      { type: 'subheading', en: "Further Optimization" },
      { type: 'ul', items: [
        "Early termination: If sum === target, return immediately.",
        "Prune search: If current sum is far from target and sorted order suggests worse sums, skip iterations (complex to implement).",
        "Two-Pointer is near-optimal for O(n^2) time, O(1) space.",
        "Hash map doesn’t improve time (still O(n^2)) and uses O(n) space."
      ]},
      { type: 'codeBlock', codeBlock: `
if (sum === target) return sum; // Early termination
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Mention early termination to show optimization awareness."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle negative numbers?",
        "How do you debug 3Sum Closest?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Negative Numbers in 3Sum Closest (LC16)?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Negative Numbers" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do negative numbers affect your solution for LC16?' to test edge case handling.",
        "Follow-up: 'What if all numbers are negative?'",
        "Deeper: 'How does sorting help?'"
      ]},
      { type: 'subheading', en: "Negative Number Handling" },
      { type: 'ul', items: [
        "Sorting ensures negative numbers are handled naturally, as Two-Pointer compares sum to target-nums[i].",
        "All negative numbers (e.g., [-3,-2,-1], target=1) return closest sum (e.g., -6).",
        "Absolute difference |sum - target| works regardless of sign.",
        "Constraints (-1000 <= nums[i] <= 1000) ensure no overflow."
      ]},
      { type: 'ascii', ascii: `
nums: [-3,-2,-1], target=1
Sort: [-3,-2,-1]
i=0: j=1, k=2: -2+-1=-3, diff=|-3-1|=4, closest=-6
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Test with negative-heavy inputs."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you debug 3Sum Closest?",
        "What’s the impact of sorting?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Debug 3Sum Closest (LC16) Solutions?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Debugging" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you debug your 3Sum Closest solution?' to test your process.",
        "Follow-up: 'What common errors occur?'",
        "Deeper: 'How do you verify closest sum?'"
      ]},
      { type: 'subheading', en: "Debugging Process" },
      { type: 'ul', items: [
        "Trace i,j,k and sum, logging |sum - target| for small inputs (e.g., [-1,2,1]).",
        "Verify closestSum updates correctly by checking difference calculations.",
        "Common errors: Incorrect difference comparison, missing early termination, off-by-one indices.",
        "Use ASCII to visualize pointer movements and sum updates."
      ]},
      { type: 'ascii', ascii: `
nums: [-1,2,1], target=1
Sort: [-1,1,2]
i=0: j=1, k=2: 1+2=3, diff=|3-1|=2, closest=3
Error: Wrong comparison -> outdated closestSum
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Dry run with small inputs to verify closest sum."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What’s the impact of sorting?",
        "What’s the revision routine?"
      ] }
    ]
  },
  {
    q: { en: "What’s the Impact of Sorting in 3Sum Closest (LC16)?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Sorting Impact" },
      { type: 'ul', items: [
        "The interviewer might ask 'How does sorting affect your 3Sum Closest solution?' to test optimization understanding.",
        "Follow-up: 'Is sorting always necessary?'",
        "Deeper: 'How does it compare to hash map?'"
      ]},
      { type: 'subheading', en: "Sorting Impact" },
      { type: 'ul', items: [
        "Sorting (O(n log n)) enables Two-Pointer for O(n^2) vs O(n^3) brute force.",
        "Allows efficient sum comparisons by leveraging monotonicity.",
        "Groups duplicates, though less critical than LC15 since uniqueness not required.",
        "Hash map avoids sorting but uses O(n) space and complicates closest sum tracking."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Justify sorting cost for O(n^2) efficiency."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What’s the revision routine?",
        "Can you generalize to k-Sum Closest?"
      ] }
    ]
  },
  {
    q: { en: "Can You Generalize 3Sum Closest (LC16) to k-Sum Closest?" },
    level: 'senior',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Generalization" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you extend 3Sum Closest to k-Sum Closest?' to test scalability.",
        "Follow-up: 'What’s the complexity?' expecting O(n^(k-1)).",
        "Deeper: 'How do you track closest sums recursively?'"
      ]},
      { type: 'subheading', en: "k-Sum Closest Generalization" },
      { type: 'ul', items: [
        "Sort array, recursively reduce k-Sum to (k-1)-Sum, tracking closest sum.",
        "Base case: k=2, use Two-Pointer to find pair closest to target.",
        "Update global closest sum across recursive calls.",
        "Time: O(n^(k-1)); Space: O(k) for recursion."
      ]},
      { type: 'codeBlock', codeBlock: `
function kSumClosest(nums, target, k, start) {
  if (k === 2) {
    let left = start, right = nums.length - 1, closestSum = Infinity;
    while (left < right) {
      const sum = nums[left] + nums[right];
      if (Math.abs(sum - target) < Math.abs(closestSum - target)) {
        closestSum = sum;
      }
      if (sum === target) return sum;
      if (sum < target) left++;
      else right--;
    }
    return closestSum;
  }
  let closestSum = Infinity;
  for (let i = start; i < nums.length - k + 1; i++) {
    const subClosest = kSumClosest(nums, target - nums[i], k - 1, i + 1);
    const currentSum = nums[i] + subClosest;
    if (Math.abs(currentSum - target) < Math.abs(closestSum - target)) {
      closestSum = currentSum;
    }
  }
  return closestSum;
}
function threeSumClosest(nums, target) {
  nums.sort((a, b) => a - b);
  return kSumClosest(nums, target, 3, 0);
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Practice recursive k-Sum for senior interviews."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What’s the revision routine?",
        "How do you handle large inputs?"
      ] }
    ]
  },
  {
    q: { en: "What is the Difference Between Recursive and Loop-Based k-Sum?" },
    level: 'senior',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Recursive vs. Loop-Based" },
      { type: 'ul', items: [
        "The interviewer might ask 'How does recursive k-Sum compare to loop-based k-Sum?' to test scalability understanding.",
        "Follow-up: 'When is one better than the other?'",
        "Deeper: 'How do you ensure correctness in recursive k-Sum?'"
      ]},
      { type: 'subheading', en: "Recursive vs. Loop-Based k-Sum" },
      { type: 'ul', items: [
        "Recursive k-Sum: Reduces k-Sum to (k-1)-Sum by fixing one number, base case k=2 uses Two-Pointer. Cleaner for large k, but O(k) recursion stack space.",
        "Loop-Based: Uses nested loops for fixed k (e.g., 3Sum with i,j,k). More readable for small k (3 or 4), but code grows complex for larger k.",
        "Time: Both O(n^(k-1)) after O(n log n) sort; Space: Recursive O(k) vs Loop-Based O(1) excluding result.",
        "Recursive better for general k-Sum; loop-based for specific cases like 3Sum."
      ]},
      { type: 'codeBlock', codeBlock: `
function kSum(nums, target, k, start) {
  if (k === 2) { // Recursive base case
    const result = [];
    let left = start, right = nums.length - 1;
    while (left < right) {
      const sum = nums[left] + nums[right];
      if (sum === target) {
        result.push([nums[left], nums[right]]);
        while (left < right && nums[left] === nums[left + 1]) left++;
        while (left < right && nums[right] === nums[right - 1]) right--;
        left++; right--;
      } else if (sum < target) left++;
      else right--;
    }
    return result;
  }
  const result = [];
  for (let i = start; i < nums.length - k + 1; i++) {
    if (i > start && nums[i] === nums[i - 1]) continue;
    const subResults = kSum(nums, target - nums[i], k - 1, i + 1);
    for (let sub of subResults) result.push([nums[i], ...sub]);
  }
  return result;
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Use recursive k-Sum for senior interviews to show scalability."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle large inputs?",
        "What are loop invariants?"
      ] }
    ]
  },
  {
    q: { en: "What are Loop Invariants in Two-Pointer and k-Sum Problems?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Loop Invariants" },
      { type: 'ul', items: [
        "The interviewer might ask 'What are the loop invariants in Two-Pointer problems?' to test your understanding of correctness.",
        "Follow-up: 'How do they ensure the solution works?'",
        "Deeper: 'How do they apply to k-Sum?'"
      ]},
      { type: 'subheading', en: "Loop Invariants" },
      { type: 'ul', items: [
        "Two-Pointer: Maintain left < right, ensuring all pairs between pointers are checked (e.g., LC167: sum checked for target).",
        "k-Sum: For each i, j,k ensure i < j < k and sum invariant (e.g., LC15: nums[j] + nums[k] = -nums[i]).",
        "Invariants guarantee all valid solutions are considered while skipping duplicates.",
        "Prove correctness by showing invariants hold at each step."
      ]},
      { type: 'ascii', ascii: `
LC167: [2,7,11], target=9
Invariant: left < right, sum = nums[left] + nums[right]
left=0, right=2: 2+11=13 > 9, right--
left=0, right=1: 2+7=9, invariant holds
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Explain invariants to prove solution correctness."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle large inputs?",
        "What’s the impact of index adjustments?"
      ] }
    ]
  },
  {
    q: { en: "What’s the Impact of Index Adjustments in Two-Pointer and k-Sum?" },
    level: 'fresher',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Index Adjustments" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you handle index adjustments in Two-Pointer problems?' to test basic implementation.",
        "Follow-up: 'What’s the impact of 1-based vs 0-based indices?'",
        "Deeper: 'How do you avoid off-by-one errors?'"
      ]},
      { type: 'subheading', en: "Index Adjustments" },
      { type: 'ul', items: [
        "LC167 requires 1-based output, so return [left+1, right+1]; internally use 0-based for simplicity.",
        "k-Sum (LC15): Ensure i < j < k to avoid invalid triplets, adjust start indices in loops.",
        "Avoid off-by-one by validating left < right and using correct loop bounds.",
        "Test with small inputs to catch index errors."
      ]},
      { type: 'codeBlock', codeBlock: `
function twoSum(numbers, target) {
  let left = 0, right = numbers.length - 1;
  while (left < right) {
    if (numbers[left] + numbers[right] === target) return [left + 1, right + 1]; // 1-based
  }
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Clarify index base with interviewer."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle large inputs?",
        "How do you optimize for cache locality?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Large Inputs in Two-Pointer and k-Sum?" },
    level: 'senior',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Large Inputs" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you handle large inputs in Two-Pointer or k-Sum problems?' to test scalability.",
        "Follow-up: 'What’s the impact of constraints like n=10^5?'",
        "Deeper: 'How do you optimize for performance?'"
      ]},
      { type: 'subheading', en: "Large Input Handling" },
      { type: 'ul', items: [
        "Two-Pointer (LC11, LC167): O(n) scales well for n=10^5, as single pass is efficient.",
        "k-Sum (LC15): O(n^2) viable for n=3000, but sorting (O(n log n)) adds overhead.",
        "Optimize by minimizing redundant work: skip duplicates, use early termination (LC16).",
        "Use cache-friendly arrays over hash maps to reduce memory overhead."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Test with max constraints (n=3000 for LC15) to ensure efficiency."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you optimize for cache locality?",
        "What’s the role of early termination?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Optimize for Cache Locality in Two-Pointer and k-Sum?" },
    level: 'senior',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Cache Locality" },
      { type: 'ul', items: [
        "The interviewer might ask 'How does cache locality affect Two-Pointer performance?' to test system-level understanding.",
        "Follow-up: 'How does it compare to hash map?'",
        "Deeper: 'How do you minimize cache misses?'"
      ]},
      { type: 'subheading', en: "Cache Locality Optimization" },
      { type: 'ul', items: [
        "Two-Pointer accesses array sequentially (left++, right--), maximizing cache hits.",
        "k-Sum loops (LC15, LC16) benefit from sorted array’s linear access patterns.",
        "Hash maps cause scattered memory access, increasing cache misses.",
        "Minimize jumps by avoiding unnecessary array scans or auxiliary structures."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Highlight cache locality for senior interviews."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What’s the role of early termination?",
        "How do you handle edge cases generically?"
      ] }
    ]
  },
  {
    q: { en: "What’s the Role of Early Termination in Two-Pointer and k-Sum?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Early Termination" },
      { type: 'ul', items: [
        "The interviewer might ask 'How can you use early termination in Two-Pointer or k-Sum?' to test optimization.",
        "Follow-up: 'When is it most effective?'",
        "Deeper: 'How do you implement it?'"
      ]},
      { type: 'subheading', en: "Early Termination" },
      { type: 'ul', items: [
        "LC16: If sum === target, return immediately to skip further checks.",
        "LC15: Skip duplicate i,j,k to avoid redundant work.",
        "LC167: Return first valid pair, as only one solution exists.",
        "Effective when constraints guarantee a solution or duplicates are frequent."
      ]},
      { type: 'codeBlock', codeBlock: `
function threeSumClosest(nums, target) {
  nums.sort((a, b) => a - b);
  let closestSum = nums[0] + nums[1] + nums[2];
  for (let i = 0; i < nums.length - 2; i++) {
    let j = i + 1, k = nums.length - 1;
    while (j < k) {
      const sum = nums[i] + nums[j] + nums[k];
      if (sum === target) return sum; // Early termination
      // Update closestSum
    }
  }
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Implement early termination to show optimization skills."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle edge cases generically?",
        "How do you balance time and space?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Edge Cases Generically in Two-Pointer and k-Sum?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Generic Edge Cases" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you handle edge cases across Two-Pointer problems?' to test robustness.",
        "Follow-up: 'What’s a common edge case strategy?'",
        "Deeper: 'How do you ensure all cases are covered?'"
      ]},
      { type: 'subheading', en: "Generic Edge Case Handling" },
      { type: 'ul', items: [
        "Check array length: Return empty or default for n < k (e.g., n<2 for LC167, n<3 for LC15).",
        "Handle exact matches: Return immediately if solution found (LC16).",
        "Account for duplicates: Skip in k-Sum (LC15) or clarify output (LC167).",
        "Validate constraints: Handle large/negative numbers with no overflow."
      ]},
      { type: 'codeBlock', codeBlock: `
function genericTwoPointer(nums, k) {
  if (nums.length < k) return [];
  nums.sort((a, b) => a - b); // Handle unsorted input
  // Proceed with k-Sum logic
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Test edge cases like n=k or all zeros."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you balance time and space?",
        "What’s the role of problem constraints?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Balance Time and Space in Two-Pointer and k-Sum?" },
    level: 'senior',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Time-Space Trade-Off" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you balance time and space in Two-Pointer or k-Sum?' to test optimization.",
        "Follow-up: 'When do you prefer hash map?'",
        "Deeper: 'How do constraints influence your choice?'"
      ]},
      { type: 'subheading', en: "Time-Space Balance" },
      { type: 'ul', items: [
        "Two-Pointer: O(n) or O(n^2) time, O(1) space (LC11, LC167, LC15).",
        "Hash Map: O(n) for 2Sum, O(n^2) for 3Sum, but O(n) space.",
        "Prefer Two-Pointer for space constraints or sorted input; hash map for unsorted or simpler logic.",
        "Sorting (O(n log n)) often justified for O(n^(k-1)) time reduction."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Discuss trade-offs to show decision-making skills."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What’s the role of problem constraints?",
        "How do you handle interviewer hints?"
      ] }
    ]
  },
  {
    q: { en: "What’s the Role of Problem Constraints in Two-Pointer and k-Sum?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Constraints" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do constraints guide your Two-Pointer solution?' to test problem analysis.",
        "Follow-up: 'How do you use constraints to optimize?'",
        "Deeper: 'What if constraints change?'"
      ]},
      { type: 'subheading', en: "Role of Constraints" },
      { type: 'ul', items: [
        "LC11: n=10^5 suggests O(n) over O(n^2).",
        "LC15: n=3000 allows O(n^2), rules out O(n^3).",
        "LC167: Sorted input, one solution enables O(n) Two-Pointer.",
        "Number ranges (-10^5 to 10^5) ensure no overflow in JS."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Analyze constraints to justify approach."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle interviewer hints?",
        "What’s the revision routine?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Interviewer Hints in Two-Pointer and k-Sum?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Interviewer Hints" },
      { type: 'ul', items: [
        "The interviewer might ask 'What if I say you can sort the array?' to test adaptability.",
        "Follow-up: 'How do you respond to optimization hints?'",
        "Deeper: 'What if they suggest a different approach?'"
      ]},
      { type: 'subheading', en: "Handling Hints" },
      { type: 'ul', items: [
        "Hint: 'Can you optimize?' -> Pivot to Two-Pointer or justify sorting cost.",
        "Hint: 'What if sorted?' -> Use Two-Pointer, avoid hash map unless space allowed.",
        "Hint: 'Try another approach' -> Suggest hash map or recursive k-Sum, compare trade-offs.",
        "Clarify constraints to confirm hint applicability."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Verbalize how hints guide your solution."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What’s the revision routine?",
        "How do you practice for interviews?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Ensure Correctness in Two-Pointer Implementations?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Correctness" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you ensure your Two-Pointer solution is correct?' to test rigor.",
        "Follow-up: 'What tests do you run?'",
        "Deeper: 'How do you prove optimality?'"
      ]},
      { type: 'subheading', en: "Ensuring Correctness" },
      { type: 'ul', items: [
        "Use loop invariants (e.g., left < right, sum checks).",
        "Test edge cases: n=k, all zeros, duplicates, negative numbers.",
        "Dry run with small inputs to verify pointer movement.",
        "Prove optimality by showing all valid pairs/triplets are checked."
      ]},
      { type: 'ascii', ascii: `
LC11: [1,8,6]
Invariant: left < right, maxArea tracks max
left=0, right=2: min(1,6)*2=2, left++ (1<6)
left=1, right=2: min(8,6)*1=6, maxArea=6
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Walk through dry runs in interviews."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you practice for interviews?",
        "What’s the revision routine?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Unsorted Inputs in Two-Pointer and k-Sum?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Unsorted Inputs" },
      { type: 'ul', items: [
        "The interviewer might ask 'What if the input isn’t sorted?' to test preprocessing.",
        "Follow-up: 'Is sorting always worth it?'",
        "Deeper: 'How does it compare to hash map?'"
      ]},
      { type: 'subheading', en: "Unsorted Input Handling" },
      { type: 'ul', items: [
        "Sort input (O(n log n)) for Two-Pointer/k-Sum (LC15, LC16).",
        "Without sorting, use hash map (O(n) for 2Sum, O(n^2) for 3Sum) with O(n) space.",
        "Sorting justified for O(n^(k-1)) time reduction vs O(n^k) brute force.",
        "Clarify if sorting is allowed or input is pre-sorted."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Ask about input properties to optimize approach."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What’s the revision routine?",
        "How do you handle follow-up questions?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Follow-Up Questions in Two-Pointer Interviews?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Follow-Ups" },
      { type: 'ul', items: [
        "The interviewer might ask 'What if we change the problem constraints?' to test adaptability.",
        "Follow-up: 'Can you extend to k-Sum?'",
        "Deeper: 'How do you handle multiple solutions?'"
      ]},
      { type: 'subheading', en: "Handling Follow-Ups" },
      { type: 'ul', items: [
        "Extend to k-Sum: Generalize with recursive approach (LC15).",
        "Multiple solutions: Modify to collect all valid pairs/triplets (LC15).",
        "Change constraints: Adjust for unsorted input, larger k, or space limits.",
        "Verbalize trade-offs for each modification."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Practice common follow-ups like k-Sum extensions."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What’s the revision routine?",
        "How do you prioritize problems?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Optimize Loop Conditions in Two-Pointer and k-Sum?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Loop Optimization" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you optimize loop conditions in Two-Pointer?' to test efficiency.",
        "Follow-up: 'How do you reduce iterations?'",
        "Deeper: 'How do you avoid redundant checks?'"
      ]},
      { type: 'subheading', en: "Loop Optimization" },
      { type: 'ul', items: [
        "Ensure left < right to avoid overlap (LC11, LC167).",
        "k-Sum: Set i < n-k+1 to ensure enough elements for k-tuple (LC15).",
        "Skip duplicates to reduce iterations (LC15).",
        "Use early termination for exact matches (LC16)."
      ]},
      { type: 'codeBlock', codeBlock: `
function threeSum(nums) {
  nums.sort((a, b) => a - b);
  const result = [];
  for (let i = 0; i < nums.length - 2; i++) { // Optimize loop bound
    // Two-Pointer logic
  }
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Check loop bounds to avoid unnecessary iterations."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you prioritize problems?",
        "What’s the revision routine?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Prioritize Problems for Two-Pointer and k-Sum Practice?" },
    level: 'fresher',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Problem Prioritization" },
      { type: 'ul', items: [
        "The interviewer might ask 'Which Two-Pointer problems should you practice first?' to test preparation strategy.",
        "Follow-up: 'Why prioritize certain problems?'",
        "Deeper: 'How do you build intuition?'"
      ]},
      { type: 'subheading', en: "Problem Prioritization" },
      { type: 'ul', items: [
        "Start with LC167 (Two Sum II): Simplest Two-Pointer, O(n), sorted input.",
        "Move to LC11 (Container With Most Water): Tests pointer movement logic.",
        "Tackle LC15 (3Sum): Introduces k-Sum and duplicate handling.",
        "Finish with LC16 (3Sum Closest): Combines k-Sum with closest sum tracking."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Practice in order of complexity to build confidence."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What’s the revision routine?",
        "How do you simulate interview conditions?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Simulate Interview Conditions for Two-Pointer Practice?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Interview Simulation" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you practice Two-Pointer problems for interviews?' to test preparation.",
        "Follow-up: 'How do you handle time pressure?'",
        "Deeper: 'How do you mimic FAANG interviews?'"
      ]},
      { type: 'subheading', en: "Simulating Interview Conditions" },
      { type: 'ul', items: [
        "Time yourself (30-45 min per problem) to mimic FAANG coding rounds.",
        "Explain solutions aloud to practice verbalization.",
        "Use whiteboard or paper for coding to simulate interview constraints.",
        "Practice with peers or mock interviews to handle follow-ups."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Record practice sessions to review explanations."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What’s the revision routine?",
        "How do you handle stress?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Stress in Two-Pointer Interview Questions?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Stress Handling" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you stay calm when solving Two-Pointer problems?' to test composure.",
        "Follow-up: 'What if you get stuck?'",
        "Deeper: 'How do you recover from mistakes?'"
      ]},
      { type: 'subheading', en: "Stress Handling" },
      { type: 'ul', items: [
        "Break problem into steps: Clarify, brute force, optimize, code.",
        "If stuck, revert to brute force and optimize incrementally.",
        "Verbalize thought process to stay focused and engage interviewer.",
        "Practice under timed conditions to build confidence."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Breathe and clarify constraints to reduce stress."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What’s the revision routine?",
        "How do you test solutions?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Test Two-Pointer and k-Sum Solutions?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Testing" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you test your Two-Pointer solution?' to test thoroughness.",
        "Follow-up: 'What test cases do you prioritize?'",
        "Deeper: 'How do you ensure edge case coverage?'"
      ]},
      { type: 'subheading', en: "Testing Solutions" },
      { type: 'ul', items: [
        "Test small inputs: [1,2] for LC167, [-1,0,1] for LC15.",
        "Test edge cases: n=k, all zeros, duplicates, negative numbers.",
        "Test constraints: Max n (10^5 for LC11, 3000 for LC15).",
        "Dry run to verify pointer movements and results."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "List test cases before coding to show preparation."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What’s the revision routine?",
        "How do you optimize for large k?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Optimize for Large k in k-Sum Problems?" },
    level: 'senior',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Large k Optimization" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you handle large k in k-Sum?' to test scalability.",
        "Follow-up: 'What’s the complexity limit?'",
        "Deeper: 'How do you reduce recursive overhead?'"
      ]},
      { type: 'subheading', en: "Large k Optimization" },
      { type: 'ul', items: [
        "Use recursive k-Sum to reduce to Two-Pointer base case (O(n^(k-1))).",
        "Prune search: Skip i if nums[i] * k > target (for positive numbers).",
        "Reduce recursion depth by optimizing base case efficiency.",
        "Limit k in practice (k≤4) due to O(n^(k-1)) complexity."
      ]},
      { type: 'codeBlock', codeBlock: `
function kSum(nums, target, k, start) {
  if (nums[start] * k > target || nums[nums.length - 1] * k < target) return []; // Prune
  // Recursive k-Sum logic
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Practice 4Sum to understand large k."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What’s the revision routine?",
        "How do you explain solutions clearly?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Explain Two-Pointer and k-Sum Solutions Clearly?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Explanation Clarity" },
      { type: 'ul', items: [
        "The interviewer might ask 'Can you explain your solution clearly?' to test communication.",
        "Follow-up: 'How do you simplify complex logic?'",
        "Deeper: 'How do you handle follow-up questions?'"
      ]},
      { type: 'subheading', en: "Explanation Clarity" },
      { type: 'ul', items: [
        "Break down: Problem, brute force, Two-Pointer optimization, code steps.",
        "Use examples: Walk through small input (e.g., [2,7] for LC167).",
        "Draw diagrams: Show pointer movements on whiteboard.",
        "Address follow-ups by relating to original logic."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Practice explaining to non-technical peers."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What’s the revision routine?",
        "How do you handle complex constraints?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Complex Constraints in Two-Pointer and k-Sum?" },
    level: 'senior',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Complex Constraints" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you handle complex constraints like unique solutions or large ranges?' to test adaptability.",
        "Follow-up: 'How do you adjust for new constraints?'",
        "Deeper: 'How do you ensure robustness?'"
      ]},
      { type: 'subheading', en: "Complex Constraints Handling" },
      { type: 'ul', items: [
        "Unique solutions (LC15): Skip duplicates via sorting.",
        "Large ranges (-10^5 to 10^5): Use BigInt if needed, but JS handles LC15 constraints.",
        "New constraints: Adjust loop bounds, add pruning, or switch to hash map.",
        "Test with max constraints to ensure scalability."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Clarify constraints early to tailor solution."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What’s the revision routine?",
        "How do you adapt to real-world problems?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Adapt Two-Pointer and k-Sum to Real-World Problems?" },
    level: 'senior',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Real-World Adaptation" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do Two-Pointer techniques apply to real-world problems?' to test practical application.",
        "Follow-up: 'What’s an example scenario?'",
        "Deeper: 'How do you handle noisy data?'"
      ]},
      { type: 'subheading', en: "Real-World Adaptation" },
      { type: 'ul', items: [
        "Two-Pointer: Optimize pair searches in sorted datasets (e.g., finding closest price pairs in e-commerce).",
        "k-Sum: Find combinations in financial data (e.g., transactions summing to a target).",
        "Noisy data: Preprocess to sort or filter invalid entries.",
        "Scale with distributed systems by partitioning arrays."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Relate to data processing tasks in interviews."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What’s the revision routine?",
        "How do you stay updated on algorithms?"
      ] }
    ]
  },
  // Revision Routine
  {
    q: { en: "What’s the Revision Routine for Two-Pointer and k-Sum in FAANG Interviews?" },
    level: 'intermediate',
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Revision Routine" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you prepare for Two-Pointer and k-Sum problems?' to test your study plan.",
        "Follow-up: 'How often do you revise?'",
        "Deeper: 'How do you ensure retention?'"
      ]},
      { type: 'subheading', en: "Revision Routine" },
      { type: 'ul', items: [
        "Week 1: Learn basics (LC167, LC11) with Two-Pointer, focus on pointer movement and sorted input.",
        "Week 2: Tackle k-Sum (LC15, LC16), master duplicate handling and closest sum tracking.",
        "Week 3: Practice k-Sum generalizations and edge cases (n=3, duplicates, negatives).",
        "Daily: Solve 1-2 problems, explain solutions aloud, test edge cases.",
        "Weekly: Review all 4 problems (LC11, LC167, LC15, LC16), compare brute force vs optimized.",
        "Mock Interviews: Simulate 45-min sessions weekly to handle time pressure."
      ]},
      { type: 'ascii', ascii: `
Revision Plan:
Week 1: LC167, LC11 (O(n) Two-Pointer)
Week 2: LC15, LC16 (O(n^2) k-Sum)
Week 3: k-Sum, edge cases
Daily: 1-2 problems, explain aloud
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Use LeetCode’s problem set and discussion forums for insights."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you stay updated on algorithms?",
        "How do you handle complex problems?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Stay Updated on Two-Pointer and k-Sum Algorithms?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Staying Updated" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you stay current with algorithms like Two-Pointer?' to test learning habits.",
        "Follow-up: 'What resources do you use?'",
        "Deeper: 'How do you apply new techniques?'"
      ]},
      { type: 'subheading', en: "Staying Updated" },
      { type: 'ul', items: [
        "Follow LeetCode discussions for new Two-Pointer/k-Sum problems.",
        "Read blogs like 'DSA Prep Guide' or LeetCode solutions.",
        "Participate in coding contests to see variations (e.g., 4Sum).",
        "Revisit problems periodically to apply new optimizations."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Bookmark LeetCode problems for quick review."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle complex problems?",
        "How do you prioritize time?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Complex Two-Pointer and k-Sum Problems?" },
    level: 'senior',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Complex Problems" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you approach complex Two-Pointer problems?' to test problem-solving.",
        "Follow-up: 'How do you break down complexity?'",
        "Deeper: 'How do you handle follow-ups?'"
      ]},
      { type: 'subheading', en: "Handling Complex Problems" },
      { type: 'ul', items: [
        "Clarify constraints: Sorted input, k value, uniqueness requirements.",
        "Start with brute force, then optimize to Two-Pointer or k-Sum.",
        "Use modular code (e.g., recursive k-Sum) for extensibility.",
        "Test incrementally with small inputs to verify logic."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Practice 4Sum to handle complex k-Sum."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you prioritize time?",
        "How do you optimize explanations?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Prioritize Time in Two-Pointer and k-Sum Preparation?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Time Prioritization" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you allocate time for Two-Pointer practice?' to test efficiency.",
        "Follow-up: 'How do you balance with other patterns?'",
        "Deeper: 'How do you ensure retention?'"
      ]},
      { type: 'subheading', en: "Time Prioritization" },
      { type: 'ul', items: [
        "Allocate 1-2 hours daily for Two-Pointer/k-Sum problems.",
        "Focus 60% on coding, 20% on explaining, 20% on edge cases.",
        "Balance with other patterns (e.g., Sliding Window, Binary Search) weekly.",
        "Review weak areas (e.g., duplicates, k-Sum) more frequently."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Use a study schedule to track progress."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you optimize explanations?",
        "How do you handle unexpected variations?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Optimize Explanations for Two-Pointer and k-Sum?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Explanation Optimization" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you make your Two-Pointer explanations clear?' to test communication.",
        "Follow-up: 'How do you handle complex problems?'",
        "Deeper: 'How do you adapt for non-technical audiences?'"
      ]},
      { type: 'subheading', en: "Optimizing Explanations" },
      { type: 'ul', items: [
        "Structure: Problem, approach, code, example, complexity.",
        "Use analogies: Two-Pointer as 'searching from ends,' k-Sum as 'layered pair searches.'",
        "Simplify: Break k-Sum into Two-Pointer steps.",
        "Practice with peers to refine clarity."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Record explanations to improve delivery."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle unexpected variations?",
        "What’s the revision routine?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Unexpected Variations in Two-Pointer Problems?" },
    level: 'senior',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Variations" },
      { type: 'ul', items: [
        "The interviewer might ask 'What if the problem changes to find all pairs?' to test adaptability.",
        "Follow-up: 'How do you modify your solution?'",
        "Deeper: 'How do you handle new constraints?'"
      ]},
      { type: 'subheading', en: "Handling Variations" },
      { type: 'ul', items: [
        "All pairs: Collect all valid pairs/triplets instead of first (LC15).",
        "Unsorted input: Add sorting or use hash map.",
        "Different k: Extend to k-Sum with recursive approach.",
        "New metrics: Adjust Two-Pointer logic (e.g., max area to min difference)."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Practice variations like 4Sum or all-pairs problems."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What’s the revision routine?",
        "How do you build intuition?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Build Intuition for Two-Pointer and k-Sum Problems?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Building Intuition" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you develop intuition for Two-Pointer problems?' to test learning approach.",
        "Follow-up: 'What patterns do you look for?'",
        "Deeper: 'How do you recognize Two-Pointer applicability?'"
      ]},
      { type: 'subheading', en: "Building Intuition" },
      { type: 'ul', items: [
        "Practice simple problems (LC167) to understand pointer movement.",
        "Visualize with diagrams to see how pointers reduce search space.",
        "Solve related problems (LC11, LC15) to recognize cues like 'pair sum' or 'triplet sum.'",
        "Review solutions to learn optimization patterns."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Draw pointer movements to internalize logic."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What’s the revision routine?",
        "How do you handle time constraints?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Empty or Invalid Inputs in Two-Pointer and k-Sum?" },
    level: 'fresher',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Empty/Invalid Inputs" },
      { type: 'ul', items: [
        "The interviewer might ask 'What if the input array is empty or invalid?' to test robustness.",
        "Follow-up: 'How do you handle constraints like n < k?'",
        "Deeper: 'What’s the impact on your solution?'"
      ]},
      { type: 'subheading', en: "Empty/Invalid Input Handling" },
      { type: 'ul', items: [
        "Check if nums.length < k (e.g., n < 2 for LC167, n < 3 for LC15). Return empty array or default value (LC16).",
        "Handle null/undefined inputs by returning early (though not typical in LeetCode).",
        "Validate constraints upfront to avoid processing invalid inputs.",
        "Impact: Ensures solution handles edge cases without crashing."
      ]},
      { type: 'codeBlock', codeBlock: `
function twoSum(numbers, target) {
  if (!numbers || numbers.length < 2) return [];
  // Proceed with Two-Pointer
}
function threeSum(nums) {
  if (!nums || nums.length < 3) return [];
  // Proceed with k-Sum
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Always check input size before processing."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle overflow?",
        "What are advanced pruning strategies?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Overflow in Two-Pointer and k-Sum Problems?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Overflow Handling" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you handle potential overflow in sums?' to test edge case awareness.",
        "Follow-up: 'What if numbers are very large?'",
        "Deeper: 'How do constraints help?'"
      ]},
      { type: 'subheading', en: "Overflow Handling" },
      { type: 'ul', items: [
        "LC11, LC167, LC15, LC16 constraints (-10^5 ≤ nums[i] ≤ 10^5, n ≤ 3*10^4) ensure no overflow in JavaScript (64-bit numbers).",
        "For larger ranges, use BigInt for sums (e.g., nums[i] + nums[j] in LC167).",
        "Check constraints to confirm overflow risk; clarify with interviewer if ambiguous.",
        "No impact in typical FAANG problems due to bounded constraints."
      ]},
      { type: 'codeBlock', codeBlock: `
function threeSum(nums) {
  nums.sort((a, b) => a - b);
  const result = [];
  for (let i = 0; i < nums.length - 2; i++) {
    let j = i + 1, k = nums.length - 1;
    while (j < k) {
      const sum = BigInt(nums[i]) + BigInt(nums[j]) + BigInt(nums[k]); // Handle overflow
      if (sum === 0n) {
        result.push([nums[i], nums[j], nums[k]]);
        j++; k--;
      } else if (sum < 0n) j++;
      else k--;
    }
  }
  return result;
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Clarify number ranges to address overflow."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What are advanced pruning strategies?",
        "How do you handle sparse arrays?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Sparse Arrays in Two-Pointer and k-Sum?" },
    level: 'senior',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Sparse Arrays" },
      { type: 'ul', items: [
        "The interviewer might ask 'What if the array is sparse or has gaps?' to test adaptability.",
        "Follow-up: 'How do you optimize for sparse inputs?'",
        "Deeper: 'How does it affect Two-Pointer logic?'"
      ]},
      { type: 'subheading', en: "Sparse Array Handling" },
      { type: 'ul', items: [
        "Sparse arrays (e.g., many zeros or gaps) don’t affect Two-Pointer logic, as sorting compacts the array.",
        "Optimize by skipping redundant values (e.g., zeros in LC15) via duplicate handling.",
        "For very sparse data, consider preprocessing to filter non-relevant elements.",
        "No significant impact in LC11, LC167, LC15, LC16 due to dense constraints."
      ]},
      { type: 'ascii', ascii: `
Sparse: [0,0,1,0,2], target=3 (LC167)
Sort: [0,0,0,1,2]
left=0, right=4: 0+2=2 < 3, left++
left=3, right=4: 1+2=3, return [4,5]
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Test with sparse inputs to verify robustness."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What are advanced pruning strategies?",
        "How do you parallelize k-Sum?"
      ] }
    ]
  },
  // Advanced Optimizations
  {
    q: { en: "What are Advanced Pruning Strategies for k-Sum Problems?" },
    level: 'senior',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Pruning Strategies" },
      { type: 'ul', items: [
        "The interviewer might ask 'How can you prune the search space in k-Sum?' to test optimization depth.",
        "Follow-up: 'When is pruning most effective?'",
        "Deeper: 'How do you implement it?'"
      ]},
      { type: 'subheading', en: "Pruning Strategies" },
      { type: 'ul', items: [
        "Skip i if nums[i] * k > target (for positive numbers) or nums[i] * k < target (for negative).",
        "In Two-Pointer, break if remaining elements can’t form a valid sum (e.g., nums[left] + nums[right] > target in LC167).",
        "For LC15, skip i if nums[i] > 0, as sum=0 requires negative numbers.",
        "Effective for large n or frequent duplicates."
      ]},
      { type: 'codeBlock', codeBlock: `
function threeSum(nums) {
  nums.sort((a, b) => a - b);
  const result = [];
  for (let i = 0; i < nums.length - 2; i++) {
    if (nums[i] > 0) break; // Prune: No solution possible
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    // Two-Pointer logic
  }
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Mention pruning to show optimization skills."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you parallelize k-Sum?",
        "What’s the impact of input distribution?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Parallelize k-Sum Problems?" },
    level: 'senior',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Parallelization" },
      { type: 'ul', items: [
        "The interviewer might ask 'Can you parallelize k-Sum for large inputs?' to test system design.",
        "Follow-up: 'What’s the complexity impact?'",
        "Deeper: 'How do you handle synchronization?'"
      ]},
      { type: 'subheading', en: "Parallelizing k-Sum" },
      { type: 'ul', items: [
        "Partition array across threads, each handling a subset of i in k-Sum.",
        "Sort locally, then run Two-Pointer in parallel for each i.",
        "Time: O(n^(k-1)/p) with p threads, but sorting O(n log n) remains sequential.",
        "Synchronization: Merge results, handle duplicates with a shared set."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Discuss parallelization for senior interviews."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What’s the impact of input distribution?",
        "How do you handle memory constraints?"
      ] }
    ]
  },
  {
    q: { en: "What’s the Impact of Input Distribution in Two-Pointer and k-Sum?" },
    level: 'senior',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Input Distribution" },
      { type: 'ul', items: [
        "The interviewer might ask 'How does input distribution affect Two-Pointer performance?' to test system awareness.",
        "Follow-up: 'What if most numbers are similar?'",
        "Deeper: 'How do you optimize for skewed distributions?'"
      ]},
      { type: 'subheading', en: "Input Distribution Impact" },
      { type: 'ul', items: [
        "Uniform: Two-Pointer performs predictably (O(n) for LC167, O(n^2) for LC15).",
        "Skewed (e.g., many duplicates): Duplicate skipping reduces iterations (LC15).",
        "Extreme values: Pruning helps (e.g., skip i > 0 in LC15).",
        "Optimize by analyzing distribution during preprocessing."
      ]},
      { type: 'ascii', ascii: `
nums: [0,0,0,0,1], target=0 (LC15)
Sort: [0,0,0,0,1]
i=0: Skip duplicates, reduce iterations
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Test with skewed inputs to optimize pruning."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle memory constraints?",
        "What are common whiteboard mistakes?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Memory Constraints in Two-Pointer and k-Sum?" },
    level: 'senior',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Memory Constraints" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you optimize Two-Pointer for low memory?' to test efficiency.",
        "Follow-up: 'How does it compare to hash map?'",
        "Deeper: 'How do you handle large result sets?'"
      ]},
      { type: 'subheading', en: "Memory Constraint Handling" },
      { type: 'ul', items: [
        "Two-Pointer: O(1) space (LC11, LC167), ideal for memory constraints.",
        "k-Sum: O(1) excluding result, O(n) for sorting in some implementations.",
        "Avoid hash maps (O(n) space) unless time is critical.",
        "Large result sets (LC15): Stream results or use set for uniqueness."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Emphasize O(1) space for Two-Pointer in interviews."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What are common whiteboard mistakes?",
        "How do you handle k-Sum variations?"
      ] }
    ]
  },
  // Interview-Specific Tips
  {
    q: { en: "What are Common Whiteboard Mistakes in Two-Pointer Interviews?" },
    level: 'fresher',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Whiteboard Mistakes" },
      { type: 'ul', items: [
        "The interviewer might ask 'What mistakes do candidates make on the whiteboard?' to test awareness.",
        "Follow-up: 'How do you avoid them?'",
        "Deeper: 'How do you recover from errors?'"
      ]},
      { type: 'subheading', en: "Common Whiteboard Mistakes" },
      { type: 'ul', items: [
        "Incorrect pointer movement (e.g., moving wrong pointer in LC11).",
        "Off-by-one errors in indices (e.g., LC167 1-based output).",
        "Missing duplicate skips (LC15).",
        "Not clarifying constraints (sorted vs unsorted input)."
      ]},
      { type: 'subheading', en: "Avoidance" },
      { type: 'ul', items: [
        "Dry run on whiteboard with small inputs.",
        "Verbalize logic to catch errors early.",
        "Test edge cases before finalizing code."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Practice whiteboard coding to build fluency."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle k-Sum variations?",
        "How do you optimize whiteboard space?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Optimize Whiteboard Space in Two-Pointer Interviews?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Whiteboard Space" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you manage whiteboard space for Two-Pointer problems?' to test organization.",
        "Follow-up: 'How do you keep code clear?'",
        "Deeper: 'How do you handle complex logic?'"
      ]},
      { type: 'subheading', en: "Optimizing Whiteboard Space" },
      { type: 'ul', items: [
        "Write high-level steps first (e.g., sort, Two-Pointer, duplicate handling).",
        "Use concise variable names (e.g., l, r for left, right).",
        "Draw diagrams for pointer movements (LC11, LC167).",
        "Erase brute force once optimized solution is written."
      ]},
      { type: 'ascii', ascii: `
LC167: [2,7,11]
l=0, r=2: 2+11=13 > 9
l=0, r=1: 2+7=9, return [1,2]
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Practice writing compact code on paper."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle k-Sum variations?",
        "How do you engage the interviewer?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Engage the Interviewer During Two-Pointer Problems?" },
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
        "Verbalize steps: Problem understanding, brute force, optimization, coding.",
        "Ask clarifying questions (e.g., sorted input, index base).",
        "Incorporate hints by adjusting approach (e.g., pivot to Two-Pointer).",
        "Use diagrams to explain pointer movements."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Practice explaining to peers to engage effectively."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle k-Sum variations?",
        "What are common follow-up questions?"
      ] }
    ]
  },
  {
    q: { en: "What are Common Follow-Up Questions for Two-Pointer and k-Sum?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Follow-Up Questions" },
      { type: 'ul', items: [
        "The interviewer might ask 'What follow-ups do you expect for Two-Pointer problems?' to test preparedness.",
        "Follow-up: 'How do you prepare for them?'",
        "Deeper: 'How do you handle unexpected variations?'"
      ]},
      { type: 'subheading', en: "Common Follow-Up Questions" },
      { type: 'ul', items: [
        "LC167: 'What if multiple solutions exist?' (Collect all pairs).",
        "LC15: 'Can you extend to 4Sum or k-Sum?' (Recursive approach).",
        "LC16: 'What if you need the triplet itself?' (Modify to return indices).",
        "General: 'What if input is unsorted?' (Sort or use hash map)."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Practice common follow-ups like k-Sum extensions."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle k-Sum variations?",
        "How do you optimize for specific constraints?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Optimize for Specific Constraints in Two-Pointer Problems?" },
    level: 'senior',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Constraint Optimization" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you optimize for specific constraints like unique solutions?' to test adaptability.",
        "Follow-up: 'How do you handle tight space constraints?'",
        "Deeper: 'How do you balance time and space?'"
      ]},
      { type: 'subheading', en: "Constraint Optimization" },
      { type: 'ul', items: [
        "Unique solutions (LC15): Skip duplicates via sorting.",
        "Tight space: Use Two-Pointer (O(1)) over hash map (O(n)).",
        "Large n: Prune search space (e.g., skip i > 0 in LC15).",
        "Specific targets: Use early termination (LC16)."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Analyze constraints to tailor optimizations."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle k-Sum variations?",
        "How do you practice for edge cases?"
      ] }
    ]
  },
  // Extended k-Sum Variations
  {
    q: { en: "How Do You Handle k-Sum Variations Like 4Sum?" },
    level: 'senior',
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: k-Sum Variations" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you solve 4Sum (LC18)?' to test k-Sum generalization.",
        "Follow-up: 'What’s the complexity?'",
        "Deeper: 'How do you optimize for duplicates?'"
      ]},
      { type: 'subheading', en: "4Sum (LC18) Approach" },
      { type: 'ul', items: [
        "Sort array, fix i,j, use Two-Pointer for k,l to find pairs summing to target-nums[i]-nums[j].",
        "Skip duplicates for i,j,k,l to ensure unique quadruplets.",
        "Time: O(n^3) (O(n^2) for i,j loops + O(n) Two-Pointer); Space: O(1) excluding result.",
        "Generalize to k-Sum with recursive approach for larger k."
      ]},
      { type: 'codeBlock', codeBlock: `
function fourSum(nums, target) {
  nums.sort((a, b) => a - b);
  const result = [];
  for (let i = 0; i < nums.length - 3; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    for (let j = i + 1; j < nums.length - 2; j++) {
      if (j > i + 1 && nums[j] === nums[j - 1]) continue;
      let k = j + 1, l = nums.length - 1;
      while (k < l) {
        const sum = nums[i] + nums[j] + nums[k] + nums[l];
        if (sum === target) {
          result.push([nums[i], nums[j], nums[k], nums[l]]);
          while (k < l && nums[k] === nums[k + 1]) k++;
          while (k < l && nums[l] === nums[l - 1]) l--;
          k++; l--;
        } else if (sum < target) k++;
        else l--;
      }
    }
  }
  return result;
}
      ` },
      { type: 'ascii', ascii: `
nums: [-2,-1,0,0,1,2], target=0
Sort: [-2,-1,0,0,1,2]
i=0, j=1: k=2, l=5: -2+-1+0+2=1 > 0, l--
i=0, j=2: k=3, l=5: -2+0+0+2=0, add [-2,0,0,2]
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Practice 4Sum to master k-Sum extensions."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you practice for edge cases?",
        "How do you handle weighted sums?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Weighted Sums in k-Sum Problems?" },
    level: 'senior',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Weighted Sums" },
      { type: 'ul', items: [
        "The interviewer might ask 'What if each number has a weight in k-Sum?' to test variation handling.",
        "Follow-up: 'How do you modify Two-Pointer?'",
        "Deeper: 'How do you ensure correctness?'"
      ]},
      { type: 'subheading', en: "Weighted Sums Handling" },
      { type: 'ul', items: [
        "Adjust sum calculation: Use weight[i] * nums[i] in sum (e.g., LC15: weight[i] * nums[i] + weight[j] * nums[j] + weight[k] * nums[k] = 0).",
        "Sort by weighted values if needed, then apply Two-Pointer.",
        "Ensure weights don’t affect uniqueness; skip duplicates as usual.",
        "Time: O(n^(k-1)) with sorting; Space: O(1) excluding result."
      ]},
      { type: 'codeBlock', codeBlock: `
function threeSumWeighted(nums, weights, target) {
  const weighted = nums.map((num, i) => ({ num, weight: weights[i], index: i }));
  weighted.sort((a, b) => a.num - b.num);
  const result = [];
  for (let i = 0; i < weighted.length - 2; i++) {
    if (i > 0 && weighted[i].num === weighted[i - 1].num) continue;
    let j = i + 1, k = weighted.length - 1;
    while (j < k) {
      const sum = weighted[i].weight * weighted[i].num +
                  weighted[j].weight * weighted[j].num +
                  weighted[k].weight * weighted[k].num;
      if (sum === target) {
        result.push([weighted[i].index, weighted[j].index, weighted[k].index]);
        j++; k--;
      } else if (sum < target) j++;
      else k--;
    }
  }
  return result;
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Test weighted sums to handle variations."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you practice for edge cases?",
        "How do you handle multiple targets?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Multiple Targets in k-Sum Problems?" },
    level: 'senior',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Multiple Targets" },
      { type: 'ul', items: [
        "The interviewer might ask 'What if you need to find solutions for multiple target sums?' to test flexibility.",
        "Follow-up: 'How do you optimize for multiple targets?'",
        "Deeper: 'How do you handle result aggregation?'"
      ]},
      { type: 'subheading', en: "Multiple Targets Handling" },
      { type: 'ul', items: [
        "Run k-Sum for each target, reusing sorted array.",
        "Optimize by caching Two-Pointer results for overlapping subproblems.",
        "Aggregate results in a map or array per target.",
        "Time: O(t * n^(k-1)) for t targets; Space: O(t) for results."
      ]},
      { type: 'codeBlock', codeBlock: `
function kSumMultipleTargets(nums, targets, k) {
  nums.sort((a, b) => a - b);
  const results = new Map();
  for (let target of targets) {
    results.set(target, kSum(nums, target, k, 0));
  }
  return results;
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Practice multiple-target scenarios for flexibility."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you practice for edge cases?",
        "How do you optimize for streaming inputs?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Optimize for Streaming Inputs in Two-Pointer Problems?" },
    level: 'senior',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Streaming Inputs" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you handle streaming inputs in Two-Pointer?' to test real-world applicability.",
        "Follow-up: 'How do you maintain sorted order?'",
        "Deeper: 'How do you minimize memory usage?'"
      ]},
      { type: 'subheading', en: "Streaming Input Optimization" },
      { type: 'ul', items: [
        "Buffer input in chunks, sort each chunk, and merge for Two-Pointer.",
        "Use a balanced BST (e.g., AVL tree) to maintain sorted order dynamically.",
        "Time: O(n log n) for sorting chunks; Space: O(n) for buffer.",
        "Minimize memory by processing in sliding windows."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Discuss streaming for system design interviews."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you practice for edge cases?",
        "How do you handle dynamic updates?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Dynamic Updates in Two-Pointer Problems?" },
    level: 'senior',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Dynamic Updates" },
      { type: 'ul', items: [
        "The interviewer might ask 'What if the array is updated dynamically?' to test adaptability.",
        "Follow-up: 'How do you maintain solution correctness?'",
        "Deeper: 'How do you optimize for frequent updates?'"
      ]},
      { type: 'subheading', en: "Dynamic Updates Handling" },
      { type: 'ul', items: [
        "Use a balanced BST to insert/delete elements while maintaining sorted order.",
        "Re-run Two-Pointer on updated array or use incremental updates for small changes.",
        "Time: O(log n) per update with BST, O(n) for Two-Pointer per query.",
        "Optimize by batching updates to reduce sorting overhead."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Practice dynamic data structures for advanced interviews."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you practice for edge cases?",
        "How do you optimize for large result sets?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Optimize for Large Result Sets in k-Sum Problems?" },
    level: 'senior',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Large Result Sets" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you handle large result sets in k-Sum?' to test scalability.",
        "Follow-up: 'How do you reduce memory usage?'",
        "Deeper: 'How do you stream results?'"
      ]},
      { type: 'subheading', en: "Large Result Set Optimization" },
      { type: 'ul', items: [
        "Stream results instead of storing (e.g., yield in generators for LC15).",
        "Use a set to ensure uniqueness without storing duplicates.",
        "Time: O(n^(k-1)); Space: O(1) per result if streamed.",
        "Optimize by pruning early to reduce result generation."
      ]},
      { type: 'codeBlock', codeBlock: `
function* threeSumGenerator(nums) {
  nums.sort((a, b) => a - b);
  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    let j = i + 1, k = nums.length - 1;
    while (j < k) {
      const sum = nums[i] + nums[j] + nums[k];
      if (sum === 0) {
        yield [nums[i], nums[j], nums[k]];
        while (j < k && nums[j] === nums[j + 1]) j++;
        while (j < k && nums[k] === nums[k - 1]) k--;
        j++; k--;
      } else if (sum < 0) j++;
      else k--;
    }
  }
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Use generators for large result sets in interviews."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you practice for edge cases?",
        "How do you handle performance bottlenecks?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Practice for Edge Cases in Two-Pointer and k-Sum?" },
    level: 'intermediate',
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Edge Case Practice" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you prepare for edge cases in Two-Pointer problems?' to test thoroughness.",
        "Follow-up: 'What specific cases do you test?'",
        "Deeper: 'How do you ensure coverage?'"
      ]},
      { type: 'subheading', en: "Edge Case Practice" },
      { type: 'ul', items: [
        "Test minimum inputs: n=2 for LC167, n=3 for LC15/LC16.",
        "Test duplicates: [0,0,0] for LC15, [-1,-1,-1] for LC16.",
        "Test extreme values: [-10^5, 10^5] for LC15, large differences for LC16.",
        "Test no solutions: [1,2,3] for LC15, verify closest sum for LC16."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Create a checklist of edge cases for each problem."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle performance bottlenecks?",
        "How do you validate solution correctness?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Performance Bottlenecks in Two-Pointer and k-Sum?" },
    level: 'senior',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Performance Bottlenecks" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you identify and fix performance bottlenecks in k-Sum?' to test optimization.",
        "Follow-up: 'What’s the impact of large n?'",
        "Deeper: 'How do you profile your code?'"
      ]},
      { type: 'subheading', en: "Performance Bottleneck Handling" },
      { type: 'ul', items: [
        "Bottleneck: Sorting (O(n log n)) for LC15, LC16; optimize with efficient sort (e.g., built-in sort).",
        "Bottleneck: Nested loops in k-Sum; reduce with pruning (e.g., skip i > 0 in LC15).",
        "Profile: Log iterations to identify redundant checks.",
        "Large n: Use early termination and duplicate skipping."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Profile with sample inputs to find bottlenecks."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you validate solution correctness?",
        "How do you handle ambiguous requirements?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Validate Solution Correctness in Two-Pointer and k-Sum?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Correctness Validation" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you ensure your Two-Pointer solution is correct?' to test rigor.",
        "Follow-up: 'What tests do you run?'",
        "Deeper: 'How do you use invariants?'"
      ]},
      { type: 'subheading', en: "Correctness Validation" },
      { type: 'ul', items: [
        "Use loop invariants: left < right, sum checks (LC167), i < j < k (LC15).",
        "Test edge cases: Empty arrays, n=k, duplicates, extreme values.",
        "Dry run with small inputs to verify pointer movements.",
        "Compare with brute force for small cases to confirm results."
      ]},
      { type: 'ascii', ascii: `
LC15: [-1,0,1]
i=0, j=1, k=2: -1+0+1=0, invariant holds
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Walk through invariants in interviews."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle ambiguous requirements?",
        "How do you summarize Two-Pointer learnings?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Ambiguous Requirements in Two-Pointer Problems?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Ambiguous Requirements" },
      { type: 'ul', items: [
        "The interviewer might ask 'What if requirements are unclear?' to test problem-solving.",
        "Follow-up: 'What questions do you ask?'",
        "Deeper: 'How do you adapt to clarifications?'"
      ]},
      { type: 'subheading', en: "Ambiguous Requirements Handling" },
      { type: 'ul', items: [
        "Ask: Is input sorted? Are duplicates allowed? Are indices 0-based or 1-based?",
        "Assume defaults: One solution (LC167), unique results (LC15).",
        "Propose brute force, then optimize based on clarifications.",
        "Adapt by modifying Two-Pointer or switching to hash map."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "List clarifying questions before coding."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you summarize Two-Pointer learnings?",
        "How do you prepare for FAANG coding rounds?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Summarize Two-Pointer and k-Sum Learnings for Interviews?" },
    level: 'intermediate',
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Summarizing Learnings" },
      { type: 'ul', items: [
        "The interviewer might ask 'What are the key takeaways from Two-Pointer and k-Sum?' to test understanding.",
        "Follow-up: 'How do you apply these to other problems?'",
        "Deeper: 'What makes Two-Pointer effective?'"
      ]},
      { type: 'subheading', en: "Summarizing Learnings" },
      { type: 'ul', items: [
        "Two-Pointer: O(n) or O(n^2) for pair/triplet searches, O(1) space, ideal for sorted inputs.",
        "k-Sum: Generalizes to O(n^(k-1)) with sorting, handles duplicates via skips.",
        "Key optimizations: Early termination, pruning, cache locality.",
        "Apply to problems with sum, area, or pair searches (e.g., LC11, LC15)."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Summarize learnings to show pattern mastery."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you prepare for FAANG coding rounds?",
        "How do you handle time pressure?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Prepare for FAANG Coding Rounds with Two-Pointer Problems?" },
    level: 'intermediate',
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: FAANG Preparation" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you prepare for FAANG coding rounds?' to test your strategy.",
        "Follow-up: 'What’s your practice routine?'",
        "Deeper: 'How do you handle high-pressure rounds?'"
      ]},
      { type: 'subheading', en: "FAANG Coding Round Preparation" },
      { type: 'ul', items: [
        "Practice core problems: LC11, LC167, LC15, LC16, LC18.",
        "Simulate timed conditions (30-45 min per problem).",
        "Explain solutions aloud to build communication skills.",
        "Test edge cases and follow-ups to handle interviewer probes."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Use LeetCode’s premium mock interviews for practice."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle time pressure?",
        "How do you ensure code readability?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Ensure Code Readability in Two-Pointer Solutions?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Code Readability" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you make your Two-Pointer code readable?' to test coding style.",
        "Follow-up: 'How do you balance readability and speed?'",
        "Deeper: 'How do you structure complex k-Sum code?'"
      ]},
      { type: 'subheading', en: "Ensuring Code Readability" },
      { type: 'ul', items: [
        "Use clear variable names (e.g., left, right, i, j, k).",
        "Comment key steps (e.g., sorting, duplicate skipping).",
        "Structure k-Sum recursively for modularity.",
        "Indent consistently and avoid nested logic where possible."
      ]},
      { type: 'codeBlock', codeBlock: `
function threeSum(nums) {
  nums.sort((a, b) => a - b); // Sort array
  const result = [];
  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue; // Skip duplicates
    let left = i + 1, right = nums.length - 1; // Two-Pointer
    while (left < right) {
      // Sum and pointer logic
    }
  }
  return result;
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Write clean code to impress interviewers."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle time pressure?",
        "How do you debug complex k-Sum?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Debug Complex k-Sum Solutions?" },
    level: 'senior',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Debugging k-Sum" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you debug a complex k-Sum solution?' to test problem-solving.",
        "Follow-up: 'What common errors do you look for?'",
        "Deeper: 'How do you handle recursive k-Sum?'"
      ]},
      { type: 'subheading', en: "Debugging k-Sum" },
      { type: 'ul', items: [
        "Trace i,j,k,l for small inputs (e.g., [-1,0,1,2] for LC18).",
        "Log sum and duplicate skips to verify logic.",
        "Common errors: Incorrect loop bounds, missing duplicate skips, recursive base case errors.",
        "For recursive k-Sum, log recursion depth and subproblem results."
      ]},
      { type: 'ascii', ascii: `
LC18: [-1,0,1,2], target=2
i=0, j=1: k=2, l=3: -1+0+1+2=2, add [-1,0,1,2]
Error: Missing duplicate skip -> duplicate quadruplets
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Dry run recursive k-Sum to catch errors."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle time pressure?",
        "How do you optimize for FAANG interviews?"
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

  const { html, sidebarLinks } = buildSlidingWindowFAQSection('sliding-window-faqs', 'Sliding Window Patterns FAQs', slidingWindowQA);
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
