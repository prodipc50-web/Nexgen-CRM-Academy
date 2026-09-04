export type UserRole =
  | 'SUPER_ADMIN'
  | 'MANAGER'
  | 'COUNSELOR'
  | 'ACCOUNTS_STAFF'
  | 'TRAINER'
  | 'ADMIN'
  | 'ACCOUNTS';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  username?: string;
  password?: string;
  role: UserRole;
  avatar: string;
  phone: string;
  lastLogin?: string;
  firebaseUid?: string;
}

export interface ThemeConfig {
  // ERP Interface Theme
  erpPrimaryColor: string; // e.g. '#4f46e5'
  erpSecondaryColor: string; // e.g. '#f59e0b'
  erpFontFamily: string; // e.g. 'Plus Jakarta Sans'
  
  // Public Website Theme
  websitePrimaryColor: string; // e.g. '#4f46e5'
  websiteSecondaryColor: string; // e.g. '#f59e0b'
  websiteHeadingFont: string; // e.g. 'Plus Jakarta Sans'
  websiteBodyFont: string; // e.g. 'Inter'
  
  // Active Preset & Styling
  activePreset?: string;
  borderRadius?: 'rounded-lg' | 'rounded-xl' | 'rounded-2xl' | 'rounded-3xl';
}

export interface PaymentAccountConfig {
  id: string;
  method: 'bKash' | 'Nagad' | 'Rocket' | 'Bank' | 'Upay';
  accountType: 'Merchant' | 'Personal' | 'Agent';
  accountNumber: string;
  accountName?: string;
  bankName?: string;
  branchName?: string;
  routingNumber?: string;
  qrCodeUrl?: string;
  instructions?: string;
  isActive: boolean;
}

export interface AcademySettings {
  instituteName: string;
  tagline: string;
  campusName?: string; // default 'Farmgate Campus'
  primarySupportPhone?: string; // default '01798444444'
  officialAddress: string;
  officialEmail: string;
  helplines: string[];
  websiteUrl: string;
  certificateVerificationBaseUrl?: string; // default 'https://nexgenacademy.edu.bd/verify/'
  idCardSignatoryName?: string; // default 'Prodip Chowdhury'
  idCardSignatoryTitle?: string; // default 'Authorized Signatory'
  admitCardControllerName?: string; // default 'Exam Controller'
  idCardTerms?: string;
  admitCardInstructions?: string;
  admissionFormTerms?: string;
  defaultLearningMode?: 'Offline' | 'Online Live' | 'Hybrid';
  logoIconSize: number; // default 48
  logoFontSize: number; // default 16
  taglineFontSize: number; // default 11
  customLogoUrl?: string;
  theme?: ThemeConfig;
  
  // Payment Accounts & Gateways
  paymentAccounts?: PaymentAccountConfig[];
  paymentQrCodeUrl?: string;
  paymentInstructions?: string;
  
  // Official Seals, Signatures & Voucher Customization
  institutionSealUrl?: string;
  directorSignatureUrl?: string;
  authorizedSignatureUrl?: string;
  receiptNotes?: string;
}

export type LeadStatus =
  | 'New'
  | 'Pending Verification'
  | 'OTP Verified'
  | 'Qualified'
  | 'Contacted'
  | 'Interested'
  | 'Demo Scheduled'
  | 'Demo Attended'
  | 'Follow-up'
  | 'Admission Pending'
  | 'Confirmed'
  | 'Paid'
  | 'Enrolled'
  | 'Admitted'
  | 'Duplicate'
  | 'Suspicious'
  | 'Rejected'
  | 'Not Interested'
  | 'Lost';

export type ContactMethod =
  | 'Phone'
  | 'Phone Call'
  | 'WhatsApp'
  | 'Messenger'
  | 'SMS'
  | 'Office Visit'
  | 'In-Person Visit'
  | 'Email'
  | 'Other';

export type FollowUpMethod = ContactMethod;

export type FollowUpResult =
  | 'Interested'
  | 'Call Back Later'
  | 'Wants Discount'
  | 'Wants Different Batch'
  | 'Family Discussion'
  | 'Payment Issue'
  | 'Not Interested'
  | 'Admitted'
  | 'Other';

export interface FollowUp {
  id: string;
  leadId: string;
  date: string;
  time?: string;
  staffId?: string;
  counselorId?: string;
  staffName?: string;
  contactMethod?: ContactMethod | string;
  method?: ContactMethod | string;
  conversationSummary?: string;
  notes?: string;
  result: FollowUpResult;
  nextFollowUpDate?: string;
  nextAction?: string;
  status?: 'Completed' | 'Pending' | 'Rescheduled';
  createdAt?: string;
}

export type OccupationType =
  | 'Student'
  | 'Job Holder'
  | 'Job Seeker'
  | 'Housewife'
  | 'Business Owner'
  | 'Freelancer'
  | 'Other'
  | (string & {});

export type StudentGoal =
  | 'Job'
  | 'Freelancing'
  | 'Business'
  | 'Academic'
  | 'Personal Skill Development'
  | 'Career Change'
  | 'Other'
  | (string & {});

