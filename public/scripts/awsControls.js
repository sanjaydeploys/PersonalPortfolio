const AWSControls = {
  init(services, connections, draw) {
    const playBtn = document.querySelector('.control-btn[data-action="play"]');
    const pauseBtn = document.querySelector('.control-btn[data-action="pause"]');
    const projectSelect = document.querySelector('.control-select[data-action="project"]');

    if (!window.AWSDataFlow) {
      console.error('AWSDataFlow not initialized');
      return;
    }

    playBtn.addEventListener('click', () => {
      window.AWSDataFlow.start();
      playBtn.disabled = true;
      pauseBtn.disabled = false;
    });

    pauseBtn.addEventListener('click', () => {
      window.AWSDataFlow.stop();
      playBtn.disabled = false;
      pauseBtn.disabled = true;
    });

    projectSelect.addEventListener('change', (e) => {
      window.AWSDataFlow.setProject(e.target.value);
      draw();
    });

    // Initialize with pause button disabled
    pauseBtn.disabled = true;
  }
};

window.AWSControls = AWSControls;
