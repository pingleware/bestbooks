const GAAP_RULES = [
  // ASC 606 – Revenue from Contracts with Customers
  "Revenue should be recognized when control of goods or services is transferred to the customer (ASC 606-10-25-1).",
  "Revenue must be recognized in an amount that reflects the consideration to which the entity expects to be entitled (ASC 606-10-32-1).",
  "Contract liabilities (deferred revenue) must be recognized when payment is received before delivery (ASC 606-10-45-2).",

  // ASC 330 – Inventory
  "Inventory must be reported at the lower of cost or net realizable value (ASC 330-10-35-1).",
  "Inventory write-downs should be recognized in the same period the loss occurs (ASC 330-10-35-1).",

  // ASC 360 – Property, Plant, and Equipment
  "Depreciation expense must be recognized systematically over the asset’s useful life (ASC 360-10-35-4).",
  "Impairment of long-lived assets must be recognized if the carrying amount is not recoverable (ASC 360-10-35-17).",

  // ASC 842 – Leases
  "All leases greater than 12 months must be reported on the balance sheet as assets and liabilities (ASC 842-20-25-1).",
  "Lease payments should be discounted at the lessee’s incremental borrowing rate (ASC 842-20-30-2).",

  // ASC 450 – Contingencies
  "Loss contingencies must be accrued if the loss is probable and can be reasonably estimated (ASC 450-20-25-2).",
  "Disclosure is required even if no accrual is made, if the loss is at least reasonably possible (ASC 450-20-50-3).",

  // ASC 740 – Income Taxes
  "Deferred tax assets and liabilities must be recognized for future tax effects of temporary differences (ASC 740-10-25-5).",
  "Valuation allowances must reduce deferred tax assets if it's more likely than not they won't be realized (ASC 740-10-30-5).",

  // ASC 230 – Statement of Cash Flows
  "Cash flow from operations must be presented using either the direct or indirect method (ASC 230-10-45-2).",
  "Non-cash investing and financing activities must be disclosed in supplemental information (ASC 230-10-50-3).",

  // ASC 275 – Risks and Uncertainties
  "Entities must disclose significant estimates and concentrations of risk (ASC 275-10-50-8)."
];

module.exports = {
    GAAP_RULES,
}