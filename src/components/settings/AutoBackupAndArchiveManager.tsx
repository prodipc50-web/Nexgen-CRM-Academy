import React, { useState, useMemo } from 'react';
import { useAcademy } from '../../context/AcademyContext';
import {
  Calendar,
  Clock,
  Archive,
  Sparkles,
  AlertTriangle,
  HardDrive,
  Search,
  RotateCcw,
  Trash2,
  Download,
  Upload,
  CheckCircle2,
  Shield,
  RefreshCw,
  FileText,
  Sliders,
  Database,
  ArrowRight,
  Info,
  Check,
  X
} from 'lucide-react';
import { ArchivedItem, OptimizationReport } from '../../types';

export const AutoBackupAndArchiveManager: React.FC = () => {
  const {
    autoBackupConfig,
    updateAutoBackupConfig,
    isBackupOverdue,
    daysSinceLastBackup,
    systemSnapshots,
    createSafeSnapshot,
    restoreSafeSnapshot,
    deleteSafeSnapshot,
    downloadSingleSnapshotJson,
    exportAllSnapshotsJson,
    exportDatabaseJson,
    archivedItems,
    unarchiveRecord,
    deleteArchivedItem,
    clearAllArchivedItems,
    getStorageUsageBreakdown,
    runDatabaseOptimization,
    trashItems,
    emptyTrash,
    leads
  } = useAcademy();

  const [activeSubTab, setActiveSubTab] = useState<'scheduler' | 'storage' | 'archive'>('scheduler');
  const [isCapturing, setIsCapturing] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [notice, setNotice] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [lastReport, setLastReport] = useState<OptimizationReport | null>(null);
  const [archiveSearch, setArchiveSearch] = useState('');
  const [archiveFilterType, setArchiveFilterType] = useState<string>('all');
  const [customRetentionDays, setCustomRetentionDays] = useState<number>(60);
  const [customLeadDays, setCustomLeadDays] = useState<number>(90);

  // Storage breakdown calculations
  const storage = useMemo(() => getStorageUsageBreakdown(), [
    getStorageUsageBreakdown,
    systemSnapshots,
    archivedItems,
    trashItems,
    lastReport
  ]);

  const showNotice = (type: 'success' | 'error' | 'info', message: string, duration = 6000) => {
    setNotice({ type, message });
    setTimeout(() => {
      setNotice(prev => (prev?.message === message ? null : prev));
    }, duration);
  };

  const handleCaptureInstant = () => {
    setIsCapturing(true);
    try {
      const snap = createSafeSnapshot('manual', 'Manual Admin Instant Safe Snapshot');
      showNotice(
        'success',
        `Safe snapshot captured! Saved ${snap.studentCount} students, ${snap.admissionCount} admissions (${snap.sizeKb} KB).`
      );
    } catch {
      showNotice('error', 'Failed to capture snapshot.');
    } finally {
      setIsCapturing(false);
    }
  };

  const handleRunOptimization = () => {
    if (
      !confirm(
        'Run Smart Database Optimization?\n\nThis will:\n1. Archive audit logs older than ' +
          customRetentionDays +
          ' days to the Archive Vault\n2. Move inactive/lost leads older than ' +
          customLeadDays +
          ' days to the Archive Vault\n3. Permanently purge expired trash items\n\nNo active students, batches, or payments will be deleted.'
      )
    ) {
      return;
    }

    setIsOptimizing(true);
    setTimeout(() => {
      try {
        const report = runDatabaseOptimization({
          pruneAuditLogsOlderThanDays: customRetentionDays,
          archiveLostLeadsOlderThanDays: customLeadDays,
          purgeTrashOlderThanDays: 30
        });
        setLastReport(report);
        showNotice('success', report.summary);
      } catch {
        showNotice('error', 'Database optimization encountered an issue.');
      } finally {
        setIsOptimizing(false);
      }
    }, 400);
  };

  const filteredArchive = useMemo(() => {
    return archivedItems.filter(item => {
      const matchesType = archiveFilterType === 'all' || item.entityType === archiveFilterType;
      const searchLower = archiveSearch.toLowerCase();
      const matchesSearch =
        !archiveSearch ||
        item.title?.toLowerCase().includes(searchLower) ||
        item.subtitle?.toLowerCase().includes(searchLower) ||
        item.originalId?.toLowerCase().includes(searchLower);
      return matchesType && matchesSearch;
    });
  }, [archivedItems, archiveFilterType, archiveSearch]);

  const handleExportArchiveJson = () => {
    const blob = new Blob([JSON.stringify(archivedItems, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Nexgen_Archive_Vault_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showNotice('success', `Exported ${archivedItems.length} archive vault records as JSON file.`);
  };

  // Quick stats for archiving candidates
  const candidateStats = useMemo(() => {
    const closedLeads = leads.filter(
      l => l.status === 'Lost' || l.status === 'Duplicate' || l.status === 'Suspicious'
    );
    return {
      closedLeadsCount: closedLeads.length,
      trashCount: trashItems.length
    };
  }, [leads, trashItems]);

  return (
    <div className="space-y-6">
      {/* Notice Banner */}
      {notice && (
        <div
          className={`p-4 rounded-2xl border flex items-center justify-between shadow-2xs transition-all ${
            notice.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : notice.type === 'error'
              ? 'bg-rose-50 border-rose-200 text-rose-900'
              : 'bg-indigo-50 border-indigo-200 text-indigo-900'
          }`}
        >
          <div className="flex items-center space-x-2.5 text-xs font-semibold">
            {notice.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : notice.type === 'error' ? (
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            ) : (
              <Info className="w-5 h-5 text-indigo-600 shrink-0" />
            )}
            <span>{notice.message}</span>
          </div>
          <button
            onClick={() => setNotice(null)}
            className="p-1 hover:bg-black/5 rounded-lg text-slate-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Overdue Warning Alert */}
      {isBackupOverdue && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-start sm:items-center space-x-3">
            <div className="p-2 bg-amber-200/70 text-amber-900 rounded-xl shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-amber-900">
                Backup Attention Recommended
              </p>
              <p className="text-xs text-amber-800 font-medium">
                Last snapshot was taken <strong className="font-bold">{daysSinceLastBackup} days ago</strong> (threshold is{' '}
                {autoBackupConfig.reminderDaysThreshold} days). Take an instant snapshot or export your database to ensure data security.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={handleCaptureInstant}
              disabled={isCapturing}
              className="px-3.5 py-2 bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs rounded-xl transition-colors flex items-center space-x-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isCapturing ? 'animate-spin' : ''}`} />
              <span>Take Snapshot Now</span>
            </button>
            <button
              onClick={exportDatabaseJson}
              className="px-3 py-2 bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs rounded-xl transition-colors flex items-center space-x-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>
          </div>
        </div>
      )}

      {/* Top Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveSubTab('scheduler')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center space-x-2 ${
            activeSubTab === 'scheduler'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Automated Backup Scheduler</span>
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
              autoBackupConfig.enabled
                ? activeSubTab === 'scheduler'
                  ? 'bg-indigo-800 text-indigo-100'
                  : 'bg-emerald-100 text-emerald-800'
                : 'bg-slate-200 text-slate-600'
            }`}
          >
            {autoBackupConfig.enabled ? 'Active' : 'Paused'}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('storage')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center space-x-2 ${
            activeSubTab === 'storage'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          <HardDrive className="w-4 h-4" />
          <span>Storage Analyzer & Cleaner</span>
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
              activeSubTab === 'storage' ? 'bg-indigo-800 text-indigo-100' : 'bg-slate-100 text-slate-700'
            }`}
          >
            {storage.totalUsedKb} KB
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('archive')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center space-x-2 ${
            activeSubTab === 'archive'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          <Archive className="w-4 h-4" />
          <span>Archive Vault</span>
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
              activeSubTab === 'archive' ? 'bg-indigo-800 text-indigo-100' : 'bg-indigo-100 text-indigo-800'
            }`}
          >
            {archivedItems.length}
          </span>
        </button>
      </div>

      {/* SUB-TAB 1: AUTOMATED BACKUP SCHEDULER */}
      {activeSubTab === 'scheduler' && (
        <div className="space-y-6">
          {/* Policy & Schedule Configuration Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Backup Policy & Scheduling Controls</h3>
                  <p className="text-xs text-slate-500">
                    Configure automated snapshot intervals, retention points, and download behavior
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoBackupConfig.enabled}
                    onChange={e => updateAutoBackupConfig({ enabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  <span className="ml-2 text-xs font-bold text-slate-700">
                    {autoBackupConfig.enabled ? 'Scheduler Active' : 'Scheduler Paused'}
                  </span>
                </label>
              </div>
            </div>

            {/* Schedule Configuration Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Frequency */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span>Snapshot Frequency</span>
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                </label>
                <select
                  value={autoBackupConfig.frequency}
                  onChange={e =>
                    updateAutoBackupConfig({
                      frequency: e.target.value as 'daily' | 'weekly' | 'monthly'
                    })
                  }
                  className="w-full text-xs font-semibold px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="daily">Daily (Every 24 Hours - Recommended)</option>
                  <option value="weekly">Weekly (Every 7 Days)</option>
                  <option value="monthly">Monthly (Every 30 Days)</option>
                </select>
                <p className="text-[11px] text-slate-500">
                  Snapshot will be automatically generated upon system launch when due.
                </p>
              </div>

              {/* Retention Count */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span>Keep Point-in-Time Points</span>
                  <Database className="w-3.5 h-3.5 text-slate-400" />
                </label>
                <select
                  value={autoBackupConfig.maxSnapshotsToKeep}
                  onChange={e =>
                    updateAutoBackupConfig({
                      maxSnapshotsToKeep: Number(e.target.value)
                    })
                  }
                  className="w-full text-xs font-semibold px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value={5}>Keep Latest 5 Snapshots</option>
                  <option value={10}>Keep Latest 10 Snapshots (Recommended)</option>
                  <option value={15}>Keep Latest 15 Snapshots</option>
                  <option value={20}>Keep Latest 20 Snapshots</option>
                </select>
                <p className="text-[11px] text-slate-500">
                  Oldest point-in-time snapshots are cycled out automatically.
                </p>
              </div>

              {/* Overdue Reminder Threshold */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span>Overdue Alert Threshold</span>
                  <AlertTriangle className="w-3.5 h-3.5 text-slate-400" />
                </label>
                <select
                  value={autoBackupConfig.reminderDaysThreshold}
                  onChange={e =>
                    updateAutoBackupConfig({
                      reminderDaysThreshold: Number(e.target.value)
                    })
                  }
                  className="w-full text-xs font-semibold px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value={3}>Alert if overdue &gt; 3 days</option>
                  <option value={7}>Alert if overdue &gt; 7 days (Recommended)</option>
                  <option value={14}>Alert if overdue &gt; 14 days</option>
                  <option value={30}>Alert if overdue &gt; 30 days</option>
                </select>
                <p className="text-[11px] text-slate-500">
                  Prompts notification banner if system hasn't been backed up.
                </p>
              </div>
            </div>

            {/* Auto-Download Checkbox */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100">
              <div className="flex items-center space-x-3">
                <Download className="w-4 h-4 text-indigo-600 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-slate-900">Auto-Download File on Scheduled Snapshot</p>
                  <p className="text-[11px] text-slate-500">
                    Automatically triggers an offline .json file download to your computer when a scheduled backup occurs.
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoBackupConfig.autoDownloadOnSchedule ?? false}
                  onChange={e => updateAutoBackupConfig({ autoDownloadOnSchedule: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          </div>

          {/* Point-in-Time Safe Snapshots List */}
          <div className="bg-white p-6 rounded-3xl border border-indigo-100 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-bold text-slate-900">Point-in-Time Safe Snapshots</h3>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                    {systemSnapshots.length} / {autoBackupConfig.maxSnapshotsToKeep} Points
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Restore any point in 1-click or download individual snapshot JSON files
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  disabled={isCapturing}
                  onClick={handleCaptureInstant}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center space-x-1.5"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isCapturing ? 'animate-spin' : ''}`} />
                  <span>{isCapturing ? 'Capturing...' : '+ Capture Instant Snapshot'}</span>
                </button>

                {systemSnapshots.length > 0 && (
                  <button
                    type="button"
                    onClick={exportAllSnapshotsJson}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center space-x-1"
                    title="Export all snapshots as single archive file"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Bundle All (.json)</span>
                  </button>
                )}
              </div>
            </div>

            {systemSnapshots.length === 0 ? (
              <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <Database className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-60" />
                <p className="text-xs font-bold text-slate-700">No Historical Snapshots Created Yet</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Click "+ Capture Instant Snapshot" or wait for the automatic scheduler.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden text-xs">
                {systemSnapshots.map((snap, idx) => (
                  <div
                    key={snap.id}
                    className="p-4 bg-white hover:bg-slate-50/80 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            snap.type === 'auto_daily'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-indigo-100 text-indigo-800'
                          }`}
                        >
                          {snap.type === 'auto_daily' ? 'Auto Scheduled' : 'Manual Point'}
                        </span>
                        <span className="font-bold text-slate-900 text-xs">{snap.dateLabel}</span>
                        {idx === 0 && (
                          <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded">
                            Latest Safe Point
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium">
                        {snap.note || 'Full System Snapshot'}
                      </p>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-600 font-medium">
                        <span>
                          Students: <strong className="text-slate-900">{snap.studentCount}</strong>
                        </span>
                        <span>•</span>
                        <span>
                          Admissions: <strong className="text-slate-900">{snap.admissionCount}</strong>
                        </span>
                        <span>•</span>
                        <span>
                          Payments: <strong className="text-slate-900">{snap.paymentCount}</strong>
                        </span>
                        <span>•</span>
                        <span>
                          Leads: <strong className="text-slate-900">{snap.leadCount}</strong>
                        </span>
                        <span>•</span>
                        <span>
                          Size: <strong className="text-slate-900">{snap.sizeKb} KB</strong>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          if (
                            confirm(
                              `Restore database to snapshot: ${snap.dateLabel}?\n\nContains:\n- Students: ${snap.studentCount}\n- Admissions: ${snap.admissionCount}\n- Payments: ${snap.paymentCount}\n\nCurrent records will be safely replaced.`
                            )
                          ) {
                            const ok = restoreSafeSnapshot(snap.id);
                            if (ok) {
                              showNotice('success', `Database restored to snapshot: ${snap.dateLabel}!`);
                            } else {
                              showNotice('error', 'Failed to restore snapshot.');
                            }
                          }
                        }}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center space-x-1.5"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>1-Click Restore</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => downloadSingleSnapshotJson(snap.id)}
                        className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center space-x-1"
                        title="Download single snapshot file"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download JSON</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (confirm('Delete this historical snapshot?')) {
                            deleteSafeSnapshot(snap.id);
                          }
                        }}
                        className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-xl transition-colors"
                        title="Delete snapshot"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: STORAGE ANALYZER & CLEANER */}
      {activeSubTab === 'storage' && (
        <div className="space-y-6">
          {/* Storage Meter Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                  <HardDrive className="w-4 h-4 text-indigo-600" />
                  <span>Database Storage Breakdown & Health Analyzer</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Live breakdown of disk memory used across students, admissions, leads, logs, and trash
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-slate-700">
                  Total: <strong className="text-indigo-600">{storage.totalUsedKb} KB</strong> / ~
                  {storage.estimatedQuotaKb} KB ({storage.percentageUsed}%)
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    storage.percentageUsed < 50
                      ? 'bg-emerald-100 text-emerald-800'
                      : storage.percentageUsed < 80
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {storage.percentageUsed < 50
                    ? 'Optimal / Lean'
                    : storage.percentageUsed < 80
                    ? 'Moderate'
                    : 'Heavy Usage'}
                </span>
              </div>
            </div>

            {/* Visual Storage Bar */}
            <div className="space-y-1.5">
              <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden flex">
                <div
                  style={{ width: `${Math.max(2, (storage.studentsKb / (storage.totalUsedKb || 1)) * 100)}%` }}
                  className="bg-blue-500"
                  title={`Students: ${storage.studentsKb} KB`}
                />
                <div
                  style={{ width: `${Math.max(2, (storage.admissionsKb / (storage.totalUsedKb || 1)) * 100)}%` }}
                  className="bg-emerald-500"
                  title={`Admissions: ${storage.admissionsKb} KB`}
                />
                <div
                  style={{ width: `${Math.max(2, (storage.paymentsKb / (storage.totalUsedKb || 1)) * 100)}%` }}
                  className="bg-purple-500"
                  title={`Payments: ${storage.paymentsKb} KB`}
                />
                <div
                  style={{ width: `${Math.max(2, (storage.leadsKb / (storage.totalUsedKb || 1)) * 100)}%` }}
                  className="bg-amber-500"
                  title={`Leads: ${storage.leadsKb} KB`}
                />
                <div
                  style={{ width: `${Math.max(2, (storage.auditLogsKb / (storage.totalUsedKb || 1)) * 100)}%` }}
                  className="bg-rose-400"
                  title={`Audit Logs: ${storage.auditLogsKb} KB`}
                />
                <div
                  style={{ width: `${Math.max(2, (storage.snapshotsKb / (storage.totalUsedKb || 1)) * 100)}%` }}
                  className="bg-indigo-400"
                  title={`Snapshots: ${storage.snapshotsKb} KB`}
                />
                <div
                  style={{ width: `${Math.max(1, (storage.trashKb / (storage.totalUsedKb || 1)) * 100)}%` }}
                  className="bg-slate-400"
                  title={`Trash: ${storage.trashKb} KB`}
                />
                <div
                  style={{ width: `${Math.max(1, (storage.archivedKb / (storage.totalUsedKb || 1)) * 100)}%` }}
                  className="bg-teal-500"
                  title={`Archive Vault: ${storage.archivedKb} KB`}
                />
              </div>

              {/* Legend */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-600 pt-1">
                <span className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
                  <span>Students ({storage.studentsKb} KB)</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                  <span>Admissions ({storage.admissionsKb} KB)</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block" />
                  <span>Payments ({storage.paymentsKb} KB)</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                  <span>Leads ({storage.leadsKb} KB)</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-400 inline-block" />
                  <span>Audit Logs ({storage.auditLogsKb} KB)</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 inline-block" />
                  <span>Snapshots ({storage.snapshotsKb} KB)</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400 inline-block" />
                  <span>Trash ({storage.trashKb} KB)</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-500 inline-block" />
                  <span>Archive ({storage.archivedKb} KB)</span>
                </span>
              </div>
            </div>
          </div>

          {/* 1-Click Database Optimization & Archiving Action Card */}
          <div className="bg-white p-6 rounded-3xl border border-indigo-100 shadow-2xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-indigo-50 text-indigo-700 rounded-2xl">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Smart Database Cleaner &amp; Compact Optimizer
                  </h3>
                  <p className="text-xs text-slate-500">
                    Safely prune older audit logs, move dormant leads to vault, and purge expired trash
                  </p>
                </div>
              </div>

              <button
                onClick={handleRunOptimization}
                disabled={isOptimizing}
                className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center space-x-2"
              >
                <Sparkles className={`w-4 h-4 ${isOptimizing ? 'animate-spin' : ''}`} />
                <span>{isOptimizing ? 'Optimizing Database...' : 'Run Optimization Now (কমপ্যাক্ট ও ক্লিনআপ)'}</span>
              </button>
            </div>

            {/* Optimization Rules & Thresholds */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
                <label className="text-xs font-bold text-slate-800">Prune Audit Logs Older Than</label>
                <select
                  value={customRetentionDays}
                  onChange={e => setCustomRetentionDays(Number(e.target.value))}
                  className="w-full text-xs font-semibold px-2.5 py-1.5 bg-white border border-slate-300 rounded-xl focus:outline-none"
                >
                  <option value={30}>30 Days</option>
                  <option value={60}>60 Days (Recommended)</option>
                  <option value={90}>90 Days</option>
                  <option value={180}>180 Days</option>
                </select>
                <p className="text-[11px] text-slate-500">
                  Older logs are bundled and safely placed into Archive Vault.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
                <label className="text-xs font-bold text-slate-800">Archive Lost/Closed Leads Older Than</label>
                <select
                  value={customLeadDays}
                  onChange={e => setCustomLeadDays(Number(e.target.value))}
                  className="w-full text-xs font-semibold px-2.5 py-1.5 bg-white border border-slate-300 rounded-xl focus:outline-none"
                >
                  <option value={30}>30 Days</option>
                  <option value={60}>60 Days</option>
                  <option value={90}>90 Days (Recommended)</option>
                  <option value={180}>180 Days</option>
                </select>
                <p className="text-[11px] text-slate-500">
                  Removes clutter from CRM board; recoverable anytime.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
                <label className="text-xs font-bold text-slate-800">Recycle Bin Auto-Purge</label>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-slate-600 font-medium">Trash Items:</span>
                  <span className="text-xs font-bold text-slate-900">{trashItems.length} items</span>
                </div>
                {trashItems.length > 0 ? (
                  <button
                    onClick={() => {
                      if (confirm(`Empty ${trashItems.length} trash items permanently?`)) {
                        emptyTrash();
                        showNotice('success', 'Trash emptied permanently.');
                      }
                    }}
                    className="w-full mt-1 px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-lg transition-colors flex items-center justify-center space-x-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Empty Trash Now</span>
                  </button>
                ) : (
                  <p className="text-[11px] text-emerald-600 font-semibold">Recycle bin is clean</p>
                )}
              </div>
            </div>

            {/* Latest Optimization Report */}
            {lastReport && (
              <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-emerald-950 space-y-2">
                <div className="flex items-center space-x-2 text-xs font-bold text-emerald-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Latest Optimization Savings Report ({new Date(lastReport.timestamp).toLocaleTimeString()})</span>
                </div>
                <p className="text-xs leading-relaxed font-medium">{lastReport.summary}</p>
                <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-emerald-800 pt-1">
                  <span>Storage Freed: ~{lastReport.freedKb} KB</span>
                  <span>•</span>
                  <span>Archived Logs: {lastReport.archivedLogsCount}</span>
                  <span>•</span>
                  <span>Archived Leads: {lastReport.archivedLeadsCount}</span>
                  <span>•</span>
                  <span>Purged Trash: {lastReport.purgedTrashCount}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: ARCHIVE VAULT */}
      {activeSubTab === 'archive' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                    <Archive className="w-4 h-4 text-indigo-600" />
                    <span>Archive Vault</span>
                  </h3>
                  <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded-full">
                    {archivedItems.length} Archived Items
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Historical and pruned records kept outside active search queries. 1-click restore available anytime.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                {archivedItems.length > 0 && (
                  <>
                    <button
                      onClick={handleExportArchiveJson}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center space-x-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export Archive JSON</span>
                    </button>
                    <button
                      onClick={() => {
                        if (
                          confirm(
                            `Clear all ${archivedItems.length} items from Archive Vault? This action cannot be undone.`
                          )
                        ) {
                          clearAllArchivedItems();
                          showNotice('info', 'Archive vault cleared.');
                        }
                      }}
                      className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-xl transition-colors"
                      title="Clear entire archive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search archive by title, name, ID..."
                  value={archiveSearch}
                  onChange={e => setArchiveSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center space-x-1.5 self-start sm:self-auto overflow-x-auto">
                {['all', 'lead', 'audit_log', 'batch', 'student'].map(type => (
                  <button
                    key={type}
                    onClick={() => setArchiveFilterType(type)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg capitalize transition-colors ${
                      archiveFilterType === type
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                    }`}
                  >
                    {type === 'all' ? 'All Records' : type.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Archived Items List */}
            {filteredArchive.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <Archive className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-60" />
                <p className="text-xs font-bold text-slate-700">No Items in Archive Vault</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {archiveSearch || archiveFilterType !== 'all'
                    ? 'No matching archived records found for current filters.'
                    : 'When old logs or leads are optimized, they will appear here safely for future reference.'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden text-xs">
                {filteredArchive.map(item => (
                  <div
                    key={item.id}
                    className="p-4 bg-white hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 uppercase tracking-wider">
                          {item.entityType.replace('_', ' ')}
                        </span>
                        <span className="font-bold text-slate-900 text-xs">{item.title}</span>
                      </div>
                      {item.subtitle && <p className="text-[11px] text-slate-500">{item.subtitle}</p>}
                      <div className="flex items-center space-x-3 text-[11px] text-slate-400">
                        <span>Archived: {new Date(item.archivedAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>By: {item.archivedBy}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      {item.entityType !== 'audit_log' && (
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Restore "${item.title}" to active records?`)) {
                              const ok = unarchiveRecord(item.id);
                              if (ok) {
                                showNotice('success', `Restored ${item.title} to active database.`);
                              }
                            }
                          }}
                          className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl transition-colors flex items-center space-x-1"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Restore to Active</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Permanently remove "${item.title}" from archive?`)) {
                            deleteArchivedItem(item.id);
                            showNotice('info', `Deleted ${item.title} from archive.`);
                          }
                        }}
                        className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-xl transition-colors"
                        title="Delete from archive permanently"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
