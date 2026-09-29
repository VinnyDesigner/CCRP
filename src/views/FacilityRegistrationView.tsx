import React, { useState, useRef, useMemo, useEffect } from 'react';
import {
  Search,
  ChevronDown,
  X,
  Bookmark,
  Send,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Eye,
  Edit,
  Plus,
  ArrowLeft,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Trash2,
} from 'lucide-react';
import { useMRV } from '../context/MRVContext';
import { FieldTooltip } from '../components/ui/FieldTooltip';
import { SortTriangles } from '../components/ui/SortTriangles';
import emptyFolderIcon from '../assets/empty-folder-icon.png';

import {
  FacilityRegistrationVersionSnapshot,
  CCRPProjectRegistration,
  BLANK_FACILITY_REGISTRATION,
  SAMPLE_DEMO_FACILITY_REGISTRATION,
  INITIAL_FACILITY_REGISTRATIONS,
  CCRP_ENTITIES,
  CCRP_SUB_ENTITIES,
  CCRP_STRATEGIC_OBJECTIVES,
  CCRP_PROJECT_SECTORS,
  CCRP_INITIATIVE_TYPES,
  CCRP_INITIATIVE_SOURCES,
  CCRP_SCOPES,
  CCRP_PILLARS,
  CCRP_INDICATORS_TARGETS_CHECKLIST,
  CCRP_INDICATORS_BY_PILLAR,
} from '../data/facilityRegistrationsData';
export type { FacilityRegistrationVersionSnapshot, CCRPProjectRegistration };

const REGISTRATION_STEPS = [
  { id: 'project-details', stepNumber: 1, title: 'Project Details' },
  { id: 'project-classification', stepNumber: 2, title: 'Project Classification & Timeline' },
  { id: 'indicators-targets', stepNumber: 3, title: 'Indicators & Targets' },
] as const;

type StepTabId = 'project-details' | 'project-classification' | 'indicators-targets';

