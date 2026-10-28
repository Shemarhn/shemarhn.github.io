// Search intent belongs to the service that can answer it, rather than every page.
export const serviceSearch: Record<string, { title: string; h1: string; context: string }> = {
  'cloud-infrastructure': {
    title: 'AWS & Azure Cloud Infrastructure Consultant',
    h1: 'AWS & Azure infrastructure consulting.',
    context:
      'Cloud infrastructure consulting for small businesses and startups: AWS or Azure deployment, server and network configuration, and migration planning. Compute, identity, networking, monitoring, backup, and cost constraints are considered together. Start with an assessment of the existing environment, then agree the implementation and handover.',
  },
  'linux-systems': {
    title: 'Linux Consultant & Systems Administration',
    h1: 'Linux consulting & systems administration.',
    context:
      'Remote Linux administration and troubleshooting for application servers and virtual machines. Work can include Ubuntu or Debian services, systemd, SSH access, permissions, Nginx, Docker, and server networking. For changes to the virtualization layer, see the dedicated Proxmox service.',
  },
  'devops-infrastructure-as-code': {
    title: 'DevOps & Terraform Infrastructure Consultant',
    h1: 'DevOps & Terraform consulting.',
    context:
      'Infrastructure automation for teams that need reviewable Terraform changes and repeatable delivery. Scope can include existing-resource assessment, state ownership, environment separation, GitHub Actions checks, and deployment runbooks. The NORTHSTAR lab demonstrates Terraform-based AWS rebuilding and recovery, with its limits recorded.',
  },
  'backup-disaster-recovery': {
    title: 'Backup & Disaster Recovery Consultant',
    h1: 'Backup & disaster recovery consulting.',
    context:
      'Backup and recovery planning for Linux, cloud, and virtualized workloads. Define recovery time and recovery point objectives, identify dependencies, isolate backup copies, and test a restore before relying on it. AWS S3-backed recovery and Proxmox source environments are represented in the published lab evidence.',
  },
  automation: {
    title: 'Workflow & Infrastructure Automation Consultant',
    h1: 'Workflow automation consulting.',
    context:
      'Practical automation for recurring operational work, API integrations, and business handoffs. Bash or Python scripts and workflow integrations should expose failures, handle retries deliberately, and leave a record someone can investigate. Start with one repeatable task and a measurable acceptance check.',
  },
  'infrastructure-documentation': {
    title: 'Infrastructure Documentation & Runbook Consultant',
    h1: 'Infrastructure documentation & runbooks.',
    context:
      'Architecture documentation, operating runbooks, deployment guides, and technical documentation reviews for infrastructure teams and software vendors. A review can identify missing prerequisites, ambiguous instructions, unsupported claims, and gaps in recovery procedures. Execution testing is agreed separately from editorial and technical review.',
  },
  maintenance: {
    title: 'Linux & Cloud Infrastructure Maintenance Support',
    h1: 'Linux & cloud maintenance support.',
    context:
      'Ongoing infrastructure maintenance for small teams that need scheduled Linux and cloud checks, patch planning, backup review, troubleshooting, and current runbooks. Managed infrastructure responsibilities, support hours, response expectations, and escalation paths are defined for the engagement; continuous monitoring and 24/7 response are not assumed.',
  },
  'agency-msp-partnership': {
    title: 'White-label Infrastructure Engineer for Agencies & MSPs',
    h1: 'Infrastructure engineering for agencies & MSPs.',
    context:
      'Remote subcontracting and overflow delivery across cloud infrastructure, Linux, automation, recovery, and documentation. Work within your existing review process, with explicit client communication and confidentiality boundaries. Suitable for agencies and MSPs that need a defined project delivered and handed back clearly.',
  },
  websites: {
    title: 'Business Website Development & Integrations',
    h1: 'Business websites & useful integrations.',
    context:
      'Responsive service-business websites with clear content, technical SEO foundations, native inquiries, and agreed integrations. Hosting, form delivery, attribution, accessibility, and maintenance are part of the operating plan. Booking integrations can be scoped when there is a real scheduling workflow.',
  },
  'proxmox-virtualization': {
    title: 'Proxmox Consultant & Virtualization Support',
    h1: 'Proxmox & virtualization consulting.',
    context:
      'Independent help with Proxmox VE virtual machines, Linux guests, migration readiness, server networking, backup boundaries, and operating documentation. ProxCenter documentation review is part of my professional experience; the NORTHSTAR lab separately demonstrates a Proxmox source workload with an AWS recovery path. This service does not imply Proxmox partner status or vendor support entitlement.',
  },
};
