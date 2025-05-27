% Rule: Ensure independence and objectivity of the audit team.
independent_audit_team :-
    no_conflicts_of_interest.

audit_team_objective :-
    independent_audit_team.
