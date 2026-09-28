export interface FacilityRegistrationVersionSnapshot {
  version: string;
  status: string;
  updatedDate: string;
  submittedDate: string;
  isCurrent?: boolean;
  data: Record<string, any>;
}

export interface CCRPProjectRegistration {
  // Step 1: Project Details
  // Section 1: Project Information
  initiativeName: string;
  description: string;

  // Section 2: Entity Information
  entity: string;
  supportingEntity: string;
  subEntity: string;
  scope: string;
  scopeOther?: string;

  // Step 2: Project Classification & Timeline
  // Section: Project Classification
  projectSector: string;
  typeOfInitiative: string;
  initiativeTypeOther?: string;
  initiativeSource: string;
  strategicObjective: string;
  strategicObjectiveOther?: string;
  pillar: string;

  // Section: Indicators and targets 2023-2027
  indicatorsAndTargets: string[];
  indicatorsAndTargetsOther?: string;

  // Section: Project Manager
  projectManagerName: string;
  projectManagerContactDetails: string;

  // Section: Project Timeline
  startDate: string;
  endDate: string;

  // Metadata & Workflow Status
  initiativeId: string;
  version: string;
  status: 'Draft' | 'Submitted' | 'Under EAD Review' | 'Approved / Published' | 'Returned for Correction' | 'Approved';
  submittedDate: string;
  updatedDate: string;
  reviewedDate?: string;
  reviewerComments?: string;
  correctionDeadlineDate?: string | null;
  generalRemarks?: string;

  // Backward compatibility aliases
  facilityName?: string;
  facilityId?: string;
  operatorName?: string;
}

export const BLANK_FACILITY_REGISTRATION: CCRPProjectRegistration = {
  // Step 1: Project Details
  initiativeName: 'Al Dhafra Solar PV Decarbonization Program',
  description:
    'Comprehensive utility-scale 2GW solar photovoltaic deployment in Al Dhafra region to supply clean power to the Abu Dhabi electrical grid and displace gas-fired power generation.',
  entity: 'Department of Energy (DoE)',
  supportingEntity: 'TAQA (Abu Dhabi National Energy Company)',
  subEntity: 'Clean & Renewable Energy Directorate',
  scope: 'Abu Dhabi Emirate',
  scopeOther: '',

  // Step 2: Project Classification & Timeline
  projectSector: 'Energy',
  typeOfInitiative: 'Infrastructure & Capital Projects',
  initiativeTypeOther: '',
  initiativeSource: 'Abu Dhabi Climate Change Strategy 2023–2027',
  strategicObjective: 'SO1: Reduce Greenhouse Gas Emissions Across Key Economic Sectors',
  strategicObjectiveOther: '',
  pillar: 'Mitigation',
  indicatorsAndTargets: [
    'Total Annual GHG Emissions Reduction (tCO₂e / year)',
    'Renewable & Clean Energy Installed Generation Capacity (MW)',
    'Industrial & Grid Energy Efficiency Improvement (%)',
  ],
  indicatorsAndTargetsOther: '',
  projectManagerName: 'Eng. Saeed Al-Mehairbi',
  projectManagerContactDetails: '+971 2 694 4000 / saeed.mehairbi@doe.gov.ae',
  startDate: '2023-01-01',
  endDate: '2027-12-31',

  // Metadata
  initiativeId: '',
  submittedDate: '—',
  updatedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
  version: 'v1.0',
  status: 'Draft',
  correctionDeadlineDate: null,

  facilityName: 'Al Dhafra Solar PV Decarbonization Program',
  facilityId: '',
  operatorName: 'Department of Energy (DoE)',
};

