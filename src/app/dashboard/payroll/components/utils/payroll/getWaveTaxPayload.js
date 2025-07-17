import { waveNewburyBusinessId, waveNewburyPayrollId, taxAccountOptions } from '../account-options';
import Big from 'big.js';

export function getWaveTaxPayload(results, normalDate, weirdDate, fileName) {
  // Create map to store aggregated tax amounts
  const aggregatedTaxAmounts = new Map();

  // Aggregate tax amounts
  results.forEach((row) => {
    const { 'Debit Amount': debitAmount = '0', 'Credit Amount': creditAmount = '0' } = row;
    const glAccountId = (row.Account || row.account || "").trim();
    const rawAmount = debitAmount || creditAmount || '0';

    let amount;
    try {
      amount = new Big(rawAmount);
      if (amount.eq(0)) return;
    } catch (e) {
      return;
    }

    if (taxAccountOptions[glAccountId]) {
      const taxKey = glAccountId;
      if (!aggregatedTaxAmounts.has(taxKey)) {
        aggregatedTaxAmounts.set(taxKey, {
          glAccountId: taxAccountOptions[glAccountId].waveId,
          description: taxAccountOptions[glAccountId].label,
          amount: new Big(0),
        });
      }
      aggregatedTaxAmounts.get(taxKey).amount = aggregatedTaxAmounts.get(taxKey).amount.plus(amount);
    }
  });

  // Process tax amounts into line items
  const taxLineItems = Array.from(aggregatedTaxAmounts.values())
    .filter((taxEntry) => !taxEntry.amount.eq(0))
    .map((taxEntry) => ({
      accountId: taxEntry.glAccountId,
      amount: taxEntry.amount.abs().toString(),
      balance: 'DECREASE',
    }));

  // Return null if no line items
  if (taxLineItems.length === 0) {
    return null;
  }

  // Calculate total amount
  const total = taxLineItems.reduce((sum, item) => sum.plus(new Big(item.amount)), new Big(0));

  // Return null if total is 0
  if (total.eq(0)) {
    return null;
  }

  return {
    query:
      'mutation ($input: MoneyTransactionCreateInput!) { moneyTransactionCreate(input: $input) { didSucceed inputErrors { path message code } transaction { id } } }',
    variables: {
      input: {
        businessId: waveNewburyBusinessId,
        externalId: `Paylocity Tax Withdrawal - ${normalDate} ${fileName}`,
        date: weirdDate,
        description: `Paylocity Tax Withdrawal - ${normalDate}`,
        anchor: {
          accountId: waveNewburyPayrollId,
          amount: total.toString(),
          direction: 'WITHDRAWAL',
        },
        lineItems: taxLineItems,
      },
    },
  };
}
