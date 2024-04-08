-- database: /Users/patrickingle/.bestbooks/bestbooks.db

-- Use the ▷ button in the top right corner to run the entire file.

SELECT account_code AS code,account_name AS name,
    ROUND(SUM(debit)-SUM(credit),2) AS balance,accounts.base_type AS type 
    FROM ledger JOIN accounts ON accounts.name=ledger.account_name 
    WHERE accounts.type='Income' OR accounts.type='Expense' 
    GROUP BY ledger.account_name 
    ORDER BY accounts.type;

SELECT * FROM accounts WHERE type="Income" OR type="Expense";

SELECT * FROM ledger ORDER BY account_name;

