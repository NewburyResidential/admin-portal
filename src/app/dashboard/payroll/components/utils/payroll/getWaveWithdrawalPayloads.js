import { waveNewburyBusinessId, waveNewburyPayrollId, waveWithdrawalAccountOptions } from '../account-options';
import Big from 'big.js';

export function getWaveWithdrawalPayloads(depositPayloads, normalDate, weirdDate, fileName) {
  if (!depositPayloads || depositPayloads.length === 0) return null;

  const withdrawalPayloads = [];
  const accountTotals = {};

  // Process each deposit payload and aggregate totals by account type
  depositPayloads.forEach((depositPayload) => {
    const lineItems = depositPayload.variables.input.lineItems;

    // Filter line items to only include withdrawal accounts and aggregate totals
    lineItems.forEach((lineItem) => {
      // Find the originalGlId by matching the waveId
      const originalGlId = Object.keys(waveWithdrawalAccountOptions).find(
        (key) => waveWithdrawalAccountOptions[key].waveId === lineItem.accountId
      );

      if (originalGlId && waveWithdrawalAccountOptions[originalGlId]) {
        if (!accountTotals[originalGlId]) {
          accountTotals[originalGlId] = new Big(0);
        }
        accountTotals[originalGlId] = accountTotals[originalGlId].plus(new Big(lineItem.amount));
      }
    });
  });

  // Create separate payload for each account type with aggregated totals
  Object.entries(accountTotals).forEach(([originalGlId, total]) => {
    try {
      if (total.eq(0) || !waveWithdrawalAccountOptions[originalGlId]) return;

      const accountLabel = waveWithdrawalAccountOptions[originalGlId].label;

      // Create payload for this account type
      withdrawalPayloads.push({
        query:
          'mutation ($input: MoneyTransactionCreateInput!) { moneyTransactionCreate(input: $input) { didSucceed inputErrors { path message code } transaction { id } } }',
        variables: {
          input: {
            businessId: waveNewburyBusinessId,
            externalId: `Withdrawal - ${normalDate} ${fileName} - ${accountLabel}`,
            date: weirdDate,
            description: `${accountLabel} Merge Withdrawal - ${normalDate}`,
            anchor: {
              accountId: waveNewburyPayrollId,
              amount: total.abs().toString(),
              direction: 'WITHDRAWAL',
            },
            lineItems: [
              {
                accountId: waveWithdrawalAccountOptions[originalGlId].waveId,
                amount: total.abs().toString(),
                balance: 'DECREASE', // Withdrawals decrease the liability accounts
              },
            ],
          },
        },
      });
    } catch (e) {
      // Skip invalid entries
      return;
    }
  });

  return withdrawalPayloads.length > 0 ? withdrawalPayloads : null;
}
