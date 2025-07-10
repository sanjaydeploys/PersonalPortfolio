try {
  console.log('[AWSControls] Script loaded and parsed');

  const AWSControls = {
    init() {
      console.log('[AWSControls] Initializing');

      const getElements = (attempt = 1, maxAttempts = 10) => {
        console.log(`[AWSControls] Checking for control elements, attempt ${attempt}/${maxAttempts}`);
        const playBtn = document.getElementById('play-simulation-btn');
        const pauseBtn = document.getElementById('pause-simulation-btn');
        const projectSelect = document.getElementById('project-select');
        if (playBtn && pauseBtn && projectSelect) {
          return { playBtn, pauseBtn, projectSelect };
        }
        if (attempt >= maxAttempts) {
          console.error('[AWSControls] Failed to find control elements after 10 attempts');
          return null;
        }
        return new Promise(resolve => setTimeout(() => resolve(getElements(attempt + 1, maxAttempts)), 500));
      };

      const checkDependencies = (attempt = 1, maxAttempts = 10) => {
        console.log(`[AWSControls] Checking dependencies, attempt ${attempt}/${maxAttempts}`);
        if (window.AWSDataFlow && window.AWSArchitecture) {
          return true;
        }
        if (attempt >= maxAttempts) {
          console.error('[AWSControls] Dependencies not available after 10 attempts');
          return false;
        }
        return new Promise(resolve => setTimeout(() => resolve(checkDependencies(attempt + 1, maxAttempts)), 500));
      };

      const start = async () => {
        try {
          const elements = await getElements();
          if (!elements) return;

          const { playBtn, pauseBtn, projectSelect } = elements;

          if (!(await checkDependencies())) {
            console.error('[AWSControls] Aborting: Dependencies not available');
            playBtn.disabled = true;
            pauseBtn.disabled = true;
            projectSelect.disabled = true;
            return;
          }

          if (!(window.AWSDataFlow && typeof window.AWSDataFlow.start === 'function')) {
            console.error('[AWSControls] AWSDataFlow.start not available:', window.AWSDataFlow);
            playBtn.disabled = true;
            pauseBtn.disabled = true;
            projectSelect.disabled = true;
            return;
          }

          playBtn.addEventListener('click', () => {
            console.log('[AWSControls] Play button clicked');
            if (window.AWSDataFlow.start) {
              window.AWSDataFlow.start();
              playBtn.disabled = true;
              pauseBtn.disabled = false;
              console.log('[AWSControls] Animation started');
            }
          });

          pauseBtn.addEventListener('click', () => {
            console.log('[AWSControls] Pause button clicked');
            if (window.AWSDataFlow.stop) {
              window.AWSDataFlow.stop();
              playBtn.disabled = false;
              pauseBtn.disabled = true;
              console.log('[AWSControls] Animation paused');
            }
          });

          projectSelect.addEventListener('change', (e) => {
            console.log(`[AWSControls] Project selected: ${e.target.value}`);
            if (window.AWSDataFlow.setProject) {
              window.AWSDataFlow.setProject(e.target.value);
              if (window.AWSArchitecture.draw) {
                window.AWSArchitecture.draw();
                console.log('[AWSControls] Architecture redrawn');
              }
            }
          });

          pauseBtn.disabled = true;
          console.log('[AWSControls] Event listeners attached, pause button disabled');
        } catch (error) {
          console.error('[AWSControls] Initialization error:', error);
        }
      };

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
      } else {
        start();
      }
    }
  };

  window.AWSControls = AWSControls;
  console.log('[AWSControls] Initializing immediately');
  AWSControls.init();
} catch (error) {
  console.error('[AWSControls] Script-level error:', error);
}
