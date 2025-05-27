# LLAMA Audit
To add additional **GAAP rules** based on **ASC (Accounting Standards Codification)** to `bestbooks-auditor`, follow this structured approach:

---

## 📘 Background: What is ASC?

The **FASB ASC (Accounting Standards Codification)** organizes U.S. GAAP into topical areas like:

| Topic No. | Topic Name                            |
| --------- | ------------------------------------- |
| 606       | Revenue from Contracts with Customers |
| 842       | Leases                                |
| 330       | Inventory                             |
| 450       | Contingencies                         |

Each topic contains subtopics and sections (e.g., ASC 606-10-25-1).

---

## ✅ Step-by-Step: Add ASC-Based GAAP Rules

### 1. 🔧 Open `$HOME/.bestbooks/gaap_rules.js`

This file contains your list of GAAP rules used by the LLM during audits. The gaap_rules.js is copied to your HOME path under the directory .bestbooks once. Editing this file is safe. If you rename the file, the default gaap_rules.js will be copied again on the next startup.

### 2. ✍️ Add Rules with ASC References

Example:

```js
export const GAAP_RULES = [
  "Revenue should be recognized when control of goods or services is transferred to the customer (ASC 606).",
  "Inventory must be reported at the lower of cost or market value (ASC 330).",
  "Leases should be classified as either finance or operating leases (ASC 842).",
  "Contingent liabilities must be disclosed if probable and reasonably estimable (ASC 450).",
  "Deferred revenue should be recognized over the period the service is delivered (ASC 606-10-25-1).",
  "Depreciation expense must match the useful life of the asset and be consistently applied (ASC 360)."
];
```

You can add as many rules as you want; just keep them **short, clear, and codified**, ideally in plain English with the ASC reference for clarity.

---

## 🧠 Tip: Use FASB’s Free Codification Browser

To find and understand ASC rules:

* Go to [https://asc.fasb.org/](https://asc.fasb.org/)
* Register for **Basic View (Free)** access.
* Browse or search topics by number (e.g., “606”) or concept (e.g., “Revenue recognition”).

---

## 🧪 Example Audit Prompt with Updated Rules

After updating `gaap_rules.js`, `llamaAudit.js` will automatically format the rules and pass them to the `ALIENTELLIGENCE/chiefauditofficer` model for reasoning.

You don’t need to change anything in the audit logic — the new rules will be included in the `prompt`.

---

## ➕ Future Enhancements

* ✅ Add a section in the audit output mapping violations directly to ASC rules.
* 📘 Maintain a separate JSON file like `asc_rules.json` for referencing topic/subtopic metadata.
* 🧠 Group rules by topic for deeper audits (e.g., ASC 606-focused audits only).

---
