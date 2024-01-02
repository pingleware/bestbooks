% Rule: Verify that all transactions and events are recorded and disclosed in the financial statements.
transaction_recorded(Transaction) :-
    recorded_transaction(Transaction).

all_transactions_recorded :-
    forall(transaction(Transaction), transaction_recorded(Transaction)).
