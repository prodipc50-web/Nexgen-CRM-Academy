import {
  WebsiteReview,
  WebsiteGalleryItem,
  WebsiteNotice,
  WebsiteFaqItem,
  WebsiteCmsConfig,
  WebsiteBlogPost
} from '../types';

export const INITIAL_WEBSITE_CMS_CONFIG: WebsiteCmsConfig = {
  heroHeadline: 'Build Your Tech Career with Hands-on Industry Training',
  heroSubtitle: 'Master in-demand IT skills from top industry practitioners. 100% practical lab sessions, live freelance mentorship & verified corporate job placement assistance in Dhaka.',
  heroBadgeText: 'Govt. Recognized IT Training Institute • Dhaka, Bangladesh',
  heroCtaText: 'Explore Courses & Get Free Counseling',
  heroStats: {
    totalTrained: '8,500+',
    successRate: '96.4%',
    expertTrainers: '28+',
    jobPlacementRatio: '89.2%'
  },
  topNoticeTicker: '⚡ New Admission Open: Special 40% Scholarship Discount on Web Development, Graphics Design, Python AI & Cyber Security batches! Limited Seats!',
  heroSlides: [
    {
      id: 'slide-1',
      title: 'Build Your Tech Career with Hands-on Industry Training',
      subtitle: 'Master in-demand IT skills from top industry practitioners. 100% practical lab sessions, live freelance mentorship & verified corporate job placement assistance in Dhaka.',
      badgeText: 'Govt. Recognized IT Training Institute • Dhaka, Bangladesh',
      ctaText: 'Explore Courses & Get Free Counseling',
      ctaLink: '#courses',
      secondaryCtaText: 'Free Career Counseling',
      secondaryCtaLink: '#seminars',
      imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1280&q=80',
      overlayGradient: 'from-slate-950/90 via-slate-900/80 to-slate-950/90',
      isActive: true
    },
    {
      id: 'slide-2',
      title: 'Master Full Stack Web & Software Engineering',
      subtitle: 'Learn React, Node.js, Express, MongoDB, Next.js, and TypeScript with real-world industry project architecture and portfolio deployment.',
      badgeText: 'MERN & Full-Stack Career Track • Batch 2026',
      ctaText: 'View Course Syllabus',
      ctaLink: '#courses',
      secondaryCtaText: 'Upcoming Lab Batches',
      secondaryCtaLink: '#batches',
      imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1280&q=80',
      overlayGradient: 'from-indigo-950/90 via-slate-900/85 to-slate-950/90',
      isActive: true
    },
    {
      id: 'slide-3',
      title: 'Creative UI/UX, Graphic Design & Freelance Mastery',
      subtitle: 'Build an international Behance & Dribbble portfolio. Master Figma, Adobe Photoshop, Illustrator, and Upwork/Fiverr client acquisition secrets.',
      badgeText: 'Creative Design & Freelancing Cell • 100% Mentorship',
      ctaText: 'Join Next Free Masterclass',
      ctaLink: '#seminars',
      secondaryCtaText: 'Enroll with 40% Scholarship',
      secondaryCtaLink: '#admission',
      imageUrl: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=1280&q=80',
      overlayGradient: 'from-purple-950/90 via-slate-900/85 to-slate-950/90',
      isActive: true
    }
  ],
  promoBanner: {
    enabled: true,
    title: 'Up to 45% Early Bird Discount!',
    description: 'Enroll in upcoming weekend or evening batches and get lifetime lab access with certified career placement.',
    discountCode: 'NEXGEN2026',
    expiresAt: '2026-09-30'
  },
  studentPortal: {
    isPortalEnabled: true,
    allowSelfRegistration: true,
    allowOnlineFeePayment: true,
    allowIdCardDownload: true,
    allowCertificateDownload: true,
    allowClassRecordingAccess: true,
    portalNotice: 'Welcome to Nexgen Student Portal! Mid-term practical lab evaluations for all 2026 batches will commence from next week.',
    portalNoticeUrgent: false
  },
  notificationTemplates: [
    {
      id: 'tpl-1',
      type: 'ADMISSION_WELCOME',
      title: 'Admission Welcome & Student ID SMS/WhatsApp',
      smsBody: 'Dear {student_name}, Congratulations! Your admission for {course_name} at {institute_name} is confirmed. Student ID: {student_id}, Batch: {batch_number}. Portal: {portal_url}. Helpline: {helpline}.',
      whatsappBody: '🎉 *Congratulations {student_name}!* Welcome to *{institute_name}*!\n\nYour admission is confirmed for *{course_name}*.\n\n📌 *Student ID:* {student_id}\n📌 *Batch:* {batch_number}\n📌 *Learning Mode:* Practical Lab & Online\n📌 *Helpline:* {helpline}\n\n📲 Access your student portal for class schedules, digital ID card & receipts: {portal_url}\n\n_We look forward to accelerating your tech career!_',
      variables: ['student_name', 'student_id', 'course_name', 'batch_number', 'institute_name', 'helpline', 'portal_url'],
      isActive: true
    },
    {
      id: 'tpl-2',
      type: 'PAYMENT_RECEIPT',
      title: 'Money Receipt & Payment Confirmation',
      smsBody: 'Dear {student_name}, Received BDT {paid_amount} for {course_name}. Receipt No: {receipt_no}. Outstanding Due: BDT {due_amount}. Thank you, {institute_name}. Helpline: {helpline}.',
      whatsappBody: '🧾 *Official Payment Receipt - {institute_name}*\n\nDear *{student_name}*,\nWe have successfully received your course fee payment.\n\n💵 *Amount Paid:* BDT {paid_amount}\n📄 *Money Receipt No:* {receipt_no}\n📚 *Course:* {course_name}\n⏳ *Remaining Due:* BDT {due_amount}\n\n📥 Download/Print your digital money receipt anytime from the Student Portal: {portal_url}\n\nHelpline: {helpline}',
      variables: ['student_name', 'paid_amount', 'receipt_no', 'course_name', 'due_amount', 'portal_url', 'helpline', 'institute_name'],
      isActive: true
    },
    {
      id: 'tpl-3',
      type: 'DUE_REMINDER',
      title: 'Course Fee Due Reminder',
      smsBody: 'Dear {student_name}, Friendly reminder from {institute_name}: Outstanding installment fee for {course_name} is BDT {due_amount}. Please clear by due date. Helpline: {helpline}.',
      whatsappBody: '⚠️ *Course Fee Installment Reminder*\n\nDear *{student_name}* (ID: {student_id}),\n\nThis is a gentle reminder that your scheduled installment fee of *BDT {due_amount}* for *{course_name}* is pending.\n\nPlease clear the balance at the academy accounts desk or via bKash/Nagad merchant to avoid any disruption to your exam admit card.\n\n📞 Accounts Desk: {helpline}\n🌐 Student Portal: {portal_url}',
      variables: ['student_name', 'student_id', 'due_amount', 'course_name', 'helpline', 'portal_url', 'institute_name'],
      isActive: true
    },
    {
      id: 'tpl-4',
      type: 'CLASS_SCHEDULE_NOTICE',
      title: 'Batch Class Schedule & Live Meeting Link',
      smsBody: 'Dear {student_name}, Next class for {course_name} ({batch_number}) is on {class_time} at Room/Lab {room_no}. Live link: {meeting_url}. {institute_name}.',
      whatsappBody: '📢 *Class Schedule & Meeting Alert*\n\nDear *{student_name}*,\n\nYour upcoming class for *{course_name}* (*{batch_number}*) is scheduled:\n\n⏰ *Time:* {class_time}\n🏢 *Room/Lab:* {room_no}\n🔗 *Live Meeting Link:* {meeting_url}\n\nPlease join 5 minutes early with your lab assignments ready.\n\n_{institute_name}_',
      variables: ['student_name', 'course_name', 'batch_number', 'class_time', 'room_no', 'meeting_url', 'institute_name'],
      isActive: true
    },
    {
      id: 'tpl-5',
      type: 'SEMINAR_INVITE',
      title: 'Free Seminar & Career Workshop Invitation',
      smsBody: 'Dear {lead_name}, You are invited to Free Workshop on {seminar_title} on {seminar_date} at {institute_name}, Farmgate. Seats limited! Helpline: {helpline}.',
      whatsappBody: '🚀 *Invitation to Free IT Career Masterclass!*\n\nDear *{lead_name}*,\n\nYou have successfully reserved your seat for:\n🎯 *{seminar_title}*\n📅 *Date & Time:* {seminar_date}\n📍 *Venue:* {institute_name}, Farmgate Campus, Dhaka\n\nSeats are allocated on first-come-first-served basis. Please arrive 15 minutes before the session starts.\n\nHelpline: {helpline}',
      variables: ['lead_name', 'seminar_title', 'seminar_date', 'institute_name', 'helpline'],
      isActive: true
    }
  ],
  whyChoosePoints: [
    {
      title: '100% Lab-Centric Hands-on Training',
      description: 'Dedicated high-spec PC per student with high-speed internet and real-world project simulations.',
      icon: 'Monitor'
    },
    {
      title: 'Industry Veteran Mentors',
      description: 'Trainers with 7+ years of real corporate development and top-rated freelance track record.',
      icon: 'Award'
    },
    {
      title: 'Lifetime Project & Career Support',
      description: 'Free lab access even after course completion, client meeting guidance, and CV preparation.',
      icon: 'LifeBuoy'
    },
    {
      title: 'Job Placement & Freelancing Cell',
      description: 'Direct recruitment partnerships with 45+ software houses and agency referral network.',
      icon: 'Briefcase'
    }
  ],
  onlineAdmissionActive: true,

  // Contact details & Multiple Contacts
  multiplePhones: [
    { label: 'Hotline Helpline', number: '01798444444', isHotline: true, isWhatsapp: true },
    { label: 'Admission Desk', number: '+880 1711-223344', isHotline: false, isWhatsapp: false },
    { label: 'Accounts & Verification Desk', number: '+880 1912-334455', isHotline: false, isWhatsapp: false },
    { label: 'Senior Career Counselor', number: '+880 1813-445566', isHotline: false, isWhatsapp: true }
  ],
  multipleEmails: [
    { label: 'Official General Info', email: 'info@nexgenacademy.edu.bd' },
    { label: 'Online Admission Cell', email: 'admission@nexgenacademy.edu.bd' },
    { label: 'Corporate & Job Placement', email: 'careers@nexgenacademy.edu.bd' }
  ],
  officeAddress: '14/B, Garden Road, Kazipara, Farmgate, Dhaka–1215, Bangladesh',
  campusDirections: 'Behind Bashundhara City Market, 2 minutes walking distance from Farmgate Metro Station.',
  officeHours: 'Saturday to Friday: 9:00 AM – 8:00 PM (7 Days Open)',
  googleMapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.848881261358!2d90.3887!3d23.7527!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDQ1JzA5LjciTiA5MMKwMjMnMTkuMyJF!5e0!3m2!1sen!2sbd!4v1620000000000!5m2!1sen!2sbd',

  // Legacy fallbacks
  whatsappSupportNumber: '01798444444',
  facebookPageUrl: 'https://www.facebook.com/nexgencomputeracademy',
  youtubeChannelUrl: 'https://youtube.com/@nexgenacademybd',

  // Advanced Social & Community Hub
  socialLinks: {
    facebookPageUrl: 'https://www.facebook.com/nexgencomputeracademy',
    facebookGroupUrl: 'https://facebook.com/groups/nexgencommunitybd',
    facebookGroupName: 'Nexgen IT & Freelancers Community BD',
    facebookGroupMembersCount: '32,500+ Active Members',
    youtubeChannelUrl: 'https://youtube.com/@nexgenacademybd',
    youtubeFeaturedVideoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    youtubeVideoTitle: 'Campus Tour & Student Success Stories at Nexgen Computer Academy',
    whatsappSupportNumber: '01798444444',
    whatsappCommunityUrl: 'https://chat.whatsapp.com/invite/nexgenacademy',
    linkedinUrl: 'https://linkedin.com/company/nexgen-academy-bd',
    instagramUrl: 'https://instagram.com/nexgenacademybd',
    telegramUrl: 'https://t.me/nexgenacademybd',
    tiktokUrl: 'https://tiktok.com/@nexgenacademybd'
  },

  // About Us Page Details
  aboutUs: {
    storyTitle: 'Empowering Next-Generation IT Professionals Since 2018',
    storyDescription: 'Nexgen Computer Academy was founded with a single mission: to eliminate the gap between conventional textbook education and modern corporate tech requirements. Over the last 8+ years, we have nurtured more than 8,500+ young individuals across Bangladesh, turning non-coders into industry-ready software engineers, creative brand designers, data analysts, and top-tier freelancers on global marketplaces.',
    mission: 'To provide world-class, affordable, and practical technology education that enables every student to achieve financial independence through freelancing, remote jobs, and corporate IT careers.',
    vision: 'To be the leading IT center of excellence in South Asia by developing skilled manpower, fostering innovation, and bridging global tech talent demands.',
    directorName: 'Prodip Chowdhury',
    directorTitle: 'Managing Director & Lead Technology Specialist',
    directorPhotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    directorMessage: 'Technology is the great equalizer of our era. When you have genuine, practical problem-solving skills, geographic boundaries disappear. At Nexgen, our promise is not just teaching software, but providing an end-to-end mentorship ecosystem until you secure your first client or corporate job. Welcome to your future.',
    establishedYear: '2018',
    affiliations: [
      'Bangladesh Technical Education Board (BTEB) Registered Partner',
      'ISO 9001:2015 Certified Curriculum Standard',
      'BASIS (Bangladesh Association of Software and Information Services) Member Network',
      'National Youth Development ICT Skill Collaborator'
    ],
    facilityHighlights: [
      { title: 'Air-Conditioned Workstation Labs', desc: '50+ High-end Intel Core i7 & Ryzen workstations with dual monitors and GPU rendering.', icon: 'Monitor' },
      { title: 'Gigabit Fiber Internet & Backup Power', desc: 'Redundant high-speed dedicated broadband and uninterrupted online UPS system.', icon: 'Zap' },
      { title: 'Interactive Smart Seminar Hall', desc: 'Digital projector, surround acoustic sound, and live recording studio for masterclasses.', icon: 'Award' },
      { title: 'Student Innovation Lounge', desc: 'Dedicated breakout space with high-speed Wi-Fi, coffee station, and group discussion tables.', icon: 'Users' }
    ]
  },

  // SEO & Local SEO Engine (Rankings, Local Schema, SERP Previews, Sitemaps)
  seo: {
    metaTitle: 'Nexgen Computer Academy - Best Computer Training Center in Farmgate, Dhaka',
    metaDescription: 'Govt recognized top IT training institute in Farmgate, Dhaka. Practical Computer Office Application, Advanced Excel, Web Dev, Graphic Design, Digital Marketing & AI courses with 100% lab practice & job placement.',
    keywords: [
      'Computer Course in Farmgate',
      'Computer Training Center in Farmgate',
      'Computer Course in Dhaka',
      'Computer Office Application Course',
      'Advanced Excel Course in Farmgate',
      'Best IT Training Institute in Farmgate',
      'Computer Training in Farmgate',
      'Graphic Design Course Farmgate',
      'Web Development Course Farmgate',
      'AI Computer Course Dhaka',
      'Practical Computer Training Dhaka',
      'Govt Certified Computer Course Farmgate'
    ],
    canonicalBaseUrl: 'https://nexgenacademy.edu.bd',
    ogTitle: 'Nexgen Computer Academy | #1 Practical IT Training Center in Farmgate, Dhaka',
    ogDescription: 'Master Office Application, Excel, MERN Web Dev, UI/UX Design & Digital Marketing with 1-on-1 practical lab guidance & verifiable certificates.',
    ogImageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&auto=format&fit=crop&q=80',
    twitterHandle: '@nexgenacademybd',
    geoRegion: 'BD-13',
    geoPlacename: 'Farmgate, Dhaka, Bangladesh',
    geoPosition: '23.7527;90.3887',
    googleSiteVerification: 'google-site-verification-nexgen2026',
    bingSiteVerification: 'bing-site-verification-nexgen2026',
    sitemapEnabled: true,
    robotsTxtEnabled: true,
    enableLocalBusinessSchema: true,
    enableCourseSchema: true,
    enableFaqSchema: true,
    enableBreadcrumbSchema: true,
    targetKeywordThemes: [
      'Computer Course in Farmgate',
      'Computer Training Center in Farmgate',
      'Computer Course in Dhaka',
      'Computer Office Application Course',
      'Advanced Excel Course in Farmgate',
      'Computer Training in Farmgate',
      'AI Computer Course',
      'Practical Computer Training'
    ],
    serviceAreas: [
      'Farmgate',
      'Panthapath',
      'Tejgaon',
      'Dhanmondi',
      'Bijoy Sarani',
      'Indira Road',
      'Green Road',
      'Kawran Bazar',
      'Dhaka Division',
      'All Bangladesh (Online)'
    ],
    faqItems: [
      {
        question: 'Why choose Nexgen Computer Academy in Farmgate for IT courses?',
        answer: 'Nexgen Computer Academy offers 100% lab-centric practical training with dedicated high-spec PC per student, industry-expert mentors, government verifiable certificates, lifetime lab access, and job placement assistance in Dhaka.'
      },
      {
        question: 'Where is Nexgen Computer Academy located?',
        answer: 'Nexgen Computer Academy is located at 14/B, Garden Road, Kazipara, Farmgate, Dhaka–1215, Bangladesh (Behind Bashundhara City Market, easily accessible from Farmgate Metro & Panthapath).'
      },
      {
        question: 'Do you offer both Offline Classroom and Online Live courses?',
        answer: 'Yes! Students from Farmgate, Tejgaon, Dhanmondi, and Dhaka can join our AC practical lab batches, while students from across Bangladesh can join our interactive Live Online batches with class recording access.'
      }
    ]
  },

  // Marketing & Ad Tracking Engine (Meta Pixel, GA4, UTMs)
  marketing: {
    metaPixelId: '3044343639090431',
    metaPixelEnabled: true,
    googleAnalyticsId: 'G-VYNS03M91Z',
    googleAnalyticsEnabled: true,
    googleTagManagerId: 'GTM-NEXGEN99',
    googleTagManagerEnabled: false,
    conversionApiToken: 'EAAGNO4...MOCK_OR_ENV_TOKEN',
    enableAutoUtmCapture: true,
    enableExitIntentPopup: true,
    exitIntentTitle: '🎁 Wait! Special 45% Scholarship Voucher',
    exitIntentSubtitle: 'Claim your exclusive student fee discount voucher before leaving. Valid for next 24 hours!',
    exitIntentDiscountCode: 'NEXGEN-SPECIAL45',
    enableFloatingWhatsApp: true,
    floatingWhatsAppNumber: '01798444444',
    floatingWhatsAppWelcomeText: 'Hello Nexgen Academy! I want to know about course admission & scholarship discount.'
  },

  // Fraud & Bot Protection Engine
  fraudProtection: {
    enableRateLimiting: true,
    rateLimitMaxRequestsPerMinute: 5,
    enableDuplicateDetection: true,
    enableHoneypot: true,
    minSubmissionTimeSeconds: 3,
    captchaMode: 'HIGH_RISK_ONLY',
    enableRiskScoring: true,
    highRiskThreshold: 60,
    suspiciousThreshold: 30,
    autoBlockHighRisk: false
  },

  // Universal Lead Form Configuration (Configurable from CRM)
  leadFormConfig: {
    isEnabled: true,
    formTitle: 'কোর্স ভর্তি ও স্কলারশিপ আবেদন ফরম',
    formSubtitle: 'আপনার প্রয়োজনীয় তথ্য দিয়ে আবেদন করুন। আমাদের অভিজ্ঞ ক্যারিয়ার কাউন্সেলর আপনাকে সঠিক দিকনির্দেশনা প্রদান করবেন।',
    submitButtonText: 'আবেদন নিশ্চিত করুন',
    successMessage: 'আপনার তথ্য সফলভাবে গ্রহণ করা হয়েছে। আমাদের টিম শিগগিরই আপনার সাথে যোগাযোগ করবে।',
    defaultLearningMode: 'Offline',
    enableCaptcha: false,
    captchaMode: 'HIGH_RISK_ONLY',
    enableOtp: false,
    otpMode: 'OFF',
    duplicateAction: 'CREATE_FOLLOWUP',
    fields: [
      {
        id: 'f-name',
        fieldKey: 'studentName',
        label: 'আপনার নাম (Student Full Name)',
        placeholder: 'যেমন: মো: সাইফুল ইসলাম',
        enabled: true,
        required: true,
        sortOrder: 1
      },
      {
        id: 'f-phone',
        fieldKey: 'phone',
        label: 'মোবাইল নম্বর (Active WhatsApp / Phone)',
        placeholder: '017XXXXXXXX',
        enabled: true,
        required: true,
        sortOrder: 2
      },
      {
        id: 'f-course',
        fieldKey: 'courseId',
        label: 'পছন্দের কোর্স (Selected Course)',
        placeholder: 'কোর্স নির্বাচন করুন',
        enabled: true,
        required: true,
        sortOrder: 3
      },
      {
        id: 'f-schedule',
        fieldKey: 'preferredSchedule',
        label: 'সুবিধাজনক সময় (Preferred Schedule / Batch Time)',
        placeholder: 'যেমন: শুক্রবার ও শনিবার (সকাল ১০:০০ - ১২:০০)',
        enabled: true,
        required: true,
        sortOrder: 4
      },
      {
        id: 'f-mode',
        fieldKey: 'learningMode',
        label: 'শেখার মাধ্যম (Learning Mode)',
        placeholder: 'অফলাইন ল্যাব / অনলাইন লাইভ',
        enabled: true,
        required: false,
        sortOrder: 5
      },
      {
        id: 'f-email',
        fieldKey: 'email',
        label: 'ইমেইল অ্যাড্রেস (Email Address)',
        placeholder: 'example@gmail.com',
        enabled: true,
        required: false,
        sortOrder: 6
      },
      {
        id: 'f-education',
        fieldKey: 'education',
        label: 'সর্বশেষ শিক্ষাগত যোগ্যতা (Education)',
        placeholder: 'যেমন: HSC / Diploma / B.Sc / Masters',
        enabled: true,
        required: false,
        sortOrder: 7
      },
      {
        id: 'f-institution',
        fieldKey: 'institution',
        label: 'প্রতিষ্ঠান / কলেজ / বিশ্ববিদ্যালয় (Institution)',
        placeholder: 'যেমন: ঢাকা কলেজ / পলিটেকনিক',
        enabled: true,
        required: false,
        sortOrder: 8
      },
      {
        id: 'f-profession',
        fieldKey: 'profession',
        label: 'বর্তমান পেশা (Profession / Occupation)',
        placeholder: 'যেমন: Student / Job Holder / Freelancer',
        enabled: true,
        required: false,
        sortOrder: 9
      },
      {
        id: 'f-address',
        fieldKey: 'address',
        label: 'বর্তমান ঠিকানা / এলাকা (Address / City)',
        placeholder: 'যেমন: ফার্মগেট, ঢাকা',
        enabled: true,
        required: false,
        sortOrder: 10
      },
      {
        id: 'f-message',
        fieldKey: 'message',
        label: 'আপনার কোনো প্রশ্ন বা মন্তব্য থাকলে লিখুন (Message / Note)',
        placeholder: 'কোর্স সম্পর্কে আপনার কোনো প্রশ্ন থাকলে লিখুন...',
        enabled: true,
        required: false,
        sortOrder: 11
      }
    ]
  },

  // OTP Verification System
  otpConfig: {
    mode: 'OFF', // 'OFF' | 'ON' | 'HIGH_RISK_ONLY'
    provider: 'SIMULATED', // 'SMS' | 'WHATSAPP' | 'EMAIL' | 'SIMULATED'
    otpExpiryMinutes: 5,
    maxAttempts: 3,
    resendCooldownSeconds: 60,
    maxResendsPerSession: 3,
    lockoutMinutes: 15
  },

  // Offline Marketing Targeting (Farmgate + 4km radius)
  offlineMarketing: {
    centerName: 'Nexgen Computer Academy - Farmgate Center',
    primaryArea: 'Farmgate',
    radiusKm: 4,
    surroundingAreas: [
      'Farmgate',
      'Panthapath',
      'Tejgaon',
      'Dhanmondi',
      'Bijoy Sarani',
      'Indira Road',
      'Green Road',
      'Monipuripara',
      'Khamarbari',
      'Karwan Bazar',
      'Mohakhali',
      'Mirpur 10 / Kazipara'
    ],
    targetAudienceTypes: [
      'SSC & HSC Passed Students',
      'University Undergrads & Diploma Students',
      'Job Seekers & Fresh Graduates',
      'Working Professionals seeking Upskilling',
      'Aspiring Freelancers & Agency Builders'
    ]
  },

  // Online Marketing (All Bangladesh Major Cities)
  onlineMarketing: {
    targetCountry: 'Bangladesh',
    supportedCities: [
      'Dhaka',
      'Chattogram',
      'Sylhet',
      'Rajshahi',
      'Khulna',
      'Barishal',
      'Rangpur',
      'Mymensingh',
      'Cumilla',
      'Gazipur',
      'Narayanganj',
      'Bogura',
      'Cox\'s Bazar'
    ]
  },

  // Global Trainer Profiles
  trainersList: [
    {
      id: 'trainer-01',
      name: 'Prodip Chowdhury',
      designation: 'Lead Full Stack & Cloud Architect',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      phone: '01798444444',
      email: 'prodip@nexgenacademy.edu.bd',
      shortBio: '8+ Years Industry Experience in Web Architecture, MERN Stack & Cloud Engineering. Trained 3,500+ successful developers.',
      detailedBio: 'Prodip has led software engineering teams for top international startups. At Nexgen, he directs curriculum architecture ensuring 100% alignment with current Silicon Valley and EU developer job standards.',
      experienceYears: 8,
      industryExperience: '8+ Years (Former Senior Architect at DevSphere EU, BASIS Certified Trainer)',
      companyOrOrg: 'Nexgen Academy / Ex-DevSphere EU',
      certifications: ['AWS Certified Solutions Architect', 'Google Cloud Professional Cloud Architect', 'BTEB Master Assessor'],
      skills: ['React', 'Next.js', 'Node.js', 'TypeScript', 'PostgreSQL', 'Docker', 'AWS'],
      socialLinks: {
        linkedin: 'https://linkedin.com/in/prodip-chowdhury',
        github: 'https://github.com/prodip-nexgen',
        facebook: 'https://facebook.com/prodip.nexgen'
      },
      isActive: true,
      coursesAssigned: ['crs-01', 'crs-03']
    },
    {
      id: 'trainer-02',
      name: 'Nusrat Jahan Mim',
      designation: 'Senior UI/UX & Product Design Specialist',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
      phone: '01811223344',
      email: 'nusrat@nexgenacademy.edu.bd',
      shortBio: 'Top Rated Plus Upwork Designer with $120k+ earned. Expert in Figma, Design Systems, Mobile Apps & Micro-interactions.',
      detailedBio: 'Nusrat specializes in converting raw business ideas into slick, award-winning user interfaces. Her students work in leading fintech, SaaS, and creative design agencies across Bangladesh and globally.',
      experienceYears: 6,
      industryExperience: '6+ Years (Top Rated Plus Freelancer & Product Design Consultant)',
      companyOrOrg: 'Nexgen Academy / Freelance Top-Rated',
      certifications: ['Google Certified UX Designer', 'Adobe Certified Professional Illustrator & Photoshop'],
      skills: ['Figma', 'Adobe XD', 'Photoshop', 'Illustrator', 'Design Systems', 'Micro-interactions', 'Upwork Strategy'],
      socialLinks: {
        linkedin: 'https://linkedin.com/in/nusrat-jahan-mim',
        facebook: 'https://facebook.com/nusrat.design'
      },
      isActive: true,
      coursesAssigned: ['crs-02']
    },
    {
      id: 'trainer-03',
      name: 'Tanvir Hossain',
      designation: 'Senior Office Automation & Corporate Excel Trainer',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      phone: '01912334455',
      email: 'tanvir@nexgenacademy.edu.bd',
      shortBio: 'Corporate IT Consultant with 7+ years of experience training banking, corporate and government executives.',
      detailedBio: 'Tanvir has trained over 2,000 corporate staff in Advanced Excel, MIS Reporting, Financial Modeling, PowerPoint presentations, and AI-powered office workflows.',
      experienceYears: 7,
      industryExperience: '7+ Years in Corporate Training & MIS Consultancy',
      companyOrOrg: 'Nexgen Academy / Corporate MIS Consultant',
      certifications: ['Microsoft Certified: Excel Expert', 'BTEB Certified Computer Office Application Instructor'],
      skills: ['Advanced Excel', 'MS Word', 'PowerPoint', 'VBA & Macros', 'MIS Reporting', 'ChatGPT Prompting', 'Typing Mastery'],
      socialLinks: {
        facebook: 'https://facebook.com/tanvir.office.trainer'
      },
      isActive: true,
      coursesAssigned: ['crs-01', 'crs-04']
    }
  ],

  // Global Student Reviews
  studentCourseReviews: [
    {
      id: 'rev-01',
      courseId: 'crs-01',
      studentName: 'মেহেদী হাসান রনি',
      studentPhoto: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
      rating: 5,
      reviewText: 'অফিস অ্যাপ্লিকেশন ও এক্সেল শেখার পর আমার কর্পোরেট জবে রিপোর্টিংয়ের স্পিড অনেক বেড়েছে। প্রদীপ স্যারের গাইডেন্স ও ল্যাব সাপোর্ট অসাধারণ ছিল!',
      reviewType: 'Text',
      location: 'ফার্মগেট, ঢাকা',
      profession: 'জুনিয়র এক্সিকিউটিভ, প্রাইভেট ব্যাংক',
      batchNumber: 'ব্যাচ ০৪',
      reviewDate: '২০২৬-০৮-১০',
      isVerified: true,
      isFeatured: true,
      sortOrder: 1,
      isActive: true
    },
    {
      id: 'rev-02',
      courseId: 'crs-02',
      studentName: 'সাদিয়া আক্তার রিমা',
      studentPhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
      rating: 5,
      reviewText: 'নুসরাত ম্যামের গ্রাফিক্স ও UI ডিজাইনের ক্লাস একদম জিরো থেকে অ্যাডভান্সড পর্যন্ত করানো হয়। কোর্স শেষেই আমি ফাইভারে ১ম অর্ডার সম্পন্ন করেছি ($120)!',
      reviewType: 'Text',
      location: 'ধানমন্ডি, ঢাকা',
      profession: 'ফ্রিল্যান্সার ও গ্রাফিক ডিজাইনার',
      batchNumber: 'ব্যাচ ০২',
      reviewDate: '২০২৬-০৮-১৫',
      isVerified: true,
      isFeatured: true,
      sortOrder: 2,
      isActive: true
    },
    {
      id: 'rev-03',
      courseId: 'crs-03',
      studentName: 'আরিফুল ইসলাম সাকিব',
      studentPhoto: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80',
      rating: 5,
      reviewText: 'ফুলস্ট্যাক ওয়েব ডেভেলপমেন্টের রিয়েল লাইফ প্রজেক্ট ও এপিআই আর্কিটেকচার এখানে যেভাবে শেখানো হয়েছে, তা কোনো সাধারণ অনলাইন কোর্সে পাওয়া সম্ভব নয়।',
      reviewType: 'Text',
      location: 'মিরপুর, ঢাকা',
      profession: 'জুনিয়র রিঅ্যাক্ট ডেভেলপার, সফটওয়্যার ফার্ম',
      batchNumber: 'ব্যাচ ০১',
      reviewDate: '২০২৬-০৮-২০',
      isVerified: true,
      isFeatured: true,
      sortOrder: 3,
      isActive: true
    }
  ],

  // Global Classroom & Lab Gallery
  classroomGalleryPhotos: [
    {
      id: 'photo-01',
      title: 'মডার্ন হাই-স্পেক কম্পিউটার ল্যাব ও প্র্যাকটিক্যাল সেশন',
      caption: 'প্রতিটি শিক্ষার্থীর জন্য ডেডিকেটেড হাই-কনফিগ পিসি, ডুয়েল ডিসপ্লে ও ফাইবার ইন্টারনেট সাপোর্ট।',
      imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
      category: 'Classroom & Labs',
      batchNumber: 'ব্যাচ ২০২৬',
      date: '২০২৬-০৮-১২',
      sortOrder: 1,
      isActive: true
    },
    {
      id: 'photo-02',
      title: 'সার্টিফিকেট প্রদান ও গ্র্যাজুয়েশন সেরেমনি',
      caption: 'কোর্স ও প্রজেক্ট সফলভাবে সম্পন্নকারীদের ভেরিফায়েবল সার্টিফিকেট ও অ্যাওয়ার্ড প্রদান।',
      imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80',
      category: 'Ceremony & Certification',
      batchNumber: 'গ্র্যাজুয়েশন ফেস্ট',
      date: '২০২৬-০৭-৩০',
      sortOrder: 2,
      isActive: true
    },
    {
      id: 'photo-03',
      title: 'লাইভ প্রজেক্ট সলভিং ও মেন্টরশিপ ডিসকাশন',
      caption: 'সরাসরি ট্রেইনারের তত্ত্বাবধানে কোডিং ও ডিজাইন বাগ ফিক্সিং সেশন।',
      imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80',
      category: 'Practical Session',
      batchNumber: 'ব্যাচ ০৫',
      date: '২০২৬-০৮-১৮',
      sortOrder: 3,
      isActive: true
    },
    {
      id: 'photo-04',
      title: 'ফ্রি ক্যারিয়ার সেমিনার ও ফ্রিল্যান্সিং গাইডলাইন',
      caption: 'ফার্মগেট ক্যাম্পাসে অনুষ্ঠিত ক্যারিয়ার ও মার্কেটপ্লেস ওরিয়েন্টেশন সেশন।',
      imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80',
      category: 'Workshop',
      date: '২০২৬-০৮-২৫',
      sortOrder: 4,
      isActive: true
    }
  ],

  // Legal & Policies
  policies: {
    termsAndConditions: `### 1. Admission & Seat Confirmation
Enrollment in any course at Nexgen Computer Academy is confirmed only after the payment of the initial registration fee or installment. Seats are allocated on a strictly first-come, first-served basis.

### 2. Class Attendance & Discipline
Students must maintain at least 75% attendance to qualify for the final certification exam and portfolio review. Proper decorum, respect toward trainers and peers, and adherence to lab safety guidelines are mandatory.

### 3. Fee Payment Policy
Course fees paid in installments must be cleared before the scheduled due dates. The Academy reserves the right to withhold exam admit cards and certificate release if dues remain unsettled.

### 4. Lab Equipment Usage
All computer hardware and software resources are provided for educational purposes. Any intentional physical damage or tampering with system configurations will incur replacement penalties.

### 5. Certification Eligibility
To receive the official, digitally verifiable certificate, students must complete all mandatory projects, pass the written/practical evaluation, and achieve at least Grade 'C' (50%+ marks).`,
    privacyPolicy: `### 1. Information We Collect
We collect personal information such as full name, contact numbers, email address, educational background, and payment details purely for student registration, academic recordkeeping, and certificate verification.

### 2. Data Security & Storage
All student information is stored securely in our encrypted database system. We implement industry-standard encryption and strict access controls to prevent unauthorized access.

### 3. Communication & Updates
We may send SMS, WhatsApp, or email notifications regarding class schedules, exam dates, fee reminders, holiday notices, and career seminar invitations. You may opt out of promotional updates anytime.

### 4. No Third-Party Sharing
Nexgen Computer Academy strictly pledges never to sell, rent, or trade your personal data with third-party advertisers or marketing agencies. Data is only shared with official certification boards upon student consent.`,
    refundPolicy: `### 1. Refund Requests
Students may request a refund in writing within 3 calendar days of the official batch orientation. A nominal administrative processing fee of 10% will be deducted.

### 2. Post-Commencement Policy
No refund requests will be accepted once regular classroom curriculum sessions (Class 2 onwards) have commenced. However, students may request a batch transfer or course pause for valid medical or personal emergencies.`,
    codeOfConduct: `### 1. Respect & Inclusivity
We foster a welcoming, respectful, and harassment-free learning atmosphere for all students regardless of gender, background, or skill level.

### 2. Academic Integrity
Plagiarism, submitting another student's work as your own, or illicit sharing of academy course materials without authorization is strictly prohibited.`
  }
};

