// pro-chatbot.js (public/scripts/pro-chatbot.js)
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
  let currentLang = localStorage.getItem('chat-lang') || 'en';
  let lastTranscript = '';
  let reconnectAttempts = 0;
  const MAX_RECONNECT_ATTEMPTS = 3;

  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.continuous = true;
  recognition.interimResults = false;

  proCta.addEventListener('click', (e) => {
    e.preventDefault();
    sessionID = crypto.randomUUID(); // New session on each open
    overlay.classList.remove('hidden');
    overlay.classList.add('visible');
    addMessage('system', 'Initiating InterUniverse Portal...');
    setTimeout(() => {
      addMessage('system', 'Portal Active. Send Your Signal.');
      initWebSocket();
    }, 1500);
  });

  closeBtn.addEventListener('click', () => {
    overlay.classList.remove('visible');
    setTimeout(() => overlay.classList.add('hidden'), 500);
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
    if (transcript !== lastTranscript) {
      input.value = transcript;
      lastTranscript = transcript;
      resetSilenceTimer();
    }
  };

  recognition.onend = () => {
    if (isRecording) recognition.start();
  };

  recognition.onspeechend = () => {
    silenceTimer = setTimeout(() => {
      if (isRecording && input.value.trim() && input.value !== lastTranscript) {
        sendVoiceMessage();
      }
    }, 2000); // 2s silence threshold
  };

  recognition.onerror = (event) => {
    console.error('STT Error:', event.error);
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
      if (isRecording && input.value.trim() && input.value !== lastTranscript) {
        sendVoiceMessage();
      }
    }, 2000);
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
    if (!text || text === lastTranscript) return;
    addMessage('user', text);
    input.value = '';
    transmitSignal(text);
    stopRecording();
  }

  function transmitSignal(text) {
    addMessage('system', 'Transmitting Signal to InterUniverse...');
    console.log(`Sending message: { text: "${text}", lang: "${currentLang}", sessionID: "${sessionID}" }`);
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ text, lang: currentLang, sessionID }));
      setTimeout(() => {
        if (!document.querySelector('.pro-chat-message.ai')) {
          addMessage('system', 'InterUniverse response delayed. Retrying...');
          initWebSocket();
        }
      }, 5000); // 5s timeout
    } else {
      addMessage('system', 'InterUniverse link disrupted. Reconnecting...');
      initWebSocket();
    }
  }

  function initWebSocket() {
    if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
      addMessage('system', 'Failed to connect to InterUniverse after multiple attempts.');
      return;
    }
    console.log(`Attempting to connect to wss://coc9wnbdbe.execute-api.ap-south-1.amazonaws.com/prod/, attempt ${reconnectAttempts + 1}`);
    ws = new WebSocket('wss://coc9wnbdbe.execute-api.ap-south-1.amazonaws.com/prod/');
    ws.onopen = () => {
      console.log('Connected to InterUniverse with sessionID:', sessionID);
      reconnectAttempts = 0; // Reset on successful connection
    };
    ws.onmessage = (event) => {
      console.log('Received message from InterUniverse:', event.data);
      const data = JSON.parse(event.data);
      if (data.text) {
        setTimeout(() => {
          addMessage('ai', data.text);
          speakResponse(data.text);
          displayAIInsight(data.text);
        }, 500); // Simulate decoding delay
      }
    };
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      addMessage('system', 'InterUniverse link disrupted. Reconnecting...');
      reconnectAttempts++;
      setTimeout(initWebSocket, 1000); // Retry after 1s
    };
    ws.onclose = () => {
      console.log('WebSocket disconnected');
      addMessage('system', 'InterUniverse portal closed. Reopen to reconnect.');
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
    utterance.rate = 1.1;
    utterance.pitch = 1.2;
    window.speechSynthesis.speak(utterance);
  }

  function displayAIInsight(text) {
    const editor = window.open('', 'AIInsight', 'width=700,height=500');
    if (editor && !editor.closed && editor.document) {
      editor.document.write(`
        <html><body style="background: #0a0a23; color: #e6e6fa; font-family: 'Courier New', monospace; padding: 20px;">
          <h1 style="text-align: center; color: #00ffcc;">InterUniverse AI Insight</h1>
          <div style="border: 2px solid #00ffcc; padding: 15px; border-radius: 10px;">
            <pre style="white-space: pre-wrap; color: #e6e6fa;">${text.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
          </div>
          <button onclick="window.close()" style="background: #00ffcc; color: #0a0a23; padding: 10px; border: none; cursor: pointer;">Close Portal</button>
        </body></html>
      `);
      editor.document.close();
    } else {
      const insightDiv = document.createElement('div');
      insightDiv.className = 'ai-insight';
      insightDiv.innerHTML = `
        <div style="background: #0a0a23; color: #e6e6fa; padding: 15px; border-radius: 10px; margin: 10px 0; border: 2px solid #00ffcc;">
          <h3>InterUniverse AI Insight</h3>
          <pre style="white-space: pre-wrap; color: #e6e6fa;">${text.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
          <button onclick="this.parentElement.remove()" style="background: #00ffcc; color: #0a0a23; padding: 5px; border: none; cursor: pointer;">Close</button>
        </div>
      `;
      messagesDiv.appendChild(insightDiv);
      messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }
  }
});
