(function() {
  window.messages = JSON.parse(localStorage.getItem('portfolio-chat')) || [
    {
      sender: 'ai',
      text: 'Hi! I\'m Sanjay Patidar\'s portfolio chatbot. Ask about his projects, skills, or achievements, like "Who is Sanjay Patidar?"',
      id: 'welcome',
      timestamp: new Date().toISOString(),
      category: 'welcome',
      reactions: [],
      isPinned: false
    }
  ];

  try {
    if (!Array.isArray(window.messages)) {
      window.messages = [{
        sender: 'ai',
        text: 'Hi! I\'m Sanjay Patidar\'s portfolio chatbot. Ask about his projects, skills, or achievements, like "Who is Sanjay Patidar?"',
        id: 'welcome',
        timestamp: new Date().toISOString(),
        category: 'welcome',
        reactions: [],
        isPinned: false
      }];
      localStorage.setItem('portfolio-chat', JSON.stringify(window.messages));
    }
  } catch (e) {
    console.warn('Invalid local storage data, resetting:', e);
    window.messages = [{
      sender: 'ai',
      text: 'Hi! I\'m Sanjay Patidar\'s portfolio chatbot. Ask about his projects, skills, or achievements, like "Who is Sanjay Patidar?"',
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
  let fontSize = 14;
  let editingMessageId = null;
  let editedText = '';
  let isRecording = false;
  let isAutoReplyEnabled = true;
  let isAutoSpeakEnabled = true;
  let showTimestamps = true;
  let searchQuery = '';
  let selectedCategory = '';
  let currentLang = 'en';
  let interactionAnalytics = { questionsAsked: 0, speechUsed: 0, categories: {}, reactionsUsed: 0 };
  const suggestedPrompts = {
    en: [
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
    ],
    hi: [
      'संजय पाटीदार कौन हैं?',
      'संजय पाटीदार के प्रमुख प्रोजेक्ट्स क्या हैं?',
      'LIC नीमच के बारे में बताएं।',
      'Zedemy LMS क्या है?',
      'ConnectNow कैसे काम करता है?',
      'EventEase क्या है?',
      'संजय किस फ्रंटएंड स्किल्स में विशेषज्ञ हैं?',
      'संजय के बैकएंड स्किल्स क्या हैं?',
      'संजय की क्लाउड कंप्यूटिंग स्किल्स क्या हैं?',
      'संजय SaaS ऐप्स को SEO के लिए कैसे ऑप्टिमाइज करते हैं?',
      'संजय की प्रमुख उपलब्धियां क्या हैं?',
      'संजय ने पेज लोड टाइम्स पर क्या प्रभाव डाला है?',
      'सहयोग के लिए संजय से कैसे संपर्क कर सकता हूं?',
      'संजय ने एक टाइट डेडलाइन को कैसे हैंडल किया?',
      'ConnectNow में संजय को क्या चुनौतियां आईं?',
      'संजय ने अकादमिक असफलताओं को कैसे पार किया?',
      'संजय नई तकनीकों को कैसे सीखते हैं?',
      'संजय टीम संघर्षों को कैसे हैंडल करते हैं?',
      'संजय का CI/CD में क्या अनुभव है?',
      'संजय ऐप सिक्योरिटी कैसे सुनिश्चित करते हैं?'
    ]
  };
  let filteredSuggestions = suggestedPrompts.en;
  const emojiOptions = ['👍', '😄', '🚀', '🔥', '👏'];
  const apiKey = 'AIzaSyDt6yiWJ1_W4QtDf5mxr4wb-c3aH7TT_3I';
  const context = `...`; // Context omitted for brevity, same as provided
  const hindiContext = `...`; // Hindi context omitted for brevity, same as provided

  const recognition = window.SpeechRecognition || window.webkitSpeechRecognition ? new (window.SpeechRecognition || window.webkitSpeechRecognition)() : null;

  function getContext() {
    return currentLang === 'hi' ? hindiContext : context;
  }

  function renderMessages() {
    const chatMessages = document.getElementById('chat-messages');
    if (!chatMessages) return;
    chatMessages.innerHTML = '';
    const filteredMessages = searchQuery
      ? window.messages.filter(m => m.text.toLowerCase().includes(searchQuery.toLowerCase()))
      : selectedCategory
      ? window.messages.filter(m => m.category === selectedCategory)
      : window.messages;

    filteredMessages.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
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
      let formattedText = formatMarkdown(message.text);
      if (message.category === 'project' && message.projectDetails) {
        formattedText = renderProjectCard(message.text, message.projectDetails);
      }
      if (editingMessageId === message.id) {
        messageContent.innerHTML =
          '<div class="edit-message flex items-center gap-2">' +
            '<input type="text" class="edit-message-input flex-1 p-2 border rounded-lg bg-[#F5F5F5] dark:bg-[#2A3942] text-black dark:text-[#E6E6FA]" value="' + editedText.replace(/"/g, '&quot;') + '" oninput="window.editedText = this.value" onkeypress="if(event.key === \'Enter\') saveEditedMessage(\'' + message.id + '\')">' +
            '<button class="edit-message-button bg-[#128C7E] text-white p-2 rounded-lg" onclick="saveEditedMessage(\'' + message.id + '\')"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg></button>' +
            '<button class="cancel-btn bg-[#FF4D4F] text-white p-2 rounded-lg" onclick="cancelEdit()"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>' +
          '</div>';
      } else {
        messageContent.innerHTML = formattedText;
        if (showTimestamps) {
          const timeSpan = document.createElement('span');
          timeSpan.className = 'message-timestamp';
          timeSpan.textContent = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          messageContent.appendChild(timeSpan);
        }
        if (message.reactions.length > 0) {
          messageContent.innerHTML += '<div class="message-reactions flex flex-wrap gap-1 mt-1">' + message.reactions.map(r => `<span class="reaction-tag bg-[#F5F5F5] dark:bg-[#2A3942] rounded-full px-2 py-1 text-sm">${r}</span>`).join('') + '</div>';
        }
      }
      if (message.sender === 'ai' && message.text && typeof window.speakMessage === 'function') {
        let speakBtn = document.createElement('button');
        speakBtn.className = 'speak-btn absolute -top-2 -right-2 bg-[#25D366] dark:bg-[#2A3942] text-white p-1 rounded-full';
        speakBtn.innerHTML = message.isSpeaking ? '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6"></path></svg>' : '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14"></path></svg>';
        speakBtn.addEventListener('click', function() { window.toggleSpeak(message.id, message.text); });
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
    chatMessages.scrollTop = chatMessages.scrollHeight;
    updateTimestamps();
    updateButtonStates();
    localStorage.setItem('portfolio-chat', JSON.stringify(window.messages));
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
    if (!message) return;
    message.text = text; // Set full text after typing
    if (projectDetails) message.projectDetails = projectDetails;
    if (quickReplies.length > 0) message.quickReplies = quickReplies;
    if (isAutoSpeakEnabled && message.sender === 'ai' && typeof window.speakMessage === 'function') {
      window.speakMessage(messageId, text);
      interactionAnalytics.speechUsed++;
    }
    renderMessages();
  }

  async function sendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    if (!message || isLoading) return;

    isLoading = true;
    interactionAnalytics.questionsAsked++;
    const category = categorizeMessage(message);
    window.messages.push({ sender: 'user', text: message, id: Date.now(), timestamp: new Date().toISOString(), category, reactions: [], isPinned: false });
    input.value = '';
    renderMessages();

    let aiResponse;
    let projectDetails = null;
    let quickReplies = [];
    const lowerMessage = message.toLowerCase();
    const fullPrompt = `You are an AI assistant for Sanjay Patidar's portfolio. Use the following context to answer questions about Sanjay's work, skills, or projects. For general questions outside this context, provide accurate, professional, and concise answers based on general knowledge, ensuring relevance to the user's query. Context: ${getContext()}\n\nUser question: ${message}\n\nProvide a clear, well-educated response in ${currentLang === 'hi' ? 'Hindi' : 'English'}.`;
    try {
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + apiKey, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: fullPrompt }] }] })
      });
      if (!response.ok) throw new Error('API request failed');
      const data = await response.json();
      aiResponse = data.candidates[0].content.parts[0].text;
      quickReplies = currentLang === 'hi' ? ['इस पर और विस्तार से बताएं?', 'और क्या बता सकते हैं?', 'यह संजय के काम से कैसे संबंधित है?'] : ['Can you elaborate on this?', 'What else can you tell me?', 'How does this relate to Sanjay’s work?'];
      if (!aiResponse || aiResponse.includes('I don\'t have enough information')) {
        const searchResults = await performWebSearch(message);
        aiResponse = searchResults || (currentLang === 'hi' ? 'क्षमा करें, मुझे विशिष्ट जानकारी नहीं मिली। संजय के प्रोजेक्ट्स, स्किल्स, या सामान्य टेक टॉपिक्स के बारे में पूछें!' : 'Sorry, I couldn\'t find specific information. Try asking about Sanjay’s projects, skills, or general tech topics!');
      }
    } catch (error) {
      console.warn('API error: ' + error.message);
      const searchResults = await performWebSearch(message);
      aiResponse = searchResults || (currentLang === 'hi' ? 'कुछ गड़बड़ हो गई। कृपया फिर से प्रयास करें या संजय के प्रोजेक्ट्स या स्किल्स के बारे में पूछें!' : 'Something went wrong. Please try again or ask about Sanjay’s projects or skills!');
      quickReplies = currentLang === 'hi' ? ['दूसरा प्रश्न पूछें', 'संजय के प्रोजेक्ट्स के बारे में पूछें', 'संजय की स्किल्स क्या हैं?'] : ['Try another question', 'Ask about Sanjay’s projects', 'What are Sanjay’s skills?'];
    }
    interactionAnalytics.categories[category] = (interactionAnalytics.categories[category] || 0) + 1;

    const messageId = Date.now();
    window.messages.push({ sender: 'ai', text: '', id: messageId, timestamp: new Date().toISOString(), category: projectDetails ? 'project' : category, reactions: [], isPinned: false });
    await typeMessage(aiResponse, messageId, projectDetails, quickReplies);

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
        typeMessage(currentLang === 'hi' ? 'संजय के काम या प्रोजेक्ट्स के बारे में और कोई प्रश्न हैं?' : 'Do you have any more questions about Sanjay’s work or projects?', followUpId, null, currentLang === 'hi' ? ['संजय के प्रोजेक्ट्स क्या हैं?', 'संजय की स्किल्स क्या हैं?', 'संजय से संपर्क कैसे करें?'] : ['What are Sanjay’s projects?', 'What skills does Sanjay have?', 'How can I contact Sanjay?']);
      }, 2000);
    }

    isLoading = false;
    renderMessages();
  }

  async function performWebSearch(query) {
    const lowerQuery = query.toLowerCase();
    if (lowerQuery.includes('sanjay patidar')) {
      return currentLang === 'hi' ? `संजय पाटीदार सर्वरलेस आर्किटेक्चर में विशेषज्ञ फुल-स्टैक इंजीनियर हैं, जिन्हें इंडस्ट्री लीडर्स द्वारा मान्यता प्राप्त है। अधिक जानकारी के लिए उनका [LinkedIn](https://linkedin.com/in/sanjay-patidar) देखें।` : `Sanjay Patidar is a Full-Stack Engineer with expertise in serverless architectures, recognized by industry leaders. Check his [LinkedIn](https://linkedin.com/in/sanjay-patidar) for more details.`;
    }
    return currentLang === 'hi' ? ` "${query}" पर सामान्य जानकारी: अधिक संदर्भ प्रदान करें या संजय-संबंधित प्रश्न के लिए विस्तृत जानकारी के लिए पूछें।` : `General information on "${query}": Please provide more context or try a Sanjay-specific question for detailed insights.`;
  }

  function categorizeMessage(message) {
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('project') || lowerMessage.includes('lic neemuch') || lowerMessage.includes('zedemy') || lowerMessage.includes('connectnow') || lowerMessage.includes('eventease') || lowerMessage.includes('eduxcel') || lowerMessage.includes('प्रोजेक्ट') || lowerMessage.includes('lic नीमच') || lowerMessage.includes('जेडेमी') || lowerMessage.includes('कनेक्टनाउ') || lowerMessage.includes('इवेंटईज') || lowerMessage.includes('एडुक्सेल')) {
      return 'project';
    } else if (lowerMessage.includes('skill') || lowerMessage.includes('frontend') || lowerMessage.includes('backend') || lowerMessage.includes('cloud') || lowerMessage.includes('seo') || lowerMessage.includes('ci/cd') || lowerMessage.includes('security') || lowerMessage.includes('स्किल') || lowerMessage.includes('फ्रंटएंड') || lowerMessage.includes('बैकएंड') || lowerMessage.includes('क्लाउड') || lowerMessage.includes('एसईओ') || lowerMessage.includes('सीआई/सीडी') || lowerMessage.includes('सुरक्षा')) {
      return 'skills';
    } else if (lowerMessage.includes('achievement') || lowerMessage.includes('load time') || lowerMessage.includes('impression') || lowerMessage.includes('उपलब्धि') || lowerMessage.includes('लोड टाइम') || lowerMessage.includes('इंप्रेशन')) {
      return 'achievements';
    } else if (lowerMessage.includes('contact') || lowerMessage.includes('collaboration') || lowerMessage.includes('संपर्क') || lowerMessage.includes('सहयोग')) {
      return 'contact';
    } else if (lowerMessage.includes('challenge') || lowerMessage.includes('deadline') || lowerMessage.includes('setback') || lowerMessage.includes('conflict') || lowerMessage.includes('learn') || lowerMessage.includes('चुनौती') || lowerMessage.includes('डेडलाइन') || lowerMessage.includes('असफलता') || lowerMessage.includes('संघर्ष') || lowerMessage.includes('सीखना')) {
      return 'challenges';
    } else if (lowerMessage.includes('who is sanjay') || lowerMessage.includes('संजय कौन')) {
      return 'about';
    } else {
      return 'general';
    }
  }

  function filterByCategory(category) {
    selectedCategory = category;
    searchQuery = '';
    document.getElementById('search-bar').value = '';
    renderMessages();
    handleInputChange('');
  }

  function handlePromptClick(prompt) {
    document.getElementById('chat-input').value = prompt;
    sendMessage();
  }

  function handleQuickReply(prompt) {
    document.getElementById('chat-input').value = prompt;
    sendMessage();
  }

  function handleInputChange(value) {
    const suggestionsContainer = document.getElementById('chat-suggestions');
    if (suggestionsContainer) {
      filteredSuggestions = value.trim() ? suggestedPrompts[currentLang].filter(function(prompt) { return prompt.toLowerCase().includes(value.toLowerCase()); }) : suggestedPrompts[currentLang];
      suggestionsContainer.innerHTML = filteredSuggestions.map(function(prompt) {
        return '<button class="suggestion-btn" onclick="handlePromptClick(\'' + prompt.replace(/'/g, '\\\'').replace(/"/g, '&quot;') + '\')">' + prompt + '</button>';
      }).join('');
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
    window.editedText = text;
    renderMessages();
  }

  async function saveEditedMessage(id) {
    if (window.editedText.trim()) {
      window.messages = window.messages.map(function(message) {
        return message.id === id ? { ...message, text: window.editedText, timestamp: new Date().toISOString(), category: categorizeMessage(window.editedText) } : message;
      });
      editingMessageId = null;
      const editedMessageText = window.editedText;
      window.editedText = '';
      renderMessages();
      isLoading = true;
      interactionAnalytics.questionsAsked++;
      const category = categorizeMessage(editedMessageText);
      let aiResponse;
      let projectDetails = null;
      let quickReplies = [];
      const fullPrompt = `You are an AI assistant for Sanjay Patidar's portfolio. Use the following context to answer questions about Sanjay's work, skills, or projects. For general questions outside this context, provide accurate, professional, and concise answers based on general knowledge, ensuring relevance to the user's query. Context: ${getContext()}\n\nUser question: ${editedMessageText}\n\nProvide a clear, well-educated response in ${currentLang === 'hi' ? 'Hindi' : 'English'}.`;
      try {
        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + apiKey, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: fullPrompt }] }] })
        });
        if (!response.ok) throw new Error('API request failed');
        const data = await response.json();
        aiResponse = data.candidates[0].content.parts[0].text;
        quickReplies = currentLang === 'hi' ? ['इस पर और विस्तार से बताएं?', 'और क्या बता सकते हैं?', 'यह संजय के काम से कैसे संबंधित है?'] : ['Can you elaborate on this?', 'What else can you tell me?', 'How does this relate to Sanjay’s work?'];
        if (!aiResponse || aiResponse.includes('I don\'t have enough information')) {
          const searchResults = await performWebSearch(editedMessageText);
          aiResponse = searchResults || (currentLang === 'hi' ? 'क्षमा करें, मुझे विशिष्ट जानकारी नहीं मिली। संजय के प्रोजेक्ट्स, स्किल्स, या सामान्य टेक टॉपिक्स के बारे में पूछें!' : 'Sorry, I couldn\'t find specific information. Try asking about Sanjay’s projects, skills, or general tech topics!');
        }
      

              } catch (error) {
        console.warn('API error: ' + error.message);
        const searchResults = await performWebSearch(editedMessageText);
        aiResponse = searchResults || (currentLang === 'hi' ? 'क्षमा करें, कुछ गड़बड़ हो गई। कृपया फिर से प्रयास करें या संजय के प्रोजेक्ट्स या स्किल्स के बारे में पूछें!' : 'Something went wrong. Please try again or ask about Sanjay’s projects or skills!');
        quickReplies = currentLang === 'hi' ? ['दूसरा प्रश्न पूछें', 'संजय के प्रोजेक्ट्स के बारे में पूछें', 'संजय की स्किल्स क्या हैं?'] : ['Try another question', 'Ask about Sanjay’s projects', 'What are Sanjay’s skills?'];
      }
      interactionAnalytics.categories[category] = (interactionAnalytics.categories[category] || 0) + 1;

      const messageId = Date.now() + 2;
      window.messages.push({ sender: 'ai', text: '', id: messageId, timestamp: new Date().toISOString(), category: projectDetails ? 'project' : category, reactions: [], isPinned: false });
      await typeMessage(aiResponse, messageId, projectDetails, quickReplies);

      if (isAutoReplyEnabled) {
        setTimeout(function() {
          const followUpId = Date.now() + 3;
          window.messages.push({
            sender: 'ai',
            text: '',
            id: followUpId,
            timestamp: new Date().toISOString(),
            category: 'follow-up',
            reactions: [],
            isPinned: false
          });
          typeMessage(currentLang === 'hi' ? 'संजय के काम या प्रोजेक्ट्स के बारे में और कोई प्रश्न हैं?' : 'Do you have any more questions about Sanjay’s work or projects?', followUpId, null, currentLang === 'hi' ? ['संजय के प्रोजेक्ट्स क्या हैं?', 'संजय की स्किल्स क्या हैं?', 'संजय से संपर्क कैसे करें?'] : ['What are Sanjay’s projects?', 'What skills does Sanjay have?', 'How can I contact Sanjay?']);
        }, 2000);
      }

      isLoading = false;
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
    if (window.messages.length === 0) {
      window.messages.push({
        sender: 'ai',
        text: currentLang === 'hi' ? 'हाय! मैं संजय पाटीदार का पोर्टफोलियो चैटबॉट हूँ। उनके प्रोजेक्ट्स, स्किल्स, या उपलब्धियों के बारे में पूछें, जैसे "संजय पाटीदार कौन हैं?"' : 'Hi! I\'m Sanjay Patidar\'s portfolio chatbot. Ask about his projects, skills, or achievements, like "Who is Sanjay Patidar?"',
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
    const messages = document.querySelectorAll('.message-content');
    messages.forEach(function(message) {
      message.style.fontSize = fontSize + 'px';
    });
  }

  function confirmClearChat() {
    const confirmPopup = document.createElement('div');
    confirmPopup.className = 'confirm-popup top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2';
    confirmPopup.innerHTML = `
      <p class="text-sm">${currentLang === 'hi' ? 'क्या आप वाकई चैट इतिहास मिटाना चाहते हैं?' : 'Are you sure you want to clear the chat history?'}</p>
      <div class="flex justify-end gap-2 mt-2">
        <button class="control-btn bg-[#128C7E] text-white" onclick="clearChat()">${currentLang === 'hi' ? 'हाँ' : 'Yes'}</button>
        <button class="control-btn bg-[#FF4D4F] text-white" onclick="this.parentElement.parentElement.remove()">${currentLang === 'hi' ? 'नहीं' : 'No'}</button>
      </div>
    `;
    document.getElementById('chatbot-container').appendChild(confirmPopup);
  }

  function clearChat() {
    window.messages = [{
      sender: 'ai',
      text: currentLang === 'hi' ? 'हाय! मैं संजय पाटीदार का पोर्टफोलियो चैटबॉट हूँ। उनके प्रोजेक्ट्स, स्किल्स, या उपलब्धियों के बारे में पूछें, जैसे "संजय पाटीदार कौन हैं?"' : 'Hi! I\'m Sanjay Patidar\'s portfolio chatbot. Ask about his projects, skills, or achievements, like "Who is Sanjay Patidar?"',
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
      document.getElementById('chat-input').value = transcript;
      isRecording = false;
      const voiceBtn = document.querySelector('.voice-btn');
      if (voiceBtn) voiceBtn.classList.remove('recording');
      sendMessage();
    };
    recognition.onend = function() {
      isRecording = false;
      const voiceBtn = document.querySelector('.voice-btn');
      if (voiceBtn) voiceBtn.classList.remove('recording');
    };
    recognition.onerror = function(event) {
      console.warn('Speech recognition error: ' + event.error);
      isRecording = false;
      const voiceBtn = document.querySelector('.voice-btn');
      if (voiceBtn) voiceBtn.classList.remove('recording');
      alert(currentLang === 'hi' ? 'वॉइस रिकग्निशन में त्रुटि: ' + event.error : 'Voice recognition error: ' + event.error);
    };
  }

  document.addEventListener('DOMContentLoaded', function() {
    renderMessages();
    handleInputChange('');
    document.querySelector('.controls-toggle').addEventListener('click', toggleControls);
    document.querySelector('.search-toggle').addEventListener('click', toggleSearchBar);
    document.querySelectorAll('.lang-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        currentLang = btn.dataset.lang;
        document.getElementById('chatbot-container').lang = currentLang;
        const chatInput = document.getElementById('chat-input');
        if (chatInput) {
          chatInput.placeholder = currentLang === 'hi' ? chatInput.dataset.placeholderHi : chatInput.placeholder;
        }
        const searchBar = document.getElementById('search-bar');
        if (searchBar) {
          searchBar.placeholder = currentLang === 'hi' ? searchBar.dataset.placeholderHi : 'Search messages...';
        }
        handleInputChange(document.getElementById('chat-input').value);
        updateButtonStates();
        renderMessages();
      });
    });
    document.getElementById('volume-control').addEventListener('input', function(e) {
      if (typeof window.setSpeechVolume === 'function') window.setSpeechVolume(e.target.value);
    });
    document.getElementById('rate-control').addEventListener('input', function(e) {
      if (typeof window.setSpeechRate === 'function') window.setSpeechRate(e.target.value);
    });
  });
})();