export const INITIAL_WEBSITE_BLOGS: WebsiteBlogPost[] = [
  {
    id: 'blog-1',
    title: 'How to Land High-Paying Remote Web Development Jobs from Bangladesh in 2026',
    slug: 'land-remote-web-development-jobs-2026',
    category: 'Web Development',
    coverImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80',
    summary: 'A step-by-step roadmap for mastering modern React, TypeScript, and Full-Stack Node.js to secure $1,500+ monthly international remote contracts.',
    content: `International companies are hiring talented developers from Bangladesh more than ever before. However, generic tutorials are no longer enough. Here are the 4 key pillars you need:

1. **Master Modern Stack Fundamentals:** Focus on TypeScript, React 19, Next.js, and scalable REST/GraphQL APIs.
2. **Build Verifiable Production-Grade Projects:** Instead of simple clones, create functional SaaS applications with payment gateways, authentication, and live cloud deployment.
3. **Optimize Your GitHub & LinkedIn:** Maintain clean commit histories, well-documented READMEs, and showcase your live demo URLs.
4. **Client Communication & English Skills:** Practice explaining technical architecture concisely. This is often the deciding factor in remote salary negotiations.`,
    authorName: 'Prodip Chowdhury',
    authorRole: 'Managing Director & Lead Tech Mentor',
    authorPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    publishedDate: '2026-08-18',
    readTime: '5 min read',
    tags: ['Web Development', 'Career Guide', 'Freelancing', 'Remote Jobs'],
    isPublished: true,
    viewsCount: 1420
  },
  {
    id: 'blog-2',
    title: 'Top 7 UI/UX Design Trends Dominating Global Marketplaces This Year',
    slug: 'ui-ux-design-trends-2026',
    category: 'UI/UX Design',
    coverImage: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800&auto=format&fit=crop&q=80',
    summary: 'Discover how spatial interfaces, micro-interactions, and design systems in Figma are creating unprecedented freelance demand.',
    content: `Product design is evolving rapidly. Clients on Upwork and direct agencies in Europe and the USA are paying premium rates for UI/UX designers who understand user psychology.

- **Design Systems & Tokenization:** Auto-layout mastery and reusable component libraries are must-have skills.
- **Data-Driven UX Wireframing:** Learn how to conduct user interviews, heatmaps, and usability testing.
- **Micro-Interactions & Prototyping:** Bringing static designs to life with smart animations creates instant client delight.
- **Accessibility (WCAG AA):** High-contrast, clean typography, and mobile-first ergonomics.`,
    authorName: 'Nusrat Jahan Mim',
    authorRole: 'Senior UI/UX Specialist',
    authorPhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
    publishedDate: '2026-08-12',
    readTime: '4 min read',
    tags: ['UI/UX', 'Figma', 'Product Design', 'Freelancing'],
    isPublished: true,
    viewsCount: 980
  },
  {
    id: 'blog-3',
    title: 'Starting Freelancing from Scratch: The Complete Beginner’s Roadmap',
    slug: 'starting-freelancing-roadmap-beginners',
    category: 'Freelancing',
    coverImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80',
    summary: 'Avoid common beginner mistakes on Upwork and Fiverr with our tried-and-tested profile optimization strategies.',
    content: `Many beginners make the mistake of opening freelancer accounts before acquiring solid skills. Follow this structured roadmap to succeed:

1. **Pick One In-Demand Niche:** Specialize in a focused domain like Brand Identity, React Frontend, or Digital Ad Optimization.
2. **Build 5 Solid Portfolio Items:** Create realistic client case studies showcasing problem, process, and final deliverable.
3. **Craft Winning Cover Letters:** Never use generic copy-pasted templates. Mention the client's specific problem in the very first sentence.
4. **Deliver Exceptional Customer Service:** Over-communicate, meet deadlines early, and ask for 5-star reviews to boost your algorithm ranking.`,
    authorName: 'Ariful Islam',
    authorRole: 'Freelance Marketplace Strategist',
    authorPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    publishedDate: '2026-08-04',
    readTime: '6 min read',
    tags: ['Freelancing', 'Upwork', 'Fiverr', 'Career Tips'],
    isPublished: true,
    viewsCount: 2310
  }
];

