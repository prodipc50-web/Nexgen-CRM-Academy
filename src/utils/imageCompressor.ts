/**
 * Image Compression & Payload Optimization Utility
 * Prevents Firestore 1MB document limit overflow by converting large images/photos
 * to highly-optimized, crisp WebP/JPEG data strings or keeping remote URLs.
 */

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0.1 to 1.0
  format?: 'image/webp' | 'image/jpeg' | 'image/png';
}

/**
 * Compresses an image (File or Base64 data URL) using HTML Canvas.
 * Keeps remote HTTP/HTTPS URLs untouched.
 */
export async function compressImageBase64(
  input: string | File,
  options: CompressionOptions = {}
): Promise<string> {
  const {
    maxWidth = 1280,
    maxHeight = 800,
    quality = 0.82,
    format = 'image/jpeg'
  } = options;

  // If already a remote URL, return as is
  if (typeof input === 'string' && (input.startsWith('http://') || input.startsWith('https://'))) {
    return input;
  }

  return new Promise((resolve) => {
    let dataUrl = '';

    const processDataUrl = (srcUrl: string) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate aspect-ratio preserved dimensions
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }

        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, width);
        canvas.height = Math.max(1, height);

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(srcUrl);
          return;
        }

        // Fill background with white for JPEG transparency compatibility
        if (format === 'image/jpeg') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        try {
          // Attempt WebP or fallback to JPEG
          const compressed = canvas.toDataURL(format, quality);
          resolve(compressed);
        } catch {
          resolve(srcUrl);
        }
      };

      img.onerror = () => {
        resolve(srcUrl);
      };

      img.src = srcUrl;
    };

    if (input instanceof File) {
      const reader = new FileReader();
      reader.onload = (e) => {
        dataUrl = (e.target?.result as string) || '';
        if (dataUrl) {
          processDataUrl(dataUrl);
        } else {
          resolve('');
        }
      };
      reader.onerror = () => resolve('');
      reader.readAsDataURL(input);
    } else if (typeof input === 'string') {
      if (input.startsWith('data:')) {
        processDataUrl(input);
      } else {
        resolve(input);
      }
    } else {
      resolve('');
    }
  });
}

/**
 * Estimates the byte and kilobyte size of a JavaScript object or string.
 */
export function estimatePayloadSize(data: any): { bytes: number; kilobytes: number } {
  try {
    const jsonStr = typeof data === 'string' ? data : JSON.stringify(data);
    const bytes = new Blob([jsonStr]).size;
    return {
      bytes,
      kilobytes: Math.round(bytes / 1024)
    };
  } catch {
    return { bytes: 0, kilobytes: 0 };
  }
}
