/* sumPairPatterns.js
   English-only FAQ builder for Sanjay Patidar's Sum / Pair Patterns (Two Sum Family) blog page.
   Maintains class names/attributes for compatibility with interviewFaqToggle.js and interviewAudio.js.
   Provides 20+ in-depth FAQs for Two Sum and 3Sum, with structured content (bullets, tables, ASCII, code),
   dedicated concept explanations, pattern recognition, and real interviewer question variations.
   Current time: 04:15 PM IST, Monday, September 29, 2025.
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
// Focused on most important FAQs for 1-2 years experience interviews (e.g., core concepts, approaches, complexities, edge cases, trade-offs).
// Marked "important: true" for key ones to enable targeted sidebar navigation (id=important1, etc.).
// Added explanatory headings/tags selectively (not on all) within FAQs for clarity, e.g., "Key Interview Insight" or "Practical Tip".
const sumPairQA = [
  {
    q: { en: "Overview of Sum / Pair Pattern and FAANG Job Preparation" },
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Understanding the Pattern and Prep" },
      { type: 'ul', items: [
        "Interviewer might start with a broad question like: 'Can you explain a common DSA pattern you’ve mastered?' to gauge your pattern recognition and preparation level, expecting you to introduce the Sum / Pair Pattern as a foundational concept.",
        "They could ask: 'How would you prepare for a coding interview at a company like Google or Amazon?' to assess your strategy, where you’d highlight this FAQ’s structured approach.",
        "Follow-up might be: 'Why focus on Sum / Pair problems?' to test your understanding of its relevance, leading you to explain its frequent appearance in FAANG interviews."
      ]},
      { type: 'subheading', en: "Pattern Explanation" },
      { type: 'ul', items: [
        "The Sum / Pair Pattern revolves around finding elements in an array—whether pairs, triplets, or more—that sum up to a specific target value, a problem type that forms the backbone of dynamic programming and algorithmic thinking in data structures and algorithms (DSA).",
        "This pattern includes classic problems like Two Sum, 3Sum, and 4Sum, each increasing in complexity and requiring different optimization techniques, making it a critical skill for tackling real-world coding challenges.",
        "The pattern teaches optimization strategies, starting with brute force solutions that run in O(n²) time and evolving to more efficient approaches like hash maps with O(n) time or two-pointer techniques after sorting, which is essential for handling large datasets efficiently.",
        "FAANG companies such as Google, Amazon, Microsoft, and Facebook prioritize this pattern because it tests a candidate’s ability to solve problems under time constraints, optimize code, and think critically about trade-offs, all of which are vital in high-pressure interview settings."
      ]},
      { type: 'subheading', en: "How This FAQ Helps" },
      { type: 'ul', items: [
        "This FAQ provides an extensive collection of over 50 detailed questions and answers, each designed to cover every aspect of the Sum / Pair Pattern, from basic concepts to advanced optimizations, ensuring that freshers, intermediates, and senior candidates alike can find value and build confidence.",
        "It includes real-world interview scenarios, meticulously crafted code examples with comments, step-by-step dry runs using ASCII art, and comprehensive complexity analyses, offering a holistic learning experience that mirrors what you’ll face in FAANG interviews.",
        "The recommended plan is to dedicate 20 to 25 days to this guide, solving 3 to 5 problems daily with deliberate practice, allowing you to internalize the pattern and prepare thoroughly for technical rounds at top-tier companies.",
        "By targeting specific FAANG giants like Google for its algorithmic rigor, Amazon for its problem-solving focus, and Microsoft for its system design integration, this FAQ equips you with the tools to excel across diverse interview styles and expectations."
      ]},
      { type: 'subheading', en: "Key Interview Insight" }, // Selective explanatory tag/heading
      { type: 'ul', items: [
        "Focus on explaining trade-offs clearly; interviewers value candidates who can articulate why one approach is better for specific constraints."
      ]},
      { type: 'link', text: "Explore Pattern", href: "https://sanjay-patidar.vercel.app/dsa-pattern-recognition#pattern-1" }
    ]
  },
  {
    q: { en: "Understanding Arrays in Sum Patterns" },
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Array Fundamentals" },
      { type: 'ul', items: [
        "Interviewer might ask: 'Can you explain what an array is and how it’s used in algorithms?' to evaluate your foundational knowledge, expecting a detailed breakdown of its structure and role.",
        "They could pose: 'How does an array’s design impact solving sum-related problems?' to test your ability to connect data structures to specific patterns.",
        "Follow-up might be: 'What are the advantages of using arrays over other data structures in this context?' to probe your understanding of trade-offs."
      ]},
      { type: 'subheading', en: "Array Basics" },
      { type: 'ul', items: [
        "An array is a linear data structure that stores a collection of elements of the same data type in a contiguous block of memory, allowing for efficient access and manipulation, which is critical for problems like finding pairs or triplets that sum to a target.",
        "In JavaScript, arrays are dynamically sized and managed by the V8 engine’s garbage collector, providing flexibility, but in a DSA context, we often assume a fixed-size array for theoretical analysis, mimicking languages like C or Java where memory allocation is more rigid.",
        "Accessing an element in an array is achieved in O(1) time complexity because the memory address can be calculated directly using the formula address = base_address + (index * size_of_each_element), making it ideal for iterative solutions in Sum Patterns where quick lookups are necessary."
      ]},
      { type: 'subheading', en: "Role in Sum Patterns" },
      { type: 'ul', items: [
        "Arrays serve as the primary input container for Sum Pattern problems, holding the numbers (e.g., [2, 7, 11, 15]) that need to be analyzed to find combinations meeting the target sum, forming the basis for all algorithmic operations.",
        "The 0-based indexing system of arrays allows for precise tracking of element positions, which is essential when the problem requires returning the indices of the elements that sum correctly, as seen in Two Sum.",
        "Iterating over the array with loops or using pointers relies on its sequential nature, enabling strategies like brute force, hash maps, or two-pointer techniques to explore all possible combinations efficiently."
      ]},
      { type: 'ascii', ascii: `
+------+------+------+------+
|  0   |  1   |  2   |  3   |
+------+------+------+------+
|  2   |  7   | 11   | 15   |
+------+------+------+------+
Memory: Contiguous
Access: nums[1] = 7
      ` },
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How is memory allocated for arrays in different languages?",
        "What challenges arise if the array is unsorted?"
      ] }
    ]
  },
  {
    q: { en: "How is Memory Allocated for Arrays?" },
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Memory Allocation Details" },
      { type: 'ul', items: [
        "Interviewer might ask: 'Explain how memory is allocated for an array in a programming language of your choice?' to assess your understanding of low-level concepts.",
        "They could follow with: 'How does JavaScript handle array memory compared to C?' to test your knowledge of language-specific implementations.",
        "A deeper question might be: 'What happens if the system runs out of contiguous memory?' to evaluate your handling of edge cases."
      ]},
      { type: 'subheading', en: "Memory Allocation Process" },
      { type: 'ul', items: [
        "Memory for an array is allocated contiguously by the operating system or runtime environment, meaning all elements are stored in a single, unbroken block of memory, which allows for predictable address calculations and O(1) access time, a critical factor in optimizing Sum Pattern solutions.",
        "The process begins with the assignment of a base address to the first element, and subsequent elements are placed at offsets calculated as base_address + (index * size_of_each_element), ensuring that each element’s location can be determined instantly without searching, which is why arrays are preferred for indexed access.",
        "In languages like C, this allocation is static and fixed at compile time, requiring the programmer to predefine the array size, whereas in JavaScript, the V8 engine dynamically allocates memory on the heap, resizing the array as needed and managing deallocation through garbage collection, offering flexibility but adding overhead."
      ]},
      { type: 'subheading', en: "Types of Allocation" },
      { type: 'ul', items: [
        "Static allocation, as seen in C, involves reserving a fixed amount of memory at compile time using declarations like int arr[5], which is efficient for known sizes but inflexible if the data grows beyond the allocated space, potentially leading to runtime errors.",
        "Dynamic allocation, prevalent in JavaScript, allows the array to expand or shrink during execution, handled by the runtime environment, which reallocates memory and copies data when necessary, though this can introduce performance costs due to fragmentation or garbage collection pauses."
      ]},
      { type: 'ascii', ascii: `
Base Address: 1000
Element Size: 4 bytes
Array [2, 7, 11, 15]:
1000: 2
1004: 7
1008: 11
1012: 15
      ` },
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What is the impact of memory fragmentation on array performance?",
        "How does memory overhead affect large arrays in JavaScript?"
      ] }
    ]
  },
  {
    q: { en: "What if the Array is Unsorted in Sum Patterns?" },
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Handling Unsorted Arrays" },
      { type: 'ul', items: [
        "Interviewer might ask: 'What strategy would you use if the input array is not sorted?' to test your adaptability to real-world data.",
        "They could follow with: 'How does an unsorted array change your approach compared to a sorted one?' to explore your algorithmic flexibility.",
        "A challenging question might be: 'Can you justify the trade-offs of your chosen method for unsorted data?' to assess your decision-making process."
      ]},
      { type: 'subheading', en: "Handling Unsorted Arrays" },
      { type: 'ul', items: [
        "When an array is unsorted, the two-pointer technique, which relies on ordered elements to converge from both ends, becomes ineffective, necessitating an alternative approach like using a hash map to store complements, where for each number we calculate target - num and check if it exists, achieving a time complexity of O(n) with a space complexity of O(n).",
        "Another option is to sort the array first, which takes O(n log n) time using algorithms like quicksort or mergesort, followed by applying the two-pointer method with O(n) time, resulting in a total complexity of O(n log n) + O(n), but this approach trades initial time for space efficiency since it requires no additional data structure.",
        "The choice between these methods depends on the problem constraints, such as whether space is a concern or if the array is too large for sorting overhead, making it crucial to ask the interviewer about the expected input size and memory limits during the interview."
      ]},
      { type: 'subheading', en: "Trade-Off Comparison" },
      { type: 'ul', items: [
        "The hash map approach offers a significant time advantage with O(n) complexity, making it ideal for large unsorted datasets where speed is critical, but it requires O(n) extra space to store the map, which could be a limitation on systems with tight memory constraints.",
        "Sorting followed by two pointers provides O(1) space complexity, which is beneficial when memory is scarce, but the initial O(n log n) sort can be a bottleneck for very large arrays, potentially making it less efficient than the hash map for certain scenarios."
      ]},
      { type: 'ascii', ascii: `
Unsorted: [15, 2, 7, 11], target=9
Hash Map: Store 2:0, check 7 → [0,1]
Sorted + Pointers: [2,7,11,15] → Not applicable without sort
      ` },
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "Why wouldn’t you always sort the array to simplify the problem?",
        "How do you balance space and time trade-offs in a real interview?"
      ] }
    ]
  },
  {
    q: { en: "Understanding Pointers in Sum Patterns" },
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Pointer Concepts" },
      { type: 'ul', items: [
        "Interviewer might ask: 'What are pointers, and how do they apply to array problems?' to test your grasp of this fundamental concept.",
        "They could follow with: 'How do pointers help in optimizing Sum Pattern solutions?' to explore your optimization skills.",
        "A deeper question might be: 'Can you explain the logic behind pointer movement in a sorted array?' to assess your algorithmic reasoning."
      ]},
      { type: 'subheading', en: "Pointer Basics" },
      { type: 'ul', items: [
        "In the context of DSA and JavaScript, pointers are not memory addresses like in C but rather indices (e.g., left = 0, right = n-1) that track specific positions within an array, allowing us to simulate pointer-like behavior without direct memory manipulation, which is particularly useful in Sum Patterns.",
        "These indices act as virtual markers that move through the array to compare elements, enabling techniques like the two-pointer method, where we start from opposite ends and adjust based on the sum relative to the target, a strategy that leverages the array’s structure.",
        "Unlike traditional pointers, JavaScript’s approach relies on the array’s index-based access, which remains O(1), making it a powerful tool for iterative solutions without the complexity of manual memory management found in lower-level languages."
      ]},
      { type: 'subheading', en: "Application in Sum Patterns" },
      { type: 'ul', items: [
        "In sorted arrays, pointers are initialized at the ends (left = 0, right = n-1), and their movement is governed by the sum compared to the target: if the sum exceeds the target, the right pointer moves left to decrease the sum, while if it’s less, the left pointer moves right to increase it, continuing until a match is found or pointers cross.",
        "This method reduces the time complexity from the O(n²) of brute force to O(n) after an initial O(n log n) sort, offering a significant efficiency boost for problems like Two Sum II, where the sorted nature is given.",
        "The technique requires the array to be sorted beforehand, which introduces a trade-off, but once sorted, the linear movement of pointers ensures a systematic search, making it a staple approach in FAANG interviews for its elegance and performance."
      ]},
      { type: 'ascii', ascii: `
nums = [2, 7, 11, 15], target=18
left=0 (2), right=3 (15), sum=17 < 18 → left=1
left=1 (7), right=3 (15), sum=22 > 18 → right=2
left=1 (7), right=2 (11), sum=18 = 18 → [1, 2]
      ` },
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "Why is a sorted array necessary for pointer-based solutions?",
        "What is the detailed logic behind pointer movement in each step?"
      ] }
    ]
  },
  {
    q: { en: "How Do Pointers Move in Sum Patterns?" },
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Pointer Movement Logic" },
      { type: 'ul', items: [
        "Interviewer might ask: 'Describe how pointers move when solving a sum problem with a sorted array?' to evaluate your step-by-step reasoning.",
        "They could follow with: 'What happens if the sum equals the target during movement?' to test your termination conditions.",
        "A challenging question might be: 'How do you handle edge cases in pointer movement?' to probe your robustness."
      ]},
      { type: 'subheading', en: "Movement Logic" },
      { type: 'ul', items: [
        "The movement of pointers begins with initializing two indices, left at the start (index 0) and right at the end (index n-1) of a sorted array, setting the stage for a binary search-like approach where the sum of the elements at these positions is compared to the target value.",
        "If the sum of the elements at left and right exceeds the target, the right pointer is decremented by one position to reduce the sum, as moving toward smaller elements in a sorted array logically lowers the total, continuing this adjustment until the sum aligns or pointers meet.",
        "Conversely, if the sum is less than the target, the left pointer is incremented to move toward larger elements, increasing the sum incrementally, and this process repeats in a while loop until the sum matches the target or left surpasses right.",
        "The loop terminates when left becomes greater than or equal to right, indicating all possible pairs have been checked, at which point the algorithm either returns the solution or concludes no valid pair exists based on the problem’s constraints."
      ]},
      { type: 'ascii', ascii: `
nums = [2, 7, 11, 15], target=9
left=0 (2), right=3 (15), sum=17 > 9 → right=2
left=0 (2), right=2 (11), sum=13 > 9 → right=1
left=0 (2), right=1 (7), sum=9 = 9 → stop
      ` },
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle edge cases like equal sums or no solution?",
        "What is the time impact of pointer adjustments on large arrays?"
      ] }
    ]
  },
  {
    q: { en: "Variations of Two Sum Problem Statement (LC1)" },
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Problem Statement Variations" },
      { type: 'ul', items: [
        "Interviewer might ask: 'Given an array, can you find two numbers that add up to a target and return their indices?' to introduce a standard Two Sum scenario, testing your ability to recognize the pattern.",
        "They could pose: 'Imagine you have a list of numbers; can you identify a pair whose sum matches this value and provide their positions?' to add a slight tweak, checking your adaptability.",
        "A more complex version might be: 'Design a solution to detect two elements summing to X in an unsorted array, ensuring no same element is used twice,' to evaluate your optimization skills.",
        "They might ask: 'How would you find the indices of two numbers in this dataset that equal Y, considering potential duplicates?' to introduce an edge case.",
        "A challenging twist could be: 'Solve a problem where two array elements sum to a given target, but the array might contain negative numbers—how would you proceed?' to test your comprehensive understanding."
      ]},
      { type: 'subheading', en: "Pattern Recognition Hints" },
      { type: 'ul', items: [
        "The presence of keywords like 'pair' or 'two numbers' immediately signals a Two Sum problem, indicating that the task involves finding exactly two elements, which is a hallmark of this pattern.",
        "Terms such as 'sum to target' or 'add up to a value' suggest a fixed sum constraint, guiding you toward solutions that involve complement calculation or direct comparison.",
        "The requirement to 'return indices' or 'provide positions' emphasizes the need to track element locations, a key differentiator from problems asking for values alone, aligning with LeetCode’s Two Sum.",
        "Hints like 'unsorted' or 'no repeats' provide critical context, steering you toward a hash map approach for efficiency or an index check to avoid duplicates, respectively."
      ]},
      { type: 'ascii', ascii: `
+------------+---------------+-----------------+
| Keyword    | Implication   | Approach Hint   |
+------------+---------------+-----------------+
| Pair       | Two elements  | Hash Map/Brute  |
| Sum to     | Fixed target  | Complement      |
| Indices    | Positions     | Track indices   |
| Unsorted   | No order      | Hash Map (O(n)) |
| No repeats | Unique indices| Index check     |
+------------+---------------+-----------------+
      ` },
      { type: 'subheading', en: "Practical Tip" }, // Selective explanatory tag/heading
      { type: 'ul', items: [
        "Always clarify if the array is sorted or if duplicates are allowed to choose the optimal approach."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "Is the array sorted, or do I need to assume it’s unsorted?",
        "What if the array contains duplicate values—how will you handle that?"
      ] }
    ]
  },
  {
    q: { en: "Pattern Recognition for Two Sum (LC1)" },
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Pattern Identification" },
      { type: 'ul', items: [
        "Interviewer might ask: 'How did you determine this is a Two Sum problem based on my question?' to test your analytical skills in recognizing patterns.",
        "They could follow with: 'What clues in the problem statement led you to this approach?' to evaluate your attention to detail.",
        "A deeper question might be: 'Could this be confused with another pattern—how do you differentiate?' to assess your breadth of knowledge."
      ]},
      { type: 'subheading', en: "Recognition Strategy" },
      { type: 'ul', items: [
        "Begin by listening carefully for terms like 'pair' or 'two numbers,' which are strong indicators of a Two Sum problem, as they specify the exact number of elements to consider, distinguishing it from triplet or k-sum problems.",
        "Pay close attention to phrases like 'sum to target' or 'add up to a value,' which define the objective of finding a specific total, suggesting the need for a complement-based or comparison-based solution.",
        "Note the requirement to 'return indices' or 'provide positions,' which is a defining feature of Two Sum on LeetCode, requiring you to maintain index tracking rather than just the values, a nuance to confirm early.",
        "Be alert for contextual hints such as 'unsorted' or 'no repeats,' which shape your approach—unsorted data points to a hash map, while no repeats necessitate an index uniqueness check—prompting you to clarify with the interviewer if needed."
      ]},
      { type: 'ascii', ascii: `
+------------+---------------+-----------------+---------------------+
| Keyword    | Implication   | Approach Hint   | Explanation         |
+------------+---------------+-----------------+---------------------+
| Pair       | Two elements  | Hash Map/Brute  | Limits to 2 items   |
| Sum to     | Fixed target  | Complement      | Guides complement   |
| Indices    | Positions     | Track indices   | Needs index storage |
| Unsorted   | No order      | Hash Map (O(n)) | Avoids sorting      |
| No repeats | Unique indices| Index check     | Prevents self-pair  |
+------------+---------------+-----------------+---------------------+
      ` },
      { type: 'subheading', en: "Key Interview Insight" }, // Selective explanatory tag/heading
      { type: 'ul', items: [
        "Differentiate from similar patterns like Subarray Sum by focusing on exact pair requirements."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How did you deduce this pattern from the problem description?",
        "What other patterns might this resemble, and how do you rule them out?"
      ] }
    ]
  },
  {
    q: { en: "Brute Force Approach for Two Sum (LC1)" },
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Brute Force Solution" },
      { type: 'ul', items: [
        "Interviewer might ask: 'Can you solve this problem using the simplest method you can think of?' to see if you can start with a baseline approach.",
        "They could follow with: 'Walk me through how your brute force solution works step by step,' to test your ability to explain logic clearly.",
        "A follow-up might be: 'What are the limitations of this approach for large inputs?' to challenge you on scalability."
      ]},
      { type: 'subheading', en: "Approach Details" },
      { type: 'ul', items: [
        "The brute force approach involves using two nested loops to check every possible pair of elements in the array, where the outer loop iterates through each element as the first number, and the inner loop starts from the next element to avoid self-pairing, systematically exploring all combinations.",
        "For each pair identified by the indices i and j, the algorithm calculates the sum of nums[i] and nums[j], comparing it to the target value, and if a match is found, it returns the indices [i, j] immediately, assuming the problem guarantees a single solution as per LeetCode’s Two Sum.",
        "This method ensures exhaustive coverage of all pairs, making it a reliable starting point for understanding the problem, though it lacks efficiency, which is why it serves as a foundation to build upon with optimizations during the interview."
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
        "Consider the input array nums = [2, 7, 11, 15] with target = 9: the outer loop starts with i = 0 (2), and the inner loop begins with j = 1 (7), calculating 2 + 7 = 9, which matches the target, so it returns [0, 1].",
        "If the target were different, say 13, the process continues: i = 0, j = 2 (11) gives 2 + 11 = 13, returning [0, 2], demonstrating how each pair is checked sequentially until a match is found or all combinations are exhausted."
      ]},
      { type: 'ascii', ascii: `
i=0, j=1: 2 + 7 = 9 → [0, 1]
i=0, j=2: 2 + 11 = 13 (if target=13)
      ` },
      { type: 'subheading', en: "Complexity" },
      { type: 'ul', items: [
        "The time complexity is O(n²) because the algorithm performs two nested loops, where the outer loop runs n times and the inner loop runs up to n-1 times for each iteration, resulting in a quadratic number of operations.",
        "The space complexity is O(1) as it uses no additional data structures beyond the input array and a few variables, making it memory-efficient but computationally expensive for large datasets."
      ]},
      { type: 'subheading', en: "Practical Tip" }, // Selective explanatory tag/heading
      { type: 'ul', items: [
        "Start with brute force in interviews to show you understand the problem, then optimize."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "Why doesn’t this approach scale well for large arrays?",
        "Can you think of a way to reduce the time complexity?"
      ] }
    ]
  },
  {
    q: { en: "Optimized Hash Map Approach for Two Sum (LC1)" },
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Optimized Solution" },
      { type: 'ul', items: [
        "Interviewer might ask: 'Can you optimize your previous solution for better performance?' to push you toward advanced techniques.",
        "They could follow with: 'Explain how your hash map solution works in detail,' to test your understanding of data structures.",
        "A follow-up might be: 'What are the space implications of using a hash map?' to explore trade-offs."
      ]},
      { type: 'subheading', en: "Approach Details" },
      { type: 'ul', items: [
        "The optimized hash map approach uses a Map data structure to store the complement of each number (target - num) as it iterates through the array, allowing a single pass to check if the complement exists, which transforms the O(n²) problem into O(n) by avoiding nested loops.",
        "For each element at index i, the algorithm calculates the complement as target - nums[i], then checks if this complement is already in the map; if found, it returns the stored index and current index [map.get(complement), i], leveraging the map’s O(1) lookup time.",
        "If the complement isn’t found, the current number and its index are added to the map, ensuring that future iterations can use this data, making it a dynamic and efficient way to track potential pairs without rechecking all previous elements."
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
        "For nums = [2, 7, 11, 15] and target = 9: at i = 0, complement = 9 - 2 = 7, map is empty, so 2:0 is stored; at i = 1, complement = 9 - 7 = 2, map has 2:0, so return [0, 1].",
        "If target were 18: i = 0, complement = 16, store 2:0; i = 1, complement = 11, store 7:1; i = 2, complement = 7, find 7:1, return [1, 2], showing the process adapts dynamically."
      ]},
      { type: 'ascii', ascii: `
i=0: complement=7, map={}
i=1: complement=2, map={2:0} → [0, 1]
      ` },
      { type: 'subheading', en: "Complexity" },
      { type: 'ul', items: [
        "The time complexity drops to O(n) because the algorithm makes a single pass through the array, with each map operation (has and set) averaging O(1) due to the hash table’s amortized performance.",
        "The space complexity is O(n) as the map can store up to n key-value pairs in the worst case, where each element is added before its complement is found, balancing the efficiency gain with memory usage."
      ]},
      { type: 'subheading', en: "Key Interview Insight" }, // Selective explanatory tag/heading
      { type: 'ul', items: [
        "Highlight the time-space trade-off; this is a common follow-up."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How does the hash map’s internal mechanism enable this efficiency?",
        "What are the potential downsides of using extra space?"
      ] }
    ]
  },
  {
    q: { en: "What is a Hash Map and Its Role in Two Sum?" },
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Hash Map Fundamentals" },
      { type: 'ul', items: [
        "Interviewer might ask: 'What is a hash map, and how does it work?' to test your data structure knowledge.",
        "They could follow with: 'Why is a hash map suitable for Two Sum?' to explore its application.",
        "A deeper question might be: 'How do you handle collisions in a hash map?' to assess your depth."
      ]},
      { type: 'subheading', en: "Hash Map Basics" },
      { type: 'ul', items: [
        "A hash map is a data structure that stores key-value pairs, using a hash function to map keys to indices in an underlying array, allowing for average O(1) time complexity for insertions, deletions, and lookups, which is a game-changer for problems requiring quick associations like Two Sum.",
        "The hash function converts a key into an index by performing a mathematical operation, such as modulo division, but this can lead to collisions where multiple keys hash to the same index, which are resolved using techniques like chaining (linked lists) or open addressing (probing), ensuring data integrity.",
        "In JavaScript, the Map object implements this concept with built-in efficiency, providing methods like set(), get(), and has(), which abstract away the collision handling, making it accessible for interview solutions without delving into low-level implementation."
      ]},
      { type: 'subheading', en: "Role in Two Sum" },
      { type: 'ul', items: [
        "In Two Sum, the hash map stores numbers as keys and their indices as values, enabling the algorithm to check if a complement (target - current_number) exists in O(1) time, drastically reducing the need for nested loops.",
        "As the array is traversed, each number’s complement is looked up, and if found, the stored index paired with the current index forms the solution, leveraging the map’s ability to maintain a history of seen elements.",
        "This role transforms the problem from a quadratic search to a linear one, making it a preferred optimization technique in FAANG interviews where performance is paramount."
      ]},
      { type: 'ascii', ascii: `
+---------+---------+
| Key     | Value   |
+---------+---------+
| 2       | 0       |
| 7       | 1       |
| 11      | 2       |
| 15      | 3       |
+---------+---------+
Complement 7 → Find 2
      ` },
      { type: 'subheading', en: "Practical Tip" }, // Selective explanatory tag/heading
      { type: 'ul', items: [
        "Mention collision resolution to show depth, but note JavaScript Map handles it internally."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How is the hash value computed for a given key?",
        "What is the memory overhead of maintaining a hash map?"
      ] }
    ]
  },
  {
    q: { en: "How is Time Complexity Calculated for Hash Map in Two Sum?" },
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Complexity Analysis" },
      { type: 'ul', items: [
        "Interviewer might ask: 'Can you break down the time complexity of your hash map solution?' to test your analytical skills.",
        "They could follow with: 'What happens to complexity in the worst case?' to explore edge scenarios.",
        "A follow-up might be: 'How does space complexity relate to time here?' to connect the trade-offs."
      ]},
      { type: 'subheading', en: "Time Complexity Breakdown" },
      { type: 'ul', items: [
        "The time complexity is derived from a single loop that iterates over the array n times, and within each iteration, the hash map operations—has() and set()—are performed, each averaging O(1) time due to the hash table’s amortized performance across a well-distributed hash function.",
        "This linear O(n) complexity arises because the algorithm avoids the nested loops of brute force, replacing them with a single pass where each element is processed once, and the map lookup or insertion happens instantaneously on average.",
        "The overall efficiency is maintained as long as the hash function distributes keys evenly, preventing clustering, which would otherwise degrade performance, though this is mitigated by modern implementations like JavaScript’s Map."
      ]},
      { type: 'subheading', en: "Worst Case" },
      { type: 'ul', items: [
        "In the worst case, if all keys hash to the same index causing collisions, the time complexity could rise to O(n) for each operation due to linear probing or chaining, resulting in a total of O(n²) if the map degenerates into a linked list.",
        "This scenario is rare with a good hash function and sufficient table size, but interviewers might test your awareness by asking about it, requiring you to mention collision resolution strategies."
      ]},
      { type: 'subheading', en: "Space Complexity" },
      { type: 'ul', items: [
        "The space complexity is O(n) because the hash map can store up to n key-value pairs, one for each element in the array, in the scenario where no complement is found early, maximizing the map’s usage.",
        "This space is used to trade for time efficiency, holding the history of seen numbers and their indices, which is a deliberate design choice to achieve the O(n) time improvement over brute force."
      ]},
      { type: 'subheading', en: "Key Interview Insight" }, // Selective explanatory tag/heading
      { type: 'ul', items: [
        "Emphasize amortized O(1) lookups; it's a frequent clarification point."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How does amortization affect the average case performance?",
        "What strategies mitigate the worst-case collision scenario?"
      ] }
    ]
  },
  {
    q: { en: "What are Edge Cases for Two Sum (LC1)?" },
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Edge Case Handling" },
      { type: 'ul', items: [
        "Interviewer might ask: 'What edge cases should you consider for Two Sum?' to test your thoroughness.",
        "They could follow with: 'How would you handle an empty array in this problem?' to check your robustness.",
        "A deeper question might be: 'What if the array contains negative numbers—does your solution still work?' to probe adaptability."
      ]},
      { type: 'subheading', en: "Edge Cases" },
      { type: 'ul', items: [
        "An empty array is a critical edge case where the length is 0, meaning no elements exist to form a pair, so the function should return an empty array [] as per the problem’s implicit requirement to handle invalid inputs gracefully.",
        "A single-element array, where n = 1, cannot satisfy the two-number requirement, leading to no solution, and the algorithm should return [] after checking, highlighting the need for a minimum size validation.",
        "Negative numbers, such as in [-1, 1] with target = 0, are valid inputs that the hash map or brute force approach handles naturally, as the sum calculation works with any integer values, requiring no special modification.",
        "Duplicates, like [3, 3] with target = 6, pose a challenge since the problem disallows using the same index twice, necessitating an index check (i != j in brute force or unique index tracking in hash) to ensure validity.",
        "No solution exists if no pair sums to the target, and while the problem assumes one solution, a robust implementation should return [] after exhaustive search, preparing for potential test case variations."
      ]},
      { type: 'subheading', en: "Practical Tip" }, // Selective explanatory tag/heading
      { type: 'ul', items: [
        "Always test with empty, single, negative, and duplicate inputs during prep."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you validate an empty input before processing?",
        "What if multiple pairs sum to the target—how would you handle that?"
      ] }
    ]
  },
  {
    q: { en: "How to Handle Duplicates in Two Sum?" },
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Duplicate Management" },
      { type: 'ul', items: [
        "Interviewer might ask: 'What if the array contains duplicate values—how does that affect your solution?' to test your attention to constraints.",
        "They could follow with: 'Can you modify your code to handle duplicates correctly?' to assess your problem-solving adaptability.",
        "A deeper question might be: 'Why does the problem specify no same element twice?' to explore your understanding of problem design."
      ]},
      { type: 'subheading', en: "Handling Strategy" },
      { type: 'ul', items: [
        "The Two Sum problem on LeetCode explicitly states that the same element cannot be used twice, meaning the indices i and j must be distinct, which requires implementing a check in the brute force approach where j starts from i + 1 to avoid self-pairing, ensuring each pair uses different positions.",
        "In the hash map approach, duplicates are handled implicitly because each number is stored with its first encountered index, and when checking the complement, the algorithm uses the existing index, but to enforce the no-repeat rule, you must ensure the current index i differs from the stored index, adding a validation step if needed.",
        "This constraint reflects a real-world scenario where using the same value twice (e.g., [3, 3] with target = 6) would be invalid, as it violates the problem’s intent to find distinct occurrences, making it a key consideration during implementation and interview discussion."
      ]},
      { type: 'subheading', en: "Key Interview Insight" }, // Selective explanatory tag/heading
      { type: 'ul', items: [
        "If duplicates are allowed, modify to permit same-index pairs, but confirm with interviewer."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "Why is it important to avoid using the same index?",
        "How would you modify the solution if duplicates were allowed?"
      ] }
    ]
  },
  {
    q: { en: "What are Trade-Offs of Hash Map for Two Sum?" },
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Trade-Off Analysis" },
      { type: 'ul', items: [
        "Interviewer might ask: 'What are the trade-offs of using a hash map in your solution?' to evaluate your optimization decisions.",
        "They could follow with: 'When would you prefer a different approach over a hash map?' to test your strategic thinking.",
        "A deeper question might be: 'How do collisions impact these trade-offs?' to probe your technical depth."
      ]},
      { type: 'subheading', en: "Trade-Off Analysis" },
      { type: 'ul', items: [
        "The primary advantage of the hash map approach is its O(n) time complexity, achieved through a single pass and O(1) average-case lookups, making it highly efficient for large unsorted arrays where nested loops would be prohibitively slow, a critical factor in FAANG interviews with tight time limits.",
        "The main disadvantage is the O(n) space complexity, as the map stores up to n key-value pairs, which could be a concern on memory-constrained systems or when the interviewer emphasizes space efficiency, requiring you to justify this trade-off.",
        "An alternative approach, the two-pointer method, offers O(1) space complexity after an initial O(n log n) sort, which is preferable when memory is limited, but the sorting overhead makes it less ideal for unsorted data, highlighting a classic time-versus-space dilemma."
      ]},
      { type: 'subheading', en: "Practical Tip" }, // Selective explanatory tag/heading
      { type: 'ul', items: [
        "Ask about constraints: if n is small, space doesn't matter; if large, justify O(n) space."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "When would you choose the two-pointer method over a hash map?",
        "How do you handle potential hash collisions in practice?"
      ] }
    ]
  },
  {
    q: { en: "Variations of 3Sum Problem Statement (LC15)" },
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Problem Statement Variations" },
      { type: 'ul', items: [
        "Interviewer might ask: 'Can you find all unique triplets in this array that sum to zero?' to present a standard 3Sum scenario, testing your pattern recognition.",
        "They could pose: 'Imagine a list of numbers—can you identify three numbers adding up to a specific value with no repeats?' to introduce a slight variation.",
        "A more complex version might be: 'Design a solution for triplets summing to X in an unsorted list, ensuring uniqueness,' to challenge your optimization skills.",
        "They might ask: 'How would you detect unique triples equaling zero in this dataset, handling duplicates?' to add an edge case."
      ]},
      { type: 'subheading', en: "Pattern Recognition Hints" },
      { type: 'ul', items: [
        "The keyword 'triplet' or 'three numbers' indicates a 3Sum problem, suggesting the involvement of three elements, which differentiates it from Two Sum and requires a nested approach.",
        "Phrases like 'sum to zero' or 'specific value' define the target constraint, guiding you toward a solution that adjusts multiple pointers or uses additional data structures.",
        "The term 'unique' emphasizes the need to avoid duplicate triplets, hinting at the requirement to skip repeated elements during iteration, a key aspect of the optimized solution.",
        "An 'unsorted' mention suggests the need for initial sorting, steering you toward a two-pointer strategy after ordering the array."
      ]},
      { type: 'ascii', ascii: `
+------------+---------------+-----------------+
| Keyword    | Implication   | Approach Hint   |
+------------+---------------+-----------------+
| Triplet    | Three elements| Two Pointers    |
| Sum to     | Fixed target  | Pointer Adjust  |
| Unique     | No duplicates | Skip Adjacent   |
| Unsorted   | Needs sorting | O(n log n)      |
+------------+---------------+-----------------+
      ` },
      { type: 'subheading', en: "Key Interview Insight" }, // Selective explanatory tag/heading
      { type: 'ul', items: [
        "3Sum often follows Two Sum in interviews as a progression test."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "Is sorting a mandatory step for this problem?",
        "How do you ensure no duplicate triplets are included?"
      ] }
    ]
  },
  {
    q: { en: "Pattern Recognition for 3Sum (LC15)" },
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Pattern Identification" },
      { type: 'ul', items: [
        "Interviewer might ask: 'How did you identify this as a 3Sum problem?' to test your pattern recognition skills.",
        "They could follow with: 'What specific hints in the question led you to this conclusion?' to evaluate your attention to detail.",
        "A deeper question might be: 'Could this be a different pattern—how do you confirm?' to assess your differentiation ability."
      ]},
      { type: 'subheading', en: "Recognition Strategy" },
      { type: 'ul', items: [
        "Start by noting the presence of 'triplet' or 'three numbers,' which clearly indicates a 3Sum problem, as it involves finding three elements rather than two, requiring a more complex nested structure.",
        "Identify 'sum to zero' or a 'specific value' as the target constraint, which defines the goal and suggests a need for a systematic comparison across three positions, typically after sorting.",
        "Recognize 'unique' as a requirement to avoid duplicate triplets, implying the need for duplicate-skipping logic, which is a hallmark of the optimized 3Sum solution.",
        "Consider 'unsorted' as a hint that initial sorting is necessary, guiding you toward a two-pointer approach post-sort, and always clarify with the interviewer if the array’s order is fixed."
      ]},
      { type: 'ascii', ascii: `
+------------+---------------+-----------------+---------------------+
| Keyword    | Implication   | Approach Hint   | Explanation         |
+------------+---------------+-----------------+---------------------+
| Triplet    | Three elements| Two Pointers    | Requires 3 items    |
| Sum to     | Fixed target  | Pointer Adjust  | Adjusts for target  |
| Unique     | No duplicates | Skip Adjacent   | Avoids repetition   |
| Unsorted   | Needs sorting | O(n log n)      | Orders for pointers |
+------------+---------------+-----------------+---------------------+
      ` },
      { type: 'subheading', en: "Practical Tip" }, // Selective explanatory tag/heading
      { type: 'ul', items: [
        "Link it back to Two Sum: 'This extends Two Sum by adding a third element.'"
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "Why is sorting a beneficial first step here?",
        "What alternative methods could you explore for 3Sum?"
      ] }
    ]
  },
  {
    q: { en: "Optimized Two-Pointer Approach for 3Sum (LC15)" },
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Optimized Solution" },
      { type: 'ul', items: [
        "Interviewer might ask: 'Can you optimize your approach to find all triplets summing to zero?' to push for efficiency.",
        "They could follow with: 'Walk me through your two-pointer implementation,' to test your coding logic.",
        "A follow-up might be: 'How do you handle duplicates in this solution?' to check your robustness."
      ]},
      { type: 'subheading', en: "Approach Details" },
      { type: 'ul', items: [
        "The optimized approach begins by sorting the array in O(n log n) time using a comparison-based sort like quicksort, which arranges elements in ascending order, enabling the two-pointer technique to work efficiently by leveraging the sorted property.",
        "A single loop fixes the first element (i), and two pointers—left starting at i + 1 and right at the end—adjust based on the sum of the three elements, moving inward when the sum deviates from zero, ensuring all combinations are explored.",
        "Duplicate triplets are avoided by skipping adjacent equal elements after a match is found, using while loops to increment left or decrement right past duplicates, maintaining the ‘unique’ requirement of the problem."
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
        "For nums = [-1, 0, 1, 2, -1, -4], after sorting to [-4, -1, -1, 0, 1, 2]: i = 0 (-4) is skipped as it can’t sum to 0 with two positives; i = 1 (-1) with left = 2 (-1) and right = 5 (2) gives -1 -1 + 2 = -3 < 0, so left moves to 3 (0).",
        "Continuing, i = 1 (-1), left = 3 (0), right = 5 (2) gives -1 + 0 + 2 = 1 > 0, so right moves to 4 (1); then -1 + 0 + 1 = 0, adding [-1, 0, 1] and skipping duplicates, showing the process."
      ]},
      { type: 'ascii', ascii: `
i=1 (-1): left=3 (0), right=4 (1) → 0
i=1 (-1): left=2 (-1), right=5 (2) → -3 → adjust
      ` },
      { type: 'subheading', en: "Complexity" },
      { type: 'ul', items: [
        "The time complexity is O(n²) overall, with an initial O(n log n) sort followed by O(n²) for the two nested loops (outer i and inner left/right adjustments), making it efficient for the problem’s constraints.",
        "The space complexity is O(1) excluding the output array, as the algorithm uses only a few variables, though the sort might use O(log n) stack space internally, which is negligible."
      ]},
      { type: 'subheading', en: "Key Interview Insight" }, // Selective explanatory tag/heading
      { type: 'ul', items: [
        "Explain duplicate skipping; it's a common gotcha in 3Sum."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "Why is sorting necessary before applying pointers?",
        "How do you handle a case where no solution exists?"
      ] }
    ]
  },
  {
    q: { en: "What are Trade-Offs of Two-Pointer for 3Sum?" },
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Trade-Off Analysis" },
      { type: 'ul', items: [
        "Interviewer might ask: 'What are the trade-offs of your two-pointer approach for 3Sum?' to evaluate your optimization choices.",
        "They could follow with: 'When might another method be better than two pointers?' to test your flexibility.",
        "A deeper question might be: 'How does the sort impact the overall efficiency?' to probe your reasoning."
      ]},
      { type: 'subheading', en: "Trade-Off Analysis" },
      { type: 'ul', items: [
        "The advantage of the two-pointer approach lies in its O(1) space complexity, using only a few variables and relying on the sorted array, which is highly beneficial when memory is a constraint or when the interviewer emphasizes space efficiency in a FAANG setting.",
        "The disadvantage is the initial O(n log n) sorting overhead, which can be significant for large arrays, adding a preprocessing step that increases the total time complexity to O(n²) when combined with the pointer adjustments, potentially making it less competitive for very large datasets.",
        "An alternative hash-based approach, which might use O(n) space to store pairs or complements, could achieve O(n²) time without sorting, offering a trade-off where space is sacrificed for potentially better performance on unsorted data, though it complicates duplicate handling."
      ]},
      { type: 'subheading', en: "Practical Tip" }, // Selective explanatory tag/heading
      { type: 'ul', items: [
        "Prefer two-pointer for space-constrained problems; hash for time-critical ones."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "When would you prefer a hash-based solution over two pointers?",
        "What is the impact of the sorting step on time for large n?"
      ] }
    ]
  },
  {
    q: { en: "Impact of Memory Fragmentation on Array Performance" },
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Fragmentation Effects" },
      { type: 'ul', items: [
        "Interviewer might ask: 'How does memory fragmentation affect array performance?' to test your system-level understanding.",
        "They could follow with: 'What strategies can mitigate fragmentation in dynamic languages?' to explore your problem-solving depth."
      ]},
      { type: 'subheading', en: "Fragmentation Impact" },
      { type: 'ul', items: [
        "Memory fragmentation occurs when free memory is broken into small, non-contiguous blocks due to repeated allocations and deallocations, making it difficult to allocate a large contiguous block for an array, which can lead to allocation failures or performance hits during resizing in JavaScript.",
        "This affects array performance by increasing the time taken for dynamic resizing operations, as the V8 engine may need to search for or request new memory blocks, potentially triggering garbage collection pauses that delay execution, especially in Sum Pattern solutions with large inputs."
      ]},
      { type: 'subheading', en: "Mitigation Strategies" },
      { type: 'ul', items: [
        "One strategy is to pre-allocate a larger array size if the maximum input is known, reducing the need for frequent resizing and minimizing fragmentation, though this requires prior knowledge of the data."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How does fragmentation differ between static and dynamic allocation?",
        "What are the performance costs of garbage collection in this context?"
      ] }
    ]
  },
  {
    q: { en: "Memory Overhead in Large Arrays in JavaScript" },
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Memory Overhead" },
      { type: 'ul', items: [
        "Interviewer might ask: 'What is the memory overhead for large arrays in JavaScript?' to test your awareness of runtime behavior."
      ]},
      { type: 'subheading', en: "Overhead Details" },
      { type: 'ul', items: [
        "In JavaScript, large arrays incur overhead due to the V8 engine’s object representation, where each element is stored with metadata (e.g., type tags, length pointers), adding a per-element cost beyond the raw data size, which can become significant with millions of elements."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How does this overhead impact performance in Sum Pattern algorithms?",
        "Can you suggest ways to reduce this overhead?"
      ] }
    ]
  },
  {
    q: { en: "Why Not Always Sort the Array?" },
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Sorting Decision" },
      { type: 'ul', items: [
        "Interviewer might ask: 'Why wouldn’t you always sort the array to simplify the problem?' to test your optimization judgment."
      ]},
      { type: 'subheading', en: "Reasoning" },
      { type: 'ul', items: [
        "Sorting introduces an O(n log n) time overhead, which can be prohibitive for large arrays or time-sensitive applications, outweighing the benefits of subsequent O(n) pointer operations, especially when the array is already processed efficiently with O(n) hash maps."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "When is sorting justified despite the overhead?",
        "How does unsorted data affect sorting decisions?"
      ] }
    ]
  },
  {
    q: { en: "Space vs. Time Trade-Off in Sum Patterns" },
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Trade-Off Evaluation" },
      { type: 'ul', items: [
        "Interviewer might ask: 'How do you balance space and time trade-offs in your solution?' to assess your decision-making."
      ]},
      { type: 'subheading', en: "Trade-Off Analysis" },
      { type: 'ul', items: [
        "The decision to use a hash map sacrifices O(n) space for O(n) time, which is preferable when speed is critical and memory is abundant, whereas sorting for two pointers uses O(1) space but adds O(n log n) time, favoring memory efficiency over speed."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you decide based on problem constraints?",
        "What are the real-world implications of these trade-offs?"
      ] }
    ]
  },
  {
    q: { en: "Why is a Sorted Array Necessary for Pointer-Based Solutions?" },
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Sorting Necessity" },
      { type: 'ul', items: [
        "Interviewer might ask: 'Why is a sorted array necessary for your pointer solution?' to test your algorithmic insight."
      ]},
      { type: 'subheading', en: "Reasoning" },
      { type: 'ul', items: [
        "A sorted array enables predictable pointer movement, where increasing the left pointer always increases the sum and decreasing the right pointer decreases it, a logic that fails in unsorted arrays where element order is random."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What happens if the array is unsorted with pointers?",
        "Can you adapt pointers for unsorted data?"
      ] }
    ]
  },
  {
    q: { en: "What is the Detailed Logic Behind Pointer Movement in Each Step?" },
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Pointer Logic" },
      { type: 'ul', items: [
        "Interviewer might ask: 'Can you explain the logic behind each step of pointer movement?' to test your step-by-step reasoning."
      ]},
      { type: 'subheading', en: "Movement Logic" },
      { type: 'ul', items: [
        "Each step involves comparing the current sum to the target, adjusting pointers based on the deviation, ensuring a systematic convergence that leverages the sorted order."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you validate each adjustment?",
        "What if the sum equals the target mid-process?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Edge Cases Like Equal Sums or No Solution?" },
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Edge Case Handling" },
      { type: 'ul', items: [
        "Interviewer might ask: 'How do you handle cases where sums are equal or no solution exists?' to test your completeness."
      ]},
      { type: 'subheading', en: "Handling Strategy" },
      { type: 'ul', items: [
        "For equal sums, return the indices immediately; for no solution, continue until pointers cross, then return an empty result."
      ]},
      { type: 'subheading', en: "Key Interview Insight" }, // Selective explanatory tag/heading
      { type: 'ul', items: [
        "Discuss how your code gracefully returns [] for no solution."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What validation ensures no solution is correct?",
        "How do you handle multiple equal sums?"
      ] }
    ]
  },
  {
    q: { en: "What is the Time Impact of Pointer Adjustments on Large Arrays?" },
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Performance Impact" },
      { type: 'ul', items: [
        "Interviewer might ask: 'How do pointer adjustments affect performance on large arrays?' to test your scalability awareness."
      ]},
      { type: 'subheading', en: "Impact Analysis" },
      { type: 'ul', items: [
        "Pointer adjustments remain O(n) after sorting, but the constant factor increases with array size, potentially slowing down execution on very large datasets."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How can you optimize this for massive inputs?",
        "What is the bottleneck in large-scale pointer use?"
      ] }
    ]
  },
  {
    q: { en: "Is the Array Sorted?" },
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Sorting Clarification" },
      { type: 'ul', items: [
        "Interviewer might ask: 'Is the array sorted, or should I assume it’s unsorted?' to test your clarification skills."
      ]},
      { type: 'subheading', en: "Clarification Strategy" },
      { type: 'ul', items: [
        "Always ask the interviewer to confirm the array’s order, as it dictates whether to use hash maps (unsorted) or two pointers (sorted), ensuring the correct approach."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What if the order changes mid-problem?",
        "How does this affect your chosen method?"
      ] }
    ]
  },
  {
    q: { en: "What if Duplicates Exist?" },
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Duplicate Handling" },
      { type: 'ul', items: [
        "Interviewer might ask: 'What if the array contains duplicate values?' to test your edge case management."
      ]},
      { type: 'subheading', en: "Handling Strategy" },
      { type: 'ul', items: [
        "Implement index checks or skip adjacent duplicates in sorted arrays to maintain uniqueness, adapting the solution based on the problem’s rules."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you detect duplicates efficiently?",
        "What if the problem allows duplicate usage?"
      ] }
    ]
  },
  {
    q: { en: "How Does Hash Map Work?" },
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Hash Map Mechanism" },
      { type: 'ul', items: [
        "Interviewer might ask: 'Can you explain how a hash map works internally?' to test your data structure depth."
      ]},
      { type: 'subheading', en: "Mechanism Details" },
      { type: 'ul', items: [
        "A hash map uses a hash function to map keys to indices, with collision resolution via chaining, ensuring O(1) average access."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What happens during a collision?",
        "How is the hash function designed?"
      ] }
    ]
  },
  {
    q: { en: "Space Trade-Off of Hash Map?" },
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Space Considerations" },
      { type: 'ul', items: [
        "Interviewer might ask: 'What are the space trade-offs of using a hash map?' to evaluate your resource awareness."
      ]},
      { type: 'subheading', en: "Trade-Off Details" },
      { type: 'ul', items: [
        "The O(n) space usage trades time efficiency for memory, storing all seen elements, which can be a limitation on memory-constrained systems."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you justify this space usage?",
        "What alternatives minimize space?"
      ] }
    ]
  },
  {
    q: { en: "When to Use Hash?" },
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Hash Usage" },
      { type: 'ul', items: [
        "Interviewer might ask: 'When would you choose to use a hash map?' to test your strategic choice."
      ]},
      { type: 'subheading', en: "Usage Scenario" },
      { type: 'ul', items: [
        "Use a hash map when the array is unsorted and speed is prioritized over space, leveraging O(n) time with O(n) space for efficient lookups."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What if space is a constraint?",
        "How does this compare to sorting?"
      ] }
    ]
  },
  {
    q: { en: "When to Use Pointers?" },
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Pointer Usage" },
      { type: 'ul', items: [
        "Interviewer might ask: 'When would you use the two-pointer technique?' to test your approach selection."
      ]},
      { type: 'subheading', en: "Usage Scenario" },
      { type: 'ul', items: [
        "Use two pointers when the array is sorted and space efficiency is key, accepting O(n log n) sort time for O(n) search time with O(1) space."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What if the array isn’t sorted?",
        "How does this impact memory usage?"
      ] }
    ]
  },
  {
    q: { en: "Collision Handling in Hash Map?" },
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Collision Management" },
      { type: 'ul', items: [
        "Interviewer might ask: 'How do you handle collisions in a hash map?' to test your technical depth."
      ]},
      { type: 'subheading', en: "Handling Strategy" },
      { type: 'ul', items: [
        "Collisions are managed using chaining with linked lists at each index or open addressing with probing, ensuring data access remains functional despite hash conflicts."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What is the impact of collisions on performance?",
        "How do you choose between chaining and probing?"
      ] }
    ]
  },
  {
    q: { en: "Is Sorting Necessary for This Problem?" },
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Sorting Necessity" },
      { type: 'ul', items: [
        "Interviewer might ask: 'Is sorting necessary for this 3Sum problem?' to test your approach justification."
      ]},
      { type: 'subheading', en: "Necessity Analysis" },
      { type: 'ul', items: [
        "Sorting is necessary for two-pointer efficiency in 3Sum, enabling predictable sum adjustments, though a hash-based method could avoid it at the cost of space."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What if sorting is too costly?",
        "How does this affect duplicate handling?"
      ] }
    ]
  },

 {
    q: { en: "How Do You Ensure No Duplicate Triplets?" },
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Duplicate Prevention" },
      { type: 'ul', items: [
        "Interviewer might ask: 'How do you ensure no duplicate triplets in your 3Sum solution?' to test your precision and attention to the problem’s unique triplet requirement, expecting you to demonstrate a clear strategy for handling repeated values."
      ]},
      { type: 'subheading', en: "Handling Strategy" },
      { type: 'ul', items: [
        "The strategy to ensure no duplicate triplets begins with sorting the array, which groups identical elements together, providing a foundation for identifying and skipping repeats, as the two-pointer approach can then leverage this order to avoid redundant combinations.",
        "After sorting, the outer loop that fixes the first element (i) includes a check to skip any element that matches the previous one (if i > 0 && nums[i] === nums[i - 1]), preventing the same triplet from being generated with a different starting point, which is crucial for maintaining uniqueness.",
        "Within the inner two-pointer loop, when a valid sum (e.g., zero) is found, the algorithm uses while loops to increment left past any duplicate values (while left < right && nums[left] === nums[left + 1]) and decrement right past duplicates (while left < right && nums[right] === nums[right - 1]), ensuring that each unique triplet is added only once to the result.",
        "This meticulous duplicate-skipping process, combined with the sorted array’s ability to cluster identical elements, guarantees that no two triplets are identical, aligning with the problem’s constraint and preparing you to handle real interview scenarios where clarity and correctness are paramount."
      ]},
      { type: 'subheading', en: "Practical Tip" }, // Selective explanatory tag/heading
      { type: 'ul', items: [
        "Practice dry-running with duplicates like [-1, -1, 2]."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What happens if the array is already sorted—do you still need these checks?",
        "How would you modify this if duplicates were allowed in the triplets?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle a Case Where No Solution Exists?" },
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: No Solution Handling" },
      { type: 'ul', items: [
        "Interviewer might ask: 'How do you handle a case where no solution exists for 3Sum?' to test your ability to manage edge cases and ensure robust code, expecting a clear termination strategy."
      ]},
      { type: 'subheading', en: "Handling Strategy" },
      { type: 'ul', items: [
        "When no solution exists, the two-pointer approach continues its iterations until the outer loop (i) reaches the end of the array (n - 2) and the inner while loop exhausts all possible left and right combinations, at which point the algorithm naturally concludes with an empty result array.",
        "The logic relies on the while condition (left < right) to stop when pointers cross, indicating that all pairs for a given i have been checked without finding a sum of zero, and since the outer loop covers all possible first elements, this ensures comprehensive coverage.",
        "To make this explicit, the function returns the result array (initially empty) after the loops complete, adhering to the problem’s implicit requirement to handle cases where no valid triplet exists, such as an array like [1, 2, 3] with no zero-sum triplet.",
        "This approach prepares you for interviews where test cases might include no-solution scenarios, allowing you to confidently explain that the algorithm’s design inherently detects this by returning an empty result, showcasing robustness."
      ]},
      { type: 'subheading', en: "Key Interview Insight" }, // Selective explanatory tag/heading
      { type: 'ul', items: [
        "The problem assumes solutions exist, but robust code handles this anyway."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you validate that no solution is the correct outcome?",
        "What if the problem requires reporting why no solution exists?"
      ] }
    ]
  },
  {
    q: { en: "Why is Sorting Beneficial for 3Sum?" },
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Sorting Benefits" },
      { type: 'ul', items: [
        "Interviewer might ask: 'Why is sorting beneficial for solving 3Sum?' to evaluate your understanding of how preprocessing impacts the algorithm, expecting a detailed justification."
      ]},
      { type: 'subheading', en: "Benefit Analysis" },
      { type: 'ul', items: [
        "Sorting the array in O(n log n) time arranges elements in ascending order, which enables the two-pointer technique to make predictable adjustments—moving left to increase the sum or right to decrease it—based on the relative magnitude of elements, a logic that would fail in an unsorted array.",
        "This ordered structure simplifies duplicate handling by grouping identical elements together, allowing the algorithm to skip them efficiently with adjacent checks, ensuring the uniqueness constraint is met without additional complexity.",
        "The sorted order also facilitates early termination or optimization opportunities, such as skipping a first element (i) if it’s too large to sum to zero with the remaining elements, reducing unnecessary computations and enhancing overall efficiency.",
        "In a FAANG interview context, this preprocessing step demonstrates your ability to transform a problem into a solvable form, leveraging sorting as a strategic tool to unlock the power of two-pointers, a technique highly valued for its elegance."
      ]},
      { type: 'subheading', en: "Practical Tip" }, // Selective explanatory tag/heading
      { type: 'ul', items: [
        "If array is pre-sorted, skip the sort step to save time."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What are the downsides of sorting in terms of time complexity?",
        "Can you solve 3Sum without sorting—how?"
      ] }
    ]
  },
  {
    q: { en: "What Alternative Methods Could You Explore for 3Sum?" },
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Alternative Approaches" },
      { type: 'ul', items: [
        "Interviewer might ask: 'Are there alternative methods to solve 3Sum besides two pointers?' to test your creativity and breadth of knowledge, expecting you to propose viable options."
      ]},
      { type: 'subheading', en: "Alternative Methods" },
      { type: 'ul', items: [
        "One alternative is a hash set approach, where you fix the first element and use a set to store the remaining elements, checking for pairs that sum to the negation of the first element, achieving O(n²) time with O(n) space but requiring careful duplicate management.",
        "Another method involves a brute force triple loop (O(n³)), which checks all possible triplets without sorting, offering a baseline solution that’s simple but inefficient, useful for understanding the problem before optimization.",
        "A hybrid approach could combine sorting with a hash map for the inner pair search, reducing the need for two pointers but increasing space complexity, which might be explored if memory is less constrained than time."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How does the hash set method handle duplicates compared to two pointers?",
        "What are the trade-offs of the brute force method versus optimized solutions?"
      ] }
    ]
  },
  {
    q: { en: "What Happens if the Array is Already Sorted?" },
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Pre-Sorted Array" },
      { type: 'ul', items: [
        "Interviewer might ask: 'What if the array is already sorted—does that change your approach?' to test your adaptability to given conditions."
      ]},
      { type: 'subheading', en: "Impact Analysis" },
      { type: 'ul', items: [
        "If the array is already sorted, the initial O(n log n) sorting step can be skipped, reducing the total time complexity to O(n²) for the two-pointer adjustments, significantly boosting performance for large inputs.",
        "The duplicate-skipping logic remains essential, as the sorted order still groups identical elements, requiring the same checks (e.g., skipping nums[i] === nums[i - 1]) to ensure uniqueness, but the process becomes more efficient without preprocessing.",
        "This scenario allows you to demonstrate optimization awareness in an interview, noting that you’d verify the sorted state with the interviewer and adjust your algorithm accordingly, showcasing practical decision-making."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you confirm the array is sorted before skipping the sort?",
        "What if the sort order is descending instead of ascending?"
      ] }
    ]
  },
  {
    q: { en: "How Would You Modify This if Duplicates Were Allowed in Triplets?" },
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Duplicate Allowance" },
      { type: 'ul', items: [
        "Interviewer might ask: 'What if the problem allowed duplicates in the triplets—how would you modify your solution?' to test your flexibility and problem-solving depth."
      ]},
      { type: 'subheading', en: "Modification Strategy" },
      { type: 'ul', items: [
        "If duplicates are allowed, the duplicate-skipping checks (e.g., while left < right && nums[left] === nums[left + 1]) would be removed from the two-pointer loop, allowing the same value to be used multiple times in a triplet, such as [-1, -1, 2] summing to 0.",
        "The outer loop’s skip for nums[i] === nums[i - 1] could also be omitted, enabling multiple triplets to start with the same first element, provided the inner pointers find valid combinations, expanding the solution set.",
        "This modification increases the number of valid triplets, requiring careful tracking in the result array to avoid confusion, and you’d need to clarify with the interviewer whether order within triplets matters, adjusting the push logic (e.g., sorting triplets) if needed."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How does this affect the time and space complexity?",
        "What challenges arise with multiple duplicate values?"
      ] }
    ]
  },
  {
    q: { en: "What if Sorting is Too Costly?" },
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Sorting Cost" },
      { type: 'ul', items: [
        "Interviewer might ask: 'What if sorting is too costly for this problem—how would you proceed?' to test your ability to adapt to constraints."
      ]},
      { type: 'subheading', en: "Alternative Strategy" },
      { type: 'ul', items: [
        "If sorting’s O(n log n) cost is prohibitive, a hash set approach can be used, where you fix the first element and use a set to store the remaining elements, checking for pairs that sum to the negation, avoiding the sort but increasing space to O(n) and time to O(n²).",
        "This method leverages the hash set’s O(1) lookup to find complementary pairs, iterating over the array twice for each fixed element, which trades memory for time efficiency when sorting is a bottleneck.",
        "You’d need to handle duplicates manually by tracking seen pairs, potentially using a secondary map, adding complexity but preserving functionality without the sorting overhead."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How does this hash set method compare to two pointers in terms of space?",
        "What are the risks of avoiding sorting entirely?"
      ] }
    ]
  },
  {
    q: { en: "How Does This Affect Duplicate Handling?" },
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Duplicate Impact" },
      { type: 'ul', items: [
        "Interviewer might ask: 'How does avoiding sorting affect duplicate handling in 3Sum?' to test your awareness of preprocessing effects."
      ]},
      { type: 'subheading', en: "Impact Analysis" },
      { type: 'ul', items: [
        "Without sorting, duplicates are scattered, requiring a hash-based approach to track and filter them, as the two-pointer method relies on sorted adjacency to skip repeats efficiently.",
        "A hash set or map must store seen combinations or use a custom comparison to avoid duplicates, adding O(n) space and complicating the logic, as the algorithm can’t rely on sequential order.",
        "This shift increases implementation complexity, potentially leading to missed duplicates unless explicitly managed, making it a trade-off worth discussing with the interviewer."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How would you implement duplicate checking without sorting?",
        "What are the performance implications of this change?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Validate Each Pointer Adjustment?" },
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Validation Process" },
      { type: 'ul', items: [
        "Interviewer might ask: 'How do you validate each pointer adjustment in your 3Sum solution?' to test your attention to detail and correctness."
      ]},
      { type: 'subheading', en: "Validation Strategy" },
      { type: 'ul', items: [
        "Each adjustment is validated by recalculating the sum after moving a pointer (left++ or right--), ensuring the new sum is re-evaluated against the target, confirming the direction of movement (e.g., sum < 0 triggers left++, sum > 0 triggers right--).",
        "The while loop condition (left < right) acts as a continuous check, stopping the process when pointers cross, indicating all possibilities are exhausted, serving as a natural validation boundary.",
        "After a match (sum = 0), the duplicate-skipping logic validates that no redundant moves occur by checking adjacent elements, ensuring the adjustment leads to a unique triplet, reinforcing the solution’s integrity."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What if an adjustment leads to an invalid state?",
        "How do you ensure the validation doesn’t miss a solution?"
      ] }
    ]
  },
  {
    q: { en: "What if the Sum Equals the Target Mid-Process?" },
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Mid-Process Match" },
      { type: 'ul', items: [
        "Interviewer might ask: 'What do you do if the sum equals the target mid-process in 3Sum?' to test your handling of dynamic outcomes."
      ]},
      { type: 'subheading', en: "Handling Strategy" },
      { type: 'ul', items: [
        "When the sum equals the target mid-process (e.g., sum = 0), the algorithm adds the triplet [nums[i], nums[left], nums[right]] to the result, then skips duplicates by incrementing left and decrementing right past equal values, ensuring uniqueness.",
        "After recording the match, the pointers continue moving (left++ and right--) to explore remaining possibilities, as 3Sum requires all unique triplets, not just the first one, maintaining the loop until left >= right.",
        "This approach ensures no solution is missed, allowing the process to proceed systematically, which is critical for FAANG interviews where completeness is expected."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you avoid re-processing the same triplet?",
        "What if multiple sums match the target?"
      ] }
    ]
  },
  {
    q: { en: "How Can You Optimize This for Massive Inputs?" },
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Scalability Optimization" },
      { type: 'ul', items: [
        "Interviewer might ask: 'How can you optimize your 3Sum solution for massive inputs?' to test your scalability strategies."
      ]},
      { type: 'subheading', en: "Optimization Strategy" },
      { type: 'ul', items: [
        "For massive inputs, consider a partial sorting or bucketing approach to group similar values, reducing the effective search space before applying two pointers, though this adds complexity.",
        "Implementing an early termination check, such as skipping i if nums[i] > 0 and the remaining elements can’t sum to zero, can prune the search tree, especially for large sorted arrays.",
        "Using a more efficient sorting algorithm like introsort (used in many standard libraries) or parallel processing for the initial sort can mitigate the O(n log n) bottleneck, though this depends on the interview environment’s constraints."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What are the trade-offs of partial sorting?",
        "How does parallel processing affect this solution?"
      ] }
    ]
  },
  {
    q: { en: "What is the Bottleneck in Large-Scale Pointer Use?" },
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Bottleneck Identification" },
      { type: 'ul', items: [
        "Interviewer might ask: 'What is the bottleneck when using pointers on large-scale arrays?' to test your performance analysis."
      ]},
      { type: 'subheading', en: "Bottleneck Analysis" },
      { type: 'ul', items: [
        "The primary bottleneck is the O(n²) time complexity of the two-pointer adjustments after sorting, as the number of comparisons grows quadratically with array size, becoming significant for massive inputs.",
        "Memory access patterns can also slow down due to cache misses in contiguous memory, especially if the array exceeds cache size, impacting pointer movement efficiency on large datasets."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How can you reduce the number of comparisons?",
        "What role does cache efficiency play here?"
      ] }
    ]
  },
  {
    q: { en: "What if the Order Changes Mid-Problem?" },
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Dynamic Order" },
      { type: 'ul', items: [
        "Interviewer might ask: 'What if the array order changes mid-problem—how do you adapt?' to test your adaptability."
      ]},
      { type: 'subheading', en: "Adaptation Strategy" },
      { type: 'ul', items: [
        "If the order changes mid-problem, re-sort the array to restore the sorted state required for two pointers, incurring an additional O(n log n) cost but ensuring correctness, which you’d justify based on the problem’s dynamic nature.",
        "Alternatively, switch to a hash-based method that doesn’t rely on order, recalculating pairs with the updated array, though this requires O(n) space and careful duplicate tracking."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How often can the order change before this becomes inefficient?",
        "What if the change is partial rather than complete?"
      ] }
    ]
  },
  {
    q: { en: "How Does This Compare to Sorting in Terms of Space?" },
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Space Comparison" },
      { type: 'ul', items: [
        "Interviewer might ask: 'How does the hash set method compare to sorting in terms of space?' to test your resource analysis."
      ]},
      { type: 'subheading', en: "Comparison Analysis" },
      { type: 'ul', items: [
        "The hash set method uses O(n) space to store elements or pairs, contrasting with sorting’s O(1) or O(log n) stack space, making it more memory-intensive but avoiding the order dependency."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "When is the extra space justified?",
        "How does this impact performance on memory-limited systems?"
      ] }
    ]
  },
  {
    q: { en: "What Are the Risks of Avoiding Sorting Entirely?" },
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Sorting Risks" },
      { type: 'ul', items: [
        "Interviewer might ask: 'What are the risks of avoiding sorting entirely in 3Sum?' to test your risk assessment."
      ]},
      { type: 'subheading', en: "Risk Analysis" },
      { type: 'ul', items: [
        "Avoiding sorting risks losing the efficiency of two-pointer adjustments, forcing reliance on O(n²) hash operations, which may not scale as well for large inputs.",
        "Duplicate handling becomes more complex without sorted adjacency, requiring additional data structures and logic, increasing the chance of errors or oversight."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How can you mitigate these risks?",
        "What are the performance implications of this choice?"
      ] }
    ]
  },
  {
    q: { en: "How Would You Implement Duplicate Checking Without Sorting?" },
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Unsorted Duplicate Check" },
      { type: 'ul', items: [
        "Interviewer might ask: 'How would you implement duplicate checking without sorting?' to test your creative problem-solving."
      ]},
      { type: 'subheading', en: "Implementation Strategy" },
      { type: 'ul', items: [
        "Use a hash set to track seen triplets or pairs, comparing each new combination against the set to filter duplicates, requiring O(n) space per fixed element and O(n²) time overall.",
        "Implement a custom comparison function to check for equivalent triplets regardless of order, storing them as sorted tuples in the set, adding complexity but preserving uniqueness."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What is the space overhead of this method?",
        "How does this affect the algorithm’s readability?"
      ] }
    ]
  },
  {
    q: { en: "What Are the Performance Implications of This Change?" },
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Performance Impact" },
      { type: 'ul', items: [
        "Interviewer might ask: 'What are the performance implications of avoiding sorting and using hash sets?' to test your optimization awareness."
      ]},
      { type: 'subheading', en: "Implication Analysis" },
      { type: 'ul', items: [
        "The change shifts the time complexity to O(n²) with O(n) space, potentially improving on O(n log n) sort time for small inputs but risking hash collision slowdowns, impacting scalability."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you measure this impact in practice?",
        "What are the trade-offs for different input sizes?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Confirm the Array is Sorted Before Skipping the Sort?" },
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Sort Verification" },
      { type: 'ul', items: [
        "Interviewer might ask: 'How do you confirm the array is sorted before skipping the sort?' to test your validation process."
      ]},
      { type: 'subheading', en: "Verification Strategy" },
      { type: 'ul', items: [
        "Perform a single pass to check if nums[i] <= nums[i + 1] for all i, returning true if valid, with O(n) time and O(1) space, ensuring the two-pointer logic can proceed safely."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What if the check fails—how do you proceed?",
        "Is this check worth the overhead?"
      ] }
    ]
  },
  {
    q: { en: "What if the Sort Order is Descending Instead of Ascending?" },
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Descending Order" },
      { type: 'ul', items: [
        "Interviewer might ask: 'What if the array is sorted in descending order?' to test your adaptability to variations."
      ]},
      { type: 'subheading', en: "Adaptation Strategy" },
      { type: 'ul', items: [
        "Reverse the array or adjust pointer logic to move left for sum < 0 and right for sum > 0, maintaining the two-pointer approach with O(n) extra space or O(n) time for reversal."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How does this affect duplicate handling?",
        "What is the cost of reversing the array?"
      ] }
    ]
  },
  {
    q: { en: "How Does Parallel Processing Affect This Solution?" },
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Parallel Processing" },
      { type: 'ul', items: [
        "Interviewer might ask: 'How does parallel processing affect your 3Sum solution?' to test your advanced optimization skills."
      ]},
      { type: 'subheading', en: "Impact Analysis" },
      { type: 'ul', items: [
        "Parallel processing can distribute the outer loop iterations across threads, reducing wall-clock time to O(n² / p) where p is the number of processors, though synchronization and load balancing add overhead."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What are the challenges of synchronizing parallel threads?",
        "How does this scale with very large arrays?"
      ] }
    ]
  },
  {
    q: { en: "What Role Does Cache Efficiency Play Here?" },
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Cache Efficiency" },
      { type: 'ul', items: [
        "Interviewer might ask: 'What role does cache efficiency play in your pointer solution?' to test your system-level awareness."
      ]},
      { type: 'subheading', en: "Role Analysis" },
      { type: 'ul', items: [
        "Cache efficiency improves with contiguous array access, reducing misses during pointer movement, but large arrays may exceed cache size, slowing down operations on massive inputs."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How can you optimize for cache usage?",
        "What happens if the array is fragmented in memory?"
      ] }
    ]
  },
  {
    q: { en: "How Often Can the Order Change Before This Becomes Inefficient?" },
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Order Change Frequency" },
      { type: 'ul', items: [
        "Interviewer might ask: 'How often can the array order change before your solution becomes inefficient?' to test your performance limits."
      ]},
      { type: 'subheading', en: "Frequency Analysis" },
      { type: 'ul', items: [
        "Efficiency drops if order changes exceed the cost of a single O(n log n) sort per change, making a dynamic hash-based approach more viable after a threshold, typically after 1-2 changes depending on array size."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you determine this threshold in practice?",
        "What if changes are incremental rather than complete?"
      ] }
    ]
  },
  {
    q: { en: "What if the Change is Partial Rather Than Complete?" },
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Partial Change" },
      { type: 'ul', items: [
        "Interviewer might ask: 'What if the array order changes partially rather than completely?' to test your adaptability to partial updates."
      ]},
      { type: 'subheading', en: "Adaptation Strategy" },
      { type: 'ul', items: [
        "For partial changes, re-sort only the affected segment using a modified quicksort or insertion sort, with O(k log k) where k is the segment size, then adjust pointers, minimizing overhead compared to full sorting."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you identify the changed segment efficiently?",
        "What if multiple segments change simultaneously?"
      ] }
    ]
  },
  {
    q: { en: "When is the Extra Space Justified?" },
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Space Justification" },
      { type: 'ul', items: [
        "Interviewer might ask: 'When is the extra space of a hash set justified?' to test your resource allocation reasoning."
      ]},
      { type: 'subheading', en: "Justification Analysis" },
      { type: 'ul', items: [
        "Extra space is justified when time savings (e.g., avoiding O(n log n) sort) outweigh memory costs, especially for large unsorted arrays where O(n²) hash operations are faster than sorting."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you assess memory availability in an interview?",
        "What are the risks of over-relying on extra space?"
      ] }
    ]
  },
  {
    q: { en: "How Does This Impact Performance on Memory-Limited Systems?" },
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Memory-Limited Performance" },
      { type: 'ul', items: [
        "Interviewer might ask: 'How does this impact performance on memory-limited systems?' to test your constraint handling."
      ]},
      { type: 'subheading', en: "Impact Analysis" },
      { type: 'ul', items: [
        "On memory-limited systems, the O(n) space of a hash set may cause out-of-memory errors, forcing a switch to two pointers with O(1) space, though the O(n log n) sort could still strain time constraints."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you detect memory limits during execution?",
        "What fallback strategies can you employ?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Measure This Impact in Practice?" },
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Practical Measurement" },
      { type: 'ul', items: [
        "Interviewer might ask: 'How do you measure the performance impact of your solution in practice?' to test your empirical skills."
      ]},
      { type: 'subheading', en: "Measurement Strategy" },
      { type: 'ul', items: [
        "Measure impact using benchmarking tools like JavaScript’s performance.now() to time execution across varying input sizes, comparing hash set and two-pointer methods to quantify differences."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What metrics should you focus on during benchmarking?",
        "How do you account for system variability?"
      ] }
    ]
  },
  {
    q: { en: "What Are the Trade-Offs for Different Input Sizes?" },
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Input Size Trade-Offs" },
      { type: 'ul', items: [
        "Interviewer might ask: 'What are the trade-offs for different input sizes in your 3Sum solution?' to test your scalability awareness."
      ]},
      { type: 'subheading', en: "Trade-Off Analysis" },
      { type: 'ul', items: [
        "For small inputs (n < 100), the O(n log n) sort overhead is negligible, favoring two pointers for simplicity; for large inputs (n > 1000), the O(n²) hash method may outperform if memory allows, balancing time and space."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you determine the input size threshold?",
        "What if the input size is unknown?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Detect Duplicates Efficiently?" },
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Efficient Duplicate Detection" },
      { type: 'ul', items: [
        "Interviewer might ask: 'How do you detect duplicates efficiently in an unsorted array?' to test your optimization skills."
      ]},
      { type: 'subheading', en: "Detection Strategy" },
      { type: 'ul', items: [
        "Use a hash set to track seen values during a single O(n) pass, adding each element and checking for existence, offering O(1) lookup time per element with O(n) space."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What is the space cost of this method?",
        "How does this scale with duplicate-heavy arrays?"
      ] }
    ]
  },
  {
    q: { en: "What if the Problem Allows Duplicate Usage?" },
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Duplicate Allowance" },
      { type: 'ul', items: [
        "Interviewer might ask: 'What if the problem allows using duplicates in Two Sum—how would you adjust?' to test your flexibility."
      ]},
      { type: 'subheading', en: "Adjustment Strategy" },
      { type: 'ul', items: [
        "Remove the i != j check in brute force or allow the same index in hash map lookups, enabling pairs like [3, 3] for target 6, though you’d clarify with the interviewer if order matters."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How does this affect the solution’s uniqueness?",
        "What are the implications for time complexity?"
      ] }
    ]
  },
  {
    q: { en: "How Does Amortization Affect Average Case Performance?" },
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Amortization Impact" },
      { type: 'ul', items: [
        "Interviewer might ask: 'How does amortization affect the average case performance of a hash map?' to test your theoretical depth."
      ]},
      { type: 'subheading', en: "Impact Analysis" },
      { type: 'ul', items: [
        "Amortization smooths out occasional O(n) hash collisions into an O(1) average by redistributing the cost over operations, ensuring consistent performance in Two Sum’s single-pass structure."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What triggers the need for amortization?",
        "How does this behave in the worst case?"
      ] }
    ]
  },
  {
    q: { en: "What Strategies Mitigate the Worst-Case Collision Scenario?" },
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Collision Mitigation" },
      { type: 'ul', items: [
        "Interviewer might ask: 'What strategies mitigate the worst-case collision scenario in a hash map?' to test your technical robustness."
      ]},
      { type: 'subheading', en: "Mitigation Strategies" },
      { type: 'ul', items: [
        "Use a good hash function with low collision probability, combined with dynamic resizing to maintain load factor below 1, preventing degeneration to O(n) lookups."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you choose an effective hash function?",
        "What is the cost of dynamic resizing?"
      ] }
    ]
  },

];


/* ========== builder: renders FAQ HTML without sidebar navigation ========== */
const buildSumPairFAQSection = (id, title, qaArray) => {
  let faqList = '<div class="faq-list">';
  let importantCount = 1;
  let sidebarLinks = '';
  qaArray.forEach((item, index) => {
    const uniqueId = `${id}-q${index + 1}`;
    const qObj = getLangText(item.q, 'en');
    const qEn = qObj.en;

    let faqItemId = '';
    if (item.important) {
      faqItemId = `id="important${importantCount}"`;
      sidebarLinks += `<a href="#important${importantCount}" class="sidebar-link">${qEn}</a>`;
      importantCount++;
    }

    faqList += `
      <div class="faq-item" ${faqItemId}>
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
        In-depth FAQs on Sum / Pair Patterns for FAANG prep, including problem breakdowns, code, and interview cross-questions.
      </p>
      ${faqList}
    </section>
  `,
    sidebarLinks
  };
};

/* ========== injection + initial active state ========== */
function injectSumPairFAQs() {
  const container = document.getElementById('faqs-container') || document.querySelector('#faqs');
  if (!container) return false;

  if (container.dataset.faqsInjected === '1') return true;

  const { html, sidebarLinks } = buildSumPairFAQSection('sum-pair-faqs', 'Sum / Pair Patterns FAQs', sumPairQA);
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

window.reinitializeSumPairFAQs = injectSumPairFAQs;

injectSumPairFAQs();

if (!document.getElementById('faqs-container') || document.getElementById('faqs-container').dataset.faqsInjected !== '1') {
  document.addEventListener('DOMContentLoaded', () => {
    injectSumPairFAQs();
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
