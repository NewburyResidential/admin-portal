import { waveNewburyBusinessId, waveNewburyOperatingId, operatingAccountOptions } from '../account-options';
import Big from 'big.js';

export function getWaveOperatingPayload(entries, normalDate, weirdDate, fileName) {

  const operatingLineItems = entries
    .filter((entry) => {
      try {
        const amount = new Big(entry.amount);
        return !amount.eq(0);
      } catch (e) {
        return false;
      }
    })
    .map((entry) => ({
      accountId: operatingAccountOptions[entry.originalGlId].waveId,
      amount: new Big(entry.amount).abs().toString(),
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
        externalId: `Paylocity Home Office Withdrawal - ${normalDate} ${fileName}`,
        date: weirdDate,
        description: `Paylocity Home Office Withdrawal - ${normalDate}`,
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
