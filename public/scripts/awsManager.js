const AWSManager = {
  async init() {
    const elements = {
      controls: document.getElementById('aws-controls'),
      canvas: document.getElementById('aws-canvas'),
      tooltip: document.getElementById('aws-tooltip'),
      toggleBtn: document.querySelector('.nav-toggle'),
      menu: document.querySelector('#nav-menu')
    };

    const checkElements = (attempt = 1, maxAttempts = 10) => {
      console.log(`[AWSManager] Checking elements, attempt ${attempt}/${maxAttempts}`);
      const missing = Object.entries(elements).filter(([_, el]) => !el);
      if (missing.length === 0) return true;
      if (attempt >= maxAttempts) {
        console.error('[AWSManager] Missing elements:', missing.map(([key]) => key));
        return false;
      }
      return new Promise(resolve => setTimeout(() => resolve(checkElements(attempt + 1)), 500));
    };

    const loadAndInitModule = async (moduleName, path) => {
      try {
        const module = await import(path);
        if (!module.default) {
          throw new Error(`[AWSManager] ${moduleName} default export not found`);
        }
        console.log(`[AWSManager] ${moduleName} loaded successfully`);
        return module.default;
      } catch (error) {
        console.error(`[AWSManager] Failed to load ${moduleName}:`, error);
        return null;
      }
    };

    const start = async () => {
      if (!await checkElements()) return;

      const [AWSArchitectureModule, AWSDataFlowModule, AWSControlsModule, AWSTooltipModule, sidebarToggleModule] = await Promise.all([
        loadAndInitModule('AWSArchitecture', '/public/scripts/awsArchitecture.js'),
        loadAndInitModule('AWSDataFlow', '/public/scripts/awsDataFlow.js'),
        loadAndInitModule('AWSControls', '/public/scripts/awsControls.js'),
        loadAndInitModule('AWSTooltip', '/public/scripts/awsTooltip.js'),
        loadAndInitModule('sidebarToggle', '/public/scripts/sidebarToggle.js')
      ]);

      window.AWSArchitecture = AWSArchitectureModule ? AWSArchitectureModule.init(elements.canvas, elements.tooltip) : null;
      window.AWSDataFlow = AWSDataFlowModule ? AWSDataFlowModule.init(elements.canvas) : null;
      window.AWSControls = AWSControlsModule ? AWSControlsModule.init(elements.controls) : null;
      window.AWSTooltip = AWSTooltipModule ? AWSTooltipModule.init(elements.canvas, elements.tooltip) : null;
      window.sidebarToggle = sidebarToggleModule ? sidebarToggleModule.init(elements.toggleBtn, elements.menu) : null;

      if (!window.AWSArchitecture || !window.AWSDataFlow || !window.AWSControls || !window.AWSTooltip || !window.sidebarToggle) {
        console.error('[AWSManager] One or more components failed to initialize');
      } else {
        document.dispatchEvent(new CustomEvent('awsInitialized', { 
          detail: { 
            architecture: window.AWSArchitecture, 
            dataFlow: window.AWSDataFlow, 
            controls: window.AWSControls, 
            tooltip: window.AWSTooltip 
          } 
        }));
        console.log('[AWSManager] All components initialized');
      }
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => start().catch(err => console.error('[AWSManager] Initialization error:', err)));
    } else {
      start().catch(err => console.error('[AWSManager] Initialization error:', err));
    }
  }
};

window.AWSManager = AWSManager;
AWSManager.init();
