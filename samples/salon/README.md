# Synthetic export reconciliation

This is an original, AI-assisted spreadsheet demonstration, not a commissioned client case study. All transaction identifiers, dates and amounts are synthetic.

[Download the Excel workbook](salon-reconciliation-demo.xlsx) · [View the overview](salon-reconciliation-preview.png)

The workbook has an overview, a matching sheet and two raw exports. Each export has 12 rows. Their 12 unique transaction keys include records that appear on only one side. The spreadsheet flags missing records, duplicate keys and amount differences, while keeping all raw rows.

| Check | Result |
|---|---:|
| POS raw net, including duplicate rows | CNY 1,544.00 |
| Bank raw net, including duplicate rows | CNY 1,666.00 |
| Bank minus POS | CNY 122.00 |
| Matching groups / groups needing review | 6 / 6 |

Receipts are positive and refunds are negative. Refunds use separate transaction keys in this example; real orders with multiple refunds need an agreed event key. A duplicate flag does not prove double payment. A difference does not prove a fee. The raw totals are not deduplicated revenue.

The formulas use `COUNTIF`, `SUMIF`, `IF`, `AND`, `OR`, `ROUND`, `SUM` and `COUNTA`. All 104 formula caches and the chart caches were checked against independent raw-row arithmetic. OfficeCLI structural and formula-error checks passed, and all four sheets were visually checked in an HTML preview. The file contains no macros or external workbook links. It has not been opened in an actual Excel 2016 GUI.

This is a fixed 12-row example: changing existing amounts can recalculate; adding rows or changing transaction keys requires rebuilding the matching list and updating ranges. A paid project starts with agreed source fields, matching rules, refund signs and acceptance checks. This sample does not supply a complete salon dashboard or commission system.
