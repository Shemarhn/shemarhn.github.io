export const site = {
  name: 'Shemar Marks',
  url: 'https://shemarmarks.com',
  email: 'hello@shemarmarks.com',
  descriptor: 'Cloud Infrastructure · Linux · Automation',
  socials: {
    GitHub: 'https://github.com/Shemarhn',
    LinkedIn: 'https://www.linkedin.com/in/shemar-marks-11ba4820b',
    X: 'https://x.com/Shemarhn',
  },
};
export const services = [
  {
    slug: 'cloud-infrastructure',
    name: 'Cloud Infrastructure',
    short: 'Infrastructure with a plan.',
    category: 'Build',
    icon: 'cloud',
    summary:
      'Deploy, migrate, and improve cloud workloads with a clear architecture, a controlled change plan, and an operational handover.',
    intro:
      'Your application needs an environment you can understand and operate. I help small teams make deliberate decisions about compute, networking, access, and recovery across AWS and Azure.',
    problems: [
      'A workload has outgrown its current host.',
      'Cloud configuration has accumulated without a clear owner.',
      'A migration needs a cutover and a rollback plan.',
    ],
    deliverables: [
      'Architecture and dependency map',
      'Deployment configuration or infrastructure as code',
      'Access and network configuration',
      'Migration and rollback procedures',
      'Validation record and operating notes',
    ],
    approach: [
      'Map the workload, data, dependencies, and acceptable disruption.',
      'Agree a target architecture and acceptance checks before changing anything.',
      'Build and validate the environment, then rehearse the migration where practical.',
      'Hand over configuration, known limits, and an agreed maintenance path.',
    ],
    scope:
      'AWS and Azure implementation is scoped to the actual workload. Platform familiarity is not a claim of every provider certification or every managed-service specialty.',
    fit: 'Startups and small businesses moving an application, replacing an uncertain setup, or needing an independent engineer to own a defined infrastructure change.',
    related: 'northstar',
    faq: [
      'Can you work with an existing environment?',
      'Yes. An assessment and dependency review come before any proposal to rebuild. Existing controls, operating procedures, and access boundaries shape the scope.',
    ],
  },
  {
    slug: 'linux-systems',
    name: 'Linux & Systems',
    short: 'Make the server understandable.',
    category: 'Operate',
    icon: 'terminal',
    summary:
      'Linux administration, troubleshooting, hardening, and virtualization with evidence behind the changes.',
    intro:
      'A healthy server is more than a running process. I look at service identities, permissions, network exposure, logs, resource use, and the recovery path together.',
    problems: [
      'A service fails intermittently and nobody knows why.',
      'Access and permissions need a structured review.',
      'A Linux or Proxmox environment needs an operable handover.',
    ],
    deliverables: [
      'Baseline and risk review',
      'Scoped configuration changes',
      'Service and access checks',
      'Rollback instructions',
      'Administration and maintenance runbook',
    ],
    approach: [
      'Capture the current state and application dependencies.',
      'Prioritize risks and prepare access-safe rollback steps.',
      'Apply agreed changes incrementally and verify application behavior.',
      'Record the changes and explain how to maintain them.',
    ],
    scope:
      'Hardening reduces defined risks; it is not a security certification or a guarantee against compromise. Production access and maintenance windows are agreed in advance.',
    fit: 'Teams running Linux applications, virtual machines, Docker workloads, or Proxmox environments without a dedicated systems engineer.',
    related: 'cedarfield',
    faq: [
      'Will hardening interrupt my application?',
      'It can if changes are made without understanding dependencies. I agree maintenance windows, validation checks, and rollback steps around your workload.',
    ],
  },
  {
    slug: 'devops-infrastructure-as-code',
    name: 'DevOps & Infrastructure as Code',
    short: 'Repeatable beats remembered.',
    category: 'Build',
    icon: 'code',
    summary:
      'Terraform, deployment workflows, and environment standardization that replace fragile manual steps with reviewable changes.',
    intro:
      'Infrastructure should have a record of intent. I help turn repeated setup and deployment work into versioned configuration with a clear review and recovery process.',
    problems: [
      'Two environments behave differently.',
      'Deployments depend on undocumented manual work.',
      'Terraform state and access need clearer ownership.',
    ],
    deliverables: [
      'Versioned infrastructure configuration',
      'Environment and state strategy',
      'CI/CD workflow where appropriate',
      'Secret-handling guidance',
      'Deployment, verification, and rollback notes',
    ],
    approach: [
      'Inventory existing resources and identify safe ownership boundaries.',
      'Define state, environment separation, and the review workflow.',
      'Implement incremental changes with plans reviewed before application.',
      'Validate a repeatable deployment and document the handover.',
    ],
    scope:
      'Existing resources are imported or migrated only with an agreed plan. Automation does not remove the need for review of destructive changes.',
    fit: 'Small engineering teams and agencies that need reliable environments without adding unnecessary platform complexity.',
    related: 'northstar',
    faq: [
      'Do I need Kubernetes?',
      'Only if the workload and operating team justify it. A simpler VM or container deployment can be a better fit; the architecture follows your needs.',
    ],
  },
  {
    slug: 'backup-disaster-recovery',
    name: 'Backup & Disaster Recovery',
    short: 'A backup is a beginning.',
    category: 'Recover',
    icon: 'recover',
    summary:
      'Backup architecture, restore workflows, and recovery exercises that test whether your data and application can actually come back.',
    intro:
      'A successful backup job does not prove recoverability. I help define what must survive a failure, where the copies live, and how to validate a restored system.',
    problems: [
      'Backups exist, but nobody has tested a restore.',
      'The only copy is on the same server.',
      'The business has no documented recovery sequence.',
    ],
    deliverables: [
      'Recovery requirements and dependency review',
      'Backup and retention design',
      'Restore implementation and integrity checks',
      'Recorded recovery exercise',
      'Recovery runbook with observed limits',
    ],
    approach: [
      'Agree data-loss and downtime objectives with the business.',
      'Review backup isolation, encryption, access, and retention.',
      'Build a repeatable restore into a clean environment.',
      'Validate data and application behavior, record timings, and identify remaining gaps.',
    ],
    scope:
      'Recovery objectives are requirements to test, not promises inferred from a lab. A measured exercise applies to that scenario and its documented conditions.',
    fit: 'Businesses with a critical application, a single-server dependency, or backups that have never been exercised end to end.',
    related: 'northstar',
    faq: [
      'Is an S3 copy enough for disaster recovery?',
      'It can be one component. You still need access, application configuration, dependencies, a restore procedure, and evidence that the recovered workload works.',
    ],
  },
  {
    slug: 'automation',
    name: 'Workflow Automation',
    short: 'Give repetitive work a system.',
    category: 'Connect',
    icon: 'nodes',
    summary:
      'APIs, integrations, scripts, and operational workflows with safe retries, useful logs, and clear ownership.',
    intro:
      'Good automation handles more than the happy path. I connect the systems you already use and make failure, retry, and human intervention part of the design.',
    problems: [
      'People re-enter the same information in several tools.',
      'A script works until an API is unavailable.',
      'Routine operational checks are easy to miss.',
    ],
    deliverables: [
      'Workflow and integration map',
      'Versioned implementation',
      'Validation and failure handling',
      'Logging and alert strategy',
      'Configuration and support documentation',
    ],
    approach: [
      'Map the process, source of truth, permissions, and exceptions.',
      'Choose the smallest maintainable integration.',
      'Build validation, idempotency, and recovery into the workflow.',
      'Test failure scenarios and document intervention steps.',
    ],
    scope:
      'Third-party API limits, permissions, and subscription costs are checked during scoping. Automated destructive actions require explicit, narrow safeguards.',
    fit: 'Operations teams and businesses losing time to predictable manual work, disconnected tools, or inconsistent checks.',
    related: 'harborlight',
    faq: [
      'Can an automation run on my existing infrastructure?',
      'Often. Hosting is chosen around reliability and maintenance. A business-critical submission should not depend on a single home server being online.',
    ],
  },
  {
    slug: 'infrastructure-documentation',
    name: 'Infrastructure Documentation',
    short: 'Knowledge that survives the handover.',
    category: 'Understand',
    icon: 'document',
    summary:
      'Runbooks, architecture documentation, deployment instructions, and technical reviews written for the people who will use them.',
    intro:
      'Useful documentation tells the next person what to do, how to check it worked, and when to stop. I review and write operational material against the actual system and its audience.',
    problems: [
      'The architecture lives in one person’s head.',
      'Deployment instructions omit prerequisites or verification.',
      'Enterprise-facing technical material needs an independent review.',
    ],
    deliverables: [
      'Documentation inventory and gap review',
      'Architecture and dependency diagrams',
      'Task-oriented operating procedures',
      'Prerequisites, checks, and rollback steps',
      'Prioritized review findings',
    ],
    approach: [
      'Identify readers, tasks, and source material.',
      'Trace instructions against configuration and evidence where access permits.',
      'Clarify ambiguous steps and surface unverified assumptions.',
      'Deliver an organized handover and a maintenance approach.',
    ],
    scope:
      'Document review and live implementation validation are distinct scopes. Findings identify which instructions were executed and which were reviewed only.',
    fit: 'Product teams, agencies, and infrastructure operators preparing a handover or improving technical material for customers.',
    related: 'cedarfield',
    faq: [
      'Can you review existing documentation?',
      'Yes. The review can focus on technical accuracy, completeness, reader tasks, or enterprise readiness. Deliverables and access are agreed first.',
    ],
  },
  {
    slug: 'maintenance',
    name: 'Maintenance & Support',
    short: 'Keep the handover alive.',
    category: 'Operate',
    icon: 'pulse',
    summary:
      'Agreed recurring checks, maintenance, troubleshooting, and improvements for Linux and cloud environments.',
    intro:
      'Systems change after launch. I offer a defined recurring scope for teams that need someone to review operational signals, maintain configuration, and follow through on issues.',
    problems: [
      'Patches, alerts, and backups have no clear owner.',
      'Small infrastructure issues accumulate between projects.',
      'Runbooks no longer describe the current setup.',
    ],
    deliverables: [
      'Agreed maintenance schedule and task list',
      'Health, patch, and backup review',
      'Change and incident record',
      'Concise operational report',
      'Prioritized recommendations and updated runbooks',
    ],
    approach: [
      'Establish a baseline, access boundaries, and support expectations.',
      'Agree included work, escalation paths, and maintenance windows.',
      'Perform recurring checks and approved changes.',
      'Report findings, track follow-up, and adjust the scope as needs change.',
    ],
    scope:
      'Support hours, response expectations, and included tasks are agreed in writing. A maintenance arrangement does not imply 24/7 coverage or an uptime SLA.',
    fit: 'Small businesses, agencies, and teams needing a consistent operational owner for an agreed set of systems.',
    related: 'harborlight',
    faq: [
      'Can support follow a one-off project?',
      'Yes. Once the system and documentation are understood, a recurring scope can cover the checks and upkeep that matter most.',
    ],
  },
  {
    slug: 'agency-msp-partnership',
    name: 'Agency & MSP Partnership',
    short: 'More engineering capacity. Less handover friction.',
    category: 'Partner',
    icon: 'nodes',
    summary:
      'Independent, white-label, subcontracted, or overflow infrastructure engineering for agencies and managed service providers.',
    intro:
      'Bring me in for a defined piece of AWS, Azure, Linux, documentation, or automation work. I can operate within your delivery process and keep ownership and communication clear.',
    problems: [
      'A client project needs infrastructure expertise beyond current capacity.',
      'Your team needs a focused engineer for a migration or recovery scope.',
      'Technical handover quality needs to remain consistent.',
    ],
    deliverables: [
      'Written scope and acceptance criteria',
      'Agreed communication and client-facing boundaries',
      'Reviewable implementation and evidence',
      'Documentation in your delivery format',
      'Explicit handover and escalation notes',
    ],
    approach: [
      'Agree delivery boundaries, confidentiality, access, and who speaks to the client.',
      'Fit implementation into your review and change process.',
      'Share progress, risks, and acceptance evidence.',
      'Hand over cleanly under the agreed engagement model.',
    ],
    scope:
      'Availability, subcontracting terms, NDA requirements, and support responsibilities are confirmed per engagement. No client relationship is implied by a portfolio example.',
    fit: 'Agencies and MSPs serving US, Canadian, and remote businesses that need additional infrastructure capacity.',
    related: 'northstar',
    faq: [
      'Can you deliver under my brand?',
      'Yes, where agreed. Client communication, attribution, confidentiality, and responsibilities are defined before work starts.',
    ],
  },
  {
    slug: 'websites',
    name: 'Website Development',
    short: 'A better front door for your business.',
    category: 'Connect',
    icon: 'window',
    summary:
      'Fast, considered business websites with native inquiries, booking integrations, and room for automation as your business grows.',
    intro:
      'Your website should explain your business and make the next step easy. I design and build websites with useful content, accessible interactions, reliable forms, and a maintainable hosting setup.',
    problems: [
      'The current site no longer reflects the business.',
      'Inquiries disappear between a form and an inbox.',
      'Booking and internal tools need to connect to the website.',
    ],
    deliverables: [
      'Content and conversion plan',
      'Responsive website implementation',
      'Technical SEO and social metadata',
      'Forms and agreed integrations',
      'Hosting, publishing, and maintenance handover',
    ],
    approach: [
      'Define the audience, services, content, and conversion path.',
      'Design a coherent visual system around your real brand.',
      'Build and test desktop, mobile, forms, accessibility, and SEO.',
      'Launch with an operating guide and an optional maintenance scope.',
    ],
    scope:
      'Copywriting volume, booking provider, integrations, ongoing fees, and maintenance are agreed before quoting. Search rankings are not guaranteed.',
    fit: 'Service businesses and small teams that want a capable website now and a path to integrations and infrastructure later.',
    related: 'northstar',
    faq: [
      'Can the website grow into a business system?',
      'Yes. A useful progression is website → forms and booking → automation → backend or cloud infrastructure → ongoing maintenance. Each step can be scoped independently.',
    ],
  },
] as const;
export const formServices = [
  'Cloud Infrastructure',
  'Linux / Systems',
  'Automation',
  'Backup / Disaster Recovery',
  'DevOps / IaC',
  'Infrastructure Documentation',
  'Maintenance',
  'Agency / MSP Partnership',
  'Website Development',
  'Something Else',
];
export const projects = [
  {
    slug: 'northstar',
    name: 'NORTHSTAR',
    title: 'Recovery, by design.',
    type: 'Executed infrastructure lab',
    summary: 'From a single Proxmox VM to a repeatable AWS rebuild and verified restore.',
    tags: ['AWS', 'Terraform', 'S3', 'SSM'],
    repo: 'northstar-aws-recovery',
    service: 'backup-disaster-recovery',
    problem:
      'A synthetic repair shop’s job register depended on one Proxmox VM. Losing that machine meant losing access to the application and its SQLite data.',
    constraints:
      'A small Python/SQLite workload, a single application server, and a need for a documented recovery path beyond the original host. This was an executed synthetic engagement, not a paid client deployment.',
    architecture: [
      'Proxmox / source VM',
      'Terraform / AWS EC2',
      'Versioned S3 backups',
      'Restore / SQLite checks',
    ],
    approach: [
      'Define the target infrastructure in Terraform and move the workload to AWS.',
      'Use Systems Manager for administration with no inbound security-group rules.',
      'Keep versioned backups in S3 and configure CloudWatch/SNS monitoring.',
      'Replace the application server, restore the data, and validate both SQLite integrity and application health.',
    ],
    result:
      'Six jobs were recovered, including DR-TEST. SQLite integrity and application health returned ok. One recorded lab recovery took 12 minutes, including a CloudShell interruption.',
    limits:
      'The 12-minute observation is one lab result, not a production RTO commitment. No measured RPO is claimed. AWS resources were destroyed after evidence preservation and cleanup checks.',
    lesson:
      'The next iteration should repeat the exercise under several failure conditions, define a measured RPO, and test backup access when primary credentials or the original environment are unavailable.',
  },
  {
    slug: 'cedarfield',
    name: 'CEDARFIELD',
    title: 'A smaller attack surface.',
    type: 'Executed Ubuntu / WSL2 lab',
    summary:
      'Risk-driven Linux hardening with application checks and a usable operational handover.',
    tags: ['Linux', 'systemd', 'SSH', 'UFW'],
    repo: 'cedarfield-linux-operations',
    service: 'linux-systems',
    problem:
      'A synthetic application ran as root, had broadly readable configuration, permissive SSH settings, and an unnecessary exposed service.',
    constraints:
      'Local Ubuntu/WSL2 execution with isolated server and client namespaces. Changes had to preserve the three-record application and retain a tested rollback path.',
    architecture: [
      'Isolated client',
      'SSH / UFW / Fail2ban',
      'Dedicated service identity',
      'Application / private config',
    ],
    approach: [
      'Capture a baseline before touching access or application configuration.',
      'Introduce a dedicated service identity and private 0600 configuration.',
      'Verify key-only SSH, firewall denial, and application behavior from an isolated owned peer.',
      'Exercise a safe failed-login test, backup integrity checks, and rollback.',
    ],
    result:
      'Two open tested ports were reduced to one. A controlled failed-login test triggered a real Fail2ban ban. The application stayed healthy and final host checks passed.',
    limits:
      'This was a local lab, not a production or Proxmox deployment. Same-disk backups and local health logs remained limitations.',
    lesson:
      'Off-host backups and external health reporting would reduce dependence on the host. Hardening needs repeated verification after application or operating-system changes.',
  },
  {
    slug: 'harborlight',
    name: 'HARBORLIGHT',
    title: 'Operations, made repeatable.',
    type: 'Executed Ubuntu runner lab',
    summary: 'Recurring maintenance checks, verified restores, and guarded recovery workflows.',
    tags: ['Automation', 'Linux', 'SQLite', 'systemd'],
    repo: 'harborlight-operations-automation',
    service: 'automation',
    problem:
      'Manual service and backup reviews made outages, configuration drift, and unusable snapshots easy to miss in a synthetic order-processing workload.',
    constraints:
      'Free Ubuntu runner execution with synthetic data. Recovery actions needed previews and preconditions rather than an unconditional restart on every failure.',
    architecture: [
      'systemd timers',
      'Six operational checks',
      'Verified online backups',
      'Isolated restore drill',
    ],
    approach: [
      'Implement repeatable service, configuration, and backup checks.',
      'Record incident transitions and validate online backups.',
      'Build an isolated restore drill and reject corrupted inputs.',
      'Guard restart actions with preview, preconditions, a lock, and a cooldown.',
    ],
    result:
      '15 live acceptance scenarios and 19 automated boundary tests passed. Outage and drift were detected, unsafe restarts and corrupt restores were refused, and a recovered app served all five orders.',
    limits:
      'Backups and event records remained local. No off-host alert delivery, continuous production monitoring, or SLA is claimed. Rollback removed the owned services after final checks.',
    lesson:
      'A production version should add off-host backup assurance, external event delivery, and explicit alert ownership. Automation needs failure boundaries as much as successful execution.',
  },
] as const;
export const pricing = [
  {
    name: 'Website projects',
    model: 'Fixed scope',
    detail: 'A business website, native inquiries, and an agreed launch plan.',
    service: 'websites',
  },
  {
    name: 'Infrastructure assessment',
    model: 'Fixed scope',
    detail: 'A focused review, prioritized findings, and a practical next-step plan.',
    service: 'cloud-infrastructure',
  },
  {
    name: 'Documentation review',
    model: 'Fixed scope',
    detail: 'An independent review or a defined operational documentation package.',
    service: 'infrastructure-documentation',
  },
  {
    name: 'Workflow automation',
    model: 'Scoped project',
    detail: 'A defined workflow with integrations, validation, and a handover.',
    service: 'automation',
  },
  {
    name: 'Cloud & Linux engineering',
    model: 'Custom scope',
    detail: 'Architecture, migration, hardening, recovery, or deployment work.',
    service: 'linux-systems',
  },
  {
    name: 'Ongoing maintenance',
    model: 'Monthly agreement',
    detail: 'A recurring scope with clear tasks, hours, and response expectations.',
    service: 'maintenance',
  },
];