export interface Lead {
  id: string;
  leadCode: string; // e.g. NCA-LD-1042
  name: string;
  studentName?: string; // Unified alias
  phone: string;
  altPhone?: string;
  email?: string;
  address?: string;
  occupation: OccupationType;
  educationLevel: string;
  institution?: string;
  interestedCourseId: string;
  courseId?: string; // Optional convenience alias
  courseName?: string;
  interestedBatchId?: string;
  preferredTime?: string;
  preferredSchedule?: string;
  preferredLearningMode?: 'Offline' | 'Online Live' | 'Hybrid';
  learningMode?: 'Offline' | 'Online Live' | 'Hybrid';
  leadSource: string;
  source?: string;
  landingPage?: string;
  landingPageUrl?: string;
  campaignId?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  fbclid?: string;
  deviceType?: 'Mobile' | 'Desktop' | 'Tablet';
  locationCity?: string;
  counselorId: string;
  counselorName?: string; // Manual Counselor Name
  visitDate: string;
  firstContactDate: string;
  comments?: string;
  requirements?: string;
  message?: string;
  budget?: number;
  status: LeadStatus;
  otpStatus?: 'Not Required' | 'Pending' | 'Verified' | 'Failed' | 'Expired';
  fraudRiskScore?: number; // 0 - 100
  fraudRiskLevel?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  fraudFlags?: string[];
  isDuplicate?: boolean;
  duplicateOfLeadId?: string;
  duplicateSubmissionCount?: number;
  lastDuplicateAt?: string;
  lostReason?: string;
  nextFollowUpDate?: string;
  nextFollowUpNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export type StudentStatus = 'Active' | 'At Risk' | 'Dropped' | 'Completed' | 'Alumni' | 'On Hold' | (string & {});

export interface StudentDocument {
  id: string;
  title: string;
  type: 'NID' | 'Photo' | 'Certificate' | 'Admission Form' | 'Receipt' | 'Other';
  url: string;
  uploadedAt: string;
}

export interface StudentTimelineEvent {
  id: string;
  date: string;
  type: 'Contact' | 'Admission' | 'Payment' | 'Attendance' | 'Exam' | 'Certificate' | 'Batch Transfer' | 'Status Change' | 'Note';
  title: string;
  description: string;
  performedBy: string;
}

export interface Student {
  id: string;
  studentCode: string; // e.g. NCA-STU-2026-042
  leadId?: string;
  name: string;
  photoUrl?: string;
  phone: string;
  altPhone?: string;
  email?: string;
  address: string;
  dateOfBirth?: string;
  admissionDate?: string;
  gender: 'Male' | 'Female' | 'Other';
  occupation: OccupationType;
  education: string;
  bloodGroup?: string;
  institution?: string;
  guardianName?: string;
  guardianPhone?: string;
  emergencyContact?: string;
  counselorId?: string;
  counselorName?: string; // Manual Counselor Name
  studentGoal: StudentGoal;
  status: StudentStatus;
  dropReason?: string;
  dropDate?: string;
  alumniJob?: string;
  alumniFreelancingStatus?: string;
  alumniSkills?: string[];
  referralCode?: string;
  learningMode?: 'Offline' | 'Online Live' | 'Hybrid';
  onlinePortalAccess?: boolean;
  notes?: string;
  documents?: StudentDocument[];
  timeline?: StudentTimelineEvent[];
  createdAt: string;
}

export type CourseStatus = 'Draft' | 'Active' | 'Inactive' | 'Archived';
export type DurationUnit = 'Days' | 'Weeks' | 'Months';

export interface CourseModule {
  id: string;
  moduleNumber: number;
  moduleName: string;
  moduleDescription?: string;
  topics: string[];
  estimatedClasses?: number;
  learningOutcomes?: string[];
}

// Trainer Entity & Management
export interface TrainerProfile {
  id: string;
  name: string;
  designation: string;
  avatarUrl: string;
  phone?: string;
  email?: string;
  shortBio: string;
  detailedBio?: string;
  experienceYears: number;
  industryExperience?: string;
  companyOrOrg?: string;
  certifications?: string[];
  skills?: string[];
  socialLinks?: {
    facebook?: string;
    linkedin?: string;
    website?: string;
    github?: string;
    youtube?: string;
  };
  isActive: boolean;
  coursesAssigned?: string[]; // course IDs
  createdAt?: string;
  updatedAt?: string;
}

// Student Review for Course & Landing
export interface StudentCourseReview {
  id: string;
  courseId: string;
  studentName: string;
  studentPhoto?: string;
  rating: number; // 1 to 5
  reviewText: string;
  reviewType: 'Text' | 'Photo' | 'Video';
  mediaUrl?: string; // photo URL or video URL
  location?: string;
  profession?: string;
  batchNumber?: string;
  reviewDate: string;
  isVerified: boolean;
  isFeatured: boolean;
  sortOrder: number;
  isActive: boolean;
}

// Classroom Photo / Gallery
export interface ClassroomGalleryPhoto {
  id: string;
  courseId?: string; // specific course or general
  title: string;
  caption?: string;
  imageUrl: string;
  thumbnailUrl?: string;
  category: 'Classroom & Labs' | 'Practical Session' | 'Ceremony & Certification' | 'Workshop' | 'Campus Life';
  batchNumber?: string;
  date?: string;
  sortOrder: number;
  isActive: boolean;
}

// 4-Level Deep Course Curriculum
export interface CurriculumTopic {
  id: string;
  title: string;
  durationMinutes?: number;
  hasHandsOnPractice?: boolean;
}

export interface CurriculumLesson {
  id: string;
  title: string;
  duration?: string;
  topics: CurriculumTopic[];
  practicalProject?: string;
  isBonus?: boolean;
}

export interface AdvancedCourseModule {
  id: string;
  moduleNumber: number;
  title: string;
  description?: string;
  lessons: CurriculumLesson[];
  estimatedClasses?: number;
  learningOutcomes?: string[];
  isActive?: boolean;
}

// Landing Page Template Types
export type LandingPageTemplateType =
  | 'online_course'
  | 'offline_course'
  | 'free_demo_class'
  | 'workshop_masterclass'
  | 'premium_course'
  | 'special_campaign_offer';

// 15 Modular Landing Page Sections
export type LandingSectionId =
  | 'hero'
  | 'overview'
  | 'benefits'
  | 'curriculum'
  | 'learning_outcomes'
  | 'trainers'
  | 'classroom_gallery'
  | 'student_reviews'
  | 'success_stories'
  | 'faq'
  | 'pricing'
  | 'special_offer'
  | 'cta_banner'
  | 'contact_location'
  | 'footer';

export interface LandingSectionConfig {
  id: LandingSectionId;
  label: string;
  isEnabled: boolean;
  sortOrder: number;
  customTitle?: string;
  customSubtitle?: string;
}

// Lead Form Field Config & Settings (Configurable from CRM)
export interface LeadFormFieldSetting {
  id: string;
  fieldKey:
    | 'studentName'
    | 'phone'
    | 'email'
    | 'address'
    | 'education'
    | 'institution'
    | 'profession'
    | 'courseId'
    | 'preferredSchedule'
    | 'learningMode'
    | 'message';
  label: string;
  placeholder: string;
  enabled: boolean;
  required: boolean;
  sortOrder: number;
}

export interface LeadFormConfig {
  isEnabled: boolean;
  formTitle: string;
  formSubtitle: string;
  submitButtonText: string;
  successMessage: string;
  defaultLearningMode?: 'Offline' | 'Online Live' | 'Hybrid';
  fields: LeadFormFieldSetting[];
  enableCaptcha: boolean;
  captchaMode: 'OFF' | 'ON' | 'HIGH_RISK_ONLY';
  enableOtp: boolean;
  otpMode: 'OFF' | 'ON' | 'HIGH_RISK_ONLY';
  duplicateAction: 'UPDATE_EXISTING' | 'CREATE_FOLLOWUP' | 'FLAG_AS_DUPLICATE';
}

// Fraud & Bot Protection Config
export interface FraudProtectionConfig {
  enableRateLimiting: boolean;
  rateLimitMaxRequestsPerMinute: number;
  enableDuplicateDetection: boolean;
  enableHoneypot: boolean;
  minSubmissionTimeSeconds: number; // e.g. minimum 3 seconds before human can submit
  captchaMode: 'OFF' | 'ON' | 'HIGH_RISK_ONLY';
  enableRiskScoring: boolean;
  highRiskThreshold: number; // default 60
  suspiciousThreshold: number; // default 30
  autoBlockHighRisk: boolean;
}

// OTP Verification Config
export interface OtpVerificationConfig {
  mode: 'OFF' | 'ON' | 'HIGH_RISK_ONLY';
  provider: 'SMS' | 'WHATSAPP' | 'EMAIL' | 'SIMULATED';
  otpExpiryMinutes: number; // default 5
  maxAttempts: number; // default 3
  resendCooldownSeconds: number; // default 60
  maxResendsPerSession: number; // default 3
  lockoutMinutes: number; // default 15
}

// Offline and Online Marketing Target Config
export interface OfflineMarketingConfig {
  centerName: string;
  primaryArea: string; // "Farmgate"
  radiusKm: number; // e.g. 4
  surroundingAreas: string[]; // ['Farmgate', 'Panthapath', 'Tejgaon', 'Dhanmondi', 'Bijoy Sarani', 'Indira Road', 'Green Road', 'Monipuripara']
  targetAudienceTypes: string[]; // ['SSC Students', 'HSC Students', 'University Students', 'Job Seekers', 'Job Holders', 'Beginners', 'Professionals']
}

export interface OnlineMarketingConfig {
  targetCountry: string; // "Bangladesh"
  supportedCities: string[]; // ['Dhaka', 'Chattogram', 'Sylhet', 'Rajshahi', 'Khulna', 'Barishal', 'Rangpur', 'Mymensingh', 'Cumilla', 'Gazipur', 'Narayanganj']
}

export interface CoursePreferredScheduleOption {
  id: string;
  label: string; // e.g. "শুক্রবার ও শনিবার (সকাল ১০:০০ - ১২:০০)"
  days?: string; // e.g. "Friday & Saturday"
  timeSlot?: string; // e.g. "10:00 AM - 12:00 PM"
  startDate?: string; // e.g. "১৫ অক্টোবর ২০২৬"
  mode?: 'Offline' | 'Online Live' | 'Hybrid' | 'Both';
  availableSeats?: number;
  isActive?: boolean;
  sortOrder?: number;
}

export interface CourseLandingFaq {
  id?: string;
  question: string;
  answer: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface CourseLandingReview {
  name: string;
  roleOrBatch: string;
  rating: number;
  text: string;
  avatarUrl?: string;
}

export interface CourseLandingPainPoint {
  id?: string;
  problem: string;
  solution: string;
}

export interface CourseLandingCurriculumModule {
  id: string;
  moduleNumber?: number;
  moduleName: string;
  subtitle?: string;
  description?: string;
  estimatedClasses?: string | number;
  topics: string[];
  tools?: string[];
  practicalProject?: string;
}

export interface CourseLandingFeatureCard {
  id?: string;
  iconName?: string; // 'laptop' | 'award' | 'zap' | 'briefcase' | 'users' | 'shield' | 'clock' | 'file-text'
  title: string;
  description: string;
}

export interface CourseLandingTargetAudienceItem {
  id?: string;
  group: string;
  benefit: string;
}

export interface CourseLandingGalleryImage {
  id?: string;
  url: string;
  title: string;
  category?: string;
}

export interface CourseLandingPageConfig {
  // Template Selection
  templateType?: LandingPageTemplateType; // 'online_course' | 'offline_course' | 'free_demo_class' | 'workshop_masterclass' | 'premium_course' | 'special_campaign_offer'

