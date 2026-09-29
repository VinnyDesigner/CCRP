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
} from '../data/facilityEmissionsData';

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
};

export const MRVReportsView: React.FC = () => {
  const { openReadOnlyViewer, facilityEmissions } = useMRV();

  // Active Tab State: 'performance-summary' | 'submission-status' | 'history' | 'version'
  const [activeTab, setActiveTab] = useState<'performance-summary' | 'submission-status' | 'history' | 'version'>('performance-summary');

  // Shared Filter States - Controlled by top FY selector
  const [selectedProjectId, setSelectedProjectId] = useState<string>('fac-1');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('FY 2026–27');
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // -------------------------------------------------------------------------
  // 1. ACTIVE PROJECT METADATA & DATA EXTRACTION
  // -------------------------------------------------------------------------
  const activeInitiativeMeta = useMemo(() => {
    return (
      CCRP_APPROVED_INITIATIVES.find((i) => i.id === selectedProjectId) ||
      CCRP_APPROVED_INITIATIVES[0]
    );
  }, [selectedProjectId]);

  const activeReportData: PerformanceReportData = useMemo(() => {
    const rawData =
      facilityEmissions[selectedProjectId] ||
      INITIAL_FACILITY_EMISSIONS[selectedProjectId] ||
      INITIAL_FACILITY_EMISSIONS['fac-1'];
    return rawData;
  }, [selectedProjectId, facilityEmissions]);

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
  // 2. UNIFIED DATASET FOR SELECTED INITIATIVE & FINANCIAL YEAR
  // -------------------------------------------------------------------------
  const currentFYData = useMemo(() => {
    const projectHistorical =
      PROJECT_PERFORMANCE_DATABASE[selectedProjectId] ||
      PROJECT_PERFORMANCE_DATABASE['fac-1'];

    const rawRows = projectHistorical[selectedPeriod] || [];

    // Sync live form edits from facilityEmissions for the active record
    return rawRows.map((r) => {
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
        };
      }
      return r;
    });
  }, [selectedProjectId, selectedPeriod, activeReportData]);

  // Chart data strictly derived from the exact same dataset
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
  // 3. TAB 2: SUBMISSION STATUS OVERVIEW DATA
  // -------------------------------------------------------------------------
  const submissionStatusOverview = [
    { name: 'Approved / Published', count: 18, percentage: 48, color: '#16A34A' },
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
  // 4. TAB 3: PERIODIC REPORTS ARCHIVE DATA
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
        status: workflowStatus,
        statusVariant:
          workflowStatus === 'Approved / Published' || workflowStatus === 'Approved'
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
              status: 'Approved / Published',
              statusVariant: 'success' as const,
            },
            {
              reportingPeriod: 'Quarter 3 (Q3) 2025',
              reportId: `CCRP-REP-2025-${activeInitiativeMeta.initiativeCode.split('-').pop()}-Q3`,
              version: 'v1.0',
              progress: '100% Milestone Achieved',
              ghgReduction: 'N/A (Adaptation)',
              submittedDate: '15-Sep-2025',
              status: 'Approved / Published',
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
              status: 'Approved / Published',
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
              status: 'Approved / Published',
              statusVariant: 'success' as const,
            },
          ]),
    ];
  }, [activeInitiativeMeta, activeReportData, workflowStatus]);

  // -------------------------------------------------------------------------
  // 5. TAB 4: STATUTORY AUDIT & REVIEW TRAIL
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
      {/* 1. TOP HEADER ROW (Title on Left, Project Selector & FY Selector on Right) */}
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

        {/* Right: Project Selector, FY Dropdown & Export CTA Button */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Project / Initiative Dropdown */}
          <div className="relative">
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="h-9 pl-3.5 pr-8 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 shadow-xs focus:outline-none focus:border-[#004B87] cursor-pointer max-w-[280px] truncate"
              title="Select Project / Initiative"
            >
              {CCRP_APPROVED_INITIATIVES.map((init) => (
                <option key={init.id} value={init.id}>
                  {init.name} ({init.initiativeCode})
                </option>
              ))}
            </select>
          </div>

          {/* Financial Year Dropdown (Controls Chart & Table) */}
          <div className="relative">
            <div className="h-9 flex items-center bg-white border border-slate-200 rounded-xl shadow-xs px-3">
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

          {/* Export Button */}
          <button
            onClick={() => handleExport(activeTab === 'performance-summary' ? 'Performance Summary' : 'Submission Status')}
            className="h-9 px-4 bg-gradient-to-r from-[#004B87] to-[#006BB8] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#004B87]/25 hover:shadow-lg hover:from-[#003d6e] hover:to-[#005c9e] transition-all cursor-pointer active:scale-95 shrink-0 whitespace-nowrap"
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

          {/* Project & FY Indicator Pill in Tab Bar */}
          <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span className="text-[11px]">Selected:</span>
            <span className="font-bold text-[#004B87] bg-[#EBF3FA] px-2.5 py-0.5 rounded-full border border-[#004B87]/20 truncate max-w-[220px]">
              {activeInitiativeMeta.name}
            </span>
            <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200 text-[11px]">
              {selectedPeriod}
            </span>
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
                      No statutory periodic performance records exist for {selectedPeriod} for this initiative.
                    </p>
                  </div>
                )}
              </div>

              {/* 2. BOTTOM CARD: PERFORMANCE DETAILS TABLE (Styled identical to Overview Table) */}
              <div className="overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-2xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="sticky top-0 z-10 bg-[#D6E3EF] shadow-xs select-none">
                    <tr className="h-[38px] bg-[#D6E3EF] text-slate-800 font-bold text-xs border-b border-[#5B88B0]/30">
                      <th className="h-[38px] px-3.5 align-middle bg-[#D6E3EF] font-bold text-slate-800">Reporting Period</th>
                      <th className="h-[38px] px-3.5 text-center align-middle bg-[#D6E3EF] font-bold text-slate-800">Planned Progress (%)</th>
                      <th className="h-[38px] px-3.5 text-center align-middle bg-[#D6E3EF] font-bold text-slate-800">Actual Progress (%)</th>
                      <th className="h-[38px] px-3.5 text-center align-middle bg-[#D6E3EF] font-bold text-slate-800">Variance (%)</th>
                      <th className="h-[38px] px-3.5 text-center align-middle bg-[#D6E3EF] font-bold text-slate-800">Project Status</th>
                      <th className="h-[38px] px-3.5 text-center align-middle bg-[#D6E3EF] font-bold text-slate-800">Planned GHG Reduction (tCO₂e)</th>
                      <th className="h-[38px] px-3.5 text-center align-middle bg-[#D6E3EF] font-bold text-slate-800">Actual GHG Reduction (tCO₂e)</th>
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
                          <td className="h-[48px] px-3.5 align-middle text-slate-800 font-semibold">
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
                          <td className="h-[48px] px-3.5 text-center align-middle font-mono font-medium text-slate-800">
                            {row.plannedGhg !== '—' ? `${row.plannedGhg} tCO₂e` : '—'}
                          </td>
                          <td className="h-[48px] px-3.5 text-center align-middle font-mono font-bold text-emerald-700">
                            {row.actualGhg !== '—' ? `${row.actualGhg} tCO₂e` : '—'}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="h-32 text-center text-slate-400 font-medium text-xs align-middle">
                          No performance reporting records found for {selectedPeriod}.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
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
                        <tr key={idx} className={`h-[60px] ${idx % 2 === 1 ? 'bg-slate-50/80' : 'bg-white'} hover:bg-[#EBF3FA] transition-colors`}>
                          <td className="h-[60px] px-3.5 font-bold text-[#004B87] text-sm align-middle">{row.reportingPeriod}</td>
                          <td className="h-[60px] px-3.5 font-mono font-normal text-slate-800 align-middle">{row.reportId}</td>
                          <td className="h-[60px] px-3.5 font-mono font-bold text-slate-600 align-middle">{row.version}</td>
                          <td className="h-[60px] px-3.5 font-semibold text-slate-800 align-middle">{row.progress}</td>
                          <td className="h-[60px] px-3.5 font-bold text-emerald-700 align-middle">{row.ghgReduction}</td>
                          <td className="h-[60px] px-3.5 text-slate-500 font-normal align-middle">{row.submittedDate}</td>
                          <td className="h-[60px] px-3.5 align-middle">
                            <Badge variant={row.statusVariant} size="sm">
                              {row.status}
                            </Badge>
                          </td>
                          <td className="h-[60px] px-4 text-center align-middle">
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
            <div className="space-y-[18px] animate-fade-in">
              <GlassCard className="p-6 border-slate-200 shadow-sm space-y-[18px]">
                <div className="border-b border-slate-100 pb-4">
                  <h2 className="text-base font-bold text-navy-950 flex items-center gap-2">
                    <History className="w-5 h-5 text-[#004B87]" />
                    Review & Statutory Audit Trail — 2026
                  </h2>
                  <p className="text-slate-500 text-xs mt-1">
                    Complete revision logs, EAD reviewer actions, and compliance determinations for statutory transparency.
                  </p>
                </div>

                <div className="space-y-4">
                  {projectAuditHistory.map((ver, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-white flex flex-wrap items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-extrabold text-sm text-[#004B87]">
                            Version {ver.version}
                          </span>
                          <span className="text-xs text-slate-400 font-semibold">• {ver.timestamp}</span>
                        </div>
                        <p className="text-xs text-slate-800 font-bold">{ver.action}</p>
                        <p className="text-xs text-slate-600 font-normal">{ver.comments}</p>
                        <div className="text-[11px] text-slate-500 font-medium">
                          Author / Authority: <strong className="text-slate-700">{ver.user}</strong> ({ver.role})
                        </div>
                      </div>

                      <button
                        onClick={() => openReadOnlyViewer({
                          moduleType: 'full-dossier',
                          recordId: activeInitiativeMeta.initiativeCode,
                          version: 1,
                          initialTab: 'comparison',
                        })}
                        className="px-3 py-1.5 rounded-lg bg-[#004B87]/10 hover:bg-[#004B87]/20 text-[#004B87] text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Version Record</span>
                      </button>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default MRVReportsView;
