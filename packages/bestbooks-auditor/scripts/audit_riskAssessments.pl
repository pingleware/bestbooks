% Rule: Identify and assess risks of material misstatement in the financial statements.
material_misstatement_risk_low :-
    low_risk_assessment_indicators.

assess_risk_of_misstatement :-
    material_misstatement_risk_low.