  // 15 Modular Section Controls
  sections?: LandingSectionConfig[];

  // Hero Section
  headline?: string;
  subheadline?: string;
  heroBadge?: string;
  customBannerUrl?: string;
  heroImages?: string[]; // Multiple banner carousel / gallery images
  videoPromoUrl?: string; // YouTube / Loom embed or direct video
  ctaMode?: 'both' | 'whatsapp_only' | 'messenger_only' | 'admission_only' | 'whatsapp_and_admission' | 'messenger_and_admission' | 'call_now' | 'demo_registration';
  ctaButtonText?: string;
  customWhatsAppNumber?: string;
  customWhatsAppMessage?: string;
  customMessengerUrl?: string;
  customCallNumber?: string;
  showBatchCountdown?: boolean;
  nextBatchStartDate?: string;
  availableSeats?: number;
  customDiscountBadge?: string;

  // Pain Points vs Modern Office Reality (Problem - Solution)
  painPointsHeadline?: string;
  painPointsSubheadline?: string;
  painPointsList?: CourseLandingPainPoint[];

  // Benefits & Key Features
  whyChooseHeadline?: string;
  whyChoosePoints?: { title: string; desc: string; icon?: string; sortOrder?: number }[];
  featureCards?: CourseLandingFeatureCard[];
  learningOutcomes?: string[];
  prerequisitesNotice?: string;

