document.addEventListener('DOMContentLoaded', () => {
  const downloadButton = document.querySelector('.download-pdf');
  if (!downloadButton || !window.pdfLib) return;

  downloadButton.addEventListener('click', async (e) => {
    e.preventDefault();

    const { PDFDocument, rgb, StandardFonts } = window.pdfLib;

    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage();
    const { width, height } = page.getSize();

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 12;
    let y = height - 50;

    const addText = (text) => {
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

    const extractText = (el) => {
      if (!el) return '';
      const visibleSpan = el.querySelector('.lang-visible') || el;
      return visibleSpan.textContent.trim() || '';
    };

    // Title & Subtitle
    addText(extractText(document.querySelector('.hero-title')));
    addText(extractText(document.querySelector('.hero-subtitle')));

    // Content
    document.querySelectorAll('.main-content .section').forEach((section) => {
      const h2 = section.querySelector('h2');
      if (h2) addText(extractText(h2));

      section.querySelectorAll('p, li, blockquote').forEach((el) => {
        const text = extractText(el);
        if (text) {
          const prefix = el.tagName === 'LI' ? '• ' : el.tagName === 'BLOCKQUOTE' ? '"': '';
          const suffix = el.tagName === 'BLOCKQUOTE' ? '"' : '';
          addText(`${prefix}${text}${suffix}`);
        }
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
