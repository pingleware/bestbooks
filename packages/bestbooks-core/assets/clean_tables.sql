DELETE FROM accounts;
DELETE FROM ledger;
DELETE FROM journal;
UPDATE sqlite_sequence SET seq=0 WHERE name='journal';
UPDATE sqlite_sequence SET seq=0 WHERE name='ledger';
UPDATE sqlite_sequence SET seq=0 WHERE name='accounts';
