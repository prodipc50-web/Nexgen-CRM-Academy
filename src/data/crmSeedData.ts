import { CrmSettingsConfig } from '../types';

export const INITIAL_CRM_SETTINGS: CrmSettingsConfig = {
  tags: [
    { id: 'tag-1', name: 'High Priority', color: 'red', description: 'Immediate enrollment target or hot lead' },
    { id: 'tag-2', name: 'Scholarship Applicant', color: 'amber', description: 'Applied for tuition waiver / discount voucher' },
    { id: 'tag-3', name: 'Weekend Batch Only', color: 'indigo', description: 'Interested in Friday/Saturday schedule' },
    { id: 'tag-4', name: 'Lab Visitor', color: 'emerald', description: 'Visited campus physical lab or scheduled tour' },
    { id: 'tag-5', name: 'Needs Follow-up', color: 'blue', description: 'Requires guardian talk or second call' },
    { id: 'tag-6', name: 'Corporate Referral', color: 'purple', description: 'Referred by partner company or alumni' }
  ],
  customFields: [
    {
      id: 'cf-1',
      label: 'Expected Joining Date',
      key: 'expectedJoinDate',
      type: 'date',
      required: false,
      showInLeadTable: true,
      category: 'General'
    },
    {
      id: 'cf-2',
      label: 'Preferred Shift',
      key: 'preferredShift',
      type: 'select',
      options: ['Morning (10:00 AM - 01:00 PM)', 'Afternoon (03:00 PM - 06:00 PM)', 'Evening (06:30 PM - 09:30 PM)'],
      required: false,
      showInLeadTable: false,
      category: 'Academic'
    },
    {
      id: 'cf-3',
      label: 'Personal Computer / Laptop Available',
      key: 'hasPersonalComputer',
      type: 'boolean',
      defaultValue: true,
      showInLeadTable: true,
      category: 'Academic'
    },
    {
      id: 'cf-4',
      label: 'Guardian / Reference Contact',
      key: 'guardianReference',
      type: 'text',
      placeholder: 'e.g. Father / Elder Brother - 017...',
      required: false,
      showInLeadTable: false,
      category: 'General'
    }
  ],
  leadSources: [
    'Facebook Ads',
    'Walk-in / Campus Visit',
    'Website Inquiry',
    'Website Popup Voucher',
    'YouTube / Video',
    'Campus Seminar / Workshop',
    'Student Referral',
    'Google Search',
    'Leaflet / Newspaper',
    'Phone Call / Direct Inquiry',
    'TikTok / Instagram',
    'Other'
  ],
  lostReasons: [
    'Course Fee Too High',
    'Schedule / Batch Time Mismatch',
    'Distance / Commute Issue',
    'Joined Another Academy',
    'Personal / Family Emergency',
    'Phone Unreachable / Not Answering',
    'Not Interested Anymore',
    'Other'
  ]
};
