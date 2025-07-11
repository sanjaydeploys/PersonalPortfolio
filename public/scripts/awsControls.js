const AWSControls = {
  init(container) {
    const playBtn = container.querySelector('#play-simulation-btn');
    const pauseBtn = container.querySelector('#pause-simulation-btn');
    const projectSelect = container.querySelector('#project-select');

    playBtn.addEventListener('click', () => {
      if (window.AWSFlow) AWSFlow.startFlow();
      playBtn.disabled = true;
      pauseBtn.disabled = false;
    });

    pauseBtn.addEventListener('click', () => {
      if (window.AWSFlow) AWSFlow.stopFlow();
      playBtn.disabled = false;
      pauseBtn.disabled = true;
    });

    projectSelect.addEventListener('change', (e) => {
      const project = e.target.value;
      if (window.AWSArchitecture) AWSArchitecture.setProject(project);
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  AWSControls.init(document.getElementById('aws-controls'));
});
