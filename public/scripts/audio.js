document.addEventListener('DOMContentLoaded', function() {
  const speakButton = document.querySelector('.speak-btn');
  let currentLang = document.querySelector('.lang-btn.active')?.dataset.lang || 'hi';
  let isSpeaking = false;

  if (speakButton) {
    speakButton.addEventListener('click', () => {
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

      const heroSection = document.querySelector('.hero-section');
      const visibleText = Array.from(heroSection.querySelectorAll(`[lang="${currentLang}"].lang-visible`))
        .map(el => el.textContent.trim())
        .filter(text => text.length > 0)
        .join('. ');

      utterance.text = visibleText || 'No text available to read.';
      utterance.lang = currentLang === 'hi' ? 'hi-IN' : 'en-IN';

      isSpeaking = true;
      utterance.onend = () => {
        isSpeaking = false;
      };

      synth.onvoiceschanged = () => {
        const voices = synth.getVoices();
        const voice = voices.find(v => v.lang === utterance.lang);
        if (voice) {
          utterance.voice = voice;
          synth.speak(utterance);
        } else {
          console.warn(`Voice for ${utterance.lang} not available.`);
          isSpeaking = false;
        }
      };

      synth.getVoices();
      synth.speak(utterance);
    });
  }

  // Update currentLang on language change
  document.querySelectorAll('.lang-btn').forEach(button => {
    button.addEventListener('click', () => {
      currentLang = button.dataset.lang;
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        isSpeaking = false;
      }
    });
  });
});
