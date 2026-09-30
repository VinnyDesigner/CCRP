import React from 'react';
import { ArrowRight } from 'lucide-react';

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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-5 bg-slate-900/70 backdrop-blur-xs animate-fade-in font-sans">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden text-slate-800 animate-scale-in">
        
        {/* ================================================================= */}
        {/* MODAL HEADER                                                      */}
        {/* ================================================================= */}
        <div className="px-6 pt-6 pb-2 text-left shrink-0">
          <h2 className="text-[20px] font-bold font-display tracking-tight text-slate-900 leading-snug">
            Choose Your Workspace
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-[2px]">
            Select the platform you want to access.
          </p>
        </div>

        {/* ================================================================= */}
        {/* WORKSPACE SELECTION CARDS                                         */}
        {/* ================================================================= */}
        <div className="p-6 pt-3 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          
          {/* 1. MRV Workspace Card (Light Blue) */}
          <button
            type="button"
            onClick={onSelectMRV}
            className="group text-left p-4 rounded-xl border-2 border-blue-200/80 bg-[#EBF5FF] hover:bg-[#DDF0FF] hover:border-[#004B87] shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between min-h-[110px]"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#004B87] transition-colors">
                  MRV
                </h3>
                <div className="w-6 h-6 rounded-full bg-white/90 group-hover:bg-[#004B87] group-hover:text-white flex items-center justify-center shrink-0 transition-all text-slate-500 shadow-2xs">
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Environmental Monitoring, Reporting & Verification
              </p>
            </div>
          </button>

          {/* 2. Project Tracker Workspace Card (Light Green) */}
          <button
            type="button"
            onClick={onSelectProjectTracker}
            className="group text-left p-4 rounded-xl border-2 border-emerald-200/80 bg-[#EAF8F0] hover:bg-[#D8F4E3] hover:border-emerald-600 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between min-h-[110px]"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  Project Tracker
                </h3>
                <div className="w-6 h-6 rounded-full bg-white/90 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center shrink-0 transition-all text-slate-500 shadow-2xs">
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Register, monitor, and report climate change projects and initiatives.
              </p>
            </div>
          </button>

        </div>

      </div>
    </div>
  );
};

export default WorkspaceSelectionModal;
