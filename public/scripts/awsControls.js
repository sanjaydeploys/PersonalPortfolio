try {
  console.log('[AWSControls] Script loaded and parsed');

  const AWSControls = {
    init(controlsId = 'aws-controls') {
      console.log(`[AWSControls] Initializing with controlsId: ${controlsId}`);
      const controls = document.getElementById(controlsId);
      if (!controls) {
        console.error('[AWSControls] Controls container not found');
        return null;
      }

      let currentProject = 'lic';

      const playBtn = controls.querySelector('#play-simulation-btn');
      const pauseBtn = controls.querySelector('#pause-simulation-btn');
      const projectSelect = controls.querySelector('#project-select');

      if (!playBtn || !pauseBtn || !projectSelect) {
        console.error('[AWSControls] Required control elements not found');
        return null;
      }

      const checkDependencies = () => {
        return window.AWSArchitecture && window.AWSDataFlow;
      };

      const startSimulation = () => {
        if (checkDependencies() && window.AWSDataFlow.start) {
          window.AWSDataFlow.start();
          playBtn.disabled = true;
          pauseBtn.disabled = false;
          console.log('[AWSControls] Simulation started');
        } else {
          console.error('[AWSControls] Dependencies not available for start');
        }
      };

      const stopSimulation = () => {
        if (checkDependencies() && window.AWSDataFlow.stop) {
          window.AWSDataFlow.stop();
          playBtn.disabled = false;
          pauseBtn.disabled = true;
          console.log('[AWSControls] Simulation paused');
        } else {
          console.error('[AWSControls] Dependencies not available for stop');
        }
      };

      playBtn.addEventListener('click', startSimulation);
      pauseBtn.addEventListener('click', stopSimulation);
      pauseBtn.disabled = true;

      projectSelect.addEventListener('change', (e) => {
        currentProject = e.target.value;
        if (checkDependencies() && window.AWSArchitecture.setProject) {
          window.AWSArchitecture.setProject(currentProject);
          stopSimulation();
          console.log(`[AWSControls] Switched to ${currentProject}`);
        } else {
          console.error('[AWSControls] Dependencies not available for project switch');
        }
      });

      const getCurrentProject = () => currentProject;

      console.log('[AWSControls] Controls initialized');
      return { startSimulation, stopSimulation, getCurrentProject };
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      console.log('[AWSControls] DOM loaded, initializing');
      window.AWSControls = AWSControls.init();
    });
  } else {
    console.log('[AWSControls] DOM already loaded, initializing');
    window.AWSControls = AWSControls.init();
  }
} catch (error) {
  console.error('[AWSControls] Script-level error:', error);
}
