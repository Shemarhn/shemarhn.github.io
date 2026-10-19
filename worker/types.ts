export interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  APP_ENV: string;
  TURNSTILE_SECRET_KEY?: string;
  TURNSTILE_HOSTNAMES?: string;
  LOCAL_FORM_TESTING?: string;
  IP_HASH_SALT?: string;
  CRM_API_URL?: string;
  CRM_API_TOKEN?: string;
  CRM_CREATE_OPPORTUNITY?: string;
  EMAIL_PROVIDER?: string;
  RESEND_API_KEY?: string;
  GMAIL_CLIENT_ID?: string;
  GMAIL_CLIENT_SECRET?: string;
  GMAIL_REFRESH_TOKEN?: string;
  ACCESS_TEAM_DOMAIN?: string;
  ACCESS_AUD?: string;
  ADMIN_EMAILS?: string;
}
export type Lead = {
  name: string;
  email: string;
  company: string;
  website: string;
  service: string;
  description: string;
  timeline: string;
  budget: string;
  metadata: Record<string, string>;
};
export type Reference = {
  name: string;
  email: string;
  company: string;
  title: string;
  service: string;
  quote: string;
  project_date: string;
  project_value: string;
  website: string;
  logo_url: string;
  identity_consent: number;
  value_consent: number;
};
export type Job = {
  id: string;
  lead_id: string;
  kind: 'crm' | 'email';
  attempts: number;
  lease_token: string;
};
