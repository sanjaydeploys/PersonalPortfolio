// pro-chatbot.js (updated frontend for language selection to fix Hindi issue, continuous listening for two-way speech-to-speech, auto-send on silence, improved reconnection)
// Added language selector buttons for EN/HI to allow user choice, default to 'en' to fix English speaking issue.
// Kept continuous recording, resume after TTS. Simplified insight to div only.
document.addEventListener('DOMContentLoaded', () => {
  const proCta = document.getElementById('pro-chat-cta');
  const overlay = document.getElementById('pro-chat-overlay');
  const closeBtn = document.getElementById('pro-chat-close');
  const input = document.getElementById('pro-chat-input');
  const sendBtn = document.getElementById('pro-chat-send');
  const voiceBtn = document.getElementById('pro-chat-voice');
  const messagesDiv = document.getElementById('pro-chat-messages');

  // Add language selector
  const langSelector = document.createElement('div');
  langSelector.id = 'lang-selector';
  langSelector.innerHTML = `
    <button id="lang-en" class="lang-btn active">EN</button>
    <button id="lang-hi" class="lang-btn">HI</button>
  `;
  overlay.insertBefore(langSelector, input.parentElement); // Insert before input

  let isRecording = false;
  let silenceTimer;
  let ws;
  let sessionID = crypto.randomUUID();
  let currentLang = 'en'; // Default to English to fix issue
  let lastTranscript = '';
  let reconnectAttempts = 0;
  const MAX_RECONNECT_ATTEMPTS = 5;

  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.continuous = true;
  recognition.interimResults = true;

  // Language button listeners
  document.getElementById('lang-en').addEventListener('click', () => setLanguage('en'));
  document.getElementById('lang-hi').addEventListener('click', () => setLanguage('hi'));

  function setLanguage(lang) {
    currentLang = lang;
    document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`lang-${lang}`).classList.add('active');
    if (isRecording) {
      recognition.stop();
      recognition.lang = currentLang === 'hi' ? 'hi-IN' : 'en-US';
      recognition.start();
    }
    addMessage('system', `Language set to ${lang.toUpperCase()}.`);
  }

  proCta.addEventListener('click', (e) => {
    e.preventDefault();
    sessionID = crypto.randomUUID();
    overlay.classList.remove('hidden');
    overlay.classList.add('visible');
    addMessage('system', 'Initiating InterUniverse Portal...');
    setTimeout(() => {
      addMessage('system', 'Portal Active. Send Your Signal.');
      initWebSocket();
    }, 1000);
  });

  closeBtn.addEventListener('click', () => {
    overlay.classList.remove('visible');
    setTimeout(() => overlay.classList.add('hidden'), 300);
    stopRecording();
    if (ws) ws.close();
  });

  sendBtn.addEventListener('click', sendTextMessage);

  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendTextMessage();
  });

  voiceBtn.addEventListener('click', toggleVoice);

  recognition.onresult = (event) => {
    const transcript = Array.from(event.results)
      .map(result => result[0].transcript)
      .join('')
      .trim();
    input.value = transcript;
    if (!event.results[event.results.length - 1].isFinal) return;
    if (transcript !== lastTranscript) {
      lastTranscript = transcript;
      resetSilenceTimer();
    }
  };

  recognition.onend = () => {
    if (isRecording) {
      setTimeout(() => recognition.start(), 100); // Slight delay to avoid errors
    }
  };

  recognition.onspeechend = () => {
    silenceTimer = setTimeout(() => {
      if (isRecording && input.value.trim()) {
        sendVoiceMessage();
      }
    }, 1500);
  };

  recognition.onerror = (event) => {
    console.error('STT Error:', event.error);
    if (event.error !== 'no-speech' && event.error !== 'aborted') {
      addMessage('system', 'Signal interference detected. Retry.');
      stopRecording();
    }
  };

  function toggleVoice() {
    if (isRecording) {
      stopRecording();
    } else {
      recognition.lang = currentLang === 'hi' ? 'hi-IN' : 'en-US';
      input.value = '';
      lastTranscript = '';
      recognition.start();
      isRecording = true;
      voiceBtn.classList.add('recording');
      addMessage('system', 'Voice Signal Engaged. Speak to the Universe.');
    }
  }

  function stopRecording() {
    recognition.stop();
    isRecording = false;
    voiceBtn.classList.remove('recording');
    clearTimeout(silenceTimer);
  }

  function resetSilenceTimer() {
    clearTimeout(silenceTimer);
    silenceTimer = setTimeout(() => {
      if (isRecording && input.value.trim()) {
        sendVoiceMessage();
      }
    }, 1500);
  }

  function sendTextMessage() {
    const text = input.value.trim();
    if (!text) return;
    addMessage('user', text);
    input.value = '';
    transmitSignal(text);
  }

  function sendVoiceMessage() {
    const text = input.value.trim();
    if (!text) return;
    addMessage('user', text);
    input.value = '';
    lastTranscript = '';
    transmitSignal(text, true);
    // Keep recording for two-way conversation
  }

  function transmitSignal(text, isVoice = false) {
    addMessage('system', 'Transmitting Signal to InterUniverse...');
    console.log(`Sending: { text: "${text}", lang: "${currentLang}", sessionID: "${sessionID}", isVoice: ${isVoice} }`);
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ text, lang: currentLang, sessionID, isVoice }));
    } else {
      addMessage('system', 'Link disrupted. Reconnecting...');
      initWebSocket();
    }
  }

  function initWebSocket() {
    if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
      addMessage('system', 'Failed to connect after attempts. Check network.');
      return;
    }
    console.log(`Connecting to wss://coc9wnbdbe.execute-api.ap-south-1.amazonaws.com/prod/, attempt ${reconnectAttempts + 1}`);
    ws = new WebSocket('wss://coc9wnbdbe.execute-api.ap-south-1.amazonaws.com/prod/');
    ws.onopen = () => {
      console.log('Connected with sessionID:', sessionID);
      reconnectAttempts = 0;
      addMessage('system', 'InterUniverse Linked. Ready for Realtime Signals.');
    };
    ws.onmessage = (event) => {
      console.log('Received:', event.data);
      const data = JSON.parse(event.data);
      if (data.text) {
        addMessage('ai', data.text);
        speakResponse(data.text, data.lang || currentLang);
        displayAIInsight(data.text);
      }
    };
    ws.onerror = (error) => {
      console.error('WS error:', error);
      addMessage('system', 'Link disrupted. Reconnecting...');
      reconnectAttempts++;
      setTimeout(initWebSocket, 500);
    };
    ws.onclose = () => {
      console.log('WS disconnected');
      addMessage('system', 'Portal closed. Reopen to reconnect.');
    };
  }

  function addMessage(sender, text) {
    const div = document.createElement('div');
    div.className = `pro-chat-message ${sender}`;
    div.textContent = text;
    messagesDiv.appendChild(div);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }

  function speakResponse(text, lang) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-US';
    utterance.volume = 1;
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    // Pause recognition during TTS to avoid echo/feedback
    if (isRecording) recognition.stop();
    utterance.onend = () => {
      if (isRecording) recognition.start();
    };
    window.speechSynthesis.speak(utterance);
  }

  function displayAIInsight(text) {
    const insightDiv = document.createElement('div');
    insightDiv.className = 'ai-insight';
    insightDiv.style = 'background: rgba(0, 255, 204, 0.1); border: 1px solid #00ffcc; padding: 10px; margin: 10px 0; border-radius: 5px;';
    insightDiv.innerHTML = `
      <h4 style="color: #00ffcc;">AI Insight</h4>
      <p style="color: #e6e6fa;">${text.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
      <button onclick="this.parentElement.remove()" style="background: #00ffcc; color: #0a0a23; padding: 5px; border: none; cursor: pointer;">Close</button>
    `;
    messagesDiv.appendChild(insightDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }
});
