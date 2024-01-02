% Rule: Ensure consistency in accounting methods and reporting between periods.
consistent_methods :-
    accounting_method(CurrentPeriod, Method),
    accounting_method(PreviousPeriod, Method),
    CurrentPeriod \= PreviousPeriod.
