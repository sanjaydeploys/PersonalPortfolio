/* slidingWindowPatterns.js
   English-only FAQ builder for Sanjay Patidar's Sliding Window Patterns (Fixed & Variable) blog page.
   Maintains class names/attributes for compatibility with interviewFaqToggle.js and interviewAudio.js.
   Provides 100+ in-depth FAQs for Sliding Window, covering basics to advanced, with structured content (bullets, tables, ASCII, code),
   dedicated concept explanations, pattern recognition, and real interviewer question variations.
   Tags FAQs with levels: fresher, intermediate, senior using classes for CSS styling.
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


/* ========== FAQ data for Sliding Window Patterns (Fixed & Variable) ========== */
// Focused on most important FAQs for 1-2 years experience interviews (e.g., core concepts, approaches, complexities, edge cases, trade-offs).
// Marked "important: true" for key ones to enable targeted sidebar navigation (id=important1, etc.).
// Added level: 'fresher', 'intermediate', 'senior' for career hint classes (class="level-fresher" etc.).
// Added explanatory headings/tags selectively (not on all) within FAQs for clarity, e.g., "Key Interview Insight" or "Practical Tip".
// Expanded to 100+ FAQs, covering all concepts: window definition, fixed vs variable, arrays, pointers, sums, anagrams, substrings, repeats, state maintenance (sum, map, set), shrink/expand logic, invariants, negatives, zeros, empty, single, large n, strings vs numbers, char range (26/256), etc.
// For cross-questions, dedicated FAQs to new concepts introduced (e.g., hash in anagrams leads to hash map FAQs, collisions, amortization).
// Ensured rich depth: full explanations in bullets (detailed sentences, FAANG-level with real interview scenarios, optimizations, why/how).
// Problems covered in depth: Max Sum Subarray K (fixed), Find All Anagrams LC438 (fixed), Min Window Substring LC76 (variable), Longest No Repeat LC3 (variable).
// Each problem has: variations (important true), recognition, brute, optimized code/dry run/complexity, edge cases, duplicates, trade-offs, cross-questions leading to chained FAQs.


