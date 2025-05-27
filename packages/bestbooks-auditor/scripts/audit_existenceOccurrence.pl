% Rule: Confirm the existence of assets and the occurrence of transactions.
asset_exists(Item) :-
    exists_in_physical_form(Item).

transaction_occurred(Transaction) :-
    occurred_as_per_records(Transaction).

all_assets_exist :-
    forall(asset(Item), asset_exists(Item)).

all_transactions_occurred :-
    forall(transaction(Transaction), transaction_occurred(Transaction)).
