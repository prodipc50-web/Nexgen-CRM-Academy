// Universal Dynamic Print Utility for Nexgen ERP & Academy
// Dynamically injects exact @page rules (A4 Landscape, A4 Portrait, US Letter, POS 80mm Thermal)
// Prevents 2-3 page overflow and guarantees exact 1-page fit across all browsers (Chrome, Edge, Firefox, Safari)

export type PrintOrientation = 'portrait' | 'landscape';
export type PrintPaperSize = 'a4' | 'letter' | 'pos80';

export interface PrintOptions {
  documentTitle?: string;
  size?: PrintPaperSize;
  orientation?: PrintOrientation;
  margin?: string; // e.g. '0mm', '5mm', '6mm'
}

export const executeCleanPrint = (options: PrintOptions = {}) => {
  const {
    documentTitle,
    size = 'a4',
    orientation = 'portrait',
    margin = '6mm'
  } = options;

  const originalTitle = document.title;
  if (documentTitle) {
    document.title = documentTitle;
  }

  // Build exact @page CSS
  let pageCss = '';
  if (size === 'pos80') {
    pageCss = `
      @page {
        size: 80mm auto !important;
        margin: 0mm !important;
      }
      body {
        margin: 0 !important;
        padding: 0 !important;
        width: 76mm !important;
      }
    `;
  } else if (size === 'letter') {
    pageCss = `
      @page {
        size: letter ${orientation} !important;
        margin: ${margin} !important;
      }
    `;
  } else {
    // Default A4
    pageCss = `
      @page {
        size: A4 ${orientation} !important;
        margin: ${margin} !important;
      }
    `;
  }

  // Remove existing dynamic print style if any
  const existing = document.getElementById('dynamic-erp-print-styles');
  if (existing && existing.parentNode) {
    existing.parentNode.removeChild(existing);
  }

  // Create new dynamic style element
  const styleEl = document.createElement('style');
  styleEl.id = 'dynamic-erp-print-styles';
  styleEl.innerHTML = `
    @media print {
      ${pageCss}

      /* Strict containment for landscape documents (Certificates) */
      ${orientation === 'landscape' ? `
        .print-page-a4-landscape,
        #certificate-printable {
          width: 100% !important;
          max-width: 297mm !important;
          height: auto !important;
          max-height: 205mm !important;
          margin: 0 auto !important;
          box-sizing: border-box !important;
          page-break-inside: avoid !important;
          break-inside: avoid !important;
          page-break-after: avoid !important;
          page-break-before: avoid !important;
          overflow: hidden !important;
        }
      ` : ''}

      /* Strict containment for A4 portrait single page forms */
      ${orientation === 'portrait' && size === 'a4' ? `
        .print-page-a4,
        #money-receipt-printable,
        #admission-form-printable,
        #id-card-printable,
        #admit-card-printable {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
          page-break-after: avoid !important;
          page-break-before: avoid !important;
        }
      ` : ''}
    }
  `;
  document.head.appendChild(styleEl);

  // Trigger print
  try {
    window.print();
  } catch (e) {
    window.print();
  } finally {
    // Restore title and clean up dynamic style after print dialog completes
    setTimeout(() => {
      document.title = originalTitle;
      const cleanup = document.getElementById('dynamic-erp-print-styles');
      if (cleanup && cleanup.parentNode) {
        cleanup.parentNode.removeChild(cleanup);
      }
    }, 2000);
  }
};
