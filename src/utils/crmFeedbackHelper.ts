/**
 * CRM Feedback & Save Notification Helper
 * Provides real-time visual confirmation whenever CRM mutations occur
 */

export type CrmActionType = 'save' | 'update' | 'create' | 'delete' | 'sync' | 'assign' | 'status';

export interface CrmSaveEventDetail {
  id: string;
  title: string;
  description?: string;
  timestamp: string; // ISO string
  displayTime: string; // Formatted time
  actionType: CrmActionType;
  durationMs?: number;
}

export const CRM_DATA_SAVED_EVENT = 'crm-data-saved';

/**
 * Triggers a global visual confirmation event that CRM data was committed to database/storage
 */
export function triggerCrmDataSaved(
  title: string = 'ডেটাবেসে সংরক্ষিত হয়েছে',
  description?: string,
  actionType: CrmActionType = 'save',
  durationMs: number = 3200
): void {
  if (typeof window === 'undefined') return;

  const now = new Date();
  const displayTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const detail: CrmSaveEventDetail = {
    id: `crm-save-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    title,
    description,
    timestamp: now.toISOString(),
    displayTime,
    actionType,
    durationMs
  };

  try {
    const event = new CustomEvent(CRM_DATA_SAVED_EVENT, { detail });
    window.dispatchEvent(event);
  } catch (err) {
    console.warn('Failed to dispatch CRM save event:', err);
  }
}