export const FacilityRegistrationView: React.FC = () => {
  const {
    activeFacility,
    updateFacility,
    setActiveView,
    currentRole,
    facilities,
    setActiveFacilityId,
    deleteFacility,
    operatorFacilityIds,
    setOperatorFacilityIds,
    hasCreatedFirstFacility,
    setHasCreatedFirstFacility,
    facilityRegistrations,
    setFacilityRegistrations,
    facilityRegistrationHistory,
    setFacilityRegistrationHistory,
  } = useMRV();

  const isFacilityOperator = currentRole === 'FACILITY_OPERATOR';
  const isEadReviewerOrAdmin = currentRole === 'EAD_REVIEWER' || (currentRole as string) === 'ADMIN';

  // VIEW MODE: 'table' (Overview Table) | 'form' (Edit/Add Form) | 'view' (Read-Only Inspection)
  const [viewMode, setViewMode] = useState<'table' | 'form' | 'view'>('table');
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>(activeFacility?.id || 'fac-1');

  // Version History State for Read-Only View
  const [selectedVersion, setSelectedVersion] = useState<string>('V1');
  const [isVersionDropdownOpen, setIsVersionDropdownOpen] = useState<boolean>(false);
  const versionDropdownRef = useRef<HTMLDivElement>(null);

  // Search & Filter State for Overview Table
  const [tableSearchTerm, setTableSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [pillarFilter, setPillarFilter] = useState<string>('ALL');
  const [deletedFacilityIds, setDeletedFacilityIds] = useState<string[]>([]);

  const [isSavedNotice, setIsSavedNotice] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState('Changes Saved!');
  const [reviewerComments, setReviewerComments] = useState<string>('');
  const [formValidationErrors, setFormValidationErrors] = useState<string[]>([]);

  // Active form stepper tab: 3 tabs
  const [formActiveTab, setFormActiveTab] = useState<StepTabId>('project-details');
  const [viewActiveTab, setViewActiveTab] = useState<StepTabId>('project-details');

  // Track if fields are in inline-custom text mode
  const [isCustomScopeInput, setIsCustomScopeInput] = useState<boolean>(false);
  const [isCustomSectorInput, setIsCustomSectorInput] = useState<boolean>(false);
  const [isCustomObjectiveInput, setIsCustomObjectiveInput] = useState<boolean>(false);
  const [isCustomInitiativeTypeInput, setIsCustomInitiativeTypeInput] = useState<boolean>(false);
  const [isCustomPillarInput, setIsCustomPillarInput] = useState<boolean>(false);
  const [isCustomSourceInput, setIsCustomSourceInput] = useState<boolean>(false);

  // Current active form data (synced with selected initiative)
  const [formData, setFormData] = useState<CCRPProjectRegistration>(() => {
    if (isFacilityOperator && operatorFacilityIds.length === 0) {
      return { ...SAMPLE_DEMO_FACILITY_REGISTRATION, status: 'Draft', initiativeId: '' };
    }
    const id = activeFacility?.id || 'fac-1';
    return (
      (facilityRegistrations[id] as CCRPProjectRegistration) ||
      (facilityRegistrations['fac-1'] as CCRPProjectRegistration) || { ...BLANK_FACILITY_REGISTRATION }
    );
  });

  // Close version dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (versionDropdownRef.current && !versionDropdownRef.current.contains(event.target as Node)) {
        setIsVersionDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Determine all registered initiatives with sample demo records
  const allInitiativesList = useMemo(() => {
    const allKeys = Array.from(
      new Set([
        ...Object.keys(INITIAL_FACILITY_REGISTRATIONS),
        ...Object.keys(facilityRegistrations),
        ...facilities.map((f) => f.id),
      ])
    ).filter((id) => !deletedFacilityIds.includes(id));

    return allKeys
      .map((id) => {
        const reg = (facilityRegistrations[id] || (INITIAL_FACILITY_REGISTRATIONS as any)[id]) as any;
        const fac = facilities.find((f) => f.id === id);
        if (!reg && !fac) return null;

        const rawStatus = reg?.status || fac?.status || 'Submitted';
        const normalizeStatus = (st: string) => {
          if (st === 'Approved' || st === 'Registered' || st === 'Approved / Published' || st === 'Approved / Registered') return 'Approved';
          if (st === 'Correction Required' || st === 'Returned for Correction' || st === 'Reverted' || st === 'Correction Requested') return 'Correction Requested';
          if (st === 'Under EAD Review' || st === 'Under Review') return 'Under Review';
          if (st === 'Submitted') return 'Submitted';
          return 'Draft';
        };
        const status = normalizeStatus(rawStatus);

        const initiativeDisplayName =
          (reg?.initiativeName && reg.initiativeName.trim() !== '')
            ? reg.initiativeName
            : (reg?.facilityName && reg.facilityName.trim() !== '')
              ? reg.facilityName
              : (fac?.name && fac.name.trim() !== '')
                ? fac.name
                : (status === 'Draft' ? 'Draft Initiative' : 'Registered Initiative');

        const initiativeCode = (status === 'Draft' || reg?.status === 'Draft') ? '—' : (reg?.initiativeId || reg?.facilityId || fac?.facilityCode || '—');
        const entityDisplayName = reg?.entity || reg?.operatorName || fac?.operatorName || 'Department of Energy (DoE)';
        const pillar = reg?.pillar || (fac as any)?.pillar || 'Mitigation';

        return {
          id,
          name: initiativeDisplayName,
          initiativeCode,
          entity: entityDisplayName,
          pillar,
          status,
          rawStatus,
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);
  }, [facilities, facilityRegistrations, deletedFacilityIds]);

  // Filtered initiatives list for Overview Table
  const filteredFacilities = useMemo(() => {
    return allInitiativesList.filter((fac) => {
      const matchesSearch =
        fac.name.toLowerCase().includes(tableSearchTerm.toLowerCase()) ||
        fac.initiativeCode.toLowerCase().includes(tableSearchTerm.toLowerCase()) ||
        fac.entity.toLowerCase().includes(tableSearchTerm.toLowerCase()) ||
        fac.pillar.toLowerCase().includes(tableSearchTerm.toLowerCase()) ||
        fac.status.toLowerCase().includes(tableSearchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === 'ALL' ||
        fac.status === statusFilter;

      const matchesPillar =
        pillarFilter === 'ALL' ||
        fac.pillar === pillarFilter;

      return matchesSearch && matchesStatus && matchesPillar;
    });
  }, [allInitiativesList, tableSearchTerm, statusFilter, pillarFilter]);

  // Overview Table Sorting & Pagination
  type FacilitySortField = 'index' | 'name' | 'id' | 'entity' | 'pillar' | 'status';
  type SortDirection = 'asc' | 'desc';

  const [sortField, setSortField] = useState<FacilitySortField>('index');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (field: FacilitySortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(7);

  const sortedFacilities = useMemo(() => {
    if (sortField === 'index') {
      return sortDirection === 'asc' ? filteredFacilities : [...filteredFacilities].reverse();
    }
    return [...filteredFacilities].sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      const idA = a.initiativeCode.toLowerCase();
      const idB = b.initiativeCode.toLowerCase();
      const entityA = a.entity.toLowerCase();
      const entityB = b.entity.toLowerCase();
      const pillarA = a.pillar.toLowerCase();
      const pillarB = b.pillar.toLowerCase();
      const statusA = a.status.toLowerCase();
      const statusB = b.status.toLowerCase();

      let cmp = 0;
      if (sortField === 'name') cmp = nameA.localeCompare(nameB);
      else if (sortField === 'id') cmp = idA.localeCompare(idB);
      else if (sortField === 'entity') cmp = entityA.localeCompare(entityB);
      else if (sortField === 'pillar') cmp = pillarA.localeCompare(pillarB);
      else if (sortField === 'status') cmp = statusA.localeCompare(statusB);

      return sortDirection === 'asc' ? cmp : -cmp;
    });
  }, [filteredFacilities, sortField, sortDirection]);

  const totalPages = Math.ceil(sortedFacilities.length / itemsPerPage) || 1;

  const paginatedFacilities = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedFacilities.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedFacilities, currentPage, itemsPerPage]);

  // Available version records for currently inspected initiative
  const currentFacilityVersions = useMemo(() => {
    const history = facilityRegistrationHistory[selectedFacilityId];
    if (history && history.length > 0) {
      return history;
    }
    const currentReg = (facilityRegistrations[selectedFacilityId] || formData) as any;
    return [
      {
        version: currentReg.version || 'v1.0',
        status: currentReg.status || 'Approved / Published',
        updatedDate: currentReg.updatedDate || '18 Jan 2026',
        submittedDate: currentReg.submittedDate || '10 Jan 2026',
        isCurrent: true,
        data: currentReg,
      },
    ];
  }, [facilityRegistrationHistory, selectedFacilityId, facilityRegistrations, formData]);

  // Exact snapshot data for the selected version
  const viewingData = useMemo(() => {
    const history = facilityRegistrationHistory[selectedFacilityId];
    if (history && history.length > 0) {
      const found = history.find((v) => v.version.toLowerCase() === selectedVersion.toLowerCase());
      if (found) return found.data as CCRPProjectRegistration;
    }
    return (facilityRegistrations[selectedFacilityId] || formData) as CCRPProjectRegistration;
  }, [facilityRegistrationHistory, selectedFacilityId, selectedVersion, facilityRegistrations, formData]);

  // Open Edit Form for specific initiative
  const handleEditFacility = (facilityId: string) => {
    setSelectedFacilityId(facilityId);
    setActiveFacilityId(facilityId);
    const existing = facilityRegistrations[facilityId] as CCRPProjectRegistration;
    if (existing) {
      setFormData({
        ...existing,
      });
      setSelectedVersion(existing.version || 'V1');
      setIsCustomScopeInput(existing.scope === 'Other' || Boolean(existing.scopeOther));
      setIsCustomSourceInput(existing.initiativeSource === 'Other' || Boolean(existing.initiativeSourceOther));
    } else {
      const fac = facilities.find((f) => f.id === facilityId);
      setFormData({
        ...SAMPLE_DEMO_FACILITY_REGISTRATION,
        initiativeName: fac?.name || 'New Initiative',
        initiativeId: fac?.facilityCode || '',
        entity: fac?.operatorName || 'Department of Energy (DoE)',
      });
      setSelectedVersion('V1');
      setIsCustomScopeInput(false);
      setIsCustomSourceInput(false);
    }
    setIsVersionDropdownOpen(false);
    setFormActiveTab('project-details');
    setFormValidationErrors([]);
    setViewMode('form');
  };

  // Open Read-Only View for specific initiative
  const handleViewFacility = (facilityId: string) => {
    setSelectedFacilityId(facilityId);
    setActiveFacilityId(facilityId);
    const existing = facilityRegistrations[facilityId] as CCRPProjectRegistration;
    if (existing) {
      setFormData(existing);
      setSelectedVersion(existing.version || 'V1');
      setReviewerComments(existing.reviewerComments || '');
      setIsCustomScopeInput(existing.scope === 'Other' || Boolean(existing.scopeOther));
      setIsCustomSourceInput(existing.initiativeSource === 'Other' || Boolean(existing.initiativeSourceOther));
    } else {
      setSelectedVersion('V1');
      setReviewerComments('');
      setIsCustomScopeInput(false);
      setIsCustomSourceInput(false);
    }
    setIsVersionDropdownOpen(false);
    setViewActiveTab('project-details');
    setViewMode('view');
  };

  // Add New Initiative Flow
  const handleAddNewFacility = () => {
    const newId = `fac-new-${Date.now()}`;
    setSelectedFacilityId(newId);

    setFormData({
      ...SAMPLE_DEMO_FACILITY_REGISTRATION,
      status: 'Draft',
      initiativeId: '',
    });
    setHasCreatedFirstFacility(true);
    setIsCustomScopeInput(false);
    setIsCustomSourceInput(false);

    setFormActiveTab('project-details');
    setFormValidationErrors([]);
    setViewMode('form');
  };

  // Delete Initiative (Draft)
  const handleDeleteFacility = (facilityId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this initiative draft?')) {
      setDeletedFacilityIds((prev) => (prev.includes(facilityId) ? prev : [...prev, facilityId]));
      deleteFacility(facilityId);
      setOperatorFacilityIds((prev) => prev.filter((id) => id !== facilityId));
      setFacilityRegistrations((prev) => {
        const next = { ...prev };
        delete next[facilityId];
        return next;
      });
      setFacilityRegistrationHistory((prev) => {
        const next = { ...prev };
        delete next[facilityId];
        return next;
      });
    }
  };

  const handleInputChange = (field: keyof CCRPProjectRegistration | string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
      ...(field === 'initiativeName' ? { facilityName: value } : {}),
      ...(field === 'initiativeId' ? { facilityId: value } : {}),
      ...(field === 'entity' ? { operatorName: value } : {}),
    }));
  };

  const toggleIndicatorTarget = (item: string) => {
    setFormData((prev) => {
      const list = prev.indicatorsAndTargets || [];
      const updated = list.includes(item)
        ? list.filter((i) => i !== item)
        : [...list, item];
      return { ...prev, indicatorsAndTargets: updated };
    });
  };

  // Validation function for each step (relaxed for demo navigation)
  const validateStep = (_step: StepTabId): boolean => {
    setFormValidationErrors([]);
    return true;
  };

  // Save changes as Draft
  const handleSave = () => {
    const targetId = selectedFacilityId || `fac-draft-${Date.now()}`;
    const todayStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const isApproved = formData.status === 'Approved' || formData.status === 'Approved / Published';
    const status: 'Draft' | 'Approved / Published' = isApproved ? 'Approved / Published' : 'Draft';
    const initiativeName = (formData.initiativeName && formData.initiativeName.trim() !== '')
      ? formData.initiativeName
      : (isApproved ? 'Registered Initiative' : 'Draft Initiative');

    const updated: CCRPProjectRegistration = {
      ...formData,
      status,
      initiativeName,
      facilityName: initiativeName,
      initiativeId: isApproved ? (formData.initiativeId || '') : '',
      facilityId: isApproved ? (formData.initiativeId || '') : '',
      operatorName: formData.entity || 'Department of Energy (DoE)',
      updatedDate: todayStr,
    };

    setFacilityRegistrations((prev) => ({
      ...prev,
      [targetId]: updated,
    }));

    setOperatorFacilityIds((prev) => (prev.includes(targetId) ? prev : [...prev, targetId]));

    setFacilityRegistrationHistory((prev) => {
      const facilityHist = prev[targetId] || [];
      const updatedHist = facilityHist.map((v) => {
        if (v.version.toLowerCase() === (updated.version || 'v1.0').toLowerCase()) {
          return { ...v, status, updatedDate: updated.updatedDate, data: updated };
        }
        return v;
      });
      return {
        ...prev,
        [targetId]:
          updatedHist.length > 0
            ? updatedHist
            : [
              {
                version: updated.version || 'v1.0',
                status,
                submittedDate: updated.submittedDate || '—',
                updatedDate: updated.updatedDate,
                isCurrent: true,
                data: updated,
              },
            ],
      };
    });

    setFormData(updated);
    setSelectedFacilityId(targetId);
    setActiveFacilityId(targetId);

    updateFacility({
      id: targetId,
      name: initiativeName,
      operatorName: formData.entity || 'Department of Energy (DoE)',
      facilityCode: isApproved ? formData.initiativeId : '',
      status: (isApproved ? 'Approved / Published' : 'Draft') as any,
      pillar: formData.pillar || 'Mitigation',
    } as any);

    setIsSavedNotice(true);
    setNoticeMessage('Draft Project Registration Saved!');
    setTimeout(() => setIsSavedNotice(false), 3000);
    setViewMode('table');
  };

  const handleSubmitRegistration = () => {
    if (!validateStep('project-details') || !validateStep('project-classification') || !validateStep('indicators-targets')) {
      return;
    }
    const targetId = selectedFacilityId || `fac-new-${Date.now()}`;
    const todayStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const initiativeName = (formData.initiativeName && formData.initiativeName.trim() !== '') ? formData.initiativeName : 'Registered Initiative';

    const generatedId =
      formData.initiativeId && formData.initiativeId.startsWith('CCRP-INIT')
        ? formData.initiativeId
        : (activeFacility?.facilityCode && activeFacility.facilityCode.startsWith('CCRP-INIT')
          ? activeFacility.facilityCode
          : (targetId === 'fac-1' ? 'CCRP-INIT-2026-0891' : `CCRP-INIT-2026-${Math.floor(1000 + Math.random() * 9000)}`));

    const updated: CCRPProjectRegistration = {
      ...formData,
      status: 'Submitted',
      initiativeName,
      facilityName: initiativeName,
      initiativeId: generatedId,
      facilityId: generatedId,
      operatorName: formData.entity || 'Department of Energy (DoE)',
      submittedDate: todayStr,
      updatedDate: todayStr,
    };

    setFacilityRegistrations((prev) => ({
      ...prev,
      [targetId]: updated,
    }));

    setOperatorFacilityIds((prev) => (prev.includes(targetId) ? prev : [...prev, targetId]));

    setFacilityRegistrationHistory((prev) => {
      const facilityHist = prev[targetId] || [];
      const newSnapshot: FacilityRegistrationVersionSnapshot = {
        version: updated.version || 'v1.0',
        status: 'Submitted',
        submittedDate: updated.submittedDate,
        updatedDate: updated.updatedDate,
        isCurrent: true,
        data: updated,
      };
      return { ...prev, [targetId]: [newSnapshot, ...facilityHist] };
    });

    setFormData(updated);

    updateFacility({
      id: targetId,
      name: initiativeName,
      facilityCode: generatedId,
      operatorName: updated.entity || 'Department of Energy (DoE)',
      status: 'Submitted' as any,
      pillar: updated.pillar || 'Mitigation',
    } as any);

    setActiveFacilityId(targetId);
    setIsSavedNotice(true);
    setNoticeMessage('Project Registration Submitted for EAD Review!');
    setTimeout(() => setIsSavedNotice(false), 3000);
    setViewMode('table');
  };

  const handleEadApprove = () => {
    const generatedId =
      formData.initiativeId && formData.initiativeId.startsWith('CCRP-INIT')
        ? formData.initiativeId
        : `CCRP-INIT-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const todayStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const updated: CCRPProjectRegistration = {
      ...formData,
      initiativeId: generatedId,
      facilityId: generatedId,
      status: 'Approved',
      reviewedDate: todayStr,
      updatedDate: todayStr,
      reviewerComments: reviewerComments || 'Initiative verified and approved under CCRP statutory framework.',
    };

    setFacilityRegistrations((prev) => ({
      ...prev,
      [selectedFacilityId]: updated,
    }));

    setFacilityRegistrationHistory((prev) => {
      const facilityHist = prev[selectedFacilityId] || [];
      const updatedHist = facilityHist.map((v) => {
        if (v.version.toLowerCase() === (updated.version || 'v1.0').toLowerCase()) {
          return { ...v, status: 'Approved', updatedDate: updated.updatedDate, data: updated };
        }
        return v;
      });
      return { ...prev, [selectedFacilityId]: updatedHist };
    });

    setFormData(updated);

    updateFacility({
      id: selectedFacilityId,
      name: updated.initiativeName,
      facilityCode: generatedId,
      status: 'Approved',
      operatorName: updated.entity,
      pillar: updated.pillar || 'Mitigation',
    } as any);

    setIsSavedNotice(true);
    setNoticeMessage('Project Registration Approved!');
    setTimeout(() => setIsSavedNotice(false), 3000);
    setViewMode('table');
  };

  const handleReturnForCorrection = () => {
    const todayStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const updated: CCRPProjectRegistration = {
      ...formData,
      status: 'Returned for Correction',
      reviewerComments: reviewerComments || 'Please provide updated project classification and revised indicators.',
      correctionDeadlineDate: '2026-06-30',
      updatedDate: todayStr,
    };

    setFacilityRegistrations((prev) => ({
      ...prev,
      [selectedFacilityId]: updated,
    }));

    setFacilityRegistrationHistory((prev) => {
      const facilityHist = prev[selectedFacilityId] || [];
      const updatedHist = facilityHist.map((v) => {
        if (v.version.toLowerCase() === (updated.version || 'v1.0').toLowerCase()) {
          return { ...v, status: 'Returned for Correction', updatedDate: updated.updatedDate, data: updated };
        }
        return v;
      });
      return { ...prev, [selectedFacilityId]: updatedHist };
    });

    setFormData(updated);
    setIsSavedNotice(true);
    setNoticeMessage('Initiative Registration Returned for Correction.');
    setTimeout(() => setIsSavedNotice(false), 3000);
    setViewMode('table');
  };

  // Check available sub-entities based on selected entity
  const availableSubEntities = useMemo(() => {
    return CCRP_SUB_ENTITIES[formData.entity] || [];
  }, [formData.entity]);

  // Pillar-driven indicators list for Tab 3
  const applicableIndicators = useMemo(() => {
    const selectedPillar = formData.pillar || 'Mitigation';
    return CCRP_INDICATORS_BY_PILLAR[selectedPillar] || CCRP_INDICATORS_TARGETS_CHECKLIST;
  }, [formData.pillar]);

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
    if (rawStatus === 'Approved / Published' || rawStatus === 'Approved') {
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
  // VIEW MODE 1: OVERVIEW TABLE LANDING PAGE
  // =========================================================================
  if (viewMode === 'table') {
    if (allInitiativesList.length === 0) {
      return (
        <div className="h-full flex flex-col font-sans py-1 animate-fade-in">
          {/* Header */}
          <div className="flex-shrink-0 pb-[18px] pt-0.5 flex items-center justify-between gap-3">
            <div>
              <h1 className="text-[18px] font-bold font-display text-[#336D9F] tracking-tight whitespace-nowrap">
                Project Registration
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Register and manage climate change initiatives and track their progress
              </p>
            </div>
          </div>

          {/* White Color Frame */}
          <div className="w-full bg-white rounded-xl border border-slate-200/90 shadow-xs flex flex-col items-center justify-center py-12 px-6">
            <div className="flex flex-col items-center text-center max-w-md">
              <img
                src={emptyFolderIcon}
                alt="No Initiatives Registered"
                className="w-[84px] h-[74px] object-contain mb-3.5 select-none"
                draggable={false}
              />

              <h2 className="text-[15px] font-bold text-[#336D9F] tracking-tight">
                No Initiatives Registered
              </h2>
              <p className="text-[11.5px] text-slate-500 font-normal mt-1 max-w-sm">
                You haven't registered any climate change initiatives yet. Start by registering your first initiative.
              </p>

              <button
                onClick={handleAddNewFacility}
                className="mt-4 h-9 px-4 bg-gradient-to-r from-[#004B87] to-[#006BB8] text-white rounded-[8px] text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#004B87]/25 hover:shadow-lg hover:from-[#003d6e] hover:to-[#005c9e] transition-all cursor-pointer active:scale-95 shrink-0 whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Project</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="h-full flex flex-col overflow-hidden font-sans py-1 animate-fade-in">
        {/* Top Header Row with Title, Search, Filter & Add New Project Button */}
        <div className="flex-shrink-0 pb-[18px] pt-0.5 flex items-center justify-between gap-3 min-w-0">
          <div className="min-w-0 shrink">
            <h1 className="text-[18px] font-bold font-display text-[#336D9F] tracking-tight whitespace-nowrap">
              Project Registration
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5 truncate max-w-lg xl:max-w-xl">
              Register and manage climate change initiatives and track their progress
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-nowrap">
            {/* Search Box */}
            <div className="relative w-36 sm:w-44 xl:w-48">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 z-10 pointer-events-none" />
              <FieldTooltip content="Filter records by project name, ID, entity, pillar, or registration status.">
                <input
                  type="text"
                  placeholder="Search projects..."
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
              <FieldTooltip content="Filter initiatives by status.">
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
              <FieldTooltip content="Filter initiatives by Strategy Pillar.">
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

            {/* Add New Project Button */}
            {isFacilityOperator && (
              <button
                type="button"
                onClick={handleAddNewFacility}
                className="h-9 px-4 bg-gradient-to-r from-[#004B87] to-[#006BB8] text-white rounded-[8px] text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#004B87]/25 hover:shadow-lg hover:from-[#003d6e] hover:to-[#005c9e] transition-all cursor-pointer active:scale-95 shrink-0 whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Project</span>
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
                    className="h-[38px] px-3 w-[26%] align-middle bg-[#D6E3EF] hover:bg-[#C8D9E8] transition-colors cursor-pointer group"
                    title="Sort by Project/Initiative Name"
                  >
                    <div className="flex items-center">
                      <span>Project/Initiative Name</span>
                      <SortTriangles active={sortField === 'name'} direction={sortDirection} />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('id')}
                    className="h-[38px] px-3 w-[17%] whitespace-nowrap align-middle bg-[#D6E3EF] hover:bg-[#C8D9E8] transition-colors cursor-pointer group"
                    title="Sort by Project ID"
                  >
                    <div className="flex items-center">
                      <span>Project ID</span>
                      <SortTriangles active={sortField === 'id'} direction={sortDirection} />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('entity')}
                    className="h-[38px] px-3 w-[20%] align-middle bg-[#D6E3EF] hover:bg-[#C8D9E8] transition-colors cursor-pointer group"
                    title="Sort by Entity"
                  >
                    <div className="flex items-center">
                      <span>Entity</span>
                      <SortTriangles active={sortField === 'entity'} direction={sortDirection} />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('pillar')}
                    className="h-[38px] px-3 w-[12%] whitespace-nowrap align-middle bg-[#D6E3EF] hover:bg-[#C8D9E8] transition-colors cursor-pointer group"
                    title="Sort by Pillar"
                  >
                    <div className="flex items-center">
                      <span>Pillar</span>
                      <SortTriangles active={sortField === 'pillar'} direction={sortDirection} />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('status')}
                    className="h-[38px] px-3 w-[12%] whitespace-nowrap text-left align-middle bg-[#D6E3EF] hover:bg-[#C8D9E8] transition-colors cursor-pointer group"
                    title="Sort by Status"
                  >
                    <div className="flex items-center">
                      <span>Status</span>
                      <SortTriangles active={sortField === 'status'} direction={sortDirection} />
                    </div>
                  </th>
                  <th className="h-[38px] px-4 w-[8%] text-right whitespace-nowrap align-middle bg-[#D6E3EF]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-normal text-slate-700">
                {paginatedFacilities.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400 font-medium">
                      No initiative records match the selected filter criteria.
                    </td>
                  </tr>
                ) : (
                  paginatedFacilities.map((fac, idx) => {
                    const rowNumber = (currentPage - 1) * itemsPerPage + idx + 1;

                    return (
                      <tr
                        key={fac.id}
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
                            onClick={() => handleViewFacility(fac.id)}
                            title={fac.name}
                          >
                            {fac.name}
                          </div>
                        </td>

                        {/* 3. Project ID */}
                        <td className="h-[60px] px-3 font-mono font-bold text-[#004B87] whitespace-nowrap align-middle">
                          <span>{fac.initiativeCode}</span>
                        </td>

                        {/* 4. Entity */}
                        <td className="h-[60px] px-3 text-slate-600 align-middle overflow-hidden">
                          <div className="line-clamp-2 leading-snug break-words" title={fac.entity}>
                            {fac.entity}
                          </div>
                        </td>

                        {/* 5. Pillar */}
                        <td className="h-[60px] px-3 whitespace-nowrap align-middle">
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border inline-flex items-center gap-1 ${getPillarBadgeColor(fac.pillar)}`}>
                            {fac.pillar}
                          </span>
                        </td>

                        {/* 6. Status */}
                        <td className="h-[60px] px-3 whitespace-nowrap text-left align-middle">
                          {renderStatusBadge(fac.status)}
                        </td>

                        {/* 7. Actions */}
                        <td className="h-[60px] px-4 whitespace-nowrap align-middle text-right">
                          <div className="flex items-center justify-end gap-2.5">
                            {/* View Action */}
                            <button
                              type="button"
                              onClick={() => handleViewFacility(fac.id)}
                              title="View Project Details"
                              className="text-slate-600 hover:text-[#004B87] transition-colors cursor-pointer p-1 rounded-md hover:bg-[#004B87]/10"
                            >
                              <Eye className="w-[18px] h-[18px] stroke-[1.75]" />
                            </button>

                            {/* Edit Action */}
                            <button
                              type="button"
                              onClick={() => handleEditFacility(fac.id)}
                              title="Edit Project"
                              className="text-slate-600 hover:text-[#004B87] transition-colors cursor-pointer p-1 rounded-md hover:bg-[#004B87]/10"
                            >
                              <Edit className="w-[18px] h-[18px] stroke-[1.75]" />
                            </button>

                            {/* Delete Action (Only for Draft status) */}
                            {fac.status === 'Draft' && (
                              <button
                                type="button"
                                onClick={(e) => handleDeleteFacility(fac.id, e)}
                                title="Delete Draft Project"
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
              Showing {sortedFacilities.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to{' '}
              {Math.min(currentPage * itemsPerPage, sortedFacilities.length)} of {sortedFacilities.length} projects
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
  // VIEW MODE: FORM (Project Registration Add / Edit Form — EXACTLY 3 TABS)
  // =========================================================================
  if (viewMode === 'form') {
    const isEditMode = Boolean(formData.initiativeId || (activeFacility && activeFacility.facilityCode));
    return (
      <div className="h-full flex flex-col overflow-hidden font-sans py-1">
        {/* Page Header */}
        <div className="flex-shrink-0 pb-[14px] pt-0.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className="text-[#004B87] hover:text-[#003d6e] p-0.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              title="Back to Overview"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2]" />
            </button>
            <h1 className="text-[18px] font-bold font-display text-[#004B87] tracking-tight">
              {isEditMode ? (formData.initiativeName || 'Edit Initiative') : 'Project Registration'}
            </h1>
            {formData.initiativeId && formData.status !== 'Draft' ? (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#EBF3FA] text-[#004B87] border border-[#004B87]/20 shadow-2xs inline-flex items-center">
                ID: {formData.initiativeId}
              </span>
            ) : null}
          </div>
        </div>

        {/* Form Validation Errors Banner */}
        {formValidationErrors.length > 0 && (
          <div className="flex-shrink-0 mb-3 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs">
            <div className="font-bold flex items-center gap-1.5 mb-1">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>Please correct the following before continuing:</span>
            </div>
            <ul className="list-disc list-inside space-y-0.5 pl-1">
              {formValidationErrors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Main Card Container */}
        <div className="flex-1 min-h-0 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-3.5 sm:p-4 flex flex-col overflow-hidden">
          {/* Stepper Navigation: Exactly 3 Steps */}
          <div className="flex-shrink-0 flex items-center pb-3 mb-1 overflow-x-auto no-scrollbar">
            <div className="inline-flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-[6px] shadow-2xs">
              {REGISTRATION_STEPS.map((step, idx) => {
                const currentStepNum =
                  formActiveTab === 'project-details'
                    ? 1
                    : formActiveTab === 'project-classification'
                      ? 2
                      : 3;
                const isActive = step.stepNumber === currentStepNum;
                const isCompleted = step.stepNumber < currentStepNum;
                const isArrowHighlighted = idx < currentStepNum - 1;

                return (
                  <React.Fragment key={step.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setFormActiveTab(step.id);
                        setFormValidationErrors([]);
                      }}
                      className={`px-3.5 py-1.5 rounded-[6px] text-xs transition-all flex items-center gap-2 cursor-pointer select-none ${isActive
                          ? 'bg-gradient-to-r from-[#004B87] to-[#006BB8] text-white font-bold shadow-xs'
                          : isCompleted
                            ? 'text-slate-700 hover:text-[#004B87] hover:bg-slate-50 font-semibold'
                            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50 font-medium'
                        }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 transition-all ${isActive
                            ? 'bg-white text-[#004B87] shadow-2xs'
                            : isCompleted
                              ? 'bg-[#00875A] text-white shadow-2xs'
                              : 'bg-white text-slate-400 border border-slate-300'
                          }`}
                      >
                        <span>{step.stepNumber}</span>
                      </div>
                      <span className="whitespace-nowrap">{step.title}</span>
                    </button>

                    {idx < REGISTRATION_STEPS.length - 1 && (
                      <ChevronRight
                        className={`w-4 h-4 shrink-0 mx-0.5 transition-colors ${isArrowHighlighted
                            ? 'text-[#004B87] stroke-[2.5]'
                            : 'text-slate-300'
                          }`}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Form Tab Content */}
          <div className="flex-1 min-h-0 overflow-y-auto space-y-5 pr-2.5 py-0.5 custom-scrollbar text-xs">
            {/* TAB 1: Project Details */}
            {formActiveTab === 'project-details' && (
              <div className="space-y-5">
                {/* 1. Project Information */}
                <div>
                  <h4 className="text-xs font-bold text-[#336D9F] mb-2.5">Project Information</h4>
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                      <div className="col-span-1">
                        <label className="block text-slate-700 font-semibold mb-1">
                          Initiative Name *
                        </label>
                        <FieldTooltip content="Official title of the climate change mitigation, adaptation, or economic diversification initiative." example="Al Dhafra Solar PV Decarbonization Program">
                          <input
                            type="text"
                            value={formData.initiativeName}
                            onChange={(e) => handleInputChange('initiativeName', e.target.value)}
                            placeholder="e.g. Al Dhafra Solar PV Decarbonization Program"
                            className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-navy-900 placeholder-slate-400 focus:outline-none focus:border-[#336D9F] shadow-xs font-medium text-xs"
                          />
                        </FieldTooltip>
                      </div>
                      <div className="hidden lg:block"></div>
                      <div className="hidden lg:block"></div>
                      <div className="hidden lg:block"></div>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Description *
                      </label>
                      <FieldTooltip content="Comprehensive narrative describing project scope, strategic goals, operational mechanisms, and expected climate outcomes." example="Utility-scale solar project to displace thermal gas power generation.">
                        <textarea
                          rows={3}
                          value={formData.description}
                          onChange={(e) => handleInputChange('description', e.target.value)}
                          placeholder="Provide a detailed executive description of the climate change initiative, goals, and implementation mechanisms..."
                          className="w-full p-3.5 bg-white border border-slate-200 rounded-lg text-navy-900 placeholder-slate-400 focus:outline-none focus:border-[#336D9F] shadow-xs leading-relaxed text-xs"
                        />
                      </FieldTooltip>
                    </div>
                  </div>
                </div>

                {/* 2. Entity Information (Exactly 4 fields in 1 row) */}
                <div>
                  <h4 className="text-xs font-bold text-[#336D9F] mb-2.5">Entity Information</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                    {/* Field 1: Entity */}
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Entity *
                      </label>
                      <FieldTooltip content="Lead governmental, public or private participating entity registered as the primary data provider for this initiative." example="Department of Energy (DoE)">
                        <select
                          value={formData.entity || ''}
                          onChange={(e) => handleInputChange('entity', e.target.value)}
                          className={`w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#336D9F] shadow-xs cursor-pointer text-xs ${!formData.entity ? 'text-slate-400 font-normal' : 'text-navy-900 font-medium'}`}
                        >
                          <option value="" disabled className="text-slate-400">Select Entity</option>
                          {CCRP_ENTITIES.map((ent) => (
                            <option key={ent} value={ent} className="text-navy-900">{ent}</option>
                          ))}
                        </select>
                      </FieldTooltip>
                    </div>

                    {/* Field 2: Supporting Entity */}
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Supporting Entity
                      </label>
                      <FieldTooltip content="Secondary or partner entity collaborating on the delivery and execution of the initiative." example="TAQA (Abu Dhabi National Energy Company)">
                        <select
                          value={formData.supportingEntity || ''}
                          onChange={(e) => handleInputChange('supportingEntity', e.target.value)}
                          className={`w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#336D9F] shadow-xs cursor-pointer text-xs ${!formData.supportingEntity ? 'text-slate-400 font-normal' : 'text-navy-900 font-medium'}`}
                        >
                          <option value="" className="text-slate-400">None / Optional</option>
                          {CCRP_ENTITIES.map((ent) => (
                            <option key={ent} value={ent} className="text-navy-900">{ent}</option>
                          ))}
                        </select>
                      </FieldTooltip>
                    </div>

                    {/* Field 3: Sub-Entity */}
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Sub-Entity
                      </label>
                      <FieldTooltip content="Designated internal directorate, division, or affiliate organization leading implementation." example="Clean & Renewable Energy Directorate">
                        {availableSubEntities.length > 0 ? (
                          <select
                            value={formData.subEntity || ''}
                            onChange={(e) => handleInputChange('subEntity', e.target.value)}
                            className={`w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#336D9F] shadow-xs cursor-pointer text-xs ${!formData.subEntity ? 'text-slate-400 font-normal' : 'text-navy-900 font-medium'}`}
                          >
                            <option value="" className="text-slate-400">Select Sub-Entity</option>
                            {availableSubEntities.map((sub) => (
                              <option key={sub} value={sub} className="text-navy-900">{sub}</option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type="text"
                            value={formData.subEntity}
                            onChange={(e) => handleInputChange('subEntity', e.target.value)}
                            placeholder="e.g. Directorate or Division"
                            className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-navy-900 placeholder-slate-400 focus:outline-none focus:border-[#336D9F] shadow-xs font-medium text-xs"
                          />
                        )}
                      </FieldTooltip>
                    </div>

                    {/* Column 4 empty */}
                    <div className="hidden lg:block"></div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Project Classification & Timeline */}
            {formActiveTab === 'project-classification' && (
              <div className="space-y-5">
                {/* 1. Project Classification (Row 1: exactly 4 fields, Row 2: 1 field, 3 empty) */}
                <div>
                  <h4 className="text-xs font-bold text-[#336D9F] mb-2.5">Project Classification</h4>
                  {/* Row 1: 4 fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 mb-2.5">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Project Sector
                      </label>
                      {isCustomSectorInput || formData.projectSector === 'Other' ? (
                        <FieldTooltip content="Custom economic or municipal sector governing the initiative." example="e.g. Circular Clean Tech">
                          <div className="relative">
                            <input
                              type="text"
                              autoFocus
                              value={formData.projectSectorOther !== undefined && formData.projectSectorOther !== '' ? formData.projectSectorOther : (formData.projectSector === 'Other' ? '' : formData.projectSector)}
                              onChange={(e) => {
                                handleInputChange('projectSector', 'Other');
                                handleInputChange('projectSectorOther', e.target.value);
                              }}
                              placeholder="Specify custom sector..."
                              className="w-full pl-3.5 pr-8 py-2 bg-white border border-[#336D9F] rounded-lg text-navy-900 placeholder-slate-400 focus:outline-none focus:border-[#336D9F] shadow-xs font-medium text-xs"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setIsCustomSectorInput(false);
                                handleInputChange('projectSector', CCRP_PROJECT_SECTORS[0]);
                                handleInputChange('projectSectorOther', '');
                              }}
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
                              title="Switch back to dropdown selection"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </FieldTooltip>
                      ) : (
                        <FieldTooltip content="Economic or municipal sector governing the initiative." example="Energy">
                          <select
                            value={formData.projectSector || 'Energy'}
                            onChange={(e) => {
                              if (e.target.value === 'Other') {
                                setIsCustomSectorInput(true);
                                handleInputChange('projectSector', 'Other');
                              } else {
                                handleInputChange('projectSector', e.target.value);
                                handleInputChange('projectSectorOther', '');
                              }
                            }}
                            className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#336D9F] shadow-xs cursor-pointer text-xs text-navy-900 font-medium"
                          >
                            {CCRP_PROJECT_SECTORS.map((sec) => (
                              <option key={sec} value={sec} className="text-navy-900">{sec}</option>
                            ))}
                          </select>
                        </FieldTooltip>
                      )}
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Type of Initiative
                      </label>
                      {isCustomInitiativeTypeInput || formData.typeOfInitiative === 'Other' ? (
                        <FieldTooltip content="Custom structural type of intervention." example="e.g. Public-Private Clean Innovation Hub">
                          <div className="relative">
                            <input
                              type="text"
                              autoFocus
                              value={formData.initiativeTypeOther !== undefined && formData.initiativeTypeOther !== '' ? formData.initiativeTypeOther : (formData.typeOfInitiative === 'Other' ? '' : formData.typeOfInitiative)}
                              onChange={(e) => {
                                handleInputChange('typeOfInitiative', 'Other');
                                handleInputChange('initiativeTypeOther', e.target.value);
                              }}
                              placeholder="Specify custom type of initiative..."
                              className="w-full pl-3.5 pr-8 py-2 bg-white border border-[#336D9F] rounded-lg text-navy-900 placeholder-slate-400 focus:outline-none focus:border-[#336D9F] shadow-xs font-medium text-xs"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setIsCustomInitiativeTypeInput(false);
                                handleInputChange('typeOfInitiative', CCRP_INITIATIVE_TYPES[0]);
                                handleInputChange('initiativeTypeOther', '');
                              }}
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
                              title="Switch back to dropdown selection"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </FieldTooltip>
                      ) : (
                        <FieldTooltip content="Structural type of intervention (Policy, Infrastructure, Pilot, etc.)." example="Infrastructure & Capital Projects">
                          <select
                            value={formData.typeOfInitiative || ''}
                            onChange={(e) => {
                              if (e.target.value === 'Other') {
                                setIsCustomInitiativeTypeInput(true);
                                handleInputChange('typeOfInitiative', 'Other');
                              } else {
                                handleInputChange('typeOfInitiative', e.target.value);
                                handleInputChange('initiativeTypeOther', '');
                              }
                            }}
                            className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#336D9F] shadow-xs cursor-pointer text-xs text-navy-900 font-medium"
                          >
                            {CCRP_INITIATIVE_TYPES.map((t) => (
                              <option key={t} value={t} className="text-navy-900">{t}</option>
                            ))}
                          </select>
                        </FieldTooltip>
                      )}
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Initiative Source
                      </label>
                      <FieldTooltip content="Official policy document or strategy mandate originating the project." example="Climate Change Strategy">
                        <select
                          value={formData.initiativeSource || CCRP_INITIATIVE_SOURCES[0]}
                          onChange={(e) => {
                            handleInputChange('initiativeSource', e.target.value);
                            handleInputChange('initiativeSourceOther', '');
                          }}
                          className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#336D9F] shadow-xs cursor-pointer text-xs text-navy-900 font-medium"
                        >
                          {CCRP_INITIATIVE_SOURCES.map((src) => (
                            <option key={src} value={src} className="text-navy-900">{src}</option>
                          ))}
                        </select>
                      </FieldTooltip>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Pillar
                      </label>
                      {isCustomPillarInput || formData.pillar === 'Others' || formData.pillar === 'Other' ? (
                        <FieldTooltip content="Custom strategic pillar determining reporting frequency and tracking." example="e.g. Circular Bioeconomy & Innovation">
                          <div className="relative">
                            <input
                              type="text"
                              autoFocus
                              value={formData.pillarOther !== undefined && formData.pillarOther !== '' ? formData.pillarOther : (formData.pillar === 'Others' || formData.pillar === 'Other' ? '' : formData.pillar)}
                              onChange={(e) => {
                                handleInputChange('pillar', 'Others');
                                handleInputChange('pillarOther', e.target.value);
                              }}
                              placeholder="Specify custom pillar..."
                              className="w-full pl-3.5 pr-8 py-2 bg-white border border-[#336D9F] rounded-lg text-navy-900 placeholder-slate-400 focus:outline-none focus:border-[#336D9F] shadow-xs font-medium text-xs"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setIsCustomPillarInput(false);
                                handleInputChange('pillar', 'Mitigation');
                                handleInputChange('pillarOther', '');
                              }}
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
                              title="Switch back to dropdown selection"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </FieldTooltip>
                      ) : (
                        <FieldTooltip content="Governing CCRP pillar determining reporting frequency and performance tracking." example="Mitigation">
                          <select
                            value={formData.pillar || 'Mitigation'}
                            onChange={(e) => {
                              if (e.target.value === 'Others' || e.target.value === 'Other') {
                                setIsCustomPillarInput(true);
                                handleInputChange('pillar', 'Others');
                              } else {
                                handleInputChange('pillar', e.target.value);
                                handleInputChange('pillarOther', '');
                              }
                            }}
                            className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#336D9F] shadow-xs cursor-pointer text-xs text-navy-900 font-medium"
                          >
                            <option value="Adaptation" className="text-navy-900">Adaptation</option>
                            <option value="Mitigation" className="text-navy-900">Mitigation</option>
                            <option value="Economic Diversification" className="text-navy-900">Economic Diversification</option>
                            <option value="Others" className="text-navy-900">Others</option>
                          </select>
                        </FieldTooltip>
                      )}
                    </div>
                  </div>

                  {/* Row 2: 1 field (Strategic Objective), remaining 3 columns empty space */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Strategic Objective
                      </label>
                      {isCustomObjectiveInput || formData.strategicObjective === 'Other' ? (
                        <FieldTooltip content="Custom strategic objective aligned with climate change policy." example="e.g. Expand Carbon Capture in Manufacturing Sector">
                          <div className="relative">
                            <input
                              type="text"
                              autoFocus
                              value={formData.strategicObjectiveOther !== undefined && formData.strategicObjectiveOther !== '' ? formData.strategicObjectiveOther : (formData.strategicObjective === 'Other' ? '' : formData.strategicObjective)}
                              onChange={(e) => {
                                handleInputChange('strategicObjective', 'Other');
                                handleInputChange('strategicObjectiveOther', e.target.value);
                              }}
                              placeholder="Specify custom strategic objective..."
                              className="w-full pl-3.5 pr-8 py-2 bg-white border border-[#336D9F] rounded-lg text-navy-900 placeholder-slate-400 focus:outline-none focus:border-[#336D9F] shadow-xs font-medium text-xs"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setIsCustomObjectiveInput(false);
                                handleInputChange('strategicObjective', CCRP_STRATEGIC_OBJECTIVES[0]);
                                handleInputChange('strategicObjectiveOther', '');
                              }}
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
                              title="Switch back to dropdown selection"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </FieldTooltip>
                      ) : (
                        <FieldTooltip content="Alignment with official Abu Dhabi Climate Change Strategic Objectives." example="Reduce GHG Emissions in Key Sectors">
                          <select
                            value={formData.strategicObjective || ''}
                            onChange={(e) => {
                              if (e.target.value === 'Other') {
                                setIsCustomObjectiveInput(true);
                                handleInputChange('strategicObjective', 'Other');
                              } else {
                                handleInputChange('strategicObjective', e.target.value);
                                handleInputChange('strategicObjectiveOther', '');
                              }
                            }}
                            className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#336D9F] shadow-xs cursor-pointer text-xs text-navy-900 font-medium truncate"
                          >
                            {CCRP_STRATEGIC_OBJECTIVES.map((obj) => (
                              <option key={obj} value={obj} className="text-navy-900">{obj}</option>
                            ))}
                          </select>
                        </FieldTooltip>
                      )}
                    </div>
                    {/* Remaining 3 columns in the 4-column row stay empty */}
                    <div className="hidden lg:block"></div>
                    <div className="hidden lg:block"></div>
                    <div className="hidden lg:block"></div>
                  </div>
                </div>

                {/* 2. Project Manager & Timeline (Exactly 4 fields in 1 row) */}
                <div>
                  <h4 className="text-xs font-bold text-[#336D9F] mb-2.5">Project Manager & Timeline</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                    {/* Field 1: Project Manager Name */}
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Project Manager Name *
                      </label>
                      <FieldTooltip content="Designated project manager responsible for overall operational delivery and reporting veracity." example="Eng. Saeed Al-Mehairbi">
                        <input
                          type="text"
                          value={formData.projectManagerName}
                          onChange={(e) => handleInputChange('projectManagerName', e.target.value)}
                          placeholder="e.g. Eng. Saeed Al-Mehairbi"
                          className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-navy-900 placeholder-slate-400 focus:outline-none focus:border-[#336D9F] shadow-xs font-medium text-xs"
                        />
                      </FieldTooltip>
                    </div>

                    {/* Field 2: Project Manager Contact Details */}
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Project Manager Contact Details *
                      </label>
                      <FieldTooltip content="Direct telephone number and corporate email address for the project manager." example="+971 2 694 4000 / saeed.mehairbi@doe.gov.ae">
                        <input
                          type="text"
                          value={formData.projectManagerContactDetails}
                          onChange={(e) => handleInputChange('projectManagerContactDetails', e.target.value)}
                          placeholder="e.g. +971 2 694 4000 / saeed.mehairbi@doe.gov.ae"
                          className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-navy-900 placeholder-slate-400 focus:outline-none focus:border-[#336D9F] shadow-xs font-medium text-xs"
                        />
                      </FieldTooltip>
                    </div>

                    {/* Field 3: Start Date */}
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Start Date
                      </label>
                      <FieldTooltip content="Official commencement or commissioning date of the initiative." format="YYYY-MM-DD" example="2023-01-01">
                        <input
                          type="date"
                          value={formData.startDate}
                          onChange={(e) => handleInputChange('startDate', e.target.value)}
                          className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-navy-900 focus:outline-none focus:border-[#336D9F] shadow-xs font-medium text-xs"
                        />
                      </FieldTooltip>
                    </div>

                    {/* Field 4: End Date */}
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        End Date
                      </label>
                      <FieldTooltip content="Projected completion or full operational handover date." format="YYYY-MM-DD" example="2027-12-31">
                        <input
                          type="date"
                          value={formData.endDate}
                          onChange={(e) => handleInputChange('endDate', e.target.value)}
                          className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-navy-900 focus:outline-none focus:border-[#336D9F] shadow-xs font-medium text-xs"
                        />
                      </FieldTooltip>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: Indicators & Targets (Toggle Switch Style) */}
            {formActiveTab === 'indicators-targets' && (
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-[#336D9F]">
                  Indicators and targets 2023-2027
                </h4>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <p className="text-[11px] text-slate-500 font-medium mb-1.5">
                    Select all applicable performance indicators and targets configured for this climate initiative (2023–2027):
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {applicableIndicators.map((item) => {
                      const isChecked = (formData.indicatorsAndTargets || []).includes(item);
                      return (
                        <div
                          key={item}
                          onClick={() => toggleIndicatorTarget(item)}
                          className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all cursor-pointer select-none ${
                            isChecked
                              ? 'bg-white border-[#004B87] shadow-2xs text-slate-900 font-semibold ring-1 ring-[#004B87]/20'
                              : 'bg-white/70 border-slate-200/90 text-slate-600 hover:bg-white hover:border-slate-300'
                          }`}
                        >
                          {/* Modern Toggle Switch on Left */}
                          <div
                            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                              isChecked ? 'bg-[#004B87]' : 'bg-slate-300'
                            }`}
                          >
                            <span
                              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                                isChecked ? 'translate-x-4' : 'translate-x-0'
                              }`}
                            />
                          </div>

                          <span className="text-[11px] leading-snug">
                            {item}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Form Mode Bottom Action Bar */}
        <div className="flex-shrink-0 pt-3 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-700 flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>Cancel</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-[#004B87] text-xs font-bold text-[#004B87] flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Bookmark className="w-3.5 h-3.5 fill-current" />
            <span>Save Draft</span>
          </button>

          {isFacilityOperator && (
            <>
              {formActiveTab === 'project-details' && (
                <button
                  type="button"
                  onClick={() => {
                    setFormActiveTab('project-classification');
                    setFormValidationErrors([]);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#004B87] to-[#006BB8] text-xs font-bold text-white flex items-center gap-2 shadow-md shadow-[#004B87]/25 hover:shadow-lg hover:from-[#003d6e] hover:to-[#005c9e] transition-all cursor-pointer active:scale-95"
                >
                  <span>Next</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}

              {formActiveTab === 'project-classification' && (
                <button
                  type="button"
                  onClick={() => {
                    setFormActiveTab('indicators-targets');
                    setFormValidationErrors([]);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#004B87] to-[#006BB8] text-xs font-bold text-white flex items-center gap-2 shadow-md shadow-[#004B87]/25 hover:shadow-lg hover:from-[#003d6e] hover:to-[#005c9e] transition-all cursor-pointer active:scale-95"
                >
                  <span>Next</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}

              {formActiveTab === 'indicators-targets' && (
                <button
                  type="button"
                  onClick={handleSubmitRegistration}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#004B87] to-[#006BB8] text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-[#004B87]/25 hover:shadow-lg hover:from-[#003d6e] hover:to-[#005c9e] cursor-pointer active:scale-95 transition-all"
                >
                  <span>Submit Registration</span>
                  <Send className="w-3.5 h-3.5 fill-current opacity-80" />
                </button>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  // =========================================================================
  // =========================================================================
  // VIEW MODE: VIEW (Read-Only Inspection Mode — 3 TABS)
  // =========================================================================
  const isEditableInView = isFacilityOperator && (viewingData.status === 'Draft' || viewingData.status === 'Returned for Correction');

  return (
    <div className="h-full flex flex-col overflow-hidden font-sans py-1">
      {/* Top Header */}
      <div className="flex-shrink-0 pb-[14px] pt-0.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className="text-[#004B87] hover:text-[#003d6e] p-0.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            title="Back to Overview"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2]" />
          </button>
          <h1 className="text-[18px] font-bold font-display text-[#004B87] tracking-tight">
            {viewingData.initiativeName || 'Initiative Details'}
          </h1>
          {viewingData.status !== 'Draft' && (viewingData.initiativeId || viewingData.facilityId) && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#EBF3FA] text-[#004B87] border border-[#004B87]/20 shadow-2xs inline-flex items-center">
              ID: {viewingData.initiativeId || viewingData.facilityId}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Edit Button in View Mode */}
          {isFacilityOperator && (
            <button
              type="button"
              onClick={() => handleEditFacility(selectedFacilityId)}
              className="h-8 px-4 bg-gradient-to-r from-[#004B87] to-[#006BB8] text-white rounded-[8px] text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#004B87]/25 hover:shadow-lg hover:from-[#003d6e] hover:to-[#005c9e] transition-all cursor-pointer active:scale-95 shrink-0"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Edit Registration</span>
            </button>
          )}

          {/* EAD Review Actions */}
          {isEadReviewerOrAdmin && viewingData.status === 'Submitted' && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleReturnForCorrection}
                className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-800 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Return for Correction</span>
              </button>
              <button
                type="button"
                onClick={handleEadApprove}
                className="px-3.5 py-1.5 bg-[#00875A] hover:bg-[#00704A] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Approve & Publish</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Card Container */}
      <div className="flex-1 min-h-0 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-3.5 sm:p-4 flex flex-col overflow-hidden">
        {/* Stepper Navigation: Exactly 3 Steps */}
        <div className="flex-shrink-0 flex items-center pb-3 mb-1 overflow-x-auto no-scrollbar">
          <div className="inline-flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-[6px] shadow-2xs">
            {REGISTRATION_STEPS.map((step, idx) => {
              const currentStepNum =
                viewActiveTab === 'project-details'
                  ? 1
                  : viewActiveTab === 'project-classification'
                    ? 2
                    : 3;
              const isActive = step.stepNumber === currentStepNum;
              const isCompleted = step.stepNumber < currentStepNum;
              const isArrowHighlighted = idx < currentStepNum - 1;

              return (
                <React.Fragment key={step.id}>
                  <button
                    type="button"
                    onClick={() => setViewActiveTab(step.id)}
                    className={`px-3.5 py-1.5 rounded-[6px] text-xs transition-all flex items-center gap-2 cursor-pointer select-none ${isActive
                        ? 'bg-gradient-to-r from-[#004B87] to-[#006BB8] text-white font-bold shadow-xs'
                        : isCompleted
                          ? 'text-slate-700 hover:text-[#004B87] hover:bg-slate-50 font-semibold'
                          : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50 font-medium'
                      }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 transition-all ${isActive
                          ? 'bg-white text-[#004B87] shadow-2xs'
                          : isCompleted
                            ? 'bg-[#00875A] text-white shadow-2xs'
                            : 'bg-white text-slate-400 border border-slate-300'
                        }`}
                    >
                      <span>{step.stepNumber}</span>
                    </div>
                    <span className="whitespace-nowrap">{step.title}</span>
                  </button>

                  {idx < REGISTRATION_STEPS.length - 1 && (
                    <ChevronRight
                      className={`w-4 h-4 shrink-0 mx-0.5 transition-colors ${isArrowHighlighted
                          ? 'text-[#004B87] stroke-[2.5]'
                          : 'text-slate-300'
                        }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Read-Only Content */}
        <div className="flex-1 min-h-0 overflow-y-auto space-y-5 pr-2.5 py-0.5 custom-scrollbar text-xs">
          {viewActiveTab === 'project-details' && (
            <div className="space-y-5">
              {/* Project Information */}
              <div>
                <h4 className="text-xs font-bold text-[#336D9F] mb-2.5">Project Information</h4>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                    <div className="col-span-1">
                      <label className="block text-slate-700 font-semibold mb-1">
                        Initiative Name
                      </label>
                      <input
                        type="text"
                        readOnly
                        disabled
                        value={viewingData.initiativeName || viewingData.facilityName || '—'}
                        className="w-full px-3.5 py-2 bg-[#F8FAFC] border border-slate-200 rounded-lg text-slate-800 font-semibold text-xs shadow-2xs cursor-not-allowed select-none"
                      />
                    </div>
                    <div className="hidden lg:block"></div>
                    <div className="hidden lg:block"></div>
                    <div className="hidden lg:block"></div>
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      readOnly
                      disabled
                      value={viewingData.description || '—'}
                      className="w-full p-3.5 bg-[#F8FAFC] border border-slate-200 rounded-lg text-slate-800 font-medium text-xs shadow-2xs cursor-not-allowed select-none leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              {/* Entity Information (4 fields in 1 row) */}
              <div>
                <h4 className="text-xs font-bold text-[#336D9F] mb-2.5">Entity Information</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Entity
                    </label>
                    <input
                      type="text"
                      readOnly
                      disabled
                      value={viewingData.entity || viewingData.operatorName || '—'}
                      className="w-full px-3.5 py-2 bg-[#F8FAFC] border border-slate-200 rounded-lg text-slate-800 font-semibold text-xs shadow-2xs cursor-not-allowed select-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Supporting Entity
                    </label>
                    <input
                      type="text"
                      readOnly
                      disabled
                      value={viewingData.supportingEntity || '—'}
                      className="w-full px-3.5 py-2 bg-[#F8FAFC] border border-slate-200 rounded-lg text-slate-800 font-medium text-xs shadow-2xs cursor-not-allowed select-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Sub-Entity
                    </label>
                    <input
                      type="text"
                      readOnly
                      disabled
                      value={viewingData.subEntity || '—'}
                      className="w-full px-3.5 py-2 bg-[#F8FAFC] border border-slate-200 rounded-lg text-slate-800 font-medium text-xs shadow-2xs cursor-not-allowed select-none"
                    />
                  </div>
                  <div className="hidden lg:block"></div>
                </div>
              </div>
            </div>
          )}

          {viewActiveTab === 'project-classification' && (
            <div className="space-y-5">
              {/* Project Classification */}
              <div>
                <h4 className="text-xs font-bold text-[#336D9F] mb-2.5">Project Classification</h4>
                {/* Row 1: 4 fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 mb-2.5">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Project Sector
                    </label>
                    <input
                      type="text"
                      readOnly
                      disabled
                      value={viewingData.projectSector || '—'}
                      className="w-full px-3.5 py-2 bg-[#F8FAFC] border border-slate-200 rounded-lg text-slate-800 font-medium text-xs shadow-2xs cursor-not-allowed select-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Type of Initiative
                    </label>
                    <input
                      type="text"
                      readOnly
                      disabled
                      value={viewingData.typeOfInitiative === 'Other' ? `Other: ${viewingData.initiativeTypeOther || '—'}` : (viewingData.typeOfInitiative || '—')}
                      className="w-full px-3.5 py-2 bg-[#F8FAFC] border border-slate-200 rounded-lg text-slate-800 font-medium text-xs shadow-2xs cursor-not-allowed select-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Initiative Source
                    </label>
                    <input
                      type="text"
                      readOnly
                      disabled
                      value={viewingData.initiativeSource || '—'}
                      className="w-full px-3.5 py-2 bg-[#F8FAFC] border border-slate-200 rounded-lg text-slate-800 font-medium text-xs shadow-2xs cursor-not-allowed select-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Pillar
                    </label>
                    <input
                      type="text"
                      readOnly
                      disabled
                      value={viewingData.pillar || 'Mitigation'}
                      className="w-full px-3.5 py-2 bg-[#F8FAFC] border border-slate-200 rounded-lg text-slate-800 font-semibold text-xs shadow-2xs cursor-not-allowed select-none"
                    />
                  </div>
                </div>

                {/* Row 2: 1 field, 3 empty */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Strategic Objective
                    </label>
                    <input
                      type="text"
                      readOnly
                      disabled
                      value={viewingData.strategicObjective === 'Other' ? `Other: ${viewingData.strategicObjectiveOther || '—'}` : (viewingData.strategicObjective || '—')}
                      className="w-full px-3.5 py-2 bg-[#F8FAFC] border border-slate-200 rounded-lg text-slate-800 font-medium text-xs shadow-2xs cursor-not-allowed select-none truncate"
                    />
                  </div>
                  <div className="hidden lg:block"></div>
                  <div className="hidden lg:block"></div>
                  <div className="hidden lg:block"></div>
                </div>
              </div>

              {/* Project Manager & Timeline (4 fields in 1 row) */}
              <div>
                <h4 className="text-xs font-bold text-[#336D9F] mb-2.5">Project Manager & Timeline</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Project Manager Name
                    </label>
                    <input
                      type="text"
                      readOnly
                      disabled
                      value={viewingData.projectManagerName || '—'}
                      className="w-full px-3.5 py-2 bg-[#F8FAFC] border border-slate-200 rounded-lg text-slate-800 font-medium text-xs shadow-2xs cursor-not-allowed select-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Project Manager Contact Details
                    </label>
                    <input
                      type="text"
                      readOnly
                      disabled
                      value={viewingData.projectManagerContactDetails || '—'}
                      className="w-full px-3.5 py-2 bg-[#F8FAFC] border border-slate-200 rounded-lg text-slate-800 font-medium text-xs shadow-2xs cursor-not-allowed select-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Start Date
                    </label>
                    <input
                      type="text"
                      readOnly
                      disabled
                      value={viewingData.startDate || '—'}
                      className="w-full px-3.5 py-2 bg-[#F8FAFC] border border-slate-200 rounded-lg text-slate-800 font-medium text-xs shadow-2xs cursor-not-allowed select-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      End Date
                    </label>
                    <input
                      type="text"
                      readOnly
                      disabled
                      value={viewingData.endDate || '—'}
                      className="w-full px-3.5 py-2 bg-[#F8FAFC] border border-slate-200 rounded-lg text-slate-800 font-medium text-xs shadow-2xs cursor-not-allowed select-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {viewActiveTab === 'indicators-targets' && (
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-[#336D9F]">Indicators and targets 2023-2027</h4>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <p className="text-[11px] text-slate-500 font-medium mb-1.5">
                  Selected performance indicators configured for this climate initiative:
                </p>
                {viewingData.indicatorsAndTargets && viewingData.indicatorsAndTargets.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {viewingData.indicatorsAndTargets.map((item, i) => (
                      <div key={i} className="flex items-center gap-3 p-2.5 bg-white rounded-xl border border-[#004B87]/30 shadow-2xs text-[11px] font-semibold text-slate-900">
                        <div className="relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent bg-[#004B87]">
                          <span className="inline-block h-4 w-4 transform rounded-full bg-white shadow-sm translate-x-4" />
                        </div>
                        <span>{item === 'Other' ? `Other: ${viewingData.indicatorsAndTargetsOther || 'Custom Indicator'}` : item}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-slate-400 italic">No specific indicators selected.</span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* View Mode Bottom Action Bar */}
      <div className="flex-shrink-0 pt-3 flex items-center justify-end gap-3">
        {viewActiveTab === 'project-details' && (
          <>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-700 flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Cancel</span>
            </button>
            <button
              type="button"
              onClick={() => setViewActiveTab('project-classification')}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#004B87] to-[#006BB8] text-xs font-bold text-white flex items-center gap-2 shadow-md shadow-[#004B87]/25 hover:shadow-lg hover:from-[#003d6e] hover:to-[#005c9e] transition-all cursor-pointer active:scale-95"
            >
              <span>Next</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </>
        )}

        {viewActiveTab === 'project-classification' && (
          <>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-700 flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Cancel</span>
            </button>
            <button
              type="button"
              onClick={() => setViewActiveTab('indicators-targets')}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#004B87] to-[#006BB8] text-xs font-bold text-white flex items-center gap-2 shadow-md shadow-[#004B87]/25 hover:shadow-lg hover:from-[#003d6e] hover:to-[#005c9e] transition-all cursor-pointer active:scale-95"
            >
              <span>Next</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </>
        )}

        {viewActiveTab === 'indicators-targets' && (
          <>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-700 flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Cancel</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#004B87] to-[#006BB8] text-xs font-bold text-white flex items-center gap-2 shadow-md shadow-[#004B87]/25 hover:shadow-lg hover:from-[#003d6e] hover:to-[#005c9e] transition-all cursor-pointer active:scale-95"
            >
              <span>Back to Overview</span>
            </button>
            {isEditableInView && (
              <button
                type="button"
                onClick={() => handleEditFacility(selectedFacilityId)}
                className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-[#004B87] text-xs font-bold text-[#004B87] flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit Initiative</span>
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};