  // Editable Rich Curriculum Modules (With AI, Excel, Word, Typing, PowerPoint, Google Workspace)
  curriculumHeadline?: string;
  curriculumSubheadline?: string;
  editableModules?: CourseLandingCurriculumModule[];

  // Target Audience & Who Is This For
  audienceHeadline?: string;
  audienceList?: CourseLandingTargetAudienceItem[];

  // 4-Level Deep Modules
  advancedModules?: AdvancedCourseModule[];

  // Assigned Trainers (IDs)
  assignedTrainerIds?: string[];

  // Reviews & Gallery IDs / Embedded items
  customReviews?: CourseLandingReview[];
  assignedReviewIds?: string[];
  assignedGalleryPhotoIds?: string[];
  galleryImages?: CourseLandingGalleryImage[];

  // Pricing & Installments
  showPricingSection?: boolean;
  installmentDetails?: string;
  scholarshipNotice?: string;
  paymentInstructions?: string;

  // Institute Contact & Location
  campusAddress?: string;
  campusPhone?: string;
  campusHours?: string;

  // Lead Form Configuration (Field Toggles)
  preferredSchedulesTitle?: string;
  preferredSchedules?: CoursePreferredScheduleOption[];
  leadFormFields?: {
    showFullName: boolean;
    showPhone: boolean;
    showEmail: boolean;
    showEducation: boolean;
    showProfession: boolean;
    showCityLocation: boolean;
    showLearningMode: boolean;
    showPreferredSchedule: boolean;
    showMessageNote: boolean;
    showPaymentTrx: boolean;
  };

  // FAQs
  faqsHeadline?: string;
  faqs?: CourseLandingFaq[];

  // Certificate Showcase
  certificateConfig?: {
    showCertificate?: boolean;
    headline?: string;
    subheadline?: string;
    certificateImageUrl?: string;
    sampleStudentName?: string;
    certificateTypeBadge?: string;
    features?: string[];
    verificationNote?: string;
  };

  // Quick Snapshot Bar
  quickSnapshot?: {
    showSnapshot?: boolean;
    duration?: string;
    totalSessions?: string;
    batchSize?: string;
    format?: string;
    projectsCount?: string;
    supportType?: string;
  };

  // Post-Course Lifetime Support & Guarantee
  lifetimeSupportConfig?: {
    showSection?: boolean;
    headline?: string;
    subheadline?: string;
    features?: { title: string; desc: string; iconName?: string }[];
  };

  // Social Proof Admission Alert Ticker
  socialProofTickerConfig?: {
    enabled?: boolean;
    intervalSeconds?: number;
    customItems?: { name: string; location: string; timeAgo: string; actionText?: string }[];
  };

  // Free Counseling / Demo toggle in lead form
  enableCounselingToggle?: boolean;

  // Guarantee & Bonus
  guaranteeText?: string;
  bonusHeadline?: string;
  bonusItems?: string[];

  // Styling & Theme
  themeColor?: 'indigo' | 'emerald' | 'purple' | 'amber' | 'rose' | 'slate' | 'cyberpunk';

  // SEO & Meta Tags
  seoTitle?: string;
  seoMetaDescription?: string;
  seoOgTitle?: string;
  seoOgDescription?: string;
  seoOgImage?: string;
  canonicalUrl?: string;
  slug?: string;
  focusKeyword?: string;
  secondaryKeywords?: string[];
  noIndex?: boolean;

  // Status & Version
  publishStatus?: 'Draft' | 'Published' | 'Archived';
  version?: number;
  lastPublishedAt?: string;
}

export interface CourseSEOConfig {
  seoTitle?: string;
  metaDescription?: string;
  slug?: string;
  focusKeyword?: string;
  secondaryKeywords?: string[];
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  noIndex?: boolean;
  breadcrumbs?: { name: string; url: string }[];
  schemaType?: string;
}

export interface Course {
  id: string;
  code: string; // e.g. NCA-CRS-01
  name: string;
  slug?: string;
  shortName?: string;
  category: string;
  description: string;
  thumbnailUrl?: string;
  courseType?: 'Offline' | 'Online' | 'Pre Recorded' | string;
  projectsCount?: number;
  studentsJoined?: number;
  rating?: number;
  reviewsCount?: number;
  badgeText?: string;
  status: CourseStatus;
  deliveryMode?: 'Offline' | 'Online Live' | 'Hybrid';
  livePlatform?: string;
  recordingAccess?: string;
  seo?: CourseSEOConfig;

  // Duration
  durationValue?: number;
  durationUnit?: DurationUnit;
  duration: string; // e.g. "3 Months" or "12 Weeks"
  durationWeeks?: number;
  durationMonths?: number;
  totalClasses: number;
  classDuration?: string; // e.g. "2 Hours"
  totalHours?: number;

  // Fees (Defaults for new admissions)
  regularFee: number;
  offerFee: number;
  discount?: number;
  scholarshipAvailable?: boolean;
  maxScholarship?: number;
  minInstallmentAmount?: number;

  // Curriculum & Modules
  modules?: CourseModule[];
  curriculumHighlights?: string[];
  syllabusHighlights?: string[];

  // Learning Features
  learningFeatures?: string[];

  // Trainers
  trainerId?: string; // primary trainer for backwards compat
  trainerIds?: string[]; // multiple assigned trainers

