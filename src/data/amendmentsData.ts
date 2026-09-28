import { CCRP_ENTITIES, CCRP_STRATEGIC_OBJECTIVES, CCRP_PROJECT_SECTORS, CCRP_INITIATIVE_TYPES, CCRP_INITIATIVE_SOURCES, CCRP_SCOPES } from './facilityRegistrationsData';

export interface InitiativeAmendment {
  id: string;
  initiativeId: string;
  initiativeName: string;
  description: string;
  entity: string;
  supportingEntity: string;
  scope: string;
  strategicObjective: string;
  strategicObjectiveOther?: string;
  projectSector: string;
  initiativeType: string;
  initiativeTypeOther?: string;
  initiativeSource: string;
  indicatorsAndTargets: string;
  projectManagerName: string;
  projectManagerContact: string;
  startDate: string;
  endDate: string;
  justification: string;
  version: string;
  versionNum: number;
  status:
    | 'Draft'
    | 'Submitted'
    | 'Under Review'
    | 'Under EAD Review'
    | 'Approved / Published'
    | 'Approved'
    | 'Correction Requested'
    | 'Returned for Correction';
  submittedDate: string;
  submittedBy: string;
  isNotice?: boolean;
  isLatest?: boolean;
  reviewerComments?: string;
  changes?: string[];
  ticketStatus?: 'Ticket Required' | 'Ticket Raised' | 'Ticket In Progress' | 'Ticket Resolved';
  ticketId?: string;
  ticketRaisedDate?: string;
  previousSnapshot?: {
    initiativeName?: string;
    projectSector?: string;
    strategicObjective?: string;
    supportingEntity?: string;
    startDate?: string;
    endDate?: string;
    indicatorsAndTargets?: string;
    initiativeType?: string;
    scope?: string;
  };
}

export interface CCRPNotification {
  id: string;
  type: 'amendment_submitted' | 'under_review' | 'returned_correction' | 'approved' | 'ticket_required' | 'ticket_raised';
  title: string;
  message: string;
  timestamp: string;
  isUnread: boolean;
  initiativeName: string;
  initiativeId: string;
  amendmentId?: string;
  ticketId?: string;
  actionText?: string;
  actionType?: 'view_amendment' | 'view_initiative' | 'raise_ticket';
}

export const INITIAL_NOTIFICATIONS: CCRPNotification[] = [
  {
    id: 'notif-1',
    type: 'ticket_required',
    title: 'Ticket Required for Approved Amendment',
    message: 'Your approved amendment (v3.0) for Abu Dhabi Low Carbon Transport Initiative requires a ticket to be raised.',
    timestamp: '10 mins ago',
    isUnread: true,
    initiativeName: 'Abu Dhabi Low Carbon Transport Initiative',
    initiativeId: 'CCRP-INIT-2026-0305',
    amendmentId: 'AM-003',
    actionText: 'Raise Ticket',
    actionType: 'raise_ticket',
  },
  {
    id: 'notif-2',
    type: 'approved',
    title: 'Amendment Approved & Published',
    message: 'Your amendment request for Abu Dhabi Low Carbon Transport Initiative has been approved and published.',
    timestamp: '14 Mar 2026',
    isUnread: true,
    initiativeName: 'Abu Dhabi Low Carbon Transport Initiative',
    initiativeId: 'CCRP-INIT-2026-0305',
    amendmentId: 'AM-003',
    actionText: 'View Initiative',
    actionType: 'view_initiative',
  },
  {
    id: 'notif-3',
    type: 'returned_correction',
    title: 'Amendment Returned for Correction',
    message: 'Your amendment request for Abu Dhabi Low Carbon Transport Initiative was returned for correction.',
    timestamp: '10 Mar 2026',
    isUnread: false,
    initiativeName: 'Abu Dhabi Low Carbon Transport Initiative',
    initiativeId: 'CCRP-INIT-2026-0305',
    amendmentId: 'AM-002-CORR',
    actionText: 'View Amendment',
    actionType: 'view_amendment',
  },
  {
    id: 'notif-4',
    type: 'under_review',
    title: 'Amendment Under EAD Review',
    message: 'Your amendment request for Abu Dhabi Low Carbon Transport Initiative is under EAD review.',
    timestamp: '08 Mar 2026',
    isUnread: false,
    initiativeName: 'Abu Dhabi Low Carbon Transport Initiative',
    initiativeId: 'CCRP-INIT-2026-0305',
    amendmentId: 'AM-002',
  },
  {
    id: 'notif-5',
    type: 'amendment_submitted',
    title: 'Amendment Request Submitted',
    message: 'Your amendment request for Abu Dhabi Low Carbon Transport Initiative has been submitted successfully.',
    timestamp: '01 Mar 2026',
    isUnread: false,
    initiativeName: 'Abu Dhabi Low Carbon Transport Initiative',
    initiativeId: 'CCRP-INIT-2026-0305',
    amendmentId: 'AM-002',
  },
];

