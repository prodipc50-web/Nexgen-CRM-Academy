export interface StudentTermClause {
  id: number | string;
  numberBn: string;
  numberEn: string;
  titleEn: string;
  titleBn: string;
  summary: string;
  details: string;
  iconName: string;
  isActive?: boolean;
}

export const STUDENT_TERMS_AND_CONDITIONS: StudentTermClause[] = [
  {
    id: 1,
    numberBn: '১',
    numberEn: '1',
    titleEn: 'Admission & Payment',
    titleBn: 'ভর্তি ও ফি পরিশোধ',
    summary: 'রেজিস্ট্রেশন ও ফি পরিশোধ সংক্রান্ত নিয়মাবলী',
    details: 'Admission registration এবং নির্ধারিত payment সম্পন্ন হওয়ার পর confirmation হবে। Course fee/কিস্তি নির্ধারিত সময়ের মধ্যে পরিশোধ করতে হবে।',
    iconName: 'credit-card'
  },
  {
    id: 2,
    numberBn: '২',
    numberEn: '2',
    titleEn: 'Course Delivery',
    titleBn: 'ক্লাস ও প্রশিক্ষণ পরিচালনা',
    summary: 'কারিকুলাম, প্র্যাকটিক্যাল ল্যাব ও ট্রেইনার গাইডেন্স',
    details: 'Nexgen Academy নির্ধারিত curriculum অনুযায়ী practical class, trainer guidance, learning resources এবং প্রয়োজনীয় practice activities প্রদান করবে।',
    iconName: 'book-open'
  },
  {
    id: 3,
    numberBn: '৩',
    numberEn: '3',
    titleEn: 'Refund & Cancellation',
    titleBn: 'ফি ফেরত ও বাতিলকরণ নীতিমালা',
    summary: 'ফি রিফান্ড ও বিকল্প ব্যবস্থা সংক্রান্ত নিয়ম',
    details: 'Course শুরু হওয়ার পর paid fee সাধারণত refundable নয়। Academy-এর কারণে course delivery সম্ভব না হলে applicable alternative arrangement বা refund policy প্রযোজ্য হবে।',
    iconName: 'rotate-ccw'
  },
  {
    id: 4,
    numberBn: '৪',
    numberEn: '4',
    titleEn: 'Batch & Class Schedule',
    titleBn: 'ব্যাচ ও ক্লাস শিডিউল পরিবর্তন',
    summary: 'পরিস্থিতি অনুযায়ী ব্যাচ ও ট্রেইনার সমন্বয়',
    details: 'Batch change বিশেষ পরিস্থিতিতে Academy-এর approval ও seat availability অনুযায়ী করা যেতে পারে। প্রয়োজন হলে Academy class schedule বা trainer পরিবর্তন করতে পারে।',
    iconName: 'calendar'
  },
  {
    id: 5,
    numberBn: '৫',
    numberEn: '5',
    titleEn: 'Attendance & Certificate',
    titleBn: 'হাজিরা ও সনদপত্র প্রাপ্তি',
    summary: 'ন্যূনতম ৮০% উপস্থিতি ও কোর্স সম্পন্ন করার শর্ত',
    details: 'Certificate-এর জন্য minimum 80% attendance, required practical work/assessment এবং course completion requirements পূরণ করতে হবে। সকল outstanding fee পরিশোধিত থাকতে হবে।',
    iconName: 'award'
  },
  {
    id: 6,
    numberBn: '৬',
    numberEn: '6',
    titleEn: 'Course Materials',
    titleBn: 'কোর্স ম্যাটেরিয়ালস ও কপিরাইট',
    summary: 'ব্যক্তিগত লার্নিং ও পাইরেসি নিষেধাজ্ঞা',
    details: 'Handnote, PDF, template, prompt, video ও অন্যান্য learning materials শুধুমাত্র enrolled student\'s personal learning-এর জন্য। Academy-এর অনুমতি ছাড়া এগুলো copy, sell, publish বা distribute করা যাবে না।',
    iconName: 'file-text'
  },
  {
    id: 7,
    numberBn: '৭',
    numberEn: '7',
    titleEn: 'AI & Academic Integrity',
    titleBn: 'এআই ব্যবহার ও সততা',
    summary: 'ChatGPT, Gemini, Canva AI সহায়ক হিসেবে ব্যবহার',
    details: 'ChatGPT, Gemini, Canva AI ও অন্যান্য AI tools learning-এর সহায়ক হিসেবে ব্যবহার করা হবে। AI-generated information ব্যবহারের আগে accuracy যাচাই করা শিক্ষার্থীর দায়িত্ব। অন্যের কাজ নিজের নামে জমা দেওয়া যাবে না।',
    iconName: 'bot'
  },
  {
    id: 8,
    numberBn: '৮',
    numberEn: '8',
    titleEn: 'Lab & Conduct',
    titleBn: 'ল্যাব ব্যবহার ও আচরণবিধি',
    summary: 'ল্যাব যন্ত্রপাতি সুরক্ষা ও পারস্পরিক শ্রদ্ধা',
    details: 'Academy-এর computer, lab equipment ও property যত্নসহকারে ব্যবহার করতে হবে। Trainer, staff ও fellow students-এর প্রতি respectful আচরণ করতে হবে। Harassment, abusive behaviour বা class disruption গ্রহণযোগ্য নয়।',
    iconName: 'monitor'
  },
  {
    id: 9,
    numberBn: '৯',
    numberEn: '9',
    titleEn: 'Career Disclaimer',
    titleBn: 'ক্যারিয়ার ও ইনকাম ডিসক্লেইমার',
    summary: 'দক্ষতা উন্নয়ন বনাম ইনকাম গ্যারান্টি স্বচ্ছতা',
    details: 'Course completion skill development-এর সুযোগ তৈরি করে; তবে চাকরি, freelancing income, promotion বা নির্দিষ্ট salary-এর কোনো guarantee নয়। Career outcome শিক্ষার্থীর skill, performance, experience এবং individual effort-এর ওপর নির্ভর করে।',
    iconName: 'compass'
  },
  {
    id: 10,
    numberBn: '১০',
    numberEn: '10',
    titleEn: 'Media & Policy Update',
    titleBn: 'মিডিয়া ও পলিসি আপডেট',
    summary: 'একাডেমিক ছবি/ভিডিও ও কারিকুলাম আপডেট সংক্রান্ত',
    details: 'Class, workshop বা event-এর ছবি/video Academy-এর educational বা promotional কাজে ব্যবহার করা হতে পারে। Academy প্রয়োজন অনুযায়ী curriculum, schedule বা policy update করতে পারে।',
    iconName: 'camera'
  }
];

export const STUDENT_DECLARATION_TEXT = 'আমি উপরোক্ত Terms & Conditions পড়েছি, বুঝেছি এবং Nexgen Computer Academy-এর course-এ ভর্তি হওয়ার জন্য এতে সম্মতি প্রদান করছি।';

export const STUDENT_TERMS_HEADER_SUBTITLE = 'Computer & AI Skills Training — 14/B Garden Road, Farmgate, Dhaka-1215';
export const STUDENT_TERMS_NOTICE = 'অনুগ্রহপূর্বক ভর্তির পূর্বে সম্পূর্ণ পড়ুন / Please read fully before enrollment';
