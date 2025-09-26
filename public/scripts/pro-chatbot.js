// pro-chatbot.js (public/scripts/pro-chatbot.js, include <script src="/public/scripts/pro-chatbot.js" defer></script> in HTML)
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
  let sessionID = crypto.randomUUID(); // Unique session per open
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.continuous = true;
  recognition.interimResults = true;

  proCta.addEventListener('click', (e) => {
    e.preventDefault();
    overlay.classList.remove('hidden');
    overlay.classList.add('visible');
    addMessage('system', 'Establishing InterUniverse Connection...');
    setTimeout(() => addMessage('system', 'Signal Established. Ready for Professional Query.'), 1500);
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
      .join('');
    input.value = transcript;
    resetSilenceTimer();
  };

  recognition.onend = () => {
    if (isRecording) recognition.start(); // Restart for continuous
  };

  recognition.onspeechend = () => {
    silenceTimer = setTimeout(() => {
      if (isRecording && input.value.trim()) sendTextMessage();
    }, 2500);
  };

  recognition.onerror = (event) => {
    console.error('STT Error:', event.error);
    addMessage('system', 'Signal Interference in Voice Transmission. Retry.');
  };

  function toggleVoice() {
    if (isRecording) {
      stopRecording();
    } else {
      recognition.start();
      isRecording = true;
      voiceBtn.classList.add('recording');
      addMessage('system', 'Voice Signal Transmission Active... Speak Your Query.');
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
      if (isRecording && input.value.trim()) sendTextMessage();
    }, 2500);
  }

  async function sendTextMessage() {
    const text = input.value.trim();
    if (!text) return;
    addMessage('user', text);
    input.value = '';
    addMessage('system', 'Sending Signal to AI Universe... Please Wait.');
    try {
      const response = await fetch('https://gj48940cgb.execute-api.ap-south-1.amazonaws.com/prod/api/pro-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionID, query: text })
      });
      if (response.ok) {
        startPolling();
      } else {
        addMessage('system', 'Signal Failed. Retry Transmission.');
      }
    } catch (error) {
      console.error('Send Error:', error);
      addMessage('system', 'Universe Connection Lost. Retry.');
    }
  }

  function startPolling() {
    addMessage('system', 'Scanning for Response Signal...');
    pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`https://gj48940cgb.execute-api.ap-south-1.amazonaws.com/prod/api/pro-chat?sessionID=${sessionID}`);
        const data = await response.json();
        if (data.status === 'ready') {
          addMessage('ai', data.text);
          speakResponse(data.text);
          stopPolling();
          sessionID = crypto.randomUUID(); // New session for next query
        } else if (data.status === 'processing') {
          // Optional: Update system message if needed
        } else {
          addMessage('system', 'No Signal Yet. Continuing Scan.');
        }
      } catch (error) {
        console.error('Poll Error:', error);
        addMessage('system', 'Signal Disruption. Aborting Scan.');
        stopPolling();
      }
    }, 2000); // Poll every 2s
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
    utterance.volume = 1;
    utterance.rate = 1.1;
    utterance.pitch = 1.2;
    window.speechSynthesis.speak(utterance);
  }
});
