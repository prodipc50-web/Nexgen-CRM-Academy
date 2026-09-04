import React, { useState } from 'react';
import { useAcademy } from '../../context/AcademyContext';
import { NexgenLogo } from '../common/NexgenLogo';
import {
  X,
  Printer,
  Calendar,
  Wallet,
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Calculator,
  ChevronLeft,
  ChevronRight,
  Download,
  Building2,
  Coins
} from 'lucide-react';

interface DailyCashClosingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDate?: string;
}

export const DailyCashClosingModal: React.FC<DailyCashClosingModalProps> = ({
  isOpen,
  onClose,
  initialDate
}) => {
  const { payments, expenses, students, academySettings, currentUser } = useAcademy();

  const [selectedDate, setSelectedDate] = useState<string>(
    initialDate || new Date().toISOString().substring(0, 10)
  );
  const [openingBalance, setOpeningBalance] = useState<number>(0);
  const [notesDenominations, setNotesDenominations] = useState<{ [denom: number]: number }>({
    1000: 0,
    500: 0,
    200: 0,
    100: 0,
    50: 0,
    20: 0,
    10: 0,
    5: 0
  });
  const [cashierNotes, setCashierNotes] = useState('');
  const [isCountingStarted, setIsCountingStarted] = useState<boolean>(false);

  if (!isOpen) return null;

  // Change date by offset days
  const handleDateChange = (offsetDays: number) => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() + offsetDays);
    setSelectedDate(current.toISOString().substring(0, 10));
  };

  // Filter collections and expenses for selected day
  const dayPayments = payments.filter(p => p.date === selectedDate);
  const dayExpenses = expenses.filter(e => e.date === selectedDate);

  // Cash transactions
  const cashPayments = dayPayments.filter(p => p.paymentMethod === 'Cash');
  const cashExpenses = dayExpenses.filter(e => e.paymentMethod === 'Cash');

  // Digital / MFS transactions
  const bkashPayments = dayPayments.filter(p => p.paymentMethod === 'bKash');
  const nagadPayments = dayPayments.filter(p => p.paymentMethod === 'Nagad');
  const rocketPayments = dayPayments.filter(p => p.paymentMethod === 'Rocket');
  const bankPayments = dayPayments.filter(p => p.paymentMethod === 'Bank');

  // Totals
  const totalCashCollected = cashPayments.reduce((s, p) => s + p.amount, 0);
  const totalCashExpense = cashExpenses.reduce((s, e) => s + e.amount, 0);
  const expectedCashInDrawer = openingBalance + totalCashCollected - totalCashExpense;

  const totalBkash = bkashPayments.reduce((s, p) => s + p.amount, 0);
  const totalNagad = nagadPayments.reduce((s, p) => s + p.amount, 0);
  const totalRocket = rocketPayments.reduce((s, p) => s + p.amount, 0);
  const totalBank = bankPayments.reduce((s, p) => s + p.amount, 0);
  const totalDigitalCollected = totalBkash + totalNagad + totalRocket + totalBank;

  const totalDailyRevenue = totalCashCollected + totalDigitalCollected;
  const totalAllExpenses = dayExpenses.reduce((s, e) => s + e.amount, 0);
  const netDailySurplus = totalDailyRevenue - totalAllExpenses;

  // Cash note counting total
  const countedPhysicalCash = Object.entries(notesDenominations).reduce(
    (sum, [denom, count]) => sum + Number(denom) * (Number(count) || 0),
    0
  );

  const cashDiscrepancy = isCountingStarted ? (countedPhysicalCash - expectedCashInDrawer) : 0;

  const handlePrint = () => {
    window.print();
  };

  const handleDenominationChange = (denom: number, val: string) => {
    setIsCountingStarted(true);
    const num = Math.max(0, parseInt(val, 10) || 0);
    setNotesDenominations(prev => ({
      ...prev,
      [denom]: num
    }));
  };

  const handleResetCount = () => {
    setNotesDenominations({
      1000: 0,
      500: 0,
      200: 0,
      100: 0,
      50: 0,
      20: 0,
      10: 0,
      5: 0
    });
    setIsCountingStarted(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/80 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[96vh] animate-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Control Bar */}
        <div className="px-5 py-3.5 bg-slate-950 text-white flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 print:hidden">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white flex items-center space-x-2">
                <span>Daily Cash Closing & EOD Reconciliation</span>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-700 px-2 py-0.5 rounded-full">
                  ক্যাশ ড্রয়ার হিসাব
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Reconcile physical cash drawer, digital receipts, and petty cash expenses
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Print EOD Report</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Date Selector Banner (Screen Only) */}
        <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-700">Closing Date:</span>
            <div className="flex items-center bg-white border border-slate-300 rounded-lg overflow-hidden shadow-2xs">
              <button
                onClick={() => handleDateChange(-1)}
                className="p-1.5 hover:bg-slate-100 text-slate-600 transition-colors"
                title="Previous Day"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <input
                type="date"
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                className="px-2 py-1 text-xs font-bold text-slate-800 outline-none cursor-pointer"
              />
              <button
                onClick={() => handleDateChange(1)}
                className="p-1.5 hover:bg-slate-100 text-slate-600 transition-colors"
                title="Next Day"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={() => setSelectedDate(new Date().toISOString().substring(0, 10))}
              className="px-2 py-1 bg-slate-200 hover:bg-slate-300 text-slate-800 text-[11px] font-bold rounded-md transition-colors"
            >
              Today
            </button>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <span className="font-semibold text-slate-600">Opening Cash (সকালের শুরু ব্যালেন্স):</span>
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">৳</span>
              <input
                type="number"
                min="0"
                value={openingBalance || ''}
                onChange={e => setOpeningBalance(Math.max(0, Number(e.target.value)))}
                placeholder="0"
                className="w-24 bg-white border border-slate-300 rounded-lg pl-6 pr-2 py-1 font-bold text-slate-900 outline-none text-xs"
              />
            </div>
          </div>
        </div>

        {/* Printable / Viewable Report Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6 text-slate-800 print:p-0 print:m-0 print:overflow-visible" id="eod-report-printable">
          {/* Printable Header */}
          <div className="border-b-2 border-slate-900 pb-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <NexgenLogo variant="crest" size={42} />
              <div>
                <h1 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                  {academySettings.instituteName || 'Nexgen Academy'}
                </h1>
                <p className="text-xs text-slate-600">
                  {academySettings.officialAddress || 'Dhaka, Bangladesh'} | Hot-Line: {academySettings.primarySupportPhone || '+880 1700-000000'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="inline-block px-3 py-1 bg-slate-900 text-white rounded text-xs font-black uppercase tracking-wider">
                Daily Cash Closing Sheet
              </div>
              <p className="text-xs font-bold text-slate-700 mt-1">
                Date: <span className="font-mono text-indigo-700">{selectedDate}</span>
              </p>
            </div>
          </div>

          {/* Key Metric Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 print:grid-cols-4">
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider flex items-center space-x-1">
                <ArrowDownRight className="w-3.5 h-3.5" />
                <span>Cash Collection</span>
              </span>
              <p className="text-lg font-black text-emerald-950 mt-1">
                ৳{totalCashCollected.toLocaleString()}
              </p>
              <span className="text-[10px] text-emerald-700">{cashPayments.length} Desk Receipts</span>
            </div>

            <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl">
              <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider flex items-center space-x-1">
                <Coins className="w-3.5 h-3.5" />
                <span>MFS & Digital</span>
              </span>
              <p className="text-lg font-black text-indigo-950 mt-1">
                ৳{totalDigitalCollected.toLocaleString()}
              </p>
              <span className="text-[10px] text-indigo-700">{dayPayments.length - cashPayments.length} Online Txns</span>
            </div>

            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl">
              <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider flex items-center space-x-1">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>Cash Expenses</span>
              </span>
              <p className="text-lg font-black text-rose-950 mt-1">
                ৳{totalCashExpense.toLocaleString()}
              </p>
              <span className="text-[10px] text-rose-700">{cashExpenses.length} Vouchers</span>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl">
              <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider flex items-center space-x-1">
                <Wallet className="w-3.5 h-3.5 text-amber-600" />
                <span>Cash In Drawer</span>
              </span>
              <p className="text-lg font-black text-amber-950 mt-1">
                ৳{expectedCashInDrawer.toLocaleString()}
              </p>
              <span className="text-[10px] text-amber-800 font-semibold">Expected Closing</span>
            </div>
          </div>

          {/* Reconciliation Balance Equation Table */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <h3 className="text-xs font-bold text-slate-800 mb-2.5 uppercase tracking-wider flex items-center space-x-1.5">
              <Calculator className="w-4 h-4 text-indigo-600" />
              <span>Physical Cash Reconciliation Summary (ক্যাশ ড্রয়ার ব্যালেন্স শিট)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-2 border-r border-slate-200 pr-0 md:pr-4">
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-600">Morning Opening Cash:</span>
                  <span className="font-mono font-bold text-slate-900">৳{openingBalance.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200 text-emerald-800 font-semibold">
                  <span className="flex items-center space-x-1">
                    <span>(+) Total Cash Received at Desk:</span>
                  </span>
                  <span className="font-mono font-bold">+৳{totalCashCollected.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200 text-rose-700 font-semibold">
                  <span className="flex items-center space-x-1">
                    <span>(-) Total Cash Paid Out (Petty Expenses):</span>
                  </span>
                  <span className="font-mono font-bold">-৳{totalCashExpense.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1.5 bg-amber-100/70 px-2 rounded font-bold text-amber-950">
                  <span>(=) Expected Cash In Drawer:</span>
                  <span className="font-mono text-sm">৳{expectedCashInDrawer.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-600">Physical Counted Cash:</span>
                  <span className="font-mono font-bold text-slate-900">
                    {isCountingStarted ? `৳${countedPhysicalCash.toLocaleString()}` : '— (Not Counted)'}
                  </span>
                </div>
                {isCountingStarted && (
                  <div className={`flex justify-between py-1.5 px-2 rounded font-bold ${
                    cashDiscrepancy === 0
                      ? 'bg-emerald-100 text-emerald-900'
                      : cashDiscrepancy > 0
                      ? 'bg-blue-100 text-blue-900'
                      : 'bg-rose-100 text-rose-900'
                  }`}>
                    <span>Variance (পার্থক্য / শর্ট বা বাড়তি):</span>
                    <span className="font-mono text-sm">
                      {cashDiscrepancy === 0
                        ? '✓ Perfect Match (৳0)'
                        : cashDiscrepancy > 0
                        ? `+৳${cashDiscrepancy.toLocaleString()} (Surplus)`
                        : `-৳${Math.abs(cashDiscrepancy).toLocaleString()} (Shortage Alert)`}
                    </span>
                  </div>
                )}
                <div className="text-[11px] text-slate-500 pt-1">
                  MFS Breakdown: bKash (৳{totalBkash.toLocaleString()}), Nagad (৳{totalNagad.toLocaleString()}), Rocket (৳{totalRocket.toLocaleString()}), Bank (৳{totalBank.toLocaleString()})
                </div>
              </div>
            </div>
          </div>

          {/* Cash Note Denomination Counter (Screen Only Tool) */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 print:hidden">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                <Coins className="w-4 h-4 text-amber-600" />
                <span>Physical Note Counter Tool (নোট গণনা ক্যালকুলেটর)</span>
              </h3>
              <div className="flex items-center space-x-2">
                {isCountingStarted && (
                  <button
                    type="button"
                    onClick={handleResetCount}
                    className="text-[10px] text-rose-600 hover:text-rose-800 font-bold underline px-1.5 py-0.5"
                  >
                    Clear / Reset
                  </button>
                )}
                <span className="text-xs font-black text-slate-900 bg-white border border-slate-300 px-2.5 py-1 rounded-lg">
                  Total Counted: ৳{countedPhysicalCash.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {[1000, 500, 200, 100, 50, 20, 10, 5].map(denom => (
                <div key={denom} className="flex items-center bg-white border border-slate-200 rounded-lg p-1.5">
                  <span className="w-14 font-mono font-bold text-slate-700 text-center">৳{denom} ×</span>
                  <input
                    type="number"
                    min="0"
                    value={notesDenominations[denom] || ''}
                    onChange={e => handleDenominationChange(denom, e.target.value)}
                    placeholder="0"
                    className="w-16 bg-slate-50 border border-slate-200 rounded px-1.5 py-1 text-center font-bold text-slate-900 outline-none"
                  />
                  <span className="flex-1 text-right font-mono font-semibold text-slate-500 text-[11px] pr-1">
                    ={(Number(denom) * (notesDenominations[denom] || 0)).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Lists: Income & Expenses for the Day */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Cash Collections List */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-emerald-950 text-emerald-200 px-3 py-2 font-bold flex justify-between items-center">
                <span>Desk Cash Collections ({cashPayments.length})</span>
                <span>৳{totalCashCollected.toLocaleString()}</span>
              </div>
              <div className="max-h-56 overflow-y-auto divide-y divide-slate-100">
                {cashPayments.length === 0 ? (
                  <div className="p-4 text-center text-slate-400">No cash collected on this date</div>
                ) : (
                  cashPayments.map(p => {
                    const student = students.find(s => s.id === p.studentId);
                    return (
                      <div key={p.id} className="p-2 flex justify-between items-center hover:bg-slate-50">
                        <div>
                          <div className="font-bold text-slate-900">
                            {student?.name || 'Student'} <span className="font-mono text-slate-500 font-normal">({student?.studentCode || p.studentId})</span>
                          </div>
                          <div className="text-[10px] text-slate-500">
                            Rec: #{p.receiptNumber} {p.collectedBy ? `| Col: ${p.collectedBy}` : ''}
                          </div>
                        </div>
                        <div className="font-mono font-bold text-emerald-700 text-sm">
                          ৳{p.amount.toLocaleString()}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Cash Expenses List */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-rose-950 text-rose-200 px-3 py-2 font-bold flex justify-between items-center">
                <span>Daily Petty Cash Vouchers ({cashExpenses.length})</span>
                <span>৳{totalCashExpense.toLocaleString()}</span>
              </div>
              <div className="max-h-56 overflow-y-auto divide-y divide-slate-100">
                {cashExpenses.length === 0 ? (
                  <div className="p-4 text-center text-slate-400">No cash vouchers on this date</div>
                ) : (
                  cashExpenses.map(e => (
                    <div key={e.id} className="p-2 flex justify-between items-center hover:bg-slate-50">
                      <div>
                        <div className="font-bold text-slate-900">{e.paidTo}</div>
                        <div className="text-[10px] text-slate-500">
                          {e.category} — {e.description}
                        </div>
                      </div>
                      <div className="font-mono font-bold text-rose-700 text-sm">
                        ৳{e.amount.toLocaleString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Cashier Closing Remarks */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Cashier / Front Desk Closing Notes (মন্তব্য):
            </label>
            <input
              type="text"
              placeholder="e.g. All cash verified and placed in executive safe box. No missing vouchers."
              value={cashierNotes}
              onChange={e => setCashierNotes(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 outline-none"
            />
          </div>

          {/* Signatures for Print and Audit */}
          <div className="pt-10 grid grid-cols-2 gap-12 text-center text-xs">
            <div>
              <div className="border-t border-slate-400 pt-1.5 font-bold text-slate-800">
                Prepared By (Cashier / Accounts Officer)
              </div>
              <p className="text-[10px] text-slate-500">
                {currentUser?.name || 'Authorized Front Desk Officer'}
              </p>
            </div>
            <div>
              <div className="border-t border-slate-400 pt-1.5 font-bold text-slate-800">
                Verified & Approved By (Director / Branch Manager)
              </div>
              <p className="text-[10px] text-slate-500">
                Official Signature & Seal
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs print:hidden">
          <span className="text-slate-500 font-medium">
            System timestamp: {new Date().toLocaleTimeString()}
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold rounded-lg transition-colors"
            >
              Close
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg transition-colors flex items-center space-x-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Closing Slip</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
