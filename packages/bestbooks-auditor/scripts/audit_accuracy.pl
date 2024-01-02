% Rule: Verify the mathematical accuracy of financial statements and supporting documentation.
check_accuracy :-
    financial_statement(Item, Amount),
    sum_all_items(Sum),
    Amount =:= Sum.
