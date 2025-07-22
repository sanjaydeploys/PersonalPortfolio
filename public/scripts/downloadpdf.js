document.addEventListener('DOMContentLoaded', function () {
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js';
  script.async = true;
  script.onload = function () {
    const downloadButton = document.querySelector('.download-pdf');
    if (!downloadButton) return;

    downloadButton.addEventListener('click', async function (e) {
      e.preventDefault();

      const { PDFDocument, rgb, StandardFonts } = window.pdfLib;

      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage();
      const { width, height } = page.getSize();

      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const fontSize = 12;
      let y = height - 50;

      const addText = (text, bold = false) => {
        const lineHeight = 18;
        page.drawText(text, {
          x: 50,
          y,
          size: fontSize,
          font,
          color: rgb(0, 0, 0),
        });
        y -= lineHeight;
        if (y < 50) {
          page = pdfDoc.addPage();
          y = height - 50;
        }
      };

      const extractText = (selector) => {
        const el = document.querySelector(selector);
        const visibleSpan = el?.querySelector('.lang-visible') || el;
        return visibleSpan?.textContent.trim() || '';
      };

      // Title & subtitle
      addText(extractText('.hero-title'));
      addText(extractText('.hero-subtitle'));

      // Sections
      document.querySelectorAll('.main-content .section').forEach((section) => {
        const h2 = extractText('h2');
        if (h2) addText(h2);

        section.querySelectorAll('p').forEach((p) => {
          const txt = extractText(p);
          if (txt) addText(txt);
        });

        section.querySelectorAll('li').forEach((li) => {
          const txt = extractText(li);
          if (txt) addText(`• ${txt}`);
        });

        section.querySelectorAll('blockquote').forEach((bq) => {
          const txt = extractText(bq);
          if (txt) addText(`"${txt}"`);
        });
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'Sanjay_Patidar_Case_Study.pdf';
      link.click();
    });
  };
  document.head.appendChild(script);
});
