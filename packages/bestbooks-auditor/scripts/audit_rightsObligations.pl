% Rule: Confirm that the entity has legal rights to assets and is obligated for liabilities.
legal_rights(Item) :-
    has_legal_rights(Item).

legal_obligations(Item) :-
    has_legal_obligations(Item).

rights_and_obligations_verified :-
    forall(asset(Item), legal_rights(Item)),
    forall(liability(Item), legal_obligations(Item)).
