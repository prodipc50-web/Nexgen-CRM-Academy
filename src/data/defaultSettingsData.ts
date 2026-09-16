import {
  IdPrefixConfig,
  ScheduleManagerConfig,
  ExamPolicyConfig,
  PromoCoupon,
  AcademicCalendarConfig,
  InstallmentFeeRules
} from '../types';

export const DEFAULT_ID_PREFIX_CONFIG: IdPrefixConfig = {
  studentPrefix: 'NCA-{YEAR}-',
  admissionPrefix: 'NCA-ADM-',
  receiptPrefix: 'MR-26-',
  certificatePrefix: 'CERT-NCA-',
  batchPrefix: 'NCA-B-',
  expensePrefix: 'NCA-EXP-',
  digitPadding: 3,
  includeYearToken: true
};

export const DEFAULT_SCHEDULE_CONFIG: ScheduleManagerConfig = {
  shifts: [
    {
      id: 'sh-1',
      name: 'Morning Regular Batch',
      shiftType: 'Morning',
      startTime: '10:00 AM',
      endTime: '12:00 PM',
      isActive: true
    },
    {
      id: 'sh-2',
      name: 'Afternoon Practice Batch',
      shiftType: 'Afternoon',
      startTime: '03:00 PM',
      endTime: '05:00 PM',
      isActive: true
    },
    {
      id: 'sh-3',
      name: 'Evening Professional Batch',
      shiftType: 'Evening',
      startTime: '06:30 PM',
      endTime: '08:30 PM',
      isActive: true
    },
    {
      id: 'sh-4',
      name: 'Weekend Friday Intensive',
      shiftType: 'Weekend',
      startTime: '09:30 AM',
      endTime: '01:30 PM',
      isActive: true
    },
    {
      id: 'sh-5',
      name: 'Weekend Saturday Special',
      shiftType: 'Weekend',
      startTime: '03:00 PM',
      endTime: '07:00 PM',
      isActive: true
    },
    {
      id: 'sh-6',
      name: 'Night Freelancer Bootcamp',
      shiftType: 'Night',
      startTime: '09:00 PM',
      endTime: '11:00 PM',
      isActive: false
    }
  ],
  dayPatterns: [
    {
      id: 'dp-1',
      name: 'রবি-মঙ্গল-বৃহস্পতি (Sun-Tue-Thu)',
      shortCode: 'STT',
      days: ['Sunday', 'Tuesday', 'Thursday'],
      isActive: true
    },
    {
      id: 'dp-2',
      name: 'সোম-বুধ-শুক্রবার (Mon-Wed-Fri)',
      shortCode: 'MWF',
      days: ['Monday', 'Wednesday', 'Friday'],
      isActive: true
    },
    {
      id: 'dp-3',
      name: 'শুক্র-শনিবার উইকেন্ড (Fri-Sat Weekend)',
      shortCode: 'WKND',
      days: ['Friday', 'Saturday'],
      isActive: true
    },
    {
      id: 'dp-4',
      name: 'প্রতিদিন বুটক্যাম্প (Saturday to Thursday)',
      shortCode: 'DAILY',
      days: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
      isActive: true
    }
  ]
};

export const DEFAULT_EXAM_POLICY_CONFIG: ExamPolicyConfig = {
  gradingRules: [
    {
      id: 'gr-1',
      grade: 'A+',
      minMarks: 80,
      maxMarks: 100,
      gpa: 4.0,
      evaluation: 'Outstanding / Distinction',
      colorBadge: 'emerald'
    },
    {
      id: 'gr-2',
      grade: 'A',
      minMarks: 70,
      maxMarks: 79,
      gpa: 3.75,
      evaluation: 'Excellent Performance',
      colorBadge: 'teal'
    },
    {
      id: 'gr-3',
      grade: 'A-',
      minMarks: 60,
      maxMarks: 69,
      gpa: 3.5,
      evaluation: 'Very Good Performance',
      colorBadge: 'blue'
    },
    {
      id: 'gr-4',
      grade: 'B',
      minMarks: 50,
      maxMarks: 59,
      gpa: 3.0,
      evaluation: 'Satisfactory / Passed',
      colorBadge: 'amber'
    },
    {
      id: 'gr-5',
      grade: 'F',
      minMarks: 0,
      maxMarks: 49,
      gpa: 0.0,
      evaluation: 'Failed / Retake Required',
      colorBadge: 'rose'
    }
  ],
  minPassMark: 50,
  minAttendancePercentForAdmit: 80,
  examControllerName: 'Prodip Chowdhury',
  examControllerTitle: 'Controller of Examinations',
  courseCoordinatorName: 'Engr. Tanvir Ahmed',
  verificationBaseUrl: 'https://nexgenacademy.edu.bd/verify/'
};

