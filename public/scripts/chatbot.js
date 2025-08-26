(function() {
  let currentLang = localStorage.getItem('chat-lang') || 'hi';
  window.messages = JSON.parse(localStorage.getItem('lic-chat')) || [
    {
      sender: 'ai',
      text: currentLang === 'hi' 
        ? 'हाय! मैं LIC नीमच चैटबॉट हूँ। बीमा योजनाओं, प्रीमियम, या डिजिटल सेवाओं के बारे में पूछें, जैसे "LIC नीमच की सेवाएँ क्या हैं?" या "मुझे जीवन बीमा योजना के बारे में बताएं!"'
        : 'Hi! I\'m the LIC Neemuch chatbot. Ask about insurance plans, premiums, or digital services, like "What are LIC Neemuch’s services?" or "Tell me about life insurance plans!"',
      id: 'welcome',
      timestamp: new Date().toISOString(),
      category: 'welcome',
      reactions: [],
      isPinned: false
    }
  ];

  try {
    if (!Array.isArray(window.messages)) {
      console.warn('Invalid localStorage data, resetting messages');
      window.messages = [{
        sender: 'ai',
        text: currentLang === 'hi' 
          ? 'हाय! मैं LIC नीमच चैटबॉट हूँ। बीमा योजनाओं, प्रीमियम, या डिजिटल सेवाओं के बारे में पूछें, जैसे "LIC नीमच की सेवाएँ क्या हैं?" या "मुझे जीवन बीमा योजना के बारे में बताएं!"'
          : 'Hi! I\'m the LIC Neemuch chatbot. Ask about insurance plans, premiums, or digital services, like "What are LIC Neemuch’s services?" or "Tell me about life insurance plans!"',
        id: 'welcome',
        timestamp: new Date().toISOString(),
        category: 'welcome',
        reactions: [],
        isPinned: false
      }];
      localStorage.setItem('lic-chat', JSON.stringify(window.messages));
    }
  } catch (e) {
    console.error('Error parsing localStorage:', e);
    window.messages = [{
      sender: 'ai',
      text: currentLang === 'hi' 
        ? 'हाय! मैं LIC नीमच चैटबॉट हूँ। बीमा योजनाओं, प्रीमियम, या डिजिटल सेवाओं के बारे में पूछें, जैसे "LIC नीमच की सेवाएँ क्या हैं?" या "मुझे जीवन बीमा योजना के बारे में बताएं!"'
        : 'Hi! I\'m the LIC Neemuch chatbot. Ask about insurance plans, premiums, or digital services, like "What are LIC Neemuch’s services?" or "Tell me about life insurance plans!"',
      id: 'welcome',
      timestamp: new Date().toISOString(),
      category: 'welcome',
      reactions: [],
      isPinned: false
    }];
    localStorage.setItem('lic-chat', JSON.stringify(window.messages));
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
  let interactionAnalytics = { questionsAsked: 0, speechUsed: 0, categories: {}, reactionsUsed: 0 };
  const suggestedPrompts = {
    en: [
      'What are LIC Neemuch’s services?',
      'Tell me about life insurance plans.',
      'How can I pay my LIC premium online?',
      'What is the LIC digital platform?',
      'How to file an insurance claim with LIC?',
      'What are the benefits of LIC policies?',
      'Explain LIC’s term insurance plans.',
      'How does LIC’s customer support work?',
      'What documents are needed for LIC policies?',
      'Tell me about LIC’s investment plans.'
    ],
    hi: [
      'LIC नीमच की सेवाएँ क्या हैं?',
      'जीवन बीमा योजनाओं के बारे में बताएं।',
      'मैं LIC प्रीमियम ऑनलाइन कैसे भर सकता हूँ?',
      'LIC का डिजिटल प्लेटफॉर्म क्या है?',
      'LIC के साथ बीमा क्लेम कैसे फाइल करें?',
      'LIC पॉलिसियों के लाभ क्या हैं?',
      'LIC की टर्म इंश्योरेंस योजनाएँ समझाएँ।',
      'LIC का कस्टमर सपोर्ट कैसे काम करता है?',
      'LIC पॉलिसी के लिए कौन से दस्तावेज़ चाहिए?',
      'LIC की निवेश योजनाओं के बारे में बताएं।'
    ]
  };
  let filteredSuggestions = suggestedPrompts[currentLang];
  const emojiOptions = ['👍', '😄', '💼', '📜', '👏'];
  const primaryApiKey = 'AIzaSyA6R5mEyZM7Vz61fisMnFaYedGptHv8B4I';
  const fallbackApiKey = 'AIzaSyCP0zYjRT5Gkdb2PQjSmVi6-TnO2a7ldAA';
  const licContext = `
**LIC Neemuch Digital Platform Overview**:
- **Background**: The Life Insurance Corporation (LIC) office in Neemuch, a 60-year-old government institution, lacked a digital presence, relying on pamphlets and WhatsApp forwards for outreach. Sanjay Patidar developed a serverless platform to digitize operations.
- **Solution**: Built with React, Tailwind CSS, Vite, React Helmet (frontend); AWS Lambda, API Gateway, MongoDB Atlas (backend); AWS S3, CloudFront, SSL via ACM, Cloudflare DNS (infrastructure); and CloudWatch Logs (monitoring).
- **Outcomes**: Achieved 100/100 Lighthouse score, ranked pages within days via SEO (React Helmet, pre-rendering), and increased inquiry submissions by 3x in two months.
- **Services**: Online premium payments, policy inquiries, claim filing, and customer support through a responsive web interface.
- **Key Features**: Mobile-first design, SEO-optimized pages, secure payment gateway integration, and real-time policy status updates.
- **Contact**: Email: lic.neemuch.support@gmail.com | Phone: +91-7423-XXXXXX
  `;
  const hindiLicContext = `
**LIC नीमच डिजिटल प्लेटफॉर्म अवलोकन**:
- **पृष्ठभूमि**: नीमच का जीवन बीमा निगम (LIC) कार्यालय, एक 60 साल पुरानी सरकारी संस्था, के पास कोई डिजिटल उपस्थिति नहीं थी, जो प्रचार के लिए पैंफलेट और व्हाट्सएप फॉरवर्ड पर निर्भर थी। संजय पाटीदार ने संचालन को डिजिटाइज़ करने के लिए एक सर्वरलेस प्लेटफॉर्म विकसित किया।
- **समाधान**: React, Tailwind CSS, Vite, React Helmet (फ्रंटएंड); AWS Lambda, API Gateway, MongoDB Atlas (बैकएंड); AWS S3, CloudFront, SSL via ACM, Cloudflare DNS (इंफ्रास्ट्रक्चर); और CloudWatch Logs (मॉनिटरिंग) के साथ बनाया गया।
- **परिणाम**: 100/100 लाइटहाउस स्कोर प्राप्त किया, SEO (React Helmet, प्री-रेंडरिंग) के माध्यम से कुछ दिनों में पेज रैंकिंग, और दो महीनों में पूछताछ 3 गुना बढ़ी।
- **सेवाएँ**: ऑनलाइन प्रीमियम भुगतान, पॉलिसी पूछताछ, क्लेम फाइलिंग, और एक रिस्पॉन्सिव वेब इंटरफेस के माध्यम से कस्टमर सपोर्ट।
- **मुख्य विशेषताएँ**: मोबाइल-फर्स्ट डिज़ाइन, SEO-अनुकूलित पेज, सुरक्षित पेमेंट गेटवे एकीकरण, और रियल-टाइम पॉलिसी स्टेटस अपडेट।
- **संपर्क**: ईमेल: lic.neemuch.support@gmail.com | फोन: +91-7423-XXXXXX
  `;
  const recognition = window.SpeechRecognition || window.webkitSpeechRecognition ? new (window.SpeechRecognition || window.webkitSpeechRecognition)() : null;

  function getContext() {
    return currentLang === 'hi' ? hindiLicContext : licContext;
  }

  async function processMessage(message, messageId) {
    isLoading = true;
    interactionAnalytics.questionsAsked++;
    const { category } = categorizeMessage(message);
    interactionAnalytics.categories[category] = (interactionAnalytics.categories[category] || 0) + 1;

    let aiResponse;
    let quickReplies = [];
    const fullPrompt = `You are an AI assistant for LIC Neemuch's digital platform. Respond in a professional, concise, and helpful tone suitable for customers seeking insurance information. Use the following context to answer questions about LIC Neemuch's services, plans, or digital platform. For general insurance questions, provide accurate answers based on standard LIC offerings. Context: ${getContext()}\n\nUser question: ${message}\n\nProvide a clear response in ${currentLang === 'hi' ? 'Hindi' : 'English'}.`;

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
        aiResponse = currentLang === 'hi' 
          ? 'क्षमा करें, मुझे विशिष्ट जानकारी नहीं मिली। LIC नीमच की सेवाओं, योजनाओं, या डिजिटल प्लेटफॉर्म के बारे में पूछें!'
          : 'Sorry, I couldn\'t find specific information. Try asking about LIC Neemuch’s services, plans, or digital platform!';
      }
      quickReplies = currentLang === 'hi'
        ? ['प्रीमियम भुगतान कैसे करें?', 'क्लेम प्रक्रिया क्या है?', 'LIC नीमच से संपर्क कैसे करें?']
        : ['How to pay premiums?', 'What is the claim process?', 'How to contact LIC Neemuch?'];
    } catch (error) {
      console.error('Both API requests failed:', error.message);
      aiResponse = currentLang === 'hi' 
        ? 'कुछ गड़बड़ हो गई। कृपया फिर से प्रयास करें या LIC नीमच की सेवाओं, योजनाओं, या डिजिटल प्लेटफॉर्म के बारे में पूछें!'
        : 'Something went wrong. Please try again or ask about LIC Neemuch’s services, plans, or digital platform!';
      quickReplies = currentLang === 'hi'
        ? ['दूसरा प्रश्न पूछें', 'LIC की योजनाएँ बताएँ', 'डिजिटल प्लेटफॉर्म की जानकारी दें']
        : ['Try another question', 'Tell me about LIC plans', 'Explain the digital platform'];
    }

    const responseId = Date.now();
    window.messages.push({
      sender: 'ai',
      text: '',
      id: responseId,
      timestamp: new Date().toISOString(),
      category: category,
      reactions: [],
      isPinned: false
    });
    await typeMessage(aiResponse, responseId, null, quickReplies);

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
          currentLang === 'hi' ? 'LIC नीमच की सेवाओं, योजनाओं, या डिजिटल प्लेटफॉर्म के बारे में और कोई प्रश्न हैं?' : 'Do you have any more questions about LIC Neemuch’s services, plans, or digital platform?',
          followUpId,
          null,
          currentLang === 'hi'
            ? ['प्रीमियम भुगतान कैसे करें?', 'क्लेम प्रक्रिया क्या है?', 'LIC नीमच से संपर्क कैसे करें?']
            : ['How to pay premiums?', 'What is the claim process?', 'How to contact LIC Neemuch?']
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
      if (editingMessageId === message.id) {
        messageContent.innerHTML =
          '<div class="edit-message flex items-center gap-2">' +
            '<input type="text" class="edit-message-input flex-1 p-2 border rounded-lg bg-[#F5F5F5] dark:bg-[#2A3942] text-black dark:text-[#E6E6FA]" value="' + editedText.replace(/"/g, '&quot;') + '">' +
            '<button class="edit-message-button bg-[#128C7E] text-white p-2 rounded-lg"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg></button>' +
            '<button class="cancel-btn bg-[#FF4D4F] text-white p-2 rounded-lg"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>' +
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
        if (message.quickReplies && message.quickReplies.length > 0) {
          const replyButtons = document.createElement('div');
          replyButtons.className = 'quick-replies flex gap-2 mt-2';
          message.quickReplies.forEach(reply => {
            const btn = document.createElement('button');
            btn.className = 'quick-reply-btn bg-[var(--chat-border-light)] dark:bg-[var(--chat-border-dark)] text-white dark:text-[var(--chat-text-dark)] p-2 rounded-lg text-sm';
            btn.textContent = reply;
            btn.addEventListener('click', () => handleQuickReply(reply));
            replyButtons.appendChild(btn);
          });
          messageContent.appendChild(replyButtons);
        }
      }
      if (message.sender === 'ai' && message.text && typeof window.speakMessage === 'function') {
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
    localStorage.setItem('lic-chat', JSON.stringify(window.messages));
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
    if (isAutoSpeakEnabled && message.sender === 'ai' && typeof window.speakMessage === 'function') {
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
    await processMessage(message, messageId);
  }

  function categorizeMessage(message) {
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('service') || lowerMessage.includes('सेवा') || lowerMessage.includes('digital') || lowerMessage.includes('डिजिटल') || lowerMessage.includes('platform') || lowerMessage.includes('प्लेटफॉर्म')) {
      return { category: 'services' };
    } else if (lowerMessage.includes('plan') || lowerMessage.includes('policy') || lowerMessage.includes('insurance') || lowerMessage.includes('योजना') || lowerMessage.includes('पॉलिसी') || lowerMessage.includes('बीमा')) {
      return { category: 'plans' };
    } else if (lowerMessage.includes('premium') || lowerMessage.includes('payment') || lowerMessage.includes('प्रीमियम') || lowerMessage.includes('भुगतान')) {
      return { category: 'premiums' };
    } else if (lowerMessage.includes('claim') || lowerMessage.includes('क्लेम')) {
      return { category: 'claims' };
    } else if (lowerMessage.includes('contact') || lowerMessage.includes('support') || lowerMessage.includes('संपर्क') || lowerMessage.includes('सपोर्ट')) {
      return { category: 'contact' };
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
        localStorage.setItem('lic-chat', JSON.stringify(window.messages));
      }
    }
  }

  function togglePinMessage(messageId) {
    const message = window.messages.find(m => m.id === messageId);
    if (message) {
      message.isPinned = !message.isPinned;
      renderMessages();
      localStorage.setItem('lic-chat', JSON.stringify(window.messages));
    }
  }

  function tryFindEditInput(messageId, attempt = 1, maxAttempts = 3) {
    const editInput = document.querySelector(`[data-message-id="${messageId}"] .edit-message-input`);
    if (editInput) {
      editInput.focus();
      editInput.addEventListener('input', (e) => editedText = e.target.value);
      editInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') saveEditedMessage(messageId);
      });
      const saveBtn = document.querySelector(`[data-message-id="${messageId}"] .edit-message-button`);
      if (saveBtn) saveBtn.addEventListener('click', () => saveEditedMessage(messageId));
      const cancelBtn = document.querySelector(`[data-message-id="${messageId}"] .cancel-btn`);
      if (cancelBtn) cancelBtn.addEventListener('click', cancelEdit);
      return true;
    } else if (attempt < maxAttempts) {
      console.warn(`Edit input not found for message ID: ${messageId}, attempt ${attempt}/${maxAttempts}`);
      setTimeout(() => tryFindEditInput(messageId, attempt + 1, maxAttempts), 100);
      return false;
    } else {
      console.error(`Failed to find edit input for message ID: ${messageId} after ${maxAttempts} attempts`);
      editingMessageId = null;
      editedText = '';
      renderMessages();
      return false;
    }
  }

  function startEditing(id, text) {
    editingMessageId = id;
    editedText = text;
    renderMessages();
    requestAnimationFrame(() => {
      tryFindEditInput(id);
    });
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
      await processMessage(editedMessageText, id);
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
        text: currentLang === 'hi' 
          ? 'हाय! मैं LIC नीमच चैटबॉट हूँ। बीमा योजनाओं, प्रीमियम, या डिजिटल सेवाओं के बारे में पूछें, जैसे "LIC नीमच की सेवाएँ क्या हैं?" या "मुझे जीवन बीमा योजना के बारे में बताएं!"'
          : 'Hi! I\'m the LIC Neemuch chatbot. Ask about insurance plans, premiums, or digital services, like "What are LIC Neemuch’s services?" or "Tell me about life insurance plans!"',
        id: 'welcome',
        timestamp: new Date().toISOString(),
        category: 'welcome',
        reactions: [],
        isPinned: false
      });
    }
    renderMessages();
    localStorage.setItem('lic-chat', JSON.stringify(window.messages));
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
      text: currentLang === 'hi' 
        ? 'हाय! मैं LIC नीमच चैटबॉट हूँ। बीमा योजनाओं, प्रीमियम, या डिजिटल सेवाओं के बारे में पूछें, जैसे "LIC नीमच की सेवाएँ क्या हैं?" या "मुझे जीवन बीमा योजना के बारे में बताएं!"'
        : 'Hi! I\'m the LIC Neemuch chatbot. Ask about insurance plans, premiums, or digital services, like "What are LIC Neemuch’s services?" or "Tell me about life insurance plans!"',
      id: 'welcome',
      timestamp: new Date().toISOString(),
      category: 'welcome',
      reactions: [],
      isPinned: false
    }];
    localStorage.setItem('lic-chat', JSON.stringify(window.messages));
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
        processMessage(transcript, messageId);
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
          chatInput.placeholder = currentLang === 'hi' ? chatInput.dataset.placeholderHi : 'Ask about LIC Neemuch’s services or plans...';
        }
        const searchBar = document.getElementById('search-bar');
        if (searchBar) {
          searchBar.placeholder = currentLang === 'hi' ? searchBar.dataset.placeholderHi : 'Search Messages';
        }
        const welcomeMsg = window.messages.find(m => m.id === 'welcome');
        if (welcomeMsg) {
          welcomeMsg.text = currentLang === 'hi' 
            ? 'हाय! मैं LIC नीमच चैटबॉट हूँ। बीमा योजनाओं, प्रीमियम, या डिजिटल सेवाओं के बारे में पूछें, जैसे "LIC नीमच की सेवाएँ क्या हैं?" या "मुझे जीवन बीमा योजना के बारे में बताएं!"'
            : 'Hi! I\'m the LIC Neemuch chatbot. Ask about insurance plans, premiums, or digital services, like "What are LIC Neemuch’s services?" or "Tell me about life insurance plans!"';
          localStorage.setItem('lic-chat', JSON.stringify(window.messages));
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
