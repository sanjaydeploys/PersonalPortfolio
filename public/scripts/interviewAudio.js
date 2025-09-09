document.addEventListener('DOMContentLoaded', function () {
  const speakButtons = document.querySelectorAll('.speak-btn');
  let isSpeaking = false;

  // preload voices
  let voices = [];
  function loadVoices() {
    voices = window.speechSynthesis.getVoices();
  }
  loadVoices();
  // Some browsers (like Chrome) load voices asynchronously
  if (typeof speechSynthesis !== 'undefined' && speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = loadVoices;
  }

  // helper to pick a more pleasant voice
  function pickVoice(langCode) {
    if (!voices || !voices.length) return null;

    // Prefer Google or Microsoft natural female voices
    const preferred = voices.find(v =>
      v.lang.toLowerCase().startsWith(langCode.toLowerCase()) &&
      /female|zira|google/i.test(v.name)
    );
    if (preferred) return preferred;

    // fallback: first matching voice for that language
    return voices.find(v => v.lang.toLowerCase().startsWith(langCode.toLowerCase())) || null;
  }

  speakButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const synth = window.speechSynthesis;
      const faqId = button.dataset.faqId;

      const questionEl = document.querySelector(`[aria-controls="${faqId}"]`);
      const visibleQ = questionEl ? questionEl.querySelector('.lang-visible') : null;
      const question = visibleQ ? visibleQ.textContent.trim() : (questionEl ? questionEl.textContent.trim() : '');

      const answerElements = document.querySelectorAll(`#${faqId} p, #${faqId} li`);
      const answer = Array.from(answerElements)
        .map((el) => {
          const visibleSpan = el.querySelector('.lang-visible');
          const txt = visibleSpan ? visibleSpan.textContent.trim() : el.textContent.trim();
          return el.tagName === 'LI' ? txt + '.' : txt;
        })
        .filter((text) => text)
        .join(' ');

      const fullText = `${question} ${answer}`.trim() || 'No text available to read.';

      if (isSpeaking) {
        synth.cancel();
        isSpeaking = false;
        button.textContent = '▶ Play Audio';
        return;
      }

      synth.cancel();
      const utterance = new SpeechSynthesisUtterance(fullText);
      utterance.volume = 1;
      utterance.rate = 0.95; // slight slowdown for pleasant tone
      utterance.pitch = 1;

      // language detection
      const langSpan = document.querySelector(`#${faqId} .lang-visible`);
      const langAttr = langSpan ? langSpan.getAttribute('lang') : 'en';
      const langCode = langAttr === 'hi' ? 'hi-IN' : 'en-IN';
      utterance.lang = langCode;

      // pick nicer voice
      const voice = pickVoice(langCode);
      if (voice) utterance.voice = voice;

      isSpeaking = true;
      button.textContent = '⏸ Pause Audio';

      utterance.onend = utterance.onerror = () => {
        isSpeaking = false;
        button.textContent = '▶ Play Audio';
      };

      synth.speak(utterance);
    });
  });
});
