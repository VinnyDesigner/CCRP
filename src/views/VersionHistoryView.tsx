import React, { useState, useMemo, useEffect } from 'react';
import {
  CheckCircle2,
  FileText,
  Eye,
  Calendar,
  User,
  MessageSquare,
  ShieldCheck,
  Plus,
  X,
  Send,
  RotateCcw,
  Clock,
  Ticket,
  Check,
  Building2,
  ArrowLeft,
  ArrowRight,
  Info,
  ChevronLeft,
  ChevronRight,
  Search,
  Edit,
  Bookmark,
} from 'lucide-react';
import { useMRV } from '../context/MRVContext';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';
import { FieldTooltip } from '../components/ui/FieldTooltip';
import { SortTriangles } from '../components/ui/SortTriangles';
import emptyFolderIcon from '../assets/empty-folder-icon.png';
import {
  InitiativeAmendment,
  INITIAL_AMENDMENTS,
  CCRP_DISCLAIMER_TEXT,
} from '../data/amendmentsData';
import {
  CCRP_ENTITIES,
  CCRP_STRATEGIC_OBJECTIVES,
  CCRP_PROJECT_SECTORS,
  CCRP_INITIATIVE_TYPES,
  CCRP_INITIATIVE_SOURCES,
  CCRP_SCOPES,
  INITIAL_FACILITY_REGISTRATIONS,
} from '../data/facilityRegistrationsData';

const AMENDMENT_STEPS = [
  { id: 'details', stepNumber: 1, title: 'Initiative Details' },
  { id: 'timeline', stepNumber: 2, title: 'Project Manager & Timeline' },
  { id: 'justification', stepNumber: 3, title: 'Amendment Justification' },
] as const;

type AmendmentTabId = 'details' | 'timeline' | 'justification';

