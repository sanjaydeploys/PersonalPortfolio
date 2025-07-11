const AWSControls = {
  init(controls) {
    const playBtn = controls.querySelector('#play-simulation-btn');
    const pauseBtn = controls.querySelector('#pause-simulation-btn');
    const projectSelect = controls.querySelector('#project-select');

    if (!playBtn || !pauseBtn || !projectSelect || !window.AWSArchitecture || !window.AWSDataFlow) {
      console.error('[AWSControls] Required elements or dependencies not found');
      return null;
    }

    const startSimulation = () => {
      if (window.AWSDataFlow && !window.AWSDataFlow.isAnimating()) {
        window.AWSDataFlow.start();
        playBtn.disabled = true;
        pauseBtn.disabled = false;
      }
    };

    const stopSimulation = () => {
      if (window.AWSDataFlow && window.AWSDataFlow.isAnimating()) {
        window.AWSDataFlow.stop();
        playBtn.disabled = false;
        pauseBtn.disabled = true;
      }
    };

    playBtn.addEventListener('click', startSimulation);
    pauseBtn.addEventListener('click', stopSimulation);
    pauseBtn.disabled = true;

    projectSelect.addEventListener('change', (e) => {
      const project = e.target.value;
      if (window.AWSArchitecture && window.AWSArchitecture.setProject) {
        window.AWSArchitecture.setProject(project);
      }
    });

    return { startSimulation, stopSimulation };
  }
};

window.AWSControls = AWSControls;
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.AWSControls.init(document.getElementById('aws-controls'));
  });
} else {
  window.AWSControls.init(document.getElementById('aws-controls'));
}
