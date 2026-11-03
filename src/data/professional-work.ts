export interface ProfessionalWork {
  slug: string;
  name: string;
  title: string;
  classification: string;
  kind: 'professional' | 'employment' | 'internal';
  state:
    'documentation-contribution' | 'delivered-launch-pending' | 'development-production-pending';
  status: string;
  summary: string;
  tags: string[];
  relatedServices: string[];
  role: string;
  context: string;
  deliverables: string[];
  approach: string[];
  statusDetail: string;
  limits: string;
}

export const professionalWork: ProfessionalWork[] = [
  {
    slug: 'proxcenter-documentation',
    name: 'ProxCenter',
    title: 'Enterprise documentation review & operating guidance',
    classification: 'Professional consulting work',
    kind: 'professional',
    state: 'documentation-contribution',
    status: 'Documentation review and supporting guidance',
    summary:
      'Technical documentation review, corrections, installation and configuration guidance, and supporting screenshots for ProxCenter.',
    tags: ['Documentation', 'Runbooks', 'Technical review', 'Virtualization'],
    relatedServices: ['infrastructure-documentation', 'proxmox-virtualization'],
    role: 'I reviewed ProxCenter’s enterprise documentation and contributed corrections, an installation and initial-configuration runbook, and supporting screenshots.',
    context:
      'The work focused on making technical procedures accurate and useful to the person carrying them out. Installation and configuration guidance needs clear prerequisites, a usable sequence, and a record of what has actually been validated.',
    deliverables: [
      'Technical documentation review and corrections',
      'Installation and initial-configuration runbook',
      'Reviewed screenshots supporting the operating guidance',
      'A distinction between executed validation and review-only procedures',
    ],
    approach: [
      'Review the documentation as operating instructions, with attention to technical accuracy and reader tasks.',
      'Contribute corrections and supporting guidance for installation and initial configuration.',
      'Keep tested steps separate from procedures that were reviewed only or could not be validated.',
      'Organize the documentation contribution for handover.',
    ],
    statusDetail:
      'The review and supporting installation and configuration guidance were prepared for handover. Tested steps were identified separately from instructions that were reviewed only or could not be validated in the available environment.',
    limits: 'Client source documents, review material, and screenshots remain private.',
  },
  {
    slug: 'neilus-delivery-system',
    name: 'Neilus Solutions',
    title: 'JIT delivery application with WhatsApp integration',
    classification: 'Employment-related application development',
    kind: 'employment',
    state: 'delivered-launch-pending',
    status: 'Delivered · launch pending',
    summary:
      'Sole development of a JIT delivery system integrated with WhatsApp, built and delivered during my full-stack development role at Neilus Solutions.',
    tags: ['Full-stack development', 'Business application', 'WhatsApp integration'],
    relatedServices: ['automation', 'websites'],
    role: 'At Neilus Solutions, I built the entire JIT delivery system myself. I was the sole developer and delivered the application as part of my full-stack development role.',
    context:
      'This was professional application-development work in an employment context. The scope combined a JIT delivery application with a WhatsApp integration, connecting application engineering with a business communication channel.',
    deliverables: [
      'The JIT delivery application, built by me as sole developer',
      'WhatsApp integration within the system',
      'Delivery of the application with launch still pending',
    ],
    approach: [],
    statusDetail: 'The application was delivered, with launch pending as of 3 November 2026.',
    limits: 'Employer code and private system material are not published here.',
  },
  {
    slug: 'orbit-crm',
    name: 'Orbit',
    title: 'An internal CRM for my freelance practice',
    classification: 'Internal product development',
    kind: 'internal',
    state: 'development-production-pending',
    status: 'Developed and tested · production activation pending',
    summary:
      'An internal CRM bringing contacts, research evidence, opportunities, tasks, and follow-ups into one application, with automated tests and deployment documentation.',
    tags: ['Application development', 'CRM workflows', 'API design', 'Documentation'],
    relatedServices: ['automation', 'websites', 'infrastructure-documentation'],
    role: 'I developed Orbit for my own freelance practice. The project brings application development, data modeling, workflow automation, integration boundaries, and operating documentation together.',
    context:
      'The development scope covers contacts and companies, research evidence, opportunities and pipelines, tasks, follow-ups, and reporting. It is an internal product for organizing my own work.',
    deliverables: [
      'Contact, company, opportunity, and pipeline workflows',
      'Research evidence, task, follow-up, and reporting features',
      'API and integration boundaries',
      'Automated tests and architecture, verification, and deployment documentation',
    ],
    approach: [
      'Model the records and workflows needed by my freelance practice.',
      'Develop application features with explicit API and integration boundaries.',
      'Use automated tests and verification records to check implemented behavior.',
      'Document deployment and operating requirements before production activation.',
    ],
    statusDetail:
      'Orbit has been developed and tested. Production deployment and live provider validation remain pending as of 3 November 2026.',
    limits:
      'This is an internal project for my own practice. The source repository remains private.',
  },
];
