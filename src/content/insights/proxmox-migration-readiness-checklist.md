---
title: 'Proxmox migration readiness: what to check before a cutover'
date: 2026-11-02
author: Shemar Marks
category: Proxmox & Virtualization
tags: [Proxmox, migration, virtualization, recovery]
excerpt: 'Inventory, guest compatibility, storage, network mappings, restore evidence, and rollback decisions to agree before a Proxmox migration.'
readTime: 6
status: published
relatedServices: [proxmox-virtualization, backup-disaster-recovery, infrastructure-documentation]
relatedCases: [northstar]
social:
  enabled: false
---

Before scheduling a Proxmox migration, establish whether the destination can run the workloads, how the applications will be checked, and what happens if the change cannot be accepted. Copying a virtual disk is one step in that decision.

This is a planning checklist for a small business, internal IT team, or MSP preparing an assessment. It is not an executed VMware-to-Proxmox case study or a universal import procedure. The appropriate method depends on the source platform, guest, storage, and versions involved.

## Inventory the service, not just the VM

For each workload, record the owner, application purpose, operating system, virtual CPU and memory, disk sizes, used capacity, boot mode, network interfaces, and dependencies. Include attached storage and anything outside the VM that the application needs: DNS, identity, licenses, certificates, scheduled tasks, backup jobs, and external integrations.

Ask the application owner to identify a successful business operation. A login screen loading is a weaker acceptance check than an authorized user completing a representative task against the expected data.

The useful assessment output is a workload map with unknowns assigned to someone who can resolve them. Do not infer that two similar-looking VMs have the same recovery or migration needs.

## Check guest and destination compatibility

Review the proposed guest configuration against the chosen migration method and current vendor documentation. Firmware, disk controllers, drivers, network adapters, and licensed software may need attention. Identify unsupported or unfamiliar requirements before committing to the work.

Proxmox provides an [official ESXi import-wizard demonstration](https://www.proxmox.com/en/services/training-courses/videos/proxmox-virtual-environment/proxmox-ve-import-wizard-for-vmware) that includes first boot and guest-device checks. That demonstrates an available import path; it does not establish compatibility or downtime for your particular estate.

Check destination hardware, available memory, usable storage, expected I/O, and headroom during the move. Import space, retained source copies, and temporary test workloads all need to fit. Specialist cluster, Ceph, high-availability, or passthrough requirements deserve their own assessment rather than being hidden inside a generic migration quote.

## Make storage and network mappings explicit

Write down where every disk and network interface will land. Confirm the intended bridge, VLAN, subnet, gateway, DNS settings, and access controls with the people responsible for those systems.

An isolated pilot must avoid duplicate addresses and unintended production activity. Decide which outbound jobs, notifications, synchronization tasks, and integrations need to remain disabled in the test environment. A recovered copy that sends real customer messages can create a second incident while you are testing the first change.

Record the source-to-destination mapping in the cutover plan so another authorized engineer can review it. Resolve uncertainty before the maintenance window.

## Establish a recovery path independent of the move

Identify a usable backup, where it lives, who can access it, and what failure it survives. A snapshot on the source storage does not protect against loss of that storage. A successful backup job does not prove the application can be restored.

[Proxmox Backup Server](https://www.proxmox.com/en/products/proxmox-backup-server/features) supports backup verification and remote synchronization. Those features can contribute to a recovery design. Their presence alone does not show that your copies are isolated, your access will survive a failure, or the restored application works.

Test a representative restore in an agreed environment and keep the result. Include configuration and access prerequisites, not only data. The [NORTHSTAR lab](/work/northstar/) illustrates dependency mapping and application validation for a Proxmox-source workload recovered on AWS. It is separate lab evidence, not proof of a VMware-to-Proxmox production migration.

## Use a pilot to answer the remaining questions

Choose a representative workload with an owner who can evaluate the result. Agree the test before running it: boot, service health, expected data, application operation, access controls, resource behavior, and backup coverage after the move.

Record transfer and validation timings with their conditions. Data size, storage performance, network path, and application shutdown requirements affect the result. One pilot helps estimate a cutover; it cannot promise the same timing for every guest.

If a pilot exposes an unsupported dependency or unacceptable interruption, update the plan before expanding the scope. The assessment has still produced something useful: a decision made before a production commitment.

## Decide when rollback stops being simple

Name the person who authorizes the cutover and the person who accepts each application. Define the checkpoints, stop conditions, communications, and recovery steps.

Pay particular attention to new writes. Once users create data on the destination, starting the old source can lose or split changes. Agree how writes are paused, how the final copy is established, and how data will be reconciled if a return becomes necessary. Prevent the source and destination from operating as competing production systems.

After acceptance, assign backup checks, monitoring, patch ownership, and documentation updates. Retiring the source should be a deliberate approved step after the retention and rollback requirements are satisfied.

## Turn the checklist into a bounded engagement

A useful readiness review leaves a workload inventory, unresolved compatibility questions, destination mappings, recovery evidence, a pilot result or pilot plan, and a proposed cutover with acceptance and rollback boundaries. Implementation can then be quoted against what is known.

If you need help establishing those decisions, [describe the environment for a Proxmox consulting assessment](/services/proxmox-virtualization/). Start with a sanitized inventory, source and destination versions, backup arrangements, and the interruption the business can tolerate. Credentials and private configuration can wait for an agreed access process.
