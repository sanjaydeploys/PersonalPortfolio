document.addEventListener('DOMContentLoaded', function() {
  const speakButtons = document.querySelectorAll('.speak-btn');
  let isSpeaking = false;

  speakButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const synth = window.speechSynthesis;
      const faqId = button.dataset.faqId;

      // Find the question and answer parts — only from the currently visible language
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
      const utterance = new SpeechSynthesisUtterance();
      utterance.volume = 1;
      utterance.rate = 0.9; // Slightly slower for clarity
      utterance.pitch = 1;
      utterance.text = fullText;

      // Detect language by checking which span is visible
      const langSpan = document.querySelector(`#${faqId} .lang-visible`);
      const langAttr = langSpan ? langSpan.getAttribute('lang') : 'en';
      utterance.lang = langAttr === 'hi' ? 'hi-IN' : 'en-IN';

      isSpeaking = true;
      button.textContent = '⏸ Pause Audio';

      utterance.onend = () => {
        isSpeaking = false;
        button.textContent = '▶ Play Audio';
      };

      utterance.onerror = () => {
        isSpeaking = false;
        button.textContent = '▶ Play Audio';
      };

      synth.speak(utterance);
    });
  });
});
