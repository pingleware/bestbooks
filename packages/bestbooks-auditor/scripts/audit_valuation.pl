% Rule: Ensure that assets and liabilities are valued accurately.
accurate_valuation(Item) :-
    asset_or_liability(Item),
    acceptable_valuation_method(Item).

all_valuations_accurate :-
    forall(asset_or_liability(Item), accurate_valuation(Item)).
