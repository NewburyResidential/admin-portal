import { waveNewburyBusinessId, waveNewburyOperatingId, operatingAccountOptions, waveGlConversion } from '../account-options';
import Big from 'big.js';

export function getWaveOperatingPayload(entries, normalDate, weirdDate, fileName) {
  const operatingLineItems = entries.flatMap((entry) =>
    Object.entries(entry.breakout).map(([glId, amount]) => ({
      accountId: waveGlConversion[glId],
      amount: amount.toString(),
      balance: 'INCREASE',
    }))
  );

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
        externalId: `Trakpay Home Office Withdrawal -jljk ${fileName}`,
        date: weirdDate,
        description: `Trakpay Home Office Withdrawal - ${normalDate}`,
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
