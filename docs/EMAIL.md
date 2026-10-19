# Replyable acknowledgment email

Both adapters send a short plain-text message from `Shemar Marks <hello@shemarmarks.com>`, with replies directed to `hello@shemarmarks.com`. They do not include private project descriptions. The visitor sees a successful receipt after database storage; email delivery has an independent retry record.

## Recommended initial provider: Resend

Set `EMAIL_PROVIDER=resend` and the secret `RESEND_API_KEY`. Verify the domain and configure required DNS. The fixed sender and reply-to mailbox must be yours. Sending-domain verification is separate from having an inbox that actually receives replies.

The inquiry UUID is sent as Resend’s `Idempotency-Key`. Its deduplication window is bounded; consult [Resend’s idempotency documentation](https://resend.com/docs/dashboard/emails/idempotency-keys) when enabling the account. Reconciliation is required before manually retrying old deliveries whose outcome is uncertain. Do not claim exactly-once delivery.

## Google Workspace / Gmail alternative

Set `EMAIL_PROVIDER=gmail` and store `GMAIL_CLIENT_ID`, `GMAIL_CLIENT_SECRET`, and `GMAIL_REFRESH_TOKEN` as Worker secrets. Enable Gmail API in a Google Cloud project. Authorize the sending Workspace account with the narrow `https://www.googleapis.com/auth/gmail.send` scope and offline access; obtain the refresh token through an authorized OAuth flow. Configure `hello@shemarmarks.com` as the actual mailbox or a verified send-as alias for that authorized account.

The adapter refreshes access tokens only server-side and calls `users.messages.send` with a UTF-8 MIME message. Its stable Message-ID helps investigation but **does not make Gmail send requests idempotent**. There is a duplicate-send window if Google accepts a message and the Worker fails before recording delivery. If strict transactional deduplication is necessary, use a receiver that durably deduplicates sends or a transactional provider with appropriate retention guarantees.

An external OAuth app may require Google verification or Workspace administrator approval, depending on its configuration. An app left in testing can have limited refresh-token lifetime. Never store access or refresh tokens in Markdown, GitHub content files, browser bundles, or front-end environment variables.

Official setup: [Gmail send guide](https://developers.google.com/workspace/gmail/api/guides/sending), [Gmail OAuth scopes](https://developers.google.com/workspace/gmail/api/auth/scopes), and [Google OAuth for web-server applications](https://developers.google.com/identity/protocols/oauth2/web-server).

## Verification before enabling production

Send to your own mailbox using a legitimate staged form submission. Confirm From, Reply-To, readable UTF-8, spam placement, and a normal reply arriving in the inbox. Confirm email failure does not remove the inquiry or repeat a completed CRM effect. No live email has been sent from this development build.
