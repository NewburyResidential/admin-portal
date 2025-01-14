import { waveNewburyBusinessId, waveNewburyOperatingId, operatingAccountOptions, wavepayrollServicesGl } from '../account-options';
import Big from 'big.js';

export function getWaveOperatingPayload(entries, normalDate, weirdDate, fileName) {
  const operatingLineItems = entries.map((entry) => ({
    accountId: wavepayrollServicesGl,
    amount: entry.amount.toString(),
    balance: 'INCREASE',
  }));

  // Return null if no line items
  if (operatingLineItems.length === 0) {
    return null;
  }

  const total = operatingLineItems.reduce((sum, item) => sum.plus(new Big(item.amount)), new Big(0));

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
        externalId: `Payroll Services Home Office Withdrawal - $${fileName}`,
        date: weirdDate,
        description: `Payroll Services Home Office Withdrawal - ${normalDate}`,
        anchor: {
          accountId: waveNewburyOperatingId,
          amount: total.toString(),
          direction: 'WITHDRAWAL',
        },
        lineItems: operatingLineItems,
      },
    },
  };
}

export { operatingAccountOptions };
