document.addEventListener('DOMContentLoaded', function () {
  const downloadButton = document.querySelector('.download-pdf');
  if (!downloadButton) return;

  downloadButton.addEventListener('click', async function (e) {
    e.preventDefault();

    const { PDFDocument, rgb, StandardFonts } = window.pdfLib;

    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage();
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
      const el = typeof selector === 'string' ? document.querySelector(selector) : selector;
      const visibleSpan = el?.querySelector('.lang-visible') || el;
      return visibleSpan?.textContent.trim() || '';
    };

    addText(extractText('.hero-title'));
    addText(extractText('.hero-subtitle'));

    document.querySelectorAll('.main-content .section').forEach((section) => {
      const h2 = section.querySelector('h2');
      if (h2) addText(extractText(h2));

      section.querySelectorAll('p, li, blockquote').forEach((el) => {
        const txt = extractText(el);
        if (txt) addText(el.tagName === 'LI' ? `• ${txt}` : txt);
      });
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Sanjay_Patidar_Case_Study.pdf';
    link.click();
  });
});
