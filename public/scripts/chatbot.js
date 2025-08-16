(function() {
  let messages = JSON.parse(localStorage.getItem('portfolio-chat')) || [
    {
      sender: 'ai',
      text: 'Hello! I\'m your portfolio chatbot. Ask me about Sanjay Patidar\'s projects, skills, or achievements! For example, you can ask about Zedemy LMS, ConnectNow, or his AWS serverless expertise.',
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
  const suggestedPrompts = [
    'What are Sanjay Patidar’s key projects?',
    'What skills does Sanjay specialize in?',
    'How does Sanjay optimize SaaS apps for SEO?',
    'How can I contact Sanjay for collaboration?'
  ];
  let filteredSuggestions = [];
  const apiKey = 'AIzaSyBTD9ltLvYEDK9MWgTR-71nXt1SsfRzGXI';
  const context = 'Sanjay Patidar is a Serverless Full-Stack SaaS Engineer specializing in AWS Lambda, React, and SEO-first applications. His key projects include:\n- **Zedemy LMS**: A learning management system with real-time analytics, scalable infrastructure, and SEO optimization, achieving high user engagement.\n- **ConnectNow**: A communication platform with serverless backend, optimized for low latency and global accessibility.\n- **EventEase**: An event management SaaS app with dynamic content delivery and edge-optimized performance.\nSanjay’s skills include AWS (Lambda, API Gateway, DynamoDB), React, Node.js, MongoDB, and advanced SEO techniques (JSON-LD schemas, SSR, structured data). He has improved page load times by 40% and search rankings for clients. For collaboration, contact Sanjay via email (sanjay@example.com) or LinkedIn (linkedin.com/in/sanjay-patidar).';
  const recognition = window.SpeechRecognition || window.webkitSpeechRecognition ? new (window.SpeechRecognition || window.webkitSpeechRecognition)() : null;

  function renderMessages() {
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.innerHTML = '';
    messages.forEach(function(msg) {
      const messageDiv = document.createElement('div');
      messageDiv.className = 'chat-message ' + (msg.sender === 'user' ? 'user-message' : 'ai-message');
      messageDiv.dataset.messageId = msg.id;
      let formattedText = formatMarkdown(msg.text);
      messageDiv.innerHTML = '<div class="message-content">' +
        (editingMessageId === msg.id ?
          '<div class="edit-message">' +
            '<input type="text" value="' + editedText.replace(/"/g, '&quot;') + '" oninput="editedText = this.value" onkeypress="if(event.key === \'Enter\') saveEditedMessage(\'' + msg.id + '\')">' +
            '<button onclick="saveEditedMessage(\'' + msg.id + '\')">Save</button>' +
            '<button onclick="cancelEdit()">Cancel</button>' +
          '</div>' :
          formattedText + '<span class="message-timestamp">' + msg.timestamp + '</span>' +
          (msg.sender === 'ai' ? '<button class="speak-btn" onclick="speakMessage(\'' + msg.text.replace(/'/g, '\\\'').replace(/"/g, '&quot;') + '\')">🔊 Speak</button>' : '')) +
        '</div>' +
        '<div class="message-actions">' +
          (msg.sender === 'user' ? '<button class="edit-btn" onclick="startEditing(\'' + msg.id + '\', \'' + msg.text.replace(/'/g, '\\\'').replace(/"/g, '&quot;') + '\')">Edit</button>' : '') +
          '<button class="delete-btn" onclick="deleteMessage(\'' + msg.id + '\')">Delete</button>' +
          '<button class="copy-btn" onclick="copyMessage(\'' + msg.text.replace(/'/g, '\\\'').replace(/"/g, '&quot;') + '\')">Copy</button>' +
        '</div>';
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
    localStorage.setItem('portfolio-chat', JSON.stringify(messages));
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
      const message = messages.find(function(msg) { return msg.id === messageId; });
      if (message) timestamp.textContent = message.timestamp;
    });
  }

  function updateButtonStates() {
    document.querySelector('.clear-btn').disabled = messages.length === 1 && messages[0].id === 'welcome';
    document.querySelector('.export-btn').disabled = messages.length === 1 && messages[0].id === 'welcome';
    document.querySelector('.chat-input-area button:not(.voice-btn)').disabled = isLoading;
    document.querySelectorAll('.suggestion-btn').forEach(function(btn) { btn.disabled = isLoading; });
    const voiceBtn = document.querySelector('.voice-btn');
    if (voiceBtn) voiceBtn.disabled = isLoading || !recognition;
  }

  async function sendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    if (!message || isLoading) return;

    isLoading = true;
    messages.push({ sender: 'user', text: message, id: Date.now(), timestamp: new Date().toLocaleTimeString() });
    input.value = '';
    renderMessages();

    try {
      const fullPrompt = context + '\n\nUser question: ' + message;
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyBTD9ltLvYEDK9MWgTR-71nXt1SsfRzGXI', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: fullPrompt }] }] })
      });

      if (!response.ok) throw new Error('API request failed');
      const data = await response.json();
      const aiResponse = data.candidates[0].content.parts[0].text;

      messages.push({ sender: 'ai', text: aiResponse, id: Date.now(), timestamp: new Date().toLocaleTimeString() });

      if (isAutoReplyEnabled) {
        setTimeout(function() {
          messages.push({
            sender: 'ai',
            text: 'Do you have any more questions about Sanjay’s work or projects?',
            id: Date.now() + 1,
            timestamp: new Date().toLocaleTimeString()
          });
          renderMessages();
        }, 2000);
      }
    } catch (error) {
      messages.push({
        sender: 'ai',
        text: 'Something went wrong. Please try again!',
        id: Date.now(),
        timestamp: new Date().toLocaleTimeString()
      });
    } finally {
      isLoading = false;
      renderMessages();
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
    editedText = text;
    renderMessages();
  }

  function saveEditedMessage(id) {
    if (editedText.trim()) {
      messages = messages.map(function(msg) { return msg.id === id ? { ...msg, text: editedText, timestamp: new Date().toLocaleTimeString() } : msg; });
      sendMessageToBackend(editedText).then(function(response) {
        messages.push({ sender: 'ai', text: response, id: Date.now(), timestamp: new Date().toLocaleTimeString() });
        editingMessageId = null;
        editedText = '';
        renderMessages();
      });
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
    messages = messages.filter(function(msg) { return msg.id !== id; });
    renderMessages();
  }

  function copyMessage(text) {
    navigator.clipboard.writeText(text);
    messages.push({ sender: 'ai', text: 'Message copied!', id: Date.now(), timestamp: new Date().toLocaleTimeString() });
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
    messages = [{
      sender: 'ai',
      text: 'Hello! I\'m your portfolio chatbot. Ask me about Sanjay Patidar\'s projects, skills, or achievements! For example, you can ask about Zedemy LMS, ConnectNow, or his AWS serverless expertise.',
      id: 'welcome',
      timestamp: new Date().toLocaleTimeString()
    }];
    localStorage.removeItem('portfolio-chat');
    renderMessages();
  }

  function toggleAutoReply() {
    isAutoReplyEnabled = !isAutoReplyEnabled;
    document.querySelector('.auto-reply-btn').textContent = 'Auto-Reply: ' + (isAutoReplyEnabled ? 'On' : 'Off');
  }

  function exportChat() {
    const chatText = messages.map(function(msg) { return msg.timestamp + ' [' + (msg.sender === 'user' ? 'You' : 'Chatbot') + ']: ' + msg.text; }).join('\n');
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'portfolio-chat.txt';
    a.click();
    URL.revokeObjectURL(url);
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
      messages.push({
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
        messages.push({
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
  });

  // Expose necessary functions globally for HTML event handlers
  window.handlePromptClick = handlePromptClick;
  window.sendMessage = sendMessage;
  window.toggleTheme = toggleTheme;
  window.toggleHistory = toggleHistory;
  window.adjustFontSize = adjustFontSize;
  window.toggleRecording = toggleRecording;
  window.confirmClearChat = confirmClearChat;
  window.exportChat = exportChat;
  window.toggleAutoReply = toggleAutoReply;
})();