export const SAMPLE_DEMO_FACILITY_REGISTRATION: CCRPProjectRegistration = {
  // Step 1
  initiativeName: 'Al Dhafra Solar PV Decarbonization Program',
  description:
    'Comprehensive utility-scale 2GW solar photovoltaic deployment in Al Dhafra region to supply clean power to the Abu Dhabi electrical grid and displace gas-fired power generation.',
  entity: 'Department of Energy (DoE)',
  supportingEntity: 'TAQA (Abu Dhabi National Energy Company)',
  subEntity: 'Clean & Renewable Energy Directorate',
  scope: 'Abu Dhabi Emirate',
  scopeOther: '',

  // Step 2
  projectSector: 'Energy',
  typeOfInitiative: 'Infrastructure & Capital Projects',
  initiativeTypeOther: '',
  initiativeSource: 'Abu Dhabi Climate Change Strategy 2023–2027',
  strategicObjective: 'SO1: Reduce Greenhouse Gas Emissions Across Key Economic Sectors',
  strategicObjectiveOther: '',
  pillar: 'Mitigation',
  indicatorsAndTargets: [
    'Total Annual GHG Emissions Reduction (tCO₂e / year)',
    'Renewable & Clean Energy Installed Generation Capacity (MW)',
    'Industrial & Grid Energy Efficiency Improvement (%)',
  ],
  indicatorsAndTargetsOther: '',
  projectManagerName: 'Eng. Saeed Al-Mehairbi',
  projectManagerContactDetails: '+971 2 694 4000 / saeed.mehairbi@doe.gov.ae',
  startDate: '2023-01-01',
  endDate: '2027-12-31',

  // Metadata
  initiativeId: '',
  submittedDate: '—',
  updatedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
  version: 'v1.0',
  status: 'Draft',
  correctionDeadlineDate: null,

  facilityName: 'Al Dhafra Solar PV Decarbonization Program',
  facilityId: '',
  operatorName: 'Department of Energy (DoE)',
};