export const DEFAULT_PROMO_COUPONS: PromoCoupon[] = [
  {
    id: 'cup-1',
    code: 'EID2026',
    title: 'পবিত্র ঈদুল ফিতর স্পেশাল স্কলারশিপ অফার',
    discountType: 'fixed',
    discountValue: 1500,
    minCourseFee: 5000,
    applicableCourseIds: ['all'],
    validUntil: '2026-06-30',
    usageLimit: 100,
    usedCount: 24,
    isActive: true,
    notes: 'সকল প্রফেশনাল ও ডিপ্লোমা কোর্সে প্রযোজ্য'
  },
  {
    id: 'cup-2',
    code: 'FREELANCER30',
    title: 'ফ্রিল্যান্সার অ্যান্ড ইয়ুথ এমপাওয়ারমেন্ট কোটা',
    discountType: 'percentage',
    discountValue: 20,
    minCourseFee: 6000,
    applicableCourseIds: ['all'],
    validUntil: '2026-12-31',
    usageLimit: 50,
    usedCount: 18,
    isActive: true,
    notes: 'ওয়েব ডেভেলপমেন্ট ও গ্রাফিক্স কোর্সে ২০% ফ্ল্যাট স্কলারশিপ'
  },
  {
    id: 'cup-3',
    code: 'EARLYBIRD',
    title: 'আর্লি বার্ড রেজিস্ট্রেশন ডিসকাউন্ট',
    discountType: 'fixed',
    discountValue: 1000,
    minCourseFee: 4000,
    applicableCourseIds: ['all'],
    validUntil: '2026-08-15',
    usageLimit: 30,
    usedCount: 12,
    isActive: true,
    notes: 'ক্লাস শুরুর ৭ দিন পূর্বে অগ্রিম রেজিস্ট্রেশনে ১০০০ টাকা ছাড়'
  }
];

export const DEFAULT_ACADEMIC_CALENDAR: AcademicCalendarConfig = {
  weekendDays: ['Friday', 'Saturday'],
  academicYear: '2026',
  holidays: [
    {
      id: 'hol-1',
      name: 'আন্তর্জাতিক মাতৃভাষা দিবস',
      startDate: '2026-02-21',
      endDate: '2026-02-21',
      holidayType: 'Government',
      affectsClasses: true,
      notes: 'শহীদ দিবস ও আন্তর্জাতিক মাতৃভাষা দিবস উপলক্ষে অ্যাকাডেমি বন্ধ'
    },
    {
      id: 'hol-2',
      name: 'জাতীয় শিশু দিবস ও জাতির জনকের জন্মবার্ষিকী',
      startDate: '2026-03-17',
      endDate: '2026-03-17',
      holidayType: 'Government',
      affectsClasses: true,
      notes: 'সরকারি সাধারণ ছুটি'
    },
    {
      id: 'hol-3',
      name: 'স্বাধীনতা ও জাতীয় দিবস',
      startDate: '2026-03-26',
      endDate: '2026-03-26',
      holidayType: 'Government',
      affectsClasses: true,
      notes: 'মহান স্বাধীনতা দিবস'
    },
    {
      id: 'hol-4',
      name: 'বাংলা নববর্ষ (পহেলা বৈশাখ)',
      startDate: '2026-04-14',
      endDate: '2026-04-14',
      holidayType: 'Government',
      affectsClasses: true,
      notes: 'শুভ নববর্ষ ১৪৩৩ বঙ্গাব্দ'
    },
    {
      id: 'hol-5',
      name: 'পবিত্র ঈদুল ফিতর অবকাশ',
      startDate: '2026-03-29',
      endDate: '2026-04-03',
      holidayType: 'Religious',
      affectsClasses: true,
      notes: 'ঈদুল ফিতরের সাধারণ ছুটি ও অ্যাকাডেমিক বিরতি'
    },
    {
      id: 'hol-6',
      name: 'মে দিবস (আন্তর্জাতিক শ্রমিক দিবস)',
      startDate: '2026-05-01',
      endDate: '2026-05-01',
      holidayType: 'Government',
      affectsClasses: true,
      notes: 'মে দিবস'
    },
    {
      id: 'hol-7',
      name: 'পবিত্র ঈদুল আযহা অবকাশ',
      startDate: '2026-06-05',
      endDate: '2026-06-10',
      holidayType: 'Religious',
      affectsClasses: true,
      notes: 'কোরবানি ঈদের অ্যাকাডেমিক অবকাশ'
    },
    {
      id: 'hol-8',
      name: 'বিজয় দিবস',
      startDate: '2026-12-16',
      endDate: '2026-12-16',
      holidayType: 'Government',
      affectsClasses: true,
      notes: 'মহান বিজয় দিবস'
    }
  ]
};

export const DEFAULT_INSTALLMENT_FEE_RULES: InstallmentFeeRules = {
  defaultInstallmentCount: 2,
  reminderNoticeDaysBefore: 3,
  overdueAlertIntervalDays: [1, 3, 7],
  lateFeePenaltyEnabled: false,
  lateFeeAmount: 200,
  gracePeriodDays: 5,
  strictAdmissionFreezeAfterDays: 15
};
