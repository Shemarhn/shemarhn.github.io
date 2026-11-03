// Give each buyer a useful first step and deliberate links to adjacent scopes.
export const serviceEngagements: Record<
  string,
  { intake: string; related: string[]; question: string; answer: string }
> = {
  'cloud-infrastructure': {
    intake:
      'Describe the application, current hosting, approximate workload, and why the environment needs to change. Include a target date and acceptable interruption if known. A short assessment can establish dependencies and a migration scope before implementation is quoted.',
    related: ['devops-infrastructure-as-code', 'backup-disaster-recovery', 'maintenance'],
    question: 'Can I start with an infrastructure assessment rather than a migration?',
    answer:
      'Yes. A defined assessment can produce an architecture and dependency map, prioritized risks, and an implementation recommendation. Discovery and implementation can be separate engagements; the findings determine the next scope.',
  },
  'linux-systems': {
    intake:
      'Name the Linux distribution, affected service, symptoms, and recent changes. Note whether a tested backup and an alternative access path exist. Share a sanitized summary first so troubleshooting can be scoped without putting credentials or private logs in the inquiry.',
    related: ['maintenance', 'proxmox-virtualization', 'backup-disaster-recovery'],
    question: 'Can I hire you for a Linux server problem without a maintenance contract?',
    answer:
      'Yes. A one-off diagnosis or configuration review can have its own scope, access boundaries, and acceptance checks. Findings may lead to a separate implementation or maintenance proposal. Availability and any urgent response requirement must be agreed before relying on support.',
  },
  'devops-infrastructure-as-code': {
    intake:
      'Describe the environments, cloud provider, current deployment steps, and where Terraform state or workflow configuration is held. Identify who owns the repository and production approvals. A sanitized description is enough for the first discussion; repository access follows an agreed scope.',
    related: ['cloud-infrastructure', 'automation', 'infrastructure-documentation'],
    question: 'Who owns the Terraform code and deployment workflow after handover?',
    answer:
      'Repository ownership, state location, credentials, approvals, and ongoing maintenance responsibilities are agreed before implementation. The handover includes the configuration and operating instructions needed by your authorized team; ongoing access or maintenance is a separate agreement.',
  },
  'backup-disaster-recovery': {
    intake:
      'Describe the application and data, where backups are stored, the last successful restore test, and the interruption the business could tolerate. Start with one critical workload if a whole-estate recovery plan would be too broad.',
    related: ['cloud-infrastructure', 'proxmox-virtualization', 'infrastructure-documentation'],
    question: 'Can you test our existing backups before recommending a new system?',
    answer:
      'Yes. A scoped restore exercise can evaluate the current copies and procedure in an isolated environment. The agreed checks cover data, application behavior, access, and dependencies. The report records what was recovered, timing boundaries, failed checks, and remaining risks.',
  },
  automation: {
    intake:
      'Describe one repeated task, the systems involved, the current handoff, and what happens when it fails. Include an example with private data removed. The initial scope should define a useful outcome and who will handle exceptions.',
    related: ['devops-infrastructure-as-code', 'maintenance', 'websites'],
    question: 'Can you improve an existing Bash or Python script?',
    answer:
      'Yes. A review can cover configuration, permissions, validation, logging, retries, duplicate handling, and recovery steps. Changes depend on the script and its environment; the scope can focus on one fragile workflow rather than replacing the whole process.',
  },
  'infrastructure-documentation': {
    intake:
      'Identify the readers, the tasks they need to perform, the current documents, and any handover deadline. Explain whether the scope is review, new documentation, or execution testing. A document inventory or sanitized sample is enough for the first discussion.',
    related: [
      'devops-infrastructure-as-code',
      'backup-disaster-recovery',
      'agency-msp-partnership',
    ],
    question: 'What does an infrastructure runbook package include?',
    answer:
      'The scope can include prerequisites, access requirements, task steps, success checks, rollback or recovery actions, escalation boundaries, and an owner for updates. Architecture and dependency notes provide context. Each procedure states whether it was executed, checked against configuration, or reviewed only.',
  },
  maintenance: {
    intake:
      'List the servers and cloud services, current owners, patch and backup routines, and the hours during which help is needed. Identify outstanding incidents separately from routine upkeep so the initial cleanup and recurring work can be scoped clearly.',
    related: ['linux-systems', 'backup-disaster-recovery', 'automation'],
    question: 'What should a monthly Linux or cloud maintenance agreement cover?',
    answer:
      'Agree the systems covered, scheduled checks, patch windows, backup review, included engineering time, reporting, and escalation responsibilities. Major upgrades, migrations, emergency work, and restore exercises should be explicitly included or scoped separately. Support hours and response expectations must be written down.',
  },
  'agency-msp-partnership': {
    intake:
      'Describe the technical scope, deadline, delivery process, and whether work is white-label or directly client-facing. Identify the person who approves changes and accepts the handover. Client names, credentials, and confidential contracts can wait for the agreed access and confidentiality process.',
    related: ['cloud-infrastructure', 'linux-systems', 'infrastructure-documentation'],
    question: 'Can an MSP subcontract a single project rather than ongoing support?',
    answer:
      'Yes. A migration assessment, Linux change, automation workflow, or documentation package can be a defined subcontract. Availability, review checkpoints, client communication, acceptance criteria, and post-handover responsibility are agreed for that project.',
  },
  websites: {
    intake:
      'Describe the business, audience, services, existing site, and the inquiry or booking path you need. Identify who supplies copy and brand assets, required integrations, and the intended launch date. These determine a useful scope and the ongoing hosting or provider costs.',
    related: ['automation', 'cloud-infrastructure', 'maintenance'],
    question: 'Can you build reliable inquiries and integrations into an existing website?',
    answer:
      'A focused forms or integration project can be assessed separately from a new website. The scope covers the existing platform, durable submission handling, delivery destinations, failure visibility, privacy requirements, and the checks needed before launch.',
  },
  'proxmox-virtualization': {
    intake:
      'Bring a sanitized host and guest inventory, hypervisor versions, storage and network layout, backup destinations, and acceptable downtime. A readiness assessment should identify a representative pilot, application checks, and the point after which rollback requires reconciling changed data.',
    related: ['linux-systems', 'backup-disaster-recovery', 'infrastructure-documentation'],
    question: 'What determines the scope of Proxmox migration consulting?',
    answer:
      'Guest count and operating systems, source hypervisor, storage and networking, application dependencies, backup condition, and cutover constraints affect the scope. Start with readiness and a pilot; implementation is accepted only after compatibility, specialist requirements, and rollback boundaries are understood.',
  },
};
