export interface PerformanceReportData {
  initiativeName: string;
  initiativeId: string;
  entity: string;
  pillar: 'Adaptation' | 'Mitigation' | 'Economic Diversification' | 'Cross Cutting';
  reportingCadence: 'Quarterly' | 'Semiannual' | 'Annual' | string;

  // Step 1: Report Details
  progressReportPeriod: string;
  projectPhase: 'Design' | 'Implementation' | 'Operation';
  status: 'Not Started' | 'In Progress' | 'On Hold' | 'Completed';
  workflowStatus: 'Draft' | 'Submitted' | 'Under EAD Review' | 'Approved / Published' | 'Returned for Correction' | string;

  // Step 2: Progress & Project Data
  plannedProgress: number | string;
  actualProgress: number | string;
  budget?: string | number;
  budgetType?: string;
  budgetStatus?: string;
  challenges?: string;
  raiseToCommittee?: 'Yes' | 'No' | boolean;
  activitiesOutcomesOutput?: string;
  comments?: string;

  // Step 3: GHG Emissions
  plannedGhgReduction?: number | string;
  actualAnnualEmissionReduction?: number | string;

  // Step 4: Supporting Documents & Submit
  supportingDocsFiles: { id: string; name: string; size: string; uploadDate: string }[];

  // Meta / Timestamps / Workflow
  submittedDate: string | null;
  updatedDate: string | null;
  eadCorrectionDate: string | null;
  reviewerComments?: string;
  reviewedDate?: string;
  version?: string;

  // Backwards compatibility aliases
  generalRemarks?: string;
  declarationConfirmed?: boolean;
  facilityName?: string;
  facilityId?: string;
  operatorName?: string;
  reportingYear?: string;
  totalEmissions?: string;
  totalScope1?: string;
  businessSector?: string;
  projectSector?: string;
  primaryActivity?: string;
  operationalStatus?: string;
  monitoringPlanRef?: string;
  monitoringMethods?: any;
  mitigationMeasures?: any[];
  mitigationAdditionalInfo?: string;
  qaVerificationDesc?: string;
  qaFurtherDetails?: string;
  qaDataGaps?: any[];
  qaManagementResp?: any[];
  qaProcedures?: any[];
  qaDiagramFiles?: any[];
  internalReviewProcedures?: any[];
  internalReviewFiles?: any[];
  declarationChecks?: any;
  declarationForm?: any;
  isNew?: boolean;
}

export const CCRP_PROJECT_PHASES = [
  'Design',
  'Implementation',
  'Operation',
] as const;

export const CCRP_REPORT_STATUSES = [
  'Not Started',
  'In Progress',
  'On Hold',
  'Completed',
] as const;

export const CCRP_BUDGET_TYPES = [
  'Capex',
  'Opex',
] as const;

export const CCRP_BUDGET_STATUSES = [
  'Available',
  'Not Available',
] as const;

export const CCRP_PILLARS = [
  'Adaptation',
  'Mitigation',
  'Economic Diversification',
  'Cross Cutting',
] as const;

export const CCRP_PROGRESS_REPORT_PERIODS = ['Q1', 'Q2', 'Q3', 'Q4'] as const;

export const CCRP_REPORTING_PERIODS_BY_CADENCE: Record<string, string[]> = {
  Semiannual: ['Q1', 'Q2', 'Q3', 'Q4'],
  Quarterly: ['Q1', 'Q2', 'Q3', 'Q4'],
  Annual: ['Q1', 'Q2', 'Q3', 'Q4'],
};

export const getReportingPeriodsForCadence = (_cadence?: string): string[] => {
  return ['Q1', 'Q2', 'Q3', 'Q4'];
};

export const CCRP_REPORTING_PERIODS_BY_PILLAR: Record<string, string[]> = {
  Adaptation: ['Q1', 'Q2', 'Q3', 'Q4'],
  Mitigation: ['Q1', 'Q2', 'Q3', 'Q4'],
  'Economic Diversification': ['Q1', 'Q2', 'Q3', 'Q4'],
  'Cross Cutting': ['Q1', 'Q2', 'Q3', 'Q4'],
};

export interface CCRPApprovedInitiative {
  id: string;
  initiativeCode: string;
  name: string;
  entity: string;
  pillar: 'Adaptation' | 'Mitigation' | 'Economic Diversification' | 'Cross Cutting';
  cadence: 'Quarterly' | 'Semiannual' | 'Annual' | string;
  sector: string;
  strategicObjective: string;
  startDate: string;
  endDate: string;
  status: 'Approved' | 'Approved / Published';
}

