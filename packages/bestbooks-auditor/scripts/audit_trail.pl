% Rule: Trace transactions from the original source documents through the accounting records to the financial statements.
traceable(Transaction) :-
    traced_to_source_documents(Transaction).

audit_trail_intact :-
    forall(transaction(Transaction), traceable(Transaction)).
