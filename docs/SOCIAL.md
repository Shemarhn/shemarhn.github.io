# Blog syndication: website → LinkedIn → X

The website is the canonical source. Published Insights are exposed through the internal `/social.json` build endpoint and synchronized into a D1 review queue by the scheduled Worker. The public article remains the full canonical version; LinkedIn and X receive platform-specific copy plus a UTM-tagged link back to the article.

## Safe default

`SOCIAL_MODE=review` is the default. A newly published article becomes one LinkedIn draft and one X draft. Nothing is posted until it is approved in `/admin/social/`. Use `SOCIAL_MODE=automatic` only after staging posts, provider credentials, and copy quality have been verified. `SOCIAL_MODE=off` disables synchronization and publishing.

The admin console can edit copy, save a draft, approve it for the scheduler, publish it immediately, or skip a platform. Published rows are retained as a duplicate-post guard and are not overwritten when the article changes.

## Article metadata

Each Insight may optionally include:

```yaml
social:
  enabled: true
  linkedin: "A LinkedIn-native version of the idea."
  x: "A concise X-native hook."
```

If platform copy is omitted, the build generates a restrained fallback from the title and excerpt. Prefer hand-reviewed platform-native copy for important posts. X copy is limited to 240 characters before the article link so there is room for the URL transformation.

Links are tagged with `utm_source=linkedin` or `utm_source=x`, `utm_medium=social`, and the article slug as the campaign. Inquiry attribution already carries these values into D1 and Orbit.

## LinkedIn

The Worker uses the LinkedIn Posts API with the authenticated member permission `w_member_social`. Configure these Worker secrets/variables:

- `LINKEDIN_ACCESS_TOKEN`
- `LINKEDIN_AUTHOR_URN`
- `LINKEDIN_VERSION` using a currently supported `YYYYMM` API version

The access token is a user authorization credential and must be stored only as a Worker secret. LinkedIn access tokens can expire; a provider authentication failure is surfaced in the admin queue rather than silently dropping the post.

## X

The Worker uses `POST https://api.x.com/2/tweets` with an OAuth 2.0 user-context access token. Configure:

- `X_USER_ACCESS_TOKEN`

The X application must have write permission and the authorized user token must include the current posting scopes required by X (normally `tweet.write`, with the related user/read scopes required by the authorization flow). X developer access is subject to the account's current API plan and may not be free. Keep X disabled/unconfigured rather than purchasing anything without explicit owner approval.

OAuth 2.0 user tokens may need reauthorization/refresh depending on the X app configuration. Authentication failures remain visible in `/admin/social/`; they do not affect the website or LinkedIn queue.

## Duplicate and failure behavior

`social_posts` has a unique `(article_slug, platform)` key. A published row is immutable to the automatic synchronizer, so scheduled runs cannot repost the same article. Missing provider configuration leaves the draft/approval state intact and does not consume attempts.

Once an actual provider publish request has been attempted, any error or lost response is treated as an **uncertain outcome** and the row becomes `failed`. The Worker does not automatically retry it because the provider may already have created the post even though the response was lost. Inspect the LinkedIn/X account first, then deliberately retry or mark the row appropriately. This fail-closed behavior favors avoiding duplicate public posts over unattended retries.

Provider posting is intentionally independent of article publication. A social-provider outage never blocks the website deployment or removes the canonical article.