export const INITIAL_WEBSITE_REVIEWS: WebsiteReview[] = [
  {
    id: 'rev-1',
    studentName: 'Tanvir Hossain',
    studentPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    courseName: 'Full Stack Web Development (MERN)',
    batchName: 'NCA-WEB-2026-B1',
    rating: 5,
    reviewText: 'Nexgen Academy helped me transition from a non-CS background to a remote Frontend Developer at an agency in Singapore. The project-based assignments and mentor support were phenomenal!',
    earningsOrSuccess: 'Frontend Developer @ SoftTech ($750/month)',
    workplaceOrRole: 'Junior Developer',
    date: '2026-06-15',
    isFeatured: true
  },
  {
    id: 'rev-2',
    studentName: 'Nusrat Jahan Mim',
    studentPhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    courseName: 'UI/UX Design & Figma Mastery',
    batchName: 'NCA-UI-2026-B1',
    rating: 5,
    reviewText: 'The UI/UX course curriculum is completely modern. Within 3 months of completing the course, I got 2 direct client projects through the Academy’s freelance workshop.',
    earningsOrSuccess: 'Fiverr Level 2 Seller ($1,200+ monthly)',
    workplaceOrRole: 'Product Designer',
    date: '2026-07-02',
    isFeatured: true
  },
  {
    id: 'rev-3',
    studentName: 'Ariful Islam Chowdhury',
    studentPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    courseName: 'Professional Graphics Design & Branding',
    batchName: 'NCA-GD-2025-B4',
    rating: 5,
    reviewText: 'Best IT academy in Farmgate area! Air-conditioned labs, personal high-speed PCs, and very friendly teachers who guide every single student individually until concepts are clear.',
    earningsOrSuccess: 'Brand Designer @ CreativeHive Dhaka',
    workplaceOrRole: 'Brand Designer',
    date: '2026-05-20',
    isFeatured: true
  },
  {
    id: 'rev-4',
    studentName: 'Sabbir Ahmed Khan',
    studentPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    courseName: 'Digital Marketing & Growth Hacking',
    batchName: 'NCA-DM-2026-B2',
    rating: 5,
    reviewText: 'Their live ad campaigns and SEO practical audits gave me the confidence to handle high-budget client campaigns. Nexgen’s certificate is highly respected in the industry.',
    earningsOrSuccess: 'Marketing Lead @ EduZone BD',
    workplaceOrRole: 'Marketing Specialist',
    date: '2026-08-01',
    isFeatured: true
  }
];

