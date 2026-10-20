---
title: 'A backup is not a recovery plan'
date: 2026-10-19
author: Shemar Marks
category: Backup & Recovery
tags: [AWS, disaster recovery, S3, operations]
excerpt: 'A successful backup job is one check. A working application after a failure is a different one. Here is how to connect them.'
readTime: 5
status: published
relatedServices: [backup-disaster-recovery, infrastructure-documentation]
relatedCases: [northstar]
---

A backup tells you that a copy was made. A recovery plan tells you how to turn a usable copy into a working service when the original environment is unavailable. The difference matters most when time is short.

For a small business, the starting point can be a single application, one server, and a database file. That is still a system with dependencies: operating-system packages, configuration, secrets, network access, DNS, and someone who knows which steps to run.

## Start with the business interruption

Ask two separate questions. How much recent data could the business afford to lose? How long could it operate without the application? These become recovery point and recovery time objectives—RPO and RTO.

An hourly backup schedule is an input to an RPO discussion, not proof that the objective is met. Failed jobs, delayed transfers, unusable copies, or inaccessible credentials can change the actual recovery point. Likewise, a quick database restore does not establish the time needed to bring the entire service back.

Write down the assumptions. Who can authorize a recovery? Where are credentials available? What happens if the person who normally runs the system is absent?

## Map the things the backup does not contain

A database copy may omit the application version, uploaded files, environment settings, service definitions, or encryption keys. Capture those dependencies before the first drill.

For each item, identify its source of truth, who can access it, and how it reaches a replacement environment. Versioned infrastructure and deployment configuration can reduce manual reconstruction. Secrets need an appropriate independent recovery path; they do not belong in a public repository or a runbook screenshot.

Consider failure boundaries, too. A copy on another disk in the same machine does not address loss of the machine. A copy in the same account may not address account compromise. Isolation needs to match the failures you intend to recover from.

## Restore somewhere clean

Choose a controlled environment that does not endanger production data. Define where restored data will go, which outbound integrations must remain disabled, and what cleanup will remove afterward. Avoid a drill that sends real customer emails or overwrites a production database.

Then perform the recovery using the documented procedure. Record start and finish points, manual decisions, missing prerequisites, and interruptions. A drill that depends on an undocumented command has found a useful documentation defect.

## Check the data and the application

Seeing a process start is not enough. Test the restored data’s integrity, confirm expected records, and use the application in a way that exercises its important dependencies. For SQLite, an integrity check can help establish database consistency, but it does not prove business completeness or that every external dependency is available.

In the [Northstar lab](/work/northstar/), the recorded checks included SQLite integrity, application health, and recovery of six jobs including a deliberately identifiable DR-TEST record. One recovery took 12 minutes. That observation is useful evidence for that lab; it is not a general production promise or a measured RPO.

## Turn the drill into the next version

Keep the result, the environment, and the limits together. Update the procedure where someone had to improvise. Repeat after meaningful changes to the application, storage, identity configuration, or deployment method.

The practical deliverable is a recovery procedure another authorized person can use, backed by a record of what was tested. If your organization has backups but no recent restore evidence, [a scoped recovery review](/services/backup-disaster-recovery/) is a useful next step.

Further reading: [AWS Well-Architected guidance on testing disaster recovery](https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/rel_planning_for_recovery_dr_testing.html).
