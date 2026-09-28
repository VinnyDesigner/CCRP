import React, { useState, useRef, useMemo } from 'react';
import {
  Plus,
  X,
  CheckCircle2,
  AlertCircle,
  Send,
  Lock,
  ShieldCheck,
  Bookmark,
  ArrowRight,
  Info,
  Upload,
  FileText,
  Eye,
  ChevronDown,
  Building2,
  Calendar,
  Clock,
  ArrowLeft,
  Edit,
  Search,
  Filter,
  Check,
  RotateCcw,
  Layers,
  Flame,
  Activity,
  BarChart3,
  Trash2,
  ChevronLeft,
  ChevronRight,
  XCircle,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { useMRV } from '../context/MRVContext';
import { FieldTooltip } from '../components/ui/FieldTooltip';
import { SortTriangles } from '../components/ui/SortTriangles';
import emptyFolderIcon from '../assets/empty-folder-icon.png';
import {
  PerformanceReportData,
  CCRP_PROJECT_PHASES,
  CCRP_REPORT_STATUSES,
  CCRP_BUDGET_TYPES,
  CCRP_BUDGET_STATUSES,
  CCRP_PILLARS,
  CCRP_REPORTING_PERIODS_BY_PILLAR,
  CCRP_APPROVED_INITIATIVES,
  CCRPApprovedInitiative,
  INITIAL_FACILITY_EMISSIONS,
} from '../data/facilityEmissionsData';

const PERFORMANCE_REPORT_STEPS = [
  { id: 'report-details', stepNumber: 1, title: 'Report Details' },
  { id: 'progress-status', stepNumber: 2, title: 'Progress & Project Data' },
  { id: 'ghg-emissions', stepNumber: 3, title: 'GHG Emissions' },
  { id: 'supporting-submit', stepNumber: 4, title: 'Supporting Documents & Submit' },
] as const;

type StepTabId = 'report-details' | 'progress-status' | 'ghg-emissions' | 'supporting-submit';

export const AnnualEmissionDataView: React.FC = () => {
  const {
    activeFacility,
    setActiveView,
    workflowState,
    currentRole,
    facilities,
    setActiveFacilityId,
    facilityEmissions,
    setFacilityEmissions,
    operatorEmissionIds,
    setOperatorEmissionIds,
    operatorFacilityIds,
    facilityRegistrations,
  } = useMRV();

  const isFacilityOperator = currentRole === 'FACILITY_OPERATOR';
  const isEadReviewerOrAdmin = currentRole === 'EAD_REVIEWER' || (currentRole as string) === 'ADMIN';

  // VIEW MODE: 'table' (Overview Table) | 'form' (4-Step Edit Form) | 'view' (Read-Only Inspection)
  const [viewMode, setViewMode] = useState<'table' | 'form' | 'view'>('table');
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>(activeFacility?.id || 'fac-1');

  // Overview Table Search & Filters
  const [tableSearchTerm, setTableSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [pillarFilter, setPillarFilter] = useState<string>('ALL');
  const [deletedEmissionIds, setDeletedEmissionIds] = useState<string[]>([]);

  // Form Tab Navigation
  const [activeTab, setActiveTab] = useState<StepTabId>('report-details');

  const [isSavedNotice, setIsSavedNotice] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState('Data Saved Successfully!');
  const [reviewerComments, setReviewerComments] = useState('');
  const [activeReviewModal, setActiveReviewModal] = useState<'approve' | 'reject' | 'revert' | null>(null);

  // Active Report Form Data
  const currentRecord: PerformanceReportData =
    facilityEmissions[selectedFacilityId] ||
    facilityEmissions['fac-1'] || {
      initiativeName: CCRP_APPROVED_INITIATIVES[0].name,
      initiativeId: CCRP_APPROVED_INITIATIVES[0].initiativeCode,
      entity: CCRP_APPROVED_INITIATIVES[0].entity,
      pillar: CCRP_APPROVED_INITIATIVES[0].pillar,
      reportingCadence: CCRP_APPROVED_INITIATIVES[0].cadence,
      progressReportPeriod: 'Semiannual 1 (H1)',
      projectPhase: 'Implementation',
      status: 'In Progress',
      workflowStatus: 'Draft',
      plannedProgress: 75,
      actualProgress: 68,
      budget: 'AED 3,200,000,000',
      budgetType: 'CAPEX',
      budgetStatus: 'Allocated',
      challenges: '',
      raiseToCommittee: 'No',
      activitiesOutcomesOutput: '',
      comments: '',
      plannedGhgReduction: '142,800',
      actualAnnualEmissionReduction: '138,500',
      supportingDocsFiles: [],
      submittedDate: null,
      updatedDate: null,
      eadCorrectionDate: null,
    };

  // Local Form States
  const [formInitiativeId, setFormInitiativeId] = useState<string>(
    currentRecord.initiativeId || CCRP_APPROVED_INITIATIVES[0].initiativeCode
  );
  const [formInitiativeName, setFormInitiativeName] = useState<string>(
    currentRecord.initiativeName || CCRP_APPROVED_INITIATIVES[0].name
  );
  const [formEntity, setFormEntity] = useState<string>(
    currentRecord.entity || CCRP_APPROVED_INITIATIVES[0].entity
  );
  const [formPillar, setFormPillar] = useState<'Adaptation' | 'Mitigation' | 'Economic Diversification' | 'Cross Cutting'>(
    currentRecord.pillar || 'Mitigation'
  );
  const [formCadence, setFormCadence] = useState<'Quarterly' | 'Semiannual'>(
    currentRecord.reportingCadence || 'Semiannual'
  );
  const [formProgressReportPeriod, setFormProgressReportPeriod] = useState<string>(
    currentRecord.progressReportPeriod || 'Semiannual 1 (H1)'
  );
  const [formProjectPhase, setFormProjectPhase] = useState<'Design' | 'Implementation' | 'Operation'>(
    currentRecord.projectPhase || 'Implementation'
  );
  const [formReportStatus, setFormReportStatus] = useState<'Not Started' | 'In Progress' | 'On Hold' | 'Completed'>(
    currentRecord.status || 'In Progress'
  );
  const [formPlannedProgress, setFormPlannedProgress] = useState<number | string>(
    currentRecord.plannedProgress !== undefined ? currentRecord.plannedProgress : 75
  );
  const [formActualProgress, setFormActualProgress] = useState<number | string>(
    currentRecord.actualProgress !== undefined ? currentRecord.actualProgress : 68
  );
  const [formBudget, setFormBudget] = useState<string | number>(
    currentRecord.budget !== undefined ? currentRecord.budget : ''
  );
  const [formBudgetType, setFormBudgetType] = useState<string>(
    currentRecord.budgetType || 'CAPEX'
  );
  const [formBudgetStatus, setFormBudgetStatus] = useState<string>(
    currentRecord.budgetStatus || 'Allocated'
  );
  const [formChallenges, setFormChallenges] = useState<string>(
    currentRecord.challenges || ''
  );
  const [formRaiseToCommittee, setFormRaiseToCommittee] = useState<'Yes' | 'No'>(
    currentRecord.raiseToCommittee === 'Yes' || currentRecord.raiseToCommittee === true ? 'Yes' : 'No'
  );
  const [formActivitiesOutcomesOutput, setFormActivitiesOutcomesOutput] = useState<string>(
    currentRecord.activitiesOutcomesOutput || ''
  );
  const [formComments, setFormComments] = useState<string>(
    currentRecord.comments || ''
  );
  const [formPlannedGhgReduction, setFormPlannedGhgReduction] = useState<number | string>(
    currentRecord.plannedGhgReduction || ''
  );
  const [formActualAnnualEmissionReduction, setFormActualAnnualEmissionReduction] = useState<number | string>(
    currentRecord.actualAnnualEmissionReduction || ''
  );
  const [formSupportingDocs, setFormSupportingDocs] = useState<
    { id: string; name: string; size: string; uploadDate: string }[]
  >(currentRecord.supportingDocsFiles || []);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // When initiative changes in form, sync entity, pillar, cadence and report period options
  const handleInitiativeChange = (initiativeCode: string) => {
    const matched = CCRP_APPROVED_INITIATIVES.find((init) => init.initiativeCode === initiativeCode);
    if (matched) {
      setFormInitiativeId(matched.initiativeCode);
      setFormInitiativeName(matched.name);
      setFormEntity(matched.entity);
      setFormPillar(matched.pillar);
      setFormCadence(matched.cadence);
      const defaultPeriod =
        matched.cadence === 'Quarterly'
          ? 'Q1'
          : CCRP_REPORTING_PERIODS_BY_PILLAR[matched.pillar]?.[0] || 'Semiannual 1 (H1)';
      setFormProgressReportPeriod(defaultPeriod);
    }
  };

  // Helper to load record data into local form states
  const loadRecordData = (rec: any) => {
    const initCode = rec.initiativeId || rec.facilityId || CCRP_APPROVED_INITIATIVES[0].initiativeCode;
    const matched = CCRP_APPROVED_INITIATIVES.find((i) => i.initiativeCode === initCode);

    setFormInitiativeId(initCode);
    setFormInitiativeName(rec.initiativeName || rec.facilityName || matched?.name || CCRP_APPROVED_INITIATIVES[0].name);
    setFormEntity(rec.entity || rec.operatorName || matched?.entity || CCRP_APPROVED_INITIATIVES[0].entity);
    setFormPillar(rec.pillar || matched?.pillar || 'Mitigation');
    setFormCadence(rec.reportingCadence || matched?.cadence || 'Semiannual');
    setFormProgressReportPeriod(rec.progressReportPeriod || (rec.reportingYear ? `Q1` : 'Semiannual 1 (H1)'));
    setFormProjectPhase(rec.projectPhase || 'Implementation');
    setFormReportStatus(rec.status || 'In Progress');
    setFormPlannedProgress(rec.plannedProgress !== undefined ? rec.plannedProgress : 75);
    setFormActualProgress(rec.actualProgress !== undefined ? rec.actualProgress : 68);
    setFormBudget(rec.budget !== undefined ? rec.budget : '');
    setFormBudgetType(rec.budgetType || 'CAPEX');
    setFormBudgetStatus(rec.budgetStatus || 'Allocated');
    setFormChallenges(rec.challenges || '');
    setFormRaiseToCommittee(rec.raiseToCommittee === 'Yes' || rec.raiseToCommittee === true ? 'Yes' : 'No');
    setFormActivitiesOutcomesOutput(rec.activitiesOutcomesOutput || '');
    setFormComments(rec.comments || '');
    setFormPlannedGhgReduction(rec.plannedGhgReduction || rec.totalEmissions || '');
    setFormActualAnnualEmissionReduction(rec.actualAnnualEmissionReduction || rec.totalScope1 || '');
    setFormSupportingDocs(rec.supportingDocsFiles || []);
  };

  const updateCurrentRecord = (updater: (prev: any) => any) => {
    setFacilityEmissions((prev) => {
      const existing = prev[selectedFacilityId] || currentRecord;
      return {
        ...prev,
        [selectedFacilityId]: updater(existing),
      };
    });
  };

  // Determine all performance reports with sample demo records
  const allReportsList = useMemo(() => {
    const allKeys = Array.from(
      new Set([
        ...Object.keys(INITIAL_FACILITY_EMISSIONS),
        ...Object.keys(facilityEmissions),
      ])
    ).filter((id) => !deletedEmissionIds.includes(id));

    return allKeys
      .map((id) => {
        const rec = (facilityEmissions[id] || (INITIAL_FACILITY_EMISSIONS as any)[id]) as PerformanceReportData;
        if (!rec) return null;

        const initName = rec.initiativeName || rec.facilityName || 'Registered Initiative';
        const initId = rec.initiativeId || rec.facilityId || '—';
        const entity = rec.entity || rec.operatorName || 'Department of Energy (DoE)';
        const pillar = rec.pillar || 'Mitigation';
        const rawWfStatus = String(rec.workflowStatus || rec.status || 'Draft');

        const normalizeStatus = (st: string) => {
          if (st === 'Approved' || st === 'Approved / Published' || st === 'Verified') return 'Approved';
          if (st === 'Returned for Correction' || st === 'Correction Required' || st === 'Reverted' || st === 'Correction Requested') return 'Correction Requested';
          if (st === 'Under EAD Review' || st === 'Under Review') return 'Under Review';
          if (st === 'Submitted' || st.includes('Submitted')) return 'Submitted';
          return 'Draft';
        };
        const status = normalizeStatus(rawWfStatus);

        const rawPeriod = rec.progressReportPeriod || 'Semiannual 1 (H1)';
        const formatReportPeriod = (periodStr: string, pillarName: string) => {
          if (pillarName === 'Adaptation') {
            if (periodStr.includes('Q1') || periodStr === 'Quarter 1 (Q1)') return '2026 (Q1)';
            if (periodStr.includes('Q2') || periodStr === 'Quarter 2 (Q2)') return '2026 (Q2)';
            if (periodStr.includes('Q3') || periodStr === 'Quarter 3 (Q3)') return '2026 (Q3)';
            if (periodStr.includes('Q4') || periodStr === 'Quarter 4 (Q4)') return '2026 (Q4)';
            return `2026 (${periodStr || 'Q1'})`;
          }
          if (periodStr.includes('H1') || periodStr.includes('Semiannual 1') || periodStr === 'Semiannual 1 (H1)' || periodStr === 'H1') return '2026 (H1)';
          if (periodStr.includes('H2') || periodStr.includes('Semiannual 2') || periodStr === 'Semiannual 2 (H2)' || periodStr === 'H2') return '2026 (H2)';
          return `2026 (${periodStr || 'H1'})`;
        };
        const reportPeriod = formatReportPeriod(rawPeriod, pillar);

        const actualProg = rec.actualProgress !== undefined ? Number(rec.actualProgress) : 0;
        const plannedProg = rec.plannedProgress !== undefined ? Number(rec.plannedProgress) : 0;

        return {
          id,
          rec,
          name: initName,
          initiativeCode: initId,
          entity,
          pillar,
          status,
          rawStatus: rawWfStatus,
          reportPeriod,
          actualProg,
          plannedProg,
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);
  }, [facilityEmissions, deletedEmissionIds]);

  // Filtered Performance Reports for Overview Table
  const filteredTableList = useMemo(() => {
    return allReportsList.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(tableSearchTerm.toLowerCase()) ||
        item.initiativeCode.toLowerCase().includes(tableSearchTerm.toLowerCase()) ||
        item.entity.toLowerCase().includes(tableSearchTerm.toLowerCase()) ||
        item.pillar.toLowerCase().includes(tableSearchTerm.toLowerCase()) ||
        item.reportPeriod.toLowerCase().includes(tableSearchTerm.toLowerCase()) ||
        item.status.toLowerCase().includes(tableSearchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === 'ALL' ||
        item.status === statusFilter;

      const matchesPillar =
        pillarFilter === 'ALL' ||
        item.pillar === pillarFilter;

      return matchesSearch && matchesStatus && matchesPillar;
    });
  }, [allReportsList, tableSearchTerm, statusFilter, pillarFilter]);

  // Overview Table Sorting & Pagination
  type ReportSortField = 'index' | 'name' | 'id' | 'pillar' | 'period' | 'progress' | 'status';
  type SortDirection = 'asc' | 'desc';

  const [sortField, setSortField] = useState<ReportSortField>('index');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (field: ReportSortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(7);

  const sortedTableList = useMemo(() => {
    if (sortField === 'index') {
      return sortDirection === 'asc' ? filteredTableList : [...filteredTableList].reverse();
    }
    return [...filteredTableList].sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      const idA = a.initiativeCode.toLowerCase();
      const idB = b.initiativeCode.toLowerCase();
      const pillarA = a.pillar.toLowerCase();
      const pillarB = b.pillar.toLowerCase();
      const periodA = a.reportPeriod.toLowerCase();
      const periodB = b.reportPeriod.toLowerCase();
      const progA = a.actualProg;
      const progB = b.actualProg;
      const statusA = a.status.toLowerCase();
      const statusB = b.status.toLowerCase();

      let cmp = 0;
      if (sortField === 'name') cmp = nameA.localeCompare(nameB);
      else if (sortField === 'id') cmp = idA.localeCompare(idB);
      else if (sortField === 'pillar') cmp = pillarA.localeCompare(pillarB);
      else if (sortField === 'period') cmp = periodA.localeCompare(periodB);
      else if (sortField === 'progress') cmp = progA - progB;
      else if (sortField === 'status') cmp = statusA.localeCompare(statusB);

      return sortDirection === 'asc' ? cmp : -cmp;
    });
  }, [filteredTableList, sortField, sortDirection]);

  const totalPages = Math.ceil(sortedTableList.length / itemsPerPage) || 1;

  const paginatedReports = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedTableList.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedTableList, currentPage, itemsPerPage]);

  // File Upload Handler for Step 4
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const nowStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const newItems = Array.from(files).map((f) => ({
      id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      name: f.name,
      size: `${(f.size / (1024 * 1024)).toFixed(2)} MB`,
      uploadDate: nowStr,
    }));
    setFormSupportingDocs((prev) => [...prev, ...newItems]);
  };

  // Flow 1: Create New Performance Report
  const handleCreateReport = () => {
    const newReportId = `rep-${Date.now()}`;
    const defaultInit = CCRP_APPROVED_INITIATIVES[0];

    const blankReport: PerformanceReportData = {
      initiativeName: defaultInit.name,
      initiativeId: defaultInit.initiativeCode,
      entity: defaultInit.entity,
      pillar: defaultInit.pillar,
      reportingCadence: defaultInit.cadence,
      progressReportPeriod: 'Semiannual 1 (H1)',
      projectPhase: 'Implementation',
      status: 'In Progress',
      workflowStatus: 'Draft',
      plannedProgress: 0,
      actualProgress: 0,
      budget: '',
      budgetType: 'CAPEX',
      budgetStatus: 'Allocated',
      challenges: '',
      raiseToCommittee: 'No',
      activitiesOutcomesOutput: '',
      comments: '',
      plannedGhgReduction: '',
      actualAnnualEmissionReduction: '',
      supportingDocsFiles: [],
      submittedDate: null,
      updatedDate: null,
      eadCorrectionDate: null,
      isNew: true,

      facilityName: defaultInit.name,
      facilityId: defaultInit.initiativeCode,
      operatorName: defaultInit.entity,
      reportingYear: '2026',
    };

    setFacilityEmissions((prev) => ({
      ...prev,
      [newReportId]: blankReport,
    }));
    setSelectedFacilityId(newReportId);
    setOperatorEmissionIds((prev) => (prev.includes(newReportId) ? prev : [...prev, newReportId]));
    loadRecordData(blankReport);
    setActiveTab('report-details');
    setViewMode('form');
  };

  // Flow 2: Edit Existing Report
  const handleEditReport = (repId: string) => {
    setSelectedFacilityId(repId);
    setActiveFacilityId(repId);
    const rec = facilityEmissions[repId];
    if (rec) {
      loadRecordData(rec);
    }
    setActiveTab('report-details');
    setViewMode('form');
  };

  // Flow 3: View Existing Report in Read-Only Mode
  const handleViewReport = (repId: string) => {
    setSelectedFacilityId(repId);
    setActiveFacilityId(repId);
    const rec = facilityEmissions[repId];
    if (rec) {
      loadRecordData(rec);
      setReviewerComments(rec.reviewerComments || '');
    }
    setActiveTab('report-details');
    setViewMode('view');
  };

  // Save Draft Handler
  const handleSave = () => {
    const todayStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    setFacilityEmissions((prev) => ({
      ...prev,
      [selectedFacilityId]: {
        ...(prev[selectedFacilityId] || currentRecord),
        initiativeName: formInitiativeName,
        initiativeId: formInitiativeId,
        entity: formEntity,
        pillar: formPillar,
        reportingCadence: formCadence,
        progressReportPeriod: formProgressReportPeriod,
        projectPhase: formProjectPhase,
        status: formReportStatus,
        workflowStatus: 'Draft',
        plannedProgress: formPlannedProgress,
        actualProgress: formActualProgress,
        budget: formBudget,
        budgetType: formBudgetType,
        budgetStatus: formBudgetStatus,
        challenges: formChallenges,
        raiseToCommittee: formRaiseToCommittee,
        activitiesOutcomesOutput: formActivitiesOutcomesOutput,
        comments: formComments,
        plannedGhgReduction: formPlannedGhgReduction,
        actualAnnualEmissionReduction: formActualAnnualEmissionReduction,
        supportingDocsFiles: formSupportingDocs,
        updatedDate: todayStr,

        facilityName: formInitiativeName,
        facilityId: formInitiativeId,
        operatorName: formEntity,
      },
    }));
    setOperatorEmissionIds((prev) => (prev.includes(selectedFacilityId) ? prev : [...prev, selectedFacilityId]));
    setIsSavedNotice(true);
    setNoticeMessage('Performance Report Saved as Draft!');
    setTimeout(() => setIsSavedNotice(false), 3000);
    setViewMode('table');
  };

  // Submit Handler
  const handleSubmit = () => {
    // If completed/100%, evidence is mandatory
    const isCompleted = formReportStatus === 'Completed' || Number(formActualProgress) === 100;
    if (isCompleted && formSupportingDocs.length === 0) {
      alert('Supporting documents are mandatory for final/closing report submissions. Please attach evidence before submitting.');
      return;
    }

    const todayStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    setFacilityEmissions((prev) => ({
      ...prev,
      [selectedFacilityId]: {
        ...(prev[selectedFacilityId] || currentRecord),
        initiativeName: formInitiativeName,
        initiativeId: formInitiativeId,
        entity: formEntity,
        pillar: formPillar,
        reportingCadence: formCadence,
        progressReportPeriod: formProgressReportPeriod,
        projectPhase: formProjectPhase,
        status: formReportStatus,
        workflowStatus: 'Submitted',
        plannedProgress: formPlannedProgress,
        actualProgress: formActualProgress,
        budget: formBudget,
        budgetType: formBudgetType,
        budgetStatus: formBudgetStatus,
        challenges: formChallenges,
        raiseToCommittee: formRaiseToCommittee,
        activitiesOutcomesOutput: formActivitiesOutcomesOutput,
        comments: formComments,
        plannedGhgReduction: formPlannedGhgReduction,
        actualAnnualEmissionReduction: formActualAnnualEmissionReduction,
        supportingDocsFiles: formSupportingDocs,
        submittedDate: todayStr,
        updatedDate: todayStr,

        facilityName: formInitiativeName,
        facilityId: formInitiativeId,
        operatorName: formEntity,
      },
    }));
    setOperatorEmissionIds((prev) => (prev.includes(selectedFacilityId) ? prev : [...prev, selectedFacilityId]));
    setIsSavedNotice(true);
    setNoticeMessage('Performance Report Submitted for EAD Review!');
    setTimeout(() => setIsSavedNotice(false), 3500);
    setViewMode('table');
  };

  const handleApproveReport = () => {
    const todayStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    setFacilityEmissions((prev) => ({
      ...prev,
      [selectedFacilityId]: {
        ...(prev[selectedFacilityId] || currentRecord),
        workflowStatus: 'Approved / Published',
        reviewerComments: reviewerComments || 'Performance report verified and approved for publication under CCRP guidelines.',
        reviewedDate: todayStr,
        updatedDate: todayStr,
      },
    }));
    setActiveReviewModal(null);
    setIsSavedNotice(true);
    setNoticeMessage('Performance Report Approved & Published!');
    setTimeout(() => setIsSavedNotice(false), 3500);
    setViewMode('table');
  };

  const handleRevertReport = () => {
    const todayStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    setFacilityEmissions((prev) => ({
      ...prev,
      [selectedFacilityId]: {
        ...(prev[selectedFacilityId] || currentRecord),
        workflowStatus: 'Returned for Correction',
        reviewerComments: reviewerComments || 'Please provide updated actual progress milestones or supporting documentation.',
        eadCorrectionDate: todayStr,
        updatedDate: todayStr,
      },
    }));
    setActiveReviewModal(null);
    setIsSavedNotice(true);
    setNoticeMessage('Performance Report Returned for Correction');
    setTimeout(() => setIsSavedNotice(false), 3500);
    setViewMode('table');
  };

  const handleDeleteReport = (repId: string, initiativeName: string) => {
    if (window.confirm(`Are you sure you want to delete draft performance report for "${initiativeName}"?`)) {
      setDeletedEmissionIds((prev) => (prev.includes(repId) ? prev : [...prev, repId]));
      setFacilityEmissions((prev) => {
        const copy = { ...prev };
        delete copy[repId];
        return copy;
      });
      setOperatorEmissionIds((prev) => prev.filter((id) => id !== repId));
      setIsSavedNotice(true);
      setNoticeMessage('Draft Performance Report Deleted');
      setTimeout(() => setIsSavedNotice(false), 3000);
    }
  };

  // Cadence-filtered period choices based on current pillar
  const availablePeriods = useMemo(() => {
    return CCRP_REPORTING_PERIODS_BY_PILLAR[formPillar] || ['Semiannual 1 (H1)', 'Semiannual 2 (H2)', 'Q1', 'Q2', 'Q3', 'Q4'];
  }, [formPillar]);

  // Helper for pillar badge styling matching Amendments
  const getPillarBadgeColor = (pillar: string) => {
    switch (pillar) {
      case 'Mitigation':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Adaptation':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'Economic Diversification':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Cross Cutting':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  // Helper for rendering status badges consistently with Amendments
  const renderStatusBadge = (rawStatus: string) => {
    if (rawStatus === 'Approved / Published' || rawStatus === 'Approved' || rawStatus === 'Verified') {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#E8F8F0] text-[#00875A] border border-[#00875A]/25 inline-block">
          Approved
        </span>
      );
    }
    if (rawStatus === 'Submitted') {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#E0EEFA] text-[#0284C7] border border-sky-200/60 inline-block">
          Submitted
        </span>
      );
    }
    if (rawStatus === 'Under EAD Review' || rawStatus === 'Under Review') {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-50 text-sky-700 border border-sky-200/60 inline-block">
          Under Review
        </span>
      );
    }
    if (
      rawStatus === 'Returned for Correction' ||
      rawStatus === 'Correction Required' ||
      rawStatus === 'Correction Requested' ||
      rawStatus === 'Reverted'
    ) {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200/60 inline-block">
          Correction Requested
        </span>
      );
    }
    return (
      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-normal bg-slate-100 text-slate-700 border border-slate-200 inline-block">
        Draft
      </span>
    );
  };

  // =========================================================================
  // 1. OVERVIEW TABLE VIEW (viewMode === 'table')
  // =========================================================================
  if (viewMode === 'table') {
    if (allReportsList.length === 0) {
      return (
        <div className="h-full flex flex-col font-sans py-1 animate-fade-in">
          {/* Header */}
          <div className="flex-shrink-0 pb-[18px] pt-0.5 flex items-center justify-between gap-3">
            <div>
              <h1 className="text-[18px] font-bold font-display text-[#336D9F] tracking-tight whitespace-nowrap">
                Project Data Entry
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Submit and track periodic initiative progress, report periods, milestones, and GHG performance data
              </p>
            </div>
          </div>

          {/* White Color Frame */}
          <div className="w-full bg-white rounded-xl border border-slate-200/90 shadow-xs flex flex-col items-center justify-center py-12 px-6">
            <div className="flex flex-col items-center text-center max-w-md">
              <img
                src={emptyFolderIcon}
                alt="No Performance Reports"
                className="w-[84px] h-[74px] object-contain mb-3.5 select-none"
                draggable={false}
              />

              <h2 className="text-[15px] font-bold text-[#336D9F] tracking-tight">
                No Data Entry Records Available
              </h2>
              <p className="text-[11.5px] text-slate-500 font-normal mt-1 max-w-sm">
                You haven't submitted any initiative data entry reports yet. Start reporting on your approved climate change initiatives.
              </p>

              <button
                onClick={handleCreateReport}
                className="mt-4 h-9 px-4 bg-gradient-to-r from-[#004B87] to-[#006BB8] text-white rounded-[8px] text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#004B87]/25 hover:shadow-lg hover:from-[#003d6e] hover:to-[#005c9e] transition-all cursor-pointer active:scale-95 shrink-0 whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span>Add Data Entry</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="h-full flex flex-col overflow-hidden font-sans py-1 animate-fade-in">
        {/* Top Header Row with Title, Search, Filter & Add Data Entry Button */}
        <div className="flex-shrink-0 pb-[18px] pt-0.5 flex items-center justify-between gap-3 min-w-0">
          <div className="min-w-0 shrink">
            <h1 className="text-[18px] font-bold font-display text-[#336D9F] tracking-tight whitespace-nowrap">
              Project Data Entry
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5 truncate max-w-lg xl:max-w-xl">
              {isEadReviewerOrAdmin
                ? 'Climate Change Strategy Initiatives Performance Review & Regulatory Oversight'
                : 'Submit and track periodic initiative progress, report periods, milestones, and GHG performance data'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-nowrap">
            {/* Search Box */}
            <div className="relative w-36 sm:w-44 xl:w-48">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 z-10 pointer-events-none" />
              <FieldTooltip content="Filter records by project name, ID, pillar, or reporting period.">
                <input
                  type="text"
                  placeholder="Search data entries..."
                  value={tableSearchTerm}
                  onChange={(e) => {
                    setTableSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full h-9 pl-8 pr-7 py-1.5 bg-white border border-slate-300 rounded-[8px] text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#336D9F]/20 focus:border-[#336D9F] transition-all font-medium shadow-xs"
                />
              </FieldTooltip>
              {tableSearchTerm && (
                <button
                  onClick={() => {
                    setTableSearchTerm('');
                    setCurrentPage(1);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer z-10"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Status Filter */}
            <div className="relative">
              <FieldTooltip content="Filter data entry records by status.">
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-32 sm:w-36 h-9 px-2.5 py-1.5 bg-white border border-slate-300 rounded-[8px] text-xs font-semibold text-slate-700 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#336D9F]/20 focus:border-[#336D9F] transition-all cursor-pointer truncate"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="Approved">Approved</option>
                  <option value="Submitted">Submitted</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Correction Requested">Correction Requested</option>
                  <option value="Draft">Draft</option>
                </select>
              </FieldTooltip>
            </div>

            {/* Pillar Filter */}
            <div className="relative">
              <FieldTooltip content="Filter reports by Abu Dhabi Climate Change Strategy Pillar.">
                <select
                  value={pillarFilter}
                  onChange={(e) => {
                    setPillarFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-28 sm:w-36 h-9 px-2.5 py-1.5 bg-white border border-slate-300 rounded-[8px] text-xs font-semibold text-slate-700 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#336D9F]/20 focus:border-[#336D9F] transition-all cursor-pointer truncate"
                >
                  <option value="ALL">All Pillars</option>
                  <option value="Mitigation">Mitigation</option>
                  <option value="Adaptation">Adaptation</option>
                  <option value="Economic Diversification">Economic Diversification</option>
                  <option value="Cross Cutting">Cross Cutting</option>
                </select>
              </FieldTooltip>
            </div>

            {/* Reset */}
            {(tableSearchTerm || statusFilter !== 'ALL' || pillarFilter !== 'ALL') && (
              <button
                onClick={() => {
                  setTableSearchTerm('');
                  setStatusFilter('ALL');
                  setPillarFilter('ALL');
                  setCurrentPage(1);
                }}
                className="h-9 px-2.5 text-slate-500 hover:text-slate-800 bg-white hover:bg-slate-100 rounded-[8px] border border-slate-200 font-semibold transition-colors flex items-center gap-1 cursor-pointer text-xs"
                title="Reset all filters"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}

            {/* Add Data Entry Button */}
            {isFacilityOperator && (
              <button
                type="button"
                onClick={handleCreateReport}
                className="h-9 px-4 bg-gradient-to-r from-[#004B87] to-[#006BB8] text-white rounded-[8px] text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#004B87]/25 hover:shadow-lg hover:from-[#003d6e] hover:to-[#005c9e] transition-all cursor-pointer active:scale-95 shrink-0 whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span>Add Data Entry</span>
              </button>
            )}
          </div>
        </div>

        {/* Table Container */}
        <div className="flex flex-col flex-1 min-h-0 justify-between overflow-hidden">
          <div className="flex-1 min-h-0 overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="sticky top-0 z-20 bg-[#D6E3EF] shadow-xs select-none">
                <tr className="h-[38px] bg-[#D6E3EF] text-slate-800 font-bold text-xs border-b border-[#5B88B0]/30">
                  <th
                    onClick={() => handleSort('index')}
                    className="h-[38px] px-3 w-[5%] text-center align-middle bg-[#D6E3EF] hover:bg-[#C8D9E8] transition-colors cursor-pointer group"
                    title="Sort by Number"
                  >
                    <div className="flex items-center justify-center">
                      <span>#</span>
                      <SortTriangles active={sortField === 'index'} direction={sortDirection} />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('name')}
                    className="h-[38px] px-3 w-[25%] align-middle bg-[#D6E3EF] hover:bg-[#C8D9E8] transition-colors cursor-pointer group"
                    title="Sort by Project/Initiative Name"
                  >
                    <div className="flex items-center">
                      <span>Project/Initiative Name</span>
                      <SortTriangles active={sortField === 'name'} direction={sortDirection} />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('id')}
                    className="h-[38px] px-3 w-[15%] whitespace-nowrap align-middle bg-[#D6E3EF] hover:bg-[#C8D9E8] transition-colors cursor-pointer group"
                    title="Sort by Project ID"
                  >
                    <div className="flex items-center">
                      <span>Project ID</span>
                      <SortTriangles active={sortField === 'id'} direction={sortDirection} />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('pillar')}
                    className="h-[38px] px-3 w-[11%] whitespace-nowrap align-middle bg-[#D6E3EF] hover:bg-[#C8D9E8] transition-colors cursor-pointer group"
                    title="Sort by Pillar"
                  >
                    <div className="flex items-center">
                      <span>Pillar</span>
                      <SortTriangles active={sortField === 'pillar'} direction={sortDirection} />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('period')}
                    className="h-[38px] px-3 w-[12%] whitespace-nowrap text-center align-middle bg-[#D6E3EF] hover:bg-[#C8D9E8] transition-colors cursor-pointer group"
                    title="Sort by Report Period"
                  >
                    <div className="flex items-center justify-center">
                      <span>Report Period</span>
                      <SortTriangles active={sortField === 'period'} direction={sortDirection} />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('progress')}
                    className="h-[38px] px-3 w-[14%] whitespace-nowrap text-center align-middle bg-[#D6E3EF] hover:bg-[#C8D9E8] transition-colors cursor-pointer group"
                    title="Sort by Progress (Actual/Planned)"
                  >
                    <div className="flex items-center justify-center">
                      <span>Progress (Actual/Planned)</span>
                      <SortTriangles active={sortField === 'progress'} direction={sortDirection} />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('status')}
                    className="h-[38px] px-3 w-[11%] whitespace-nowrap text-left align-middle bg-[#D6E3EF] hover:bg-[#C8D9E8] transition-colors cursor-pointer group"
                    title="Sort by Status"
                  >
                    <div className="flex items-center">
                      <span>Status</span>
                      <SortTriangles active={sortField === 'status'} direction={sortDirection} />
                    </div>
                  </th>
                  <th className="h-[38px] px-4 w-[7%] text-right whitespace-nowrap align-middle bg-[#D6E3EF]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-normal text-slate-700">
                {paginatedReports.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400 font-medium">
                      No data entry records match the selected filter criteria.
                    </td>
                  </tr>
                ) : (
                  paginatedReports.map((item, idx) => {
                    const rowNumber = (currentPage - 1) * itemsPerPage + idx + 1;

                    return (
                      <tr
                        key={item.id}
                        className={`h-[60px] ${idx % 2 === 1 ? 'bg-slate-50/80' : 'bg-white'} hover:bg-[#EBF3FA] transition-colors group cursor-default`}
                      >
                        {/* 1. Row # */}
                        <td className="h-[60px] px-3 text-center font-mono font-normal text-slate-400 align-middle">
                          {rowNumber}
                        </td>

                        {/* 2. Project/Initiative Name */}
                        <td className="h-[60px] px-3 font-medium text-slate-800 align-middle overflow-hidden">
                          <div
                            className="line-clamp-2 leading-snug break-words hover:text-[#004B87] cursor-pointer"
                            onClick={() => handleViewReport(item.id)}
                            title={item.name}
                          >
                            {item.name}
                          </div>
                        </td>

                        {/* 3. Project ID */}
                        <td className="h-[60px] px-3 font-mono font-bold text-[#004B87] whitespace-nowrap align-middle">
                          <span>{item.initiativeCode}</span>
                        </td>

                        {/* 4. Pillar */}
                        <td className="h-[60px] px-3 whitespace-nowrap align-middle">
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border inline-flex items-center gap-1 ${getPillarBadgeColor(item.pillar)}`}>
                            {item.pillar}
                          </span>
                        </td>

                        {/* 5. Report Period */}
                        <td className="h-[60px] px-3 whitespace-nowrap text-center font-medium text-slate-700 align-middle">
                          {item.reportPeriod}
                        </td>

                        {/* 6. Progress (Actual / Planned) */}
                        <td className="h-[60px] px-3 whitespace-nowrap text-center align-middle">
                          <div className="flex flex-col items-center justify-center gap-1" title={`Actual: ${item.actualProg}% / Planned: ${item.plannedProg}%`}>
                            <div className="flex items-center gap-1 text-[11px] font-bold text-slate-800">
                              <span title="Actual Progress">{item.actualProg}%</span>
                              <span className="text-slate-400 font-normal">/</span>
                              <span className="text-slate-500 font-normal" title="Planned Progress">{item.plannedProg}%</span>
                            </div>
                            <div className="w-20 bg-slate-100 rounded-full h-1.5 overflow-hidden border border-slate-200" title={`Progress: ${item.actualProg}% Actual / ${item.plannedProg}% Planned`}>
                              <div
                                className={`h-full rounded-full transition-all ${
                                  item.actualProg >= item.plannedProg ? 'bg-emerald-500' : 'bg-amber-500'
                                }`}
                                style={{ width: `${Math.min(100, item.actualProg)}%` }}
                              />
                            </div>
                            <span className="text-[9.5px] text-slate-400 font-medium leading-none">Actual / Planned</span>
                          </div>
                        </td>

                        {/* 7. Status */}
                        <td className="h-[60px] px-3 whitespace-nowrap text-left align-middle">
                          {renderStatusBadge(item.status)}
                        </td>

                        {/* 8. Actions */}
                        <td className="h-[60px] px-4 whitespace-nowrap align-middle text-right">
                          <div className="flex items-center justify-end gap-2.5">
                            {/* View Action */}
                            <button
                              type="button"
                              onClick={() => handleViewReport(item.id)}
                              title="View Data Entry"
                              className="text-slate-600 hover:text-[#004B87] transition-colors cursor-pointer p-1 rounded-md hover:bg-[#004B87]/10"
                            >
                              <Eye className="w-[18px] h-[18px] stroke-[1.75]" />
                            </button>

                            {/* Edit Action */}
                            <button
                              type="button"
                              onClick={() => handleEditReport(item.id)}
                              title="Edit Data Entry"
                              className="text-slate-600 hover:text-[#004B87] transition-colors cursor-pointer p-1 rounded-md hover:bg-[#004B87]/10"
                            >
                              <Edit className="w-[18px] h-[18px] stroke-[1.75]" />
                            </button>

                            {/* Delete Action (Only for Draft status) */}
                            {item.status === 'Draft' && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteReport(item.id, item.name);
                                }}
                                title="Delete Draft Data Entry"
                                className="text-slate-600 hover:text-rose-600 transition-colors cursor-pointer p-1 rounded-md hover:bg-rose-50"
                              >
                                <Trash2 className="w-[18px] h-[18px] stroke-[1.75]" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Bar */}
          <div className="flex-shrink-0 pt-2 flex items-center justify-between text-xs text-slate-500">
            <div>
              Showing {sortedTableList.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to{' '}
              {Math.min(currentPage * itemsPerPage, sortedTableList.length)} of {sortedTableList.length} records
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2 font-medium">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="p-1 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 2. FORM & READ-ONLY INSPECTION VIEWS (viewMode === 'form' | 'view')
  // =========================================================================
  const isReadOnly = viewMode === 'view';
  const isGhgMandatory = formPillar === 'Mitigation';
  const isGhgOptional = formPillar === 'Cross Cutting';
  const isGhgNotRequired = formPillar === 'Adaptation' || formPillar === 'Economic Diversification';
  const isEvidenceMandatory = formReportStatus === 'Completed' || Number(formActualProgress) === 100;

  return (
    <div className="h-full flex flex-col overflow-hidden font-sans py-0.5">
      {/* Hidden file input for uploads */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
        multiple
      />

      {/* Top Header Bar with Title, Status Chip, Initiative Selector & Progress Report Period */}
      <div className="flex-shrink-0 flex flex-col gap-2 pb-3.5 pt-0.5">
        {/* Row 1: Back Arrow, Title, Status Chip, and Save Notice */}
        <div className="flex items-center justify-between gap-3 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setViewMode('table')}
              className="p-1 -ml-1 text-[#336D9F] hover:text-[#004B87] hover:bg-[#E9F1F8] rounded-lg transition-colors cursor-pointer flex items-center justify-center shrink-0 border border-slate-200/70 shadow-2xs"
              title="Back to Overview"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h1 className="text-[18px] font-bold font-display text-[#336D9F] tracking-tight whitespace-nowrap">
              Project Data Entry
            </h1>
            <span
              className={`px-3 py-0.5 rounded-full text-xs font-bold tracking-wide transition-all shrink-0 ${
                currentRecord.workflowStatus === 'Approved / Published' || currentRecord.workflowStatus === 'Approved'
                  ? 'bg-[#D1FAE5] text-[#065F46] border border-emerald-200/60'
                  : currentRecord.workflowStatus === 'Submitted'
                  ? 'bg-[#E0EEFA] text-[#0284C7] border border-sky-200/60'
                  : currentRecord.workflowStatus === 'Returned for Correction'
                  ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                  : 'bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              {currentRecord.workflowStatus === 'Approved / Published' || currentRecord.workflowStatus === 'Approved'
                ? 'Approved / Published'
                : currentRecord.workflowStatus === 'Submitted'
                ? 'Submitted'
                : currentRecord.workflowStatus === 'Returned for Correction'
                ? 'Returned for Correction'
                : 'Draft'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {isSavedNotice && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 text-xs font-bold animate-fade-in shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{noticeMessage}</span>
              </div>
            )}

            {isReadOnly && isFacilityOperator && (
              <button
                type="button"
                onClick={() => setViewMode('form')}
                className="h-8 px-4 bg-gradient-to-r from-[#004B87] to-[#006BB8] text-white rounded-[8px] text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#004B87]/25 hover:shadow-lg hover:from-[#003d6e] hover:to-[#005c9e] transition-all cursor-pointer active:scale-95 shrink-0"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit Project Data</span>
              </button>
            )}
          </div>
        </div>

        {/* Row 2: Initiative Name & Progress Report Period (4-column grid layout with chips in remaining space) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-0.5 items-end">
          {/* Col 1: Initiative Name Select / Readonly */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Initiative Name
            </label>
            <div className="relative">
              <FieldTooltip content="Approved/published climate change initiative under CCRP.">
                {isReadOnly ? (
                  <input
                    type="text"
                    readOnly
                    disabled
                    value={formInitiativeName}
                    className="w-full h-9 px-3.5 bg-slate-200/90 border border-slate-300 rounded-[8px] text-xs text-slate-800 font-bold cursor-not-allowed select-none truncate"
                  />
                ) : (
                  <div className="relative">
                    <select
                      value={formInitiativeId}
                      onChange={(e) => handleInitiativeChange(e.target.value)}
                      className="w-full h-9 px-3.5 bg-white border border-slate-300 rounded-[8px] text-xs text-slate-800 font-bold focus:outline-none focus:border-[#004B87] shadow-2xs appearance-none pr-8 cursor-pointer truncate"
                    >
                      {CCRP_APPROVED_INITIATIVES.map((init) => (
                        <option key={init.initiativeCode} value={init.initiativeCode}>
                          {init.name} ({init.initiativeCode})
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                )}
              </FieldTooltip>
            </div>
          </div>

          {/* Col 2: Progress Report Period Select */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Progress Report Period
            </label>
            <div className="relative">
              <FieldTooltip content="Periodic reporting cycle based on initiative pillar cadence (Quarterly for Adaptation; Semiannual for Mitigation/Economic Diversification/Cross Cutting).">
                {isReadOnly ? (
                  <input
                    type="text"
                    readOnly
                    disabled
                    value={formProgressReportPeriod}
                    className="w-full h-9 px-3.5 bg-slate-200/90 border border-slate-300 rounded-[8px] text-xs text-slate-800 font-bold cursor-not-allowed select-none"
                  />
                ) : (
                  <div className="relative">
                    <select
                      value={formProgressReportPeriod}
                      onChange={(e) => setFormProgressReportPeriod(e.target.value)}
                      className="w-full h-9 px-3.5 bg-white border border-slate-300 rounded-[8px] text-xs text-slate-800 font-bold focus:outline-none focus:border-[#004B87] shadow-2xs appearance-none pr-8 cursor-pointer"
                    >
                      {availablePeriods.map((period) => (
                        <option key={period} value={period}>
                          {period}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                )}
              </FieldTooltip>
            </div>
          </div>

          {/* Cols 3 & 4 (Remaining Area): Context Badges (Entity, Pillar, Cadence) */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-2 flex items-center gap-2 h-9 flex-wrap">
            <span className="px-2.5 py-1.5 rounded-lg bg-sky-50 border border-sky-100 text-[11px] font-semibold text-sky-800 truncate" title={`Entity: ${formEntity}`}>
              Entity: <span className="font-bold">{formEntity}</span>
            </span>
            <span className="px-2.5 py-1.5 rounded-lg bg-purple-50 border border-purple-100 text-[11px] font-semibold text-purple-800 shrink-0">
              Pillar: <span className="font-bold">{formPillar}</span>
            </span>
            <span className="px-2.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-100 text-[11px] font-semibold text-emerald-800 shrink-0">
              Cadence: <span className="font-bold">{formCadence}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Container on White Frame (Enclosing Stepper Tab Navigation at top) */}
      <div className="flex-1 min-h-0 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-3.5 sm:p-4 flex flex-col overflow-hidden">
        {/* Stepper Tabs Bar */}
        <div className="flex-shrink-0 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar pb-2.5">
          <div className="inline-flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-[6px] shadow-2xs">
            {PERFORMANCE_REPORT_STEPS.map((step, idx) => {
              const subTabOrder: StepTabId[] = [
                'report-details',
                'progress-status',
                'ghg-emissions',
                'supporting-submit',
              ];
              const currentStepNum = subTabOrder.indexOf(activeTab) + 1;
              const isActive = step.stepNumber === currentStepNum;
              const isCompleted = step.stepNumber < currentStepNum;
              const isArrowHighlighted = idx < currentStepNum - 1;

              return (
                <React.Fragment key={step.id}>
                  <button
                    type="button"
                    onClick={() => setActiveTab(step.id as StepTabId)}
                    className={`px-3.5 py-1.5 rounded-[6px] text-xs transition-all flex items-center gap-2 cursor-pointer select-none ${
                      isActive
                        ? 'bg-gradient-to-r from-[#004B87] to-[#006BB8] text-white font-bold shadow-xs'
                        : isCompleted
                        ? 'text-slate-700 hover:text-[#004B87] hover:bg-slate-50 font-semibold'
                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50 font-medium'
                    }`}
                  >
                    {/* Numbered Circle */}
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 transition-all ${
                        isActive
                          ? 'bg-white text-[#004B87] shadow-2xs'
                          : isCompleted
                          ? 'bg-[#00875A] text-white shadow-2xs'
                          : 'bg-white text-slate-400 border border-slate-300'
                      }`}
                    >
                      <span>{step.stepNumber}</span>
                    </div>

                    {/* Step Title */}
                    <span className="whitespace-nowrap">{step.title}</span>
                  </button>

                  {/* Arrow Indication between steps */}
                  {idx < PERFORMANCE_REPORT_STEPS.length - 1 && (
                    <ChevronRight
                      className={`w-4 h-4 shrink-0 mx-0.5 transition-colors ${
                        isArrowHighlighted ? 'text-[#004B87] stroke-[2.5]' : 'text-slate-300'
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Pillar / Step Badge */}
          {activeTab === 'ghg-emissions' && (
            <div className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border shrink-0 ${
              isGhgMandatory
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : isGhgOptional
                ? 'bg-purple-50 text-purple-700 border-purple-200'
                : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}>
              <Flame className="w-3.5 h-3.5" />
              <span>
                {isGhgMandatory
                  ? 'Mandatory for Mitigation Pillar'
                  : isGhgOptional
                  ? 'Optional for Cross Cutting Pillar'
                  : 'Qualitative Focus for Adaptation/Diversification'}
              </span>
            </div>
          )}

          {activeTab === 'supporting-submit' && (
            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200 shrink-0">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
              <span>
                {isEvidenceMandatory ? 'Mandatory Closing Evidence Required' : 'Evidence Optional While In Progress'}
              </span>
            </div>
          )}
        </div>

        {/* Scrollable Form Content */}
        <div className="flex-1 min-h-0 overflow-y-auto space-y-5 pr-2.5 pt-2 pb-0.5 text-xs custom-scrollbar">
          {/* ================================================================ */}
          {/* STEP 1: REPORT DETAILS */}
          {/* ================================================================ */}
          {activeTab === 'report-details' && (
            <div className="space-y-5">
              <div>
                <h4 className="text-xs font-bold text-[#336D9F] mb-3">
                  Report Cycle & Phase Parameters
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {/* Progress Report Period */}
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1 text-xs">
                      Progress Report Period *
                    </label>
                    <FieldTooltip content="Designated reporting period for this performance submission." example="Semiannual 1 (H1) / Q1">
                      {isReadOnly ? (
                        <input
                          type="text"
                          readOnly
                          disabled
                          value={formProgressReportPeriod}
                          className="w-full px-3.5 py-2 bg-[#F1F5F9] border border-slate-200 rounded-lg text-slate-700 font-semibold text-xs cursor-not-allowed"
                        />
                      ) : (
                        <select
                          value={formProgressReportPeriod}
                          onChange={(e) => setFormProgressReportPeriod(e.target.value)}
                          className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 font-medium focus:outline-none focus:border-[#336D9F] shadow-xs cursor-pointer text-xs"
                        >
                          {availablePeriods.map((period) => (
                            <option key={period} value={period}>
                              {period}
                            </option>
                          ))}
                        </select>
                      )}
                    </FieldTooltip>
                  </div>

                  {/* Project Phase */}
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1 text-xs">
                      Project Phase *
                    </label>
                    <FieldTooltip content="Current lifecycle stage of the initiative from Climate Change Strategy Data master." example="Implementation">
                      {isReadOnly ? (
                        <input
                          type="text"
                          readOnly
                          disabled
                          value={formProjectPhase}
                          className="w-full px-3.5 py-2 bg-[#F1F5F9] border border-slate-200 rounded-lg text-slate-700 font-semibold text-xs cursor-not-allowed"
                        />
                      ) : (
                        <select
                          value={formProjectPhase}
                          onChange={(e) => setFormProjectPhase(e.target.value as any)}
                          className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 font-medium focus:outline-none focus:border-[#336D9F] shadow-xs cursor-pointer text-xs"
                        >
                          {CCRP_PROJECT_PHASES.map((phase) => (
                            <option key={phase} value={phase}>
                              {phase}
                            </option>
                          ))}
                        </select>
                      )}
                    </FieldTooltip>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1 text-xs">
                      Status *
                    </label>
                    <FieldTooltip content="Operational execution status of the climate initiative (from Excel Data sheet)." example="In Progress">
                      {isReadOnly ? (
                        <input
                          type="text"
                          readOnly
                          disabled
                          value={formReportStatus}
                          className="w-full px-3.5 py-2 bg-[#F1F5F9] border border-slate-200 rounded-lg text-slate-700 font-semibold text-xs cursor-not-allowed"
                        />
                      ) : (
                        <select
                          value={formReportStatus}
                          onChange={(e) => setFormReportStatus(e.target.value as any)}
                          className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 font-medium focus:outline-none focus:border-[#336D9F] shadow-xs cursor-pointer text-xs"
                        >
                          {CCRP_REPORT_STATUSES.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      )}
                    </FieldTooltip>
                  </div>
                </div>
              </div>

              {/* Progress Percentage & Milestone Tracking */}
              <div>
                <h4 className="text-xs font-bold text-[#336D9F] mb-3">
                  Progress Percentage & Milestone Tracking
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {/* Planned Progress (%) */}
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1 text-xs">
                      Planned Progress (%) *
                    </label>
                    <FieldTooltip content="Target planned percentage completion for this reporting period (0–100%)." example="75%">
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="0.1"
                          readOnly={isReadOnly}
                          disabled={isReadOnly}
                          value={formPlannedProgress}
                          onChange={(e) => setFormPlannedProgress(e.target.value)}
                          placeholder="e.g. 75"
                          className="w-full pl-3.5 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 font-bold focus:outline-none focus:border-[#336D9F] shadow-xs text-xs"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs pointer-events-none">
                          %
                        </span>
                      </div>
                    </FieldTooltip>
                  </div>

                  {/* Actual Progress (%) */}
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1 text-xs">
                      Actual Progress (%) *
                    </label>
                    <FieldTooltip content="Realized actual percentage completion achieved up to this period (0–100%)." example="68%">
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="0.1"
                          readOnly={isReadOnly}
                          disabled={isReadOnly}
                          value={formActualProgress}
                          onChange={(e) => setFormActualProgress(e.target.value)}
                          placeholder="e.g. 68"
                          className="w-full pl-3.5 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 font-bold focus:outline-none focus:border-[#336D9F] shadow-xs text-xs"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs pointer-events-none">
                          %
                        </span>
                      </div>
                    </FieldTooltip>
                  </div>
                </div>
              </div>

              {/* Visual Progress Comparison Bar */}
              <div className="p-4 bg-[#F8FAFC] border border-slate-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-800">Progress Delivery Comparison</span>
                  {(() => {
                    const diff = Number(formActualProgress) - Number(formPlannedProgress);
                    if (diff > 0) {
                      return (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          +{diff.toFixed(1)}% Ahead of Schedule
                        </span>
                      );
                    }
                    if (diff < 0) {
                      return (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          {diff.toFixed(1)}% Variance from Plan
                        </span>
                      );
                    }
                    return (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
                        100% On Track
                      </span>
                    );
                  })()}
                </div>

                {/* Progress bars */}
                <div className="space-y-2">
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 mb-1">
                      <span>Planned Milestone Target</span>
                      <span className="font-bold text-slate-700">{formPlannedProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-slate-500 rounded-full transition-all"
                        style={{ width: `${Math.min(100, Math.max(0, Number(formPlannedProgress)))}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 mb-1">
                      <span>Actual Realized Progress</span>
                      <span className="font-bold text-emerald-700">{formActualProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#004B87] to-[#00875A] rounded-full transition-all"
                        style={{ width: `${Math.min(100, Math.max(0, Number(formActualProgress)))}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* STEP 2: PROGRESS & STATUS */}
          {/* ================================================================ */}
          {activeTab === 'progress-status' && (
            <div className="space-y-5">

              {/* Budget & Financial Information */}
              <div>
                <h4 className="text-xs font-bold text-[#336D9F] mb-3">
                  Budget & Financial Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {/* Budget */}
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1 text-xs">
                      Budget
                    </label>
                    <FieldTooltip content="Total financial budget amount allocated for the project." example="AED 3,200,000,000">
                      <input
                        type="text"
                        readOnly={isReadOnly}
                        disabled={isReadOnly}
                        value={formBudget}
                        onChange={(e) => setFormBudget(e.target.value)}
                        placeholder="e.g. AED 3,200,000,000"
                        className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 font-medium focus:outline-none focus:border-[#336D9F] shadow-xs text-xs"
                      />
                    </FieldTooltip>
                  </div>

                  {/* Budget Type */}
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1 text-xs">
                      Budget Type
                    </label>
                    <FieldTooltip content="Funding classification / capital expenditure model for this initiative." example="CAPEX">
                      {isReadOnly ? (
                        <input
                          type="text"
                          readOnly
                          disabled
                          value={formBudgetType}
                          className="w-full px-3.5 py-2 bg-[#F1F5F9] border border-slate-200 rounded-lg text-slate-700 font-semibold text-xs cursor-not-allowed"
                        />
                      ) : (
                        <select
                          value={formBudgetType}
                          onChange={(e) => setFormBudgetType(e.target.value)}
                          className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 font-medium focus:outline-none focus:border-[#336D9F] shadow-xs cursor-pointer text-xs"
                        >
                          {CCRP_BUDGET_TYPES.map((bt) => (
                            <option key={bt} value={bt}>
                              {bt}
                            </option>
                          ))}
                        </select>
                      )}
                    </FieldTooltip>
                  </div>

                  {/* Budget Status */}
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1 text-xs">
                      Budget Status
                    </label>
                    <FieldTooltip content="Current appropriation status of the financial budget." example="Allocated">
                      {isReadOnly ? (
                        <input
                          type="text"
                          readOnly
                          disabled
                          value={formBudgetStatus}
                          className="w-full px-3.5 py-2 bg-[#F1F5F9] border border-slate-200 rounded-lg text-slate-700 font-semibold text-xs cursor-not-allowed"
                        />
                      ) : (
                        <select
                          value={formBudgetStatus}
                          onChange={(e) => setFormBudgetStatus(e.target.value)}
                          className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 font-medium focus:outline-none focus:border-[#336D9F] shadow-xs cursor-pointer text-xs"
                        >
                          {CCRP_BUDGET_STATUSES.map((bs) => (
                            <option key={bs} value={bs}>
                              {bs}
                            </option>
                          ))}
                        </select>
                      )}
                    </FieldTooltip>
                  </div>
                </div>
              </div>

              {/* Challenges & Escalation */}
              <div>
                <h4 className="text-xs font-bold text-[#336D9F] mb-3">
                  Challenges & Escalation
                </h4>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1 text-xs">
                    Challenges
                  </label>
                  <FieldTooltip content="Detail any operational, technical, financial, or supply chain bottlenecks encountered during this period.">
                    <textarea
                      rows={3}
                      readOnly={isReadOnly}
                      disabled={isReadOnly}
                      value={formChallenges}
                      onChange={(e) => setFormChallenges(e.target.value)}
                      placeholder="Describe any challenges or roadblocks faced during execution..."
                      className="w-full p-3.5 bg-white border border-slate-200 rounded-lg text-slate-800 font-medium focus:outline-none focus:border-[#336D9F] shadow-xs leading-relaxed text-xs"
                    />
                  </FieldTooltip>
                </div>

                {/* Climate Change Committee Escalation Question */}
                <div className="mt-3 flex items-center gap-3 select-none flex-nowrap">
                  <label className="text-slate-700 font-semibold text-xs whitespace-nowrap">
                    Does the challenge need to be raised to the Climate Change Committee?
                  </label>
                  <FieldTooltip content="Escalate critical inter-entity blockers or policy barriers directly to the Climate Change Committee." className="inline-flex items-center">
                    <div className="flex items-center gap-2 select-none shrink-0">
                      <span
                        onClick={() => !isReadOnly && setFormRaiseToCommittee('No')}
                        className={`text-xs transition-colors select-none ${
                          !isReadOnly ? 'cursor-pointer' : 'cursor-default'
                        } ${
                          formRaiseToCommittee === 'No'
                            ? 'text-slate-800 font-bold'
                            : 'text-slate-400 font-medium'
                        }`}
                      >
                        No
                      </span>
                      <button
                        type="button"
                        disabled={isReadOnly}
                        onClick={() =>
                          setFormRaiseToCommittee((prev) => (prev === 'Yes' ? 'No' : 'Yes'))
                        }
                        className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
                          isReadOnly ? 'cursor-default opacity-80' : 'cursor-pointer hover:opacity-95'
                        } ${formRaiseToCommittee === 'Yes' ? 'bg-[#004B87]' : 'bg-slate-300'}`}
                      >
                        <div
                          className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform ${
                            formRaiseToCommittee === 'Yes' ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        />
                      </button>
                      <span
                        onClick={() => !isReadOnly && setFormRaiseToCommittee('Yes')}
                        className={`text-xs transition-colors select-none ${
                          !isReadOnly ? 'cursor-pointer' : 'cursor-default'
                        } ${
                          formRaiseToCommittee === 'Yes'
                            ? 'text-[#004B87] font-bold'
                            : 'text-slate-400 font-medium'
                        }`}
                      >
                        Yes
                      </span>
                    </div>
                  </FieldTooltip>
                </div>
              </div>

              {/* Activities / Outcomes / Output */}
              <div>
                <h4 className="text-xs font-bold text-[#336D9F] mb-1.5">
                  Activities / Outcomes / Output
                </h4>
                <FieldTooltip content="Key operational deliverables, tangible outputs completed, and outcomes achieved during this reporting period.">
                  <textarea
                    rows={3}
                    readOnly={isReadOnly}
                    disabled={isReadOnly}
                    value={formActivitiesOutcomesOutput}
                    onChange={(e) => setFormActivitiesOutcomesOutput(e.target.value)}
                    placeholder="Detail key activities carried out, milestone deliverables, and tangible outcomes achieved..."
                    className="w-full p-3.5 bg-white border border-slate-200 rounded-lg text-slate-800 font-medium focus:outline-none focus:border-[#336D9F] shadow-xs leading-relaxed text-xs"
                  />
                </FieldTooltip>
              </div>

              {/* Comments */}
              <div>
                <h4 className="text-xs font-bold text-[#336D9F] mb-1.5">
                  Comments
                </h4>
                <FieldTooltip content="Additional stakeholder comments, strategic notes, or forward-looking updates.">
                  <textarea
                    rows={3}
                    readOnly={isReadOnly}
                    disabled={isReadOnly}
                    value={formComments}
                    onChange={(e) => setFormComments(e.target.value)}
                    placeholder="Enter any additional remarks, strategic notes, or general commentary..."
                    className="w-full p-3.5 bg-white border border-slate-200 rounded-lg text-slate-800 font-medium focus:outline-none focus:border-[#336D9F] shadow-xs leading-relaxed text-xs"
                  />
                </FieldTooltip>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* STEP 3: GHG EMISSIONS (PILLAR-AWARE DYNAMIC) */}
          {/* ================================================================ */}
          {activeTab === 'ghg-emissions' && (
            <div className="space-y-5">
              {isGhgOptional && (
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl flex items-start gap-2.5 text-xs text-purple-900">
                  <Info className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Cross Cutting Pillar Initiative:</span> GHG emissions reduction metrics are optional. Complete if your multi-sectoral initiative generates quantified decarbonization impacts.
                  </div>
                </div>
              )}

              {isGhgNotRequired && (
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-2.5 text-xs text-slate-700">
                  <Info className="w-4 h-4 text-[#004B87] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">{formPillar} Pillar Focus:</span> GHG emissions reduction metrics are not required for {formPillar} initiatives. Reporting for this initiative focuses on qualitative indicators, resilience benchmarks, and progress milestones.
                  </div>
                </div>
              )}

              {/* GHG Input Fields */}
              <div>
                <h4 className="text-xs font-bold text-[#336D9F] mb-3">
                  Greenhouse Gas Emission Reduction Metrics (Metric tonnes CO₂e)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {/* Planned GHG Emissions Reduction */}
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1 text-xs">
                      Planned GHG Emissions Reduction (Metric tonnes) {isGhgMandatory ? '*' : '(If applicable)'}
                    </label>
                    <FieldTooltip content="Target planned annual greenhouse gas reduction in metric tonnes CO₂e from Climate Change Strategy baseline." example="142,800">
                      <input
                        type="text"
                        readOnly={isReadOnly}
                        disabled={isReadOnly}
                        value={formPlannedGhgReduction}
                        onChange={(e) => setFormPlannedGhgReduction(e.target.value)}
                        placeholder="e.g. 142,800"
                        className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 font-bold focus:outline-none focus:border-[#336D9F] shadow-xs text-xs"
                      />
                    </FieldTooltip>
                  </div>

                  {/* Actual Annual Emission Reduction */}
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1 text-xs">
                      Actual Annual Emission Reduction (Metric tonnes) {isGhgMandatory ? '*' : '(If applicable)'}
                    </label>
                    <FieldTooltip content="Realized annual emissions reduction achieved in metric tonnes CO₂e." example="138,500">
                      <input
                        type="text"
                        readOnly={isReadOnly}
                        disabled={isReadOnly}
                        value={formActualAnnualEmissionReduction}
                        onChange={(e) => setFormActualAnnualEmissionReduction(e.target.value)}
                        placeholder="e.g. 138,500"
                        className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 font-bold focus:outline-none focus:border-[#336D9F] shadow-xs text-xs"
                      />
                    </FieldTooltip>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* STEP 4: SUPPORTING DOCUMENTS & SUBMIT */}
          {/* ================================================================ */}
          {activeTab === 'supporting-submit' && (
            <div className="space-y-5">
              {/* Supporting Documents Upload */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-[#336D9F]">
                    Supporting Documents & Evidence
                  </h4>
                  <span className={`text-[11px] font-medium ${isEvidenceMandatory ? 'text-rose-600 font-bold' : 'text-slate-500 italic'}`}>
                    {isEvidenceMandatory
                      ? '(Mandatory for final closing report / completed submission)'
                      : '(Optional while initiative is in progress)'}
                  </span>
                </div>

                <FieldTooltip content="Upload initiative progress reports, telemetry extracts, commissioning certificates, or third-party audit statements." format="PDF, PNG, JPG (Max 25MB)">
                  <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
                    {/* Upload Input Button Area */}
                    {!isReadOnly && (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border border-dashed border-sky-300 bg-sky-50/40 hover:bg-sky-50/70 rounded-lg px-4 py-2 flex items-center justify-between gap-3 shrink-0 cursor-pointer transition-colors min-w-[280px]"
                      >
                        <div className="flex items-center gap-2 text-slate-600 text-xs font-medium">
                          <Upload className="w-4 h-4 text-slate-500 shrink-0" />
                          <span className="whitespace-nowrap">Upload progress evidence files</span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            fileInputRef.current?.click();
                          }}
                          className="px-3.5 py-1.5 bg-white border border-slate-300 hover:border-slate-400 text-xs font-bold text-slate-700 rounded-lg shadow-2xs transition-colors shrink-0 cursor-pointer"
                        >
                          Upload
                        </button>
                      </div>
                    )}

                    {/* Attached Files List */}
                    <div className="flex-1 min-w-0 flex items-center gap-2.5 overflow-x-auto py-1 no-scrollbar">
                      {formSupportingDocs.length > 0 ? (
                        formSupportingDocs.map((file, idx) => (
                          <div
                            key={file.id || idx}
                            className="border border-slate-200 bg-white rounded-lg py-1.5 px-3 flex items-center gap-2.5 shadow-2xs shrink-0 max-w-[260px] hover:border-slate-300 transition-all"
                          >
                            <div className="w-7 h-7 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0">
                              <FileText className="w-3.5 h-3.5 text-rose-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-xs font-bold text-slate-800 truncate" title={file.name}>
                                {file.name}
                              </div>
                              <div className="text-[10px] text-slate-400 flex items-center gap-1.5 font-medium">
                                <span>{file.size}</span>
                                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                <span className="text-emerald-600 font-bold">Uploaded</span>
                              </div>
                            </div>
                            {!isReadOnly && (
                              <button
                                type="button"
                                onClick={() =>
                                  setFormSupportingDocs((prev) => prev.filter((_, i) => i !== idx))
                                }
                                className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer shrink-0"
                                title="Remove file"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400 italic">
                          No evidence attached yet {isEvidenceMandatory ? '(Required before final submission)' : '(Optional)'}
                        </span>
                      )}
                    </div>
                  </div>
                </FieldTooltip>
              </div>

              {/* EAD Reviewer Comments in Read-Only Mode */}
              {isReadOnly && reviewerComments && (
                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
                  <div className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-amber-700" />
                    <span>EAD Reviewer Official Remarks</span>
                  </div>
                  <p className="text-xs text-amber-800 font-medium">{reviewerComments}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Action Bar (Preserving exact layout and buttons) */}
      <div className="flex-shrink-0 pt-3 flex items-center justify-end gap-3">
        {isReadOnly ? (
          <>
            {/* Cancel Button */}
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-700 flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Cancel</span>
            </button>

            {/* Next or Back to Overview */}
            {activeTab !== 'supporting-submit' ? (
              <button
                type="button"
                onClick={() => {
                  const subTabOrder: StepTabId[] = [
                    'report-details',
                    'progress-status',
                    'ghg-emissions',
                    'supporting-submit',
                  ];
                  const curIdx = subTabOrder.indexOf(activeTab);
                  if (curIdx < subTabOrder.length - 1) {
                    setActiveTab(subTabOrder[curIdx + 1]);
                  }
                }}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#004B87] to-[#006BB8] text-xs font-bold text-white flex items-center gap-2 shadow-md shadow-[#004B87]/25 hover:shadow-lg hover:from-[#003d6e] hover:to-[#005c9e] transition-all cursor-pointer active:scale-95"
              >
                <span>Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-700 flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <span>Back to Overview</span>
              </button>
            )}

            {isEadReviewerOrAdmin && (
              <>
                <button
                  type="button"
                  onClick={() => setActiveReviewModal('revert')}
                  className="px-5 py-2.5 rounded-xl bg-white hover:bg-amber-50 border border-amber-300 text-xs font-bold text-amber-700 flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Return for Correction</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveReviewModal('approve')}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-emerald-600/25 hover:shadow-lg transition-all cursor-pointer active:scale-95"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Approve & Publish</span>
                </button>
              </>
            )}
          </>
        ) : (
          <>
            {/* Cancel Button */}
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-700 flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Cancel</span>
            </button>

            {/* Save Draft Button */}
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-[#004B87] text-xs font-bold text-[#004B87] flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Bookmark className="w-3.5 h-3.5 fill-current" />
              <span>Save Draft</span>
            </button>

            {/* Next Steps Buttons */}
            {activeTab === 'report-details' && (
              <button
                type="button"
                onClick={() => setActiveTab('progress-status')}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#004B87] to-[#006BB8] text-xs font-bold text-white flex items-center gap-2 shadow-md shadow-[#004B87]/25 hover:shadow-lg hover:from-[#003d6e] hover:to-[#005c9e] transition-all cursor-pointer active:scale-95"
              >
                <span>Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {activeTab === 'progress-status' && (
              <button
                type="button"
                onClick={() => setActiveTab('ghg-emissions')}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#004B87] to-[#006BB8] text-xs font-bold text-white flex items-center gap-2 shadow-md shadow-[#004B87]/25 hover:shadow-lg hover:from-[#003d6e] hover:to-[#005c9e] transition-all cursor-pointer active:scale-95"
              >
                <span>Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {activeTab === 'ghg-emissions' && (
              <button
                type="button"
                onClick={() => setActiveTab('supporting-submit')}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#004B87] to-[#006BB8] text-xs font-bold text-white flex items-center gap-2 shadow-md shadow-[#004B87]/25 hover:shadow-lg hover:from-[#003d6e] hover:to-[#005c9e] transition-all cursor-pointer active:scale-95"
              >
                <span>Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {activeTab === 'supporting-submit' && (
              <button
                type="button"
                onClick={handleSubmit}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#004B87] to-[#006BB8] text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-[#004B87]/25 hover:shadow-lg hover:from-[#003d6e] hover:to-[#005c9e] transition-all cursor-pointer active:scale-95"
                title="Submit Performance Report"
              >
                <span>Submit Performance Report</span>
                <Send className="w-3.5 h-3.5 fill-current opacity-80" />
              </button>
            )}
          </>
        )}
      </div>

      {/* Reviewer Action Modal */}
      {activeReviewModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800">
                {activeReviewModal === 'approve' ? 'Approve & Publish Performance Report' : 'Return Performance Report for Correction'}
              </h3>
              <button
                onClick={() => setActiveReviewModal(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Official Reviewer Notes / Feedback
              </label>
              <textarea
                rows={3}
                value={reviewerComments}
                onChange={(e) => setReviewerComments(e.target.value)}
                placeholder={
                  activeReviewModal === 'approve'
                    ? 'All performance deliverables, indicators, and reported metrics verified.'
                    : 'Please specify the exact milestones or evidence requiring correction...'
                }
                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-[#004B87]"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setActiveReviewModal(null)}
                className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              {activeReviewModal === 'approve' ? (
                <button
                  onClick={handleApproveReport}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Confirm Approval</span>
                </button>
              ) : (
                <button
                  onClick={handleRevertReport}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Confirm Return</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
