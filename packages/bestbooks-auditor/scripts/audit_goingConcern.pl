% Rule: Evaluate the entitys ability to continue as a going concern.
going_concern_risk_low :-
    low_risk_indicators.

assess_going_concern :-
    going_concern_risk_low.
