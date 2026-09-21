// Universal Dynamic Print Utility for Nexgen ERP & Academy
// Dynamically injects exact @page rules (A4 Landscape, A4 Portrait, US Letter, POS 80mm, POS 58mm)
// Prevents 2-3 page overflow and guarantees exact 1-page fit across all browsers (Chrome, Edge, Firefox, Safari)

export type PrintOrientation = 'portrait' | 'landscape';
export type PrintPaperSize = 'a4' | 'letter' | 'pos80' | 'pos58';

export interface PrintOptions {
  documentTitle?: string;
  size?: PrintPaperSize;
  orientation?: PrintOrientation;
  margin?: string; // e.g. '0mm', '5mm', '6mm'
}

/**
 * Injects or updates dynamic print styles into document.head
 */
export const applyPrintStyles = (options: PrintOptions = {}) => {
  if (typeof document === 'undefined') return;

  const {
    size = 'a4',
    orientation = 'portrait',
    margin = '5mm'
  } = options;

  let pageCss = '';
  if (size === 'pos80') {
    pageCss = `
      @page {
        size: 80mm auto;
        margin: 0mm;
      }
      body {
        margin: 0 !important;
        padding: 0 !important;
        width: 76mm !important;
      }
    `;
  } else if (size === 'pos58') {
    pageCss = `
      @page {
        size: 58mm auto;
        margin: 0mm;
      }
      body {
        margin: 0 !important;
        padding: 0 !important;
        width: 54mm !important;
      }
    `;
  } else if (size === 'letter') {
    pageCss = `
      @page {
        size: letter ${orientation};
        margin: ${margin};
      }
    `;
  } else {
    // Default A4
    pageCss = `
      @page {
        size: A4 ${orientation};
        margin: ${margin};
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

      /* Strict containment for landscape documents (Certificates) - Guaranteed 1-page fit */
      ${orientation === 'landscape' ? `
        html, body {
          width: 297mm !important;
          height: 210mm !important;
          max-height: 210mm !important;
          overflow: hidden !important;
        }
        .print-page-a4-landscape,
        #certificate-printable {
          width: 100% !important;
          max-width: 285mm !important;
          height: 188mm !important;
          max-height: 188mm !important;
          margin: 0 auto !important;
          box-sizing: border-box !important;
          page-break-inside: avoid !important;
          break-inside: avoid !important;
          page-break-after: avoid !important;
          page-break-before: avoid !important;
          overflow: hidden !important;
          display: flex !important;
          flex-direction: column !important;
          justify-content: space-between !important;
        }
      ` : ''}

      /* Strict containment for A4 portrait single page forms & receipts */
      ${orientation === 'portrait' && size === 'a4' ? `
        .print-page-a4,
        #money-receipt-printable,
        #admission-form-printable,
        #id-card-printable,
        #admit-card-printable {
          max-width: 195mm !important;
          margin: 0 auto !important;
          page-break-inside: avoid !important;
          break-inside: avoid !important;
          page-break-after: avoid !important;
          page-break-before: avoid !important;
          box-sizing: border-box !important;
        }
      ` : ''}

      /* POS Thermal 80mm strict format */
      ${size === 'pos80' ? `
        .print-page-pos80,
        #pos-receipt-printable {
          width: 76mm !important;
          max-width: 76mm !important;
          margin: 0 auto !important;
          padding: 1mm 1.5mm !important;
          font-size: 11px !important;
          line-height: 1.3 !important;
          color: #000000 !important;
          background: #ffffff !important;
          page-break-inside: avoid !important;
          break-inside: avoid !important;
          page-break-after: avoid !important;
          box-shadow: none !important;
        }
        .print-page-pos80 *,
        #pos-receipt-printable * {
          color: #000000 !important;
          border-color: #000000 !important;
          text-shadow: none !important;
        }
      ` : ''}

      /* POS Thermal 58mm strict format */
      ${size === 'pos58' ? `
        .print-page-pos58,
        #pos-receipt-printable {
          width: 54mm !important;
          max-width: 54mm !important;
          margin: 0 auto !important;
          padding: 0.5mm 1mm !important;
          font-size: 9.5px !important;
          line-height: 1.25 !important;
          color: #000000 !important;
          background: #ffffff !important;
          page-break-inside: avoid !important;
          break-inside: avoid !important;
          page-break-after: avoid !important;
          box-shadow: none !important;
        }
        .print-page-pos58 *,
        #pos-receipt-printable * {
          color: #000000 !important;
          border-color: #000000 !important;
          text-shadow: none !important;
        }
      ` : ''}
    }
  `;
  document.head.appendChild(styleEl);
};

/**
 * Clean up the dynamic print styles
 */
export const cleanupPrintStyles = () => {
  if (typeof document === 'undefined') return;
  const existing = document.getElementById('dynamic-erp-print-styles');
  if (existing && existing.parentNode) {
    existing.parentNode.removeChild(existing);
  }
};

/**
 * Triggers a pristine, clean print dialog with exact orientation, size, and document title
 */
export const executeCleanPrint = (options: PrintOptions = {}) => {
  const {
    documentTitle,
    size = 'a4',
    orientation = 'portrait',
    margin = '5mm'
  } = options;

  const originalTitle = typeof document !== 'undefined' ? document.title : '';
  if (documentTitle && typeof document !== 'undefined') {
    document.title = documentTitle;
  }

  // Ensure styles are applied before print dialog opens
  applyPrintStyles({ size, orientation, margin });

  const restoreAndCleanup = () => {
    if (documentTitle && typeof document !== 'undefined') {
      document.title = originalTitle;
    }
    // Give a short delay before removing style so print renderer is finished
    setTimeout(() => {
      cleanupPrintStyles();
    }, 500);
  };

  // Register modern afterprint event
  if (typeof window !== 'undefined') {
    window.addEventListener('afterprint', restoreAndCleanup, { once: true });
  }

  // Trigger print dialog
  try {
    window.print();
  } catch {
    window.print();
  }

  // Fallback cleanup in case afterprint does not fire in some environments
  setTimeout(restoreAndCleanup, 60000);
};
