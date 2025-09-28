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


/* ========== FAQ data for Prefix Sum & Monotonic Queue Patterns ========== */
const prefixSumMonotonicQueueQA = [
  {
    q: { en: "Overview of Prefix Sum & Monotonic Queue Patterns and FAANG Job Preparation" },
    level: 'fresher',
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Pattern Overview" },
      { type: 'ul', items: [
        "The interviewer might ask 'What are the Prefix Sum and Monotonic Queue patterns, and how are they used in FAANG interviews?' to gauge your understanding of these techniques.",
        "Follow-up: 'How do these patterns optimize problems compared to brute force?' expecting a focus on O(n) solutions.",
        "Deeper: 'What types of problems benefit most from these patterns?' testing your ability to recognize applicability."
      ]},
      { type: 'subheading', en: "Pattern Overview" },
      { type: 'ul', items: [
        "Prefix Sum precomputes cumulative sums (or other operations) to answer subarray/range queries efficiently, reducing repeated calculations (e.g., O(n) to O(1) for range sums in LC303).",
        "Monotonic Queue (or Deque) maintains a queue of elements in increasing or decreasing order, used for sliding window problems to track max/min in O(n) time (e.g., LC239).",
        "In FAANG interviews, these patterns are critical for array and range-based problems, often requiring O(n) or O(1) query solutions, testing your ability to optimize and handle edge cases.",
        "Common problems: Subarray sums (LC560, LC523), range queries (LC303), and sliding window extrema (LC239). They’re often paired with hash maps or deques for efficiency."
      ]},
      { type: 'subheading', en: "FAANG Prep Tips" },
      { type: 'ul', items: [
        "Master prefix sum for sum-based problems and extend to 2D matrices for advanced problems.",
        "Practice monotonic deques for both increasing and decreasing order to handle max/min queries.",
        "Prove O(n) efficiency in interviews by showing each element is processed once, impressing interviewers with clarity."
      ]},
      { type: 'ascii', ascii: `
Prefix Sum: [1,2,3,4] -> [0,1,3,6,10]
Range [1,3]: sum = prefix[3] - prefix[0] = 10-0 = 10
Monotonic Deque: [3,1,4,2], k=3
Window [3,1,4]: deque=[4] (max)
Slide: deque=[4,2]
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Start with simple prefix sum problems (e.g., LC303) before tackling monotonic queues (LC239)."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What is the Prefix Sum pattern?",
        "What is a Monotonic Queue?"
      ] }
    ]
  },
  {
    q: { en: "What is the Prefix Sum Pattern?" },
    level: 'fresher',
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Prefix Sum Basics" },
      { type: 'ul', items: [
        "The interviewer might ask 'Explain the Prefix Sum pattern and how it works,' to test your foundational knowledge.",
        "Follow-up: 'How does it reduce time complexity?' expecting a comparison with brute force.",
        "Deeper: 'When would you use Prefix Sum over other techniques?'"
      ]},
      { type: 'subheading', en: "Prefix Sum Explanation" },
      { type: 'ul', items: [
        "Prefix Sum precomputes cumulative sums for an array, where prefix[i] = arr[0] + arr[1] + ... + arr[i], allowing range sum queries in O(1) time after O(n) preprocessing.",
        "For range [i,j], sum = prefix[j] - prefix[i-1], avoiding O(n) per query as in brute force.",
        "Used in problems like LC303 (range sum queries) and LC560 (subarray sum equals k), often with hash maps for frequency counting.",
        "Can extend to 2D arrays for matrix problems or modulo operations for divisibility checks (LC523)."
      ]},
      { type: 'ascii', ascii: `
Array: [1, 2, 3, 4]
Prefix: [0, 1, 3, 6, 10]
Query [1,3]: sum = prefix[3] - prefix[0] = 10 - 0 = 10
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Always include a 0 at prefix[0] to handle queries starting at index 0."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What is a Monotonic Queue?",
        "How do you handle negative numbers in Prefix Sum?"
      ] }
    ]
  },
  {
    q: { en: "What is a Monotonic Queue?" },
    level: 'intermediate',
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Monotonic Queue Basics" },
      { type: 'ul', items: [
        "The interviewer might ask 'What is a Monotonic Queue, and how is it used in Sliding Window problems?' to test your understanding of deque-based optimization.",
        "Follow-up: 'How does it differ from a regular queue?'",
        "Deeper: 'Why does it achieve O(n) for max/min queries?'"
      ]},
      { type: 'subheading', en: "Monotonic Queue Explanation" },
      { type: 'ul', items: [
        "A Monotonic Queue (or Deque) maintains elements in increasing or decreasing order, removing elements that are no longer useful (e.g., smaller than current for max queue).",
        "Used in sliding window problems like LC239 to find max/min in k-sized windows, popping out-of-window or non-optimal elements.",
        "Achieves O(n) by ensuring each element is pushed/popped at most once, unlike heap’s O(n log k).",
        "For max, deque stores indices of decreasing values; for min, increasing values."
      ]},
      { type: 'ascii', ascii: `
Array: [3, 1, 4, 2], k=3
Deque (max): [0] (3), pop smaller [1] (4), [1,3] (4,2)
Window max: 4
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Practice deque operations (push_back, pop_front, pop_back) for fluency."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you identify a Prefix Sum or Monotonic Queue problem?",
        "What are common data structures for these patterns?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Identify a Prefix Sum or Monotonic Queue Problem in an Interview?" },
    level: 'intermediate',
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Recognition Cues" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you recognize when to use Prefix Sum or Monotonic Queue in a problem?' to test your pattern recognition.",
        "Follow-up: 'What keywords or constraints hint at these patterns?'",
        "Deeper: 'How do you confirm it’s the best approach?'"
      ]},
      { type: 'subheading', en: "Recognition Cues" },
      { type: 'ul', items: [
        "Prefix Sum: Look for 'subarray sum,' 'range sum,' 'count subarrays with sum k,' or 'multiple queries,' as in LC560, LC303, LC523.",
        "Monotonic Queue: Look for 'sliding window max/min,' 'k-sized windows,' or 'largest/smallest in range,' as in LC239.",
        "Constraints like O(n) time or large n (10^5) suggest these patterns over brute force O(n^2).",
        "Interviewer hints: 'Can you optimize this?' or 'What if we have many queries?' point to Prefix Sum or Monotonic Queue."
      ]},
      { type: 'ascii', ascii: `
+-------------------+--------------------+---------------------+
| Keyword           | Pattern            | Example Problem     |
+-------------------+--------------------+---------------------+
| Subarray sum      | Prefix Sum         | LC560, LC523        |
| Range query       | Prefix Sum         | LC303               |
| Sliding max/min   | Monotonic Queue    | LC239               |
| Count subarrays   | Prefix Sum         | LC560               |
+-------------------+--------------------+---------------------+
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Check problem constraints for large n or query counts to choose these patterns."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What are common data structures for these patterns?",
        "What’s the brute force approach for LC560?"
      ] }
    ]
  },
  {
    q: { en: "What are Common Data Structures for Prefix Sum and Monotonic Queue?" },
    level: 'fresher',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Data Structures" },
      { type: 'ul', items: [
        "The interviewer might ask 'What data structures do you use for Prefix Sum and Monotonic Queue problems?' to test your implementation choices.",
        "Follow-up: 'How do they affect complexity?'",
        "Deeper: 'When do you choose arrays vs maps?'"
      ]},
      { type: 'subheading', en: "Data Structures" },
      { type: 'ul', items: [
        "Prefix Sum: Arrays for prefix sums (O(n) space, O(1) access), hash maps for frequency counting in sum problems (LC560, LC523).",
        "Monotonic Queue: Deque (double-ended queue) for O(1) push/pop at both ends, storing indices or values in monotonic order (LC239).",
        "Arrays are cache-friendly and simple for fixed ranges; maps handle sparse or dynamic data but have higher constant factors.",
        "In FAANG, prefer arrays for prefix sums and deques for monotonic queues unless large alphabets require maps."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Use arrays for prefix sums unless modulo or frequency tracking requires maps."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle negative numbers in Prefix Sum?",
        "What’s the role of deques in Monotonic Queue?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Negative Numbers in Prefix Sum?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Negative Numbers" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do negative numbers affect Prefix Sum solutions?' to test edge case handling.",
        "Follow-up: 'What if all numbers are negative?'",
        "Deeper: 'How does this impact problems like LC560?'"
      ]},
      { type: 'subheading', en: "Negative Number Handling" },
      { type: 'ul', items: [
        "Negative numbers don’t change Prefix Sum logic: prefix[i] = prefix[i-1] + arr[i], and range sum = prefix[j] - prefix[i-1], valid for positive, negative, or zero.",
        "In LC560, negative sums are handled by hash map storing prefix sums, counting subarrays with sum k regardless of sign.",
        "All negative numbers (e.g., [-1,-2,-3]) still produce valid prefix sums (e.g., [0,-1,-3,-6]), and queries work normally.",
        "Check for overflow with large negatives, using BigInt in JS if arr[i] exceeds 10^9."
      ]},
      { type: 'ascii', ascii: `
Array: [-1, 2, -3]
Prefix: [0, -1, 1, -2]
Sum [0,2]: prefix[2] - prefix[-1] = -2 - 0 = -2
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Clarify input range to handle overflow in interviews."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What’s the role of deques in Monotonic Queue?",
        "How do you handle zeros?"
      ] }
    ]
  },
  {
    q: { en: "What’s the Role of Deques in Monotonic Queue?" },
    level: 'intermediate',
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Deque Role" },
      { type: 'ul', items: [
        "The interviewer might ask 'How does a deque work in Monotonic Queue problems?' to test your understanding of deque operations.",
        "Follow-up: 'Why use a deque over a heap?'",
        "Deeper: 'How does it ensure O(n) time?'"
      ]},
      { type: 'subheading', en: "Deque Role" },
      { type: 'ul', items: [
        "A deque (double-ended queue) supports O(1) push/pop at both ends, ideal for maintaining a monotonic sequence (e.g., decreasing for max, increasing for min).",
        "In LC239, store indices of elements in decreasing order; pop front if out of window, pop back if new element is larger, ensuring front is always max.",
        "O(n) time: Each element is pushed/popped at most once, as each index enters and leaves the deque exactly once.",
        "Space: O(k) for window size k, storing at most k indices."
      ]},
      { type: 'ascii', ascii: `
Array: [3, 1, 4, 2], k=3
Deque: [0] (3)
Push 1: [0,1] (3,1)
Push 4: [2] (4, pop smaller 3,1)
Push 2: [2,3] (4,2)
Max: arr[2]=4
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Practice deque operations with small inputs to master push/pop logic."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle zeros in Prefix Sum?",
        "What’s the brute force for LC560?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Zeros in Prefix Sum?" },
    level: 'fresher',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Zero Handling" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do zeros affect Prefix Sum solutions?' to test edge case awareness.",
        "Follow-up: 'What if the array is all zeros?'",
        "Deeper: 'How does this impact LC560 or LC523?'"
      ]},
      { type: 'subheading', en: "Zero Handling" },
      { type: 'ul', items: [
        "Zeros contribute 0 to prefix sums, so prefix[i] = prefix[i-1], causing no change in sum but valid for range queries.",
        "In LC560, zeros increase prefix sum frequency (e.g., prefix=0 occurs multiple times), boosting subarray counts for sum k=0.",
        "All zeros (e.g., [0,0,0]) give prefix [0,0,0,0], and queries return 0; in LC523, check for length ≥ 2 for valid subarrays.",
        "No special handling needed, but clarify if k=0 is valid in interviews."
      ]},
      { type: 'ascii', ascii: `
Array: [0, 2, 0]
Prefix: [0, 0, 2, 2]
Sum [0,2]: prefix[2] - prefix[-1] = 2 - 0 = 2
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Test with all-zero arrays to ensure correctness."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What’s the brute force for LC560?",
        "How do you handle empty arrays?"
      ] }
    ]
  },
  // Problem 1: Subarray Sum Equals K (LC560)
  {
    q: { en: "Problem Statement: Subarray Sum Equals K (LC560)" },
    level: 'intermediate',
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Problem Understanding" },
      { type: 'ul', items: [
        "The interviewer might state 'Given an array of integers and an integer k, return the number of subarrays that sum to k.' This tests Prefix Sum with hash map usage.",
        "Follow-up: 'What if the array has negative numbers?'",
        "Deeper: 'Can you return the subarrays themselves?'"
      ]},
      { type: 'subheading', en: "Problem Explanation" },
      { type: 'ul', items: [
        "Count subarrays in arr where sum equals k (e.g., arr=[1,1,1], k=2, return 2 for [1,1] at indices 0-1 and 1-2).",
        "Constraints: 1 <= arr.length <= 2*10^4, -1000 <= arr[i] <= 1000, -10^7 <= k <= 10^7, expecting O(n) solution.",
        "Prefix Sum with hash map: Track prefix sums and their frequencies, counting subarrays where prefix[j] - prefix[i] = k.",
        "FAANG favorite for testing prefix sum optimization and edge case handling."
      ]},
      { type: 'ascii', ascii: `
Array: [1, 1, 1], k=2
Prefix: [0, 1, 2, 3]
Map: {0:1, 1:1, 2:1}
Check: prefix[2]-k=2-2=0 (count=1), prefix[3]-k=3-2=1 (count=1)
Result: 2
      ` },
      { type: 'subheading', en: "Key Interview Insight" },
      { type: 'ul', items: [
        "Clarify if k=0 or negatives are included."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What’s the brute force approach?",
        "How do you optimize with Prefix Sum?"
      ] }
    ]
  },
  {
    q: { en: "Brute Force Approach for Subarray Sum Equals K (LC560)" },
    level: 'fresher',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Brute Force" },
      { type: 'ul', items: [
        "The interviewer might ask 'How would you solve LC560 without optimization?' to establish a baseline.",
        "Follow-up: 'What’s the complexity?' expecting O(n^2).",
        "Deeper: 'Why is this inefficient?'"
      ]},
      { type: 'subheading', en: "Brute Force Approach" },
      { type: 'ul', items: [
        "Check every subarray by iterating start (i) and end (j) indices, summing elements in O(n) per subarray.",
        "For n^2 subarrays, total time is O(n^2), space O(1) excluding output.",
        "Inefficient for large n (e.g., 2*10^4), as repeated sum calculations waste time."
      ]},
      { type: 'codeBlock', codeBlock: `
function subarraySumBrute(nums, k) {
  let count = 0;
  for (let i = 0; i < nums.length; i++) {
    let sum = 0;
    for (let j = i; j < nums.length; j++) {
      sum += nums[j];
      if (sum === k) count++;
    }
  }
  return count;
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Explain brute force to show problem understanding, then pivot to optimized."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you optimize with Prefix Sum?",
        "What data structure tracks sums?"
      ] }
    ]
  },
  {
    q: { en: "Optimized Prefix Sum Approach for Subarray Sum Equals K (LC560)" },
    level: 'intermediate',
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Optimization" },
      { type: 'ul', items: [
        "The interviewer might ask 'How can you optimize LC560 using Prefix Sum?' expecting a hash map approach.",
        "Follow-up: 'What’s the complexity?' expecting O(n).",
        "Deeper: 'How do you handle negative numbers?'"
      ]},
      { type: 'subheading', en: "Optimized Approach" },
      { type: 'ul', items: [
        "Use Prefix Sum with a hash map: For each index i, compute prefix sum and store frequency in map.",
        "For prefix[i], check if prefix[i] - k exists in map; if so, add its frequency to count, as it represents subarrays ending at i with sum k.",
        "Handle prefix sum 0 by initializing map with {0:1} to count subarrays starting at 0.",
        "Time: O(n) as each element is processed once; Space: O(n) for map."
      ]},
      { type: 'codeBlock', codeBlock: `
function subarraySum(nums, k) {
  const map = new Map([[0, 1]]);
  let sum = 0, count = 0;
  for (let num of nums) {
    sum += num;
    if (map.has(sum - k)) count += map.get(sum - k);
    map.set(sum, (map.get(sum) || 0) + 1);
  }
  return count;
}
      ` },
      { type: 'ascii', ascii: `
nums: [1, 1, 1], k=2
sum=0, map={0:1}
sum=1, map={0:1, 1:1}
sum=2, map={0:1, 1:1, 2:1}, count+=map[2-2]=1
sum=3, map={0:1, 1:1, 2:1, 3:1}, count+=map[3-2]=1
Result: 2
      ` },
      { type: 'subheading', en: "Complexity" },
      { type: 'ul', items: [
        "Time: O(n), single pass with O(1) map operations.",
        "Space: O(n), map stores prefix sums."
      ]},
      { type: 'subheading', en: "Key Interview Insight" },
      { type: 'ul', items: [
        "Explain how map tracks subarray sums to show optimization."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What are the edge cases?",
        "How do you handle duplicates?"
      ] }
    ]
  },
  {
    q: { en: "What are the Edge Cases for Subarray Sum Equals K (LC560)?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Edge Cases" },
      { type: 'ul', items: [
        "The interviewer might ask 'What edge cases do you need to handle for LC560?' to ensure robust code.",
        "Follow-up: 'What if k=0 or array is empty?'",
        "Deeper: 'How do negative numbers affect the solution?'"
      ]},
      { type: 'subheading', en: "Edge Cases" },
      { type: 'ul', items: [
        "Empty array: Return 0, as no subarrays exist.",
        "k=0: Count subarrays with sum 0, handled by map[0] initialization.",
        "All zeros: Multiple subarrays sum to 0, increasing map[0] frequency.",
        "Negative numbers: Prefix sums work naturally, as subtraction handles signs.",
        "Large k (e.g., 10^7): No special handling, but use BigInt if overflow risk."
      ]},
      { type: 'codeBlock', codeBlock: `
function subarraySum(nums, k) {
  if (!nums.length) return 0;
  const map = new Map([[0, 1]]);
  // Proceed with prefix sum
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Initialize map with {0:1} to handle k=0 and prefix sums starting at 0."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle duplicates?",
        "What are the trade-offs?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Duplicates in Subarray Sum Equals K (LC560)?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Duplicate Handling" },
      { type: 'ul', items: [
        "The interviewer might ask 'How does your solution handle duplicate prefix sums in LC560?' to test frequency management.",
        "Follow-up: 'What if there are many subarrays with sum k?'",
        "Deeper: 'How does this affect performance?'"
      ]},
      { type: 'subheading', en: "Duplicate Handling" },
      { type: 'ul', items: [
        "Duplicates in prefix sums are handled by incrementing frequency in the map (e.g., map.set(sum, map.get(sum) + 1)).",
        "When checking sum - k, add map.get(sum - k) to count, capturing all subarrays ending at current index with sum k.",
        "Many duplicates (e.g., [1,1,1,1], k=2) increase map frequencies, correctly counting multiple valid subarrays.",
        "Performance remains O(n), as map operations are O(1) average case."
      ]},
      { type: 'ascii', ascii: `
nums: [1, 1, 1, 1], k=2
sum=1, map={0:1, 1:1}
sum=2, map={0:1, 1:1, 2:1}, count+=map[2-2]=1
sum=3, map={0:1, 1:1, 2:1, 3:1}, count+=map[3-2]=1
sum=4, map={0:1, 1:1, 2:2, 3:1}, count+=map[4-2]=2
Result: 4
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Explain map frequency updates to show clarity."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What are the trade-offs?",
        "What’s the next problem?"
      ] }
    ]
  },
  {
    q: { en: "What are the Trade-Offs of the Prefix Sum Approach for Subarray Sum Equals K (LC560)?" },
    level: 'senior',
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Trade-Off Analysis" },
      { type: 'ul', items: [
        "The interviewer might ask 'What are the trade-offs of using Prefix Sum for LC560?' to test optimization awareness.",
        "Follow-up: 'How does it compare to Sliding Window?'",
        "Deeper: 'When is Prefix Sum less effective?'"
      ]},
      { type: 'subheading', en: "Trade-Offs" },
      { type: 'ul', items: [
        "Prefix Sum with hash map achieves O(n) time vs brute force O(n^2), ideal for large n.",
        "Space is O(n) for map, higher than brute force O(1), but justified for performance.",
        "Unlike Sliding Window, Prefix Sum handles non-contiguous subarrays and negative numbers naturally, but requires map for frequency counting.",
        "Less effective if k is constrained (e.g., positive only) where Sliding Window might apply."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Compare to Sliding Window in interviews to show depth."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What’s the next problem?",
        "How do you extend to 2D prefix sums?"
      ] }
    ]
  },
  // Problem 2: Range Sum Query (LC303)
  {
    q: { en: "Problem Statement: Range Sum Query (LC303)" },
    level: 'fresher',
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Problem Understanding" },
      { type: 'ul', items: [
        "The interviewer might state 'Given an array, implement a class to answer multiple range sum queries.' This tests basic Prefix Sum application.",
        "Follow-up: 'What if the array is updated?'",
        "Deeper: 'How do you optimize for many queries?'"
      ]},
      { type: 'subheading', en: "Problem Explanation" },
      { type: 'ul', items: [
        "Implement a class with a constructor to initialize array and a method sumRange(i,j) to return sum of elements from i to j (e.g., [-2,0,3,-5,2,-1], sumRange(2,5)=0).",
        "Constraints: 1 <= nums.length <= 10^4, -10^5 <= nums[i] <= 10^5, 0 <= i <= j < nums.length, many queries.",
        "Prefix Sum: Precompute prefix sums for O(n) initialization and O(1) query time.",
        "FAANG easy problem to test preprocessing efficiency."
      ]},
      { type: 'ascii', ascii: `
nums: [-2, 0, 3, -5, 2, -1]
prefix: [0, -2, -2, 1, -4, -2, -3]
sumRange(2,5): prefix[5] - prefix[1] = -2 - (-2) = 0
      ` },
      { type: 'subheading', en: "Key Interview Insight" },
      { type: 'ul', items: [
        "Clarify if array updates are required (not in LC303)."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What’s the brute force approach?",
        "How do you optimize with Prefix Sum?"
      ] }
    ]
  },
  {
    q: { en: "Brute Force Approach for Range Sum Query (LC303)" },
    level: 'fresher',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Brute Force" },
      { type: 'ul', items: [
        "The interviewer might ask 'How would you solve LC303 without optimization?' to establish a baseline.",
        "Follow-up: 'What’s the complexity?' expecting O(n) per query.",
        "Deeper: 'Why is this inefficient for many queries?'"
      ]},
      { type: 'subheading', en: "Brute Force Approach" },
      { type: 'ul', items: [
        "For each sumRange(i,j), iterate from i to j, summing elements in O(j-i+1) time.",
        "Time: O(n) per query, O(n*m) for m queries; Space: O(1).",
        "Inefficient for many queries (e.g., 10^4), as it recomputes sums repeatedly."
      ]},
      { type: 'codeBlock', codeBlock: `
class NumArray {
  constructor(nums) {
    this.nums = nums;
  }
  sumRange(left, right) {
    let sum = 0;
    for (let i = left; i <= right; i++) sum += this.nums[i];
    return sum;
  }
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Explain brute force to set up optimization discussion."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you optimize with Prefix Sum?",
        "What are edge cases?"
      ] }
    ]
  },
  {
    q: { en: "Optimized Prefix Sum Approach for Range Sum Query (LC303)" },
    level: 'fresher',
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Optimization" },
      { type: 'ul', items: [
        "The interviewer might ask 'How can you optimize LC303 for many queries?' expecting Prefix Sum.",
        "Follow-up: 'What’s the complexity?' expecting O(1) query.",
        "Deeper: 'How do you handle negative numbers?'"
      ]},
      { type: 'subheading', en: "Optimized Approach" },
      { type: 'ul', items: [
        "Precompute prefix sums in constructor: prefix[i] = nums[0] + ... + nums[i-1].",
        "For sumRange(i,j), return prefix[j+1] - prefix[i], achieving O(1) query time.",
        "Time: O(n) for initialization, O(1) per query; Space: O(n) for prefix array.",
        "Handles negatives and zeros naturally via subtraction."
      ]},
      { type: 'codeBlock', codeBlock: `
class NumArray {
  constructor(nums) {
    this.prefix = new Array(nums.length + 1).fill(0);
    for (let i = 0; i < nums.length; i++) {
      this.prefix[i + 1] = this.prefix[i] + nums[i];
    }
  }
  sumRange(left, right) {
    return this.prefix[right + 1] - this.prefix[left];
  }
}
      ` },
      { type: 'ascii', ascii: `
nums: [-2, 0, 3]
prefix: [0, -2, -2, 1]
sumRange(1,2): prefix[3] - prefix[1] = 1 - (-2) = 3
      ` },
      { type: 'subheading', en: "Complexity" },
      { type: 'ul', items: [
        "Time: O(n) init, O(1) query.",
        "Space: O(n) for prefix array."
      ]},
      { type: 'subheading', en: "Key Interview Insight" },
      { type: 'ul', items: [
        "Explain O(1) query advantage for many queries."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What are edge cases?",
        "What if array updates are allowed?"
      ] }
    ]
  },
  {
    q: { en: "What are the Edge Cases for Range Sum Query (LC303)?" },
    level: 'fresher',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Edge Cases" },
      { type: 'ul', items: [
        "The interviewer might ask 'What edge cases do you need to handle for LC303?' to ensure robustness.",
        "Follow-up: 'What if i equals j?'",
        "Deeper: 'How do you handle large numbers?'"
      ]},
      { type: 'subheading', en: "Edge Cases" },
      { type: 'ul', items: [
        "Empty array: Not applicable, as constraints ensure n ≥ 1.",
        "i = j: Return nums[i], handled by prefix[j+1] - prefix[j].",
        "All zeros: Returns 0 for any range, works naturally.",
        "Large numbers (e.g., 10^5): Use BigInt if overflow risk, though rare in LC303."
      ]},
      { type: 'codeBlock', codeBlock: `
class NumArray {
  constructor(nums) {
    if (!nums.length) throw new Error("Empty array");
    this.prefix = new Array(nums.length + 1).fill(0);
    // Proceed with prefix sum
  }
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Validate i ≤ j in sumRange if not guaranteed by constraints."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What if array updates are allowed?",
        "What’s the next problem?"
      ] }
    ]
  },
  {
    q: { en: "What If Array Updates Are Allowed in Range Sum Query?" },
    level: 'senior',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Updates" },
      { type: 'ul', items: [
        "The interviewer might ask 'How would you modify LC303 to handle array updates?' to test advanced data structures.",
        "Follow-up: 'What’s the complexity with updates?'",
        "Deeper: 'Why not use Prefix Sum alone?'"
      ]},
      { type: 'subheading', en: "Handling Updates" },
      { type: 'ul', items: [
        "Prefix Sum alone requires O(n) to rebuild array per update, inefficient for frequent updates.",
        "Use a Segment Tree or Fenwick Tree for O(log n) updates and queries, balancing initialization (O(n)) and dynamic changes.",
        "For update at index i, adjust all prefix[j] for j > i, or use tree-based structures to update ranges efficiently.",
        "In FAANG, clarify update frequency to choose between rebuilding prefix or using advanced structures."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Propose Segment Tree for updates unless simpler solution suffices."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What’s the next problem?",
        "How do you extend to 2D prefix sums?"
      ] }
    ]
  },
  // Problem 3: Sliding Window Maximum (LC239)
  {
    q: { en: "Problem Statement: Sliding Window Maximum (LC239)" },
    level: 'intermediate',
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Problem Understanding" },
      { type: 'ul', items: [
        "The interviewer might state 'Given an array and window size k, return the maximum element in each k-sized window.' This tests Monotonic Queue usage.",
        "Follow-up: 'What if k=1 or k=nums.length?'",
        "Deeper: 'Can you solve it in O(n)?'"
      ]},
      { type: 'subheading', en: "Problem Explanation" },
      { type: 'ul', items: [
        "Return max element in each k-sized sliding window (e.g., nums=[1,3,-1,-3,5,3,6,7], k=3, return [3,3,5,5,6,7]).",
        "Constraints: 1 <= nums.length <= 10^5, 1 <= k <= nums.length, -10^4 <= nums[i] <= 10^4.",
        "Monotonic Deque: Maintain indices of decreasing elements, popping out-of-window or smaller values, ensuring front is max.",
        "FAANG favorite for testing deque efficiency and O(n) proof."
      ]},
      { type: 'ascii', ascii: `
nums: [1, 3, -1], k=3
Deque: [1] (3)
Push -1: [1,2] (3,-1)
Window max: 3
      ` },
      { type: 'subheading', en: "Key Interview Insight" },
      { type: 'ul', items: [
        "Clarify if k equals array length or 1."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What’s the brute force approach?",
        "How do you optimize with Monotonic Queue?"
      ] }
    ]
  },
  {
    q: { en: "Brute Force Approach for Sliding Window Maximum (LC239)" },
    level: 'fresher',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Brute Force" },
      { type: 'ul', items: [
        "The interviewer might ask 'How would you solve LC239 without optimization?' to establish a baseline.",
        "Follow-up: 'What’s the complexity?' expecting O(n*k).",
        "Deeper: 'Why is this inefficient?'"
      ]},
      { type: 'subheading', en: "Brute Force Approach" },
      { type: 'ul', items: [
        "For each k-sized window, iterate to find max, costing O(k) per window.",
        "For n-k+1 windows, total time is O(n*k), space O(1) excluding output.",
        "Inefficient for large k or n, as it recomputes max for overlapping elements."
      ]},
      { type: 'codeBlock', codeBlock: `
function maxSlidingWindow(nums, k) {
  const result = [];
  for (let i = 0; i <= nums.length - k; i++) {
    let max = nums[i];
    for (let j = i; j < i + k; j++) {
      max = Math.max(max, nums[j]);
    }
    result.push(max);
  }
  return result;
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Explain brute force to set up deque optimization."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you optimize with Monotonic Queue?",
        "Why is deque O(n)?"
      ] }
    ]
  },
  {
    q: { en: "Optimized Monotonic Queue Approach for Sliding Window Maximum (LC239)" },
    level: 'intermediate',
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Optimization" },
      { type: 'ul', items: [
        "The interviewer might ask 'How can you optimize LC239 using a Monotonic Queue?' expecting a deque approach.",
        "Follow-up: 'What’s the complexity?' expecting O(n).",
        "Deeper: 'How do you prove each element is processed once?'"
      ]},
      { type: 'subheading', en: "Optimized Approach" },
      { type: 'ul', items: [
        "Use a Monotonic Deque to store indices of decreasing elements; front is always max of current window.",
        "For each window, pop front if out of window (i-k), pop back if new element is larger, push new index.",
        "Add front (max) to result after first k elements.",
        "Time: O(n), as each element is pushed/popped once; Space: O(k) for deque."
      ]},
      { type: 'codeBlock', codeBlock: `
function maxSlidingWindow(nums, k) {
  const deque = [], result = [];
  for (let i = 0; i < nums.length; i++) {
    while (deque.length && deque[0] <= i - k) deque.shift();
    while (deque.length && nums[deque[deque.length - 1]] <= nums[i]) deque.pop();
    deque.push(i);
    if (i >= k - 1) result.push(nums[deque[0]]);
  }
  return result;
}
      ` },
      { type: 'ascii', ascii: `
nums: [1, 3, -1, -3, 5], k=3
i=0: deque=[0] (1)
i=1: deque=[1] (3)
i=2: deque=[1,2] (3,-1)
i=3: deque=[1,3] (-3), result=[3]
i=4: deque=[4] (5), result=[3,5]
      ` },
      { type: 'subheading', en: "Complexity" },
      { type: 'ul', items: [
        "Time: O(n), each element pushed/popped once.",
        "Space: O(k) for deque."
      ]},
      { type: 'subheading', en: "Key Interview Insight" },
      { type: 'ul', items: [
        "Prove O(n) by showing each element enters/leaves deque once."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "Why is deque O(n)?",
        "What are edge cases?"
      ] }
    ]
  },
  {
    q: { en: "Why is the Monotonic Queue Approach O(n) for Sliding Window Maximum (LC239)?" },
    level: 'senior',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: O(n) Proof" },
      { type: 'ul', items: [
        "The interviewer might ask 'Prove the Monotonic Queue approach for LC239 is O(n),' to test your complexity analysis.",
        "Follow-up: 'How does it compare to a heap?'",
        "Deeper: 'What ensures each element is processed once?'"
      ]},
      { type: 'subheading', en: "O(n) Proof" },
      { type: 'ul', items: [
        "Each element is pushed to the deque once (O(1)).",
        "Each element is popped at most once, either when out of window (front) or when a larger element arrives (back), both O(1).",
        "Total operations: n pushes + at most n pops = O(n) for n elements.",
        "Heap-based approach is O(n log k), as each insertion/removal is O(log k), worse for large k."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Walk through push/pop counts to prove O(n) in interviews."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What are edge cases?",
        "What’s the next problem?"
      ] }
    ]
  },
  {
    q: { en: "What are the Edge Cases for Sliding Window Maximum (LC239)?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Edge Cases" },
      { type: 'ul', items: [
        "The interviewer might ask 'What edge cases do you need to handle for LC239?' to ensure robustness.",
        "Follow-up: 'What if k=1 or k=nums.length?'",
        "Deeper: 'How do duplicates affect the deque?'"
      ]},
      { type: 'subheading', en: "Edge Cases" },
      { type: 'ul', items: [
        "k=1: Each element is its own window, return nums.",
        "k=nums.length: Single window, return [Math.max(...nums)].",
        "Empty array: Not applicable, as n ≥ 1.",
        "Duplicates: Handled naturally, as deque stores indices, not values.",
        "All same values: Deque may store multiple indices, but front gives max."
      ]},
      { type: 'codeBlock', codeBlock: `
function maxSlidingWindow(nums, k) {
  if (k === 1) return nums;
  if (k === nums.length) return [Math.max(...nums)];
  // Proceed with deque
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Check k=1 and k=n early to simplify code."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do duplicates affect the deque?",
        "What’s the next problem?"
      ] }
    ]
  },
  // Problem 4: Continuous Subarray Sum (LC523)
  {
    q: { en: "Problem Statement: Continuous Subarray Sum (LC523)" },
    level: 'intermediate',
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Problem Understanding" },
      { type: 'ul', items: [
        "The interviewer might state 'Given an array of non-negative integers and k, return true if there’s a subarray of length ≥ 2 whose sum is a multiple of k.' This tests Prefix Sum with modulo.",
        "Follow-up: 'What if k=0?'",
        "Deeper: 'How do you handle large k?'"
      ]},
      { type: 'subheading', en: "Problem Explanation" },
      { type: 'ul', items: [
        "Find a subarray of length ≥ 2 where sum % k === 0 (e.g., nums=[23,2,4,6,7], k=6, return true for [2,4]).",
        "Constraints: 1 <= nums.length <= 10^5, 0 <= nums[i] <= 10^9, 0 <= k <= 10^6.",
        "Prefix Sum with modulo: Use map to store first occurrence of prefix sum % k, check for same mod with length ≥ 2.",
        "FAANG medium problem for modulo arithmetic and hash map."
      ]},
      { type: 'ascii', ascii: `
nums: [23, 2, 4], k=6
prefix: [0, 23, 25, 29]
mod: [0, 5, 1, 5]
map: {0:-1, 5:0}, at i=2, mod=5, length=2-0=2, return true
      ` },
      { type: 'subheading', en: "Key Interview Insight" },
      { type: 'ul', items: [
        "Clarify if k=0 means sum=0 or no divisibility."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What’s the brute force approach?",
        "How do you optimize with Prefix Sum?"
      ] }
    ]
  },
  {
    q: { en: "Brute Force Approach for Continuous Subarray Sum (LC523)" },
    level: 'fresher',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Brute Force" },
      { type: 'ul', items: [
        "The interviewer might ask 'How would you solve LC523 without optimization?' to establish a baseline.",
        "Follow-up: 'What’s the complexity?' expecting O(n^2).",
        "Deeper: 'Why is this inefficient?'"
      ]},
      { type: 'subheading', en: "Brute Force Approach" },
      { type: 'ul', items: [
        "Check every subarray of length ≥ 2, compute sum, and check if sum % k === 0.",
        "Time: O(n^2) for n^2 subarrays, O(n) per sum; Space: O(1).",
        "Inefficient for large n (10^5), as it recomputes sums."
      ]},
      { type: 'codeBlock', codeBlock: `
function checkSubarraySum(nums, k) {
  for (let i = 0; i < nums.length; i++) {
    let sum = nums[i];
    for (let j = i + 1; j < nums.length; j++) {
      sum += nums[j];
      if (k === 0 ? sum === 0 : sum % k === 0) return true;
    }
  }
  return false;
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Explain brute force to set up optimization discussion."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you optimize with Prefix Sum?",
        "How do you handle k=0?"
      ] }
    ]
  },
  {
    q: { en: "Optimized Prefix Sum Approach for Continuous Subarray Sum (LC523)" },
    level: 'intermediate',
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Optimization" },
      { type: 'ul', items: [
        "The interviewer might ask 'How can you optimize LC523 using Prefix Sum?' expecting a modulo-based approach.",
        "Follow-up: 'What’s the complexity?' expecting O(n).",
        "Deeper: 'How do you ensure length ≥ 2?'"
      ]},
      { type: 'subheading', en: "Optimized Approach" },
      { type: 'ul', items: [
        "Use Prefix Sum with modulo: Store prefix sum % k in a map with first occurrence index.",
        "If same mod appears at index j > i, and j-i ≥ 2, sum from i+1 to j is divisible by k (prefix[j] - prefix[i] % k === 0).",
        "Initialize map with {0:-1} to handle subarrays starting at 0.",
        "Time: O(n), single pass; Space: O(min(n,k)) for map."
      ]},
      { type: 'codeBlock', codeBlock: `
function checkSubarraySum(nums, k) {
  const map = new Map([[0, -1]]);
  let sum = 0;
  for (let i = 0; i < nums.length; i++) {
    sum += nums[i];
    if (k !== 0) sum %= k;
    if (map.has(sum) && i - map.get(sum) >= 2) return true;
    if (!map.has(sum)) map.set(sum, i);
  }
  return false;
}
      ` },
      { type: 'ascii', ascii: `
nums: [23, 2, 4], k=6
sum=23, mod=5, map={0:-1, 5:0}
sum=25, mod=1, map={0:-1, 5:0, 1:1}
sum=29, mod=5, map={0:-1, 5:0, 1:1}, length=2-0=2, return true
      ` },
      { type: 'subheading', en: "Complexity" },
      { type: 'ul', items: [
        "Time: O(n), single pass with O(1) map operations.",
        "Space: O(min(n,k)) for map."
      ]},
      { type: 'subheading', en: "Key Interview Insight" },
      { type: 'ul', items: [
        "Explain modulo arithmetic to show divisibility logic."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle k=0?",
        "What are edge cases?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle k=0 in Continuous Subarray Sum (LC523)?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: k=0 Handling" },
      { type: 'ul', items: [
        "The interviewer might ask 'How does your solution handle k=0 in LC523?' to test edge case clarity.",
        "Follow-up: 'What does k=0 mean in this context?'",
        "Deeper: 'How do you ensure length ≥ 2?'"
      ]},
      { type: 'subheading', en: "k=0 Handling" },
      { type: 'ul', items: [
        "For k=0, interpret as finding a subarray with sum 0 (since division by 0 is undefined).",
        "Avoid modulo if k=0, track raw prefix sums in map, and check for same sum with length ≥ 2.",
        "Example: [0,0] returns true, as sum=0, length=2.",
        "Ensure map only stores first occurrence to avoid overwriting earlier indices."
      ]},
      { type: 'codeBlock', codeBlock: `
function checkSubarraySum(nums, k) {
  const map = new Map([[0, -1]]);
  let sum = 0;
  for (let i = 0; i < nums.length; i++) {
    sum += nums[i];
    if (k === 0) {
      if (map.has(sum) && i - map.get(sum) >= 2) return true;
    } else {
      sum %= k;
      if (map.has(sum) && i - map.get(sum) >= 2) return true;
    }
    if (!map.has(sum)) map.set(sum, i);
  }
  return false;
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Clarify k=0 meaning with interviewer."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What are edge cases?",
        "What are trade-offs?"
      ] }
    ]
  },
  {
    q: { en: "What are the Edge Cases for Continuous Subarray Sum (LC523)?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Edge Cases" },
      { type: 'ul', items: [
        "The interviewer might ask 'What edge cases do you need to handle for LC523?' to ensure robustness.",
        "Follow-up: 'What if k=0 or array is too short?'",
        "Deeper: 'How do you handle all zeros?'"
      ]},
      { type: 'subheading', en: "Edge Cases" },
      { type: 'ul', items: [
        "Array length < 2: Return false, as subarray must be ≥ 2.",
        "k=0: Check for sum=0 with length ≥ 2, as above.",
        "All zeros: Returns true for k=0 or any k, as sum=0 is divisible.",
        "Large k (10^6): Modulo handles it, but use BigInt for sum if needed.",
        "Single non-zero: Return false, as length < 2."
      ]},
      { type: 'codeBlock', codeBlock: `
function checkSubarraySum(nums, k) {
  if (nums.length < 2) return false;
  // Proceed with prefix sum
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Check length < 2 early to avoid unnecessary processing."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What are trade-offs?",
        "How do you extend to 2D prefix sums?"
      ] }
    ]
  },
  {
    q: { en: "What are the Trade-Offs of the Prefix Sum Approach for Continuous Subarray Sum (LC523)?" },
    level: 'senior',
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Trade-Off Analysis" },
      { type: 'ul', items: [
        "The interviewer might ask 'What are the trade-offs of using Prefix Sum for LC523?' to test optimization awareness.",
        "Follow-up: 'How does it compare to Sliding Window?'",
        "Deeper: 'When is this approach less effective?'"
      ]},
      { type: 'subheading', en: "Trade-Offs" },
      { type: 'ul', items: [
        "Prefix Sum with modulo achieves O(n) time vs brute force O(n^2), ideal for large n.",
        "Space is O(min(n,k)) for map, higher than O(1) brute force, but justified.",
        "Unlike Sliding Window, handles non-contiguous subarrays and k=0 naturally, but requires map for modulo tracking.",
        "Less effective if length constraint (≥ 2) complicates logic or k is very large."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Compare to Sliding Window to show versatility."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you extend to 2D prefix sums?",
        "How do you debug Prefix Sum solutions?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Extend Prefix Sum to 2D Arrays?" },
    level: 'senior',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: 2D Extension" },
      { type: 'ul', items: [
        "The interviewer might ask 'How would you extend Prefix Sum to 2D arrays for matrix problems?' to test advanced applications.",
        "Follow-up: 'What’s the complexity for 2D prefix sums?'",
        "Deeper: 'How do you handle range queries in a matrix?'"
      ]},
      { type: 'subheading', en: "2D Prefix Sum" },
      { type: 'ul', items: [
        "For a matrix, compute prefix sum where prefix[i][j] = sum of all elements in rectangle from (0,0) to (i-1,j-1).",
        "Formula: prefix[i][j] = matrix[i-1][j-1] + prefix[i-1][j] + prefix[i][j-1] - prefix[i-1][j-1].",
        "Range sum (r1,c1) to (r2,c2): prefix[r2+1][c2+1] - prefix[r2+1][c1] - prefix[r1][c2+1] + prefix[r1][c1].",
        "Time: O(m*n) to build, O(1) per query; Space: O(m*n)."
      ]},
      { type: 'codeBlock', codeBlock: `
function matrixRangeSum(matrix, r1, c1, r2, c2) {
  const m = matrix.length, n = matrix[0].length;
  const prefix = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      prefix[i][j] = matrix[i-1][j-1] + prefix[i-1][j] + prefix[i][j-1] - prefix[i-1][j-1];
    }
  }
  return prefix[r2+1][c2+1] - prefix[r2+1][c1] - prefix[r1][c2+1] + prefix[r1][c1];
}
      ` },
      { type: 'ascii', ascii: `
