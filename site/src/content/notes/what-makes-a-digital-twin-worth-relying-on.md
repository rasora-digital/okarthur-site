---
title: "What makes a digital twin worth relying on"
description: "What it takes for an owner to rely on a digital twin for a specific decision, and why procurement sets the conditions for reliance rather than guaranteeing it."
pubDate: 2026-07-11
---

Suppose a pump is replaced during planned maintenance. The work order is completed and the asset register is updated, but the model still contains the previous equipment and identifier. A live feed continues to report against the old record.

The following morning, an engineer opens the digital twin to plan further work.

Is the twin wrong? In part. Is it unusable? That depends on the decision being made. It may still show the correct location, access route and connected system. It may no longer be reliable for identifying the installed equipment, checking its maintenance history or ordering a replacement part.

That distinction matters. A digital twin is not reliable in general. It is reliable for defined decisions, at a particular time, within stated limits.

A useful digital twin is a digital representation of an asset or system that is maintained for specified uses. The word doing the work is maintained. It does not need to reproduce everything about the asset, and it does not need every element to be updated at the same frequency. It does need to remain current and complete enough, within agreed tolerances, for the decisions it is intended to support.

For me, reliance is the point at which someone is prepared to act on the information without repeating every check independently. That does not mean accepting the system without question. It means there is enough evidence about the information, its status and its limitations to decide how far it can be used.

## Reliability depends on the decision

Owners often begin by asking how much information a twin should contain. The better starting point is what decisions it needs to support.

A representation intended for long-term renewal planning may tolerate information that is several weeks old, provided material changes are recorded before the next planning cycle. The same delay may be unacceptable where someone is checking the current configuration of an asset before maintenance.

The required fidelity also changes with the use. Precise geometry may be necessary for access or clearance decisions but add little to a condition-based maintenance decision if the relevant inspection and failure information is missing. Capturing more detail does not make the twin more reliable when the detail is unrelated to the decision or too costly to maintain.

The specification therefore needs to identify more than a general purpose such as operations, maintenance or asset management. It should identify the decisions, the information needed for each decision, the acceptable age and accuracy of that information, and the authority of the source.

This also means that one part of a twin can remain usable while another is under review. In the pump example, the unresolved equipment identity should prevent decisions that depend on that identity. It need not prevent the use of verified spatial or system information that has not been affected by the change.

Reliance is therefore bounded. A discrepancy should constrain the decisions it affects, rather than being hidden or treated as proof that the entire twin is either trustworthy or worthless.

## The twin must show the condition of its information

A user cannot make that judgement unless the system shows more than the latest value or image.

For information that matters to a decision, the user may need to know where it came from, when it was last confirmed, whether it has been validated, whether another source conflicts with it and which record is authoritative. The level of detail presented will vary by user, but the underlying status cannot remain inaccessible.

This is what it means to be able to interrogate a twin. It is not simply the ability to navigate a model or open a data panel. It is the ability to trace the information sufficiently to understand what supports it and where reliance should stop.

Not every input needs the same level of assurance. A manually entered observation, a sensor reading, an approved configuration record and an older survey may each be legitimate sources for different purposes. The problem arises when those differences are concealed and the interface presents them with the same apparent authority.

Lower-confidence information should be labelled and controlled. Where it affects a material decision, the system should show that the information is provisional, disputed or awaiting validation. It should also make clear what record governs until the discrepancy is resolved.

In the pump example, the old model record should not continue to appear as an uncontested statement of the installed asset. The unresolved change should be visible, and the owner should know whether the work order, asset register or approved configuration record governs in the meantime.

That is not an interface feature alone. It depends on information governance and operational authority.

## Correspondence has to be maintained through change

The physical asset will continue to change after handover. Components will be replaced, temporary arrangements introduced, defects found, inspections completed and operating configurations altered.

Keeping the digital representation aligned with those changes is an operating process. It cannot be reduced to a general instruction that one party must keep the twin current.

For each material type of change, the operating model needs to answer several practical questions. Who records that the physical change has taken place? Who updates the relevant information? Who checks that the update matches the completed work? When does the revised information become authoritative? Who manages the discrepancy if two records disagree? What are users permitted to do while the position remains unresolved?

These responsibilities may sit with different parties. A maintainer may record the replacement, a delivery supplier may update a model, the asset owner may approve the configuration and an operator may decide whether the information is suitable for a particular operational use. Assigning the broad responsibility to one organisation does not remove the interfaces between them.

Update frequency also needs care. Some information can be refreshed on a regular cycle. Other information needs to be updated when a defined event occurs. A nightly data refresh does not help when the process has failed to record the physical change that should have triggered the update.

The difficult point is often not the technical transfer of information but the change in ownership around it. Construction teams, operators, maintainers and asset owners may use different systems and work to different acceptance processes. A handover that transfers files without establishing who receives, validates and maintains them does not sustain correspondence.

This is why acceptance should test more than whether the required information has been delivered. The receiving organisation needs to be able to use it, trace it, challenge it and continue the process once the delivery team has left.

## Procurement establishes the conditions, not the outcome

Some of these conditions must be secured before appointment and award.

The owner needs to define the decisions the twin will support, the information required for those decisions and the standards against which that information will be accepted. Responsibilities for updating, validating and approving changes need to be explicit. The owner also needs continuing access to the information, its history and its provenance.

Those requirements should not depend entirely on one application or supplier. Technology will change over the life of an asset. The information, authority and operating responsibilities need to survive a change of system.

The ISO 19650 family provides a whole-life framework for managing information, including during operation and maintenance. It is useful for defining information requirements and management processes, but it does not by itself establish that a twin is reliable for a particular decision. That still requires the owner to define the use, tolerances, responsibilities, assurance and consequence of failure.

Procurement can make continuing reliability practical. It can secure information rights, contractual responsibilities, acceptance criteria and a workable route into operation. It cannot ensure that the operating organisation will maintain the information, fund the work, retain the necessary competence or resolve discrepancies promptly.

Those are continuing management duties.

The practical test is therefore not whether a digital twin has been delivered. It is whether the owner can answer, for a particular decision today, which information is authoritative, how current it is, what is known to be uncertain, who can approve a change and what happens until any discrepancy is resolved.

Where those answers are unavailable, the problem is not a lack of visual sophistication. The conditions for reliance have not been established.
