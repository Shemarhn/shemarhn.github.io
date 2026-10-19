---
title: 'Linux hardening starts with a baseline'
date: 2026-10-19
author: Shemar Marks
category: Linux
tags: [Linux, hardening, SSH, systems administration]
excerpt: 'Before changing SSH, permissions, or firewall rules, understand what the host needs to do—and how you will get back in.'
readTime: 4
status: published
relatedServices: [linux-systems, maintenance]
relatedCases: [cedarfield]
---

A hardening checklist can tell you what to inspect. It cannot tell you which change is safe for your application, your access path, and your operating model. That requires a baseline.

The baseline is a short, useful record of what exists before you change it: services, identities, listeners, configuration permissions, access methods, and the behavior that must continue to work.

## Understand the access path first

Before changing SSH or firewall rules, confirm how you are connected and which recovery paths exist. A console, an alternative authorized session, or a provider management channel can matter more than a perfect-looking configuration file.

Agree a maintenance window if the work might interrupt service. Prepare the rollback before applying the control. Keep an existing authorized session open while testing a new one where practical, and verify from a separate client rather than assuming the current connection proves future access.

## Inventory services and identities

List what listens on the network and why. Map each listener to a service and a business need. An unexpected listener deserves investigation; an expected one still needs the right exposure boundary.

Look at the identity used by the application. Running as root may be convenient during setup, but a dedicated service account can reduce the permissions available to a compromised process. Check what files the service needs to read or write before changing ownership.

Configuration permissions matter as much as process identity. A file containing application secrets should not become broadly readable simply because a deployment procedure copied it with a default mode.

## Change one boundary at a time

Review service configuration, SSH authentication, network controls, and file permissions as related controls. They do different jobs. A firewall rule does not replace application authentication; key-only SSH does not reduce a web application’s filesystem privileges.

Apply a small, agreed change and check the required behavior. Can an authorized user connect? Can the application read configuration and write its own data? Can a client reach the intended service? Is the unwanted path actually denied?

Use tests against systems you own or are authorized to assess. Do not turn a hardening exercise into uncontrolled scanning or a failed-login flood.

## Validate beyond configuration syntax

A configuration can parse and still behave incorrectly. Test from the relevant side of the boundary. In the [Cedarfield lab](/work/cedarfield/), an isolated owned peer helped verify key-only SSH and firewall behavior while application checks confirmed that the three-record workload remained healthy.

The lab reduced two open tested ports to one and verified a controlled Fail2ban ban. Those are specific observations in a local Ubuntu/WSL2 environment. They do not establish production security or guarantee resistance to every attack.

## Leave an operational record

Record what changed, why, how it was checked, and how to reverse it. Note remaining weaknesses such as same-disk backups or local-only health reporting. A useful handover makes the next maintenance event safer.

If the host has no recent inventory or the only documentation is a shell history, begin with a [Linux systems review](/services/linux-systems/) before a broad hardening rollout.

Further reading: [Ubuntu Server documentation on OpenSSH](https://documentation.ubuntu.com/server/how-to/security/openssh-server/).
