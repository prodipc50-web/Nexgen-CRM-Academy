// Shortcode interpolation utility for SMS, WhatsApp notifications, ID cards, Admit Cards, and Money Receipts

export interface ShortcodeContext {
  student_name?: string;
  student_code?: string;
  student_phone?: string;
  course_name?: string;
  batch_number?: string;
  due_amount?: string | number;
  due_date?: string;
  paid_amount?: string | number;
  receipt_number?: string;
  institute_name?: string;
  campus_name?: string;
  campus_address?: string;
  helpline?: string;
  website_url?: string;
  exam_date?: string;
  [key: string]: any;
}

export const replaceShortcodes = (template: string, context: ShortcodeContext): string => {
  if (!template) return '';

  return template.replace(/\{([a-zA-Z0-9_]+)\}/g, (match, key) => {
    const val = context[key];
    if (val !== undefined && val !== null && val !== '') {
      return String(val);
    }
    return match; // Keep unresolved shortcode or let it fall back
  });
};

export const DEFAULT_DUE_NOTICE_TEMPLATE = 
  'প্রিয় {student_name},\n{institute_name}-এ আপনার {course_name} কোর্সের বকেয়া ফি ৳{due_amount} টাকা পরিশোধের শেষ তারিখ {due_date}। অনুগ্রহ করে নির্ধারিত সময়ের মধ্যে ফি পরিশোধ নিশ্চিত করুন।\nহেল্পলাইন: {helpline}';

export const DEFAULT_WELCOME_NOTICE_TEMPLATE =
  'অভিনন্দন {student_name}!\n{institute_name}-এ {course_name} কোর্সে (ব্যাচ: {batch_number}) আপনার ভর্তি সফলভাবে সম্পন্ন হয়েছে। আপনার স্টুডেন্ট কোড: {student_code}।\nযেকোনো প্রয়োজনে কল করুন: {helpline}।';

export const DEFAULT_PAYMENT_RECEIPT_TEMPLATE =
  'ধন্যবাদ {student_name}!\n{institute_name}-এ আপনার ৳{paid_amount} টাকা ফি গ্রহণ করা হয়েছে (রসিদ নং: {receipt_number})। বর্তমান বকেয়া: ৳{due_amount}।\nহটলাইন: {helpline}';

export const DEFAULT_EXAM_ADMIT_TEMPLATE =
  'প্রিয় {student_name},\n{institute_name}-এ আপনার {course_name} চূড়ান্ত মূল্যায়নের অ্যাডমিট কার্ড প্রস্তুত হয়েছে। পরীক্ষার তারিখ: {exam_date}। সময়মতো উপস্থিত থাকুন।';
