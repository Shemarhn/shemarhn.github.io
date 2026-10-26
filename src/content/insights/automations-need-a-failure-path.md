---
title: 'Every automation needs a failure path'
date: 2026-10-19
author: Shemar Marks
category: Automation
tags: [automation, APIs, reliability, operations]
excerpt: 'A workflow is only useful if you can tell what happened, retry safely, and recover when a dependency is unavailable.'
readTime: 4
status: published
relatedServices: [automation, maintenance, websites]
relatedCases: [harborlight]
---

The successful demonstration of an automation is usually the easy part: a form arrives, a record appears, and an email goes out. The more useful design question is what happens when only one of those steps succeeds.

An API can time out after it has accepted a request. A home server can be offline. A scheduled task can overlap with the previous run. A record can be valid for one system and rejected by another. These are ordinary operating conditions, not unusual exceptions.

## Decide where acceptance happens

For a website inquiry, acceptance should mean that the submission has been durably saved. It should not mean that every downstream service was online at the same instant.

A practical design validates the input, writes the inquiry and its delivery tasks together, then returns a receipt. Separate work attempts CRM synchronization and email delivery. If the CRM is unavailable, the inquiry remains available for a later attempt.

The boundary matters. A message shown before durable storage can reassure the visitor even though the business has no record to recover.

## Make retries safe

Retries are necessary, but repeating an action is not always harmless. The receiving system should recognize a stable external identifier so that the same inquiry does not create several contacts or opportunities.

Use an idempotency key that remains the same across retries. Define how long the receiving system retains that key and what happens if the request body changes. The database should enforce relevant uniqueness rules rather than relying only on an in-memory flag.

For operations automation, safe repetition may require checking the current state before doing anything. A restart task needs a different set of safeguards from a read-only health check.

## Keep effects independent

CRM synchronization and acknowledgment email have different failure modes. If one succeeds, do not repeat it simply because the other failed. Track each delivery independently and record enough diagnostic detail to investigate without copying sensitive payloads into logs.

Use bounded retries and a visible failed state. A task that fails permanently should become something a person can inspect and resolve, rather than spinning silently forever.

## Guard operational actions

The [Harborlight lab](/work/harborlight/) used preview, preconditions, a lock, and a cooldown around a restart workflow. It also tested refusals: unsafe restarts and corrupt restore inputs were rejected.

This is a useful principle beyond server maintenance. An automation should be able to say “I cannot safely continue” while preserving enough context for a person to act. A refusal with a clear reason is often a better outcome than a successful command in the wrong state.

## Test the uncomfortable cases

Before handing over a workflow, try an unavailable dependency, a repeated request, an invalid payload, a timeout, and overlapping execution. Confirm where the durable record lives and how an operator discovers unfinished work.

Then write the intervention steps. Who owns a failed task? Which action is safe to retry? What needs manual verification first? Those answers turn a script into a maintainable system.

If repeated work has grown into a collection of fragile scripts, a [scoped automation project](/services/automation/) can start by mapping the workflow and its failure boundaries.

Further reading: [Cloudflare D1 documentation](https://developers.cloudflare.com/d1/) and [AWS Builders’ Library on idempotent APIs](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/).
