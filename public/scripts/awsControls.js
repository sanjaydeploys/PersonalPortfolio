const AWSControls = {
  init(controls) {
    let currentProject = 'lic';

    const playBtn = controls.querySelector('#play-simulation-btn');
    const pauseBtn = controls.querySelector('#pause-simulation-btn');
    const projectSelect = controls.querySelector('#project-select');

    if (!playBtn || !pauseBtn || !projectSelect) {
      console.error('[AWSControls] Required control elements not found');
      return null;
    }

    const startSimulation = () => {
      if (window.AWSDataFlow && window.AWSDataFlow.start) {
        window.AWSDataFlow.start();
        playBtn.disabled = true;
        pauseBtn.disabled = false;
      }
    };

    const stopSimulation = () => {
      if (window.AWSDataFlow && window.AWSDataFlow.stop) {
        window.AWSDataFlow.stop();
        playBtn.disabled = false;
        pauseBtn.disabled = true;
      }
    };

    playBtn.addEventListener('click', startSimulation);
    pauseBtn.addEventListener('click', stopSimulation);
    pauseBtn.disabled = true;

    projectSelect.addEventListener('change', (e) => {
      currentProject = e.target.value;
      if (window.AWSArchitecture && window.AWSArchitecture.setProject) {
        window.AWSArchitecture.setProject(currentProject);
      }
    });

    const getCurrentProject = () => currentProject;

    return { startSimulation, stopSimulation, getCurrentProject };
  }
};