export const CCRP_APPROVED_INITIATIVES: CCRPApprovedInitiative[] = [
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
];

export const INITIAL_FACILITY_EMISSIONS: Record<string, PerformanceReportData> = {
  'fac-1': {
    initiativeName: 'Al Dhafra Solar PV Decarbonization Program',
    initiativeId: 'CCRP-INIT-2026-7073',
    entity: 'Department of Energy (DoE)',
    pillar: 'Mitigation',
    reportingCadence: 'Semiannual',
    progressReportPeriod: 'Q1',
    projectPhase: 'Implementation',
    status: 'In Progress',
    workflowStatus: 'Submitted',
    plannedProgress: 75,
    actualProgress: 68,
    budget: 'AED 3,200,000,000',
    budgetType: 'Capex',
    budgetStatus: 'Available',
    challenges: 'Supply chain lead-time delays for specialized grid interconnection sub-station modules.',
    raiseToCommittee: 'No',
    activitiesOutcomesOutput: 'Successfully completed PV array installation for Block C (600MW). Telemetry links integrated with ADDC dispatch center.',
    comments: 'Phase 2 commissioning test scheduled for Q3 with DoE inspection team.',
    plannedGhgReduction: '142,800',
    actualAnnualEmissionReduction: '138,500',
    supportingDocsFiles: [
      { id: 'doc-1', name: 'Al_Dhafra_Solar_Progress_Verification_H1_2026.pdf', size: '2.4 MB', uploadDate: '14-Mar-2026' },
      { id: 'doc-2', name: 'Clean_Power_Output_Telemetry_Summary_2026.pdf', size: '1.8 MB', uploadDate: '14-Mar-2026' },
    ],
    submittedDate: '14-Mar-2026',
    updatedDate: '18-Mar-2026',
    eadCorrectionDate: null,
    version: 'V1',

    // Backwards compatibility aliases
    facilityName: 'Al Dhafra Solar PV Decarbonization Program',
    facilityId: 'CCRP-INIT-2026-7073',
    operatorName: 'Department of Energy (DoE)',
    reportingYear: '2026',
    totalEmissions: '142,800',
    totalScope1: '138,500',
    businessSector: 'Energy',
    primaryActivity: 'Solar PV Renewable Power Generation',
    operationalStatus: 'Operational',
    monitoringPlanRef: 'CCRP-PLAN-2026-7073',
  },
  'fac-2': {
    initiativeName: 'Low-Carbon Industrial Transition & Green Hydrogen Hub',
    initiativeId: 'CCRP-INIT-2026-0118',
    entity: 'Abu Dhabi Department of Economic Development (ADDED)',
    pillar: 'Economic Diversification',
    reportingCadence: 'Semiannual',
    progressReportPeriod: 'Q1',
    projectPhase: 'Design',
    status: 'In Progress',
    workflowStatus: 'Draft',
    plannedProgress: 35,
    actualProgress: 30,
    budget: 'AED 540,000,000',
    budgetType: 'Capex',
    budgetStatus: 'Available',
    challenges: 'International technology licensing negotiations for large-scale alkaline electrolyzer stacks.',
    raiseToCommittee: 'Yes',
    activitiesOutcomesOutput: 'Front-End Engineering Design (FEED) completed for 100MW pilot electrolyzer facility in Ruwais industrial zone.',
    comments: 'Commercial agreements pending final review by Ministry of Industry and Advanced Technology (MoIAT).',
    plannedGhgReduction: '',
    actualAnnualEmissionReduction: '',
    supportingDocsFiles: [
      { id: 'doc-4', name: 'Green_Hydrogen_Electrolyzer_FEED_Study.pdf', size: '5.2 MB', uploadDate: '01-Mar-2026' },
    ],
    submittedDate: null,
    updatedDate: '16-Mar-2026',
    eadCorrectionDate: null,
    version: 'V1',

    facilityName: 'Low-Carbon Industrial Transition & Green Hydrogen Hub',
    facilityId: 'CCRP-INIT-2026-0118',
    operatorName: 'Abu Dhabi Department of Economic Development (ADDED)',
    reportingYear: '2026',
    totalEmissions: '0',
    totalScope1: '0',
    businessSector: 'Industry & Manufacturing',
    primaryActivity: 'Clean Hydrogen Production & Decarbonization',
    operationalStatus: 'Design Stage',
    monitoringPlanRef: 'CCRP-PLAN-2026-0118',
  },
  'fac-3': {
    initiativeName: 'Abu Dhabi Mangrove & Blue Carbon Coastal Restoration',
    initiativeId: 'CCRP-INIT-2026-0422',
    entity: 'Environment Agency – Abu Dhabi (EAD)',
    pillar: 'Adaptation',
    reportingCadence: 'Quarterly',
    progressReportPeriod: 'Q1',
    projectPhase: 'Implementation',
    status: 'In Progress',
    workflowStatus: 'Submitted',
    plannedProgress: 50,
    actualProgress: 52,
    budget: 'AED 85,000,000',
    budgetType: 'Capex',
    budgetStatus: 'Available',
    challenges: 'High tidal surges in Marawah Marine Biosphere Reserve delayed access to remote planting sites.',
    raiseToCommittee: 'No',
    activitiesOutcomesOutput: 'Planted over 1.2 million mangrove saplings across coastal lagoons with 94% seedling survival rate.',
    comments: 'Drone seed-dispersal methodology expanded to Eastern Mangroves sector.',
    plannedGhgReduction: '',
    actualAnnualEmissionReduction: '',
    supportingDocsFiles: [
      { id: 'doc-3', name: 'Mangrove_Seedling_Survival_Survey_Q1_2026.pdf', size: '3.1 MB', uploadDate: '15-Mar-2026' },
    ],
    submittedDate: '15-Mar-2026',
    updatedDate: '15-Mar-2026',
    eadCorrectionDate: null,
    version: 'V1',

    facilityName: 'Abu Dhabi Mangrove & Blue Carbon Coastal Restoration',
    facilityId: 'CCRP-INIT-2026-0422',
    operatorName: 'Environment Agency – Abu Dhabi (EAD)',
    reportingYear: '2026',
    totalEmissions: '0',
    totalScope1: '0',
    businessSector: 'Coastal & Marine Ecosystems',
    primaryActivity: 'Coastal Nature-Based Solution & Carbon Sinks',
    operationalStatus: 'Operational',
    monitoringPlanRef: 'CCRP-PLAN-2026-0422',
  },
  'fac-4': {
    initiativeName: 'Electric Public Transit Fleet & EV Fast-Charging Network',
    initiativeId: 'CCRP-INIT-2026-0305',
    entity: 'Integrated Transport Centre (ITC)',
    pillar: 'Mitigation',
    reportingCadence: 'Semiannual',
    progressReportPeriod: 'Q1',
    projectPhase: 'Implementation',
    status: 'In Progress',
    workflowStatus: 'Draft',
    plannedProgress: 60,
    actualProgress: 55,
    budget: 'AED 120,000,000',
    budgetType: 'Opex',
    budgetStatus: 'Available',
    challenges: 'Power capacity upgrades required for high-density depot fast chargers in Mussafah.',
    raiseToCommittee: 'No',
    activitiesOutcomesOutput: 'Deployment of 120 fast EV charging hubs and commissioning of 45 electric buses in municipal fleet.',
    comments: 'Coordination underway with DMT for right-of-way permissions in Al Ain region.',
    plannedGhgReduction: '24,000',
    actualAnnualEmissionReduction: '21,500',
    supportingDocsFiles: [],
    submittedDate: null,
    updatedDate: '20-Mar-2026',
    eadCorrectionDate: null,
    version: 'V1',

    facilityName: 'Electric Public Transit Fleet & EV Fast-Charging Network',
    facilityId: 'CCRP-INIT-2026-0305',
    operatorName: 'Integrated Transport Centre (ITC)',
    reportingYear: '2026',
    totalEmissions: '24,000',
    totalScope1: '21,500',
    businessSector: 'Transport',
    primaryActivity: 'Electric Mobility & Charging Infrastructure',
    operationalStatus: 'Operational',
    monitoringPlanRef: 'CCRP-PLAN-2026-0305',
  },
  'fac-5': {
    initiativeName: 'Integrated Organic Waste & Biogas Energy Recovery Program',
    initiativeId: 'CCRP-INIT-2026-0775',
    entity: 'Abu Dhabi Waste Management Centre (Tadweer)',
    pillar: 'Cross Cutting',
    reportingCadence: 'Semiannual',
    progressReportPeriod: 'Q1',
    projectPhase: 'Implementation',
    status: 'Completed',
    workflowStatus: 'Approved',
    plannedProgress: 100,
    actualProgress: 100,
    budget: 'AED 180,000,000',
    budgetType: 'Capex',
    budgetStatus: 'Available',
    challenges: 'None — Project successfully completed and commissioned.',
    raiseToCommittee: 'No',
    activitiesOutcomesOutput: 'Full anaerobic digestion train operational; diverted 45,000 tonnes of organic waste in H1.',
    comments: 'Commercial operations running at peak efficiency.',
    plannedGhgReduction: '38,500',
    actualAnnualEmissionReduction: '41,200',
    supportingDocsFiles: [],
    submittedDate: '22-Jan-2026',
    updatedDate: '28-Jan-2026',
    eadCorrectionDate: null,
    version: 'V1',

    facilityName: 'Integrated Organic Waste & Biogas Energy Recovery Program',
    facilityId: 'CCRP-INIT-2026-0775',
    operatorName: 'Abu Dhabi Waste Management Centre (Tadweer)',
    reportingYear: '2026',
    totalEmissions: '38,500',
    totalScope1: '41,200',
    businessSector: 'Waste Management',
    primaryActivity: 'Organic Waste Anaerobic Digestion & Biogas Recovery',
    operationalStatus: 'Operational',
    monitoringPlanRef: 'CCRP-PLAN-2026-0775',
  },
  'fac-6': {
    initiativeName: 'Climate Resilient Urban Infrastructure & Stormwater Drainage Upgrade',
    initiativeId: 'CCRP-INIT-2026-0619',
    entity: 'Department of Municipalities and Transport (DMT)',
    pillar: 'Adaptation',
    reportingCadence: 'Quarterly',
    progressReportPeriod: 'Q1',
    projectPhase: 'Implementation',
    status: 'In Progress',
    workflowStatus: 'Returned for Correction',
    plannedProgress: 45,
    actualProgress: 40,
    budget: 'AED 95,000,000',
    budgetType: 'Capex',
    budgetStatus: 'Not Available',
    challenges: 'Hydrological modelling adjustments requested by EAD technical review committee.',
    raiseToCommittee: 'No',
    activitiesOutcomesOutput: 'Upgraded 12km of arterial stormwater channels in Mussafah and Shakhbout City.',
    comments: 'Resubmitting revised milestone projections following hydrological model update.',
    plannedGhgReduction: '',
    actualAnnualEmissionReduction: '',
    supportingDocsFiles: [],
    submittedDate: '18-Feb-2026',
    updatedDate: '24-Feb-2026',
    eadCorrectionDate: '30-Jun-2026',
    reviewerComments: 'Please provide updated hydrological flood-risk model attachments and revised phase milestone dates.',
    version: 'V1',

    facilityName: 'Climate Resilient Urban Infrastructure & Stormwater Drainage Upgrade',
    facilityId: 'CCRP-INIT-2026-0619',
    operatorName: 'Department of Municipalities and Transport (DMT)',
    reportingYear: '2026',
    totalEmissions: '0',
    totalScope1: '0',
    businessSector: 'Infrastructure & Built Environment',
    primaryActivity: 'Urban Stormwater & Drainage Climate Resilience',
    operationalStatus: 'Operational',
    monitoringPlanRef: 'CCRP-PLAN-2026-0619',
  },
  'fac-7': {
    initiativeName: 'Agricultural Water Efficiency & Smart Irrigation Program',
    initiativeId: '',
    entity: 'Abu Dhabi Agriculture and Food Safety Authority (ADAFSA)',
    pillar: 'Adaptation',
    reportingCadence: 'Quarterly',
    progressReportPeriod: 'Q1',
    projectPhase: 'Implementation',
    status: 'In Progress',
    workflowStatus: 'Draft',
    plannedProgress: 25,
    actualProgress: 20,
    budget: 'AED 45,000,000',
    budgetType: 'Opex',
    budgetStatus: 'Available',
    challenges: 'Smart IoT probe calibration tests in desert agricultural terrain.',
    raiseToCommittee: 'No',
    activitiesOutcomesOutput: 'Pilot setup across 80 farms in Al Ain region.',
    comments: 'Preparing data submission for initial performance cycle.',
    plannedGhgReduction: '',
    actualAnnualEmissionReduction: '',
    supportingDocsFiles: [],
    submittedDate: null,
    updatedDate: '12-Feb-2026',
    eadCorrectionDate: null,
    version: 'V1',

    facilityName: 'Agricultural Water Efficiency & Smart Irrigation Program',
    facilityId: '',
    operatorName: 'Abu Dhabi Agriculture and Food Safety Authority (ADAFSA)',
    reportingYear: '2026',
    totalEmissions: '0',
    totalScope1: '0',
    businessSector: 'Agriculture, Forestry & Land Use (AFOLU)',
    primaryActivity: 'Precision Smart Irrigation & Water Conservation',
    operationalStatus: 'Operational',
    monitoringPlanRef: '',
  },
};