export const INITIAL_FACILITY_REGISTRATIONS: Record<string, CCRPProjectRegistration> = {
  'fac-1': {
    initiativeName: 'Al Dhafra Solar PV Decarbonization Program',
    initiativeId: 'CCRP-INIT-2026-7073',
    description:
      'Utility-scale 2GW solar photovoltaic deployment in Al Dhafra region to supply clean power to the Abu Dhabi electrical grid and displace thermal natural gas power generation.',
    entity: 'Department of Energy (DoE)',
    supportingEntity: 'TAQA (Abu Dhabi National Energy Company)',
    subEntity: 'Clean & Renewable Energy Directorate',
    scope: 'Abu Dhabi Emirate',
    scopeOther: '',
    projectSector: 'Energy',
    typeOfInitiative: 'Infrastructure & Capital Projects',
    initiativeTypeOther: '',
    initiativeSource: 'Abu Dhabi Climate Change Strategy 2023–2027',
    strategicObjective: 'SO1: Reduce Greenhouse Gas Emissions Across Key Economic Sectors',
    strategicObjectiveOther: '',
    pillar: 'Mitigation',
    indicatorsAndTargets: [
      'Total Annual GHG Emissions Reduction (tCO₂e / year)',
      'Renewable & Clean Energy Installed Generation Capacity (MW)',
      'Industrial & Grid Energy Efficiency Improvement (%)',
    ],
    indicatorsAndTargetsOther: '',
    projectManagerName: 'Eng. Saeed Al-Mehairbi',
    projectManagerContactDetails: '+971 2 694 4000 / saeed.mehairbi@doe.gov.ae',
    startDate: '2023-01-01',
    endDate: '2027-12-31',
    submittedDate: '10 Jan 2026',
    updatedDate: '18 Jan 2026',
    reviewedDate: '18 Jan 2026',
    version: 'v1.0',
    status: 'Approved / Published',
    correctionDeadlineDate: null,
    facilityName: 'Al Dhafra Solar PV Decarbonization Program',
    facilityId: 'CCRP-INIT-2026-7073',
    operatorName: 'Department of Energy (DoE)',
  },
  'fac-2': {
    initiativeName: 'Low-Carbon Industrial Transition & Green Hydrogen Hub',
    initiativeId: 'CCRP-INIT-2026-0118',
    description:
      'Industrial sector green hydrogen pilot injecting clean hydrogen into heavy direct-reduced iron manufacturing and industrial furnaces to cut industrial Scope 1 emissions.',
    entity: 'Abu Dhabi Department of Economic Development (ADDED)',
    supportingEntity: 'Abu Dhabi National Oil Company (ADNOC)',
    subEntity: 'Industrial Development Bureau',
    scope: 'Sector-Wide',
    scopeOther: '',
    projectSector: 'Industry & Manufacturing',
    typeOfInitiative: 'Technology & Innovation Pilot',
    initiativeTypeOther: '',
    initiativeSource: 'Abu Dhabi Climate Change Strategy 2023–2027',
    strategicObjective: 'SO3: Accelerate Economic Diversification & Green Technology Transition',
    strategicObjectiveOther: '',
    pillar: 'Economic Diversification',
    indicatorsAndTargets: [
      'Total Annual GHG Emissions Reduction (tCO₂e / year)',
      'Industrial & Grid Energy Efficiency Improvement (%)',
      'Capacity Building & Green Jobs Created',
    ],
    indicatorsAndTargetsOther: '',
    projectManagerName: 'Dr. Fatima Al-Hosani',
    projectManagerContactDetails: '+971 2 550 1100 / fatima.hosani@added.gov.ae',
    startDate: '2023-06-01',
    endDate: '2028-12-31',
    submittedDate: '14 Feb 2026',
    updatedDate: '20 Feb 2026',
    reviewedDate: '20 Feb 2026',
    version: 'v3.0',
    status: 'Approved / Published',
    correctionDeadlineDate: null,
    facilityName: 'Low-Carbon Industrial Transition & Green Hydrogen Hub',
    facilityId: 'CCRP-INIT-2026-0118',
    operatorName: 'Abu Dhabi Department of Economic Development (ADDED)',
  },
  'fac-3': {
    initiativeName: 'Abu Dhabi Mangrove & Blue Carbon Coastal Restoration',
    initiativeId: 'CCRP-INIT-2026-0422',
    description:
      'Restoration and planting of coastal mangrove habitats and seagrass meadows across the Abu Dhabi coastline to bolster blue carbon sequestration and protect against storm surge risks.',
    entity: 'Environment Agency – Abu Dhabi (EAD)',
    supportingEntity: 'Department of Municipalities and Transport (DMT)',
    subEntity: 'Terrestrial & Marine Biodiversity Sector',
    scope: 'Abu Dhabi Emirate',
    scopeOther: '',
    projectSector: 'Coastal & Marine Ecosystems',
    typeOfInitiative: 'Ecosystem Restoration & Nature-Based Solutions',
    initiativeTypeOther: '',
    initiativeSource: 'Abu Dhabi Climate Change Adaptation Plan',
    strategicObjective: 'SO4: Protect and Restore Marine and Terrestrial Blue Carbon Ecosystems',
    strategicObjectiveOther: '',
    pillar: 'Adaptation',
    indicatorsAndTargets: [
      'Coastal Blue Carbon & Mangrove Ecosystem Area Protected/Restored (Hectares)',
      'Total Annual GHG Emissions Reduction (tCO₂e / year)',
      'Climate Resilience & Sustainable Infrastructure Standards Adoption (%)',
    ],
    indicatorsAndTargetsOther: '',
    projectManagerName: 'Khalid Al-Marzooqi',
    projectManagerContactDetails: '+971 2 607 0000 / khalid.marzooqi@ead.gov.ae',
    startDate: '2023-01-01',
    endDate: '2030-12-31',
    submittedDate: '02 Mar 2026',
    updatedDate: '11 Mar 2026',
    reviewedDate: '11 Mar 2026',
    version: 'v1.2',
    status: 'Approved / Published',
    correctionDeadlineDate: null,
    facilityName: 'Abu Dhabi Mangrove & Blue Carbon Coastal Restoration',
    facilityId: 'CCRP-INIT-2026-0422',
    operatorName: 'Environment Agency – Abu Dhabi (EAD)',
  },
  'fac-4': {
    initiativeName: 'Electric Public Transit Fleet & EV Fast-Charging Network',
    initiativeId: 'CCRP-INIT-2026-0305',
    description:
      'Electrification of Abu Dhabi municipal bus fleets and roll-out of high-power public EV fast-charging depots across Abu Dhabi, Al Ain, and Al Dhafra regions.',
    entity: 'Integrated Transport Centre (ITC)',
    supportingEntity: 'Department of Municipalities and Transport (DMT)',
    subEntity: 'Public Transport Sector',
    scope: 'Abu Dhabi Emirate',
    scopeOther: '',
    projectSector: 'Transport',
    typeOfInitiative: 'Infrastructure & Capital Projects',
    initiativeTypeOther: '',
    initiativeSource: 'Abu Dhabi Climate Change Strategy 2023–2027',
    strategicObjective: 'SO1: Reduce Greenhouse Gas Emissions Across Key Economic Sectors',
    strategicObjectiveOther: '',
    pillar: 'Mitigation',
    indicatorsAndTargets: [
      'Zero-Emission Municipal Transit & EV Fast-Charging Infrastructure Deployment',
      'Total Annual GHG Emissions Reduction (tCO₂e / year)',
      'Industrial & Grid Energy Efficiency Improvement (%)',
    ],
    indicatorsAndTargetsOther: '',
    projectManagerName: 'Eng. Rashid Al-Kindi',
    projectManagerContactDetails: '+971 2 694 4000 / rashid.kindi@itc.gov.ae',
    startDate: '2024-01-01',
    endDate: '2027-12-31',
    submittedDate: '05 Mar 2026',
    updatedDate: '—',
    version: 'v1.0',
    status: 'Under EAD Review',
    correctionDeadlineDate: null,
    facilityName: 'Electric Public Transit Fleet & EV Fast-Charging Network',
    facilityId: 'CCRP-INIT-2026-0305',
    operatorName: 'Integrated Transport Centre (ITC)',
  },
  'fac-5': {
    initiativeName: 'Integrated Organic Waste & Biogas Energy Recovery Program',
    initiativeId: 'CCRP-INIT-2026-0775',
    description:
      'Anaerobic digestion and organic municipal waste diversion facility converting biological wastes into pipeline-quality biomethane and high-grade organic fertilizer.',
    entity: 'Abu Dhabi Waste Management Centre (Tadweer)',
    supportingEntity: 'Abu Dhabi Agriculture and Food Safety Authority (ADAFSA)',
    subEntity: 'Waste Strategy & Recycling Sector',
    scope: 'Abu Dhabi Emirate',
    scopeOther: '',
    projectSector: 'Waste Management',
    typeOfInitiative: 'Infrastructure & Capital Projects',
    initiativeTypeOther: '',
    initiativeSource: 'Abu Dhabi Climate Change Strategy 2023–2027',
    strategicObjective: 'SO1: Reduce Greenhouse Gas Emissions Across Key Economic Sectors',
    strategicObjectiveOther: '',
    pillar: 'Cross Cutting',
    indicatorsAndTargets: [
      'Municipal Solid Waste Diversion Rate from Landfills (%)',
      'Total Annual GHG Emissions Reduction (tCO₂e / year)',
      'Renewable & Clean Energy Installed Generation Capacity (MW)',
    ],
    indicatorsAndTargetsOther: '',
    projectManagerName: 'Maryam Al-Dhaheri',
    projectManagerContactDetails: '+971 3 711 2000 / maryam.dhaheri@tadweer.ae',
    startDate: '2024-02-01',
    endDate: '2028-01-31',
    submittedDate: '22 Jan 2026',
    updatedDate: '28 Jan 2026',
    reviewedDate: '28 Jan 2026',
    version: 'v1.1',
    status: 'Approved / Published',
    correctionDeadlineDate: null,
    facilityName: 'Integrated Organic Waste & Biogas Energy Recovery Program',
    facilityId: 'CCRP-INIT-2026-0775',
    operatorName: 'Abu Dhabi Waste Management Centre (Tadweer)',
  },
  'fac-6': {
    initiativeName: 'Climate Resilient Urban Infrastructure & Stormwater Drainage Upgrade',
    initiativeId: 'CCRP-INIT-2026-0619',
    description:
      'Climate-proofing key urban transport corridors, coastal stormwater outfalls, and groundwater recharge infrastructure against extreme precipitation events.',
    entity: 'Department of Municipalities and Transport (DMT)',
    supportingEntity: 'Environment Agency – Abu Dhabi (EAD)',
    subEntity: 'Abu Dhabi City Municipality',
    scope: 'Abu Dhabi Emirate',
    scopeOther: '',
    projectSector: 'Infrastructure & Built Environment',
    typeOfInitiative: 'Infrastructure & Capital Projects',
    initiativeTypeOther: '',
    initiativeSource: 'Abu Dhabi Climate Change Adaptation Plan',
    strategicObjective: 'SO2: Enhance Climate Resilience and Adaptive Capacity of Infrastructure',
    strategicObjectiveOther: '',
    pillar: 'Adaptation',
    indicatorsAndTargets: [
      'Climate Resilience & Sustainable Infrastructure Standards Adoption (%)',
      'Green Building & Pearl Estidama Rating Compliance (%)',
    ],
    indicatorsAndTargetsOther: '',
    projectManagerName: 'Nasser Al-Hajri',
    projectManagerContactDetails: '+971 2 554 9900 / nasser.hajri@dmt.gov.ae',
    startDate: '2024-03-01',
    endDate: '2028-02-28',
    submittedDate: '18 Feb 2026',
    updatedDate: '24 Feb 2026',
    reviewerComments: 'Please provide updated hydrological flood-risk model attachments and revised phase milestone dates.',
    version: 'v1.0',
    status: 'Returned for Correction',
    correctionDeadlineDate: '2026-06-30',
    facilityName: 'Climate Resilient Urban Infrastructure & Stormwater Drainage Upgrade',
    facilityId: 'CCRP-INIT-2026-0619',
    operatorName: 'Department of Municipalities and Transport (DMT)',
  },
  'fac-7': {
    initiativeName: 'Agricultural Water Efficiency & Smart Irrigation Program',
    initiativeId: '',
    description:
      'Deployment of IoT sensor-driven precision drip irrigation across 1,200 commercial farms to minimize groundwater abstraction in agricultural sectors.',
    entity: 'Abu Dhabi Agriculture and Food Safety Authority (ADAFSA)',
    supportingEntity: 'Department of Energy (DoE)',
    subEntity: 'Agricultural Development Sector',
    scope: 'Abu Dhabi Emirate',
    scopeOther: '',
    projectSector: 'Agriculture, Forestry & Land Use (AFOLU)',
    typeOfInitiative: 'Operational Efficiency & Optimization',
    initiativeTypeOther: '',
    initiativeSource: 'Abu Dhabi Climate Change Strategy 2023–2027',
    strategicObjective: 'SO2: Enhance Climate Resilience and Adaptive Capacity of Infrastructure',
    strategicObjectiveOther: '',
    pillar: 'Adaptation',
    indicatorsAndTargets: [
      'Water Consumption Reduction & Desalination Efficiency (MIGD)',
      'Industrial & Grid Energy Efficiency Improvement (%)',
    ],
    indicatorsAndTargetsOther: '',
    projectManagerName: 'Saeed Al-Ketbi',
    projectManagerContactDetails: '+971 2 611 3400 / saeed.ketbi@adafsa.gov.ae',
    startDate: '2024-01-01',
    endDate: '2027-12-31',
    submittedDate: '—',
    updatedDate: '12 Feb 2026',
    version: 'v0.9',
    status: 'Draft',
    correctionDeadlineDate: null,
    facilityName: 'Agricultural Water Efficiency & Smart Irrigation Program',
    facilityId: '',
    operatorName: 'Abu Dhabi Agriculture and Food Safety Authority (ADAFSA)',
  },
};

