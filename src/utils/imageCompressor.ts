/**
 * Universal Client-Side Image Compressor & Resizer Utility
 * Prevents "QuotaExceededError" in localStorage by resizing and compressing
 * large camera/mobile/PC images (2MB - 10MB) into lightweight web-friendly WebP/JPEG (40KB - 80KB).
 */

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0.1 to 1.0 (default 0.75)
  format?: 'image/webp' | 'image/jpeg';
}

/**
 * Compresses an image File or existing Data URL to a lightweight Base64 string
 */
export async function compressImageFile(
  file: File | Blob,
  options: CompressionOptions = {}
): Promise<string> {
  const {
    maxWidth = 1200,
    maxHeight = 1200,
    quality = 0.75,
    format = 'image/jpeg'
  } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate aspect-ratio preserved dimensions
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          // Fallback to original string if canvas context is unavailable
          resolve(event.target?.result as string);
          return;
        }

        // Draw and compress
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        try {
          const compressedDataUrl = canvas.toDataURL(format, quality);
          resolve(compressedDataUrl);
        } catch {
          // Fallback to jpeg
          const fallbackUrl = canvas.toDataURL('image/jpeg', 0.7);
          resolve(fallbackUrl);
        }
      };

      img.onerror = (err) => reject(err);
      img.src = event.target?.result as string;
    };

    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * Helper specifically for avatar/logo images (square ratio, smaller file size)
 */
export async function compressLogoOrAvatar(
  file: File | Blob,
  maxDimension: number = 400
): Promise<string> {
  return compressImageFile(file, {
    maxWidth: maxDimension,
    maxHeight: maxDimension,
    quality: 0.8,
    format: 'image/jpeg'
  });
}

/**
 * Compresses an existing Base64 Data URL string or File to a smaller size
 */
export async function compressImageBase64(
  input: string | File | Blob,
  options: CompressionOptions = {}
): Promise<string> {
  if (typeof input !== 'string') {
    return compressImageFile(input, options);
  }

  const {
    maxWidth = 1000,
    maxHeight = 1000,
    quality = 0.75,
    format = 'image/jpeg'
  } = options;

  return new Promise((resolve) => {
    if (!input || !input.startsWith('data:image')) {
      resolve(input);
      return;
    }

    const img = new Image();
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(input);
        return;
      }

      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);

      try {
        const compressed = canvas.toDataURL(format, quality);
        resolve(compressed);
      } catch {
        resolve(input);
      }
    };

    img.onerror = () => resolve(input);
    img.src = input;
  });
}

/**
 * Estimates payload size of an object or string in bytes
 */
export function estimatePayloadSize(data: any): number {
  try {
    const str = typeof data === 'string' ? data : JSON.stringify(data);
    return new Blob([str]).size;
  } catch {
    return 0;
  }
}


