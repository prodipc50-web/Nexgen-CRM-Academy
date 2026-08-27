/**
 * Safe clipboard copy utility with robust fallback for iframes and restricted browser environments
 */
export async function copyToClipboardSafe(text: string): Promise<boolean> {
  if (!text) return false;

  // Method 1: Modern navigator.clipboard API
  if (typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.warn('navigator.clipboard.writeText failed, attempting fallback...', err);
    }
  }

  // Method 2: Fallback using temporary textarea element (works in iframes without direct clipboard permission)
  if (typeof document !== 'undefined') {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.left = '-999999px';
      textarea.style.top = '-999999px';
      textarea.setAttribute('readonly', '');
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();

      const successful = document.execCommand('copy');
      document.body.removeChild(textarea);
      return successful;
    } catch (fallbackErr) {
      console.warn('Fallback document.execCommand copy failed:', fallbackErr);
    }
  }

  return false;
}
