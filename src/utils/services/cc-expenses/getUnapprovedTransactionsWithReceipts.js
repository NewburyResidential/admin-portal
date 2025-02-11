import getSuggestedReceipts from './getSuggestedReceipts';
import getUnapprovedTransactions from './getUnapprovedTransactions';
import { isSuggestedReceipt } from './utils/isSuggestedReceipt';

export const getUnapprovedTransactionsWithReceipts = async () => {
  const unapprovedTransactions = await getUnapprovedTransactions();
  // Take only the first transaction for testing
  const suggestedReceipts = await getSuggestedReceipts();

  const receiptsByCreditCard = suggestedReceipts.reduce((acc, receipt) => {
    const cardName = receipt?.creditCardHolder ? receipt?.creditCardHolder : receipt?.creditCard?.name || null;
    if (!cardName) {
      return acc;
    }
    const cardId = cardName?.toLowerCase();
    if (cardName === 'Emailed' || cardName === 'Amazon') {
      const emailedCardHolders = ['brian murphy', 'michael axiotakis', 'tom anthony', 'laura murphy'];
      emailedCardHolders.forEach((holder) => {
        if (!acc[holder]) {
          acc[holder] = [];
        }
        acc[holder].push(receipt);
      });
      return acc;
    }
    if (!acc[cardId]) {
      acc[cardId] = [];
    }
    acc[cardId].push(receipt);
    return acc;
  }, {});

  // Match transactions with receipts
  // TO DO just adjust this to accountname
  const transactionsWithReceipts = unapprovedTransactions.map((transaction) => {
    const accountNameWithoutNumbers = transaction.accountName.replace(/\d+/g, '');
    const lookupKey = accountNameWithoutNumbers.toLowerCase().trim();
    const matchingReceipts = receiptsByCreditCard[lookupKey] || [];
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