  // Prerequisites
  requiredSkillLevel?: 'Beginner' | 'Intermediate' | 'Advanced' | 'No Prior Knowledge' | string;
  previousCourse?: string;
  minimumEducation?: string;
  recommendedAge?: string;
  requiredSoftwareHardware?: string;

  // Target Audience
  targetAudience?: string[];

  // Dynamic Landing Page & Campaign Variant Customization
  landingConfig?: CourseLandingPageConfig;

  // Full Syllabus PDF Download
  syllabusPdfUrl?: string;

  createdAt?: string;
  updatedAt?: string;
}

export type BatchStatus = 'Upcoming' | 'Ongoing' | 'Completed';

export interface Batch {
  id: string;
  batchNumber: string; // e.g. "GD-006"
  courseId: string;
  batchType?: 'Offline' | 'Online Live' | 'Hybrid';
  trainerId?: string;
  trainerName?: string; // Manual Trainer Name
  startDate: string;
  endDate?: string;
  classDays: string; // e.g. "Sun, Tue, Thu"
  classTime: string; // e.g. "6:00 PM - 8:00 PM"
  room: string;
  liveMeetingUrl?: string; // e.g. Google Meet or Zoom URL
  meetingPasscode?: string;
  recordingDriveUrl?: string; // Recordings archive drive link
  onlinePlatform?: string; // Zoom / Meet / Teams / Lab
  seatCapacity: number;
  status: BatchStatus;
  notes?: string;
}

export type PaymentMethod = 'Cash' | 'bKash' | 'Nagad' | 'Bank' | 'Card' | 'Rocket' | 'Upay' | 'Other' | (string & {});

export interface InstallmentMilestone {
  id?: string;
  installmentNo?: number;
  installmentNumber?: number;
  title?: string;
  dueDate: string;
  amount: number;
  paidAmount?: number;
  status: 'Paid' | 'Pending' | 'Overdue' | 'Partially Paid';
  paymentDate?: string;
  receiptNumber?: string;
}

export interface Admission {
  id: string;
  admissionCode: string; // e.g. NCA-ADM-2026-105
  admissionNumber?: string;
  studentId: string;
  courseId: string;
  batchId: string;
  learningMode?: 'Offline' | 'Online Live' | 'Hybrid';
  admissionType?: 'In-Person / Office' | 'Online Admission';
  admissionDate: string;
  counselorId: string;
  counselorName?: string; // Manual Counselor Name
  leadSource: string;
  campaignId?: string;
  referral?: string;
  regularFee: number;
  discount: number;
  scholarship: number;
  finalFee: number;
  totalPaid: number;
  due: number;
  paymentStatus: 'Paid' | 'Partially Paid' | 'Due' | 'Overdue';
  status?: string;
  nextPaymentDate?: string;
  nextDueDate?: string;
  installments?: InstallmentMilestone[];
  remarks?: string;

  // Manual Ledger Fee Adjustments (Special Waiver / Discount / Late fee)
  specialAdjustments?: {
    id: string;
    date: string;
    amount: number;
    type: 'Waiver/Discount' | 'Late Fee/Addon' | 'Manual Correction';
    reason: string;
    approvedBy: string;
  }[];

