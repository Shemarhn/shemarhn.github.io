export type Technology = {
  id: string;
  name: string;
  category: string;
  icon: string;
  description: string;
  service: string;
};
export const technologies: Technology[] = [
  {
    id: 'aws',
    name: 'AWS',
    category: 'Cloud',
    icon: 'amazonwebservices',
    description:
      'Repeatable deployments, S3 backup storage, Systems Manager access, and tested recovery paths.',
    service: 'cloud-infrastructure',
  },
  {
    id: 'azure',
    name: 'Microsoft Azure',
    category: 'Cloud',
    icon: 'azure',
    description:
      'My first cloud platform. Architecture, networking, and deployment shaped around the actual workload.',
    service: 'cloud-infrastructure',
  },
  {
    id: 'gcp',
    name: 'Google Cloud',
    category: 'Cloud',
    icon: 'googlecloud',
    description:
      'Cloud infrastructure principles applied to Google Cloud, with provider-specific implementation scoped deliberately.',
    service: 'cloud-infrastructure',
  },
  {
    id: 'cloudflare',
    name: 'Cloudflare',
    category: 'Cloud',
    icon: 'cloudflare',
    description:
      'Edge delivery, Workers, secure access, and durable website workflows without depending on a single origin server.',
    service: 'websites',
  },
  {
    id: 'linux',
    name: 'Linux',
    category: 'Systems',
    icon: 'linux',
    description:
      'Service management, permissions, hardening, troubleshooting, and a handover that explains how the system operates.',
    service: 'linux-systems',
  },
  {
    id: 'windows',
    name: 'Windows',
    category: 'Systems',
    icon: 'windows11',
    description:
      'Windows environments and their connections to virtualization, networking, applications, and cross-platform workflows.',
    service: 'linux-systems',
  },
  {
    id: 'ubuntu',
    name: 'Ubuntu',
    category: 'Systems',
    icon: 'ubuntu',
    description:
      'Linux application hosts, systemd services, SSH controls, and practical administration.',
    service: 'linux-systems',
  },
  {
    id: 'debian',
    name: 'Debian',
    category: 'Systems',
    icon: 'debian',
    description:
      'A Linux foundation for servers, packages, permissions, and maintainable service configuration.',
    service: 'linux-systems',
  },
  {
    id: 'proxmox',
    name: 'Proxmox',
    category: 'Systems',
    icon: 'proxmox',
    description:
      'On-prem virtualization and virtual machines, considered together with off-host backup and recovery boundaries.',
    service: 'proxmox-virtualization',
  },
  {
    id: 'docker',
    name: 'Docker',
    category: 'Systems',
    icon: 'docker',
    description:
      'Containerized applications with explicit configuration, storage, networking, and operating procedures.',
    service: 'linux-systems',
  },
  {
    id: 'terraform',
    name: 'Terraform',
    category: 'Delivery',
    icon: 'terraform',
    description:
      'Versioned infrastructure, reviewable plans, controlled changes, and repeatable environments.',
    service: 'devops-infrastructure-as-code',
  },
  {
    id: 'ansible',
    name: 'Ansible',
    category: 'Delivery',
    icon: 'ansible',
    description:
      'Configuration automation and repeatable operational tasks, scoped to the environment and its ownership boundaries.',
    service: 'automation',
  },
  {
    id: 'git',
    name: 'Git',
    category: 'Delivery',
    icon: 'git',
    description:
      'Version history and reviewable changes that make implementation intent and rollback easier to understand.',
    service: 'devops-infrastructure-as-code',
  },
  {
    id: 'github',
    name: 'GitHub',
    category: 'Delivery',
    icon: 'github',
    description:
      'Source control, pull-request review, engineering evidence, and a clear record of how a system changes.',
    service: 'devops-infrastructure-as-code',
  },
  {
    id: 'github-actions',
    name: 'GitHub Actions',
    category: 'Delivery',
    icon: 'githubactions',
    description:
      'Automated checks, builds, and deployment workflows with deliberate access and secret handling.',
    service: 'devops-infrastructure-as-code',
  },
  {
    id: 'nginx',
    name: 'Nginx',
    category: 'Backend',
    icon: 'nginx',
    description:
      'Reverse proxying and Linux application delivery with understandable routing and configuration.',
    service: 'linux-systems',
  },
  {
    id: 'python',
    name: 'Python',
    category: 'Backend',
    icon: 'python',
    description:
      'Application utilities, data checks, API integrations, and operational automation.',
    service: 'automation',
  },
  {
    id: 'bash',
    name: 'Bash',
    category: 'Backend',
    icon: 'bash',
    description:
      'Focused system scripts with validation, clear failure behavior, and useful operating notes.',
    service: 'automation',
  },
  {
    id: 'fastapi',
    name: 'FastAPI',
    category: 'Backend',
    icon: 'fastapi',
    description:
      'Typed Python APIs and application integrations, connecting product behavior to its infrastructure.',
    service: 'automation',
  },
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    category: 'Data',
    icon: 'postgresql',
    description:
      'Application data dependencies, connection boundaries, backups, and operating requirements considered together.',
    service: 'cloud-infrastructure',
  },
  {
    id: 'mysql',
    name: 'MySQL',
    category: 'Data',
    icon: 'mysql',
    description:
      'Relational application data with an explicit approach to access, migration, and recovery.',
    service: 'cloud-infrastructure',
  },
  {
    id: 'sqlite',
    name: 'SQLite',
    category: 'Data',
    icon: 'sqlite',
    description:
      'Small application databases with integrity checks and verified restore procedures, as demonstrated in the infrastructure labs.',
    service: 'backup-disaster-recovery',
  },
  {
    id: 'redis',
    name: 'Redis',
    category: 'Data',
    icon: 'redis',
    description:
      'Caching and application data flows, including the GitHub Ranked project’s documented caching layer.',
    service: 'cloud-infrastructure',
  },
  {
    id: 'supabase',
    name: 'Supabase',
    category: 'Data',
    icon: 'supabase',
    description:
      'Application data and backend services, including the documented ClearLedger application stack.',
    service: 'websites',
  },
  {
    id: 'astro',
    name: 'Astro',
    category: 'Web & Apps',
    icon: 'astro',
    description:
      'Fast, statically rendered business websites with useful content and small, focused interactive layers.',
    service: 'websites',
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    category: 'Web & Apps',
    icon: 'typescript',
    description:
      'Typed application and integration code that makes intent, contracts, and maintenance clearer.',
    service: 'websites',
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    category: 'Web & Apps',
    icon: 'javascript',
    description:
      'Browser experiences, API connections, and interactive workflows built around progressive enhancement.',
    service: 'websites',
  },
  {
    id: 'react',
    name: 'React',
    category: 'Web & Apps',
    icon: 'react',
    description:
      'Interactive application interfaces where a component-based runtime is useful to the product.',
    service: 'websites',
  },
  {
    id: 'nextjs',
    name: 'Next.js',
    category: 'Web & Apps',
    icon: 'nextjs',
    description: 'Full-stack web applications, including the documented GitHub Ranked application.',
    service: 'websites',
  },
  {
    id: 'nodejs',
    name: 'Node.js',
    category: 'Web & Apps',
    icon: 'nodejs',
    description:
      'JavaScript and TypeScript tooling, backend workflows, and application integrations.',
    service: 'automation',
  },
  {
    id: 'flutter',
    name: 'Flutter',
    category: 'Web & Apps',
    icon: 'flutter',
    description:
      'Cross-platform application interfaces, including the documented ClearLedger app project.',
    service: 'websites',
  },
];
export const technologyCategories = [
  'All',
  'Cloud',
  'Systems',
  'Delivery',
  'Backend',
  'Data',
  'Web & Apps',
];
