(function() {
  window.messages = JSON.parse(localStorage.getItem('portfolio-chat')) || [
    {
      sender: 'ai',
      text: 'Hello! I\'m your portfolio chatbot. Ask me about Sanjay Patidar\'s projects, skills, or achievements! For example, you can ask "Who is Sanjay Patidar?", or about Zedemy LMS, ConnectNow, or his AWS expertise.',
      id: 'welcome',
      timestamp: new Date().toLocaleTimeString()
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
  const suggestedPrompts = [
    'Who is Sanjay Patidar?',
    'What are Sanjay Patidar’s key projects?',
    'Tell me about Zedemy LMS.',
    'How does ConnectNow work?',
    'What is EventEase?',
    'What frontend skills does Sanjay specialize in?',
    'What backend skills does Sanjay have?',
    'What are Sanjay’s cloud computing skills?',
    'How does Sanjay optimize SaaS apps for SEO?',
    'What are Sanjay’s key achievements?',
    'How has Sanjay impacted page load times?',
    'How can I contact Sanjay for collaboration?'
  ];
  let filteredSuggestions = [];
  const apiKey = 'AIzaSyBTD9ltLvYEDK9MWgTR-71nXt1SsfRzGXI';
  const context = `
Sanjay Patidar is a Serverless Full-Stack SaaS Engineer specializing in AWS Lambda, React, and SEO-first applications. His expertise spans multiple domains:

### Projects
- **Zedemy LMS**: A learning management system with real-time analytics, scalable infrastructure, and SEO optimization, achieving high user engagement across 127 countries.
- **ConnectNow**: A communication platform with a serverless backend, optimized for low latency and global accessibility.
- **EventEase**: An event management SaaS app with dynamic content delivery and edge-optimized performance.

### Skills
- **Frontend**: Proficient in React, Next.js, TypeScript, and Tailwind CSS. Builds responsive, accessible UIs with a focus on performance (e.g., lazy loading, code splitting).
- **Backend**: Expertise in Node.js, Express, MongoDB, and serverless architectures (AWS Lambda, API Gateway, DynamoDB). Designs scalable APIs with REST and GraphQL.
- **Cloud**: AWS Certified, specializing in serverless (Lambda, Step Functions, SQS) and infrastructure as code (CloudFormation, CDK). Implements CI/CD pipelines with GitHub Actions.
- **SEO**: Advanced skills in JSON-LD schemas, server-side rendering (SSR), structured data, and mobile-first optimization. Improved page load times by 40% and search rankings for clients.

### Achievements
- Delivered 12+ real-world applications across insurance, education, communication, and event management.
- Recognized by Amazon and Microsoft hiring managers for production-grade platforms and tech content.
- Improved client search rankings through SEO-first architectures.

### Contact
- Email: sanjay@example.com
- LinkedIn: linkedin.com/in/sanjay-patidar
`;
  const recognition = window.SpeechRecognition || window.webkitSpeechRecognition ? new (window.SpeechRecognition || window.webkitSpeechRecognition)() : null;

  function renderMessages() {
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.innerHTML = '';
    const filteredMessages = searchQuery ? window.messages.filter(m => m.text.toLowerCase().includes(searchQuery.toLowerCase())) : window.messages;
    filteredMessages.forEach(function(message) {
      const messageDiv = document.createElement('div');
      messageDiv.className = 'chat-message ' + (message.sender === 'user' ? 'user-message' : 'ai-message');
      messageDiv.dataset.messageId = message.id;
      const messageContent = document.createElement('div');
      messageContent.className = 'message-content';
      let formattedText = formatMarkdown(message.text);
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
      .replace(/^- (.*)$/gm, '<li>$1</li>')
      .replace(/(\n<li>.*<\/li>)+/g, '<ul>$&</ul>')
      .replace(/\n/g, '<br>');
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

  async function typeMessage(text, messageId) {
    const message = window.messages.find(m => m.id === messageId);
    if (!message) return;
    message.text = '';
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];

    // Start speaking the full response if auto-speak is enabled
    if (isAutoSpeakEnabled && typeof window.speakMessage === 'function') {
      window.speakMessage(messageId, text);
    }

    // Type out the response character by character
    for (const sentence of sentences) {
      for (let i = 0; i < sentence.length; i++) {
        message.text += sentence[i];
        renderMessages();
        await new Promise(resolve => setTimeout(resolve, 30));
      }
    }
  }

  async function sendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    if (!message || isLoading) return;

    isLoading = true;
    window.messages.push({ sender: 'user', text: message, id: Date.now(), timestamp: new Date().toLocaleTimeString() });
    input.value = '';
    renderMessages();

    let aiResponse;
    if (message.toLowerCase().includes('who is sanjay patidar')) {
      aiResponse = 'Sanjay Patidar is a Full-Stack Engineer recognized by hiring managers from Amazon and Microsoft for building production-grade, serverless platforms and actionable tech content that merge engineering precision with business impact. With a strong product mindset, he has delivered 12+ real-world applications across serverless, cloud-native, and SEO-first architectures, spanning domains like insurance, education, communication, and event management, with global reach across 127 countries.';
    } else {
      try {
        const fullPrompt = context + '\n\nUser question: ' + message;
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
          aiResponse = searchResults || 'Sorry, I couldn\'t find specific information. Try asking about Sanjay’s projects or skills!';
        }
      } catch (error) {
        aiResponse = 'Something went wrong. Please try again!';
      }
    }

    const messageId = Date.now();
    window.messages.push({ sender: 'ai', text: '', id: messageId, timestamp: new Date().toLocaleTimeString() });
    await typeMessage(aiResponse, messageId);

    if (isAutoReplyEnabled) {
      setTimeout(function() {
        const followUpId = Date.now() + 1;
        window.messages.push({
          sender: 'ai',
          text: '',
          id: followUpId,
          timestamp: new Date().toLocaleTimeString()
        });
        typeMessage('Do you have any more questions about Sanjay’s work or projects?', followUpId);
      }, 2000);
    }

    isLoading = false;
    renderMessages();
  }

  async function performWebSearch(query) {
    if (query.toLowerCase().includes('sanjay patidar')) {
      return `Sanjay Patidar is a Full-Stack Engineer with expertise in serverless architectures, recognized by industry leaders. Check his LinkedIn (linkedin.com/in/sanjay-patidar) for more details.`;
    }
    return null;
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
      window.messages = window.messages.map(function(message) { return message.id === id ? { ...message, text: window.editedText, timestamp: new Date().toLocaleTimeString() } : message; });
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
    window.messages.push({ sender: 'ai', text: 'Message copied!', id: Date.now(), timestamp: new Date().toLocaleTimeString() });
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
      text: 'Hello! I\'m your portfolio chatbot. Ask me about Sanjay Patidar\'s projects, skills, or achievements! For example, you can ask "Who is Sanjay Patidar?", or about Zedemy LMS, ConnectNow, or his AWS expertise.',
      id: 'welcome',
      timestamp: new Date().toLocaleTimeString()
    }];
    localStorage.removeItem('portfolio-chat');
    renderMessages();
  }

  function exportChat() {
    const chatText = window.messages.map(function(message) { return message.timestamp + ' [' + (message.sender === 'user' ? 'You' : 'Chatbot') + ']: ' + message.text; }).join('\n');
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'portfolio-chat.txt';
    a.click();
    URL.revokeObjectURL(url);
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
        timestamp: new Date().toLocaleTimeString()
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
          timestamp: new Date().toLocaleTimeString()
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
  window.editedText = editedText;
})();
