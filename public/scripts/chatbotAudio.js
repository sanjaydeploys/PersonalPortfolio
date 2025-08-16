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
      // Retry if voices aren't loaded after 1 second
      setTimeout(() => {
        if (voices.length === 0) {
          voices = window.speechSynthesis.getVoices();
          resolve(voices);
        }
      }, 1000);
    });
  }

  async function speakMessage(messageId, text) {
    if (!window.speechSynthesis) {
      console.warn('Speech synthesis not supported in this browser.');
      if (window.messages) {
        window.messages.push({
          sender: 'ai',
          text: 'Speech synthesis is not supported in this browser.',
          id: Date.now(),
          timestamp: new Date().toLocaleTimeString()
        });
        window.renderMessages?.();
      }
      return;
    }

    const synth = window.speechSynthesis;
    let state = speechStates.get(messageId) || { isSpeaking: false, isPaused: false, utterance: null, sentences: [], currentChunk: 0 };

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

    state.sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    state.currentChunk = 0;
    speechStates.set(messageId, state);

    async function speakNextChunk() {
      if (state.currentChunk >= state.sentences.length || !speechStates.has(messageId)) {
        speechStates.delete(messageId);
        updateSpeakButton(messageId, false);
        return;
      }

      const utterance = new SpeechSynthesisUtterance();
      utterance.volume = volume;
      utterance.rate = rate;
      utterance.pitch = 1;
      utterance.text = state.sentences[state.currentChunk].trim() || 'No text available.';
      utterance.lang = currentLang === 'hi' ? 'hi-IN' : 'en-IN';

      try {
        voices = await loadVoices();
        let voice = voices.find(v => v.lang.includes(utterance.lang));
        if (!voice && utterance.lang === 'en-IN') {
          // Fallback to en-US or en if en-IN is unavailable
          voice = voices.find(v => v.lang.includes('en-US')) || voices.find(v => v.lang.includes('en'));
        }
        if (voice) {
          utterance.voice = voice;
          state.utterance = utterance;
          state.isSpeaking = true;
          state.isPaused = false;
          speechStates.set(messageId, state);

          utterance.onend = function() {
            if (speechStates.has(messageId)) {
              state.currentChunk++;
              speechStates.set(messageId, state);
              speakNextChunk();
            }
          };

          utterance.onerror = function(event) {
            console.warn('Speech synthesis error: ' + event.error);
            if (window.messages) {
              window.messages.push({
                sender: 'ai',
                text: 'Speech synthesis failed: ' + event.error,
                id: Date.now(),
                timestamp: new Date().toLocaleTimeString()
              });
              window.renderMessages?.();
            }
            if (speechStates.has(messageId)) {
              speechStates.delete(messageId);
              updateSpeakButton(messageId, false);
            }
          };

          synth.speak(utterance);
          updateSpeakButton(messageId, true);
        } else {
          console.warn('Voice for ' + utterance.lang + ' or fallback not available.');
          if (window.messages) {
            window.messages.push({
              sender: 'ai',
              text: 'No suitable voice available for ' + utterance.lang + '. Please check your system’s language settings.',
              id: Date.now(),
              timestamp: new Date().toLocaleTimeString()
            });
            window.renderMessages?.();
          }
          speechStates.delete(messageId);
          updateSpeakButton(messageId, false);
        }
      } catch (error) {
        console.warn('Failed to load voices: ' + error.message);
        if (window.messages) {
          window.messages.push({
            sender: 'ai',
            text: 'Failed to load voices: ' + error.message,
            id: Date.now(),
            timestamp: new Date().toLocaleTimeString()
          });
          window.renderMessages?.();
        }
        speechStates.delete(messageId);
        updateSpeakButton(messageId, false);
      }
    }

    if (speechStates.has(messageId)) {
      synth.cancel();
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
        if (window.messages) {
          const message = window.messages.find(m => m.id === messageId);
          if (message) message.isSpeaking = isSpeaking;
        }
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
        currentLang = button.dataset.lang || 'en';
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
