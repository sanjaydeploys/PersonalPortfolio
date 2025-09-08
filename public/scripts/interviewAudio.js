document.addEventListener('DOMContentLoaded', function() {
  const speakButtons = document.querySelectorAll('.speak-btn');
  let isSpeaking = false;

  speakButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const synth = window.speechSynthesis;
      const faqId = button.dataset.faqId;
      const question = document.querySelector(`[aria-controls="${faqId}"]`).textContent.trim();
      // Collect text from all <p> and <li> elements within the faq-answer
      const answerElements = document.querySelectorAll(`#${faqId} p, #${faqId} li`);
      // Map and join text content, adding a period for list items to ensure a pause in speech
      const answer = Array.from(answerElements)
        .map((el) => (el.tagName === 'LI' ? el.textContent.trim() + '.' : el.textContent.trim()))
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
      utterance.lang = 'en-IN';

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
