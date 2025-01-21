import { waveNewburyBusinessId, waveNewburyPayrollId, depositAccountOptions } from '../account-options';
import Big from 'big.js';

export function getWaveDepositPayloads(entriesByAsset, normalDate, weirdDate, propertyAmounts, fileName) {
  const depositPayloads = [];

  // Iterate through each property in entriesByAsset
  Object.entries(entriesByAsset).forEach(([propertyId, entries]) => {
    // First calculate the total of all line items
    const lineItemsTotal = entries
      .filter((entry) => {
        try {
          const amount = new Big(entry.amount);
          return !amount.eq(0);
        } catch (e) {
          return false;
        }
      })
      .reduce((sum, entry) => sum.plus(new Big(entry.amount)), new Big(0));

    // Calculate direct deposit amount (total minus property amount)
    const directDepositAmount = lineItemsTotal.minus(new Big(propertyAmounts[propertyId]));

    const directDepositLineItem = {
      accountId: depositAccountOptions['222404'].waveId,
      amount: directDepositAmount.abs().toString(),
      balance: 'INCREASE',
    };
    const depositLineItems = entries
      .filter((entry) => {
        try {
          const amount = new Big(entry.amount);
          return !amount.eq(0);
        } catch (e) {
          return false;
        }
      })
      .map((entry) => ({
        accountId: depositAccountOptions[entry.originalGlId].waveId,
        amount: new Big(entry.amount).abs().toString(),
        balance: 'INCREASE',
      }));

    depositLineItems.unshift(directDepositLineItem);

    // Return early if no line items
    if (depositLineItems.length === 0) return;

    const total = depositLineItems.reduce((sum, item) => sum.plus(new Big(item.amount)), new Big(0));

    // Skip this property if total is 0
    if (total.eq(0)) return;

    // Create payload for this property
    depositPayloads.push({
      query:
        'mutation ($input: MoneyTransactionCreateInput!) { moneyTransactionCreate(input: $input) { didSucceed inputErrors { path message code } transaction { id } } }',
      variables: {
        input: {
          businessId: waveNewburyBusinessId,
          externalId: `Paylocity Deposit - ${normalDate} ${fileName} - ${entries[0]?.label}`,
          date: weirdDate,
          description: `Paylocity Deposit - ${normalDate} - ${entries[0]?.label}`,
          anchor: {
            accountId: waveNewburyPayrollId,
            amount: total.toString(),
            direction: 'DEPOSIT',
          },
          lineItems: depositLineItems,
        },
      },
    });
  });

  // Return null if no payloads were created
  return depositPayloads.length > 0 ? depositPayloads : null;
}
