import getSuggestedReceipts from './getSuggestedReceipts';
import getUnapprovedTransactions from './getUnapprovedTransactions';
import { isSuggestedReceipt } from './utils/isSuggestedReceipt';

export const getUnapprovedTransactionsWithReceipts = async () => {
  const unapprovedTransactions = await getUnapprovedTransactions();
  console.log('-------------------------------------------------');
  // Take only the first transaction for testing
  const testTransactions = unapprovedTransactions.slice(0, 1);
  const suggestedReceipts = await getSuggestedReceipts();

  const receiptsByCreditCard = suggestedReceipts.reduce((acc, receipt) => {
    const cardId = receipt.creditCard.id.toLowerCase();
    if (!acc[cardId]) {
      acc[cardId] = [];
    }
    acc[cardId].push(receipt);
    return acc;
  }, {});

  // Match transactions with receipts
  const transactionsWithReceipts = testTransactions.map((transaction) => {
    const matchingReceipts = receiptsByCreditCard[transaction.accountName.toLowerCase()] || [];
    const possibleMatches = matchingReceipts
      .map((receipt) => isSuggestedReceipt(transaction, receipt))
      .filter((match) => match && match.scoreTotal >= 0.5)
      .sort((a, b) => b.scoreTotal - a.scoreTotal)
      .slice(0, 3);

    return {
      ...transaction,
      suggestedReceipts: possibleMatches.length > 0 ? possibleMatches : null,
    };
  });

  return transactionsWithReceipts;
};
