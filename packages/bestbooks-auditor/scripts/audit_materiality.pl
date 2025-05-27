% Rule: Focus on items that are material to the financial statements.
materiality_threshold(100000). % Set a threshold amount

material_item(Item) :-
    financial_statement(Item, Amount),
    materiality_threshold(Threshold),
    Amount >= Threshold.
