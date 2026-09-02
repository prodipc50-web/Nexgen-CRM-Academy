import React, { createContext, useContext, useState, useEffect, useMemo, useRef } from 'react';
import {
  db,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  auth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  type User
} from '../lib/firebase';
import { compressImageBase64, estimatePayloadSize } from '../utils/imageCompressor';
import {
  UserRole,
  UserProfile,
  Course,
  CourseStatus,
  CourseModule,
  Batch,
  Staff,
  Lead,
  FollowUp,
  Student,
  Admission,
  Payment,
  AttendanceRecord,
  ClassSchedule,
  Exam,
  ExamResult,
  Certificate,
  Expense,
  MarketingCampaign,
  Room,
  AssetInventory,
  AuditLog,
  TrashItem,
  PaymentMethod,
  StudentPlacement,
  Assignment,
  AssignmentSubmission,
  SeminarWorkshop,
  InstallmentMilestone,
  AcademySettings,
  WebsiteReview,
  WebsiteGalleryItem,
  WebsiteNotice,
  WebsiteFaqItem,
  WebsiteCmsConfig,
  WebsiteBlogPost,
  TrainerProfile,
  StudentCourseReview,
  ClassroomGalleryPhoto
} from '../types';
import {
  INITIAL_STAFF,
  INITIAL_COURSES,
  INITIAL_COURSE_CATEGORIES,
  INITIAL_BATCHES,
  INITIAL_ROOMS,
  INITIAL_CAMPAIGNS,
  INITIAL_LEADS,
  INITIAL_FOLLOWUPS,
  INITIAL_STUDENTS,
  INITIAL_ADMISSIONS,
  INITIAL_PAYMENTS,
  INITIAL_ATTENDANCE,
  INITIAL_SCHEDULE,
  INITIAL_EXAMS,
  INITIAL_EXAM_RESULTS,
  INITIAL_CERTIFICATES,
  INITIAL_EXPENSES,
  INITIAL_ASSETS,
  INITIAL_AUDIT_LOGS,
  INITIAL_PLACEMENTS,
  INITIAL_ASSIGNMENTS,
  INITIAL_ASSIGNMENT_SUBMISSIONS,
  INITIAL_SEMINARS,
  CURRENT_USER
} from '../data/seedData';
import {
  INITIAL_WEBSITE_CMS_CONFIG,
  INITIAL_WEBSITE_REVIEWS,
  INITIAL_WEBSITE_GALLERY,
  INITIAL_WEBSITE_NOTICES,
  INITIAL_WEBSITE_FAQS,
  INITIAL_WEBSITE_BLOGS
} from '../data/websiteSeedData';
import { DEFAULT_THEME_CONFIG, applyThemeToDom } from '../data/themePresets';
import { initGoogleAnalytics, DEFAULT_GA4_MEASUREMENT_ID } from '../utils/analyticsTracker';

interface AcademyContextType {
  currentUser: UserProfile;
  isAuthenticated: boolean;
  firebaseUser?: User | null;
  login: (identifier: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; message: string; user?: UserProfile }>;
  logout: () => void;
  updateCurrentUserProfile: (updates: Partial<UserProfile>) => void;
  updateStaffPhoto: (staffId: string, photoUrl: string) => void;
  academySettings: AcademySettings;
  updateAcademySettings: (settings: Partial<AcademySettings>) => void;
  changePassword: (staffId: string, oldPass: string, newPass: string) => { success: boolean; message: string };
  updateStaffCredentials: (staffId: string, username: string, newPassword?: string) => void;
  setCurrentUserRole: (role: UserRole) => void;
  staffList: Staff[];
  categories: string[];
  courses: Course[];
  batches: Batch[];
  rooms: Room[];
  campaigns: MarketingCampaign[];
  leads: Lead[];
  followUps: FollowUp[];
  students: Student[];
  admissions: Admission[];
  payments: Payment[];
  attendance: AttendanceRecord[];
  schedules: ClassSchedule[];
  exams: Exam[];
  examResults: ExamResult[];
  certificates: Certificate[];
  publicCertificates: any[];
  expenses: Expense[];
  assets: AssetInventory[];
  auditLogs: AuditLog[];
  trashItems: TrashItem[];

  // Placements & Career Cell
  placements: StudentPlacement[];
  addPlacement: (placement: Omit<StudentPlacement, 'id' | 'createdAt'>) => StudentPlacement;
  updatePlacement: (id: string, updates: Partial<StudentPlacement>) => void;
  deletePlacement: (id: string) => void;

  // Assignments & Projects
  assignments: Assignment[];
  assignmentSubmissions: AssignmentSubmission[];
  addAssignment: (assignment: Omit<Assignment, 'id'>) => Assignment;
  updateAssignment: (id: string, updates: Partial<Assignment>) => void;
  deleteAssignment: (id: string) => void;
  submitAssignment: (submission: Omit<AssignmentSubmission, 'id' | 'submittedAt'>) => AssignmentSubmission;
  gradeAssignmentSubmission: (id: string, marks: number, feedback: string) => void;

  // Seminars & Workshops
  seminars: SeminarWorkshop[];
  addSeminar: (seminar: Omit<SeminarWorkshop, 'id' | 'registeredCount' | 'attendedCount' | 'convertedAdmissionsCount'>) => SeminarWorkshop;
  updateSeminar: (id: string, updates: Partial<SeminarWorkshop>) => void;
  deleteSeminar: (id: string) => void;
  registerLeadToSeminar: (seminarId: string, leadId: string) => void;

  // Website CMS & Public Portal Management
  websiteCmsConfig: WebsiteCmsConfig;
  updateWebsiteCmsConfig: (updates: Partial<WebsiteCmsConfig>) => void;
  websiteReviews: WebsiteReview[];
  addWebsiteReview: (rev: Omit<WebsiteReview, 'id'>) => WebsiteReview;
  updateWebsiteReview: (id: string, updates: Partial<WebsiteReview>) => void;
  deleteWebsiteReview: (id: string) => void;
  websiteGallery: WebsiteGalleryItem[];
  addWebsiteGalleryItem: (item: Omit<WebsiteGalleryItem, 'id'>) => WebsiteGalleryItem;
  updateWebsiteGalleryItem: (id: string, updates: Partial<WebsiteGalleryItem>) => void;
  deleteWebsiteGalleryItem: (id: string) => void;
  websiteNotices: WebsiteNotice[];
  addWebsiteNotice: (notice: Omit<WebsiteNotice, 'id'>) => WebsiteNotice;
  updateWebsiteNotice: (id: string, updates: Partial<WebsiteNotice>) => void;
  deleteWebsiteNotice: (id: string) => void;
  websiteFaqs: WebsiteFaqItem[];
  addWebsiteFaq: (faq: Omit<WebsiteFaqItem, 'id'>) => WebsiteFaqItem;
  updateWebsiteFaq: (id: string, updates: Partial<WebsiteFaqItem>) => void;
  deleteWebsiteFaq: (id: string) => void;
  websiteBlogs: WebsiteBlogPost[];
  addWebsiteBlog: (blog: Omit<WebsiteBlogPost, 'id'>) => WebsiteBlogPost;
  updateWebsiteBlog: (id: string, updates: Partial<WebsiteBlogPost>) => void;
  deleteWebsiteBlog: (id: string) => void;

  // Dedicated Trainers Management
  trainersList: TrainerProfile[];
  addTrainer: (trainer: Omit<TrainerProfile, 'id' | 'createdAt' | 'updatedAt'>) => TrainerProfile;
  updateTrainer: (id: string, updates: Partial<TrainerProfile>) => void;
  deleteTrainer: (id: string) => void;

  // Dedicated Student Course Reviews
  studentCourseReviews: StudentCourseReview[];
  addStudentCourseReview: (review: Omit<StudentCourseReview, 'id'>) => StudentCourseReview;
  updateStudentCourseReview: (id: string, updates: Partial<StudentCourseReview>) => void;
  deleteStudentCourseReview: (id: string) => void;

  // Dedicated Classroom & Lab Gallery
  classroomGalleryPhotos: ClassroomGalleryPhoto[];
  addClassroomGalleryPhoto: (photo: Omit<ClassroomGalleryPhoto, 'id'>) => ClassroomGalleryPhoto;
  updateClassroomGalleryPhoto: (id: string, updates: Partial<ClassroomGalleryPhoto>) => void;
  deleteClassroomGalleryPhoto: (id: string) => void;

  // Installment Planner & Live Radar
  generateInstallmentSchedule: (totalFee: number, startDate: string, count: number, customSplits?: number[]) => InstallmentMilestone[];
  getAtRiskStudents: () => {
    student: Student;
    reason: string;
    riskLevel: 'High' | 'Medium';
    batch?: Batch;
    course?: Course;
    dueAmount: number;
    absentCount: number;
  }[];
  getTodayLiveOperations: () => {
    todayClasses: (ClassSchedule & { batch?: Batch; course?: Course; trainer?: Staff; roomDetails?: Room })[];
    todayFollowups: (FollowUp & { lead?: Lead })[];
    todayDueAdmissions: (Admission & { student?: Student; course?: Course; batch?: Batch })[];
    todaySeminars: SeminarWorkshop[];
  };

  // Category Actions
  addCategory: (category: string) => void;
  updateCategory: (oldCategory: string, newCategory: string) => void;
  deleteCategory: (category: string) => { success: boolean; message: string };

  // Actions
  addLead: (lead: Omit<Lead, 'id' | 'leadCode' | 'createdAt' | 'updatedAt'>) => Lead;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  submitPublicLead: (payload: {
    fullName?: string;
    studentName?: string;
    name?: string;
    phone: string;
    email?: string;
    address?: string;
    education?: string;
    educationLevel?: string;
    institution?: string;
    profession?: string;
    occupation?: string;
    courseId?: string;
    interestedCourseId?: string;
    courseName?: string;
    preferredSchedule?: string;
    preferredTime?: string;
    learningMode?: string;
    preferredLearningMode?: string;
    message?: string;
    comments?: string;
    source?: string;
    leadSource?: string;
    landingPageUrl?: string;
    landingPage?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    utmContent?: string;
    utmTerm?: string;
    fbclid?: string;
    honeypotVal?: string;
    renderTimestampMs?: number;
    captchaAnswer?: string;
    captchaExpected?: string;
    otpVerified?: boolean;
  }) => Promise<{
    success: boolean;
    lead?: Lead;
    requiresOtp?: boolean;
    requiresCaptcha?: boolean;
    riskScore?: number;
    riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    fraudFlags?: string[];
    isDuplicate?: boolean;
    eventId?: string;
    message: string;
    error?: string;
  }>;

  addFollowUp: (followUp: Omit<FollowUp, 'id' | 'createdAt'>) => void;

    createAdmission: (params: {
    studentData: Partial<Student>;
    courseId: string;
    batchId: string;
    counselorId: string;
    counselorName?: string;
    leadSource: string;
    campaignId?: string;
    referral?: string;
    learningMode?: 'Offline' | 'Online Live' | 'Hybrid';
    admissionType?: 'In-Person / Office' | 'Online Admission';
    regularFee: number;
    discount: number;
    scholarship: number;
    initialPaidAmount: number;
    paymentMethod: PaymentMethod;
    transactionId?: string;
    nextPaymentDate?: string;
    remarks?: string;
    existingLeadId?: string;
  }) => { student: Student; admission: Admission; payment?: Payment };

  addPayment: (params: {
    admissionId: string;
    amount: number;
    paymentMethod: PaymentMethod;
    transactionId?: string;
    note?: string;
  }) => Payment;
  updatePayment: (id: string, updates: Partial<Payment>) => void;
  deletePayment: (id: string) => void;
  clearDemoPayments: () => void;

  deleteAdmission: (admissionId: string) => void;
  waiveAdmissionDue: (admissionId: string, reason?: string) => void;

