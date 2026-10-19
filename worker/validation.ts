import type { Lead, Reference } from './types.ts';
export class InputError extends Error {
  status = 400;
}
export function string(value: unknown, max = 500, min = 0) {
  if (typeof value !== 'string') {
    if (min) throw new InputError('Please complete all required fields.');
    return '';
  }
  const result = value.trim();
  if (
    result.length < min ||
    result.length > max ||
    /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(result)
  )
    throw new InputError('Please check the length and content of your submission.');
  return result;
}
export function email(value: unknown, required = true) {
  const result = string(value, 254, required ? 3 : 0);
  if (result && !/^[^\s<>@,;]+@[^\s<>@,;]+\.[^\s<>@,;]+$/.test(result))
    throw new InputError('Please enter a valid email address.');
  return result;
}
export function web(value: unknown) {
  const result = string(value, 500);
  if (result) {
    try {
      const url = new URL(result);
      if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password)
        throw Error();
    } catch {
      throw new InputError('Website links must use http:// or https://.');
    }
  }
  return result;
}
export const consent = (value: unknown) => value === true || value === 'on' || value === 'true';
export function validateLead(data: Record<string, unknown>): Lead {
  if (!consent(data.privacy)) throw new InputError('Please read and accept the privacy notice.');
  const services = [
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
  const service = string(data.service, 160, 1);
  if (!services.includes(service)) throw new InputError('Please select a service.');
  const timeline = string(data.timeline, 40, 1);
  if (!['ASAP', 'This month', '1–3 months', 'Just exploring'].includes(timeline))
    throw new InputError('Please select a timeline.');
  const raw =
    data.metadata && typeof data.metadata === 'object' && !Array.isArray(data.metadata)
      ? (data.metadata as Record<string, unknown>)
      : {};
  const metadata: Record<string, string> = {};
  for (const key of [
    'page',
    'cta',
    'source',
    'campaign',
    'referrer',
    'landing_page',
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_term',
    'utm_content',
    'submitted_at',
  ])
    metadata[key] = string(raw[key], key === 'referrer' ? 500 : 250);
  // Attribution is client-reported context, never used as an authorization or trust signal.
  return {
    name: string(data.name, 120, 2),
    email: email(data.email),
    company: string(data.company, 160),
    website: web(data.website),
    service,
    description: string(data.description, 6000, 20),
    timeline,
    budget: string(data.budget, 120),
    metadata,
  };
}
export function validateReference(data: Record<string, unknown>, admin = false): Reference {
  if (!admin && !consent(data.privacy))
    throw new InputError('Please read and accept the privacy notice.');
  const date = string(data.project_date, 7);
  if (date && !/^\d{4}-(0[1-9]|1[0-2])$/.test(date))
    throw new InputError('Project date must use YYYY-MM.');
  return {
    name: string(data.name, 120, 2),
    email: email(data.email, !admin),
    company: string(data.company, 160),
    title: string(data.title, 120),
    service: string(data.service, 160, 2),
    quote: string(data.quote, 4000, 30),
    project_date: date,
    project_value: string(data.project_value, 100),
    website: web(data.website),
    logo_url: web(data.logo_url),
    identity_consent: Number(consent(data.identity_consent)),
    value_consent: Number(consent(data.value_consent)),
  };
}
export function publicReference(row: Record<string, unknown>) {
  if (row.status !== 'approved') return null;
  return {
    name: row.identity_consent ? row.name : 'Client reference',
    company: row.identity_consent ? row.company : '',
    title: row.identity_consent ? row.title : '',
    quote: row.quote,
    service: row.service,
    project_date: row.project_date,
    verified: row.verified ? 'true' : 'false',
    case_study: row.case_study || '',
    public_value:
      row.show_value &&
      (row.value_consent || (row.source === 'admin' && row.owner_value_authorized))
        ? row.project_value
        : '',
  };
}
export function validateModeration(data: Record<string, unknown>, row: Record<string, unknown>) {
  const status = string(data.status, 20, 1);
  if (!['pending', 'approved', 'rejected', 'needs_changes'].includes(status))
    throw new InputError('Choose a valid review status.');
  const case_study = string(data.case_study, 40);
  if (case_study && !['northstar', 'cedarfield', 'harborlight'].includes(case_study))
    throw new InputError('Unknown case study.');
  const show_value = Number(consent(data.show_value));
  if (show_value && !(row.value_consent || (row.source === 'admin' && row.owner_value_authorized)))
    throw new InputError(
      'Project value cannot be published without client consent or authorization on an owner-entered reference.',
    );
  if (show_value && !row.project_value)
    throw new InputError('There is no project value to display.');
  return {
    status,
    quote: string(data.quote, 4000, 30),
    case_study,
    show_value,
    verified: Number(consent(data.verified)),
    moderation_note: string(data.moderation_note, 1000),
  };
}
