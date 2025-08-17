(function() {
  window.messages = JSON.parse(localStorage.getItem('portfolio-chat')) || [
    {
      sender: 'ai',
      text: 'Hi! I\'m Sanjay Patidar\'s portfolio chatbot. Ask about his projects, skills, or achievements, like "Who is Sanjay Patidar?"',
      id: 'welcome',
      timestamp: new Date().toLocaleTimeString(),
      category: 'welcome'
    }
  ];
  let isLoading = false;
  let isDarkMode = false;
  let isHistoryCollapsed = false;
  let fontSize = 14;
  let editingMessageId = null;
  let editedText = '';
  let isRecording = false;
  let isAutoReplyEnabled = true;
  let isAutoSpeakEnabled = true;
  let showTimestamps = true;
  let searchQuery = '';
  let interactionAnalytics = { questionsAsked: 0, speechUsed: 0, categories: {} };
  const suggestedPrompts = [
    'Who is Sanjay Patidar?',
    'What are Sanjay Patidar’s key projects?',
    'Tell me about LIC Neemuch.',
    'What is Zedemy LMS?',
    'How does ConnectNow work?',
    'What is EventEase?',
    'What frontend skills does Sanjay specialize in?',
    'What backend skills does Sanjay have?',
    'What are Sanjay’s cloud computing skills?',
    'How does Sanjay optimize SaaS apps for SEO?',
    'What are Sanjay’s key achievements?',
    'How has Sanjay impacted page load times?',
    'How can I contact Sanjay for collaboration?',
    'How did Sanjay handle a tight deadline?',
    'What challenges did Sanjay face in ConnectNow?',
    'How did Sanjay overcome academic setbacks?',
    'How does Sanjay approach learning new technologies?',
    'How does Sanjay handle team conflicts?',
    'What’s Sanjay’s experience with CI/CD?',
    'How does Sanjay ensure app security?'
  ];
  let filteredSuggestions = [];
  const apiKey = 'AIzaSyBTD9ltLvYEDK9MWgTR-71nXt1SsfRzGXI';
  const context = `
Sanjay Patidar is a Serverless Full-Stack SaaS Engineer recognized by Amazon and Microsoft managers for building production-grade platforms and tech content. He has delivered 12+ real-world applications across insurance, education, communication, and event management, with global reach in 127 countries.

### Projects
- **LIC Neemuch**: A modern portal built with SSR React, AWS Lambda, and CloudFront, achieving a 100/100 PageSpeed score, 70% faster load times, and 80% higher inquiry conversions.
- **Zedemy LMS**: A serverless learning management system with real-time analytics and SEO optimization, using AWS Lambda, API Gateway, and DynamoDB, reducing costs by 40%.
- **ConnectNow**: A video chat platform using WebRTC and Socket.io, with 35% fewer call drops via custom signaling and STUN/TURN servers.
- **EventEase**: An event management SaaS with Google Calendar integration and 25% faster load times through lazy-loading and WebP optimization.
- **EduXcel**: An ed-tech platform with optimized MongoDB and React Helmet, ranking above Shiksha.com with 500K+ global impressions.

### Skills
- **Frontend**: Proficient in React, Next.js, TypeScript, Tailwind CSS; builds responsive, accessible UIs with lazy loading and code splitting.
- **Backend**: Expertise in Node.js, Express, MongoDB, serverless (AWS Lambda, API Gateway, DynamoDB); designs scalable REST and GraphQL APIs.
- **Cloud**: AWS Certified, specializing in serverless (Lambda, Step Functions, SQS), CloudFormation, CDK, and CI/CD with GitHub Actions.
- **SEO**: Advanced skills in JSON-LD schemas, SSR, structured data, mobile-first optimization; improved load times by 40% and search rankings.
- **Other**: Experienced with WebRTC, Socket.io, Google Calendar API, Jest, GitHub, and accessibility (semantic HTML, alt tags).

### Achievements
- Delivered 12+ applications in multiple domains.
- Achieved 500K+ impressions and 20K+ clicks on EduXcel.
- Reduced Zedemy costs by 40% and LIC load times by 70%.
- Recognized by Amazon and Microsoft for platforms and content.

### Challenges Overcome
- Overcame academic detention by proving project impact.
- Resolved EventEase design disputes with data-driven A/B testing.
- Met LIC’s 3-week deadline with CI/CD and milestones.
- Self-taught Google Calendar API and WebRTC under pressure.

### Contact
- Email: sanjay.awsindia@gmail.com
- LinkedIn: linkedin.com/in/sanjay-patidar
`;

  const recognition = window.SpeechRecognition || window.webkitSpeechRecognition ? new (window.SpeechRecognition || window.webkitSpeechRecognition)() : null;

  function renderMessages() {
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.innerHTML = '';
    const filteredMessages = searchQuery ? window.messages.filter(m => m.text.toLowerCase().includes(searchQuery.toLowerCase())) : window.messages;
    filteredMessages.forEach(function(message) {
      const messageDiv = document.createElement('div');
      messageDiv.className = `chat-message ${message.sender === 'user' ? 'user-message' : 'ai-message'}${message.category === 'project' ? ' project-card' : ''}`;
      messageDiv.dataset.messageId = message.id;
      const messageContent = document.createElement('div');
      messageContent.className = 'message-content';
      let formattedText = formatMarkdown(message.text);
      if (message.category === 'project') {
        formattedText = renderProjectCard(message.text, message.projectDetails);
      }
      if (editingMessageId === message.id) {
        messageContent.innerHTML =
          '<div class="edit-message">' +
            '<input type="text" value="' + editedText.replace(/"/g, '&quot;') + '" oninput="window.editedText = this.value" onkeypress="if(event.key === \'Enter\') saveEditedMessage(\'' + message.id + '\')">' +
            '<button onclick="saveEditedMessage(\'' + message.id + '\')">Save</button>' +
            '<button onclick="cancelEdit()">Cancel</button>' +
          '</div>';
      } else {
        messageContent.innerHTML = formattedText;
        if (showTimestamps) {
          messageContent.innerHTML += '<span class="message-timestamp">' + message.timestamp + '</span>';
        }
      }
      if (message.sender === 'ai' && typeof window.speakMessage === 'function') {
        let speakBtn = messageDiv.querySelector('.speak-btn');
        if (!speakBtn) {
          speakBtn = document.createElement('button');
          speakBtn.className = 'speak-btn';
          speakBtn.textContent = message.isSpeaking ? '⏸ Pause' : '🔊 Play';
          speakBtn.addEventListener('click', function() { window.toggleSpeak(message.id, message.text); });
          messageDiv.appendChild(speakBtn);
        }
      }
      const messageActions = document.createElement('div');
      messageActions.className = 'message-actions';
      if (message.sender === 'user') {
        const editBtn = document.createElement('button');
        editBtn.className = 'edit-btn';
        editBtn.textContent = 'Edit';
        editBtn.addEventListener('click', function() { startEditing(message.id, message.text); });
        messageActions.appendChild(editBtn);
      }
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'delete-btn';
      deleteBtn.textContent = 'Delete';
      deleteBtn.addEventListener('click', function() { deleteMessage(message.id); });
      const copyBtn = document.createElement('button');
      copyBtn.className = 'copy-btn';
      copyBtn.textContent = 'Copy';
      copyBtn.addEventListener('click', function() { copyMessage(message.text); });
      messageActions.appendChild(deleteBtn);
      messageActions.appendChild(copyBtn);
      messageDiv.appendChild(messageContent);
      messageDiv.appendChild(messageActions);
      chatMessages.appendChild(messageDiv);
    });
    if (isLoading) {
      const loadingDiv = document.createElement('div');
      loadingDiv.className = 'chat-loading';
      loadingDiv.textContent = 'Chatbot is typing...';
      chatMessages.appendChild(loadingDiv);
    }
    updateTimestamps();
    scrollToBottom();
    updateButtonStates();
    localStorage.setItem('portfolio-chat', JSON.stringify(window.messages));
  }

  function formatMarkdown(text) {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
      .replace(/^- (.*)$/gm, '<li>$1</li>')
      .replace(/(\n<li>.*<\/li>)+/g, '<ul>$&</ul>')
      .replace(/\n/g, '<br>');
  }

  function renderProjectCard(text, details = {}) {
    if (!details) return formatMarkdown(text);
    return `
      <div class="project-card-content">
        <h4>${details.name || 'Project'}</h4>
        <p>${formatMarkdown(text)}</p>
        ${details.metrics ? `<p><strong>Metrics:</strong> ${details.metrics}</p>` : ''}
        ${details.tech ? `<p><strong>Tech:</strong> ${details.tech}</p>` : ''}
        ${details.link ? `<a href="${details.link}" target="_blank" rel="noopener">Learn More</a>` : ''}
      </div>
    `;
  }

  function scrollToBottom() {
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function updateTimestamps() {
    const timestamps = document.querySelectorAll('.message-timestamp');
    timestamps.forEach(function(timestamp) {
      const messageId = timestamp.parentElement.parentElement.dataset.messageId;
      const message = window.messages.find(function(message) { return message.id === messageId; });
      if (message) timestamp.textContent = message.timestamp;
    });
  }

  function updateButtonStates() {
    document.querySelector('.clear-btn').disabled = window.messages.length === 1 && window.messages[0].id === 'welcome';
    document.querySelector('.export-btn').disabled = window.messages.length === 1 && window.messages[0].id === 'welcome';
    document.querySelector('.chat-input-area button:not(.voice-btn)').disabled = isLoading;
    document.querySelectorAll('.suggestion-btn').forEach(function(btn) { btn.disabled = isLoading; });
    const voiceBtn = document.querySelector('.voice-btn');
    if (voiceBtn) voiceBtn.disabled = isLoading || !recognition;
  }

  async function typeMessage(text, messageId, projectDetails = null) {
    const message = window.messages.find(m => m.id === messageId);
    if (!message) return;
    message.text = '';
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    if (isAutoSpeakEnabled && typeof window.speakMessage === 'function') {
      window.speakMessage(messageId, text);
    }
    for (const sentence of sentences) {
      for (let i = 0; i < sentence.length; i++) {
        message.text += sentence[i];
        renderMessages();
        await new Promise(resolve => setTimeout(resolve, 30));
      }
    }
    if (projectDetails) message.projectDetails = projectDetails;
    renderMessages();
  }

  async function sendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    if (!message || isLoading) return;

    isLoading = true;
    interactionAnalytics.questionsAsked++;
    const category = categorizeMessage(message);
    window.messages.push({ sender: 'user', text: message, id: Date.now(), timestamp: new Date().toLocaleTimeString(), category });
    input.value = '';
    renderMessages();

    let aiResponse;
    let projectDetails = null;
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('who is sanjay patidar')) {
      aiResponse = 'Sanjay Patidar is a Serverless Full-Stack SaaS Engineer recognized by Amazon and Microsoft managers for building production-grade platforms. He’s delivered 12+ real-world applications across insurance, education, communication, and event management, with a focus on performance, SEO, and scalability, achieving impact in 127 countries.';
      interactionAnalytics.categories['about'] = (interactionAnalytics.categories['about'] || 0) + 1;
    } else if (lowerMessage.includes('sanjay patidar’s key projects')) {
      aiResponse = 'Sanjay’s key projects include LIC Neemuch (a lead-gen portal with 80% conversion increase), Zedemy LMS (scalable e-learning platform), ConnectNow (low-latency video chat), EventEase (event management SaaS), and EduXcel (ed-tech platform with 500K+ global impressions).';
      interactionAnalytics.categories['projects'] = (interactionAnalytics.categories['projects'] || 0) + 1;
    } else if (lowerMessage.includes('lic neemuch')) {
      aiResponse = 'LIC Neemuch is a modern portal Sanjay built from an outdated form, using SSR React, AWS Lambda, and CloudFront. It achieved a 100/100 PageSpeed score, reduced load times by 70%, and tripled inquiries, becoming the client’s primary lead generation tool.';
      projectDetails = { name: 'LIC Neemuch', metrics: '100/100 PageSpeed, 70% faster load times, 80% higher conversions', tech: 'SSR React, AWS Lambda, CloudFront', link: 'https://licneemuch.example.com' };
      interactionAnalytics.categories['project'] = (interactionAnalytics.categories['project'] || 0) + 1;
    } else if (lowerMessage.includes('zedemy lms')) {
      aiResponse = 'Zedemy LMS is a serverless learning management system Sanjay developed with AWS Lambda, API Gateway, and DynamoDB. It features real-time analytics, SEO optimization, and scaled across 127 countries, reducing infrastructure costs by 40%.';
      projectDetails = { name: 'Zedemy LMS', metrics: '40% cost reduction, 127 countries reached', tech: 'AWS Lambda, API Gateway, DynamoDB', link: 'https://zedemy.example.com' };
      interactionAnalytics.categories['project'] = (interactionAnalytics.categories['project'] || 0) + 1;
    } else if (lowerMessage.includes('how does connectnow work')) {
      aiResponse = 'ConnectNow is a video chat platform Sanjay built using WebRTC and Socket.io, optimized for low latency. He reduced call drop rates by 35% with custom signaling, STUN/TURN servers, and ICE candidate caching for reliable connections.';
      projectDetails = { name: 'ConnectNow', metrics: '35% fewer call drops', tech: 'WebRTC, Socket.io, STUN/TURN' };
      interactionAnalytics.categories['project'] = (interactionAnalytics.categories['project'] || 0) + 1;
    } else if (lowerMessage.includes('what is eventease')) {
      aiResponse = 'EventEase is an event management SaaS app Sanjay developed with dynamic content delivery and Google Calendar integration. It uses lazy-loading and WebP for 25% faster load times, prioritizing user experience and performance.';
      projectDetails = { name: 'EventEase', metrics: '25% faster load times', tech: 'React, Google Calendar API, WebP' };
      interactionAnalytics.categories['project'] = (interactionAnalytics.categories['project'] || 0) + 1;
    } else if (lowerMessage.includes('frontend skills')) {
      aiResponse = 'Sanjay is proficient in React, Next.js, TypeScript, and Tailwind CSS, building responsive, accessible UIs with performance optimizations like lazy loading and code splitting. Example: `const LazyComponent = React.lazy(() => import("./Component"));`';
      interactionAnalytics.categories['skills'] = (interactionAnalytics.categories['skills'] || 0) + 1;
    } else if (lowerMessage.includes('backend skills')) {
      aiResponse = 'Sanjay excels in Node.js, Express, MongoDB, and serverless architectures (AWS Lambda, API Gateway, DynamoDB), designing scalable REST and GraphQL APIs. Example: `app.get("/api", (req, res) => res.json({ data: "Hello" }));`';
      interactionAnalytics.categories['skills'] = (interactionAnalytics.categories['skills'] || 0) + 1;
    } else if (lowerMessage.includes('cloud computing skills')) {
      aiResponse = 'Sanjay is AWS Certified, specializing in serverless technologies (Lambda, Step Functions, SQS), infrastructure as code (CloudFormation, CDK), and CI/CD with GitHub Actions.';
      interactionAnalytics.categories['skills'] = (interactionAnalytics.categories['skills'] || 0) + 1;
    } else if (lowerMessage.includes('optimize saas apps for seo')) {
      aiResponse = 'Sanjay uses JSON-LD schemas, SSR with React Helmet, structured data, and mobile-first optimization, achieving 40% faster page loads and top rankings, as seen in EduXcel’s 500K+ impressions. Example: `<script type="application/ld+json">{ "@context": "https://schema.org" }</script>`';
      interactionAnalytics.categories['seo'] = (interactionAnalytics.categories['seo'] || 0) + 1;
    } else if (lowerMessage.includes('sanjay’s key achievements')) {
      aiResponse = 'Sanjay delivered 12+ applications, improved load times by up to 70%, achieved 500K+ impressions on EduXcel, reduced Zedemy costs by 40%, and earned recognition from Amazon and Microsoft.';
      interactionAnalytics.categories['achievements'] = (interactionAnalytics.categories['achievements'] || 0) + 1;
    } else if (lowerMessage.includes('impacted page load times')) {
      aiResponse = 'Sanjay reduced LIC Neemuch load times by 70% using SSR, AWS Lambda, and CloudFront caching, achieving a 100/100 PageSpeed score. He also improved EventEase load times by 25% with lazy-loading.';
      interactionAnalytics.categories['achievements'] = (interactionAnalytics.categories['achievements'] || 0) + 1;
    } else if (lowerMessage.includes('contact sanjay for collaboration')) {
      aiResponse = 'You can reach Sanjay at [sanjay.awsindia@gmail.com](mailto:sanjay.awsindia@gmail.com) or via [LinkedIn](https://linkedin.com/in/sanjay-patidar) for collaboration opportunities.';
      interactionAnalytics.categories['contact'] = (interactionAnalytics.categories['contact'] || 0) + 1;
    } else if (lowerMessage.includes('tight deadline')) {
      aiResponse = 'For LIC Neemuch, Sanjay met a 3-week deadline by using CI/CD with GitHub Actions, breaking the project into milestones, and maintaining daily client feedback, delivering a functional MVP on time.';
      interactionAnalytics.categories['challenges'] = (interactionAnalytics.categories['challenges'] || 0) + 1;
    } else if (lowerMessage.includes('challenges in connectnow')) {
      aiResponse = 'Sanjay tackled unreliable network connections in ConnectNow, reducing call drops by 35% with custom WebRTC signaling, STUN/TURN servers, and ICE candidate caching.';
      interactionAnalytics.categories['challenges'] = (interactionAnalytics.categories['challenges'] || 0) + 1;
    } else if (lowerMessage.includes('academic setbacks')) {
      aiResponse = 'Sanjay was detained in 8 subjects due to client work but presented project evidence (code, metrics, testimonials) to the Vice Chancellor, securing exam permissions and passing all subjects.';
      interactionAnalytics.categories['challenges'] = (interactionAnalytics.categories['challenges'] || 0) + 1;
    } else if (lowerMessage.includes('learning new technologies')) {
      aiResponse = 'Sanjay self-learns by building POCs, like mastering Google Calendar API for EventEase in a weekend and prototyping WebRTC signaling for ConnectNow, treating unknowns as research sprints.';
      interactionAnalytics.categories['learning'] = (interactionAnalytics.categories['learning'] || 0) + 1;
    } else if (lowerMessage.includes('handle team conflicts')) {
      aiResponse = 'In EventEase, Sanjay resolved a design vs. performance dispute by A/B testing lazy-loaded images against full images, proving 25% faster loads and convincing the team with data.';
      interactionAnalytics.categories['challenges'] = (interactionAnalytics.categories['challenges'] || 0) + 1;
    } else if (lowerMessage.includes('experience with ci/cd')) {
      aiResponse = 'Sanjay used GitHub Actions for Zedemy and EventEase, automating builds, tests, and deployments to Vercel/S3, adding Slack notifications for build status to ensure reliable production.';
      interactionAnalytics.categories['skills'] = (interactionAnalytics.categories['skills'] || 0) + 1;
    } else if (lowerMessage.includes('ensure app security')) {
      aiResponse = 'Sanjay secures apps with HTTPS, JWT with expiry, input sanitization, and rate limiting. In Zedemy, he used role-based scopes for Lambda endpoints to protect user data.';
      interactionAnalytics.categories['skills'] = (interactionAnalytics.categories['skills'] || 0) + 1;
    } else {
      try {
        const fullPrompt = `You are an AI assistant for Sanjay Patidar's portfolio. Use the following context to answer questions about Sanjay's work, skills, or projects. For general questions outside this context, provide accurate, professional, and concise answers based on general knowledge or web information, ensuring relevance to the user's query. Context: ${context}\n\nUser question: ${message}\n\nProvide a clear, well-educated response.`;
        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + apiKey, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: fullPrompt }] }] })
        });
        if (!response.ok) throw new Error('API request failed');
        const data = await response.json();
        aiResponse = data.candidates[0].content.parts[0].text;
        if (!aiResponse || aiResponse.includes('I don\'t have enough information')) {
          const searchResults = await performWebSearch(message);
          aiResponse = searchResults || 'Sorry, I couldn\'t find specific information. Try asking about Sanjay’s projects, skills, or general tech topics!';
        }
      } catch (error) {
        console.warn('API error: ' + error.message);
        const searchResults = await performWebSearch(message);
        aiResponse = searchResults || 'Something went wrong. Please try again or ask about Sanjay’s projects or skills!';
      }
      interactionAnalytics.categories['general'] = (interactionAnalytics.categories['general'] || 0) + 1;
    }

    const messageId = Date.now();
    window.messages.push({ sender: 'ai', text: '', id: messageId, timestamp: new Date().toLocaleTimeString(), category: projectDetails ? 'project' : category });
    await typeMessage(aiResponse, messageId, projectDetails);

    if (isAutoReplyEnabled) {
      setTimeout(function() {
        const followUpId = Date.now() + 1;
        window.messages.push({
          sender: 'ai',
          text: '',
          id: followUpId,
          timestamp: new Date().toLocaleTimeString(),
          category: 'follow-up'
        });
        typeMessage('Do you have any more questions about Sanjay’s work or projects?', followUpId);
      }, 2000);
    }

    isLoading = false;
    renderMessages();
  }

  async function performWebSearch(query) {
    // Enhanced to handle general searches while prioritizing custom responses
    const lowerQuery = query.toLowerCase();
    if (lowerQuery.includes('sanjay patidar')) {
      return `Sanjay Patidar is a Full-Stack Engineer with expertise in serverless architectures, recognized by industry leaders. Check his [LinkedIn](https://linkedin.com/in/sanjay-patidar) for more details.`;
    }
    // Perform real-time web search for general queries
    try {
      // Simulated web search (replace with actual search logic if needed)
      return `General information on "${query}": Please provide more context or try a Sanjay-specific question for detailed insights.`;
    } catch (error) {
      return null;
    }
  }

  function categorizeMessage(message) {
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('project') || lowerMessage.includes('lic neemuch') || lowerMessage.includes('zedemy') || lowerMessage.includes('connectnow') || lowerMessage.includes('eventease') || lowerMessage.includes('eduxcel')) {
      return 'project';
    } else if (lowerMessage.includes('skill') || lowerMessage.includes('frontend') || lowerMessage.includes('backend') || lowerMessage.includes('cloud') || lowerMessage.includes('seo') || lowerMessage.includes('ci/cd') || lowerMessage.includes('security')) {
      return 'skills';
    } else if (lowerMessage.includes('achievement') || lowerMessage.includes('load time') || lowerMessage.includes('impression')) {
      return 'achievements';
    } else if (lowerMessage.includes('contact') || lowerMessage.includes('collaboration')) {
      return 'contact';
    } else if (lowerMessage.includes('challenge') || lowerMessage.includes('deadline') || lowerMessage.includes('setback') || lowerMessage.includes('conflict') || lowerMessage.includes('learn')) {
      return 'challenges';
    } else if (lowerMessage.includes('who is sanjay')) {
      return 'about';
    } else {
      return 'general';
    }
  }

  function handlePromptClick(prompt) {
    document.getElementById('chat-input').value = prompt;
    sendMessage();
  }

  function handleInputChange(value) {
    const suggestionsContainer = document.getElementById('chat-suggestions');
    filteredSuggestions = value.trim() ? suggestedPrompts.filter(function(prompt) { return prompt.toLowerCase().includes(value.toLowerCase()); }) : suggestedPrompts;
    suggestionsContainer.innerHTML = filteredSuggestions.map(function(prompt) {
      return '<button class="suggestion-btn" onclick="handlePromptClick(\'' + prompt.replace(/'/g, '\\\'').replace(/"/g, '&quot;') + '\')">' + prompt + '</button>';
    }).join('');
    updateButtonStates();
  }

  function startEditing(id, text) {
    editingMessageId = id;
    window.editedText = text;
    renderMessages();
  }

  function saveEditedMessage(id) {
    if (window.editedText.trim()) {
      window.messages = window.messages.map(function(message) { return message.id === id ? { ...message, text: window.editedText, timestamp: new Date().toLocaleTimeString(), category: categorizeMessage(window.editedText) } : message; });
      editingMessageId = null;
      window.editedText = '';
      renderMessages();
    } else {
      editingMessageId = null;
      window.editedText = '';
      renderMessages();
    }
  }

  function cancelEdit() {
    editingMessageId = null;
    window.editedText = '';
    renderMessages();
  }

  function deleteMessage(id) {
    window.messages = window.messages.filter(function(message) { return message.id !== id; });
    renderMessages();
  }

  function copyMessage(text) {
    navigator.clipboard.writeText(text);
    window.messages.push({ sender: 'ai', text: 'Message copied to clipboard!', id: Date.now(), timestamp: new Date().toLocaleTimeString(), category: 'general' });
    renderMessages();
  }

  function confirmClearChat() {
    const popup = document.createElement('div');
    popup.className = 'confirm-popup';
    popup.innerHTML = '<p>Are you sure you want to clear the chat?</p>' +
      '<button onclick="clearChat(); this.parentElement.remove();">Confirm</button>' +
      '<button onclick="this.parentElement.remove();">Cancel</button>';
    document.body.appendChild(popup);
  }

  function clearChat() {
    window.messages = [{
      sender: 'ai',
      text: 'Hi! I\'m Sanjay Patidar\'s portfolio chatbot. Ask about his projects, skills, or achievements, like "Who is Sanjay Patidar?" or Zedemy LMS.',
      id: 'welcome',
      timestamp: new Date().toLocaleTimeString(),
      category: 'welcome'
    }];
    localStorage.removeItem('portfolio-chat');
    interactionAnalytics = { questionsAsked: 0, speechUsed: 0, categories: {} };
    renderMessages();
  }

  function exportChat() {
    const chatDate = new Date().toLocaleDateString();
    const language = document.querySelector('.lang-btn.active')?.dataset.lang || 'en';
    const settings = `Volume: ${window.getSpeechVolume ? window.getSpeechVolume() : 1}, Rate: ${window.getSpeechRate ? window.getSpeechRate() : 1}`;
    const chatText = `# Sanjay Patidar's Portfolio Chat\n\n**Date:** ${chatDate}\n**Language:** ${language === 'en' ? 'English' : 'Hindi'}\n**Settings:** ${settings}\n\n## Messages\n\n${window.messages.map(function(message) {
      return `### ${message.sender === 'user' ? 'You' : 'Chatbot'} (${message.timestamp}, ${message.category})\n${message.text}\n${message.projectDetails ? `\n**Project Details:**\n- Name: ${message.projectDetails.name}\n- Metrics: ${message.projectDetails.metrics}\n- Tech: ${message.projectDetails.tech}\n${message.projectDetails.link ? `- Link: [${message.projectDetails.link}](${message.projectDetails.link})` : ''}\n` : ''}`;
    }).join('\n\n')}\n\n## Analytics\n- Questions Asked: ${interactionAnalytics.questionsAsked}\n- Speech Used: ${interactionAnalytics.speechUsed}\n- Categories: ${Object.entries(interactionAnalytics.categories).map(([cat, count]) => `${cat}: ${count}`).join(', ')}`;
    const blob = new Blob([chatText], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio-chat-${chatDate}.md`;
    a.click();
    URL.revokeObjectURL(url);
    window.messages.push({ sender: 'ai', text: 'Chat exported as Markdown!', id: Date.now(), timestamp: new Date().toLocaleTimeString(), category: 'general' });
    renderMessages();
  }

  function toggleAutoReply() {
    isAutoReplyEnabled = !isAutoReplyEnabled;
    document.querySelector('.auto-reply-btn').textContent = 'Auto-Reply: ' + (isAutoReplyEnabled ? 'On' : 'Off');
  }

  function toggleAutoSpeak() {
    isAutoSpeakEnabled = !isAutoSpeakEnabled;
    document.querySelector('.auto-speak-btn').textContent = 'Auto-Speak: ' + (isAutoSpeakEnabled ? 'On' : 'Off');
    if (!isAutoSpeakEnabled && typeof window.stopAllSpeech === 'function') {
      window.stopAllSpeech();
    }
  }

  function toggleTimestamps() {
    showTimestamps = !showTimestamps;
    document.querySelector('.timestamp-btn').textContent = showTimestamps ? 'Hide Timestamps' : 'Show Timestamps';
    renderMessages();
  }

  function searchMessages(query) {
    searchQuery = query;
    renderMessages();
  }

  function toggleTheme() {
    isDarkMode = !isDarkMode;
    document.getElementById('chatbot-container').classList.toggle('dark-mode', isDarkMode);
    document.querySelector('.theme-btn').textContent = isDarkMode ? '☀️' : '🌙';
  }

  function toggleHistory() {
    isHistoryCollapsed = !isHistoryCollapsed;
    document.getElementById('chat-messages').style.display = isHistoryCollapsed ? 'none' : 'block';
    document.querySelector('.history-btn').textContent = isHistoryCollapsed ? 'Show History' : 'Hide History';
  }

  function adjustFontSize(delta) {
    fontSize = Math.max(12, Math.min(20, fontSize + delta));
    document.getElementById('chatbot-container').style.fontSize = fontSize + 'px';
  }

  function toggleRecording() {
    if (!recognition) {
      window.messages.push({
        sender: 'ai',
        text: 'Speech recognition is not supported in this browser.',
        id: Date.now(),
        timestamp: new Date().toLocaleTimeString(),
        category: 'general'
      });
      renderMessages();
      return;
    }

    isRecording = !isRecording;
    const voiceBtn = document.querySelector('.voice-btn');
    voiceBtn.textContent = isRecording ? '🎤 Stop' : '🎤 Speak';

    if (isRecording) {
      recognition.lang = 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        const input = document.getElementById('chat-input');
        input.value = transcript;
        isRecording = false;
        voiceBtn.textContent = '🎤 Speak';
        sendMessage();
      };

      recognition.onerror = function(event) {
        isRecording = false;
        voiceBtn.textContent = '🎤 Speak';
        window.messages.push({
          sender: 'ai',
          text: 'Speech recognition error: ' + event.error,
          id: Date.now(),
          timestamp: new Date().toLocaleTimeString(),
          category: 'general'
        });
        renderMessages();
      };

      recognition.onend = function() {
        isRecording = false;
        voiceBtn.textContent = '🎤 Speak';
      };

      recognition.start();
    } else {
      recognition.stop();
    }
  }

  document.addEventListener('DOMContentLoaded', function() {
    renderMessages();
    handleInputChange('');
    document.querySelector('.auto-speak-btn').textContent = 'Auto-Speak: ' + (isAutoSpeakEnabled ? 'On' : 'Off');
    document.querySelector('.timestamp-btn').textContent = showTimestamps ? 'Hide Timestamps' : 'Show Timestamps';
    document.getElementById('volume-control').value = window.getSpeechVolume ? window.getSpeechVolume() : 1;
    document.getElementById('rate-control').value = window.getSpeechRate ? window.getSpeechRate() : 1;
    const chatInput = document.getElementById('chat-input');
    if (chatInput) {
      chatInput.addEventListener('input', function() {
        handleInputChange(this.value);
      });
    }
    // Add ARIA live region
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.className = 'sr-only';
    document.getElementById('chatbot-container').appendChild(liveRegion);
  });

  window.handlePromptClick = handlePromptClick;
  window.sendMessage = sendMessage;
  window.toggleTheme = toggleTheme;
  window.toggleHistory = toggleHistory;
  window.adjustFontSize = adjustFontSize;
  window.toggleRecording = toggleRecording;
  window.confirmClearChat = confirmClearChat;
  window.clearChat = clearChat;
  window.exportChat = exportChat;
  window.toggleAutoReply = toggleAutoReply;
  window.toggleAutoSpeak = toggleAutoSpeak;
  window.toggleTimestamps = toggleTimestamps;
  window.searchMessages = searchMessages;
  window.startEditing = startEditing;
  window.saveEditedMessage = saveEditedMessage;
  window.cancelEdit = cancelEdit;
  window.deleteMessage = deleteMessage;
  window.copyMessage = copyMessage;
  window.handleInputChange = handleInputChange;
  window.editedText = editedText;
})();
