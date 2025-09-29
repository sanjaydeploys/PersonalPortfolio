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
    q: { en: "What is the Backtracking Pattern?" },
    level: 'fresher',
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Backtracking Definition" },
      { type: 'ul', items: [
        "The interviewer might ask 'What is backtracking?' to test foundational knowledge.",
        "Follow-up: 'How does it differ from other recursive approaches?'",
        "Deeper: 'What problems does it solve?'"
      ]},
      { type: 'subheading', en: "Backtracking Definition" },
      { type: 'ul', items: [
        "Backtracking: A recursive algorithm that explores all possible solutions by building candidates incrementally and abandoning invalid ones (backtracks).",
        "Key Idea: Try all choices at each step, undo if invalid, continue if promising.",
        "Differs from DFS: Backtracking focuses on solution construction, not graph traversal.",
        "Solves: Permutations (LC46), subsets (LC78), combinations (LC17), constraint satisfaction (LC51)."
      ]},
      { type: 'ascii', ascii: `
LC46: nums=[1,2]
Choices: [1,_] -> [1,2]
         [2,_] -> [2,1]
Backtrack: Try 1, add 2, valid -> save; undo, try 2, add 1, valid -> save
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Explain backtracking as 'try, explore, undo' for clarity."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How does backtracking work?",
        "What are choice points?"
      ] }
    ]
  },
  {
    q: { en: "How Does Backtracking Work?" },
    level: 'fresher',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Backtracking Mechanics" },
      { type: 'ul', items: [
        "The interviewer might ask 'Can you explain how backtracking works?' to test understanding.",
        "Follow-up: 'What’s the role of recursion?'",
        "Deeper: 'How do you ensure correctness?'"
      ]},
      { type: 'subheading', en: "Backtracking Mechanics" },
      { type: 'ul', items: [
        "Steps: Choose (make a decision), Explore (recurse), Undo (backtrack if invalid).",
        "Recursion builds partial solutions, backtracking undoes invalid choices.",
        "State: Track current solution (e.g., array in LC46) and constraints (e.g., used elements).",
        "Correctness: Ensure all valid solutions are explored via systematic choice enumeration."
      ]},
      { type: 'codeBlock', codeBlock: `
function backtrack(state, choices, result) {
  if (isSolution(state)) {
    result.push([...state]);
    return;
  }
  for (let choice of choices) {
    if (isValid(choice, state)) {
      makeChoice(choice, state);
      backtrack(state, choices, result);
      undoChoice(choice, state);
    }
  }
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Use a generic template to explain backtracking."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What are choice points?",
        "What’s the state space?"
      ] }
    ]
  },
  {
    q: { en: "What are Choice Points in Backtracking?" },
    level: 'fresher',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Choice Points" },
      { type: 'ul', items: [
        "The interviewer might ask 'What are choice points in backtracking?' to test decision-making understanding.",
        "Follow-up: 'How do you model choices?'",
        "Deeper: 'How do you reduce choices?'"
      ]},
      { type: 'subheading', en: "Choice Points" },
      { type: 'ul', items: [
        "Choice Points: Decision points where multiple options are available (e.g., picking a number in LC46, a letter in LC17).",
        "Modeling: Represent choices as loops (e.g., for each digit in LC17) or conditionals.",
        "Reduction: Prune invalid choices (e.g., skip used numbers in LC46, invalid queen placements in LC51)."
      ]},
      { type: 'ascii', ascii: `
LC17: digits="23"
Choice at pos 0: 'a','b','c' (for 2)
Choice at pos 1: 'd','e','f' (for 3)
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "List choices explicitly to clarify logic."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What’s the state space?",
        "How do you handle recursion stack?"
      ] }
    ]
  },
  {
    q: { en: "What is the State Space in Backtracking?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: State Space" },
      { type: 'ul', items: [
        "The interviewer might ask 'What is the state space in backtracking?' to test solution exploration.",
        "Follow-up: 'How does it affect complexity?'",
        "Deeper: 'How do you optimize state space?'"
      ]},
      { type: 'subheading', en: "State Space" },
      { type: 'ul', items: [
        "State Space: All possible partial and complete solutions explored (e.g., all permutations in LC46, 2^n subsets in LC78).",
        "Size: Exponential (O(n!) for LC46, O(2^n) for LC78, O(4^n) for LC17).",
        "Optimization: Prune invalid states (e.g., LC51: invalid queen placements).",
        "Impact: Determines time complexity; large state spaces require pruning."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Explain state space to show problem scale."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle recursion stack?",
        "What is pruning in backtracking?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle the Recursion Stack in Backtracking?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Recursion Stack" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you manage recursion stack in backtracking?' to test space complexity.",
        "Follow-up: 'What’s the stack depth?'",
        "Deeper: 'How do you avoid stack overflow?'"
      ]},
      { type: 'subheading', en: "Recursion Stack Handling" },
      { type: 'ul', items: [
        "Stack Depth: O(n) for LC46 (permutation length), LC78 (subset depth), LC51 (board rows).",
        "Avoid Overflow: Constraints ensure n ≤ 20 (LC17, LC78) or n ≤ 9 (LC51), safe for JS.",
        "Optimize: Use in-place modifications (LC46 swap) to reduce state copies.",
        "Track state explicitly (e.g., used array in LC46) to avoid deep copies."
      ]},
      { type: 'codeBlock', codeBlock: `
function permute(nums) {
  const result = [];
  backtrack([], nums, result);
  return result;
}
function backtrack(curr, nums, result) {
  if (curr.length === nums.length) {
    result.push([...curr]);
    return;
  }
  for (let num of nums) {
    if (!curr.includes(num)) { // O(n) check
      curr.push(num);
      backtrack(curr, nums, result);
      curr.pop();
    }
  }
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Mention stack depth in interviews."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What is pruning in backtracking?",
        "How do you recognize backtracking problems?"
      ] }
    ]
  },
  {
    q: { en: "What is Pruning in Backtracking?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Pruning" },
      { type: 'ul', items: [
        "The interviewer might ask 'What is pruning in backtracking?' to test optimization.",
        "Follow-up: 'How does it reduce complexity?'",
        "Deeper: 'What are pruning examples?'"
      ]},
      { type: 'subheading', en: "Pruning in Backtracking" },
      { type: 'ul', items: [
        "Pruning: Skipping invalid branches early to reduce state space exploration.",
        "Examples: LC51 (avoid invalid queen placements), LC46 (skip used numbers), LC17 (limit to valid letters).",
        "Impact: Reduces effective time complexity (e.g., LC51 from O(n^n) to O(n!) with checks).",
        "Techniques: Constraint checks, early termination, symmetry."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Highlight pruning to show optimization skills."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you recognize backtracking problems?",
        "What are backtracking constraints?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Recognize Backtracking Problems in Interviews?" },
    level: 'intermediate',
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Recognition Cues" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you know when to use backtracking?' to test pattern recognition.",
        "Follow-up: 'What are common cues?'",
        "Deeper: 'How do you differentiate from other patterns?'"
      ]},
      { type: 'subheading', en: "Recognition Cues" },
      { type: 'ul', items: [
        "Cues: 'All possible' (permutations, subsets, combinations), constraints (LC51 no-attack queens), or combinatorial search.",
        "Keywords: 'Generate all,' 'find all solutions,' 'place without conflict.'",
        "Differentiate: Unlike Two-Pointer (sorted arrays, sums), backtracking explores exponential state spaces.",
        "Examples: LC17 (combinations), LC46 (permutations), LC78 (subsets), LC51 (constraint satisfaction)."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Look for 'all possible' to spot backtracking."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What are backtracking constraints?",
        "How do you handle interviewer hints?"
      ] }
    ]
  },
  {
    q: { en: "What are Backtracking Constraints?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Constraints" },
      { type: 'ul', items: [
        "The interviewer might ask 'What constraints guide backtracking?' to test problem analysis.",
        "Follow-up: 'How do constraints affect pruning?'",
        "Deeper: 'How do you model constraints?'"
      ]},
      { type: 'subheading', en: "Backtracking Constraints" },
      { type: 'ul', items: [
        "Constraints: Rules defining valid solutions (e.g., LC46: unique numbers, LC51: no queens attack, LC17: valid letters per digit).",
        "Pruning: Use constraints to skip invalid branches (e.g., LC51: check diagonals).",
        "Modeling: Boolean checks (e.g., isValidQueen in LC51) or used arrays (LC46).",
        "Impact: Reduces state space, improves efficiency."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Clarify constraints early to optimize pruning."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle interviewer hints?",
        "What’s the time complexity of backtracking?"
      ] }
    ]
  },
  {
    q: { en: "What’s the Time Complexity of Backtracking?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Time Complexity" },
      { type: 'ul', items: [
        "The interviewer might ask 'What’s the time complexity of backtracking?' to test analysis.",
        "Follow-up: 'How does pruning affect it?'",
        "Deeper: 'How do you estimate for specific problems?'"
      ]},
      { type: 'subheading', en: "Time Complexity" },
      { type: 'ul', items: [
        "General: O(n!) for permutations (LC46), O(2^n) for subsets (LC78), O(4^n) for letter combinations (LC17).",
        "Pruning: Reduces effective complexity (e.g., LC51 from O(n^n) to O(n!) with diagonal checks).",
        "Estimation: Count choices per step (e.g., LC46: n choices for first position, n-1 for second, etc.).",
        "Output: Include output size (e.g., O(n * n!) for LC46 to copy permutations)."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Derive complexity step-by-step in interviews."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle interviewer hints?",
        "What’s the space complexity?"
      ] }
    ]
  },
  {
    q: { en: "What’s the Space Complexity of Backtracking?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Space Complexity" },
      { type: 'ul', items: [
        "The interviewer might ask 'What’s the space complexity of backtracking?' to test resource awareness.",
        "Follow-up: 'How do you optimize space?'",
        "Deeper: 'How does in-place modification help?'"
      ]},
      { type: 'subheading', en: "Space Complexity" },
      { type: 'ul', items: [
        "Recursion Stack: O(n) for LC46, LC78, LC17, LC51 (depth of recursion).",
        "State Storage: O(n) for partial solutions (e.g., current permutation in LC46).",
        "Output: O(n * n!) for LC46, O(n * 2^n) for LC78, excluded from auxiliary space.",
        "Optimization: In-place swaps (LC46) reduce state copies to O(1) auxiliary."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Use in-place modifications for space efficiency."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle interviewer hints?",
        "How do you model choices in LC17?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Interviewer Hints in Backtracking?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Interviewer Hints" },
      { type: 'ul', items: [
        "The interviewer might ask 'What if I suggest pruning?' to test adaptability.",
        "Follow-up: 'How do you incorporate hints?'",
        "Deeper: 'What if they suggest an iterative approach?'"
      ]},
      { type: 'subheading', en: "Handling Hints" },
      { type: 'ul', items: [
        "Hint: 'Can you prune?' -> Add constraint checks (e.g., LC51 diagonal checks).",
        "Hint: 'Try iterative?' -> Explore bitmask (LC78) or queue-based (LC17).",
        "Hint: 'Optimize space?' -> Use in-place swaps (LC46) or reduce state copies.",
        "Clarify constraints to align with hints."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Verbalize how hints improve your solution."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you model choices in LC17?",
        "What’s the approach for LC46?"
      ] }
    ]
  },
  // LC17: Letter Combinations of a Phone Number
  {
    q: { en: "What is the Approach to Solve LC17 (Letter Combinations)?" },
    level: 'intermediate',
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: LC17 Approach" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you solve LC17?' to test backtracking application.",
        "Follow-up: 'What’s the complexity?'",
        "Deeper: 'How do you optimize it?'"
      ]},
      { type: 'subheading', en: "LC17 Approach" },
      { type: 'ul', items: [
        "Problem: Given digits (e.g., '23'), return all letter combinations (e.g., ['ad','ae','af',...]).",
        "Backtracking: For each digit, choose a letter, recurse, undo.",
        "Map: { '2': 'abc', '3': 'def', ... } for digit-to-letter mapping.",
        "Time: O(4^n) (max 4 letters per digit), Space: O(n) for recursion stack."
      ]},
      { type: 'codeBlock', codeBlock: `
function letterCombinations(digits) {
  if (!digits) return [];
  const map = { '2': 'abc', '3': 'def', '4': 'ghi', '5': 'jkl', '6': 'mno', '7': 'pqrs', '8': 'tuv', '9': 'wxyz' };
  const result = [];
  backtrack('', 0, digits, map, result);
  return result;
}
function backtrack(curr, pos, digits, map, result) {
  if (pos === digits.length) {
    result.push(curr);
    return;
  }
  for (let char of map[digits[pos]]) {
    backtrack(curr + char, pos + 1, digits, map, result);
  }
}
      ` },
      { type: 'ascii', ascii: `
digits="23"
curr="", pos=0: choose 'a' -> curr="a", pos=1: choose 'd' -> "ad" (save)
curr="a", pos=1: choose 'e' -> "ae" (save)
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Practice LC17 to master choice modeling."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you model choices in LC17?",
        "How do you handle edge cases in LC17?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Model Choices in LC17?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: LC17 Choice Modeling" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you model choices in LC17?' to test decision structure.",
        "Follow-up: 'How do you ensure all combinations?'",
        "Deeper: 'How do you optimize choice exploration?'"
      ]},
      { type: 'subheading', en: "LC17 Choice Modeling" },
      { type: 'ul', items: [
        "Choices: For each digit, select from its letters (e.g., '2' → 'abc').",
        "Loop through map[digit] to explore all letters.",
        "Ensure completeness: Recurse for each letter, backtrack to try next.",
        "Optimization: No pruning needed due to fixed choices per digit."
      ]},
      { type: 'codeBlock', codeBlock: `
function backtrack(curr, pos, digits, map, result) {
  if (pos === digits.length) {
    result.push(curr);
    return;
  }
  for (let char of map[digits[pos]]) { // Choices for current digit
    backtrack(curr + char, pos + 1, digits, map, result);
  }
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Explain choice loops clearly in interviews."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle edge cases in LC17?",
        "What’s an alternative approach to LC17?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Edge Cases in LC17?" },
    level: 'fresher',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: LC17 Edge Cases" },
      { type: 'ul', items: [
        "The interviewer might ask 'What edge cases do you handle in LC17?' to test robustness.",
        "Follow-up: 'How do you validate input?'",
        "Deeper: 'What if digits include invalid characters?'"
      ]},
      { type: 'subheading', en: "LC17 Edge Cases" },
      { type: 'ul', items: [
        "Empty digits: Return [] (no combinations possible).",
        "Single digit: Return all letters for that digit (e.g., '2' → ['a','b','c']).",
        "Invalid digits: LC17 constraints ensure digits are '2'-'9', so no validation needed.",
        "Large n: n ≤ 4 ensures O(4^n) is manageable."
      ]},
      { type: 'codeBlock', codeBlock: `
function letterCombinations(digits) {
  if (!digits) return []; // Edge case
  // Proceed with backtracking
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Check empty input first in LC17."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What’s an alternative approach to LC17?",
        "How do you optimize LC17?"
      ] }
    ]
  },
  {
    q: { en: "What’s an Alternative Approach to LC17?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: LC17 Alternatives" },
      { type: 'ul', items: [
        "The interviewer might ask 'Can you solve LC17 without backtracking?' to test versatility.",
        "Follow-up: 'What’s the complexity difference?'",
        "Deeper: 'When is the alternative better?'"
      ]},
      { type: 'subheading', en: "LC17 Alternative Approach" },
      { type: 'ul', items: [
        "BFS Queue: Build combinations level-by-level (per digit).",
        "Queue stores partial combinations, append letters for next digit.",
        "Time: O(4^n), Space: O(4^n) for queue vs. O(n) for backtracking.",
        "Backtracking preferred for simplicity and lower space."
      ]},
      { type: 'codeBlock', codeBlock: `
function letterCombinations(digits) {
  if (!digits) return [];
  const map = { '2': 'abc', '3': 'def', '4': 'ghi', '5': 'jkl', '6': 'mno', '7': 'pqrs', '8': 'tuv', '9': 'wxyz' };
  let queue = [''];
  for (let digit of digits) {
    const newQueue = [];
    for (let str of queue) {
      for (let char of map[digit]) {
        newQueue.push(str + char);
      }
    }
    queue = newQueue;
  }
  return queue;
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Mention BFS for LC17 in senior interviews."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you optimize LC17?",
        "What’s the approach for LC46?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Optimize LC17?" },
    level: 'senior',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: LC17 Optimization" },
      { type: 'ul', items: [
        "The interviewer might ask 'How can you optimize LC17?' to test efficiency.",
        "Follow-up: 'Is pruning possible?'",
        "Deeper: 'How do you handle large outputs?'"
      ]},
      { type: 'subheading', en: "LC17 Optimization" },
      { type: 'ul', items: [
        "No pruning: All combinations are valid (no constraints to skip).",
        "Space: Use string concatenation efficiently, avoid deep copies.",
        "Output: Stream results with generator for large n.",
        "Time: O(4^n) is optimal due to exponential output size."
      ]},
      { type: 'codeBlock', codeBlock: `
function* letterCombinationsGenerator(digits) {
  if (!digits) return;
  const map = { '2': 'abc', '3': 'def', '4': 'ghi', '5': 'jkl', '6': 'mno', '7': 'pqrs', '8': 'tuv', '9': 'wxyz' };
  function* backtrack(curr, pos) {
    if (pos === digits.length) {
      yield curr;
      return;
    }
    for (let char of map[digits[pos]]) {
      yield* backtrack(curr + char, pos + 1);
    }
  }
  yield* backtrack('', 0);
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Use generators for large outputs in LC17."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What’s the approach for LC46?",
        "How do you handle duplicates in LC46?"
      ] }
    ]
  },
  // LC46: Permutations
  {
    q: { en: "What is the Approach to Solve LC46 (Permutations)?" },
    level: 'intermediate',
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: LC46 Approach" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you solve LC46?' to test permutation logic.",
        "Follow-up: 'What’s the complexity?'",
        "Deeper: 'How do you handle duplicates?'"
      ]},
      { type: 'subheading', en: "LC46 Approach" },
      { type: 'ul', items: [
        "Problem: Given nums (e.g., [1,2,3]), return all permutations (e.g., [[1,2,3], [1,3,2], ...]).",
        "Backtracking: Choose a number, recurse, undo (swap or build array).",
        "Swap: In-place swaps, O(n!) time, O(1) auxiliary space.",
        "Build: Use array, O(n!) time, O(n) space for state."
      ]},
      { type: 'codeBlock', codeBlock: `
function permute(nums) {
  const result = [];
  backtrack(0, nums, result);
  return result;
}
function backtrack(start, nums, result) {
  if (start === nums.length) {
    result.push([...nums]);
    return;
  }
  for (let i = start; i < nums.length; i++) {
    [nums[start], nums[i]] = [nums[i], nums[start]]; // Swap
    backtrack(start + 1, nums, result);
    [nums[start], nums[i]] = [nums[i], nums[start]]; // Undo
  }
}
      ` },
      { type: 'ascii', ascii: `
nums=[1,2]
start=0: swap(0,0)=[1,2] -> start=1: swap(1,1)=[1,2] (save)
start=0: swap(0,1)=[2,1] -> start=1: swap(1,1)=[2,1] (save)
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Practice swap-based LC46 for space efficiency."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle duplicates in LC46?",
        "What’s the swap vs. build approach?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Duplicates in LC46?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: LC46 Duplicates" },
      { type: 'ul', items: [
        "The interviewer might ask 'What if LC46 has duplicates?' to test uniqueness handling.",
        "Follow-up: 'How do you ensure unique permutations?'",
        "Deeper: 'How does it affect complexity?'"
      ]},
      { type: 'subheading', en: "LC46 Duplicate Handling" },
      { type: 'ul', items: [
        "LC46 guarantees distinct numbers, so no duplicates in base problem.",
        "Variation (LC47): Use a set or sort-and-skip to avoid duplicate permutations.",
        "Technique: Track used indices or sort nums and skip identical swaps.",
        "Complexity: Same O(n!) time, O(n) space for tracking."
      ]},
      { type: 'codeBlock', codeBlock: `
function permuteUnique(nums) {
  nums.sort((a, b) => a - b);
  const result = [];
  backtrack(0, nums, result, new Set());
  return result;
}
function backtrack(start, nums, result, used) {
  if (start === nums.length) {
    result.push([...nums]);
    return;
  }
  for (let i = start; i < nums.length; i++) {
    if (i > start && nums[i] === nums[i - 1]) continue; // Skip duplicates
    if (!used.has(i)) {
      used.add(i);
      [nums[start], nums[i]] = [nums[i], nums[start]];
      backtrack(start + 1, nums, result, used);
      [nums[start], nums[i]] = [nums[i], nums[start]];
      used.delete(i);
    }
  }
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Practice LC47 to handle duplicates."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What’s the swap vs. build approach?",
        "How do you handle edge cases in LC46?"
      ] }
    ]
  },
  {
    q: { en: "What’s the Swap vs. Build Approach in LC46?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: LC46 Swap vs. Build" },
      { type: 'ul', items: [
        "The interviewer might ask 'What’s the difference between swap and build in LC46?' to test approach trade-offs.",
        "Follow-up: 'Which is better?'",
        "Deeper: 'How does it affect space complexity?'"
      ]},
      { type: 'subheading', en: "Swap vs. Build" },
      { type: 'ul', items: [
        "Swap: In-place swaps (modify nums array), O(n!) time, O(1) auxiliary space.",
        "Build: Use array to build permutations, O(n!) time, O(n) space for state.",
        "Swap better for space; build clearer for coding and debugging.",
        "Both ensure all permutations via systematic choice exploration."
      ]},
      { type: 'codeBlock', codeBlock: `
function permuteBuild(nums) {
  const result = [];
  backtrack([], nums, result);
  return result;
}
function backtrack(curr, remaining, result) {
  if (curr.length === remaining.length) {
    result.push([...curr]);
    return;
  }
  for (let num of remaining) {
    if (!curr.includes(num)) {
      curr.push(num);
      backtrack(curr, remaining, result);
      curr.pop();
    }
  }
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Use swap for space-efficient interviews."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle edge cases in LC46?",
        "How do you optimize LC46?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Edge Cases in LC46?" },
    level: 'fresher',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: LC46 Edge Cases" },
      { type: 'ul', items: [
        "The interviewer might ask 'What edge cases do you handle in LC46?' to test robustness.",
        "Follow-up: 'How do you handle small inputs?'",
        "Deeper: 'What if nums is empty?'"
      ]},
      { type: 'subheading', en: "LC46 Edge Cases" },
      { type: 'ul', items: [
        "Empty array: Return [[]] (one empty permutation).",
        "Single element: Return [[num]] (one permutation).",
        "n=1 to 6: Constraints ensure O(n!) is manageable.",
        "No duplicates: LC46 guarantees distinct numbers."
      ]},
      { type: 'codeBlock', codeBlock: `
function permute(nums) {
  if (nums.length === 0) return [[]]; // Edge case
  // Proceed with backtracking
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Handle empty input first in LC46."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you optimize LC46?",
        "What are follow-up questions for LC46?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Optimize LC46?" },
    level: 'senior',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: LC46 Optimization" },
      { type: 'ul', items: [
        "The interviewer might ask 'How can you optimize LC46?' to test efficiency.",
        "Follow-up: 'Is pruning possible?'",
        "Deeper: 'How do you handle large outputs?'"
      ]},
      { type: 'subheading', en: "LC46 Optimization" },
      { type: 'ul', items: [
        "No pruning: All permutations are valid (no constraints to skip).",
        "Space: Use swap-based approach for O(1) auxiliary space.",
        "Output: Stream results with generator for large n.",
        "Time: O(n!) is optimal due to permutation count."
      ]},
      { type: 'codeBlock', codeBlock: `
function* permuteGenerator(nums) {
  function* backtrack(start) {
    if (start === nums.length) {
      yield [...nums];
      return;
    }
    for (let i = start; i < nums.length; i++) {
      [nums[start], nums[i]] = [nums[i], nums[start]];
      yield* backtrack(start + 1);
      [nums[start], nums[i]] = [nums[i], nums[start]];
    }
  }
  yield* backtrack(0);
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Use generators for large outputs in LC46."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What are follow-up questions for LC46?",
        "How do you test LC46 solutions?"
      ] }
    ]
  },
  {
    q: { en: "What are Follow-Up Questions for LC46?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: LC46 Follow-Ups" },
      { type: 'ul', items: [
        "The interviewer might ask 'What follow-ups do you expect for LC46?' to test preparedness.",
        "Follow-up: 'How do you handle duplicates?'",
        "Deeper: 'What if you need k-permutations?'"
      ]},
      { type: 'subheading', en: "LC46 Follow-Up Questions" },
      { type: 'ul', items: [
        "Duplicates: Solve LC47 by sorting and skipping identical swaps.",
        "k-Permutations: Modify to generate permutations of length k.",
        "Partial permutations: Stop recursion at k instead of n.",
        "Unique outputs: Use set or skip duplicates for variations."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Practice LC47 and k-permutations for follow-ups."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you test LC46 solutions?",
        "How do you explain LC46 clearly?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Test LC46 Solutions?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: LC46 Testing" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you test your LC46 solution?' to test thoroughness.",
        "Follow-up: 'What test cases do you prioritize?'",
        "Deeper: 'How do you ensure all permutations?'"
      ]},
      { type: 'subheading', en: "LC46 Testing" },
      { type: 'ul', items: [
        "Test small inputs: [1] → [[1]], [1,2] → [[1,2],[2,1]].",
        "Test n=3: [1,2,3] → 6 permutations.",
        "Test edge cases: Empty array → [[]].",
        "Verify count: n! permutations, no duplicates."
      ]},
      { type: 'ascii', ascii: `
nums=[1,2]
Test: [[1,2],[2,1]]
Dry run: start=0, swap(0,0)=[1,2] -> [1,2]
         start=0, swap(0,1)=[2,1] -> [2,1]
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "List test cases before coding LC46."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you explain LC46 clearly?",
        "What’s the revision routine for backtracking?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Explain LC46 Clearly in Interviews?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: LC46 Explanation" },
      { type: 'ul', items: [
        "The interviewer might ask 'Can you explain your LC46 solution clearly?' to test communication.",
        "Follow-up: 'How do you simplify permutation logic?'",
        "Deeper: 'How do you handle follow-ups?'"
      ]},
      { type: 'subheading', en: "LC46 Explanation" },
      { type: 'ul', items: [
        "Break down: Problem, brute force (all permutations), backtracking (swap or build), code steps.",
        "Use example: [1,2] → [[1,2],[2,1]], show swap steps.",
        "Draw recursion tree: Show choices at each position.",
        "Address follow-ups by extending to duplicates or k-permutations."
      ]},
      { type: 'ascii', ascii: `
nums=[1,2]
Tree: [] -> [1] -> [1,2]
         -> [2] -> [2,1]
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Draw recursion tree for LC46 in interviews."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What’s the revision routine for backtracking?",
        "How do you handle large inputs in LC46?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Large Inputs in LC46?" },
    level: 'senior',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: LC46 Large Inputs" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you handle large inputs in LC46?' to test scalability.",
        "Follow-up: 'How do you manage output size?'",
        "Deeper: 'How do you optimize for large n?'"
      ]},
      { type: 'subheading', en: "LC46 Large Input Handling" },
      { type: 'ul', items: [
        "Constraints: n ≤ 6 ensures O(n!) is manageable (720 permutations max).",
        "Output: Stream permutations with generator to handle large result sets.",
        "Space: Use swap-based approach for O(1) auxiliary space.",
        "Time: O(n!) unavoidable due to permutation count."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Test with n=4 to verify LC46 scalability."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What’s the revision routine for backtracking?",
        "How do you apply backtracking to LC78?"
      ] }
    ]
  },
  // Cross-Cutting Concepts
  {
    q: { en: "How Do You Ensure Correctness in Backtracking Solutions?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Correctness" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you ensure backtracking solutions are correct?' to test rigor.",
        "Follow-up: 'What tests do you run?'",
        "Deeper: 'How do you prove completeness?'"
      ]},
      { type: 'subheading', en: "Ensuring Correctness" },
      { type: 'ul', items: [
        "Verify all choices are explored (e.g., all letters in LC17, all swaps in LC46).",
        "Check constraints (e.g., LC51: no queens attack).",
        "Test edge cases: Empty inputs, single elements, max n.",
        "Prove completeness: Recursion covers all state space branches."
      ]},
      { type: 'ascii', ascii: `
LC46: nums=[1]
Backtrack: [] -> [1] (save)
All branches explored: [1]
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Dry run small inputs to verify correctness."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What’s the revision routine for backtracking?",
        "How do you handle backtracking follow-ups?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Backtracking Follow-Up Questions?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Backtracking Follow-Ups" },
      { type: 'ul', items: [
        "The interviewer might ask 'What follow-ups do you expect for backtracking?' to test adaptability.",
        "Follow-up: 'How do you extend to variations?'",
        "Deeper: 'How do you handle new constraints?'"
      ]},
      { type: 'subheading', en: "Backtracking Follow-Ups" },
      { type: 'ul', items: [
        "Duplicates: Sort and skip (LC47 for LC46).",
        "k-Combinations: Modify recursion depth (e.g., k-permutations).",
        "New constraints: Add pruning (e.g., LC51 additional rules).",
        "Iterative: Explore bitmask or queue-based approaches."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Practice common follow-ups like LC47."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What’s the revision routine for backtracking?",
        "How do you optimize backtracking space?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Optimize Backtracking Space Usage?" },
    level: 'senior',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Space Optimization" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you optimize space in backtracking?' to test efficiency.",
        "Follow-up: 'How does in-place modification help?'",
        "Deeper: 'How do you handle large outputs?'"
      ]},
      { type: 'subheading', en: "Space Optimization" },
      { type: 'ul', items: [
        "In-Place: Use swaps (LC46) or bitsets (LC51) for O(1) auxiliary space.",
        "Avoid Copies: Modify state directly (e.g., LC17 string concat).",
        "Stream Outputs: Use generators for large result sets (LC46, LC78).",
        "Track Used: Use boolean arrays or sets instead of deep copies."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Highlight in-place techniques in senior interviews."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What’s the revision routine for backtracking?",
        "How do you handle large state spaces?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Large State Spaces in Backtracking?" },
    level: 'senior',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Large State Spaces" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you handle large state spaces in backtracking?' to test scalability.",
        "Follow-up: 'How does pruning help?'",
        "Deeper: 'How do you estimate state space size?'"
      ]},
      { type: 'subheading', en: "Large State Space Handling" },
      { type: 'ul', items: [
        "Pruning: Skip invalid branches (e.g., LC51 diagonal checks).",
        "Constraints: LC17 (n ≤ 4), LC46 (n ≤ 6), LC78 (n ≤ 20) limit state space.",
        "Estimation: O(n!) for LC46, O(2^n) for LC78, O(4^n) for LC17.",
        "Optimization: Use symmetry (LC51) or early termination."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Test with max constraints to verify scalability."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What’s the revision routine for backtracking?",
        "How do you prioritize backtracking problems?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Prioritize Backtracking Problems for Practice?" },
    level: 'fresher',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Problem Prioritization" },
      { type: 'ul', items: [
        "The interviewer might ask 'Which backtracking problems should you practice first?' to test preparation.",
        "Follow-up: 'Why prioritize these?'",
        "Deeper: 'How do you build intuition?'"
      ]},
      { type: 'subheading', en: "Problem Prioritization" },
      { type: 'ul', items: [
        "Start with LC17: Simple choice modeling, no pruning needed.",
        "Move to LC46: Learn permutations with swap or build.",
        "Tackle LC78: Master include/exclude for subsets.",
        "Finish with LC51: Complex constraints with pruning."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Practice in order of complexity to build confidence."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What’s the revision routine for backtracking?",
        "How do you simulate interview conditions?"
      ] }
    ]
  },
  {
    q: { en: "What’s the Revision Routine for Backtracking in FAANG Interviews?" },
    level: 'intermediate',
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Revision Routine" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you prepare for backtracking problems?' to test study plan.",
        "Follow-up: 'How often do you revise?'",
        "Deeper: 'How do you ensure retention?'"
      ]},
      { type: 'subheading', en: "Revision Routine" },
      { type: 'ul', items: [
        "Week 1: Learn LC17, LC46 (simple choice modeling, permutations).",
        "Week 2: Master LC78, LC51 (subsets, complex constraints).",
        "Week 3: Practice variations (LC47, k-permutations, bitmask).",
        "Daily: Solve 1-2 problems, explain aloud, test edge cases.",
        "Weekly: Review LC17, LC46, LC78, LC51, compare approaches.",
        "Mock Interviews: Simulate 45-min sessions weekly."
      ]},
      { type: 'ascii', ascii: `
Revision Plan:
Week 1: LC17, LC46 (O(4^n), O(n!))
Week 2: LC78, LC51 (O(2^n), O(n!))
Week 3: Variations, edge cases
Daily: 1-2 problems, explain aloud
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Use LeetCode discussions for backtracking insights."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you simulate interview conditions?",
        "How do you handle stress in backtracking interviews?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Simulate Interview Conditions for Backtracking?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Interview Simulation" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you practice backtracking for interviews?' to test preparation.",
        "Follow-up: 'How do you handle time pressure?'",
        "Deeper: 'How do you mimic FAANG interviews?'"
      ]},
      { type: 'subheading', en: "Simulating Interview Conditions" },
      { type: 'ul', items: [
        "Time yourself: 30-45 min per problem (LC17, LC46, LC78, LC51).",
        "Explain aloud: Verbalize choice points, pruning, recursion.",
        "Use whiteboard/paper: Simulate coding constraints.",
        "Practice with peers: Handle follow-ups and hints."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Record practice sessions to refine explanations."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle stress in backtracking interviews?",
        "How do you build intuition for backtracking?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Stress in Backtracking Interviews?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Stress Handling" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you stay calm solving backtracking problems?' to test composure.",
        "Follow-up: 'What if you get stuck?'",
        "Deeper: 'How do you recover from mistakes?'"
      ]},
      { type: 'subheading', en: "Stress Handling" },
      { type: 'ul', items: [
        "Break problem into steps: Clarify, model choices, recurse, prune.",
        "If stuck: Revert to brute force, then optimize with pruning.",
        "Verbalize thought process to stay focused and engage interviewer.",
        "Practice timed sessions to build confidence."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Breathe and clarify constraints to reduce stress."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you build intuition for backtracking?",
        "How do you debug backtracking solutions?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Build Intuition for Backtracking Problems?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Building Intuition" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you develop intuition for backtracking?' to test learning approach.",
        "Follow-up: 'What patterns do you look for?'",
        "Deeper: 'How do you recognize backtracking applicability?'"
      ]},
      { type: 'subheading', en: "Building Intuition" },
      { type: 'ul', items: [
        "Practice simple problems (LC17) to understand choice modeling.",
        "Visualize recursion trees for LC46, LC78 to see state exploration.",
        "Solve LC51 to master constraint-based pruning.",
        "Look for 'all possible' or constraint keywords."
      ]},
      { type: 'ascii', ascii: `
LC17: digits="2"
Tree: [] -> [a] -> [a]
         -> [b] -> [b]
         -> [c] -> [c]
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Draw recursion trees to internalize logic."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you debug backtracking solutions?",
        "How do you handle large outputs in backtracking?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Debug Backtracking Solutions?" },
    level: 'senior',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Debugging" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you debug a backtracking solution?' to test problem-solving.",
        "Follow-up: 'What common errors do you look for?'",
        "Deeper: 'How do you handle recursive bugs?'"
      ]},
      { type: 'subheading', en: "Debugging Backtracking" },
      { type: 'ul', items: [
        "Trace recursion: Log choices and state (e.g., LC46 swaps, LC17 letters).",
        "Common errors: Missing choices, incorrect pruning, state corruption.",
        "Test small inputs: [1,2] for LC46, '2' for LC17.",
        "Check recursion stack: Ensure undo steps restore state correctly."
      ]},
      { type: 'ascii', ascii: `
LC46: nums=[1,2]
Trace: start=0, swap(0,0)=[1,2] -> [1,2]
       start=0, swap(0,1)=[2,1] -> [2,1]
Error: Missing swap undo -> incorrect permutations
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Log recursion steps to catch bugs."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle large outputs in backtracking?",
        "How do you apply backtracking to LC78?"
      ] }
    ]
  },
  {
    q: { en: "What is the Approach to Solve LC78 (Subsets)?" },
    level: 'intermediate',
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: LC78 Approach" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you solve LC78?' to test subset generation logic.",
        "Follow-up: 'What’s the complexity?'",
        "Deeper: 'How do you handle duplicates?'"
      ]},
      { type: 'subheading', en: "LC78 Approach" },
      { type: 'ul', items: [
        "Problem: Given nums (e.g., [1,2,3]), return all subsets (e.g., [[],[1],[2],[1,2],...]).",
        "Backtracking: For each number, choose to include or exclude, recurse.",
        "Time: O(2^n) (each number has 2 choices), Space: O(n) for recursion stack.",
        "Alternative: Bitmask for iterative solution, same complexity."
      ]},
      { type: 'codeBlock', codeBlock: `
function subsets(nums) {
  const result = [];
  backtrack([], 0, nums, result);
  return result;
}
function backtrack(curr, pos, nums, result) {
  if (pos === nums.length) {
    result.push([...curr]);
    return;
  }
  // Include nums[pos]
  curr.push(nums[pos]);
  backtrack(curr, pos + 1, nums, result);
  curr.pop();
  // Exclude nums[pos]
  backtrack(curr, pos + 1, nums, result);
}
      ` },
      { type: 'ascii', ascii: `
nums=[1,2]
pos=0: [] -> [1] -> [1,2]
               -> [1]
         -> [] -> [2]
               -> []
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Practice include/exclude logic for LC78."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you model choices in LC78?",
        "How do you handle duplicates in LC78?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Model Choices in LC78?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: LC78 Choice Modeling" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you model choices in LC78?' to test decision structure.",
        "Follow-up: 'How do you ensure all subsets?'",
        "Deeper: 'How do you optimize choice exploration?'"
      ]},
      { type: 'subheading', en: "LC78 Choice Modeling" },
      { type: 'ul', items: [
        "Choices: For each number, include or exclude it in the subset.",
        "Recurse twice per position: one with number included, one excluded.",
        "Ensure completeness: Explore both branches for each number.",
        "Optimization: No pruning needed as all subsets are valid."
      ]},
      { type: 'codeBlock', codeBlock: `
function backtrack(curr, pos, nums, result) {
  if (pos === nums.length) {
    result.push([...curr]);
    return;
  }
  curr.push(nums[pos]); // Include
  backtrack(curr, pos + 1, nums, result);
  curr.pop(); // Undo
  backtrack(curr, pos + 1, nums, result); // Exclude
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Explain include/exclude clearly in interviews."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle duplicates in LC78?",
        "What’s an alternative approach to LC78?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Duplicates in LC78?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: LC78 Duplicates" },
      { type: 'ul', items: [
        "The interviewer might ask 'What if LC78 has duplicates?' to test uniqueness handling.",
        "Follow-up: 'How do you ensure unique subsets?'",
        "Deeper: 'How does it affect complexity?'"
      ]},
      { type: 'subheading', en: "LC78 Duplicate Handling" },
      { type: 'ul', items: [
        "LC78 guarantees distinct numbers, but LC90 (Subsets II) handles duplicates.",
        "Sort nums and skip duplicate numbers in exclude branch.",
        "Time: O(2^n), Space: O(n) for recursion stack.",
        "Use set or skip logic to ensure unique subsets."
      ]},
      { type: 'codeBlock', codeBlock: `
function subsetsWithDup(nums) {
  nums.sort((a, b) => a - b);
  const result = [];
  backtrack([], 0, nums, result);
  return result;
}
function backtrack(curr, pos, nums, result) {
  if (pos === nums.length) {
    result.push([...curr]);
    return;
  }
  curr.push(nums[pos]);
  backtrack(curr, pos + 1, nums, result);
  curr.pop();
  while (pos + 1 < nums.length && nums[pos] === nums[pos + 1]) pos++;
  backtrack(curr, pos + 1, nums, result);
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Practice LC90 for duplicate handling."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What’s an alternative approach to LC78?",
        "How do you handle edge cases in LC78?"
      ] }
    ]
  },
  {
    q: { en: "What’s an Alternative Approach to LC78?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: LC78 Alternatives" },
      { type: 'ul', items: [
        "The interviewer might ask 'Can you solve LC78 without backtracking?' to test versatility.",
        "Follow-up: 'What’s the complexity difference?'",
        "Deeper: 'When is the alternative better?'"
      ]},
      { type: 'subheading', en: "LC78 Alternative Approach" },
      { type: 'ul', items: [
        "Bitmask: Use binary numbers (0 to 2^n-1) to represent include/exclude choices.",
        "Each bit indicates whether to include nums[i] (1) or not (0).",
        "Time: O(2^n), Space: O(n) for temporary subset.",
        "Bitmask faster for small n (≤20), iterative, avoids recursion."
      ]},
      { type: 'codeBlock', codeBlock: `
function subsets(nums) {
  const result = [];
  for (let mask = 0; mask < (1 << nums.length); mask++) {
    const subset = [];
    for (let i = 0; i < nums.length; i++) {
      if (mask & (1 << i)) subset.push(nums[i]);
    }
    result.push(subset);
  }
  return result;
}
      ` },
      { type: 'ascii', ascii: `
nums=[1,2]
mask=0: 00 -> []
mask=1: 01 -> [2]
mask=2: 10 -> [1]
mask=3: 11 -> [1,2]
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Use bitmask for LC78 in senior interviews."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle edge cases in LC78?",
        "How do you optimize LC78?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Edge Cases in LC78?" },
    level: 'fresher',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: LC78 Edge Cases" },
      { type: 'ul', items: [
        "The interviewer might ask 'What edge cases do you handle in LC78?' to test robustness.",
        "Follow-up: 'How do you handle empty inputs?'",
        "Deeper: 'What if n is large?'"
      ]},
      { type: 'subheading', en: "LC78 Edge Cases" },
      { type: 'ul', items: [
        "Empty array: Return [[]] (empty subset).",
        "Single element: Return [[], [num]].",
        "n ≤ 20: Ensures O(2^n) is manageable (2^20 ≈ 1M).",
        "No duplicates in LC78; handle in LC90."
      ]},
      { type: 'codeBlock', codeBlock: `
function subsets(nums) {
  if (nums.length === 0) return [[]]; // Edge case
  // Proceed with backtracking
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Handle empty input first in LC78."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you optimize LC78?",
        "What are follow-up questions for LC78?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Optimize LC78?" },
    level: 'senior',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: LC78 Optimization" },
      { type: 'ul', items: [
        "The interviewer might ask 'How can you optimize LC78?' to test efficiency.",
        "Follow-up: 'Is pruning possible?'",
        "Deeper: 'How do you handle large outputs?'"
      ]},
      { type: 'subheading', en: "LC78 Optimization" },
      { type: 'ul', items: [
        "No pruning: All subsets are valid (no constraints).",
        "Space: Use bitmask for iterative solution, O(n) temporary space.",
        "Output: Stream subsets with generator for large n.",
        "Time: O(2^n) is optimal due to subset count."
      ]},
      { type: 'codeBlock', codeBlock: `
function* subsetsGenerator(nums) {
  function* backtrack(curr, pos) {
    if (pos === nums.length) {
      yield [...curr];
      return;
    }
    curr.push(nums[pos]);
    yield* backtrack(curr, pos + 1);
    curr.pop();
    yield* backtrack(curr, pos + 1);
  }
  yield* backtrack([], 0);
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Use generators for large outputs in LC78."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What are follow-up questions for LC78?",
        "How do you test LC78 solutions?"
      ] }
    ]
  },
  {
    q: { en: "What are Follow-Up Questions for LC78?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: LC78 Follow-Ups" },
      { type: 'ul', items: [
        "The interviewer might ask 'What follow-ups do you expect for LC78?' to test preparedness.",
        "Follow-up: 'How do you handle duplicates?'",
        "Deeper: 'What if you need subsets of size k?'"
      ]},
      { type: 'subheading', en: "LC78 Follow-Up Questions" },
      { type: 'ul', items: [
        "Duplicates: Solve LC90 by sorting and skipping.",
        "k-Subsets: Modify recursion to stop at size k (LC77).",
        "Weighted subsets: Include weights in choice logic.",
        "Unique outputs: Use set or skip logic for variations."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Practice LC90 and LC77 for follow-ups."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you test LC78 solutions?",
        "How do you explain LC78 clearly?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Test LC78 Solutions?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: LC78 Testing" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you test your LC78 solution?' to test thoroughness.",
        "Follow-up: 'What test cases do you prioritize?'",
        "Deeper: 'How do you ensure all subsets?'"
      ]},
      { type: 'subheading', en: "LC78 Testing" },
      { type: 'ul', items: [
        "Test small inputs: [1] → [[],[1]], [1,2] → [[],[1],[2],[1,2]].",
        "Test n=3: [1,2,3] → 8 subsets.",
        "Test edge cases: Empty array → [[]].",
        "Verify count: 2^n subsets, no duplicates."
      ]},
      { type: 'ascii', ascii: `
nums=[1]
Test: [[],[1]]
Dry run: pos=0, include=[1] -> [1]
               exclude=[] -> []
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "List test cases before coding LC78."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you explain LC78 clearly?",
        "How do you apply backtracking to LC51?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Explain LC78 Clearly in Interviews?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: LC78 Explanation" },
      { type: 'ul', items: [
        "The interviewer might ask 'Can you explain your LC78 solution clearly?' to test communication.",
        "Follow-up: 'How do you simplify subset logic?'",
        "Deeper: 'How do you handle follow-ups?'"
      ]},
      { type: 'subheading', en: "LC78 Explanation" },
      { type: 'ul', items: [
        "Break down: Problem, brute force (all subsets), backtracking (include/exclude), code steps.",
        "Use example: [1,2] → [[],[1],[2],[1,2]], show include/exclude tree.",
        "Draw recursion tree: Show choices at each position.",
        "Address follow-ups: Duplicates (LC90), k-subsets (LC77)."
      ]},
      { type: 'ascii', ascii: `
nums=[1,2]
Tree: [] -> [1] -> [1,2]
               -> [1]
         -> [] -> [2]
               -> []
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Draw recursion tree for LC78 in interviews."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you apply backtracking to LC51?",
        "How do you handle large inputs in LC78?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Large Inputs in LC78?" },
    level: 'senior',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: LC78 Large Inputs" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you handle large inputs in LC78?' to test scalability.",
        "Follow-up: 'How do you manage output size?'",
        "Deeper: 'How do you optimize for large n?'"
      ]},
      { type: 'subheading', en: "LC78 Large Input Handling" },
      { type: 'ul', items: [
        "Constraints: n ≤ 20 ensures O(2^n) is manageable (2^20 ≈ 1M subsets).",
        "Output: Stream subsets with generator to handle large result sets.",
        "Space: Use bitmask for iterative solution, O(n) temporary space.",
        "Time: O(2^n) unavoidable due to subset count."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Test with n=5 to verify LC78 scalability."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you apply backtracking to LC51?",
        "What’s the bitmask optimization for LC78?"
      ] }
    ]
  },
  // LC51: N-Queens
  {
    q: { en: "What is the Approach to Solve LC51 (N-Queens)?" },
    level: 'intermediate',
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: LC51 Approach" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you solve LC51?' to test constraint-based backtracking.",
        "Follow-up: 'What’s the complexity?'",
        "Deeper: 'How do you optimize pruning?'"
      ]},
      { type: 'subheading', en: "LC51 Approach" },
      { type: 'ul', items: [
        "Problem: Place n queens on n×n board so no two attack (same row, column, diagonal).",
        "Backtracking: Place queen row-by-row, check columns/diagonals for validity.",
        "Time: O(n!) (pruned from O(n^n)), Space: O(n^2) for board or O(n) for state.",
        "Alternative: Bitmask for small n, faster but complex."
      ]},
      { type: 'codeBlock', codeBlock: `
function solveNQueens(n) {
  const result = [];
  const board = Array(n).fill().map(() => Array(n).fill('.'));
  backtrack(0, board, result, new Set(), new Set(), new Set());
  return result;
}
function backtrack(row, board, result, cols, diag1, diag2) {
  if (row === board.length) {
    result.push(board.map(row => row.join('')));
    return;
  }
  for (let col = 0; col < board.length; col++) {
    if (!cols.has(col) && !diag1.has(row + col) && !diag2.has(row - col)) {
      board[row][col] = 'Q';
      cols.add(col);
      diag1.add(row + col);
      diag2.add(row - col);
      backtrack(row + 1, board, result, cols, diag1, diag2);
      board[row][col] = '.';
      cols.delete(col);
      diag1.delete(row + col);
      diag2.delete(row - col);
    }
  }
}
      ` },
      { type: 'ascii', ascii: `
n=4, row=0
Place Q at (0,0): Invalid (diagonal conflict)
Place Q at (0,1): Valid -> recurse to row=1
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Practice LC51 to master constraint pruning."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you model constraints in LC51?",
        "How do you handle edge cases in LC51?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Model Constraints in LC51?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: LC51 Constraints" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you model constraints in LC51?' to test pruning logic.",
        "Follow-up: 'How do you check diagonals?'",
        "Deeper: 'How do you optimize constraint checks?'"
      ]},
      { type: 'subheading', en: "LC51 Constraint Modeling" },
      { type: 'ul', items: [
        "Constraints: No queens in same column, main diagonal (row + col), anti-diagonal (row - col).",
        "Use sets: Track used columns, main diagonals, anti-diagonals.",
        "Check: Before placing queen, verify col, row+col, row-col are unused.",
        "Optimization: Sets provide O(1) checks, reduce invalid branches."
      ]},
      { type: 'codeBlock', codeBlock: `
function isValid(row, col, cols, diag1, diag2) {
  return !cols.has(col) && !diag1.has(row + col) && !diag2.has(row - col);
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Explain diagonal checks clearly in LC51."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle edge cases in LC51?",
        "What’s an alternative approach to LC51?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Edge Cases in LC51?" },
    level: 'fresher',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: LC51 Edge Cases" },
      { type: 'ul', items: [
        "The interviewer might ask 'What edge cases do you handle in LC51?' to test robustness.",
        "Follow-up: 'How do you handle small n?'",
        "Deeper: 'What if n=2 or n=3?'"
      ]},
      { type: 'subheading', en: "LC51 Edge Cases" },
      { type: 'ul', items: [
        "n=1: Return [['Q']] (single queen).",
        "n=2, n=3: Return [] (no valid solutions due to conflicts).",
        "n ≤ 9: Constraints ensure O(n!) is manageable.",
        "Empty board: Not applicable (n ≥ 1)."
      ]},
      { type: 'codeBlock', codeBlock: `
function solveNQueens(n) {
  if (n === 2 || n === 3) return []; // Edge case
  if (n === 1) return [['Q']]; // Edge case
  // Proceed with backtracking
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Handle n=2,3 edge cases first in LC51."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What’s an alternative approach to LC51?",
        "How do you optimize LC51?"
      ] }
    ]
  },
  {
    q: { en: "What’s an Alternative Approach to LC51?" },
    level: 'senior',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: LC51 Alternatives" },
      { type: 'ul', items: [
        "The interviewer might ask 'Can you solve LC51 without backtracking?' to test versatility.",
        "Follow-up: 'What’s the complexity difference?'",
        "Deeper: 'When is the alternative better?'"
      ]},
      { type: 'subheading', en: "LC51 Alternative Approach" },
      { type: 'ul', items: [
        "Bitmask: Use bits to track columns, diagonals; faster for small n (≤12).",
        "Each bit represents a column or diagonal state, updated per row.",
        "Time: O(n!) with better constants, Space: O(n) for bitsets.",
        "Backtracking preferred for clarity and larger n."
      ]},
      { type: 'codeBlock', codeBlock: `
function solveNQueens(n) {
  const result = [];
  backtrack(0, 0, 0, 0, [], n, result);
  return result.map(board => board.map(row => row.join('')));
}
function backtrack(row, cols, diag1, diag2, board, n, result) {
  if (row === n) {
    result.push(board.map(row => [...row]));
    return;
  }
  let avail = (~(cols | diag1 | diag2)) & ((1 << n) - 1);
  while (avail) {
    let col = avail & -avail; // Get rightmost set bit
    avail &= avail - 1; // Clear rightmost bit
    let pos = Math.log2(col);
    board.push(Array(n).fill('.').fill('Q', pos, pos + 1));
    backtrack(row + 1, cols | col, (diag1 | col) << 1, (diag2 | col) >> 1, board, n, result);
    board.pop();
  }
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Discuss bitmask for LC51 in senior interviews."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you optimize LC51?",
        "What are follow-up questions for LC51?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Optimize LC51?" },
    level: 'senior',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: LC51 Optimization" },
      { type: 'ul', items: [
        "The interviewer might ask 'How can you optimize LC51?' to test efficiency.",
        "Follow-up: 'How effective is pruning?'",
        "Deeper: 'How do you handle large outputs?'"
      ]},
      { type: 'subheading', en: "LC51 Optimization" },
      { type: 'ul', items: [
        "Pruning: Check columns, diagonals early to skip invalid placements.",
        "Bitmask: Use bits for O(1) constraint checks, faster for n ≤ 12.",
        "Symmetry: Exploit board symmetry (e.g., mirror solutions) for small n.",
        "Output: Stream boards with generator for large n."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Highlight pruning and bitmask in LC51."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What are follow-up questions for LC51?",
        "How do you test LC51 solutions?"
      ] }
    ]
  },
  {
    q: { en: "What are Follow-Up Questions for LC51?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: LC51 Follow-Ups" },
      { type: 'ul', items: [
        "The interviewer might ask 'What follow-ups do you expect for LC51?' to test preparedness.",
        "Follow-up: 'How do you count solutions?'",
        "Deeper: 'What if queens can attack differently?'"
      ]},
      { type: 'subheading', en: "LC51 Follow-Up Questions" },
      { type: 'ul', items: [
        "Count solutions: Modify LC51 to return count (LC52).",
        "Different attacks: Adjust constraints (e.g., add knight moves).",
        "k-Queens: Place k queens on n×n board, modify recursion depth.",
        "Symmetry: Exploit board symmetry to reduce search space."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Practice LC52 for counting solutions."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you test LC51 solutions?",
        "How do you explain LC51 clearly?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Test LC51 Solutions?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: LC51 Testing" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you test your LC51 solution?' to test thoroughness.",
        "Follow-up: 'What test cases do you prioritize?'",
        "Deeper: 'How do you ensure valid placements?'"
      ]},
      { type: 'subheading', en: "LC51 Testing" },
      { type: 'ul', items: [
        "Test small inputs: n=1 → [['Q']], n=2 → [], n=4 → 2 solutions.",
        "Test constraints: Verify no queens attack (columns, diagonals).",
        "Test edge cases: n=2,3 (no solutions), n=1 (single solution).",
        "Verify count: Match known solutions (e.g., n=4 has 2 solutions)."
      ]},
      { type: 'ascii', ascii: `
n=4
Test: [".Q..","...Q","Q...","..Q."] (valid)
Check: No queens in same col, diag1, diag2
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Test n=4 to verify LC51 correctness."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you explain LC51 clearly?",
        "How do you handle large inputs in LC51?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Explain LC51 Clearly in Interviews?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: LC51 Explanation" },
      { type: 'ul', items: [
        "The interviewer might ask 'Can you explain your LC51 solution clearly?' to test communication.",
        "Follow-up: 'How do you simplify constraint logic?'",
        "Deeper: 'How do you handle follow-ups?'"
      ]},
      { type: 'subheading', en: "LC51 Explanation" },
      { type: 'ul', items: [
        "Break down: Problem, constraints (columns, diagonals), backtracking (row-by-row), code steps.",
        "Use example: n=4, show queen placement and pruning.",
        "Draw board: Visualize valid/invalid placements.",
        "Address follow-ups: Counting (LC52), symmetry."
      ]},
      { type: 'ascii', ascii: `
n=4
Board: .Q..  (row=0, col=1)
       ...Q  (row=1, col=3)
       Q...  (row=2, col=0)
       ..Q.  (row=3, col=2)
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Draw board for LC51 in interviews."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle large inputs in LC51?",
        "What’s the bitmask optimization for LC51?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Large Inputs in LC51?" },
    level: 'senior',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: LC51 Large Inputs" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you handle large inputs in LC51?' to test scalability.",
        "Follow-up: 'How do you manage output size?'",
        "Deeper: 'How do you optimize for large n?'"
      ]},
      { type: 'subheading', en: "LC51 Large Input Handling" },
      { type: 'ul', items: [
        "Constraints: n ≤ 9 ensures O(n!) is manageable.",
        "Output: Stream boards with generator to handle large result sets.",
        "Space: Use bitmask for O(n) space vs. O(n^2) for board.",
        "Time: Optimize pruning with O(1) set or bit checks."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Test with n=8 to verify LC51 scalability."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What’s the bitmask optimization for LC51?",
        "How do you optimize pruning in LC51?"
      ] }
    ]
  },
  // Cross-Cutting Concepts
  {
    q: { en: "What is the Bitmask Optimization for Backtracking?" },
    level: 'senior',
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Bitmask Optimization" },
      { type: 'ul', items: [
        "The interviewer might ask 'How does bitmask optimize backtracking?' to test advanced techniques.",
        "Follow-up: 'When is bitmask better?'",
        "Deeper: 'How do you implement it for LC78/LC51?'"
      ]},
      { type: 'subheading', en: "Bitmask Optimization" },
      { type: 'ul', items: [
        "Bitmask: Use bits to represent choices (LC78: include/exclude, LC51: columns/diagonals).",
        "LC78: Each bit in 0 to 2^n-1 represents a subset, O(2^n) time.",
        "LC51: Bits track used columns, diagonals, O(n!) with faster checks.",
        "Advantage: Iterative (LC78) or faster constants (LC51) for small n."
      ]},
      { type: 'ascii', ascii: `
LC78: nums=[1,2]
mask=0: 00 -> []
mask=1: 01 -> [2]
mask=2: 10 -> [1]
mask=3: 11 -> [1,2]
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Discuss bitmask for LC78/LC51 in senior interviews."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you optimize pruning in LC51?",
        "How do you handle memoization in backtracking?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Optimize Pruning in LC51?" },
    level: 'senior',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: LC51 Pruning" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you optimize pruning in LC51?' to test efficiency.",
        "Follow-up: 'What pruning techniques work best?'",
        "Deeper: 'How do you exploit symmetry?'"
      ]},
      { type: 'subheading', en: "LC51 Pruning Optimization" },
      { type: 'ul', items: [
        "Early Checks: Validate columns, diagonals before recursion.",
        "Bitmask: Use bits for O(1) constraint checks.",
        "Symmetry: For even n, mirror solutions to halve search space.",
        "Avoid Redundant Work: Skip invalid columns early."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Mention symmetry in LC51 for advanced interviews."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle memoization in backtracking?",
        "How do you handle dynamic updates in backtracking?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Memoization in Backtracking?" },
    level: 'senior',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Memoization" },
      { type: 'ul', items: [
        "The interviewer might ask 'Can you use memoization in backtracking?' to test DP knowledge.",
        "Follow-up: 'When does it apply?'",
        "Deeper: 'How do you implement it?'"
      ]},
      { type: 'subheading', en: "Memoization in Backtracking" },
      { type: 'ul', items: [
        "Applicable: When subproblems overlap (rare in LC17, LC46, LC78, LC51).",
        "Example: If LC78 had constraints (e.g., sum of subsets), memoize by state (pos, sum).",
        "Implementation: Use hash map to cache state → result.",
        "Impact: Reduces time for overlapping subproblems, increases space."
      ]},
      { type: 'codeBlock', codeBlock: `
function subsetsWithSum(nums, target) {
  const memo = new Map();
  function backtrack(pos, sum, curr) {
    if (sum === target) return [curr];
    if (pos === nums.length || sum > target) return [];
    const key = \`\${pos},\${sum}\`;
    if (memo.has(key)) return memo.get(key);
    const result = [];
    result.push(...backtrack(pos + 1, sum + nums[pos], [...curr, nums[pos]]));
    result.push(...backtrack(pos + 1, sum, curr));
    memo.set(key, result);
    return result;
  }
  return backtrack(0, 0, []);
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Discuss memoization for constrained backtracking."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle dynamic updates in backtracking?",
        "How do you parallelize backtracking?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Dynamic Updates in Backtracking?" },
    level: 'senior',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Dynamic Updates" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you handle dynamic updates in backtracking?' to test adaptability.",
        "Follow-up: 'How do you maintain state?'",
        "Deeper: 'How do you optimize for frequent updates?'"
      ]},
      { type: 'subheading', en: "Dynamic Updates Handling" },
      { type: 'ul', items: [
        "Use persistent data structure (e.g., immutable state) to track changes.",
        "Recompute affected branches: Update nums (LC78) or board (LC51).",
        "Optimization: Cache partial solutions, update incrementally.",
        "Time: O(2^n) for LC78, O(n!) for LC51 per update; Space: O(n)."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Discuss dynamic updates for system design interviews."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you parallelize backtracking?",
        "How do you handle large outputs in backtracking?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Parallelize Backtracking?" },
    level: 'senior',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Parallelization" },
      { type: 'ul', items: [
        "The interviewer might ask 'Can you parallelize backtracking?' to test system design.",
        "Follow-up: 'What’s the complexity impact?'",
        "Deeper: 'How do you handle synchronization?'"
      ]},
      { type: 'subheading', en: "Parallelizing Backtracking" },
      { type: 'ul', items: [
        "Partition state space: Assign branches (e.g., LC78 subsets, LC51 rows) to threads.",
        "LC78: Split 0 to 2^n-1 bitmasks across threads.",
        "LC51: Assign starting columns in row 0 to threads.",
        "Time: O(2^n/p) for LC78, O(n!/p) for LC51 with p threads; Space: O(n) per thread."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Mention parallelization for senior interviews."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle large outputs in backtracking?",
        "How do you handle ambiguous requirements?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Large Outputs in Backtracking?" },
    level: 'senior',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Large Outputs" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you handle large outputs in backtracking?' to test scalability.",
        "Follow-up: 'How do you reduce memory usage?'",
        "Deeper: 'How do you stream results?'"
      ]},
      { type: 'subheading', en: "Large Output Handling" },
      { type: 'ul', items: [
        "Stream: Use generators for LC78 (O(2^n)), LC46 (O(n!)), LC51 (O(n!)).",
        "Memory: Store only current state, avoid keeping all results in memory.",
        "Optimization: Prune early (LC51), use bitmask (LC78, LC51).",
        "Constraints: n ≤ 20 (LC78), n ≤ 9 (LC51) limit output size."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Use generators for large outputs in interviews."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle ambiguous requirements?",
        "How do you validate backtracking solutions?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Ambiguous Requirements in Backtracking?" },
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
        "Ask: Are duplicates allowed? (LC78, LC46). Are constraints strict? (LC51).",
        "Assume defaults: Unique solutions (LC78), all permutations (LC46).",
        "Propose backtracking, adjust pruning based on clarifications.",
        "Adapt: Add constraints (e.g., LC51 new attack rules) or switch to bitmask."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "List clarifying questions before coding."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you validate backtracking solutions?",
        "How do you optimize whiteboard space?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Validate Backtracking Solutions?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Validation" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you ensure your backtracking solution is correct?' to test rigor.",
        "Follow-up: 'What tests do you run?'",
        "Deeper: 'How do you use invariants?'"
      ]},
      { type: 'subheading', en: "Validation" },
      { type: 'ul', items: [
        "Invariants: LC78 (all subsets), LC51 (no attacks), LC46 (all permutations).",
        "Test edge cases: Empty inputs, single elements, max n.",
        "Dry run: Trace recursion for small inputs (e.g., LC78: [1], LC51: n=4).",
        "Compare with brute force: Verify output count (2^n, n!)."
      ]},
      { type: 'ascii', ascii: `
LC78: nums=[1]
Invariant: All subsets ([], [1])
Dry run: pos=0, include=[1] -> [1]
               exclude=[] -> []
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Use invariants to validate in interviews."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you optimize whiteboard space?",
        "How do you handle cross-questions in backtracking?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Optimize Whiteboard Space for Backtracking?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Whiteboard Space" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you manage whiteboard space for backtracking?' to test organization.",
        "Follow-up: 'How do you keep code clear?'",
        "Deeper: 'How do you handle complex logic?'"
      ]},
      { type: 'subheading', en: "Whiteboard Space Optimization" },
      { type: 'ul', items: [
        "Write high-level steps: Choices, constraints, recursion.",
        "Use concise names: curr, pos, board.",
        "Draw trees/boards: LC78 recursion tree, LC51 board.",
        "Erase brute force after writing optimized code."
      ]},
      { type: 'ascii', ascii: `
LC51: n=4
Board: .Q..  (Q at row=0, col=1)
       ...Q
       Q...
       ..Q.
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Practice compact whiteboard coding."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle cross-questions in backtracking?",
        "How do you engage the interviewer?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Cross-Questions in Backtracking?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Cross-Questions" },
      { type: 'ul', items: [
        "The interviewer might ask 'How does backtracking compare to other patterns?' to test pattern knowledge.",
        "Follow-up: 'When is backtracking better than DP?'",
        "Deeper: 'How do you relate LC78 to LC46?'"
      ]},
      { type: 'subheading', en: "Cross-Questions Handling" },
      { type: 'ul', items: [
        "LC78 vs. LC46: Subsets (include/exclude) vs. permutations (swap/build).",
        "Backtracking vs. DP: Backtracking for all solutions, DP for optimal solutions.",
        "LC51 vs. LC17: Constraint-based (pruning) vs. unconstrained (all combos).",
        "Explain trade-offs: Backtracking’s exponential time vs. iterative alternatives."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Compare patterns to show versatility."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you engage the interviewer?",
        "How do you prepare for FAANG backtracking interviews?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Engage the Interviewer During Backtracking Problems?" },
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
        "Verbalize: Problem, choices, constraints, recursion steps.",
        "Ask clarifying questions: Duplicates? Constraints? Output format?",
        "Incorporate hints: Add pruning (LC51), try bitmask (LC78).",
        "Use diagrams: Draw recursion trees (LC78), boards (LC51)."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Practice explaining to peers for clarity."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you prepare for FAANG backtracking interviews?",
        "How do you handle time pressure?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Use Symmetry to Optimize LC51?" },
    level: 'senior',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: LC51 Symmetry" },
      { type: 'ul', items: [
        "The interviewer might ask 'Can you optimize LC51 using symmetry?' to test advanced techniques.",
        "Follow-up: 'How does symmetry reduce state space?'",
        "Deeper: 'When is symmetry applicable?'"
      ]},
      { type: 'subheading', en: "LC51 Symmetry Optimization" },
      { type: 'ul', items: [
        "Symmetry: For even n, mirror solutions across board’s vertical axis.",
        "Place queens in first half of columns (0 to n/2-1), generate mirrors.",
        "Time: Reduces search space by ~50% for even n.",
        "Space: O(n) for state, no additional overhead."
      ]},
      { type: 'ascii', ascii: `
n=4
Original: .Q..  -> Mirrored: ..Q.
          ...Q            Q...
          Q...            ...Q
          ..Q.            .Q..
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Mention symmetry for LC51 in senior interviews."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you stream outputs in backtracking?",
        "How do you handle performance bottlenecks?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Stream Outputs in Backtracking?" },
    level: 'senior',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Streaming Outputs" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you stream backtracking outputs?' to test scalability.",
        "Follow-up: 'How does it help with large outputs?'",
        "Deeper: 'How do you implement streaming?'"
      ]},
      { type: 'subheading', en: "Streaming Outputs" },
      { type: 'ul', items: [
        "Use generators: Yield solutions incrementally (LC46, LC78, LC51).",
        "Benefit: Reduces memory by not storing all results at once.",
        "Implementation: Replace result.push with yield in backtracking.",
        "Applicable: LC78 (O(2^n)), LC46 (O(n!)), LC51 (O(n!))."
      ]},
      { type: 'codeBlock', codeBlock: `
function* subsetsGenerator(nums) {
  function* backtrack(curr, pos) {
    if (pos === nums.length) {
      yield [...curr];
      return;
    }
    curr.push(nums[pos]);
    yield* backtrack(curr, pos + 1);
    curr.pop();
    yield* backtrack(curr, pos + 1);
  }
  yield* backtrack([], 0);
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Use generators for large outputs in interviews."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle performance bottlenecks?",
        "How do you compress state in backtracking?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Performance Bottlenecks in Backtracking?" },
    level: 'senior',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Performance Bottlenecks" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you address backtracking bottlenecks?' to test optimization.",
        "Follow-up: 'What are common bottlenecks?'",
        "Deeper: 'How do you profile performance?'"
      ]},
      { type: 'subheading', en: "Performance Bottlenecks" },
      { type: 'ul', items: [
        "Bottlenecks: Large state space (LC78: O(2^n)), constraint checks (LC51).",
        "Optimize: Prune early (LC51 diagonals), use bitmask (LC78, LC51).",
        "Profile: Measure recursion depth, constraint check time.",
        "Mitigate: Stream outputs, parallelize branches (LC51 rows)."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Discuss profiling in senior interviews."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you compress state in backtracking?",
        "How do you propagate constraints?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Compress State in Backtracking?" },
    level: 'senior',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: State Compression" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you compress state in backtracking?' to test space efficiency.",
        "Follow-up: 'How does it affect performance?'",
        "Deeper: 'What are compression techniques?'"
      ]},
      { type: 'subheading', en: "State Compression" },
      { type: 'ul', items: [
        "Bitmask: Use bits for state (LC51 columns/diagonals, LC78 subsets).",
        "In-Place: Modify input (LC46 swaps) to avoid copies.",
        "Boolean Arrays: Track used elements (LC46) instead of sets.",
        "Impact: Reduces space from O(n^2) to O(n) or O(1) auxiliary."
      ]},
      { type: 'codeBlock', codeBlock: `
function permute(nums) {
  const result = [];
  backtrack(0, nums, result, new Array(nums.length).fill(false));
  return result;
}
function backtrack(start, nums, result, used) {
  if (start === nums.length) {
    result.push([...nums]);
    return;
  }
  for (let i = 0; i < nums.length; i++) {
    if (!used[i]) {
      used[i] = true;
      [nums[start], nums[i]] = [nums[i], nums[start]];
      backtrack(start + 1, nums, result, used);
      [nums[start], nums[i]] = [nums[i], nums[start]];
      used[i] = false;
    }
  }
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Use boolean arrays for space efficiency."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you propagate constraints?",
        "What are real-world applications of backtracking?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Propagate Constraints in Backtracking?" },
    level: 'senior',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Constraint Propagation" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you propagate constraints in backtracking?' to test constraint handling.",
        "Follow-up: 'How does it improve pruning?'",
        "Deeper: 'How do you implement it?'"
      ]},
      { type: 'subheading', en: "Constraint Propagation" },
      { type: 'ul', items: [
        "Propagate: Update constraints dynamically (LC51: block diagonals after placing queen).",
        "LC51: Track used columns, diagonals; update before recursion.",
        "LC78: No propagation needed (no constraints).",
        "Impact: Early pruning reduces state space exploration."
      ]},
      { type: 'codeBlock', codeBlock: `
function isValid(row, col, cols, diag1, diag2) {
  return !cols.has(col) && !diag1.has(row + col) && !diag2.has(row - col);
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Explain constraint updates for LC51."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What are real-world applications of backtracking?",
        "How do you profile backtracking performance?"
      ] }
    ]
  },
  // Cross-Cutting Concepts
  {
    q: { en: "What Are Real-World Applications of Backtracking?" },
    level: 'senior',
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Real-World Applications" },
      { type: 'ul', items: [
        "The interviewer might ask 'Where is backtracking used in real-world systems?' to test practical knowledge.",
        "Follow-up: 'How does it scale in production?'",
        "Deeper: 'How do you optimize for real-world use?'"
      ]},
      { type: 'subheading', en: "Real-World Applications" },
      { type: 'ul', items: [
        "Scheduling: Assign tasks without conflicts (LC51-like constraints).",
        "Constraint Satisfaction: Sudoku solvers, puzzle games.",
        "Compilers: Generate all parse trees for ambiguous grammars.",
        "Optimization: Prune with heuristics, parallelize for scalability."
      ]},
      { type: 'ascii', ascii: `
Scheduling:
Task1: [Slot1, Slot2]
Task2: [Slot2, Slot3]
Backtrack: Try Task1->Slot1, Task2->Slot2 (valid)
           Try Task1->Slot1, Task2->Slot3 (valid)
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Relate backtracking to scheduling in interviews."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you profile backtracking performance?",
        "How does backtracking compare to other paradigms?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Profile Backtracking Performance?" },
    level: 'senior',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Performance Profiling" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you profile backtracking performance?' to test optimization skills.",
        "Follow-up: 'What metrics do you track?'",
        "Deeper: 'How do you optimize bottlenecks?'"
      ]},
      { type: 'subheading', en: "Performance Profiling" },
      { type: 'ul', items: [
        "Metrics: Recursion depth, constraint check time, branch count.",
        "Tools: Console.time in JS, profilers for call stack analysis.",
        "LC51: Profile diagonal checks, prune ineffective branches.",
        "Optimize: Use bitmask, parallelize, stream outputs."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Log recursion calls to profile bottlenecks."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How does backtracking compare to other paradigms?",
        "How do you handle large datasets in backtracking?"
      ] }
    ]
  },
  {
    q: { en: "How Does Backtracking Compare to Other Paradigms?" },
    level: 'senior',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Paradigm Comparison" },
      { type: 'ul', items: [
        "The interviewer might ask 'How does backtracking compare to DP or greedy?' to test pattern knowledge.",
        "Follow-up: 'When is backtracking preferred?'",
        "Deeper: 'How do you choose between paradigms?'"
      ]},
      { type: 'subheading', en: "Paradigm Comparison" },
      { type: 'ul', items: [
        "Backtracking: Explores all solutions (LC46, LC78, LC51), O(n!) or O(2^n).",
        "DP: Optimal solutions with overlapping subproblems, O(n^2) or better.",
        "Greedy: Single pass for local optima, fails for global solutions (LC51).",
        "Choose Backtracking: For all solutions or complex constraints."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Compare paradigms to show versatility."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle large datasets in backtracking?",
        "How do you handle iterative vs. recursive trade-offs?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Large Datasets in Backtracking?" },
    level: 'senior',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Large Datasets" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you handle large datasets in backtracking?' to test scalability.",
        "Follow-up: 'How do you reduce memory usage?'",
        "Deeper: 'How do you optimize for big data?'"
      ]},
      { type: 'subheading', en: "Large Dataset Handling" },
      { type: 'ul', items: [
        "Constraints: LC78 (n ≤ 20), LC51 (n ≤ 9) limit dataset size.",
        "Stream: Use generators to process solutions incrementally.",
        "Parallelize: Split branches (LC78 bitmasks, LC51 rows) across threads.",
        "Prune: Early constraint checks (LC51 diagonals) reduce exploration."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Discuss streaming for large datasets."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle iterative vs. recursive trade-offs?",
        "How do you model complex constraints?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Iterative vs. Recursive Trade-Offs in Backtracking?" },
    level: 'senior',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Iterative vs. Recursive" },
      { type: 'ul', items: [
        "The interviewer might ask 'Can you solve backtracking iteratively?' to test versatility.",
        "Follow-up: 'What are the trade-offs?'",
        "Deeper: 'When is iterative better?'"
      ]},
      { type: 'subheading', en: "Iterative vs. Recursive Trade-Offs" },
      { type: 'ul', items: [
        "Recursive: Natural for backtracking (LC17, LC46, LC78, LC51), O(n) stack space.",
        "Iterative: Bitmask (LC78), stack simulation (LC46), O(n) explicit stack.",
        "Iterative Better: Small n (LC78 bitmask), avoiding stack overflow.",
        "Recursive Better: Clarity, complex constraints (LC51)."
      ]},
      { type: 'codeBlock', codeBlock: `
function subsetsIterative(nums) {
  const result = [];
  const stack = [[[], 0]];
  while (stack.length) {
    const [curr, pos] = stack.pop();
    if (pos === nums.length) {
      result.push(curr);
      continue;
    }
    stack.push([curr, pos + 1]); // Exclude
    stack.push([[...curr, nums[pos]], pos + 1]); // Include
  }
  return result;
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Use recursive for interview clarity."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you model complex constraints?",
        "How do you handle edge case strategies?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Model Complex Constraints in Backtracking?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Complex Constraints" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you model complex constraints in backtracking?' to test constraint handling.",
        "Follow-up: 'How do you ensure correctness?'",
        "Deeper: 'How do you optimize constraint checks?'"
      ]},
      { type: 'subheading', en: "Complex Constraint Modeling" },
      { type: 'ul', items: [
        "LC51: Track columns, diagonals with sets or bitmasks.",
        "General: Use boolean checks or data structures (sets, arrays).",
        "Correctness: Validate constraints before recursion (LC51 isValid).",
        "Optimize: O(1) checks with bitmasks or sets."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Model constraints explicitly for clarity."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle edge case strategies?",
        "How do you ensure code readability?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Edge Case Strategies in Backtracking?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Edge Case Strategies" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you handle edge cases in backtracking?' to test robustness.",
        "Follow-up: 'What edge cases are common?'",
        "Deeper: 'How do you test edge cases?'"
      ]},
      { type: 'subheading', en: "Edge Case Strategies" },
      { type: 'ul', items: [
        "Empty Inputs: LC46/LC78 ([[]]), LC17 ([]), LC51 (n/a).",
        "Small Inputs: LC46 ([1]), LC78 ([1]), LC51 (n=1).",
        "Invalid Inputs: LC51 (n=2,3), LC17 (invalid digits).",
        "Test: Run edge cases first, verify output count."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "List edge cases before coding."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you ensure code readability?",
        "How do you revise backtracking for FAANG interviews?"
      ] }
    ]
  },
  // FAANG Prep
  {
    q: { en: "How Do You Ensure Code Readability in Backtracking?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Code Readability" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you make backtracking code readable?' to test coding style.",
        "Follow-up: 'What naming conventions do you use?'",
        "Deeper: 'How do you structure code?'"
      ]},
      { type: 'subheading', en: "Code Readability" },
      { type: 'ul', items: [
        "Names: Use clear variables (curr, pos, result).",
        "Structure: Separate backtrack function, comment choices/constraints.",
        "Comments: Explain choice points, pruning, undo steps.",
        "LC51 Example: Comment diagonal checks, board updates."
      ]},
      { type: 'codeBlock', codeBlock: `
function solveNQueens(n) {
  const result = [];
  const board = Array(n).fill().map(() => Array(n).fill('.')); // Initialize board
  backtrack(0, board, result, new Set(), new Set(), new Set());
  return result;
}
function backtrack(row, board, result, cols, diag1, diag2) {
  if (row === board.length) {
    result.push(board.map(row => row.join(''))); // Save solution
    return;
  }
  for (let col = 0; col < board.length; col++) {
    if (!cols.has(col) && !diag1.has(row + col) && !diag2.has(row - col)) {
      board[row][col] = 'Q'; // Place queen
      cols.add(col); diag1.add(row + col); diag2.add(row - col);
      backtrack(row + 1, board, result, cols, diag1, diag2);
      board[row][col] = '.'; // Undo
      cols.delete(col); diag1.delete(row + col); diag2.delete(row - col);
    }
  }
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Comment choice points for clarity."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you revise backtracking for FAANG interviews?",
        "How do you handle stress in FAANG interviews?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Revise Backtracking for FAANG Interviews?" },
    level: 'intermediate',
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: FAANG Revision" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you prepare backtracking for FAANG?' to test study plan.",
        "Follow-up: 'How do you prioritize problems?'",
        "Deeper: 'How do you retain concepts?'"
      ]},
      { type: 'subheading', en: "FAANG Revision Strategy" },
      { type: 'ul', items: [
        "Week 1-2: Solve LC17, LC46 (simple backtracking).",
        "Week 3-4: Master LC78, LC51 (constraints, pruning).",
        "Daily: 1-2 problems, explain aloud, test edge cases.",
        "Weekly: Review LC17, LC46, LC78, LC51, compare approaches.",
        "Mock Interviews: 45-min sessions, handle follow-ups.",
        "Focus: Pruning (LC51), bitmask (LC78), duplicates (LC90)."
      ]},
      { type: 'ascii', ascii: `
Revision Plan:
Week 1-2: LC17, LC46 (O(4^n), O(n!))
Week 3-4: LC78, LC51 (O(2^n), O(n!))
Daily: 1-2 problems, verbalize
Weekly: Review, mock interviews
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Use LeetCode’s 'Explore' for backtracking problems."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle stress in FAANG interviews?",
        "How do you conduct mock interviews?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Stress in FAANG Backtracking Interviews?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Stress Handling" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you stay calm in backtracking interviews?' to test composure.",
        "Follow-up: 'What if you get stuck?'",
        "Deeper: 'How do you recover from mistakes?'"
      ]},
      { type: 'subheading', en: "Stress Handling" },
      { type: 'ul', items: [
        "Break down: Clarify problem, model choices, recurse, prune.",
        "If stuck: Revert to brute force, add pruning incrementally.",
        "Verbalize: Explain choices to engage interviewer, stay focused.",
        "Practice: Timed sessions (30-45 min) for confidence."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', itemsqy: [
        "Breathe and clarify constraints to reduce stress."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you conduct mock interviews?",
        "How do you explain complex backtracking logic?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Conduct Mock Interviews for Backtracking?" },
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
        "Time: 45 min per problem (LC17, LC46, LC78, LC51).",
        "Explain: Verbalize choices, constraints, recursion aloud.",
        "Whiteboard: Use paper/whiteboard for coding practice.",
        "Peers: Practice with friends, incorporate hints (e.g., pruning)."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Record mock sessions to refine explanations."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you explain complex backtracking logic?",
        "How do you handle follow-up questions in FAANG interviews?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Explain Complex Backtracking Logic in Interviews?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Explaining Complex Logic" },
      { type: 'ul', items: [
        "The interviewer might ask 'Can you explain backtracking clearly?' to test communication.",
        "Follow-up: 'How do you simplify recursion?'",
        "Deeper: 'How do you handle follow-ups?'"
      ]},
      { type: 'subheading', en: "Explaining Complex Logic" },
      { type: 'ul', items: [
        "Steps: Problem, choices, constraints, recursion, pruning.",
        "Example: LC51 (place queens, check diagonals), LC78 (include/exclude).",
        "Visualize: Draw recursion tree (LC78), board (LC51).",
        "Follow-ups: Address duplicates (LC90), counting (LC52)."
      ]},
      { type: 'ascii', ascii: `
LC78: nums=[1,2]
Tree: [] -> [1] -> [1,2]
               -> [1]
         -> [] -> [2]
               -> []
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Use diagrams to simplify explanations."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle follow-up questions in FAANG interviews?",
        "How do you manage time in backtracking interviews?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Follow-Up Questions in FAANG Backtracking Interviews?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Follow-Up Questions" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you handle follow-ups in backtracking?' to test adaptability.",
        "Follow-up: 'What common follow-ups do you expect?'",
        "Deeper: 'How do you extend solutions?'"
      ]},
      { type: 'subheading', en: "Handling Follow-Ups" },
      { type: 'ul', items: [
        "Duplicates: LC90 (LC78), LC47 (LC46) with sorting/skipping.",
        "k-Variations: k-subsets (LC77), k-permutations.",
        "Constraints: LC51 new attack rules, LC17 restricted letters.",
        "Optimization: Add pruning, bitmask, or streaming."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Practice LC47, LC90 for follow-ups."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you manage time in backtracking interviews?",
        "How do you prioritize backtracking problems?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Manage Time in Backtracking Interviews?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Time Management" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you manage time in backtracking interviews?' to test efficiency.",
        "Follow-up: 'How do you avoid getting stuck?'",
        "Deeper: 'How do you balance coding and explanation?'"
      ]},
      { type: 'subheading', en: "Time Management" },
      { type: 'ul', items: [
        "Allocate: 5 min clarify, 10 min design, 20 min code, 10 min test.",
        "Start Simple: Write brute force, optimize with pruning.",
        "Explain While Coding: Verbalize choices, constraints.",
        "If Stuck: Backtrack to simpler problem (e.g., LC17 for LC51)."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Practice timed 45-min sessions."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you prioritize backtracking problems?",
        "How do you handle unexpected constraints?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Prioritize Backtracking Problems for FAANG Interviews?" },
    level: 'fresher',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Problem Prioritization" },
      { type: 'ul', items: [
        "The interviewer might ask 'Which backtracking problems to practice?' to test preparation.",
        "Follow-up: 'Why prioritize these?'",
        "Deeper: 'How do you build intuition?'"
      ]},
      { type: 'subheading', en: "Problem Prioritization" },
      { type: 'ul', items: [
        "Start: LC17 (simple choices), LC46 (permutations).",
        "Intermediate: LC78 (subsets), LC90 (duplicates).",
        "Advanced: LC51 (constraints), LC52 (counting).",
        "Focus: FAANG favorites (LC46, LC78, LC51)."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Prioritize LC17 for quick wins."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle unexpected constraints?",
        "How do you summarize backtracking learnings?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Unexpected Constraints in Backtracking?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Unexpected Constraints" },
      { type: 'ul', items: [
        "The interviewer might ask 'What if new constraints are added?' to test adaptability.",
        "Follow-up: 'How do you modify your solution?'",
        "Deeper: 'How do you validate new constraints?'"
      ]},
      { type: 'subheading', en: "Unexpected Constraints" },
      { type: 'ul', items: [
        "LC51: Add new attack rules (e.g., knight moves), update isValid.",
        "LC78: Restrict subset sums, add sum check in backtracking.",
        "Validate: Test new constraints with small inputs.",
        "Adapt: Modify pruning logic, recheck complexity."
      ]},
      { type: 'codeBlock', codeBlock: `
function subsetsWithSum(nums, target) {
  const result = [];
  backtrack([], 0, 0, nums, target, result);
  return result;
}
function backtrack(curr, pos, sum, nums, target, result) {
  if (sum === target) {
    result.push([...curr]);
    return;
  }
  if (pos === nums.length || sum > target) return;
  curr.push(nums[pos]);
  backtrack(curr, pos + 1, sum + nums[pos], nums, target, result);
  curr.pop();
  backtrack(curr, pos + 1, sum, nums, target, result);
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Clarify new constraints before coding."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you summarize backtracking learnings?",
        "How do you prepare for FAANG coding rounds?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Summarize Backtracking Learnings for Interviews?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Summarizing Learnings" },
      { type: 'ul', items: [
        "The interviewer might ask 'Can you summarize backtracking?' to test understanding.",
        "Follow-up: 'What are key takeaways?'",
        "Deeper: 'How do you apply learnings?'"
      ]},
      { type: 'subheading', en: "Summarizing Learnings" },
      { type: 'ul', items: [
        "Core: Try all choices, prune invalid, undo (LC17, LC46, LC78, LC51).",
        "Key Problems: LC17 (choices), LC46 (permutations), LC78 (subsets), LC51 (constraints).",
        "Optimizations: Pruning (LC51), bitmask (LC78), streaming.",
        "FAANG: Practice verbalizing, handle follow-ups (LC90, LC47)."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Summarize as 'try, prune, undo' in interviews."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you prepare for FAANG coding rounds?",
        "How do you handle backtracking variations?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Prepare for FAANG Coding Rounds with Backtracking?" },
    level: 'intermediate',
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: FAANG Coding Rounds" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you prepare for FAANG backtracking rounds?' to test readiness.",
        "Follow-up: 'What problems do you focus on?'",
        "Deeper: 'How do you handle pressure?'"
      ]},
      { type: 'subheading', en: "FAANG Coding Round Prep" },
      { type: 'ul', items: [
        "Problems: LC17, LC46, LC78, LC51, LC90, LC47, LC52.",
        "Skills: Verbalize logic, draw recursion trees, test edge cases.",
        "Timed Practice: 45-min sessions, mock interviews weekly.",
        "Handle Pressure: Break problem into steps, clarify constraints."
      ]},
      { type: 'ascii', ascii: `
Prep Plan:
Week 1: LC17, LC46
Week 2: LC78, LC90
Week 3: LC51, LC52
Daily: Verbalize, test edge cases
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Focus on LC51 for FAANG interviews."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle backtracking variations?",
        "How do you handle backtracking in system design?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Backtracking Variations in Interviews?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Backtracking Variations" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you handle variations in backtracking?' to test adaptability.",
        "Follow-up: 'What variations do you expect?'",
        "Deeper: 'How do you modify your approach?'"
      ]},
      { type: 'subheading', en: "Backtracking Variations" },
      { type: 'ul', items: [
        "Duplicates: LC90 (subsets), LC47 (permutations) with sorting.",
        "k-Variations: LC77 (k-subsets), k-permutations.",
        "Constraints: LC51 new attack rules, LC17 restricted letters.",
        "Optimization: Add pruning, bitmask, or memoization."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Practice LC77, LC90 for variations."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle backtracking in system design?",
        "How do you test backtracking variations?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Backtracking in System Design Interviews?" },
    level: 'senior',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: System Design" },
      { type: 'ul', items: [
        "The interviewer might ask 'How does backtracking apply to system design?' to test practical application.",
        "Follow-up: 'How do you scale backtracking?'",
        "Deeper: 'How do you integrate with other components?'"
      ]},
      { type: 'subheading', en: "Backtracking in System Design" },
      { type: 'ul', items: [
        "Applications: Scheduling (LC51-like), resource allocation, constraint solvers.",
        "Scale: Parallelize branches, stream outputs, use distributed systems.",
        "Integrate: Combine with databases (store solutions), APIs (fetch constraints).",
        "Optimize: Cache partial solutions, prune with heuristics."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Relate backtracking to scheduling systems."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you test backtracking variations?",
        "How do you debug backtracking in production?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Test Backtracking Variations?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Testing Variations" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you test backtracking variations?' to test thoroughness.",
        "Follow-up: 'What test cases do you prioritize?'",
        "Deeper: 'How do you ensure coverage?'"
      ]},
      { type: 'subheading', en: "Testing Variations" },
      { type: 'ul', items: [
        "Duplicates: LC90 ([1,1] → [[],[1],[1,1]]), LC47 ([1,1,2]).",
        "k-Variations: LC77 (k=2, n=4), k-permutations.",
        "Constraints: LC51 new rules, LC17 restricted letters.",
        "Coverage: Test edge cases, verify output count (2^n, n!)."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Test variations with small inputs."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you debug backtracking in production?",
        "How do you handle backtracking edge cases in production?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Debug Backtracking in Production?" },
    level: 'senior',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Production Debugging" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you debug backtracking in production?' to test real-world skills.",
        "Follow-up: 'What logs do you add?'",
        "Deeper: 'How do you handle performance issues?'"
      ]},
      { type: 'subheading', en: "Production Debugging" },
      { type: 'ul', items: [
        "Logs: Track recursion depth, choices, constraint failures.",
        "LC51: Log invalid placements (column, diagonal conflicts).",
        "Performance: Profile branch count, optimize pruning.",
        "Tools: Use debuggers, logging frameworks (e.g., console.log)."
      ]},
      { type: 'codeBlock', codeBlock: `
function solveNQueens(n) {
  const result = [];
  backtrack(0, new Set(), new Set(), new Set(), [], n, result);
  return result;
}
function backtrack(row, cols, diag1, diag2, board, n, result) {
  if (row === n) {
    console.log('Solution found:', board);
    result.push(board.map(row => row.join('')));
    return;
  }
  for (let col = 0; col < n; col++) {
    if (!cols.has(col) && !diag1.has(row + col) && !diag2.has(row - col)) {
      console.log(\`Trying row=\${row}, col=\${col}\`);
      // Place queen and recurse
    }
  }
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Add logs for recursion steps in production."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle backtracking edge cases in production?",
        "How do you optimize backtracking for production?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Backtracking Edge Cases in Production?" },
    level: 'senior',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Production Edge Cases" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you handle edge cases in production?' to test robustness.",
        "Follow-up: 'What edge cases are critical?'",
        "Deeper: 'How do you ensure reliability?'"
      ]},
      { type: 'subheading', en: "Production Edge Cases" },
      { type: 'ul', items: [
        "Empty Inputs: Handle gracefully (LC46/LC78: [[]], LC17: []).",
        "Invalid Inputs: Validate constraints (LC51: n=2,3).",
        "Large Inputs: Stream outputs, limit recursion depth.",
        "Reliability: Add input validation, fallback solutions."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Validate inputs early in production code."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you optimize backtracking for production?",
        "How do you summarize backtracking for FAANG?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Optimize Backtracking for Production?" },
    level: 'senior',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Production Optimization" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you optimize backtracking in production?' to test scalability.",
        "Follow-up: 'What optimizations are critical?'",
        "Deeper: 'How do you balance performance and readability?'"
      ]},
      { type: 'subheading', en: "Production Optimization" },
      { type: 'ul', items: [
        "Pruning: Early constraint checks (LC51 diagonals).",
        "Bitmask: Faster checks for small n (LC78, LC51).",
        "Streaming: Use generators for large outputs.",
        "Parallelization: Split branches for distributed systems."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Balance pruning with code clarity in production."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you summarize backtracking for FAANG?",
        "How do you integrate backtracking with other algorithms?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Integrate Backtracking with Other Algorithms?" },
    level: 'senior',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Algorithm Integration" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you combine backtracking with other algorithms?' to test versatility.",
        "Follow-up: 'What algorithms complement backtracking?'",
        "Deeper: 'How do you implement hybrid solutions?'"
      ]},
      { type: 'subheading', en: "Algorithm Integration" },
      { type: 'ul', items: [
        "DP: Memoize overlapping subproblems (e.g., LC78 with sum constraints).",
        "Greedy: Use greedy heuristics to guide pruning (LC51).",
        "Sorting: Handle duplicates (LC90, LC47).",
        "Hybrid: Combine backtracking with Two-Pointer for sums in LC78 variations."
      ]},
      { type: 'codeBlock', codeBlock: `
function subsetsWithSum(nums, target) {
  nums.sort((a, b) => a - b); // Sort for Two-Pointer
  const result = [];
  backtrack([], 0, 0, nums, target, result);
  return result;
}
function backtrack(curr, pos, sum, nums, target, result) {
  if (sum === target) {
    result.push([...curr]);
    return;
  }
  for (let i = pos; i < nums.length; i++) {
    if (sum + nums[i] > target) break; // Prune with sorted array
    curr.push(nums[i]);
    backtrack(curr, i + 1, sum + nums[i], nums, target, result);
    curr.pop();
  }
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Discuss hybrid approaches in senior interviews."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you summarize backtracking for FAANG?",
        "How do you handle backtracking in distributed systems?"
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
