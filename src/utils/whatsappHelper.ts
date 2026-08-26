/**
 * WhatsApp Direct Link Helper
 * Ensures Bangladeshi numbers (017..., 88017..., +88017...) and international numbers
 * are properly formatted into valid international wa.me / api.whatsapp.com links with auto-opening chat.
 */

export function cleanWhatsAppNumber(phone?: string): string {
  if (!phone) return '8801798444444';
  
  // Remove all non-numeric characters
  let digits = phone.replace(/[^0-9]/g, '');

  // If starts with 8801... and length is 13, it's already Bangladeshi international format
  if (digits.startsWith('8801') && digits.length === 13) {
    return digits;
  }

  // If starts with 880... (e.g. 8801798444444)
  if (digits.startsWith('880') && digits.length >= 12) {
    return digits;
  }

  // If starts with 01... (11 digits, typical Bangladeshi mobile), prefix with 88
  if (digits.startsWith('01') && digits.length === 11) {
    return `88${digits}`;
  }

  // If starts with 1... (10 digits, e.g. 1798444444), prefix with 880
  if (digits.startsWith('1') && digits.length === 10) {
    return `880${digits}`;
  }

  // If already international (e.g., > 10 digits)
  if (digits.length >= 10) {
    return digits;
  }

  return '8801798444444';
}

export function getWhatsAppDirectUrl(phone: string | undefined, message: string = ''): string {
  const cleanNumber = cleanWhatsAppNumber(phone);
  const encodedText = encodeURIComponent(message.trim());
  return `https://api.whatsapp.com/send?phone=${cleanNumber}${encodedText ? `&text=${encodedText}` : ''}`;
}

export function getMessengerDirectUrl(pageUrlOrId?: string): string {
  if (!pageUrlOrId) return 'https://m.me/nexgenacademy';
  
  // If it's already a m.me link
  if (pageUrlOrId.includes('m.me/')) {
    return pageUrlOrId.startsWith('http') ? pageUrlOrId : `https://${pageUrlOrId}`;
  }
  
  // If it's a full Facebook page URL like https://facebook.com/nexgenit
  if (pageUrlOrId.includes('facebook.com/')) {
    const pageHandle = pageUrlOrId.split('facebook.com/')[1]?.replace(/[^a-zA-Z0-9._-]/g, '') || 'nexgenacademy';
    return `https://m.me/${pageHandle}`;
  }

  // If it's just a username/page ID
  const cleanHandle = pageUrlOrId.replace(/[^a-zA-Z0-9._-]/g, '');
  return `https://m.me/${cleanHandle || 'nexgenacademy'}`;
}
