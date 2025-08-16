(function() {
  let currentLang = document.querySelector('.lang-btn.active')?.dataset.lang || 'en';
  let voices = [];
  let speechStates = new Map();
  let volume = 1;
  let rate = 1;

  function loadVoices() {
    return new Promise((resolve) => {
      voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        resolve(voices);
        return;
      }
      window.speechSynthesis.onvoiceschanged = function() {
        voices = window.speechSynthesis.getVoices();
        resolve(voices);
      };
    });
  }

  async function speakMessage(messageId, text, startIndex = 0) {
    if (!window.speechSynthesis) {
      console.warn('Speech synthesis not supported in this browser.');
      return;
    }

    const synth = window.speechSynthesis;
    let state = speechStates.get(messageId) || { isSpeaking: false, isPaused: false, utterance: null, currentChunk: startIndex };

    if (state.isSpeaking && !state.isPaused) {
      synth.pause();
      state.isPaused = true;
      speechStates.set(messageId, state);
      updateSpeakButton(messageId, false);
      return;
    } else if (state.isPaused) {
      synth.resume();
      state.isPaused = false;
      speechStates.set(messageId, state);
      updateSpeakButton(messageId, true);
      return;
    }

    synth.cancel();
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    let currentIndex = startIndex;

    async function speakNextChunk() {
      if (currentIndex >= sentences.length) {
        speechStates.delete(messageId);
        updateSpeakButton(messageId, false);
        return;
      }

      const utterance = new SpeechSynthesisUtterance();
      utterance.volume = volume;
      utterance.rate = rate;
      utterance.pitch = 1;
      utterance.text = sentences[currentIndex].trim() || 'No text available.';
      utterance.lang = currentLang === 'hi' ? 'hi-IN' : 'en-IN';

      try {
        voices = await loadVoices();
        const voice = voices.find(v => v.lang.includes(utterance.lang));
        if (voice) {
          utterance.voice = voice;
          state = { isSpeaking: true, isPaused: false, utterance, currentChunk: currentIndex };
          speechStates.set(messageId, state);
          utterance.onend = function() {
            currentIndex++;
            state.currentChunk = currentIndex;
            speechStates.set(messageId, state);
            speakNextChunk();
          };
          utterance.onerror = function(event) {
            console.warn('Speech synthesis error: ' + event.error);
            speechStates.delete(messageId);
            updateSpeakButton(messageId, false);
          };
          synth.speak(utterance);
          updateSpeakButton(messageId, true);
        } else {
          console.warn('Voice for ' + utterance.lang + ' not available.');
          speechStates.delete(messageId);
          updateSpeakButton(messageId, false);
        }
      } catch (error) {
        console.warn('Failed to load voices: ' + error.message);
        speechStates.delete(messageId);
        updateSpeakButton(messageId, false);
      }
    }

    speakNextChunk();
  }

  function stopAllSpeech() {
    window.speechSynthesis.cancel();
    speechStates.forEach((_, messageId) => {
      updateSpeakButton(messageId, false);
      speechStates.delete(messageId);
    });
  }

  function updateSpeakButton(messageId, isSpeaking) {
    const messageDiv = document.querySelector(`[data-message-id="${messageId}"]`);
    if (messageDiv) {
      const speakBtn = messageDiv.querySelector('.speak-btn');
      if (speakBtn) {
        speakBtn.textContent = isSpeaking ? '⏸ Pause' : '🔊 Play';
        const message = messages.find(m => m.id === messageId);
        if (message) message.isSpeaking = isSpeaking;
      }
    }
  }

  function setSpeechVolume(value) {
    volume = parseFloat(value);
    if (speechStates.size > 0) {
      stopAllSpeech();
    }
  }

  function setSpeechRate(value) {
    rate = parseFloat(value);
    if (speechStates.size > 0) {
      stopAllSpeech();
    }
  }

  function getSpeechVolume() {
    return volume;
  }

  function getSpeechRate() {
    return rate;
  }

  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.lang-btn').forEach(function(button) {
      button.addEventListener('click', function() {
        document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        currentLang = button.dataset.lang;
        stopAllSpeech();
      });
    });
    document.getElementById('volume-control')?.addEventListener('input', function() {
      setSpeechVolume(this.value);
    });
    document.getElementById('rate-control')?.addEventListener('input', function() {
      setSpeechRate(this.value);
    });
    loadVoices();
  });

  window.speakMessage = speakMessage;
  window.toggleSpeak = speakMessage;
  window.stopAllSpeech = stopAllSpeech;
  window.setSpeechVolume = setSpeechVolume;
  window.setSpeechRate = setSpeechRate;
  window.getSpeechVolume = getSpeechVolume;
  window.getSpeechRate = getSpeechRate;
})();
