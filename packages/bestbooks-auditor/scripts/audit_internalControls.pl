% Rule: Assess the effectiveness of internal controls over financial reporting.
effective_internal_controls :-
    documented_internal_controls,
    regularly_monitored_controls.

internal_controls_assessed :-
    effective_internal_controls.