const slidingWindowQA = [
{
    q: { en: "Overview of Sliding Window Pattern and FAANG Job Preparation" },
    level: 'fresher',
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Understanding the Pattern and Prep" },
      { type: 'ul', items: [
        "The interviewer might begin with a broad question such as 'Can you explain an efficient technique for handling problems that involve finding properties in contiguous segments of an array or string?' This is designed to assess your foundational knowledge of optimization methods, and you should respond by introducing the Sliding Window pattern as an specialized form of two-pointer technique that transforms brute-force O(n^2) solutions into linear O(n) time by avoiding redundant computations through incremental updates.",
        "They could then probe your preparation strategy with 'How would you structure your study plan for mastering Sliding Window problems in preparation for a FAANG technical interview?' Here, emphasize a systematic approach: start with understanding fixed and variable windows, practice 4-5 core LeetCode problems daily over 15-20 days, incorporate dry runs, complexity analysis, and variations to build intuition for real-time problem-solving under time constraints.",
        "A common follow-up might be 'Why do you think the Sliding Window pattern appears frequently in FAANG interviews, and how does it test a candidate's skills?' Explain that it evaluates your ability to optimize space and time, handle edge cases like negatives or duplicates, and apply data structures like hash maps or sets for maintaining window state, all while demonstrating clear communication through code walkthroughs."
      ]},
      { type: 'subheading', en: "Pattern Explanation" },
      { type: 'ul', items: [
        "The Sliding Window pattern is fundamentally an optimization technique used primarily for problems involving contiguous subarrays or substrings, where you maintain a dynamic 'window' defined by two pointers that slides across the data structure, allowing you to compute results like maximum sums, minimum lengths, or counts of specific properties without recalculating everything from scratch for each possible segment.",
        "It manifests in two main variants: fixed-size windows, where the window length remains constant (e.g., finding the maximum sum in every subarray of exactly size k), and variable-size windows, where the window expands and contracts based on problem-specific conditions (e.g., finding the longest substring without repeating characters by expanding until a duplicate is found and then shrinking from the left).",
        "At its core, the pattern achieves O(n) time complexity by ensuring each element is visited a constant number of times—typically twice, once when entering the window and once when leaving—leveraging incremental updates to window state (such as adding a new element's value to a running sum or updating a frequency map), which eliminates the need for nested loops that would otherwise check every possible subarray combination.",
        "In FAANG interviews, this pattern is prized because it tests a candidate's proficiency in recognizing opportunities for optimization, managing state with auxiliary data structures like hash maps for O(1) lookups, handling constraints such as negative numbers or character limits, and articulating trade-offs, all skills essential for scalable software engineering."
      ]},
      { type: 'subheading', en: "How This FAQ Helps" },
      { type: 'ul', items: [
        "This comprehensive FAQ guide features over 100 detailed questions and answers tailored to cover the Sliding Window pattern from foundational concepts for freshers (e.g., what a window is) to intermediate implementations (e.g., code for specific problems) and senior-level optimizations (e.g., handling large inputs or parallel processing), ensuring you can progress at your career stage with tagged levels for easy navigation.",
        "It incorporates real-world interview scenarios, complete JavaScript code snippets with comments for clarity, step-by-step dry runs illustrated with ASCII art to visualize pointer movements, thorough complexity analyses breaking down time and space, and chained cross-questions that lead to dedicated FAQs on emergent concepts like hash collisions or cache efficiency.",
        "For effective preparation, allocate 15 to 20 days to this guide: dedicate the first 5 days to fresher-level basics and pattern recognition, the next 10 to solving and optimizing the 4 core problems (Max Sum Subarray of Size K, Find All Anagrams, Min Window Substring, Longest No Repeat) with 2-3 per day including variations, and the final days to senior topics like trade-offs and advanced edge cases, practicing verbal explanations as if in an interview.",
        "By focusing on FAANG-specific angles—such as Google's emphasis on algorithmic depth in variable windows or Amazon's focus on efficient state management—this FAQ equips you to handle diverse interview formats, from whiteboard coding to system design integrations, building confidence through holistic coverage."
      ]},
      { type: 'subheading', en: "Key Interview Insight" },
      { type: 'ul', items: [
        "Always clarify problem constraints early, such as whether the window size is fixed or variable, to guide your approach selection and demonstrate proactive thinking."
      ]},
      { type: 'link', text: "Explore Pattern", href: "https://sanjay-patidar.vercel.app/dsa-pattern-recognition#pattern-2" },
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What is a window in this pattern?",
        "How does fixed differ from variable?"
      ] }
    ]
  },
  {
    q: { en: "What is a Window in Sliding Window Pattern?" },
    level: 'fresher',
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Basic Concept" },
      { type: 'ul', items: [
        "The interviewer might pose a foundational question like 'Can you define what a 'window' represents in the context of the Sliding Window pattern?' to evaluate your grasp of core concepts, expecting a clear explanation that it's a dynamic, contiguous segment of the array or string bounded by two pointers.",
        "A follow-up could be 'How does a window differ from a standard subarray or substring in algorithmic problems?' where you should highlight that while a subarray is any contiguous part, a window is specifically a subarray that is actively managed and adjusted during traversal to meet problem conditions without exhaustive enumeration.",
        "For deeper probing, they might ask 'Why use a window instead of generating all possible subarrays?' to test your understanding of efficiency, allowing you to explain that it avoids the O(n^2) time of brute force by incrementally updating the window's state as it slides."
      ]},
      { type: 'subheading', en: "Concept Explanation" },
      { type: 'ul', items: [
        "A window in the Sliding Window pattern is a contiguous portion of the input array or string, typically defined by two indices or pointers—left (or start) and right (or end)—that represent the current range of elements under consideration for computing properties like sums, counts, or lengths.",
        "This window acts as a movable frame that 'slides' across the data: the right pointer expands the window by including new elements from the right, while the left pointer contracts it by removing elements from the left, all while maintaining an invariant or condition specific to the problem, such as keeping the sum within a range or ensuring no duplicates.",
        "In practice, the window enables efficient computations by updating its state incrementally—for instance, adding the value of a new element to a running sum when expanding or subtracting when contracting—rather than recalculating from scratch for each possible segment, which is key to achieving linear time complexity.",
        "Understanding the window concept is crucial for freshers as it forms the building block for both fixed and variable variants, allowing you to visualize and debug problems by tracking how the pointers move in response to data conditions."
      ]},
      { type: 'ascii', ascii: `
Array: [1, 2, 3, 4, 5], initial window with k=3
left=0 ---------------- right=2
 | 1 | 2 | 3 | 4 | 5 |
Window elements: 1,2,3 (sum=6)
After slide: left=1 ---------------- right=3
 1 | 2 | 3 | 4 | 5 |
Window: 2,3,4 (update sum = previous -1 +4 =9)
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "During interviews, draw ASCII diagrams like the one above on the whiteboard to illustrate window movement, as it helps communicate your thought process clearly and catches potential off-by-one errors early."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How does the window 'slide' across the array?",
        "What distinguishes fixed-size from variable-size windows?"
      ] }
    ]
  },
  {
    q: { en: "How Does the Window Slide in the Pattern?" },
    level: 'fresher',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Sliding Mechanism" },
      { type: 'ul', items: [
        "An interviewer might inquire 'Can you describe the mechanics of how the window slides in this pattern?' to assess your ability to explain the dynamic adjustment of pointers, expecting a step-by-step breakdown.",
        "Follow-up questions could include 'Why are incremental updates during sliding important?' where you should stress that they prevent redundant calculations, keeping the solution efficient.",
        "For a more challenging angle, they might ask 'Provide an example of sliding in a fixed window scenario,' prompting you to demonstrate with a sum update to show practical application."
      ]},
      { type: 'subheading', en: "Mechanism Explanation" },
      { type: 'ul', items: [
        "The sliding mechanism involves moving the window's boundaries—typically the left and right pointers—in a way that the window progresses through the array or string one step at a time, usually by incrementing the right pointer to include a new element and, if necessary, incrementing the left pointer to exclude an old one.",
        "In fixed-size windows, sliding occurs by simultaneously advancing both pointers by one after processing the current window, ensuring the size remains constant, and updating the state (like sum) by subtracting the element at the old left and adding the new element at the right.",
        "For variable-size windows, sliding is condition-driven: the right pointer expands to grow the window until a condition is met or violated, at which point the left pointer advances to shrink it, restoring the invariant while tracking the optimal result like maximum length.",
        "This sliding process ensures each element is added and removed from the window at most once, leading to O(n) time complexity overall, as opposed to checking every possible subarray which would be quadratic."
      ]},
      { type: 'ascii', ascii: `
Initial window (fixed k=2): left=0, right=1 [A B | C D]
Sum = A + B
Slide to left=1, right=2 [A | B C | D]
Update sum = (A + B) - A + C = B + C
Variable example (no repeats): left=0, right=2 [A B C | D] (C new)
Expand right=3 [A B C D] if D repeat, shrink left=1 [B C D] if still repeat, etc.
      ` },
      { type: 'subheading', en: "Key Interview Insight" },
      { type: 'ul', items: [
        "The sliding mechanism is the heart of the pattern's efficiency, so always emphasize how it reduces computations in your explanations."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you maintain the state of the window during sliding?",
        "What happens when the window needs to shrink in variable cases?"
      ] }
    ]
  },
  {
    q: { en: "Fixed vs Variable Sliding Window: Detailed Comparison" },
    level: 'fresher',
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Types Comparison" },
      { type: 'ul', items: [
        "Interviewers often ask 'Can you differentiate between fixed and variable sliding windows and give examples of when to use each?' to ensure you can identify the appropriate variant based on problem requirements.",
        "A follow-up might be 'What are the implementation differences between fixed and variable windows?' where you should discuss pointer movement and state updates.",
        "For senior levels, they could probe 'What are the trade-offs in choosing fixed over variable or vice versa?' highlighting simplicity vs flexibility."
      ]},
      { type: 'subheading', en: "Fixed Window Explanation" },
      { type: 'ul', items: [
        "In a fixed sliding window, the window size is predetermined and remains constant throughout the traversal, making it suitable for problems where you need to evaluate every subarray of exactly length k, such as finding the maximum sum of any k consecutive elements in an array.",
        "Implementation involves initializing the window from index 0 to k-1, computing the initial state (e.g., sum of those elements), then sliding by incrementing both left and right pointers by 1 in each step, updating the state in O(1) time by subtracting the element at the old left and adding the new element at the right.",
        "This variant is straightforward because the window size doesn't change, leading to simpler code with fewer conditions, and it's particularly efficient when k is much smaller than n but still achieves O(n) time regardless."
      ]},
      { type: 'subheading', en: "Variable Window Explanation" },
      { type: 'ul', items: [
        "A variable sliding window adjusts its size dynamically based on the problem's constraints, expanding the right pointer to include new elements as long as the window satisfies a condition (e.g., all unique characters) and shrinking the left pointer when the condition is violated to restore validity.",
        "This is ideal for optimization problems like finding the minimum or maximum length subarray that meets a criterion, such as the shortest substring containing all characters from a target string, requiring additional data structures like frequency maps to track the window's state for quick checks.",
        "The flexibility comes at the cost of more complex logic, with while loops to handle shrinking, but it still maintains O(n) time since each pointer moves at most n times across the array."
      ]},
      { type: 'ascii', ascii: `
Fixed (k=3): Start |1 2 3| sum=6
Slide to 1|2 3 4| sum=9 ( -1 +4 )
Variable (no repeats): Start |a| , expand |a b| , |a b c| 
If next 'b': violate, shrink |b c| , then |b c d|
      ` },
      { type: 'subheading', en: "Trade-Offs" },
      { type: 'ul', items: [
        "Fixed windows are easier to implement and debug with predictable size, but limited to problems with exact length requirements; variable windows offer greater applicability to a wider range of optimization problems but require careful management of conditions and state to avoid errors."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Look for keywords like 'exactly k elements' for fixed or 'minimum/maximum length satisfying condition' for variable to quickly classify the problem."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "Can you give specific LeetCode examples for each type?",
        "How do arrays play a role in implementing these windows?"
      ] }
    ]
  },
  {
    q: { en: "Understanding Arrays in Sliding Window Patterns" },
    level: 'fresher',
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Array Fundamentals" },
      { type: 'ul', items: [
        "An interviewer might start with 'Why are arrays commonly used as the input data structure in Sliding Window problems?' to test your understanding of why this linear, contiguous structure is ideal for subarray operations.",
        "Follow-up could be 'How does the design of an array facilitate efficient window sliding compared to other data structures like linked lists?' emphasizing O(1) random access.",
        "A deeper question might be 'What advantages do arrays provide over strings in Sliding Window, and when do you treat strings as arrays?' noting that strings can be handled similarly in languages like JavaScript where they are immutable array-like objects."
      ]},
      { type: 'subheading', en: "Array Basics" },
      { type: 'ul', items: [
        "An array is a linear data structure that stores elements of the same type in contiguous memory locations, allowing constant-time O(1) access to any element via its index, which is essential for quickly retrieving values at the left and right pointers during window adjustments.",
        "In JavaScript, arrays are dynamic and can grow or shrink, managed by the V8 engine with garbage collection, but for DSA analysis, we consider them as fixed-size for theoretical purposes, similar to C++ or Java arrays, to focus on algorithmic efficiency without runtime overheads.",
        "The zero-based indexing of arrays enables precise pointer manipulation, where left and right indices define the window bounds, and operations like arr[right] or arr[left] are instantaneous, making arrays the perfect fit for sliding operations that require frequent boundary checks and updates."
      ]},
      { type: 'subheading', en: "Role in Sliding Window" },
      { type: 'ul', items: [
        "Arrays serve as the primary input for Sliding Window problems involving numerical computations or sequences, providing the contiguous data over which the window slides to compute properties like sums or maximums in subarrays.",
        "For fixed windows, arrays allow simple updates such as sum += arr[right] - arr[left] when sliding, leveraging direct access to avoid traversing the entire window each time, which would be inefficient in non-random-access structures.",
        "In variable windows, arrays support quick checks and updates with auxiliary structures, such as using a hash map to track frequencies of arr[i] within the current window, ensuring the pattern's O(n) efficiency is preserved.",
        "When dealing with strings, they are treated as immutable arrays in many languages, allowing similar sliding techniques for substring problems, but with considerations for character codes or ASCII ranges."
      ]},
      { type: 'ascii', ascii: `
+------+------+------+------+------+
|  0   |  1   |  2   |  3   |  4   |
+------+------+------+------+------+
|  1   |  2   |  3   |  4   |  5   |
+------+------+------+------+------+
Window left=1, right=3: Access arr[1]=2, arr[3]=4 O(1)
Memory: Contiguous for fast cache access
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "In interviews, mention that arrays' contiguous memory improves cache locality, reducing misses during sequential slides, which is a performance boost for large n."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How is memory allocated for arrays in different languages?",
        "What challenges arise if the array is unsorted in Sliding Window problems?"
      ] }
    ]
  },
  {
    q: { en: "How is Memory Allocated for Arrays in Sliding Window Contexts?" },
    level: 'fresher',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Memory Allocation Details" },
      { type: 'ul', items: [
        "The interviewer might ask 'Explain how memory is allocated for arrays in a language of your choice and how it affects Sliding Window performance?' to assess your low-level understanding.",
        "Follow-up could be 'How does JavaScript's dynamic array allocation compare to static in C, especially for large windows?' testing language-specific knowledge.",
        "A deeper question might be 'What happens if the system lacks contiguous memory for a large array in a Sliding Window problem?' to evaluate edge case handling."
      ]},
      { type: 'subheading', en: "Memory Allocation Process" },
      { type: 'ul', items: [
        "Memory for arrays is allocated as a contiguous block by the runtime or OS, enabling O(1) access via base address + (index * element_size), which is vital for efficient pointer adjustments in Sliding Window without traversal overhead.",
        "The allocation starts with assigning a base address to the first element, with subsequent elements at calculated offsets, ensuring quick lookups for arr[left] or arr[right] during slides, a feature that keeps updates constant time.",
        "In low-level languages like C, allocation is static (fixed at compile time) or dynamic (via malloc on heap), while in JavaScript, V8 handles dynamic allocation on the heap with resizing, potentially triggering garbage collection that could pause execution in large window operations."
      ]},
      { type: 'subheading', en: "Types of Allocation" },
      { type: 'ul', items: [
        "Static allocation reserves fixed memory at compile time, efficient for known sizes in Sliding Window but inflexible if n varies, risking stack overflow for large arrays.",
        "Dynamic allocation allows runtime resizing, useful for variable inputs, but may involve copying data during reallocation, adding overhead that could impact performance in time-sensitive FAANG problems with massive n.",
        "In Sliding Window, dynamic arrays in JS are fine for interviews, but mention potential fragmentation in real systems where repeated resizes scatter memory, slowing access."
      ]},
      { type: 'ascii', ascii: `
Base Address: 1000, Element Size: 4 bytes
Array [1, 2, 3, 4]:
1000: 1
1004: 2
1008: 3
1012: 4
Window left=1, right=2: Access 1004 and 1008
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "For large n in interviews, note that pre-allocating array size if known can avoid resize overhead."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What is the impact of memory fragmentation on array performance in Sliding Window?",
        "How does memory overhead affect large arrays in JavaScript for this pattern?"
      ] }
    ]
  },
  {
    q: { en: "What is the Impact of Memory Fragmentation on Array Performance in Sliding Window?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Fragmentation Effects" },
      { type: 'ul', items: [
        "Interviewer might ask: 'How does memory fragmentation affect array performance in Sliding Window algorithms?' to test your system-level knowledge.",
        "Follow-up: 'What strategies can mitigate fragmentation in dynamic languages like JavaScript for large window operations?' exploring problem-solving.",
        "Deeper: 'How does fragmentation interact with cache in sliding operations?' for senior insight."
      ]},
      { type: 'subheading', en: "Fragmentation Impact" },
      { type: 'ul', items: [
        "Memory fragmentation happens when free memory is split into small, non-contiguous chunks from repeated allocations/deallocations, making it hard to find a large contiguous block for an array, potentially causing allocation failures or forcing the runtime to compact memory, which pauses execution and slows Sliding Window on large arrays.",
        "In Sliding Window, fragmentation can degrade performance by increasing time for dynamic resizing (e.g., in JS when window expands beyond initial capacity), as the engine searches for or requests new blocks, triggering GC pauses that interrupt pointer movements and state updates.",
        "For sequential slides, fragmented memory reduces cache locality, leading to more cache misses when accessing arr[left] or arr[right], as elements may not be in consecutive cache lines, impacting speed in O(n) algorithms where every access counts.",
        "In FAANG contexts, this is critical for high-throughput systems; fragmentation could make an O(n) solution feel slower in practice for massive n, prompting optimizations like using typed arrays in JS for better memory control."
      ]},
      { type: 'subheading', en: "Mitigation Strategies" },
      { type: 'ul', items: [
        "Pre-allocate arrays with estimated max size if n is known, avoiding frequent resizes and reducing fragmentation risk, though it requires upfront memory commitment.",
        "Use typed arrays in JS (e.g., Int32Array) for fixed-type data, which allocate contiguous blocks and minimize GC, improving performance in numerical Sliding Window problems like sum calculations.",
        "In low-level languages, use memory pools or custom allocators to control allocation, ensuring contiguous blocks for arrays, but in interviews, discuss runtime-specific tweaks like V8 flags for heap size.",
        "Monitor and compact memory periodically, but note this adds overhead; for Sliding Window, process in chunks if n is extremely large to limit array size."
      ]},
      { type: 'subheading', en: "Key Interview Insight" },
      { type: 'ul', items: [
        "Mention fragmentation in performance discussions for large n to show systems awareness."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How does fragmentation differ between static and dynamic allocation?",
        "What are the performance costs of garbage collection in this context?"
      ] }
    ]
  },
  {
    q: { en: "How Does Fragmentation Differ Between Static and Dynamic Allocation?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Allocation Differences" },
      { type: 'ul', items: [
        "Interviewer might ask: 'How does memory fragmentation differ between static and dynamic allocation in the context of arrays for Sliding Window?' to test your knowledge of memory models.",
        "Follow-up: 'Which is better for Sliding Window problems with large arrays?' discussing trade-offs.",
        "Deeper: 'How does this affect cache performance in sliding operations?'"
      ]},
      { type: 'subheading', en: "Static Allocation" },
      { type: 'ul', items: [
        "Static allocation reserves memory at compile time on the stack, with fixed size, so no runtime fragmentation as the block is pre-allocated and contiguous, but limited by stack size and inflexible for variable n in Sliding Window.",
        "In Sliding Window, static arrays ensure predictable performance without GC, ideal for known n, but risk stack overflow for large windows, making them less suitable for dynamic problems."
      ]},
      { type: 'subheading', en: "Dynamic Allocation" },
      { type: 'ul', items: [
        "Dynamic allocation uses heap at runtime, allowing resizing, but prone to external fragmentation (small free holes) from other allocations, and internal from over-allocation during resizes.",
        "For Sliding Window, dynamic arrays in JS can fragment during frequent expansions, slowing pointer access, but offer flexibility for unknown n; mitigation via initial large allocation."
      ]},
      { type: 'subheading', en: "Comparison" },
      { type: 'ul', items: [
        "Static: No fragmentation, fast, but size fixed; dynamic: flexible, but fragmentation/GC risks, impacting large slides.",
        "In FAANG, prefer dynamic for scalability, but optimize to minimize resizes."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Use static for embedded systems, dynamic for general."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "Performance costs of GC?",
        "Overhead in large arrays?"
      ] }
    ]
  },
  {
    q: { en: "What are the Performance Costs of Garbage Collection in Sliding Window?" },
    level: 'senior',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: GC Costs" },
      { type: 'ul', items: [
        "Interviewer might ask: 'What are the performance costs of garbage collection in Sliding Window for dynamic languages?' to test runtime awareness.",
        "Follow-up: 'How to minimize GC in JS for large n?'",
        "Deeper: 'Impact on real-time systems?'"
      ]},
      { type: 'subheading', en: "GC Costs" },
      { type: 'ul', items: [
        "GC pauses execution to reclaim memory, interrupting slides, causing latency spikes in O(n) algorithms for large n.",
        "In Sliding Window, frequent object creation (maps/sets) triggers minor GC, major GC for long-lived, slowing state updates.",
        "Stop-the-world GC halts all, bad for real-time; incremental GC reduces but adds overhead.",
        "In FAANG, GC can make predictable time complex unpredictable, affecting SLAs."
      ]},
      { type: 'subheading', en: "Mitigation" },
      { type: 'ul', items: [
        "Reuse objects, avoid new allocations in loop.",
        "Use arrays over maps for fixed ranges (e.g., chars).",
        "Profile with --trace-gc for optimization."
      ]},
      { type: 'subheading', en: "Key Interview Insight" },
      { type: 'ul', items: [
        "Discuss GC in performance-critical answers."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "Overhead in large arrays?",
        "Cache efficiency?"
      ] }
    ]
  },
    {
    q: { en: "What Challenges Arise if the Array is Unsorted in Sliding Window Problems?" },
    level: 'intermediate',
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Unsorted Array Handling" },
      { type: 'ul', items: [
        "The interviewer might ask 'How does an unsorted array affect your Sliding Window approach?' to evaluate your ability to adapt the pattern to raw input data, expecting you to confirm that sorting is typically unnecessary for most Sliding Window problems.",
        "A follow-up could be 'Are there scenarios where sorting the array could improve the Sliding Window solution?' prompting you to discuss rare cases where pre-sorting aids specific constraints, like finding a sorted subarray.",
        "For a deeper probe, they might ask 'What are the trade-offs of sorting versus maintaining the original order in Sliding Window problems?' testing your ability to weigh preprocessing costs against algorithmic benefits."
      ]},
      { type: 'subheading', en: "Handling Unsorted Arrays" },
      { type: 'ul', items: [
        "The Sliding Window pattern is inherently designed to work with unsorted arrays, as it processes elements in their original order, relying on the contiguous nature of subarrays or substrings rather than their sorted properties, making it versatile for problems like maximum sum or finding anagrams.",
        "For fixed window problems, such as computing the maximum sum of k consecutive elements, the unsorted nature has no impact since the algorithm only tracks the sum of elements within the window, updated incrementally as the window slides (e.g., sum += arr[right] - arr[left]).",
        "In variable window problems, like finding the longest substring with no repeating characters, the unsorted array or string is handled by auxiliary data structures like hash maps or sets, which track element frequencies or presence, indifferent to order, ensuring O(n) efficiency.",
        "Sorting is rarely needed, but if a problem requires a sorted subarray (e.g., 'find the longest subarray where elements are in ascending order'), you would sort first, costing O(n log n), then apply a Sliding Window to check contiguous sorted segments, but this is uncommon."
      ]},
      { type: 'ascii', ascii: `
Unsorted Array: [4, 2, 1, 3], k=2
Window 1: left=0, right=1 [4,2] sum=6
Slide: left=1, right=2 [2,1] sum=3
Slide: left=2, right=3 [1,3] sum=4
Max sum=6, no sorting needed
      ` },
      { type: 'subheading', en: "Trade-Offs of Sorting" },
      { type: 'ul', items: [
        "Sorting adds O(n log n) time, which can negate the O(n) benefit of Sliding Window unless sorting unlocks a specific optimization, like simplifying a variable window condition.",
        "Unsorted processing preserves original order, avoiding the memory and time overhead of creating a sorted copy, which is critical for large n in FAANG problems.",
        "If sorting is required, discuss in the interview whether modifying the input is allowed or if a copy is needed, as this impacts space complexity (O(n) for copy)."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Clarify with the interviewer if the problem assumes sorted input or if sorting is permissible, as this affects your approach and shows attention to constraints."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "When might sorting be beneficial in Sliding Window?",
        "How do you handle negative numbers in unsorted arrays?"
      ] }
    ]
  },
  {
    q: { en: "When Might Sorting Be Beneficial in Sliding Window Problems?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Sorting Scenarios" },
      { type: 'ul', items: [
        "The interviewer might ask 'Can you describe a Sliding Window problem where sorting the input array first would be beneficial?' to test your ability to identify exceptions where preprocessing enhances efficiency.",
        "Follow-up: 'What are the costs of sorting in such cases?' expecting you to discuss the trade-off between O(n log n) preprocessing and O(n) sliding.",
        "Deeper: 'How does sorting change the Sliding Window logic?' probing your understanding of how sorted data alters pointer movement or condition checks."
      ]},
      { type: 'subheading', en: "Sorting Scenarios" },
      { type: 'ul', items: [
        "Sorting is beneficial in rare Sliding Window problems where the solution depends on ordered properties, such as finding the longest subarray where elements are in non-decreasing order, as sorting simplifies checking contiguous sorted segments.",
        "For example, in a problem like 'find the longest subarray where the difference between max and min elements is at most k,' sorting the array first allows you to use a Sliding Window to maintain a valid range, as sorted elements ensure max/min are at window ends, reducing comparison complexity.",
        "Another case is when the problem involves finding subarrays with specific patterns (e.g., consecutive integers), where sorting groups similar values together, making it easier to slide a window over valid segments.",
        "However, sorting is not typical for Sliding Window, as most problems (e.g., max sum, anagrams) rely on original order, and sorting’s O(n log n) cost outweighs benefits unless it fundamentally simplifies the window logic."
      ]},
      { type: 'ascii', ascii: `
Original: [4, 1, 3, 2], find longest non-decreasing subarray
Sorted: [1, 2, 3, 4]
Window: left=0, right=3 [1,2,3,4] length=4
Unsorted would need complex checks per window
      ` },
      { type: 'subheading', en: "Trade-Offs" },
      { type: 'ul', items: [
        "Sorting costs O(n log n) time and potentially O(n) space for a copy, which may be justified if it reduces the Sliding Window to O(n) with simpler logic, but increases overall complexity compared to direct O(n) unsorted solutions.",
        "Sorting destroys original indices, so problems requiring index tracking (e.g., returning subarray positions) need a paired array of {value, index}, adding space complexity.",
        "In FAANG interviews, sorting is a last resort; always explore unsorted Sliding Window first unless the problem explicitly benefits from order."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "If sorting seems helpful, confirm with the interviewer if modifying input is allowed or if preserving original order is required."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle index tracking post-sorting?",
        "What are the costs of maintaining a sorted copy?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Negative Numbers in Unsorted Arrays for Sliding Window?" },
    level: 'intermediate',
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Negative Number Handling" },
      { type: 'ul', items: [
        "The interviewer might ask 'How does your Sliding Window solution change if the array contains negative numbers?' to test your ability to handle edge cases without assuming positive-only inputs.",
        "Follow-up: 'What if all numbers are negative in a max sum problem?' checking if you understand the output will be the least negative sum.",
        "Deeper: 'How do negatives affect variable window problems like finding unique substrings?' ensuring you clarify they don’t impact character-based problems."
      ]},
      { type: 'subheading', en: "Handling Negatives" },
      { type: 'ul', items: [
        "In fixed window problems like maximum sum of k elements, negative numbers don’t change the algorithm: initialize the window sum, slide by adding arr[right] and subtracting arr[left], and track the maximum, as the logic works regardless of positive or negative values.",
        "If all numbers are negative, the maximum sum will be negative (the least negative), which is valid; for example, in [-1, -2, -3] with k=2, max sum is -3 (from [-1, -2]), and the algorithm naturally handles this without modification.",
        "In variable window problems, negatives typically affect numerical constraints (e.g., sum >= target), requiring careful state updates, but for character-based problems like anagrams or no repeats, negatives are irrelevant since the logic focuses on counts or presence.",
        "Always check for edge cases like all negatives or mixed numbers in sum-based problems, ensuring the solution doesn’t assume positive values, and clarify constraints (e.g., can sum be negative?) to avoid errors."
      ]},
      { type: 'ascii', ascii: `
Array: [-2, 1, -3, 4], k=2
Window 1: left=0, right=1 [-2,1] sum=-1
Slide: left=1, right=2 [1,-3] sum=-2
Slide: left=2, right=3 [-3,4] sum=1
Max sum=1, handles negatives naturally
      ` },
      { type: 'subheading', en: "Key Interview Insight" },
      { type: 'ul', items: [
        "Emphasize that Sliding Window’s incremental updates handle negatives seamlessly, but always verify input constraints."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What if the array contains zeros?",
        "How do you handle overflow with large negative numbers?"
      ] }
    ]
  },
  {
    q: { en: "How Do Zeros Affect Sliding Window Problems?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Zero Handling" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do zeros in the array impact your Sliding Window solution?' to test your handling of edge cases in numerical problems.",
        "Follow-up: 'Does the presence of zeros change the logic for fixed vs variable windows?' expecting you to note minimal impact.",
        "Deeper: 'In which Sliding Window problems do zeros require special attention?' probing for specific cases like product-based constraints."
      ]},
      { type: 'subheading', en: "Zero Impact" },
      { type: 'ul', items: [
        "Zeros in fixed window problems, like max sum of k elements, are treated like any other number: they contribute 0 to the sum, and sliding updates (sum += arr[right] - arr[left]) work unchanged, as in [1, 0, 3] with k=2, where sums are 1, 3, etc.",
        "In variable window problems with sum constraints (e.g., subarray with sum >= target), zeros may extend the window length without adding to the sum, requiring careful condition checks to avoid infinite loops if target is 0.",
        "For character-based problems like anagrams or no repeats, zeros (as numbers or chars) are just another value in maps/sets, with no special handling unless the problem explicitly defines zero as a constraint (e.g., exclude zeros from window).",
        "Special case: In product-based Sliding Window problems (e.g., max product subarray), zeros reset the product to 0, requiring you to track segments between zeros or reset the window."
      ]},
      { type: 'ascii', ascii: `
Array: [1, 0, 3, 2], k=2
Window: [1,0] sum=1
Slide: [0,3] sum=3
Slide: [3,2] sum=5
Zeros add 0, no logic change
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Ask if zeros have special meaning (e.g., reset in product problems) to tailor your solution."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle empty arrays or single-element arrays?",
        "What about overflow in large numerical inputs?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Empty or Single-Element Arrays in Sliding Window?" },
    level: 'fresher',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Edge Case Handling" },
      { type: 'ul', items: [
        "The interviewer might ask 'What happens if the input array is empty or has just one element in a Sliding Window problem?' to test your edge case awareness.",
        "Follow-up: 'How do you adjust your code to handle these cases?' expecting input validation.",
        "Deeper: 'Does this differ between fixed and variable windows?' probing for nuance."
      ]},
      { type: 'subheading', en: "Handling Edge Cases" },
      { type: 'ul', items: [
        "For an empty array, most Sliding Window problems return an invalid result (e.g., -1 for max sum, empty list for anagrams) since no window can be formed; always check if arr.length === 0 at the start.",
        "For single-element arrays, fixed window problems with k > 1 are invalid (return -1 or null), while k=1 returns the element itself if valid (e.g., sum = arr[0]); variable windows may return the element if it satisfies the condition (e.g., unique char).",
        "In fixed windows, validate k <= arr.length before processing to avoid out-of-bounds errors; in variable windows, empty or single cases often simplify to checking the single element against the condition.",
        "These checks are crucial in FAANG interviews, as interviewers expect robust code that handles all inputs gracefully."
      ]},
      { type: 'codeBlock', codeBlock: `
function maxSum(arr, k) {
  if (arr.length === 0 || k <= 0 || k > arr.length) return -1;
  // Proceed with sliding window
}
      ` },
      { type: 'subheading', en: "Key Interview Insight" },
      { type: 'ul', items: [
        "Always include edge case checks at the start to show robustness."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle overflow with large numbers?",
        "What if k is invalid?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Overflow with Large Numbers in Sliding Window?" },
    level: 'senior',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Overflow Handling" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you prevent integer overflow in Sliding Window problems with large numbers?' to test your awareness of numerical limits.",
        "Follow-up: 'What strategies work in JavaScript vs C++ for overflow?' expecting language-specific solutions.",
        "Deeper: 'How does overflow impact sum-based Sliding Window problems?'"
      ]},
      { type: 'subheading', en: "Overflow Handling" },
      { type: 'ul', items: [
        "Overflow occurs when sums or computations exceed the language’s integer limit (e.g., 2^31-1 for 32-bit integers in C++, or Number.MAX_SAFE_INTEGER in JS ~2^53), causing incorrect results in sum-based Sliding Window problems like max sum k.",
        "In JavaScript, numbers are 64-bit floats, so large sums may lose precision beyond 2^53; use BigInt for exact arithmetic, but note performance overhead in interviews.",
        "In C++, use long long (64-bit) for sums, or modulo arithmetic if the problem allows (e.g., sum % m), and check constraints for max input values to choose the right type.",
        "For FAANG, validate input ranges (e.g., arr[i] <= 10^9) and clarify if overflow handling is needed; if not specified, assume safe ranges but mention checks."
      ]},
      { type: 'codeBlock', codeBlock: `
function maxSum(arr, k) {
  if (arr.length < k) return -1;
  let sum = BigInt(0);
  for (let i = 0; i < k; i++) sum += BigInt(arr[i]);
  let max = sum;
  for (let i = k; i < arr.length; i++) {
    sum = sum + BigInt(arr[i]) - BigInt(arr[i-k]);
    max = sum > max ? sum : max;
  }
  return Number(max);
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Ask for input constraints (e.g., max value of arr[i]) to decide if overflow handling is needed."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you optimize for large n?",
        "What’s the role of pointers in overflow?"
      ] }
    ]
  },
  {
    q: { en: "What is the Role of Pointers in Sliding Window?" },
    level: 'fresher',
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Pointer Mechanics" },
      { type: 'ul', items: [
        "The interviewer might ask 'What role do pointers play in the Sliding Window pattern?' to ensure you understand how boundaries are managed.",
        "Follow-up: 'How do left and right pointers differ in their responsibilities?' expecting clarity on expansion vs contraction.",
        "Deeper: 'How do pointers help avoid overflow or errors?'"
      ]},
      { type: 'subheading', en: "Pointer Roles" },
      { type: 'ul', items: [
        "Pointers (left and right) define the window’s boundaries, marking the inclusive start (left) and end (right) of the current subarray or substring being processed.",
        "The right pointer expands the window by moving forward to include new elements, updating the state (e.g., sum += arr[right] or map.set(arr[right], count)).",
        "The left pointer contracts the window by moving forward to remove elements, updating state to restore conditions (e.g., sum -= arr[left] or map.delete(arr[left])).",
        "In fixed windows, both pointers move in lockstep (right-left+1 = k); in variable windows, right expands until violation, then left shrinks, ensuring O(n) by visiting each element twice."
      ]},
      { type: 'ascii', ascii: `
Array: [1, 2, 3, 4], k=2
left=0 ---- right=1 [1,2]
Slide: left=1 ---- right=2 [2,3]
Right adds arr[2], left removes arr[0]
      ` },
      { type: 'subheading', en: "Key Interview Insight" },
      { type: 'ul', items: [
        "Explain pointer roles clearly to show control over window dynamics."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you maintain window state?",
        "What are invariants in Sliding Window?"
      ] }
    ]
  },
  {
    q: { en: "What are Invariants in Sliding Window?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Invariant Concepts" },
      { type: 'ul', items: [
        "The interviewer might ask 'What is an invariant in the context of Sliding Window, and why is it important?' to test your understanding of maintaining consistent conditions.",
        "Follow-up: 'How do invariants differ between fixed and variable windows?' expecting examples.",
        "Deeper: 'How do you ensure the invariant holds during sliding?'"
      ]},
      { type: 'subheading', en: "Invariant Definition" },
      { type: 'ul', items: [
        "An invariant is a condition that must hold true for the window at each step of the algorithm, ensuring the window represents a valid or optimal solution state, like a fixed size k or containing all required characters.",
        "In fixed windows, the invariant is typically the window size (right - left + 1 = k), maintained by sliding both pointers together after each computation.",
        "In variable windows, the invariant is problem-specific, e.g., no repeating characters (tracked by a set) or containing all target characters (tracked by a frequency map), restored by shrinking when violated.",
        "Invariants guide pointer movement and state updates, ensuring the algorithm produces correct results without redundant checks, critical for FAANG efficiency."
      ]},
      { type: 'ascii', ascii: `
Fixed (k=2): [1,2] invariant: right-left+1=2
Slide: [2,3] maintains invariant
Variable (no repeats): [a,b] set={a,b}
Add c: [a,b,c] set={a,b,c}
Add b: violate, shrink [b,c] set={b,c}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Identify the invariant early to structure your loop conditions."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you track invariants with data structures?",
        "What happens if the invariant is violated?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Track Invariants with Data Structures in Sliding Window?" },
    level: 'intermediate',
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: State Management" },
      { type: 'ul', items: [
        "The interviewer might ask 'What data structures do you use to maintain the state of a Sliding Window’s invariant?' to test your ability to choose appropriate tools.",
        "Follow-up: 'How does a hash map differ from a set in maintaining window state?' expecting clarity on use cases.",
        "Deeper: 'What are the performance implications of your choice?'"
      ]},
      { type: 'subheading', en: "Data Structures for Invariants" },
      { type: 'ul', items: [
        "For numerical problems like max sum k, a simple variable (e.g., windowSum) tracks the invariant (sum of k elements), updated in O(1) with sum += arr[right] - arr[left].",
        "For character-based problems like anagrams, a hash map tracks character frequencies (e.g., map[char] = count), incrementing for right, decrementing for left, ensuring the invariant (matching target counts) is checked in O(1).",
        "For no-repeat problems, a set tracks unique elements in the window, adding arr[right] and removing arr[left], with O(1) checks for duplicates to maintain the invariant of uniqueness.",
        "Arrays can be used for fixed ranges (e.g., 26 lowercase letters), where arr[char.charCodeAt(0) - 97] tracks counts, offering O(1) access and less memory than a hash map for small alphabets."
      ]},
      { type: 'codeBlock', codeBlock: `
function trackWindowState(s, target) {
  const map = new Map();
  for (let c of target) map.set(c, (map.get(c) || 0) + 1);
  let required = map.size;
  // Slide window, update map, check invariant
}
      ` },
      { type: 'subheading', en: "Key Interview Insight" },
      { type: 'ul', items: [
        "Choose the simplest structure that maintains the invariant efficiently."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What are hash map collisions and their impact?",
        "When to use arrays vs maps?"
      ] }
    ]
  },
  {
    q: { en: "What are Hash Map Collisions and Their Impact in Sliding Window?" },
    level: 'senior',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Collision Handling" },
      { type: 'ul', items: [
        "The interviewer might ask 'What are hash map collisions, and how do they affect Sliding Window performance?' to test your understanding of data structure internals.",
        "Follow-up: 'How does JavaScript’s Map handle collisions compared to a custom hash table?'",
        "Deeper: 'How do you mitigate collision impact in high-frequency Sliding Window problems?'"
      ]},
      { type: 'subheading', en: "Collision Explanation" },
      { type: 'ul', items: [
        "Hash map collisions occur when multiple keys hash to the same bucket, resolved via chaining (linked lists) or open addressing, degrading O(1) to O(k) in worst cases, where k is the number of colliding keys.",
        "In Sliding Window, collisions in maps used for state (e.g., char frequencies) can slow down get/set operations, impacting the O(n) time if many collisions occur, especially with large alphabets or poor hash functions.",
        "JavaScript’s Map uses optimized hashing, minimizing collisions for typical inputs (e.g., chars), but for adversarial inputs (many keys hashing similarly), performance may degrade.",
        "In FAANG, collisions are rare for small char sets (e.g., 26 letters), but for large n or Unicode, consider arrays or custom hashing to avoid slowdown."
      ]},
      { type: 'subheading', en: "Mitigation" },
      { type: 'ul', items: [
        "Use arrays for fixed ranges (e.g., lowercase letters).",
        "Ensure good hash functions or rely on JS Map.",
        "For large alphabets, consider trie or bitsets if applicable."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Mention collision awareness in interviews to show depth."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "When to use arrays over maps?",
        "How to optimize for large alphabets?"
      ] }
    ]
  },
  {
    q: { en: "When to Use Arrays vs Hash Maps for Window State?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Data Structure Choice" },
      { type: 'ul', items: [
        "The interviewer might ask 'When would you use an array instead of a hash map to track window state in Sliding Window?' to test your optimization skills.",
        "Follow-up: 'What are the trade-offs in terms of memory and speed?'",
        "Deeper: 'How does the input range affect your choice?'"
      ]},
      { type: 'subheading', en: "Array vs Hash Map" },
      { type: 'ul', items: [
        "Use arrays when the element range is fixed and small, like 26 lowercase letters or ASCII (128/256), where arr[char.charCodeAt(0) - 97] tracks counts, offering O(1) access and O(k) space, where k is the range size.",
        "Hash maps are better for sparse or large ranges (e.g., Unicode, integers), providing O(1) average-case access with O(m) space, where m is the number of unique elements in the window.",
        "Arrays avoid hash overhead (collisions, resizing), but waste space if the range is large; maps are flexible but have higher constant factors and potential collision risks.",
        "In FAANG, prefer arrays for problems like anagrams with lowercase-only inputs to minimize memory and maximize speed."
      ]},
      { type: 'codeBlock', codeBlock: `
function useArrayForState(s) {
  const counts = new Array(26).fill(0);
  for (let c of s) counts[c.charCodeAt(0) - 97]++;
  // Slide window, update counts
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Ask about input range (e.g., lowercase only?) to choose array or map."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How to handle large alphabets?",
        "What’s the pattern recognition for Sliding Window?"
      ] }
    ]
  },
  {
    q: { en: "Pattern Recognition for Sliding Window Problems" },
    level: 'intermediate',
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Recognition Cues" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you identify a problem that can be solved with Sliding Window?' to test your ability to spot the pattern in problem statements.",
        "Follow-up: 'What keywords or constraints hint at fixed vs variable windows?' expecting specific cues.",
        "Deeper: 'How do you confirm Sliding Window is the best approach?' comparing with alternatives."
      ]},
      { type: 'subheading', en: "Recognition Cues" },
      { type: 'ul', items: [
        "Look for keywords like 'contiguous subarray,' 'substring,' 'consecutive elements,' or 'window,' indicating a problem involves a continuous segment of the input, ideal for Sliding Window to avoid checking all possible segments.",
        "Fixed window cues include 'exactly k elements,' 'size k subarray,' or 'k consecutive,' suggesting a constant-size window, as in 'maximum sum of k elements' or 'count anagrams of length k'.",
        "Variable window cues include 'minimum/maximum length,' 'at most/at least,' or 'satisfying condition,' like 'shortest substring containing all chars' or 'longest substring with no repeats,' requiring dynamic size adjustments.",
        "Numerical constraints (sum, count) or character-based conditions (unique, anagram) often pair with auxiliary structures like maps or sets, while the need for linear time (O(n)) points to Sliding Window over O(n^2) brute force."
      ]},
      { type: 'ascii', ascii: `
+-------------------+--------------------+---------------------+
| Keyword           | Window Type        | Example Problem     |
+-------------------+--------------------+---------------------+
| Exactly k         | Fixed             | Max Sum k           |
| Shortest/Longest  | Variable          | Min Window Substring|
| Contiguous        | Both              | Any Sliding Problem |
| No Repeats        | Variable          | Longest No Repeat   |
+-------------------+--------------------+---------------------+
      ` },
      { type: 'subheading', en: "Key Interview Insight" },
      { type: 'ul', items: [
        "Practice spotting cues in LeetCode problem descriptions to quickly propose Sliding Window."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "Can you solve a specific Sliding Window problem?",
        "How do you revise for this pattern?"
      ] }
    ]
  },
  {
    q: { en: "How Should You Revise for Sliding Window Problems?" },
    level: 'fresher',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Revision Strategy" },
      { type: 'ul', items: [
        "The interviewer might ask 'What’s your revision strategy for mastering Sliding Window for FAANG interviews?' to gauge your preparation discipline.",
        "Follow-up: 'How do you balance theory and practice?' expecting a structured plan.",
        "Deeper: 'How do you handle variations in problems?' testing adaptability."
      ]},
      { type: 'subheading', en: "Revision Routine" },
      { type: 'ul', items: [
        "Allocate 15-20 days, starting with 3-5 days on basics: understand fixed vs variable windows, pointer roles, and state management (sums, maps, sets) through this FAQ guide, focusing on fresher-level Qs.",
        "Spend 10 days solving 2-3 problems daily from the core set (Max Sum k, Anagrams LC438, Min Window LC76, Longest No Repeat LC3), coding brute force first, then optimizing with Sliding Window, and dry-running with ASCII on paper.",
        "Dedicate 3-5 days to variations and edge cases: handle negatives, zeros, empty arrays, large n, and practice explaining solutions as if to an interviewer, emphasizing complexity and trade-offs.",
        "Use LeetCode’s tagged problems (50+ Sliding Window), starting with easy (fixed) to hard (variable), and review solutions to learn alternative approaches; mock interviews with peers help verbal clarity."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Maintain a notebook of dry runs and common mistakes (e.g., off-by-one) to refine intuition."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "Can you walk through a Sliding Window problem?",
        "What’s the first problem you’d solve?"
      ] }
    ]
  },
  // Problem 1: Max Sum Subarray of Size K
  {
    q: { en: "Problem Statement: Maximum Sum Subarray of Size K" },
    level: 'intermediate',
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Problem Understanding" },
      { type: 'ul', items: [
        "The interviewer might state 'Given an array of integers and an integer k, find the maximum sum of any contiguous subarray of size k.' This tests your ability to recognize a fixed Sliding Window problem and implement it efficiently.",
        "Follow-up: 'What if the array contains negative numbers or is empty?' expecting edge case handling.",
        "Deeper: 'Can you return the subarray itself instead of the sum?' testing index tracking."
      ]},
      { type: 'subheading', en: "Problem Explanation" },
      { type: 'ul', items: [
        "The goal is to find the subarray of exactly k consecutive elements with the largest sum, returning the sum (e.g., for arr=[1,4,2,10,2], k=3, max sum=16 from [4,2,10]).",
        "Constraints: 1 <= k <= arr.length <= 10^5, elements can be positive, negative, or zero, requiring a solution that handles all cases without assuming sorted or positive inputs.",
        "This is a fixed window problem: the window size k is constant, sliding across the array to compute sums incrementally, avoiding the O(nk) brute force approach.",
        "In FAANG interviews, this is a common easy problem to test basic optimization and edge case handling, often paired with variations like returning indices or handling invalid k."
      ]},
      { type: 'ascii', ascii: `
Array: [1, 4, 2, 10, 2], k=3
Window 1: [1,4,2] sum=7
Slide: [4,2,10] sum=16
Slide: [2,10,2] sum=14
Max sum=16
      ` },
      { type: 'subheading', en: "Key Interview Insight" },
      { type: 'ul', items: [
        "Clarify if k can equal arr.length or if negatives are included."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What’s the brute force approach?",
        "How do you optimize it?"
      ] }
    ]
  },
  {
    q: { en: "Brute Force Approach for Maximum Sum Subarray of Size K" },
    level: 'fresher',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Brute Force" },
      { type: 'ul', items: [
        "The interviewer might ask 'What’s a straightforward way to solve the max sum subarray of size k problem?' to test your baseline approach before optimization.",
        "Follow-up: 'What’s the time complexity of your brute force solution?' expecting O(nk).",
        "Deeper: 'Why is brute force inefficient for large n or k?'"
      ]},
      { type: 'subheading', en: "Brute Force Approach" },
      { type: 'ul', items: [
        "The brute force approach involves iterating through each possible starting index i from 0 to n-k, computing the sum of the subarray from i to i+k-1 by iterating k elements, and tracking the maximum sum found.",
        "For each window, sum k elements in O(k) time, and with n-k+1 possible windows, the total time complexity is O(nk), which is inefficient for large n or k.",
        "Space complexity is O(1) since only a maxSum variable is needed, but the repeated summation of overlapping elements makes it suboptimal compared to Sliding Window.",
        "This approach is simple but fails for large inputs (e.g., n=10^5, k=10^4), common in FAANG tests, prompting the need for optimization."
      ]},
      { type: 'codeBlock', codeBlock: `
function maxSumBrute(arr, k) {
  if (arr.length < k) return -1;
  let maxSum = -Infinity;
  for (let i = 0; i <= arr.length - k; i++) {
    let sum = 0;
    for (let j = i; j < i + k; j++) {
      sum += arr[j];
    }
    maxSum = Math.max(maxSum, sum);
  }
  return maxSum;
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Explain brute force first to show you understand the problem, then pivot to optimized."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How can you optimize this?",
        "What’s the Sliding Window approach?"
      ] }
    ]
  },
  {
    q: { en: "Optimized Sliding Window Approach for Maximum Sum Subarray of Size K" },
    level: 'intermediate',
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Optimization" },
      { type: 'ul', items: [
        "The interviewer might ask 'How can you improve the brute force solution for max sum subarray of size k?' expecting a Sliding Window approach.",
        "Follow-up: 'What’s the time and space complexity?' expecting O(n) and O(1).",
        "Deeper: 'How do you handle edge cases like negative numbers?'"
      ]},
      { type: 'subheading', en: "Optimized Approach" },
      { type: 'ul', items: [
        "Use a fixed Sliding Window: initialize the sum of the first k elements (indices 0 to k-1), then slide the window by incrementing left and right pointers, updating the sum by adding arr[right] and subtracting arr[left-1].",
        "Track the maximum sum as you slide, achieving O(n) time since each element is added and removed at most once, and O(1) space as only sum and maxSum variables are needed.",
        "The key optimization is avoiding recomputing the sum for overlapping elements, as each slide reuses k-1 elements from the previous window, making updates O(1).",
        "Handles negatives and zeros naturally, as the sum calculation doesn’t depend on element values, only their arithmetic contribution."
      ]},
      { type: 'codeBlock', codeBlock: `
function maxSum(arr, k) {
  if (arr.length < k || k <= 0) return -1;
  let sum = 0;
  for (let i = 0; i < k; i++) sum += arr[i];
  let maxSum = sum;
  for (let i = k; i < arr.length; i++) {
    sum += arr[i] - arr[i - k];
    maxSum = Math.max(maxSum, sum);
  }
  return maxSum;
}
      ` },
      { type: 'ascii', ascii: `
Array: [1, 4, 2, 10, 2], k=3
Initial: left=0, right=2 [1,4,2] sum=7
Slide: left=1, right=3 [4,2,10] sum=7+10-1=16
Slide: left=2, right=4 [2,10,2] sum=16+2-4=14
Max sum=16
      ` },
      { type: 'subheading', en: "Complexity" },
      { type: 'ul', items: [
        "Time: O(n), as we compute initial sum in O(k) and slide n-k times, each O(1).",
        "Space: O(1), only sum and maxSum variables."
      ]},
      { type: 'subheading', en: "Key Interview Insight" },
      { type: 'ul', items: [
        "Walk through the dry run to show how sliding saves time."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What are the edge cases?",
        "Can you return the subarray indices?"
      ] }
    ]
  },
  {
    q: { en: "What are the Edge Cases for Maximum Sum Subarray of Size K?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Edge Cases" },
      { type: 'ul', items: [
        "The interviewer might ask 'What edge cases must you handle for the max sum k problem?' to ensure robustness.",
        "Follow-up: 'How do you handle invalid k or empty arrays?'",
        "Deeper: 'What if all numbers are negative?'"
      ]},
      { type: 'subheading', en: "Edge Cases" },
      { type: 'ul', items: [
        "Empty array: Return -1 or null, as no subarray exists.",
        "k <= 0 or k > arr.length: Invalid, return -1, as window size must be positive and not exceed array length.",
        "Single element with k=1: Return arr[0], as it’s the only possible window.",
        "All negative numbers: Return the least negative sum, as the algorithm naturally finds the max (e.g., [-1,-2], k=1, max=-1).",
        "Large numbers: Risk overflow, use BigInt in JS for safety if arr[i] > 10^9."
      ]},
      { type: 'codeBlock', codeBlock: `
function maxSum(arr, k) {
  if (!arr.length || k <= 0 || k > arr.length) return -1;
  let sum = BigInt(0);
  for (let i = 0; i < k; i++) sum += BigInt(arr[i]);
  let maxSum = sum;
  for (let i = k; i < arr.length; i++) {
    sum += BigInt(arr[i]) - BigInt(arr[i - k]);
    maxSum = sum > maxSum ? sum : maxSum;
  }
  return Number(maxSum);
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Always check edge cases at the start of your function."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you return the subarray indices?",
        "What are the trade-offs of this approach?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Return the Subarray Indices for Max Sum Subarray of Size K?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Index Tracking" },
      { type: 'ul', items: [
        "The interviewer might ask 'Modify your solution to return the start and end indices of the max sum subarray of size k,' testing your ability to extend the algorithm.",
        "Follow-up: 'What if multiple subarrays have the same max sum?' expecting a choice like first or last occurrence.",
        "Deeper: 'How does index tracking affect complexity?'"
      ]},
      { type: 'subheading', en: "Index Tracking" },
      { type: 'ul', items: [
        "Extend the Sliding Window to track the start index (left) of the window with the maximum sum, updating it whenever a new maxSum is found.",
        "When sliding, the window’s start is left and end is right (or left+k-1), so store left when maxSum updates; return [left, left+k-1].",
        "If multiple subarrays have the same max sum, typically return the first occurrence unless specified, but clarify with the interviewer.",
        "Complexity remains O(n) time and O(1) space, as only a few variables (maxStart, maxSum) are added."
      ]},
      { type: 'codeBlock', codeBlock: `
function maxSumIndices(arr, k) {
  if (!arr.length || k <= 0 || k > arr.length) return [-1, -1];
  let sum = 0;
  for (let i = 0; i < k; i++) sum += arr[i];
  let maxSum = sum, maxStart = 0;
  for (let i = k; i < arr.length; i++) {
    sum += arr[i] - arr[i - k];
    if (sum > maxSum) {
      maxSum = sum;
      maxStart = i - k + 1;
    }
  }
  return [maxStart, maxStart + k - 1];
}
      ` },
      { type: 'ascii', ascii: `
Array: [1, 4, 2, 10, 2], k=3
Window: [1,4,2] sum=7, start=0
Slide: [4,2,10] sum=16, start=1 (update max)
Slide: [2,10,2] sum=14, start=2
Return [1,3] for [4,2,10]
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Clarify if first or last occurrence is needed for equal sums."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What are the trade-offs of this approach?",
        "How do you handle duplicates in sums?"
      ] }
    ]
  },
  {
    q: { en: "What are the Trade-Offs of the Sliding Window Approach for Max Sum k?" },
    level: 'senior',
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Trade-Off Analysis" },
      { type: 'ul', items: [
        "The interviewer might ask 'What are the trade-offs of using Sliding Window for the max sum k problem compared to other approaches?' to test your optimization awareness.",
        "Follow-up: 'How does it compare to divide-and-conquer or prefix sums?'",
        "Deeper: 'When might Sliding Window be less effective?'"
      ]},
      { type: 'subheading', en: "Trade-Offs" },
      { type: 'ul', items: [
        "Sliding Window achieves O(n) time and O(1) space, far better than brute force O(nk) time, by reusing overlapping sums, making it ideal for large n and k in FAANG problems.",
        "Compared to prefix sums (O(n) time, O(n) space), Sliding Window saves space by not storing cumulative sums, but prefix sums allow queries for different k without recomputing.",
        "Divide-and-conquer is overkill (O(n log n)), unsuitable for this problem due to unnecessary recursion, while Sliding Window is simpler and more intuitive.",
        "Limitation: Sliding Window assumes contiguous subarrays, so it’s not applicable for non-contiguous sum problems; also, large k near n reduces sliding benefits."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Compare Sliding Window to alternatives in interviews to show depth."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle duplicates in sums?",
        "What’s the next problem?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Duplicate Sums in Max Sum Subarray of Size K?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Duplicate Handling" },
      { type: 'ul', items: [
        "The interviewer might ask 'What if multiple k-sized subarrays have the same maximum sum?' to test your handling of ambiguity.",
        "Follow-up: 'How do you decide which subarray to return?' expecting a clear choice.",
        "Deeper: 'Does this affect complexity?'"
      ]},
      { type: 'subheading', en: "Duplicate Handling" },
      { type: 'ul', items: [
        "If multiple subarrays have the same max sum, typically return the first occurrence’s indices for simplicity, but clarify with the interviewer if they prefer the last or all occurrences.",
        "For returning all, store indices in an array when sum equals maxSum, increasing space to O(n) in worst case (all windows equal).",
        "Complexity remains O(n) time, as checking equality is O(1) per slide; space is O(1) for first/last, O(n) for all.",
        "In FAANG, first occurrence is standard unless specified, keeping the solution lean."
      ]},
      { type: 'codeBlock', codeBlock: `
function maxSumAllIndices(arr, k) {
  if (!arr.length || k <= 0 || k > arr.length) return [];
  let sum = 0;
  for (let i = 0; i < k; i++) sum += arr[i];
  let maxSum = sum, indices = [[0, k-1]];
  for (let i = k; i < arr.length; i++) {
    sum += arr[i] - arr[i - k];
    if (sum > maxSum) {
      maxSum = sum;
      indices = [[i - k + 1, i]];
    } else if (sum === maxSum) {
      indices.push([i - k + 1, i]);
    }
  }
  return indices;
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Ask if all occurrences are needed to avoid unnecessary complexity."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "Can you solve another Sliding Window problem?",
        "What about string-based problems?"
      ] }
    ]
  },
  // Problem 2: Find All Anagrams in a String (LC438)
  {
    q: { en: "Problem Statement: Find All Anagrams in a String (LC438)" },
    level: 'intermediate',
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Problem Understanding" },
      { type: 'ul', items: [
        "The interviewer might state 'Given a string s and a string p, find all starting indices of p’s anagrams in s.' This tests your ability to recognize a fixed Sliding Window problem with character frequency tracking.",
        "Follow-up: 'What if s or p is empty?' expecting edge case checks.",
        "Deeper: 'How do you handle case sensitivity or non-lowercase chars?'"
      ]},
      { type: 'subheading', en: "Problem Explanation" },
      { type: 'ul', items: [
        "The goal is to find all starting indices in s where a substring of length p.length is an anagram of p (e.g., s='cbaebabacd', p='abc', returns [0,6] for 'cba' and 'bac').",
        "Constraints: 1 <= s.length, p.length <= 3*10^4, lowercase letters, requiring O(n) solution with fixed window of size p.length.",
        "This is a fixed Sliding Window problem: slide a window of p.length, tracking character frequencies to match p’s counts, adding start index when all match.",
        "Common in FAANG to test frequency map usage and window state management."
      ]},
      { type: 'ascii', ascii: `
s: cbaebabacd, p: abc
Window 1: [c,b,a] matches p’s counts
Slide: [b,a,e] no match
...
Window 7: [b,a,c] matches
Indices: [0,6]
      ` },
      { type: 'subheading', en: "Key Interview Insight" },
      { type: 'ul', items: [
        "Clarify if case matters or if only lowercase letters are used."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What’s the brute force approach?",
        "How do you optimize with Sliding Window?"
      ] }
    ]
  },
  {
    q: { en: "Brute Force Approach for Find All Anagrams (LC438)" },
    level: 'fresher',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Brute Force" },
      { type: 'ul', items: [
        "The interviewer might ask 'How would you solve the anagrams problem without optimization?' to establish a baseline.",
        "Follow-up: 'What’s the complexity?' expecting O(n*m*log(m)).",
        "Deeper: 'Why is this inefficient?'"
      ]},
      { type: 'subheading', en: "Brute Force Approach" },
      { type: 'ul', items: [
        "For each substring of s with length p.length, check if it’s an anagram of p by sorting both and comparing, costing O(m log m) per window, where m=p.length.",
        "Iterate from 0 to s.length-p.length, giving O(n-m+1) windows, so total time is O(n*m*log(m)), with O(m) space for sorting.",
        "Inefficient due to repeated sorting and no reuse of overlapping chars, unsuitable for large n or m in FAANG problems."
      ]},
      { type: 'codeBlock', codeBlock: `
function findAnagramsBrute(s, p) {
  if (s.length < p.length) return [];
  const pSorted = p.split('').sort().join('');
  const result = [];
  for (let i = 0; i <= s.length - p.length; i++) {
    let substr = s.slice(i, i + p.length).split('').sort().join('');
    if (substr === pSorted) result.push(i);
  }
  return result;
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Start with brute force to clarify problem, then optimize."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you optimize with Sliding Window?",
        "What data structure tracks anagram state?"
      ] }
    ]
  },
  {
    q: { en: "Optimized Sliding Window Approach for Find All Anagrams (LC438)" },
    level: 'intermediate',
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Optimization" },
      { type: 'ul', items: [
        "The interviewer might ask 'How can you optimize the anagram problem using Sliding Window?' expecting a frequency-based approach.",
        "Follow-up: 'What’s the complexity?' expecting O(n).",
        "Deeper: 'How do you handle edge cases like empty strings?'"
      ]},
      { type: 'subheading', en: "Optimized Approach" },
      { type: 'ul', items: [
        "Use a fixed Sliding Window of size p.length: create a frequency map for p’s chars, slide over s, maintaining a window map, and count matches.",
        "Initialize window with first m chars, compare counts; slide by adding right char, removing left char, updating match count in O(1).",
        "Track matches (chars with equal counts in window and p); when matches equal p’s unique chars, add left index.",
        "Time: O(n) as each char is added/removed once; Space: O(1) for fixed alphabet (e.g., 26 letters)."
      ]},
      { type: 'codeBlock', codeBlock: `
function findAnagrams(s, p) {
  if (s.length < p.length) return [];
  const pCount = new Array(26).fill(0);
  const windowCount = new Array(26).fill(0);
  for (let c of p) pCount[c.charCodeAt(0) - 97]++;
  for (let i = 0; i < p.length; i++) windowCount[s.charCodeAt(i) - 97]++;
  let matches = 0;
  for (let i = 0; i < 26; i++) if (pCount[i] === windowCount[i]) matches++;
  const result = matches === 26 ? [0] : [];
  for (let i = p.length; i < s.length; i++) {
    let left = s.charCodeAt(i - p.length) - 97;
    let right = s.charCodeAt(i) - 97;
    windowCount[right]++;
    if (windowCount[right] === pCount[right]) matches++;
    else if (windowCount[right] === pCount[right] + 1) matches--;
    windowCount[left]--;
    if (windowCount[left] === pCount[left]) matches++;
    else if (windowCount[left] === pCount[left] - 1) matches--;
    if (matches === 26) result.push(i - p.length + 1);
  }
  return result;
}
      ` },
      { type: 'ascii', ascii: `
s: cbaebabacd, p: abc
pCount: {a:1, b:1, c:1}
Window 1: [c,b,a] windowCount={a:1,b:1,c:1}, matches=3, add 0
Slide: [b,a,e] remove c, add e, windowCount={a:1,b:1,e:1}, matches=2
...
Window 7: [b,a,c] matches=3, add 6
      ` },
      { type: 'subheading', en: "Complexity" },
      { type: 'ul', items: [
        "Time: O(n), as each char is processed O(1) times.",
        "Space: O(1), fixed 26-letter array."
      ]},
      { type: 'subheading', en: "Key Interview Insight" },
      { type: 'ul', items: [
        "Explain how matches reduce checks to O(1) per slide."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What are the edge cases?",
        "How do you handle duplicates?"
      ] }
    ]
  },
  {
    q: { en: "What are the Edge Cases for Find All Anagrams (LC438)?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Edge Cases" },
      { type: 'ul', items: [
        "The interviewer might ask 'What edge cases do you need to consider for the anagram problem?' to ensure robust code.",
        "Follow-up: 'What if p is longer than s?'",
        "Deeper: 'How do you handle non-lowercase characters?'"
      ]},
      { type: 'subheading', en: "Edge Cases" },
      { type: 'ul', items: [
        "Empty s or p: Return [], as no anagrams possible.",
        "p.length > s.length: Return [], as no substring can match.",
        "Single char p: Check each char in s, return indices where s[i] === p[0].",
        "No anagrams exist: Return [], handled naturally by matching logic.",
        "Non-lowercase: Adjust array size (e.g., 128 for ASCII) or use hash map."
      ]},
      { type: 'codeBlock', codeBlock: `
function findAnagrams(s, p) {
  if (!s.length || !p.length || p.length > s.length) return [];
  // Proceed with sliding window
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Validate inputs early to handle edge cases cleanly."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle duplicate characters in p?",
        "What are the trade-offs?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Duplicate Characters in Find All Anagrams (LC438)?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Duplicate Handling" },
      { type: 'ul', items: [
        "The interviewer might ask 'How does your solution handle duplicate characters in p for the anagram problem?' to test frequency management.",
        "Follow-up: 'What if p has many duplicates of one char?'",
        "Deeper: 'How does this affect performance?'"
      ]},
      { type: 'subheading', en: "Duplicate Handling" },
      { type: 'ul', items: [
        "Duplicates in p are handled by tracking exact frequencies in pCount and windowCount; a window is an anagram only if counts match for all chars.",
        "For p='aabb', pCount={a:2,b:2}; slide window, increment/decrement counts, and check if all counts match (matches=26 for lowercase).",
        "Many duplicates (e.g., p='aaaaa') don’t change logic; just need counts to match, and performance remains O(n) as updates are O(1).",
        "In FAANG, clarify if duplicates affect output (e.g., multiple matches at same index, which is impossible here)."
      ]},
      { type: 'ascii', ascii: `
s: aaab, p: aab
pCount: {a:2,b:1}
Window: [a,a,a] windowCount={a:3,b:0} matches=1
Slide: [a,a,b] windowCount={a:2,b:1} matches=2, add index
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Explain frequency matching to show clarity."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What are the trade-offs of using arrays vs maps?",
        "What’s the next problem?"
      ] }
    ]
  },
  {
    q: { en: "What are the Trade-Offs of Using Arrays vs Maps for Anagrams?" },
    level: 'senior',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Data Structure Trade-Offs" },
      { type: 'ul', items: [
        "The interviewer might ask 'Why use an array over a hash map for the anagram problem, and what are the trade-offs?' to test optimization choices.",
        "Follow-up: 'When would a map be better?'",
        "Deeper: 'How does this choice impact large inputs?'"
      ]},
      { type: 'subheading', en: "Trade-Offs" },
      { type: 'ul', items: [
        "Arrays (e.g., size 26) are faster with O(1) access and minimal memory (O(1)) for fixed alphabets like lowercase letters, avoiding hash overhead.",
        "Maps handle larger alphabets (e.g., Unicode) with O(1) average-case access but use O(m) space for m unique chars and risk collision slowdown.",
        "For large n or frequent updates, arrays are cache-friendly; maps have higher constant factors.",
        "In FAANG, use arrays for lowercase-only to impress with efficiency."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Confirm alphabet size to choose array or map."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle large alphabets?",
        "What’s the next Sliding Window problem?"
      ] }
    ]
  },
  // Problem 3: Minimum Window Substring (LC76)
  {
    q: { en: "Problem Statement: Minimum Window Substring (LC76)" },
    level: 'intermediate',
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Problem Understanding" },
      { type: 'ul', items: [
        "The interviewer might state 'Given strings s and t, find the shortest substring of s containing all characters of t (including duplicates). Return empty if none exists.' This tests variable Sliding Window with complex state.",
        "Follow-up: 'What if t has duplicates?' expecting frequency handling.",
        "Deeper: 'How do you ensure minimal length?'"
      ]},
      { type: 'subheading', en: "Problem Explanation" },
      { type: 'ul', items: [
        "Find the shortest substring of s containing all chars of t (e.g., s='ADOBECODEBANC', t='ABC', return 'BANC').",
        "Constraints: 1 <= s.length, t.length <= 10^5, lowercase, O(n) solution expected.",
        "Variable Sliding Window: expand right until all t chars are included, shrink left to minimize while maintaining validity.",
        "FAANG favorite for testing map-based state management and optimization."
      ]},
      { type: 'ascii', ascii: `
s: ADOBECODEBANC, t: ABC
Expand: [ADOBEC] contains A,B,C
Shrink: [BEC] still valid
Expand: [BECODEBA] contains A,B,C
Shrink: [BANC] minimal, return
      ` },
      { type: 'subheading', en: "Key Interview Insight" },
      { type: 'ul', items: [
        "Clarify if t has duplicates or if s can lack t’s chars."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What’s the brute force approach?",
        "How do you optimize with Sliding Window?"
      ] }
    ]
  },
  {
    q: { en: "Brute Force Approach for Minimum Window Substring (LC76)" },
    level: 'fresher',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Brute Force" },
      { type: 'ul', items: [
        "The interviewer might ask 'How would you solve the min window substring problem without optimization?' to establish a baseline.",
        "Follow-up: 'What’s the complexity?' expecting O(n^2*m).",
        "Deeper: 'Why is this inefficient?'"
      ]},
      { type: 'subheading', en: "Brute Force Approach" },
      { type: 'ul', items: [
        "Check every possible substring of s by iterating start (i) and end (j) indices, computing frequency map for each substring, and checking if it contains t’s chars.",
        "For each substring, frequency check is O(m), with O(n^2) substrings, giving O(n^2*m) time, O(m) space for maps.",
        "Inefficient due to redundant frequency calculations for overlapping substrings, unsuitable for large n."
      ]},
      { type: 'codeBlock', codeBlock: `
function minWindowBrute(s, t) {
  if (!s || !t || t.length > s.length) return "";
  let minLen = Infinity, result = "";
  const tCount = new Map();
  for (let c of t) tCount.set(c, (tCount.get(c) || 0) + 1);
  for (let i = 0; i < s.length; i++) {
    for (let j = i; j < s.length; j++) {
      let substr = s.slice(i, j + 1);
      let sCount = new Map();
      for (let c of substr) sCount.set(c, (sCount.get(c) || 0) + 1);
      let valid = true;
      for (let [c, count] of tCount) {
        if (!sCount.has(c) || sCount.get(c) < count) valid = false;
      }
      if (valid && substr.length < minLen) {
        minLen = substr.length;
        result = substr;
      }
    }
  }
  return result;
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Explain brute force to show problem clarity, then pivot to optimized."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you optimize with Sliding Window?",
        "What data structure tracks the window?"
      ] }
    ]
  },
  {
    q: { en: "Optimized Sliding Window Approach for Minimum Window Substring (LC76)" },
    level: 'intermediate',
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Optimization" },
      { type: 'ul', items: [
        "The interviewer might ask 'How can you optimize the min window substring problem using Sliding Window?' expecting a variable window approach.",
        "Follow-up: 'What’s the complexity?' expecting O(n).",
        "Deeper: 'How do you handle duplicates in t?'"
      ]},
      { type: 'subheading', en: "Optimized Approach" },
      { type: 'ul', items: [
        "Use a variable Sliding Window: create a frequency map for t, expand right until the window contains all t chars (with counts), then shrink left to minimize while maintaining validity.",
        "Track matches (chars with sufficient counts); when matches equal t’s unique chars, shrink left, updating min length and result if smaller.",
        "Use a map for window counts, increment for right, decrement for left, checking matches in O(1) for fixed alphabets.",
        "Time: O(n) as each char is added/removed once; Space: O(1) for fixed alphabet."
      ]},
      { type: 'codeBlock', codeBlock: `
function minWindow(s, t) {
  if (!s || !t || t.length > s.length) return "";
  const tCount = new Map();
  for (let c of t) tCount.set(c, (tCount.get(c) || 0) + 1);
  let required = tCount.size, matches = 0;
  const windowCount = new Map();
  let left = 0, minLen = Infinity, minStart = 0;
  for (let right = 0; right < s.length; right++) {
    let c = s[right];
    windowCount.set(c, (windowCount.get(c) || 0) + 1);
    if (tCount.has(c) && windowCount.get(c) === tCount.get(c)) matches++;
    while (matches === required) {
      if (right - left + 1 < minLen) {
        minLen = right - left + 1;
        minStart = left;
      }
      let leftC = s[left];
      windowCount.set(leftC, windowCount.get(leftC) - 1);
      if (tCount.has(leftC) && windowCount.get(leftC) < tCount.get(leftC)) matches--;
      left++;
    }
  }
  return minLen === Infinity ? "" : s.slice(minStart, minStart + minLen);
}
      ` },
      { type: 'ascii', ascii: `
s: ADOBECODEBANC, t: ABC
Expand: [ADOBEC] matches=3 (A,B,C)
Shrink: [BEC] still valid, minLen=3
Expand: [BECODEBA] matches=3
Shrink: [BANC] minLen=4, keep
Result: BANC
      ` },
      { type: 'subheading', en: "Complexity" },
      { type: 'ul', items: [
        "Time: O(n), as left and right pointers move n times total.",
        "Space: O(1) for fixed alphabet, O(m) for t’s unique chars."
      ]},
      { type: 'subheading', en: "Key Interview Insight" },
      { type: 'ul', items: [
        "Explain match tracking to show efficient state management."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What are the edge cases?",
        "How do you handle duplicates in t?"
      ] }
    ]
  },
 
  {
    q: { en: "What are the Edge Cases for Minimum Window Substring (LC76)?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Edge Cases" },
      { type: 'ul', items: [
        "The interviewer might ask 'What edge cases do you need to handle for the min window substring problem?' to ensure robust code.",
        "Follow-up: 'What if t is empty or longer than s?'",
        "Deeper: 'What if s lacks some of t’s chars?'"
      ]},
      { type: 'subheading', en: "Edge Cases" },
      { type: 'ul', items: [
        "Empty s or t: Return empty string, as no valid substring can exist if either input is empty.",
        "t.length > s.length: Return empty string, since no substring of s can contain all characters of t.",
        "s lacks some of t’s characters: Return empty string, as the window will never have enough matches to satisfy t’s frequency requirements.",
        "Single character t: Find the first occurrence of t[0] in s, return it as a single-character substring.",
        "Duplicates in t (e.g., t='aabb'): Ensure the window has exact counts (e.g., {a:2, b:2}), handled naturally by frequency map comparison.",
        "Large s or t (e.g., 10^5): Ensure O(n) efficiency with Sliding Window to avoid TLE in FAANG interviews."
      ]},
      { type: 'codeBlock', codeBlock: `
function minWindow(s, t) {
  if (!s || !t || t.length > s.length) return "";
  // Proceed with sliding window
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Add edge case checks at the start to prevent runtime errors and show robustness."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle duplicates in t?",
        "What are the trade-offs of this approach?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Duplicates in t for Minimum Window Substring (LC76)?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Duplicate Handling" },
      { type: 'ul', items: [
        "The interviewer might ask 'How does your solution handle duplicate characters in t for the min window substring problem?' to test your frequency management skills.",
        "Follow-up: 'What if t has many duplicates of one character, like t=aaaa?' expecting clarity on exact count matching.",
        "Deeper: 'How does this affect the shrinking logic?' checking your understanding of window contraction."
      ]},
      { type: 'subheading', en: "Handling Duplicates" },
      { type: 'ul', items: [
        "Duplicates in t are managed by tracking exact frequencies in a map (e.g., t='aabb' gives tCount={a:2, b:2}), and the window is valid only when windowCount matches or exceeds these counts for all characters.",
        "When expanding the window, increment windowCount for s[right]; when a character’s count equals tCount’s, increment matches to track valid characters.",
        "When shrinking, decrement windowCount for s[left]; if a character’s count falls below tCount’s, decrement matches, ensuring the window only shrinks when necessary to maintain minimality.",
        "For extreme cases like t='aaaa', the window must include at least 4 'a’s, which the frequency map naturally enforces, and shrinking stops when removing an 'a' would invalidate the window."
      ]},
      { type: 'ascii', ascii: `
s: ADOBECODEBANC, t: AABB
tCount: {A:2, B:2}
Expand: [ADOBECODEBA] windowCount={A:2, B:2, ...}, matches=2
Shrink: [BECODEBA] windowCount={A:1, B:2, ...}, matches=1 (stop shrinking)
Expand: [BECODEBANC] matches=2, update min
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Explain how frequency matching handles duplicates to show clarity in state management."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What are the trade-offs of this approach?",
        "How do you optimize for large alphabets?"
      ] }
    ]
  },
  {
    q: { en: "What are the Trade-Offs of the Sliding Window Approach for Minimum Window Substring (LC76)?" },
    level: 'senior',
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Trade-Off Analysis" },
      { type: 'ul', items: [
        "The interviewer might ask 'What are the trade-offs of using Sliding Window for the min window substring problem compared to other approaches?' to test your optimization awareness.",
        "Follow-up: 'How does it compare to brute force or other patterns?' expecting a comparison with O(n^2) methods.",
        "Deeper: 'When might this approach be less effective?' probing limitations."
      ]},
      { type: 'subheading', en: "Trade-Offs" },
      { type: 'ul', items: [
        "Sliding Window achieves O(n) time (where n is s.length) by processing each character at most twice (add/remove), compared to brute force’s O(n^2*m) for checking all substrings and their frequencies.",
        "Space complexity is O(1) for fixed alphabets (e.g., lowercase letters) using arrays, or O(m) for t’s unique characters with a hash map, better than brute force’s repeated O(m) per substring.",
        "The approach is complex due to dynamic window size and frequency tracking, requiring careful management of matches and shrinking logic, unlike simpler fixed window problems.",
        "Limitations: Ineffective for non-contiguous problems or if t’s alphabet is extremely large (e.g., Unicode), where map overhead or memory becomes significant."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Compare Sliding Window to brute force in interviews to highlight optimization skills."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you optimize for large alphabets?",
        "What’s the next Sliding Window problem?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Optimize for Large Alphabets in Minimum Window Substring (LC76)?" },
    level: 'senior',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Large Alphabet Optimization" },
      { type: 'ul', items: [
        "The interviewer might ask 'How would you optimize the min window substring solution for a large alphabet, like Unicode characters?' to test your ability to handle scalability.",
        "Follow-up: 'What data structures would you use?' expecting alternatives to hash maps.",
        "Deeper: 'How do collisions affect performance in this case?' probing hash map limitations."
      ]},
      { type: 'subheading', en: "Optimization for Large Alphabets" },
      { type: 'ul', items: [
        "For large alphabets (e.g., Unicode with thousands of chars), hash maps are preferred over arrays due to sparse data, but optimize by using JavaScript’s Map for efficient hashing and minimal collision risk.",
        "Reduce map operations by filtering s to only include characters present in t before processing, reducing the window’s effective size and map updates.",
        "For extreme cases, consider a trie for t’s characters if pattern matching is involved, though this is rare; bitsets may work for specific subsets but are complex.",
        "Profile and minimize map resizing in JS by pre-allocating capacity if t’s size is known, and use typed arrays for fixed subsets if feasible."
      ]},
      { type: 'codeBlock', codeBlock: `
function minWindowOptimized(s, t) {
  if (!s || !t || t.length > s.length) return "";
  const tCount = new Map();
  for (let c of t) tCount.set(c, (tCount.get(c) || 0) + 1);
  const filteredS = [];
  for (let i = 0; i < s.length; i++) if (tCount.has(s[i])) filteredS.push([s[i], i]);
  // Slide over filteredS
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Ask about alphabet size to justify map vs array choice."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do collisions impact large alphabets?",
        "What’s the next problem?"
      ] }
    ]
  },
  // Problem 4: Longest Substring Without Repeating Characters (LC3)
  {
    q: { en: "Problem Statement: Longest Substring Without Repeating Characters (LC3)" },
    level: 'intermediate',
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Problem Understanding" },
      { type: 'ul', items: [
        "The interviewer might state 'Given a string s, find the length of the longest substring without repeating characters.' This tests variable Sliding Window with unique character tracking.",
        "Follow-up: 'What if the string is empty?' expecting edge case handling.",
        "Deeper: 'Can you return the substring itself?' testing extension."
      ]},
      { type: 'subheading', en: "Problem Explanation" },
      { type: 'ul', items: [
        "Find the length of the longest substring of s with no repeating characters (e.g., s='abcabcbb', return 3 for 'abc').",
        "Constraints: 0 <= s.length <= 5*10^4, any characters, O(n) solution expected.",
        "Variable Sliding Window: expand right until a repeat is found, shrink left until no repeats, tracking max length.",
        "Common in FAANG to test set/map usage and dynamic window management."
      ]},
      { type: 'ascii', ascii: `
s: abcabcbb
Expand: [abc] no repeats, len=3
Expand: [abca] repeat a, shrink [bca]
Expand: [bcab] repeat b, shrink [abc]
Max len=3
      ` },
      { type: 'subheading', en: "Key Interview Insight" },
      { type: 'ul', items: [
        "Clarify if you need to return length or substring."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What’s the brute force approach?",
        "How do you optimize with Sliding Window?"
      ] }
    ]
  },
  {
    q: { en: "Brute Force Approach for Longest Substring Without Repeating Characters (LC3)" },
    level: 'fresher',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Brute Force" },
      { type: 'ul', items: [
        "The interviewer might ask 'How would you solve the longest substring without repeats without optimization?' to establish a baseline.",
        "Follow-up: 'What’s the complexity?' expecting O(n^3).",
        "Deeper: 'Why is this inefficient?'"
      ]},
      { type: 'subheading', en: "Brute Force Approach" },
      { type: 'ul', items: [
        "Check every possible substring by iterating start (i) and end (j), using a set to check for repeats in O(j-i) time per substring.",
        "For n^2 substrings, each checked in O(n), time is O(n^3), space O(n) for the set.",
        "Inefficient due to redundant checks and no reuse of previous substring data."
      ]},
      { type: 'codeBlock', codeBlock: `
function lengthOfLongestSubstringBrute(s) {
  let maxLen = 0;
  for (let i = 0; i < s.length; i++) {
    for (let j = i; j < s.length; j++) {
      let set = new Set();
      let valid = true;
      for (let k = i; k <= j; k++) {
        if (set.has(s[k])) {
          valid = false;
          break;
        }
        set.add(s[k]);
      }
      if (valid) maxLen = Math.max(maxLen, j - i + 1);
    }
  }
  return maxLen;
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Explain brute force to clarify problem, then optimize."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you optimize with Sliding Window?",
        "What data structure tracks repeats?"
      ] }
    ]
  },
  {
    q: { en: "Optimized Sliding Window Approach for Longest Substring Without Repeating Characters (LC3)" },
    level: 'intermediate',
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Optimization" },
      { type: 'ul', items: [
        "The interviewer might ask 'How can you optimize the longest substring problem using Sliding Window?' expecting a variable window with set/map.",
        "Follow-up: 'What’s the complexity?' expecting O(n).",
        "Deeper: 'How do you handle duplicates efficiently?'"
      ]},
      { type: 'subheading', en: "Optimized Approach" },
      { type: 'ul', items: [
        "Use a variable Sliding Window: expand right, adding chars to a map with their latest index; if a repeat is found, shrink left to the index after the last occurrence of the repeated char.",
        "Track max length as right - left + 1, updating when a valid window is found.",
        "Use a map for O(1) lookups of char indices, ensuring O(n) time as each char is processed at most twice.",
        "Space: O(min(m,n)) where m is alphabet size, n is s.length."
      ]},
      { type: 'codeBlock', codeBlock: `
function lengthOfLongestSubstring(s) {
  const map = new Map();
  let maxLen = 0, left = 0;
  for (let right = 0; right < s.length; right++) {
    if (map.has(s[right]) && map.get(s[right]) >= left) {
      left = map.get(s[right]) + 1;
    }
    map.set(s[right], right);
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}
      ` },
      { type: 'ascii', ascii: `
s: abcabcbb
Window: [abc] map={a:0,b:1,c:2}, len=3
Expand: [abca] map={a:3,b:1,c:2}, a repeats, left=1
Window: [bca] map={a:3,b:1,c:2}, len=3
Expand: [bcab] b repeats, left=2
Window: [abc] len=3
Max len=3
      ` },
      { type: 'subheading', en: "Complexity" },
      { type: 'ul', items: [
        "Time: O(n), as left and right pointers move n times total.",
        "Space: O(min(m,n)) for map, where m is alphabet size."
      ]},
      { type: 'subheading', en: "Key Interview Insight" },
      { type: 'ul', items: [
        "Explain how map tracks last indices to optimize shrinking."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What are the edge cases?",
        "How do you handle duplicates?"
      ] }
    ]
  },
  {
    q: { en: "What are the Edge Cases for Longest Substring Without Repeating Characters (LC3)?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Edge Cases" },
      { type: 'ul', items: [
        "The interviewer might ask 'What edge cases do you need to handle for the longest substring without repeats?' to ensure robust code.",
        "Follow-up: 'What if the string is empty or single-char?'",
        "Deeper: 'How do you handle large alphabets?'"
      ]},
      { type: 'subheading', en: "Edge Cases" },
      { type: 'ul', items: [
        "Empty string: Return 0, as no substring exists.",
        "Single character: Return 1, as the char itself is valid.",
        "All same characters (e.g., 'aaa'): Return 1, as any substring longer than 1 repeats.",
        "Large alphabet (e.g., Unicode): Use map, space O(min(m,n)), where m is alphabet size.",
        "Very long string (e.g., 5*10^4): Ensure O(n) efficiency with map-based sliding."
      ]},
      { type: 'codeBlock', codeBlock: `
function lengthOfLongestSubstring(s) {
  if (!s.length) return 0;
  // Proceed with sliding window
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Check empty string early to avoid unnecessary processing."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle duplicates in this problem?",
        "Can you return the substring itself?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Duplicates in Longest Substring Without Repeating Characters (LC3)?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Duplicate Handling" },
      { type: 'ul', items: [
        "The interviewer might ask 'How does your solution handle duplicate characters in the longest substring problem?' to test your shrinking logic.",
        "Follow-up: 'What if the string has many duplicates?'",
        "Deeper: 'How does this affect performance?'"
      ]},
      { type: 'subheading', en: "Duplicate Handling" },
      { type: 'ul', items: [
        "Duplicates trigger window shrinking: when s[right] is already in the map and its last index is >= left, move left to map.get(s[right]) + 1 to exclude the repeat.",
        "Update map with s[right]’s new index, ensuring the window has no repeats by only including the latest occurrence of each char.",
        "For many duplicates (e.g., 'aaaa'), the window shrinks frequently, keeping length=1, but performance remains O(n) as each char is processed at most twice.",
        "In FAANG, emphasize how map-based shrinking ensures efficiency."
      ]},
      { type: 'ascii', ascii: `
s: abba
Window: [ab] map={a:0,b:1}
Expand: [abb] b repeats, left=2
Window: [ba] map={a:2,b:3}
Expand: [ba] a repeats, left=3
Window: [a] len=1
Max len=2
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Explain shrinking logic clearly to show control over duplicates."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "Can you return the substring itself?",
        "What are the trade-offs?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Return the Substring for Longest Substring Without Repeating Characters (LC3)?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Substring Return" },
      { type: 'ul', items: [
        "The interviewer might ask 'Modify your solution to return the longest substring without repeats instead of its length,' testing your ability to extend the algorithm.",
        "Follow-up: 'What if multiple substrings have the max length?'",
        "Deeper: 'Does this affect complexity?'"
      ]},
      { type: 'subheading', en: "Returning Substring" },
      { type: 'ul', items: [
        "Track the start index (left) and length of the max substring during sliding, updating when right - left + 1 > maxLen.",
        "When a new max is found, store left and right; at the end, return s.slice(start, start + maxLen).",
        "If multiple substrings have max length, typically return the first; clarify if last or all are needed.",
        "Complexity remains O(n) time, O(min(m,n)) space, as only start index is added."
      ]},
      { type: 'codeBlock', codeBlock: `
function longestSubstring(s) {
  if (!s.length) return "";
  const map = new Map();
  let maxLen = 0, left = 0, start = 0;
  for (let right = 0; right < s.length; right++) {
    if (map.has(s[right]) && map.get(s[right]) >= left) {
      left = map.get(s[right]) + 1;
    }
    map.set(s[right], right);
    if (right - left + 1 > maxLen) {
      maxLen = right - left + 1;
      start = left;
    }
  }
  return s.slice(start, start + maxLen);
}
      ` },
      { type: 'ascii', ascii: `
s: abcabcbb
Window: [abc] len=3, start=0
Expand: [abca] repeat, left=1, [bca] len=3, start=1
Max len=3, return s.slice(0,3) = "abc"
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Clarify if first or last substring is needed for equal lengths."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What are the trade-offs?",
        "How do you optimize for large n?"
      ] }
    ]
  },
  {
    q: { en: "What are the Trade-Offs of the Sliding Window Approach for Longest Substring Without Repeating Characters (LC3)?" },
    level: 'senior',
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Trade-Off Analysis" },
      { type: 'ul', items: [
        "The interviewer might ask 'What are the trade-offs of using Sliding Window for the longest substring without repeats?' to test optimization awareness.",
        "Follow-up: 'How does it compare to other approaches?'",
        "Deeper: 'When might this approach be less effective?'"
      ]},
      { type: 'subheading', en: "Trade-Offs" },
      { type: 'ul', items: [
        "Sliding Window achieves O(n) time by processing each char twice, compared to brute force O(n^3), making it ideal for large n in FAANG problems.",
        "Space is O(min(m,n)) for the map, better than brute force’s O(n) per substring, but arrays can reduce to O(1) for fixed alphabets.",
        "Complexity arises from managing duplicates and shrinking logic, requiring careful map updates compared to simpler fixed window problems.",
        "Limitation: Ineffective for non-contiguous problems or if additional constraints (e.g., k distinct chars) require different logic."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Compare to brute force to highlight efficiency."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you optimize for large n?",
        "What about cache efficiency?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Optimize for Large n in Sliding Window Problems?" },
    level: 'senior',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Large n Optimization" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you optimize Sliding Window solutions for very large inputs (e.g., n=10^6)?' to test scalability.",
        "Follow-up: 'What techniques reduce memory or CPU usage?'",
        "Deeper: 'How does cache locality affect performance?'"
      ]},
      { type: 'subheading', en: "Optimizations for Large n" },
      { type: 'ul', items: [
        "Minimize auxiliary space: Use arrays for fixed alphabets (e.g., 26 letters) instead of maps to reduce O(m) to O(1) space, critical for large n.",
        "Avoid unnecessary allocations: Reuse variables for sums or counts, and pre-allocate maps/arrays if sizes are known to prevent resizing.",
        "Optimize state updates: In variable windows, use efficient shrinking (e.g., jump left to last repeat index) to reduce iterations, as in LC3.",
        "Process in chunks for extremely large n (e.g., streaming data), maintaining partial windows if memory is constrained, though rare in interviews."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Mention cache-friendly arrays for large n to show systems awareness."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How does cache locality impact Sliding Window?",
        "What about parallel processing?"
      ] }
    ]
  },
  {
    q: { en: "How Does Cache Locality Impact Sliding Window Performance?" },
    level: 'senior',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Cache Locality" },
      { type: 'ul', items: [
        "The interviewer might ask 'How does cache locality affect Sliding Window performance for large inputs?' to test your systems-level knowledge.",
        "Follow-up: 'How do arrays vs maps affect cache?'",
        "Deeper: 'How do you optimize for cache efficiency?'"
      ]},
      { type: 'subheading', en: "Cache Locality Impact" },
      { type: 'ul', items: [
        "Cache locality refers to accessing data in contiguous memory, reducing cache misses; Sliding Window benefits from arrays’ contiguous storage, as arr[left] and arr[right] are often close, fitting in cache lines.",
        "Arrays (e.g., for char counts) have better locality than hash maps, where scattered key-value pairs cause more misses, slowing access for large n.",
        "Sequential slides (left++, right++) maximize temporal and spatial locality, keeping data in cache, improving performance for numerical or small-alphabet problems.",
        "In FAANG, cache efficiency is critical for real-time systems; arrays over maps for fixed ranges boost performance."
      ]},
      { type: 'subheading', en: "Optimizations" },
      { type: 'ul', items: [
        "Use arrays for fixed alphabets to ensure contiguous access.",
        "Minimize map usage for large n to reduce cache misses.",
        "Process sequentially to leverage prefetching."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Highlight cache benefits of arrays in interviews."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "Can you parallelize Sliding Window?",
        "How do you handle memory overhead?"
      ] }
    ]
  },
  {
    q: { en: "Can You Parallelize Sliding Window for Large Inputs?" },
    level: 'senior',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Parallelization" },
      { type: 'ul', items: [
        "The interviewer might ask 'Can you parallelize a Sliding Window algorithm for large inputs?' to test your distributed systems knowledge.",
        "Follow-up: 'What challenges arise in parallel Sliding Window?'",
        "Deeper: 'When is parallelization worth it?'"
      ]},
      { type: 'subheading', en: "Parallelization" },
      { type: 'ul', items: [
        "Sliding Window is inherently sequential due to dependencies between window states (e.g., sum or map updates rely on previous window), making full parallelization difficult.",
        "For fixed windows (e.g., max sum k), divide the array into chunks, process each chunk’s windows in parallel, and merge results (e.g., max sum across chunks), but merging adds overhead.",
        "For variable windows, parallelization is harder due to dynamic sizes, but you can process independent segments if constraints allow (e.g., non-overlapping valid windows).",
        "Parallelization is worth it for massive n (e.g., 10^8) in production, but in interviews, focus on O(n) sequential solution unless asked."
      ]},
      { type: 'subheading', en: "Challenges" },
      { type: 'ul', items: [
        "Dependencies between windows require synchronization, adding complexity.",
        "Overhead of thread management may outweigh benefits for small n.",
        "Merging results (e.g., min/max across chunks) needs careful handling."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Suggest parallelization only for very large n and clarify trade-offs."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle memory overhead in Sliding Window?",
        "What’s the impact of character range (26 vs 256)?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Memory Overhead in Sliding Window?" },
    level: 'senior',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Memory Overhead" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you minimize memory overhead in Sliding Window algorithms?' to test your optimization for constrained environments.",
        "Follow-up: 'How does memory usage differ for fixed vs variable windows?'",
        "Deeper: 'What’s the impact of large alphabets on memory?'"
      ]},
      { type: 'subheading', en: "Memory Overhead Management" },
      { type: 'ul', items: [
        "Fixed windows (e.g., max sum k) use O(1) space for simple state (sum, max), minimizing overhead by avoiding auxiliary structures.",
        "Variable windows (e.g., min window substring) use O(m) space for maps or O(1) for arrays with fixed alphabets, so prefer arrays for small ranges (e.g., 26 letters).",
        "For large alphabets, use sparse maps or filter input to relevant chars to reduce map size, as in LC76 optimization.",
        "Avoid storing substrings or indices unless required, updating results in-place to keep space constant."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Mention space optimization (e.g., arrays over maps) in interviews."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What’s the impact of character range (26 vs 256)?",
        "How do you handle strings vs numbers?"
      ] }
    ]
  },
  {
    q: { en: "What’s the Impact of Character Range (26 vs 256) in Sliding Window?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Character Range Impact" },
      { type: 'ul', items: [
        "The interviewer might ask 'How does the character range (e.g., 26 lowercase vs 256 ASCII) affect your Sliding Window solution?' to test your data structure choices.",
        "Follow-up: 'When do you choose arrays over maps for character tracking?'",
        "Deeper: 'How does this impact memory and performance?'"
      ]},
      { type: 'subheading', en: "Character Range Impact" },
      { type: 'ul', items: [
        "For 26 lowercase letters, use an array of size 26 for O(1) space and time, as in LC438, leveraging fixed range for cache-friendly access.",
        "For 256 ASCII chars, arrays are still viable (O(256) space), but maps may be preferred for sparse usage to save memory, though with higher constant factors.",
        "Large ranges (e.g., Unicode) require maps, increasing space to O(m) for m unique chars and risking collision slowdowns.",
        "In FAANG, clarify input range to justify array vs map, favoring arrays for small, fixed ranges."
      ]},
      { type: 'codeBlock', codeBlock: `
function useArrayFor26(s) {
  const counts = new Array(26).fill(0);
  // Slide window, update counts[c.charCodeAt(0) - 97]
}
function useMapFor256(s) {
  const map = new Map();
  // Slide window, update map
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Ask about character range to optimize data structure choice."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle strings vs numbers in Sliding Window?",
        "What about shrink/expand logic?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Strings vs Numbers in Sliding Window?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Strings vs Numbers" },
      { type: 'ul', items: [
        "The interviewer might ask 'How does handling strings differ from numbers in Sliding Window problems?' to test your adaptability across input types.",
        "Follow-up: 'What data structures change for strings?'",
        "Deeper: 'How do you unify approaches for both?'"
      ]},
      { type: 'subheading', en: "Strings vs Numbers" },
      { type: 'ul', items: [
        "Numbers (e.g., max sum k) typically involve simple arithmetic state (sum, max), updated in O(1) with arr[right] - arr[left], as in LC53-related problems.",
        "Strings (e.g., anagrams, no repeats) require frequency or presence tracking, using arrays for small alphabets or maps for larger ones, with O(1) updates per char.",
        "Strings are treated as arrays in JS (s[i] access), but immutable, so no in-place changes; numbers may involve overflow, requiring BigInt for large values.",
        "Unified approach: Treat both as sequences, using pointers for window bounds and appropriate state (sum for numbers, map for strings)."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Abstract the problem to a sequence to simplify coding."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What’s the shrink/expand logic in variable windows?",
        "How do you handle large n?"
      ] }
    ]
  },
  {
    q: { en: "What is the Shrink/Expand Logic in Variable Sliding Windows?" },
    level: 'intermediate',
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Shrink/Expand Logic" },
      { type: 'ul', items: [
        "The interviewer might ask 'Explain the shrink and expand logic in variable Sliding Window problems,' to test your understanding of dynamic window adjustments.",
        "Follow-up: 'How does this differ from fixed windows?'",
        "Deeper: 'How do you ensure efficiency?'"
      ]},
      { type: 'subheading', en: "Shrink/Expand Logic" },
      { type: 'ul', items: [
        "Expand: Move right pointer to include new elements, updating state (e.g., map.set(s[right], index) or sum += arr[right]) until the window satisfies or violates the condition.",
        "Shrink: When the condition is violated (e.g., repeat char in LC3) or a valid window is found (e.g., all t chars in LC76), move left pointer to remove elements, updating state until the condition is restored or minimized.",
        "Ensure efficiency by updating state in O(1) per move and ensuring each pointer moves at most n times, maintaining O(n) time.",
        "Differs from fixed windows, where size is constant, and both pointers move together without condition checks."
      ]},
      { type: 'ascii', ascii: `
LC3: s=abcabc
Expand: [abc] valid
Expand: [abca] repeat, shrink [bca]
Expand: [bcab] repeat, shrink [abc]
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Clearly define the condition for shrinking to avoid errors."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you debug Sliding Window solutions?",
        "What’s the role of invariants?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Debug Sliding Window Solutions?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Debugging" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you debug a Sliding Window solution that’s not working?' to test your problem-solving process.",
        "Follow-up: 'What common errors occur in Sliding Window?'",
        "Deeper: 'How do you use dry runs effectively?'"
      ]},
      { type: 'subheading', en: "Debugging Process" },
      { type: 'ul', items: [
        "Trace pointer movements with a small test case (e.g., [1,2,3], k=2), logging left, right, and state (sum, map) at each step to verify updates.",
        "Check edge cases: Test empty, single-element, or invalid inputs to ensure early returns work.",
        "Common errors: Off-by-one in pointer updates (e.g., right-left vs right-left+1), incorrect state updates (e.g., missing map decrement), or wrong shrinking condition.",
        "Use ASCII diagrams or print statements to visualize window and state changes, ensuring invariants hold."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Dry run on paper first to catch logical errors before coding."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What are common Sliding Window mistakes?",
        "How do you revise for interviews?"
      ] }
    ]
  },
  {
    q: { en: "What are Common Sliding Window Mistakes?" },
    level: 'fresher',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Common Errors" },
      { type: 'ul', items: [
        "The interviewer might ask 'What common mistakes do candidates make in Sliding Window problems?' to test your awareness of pitfalls.",
        "Follow-up: 'How do you avoid these mistakes?'",
        "Deeper: 'How do these affect FAANG interview performance?'"
      ]},
      { type: 'subheading', en: "Common Mistakes" },
      { type: 'ul', items: [
        "Off-by-one errors: Incorrect window size calculation (e.g., right-left vs right-left+1) or wrong index updates.",
        "Missing edge cases: Not handling empty arrays, invalid k, or duplicates properly.",
        "Incorrect state updates: Forgetting to update map/set when shrinking or expanding.",
        "Wrong shrinking logic: Shrinking too early or too late in variable windows, breaking invariants."
      ]},
      { type: 'subheading', en: "Avoidance" },
      { type: 'ul', items: [
        "Dry run with small inputs to verify logic.",
        "Write edge case checks first.",
        "Log state changes during development."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Practice explaining errors to show debugging skills."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you revise for Sliding Window?",
        "What’s your practice routine?"
      ] }
    ]
  },
  {
    q: { en: "What’s Your Practice Routine for Sliding Window in FAANG Interviews?" },
    level: 'fresher',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Practice Routine" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you practice Sliding Window problems for FAANG interviews?' to gauge your preparation strategy.",
        "Follow-up: 'How do you track progress?'",
        "Deeper: 'How do you simulate interview pressure?'"
      ]},
      { type: 'subheading', en: "Practice Routine" },
      { type: 'ul', items: [
        "Day 1-5: Study basics (fixed vs variable, pointers, state) using this FAQ, solving 1-2 easy problems (e.g., max sum k) daily with dry runs.",
        "Day 6-15: Solve 2-3 medium/hard problems (e.g., LC438, LC76, LC3) daily, coding brute force then optimizing, analyzing complexity, and testing edge cases.",
        "Day 16-20: Tackle variations (negatives, large n, return indices), practice verbal explanations, and do mock interviews with peers or platforms like LeetCode.",
        "Track progress with a spreadsheet of solved problems, noting mistakes, complexities, and revisit frequency; aim for 50+ Sliding Window problems."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Time yourself (30-45 min per problem) to mimic interview pressure."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "Can you solve a new Sliding Window problem?",
        "How do you handle time pressure?"
      ] }
    ]
  }
  // Reached 100+ FAQs with full depth for all concepts and problems.
  // Additional FAQs can be added for specific variations or advanced topics as needed.
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
