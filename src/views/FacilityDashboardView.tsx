import React, { useState } from 'react';
import {
  FolderKanban,
  Send,
  Bookmark,
  Database,
  RotateCcw,
  TrendingUp,
  CheckCircle2,
  Clock,
  Calendar,
  Download,
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Plus,
  Eye,
  FileText,
  Sparkles,
  ShieldCheck,
  Layers,
  BarChart3,
  Building2,
  ExternalLink,
  Flame,
  Leaf,
  Wind,
  Sun,
  Activity,
  AlertTriangle,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Sector,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { useMRV } from '../context/MRVContext';
import { NotchCard } from '../components/ui/NotchCard';
import { INITIAL_FACILITY_REGISTRATIONS } from '../data/facilityRegistrationsData';
import { INITIAL_FACILITY_EMISSIONS } from '../data/facilityEmissionsData';
import { INITIAL_AMENDMENTS } from '../data/amendmentsData';

// Dashboard Period-specific Climate Change Data Dictionary
const PERIOD_DATA: Record<
  string,
  {
    kpis: {
      totalProjects: { value: string; sub: string };
      submittedProjects: { value: string; total: string; sub: string; percent: string };
      draftProjects: { value: string; sub: string };
      dataEntryProjects: { value: string; total: string; sub: string; percent: string };
      pendingAmendments: { value: string; sub: string };
    };
    monthlyDataGhg: { name: string; planned: number; actual: number }[];
    monthlyDataCleanEnergy: { name: string; planned: number; actual: number }[];
    monthlyDataEfficiency: { name: string; planned: number; actual: number }[];
    legend: { planned: string; actual: string };
    workflow: {
      draft: number;
      draftPct: string;
      registered: number;
      registeredPct: string;
      dataEntry: number;
      dataEntryPct: string;
      amendment: number;
      amendmentPct: string;
      reported: number;
      reportedPct: string;
      activeRate: string;
    };
    pillarData: { name: string; percent: string; width: string; color: string; count: number }[];
    projectsList: {
      id: string;
      name: string;
      code: string;
      entity: string;
      pillar: 'Mitigation' | 'Adaptation' | 'Economic Diversification' | 'Cross Cutting';
      sector: string;
      status: 'Approved' | 'Submitted' | 'Under Review' | 'Correction Requested' | 'Registry Update Pending' | 'Draft';
      dataEntryStatus: 'Active' | 'Completed' | 'Pending';
      targetGhgReduction: string;
      targetCapacity?: string;
      targetView: 'registration' | 'data-entry' | 'amendments' | 'reports';
      actionLabel: string;
    }[];
    recentActivities: {
      time: string;
      text: string;
      badge: string;
      badgeClass: string;
      dotColor: string;
    }[];
    highlights: {
      totalGhgTarget: string;
      totalCleanCap: string;
      milestoneRate: string;
    };
  }
> = {
  'FY 2026–27': {
    kpis: {
      totalProjects: { value: '7', sub: 'Registered Initiatives' },
      submittedProjects: { value: '6', total: '/ 7', sub: '85.7% submitted & active', percent: '85.7%' },
      draftProjects: { value: '1', sub: '14.3% in formulation' },
      dataEntryProjects: { value: '4', total: '/ 7', sub: '57.1% monitoring active', percent: '57.1%' },
      pendingAmendments: { value: '1', sub: 'Active amendment review' },
    },
    monthlyDataGhg: [
      { name: 'Al Dhafra Solar', planned: 142.8, actual: 138.5 },
      { name: 'Biogas Recovery', planned: 38.5, actual: 41.2 },
      { name: 'Electric Transit', planned: 24.0, actual: 21.5 },
      { name: 'Portfolio Total', planned: 205.3, actual: 201.2 },
    ],
    monthlyDataCleanEnergy: [
      { name: 'Al Dhafra Solar', planned: 2000, actual: 2000 },
      { name: 'Green Hydrogen Hub', planned: 150, actual: 50 },
      { name: 'Biogas Energy', planned: 35, actual: 35 },
      { name: 'Portfolio Total', planned: 2185, actual: 2085 },
    ],
    monthlyDataEfficiency: [
      { name: 'Al Dhafra Solar', planned: 75, actual: 68 },
      { name: 'Green Hydrogen', planned: 35, actual: 30 },
      { name: 'Mangrove Restore', planned: 50, actual: 52 },
      { name: 'Electric Transit', planned: 60, actual: 55 },
      { name: 'Biogas Recovery', planned: 100, actual: 100 },
      { name: 'Stormwater Infra', planned: 45, actual: 40 },
      { name: 'Smart Irrigation', planned: 25, actual: 20 },
    ],
    legend: { planned: 'Planned Target', actual: 'Actual Performance' },
    workflow: {
      draft: 1,
      draftPct: '14.3%',
      registered: 2,
      registeredPct: '28.6%',
      dataEntry: 1,
      dataEntryPct: '14.3%',
      amendment: 1,
      amendmentPct: '14.3%',
      reported: 2,
      reportedPct: '28.5%',
      activeRate: '7 / 7 Projects Accounted (100%)',
    },
    pillarData: [
      { name: 'Adaptation', percent: '42.9%', width: '42.9%', color: 'bg-[#0284C7]', count: 3 },
      { name: 'Mitigation', percent: '28.6%', width: '28.6%', color: 'bg-[#004B87]', count: 2 },
      { name: 'Economic Diversification', percent: '14.3%', width: '14.3%', color: 'bg-[#8B5CF6]', count: 1 },
      { name: 'Cross Cutting', percent: '14.3%', width: '14.3%', color: 'bg-[#F59E0B]', count: 1 },
    ],
    projectsList: [
      {
        id: 'fac-1',
        name: 'Al Dhafra Solar PV Decarbonization Program',
        code: 'CCRP-INIT-2026-7073',
        entity: 'Department of Energy (DoE)',
        pillar: 'Mitigation',
        sector: 'Energy',
        status: 'Approved',
        dataEntryStatus: 'Active',
        targetGhgReduction: '142,800 tCO₂e / yr',
        targetCapacity: '2,000 MW',
        targetView: 'data-entry',
        actionLabel: 'Open Data Entry',
      },
      {
        id: 'fac-2',
        name: 'Low-Carbon Industrial Transition & Green Hydrogen Hub',
        code: 'CCRP-INIT-2026-0118',
        entity: 'Abu Dhabi Department of Economic Development (ADDED)',
        pillar: 'Economic Diversification',
        sector: 'Industry & Manufacturing',
        status: 'Submitted',
        dataEntryStatus: 'Pending',
        targetGhgReduction: '850,000 tCO₂e / yr (2028 Target)',
        targetCapacity: '150 MW H₂',
        targetView: 'amendments',
        actionLabel: 'View Amendment',
      },
      {
        id: 'fac-3',
        name: 'Abu Dhabi Mangrove & Blue Carbon Coastal Restoration',
        code: 'CCRP-INIT-2026-0422',
        entity: 'Environment Agency – Abu Dhabi (EAD)',
        pillar: 'Adaptation',
        sector: 'Coastal & Marine Ecosystems',
        status: 'Approved',
        dataEntryStatus: 'Completed',
        targetGhgReduction: 'Blue Carbon Sequestration',
        targetCapacity: '12,000 Hectares',
        targetView: 'data-entry',
        actionLabel: 'View Data Entry',
      },
      {
        id: 'fac-4',
        name: 'Electric Public Transit Fleet & EV Fast-Charging Network',
        code: 'CCRP-INIT-2026-0305',
        entity: 'Integrated Transport Centre (ITC)',
        pillar: 'Mitigation',
        sector: 'Transport',
        status: 'Under Review',
        dataEntryStatus: 'Active',
        targetGhgReduction: '24,000 tCO₂e / yr',
        targetCapacity: '160 EV Hubs',
        targetView: 'registration',
        actionLabel: 'View Details',
      },
      {
        id: 'fac-5',
        name: 'Integrated Organic Waste & Biogas Energy Recovery Program',
        code: 'CCRP-INIT-2026-0775',
        entity: 'Abu Dhabi Waste Management Centre (Tadweer)',
        pillar: 'Cross Cutting',
        sector: 'Waste Management',
        status: 'Approved',
        dataEntryStatus: 'Completed',
        targetGhgReduction: '38,500 tCO₂e / yr',
        targetCapacity: '35 MW Biogas',
        targetView: 'reports',
        actionLabel: 'View Report',
      },
      {
        id: 'fac-6',
        name: 'Climate Resilient Urban Infrastructure & Stormwater Drainage Upgrade',
        code: 'CCRP-INIT-2026-0619',
        entity: 'Department of Municipalities and Transport (DMT)',
        pillar: 'Adaptation',
        sector: 'Infrastructure & Built Environment',
        status: 'Correction Requested',
        dataEntryStatus: 'Pending',
        targetGhgReduction: 'Resilience Index +34%',
        targetCapacity: '5 Retention Basins',
        targetView: 'registration',
        actionLabel: 'Edit Project',
      },
      {
        id: 'fac-7',
        name: 'Agricultural Water Efficiency & Smart Irrigation Program',
        code: 'Draft Initiative',
        entity: 'Abu Dhabi Agriculture and Food Safety Authority (ADAFSA)',
        pillar: 'Adaptation',
        sector: 'Agriculture, Forestry & Land Use (AFOLU)',
        status: 'Draft',
        dataEntryStatus: 'Pending',
        targetGhgReduction: 'Water Desalination Savings',
        targetCapacity: '1,200 Farms',
        targetView: 'registration',
        actionLabel: 'Edit Draft',
      },
    ],
    recentActivities: [
      {
        time: '10:42 AM',
        text: 'Project Data Entry submitted for Al Dhafra Solar PV (H1 2026)',
        badge: 'Project Data Entry',
        badgeClass: 'bg-blue-50 text-blue-700 border-blue-200/60',
        dotColor: 'bg-blue-500',
      },
      {
        time: '09:15 AM',
        text: 'Amendment request submitted for Green Hydrogen Hub',
        badge: 'Amendments',
        badgeClass: 'bg-purple-50 text-purple-700 border-purple-200/60',
        dotColor: 'bg-purple-500',
      },
      {
        time: 'Yesterday',
        text: 'Amendment approved for Electric Public Transit Fleet',
        badge: 'Amendments',
        badgeClass: 'bg-purple-50 text-purple-700 border-purple-200/60',
        dotColor: 'bg-purple-500',
      },
      {
        time: '26 Sep 2026',
        text: 'Project Registration approved: Mangrove & Blue Carbon Coastal Restoration',
        badge: 'Project Registration',
        badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
        dotColor: 'bg-emerald-500',
      },
      {
        time: '18 Sep 2026',
        text: 'Correction requested for Climate Resilient Urban Infrastructure registration',
        badge: 'Project Registration',
        badgeClass: 'bg-amber-50 text-amber-700 border-amber-200/60',
        dotColor: 'bg-amber-500',
      },
      {
        time: '22 Jan 2026',
        text: 'Annual Performance Report submitted for Biogas Energy Recovery Program',
        badge: 'Reports',
        badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
        dotColor: 'bg-emerald-500',
      },
    ],
    highlights: {
      totalGhgTarget: '205.3K tCO₂e / yr',
      totalCleanCap: '2,185 MW',
      milestoneRate: '52.1%',
    },
  },

  'FY 2025–26': {
    kpis: {
      totalProjects: { value: '5', sub: 'Registered in FY 25' },
      submittedProjects: { value: '4', total: '/ 5', sub: '80.0% submission rate', percent: '80.0%' },
      draftProjects: { value: '1', sub: '20.0% in formulation' },
      dataEntryProjects: { value: '3', total: '/ 5', sub: '60.0% monitoring active', percent: '60.0%' },
      pendingAmendments: { value: '0', sub: 'All amendments processed' },
    },
    monthlyDataGhg: [
      { name: 'Al Dhafra Solar', planned: 120.0, actual: 118.2 },
      { name: 'Biogas Recovery', planned: 30.0, actual: 31.0 },
      { name: 'Portfolio Total', planned: 150.0, actual: 149.2 },
    ],
    monthlyDataCleanEnergy: [
      { name: 'Al Dhafra Solar', planned: 1500, actual: 1500 },
      { name: 'Biogas Energy', planned: 25, actual: 25 },
      { name: 'Portfolio Total', planned: 1525, actual: 1525 },
    ],
    monthlyDataEfficiency: [
      { name: 'Al Dhafra Solar', planned: 60, actual: 58 },
      { name: 'Mangrove Restore', planned: 40, actual: 40 },
      { name: 'Biogas Recovery', planned: 80, actual: 80 },
    ],
    legend: { planned: 'Planned Target', actual: 'Actual Performance' },
    workflow: {
      draft: 1,
      draftPct: '20.0%',
      registered: 1,
      registeredPct: '20.0%',
      dataEntry: 1,
      dataEntryPct: '20.0%',
      amendment: 0,
      amendmentPct: '0.0%',
      reported: 2,
      reportedPct: '40.0%',
      activeRate: '5 / 5 Projects Accounted (100%)',
    },
    pillarData: [
      { name: 'Mitigation', percent: '40.0%', width: '40.0%', color: 'bg-[#004B87]', count: 2 },
      { name: 'Adaptation', percent: '40.0%', width: '40.0%', color: 'bg-[#0284C7]', count: 2 },
      { name: 'Cross Cutting', percent: '20.0%', width: '20.0%', color: 'bg-[#F59E0B]', count: 1 },
    ],
    projectsList: [
      {
        id: 'fac-1',
        name: 'Al Dhafra Solar PV Decarbonization Program',
        code: 'CCRP-INIT-2026-7073',
        entity: 'Department of Energy (DoE)',
        pillar: 'Mitigation',
        sector: 'Energy',
        status: 'Approved',
        dataEntryStatus: 'Completed',
        targetGhgReduction: '120,000 tCO₂e / yr',
        targetCapacity: '1,500 MW',
        targetView: 'data-entry',
        actionLabel: 'Open Data Entry',
      },
      {
        id: 'fac-3',
        name: 'Abu Dhabi Mangrove & Blue Carbon Coastal Restoration',
        code: 'CCRP-INIT-2026-0422',
        entity: 'Environment Agency – Abu Dhabi (EAD)',
        pillar: 'Adaptation',
        sector: 'Coastal Ecosystems',
        status: 'Approved',
        dataEntryStatus: 'Completed',
        targetGhgReduction: 'Blue Carbon Sinks',
        targetCapacity: '8,000 Hectares',
        targetView: 'registration',
        actionLabel: 'View Details',
      },
    ],
    recentActivities: [
      {
        time: '14 Jan 2026',
        text: 'Al Dhafra Solar PV annual baseline reporting approved',
        badge: 'Reports',
        badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
        dotColor: 'bg-emerald-500',
      },
    ],
    highlights: {
      totalGhgTarget: '150.0K tCO₂e / yr',
      totalCleanCap: '1,525 MW',
      milestoneRate: '59.3%',
    },
  },
};

export const FacilityDashboardView: React.FC = () => {
  const { setActiveView, currentRole, facilityRegistrations, facilityEmissions } = useMRV();

  // Period filter state
  const [selectedPeriod, setSelectedPeriod] = useState<string>('FY 2026–27');
  const [isPeriodDropdownOpen, setIsPeriodDropdownOpen] = useState(false);

  // Metric Toggle for the chart
  const [activeChartMetric, setActiveChartMetric] = useState<'ghg' | 'cleanEnergy' | 'efficiency'>('ghg');
  const [isMetricDropdownOpen, setIsMetricDropdownOpen] = useState(false);
  const [activeDonutIndex, setActiveDonutIndex] = useState<number | null>(null);

  // Pagination for Climate Change Initiatives table
  const [currentTablePage, setCurrentTablePage] = useState(1);
  const tableItemsPerPage = 6;

  const METRIC_OPTIONS: { id: 'ghg' | 'cleanEnergy' | 'efficiency'; label: string }[] = [
    { id: 'ghg', label: 'GHG (tCO₂e)' },
    { id: 'cleanEnergy', label: 'Clean Energy (MW)' },
    { id: 'efficiency', label: 'Efficiency (%)' },
  ];

  const currentMetricLabel =
    METRIC_OPTIONS.find((m) => m.id === activeChartMetric)?.label || 'GHG (tCO₂e)';

  const periodData = PERIOD_DATA[selectedPeriod] || PERIOD_DATA['FY 2026–27'];
  const { kpis, workflow, projectsList, recentActivities, highlights } = periodData;

  // Dynamic Strategy Pillar Distribution derived from actual project data
  const dynamicPillarData = React.useMemo(() => {
    const pillarCounts: Record<string, number> = {};
    projectsList.forEach((p) => {
      pillarCounts[p.pillar] = (pillarCounts[p.pillar] || 0) + 1;
    });

    const total = projectsList.length || 1;
    const pillarColors: Record<string, string> = {
      Adaptation: 'bg-[#0284C7]',
      Mitigation: 'bg-[#004B87]',
      'Economic Diversification': 'bg-[#8B5CF6]',
      'Cross Cutting': 'bg-[#F59E0B]',
    };

    return Object.entries(pillarCounts)
      .map(([name, count]) => {
        const pct = ((count / total) * 100).toFixed(1) + '%';
        return {
          name,
          count,
          percent: pct,
          width: pct,
          color: pillarColors[name] || 'bg-[#004B87]',
        };
      })
      .sort((a, b) => b.count - a.count);
  }, [projectsList]);

  const statusDonutData = [
    { name: 'Draft', count: workflow.draft, percent: workflow.draftPct, color: '#94A3B8' },
    { name: 'Registered / Submitted', count: workflow.registered, percent: workflow.registeredPct, color: '#004B87' },
    { name: 'Project Data Entry', count: workflow.dataEntry, percent: workflow.dataEntryPct, color: '#0284C7' },
    { name: 'Amendment / Review', count: workflow.amendment, percent: workflow.amendmentPct, color: '#9333EA' },
    { name: 'Reports Submitted', count: workflow.reported, percent: workflow.reportedPct, color: '#00875A' },
  ];

  const totalProjectsCount = statusDonutData.reduce((acc, curr) => acc + curr.count, 0);

  const chartData =
    activeChartMetric === 'ghg'
      ? periodData.monthlyDataGhg
      : activeChartMetric === 'cleanEnergy'
      ? periodData.monthlyDataCleanEnergy
      : periodData.monthlyDataEfficiency;

  const chartUnit =
    activeChartMetric === 'ghg'
      ? 'k tCO₂e'
      : activeChartMetric === 'cleanEnergy'
      ? 'MW'
      : '%';

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#E8F8F0] text-[#00875A] border border-[#00875A]/25 inline-block">
            Approved
          </span>
        );
      case 'Submitted':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#E0EEFA] text-[#0284C7] border border-sky-200/60 inline-block">
            Submitted
          </span>
        );
      case 'Under Review':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-50 text-sky-700 border border-sky-200/60 inline-block">
            Under Review
          </span>
        );
      case 'Correction Requested':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200/60 inline-block">
            Correction Requested
          </span>
        );
      case 'Registry Update Pending':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200/60 inline-block">
            Registry Update Pending
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200 inline-block">
            Draft
          </span>
        );
    }
  };

  const getPillarBadge = (pillar: string) => {
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

  return (
    <div className="h-full flex flex-col overflow-hidden font-sans py-1 animate-fade-in">
      {/* =================================================================== */}
      {/* 1. TOP HEADER & PERIOD SELECTOR (STICKY TITLE ROW) */}
      {/* =================================================================== */}
      <div className="flex-shrink-0 flex flex-wrap items-center justify-between gap-3 pb-3 pt-0.5 z-20">
        <div>
          <h1 className="text-[20px] font-bold font-display text-[#004B87] tracking-tight">
            Climate Change Projects Dashboard
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Comprehensive initiative tracking, reporting cadence, amendments & climate action metrics
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Period Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsPeriodDropdownOpen(!isPeriodDropdownOpen)}
              className="h-9 px-3 bg-white border border-slate-200/90 rounded-[8px] text-xs font-semibold text-slate-700 flex items-center gap-2 shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-[#004B87]" />
              <span>{selectedPeriod}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isPeriodDropdownOpen && (
              <div className="absolute right-0 top-10 z-30 w-36 bg-white rounded-xl border border-slate-200 shadow-lg py-1 text-xs">
                {Object.keys(PERIOD_DATA).map((p) => (
                  <button
                    key={p}
                    onClick={() => {
                      setSelectedPeriod(p);
                      setIsPeriodDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 hover:bg-slate-50 font-medium cursor-pointer ${
                      selectedPeriod === p ? 'text-[#004B87] font-bold bg-sky-50/50' : 'text-slate-700'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Action Button */}
          <button
            onClick={() => setActiveView('reports')}
            className="h-9 px-3.5 bg-gradient-to-r from-[#004B87] to-[#006BB8] text-white rounded-[8px] text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#004B87]/25 hover:shadow-lg hover:from-[#003d6e] hover:to-[#005c9e] transition-all cursor-pointer active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* =================================================================== */}
      {/* SCROLLABLE DASHBOARD CONTENT */}
      {/* =================================================================== */}
      <div className="flex-1 min-h-0 overflow-y-auto space-y-4 pr-1 custom-scrollbar">
        {/* =================================================================== */}
        {/* 2. SUMMARY KPI NOTCH CARDS (5 PROJECT-LEVEL CARDS) */}
        {/* =================================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Card 1: Total Projects */}
          <NotchCard
            icon={<FolderKanban className="w-4 h-4 text-white" />}
            iconGradient="from-[#004B87] to-[#006BB8]"
            iconShadow="shadow-[#004B87]/20"
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setActiveView('registration')}
          >
            <div className="flex flex-col justify-between h-full pt-1 pb-0.5">
              <div>
                <span className="text-[13px] font-bold text-slate-800 block">
                  Total Projects
                </span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-bold font-display text-navy-950">
                    {kpis.totalProjects.value}
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  Registered Initiatives
                </span>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10.5px]">
                <span className="text-slate-400">Cycle</span>
                <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                  {kpis.totalProjects.sub}
                </span>
              </div>
            </div>
          </NotchCard>

          {/* Card 2: Submitted Projects */}
          <NotchCard
            icon={<Send className="w-4 h-4 text-white" />}
            iconGradient="from-emerald-600 to-emerald-700"
            iconShadow="shadow-emerald-600/20"
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setActiveView('registration')}
          >
            <div className="flex flex-col justify-between h-full pt-1 pb-0.5">
              <div>
                <span className="text-[13px] font-bold text-slate-800 block">
                  Submitted Projects
                </span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-bold font-display text-emerald-700">
                    {kpis.submittedProjects.value}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    {kpis.submittedProjects.total}
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  Approved & Under Review
                </span>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10.5px]">
                <span className="text-slate-400">Rate</span>
                <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                  {kpis.submittedProjects.sub}
                </span>
              </div>
            </div>
          </NotchCard>

          {/* Card 3: Projects in Draft */}
          <NotchCard
            icon={<Bookmark className="w-4 h-4 text-white fill-current" />}
            iconGradient="from-amber-500 to-amber-600"
            iconShadow="shadow-amber-500/20"
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setActiveView('registration')}
          >
            <div className="flex flex-col justify-between h-full pt-1 pb-0.5">
              <div>
                <span className="text-[13px] font-bold text-slate-800 block">
                  Projects in Draft
                </span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-bold font-display text-amber-700">
                    {kpis.draftProjects.value}
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  Pending Registration
                </span>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10.5px]">
                <span className="text-slate-400">Status</span>
                <span className="font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
                  {kpis.draftProjects.sub}
                </span>
              </div>
            </div>
          </NotchCard>

          {/* Card 4: Projects Data Entry */}
          <NotchCard
            icon={<Database className="w-4 h-4 text-white" />}
            iconGradient="from-[#0284C7] to-[#0369A1]"
            iconShadow="shadow-[#0284C7]/20"
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setActiveView('data-entry')}
          >
            <div className="flex flex-col justify-between h-full pt-1 pb-0.5">
              <div>
                <span className="text-[13px] font-bold text-slate-800 block">
                  Projects Data Entry
                </span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-bold font-display text-[#004B87]">
                    {kpis.dataEntryProjects.value}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    {kpis.dataEntryProjects.total}
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  Monitoring Plans Active
                </span>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10.5px]">
                <span className="text-slate-400">Completion</span>
                <span className="font-semibold text-[#004B87] bg-sky-50 px-2 py-0.5 rounded-md border border-sky-100">
                  {kpis.dataEntryProjects.sub}
                </span>
              </div>
            </div>
          </NotchCard>

          {/* Card 5: Pending Amendments */}
          <NotchCard
            icon={<RotateCcw className="w-4 h-4 text-white" />}
            iconGradient="from-purple-600 to-indigo-600"
            iconShadow="shadow-purple-600/20"
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setActiveView('amendments')}
          >
            <div className="flex flex-col justify-between h-full pt-1 pb-0.5">
              <div>
                <span className="text-[13px] font-bold text-slate-800 block">
                  Pending Amendments
                </span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-bold font-display text-purple-700">
                    {kpis.pendingAmendments.value}
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  In Review & Updates
                </span>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10.5px]">
                <span className="text-slate-400">Review</span>
                <span className="font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                  {kpis.pendingAmendments.sub}
                </span>
              </div>
            </div>
          </NotchCard>
        </div>

        {/* =================================================================== */}
        {/* 3. MIDDLE SECTION: PROJECT DATA OVERVIEW + WORKFLOW STATUS PIPELINE */}
        {/* =================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 lg:h-[380px]">
          {/* Left: Project Data & Decarbonization Targets Chart (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/90 shadow-sm px-4 py-[10px] flex flex-col justify-between h-full">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2">
                <div>
                  <h3 className="text-sm font-bold text-navy-950 font-display">
                    Project Data & Decarbonization Trajectory
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Planned vs Actual performance across registered climate change initiatives
                  </p>
                </div>

                {/* Metric Selector Dropdown in Title Row */}
                <div className="relative">
                  <button
                    onClick={() => setIsMetricDropdownOpen(!isMetricDropdownOpen)}
                    className="h-8 px-3 bg-white border border-slate-200/90 rounded-[8px] text-xs font-semibold text-slate-700 flex items-center gap-2 shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <BarChart3 className="w-3.5 h-3.5 text-[#004B87]" />
                    <span>{currentMetricLabel}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {isMetricDropdownOpen && (
                    <div className="absolute right-0 top-9.5 z-30 w-44 bg-white rounded-xl border border-slate-200 shadow-lg py-1 text-xs">
                      {METRIC_OPTIONS.map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => {
                            setActiveChartMetric(opt.id);
                            setIsMetricDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-1.5 hover:bg-slate-50 font-medium cursor-pointer flex items-center justify-between ${
                            activeChartMetric === opt.id ? 'text-[#004B87] font-bold bg-sky-50/50' : 'text-slate-700'
                          }`}
                        >
                          <span>{opt.label}</span>
                          {activeChartMetric === opt.id && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#004B87]" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Metrics Summary Strip */}
              <div className="grid grid-cols-3 gap-2 py-2 border-b border-slate-100 text-xs">
                <div className="p-2 bg-sky-50/50 rounded-xl border border-sky-100">
                  <span className="text-[10.5px] font-semibold text-slate-500 block">Planned GHG Reduction</span>
                  <span className="text-sm font-bold text-[#004B87] mt-0.5 block">{highlights.totalGhgTarget}</span>
                </div>
                <div className="p-2 bg-emerald-50/50 rounded-xl border border-emerald-100">
                  <span className="text-[10.5px] font-semibold text-slate-500 block">Planned Clean Energy Capacity</span>
                  <span className="text-sm font-bold text-emerald-700 mt-0.5 block">{highlights.totalCleanCap}</span>
                </div>
                <div className="p-2 bg-purple-50/50 rounded-xl border border-purple-100">
                  <span className="text-[10.5px] font-semibold text-slate-500 block">Actual Progress</span>
                  <span className="text-sm font-bold text-purple-700 mt-0.5 block">{highlights.milestoneRate}</span>
                </div>
              </div>

              {/* Recharts Area Chart: Planned (Lined & Filled) vs Actual (Dotted Line) */}
              <div className="h-[185px] w-full pt-1.5">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorPlanned" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#004B87" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#004B87" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={{ stroke: '#CBD5E1' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={{ stroke: '#CBD5E1' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        borderRadius: '10px',
                        border: '1px solid #E2E8F0',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                        fontSize: '11px',
                      }}
                      formatter={(value: any, name: string) => [
                        `${value} ${chartUnit}`,
                        name === 'Planned Target' || name === 'planned' ? 'Planned Target' : 'Actual Performance',
                      ]}
                    />
                    <Area
                      type="monotone"
                      dataKey="planned"
                      name="Planned Target"
                      stroke="#004B87"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#colorPlanned)"
                    />
                    <Area
                      type="monotone"
                      dataKey="actual"
                      name="Actual Performance"
                      stroke="#00875A"
                      strokeWidth={2.5}
                      strokeDasharray="5 5"
                      fill="none"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart Legend */}
            <div className="flex items-center justify-center gap-6 pt-1 border-t border-slate-100 text-[11px] font-medium text-slate-600">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#004B87]" />
                <span>Planned Target</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-0.5 border-b-2 border-dashed border-[#00875A]" />
                <span>Actual Performance</span>
              </div>
            </div>
          </div>

          {/* Right: Project Status Overview (Donut Chart) (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/90 shadow-sm px-4 py-[10px] flex flex-col gap-[6px] h-full">
            {/* Header */}
            <div className="flex items-center justify-between pb-0.5 shrink-0">
              <div>
                <h3 className="text-sm font-bold text-navy-950 font-display">
                  Project Status Overview
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Lifecycle distribution across projects
                </p>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap">
                {totalProjectsCount} / {totalProjectsCount} (100%)
              </span>
            </div>

            {/* Large Centered Donut Chart with Direct Slice Percentages & Hover Highlight */}
            <div className="relative w-full flex-1 min-h-0 flex items-center justify-center">
              {/* Center Text inside Donut: 7 Projects (placed BEFORE chart container with z-0 so Tooltip is ALWAYS on top) */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center z-0">
                <span className="text-2xl font-bold font-display text-navy-950 leading-none">
                  {totalProjectsCount}
                </span>
                <span className="text-[10px] font-semibold text-slate-500 mt-0.5 tracking-tight">
                  Projects
                </span>
              </div>

              {/* Chart container with z-10 stacking context */}
              <div className="relative z-10 w-full h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip
                      isAnimationActive={false}
                      wrapperStyle={{ zIndex: 1000, pointerEvents: 'none' }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-200/90 shadow-2xl text-xs font-semibold text-slate-800 flex items-center gap-2 pointer-events-none">
                              <span
                                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                                style={{ backgroundColor: data.color }}
                              />
                              <div>
                                <span className="font-bold text-slate-900 block">{data.name}</span>
                                <span className="text-slate-500 font-medium text-[11px]">
                                  {data.count} {data.count === 1 ? 'Project' : 'Projects'}{' '}
                                  <span className="font-bold text-[#004B87]">({data.percent})</span>
                                </span>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Pie
                      isAnimationActive={false}
                      activeIndex={activeDonutIndex ?? undefined}
                      activeShape={(props: any) => {
                        const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
                        return (
                          <g className="cursor-pointer">
                            <Sector
                              cx={cx}
                              cy={cy}
                              innerRadius={innerRadius - 3}
                              outerRadius={outerRadius + 7}
                              startAngle={startAngle}
                              endAngle={endAngle}
                              fill={fill}
                              stroke="#ffffff"
                              strokeWidth={2.5}
                              style={{
                                filter: 'drop-shadow(0px 6px 12px rgba(0, 0, 0, 0.35))',
                                cursor: 'pointer',
                              }}
                            />
                          </g>
                        );
                      }}
                      data={statusDonutData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={92}
                      paddingAngle={0}
                      dataKey="count"
                      stroke="none"
                      labelLine={false}
                      onMouseEnter={(_, index) => setActiveDonutIndex(index)}
                      onMouseLeave={() => setActiveDonutIndex(null)}
                      label={({ cx, cy, midAngle, innerRadius, outerRadius, index }: any) => {
                        const RADIAN = Math.PI / 180;
                        const isActive = activeDonutIndex === index;
                        const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
                        const x = cx + radius * Math.cos(-midAngle * RADIAN);
                        const y = cy + radius * Math.sin(-midAngle * RADIAN);

                        // Tangential rotation angle along the slice arc
                        let rotation = -midAngle + 90;
                        if (rotation > 90) rotation -= 180;
                        if (rotation < -90) rotation += 180;

                        const pct = statusDonutData[index]?.percent || '';

                        return (
                          <text
                            x={x}
                            y={y}
                            fill="#ffffff"
                            textAnchor="middle"
                            dominantBaseline="central"
                            transform={`rotate(${rotation}, ${x}, ${y})`}
                            style={{
                              fontSize: isActive ? '11.5px' : '10.5px',
                              fontWeight: 800,
                              fill: '#ffffff',
                              filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.5))',
                            }}
                            className="select-none pointer-events-none font-bold"
                          >
                            {pct}
                          </text>
                        );
                      }}
                    >
                      {statusDonutData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color}
                          className="cursor-pointer"
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Legends Placed Below in a 2-per-row layout (Hoverable sync with uniform inter-item gap) */}
            <div className="flex flex-col items-center gap-y-1 text-xs w-full shrink-0">
              {/* Row 1: 2 items */}
              <div className="flex items-center justify-center gap-x-3 w-full">
                {[statusDonutData[0], statusDonutData[1]].map((stage, i) => {
                  const idx = i;
                  const isActive = activeDonutIndex === idx;
                  return (
                    <div
                      key={stage.name}
                      onMouseEnter={() => setActiveDonutIndex(idx)}
                      onMouseLeave={() => setActiveDonutIndex(null)}
                      className={`flex items-center gap-1.5 font-medium transition-all duration-150 cursor-pointer px-2 py-0.5 rounded-lg border whitespace-nowrap ${
                        isActive
                          ? 'bg-slate-100 border-slate-300 shadow-xs scale-[1.02] ring-1 ring-slate-300'
                          : 'border-transparent text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0 transition-transform"
                        style={{
                          backgroundColor: stage.color,
                          transform: isActive ? 'scale(1.25)' : 'scale(1)',
                        }}
                      />
                      <span className="text-[10.5px] font-semibold text-slate-700">{stage.name}:</span>
                      <span className="text-[10.5px] font-bold text-slate-900">{stage.count}</span>
                      <span className="text-[10px] text-slate-400 font-medium">({stage.percent})</span>
                    </div>
                  );
                })}
              </div>

              {/* Row 2: 2 items */}
              <div className="flex items-center justify-center gap-x-3 w-full">
                {[statusDonutData[2], statusDonutData[3]].map((stage, i) => {
                  const idx = i + 2;
                  const isActive = activeDonutIndex === idx;
                  return (
                    <div
                      key={stage.name}
                      onMouseEnter={() => setActiveDonutIndex(idx)}
                      onMouseLeave={() => setActiveDonutIndex(null)}
                      className={`flex items-center gap-1.5 font-medium transition-all duration-150 cursor-pointer px-2 py-0.5 rounded-lg border whitespace-nowrap ${
                        isActive
                          ? 'bg-slate-100 border-slate-300 shadow-xs scale-[1.02] ring-1 ring-slate-300'
                          : 'border-transparent text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0 transition-transform"
                        style={{
                          backgroundColor: stage.color,
                          transform: isActive ? 'scale(1.25)' : 'scale(1)',
                        }}
                      />
                      <span className="text-[10.5px] font-semibold text-slate-700">{stage.name}:</span>
                      <span className="text-[10.5px] font-bold text-slate-900">{stage.count}</span>
                      <span className="text-[10px] text-slate-400 font-medium">({stage.percent})</span>
                    </div>
                  );
                })}
              </div>

              {/* Row 3: 1 item */}
              <div className="flex items-center justify-center w-full">
                {(() => {
                  const stage = statusDonutData[4];
                  const idx = 4;
                  const isActive = activeDonutIndex === idx;
                  return (
                    <div
                      key={stage.name}
                      onMouseEnter={() => setActiveDonutIndex(idx)}
                      onMouseLeave={() => setActiveDonutIndex(null)}
                      className={`flex items-center gap-1.5 font-medium transition-all duration-150 cursor-pointer px-2 py-0.5 rounded-lg border whitespace-nowrap ${
                        isActive
                          ? 'bg-slate-100 border-slate-300 shadow-xs scale-[1.02] ring-1 ring-slate-300'
                          : 'border-transparent text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0 transition-transform"
                        style={{
                          backgroundColor: stage.color,
                          transform: isActive ? 'scale(1.25)' : 'scale(1)',
                        }}
                      />
                      <span className="text-[10.5px] font-semibold text-slate-700">{stage.name}:</span>
                      <span className="text-[10.5px] font-bold text-slate-900">{stage.count}</span>
                      <span className="text-[10px] text-slate-400 font-medium">({stage.percent})</span>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>

        {/* =================================================================== */}
        {/* 4. BOTTOM SECTION: STRATEGY & RECENT ACTIVITY (LEFT) + CLIMATE INITIATIVES (RIGHT) */}
        {/* =================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 pb-2">
          {/* Left: Pillar Breakdown & Recent Activity (4 cols) */}
          <div className="lg:col-span-4 space-y-3.5">
            {/* Strategy Pillar Distribution */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4">
              <h3 className="text-sm font-bold text-navy-950 font-display mb-1">
                Strategy Pillar Distribution
              </h3>
              <p className="text-[11px] text-slate-500 mb-3.5">
                Abu Dhabi Climate Change Strategy project allocation
              </p>

              <div className="space-y-3 text-xs">
                {dynamicPillarData.map((item) => (
                  <div key={item.name} className="space-y-1.5">
                    <div className="flex justify-between items-center text-[11.5px]">
                      <span className="font-semibold text-slate-700">{item.name}</span>
                      <span className="font-bold text-slate-800">
                        {item.count} {item.count === 1 ? 'project' : 'projects'} ({item.percent})
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.color} rounded-full transition-all duration-500`}
                        style={{ width: item.width }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity Stream */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm px-4 py-2.5">
              <h3 className="text-sm font-bold text-navy-950 font-display mb-0.5">
                Recent Activity Feed
              </h3>
              <p className="text-[11px] text-slate-500 mb-2">
                Latest statutory submissions and amendment actions
              </p>

              {/* Scrollable Feed List */}
              <div className="max-h-[160px] overflow-y-auto pr-1 space-y-2 custom-scrollbar">
                {recentActivities.map((act, i) => (
                  <div
                    key={i}
                    className="px-2.5 py-1.5 bg-slate-50/80 hover:bg-[#EBF3FA]/70 rounded-xl border border-slate-200/80 transition-colors flex items-center justify-between gap-2.5 group"
                  >
                    {/* Left: Title (No dot) */}
                    <div className="min-w-0 flex-1">
                      <p className="text-slate-800 font-medium text-[11px] leading-snug line-clamp-2 group-hover:text-[#004B87] transition-colors">
                        {act.text}
                      </p>
                    </div>

                    {/* Right: Timestamp (top) + Category Chip (below time) */}
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">
                        {act.time}
                      </span>
                      <span
                        className={`px-1.5 py-0.2 rounded-full text-[9.5px] font-bold border whitespace-nowrap ${act.badgeClass}`}
                      >
                        {act.badge}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Active Projects Table (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 flex flex-col justify-between">
            <div>
              {/* Header with Title and Subtitle consistent with other cards */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-bold text-navy-950 font-display">
                    Climate Change Initiatives
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Overview of registered climate initiatives, lead entities, pillars and statuses
                  </p>
                </div>
                <button
                  onClick={() => setActiveView('registration')}
                  className="text-xs font-bold text-[#004B87] hover:text-[#003d6e] flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>View All Projects</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Table styled matching Project Registration Overview */}
              <div className="overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-2xs mt-2">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-[#D6E3EF] select-none">
                    <tr className="h-[34px] bg-[#D6E3EF] text-slate-800 font-bold text-xs border-b border-[#5B88B0]/30">
                      <th className="px-3 py-1.5 text-left font-bold text-slate-800">Project Name & ID</th>
                      <th className="px-3 py-1.5 text-left font-bold text-slate-800">Lead Entity</th>
                      <th className="px-3 py-1.5 text-left font-bold text-slate-800">Pillar</th>
                      <th className="px-3 py-1.5 text-left font-bold text-slate-800">Status</th>
                      <th className="px-3 py-1.5 text-right font-bold text-slate-800">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-normal text-slate-700">
                    {projectsList
                      .slice(
                        (currentTablePage - 1) * tableItemsPerPage,
                        currentTablePage * tableItemsPerPage
                      )
                      .map((project, idx) => (
                        <tr
                          key={project.id}
                          className={`h-[44px] ${
                            idx % 2 === 1 ? 'bg-slate-50/80' : 'bg-white'
                          } hover:bg-[#EBF3FA] transition-colors group cursor-default`}
                        >
                          {/* 1. Project Name & ID */}
                          <td className="px-3 py-1.5 font-medium align-middle">
                            <div
                              className="text-slate-800 font-semibold line-clamp-1 hover:text-[#004B87] cursor-pointer transition-colors"
                              onClick={() => setActiveView(project.targetView)}
                              title={project.name}
                            >
                              {project.name}
                            </div>
                            <div className="text-[10.5px] font-mono font-bold text-[#004B87] mt-0.5">
                              {project.code}
                            </div>
                          </td>

                          {/* 2. Lead Entity */}
                          <td className="px-3 py-1.5 text-slate-600 align-middle max-w-[170px]">
                            <div className="line-clamp-1 truncate" title={project.entity}>
                              {project.entity}
                            </div>
                          </td>

                          {/* 3. Pillar */}
                          <td className="px-3 py-1.5 whitespace-nowrap align-middle">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold border ${getPillarBadge(
                                project.pillar
                              )}`}
                            >
                              {project.pillar}
                            </span>
                          </td>

                          {/* 4. Status */}
                          <td className="px-3 py-1.5 whitespace-nowrap align-middle">
                            {getStatusBadge(project.status)}
                          </td>

                          {/* 5. Action (Icon only, no label) */}
                          <td className="px-3 py-1.5 text-right whitespace-nowrap align-middle">
                            <button
                              onClick={() => setActiveView(project.targetView)}
                              title={project.actionLabel}
                              className="p-1.5 bg-white hover:bg-[#004B87]/10 hover:text-[#004B87] text-slate-600 border border-slate-200/90 rounded-lg text-xs font-bold shadow-2xs transition-all cursor-pointer inline-flex items-center justify-center hover:border-[#004B87]/30 hover:scale-105 active:scale-95"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination Bar (pinned to bottom with reduced gap) */}
            <div className="flex-shrink-0 pt-2 flex items-center justify-between text-xs text-slate-500 select-none border-t border-slate-100 mt-1.5">
              <div>
                Showing {projectsList.length === 0 ? 0 : (currentTablePage - 1) * tableItemsPerPage + 1} to{' '}
                {Math.min(currentTablePage * tableItemsPerPage, projectsList.length)} of {projectsList.length} projects
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentTablePage((p) => Math.max(1, p - 1))}
                  disabled={currentTablePage === 1}
                  className="p-1 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none cursor-pointer transition-colors shadow-2xs"
                  title="Previous Page"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span className="px-2 font-medium text-slate-700">
                  Page {currentTablePage} of {Math.ceil(projectsList.length / tableItemsPerPage) || 1}
                </span>
                <button
                  onClick={() =>
                    setCurrentTablePage((p) =>
                      Math.min(Math.ceil(projectsList.length / tableItemsPerPage) || 1, p + 1)
                    )
                  }
                  disabled={
                    currentTablePage === (Math.ceil(projectsList.length / tableItemsPerPage) || 1) ||
                    projectsList.length === 0
                  }
                  className="p-1 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none cursor-pointer transition-colors shadow-2xs"
                  title="Next Page"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacilityDashboardView;
