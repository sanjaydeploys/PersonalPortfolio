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
    q: { en: "What is Dynamic Programming and Why is it Useful?" },
    level: 'fresher',
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: DP Definition" },
      { type: 'ul', items: [
        "The interviewer may ask 'What is Dynamic Programming?' to check if you understand the basics of this problem-solving technique.",
        "They might follow up with 'How does it save time compared to naive solutions?' to test your grasp of efficiency.",
        "A deeper question could be 'What makes a problem suitable for DP?' to see if you can identify DP problems."
      ]},
      { type: 'subheading', en: "Dynamic Programming Definition and Use" },
      { type: 'ul', items: [
        "Dynamic Programming (DP) is a method to solve problems by breaking them into smaller, overlapping subproblems and storing their solutions to avoid recomputation.",
        "Think of it like remembering answers to math problems you’ve already solved, so you don’t redo the work. For example, in LC70 (Climbing Stairs), you calculate ways to climb small stairs and reuse them for bigger ones.",
        "Why useful? It reduces time complexity from exponential (e.g., O(2^n) in recursive LC70) to polynomial (e.g., O(n) with DP).",
        "Key components: (1) Overlapping subproblems (same subproblems repeat, like in Fibonacci), (2) Optimal substructure (solution built from optimal subproblem solutions).",
        "Common problems: Counting ways (LC70), maximizing/minimizing (LC198), or finding sequences (LC1143)."
      ]},
      { type: 'ascii', ascii: `
LC70 (n=3):
Without DP: Recursively try all paths (exponential).
With DP: dp[1]=1, dp[2]=2, dp[3]=dp[2]+dp[1]=3
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "When explaining DP, use simple analogies like 'remembering homework answers' to show you understand it clearly."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What’s the difference between 1D and 2D DP?",
        "What are overlapping subproblems in DP?"
      ] }
    ]
  },
  {
    q: { en: "What Are Overlapping Subproblems in DP?" },
    level: 'fresher',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Overlapping Subproblems" },
      { type: 'ul', items: [
        "The interviewer may ask 'What are overlapping subproblems?' to test your understanding of why DP works.",
        "They might follow up with 'Can you give an example?' to see if you can relate it to a problem like LC70.",
        "A deeper question could be 'How do you confirm subproblems overlap?' to check your problem analysis."
      ]},
      { type: 'subheading', en: "Overlapping Subproblems Explained" },
      { type: 'ul', items: [
        "Overlapping subproblems mean the same smaller problems are solved multiple times in a recursive solution, wasting time.",
        "For example, in LC70 (Climbing Stairs), calculating ways to climb stair 3 requires ways for stair 2 and stair 1, and stair 2 requires stair 1 again—stair 1 is computed repeatedly without DP.",
        "DP stores these results (e.g., in an array or variables) so each subproblem (like stair 1) is solved only once.",
        "How to confirm? If recursive calls repeat (e.g., fib(3) called multiple times in Fibonacci), or if you see the same subproblem in a problem’s structure (like LC198’s house choices)."
      ]},
      { type: 'ascii', ascii: `
LC70 (n=4, recursive):
fib(4) = fib(3) + fib(2)
fib(3) = fib(2) + fib(1)
fib(2) repeats!
With DP: Store fib(2) once.
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Draw a recursive tree for LC70 to spot repeating subproblems."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What is optimal substructure in DP?",
        "What’s the difference between 1D and 2D DP?"
      ] }
    ]
  },
  {
    q: { en: "What is Optimal Substructure in DP?" },
    level: 'fresher',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Optimal Substructure" },
      { type: 'ul', items: [
        "The interviewer may ask 'What is optimal substructure?' to test your grasp of DP fundamentals.",
        "They might follow up with 'How does it apply to LC70?' to see if you can connect it to a problem.",
        "A deeper question could be 'How do you verify optimal substructure?' to check your analysis skills."
      ]},
      { type: 'subheading', en: "Optimal Substructure Explained" },
      { type: 'ul', items: [
        "Optimal substructure means the solution to a problem can be built from optimal solutions to smaller subproblems.",
        "In LC70 (Climbing Stairs), the number of ways to climb n stairs depends on the optimal (correct) ways to climb n-1 and n-2 stairs.",
        "For example, to climb 3 stairs, you either take 1 step from stair 2 (dp[2] ways) or 2 steps from stair 1 (dp[1] ways), so dp[3] = dp[2] + dp[1].",
        "Verify by checking if breaking the problem into smaller parts (subproblems) gives the correct final answer when combined."
      ]},
      { type: 'ascii', ascii: `
LC70 (n=3):
dp[3] = dp[2] + dp[1]
dp[2] = ways to stair 2, dp[1] = ways to stair 1
Optimal: Combine smaller solutions.
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Explain how smaller solutions build the final answer for clarity."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What’s the difference between 1D and 2D DP?",
        "How do you recognize DP problems?"
      ] }
    ]
  },
  {
    q: { en: "What’s the Difference Between 1D and 2D DP?" },
    level: 'fresher',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: 1D vs. 2D DP" },
      { type: 'ul', items: [
        "The interviewer may ask 'How do 1D and 2D DP differ?' to test your understanding of DP structures.",
        "They might follow up with 'When do you use 1D vs. 2D?' to see if you can pick the right approach.",
        "A deeper question could be 'How does space usage differ?' to check optimization knowledge."
      ]},
      { type: 'subheading', en: "1D vs. 2D DP Explained" },
      { type: 'ul', items: [
        "1D DP uses a single array or variable to track states based on one parameter, like position or index (e.g., LC70 dp[i] for stair i, LC198 dp[i] for house i).",
        "2D DP uses a table (2D array) to track states based on two parameters, like two indices or dimensions (e.g., LC1143 dp[i][j] for prefixes of two strings, LC62 dp[i][j] for grid position).",
        "When to use 1D? Problems with linear sequences or single choices, like climbing stairs (LC70) or robbing houses (LC198).",
        "When to use 2D? Problems with pairs or grids, like matching two strings (LC1143) or navigating a grid (LC62).",
        "Space: 1D DP can often be optimized to O(1) (LC70 with variables), while 2D DP may use O(nm) or O(min(n,m)) with rolling arrays."
      ]},
      { type: 'ascii', ascii: `
1D DP (LC70):
dp[3] = dp[2] + dp[1]
2D DP (LC62):
dp[2][2] = dp[1][2] + dp[2][1]
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Count the number of changing variables (e.g., one for LC70, two for LC1143) to decide 1D or 2D."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you recognize DP problems?",
        "What are state transitions in DP?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Recognize DP Problems?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Recognition Cues" },
      { type: 'ul', items: [
        "The interviewer may ask 'How do you know a problem needs DP?' to test your ability to spot DP patterns.",
        "They might follow up with 'What keywords hint at DP?' to see if you can identify problem types.",
        "A deeper question could be 'How do you differentiate DP from greedy?' to check your pattern knowledge."
      ]},
      { type: 'subheading', en: "Recognizing DP Problems" },
      { type: 'ul', items: [
        "Look for overlapping subproblems: If smaller problems repeat (e.g., LC70’s stair 1 computed multiple times in recursion), DP can store results.",
        "Check for optimal substructure: The solution builds from smaller solutions (e.g., LC198’s max money uses previous houses’ results).",
        "Common keywords: 'Number of ways' (LC70), 'maximum/minimum value' (LC198, Knapsack), 'longest/shortest sequence' (LC1143), or 'paths in grid' (LC62).",
        "DP vs. Greedy: Greedy picks local best choices (e.g., activity selection), but DP considers all possibilities (e.g., LC198 chooses rob or skip).",
        "Example: If the problem asks for all possible ways or an optimal value over multiple choices, it’s likely DP."
      ]},
      { type: 'ascii', ascii: `
LC70: "Count ways" -> DP
LC198: "Max money, no adjacent" -> DP
LC1143: "Longest common" -> DP
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "If you see 'count ways' or 'maximize' in a problem, try writing a recursive solution first to confirm DP."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What are state transitions in DP?",
        "What is memoization vs. tabulation in DP?"
      ] }
    ]
  },
  {
    q: { en: "What Are State Transitions in DP?" },
    level: 'intermediate',
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: State Transitions" },
      { type: 'ul', items: [
        "The interviewer may ask 'What are state transitions in DP?' to test how you build DP solutions.",
        "They might follow up with 'How do you derive them for LC70?' to see if you can apply it.",
        "A deeper question could be 'What if transitions involve multiple states?' to check complex cases."
      ]},
      { type: 'subheading', en: "State Transitions Explained" },
      { type: 'ul', items: [
        "State transitions are the rules that define how you compute a DP state (e.g., dp[i] or dp[i][j]) using previous states.",
        "Think of it like a recipe: To get the answer for a bigger problem, you combine answers from smaller problems.",
        "For LC70 (Climbing Stairs), dp[i] (ways to climb stair i) equals dp[i-1] (ways to climb i-1, then take 1 step) plus dp[i-2] (ways to climb i-2, then take 2 steps).",
        "For LC1143 (LCS), dp[i][j] depends on whether characters match: if they do, use dp[i-1][j-1] + 1; if not, take max(dp[i-1][j], dp[i][j-1]).",
        "How to derive? Identify what the state represents (e.g., dp[i] = ways to i), then figure out how it depends on previous states."
      ]},
      { type: 'ascii', ascii: `
LC70 (n=3):
dp[3] = dp[2] + dp[1]
LC1143 (text1="AB", text2="AC"):
dp[1][1] = A==A ? dp[0][0]+1 : max(dp[0][1], dp[1][0])
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Write the state transition formula on the whiteboard before coding to show clarity."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What is memoization vs. tabulation in DP?",
        "How do you handle base cases in DP?"
      ] }
    ]
  },
  {
    q: { en: "What is Memoization vs. Tabulation in DP?" },
    level: 'fresher',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Memoization vs. Tabulation" },
      { type: 'ul', items: [
        "The interviewer may ask 'What’s the difference between memoization and tabulation?' to test your DP approaches.",
        "They might follow up with 'Which is better for LC70?' to see if you can choose wisely.",
        "A deeper question could be 'How do they affect performance?' to check optimization."
      ]},
      { type: 'subheading', en: "Memoization vs. Tabulation Explained" },
      { type: 'ul', items: [
        "Memoization is top-down: Start with the big problem (e.g., LC70 n=4), recursively break it into smaller problems (n=3, n=2), and store results in a cache (like an object or array) to avoid recomputing.",
        "Tabulation is bottom-up: Start with the smallest problems (e.g., LC70 dp[1]=1, dp[2]=2), build up to the big problem (dp[4]) by filling a table iteratively.",
        "Memoization example: In LC70, memo[n] stores ways to climb n stairs, computed recursively as memo[n-1] + memo[n-2].",
        "Tabulation example: In LC70, dp[i] = dp[i-1] + dp[i-2], computed in a loop from i=3 to n.",
        "Trade-offs: Memoization uses O(n) space for cache and has recursive overhead; tabulation can use O(1) space (LC70 variables) and is faster for simple problems."
      ]},
      { type: 'codeBlock', codeBlock: `
function climbStairsMemo(n, memo = {}) {
  if (n <= 2) return n;
  if (n in memo) return memo[n];
  return memo[n] = climbStairsMemo(n-1, memo) + climbStairsMemo(n-2, memo);
}
function climbStairsTab(n) {
  if (n <= 2) return n;
  let prev1 = 1, prev2 = 2;
  for (let i = 3; i <= n; i++) {
    let curr = prev1 + prev2;
    prev1 = prev2;
    prev2 = curr;
  }
  return prev2;
}
      ` },
      { type: 'ascii', ascii: `
Memoization (LC70, n=3):
memo[3] = memo[2] + memo[1]
Tabulation (LC70, n=3):
dp[3] = dp[2] + dp[1]
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Use tabulation for LC70 in interviews because it’s faster and uses less space."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle base cases in DP?",
        "How do you optimize DP space?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Base Cases in DP?" },
    level: 'fresher',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Base Cases" },
      { type: 'ul', items: [
        "The interviewer may ask 'How do you set up base cases in DP?' to test your ability to start DP correctly.",
        "They might follow up with 'What happens if base cases are wrong?' to see if you understand their role.",
        "A deeper question could be 'How do you derive base cases for LC70?' to check your logic."
      ]},
      { type: 'subheading', en: "Base Cases Explained" },
      { type: 'ul', items: [
        "Base cases are the starting points for DP, representing the smallest subproblems that have known answers.",
        "In LC70 (Climbing Stairs), dp[1]=1 (one way to climb 1 stair) and dp[2]=2 (two ways to climb 2 stairs).",
        "In LC1143 (LCS), dp[0][j]=0 and dp[i][0]=0 because an empty string has no common subsequence.",
        "Why important? Wrong base cases lead to incorrect DP table values, like forgetting dp[1]=1 in LC70.",
        "How to derive? Solve the smallest possible input manually (e.g., LC70 n=1, n=2) and use those answers."
      ]},
      { type: 'ascii', ascii: `
LC70:
dp[1]=1 (1 step)
dp[2]=2 (1+1 or 2)
LC1143:
dp[0][j]=0 (empty text1)
dp[i][0]=0 (empty text2)
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Always write base cases first to ensure your DP starts correctly."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you optimize DP space?",
        "How do you analyze DP time complexity?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Optimize DP Space?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Space Optimization" },
      { type: 'ul', items: [
        "The interviewer may ask 'How can you reduce space in DP?' to test your optimization skills.",
        "They might follow up with 'What is a rolling array?' to see if you know advanced techniques.",
        "A deeper question could be 'How do you apply space optimization to LC70?' to check application."
      ]},
      { type: 'subheading', en: "Space Optimization Explained" },
      { type: 'ul', items: [
        "Space optimization reduces the memory used by storing only necessary states instead of a full DP table.",
        "For 1D DP (LC70, LC198), use variables instead of an array. In LC70, store only prev1 (dp[i-1]) and prev2 (dp[i-2]) to compute dp[i].",
        "For 2D DP (LC1143, LC62), use a rolling array: store one row/column instead of the full table, updating it as you go.",
        "Example: In LC1143, instead of O(nm) space for dp[i][j], use O(min(n,m)) by keeping only the current and previous row.",
        "Trade-off: Saves memory but may make code slightly harder to read."
      ]},
      { type: 'ascii', ascii: `
LC70 (O(1) space):
prev1=1, prev2=2 -> curr=prev1+prev2
LC1143 (rolling array):
dp[j] = current row, prev[j] = previous row
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Practice converting LC70’s array to variables for O(1) space."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you analyze DP time complexity?",
        "What is the approach to solve LC70?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Analyze DP Time Complexity?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Time Complexity" },
      { type: 'ul', items: [
        "The interviewer may ask 'How do you calculate DP time complexity?' to test your analysis skills.",
        "They might follow up with 'What factors affect it?' to see if you understand DP structure.",
        "A deeper question could be 'How do you optimize time complexity?' to check efficiency."
      ]},
      { type: 'subheading', en: "Time Complexity Explained" },
      { type: 'ul', items: [
        "Time complexity depends on the number of states and the work per state.",
        "For 1D DP (LC70, LC198), there are n states, and each state takes O(1) work (e.g., dp[i] = dp[i-1] + dp[i-2]), so O(n) total.",
        "For 2D DP (LC1143, LC62), there are n*m states (for two dimensions), and each state takes O(1) work, so O(nm) total.",
        "Optimization: Reduce states (e.g., rolling array doesn’t change time) or use early exits for invalid states.",
        "Example: LC70 is O(n) because you loop n times, each doing a simple addition."
      ]},
      { type: 'ascii', ascii: `
LC70: n states, O(1) per state -> O(n)
LC1143: n*m states, O(1) per state -> O(nm)
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Count the number of DP table cells to estimate time complexity."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What is the approach to solve LC70?",
        "What is the approach to solve LC198?"
      ] }
    ]
  },
  // LC70: Climbing Stairs
  {
    q: { en: "What is the Approach to Solve LC70 (Climbing Stairs)?" },
    level: 'fresher',
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: LC70 Approach" },
      { type: 'ul', items: [
        "The interviewer may ask 'How do you solve LC70?' to test your ability to apply 1D DP.",
        "They might follow up with 'What’s the time and space complexity?' to check your analysis.",
        "A deeper question could be 'Why does this problem need DP?' to see if you understand its efficiency."
      ]},
      { type: 'subheading', en: "LC70 Approach Explained" },
      { type: 'ul', items: [
        "Problem: You need to count the number of ways to climb n stairs, taking either 1 or 2 steps at a time.",
        "Why DP? A recursive solution (try all 1 and 2 step combinations) is O(2^n) because it recomputes the same subproblems (e.g., ways to stair 2).",
        "DP Approach: Use a 1D DP array where dp[i] represents the number of ways to climb to stair i.",
        "State Transition: dp[i] = dp[i-1] + dp[i-2], because you can reach stair i by taking 1 step from i-1 or 2 steps from i-2.",
        "Base Cases: dp[1]=1 (one way: 1 step), dp[2]=2 (two ways: 1+1 or 2).",
        "Optimization: Use two variables (prev1, prev2) instead of an array to reduce space to O(1).",
        "Complexity: Time O(n) (loop n times), Space O(1) with variables."
      ]},
      { type: 'codeBlock', codeBlock: `
function climbStairs(n) {
  if (n <= 2) return n; // Base cases
  let prev1 = 1, prev2 = 2; // dp[1]=1, dp[2]=2
  for (let i = 3; i <= n; i++) {
    let curr = prev1 + prev2; // dp[i] = dp[i-1] + dp[i-2]
    prev1 = prev2; // Shift: prev1 = dp[i-2]
    prev2 = curr; // prev2 = dp[i-1]
  }
  return prev2; // Final answer
}
      ` },
      { type: 'ascii', ascii: `
n=4:
dp[1]=1 (1)
dp[2]=2 (1+1, 2)
dp[3]=dp[2]+dp[1]=2+1=3
dp[4]=dp[3]+dp[2]=3+2=5
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Practice LC70 with both array and variable-based solutions to understand space optimization."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle edge cases in LC70?",
        "How do you optimize LC70 further?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Edge Cases in LC70?" },
    level: 'fresher',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: LC70 Edge Cases" },
      { type: 'ul', items: [
        "The interviewer may ask 'What edge cases do you handle in LC70?' to test your attention to detail.",
        "They might follow up with 'What if n=0?' to see if you cover all inputs.",
        "A deeper question could be 'How do constraints affect edge cases?' to check your understanding."
      ]},
      { type: 'subheading', en: "LC70 Edge Cases Explained" },
      { type: 'ul', items: [
        "n=0: Return 1, because no steps are taken, which counts as one way (empty path).",
        "n=1: Return 1, because there’s only one way to climb 1 stair (take 1 step).",
        "n=2: Return 2, because there are two ways (1+1 or 2).",
        "Constraints: n ≤ 45, so you don’t need to worry about overflow, but ensure you handle small inputs correctly.",
        "Why important? Missing edge cases (like n=0) can break the solution for small inputs."
      ]},
      { type: 'codeBlock', codeBlock: `
function climbStairs(n) {
  if (n <= 0) return 1; // Edge case: no steps
  if (n === 1) return 1; // Edge case: one step
  if (n === 2) return 2; // Edge case: two steps
  // Proceed with DP
}
      ` },
      { type: 'ascii', ascii: `
n=0: 1 (no steps)
n=1: 1 (1 step)
n=2: 2 (1+1, 2)
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Check n=0, n=1, n=2 manually to ensure your solution handles edge cases."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you optimize LC70 further?",
        "What are follow-up questions for LC70?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Optimize LC70 Further?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: LC70 Optimization" },
      { type: 'ul', items: [
        "The interviewer may ask 'Can you optimize LC70?' to test your ability to improve efficiency.",
        "They might follow up with 'How do you reduce space to O(1)?' to check optimization techniques.",
        "A deeper question could be 'Is there a way to reduce time complexity?' to see if you explore alternatives."
      ]},
      { type: 'subheading', en: "LC70 Optimization Explained" },
      { type: 'ul', items: [
        "Basic DP uses an array: dp[i] = dp[i-1] + dp[i-2], which takes O(n) space to store all states.",
        "Space Optimization: Since dp[i] only needs dp[i-1] and dp[i-2], use two variables (prev1, prev2) to store them, reducing space to O(1).",
        "Time Complexity: O(n) is optimal because you must compute each stair’s ways at least once.",
        "Early Exit: Handle n ≤ 2 directly (n=1 → 1, n=2 → 2) to avoid unnecessary loops.",
        "Alternative: Fibonacci formula exists, but it’s complex and not practical for interviews."
      ]},
      { type: 'codeBlock', codeBlock: `
function climbStairs(n) {
  if (n <= 2) return n; // Early exit for edge cases
  let prev1 = 1, prev2 = 2; // O(1) space
  for (let i = 3; i <= n; i++) {
    let curr = prev1 + prev2;
    prev1 = prev2;
    prev2 = curr;
  }
  return prev2;
}
      ` },
      { type: 'ascii', ascii: `
n=4:
prev1=1, prev2=2
i=3: curr=1+2=3, prev1=2, prev2=3
i=4: curr=2+3=5, prev1=3, prev2=5
Output: 5
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Practice converting LC70’s array-based solution to variables to master O(1) space."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What are follow-up questions for LC70?",
        "How do you test LC70 solutions?"
      ] }
    ]
  },
  {
    q: { en: "What Are Follow-Up Questions for LC70?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: LC70 Follow-Ups" },
      { type: 'ul', items: [
        "The interviewer may ask 'What follow-up questions do you expect for LC70?' to test your ability to anticipate variations.",
        "They might follow up with 'What if you can take k steps?' to see if you can generalize.",
        "A deeper question could be 'How do you handle additional constraints?' to check adaptability."
      ]},
      { type: 'subheading', en: "LC70 Follow-Up Questions Explained" },
      { type: 'ul', items: [
        "K Steps: Instead of 1 or 2 steps, allow 1 to k steps. Transition becomes dp[i] = sum(dp[i-j] for j=1 to k), summing all ways from previous k stairs.",
        "Min Cost: Add a cost for each step (like LC746), where dp[i] = min(dp[i-1] + cost[i-1], dp[i-2] + cost[i-2]).",
        "Restricted Steps: Some stairs are blocked, so skip them in transitions.",
        "Large n: Apply modulo (10^9+7) to handle overflow for very large n."
      ]},
      { type: 'codeBlock', codeBlock: `
function climbStairsKSteps(n, k) {
  let dp = new Array(n + 1).fill(0);
  dp[0] = 1;
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= k && i - j >= 0; j++) {
      dp[i] += dp[i - j];
    }
  }
  return dp[n];
}
      ` },
      { type: 'ascii', ascii: `
