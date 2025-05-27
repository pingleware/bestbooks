% Rule: Ensure that financial statements are presented fairly and all required disclosures are made.
fair_presentation :-
    presented_fairly.

required_disclosures_made :-
    all_required_disclosures_made.

financial_statements_compliant :-
    fair_presentation,
    required_disclosures_made.