export const INITIAL_FACILITY_REGISTRATION_HISTORY: Record<string, FacilityRegistrationVersionSnapshot[]> = {
  'fac-1': [
    {
      version: 'v2.1',
      status: 'Approved / Published',
      updatedDate: '18 Jan 2026',
      submittedDate: '10 Jan 2026',
      isCurrent: true,
      data: INITIAL_FACILITY_REGISTRATIONS['fac-1'],
    },
    {
      version: 'v1.0',
      status: 'Submitted',
      updatedDate: '05 Jan 2026',
      submittedDate: '05 Jan 2026',
      isCurrent: false,
      data: {
        ...INITIAL_FACILITY_REGISTRATIONS['fac-1'],
        version: 'v1.0',
        status: 'Submitted',
      },
    },
  ],
  'fac-2': [
    {
      version: 'v3.0',
      status: 'Approved / Published',
      updatedDate: '20 Feb 2026',
      submittedDate: '14 Feb 2026',
      isCurrent: true,
      data: INITIAL_FACILITY_REGISTRATIONS['fac-2'],
    },
  ],
  'fac-3': [
    {
      version: 'v1.2',
      status: 'Approved / Published',
      updatedDate: '11 Mar 2026',
      submittedDate: '02 Mar 2026',
      isCurrent: true,
      data: INITIAL_FACILITY_REGISTRATIONS['fac-3'],
    },
  ],
  'fac-4': [
    {
      version: 'v1.0',
      status: 'Under EAD Review',
      updatedDate: '—',
      submittedDate: '05 Mar 2026',
      isCurrent: true,
      data: INITIAL_FACILITY_REGISTRATIONS['fac-4'],
    },
  ],
  'fac-5': [
    {
      version: 'v1.1',
      status: 'Approved / Published',
      updatedDate: '28 Jan 2026',
      submittedDate: '22 Jan 2026',
      isCurrent: true,
      data: INITIAL_FACILITY_REGISTRATIONS['fac-5'],
    },
  ],
  'fac-6': [
    {
      version: 'v1.0',
      status: 'Returned for Correction',
      updatedDate: '24 Feb 2026',
      submittedDate: '18 Feb 2026',
      isCurrent: true,
      data: INITIAL_FACILITY_REGISTRATIONS['fac-6'],
    },
  ],
  'fac-7': [
    {
      version: 'v0.9',
      status: 'Draft',
      updatedDate: '12 Feb 2026',
      submittedDate: '—',
      isCurrent: true,
      data: INITIAL_FACILITY_REGISTRATIONS['fac-7'],
    },
  ],
};