n=3, k=2:
dp[1]=1 (1 step)
dp[2]=2 (1+1, 2)
dp[3]=dp[2]+dp[1]=2+1=3
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Practice LC746 (Min Cost Climbing Stairs) to prepare for LC70 follow-ups."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you test LC70 solutions?",
        "How do you handle state transitions in LC70?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Test LC70 Solutions?" },
    level: 'fresher',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: LC70 Testing" },
      { type: 'ul', items: [
        "The interviewer may ask 'How do you test your LC70 solution?' to test your thoroughness.",
        "They might follow up with 'What test cases are critical?' to see if you cover edge cases.",
        "A deeper question could be 'How do you verify correctness?' to check your validation process."
      ]},
      { type: 'subheading', en: "LC70 Testing Explained" },
      { type: 'ul', items: [
        "Small Inputs: Test n=1 → 1 (1 step), n=2 → 2 (1+1, 2), n=3 → 3 (1+1+1, 1+2, 2+1).",
        "Edge Cases: Test n=0 → 1 (no steps), n=1 → 1, n=2 → 2.",
        "Large Inputs: Test n=45 (max constraint) to ensure no overflow and correct logic.",
        "Verify: Check if output matches manual calculation (e.g., n=3 has three ways: 1+1+1, 1+2, 2+1).",
        "Debug: Print dp[i] or variables for small n to trace the DP table."
      ]},
      { type: 'ascii', ascii: `
n=3:
dp[1]=1, dp[2]=2, dp[3]=3
Ways: [1+1+1], [1+2], [2+1]
Output: 3
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Manually list ways for n=3 to confirm your solution’s output."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle state transitions in LC70?",
        "What is the approach to solve LC198?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle State Transitions in LC70?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: LC70 State Transitions" },
      { type: 'ul', items: [
        "The interviewer may ask 'How do you derive state transitions for LC70?' to test your DP logic.",
        "They might follow up with 'Why dp[i] = dp[i-1] + dp[i-2]?' to see if you understand the logic.",
        "A deeper question could be 'How would you generalize for k steps?' to check adaptability."
      ]},
      { type: 'subheading', en: "LC70 State Transitions Explained" },
      { type: 'ul', items: [
        "State: dp[i] represents the number of ways to reach stair i.",
        "Transition: dp[i] = dp[i-1] + dp[i-2], because you can reach stair i by either taking 1 step from stair i-1 (dp[i-1] ways) or 2 steps from stair i-2 (dp[i-2] ways).",
        "Why? Each path to i-1 or i-2 is valid, and the final step (1 or 2) is the only difference, so add the ways.",
        "Base Cases: dp[1]=1, dp[2]=2, as these are the starting points.",
        "Generalization: For k steps, dp[i] = sum(dp[i-j] for j=1 to k), summing all ways from previous k stairs."
      ]},
      { type: 'ascii', ascii: `
n=4:
dp[3]=dp[2]+dp[1]=2+1=3
dp[4]=dp[3]+dp[2]=3+2=5
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Draw a small DP table (n=1 to 4) to explain transitions to the interviewer."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What is the approach to solve LC198?",
        "How do you handle edge cases in LC198?"
      ] }
    ]
  },
  // LC198: House Robber
  {
    q: { en: "What is the Approach to Solve LC198 (House Robber)?" },
    level: 'intermediate',
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: LC198 Approach" },
      { type: 'ul', items: [
        "The interviewer may ask 'How do you solve LC198?' to test your ability to apply 1D DP with choices.",
        "They might follow up with 'What’s the complexity?' to check your analysis.",
        "A deeper question could be 'Why choose between robbing or skipping?' to see if you understand the logic."
      ]},
      { type: 'subheading', en: "LC198 Approach Explained" },
      { type: 'ul', items: [
        "Problem: Find the maximum money you can rob from houses (array nums) without robbing adjacent houses.",
        "Why DP? A recursive solution (try all rob/skip combinations) is O(2^n) because it recomputes subproblems.",
        "DP Approach: Use a 1D DP array where dp[i] represents the maximum money up to house i (inclusive).",
        "State Transition: dp[i] = max(dp[i-1], dp[i-2] + nums[i]), where dp[i-1] is skipping house i, and dp[i-2] + nums[i] is robbing house i.",
        "Base Cases: dp[0]=nums[0] (only one house), dp[1]=max(nums[0], nums[1]) (choose max of first two).",
        "Optimization: Use two variables (prev1, prev2) to reduce space to O(1).",
        "Complexity: Time O(n) (loop n times), Space O(1) with variables."
      ]},
      { type: 'codeBlock', codeBlock: `
function rob(nums) {
  if (!nums.length) return 0; // Empty array
  if (nums.length === 1) return nums[0]; // One house
  let prev1 = nums[0], prev2 = Math.max(nums[0], nums[1]); // Base cases
  for (let i = 2; i < nums.length; i++) {
    let curr = Math.max(prev2, prev1 + nums[i]); // Skip or rob
    prev1 = prev2; // Shift: prev1 = dp[i-2]
    prev2 = curr; // prev2 = dp[i-1]
  }
  return prev2; // Final answer
}
      ` },
      { type: 'ascii', ascii: `
nums=[2,7,9,3,1]:
dp[0]=2 (rob house 0)
dp[1]=7 (max of 2, 7)
dp[2]=max(dp[1], dp[0]+nums[2])=max(7, 2+9)=11
dp[3]=max(dp[2], dp[1]+nums[3])=max(11, 7+3)=11
dp[4]=max(dp[3], dp[2]+nums[4])=max(11, 11+1)=12
Output: 12
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Practice LC198 to understand include/exclude choices in DP."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle edge cases in LC198?",
        "How do you optimize LC198 further?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Edge Cases in LC198?" },
    level: 'fresher',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: LC198 Edge Cases" },
      { type: 'ul', items: [
        "The interviewer may ask 'What edge cases do you handle in LC198?' to test your thoroughness.",
        "They might follow up with 'What if the array is empty?' to see if you cover all inputs.",
        "A deeper question could be 'How do constraints affect edge cases?' to check your understanding."
      ]},
      { type: 'subheading', en: "LC198 Edge Cases Explained" },
      { type: 'ul', items: [
        "Empty Array: Return 0, because no houses mean no money to rob.",
        "Single House: Return nums[0], because you rob the only house available.",
        "Two Houses: Return max(nums[0], nums[1]), because you can only rob one due to the adjacent rule.",
        "Constraints: n ≤ 100, nums[i] ≤ 400, so no overflow, but ensure you handle small arrays correctly."
      ]},
      { type: 'codeBlock', codeBlock: `
function rob(nums) {
  if (!nums.length) return 0; // Empty array
  if (nums.length === 1) return nums[0]; // One house
  if (nums.length === 2) return Math.max(nums[0], nums[1]); // Two houses
  // Proceed with DP
}
      ` },
      { type: 'ascii', ascii: `
nums=[]: 0
nums=[5]: 5
nums=[5,3]: max(5,3)=5
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Handle empty and single-house cases first in LC198 to avoid errors."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you optimize LC198 further?",
        "What are follow-up questions for LC198?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Optimize LC198 Further?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: LC198 Optimization" },
      { type: 'ul', items: [
        "The interviewer may ask 'Can you optimize LC198?' to test your efficiency skills.",
        "They might follow up with 'How do you reduce space to O(1)?' to check optimization techniques.",
        "A deeper question could be 'Is O(n) time optimal?' to see if you explore alternatives."
      ]},
      { type: 'subheading', en: "LC198 Optimization Explained" },
      { type: 'ul', items: [
        "Basic DP uses an array: dp[i] = max(dp[i-1], dp[i-2] + nums[i]), taking O(n) space.",
        "Space Optimization: Since dp[i] only needs dp[i-1] and dp[i-2], use two variables (prev1, prev2) to store them, reducing space to O(1).",
        "Time Complexity: O(n) is optimal because you must process each house to decide rob or skip.",
        "Early Exit: Handle n ≤ 2 directly (n=1 → nums[0], n=2 → max(nums[0], nums[1])).",
        "No further time optimization is practical, as each house must be considered."
      ]},
      { type: 'codeBlock', codeBlock: `
function rob(nums) {
  if (!nums.length) return 0;
  if (nums.length === 1) return nums[0];
  let prev1 = nums[0], prev2 = Math.max(nums[0], nums[1]);
  for (let i = 2; i < nums.length; i++) {
    let curr = Math.max(prev2, prev1 + nums[i]);
    prev1 = prev2;
    prev2 = curr;
  }
  return prev2;
}
      ` },
      { type: 'ascii', ascii: `
nums=[2,7,9,3]:
prev1=2, prev2=7
i=2: curr=max(7, 2+9)=11, prev1=7, prev2=11
i=3: curr=max(11, 7+3)=11, prev1=11, prev2=11
Output: 11
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Practice LC198 with variables to master O(1) space optimization."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What are follow-up questions for LC198?",
        "How do you test LC198 solutions?"
      ] }
    ]
  },
  {
    q: { en: "What Are Follow-Up Questions for LC198?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: LC198 Follow-Ups" },
      { type: 'ul', items: [
        "The interviewer may ask 'What follow-ups do you expect for LC198?' to test your ability to handle variations.",
        "They might follow up with 'What if houses form a circle?' to see if you can adapt the logic.",
        "A deeper question could be 'How do you handle additional constraints?' to check flexibility."
      ]},
      { type: 'subheading', en: "LC198 Follow-Up Questions Explained" },
      { type: 'ul', items: [
        "Circular Houses (LC213): Houses form a circle, so first and last houses are adjacent. Solve twice: exclude first house, exclude last house, take max.",
        "Weighted Houses: Each house has a weight; maximize weighted sum instead of money.",
        "Min Houses: Minimize the number of houses robbed to achieve a target amount.",
        "Constraints: Handle negative nums[i] or large n by adjusting transitions."
      ]},
      { type: 'codeBlock', codeBlock: `
function robCircular(nums) {
  if (!nums.length) return 0;
  if (nums.length === 1) return nums[0];
  return Math.max(robLinear(nums.slice(0, -1)), robLinear(nums.slice(1)));
}
function robLinear(nums) {
  if (!nums.length) return 0;
  if (nums.length === 1) return nums[0];
  let prev1 = nums[0], prev2 = Math.max(nums[0], nums[1]);
  for (let i = 2; i < nums.length; i++) {
    let curr = Math.max(prev2, prev1 + nums[i]);
    prev1 = prev2;
    prev2 = curr;
  }
  return prev2;
}
      ` },
      { type: 'ascii', ascii: `
nums=[2,3,2] (circular):
Exclude first: [3,2] -> 3
Exclude last: [2,3] -> 3
Output: 3
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Practice LC213 (House Robber II) to prepare for circular house follow-ups."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you test LC198 solutions?",
        "How do you handle state transitions in LC198?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Test LC198 Solutions?" },
    level: 'fresher',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: LC198 Testing" },
      { type: 'ul', items: [
        "The interviewer may ask 'How do you test your LC198 solution?' to test your validation process.",
        "They might follow up with 'What test cases are critical?' to see if you cover edge cases.",
        "A deeper question could be 'How do you verify no adjacent houses are robbed?' to check correctness."
      ]},
      { type: 'subheading', en: "LC198 Testing Explained" },
      { type: 'ul', items: [
        "Small Inputs: Test nums=[2,7,9,3,1] → 12 (rob houses 0, 2, 4), nums=[1,2,3] → 4 (rob houses 0, 2).",
        "Edge Cases: Test [] → 0, [5] → 5, [5,3] → 5 (max of two houses).",
        "Constraints: Test large inputs like nums=[400,400,...,400] (n=100) to ensure no overflow.",
        "Verify: Ensure no adjacent houses are included in the max sum (e.g., for [2,7,9], don’t rob 7 and 9 together).",
        "Debug: Print prev1, prev2 for each i to trace the DP logic."
      ]},
      { type: 'ascii', ascii: `
nums=[2,7,9,3,1]:
prev1=2, prev2=7
i=2: curr=max(7, 2+9)=11
i=3: curr=max(11, 7+3)=11
i=4: curr=max(11, 11+1)=12
Output: 12
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Manually trace which houses are robbed for nums=[2,7,9] to confirm correctness."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle state transitions in LC198?",
        "How do you revise DP problems?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle State Transitions in LC198?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: LC198 State Transitions" },
      { type: 'ul', items: [
        "The interviewer may ask 'How do you derive state transitions for LC198?' to test your DP logic.",
        "They might follow up with 'Why max(dp[i-1], dp[i-2] + nums[i])?' to see if you understand choices.",
        "A deeper question could be 'How do you adapt for circular houses?' to check flexibility."
      ]},
      { type: 'subheading', en: "LC198 State Transitions Explained" },
      { type: 'ul', items: [
        "State: dp[i] represents the maximum money you can rob up to house i (inclusive).",
        "Transition: dp[i] = max(dp[i-1], dp[i-2] + nums[i]), where dp[i-1] is the max without robbing house i, and dp[i-2] + nums[i] is the max if you rob house i.",
        "Why? You can’t rob adjacent houses, so you either skip house i (take dp[i-1]) or rob it but skip i-1 (take dp[i-2] + nums[i]).",
        "Base Cases: dp[0]=nums[0] (rob first house), dp[1]=max(nums[0], nums[1]) (choose max of first two).",
        "Circular (LC213): Run DP twice—exclude first house, exclude last house—to avoid adjacent first/last."
      ]},
      { type: 'ascii', ascii: `
nums=[2,7,9]:
dp[0]=2
dp[1]=max(2, 7)=7
dp[2]=max(dp[1], dp[0]+nums[2])=max(7, 2+9)=11
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Explain the rob-or-skip choice clearly to show your understanding."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you revise DP problems?",
        "How do you debug DP solutions?"
      ] }
    ]
  },
  // Cross-Cutting Concepts
  {
    q: { en: "How Do You Revise DP Problems for FAANG Interviews?" },
    level: 'intermediate',
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Revision Routine" },
      { type: 'ul', items: [
        "The interviewer may ask 'How do you prepare DP for FAANG interviews?' to test your study plan.",
        "They might follow up with 'Which problems should you focus on?' to see if you prioritize correctly.",
        "A deeper question could be 'How do you retain DP concepts long-term?' to check your learning strategy."
      ]},
      { type: 'subheading', en: "Revision Routine Explained" },
      { type: 'ul', items: [
        "Daily Practice: Solve 1-2 DP problems like LC70 (Climbing Stairs) and LC198 (House Robber) to build intuition for 1D DP.",
        "Focus on Basics: Master state transitions (e.g., LC70 dp[i]=dp[i-1]+dp[i-2]) and base cases (e.g., LC198 dp[0]=nums[0]).",
        "Weekly Mock Interviews: Simulate FAANG interviews with timed sessions (30 min) for LC70 and LC198, explaining your logic aloud.",
        "Review Variations: Practice follow-ups like LC213 (circular houses) and LC746 (min cost stairs) to handle twists.",
        "Use Resources: Refer to LeetCode discussions or DSA Prep Guide for LC70, LC198 solutions."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Solve LC70 daily and explain it aloud to build confidence."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you debug DP solutions?",
        "How do you handle interviewer hints in DP?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Debug DP Solutions?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Debugging DP" },
      { type: 'ul', items: [
        "The interviewer may ask 'How do you debug a DP solution?' to test your problem-solving skills.",
        "They might follow up with 'What common bugs do you look for?' to see if you know DP pitfalls.",
        "A deeper question could be 'How do you trace a DP table?' to check your debugging process."
      ]},
      { type: 'subheading', en: "Debugging DP Explained" },
      { type: 'ul', items: [
        "Check Base Cases: Ensure they’re correct, e.g., LC70 (dp[1]=1, dp[2]=2), LC198 (dp[0]=nums[0]).",
        "Verify Transitions: Confirm the formula, e.g., LC70 (dp[i]=dp[i-1]+dp[i-2]), LC198 (max(dp[i-1], dp[i-2]+nums[i])).",
        "Print DP Table: For small inputs, log dp[i] or variables to see if values match manual calculations.",
        "Test Edge Cases: Run with empty arrays (LC198 [] → 0) or single elements (LC70 n=1 → 1).",
        "Trace Manually: For nums=[2,7,9], calculate dp[0]=2, dp[1]=7, dp[2]=11 by hand to compare."
      ]},
      { type: 'codeBlock', codeBlock: `
function rob(nums) {
  if (!nums.length) return 0;
  let dp = [];
  dp[0] = nums[0];
  console.log(\`dp[0]=\${dp[0]}\`); // Debug
  // Proceed with DP
}
      ` },
      { type: 'ascii', ascii: `
nums=[2,7,9]:
dp[0]=2, dp[1]=7, dp[2]=11
Debug: Log dp[i] to check
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Use console.log to print the DP table for small inputs to spot errors."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle interviewer hints in DP?",
        "What are real-world applications of DP?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Interviewer Hints in DP?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Interviewer Hints" },
      { type: 'ul', items: [
        "The interviewer may ask 'How do you use hints in a DP problem?' to test your adaptability.",
        "They might follow up with 'What if I hint at a specific state?' to see if you can adjust.",
        "A deeper question could be 'How do you pivot from a wrong approach?' to check flexibility."
      ]},
      { type: 'subheading', en: "Handling Interviewer Hints Explained" },
      { type: 'ul', items: [
        "Listen Carefully: If the interviewer hints at a state (e.g., 'Think about ways to reach stair i' for LC70), define dp[i] clearly.",
        "Incorporate Hints: If they suggest a transition (e.g., 'Consider robbing or skipping' for LC198), adjust your formula to include/exclude choices.",
        "Clarify: Ask if the hint implies 1D or 2D DP, or if it suggests optimization (e.g., O(1) space for LC70).",
        "Pivot: If you start with recursion and they hint at iteration, switch to tabulation (e.g., LC70 variables).",
        "Example: For LC198, if they say 'What about the previous two houses?', focus on dp[i-2] in the transition."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Repeat the interviewer’s hint aloud to confirm you understand it before coding."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What are real-world applications of DP?",
        "How do you explain DP to non-technical audiences?"
      ] }
    ]
  },
  {
    q: { en: "What Are Real-World Applications of DP?" },
    level: 'senior',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Real-World Applications" },
      { type: 'ul', items: [
        "The interviewer may ask 'Where is DP used in real systems?' to test your practical knowledge.",
        "They might follow up with 'How does DP scale in production?' to see if you understand real-world constraints.",
        "A deeper question could be 'How do you optimize DP for large data?' to check scalability."
      ]},
      { type: 'subheading', en: "Real-World Applications Explained" },
      { type: 'ul', items: [
        "Resource Allocation: DP optimizes resource use, like Knapsack for budgeting or LC1011-like capacity planning.",
        "Text Processing: LC1143 (LCS) is used in spell checkers or diff tools (e.g., Git compares file versions).",
        "Pathfinding: LC62 (Unique Paths) applies to robotics or GPS navigation for finding optimal routes.",
        "Finance: Portfolio optimization uses Knapsack-like DP to maximize returns within risk limits.",
        "Scaling: Use rolling arrays or parallel DP for large inputs in production systems."
      ]},
      { type: 'ascii', ascii: `
LC1143 (LCS):
text1="ABCD", text2="ACDF"
dp[2][2]=2 (matches "AC")
Use: Spell checker finds similar words
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Relate LC198 to budgeting apps to make DP practical in interviews."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you explain DP to non-technical audiences?",
        "How do you handle iterative vs. recursive DP?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Explain DP to Non-Technical Audiences?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Non-Technical Explanation" },
      { type: 'ul', items: [
        "The interviewer may ask 'Can you explain DP to a non-technical person?' to test your communication skills.",
        "They might follow up with 'How do you make LC70 relatable?' to see if you can simplify.",
        "A deeper question could be 'How do you avoid technical jargon?' to check clarity."
      ]},
      { type: 'subheading', en: "Non-Technical Explanation" },
      { type: 'ul', items: [
        "Analogy: DP is like planning a budget by reusing calculations from smaller budgets to avoid redoing work.",
        "For LC70 (Climbing Stairs), it’s like counting all possible ways to climb a staircase by combining ways to climb smaller steps, remembering each step’s answer.",
        "For LC198 (House Robber), it’s like choosing which houses to rob to maximize money without alerting neighbors, using past choices to decide.",
        "Key: Emphasize breaking a big task into small, reusable steps, like planning a trip by combining shorter routes."
      ]},
      { type: 'ascii', ascii: `
LC70 (n=3):
Ways to stair 2 + Ways to stair 1 = Ways to stair 3
Analogy: Combine small plans for big plan
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Use the budgeting analogy to explain DP in simple terms."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle iterative vs. recursive DP?",
        "What are common pitfalls in DP?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Iterative vs. Recursive DP Trade-Offs?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Iterative vs. Recursive DP" },
      { type: 'ul', items: [
        "The interviewer may ask 'Should you use iterative or recursive DP?' to test your understanding of trade-offs.",
        "They might follow up with 'What are the pros and cons?' to see if you know performance impacts.",
        "A deeper question could be 'When is recursive better?' to check your decision-making."
      ]},
      { type: 'subheading', en: "Iterative vs. Recursive DP Explained" },
      { type: 'ul', items: [
        "Iterative DP (Tabulation): Uses loops to fill a DP table bottom-up, starting from base cases (e.g., LC70 dp[1]=1).",
        "Recursive DP (Memoization): Uses recursion with a cache to store results top-down, solving the big problem first (e.g., LC70 memo[n]).",
        "Pros of Iterative: Faster (no recursion overhead), can use O(1) space (LC70, LC198 with variables), better for production code.",
        "Pros of Recursive: Easier to write for complex problems (e.g., LC1143 with 2D states), clearer for initial exploration.",
        "Cons: Iterative can be harder to code for 2D DP; recursive uses O(n) space for cache and risks stack overflow."
      ]},
      { type: 'codeBlock', codeBlock: `
function climbStairsRecursive(n, memo = {}) {
  if (n <= 2) return n;
  if (n in memo) return memo[n];
  return memo[n] = climbStairsRecursive(n-1, memo) + climbStairsRecursive(n-2, memo);
}
function climbStairsIterative(n) {
  if (n <= 2) return n;
  let prev1 = 1, prev2 = 2;
  for (let i = 3; i <= n; i++) {
    let curr = prev1 + prev2;
    prev1 = prev2;
    prev2 = curr;
  }
  return prev2;
}
      ` },
      { type: 'ascii', ascii: `
Recursive (LC70):
memo[3] = memo[2] + memo[1]
Iterative (LC70):
prev1=1, prev2=2, curr=3
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Use iterative DP for LC70 and LC198 in FAANG interviews for better performance."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What are common pitfalls in DP?",
        "How do you test DP solutions effectively?"
      ] }
    ]
  },
  {
    q: { en: "What Are Common Pitfalls in DP?" },
    level: 'fresher',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Common Pitfalls" },
      { type: 'ul', items: [
        "The interviewer may ask 'What mistakes do people make in DP?' to test your awareness of errors.",
        "They might follow up with 'How do you avoid these mistakes?' to see if you have a strategy.",
        "A deeper question could be 'How do you debug a wrong DP solution?' to check your process."
      ]},
      { type: 'subheading', en: "Common Pitfalls Explained" },
      { type: 'ul', items: [
        "Incorrect Base Cases: Forgetting to set correct starting points, like LC70 (dp[1]=1, dp[2]=2). If dp[1]=0, all later values will be wrong since dp[i] builds on dp[i-1] and dp[i-2].",
        "Wrong State Transitions: Using incorrect formulas, like in LC198, writing dp[i] = dp[i-1] + nums[i] instead of max(dp[i-1], dp[i-2] + nums[i]), ignoring the choice to skip or rob.",
        "Overusing Space: Using a full array when variables suffice, like in LC70 where dp[i] only needs dp[i-1] and dp[i-2], so prev1 and prev2 are enough, saving space from O(n) to O(1).",
        "Missing Edge Cases: Forgetting to handle empty inputs (LC198 [] → 0) or small inputs (LC70 n=0 → 1), leading to runtime errors or wrong outputs.",
        "Not Initializing DP Table: Forgetting to initialize the DP array or cache, causing undefined values, like in LC1143 where dp[0][j] and dp[i][0] must be 0 for empty strings.",
        "How to Avoid: Always define base cases first, manually trace transitions for small inputs (e.g., LC70 n=3), test edge cases, and print DP values during debugging."
      ]},
      { type: 'codeBlock', codeBlock: `
function climbStairs(n) {
  if (n <= 0) return 1; // Correct base case for n=0
  if (n === 1) return 1; // Correct base case for n=1
  let dp = new Array(n + 1).fill(0); // Initialize array
  dp[1] = 1; dp[2] = 2; // Correct base cases
  for (let i = 3; i <= n; i++) {
    dp[i] = dp[i-1] + dp[i-2]; // Correct transition
    console.log(\`dp[\${i}]=\${dp[i]}\`); // Debug
  }
  return dp[n];
}
      ` },
      { type: 'ascii', ascii: `
LC70 (n=3):
dp[1]=1, dp[2]=2
dp[3]=dp[2]+dp[1]=2+1=3
Pitfall: If dp[1]=0, dp[3]=0+2=2 (wrong!)
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Manually trace LC70 for n=3 (ways: 1+1+1, 1+2, 2+1) to confirm base cases and transitions."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you test DP solutions effectively?",
        "How do you compare DP to other patterns?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Test DP Solutions Effectively?" },
    level: 'fresher',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Testing DP" },
      { type: 'ul', items: [
        "The interviewer may ask 'How do you test a DP solution?' to test your ability to validate your code.",
        "They might follow up with 'What test cases are most important?' to see if you prioritize edge cases.",
        "A deeper question could be 'How do you ensure your DP logic is correct?' to check your verification process."
      ]},
      { type: 'subheading', en: "Testing DP Solutions Explained" },
      { type: 'ul', items: [
        "Test Core Cases: For LC70, try n=3 → 3 (ways: 1+1+1, 1+2, 2+1). For LC198, try nums=[2,7,9,3,1] → 12 (rob houses 0, 2, 4). Manually list the ways or choices to confirm.",
        "Test Edge Cases: For LC70, test n=0 → 1 (no steps), n=1 → 1, n=2 → 2. For LC198, test [] → 0, [5] → 5, [5,3] → 5 (max of two houses).",
        "Test Constraints: For LC70, try n=45 (max constraint) to ensure no overflow. For LC198, try nums=[400,400,...,400] (n=100) to check large inputs.",
        "Verify Correctness: For LC70, ensure the output matches the number of ways (e.g., n=3 has three distinct paths). For LC198, check that no adjacent houses are robbed (e.g., [2,7,9] doesn’t rob 7 and 9 together).",
        "Debug with Prints: Add console.log to print dp[i] or variables for small inputs (e.g., LC70 n=3, LC198 nums=[2,7,9]) to trace the DP table and spot errors.",
        "Manual Tracing: For LC198 nums=[2,7,9], calculate: dp[0]=2, dp[1]=7, dp[2]=max(7, 2+9)=11. Compare with code output."
      ]},
      { type: 'codeBlock', codeBlock: `
function rob(nums) {
  if (!nums.length) return 0;
  if (nums.length === 1) return nums[0];
  let prev1 = nums[0], prev2 = Math.max(nums[0], nums[1]);
  console.log(\`prev1=\${prev1}, prev2=\${prev2}\`); // Debug
  for (let i = 2; i < nums.length; i++) {
    let curr = Math.max(prev2, prev1 + nums[i]);
    console.log(\`i=\${i}, curr=\${curr}\`); // Debug
    prev1 = prev2;
    prev2 = curr;
  }
  return prev2;
}
      ` },
      { type: 'ascii', ascii: `
LC198 (nums=[2,7,9]):
prev1=2, prev2=7
i=2: curr=max(7, 2+9)=11
Output: 11
Test: [2,7,9] → 11 (rob 2+9)
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Always test edge cases like empty arrays or n=1 first, then trace small inputs manually to confirm your DP logic."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you compare DP to other patterns?",
        "How do you handle stress in DP interviews?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle State Transitions in LC198?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: LC198 State Transitions" },
      { type: 'ul', items: [
        "The interviewer might ask 'How do you derive state transitions for LC198?' to test your DP logic.",
        "They might follow up with 'Why max(dp[i-1], dp[i-2] + nums[i])?' to see if you understand choices.",
        "A deeper question could be 'How do you adapt for circular houses?' to check flexibility."
      ]},
      { type: 'subheading', en: "LC198 State Transitions Explained" },
      { type: 'ul', items: [
        "State: dp[i] represents the maximum money you can rob up to house i (inclusive).",
        "Transition: dp[i] = max(dp[i-1], dp[i-2] + nums[i]), where dp[i-1] is skipping house i, and dp[i-2] + nums[i] is robbing house i.",
        "Why? You can’t rob adjacent houses, so you either skip house i (take dp[i-1]) or rob it but skip i-1 (take dp[i-2] + nums[i]).",
        "Base Cases: dp[0]=nums[0], dp[1]=max(nums[0], nums[1]).",
        "Circular (LC213): Run DP twice—exclude first house, exclude last house—to avoid adjacent first/last."
      ]},
      { type: 'ascii', ascii: `
nums=[2,7,9]:
dp[0]=2
dp[1]=7
dp[2]=max(dp[1], dp[0]+nums[2])=11
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Explain the rob-or-skip choice for clarity."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you test LC198 solutions?",
        "How do you revise DP problems?"
      ] }
    ]
  },
  // Now continuing with Batch 2 FAQs
  {
    q: { en: "What is the Approach to Solve LC1143 (Longest Common Subsequence)?" },
    level: 'intermediate',
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: LC1143 Approach" },
      { type: 'ul', items: [
        "The interviewer may ask 'How do you solve LC1143?' to test 2D DP.",
        "They might follow up with 'What’s the complexity?'",
        "A deeper question could be 'Why use a 2D table?'"
      ]},
      { type: 'subheading', en: "LC1143 Approach" },
      { type: 'ul', items: [
        "Problem: Find LCS length between two strings.",
        "DP: dp[i][j] = dp[i-1][j-1] + 1 if match, else max(dp[i-1][j], dp[i][j-1]).",
        "Time: O(nm), Space: O(nm) or O(min(n,m)) with rolling array.",
        "Key: Match or skip characters."
      ]},
      { type: 'codeBlock', codeBlock: `
function longestCommonSubsequence(text1, text2) {
  const n = text1.length, m = text2.length;
  const dp = Array(n + 1).fill().map(() => Array(m + 1).fill(0));
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      dp[i][j] = text1[i-1] === text2[j-1] ? dp[i-1][j-1] + 1 : Math.max(dp[i-1][j], dp[i][j-1]);
    }
  }
  return dp[n][m];
}
      ` },
      { type: 'ascii', ascii: `
text1="ABCD", text2="ACDF":
dp[1][1]=1 (A=A)
dp[2][1]=1 (B!=A, max)
dp[4][4]=3 (D=F? no, max=3)
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Practice LC1143 with rolling array."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle edge cases in LC1143?",
        "How do you optimize LC1143?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Edge Cases in LC1143?" },
    level: 'fresher',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: LC1143 Edge Cases" },
      { type: 'ul', items: [
        "The interviewer may ask 'What edge cases do you handle in LC1143?' to test robustness.",
        "They might follow up with 'What if one string is empty?'",
        "A deeper question could be 'What if strings are identical?'"
      ]},
      { type: 'subheading', en: "LC1143 Edge Cases" },
      { type: 'ul', items: [
        "Empty String: Return 0.",
        "Single Character: Return 1 or 0.",
        "Identical Strings: Return string length.",
        "No Common Characters: Return 0."
      ]},
      { type: 'codeBlock', codeBlock: `
function longestCommonSubsequence(text1, text2) {
  if (!text1 || !text2) return 0;
  // Proceed with DP
}
      ` },
      { type: 'ascii', ascii: `
text1="", text2="ABC": 0
text1="A", text2="A": 1
text1="ABC", text2="ABC": 3
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Test empty strings for LC1143."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you optimize LC1143?",
        "What are follow-up questions for LC1143?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Optimize LC1143?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: LC1143 Optimization" },
      { type: 'ul', items: [
        "The interviewer may ask 'Can you optimize LC1143?' to test efficiency.",
        "They might follow up with 'How do you reduce space?'",
        "A deeper question could be 'Is O(nm) time optimal?'"
      ]},
      { type: 'subheading', en: "LC1143 Optimization" },
      { type: 'ul', items: [
        "Space: O(min(n,m)) with rolling array.",
        "Time: O(nm) optimal.",
        "Early Exit: If strings identical, return min(n,m).",
        "Alternative: Hirschberg algorithm for O(nm) time, O(n) space."
      ]},
      { type: 'codeBlock', codeBlock: `
function longestCommonSubsequence(text1, text2) {
  if (text1 === text2) return text1.length;
  const [n, m] = [text1.length, text2.length];
  let dp = Array(2).fill().map(() => Array(m + 1).fill(0));
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      dp[i%2][j] = text1[i-1] === text2[j-1] ? dp[(i-1)%2][j-1] + 1 : Math.max(dp[(i-1)%2][j], dp[i%2][j-1]);
    }
  }
  return dp[n%2][m];
}
      ` },
      { type: 'ascii', ascii: `
text1="AB", text2="AC":
dp[0]=[0,0,0]
dp[1][1]=1
dp[1][2]=1
Output: 1
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Practice rolling array for LC1143."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What are follow-up questions for LC1143?",
        "How do you test LC1143 solutions?"
      ] }
    ]
  },
  {
    q: { en: "What Are Follow-Up Questions for LC1143?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: LC1143 Follow-Ups" },
      { type: 'ul', items: [
        "The interviewer may ask 'What follow-ups do you expect for LC1143?' to test adaptability.",
        "They might follow up with 'How do you find the actual LCS?'",
        "A deeper question could be 'How do you extend to edit distance?'"
      ]},
      { type: 'subheading', en: "LC1143 Follow-Up Questions" },
      { type: 'ul', items: [
        "Actual LCS: Backtrack from dp[n][m] to construct string.",
        "Edit Distance (LC72): Modify transitions for insert/delete/replace.",
        "Longest Common Substring: Reset dp[i][j] if no match.",
        "Multiple Strings: Extend to 3D DP for LCS of 3 strings."
      ]},
      { type: 'codeBlock', codeBlock: `
function getLCS(text1, text2, dp) {
  let lcs = [], i = text1.length, j = text2.length;
  while (i > 0 && j > 0) {
    if (text1[i-1] === text2[j-1]) {
      lcs.push(text1[i-1]);
      i--; j--;
    } else if (dp[i-1][j] >= dp[i][j-1]) {
      i--;
    } else {
      j--;
    }
  }
  return lcs.reverse().join('');
}
      ` },
      { type: 'ascii', ascii: `
text1="ABCD", text2="ACDF":
dp[4][4]=3
Backtrack: ACD
Output: "ACD"
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Practice LC72 for LC1143 follow-ups."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you test LC1143 solutions?",
        "How do you handle state transitions in LC1143?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Test LC1143 Solutions?" },
    level: 'fresher',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: LC1143 Testing" },
      { type: 'ul', items: [
        "The interviewer may ask 'How do you test your LC1143 solution?' to test your validation process.",
        "They might follow up with 'What test cases are critical?' to see if you cover edge cases.",
        "A deeper question could be 'How do you verify the LCS length?' to check correctness."
      ]},
      { type: 'subheading', en: "LC1143 Testing Explained" },
      { type: 'ul', items: [
        "Core Cases: Test text1='ABCD', text2='ACDF' → 3 (LCS='ACD'). Test text1='ABC', text2='DEF' → 0 (no common characters).",
        "Edge Cases: Test text1='', text2='ABC' → 0, text1='A', text2='A' → 1, text1='A', text2='B' → 0.",
        "Constraints: Test large inputs (n,m=1000) to ensure no performance issues or overflow.",
        "Verify: Manually trace the DP table for small inputs (e.g., text1='AB', text2='AC') to confirm dp[2][2]=1 (LCS='A').",
        "Debug: Print dp[i][j] for each cell to check transitions (match vs. max of skips)."
      ]},
      { type: 'codeBlock', codeBlock: `
function longestCommonSubsequence(text1, text2) {
  if (!text1 || !text2) return 0;
  const n = text1.length, m = text2.length;
  const dp = Array(n + 1).fill().map(() => Array(m + 1).fill(0));
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      dp[i][j] = text1[i-1] === text2[j-1] ? dp[i-1][j-1] + 1 : Math.max(dp[i-1][j], dp[i][j-1]);
      console.log(\`dp[\${i}][\${j}]=\${dp[i][j]}\`); // Debug
    }
  }
  return dp[n][m];
}
      ` },
      { type: 'ascii', ascii: `
text1="AB", text2="AC":
  A C
A 1 1
B 1 1
Output: 1 (LCS="A")
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Manually trace the LCS for text1='AB', text2='AC' (LCS='A') to confirm your DP table."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle state transitions in LC1143?",
        "What is the approach to solve 0/1 Knapsack?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle State Transitions in LC1143?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: LC1143 State Transitions" },
      { type: 'ul', items: [
        "The interviewer may ask 'How do you derive state transitions for LC1143?' to test your 2D DP logic.",
        "They might follow up with 'Why take the max when characters don’t match?' to see if you understand choices.",
        "A deeper question could be 'How do you adapt for longest common substring?' to check flexibility."
      ]},
      { type: 'subheading', en: "LC1143 State Transitions Explained" },
      { type: 'ul', items: [
        "State: dp[i][j] represents the LCS length for text1[0:i] and text2[0:j].",
        "Transition: If text1[i-1] === text2[j-1], dp[i][j] = dp[i-1][j-1] + 1 (include matching character). Else, dp[i][j] = max(dp[i-1][j], dp[i][j-1]) (skip a character from either string).",
        "Why Max? When characters don’t match, you try skipping one from text1 (dp[i-1][j]) or text2 (dp[i][j-1]) to find the longest subsequence possible.",
        "Base Cases: dp[0][j] = 0, dp[i][0] = 0, as empty strings have no common subsequence.",
        "Example: For text1='AB', text2='AC', at i=1, j=1 (A vs. A), dp[1][1] = dp[0][0] + 1 = 1. At i=2, j=2 (B vs. C), dp[2][2] = max(dp[1][2], dp[2][1]) = 1.",
        "Adapt for Substring: If not match, dp[i][j] = 0 (must be contiguous)."
      ]},
      { type: 'ascii', ascii: `
text1="AB", text2="AC":
i=1, j=1: A=A, dp[1][1]=dp[0][0]+1=1
i=1, j=2: A!=C, dp[1][2]=max(dp[0][2], dp[1][1])=1
i=2, j=1: B!=A, dp[2][1]=max(dp[1][1], dp[2][0])=1
i=2, j=2: B!=C, dp[2][2]=max(dp[1][2], dp[2][1])=1
Output: 1
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Draw the 2D table for text1='AB', text2='AC' (dp[2][2]=1) to explain transitions."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What is the approach to solve 0/1 Knapsack?",
        "How do you handle edge cases in Knapsack?"
      ] }
    ]
  },
  // 0/1 Knapsack
  {
    q: { en: "What is the Approach to Solve 0/1 Knapsack?" },
    level: 'intermediate',
    important: true,
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Knapsack Approach" },
      { type: 'ul', items: [
        "The interviewer may ask 'How do you solve the 0/1 Knapsack problem?' to test your 2D DP skills.",
        "They might follow up with 'What’s the time and space complexity?' to check your analysis.",
        "A deeper question could be 'Why use a 2D table for Knapsack?' to see if you understand the state design."
      ]},
      { type: 'subheading', en: "0/1 Knapsack Approach Explained" },
      { type: 'ul', items: [
        "Problem: Given n items with weights w[i] and values v[i], and capacity W, maximize total value without exceeding W, with each item taken 0 or 1 time.",
        "Why DP? Recursive (try include/exclude for each item) is O(2^n) due to overlapping subproblems (same item/weight combinations).",
        "DP Approach: Use 2D DP table dp[i][w] = max value for first i items with capacity w.",
        "State Transition: If w[i-1] <= w, dp[i][w] = max(dp[i-1][w], dp[i-1][w - w[i-1]] + v[i-1]) (exclude or include item i-1). Else, dp[i][w] = dp[i-1][w].",
        "Base Cases: dp[0][w] = 0 (no items), dp[i][0] = 0 (no capacity).",
        "Optimization: Use 1D dp[w] with right-to-left update to reduce space to O(W).",
        "Complexity: Time O(nW) (fill n*W table, O(1) per cell), Space O(nW) or O(W) with 1D array."
      ]},
      { type: 'codeBlock', codeBlock: `
function knapsack(values, weights, W) {
  const n = values.length;
  const dp = Array(n + 1).fill().map(() => Array(W + 1).fill(0));
  for (let i = 1; i <= n; i++) {
    for (let w = 1; w <= W; w++) {
      if (weights[i-1] <= w) {
        dp[i][w] = Math.max(dp[i-1][w], dp[i-1][w - weights[i-1]] + values[i-1]);
      } else {
        dp[i][w] = dp[i-1][w];
      }
    }
  }
  return dp[n][W];
}
      ` },
      { type: 'ascii', ascii: `
values=[60,100,120], weights=[10,20,30], W=50:
  0 10 20 30 40 50
0  0  0  0  0  0  0
1  0 60 60 60 60 60
2  0 60 100 100 160 160
3  0 60 100 120 160 220
Output: 220
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Practice Knapsack with small n=3, W=50 to understand include/exclude choices manually."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle edge cases in Knapsack?",
        "How do you optimize Knapsack space?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Edge Cases in 0/1 Knapsack?" },
    level: 'fresher',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Knapsack Edge Cases" },
      { type: 'ul', items: [
        "The interviewer may ask 'What edge cases do you handle in Knapsack?' to test your thoroughness.",
        "They might follow up with 'What if capacity is 0?' to see if you cover base cases.",
        "A deeper question could be 'How do constraints affect edge cases?' to check your understanding."
      ]},
      { type: 'subheading', en: "Knapsack Edge Cases Explained" },
      { type: 'ul', items: [
        "No Items (n=0): Return 0, as no items mean no value.",
        "Zero Capacity (W=0): Return 0, as no items can be taken.",
        "Single Item: If weights[0] <= W, return values[0]; else, return 0.",
        "Constraints: Typically, n ≤ 100, W ≤ 1000, weights[i], values[i] ≥ 0, so handle negative values if specified (though not in 0/1 Knapsack)."
      ]},
      { type: 'codeBlock', codeBlock: `
function knapsack(values, weights, W) {
  if (!values.length || W === 0) return 0; // Edge cases
  const n = values.length;
  let dp = Array(W + 1).fill(0);
  for (let i = 0; i < n; i++) {
    for (let w = W; w >= weights[i]; w--) {
      dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);
    }
  }
  return dp[W];
}
      ` },
      { type: 'ascii', ascii: `
n=0, W=50: 0
W=0, values=[60]: 0
n=1, W=10, weights=[20]: 0
n=1, W=20, weights=[10], values=[60]: 60
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Test W=0 and n=0 to ensure your Knapsack solution handles edge cases."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you optimize Knapsack further?",
        "What are follow-up questions for Knapsack?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Optimize 0/1 Knapsack Further?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Knapsack Optimization" },
      { type: 'ul', items: [
        "The interviewer may ask 'Can you optimize Knapsack?' to test your efficiency.",
        "They might follow up with 'How do you reduce space to O(W)?' to check rolling array knowledge.",
        "A deeper question could be 'Is O(nW) time optimal?' to see if you explore alternatives."
      ]},
      { type: 'subheading', en: "0/1 Knapsack Optimization Explained" },
      { type: 'ul', items: [
        "Basic DP: Uses a 2D array dp[i][w], taking O(nW) space for n items and capacity W.",
        "Space Optimization: Use a 1D array dp[w] since dp[i][w] only needs dp[i-1][w] and dp[i-1][w-w[i]]. Update dp[w] from right to left (W down to w[i]) to avoid overwriting needed values, reducing space to O(W).",
        "Time Complexity: O(nW) is optimal, as you must consider each item and weight combination.",
        "Early Exit: If W=0 or n=0, return 0 immediately.",
        "Trade-Off: Rolling array saves space but requires careful iteration (right to left)."
      ]},
      { type: 'codeBlock', codeBlock: `
function knapsack(values, weights, W) {
  if (!values.length || W === 0) return 0; // Early exit
  const n = values.length;
  let dp = Array(W + 1).fill(0);
  for (let i = 0; i < n; i++) {
    for (let w = W; w >= weights[i]; w--) { // Right to left
      dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);
    }
  }
  return dp[W];
}
      ` },
      { type: 'ascii', ascii: `
values=[60,100], weights=[10,20], W=30:
dp=[0,...,0]
i=0: dp[10]=60, dp[20]=60, dp[30]=60
i=1: dp[20]=100 (max(60,60+100? no, w=20<20? no wait, w=30: max(60,60+100=160))
Output: 160
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Practice Knapsack’s 1D DP to master right-to-left updates."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "What are follow-up questions for Knapsack?",
        "How do you test Knapsack solutions?"
      ] }
    ]
  },
  {
    q: { en: "What Are Follow-Up Questions for 0/1 Knapsack?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Knapsack Follow-Ups" },
      { type: 'ul', items: [
        "The interviewer may ask 'What follow-ups do you expect for Knapsack?' to test your ability to handle variations.",
        "They might follow up with 'What if items can be taken multiple times?' to see if you can adapt.",
        "A deeper question could be 'How do you find the selected items?' to check backtracking."
      ]},
      { type: 'subheading', en: "0/1 Knapsack Follow-Up Questions Explained" },
      { type: 'ul', items: [
        "Unbounded Knapsack: Allow items to be taken multiple times. Change transition to dp[w] = max(dp[w], dp[w-weights[i]] + values[i]) for all i, using a 1D array.",
        "Selected Items: Track which items are included by storing choices in a separate array or backtracking from dp[n][W].",
        "Bounded Knapsack: Limit each item to k uses, requiring a modified DP table or additional loop.",
        "Constraints: Handle negative weights/values or large W (e.g., W ≤ 10^5) by adjusting transitions."
      ]},
      { type: 'codeBlock', codeBlock: `
function unboundedKnapsack(values, weights, W) {
  let dp = Array(W + 1).fill(0);
  for (let w = 0; w <= W; w++) {
    for (let i = 0; i < values.length; i++) {
      if (weights[i] <= w) {
        dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);
      }
    }
  }
  return dp[W];
}
      ` },
      { type: 'ascii', ascii: `
