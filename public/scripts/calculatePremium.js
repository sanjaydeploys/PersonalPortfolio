(function () {
  console.log('[calculatePremium.js] Script loaded');

  function waitForElement(selector, callback, maxAttempts = 10, interval = 100) {
    let attempts = 0;
    const check = () => {
      const element = document.querySelector(selector);
      if (element) {
        console.log(`[calculatePremium.js] Found element: ${selector}`);
        callback(element);
      } else if (attempts < maxAttempts) {
        attempts++;
        console.log(`[calculatePremium.js] Waiting for ${selector}, attempt ${attempts}`);
        setTimeout(check, interval);
      } else {
        console.error(`[calculatePremium.js] Element ${selector} not found after ${maxAttempts} attempts`);
      }
    };
    check();
  }

  function initializeCalculator() {
    waitForElement('.calculator-form', (form) => {
      waitForElement('#calc-result', (resultElement) => {
        window.calculatePremium = () => {
          const age = parseInt(document.getElementById('age').value);
          const planType = document.getElementById('plan-type').value;
          const sumAssured = parseInt(document.getElementById('sum-assured').value);

          if (!age || !sumAssured || age < 18 || age > 80 || sumAssured < 100000) {
            resultElement.textContent = 'Please enter valid age (18–80) and sum assured (minimum ₹100,000).';
            console.log('[calculatePremium.js] Invalid input');
            return;
          }

          const baseRate = { term: 0.02, pension: 0.015, child: 0.018, ulips: 0.025 };
          const premium = sumAssured * baseRate[planType] * (1 + (age - 18) / 100);
          resultElement.textContent = `Estimated Annual Premium: ₹${Math.round(premium).toLocaleString('en-IN')}`;
          console.log('[calculatePremium.js] Premium calculated:', premium);
        };

        form.addEventListener('submit', (e) => {
          e.preventDefault();
          window.calculatePremium();
        });
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      console.log('[calculatePremium.js] DOMContentLoaded fired');
      initializeCalculator();
    });
  } else {
    console.log('[calculatePremium.js] Document already loaded, initializing');
    initializeCalculator();
  }
})();
