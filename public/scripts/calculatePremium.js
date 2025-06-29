document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.calculator-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const age = parseInt(document.getElementById('age').value);
    const planType = document.getElementById('plan-type').value;
    const sumAssured = parseInt(document.getElementById('sum-assured').value);
    const result = document.getElementById('calc-result');

    if (!age || !sumAssured || age < 18 || age > 80 || sumAssured < 100000) {
      result.textContent = 'Please enter valid inputs.';
      return;
    }

    // Simplified premium calculation
    const baseRate = planType === 'term' ? 0.1 : planType === 'pension' ? 0.15 : planType === 'child' ? 0.12 : 0.18;
    const premium = (sumAssured / 1000) * (age / 10) * baseRate;
    result.textContent = `Estimated Premium: ₹${premium.toFixed(2)}`;
  });
});
