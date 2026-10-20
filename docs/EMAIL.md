# Replyable acknowledgment email

Both adapters send a short message from `Shemar Marks <hello@shemarmarks.com>`, with replies directed to `hello@shemarmarks.com`. HTML includes a clickable SM logo and contact signature, with a complete plain-text alternative. Gmail uses multipart/alternative with UTF-8 base64 parts. The logo is a small first-party PNG; no tracking pixels or external fonts are included. User-supplied greeting/service text is HTML-escaped, and private project descriptions are excluded. The visitor sees a successful receipt after database storage; email delivery has an independent retry record.

## Recommended initial provider: Google Workspace / Gmail

The launch configuration uses the existing Google Workspace account so the website does not add another paid service. Set `EMAIL_PROVIDER=gmail` and store `GMAIL_CLIENT_ID`, `GMAIL_CLIENT_SECRET`, and `GMAIL_REFRESH_TOKEN` as Worker secrets. Enable Gmail API in a Google Cloud project. Authorize the sending Workspace account with the narrow `https://www.googleapis.com/auth/gmail.send` scope and offline access; obtain the refresh token through an authorized OAuth flow. Configure `hello@shemarmarks.com` as an actual mailbox or a verified send-as alias for the authorized account, and confirm replies arrive normally.

The adapter refreshes access tokens only server-side and calls `users.messages.send` with a UTF-8 MIME message. Its stable Message-ID helps investigation but **does not make Gmail send requests idempotent**. There is a duplicate-send window if Google accepts a message and the Worker fails before recording delivery. Before manually retrying an uncertain old delivery, inspect the mailbox/provider state rather than assuming it failed.

An external OAuth app may require Google verification or Workspace administrator approval depending on its configuration. An app left in testing can have limited refresh-token lifetime. Prefer an internal Workspace app where the account configuration supports it. Never store access or refresh tokens in Markdown, GitHub content files, browser bundles, or front-end environment variables.

Official setup: [Gmail send guide](https://developers.google.com/workspace/gmail/api/guides/sending), [Gmail OAuth scopes](https://developers.google.com/workspace/gmail/api/auth/scopes), and [Google OAuth for web-server applications](https://developers.google.com/identity/protocols/oauth2/web-server).

## Optional alternative: Resend

The Resend adapter remains available if transactional-email requirements later justify it. Set `EMAIL_PROVIDER=resend` and the secret `RESEND_API_KEY`, verify the sending domain, and confirm `hello@shemarmarks.com` still receives replies. The inquiry UUID is sent as Resend's idempotency key. Do not create or pay for a separate provider merely for launch if the existing Workspace setup is sufficient.

## Verification before enabling production

Send a legitimate staged inquiry to your own mailbox. Confirm From, Reply-To, readable UTF-8, spam placement, and a normal reply arriving in the inbox. Confirm an email failure does not remove the inquiry or repeat a completed CRM effect. Also verify SPF, DKIM, and DMARC before changing DNS providers. No live acknowledgment should be enabled until the staging test succeeds.