export const INITIAL_WEBSITE_GALLERY: WebsiteGalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Modern High-Performance Lab 101 Session',
    category: 'Classroom & Labs',
    imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80',
    caption: 'Students practicing live React & Node.js backend coding in our Farmgate high-speed workstation lab.',
    date: '2026-07-10',
    isFeatured: true
  },
  {
    id: 'gal-2',
    title: 'Batch 28 Convocation & Certificate Award Ceremony',
    category: 'Certification Ceremony',
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80',
    caption: 'Our graduated students receiving verified government-accredited IT certificates with our honorable chief guest.',
    date: '2026-06-25',
    isFeatured: true
  },
  {
    id: 'gal-3',
    title: 'Free Career Seminar on AI Tools & Modern Freelancing',
    category: 'Workshops & Events',
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80',
    caption: 'Over 120 aspiring youths participating in our interactive tech workshop at the seminar hall.',
    date: '2026-08-05',
    isFeatured: true
  },
  {
    id: 'gal-4',
    title: 'UI/UX Design Studio & Wireframing Jam',
    category: 'Classroom & Labs',
    imageUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop&q=80',
    caption: 'Designers presenting micro-interaction prototypes and user-journey maps in team review.',
    date: '2026-07-18',
    isFeatured: true
  },
  {
    id: 'gal-5',
    title: 'Student Success Celebration: Hired at Top Software House',
    category: 'Success Stories',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80',
    caption: 'Celebrating our alumni team landing their first international developer contracts.',
    date: '2026-08-12',
    isFeatured: true
  }
];