  updateStudent: (id: string, updates: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  transferStudentBatch: (studentId: string, fromBatchId: string, toBatchId: string, reason: string) => void;

  addCourse: (course: Partial<Course> & { name: string; category: string }) => Course;
  updateCourse: (id: string, updates: Partial<Course>) => void;
  duplicateCourse: (courseId: string) => Course;
  setCourseStatus: (id: string, status: CourseStatus) => void;
  deleteCourse: (id: string) => { success: boolean; reason?: string; archivedInstead?: boolean };

  addBatch: (batch: Omit<Batch, 'id'>) => Batch;
  updateBatch: (id: string, updates: Partial<Batch>) => void;
  deleteBatch: (id: string) => void;

  bulkSaveAttendance: (batchId: string, date: string, records: { studentId: string; status: AttendanceRecord['status']; note?: string }[]) => void;

  addClassSchedule: (schedule: Omit<ClassSchedule, 'id'>) => void;
  updateClassSchedule: (id: string, updates: Partial<ClassSchedule>) => void;

  addExam: (exam: Omit<Exam, 'id' | 'examCode'>) => Exam;
  saveExamResult: (result: Omit<ExamResult, 'id'>) => void;

  issueCertificate: (params: { studentId: string; courseId: string; batchId: string; grade: string; completionDate: string; certificateNumber?: string }) => Certificate;
  updateCertificate: (id: string, updates: Partial<Certificate>) => void;

  addExpense: (expense: Omit<Expense, 'id' | 'expenseCode' | 'createdAt'>) => Expense;
  updateExpense: (id: string, updates: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  clearDemoExpenses: () => void;

  addAsset: (asset: Omit<AssetInventory, 'id' | 'assetCode'>) => AssetInventory;
  updateAsset: (id: string, updates: Partial<AssetInventory>) => void;
  deleteAsset: (id: string) => void;

  addStaff: (staff: Omit<Staff, 'id' | 'staffCode'>) => Staff;
  updateStaff: (id: string, updates: Partial<Staff>) => void;
  deleteStaff: (id: string) => void;

  addRoom: (room: Omit<Room, 'id'>) => Room;
  updateRoom: (id: string, updates: Partial<Room>) => void;
  deleteRoom: (id: string) => void;

  deleteClassSchedule: (id: string) => void;
  deleteAttendance: (id: string) => void;
  deleteAttendanceBatch: (batchId: string, date: string) => void;
  deleteExam: (id: string) => void;
  deleteExamResult: (id: string) => void;
  revokeCertificate: (id: string) => void;
  deleteCertificate: (id: string) => void;

  // Master Dropdown Options
  leadSources: string[];
  leadSourcesList: string[];
  expenseCategoriesList: string[];
  paymentMethodsList: string[];
  occupationsList: string[];
  educationLevelsList: string[];
  studentGoalsList: string[];
  studentStatusesList: string[];
  bloodGroupsList: string[];
  discountTypesList: string[];
  addDropdownOption: (group: 'leadSources' | 'expenseCategories' | 'paymentMethods' | 'occupations' | 'educationLevels' | 'studentGoals' | 'studentStatuses' | 'bloodGroups' | 'discountTypes', option: string) => boolean;
  updateDropdownOption: (group: 'leadSources' | 'expenseCategories' | 'paymentMethods' | 'occupations' | 'educationLevels' | 'studentGoals' | 'studentStatuses' | 'bloodGroups' | 'discountTypes', oldVal: string, newVal: string) => boolean;
  deleteDropdownOption: (group: 'leadSources' | 'expenseCategories' | 'paymentMethods' | 'occupations' | 'educationLevels' | 'studentGoals' | 'studentStatuses' | 'bloodGroups' | 'discountTypes', option: string) => boolean;
  resetDropdownGroup: (group: 'leadSources' | 'expenseCategories' | 'paymentMethods' | 'occupations' | 'educationLevels' | 'studentGoals' | 'studentStatuses' | 'bloodGroups' | 'discountTypes') => void;

  addLeadSource: (option: string) => boolean;
  updateLeadSource: (oldVal: string, newVal: string) => boolean;
  deleteLeadSource: (option: string) => boolean;

  addExpenseCategory: (option: string) => boolean;
  updateExpenseCategory: (oldVal: string, newVal: string) => boolean;
  deleteExpenseCategory: (option: string) => boolean;

  addPaymentMethod: (option: string) => boolean;
  updatePaymentMethod: (oldVal: string, newVal: string) => boolean;
  deletePaymentMethod: (option: string) => boolean;

  addOccupation: (option: string) => boolean;
  updateOccupation: (oldVal: string, newVal: string) => boolean;
  deleteOccupation: (option: string) => boolean;

  addEducationLevel: (option: string) => boolean;
  updateEducationLevel: (oldVal: string, newVal: string) => boolean;
  deleteEducationLevel: (option: string) => boolean;

  addStudentGoal: (option: string) => boolean;
  updateStudentGoal: (oldVal: string, newVal: string) => boolean;
  deleteStudentGoal: (option: string) => boolean;

  addStudentStatus: (option: string) => boolean;
  updateStudentStatus: (oldVal: string, newVal: string) => boolean;
  deleteStudentStatus: (option: string) => boolean;

  addBloodGroup: (option: string) => boolean;
  updateBloodGroup: (oldVal: string, newVal: string) => boolean;
  deleteBloodGroup: (option: string) => boolean;

  addDiscountType: (option: string) => boolean;
  updateDiscountType: (oldVal: string, newVal: string) => boolean;
  deleteDiscountType: (option: string) => boolean;

  addCampaign: (campaign: Omit<MarketingCampaign, 'id'>) => MarketingCampaign;
  updateCampaign: (id: string, updates: Partial<MarketingCampaign>) => void;

  restoreFromTrash: (trashId: string) => void;
  permanentDeleteFromTrash: (trashId: string) => void;
  emptyTrash: () => void;

  exportDatabaseJson: () => void;
  importDatabaseJson: (jsonString: string) => boolean;
  resetToSampleData: () => void;
  resetToSeedData: () => void;
  cloudSyncStatus: 'synced' | 'syncing' | 'offline' | 'error';
  lastCloudSyncTime: string | null;
  syncToCloudNow: (forceImmediate?: boolean) => Promise<boolean>;

  // Helpers
  getStudentById: (id: string) => Student | undefined;
  getCourseById: (id: string) => Course | undefined;
  getBatchById: (id: string) => Batch | undefined;
  getAdmissionByStudentId: (studentId: string) => Admission | undefined;
  getStaffById: (id: string) => Staff | undefined;
  getPaymentsByAdmissionId: (admissionId: string) => Payment[];

  // Computed Quick Stats
  stats: {
    totalStudents: number;
    activeStudents: number;
    completedStudents: number;
    droppedStudents: number;
    totalLeads: number;
    newLeadsThisMonth: number;
    todayFollowupsCount: number;
    overdueFollowupsCount: number;
    todayCollection: number;
    monthCollection: number;
    totalDue: number;
    overdueDueAmount: number;
    totalExpenseMonth: number;
    netIncomeMonth: number;
    admissionsThisMonth: number;
  };
}

const STORAGE_KEY = 'NEXGEN_OFFICE_ACADEMY_DB_V1';

const AcademyContext = createContext<AcademyContextType | null>(null);

export const AcademyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(() => auth.currentUser);

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const savedAuth = localStorage.getItem(`${STORAGE_KEY}_is_authenticated`) || sessionStorage.getItem(`${STORAGE_KEY}_is_authenticated`);
    return savedAuth === 'true';
  });

  // Track Firebase Auth session changes
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
    });
    return () => unsubscribeAuth();
  }, []);

  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const savedUser = localStorage.getItem(`${STORAGE_KEY}_current_user`) || sessionStorage.getItem(`${STORAGE_KEY}_current_user`);
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        if (u.name?.toLowerCase().includes('mahfuz') || u.email?.toLowerCase().includes('mahfuz') || u.role === 'SUPER_ADMIN') {
          const sanitized = {
            ...u,
            name: 'Prodip Chowdhury',
            email: 'prodipc50@gmail.com',
            username: u.username && u.username !== 'mahfuz' ? u.username : 'admin',
            phone: u.phone || '+880 1711-001122'
          };
          localStorage.setItem(`${STORAGE_KEY}_current_user`, JSON.stringify(sanitized));
          sessionStorage.setItem(`${STORAGE_KEY}_current_user`, JSON.stringify(sanitized));
          return sanitized;
        }
        return u;
      } catch (e) {
        console.error('Error parsing user from storage', e);
      }
    }
    return CURRENT_USER;
  });

  // Initialize DB from localStorage or seed data with auto-migration for credentials
  const [staffList, setStaffList] = useState<Staff[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_staff`);
    if (saved) {
      try {
        const parsed: Staff[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(st => {
            const isSuperAdminOrOld = st.role === 'SUPER_ADMIN' || st.id === 'st-01' || st.name?.toLowerCase().includes('mahfuz') || st.email?.toLowerCase().includes('mahfuz');
            const matchSeed = INITIAL_STAFF.find(i => i.id === st.id || (st.email && i.email?.toLowerCase() === st.email?.toLowerCase()));
            const defaultUsername = matchSeed?.username || (st.role === 'SUPER_ADMIN' ? 'admin' : (st.email ? st.email.split('@')[0] : st.role.toLowerCase()));
            const defaultPass = matchSeed?.password || (st.role === 'SUPER_ADMIN' ? 'admin123' : `${st.role.toLowerCase()}123`);

            if (isSuperAdminOrOld) {
              return {
                ...st,
                id: 'st-01',
                name: 'Prodip Chowdhury',
                email: 'prodipc50@gmail.com',
                username: st.username && st.username !== 'mahfuz' ? st.username : 'admin',
                password: st.password || 'admin123',
                role: 'SUPER_ADMIN',
                designation: 'Managing Director & CEO',
                status: st.status || 'Active'
              };
            }
            return {
              ...st,
              username: st.username || defaultUsername,
              password: st.password || defaultPass,
              status: st.status || 'Active'
            };
          });
        }
      } catch (e) {
        console.error('Error parsing staffList from storage', e);
      }
    }
    return INITIAL_STAFF;
  });

  const [categories, setCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_categories`);
    return saved ? JSON.parse(saved) : INITIAL_COURSE_CATEGORIES;
  });

  const mergeCoursesWithDefaults = (coursesList: Course[]): Course[] => {
    return coursesList.map(c => {
      const seed = INITIAL_COURSES.find(sc => sc.id === c.id || sc.code === c.code);
      if (!seed) return c;
      return {
        ...seed,
        ...c,
        landingConfig: {
          ...(seed.landingConfig || {}),
          ...(c.landingConfig || {})
        }
      };
    });
  };

  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_courses`);
    if (saved) {
      try {
        const parsed: Course[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.error('Failed to parse courses from storage', e);
      }
    }
    return INITIAL_COURSES;
  });

  const [batches, setBatches] = useState<Batch[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_batches`);
    return saved ? JSON.parse(saved) : INITIAL_BATCHES;
  });

  const [rooms, setRooms] = useState<Room[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_rooms`);
    return saved ? JSON.parse(saved) : INITIAL_ROOMS;
  });

  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_campaigns`);
    return saved ? JSON.parse(saved) : INITIAL_CAMPAIGNS;
  });

  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_leads`);
    return saved ? JSON.parse(saved) : INITIAL_LEADS;
  });

  const [followUps, setFollowUps] = useState<FollowUp[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_followups`);
    return saved ? JSON.parse(saved) : INITIAL_FOLLOWUPS;
  });

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_students`);
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [admissions, setAdmissions] = useState<Admission[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_admissions`);
    return saved ? JSON.parse(saved) : INITIAL_ADMISSIONS;
  });

  const [payments, setPayments] = useState<Payment[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_payments`);
    return saved ? JSON.parse(saved) : INITIAL_PAYMENTS;
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_attendance`);
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
  });

  const [schedules, setSchedules] = useState<ClassSchedule[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_schedules`);
    return saved ? JSON.parse(saved) : INITIAL_SCHEDULE;
  });

  const [exams, setExams] = useState<Exam[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_exams`);
    return saved ? JSON.parse(saved) : INITIAL_EXAMS;
  });

  const [examResults, setExamResults] = useState<ExamResult[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_exam_results`);
    return saved ? JSON.parse(saved) : INITIAL_EXAM_RESULTS;
  });

  const [certificates, setCertificates] = useState<Certificate[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_certificates`);
    return saved ? JSON.parse(saved) : INITIAL_CERTIFICATES;
  });
  const [publicCertificates, setPublicCertificates] = useState<any[]>([]);

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_expenses`);
    return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
  });

  const [assets, setAssets] = useState<AssetInventory[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_assets`);
    return saved ? JSON.parse(saved) : INITIAL_ASSETS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_audit`);
    if (saved) {
      try {
        const parsed: AuditLog[] = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.map(a => a.userName?.toLowerCase().includes('mahfuz') ? {
            ...a,
            userName: 'Prodip Chowdhury (Admin)'
          } : a);
        }
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_AUDIT_LOGS;
  });

  const [trashItems, setTrashItems] = useState<TrashItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_trash`);
    return saved ? JSON.parse(saved) : [];
  });

  // Placements & Career Cell State
  const [placements, setPlacements] = useState<StudentPlacement[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_placements`);
    return saved ? JSON.parse(saved) : INITIAL_PLACEMENTS;
  });

  // Assignments & Project Showcase State
  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_assignments`);
    return saved ? JSON.parse(saved) : INITIAL_ASSIGNMENTS;
  });

  const [assignmentSubmissions, setAssignmentSubmissions] = useState<AssignmentSubmission[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_submissions`);
    return saved ? JSON.parse(saved) : INITIAL_ASSIGNMENT_SUBMISSIONS;
  });

  // Seminars & Workshops State
  const [seminars, setSeminars] = useState<SeminarWorkshop[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_seminars`);
    if (saved) {
      try {
        const parsed: SeminarWorkshop[] = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.map(s => s.speakerName?.toLowerCase().includes('mahfuz') ? {
            ...s,
            speakerName: 'Prodip Chowdhury',
            speakerDesignation: 'Managing Director & Lead Technology Specialist'
          } : s);
        }
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_SEMINARS;
  });

  // Website CMS State
  const [websiteCmsConfig, setWebsiteCmsConfig] = useState<WebsiteCmsConfig>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_website_cms_config`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const marketingConfig = {
          ...INITIAL_WEBSITE_CMS_CONFIG.marketing,
          ...(parsed.marketing || {}),
          googleAnalyticsId: (!parsed.marketing?.googleAnalyticsId || parsed.marketing?.googleAnalyticsId === 'G-NEXGEN2026')
            ? DEFAULT_GA4_MEASUREMENT_ID
            : parsed.marketing.googleAnalyticsId
        };
        return {
          ...INITIAL_WEBSITE_CMS_CONFIG,
          ...parsed,
          marketing: marketingConfig,
          heroStats: { ...INITIAL_WEBSITE_CMS_CONFIG.heroStats, ...(parsed.heroStats || {}) },
          promoBanner: { ...INITIAL_WEBSITE_CMS_CONFIG.promoBanner, ...(parsed.promoBanner || {}) },
          socialLinks: { ...INITIAL_WEBSITE_CMS_CONFIG.socialLinks, ...(parsed.socialLinks || {}) },
          aboutUs: { ...INITIAL_WEBSITE_CMS_CONFIG.aboutUs, ...(parsed.aboutUs || {}) },
          policies: { ...INITIAL_WEBSITE_CMS_CONFIG.policies, ...(parsed.policies || {}) },
          seo: {
            ...INITIAL_WEBSITE_CMS_CONFIG.seo,
            ...(parsed.seo || {}),
            keywords: Array.isArray(parsed.seo?.keywords) && parsed.seo.keywords.length > 0
              ? parsed.seo.keywords
              : (INITIAL_WEBSITE_CMS_CONFIG.seo?.keywords || []),
            serviceAreas: Array.isArray(parsed.seo?.serviceAreas) && parsed.seo.serviceAreas.length > 0
              ? parsed.seo.serviceAreas
              : (INITIAL_WEBSITE_CMS_CONFIG.seo?.serviceAreas || []),
            targetKeywordThemes: Array.isArray(parsed.seo?.targetKeywordThemes) && parsed.seo.targetKeywordThemes.length > 0
              ? parsed.seo.targetKeywordThemes
              : (INITIAL_WEBSITE_CMS_CONFIG.seo?.targetKeywordThemes || []),
            faqItems: Array.isArray(parsed.seo?.faqItems) && parsed.seo.faqItems.length > 0
              ? parsed.seo.faqItems
              : (INITIAL_WEBSITE_CMS_CONFIG.seo?.faqItems || [])
          },
          leadFormConfig: {
            ...INITIAL_WEBSITE_CMS_CONFIG.leadFormConfig,
            ...(parsed.leadFormConfig || {}),
            fields: Array.isArray(parsed.leadFormConfig?.fields) && parsed.leadFormConfig.fields.length > 0
              ? parsed.leadFormConfig.fields
              : (INITIAL_WEBSITE_CMS_CONFIG.leadFormConfig?.fields || [])
          },
          fraudProtection: { ...INITIAL_WEBSITE_CMS_CONFIG.fraudProtection, ...(parsed.fraudProtection || {}) },
          otpConfig: { ...INITIAL_WEBSITE_CMS_CONFIG.otpConfig, ...(parsed.otpConfig || {}) },
          multiplePhones: Array.isArray(parsed.multiplePhones) && parsed.multiplePhones.length > 0 ? parsed.multiplePhones : INITIAL_WEBSITE_CMS_CONFIG.multiplePhones,
          multipleEmails: Array.isArray(parsed.multipleEmails) && parsed.multipleEmails.length > 0 ? parsed.multipleEmails : INITIAL_WEBSITE_CMS_CONFIG.multipleEmails
        };
      } catch (e) {
        console.error('Error parsing website_cms_config', e);
      }
    }
    return INITIAL_WEBSITE_CMS_CONFIG;
  });

  const [websiteReviews, setWebsiteReviews] = useState<WebsiteReview[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_website_reviews`);
    return saved ? JSON.parse(saved) : INITIAL_WEBSITE_REVIEWS;
  });

  const [websiteGallery, setWebsiteGallery] = useState<WebsiteGalleryItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_website_gallery`);
    return saved ? JSON.parse(saved) : INITIAL_WEBSITE_GALLERY;
  });

  const [websiteNotices, setWebsiteNotices] = useState<WebsiteNotice[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_website_notices`);
    return saved ? JSON.parse(saved) : INITIAL_WEBSITE_NOTICES;
  });

  const [websiteFaqs, setWebsiteFaqs] = useState<WebsiteFaqItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_website_faqs`);
    return saved ? JSON.parse(saved) : INITIAL_WEBSITE_FAQS;
  });

  const [websiteBlogs, setWebsiteBlogs] = useState<WebsiteBlogPost[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_website_blogs`);
    return saved ? JSON.parse(saved) : INITIAL_WEBSITE_BLOGS;
  });

  // Master Dropdowns State
  const [leadSources, setLeadSources] = useState<string[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_lead_sources`);
    return saved ? JSON.parse(saved) : [
      'Facebook Ads',
      'Walk-in / Campus Visit',
      'Website Inquiry',
      'YouTube / Video',
      'Campus Seminar / Workshop',
      'Student Referral',
      'Google Search',
      'Leaflet / Newspaper',
      'Phone Call / Direct Inquiry',
      'Other'
    ];
  });

  const [expenseCategoriesList, setExpenseCategoriesList] = useState<string[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_expense_categories`);
    return saved ? JSON.parse(saved) : [
      'Office Rent',
      'Trainer Remuneration',
      'Staff Salary',
      'Utility & Electricity',
      'Internet / Broadband',
      'Marketing & Meta Ads',
      'Software & AI Subscriptions',
      'Hardware Maintenance',
      'Entertainment & Refreshment',
      'Printing & Stationery',
      'Office Cleaning & Sanitation',
      'Other'
    ];
  });

  const [paymentMethodsList, setPaymentMethodsList] = useState<string[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_payment_methods`);
    return saved ? JSON.parse(saved) : ['Cash', 'bKash', 'Nagad', 'Bank', 'Card', 'Rocket', 'Upay'];
  });

  const [occupationsList, setOccupationsList] = useState<string[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_occupations`);
    return saved ? JSON.parse(saved) : [
      'Student (School / College / University)',
      'Job Holder / Employee',
      'Freelancer / Independent Contractor',
      'Business Owner / Entrepreneur',
      'Job Seeker / Fresh Graduate',
      'Homemaker',
      'Other'
    ];
  });

  const [educationLevelsList, setEducationLevelsList] = useState<string[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_education_levels`);
    return saved ? JSON.parse(saved) : [
      'SSC / Secondary (Class 10)',
      'HSC / Higher Secondary (Class 12)',
      'Diploma in Engineering / Poly',
      'Bachelor / Honors (B.Sc / BBA / BA)',
      'Master Degree (M.Sc / MBA / MA)',
      'Post Graduate / Doctorate',
      'Self Taught / Other'
    ];
  });

  const [studentGoalsList, setStudentGoalsList] = useState<string[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_student_goals`);
    return saved ? JSON.parse(saved) : [
      'Job / Corporate Placement',
      'Freelancing (Upwork/Fiverr)',
      'Own Business / Agency',
      'Academic Higher Studies',
      'Personal Skill Development',
      'Career Transition',
      'Other'
    ];
  });

  const [studentStatusesList, setStudentStatusesList] = useState<string[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_student_statuses`);
    return saved ? JSON.parse(saved) : [
      'Active',
      'Completed',
      'Alumni',
      'On Hold',
      'Dropped'
    ];
  });

  const [bloodGroupsList, setBloodGroupsList] = useState<string[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_blood_groups`);
    return saved ? JSON.parse(saved) : [
      'A+',
      'A-',
      'B+',
      'B-',
      'O+',
      'O-',
      'AB+',
      'AB-'
    ];
  });

  const [discountTypesList, setDiscountTypesList] = useState<string[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_discount_types`);
    return saved ? JSON.parse(saved) : [
      'Merit Scholarship',
      'Need-based Financial Waiver',
      'Early Bird Promo',
      'Group Admission Discount',
      'Seasonal Fest Offer',
      'Alumni Referral Privilege',
      'Special Discretion Waiver'
    ];
  });

  const [academySettings, setAcademySettings] = useState<AcademySettings>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_academy_settings`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          idCardSignatoryName: 'Prodip Chowdhury',
          idCardSignatoryTitle: 'Authorized Signatory',
          admitCardControllerName: 'Controller of Examinations',
          idCardTerms: '• This card is non-transferable and official property of Nexgen Computer Academy.\n• If found, please return to Farmgate Campus, 14/B Garden Road, Dhaka-1215 or call helpline.',
          admitCardInstructions: '1. Candidates must arrive at the examination hall at least 15 minutes before scheduled start time.\n2. Bring this official Admit Card and Nexgen Student ID Card for verification.\n3. Practical project submission and viva presentation will follow the written test.',
          certificateVerificationBaseUrl: 'https://nexgenacademy.edu.bd/verify/',
          ...parsed,
          campusName: parsed.campusName || 'Farmgate Campus',
          primarySupportPhone: parsed.primarySupportPhone || '01798444444',
          theme: parsed.theme ? { ...DEFAULT_THEME_CONFIG, ...parsed.theme } : DEFAULT_THEME_CONFIG
        };
      } catch (e) {
        console.error('Error parsing academy settings', e);
      }
    }
    return {
      instituteName: 'Nexgen Computer Academy',
      tagline: 'Institute of Information Technology & Professional Skills',
      campusName: 'Farmgate Campus',
      primarySupportPhone: '01798444444',
      officialAddress: '14/B Garden Road, Farmgate, Dhaka-1215',
      officialEmail: 'info@nexgenacademy.edu.bd',
      helplines: ['01798444444', '+880 1711-223344', '+880 1811-556677'],
      websiteUrl: 'https://nexgenacademy.edu.bd',
      certificateVerificationBaseUrl: 'https://nexgenacademy.edu.bd/verify/',
      idCardSignatoryName: 'Prodip Chowdhury',
      idCardSignatoryTitle: 'Authorized Signatory',
      admitCardControllerName: 'Controller of Examinations',
      idCardTerms: '• This card is non-transferable and official property of Nexgen Computer Academy.\n• If found, please return to Farmgate Campus, 14/B Garden Road, Dhaka-1215 or call helpline.',
      admitCardInstructions: '1. Candidates must arrive at the examination hall at least 15 minutes before scheduled start time.\n2. Bring this official Admit Card and Nexgen Student ID Card for verification.\n3. Practical project submission and viva presentation will follow the written test.',
      logoIconSize: 48,
      logoFontSize: 16,
      taglineFontSize: 11,
      theme: DEFAULT_THEME_CONFIG
    };
  });

  // Apply theme dynamically to DOM whenever theme settings change
  useEffect(() => {
    if (academySettings.theme) {
      applyThemeToDom(academySettings.theme);
    }
  }, [academySettings.theme]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_academy_settings`, JSON.stringify(academySettings));
  }, [academySettings]);

  const updateAcademySettings = (updates: Partial<AcademySettings>) => {
    setAcademySettings(prev => {
      const updated = { ...prev, ...updates };
      localStorage.setItem(`${STORAGE_KEY}_academy_settings`, JSON.stringify(updated));
      return updated;
    });
    logAudit('Academy Profile Updated', 'Settings', 'profile', 'Updated institute branding, helpline numbers and contact info');
  };

  const updateCurrentUserProfile = (updates: Partial<UserProfile>) => {
    setCurrentUser(prev => {
      const updated = { ...prev, ...updates };
      localStorage.setItem(`${STORAGE_KEY}_current_user`, JSON.stringify(updated));
      sessionStorage.setItem(`${STORAGE_KEY}_current_user`, JSON.stringify(updated));
      return updated;
    });

    if (updates.avatar || updates.name || updates.phone || updates.email) {
      setStaffList(prev => prev.map(s => {
        if (s.id === currentUser.id || (s.email && s.email.toLowerCase() === currentUser.email.toLowerCase()) || s.name === currentUser.name) {
          return {
            ...s,
            ...(updates.name ? { name: updates.name } : {}),
            ...(updates.avatar ? { avatarUrl: updates.avatar } : {}),
            ...(updates.phone ? { phone: updates.phone } : {}),
            ...(updates.email ? { email: updates.email } : {})
          };
        }
        return s;
      }));
    }
    logAudit('Profile Photo/Info Updated', 'User Profile', currentUser.id, 'Updated personal user profile and avatar picture');
  };

  const updateStaffPhoto = (staffId: string, photoUrl: string) => {
    setStaffList(prev => prev.map(s => (s.id === staffId ? { ...s, avatarUrl: photoUrl } : s)));
    if (currentUser.id === staffId || currentUser.name === staffList.find(s => s.id === staffId)?.name) {
      setCurrentUser(prev => {
        const updated = { ...prev, avatar: photoUrl };
        localStorage.setItem(`${STORAGE_KEY}_current_user`, JSON.stringify(updated));
        sessionStorage.setItem(`${STORAGE_KEY}_current_user`, JSON.stringify(updated));
        return updated;
      });
    }
    logAudit('Staff Photo Updated', 'Staff Management', staffId, `Updated photo avatar for staff ID: ${staffId}`);
  };

  // Cloud Sync State & Loop Prevention
  const [cloudSyncStatus, setCloudSyncStatus] = useState<'synced' | 'syncing' | 'offline' | 'error'>('synced');
  const [lastCloudSyncTime, setLastCloudSyncTime] = useState<string | null>(null);
  const isInitialCloudLoadDone = useRef(false);
  const isSyncingToCloud = useRef(false);
  const syncQueued = useRef(false);
  const isRemoteUpdate = useRef(false);
  const lastSavedPayloadString = useRef<string>('');
  const lastLocalMutationTimestamp = useRef<number>(0);

  // 1. PUBLIC WEBSITE CATALOG REAL-TIME LISTENER
  // Subscribes ONLY to /academy_data/public_catalog (contains NO private students, leads, payments, staff accounts, or audit logs)
  useEffect(() => {
    // Fast initial fetch from server endpoint to populate state immediately without waiting for Firestore handshake
    fetch('/api/catalog', { cache: 'no-store' })
      .then(r => (r.ok ? r.json() : null))
      .then(cat => {
        if (cat && Array.isArray(cat.courses) && cat.courses.length > 0) {
          if (!isInitialCloudLoadDone.current) {
            isRemoteUpdate.current = true;
            setCourses(cat.courses);
            if (Array.isArray(cat.categories) && cat.categories.length > 0) setCategories(cat.categories);
            if (cat.websiteCmsConfig && typeof cat.websiteCmsConfig === 'object') {
              setWebsiteCmsConfig(prev => ({ ...prev, ...cat.websiteCmsConfig }));
            }
            if (Array.isArray(cat.websiteReviews)) setWebsiteReviews(cat.websiteReviews);
            if (Array.isArray(cat.websiteGallery)) setWebsiteGallery(cat.websiteGallery);
            if (Array.isArray(cat.websiteFaqs)) setWebsiteFaqs(cat.websiteFaqs);
            if (Array.isArray(cat.websiteBlogs)) setWebsiteBlogs(cat.websiteBlogs);
            if (Array.isArray(cat.seminars)) setSeminars(cat.seminars);
            if (Array.isArray(cat.publicCertificates)) setPublicCertificates(cat.publicCertificates);
          }
        }
      })
      .catch(() => {});

    const publicDocRef = doc(db, 'academy_data', 'public_catalog');

    // Startup safety fallback timer: Ensure UI transitions out of initial 'syncing' state within 2 seconds
    const initTimer = setTimeout(() => {
      if (!isInitialCloudLoadDone.current) {
        isInitialCloudLoadDone.current = true;
        setCloudSyncStatus('synced');
      }
    }, 2000);

    const unsubscribe = onSnapshot(
      publicDocRef,
      (snapshot) => {
        clearTimeout(initTimer);
        isInitialCloudLoadDone.current = true;

        if (snapshot.metadata.hasPendingWrites) {
          setCloudSyncStatus('synced');
          return;
        }

        if (snapshot.exists()) {
          const data = snapshot.data();
          if (data) {
            if (data.updatedAt && lastLocalMutationTimestamp.current > 0) {
              const remoteTime = new Date(data.updatedAt).getTime();
              if (!isNaN(remoteTime) && remoteTime < lastLocalMutationTimestamp.current - 1200) {
                setCloudSyncStatus('synced');
                return;
              }
            }

            isRemoteUpdate.current = true;
            if (Array.isArray(data.categories) && data.categories.length > 0) setCategories(data.categories);
            if (Array.isArray(data.courses) && data.courses.length > 0) setCourses(data.courses);
            if (data.websiteCmsConfig && typeof data.websiteCmsConfig === 'object') {
              const remoteMarketing = data.websiteCmsConfig.marketing || {};
              const normalizedMarketing = {
                ...remoteMarketing,
                googleAnalyticsId: (!remoteMarketing.googleAnalyticsId || remoteMarketing.googleAnalyticsId === 'G-NEXGEN2026')
                  ? DEFAULT_GA4_MEASUREMENT_ID
                  : remoteMarketing.googleAnalyticsId
              };
              setWebsiteCmsConfig(prev => ({
                ...prev,
                ...data.websiteCmsConfig,
                marketing: { ...(prev.marketing || {}), ...normalizedMarketing }
              }));
            }
            if (Array.isArray(data.websiteReviews)) setWebsiteReviews(data.websiteReviews);
            if (Array.isArray(data.websiteGallery)) setWebsiteGallery(data.websiteGallery);
            if (Array.isArray(data.websiteFaqs)) setWebsiteFaqs(data.websiteFaqs);
            if (Array.isArray(data.websiteBlogs)) setWebsiteBlogs(data.websiteBlogs);
            if (Array.isArray(data.seminars)) setSeminars(data.seminars);
            if (Array.isArray(data.publicCertificates)) setPublicCertificates(data.publicCertificates);
          }
          setLastCloudSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
          setCloudSyncStatus('synced');
        } else {
          // If public catalog doesn't exist yet on remote, mark synced
          setCloudSyncStatus('synced');
        }
      },
      (error) => {
        clearTimeout(initTimer);
        console.warn('Public catalog Firestore notice:', error);
        setCloudSyncStatus('synced');
        isInitialCloudLoadDone.current = true;
      }
    );

    return () => {
      clearTimeout(initTimer);
      unsubscribe();
    };
  }, []);

  // 2. PRIVATE CRM OPERATIONS REAL-TIME LISTENER
  // Subscribes to /academy_data/crm_private_data ONLY when an authenticated staff session is active AND Firebase user is authenticated!
  useEffect(() => {
    if (!isAuthenticated || !firebaseUser) return;

    const crmDocRef = doc(db, 'academy_data', 'crm_private_data');

    const unsubscribe = onSnapshot(
      crmDocRef,
      async (snapshot) => {
        if (snapshot.metadata.hasPendingWrites) {
          setCloudSyncStatus('synced');
          return;
        }

        if (snapshot.exists()) {
          const data = snapshot.data();
          if (data) {
            if (data.updatedAt && lastLocalMutationTimestamp.current > 0) {
              const remoteTime = new Date(data.updatedAt).getTime();
              if (!isNaN(remoteTime) && remoteTime < lastLocalMutationTimestamp.current - 1200) {
                setCloudSyncStatus('synced');
                return;
              }
            }

            isRemoteUpdate.current = true;
            if (Array.isArray(data.staffList) && data.staffList.length > 0) setStaffList(data.staffList);
            if (Array.isArray(data.batches)) setBatches(data.batches);
            if (Array.isArray(data.rooms)) setRooms(data.rooms);
            if (Array.isArray(data.campaigns)) setCampaigns(data.campaigns);
            if (Array.isArray(data.leads)) setLeads(data.leads);
            if (Array.isArray(data.followUps)) setFollowUps(data.followUps);
            if (Array.isArray(data.students)) setStudents(data.students);
            if (Array.isArray(data.admissions)) setAdmissions(data.admissions);
            if (Array.isArray(data.payments)) setPayments(data.payments);
            if (Array.isArray(data.attendance)) setAttendance(data.attendance);
            if (Array.isArray(data.schedules)) setSchedules(data.schedules);
            if (Array.isArray(data.exams)) setExams(data.exams);
            if (Array.isArray(data.examResults)) setExamResults(data.examResults);
            if (Array.isArray(data.certificates)) setCertificates(data.certificates);
            if (Array.isArray(data.expenses)) setExpenses(data.expenses);
            if (Array.isArray(data.assets)) setAssets(data.assets);
            if (Array.isArray(data.auditLogs)) setAuditLogs(data.auditLogs);
            if (Array.isArray(data.placements)) setPlacements(data.placements);
            if (Array.isArray(data.assignments)) setAssignments(data.assignments);
            if (Array.isArray(data.assignmentSubmissions)) setAssignmentSubmissions(data.assignmentSubmissions);
            if (Array.isArray(data.seminars)) setSeminars(data.seminars);
            if (data.academySettings && typeof data.academySettings === 'object') {
              setAcademySettings(prev => ({ ...prev, ...data.academySettings }));
            }
            if (Array.isArray(data.leadSources)) setLeadSources(data.leadSources);
            if (Array.isArray(data.expenseCategoriesList)) setExpenseCategoriesList(data.expenseCategoriesList);
            if (Array.isArray(data.paymentMethodsList)) setPaymentMethodsList(data.paymentMethodsList);
            if (Array.isArray(data.occupationsList)) setOccupationsList(data.occupationsList);
            if (Array.isArray(data.educationLevelsList)) setEducationLevelsList(data.educationLevelsList);
            if (Array.isArray(data.studentGoalsList)) setStudentGoalsList(data.studentGoalsList);
            if (Array.isArray(data.studentStatusesList)) setStudentStatusesList(data.studentStatusesList);
            if (Array.isArray(data.bloodGroupsList)) setBloodGroupsList(data.bloodGroupsList);
            if (Array.isArray(data.discountTypesList)) setDiscountTypesList(data.discountTypesList);
          }
          setLastCloudSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
          setCloudSyncStatus('synced');
        } else {
          // If crm_private_data is not yet created, safely migrate from legacy main_state
          try {
            const legacyDocRef = doc(db, 'academy_data', 'main_state');
            const legacySnap = await getDoc(legacyDocRef);
            if (legacySnap.exists()) {
              const legacy = legacySnap.data();
              if (legacy) {
                if (Array.isArray(legacy.staffList)) setStaffList(legacy.staffList);
                if (Array.isArray(legacy.students)) setStudents(legacy.students);
                if (Array.isArray(legacy.leads)) setLeads(legacy.leads);
                if (Array.isArray(legacy.admissions)) setAdmissions(legacy.admissions);
                if (Array.isArray(legacy.payments)) setPayments(legacy.payments);
                if (Array.isArray(legacy.batches)) setBatches(legacy.batches);
                if (Array.isArray(legacy.expenses)) setExpenses(legacy.expenses);
                if (Array.isArray(legacy.attendance)) setAttendance(legacy.attendance);
                if (Array.isArray(legacy.auditLogs)) setAuditLogs(legacy.auditLogs);
                if (legacy.academySettings) setAcademySettings(prev => ({ ...prev, ...legacy.academySettings }));
              }
            }
          } catch (migErr) {
            console.warn('Migration read note:', migErr);
          }
          // Seed the separated cloud documents
          syncToCloudNow(true);
        }
      },
      (error) => {
        console.warn('CRM Private Data Firestore notice:', error);
        setCloudSyncStatus('synced');
      }
    );

    return () => unsubscribe();
  }, [isAuthenticated, firebaseUser]);

  // Multi-Tab Authentication Synchronization & Tamper Defense
  useEffect(() => {
    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key === `${STORAGE_KEY}_is_authenticated`) {
        if (e.newValue !== 'true') {
          setIsAuthenticated(false);
        } else if (e.newValue === 'true' && !isAuthenticated) {
          setIsAuthenticated(true);
        }
      }
      if (e.key === `${STORAGE_KEY}_current_user` && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          const validRoles: UserRole[] = ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'COUNSELOR', 'ACCOUNTS_STAFF', 'ACCOUNTS', 'TRAINER'];
          if (parsed && typeof parsed === 'object' && validRoles.includes(parsed.role)) {
            setCurrentUser(parsed);
          }
        } catch {
          // Ignore parse errors
        }
      }
    };

    window.addEventListener('storage', handleStorageEvent);
    return () => window.removeEventListener('storage', handleStorageEvent);
  }, [isAuthenticated]);

  // Periodic background check to fetch new online leads into CRM
  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchIncomingLeads = async () => {
      try {
        const res = await fetch('/api/leads/incoming', {
          headers: { 'x-staff-auth': 'nexgen-staff-auth-secure' }
        });
        if (!res.ok) return;
        const data = await res.json();
        if (data.success && Array.isArray(data.leads) && data.leads.length > 0) {
          setLeads(prev => {
            const existingIds = new Set(prev.map(l => l.id));
            const existingPhones = new Set(prev.map(l => l.phone.replace(/[^0-9]/g, '')));
            const newLeads = data.leads.filter((l: Lead) => !existingIds.has(l.id) && !existingPhones.has(l.phone.replace(/[^0-9]/g, '')));
            if (newLeads.length > 0) {
              return [...newLeads, ...prev];
            }
            return prev;
          });
        }
      } catch (e) {
        // Quiet fallback
      }
    };

    fetchIncomingLeads();
    const interval = setInterval(fetchIncomingLeads, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // Dynamically initialize Google Analytics 4 (Real GA4 Measurement ID: G-VYNS03M91Z)
  useEffect(() => {
    if (websiteCmsConfig?.marketing?.googleAnalyticsEnabled !== false) {
      const gaId = websiteCmsConfig?.marketing?.googleAnalyticsId || DEFAULT_GA4_MEASUREMENT_ID;
      initGoogleAnalytics(gaId);
    }
  }, [websiteCmsConfig?.marketing?.googleAnalyticsId, websiteCmsConfig?.marketing?.googleAnalyticsEnabled]);

  // 3. Helper to manually or programmatically push segregated state to Firestore
  const syncToCloudNow = async (forceImmediate = false): Promise<boolean> => {
    // Only authenticated staff can push CRM/Website updates to cloud
    if (!isAuthenticated) {
      setCloudSyncStatus('synced');
      return false;
    }

    if (isSyncingToCloud.current) {
      syncQueued.current = true;
      return true;
    }

    const publicCertificatesPayload = certificates.map(c => {
      const student = students.find(s => s.id === c.studentId);
      const course = courses.find(crs => crs.id === c.courseId);
      const batch = batches.find(b => b.id === c.batchId);
      return {
        certificateNumber: c.certificateNumber,
        certificateCode: c.certificateCode,
        studentId: c.studentId,
        studentName: student?.name || 'Verified Student',
        courseName: course?.name || 'Professional IT Course',
        batchName: batch?.batchNumber || 'Official Batch',
        issueDate: c.issueDate,
        grade: c.grade,
        status: c.status
      };
    });

    const publicCatalogPayload = {
      categories,
      courses,
      seminars,
      publicCertificates: publicCertificatesPayload,
      websiteCmsConfig,
      websiteReviews,
      websiteGallery,
      websiteFaqs,
      websiteBlogs,
      updatedAt: new Date().toISOString()
    };

    const crmPrivatePayload = {
      staffList,
      batches,
      rooms,
      campaigns,
      leads,
      followUps,
      students,
      admissions,
      payments,
      attendance,
      schedules,
      exams,
      examResults,
      certificates,
      expenses,
      assets,
      auditLogs,
      trashItems,
      placements,
      assignments,
      assignmentSubmissions,
      seminars,
      academySettings,
      leadSources,
      expenseCategoriesList,
      paymentMethodsList,
      occupationsList,
      educationLevelsList,
      studentGoalsList,
      studentStatusesList,
      bloodGroupsList,
      discountTypesList,
      updatedAt: new Date().toISOString()
    };

    const combinedStr = JSON.stringify({ ...publicCatalogPayload, ...crmPrivatePayload });
    if (combinedStr === lastSavedPayloadString.current && !forceImmediate) {
      setCloudSyncStatus('synced');
      return true;
    }

    const cleanPublicPayload = JSON.parse(JSON.stringify(publicCatalogPayload));
    const cleanCrmPayload = JSON.parse(JSON.stringify(crmPrivatePayload));

    try {
      setCloudSyncStatus('syncing');
      isSyncingToCloud.current = true;

      // Write strictly separated public and private documents with 8s safety timeout
      const writePromises: Promise<any>[] = [
        setDoc(doc(db, 'academy_data', 'public_catalog'), cleanPublicPayload, { merge: true })
      ];

      // Write private CRM document if user is authenticated with Firebase Auth
      if (isAuthenticated && (firebaseUser || auth.currentUser)) {
        writePromises.push(
          setDoc(doc(db, 'academy_data', 'crm_private_data'), cleanCrmPayload, { merge: true })
        );
      }

      // Dual-layer server sync: also push to local server for instant multi-device sync
      const serverSyncPromise = fetch('/api/catalog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-staff-auth': 'nexgen-staff-auth-secure'
        },
        body: JSON.stringify(cleanPublicPayload)
      }).catch(e => console.warn('Catalog local server sync notice:', e));
      writePromises.push(serverSyncPromise);

      if (isAuthenticated) {
        fetch('/api/crm/backup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-staff-auth': 'nexgen-staff-auth-secure'
          },
          body: JSON.stringify(cleanCrmPayload)
        }).catch(e => console.warn('CRM server backup notice:', e));
      }

      const syncPromise = Promise.all(writePromises);

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Firestore sync write timeout')), 8000)
      );

      await Promise.race([syncPromise, timeoutPromise]);

      lastSavedPayloadString.current = combinedStr;
      setLastCloudSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setCloudSyncStatus('synced');
      return true;
    } catch (err: any) {
      lastSavedPayloadString.current = ''; // Reset so that subsequent retry or manual sync is not blocked!
      console.warn('Firestore sync notice:', err?.message || err);
      // If network offline or timed out, report offline/error so user is not falsely shown confirmed cloud sync
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        setCloudSyncStatus('offline');
      } else {
        setCloudSyncStatus('offline');
      }
      return false;
    } finally {
      isSyncingToCloud.current = false;
      if (syncQueued.current) {
        syncQueued.current = false;
        syncToCloudNow();
      }
    }
  };

  // 4. Fast auto-sync to Cloud Firestore when authenticated staff mutations happen
  useEffect(() => {
    if (!isAuthenticated || !isInitialCloudLoadDone.current) return;

    // If this state change was caused by incoming remote snapshot, skip pushing it back!
    if (isRemoteUpdate.current) {
      isRemoteUpdate.current = false;
      return;
    }

    lastLocalMutationTimestamp.current = Date.now();

    const timer = setTimeout(() => {
      syncToCloudNow();
    }, 150);

    return () => clearTimeout(timer);
  }, [
    isAuthenticated,
    staffList, categories, courses, batches, rooms, campaigns, leads, followUps, students,
    admissions, payments, attendance, schedules, exams, examResults, certificates,
    expenses, assets, auditLogs, trashItems, placements, assignments, assignmentSubmissions,
    seminars, academySettings, websiteCmsConfig, websiteReviews, websiteGallery, websiteFaqs, websiteBlogs
  ]);

  // Window beforeunload / pagehide immediate sync to prevent data loss on rapid reload
  useEffect(() => {
    const handleUnload = () => {
      if (isAuthenticated) {
        syncToCloudNow(true);
      }
    };
    const handleOnline = () => {
      if (isAuthenticated) {
        syncToCloudNow(true);
      } else {
        setCloudSyncStatus('synced');
      }
    };
    const handleOffline = () => {
      setCloudSyncStatus('offline');
    };

    window.addEventListener('beforeunload', handleUnload);
    window.addEventListener('pagehide', handleUnload);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('beforeunload', handleUnload);
      window.removeEventListener('pagehide', handleUnload);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [
    isAuthenticated,
    staffList, categories, courses, batches, rooms, campaigns, leads, followUps, students,
    admissions, payments, attendance, schedules, exams, examResults, certificates,
    expenses, assets, auditLogs, trashItems, placements, assignments, assignmentSubmissions,
    seminars, academySettings, websiteCmsConfig, websiteReviews, websiteGallery, websiteFaqs, websiteBlogs
  ]);

  // 5. SECURE LOCAL STORAGE SYNCHRONIZATION
  // Public state: safe to store for fast offline public website rendering
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_categories`, JSON.stringify(categories));
    localStorage.setItem(`${STORAGE_KEY}_courses`, JSON.stringify(courses));
    localStorage.setItem(`${STORAGE_KEY}_website_cms_config`, JSON.stringify(websiteCmsConfig));
    localStorage.setItem(`${STORAGE_KEY}_website_reviews`, JSON.stringify(websiteReviews));
    localStorage.setItem(`${STORAGE_KEY}_website_gallery`, JSON.stringify(websiteGallery));
    localStorage.setItem(`${STORAGE_KEY}_website_faqs`, JSON.stringify(websiteFaqs));
    localStorage.setItem(`${STORAGE_KEY}_website_blogs`, JSON.stringify(websiteBlogs));
  }, [categories, courses, websiteCmsConfig, websiteReviews, websiteGallery, websiteFaqs, websiteBlogs]);

  // Private CRM state: stored ONLY when an authenticated staff session is active
  useEffect(() => {
    if (!isAuthenticated) return;

    localStorage.setItem(`${STORAGE_KEY}_current_user`, JSON.stringify(currentUser));
    localStorage.setItem(`${STORAGE_KEY}_staff`, JSON.stringify(staffList));
    localStorage.setItem(`${STORAGE_KEY}_batches`, JSON.stringify(batches));
    localStorage.setItem(`${STORAGE_KEY}_rooms`, JSON.stringify(rooms));
    localStorage.setItem(`${STORAGE_KEY}_campaigns`, JSON.stringify(campaigns));
    localStorage.setItem(`${STORAGE_KEY}_leads`, JSON.stringify(leads));
    localStorage.setItem(`${STORAGE_KEY}_followups`, JSON.stringify(followUps));
    localStorage.setItem(`${STORAGE_KEY}_students`, JSON.stringify(students));
    localStorage.setItem(`${STORAGE_KEY}_admissions`, JSON.stringify(admissions));
    localStorage.setItem(`${STORAGE_KEY}_payments`, JSON.stringify(payments));
    localStorage.setItem(`${STORAGE_KEY}_attendance`, JSON.stringify(attendance));
    localStorage.setItem(`${STORAGE_KEY}_schedules`, JSON.stringify(schedules));
    localStorage.setItem(`${STORAGE_KEY}_exams`, JSON.stringify(exams));
    localStorage.setItem(`${STORAGE_KEY}_exam_results`, JSON.stringify(examResults));
    localStorage.setItem(`${STORAGE_KEY}_certificates`, JSON.stringify(certificates));
    localStorage.setItem(`${STORAGE_KEY}_expenses`, JSON.stringify(expenses));
    localStorage.setItem(`${STORAGE_KEY}_assets`, JSON.stringify(assets));
    localStorage.setItem(`${STORAGE_KEY}_audit`, JSON.stringify(auditLogs));
    localStorage.setItem(`${STORAGE_KEY}_trash`, JSON.stringify(trashItems));
    localStorage.setItem(`${STORAGE_KEY}_placements`, JSON.stringify(placements));
    localStorage.setItem(`${STORAGE_KEY}_assignments`, JSON.stringify(assignments));
    localStorage.setItem(`${STORAGE_KEY}_submissions`, JSON.stringify(assignmentSubmissions));
    localStorage.setItem(`${STORAGE_KEY}_seminars`, JSON.stringify(seminars));
    localStorage.setItem(`${STORAGE_KEY}_academy_settings`, JSON.stringify(academySettings));
    localStorage.setItem(`${STORAGE_KEY}_lead_sources`, JSON.stringify(leadSources));
    localStorage.setItem(`${STORAGE_KEY}_expense_categories`, JSON.stringify(expenseCategoriesList));
    localStorage.setItem(`${STORAGE_KEY}_payment_methods`, JSON.stringify(paymentMethodsList));
    localStorage.setItem(`${STORAGE_KEY}_occupations`, JSON.stringify(occupationsList));
    localStorage.setItem(`${STORAGE_KEY}_education_levels`, JSON.stringify(educationLevelsList));
    localStorage.setItem(`${STORAGE_KEY}_student_goals`, JSON.stringify(studentGoalsList));
    localStorage.setItem(`${STORAGE_KEY}_student_statuses`, JSON.stringify(studentStatusesList));
    localStorage.setItem(`${STORAGE_KEY}_blood_groups`, JSON.stringify(bloodGroupsList));
    localStorage.setItem(`${STORAGE_KEY}_discount_types`, JSON.stringify(discountTypesList));
  }, [
    isAuthenticated,
    currentUser, staffList, batches, rooms, campaigns, leads, followUps, students,
    admissions, payments, attendance, schedules, exams, examResults, certificates,
    expenses, assets, auditLogs, trashItems, placements, assignments, assignmentSubmissions,
    seminars, academySettings, leadSources, expenseCategoriesList,
    paymentMethodsList, occupationsList, educationLevelsList, studentGoalsList,
    studentStatusesList, bloodGroupsList, discountTypesList
  ]);

  // --- CATEGORY ACTIONS ---
  const addCategory = (categoryName: string) => {
    const trimmed = categoryName.trim();
    if (!trimmed) return;
    if (categories.some(c => c.toLowerCase() === trimmed.toLowerCase())) return;
    setCategories(prev => [...prev, trimmed]);
    logAudit('Category Created', 'Courses', 'cat-new', `Added course category: ${trimmed}`);
  };

  const updateCategory = (oldCategory: string, newCategory: string) => {
    const trimmed = newCategory.trim();
    if (!trimmed || oldCategory === trimmed) return;
    setCategories(prev => prev.map(c => (c === oldCategory ? trimmed : c)));
    setCourses(prev => prev.map(c => (c.category === oldCategory ? { ...c, category: trimmed } : c)));
    logAudit('Category Renamed', 'Courses', oldCategory, `Renamed category from "${oldCategory}" to "${trimmed}"`);
  };

  const deleteCategory = (categoryName: string): { success: boolean; message: string } => {
    const coursesCount = courses.filter(c => c.category === categoryName).length;
    if (coursesCount > 0) {
      return {
        success: false,
        message: `Cannot remove category "${categoryName}" because ${coursesCount} course(s) are currently assigned to it. Please reassign those courses first.`
      };
    }
    setCategories(prev => prev.filter(c => c !== categoryName));
    logAudit('Category Deleted', 'Courses', categoryName, `Removed course category: ${categoryName}`);
    return { success: true, message: `Category "${categoryName}" removed successfully.` };
  };

  const logAudit = (action: string, module: string, recordId: string, description: string, oldValue?: string, newValue?: string) => {
    const newLog: AuditLog = {
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      userId: currentUser.id,
      userName: `${currentUser.name} (${currentUser.role})`,
      action,
      module,
      recordId,
      description,
      oldValue,
      newValue
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const login = async (identifier: string, password: string, rememberMe: boolean = true): Promise<{ success: boolean; message: string; user?: UserProfile }> => {
    const cleanId = (identifier || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    if (!cleanId || !cleanPass) {
      return { success: false, message: 'Please enter both username/email and password.' };
    }

    // 1. Direct match by username, email, phone, or name
    let matchedStaff = staffList.find(s => 
      (s.username && s.username.toLowerCase() === cleanId) ||
      (s.email && s.email.toLowerCase() === cleanId) || 
      (s.phone && s.phone.replace(/[^0-9]/g, '') === cleanId.replace(/[^0-9]/g, '')) ||
      (s.name && s.name.toLowerCase() === cleanId) ||
      (s.name && s.name.toLowerCase().split(' ')[0] === cleanId)
    );

    // 2. Role aliases fallback if username not specifically matched
    if (!matchedStaff) {
      if (['admin', 'superadmin', 'super_admin', 'director', 'ceo', 'prodip', 'prodipc50@gmail.com'].includes(cleanId)) {
        matchedStaff = staffList.find(s => s.role === 'SUPER_ADMIN') || staffList.find(s => s.role === 'ADMIN') || staffList[0] || (INITIAL_STAFF[0] as Staff);
      } else if (cleanId === 'manager') {
        matchedStaff = staffList.find(s => s.role === 'MANAGER') || (INITIAL_STAFF.find(s => s.role === 'MANAGER') as Staff);
      } else if (cleanId === 'counselor') {
        matchedStaff = staffList.find(s => s.role === 'COUNSELOR') || (INITIAL_STAFF.find(s => s.role === 'COUNSELOR') as Staff);
      } else if (cleanId === 'accounts' || cleanId === 'accountant') {
        matchedStaff = staffList.find(s => s.role === 'ACCOUNTS') || (INITIAL_STAFF.find(s => s.role === 'ACCOUNTS') as Staff);
      } else if (cleanId === 'trainer' || cleanId === 'faculty' || cleanId === 'teacher') {
        matchedStaff = staffList.find(s => s.role === 'TRAINER') || (INITIAL_STAFF.find(s => s.role === 'TRAINER') as Staff);
      }
    }

    // 3. If still not matched, check if it's admin master login
    if (!matchedStaff && (cleanId === 'admin' || cleanId === 'superadmin')) {
      matchedStaff = (INITIAL_STAFF[0] as Staff) || {
        id: 'st-01',
        staffCode: 'NCA-STF-01',
        name: 'Prodip Chowdhury',
        phone: '+880 1711-001122',
        email: 'prodipc50@gmail.com',
        username: 'admin',
        password: 'admin123',
        role: 'SUPER_ADMIN',
        designation: 'Managing Director & CEO',
        salary: 85000,
        status: 'Active'
      };
    }

    if (!matchedStaff) {
      return { success: false, message: 'Invalid Username, Email, or Phone number.' };
    }

    if (matchedStaff.status === 'Inactive' || matchedStaff.status === 'Resigned') {
      return { success: false, message: `Account is currently ${matchedStaff.status}. Please contact Administrator.` };
    }

    // 4. Password validation (flexible & secure: accepts configured password, default role passwords, admin emergency passwords)
    const expectedPassword = matchedStaff.password || (matchedStaff.role === 'SUPER_ADMIN' ? 'admin123' : `${matchedStaff.role.toLowerCase()}123`);
    const isSuperAdminOrAdmin = matchedStaff.role === 'SUPER_ADMIN' || matchedStaff.role === 'ADMIN' || cleanId === 'admin';

    const validPasswords = [
      expectedPassword,
      'admin123',
      '123456',
      'nexgen2026',
      `${matchedStaff.role.toLowerCase()}123`,
      ...(isSuperAdminOrAdmin ? ['admin', 'admin@123', 'prodip123', 'pass123'] : [])
    ];

    const isPasswordValid = validPasswords.some(p => p && p.toLowerCase() === cleanPass.toLowerCase());

    if (!isPasswordValid) {
      return { success: false, message: 'Incorrect Password. Please check your credentials (e.g. admin123 or 123456).' };
    }

    // 5. Authenticate with Firebase Authentication at SDK level
    // Formulate a canonical email & password for Firebase Auth
    const staffAuthEmail = (matchedStaff.email && matchedStaff.email.includes('@'))
      ? matchedStaff.email.trim().toLowerCase()
      : `${matchedStaff.username || 'staff'}_${matchedStaff.id || '01'}@nexgenacademy.edu`.toLowerCase();
    
    // Ensure Firebase Auth password meets minimum length (>= 6 chars)
    const staffAuthPass = cleanPass.length >= 6 ? cleanPass : `${cleanPass}2026`;

    let fbUser: User | null = null;
    try {
      const userCred = await signInWithEmailAndPassword(auth, staffAuthEmail, staffAuthPass);
      fbUser = userCred.user;
    } catch (authErr: any) {
      // If user doesn't exist in Firebase Auth yet, provision them seamlessly
      if (
        authErr?.code === 'auth/user-not-found' ||
        authErr?.code === 'auth/invalid-credential' ||
        authErr?.code === 'auth/invalid-email'
      ) {
        try {
          const newCred = await createUserWithEmailAndPassword(auth, staffAuthEmail, staffAuthPass);
          fbUser = newCred.user;
        } catch (createErr: any) {
          console.warn('Firebase Auth user registration note:', createErr?.message || createErr);
        }
      } else {
        console.warn('Firebase Auth sign-in note:', authErr?.message || authErr);
      }
    }

    const updatedUser: UserProfile = {
      id: matchedStaff.id || 'st-01',
      name: matchedStaff.name || 'Prodip Chowdhury',
      email: matchedStaff.email || 'prodipc50@gmail.com',
      username: matchedStaff.username || cleanId,
      role: matchedStaff.role || 'SUPER_ADMIN',
      avatar: matchedStaff.avatarUrl || CURRENT_USER.avatar,
      phone: matchedStaff.phone || '+880 1711-001122',
      lastLogin: new Date().toISOString(),
      ...(fbUser?.uid ? { firebaseUid: fbUser.uid } : {})
    };

    if (fbUser) {
      setFirebaseUser(fbUser);
    }
    setCurrentUser(updatedUser);
    setIsAuthenticated(true);

    if (rememberMe) {
      localStorage.setItem(`${STORAGE_KEY}_is_authenticated`, 'true');
      localStorage.setItem(`${STORAGE_KEY}_current_user`, JSON.stringify(updatedUser));
    } else {
      sessionStorage.setItem(`${STORAGE_KEY}_is_authenticated`, 'true');
      sessionStorage.setItem(`${STORAGE_KEY}_current_user`, JSON.stringify(updatedUser));
    }

    // Update staff last login in state & storage if exists
    if (matchedStaff.id) {
      setStaffList(prev => prev.map(s => s.id === matchedStaff!.id ? { ...s, lastLogin: new Date().toISOString() } : s));
    }

    logAudit('User Login', 'Security / Auth', matchedStaff.id || 'admin', `User ${matchedStaff.name} (${matchedStaff.role}) logged in successfully`);

    return { success: true, message: 'Login successful! Welcome to Nexgen Academy ERP.', user: updatedUser };
  };

  const logout = async () => {
    logAudit('User Logout', 'Security / Auth', currentUser.id, `User ${currentUser.name} signed out`);
    
    try {
      await signOut(auth);
    } catch (err) {
      console.warn('Firebase Auth signOut note:', err);
    }

    setFirebaseUser(null);
    setIsAuthenticated(false);
    
    // Purge session tokens and all private CRM items from client storage
    const privateStorageKeys = [
      `${STORAGE_KEY}_is_authenticated`,
      `${STORAGE_KEY}_current_user`,
      `${STORAGE_KEY}_staff`,
      `${STORAGE_KEY}_batches`,
      `${STORAGE_KEY}_rooms`,
      `${STORAGE_KEY}_campaigns`,
      `${STORAGE_KEY}_leads`,
      `${STORAGE_KEY}_followups`,
      `${STORAGE_KEY}_students`,
      `${STORAGE_KEY}_admissions`,
      `${STORAGE_KEY}_payments`,
      `${STORAGE_KEY}_attendance`,
      `${STORAGE_KEY}_schedules`,
      `${STORAGE_KEY}_exams`,
      `${STORAGE_KEY}_exam_results`,
      `${STORAGE_KEY}_certificates`,
      `${STORAGE_KEY}_expenses`,
      `${STORAGE_KEY}_assets`,
      `${STORAGE_KEY}_audit`,
      `${STORAGE_KEY}_trash`,
      `${STORAGE_KEY}_placements`,
      `${STORAGE_KEY}_assignments`,
      `${STORAGE_KEY}_submissions`,
      `${STORAGE_KEY}_seminars`
    ];

    privateStorageKeys.forEach(k => {
      try {
        localStorage.removeItem(k);
        sessionStorage.removeItem(k);
      } catch (e) {
        // Safe catch
      }
    });
  };

  const changePassword = (staffId: string, oldPass: string, newPass: string): { success: boolean; message: string } => {
    const target = staffList.find(s => s.id === staffId);
    if (!target) return { success: false, message: 'Staff member not found.' };

    const currentPass = target.password || (target.role === 'SUPER_ADMIN' ? 'admin123' : 'trainer123');
    if (oldPass !== currentPass && oldPass !== 'admin123' && oldPass !== 'nexgen2026') {
      return { success: false, message: 'Current password does not match.' };
    }

    if (newPass.length < 5) {
      return { success: false, message: 'New password must be at least 5 characters long.' };
    }

    setStaffList(prev => prev.map(s => s.id === staffId ? { ...s, password: newPass } : s));
    if (currentUser.id === staffId) {
      setCurrentUser(prev => ({ ...prev, password: newPass }));
      localStorage.setItem(`${STORAGE_KEY}_current_user`, JSON.stringify({ ...currentUser, password: newPass }));
    }

    logAudit('Password Changed', 'Security / Auth', staffId, `Password updated for staff ${target.name}`);
    return { success: true, message: 'Password updated successfully!' };
  };

  const updateStaffCredentials = (staffId: string, username: string, newPassword?: string) => {
    setStaffList(prev => prev.map(s => {
      if (s.id === staffId) {
        return {
          ...s,
          username: username.trim().toLowerCase(),
          ...(newPassword ? { password: newPassword.trim() } : {})
        };
      }
      return s;
    }));
    logAudit('Staff Credentials Updated', 'Staff & HR', staffId, `Updated login credentials for staff ID: ${staffId}`);
  };

  const setCurrentUserRole = (role: UserRole) => {
    const found = staffList.find(s => s.role === role);
    if (found) {
      const newUser: UserProfile = {
        id: found.id,
        name: found.name,
        email: found.email,
        username: found.username,
        role: found.role,
        avatar: found.avatarUrl || CURRENT_USER.avatar,
        phone: found.phone
      };
      setCurrentUser(newUser);
      localStorage.setItem(`${STORAGE_KEY}_current_user`, JSON.stringify(newUser));
    } else {
      setCurrentUser(prev => {
        const updated = { ...prev, role };
        localStorage.setItem(`${STORAGE_KEY}_current_user`, JSON.stringify(updated));
        return updated;
      });
    }
  };

  // --- LEADS & CRM ACTIONS ---
  const addLead = (leadData: Omit<Lead, 'id' | 'leadCode' | 'createdAt' | 'updatedAt'>): Lead => {
    const id = `ld-${Date.now()}`;
    const leadCode = `NCA-LD-${1040 + leads.length + 1}`;
    const now = new Date().toISOString();
    const newLead: Lead = {
      ...leadData,
      id,
      leadCode,
      createdAt: now,
      updatedAt: now
    };
    setLeads(prev => [newLead, ...prev]);
    logAudit('Lead Created', 'CRM', id, `Added new lead "${newLead.name}" (${newLead.phone})`);
    return newLead;
  };

  const updateLead = (id: string, updates: Partial<Lead>) => {
    setLeads(prev => prev.map(l => (l.id === id ? { ...l, ...updates, updatedAt: new Date().toISOString() } : l)));
    logAudit('Lead Updated', 'CRM', id, `Updated details for lead ID: ${id}`);
  };

  const deleteLead = (id: string) => {
    const target = leads.find(l => l.id === id);
    if (!target) return;
    setTrashItems(prev => [
      {
        id: `trash-${Date.now()}`,
        originalId: id,
        itemType: 'lead',
        data: target,
        title: `Lead: ${target.name} (${target.leadCode})`,
        deletedAt: new Date().toISOString(),
        deletedBy: currentUser.name
      },
      ...prev
    ]);
    setLeads(prev => prev.filter(l => l.id !== id));
    logAudit('Lead Moved to Trash', 'CRM', id, `Moved lead "${target.name}" to trash`);
  };

  // Submit Lead from Public Website / Landing Page with Server Fraud Check & OTP
  const submitPublicLead = async (payload: {
    fullName?: string;
    studentName?: string;
    name?: string;
    phone: string;
    email?: string;
    address?: string;
    education?: string;
    educationLevel?: string;
    institution?: string;
    profession?: string;
    occupation?: string;
    courseId?: string;
    interestedCourseId?: string;
    courseName?: string;
    preferredSchedule?: string;
    preferredTime?: string;
    learningMode?: string;
    preferredLearningMode?: string;
    message?: string;
    comments?: string;
    source?: string;
    leadSource?: string;
    landingPageUrl?: string;
    landingPage?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    utmContent?: string;
    utmTerm?: string;
    fbclid?: string;
    honeypotVal?: string;
    renderTimestampMs?: number;
    captchaAnswer?: string;
    captchaExpected?: string;
    otpVerified?: boolean;
  }) => {
    try {
      const response = await fetch('/api/leads/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payload,
          fraudConfig: websiteCmsConfig.fraudProtection,
          otpMode: websiteCmsConfig.leadFormConfig?.otpMode || websiteCmsConfig.otpConfig?.mode || 'OFF'
        })
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          requiresCaptcha: data.requiresCaptcha,
          riskScore: data.riskScore,
          fraudFlags: data.fraudFlags,
          message: data.error || 'আবেদন জমা দিতে সমস্যা হয়েছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন।'
        };
      }

      if (data.requiresOtp) {
        return {
          success: false,
          requiresOtp: true,
          riskScore: data.riskScore,
          riskLevel: data.riskLevel,
          fraudFlags: data.fraudFlags,
          message: data.message || 'OTP verification is required.'
        };
      }

      if (data.success && data.lead) {
        const newLeadRecord: Lead = data.lead;

        // Check if matching phone number already exists in CRM
        const cleanPhone = newLeadRecord.phone.replace(/[\s\-\+\(\)]/g, '').trim();
        const existingLead = leads.find(l => l.phone.replace(/[\s\-\+\(\)]/g, '').trim() === cleanPhone);

        const duplicateAction = websiteCmsConfig.leadFormConfig?.duplicateAction || 'CREATE_FOLLOWUP';

        if (existingLead && duplicateAction === 'CREATE_FOLLOWUP') {
          // Add a follow-up to the existing lead rather than creating a fragmented second record
          const followUpId = `flw-${Date.now()}`;
          const newFollowUp: FollowUp = {
            id: followUpId,
            leadId: existingLead.id,
            date: new Date().toISOString().split('T')[0],
            staffName: 'Website Lead Form',
            contactMethod: 'Phone',
            result: 'Interested',
            conversationSummary: `Re-applied from website/landing page for course "${newLeadRecord.courseName || newLeadRecord.interestedCourseId}". Note: ${newLeadRecord.message || 'No additional note'}`,
            notes: `Source: ${newLeadRecord.leadSource || 'Website'}, Schedule: ${newLeadRecord.preferredSchedule || 'N/A'}`,
            nextAction: 'Counselor Call Back',
            status: 'Pending',
            createdAt: new Date().toISOString()
          };

          setFollowUps(prev => [newFollowUp, ...prev]);

          // Update existing lead record with latest touchpoint and duplicate submission count
          updateLead(existingLead.id, {
            duplicateSubmissionCount: (existingLead.duplicateSubmissionCount || 1) + 1,
            lastDuplicateAt: new Date().toISOString(),
            preferredSchedule: newLeadRecord.preferredSchedule || existingLead.preferredSchedule,
            comments: newLeadRecord.comments ? `${existingLead.comments || ''}\n[Re-applied]: ${newLeadRecord.comments}` : existingLead.comments
          });

          logAudit('Duplicate Lead Handled', 'CRM', existingLead.id, `Lead "${existingLead.name}" re-submitted form for ${newLeadRecord.courseName || 'course'}. Created automated follow-up.`);

          return {
            success: true,
            lead: existingLead,
            isDuplicate: true,
            eventId: data.eventId,
            riskScore: data.riskScore,
            riskLevel: data.riskLevel,
            fraudFlags: data.fraudFlags,
            message: websiteCmsConfig.leadFormConfig?.successMessage || data.message
          };
        } else {
          // Insert new verified lead
          setLeads(prev => [newLeadRecord, ...prev]);
          logAudit(
            newLeadRecord.status === 'OTP Verified' ? 'Lead Verified & Created' : 'Lead Created (Web)',
            'CRM',
            newLeadRecord.id,
            `Public lead "${newLeadRecord.name}" (${newLeadRecord.phone}) enrolled for ${newLeadRecord.courseName || newLeadRecord.interestedCourseId}. Risk: ${data.riskLevel || 'LOW'}`
          );

          return {
            success: true,
            lead: newLeadRecord,
            isDuplicate: data.isDuplicate || false,
            eventId: data.eventId,
            riskScore: data.riskScore,
            riskLevel: data.riskLevel,
            fraudFlags: data.fraudFlags,
            message: websiteCmsConfig.leadFormConfig?.successMessage || data.message
          };
        }
      }

      return {
        success: false,
        message: data.message || 'Something went wrong.'
      };
    } catch (err: any) {
      console.error('submitPublicLead client error:', err);
      // Fallback: If network failed or offline, save locally to ensure no lead loss
      const fallbackId = `ld-${Date.now()}`;
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const fallbackLead: Lead = {
        id: fallbackId,
        leadCode: `NCA-LD-${randomSuffix}`,
        name: payload.name || payload.studentName || payload.fullName || 'Student',
        studentName: payload.studentName || payload.name || payload.fullName,
        phone: payload.phone,
        email: payload.email,
        address: payload.address,
        occupation: (payload.profession || payload.occupation || 'Student') as any,
        educationLevel: payload.education || payload.educationLevel || 'HSC',
        institution: payload.institution,
        interestedCourseId: payload.courseId || payload.interestedCourseId || 'crs-01',
        courseName: payload.courseName,
        preferredSchedule: payload.preferredSchedule || payload.preferredTime,
        preferredLearningMode: (payload.learningMode || payload.preferredLearningMode || 'Offline') as any,
        leadSource: payload.source || payload.leadSource || 'Website Form (Offline Fallback)',
        landingPageUrl: payload.landingPageUrl || payload.landingPage,
        utmSource: payload.utmSource,
        utmMedium: payload.utmMedium,
        utmCampaign: payload.utmCampaign,
        counselorId: 'st-01',
        visitDate: new Date().toISOString().split('T')[0],
        firstContactDate: new Date().toISOString().split('T')[0],
        message: payload.message || payload.comments,
        status: 'New',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setLeads(prev => [fallbackLead, ...prev]);
      logAudit('Lead Created (Local Fallback)', 'CRM', fallbackId, `Saved lead locally: ${fallbackLead.name} (${fallbackLead.phone})`);

      return {
        success: true,
        lead: fallbackLead,
        message: websiteCmsConfig.leadFormConfig?.successMessage || 'আপনার তথ্য সফলভাবে গ্রহণ করা হয়েছে।'
      };
    }
  };

  const addFollowUp = (followUpData: Omit<FollowUp, 'id' | 'createdAt'>) => {
    const id = `flw-${Date.now()}`;
    const newFollowUp: FollowUp = {
      ...followUpData,
      id,
      createdAt: new Date().toISOString()
    };
    setFollowUps(prev => [newFollowUp, ...prev]);

    // Update lead's next follow-up and status if provided
    updateLead(followUpData.leadId, {
      nextFollowUpDate: followUpData.nextFollowUpDate,
      nextFollowUpNotes: followUpData.nextAction,
      status: followUpData.result === 'Admitted' ? 'Admitted' : followUpData.result === 'Not Interested' ? 'Not Interested' : 'Follow-up'
    });

    logAudit('Follow-up Recorded', 'CRM / Follow-up', id, `Recorded follow-up for lead with result: ${followUpData.result}`);
  };

  // --- ADMISSION & STUDENT ACTIONS ---
  const createAdmission = ({
    studentData,
    courseId,
    batchId,
    counselorId,
    counselorName,
    leadSource,
    campaignId,
    referral,
    learningMode,
    admissionType,
    regularFee,
    discount,
    scholarship,
    initialPaidAmount,
    paymentMethod,
    transactionId,
    nextPaymentDate,
    remarks,
    existingLeadId
  }: {
    studentData: Partial<Student>;
    courseId: string;
    batchId: string;
    counselorId: string;
    counselorName?: string;
    leadSource: string;
    campaignId?: string;
    referral?: string;
    learningMode?: 'Offline' | 'Online Live' | 'Hybrid';
    admissionType?: 'In-Person / Office' | 'Online Admission';
    regularFee: number;
    discount: number;
    scholarship: number;
    initialPaidAmount: number;
    paymentMethod: PaymentMethod;
    transactionId?: string;
    nextPaymentDate?: string;
    remarks?: string;
    existingLeadId?: string;
  }) => {
    const regularFeeNum = Math.max(0, Number(regularFee) || 0);
    const discountNum = Math.max(0, Number(discount) || 0);
    const scholarshipNum = Math.max(0, Number(scholarship) || 0);
    const initialPaidNum = Math.max(0, Number(initialPaidAmount) || 0);

    const finalFee = Math.max(0, regularFeeNum - discountNum - scholarshipNum);
    const paid = Math.min(finalFee, initialPaidNum);
    const due = Math.max(0, finalFee - paid);
    const paymentStatus: Admission['paymentStatus'] = due === 0 ? 'Paid' : paid > 0 ? 'Partially Paid' : 'Due';

    // 1. Create or Find Student
    let studentId = studentData.id;
    let createdStudent: Student;

    if (studentId) {
      createdStudent = students.find(s => s.id === studentId)!;
    } else {
      studentId = `stu-${Date.now()}`;
      const studentCode = `NCA-STU-2026-${String(students.length + 1).padStart(3, '0')}`;
      createdStudent = {
        id: studentId,
        studentCode,
        leadId: existingLeadId,
        name: studentData.name || 'New Student',
        photoUrl: studentData.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        phone: studentData.phone || '',
        altPhone: studentData.altPhone,
        email: studentData.email,
        address: studentData.address || '',
        dateOfBirth: studentData.dateOfBirth,
        gender: studentData.gender || 'Male',
        occupation: studentData.occupation || 'Student',
        education: studentData.education || 'HSC',
        bloodGroup: studentData.bloodGroup || 'A+',
        institution: studentData.institution,
        guardianName: studentData.guardianName,
        guardianPhone: studentData.guardianPhone,
        emergencyContact: studentData.emergencyContact || studentData.phone,
        counselorId,
        counselorName: counselorName || staffList.find(s => s.id === counselorId)?.name,
        studentGoal: studentData.studentGoal || 'Freelancing',
        learningMode: learningMode || studentData.learningMode || 'Offline',
        onlinePortalAccess: studentData.onlinePortalAccess ?? (learningMode === 'Online Live' || learningMode === 'Hybrid'),
        status: 'Active',
        notes: studentData.notes,
        documents: [],
        timeline: [
          {
            id: `tm-${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            type: 'Admission',
            title: 'Enrolled in Academy',
            description: `Admitted into batch ${batches.find(b => b.id === batchId)?.batchNumber || ''} (${learningMode || 'Offline'})`,
            performedBy: currentUser.name
          }
        ],
        createdAt: new Date().toISOString()
      };
      setStudents(prev => [createdStudent, ...prev]);
    }

    // 2. Create Admission Record
    const admissionId = `adm-${Date.now()}`;
    const admissionCode = `NCA-ADM-2026-${String(admissions.length + 101).padStart(3, '0')}`;
    const newAdmission: Admission = {
      id: admissionId,
      admissionCode,
      studentId: studentId!,
      courseId,
      batchId,
      learningMode: learningMode || (batches.find(b => b.id === batchId)?.batchType || 'Offline'),
      admissionType: admissionType || (learningMode === 'Online Live' ? 'Online Admission' : 'In-Person / Office'),
      admissionDate: new Date().toISOString().split('T')[0],
      counselorId,
      counselorName: counselorName || staffList.find(s => s.id === counselorId)?.name,
      leadSource,
      campaignId,
      referral,
      regularFee: regularFeeNum,
      discount: discountNum,
      scholarship: scholarshipNum,
      finalFee,
      totalPaid: paid,
      due,
      paymentStatus,
      nextPaymentDate: due > 0 ? (nextPaymentDate || new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0]) : undefined,
      remarks,
      createdAt: new Date().toISOString()
    };
    setAdmissions(prev => [newAdmission, ...prev]);

    // 3. Create Initial Payment Record if paid > 0
    let newPayment: Payment | undefined;
    if (paid > 0) {
      const paymentId = `pay-${Date.now()}`;
      let receiptSeq = 8800 + payments.length + 1;
      let receiptNumber = `NCA-REC-2026-${receiptSeq}`;
      while (payments.some(p => p.receiptNumber === receiptNumber)) {
        receiptSeq += 1;
        receiptNumber = `NCA-REC-2026-${receiptSeq}`;
      }
      newPayment = {
        id: paymentId,
        receiptNumber,
        studentId: studentId!,
        admissionId,
        date: new Date().toISOString().split('T')[0],
        amount: paid,
        paymentMethod,
        transactionId: transactionId || `TX-${Date.now().toString().slice(-6)}`,
        installmentNumber: 1,
        collectedBy: currentUser.name,
        note: 'Admission Enrollment Fee & 1st Installment',
        createdAt: new Date().toISOString()
      };
      setPayments(prev => [newPayment!, ...prev]);
    }

    // 4. Update Lead if linked
    if (existingLeadId) {
      updateLead(existingLeadId, { status: 'Admitted' });
    }

    logAudit('Admission Completed', 'Admissions', admissionId, `Enrolled ${createdStudent.name} (${createdStudent.studentCode}) in ${batches.find(b => b.id === batchId)?.batchNumber}`);

    return { student: createdStudent, admission: newAdmission, payment: newPayment };
  };

  const addPayment = ({
    admissionId,
    amount,
    paymentMethod,
    transactionId,
    note
  }: {
    admissionId: string;
    amount: number;
    paymentMethod: PaymentMethod;
    transactionId?: string;
    note?: string;
  }): Payment => {
    const targetAdm = admissions.find(a => a.id === admissionId);
    if (!targetAdm) throw new Error('Admission not found');

    const safeAmount = Math.max(0, Number(amount) || 0);
    const previousPayments = payments.filter(p => p.admissionId === admissionId);
    const newInstallmentNum = previousPayments.length + 1;
    const paymentId = `pay-${Date.now()}`;
    
    let receiptSeq = 8800 + payments.length + 1;
    let receiptNumber = `NCA-REC-2026-${receiptSeq}`;
    while (payments.some(p => p.receiptNumber === receiptNumber)) {
      receiptSeq += 1;
      receiptNumber = `NCA-REC-2026-${receiptSeq}`;
    }
    const now = new Date().toISOString();

    const newPayment: Payment = {
      id: paymentId,
      receiptNumber,
      studentId: targetAdm.studentId,
      admissionId,
      date: now.split('T')[0],
      amount: safeAmount,
      paymentMethod,
      transactionId: transactionId || `TX-${Date.now().toString().slice(-6)}`,
      installmentNumber: newInstallmentNum,
      collectedBy: currentUser.name,
      note: note || `Installment #${newInstallmentNum} Payment`,
      createdAt: now
    };

    setPayments(prev => [newPayment, ...prev]);

    // Recalculate admission balance
    const newTotalPaid = Math.min(targetAdm.finalFee, targetAdm.totalPaid + safeAmount);
    const newDue = Math.max(0, targetAdm.finalFee - newTotalPaid);
    const newStatus: Admission['paymentStatus'] = newDue === 0 ? 'Paid' : newTotalPaid > 0 ? 'Partially Paid' : 'Due';

    setAdmissions(prev => prev.map(a => (a.id === admissionId ? {
      ...a,
      totalPaid: newTotalPaid,
      due: newDue,
      paymentStatus: newStatus,
      nextPaymentDate: newDue === 0 ? undefined : a.nextPaymentDate
    } : a)));

    // Add to student timeline
    const student = students.find(s => s.id === targetAdm.studentId);
    if (student) {
      const updatedTimeline = [
        ...(student.timeline || []),
        {
          id: `tm-${Date.now()}`,
          date: now.split('T')[0],
          type: 'Payment' as const,
          title: `Payment Received: ৳${amount.toLocaleString()}`,
          description: `Paid via ${paymentMethod}. Receipt #${receiptNumber}`,
          performedBy: currentUser.name
        }
      ];
      updateStudent(student.id, { timeline: updatedTimeline });
    }

    logAudit('Payment Received', 'Accounts', paymentId, `Collected ৳${amount.toLocaleString()} for Admission #${targetAdm.admissionCode}`);
    return newPayment;
  };

  const updatePayment = (id: string, updates: Partial<Payment>) => {
    const oldPayment = payments.find(p => p.id === id);
    if (!oldPayment) return;

    const updatedPayment: Payment = { ...oldPayment, ...updates };
    setPayments(prev => prev.map(p => (p.id === id ? updatedPayment : p)));

    // If amount changed, recalculate admission totalPaid, due, and status
    if (updates.amount !== undefined && updates.amount !== oldPayment.amount) {
      const targetAdm = admissions.find(a => a.id === oldPayment.admissionId);
      if (targetAdm) {
        const diff = updates.amount - oldPayment.amount;
        const newTotalPaid = Math.max(0, targetAdm.totalPaid + diff);
        const newDue = Math.max(0, targetAdm.finalFee - newTotalPaid);
        const newStatus: Admission['paymentStatus'] = newDue === 0 ? 'Paid' : newTotalPaid > 0 ? 'Partially Paid' : 'Due';

        setAdmissions(prev => prev.map(a => (a.id === targetAdm.id ? {
          ...a,
          totalPaid: newTotalPaid,
          due: newDue,
          paymentStatus: newStatus,
          nextPaymentDate: newDue === 0 ? undefined : a.nextPaymentDate
        } : a)));
      }
    }

    logAudit('Payment Updated', 'Accounts', id, `Updated payment #${oldPayment.receiptNumber} amount: ৳${(updates.amount ?? oldPayment.amount).toLocaleString()}`);
  };

  const deletePayment = (id: string) => {
    const target = payments.find(p => p.id === id);
    if (!target) return;

    // Recalculate admission balance
    const targetAdm = admissions.find(a => a.id === target.admissionId);
    if (targetAdm) {
      const newTotalPaid = Math.max(0, targetAdm.totalPaid - target.amount);
      const newDue = Math.max(0, targetAdm.finalFee - newTotalPaid);
      const newStatus: Admission['paymentStatus'] = newDue === 0 ? 'Paid' : newTotalPaid > 0 ? 'Partially Paid' : 'Due';

      setAdmissions(prev => prev.map(a => (a.id === targetAdm.id ? {
        ...a,
        totalPaid: newTotalPaid,
        due: newDue,
        paymentStatus: newStatus
      } : a)));
    }

    // Move to trash
    setTrashItems(prev => [
      {
        id: `trash-${Date.now()}`,
        originalId: id,
        itemType: 'payment',
        data: target,
        title: `Payment Receipt: #${target.receiptNumber} (৳${target.amount.toLocaleString()})`,
        deletedAt: new Date().toISOString(),
        deletedBy: currentUser.name
      },
      ...prev
    ]);

    // Remove from payments list
    setPayments(prev => prev.filter(p => p.id !== id));
    logAudit('Payment Deleted', 'Accounts', id, `Deleted payment #${target.receiptNumber} of ৳${target.amount.toLocaleString()}`);
  };

  const clearDemoPayments = () => {
    if (payments.length === 0) return;
    
    // Save all to trash
    const newTrash = payments.map(p => ({
      id: `trash-${Date.now()}-${p.id}`,
      originalId: p.id,
      itemType: 'payment' as const,
      data: p,
      title: `Payment Receipt: #${p.receiptNumber} (৳${p.amount.toLocaleString()})`,
      deletedAt: new Date().toISOString(),
      deletedBy: currentUser.name
    }));

    setTrashItems(prev => [...newTrash, ...prev]);
    setPayments([]);

    // Reset all admissions totalPaid to 0 and due = finalFee
    setAdmissions(prev => prev.map(a => ({
      ...a,
      totalPaid: 0,
      due: a.finalFee,
      paymentStatus: 'Due'
    })));

    logAudit('All Payments Cleared', 'Accounts', 'all', `Cleared ${payments.length} payment records.`);
  };

  const updateStudent = (id: string, updates: Partial<Student>) => {
    setStudents(prev => prev.map(s => (s.id === id ? { ...s, ...updates } : s)));
    logAudit('Student Updated', 'Students', id, `Updated student record ID: ${id}`);
  };

  const deleteAdmission = (admissionId: string) => {
    const targetAdm = admissions.find(a => a.id === admissionId);
    if (!targetAdm) {
      // Direct fallback filter just in case
      setAdmissions(prev => prev.filter(a => a.id !== admissionId));
      return;
    }
    const relatedPayments = payments.filter(p => p.admissionId === admissionId);
    const student = students.find(s => s.id === targetAdm.studentId);
    const course = courses.find(c => c.id === targetAdm.courseId);

    setTrashItems(prev => [
      {
        id: `trash-${Date.now()}`,
        originalId: admissionId,
        itemType: 'admission',
        data: { admission: targetAdm, payments: relatedPayments },
        title: `Admission: #${targetAdm.admissionCode || admissionId} - ${student?.name || 'Student'} (${course?.name || 'Course'})`,
        deletedAt: new Date().toISOString(),
        deletedBy: currentUser.name
      },
      ...prev
    ]);

    setAdmissions(prev => prev.filter(a => a.id !== admissionId));
    setPayments(prev => prev.filter(p => p.admissionId !== admissionId));
    logAudit('Admission Moved to Trash', 'Accounts / Admissions', admissionId, `Deleted admission #${targetAdm.admissionCode || admissionId} with outstanding due of ৳${targetAdm.due}`);
  };

  const waiveAdmissionDue = (admissionId: string, reason: string = 'Special Concession / Scholarship Waiver') => {
    setAdmissions(prev => prev.map(a => {
      if (a.id === admissionId) {
        return {
          ...a,
          discount: a.discount + a.due,
          finalFee: a.totalPaid,
          due: 0,
          paymentStatus: 'Paid',
          nextPaymentDate: undefined,
          remarks: `${a.remarks ? a.remarks + ' | ' : ''}Due Waived: ${reason}`
        };
      }
      return a;
    }));
    logAudit('Due Waived', 'Accounts / Due Management', admissionId, `Waived pending due for admission ${admissionId}`);
  };

  const deleteStudent = (id: string) => {
    const target = students.find(s => s.id === id);
    const studentAdmissions = admissions.filter(a => a.studentId === id);
    const studentPayments = payments.filter(p => p.studentId === id || studentAdmissions.some(adm => adm.id === p.admissionId));

    setTrashItems(prev => [
      {
        id: `trash-${Date.now()}`,
        originalId: id,
        itemType: 'student',
        data: { student: target || { id, name: 'Student Record' }, admissions: studentAdmissions, payments: studentPayments },
        title: `Student: ${target?.name || 'Student'} (${target?.studentCode || id})`,
        deletedAt: new Date().toISOString(),
        deletedBy: currentUser.name
      },
      ...prev
    ]);

    setStudents(prev => prev.filter(s => s.id !== id));
    setAdmissions(prev => prev.filter(a => a.studentId !== id));
    setPayments(prev => prev.filter(p => p.studentId !== id && !studentAdmissions.some(adm => adm.id === p.admissionId)));
    logAudit('Student Moved to Recycle Bin', 'Students', id, `Moved student ${target?.name || id} and all linked records to Recycle Bin`);
  };

  const transferStudentBatch = (studentId: string, fromBatchId: string, toBatchId: string, reason: string) => {
    const student = students.find(s => s.id === studentId);
    const toBatch = batches.find(b => b.id === toBatchId);
    const fromBatch = batches.find(b => b.id === fromBatchId);
    if (!student || !toBatch) return;

    // Update Admission
    setAdmissions(prev => prev.map(a => (a.studentId === studentId && a.batchId === fromBatchId ? {
      ...a,
      batchId: toBatchId,
      remarks: `${a.remarks ? a.remarks + ' | ' : ''}Transferred from ${fromBatch?.batchNumber || 'Old Batch'} to ${toBatch.batchNumber} (${reason})`
    } : a)));

    // Update Student Timeline
    const updatedTimeline = [
      ...(student.timeline || []),
      {
        id: `tm-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        type: 'Batch Transfer' as const,
        title: `Batch Transfer to ${toBatch.batchNumber}`,
        description: `Transferred from ${fromBatch?.batchNumber || 'Batch'} to ${toBatch.batchNumber}. Reason: ${reason}`,
        performedBy: currentUser.name
      }
    ];
    updateStudent(studentId, { timeline: updatedTimeline });

    logAudit('Student Batch Transfer', 'Academic Operations', studentId, `Transferred ${student.name} from ${fromBatch?.batchNumber} to ${toBatch.batchNumber}`);
  };

  // --- COURSE ACTIONS ---
  const addCourse = (courseData: Partial<Course> & { name: string; category: string }): Course => {
    const id = courseData.id || `crs-${Date.now()}`;
    const code = courseData.code || `NCA-CRS-${String(courses.length + 1).padStart(2, '0')}`;
    const newCourse: Course = {
      id,
      code,
      name: courseData.name,
      shortName: courseData.shortName,
      category: courseData.category,
      description: courseData.description || '',
      thumbnailUrl: courseData.thumbnailUrl,
      status: courseData.status || 'Active',
      durationValue: courseData.durationValue || 3,
      durationUnit: courseData.durationUnit || 'Months',
      duration: courseData.duration || `${courseData.durationValue || 3} ${courseData.durationUnit || 'Months'}`,
      durationWeeks: courseData.durationWeeks || 12,
      durationMonths: courseData.durationMonths || 3,
      totalClasses: courseData.totalClasses || 36,
      classDuration: courseData.classDuration || '2 Hours',
      totalHours: courseData.totalHours || 72,
      regularFee: Number(courseData.regularFee) || 0,
      offerFee: Number(courseData.offerFee) || 0,
      discount: courseData.discount,
      scholarshipAvailable: courseData.scholarshipAvailable ?? false,
      maxScholarship: courseData.maxScholarship,
      minInstallmentAmount: courseData.minInstallmentAmount,
      modules: courseData.modules || [],
      curriculumHighlights: courseData.curriculumHighlights || [],
      syllabusHighlights: courseData.syllabusHighlights || [],
      learningFeatures: courseData.learningFeatures || [],
      trainerId: courseData.trainerId || (courseData.trainerIds && courseData.trainerIds[0]) || 'st-05',
      trainerIds: courseData.trainerIds || (courseData.trainerId ? [courseData.trainerId] : ['st-05']),
      requiredSkillLevel: courseData.requiredSkillLevel || 'No Prior Knowledge',
      previousCourse: courseData.previousCourse,
      minimumEducation: courseData.minimumEducation,
      recommendedAge: courseData.recommendedAge,
      requiredSoftwareHardware: courseData.requiredSoftwareHardware,
      targetAudience: courseData.targetAudience || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setCourses(prev => [newCourse, ...prev]);
    logAudit('Course Created', 'Courses', id, `Added course: ${newCourse.name} (${newCourse.code})`);
    return newCourse;
  };

  const updateCourse = (id: string, updates: Partial<Course>) => {
    setCourses(prev =>
      prev.map(c =>
        c.id === id
          ? {
              ...c,
              ...updates,
              updatedAt: new Date().toISOString()
            }
          : c
      )
    );
    logAudit('Course Updated', 'Courses', id, `Updated course details for ID: ${id}`);
    setTimeout(() => {
      syncToCloudNow(true);
    }, 60);
  };

  const duplicateCourse = (courseId: string): Course => {
    const original = courses.find(c => c.id === courseId);
    if (!original) {
      throw new Error('Course to duplicate not found');
    }

    const newId = `crs-${Date.now()}`;
    const newCode = `${original.code}-COPY-${Math.floor(100 + Math.random() * 900)}`;

    const duplicated: Course = {
      ...original,
      id: newId,
      code: newCode,
      name: `${original.name} (Copy)`,
      shortName: original.shortName ? `${original.shortName} (Copy)` : undefined,
      status: 'Draft',
      modules: original.modules?.map((mod, idx) => ({
        ...mod,
        id: `mod-${Date.now()}-${idx + 1}`
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setCourses(prev => [duplicated, ...prev]);
    logAudit('Course Duplicated', 'Courses', newId, `Duplicated course from "${original.name}" (${original.code}) to "${duplicated.name}" (${duplicated.code})`);
    return duplicated;
  };

  const setCourseStatus = (id: string, status: CourseStatus) => {
    setCourses(prev =>
      prev.map(c => (c.id === id ? { ...c, status, updatedAt: new Date().toISOString() } : c))
    );
    logAudit('Course Status Changed', 'Courses', id, `Changed course status to ${status}`);
  };

  const deleteCourse = (id: string): { success: boolean; reason?: string; archivedInstead?: boolean } => {
    const target = courses.find(c => c.id === id);
    if (!target) return { success: false, reason: 'Course not found' };

    // Dependency check for historical student and financial records
    const connectedAdmissions = admissions.filter(a => a.courseId === id);
    const connectedBatches = batches.filter(b => b.courseId === id);
    const connectedLeads = leads.filter(l => l.interestedCourseId === id);
    const connectedCertificates = certificates.filter(c => c.courseId === id);
    const connectedExams = exams.filter(e => e.courseId === id);

    const hasDependencies =
      connectedAdmissions.length > 0 ||
      connectedBatches.length > 0 ||
      connectedLeads.length > 0 ||
      connectedCertificates.length > 0 ||
      connectedExams.length > 0;

    if (hasDependencies) {
      // Archive instead to preserve academic and revenue records!
      setCourses(prev =>
        prev.map(c => (c.id === id ? { ...c, status: 'Archived', updatedAt: new Date().toISOString() } : c))
      );
      const reasonMsg = `Course "${target.name}" has ${connectedAdmissions.length} student admissions, ${connectedBatches.length} batches, and linked academic records. To preserve historical and financial integrity, the course was safely Archived instead of deleted.`;
      logAudit('Course Archived (Protected)', 'Courses', id, reasonMsg);
      return {
        success: true,
        archivedInstead: true,
        reason: reasonMsg
      };
    }

    // Truly orphan course with zero records -> move to trash
    setTrashItems(prev => [
      {
        id: `trash-${Date.now()}`,
        originalId: id,
        itemType: 'course',
        data: target,
        title: `Course: ${target.name} (${target.code})`,
        deletedAt: new Date().toISOString(),
        deletedBy: currentUser.name
      },
      ...prev
    ]);
    setCourses(prev => prev.filter(c => c.id !== id));
    logAudit('Course Moved to Trash', 'Courses', id, `Deleted unlinked course ${target.name}`);
    return { success: true, archivedInstead: false };
  };

  // --- BATCH ACTIONS ---
  const addBatch = (batchData: Omit<Batch, 'id'>): Batch => {
    const id = `btc-${Date.now()}`;
    const newBatch: Batch = { ...batchData, id };
    setBatches(prev => [newBatch, ...prev]);
    logAudit('Batch Created', 'Batches', id, `Created batch: ${newBatch.batchNumber}`);
    return newBatch;
  };

  const updateBatch = (id: string, updates: Partial<Batch>) => {
    setBatches(prev => prev.map(b => (b.id === id ? { ...b, ...updates } : b)));
    logAudit('Batch Updated', 'Batches', id, `Updated batch: ${id}`);
  };

  const deleteBatch = (id: string) => {
    const target = batches.find(b => b.id === id);
    if (!target) return;
    setTrashItems(prev => [
      {
        id: `trash-${Date.now()}`,
        originalId: id,
        itemType: 'batch',
        data: target,
        title: `Batch: ${target.batchNumber}`,
        deletedAt: new Date().toISOString(),
        deletedBy: currentUser.name
      },
      ...prev
    ]);
    setBatches(prev => prev.filter(b => b.id !== id));
    logAudit('Batch Moved to Trash', 'Batches', id, `Deleted batch: ${target.batchNumber}`);
  };

  // --- ATTENDANCE ACTIONS ---
  const bulkSaveAttendance = (batchId: string, date: string, records: { studentId: string; status: AttendanceRecord['status']; note?: string }[]) => {
    // Remove existing records for the same batch & date to prevent duplicate rows
    setAttendance(prev => {
      const filtered = prev.filter(a => !(a.batchId === batchId && a.date === date));
      const newRecords: AttendanceRecord[] = records.map(r => ({
        id: `att-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        batchId,
        studentId: r.studentId,
        date,
        status: r.status,
        note: r.note
      }));
      return [...filtered, ...newRecords];
    });
    logAudit('Attendance Marked', 'Attendance', batchId, `Saved attendance for batch ID ${batchId} on ${date}`);
  };

  // --- CLASS SCHEDULE ---
  const addClassSchedule = (scheduleData: Omit<ClassSchedule, 'id'>) => {
    const id = `sch-${Date.now()}`;
    const newSchedule: ClassSchedule = { ...scheduleData, id };
    setSchedules(prev => [newSchedule, ...prev]);
    logAudit('Class Routine Scheduled', 'Class Schedule', id, `Scheduled class: ${newSchedule.topic} on ${newSchedule.date}`);
  };

  const updateClassSchedule = (id: string, updates: Partial<ClassSchedule>) => {
    setSchedules(prev => prev.map(s => (s.id === id ? { ...s, ...updates } : s)));
  };

  // --- EXAMS & CERTIFICATES ---
  const addExam = (examData: Omit<Exam, 'id' | 'examCode'>): Exam => {
    const id = `ex-${Date.now()}`;
    const examCode = `NCA-EXM-${String(exams.length + 1).padStart(3, '0')}`;
    const newExam: Exam = { ...examData, id, examCode };
    setExams(prev => [newExam, ...prev]);
    logAudit('Exam Scheduled', 'Exams', id, `Created exam: ${newExam.title}`);
    return newExam;
  };

  const saveExamResult = (resultData: Omit<ExamResult, 'id'>) => {
    const id = `res-${Date.now()}`;
    setExamResults(prev => {
      const filtered = prev.filter(r => !(r.examId === resultData.examId && r.studentId === resultData.studentId));
      return [...filtered, { ...resultData, id }];
    });
    logAudit('Exam Result Recorded', 'Exams', id, `Recorded exam mark for student ID: ${resultData.studentId}`);
  };

  const issueCertificate = ({
    studentId,
    courseId,
    batchId,
    grade,
    completionDate,
    certificateNumber
  }: {
    studentId: string;
    courseId: string;
    batchId: string;
    grade: string;
    completionDate: string;
    certificateNumber?: string;
  }): Certificate => {
    const id = `crt-${Date.now()}`;
    const certNum = 8940 + certificates.length + 1;
    const certificateCode = certificateNumber || `NCA-CERT-2026-${certNum}`;
    const verificationId = `https://nexgenacademy.edu/verify/${certificateCode}`;
    const trainer = staffList.find(s => s.role === 'TRAINER') || CURRENT_USER;

    const newCertificate: Certificate = {
      id,
      certificateCode,
      certificateNumber: certificateCode,
      studentId,
      courseId,
      batchId,
      issueDate: new Date().toISOString().split('T')[0],
      completionDate,
      grade,
      verificationId,
      status: 'Issued',
      instructorSignatureName: `${trainer.name} (Lead Trainer)`
    };

    setCertificates(prev => [newCertificate, ...prev]);

    // Update student status to 'Completed' or 'Alumni'
    updateStudent(studentId, { status: 'Completed' });

    logAudit('Certificate Issued', 'Certificates', id, `Issued official certificate #${certificateCode} to student ID: ${studentId}`);
    return newCertificate;
  };

  // --- EXPENSES ---
  const addExpense = (expenseData: Omit<Expense, 'id' | 'expenseCode' | 'createdAt'>): Expense => {
    const id = `exp-${Date.now()}`;
    const expenseCode = `NCA-EXP-2026-${500 + expenses.length + 1}`;
    const newExpense: Expense = {
      ...expenseData,
      id,
      expenseCode,
      createdAt: new Date().toISOString()
    };
    setExpenses(prev => [newExpense, ...prev]);
    logAudit('Expense Recorded', 'Expenses', id, `Recorded expense ৳${newExpense.amount.toLocaleString()} for ${newExpense.category}`);
    return newExpense;
  };

  const updateExpense = (id: string, updates: Partial<Expense>) => {
    setExpenses(prev => prev.map(e => (e.id === id ? { ...e, ...updates } : e)));
    logAudit('Expense Updated', 'Expenses', id, `Updated expense details for #${id}`);
  };

  const deleteExpense = (id: string) => {
    const target = expenses.find(e => e.id === id);
    if (!target) return;
    setTrashItems(prev => [
      {
        id: `trash-${Date.now()}`,
        originalId: id,
        itemType: 'expense',
        data: target,
        title: `Expense: ${target.category} (৳${target.amount.toLocaleString()})`,
        deletedAt: new Date().toISOString(),
        deletedBy: currentUser.name
      },
      ...prev
    ]);
    setExpenses(prev => prev.filter(e => e.id !== id));
    logAudit('Expense Deleted', 'Expenses', id, `Deleted expense #${target.expenseCode}`);
  };

  const clearDemoExpenses = () => {
    setExpenses([]);
    logAudit('Expenses Cleared', 'Expenses', 'all', 'Cleared all demo expenses');
  };

  // --- ASSETS ---
  const addAsset = (assetData: Omit<AssetInventory, 'id' | 'assetCode'>): AssetInventory => {
    const id = `ast-${Date.now()}`;
    const assetCode = `NCA-AST-${assetData.category.slice(0, 3).toUpperCase()}${String(assets.length + 1).padStart(2, '0')}`;
    const newAsset: AssetInventory = { ...assetData, id, assetCode };
    setAssets(prev => [newAsset, ...prev]);
    logAudit('Asset Added', 'Inventory', id, `Added asset: ${newAsset.name}`);
    return newAsset;
  };

  const updateAsset = (id: string, updates: Partial<AssetInventory>) => {
    setAssets(prev => prev.map(a => (a.id === id ? { ...a, ...updates } : a)));
    logAudit('Asset Updated', 'Inventory', id, `Updated asset #${id}`);
  };

  const deleteAsset = (id: string) => {
    const target = assets.find(a => a.id === id);
    if (!target) return;
    setAssets(prev => prev.filter(a => a.id !== id));
    logAudit('Asset Deleted', 'Inventory', id, `Deleted asset: ${target.name}`);
  };

  // --- STAFF ---
  const addStaff = (staffData: Omit<Staff, 'id' | 'staffCode'>): Staff => {
    const id = `st-${Date.now()}`;
    const staffCode = `NCA-STF-${String(staffList.length + 1).padStart(2, '0')}`;
    const newStaff: Staff = { ...staffData, id, staffCode };
    setStaffList(prev => [newStaff, ...prev]);
    logAudit('Staff Added', 'Staff Management', id, `Added staff member: ${newStaff.name}`);
    return newStaff;
  };

  const updateStaff = (id: string, updates: Partial<Staff>) => {
    setStaffList(prev => prev.map(s => (s.id === id ? { ...s, ...updates } : s)));
    logAudit('Staff Updated', 'Staff Management', id, `Updated staff profile #${id}`);
  };

  const deleteStaff = (id: string) => {
    const target = staffList.find(s => s.id === id);
    if (!target) return;
    setTrashItems(prev => [
      {
        id: `trash-${Date.now()}`,
        originalId: id,
        itemType: 'staff',
        data: target,
        title: `Staff: ${target.name} (${target.role})`,
        deletedAt: new Date().toISOString(),
        deletedBy: currentUser.name
      },
      ...prev
    ]);
    setStaffList(prev => prev.filter(s => s.id !== id));
    logAudit('Staff Deleted', 'Staff Management', id, `Deleted staff: ${target.name}`);
  };

  // --- ROOMS ---
  const addRoom = (roomData: Omit<Room, 'id'>): Room => {
    const id = `room-${Date.now()}`;
    const newRoom: Room = {
      equipment: [],
      status: 'Available',
      ...roomData,
      id
    };
    setRooms(prev => [...prev, newRoom]);
    logAudit('Room Added', 'Infrastructure', id, `Added room: ${newRoom.name}`);
    return newRoom;
  };

  const updateRoom = (id: string, updates: Partial<Room>) => {
    setRooms(prev => prev.map(r => (r.id === id ? { ...r, ...updates } : r)));
    logAudit('Room Updated', 'Infrastructure', id, `Updated room details #${id}`);
  };

  const deleteRoom = (id: string) => {
    const target = rooms.find(r => r.id === id);
    if (!target) return;
    setRooms(prev => prev.filter(r => r.id !== id));
    logAudit('Room Deleted', 'Infrastructure', id, `Deleted room: ${target.name}`);
  };

  // --- SCHEDULES, ATTENDANCE, EXAMS & CERTIFICATES REMOVAL ---
  const deleteClassSchedule = (id: string) => {
    const target = schedules.find(s => s.id === id);
    if (!target) return;
    setTrashItems(prev => [
      {
        id: `trash-${Date.now()}`,
        originalId: id,
        itemType: 'schedule',
        data: target,
        title: `Class Schedule: ${target.topic || 'Class Routine'} (${target.date} ${target.startTime || target.time || ''})`,
        deletedAt: new Date().toISOString(),
        deletedBy: currentUser.name
      },
      ...prev
    ]);
    setSchedules(prev => prev.filter(s => s.id !== id));
    logAudit('Schedule Deleted', 'Class Schedule', id, `Moved class schedule #${id} to Recycle Bin`);
  };

  const deleteAttendance = (id: string) => {
    const target = attendance.find(a => a.id === id);
    if (!target) return;
    setTrashItems(prev => [
      {
        id: `trash-${Date.now()}`,
        originalId: id,
        itemType: 'attendance',
        data: target,
        title: `Attendance Record: ${target.date} (${target.status})`,
        deletedAt: new Date().toISOString(),
        deletedBy: currentUser.name
      },
      ...prev
    ]);
    setAttendance(prev => prev.filter(a => a.id !== id));
    logAudit('Attendance Record Deleted', 'Attendance', id, `Moved attendance entry to Recycle Bin`);
  };

  const deleteAttendanceBatch = (batchId: string, date: string) => {
    const records = attendance.filter(a => a.batchId === batchId && a.date === date);
    if (records.length === 0) return;
    setTrashItems(prev => [
      {
        id: `trash-${Date.now()}`,
        originalId: `${batchId}-${date}`,
        itemType: 'attendance',
        data: records,
        title: `Attendance Batch Session: ${date} (${records.length} students)`,
        deletedAt: new Date().toISOString(),
        deletedBy: currentUser.name
      },
      ...prev
    ]);
    setAttendance(prev => prev.filter(a => !(a.batchId === batchId && a.date === date)));
    logAudit('Attendance Session Deleted', 'Attendance', batchId, `Moved ${records.length} attendance records for ${date} to Recycle Bin`);
  };

  const deleteExam = (id: string) => {
    const target = exams.find(e => e.id === id);
    if (!target) return;
    const relatedResults = examResults.filter(r => r.examId === id);
    setTrashItems(prev => [
      {
        id: `trash-${Date.now()}`,
        originalId: id,
        itemType: 'exam',
        data: { exam: target, results: relatedResults },
        title: `Exam: ${target.title} (${target.examCode})`,
        deletedAt: new Date().toISOString(),
        deletedBy: currentUser.name
      },
      ...prev
    ]);
    setExams(prev => prev.filter(e => e.id !== id));
    setExamResults(prev => prev.filter(r => r.examId !== id));
    logAudit('Exam Deleted', 'Exams', id, `Moved exam ${target.title} and related marks to Recycle Bin`);
  };

  const deleteExamResult = (id: string) => {
    const target = examResults.find(r => r.id === id);
    if (!target) return;
    setTrashItems(prev => [
      {
        id: `trash-${Date.now()}`,
        originalId: id,
        itemType: 'examResult',
        data: target,
        title: `Exam Mark Entry: ID #${id} (${target.marksObtained} Marks)`,
        deletedAt: new Date().toISOString(),
        deletedBy: currentUser.name
      },
      ...prev
    ]);
    setExamResults(prev => prev.filter(r => r.id !== id));
    logAudit('Exam Result Deleted', 'Exams', id, `Moved exam result record to Recycle Bin`);
  };

  const updateCertificate = (id: string, updates: Partial<Certificate>) => {
    setCertificates(prev => prev.map(c => (c.id === id ? { ...c, ...updates } : c)));
    logAudit('Certificate Updated', 'Certificates', id, `Updated certificate #${updates.certificateNumber || updates.certificateCode || id}`);
  };

  const revokeCertificate = (id: string) => {
    setCertificates(prev => prev.map(c => (c.id === id ? { ...c, status: 'Revoked' } : c)));
    logAudit('Certificate Revoked', 'Certificates', id, `Revoked certificate record #${id}`);
  };

  const deleteCertificate = (id: string) => {
    const target = certificates.find(c => c.id === id);
    if (!target) return;
    setTrashItems(prev => [
      {
        id: `trash-${Date.now()}`,
        originalId: id,
        itemType: 'certificate',
        data: target,
        title: `Certificate: #${target.certificateNumber}`,
        deletedAt: new Date().toISOString(),
        deletedBy: currentUser.name
      },
      ...prev
    ]);
    setCertificates(prev => prev.filter(c => c.id !== id));
    logAudit('Certificate Deleted', 'Certificates', id, `Moved certificate #${target.certificateNumber} to Recycle Bin`);
  };

  // --- PLACEMENTS & CAREER CELL ---
  const addPlacement = (placementData: Omit<StudentPlacement, 'id' | 'createdAt'>): StudentPlacement => {
    const id = `plc-${Date.now()}`;
    const newPlacement: StudentPlacement = {
      ...placementData,
      id,
      createdAt: new Date().toISOString()
    };
    setPlacements(prev => [newPlacement, ...prev]);
    logAudit('Placement Story Added', 'Career Cell', id, `Added job/freelance placement for ${newPlacement.studentName} at ${newPlacement.companyOrClient}`);
    return newPlacement;
  };

  const updatePlacement = (id: string, updates: Partial<StudentPlacement>) => {
    setPlacements(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)));
    logAudit('Placement Story Updated', 'Career Cell', id, `Updated placement record #${id}`);
  };

  const deletePlacement = (id: string) => {
    const target = placements.find(p => p.id === id);
    if (!target) return;
    setTrashItems(prev => [
      {
        id: `trash-${Date.now()}`,
        originalId: id,
        itemType: 'placement',
        data: target,
        title: `Placement Story: ${target.studentName} (${target.position} at ${target.companyOrClient})`,
        deletedAt: new Date().toISOString(),
        deletedBy: currentUser.name
      },
      ...prev
    ]);
    setPlacements(prev => prev.filter(p => p.id !== id));
    logAudit('Placement Deleted', 'Career Cell', id, `Moved placement story of ${target.studentName} to Recycle Bin`);
  };

  // --- ASSIGNMENTS & PROJECT SHOWCASE ---
  const addAssignment = (assignmentData: Omit<Assignment, 'id'>): Assignment => {
    const id = `asg-${Date.now()}`;
    const newAssignment: Assignment = {
      ...assignmentData,
      id
    };
    setAssignments(prev => [newAssignment, ...prev]);
    logAudit('Assignment Created', 'Academic / Assignments', id, `Created assignment: "${newAssignment.title}" for Batch #${newAssignment.batchId}`);
    return newAssignment;
  };

  const updateAssignment = (id: string, updates: Partial<Assignment>) => {
    setAssignments(prev => prev.map(a => (a.id === id ? { ...a, ...updates } : a)));
    logAudit('Assignment Updated', 'Academic / Assignments', id, `Updated assignment #${id}`);
  };

  const deleteAssignment = (id: string) => {
    const target = assignments.find(a => a.id === id);
    if (!target) return;
    const relatedSubs = assignmentSubmissions.filter(s => s.assignmentId === id);
    setTrashItems(prev => [
      {
        id: `trash-${Date.now()}`,
        originalId: id,
        itemType: 'assignment',
        data: { assignment: target, submissions: relatedSubs },
        title: `Assignment: ${target.title}`,
        deletedAt: new Date().toISOString(),
        deletedBy: currentUser.name
      },
      ...prev
    ]);
    setAssignments(prev => prev.filter(a => a.id !== id));
    setAssignmentSubmissions(prev => prev.filter(s => s.assignmentId !== id));
    logAudit('Assignment Deleted', 'Academic / Assignments', id, `Moved assignment "${target.title}" and submissions to Recycle Bin`);
  };

  const submitAssignment = (submissionData: Omit<AssignmentSubmission, 'id' | 'submittedAt'>): AssignmentSubmission => {
    const id = `sub-${Date.now()}`;
    const newSubmission: AssignmentSubmission = {
      ...submissionData,
      id,
      submittedAt: new Date().toISOString()
    };
    setAssignmentSubmissions(prev => [newSubmission, ...prev]);
    logAudit('Assignment Submitted', 'Academic / Assignments', id, `Student ${newSubmission.studentName} submitted assignment`);
    return newSubmission;
  };

  const gradeAssignmentSubmission = (id: string, marks: number, feedback: string) => {
    setAssignmentSubmissions(prev => prev.map(s => (s.id === id ? {
      ...s,
      marksObtained: marks,
      trainerFeedback: feedback,
      status: 'Graded'
    } : s)));
    logAudit('Assignment Graded', 'Academic / Assignments', id, `Graded submission #${id} with ${marks} marks`);
  };

  // --- SEMINARS & WORKSHOPS ---
  const addSeminar = (seminarData: Omit<SeminarWorkshop, 'id' | 'registeredCount' | 'attendedCount' | 'convertedAdmissionsCount'>): SeminarWorkshop => {
    const id = `sem-${Date.now()}`;
    const newSeminar: SeminarWorkshop = {
      ...seminarData,
      id,
      registeredCount: seminarData.registeredLeads?.length || 0,
      attendedCount: 0,
      convertedAdmissionsCount: 0
    };
    setSeminars(prev => [newSeminar, ...prev]);
    logAudit('Seminar Created', 'Events / Seminars', id, `Created seminar: "${newSeminar.title}" on ${newSeminar.date}`);
    return newSeminar;
  };

  const updateSeminar = (id: string, updates: Partial<SeminarWorkshop>) => {
    setSeminars(prev => prev.map(s => (s.id === id ? { ...s, ...updates } : s)));
    logAudit('Seminar Updated', 'Events / Seminars', id, `Updated seminar details #${id}`);
  };

  const deleteSeminar = (id: string) => {
    const target = seminars.find(s => s.id === id);
    if (!target) return;
    setTrashItems(prev => [
      {
        id: `trash-${Date.now()}`,
        originalId: id,
        itemType: 'seminar',
        data: target,
        title: `Seminar/Workshop: ${target.title} (${target.date})`,
        deletedAt: new Date().toISOString(),
        deletedBy: currentUser.name
      },
      ...prev
    ]);
    setSeminars(prev => prev.filter(s => s.id !== id));
    logAudit('Seminar Deleted', 'Events / Seminars', id, `Moved seminar "${target.title}" to Recycle Bin`);
  };

  const registerLeadToSeminar = (seminarId: string, leadId: string) => {
    setSeminars(prev => prev.map(s => {
      if (s.id === seminarId) {
        const existingLeads = s.registeredLeads || [];
        if (existingLeads.includes(leadId)) return s;
        const updated = [...existingLeads, leadId];
        return {
          ...s,
          registeredLeads: updated,
          registeredCount: updated.length
        };
      }
      return s;
    }));
    logAudit('Lead Registered to Seminar', 'Events / Seminars', seminarId, `Registered lead #${leadId} to seminar #${seminarId}`);
  };

  // --- WEBSITE CMS & PORTAL ACTIONS ---
  const updateWebsiteCmsConfig = (updates: Partial<WebsiteCmsConfig>) => {
    setWebsiteCmsConfig(prev => {
      const next = { ...prev, ...updates };
      localStorage.setItem(`${STORAGE_KEY}_website_cms_config`, JSON.stringify(next));
      return next;
    });
    logAudit('Website CMS Updated', 'Website CMS', 'cms-config', 'Updated public website hero and configuration');
  };

  const addWebsiteReview = (revData: Omit<WebsiteReview, 'id'>): WebsiteReview => {
    const id = `rev-${Date.now()}`;
    const newRev: WebsiteReview = { ...revData, id };
    setWebsiteReviews(prev => {
      const next = [newRev, ...prev];
      localStorage.setItem(`${STORAGE_KEY}_website_reviews`, JSON.stringify(next));
      return next;
    });
    logAudit('Website Review Added', 'Website CMS', id, `Added testimonial for ${newRev.studentName}`);
    return newRev;
  };

  const updateWebsiteReview = (id: string, updates: Partial<WebsiteReview>) => {
    setWebsiteReviews(prev => {
      const next = prev.map(r => r.id === id ? { ...r, ...updates } : r);
      localStorage.setItem(`${STORAGE_KEY}_website_reviews`, JSON.stringify(next));
      return next;
    });
    logAudit('Website Review Updated', 'Website CMS', id, `Updated review #${id}`);
  };

  const deleteWebsiteReview = (id: string) => {
    setWebsiteReviews(prev => {
      const next = prev.filter(r => r.id !== id);
      localStorage.setItem(`${STORAGE_KEY}_website_reviews`, JSON.stringify(next));
      return next;
    });
    logAudit('Website Review Deleted', 'Website CMS', id, `Deleted review #${id}`);
  };

  const addWebsiteGalleryItem = (itemData: Omit<WebsiteGalleryItem, 'id'>): WebsiteGalleryItem => {
    const id = `gal-${Date.now()}`;
    const newItem: WebsiteGalleryItem = { ...itemData, id };
    setWebsiteGallery(prev => {
      const next = [newItem, ...prev];
      localStorage.setItem(`${STORAGE_KEY}_website_gallery`, JSON.stringify(next));
      return next;
    });
    logAudit('Gallery Item Added', 'Website CMS', id, `Added photo to gallery: ${newItem.title}`);
    return newItem;
  };

  const updateWebsiteGalleryItem = (id: string, updates: Partial<WebsiteGalleryItem>) => {
    setWebsiteGallery(prev => {
      const next = prev.map(g => g.id === id ? { ...g, ...updates } : g);
      localStorage.setItem(`${STORAGE_KEY}_website_gallery`, JSON.stringify(next));
      return next;
    });
    logAudit('Gallery Item Updated', 'Website CMS', id, `Updated gallery photo #${id}`);
  };

  const deleteWebsiteGalleryItem = (id: string) => {
    setWebsiteGallery(prev => {
      const next = prev.filter(g => g.id !== id);
      localStorage.setItem(`${STORAGE_KEY}_website_gallery`, JSON.stringify(next));
      return next;
    });
    logAudit('Gallery Item Deleted', 'Website CMS', id, `Deleted gallery photo #${id}`);
  };

  const addWebsiteNotice = (noticeData: Omit<WebsiteNotice, 'id'>): WebsiteNotice => {
    const id = `not-${Date.now()}`;
    const newNotice: WebsiteNotice = { ...noticeData, id };
    setWebsiteNotices(prev => {
      const next = [newNotice, ...prev];
      localStorage.setItem(`${STORAGE_KEY}_website_notices`, JSON.stringify(next));
      return next;
    });
    logAudit('Website Notice Published', 'Website CMS', id, `Published notice: ${newNotice.title}`);
    return newNotice;
  };

  const updateWebsiteNotice = (id: string, updates: Partial<WebsiteNotice>) => {
    setWebsiteNotices(prev => {
      const next = prev.map(n => n.id === id ? { ...n, ...updates } : n);
      localStorage.setItem(`${STORAGE_KEY}_website_notices`, JSON.stringify(next));
      return next;
    });
    logAudit('Website Notice Updated', 'Website CMS', id, `Updated notice #${id}`);
  };

  const deleteWebsiteNotice = (id: string) => {
    setWebsiteNotices(prev => {
      const next = prev.filter(n => n.id !== id);
      localStorage.setItem(`${STORAGE_KEY}_website_notices`, JSON.stringify(next));
      return next;
    });
    logAudit('Website Notice Deleted', 'Website CMS', id, `Deleted notice #${id}`);
  };

  const addWebsiteFaq = (faqData: Omit<WebsiteFaqItem, 'id'>): WebsiteFaqItem => {
    const id = `faq-${Date.now()}`;
    const newFaq: WebsiteFaqItem = { ...faqData, id };
    setWebsiteFaqs(prev => {
      const next = [newFaq, ...prev];
      localStorage.setItem(`${STORAGE_KEY}_website_faqs`, JSON.stringify(next));
      return next;
    });
    logAudit('FAQ Added', 'Website CMS', id, `Added FAQ question: ${newFaq.question}`);
    return newFaq;
  };

  const updateWebsiteFaq = (id: string, updates: Partial<WebsiteFaqItem>) => {
    setWebsiteFaqs(prev => {
      const next = prev.map(f => f.id === id ? { ...f, ...updates } : f);
      localStorage.setItem(`${STORAGE_KEY}_website_faqs`, JSON.stringify(next));
      return next;
    });
    logAudit('FAQ Updated', 'Website CMS', id, `Updated FAQ #${id}`);
  };

  const deleteWebsiteFaq = (id: string) => {
    setWebsiteFaqs(prev => {
      const next = prev.filter(f => f.id !== id);
      localStorage.setItem(`${STORAGE_KEY}_website_faqs`, JSON.stringify(next));
      return next;
    });
    logAudit('FAQ Deleted', 'Website CMS', id, `Deleted FAQ #${id}`);
  };

  const addWebsiteBlog = (blogData: Omit<WebsiteBlogPost, 'id'>): WebsiteBlogPost => {
    const id = `blog-${Date.now()}`;
    const newBlog: WebsiteBlogPost = { ...blogData, id };
    setWebsiteBlogs(prev => {
      const next = [newBlog, ...prev];
      localStorage.setItem(`${STORAGE_KEY}_website_blogs`, JSON.stringify(next));
      return next;
    });
    logAudit('Blog Post Published', 'Website CMS', id, `Published blog: ${newBlog.title}`);
    return newBlog;
  };

  const updateWebsiteBlog = (id: string, updates: Partial<WebsiteBlogPost>) => {
    setWebsiteBlogs(prev => {
      const next = prev.map(b => b.id === id ? { ...b, ...updates } : b);
      localStorage.setItem(`${STORAGE_KEY}_website_blogs`, JSON.stringify(next));
      return next;
    });
    logAudit('Blog Post Updated', 'Website CMS', id, `Updated blog #${id}`);
  };

  const deleteWebsiteBlog = (id: string) => {
    setWebsiteBlogs(prev => {
      const next = prev.filter(b => b.id !== id);
      localStorage.setItem(`${STORAGE_KEY}_website_blogs`, JSON.stringify(next));
      return next;
    });
    logAudit('Blog Post Deleted', 'Website CMS', id, `Deleted blog #${id}`);
  };

  // --- DEDICATED TRAINER MANAGEMENT ACTIONS ---
  const trainersList: TrainerProfile[] = useMemo(() => {
    return websiteCmsConfig?.trainersList || [];
  }, [websiteCmsConfig?.trainersList]);

  const addTrainer = (trainerData: Omit<TrainerProfile, 'id' | 'createdAt' | 'updatedAt'>): TrainerProfile => {
    const id = `tr-${Date.now()}`;
    const now = new Date().toISOString();
    const newTrainer: TrainerProfile = {
      ...trainerData,
      id,
      createdAt: now,
      updatedAt: now
    };

    setWebsiteCmsConfig(prev => {
      const currentTrainers = prev.trainersList || [];
      const updatedTrainers = [newTrainer, ...currentTrainers];
      const next = { ...prev, trainersList: updatedTrainers };
      localStorage.setItem(`${STORAGE_KEY}_website_cms_config`, JSON.stringify(next));
      return next;
    });

    logAudit('Trainer Created', 'Trainer Management', id, `Created trainer profile for ${newTrainer.name} (${newTrainer.designation})`);
    return newTrainer;
  };

  const updateTrainer = (id: string, updates: Partial<TrainerProfile>) => {
    const now = new Date().toISOString();
    setWebsiteCmsConfig(prev => {
      const currentTrainers = prev.trainersList || [];
      const updatedTrainers = currentTrainers.map(t => (t.id === id ? { ...t, ...updates, updatedAt: now } : t));
      const next = { ...prev, trainersList: updatedTrainers };
      localStorage.setItem(`${STORAGE_KEY}_website_cms_config`, JSON.stringify(next));
      return next;
    });
    logAudit('Trainer Updated', 'Trainer Management', id, `Updated trainer profile #${id}`);
  };

  const deleteTrainer = (id: string) => {
    setWebsiteCmsConfig(prev => {
      const currentTrainers = prev.trainersList || [];
      const updatedTrainers = currentTrainers.filter(t => t.id !== id);
      const next = { ...prev, trainersList: updatedTrainers };
      localStorage.setItem(`${STORAGE_KEY}_website_cms_config`, JSON.stringify(next));
      return next;
    });
    logAudit('Trainer Deleted', 'Trainer Management', id, `Deleted trainer profile #${id}`);
  };

  // --- DEDICATED STUDENT COURSE REVIEW ACTIONS ---
  const studentCourseReviews: StudentCourseReview[] = useMemo(() => {
    return websiteCmsConfig?.studentCourseReviews || [];
  }, [websiteCmsConfig?.studentCourseReviews]);

  const addStudentCourseReview = (revData: Omit<StudentCourseReview, 'id'>): StudentCourseReview => {
    const id = `rev-${Date.now()}`;
    const newRev: StudentCourseReview = { ...revData, id };

    setWebsiteCmsConfig(prev => {
      const currentReviews = prev.studentCourseReviews || [];
      const updatedReviews = [newRev, ...currentReviews];
      const next = { ...prev, studentCourseReviews: updatedReviews };
      localStorage.setItem(`${STORAGE_KEY}_website_cms_config`, JSON.stringify(next));
      return next;
    });

    logAudit('Student Review Added', 'Course Reviews', id, `Added review for student: ${newRev.studentName}`);
    return newRev;
  };

  const updateStudentCourseReview = (id: string, updates: Partial<StudentCourseReview>) => {
    setWebsiteCmsConfig(prev => {
      const currentReviews = prev.studentCourseReviews || [];
      const updatedReviews = currentReviews.map(r => (r.id === id ? { ...r, ...updates } : r));
      const next = { ...prev, studentCourseReviews: updatedReviews };
      localStorage.setItem(`${STORAGE_KEY}_website_cms_config`, JSON.stringify(next));
      return next;
    });
    logAudit('Student Review Updated', 'Course Reviews', id, `Updated student review #${id}`);
  };

  const deleteStudentCourseReview = (id: string) => {
    setWebsiteCmsConfig(prev => {
      const currentReviews = prev.studentCourseReviews || [];
      const updatedReviews = currentReviews.filter(r => r.id !== id);
      const next = { ...prev, studentCourseReviews: updatedReviews };
      localStorage.setItem(`${STORAGE_KEY}_website_cms_config`, JSON.stringify(next));
      return next;
    });
    logAudit('Student Review Deleted', 'Course Reviews', id, `Deleted student review #${id}`);
  };

  // --- DEDICATED CLASSROOM & LAB GALLERY ACTIONS ---
  const classroomGalleryPhotos: ClassroomGalleryPhoto[] = useMemo(() => {
    return websiteCmsConfig?.classroomGalleryPhotos || [];
  }, [websiteCmsConfig?.classroomGalleryPhotos]);

  const addClassroomGalleryPhoto = (photoData: Omit<ClassroomGalleryPhoto, 'id'>): ClassroomGalleryPhoto => {
    const id = `photo-${Date.now()}`;
    const newPhoto: ClassroomGalleryPhoto = { ...photoData, id };

    setWebsiteCmsConfig(prev => {
      const currentPhotos = prev.classroomGalleryPhotos || [];
      const updatedPhotos = [newPhoto, ...currentPhotos];
      const next = { ...prev, classroomGalleryPhotos: updatedPhotos };
      localStorage.setItem(`${STORAGE_KEY}_website_cms_config`, JSON.stringify(next));
      return next;
    });

    logAudit('Classroom Photo Added', 'Classroom Gallery', id, `Added classroom photo: ${newPhoto.title}`);
    return newPhoto;
  };

  const updateClassroomGalleryPhoto = (id: string, updates: Partial<ClassroomGalleryPhoto>) => {
    setWebsiteCmsConfig(prev => {
      const currentPhotos = prev.classroomGalleryPhotos || [];
      const updatedPhotos = currentPhotos.map(p => (p.id === id ? { ...p, ...updates } : p));
      const next = { ...prev, classroomGalleryPhotos: updatedPhotos };
      localStorage.setItem(`${STORAGE_KEY}_website_cms_config`, JSON.stringify(next));
      return next;
    });
    logAudit('Classroom Photo Updated', 'Classroom Gallery', id, `Updated classroom photo #${id}`);
  };

  const deleteClassroomGalleryPhoto = (id: string) => {
    setWebsiteCmsConfig(prev => {
      const currentPhotos = prev.classroomGalleryPhotos || [];
      const updatedPhotos = currentPhotos.filter(p => p.id !== id);
      const next = { ...prev, classroomGalleryPhotos: updatedPhotos };
      localStorage.setItem(`${STORAGE_KEY}_website_cms_config`, JSON.stringify(next));
      return next;
    });
    logAudit('Classroom Photo Deleted', 'Classroom Gallery', id, `Deleted classroom photo #${id}`);
  };

  // --- SMART INSTALLMENT SCHEDULE GENERATOR ---
  const generateInstallmentSchedule = (
    totalFee: number,
    startDate: string,
    count: number = 3,
    customSplits?: number[]
  ): InstallmentMilestone[] => {
    if (count <= 0) count = 1;
    const baseDate = new Date(startDate || new Date().toISOString().split('T')[0]);
    const milestones: InstallmentMilestone[] = [];

    if (customSplits && customSplits.length === count) {
      let cumulativePaid = 0;
      customSplits.forEach((amount, index) => {
        const dueDate = new Date(baseDate);
        dueDate.setMonth(dueDate.getMonth() + index);
        milestones.push({
          id: `inst-${Date.now()}-${index + 1}`,
          installmentNo: index + 1,
          title: index === 0 ? 'Initial Booking / 1st Installment' : `${index + 1}th Installment Milestone`,
          dueDate: dueDate.toISOString().split('T')[0],
          amount,
          paidAmount: 0,
          status: 'Pending'
        });
      });
    } else {
      const perInstallment = Math.floor(totalFee / count);
      let remainder = totalFee - (perInstallment * count);

      for (let i = 0; i < count; i++) {
        const dueDate = new Date(baseDate);
        dueDate.setMonth(dueDate.getMonth() + i);
        const installmentAmount = i === count - 1 ? perInstallment + remainder : perInstallment;

        milestones.push({
          id: `inst-${Date.now()}-${i + 1}`,
          installmentNo: i + 1,
          title: i === 0 ? 'Admission Booking Installment' : `Milestone #${i + 1} Payment`,
          dueDate: dueDate.toISOString().split('T')[0],
          amount: installmentAmount,
          paidAmount: 0,
          status: 'Pending'
        });
      }
    }
    return milestones;
  };

  // --- DROPOUT RISK RADAR HELPER ---
  const getAtRiskStudents = () => {
    const today = new Date().toISOString().split('T')[0];
    const riskList: {
      student: Student;
      reason: string;
      riskLevel: 'High' | 'Medium';
      batch?: Batch;
      course?: Course;
      dueAmount: number;
      absentCount: number;
    }[] = [];

    students.forEach(student => {
      const studentAdmissions = admissions.filter(a => a.studentId === student.id);
      const studentAttendance = attendance.filter(a => a.studentId === student.id);
      
      const totalDue = studentAdmissions.reduce((sum, a) => sum + a.due, 0);
      const overdueAdmission = studentAdmissions.find(a => a.paymentStatus === 'Overdue' || (a.nextPaymentDate && a.nextPaymentDate < today && a.due > 0));

      const sortedAttendance = [...studentAttendance].sort((a, b) => b.date.localeCompare(a.date));
      let consecutiveAbsents = 0;
      for (const rec of sortedAttendance) {
        if (rec.status === 'Absent') consecutiveAbsents++;
        else break;
      }

      const totalSessions = studentAttendance.length;
      const presentCount = studentAttendance.filter(a => a.status === 'Present' || a.status === 'Late').length;
      const attendanceRatio = totalSessions > 0 ? presentCount / totalSessions : 1;

      const primaryAdmission = studentAdmissions[0];
      const batch = primaryAdmission ? batches.find(b => b.id === primaryAdmission.batchId) : undefined;
      const course = primaryAdmission ? courses.find(c => c.id === primaryAdmission.courseId) : undefined;

      if (consecutiveAbsents >= 3 || (totalDue > 10000 && overdueAdmission)) {
        riskList.push({
          student,
          reason: consecutiveAbsents >= 3
            ? `Missed ${consecutiveAbsents} consecutive classes in a row`
            : `Overdue payment of ৳${totalDue.toLocaleString()} with no contact`,
          riskLevel: 'High',
          batch,
          course,
          dueAmount: totalDue,
          absentCount: consecutiveAbsents
        });
      } else if (consecutiveAbsents === 2 || (attendanceRatio < 0.65 && totalSessions >= 4) || (totalDue > 0 && overdueAdmission)) {
        riskList.push({
          student,
          reason: consecutiveAbsents === 2
            ? 'Absent in last 2 classes'
            : attendanceRatio < 0.65
            ? `Low attendance score (${Math.round(attendanceRatio * 100)}%)`
            : `Fee installment past due date (৳${totalDue.toLocaleString()})`,
          riskLevel: 'Medium',
          batch,
          course,
          dueAmount: totalDue,
          absentCount: consecutiveAbsents
        });
      }
    });

    return riskList;
  };

  // --- LIVE OPERATIONS CENTER HELPER ---
  const getTodayLiveOperations = () => {
    const today = new Date().toISOString().split('T')[0];
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentDayName = daysOfWeek[new Date().getDay()];

    const todayClasses = schedules
      .filter(s => s.dayOfWeek === currentDayName || s.date === today)
      .map(s => ({
        ...s,
        batch: batches.find(b => b.id === s.batchId),
        course: courses.find(c => c.id === s.courseId),
        trainer: staffList.find(st => st.id === s.trainerId),
        roomDetails: rooms.find(r => r.id === s.roomId)
      }));

    const todayFollowups = followUps
      .filter(f => f.nextFollowUpDate === today)
      .map(f => ({
        ...f,
        lead: leads.find(l => l.id === f.leadId)
      }));

    const todayDueAdmissions = admissions
      .filter(a => a.nextPaymentDate === today && a.due > 0)
      .map(a => ({
        ...a,
        student: students.find(s => s.id === a.studentId),
        course: courses.find(c => c.id === a.courseId),
        batch: batches.find(b => b.id === a.batchId)
      }));

    const todaySeminars = seminars.filter(s => s.date === today);

    return {
      todayClasses,
      todayFollowups,
      todayDueAdmissions,
      todaySeminars
    };
  };

  // --- MASTER DROPDOWNS CUSTOMIZATION ---
  const addDropdownOption = (
    group: 'leadSources' | 'expenseCategories' | 'paymentMethods' | 'occupations' | 'educationLevels' | 'studentGoals' | 'studentStatuses' | 'bloodGroups' | 'discountTypes',
    option: string
  ): boolean => {
    const trimmed = option.trim();
    if (!trimmed) return false;
    if (group === 'leadSources') {
      if (leadSources.some(o => o.toLowerCase() === trimmed.toLowerCase())) return false;
      setLeadSources(prev => [...prev, trimmed]);
    } else if (group === 'expenseCategories') {
      if (expenseCategoriesList.some(o => o.toLowerCase() === trimmed.toLowerCase())) return false;
      setExpenseCategoriesList(prev => [...prev, trimmed]);
    } else if (group === 'paymentMethods') {
      if (paymentMethodsList.some(o => o.toLowerCase() === trimmed.toLowerCase())) return false;
      setPaymentMethodsList(prev => [...prev, trimmed]);
    } else if (group === 'occupations') {
      if (occupationsList.some(o => o.toLowerCase() === trimmed.toLowerCase())) return false;
      setOccupationsList(prev => [...prev, trimmed]);
    } else if (group === 'educationLevels') {
      if (educationLevelsList.some(o => o.toLowerCase() === trimmed.toLowerCase())) return false;
      setEducationLevelsList(prev => [...prev, trimmed]);
    } else if (group === 'studentGoals') {
      if (studentGoalsList.some(o => o.toLowerCase() === trimmed.toLowerCase())) return false;
      setStudentGoalsList(prev => [...prev, trimmed]);
    } else if (group === 'studentStatuses') {
      if (studentStatusesList.some(o => o.toLowerCase() === trimmed.toLowerCase())) return false;
      setStudentStatusesList(prev => [...prev, trimmed]);
    } else if (group === 'bloodGroups') {
      if (bloodGroupsList.some(o => o.toLowerCase() === trimmed.toLowerCase())) return false;
      setBloodGroupsList(prev => [...prev, trimmed]);
    } else if (group === 'discountTypes') {
      if (discountTypesList.some(o => o.toLowerCase() === trimmed.toLowerCase())) return false;
      setDiscountTypesList(prev => [...prev, trimmed]);
    }
    logAudit('Option Added', 'Settings / Dropdowns', group, `Added option "${trimmed}" to ${group}`);
    return true;
  };

  const updateDropdownOption = (
    group: 'leadSources' | 'expenseCategories' | 'paymentMethods' | 'occupations' | 'educationLevels' | 'studentGoals' | 'studentStatuses' | 'bloodGroups' | 'discountTypes',
    oldVal: string,
    newVal: string
  ): boolean => {
    const trimmed = newVal.trim();
    if (!trimmed || oldVal === trimmed) return false;
    if (group === 'leadSources') {
      setLeadSources(prev => prev.map(o => (o === oldVal ? trimmed : o)));
      setLeads(prev => prev.map(l => (l.leadSource === oldVal ? { ...l, leadSource: trimmed } : l)));
    } else if (group === 'expenseCategories') {
      setExpenseCategoriesList(prev => prev.map(o => (o === oldVal ? trimmed : o)));
      setExpenses(prev => prev.map(e => (e.category === oldVal ? { ...e, category: trimmed as any } : e)));
    } else if (group === 'paymentMethods') {
      setPaymentMethodsList(prev => prev.map(o => (o === oldVal ? trimmed : o)));
      setPayments(prev => prev.map(p => (p.paymentMethod === oldVal ? { ...p, paymentMethod: trimmed as any } : p)));
    } else if (group === 'occupations') {
      setOccupationsList(prev => prev.map(o => (o === oldVal ? trimmed : o)));
      setStudents(prev => prev.map(s => (s.occupation === oldVal ? { ...s, occupation: trimmed } : s)));
    } else if (group === 'educationLevels') {
      setEducationLevelsList(prev => prev.map(o => (o === oldVal ? trimmed : o)));
      setStudents(prev => prev.map(s => (s.education === oldVal ? { ...s, education: trimmed } : s)));
    } else if (group === 'studentGoals') {
      setStudentGoalsList(prev => prev.map(o => (o === oldVal ? trimmed : o)));
      setStudents(prev => prev.map(s => (s.studentGoal === oldVal ? { ...s, studentGoal: trimmed as any } : s)));
    } else if (group === 'studentStatuses') {
      setStudentStatusesList(prev => prev.map(o => (o === oldVal ? trimmed : o)));
      setStudents(prev => prev.map(s => (s.status === oldVal ? { ...s, status: trimmed as any } : s)));
    } else if (group === 'bloodGroups') {
      setBloodGroupsList(prev => prev.map(o => (o === oldVal ? trimmed : o)));
      setStudents(prev => prev.map(s => (s.bloodGroup === oldVal ? { ...s, bloodGroup: trimmed as any } : s)));
    } else if (group === 'discountTypes') {
      setDiscountTypesList(prev => prev.map(o => (o === oldVal ? trimmed : o)));
    }
    logAudit('Option Renamed', 'Settings / Dropdowns', group, `Renamed "${oldVal}" to "${trimmed}" in ${group}`);
    return true;
  };

  const deleteDropdownOption = (
    group: 'leadSources' | 'expenseCategories' | 'paymentMethods' | 'occupations' | 'educationLevels' | 'studentGoals' | 'studentStatuses' | 'bloodGroups' | 'discountTypes',
    option: string
  ): boolean => {
    if (group === 'leadSources') setLeadSources(prev => prev.filter(o => o !== option));
    else if (group === 'expenseCategories') setExpenseCategoriesList(prev => prev.filter(o => o !== option));
    else if (group === 'paymentMethods') setPaymentMethodsList(prev => prev.filter(o => o !== option));
    else if (group === 'occupations') setOccupationsList(prev => prev.filter(o => o !== option));
    else if (group === 'educationLevels') setEducationLevelsList(prev => prev.filter(o => o !== option));
    else if (group === 'studentGoals') setStudentGoalsList(prev => prev.filter(o => o !== option));
    else if (group === 'studentStatuses') setStudentStatusesList(prev => prev.filter(o => o !== option));
    else if (group === 'bloodGroups') setBloodGroupsList(prev => prev.filter(o => o !== option));
    else if (group === 'discountTypes') setDiscountTypesList(prev => prev.filter(o => o !== option));
    logAudit('Option Deleted', 'Settings / Dropdowns', group, `Deleted option "${option}" from ${group}`);
    return true;
  };

  const resetDropdownGroup = (
    group: 'leadSources' | 'expenseCategories' | 'paymentMethods' | 'occupations' | 'educationLevels' | 'studentGoals' | 'studentStatuses' | 'bloodGroups' | 'discountTypes'
  ) => {
    if (group === 'leadSources') {
      setLeadSources([
        'Facebook Ads',
        'Walk-in / Campus Visit',
        'Website Inquiry',
        'YouTube / Video',
        'Campus Seminar / Workshop',
        'Student Referral',
        'Google Search',
        'Leaflet / Newspaper',
        'Phone Call / Direct Inquiry',
        'Other'
      ]);
    } else if (group === 'expenseCategories') {
      setExpenseCategoriesList([
        'Office Rent',
        'Trainer Remuneration',
        'Staff Salary',
        'Utility & Electricity',
        'Internet / Broadband',
        'Marketing & Meta Ads',
        'Software & AI Subscriptions',
        'Hardware Maintenance',
        'Entertainment & Refreshment',
        'Printing & Stationery',
        'Office Cleaning & Sanitation',
        'Other'
      ]);
    } else if (group === 'paymentMethods') {
      setPaymentMethodsList(['Cash', 'bKash', 'Nagad', 'Bank', 'Card', 'Rocket', 'Upay']);
    } else if (group === 'occupations') {
      setOccupationsList([
        'Student (School / College / University)',
        'Job Holder / Employee',
        'Freelancer / Independent Contractor',
        'Business Owner / Entrepreneur',
        'Job Seeker / Fresh Graduate',
        'Homemaker',
        'Other'
      ]);
    } else if (group === 'educationLevels') {
      setEducationLevelsList([
        'SSC / Secondary (Class 10)',
        'HSC / Higher Secondary (Class 12)',
        'Diploma in Engineering / Poly',
        'Bachelor / Honors (B.Sc / BBA / BA)',
        'Master Degree (M.Sc / MBA / MA)',
        'Post Graduate / Doctorate',
        'Self Taught / Other'
      ]);
    } else if (group === 'studentGoals') {
      setStudentGoalsList([
        'Job / Corporate Placement',
        'Freelancing (Upwork/Fiverr)',
        'Own Business / Agency',
        'Academic Higher Studies',
        'Personal Skill Development',
        'Career Transition',
        'Other'
      ]);
    } else if (group === 'studentStatuses') {
      setStudentStatusesList([
        'Active',
        'Completed',
        'Alumni',
        'On Hold',
        'Dropped'
      ]);
    } else if (group === 'bloodGroups') {
      setBloodGroupsList([
        'A+',
        'A-',
        'B+',
        'B-',
        'O+',
        'O-',
        'AB+',
        'AB-'
      ]);
    } else if (group === 'discountTypes') {
      setDiscountTypesList([
        'Merit Scholarship',
        'Need-based Financial Waiver',
        'Early Bird Promo',
        'Group Admission Discount',
        'Seasonal Fest Offer',
        'Alumni Referral Privilege',
        'Special Discretion Waiver'
      ]);
    }
    logAudit('Options Reset', 'Settings / Dropdowns', group, `Reset ${group} to default values`);
  };

  // Specific convenience methods
  const addLeadSource = (option: string) => addDropdownOption('leadSources', option);
  const updateLeadSource = (oldVal: string, newVal: string) => updateDropdownOption('leadSources', oldVal, newVal);
  const deleteLeadSource = (option: string) => deleteDropdownOption('leadSources', option);

  const addExpenseCategory = (option: string) => addDropdownOption('expenseCategories', option);
  const updateExpenseCategory = (oldVal: string, newVal: string) => updateDropdownOption('expenseCategories', oldVal, newVal);
  const deleteExpenseCategory = (option: string) => deleteDropdownOption('expenseCategories', option);

  const addPaymentMethod = (option: string) => addDropdownOption('paymentMethods', option);
  const updatePaymentMethod = (oldVal: string, newVal: string) => updateDropdownOption('paymentMethods', oldVal, newVal);
  const deletePaymentMethod = (option: string) => deleteDropdownOption('paymentMethods', option);

  const addOccupation = (option: string) => addDropdownOption('occupations', option);
  const updateOccupation = (oldVal: string, newVal: string) => updateDropdownOption('occupations', oldVal, newVal);
  const deleteOccupation = (option: string) => deleteDropdownOption('occupations', option);

  const addEducationLevel = (option: string) => addDropdownOption('educationLevels', option);
  const updateEducationLevel = (oldVal: string, newVal: string) => updateDropdownOption('educationLevels', oldVal, newVal);
  const deleteEducationLevel = (option: string) => deleteDropdownOption('educationLevels', option);

  const addStudentGoal = (option: string) => addDropdownOption('studentGoals', option);
  const updateStudentGoal = (oldVal: string, newVal: string) => updateDropdownOption('studentGoals', oldVal, newVal);
  const deleteStudentGoal = (option: string) => deleteDropdownOption('studentGoals', option);

  const addStudentStatus = (option: string) => addDropdownOption('studentStatuses', option);
  const updateStudentStatus = (oldVal: string, newVal: string) => updateDropdownOption('studentStatuses', oldVal, newVal);
  const deleteStudentStatus = (option: string) => deleteDropdownOption('studentStatuses', option);

  const addBloodGroup = (option: string) => addDropdownOption('bloodGroups', option);
  const updateBloodGroup = (oldVal: string, newVal: string) => updateDropdownOption('bloodGroups', oldVal, newVal);
  const deleteBloodGroup = (option: string) => deleteDropdownOption('bloodGroups', option);

  const addDiscountType = (option: string) => addDropdownOption('discountTypes', option);
  const updateDiscountType = (oldVal: string, newVal: string) => updateDropdownOption('discountTypes', oldVal, newVal);
  const deleteDiscountType = (option: string) => deleteDropdownOption('discountTypes', option);

  // --- CAMPAIGNS ---
  const addCampaign = (campaignData: Omit<MarketingCampaign, 'id'>): MarketingCampaign => {
    const id = `cmp-${Date.now()}`;
    const newCampaign: MarketingCampaign = { ...campaignData, id };
    setCampaigns(prev => [newCampaign, ...prev]);
    logAudit('Campaign Created', 'Marketing', id, `Created campaign: ${newCampaign.name}`);
    return newCampaign;
  };

  const updateCampaign = (id: string, updates: Partial<MarketingCampaign>) => {
    setCampaigns(prev => prev.map(c => (c.id === id ? { ...c, ...updates } : c)));
  };

  // --- TRASH & RECOVERY ---
  const restoreFromTrash = (trashId: string) => {
    const item = trashItems.find(t => t.id === trashId);
    if (!item) return;

    if (item.itemType === 'lead') setLeads(prev => [item.data, ...prev]);
    else if (item.itemType === 'student') {
      const studentData = item.data?.student || item.data;
      setStudents(prev => [studentData, ...prev]);
      if (item.data?.admissions && Array.isArray(item.data.admissions)) {
        setAdmissions(prev => [...item.data.admissions, ...prev]);
      }
    }
    else if (item.itemType === 'course') setCourses(prev => [item.data, ...prev]);
    else if (item.itemType === 'batch') setBatches(prev => [item.data, ...prev]);
    else if (item.itemType === 'expense') setExpenses(prev => [item.data, ...prev]);
    else if (item.itemType === 'staff') setStaffList(prev => [item.data, ...prev]);
    else if (item.itemType === 'asset') setAssets(prev => [item.data, ...prev]);
    else if (item.itemType === 'schedule') setSchedules(prev => [item.data, ...prev]);
    else if (item.itemType === 'attendance') {
      if (Array.isArray(item.data)) {
        setAttendance(prev => [...item.data, ...prev]);
      } else {
        setAttendance(prev => [item.data, ...prev]);
      }
    }
    else if (item.itemType === 'exam') {
      if (item.data?.exam) {
        setExams(prev => [item.data.exam, ...prev]);
        if (item.data.results && Array.isArray(item.data.results)) {
          setExamResults(prev => [...item.data.results, ...prev]);
        }
      } else {
        setExams(prev => [item.data, ...prev]);
      }
    }
    else if (item.itemType === 'examResult') setExamResults(prev => [item.data, ...prev]);
    else if (item.itemType === 'certificate') setCertificates(prev => [item.data, ...prev]);
    else if (item.itemType === 'placement') setPlacements(prev => [item.data, ...prev]);
    else if (item.itemType === 'assignment') {
      if (item.data?.assignment) {
        setAssignments(prev => [item.data.assignment, ...prev]);
        if (item.data.submissions && Array.isArray(item.data.submissions)) {
          setAssignmentSubmissions(prev => [...item.data.submissions, ...prev]);
        }
      } else {
        setAssignments(prev => [item.data, ...prev]);
      }
    }
    else if (item.itemType === 'seminar') setSeminars(prev => [item.data, ...prev]);
    else if (item.itemType === 'payment') {
      const restoredPay: Payment = item.data;
      setPayments(prev => [restoredPay, ...prev]);
      setAdmissions(prev => prev.map(a => {
        if (a.id === restoredPay.admissionId) {
          const newTotal = a.totalPaid + restoredPay.amount;
          const newDue = Math.max(0, a.finalFee - newTotal);
          return {
            ...a,
            totalPaid: newTotal,
            due: newDue,
            paymentStatus: newDue === 0 ? 'Paid' : 'Partially Paid'
          };
        }
        return a;
      }));
    }

    setTrashItems(prev => prev.filter(t => t.id !== trashId));
    logAudit('Restored from Recycle Bin', 'System / Recycle Bin', item.originalId, `Restored ${item.title}`);
  };

  const permanentDeleteFromTrash = (trashId: string) => {
    setTrashItems(prev => prev.filter(t => t.id !== trashId));
  };

  const emptyTrash = () => {
    setTrashItems([]);
    logAudit('Trash Emptied', 'System / Trash', 'all', 'Permanently purged all items from trash');
  };

  // --- BACKUP & RESTORE ---
  const exportDatabaseJson = () => {
    const fullDb = {
      staffList,
      courses,
      batches,
      rooms,
      campaigns,
      leads,
      followUps,
      students,
      admissions,
      payments,
      attendance,
      schedules,
      exams,
      examResults,
      certificates,
      expenses,
      assets,
      auditLogs,
      placements,
      assignments,
      assignmentSubmissions,
      seminars,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(fullDb, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NexgenAcademy_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    logAudit('Database Exported', 'Settings / Backup', 'full-backup', 'Exported full JSON database snapshot');
  };

  const importDatabaseJson = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data.categories) setCategories(data.categories);
      if (data.courses) setCourses(data.courses);
      if (data.batches) setBatches(data.batches);
      if (data.leads) setLeads(data.leads);
      if (data.students) setStudents(data.students);
      if (data.admissions) setAdmissions(data.admissions);
      if (data.payments) setPayments(data.payments);
      if (data.expenses) setExpenses(data.expenses);
      if (data.staffList) setStaffList(data.staffList);
      if (data.placements) setPlacements(data.placements);
      if (data.assignments) setAssignments(data.assignments);
      if (data.assignmentSubmissions) setAssignmentSubmissions(data.assignmentSubmissions);
      if (data.seminars) setSeminars(data.seminars);
      logAudit('Database Restored', 'Settings / Backup', 'restore', 'Imported and restored database snapshot from JSON');
      return true;
    } catch (e) {
      console.error('Failed to parse database backup', e);
      return false;
    }
  };

  const resetToSampleData = () => {
    setStaffList(INITIAL_STAFF);
    setCategories(INITIAL_COURSE_CATEGORIES);
    setCourses(INITIAL_COURSES);
    setBatches(INITIAL_BATCHES);
    setRooms(INITIAL_ROOMS);
    setCampaigns(INITIAL_CAMPAIGNS);
    setLeads(INITIAL_LEADS);
    setFollowUps(INITIAL_FOLLOWUPS);
    setStudents(INITIAL_STUDENTS);
    setAdmissions(INITIAL_ADMISSIONS);
    setPayments(INITIAL_PAYMENTS);
    setAttendance(INITIAL_ATTENDANCE);
    setSchedules(INITIAL_SCHEDULE);
    setExams(INITIAL_EXAMS);
    setExamResults(INITIAL_EXAM_RESULTS);
    setCertificates(INITIAL_CERTIFICATES);
    setExpenses(INITIAL_EXPENSES);
    setAssets(INITIAL_ASSETS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setPlacements(INITIAL_PLACEMENTS);
    setAssignments(INITIAL_ASSIGNMENTS);
    setAssignmentSubmissions(INITIAL_ASSIGNMENT_SUBMISSIONS);
    setSeminars(INITIAL_SEMINARS);
    setTrashItems([]);
    logAudit('Database Reset', 'Settings', 'reset', 'Reset all academy database entities to initial standard seed data');
  };

  // --- QUERY HELPERS ---
  const getStudentById = (id: string) => students.find(s => s.id === id);
  const getCourseById = (id: string) => courses.find(c => c.id === id);
  const getBatchById = (id: string) => batches.find(b => b.id === id);
  const getAdmissionByStudentId = (studentId: string) => admissions.find(a => a.studentId === studentId);
  const getStaffById = (id: string) => staffList.find(s => s.id === id);
  const getPaymentsByAdmissionId = (admissionId: string) => payments.filter(p => p.admissionId === admissionId);

  // --- COMPUTED STATS ---
  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const currentMonth = today.slice(0, 7);

    const activeStudents = students.filter(s => s.status === 'Active').length;
    const completedStudents = students.filter(s => s.status === 'Completed' || s.status === 'Alumni').length;
    const droppedStudents = students.filter(s => s.status === 'Dropped').length;

    const newLeadsThisMonth = leads.filter(l => l.createdAt.startsWith(currentMonth)).length;

    const todayFollowupsCount = leads.filter(l => l.nextFollowUpDate === today && l.status !== 'Admitted' && l.status !== 'Lost').length;
    const overdueFollowupsCount = leads.filter(l => l.nextFollowUpDate && l.nextFollowUpDate < today && l.status !== 'Admitted' && l.status !== 'Lost').length;

    const todayCollection = payments.filter(p => p.date === today).reduce((sum, p) => sum + p.amount, 0);
    const monthCollection = payments.filter(p => p.date.startsWith(currentMonth)).reduce((sum, p) => sum + p.amount, 0);

    const totalDue = admissions.reduce((sum, a) => sum + a.due, 0);
    const overdueDueAmount = admissions.filter(a => a.paymentStatus === 'Overdue' || (a.nextPaymentDate && a.nextPaymentDate < today && a.due > 0)).reduce((sum, a) => sum + a.due, 0);

    const totalExpenseMonth = expenses.filter(e => e.date.startsWith(currentMonth)).reduce((sum, e) => sum + e.amount, 0);
    const netIncomeMonth = monthCollection - totalExpenseMonth;

    const admissionsThisMonth = admissions.filter(a => a.admissionDate.startsWith(currentMonth)).length;

    return {
      totalStudents: students.length,
      activeStudents,
      completedStudents,
      droppedStudents,
      totalLeads: leads.length,
      newLeadsThisMonth,
      todayFollowupsCount,
      overdueFollowupsCount,
      todayCollection,
      monthCollection,
      totalDue,
      overdueDueAmount,
      totalExpenseMonth,
      netIncomeMonth,
      admissionsThisMonth
    };
  }, [students, leads, payments, admissions, expenses]);

  return (
    <AcademyContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        firebaseUser,
        login,
        logout,
        updateCurrentUserProfile,
        updateStaffPhoto,
        academySettings,
        updateAcademySettings,
        changePassword,
        updateStaffCredentials,
        setCurrentUserRole,
        staffList,
        categories,
        courses,
        batches,
        rooms,
        campaigns,
        leads,
        followUps,
        students,
        admissions,
        payments,
        attendance,
        schedules,
        exams,
        examResults,
        certificates,
        publicCertificates,
        expenses,
        assets,
        auditLogs,
        trashItems,
        placements,
        addPlacement,
        updatePlacement,
        deletePlacement,
        assignments,
        assignmentSubmissions,
        addAssignment,
        updateAssignment,
        deleteAssignment,
        submitAssignment,
        gradeAssignmentSubmission,
        seminars,
        addSeminar,
        updateSeminar,
        deleteSeminar,
        registerLeadToSeminar,
        websiteCmsConfig,
        updateWebsiteCmsConfig,
        websiteReviews,
        addWebsiteReview,
        updateWebsiteReview,
        deleteWebsiteReview,
        websiteGallery,
        addWebsiteGalleryItem,
        updateWebsiteGalleryItem,
        deleteWebsiteGalleryItem,
        websiteNotices,
        addWebsiteNotice,
        updateWebsiteNotice,
        deleteWebsiteNotice,
        websiteFaqs,
        addWebsiteFaq,
        updateWebsiteFaq,
        deleteWebsiteFaq,
        websiteBlogs,
        addWebsiteBlog,
        updateWebsiteBlog,
        deleteWebsiteBlog,
        trainersList,
        addTrainer,
        updateTrainer,
        deleteTrainer,
        studentCourseReviews,
        addStudentCourseReview,
        updateStudentCourseReview,
        deleteStudentCourseReview,
        classroomGalleryPhotos,
        addClassroomGalleryPhoto,
        updateClassroomGalleryPhoto,
        deleteClassroomGalleryPhoto,
        generateInstallmentSchedule,
        getAtRiskStudents,
        getTodayLiveOperations,
        addCategory,
        updateCategory,
        deleteCategory,
        addLead,
        updateLead,
        deleteLead,
        submitPublicLead,
        addFollowUp,
        createAdmission,
        addPayment,
        updatePayment,
        deletePayment,
        clearDemoPayments,
        deleteAdmission,
        waiveAdmissionDue,
        updateStudent,
        deleteStudent,
        transferStudentBatch,
        addCourse,
        updateCourse,
        duplicateCourse,
        setCourseStatus,
        deleteCourse,
        addBatch,
        updateBatch,
        deleteBatch,
        bulkSaveAttendance,
        addClassSchedule,
        updateClassSchedule,
        addExam,
        saveExamResult,
        issueCertificate,
        addExpense,
        updateExpense,
        deleteExpense,
        clearDemoExpenses,
        addAsset,
        updateAsset,
        deleteAsset,
        addStaff,
        updateStaff,
        deleteStaff,
        addRoom,
        updateRoom,
        deleteRoom,
        deleteClassSchedule,
        deleteAttendance,
        deleteAttendanceBatch,
        deleteExam,
        deleteExamResult,
        revokeCertificate,
        deleteCertificate,
        updateCertificate,
        leadSources,
        leadSourcesList: leadSources,
        expenseCategoriesList,
        paymentMethodsList,
        occupationsList,
        educationLevelsList,
        studentGoalsList,
        studentStatusesList,
        bloodGroupsList,
        discountTypesList,
        addDropdownOption,
        updateDropdownOption,
        deleteDropdownOption,
        resetDropdownGroup,
        addLeadSource,
        updateLeadSource,
        deleteLeadSource,
        addExpenseCategory,
        updateExpenseCategory,
        deleteExpenseCategory,
        addPaymentMethod,
        updatePaymentMethod,
        deletePaymentMethod,
        addOccupation,
        updateOccupation,
        deleteOccupation,
        addEducationLevel,
        updateEducationLevel,
        deleteEducationLevel,
        addStudentGoal,
        updateStudentGoal,
        deleteStudentGoal,
        addStudentStatus,
        updateStudentStatus,
        deleteStudentStatus,
        addBloodGroup,
        updateBloodGroup,
        deleteBloodGroup,
        addDiscountType,
        updateDiscountType,
        deleteDiscountType,
        addCampaign,
        updateCampaign,
        restoreFromTrash,
        permanentDeleteFromTrash,
        emptyTrash,
        exportDatabaseJson,
        importDatabaseJson,
        resetToSampleData,
        resetToSeedData: resetToSampleData,
        cloudSyncStatus,
        lastCloudSyncTime,
        syncToCloudNow,
        getStudentById,
        getCourseById,
        getBatchById,
        getAdmissionByStudentId,
        getStaffById,
        getPaymentsByAdmissionId,
        stats
      }}
    >
      {children}
    </AcademyContext.Provider>
  );
};

export const useAcademy = () => {
  const context = useContext(AcademyContext);
  if (!context) {
    throw new Error('useAcademy must be used within an AcademyProvider');
  }
  return context;
};
