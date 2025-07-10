try {
  console.log('[AWSControls] Script loaded and parsed');

  const AWSControls = {
    init() {
      console.log('[AWSControls] Initializing');

      const getElements = () => {
        const playBtn = document.getElementById('play-simulation-btn');
        const pauseBtn = document.getElementById('pause-simulation-btn');
        const projectSelect = document.getElementById('project-select');
        if (playBtn && pauseBtn && projectSelect) {
          return { playBtn, pauseBtn, projectSelect };
        }
        console.error('[AWSControls] Required control elements not found');
        return null;
      };

      const checkDependencies = () => {
        if (window.AWSArchitecture && typeof window.AWSArchitecture.setProject === 'function' && window.AWSDataFlow) {
          return true;
        }
        console.error('[AWSControls] Dependencies not found');
        return false;
      };

      const start = () => {
        const elements = getElements();
        if (!elements) {
          document.getElementById('aws-fallback').style.display = 'block';
          return;
        }

        const { playBtn, pauseBtn, projectSelect } = elements;

        if (!checkDependencies()) {
          playBtn.disabled = true;
          pauseBtn.disabled = true;
          projectSelect.disabled = true;
          return;
        }

        playBtn.addEventListener('click', () => {
          if (window.AWSDataFlow && window.AWSDataFlow.start) {
            window.AWSDataFlow.start();
            playBtn.disabled = true;
            pauseBtn.disabled = false;
            console.log('[AWSControls] Simulation started');
          }
        });

        pauseBtn.addEventListener('click', () => {
          if (window.AWSDataFlow && window.AWSDataFlow.stop) {
            window.AWSDataFlow.stop();
            playBtn.disabled = false;
            pauseBtn.disabled = true;
            console.log('[AWSControls] Simulation paused');
          }
        });

        projectSelect.addEventListener('change', (e) => {
          const project = e.target.value;
          if (window.AWSArchitecture && window.AWSArchitecture.setProject) {
            window.AWSArchitecture.setProject(project);
            if (window.AWSDataFlow && window.AWSDataFlow.setProject) {
              window.AWSDataFlow.setProject(project);
            }
            console.log(`[AWSControls] Switched to project: ${project}`);
          }
        });

        pauseBtn.disabled = true;
        console.log('[AWSControls] Event listeners attached');
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
