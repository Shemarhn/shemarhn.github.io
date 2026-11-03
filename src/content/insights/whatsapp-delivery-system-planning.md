---
title: 'What to scope before building a WhatsApp-integrated delivery system'
date: 2026-11-03
author: Shemar Marks
category: Automation
tags: [WhatsApp, application development, API integrations, delivery operations]
excerpt: 'Define order ownership, customer messages, exceptions and launch acceptance before commissioning a delivery application with WhatsApp integration.'
readTime: 6
status: published
relatedServices: [automation, websites]
relatedCases: [neilus-delivery-system]
social:
  enabled: false
---

A request to “connect our delivery system to WhatsApp” can describe several different projects. The business might need customer notifications, an inbox for dispatchers, driver updates, order intake, or a complete application behind those conversations. Those scopes have different costs, responsibilities and acceptance checks.

Before requesting a quote, describe the delivery process and the decisions the system needs to support. The messaging integration should follow that process.

At Neilus Solutions, I was the sole developer of a JIT delivery system integrated with WhatsApp. I built and delivered the application; launch is pending. Read the [professional work summary](/work/neilus-delivery-system/) for the scope of my contribution. Here, I outline the questions I would agree with a buyer before building a delivery integration. The examples are general planning guidance; the Neilus implementation remains private.

## Decide which problem the first release will solve

Start with one concrete operational problem: dispatchers repeatedly answer order-status questions, orders arrive without enough information, or staff cannot tell which deliveries need intervention. Describe what happens today and what a useful replacement would let someone do.

Separate the application from the communication channel. An existing order system that needs notifications is a smaller scope than a new delivery application with customer records, dispatching and staff access. A chatbot, payment integration, route optimization and live driver tracking should each be an explicit decision, rather than assumptions hidden inside “WhatsApp integration.”

A first phase can cover one workflow and a clear handover. Additional capabilities can be scoped once that workflow is understood.

## Define the delivery record and who can change it

Choose the authoritative record for each delivery. Give it a stable reference and agree the minimum information needed to carry out the work. Then identify who can create, assign, cancel or complete it, and what evidence each action requires.

For example, a business might choose these rules:

| Business event                 | Decision to agree before implementation                                                      |
| ------------------------------ | -------------------------------------------------------------------------------------------- |
| An order is accepted           | Which details are required, who confirms acceptance and which record receives the reference? |
| A delivery is assigned         | Who can assign or reassign it, and how does the next person learn about the change?          |
| An address or time changes     | Who approves the change, and which earlier instruction must be corrected?                    |
| A delivery cannot be completed | Where is the reason recorded, and who decides the next action?                               |
| A delivery is completed        | What counts as completion, who records it and how can a disputed entry be reviewed?          |

This is a scoping example, not a specification for every delivery business. The useful output is an agreed set of states, permitted transitions and responsibilities. Otherwise, an application can send polished messages while staff still disagree about what the order status means.

## List each message and the response it needs

For every planned message, write down its trigger, recipient, necessary information and owner. Decide whether a reply changes the delivery record, enters a staff queue, or needs a person to review it first.

Keep customer notifications separate from marketing. A customer who wants an order update should not have to receive unrelated promotions to use the service. Define how messaging preferences are collected, how opt-outs reach the application and how staff handle someone who cannot be reached through WhatsApp.

The current [WhatsApp Business Messaging Policy](https://whatsappbusiness.com/policy/) requires recipient permission and honoring opt-out requests. It also limits when businesses can send free-form messages: on the Business Platform, replies without a template are permitted within the 24-hour customer-service window; outside that window, approved templates are required. Review the current rules for the intended message types during scoping, including a clear escalation route when automation needs a person.

These requirements affect the workflow and message content. Account setup, template preparation, review and ongoing provider charges belong in the engagement scope. Approval and charges are external dependencies, so avoid promising a launch date based only on development time.

## Keep message delivery separate from parcel delivery

A WhatsApp message reaching a customer's device does not mean a parcel reached its destination. A read receipt does not mean the customer accepted a schedule change. WhatsApp's [read-receipt guidance](https://faq.whatsapp.com/665923838265756/) describes message delivery and reading, rather than completion of a business task.

Use distinct labels for the business record and the communication record. Staff should be able to distinguish “delivery assigned,” “notification attempted,” and any message status actually available from the chosen integration. A missing receipt should remain an unknown communication outcome, rather than becoming a completed delivery or an instruction to resend indefinitely.

Agree what staff do when an important update has no confirmed communication outcome: review a queue, contact the customer through an agreed alternative, or pause the next action. The decision depends on the operation and the urgency of the message.

## Plan for repeated events and partial failures

A customer can submit twice. A staff member can click again after a slow response. An integration can become unavailable after the delivery record has changed. Define what should happen before these cases become support incidents.

For an API-based integration, include event handling and recovery in the design. The [official WhatsApp developer hub](https://whatsappbusiness.com/developers/developer-hub/) provides the platform's setup, testing, webhook, error and rate-limit resources. Confirm the actual integration method and its behavior rather than assuming every provider works the same way.

As design requirements, ask for a stable order reference, a way to recognize repeated work, separate records of business changes and message attempts, and a visible route for unfinished tasks. Decide when a retry is safe and when someone must check the outcome first. Retrying a notification and creating a second delivery are very different actions.

An operator should be able to answer: which order was affected, what completed, what remains uncertain, and what action is safe next? Avoid putting unnecessary customer message content or private delivery details into diagnostic logs.

## Treat handover and launch as separate milestones

An application can be built and delivered while operational launch still depends on account access, configuration, training or a business decision. Record those remaining dependencies explicitly. The Neilus system's delivered, launch-pending status is an example of why those words should remain distinct.

For a new engagement, agree who controls the business account, phone number, provider relationship, hosting, billing and credentials. Identify the people responsible for message content, staff access and failed-work review. Include deployment instructions, configuration guidance and recovery steps in the handover.

Before launch, agree acceptance scenarios and retain their actual results. Useful scenarios include a normal delivery, a duplicate submission, a changed address, cancellation after assignment, an unavailable integration and a customer opting out. Test with authorized recipients and appropriate test data. Demonstrating one successful message does not establish that all of those paths work.

If the work also includes a CRM, define that boundary separately. My [Orbit CRM project](/work/orbit-crm/) is internal application development for my own practice, with production activation pending. For a combined delivery and CRM scope, agree which application owns each record and how the handoff between them will be checked.

## Prepare a brief that can be scoped

A useful first brief contains the current workflow, staff roles, existing software, the first problem to solve, desired messages, exception handling and the intended launch owner. Add known timing and budget constraints, and name the features that can wait.

You do not need to send credentials or a list of customer phone numbers to start that discussion. A sanitized example of an order and a description of how staff handle it are more useful at this stage.

For help connecting an existing business application to a communication channel, start with a [scoped automation and API integration discussion](/services/automation/). If the project also needs a new customer-facing website or inquiry flow, include that in the [website and integration scope](/services/websites/). The first deliverable should be a shared understanding of the workflow, its boundaries and how the business will know the agreed work is ready.
