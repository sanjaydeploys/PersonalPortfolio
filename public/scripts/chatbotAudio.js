(function() {
  let isSpeaking = false;
  let currentLang = document.querySelector('.lang-btn.active')?.dataset.lang || 'en';
  let voices = [];

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

  async function speakMessage(text) {
    if (!window.speechSynthesis) {
      console.warn('Speech synthesis not supported in this browser.');
      return;
    }

    const synth = window.speechSynthesis;
    if (isSpeaking) {
      synth.cancel();
      isSpeaking = false;
      return;
    }

    synth.cancel();
    const utterance = new SpeechSynthesisUtterance();
    utterance.volume = 1;
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.text = text || 'No text available to read.';
    utterance.lang = currentLang === 'hi' ? 'hi-IN' : 'en-IN';

    try {
      voices = await loadVoices();
      const voice = voices.find(function(v) { return v.lang.includes(utterance.lang); });
      if (voice) {
        utterance.voice = voice;
        isSpeaking = true;
        utterance.onend = function() {
          isSpeaking = false;
        };
        utterance.onerror = function(event) {
          console.warn('Speech synthesis error: ' + event.error);
          isSpeaking = false;
        };
        synth.speak(utterance);
      } else {
        console.warn('Voice for ' + utterance.lang + ' not available.');
        isSpeaking = false;
      }
    } catch (error) {
      console.warn('Failed to load voices: ' + error.message);
      isSpeaking = false;
    }
  }

  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.lang-btn').forEach(function(button) {
      button.addEventListener('click', function() {
        document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        currentLang = button.dataset.lang;
        if (isSpeaking) {
          window.speechSynthesis.cancel();
          isSpeaking = false;
        }
      });
    });
    // Preload voices to ensure availability
    loadVoices();
  });

  window.speakMessage = speakMessage;
})();
