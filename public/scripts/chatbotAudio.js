(function() {
  let isSpeaking = false;
  let currentLang = document.querySelector('.lang-btn.active')?.dataset.lang || 'en';

  function speakMessage(text) {
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

    isSpeaking = true;
    utterance.onend = function() {
      isSpeaking = false;
    };

    synth.onvoiceschanged = function() {
      const voices = synth.getVoices();
      const voice = voices.find(function(v) { return v.lang === utterance.lang; });
      if (voice) {
        utterance.voice = voice;
        synth.speak(utterance);
      } else {
        console.warn('Voice for ' + utterance.lang + ' not available.');
        isSpeaking = false;
      }
    };

    synth.getVoices();
    synth.speak(utterance);
  }

  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.lang-btn').forEach(function(button) {
      button.addEventListener('click', function() {
        currentLang = button.dataset.lang;
        if (isSpeaking) {
          window.speechSynthesis.cancel();
          isSpeaking = false;
        }
      });
    });
  });

  window.speakMessage = speakMessage;
})();