export const INITIAL_WEBSITE_NOTICES: WebsiteNotice[] = [
  {
    id: 'not-1',
    title: 'Admission Open for September 2026 Weekend & Evening Batches',
    description: 'Limited seats available in Web Dev, UI/UX, and Graphics Design. Early registrations receive 40% discount.',
    category: 'Admission',
    publishedDate: '2026-08-15',
    isUrgent: true,
    isActive: true
  },
  {
    id: 'not-2',
    title: 'Upcoming Free Masterclass on Modern Full-Stack & Next.js 15',
    description: 'Join this Friday at 4:00 PM in Seminar Hall 1 or Live on Zoom. Free certificate for all attendees.',
    category: 'Seminar',
    publishedDate: '2026-08-20',
    isUrgent: false,
    isActive: true
  },
  {
    id: 'not-3',
    title: 'Government Accredited Board Exam Registration Deadline',
    description: 'All 6-month diploma students must submit their admit card verification forms by the 28th of this month.',
    category: 'Exam',
    publishedDate: '2026-08-10',
    isUrgent: false,
    isActive: true
  }
];

export const INITIAL_WEBSITE_FAQS: WebsiteFaqItem[] = [
  {
    id: 'faq-1',
    question: 'How do I enroll in a course at Nexgen Computer Academy?',
    answer: 'You can register online directly through our website by clicking the "Enroll Now" or "Online Admission" button, or visit our Farmgate campus in person for direct on-desk admission with our counselors.',
    category: 'Admission'
  },
  {
    id: 'faq-2',
    question: 'Are the course certificates government recognized and verifiable?',
    answer: 'Yes! All students who successfully complete their coursework and capstone exams receive an official certificate with a unique QR code and Registration ID that can be instantly verified on our website.',
    category: 'Certification'
  },
  {
    id: 'faq-3',
    question: 'Can non-science / non-technical students learn programming or design here?',
    answer: 'Absolutely! Our courses start from absolute ground zero. We provide step-by-step beginner-friendly guidance, individual mentor reviews, and extra support classes so anyone can master the skills.',
    category: 'Academics'
  },
  {
    id: 'faq-4',
    question: 'Do you provide installment payment facilities for student course fees?',
    answer: 'Yes, we offer flexible 2-to-3 installment payment plans for all long-term courses, making professional IT education affordable for everyone.',
    category: 'Payments'
  },
  {
    id: 'faq-5',
    question: 'What kind of freelance and job placement support do you provide?',
    answer: 'Our dedicated Career Cell conducts weekly client communication workshops, Fiverr/Upwork profile optimization sessions, mock technical interviews, and directly connects top graduates with partnering tech firms.',
    category: 'Career'
  }
];
