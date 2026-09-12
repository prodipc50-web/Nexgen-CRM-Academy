/**
 * WhatsApp Direct Link Helper
 * Ensures Bangladeshi numbers (017..., 88017..., +88017...) and international numbers
 * are properly formatted into valid international wa.me / api.whatsapp.com links with auto-opening chat.
 */
import { replaceShortcodes } from './templateShortcodes';

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
  if (!pageUrlOrId) return 'https://m.me/';
  
  // If it's already a m.me link
  if (pageUrlOrId.includes('m.me/')) {
    return pageUrlOrId.startsWith('http') ? pageUrlOrId : `https://${pageUrlOrId}`;
  }
  
  // If it's a full Facebook page URL like https://www.facebook.com/academy
  if (pageUrlOrId.includes('facebook.com/')) {
    const afterDomain = pageUrlOrId.split('facebook.com/')[1] || '';
    const cleanSegment = afterDomain.split('/')[0]?.split('?')[0]?.replace(/[^a-zA-Z0-9._-]/g, '');
    const pageHandle = cleanSegment && cleanSegment !== 'profile.php' ? cleanSegment : '';
    return pageHandle ? `https://m.me/${pageHandle}` : 'https://m.me/';
  }

  // If it's just a username/page ID
  const cleanHandle = pageUrlOrId.replace(/[^a-zA-Z0-9._-]/g, '');
  return cleanHandle ? `https://m.me/${cleanHandle}` : 'https://m.me/';
}

export interface DueReminderParams {
  phone?: string;
  studentName: string;
  courseName: string;
  dueAmount: number;
  dueDate?: string;
  instituteName?: string;
  hotline?: string;
  customTemplate?: string;
}

export function getDueReminderWhatsAppUrl(params: DueReminderParams): string {
  const {
    phone,
    studentName,
    courseName,
    dueAmount,
    dueDate,
    instituteName = 'Academy',
    hotline = '',
    customTemplate
  } = params;

  if (customTemplate) {
    const customized = replaceShortcodes(customTemplate, {
      student_name: studentName,
      course_name: courseName,
      due_amount: dueAmount.toLocaleString(),
      due_date: dueDate || 'শিঘ্রই',
      institute_name: instituteName,
      helpline: hotline
    });
    return getWhatsAppDirectUrl(phone, customized);
  }

  const hotlineText = hotline ? `\n📞 যেকোনো তথ্যে যোগাযোগ করুন: ${hotline}` : '';
  const msg = `আসসালামু আলাইকুম ${studentName},
${instituteName}-এর পক্ষ থেকে শুভেচ্ছা।

আপনার "${courseName}" কোর্সের ফি বাবদ বকেয়া ৳${dueAmount.toLocaleString()}${dueDate ? ` (পরিশোধের নির্ধারিত তারিখ: ${dueDate})` : ''}।
সম্মানিত শিক্ষার্থী হিসেবে নির্ধারিত তারিখের মধ্যে ফি পরিশোধ করে একাডেমিক কার্যক্রম ও ক্লাস সচল রাখার জন্য অনুরোধ করা হলো।

💳 পেমেন্ট মাধ্যম: বিকাশ / নগদ / ব্যাংক অথবা ক্যাম্পাসে সরাসরি।${hotlineText}
ধন্যবাদ!`;

  return getWhatsAppDirectUrl(phone, msg);
}

export interface AdmissionWelcomeParams {
  phone?: string;
  studentName: string;
  studentCode: string;
  courseName: string;
  batchNumber?: string;
  classDays?: string;
  instituteName?: string;
  hotline?: string;
  customTemplate?: string;
}

export function getAdmissionWelcomeWhatsAppUrl(params: AdmissionWelcomeParams): string {
  const {
    phone,
    studentName,
    studentCode,
    courseName,
    batchNumber,
    classDays,
    instituteName = 'Academy',
    hotline = '',
    customTemplate
  } = params;

  if (customTemplate) {
    const customized = replaceShortcodes(customTemplate, {
      student_name: studentName,
      student_code: studentCode,
      course_name: courseName,
      batch_number: batchNumber || '',
      institute_name: instituteName,
      helpline: hotline
    });
    return getWhatsAppDirectUrl(phone, customized);
  }

  const hotlineText = hotline ? `\n📞 হেল্পলাইন: ${hotline}` : '';
  const msg = `অভিনন্দন ${studentName}! 🎓
${instituteName}-এ সফলভাবে ভর্তির জন্য আপনাকে স্বাগতম।

📋 *ভর্তি বিবরণ:*
• শিক্ষার্থী আইডি: ${studentCode}
• কোর্স: ${courseName}
${batchNumber ? `• ব্যাচ: ${batchNumber}` : ''}
${classDays ? `• ক্লাসের দিন: ${classDays}` : ''}

ক্যাম্পাসে আসার সময় আপনার শিক্ষার্থী আইডি কার্ড অথবা মানি রিসিট সঙ্গে রাখুন।${hotlineText}
আপনার সাফল্য কামনা করি!`;

  return getWhatsAppDirectUrl(phone, msg);
}