export const INITIAL_AMENDMENTS: Record<string, InitiativeAmendment[]> = {
  'CCRP-INIT-2026-7073': [
    {
      id: 'AM-7073-001',
      initiativeId: 'CCRP-INIT-2026-7073',
      initiativeName: 'Al Dhafra Solar PV Decarbonization Program',
      description: 'Utility-scale 2GW solar photovoltaic deployment in Al Dhafra region to supply clean power to the Abu Dhabi electrical grid and displace thermal natural gas power generation.',
      entity: 'Department of Energy (DoE)',
      supportingEntity: 'TAQA (Abu Dhabi National Energy Company)',
      scope: 'Abu Dhabi Emirate',
      strategicObjective: 'SO1: Reduce Greenhouse Gas Emissions Across Key Economic Sectors',
      projectSector: 'Energy',
      initiativeType: 'Infrastructure & Capital Projects',
      initiativeSource: 'Abu Dhabi Climate Change Strategy 2023–2027',
      indicatorsAndTargets: 'Total Annual GHG Emissions Reduction (tCO₂e / year), Renewable & Clean Energy Installed Generation Capacity (MW), Industrial & Grid Energy Efficiency Improvement (%)',
      projectManagerName: 'Eng. Saeed Al-Mehairbi',
      projectManagerContact: '+971 2 694 4000 / saeed.mehairbi@doe.gov.ae',
      startDate: '2023-01-01',
      endDate: '2027-12-31',
      justification: 'Approved baseline initiative registration under CCRP statutory framework.',
      version: 'Amendment',
      versionNum: 1,
      status: 'Approved',
      submittedDate: '18 Jan 2026',
      submittedBy: 'Eng. Saeed Al-Mehairbi',
      isLatest: true,
      changes: ['Initial initiative registration approved and published'],
    },
  ],
  'CCRP-INIT-2026-0118': [
    {
      id: 'AM-0118-001',
      initiativeId: 'CCRP-INIT-2026-0118',
      initiativeName: 'Low-Carbon Industrial Transition & Green Hydrogen Hub',
      description: 'Industrial sector green hydrogen pilot injecting clean hydrogen into heavy direct-reduced iron manufacturing and industrial furnaces to cut industrial Scope 1 emissions.',
      entity: 'Abu Dhabi Department of Economic Development (ADDED)',
      supportingEntity: 'Abu Dhabi National Oil Company (ADNOC)',
      scope: 'Sector-Wide',
      strategicObjective: 'SO3: Accelerate Economic Diversification & Green Technology Transition',
      projectSector: 'Industry & Manufacturing',
      initiativeType: 'Technology & Innovation Pilot',
      initiativeSource: 'Abu Dhabi Climate Change Strategy 2023–2027',
      indicatorsAndTargets: 'Total Annual GHG Emissions Reduction (tCO₂e / year), Industrial & Grid Energy Efficiency Improvement (%), Capacity Building & Green Jobs Created',
      projectManagerName: 'Dr. Fatima Al-Hosani',
      projectManagerContact: '+971 2 550 1100 / fatima.hosani@added.gov.ae',
      startDate: '2023-06-01',
      endDate: '2028-12-31',
      justification: 'Addition of Phase II industrial furnace hydrogen blending trials and revised capacity targets for 2026–2027.',
      version: 'Amendment',
      versionNum: 1,
      status: 'Submitted',
      submittedDate: '24 Feb 2026',
      submittedBy: 'Dr. Fatima Al-Hosani',
      isLatest: true,
      changes: ['Updated furnace blending KPI targets', 'Extended operational testing phase to 2028'],
    },
  ],
  'CCRP-INIT-2026-0422': [
    {
      id: 'AM-0422-001',
      initiativeId: 'CCRP-INIT-2026-0422',
      initiativeName: 'Abu Dhabi Mangrove & Blue Carbon Coastal Restoration',
      description: 'Restoration and planting of coastal mangrove habitats and seagrass meadows across the Abu Dhabi coastline to bolster blue carbon sequestration and protect against storm surge risks.',
      entity: 'Environment Agency – Abu Dhabi (EAD)',
      supportingEntity: 'Department of Municipalities and Transport (DMT)',
      scope: 'Abu Dhabi Emirate',
      strategicObjective: 'SO4: Protect and Restore Marine and Terrestrial Blue Carbon Ecosystems',
      projectSector: 'Coastal & Marine Ecosystems',
      initiativeType: 'Ecosystem Restoration & Nature-Based Solutions',
      initiativeSource: 'Abu Dhabi Climate Change Adaptation Plan',
      indicatorsAndTargets: 'Coastal Blue Carbon & Mangrove Ecosystem Area Protected/Restored (Hectares), Total Annual GHG Emissions Reduction (tCO₂e / year), Climate Resilience & Sustainable Infrastructure Standards Adoption (%)',
      projectManagerName: 'Khalid Al-Marzooqi',
      projectManagerContact: '+971 2 607 0000 / khalid.marzooqi@ead.gov.ae',
      startDate: '2023-01-01',
      endDate: '2030-12-31',
      justification: 'Approved baseline initiative registration under CCRP statutory framework.',
      version: 'Amendment',
      versionNum: 1,
      status: 'Approved',
      submittedDate: '11 Mar 2026',
      submittedBy: 'Khalid Al-Marzooqi',
      isLatest: true,
      changes: ['Initial initiative registration approved and published'],
    },
  ],
  'CCRP-INIT-2026-0305': [
    {
      id: 'AM-0305-001',
      initiativeId: 'CCRP-INIT-2026-0305',
      initiativeName: 'Electric Public Transit Fleet & EV Fast-Charging Network',
      description: 'Comprehensive multi-modal urban transit decarbonization program encompassing rapid bus transit electrification, 160 fast-charging hubs, and hydrogen fuel cell fleet integration.',
      entity: 'Department of Municipalities and Transport (DMT)',
      supportingEntity: 'Integrated Transport Centre (ITC)',
      scope: 'Abu Dhabi Emirate',
      strategicObjective: 'SO1: Reduce Greenhouse Gas Emissions Across Key Economic Sectors',
      projectSector: 'Transport',
      initiativeType: 'Infrastructure & Capital Projects',
      initiativeSource: 'Abu Dhabi Climate Change Strategy 2023–2027',
      indicatorsAndTargets: 'Deploy 160 EV fast-charging stations, 350 electric municipal transit buses, achieving 185,000 tCO₂e annual emission reductions by Q4 2027.',
      projectManagerName: 'Abdul Rahman',
      projectManagerContact: 'abdul.rahman@dmt.gov.ae | +971 2 698 8820',
      startDate: '2024-01-01',
      endDate: '2027-12-31',
      justification: 'Expanded charging infrastructure network to accommodate 40 additional rapid transit routes across Al Ain and Western Region; adjusted capital expenditure timeline to Q4 2027.',
      version: 'Amendment',
      versionNum: 1,
      status: 'Approved',
      submittedDate: '14 Mar 2026',
      submittedBy: 'Abdul Rahman',
      isLatest: true,
      changes: [
        'Updated project target: expanded fast-charging hubs from 120 to 160 stations',
        'Revised project timeline: operational target completion extended to 31-Dec-2027',
      ],
      ticketStatus: 'Ticket Raised',
      ticketId: 'TCK-2026-0305-AM',
      ticketRaisedDate: '15 Mar 2026',
    },
  ],
  'CCRP-INIT-2026-0775': [
    {
      id: 'AM-0775-001',
      initiativeId: 'CCRP-INIT-2026-0775',
      initiativeName: 'Integrated Organic Waste & Biogas Energy Recovery Program',
      description: 'Anaerobic digestion and organic municipal waste diversion facility converting biological wastes into pipeline-quality biomethane and high-grade organic fertilizer.',
      entity: 'Abu Dhabi Waste Management Centre (Tadweer)',
      supportingEntity: 'Abu Dhabi Agriculture and Food Safety Authority (ADAFSA)',
      scope: 'Abu Dhabi Emirate',
      strategicObjective: 'SO1: Reduce Greenhouse Gas Emissions Across Key Economic Sectors',
      projectSector: 'Waste Management',
      initiativeType: 'Infrastructure & Capital Projects',
      initiativeSource: 'Abu Dhabi Climate Change Strategy 2023–2027',
      indicatorsAndTargets: 'Municipal Solid Waste Diversion Rate from Landfills (%), Total Annual GHG Emissions Reduction (tCO₂e / year), Renewable & Clean Energy Installed Generation Capacity (MW)',
      projectManagerName: 'Maryam Al-Dhaheri',
      projectManagerContact: '+971 3 711 2000 / maryam.dhaheri@tadweer.ae',
      startDate: '2024-02-01',
      endDate: '2028-01-31',
      justification: 'Addition of co-digestion food waste substrate feedstock streams to boost biomethane yields.',
      version: 'Amendment',
      versionNum: 1,
      status: 'Under Review',
      submittedDate: '19 Mar 2026',
      submittedBy: 'Maryam Al-Dhaheri',
      isLatest: true,
      changes: ['Integrated 50,000 TPA commercial food waste substrate feed streams'],
    },
  ],
  'CCRP-INIT-2026-0619': [
    {
      id: 'AM-0619-001',
      initiativeId: 'CCRP-INIT-2026-0619',
      initiativeName: 'Climate Resilient Urban Infrastructure & Stormwater Drainage Upgrade',
      description: 'Climate-proofing key urban transport corridors, coastal stormwater outfalls, and groundwater recharge infrastructure against extreme precipitation events.',
      entity: 'Department of Municipalities and Transport (DMT)',
      supportingEntity: 'Environment Agency – Abu Dhabi (EAD)',
      scope: 'Abu Dhabi Emirate',
      strategicObjective: 'SO2: Enhance Climate Resilience and Adaptive Capacity of Infrastructure',
      projectSector: 'Infrastructure & Built Environment',
      initiativeType: 'Infrastructure & Capital Projects',
      initiativeSource: 'Abu Dhabi Climate Change Adaptation Plan',
      indicatorsAndTargets: 'Climate Resilience & Sustainable Infrastructure Standards Adoption (%), Green Building & Pearl Estidama Rating Compliance (%)',
      projectManagerName: 'Nasser Al-Hajri',
      projectManagerContact: '+971 2 554 9900 / nasser.hajri@dmt.gov.ae',
      startDate: '2024-03-01',
      endDate: '2028-02-28',
      justification: 'Scope extension to include 5 additional stormwater detention basins and pump stations in western sectors.',
      version: 'Amendment',
      versionNum: 1,
      status: 'Correction Requested',
      submittedDate: '20 Mar 2026',
      submittedBy: 'Nasser Al-Hajri',
      reviewerComments: 'Please clarify hydraulic capacity calculations and provide verified engineering drawings.',
      isLatest: true,
      changes: ['Added 5 stormwater retention basins to project scope'],
    },
  ],
};

export const CCRP_DISCLAIMER_TEXT =
  'Kindly note that the information submitted will be shared to the Abu Dhabi Executive Office through the Head of the Climate Change Committee.';
