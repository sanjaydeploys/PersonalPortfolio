document.addEventListener('DOMContentLoaded', function() {
  // Inject jsPDF from CDN
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
  script.async = true;
  document.head.appendChild(script);

  // Wait for jsPDF to load before proceeding
  script.onload = function() {
    const { jsPDF } = window.jspdf;
    
    // Target the existing Download PDF button
    const downloadButton = document.querySelector('.download-pdf');
    if (!downloadButton) {
      console.warn('Download PDF button not found');
      return;
    }

    // Function to extract text from elements, respecting language visibility
    function getVisibleText(element) {
      if (!element) return '';
      const visibleSpan = element.querySelector('.lang-visible') || element;
      return visibleSpan.textContent.trim();
    }

    // Function to generate and download PDF
    function generatePDF() {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Set font and styling
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      let yOffset = 20;

      // Add title
      const title = getVisibleText(document.querySelector('.hero-title'));
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text(title, 20, yOffset, { maxWidth: 170 });
      yOffset += 15;

      // Add subtitle
      const subtitle = getVisibleText(document.querySelector('.hero-subtitle'));
      doc.setFontSize(10);
      doc.setFont('helvetica', 'italic');
      doc.text(subtitle, 20, yOffset, { maxWidth: 170 });
      yOffset += 10;

      // Target main content sections
      const sections = document.querySelectorAll('.main-content .section');
      sections.forEach(section => {
        // Section heading
        const heading = getVisibleText(section.querySelector('h2'));
        if (heading) {
          doc.setFontSize(14);
          doc.setFont('helvetica', 'bold');
          doc.text(heading, 20, yOffset, { maxWidth: 170 });
          yOffset += 10;
        }

        // Paragraphs
        const paragraphs = section.querySelectorAll('p');
        paragraphs.forEach(p => {
          const text = getVisibleText(p);
          if (text) {
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.text(text, 20, yOffset, { maxWidth: 170 });
            yOffset += 10;
          }
        });

        // Lists
        const lists = section.querySelectorAll('ul');
        lists.forEach(ul => {
          ul.querySelectorAll('li').forEach(li => {
            const text = getVisibleText(li);
            if (text) {
              doc.setFontSize(10);
              doc.setFont('helvetica', 'normal');
              doc.text(`• ${text}`, 25, yOffset, { maxWidth: 165 });
              yOffset += 8;
            }
          });
        });

        // Blockquotes
        const blockquotes = section.querySelectorAll('blockquote');
        blockquotes.forEach(blockquote => {
          const text = getVisibleText(blockquote);
          if (text) {
            doc.setFontSize(10);
            doc.setFont('helvetica', 'italic');
            doc.text(`"${text}"`, 25, yOffset, { maxWidth: 165 });
            yOffset += 10;
          }
        });

        // Tables
        const tables = section.querySelectorAll('table');
        tables.forEach(table => {
          const headers = Array.from(table.querySelectorAll('thead th')).map(th => getVisibleText(th));
          const rows = Array.from(table.querySelectorAll('tbody tr')).map(row =>
            Array.from(row.querySelectorAll('td')).map(td => getVisibleText(td) || td.textContent.trim())
          );

          if (headers.length) {
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            headers.forEach((header, i) => {
              doc.text(header, 20 + i * 50, yOffset, { maxWidth: 50 });
            });
            yOffset += 8;
          }

          rows.forEach(row => {
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            row.forEach((cell, i) => {
              doc.text(cell, 20 + i * 50, yOffset, { maxWidth: 50 });
            });
            yOffset += 8;
          });
          yOffset += 5;
        });

        yOffset += 5;
        if (yOffset > 270) {
          doc.addPage();
          yOffset = 20;
        }
      });

      // Download the PDF
      doc.save('Sanjay_Patidar_Case_Study.pdf');
    }

    // Attach click event to the download button
    downloadButton.addEventListener('click', (e) => {
      e.preventDefault();
      generatePDF();
    });
  };
});
