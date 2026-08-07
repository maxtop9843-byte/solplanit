# SolPlanit Calculation Specification

Extracted from `PRODUCT_SPEC.md` §6 on 2026-08-08 when the rest of that document was archived.

This is a live engineering contract: the calculation code and its tests implement exactly these
formulas. The redesign changes presentation, not arithmetic. Any change here requires a matching
change in the calculation modules and their tests.

The remaining sections of the old product specification are archived at
`docs/archive/PRODUCT_SPEC.md` and are no longer valid.

## Calculation baseline

- Daily generation = capacity (kW) × average daily generation hours
- Monthly generation = capacity × average daily generation hours × days in month
- Annual generation = capacity × average daily generation hours × 365
- Monthly REC quantity = monthly generation (kWh) × REC weight ÷ 1000
- REC revenue = REC quantity × REC price
- SMP revenue = monthly generation × SMP price
- Total generation revenue = SMP revenue + REC revenue

All results must be presented as estimates. Regional solar resource, roof geometry, shading,
structural conditions, equipment efficiency, losses, tariff rules, and market prices may change
actual results.

## Professional analysis source

Professional generation estimates come from the European Commission JRC PVGIS 5.3 non-interactive
API rather than the baseline formulas above. The verified parameter mapping, response field mapping,
and error behaviour are recorded in `docs/QA-002-PVGIS-5.3-VALIDATION.md`.

## Required test coverage

For every calculation change, cover:

- Units
- Boundary values
- Rounding
- Missing inputs
- Invalid inputs
- Assumption changes
- Monthly and annual consistency
