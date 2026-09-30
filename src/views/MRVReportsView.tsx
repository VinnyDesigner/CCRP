import React, { useState, useMemo } from 'react';
import {
  FileText,
  Download,
  Eye,
  Calendar,
  Layers,
  History,
  TrendingUp,
  BarChart3,
  UploadCloud,
  Check,
  Building2,
  ExternalLink,
  Target,
  CheckCircle2,
  AlertCircle,
  Filter,
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';
import { useMRV } from '../context/MRVContext';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';
import { SubmissionListingTable } from '../components/mrv/SubmissionListingTable';
import {
  CCRP_APPROVED_INITIATIVES,
  INITIAL_FACILITY_EMISSIONS,
  PerformanceReportData,
  CCRPApprovedInitiative,
} from '../data/facilityEmissionsData';
import { INITIAL_FACILITY_REGISTRATIONS, getSectorKpiInfo } from '../data/facilityRegistrationsData';

// ---------------------------------------------------------------------------
// ALL 7 APPROVED INITIATIVES WITH METADATA & CADENCE
// ---------------------------------------------------------------------------
export const ALL_CCRP_INITIATIVES: CCRPApprovedInitiative[] = [
  {
    id: 'fac-1',
    initiativeCode: 'CCRP-INIT-2026-7073',
    name: 'Al Dhafra Solar PV Decarbonization Program',
    entity: 'Department of Energy (DoE)',
    pillar: 'Mitigation',
    cadence: 'Semiannual',
    sector: 'Energy',
    strategicObjective: 'Reduce GHG Emissions in Key Sectors',
    startDate: '01-Jan-2024',
    endDate: '31-Dec-2027',
    status: 'Approved',
  },
  {
    id: 'fac-2',
    initiativeCode: 'CCRP-INIT-2026-0118',
    name: 'Low-Carbon Industrial Transition & Green Hydrogen Hub',
    entity: 'Abu Dhabi Department of Economic Development (ADDED)',
    pillar: 'Economic Diversification',
    cadence: 'Semiannual',
    sector: 'Industry & Manufacturing',
    strategicObjective: 'Drive a Low-Carbon Innovation and Economic Diversification Agenda',
    startDate: '01-Feb-2024',
    endDate: '30-Jun-2029',
    status: 'Approved',
  },
  {
    id: 'fac-3',
    initiativeCode: 'CCRP-INIT-2026-0422',
    name: 'Abu Dhabi Mangrove & Blue Carbon Coastal Restoration',
    entity: 'Environment Agency – Abu Dhabi (EAD)',
    pillar: 'Adaptation',
    cadence: 'Quarterly',
    sector: 'Coastal & Marine Ecosystems',
    strategicObjective: 'Increase Removal of Greenhouse Gas (GHG) Emissions Through Carbon Sinks',
    startDate: '15-Mar-2024',
    endDate: '31-Dec-2028',
    status: 'Approved',
  },
  {
    id: 'fac-4',
    initiativeCode: 'CCRP-INIT-2026-0305',
    name: 'Electric Public Transit Fleet & EV Fast-Charging Network',
    entity: 'Integrated Transport Centre (ITC)',
    pillar: 'Mitigation',
    cadence: 'Semiannual',
    sector: 'Transport',
    strategicObjective: 'Reduce GHG Emissions in Key Sectors',
    startDate: '01-Apr-2024',
    endDate: '31-Dec-2027',
    status: 'Approved',
  },
  {
    id: 'fac-5',
    initiativeCode: 'CCRP-INIT-2026-0775',
    name: 'Integrated Organic Waste & Biogas Energy Recovery Program',
    entity: 'Abu Dhabi Waste Management Centre (Tadweer)',
    pillar: 'Cross Cutting',
    cadence: 'Semiannual',
    sector: 'Waste Management',
    strategicObjective: 'Reduce GHG Emissions in Key Sectors',
    startDate: '01-Feb-2024',
    endDate: '31-Jan-2028',
    status: 'Approved',
  },
  {
    id: 'fac-6',
    initiativeCode: 'CCRP-INIT-2026-0619',
    name: 'Climate Resilient Urban Infrastructure & Stormwater Drainage Upgrade',
    entity: 'Department of Municipalities and Transport (DMT)',
    pillar: 'Adaptation',
    cadence: 'Quarterly',
    sector: 'Infrastructure & Built Environment',
    strategicObjective: 'Enhance Resilience of Vulnerable Sectors to Adapt to Climate Change Impacts',
    startDate: '01-Mar-2024',
    endDate: '28-Feb-2028',
    status: 'Approved',
  },
  {
    id: 'fac-7',
    initiativeCode: 'CCRP-INIT-2026-0814',
    name: 'Agricultural Water Efficiency & Smart Irrigation Program',
    entity: 'Abu Dhabi Agriculture and Food Safety Authority (ADAFSA)',
    pillar: 'Adaptation',
    cadence: 'Quarterly',
    sector: 'Agriculture, Forestry & Land Use (AFOLU)',
    strategicObjective: 'Enhance Resilience of Vulnerable Sectors to Adapt to Climate Change Impacts',
    startDate: '01-May-2024',
    endDate: '31-Dec-2028',
    status: 'Approved',
  },
];

// ---------------------------------------------------------------------------
// PROJECT PERFORMANCE DATABASE BY INITIATIVE AND FINANCIAL YEAR
// ---------------------------------------------------------------------------
export interface PerformancePeriodRecord {
  period: string;
  plannedProgress: number;
  actualProgress: number;
  variance: number;
  status: string;
  plannedGhg: string;
  actualGhg: string;
  isCurrent?: boolean;
}

const PROJECT_PERFORMANCE_DATABASE: Record<string, Record<string, PerformancePeriodRecord[]>> = {
  // 1. Al Dhafra Solar PV Decarbonization Program (Mitigation - Semiannual)
  'fac-1': {
    'FY 2026–27': [
      {
        period: '2026 H1',
        plannedProgress: 75,
        actualProgress: 68,
        variance: -7,
        status: 'In Progress',
        plannedGhg: '142,800',
        actualGhg: '138,500',
        isCurrent: true,
      },
      {
        period: '2026 H2',
        plannedProgress: 88,
        actualProgress: 84,
        variance: -4,
        status: 'Submitted',
        plannedGhg: '150,000',
        actualGhg: '146,000',
        isCurrent: false,
      },
    ],
    'FY 2025–26': [
      {
        period: '2025 H1',
        plannedProgress: 45,
        actualProgress: 42,
        variance: -3,
        status: 'Completed',
        plannedGhg: '135,000',
        actualGhg: '135,000',
        isCurrent: false,
      },
      {
        period: '2025 H2',
        plannedProgress: 60,
        actualProgress: 60,
        variance: 0,
        status: 'Completed',
        plannedGhg: '140,000',
        actualGhg: '140,200',
        isCurrent: false,
      },
    ],
    'FY 2024–25': [
      {
        period: '2024 H1',
        plannedProgress: 15,
        actualProgress: 15,
        variance: 0,
        status: 'Completed',
        plannedGhg: '60,000',
        actualGhg: '62,000',
        isCurrent: false,
      },
      {
        period: '2024 H2',
        plannedProgress: 30,
        actualProgress: 28,
        variance: -2,
        status: 'Completed',
        plannedGhg: '110,000',
        actualGhg: '108,500',
        isCurrent: false,
      },
    ],
    'FY 2023–24': [],
  },

  // 2. Low-Carbon Industrial Transition & Green Hydrogen Hub (Econ. Div - Semiannual)
  'fac-2': {
    'FY 2026–27': [
      {
        period: '2026 H1',
        plannedProgress: 35,
        actualProgress: 30,
        variance: -5,
        status: 'In Progress',
        plannedGhg: '—',
        actualGhg: '—',
        isCurrent: true,
      },
      {
        period: '2026 H2',
        plannedProgress: 48,
        actualProgress: 45,
        variance: -3,
        status: 'Submitted',
        plannedGhg: '—',
        actualGhg: '—',
        isCurrent: false,
      },
    ],
    'FY 2025–26': [
      {
        period: '2025 H1',
        plannedProgress: 15,
        actualProgress: 14,
        variance: -1,
        status: 'Completed',
        plannedGhg: '—',
        actualGhg: '—',
        isCurrent: false,
      },
      {
        period: '2025 H2',
        plannedProgress: 25,
        actualProgress: 22,
        variance: -3,
        status: 'Completed',
        plannedGhg: '—',
        actualGhg: '—',
        isCurrent: false,
      },
    ],
    'FY 2024–25': [
      {
        period: '2024 H1',
        plannedProgress: 5,
        actualProgress: 5,
        variance: 0,
        status: 'Completed',
        plannedGhg: '—',
        actualGhg: '—',
        isCurrent: false,
      },
      {
        period: '2024 H2',
        plannedProgress: 10,
        actualProgress: 10,
        variance: 0,
        status: 'Completed',
        plannedGhg: '—',
        actualGhg: '—',
        isCurrent: false,
      },
    ],
    'FY 2023–24': [],
  },

  // 3. Abu Dhabi Mangrove & Blue Carbon Coastal Restoration (Adaptation - Quarterly)
  'fac-3': {
    'FY 2026–27': [
      {
        period: '2026 Q1',
        plannedProgress: 50,
        actualProgress: 52,
        variance: 2,
        status: 'In Progress',
        plannedGhg: '—',
        actualGhg: '—',
        isCurrent: true,
      },
      {
        period: '2026 Q2',
        plannedProgress: 62,
        actualProgress: 60,
        variance: -2,
        status: 'Submitted',
        plannedGhg: '—',
        actualGhg: '—',
        isCurrent: false,
      },
      {
        period: '2026 Q3',
        plannedProgress: 75,
        actualProgress: 74,
        variance: -1,
        status: 'Submitted',
        plannedGhg: '—',
        actualGhg: '—',
        isCurrent: false,
      },
      {
        period: '2026 Q4',
        plannedProgress: 85,
        actualProgress: 85,
        variance: 0,
        status: 'Submitted',
        plannedGhg: '—',
        actualGhg: '—',
        isCurrent: false,
      },
    ],
    'FY 2025–26': [
      {
        period: '2025 Q1',
        plannedProgress: 15,
        actualProgress: 15,
        variance: 0,
        status: 'Completed',
        plannedGhg: '—',
        actualGhg: '—',
        isCurrent: false,
      },
      {
        period: '2025 Q2',
        plannedProgress: 25,
        actualProgress: 24,
        variance: -1,
        status: 'Completed',
        plannedGhg: '—',
        actualGhg: '—',
        isCurrent: false,
      },
      {
        period: '2025 Q3',
        plannedProgress: 35,
        actualProgress: 36,
        variance: 1,
        status: 'Completed',
        plannedGhg: '—',
        actualGhg: '—',
        isCurrent: false,
      },
      {
        period: '2025 Q4',
        plannedProgress: 45,
        actualProgress: 44,
        variance: -1,
        status: 'Completed',
        plannedGhg: '—',
        actualGhg: '—',
        isCurrent: false,
      },
    ],
    'FY 2024–25': [
      {
        period: '2024 Q1',
        plannedProgress: 5,
        actualProgress: 5,
        variance: 0,
        status: 'Completed',
        plannedGhg: '—',
        actualGhg: '—',
        isCurrent: false,
      },
      {
        period: '2024 Q2',
        plannedProgress: 8,
        actualProgress: 8,
        variance: 0,
        status: 'Completed',
        plannedGhg: '—',
        actualGhg: '—',
        isCurrent: false,
      },
      {
        period: '2024 Q3',
        plannedProgress: 10,
        actualProgress: 10,
        variance: 0,
        status: 'Completed',
        plannedGhg: '—',
        actualGhg: '—',
        isCurrent: false,
      },
      {
        period: '2024 Q4',
        plannedProgress: 12,
        actualProgress: 12,
        variance: 0,
        status: 'Completed',
        plannedGhg: '—',
        actualGhg: '—',
        isCurrent: false,
      },
    ],
    'FY 2023–24': [],
  },

  // 4. Electric Public Transit Fleet & EV Fast-Charging Network (Mitigation - Semiannual)
  'fac-4': {
    'FY 2026–27': [
      {
        period: '2026 H1',
        plannedProgress: 60,
        actualProgress: 55,
        variance: -5,
        status: 'In Progress',
        plannedGhg: '24,000',
        actualGhg: '21,500',
        isCurrent: true,
      },
      {
        period: '2026 H2',
        plannedProgress: 75,
        actualProgress: 70,
        variance: -5,
        status: 'Submitted',
        plannedGhg: '28,000',
        actualGhg: '26,000',
        isCurrent: false,
      },
    ],
    'FY 2025–26': [
      {
        period: '2025 H1',
        plannedProgress: 30,
        actualProgress: 30,
        variance: 0,
        status: 'Completed',
        plannedGhg: '10,000',
        actualGhg: '10,200',
        isCurrent: false,
      },
      {
        period: '2025 H2',
        plannedProgress: 50,
        actualProgress: 48,
        variance: -2,
        status: 'Completed',
        plannedGhg: '20,000',
        actualGhg: '19,500',
        isCurrent: false,
      },
    ],
    'FY 2024–25': [
      {
        period: '2024 H1',
        plannedProgress: 10,
        actualProgress: 10,
        variance: 0,
        status: 'Completed',
        plannedGhg: '4,000',
        actualGhg: '4,000',
        isCurrent: false,
      },
      {
        period: '2024 H2',
        plannedProgress: 20,
        actualProgress: 19,
        variance: -1,
        status: 'Completed',
        plannedGhg: '7,500',
        actualGhg: '7,200',
        isCurrent: false,
      },
    ],
    'FY 2023–24': [],
  },

  // 5. Integrated Organic Waste & Biogas Energy Recovery Program (Cross Cutting - Semiannual)
  'fac-5': {
    'FY 2026–27': [
      {
        period: '2026 H1',
        plannedProgress: 100,
        actualProgress: 100,
        variance: 0,
        status: 'Completed',
        plannedGhg: '38,500',
        actualGhg: '41,200',
        isCurrent: true,
      },
      {
        period: '2026 H2',
        plannedProgress: 100,
        actualProgress: 100,
        variance: 0,
        status: 'Completed',
        plannedGhg: '42,000',
        actualGhg: '43,500',
        isCurrent: false,
      },
    ],
    'FY 2025–26': [
      {
        period: '2025 H1',
        plannedProgress: 60,
        actualProgress: 58,
        variance: -2,
        status: 'Completed',
        plannedGhg: '25,000',
        actualGhg: '24,800',
        isCurrent: false,
      },
      {
        period: '2025 H2',
        plannedProgress: 85,
        actualProgress: 85,
        variance: 0,
        status: 'Completed',
        plannedGhg: '35,000',
        actualGhg: '36,000',
        isCurrent: false,
      },
    ],
    'FY 2024–25': [
      {
        period: '2024 H1',
        plannedProgress: 20,
        actualProgress: 20,
        variance: 0,
        status: 'Completed',
        plannedGhg: '8,000',
        actualGhg: '8,000',
        isCurrent: false,
      },
      {
        period: '2024 H2',
        plannedProgress: 40,
        actualProgress: 38,
        variance: -2,
        status: 'Completed',
        plannedGhg: '16,000',
        actualGhg: '15,500',
        isCurrent: false,
      },
    ],
    'FY 2023–24': [],
  },

  // 6. Climate Resilient Urban Infrastructure & Stormwater Drainage Upgrade (Adaptation - Quarterly)
  'fac-6': {
    'FY 2026–27': [
      {
        period: '2026 Q1',
        plannedProgress: 45,
        actualProgress: 40,
        variance: -5,
        status: 'In Progress',
        plannedGhg: '—',
        actualGhg: '—',
        isCurrent: true,
      },
      {
        period: '2026 Q2',
        plannedProgress: 58,
        actualProgress: 52,
        variance: -6,
        status: 'Returned for Correction',
        plannedGhg: '—',
        actualGhg: '—',
        isCurrent: false,
      },
    ],
    'FY 2025–26': [
      {
        period: '2025 Q1',
        plannedProgress: 15,
        actualProgress: 15,
        variance: 0,
        status: 'Completed',
        plannedGhg: '—',
        actualGhg: '—',
        isCurrent: false,
      },
      {
        period: '2025 Q2',
        plannedProgress: 22,
        actualProgress: 20,
        variance: -2,
        status: 'Completed',
        plannedGhg: '—',
        actualGhg: '—',
        isCurrent: false,
      },
      {
        period: '2025 Q3',
        plannedProgress: 30,
        actualProgress: 28,
        variance: -2,
        status: 'Completed',
        plannedGhg: '—',
        actualGhg: '—',
        isCurrent: false,
      },
      {
        period: '2025 Q4',
        plannedProgress: 38,
        actualProgress: 35,
        variance: -3,
        status: 'Completed',
        plannedGhg: '—',
        actualGhg: '—',
        isCurrent: false,
      },
    ],
    'FY 2024–25': [
      {
        period: '2024 Q1',
        plannedProgress: 5,
        actualProgress: 5,
        variance: 0,
        status: 'Completed',
        plannedGhg: '—',
        actualGhg: '—',
        isCurrent: false,
      },
      {
        period: '2024 Q2',
        plannedProgress: 8,
        actualProgress: 8,
        variance: 0,
        status: 'Completed',
        plannedGhg: '—',
        actualGhg: '—',
        isCurrent: false,
      },
      {
        period: '2024 Q3',
        plannedProgress: 10,
        actualProgress: 10,
        variance: 0,
        status: 'Completed',
        plannedGhg: '—',
        actualGhg: '—',
        isCurrent: false,
      },
      {
        period: '2024 Q4',
        plannedProgress: 12,
        actualProgress: 12,
        variance: 0,
        status: 'Completed',
        plannedGhg: '—',
        actualGhg: '—',
        isCurrent: false,
      },
    ],
    'FY 2023–24': [],
  },

  // 7. Agricultural Water Efficiency & Smart Irrigation Program (Adaptation - Quarterly)
  'fac-7': {
    'FY 2026–27': [
      {
        period: '2026 Q1',
        plannedProgress: 25,
        actualProgress: 20,
        variance: -5,
        status: 'In Progress',
        plannedGhg: '—',
        actualGhg: '—',
        isCurrent: true,
      },
      {
        period: '2026 Q2',
        plannedProgress: 38,
        actualProgress: 35,
        variance: -3,
        status: 'Draft',
        plannedGhg: '—',
        actualGhg: '—',
        isCurrent: false,
      },
      {
        period: '2026 Q3',
        plannedProgress: 50,
        actualProgress: 48,
        variance: -2,
        status: 'Draft',
        plannedGhg: '—',
        actualGhg: '—',
        isCurrent: false,
      },
      {
        period: '2026 Q4',
        plannedProgress: 65,
        actualProgress: 62,
        variance: -3,
        status: 'Draft',
        plannedGhg: '—',
        actualGhg: '—',
        isCurrent: false,
      },
    ],
    'FY 2025–26': [
      {
        period: '2025 Q1',
        plannedProgress: 5,
        actualProgress: 5,
        variance: 0,
        status: 'Completed',
        plannedGhg: '—',
        actualGhg: '—',
        isCurrent: false,
      },
      {
        period: '2025 Q2',
        plannedProgress: 10,
        actualProgress: 10,
        variance: 0,
        status: 'Completed',
        plannedGhg: '—',
        actualGhg: '—',
        isCurrent: false,
      },
      {
        period: '2025 Q3',
        plannedProgress: 15,
        actualProgress: 14,
        variance: -1,
        status: 'Completed',
        plannedGhg: '—',
        actualGhg: '—',
        isCurrent: false,
      },
      {
        period: '2025 Q4',
        plannedProgress: 20,
        actualProgress: 19,
        variance: -1,
        status: 'Completed',
        plannedGhg: '—',
        actualGhg: '—',
        isCurrent: false,
      },
    ],
    'FY 2024–25': [],
    'FY 2023–24': [],
  },
};

export const MRVReportsView: React.FC = () => {
  const { openReadOnlyViewer, facilityEmissions, facilityRegistrations } = useMRV();

  // Active Tab State: 'performance-summary' | 'submission-status' | 'history' | 'version'
  const [activeTab, setActiveTab] = useState<'performance-summary' | 'submission-status' | 'history' | 'version'>('performance-summary');

  // Multi-dimensional dynamic filter states
  const [selectedEntity, setSelectedEntity] = useState<string>('All');
  const [selectedPillar, setSelectedPillar] = useState<string>('All');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('fac-1');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('FY 2026–27');
  const [selectedReportingPeriod, setSelectedReportingPeriod] = useState<string>('All');
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // -------------------------------------------------------------------------
  // 1. FILTER COMBINATIONS & INITIATIVE SELECTION
  // -------------------------------------------------------------------------
  const allEntities = useMemo(() => {
    return Array.from(new Set(ALL_CCRP_INITIATIVES.map((i) => i.entity)));
  }, []);

  const allPillars = useMemo(() => {
    return ['Mitigation', 'Adaptation', 'Economic Diversification', 'Cross Cutting'];
  }, []);

  const filteredInitiatives = useMemo(() => {
    return ALL_CCRP_INITIATIVES.filter((init) => {
      const matchEntity = selectedEntity === 'All' || init.entity === selectedEntity;
      const matchPillar = selectedPillar === 'All' || init.pillar === selectedPillar;
      return matchEntity && matchPillar;
    });
  }, [selectedEntity, selectedPillar]);

  // Handle entity filter changes
  const handleEntityChange = (entity: string) => {
    setSelectedEntity(entity);
    const matching = ALL_CCRP_INITIATIVES.filter((init) => {
      const matchEntity = entity === 'All' || init.entity === entity;
      const matchPillar = selectedPillar === 'All' || init.pillar === selectedPillar;
      return matchEntity && matchPillar;
    });
    if (matching.length > 0 && !matching.some((i) => i.id === selectedProjectId)) {
      setSelectedProjectId(matching[0].id);
      setSelectedReportingPeriod('All');
    }
  };

  // Handle pillar filter changes
  const handlePillarChange = (pillar: string) => {
    setSelectedPillar(pillar);
    const matching = ALL_CCRP_INITIATIVES.filter((init) => {
      const matchEntity = selectedEntity === 'All' || init.entity === selectedEntity;
      const matchPillar = pillar === 'All' || init.pillar === pillar;
      return matchEntity && matchPillar;
    });
    if (matching.length > 0 && !matching.some((i) => i.id === selectedProjectId)) {
      setSelectedProjectId(matching[0].id);
      setSelectedReportingPeriod('All');
    }
  };

  // Handle project selection change
  const handleProjectChange = (projectId: string) => {
    setSelectedProjectId(projectId);
    setSelectedReportingPeriod('All');
  };

  // Active initiative metadata
  // Active initiative metadata
  const activeInitiativeMeta = useMemo(() => {
    return (
      ALL_CCRP_INITIATIVES.find((i) => i.id === selectedProjectId) ||
      ALL_CCRP_INITIATIVES[0]
    );
  }, [selectedProjectId]);

  // Active facility registration data
  const activeRegData = useMemo(() => {
    return (
      facilityRegistrations[selectedProjectId] ||
      INITIAL_FACILITY_REGISTRATIONS[selectedProjectId] ||
      facilityRegistrations['fac-1'] ||
      INITIAL_FACILITY_REGISTRATIONS['fac-1']
    );
  }, [selectedProjectId, facilityRegistrations]);

  // Available reporting periods for the active initiative and FY
  const availableReportingPeriods = useMemo(() => {
    const projectHistorical =
      PROJECT_PERFORMANCE_DATABASE[selectedProjectId] ||
      PROJECT_PERFORMANCE_DATABASE['fac-1'];
    const rawRows = projectHistorical[selectedPeriod] || [];
    return rawRows.map((r) => r.period);
  }, [selectedProjectId, selectedPeriod]);

  // Active report data
  const activeReportData: PerformanceReportData = useMemo(() => {
    const rawData =
      facilityEmissions[selectedProjectId] ||
      INITIAL_FACILITY_EMISSIONS[selectedProjectId] ||
      INITIAL_FACILITY_EMISSIONS['fac-1'];
    return rawData;
  }, [selectedProjectId, facilityEmissions]);

  // Dynamic Sector KPI info
  const activeSectorKpi = useMemo(() => {
    const kpiInfo = getSectorKpiInfo(
      activeRegData?.projectSector || activeInitiativeMeta.sector,
      activeRegData?.sectorKpiName || activeReportData.sectorKpiName,
      activeRegData?.sectorKpiUnit || activeReportData.sectorKpiUnit
    );

    const name = activeRegData?.sectorKpiName || activeReportData.sectorKpiName || kpiInfo.kpiName;
    const unit = activeRegData?.sectorKpiUnit || activeReportData.sectorKpiUnit || kpiInfo.unit;
    const target = activeRegData?.sectorKpiTarget ?? activeReportData.sectorKpiTarget ?? kpiInfo.defaultTarget ?? 0;
    const actual = activeReportData.sectorKpiActual ?? (Number(target) > 0 ? Number((Number(target) * 0.95).toFixed(1)) : 0);
    const achievementPct = activeReportData.sectorKpiAchievement !== undefined
      ? activeReportData.sectorKpiAchievement
      : (Number(target) > 0 ? Number(((Number(actual) / Number(target)) * 100).toFixed(1)) : 0);

    return {
      name,
      unit,
      target,
      actual,
      achievementPct,
      sector: activeRegData?.projectSector || activeInitiativeMeta.sector || 'Energy',
    };
  }, [activeRegData, activeReportData, activeInitiativeMeta]);

  // Derive workflow & review status
  const workflowStatus =
    activeReportData.workflowStatus ||
    (selectedProjectId === 'fac-1'
      ? 'Submitted'
      : selectedProjectId === 'fac-2'
      ? 'Draft'
      : selectedProjectId === 'fac-3'
      ? 'Submitted'
      : selectedProjectId === 'fac-4'
      ? 'Draft'
      : selectedProjectId === 'fac-5'
      ? 'Approved / Published'
      : selectedProjectId === 'fac-6'
      ? 'Returned for Correction'
      : 'Submitted');

  // -------------------------------------------------------------------------
  // 2. UNIFIED DATASET FOR SELECTED INITIATIVE, FINANCIAL YEAR & PERIOD
  // -------------------------------------------------------------------------
  const currentFYData = useMemo(() => {
    const projectHistorical =
      PROJECT_PERFORMANCE_DATABASE[selectedProjectId] ||
      PROJECT_PERFORMANCE_DATABASE['fac-1'];

    const rawRows = projectHistorical[selectedPeriod] || [];

    const filteredRows =
      selectedReportingPeriod === 'All'
        ? rawRows
        : rawRows.filter((r) => r.period === selectedReportingPeriod);

    // Sync live form edits from facilityEmissions for the active record
    return filteredRows.map((r) => {
      let rowKpiTarget = activeSectorKpi.target;
      let rowKpiActual = activeSectorKpi.actual;
      let rowKpiAchievement = activeSectorKpi.achievementPct;

      if (!r.isCurrent) {
        const factor = r.actualProgress > 0 ? r.actualProgress / 100 : 0.8;
        rowKpiActual = typeof rowKpiTarget === 'number' ? Number((rowKpiTarget * factor).toFixed(1)) : rowKpiActual;
        rowKpiAchievement = Number(rowKpiTarget) > 0 ? Number(((Number(rowKpiActual) / Number(rowKpiTarget)) * 100).toFixed(1)) : 100;
      }

      if (r.isCurrent) {
        const livePlanned =
          activeReportData.plannedProgress !== undefined &&
          activeReportData.plannedProgress !== '' &&
          !isNaN(Number(activeReportData.plannedProgress))
            ? Number(activeReportData.plannedProgress)
            : r.plannedProgress;

        const liveActual =
          activeReportData.actualProgress !== undefined &&
          activeReportData.actualProgress !== '' &&
          !isNaN(Number(activeReportData.actualProgress))
            ? Number(activeReportData.actualProgress)
            : r.actualProgress;

        const livePlannedGhg = activeReportData.plannedGhgReduction
          ? String(activeReportData.plannedGhgReduction)
          : r.plannedGhg;
        const liveActualGhg = activeReportData.actualAnnualEmissionReduction
          ? String(activeReportData.actualAnnualEmissionReduction)
          : r.actualGhg;

        return {
          ...r,
          plannedProgress: livePlanned,
          actualProgress: liveActual,
          variance: liveActual - livePlanned,
          status: activeReportData.status || r.status,
          plannedGhg: r.plannedGhg !== '—' ? livePlannedGhg : '—',
          actualGhg: r.actualGhg !== '—' ? liveActualGhg : '—',
          kpiName: activeSectorKpi.name,
          kpiUnit: activeSectorKpi.unit,
          kpiTarget: rowKpiTarget,
          kpiActual: rowKpiActual,
          kpiAchievement: rowKpiAchievement,
        };
      }
      return {
        ...r,
        kpiName: activeSectorKpi.name,
        kpiUnit: activeSectorKpi.unit,
        kpiTarget: rowKpiTarget,
        kpiActual: rowKpiActual,
        kpiAchievement: rowKpiAchievement,
      };
    });
  }, [selectedProjectId, selectedPeriod, selectedReportingPeriod, activeReportData, activeSectorKpi]);

  // Chart data derived strictly from current dataset
  const performanceChartData = useMemo(() => {
    return currentFYData.map((row) => {
      const planned =
        typeof row.plannedProgress === 'number' && !isNaN(row.plannedProgress)
          ? row.plannedProgress
          : Number(row.plannedProgress) || 0;
      const actual =
        typeof row.actualProgress === 'number' && !isNaN(row.actualProgress)
          ? row.actualProgress
          : Number(row.actualProgress) || 0;
      const variance =
        typeof row.variance === 'number' && !isNaN(row.variance)
          ? row.variance
          : actual - planned;

      return {
        period: row.period,
        planned,
        actual,
        variance,
      };
    });
  }, [currentFYData]);

  // -------------------------------------------------------------------------
  // 3. REPORTING COMPLIANCE CALCULATION
  // -------------------------------------------------------------------------
  const complianceStats = useMemo(() => {
    const projectHistorical =
      PROJECT_PERFORMANCE_DATABASE[selectedProjectId] ||
      PROJECT_PERFORMANCE_DATABASE['fac-1'];
    const allFYPeriods = projectHistorical[selectedPeriod] || [];

    const evaluatedPeriods =
      selectedReportingPeriod === 'All'
        ? allFYPeriods
        : allFYPeriods.filter((p) => p.period === selectedReportingPeriod);

    const expected = evaluatedPeriods.length;

    const submitted = evaluatedPeriods.filter((p) => {
      if (p.isCurrent) {
        return (
          (activeReportData.submittedDate !== null &&
            activeReportData.workflowStatus !== 'Draft') ||
          p.status === 'Submitted' ||
          p.status === 'Completed' ||
          p.status === 'Approved'
        );
      }
      return (
        p.status === 'Submitted' ||
        p.status === 'Completed' ||
        p.status === 'Approved' ||
        p.status === 'Returned for Correction'
      );
    }).length;

    const pending = Math.max(0, expected - submitted);
    const complianceRate =
      expected > 0 ? Math.round((submitted / expected) * 100) : 0;

    return {
      expected,
      submitted,
      pending,
      complianceRate,
      cadence: activeInitiativeMeta.cadence,
    };
  }, [
    selectedProjectId,
    selectedPeriod,
    selectedReportingPeriod,
    activeReportData,
    activeInitiativeMeta,
  ]);

  const kpiPerformanceList = useMemo(() => {
    const currentPeriodRow =
      currentFYData.find((r) => r.isCurrent) || currentFYData[0];

    const plannedProg =
      currentPeriodRow?.plannedProgress ?? activeReportData.plannedProgress ?? 75;
    const actualProg =
      currentPeriodRow?.actualProgress ?? activeReportData.actualProgress ?? 68;
    const plannedGhg =
      currentPeriodRow?.plannedGhg !== '—' && currentPeriodRow?.plannedGhg
        ? currentPeriodRow.plannedGhg
        : activeReportData.plannedGhgReduction || '';
    const actualGhg =
      currentPeriodRow?.actualGhg !== '—' && currentPeriodRow?.actualGhg
        ? currentPeriodRow.actualGhg
        : activeReportData.actualAnnualEmissionReduction || '';

    const sectorKpiIndicator = {
      name: `Sector KPI: ${activeSectorKpi.name} (${activeSectorKpi.sector})`,
      target: `${typeof activeSectorKpi.target === 'number' ? activeSectorKpi.target.toLocaleString() : activeSectorKpi.target} ${activeSectorKpi.unit}`,
      actual: `${typeof activeSectorKpi.actual === 'number' ? activeSectorKpi.actual.toLocaleString() : activeSectorKpi.actual} ${activeSectorKpi.unit}`,
      variance: `${activeSectorKpi.achievementPct}% Target Achieved`,
      status: Number(activeSectorKpi.achievementPct) >= 100 ? 'Achieved' : Number(activeSectorKpi.achievementPct) >= 80 ? 'On Track' : 'In Progress',
      statusVariant: (Number(activeSectorKpi.achievementPct) >= 80 ? 'success' : 'info') as 'success' | 'info',
    };

    let otherKpis: any[] = [];
    switch (selectedProjectId) {
      case 'fac-1':
        otherKpis = [
          {
            name: 'Annual GHG Emissions Reduction (Electricity Sector)',
            target: plannedGhg ? `${plannedGhg} tCO₂e` : '142,800 tCO₂e',
            actual: actualGhg ? `${actualGhg} tCO₂e` : '138,500 tCO₂e',
            variance: '-4,300 tCO₂e (-3.0%)',
            status: 'On Track',
            statusVariant: 'success' as const,
          },
          {
            name: 'Project Milestone & Implementation Progress',
            target: `${plannedProg}%`,
            actual: `${actualProg}%`,
            variance: `${actualProg - plannedProg}%`,
            status: actualProg >= plannedProg ? 'On Track' : 'In Progress',
            statusVariant: actualProg >= plannedProg ? ('success' as const) : ('info' as const),
          },
        ];
        break;
      case 'fac-2':
        otherKpis = [
          {
            name: 'Front-End Engineering Design (FEED) Milestone',
            target: `${plannedProg}%`,
            actual: `${actualProg}%`,
            variance: `${actualProg - plannedProg}%`,
            status: 'In Progress',
            statusVariant: 'info' as const,
          },
        ];
        break;
      case 'fac-3':
        otherKpis = [
          {
            name: 'Sector Climate Adaptation Plan Milestones',
            target: `${plannedProg}%`,
            actual: `${actualProg}%`,
            variance: `${actualProg - plannedProg > 0 ? `+${actualProg - plannedProg}%` : `${actualProg - plannedProg}%`}`,
            status: 'On Track',
            statusVariant: 'success' as const,
          },
        ];
        break;
      case 'fac-4':
        otherKpis = [
          {
            name: 'Transport Sector GHG Emissions Reduction',
            target: plannedGhg ? `${plannedGhg} tCO₂e` : '24,000 tCO₂e',
            actual: actualGhg ? `${actualGhg} tCO₂e` : '21,500 tCO₂e',
            variance: '-2,500 tCO₂e (-10.4%)',
            status: 'On Track',
            statusVariant: 'success' as const,
          },
          {
            name: 'Municipal Fleet Electrification & EV Charging Network',
            target: `${plannedProg}%`,
            actual: `${actualProg}%`,
            variance: `${actualProg - plannedProg}%`,
            status: 'In Progress',
            statusVariant: 'info' as const,
          },
        ];
        break;
      case 'fac-5':
        otherKpis = [
          {
            name: 'Waste Sector GHG Emissions Reduction',
            target: plannedGhg ? `${plannedGhg} tCO₂e` : '38,500 tCO₂e',
            actual: actualGhg ? `${actualGhg} tCO₂e` : '41,200 tCO₂e',
            variance: '+2,700 tCO₂e (+7.0%)',
            status: 'Target Exceeded',
            statusVariant: 'success' as const,
          },
          {
            name: 'Anaerobic Digestion Plant Operational Target',
            target: `${plannedProg}%`,
            actual: `${actualProg}%`,
            variance: '0% (Completed)',
            status: 'Completed',
            statusVariant: 'success' as const,
          },
        ];
        break;
      case 'fac-6':
        otherKpis = [
          {
            name: 'Urban Stormwater Drainage Climate Resilience Channel Upgrades',
            target: `${plannedProg}%`,
            actual: `${actualProg}%`,
            variance: `${actualProg - plannedProg}%`,
            status: 'Needs Attention',
            statusVariant: 'warning' as const,
          },
          {
            name: 'Infrastructure Sector Flood Risk Modelling Adaptation Plan',
            target: '100% by 2024',
            actual: '80%',
            variance: '-20%',
            status: 'In Progress',
            statusVariant: 'info' as const,
          },
        ];
        break;
      case 'fac-7':
      default:
        otherKpis = [
          {
            name: 'Agricultural IoT Precision Smart Irrigation Farm Deployment',
            target: `${plannedProg}%`,
            actual: `${actualProg}%`,
            variance: `${actualProg - plannedProg}%`,
            status: 'In Progress',
            statusVariant: 'info' as const,
          },
          {
            name: 'AFOLU Sector Groundwater Conservation Adaptation Plan',
            target: '100% by 2024',
            actual: '75%',
            variance: '-25%',
            status: 'In Progress',
            statusVariant: 'info' as const,
          },
        ];
        break;
    }

    return [sectorKpiIndicator, ...otherKpis];
  }, [selectedProjectId, activeReportData, currentFYData, activeSectorKpi]);

  // -------------------------------------------------------------------------
  // 5. TAB 2: SUBMISSION STATUS OVERVIEW DATA
  // -------------------------------------------------------------------------
  const submissionStatusOverview = [
    { name: 'Approved', count: 18, percentage: 48, color: '#16A34A' },
    { name: 'Under Review', count: 8, percentage: 22, color: '#0284C7' },
    { name: 'Submitted', count: 6, percentage: 16, color: '#38BDF8' },
    { name: 'Returned for Correction', count: 3, percentage: 8, color: '#F97316' },
    { name: 'Draft', count: 2, percentage: 6, color: '#94A3B8' },
  ];

  const pillarCadenceSubmissionsData = [
    { pillar: 'Mitigation', cadence: 'Semiannual', submissions: 14 },
    { pillar: 'Adaptation', cadence: 'Quarterly', submissions: 12 },
    { pillar: 'Econ. Diversification', cadence: 'Semiannual', submissions: 6 },
    { pillar: 'Cross Cutting', cadence: 'Semiannual', submissions: 5 },
  ];

  // -------------------------------------------------------------------------
  // 6. TAB 3: PERIODIC REPORTS ARCHIVE DATA
  // -------------------------------------------------------------------------
  const periodicReportsList = useMemo(() => {
    const rawPeriod =
      activeReportData.progressReportPeriod ||
      (activeInitiativeMeta.cadence === 'Quarterly' ? 'Q1' : 'Semiannual 1 (H1)');
    const currentPeriodDisplay = rawPeriod.includes('2026') ? rawPeriod : `${rawPeriod} 2026`;
    const periodCode = rawPeriod.includes('H2')
      ? 'H2'
      : rawPeriod.includes('H1')
      ? 'H1'
      : rawPeriod.includes('Q')
      ? rawPeriod.replace(/[^A-Za-z0-9]/g, '')
      : rawPeriod.includes('Annual')
      ? 'ANN'
      : (activeInitiativeMeta.cadence === 'Quarterly' ? 'Q1' : 'H1');

    return [
      {
        reportingPeriod: currentPeriodDisplay,
        reportId: `CCRP-REP-2026-${activeInitiativeMeta.initiativeCode.split('-').pop()}-${periodCode}`,
        version: activeReportData.version || 'v1.0',
        progress: `${activeReportData.actualProgress || 68}% (${activeReportData.status || 'In Progress'})`,
        ghgReduction:
          activeInitiativeMeta.pillar === 'Mitigation'
            ? `${activeReportData.actualAnnualEmissionReduction || '138,500'} tCO₂e`
            : activeInitiativeMeta.pillar === 'Cross Cutting'
            ? `${activeReportData.actualAnnualEmissionReduction || '41,200'} tCO₂e`
            : 'N/A (Adaptation)',
        submittedDate: activeReportData.submittedDate || '14-Mar-2026',
        status: workflowStatus === 'Approved / Published' ? 'Approved' : workflowStatus,
        statusVariant:
          workflowStatus === 'Approved'
            ? ('success' as const)
            : workflowStatus === 'Returned for Correction'
            ? ('warning' as const)
            : ('info' as const),
      },
      ...(activeInitiativeMeta.cadence === 'Quarterly'
        ? [
            {
              reportingPeriod: 'Quarter 4 (Q4) 2025',
              reportId: `CCRP-REP-2025-${activeInitiativeMeta.initiativeCode.split('-').pop()}-Q4`,
              version: 'v2.0',
              progress: '100% Milestone Achieved',
              ghgReduction: 'N/A (Adaptation)',
              submittedDate: '20-Dec-2025',
              status: 'Approved',
              statusVariant: 'success' as const,
            },
            {
              reportingPeriod: 'Quarter 3 (Q3) 2025',
              reportId: `CCRP-REP-2025-${activeInitiativeMeta.initiativeCode.split('-').pop()}-Q3`,
              version: 'v1.0',
              progress: '100% Milestone Achieved',
              ghgReduction: 'N/A (Adaptation)',
              submittedDate: '15-Sep-2025',
              status: 'Approved',
              statusVariant: 'success' as const,
            },
          ]
        : [
            {
              reportingPeriod: 'Semiannual 2 (H2) 2025',
              reportId: `CCRP-REP-2025-${activeInitiativeMeta.initiativeCode.split('-').pop()}-H2`,
              version: 'v2.0',
              progress: '100% Milestone Achieved',
              ghgReduction:
                activeInitiativeMeta.pillar === 'Mitigation'
                  ? '140,200 tCO₂e'
                  : activeInitiativeMeta.pillar === 'Cross Cutting'
                  ? '39,000 tCO₂e'
                  : 'N/A (Adaptation)',
              submittedDate: '18-Sep-2025',
              status: 'Approved',
              statusVariant: 'success' as const,
            },
            {
              reportingPeriod: 'Semiannual 1 (H1) 2025',
              reportId: `CCRP-REP-2025-${activeInitiativeMeta.initiativeCode.split('-').pop()}-H1`,
              version: 'v1.0',
              progress: '92% Milestone Achieved',
              ghgReduction:
                activeInitiativeMeta.pillar === 'Mitigation'
                  ? '135,000 tCO₂e'
                  : activeInitiativeMeta.pillar === 'Cross Cutting'
                  ? '36,500 tCO₂e'
                  : 'N/A (Adaptation)',
              submittedDate: '15-Mar-2025',
              status: 'Approved',
              statusVariant: 'success' as const,
            },
          ]),
    ];
  }, [activeInitiativeMeta, activeReportData, workflowStatus]);

  // -------------------------------------------------------------------------
  // 6. TAB 4: STATUTORY AUDIT & REVIEW TRAIL
  // -------------------------------------------------------------------------
  const projectAuditHistory = useMemo(() => {
    return [
      {
        version: '1.0',
        timestamp: '18-Mar-2026, 14:30 GST',
        action: 'EAD Technical Review Underway',
        comments: 'Initiative performance dossier and telemetry verification documentation assigned to EAD Climate Action Directorate reviewer.',
        user: 'Dr. Hamad Al-Dhaheri',
        role: 'EAD Lead Reviewer',
      },
      {
        version: '1.0',
        timestamp: '14-Mar-2026, 10:15 GST',
        action: 'Periodic Progress Report Submitted',
        comments: 'Semiannual 1 (H1) performance report submitted along with technical verification documentation and clean power telemetry data.',
        user: 'Eng. Saeed Al-Mehairbi',
        role: 'Lead Entity Project Manager (DoE)',
      },
      {
        version: '1.0',
        timestamp: '01-Feb-2026, 09:00 GST',
        action: 'Initiative Baseline Registered & Approved',
        comments: 'Strategic initiative classification confirmed under Mitigation Pillar with 2023–2027 climate objectives.',
        user: 'Mariam Al-Qubaisi',
        role: 'EAD Climate Registry Administrator',
      },
    ];
  }, []);

  const handleExport = (reportName: string) => {
    setExportNotice(`Exporting ${reportName} (${activeInitiativeMeta.name})...`);
    setTimeout(() => setExportNotice(null), 3000);
  };

  const getProjectStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60 inline-block min-w-[85px] text-center">
            Completed
          </span>
        );
      case 'In Progress':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-200/60 inline-block min-w-[85px] text-center">
            In Progress
          </span>
        );
      case 'Submitted':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/60 inline-block min-w-[85px] text-center">
            Submitted
          </span>
        );
      case 'Returned for Correction':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200/60 inline-block min-w-[85px] text-center">
            Returned for Correction
          </span>
        );
      case 'On Hold':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200/60 inline-block min-w-[85px] text-center">
            On Hold
          </span>
        );
      case 'Not Started':
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200 inline-block min-w-[85px] text-center">
            {status}
          </span>
        );
    }
  };

  // Custom Tooltip for Planned vs Actual Progress Chart
  const CustomPerformanceTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const plannedVal = payload.find((p: any) => p.dataKey === 'planned')?.value ?? 0;
      const actualVal = payload.find((p: any) => p.dataKey === 'actual')?.value ?? 0;
      const diff = actualVal - plannedVal;

      return (
        <div className="bg-[#0A1628] text-white p-3 rounded-xl shadow-xl border border-slate-700/60 text-left min-w-[170px] pointer-events-none">
          <div className="text-[11.5px] text-slate-300 font-bold border-b border-slate-700/80 pb-1.5 mb-2 flex items-center justify-between">
            <span>{label}</span>
            <span className="text-[10px] text-slate-400 font-normal">Progress</span>
          </div>
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-[#004B87]" /> Planned:
              </span>
              <span className="font-bold text-white">{plannedVal}%</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" /> Actual:
              </span>
              <span className="font-bold text-[#34D399]">{actualVal}%</span>
            </div>
            <div className="flex items-center justify-between gap-4 pt-1.5 border-t border-slate-700/60 text-[11px]">
              <span className="text-slate-400 font-medium">Variance:</span>
              <span className={`font-extrabold ${diff >= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {diff > 0 ? `+${diff}%` : `${diff}%`}
              </span>
            </div>
          </div>
          <div className="w-2 h-2 bg-[#0A1628] rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2 border-r border-b border-slate-700/60" />
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-full flex flex-col overflow-hidden font-sans">
      {/* ------------------------------------------------------------------------- */}
      {/* 1. TOP HEADER ROW (Title on Left, Filters & Export CTA on Right)           */}
      {/* ------------------------------------------------------------------------- */}
      <div className="flex-shrink-0 pt-0.5 pb-[18px] flex flex-wrap items-center justify-between gap-3">
        {/* Left: View Title & Subtitle */}
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-[18px] font-bold font-display text-[#336D9F] tracking-tight">
              Climate Change Reports & Analytics
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Comprehensive Initiative Performance Summaries, Progress Tracking & Periodic Verification Dossiers
            </p>
          </div>
          {exportNotice && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 text-xs font-bold animate-fade-in">
              <Check className="w-3.5 h-3.5" />
              <span>{exportNotice}</span>
            </div>
          )}
        </div>

        {/* Right: Filters (Entity, Pillar, Project, FY, Reporting Period) & Export CTA Button */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Entity Filter */}
          <div className="relative">
            <select
              value={selectedEntity}
              onChange={(e) => handleEntityChange(e.target.value)}
              className="h-9 px-3 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 shadow-xs focus:outline-none focus:border-[#004B87] cursor-pointer max-w-[180px] truncate"
              title="Filter by Lead Entity"
            >
              <option value="All">All Entities</option>
              {allEntities.map((ent) => (
                <option key={ent} value={ent}>
                  {ent}
                </option>
              ))}
            </select>
          </div>

          {/* Pillar Filter */}
          <div className="relative">
            <select
              value={selectedPillar}
              onChange={(e) => handlePillarChange(e.target.value)}
              className="h-9 px-3 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 shadow-xs focus:outline-none focus:border-[#004B87] cursor-pointer max-w-[150px] truncate"
              title="Filter by Strategic Pillar"
            >
              <option value="All">All Pillars</option>
              {allPillars.map((pil) => (
                <option key={pil} value={pil}>
                  {pil}
                </option>
              ))}
            </select>
          </div>

          {/* Project / Initiative Dropdown */}
          <div className="relative">
            <select
              value={selectedProjectId}
              onChange={(e) => handleProjectChange(e.target.value)}
              className="h-9 pl-3 pr-7 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 shadow-xs focus:outline-none focus:border-[#004B87] cursor-pointer max-w-[230px] truncate"
              title="Select Project / Initiative"
            >
              {filteredInitiatives.map((init) => (
                <option key={init.id} value={init.id}>
                  {init.name} ({init.initiativeCode})
                </option>
              ))}
            </select>
          </div>

          {/* Financial Year Dropdown */}
          <div className="relative">
            <div className="h-9 flex items-center bg-white border border-slate-200 rounded-xl shadow-xs px-2.5">
              <Calendar className="w-3.5 h-3.5 text-[#004B87] mr-1.5 shrink-0" />
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer h-full pr-1"
                title="Select Financial Year"
              >
                <option value="FY 2026–27">FY 2026–27</option>
                <option value="FY 2025–26">FY 2025–26</option>
                <option value="FY 2024–25">FY 2024–25</option>
                <option value="FY 2023–24">FY 2023–24</option>
              </select>
            </div>
          </div>

          {/* Reporting Period Filter */}
          <div className="relative">
            <select
              value={selectedReportingPeriod}
              onChange={(e) => setSelectedReportingPeriod(e.target.value)}
              className="h-9 px-3 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 shadow-xs focus:outline-none focus:border-[#004B87] cursor-pointer max-w-[130px] truncate"
              title="Filter by Reporting Period"
            >
              <option value="All">All Periods</option>
              {availableReportingPeriods.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Export Button */}
          <button
            onClick={() => handleExport(activeTab === 'performance-summary' ? 'Performance Summary' : 'Submission Status')}
            className="h-9 px-3.5 bg-gradient-to-r from-[#004B87] to-[#006BB8] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#004B87]/25 hover:shadow-lg hover:from-[#003d6e] hover:to-[#005c9e] transition-all cursor-pointer active:scale-95 shrink-0 whitespace-nowrap"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------------------- */}
      {/* 2. MAIN WHITE CARD CONTAINER (Tabs inside the white card header)           */}
      {/* ------------------------------------------------------------------------- */}
      <div className="flex-1 min-h-0 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-3.5 sm:p-4 flex flex-col overflow-hidden">
        {/* Navigation Sub-Tabs (Sticky Bar inside Card Header) */}
        <div className="flex-shrink-0 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar pb-2.5">
          <div className="inline-flex items-center gap-1 p-1 bg-white border border-slate-200 rounded-[6px] shadow-2xs">
            {[
              { id: 'performance-summary', label: 'Performance & Progress Report', icon: BarChart3 },
              { id: 'submission-status', label: 'Report Submission Status', icon: Layers },
              { id: 'history', label: 'Periodic Reports Archive', icon: History },
              { id: 'version', label: 'Review & Audit History', icon: FileText },
            ].map((tab) => {
              const IconComponent = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-[6px] text-xs transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-gradient-to-r from-[#004B87] to-[#006BB8] text-white font-bold shadow-xs'
                      : 'text-slate-600 hover:text-[#336D9F] hover:bg-white/60 font-semibold'
                  }`}
                >
                  <IconComponent className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Scrollable Card Body */}
        <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar space-y-[18px] pr-1">
          {/* ======================================================================= */}
          {/* TAB 1: PERFORMANCE & PROGRESS REPORT (CLEAN & STREAMLINED)              */}
          {/* ======================================================================= */}
          {activeTab === 'performance-summary' && (
            <div className="space-y-[18px] animate-fade-in">
              {/* 1. TOP CARD: PERFORMANCE & PROGRESS CHART (Planned vs Actual) */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-3.5 sm:p-4 space-y-2.5">
                {/* Header Row: Title on Left, Legends on Right */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-2">
                  <h2 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-[#004B87]" />
                    <span>Performance & Progress Chart</span>
                  </h2>

                  {/* Legends placed in the chart header row on the right side */}
                  <div className="flex items-center gap-5 text-xs">
                    <div className="flex items-center gap-2 text-slate-700 font-semibold">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#004B87] shrink-0" />
                      <span>Planned Progress (%)</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700 font-semibold">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] shrink-0" />
                      <span>Actual Progress (%)</span>
                    </div>
                  </div>
                </div>

                {/* Chart Area */}
                {performanceChartData.length > 0 ? (
                  <div className="h-52 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart
                        data={performanceChartData}
                        margin={{ top: 12, right: 24, left: 6, bottom: 6 }}
                      >
                        <defs>
                          <linearGradient id="actualProgressGreenGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10B981" stopOpacity={0.20} />
                            <stop offset="100%" stopColor="#10B981" stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid vertical={true} horizontal={true} stroke="#f1f5f9" strokeDasharray="3 3" />
                        <XAxis
                          dataKey="period"
                          axisLine={{ stroke: '#e2e8f0' }}
                          tickLine={false}
                          tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }}
                          dy={6}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 11, fill: '#64748b', fontWeight: 500 }}
                          domain={[0, 100]}
                          ticks={[0, 20, 40, 60, 80, 100]}
                          tickFormatter={(val) => `${val}%`}
                          label={{
                            value: 'Progress ( % )',
                            angle: -90,
                            position: 'insideLeft',
                            style: { textAnchor: 'middle', fill: '#64748b', fontSize: 11, fontWeight: 600 },
                            dx: -2,
                          }}
                        />
                        <Tooltip content={<CustomPerformanceTooltip />} />
                        {/* Actual Progress Area Fill & Solid Line */}
                        <Area
                          type="monotone"
                          dataKey="actual"
                          name="Actual Progress (%)"
                          stroke="#10B981"
                          strokeWidth={2.5}
                          fill="url(#actualProgressGreenGrad)"
                          dot={{ r: 5, fill: '#10B981', stroke: '#ffffff', strokeWidth: 2 }}
                          activeDot={{ r: 7, fill: '#065F46', stroke: '#ffffff', strokeWidth: 2 }}
                        />
                        {/* Planned Progress Series (Navy dashed line with circle dots) */}
                        <Line
                          type="monotone"
                          dataKey="planned"
                          name="Planned Progress (%)"
                          stroke="#004B87"
                          strokeWidth={2.5}
                          strokeDasharray="5 5"
                          dot={{ r: 5, fill: '#004B87', stroke: '#ffffff', strokeWidth: 2 }}
                          activeDot={{ r: 7, fill: '#003d6e', stroke: '#ffffff', strokeWidth: 2 }}
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-44 w-full flex flex-col items-center justify-center text-center p-5 bg-slate-50/60 rounded-xl border border-dashed border-slate-200">
                    <BarChart3 className="w-7 h-7 text-slate-300 mb-1.5" />
                    <p className="text-xs font-bold text-slate-700">No Report Data Available</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      No statutory periodic performance records exist for {selectedPeriod} {selectedReportingPeriod !== 'All' ? `(${selectedReportingPeriod})` : ''} for this initiative.
                    </p>
                  </div>
                )}
              </div>

              {/* 2. PERFORMANCE DETAILS TABLE */}
              <div className="overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse min-w-[1050px]">
                    <thead className="sticky top-0 z-10 bg-[#D6E3EF] shadow-xs select-none">
                      <tr className="h-[38px] bg-[#D6E3EF] text-slate-800 font-bold text-xs border-b border-[#5B88B0]/30">
                        <th className="h-[38px] px-3.5 align-middle bg-[#D6E3EF] font-bold text-slate-800 min-w-[190px]">Initiative / Project</th>
                        <th className="h-[38px] px-3.5 align-middle bg-[#D6E3EF] font-bold text-slate-800 min-w-[130px]">Entity</th>
                        <th className="h-[38px] px-3.5 align-middle bg-[#D6E3EF] font-bold text-slate-800 min-w-[100px]">Pillar</th>
                        <th className="h-[38px] px-3.5 align-middle bg-[#D6E3EF] font-bold text-slate-800 min-w-[120px]">Reporting Period</th>
                        <th className="h-[38px] px-3.5 text-center align-middle bg-[#D6E3EF] font-bold text-slate-800">Planned Progress (%)</th>
                        <th className="h-[38px] px-3.5 text-center align-middle bg-[#D6E3EF] font-bold text-slate-800">Actual Progress (%)</th>
                        <th className="h-[38px] px-3.5 text-center align-middle bg-[#D6E3EF] font-bold text-slate-800">Variance (%)</th>
                        <th className="h-[38px] px-3.5 text-center align-middle bg-[#D6E3EF] font-bold text-slate-800">Project Status</th>
                        <th className="h-[38px] px-3.5 text-center align-middle bg-[#D6E3EF] font-bold text-slate-800">KPI Target</th>
                        <th className="h-[38px] px-3.5 text-center align-middle bg-[#D6E3EF] font-bold text-slate-800">KPI Actual</th>
                        <th className="h-[38px] px-3.5 text-center align-middle bg-[#D6E3EF] font-bold text-slate-800">Achievement %</th>
                        <th className="h-[38px] px-3.5 text-center align-middle bg-[#D6E3EF] font-bold text-slate-800">Planned GHG (tCO₂e)</th>
                        <th className="h-[38px] px-3.5 text-center align-middle bg-[#D6E3EF] font-bold text-slate-800">Actual GHG (tCO₂e)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-normal text-slate-700">
                      {currentFYData.length > 0 ? (
                        currentFYData.map((row, idx) => (
                          <tr
                            key={row.period}
                            className={`h-[48px] ${
                              idx % 2 === 1 ? 'bg-slate-50/80' : 'bg-white'
                            } hover:bg-[#EBF3FA] transition-colors`}
                          >
                            <td className="h-[48px] px-3.5 align-middle text-slate-800 font-semibold max-w-[210px]">
                              <span className="block truncate font-bold text-slate-800" title={activeInitiativeMeta.name}>
                                {activeInitiativeMeta.name}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono block">
                                {activeInitiativeMeta.initiativeCode}
                              </span>
                            </td>
                            <td className="h-[48px] px-3.5 align-middle text-slate-600 text-[11px] max-w-[140px]">
                              <span className="truncate block" title={activeInitiativeMeta.entity}>
                                {activeInitiativeMeta.entity}
                              </span>
                            </td>
                            <td className="h-[48px] px-3.5 align-middle">
                              <span className="px-2 py-0.5 rounded-md text-[10.5px] font-semibold bg-sky-50 text-[#004B87] border border-sky-100 whitespace-nowrap">
                                {activeInitiativeMeta.pillar}
                              </span>
                            </td>
                            <td className="h-[48px] px-3.5 align-middle text-slate-800 font-semibold whitespace-nowrap">
                              <div className="flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-[#004B87] shrink-0" />
                                <span>{row.period}</span>
                                {row.isCurrent && (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EBF3FA] text-[#004B87] border border-[#004B87]/20">
                                    Current
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="h-[48px] px-3.5 text-center align-middle font-semibold text-slate-700">
                              {row.plannedProgress}%
                            </td>
                            <td className="h-[48px] px-3.5 text-center align-middle font-bold text-[#004B87]">
                              {row.actualProgress}%
                            </td>
                            <td className="h-[48px] px-3.5 text-center align-middle">
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold inline-block min-w-[54px] text-center ${
                                  row.variance === 0
                                    ? 'bg-slate-100 text-slate-700 border border-slate-200'
                                    : row.variance > 0
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                                    : 'bg-amber-50 text-amber-700 border border-amber-200/60'
                                }`}
                              >
                                {row.variance > 0 ? `+${row.variance}%` : `${row.variance}%`}
                              </span>
                            </td>
                            <td className="h-[48px] px-3.5 text-center align-middle">
                              {getProjectStatusBadge(row.status)}
                            </td>
                            <td className="h-[48px] px-3.5 text-center align-middle font-mono font-medium text-slate-800 whitespace-nowrap">
                              <span title={`Sector KPI: ${row.kpiName}`}>
                                {typeof row.kpiTarget === 'number' ? row.kpiTarget.toLocaleString() : row.kpiTarget} {row.kpiUnit}
                              </span>
                            </td>
                            <td className="h-[48px] px-3.5 text-center align-middle font-mono font-bold text-[#004B87] whitespace-nowrap">
                              <span title={`Sector KPI: ${row.kpiName}`}>
                                {typeof row.kpiActual === 'number' ? row.kpiActual.toLocaleString() : row.kpiActual} {row.kpiUnit}
                              </span>
                            </td>
                            <td className="h-[48px] px-3.5 text-center align-middle">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[11px] font-bold inline-block min-w-[50px] text-center ${
                                  Number(row.kpiAchievement) >= 100
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                                    : Number(row.kpiAchievement) >= 80
                                    ? 'bg-sky-50 text-[#004B87] border border-sky-200/60'
                                    : 'bg-amber-50 text-amber-700 border border-amber-200/60'
                                }`}
                              >
                                {row.kpiAchievement}%
                              </span>
                            </td>
                            <td className="h-[48px] px-3.5 text-center align-middle font-mono font-medium text-slate-800">
                              {row.plannedGhg !== '—' ? `${row.plannedGhg}` : '—'}
                            </td>
                            <td className="h-[48px] px-3.5 text-center align-middle font-mono font-bold text-emerald-700">
                              {row.actualGhg !== '—' ? `${row.actualGhg}` : '—'}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={13} className="h-32 text-center text-slate-400 font-medium text-xs align-middle">
                            No performance reporting records found for {selectedPeriod} {selectedReportingPeriod !== 'All' ? `(${selectedReportingPeriod})` : ''}.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>


              {/* 3. REPORTING COMPLIANCE SECTION */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-3.5 sm:p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#004B87]" />
                    <h3 className="text-sm font-bold text-slate-900 tracking-tight">Reporting Compliance</h3>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <span>Reporting Cadence:</span>
                    <span className="font-bold text-[#004B87] bg-sky-50 px-2 py-0.5 rounded-md border border-sky-100">
                      {complianceStats.cadence}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span>Reporting Scope:</span>
                    <span className="font-semibold text-slate-700">
                      {selectedReportingPeriod === 'All' ? selectedPeriod : `${selectedReportingPeriod} (${selectedPeriod})`}
                    </span>
                  </div>
                </div>

                {/* Metric Cards Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {/* Expected */}
                  <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 mb-1">
                      <span>Reports Expected</span>
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xl font-bold font-display text-slate-900">
                        {complianceStats.expected}
                      </span>
                      <span className="text-[10.5px] text-slate-500 font-medium">reports</span>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Based on {complianceStats.cadence.toLowerCase()} cadence
                    </span>
                  </div>

                  {/* Submitted */}
                  <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-3 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-emerald-800 mb-1">
                      <span>Reports Submitted</span>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xl font-bold font-display text-emerald-700">
                        {complianceStats.submitted}
                      </span>
                      <span className="text-[10.5px] text-emerald-600 font-medium">/ {complianceStats.expected} lodged</span>
                    </div>
                    <span className="text-[10px] text-emerald-600/80 mt-1 block">
                      Submissions on official record
                    </span>
                  </div>

                  {/* Pending */}
                  <div className="bg-amber-50/40 border border-amber-100 rounded-xl p-3 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-amber-800 mb-1">
                      <span>Reports Pending</span>
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xl font-bold font-display text-amber-700">
                        {complianceStats.pending}
                      </span>
                      <span className="text-[10.5px] text-amber-600 font-medium">awaiting</span>
                    </div>
                    <span className="text-[10px] text-amber-600/80 mt-1 block">
                      {complianceStats.pending === 0 ? 'No overdue statutory reports' : 'Pending submission review'}
                    </span>
                  </div>

                  {/* Compliance Rate */}
                  <div className="bg-[#EBF3FA]/70 border border-[#004B87]/20 rounded-xl p-3 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-[#004B87] mb-1">
                      <span>Compliance Rate</span>
                      <TrendingUp className="w-3.5 h-3.5 text-[#004B87]" />
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <span className={`text-xl font-bold font-display ${
                        complianceStats.complianceRate >= 100
                          ? 'text-emerald-700'
                          : complianceStats.complianceRate >= 50
                          ? 'text-[#004B87]'
                          : 'text-amber-700'
                      }`}>
                        {complianceStats.complianceRate}%
                      </span>
                      <span className="text-[10.5px] text-slate-500 font-medium">timeliness</span>
                    </div>
                    <div className="w-full bg-slate-200/80 rounded-full h-1.5 mt-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          complianceStats.complianceRate >= 100
                            ? 'bg-emerald-600'
                            : complianceStats.complianceRate >= 50
                            ? 'bg-[#004B87]'
                            : 'bg-amber-500'
                        }`}
                        style={{ width: `${Math.min(100, complianceStats.complianceRate)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. KPI PERFORMANCE SECTION */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-3.5 sm:p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-[#004B87]" />
                    <h3 className="text-sm font-bold text-slate-900 tracking-tight">KPI Performance</h3>
                  </div>
                </div>

                {/* KPI Table */}
                <div className="overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-2xs">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="sticky top-0 z-10 bg-[#D6E3EF] shadow-xs select-none">
                      <tr className="h-[38px] bg-[#D6E3EF] text-slate-800 font-bold text-xs border-b border-[#5B88B0]/30">
                        <th className="h-[38px] px-3.5 align-middle bg-[#D6E3EF]">KPI / Indicator Name</th>
                        <th className="h-[38px] px-3.5 text-center align-middle bg-[#D6E3EF]">Target</th>
                        <th className="h-[38px] px-3.5 text-center align-middle bg-[#D6E3EF]">Actual</th>
                        <th className="h-[38px] px-3.5 text-center align-middle bg-[#D6E3EF]">Achievement / Variance</th>
                        <th className="h-[38px] px-3.5 text-center align-middle bg-[#D6E3EF]">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-normal text-slate-700">
                      {kpiPerformanceList.length > 0 ? (
                        kpiPerformanceList.map((kpi, idx) => (
                          <tr
                            key={idx}
                            className={`h-[46px] ${
                              idx % 2 === 1 ? 'bg-slate-50/80' : 'bg-white'
                            } hover:bg-[#EBF3FA] transition-colors`}
                          >
                            <td className="h-[46px] px-3.5 align-middle text-slate-800 font-medium">
                              <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#004B87] shrink-0" />
                                <span>{kpi.name}</span>
                              </div>
                            </td>
                            <td className="h-[46px] px-3.5 text-center align-middle font-mono font-semibold text-slate-700">
                              {kpi.target}
                            </td>
                            <td className="h-[46px] px-3.5 text-center align-middle font-mono font-bold text-[#004B87]">
                              {kpi.actual}
                            </td>
                            <td className="h-[46px] px-3.5 text-center align-middle font-medium">
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold inline-block min-w-[70px] text-center ${
                                  kpi.variance.includes('+') || kpi.variance.includes('100%') || kpi.variance.includes('Met')
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                                    : kpi.variance.includes('-')
                                    ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                                    : 'bg-slate-100 text-slate-700 border border-slate-200'
                                }`}
                              >
                                {kpi.variance}
                              </span>
                            </td>
                            <td className="h-[46px] px-3.5 text-center align-middle">
                              <Badge variant={kpi.statusVariant} size="sm">
                                {kpi.status}
                              </Badge>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="h-24 text-center text-slate-400 font-medium text-xs align-middle">
                            No specific indicators configured for this initiative.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================================= */}
          {/* TAB 2: REPORT SUBMISSION STATUS (OVERVIEW CHARTS & SUBMISSION TABLE)    */}
          {/* ======================================================================= */}
          {activeTab === 'submission-status' && (
            <div className="space-y-[18px] animate-fade-in">
              {/* Top 2 Cards: Donut Chart & Pillar Submissions Bar Chart */}
              {/* Top 2 Cards: Donut Chart & Pillar Submissions Bar Chart (Height fixed at 280px) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:h-[280px]">
                {/* Left Card: Submission Status Overview */}
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-4.5 flex flex-col justify-between h-full">
                  {/* 1. Title Row */}
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                      Report Submission Status Overview
                    </h2>
                  </div>

                  {/* 2. Chart & Legend Row (Equal Gap Above and Below) */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-0.5">
                    {/* Donut Chart with Center Label */}
                    <div className="relative w-36 h-36 shrink-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={submissionStatusOverview}
                            innerRadius={42}
                            outerRadius={65}
                            paddingAngle={3}
                            dataKey="count"
                            stroke="none"
                          >
                            {submissionStatusOverview.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                        <span className="text-xl font-extrabold text-slate-900">37</span>
                        <span className="text-[9.5px] font-semibold text-slate-500 leading-tight">
                          Total<br />Reports
                        </span>
                      </div>
                    </div>

                    {/* Legend List */}
                    <div className="space-y-1.5 flex-1 w-full text-[11px]">
                      {submissionStatusOverview.map((item) => (
                        <div key={item.name} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-2.5 h-2.5 rounded-full shrink-0"
                              style={{ backgroundColor: item.color }}
                            />
                            <span className="font-semibold text-slate-700">{item.name}</span>
                          </div>
                          <div className="font-semibold text-slate-800 text-right">
                            {item.count} <span className="text-slate-500 font-normal">({item.percentage}%)</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 3. Bottom Row */}
                  <div className="pt-2.5 border-t border-slate-100 text-[11px] font-semibold text-slate-600 flex justify-between">
                    <span>Total Registered Submissions: 37</span>
                    <span className="text-[#004B87] font-bold">Reporting Year: 2026</span>
                  </div>
                </div>

                {/* Right Card: Reporting Cadence & Pillar Submissions */}
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-4.5 flex flex-col justify-between h-full">
                  {/* 1. Title Row */}
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                      Submissions by Strategic Pillar & Cadence
                    </h2>
                  </div>

                  {/* 2. Chart Row (Equal Gap Above and Below) */}
                  <div className="h-[148px] w-full flex items-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={pillarCadenceSubmissionsData}
                        margin={{ top: 6, right: 15, left: -20, bottom: 2 }}
                      >
                        <CartesianGrid vertical={false} stroke="#f1f5f9" strokeDasharray="3 3" />
                        <XAxis
                          dataKey="pillar"
                          axisLine={{ stroke: '#e2e8f0' }}
                          tickLine={false}
                          tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }}
                          dy={2}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 10.5, fill: '#64748b', fontWeight: 500 }}
                          domain={[0, 16]}
                          ticks={[0, 4, 8, 12, 16]}
                          label={{
                            value: 'Submissions',
                            angle: -90,
                            position: 'insideLeft',
                            style: { textAnchor: 'middle', fill: '#64748b', fontSize: 10.5, fontWeight: 500 },
                            dx: 6,
                          }}
                        />
                        <Tooltip
                          contentStyle={{ borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                        />
                        <Bar
                          dataKey="submissions"
                          fill="#004B87"
                          radius={[4, 4, 0, 0]}
                          barSize={32}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* 3. Bottom Row */}
                  <div className="pt-2.5 border-t border-slate-100 text-[11px] font-semibold text-slate-500 flex justify-between">
                    <span>Abu Dhabi Climate Change Strategy (2023–2027)</span>
                    <span className="text-emerald-700 font-bold">100% On Cadence</span>
                  </div>
                </div>
              </div>

              {/* Bottom Table Card: Submissions Management & Tracking */}
              <SubmissionListingTable
                title="Initiatives & Periodic Report Submissions"
                subtitle="Real-time Climate Change project reports, review decisions, versions, and compliance status"
              />
            </div>
          )}

          {/* ======================================================================= */}
          {/* TAB 3: PERIODIC REPORTS ARCHIVE / SUBMISSION HISTORY                   */}
          {/* ======================================================================= */}
          {activeTab === 'history' && (
            <div className="space-y-[18px] animate-fade-in">
              <div className="overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="h-[38px] bg-[#D6E3EF] text-slate-800 font-bold text-xs border-b border-[#5B88B0]/30 sticky top-0 z-10 shadow-xs">
                        <th className="h-[38px] px-3.5 align-middle bg-[#D6E3EF]">Reporting Period</th>
                        <th className="h-[38px] px-3.5 align-middle bg-[#D6E3EF]">Report ID</th>
                        <th className="h-[38px] px-3.5 align-middle bg-[#D6E3EF]">Version</th>
                        <th className="h-[38px] px-3.5 align-middle bg-[#D6E3EF]">Milestone Progress</th>
                        <th className="h-[38px] px-3.5 align-middle bg-[#D6E3EF]">GHG Reduction</th>
                        <th className="h-[38px] px-3.5 align-middle bg-[#D6E3EF]">Submitted Date</th>
                        <th className="h-[38px] px-3.5 align-middle bg-[#D6E3EF]">Status</th>
                        <th className="h-[38px] px-4 text-center align-middle bg-[#D6E3EF]">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-normal text-slate-700">
                      {periodicReportsList.map((row, idx) => (
                        <tr key={idx} className={`h-[48px] ${idx % 2 === 1 ? 'bg-slate-50/80' : 'bg-white'} hover:bg-[#EBF3FA] transition-colors`}>
                          <td className="h-[48px] px-3.5 font-medium text-slate-800 text-xs align-middle">{row.reportingPeriod}</td>
                          <td className="h-[48px] px-3.5 font-mono text-xs text-slate-700 align-middle">{row.reportId}</td>
                          <td className="h-[48px] px-3.5 font-mono font-medium text-xs text-slate-600 align-middle">{row.version}</td>
                          <td className="h-[48px] px-3.5 font-medium text-xs text-slate-800 align-middle">{row.progress}</td>
                          <td className="h-[48px] px-3.5 font-bold text-xs text-emerald-700 align-middle">{row.ghgReduction}</td>
                          <td className="h-[48px] px-3.5 text-slate-500 font-normal text-xs align-middle">{row.submittedDate}</td>
                          <td className="h-[48px] px-3.5 align-middle">
                            <Badge variant={row.statusVariant} size="sm">
                              {row.status}
                            </Badge>
                          </td>
                          <td className="h-[48px] px-4 text-center align-middle">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => openReadOnlyViewer({
                                  moduleType: 'full-dossier',
                                  recordId: row.reportId,
                                  title: `${activeInitiativeMeta.name} — ${row.reportingPeriod}`,
                                  status: row.status,
                                  reportingYear: 2026,
                                  version: row.version.includes('2') ? 2 : 1,
                                })}
                                title="View Full Periodic Report Dossier"
                                className="p-1.5 rounded-lg bg-[#004B87]/10 hover:bg-[#004B87]/20 text-[#004B87] font-bold cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleExport(row.reportId)}
                                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
                                title="Download Report"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================================= */}
          {/* TAB 4: REVIEW & STATUTORY AUDIT HISTORY                                */}
          {/* ======================================================================= */}
          {activeTab === 'version' && (
            <div className="space-y-3.5 animate-fade-in">
              {projectAuditHistory.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-slate-200/90 bg-white shadow-2xs flex flex-col justify-between gap-3 hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <h3 className="text-xs sm:text-[13px] font-bold text-slate-900 tracking-tight">
                        {item.action}
                      </h3>
                      <p className="text-xs text-slate-600 font-normal leading-relaxed">
                        {item.comments}
                      </p>
                    </div>

                    <button
                      onClick={() => openReadOnlyViewer({
                        moduleType: 'full-dossier',
                        recordId: activeInitiativeMeta.initiativeCode,
                        version: 1,
                        initialTab: 'comparison',
                      })}
                      className="p-1.5 rounded-lg bg-[#004B87]/10 hover:bg-[#004B87]/20 text-[#004B87] transition-colors cursor-pointer shrink-0"
                      title="View Audit Record"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Bottom Row: Author / Authority on Left, Date / Timestamp on Right */}
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                    <div className="text-slate-500 font-medium">
                      Author / Authority: <strong className="text-slate-700">{item.user}</strong> ({item.role})
                    </div>
                    <div className="text-slate-400 font-medium">
                      {item.timestamp}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default MRVReportsView;