// ============================================================================
// CCRP MASTER DATA CONSTANTS (Derived from Climate Change Strategy Performance Report - V2.xlsx)
// ============================================================================

export const CCRP_ENTITIES = [
  'Department of Municipalities and Transport (DMT)',
  'Department of Energy (DoE)',
  'Abu Dhabi National Oil Company (ADNOC)',
  'Abu Dhabi Department of Economic Development (ADDED)',
  'Abu Dhabi Agriculture and Food Safety Authority (ADAFSA)',
  'Abu Dhabi Waste Management Centre (Tadweer)',
  'Abu Dhabi Ports Group (AD Ports)',
  'TAQA (Abu Dhabi National Energy Company)',
  'Emirates Water and Electricity Company (EWEC)',
  'Abu Dhabi Housing Authority (ADHA)',
  'Environment Agency – Abu Dhabi (EAD)',
  'Integrated Transport Centre (ITC)',
  'Masdar (Abu Dhabi Future Energy Company)',
  'Abu Dhabi Sewerage Services Company (ADSSC)',
];

export const CCRP_SUB_ENTITIES: Record<string, string[]> = {
  'Department of Municipalities and Transport (DMT)': [
    'Abu Dhabi City Municipality',
    'Al Ain City Municipality',
    'Al Dhafra Region Municipality',
    'Integrated Transport Centre (ITC)',
    'Urban Planning Sector',
  ],
  'Department of Energy (DoE)': [
    'Policy & Regulation Directorate',
    'Energy Efficiency Sector',
    'Clean & Renewable Energy Directorate',
    'Water & Thermal Generation Sector',
  ],
  'Abu Dhabi National Oil Company (ADNOC)': [
    'ADNOC Low Carbon Solutions',
    'ADNOC Refining & Petrochemicals',
    'ADNOC Gas',
    'ADNOC Offshore',
    'ADNOC Onshore',
  ],
  'Abu Dhabi Department of Economic Development (ADDED)': [
    'Industrial Development Bureau',
    'Economic Competitiveness Sector',
    'Green Industrial Clusters Directorate',
  ],
  'Abu Dhabi Agriculture and Food Safety Authority (ADAFSA)': [
    'Agricultural Development Sector',
    'Food Security & Sustainable Resources',
    'Biosecurity & Veterinary Health Sector',
  ],
  'Abu Dhabi Waste Management Centre (Tadweer)': [
    'Waste Strategy & Recycling Sector',
    'Waste-to-Energy & Resource Recovery',
    'Hazardous & Industrial Waste Division',
  ],
  'Environment Agency – Abu Dhabi (EAD)': [
    'Climate Change & Sustainability Sector',
    'Terrestrial & Marine Biodiversity Sector',
    'Environmental Quality Directorate',
  ],
  'TAQA (Abu Dhabi National Energy Company)': [
    'Generation & Water Desalination',
    'Transmission & Distribution',
    'Renewable Power Division',
  ],
  'Integrated Transport Centre (ITC)': [
    'Public Transport Sector',
    'Clean Mobility & Infrastructure Directorate',
    'Traffic Management Division',
  ],
};

