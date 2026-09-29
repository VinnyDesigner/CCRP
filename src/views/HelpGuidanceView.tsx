import React, { useState } from 'react';
import {
  HelpCircle,
  Building2,
  TrendingUp,
  History,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  Clock,
  Send,
  FileText,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Mail,
  Phone,
  MessageSquare,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  RotateCcw,
  Check,
  X,
  Search,
} from 'lucide-react';
import { useMRV } from '../context/MRVContext';
import { FieldTooltip } from '../components/ui/FieldTooltip';

interface WorkflowStepInfo {
  id: string;
  stepNumber: number;
  title: string;
  icon: React.ReactNode;
  viewKey: string;
  purpose: string;
  whatToDo: string[];
  afterSubmission: string[];
  badgeColor: string;
}

export const HelpGuidanceView: React.FC = () => {
  const { setActiveView } = useMRV();

  // Active interactive workflow step (Section 1)
  const [activeWorkflowStep, setActiveWorkflowStep] = useState<number>(1);

  // FAQ open/close accordion state (Section 4)
  const [openFaqIndices, setOpenFaqIndices] = useState<number[]>([0]);

  // Support Modal state (Section 5)
  const [isSupportModalOpen, setIsSupportModalOpen] = useState<boolean>(false);
  const [supportSubmitted, setSupportSubmitted] = useState<boolean>(false);
  const [supportSubject, setSupportSubject] = useState('');
  const [supportMessage, setSupportMessage] = useState('');

  // FAQ Search state
  const [faqSearchQuery, setFaqSearchQuery] = useState('');

  const toggleFaq = (index: number) => {
    setOpenFaqIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSupportSubmitted(true);
    setTimeout(() => {
      setSupportSubmitted(false);
      setIsSupportModalOpen(false);
      setSupportSubject('');
      setSupportMessage('');
    }, 2500);
  };

  // 4 Core Workflow Steps Data
  const WORKFLOW_STEPS: WorkflowStepInfo[] = [
    {
      id: 'registration',
      stepNumber: 1,
      title: 'Project Registration',
      icon: <Building2 className="w-5 h-5" />,
      viewKey: 'registration',
      badgeColor: 'from-[#004B87] to-[#006BB8]',
      purpose:
        'Establish the official statutory baseline for a new climate change initiative under the Abu Dhabi Climate Change Strategy framework.',
      whatToDo: [
        'Complete Step 1: Project Details (initiative name, description, entity, sub-entity, and geographic scope).',
        'Complete Step 2: Classification & Timeline (sector, initiative type, strategy objective, pillar, project manager details, and start/end dates).',
        'Complete Step 3: Indicators & Targets (select applicable performance metrics such as GHG reductions, clean energy capacity, or efficiency benchmarks).',
        'Save as Draft if still preparing, or click Submit Registration to send for EAD review.',
      ],
      afterSubmission: [
        'Initiative status changes to "Submitted" and enters the EAD verification queue.',
        'EAD climate change specialists evaluate project alignment, indicators, and methodology.',
        'Upon approval, status becomes "Approved", an official Project ID is generated, and the initiative is unlocked for periodic Project Data Entry.',
      ],
    },
    {
      id: 'data-entry',
      stepNumber: 2,
      title: 'Project Data Entry',
      icon: <TrendingUp className="w-5 h-5" />,
      viewKey: 'annual-emission-data',
      badgeColor: 'from-[#0284C7] to-[#0369A1]',
      purpose:
        'Submit periodic operational progress reports, milestone achievements, budget execution status, and quantified GHG emissions reduction data.',
      whatToDo: [
        'Select your approved project from the Project Data Entry landing table.',
        'Step 1 (Report Details): Select reporting period (e.g. H1/H2 for Mitigation or Q1–Q4 for Adaptation).',
        'Step 2 (Progress & Project Data): Enter planned vs. actual progress percentages, project phase, budget allocation, key deliverables, and challenges.',
        'Step 3 (GHG Emissions): Input planned vs. actual GHG reductions (mandatory for Mitigation, optional for Cross Cutting).',
        'Step 4 (Supporting Documents): Attach verification evidence (mandatory for final 100% completion submissions) and Submit.',
      ],
      afterSubmission: [
        'Performance data status updates to "Submitted".',
        'EAD verifies the reported outputs, deliverables, and emission reduction calculations.',
        'Approved performance reports automatically feed into Emirate-wide Climate Change Strategy progress dashboards.',
      ],
    },
    {
      id: 'amendments',
      stepNumber: 3,
      title: 'Amendments',
      icon: <History className="w-5 h-5" />,
      viewKey: 'amendments',
      badgeColor: 'from-purple-600 to-indigo-600',
      purpose:
        'Request formal administrative, methodological, target, or timeline modifications to an already approved project baseline without duplicating records.',
      whatToDo: [
        'Open the Amendments module and locate the approved initiative.',
        'Click "+ Create Amendment" or "Edit Amendment" to open the pre-populated baseline details.',
        'Update modified fields (such as revised end date, updated decarbonization target, or modified scope).',
        'Provide an official justification explaining the operational rationale for the amendment.',
        'Submit the amendment request for regulatory review.',
      ],
      afterSubmission: [
        'Amendment status updates to "Submitted" (Under Review).',
        'EAD reviews the justification and changes against strategy benchmarks.',
        'Upon approval, the system updates the master initiative baseline seamlessly.',
      ],
    },
    {
      id: 'reports',
      stepNumber: 4,
      title: 'Reports',
      icon: <BarChart3 className="w-5 h-5" />,
      viewKey: 'reports',
      badgeColor: 'from-emerald-600 to-teal-700',
      purpose:
        'Analyze aggregated climate strategy performance, generate statutory compliance statements, and export verified initiative reports.',
      whatToDo: [
        'Navigate to the Reports section from the left sidebar.',
        'Filter initiatives by Strategy Pillar (Mitigation, Adaptation, Economic Diversification, Cross Cutting), Entity, or Status.',
        'View aggregated GHG reduction achievements against the 2027 Strategy baseline.',
        'Export executive summary reports (PDF / Excel) for committee presentations and regulatory audits.',
      ],
      afterSubmission: [
        'Published reports serve as certified statutory records for Abu Dhabi Climate Change reporting.',
        'Data feeds directly into high-level environmental performance dashboards and UAE Net Zero 2050 monitoring.',
      ],
    },
  ];

  // FAQ Questions and Answers (Section 4)
  const FAQ_ITEMS = [
    {
      question: 'How do I register a new project?',
      answer:
        'Navigate to "Project Registration" in the left sidebar and click the "+ Add New Project" button in the top-right corner. Complete the 3-step registration form: (1) Project Details, (2) Project Classification & Timeline, and (3) Indicators & Targets. You can click "Save Draft" to save your progress or "Submit Registration" to submit directly for EAD review.',
      category: 'Registration',
    },
    {
      question: 'Where can I edit a draft project?',
      answer:
        'Go to the "Project Registration" or "Project Data Entry" overview table on the landing page. Look for records with the grey "Draft" status badge. In the Actions column on the right, click the Pencil (Edit) icon to open and modify your draft. You can also delete unwanted drafts using the Trash (Delete) icon.',
      category: 'Editing',
    },
    {
      question: 'What happens after submitting project data?',
      answer:
        'Once you submit periodic performance data in Project Data Entry, the record status updates to "Submitted" and enters the EAD verification queue. EAD climate specialists will review the progress percentages, deliverables, and greenhouse gas reduction calculations. When verified, the status changes to "Approved" and feeds into Strategy performance analytics.',
      category: 'Data Entry',
    },
    {
      question: 'When should I create an amendment?',
      answer:
        'An amendment should be created whenever there is a substantial modification to an approved project baseline—such as changes in completion timeline, adjusted annual GHG targets, updated supporting entities, or revised strategic indicators. Go to "Amendments", select your project, provide the updated details along with a justification, and submit for review.',
      category: 'Amendments',
    },
    {
      question: 'What does Correction Requested mean?',
      answer:
        'If your submission receives a "Correction Requested" status, it means the EAD reviewer evaluated your submission and identified specific items requiring revision or additional documentation. Click "View" or "Edit" on the project to inspect the reviewer\'s official remarks, make the requested adjustments, and click Submit to return the record for review.',
      category: 'Status',
    },
    {
      question: 'Where can I view submitted reports?',
      answer:
        'You can view all submitted and approved performance reports in the "Reports" section from the left sidebar. Additionally, you can inspect individual project histories from the overview tables or use the "Export Report" button on the Dashboard to download PDF summaries.',
      category: 'Reports',
    },
  ];

  const filteredFaqs = FAQ_ITEMS.filter(
    (item) =>
      item.question.toLowerCase().includes(faqSearchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(faqSearchQuery.toLowerCase())
  );

  const selectedStepData = WORKFLOW_STEPS.find((s) => s.stepNumber === activeWorkflowStep) || WORKFLOW_STEPS[0];

  return (
    <div className="h-full flex flex-col overflow-hidden font-sans py-1 animate-fade-in">
      {/* =================================================================== */}
      {/* STICKY TOP HEADER */}
      {/* =================================================================== */}
      <div className="flex-shrink-0 pb-3 pt-0.5 flex flex-wrap items-center justify-between gap-3 min-w-0 border-b border-slate-200/80 mb-3.5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[20px] font-bold font-display text-[#004B87] tracking-tight">
              Help & Guide
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#EBF3FA] text-[#004B87] border border-[#004B87]/20">
              CCRP Portal Guide
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Everything you need to understand and complete the Climate Change project workflow.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsSupportModalOpen(true)}
            className="h-9 px-4 bg-gradient-to-r from-[#004B87] to-[#006BB8] text-white rounded-[8px] text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#004B87]/25 hover:shadow-lg hover:from-[#003d6e] hover:to-[#005c9e] transition-all cursor-pointer active:scale-95"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Contact Support</span>
          </button>
        </div>
      </div>

      {/* =================================================================== */}
      {/* SCROLLABLE BODY */}
      {/* =================================================================== */}
      <div className="flex-1 min-h-0 overflow-y-auto space-y-6 pr-1.5 custom-scrollbar pb-6">
        {/* ================================================================= */}
        {/* SECTION 1: HOW THE SYSTEM WORKS (INTERACTIVE VISUAL WORKFLOW) */}
        {/* ================================================================= */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-[15px] font-bold font-display text-[#004B87]">
                Section 1 — How the system works
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Click on any step below to explore its purpose, submission requirements, and review pipeline.
              </p>
            </div>
            <span className="text-[11px] font-bold text-slate-400 self-start sm:self-auto">
              Step {activeWorkflowStep} of 4 Selected
            </span>
          </div>

          {/* Interactive Stepper Navigation Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 mb-5">
            {WORKFLOW_STEPS.map((step) => {
              const isSelected = activeWorkflowStep === step.stepNumber;
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setActiveWorkflowStep(step.stepNumber)}
                  className={`relative p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                    isSelected
                      ? 'bg-gradient-to-br from-[#EBF3FA] to-[#F0F8FF] border-[#004B87] shadow-sm ring-2 ring-[#004B87]/20'
                      : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center text-white shrink-0 shadow-xs transition-all ${
                      isSelected ? `bg-gradient-to-br ${step.badgeColor} scale-105` : 'bg-slate-400'
                    }`}
                  >
                    {step.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Step {step.stepNumber}
                    </div>
                    <div
                      className={`text-xs font-bold truncate ${
                        isSelected ? 'text-[#004B87]' : 'text-slate-700'
                      }`}
                    >
                      {step.title}
                    </div>
                  </div>
                  {isSelected && (
                    <div className="w-2 h-2 rounded-full bg-[#004B87] shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Selected Step Explanation Detail Card */}
          <div className="rounded-xl border border-sky-200/80 bg-gradient-to-br from-[#F8FAFD] via-white to-[#F0F7FD] p-4 sm:p-5 shadow-xs animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-200/80 mb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${selectedStepData.badgeColor} text-white flex items-center justify-center shadow-xs shrink-0`}
                >
                  {selectedStepData.icon}
                </div>
                <div>
                  <div className="text-[11px] font-bold text-[#004B87] uppercase tracking-wider">
                    Workflow Step {selectedStepData.stepNumber}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {selectedStepData.title}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveView(selectedStepData.viewKey as any)}
                className="h-8 px-3.5 bg-white border border-[#004B87] text-[#004B87] hover:bg-[#004B87] hover:text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer self-start sm:self-auto shrink-0"
              >
                <span>Go to {selectedStepData.title}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Purpose */}
            <div className="mb-4">
              <div className="text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#004B87]" />
                <span>Purpose</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pl-5 font-medium">
                {selectedStepData.purpose}
              </p>
            </div>

            {/* Two Column Breakdown: What to do vs After submission */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* What the user needs to do */}
              <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs">
                <h4 className="text-xs font-bold text-slate-800 mb-2.5 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>What you need to do</span>
                </h4>
                <ul className="space-y-2 text-xs text-slate-600">
                  {selectedStepData.whatToDo.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* What happens after submission */}
              <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs">
                <h4 className="text-xs font-bold text-slate-800 mb-2.5 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#004B87] shrink-0" />
                  <span>What happens after submission</span>
                </h4>
                <ul className="space-y-2 text-xs text-slate-600">
                  {selectedStepData.afterSubmission.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-sky-50 text-[#004B87] text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        ✓
                      </span>
                      <span className="leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* SECTION 2: QUICK HELP (4 CARDS) */}
        {/* ================================================================= */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 sm:p-5">
          <div className="mb-4 pb-3 border-b border-slate-100">
            <h2 className="text-[15px] font-bold font-display text-[#004B87]">
              Section 2 — Quick Help
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Direct access and concise summaries for all four core Climate Change project modules.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {/* Card 1: Project Registration */}
            <div className="rounded-xl border border-slate-200/90 bg-slate-50/50 p-4 flex flex-col justify-between hover:bg-white hover:border-[#004B87]/40 hover:shadow-sm transition-all group">
              <div>
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#004B87] to-[#006BB8] text-white flex items-center justify-center shadow-xs mb-3 group-hover:scale-105 transition-transform">
                  <Building2 className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-slate-800 mb-1">
                  Project Registration
                </h3>
                <p className="text-[11.5px] text-slate-500 leading-relaxed">
                  Register new strategic initiatives, define baseline scopes, governance entities, strategy pillars, and 2023–2027 statutory targets.
                </p>
              </div>
              <div className="pt-3 mt-3 border-t border-slate-200/60 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setActiveWorkflowStep(1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-xs font-bold text-[#004B87] hover:text-[#003d6e] flex items-center gap-1 cursor-pointer"
                >
                  <span>Learn more</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveView('registration')}
                  className="text-[11px] font-bold text-slate-400 hover:text-slate-700 cursor-pointer"
                  title="Open Module"
                >
                  Open →
                </button>
              </div>
            </div>

            {/* Card 2: Project Data Entry */}
            <div className="rounded-xl border border-slate-200/90 bg-slate-50/50 p-4 flex flex-col justify-between hover:bg-white hover:border-[#004B87]/40 hover:shadow-sm transition-all group">
              <div>
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#0284C7] to-[#0369A1] text-white flex items-center justify-center shadow-xs mb-3 group-hover:scale-105 transition-transform">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-slate-800 mb-1">
                  Project Data Entry
                </h3>
                <p className="text-[11.5px] text-slate-500 leading-relaxed">
                  Submit periodic reports, milestone progress (actual vs. planned), budget status, qualitative outcomes, and GHG emission reductions.
                </p>
              </div>
              <div className="pt-3 mt-3 border-t border-slate-200/60 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setActiveWorkflowStep(2);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-xs font-bold text-[#004B87] hover:text-[#003d6e] flex items-center gap-1 cursor-pointer"
                >
                  <span>Learn more</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveView('annual-emission-data')}
                  className="text-[11px] font-bold text-slate-400 hover:text-slate-700 cursor-pointer"
                  title="Open Module"
                >
                  Open →
                </button>
              </div>
            </div>

            {/* Card 3: Amendments */}
            <div className="rounded-xl border border-slate-200/90 bg-slate-50/50 p-4 flex flex-col justify-between hover:bg-white hover:border-[#004B87]/40 hover:shadow-sm transition-all group">
              <div>
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-xs mb-3 group-hover:scale-105 transition-transform">
                  <History className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-slate-800 mb-1">
                  Amendments
                </h3>
                <p className="text-[11.5px] text-slate-500 leading-relaxed">
                  Request formal target updates, milestone timeline adjustments, or scope revisions for approved projects with mandatory justification.
                </p>
              </div>
              <div className="pt-3 mt-3 border-t border-slate-200/60 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setActiveWorkflowStep(3);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-xs font-bold text-[#004B87] hover:text-[#003d6e] flex items-center gap-1 cursor-pointer"
                >
                  <span>Learn more</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveView('amendments')}
                  className="text-[11px] font-bold text-slate-400 hover:text-slate-700 cursor-pointer"
                  title="Open Module"
                >
                  Open →
                </button>
              </div>
            </div>

            {/* Card 4: Reports */}
            <div className="rounded-xl border border-slate-200/90 bg-slate-50/50 p-4 flex flex-col justify-between hover:bg-white hover:border-[#004B87]/40 hover:shadow-sm transition-all group">
              <div>
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center shadow-xs mb-3 group-hover:scale-105 transition-transform">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-slate-800 mb-1">
                  Reports
                </h3>
                <p className="text-[11.5px] text-slate-500 leading-relaxed">
                  View aggregated climate change decarbonization metrics, generate compliance statements, and export verified executive summaries.
                </p>
              </div>
              <div className="pt-3 mt-3 border-t border-slate-200/60 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setActiveWorkflowStep(4);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-xs font-bold text-[#004B87] hover:text-[#003d6e] flex items-center gap-1 cursor-pointer"
                >
                  <span>Learn more</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveView('reports')}
                  className="text-[11px] font-bold text-slate-400 hover:text-slate-700 cursor-pointer"
                  title="Open Module"
                >
                  Open →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* SECTION 3: STATUS GUIDE */}
        {/* ================================================================= */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 sm:p-5">
          <div className="mb-4 pb-3 border-b border-slate-100">
            <h2 className="text-[15px] font-bold font-display text-[#004B87]">
              Section 3 — Status Guide
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Reference guide explaining the 5 standardized lifecycle workflow statuses used across the portal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* Status 1: Draft */}
            <div className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/40 hover:bg-white hover:border-slate-300 transition-colors">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-normal bg-slate-100 text-slate-700 border border-slate-200 inline-block">
                  Draft
                </span>
                <span className="text-[10px] font-semibold text-slate-400">Preparation</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                The record is saved locally in your workspace. You can edit all fields freely or delete the draft. It has not yet been submitted for EAD review.
              </p>
            </div>

            {/* Status 2: Submitted */}
            <div className="p-3.5 rounded-xl border border-sky-100 bg-[#E0EEFA]/20 hover:bg-[#E0EEFA]/35 transition-colors">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#E0EEFA] text-[#0284C7] border border-sky-200/60 inline-block">
                  Submitted
                </span>
                <span className="text-[10px] font-semibold text-sky-600">Lodged</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                The submission has been officially lodged with EAD. It is locked from immediate modification while queued for review assignment.
              </p>
            </div>

            {/* Status 3: Under Review */}
            <div className="p-3.5 rounded-xl border border-sky-100 bg-sky-50/30 hover:bg-sky-50/50 transition-colors">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-50 text-sky-700 border border-sky-200/60 inline-block">
                  Under Review
                </span>
                <span className="text-[10px] font-semibold text-sky-700">Evaluation</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                EAD climate change technical specialists are actively evaluating project data, classifications, and indicators against statutory benchmarks.
              </p>
            </div>

            {/* Status 4: Correction Requested */}
            <div className="p-3.5 rounded-xl border border-amber-200/80 bg-amber-50/30 hover:bg-amber-50/50 transition-colors">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200/60 inline-block">
                  Correction Requested
                </span>
                <span className="text-[10px] font-semibold text-amber-700">Action Needed</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                The reviewer identified missing information or revision requirements. Open the record to read reviewer comments, update the data, and resubmit.
              </p>
            </div>

            {/* Status 5: Approved */}
            <div className="p-3.5 rounded-xl border border-emerald-200/80 bg-[#E8F8F0]/30 hover:bg-[#E8F8F0]/50 transition-colors">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#E8F8F0] text-[#00875A] border border-[#00875A]/25 inline-block">
                  Approved
                </span>
                <span className="text-[10px] font-semibold text-emerald-700">Published</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                The submission has satisfied all statutory requirements. It is officially certified, published to the registry, and established as the active baseline.
              </p>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* SECTION 4: FREQUENTLY ASKED QUESTIONS (ACCORDION) */}
        {/* ================================================================= */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-[15px] font-bold font-display text-[#004B87]">
                Section 4 — Frequently Asked Questions
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Common questions and practical answers regarding project submissions, editing, and approvals.
              </p>
            </div>

            {/* FAQ Search Bar */}
            <div className="relative w-full sm:w-60">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search FAQs..."
                value={faqSearchQuery}
                onChange={(e) => setFaqSearchQuery(e.target.value)}
                className="w-full h-8 pl-8 pr-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#004B87] focus:bg-white"
              />
            </div>
          </div>

          <div className="space-y-2.5">
            {filteredFaqs.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-400 font-medium">
                No questions found matching "{faqSearchQuery}".
              </div>
            ) : (
              filteredFaqs.map((faq, idx) => {
                const isOpen = openFaqIndices.includes(idx);
                return (
                  <div
                    key={idx}
                    className="border border-slate-200/80 rounded-xl overflow-hidden transition-all bg-white"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(idx)}
                      className="w-full px-4 py-3 text-left flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors cursor-pointer select-none"
                    >
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#EBF3FA] text-[#004B87] text-[11px] font-bold flex items-center justify-center shrink-0">
                          Q
                        </span>
                        <span>{faq.question}</span>
                      </span>
                      <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                        {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </div>
                    </button>

                    {isOpen && (
                      <div className="px-4 pb-3.5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/40 animate-fade-in pl-11">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ================================================================= */}
        {/* SECTION 5: NEED MORE HELP? */}
        {/* ================================================================= */}
        <div className="bg-gradient-to-r from-[#003B6D] via-[#004B87] to-[#006BB8] rounded-2xl p-5 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white shrink-0 border border-white/20">
              <HelpCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-display text-white">
                Need assistance?
              </h3>
              <p className="text-xs text-white/85 mt-0.5 max-w-xl leading-relaxed">
                Contact the Climate Change support team for help with your project submission.
              </p>
              <div className="flex items-center gap-4 mt-2 text-[11px] text-white/75 flex-wrap">
                <span className="flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  <span>ccrp-support@ead.gov.ae</span>
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  <span>+971 2 693 4567</span>
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>Mon – Fri, 7:30 AM – 3:30 PM</span>
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsSupportModalOpen(true)}
            className="h-9 px-4 bg-white text-[#004B87] hover:bg-sky-50 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer shrink-0 active:scale-95"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Contact Support</span>
          </button>
        </div>
      </div>

      {/* =================================================================== */}
      {/* SUPPORT MODAL */}
      {/* =================================================================== */}
      {isSupportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-5 space-y-4 animate-scale-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#EBF3FA] text-[#004B87] flex items-center justify-center">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">
                    Contact Climate Change Support
                  </h3>
                  <p className="text-[10.5px] text-slate-500">
                    Environment Agency – Abu Dhabi (EAD)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsSupportModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {supportSubmitted ? (
              <div className="py-6 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-xs font-bold text-slate-800">
                  Support Ticket Logged
                </h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Thank you. Your inquiry has been routed to the CCRP technical team. We will contact you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSupportSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Inquiry Subject
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Guidance on GHG indicator calculation"
                    value={supportSubject}
                    onChange={(e) => setSupportSubject(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-[#004B87] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Describe your question or issue
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Provide specific details regarding your project registration, data entry report, or amendment..."
                    value={supportMessage}
                    onChange={(e) => setSupportMessage(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-[#004B87] focus:bg-white"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsSupportModalOpen(false)}
                    className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-[#004B87] to-[#006BB8] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#004B87]/20 hover:from-[#003d6e] hover:to-[#005c9e] transition-all cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Inquiry</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HelpGuidanceView;