  createdAt: string;
}

export interface Payment {
  id: string;
  receiptNumber: string; // e.g. NCA-REC-2026-8802
  studentId: string;
  admissionId: string;
  date: string;
  amount: number;
  paymentMethod: PaymentMethod;
  transactionId?: string;
  installmentNumber: number;
  collectedBy: string;
  note?: string;
  createdAt: string;
}

export type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Excused' | 'Online Present';

export interface AttendanceRecord {
  id: string;
  batchId: string;
  studentId: string;
  date: string;
  status: AttendanceStatus;
  note?: string;
}

export interface ClassSchedule {
  id: string;
  batchId: string;
  courseId?: string;
  trainerId: string;
  trainerName?: string; // Manual Trainer Name
  classNumber?: number;
  date: string;
  dayOfWeek?: string;
  time?: string;
  startTime?: string;
  endTime?: string;
  topic: string;
  room: string;
  roomId?: string;
  classNotes?: string;
  assignment?: string;
  recordingLink?: string;
  materialsLink?: string;
  meetingUrl?: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'Ongoing';
}

export interface Exam {
  id: string;
  examCode: string;
  title: string;
  batchId: string;
  courseId: string;
  examDate: string;
  totalMarks: number;
  passMarks: number;
  description?: string;
  status?: 'Scheduled' | 'Completed' | 'Published' | 'Cancelled';
}

export interface ExamResult {
  id: string;
  examId: string;
  studentId: string;
  marksObtained: number;
  grade: 'A+' | 'A' | 'A-' | 'B' | 'C' | 'F';
  passFail: 'Pass' | 'Fail';
  feedback?: string;
  remarks?: string;
}

export interface Certificate {
  id: string;
  certificateCode: string; // e.g. NCA-CERT-2026-8941
  certificateNumber?: string;
  studentId: string;
  courseId: string;
  batchId: string;
  issueDate: string;
  completionDate: string;
  grade: string;
  verificationId: string; // Unique URL or verification key
  status: 'Issued' | 'Draft' | 'Revoked';
  instructorSignatureName: string;
  // Manual / Scanned Certificate support
  certificateImageUrl?: string;
  studentName?: string;
  courseName?: string;
  batchName?: string;
  remarks?: string;
  isManualUpload?: boolean;
}

export type ExpenseCategory =
  | 'Rent'
  | 'Office Rent'
  | 'Electricity'
  | 'Utility & Electricity'
  | 'Internet'
  | 'Internet / Broadband'
  | 'Trainer Salary'
  | 'Trainer Remuneration'
  | 'Staff Salary'
  | 'Marketing'
  | 'Marketing & Meta Ads'
  | 'Facebook Ads'
  | 'Software & AI Subscriptions'
  | 'Hardware Maintenance'
  | 'Equipment'
  | 'Printing'
  | 'Stationery'
  | 'Printing & Stationery'
  | 'Maintenance'
  | 'Refreshment'
  | 'Entertainment & Refreshment'
  | 'Office Cleaning & Sanitation'
  | 'Other'
  | (string & {});

export interface Expense {
  id: string;
  expenseCode: string;
  date: string;
  category: ExpenseCategory;
  amount: number;
  paymentMethod: PaymentMethod;
  paidBy?: string;
  paidTo?: string;
  approvedBy?: string;
  description: string;
  receiptNumber?: string;
  receiptUrl?: string;
  createdAt?: string;
}

export interface MarketingCampaign {
  id: string;
  name: string;
  platform: 'Facebook Ads' | 'Facebook Organic' | 'Instagram' | 'TikTok' | 'YouTube' | 'Google' | 'Website' | 'Walk-in' | 'Referral' | 'Other' | string;
  startDate: string;
  endDate: string;
  adSpend: number;
  budget?: number;
  spent?: number;
  leadsGenerated?: number;
  admissionsCount?: number;
  targetAudience: string;
  status: 'Active' | 'Completed' | 'Paused';
}

export type Campaign = MarketingCampaign;

export interface Staff {
  id: string;
  staffCode: string;
  name: string;
  phone: string;
  email: string;
  username?: string;
  password?: string;
  role: UserRole;
  designation?: string;
  specialization?: string;
  avatarUrl?: string;
  joiningDate?: string;
  joinDate?: string;
  salary: number;
  lastLogin?: string;
  status: 'Active' | 'Inactive' | 'On Leave' | 'Resigned' | (string & {});
}

export interface StaffAttendanceRecord {
  id: string;
  staffId: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: 'Present' | 'Absent' | 'Late' | 'Leave';
}

export interface LeaveRequest {
  id: string;
  staffId: string;
  leaveType: 'Casual' | 'Medical' | 'Emergency' | 'Annual';
  startDate: string;
  endDate: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  appliedDate: string;
  approvedBy?: string;
}

export interface Room {
  id: string;
  name: string;
  capacity: number;
  type?: string;
  equipment?: string[];
  facilities?: string[];
  status?: 'Available' | 'Occupied' | 'Maintenance' | (string & {});
}

export interface AssetInventory {
  id: string;
  assetCode: string;
  assetTag?: string;
  name: string;
  category: 'Laptop' | 'Desktop' | 'Projector' | 'Camera' | 'Audio/Sound' | 'Printer' | 'Networking' | 'Furniture' | 'Computer' | 'Display' | 'Network' | 'Audio' | 'Other' | (string & {});
  purchaseDate: string;
  purchaseCost?: number;
  condition: 'Excellent' | 'Good' | 'Fair' | 'Needs Repair' | 'Maintenance Required' | 'Out of Order' | (string & {});
  assignedTo?: string;
  location?: string;
  room?: string;
  specs?: string;
  status?: 'In Use' | 'Spare' | 'Under Repair' | 'Disposed' | (string & {});
}

export type HardwareAsset = AssetInventory;

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userEmail?: string;
  action: string;
  module: string;
  entity?: string;
  recordId: string;
  description: string;
  details?: string;
  oldValue?: string;
  newValue?: string;
}

export interface StudentPlacement {
  id: string;
  studentId: string;
  studentName: string;
  studentCode: string;
  studentPhoto?: string;
  courseId: string;
  courseName: string;
  batchId?: string;
  batchNumber?: string;
  type: 'Full-time Job' | 'Remote Job' | 'Internship' | 'Freelancing Milestone' | 'Business / Startup';
  companyOrClient: string;
  position: string;
  monthlySalaryOrEarnings: number;
  currency: 'BDT' | 'USD';
  placementDate: string;
  location: string;
  marketplace?: 'Upwork' | 'Fiverr' | 'Local Company' | 'Remote Global' | 'Freelancer.com' | 'Direct Client' | 'Other';
  storyReview?: string;
  portfolioUrl?: string;
  status: 'Active' | 'Verified' | 'Promoted';
  createdAt?: string;
}

export interface Assignment {
  id: string;
  title: string;
  batchId: string;
  batchNumber?: string | number;
  courseId: string;
  courseName?: string;
  classNumber?: number;
  assignedDate?: string;
  dueDate: string;
  totalMarks?: number;
  maxMarks?: number;
  description: string;
  materialsUrl?: string;
  attachments?: string[];
  status?: 'Open' | 'Closed' | 'Graded';
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName?: string;
  studentCode?: string;
  submittedAt: string;
  projectUrl: string;
  githubUrl?: string;
  liveDemoUrl?: string;
  notes?: string;
  marksObtained?: number;
  trainerFeedback?: string;
  feedback?: string;
  status: 'Submitted' | 'Graded' | 'Late' | 'Resubmission Requested';
}

export interface SeminarWorkshop {
  id: string;
  title: string;
  topic?: string;
  courseId?: string;
  courseName?: string;
  category?: string;
  speakerName: string;
  speakerDesignation?: string;
  speakerTitle?: string;
  date: string;
  time: string;
  type?: 'Free Career Seminar' | 'Live Masterclass Workshop' | 'Hands-on Bootcamp' | 'Online Webinar';
  venueType?: 'Physical' | 'Online Zoom' | 'Hybrid' | 'Lab / On-Campus' | 'Online Zoom / Meet';
  room?: string;
  meetingUrl?: string;
  roomOrPlatform?: string;
  isFree?: boolean;
  ticketPrice?: number;
  capacity: number;
  registeredLeads?: string[]; // lead IDs
  registeredCount: number;
  attendedCount: number;
  convertedAdmissionsCount?: number;
  convertedToAdmissionCount?: number;
  bannerUrl?: string;
  description?: string;
  whatsappGroupUrl?: string;
  googleMapsUrl?: string;
  confirmationNote?: string;
  status: 'Upcoming' | 'Live Today' | 'Completed' | 'Cancelled';
}

export interface TrashItem {
  id: string;
  originalId: string;
  itemType:
    | 'student'
    | 'lead'
    | 'admission'
    | 'payment'
    | 'expense'
    | 'course'
    | 'batch'
    | 'staff'
    | 'asset'
    | 'schedule'
    | 'exam'
    | 'examResult'
    | 'certificate'
    | 'attendance'
    | 'placement'
    | 'assignment'
    | 'seminar';
  data: any;
  title: string;
  deletedAt: string;
  deletedBy: string;
}

export interface InstituteSettings {
  name: string;
  tagline: string;
  address: string;
  phone: string;
  altPhone?: string;
  email: string;
  website: string;
  logoUrl?: string;
  watermarkUrl?: string;
  directorName: string;
  directorTitle: string;
  sealText?: string;
}

export interface WebsiteReview {
  id: string;
  studentName: string;
  studentPhoto?: string;
  courseName: string;
  batchName?: string;
  rating: number; // 1 to 5
  reviewText: string;
  earningsOrSuccess?: string; // e.g. "Earning $600/mo on Fiverr", "Junior UI Designer at DevTeam"
  workplaceOrRole?: string;
  videoUrl?: string;
  date: string;
  isFeatured: boolean;
}

export interface WebsiteGalleryItem {
  id: string;
  title: string;
  category: 'Classroom & Labs' | 'Certification Ceremony' | 'Workshops & Events' | 'Success Stories';
  imageUrl: string;
  caption?: string;
  date?: string;
  isFeatured?: boolean;
}

export interface WebsiteNotice {
  id: string;
  title: string;
  description: string;
  category: 'Admission' | 'Exam' | 'Holiday' | 'Seminar' | 'General';
  publishedDate: string;
  fileUrl?: string;
  isUrgent?: boolean;
  isActive: boolean;
}

export interface WebsiteFaqItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface WebsiteBlogPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  coverImage: string;
  summary: string;
  content: string;
  authorName: string;
  authorRole: string;
  authorPhoto?: string;
  publishedDate: string;
  readTime: string;
  tags: string[];
  isPublished: boolean;
  viewsCount?: number;
}

