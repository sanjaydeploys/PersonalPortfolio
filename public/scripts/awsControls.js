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
          return Promise.resolve();
        }
        if (attempt >= maxAttempts) {
          console.error('[AWSControls] Dependencies not available after 10 attempts');
          return Promise.reject(new Error('Dependencies not found'));
        }
        return new Promise(resolve => setTimeout(() => resolve(checkDependencies(attempt + 1, maxAttempts)), 500));
      };

      const start = async () => {
        try {
          const elements = await getElements();
          if (!elements) return;

          const { playBtn, pauseBtn, projectSelect } = elements;

          await checkDependencies().catch(err => {
            console.error('[AWSControls] Dependency check failed:', err);
            playBtn.disabled = true;
            pauseBtn.disabled = true;
            projectSelect.disabled = true;
          });

          playBtn.addEventListener('click', () => {
            console.log('[AWSControls] Play button clicked');
            if (window.AWSDataFlow && window.AWSDataFlow.start) {
              window.AWSDataFlow.start();
              playBtn.disabled = true;
              pauseBtn.disabled = false;
              console.log('[AWSControls] Animation started');
            } else {
              console.error('[AWSControls] AWSDataFlow.start not available, retrying');
              if (window.AWSArchitecture && window.AWSArchitecture.setProject) {
                window.AWSArchitecture.setProject(projectSelect.value);
              }
            }
          });

          pauseBtn.addEventListener('click', () => {
            console.log('[AWSControls] Pause button clicked');
            if (window.AWSDataFlow && window.AWSDataFlow.stop) {
              window.AWSDataFlow.stop();
              playBtn.disabled = false;
              pauseBtn.disabled = true;
              console.log('[AWSControls] Animation paused');
            }
          });

          projectSelect.addEventListener('change', (e) => {
            const project = e.target.value;
            console.log(`[AWSControls] Project selected: ${project}`);
            if (window.AWSArchitecture && window.AWSArchitecture.setProject) {
              window.AWSArchitecture.setProject(project);
              if (window.AWSDataFlow && window.AWSDataFlow.setProject) {
                window.AWSDataFlow.setProject(project);
              }
              console.log('[AWSControls] Architecture and data flow updated');
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
