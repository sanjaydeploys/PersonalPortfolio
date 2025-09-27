// pro-chatbot.js (updated frontend for better STT handling, lang detection, auto-send, and realtime feel)
document.addEventListener('DOMContentLoaded', () => {
  const proCta = document.getElementById('pro-chat-cta');
  const overlay = document.getElementById('pro-chat-overlay');
  const closeBtn = document.getElementById('pro-chat-close');
  const input = document.getElementById('pro-chat-input');
  const sendBtn = document.getElementById('pro-chat-send');
  const voiceBtn = document.getElementById('pro-chat-voice');
  const messagesDiv = document.getElementById('pro-chat-messages');

  let isRecording = false;
  let silenceTimer;
  let ws;
  let sessionID = crypto.randomUUID();
  let currentLang = detectBrowserLanguage(); // Improved lang detection
  let lastTranscript = '';
  let reconnectAttempts = 0;
  const MAX_RECONNECT_ATTEMPTS = 5; // Increased for better reliability

  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.continuous = true;
  recognition.interimResults = true; // Changed to true for realtime transcription display

  function detectBrowserLanguage() {
    const lang = navigator.language || navigator.userLanguage || 'en-US';
    return lang.startsWith('hi') ? 'hi' : 'en'; // Auto-detect based on browser, fix Hindi issue
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
    }, 1000); // Reduced delay for faster feel
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
    input.value = transcript; // Update in realtime
    if (!event.results[event.results.length - 1].isFinal) return; // Wait for final
    if (transcript !== lastTranscript) {
      lastTranscript = transcript;
      resetSilenceTimer();
    }
  };

  recognition.onend = () => {
    if (isRecording) {
      recognition.start(); // Auto-restart for continuous
    }
  };

  recognition.onspeechend = () => {
    silenceTimer = setTimeout(() => {
      if (isRecording && input.value.trim()) {
        sendVoiceMessage(); // Auto-send after silence
      }
    }, 1500); // Reduced to 1.5s for faster response
  };

  recognition.onerror = (event) => {
    console.error('STT Error:', event.error);
    if (event.error === 'no-speech' || event.error === 'aborted') return; // Ignore minor
    addMessage('system', 'Signal interference detected. Retry.');
    stopRecording();
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
    transmitSignal(text, true); // Flag as voice for potential backend handling
    // Do not stop recording here; keep continuous for realtime speech-to-speech
  }

  function transmitSignal(text, isVoice = false) {
    addMessage('system', 'Transmitting Signal to InterUniverse...');
    console.log(`Sending: { text: "${text}", lang: "${currentLang}", sessionID: "${sessionID}", isVoice: ${isVoice} }`);
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ text, lang: currentLang, sessionID, isVoice }));
      setTimeout(() => {
        if (!document.querySelector('.pro-chat-message.ai:last-of-type')) {
          addMessage('system', 'Response delayed. Retrying...');
          initWebSocket();
        }
      }, 3000); // Reduced timeout for faster retry
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
        speakResponse(data.text);
        displayAIInsight(data.text);
      }
    };
    ws.onerror = (error) => {
      console.error('WS error:', error);
      addMessage('system', 'Link disrupted. Reconnecting...');
      reconnectAttempts++;
      setTimeout(initWebSocket, 500); // Faster retry
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

  function speakResponse(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = currentLang === 'hi' ? 'hi-IN' : 'en-US';
    utterance.volume = 1;
    utterance.rate = 1.0; // Adjusted for natural speed
    utterance.pitch = 1.0;
    utterance.onend = () => {
      if (isRecording) recognition.start(); // Resume listening after TTS for true two-way
    };
    window.speechSynthesis.speak(utterance);
  }

  function displayAIInsight(text) {
    // Simplified to overlay div for better UX, no new window to avoid pop-up blockers
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
