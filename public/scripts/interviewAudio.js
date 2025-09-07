document.addEventListener('DOMContentLoaded', function() {
  const speakButtons = document.querySelectorAll('.speak-btn');
  let isSpeaking = false;

  speakButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const synth = window.speechSynthesis;
      const faqId = button.dataset.faqId;
      const question = document.querySelector(`[aria-controls="${faqId}"]`).textContent.trim();
      const answer = document.querySelector(`#${faqId} p`).textContent.trim();
      const fullText = `${question} ${answer}`;

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
      utterance.text = fullText || 'No text available to read.';
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
