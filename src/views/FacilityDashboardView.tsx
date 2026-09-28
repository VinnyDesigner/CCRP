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
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { useMRV } from '../context/MRVContext';
import { NotchCard } from '../components/ui/NotchCard';

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
    monthlyDataGhg: { name: string; current: number; previous: number }[];
    monthlyDataCleanEnergy: { name: string; current: number; previous: number }[];
    monthlyDataEfficiency: { name: string; current: number; previous: number }[];
    quarterlyData: { name: string; current: number; previous: number }[];
    legend: { current: string; previous: string };
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
      totalProjects: { value: '12', sub: '+3 registered this cycle' },
      submittedProjects: { value: '8', total: '/ 12', sub: '67% submitted & active', percent: '67%' },
      draftProjects: { value: '2', sub: '17% pending submission' },
      dataEntryProjects: { value: '6', total: '/ 12', sub: '50% monitoring active', percent: '50%' },
      pendingAmendments: { value: '3', sub: 'Active reviews & tickets' },
    },
    monthlyDataGhg: [
      { name: 'Jan', current: 320, previous: 180 },
      { name: 'Feb', current: 480, previous: 240 },
      { name: 'Mar', current: 750, previous: 380 },
      { name: 'Apr', current: 690, previous: 420 },
      { name: 'May', current: 890, previous: 510 },
      { name: 'Jun', current: 1040, previous: 620 },
      { name: 'Jul', current: 1220, previous: 710 },
      { name: 'Aug', current: 1180, previous: 750 },
    ],
    monthlyDataCleanEnergy: [
      { name: 'Jan', current: 450, previous: 200 },
      { name: 'Feb', current: 680, previous: 350 },
      { name: 'Mar', current: 1100, previous: 500 },
      { name: 'Apr', current: 1350, previous: 650 },
      { name: 'May', current: 1750, previous: 850 },
      { name: 'Jun', current: 2100, previous: 1100 },
      { name: 'Jul', current: 2350, previous: 1300 },
      { name: 'Aug', current: 2450, previous: 1400 },
    ],
    monthlyDataEfficiency: [
      { name: 'Jan', current: 4.2, previous: 2.1 },
      { name: 'Feb', current: 6.5, previous: 3.4 },
      { name: 'Mar', current: 8.8, previous: 4.6 },
      { name: 'Apr', current: 10.2, previous: 5.8 },
      { name: 'May', current: 12.1, previous: 7.0 },
      { name: 'Jun', current: 13.9, previous: 8.3 },
      { name: 'Jul', current: 15.4, previous: 9.5 },
      { name: 'Aug', current: 16.2, previous: 10.1 },
    ],
    quarterlyData: [
      { name: 'Q1', current: 1550, previous: 800 },
      { name: 'Q2', current: 2620, previous: 1550 },
      { name: 'Q3', current: 3100, previous: 1980 },
      { name: 'Q4 (Est)', current: 4850, previous: 3200 },
    ],
    legend: { current: 'FY 2026–27', previous: 'FY 2025–26' },
    workflow: {
      draft: 2,
      draftPct: '16.7%',
      registered: 8,
      registeredPct: '66.7%',
      dataEntry: 6,
      dataEntryPct: '50.0%',
      amendment: 3,
      amendmentPct: '25.0%',
      reported: 5,
      reportedPct: '41.7%',
      activeRate: '83.3% (10 / 12 Projects)',
    },
    pillarData: [
      { name: 'Mitigation', percent: '42%', width: '42%', color: 'bg-[#004B87]', count: 5 },
      { name: 'Adaptation', percent: '28%', width: '28%', color: 'bg-[#0284C7]', count: 3 },
      { name: 'Economic Diversification', percent: '18%', width: '18%', color: 'bg-[#8B5CF6]', count: 2 },
      { name: 'Cross Cutting', percent: '12%', width: '12%', color: 'bg-[#F59E0B]', count: 2 },
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
        targetGhgReduction: '2,400,000 tCO₂e / yr',
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
        targetGhgReduction: '850,000 tCO₂e / yr',
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
        sector: 'Coastal Ecosystems',
        status: 'Approved',
        dataEntryStatus: 'Completed',
        targetGhgReduction: '320,000 tCO₂e / yr',
        targetCapacity: '12,000 Hectares',
        targetView: 'registration',
        actionLabel: 'View Details',
      },
      {
        id: 'fac-4',
        name: 'Electric Public Transit Fleet & EV Fast-Charging Network',
        code: 'CCRP-INIT-2026-0305',
        entity: 'Department of Municipalities and Transport (DMT)',
        pillar: 'Mitigation',
        sector: 'Transport',
        status: 'Registry Update Pending',
        dataEntryStatus: 'Active',
        targetGhgReduction: '185,000 tCO₂e / yr',
        targetCapacity: '160 EV Hubs',
        targetView: 'amendments',
        actionLabel: 'View Ticket',
      },
      {
        id: 'fac-5',
        name: 'Integrated Organic Waste & Biogas Energy Recovery Program',
        code: 'CCRP-INIT-2026-0775',
        entity: 'Abu Dhabi Waste Management Centre (Tadweer)',
        pillar: 'Cross Cutting',
        sector: 'Waste Management',
        status: 'Under Review',
        dataEntryStatus: 'Active',
        targetGhgReduction: '410,000 tCO₂e / yr',
        targetCapacity: '35 MW Biogas',
        targetView: 'data-entry',
        actionLabel: 'Open Data Entry',
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
    ],
    recentActivities: [
      {
        time: '10:42 AM',
        text: 'Al Dhafra Solar PV completed 2026 Q2 performance data entry',
        badge: 'Project Data Entry',
        badgeClass: 'bg-blue-50 text-blue-700 border-blue-200/60',
        dotColor: 'bg-blue-500',
      },
      {
        time: '09:15 AM',
        text: 'Green Hydrogen Hub amendment request submitted by ADDED',
        badge: 'Amendments',
        badgeClass: 'bg-purple-50 text-purple-700 border-purple-200/60',
        dotColor: 'bg-purple-500',
      },
      {
        time: 'Yesterday',
        text: 'Electric Public Transit Fleet raised registry update ticket TCK-2026-0305-AM',
        badge: 'Amendments',
        badgeClass: 'bg-amber-50 text-amber-700 border-amber-200/60',
        dotColor: 'bg-amber-500',
      },
      {
        time: '26 Sep 2026',
        text: 'Mangrove & Blue Carbon initiative approved & published',
        badge: 'Project Registration',
        badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
        dotColor: 'bg-emerald-500',
      },
    ],
    highlights: {
      totalGhgTarget: '4.85M tCO₂e / yr',
      totalCleanCap: '2,450 MW',
      milestoneRate: '94.2%',
    },
  },

  'FY 2025–26': {
    kpis: {
      totalProjects: { value: '9', sub: '+2 registered in FY 25' },
      submittedProjects: { value: '7', total: '/ 9', sub: '78% submission rate', percent: '78%' },
      draftProjects: { value: '1', sub: '11% pending submission' },
      dataEntryProjects: { value: '5', total: '/ 9', sub: '55% monitoring active', percent: '55%' },
      pendingAmendments: { value: '1', sub: 'Completed amendment' },
    },
    monthlyDataGhg: [
      { name: 'Jan', current: 180, previous: 110 },
      { name: 'Feb', current: 240, previous: 150 },
      { name: 'Mar', current: 380, previous: 220 },
      { name: 'Apr', current: 420, previous: 280 },
      { name: 'May', current: 510, previous: 350 },
      { name: 'Jun', current: 620, previous: 410 },
      { name: 'Jul', current: 710, previous: 490 },
      { name: 'Aug', current: 750, previous: 530 },
    ],
    monthlyDataCleanEnergy: [
      { name: 'Jan', current: 200, previous: 120 },
      { name: 'Feb', current: 350, previous: 210 },
      { name: 'Mar', current: 500, previous: 300 },
      { name: 'Apr', current: 650, previous: 410 },
      { name: 'May', current: 850, previous: 520 },
      { name: 'Jun', current: 1100, previous: 680 },
      { name: 'Jul', current: 1300, previous: 790 },
      { name: 'Aug', current: 1400, previous: 850 },
    ],
    monthlyDataEfficiency: [
      { name: 'Jan', current: 2.1, previous: 1.0 },
      { name: 'Feb', current: 3.4, previous: 1.8 },
      { name: 'Mar', current: 4.6, previous: 2.5 },
      { name: 'Apr', current: 5.8, previous: 3.2 },
      { name: 'May', current: 7.0, previous: 4.0 },
      { name: 'Jun', current: 8.3, previous: 5.1 },
      { name: 'Jul', current: 9.5, previous: 6.0 },
      { name: 'Aug', current: 10.1, previous: 6.6 },
    ],
    quarterlyData: [
      { name: 'Q1', current: 800, previous: 480 },
      { name: 'Q2', current: 1550, previous: 980 },
      { name: 'Q3', current: 1980, previous: 1250 },
      { name: 'Q4 (Est)', current: 3200, previous: 2100 },
    ],
    legend: { current: 'FY 2025–26', previous: 'FY 2024–25' },
    workflow: {
      draft: 1,
      draftPct: '11.1%',
      registered: 7,
      registeredPct: '77.8%',
      dataEntry: 5,
      dataEntryPct: '55.6%',
      amendment: 1,
      amendmentPct: '11.1%',
      reported: 4,
      reportedPct: '44.4%',
      activeRate: '88.9% (8 / 9 Projects)',
    },
    pillarData: [
      { name: 'Mitigation', percent: '44%', width: '44%', color: 'bg-[#004B87]', count: 4 },
      { name: 'Adaptation', percent: '33%', width: '33%', color: 'bg-[#0284C7]', count: 3 },
      { name: 'Economic Diversification', percent: '12%', width: '12%', color: 'bg-[#8B5CF6]', count: 1 },
      { name: 'Cross Cutting', percent: '11%', width: '11%', color: 'bg-[#F59E0B]', count: 1 },
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
        targetGhgReduction: '2,400,000 tCO₂e / yr',
        targetCapacity: '2,000 MW',
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
        targetGhgReduction: '320,000 tCO₂e / yr',
        targetCapacity: '12,000 Hectares',
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
      totalGhgTarget: '3.20M tCO₂e / yr',
      totalCleanCap: '1,400 MW',
      milestoneRate: '88.0%',
    },
  },
};

