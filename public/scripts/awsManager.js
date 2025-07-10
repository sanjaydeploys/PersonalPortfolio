const AWSManager = {
  init() {
    const elements = {
      controls: document.getElementById('aws-controls'),
      canvas: document.getElementById('aws-canvas'),
      tooltip: document.getElementById('aws-tooltip'),
      toggleBtn: document.querySelector('.nav-toggle'),
      menu: document.querySelector('#nav-menu')
    };

    const checkElements = (attempt = 1, maxAttempts = 10) => {
      const missing = Object.entries(elements).filter(([_, el]) => !el);
      if (missing.length === 0) return true;
      if (attempt >= maxAttempts) {
        console.error('[AWSManager] Missing elements:', missing.map(([key]) => key));
        return false;
      }
      return new Promise(resolve => setTimeout(() => resolve(checkElements(attempt + 1)), 500));
    };

    const start = async () => {
      if (!await checkElements()) return;

      window.AWSArchitecture = AWSArchitecture.init(elements.canvas, elements.tooltip);
      window.AWSDataFlow = AWSDataFlow.init(elements.canvas);
      window.AWSControls = AWSControls.init(elements.controls);
      window.AWSTooltip = AWSTooltip.init(elements.canvas, elements.tooltip);
      window.sidebarToggle = sidebarToggle.init(elements.toggleBtn, elements.menu);

      document.dispatchEvent(new CustomEvent('awsInitialized', { detail: { architecture: window.AWSArchitecture, dataFlow: window.AWSDataFlow, controls: window.AWSControls, tooltip: window.AWSTooltip } }));
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', start);
    } else {
      start();
    }
  }
};

window.AWSManager = AWSManager;
AWSManager.init();
