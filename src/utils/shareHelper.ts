import { Course } from '../types';
import { copyToClipboardSafe } from './clipboardHelper';

export interface CourseSharePayload {
  title: string;
  text: string;
  url: string;
}

/**
 * Builds standard share text for a course in Bangla
 */
export function buildCourseShareText(course: Course, customUrl?: string): CourseSharePayload {
  const url = customUrl || (typeof window !== 'undefined' ? window.location.href : 'https://nexgenacademy.edu.bd');
  const fee = course.offerFee || course.regularFee;
  const feeText = fee ? `কোর্স ফি: ৳${fee.toLocaleString()}` : '';
  const durationText = course.duration ? `মেয়াদ: ${course.duration}` : '';

  const summaryPoints = [
    `🎓 *${course.name}*`,
    `🏢 নেক্সজেন কম্পিউটার একাডেমি (Nexgen Computer Academy)`,
    durationText,
    feeText,
    course.description ? `\n📌 ${course.description.slice(0, 150)}...` : '',
    `\n✅ ১০০% প্র্যাকটিক্যাল ল্যাব ও অনলাইন লাইভ ক্লাস`,
    `✅ সরকারি গ্রহণযোগ্য ভেরিফায়েবল সার্টিফিকেট`,
    `\n🔗 বিস্তারিত ও ভর্তির জন্য ভিজিট করুন:\n${url}`
  ].filter(Boolean).join('\n');

  return {
    title: `${course.name} - NexGen Computer Academy`,
    text: summaryPoints,
    url
  };
}

/**
 * Share via WhatsApp directly
 */
export function shareOnWhatsApp(course: Course, customUrl?: string): void {
  const share = buildCourseShareText(course, customUrl);
  const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(share.text)}`;
  if (typeof window !== 'undefined') {
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  }
}

/**
 * Share via Facebook dialog
 */
export function shareOnFacebook(customUrl?: string): void {
  const url = customUrl || (typeof window !== 'undefined' ? window.location.href : 'https://nexgenacademy.edu.bd');
  const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  if (typeof window !== 'undefined') {
    window.open(fbUrl, '_blank', 'width=600,height=500,noopener,noreferrer');
  }
}

/**
 * Share via LinkedIn
 */
export function shareOnLinkedIn(customUrl?: string, title?: string): void {
  const url = customUrl || (typeof window !== 'undefined' ? window.location.href : 'https://nexgenacademy.edu.bd');
  const liUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
  if (typeof window !== 'undefined') {
    window.open(liUrl, '_blank', 'width=600,height=500,noopener,noreferrer');
  }
}

/**
 * Native Web Share API if supported, or fallback
 */
export async function shareCourseNative(
  course: Course,
  customUrl?: string
): Promise<{ success: boolean; method: 'native' | 'clipboard' }> {
  const share = buildCourseShareText(course, customUrl);

  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({
        title: share.title,
        text: share.text,
        url: share.url
      });
      return { success: true, method: 'native' };
    } catch (err: any) {
      if (err.name === 'AbortError') {
        return { success: false, method: 'native' };
      }
      // If error or unhandled, fallback to clipboard below
    }
  }

  // Fallback to clipboard
  const success = await copyToClipboardSafe(`${share.text}`);
  return { success, method: 'clipboard' };
}
