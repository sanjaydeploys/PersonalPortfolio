(function() {
  // Move currentLang up here so it's available for default messages
  let currentLang = localStorage.getItem('chat-lang') || 'hi';

  // Now initialize messages, using currentLang for default welcome text
  window.messages = JSON.parse(localStorage.getItem('portfolio-chat')) || [
    {
      sender: 'ai',
      text: currentLang === 'hi' 
        ? 'हाय! मैं संजय पाटीदार का पोर्टफोलियो चैटबॉट हूँ। उनके प्रोजेक्ट्स, स्किल्स, या जीवन की कहानियों के बारे में पूछें, जैसे "संजय पाटीदार कौन हैं?" या "संजय के स्कूल के दिनों की एक मज़ेदार कहानी बताएं!"'
        : 'Hi! I\'m Sanjay Patidar\'s portfolio chatbot. Ask about his projects, skills, or life stories, like "Who is Sanjay Patidar?" or "Tell me a funny story from Sanjay’s school days!"',
      id: 'welcome',
      timestamp: new Date().toISOString(),
      category: 'welcome',
      reactions: [],
      isPinned: false
    }
  ];

  // Validate and reset messages if corrupted, using currentLang for welcome
  try {
    if (!Array.isArray(window.messages)) {
      console.warn('Invalid localStorage data, resetting messages');
      window.messages = [{
        sender: 'ai',
        text: currentLang === 'hi' 
          ? 'हाय! मैं संजय पाटीदार का पोर्टफोलियो चैटबॉट हूँ। उनके प्रोजेक्ट्स, स्किल्स, या जीवन की कहानियों के बारे में पूछें, जैसे "संजय पाटीदार कौन हैं?" या "संजय के स्कूल के दिनों की एक मज़ेदार कहानी बताएं!"'
          : 'Hi! I\'m Sanjay Patidar\'s portfolio chatbot. Ask about his projects, skills, or life stories, like "Who is Sanjay Patidar?" or "Tell me a funny story from Sanjay’s school days!"',
        id: 'welcome',
        timestamp: new Date().toISOString(),
        category: 'welcome',
        reactions: [],
        isPinned: false
      }];
      localStorage.setItem('portfolio-chat', JSON.stringify(window.messages));
    }
  } catch (e) {
    console.error('Error parsing localStorage:', e);
    window.messages = [{
      sender: 'ai',
      text: currentLang === 'hi' 
        ? 'हाय! मैं संजय पाटीदार का पोर्टफोलियो चैटबॉट हूँ। उनके प्रोजेक्ट्स, स्किल्स, या जीवन की कहानियों के बारे में पूछें, जैसे "संजय पाटीदार कौन हैं?" या "संजय के स्कूल के दिनों की एक मज़ेदार कहानी बताएं!"'
        : 'Hi! I\'m Sanjay Patidar\'s portfolio chatbot. Ask about his projects, skills, or life stories, like "Who is Sanjay Patidar?" or "Tell me a funny story from Sanjay’s school days!"',
      id: 'welcome',
      timestamp: new Date().toISOString(),
      category: 'welcome',
      reactions: [],
      isPinned: false
    }];
    localStorage.setItem('portfolio-chat', JSON.stringify(window.messages));
  }

  let isLoading = false;
  let isDarkMode = false;
  let isHistoryCollapsed = false;
  let fontSize = parseInt(localStorage.getItem('chat-font-size')) || 14;
  let editingMessageId = null;
  let editedText = '';
  let isRecording = false;
  let isAutoReplyEnabled = true;
  let isAutoSpeakEnabled = true;
  let showTimestamps = true;
  let searchQuery = '';
  let selectedCategory = '';
  let pendingMessage = null;
  let pendingMessageId = null;
  let interactionAnalytics = { questionsAsked: 0, speechUsed: 0, categories: {}, reactionsUsed: 0 };
  const suggestedPrompts = {
    en: [
      'Who is Sanjay Patidar?',
      'What are Sanjay’s projects?',
      'Tell me about LIC Neemuch.',
      'What is Zedemy LMS?',
      'How does ConnectNow work?',
      'What is EventEase?',
      'What frontend skills does Sanjay have?',
      'What backend skills does Sanjay specialize in?',
      'What are Sanjay’s cloud computing skills?',
      'How does Sanjay optimize apps for SEO?',
      'What are Sanjay’s key achievements?',
      'How has Sanjay improved page load times?',
      'How can I contact Sanjay for collaboration?',
      'How did Sanjay handle a tight deadline?',
      'What challenges did Sanjay face in ConnectNow?',
      'How did Sanjay overcome academic setbacks?',
      'How does Sanjay learn new technologies?',
      'How does Sanjay handle team conflicts?',
      'What’s Sanjay’s experience with CI/CD?',
      'How does Sanjay ensure app security?',
      'Tell me a funny story from Sanjay’s school days!',
      'What was Sanjay’s Navodaya experience like?',
      'What’s Sanjay’s favorite hobby?',
      'Share a memorable moment from Sanjay’s life.'
    ],
    hi: [
      'संजय पाटीदार कौन हैं?',
      'संजय के प्रोजेक्ट्स क्या हैं?',
      'LIC नीमच के बारे में बताएं।',
      'Zedemy LMS क्या है?',
      'ConnectNow कैसे काम करता है?',
      'EventEase क्या है?',
      'संजय के फ्रंटएंड स्किल्स क्या हैं?',
      'संजय किन बैकएंड स्किल्स में विशेषज्ञ हैं?',
      'संजय की क्लाउड कंप्यूटिंग स्किल्स क्या हैं?',
      'संजय ऐप्स को SEO के लिए कैसे ऑप्टिमाइज करते हैं?',
      'संजय की प्रमुख उपलब्धियां क्या हैं?',
      'संजय ने पेज लोड टाइम्स कैसे सुधारे?',
      'सहयोग के लिए संजय से कैसे संपर्क कर सकता हूं?',
      'संजय ने टाइट डेडलाइन को कैसे हैंडल किया?',
      'ConnectNow में संजय को क्या चुनौतियां आईं?',
      'संजय ने अकादमिक असफलताओं को कैसे पार किया?',
      'संजय नई तकनीकों को कैसे सीखते हैं?',
      'संजय टीम संघर्षों को कैसे हैंडल करते हैं?',
      'संजय का CI/CD में क्या अनुभव है?',
      'संजय ऐप सिक्योरिटी कैसे सुनिश्चित करते हैं?',
      'संजय के स्कूल के दिनों की एक मज़ेदार कहानी बताएं!',
      'संजय का नवोदय अनुभव कैसा था?',
      'संजय का पसंदीदा शौक क्या है?',
      'संजय के जीवन का एक यादगार पल साझा करें।'
    ]
  };
  let filteredSuggestions = suggestedPrompts[currentLang];
  const emojiOptions = ['👍', '😄', '⚽', '🍲', '👏'];
  const primaryApiKey = 'AIzaSyA6R5mEyZM7Vz61fisMnFaYedGptHv8B4I';
  const fallbackApiKey = 'AIzaSyCP0zYjRT5Gkdb2PQjSmVi6-TnO2a7ldAA';
  const imageContext = {
    "six-pack-abs": {
      urls: [
        {
          url: "https://mys3resources.s3.ap-south-1.amazonaws.com/chatbot_images/468014411_2009682226215316_3169123021096312149_n_17842587129367608.webp",
          alt: "Sanjay Patidar standing next to Hrithik Roshan, showcasing six-pack abs from Navodaya football days"
        },
        {
          url: "https://mys3resources.s3.ap-south-1.amazonaws.com/chatbot_images/412545366_1110668996980205_1019140475763798870_n_18209282047272856.webp",
          alt: "Sanjay Patidar flexing his six-pack abs from Navodaya football days"
        }
      ],
      keywords: ["body", "abs", "six pack", "six-pack", "tagdi", "fitness", "hrithik", "bodybuilding"]
    },
    "gora-smart-ladka": {
      urls: [
        {
          url: "https://mys3resources.s3.ap-south-1.amazonaws.com/chatbot_images/IMG_20250220_112646_458.webp",
          alt: "Sanjay Patidar as the charming gora smart ladka from Navodaya hostel days"
        }
      ],
      keywords: ["gora", "smart ladka", "charming", "hostel look", "sanjay look"]
    }
  };
const context = `
Sanjay Patidar is a Serverless Full-Stack SaaS Engineer recognized by Amazon and Microsoft hiring managers for building production-grade platforms and tech content. He has delivered 12+ real-world applications across insurance, education, communication, and event management, with global reach in 127 countries.

### School Life
Sanjay’s school journey began at Jagrati Madhyamic Vidhyalaya, where he consistently scored above 90% through 5th grade, topping his class with 93% in 5th and impressing a classmate who later joined him at Jawahar Navodaya Vidyalaya, Rampura (Neemuch). His seven years at Navodaya (6th to 12th grade) were a vibrant mix of academics, pranks, and leadership in the scenic Aravali Sadan hostel, nestled near the Aravali hills and Chambal River.

#### Navodaya Journey
- **Admission and Aravali Sadan**: At age 10, Sanjay joined Navodaya, a government boarding school with strict rules. On admission day, like a desi Harry Potter, he insisted on joining Aravali Sadan (despite being assigned Udaigiri) after hearing its reputation, proudly choosing his “house” for the next seven years.
- **Daily Life**: Life at Navodaya was a disciplined adventure. Sanjay woke up at 6 AM for chores (washing clothes, bathing daily—though he, a “smart gora ladka,” questioned the need for daily baths!). Morning exercises preceded a 7 AM breakfast siren, triggering a sprint for his favorite pohe-jalebi, earning him the nickname “pohe paglu.”
- **School and Sports**: School ran from 8 AM to 2 PM with prayers, studies, and masti. Lunch (featuring Sanjay’s beloved ful gobhi, bhindi, and sev ki sabji) was a highlight, followed by rest and more classes until 5 PM. The golden hour was 5–6 PM sports time, where Sanjay’s passion for football shone. Despite strict rules banning outside items, he sneaked in a football, only for it to be confiscated by the PT teacher—leading to dramatic tears until it was returned.
- **Hostel Antics**: Evenings included 6 PM prayers, snacks (samosa or sevfal), and evening classes until 8 PM, followed by dinner while watching TV. Sanjay’s mischievous side peaked in 11th grade, when he and friends climbed hostel windows at 3 AM and cooked gulab jamun using a heater coil on a brick. Caught by the house master, Sanjay escaped punishment with his charm—the master even ate two jamuns, jokingly asking for better ones next time!
- **Leadership Roles**: By 8th grade, Sanjay’s good conduct and athletic build earned him the role of Junior Aravali Sadan Captain. In 11th grade, he became Senior Captain, TV In-Charge, and Sports In-Charge, holding keys to the TV and gym. As Student on Duty, he managed mess supplies, sneaked extra pohe-jalebi, and enjoyed TV all day. His football obsession sculpted a six-pack, which he proudly showed off to impress classmates.
- **Memorable Moments**: Diwali’s month-long holidays brought joy, with late-night packing for home. In 11th grade, Sanjay shed his innocence for full-on Navodaya masti, pulling off legendary pranks. By 12th grade, CBSE boards demanded focus, but football remained his constant. After seven years, Sanjay graduated, leaving behind a legacy of leadership and laughter.

#### Transition to Career
Post-Navodaya, Sanjay’s father sent him to Kota, Rajasthan, for IIT preparation, shifting his focus from childhood pranks to a career-driven path, though his love for football and pohe endures. Sanjay chose hands-on product work over a linear corporate path to gain end-to-end experience. During that time he built multiple production apps like LIC, Zedemy, AgriBot, and learned infra, SEO, and mobile constraints, shipping tangible outcomes such as search visibility, leads, and certificates. This background makes him practical and ready to contribute immediately in a product role.

### Professional Strengths and Approaches
Sanjay's biggest strength is ownership and end-to-end problem-solving, tying engineering to business results. He can take an idea from blank page to production, handling frontend, backend, infra, and SEO. In Zedemy, he designed scalable certificate verification that increased completion rates. In AgriBot, he handled offline challenges to ensure usability on low-end devices. This lets him own modules fully, from design to deployment, while collaborating on larger systems. He prioritizes features by impact times effort, picking those that move KPIs like lead count or certificate completions with minimal engineering effort. For LIC he prioritized fast SSR pages and working inquiry forms before polish; for Zedemy he prioritized certificate verification and notification flow over UI cosmetics. This approach produces measurable outcomes quickly. Sanjay maintains code quality as a solo dev by using feature branches and PRs even for solo work, writing unit tests for core logic, adding integration checks for critical flows like forms and certificates, and keeping small deployable checkpoints. Documentation and deploy.sh or CI scripts let him reproduce builds reliably, reducing regressions and keeping iteration fast. He measures product success through primary KPIs like form submissions and secondary ones like organic impressions and ranking. Post-launch for LIC, he tracked 50-60 monthly form submissions and strong organic impressions via Search Console. Sanjay wants to grow into a senior product engineer who owns modules end-to-end, mentors others, and influences product decisions using engineering trade-offs and measurable metrics. He is motivated to move from solo delivery into team leadership while still shipping hands-on code. Sanjay measures personal impact on projects by user-visible outcomes: lead counts for LIC, certificate issuance and engagement for Zedemy, merged product stability and latency improvements for EventEase, and usable mobile UX for AgriBot. In three years, he sees himself as a senior product engineer owning large modules end-to-end, mentoring other engineers, and shaping product decisions by tying technical trade-offs to measurable business outcomes. Sanjay collects and acts on user feedback using in-app feedback, email responses, and simple analytics to identify pain points, prioritizing fixes that reduce friction in high-value flows like lead submission or certificate issuance. He prepares for technical interviews by practicing system design and coding problems, rehearsing STAR stories for behavioral rounds, and time-boxing answers. He also prepares project deep-dives for LIC, Zedemy, AgriBot, EventEase with clear metrics and trade-offs. Sanjay presents metrics effectively in interviews by leading with the headline metric like 100/100 Lighthouse and 50-60 leads/month, then briefly explaining what he did and the time period, keeping it crisp: metric to action to outcome. To open an interview when asked to tell about himself, he starts with his role and top value: he is a full-stack engineer focused on serverless SaaS, SEO-first web apps, and voice-first mobile, shipping measurable outcomes like LIC Neemuch with 100/100 Lighthouse and 50-60 leads/month, Zedemy with verifiable certificates, and AgriBot with Hindi/English voice chatbot, bringing end-to-end ownership and product impact. He decides which project story to emphasize in an interview by picking the one with the strongest measurable outcome related to the job: for growth/product roles emphasize LIC with SEO plus leads, for infra/serverless roles emphasize Zedemy’s serverless certificate pipeline, and for mobile/AI roles emphasize AgriBot’s voice plus LLM orchestration, mentioning a concrete metric early. Sanjay memorizes headline metrics and one clear technical detail per project: LIC with 100/100 Lighthouse plus 50-60 leads/month, Zedemy with UUID certificates plus verification endpoint plus follow/notify, AgriBot with Kotlin client plus server-side LLM orchestration plus Chaquopy fallback, and EventEase merge story. To answer about mentoring someone, he describes a concrete pairing example: who he mentored, the task used to teach them, and the measurable outcome, for example onboarding a contributor on EventEase by pairing on their first PR and reducing their review time from days to hours. For salary negotiation when asked for a number, he states a researched range anchored in the market and his impact: targeting 15 LPA based on comparable roles and end-to-end product experience; open to discussing overall comp and growth, keeping tone collaborative. To close an interview strongly, he thanks them, summarizes his top relevant achievement in one sentence, restates enthusiasm for the role, and asks a thoughtful question about the team’s immediate priorities, like thanks, excited about helping reduce time-to-value; what’s the team’s current biggest product/tech priority.

### Professional Weaknesses and Improvements
Sanjay sometimes over-engineered early prototypes, for example in Zedemy he initially spent too much time polishing the in-browser editor. He has since learned to focus on MVP-first delivery, shipping a working slice then polishing once it delivers value. That mindset helped him launch LIC within a week for a deadline. One area improved is balancing perfection with speed in prototypes. Early on with Zedemy, he overbuilt the editor UI before validating core flows. Now, he prioritizes MVPs with clear KPIs, like quick launches for LIC, and iterates based on user data. This has made him more efficient in team settings, focusing on high-impact features first.

### Communication and Stakeholder Management
Sanjay communicated with LIC’s non-tech officer by avoiding jargon, showing a one-page visual of user visits site to fills form to you get lead, then sending weekly WhatsApp updates like now ranking #4 for lic neemuch. This plain-language approach built trust and got them excited to actually use the site. He communicates with non-technical stakeholders by translating tech into business outcomes: showing a one-page visual flow like user to form to lead, sending weekly WhatsApp updates like ranking #4 for LIC Neemuch, and providing direct screenshots of analytics. That keeps things simple and builds trust. Sanjay learns new tech quickly by building a minimal prototype first, then iterating. For example, with AgriBot he implemented a tiny Hindi STT/TTS flow to validate assumptions before scaling to full LLM orchestration. Hands-on prototypes accelerate learning and reduce blind assumptions. His proudest technical achievement is turning LIC Neemuch into a production, SEO-trusted site that hit 100/100 Lighthouse and produced a meaningful business outcome of 50-60 leads/month, proving engineering directly changed revenue and trust for a local client. Follow/unfollow categories and notifications keep learners engaged: following means users get notified when new posts appear in categories they care about, increasing return visits and certificate completion rates, a clear retention lever in Zedemy. Sanjay explains Zedemy simply for a non-technical stakeholder as a learning-and-blogging platform where people log in, follow course categories, read posts, and mark them complete. When they finish all posts in a category the system emails them a verifiable certificate they can share, designed so learning leads to a shareable credential. He explains LIC’s business impact to a non-technical stakeholder by showing the outcome: your site now appears in local Google results and delivers X qualified leads per month, then walking them through a screenshot of Search Console and a lead list so the value is tangible. Recognition received for work includes a blog project garnering 1.8M impressions in two months, drawing attention from industry recruiters including a hiring manager from Ex-Microsoft; and a LinkedIn post by an Apple SWE where he suggested a rewrite fix on deep-link 404s received friendly acknowledgement. These moments validated both the technical quality of his work and ability to spot practical production issues that matter to other engineers. Sanjay pitches EventEase to a non-engineer in one sentence as a single tool to create and manage events, register attendees, and view simple dashboards, secure logins and clear workflows for both attendees and organizers. He shows results to non-technical stakeholders with a short dashboard of KPIs like leads per week, impressions, certs issued plus a screenshot of Search Console or the site rank. Concrete numbers and screenshots beat jargon every time. Sanjay keeps blog/course content fresh by scheduling content updates and encouraging authenticated contributors to add posts. For Zedemy he also notifies followers when new posts publish, which keeps users returning and demonstrates active maintenance to search engines.

### Projects
- **Digitizing a 60-Year-Old Insurance Office (LIC Neemuch)**:
  - **Problem**: A government insurance office in Neemuch had no digital presence, relying on pamphlets and WhatsApp forwards, with no system for online leads and poor search visibility.
  - **Solution**: Sanjay built a serverless platform with React, Tailwind CSS, Vite, React Helmet for frontend; AWS Lambda, API Gateway, MongoDB Atlas for backend; AWS S3, CloudFront, SSL via ACM, Cloudflare DNS for infrastructure; and CloudWatch Logs for monitoring. The frontend is pre-rendered static HTML built with React + Vite and React Helmet for SEO metadata. All pages, including FAQs, are fully SSR for fast first paint and structured FAQ schema for SEO. Hosting is on AWS S3 with CloudFront CDN for global caching, Brotli compression, and HTTPS via ACM. DNS is managed by Cloudflare with DNSSEC. Form submissions are sent through API Gateway into a Lambda function, which validates inputs and stores leads in MongoDB Atlas. He added indexes on queries and masked IPs for privacy. Logs and errors are tracked via CloudWatch, while SEO results are monitored in Google Search Console. Deployment is automated with a bash script that syncs S3 and invalidates CloudFront caches. This stack gave sub-800ms TTI, 100/100 Lighthouse, and real results—the client got 50-60 leads per month, a 3x increase compared to pre-digital. He chose S3 over a managed CMS to prioritize speed and cost, planning to add editable sections later. To achieve 100/100 Lighthouse, he pre-rendered every page so crawlers and users saw HTML instantly, inlined critical CSS for above-the-fold, lazy-loaded all non-critical scripts and images, compressed assets with Brotli on CloudFront, and optimized font preloading. He removed third-party scripts to keep bundle size small. The result was 100/100 Lighthouse with LCP under 800ms, which directly improved ranking and conversions. For security, he enforced HTTPS with ACM, sanitized all inputs in Lambda, stored only minimal PII in MongoDB, and avoided trackers or third-party cookies. He handled spam or malformed form submissions by validating inputs client-side and server-side in Lambda, including simple anti-spam checks like honeypot/CSRF considerations, and masking IPs stored in MongoDB to respect privacy.
  - **Outcomes**: Achieved 100/100 Lighthouse score, ranked pages within days via SEO with React Helmet and pre-rendering, increased inquiry submissions by 3x in two months, hit 100/100 Lighthouse and appeared in Google’s AI Overview, driving 50-60 leads a month. The site now appears in local Google results and delivers qualified leads per month.
  - **Proof**: Paid freelance project (₹50,000) with signed Letter of Engagement and SRS document. Turned LIC Neemuch into a 100/100 Lighthouse site with 3x more inquiries.
- **Zedemy LMS**: A serverless learning management system with markdown-to-HTML rendering, author dashboards, and UUID-based certificates. Built with React, Tailwind, Node.js, Express, DynamoDB, and Google OAuth2. Achieved 100/100 Lighthouse score, indexed 12+ blogs in 72 hours, and supports scalable CMS for bootcamps. Zedemy is a serverless learning and content platform built with React + Vite, Redux, and Tailwind on the frontend and AWS Lambda + DynamoDB on the backend. Authenticated users can log in, create and submit blog posts under course categories with moderation flow, follow/unfollow categories, and receive notifications via notification bell when new posts are published. Users can mark posts completed within a category; when all posts in a category are completed the system triggers a Lambda that validates completion, generates a UUID-backed verifiable certificate, stores it in DynamoDB, and emails the certificate to the user; there’s also a public certificate verification endpoint. The platform implements dynamic slugs, React Helmet for SEO, Vercel rewrites for crawler routing, an in-browser code editor with autosave using localStorage, and a notification system reflecting follows and course updates. Operationally, Vercel handles frontend CDN and rewrites; API Gateway routes calls to Lambda which executes modular handlers for posts, completions, certificates and notifications. This design lets Zedemy scale with minimal ops while offering a rich social/learning feature set and verified credential capabilities. When a user marks all posts in a category complete, a Lambda validates the completion logs, creates a certificate record with UUID, userId, categoryId, and timestamp in DynamoDB, then sends the certificate via email. There’s also a public certificate verification endpoint that looks up the UUID and returns metadata for sharing without requiring login. Authenticated posts go into a moderation queue; moderators or an admin Lambda handler review and publish posts to the public feed. This keeps content quality and prevents spam while preserving contributor growth. When a new post is published in a category, the publish Lambda triggers a notification flow: it enqueues user notifications based on follow lists, writes notifications to DynamoDB, emits a push/real-time event for users with active sessions or shows in the notification bell UI, and schedules email digests for others. This decoupled flow keeps UI responsive and notification delivery resilient. For dynamic slug routing and SEO, Vercel rewrites ensure deep links serve the correct metadata for crawlers, and React Helmet injects dynamic meta tags per slug. This combination ensures crawlers see the real content and metadata even if client routes are dynamic, and was a key fix to get posts indexed and featured. He maintains completionLogs keyed by userId + categoryId with per-post mark entries. When the set of posts for a category matches the set of completed posts, the certificate Lambda validates and triggers issuance. This keeps checks O(1) against indexed keys and prevents race conditions.
  - **Outcomes**: Reduced costs by 40%, designed certificate generation and verification using DynamoDB + AWS Lambda, boosted user trust, increased completion rates. Follow/unfollow and the notification bell keep learners engaged, increasing return visits and certificate completion rates. A user completes milestones, a frontend call triggers Lambda to generate a UUID-based certificate stored in DynamoDB. A public verification endpoint accepts the UUID and returns certificate metadata without requiring login. This allowed students to share verifiable links on resumes, building trust and adoption.
- **AgriBot**: A bilingual voice-first chatbot for farmers powered by AWS Lambda and LLMs. Built as a multilingual Android chatbot with speech recognition, offline fallbacks, and LLM orchestration on AWS. Target users were farmers in Neemuch and nearby towns, many not fluent in English and some with limited literacy. Voice-first with Hindi + English lowered the barrier completely. With SpeechRecognizer and Hindi TTS, they could just speak and hear back. That UX decision directly aligned with adoption. If the Lambda call fails, the client falls back to Chaquopy where preloaded canned, local responses for FAQs. Message state is stored in SharedPreferences, so the chat persists. This way, even offline, users see something useful instead of a dead app. To prevent cold starts for Lambdas in AgriBot LLM flows, he kept Lambdas small, minimized layers, reused connections, and provisioned concurrency for critical hot paths. For AgriBot LLMs he trimmed layers and considered provisioned concurrency for the most trafficked endpoints. AgriBot uses SharedPreferences/local persistence and a lightweight Chaquopy-based canned response fallback so users get useful answers even when network calls fail; message state is preserved across restarts. Tested on real low-end Android devices for AgriBot.
  - **Outcomes**: Shows mobile/AI skills with voice features for real-world use, offline fallback and AWS serverless scaling, faster response times, lower infra costs, and better user adoption.
- **EventEase**: A no-code event publishing SaaS with Google Calendar API integration, React + FullCalendar UI, and MongoDB Atlas backend. Indexed event pages in 48 hours, achieved 98+ Lighthouse score, and empowered 10+ admins to publish events without training. EventEase is a MERN app with React + Redux Toolkit + FullCalendar on frontend. Backend is Node/Express with MongoDB Atlas. Auth uses Passport.js for Google OAuth plus JWT for sessions. Role-based access is handled by JWT claims checked in Express middleware. Integrated Google Calendar with OAuth2 refresh tokens stored securely and a /sync-google-calendar endpoint to push/pull events. Hosting started on Render for fast iteration; migration plan is to AWS Lambda for cost savings. Performance-wise, dashboards were optimized with pagination and memoization, giving Lighthouse ~98. To secure authentication, uses Passport.js for Google OAuth and email/password; issues JWTs stored in HTTP-only cookies and validates role claims server-side with middleware. Refresh tokens and Google OAuth tokens are kept server-side; critical flows use HTTPS and CORS restrictions. This hybrid ensures secure session handling and protects tokens from client exposure. Merged two EventEase subprojects (EventEase + EventPro) by refactoring both codebases into a shared Redux structure, modular routing (/eventease/* and /eventpro/*), and slice-scoped state to avoid conflicts. Introduced central route guards and consistent JWT role checks so session management and redirects worked across both subprojects. This reduced duplication by ~40% and preserved separate logins while providing a unified UX. Manages redirects and session continuity across dynamic routes using consistent session cookies (HTTP-only JWTs), middleware that decodes tokens and applies role checks, and redirect rules in the frontend router to send users to their correct dash based on role and authentication status. This keeps deep links safe across merges. Optimized EventEase dashboards by introducing pagination, lazy data fetching per panel, and React.memo for expensive components, plus compact Redux slices. That reduced initial payloads and cut perceived load time by ~25%, improving Lighthouse performance to ~98. Integrates Google Calendar via the googleapis library with OAuth2 flows; refresh tokens are stored server-side and a /sync-google-calendar endpoint handles two-way sync. Frontend uses FullCalendar for UI and writes go through protected endpoints which update Google calendars under the user’s consent.
  - **Outcomes**: Indexed event pages in 48 hours, achieved 98+ Lighthouse score.
- **ConnectNow**: A peer-to-peer audio-video platform using raw WebRTC, Express, and Socket.IO for custom signaling. Features dynamic room creation, STUN/TURN fallback, and zero third-party SDKs. Handled 20+ test sessions with secure, ephemeral rooms.

### Technical Practices and Designs
Serverless with AWS Lambda across projects gave zero-maintenance infra, cost aligned with traffic, and secure handling of secrets. In LIC, Lambda processed form submissions without the client worrying about servers. In Zedemy, Lambda scaled course APIs to thousands of reads. In AgriBot, it offloaded LLM orchestration securely, keeping keys out of the APK. The trade-offs are cold starts and vendor lock-in, but mitigated cold starts with provisioned concurrency and isolated logic for future migration. Designs APIs for scalability with stateless endpoints with strict JSON contracts, keeping individual Lambdas small and single-purpose, and using managed DBs that scale like DynamoDB for Zedemy’s certificate and post flows and MongoDB Atlas for richer queries. Partitions data to avoid hot keys, adds pagination and caching at CDN or client level, and relies on API Gateway throttles and exponential backoff. This lets traffic spike without adding ops. Handles SEO in React apps by making pages crawlable: injecting per-page metadata via React Helmet, pre-rendering or SSR important landing pages, providing JSON-LD FAQ/schema, submitting sitemaps to Search Console, and serving HTML via CDN like Vercel/S3+CloudFront for fast LCP. That exact approach helped LIC Neemuch index in days and Zedemy get featured in Google’s AI Overview. Optimizes frontend performance by inlining critical CSS, tree-shaking and code-splitting bundles, lazy-loading below-the-fold, preloading important fonts, and pushing static assets through a CDN with Brotli compression. Also removes unnecessary third-party scripts. These combined steps gave LIC a sub-800ms TTI and Zedemy sub-1000ms page loads. Instruments and monitors production by logging structured events to CloudWatch for Lambda or centralized logs for Render, setting alerts for 5xx and latency, and reviewing Search Console for SEO. For high-value flows adds simple availability alerts via SNS/email. Tests across browsers and devices by testing Chrome, Firefox, Edge for web, using browser devtools for network and rendering checks, and testing on real low-end Android devices for AgriBot. For SSR pages validates Search Console crawling.

### Skills
- **Frontend**: Proficient in React, Next.js, TypeScript, Tailwind CSS; builds responsive, accessible UIs with lazy loading and code splitting.
- **Backend**: Expertise in Node.js, Express, MongoDB, serverless (AWS Lambda, API Gateway, DynamoDB); designs scalable REST and GraphQL APIs.
- **Cloud**: AWS Certified, specializing in serverless (Lambda, Step Functions, SQS), CloudFormation, CDK, and CI/CD with GitHub Actions.
- **SEO**: Advanced skills in JSON-LD schemas, SSR, structured data, mobile-first optimization; improved load times by 40% and search rankings.
- **Other**: Experienced with WebRTC, Socket.io, Google Calendar API, Jest, GitHub, and accessibility (semantic HTML, alt tags).

### Achievements
- Delivered 12+ applications across multiple domains.
- Achieved 500K+ impressions and 20K+ clicks on EduXcel.
- Reduced Zedemy costs by 40% and insurance office load times by 70%.
- Recognized by Amazon and Microsoft hiring managers for platforms and content.
- Led Aravali Sadan as captain, managing hostel duties and sports.
- Turned LIC Neemuch into a production, SEO-trusted site that hit 100/100 Lighthouse and produced 50-60 leads/month.
- Garnered 1.8M impressions in two months on a blog project, drawing attention from industry recruiters including Ex-Microsoft hiring manager.
- Suggested a rewrite fix on deep-link 404s in a LinkedIn post acknowledged by an Apple SWE.

### Challenges Overcome
- Overcame academic detention by proving project impact.
- Resolved EventEase design disputes with data-driven A/B testing.
- Met insurance office’s 3-week deadline with CI/CD and milestones.
- Self-taught Google Calendar API and WebRTC under pressure.
- Balanced hostel pranks (e.g., midnight cooking) with leadership roles.
- Over-engineered early prototypes like in Zedemy spending too much time polishing the in-browser editor, learned to focus on MVP-first delivery.
- Balanced perfection with speed in prototypes, overbuilt editor UI in Zedemy before validating core flows, now prioritizes MVPs with clear KPIs.

### Contact
- Email: sanjay.awsindia@gmail.com
- LinkedIn: linkedin.com/in/sanjay-patidar
`;
  const hindiContext = `
संजय पाटीदार एक सर्वरलेस फुल-स्टैक SaaS इंजीनियर हैं, जिन्हें अमेज़न और माइक्रोसॉफ्ट के हायरिंग मैनेजरों द्वारा प्रोडक्शन-ग्रेड प्लेटफॉर्म और टेक कंटेंट बनाने के लिए मान्यता प्राप्त है। उन्होंने बीमा, शिक्षा, संचार और इवेंट मैनेजमेंट में 12+ रियल-वर्ल्ड एप्लिकेशन डिलीवर किए हैं, जो 127 देशों में ग्लोबल पहुंच रखते हैं।

### स्कूल जीवन
संजय ने जागृति माध्यमिक विद्यालय में 5वीं कक्षा तक पढ़ाई की, जहां उन्होंने हर कक्षा में 90% से अधिक अंक प्राप्त किए और 5वीं में 93% लाकर स्कूल टॉपर बने, जिससे एक सहपाठी प्रभावित हुई, जो बाद में उनके साथ जवाहर नवोदय विद्यालय, रामपुरा (नीमच) में शामिल हुई। नवोदय में सात साल (6वीं से 12वीं) अरावली सदन हॉस्टल में रहे, जो अरावली पहाड़ियों और चंबल नदी के पास एक खूबसूरत जगह थी।

#### नवोदय यात्रा
- **दाखिला और अरावली सदन**: 10 साल की उम्र में संजय ने नवोदय में दाखिला लिया, एक सख्त नियमों वाला सरकारी बोर्डिंग स्कूल। दाखिले के दिन, देसी हैरी पॉटर की तरह, उन्होंने अरावली सदन की तारीफ सुनकर उसी में शामिल होने की जिद की (हालांकि उन्हें उदयगिरी में चुना गया था), और अगले सात साल तक गर्व से अपने “हाउस” का हिस्सा रहे।
- **दैनिक जीवन**: नवोदय में जीवन अनुशासित मगर रोमांचक था। सुबह 6 बजे उठकर संजय कपड़े धोते, नहाते (हालांकि “स्मार्ट गोरा लड़का” होने के नाते वे रोज नहाने की जरूरत पर सवाल उठाते!)। सुबह की कसरत के बाद 7 बजे नाश्ते का सायरन बजते ही वे अपने पसंदीदा पोहा-जलेबी के लिए दौड़ पड़ते, जिसके चलते उन्हें “पोहा पगलु” का खिताब मिला।
- **स्कूल और खेल**: स्कूल सुबह 8 बजे प्रार्थना से शुरू होकर दोपहर 2 बजे तक चलता, जिसमें पढ़ाई और मस्ती दोनों शामिल थे। दोपहर के भोजन में फूल गोभी, भिंडी और सेव की सब्जी संजय को बहुत पसंद थी। 1 घंटे आराम के बाद दोबारा स्कूल जाना पड़ता, जब नींद सबसे ज्यादा सताती। शाम 5 बजे छुट्टी के बाद 1 घंटे का खेल का समय सबसे शानदार था। फुटबॉल के दीवाने संजय ने पापा से जिद करके फुटबॉल खरीदा, लेकिन स्कूल के सख्त नियमों के कारण इसे छिपाकर रखना पड़ा। एक बार पीटी टीचर ने इसे जब्त कर लिया, जिससे संजय इतना रोए जैसे उनका पहला प्यार चला गया हो, पर बाद में फुटबॉल वापस मिल गया। 6वीं, 7वीं और 8वीं में उन्होंने जमकर फुटबॉल खेला।
- **हॉस्टल की शरारतें**: शाम 6 बजे प्रार्थना, फिर नाश्ता (समोसा या सेवफल), और 8 बजे तक शाम की कक्षाएं। रात का खाना टीवी देखते हुए खाया जाता। 11वीं कक्षा में संजय की शरारतें चरम पर थीं, जैसे रात 3 बजे खिड़कियों से चढ़ना और ईंट पर हीटर कॉइल लगाकर गुलाब जामुन बनाना। एक बार बिना दरवाजा बंद किए गुलाब जामुन बनाते पकड़े गए, लेकिन हाउस मास्टर ने सिर्फ दो जामुन खाए और मजाक में कहा, “अगली बार अच्छे बनाना!” संजय का अच्छा स्वभाव उन्हें बचा ले गया।
- **नेतृत्व भूमिकाएं**: 8वीं तक अपने अच्छे व्यवहार और मजबूत कद-काठी के कारण संजय को जूनियर अरावली सादन कैप्टन बनाया गया। 11वीं में सीनियर कैप्टन, टीवी इंचार्ज और स्पोर्ट्स इंचार्ज बने, जिनके पास टीवी और जिम की चाबियां थीं। स्टूडेंट ऑन ड्यूटी के रूप में, वे मेस की सप्लाई का हिसाब रखते, चुपके से पोहा-जलेबी बचाते, और दिनभर टीवी देखते। फुटबॉल की लत ने उनकी सिक्स-पैक बॉडी बनाई, जिसे वे जानबूझकर दिखाते ताकि सहपाठी प्रभावित हों।
- **यादगार पल**: दीवाली की एक महीने की छुट्टियों में रात को घर जाने की खुशी में सामान पैक करना यादगार था। 11वीं में संजय ने मासूमियत छोड़कर नवोदय का पूरा लुत्फ उठाया, ऐतिहासिक शरारतें कीं। 12वीं में CBSE बोर्ड के लिए पढ़ाई पर फोकस किया, पर फुटबॉल कभी नहीं छोड़ा। सात साल बाद, संजय ने नवोदय से विदाई ली, नेतृत्व और हंसी की विरासत छोड़कर।

#### कैरियर की शुरुआत
नवोदय के बाद, संजय के पिता ने उन्हें IIT की तैयारी के लिए कोटा, राजस्थान भेजा, जिसने उनके बचपन की मस्ती को करियर की दौड़ में बदल दिया, हालांकि फुटबॉल और पोहे का प्यार आज भी बरकरार है। संजय ने एंड-टू-एंड अनुभव प्राप्त करने के लिए लीनियर कॉर्पोरेट पाथ के बजाय हैंड्स-ऑन प्रोडक्ट वर्क चुना। उस समय उन्होंने कई प्रोडक्शन ऐप्स (LIC, Zedemy, AgriBot) बनाए, इंफ्रा, SEO और मोबाइल कंस्ट्रेंट्स सीखे, और ठोस परिणाम दिए—सर्च विजिबिलिटी, लीड्स और सर्टिफिकेट्स। यह बैकग्राउंड उन्हें प्रैक्टिकल बनाता है और प्रोडक्ट रोल में तुरंत योगदान देने के लिए तैयार करता है।

### व्यावसायिक ताकत और दृष्टिकोण
संजय की सबसे बड़ी ताकत स्वामित्व और एंड-टू-एंड समस्या-समाधान है, जो इंजीनियरिंग को व्यावसायिक परिणामों से जोड़ती है। वह एक विचार को खाली पेज से प्रोडक्शन तक ले जा सकता है, फ्रंटएंड, बैकएंड, इंफ्रा और SEO को संभालते हुए। Zedemy में, उन्होंने स्केलेबल सर्टिफिकेट वेरिफिकेशन डिजाइन किया जो कंपलीशन रेट्स बढ़ाता है। AgriBot में, उन्होंने ऑफलाइन चुनौतियों को संभाला ताकि लो-एंड डिवाइसेज पर उपयोगिता सुनिश्चित हो। यह उसे मॉड्यूल्स को पूरी तरह से ओन करने देता है, डिजाइन से डिप्लॉयमेंट तक, जबकि बड़े सिस्टम्स पर सहयोग करता है। वह फीचर्स को प्रभाव गुणा प्रयास से प्राथमिकता देता है, वे चुनता है जो KPI जैसे लीड काउंट या सर्टिफिकेट कंपलीशन्स को न्यूनतम इंजीनियरिंग प्रयास से आगे बढ़ाते हैं। LIC के लिए उसने तेज SSR पेज और वर्किंग इंक्वायरी फॉर्म्स को पॉलिश से पहले प्राथमिकता दी; Zedemy के लिए सर्टिफिकेट वेरिफिकेशन और नोटिफिकेशन फ्लो को UI कॉस्मेटिक्स से पहले। यह दृष्टिकोण मापनीय परिणाम जल्दी पैदा करता है। संजय सोलो डेव के रूप में कोड क्वालिटी बनाए रखता है फीचर ब्रांचेस और PRs का उपयोग करके, कोर लॉजिक के लिए यूनिट टेस्ट्स लिखकर, क्रिटिकल फ्लोज जैसे फॉर्म्स और सर्टिफिकेट्स के लिए इंटीग्रेशन चेक्स जोड़कर, और छोटे डिप्लॉयेबल चेकपॉइंट्स रखकर। डॉक्यूमेंटेशन और deploy.sh या CI स्क्रिप्ट्स उसे बिल्ड्स को विश्वसनीय रूप से दोहराने देते हैं, रिग्रेशन्स कम करते हैं और इटरेशन तेज रखते हैं। वह प्रोडक्ट सफलता को प्राइमरी KPI जैसे फॉर्म सबमिशन्स और सेकंडरी जैसे ऑर्गेनिक इंप्रेशन्स और रैंकिंग से मापता है। लॉन्च के बाद LIC के लिए, वह 50-60 मासिक फॉर्म सबमिशन्स और सर्च कंसोल के माध्यम से मजबूत ऑर्गेनिक इंप्रेशन्स ट्रैक करता है। संजय सीनियर प्रोडक्ट इंजीनियर बनना चाहता है जो मॉड्यूल्स को एंड-टू-एंड ओन करता है, दूसरों को मेंटर करता है, और इंजीनियरिंग ट्रेड-ऑफ्स और मापनीय मेट्रिक्स का उपयोग करके प्रोडक्ट निर्णयों को प्रभावित करता है। वह सोलो डिलीवरी से टीम लीडरशिप में जाने के लिए प्रेरित है जबकि अभी भी हैंड्स-ऑन कोड शिप करता है। संजय प्रोजेक्ट्स पर व्यक्तिगत प्रभाव को यूजर-विजिबल आउटकम्स से मापता है: LIC के लिए लीड काउंट्स, Zedemy के लिए सर्टिफिकेट इश्यूएंस और एंगेजमेंट, EventEase के लिए मर्ज्ड प्रोडक्ट स्टेबिलिटी और लेटेंसी इंप्रूवमेंट्स, और AgriBot के लिए यूजेबल मोबाइल UX। तीन सालों में, वह खुद को सीनियर प्रोडक्ट इंजीनियर के रूप में देखता है जो बड़े मॉड्यूल्स को एंड-टू-एंड ओन करता है, अन्य इंजीनियर्स को मेंटर करता है, और तकनीकी ट्रेड-ऑफ्स को मापनीय व्यावसायिक आउटकम्स से जोड़कर प्रोडक्ट निर्णयों को आकार देता है। संजय यूजर फीडबैक एकत्र करता है और इन-ऐप फीडबैक, ईमेल रेस्पॉन्सेस, और सरल एनालिटिक्स का उपयोग करके पेन पॉइंट्स की पहचान करता है, फिक्सेस को प्राथमिकता देता है जो हाई-वैल्यू फ्लोज जैसे लीड सबमिशन या सर्टिफिकेट इश्यूएंस में फ्रिक्शन कम करते हैं। वह तकनीकी इंटरव्यूज के लिए तैयारी करता है सिस्टम डिजाइन और कोडिंग प्रॉब्लम्स प्रैक्टिस करके, बिहेवियरल राउंड्स के लिए STAR स्टोरीज रिहर्स करके, और उत्तरों को टाइम-बॉक्स करके। वह LIC, Zedemy, AgriBot, EventEase के लिए प्रोजेक्ट डीप-डाइव्स भी तैयार करता है स्पष्ट मेट्रिक्स और ट्रेड-ऑफ्स के साथ। संजय इंटरव्यूज में मेट्रिक्स प्रभावी रूप से पेश करता है हेडलाइन मेट्रिक जैसे 100/100 लाइटहाउस और 50-60 लीड्स/मंथ से शुरू करके, फिर संक्षेप में बताता है कि उसने क्या किया और समय अवधि, इसे क्रिस्प रखते हुए: मेट्रिक से एक्शन से आउटकम। इंटरव्यू खोलने के लिए जब खुद के बारे में बताने को कहा जाता है, वह अपनी भूमिका और टॉप वैल्यू से शुरू करता है: वह सर्वरलेस SaaS, SEO-फर्स्ट वेब ऐप्स, और वॉइस-फर्स्ट मोबाइल पर फोकस्ड फुल-स्टैक इंजीनियर है, मापनीय आउटकम्स शिप करता है जैसे LIC Neemuch 100/100 लाइटहाउस और 50-60 लीड्स/मंथ के साथ, Zedemy वेरिफायेबल सर्टिफिकेट्स के साथ, और AgriBot हिंदी/इंग्लिश वॉइस चैटबॉट के साथ, एंड-टू-एंड ओनरशिप और प्रोडक्ट इम्पैक्ट लाता है। वह इंटरव्यू में किस प्रोजेक्ट स्टोरी को जोर देना है यह तय करता है सबसे मजबूत मापनीय आउटकम वाली वाली चुनकर जो जॉब से संबंधित हो: ग्रोथ/प्रोडक्ट रोल्स के लिए LIC को SEO प्लस लीड्स पर जोर, इंफ्रा/सर्वरलेस रोल्स के लिए Zedemy की सर्वरलेस सर्टिफिकेट पाइपलाइन पर, और मोबाइल/AI रोल्स के लिए AgriBot की वॉइस प्लस LLM ऑर्केस्ट्रेशन पर, एक कंक्रीट मेट्रिक जल्दी मेंशन करके। संजय हेडलाइन मेट्रिक्स और प्रति प्रोजेक्ट एक स्पष्ट तकनीकी डिटेल मेमोराइज करता है: LIC 100/100 लाइटहाउस प्लस 50-60 लीड्स/मंथ, Zedemy UUID सर्टिफिकेट्स प्लस वेरिफिकेशन एंडपॉइंट प्लस फॉलो/नोटिफाई, AgriBot Kotlin क्लाइंट प्लस सर्वर-साइड LLM ऑर्केस्ट्रेशन प्लस Chaquopy फॉलबैक, और EventEase मर्ज स्टोरी। मेंटरिंग के बारे में उत्तर देने के लिए, वह एक कंक्रीट पेयरिंग उदाहरण बताता है: किसे मेंटर किया, उन्हें सिखाने के लिए इस्तेमाल टास्क, और मापनीय आउटकम, उदाहरण के लिए EventEase पर एक कंट्रीब्यूटर को ऑनबोर्ड करके उनके पहले PR पर पेयरिंग करके और उनकी रिव्यू टाइम को दिनों से घंटों में कम करके। सैलरी नेगोशिएशन के लिए जब नंबर पूछा जाता है, वह मार्केट और अपने इम्पैक्ट पर आधारित रिसर्च्ड रेंज बताता है: तारगेटिंग 15 LPA तुलनीय रोल्स और एंड-टू-एंड प्रोडक्ट अनुभव पर आधारित; ओवरॉल कॉम्प और ग्रोथ पर चर्चा करने के लिए ओपन, टोन कोलैबोरेटिव रखते हुए। इंटरव्यू को मजबूती से बंद करने के लिए, वह उन्हें थैंक्स कहता है, अपनी टॉप रिलेवेंट अचीवमेंट को एक वाक्य में समराइज करता है, रोल के लिए उत्साह दोहराता है, और टीम की इमीडिएट प्रायोरिटी के बारे में एक थॉटफुल प्रश्न पूछता है, जैसे थैंक्स, टाइम-टू-वैल्यू कम करने में मदद करने के लिए उत्साहित हूं; टीम की मौजूदा सबसे बड़ी प्रोडक्ट/टेक प्रायोरिटी क्या है।

### व्यावसायिक कमजोरियां और सुधार
संजय कभी-कभी शुरुआती प्रोटोटाइप्स को ओवर-इंजीनियर करता था, उदाहरण के लिए Zedemy में इन-ब्राउजर एडिटर को पॉलिश करने में ज्यादा समय बिताया। उसने तब से MVP-फर्स्ट डिलीवरी पर फोकस करना सीखा, एक वर्किंग स्लाइस शिप करके फिर वैल्यू डिलीवर होने पर पॉलिश करना। वह माइंडसेट ने उसे डेडलाइन के लिए एक हफ्ते में LIC लॉन्च करने में मदद की। एक क्षेत्र जहां सुधार हुआ है प्रोटोटाइप्स में परफेक्शन और स्पीड को बैलेंस करना। Zedemy के साथ शुरुआत में, उसने कोर फ्लोज वैलिडेट करने से पहले एडिटर UI को ओवरबिल्ट किया। अब, वह क्लियर KPI के साथ MVP को प्राथमिकता देता है, जैसे LIC के लिए क्विक लॉन्चेस, और यूजर डेटा के आधार पर इटरेट करता है। इससे वह टीम सेटिंग्स में ज्यादा कुशल हुआ है, हाई-इम्पैक्ट फीचर्स को पहले फोकस करके।

### संचार और स्टेकहोल्डर प्रबंधन
संजय ने LIC के नॉन-टेक ऑफिसर से संवाद किया जार्गन से बचकर, एक-पेज विजुअल दिखाकर यूजर साइट विजिट करता है से फॉर्म भरता है से आपको लीड मिलता है, फिर वीकली WhatsApp अपडेट्स भेजकर जैसे अब lic neemuch के लिए #4 रैंकिंग। यह प्लेन-लैंग्वेज अप्रोच ट्रस्ट बनाता है और उन्हें साइट इस्तेमाल करने के लिए उत्साहित करता है। वह नॉन-टेक्निकल स्टेकहोल्डर्स से संवाद करता है टेक को बिजनेस आउटकम्स में ट्रांसलेट करके: एक-पेज विजुअल फ्लो दिखाकर यूजर से फॉर्म से लीड, वीकली WhatsApp अपडेट्स भेजकर जैसे LIC Neemuch के लिए #4 रैंकिंग, और एनालिटिक्स के डायरेक्ट स्क्रीनशॉट्स प्रदान करके। इससे चीजें सरल रहती हैं और ट्रस्ट बनता है। संजय नई टेक जल्दी सीखता है मिनिमल प्रोटोटाइप पहले बनाकर, फिर इटरेट करके। उदाहरण के लिए, AgriBot के साथ उसने छोटा हिंदी STT/TTS फ्लो इंप्लीमेंट किया असम्प्शन्स वैलिडेट करने के लिए फुल LLM ऑर्केस्ट्रेशन स्केल करने से पहले। हैंड्स-ऑन प्रोटोटाइप्स लर्निंग तेज करते हैं और ब्लाइंड असम्प्शन्स कम करते हैं। उसकी सबसे गर्व की तकनीकी अचीवमेंट LIC Neemuch को प्रोडक्शन, SEO-ट्रस्टेड साइट में बदलना है जो 100/100 लाइटहाउस हिट की और मीनिंगफुल बिजनेस आउटकम 50-60 लीड्स/मंथ पैदा की, साबित किया इंजीनियरिंग ने रेवेन्यू और ट्रस्ट को डायरेक्टली बदला लोकल क्लाइंट के लिए। फॉलो/अनफॉलो कैटेगरी और नोटिफिकेशन बेल लर्नर्स को एंगेज रखते हैं: फॉलो करने का मतलब यूजर्स को नोटिफाई किया जाता है जब नई पोस्ट्स कैटेगरी में आती हैं जो उन्हें पसंद हैं, रिटर्न विजिट्स और सर्टिफिकेट कंपलीशन रेट्स बढ़ाता है, Zedemy में क्लियर रिटेंशन लीवर। संजय Zedemy को नॉन-टेक्निकल स्टेकहोल्डर के लिए सरलता से समझाता है लर्निंग-एंड-ब्लॉगिंग प्लेटफॉर्म जहां लोग लॉग इन करते हैं, कोर्स कैटेगरी फॉलो करते हैं, पोस्ट्स पढ़ते हैं, और उन्हें कंपलीट मार्क करते हैं। जब कैटेगरी में सभी पोस्ट्स कंपलीट होते हैं सिस्टम उन्हें वेरिफायेबल सर्टिफिकेट ईमेल करता है जिसे शेयर कर सकते हैं, डिजाइन किया गया ताकि लर्निंग शेयरेबल क्रेडेंशियल की ओर ले जाए। वह LIC के बिजनेस इम्पैक्ट को नॉन-टेक्निकल स्टेकहोल्डर को समझाता है आउटकम दिखाकर: आपकी साइट अब लोकल गूगल रिजल्ट्स में दिखती है और X क्वालिफाइड लीड्स प्रति मंथ डिलीवर करती है, फिर सर्च कंसोल और लीड लिस्ट का स्क्रीनशॉट वॉकथ्रू करके ताकि वैल्यू टैंजिबल हो। काम के लिए प्राप्त मान्यता में एक ब्लॉग प्रोजेक्ट शामिल है जिसने दो महीनों में 1.8M इंप्रेशन्स प्राप्त किए, इंडस्ट्री रिक्रूटर्स का ध्यान खींचा जिसमें Ex-Microsoft हायरिंग मैनेजर शामिल; और एक लिंक्डइन पोस्ट जहां उसने डीप-लिंक 404s पर रीलाइट फिक्स सजेस्ट किया Apple SWE द्वारा फ्रेंडली ऐक्नॉलेजमेंट प्राप्त किया। ये मोमेंट्स उसके काम की तकनीकी क्वालिटी और अन्य इंजीनियर्स के लिए मैटर करने वाले प्रैक्टिकल प्रोडक्शन इश्यूज स्पॉट करने की क्षमता को वैलिडेट करते हैं। संजय EventEase को नॉन-इंजीनियर को एक वाक्य में पिच करता है सिंगल टूल इवेंट्स क्रिएट और मैनेज करने, अटेंडीज रजिस्टर करने, और सिंपल डैशबोर्ड्स देखने के लिए, सिक्योर लॉगिन्स और क्लियर वर्कफ्लोज अटेंडीज और ऑर्गनाइजर्स दोनों के लिए। वह नॉन-टेक्निकल स्टेकहोल्डर्स को रिजल्ट्स दिखाता है KPI की शॉर्ट डैशबोर्ड जैसे लीड्स प्रति वीक, इंप्रेशन्स, सर्ट्स इश्यूड प्लस सर्च कंसोल या साइट रैंक का स्क्रीनशॉट। कंक्रीट नंबर्स और स्क्रीनशॉट्स जार्गन से बेहतर होते हैं। संजय ब्लॉग/कोर्स कंटेंट को फ्रेश रखता है कंटेंट अपडेट्स शेड्यूल करके और ऑथेंटिकेटेड कंट्रीब्यूटर्स को पोस्ट्स ऐड करने के लिए प्रोत्साहित करके। Zedemy के लिए वह फॉलोअर्स को नोटिफाई भी करता है जब नई पोस्ट्स पब्लिश होती हैं, जो यूजर्स को वापस लाता है और सर्च इंजन्स को एक्टिव मेंटेनेंस दिखाता है।

### प्रोजेक्ट्स
- **60 साल पुराने बीमा कार्यालय का डिजिटलाइजेशन (LIC Neemuch)**:
  - **समस्या**: नीमच जिले का एक सरकारी बीमा कार्यालय पूरी तरह एनालॉग था, जिसमें कोई वेबसाइट, ऑनलाइन लीड सिस्टम, या सर्च दृश्यता नहीं थी।
  - **समाधान**: संजय ने फ्रंटएंड (React, Tailwind CSS, Vite, React Helmet), बैकएंड (AWS Lambda, API Gateway, MongoDB Atlas), इंफ्रास्ट्रक्चर (AWS S3, CloudFront, SSL via ACM, Cloudflare DNS), और मॉनिटरिंग (CloudWatch Logs) के साथ एक सर्वरलेस प्लेटफॉर्म बनाया। फ्रंटएंड प्री-रेंडर्ड स्टेटिक HTML है React + Vite और React Helmet से SEO मेटाडेटा के लिए बनाया गया। सभी पेजेस, FAQs सहित, फास्ट फर्स्ट पेंट और SEO के लिए स्ट्रक्चर्ड FAQ स्कीमा के लिए पूरी तरह SSR हैं। होस्टिंग AWS S3 पर CloudFront CDN के साथ ग्लोबल कैशिंग, Brotli कम्प्रेशन, और HTTPS via ACM के लिए। DNS Cloudflare से DNSSEC के साथ मैनेज्ड। फॉर्म सबमिशन्स API Gateway से Lambda फंक्शन में जाते हैं, जो इनपुट्स वैलिडेट करता है और लीड्स MongoDB Atlas में स्टोर करता है। उसने क्वेरीज पर इंडेक्सेस ऐड किए और प्राइवेसी के लिए IPs मास्क किए। लॉग्स और एरर्स CloudWatch से ट्रैक होते हैं, जबकि SEO रिजल्ट्स Google Search Console में मॉनिटर होते हैं। डिप्लॉयमेंट एक बैश स्क्रिप्ट से ऑटोमेटेड है जो S3 सिंक करता है और CloudFront कैशेस इनवैलिडेट करता है। यह स्टैक सब-800ms TTI, 100/100 लाइटहाउस, और रीयल रिजल्ट्स देता है—क्लाइंट को 50-60 लीड्स प्रति मंथ मिले, प्री-डिजिटल की तुलना में 3x बढ़ोतरी। उसने स्पीड और कॉस्ट प्राथमिकता देने के लिए मैनेज्ड CMS के बजाय S3 चुना, बाद में एडिटेबल सेक्शन्स ऐड करने की प्लानिंग। 100/100 लाइटहाउस अचीव करने के लिए, उसने हर पेज प्री-रेंडर्ड किया ताकि क्रॉलर्स और यूजर्स HTML इंस्टेंटली देखें, क्रिटिकल CSS को इनलाइन किया above-the-fold के लिए, नॉन-क्रिटिकल स्क्रिप्ट्स और इमेजेस को लेजी-लोड किया, एसेट्स को CloudFront पर Brotli से कम्प्रेस किया, और फॉंट प्रीलोडिंग ऑप्टिमाइज किया। थर्ड-पार्टी स्क्रिप्ट्स हटाए ताकि बंडल साइज छोटा रहे। रिजल्ट 100/100 लाइटहाउस LCP under 800ms के साथ, जो डायरेक्टली रैंकिंग और कन्वर्शन्स सुधारता है। सिक्योरिटी के लिए, ACM से HTTPS एनफोर्स किया, Lambda में सभी इनपुट्स सैनिटाइज किए, MongoDB में न्यूनतम PII स्टोर किया, और ट्रैकर्स या थर्ड-पार्टी कुकीज से बचा। स्पैम या मालफॉर्म्ड फॉर्म सबमिशन्स को हैंडल किया क्लाइंट-साइड और सर्वर-साइड वैलिडेशन से Lambda में, सिंपल एंटी-स्पैम चेक्स जैसे honeypot/CSRF कंसिडरेशन्स शामिल करके, और MongoDB में स्टोर्ड IPs को प्राइवेसी के लिए मास्क करके।
  - **परिणाम**: 100/100 लाइटहाउस स्कोर, SEO (React Helmet, प्री-रेंडरिंग) से कुछ दिनों में रैंकिंग, और दो महीनों में पूछताछ 3 गुना बढ़ी, 100/100 लाइटहाउस हिट किया और Google’s AI Overview में दिखा, 50-60 लीड्स प्रति मंथ ड्राइव किया। साइट अब लोकल गूगल रिजल्ट्स में दिखती है और क्वालिफाइड लीड्स प्रति मंथ डिलीवर करती है।
  - **प्रमाण**: ₹50,000 की पेड फ्रीलांस परियोजना, जिसमें साइन किया गया लेटर ऑफ एंगेजमेंट और SRS दस्तावेज। LIC Neemuch को 100/100 लाइटहाउस साइट में बदलकर 3x ज्यादा इंक्वायरीज दीं।
- **Zedemy LMS**: मार्कडाउन-टू-HTML रेंडरिंग, ऑथर डैशबोर्ड, और UUID-बेस्ड सर्टिफिकेट्स के साथ सर्वरलेस लर्निंग मैनेजमेंट सिस्टम। React, Tailwind, Node.js, Express, DynamoDB, और Google OAuth2 से बना। 100/100 लाइटहाउस स्कोर, 72 घंटों में 12+ ब्लॉग इंडेक्स, और बूटकैंप्स के लिए स्केलेबल CMS। Zedemy सर्वरलेस लर्निंग और कंटेंट प्लेटफॉर्म है React + Vite, Redux, और Tailwind से फ्रंटएंड पर और AWS Lambda + DynamoDB से बैकएंड पर बनाया गया। ऑथेंटिकेटेड यूजर्स लॉग इन कर सकते हैं, कोर्स कैटेगरी के तहत ब्लॉग पोस्ट्स क्रिएट और सबमिट कर सकते हैं मॉडरेशन फ्लो के साथ, कैटेगरी फॉलो/अनफॉलो कर सकते हैं, और नई पोस्ट्स पब्लिश होने पर नोटिफिकेशन्स रिसीव कर सकते हैं नोटिफिकेशन बेल से। यूजर्स कैटेगरी में पोस्ट्स कंपलीट मार्क कर सकते हैं; जब कैटेगरी में सभी पोस्ट्स कंपलीट होते हैं सिस्टम Lambda ट्रिगर करता है जो कंपलीशन वैलिडेट करता है, UUID-बैक्ड वेरिफायेबल सर्टिफिकेट जनरेट करता है, DynamoDB में स्टोर करता है, और यूजर को ईमेल करता है; पब्लिक सर्टिफिकेट वेरिफिकेशन एंडपॉइंट भी है। प्लेटफॉर्म डायनामिक स्लग्स, SEO के लिए React Helmet, क्रॉलर रूटिंग के लिए Vercel रीलाइट्स, लोकलस्टोरेज से ऑटोसेव के साथ इन-ब्राउजर कोड एडिटर, और फॉलोज और कोर्स अपडेट्स रिफ्लेक्ट करने वाला नोटिफिकेशन सिस्टम इंप्लीमेंट करता है। ऑपरेशनली, Vercel फ्रंटएंड CDN और रीलाइट्स हैंडल करता है; API Gateway कॉल्स को Lambda पर रूट करता है जो पोस्ट्स, कंपलीशन्स, सर्टिफिकेट्स और नोटिफिकेशन्स के लिए मॉड्यूलर हैंडलर्स एक्जीक्यूट करता है। यह डिजाइन Zedemy को न्यूनतम ऑप्स के साथ स्केल करने देता है जबकि रिच सोशल/लर्निंग फीचर सेट और वेरिफाइड क्रेडेंशियल कैपेबिलिटी ऑफर करता है। जब यूजर कैटेगरी में सभी पोस्ट्स कंपलीट मार्क करता है, Lambda कंपलीशन लॉग्स वैलिडेट करता है, UUID, userId, categoryId, और टाइमस्टैंप के साथ सर्टिफिकेट रेकॉर्ड क्रिएट करता है DynamoDB में, फिर सर्टिफिकेट ईमेल करता है। UUID लुकअप करने वाला पब्लिक सर्टिफिकेट वेरिफिकेशन एंडपॉइंट भी है जो मेटाडेटा रिटर्न करता है लॉगिन की जरूरत बिना। ऑथेंटिकेटेड पोस्ट्स मॉडरेशन क्यू में जाते हैं; मॉडरेटर्स या एडमिन Lambda हैंडलर रिव्यू और पब्लिक फीड में पब्लिश करते हैं। यह कंटेंट क्वालिटी रखता है और स्पैम रोकता है जबकि कंट्रीब्यूटर ग्रोथ प्रिजर्व करता है। जब कैटेगरी में नई पोस्ट पब्लिश होती है, पब्लिश Lambda नोटिफिकेशन फ्लो ट्रिगर करता है: फॉलो लिस्ट्स के आधार पर यूजर नोटिफिकेशन्स एनक्यू करता है, DynamoDB में नोटिफिकेशन्स लिखता है, एक्टिव सेशन्स वाले यूजर्स के लिए पुश/रीयल-टाइम इवेंट एमिट करता है या नोटिफिकेशन बेल UI में दिखाता है, और दूसरों के लिए ईमेल डाइजेस्ट शेड्यूल करता है। यह डिकपल्ड फ्लो UI को रेस्पॉन्सिव रखता है और नोटिफिकेशन डिलीवरी रेसिलिएंट। डायनामिक स्लग रूटिंग और SEO के लिए, Vercel रीलाइट्स डीप लिंक्स को क्रॉलर्स के लिए सही मेटाडेटा सर्व करते हैं, और React Helmet प्रति स्लग डायनामिक मेटा टैग्स इंजेक्ट करता है। यह कॉम्बिनेशन सुनिश्चित करता है कि क्रॉलर्स रीयल कंटेंट और मेटाडेटा देखें भले क्लाइंट रूट्स डायनामिक हों, और पोस्ट्स इंडेक्स और फीचर्ड होने के लिए की फिक्स था। वह userId + categoryId से कीड कंपलीशनLogs मेंटेन करता है पेर-पोस्ट मार्क एंट्रीज के साथ। जब कैटेगरी के पोस्ट्स का सेट कंपलीटेड पोस्ट्स के सेट से मैच करता है, सर्टिफिकेट Lambda वैलिडेट और इश्यूएंस ट्रिगर करता है। यह चेक्स को इंडेक्स्ड कीज के खिलाफ O(1) रखता है और रेस कंडीशन्स रोकता है।
  - **परिणाम**: 40% लागत कम की, DynamoDB + AWS Lambda से सर्टिफिकेट जनरेशन और वेरिफिकेशन डिजाइन किया, यूजर ट्रस्ट बढ़ाया, कंपलीशन रेट्स बढ़ाए। फॉलो/अनफॉलो और नोटिफिकेशन बेल लर्नर्स को एंगेज रखते हैं, रिटर्न विजिट्स और सर्टिफिकेट कंपलीशन रेट्स बढ़ाते हैं। यूजर माइलस्टोन्स कंपलीट करता है, फ्रंटएंड कॉल Lambda ट्रिगर करता है UUID-बेस्ड सर्टिफिकेट जनरेट करने के लिए DynamoDB में स्टोर्ड। पब्लिक वेरिफिकेशन एंडपॉइंट UUID एक्सेप्ट करता है और मेटाडेटा रिटर्न करता है लॉगिन बिना। इससे स्टूडेंट्स रिज्यूम्स पर वेरिफायेबल लिंक्स शेयर कर सकते हैं, ट्रस्ट और एडॉप्शन बनाते हैं।
- **AgriBot**: AWS Lambda और LLMs से पावर्ड किसानों के लिए बाइलिंगुअल वॉइस-फर्स्ट चैटबॉट। स्पीच रेकग्निशन, ऑफलाइन फॉलबैक्स, और AWS पर LLM ऑर्केस्ट्रेशन के साथ मल्टीलिंगुअल एंड्रॉइड चैटबॉट के रूप में बनाया। टारगेट यूजर्स नीमच और आसपास के किसान थे, कई इंग्लिश में फ्लुएंट नहीं और कुछ में लिमिटेड लिटरेसी। हिंदी + इंग्लिश के साथ वॉइस-फर्स्ट ने बैरियर पूरी तरह कम किया। SpeechRecognizer और हिंदी TTS के साथ, वे सिर्फ बोलकर और सुनकर कर सकते थे। वह UX निर्णय एडॉप्शन से डायरेक्टली अलाइन था। अगर Lambda कॉल फेल होता है, क्लाइंट Chaquopy पर फॉलबैक करता है जहां FAQs के लिए प्रीलोडेड कैनेड, लोकल रेस्पॉन्सेस। मैसेज स्टेट SharedPreferences में स्टोर्ड है, ताकि चैट पर्सिस्ट करे। इस तरह, ऑफलाइन भी, यूजर्स कुछ यूजफुल देखते हैं डेड ऐप की बजाय। AgriBot LLM फ्लोज में Lambdas के लिए कोल्ड स्टार्ट्स रोकने के लिए, Lambdas छोटे रखे, लेयर्स मिनिमाइज किए, कनेक्शन्स रीयूज किए, और क्रिटिकल हॉट पाथ्स के लिए प्रोविजन्ड कनकरेंसी। AgriBot LLMs के लिए लेयर्स ट्रिम किए और सबसे ट्रैफिक्ड एंडपॉइंट्स के लिए प्रोविजन्ड कनकरेंसी कंसीडर किया। AgriBot SharedPreferences/लोकल पर्सिस्टेंस और लाइटवेट Chaquopy-बेस्ड कैनेड रेस्पॉन्स फॉलबैक इस्तेमाल करता है ताकि यूजर्स नेटवर्क कॉल्स फेल होने पर भी यूजफुल उत्तर पाएं; मैसेज स्टेट रीस्टार्ट्स पर प्रिजर्व्ड है। AgriBot के लिए रीयल लो-एंड एंड्रॉइड डिवाइसेज पर टेस्ट किया।
  - **परिणाम**: मोबाइल/AI स्किल्स दिखाता है रीयल-वर्ल्ड यूज के लिए वॉइस फीचर्स के साथ, ऑफलाइन फॉलबैक और AWS सर्वरलेस स्केलिंग, तेज रेस्पॉन्स टाइम्स, कम इंफ्रा कॉस्ट्स, और बेहतर यूजर एडॉप्शन।
- **EventEase**: Google Calendar API इंटीग्रेशन, React + FullCalendar UI, और MongoDB Atlas बैकएंड के साथ नो-कोड इवेंट पब्लिशिंग SaaS। 48 घंटों में इवेंट पेज इंडेक्स, 98+ लाइटहाउस स्कोर, और 10+ एडमिन्स को बिना ट्रेनिंग के इवेंट पब्लिश करने में सक्षम बनाया। EventEase MERN ऐप है React + Redux Toolkit + FullCalendar से फ्रंटएंड पर। बैकएंड Node/Express है MongoDB Atlas के साथ। ऑथ Passport.js से Google OAuth प्लस JWT सेशन्स के लिए इस्तेमाल करता है। रोल-बेस्ड एक्सेस JWT क्लेम्स से हैंडल्ड है Express मिडलवेयर में चेक करके। Google Calendar OAuth2 रिफ्रेश टोकन्स सिक्योरली स्टोर्ड के साथ इंटीग्रेटेड और /sync-google-calendar एंडपॉइंट से पुश/पुल इवेंट्स। होस्टिंग Render पर शुरू की तेज इटरेशन के लिए; माइग्रेशन प्लान AWS Lambda पर कॉस्ट सेविंग्स के लिए। परफॉर्मेंस-वाइज, डैशबोर्ड्स पेजिनेशन और मेमोइजेशन से ऑप्टिमाइज किए, लाइटहाउस ~98 दिया। ऑथेंटिकेशन सिक्योर करने के लिए Passport.js इस्तेमाल करता है Google OAuth और ईमेल/पासवर्ड के लिए; JWTs HTTP-only कुकीज में इश्यू करता है और रोल क्लेम्स सर्वर-साइड मिडलवेयर से वैलिडेट करता है। रिफ्रेश टोकन्स और Google OAuth टोकन्स सर्वर-साइड रखे जाते हैं; क्रिटिकल फ्लोज HTTPS और CORS रेस्ट्रिक्शन्स इस्तेमाल करते हैं। यह हाइब्रिड सिक्योर सेशन हैंडलिंग सुनिश्चित करता है और टोकन्स को क्लाइंट एक्सपोजर से बचाता है। दो EventEase सबप्रोजेक्ट्स (EventEase + EventPro) मर्ज किए शेयर्ड Redux स्ट्रक्चर में रिफैक्टर करके, मॉड्यूलर रूटिंग (/eventease/* और /eventpro/*), और स्लाइस-स्कोप्ड स्टेट कॉन्फ्लिक्ट्स से बचाने के लिए। सेंट्रल रूट गार्ड्स और कंसिस्टेंट JWT रोल चेक्स इंट्रोड्यूस किए ताकि सेशन मैनेजमेंट और रीडायरेक्ट्स दोनों सबप्रोजेक्ट्स पर काम करें। इससे डुप्लिकेशन ~40% कम हुई और अलग लॉगिन्स प्रिजर्व करते हुए यूनिफाइड UX प्रदान किया। डायनामिक रूट्स पर रीडायरेक्ट्स और सेशन कंटिन्यूटी मैनेज करता है कंसिस्टेंट सेशन कुकीज (HTTP-only JWTs) से, मिडलवेयर जो टोकन्स डीकोड करता है और रोल चेक्स अप्लाई करता है, और फ्रंटएंड राउटर में रीडायरेक्ट रूल्स यूजर्स को उनकी सही डैश पर भेजने के लिए रोल और ऑथेंटिकेशन स्टेटस के आधार पर। यह डीप लिंक्स को मर्जेस पर सेफ रखता है। EventEase डैशबोर्ड्स ऑप्टिमाइज किए पेजिनेशन, पेर पैनल लेजी डेटा फेचिंग, और महंगे कंपोनेंट्स के लिए React.memo से, प्लस कॉम्पैक्ट Redux स्लाइसेस। इससे इनिशियल पेलोड्स कम हुए और पर्सिव्ड लोड टाइम ~25% कम, लाइटहाउस परफॉर्मेंस ~98 में सुधार। Google Calendar googleapis लाइब्रेरी से OAuth2 फ्लोज के साथ इंटीग्रेट करता है; रिफ्रेश टोकन्स सर्वर-साइड स्टोर्ड और /sync-google-calendar एंडपॉइंट टू-वे सिंक हैंडल करता है। फ्रंटएंड FullCalendar UI के लिए इस्तेमाल करता है और राइट्स प्रोटेक्टेड एंडपॉइंट्स से जाते हैं जो यूजर की कंसेंट के तहत Google कैलेंडर्स अपडेट करते हैं।
  - **परिणाम**: 48 घंटों में इवेंट पेज इंडेक्स, 98+ लाइटहाउस स्कोर।
- **ConnectNow**: रॉ WebRTC, Express, और Socket.IO के साथ पीयर-टू-पीयर ऑडियो-वीडियो प्लेटफॉर्म। डायनामिक रूम क्रिएशन, STUN/TURN फॉलबैक, और जीरो थर्ड-पार्टी SDKs। 20+ टेस्ट सेशन हैंडल किए।

### तकनीकी प्रैक्टिसेस और डिजाइन्स
प्रोजेक्ट्स में AWS Lambda से सर्वरलेस ने जीरो-मेंटेनेंस इंफ्रा, ट्रैफिक से अलाइन कॉस्ट, और सीक्रेट्स की सिक्योर हैंडलिंग दी। LIC में, Lambda ने फॉर्म सबमिशन्स प्रोसेस किए क्लाइंट को सर्वर्स की चिंता बिना। Zedemy में, Lambda ने कोर्स APIs को हजारों रीड्स पर स्केल किया। AgriBot में, LLM ऑर्केस्ट्रेशन सिक्योरली ऑफलोड किया, कीज APK से बाहर रखकर। ट्रेड-ऑफ्स कोल्ड स्टार्ट्स और वेंडर लॉक-इन हैं, लेकिन प्रोविजन्ड कनकरेंसी से कोल्ड स्टार्ट्स मिटिगेट किए और फ्यूचर माइग्रेशन के लिए आइसोलेटेड लॉजिक। स्केलेबिलिटी के लिए APIs डिजाइन करता है स्टेटलेस एंडपॉइंट्स स्ट्रिक्ट JSON कॉन्ट्रैक्ट्स के साथ, इंडिविजुअल Lambdas छोटे और सिंगल-पर्पज रखकर, और स्केल करने वाले मैनेज्ड DBs इस्तेमाल करके जैसे Zedemy के सर्टिफिकेट और पोस्ट फ्लोज के लिए DynamoDB और रिचर क्वेरीज के लिए MongoDB Atlas। डेटा पार्टिशन करता है हॉट कीज से बचाने के लिए, CDN या क्लाइंट लेवल पर पेजिनेशन और कैशिंग ऐड करता है, और API Gateway थ्रॉटल्स और एक्सपोनेंशियल बैकऑफ पर निर्भर करता है। इससे ट्रैफिक स्पाइक बिना ऑप्स ऐड किए। React ऐप्स में SEO हैंडल करता है पेजेस क्रॉलेबल बनाकर: React Helmet से पेर-पेज मेटाडेटा इंजेक्ट करके, महत्वपूर्ण लैंडिंग पेजेस को प्री-रेंडर या SSR करके, JSON-LD FAQ/स्कीमा प्रदान करके, साइटमैप्स सर्च कंसोल में सबमिट करके, और HTML को CDN जैसे Vercel/S3+CloudFront से सर्व करके फास्ट LCP के लिए। वह एग्जैक्ट अप्रोच ने LIC Neemuch को दिनों में इंडेक्स किया और Zedemy को Google’s AI Overview में फीचर्ड किया। फ्रंटएंड परफॉर्मेंस ऑप्टिमाइज करता है क्रिटिकल CSS इनलाइन करके, बंडल्स को ट्री-शेक और कोड-स्प्लिट करके, below-the-fold को लेजी-लोड करके, महत्वपूर्ण फॉंट्स प्रीलोड करके, और स्टेटिक एसेट्स को CDN से Brotli कम्प्रेशन के साथ पुश करके। अनावश्यक थर्ड-पार्टी स्क्रिप्ट्स भी हटाता है। ये कंबाइंड स्टेप्स ने LIC को सब-800ms TTI और Zedemy को सब-1000ms पेज लोड्स दिए। प्रोडक्शन इंस्ट्रुमेंट और मॉनिटर करता है स्ट्रक्चर्ड इवेंट्स को CloudWatch में लॉग करके Lambda के लिए या Render के लिए सेंट्रलाइज्ड लॉग्स, 5xx और लेटेंसी के लिए अलर्ट्स सेट करके, और SEO के लिए सर्च कंसोल रिव्यू करके। हाई-वैल्यू फ्लोज के लिए SNS/ईमेल से सिंपल अवेलेबिलिटी अलर्ट्स ऐड करता है। ब्राउजर्स और डिवाइसेज पर टेस्ट करता है वेब के लिए Chrome, Firefox, Edge टेस्ट करके, नेटवर्क और रेंडरिंग चेक्स के लिए ब्राउजर डेवटूल्स इस्तेमाल करके, और AgriBot के लिए रीयल लो-एंड एंड्रॉइड डिवाइसेज पर टेस्ट करके। SSR पेजेस के लिए सर्च कंसोल क्रॉलिंग वैलिडेट करता है।

### स्किल्स
- **फ्रंटएंड**: React, Next.js, TypeScript, Tailwind CSS में कुशल; लेजी लोडिंग और कोड स्प्लिटिंग के साथ रिस्पॉन्सिव, एक्सेसिबल UI बनाते हैं।
- **बैकएंड**: Node.js, Express, MongoDB, सर्वरलेस (AWS Lambda, API Gateway, DynamoDB) में विशेषज्ञता; स्केलेबल REST और GraphQL API डिजाइन करते हैं।
- **क्लाउड**: AWS प्रमाणित, सर्वरलेस (Lambda, Step Functions, SQS), CloudFormation, CDK, और GitHub Actions के साथ CI/CD में विशेषज्ञ।
- **SEO**: JSON-LD स्कीमास, SSR, स्ट्रक्चर्ड डेटा, मोबाइल-फर्स्ट ऑप्टिमाइजेशन में उन्नत स्किल्स; लोड टाइम्स को 40% बेहतर बनाया और सर्च रैंकिंग्स सुधारी।
- **अन्य**: WebRTC, Socket.io, Google Calendar API, Jest, GitHub, और एक्सेसिबिलिटी (सिमेंटिक HTML, alt टैग्स) में अनुभवी।

### उपलब्धियां
- कई डोमेन में 12+ एप्लिकेशन डिलीवर किए।
- EduXcel पर 500K+ इंप्रेशन्स और 20K+ क्लिक्स प्राप्त किए।
- Zedemy की लागतों को 40% कम किया और बीमा कार्यालय के लोड टाइम्स को 70%।
- अमेज़न और माइक्रोसॉफ्ट के हायरिंग मैनेजरों द्वारा प्लेटफॉर्म और कंटेंट के लिए मान्यता प्राप्त।
- अरावली सादन के कैप्टन के रूप में हॉस्टल और स्पोर्ट्स का नेतृत्व किया।
- LIC Neemuch को प्रोडक्शन, SEO-ट्रस्टेड साइट में बदलकर 100/100 लाइटहाउस हिट किया और 50-60 लीड्स/मंथ पैदा किए।
- एक ब्लॉग प्रोजेक्ट पर दो महीनों में 1.8M इंप्रेशन्स प्राप्त किए, इंडस्ट्री रिक्रूटर्स का ध्यान खींचा जिसमें Ex-Microsoft हायरिंग मैनेजर शामिल।
- लिंक्डइन पोस्ट में डीप-लिंक 404s पर रीलाइट फिक्स सजेस्ट किया Apple SWE द्वारा ऐक्नॉलेजमेंट प्राप्त किया।

### चुनौतियां पार कीं
- प्रोजेक्ट प्रभाव साबित करके अकादमिक डिटेंशन से पार पाया।
- डेटा-ड्रिवन A/B टेस्टिंग से EventEase डिजाइन विवादों को हल किया।
- CI/CD और माइलस्टोन्स से बीमा कार्यालय की 3-वीक डेडलाइन पूरी की।
- दबाव में Google Calendar API और WebRTC सेल्फ-टॉट।
- रात के खाना पकाने जैसे हॉस्टल शरारतों को नेतृत्व के साथ संतुलित किया।
- शुरुआती प्रोटोटाइप्स को ओवर-इंजीनियर किया जैसे Zedemy में इन-ब्राउजर एडिटर को पॉलिश करने में ज्यादा समय, MVP-फर्स्ट डिलीवरी पर फोकस करना सीखा।
- प्रोटोटाइप्स में परफेक्शन और स्पीड बैलेंस किया, Zedemy में एडिटर UI को कोर फ्लोज वैलिडेट करने से पहले ओवरबिल्ट किया, अब क्लियर KPI के साथ MVP प्राथमिकता देता है।

### संपर्क
- ईमेल: sanjay.awsindia@gmail.com
- LinkedIn: linkedin.com/in/sanjay-patidar
`;
  const recognition = window.SpeechRecognition || window.webkitSpeechRecognition ? new (window.SpeechRecognition || window.webkitSpeechRecognition)() : null;

  function getContext() {
    return currentLang === 'hi' ? hindiContext : context;
  }

  function showTonePicker(message, messageId) {
    const tonePromptText = currentLang === 'hi' ? 'आप कौन सा लहजा सुनना चाहेंगे?' : 'Which tone would you like to hear?';
    const tonePromptId = Date.now();
    pendingMessage = message;
    pendingMessageId = messageId;
    window.messages.push({
      sender: 'ai',
      text: tonePromptText,
      id: tonePromptId,
      timestamp: new Date().toISOString(),
      category: 'tone_prompt',
      reactions: [],
      isPinned: false
    });
    renderMessages();
    if (typeof window.speakMessage === 'function') {
      window.speakMessage(tonePromptId, tonePromptText, currentLang);
    }
  }

  async function processMessageWithTone(message, messageId, tone) {
    isLoading = true;
    interactionAnalytics.questionsAsked++;
    const { category, imageKey } = categorizeMessage(message);
    interactionAnalytics.categories[category] = (interactionAnalytics.categories[category] || 0) + 1;

    let aiResponse;
    let projectDetails = null;
    let quickReplies = [];
    const toneInstruction = tone === 'funny'
      ? 'Respond in a funny, engaging, and heartfelt tone suitable for an Indian audience. Use culturally relevant, non-technical humor (e.g., references to school life, hostel pranks, or food like pohe-jalebi). Avoid tech jargon (e.g., serverless, API) and movie references (e.g., Bollywood, SRK). Keep it family-friendly and relatable.'
      : 'Respond in a professional, concise, and technical tone suitable for a tech audience. Include brief personal context (e.g., school discipline) where relevant, but focus on career achievements and skills.';
    const fullPrompt = `You are an AI assistant for Sanjay Patidar's portfolio. ${toneInstruction} Use the following context to answer questions about Sanjay's work, skills, or personal life. For general questions outside this context, provide accurate and relevant answers based on general knowledge. Context: ${getContext()}\n\nUser question: ${message}\n\nProvide a clear, well-educated response in ${currentLang === 'hi' ? 'Hindi' : 'English'}.`;

    async function tryApiRequest(apiKey) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: fullPrompt }] }] })
        });
        if (!response.ok) throw new Error(`API request failed with status ${response.status}`);
        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
      } catch (error) {
        console.error('API error with key:', apiKey, error.message);
        return null;
      }
    }

    try {
      aiResponse = await tryApiRequest(primaryApiKey);
      if (!aiResponse) {
        console.warn('Primary API failed, trying fallback API key');
        aiResponse = await tryApiRequest(fallbackApiKey);
      }
      if (!aiResponse || aiResponse.includes('I don\'t have enough information')) {
        const searchResults = await performWebSearch(message);
        aiResponse = searchResults || (currentLang === 'hi' ? 'क्षमा करें, मुझे विशिष्ट जानकारी नहीं मिली। संजय के प्रोजेक्ट्स, स्किल्स, या स्कूल की कहानियों के बारे में पूछें!' : 'Sorry, I couldn\'t find specific information. Try asking about Sanjay’s projects, skills, or school stories!');
      }
      quickReplies = currentLang === 'hi'
        ? ['इस पर और विस्तार से बताएं?', 'संजय के स्कूल के दिन कैसे थे?', 'संजय की एक मज़ेदार कहानी बताएं!']
        : ['Can you elaborate on this?', 'What were Sanjay’s school days like?', 'Tell me a funny story about Sanjay!'];
    } catch (error) {
      console.error('Both API requests failed:', error.message);
      const searchResults = await performWebSearch(message);
      aiResponse = searchResults || (currentLang === 'hi' ? 'कुछ गड़बड़ हो गई। कृपया फिर से प्रयास करें या संजय के प्रोजेक्ट्स, स्किल्स, या स्कूल की कहानियों के बारे में पूछें!' : 'Something went wrong. Please try again or ask about Sanjay’s projects, skills, or school stories!');
      quickReplies = currentLang === 'hi'
        ? ['दूसरा प्रश्न पूछें', 'संजय के प्रोजेक्ट्स के बारे में पूछें', 'संजय की स्कूल की कहानी बताएं']
        : ['Try another question', 'Ask about Sanjay’s projects', 'Tell me a school story about Sanjay'];
    }

    const responseId = Date.now();
    // Select a random image from the category if imageKey exists
    const imageData = imageKey && imageContext[imageKey] && tone === 'funny'
      ? imageContext[imageKey].urls[Math.floor(Math.random() * imageContext[imageKey].urls.length)]
      : null;
    window.messages.push({
      sender: 'ai',
      text: '',
      id: responseId,
      timestamp: new Date().toISOString(),
      category: projectDetails ? 'project' : category,
      reactions: [],
      isPinned: false,
      imageUrl: imageData?.url,
      imageAlt: imageData?.alt
    });
    await typeMessage(aiResponse, responseId, projectDetails, quickReplies);

    if (isAutoReplyEnabled) {
      setTimeout(function() {
        const followUpId = Date.now() + 1;
        window.messages.push({
          sender: 'ai',
          text: '',
          id: followUpId,
          timestamp: new Date().toISOString(),
          category: 'follow-up',
          reactions: [],
          isPinned: false
        });
        typeMessage(
          currentLang === 'hi' ? 'संजय के काम, स्किल्स, या स्कूल की कहानियों के बारे में और कोई प्रश्न हैं?' : 'Do you have any more questions about Sanjay’s work, skills, or school stories?',
          followUpId,
          null,
          currentLang === 'hi'
            ? ['संजय के प्रोजेक्ट्स क्या हैं?', 'संजय की स्किल्स क्या हैं?', 'संजय की स्कूल की मज़ेदार कहानी बताएं']
            : ['What are Sanjay’s projects?', 'What skills does Sanjay have?', 'Tell me a funny school story about Sanjay']
        );
      }, 2000);
    }

    isLoading = false;
    renderMessages();
  }

  function renderMessages() {
    const chatMessages = document.getElementById('chat-messages');
    if (!chatMessages) {
      console.error('Error: #chat-messages element not found');
      return;
    }
    chatMessages.innerHTML = '';
    const filteredMessages = searchQuery
      ? window.messages.filter(m => m.text.toLowerCase().includes(searchQuery.toLowerCase()))
      : selectedCategory
      ? window.messages.filter(m => m.category === selectedCategory)
      : window.messages;

    if (filteredMessages.length === 0) {
      console.warn('No messages to render');
      chatMessages.innerHTML = '<div class="no-messages">No messages found</div>';
    }

    filteredMessages.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!b.isPinned && b.isPinned) return 1;
      return new Date(a.timestamp) - new Date(b.timestamp);
    });

    filteredMessages.forEach(function(message) {
      if (!message.reactions) message.reactions = [];
      const messageDiv = document.createElement('div');
      messageDiv.className = `message-container flex mb-2 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`;
      messageDiv.dataset.messageId = message.id;
      const bubbleDiv = document.createElement('div');
      bubbleDiv.className = `relative max-w-[80%] p-3 rounded-lg ${message.sender === 'user' ? 'user-message' : 'ai-message'} ${message.isPinned ? 'border-2 border-yellow-500' : ''}`;
      const messageContent = document.createElement('div');
      messageContent.className = 'message-content';
      messageContent.style.fontSize = `${fontSize}px`;
      let formattedText = formatMarkdown(message.text);
      if (message.category === 'project' && message.projectDetails) {
        formattedText = renderProjectCard(message.text, message.projectDetails);
      }
      if (editingMessageId === message.id) {
        messageContent.innerHTML =
          '<div class="edit-message flex items-center gap-2">' +
            '<input type="text" class="edit-message-input flex-1 p-2 border rounded-lg bg-[#F5F5F5] dark:bg-[#2A3942] text-black dark:text-[#E6E6FA]" value="' + editedText.replace(/"/g, '&quot;') + '">' +
            '<button class="edit-message-button bg-[#128C7E] text-white p-2 rounded-lg"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg></button>' +
            '<button class="cancel-btn bg-[#FF4D4F] text-white p-2 rounded-lg"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>' +
          '</div>';
      } else {
        messageContent.innerHTML = formattedText;
        if (message.imageUrl) {
          messageContent.innerHTML += `<img src="${message.imageUrl}" alt="${message.imageAlt || 'Image related to Sanjay Patidar'}" class="message-image" loading="lazy">`;
        }
        if (showTimestamps) {
          const timeSpan = document.createElement('span');
          timeSpan.className = 'message-timestamp';
          timeSpan.textContent = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          messageContent.appendChild(timeSpan);
        }
        if (message.reactions.length > 0) {
          messageContent.innerHTML += '<div class="message-reactions flex flex-wrap gap-1 mt-1">' + message.reactions.map(r => `<span class="reaction-tag bg-[#F5F5F5] dark:bg-[#2A3942] rounded-full px-2 py-1 text-sm">${r}</span>`).join('') + '</div>';
        }
        if (message.category === 'tone_prompt') {
          const toneButtons = document.createElement('div');
          toneButtons.className = 'tone-buttons flex gap-2 mt-2';
          toneButtons.innerHTML = `
            <button class="tone-btn funny-btn bg-[var(--chat-border-light)] dark:bg-[var(--chat-border-dark)] text-white dark:text-[var(--chat-text-dark)] p-2 rounded-lg text-sm">${currentLang === 'hi' ? 'मज़ेदार' : 'Funny'}</button>
            <button class="tone-btn professional-btn bg-[var(--chat-border-light)] dark:bg-[var(--chat-border-dark)] text-white dark:text-[var(--chat-text-dark)] p-2 rounded-lg text-sm">${currentLang === 'hi' ? 'पेशेवर' : 'Professional'}</button>
          `;
          messageContent.appendChild(toneButtons);
          toneButtons.querySelector('.funny-btn').addEventListener('click', () => {
            window.messages = window.messages.filter(m => m.id !== message.id);
            processMessageWithTone(pendingMessage, pendingMessageId, 'funny');
            renderMessages();
          });
          toneButtons.querySelector('.professional-btn').addEventListener('click', () => {
            window.messages = window.messages.filter(m => m.id !== message.id);
            processMessageWithTone(pendingMessage, pendingMessageId, 'professional');
            renderMessages();
          });
        }
      }
      if (message.sender === 'ai' && message.text && typeof window.speakMessage === 'function' && message.category !== 'tone_prompt') {
        const speakBtn = document.createElement('button');
        speakBtn.className = 'speak-btn';
        speakBtn.setAttribute('aria-label', 'Play or pause message');
        speakBtn.innerHTML = message.isSpeaking
          ? `<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6"></path></svg>`
          : `<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-6.504-3.753v7.506l6.504-3.753zM5 3v18l14-9L5 3z"></path></svg>`;
        speakBtn.addEventListener('click', () => window.speakMessage(message.id, message.text, currentLang));
        bubbleDiv.appendChild(speakBtn);
      }
      const messageActions = document.createElement('div');
      messageActions.className = 'message-actions flex justify-end gap-2 mt-2';
      if (message.sender === 'user') {
        const editBtn = document.createElement('button');
        editBtn.className = 'action-btn bg-[rgba(0,0,0,0.1)] dark:bg-[#2A3942] p-2 rounded-full';
        editBtn.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>';
        editBtn.addEventListener('click', function() { startEditing(message.id, message.text); });
        messageActions.appendChild(editBtn);
      }
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'action-btn bg-[rgba(0,0,0,0.1)] dark:bg-[#2A3942] p-2 rounded-full';
      deleteBtn.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4"></path></svg>';
      deleteBtn.addEventListener('click', function() { deleteMessage(message.id); });
      const copyBtn = document.createElement('button');
      copyBtn.className = 'action-btn bg-[rgba(0,0,0,0.1)] dark:bg-[#2A3942] p-2 rounded-full';
      copyBtn.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>';
      copyBtn.addEventListener('click', function() { copyMessage(message.text); });
      const pinBtn = document.createElement('button');
      pinBtn.className = 'action-btn bg-[rgba(0,0,0,0.1)] dark:bg-[#2A3942] p-2 rounded-full';
      pinBtn.innerHTML = message.isPinned ? '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v7m-7 7h7m-7-7h14"></path></svg>' : '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>';
      pinBtn.addEventListener('click', function() { togglePinMessage(message.id); });
      const reactionBtn = document.createElement('button');
      reactionBtn.className = 'action-btn bg-[rgba(0,0,0,0.1)] dark:bg-[#2A3942] p-2 rounded-full';
      reactionBtn.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';
      reactionBtn.addEventListener('click', function() { showReactionPicker(message.id, bubbleDiv); });
      messageActions.appendChild(deleteBtn);
      messageActions.appendChild(copyBtn);
      messageActions.appendChild(pinBtn);
      messageActions.appendChild(reactionBtn);
      bubbleDiv.appendChild(messageContent);
      bubbleDiv.appendChild(messageActions);
      messageDiv.appendChild(bubbleDiv);
      chatMessages.appendChild(messageDiv);
    });

    if (isLoading) {
      const loadingDiv = document.createElement('div');
      loadingDiv.className = 'flex justify-start mb-2';
      loadingDiv.innerHTML = '<div class="ai-message p-3 rounded-lg rounded-bl-none max-w-[80%] flex items-center"><div class="typing-indicator"><span></span><span></span><span></span></div></div>';
      chatMessages.appendChild(loadingDiv);
    }

    try {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    } catch (e) {
      console.error('Error scrolling chat messages:', e);
    }
    updateTimestamps();
    updateButtonStates();
    localStorage.setItem('portfolio-chat', JSON.stringify(window.messages));
    console.log('Messages rendered:', window.messages.length);
  }

  function formatMarkdown(text) {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 dark:bg-[#2A3942] p-1 rounded">$1</code>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" class="text-blue-500 underline">$1</a>')
      .replace(/^- (.*)$/gm, '<li>$1</li>')
      .replace(/(\n<li>.*<\/li>)+/g, '<ul class="list-disc pl-5">$&</ul>')
      .replace(/\n/g, '<br>');
  }

  function renderProjectCard(text, details = {}) {
    if (!details) return formatMarkdown(text);
    return `
      <div class="project-card-content p-3 bg-blue-50 dark:bg-[#2A3942] rounded-lg">
        <h4 class="text-base font-bold">${details.name || 'Project'}</h4>
        <p>${formatMarkdown(text)}</p>
        ${details.metrics ? `<p><strong>Metrics:</strong> ${details.metrics}</p>` : ''}
        ${details.tech ? `<p><strong>Tech:</strong> ${details.tech}</p>` : ''}
        ${details.link ? `<a href="${details.link}" target="_blank" rel="noopener" class="text-blue-500 underline">Learn More</a>` : ''}
      </div>
    `;
  }

  function updateTimestamps() {
    const timestamps = document.querySelectorAll('.message-timestamp');
    timestamps.forEach(function(timestamp) {
      const messageId = timestamp.closest('[data-message-id]').dataset.messageId;
      const message = window.messages.find(function(message) { return message.id === messageId; });
      if (message) timestamp.textContent = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    });
  }

  function updateButtonStates() {
    const clearBtn = document.querySelector('.clear-btn');
    if (clearBtn) clearBtn.disabled = window.messages.length === 1 && window.messages[0].id === 'welcome';
    const sendBtn = document.querySelector('.send-btn');
    if (sendBtn) sendBtn.disabled = isLoading;
    const voiceBtn = document.querySelector('.voice-btn');
    if (voiceBtn) voiceBtn.disabled = isLoading || !recognition;
    document.querySelectorAll('.suggestion-btn').forEach(function(btn) { btn.disabled = isLoading; });
  }

  async function typeMessage(text, messageId, projectDetails = null, quickReplies = []) {
    const message = window.messages.find(m => m.id === messageId);
    if (!message) {
      console.error('Message not found for ID:', messageId);
      return;
    }
    message.text = text;
    if (projectDetails) message.projectDetails = projectDetails;
    if (quickReplies.length > 0) message.quickReplies = quickReplies;
    if (isAutoSpeakEnabled && message.sender === 'ai' && typeof window.speakMessage === 'function' && message.category !== 'tone_prompt') {
      window.speakMessage(messageId, text, currentLang);
      interactionAnalytics.speechUsed++;
    }
    renderMessages();
  }

  async function sendMessage() {
    const input = document.getElementById('chat-input');
    if (!input) {
      console.error('Error: #chat-input element not found');
      return;
    }
    const message = input.value.trim();
    if (!message || isLoading) return;

    const messageId = Date.now();
    window.messages.push({ sender: 'user', text: message, id: messageId, timestamp: new Date().toISOString(), category: categorizeMessage(message).category, reactions: [], isPinned: false });
    input.value = '';
    renderMessages();
    showTonePicker(message, messageId);
  }

  async function performWebSearch(query) {
    const lowerQuery = query.toLowerCase();
    if (lowerQuery.includes('sanjay patidar')) {
      return currentLang === 'hi'
        ? `संजय पाटीदार एक फुल-स्टैक इंजीनियर हैं, जो अरावली सादन के कैप्टन और पोहे के दीवाने रहे। अधिक जानकारी के लिए उनका [LinkedIn](https://linkedin.com/in/sanjay-patidar) देखें।`
        : `Sanjay Patidar is a Full-Stack Engineer, once the captain of Aravali Sadan and a pohe enthusiast. Check his [LinkedIn](https://linkedin.com/in/sanjay-patidar) for more details.`;
    }
    return currentLang === 'hi'
      ? `"${query}" पर सामान्य जानकारी: अधिक संदर्भ प्रदान करें या संजय के प्रोजेक्ट्स, स्किल्स, या स्कूल की कहानियों के लिए पूछें।`
      : `General information on "${query}": Please provide more context or ask about Sanjay’s projects, skills, or school stories.`;
  }

  function categorizeMessage(message) {
    const lowerMessage = message.toLowerCase();
    for (const [imageKey, { keywords }] of Object.entries(imageContext)) {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        return { category: 'personal', imageKey };
      }
    }
    if (lowerMessage.includes('project') || lowerMessage.includes('lic neemuch') || lowerMessage.includes('zedemy') || lowerMessage.includes('connectnow') || lowerMessage.includes('eventease') || lowerMessage.includes('eduxcel') || lowerMessage.includes('प्रोजेक्ट') || lowerMessage.includes('lic नीमच') || lowerMessage.includes('जेडेमी') || lowerMessage.includes('कनेक्टनाउ') || lowerMessage.includes('इवेंटईज') || lowerMessage.includes('एडुक्सेल')) {
      return { category: 'project' };
    } else if (lowerMessage.includes('skill') || lowerMessage.includes('frontend') || lowerMessage.includes('backend') || lowerMessage.includes('cloud') || lowerMessage.includes('seo') || lowerMessage.includes('ci/cd') || lowerMessage.includes('security') || lowerMessage.includes('स्किल') || lowerMessage.includes('फ्रंटएंड') || lowerMessage.includes('बैकएंड') || lowerMessage.includes('क्लाउड') || lowerMessage.includes('एसईओ') || lowerMessage.includes('सीआई/सीडी') || lowerMessage.includes('सुरक्षा')) {
      return { category: 'skills' };
    } else if (lowerMessage.includes('achievement') || lowerMessage.includes('load time') || lowerMessage.includes('impression') || lowerMessage.includes('उपलब्धि') || lowerMessage.includes('लोड टाइम') || lowerMessage.includes('इंप्रेशन')) {
      return { category: 'achievements' };
    } else if (lowerMessage.includes('contact') || lowerMessage.includes('collaboration') || lowerMessage.includes('संपर्क') || lowerMessage.includes('सहयोग')) {
      return { category: 'contact' };
    } else if (lowerMessage.includes('challenge') || lowerMessage.includes('deadline') || lowerMessage.includes('setback') || lowerMessage.includes('conflict') || lowerMessage.includes('learn') || lowerMessage.includes('चुनौती') || lowerMessage.includes('डेडलाइन') || lowerMessage.includes('असफलता') || lowerMessage.includes('संघर्ष') || lowerMessage.includes('सीखना')) {
      return { category: 'challenges' };
    } else if (lowerMessage.includes('who is sanjay') || lowerMessage.includes('संजय कौन') || lowerMessage.includes('life') || lowerMessage.includes('story') || lowerMessage.includes('school') || lowerMessage.includes('navodaya') || lowerMessage.includes('hobby') || lowerMessage.includes('जीवन') || lowerMessage.includes('कहानी') || lowerMessage.includes('स्कूल') || lowerMessage.includes('नवोदय') || lowerMessage.includes('शौक')) {
      return { category: 'personal' };
    } else {
      return { category: 'general' };
    }
  }

  function filterByCategory(category) {
    selectedCategory = category;
    searchQuery = '';
    const searchBar = document.getElementById('search-bar');
    if (searchBar) searchBar.value = '';
    renderMessages();
    handleInputChange('');
  }

  function handlePromptClick(prompt) {
    const chatInput = document.getElementById('chat-input');
    if (chatInput) {
      chatInput.value = prompt;
      sendMessage();
    }
  }

  function handleQuickReply(prompt) {
    const chatInput = document.getElementById('chat-input');
    if (chatInput) {
      chatInput.value = prompt;
      sendMessage();
    }
  }

  function handleInputChange(value) {
    const suggestionsContainer = document.getElementById('chat-suggestions');
    if (suggestionsContainer) {
      filteredSuggestions = value.trim() ? suggestedPrompts[currentLang].filter(function(prompt) { return prompt.toLowerCase().includes(value.toLowerCase()); }) : suggestedPrompts[currentLang];
      suggestionsContainer.innerHTML = filteredSuggestions.map(function(prompt) {
        return '<button class="suggestion-btn">' + prompt + '</button>';
      }).join('');
      suggestionsContainer.querySelectorAll('.suggestion-btn').forEach((btn, index) => {
        btn.addEventListener('click', () => handlePromptClick(filteredSuggestions[index]));
      });
    }
    updateButtonStates();
  }

  function showReactionPicker(messageId, messageDiv) {
    const existingPicker = messageDiv.querySelector('.reaction-picker');
    if (existingPicker) {
      existingPicker.remove();
      return;
    }
    const picker = document.createElement('div');
    picker.className = 'reaction-picker absolute bg-white dark:bg-[#2A3942] border rounded-lg p-2 flex gap-2 z-10';
    emojiOptions.forEach(emoji => {
      const btn = document.createElement('button');
      btn.textContent = emoji;
      btn.className = 'reaction-picker-item text-lg';
      btn.addEventListener('click', function() { addReaction(messageId, emoji); picker.remove(); });
      picker.appendChild(btn);
    });
    messageDiv.appendChild(picker);
    const message = window.messages.find(m => m.id === messageId);
    picker.style.top = '100%';
    picker.style.left = message.sender === 'user' ? 'auto' : '0';
    picker.style.right = message.sender === 'user' ? '0' : 'auto';
  }

  function addReaction(messageId, emoji) {
    const message = window.messages.find(m => m.id === messageId);
    if (message) {
      message.reactions = message.reactions || [];
      if (!message.reactions.includes(emoji)) {
        message.reactions.push(emoji);
        interactionAnalytics.reactionsUsed++;
        renderMessages();
        localStorage.setItem('portfolio-chat', JSON.stringify(window.messages));
      }
    }
  }

  function togglePinMessage(messageId) {
    const message = window.messages.find(m => m.id === messageId);
    if (message) {
      message.isPinned = !message.isPinned;
      renderMessages();
      localStorage.setItem('portfolio-chat', JSON.stringify(window.messages));
    }
  }

  function startEditing(id, text) {
    editingMessageId = id;
    editedText = text;
    renderMessages();
    const editInput = document.querySelector('.edit-message-input');
    if (editInput) {
      editInput.focus();
      editInput.addEventListener('input', (e) => editedText = e.target.value);
      editInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') saveEditedMessage(id);
      });
    }
    const saveBtn = document.querySelector('.edit-message-button');
    if (saveBtn) saveBtn.addEventListener('click', () => saveEditedMessage(id));
    const cancelBtn = document.querySelector('.cancel-btn');
    if (cancelBtn) cancelBtn.addEventListener('click', cancelEdit);
  }

  async function saveEditedMessage(id) {
    if (editedText.trim()) {
      window.messages = window.messages.map(function(message) {
        return message.id === id ? { ...message, text: editedText, timestamp: new Date().toISOString(), category: categorizeMessage(editedText).category } : message;
      });
      editingMessageId = null;
      const editedMessageText = editedText;
      editedText = '';
      renderMessages();
      showTonePicker(editedMessageText, id);
    } else {
      editingMessageId = null;
      editedText = '';
      renderMessages();
    }
  }

  function cancelEdit() {
    editingMessageId = null;
    editedText = '';
    renderMessages();
  }

  function deleteMessage(id) {
    window.messages = window.messages.filter(function(message) { return message.id !== id; });
    if (window.messages.length === 0) {
      window.messages.push({
        sender: 'ai',
        text: currentLang === 'hi' ? 'हाय! मैं संजय पाटीदार का पोर्टफोलियो चैटबॉट हूँ। उनके प्रोजेक्ट्स, स्किल्स, या स्कूल की कहानियों के बारे में पूछें, जैसे "संजय पाटीदार कौन हैं?" या "संजय की स्कूल की मज़ेदार कहानी बताएं!"' : 'Hi! I\'m Sanjay Patidar\'s portfolio chatbot. Ask about his projects, skills, or school stories, like "Who is Sanjay Patidar?" or "Tell me a funny school story about Sanjay!"',
        id: 'welcome',
        timestamp: new Date().toISOString(),
        category: 'welcome',
        reactions: [],
        isPinned: false
      });
    }
    renderMessages();
    localStorage.setItem('portfolio-chat', JSON.stringify(window.messages));
  }

  function copyMessage(text) {
    navigator.clipboard.writeText(text).then(function() {
      alert(currentLang === 'hi' ? 'संदेश कॉपी किया गया!' : 'Message copied!');
    }).catch(function() {
      alert(currentLang === 'hi' ? 'कॉपी करने में असफल!' : 'Failed to copy!');
    });
  }

  function toggleTheme() {
    isDarkMode = !isDarkMode;
    document.getElementById('chatbot-container').classList.toggle('dark', isDarkMode);
    const themeBtn = document.querySelector('.theme-btn');
    if (themeBtn) {
      themeBtn.innerHTML = isDarkMode
        ? '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>'
        : '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>';
    }
    renderMessages();
  }

  function toggleControls() {
    const controls = document.getElementById('chat-controls');
    if (controls) {
      controls.classList.toggle('hidden');
      const toggleBtn = document.querySelector('.controls-toggle');
      if (toggleBtn) {
        toggleBtn.innerHTML = controls.classList.contains('hidden')
          ? '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>'
          : '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>';
      }
    }
  }

  function toggleSearchBar() {
    const searchBar = document.getElementById('search-bar');
    if (searchBar) {
      searchBar.classList.toggle('hidden');
      if (!searchBar.classList.contains('hidden')) {
        searchBar.focus();
      }
    }
  }

  function searchMessages(query) {
    searchQuery = query;
    selectedCategory = '';
    const categoryFilter = document.getElementById('category-filter');
    if (categoryFilter) categoryFilter.value = '';
    renderMessages();
  }

  function toggleHistory() {
    isHistoryCollapsed = !isHistoryCollapsed;
    const historyBtn = document.querySelector('.history-btn');
    if (historyBtn) {
      historyBtn.textContent = isHistoryCollapsed ? (currentLang === 'hi' ? 'इतिहास दिखाएं' : 'Show History') : (currentLang === 'hi' ? 'इतिहास छिपाएं' : 'Hide History');
    }
    const chatMessages = document.getElementById('chat-messages');
    if (chatMessages) {
      chatMessages.style.display = isHistoryCollapsed ? 'none' : 'block';
    }
    if (!isHistoryCollapsed) renderMessages();
  }

  function toggleAutoReply() {
    isAutoReplyEnabled = !isAutoReplyEnabled;
    const autoReplyBtn = document.querySelector('.auto-reply-btn');
    if (autoReplyBtn) {
      autoReplyBtn.textContent = isAutoReplyEnabled ? (currentLang === 'hi' ? 'ऑटो-रिप्लाई: चालू' : 'Auto-Reply: On') : (currentLang === 'hi' ? 'ऑटो-रिप्लाई: बंद' : 'Auto-Reply: Off');
    }
  }

  function toggleAutoSpeak() {
    isAutoSpeakEnabled = !isAutoSpeakEnabled;
    const autoSpeakBtn = document.querySelector('.auto-speak-btn');
    if (autoSpeakBtn) {
      autoSpeakBtn.textContent = isAutoSpeakEnabled ? (currentLang === 'hi' ? 'ऑटो-स्पीक: चालू' : 'Auto-Speak: On') : (currentLang === 'hi' ? 'ऑटो-स्पीक: बंद' : 'Auto-Speak: Off');
    }
  }

  function toggleTimestamps() {
    showTimestamps = !showTimestamps;
    const timestampBtn = document.querySelector('.timestamp-btn');
    if (timestampBtn) {
      timestampBtn.textContent = showTimestamps ? (currentLang === 'hi' ? 'टाइमस्टैम्प छिपाएं' : 'Hide Timestamps') : (currentLang === 'hi' ? 'टाइमस्टैम्प दिखाएं' : 'Show Timestamps');
    }
    renderMessages();
  }

  function adjustFontSize(change) {
    fontSize = Math.max(10, Math.min(18, fontSize + change));
    localStorage.setItem('chat-font-size', fontSize);
    const elements = document.querySelectorAll('.chatbot-container .message-content, .chatbot-container .chat-input, .chatbot-container .search-bar, .chatbot-container .suggestion-btn, .chatbot-container .message-actions');
    elements.forEach(function(element) {
      element.style.setProperty('font-size', `${fontSize}px`, 'important');
    });
    console.log(`Font size adjusted to ${fontSize}px, affected ${elements.length} elements`);
  }

  function confirmClearChat() {
    const confirmPopup = document.createElement('div');
    confirmPopup.className = 'confirm-popup';
    confirmPopup.innerHTML = `
      <p>${currentLang === 'hi' ? 'क्या आप वाकई चैट इतिहास मिटाना चाहते हैं?' : 'Are you sure you want to clear the chat history?'}</p>
      <button class="confirm-btn">${currentLang === 'hi' ? 'हाँ' : 'Yes'}</button>
      <button class="cancel-btn">${currentLang === 'hi' ? 'नहीं' : 'No'}</button>
    `;
    document.getElementById('chatbot-container').appendChild(confirmPopup);
    const confirmBtn = confirmPopup.querySelector('.confirm-btn');
    const cancelBtn = confirmPopup.querySelector('.cancel-btn');
    if (confirmBtn) confirmBtn.addEventListener('click', clearChat);
    if (cancelBtn) cancelBtn.addEventListener('click', () => confirmPopup.remove());
  }

  function clearChat() {
    window.messages = [{
      sender: 'ai',
      text: currentLang === 'hi' ? 'हाय! मैं संजय पाटीदार का पोर्टफोलियो चैटबॉट हूँ। उनके प्रोजेक्ट्स, स्किल्स, या स्कूल की कहानियों के बारे में पूछें, जैसे "संजय पाटीदार कौन हैं?" या "संजय की स्कूल की मज़ेदार कहानी बताएं!"' : 'Hi! I\'m Sanjay Patidar\'s portfolio chatbot. Ask about his projects, skills, or school stories, like "Who is Sanjay Patidar?" or "Tell me a funny school story about Sanjay!"',
      id: 'welcome',
      timestamp: new Date().toISOString(),
      category: 'welcome',
      reactions: [],
      isPinned: false
    }];
    localStorage.setItem('portfolio-chat', JSON.stringify(window.messages));
    renderMessages();
    document.querySelectorAll('.confirm-popup').forEach(p => p.remove());
  }

  function toggleRecording() {
    if (!recognition) {
      alert(currentLang === 'hi' ? 'क्षमा करें, आपके ब्राउज़र में वॉइस इनपुट समर्थित नहीं है।' : 'Sorry, voice input is not supported in your browser.');
      return;
    }
    if (isRecording) {
      recognition.stop();
    } else {
      recognition.lang = currentLang === 'hi' ? 'hi-IN' : 'en-US';
      recognition.start();
      isRecording = true;
      const voiceBtn = document.querySelector('.voice-btn');
      if (voiceBtn) voiceBtn.classList.add('recording');
    }
  }

  if (recognition) {
    recognition.onresult = function(event) {
      const transcript = event.results[0][0].transcript;
      const chatInput = document.getElementById('chat-input');
      if (chatInput) {
        chatInput.value = transcript;
        isRecording = false;
        const voiceBtn = document.querySelector('.voice-btn');
        if (voiceBtn) voiceBtn.classList.remove('recording');
        const messageId = Date.now();
        window.messages.push({ sender: 'user', text: transcript, id: messageId, timestamp: new Date().toISOString(), category: categorizeMessage(transcript).category, reactions: [], isPinned: false });
        renderMessages();
        showTonePicker(transcript, messageId);
      }
    };
    recognition.onend = function() {
      isRecording = false;
      const voiceBtn = document.querySelector('.voice-btn');
      if (voiceBtn) voiceBtn.classList.remove('recording');
    };
    recognition.onerror = function(event) {
      console.error('Speech recognition error:', event.error);
      isRecording = false;
      const voiceBtn = document.querySelector('.voice-btn');
      if (voiceBtn) voiceBtn.classList.remove('recording');
      alert(currentLang === 'hi' ? 'वॉइस रिकग्निशन में त्रुटि: ' + event.error : 'Voice recognition error: ' + event.error);
    };
  }

  document.addEventListener('DOMContentLoaded', function() {
    const chatMessages = document.getElementById('chat-messages');
    if (!chatMessages) {
      console.error('Critical: #chat-messages element not found on DOM load');
      return;
    }
    chatMessages.style.display = 'block';
    renderMessages();
    handleInputChange('');

    const controlsToggle = document.querySelector('.controls-toggle');
    if (controlsToggle) controlsToggle.addEventListener('click', toggleControls);

    const searchToggle = document.querySelector('.search-toggle');
    if (searchToggle) searchToggle.addEventListener('click', toggleSearchBar);

    const themeBtn = document.querySelector('.theme-btn');
    if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

    const langToggle = document.querySelector('.lang-toggle');
    if (langToggle) {
      langToggle.addEventListener('click', function() {
        currentLang = currentLang === 'en' ? 'hi' : 'en';
        localStorage.setItem('chat-lang', currentLang);
        document.getElementById('chatbot-container').setAttribute('lang', currentLang);
        langToggle.setAttribute('data-lang', currentLang === 'en' ? 'hi' : 'en');
        const chatInput = document.getElementById('chat-input');
        if (chatInput) {
          chatInput.placeholder = currentLang === 'hi' ? chatInput.dataset.placeholderHi : 'Ask about Sanjay\'s projects or skills...';
        }
        const searchBar = document.getElementById('search-bar');
        if (searchBar) {
          searchBar.placeholder = currentLang === 'hi' ? searchBar.dataset.placeholderHi : 'Search Messages';
        }
        // Explicitly update the welcome message text on lang toggle
        const welcomeMsg = window.messages.find(m => m.id === 'welcome');
        if (welcomeMsg) {
          welcomeMsg.text = currentLang === 'hi' 
            ? 'हाय! मैं संजय पाटीदार का पोर्टफोलियो चैटबॉट हूँ। उनके प्रोजेक्ट्स, स्किल्स, या जीवन की कहानियों के बारे में पूछें, जैसे "संजय पाटीदार कौन हैं?" या "संजय के स्कूल के दिनों की एक मज़ेदार कहानी बताएं!"'
            : 'Hi! I\'m Sanjay Patidar\'s portfolio chatbot. Ask about his projects, skills, or life stories, like "Who is Sanjay Patidar?" or "Tell me a funny story from Sanjay’s school days!"';
          localStorage.setItem('portfolio-chat', JSON.stringify(window.messages));
        }
        handleInputChange(document.getElementById('chat-input').value);
        filteredSuggestions = suggestedPrompts[currentLang];
        renderMessages();
        if (typeof window.stopAllSpeech === 'function') window.stopAllSpeech();
      });
    }

    const searchBar = document.getElementById('search-bar');
    if (searchBar) searchBar.addEventListener('input', (e) => searchMessages(e.target.value));

    const historyBtn = document.querySelector('.history-btn');
    if (historyBtn) historyBtn.addEventListener('click', toggleHistory);

    const autoReplyBtn = document.querySelector('.auto-reply-btn');
    if (autoReplyBtn) autoReplyBtn.addEventListener('click', toggleAutoReply);

    const autoSpeakBtn = document.querySelector('.auto-speak-btn');
    if (autoSpeakBtn) autoSpeakBtn.addEventListener('click', toggleAutoSpeak);

    const timestampBtn = document.querySelector('.timestamp-btn');
    if (timestampBtn) timestampBtn.addEventListener('click', toggleTimestamps);

    const volumeControl = document.getElementById('volume-control');
    if (volumeControl) volumeControl.addEventListener('input', function(e) {
      if (typeof window.setSpeechVolume === 'function') window.setSpeechVolume(e.target.value);
    });

    const rateControl = document.getElementById('rate-control');
    if (rateControl) rateControl.addEventListener('input', function(e) {
      if (typeof window.setSpeechRate === 'function') window.setSpeechRate(e.target.value);
    });

    document.querySelectorAll('.font-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const change = btn.textContent.includes('Increase') ? 2 : -2;
        adjustFontSize(change);
      });
    });

    const categoryFilter = document.getElementById('category-filter');
    if (categoryFilter) categoryFilter.addEventListener('change', (e) => filterByCategory(e.target.value));

    const clearBtn = document.querySelector('.clear-btn');
    if (clearBtn) clearBtn.addEventListener('click', confirmClearChat);

    const chatInput = document.getElementById('chat-input');
    if (chatInput) {
      chatInput.addEventListener('input', (e) => handleInputChange(e.target.value));
      chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
      });
    }

    const voiceBtn = document.querySelector('.voice-btn');
    if (voiceBtn) voiceBtn.addEventListener('click', toggleRecording);

    const sendBtn = document.querySelector('.send-btn');
    if (sendBtn) sendBtn.addEventListener('click', sendMessage);

    adjustFontSize(0);
  });
})();
