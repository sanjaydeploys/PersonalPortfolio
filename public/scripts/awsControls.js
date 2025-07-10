const AWSControls = {
  init(services, connections, draw) {
    console.log('[AWSControls] Initializing');
    const playBtn = document.querySelector('.control-btn[data-action="play"]');
    const pauseBtn = document.querySelector('.control-btn[data-action="pause"]');
    const projectSelect = document.querySelector('.control-select[data-action="project"]');

    if (!playBtn || !pauseBtn || !projectSelect) {
      console.error('[AWSControls] Control elements not found:', { playBtn, pauseBtn, projectSelect });
      return;
    }

    if (!window.AWSDataFlow) {
      console.error('[AWSControls] AWSDataFlow not initialized');
      return;
    }

    playBtn.addEventListener('click', () => {
      console.log('[AWSControls] Play button clicked');
      window.AWSDataFlow.start();
      playBtn.disabled = true;
      pauseBtn.disabled = false;
    });

    pauseBtn.addEventListener('click', () => {
      console.log('[AWSControls] Pause button clicked');
      window.AWSDataFlow.stop();
      playBtn.disabled = false;
      pauseBtn.disabled = true;
    });

    projectSelect.addEventListener('change', (e) => {
      console.log(`[AWSControls] Project selected: ${e.target.value}`);
      window.AWSDataFlow.setProject(e.target.value);
      draw();
    });

    pauseBtn.disabled = true;
    console.log('[AWSControls] Initialized with pause button disabled');
  }
};

window.AWSControls = AWSControls;
