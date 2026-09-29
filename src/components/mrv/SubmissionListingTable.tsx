import React, { useState, useMemo } from 'react';
import {
  Eye,
  Edit3,
  Search,
  Download,
  Filter,
  ArrowUpDown,
  Calendar,
  Layers,
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle2,
  Clock,
  RotateCcw,
  Check,
  ChevronDown,
  Building2,
  Lock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useMRV } from '../../context/MRVContext';
import { CCRP_APPROVED_INITIATIVES, INITIAL_FACILITY_EMISSIONS } from '../../data/facilityEmissionsData';

export interface SubmissionListingTableProps {
  title?: string;
  subtitle?: string;
  onViewRecord?: (record: any) => void;
  onEditRecord?: (record: any) => void;
  hideHeader?: boolean;
}

export const SubmissionListingTable: React.FC<SubmissionListingTableProps> = ({
  title = 'Initiatives & Periodic Report Submissions',
  subtitle = 'Central registry of all Climate Change project reporting records, EAD review determinations, and compliance statuses',
  onViewRecord,
  onEditRecord,
  hideHeader = false,
}) => {
  const {
    openReadOnlyViewer,
    setActiveView,
    setActiveFacilityId,
    facilityEmissions,
    facilityRegistrations,
  } = useMRV();

  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState('');

  // Sorting state
  const [sortKey, setSortKey] = useState<string>('lastUpdated');
  const [sortAsc, setSortAsc] = useState(false);

  // Toast / Export notice
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Derive rows from CCRP Approved Initiatives joined with facilityEmissions / registration data
  const projectReportRecords = useMemo(() => {
    return CCRP_APPROVED_INITIATIVES.map((init, index) => {
      const emData = facilityEmissions[init.id] || INITIAL_FACILITY_EMISSIONS[init.id] || {};
      const regData = facilityRegistrations[init.id] || {};

      const workflowStatus =
        emData.workflowStatus ||
        (init.id === 'fac-1'
          ? 'Submitted'
          : init.id === 'fac-2'
          ? 'Draft'
          : init.id === 'fac-3'
          ? 'Submitted'
          : init.id === 'fac-4'
          ? 'Draft'
          : init.id === 'fac-5'
          ? 'Approved / Published'
          : init.id === 'fac-6'
          ? 'Returned for Correction'
          : 'Draft');

      const isEditable = workflowStatus === 'Draft' || workflowStatus === 'Returned for Correction';
      const correctionDeadline =
        workflowStatus === 'Returned for Correction'
          ? (emData.eadCorrectionDate || '30-Jun-2026')
          : '—';

      const lastUpdated =
        emData.updatedDate || emData.submittedDate || '18-Mar-2026';

      const reportingPeriod =
        emData.progressReportPeriod ||
        (init.cadence === 'Quarterly' ? 'Q1' : 'Semiannual 1 (H1)');

      return {
        id: init.id,
        projectId: init.initiativeCode || `CCRP-INIT-2026-000${index + 1}`,
        projectName: init.name,
        entity: init.entity,
        pillar: init.pillar,
        cadence: init.cadence,
        period: reportingPeriod,
        version: emData.version || 'V1',
        lastUpdated,
        status: workflowStatus,
        correctionDeadline,
        isEditable,
        plannedProgress: emData.plannedProgress ?? 75,
        actualProgress: emData.actualProgress ?? 68,
        plannedGhg: emData.plannedGhgReduction || '—',
        actualGhg: emData.actualAnnualEmissionReduction || '—',
        challenges: emData.challenges || '',
        budget: emData.budget || '—',
      };
    });
  }, [facilityEmissions, facilityRegistrations]);

  // Filtered reports based on Search across all fields
  const filteredSubmissions = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return projectReportRecords;
    return projectReportRecords.filter((sub) => {
      return (
        sub.projectId.toLowerCase().includes(q) ||
        sub.projectName.toLowerCase().includes(q) ||
        sub.entity.toLowerCase().includes(q) ||
        sub.pillar.toLowerCase().includes(q) ||
        sub.cadence.toLowerCase().includes(q) ||
        sub.period.toLowerCase().includes(q) ||
        sub.status.toLowerCase().includes(q) ||
        sub.version.toLowerCase().includes(q) ||
        sub.lastUpdated.toLowerCase().includes(q)
      );
    });
  }, [projectReportRecords, searchQuery]);

  // Sorted submissions
  const sortedSubmissions = useMemo(() => {
    return [...filteredSubmissions].sort((a: any, b: any) => {
      let aVal = a[sortKey];
      let bVal = b[sortKey];

      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();

      if (aVal < bVal) return sortAsc ? -1 : 1;
      if (aVal > bVal) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [filteredSubmissions, sortKey, sortAsc]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const handleExport = (format: 'CSV' | 'Excel') => {
    setExportNotice(`Exporting ${filteredSubmissions.length} project reports to ${format}...`);
    setTimeout(() => {
      setExportNotice(null);
    }, 3000);
  };

  const handleView = (sub: any) => {
    setActiveFacilityId(sub.id);
    if (onViewRecord) {
      onViewRecord(sub);
    } else {
      openReadOnlyViewer({
        moduleType: 'full-dossier',
        recordId: sub.projectId,
        title: `${sub.projectName} — Performance Report`,
        status: sub.status,
        reportingYear: 2026,
        version: 1,
      });
    }
  };

  const handleEdit = (sub: any) => {
    setActiveFacilityId(sub.id);
    if (onEditRecord) {
      onEditRecord(sub);
    } else {
      setActiveView('annual-emission-data');
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved / Published':
      case 'Approved':
        return (
          <span className="px-3 py-1 rounded-full font-bold text-[11px] bg-[#E8F8F0] text-[#16A34A] border border-emerald-200/60 inline-block min-w-[125px] text-center">
            Approved / Published
          </span>
        );
      case 'Under Review':
      case 'Under EAD Review':
        return (
          <span className="px-3 py-1 rounded-full font-semibold text-[11px] bg-[#E0EEFA] text-[#0284C7] border border-sky-200/60 inline-block min-w-[95px] text-center">
            Under Review
          </span>
        );
      case 'Returned for Correction':
      case 'Correction Required':
        return (
          <span className="px-2.5 py-1 rounded-full font-bold text-[11px] bg-[#FEF3C7] text-[#92400E] border border-amber-300/80 inline-block min-w-[145px] text-center">
            Returned for Correction
          </span>
        );
      case 'Submitted':
        return (
          <span className="px-3 py-1 rounded-full font-semibold text-[11px] bg-[#E0EEFA] text-[#0284C7] border border-sky-200/60 inline-block min-w-[85px] text-center">
            Submitted
          </span>
        );
      case 'Draft':
        return (
          <span className="px-3 py-1 rounded-full font-semibold text-[11px] bg-slate-100 text-slate-600 border border-slate-300 inline-block min-w-[75px] text-center">
            Draft
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full font-semibold text-[11px] bg-slate-100 text-slate-700 border border-slate-200 inline-block text-center">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col font-sans">
      {/* ------------------------------------------------------------------------- */}
      {/* 1. TABLE HEADER & TITLE SECTION                                           */}
      {/* ------------------------------------------------------------------------- */}
      {/* ------------------------------------------------------------------------- */}
      {/* 1. TABLE HEADER ROW (Title on Left, Search Bar & Export on Right)          */}
      {/* ------------------------------------------------------------------------- */}
      {!hideHeader && (
        <div className="p-3.5 sm:p-4 pb-1 sm:pb-1 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xs sm:text-[13px] font-bold text-slate-800 tracking-tight whitespace-nowrap">
            {title}
          </h2>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Search Box */}
            <div className="relative min-w-[220px] sm:min-w-[280px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by Project ID, Initiative Name, Entity, Pillar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-7 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#004B87] transition-all font-medium h-9"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
                >
                  ×
                </button>
              )}
            </div>

            {exportNotice && (
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 animate-fade-in flex items-center gap-1 h-9">
                <Check className="w-3.5 h-3.5" />
                {exportNotice}
              </span>
            )}
            <button
              onClick={() => handleExport('Excel')}
              className="h-9 px-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs border border-slate-200/80 whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>Export Excel</span>
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------------- */}
      {/* 2. SUBMISSION OVERVIEW TABLE WITH STICKY FIRST & LAST COLUMNS              */}
      {/* ------------------------------------------------------------------------- */}
      <div className="p-3.5 sm:p-4 pt-1 sm:pt-1.5">
        <div className="overflow-x-auto rounded-xl border border-slate-200/90 bg-white">
          <table className="w-full text-left text-xs border-collapse min-w-[1100px]">
            <thead>
              <tr className="bg-[#E9F1F8] text-slate-700 font-semibold text-xs border-b border-slate-200 sticky top-0 z-10 shadow-xs">
                {/* 1. Project ID (Sticky Left Column) */}
                <th
                  onClick={() => handleSort('projectId')}
                  className="sticky left-0 z-20 bg-[#E9F1F8] py-3.5 px-3.5 cursor-pointer hover:bg-slate-200/60 transition-colors whitespace-nowrap shadow-[2px_0_4px_-1px_rgba(0,0,0,0.06)] border-r border-slate-200/80 min-w-[130px]"
                >
                  <div className="flex items-center gap-1">
                    <span>Project ID</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>

                {/* 2. Project / Initiative Name */}
                <th
                  onClick={() => handleSort('projectName')}
                  className="py-3.5 px-3.5 cursor-pointer hover:bg-slate-200/60 transition-colors min-w-[200px]"
                >
                  <div className="flex items-center gap-1">
                    <span>Project / Initiative Name</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>

                {/* 3. Lead Entity */}
                <th
                  onClick={() => handleSort('entity')}
                  className="py-3.5 px-3.5 cursor-pointer hover:bg-slate-200/60 transition-colors min-w-[160px]"
                >
                  <div className="flex items-center gap-1">
                    <span>Lead Entity</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>

                {/* 4. Pillar */}
                <th
                  onClick={() => handleSort('pillar')}
                  className="py-3.5 px-3.5 cursor-pointer hover:bg-slate-200/60 transition-colors whitespace-nowrap"
                >
                  <div className="flex items-center gap-1">
                    <span>Pillar</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>

                {/* 5. Cadence */}
                <th
                  onClick={() => handleSort('cadence')}
                  className="py-3.5 px-3 text-center cursor-pointer hover:bg-slate-200/60 transition-colors whitespace-nowrap"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>Cadence</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>

                {/* 6. Reporting Period */}
                <th
                  onClick={() => handleSort('period')}
                  className="py-3.5 px-3 text-center cursor-pointer hover:bg-slate-200/60 transition-colors whitespace-nowrap"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>Period</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>

                {/* 7. Version */}
                <th
                  onClick={() => handleSort('version')}
                  className="py-3.5 px-3 text-center cursor-pointer hover:bg-slate-200/60 transition-colors whitespace-nowrap"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>Version</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>

                {/* 8. Last Updated */}
                <th
                  onClick={() => handleSort('lastUpdated')}
                  className="py-3.5 px-3.5 cursor-pointer hover:bg-slate-200/60 transition-colors whitespace-nowrap"
                >
                  <div className="flex items-center gap-1">
                    <span>Last Updated</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>

                {/* 9. Review Status */}
                <th
                  onClick={() => handleSort('status')}
                  className="py-3.5 px-3.5 cursor-pointer hover:bg-slate-200/60 transition-colors whitespace-nowrap"
                >
                  <div className="flex items-center gap-1">
                    <span>Submission Status</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>

                {/* 10. Correction Deadline */}
                <th className="py-3.5 px-3.5 whitespace-nowrap">
                  <span>Correction Deadline</span>
                </th>

                {/* 11. Actions (Sticky Right Column) */}
                <th className="sticky right-0 z-20 bg-[#E9F1F8] py-3.5 px-4 text-center whitespace-nowrap shadow-[-2px_0_4px_-1px_rgba(0,0,0,0.06)] border-l border-slate-200/80 min-w-[90px]">
                  <span>Actions</span>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {sortedSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-8 text-center text-slate-400 font-semibold">
                    No Climate Change project records match the search criteria.
                  </td>
                </tr>
              ) : (
                sortedSubmissions.map((row, idx) => {
                  const isCorrectionRequired = row.status === 'Returned for Correction' || row.status === 'Correction Required';

                  return (
                    <tr key={row.id} className={`${idx % 2 === 1 ? 'bg-slate-50/80' : 'bg-white'} hover:bg-[#EBF3FA] transition-colors group cursor-default`}>
                      {/* 1. Project ID (Sticky Left Column) */}
                      <td className={`sticky left-0 z-10 ${idx % 2 === 1 ? 'bg-slate-50' : 'bg-white'} group-hover:bg-[#EBF3FA] py-3.5 px-3.5 font-mono font-bold text-[#004B87] text-xs whitespace-nowrap shadow-[2px_0_4px_-1px_rgba(0,0,0,0.06)] border-r border-slate-200/80 transition-colors`}>
                        {row.projectId}
                      </td>

                      {/* 2. Project Name */}
                      <td className="py-3.5 px-3.5 font-semibold text-slate-800 min-w-[200px]">
                        <span>{row.projectName}</span>
                      </td>

                      {/* 3. Lead Entity */}
                      <td className="py-3.5 px-3.5 text-slate-600 min-w-[160px]">
                        {row.entity}
                      </td>

                      {/* 4. Pillar */}
                      <td className="py-3.5 px-3.5 whitespace-nowrap">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold border ${getPillarBadge(row.pillar)}`}>
                          {row.pillar}
                        </span>
                      </td>

                      {/* 5. Cadence */}
                      <td className="py-3.5 px-3 text-center font-medium text-slate-700 whitespace-nowrap">
                        <span className="px-2 py-0.5 bg-slate-100 rounded text-[11px] font-semibold text-slate-600">
                          {row.cadence}
                        </span>
                      </td>

                      {/* 6. Period */}
                      <td className="py-3.5 px-3 text-center text-slate-600 whitespace-nowrap font-medium">
                        {row.period}
                      </td>

                      {/* 7. Version */}
                      <td className="py-3.5 px-3 text-center font-mono text-slate-600 whitespace-nowrap font-bold">
                        {row.version}
                      </td>

                      {/* 8. Last Updated */}
                      <td className="py-3.5 px-3.5 text-slate-600 text-xs whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{row.lastUpdated}</span>
                        </div>
                      </td>

                      {/* 9. Review Status */}
                      <td className="py-3.5 px-3.5 text-left whitespace-nowrap">
                        {getStatusBadge(row.status)}
                      </td>

                      {/* 10. Correction Deadline */}
                      <td className="py-3.5 px-3.5 whitespace-nowrap text-slate-600">
                        {isCorrectionRequired ? (
                          <div className="flex items-center gap-1.5 text-amber-700 font-semibold text-[11px]">
                            <Calendar className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            <span>{row.correctionDeadline || '30-Jun-2026'}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 font-medium pl-2">—</span>
                        )}
                      </td>

                      {/* 11. Actions (Sticky Right Column) */}
                      <td className={`sticky right-0 z-10 ${idx % 2 === 1 ? 'bg-slate-50' : 'bg-white'} group-hover:bg-[#EBF3FA] py-3.5 px-4 text-center whitespace-nowrap shadow-[-2px_0_4px_-1px_rgba(0,0,0,0.06)] border-l border-slate-200/80 transition-colors`}>
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleView(row)}
                            title="View Project Report Dossier"
                            className="p-1.5 rounded-lg text-slate-600 hover:text-[#004B87] hover:bg-[#004B87]/10 transition-colors cursor-pointer border border-transparent hover:border-[#004B87]/20"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {isCorrectionRequired && (
                            <button
                              onClick={() => handleEdit(row)}
                              title="Edit Correction Data"
                              className="p-1.5 rounded-lg text-amber-600 hover:text-amber-800 hover:bg-amber-100/60 transition-colors cursor-pointer border border-transparent hover:border-amber-300"
                            >
                              <Edit3 className="w-4 h-4" />
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
      </div>

      {/* ------------------------------------------------------------------------- */}
      {/* 4. TABLE FOOTER / RECORD COUNTER                                          */}
      {/* ------------------------------------------------------------------------- */}
      <div className="p-3.5 sm:p-4 bg-[#F8FAFC] border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 font-medium">
        <div>
          Showing <span className="font-bold text-slate-800">{sortedSubmissions.length}</span> of{' '}
          <span className="font-bold text-slate-800">{projectReportRecords.length}</span> Total Registered Initiatives
        </div>
        <div className="flex flex-wrap items-center gap-4 text-[11px]">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A]" /> Approved / Published
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0284C7]" /> Under Review
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]" /> Returned for Correction
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0284C7]" /> Submitted
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400" /> Draft
          </span>
        </div>
      </div>
    </div>
  );
};
export default SubmissionListingTable;