export interface PhoneContactItem {
  id?: string;
  label: string; // e.g. "Direct Hotline", "Admission Desk", "Accounts & Payment", "Senior Counselor"
  number: string; // e.g. "01798444444"
  isHotline?: boolean;
  isWhatsapp?: boolean;
}

export interface EmailContactItem {
  id?: string;
  label: string; // e.g. "General Inquiry", "Admission Cell", "Career & Placement"
  email: string;
}

export interface AboutUsConfig {
  storyTitle: string;
  storyDescription: string;
  mission: string;
  vision: string;
  directorName: string;
  directorTitle: string;
  directorPhotoUrl: string;
  directorMessage: string;
  establishedYear: string;
  affiliations: string[];
  facilityHighlights: { title: string; desc: string; icon: string }[];
}

export interface SocialMediaConfig {
  facebookPageUrl: string;
  facebookGroupUrl: string;
  facebookGroupName: string;
  facebookGroupMembersCount: string;
  youtubeChannelUrl: string;
  youtubeFeaturedVideoUrl: string; // Embed URL for player
  youtubeVideoTitle: string;
  whatsappSupportNumber: string;
  whatsappCommunityUrl: string;
  linkedinUrl: string;
  instagramUrl: string;
  telegramUrl: string;
  tiktokUrl: string;
}

export interface PoliciesConfig {
  termsAndConditions: string;
  privacyPolicy: string;
  refundPolicy: string;
  codeOfConduct: string;
}

export type AppLanguage = 'en' | 'bn';

export interface HeroBannerSlide {
  id: string;
  title: string;
  subtitle: string;
  badgeText?: string;
  ctaText?: string;
  ctaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  imageUrl?: string;
  overlayGradient?: string;
  isActive: boolean;
}

export interface StudentPortalConfig {
  isPortalEnabled: boolean;
  allowSelfRegistration: boolean;
  allowOnlineFeePayment: boolean;
  allowIdCardDownload: boolean;
  allowCertificateDownload: boolean;
  allowClassRecordingAccess: boolean;
  portalNotice: string;
  portalNoticeUrgent: boolean;
}

export type NotificationTemplateType =
  | 'ADMISSION_WELCOME'
  | 'PAYMENT_RECEIPT'
  | 'DUE_REMINDER'
  | 'CLASS_SCHEDULE_NOTICE'
  | 'EXAM_ADMIT'
  | 'CERTIFICATE_READY'
  | 'SEMINAR_INVITE'
  | 'CUSTOM_NOTICE';

export interface NotificationTemplate {
  id: string;
  type: NotificationTemplateType;
  title: string;
  smsBody: string;
  whatsappBody: string;
  variables: string[];
  isActive: boolean;
}

export interface NotificationLog {
  id: string;
  recipientName: string;
  recipientPhone: string;
  channel: 'SMS' | 'WhatsApp';
  templateType: NotificationTemplateType | string;
  messageContent: string;
  status: 'Sent' | 'Delivered' | 'Failed' | 'Simulated';
  sentAt: string;
  sentBy: string;
}

