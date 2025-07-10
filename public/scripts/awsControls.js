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
      if (window.AWSArchitecture && window.AWSDataFlow && typeof window.AWSArchitecture.setProject === 'function') {
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
        }
      });

      pauseBtn.addEventListener('click', () => {
        if (window.AWSDataFlow && window.AWSDataFlow.stop) {
          window.AWSDataFlow.stop();
          playBtn.disabled = false;
          pauseBtn.disabled = true;
        }
      });

      projectSelect.addEventListener('change', (e) => {
        const project = e.target.value;
        if (window.AWSArchitecture && window.AWSArchitecture.setProject) {
          window.AWSArchitecture.setProject(project);
          if (window.AWSDataFlow && window.AWSDataFlow.setProject) {
            window.AWSDataFlow.setProject(project);
          }
        }
      });

      pauseBtn.disabled = true;
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', start);
    } else {
      start();
    }
  }
};

if (typeof window !== 'undefined') {
  window.AWSControls = AWSControls;
  AWSControls.init();
}