export const VersionHistoryView: React.FC = () => {
  const {
    currentRole,
    currentUser,
    operatorFacilityIds,
    facilityRegistrations,
    setFacilityRegistrations,
    facilities,
    setActiveView,
  } = useMRV();

  const isFacilityOperator = currentRole === 'FACILITY_OPERATOR';
  const isEadReviewerOrAdmin = currentRole === 'EAD_REVIEWER' || (currentRole as string) === 'ADMIN';

  // Navigation mode: 'table' (Overview Table Landing) | 'history' (Amendment Details / Workflow) | 'form' (Dedicated Amendment Form)
  const [viewMode, setViewMode] = useState<'table' | 'history' | 'form'>('table');

  // Determine eligible initiatives with sample demo records directly from Project Registration / Master Data
  const approvedInitiatives = useMemo(() => {
    // Collect all candidate initiative IDs to display rich sample demo overview
    const allKeys = isFacilityOperator
      ? operatorFacilityIds
      : Array.from(
          new Set([
            ...Object.keys(INITIAL_FACILITY_REGISTRATIONS),
            ...Object.keys(facilityRegistrations),
            ...facilities.map((f) => f.id),
          ])
        );

    return allKeys
      .map((id) => {
        const reg = facilityRegistrations[id] || (INITIAL_FACILITY_REGISTRATIONS as any)[id];
        const fac = facilities.find((f) => f.id === id);
        if (!reg && !fac) return null;

        const initName =
          reg?.initiativeName && reg.initiativeName.trim() !== ''
            ? reg.initiativeName
            : reg?.facilityName && reg.facilityName.trim() !== ''
            ? reg.facilityName
            : fac?.name || '';
        if (!initName) return null;

        const initCode = reg?.initiativeId || reg?.facilityId || fac?.facilityCode || `CCRP-INIT-2026-${id.replace('fac-', '70')}`;
        const entity =
          reg?.entity ||
          reg?.operatorName ||
          fac?.operatorName ||
          'Department of Energy (DoE)';
        const supportingEntity = reg?.supportingEntity || 'TAQA (Abu Dhabi National Energy Company)';
        const scope = reg?.scope || 'Abu Dhabi Emirate';
        const strategicObjective =
          reg?.strategicObjective ||
          'Reduce GHG Emissions in Key Sectors';
        const strategicObjectiveOther = reg?.strategicObjectiveOther || '';
        const sector = reg?.projectSector || reg?.reportingSector || fac?.sector || 'Energy';
        const initiativeType = reg?.typeOfInitiative || reg?.initiativeType || 'Project';
        const initiativeTypeOther = reg?.initiativeTypeOther || '';
        const initiativeSource = reg?.initiativeSource || 'Climate Change Strategy';
        const initiativeSourceOther = (reg as any)?.initiativeSourceOther || '';
        const pillar = (reg?.pillar as string) || (fac as any)?.pillar || 'Mitigation';
        const cadence = (reg?.reportingCadence as string) || 'Semiannual';
        const description = reg?.description || reg?.facilityDescription || (fac as any)?.facilityDescription || 'Comprehensive climate decarbonization and sustainability program in Abu Dhabi.';
        const indicatorsAndTargets = Array.isArray(reg?.indicatorsAndTargets)
          ? reg.indicatorsAndTargets.join(', ')
          : (reg?.indicatorsAndTargets || 'Percentage of total GHG emissions reduced from 2016 levels 22% by 2027, Percentage of GHG emissions reduced in the electricity and water sector from 2016 levels 43% by 2027');
        const projectManagerName = reg?.projectManagerName || 'Eng. Saeed Al-Mehairbi';
        const projectManagerContact = reg?.projectManagerContactDetails || reg?.projectManagerContact || '+971 2 694 4000 / saeed.mehairbi@doe.gov.ae';
        const startDate = reg?.startDate || '2023-01-01';
        const endDate = reg?.endDate || '2027-12-31';

        return {
          id,
          initiativeCode: initCode,
          name: initName,
          entity,
          supportingEntity,
          scope,
          strategicObjective,
          strategicObjectiveOther,
          sector,
          initiativeType,
          initiativeTypeOther,
          initiativeSource,
          initiativeSourceOther,
          pillar,
          cadence,
          status: 'Approved' as const,
          description,
          indicatorsAndTargets,
          projectManagerName,
          projectManagerContact,
          startDate,
          endDate,
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);
  }, [facilityRegistrations, facilities]);

  // Selected Approved Initiative for Amendment History
  const [selectedInitiativeCode, setSelectedInitiativeCode] = useState<string>('');

  useEffect(() => {
    if (approvedInitiatives.length > 0) {
      if (
        !selectedInitiativeCode ||
        !approvedInitiatives.some((i) => i.initiativeCode === selectedInitiativeCode)
      ) {
        setSelectedInitiativeCode(approvedInitiatives[0].initiativeCode);
      }
    } else {
      setSelectedInitiativeCode('');
    }
  }, [approvedInitiatives, selectedInitiativeCode]);

  // Amendments Map state (local mock state only, isolated from Project Registration)
  const [amendmentsData, setAmendmentsData] = useState<Record<string, InitiativeAmendment[]>>(INITIAL_AMENDMENTS);

  // Active Initiative object
  const currentInitiative = useMemo(() => {
    if (approvedInitiatives.length === 0) return null;
    return (
      approvedInitiatives.find((i) => i.initiativeCode === selectedInitiativeCode) ||
      approvedInitiatives[0]
    );
  }, [approvedInitiatives, selectedInitiativeCode]);

  const initiativeAmendments = useMemo(() => {
    if (!selectedInitiativeCode) return [];
    if (amendmentsData[selectedInitiativeCode]) {
      return amendmentsData[selectedInitiativeCode];
    }
    if (currentInitiative) {
      return (
        INITIAL_AMENDMENTS[selectedInitiativeCode] || [
          {
            id: `AM-${currentInitiative.initiativeCode}-01`,
            initiativeId: selectedInitiativeCode,
            initiativeName: currentInitiative.name,
            description:
              currentInitiative.description || 'Initial initiative registration and approval.',
            entity: currentInitiative.entity,
            supportingEntity: currentInitiative.supportingEntity || '',
            scope: currentInitiative.scope || 'Abu Dhabi Emirate',
            strategicObjective:
              currentInitiative.strategicObjective ||
              'Reduce GHG Emissions in Key Sectors',
            projectSector: currentInitiative.sector || 'Energy',
            initiativeType: currentInitiative.initiativeType || 'Project',
            initiativeSource: currentInitiative.initiativeSource || 'Climate Change Strategy',
            indicatorsAndTargets:
              currentInitiative.indicatorsAndTargets ||
              'Approved baseline targets and indicators.',
            projectManagerName: currentInitiative.projectManagerName || 'Eng. Saeed Al-Mehairbi',
            projectManagerContact: currentInitiative.projectManagerContact || '+971 2 694 4000 / saeed.mehairbi@doe.gov.ae',
            startDate: currentInitiative.startDate || '2023-01-01',
            endDate: currentInitiative.endDate || '2027-12-31',
            justification: 'Approved baseline initiative registration under CCRP.',
            version: 'Amendment',
            versionNum: 1,
            status: 'Approved',
            submittedDate: '18 Jan 2026',
            submittedBy: currentInitiative.projectManagerName || 'Eng. Saeed Al-Mehairbi',
            isLatest: true,
            changes: ['Initial initiative registration approved and published'],
          },
        ]
      );
    }
    return [];
  }, [amendmentsData, selectedInitiativeCode, currentInitiative]);

  // Overview Table Search & Filter State
  const [tableSearchTerm, setTableSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Overview Table Sorting & Pagination
  type AmendmentSortField = 'index' | 'name' | 'id' | 'entity' | 'pillar' | 'status';
  type SortDirection = 'asc' | 'desc';

  const [sortField, setSortField] = useState<AmendmentSortField>('index');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(7);

  const handleSort = (field: AmendmentSortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Helper to extract the latest amendment for any initiative
  const getLatestAmendmentForInit = (code: string) => {
    const list = amendmentsData[code] || INITIAL_AMENDMENTS[code] || [];
    return list[0] || null;
  };

  // Filtered initiatives for overview table
  const filteredInitiatives = useMemo(() => {
    return approvedInitiatives.filter((init) => {
      const latestAm = getLatestAmendmentForInit(init.initiativeCode);
      const rawStatus = latestAm?.status || 'Approved';
      const ticketStatus = latestAm?.ticketStatus;
      const displayStatus = ticketStatus === 'Ticket Raised' ? 'Registry Update Pending' : rawStatus;

      const matchesSearch =
        init.name.toLowerCase().includes(tableSearchTerm.toLowerCase()) ||
        init.initiativeCode.toLowerCase().includes(tableSearchTerm.toLowerCase()) ||
        init.entity.toLowerCase().includes(tableSearchTerm.toLowerCase()) ||
        init.pillar.toLowerCase().includes(tableSearchTerm.toLowerCase()) ||
        displayStatus.toLowerCase().includes(tableSearchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'Registry Update Pending' && ticketStatus === 'Ticket Raised') ||
        (statusFilter === 'Approved' && (rawStatus === 'Approved' || rawStatus === 'Approved / Published') && ticketStatus !== 'Ticket Raised') ||
        (statusFilter === 'Submitted' && rawStatus === 'Submitted') ||
        (statusFilter === 'Under Review' && (rawStatus === 'Under Review' || rawStatus === 'Under EAD Review')) ||
        (statusFilter === 'Correction Requested' && (rawStatus === 'Correction Requested' || rawStatus === 'Returned for Correction'));

      return matchesSearch && matchesStatus;
    });
  }, [approvedInitiatives, amendmentsData, tableSearchTerm, statusFilter]);

  // Sorted initiatives
  const sortedInitiatives = useMemo(() => {
    if (sortField === 'index') {
      return sortDirection === 'asc' ? filteredInitiatives : [...filteredInitiatives].reverse();
    }
    return [...filteredInitiatives].sort((a, b) => {
      const amA = getLatestAmendmentForInit(a.initiativeCode);
      const amB = getLatestAmendmentForInit(b.initiativeCode);

      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      const idA = a.initiativeCode.toLowerCase();
      const idB = b.initiativeCode.toLowerCase();
      const entityA = a.entity.toLowerCase();
      const entityB = b.entity.toLowerCase();
      const pillarA = a.pillar.toLowerCase();
      const pillarB = b.pillar.toLowerCase();
      const stA = (amA?.ticketStatus === 'Ticket Raised' ? 'Registry Update Pending' : amA?.status || 'Approved').toLowerCase();
      const stB = (amB?.ticketStatus === 'Ticket Raised' ? 'Registry Update Pending' : amB?.status || 'Approved').toLowerCase();

      let cmp = 0;
      if (sortField === 'name') cmp = nameA.localeCompare(nameB);
      else if (sortField === 'id') cmp = idA.localeCompare(idB);
      else if (sortField === 'entity') cmp = entityA.localeCompare(entityB);
      else if (sortField === 'pillar') cmp = pillarA.localeCompare(pillarB);
      else if (sortField === 'status') cmp = stA.localeCompare(stB);

      return sortDirection === 'asc' ? cmp : -cmp;
    });
  }, [filteredInitiatives, sortField, sortDirection, amendmentsData]);

  const totalPages = Math.ceil(sortedInitiatives.length / itemsPerPage) || 1;

  const paginatedInitiatives = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedInitiatives.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedInitiatives, currentPage, itemsPerPage]);

  // Modals & Forms State
  const [isEditingDraftId, setIsEditingDraftId] = useState<string | null>(null);
  const [ticketModalAmendment, setTicketModalAmendment] = useState<InitiativeAmendment | null>(null);
  const [reviewModalAmendment, setReviewModalAmendment] = useState<InitiativeAmendment | null>(null);
  const [reviewComments, setReviewComments] = useState('');

  // Toast Notice State
  const [isSavedNotice, setIsSavedNotice] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState('');

  const triggerToast = (msg: string) => {
    setNoticeMessage(msg);
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 3500);
  };

  // Dedicated Form State pre-populated with approved project data
  const [formData, setFormData] = useState({
    initiativeName: currentInitiative?.name || 'Al Dhafra Solar PV Decarbonization Program',
    description:
      currentInitiative?.description ||
      'Utility-scale 2GW solar photovoltaic deployment in Al Dhafra region to supply clean power to the Abu Dhabi electrical grid and displace thermal natural gas power generation.',
    entity: currentInitiative?.entity || 'Department of Energy (DoE)',
    supportingEntity: currentInitiative?.supportingEntity || 'TAQA (Abu Dhabi National Energy Company)',
    scope: currentInitiative?.scope || 'Abu Dhabi Emirate',
    scopeOther: (currentInitiative as any)?.scopeOther || '',
    strategicObjective:
      currentInitiative?.strategicObjective ||
      'Reduce GHG Emissions in Key Sectors',
    strategicObjectiveOther: currentInitiative?.strategicObjectiveOther || '',
    projectSector: currentInitiative?.sector || 'Energy',
    projectSectorOther: (currentInitiative as any)?.projectSectorOther || '',
    initiativeType: currentInitiative?.initiativeType || 'Project',
    initiativeTypeOther: '',
    pillar: currentInitiative?.pillar || 'Mitigation',
    pillarOther: (currentInitiative as any)?.pillarOther || '',
    initiativeSource: currentInitiative?.initiativeSource || 'Climate Change Strategy',
    initiativeSourceOther: (currentInitiative as any)?.initiativeSourceOther || '',
    indicatorsAndTargets:
      currentInitiative?.indicatorsAndTargets ||
      'Percentage of total GHG emissions reduced from 2016 levels 22% by 2027, Percentage of GHG emissions reduced in the electricity and water sector from 2016 levels 43% by 2027',
    projectManagerName: currentInitiative?.projectManagerName || currentUser?.name || 'Eng. Saeed Al-Mehairbi',
    projectManagerContact: currentInitiative?.projectManagerContact || '+971 2 694 4000 / saeed.mehairbi@doe.gov.ae',
    startDate: currentInitiative?.startDate || '2023-01-01',
    endDate: currentInitiative?.endDate || '2027-12-31',
    justification: 'Annual decarbonization target adjustment and renewable energy generation capacity scaling for 2026–2027 under CCRP framework.',
  });

  // Form and View Stepper Tab Navigation State
  const [activeFormTab, setActiveFormTab] = useState<AmendmentTabId>('details');
  const [activeViewTab, setActiveViewTab] = useState<AmendmentTabId>('details');

  const handleOpenCreateForm = (amendmentToEdit?: InitiativeAmendment) => {
    setActiveFormTab('details');
    if (!currentInitiative) return;
    const latestItem = amendmentToEdit || (amendmentsData[selectedInitiativeCode] && amendmentsData[selectedInitiativeCode][0]) || initiativeAmendments[0];
    if (amendmentToEdit) {
      setIsEditingDraftId(amendmentToEdit.id);
    } else {
      setIsEditingDraftId(null);
    }

    setFormData({
      initiativeName: latestItem?.initiativeName || currentInitiative.name,
      description:
        latestItem?.description ||
        currentInitiative.description ||
        'Utility-scale 2GW solar photovoltaic deployment in Al Dhafra region to supply clean power to the Abu Dhabi electrical grid and displace thermal natural gas power generation.',
      entity: latestItem?.entity || currentInitiative.entity,
      supportingEntity: latestItem?.supportingEntity || currentInitiative.supportingEntity || 'TAQA (Abu Dhabi National Energy Company)',
      scope: latestItem?.scope || currentInitiative.scope || 'Abu Dhabi Emirate',
      scopeOther: latestItem?.scopeOther || (currentInitiative as any)?.scopeOther || '',
      strategicObjective:
        latestItem?.strategicObjective ||
        currentInitiative.strategicObjective ||
        'Reduce GHG Emissions in Key Sectors',
      strategicObjectiveOther: latestItem?.strategicObjectiveOther || currentInitiative.strategicObjectiveOther || '',
      projectSector: latestItem?.projectSector || currentInitiative.sector || 'Energy',
      projectSectorOther: latestItem?.projectSectorOther || (currentInitiative as any)?.projectSectorOther || '',
      initiativeType: latestItem?.initiativeType || currentInitiative.initiativeType || 'Project',
      initiativeTypeOther: latestItem?.initiativeTypeOther || currentInitiative.initiativeTypeOther || '',
      pillar: (latestItem as any)?.pillar || currentInitiative.pillar || 'Mitigation',
      pillarOther: (latestItem as any)?.pillarOther || (currentInitiative as any)?.pillarOther || '',
      initiativeSource:
        latestItem?.initiativeSource || currentInitiative.initiativeSource || 'Climate Change Strategy',
      initiativeSourceOther: latestItem?.initiativeSourceOther || (currentInitiative as any)?.initiativeSourceOther || '',
      indicatorsAndTargets:
        latestItem?.indicatorsAndTargets ||
        currentInitiative.indicatorsAndTargets ||
        'Percentage of total GHG emissions reduced from 2016 levels 22% by 2027, Percentage of GHG emissions reduced in the electricity and water sector from 2016 levels 43% by 2027',
      projectManagerName:
        latestItem?.projectManagerName || currentInitiative.projectManagerName || currentUser?.name || 'Eng. Saeed Al-Mehairbi',
      projectManagerContact:
        latestItem?.projectManagerContact || currentInitiative.projectManagerContact || '+971 2 694 4000 / saeed.mehairbi@doe.gov.ae',
      startDate: latestItem?.startDate || currentInitiative.startDate || '2023-01-01',
      endDate: latestItem?.endDate || currentInitiative.endDate || '2027-12-31',
      justification:
        amendmentToEdit
          ? amendmentToEdit.justification
          : 'Annual decarbonization target adjustment and renewable energy generation capacity scaling for 2026–2027 under CCRP framework.',
    });
    setViewMode('form');
  };

  const handleSaveDraftAmendment = () => {
    const todayStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    const newAmId = isEditingDraftId || `AM-DRAFT-${Date.now()}`;
    const effectiveJustification = formData.justification.trim() || 'Draft amendment saved.';

    const newAmendment: InitiativeAmendment = {
      id: newAmId,
      initiativeId: selectedInitiativeCode,
      initiativeName: formData.initiativeName,
      description: formData.description,
      entity: formData.entity,
      supportingEntity: formData.supportingEntity,
      scope: formData.scope,
      scopeOther: formData.scopeOther,
      strategicObjective: formData.strategicObjective,
      strategicObjectiveOther: formData.strategicObjectiveOther,
      projectSector: formData.projectSector,
      projectSectorOther: formData.projectSectorOther,
      initiativeType: formData.initiativeType,
      initiativeTypeOther: formData.initiativeTypeOther,
      pillar: formData.pillar,
      pillarOther: formData.pillarOther,
      initiativeSource: formData.initiativeSource,
      initiativeSourceOther: formData.initiativeSourceOther,
      indicatorsAndTargets: formData.indicatorsAndTargets,
      projectManagerName: formData.projectManagerName,
      projectManagerContact: formData.projectManagerContact,
      startDate: formData.startDate,
      endDate: formData.endDate,
      justification: effectiveJustification,
      version: 'Amendment',
      versionNum: 1,
      status: 'Draft',
      submittedDate: todayStr,
      submittedBy: currentUser?.name || 'Eng. Saeed Al-Mehairbi',
      isLatest: true,
      changes: ['Draft amendment updates saved'],
    };

    setAmendmentsData((prev) => ({
      ...prev,
      [selectedInitiativeCode]: [newAmendment],
    }));

    setViewMode('table');
    triggerToast('Initiative Amendment Request Saved as Draft!');
  };

  // Amendment submission: creates amendment request with status 'Submitted'
  const handleSubmitAmendment = () => {
    const effectiveJustification = formData.justification.trim() || 'Annual decarbonization target adjustment and renewable energy generation capacity scaling for 2026–2027 under CCRP framework.';
    const todayStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    const newAmId = isEditingDraftId || `AM-${Date.now().toString().slice(-4)}`;

    const newAmendment: InitiativeAmendment = {
      id: newAmId,
      initiativeId: selectedInitiativeCode,
      initiativeName: formData.initiativeName,
      description: formData.description,
      entity: formData.entity,
      supportingEntity: formData.supportingEntity,
      scope: formData.scope,
      scopeOther: formData.scopeOther,
      strategicObjective: formData.strategicObjective,
      strategicObjectiveOther: formData.strategicObjectiveOther,
      projectSector: formData.projectSector,
      projectSectorOther: formData.projectSectorOther,
      initiativeType: formData.initiativeType,
      initiativeTypeOther: formData.initiativeTypeOther,
      pillar: formData.pillar,
      pillarOther: formData.pillarOther,
      initiativeSource: formData.initiativeSource,
      initiativeSourceOther: formData.initiativeSourceOther,
      indicatorsAndTargets: formData.indicatorsAndTargets,
      projectManagerName: formData.projectManagerName,
      projectManagerContact: formData.projectManagerContact,
      startDate: formData.startDate,
      endDate: formData.endDate,
      justification: effectiveJustification,
      version: 'Amendment',
      versionNum: 1,
      status: 'Submitted',
      submittedDate: todayStr,
      submittedBy: currentUser?.name || currentInitiative?.projectManagerName || 'Eng. Saeed Al-Mehairbi',
      isLatest: true,
      changes: [
        `Amendment requested: ${effectiveJustification.slice(0, 75)}...`,
        `Updated indicators & targets: ${formData.indicatorsAndTargets.slice(0, 60)}...`,
      ],
    };

    setAmendmentsData((prev) => ({
      ...prev,
      [selectedInitiativeCode]: [newAmendment],
    }));

    setIsEditingDraftId(null);
    setViewMode('table');
    triggerToast(
      isEditingDraftId
        ? `Amendment Request Resubmitted Successfully (Status: Submitted)!`
        : `Initiative Amendment Request Submitted Successfully!`
    );
  };

  // Raise Ticket: creates local demo ticket and sets status = Registry Update Pending
  const handleRaiseTicket = (amendment: InitiativeAmendment) => {
    const todayStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const generatedTicketId = `TCK-2026-7073-AM`;

    const updatedItem: InitiativeAmendment = {
      ...amendment,
      ticketStatus: 'Ticket Raised',
      ticketId: generatedTicketId,
      ticketRaisedDate: todayStr,
    };

    setAmendmentsData((prev) => ({
      ...prev,
      [selectedInitiativeCode]: [updatedItem],
    }));

    setTicketModalAmendment(null);
    triggerToast(`Ticket ${generatedTicketId} Raised: Status is now Registry Update Pending.`);
  };

  // Complete Registry Update: finalizes registry data without creating duplicate projects
  const handleCompleteRegistryUpdate = (amendment: InitiativeAmendment) => {
    const updatedItem: InitiativeAmendment = {
      ...amendment,
      ticketStatus: 'Ticket Resolved',
      status: 'Approved / Published',
      isLatest: true,
      changes: [
        ...(amendment.changes || []),
        'Registry Master Data update completed — Active approved baseline',
      ],
    };

    setAmendmentsData((prev) => ({
      ...prev,
      [selectedInitiativeCode]: [updatedItem],
    }));

    // Update current facility registration in context without duplicating records
    if (currentInitiative) {
      const regId = currentInitiative.id || 'fac-1';
      setFacilityRegistrations((prev) => {
        const currentReg = prev[regId] || prev['fac-1'] || {};
        return {
          ...prev,
          [regId]: {
            ...currentReg,
            initiativeName: amendment.initiativeName,
            description: amendment.description,
            entity: amendment.entity,
            supportingEntity: amendment.supportingEntity,
            scope: amendment.scope,
            projectSector: amendment.projectSector,
            projectSectorOther: amendment.projectSectorOther || '',
            strategicObjective: amendment.strategicObjective,
            strategicObjectiveOther: amendment.strategicObjectiveOther || '',
            typeOfInitiative: amendment.initiativeType,
            initiativeTypeOther: amendment.initiativeTypeOther || '',
            pillar: (amendment as any).pillar || currentReg.pillar || 'Mitigation',
            pillarOther: (amendment as any).pillarOther || '',
            initiativeSource: amendment.initiativeSource,
            initiativeSourceOther: amendment.initiativeSourceOther || '',
            indicatorsAndTargets: amendment.indicatorsAndTargets
              ? amendment.indicatorsAndTargets.split(',').map((s) => s.trim()).filter(Boolean)
              : currentReg.indicatorsAndTargets,
            projectManagerName: amendment.projectManagerName,
            projectManagerContactDetails: amendment.projectManagerContact,
            startDate: amendment.startDate,
            endDate: amendment.endDate,
            updatedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          },
        };
      });
    }

    triggerToast(`Registry Update Complete: Initiative Master Data Updated!`);
  };

  // EAD Review: Approve & Publish
  const handleApproveAmendmentByEad = (amendment: InitiativeAmendment) => {
    const todayStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

    const updatedItem: InitiativeAmendment = {
      ...amendment,
      status: 'Approved / Published',
      ticketStatus: 'Ticket Required',
      submittedDate: todayStr,
      reviewerComments: reviewComments || 'Initiative amendment verified and approved under CCRP statutory framework.',
    };

    setAmendmentsData((prev) => ({
      ...prev,
      [selectedInitiativeCode]: [updatedItem],
    }));

    setReviewModalAmendment(null);
    setReviewComments('');
    triggerToast(`Amendment Request Approved & Published! Ticket is now required.`);
  };

  // EAD Review: Return for Correction / Correction Requested
  const handleReturnAmendmentForCorrection = (amendment: InitiativeAmendment) => {
    const todayStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

    const updatedItem: InitiativeAmendment = {
      ...amendment,
      status: 'Correction Requested',
      submittedDate: todayStr,
      reviewerComments: reviewComments || 'Please provide updated target justifications and verify scope alignment.',
    };

    setAmendmentsData((prev) => ({
      ...prev,
      [selectedInitiativeCode]: [updatedItem],
    }));

    setReviewModalAmendment(null);
    setReviewComments('');
    triggerToast(`Amendment Request Returned for Correction to Data Provider.`);
  };

  // Helper for pillar badge styling
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

  // Helper for rendering status badges consistently across table and cards
  const renderStatusBadge = (rawStatus: string, ticketStatus?: string) => {
    if (ticketStatus === 'Ticket Raised') {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200 inline-block">
          Registry Update Pending
        </span>
      );
    }
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
    if (rawStatus === 'Under Review' || rawStatus === 'Under EAD Review') {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-50 text-sky-700 border border-sky-200/60 inline-block">
          Under Review
        </span>
      );
    }
    if (rawStatus === 'Correction Requested' || rawStatus === 'Returned for Correction') {
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
    // Empty state condition when 0 approved initiatives exist
    if (approvedInitiatives.length === 0) {
      return (
        <div className="h-full flex flex-col font-sans py-1 animate-fade-in">
          {/* Page Header */}
          <div className="flex-shrink-0 pb-[18px] pt-0.5 flex items-center justify-between gap-3">
            <div>
              <h1 className="text-[18px] font-bold font-display text-[#336D9F] tracking-tight whitespace-nowrap">
                Initiative Amendments
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Track amendment requests, EAD review decisions, corrections, and approved initiative updates
              </p>
            </div>
          </div>

          {/* White Color Frame */}
          <div className="w-full bg-white rounded-xl border border-slate-200/90 shadow-xs flex flex-col items-center justify-center py-12 px-6">
            <div className="flex flex-col items-center text-center max-w-md">
              <img
                src={emptyFolderIcon}
                alt="No Amendments Available"
                className="w-[84px] h-[74px] object-contain mb-3.5 select-none"
                draggable={false}
              />

              <h2 className="text-[15px] font-bold text-[#336D9F] tracking-tight">
                No Amendments Available
              </h2>
              <p className="text-[11.5px] text-slate-500 font-normal mt-1 max-w-sm">
                You don't have any climate change project amendments available yet. Start by registering an initiative first to raise an amendment request.
              </p>

              <button
                onClick={() => setActiveView('registration')}
                className="mt-4 h-9 px-4 bg-gradient-to-r from-[#004B87] to-[#006BB8] text-white rounded-[8px] text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#004B87]/25 hover:shadow-lg hover:from-[#003d6e] hover:to-[#005c9e] transition-all cursor-pointer active:scale-95 shrink-0 whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span>Register New Project</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="h-full flex flex-col overflow-hidden font-sans py-1 animate-fade-in">
        {/* Top Header Row with Title, Search, Filter & Create Amendment Button */}
        <div className="flex-shrink-0 pb-[18px] pt-0.5 flex items-center justify-between gap-3 min-w-0">
          <div className="min-w-0 shrink">
            <h1 className="text-[18px] font-bold font-display text-[#336D9F] tracking-tight whitespace-nowrap">
              Initiative Amendments
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5 truncate max-w-lg xl:max-w-xl">
              Track amendment requests, EAD review decisions, corrections, and approved initiative updates
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-nowrap">
            {/* Search Box */}
            <div className="relative w-36 sm:w-44 xl:w-48">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 z-10 pointer-events-none" />
              <FieldTooltip content="Filter records by project name, ID, entity, pillar, or amendment status.">
                <input
                  type="text"
                  placeholder="Search amendments..."
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
              <FieldTooltip content="Filter initiatives by amendment status.">
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-32 sm:w-40 h-9 px-2.5 py-1.5 bg-white border border-slate-300 rounded-[8px] text-xs font-semibold text-slate-700 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#336D9F]/20 focus:border-[#336D9F] transition-all cursor-pointer truncate"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="Approved">Approved</option>
                  <option value="Submitted">Submitted</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Correction Requested">Correction Requested</option>
                  <option value="Registry Update Pending">Registry Update Pending</option>
                </select>
              </FieldTooltip>
            </div>

            {/* Reset */}
            {(tableSearchTerm || statusFilter !== 'ALL') && (
              <button
                onClick={() => {
                  setTableSearchTerm('');
                  setStatusFilter('ALL');
                  setCurrentPage(1);
                }}
                className="h-9 px-2.5 text-slate-500 hover:text-slate-800 bg-white hover:bg-slate-100 rounded-[8px] border border-slate-200 font-semibold transition-colors flex items-center gap-1 cursor-pointer text-xs"
                title="Reset all filters"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
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
                    title="Sort by Project Name"
                  >
                    <div className="flex items-center">
                      <span>Project Name</span>
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
                    title="Sort by Amendment Status"
                  >
                    <div className="flex items-center">
                      <span>Amendment Status</span>
                      <SortTriangles active={sortField === 'status'} direction={sortDirection} />
                    </div>
                  </th>
                  <th className="h-[38px] px-4 w-[8%] text-right whitespace-nowrap align-middle bg-[#D6E3EF]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-normal text-slate-700">
                {paginatedInitiatives.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400 font-medium">
                      No amendment records match the selected filter criteria.
                    </td>
                  </tr>
                ) : (
                  paginatedInitiatives.map((init, idx) => {
                    const rowNumber = (currentPage - 1) * itemsPerPage + idx + 1;
                    const latestAm = getLatestAmendmentForInit(init.initiativeCode);
                    const rawStatus = latestAm?.status || 'Approved / Published';

                    return (
                      <tr
                        key={init.id || idx}
                        className={`h-[60px] ${idx % 2 === 1 ? 'bg-slate-50/80' : 'bg-white'} hover:bg-[#EBF3FA] transition-colors group cursor-default`}
                      >
                        {/* 1. Row # */}
                        <td className="h-[60px] px-3 text-center font-mono font-normal text-slate-400 align-middle">
                          {rowNumber}
                        </td>

                        {/* 2. Project Name */}
                        <td className="h-[60px] px-3 font-medium text-slate-800 align-middle overflow-hidden">
                          <div
                            className="line-clamp-2 leading-snug break-words hover:text-[#004B87] cursor-pointer"
                            onClick={() => {
                              setSelectedInitiativeCode(init.initiativeCode);
                              setActiveViewTab('details');
                              setViewMode('history');
                            }}
                            title={init.name}
                          >
                            {init.name}
                          </div>
                        </td>

                        {/* 3. Project ID */}
                        <td className="h-[60px] px-3 font-mono font-bold text-[#004B87] whitespace-nowrap align-middle">
                          <span>{init.initiativeCode}</span>
                        </td>

                        {/* 4. Entity */}
                        <td className="h-[60px] px-3 text-slate-600 align-middle overflow-hidden">
                          <div className="line-clamp-2 leading-snug break-words" title={init.entity}>
                            {init.entity}
                          </div>
                        </td>

                        {/* 5. Pillar */}
                        <td className="h-[60px] px-3 whitespace-nowrap align-middle">
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border inline-flex items-center gap-1 ${getPillarBadgeColor(init.pillar)}`}>
                            {init.pillar}
                          </span>
                        </td>

                        {/* 6. Amendment Status */}
                        <td className="h-[60px] px-3 whitespace-nowrap text-left align-middle">
                          {renderStatusBadge(rawStatus, latestAm?.ticketStatus)}
                        </td>

                        {/* 7. Actions */}
                        <td className="h-[60px] px-4 whitespace-nowrap align-middle text-right">
                          <div className="flex items-center justify-end gap-2.5">
                            {/* View Details Button */}
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedInitiativeCode(init.initiativeCode);
                                setActiveViewTab('details');
                                setViewMode('history');
                              }}
                              title="View Amendment Details"
                              className="text-slate-600 hover:text-[#004B87] transition-colors cursor-pointer p-1 rounded-md hover:bg-[#004B87]/10"
                            >
                              <Eye className="w-[18px] h-[18px] stroke-[1.75]" />
                            </button>

                            {/* Operator Actions: Edit for in-progress/submitted/correction amendments, Create for approved */}
                            {isFacilityOperator && (
                              <>
                                {(rawStatus === 'Approved' || rawStatus === 'Approved / Published') && latestAm?.ticketStatus !== 'Ticket Raised' ? (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedInitiativeCode(init.initiativeCode);
                                      handleOpenCreateForm();
                                    }}
                                    title="Create Amendment"
                                    className="text-emerald-700 hover:text-emerald-900 transition-colors cursor-pointer p-1 rounded-md hover:bg-emerald-50"
                                  >
                                    <Plus className="w-[18px] h-[18px] stroke-[2.25]" />
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedInitiativeCode(init.initiativeCode);
                                      handleOpenCreateForm(latestAm || undefined);
                                    }}
                                    title="Edit Amendment"
                                    className="text-[#004B87] hover:text-[#003d6e] transition-colors cursor-pointer p-1 rounded-md hover:bg-[#004B87]/10"
                                  >
                                    <Edit className="w-[18px] h-[18px] stroke-[1.75]" />
                                  </button>
                                )}
                              </>
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
              Showing {sortedInitiatives.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to{' '}
              {Math.min(currentPage * itemsPerPage, sortedInitiatives.length)} of {sortedInitiatives.length} initiatives
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
  // VIEW MODE 2: DEDICATED AMENDMENT FORM PAGE
  // =========================================================================
  if (viewMode === 'form') {
    return (
      <div className="h-full flex flex-col overflow-hidden font-sans py-1 animate-fade-in">
        {/* Top Header */}
        <div className="flex-shrink-0 pb-[14px] pt-0.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={() => setViewMode(selectedInitiativeCode ? 'history' : 'table')}
              className="text-[#004B87] hover:text-[#003d6e] p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              title="Back to Amendment Overview"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2]" />
            </button>
            <h1 className="text-[18px] font-bold font-display text-[#004B87] tracking-tight">
              {isEditingDraftId ? 'Edit Initiative Amendment' : 'Create Initiative Amendment'}
            </h1>
            {currentInitiative && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#EBF3FA] text-[#004B87] border border-[#004B87]/20 shadow-2xs inline-flex items-center">
                ID: {currentInitiative.initiativeCode}
              </span>
            )}
          </div>
        </div>

        {/* Main Card Container */}
        <div className="flex-1 min-h-0 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-3.5 sm:p-4 flex flex-col overflow-hidden">
          {/* Stepper Navigation: Exactly 3 Steps */}
          <div className="flex-shrink-0 flex items-center pb-3 mb-1 overflow-x-auto no-scrollbar">
            <div className="inline-flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-[6px] shadow-2xs">
              {AMENDMENT_STEPS.map((step, idx) => {
                const currentStepNum =
                  activeFormTab === 'details'
                    ? 1
                    : activeFormTab === 'timeline'
                      ? 2
                      : 3;
                const isActive = step.stepNumber === currentStepNum;
                const isCompleted = step.stepNumber < currentStepNum;
                const isArrowHighlighted = idx < currentStepNum - 1;

                return (
                  <React.Fragment key={step.id}>
                    <button
                      type="button"
                      onClick={() => setActiveFormTab(step.id)}
                      className={`px-3.5 py-1.5 rounded-[6px] text-xs transition-all flex items-center gap-2 cursor-pointer select-none ${
                        isActive
                          ? 'bg-gradient-to-r from-[#004B87] to-[#006BB8] text-white font-bold shadow-xs'
                          : isCompleted
                            ? 'text-slate-700 hover:text-[#004B87] hover:bg-slate-50 font-semibold'
                            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50 font-medium'
                      }`}
                    >
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
                      <span className="whitespace-nowrap">{step.title}</span>
                    </button>

                    {idx < AMENDMENT_STEPS.length - 1 && (
                      <ChevronRight
                        className={`w-4 h-4 shrink-0 mx-0.5 transition-colors ${
                          isArrowHighlighted
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

          {/* Scrollable Form Body */}
          <div className="flex-1 min-h-0 overflow-y-auto space-y-4 pr-2.5 py-0.5 custom-scrollbar text-xs">
            {/* Tab 1: Initiative Details */}
            {activeFormTab === 'details' && (
              <div className="space-y-4 animate-fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                  <div className="col-span-1">
                    <label className="block text-slate-700 font-semibold mb-1">
                      Initiative Name *
                    </label>
                    <FieldTooltip content="Official title of the climate change initiative." example="Al Dhafra Solar PV Decarbonization Program">
                      <input
                        type="text"
                        readOnly
                        disabled
                        value={formData.initiativeName || currentInitiative?.name || 'Al Dhafra Solar PV Decarbonization Program'}
                        placeholder="Al Dhafra Solar PV Decarbonization Program"
                        className="w-full px-3.5 py-2 bg-slate-100/90 border border-slate-300 rounded-lg text-slate-800 font-bold cursor-default select-none shadow-2xs text-xs"
                      />
                    </FieldTooltip>
                  </div>
                  <div className="hidden lg:block"></div>
                  <div className="hidden lg:block"></div>
                  <div className="hidden lg:block"></div>

                  <div className="col-span-1 sm:col-span-2 lg:col-span-4">
                    <label className="block text-slate-700 font-semibold mb-1">
                      Description *
                    </label>
                    <textarea
                      rows={2}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Enter updated initiative executive description..."
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 font-medium focus:outline-none focus:border-[#004B87] text-xs"
                    />
                  </div>

                  {/* Row 1 of 4 fields */}
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Entity *
                    </label>
                    <select
                      value={formData.entity}
                      onChange={(e) => setFormData({ ...formData, entity: e.target.value })}
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 font-medium focus:outline-none focus:border-[#004B87] text-xs"
                    >
                      {CCRP_ENTITIES.map((ent) => (
                        <option key={ent} value={ent}>{ent}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Supporting Entity
                    </label>
                    <select
                      value={formData.supportingEntity}
                      onChange={(e) => setFormData({ ...formData, supportingEntity: e.target.value })}
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 font-medium focus:outline-none focus:border-[#004B87] text-xs"
                    >
                      <option value="">None (Optional)</option>
                      {CCRP_ENTITIES.map((ent) => (
                        <option key={ent} value={ent}>{ent}</option>
                      ))}
                    </select>
                  </div>

                  {/* Row 1: Entity, Supporting Entity, Scope (Pillar values), Project Sector */}
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Scope *
                    </label>
                    {formData.pillar === 'Others' || formData.pillar === 'Other' || (formData.pillarOther && !['Adaptation', 'Mitigation', 'Economic Diversification'].includes(formData.pillar)) ? (
                      <div className="relative">
                        <input
                          type="text"
                          autoFocus
                          value={formData.pillarOther || (formData.pillar === 'Others' || formData.pillar === 'Other' ? '' : formData.pillar)}
                          onChange={(e) => setFormData({ ...formData, pillar: 'Others', pillarOther: e.target.value })}
                          placeholder="Specify custom scope..."
                          className="w-full pl-3.5 pr-8 py-2 bg-white border border-[#004B87] rounded-lg text-slate-800 font-medium focus:outline-none focus:border-[#004B87] text-xs shadow-xs"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, pillar: 'Mitigation', pillarOther: '' })}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
                          title="Switch back to dropdown"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <select
                        value={formData.pillar || 'Mitigation'}
                        onChange={(e) => {
                          if (e.target.value === 'Others' || e.target.value === 'Other') {
                            setFormData({ ...formData, pillar: 'Others', pillarOther: '' });
                          } else {
                            setFormData({ ...formData, pillar: e.target.value, pillarOther: '' });
                          }
                        }}
                        className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 font-medium focus:outline-none focus:border-[#004B87] truncate text-xs cursor-pointer"
                      >
                        <option value="Adaptation">Adaptation</option>
                        <option value="Mitigation">Mitigation</option>
                        <option value="Economic Diversification">Economic Diversification</option>
                        <option value="Others">Others</option>
                      </select>
                    )}
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Project Sector *
                    </label>
                    {formData.projectSector === 'Other' || (formData.projectSectorOther && !CCRP_PROJECT_SECTORS.includes(formData.projectSector)) ? (
                      <div className="relative">
                        <input
                          type="text"
                          autoFocus
                          value={formData.projectSectorOther || (formData.projectSector === 'Other' ? '' : formData.projectSector)}
                          onChange={(e) => setFormData({ ...formData, projectSector: 'Other', projectSectorOther: e.target.value })}
                          placeholder="Specify custom sector..."
                          className="w-full pl-3.5 pr-8 py-2 bg-white border border-[#004B87] rounded-lg text-slate-800 font-medium focus:outline-none focus:border-[#004B87] text-xs shadow-xs"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, projectSector: CCRP_PROJECT_SECTORS[0], projectSectorOther: '' })}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
                          title="Switch back to dropdown"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <select
                        value={formData.projectSector}
                        onChange={(e) => {
                          if (e.target.value === 'Other') {
                            setFormData({ ...formData, projectSector: 'Other', projectSectorOther: '' });
                          } else {
                            setFormData({ ...formData, projectSector: e.target.value, projectSectorOther: '' });
                          }
                        }}
                        className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 font-medium focus:outline-none focus:border-[#004B87] text-xs cursor-pointer"
                      >
                        {CCRP_PROJECT_SECTORS.map((sec) => (
                          <option key={sec} value={sec}>{sec}</option>
                        ))}
                      </select>
                    )}
                  </div>

                  {/* Row 2 of fields */}
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Strategic Objective *
                    </label>
                    {formData.strategicObjective === 'Other' || (formData.strategicObjectiveOther && !CCRP_STRATEGIC_OBJECTIVES.includes(formData.strategicObjective)) ? (
                      <div className="relative">
                        <input
                          type="text"
                          autoFocus
                          value={formData.strategicObjectiveOther || (formData.strategicObjective === 'Other' ? '' : formData.strategicObjective)}
                          onChange={(e) => setFormData({ ...formData, strategicObjective: 'Other', strategicObjectiveOther: e.target.value })}
                          placeholder="Specify custom strategic objective..."
                          className="w-full pl-3.5 pr-8 py-2 bg-white border border-[#004B87] rounded-lg text-slate-800 font-medium focus:outline-none focus:border-[#004B87] text-xs shadow-xs"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, strategicObjective: CCRP_STRATEGIC_OBJECTIVES[0], strategicObjectiveOther: '' })}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
                          title="Switch back to dropdown"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <select
                        value={formData.strategicObjective}
                        onChange={(e) => {
                          if (e.target.value === 'Other') {
                            setFormData({ ...formData, strategicObjective: 'Other', strategicObjectiveOther: '' });
                          } else {
                            setFormData({ ...formData, strategicObjective: e.target.value, strategicObjectiveOther: '' });
                          }
                        }}
                        className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 font-medium focus:outline-none focus:border-[#004B87] truncate text-xs cursor-pointer"
                      >
                        {CCRP_STRATEGIC_OBJECTIVES.map((so) => (
                          <option key={so} value={so}>{so}</option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Type of Initiative *
                    </label>
                    {formData.initiativeType === 'Other' || (formData.initiativeTypeOther && !CCRP_INITIATIVE_TYPES.includes(formData.initiativeType)) ? (
                      <div className="relative">
                        <input
                          type="text"
                          autoFocus
                          value={formData.initiativeTypeOther || (formData.initiativeType === 'Other' ? '' : formData.initiativeType)}
                          onChange={(e) => setFormData({ ...formData, initiativeType: 'Other', initiativeTypeOther: e.target.value })}
                          placeholder="Specify custom type of initiative..."
                          className="w-full pl-3.5 pr-8 py-2 bg-white border border-[#004B87] rounded-lg text-slate-800 font-medium focus:outline-none focus:border-[#004B87] text-xs shadow-xs"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, initiativeType: CCRP_INITIATIVE_TYPES[0], initiativeTypeOther: '' })}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
                          title="Switch back to dropdown"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <select
                        value={formData.initiativeType}
                        onChange={(e) => {
                          if (e.target.value === 'Other') {
                            setFormData({ ...formData, initiativeType: 'Other', initiativeTypeOther: '' });
                          } else {
                            setFormData({ ...formData, initiativeType: e.target.value, initiativeTypeOther: '' });
                          }
                        }}
                        className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 font-medium focus:outline-none focus:border-[#004B87] truncate text-xs cursor-pointer"
                      >
                        {CCRP_INITIATIVE_TYPES.map((it) => (
                          <option key={it} value={it}>{it}</option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Initiative Source *
                    </label>
                    <select
                      value={formData.initiativeSource || CCRP_INITIATIVE_SOURCES[0]}
                      onChange={(e) => {
                        setFormData({ ...formData, initiativeSource: e.target.value, initiativeSourceOther: '' });
                      }}
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 font-medium focus:outline-none focus:border-[#004B87] truncate text-xs cursor-pointer"
                    >
                      {CCRP_INITIATIVE_SOURCES.map((is) => (
                        <option key={is} value={is}>{is}</option>
                      ))}
                    </select>
                  </div>

                  <div className="hidden lg:block"></div>

                  <div className="col-span-1 sm:col-span-2 lg:col-span-4">
                    <label className="block text-slate-700 font-semibold mb-1">
                      Indicators and Targets 2023–2027 *
                    </label>
                    <textarea
                      rows={3}
                      value={formData.indicatorsAndTargets}
                      onChange={(e) => setFormData({ ...formData, indicatorsAndTargets: e.target.value })}
                      placeholder="Specify revised targets and indicators..."
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 font-medium focus:outline-none focus:border-[#004B87] text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Project Manager & Timeline */}
            {activeFormTab === 'timeline' && (
              <div className="space-y-4 animate-fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Project Manager Name *
                    </label>
                    <input
                      type="text"
                      value={formData.projectManagerName}
                      onChange={(e) => setFormData({ ...formData, projectManagerName: e.target.value })}
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 font-medium focus:outline-none focus:border-[#004B87] text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Project Manager Contact Details *
                    </label>
                    <input
                      type="text"
                      value={formData.projectManagerContact}
                      onChange={(e) => setFormData({ ...formData, projectManagerContact: e.target.value })}
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 font-medium focus:outline-none focus:border-[#004B87] text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 font-medium focus:outline-none focus:border-[#004B87] text-xs cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 font-medium focus:outline-none focus:border-[#004B87] text-xs cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Amendment Justification */}
            {activeFormTab === 'justification' && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Addition/Deletion Justification *
                  </label>
                  <FieldTooltip content="Provide comprehensive reasoning explaining why the initiative data, indicators, or targets are being amended." example="Expanded solar generation capacity and included battery storage facility.">
                    <textarea
                      rows={4}
                      value={formData.justification}
                      onChange={(e) => setFormData({ ...formData, justification: e.target.value })}
                      placeholder="Detail the justification for amending initiative parameters, scope, or timeline..."
                      className="w-full p-3 bg-white border border-slate-200 rounded-lg text-slate-800 font-medium focus:outline-none focus:border-[#004B87] leading-relaxed text-xs"
                    />
                  </FieldTooltip>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Action Buttons Outside Frame */}
        <div className="flex-shrink-0 pt-3 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => setViewMode(selectedInitiativeCode ? 'history' : 'table')}
            className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-700 flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>Cancel</span>
          </button>
          <button
            type="button"
            onClick={handleSaveDraftAmendment}
            className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-[#004B87] text-xs font-bold text-[#004B87] flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Bookmark className="w-3.5 h-3.5 fill-current" />
            <span>Save Draft</span>
          </button>

          {activeFormTab === 'details' && (
            <button
              type="button"
              onClick={() => setActiveFormTab('timeline')}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#004B87] to-[#006BB8] text-xs font-bold text-white flex items-center gap-2 shadow-md shadow-[#004B87]/25 hover:shadow-lg hover:from-[#003d6e] hover:to-[#005c9e] transition-all cursor-pointer active:scale-95"
            >
              <span>Next</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {activeFormTab === 'timeline' && (
            <button
              type="button"
              onClick={() => setActiveFormTab('justification')}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#004B87] to-[#006BB8] text-xs font-bold text-white flex items-center gap-2 shadow-md shadow-[#004B87]/25 hover:shadow-lg hover:from-[#003d6e] hover:to-[#005c9e] transition-all cursor-pointer active:scale-95"
            >
              <span>Next</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {activeFormTab === 'justification' && (
            <button
              type="button"
              onClick={handleSubmitAmendment}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#004B87] to-[#006BB8] text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-[#004B87]/25 hover:shadow-lg hover:from-[#003d6e] hover:to-[#005c9e] cursor-pointer active:scale-95 transition-all"
            >
              <span>Submit Amendment</span>
              <Send className="w-3.5 h-3.5 fill-current opacity-80" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW MODE 3: AMENDMENT DETAILS / WORKFLOW PAGE (3-STEP TABS MIRROR)
  // =========================================================================
  const viewingAmendment = initiativeAmendments[0] || (currentInitiative ? {
    id: `AM-${currentInitiative.initiativeCode}-01`,
    initiativeId: currentInitiative.initiativeCode,
    initiativeName: currentInitiative.name,
    description: currentInitiative.description,
    entity: currentInitiative.entity,
    supportingEntity: currentInitiative.supportingEntity,
    scope: currentInitiative.scope,
    strategicObjective: currentInitiative.strategicObjective,
    strategicObjectiveOther: currentInitiative.strategicObjectiveOther,
    projectSector: currentInitiative.sector,
    initiativeType: currentInitiative.initiativeType,
    initiativeTypeOther: currentInitiative.initiativeTypeOther,
    initiativeSource: currentInitiative.initiativeSource,
    indicatorsAndTargets: currentInitiative.indicatorsAndTargets,
    projectManagerName: currentInitiative.projectManagerName,
    projectManagerContact: currentInitiative.projectManagerContact,
    startDate: currentInitiative.startDate,
    endDate: currentInitiative.endDate,
    justification: 'Approved baseline initiative registration under CCRP.',
    version: 'Amendment',
    versionNum: 1,
    status: 'Approved / Published' as const,
    submittedDate: '18 Jan 2026',
    submittedBy: currentInitiative.projectManagerName,
    isLatest: true,
    changes: ['Initial initiative registration approved and published'],
  } : null);

  const isCorrectionNotice = viewingAmendment?.isNotice || viewingAmendment?.status === 'Returned for Correction' || viewingAmendment?.status === 'Correction Requested';
  const isApproved = viewingAmendment?.status === 'Approved / Published' || viewingAmendment?.status === 'Approved';
  const isUnderReview = viewingAmendment?.status === 'Under EAD Review' || viewingAmendment?.status === 'Under Review';
  const isSubmitted = viewingAmendment?.status === 'Submitted';
  const isDraft = viewingAmendment?.status === 'Draft';

  return (
    <div className="h-full flex flex-col overflow-hidden font-sans py-1 animate-fade-in">
      {/* Top Header */}
      <div className="flex-shrink-0 pb-[14px] pt-0.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className="text-[#004B87] hover:text-[#003d6e] p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            title="Back to Overview"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2]" />
          </button>
          <h1 className="text-[18px] font-bold font-display text-[#004B87] tracking-tight">
            {viewingAmendment?.initiativeName || currentInitiative?.name || 'Initiative Amendment Details'}
          </h1>
          {currentInitiative && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#EBF3FA] text-[#004B87] border border-[#004B87]/20 shadow-2xs inline-flex items-center">
              ID: {currentInitiative.initiativeCode}
            </span>
          )}
          {viewingAmendment && renderStatusBadge(viewingAmendment.status, viewingAmendment.ticketStatus)}
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Action buttons on header */}
          {isFacilityOperator && (isSubmitted || isUnderReview || isDraft || isCorrectionNotice) && viewingAmendment && (
            <button
              type="button"
              onClick={() => handleOpenCreateForm(viewingAmendment)}
              className="h-8 px-4 bg-gradient-to-r from-[#004B87] to-[#006BB8] text-white rounded-[8px] text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#004B87]/25 hover:shadow-lg hover:from-[#003d6e] hover:to-[#005c9e] transition-all cursor-pointer active:scale-95 shrink-0"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Edit Amendment</span>
            </button>
          )}

          {isFacilityOperator && isApproved && (
            <button
              type="button"
              onClick={() => handleOpenCreateForm()}
              className="h-8 px-4 bg-gradient-to-r from-[#004B87] to-[#006BB8] text-white rounded-[8px] text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#004B87]/25 hover:shadow-lg hover:from-[#003d6e] hover:to-[#005c9e] transition-all cursor-pointer active:scale-95 shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Amendment</span>
            </button>
          )}

          {isEadReviewerOrAdmin && (isSubmitted || isUnderReview) && viewingAmendment && (
            <button
              type="button"
              onClick={() => {
                setReviewModalAmendment(viewingAmendment);
                setReviewComments('');
              }}
              className="h-8 px-4 bg-gradient-to-r from-[#004B87] to-[#006BB8] text-white rounded-[8px] text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#004B87]/25 hover:shadow-lg hover:from-[#003d6e] hover:to-[#005c9e] transition-all cursor-pointer active:scale-95 shrink-0"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Review Amendment</span>
            </button>
          )}

          {isApproved && viewingAmendment?.ticketStatus === 'Ticket Required' && (
            <button
              type="button"
              onClick={() => setTicketModalAmendment(viewingAmendment)}
              className="h-8 px-4 bg-amber-600 hover:bg-amber-700 text-white rounded-[8px] text-xs font-bold flex items-center gap-1.5 shadow-md shadow-amber-600/20 transition-all cursor-pointer active:scale-95 shrink-0"
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>Raise Ticket</span>
            </button>
          )}

          {isApproved && viewingAmendment?.ticketStatus === 'Ticket Raised' && (
            <button
              type="button"
              onClick={() => handleCompleteRegistryUpdate(viewingAmendment)}
              className="h-8 px-4 bg-gradient-to-r from-[#004B87] to-[#006BB8] hover:from-[#003d6e] hover:to-[#005c9e] text-white rounded-[8px] text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#004B87]/25 transition-all cursor-pointer active:scale-95 shrink-0"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Complete Registry Update</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Card Container */}
      <div className="flex-1 min-h-0 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-3.5 sm:p-4 flex flex-col overflow-hidden">
        {/* Stepper Navigation: Exactly 3 Steps */}
        <div className="flex-shrink-0 flex items-center pb-3 mb-1 overflow-x-auto no-scrollbar">
          <div className="inline-flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-[6px] shadow-2xs">
            {AMENDMENT_STEPS.map((step, idx) => {
              const currentStepNum =
                activeViewTab === 'details'
                  ? 1
                  : activeViewTab === 'timeline'
                    ? 2
                    : 3;
              const isActive = step.stepNumber === currentStepNum;
              const isCompleted = step.stepNumber < currentStepNum;
              const isArrowHighlighted = idx < currentStepNum - 1;

              return (
                <React.Fragment key={step.id}>
                  <button
                    type="button"
                    onClick={() => setActiveViewTab(step.id)}
                    className={`px-3.5 py-1.5 rounded-[6px] text-xs transition-all flex items-center gap-2 cursor-pointer select-none ${
                      isActive
                        ? 'bg-gradient-to-r from-[#004B87] to-[#006BB8] text-white font-bold shadow-xs'
                        : isCompleted
                          ? 'text-slate-700 hover:text-[#004B87] hover:bg-slate-50 font-semibold'
                          : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50 font-medium'
                    }`}
                  >
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
                    <span className="whitespace-nowrap">{step.title}</span>
                  </button>

                  {idx < AMENDMENT_STEPS.length - 1 && (
                    <ChevronRight
                      className={`w-4 h-4 shrink-0 mx-0.5 transition-colors ${
                        isArrowHighlighted
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

        {/* Read-Only Inspection Content */}
        <div className="flex-1 min-h-0 overflow-y-auto space-y-4 pr-2.5 py-0.5 custom-scrollbar text-xs">
          {/* Reviewer Directive Notice if any */}
          {viewingAmendment?.reviewerComments && (
            <div className={`p-3 rounded-xl border leading-relaxed ${
              isCorrectionNotice
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : 'bg-sky-50 border-sky-200 text-sky-900'
            }`}>
              <div className="flex items-start gap-2">
                <MessageSquare className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block mb-0.5">
                    {isCorrectionNotice ? 'Reviewer Correction Directive:' : 'Reviewer Assessment:'}
                  </span>
                  <span>{viewingAmendment.reviewerComments}</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 1: Initiative Details */}
          {activeViewTab === 'details' && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                <div className="col-span-1 sm:col-span-2 lg:col-span-4">
                  <label className="block text-slate-700 font-semibold mb-1">
                    Initiative Name
                  </label>
                  <input
                    type="text"
                    readOnly
                    disabled
                    value={viewingAmendment?.initiativeName || currentInitiative?.name || '—'}
                    className="w-full px-3.5 py-2 bg-[#F8FAFC] border border-slate-200 rounded-lg text-slate-800 font-bold text-xs shadow-2xs cursor-not-allowed select-none"
                  />
                </div>

                <div className="col-span-1 sm:col-span-2 lg:col-span-4">
                  <label className="block text-slate-700 font-semibold mb-1">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    readOnly
                    disabled
                    value={viewingAmendment?.description || currentInitiative?.description || '—'}
                    className="w-full p-2.5 bg-[#F8FAFC] border border-slate-200 rounded-lg text-slate-800 font-medium text-xs leading-relaxed cursor-not-allowed select-none"
                  />
                </div>

                {/* Row 1 of 4 fields */}
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Entity
                  </label>
                  <input
                    type="text"
                    readOnly
                    disabled
                    value={viewingAmendment?.entity || currentInitiative?.entity || '—'}
                    className="w-full px-3.5 py-2 bg-[#F8FAFC] border border-slate-200 rounded-lg text-slate-800 font-medium text-xs cursor-not-allowed select-none"
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
                    value={viewingAmendment?.supportingEntity || currentInitiative?.supportingEntity || '—'}
                    className="w-full px-3.5 py-2 bg-[#F8FAFC] border border-slate-200 rounded-lg text-slate-800 font-medium text-xs cursor-not-allowed select-none"
                  />
                </div>

                {/* Row 1: Entity, Supporting Entity, Scope, Project Sector */}
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Scope
                  </label>
                  <input
                    type="text"
                    readOnly
                    disabled
                    value={
                      (viewingAmendment?.pillar === 'Others' || viewingAmendment?.pillar === 'Other'
                        ? viewingAmendment?.pillarOther || 'Others'
                        : viewingAmendment?.pillar) ||
                      (currentInitiative?.pillar === 'Others' || currentInitiative?.pillar === 'Other'
                        ? (currentInitiative as any)?.pillarOther || 'Others'
                        : currentInitiative?.pillar) ||
                      '—'
                    }
                    className="w-full px-3.5 py-2 bg-[#F8FAFC] border border-slate-200 rounded-lg text-slate-800 font-medium text-xs truncate cursor-not-allowed select-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Project Sector
                  </label>
                  <input
                    type="text"
                    readOnly
                    disabled
                    value={
                      (viewingAmendment?.projectSector === 'Other'
                        ? viewingAmendment?.projectSectorOther || 'Other'
                        : viewingAmendment?.projectSector) ||
                      (currentInitiative?.sector === 'Other'
                        ? (currentInitiative as any)?.projectSectorOther || 'Other'
                        : currentInitiative?.sector) ||
                      '—'
                    }
                    className="w-full px-3.5 py-2 bg-[#F8FAFC] border border-slate-200 rounded-lg text-slate-800 font-medium text-xs cursor-not-allowed select-none"
                  />
                </div>

                {/* Row 2 of fields */}
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Strategic Objective
                  </label>
                  <input
                    type="text"
                    readOnly
                    disabled
                    value={
                      (viewingAmendment?.strategicObjective === 'Other'
                        ? viewingAmendment?.strategicObjectiveOther || 'Other'
                        : viewingAmendment?.strategicObjective) ||
                      (currentInitiative?.strategicObjective === 'Other'
                        ? currentInitiative?.strategicObjectiveOther || 'Other'
                        : currentInitiative?.strategicObjective) ||
                      '—'
                    }
                    className="w-full px-3.5 py-2 bg-[#F8FAFC] border border-slate-200 rounded-lg text-slate-800 font-medium text-xs truncate cursor-not-allowed select-none"
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
                    value={
                      (viewingAmendment?.initiativeType === 'Other'
                        ? viewingAmendment?.initiativeTypeOther || 'Other'
                        : viewingAmendment?.initiativeType) ||
                      (currentInitiative?.initiativeType === 'Other'
                        ? currentInitiative?.initiativeTypeOther || 'Other'
                        : currentInitiative?.initiativeType) ||
                      '—'
                    }
                    className="w-full px-3.5 py-2 bg-[#F8FAFC] border border-slate-200 rounded-lg text-slate-800 font-medium text-xs truncate cursor-not-allowed select-none"
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
                    value={
                      (viewingAmendment?.initiativeSource === 'Other' || (!CCRP_INITIATIVE_SOURCES.includes(viewingAmendment?.initiativeSource || '') && viewingAmendment?.initiativeSourceOther)
                        ? `Other: ${viewingAmendment?.initiativeSourceOther || '—'}`
                        : (viewingAmendment?.initiativeSource || currentInitiative?.initiativeSource)) ||
                      '—'
                    }
                    className="w-full px-3.5 py-2 bg-[#F8FAFC] border border-slate-200 rounded-lg text-slate-800 font-medium text-xs truncate cursor-not-allowed select-none"
                  />
                </div>

                <div className="hidden lg:block"></div>

                <div className="col-span-1 sm:col-span-2 lg:col-span-4">
                  <label className="block text-slate-700 font-semibold mb-1">
                    Indicators and Targets 2023–2027
                  </label>
                  <textarea
                    rows={3}
                    readOnly
                    disabled
                    value={viewingAmendment?.indicatorsAndTargets || currentInitiative?.indicatorsAndTargets || '—'}
                    className="w-full p-2.5 bg-[#F8FAFC] border border-slate-200 rounded-lg text-slate-800 font-medium text-xs leading-relaxed cursor-not-allowed select-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Project Manager & Timeline */}
          {activeViewTab === 'timeline' && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Project Manager Name
                  </label>
                  <input
                    type="text"
                    readOnly
                    disabled
                    value={viewingAmendment?.projectManagerName || currentInitiative?.projectManagerName || '—'}
                    className="w-full px-3.5 py-2 bg-[#F8FAFC] border border-slate-200 rounded-lg text-slate-800 font-medium text-xs cursor-not-allowed select-none"
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
                    value={viewingAmendment?.projectManagerContact || currentInitiative?.projectManagerContact || '—'}
                    className="w-full px-3.5 py-2 bg-[#F8FAFC] border border-slate-200 rounded-lg text-slate-800 font-medium text-xs cursor-not-allowed select-none"
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
                    value={viewingAmendment?.startDate || currentInitiative?.startDate || '—'}
                    className="w-full px-3.5 py-2 bg-[#F8FAFC] border border-slate-200 rounded-lg text-slate-800 font-medium text-xs cursor-not-allowed select-none"
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
                    value={viewingAmendment?.endDate || currentInitiative?.endDate || '—'}
                    className="w-full px-3.5 py-2 bg-[#F8FAFC] border border-slate-200 rounded-lg text-slate-800 font-medium text-xs cursor-not-allowed select-none"
                  />
                </div>
              </div>

              {/* Initiative Context Info Strip */}
              <div className="mt-4 p-3.5 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px] font-medium">Submitted By</span>
                  <span className="font-semibold text-slate-800 mt-0.5 block truncate">
                    {viewingAmendment?.submittedBy || '—'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px] font-medium">Submitted Date</span>
                  <span className="font-semibold text-slate-800 mt-0.5 block truncate">
                    {viewingAmendment?.submittedDate || '—'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px] font-medium">Lead Entity</span>
                  <span className="font-semibold text-slate-800 mt-0.5 block truncate">
                    {viewingAmendment?.entity || currentInitiative?.entity || '—'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px] font-medium">Strategy Pillar & Cadence</span>
                  <span className="font-semibold text-purple-800 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100 text-[11px] inline-block mt-0.5">
                    {currentInitiative?.pillar} ({currentInitiative?.cadence})
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Amendment Justification */}
          {activeViewTab === 'justification' && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Addition/Deletion Justification
                </label>
                <textarea
                  rows={4}
                  readOnly
                  disabled
                  value={viewingAmendment?.justification || '—'}
                  className="w-full p-3 bg-[#F8FAFC] border border-slate-200 rounded-lg text-slate-800 font-medium text-xs leading-relaxed cursor-not-allowed select-none"
                />
              </div>

              {/* Post-Approval Ticket Action Banner */}
              {isApproved && viewingAmendment?.ticketStatus === 'Ticket Required' && (
                <div className="p-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl flex items-center justify-between gap-3 mt-2">
                  <div className="flex items-center gap-2 text-amber-900 font-medium text-xs">
                    <Ticket className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>Amendment approved. Please raise a registry update ticket to finalize the system transition.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setTicketModalAmendment(viewingAmendment)}
                    className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer flex items-center gap-1.5"
                  >
                    <Ticket className="w-3.5 h-3.5" />
                    <span>Raise Ticket</span>
                  </button>
                </div>
              )}

              {/* Post-Approval Registry Update Pending Banner */}
              {isApproved && viewingAmendment?.ticketStatus === 'Ticket Raised' && (
                <div className="p-3 bg-gradient-to-r from-sky-50 to-indigo-50 border border-sky-200 rounded-xl flex items-center justify-between gap-3 mt-2">
                  <div className="flex items-center gap-2 text-sky-950 font-medium text-xs">
                    <Clock className="w-4 h-4 text-[#004B87] shrink-0" />
                    <span>Ticket <strong>{viewingAmendment.ticketId || 'TCK-2026-7073-AM'}</strong> raised. Status: <strong>Registry Update Pending</strong>. Complete the master data registry transition.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCompleteRegistryUpdate(viewingAmendment)}
                    className="px-3.5 py-1.5 bg-gradient-to-r from-[#004B87] to-[#006BB8] hover:from-[#003d6e] hover:to-[#005c9e] text-white rounded-lg text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Complete Registry Update</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* View Mode Bottom Action Bar */}
      <div className="flex-shrink-0 pt-3 flex items-center justify-end gap-3">
        {activeViewTab === 'details' && (
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
              onClick={() => setActiveViewTab('timeline')}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#004B87] to-[#006BB8] text-xs font-bold text-white flex items-center gap-2 shadow-md shadow-[#004B87]/25 hover:shadow-lg hover:from-[#003d6e] hover:to-[#005c9e] transition-all cursor-pointer active:scale-95"
            >
              <span>Next</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </>
        )}

        {activeViewTab === 'timeline' && (
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
              onClick={() => setActiveViewTab('justification')}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#004B87] to-[#006BB8] text-xs font-bold text-white flex items-center gap-2 shadow-md shadow-[#004B87]/25 hover:shadow-lg hover:from-[#003d6e] hover:to-[#005c9e] transition-all cursor-pointer active:scale-95"
            >
              <span>Next</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </>
        )}

        {activeViewTab === 'justification' && (
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
          </>
        )}
      </div>

      {/* =================================================================== */}
      {/* MODAL 1: RAISE TICKET MODAL */}
      {/* =================================================================== */}
      {ticketModalAmendment && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-5 space-y-4 text-xs font-sans">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2 text-navy-950 font-bold text-sm">
                <Ticket className="w-4 h-4 text-amber-600" />
                <span>Raise Registry Master Data Ticket</span>
              </div>
              <button
                onClick={() => setTicketModalAmendment(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-slate-600 leading-relaxed">
              Raise an official master data maintenance ticket to update the live registry records following the approved initiative amendment.
            </p>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Initiative:</span>
                <span className="font-bold text-slate-800 text-right truncate max-w-[200px]">{ticketModalAmendment.initiativeName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Project ID:</span>
                <span className="font-mono font-bold text-[#004B87]">{ticketModalAmendment.initiativeId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Amendment ID:</span>
                <span className="font-mono font-bold text-[#004B87]">{ticketModalAmendment.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Entity:</span>
                <span className="font-semibold text-slate-800">{ticketModalAmendment.entity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Approved Date:</span>
                <span className="font-semibold text-slate-800">{ticketModalAmendment.submittedDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Submitted By:</span>
                <span className="font-semibold text-slate-800">{ticketModalAmendment.submittedBy}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setTicketModalAmendment(null)}
                className="px-4 py-2 bg-white border border-slate-300 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRaiseTicket(ticketModalAmendment)}
                className="px-5 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white rounded-xl font-bold shadow-md shadow-amber-600/20 cursor-pointer flex items-center gap-1.5 text-xs"
              >
                <Ticket className="w-3.5 h-3.5" />
                <span>Confirm & Raise Ticket</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL 2: EAD REVIEW MODAL */}
      {/* =================================================================== */}
      {reviewModalAmendment && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-5 space-y-4 text-xs font-sans">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2 text-navy-950 font-bold text-sm">
                <ShieldCheck className="w-4 h-4 text-[#004B87]" />
                <span>Review Amendment Request</span>
              </div>
              <button
                onClick={() => setReviewModalAmendment(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                EAD Reviewer Official Assessment / Feedback
              </label>
              <textarea
                rows={3}
                value={reviewComments}
                onChange={(e) => setReviewComments(e.target.value)}
                placeholder="Enter regulatory review comments, verification notes, or return directives..."
                className="w-full p-3 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-[#004B87] text-xs"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setReviewModalAmendment(null)}
                className="px-4 py-2 bg-white border border-slate-300 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReturnAmendmentForCorrection(reviewModalAmendment)}
                className="px-4 py-2 bg-white border border-amber-300 text-amber-800 hover:bg-amber-50 rounded-xl font-bold cursor-pointer flex items-center gap-1.5 text-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Return for Correction</span>
              </button>
              <button
                onClick={() => handleApproveAmendmentByEad(reviewModalAmendment)}
                className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl font-bold shadow-md shadow-emerald-600/20 hover:from-emerald-700 hover:to-emerald-800 cursor-pointer flex items-center gap-1.5 text-xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Approve & Publish</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VersionHistoryView;
