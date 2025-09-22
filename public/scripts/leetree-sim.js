(function () {
  window.Leetree = window.Leetree || {};
  window.LeetreeSim = (function () {
    const simulations = {};
    let currentSim = null;
    let canvas, ctx;
    const isMobile = window.Leetree.isMobile;
    const animationsEnabled = () => window.Leetree.animationsEnabled;

    function init() {
      canvas = document.createElement('canvas');
      canvas.id = 'leetree-sim-canvas';
      canvas.style.position = 'fixed';
      canvas.style.top = '50px';
      canvas.style.left = '50%';
      canvas.style.transform = 'translateX(-50%)';
      canvas.style.zIndex = '1000';
      canvas.style.border = '1px solid #000';
      canvas.style.background = '#fff';
      canvas.style.display = 'none';
      document.body.appendChild(canvas);
      ctx = canvas.getContext('2d');

      setupControls();
      setupNodeClickHandlers();

      window.addEventListener('leetree:animationsToggled', (e) => {
        if (currentSim && !e.detail.animationsEnabled) {
          pauseSimulation();
        }
      });
    }

    function setupNodeClickHandlers() {
      let attempts = 0;
      const maxAttempts = 20;
      function trySetup() {
        let ready = true;
        window.Leetree.nodes.forEach((node) => {
          if (node.type !== 'leaf' || !simulations[node.id]) return;
          if (!node.el) {
            ready = false;
            return;
          }
          const el = node.el;
          if (!el.dataset.clickHandlerSet) {
            el.addEventListener('click', (e) => {
              if (e.target.tagName !== 'A') {
                console.log(`Starting simulation for ${node.id}`);
                startSimulation(node.id);
              }
            });
            el.dataset.clickHandlerSet = 'true';
          }
        });
        if (!ready && attempts < maxAttempts) {
          attempts++;
          console.log(`Retrying node click handlers, attempt ${attempts}`);
          setTimeout(trySetup, 100);
        }
      }
      trySetup();
    }

    function setupControls() {
      const controls = document.createElement('div');
      controls.id = 'leetree-sim-controls';
      controls.style.position = 'fixed';
      controls.style.bottom = '20px';
      controls.style.left = '50%';
      controls.style.transform = 'translateX(-50%)';
      controls.style.zIndex = '1000';
      controls.style.display = 'none';
      controls.style.background = '#f0f0f0';
      controls.style.padding = '10px';
      controls.style.borderRadius = '5px';
      controls.innerHTML = `
        <button id="sim-play-pause">Play</button>
        <button id="sim-step-forward">Step Forward</button>
        <button id="sim-step-backward">Step Backward</button>
        <button id="sim-close">Close</button>
      `;
      document.body.appendChild(controls);

      document.getElementById('sim-play-pause').addEventListener('click', togglePlayPause);
      document.getElementById('sim-step-forward').addEventListener('click', stepForward);
      document.getElementById('sim-step-backward').addEventListener('click', stepBackward);
      document.getElementById('sim-close').addEventListener('click', closeSimulation);
    }

    function startSimulation(problemId) {
      if (!simulations[problemId]) {
        console.warn(`No simulation defined for ${problemId}`);
        return;
      }
      currentSim = { id: problemId, state: simulations[problemId].init() };
      canvas.width = isMobile ? window.innerWidth - 40 : 800;
      canvas.height = isMobile ? 200 : 300;
      canvas.style.display = 'block';
      document.getElementById('leetree-sim-controls').style.display = 'block';
      simulations[problemId].render(currentSim.state);
      console.log(`Simulation started for ${problemId}`);
    }

    function pauseSimulation() {
      if (currentSim && currentSim.state.interval) {
        clearInterval(currentSim.state.interval);
        currentSim.state.interval = null;
        document.getElementById('sim-play-pause').textContent = 'Play';
      }
    }

    function togglePlayPause() {
      if (!currentSim) return;
      if (currentSim.state.interval) {
        pauseSimulation();
      } else if (animationsEnabled()) {
        currentSim.state.interval = setInterval(() => {
          simulations[currentSim.id].step(currentSim.state);
          simulations[currentSim.id].render(currentSim.state);
        }, 1000);
        document.getElementById('sim-play-pause').textContent = 'Pause';
      }
    }

    function stepForward() {
      if (!currentSim || !animationsEnabled()) return;
      pauseSimulation();
      simulations[currentSim.id].step(currentSim.state);
      simulations[currentSim.id].render(currentSim.state);
    }

    function stepBackward() {
      if (!currentSim || !animationsEnabled()) return;
      pauseSimulation();
      simulations[currentSim.id].stepBack(currentSim.state);
      simulations[currentSim.id].render(currentSim.state);
    }

    function closeSimulation() {
      if (currentSim) {
        pauseSimulation();
        canvas.style.display = 'none';
        document.getElementById('leetree-sim-controls').style.display = 'none';
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        currentSim = null;
      }
    }

    // Simulation for Container With Most Water (LC11)
    simulations['container-water'] = {
      init: () => ({
        heights: [1, 8, 6, 2, 5, 4, 8, 3, 7],
        left: 0,
        right: 8,
        maxArea: 0,
        currentArea: 0,
        stepHistory: [],
        interval: null
      }),
      step: (state) => {
        if (state.left >= state.right) {
          pauseSimulation();
          return;
        }
        const height = Math.min(state.heights[state.left], state.heights[state.right]);
        const width = state.right - state.left;
        state.currentArea = height * width;
        state.maxArea = Math.max(state.maxArea, state.currentArea);
        state.stepHistory.push({ left: state.left, right: state.right, currentArea: state.currentArea });
        if (state.heights[state.left] < state.heights[state.right]) {
          state.left++;
        } else {
          state.right--;
        }
      },
      stepBack: (state) => {
        if (state.stepHistory.length > 0) {
          const lastStep = state.stepHistory.pop();
          state.left = lastStep.left;
          state.right = lastStep.right;
          state.currentArea = lastStep.currentArea;
          state.maxArea = Math.max(...state.stepHistory.map(s => s.currentArea).concat(state.currentArea));
        }
      },
      render: (state) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const barWidth = canvas.width / state.heights.length;
        const maxHeight = Math.max(...state.heights);
        const scaleY = (canvas.height - 20) / maxHeight;

        // Draw bars
        state.heights.forEach((h, i) => {
          ctx.fillStyle = i === state.left || i === state.right ? '#ff7b7b' : '#ccc';
          ctx.fillRect(i * barWidth, canvas.height - h * scaleY, barWidth - 2, h * scaleY);
        });

        // Draw water area
        if (state.left < state.right) {
          ctx.fillStyle = 'rgba(0, 123, 255, 0.3)';
          const height = Math.min(state.heights[state.left], state.heights[state.right]) * scaleY;
          ctx.fillRect((state.left + 1) * barWidth, canvas.height - height, (state.right - state.left - 1) * barWidth, height);
        }

        // Draw labels
        ctx.fillStyle = '#000';
        ctx.font = isMobile ? '12px Arial' : '16px Arial';
        ctx.fillText(`Area: ${state.currentArea}`, 10, 20);
        ctx.fillText(`Max Area: ${state.maxArea}`, 10, 40);
      }
    };

    return {
      init,
      startSimulation,
      pauseSimulation,
      togglePlayPause,
      stepForward,
      stepBackward,
      closeSimulation
    };
  })();

  window.LeetreeSim.init();
})();
