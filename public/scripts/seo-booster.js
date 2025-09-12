document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('automation-btn');
  if (!btn) return;

  btn.addEventListener('click', async () => {
    const originalTextEn = btn.querySelector('[lang="en"]').textContent;
    const originalTextHi = btn.querySelector('[lang="hi"]').textContent;
    btn.disabled = true;
    btn.innerHTML = '<span lang="en" class="lang-hidden">Running...</span><span lang="hi" class="lang-visible">चल रहा है...</span>';

    try {
      const response = await fetch('https://fcukyh2l14.execute-api.ap-south-1.amazonaws.com/prod/run-automation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      const data = await response.json();
      if (data.status === 'started') {
        alert('SEO Booster launched! Check Lambda logs. Runs 5x per query in parallel.');
        setTimeout(() => {
          btn.innerHTML = `<span lang="en" class="lang-hidden">${originalTextEn}</span><span lang="hi" class="lang-visible">${originalTextHi}</span>`;
          btn.disabled = false;
        }, 2000);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      alert('Error: ' + error.message);
      btn.innerHTML = `<span lang="en" class="lang-hidden">${originalTextEn}</span><span lang="hi" class="lang-visible">${originalTextHi}</span>`;
      btn.disabled = false;
    }
  });
});