export const CCRP_STRATEGIC_OBJECTIVES = [
  'SO1: Reduce Greenhouse Gas Emissions Across Key Economic Sectors',
  'SO2: Enhance Climate Resilience and Adaptive Capacity of Infrastructure',
  'SO3: Accelerate Economic Diversification & Green Technology Transition',
  'SO4: Protect and Restore Marine and Terrestrial Blue Carbon Ecosystems',
  'SO5: Strengthen Climate Governance, Monitoring, Reporting and Verification',
  'Other',
];

export const CCRP_PROJECT_SECTORS = [
  'Energy',
  'Transport',
  'Industry & Manufacturing',
  'Waste Management',
  'Agriculture, Forestry & Land Use (AFOLU)',
  'Water & Wastewater',
  'Infrastructure & Built Environment',
  'Coastal & Marine Ecosystems',
  'Cross-Sectoral / Governance',
  'Other',
];

export const CCRP_INITIATIVE_TYPES = [
  'Policy, Regulation & Standards',
  'Infrastructure & Capital Projects',
  'Technology & Innovation Pilot',
  'Capacity Building & Awareness',
  'Operational Efficiency & Optimization',
  'Monitoring, Reporting & Data Systems',
  'Ecosystem Restoration & Nature-Based Solutions',
  'Other',
];