Unbounded: values=[60,100], weights=[10,20], W=30:
dp[10]=60
dp[20]=120 (60+60)
dp[30]=180 (60+60+60)
Output: 180
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Practice unbounded Knapsack to prepare for follow-ups."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you test Knapsack solutions?",
        "How do you handle state transitions in Knapsack?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Test 0/1 Knapsack Solutions?" },
    level: 'fresher',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Knapsack Testing" },
      { type: 'ul', items: [
        "The interviewer may ask 'How do you test your Knapsack solution?' to test your validation process.",
        "They might follow up with 'What test cases are critical?' to see if you cover edge cases.",
        "A deeper question could be 'How do you verify selected items?' to check correctness."
      ]},
      { type: 'subheading', en: "0/1 Knapsack Testing Explained" },
      { type: 'ul', items: [
        "Core Cases: Test values=[60,100,120], weights=[10,20,30], W=50 → 220 (include items 2,3). Test values=[10,20], weights=[5,10], W=15 → 30 (include items 0,1).",
        "Edge Cases: Test n=0 → 0, W=0 → 0, n=1, W=5, weights=[10] → 0 (can’t take item).",
        "Constraints: Test large inputs (n=100, W=1000) to ensure no performance issues.",
        "Verify: Manually trace dp table for small inputs (e.g., values=[60,100], weights=[10,20], W=30 → 160, items=[0,1]).",
        "Debug: Print dp[i][w] for each cell to check transitions (include vs. exclude)."
      ]},
      { type: 'codeBlock', codeBlock: `
function knapsack(values, weights, W) {
  if (!values.length || W === 0) return 0;
  const n = values.length;
  let dp = Array(W + 1).fill(0);
  for (let i = 0; i < n; i++) {
    for (let w = W; w >= weights[i]; w--) {
      dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);
    }
    console.log(\`i=\${i}, dp=\${dp}\`); // Debug
  }
  return dp[W];
}
      ` },
      { type: 'ascii', ascii: `
values=[60,100], weights=[10,20], W=30:
i=0: dp[10]=60, dp[20]=60, dp[30]=60
i=1: dp[20]=100, dp[30]=160
Output: 160
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Manually trace Knapsack for n=2, W=30 (value=160) to confirm include/exclude choices."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle state transitions in Knapsack?",
        "How do you conduct mock interviews for DP?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle State Transitions in 0/1 Knapsack?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Knapsack State Transitions" },
      { type: 'ul', items: [
        "The interviewer may ask 'How do you derive state transitions for Knapsack?' to test your 2D DP logic.",
        "They might follow up with 'Why take the max of include/exclude?' to see if you understand choices.",
        "A deeper question could be 'How do you adapt for unbounded Knapsack?' to check flexibility."
      ]},
      { type: 'subheading', en: "0/1 Knapsack State Transitions Explained" },
      { type: 'ul', items: [
        "State: dp[i][w] represents the maximum value for the first i items with weight limit w.",
        "Transition: If weights[i-1] <= w, dp[i][w] = max(dp[i-1][w], dp[i-1][w - weights[i-1]] + values[i-1]) (exclude or include item i-1). Else, dp[i][w] = dp[i-1][w] (can’t include).",
        "Why Max? You either skip item i-1 (dp[i-1][w]) or include it (dp[i-1][w - weights[i-1]] + values[i-1]) to maximize value within weight w.",
        "Base Cases: dp[0][w] = 0, dp[i][0] = 0.",
        "Unbounded: dp[w] = max(dp[w], dp[w - weights[i]] + values[i]) for all i, allowing multiple uses."
      ]},
      { type: 'ascii', ascii: `
values=[60,100], weights=[10,20], W=30:
i=1, w=10: dp[1][10]=60 (include)
i=2, w=30: dp[2][30]=max(dp[1][30], dp[1][10]+100)=160
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Explain the include/exclude choice for Knapsack clearly on the whiteboard."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you conduct mock interviews for DP?",
        "How do you handle stress in DP interviews?"
      ] }
    ]
  },
  // Cross-Cutting Concepts
  {
    q: { en: "How Do You Conduct Mock Interviews for DP?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Mock Interviews" },
      { type: 'ul', items: [
        "The interviewer may ask 'How do you practice DP with mock interviews?' to test your preparation strategy.",
        "They might follow up with 'What problems do you choose?' to see if you prioritize correctly.",
        "A deeper question could be 'How do you simulate FAANG interviews?' to check realism."
      ]},
      { type: 'subheading', en: "Mock Interviews Explained" },
      { type: 'ul', items: [
        "Setup: Use a timer (30-45 min) and a whiteboard or code editor to simulate FAANG interviews. Solve problems like LC70, LC198, LC1143, and Knapsack.",
        "Explain Aloud: Practice explaining your thought process (e.g., LC1143’s 2D table, Knapsack’s include/exclude) as if to an interviewer.",
        "Choose Problems: Focus on classics (LC70, LC198) for 1D DP, LC1143, Knapsack for 2D DP, and follow-ups (LC213, LC72).",
        "Peer Review: Pair with a friend or use platforms like LeetCode’s mock interview feature to get feedback.",
        "Simulate Stress: Add constraints like time limits or no internet to mimic real interviews."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Record yourself solving LC1143 to review your explanation clarity."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle stress in DP interviews?",
        "How do you compare DP to greedy algorithms?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Stress in DP Interviews?" },
    level: 'fresher',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Stress Handling" },
      { type: 'ul', items: [
        "The interviewer may ask 'How do you stay calm in DP interviews?' to test your composure.",
        "They might follow up with 'What if you get stuck?' to see if you can recover.",
        "A deeper question could be 'How do you handle unclear problem statements?' to check problem-solving."
      ]},
      { type: 'subheading', en: "Stress Handling Explained" },
      { type: 'ul', items: [
        "Break Down the Problem: For LC1143, start by defining dp[i][j] and base cases to build confidence.",
        "Think Aloud: Explain each step (e.g., Knapsack’s include/exclude) to show clarity and stay focused.",
        "Use Examples: For LC70, list ways for n=3 (1+1+1, 1+2, 2+1) to understand the problem.",
        "Handle Stuck Moments: If stuck on LC198, try a smaller input (nums=[2,7]) or ask clarifying questions.",
        "Practice Under Pressure: Do timed mock interviews (30 min for LC1143) to build resilience."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Do a timed 30-min practice for LC70 to simulate interview stress."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you compare DP to greedy algorithms?",
        "How do you optimize rolling arrays in DP?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Compare DP to Greedy Algorithms?" },
    level: 'senior',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: DP vs. Greedy" },
      { type: 'ul', items: [
        "The interviewer may ask 'How does DP differ from greedy algorithms?' to test your pattern knowledge.",
        "They might follow up with 'When is greedy better than DP?' to see if you know trade-offs.",
        "A deeper question could be 'Can LC198 be solved greedily?' to check your analysis."
      ]},
      { type: 'subheading', en: "DP vs. Greedy Explained" },
      { type: 'ul', items: [
        "DP: Solves problems by considering all possible choices and storing subproblem solutions (e.g., LC198 maximizes money by choosing rob or skip for each house).",
        "Greedy: Makes locally optimal choices without revisiting (e.g., activity selection picks earliest ending activity).",
        "When DP? Use for problems with overlapping subproblems and optimal substructure, like LC70 (all ways), LC1143 (all subsequences), Knapsack (all combinations).",
        "When Greedy? Use when local choices lead to global optimum, like Kruskal’s algorithm for MST. LC198 can’t be greedy, as picking max value locally may violate adjacent rule.",
        "Trade-Offs: DP picks optimal solutions but is slower (O(n) or O(nm)); greedy is faster (O(n)) but may fail (e.g., LC198)."
      ]},
      { type: 'ascii', ascii: `
LC198 (nums=[2,7,9]):
DP: max(7, 2+9)=11
Greedy: Pick 7 (max), fail to get 11
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Explain why LC198 needs DP (all choices) vs. greedy (local max fails)."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you optimize rolling arrays in DP?",
        "How do you compare DP to backtracking?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Optimize Rolling Arrays in DP?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Rolling Arrays" },
      { type: 'ul', items: [
        "The interviewer may ask 'How do rolling arrays work in DP?' to test your space optimization skills.",
        "They might follow up with 'How do you apply them to LC1143?' to see if you can implement it.",
        "A deeper question could be 'What are the trade-offs?' to check your understanding."
      ]},
      { type: 'subheading', en: "Rolling Arrays Explained" },
      { type: 'ul', items: [
        "Rolling Arrays: Instead of a full 2D DP table, use a smaller array (e.g., two rows or one row) to store only necessary states, updating them as you go.",
        "For LC1143: dp[i][j] needs dp[i-1][j], dp[i][j-1], dp[i-1][j-1], so store two rows (current and previous), reducing space from O(nm) to O(min(n,m)).",
        "For Knapsack: dp[i][w] needs dp[i-1][w] and dp[i-1][w-w[i]], so use one row dp[w], updating right to left to avoid overwriting needed values.",
        "Trade-Offs: Saves memory but makes code slightly harder to read.",
        "Implementation Tip: Swap arrays or use modulo (dp[i%2][j]) to alternate between two rows."
      ]},
      { type: 'codeBlock', codeBlock: `
function longestCommonSubsequence(text1, text2) {
  const n = text1.length, m = text2.length;
  let dp = Array(2).fill().map(() => Array(m + 1).fill(0));
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      dp[i%2][j] = text1[i-1] === text2[j-1] ? dp[(i-1)%2][j-1] + 1 : Math.max(dp[(i-1)%2][j], dp[i%2][j-1]);
    }
  }
  return dp[n%2][m];
}
      ` },
      { type: 'ascii', ascii: `
LC1143 (text1="AB", text2="AC"):
dp[0]=[0,0,0]
dp[1][1]=1 (A=A)
dp[1][2]=1 (max)
Swap: dp[0]=[0,1,1]
Output: 1
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Practice rolling array for LC1143 to explain space savings in interviews."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you compare DP to backtracking?",
        "How do you handle large inputs in DP?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Compare DP to Backtracking?" },
    level: 'senior',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: DP vs. Backtracking" },
      { type: 'ul', items: [
        "The interviewer may ask 'How does DP differ from backtracking?' to test your pattern knowledge.",
        "They might follow up with 'When is DP better than backtracking?' to see if you know trade-offs.",
        "A deeper question could be 'Can LC1143 be solved with backtracking?' to check your analysis."
      ]},
      { type: 'subheading', en: "DP vs. Backtracking Explained" },
      { type: 'ul', items: [
        "DP: Solves problems by storing subproblem solutions (same input, same output) to avoid recomputation, achieving polynomial time (O(nm) for LC1143).",
        "Backtracking: Explores all possible paths recursively, undoing choices, often exponential (O(2^n) for LC1143 trying all subsequences).",
        "When DP? Use for optimization with overlapping subproblems (LC70, LC198, LC1143, Knapsack).",
        "When Backtracking? Use for generating all solutions (e.g., LC46, LC51) or when subproblems don’t overlap.",
        "LC1143: Backtracking is O(2^n) due to trying all subsequences, while DP is O(nm) with a table."
      ]},
      { type: 'ascii', ascii: `
LC1143 (text1="AB", text2="AC"):
Backtracking: Try all subsequences (O(2^n))
DP: dp[2][2]=1 (O(nm))
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Explain why LC1143’s overlapping subproblems make DP faster than backtracking."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle large inputs in DP?",
        "How do you prioritize DP problems for FAANG prep?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Large Inputs in DP?" },
    level: 'senior',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Large Inputs" },
      { type: 'ul', items: [
        "The interviewer may ask 'How do you handle large inputs in DP?' to test your efficiency.",
        "They might follow up with 'What optimizations help?' to see if you know practical techniques.",
        "A deeper question could be 'How do you parallelize DP?' to check advanced concepts."
      ]},
      { type: 'subheading', en: "Large Inputs Explained" },
      { type: 'ul', items: [
        "Space Optimization: Use rolling arrays (LC1143: O(min(n,m)), Knapsack: O(W)) to reduce memory for large n, m, or W.",
        "Early Exits: Check edge cases (e.g., LC1143 empty strings, Knapsack W=0) to avoid unnecessary computation.",
        "Parallelization: For 2D DP (LC1143, Knapsack), parallelize independent rows/columns using multi-threading if n, m, or W are huge.",
        "Pruning: Skip invalid states (e.g., Knapsack w < min(weights)) to reduce computation.",
        "Example: For LC1143 with n,m=10^5, use rolling array and check for early termination if no common characters."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Practice LC1143 with rolling array to handle large inputs."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you prioritize DP problems for FAANG prep?",
        "How do you explain DP time complexity to interviewers?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Prioritize DP Problems for FAANG Prep?" },
    level: 'fresher',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Problem Prioritization" },
      { type: 'ul', items: [
        "The interviewer may ask 'Which DP problems should you focus on for FAANG?' to test your preparation strategy.",
        "They might follow up with 'Why prioritize these problems?' to see if you understand their importance.",
        "A deeper question could be 'How do you balance 1D and 2D DP?' to check your study plan."
      ]},
      { type: 'subheading', en: "Prioritization Explained" },
      { type: 'ul', items: [
        "Start with 1D DP: Practice LC70 (Climbing Stairs) and LC198 (House Robber) to learn basic state transitions and space optimization.",
        "Move to 2D DP: Then do LC1143 (LCS) and LC62 (Unique Paths) to understand table filling and multiple dimensions.",
        "Include Knapsack: Practice 0/1 Knapsack to learn include/exclude choices and space optimizations like rolling arrays.",
        "Why Prioritize? These cover core DP patterns (counting, maximization, sequences) and are FAANG favorites.",
        "Balance: Spend 50% on 1D DP (easier to grasp) and 50% on 2D DP (more complex but common in interviews)."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Solve LC70 and LC198 daily for 1D DP practice."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you explain DP time complexity to interviewers?",
        "How do you handle ambiguous DP problem statements?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Explain DP Time Complexity to Interviewers?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Time Complexity Explanation" },
      { type: 'ul', items: [
        "The interviewer may ask 'How do you explain DP time complexity?' to test your communication.",
        "They might follow up with 'How does it apply to LC1143?' to see if you can relate it.",
        "A deeper question could be 'How do you optimize time complexity?' to check efficiency."
      ]},
      { type: 'subheading', en: "Time Complexity Explanation" },
      { type: 'ul', items: [
        "General Rule: Time = (number of states) × (work per state).",
        "For 1D DP (LC70): n states, O(1) work per state → O(n).",
        "For 2D DP (LC1143): n*m states, O(1) work per state → O(nm).",
        "Optimization: Reduce states (e.g., rolling array), use early exits for invalid states.",
        "Explain to Interviewer: 'For LC1143, we fill a table of n*m cells, each taking constant time to compute a match or max, so O(nm).'"
      ]},
      { type: 'ascii', ascii: `
LC70: n states, O(1) per state -> O(n)
LC1143: n*m states, O(1) per state -> O(nm)
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Draw the DP table size on the whiteboard to explain time complexity."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle ambiguous DP problem statements?",
        "How do you debug 2D DP solutions?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Ambiguous DP Problem Statements?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Ambiguous Statements" },
      { type: 'ul', items: [
        "The interviewer may ask 'How do you clarify a vague DP problem?' to test your problem-solving.",
        "They might follow up with 'What questions do you ask?' to see if you cover key details.",
        "A deeper question could be 'How do you proceed if the interviewer doesn’t clarify?' to check adaptability."
      ]},
      { type: 'subheading', en: "Ambiguous Statements Explained" },
      { type: 'ul', items: [
        "Ask Clarifying Questions: For LC1143, ask if you need the length or actual subsequence. For Knapsack, ask if items can be taken multiple times.",
        "Identify Constraints: Confirm input sizes (e.g., LC1143 n,m ≤ 1000, Knapsack W ≤ 1000) and edge cases (e.g., empty strings, W=0).",
        "Test with Examples: Use small inputs (e.g., LC70 n=3, LC1143 text1='AB', text2='AC') to confirm understanding.",
        "Assume Standard: If unclear, assume classic DP (e.g., 0/1 Knapsack, not unbounded) and state your assumption aloud.",
        "Iterate: Start with a recursive solution, then optimize to DP if confirmed."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Ask ‘Do we need the length or actual sequence?’ for LC1143 to clarify requirements."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you debug 2D DP solutions?",
        "How do you practice explaining DP solutions?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Debug 2D DP Solutions?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: 2D DP Debugging" },
      { type: 'ul', items: [
        "The interviewer may ask 'How do you debug a 2D DP solution?' to test your problem-solving skills.",
        "They might follow up with 'What common bugs do you look for?' to see if you know pitfalls.",
        "A deeper question could be 'How do you trace a 2D DP table?' to check your process."
      ]},
      { type: 'subheading', en: "2D DP Debugging Explained" },
      { type: 'ul', items: [
        "Check Base Cases: Ensure dp[0][j], dp[i][0] are 0 for LC1143, Knapsack.",
        "Verify Transitions: For LC1143, confirm dp[i][j] uses correct match/max logic. For Knapsack, check include/exclude choices.",
        "Print Table: Log dp[i][j] for small inputs (e.g., LC1143 text1='AB', text2='AC') to trace values.",
        "Test Edge Cases: Run LC1143 with empty strings, Knapsack with W=0 or n=0.",
        "Manual Tracing: For Knapsack values=[60,100], weights=[10,20], W=30, calculate dp[2][30]=160 by hand."
      ]},
      { type: 'codeBlock', codeBlock: `
function longestCommonSubsequence(text1, text2) {
  const n = text1.length, m = text2.length;
  const dp = Array(n + 1).fill().map(() => Array(m + 1).fill(0));
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      dp[i][j] = text1[i-1] === text2[j-1] ? dp[i-1][j-1] + 1 : Math.max(dp[i-1][j], dp[i][j-1]);
      console.log(\`dp[\${i}][\${j}]=\${dp[i][j]}\`); // Debug
    }
  }
  return dp[n][m];
}
      ` },
      { type: 'ascii', ascii: `
LC1143 (text1="AB", text2="AC"):
dp[1][1]=1
dp[1][2]=1
dp[2][1]=1
dp[2][2]=1
Output: 1
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Print the 2D DP table for LC1143’s small inputs to spot errors."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you practice explaining DP solutions?",
        "How do you handle DP problems with multiple states?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Practice Explaining DP Solutions?" },
    level: 'fresher',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Explaining DP" },
      { type: 'ul', items: [
        "The interviewer may ask 'How do you practice explaining DP?' to test your communication skills.",
        "They might follow up with 'How do you explain LC1143 clearly?' to see if you can simplify.",
        "A deeper question could be 'How do you avoid confusion in explanations?' to check clarity."
      ]},
      { type: 'subheading', en: "Explaining DP Explained" },
      { type: 'ul', items: [
        "Use Analogies: For LC1143, compare LCS to finding common words in two sentences. For Knapsack, liken it to packing a bag with limited space.",
        "Break Down Steps: For LC70, explain dp[i]=dp[i-1]+dp[i-2] as combining ways from smaller stairs. For LC1143, describe dp[i][j] as matching or skipping characters.",
        "Draw Diagrams: Sketch DP tables (e.g., LC1143’s 2D table, Knapsack’s weight-value table) to visualize transitions.",
        "Practice Aloud: Solve LC198 and explain rob-or-skip choices to a friend or record yourself.",
        "Simplify: Avoid jargon; say 'we store answers to smaller problems' instead of 'overlapping subproblems.'"
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Explain LC70’s solution to a non-technical friend to practice clarity."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle DP problems with multiple states?",
        "How do you optimize DP for real-world systems?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle DP Problems with Multiple States?" },
    level: 'senior',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Multiple States" },
      { type: 'ul', items: [
        "The interviewer may ask 'How do you handle DP with multiple states?' to test your advanced DP skills.",
        "They might follow up with 'Can you give an example?' to see if you can apply it.",
        "A deeper question could be 'How do you optimize multi-state DP?' to check efficiency."
      ]},
      { type: 'subheading', en: "Multiple States Explained" },
      { type: 'ul', items: [
        "Multiple States: Some DP problems track more than two variables, like LC983 (Min Cost to Travel) with dp[day][city][k] for day, city, and ticket type.",
        "Approach: Define a DP table with extra dimensions (e.g., 3D for three states) or encode states into a single variable (e.g., bitmask).",
        "Example: For Knapsack with item types, dp[i][w][t] tracks item i, weight w, and type t. Transition considers including item i if type t is valid.",
        "Optimization: Use rolling arrays or state compression (e.g., bitmask for t) to reduce space.",
        "Trade-Offs: More states increase complexity (e.g., O(n*W*T)), so focus on pruning invalid states."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Practice LC983 to understand multi-state DP."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you optimize DP for real-world systems?",
        "How do you recognize DP problems in interviews?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Optimize DP for Real-World Systems?" },
    level: 'senior',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Real-World Optimization" },
      { type: 'ul', items: [
        "The interviewer may ask 'How do you optimize DP in production?' to test your practical knowledge.",
        "They might follow up with 'How do you handle memory constraints?' to see if you know scalability.",
        "A deeper question could be 'How do you integrate DP with distributed systems?' to check advanced applications."
      ]},
      { type: 'subheading', en: "Real-World Optimization Explained" },
      { type: 'ul', items: [
        "Space Optimization: Use rolling arrays (LC1143: O(min(n,m)), Knapsack: O(W)) to reduce memory for large n, m, or W.",
        "Early Exits: Check edge cases (e.g., LC1143 empty strings, Knapsack W=0) to avoid unnecessary computation.",
        "Parallelization: For 2D DP (LC1143, Knapsack), parallelize independent rows/columns using multi-threading if n, m, or W are huge.",
        "Pruning: Skip invalid states (e.g., Knapsack w < min(weights)) to reduce computation.",
        "Example: For LC1143 with n,m=10^5, use rolling array and check for early termination if no common characters."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Practice LC1143 with rolling array to handle large inputs in real-world systems."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you recognize DP problems in interviews?",
        "How do you handle follow-up questions in DP interviews?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Recognize DP Problems in Interviews?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Recognition Cues" },
      { type: 'ul', items: [
        "The interviewer may ask 'How do you identify a DP problem?' to test your pattern recognition.",
        "They might follow up with 'What are the cues?' to see if you know the signs.",
        "A deeper question could be 'How do you differentiate DP from greedy?' to check your knowledge."
      ]},
      { type: 'subheading', en: "Recognition Cues Explained" },
      { type: 'ul', items: [
        "Cues: Look for overlapping subproblems (same calculations repeat) and optimal substructure (solution built from smaller solutions).",
        "Keywords: 'Number of ways' (LC70), 'maximum/minimum' (LC198, Knapsack), 'longest/shortest' (LC1143), 'paths' (LC62).",
        "DP vs. Greedy: Greedy picks local best (e.g., shortest path without backtracking), DP considers all (e.g., LC198 rob/skip).",
        "Confirm: Try recursive solution; if exponential, use DP to memoize (e.g., LC70 recursive O(2^n) → DP O(n)).",
        "Example: LC1143 'longest common subsequence' cues DP, as subsequences overlap."
      ]},
      { type: 'ascii', ascii: `
LC70: "Count ways" -> DP
LC198: "Max money" -> DP
LC1143: "Longest common" -> DP
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "If you see 'maximize' or 'count ways,' try a recursive solution to confirm DP."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle follow-up questions in DP interviews?",
        "How do you practice DP for consistency?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Follow-Up Questions in DP Interviews?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Follow-Ups" },
      { type: 'ul', items: [
        "The interviewer may ask 'How do you handle DP follow-ups?' to test adaptability.",
        "They might follow up with 'What if constraints change?' to see if you can modify your solution.",
        "A deeper question could be 'How do you anticipate follow-ups?' to check preparation."
      ]},
      { type: 'subheading', en: "Follow-Ups Explained" },
      { type: 'ul', items: [
        "Understand the Base Problem: For LC1143, know the LCS logic to extend to LC72 (edit distance). For Knapsack, master 0/1 to handle unbounded.",
        "Anticipate Variations: Expect changes like circular constraints (LC213), k steps (LC70), or actual sequence (LC1143).",
        "Modify Transitions: For LC198 circular houses, solve twice (exclude first/last). For Knapsack, adjust for multiple uses.",
        "Test Variations: Practice follow-ups (e.g., LC72, unbounded Knapsack) to ensure flexibility.",
        "Explain Clearly: State how the follow-up changes the DP table or transitions (e.g., LC1143 to substring resets non-matches)."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Practice LC72 (Edit Distance) to prepare for LC1143 follow-ups."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you practice DP for consistency?",
        "How do you handle ambiguous DP problem statements?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Practice DP for Consistency?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: DP Practice" },
      { type: 'ul', items: [
        "The interviewer may ask 'How do you practice DP for consistency?' to test your study plan.",
        "They might follow up with 'What problems do you solve daily?' to see if you focus on fundamentals.",
        "A deeper question could be 'How do you retain DP concepts?' to check your retention strategy."
      ]},
      { type: 'subheading', en: "DP Practice Explained" },
      { type: 'ul', items: [
        "Daily Routine: Solve 1-2 DP problems, starting with LC70 and LC198 to practice 1D DP, then LC1143 and Knapsack for 2D DP.",
        "Focus on Fundamentals: Practice deriving state transitions (e.g., LC70 dp[i]=dp[i-1]+dp[i-2]) and base cases (e.g., LC1143 dp[0][j]=0) every day.",
        "Mock Sessions: Do timed mock interviews (30-45 min) with LC70 or LC1143, explaining your logic aloud to build consistency.",
        "Review: Weekly review LC70, LC198, LC1143, Knapsack, testing edge cases and optimizations.",
        "Retain Concepts: Write notes on state transitions and rolling arrays, revisit them weekly."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Solve LC70 daily to retain 1D DP concepts."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle ambiguous DP problem statements?",
        "How do you debug 2D DP solutions?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Ambiguous DP Problem Statements?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Ambiguous Statements" },
      { type: 'ul', items: [
        "The interviewer may ask 'How do you clarify a vague DP problem?' to test your problem-solving.",
        "They might follow up with 'What questions do you ask?' to see if you cover key details.",
        "A deeper question could be 'How do you proceed if the interviewer doesn’t clarify?' to check adaptability."
      ]},
      { type: 'subheading', en: "Ambiguous Statements Explained" },
      { type: 'ul', items: [
        "Ask Clarifying Questions: For LC1143, ask if you need the length or actual subsequence. For Knapsack, ask if items can be taken multiple times.",
        "Identify Constraints: Confirm input sizes (e.g., LC1143 n,m ≤ 1000, Knapsack W ≤ 1000) and edge cases (e.g., empty strings, W=0).",
        "Test with Examples: Use small inputs (e.g., LC70 n=3, LC1143 text1='AB', text2='AC') to confirm understanding.",
        "Assume Standard: If unclear, assume classic DP (e.g., 0/1 Knapsack, not unbounded) and state your assumption aloud.",
        "Iterate: Start with a recursive solution, then optimize to DP if confirmed."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Ask ‘Do we need the length or actual sequence?’ for LC1143 to clarify requirements."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you debug 2D DP solutions?",
        "How do you practice explaining DP solutions?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Debug 2D DP Solutions?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: 2D DP Debugging" },
      { type: 'ul', items: [
        "The interviewer may ask 'How do you debug a 2D DP solution?' to test your problem-solving skills.",
        "They might follow up with 'What common bugs do you look for?' to see if you know pitfalls.",
        "A deeper question could be 'How do you trace a 2D DP table?' to check your process."
      ]},
      { type: 'subheading', en: "2D DP Debugging Explained" },
      { type: 'ul', items: [
        "Check Base Cases: Ensure dp[0][j], dp[i][0] are 0 for LC1143, Knapsack.",
        "Verify Transitions: For LC1143, confirm dp[i][j] uses correct match/max logic. For Knapsack, check include/exclude choices.",
        "Print Table: Log dp[i][j] for small inputs (e.g., LC1143 text1='AB', text2='AC') to trace values.",
        "Test Edge Cases: Run LC1143 with empty strings, Knapsack with W=0 or n=0.",
        "Manual Tracing: For Knapsack values=[60,100], weights=[10,20], W=30, calculate dp[2][30]=160 by hand."
      ]},
      { type: 'codeBlock', codeBlock: `
function longestCommonSubsequence(text1, text2) {
  const n = text1.length, m = text2.length;
  const dp = Array(n + 1).fill().map(() => Array(m + 1).fill(0));
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      dp[i][j] = text1[i-1] === text2[j-1] ? dp[i-1][j-1] + 1 : Math.max(dp[i-1][j], dp[i][j-1]);
      console.log(\`dp[\${i}][\${j}]=\${dp[i][j]}\`); // Debug
    }
  }
  return dp[n][m];
}
      ` },
      { type: 'ascii', ascii: `
LC1143 (text1="AB", text2="AC"):
dp[1][1]=1
dp[1][2]=1
dp[2][1]=1
dp[2][2]=1
Output: 1
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Print the 2D DP table for LC1143’s small inputs to spot errors."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you practice explaining DP solutions?",
        "How do you handle DP problems with multiple states?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Practice Explaining DP Solutions?" },
    level: 'fresher',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Explaining DP" },
      { type: 'ul', items: [
        "The interviewer may ask 'How do you practice explaining DP?' to test your communication skills.",
        "They might follow up with 'How do you explain LC1143 clearly?' to see if you can simplify.",
        "A deeper question could be 'How do you avoid confusion in explanations?' to check clarity."
      ]},
      { type: 'subheading', en: "Explaining DP Explained" },
      { type: 'ul', items: [
        "Use Analogies: Subsets (LC78) as choosing items for a bag, LCS (LC1143) as finding common letters.",
        "Break Down Steps: For LC70, explain dp[i]=dp[i-1]+dp[i-2] as combining ways from smaller stairs.",
        "Draw Diagrams: Sketch DP tables (e.g., LC1143’s 2D table, Knapsack’s weight-value table) to visualize transitions.",
        "Practice Aloud: Solve LC198 and explain rob-or-skip choices to a friend or record yourself.",
        "Simplify: Avoid jargon; say 'we store answers to smaller problems' instead of 'overlapping subproblems.'"
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Explain LC70’s solution to a non-technical friend to practice clarity."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle DP problems with multiple states?",
        "How do you optimize DP for real-world systems?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle DP Problems with Multiple States?" },
    level: 'senior',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Multiple States" },
      { type: 'ul', items: [
        "The interviewer may ask 'How do you handle DP with multiple states?' to test your advanced DP skills.",
        "They might follow up with 'Can you give an example?' to see if you can apply it.",
        "A deeper question could be 'How do you optimize multi-state DP?' to check efficiency."
      ]},
      { type: 'subheading', en: "Multiple States Explained" },
      { type: 'ul', items: [
        "Multiple States: Some DP problems track more than two variables, like LC983 (Min Cost to Travel) with dp[day][city][k] for day, city, and ticket type.",
        "Approach: Define a DP table with extra dimensions (e.g., 3D for three states) or encode states into a single variable (e.g., bitmask).",
        "Example: For Knapsack with item types, dp[i][w][t] tracks item i, weight w, and type t. Transition considers including item i if type t is valid.",
        "Optimization: Use rolling arrays or state compression (e.g., bitmask for t) to reduce space.",
        "Trade-Offs: More states increase complexity (e.g., O(n*W*T)), so focus on pruning invalid states."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Practice LC983 to understand multi-state DP."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you optimize DP for real-world systems?",
        "How do you recognize DP problems in interviews?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Optimize DP for Real-World Systems?" },
    level: 'senior',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Real-World Optimization" },
      { type: 'ul', items: [
        "The interviewer may ask 'How do you optimize DP in production?' to test your practical knowledge.",
        "They might follow up with 'How do you handle memory constraints?' to see if you know scalability.",
        "A deeper question could be 'How do you integrate DP with distributed systems?' to check advanced applications."
      ]},
      { type: 'subheading', en: "Real-World Optimization Explained" },
      { type: 'ul', items: [
        "Space Optimization: Use rolling arrays (LC1143: O(min(n,m)), Knapsack: O(W)) to reduce memory for large n, m, or W.",
        "Early Exits: Check edge cases (e.g., LC1143 empty strings, Knapsack W=0) to avoid unnecessary computation.",
        "Parallelization: For 2D DP (LC1143, Knapsack), parallelize independent rows/columns using multi-threading if n, m, or W are huge.",
        "Pruning: Skip invalid states (e.g., Knapsack w < min(weights)) to reduce computation.",
        "Example: For LC1143 with n,m=10^5, use rolling array and check for early termination if no common characters."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Practice LC1143 with rolling array to handle large inputs in real-world systems."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you recognize DP problems in interviews?",
        "How do you handle follow-up questions in DP interviews?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Recognize DP Problems in Interviews?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Recognition Cues" },
      { type: 'ul', items: [
        "The interviewer may ask 'How do you identify a DP problem?' to test your pattern recognition.",
        "They might follow up with 'What are the cues?' to see if you know the signs.",
        "A deeper question could be 'How do you differentiate DP from greedy?' to check your knowledge."
      ]},
      { type: 'subheading', en: "Recognition Cues Explained" },
      { type: 'ul', items: [
        "Cues: Look for overlapping subproblems (same calculations repeat) and optimal substructure (solution built from smaller solutions).",
        "Keywords: 'Number of ways' (LC70), 'maximum/minimum value' (LC198, Knapsack), 'longest/shortest sequence' (LC1143), or 'paths in grid' (LC62).",
        "DP vs. Greedy: Greedy picks local best (e.g., shortest path without backtracking), DP considers all (e.g., LC198 rob/skip).",
        "Confirm: Try recursive solution; if exponential, use DP to memoize (e.g., LC70 recursive O(2^n) → DP O(n)).",
        "Example: LC1143 'longest common subsequence' cues DP, as subsequences overlap."
      ]},
      { type: 'ascii', ascii: `
LC70: "Count ways" -> DP
LC198: "Max money" -> DP
LC1143: "Longest common" -> DP
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "If you see 'maximize' or 'count ways,' write a recursive solution to confirm DP."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle follow-up questions in DP interviews?",
        "How do you practice DP for consistency?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Follow-Up Questions in DP Interviews?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Follow-Ups" },
      { type: 'ul', items: [
        "The interviewer may ask 'How do you handle DP follow-ups?' to test your adaptability.",
        "They might follow up with 'What if constraints change?' to see if you can modify your solution.",
        "A deeper question could be 'How do you anticipate follow-ups?' to check preparation."
      ]},
      { type: 'subheading', en: "Follow-Ups Explained" },
      { type: 'ul', items: [
        "Understand the Base Problem: For LC1143, know the LCS logic to extend to LC72 (edit distance). For Knapsack, master 0/1 to handle unbounded.",
        "Anticipate Variations: Expect changes like circular constraints (LC213), k steps (LC70), or actual sequence (LC1143).",
        "Modify Transitions: For LC198 circular houses, solve twice (exclude first/last). For Knapsack, adjust for multiple uses.",
        "Test Variations: Practice follow-ups (e.g., LC72, unbounded Knapsack) to ensure flexibility.",
        "Explain Clearly: State how the follow-up changes the DP table or transitions (e.g., LC1143 to substring resets non-matches)."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Practice LC72 (Edit Distance) to prepare for LC1143 follow-ups."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you practice DP for consistency?",
        "How do you handle ambiguous DP problem statements?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Practice DP for Consistency?" },
    level: 'fresher',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: DP Practice" },
      { type: 'ul', items: [
        "The interviewer may ask 'How do you practice DP for consistency?' to test your study plan.",
        "They might follow up with 'What problems do you solve daily?' to see if you focus on fundamentals.",
        "A deeper question could be 'How do you retain DP concepts?' to check your retention strategy."
      ]},
      { type: 'subheading', en: "DP Practice Explained" },
      { type: 'ul', items: [
        "Daily Routine: Solve 1-2 DP problems, starting with LC70 (Climbing Stairs) and LC198 (House Robber) to practice 1D DP, then LC1143 and Knapsack for 2D DP.",
        "Focus on Fundamentals: Practice deriving state transitions (e.g., LC70 dp[i]=dp[i-1]+dp[i-2]) and base cases (e.g., LC198 dp[0]=nums[0]) every day.",
        "Intermediate Practice: For LC1143, fill the 2D table manually for small strings (text1='AB', text2='AC') to understand match/skip.",
        "Weekly Review: Review LC70, LC198, LC1143, Knapsack, testing edge cases and optimizations.",
        "Retain Concepts: Write notes on state transitions and rolling arrays, revisit them weekly, and explain to a friend."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Solve LC70 daily to retain 1D DP concepts."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle ambiguous DP problem statements?",
        "How do you debug 2D DP solutions?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Ambiguous DP Problem Statements?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Ambiguous Statements" },
      { type: 'ul', items: [
        "The interviewer may ask 'How do you clarify a vague DP problem?' to test your problem-solving.",
        "They might follow up with 'What questions do you ask?' to see if you cover key details.",
        "A deeper question could be 'How do you proceed if the interviewer doesn’t clarify?' to check adaptability."
      ]},
      { type: 'subheading', en: "Ambiguous Statements Explained" },
      { type: 'ul', items: [
        "Ask Clarifying Questions: For LC1143, ask if you need the length or actual subsequence. For Knapsack, ask if items can be taken multiple times.",
        "Identify Constraints: Confirm input sizes (e.g., LC1143 n,m ≤ 1000, Knapsack W ≤ 1000) and edge cases (e.g., empty strings, W=0).",
        "Test with Examples: Use small inputs (e.g., LC70 n=3, LC1143 text1='AB', text2='AC') to confirm understanding.",
        "Assume Standard: If unclear, assume classic DP (e.g., 0/1 Knapsack, not unbounded) and state your assumption aloud.",
        "Iterate: Start with a recursive solution, then optimize to DP if confirmed."
      ]},
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Ask ‘Do we need the length or actual sequence?’ for LC1143 to clarify requirements."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you debug 2D DP solutions?",
        "How do you practice explaining DP solutions?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Debug 2D DP Solutions?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: 2D DP Debugging" },
      { type: 'ul', items: [
        "The interviewer may ask 'How do you debug a 2D DP solution?' to test your problem-solving skills.",
        "They might follow up with 'What common bugs do you look for?' to see if you know pitfalls.",
        "A deeper question could be 'How do you trace a 2D DP table?' to check your process."
      ]},
      { type: 'subheading', en: "2D DP Debugging Explained" },
      { type: 'ul', items: [
        "Check Base Cases: Ensure dp[0][j], dp[i][0] are 0 for LC1143, Knapsack.",
        "Verify Transitions: For LC1143, confirm dp[i][j] uses correct match/max logic. For Knapsack, check include/exclude choices.",
        "Print Table: Log dp[i][j] for small inputs (e.g., LC1143 text1='AB', text2='AC') to trace values.",
        "Test Edge Cases: Run LC1143 with empty strings, Knapsack with W=0 or n=0.",
        "Manual Tracing: For Knapsack values=[60,100], weights=[10,20], W=30, calculate dp[2][30]=160 by hand."
      ]},
      { type: 'codeBlock', codeBlock: `
function longestCommonSubsequence(text1, text2) {
  const n = text1.length, m = text2.length;
  const dp = Array(n + 1).fill().map(() => Array(m + 1).fill(0));
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      dp[i][j] = text1[i-1] === text2[j-1] ? dp[i-1][j-1] + 1 : Math.max(dp[i-1][j], dp[i][j-1]);
      console.log(\`dp[\${i}][\${j}]=\${dp[i][j]}\`); // Debug
    }
  }
  return dp[n][m];
}
      ` },
      { type: 'ascii', ascii: `
LC1143 (text1="AB", text2="AC"):
dp[1][1]=1
dp[1][2]=1
dp[2][1]=1
dp[2][2]=1
Output: 1
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Print the 2D DP table for LC1143’s small inputs to spot errors."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you practice explaining DP solutions?",
        "How do you handle DP problems with multiple states?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Practice Explaining DP Solutions?" },
    level: 'fresher',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Explaining DP" },
      { type: 'ul', items: [
        "The interviewer may ask 'How do you practice explaining DP?' to test your communication skills.",
        "They might follow up with 'How do you explain LC1143 clearly?' to see if you can simplify.",
        "A deeper question could be 'How do you avoid confusion in explanations?' to check clarity."
      ]},
      { type: 'subheading', en: "Explaining DP Explained" },
      { type: 'ul', items: [
        "Use Analogies: Subsets (LC78) as choosing items for a bag, LCS (LC1143) as finding common letters.",
        "Break Down Steps: For LC70, explain dp[i]=dp[i-1]+dp[i-2] as combining ways from smaller stairs.",
        "Draw Diagrams: Sketch DP tables (e.g., LC1143’s 2D table for text1='AB', text2='AC') to show match-or-skip transitions visually.",
        "Practice Aloud: Solve LC198 (House Robber) and explain rob-or-skip choices to a friend or record yourself to refine clarity.",
        "Simplify Language: Avoid jargon; say 'we store answers to smaller problems' instead of 'overlapping subproblems' to make it accessible.",
        "Use Examples: For LC1143, walk through text1='AB', text2='AC' to show dp[1][1]=1 (A matches A) and dp[2][2]=1 (B vs C takes max)."
      ]},
      { type: 'ascii', ascii: `
LC1143 (text1="AB", text2="AC"):
  A C
A 1 1
B 1 1
Explain: dp[1][1]=1 (A=A), dp[2][2]=max(dp[1][2],dp[2][1])=1
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Explain LC70’s solution (dp[i]=dp[i-1]+dp[i-2]) to a non-technical friend to practice simplifying complex ideas."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle DP problems with multiple states?",
        "How do you optimize DP for real-world systems?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle DP Problems with Multiple States?" },
    level: 'senior',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Multiple States" },
      { type: 'ul', items: [
        "The interviewer may ask 'How do you handle DP with multiple states?' to test your advanced DP skills.",
        "They might follow up with 'Can you give an example?' to see if you can apply it.",
        "A deeper question could be 'How do you optimize multi-state DP?' to check efficiency."
      ]},
      { type: 'subheading', en: "Multiple States Explained" },
      { type: 'ul', items: [
        "Multiple States: Some DP problems track more than two variables, like LC983 (Minimum Cost to Travel) with dp[day][city][k] for day, city, and ticket type (e.g., 1-day or 7-day pass).",
        "Approach: Define a DP table with extra dimensions (e.g., 3D for three states) or encode states into a single variable (e.g., bitmask for used items).",
        "Example: For Knapsack with item types, dp[i][w][t] tracks item i, weight w, and type t. Transition considers including item i if type t is valid.",
        "Optimization: Use rolling arrays (e.g., dp[2][w][t] for LC983) or state compression (e.g., bitmask for t) to reduce space from O(n*W*T) to O(W*T).",
        "Trade-Offs: More states increase complexity (e.g., O(n*W*T)), so prune invalid states (e.g., skip weights > W in Knapsack)."
      ]},
      { type: 'ascii', ascii: `
LC983: dp[day][city][k]
day=1, city=0, k=1-day pass
Transition: min(cost[day][city] + dp[day+1][next_city][k], ...)
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Practice LC983 (Minimum Cost to Travel) to master multi-state DP with 3D tables."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you optimize DP for real-world systems?",
        "How do you recognize DP problems in interviews?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Optimize DP for Real-World Systems?" },
    level: 'senior',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Real-World Optimization" },
      { type: 'ul', items: [
        "The interviewer may ask 'How do you optimize DP in production?' to test your practical knowledge.",
        "They might follow up with 'How do you handle memory constraints?' to see if you understand scalability.",
        "A deeper question could be 'How do you integrate DP with distributed systems?' to check advanced applications."
      ]},
      { type: 'subheading', en: "Real-World Optimization Explained" },
      { type: 'ul', items: [
        "Space Optimization: Use rolling arrays (e.g., LC1143: O(min(n,m)), Knapsack: O(W)) to reduce memory for large inputs.",
        "Early Exits: Check edge cases (e.g., LC1143 empty strings, Knapsack W=0) to avoid unnecessary computation.",
        "Parallelization: For 2D DP (LC1143, Knapsack), parallelize independent rows/columns using multi-threading for large n, m, or W (e.g., n=10^5).",
        "Pruning: Skip invalid states (e.g., Knapsack w < min(weights)) to reduce computation time.",
        "Distributed Systems: For huge inputs, partition DP table (e.g., LC1143’s rows across nodes) and aggregate results, ensuring no data races.",
        "Example: For LC1143 with n,m=10^5, use rolling array and early termination if no common characters detected."
      ]},
      { type: 'codeBlock', codeBlock: `
function longestCommonSubsequence(text1, text2) {
  if (!text1 || !text2) return 0; // Early exit
  const [n, m] = [text1.length, text2.length];
  let dp = Array(2).fill().map(() => Array(m + 1).fill(0));
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      dp[i%2][j] = text1[i-1] === text2[j-1] ? dp[(i-1)%2][j-1] + 1 : Math.max(dp[(i-1)%2][j], dp[i%2][j-1]);
    }
  }
  return dp[n%2][m];
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Implement LC1143 with a rolling array to practice space optimization for production."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you recognize DP problems in interviews?",
        "How do you handle follow-up questions in DP interviews?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Recognize DP Problems in Interviews?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Recognition Cues" },
      { type: 'ul', items: [
        "The interviewer may ask 'How do you identify a DP problem?' to test your pattern recognition.",
        "They might follow up with 'What are the cues?' to see if you know the signs.",
        "A deeper question could be 'How do you differentiate DP from greedy?' to check your knowledge."
      ]},
      { type: 'subheading', en: "Recognition Cues Explained" },
      { type: 'ul', items: [
        "Cues: Look for overlapping subproblems (same calculations repeat) and optimal substructure (solution built from smaller solutions).",
        "Keywords: 'Number of ways' (LC70), 'maximum/minimum value' (LC198, Knapsack), 'longest/shortest sequence' (LC1143), or 'paths in grid' (LC62).",
        "DP vs. Greedy: Greedy picks local best (e.g., activity selection picks earliest ending), DP considers all (e.g., LC198 rob-or-skip).",
        "Confirm: Write a recursive solution; if exponential (e.g., LC70 O(2^n)), use DP to memoize for O(n).",
        "Example: LC1143 'longest common subsequence' cues DP, as subsequences overlap and require comparing all pairs."
      ]},
      { type: 'ascii', ascii: `
LC70: "Count ways" -> DP
LC198: "Max money" -> DP
LC1143: "Longest common" -> DP
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "If you see 'maximize' or 'count ways,' write a recursive solution to confirm DP applicability."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle follow-up questions in DP interviews?",
        "How do you practice DP for consistency?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Handle Follow-Up Questions in DP Interviews?" },
    level: 'intermediate',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: Follow-Ups" },
      { type: 'ul', items: [
        "The interviewer may ask 'How do you handle DP follow-ups?' to test your adaptability.",
        "They might follow up with 'What if constraints change?' to see if you can modify your solution.",
        "A deeper question could be 'How do you anticipate follow-ups?' to check preparation."
      ]},
      { type: 'subheading', en: "Follow-Ups Explained" },
      { type: 'ul', items: [
        "Understand the Base Problem: For LC1143, master LCS logic to extend to LC72 (Edit Distance). For Knapsack, know 0/1 to handle unbounded.",
        "Anticipate Variations: Expect changes like circular constraints (LC213), k steps (LC70), or actual sequence (LC1143).",
        "Modify Transitions: For LC198 circular houses, solve twice (exclude first/last). For Knapsack, adjust for multiple uses with dp[w] = max(dp[w], dp[w-weights[i]] + values[i]).",
        "Test Variations: Practice follow-ups (e.g., LC72, unbounded Knapsack) to ensure flexibility.",
        "Explain Clearly: State how the follow-up changes the DP table or transitions (e.g., LC1143 to substring resets non-matches to 0)."
      ]},
      { type: 'codeBlock', codeBlock: `
function getLCS(text1, text2) {
  const n = text1.length, m = text2.length;
  const dp = Array(n + 1).fill().map(() => Array(m + 1).fill(0));
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      dp[i][j] = text1[i-1] === text2[j-1] ? dp[i-1][j-1] + 1 : Math.max(dp[i-1][j], dp[i][j-1]);
    }
  }
  // Backtrack for actual LCS
  let lcs = [], i = n, j = m;
  while (i > 0 && j > 0) {
    if (text1[i-1] === text2[j-1]) {
      lcs.push(text1[i-1]);
      i--; j--;
    } else if (dp[i-1][j] >= dp[i][j-1]) {
      i--;
    } else {
      j--;
    }
  }
  return lcs.reverse().join('');
}
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Practice LC72 (Edit Distance) to prepare for LC1143 follow-ups like finding the actual sequence."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you practice DP for consistency?",
        "How do you handle ambiguous DP problem statements?"
      ] }
    ]
  },
  {
    q: { en: "How Do You Practice DP for Consistency?" },
    level: 'fresher',
    a: [
      { type: 'subheading', en: "What Interviewer Will Ask: DP Practice" },
      { type: 'ul', items: [
        "The interviewer may ask 'How do you practice DP for consistency?' to test your study plan.",
        "They might follow up with 'What problems do you solve daily?' to see if you focus on fundamentals.",
        "A deeper question could be 'How do you retain DP concepts?' to check your retention strategy."
      ]},
      { type: 'subheading', en: "DP Practice Explained" },
      { type: 'ul', items: [
        "Daily Routine: Solve 1-2 DP problems, starting with LC70 (Climbing Stairs) and LC198 (House Robber) for 1D DP, then LC1143 (LCS) and Knapsack for 2D DP.",
        "Focus on Fundamentals: Practice deriving state transitions (e.g., LC70 dp[i]=dp[i-1]+dp[i-2]) and base cases (e.g., LC198 dp[0]=nums[0]).",
        "Intermediate Practice: For LC1143, fill the 2D table manually for small inputs (text1='AB', text2='AC') to understand match-or-skip logic.",
        "Weekly Review: Revisit LC70, LC198, LC1143, and Knapsack, testing edge cases (e.g., empty strings, W=0) and optimizations (e.g., rolling arrays).",
        "Retain Concepts: Write notes on state transitions and rolling arrays, revisit weekly, and explain solutions to a peer."
      ]},
      { type: 'ascii', ascii: `
LC70 (n=3):
dp[0]=1, dp[1]=1, dp[2]=2, dp[3]=3
Explain: Ways for n=3 are 1+1+1, 1+2, 2+1
      ` },
      { type: 'subheading', en: "Practical Tip" },
      { type: 'ul', items: [
        "Solve LC70 daily to reinforce 1D DP state transitions."
      ]},
      { type: 'subheading', en: "What Interviewer Will Ask Next" },
      { type: 'ul', items: [
        "How do you handle ambiguous DP problem statements?",
        "How do you debug 2D DP solutions?"
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
