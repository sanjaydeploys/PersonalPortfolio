try {
  console.log('[AWSControls] Script loaded and parsed');

  const AWSControls = {
    init() {
      console.log('[AWSControls] Initializing');

      // Retry mechanism for DOM elements
      const getElements = (attempt = 1, maxAttempts = 10) => {
        console.log(`[AWSControls] Checking for control elements, attempt ${attempt}/${maxAttempts}`);
        const playBtn = document.getElementById('play-simulation-btn');
        const pauseBtn = document.getElementById('pause-simulation-btn');
        const projectSelect = document.getElementById('project-select');
        if (playBtn && pauseBtn && projectSelect) {
          console.log('[AWSControls] Found all control elements');
          return { playBtn, pauseBtn, projectSelect };
        }
        if (attempt >= maxAttempts) {
          console.error('[AWSControls] Failed to find control elements after 10 attempts');
          return null;
        }
        return new Promise(resolve => setTimeout(() => resolve(getElements(attempt + 1, maxAttempts)), 500));
      };

      // Initialize controls
      const start = async () => {
        try {
          const elements = await getElements();
          if (!elements) {
            console.error('[AWSControls] Aborting: Control elements not found');
            return;
          }
          const { playBtn, pauseBtn, projectSelect } = elements;

          if (!window.AWSDataFlow || !window.AWSArchitecture) {
            console.error('[AWSControls] Dependencies not initialized:', {
              AWSDataFlow: !!window.AWSDataFlow,
              AWSArchitecture: !!window.AWSArchitecture
            });
            return;
          }

          playBtn.addEventListener('click', () => {
            console.log('[AWSControls] Play button clicked');
            window.AWSDataFlow.start();
            playBtn.disabled = true;
            pauseBtn.disabled = false;
          });

          pauseBtn.addEventListener('click', () => {
            console.log('[AWSControls] Pause button clicked');
            window.AWSDataFlow.stop();
            playBtn.disabled = false;
            pauseBtn.disabled = true;
          });

          projectSelect.addEventListener('change', (e) => {
            console.log(`[AWSControls] Project selected: ${e.target.value}`);
            window.AWSDataFlow.setProject(e.target.value);
            window.AWSArchitecture.draw();
          });

          pauseBtn.disabled = true;
          console.log('[AWSControls] Event listeners attached, pause button disabled');
        } catch (error) {
          console.error('[AWSControls] Initialization error:', error);
        }
      };

      // Start initialization
      console.log('[AWSControls] Checking document ready state');
      if (document.readyState === 'loading') {
        console.log('[AWSControls] Waiting for DOMContentLoaded');
        document.addEventListener('DOMContentLoaded', () => {
          console.log('[AWSControls] DOMContentLoaded fired');
          start();
        });
      } else {
        console.log('[AWSControls] DOM already loaded, starting immediately');
        start();
      }
    }
  };

  window.AWSControls = AWSControls;
  console.log('[AWSControls] Initializing immediately');
  AWSControls.init(); // Call init immediately
} catch (error) {
  console.error('[AWSControls] Script-level error:', error);
}