export const CCRP_INITIATIVE_SOURCES = [
  'Abu Dhabi Climate Change Strategy 2023–2027',
  'Abu Dhabi Climate Change Adaptation Plan',
  'UAE Net Zero 2050 Strategic Initiative',
  'National Energy Strategy 2050',
  'Abu Dhabi Economic Vision 2030',
  'Entity-Specific Strategic Initiative',
  'Other',
];

export const CCRP_SCOPES = [
  'Abu Dhabi Emirate',
  'Entity-Level',
  'Sector-Wide',
  'Federal / National',
  'Other',
];

export const CCRP_PILLARS = [
  'Adaptation',
  'Mitigation',
  'Economic Diversification',
  'Cross Cutting',
];

export const CCRP_INDICATORS_TARGETS_CHECKLIST = [
  'Total Annual GHG Emissions Reduction (tCO₂e / year)',
  'Renewable & Clean Energy Installed Generation Capacity (MW)',
  'Industrial & Grid Energy Efficiency Improvement (%)',
  'Water Consumption Reduction & Desalination Efficiency (MIGD)',
  'Zero-Emission Municipal Transit & EV Fast-Charging Infrastructure Deployment',
  'Municipal Solid Waste Diversion Rate from Landfills (%)',
  'Coastal Blue Carbon & Mangrove Ecosystem Area Protected/Restored (Hectares)',
  'Climate Resilience & Sustainable Infrastructure Standards Adoption (%)',
  'Green Building & Pearl Estidama Rating Compliance (%)',
  'Institutional Climate Capacity Building & Specialized Technical Training',
  'Other',
];

export const CCRP_INDICATORS_BY_PILLAR: Record<string, string[]> = {
  Mitigation: [
    'Total Annual GHG Emissions Reduction (tCO₂e / year)',
    'Renewable & Clean Energy Installed Generation Capacity (MW)',
    'Industrial & Grid Energy Efficiency Improvement (%)',
    'Zero-Emission Municipal Transit & EV Fast-Charging Infrastructure Deployment',
    'Green Building & Pearl Estidama Rating Compliance (%)',
    'Water Consumption Reduction & Desalination Efficiency (MIGD)',
    'Other',
  ],
  Adaptation: [
    'Coastal Blue Carbon & Mangrove Ecosystem Area Protected/Restored (Hectares)',
    'Climate Resilience & Sustainable Infrastructure Standards Adoption (%)',
    'Water Consumption Reduction & Desalination Efficiency (MIGD)',
    'Institutional Climate Capacity Building & Specialized Technical Training',
    'Total Annual GHG Emissions Reduction (tCO₂e / year)',
    'Other',
  ],
  'Economic Diversification': [
    'Total Annual GHG Emissions Reduction (tCO₂e / year)',
    'Industrial & Grid Energy Efficiency Improvement (%)',
    'Renewable & Clean Energy Installed Generation Capacity (MW)',
    'Institutional Climate Capacity Building & Specialized Technical Training',
    'Other',
  ],
  'Cross Cutting': [
    'Total Annual GHG Emissions Reduction (tCO₂e / year)',
    'Municipal Solid Waste Diversion Rate from Landfills (%)',
    'Renewable & Clean Energy Installed Generation Capacity (MW)',
    'Climate Resilience & Sustainable Infrastructure Standards Adoption (%)',
    'Green Building & Pearl Estidama Rating Compliance (%)',
    'Institutional Climate Capacity Building & Specialized Technical Training',
    'Other',
  ],
};

