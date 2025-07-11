// Updated awsControls.js
const AWSControls = {
  init(container) {
    const playBtn = container.querySelector('#play-simulation-btn');
    const pauseBtn = container.querySelector('#pause-simulation-btn');
    const projectSelect = container.querySelector('#project-select');
    const zoomInBtn = container.querySelector('#zoom-in-btn');
    const zoomOutBtn = container.querySelector('#zoom-out-btn');

    playBtn.addEventListener('click', () => {
      window.AWSFlow?.startFlow();
      playBtn.disabled = true;
      pauseBtn.disabled = false;
    });

    pauseBtn.addEventListener('click', () => {
      window.AWSFlow?.stopFlow();
      playBtn.disabled = false;
      pauseBtn.disabled = true;
    });

    projectSelect.addEventListener('change', (e) => {
      const project = e.target.value;
      window.AWSArchitecture?.setProject(project);
    });

    if (zoomInBtn) {
      zoomInBtn.addEventListener('click', () => {
        window.AWSArchitecture.scale *= 1.1;
        window.AWSArchitecture.scale = Math.min(3.0, window.AWSArchitecture.scale);
        window.AWSArchitecture.render();
      });
    }

    if (zoomOutBtn) {
      zoomOutBtn.addEventListener('click', () => {
        window.AWSArchitecture.scale *= 0.9;
        window.AWSArchitecture.scale = Math.max(0.5, window.AWSArchitecture.scale);
        window.AWSArchitecture.render();
      });
    }
  },

  getCurrentProject() {
    return document.querySelector('#project-select')?.value || 'lic';
  }
};

document.addEventListener('DOMContentLoaded', () => {
  AWSControls.init(document.getElementById('aws-controls'));
});
