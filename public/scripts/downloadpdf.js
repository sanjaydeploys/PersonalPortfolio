// /scripts/downloadpdf.js
document.addEventListener('DOMContentLoaded', () => {
  const button = document.querySelector('.download-pdf');
  if (!button) return;

  // Wait until pdf-lib is ready
  const waitForPdfLib = () => {
    return new Promise((resolve, reject) => {
      const check = () => {
        if (window.PDFLib) resolve(window.PDFLib);
        else setTimeout(check, 50);
      };
      check();
    });
  };

  button.addEventListener('click', async () => {
    const PDFLib = await waitForPdfLib();
    const { PDFDocument, StandardFonts, rgb } = PDFLib;

    const doc = await PDFDocument.create();
    let page = doc.addPage();
    const { width, height } = page.getSize();
    const font = await doc.embedFont(StandardFonts.Helvetica);
    let y = height - 50;

    const drawText = (text) => {
      page.drawText(text, {
        x: 50,
        y,
        size: 12,
        font,
        color: rgb(0, 0, 0)
      });
      y -= 20;
      if (y < 50) {
        page = doc.addPage();
        y = height - 50;
      }
    };

    // ✨ Collect text from .hero and .main-content
    const addSection = (selector) => {
      const el = document.querySelector(selector);
      if (!el) return;
      const text = el.textContent?.trim();
      if (text) {
        drawText(text);
      }
    };

    addSection('.hero-title');
    addSection('.hero-subtitle');

    document.querySelectorAll('.main-content .section').forEach((section) => {
      const h2 = section.querySelector('h2');
      if (h2) drawText(h2.textContent.trim());

      section.querySelectorAll('p, li').forEach((el) => {
        const line = el.textContent.trim();
        if (line) drawText(line);
      });
    });

    const pdfBytes = await doc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'Sanjay_Patidar_Case_Study.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  });
});