export const FacilityDashboardView: React.FC = () => {
  const { setActiveView, currentRole } = useMRV();

  // Period filter state
  const [selectedPeriod, setSelectedPeriod] = useState<string>('FY 2026–27');
  const [isPeriodDropdownOpen, setIsPeriodDropdownOpen] = useState(false);

  // Metric Toggle for the chart
  const [activeChartMetric, setActiveChartMetric] = useState<'ghg' | 'cleanEnergy' | 'efficiency'>('ghg');

  const periodData = PERIOD_DATA[selectedPeriod] || PERIOD_DATA['FY 2026–27'];
  const { kpis, workflow, pillarData, projectsList, recentActivities, highlights } = periodData;

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

  const chartTitle =
    activeChartMetric === 'ghg'
      ? 'Cumulative GHG Reductions Target'
      : activeChartMetric === 'cleanEnergy'
      ? 'Clean Energy Installed Generation Capacity'
      : 'Energy Efficiency Improvement Rate';

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
    <div className="h-full flex flex-col overflow-y-auto font-sans py-1 pr-1 custom-scrollbar space-y-4 animate-fade-in">
      {/* =================================================================== */}
      {/* 1. TOP HEADER & PERIOD SELECTOR */}
      {/* =================================================================== */}
      <div className="flex-shrink-0 flex flex-wrap items-center justify-between gap-3 pb-1">
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
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
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
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
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
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
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

        {/* Card 4: Projects with Data Entry */}
        <NotchCard
          icon={<Database className="w-4 h-4 text-white" />}
          iconGradient="from-[#0284C7] to-[#0369A1]"
          iconShadow="shadow-[#0284C7]/20"
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => setActiveView('data-entry')}
        >
          <div className="flex flex-col justify-between h-full pt-1 pb-0.5">
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
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
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        {/* Left: Project Data & Decarbonization Targets Chart (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-navy-950 font-display">
                  Project Data & Decarbonization Trajectory
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Aggregated performance metrics across registered climate change initiatives
                </p>
              </div>

              {/* Metric Switcher Pills */}
              <div className="inline-flex items-center gap-1 p-0.5 bg-slate-100/90 rounded-lg text-[11px] font-semibold">
                <button
                  onClick={() => setActiveChartMetric('ghg')}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    activeChartMetric === 'ghg'
                      ? 'bg-white text-[#004B87] shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  GHG (tCO₂e)
                </button>
                <button
                  onClick={() => setActiveChartMetric('cleanEnergy')}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    activeChartMetric === 'cleanEnergy'
                      ? 'bg-white text-[#004B87] shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Clean Energy (MW)
                </button>
                <button
                  onClick={() => setActiveChartMetric('efficiency')}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    activeChartMetric === 'efficiency'
                      ? 'bg-white text-[#004B87] shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Efficiency (%)
                </button>
              </div>
            </div>

            {/* Quick Metrics Summary Strip */}
            <div className="grid grid-cols-3 gap-2 py-3 border-b border-slate-100 text-xs">
              <div className="p-2 bg-sky-50/50 rounded-xl border border-sky-100">
                <span className="text-[10.5px] font-semibold text-slate-500 block">Total Expected Reductions</span>
                <span className="text-sm font-bold text-[#004B87] mt-0.5 block">{highlights.totalGhgTarget}</span>
              </div>
              <div className="p-2 bg-emerald-50/50 rounded-xl border border-emerald-100">
                <span className="text-[10.5px] font-semibold text-slate-500 block">Clean Power Generation</span>
                <span className="text-sm font-bold text-emerald-700 mt-0.5 block">{highlights.totalCleanCap}</span>
              </div>
              <div className="p-2 bg-purple-50/50 rounded-xl border border-purple-100">
                <span className="text-[10.5px] font-semibold text-slate-500 block">Milestone Rate</span>
                <span className="text-sm font-bold text-purple-700 mt-0.5 block">{highlights.milestoneRate}</span>
              </div>
            </div>

            {/* Recharts Area Chart */}
            <div className="h-[210px] w-full pt-3">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#004B87" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#004B87" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorPrev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0284C7" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#0284C7" stopOpacity={0.0} />
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
                    formatter={(value: any) => [`${value} ${chartUnit}`, '']}
                  />
                  <Area
                    type="monotone"
                    dataKey="current"
                    name={periodData.legend.current}
                    stroke="#004B87"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorCurrent)"
                  />
                  <Area
                    type="monotone"
                    dataKey="previous"
                    name={periodData.legend.previous}
                    stroke="#94A3B8"
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    fillOpacity={1}
                    fill="url(#colorPrev)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart Legend */}
          <div className="flex items-center justify-center gap-6 pt-2 border-t border-slate-100 text-[11px] font-medium text-slate-600">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#004B87]" />
              <span>{periodData.legend.current} (Active Cycle)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-0.5 border-b-2 border-dashed border-slate-400" />
              <span>{periodData.legend.previous} (Baseline Cycle)</span>
            </div>
          </div>
        </div>

        {/* Right: Project Status Overview (Workflow Pipeline) (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-navy-950 font-display">
                  Project Status Overview
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Lifecycle progression across Climate Change modules
                </p>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                {workflow.activeRate}
              </span>
            </div>

            {/* Workflow Pipeline Progress Bars */}
            <div className="space-y-3.5 pt-3">
              {/* Step 1: Draft */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <div className="flex items-center gap-2 font-semibold text-slate-700">
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 text-[10.5px] font-bold flex items-center justify-center">
                      1
                    </span>
                    <span>Draft</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                    <span className="font-bold text-slate-800">{workflow.draft}</span>
                    <span className="text-[11px]">({workflow.draftPct})</span>
                  </div>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-400 rounded-full transition-all duration-500" style={{ width: workflow.draftPct }} />
                </div>
              </div>

              {/* Step 2: Registered / Submitted */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <div className="flex items-center gap-2 font-semibold text-slate-700">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-[#004B87] text-[10.5px] font-bold flex items-center justify-center">
                      2
                    </span>
                    <span>Registered / Submitted</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                    <span className="font-bold text-[#004B87]">{workflow.registered}</span>
                    <span className="text-[11px]">({workflow.registeredPct})</span>
                  </div>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#004B87] rounded-full transition-all duration-500" style={{ width: workflow.registeredPct }} />
                </div>
              </div>

              {/* Step 3: Data Entry */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <div className="flex items-center gap-2 font-semibold text-slate-700">
                    <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 text-[10.5px] font-bold flex items-center justify-center">
                      3
                    </span>
                    <span>Project Data Entry</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                    <span className="font-bold text-sky-700">{workflow.dataEntry}</span>
                    <span className="text-[11px]">({workflow.dataEntryPct})</span>
                  </div>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#0284C7] rounded-full transition-all duration-500" style={{ width: workflow.dataEntryPct }} />
                </div>
              </div>

              {/* Step 4: Amendment / Review */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <div className="flex items-center gap-2 font-semibold text-slate-700">
                    <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 text-[10.5px] font-bold flex items-center justify-center">
                      4
                    </span>
                    <span>Amendment / Review</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                    <span className="font-bold text-purple-700">{workflow.amendment}</span>
                    <span className="text-[11px]">({workflow.amendmentPct})</span>
                  </div>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-600 rounded-full transition-all duration-500" style={{ width: workflow.amendmentPct }} />
                </div>
              </div>

              {/* Step 5: Reported */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <div className="flex items-center gap-2 font-semibold text-slate-700">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 text-[10.5px] font-bold flex items-center justify-center">
                      5
                    </span>
                    <span>Reported & Published</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                    <span className="font-bold text-emerald-700">{workflow.reported}</span>
                    <span className="text-[11px]">({workflow.reportedPct})</span>
                  </div>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full transition-all duration-500" style={{ width: workflow.reportedPct }} />
                </div>
              </div>
            </div>
          </div>

          {/* Workflow Stage Flow Connector */}
          <div className="pt-3 mt-3 border-t border-slate-100">
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              <span>Draft</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
              <span>Registered</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
              <span>Data Entry</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
              <span>Amendment</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
              <span>Reported</span>
            </div>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 4. BOTTOM SECTION: ACTIVE CLIMATE PROJECTS & REPORTING STATUS */}
      {/* =================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 pb-2">
        {/* Active Projects Table (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="text-sm font-bold text-navy-950 font-display">
                  Active Climate Initiatives ({selectedPeriod})
                </h3>
              </div>
              <button
                onClick={() => setActiveView('registration')}
                className="text-xs font-bold text-[#004B87] hover:text-[#003d6e] flex items-center gap-1 cursor-pointer"
              >
                <span>View All Projects</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto pt-2">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                    <th className="py-2 px-2.5">Project Name & ID</th>
                    <th className="py-2 px-2.5">Lead Entity</th>
                    <th className="py-2 px-2.5">Pillar</th>
                    <th className="py-2 px-2.5">Status</th>
                    <th className="py-2 px-2.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {projectsList.map((project) => (
                    <tr key={project.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-2.5 px-2.5 font-medium">
                        <div className="text-slate-900 font-bold line-clamp-1">{project.name}</div>
                        <div className="text-[10.5px] font-mono text-slate-400 mt-0.5">{project.code}</div>
                      </td>
                      <td className="py-2.5 px-2.5 text-slate-600 line-clamp-1 max-w-[160px] truncate">
                        {project.entity}
                      </td>
                      <td className="py-2.5 px-2.5 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10.5px] font-semibold border ${getPillarBadge(
                            project.pillar
                          )}`}
                        >
                          {project.pillar}
                        </span>
                      </td>
                      <td className="py-2.5 px-2.5 whitespace-nowrap">
                        {getStatusBadge(project.status)}
                      </td>
                      <td className="py-2.5 px-2.5 text-right whitespace-nowrap">
                        <button
                          onClick={() => setActiveView(project.targetView)}
                          className="px-2.5 py-1 bg-white hover:bg-sky-50 border border-slate-200 text-[#004B87] hover:border-[#004B87] rounded-lg text-[11px] font-bold shadow-2xs transition-colors cursor-pointer inline-flex items-center gap-1"
                        >
                          <span>{project.actionLabel}</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Pillar Breakdown & Recent Activity (4 cols) */}
        <div className="lg:col-span-4 space-y-3.5">
          {/* Strategy Pillar Distribution */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4">
            <h3 className="text-sm font-bold text-navy-950 font-display mb-1">
              Strategy Pillar Distribution
            </h3>
            <p className="text-[11px] text-slate-500 mb-3">
              Abu Dhabi Climate Change Strategy project allocation
            </p>

            <div className="space-y-2.5 text-xs">
              {pillarData.map((item) => (
                <div key={item.name}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-slate-700 text-[11.5px]">{item.name}</span>
                    <span className="font-bold text-slate-800 text-[11.5px]">
                      {item.count} projects ({item.percent})
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full`} style={{ width: item.width }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity Stream */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4">
            <h3 className="text-sm font-bold text-navy-950 font-display mb-1">
              Recent Activity Feed
            </h3>
            <p className="text-[11px] text-slate-500 mb-3">
              Latest statutory submissions and amendment actions
            </p>

            <div className="space-y-3">
              {recentActivities.map((act, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs">
                  <span className={`w-2 h-2 rounded-full ${act.dotColor} shrink-0 mt-1.5`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-800 font-medium leading-snug line-clamp-2">{act.text}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-slate-400">{act.time}</span>
                      <span className={`px-1.5 py-0.2 rounded text-[10px] font-semibold border ${act.badgeClass}`}>
                        {act.badge}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacilityDashboardView;
