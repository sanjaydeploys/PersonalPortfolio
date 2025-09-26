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
  let pollInterval;
  let sessionID = crypto.randomUUID();
  let currentLang = localStorage.getItem('chat-lang') || 'en';
  let lastTranscript = '';

  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.continuous = true;
  recognition.interimResults = false; // Disable interim results to avoid duplicates

  proCta.addEventListener('click', (e) => {
    e.preventDefault();
    sessionID = crypto.randomUUID();
    overlay.classList.remove('hidden');
    overlay.classList.add('visible');
    addMessage('system', 'Establishing InterUniverse Connection...');
    setTimeout(() => addMessage('system', 'Ready for Query.'), 1500);
  });

  closeBtn.addEventListener('click', () => {
    overlay.classList.remove('visible');
    setTimeout(() => overlay.classList.add('hidden'), 500);
    stopRecording();
    stopPolling();
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
    }, 3000); // 3s silence threshold
  };

  recognition.onerror = (event) => {
    console.error('STT Error:', event.error);
    addMessage('system', 'Voice input error. Please try again.');
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
      addMessage('system', 'Voice input active. Speak your query.');
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
    }, 3000);
  }

  async function sendTextMessage() {
    const text = input.value.trim();
    if (!text) return;
    addMessage('user', text);
    input.value = '';
    addMessage('system', 'Processing your query...');
    await sendQuery(text);
  }

  async function sendVoiceMessage() {
    const text = input.value.trim();
    if (!text || text === lastTranscript) return;
    addMessage('user', text);
    input.value = '';
    addMessage('system', 'Processing your voice query...');
    await sendQuery(text);
    stopRecording();
  }

  async function sendQuery(text) {
    try {
      const response = await fetch('https://gj48940cgb.execute-api.ap-south-1.amazonaws.com/prod/api/pro-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionID, query: text, lang: currentLang })
      });
      if (response.ok) {
        startPolling();
      } else {
        addMessage('system', 'Query processing failed. Please try again.');
      }
    } catch (error) {
      console.error('Send Error:', error);
      addMessage('system', 'Connection lost. Please try again.');
    }
  }

  function startPolling() {
    addMessage('system', 'Searching for response...');
    pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`https://gj48940cgb.execute-api.ap-south-1.amazonaws.com/prod/api/pro-chat?sessionID=${sessionID}`);
        const data = await response.json();
        if (data.status === 'ready') {
          addMessage('system', 'Response received.');
          setTimeout(() => {
            addMessage('ai', data.text);
            speakResponse(data.text);
            openCodeEditor(data.text);
          }, 1000);
          stopPolling();
        } else if (data.status === 'processing') {
          addMessage('system', 'Generating response...');
        }
      } catch (error) {
        console.error('Poll Error:', error);
        addMessage('system', 'Response retrieval failed.');
        stopPolling();
      }
    }, 1000);
  }

  function stopPolling() {
    clearInterval(pollInterval);
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

  function openCodeEditor(text) {
    let editor = window.open('', 'CodeEditor', 'width=600,height=400');
    if (editor && !editor.closed && editor.document) {
      editor.document.write(`
        <html><body style="background: #1e1e1e; color: #d4d4d4; font-family: Consolas;">
          <h2 style="text-align: center;">InterUniverse Response</h2>
          <pre style="padding: 10px;">${text.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
          <button onclick="window.close()">Close</button>
        </body></html>
      `);
      editor.document.close();
    } else {
      const editorDiv = document.createElement('div');
      editorDiv.className = 'pro-chat-editor';
      editorDiv.innerHTML = `
        <div style="background: #1e1e1e; color: #d4d4d4; padding: 15px; border-radius: 5px; margin: 10px 0;">
          <h3>InterUniverse Response</h3>
          <pre style="padding: 10px;">${text.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
          <button onclick="this.parentElement.remove()">Close</button>
        </div>
      `;
      messagesDiv.appendChild(editorDiv);
      messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }
  }
});
