import type { Env, Lead } from './types.ts';
import { signatureHtml, signatureText } from './email-signature.ts';
export interface CRMAdapter {
  deliver(id: string, lead: Lead): Promise<void>;
}
export interface EmailAdapter {
  send(id: string, lead: Lead): Promise<void>;
}
const timeout = () => AbortSignal.timeout(12000);
export class ConfigurationError extends Error {}
export class DeliveryError extends Error {
  permanent: boolean;
  constructor(message: string, permanent = false) {
    super(message);
    this.permanent = permanent;
  }
}
async function requireOK(response: Response, provider: string) {
  if (!response.ok)
    throw new DeliveryError(
      `${provider} returned HTTP ${response.status}`,
      response.status >= 400 &&
        response.status < 500 &&
        ![408, 409, 425, 429].includes(response.status),
    );
}
export function crmAdapter(env: Env): CRMAdapter {
  return {
    async deliver(id, lead) {
      if (!env.CRM_API_URL || !env.CRM_API_TOKEN)
        throw new ConfigurationError('CRM configuration missing');
      const url = new URL(env.CRM_API_URL);
      if (url.protocol !== 'https:' || url.username || url.password)
        throw new ConfigurationError('CRM requires an HTTPS endpoint');
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.CRM_API_TOKEN}`,
          'Content-Type': 'application/json',
          'Idempotency-Key': id,
        },
        body: JSON.stringify({
          version: 1,
          externalId: id,
          contact: {
            name: lead.name,
            email: lead.email,
            company: lead.company,
            website: lead.website,
          },
          lead: {
            service: lead.service,
            description: lead.description,
            timeline: lead.timeline,
            budget: lead.budget,
            attribution: lead.metadata,
          },
          activity: { type: 'website_inquiry', source: 'shemarmarks.com' },
          opportunity: {
            create: env.CRM_CREATE_OPPORTUNITY === 'true',
            name: `${lead.service} inquiry`,
          },
        }),
        signal: timeout(),
        redirect: 'error',
      });
      await requireOK(response, 'CRM');
    },
  };
}
function emailParagraphs(lead: Lead) {
  const first = lead.name.split(/\s+/)[0];
  return [
    `Hi ${first},`,
    `Thanks for reaching out. I’ve received your message about ${lead.service}.`,
    'I’ll review what you sent and get back to you personally.',
    'If there’s anything else that would be useful for me to know, just reply to this email.',
  ];
}
export function emailText(lead: Lead) {
  return [...emailParagraphs(lead), signatureText].join('\n\n');
}
export function emailHtml(lead: Lead) {
  const escape = (value: string) =>
    value.replace(
      /[&<>"']/g,
      (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!,
    );
  return `<!doctype html><html lang="en"><body style="margin:0;padding:20px;background-color:#ffffff;color:#1f2937;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6">${emailParagraphs(
    lead,
  )
    .map((p) => `<p style="margin:0 0 18px">${escape(p)}</p>`)
    .join('')}<div style="padding-top:8px">${signatureHtml()}</div></body></html>`;
}
function base64Utf8(value: string) {
  let binary = '';
  new TextEncoder().encode(value).forEach((byte) => (binary += String.fromCharCode(byte)));
  return btoa(binary);
}
export function gmailMessage(id: string, lead: Lead) {
  const boundary = `sm-${crypto.randomUUID()}`;
  const part = (type: string, value: string) =>
    `--${boundary}\r\nContent-Type: ${type}; charset=UTF-8\r\nContent-Transfer-Encoding: base64\r\n\r\n${base64Utf8(
      value,
    )
      .match(/.{1,76}/g)!
      .join('\r\n')}\r\n`;
  const raw = `From: Shemar Marks <hello@shemarmarks.com>\r\nTo: ${lead.email}\r\nReply-To: hello@shemarmarks.com\r\nSubject: Thanks for reaching out\r\nMessage-ID: <${id}@shemarmarks.com>\r\nMIME-Version: 1.0\r\nContent-Type: multipart/alternative; boundary="${boundary}"\r\n\r\n${part('text/plain', emailText(lead))}${part('text/html', emailHtml(lead))}--${boundary}--\r\n`;
  return base64Utf8(raw).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
export function emailAdapter(env: Env): EmailAdapter {
  return {
    async send(id, lead) {
      const from = 'Shemar Marks <hello@shemarmarks.com>';
      const subject = 'Thanks for reaching out';
      const text = emailText(lead);
      if (env.EMAIL_PROVIDER === 'gmail') {
        if (!env.GMAIL_CLIENT_ID || !env.GMAIL_CLIENT_SECRET || !env.GMAIL_REFRESH_TOKEN)
          throw new ConfigurationError('Gmail configuration missing');
        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          body: new URLSearchParams({
            client_id: env.GMAIL_CLIENT_ID,
            client_secret: env.GMAIL_CLIENT_SECRET,
            refresh_token: env.GMAIL_REFRESH_TOKEN,
            grant_type: 'refresh_token',
          }),
          signal: timeout(),
        });
        await requireOK(tokenResponse, 'Gmail OAuth');
        const token = (await tokenResponse.json()) as { access_token: string };
        const response = await fetch(
          'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token.access_token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ raw: gmailMessage(id, lead) }),
            signal: timeout(),
          },
        );
        await requireOK(response, 'Gmail');
      } else {
        if (!env.RESEND_API_KEY) throw new ConfigurationError('Email configuration missing');
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
            'Idempotency-Key': id,
          },
          body: JSON.stringify({
            from,
            to: [lead.email],
            reply_to: 'hello@shemarmarks.com',
            subject,
            text,
            html: emailHtml(lead),
          }),
          signal: timeout(),
        });
        await requireOK(response, 'Email');
      }
    },
  };
}
