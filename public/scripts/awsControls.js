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

      // Retry mechanism for dependencies
      const checkDependencies = (attempt = 1, maxAttempts = 10) => {
        console.log(`[AWSControls] Checking dependencies, attempt ${attempt}/${maxAttempts}`);
        if (window.AWSDataFlow && window.AWSArchitecture) {
          console.log('[AWSControls] Dependencies available');
          return true;
        }
        if (attempt >= maxAttempts) {
          console.error('[AWSControls] Dependencies not available after 10 attempts');
          return false;
        }
        return new Promise(resolve => setTimeout(() => resolve(checkDependencies(attempt + 1, maxAttempts)), 500));
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

          if (!(await checkDependencies())) {
            console.error('[AWSControls] Aborting: Dependencies not available');
            return;
          }

          playBtn.addEventListener('click', () => {
            console.log('[AWSControls] Play button clicked');
            if (window.AWSDataFlow) {
              window.AWSDataFlow.start();
              playBtn.disabled = true;
              pauseBtn.disabled = false;
              console.log('[AWSControls] Animation started');
            } else {
              console.error('[AWSControls] AWSDataFlow not available');
            }
          });

          pauseBtn.addEventListener('click', () => {
            console.log('[AWSControls] Pause button clicked');
            if (window.AWSDataFlow) {
              window.AWSDataFlow.stop();
              playBtn.disabled = false;
              pauseBtn.disabled = true;
              console.log('[AWSControls] Animation paused');
            } else {
              console.error('[AWSControls] AWSDataFlow not available');
            }
          });

          projectSelect.addEventListener('change', (e) => {
            console.log(`[AWSControls] Project selected: ${e.target.value}`);
            if (window.AWSDataFlow) {
              window.AWSDataFlow.setProject(e.target.value);
              if (window.AWSArchitecture) {
                window.AWSArchitecture.draw();
                console.log('[AWSControls] Architecture redrawn');
              } else {
                console.error('[AWSControls] AWSArchitecture not available');
              }
            } else {
              console.error('[AWSControls] AWSDataFlow not available');
            }
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