matrix: [[1,2],[3,4]]
prefix: [[0,0,0],[0,1,3],[0,4,10]]
Range (0,0)-(1,1): 10 - 0 - 0 + 0 = 10 (1+2+3+4)
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Practice 2D prefix sums for matrix problems in FAANG."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you debug Prefix Sum solutions?",
        "What’s the revision routine?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Debug Prefix Sum and Monotonic Queue Solutions?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Debugging" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you debug a Prefix Sum or Monotonic Queue solution?' to test your problem-solving process.",
        "Follow-up: 'What common errors occur?'",
        "Deeper: 'How do you use dry runs?'"
      ]},
      { type: 'subheading', en: "Debugging Process" },
      { type: 'ul', items: [
        "Prefix Sum: Trace prefix array and map frequencies with small inputs (e.g., [1,2], k=3), logging sums and counts.",
        "Monotonic Queue: Log deque state per iteration, checking front (max/min) and pop conditions.",
        "Common errors: Off-by-one in prefix array, missing map[0]=1, incorrect deque pop logic.",
        "Use ASCII diagrams to visualize prefix sums or deque changes."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Dry run on paper to catch logical errors before coding."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What are common mistakes?",
        "What’s the revision routine?"
      ] }
    ]
  },
  {
    q: { en: "What are Common Mistakes in Prefix Sum and Monotonic Queue?" },
    level: 'fresher',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Common Errors" },
      { type: 'ul', items: [
        "The interviewer might ask 'What mistakes do candidates make in these patterns?' to test awareness.",
        "Follow-up: 'How do you avoid them?'",
        "Deeper: 'How do they impact FAANG interviews?'"
      ]},
      { type: 'subheading', en: "Common Mistakes" },
      { type: 'ul', items: [
        "Prefix Sum: Missing map[0]=1, off-by-one in prefix array, incorrect modulo for k=0.",
        "Monotonic Queue: Wrong pop conditions (e.g., not checking window bounds), storing values instead of indices.",
        "General: Not handling edge cases (empty array, k=0, duplicates).",
        "Forgetting to validate input constraints."
      ]},
      { type: 'subheading', en: "Avoidance" },
      { type: 'ul', items: [
        "Test with small inputs and edge cases.",
        "Log state changes during development.",
        "Verify complexity with dry runs."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Practice explaining errors to show debugging skills."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What’s the revision routine?",
        "How do you handle time pressure?"
      ] }
    ]
  },
  {
    q: { en: "What’s the Revision Routine for Prefix Sum and Monotonic Queue in FAANG Interviews?" },
    level: 'fresher',
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Revision Strategy" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you prepare for Prefix Sum and Monotonic Queue problems?' to gauge your discipline.",
        "Follow-up: 'How do you balance theory and practice?'",
        "Deeper: 'How do you simulate interview pressure?'"
      ]},
      { type: 'subheading', en: "Revision Routine" },
      { type: 'ul', items: [
        "Day 1-5: Study basics (prefix sum formula, deque operations) using this FAQ, solving LC303 and LC239 (1-2 problems daily).",
        "Day 6-15: Solve LC560, LC523, and variations, coding brute force then optimizing, analyzing complexity, testing edge cases (2-3 problems daily).",
        "Day 16-20: Practice 2D prefix sums, increasing/decreasing deques, and mock interviews, explaining solutions verbally.",
        "Track progress with a spreadsheet, noting mistakes and complexities; aim for 30-40 problems."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Time yourself (30-45 min per problem) to mimic interview pressure."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "Can you solve a new problem?",
        "How do you handle time pressure?"
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

  const { html, sidebarLinks } = buildSlidingWindowFAQSection('sliding-window-faqs', 'Sliding Window Patterns FAQs', twoPointerKSumQA);
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
