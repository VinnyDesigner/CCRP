import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  ShieldCheck,
  Info,
} from 'lucide-react';

interface WorkspaceSelectionModalProps {
  isOpen: boolean;
  onSelectMRV: () => void;
  onSelectProjectTracker: () => void;
}

export const WorkspaceSelectionModal: React.FC<WorkspaceSelectionModalProps> = ({
  isOpen,
  onSelectMRV,
  onSelectProjectTracker,
}) => {
  // Default to 'PROJECT_TRACKER' so onboarding content is immediately visible in the single modal
  const [selectedWorkspace, setSelectedWorkspace] = useState<'PROJECT_TRACKER' | 'MRV'>('PROJECT_TRACKER');
  const [hasAgreedProjectTracker, setHasAgreedProjectTracker] = useState(false);
  const [hasAgreedMRV, setHasAgreedMRV] = useState(false);

  // Reset agreement states and selection when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedWorkspace('PROJECT_TRACKER');
      setHasAgreedProjectTracker(false);
      setHasAgreedMRV(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-5 bg-slate-900/70 backdrop-blur-xs animate-fade-in font-sans">
      <div className="bg-white w-full max-w-2xl max-h-[92vh] rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden text-slate-800 animate-scale-in">
        
        {/* ================================================================= */}
        {/* MODAL HEADER                                                      */}
        {/* ================================================================= */}
        <div className="px-5 sm:px-6 pt-5 sm:pt-6 pb-2 text-left shrink-0">
          <h2 className="text-[20px] font-bold font-display tracking-tight text-slate-900 leading-snug">
            Choose Your Workspace
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-[2px]">
            Select the platform you want to access.
          </p>
        </div>

        {/* ================================================================= */}
        {/* SCROLLABLE MODAL BODY (ALL IN ONE SINGLE SCREEN)                  */}
        {/* ================================================================= */}
        <div className="flex-1 min-h-0 overflow-y-auto px-5 sm:px-6 pb-6 pt-2 space-y-4 sm:space-y-5">
          
          {/* Top Section: Workspace Selection Cards (Compact with top-aligned arrow) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            
            {/* 1. MRV Workspace Card (Light Blue) */}
            <button
              type="button"
              onClick={() => setSelectedWorkspace('MRV')}
              className={`group text-left p-3.5 sm:p-4 rounded-xl border-2 transition-all cursor-pointer ${
                selectedWorkspace === 'MRV'
                  ? 'bg-[#EBF5FF] border-[#004B87] shadow-sm ring-2 ring-[#004B87]/25'
                  : 'bg-[#F4F9FF] hover:bg-[#EBF5FF] border-blue-200/80 hover:border-blue-300'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  MRV
                </h3>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all ${
                  selectedWorkspace === 'MRV'
                    ? 'bg-[#004B87] text-white shadow-xs'
                    : 'text-slate-400 group-hover:text-[#004B87] group-hover:translate-x-0.5'
                }`}>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Environmental Monitoring, Reporting & Verification
              </p>
            </button>

            {/* 2. Project Tracker Workspace Card (Light Green) */}
            <button
              type="button"
              onClick={() => setSelectedWorkspace('PROJECT_TRACKER')}
              className={`group text-left p-3.5 sm:p-4 rounded-xl border-2 transition-all cursor-pointer ${
                selectedWorkspace === 'PROJECT_TRACKER'
                  ? 'bg-[#EAF8F0] border-emerald-600 shadow-sm ring-2 ring-emerald-500/25'
                  : 'bg-[#F2FBF6] hover:bg-[#EAF8F0] border-emerald-200/80 hover:border-emerald-300'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  Project Tracker
                </h3>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all ${
                  selectedWorkspace === 'PROJECT_TRACKER'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-0.5'
                }`}>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Register, monitor, and report climate change projects and initiatives.
              </p>
            </button>

          </div>

          {/* =============================================================== */}
          {/* CONTENT SECTION WHEN PROJECT TRACKER IS SELECTED                */}
          {/* =============================================================== */}
          {selectedWorkspace === 'PROJECT_TRACKER' && (
            <div className="space-y-4 pt-1 animate-fade-in">
              
              {/* About Project Tracker */}
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-1.5">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
                  <Info className="w-4 h-4 text-[#386B98]" />
                  <span>About Project Tracker</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pl-6">
                  The Project Tracker enables you to register and manage climate change projects, track project progress, submit periodic data, manage amendments, and monitor reporting performance.
                </p>
              </div>

              {/* Before You Proceed */}
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-2.5">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-[#386B98]" />
                  <span>Before You Proceed</span>
                </div>

                <div className="space-y-2 text-xs text-slate-700 pl-1">
                  <div className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#386B98] mt-1.5 shrink-0" />
                    <span>Register and maintain climate change projects.</span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#386B98] mt-1.5 shrink-0" />
                    <span>Submit project progress and reporting data according to the applicable reporting period.</span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#386B98] mt-1.5 shrink-0" />
                    <span>Keep project information and submitted data accurate and up to date.</span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#386B98] mt-1.5 shrink-0" />
                    <span>Review and submit information before completing each reporting cycle.</span>
                  </div>
                </div>
              </div>

              {/* Bottom Acknowledgement Checkbox */}
              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 flex items-start gap-3">
                <input
                  id="project-tracker-agree"
                  type="checkbox"
                  checked={hasAgreedProjectTracker}
                  onChange={(e) => setHasAgreedProjectTracker(e.target.checked)}
                  className="w-4 h-4 mt-0.5 text-[#386B98] border-slate-300 rounded focus:ring-[#386B98] cursor-pointer"
                />
                <label
                  htmlFor="project-tracker-agree"
                  className="text-xs font-semibold text-slate-800 cursor-pointer select-none leading-relaxed"
                >
                  I have read and understood the above information and agree to proceed.
                </label>
              </div>

              {/* Action Button: Proceed to Project Registration (Aligned to Right Bottom Corner) */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  disabled={!hasAgreedProjectTracker}
                  onClick={onSelectProjectTracker}
                  className={`py-2.5 px-6 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                    hasAgreedProjectTracker
                      ? 'bg-[#3F6E97] hover:bg-[#345B7D] active:scale-[0.99] text-white shadow-md cursor-pointer'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                  }`}
                >
                  <span>Proceed to Project Registration</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

          {/* =============================================================== */}
          {/* CONTENT SECTION WHEN MRV IS SELECTED                            */}
          {/* =============================================================== */}
          {selectedWorkspace === 'MRV' && (
            <div className="space-y-4 pt-1 animate-fade-in">
              
              {/* About MRV */}
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-1.5">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
                  <Info className="w-4 h-4 text-[#004B87]" />
                  <span>About MRV</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pl-6">
                  Environmental Monitoring, Reporting & Verification platform for managing facility registration, monitoring plans, annual emissions data, verification, and reporting.
                </p>
              </div>

              {/* BEFORE YOU PROCEED */}
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-2.5">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-[#004B87]" />
                  <span>BEFORE YOU PROCEED</span>
                </div>

                <div className="space-y-2 text-xs text-slate-700 pl-1">
                  <div className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#004B87] mt-1.5 shrink-0" />
                    <span>Register and maintain environmental facilities.</span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#004B87] mt-1.5 shrink-0" />
                    <span>Submit annual emissions and monitoring data.</span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#004B87] mt-1.5 shrink-0" />
                    <span>Maintain accurate monitoring and verification information.</span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#004B87] mt-1.5 shrink-0" />
                    <span>Review and submit information according to the applicable reporting requirements.</span>
                  </div>
                </div>
              </div>

              {/* Bottom Acknowledgement Checkbox for MRV */}
              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 flex items-start gap-3">
                <input
                  id="mrv-agree"
                  type="checkbox"
                  checked={hasAgreedMRV}
                  onChange={(e) => setHasAgreedMRV(e.target.checked)}
                  className="w-4 h-4 mt-0.5 text-[#004B87] border-slate-300 rounded focus:ring-[#004B87] cursor-pointer"
                />
                <label
                  htmlFor="mrv-agree"
                  className="text-xs font-semibold text-slate-800 cursor-pointer select-none leading-relaxed"
                >
                  I have read and understood the above information and agree to proceed.
                </label>
              </div>

              {/* Action Button: Proceed to MRV (Aligned to Right Bottom Corner) */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  disabled={!hasAgreedMRV}
                  onClick={onSelectMRV}
                  className={`py-2.5 px-6 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                    hasAgreedMRV
                      ? 'bg-[#004B87] hover:bg-[#003866] active:scale-[0.99] text-white shadow-md cursor-pointer'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                  }`}
                >
                  <span>Proceed to MRV</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default WorkspaceSelectionModal;