export interface MarketingAnalyticsConfig {
  metaPixelId?: string; // e.g. '123456789012345'
  metaPixelEnabled?: boolean;
  metaCapiEnabled?: boolean; // Meta Conversions API (Server-Side)
  metaCapiAccessToken?: string; // System user access token for CAPI
  metaCapiTestEventCode?: string; // e.g. 'TEST12345' for Events Manager test window
  googleAnalyticsId?: string; // e.g. 'G-XXXXXXXXXX'
  googleAnalyticsEnabled?: boolean;
  googleTagManagerId?: string; // e.g. 'GTM-XXXXXX'
  googleTagManagerEnabled?: boolean;
  conversionApiToken?: string; // Legacy fallback
  tiktokPixelId?: string;
  enableAutoUtmCapture?: boolean;
  enableEventDeduplication?: boolean; // Browser & CAPI deduplication via event_id
  enableExitIntentPopup?: boolean;
  exitIntentTitle?: string;
  exitIntentSubtitle?: string;
  exitIntentDiscountCode?: string;
  enableFloatingWhatsApp?: boolean;
  floatingWhatsAppNumber?: string;
  floatingWhatsAppWelcomeText?: string;
  // Google Ads Tracking Readiness
  googleAdsConversionId?: string; // e.g. 'AW-123456789'
  googleAdsConversionLabel?: string; // e.g. 'abc-xyz'
  googleAdsEnabled?: boolean;
}

export interface GoogleBusinessProfileConfig {
  profileName?: string;
  mapsUrl?: string;
  reviewUrl?: string; // Official Google Review CTA link
  businessCategory?: string; // e.g. 'Computer Training School'
  source: 'CENTRAL_SETTINGS' | 'MANUAL_OVERRIDE';
  manualAddress?: string;
  manualPhone?: string;
  manualEmail?: string;
  manualOpeningHours?: string;
  latitude?: number | string;
  longitude?: number | string;
  mapEmbedUrl?: string;
  serviceAreas?: string[];
  verificationStatus?: 'VERIFIED_EXTERNALLY' | 'PENDING_MANUAL_VERIFICATION';
  verifiedRating?: number;
  verifiedReviewCount?: number;
}

export interface CourseSlugRedirect {
  id: string;
  fromSlug?: string;
  toSlug?: string;
  oldSlug?: string;
  newSlug?: string;
  statusCode?: 301 | 302;
  createdAt: string;
  isActive: boolean;
}

export interface GlobalSeoConfig {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  canonicalBaseUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImageUrl: string;
  twitterHandle?: string;
  geoRegion?: string; // "BD-13" (Dhaka)
  geoPlacename?: string; // "Farmgate, Dhaka"
  geoPosition?: string; // "23.7527;90.3887"
  googleSiteVerification?: string;
  bingSiteVerification?: string;
  sitemapEnabled?: boolean;
  robotsTxtEnabled?: boolean;
  robotsTxtCustomContent?: string;
  enableLocalBusinessSchema?: boolean;
  enableCourseSchema?: boolean;
  enableFaqSchema?: boolean;
  enableBreadcrumbSchema?: boolean;
  targetKeywordThemes?: string[];
  serviceAreas?: string[];
  faqItems?: { question: string; answer: string }[];
  
  // Phase 5: Google Business Profile & Local Discovery
  googleBusinessProfile?: GoogleBusinessProfileConfig;
  
  // Phase 5: Course 301/404 Redirect Map
  courseRedirects?: CourseSlugRedirect[];
  
  // Phase 5: Google Review Link
  googleReviewUrl?: string;
}

export interface WebsiteCmsConfig {
  heroHeadline: string;
  heroSubtitle: string;
  heroBadgeText: string;
  heroCtaText: string;
  heroStats: {
    totalTrained: string; // e.g. "8,500+"
    successRate: string; // e.g. "96%"
    expertTrainers: string; // e.g. "25+"
    jobPlacementRatio: string; // e.g. "88%"
  };
  topNoticeTicker: string;
  heroSlides?: HeroBannerSlide[];
  promoBanner: {
    enabled: boolean;
    title: string;
    description: string;
    discountCode: string;
    expiresAt: string;
  };
  whyChoosePoints: {
    title: string;
    description: string;
    icon: string;
  }[];
  onlineAdmissionActive: boolean;

  // SEO & Local SEO Configuration
  seo?: GlobalSeoConfig;

  // Student Portal Configuration
  studentPortal?: StudentPortalConfig;

  // Universal Lead Form Configuration (Configurable from CRM)
  leadFormConfig?: LeadFormConfig;

  // Marketing & Ad Tracking Engine (Meta Pixel, GA4, GTM, CAPI, UTMs)
  marketing?: MarketingAnalyticsConfig;

  // Fraud & Bot Protection Settings
  fraudProtection?: FraudProtectionConfig;

  // OTP Verification Settings
  otpConfig?: OtpVerificationConfig;

  // Offline Geo & Online Marketing Configurations
  offlineMarketing?: OfflineMarketingConfig;
  onlineMarketing?: OnlineMarketingConfig;

  // Global Trainer Profiles
  trainersList?: TrainerProfile[];

  // Global Reviews & Classroom Gallery
  studentCourseReviews?: StudentCourseReview[];
  classroomGalleryPhotos?: ClassroomGalleryPhoto[];

  // Notification Templates (SMS / WhatsApp)
  notificationTemplates?: NotificationTemplate[];

  // Contact details & Multiple Contacts
  multiplePhones: PhoneContactItem[];
  multipleEmails: EmailContactItem[];
  officeAddress: string;
  campusDirections?: string;
  officeHours: string;
  googleMapEmbedUrl: string;

  // Legacy fallbacks for compatibility
  whatsappSupportNumber: string;
  facebookPageUrl: string;
  youtubeChannelUrl: string;

  // Advanced Social & Community Hub
  socialLinks: SocialMediaConfig;

  // About Us Page Details
  aboutUs: AboutUsConfig;

  // Legal & Policies
  policies: PoliciesConfig;

  // Top Notice Marquee Controls
  topNoticeTickerEnabled?: boolean;
  topNoticeTickerLink?: string;

  // Video Testimonials / Success Stories
  videoTestimonials?: VideoTestimonial[];
}

export interface VideoTestimonial {
  id: string;
  studentName: string;
  courseName: string;
  videoUrl: string; // YouTube / Vimeo embed or watch URL
  thumbnailUrl?: string;
  studentAchievement?: string; // e.g. "Upwork Top Rated - $3,500/mo"
  batchNumber?: string;
  storyDescription?: string;
  isActive: boolean;
}



