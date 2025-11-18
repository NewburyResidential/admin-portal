import getSuggestedReceipts from './getSuggestedReceipts';
import getUnapprovedTransactions from './getUnapprovedTransactions';
import { isSuggestedReceipt } from './utils/isSuggestedReceipt';

export const getUnapprovedTransactionsWithReceipts = async () => {
  const unapprovedTransactions = await getUnapprovedTransactions();
  // Take only the first transaction for testing
  const suggestedReceipts = await getSuggestedReceipts();

  const receiptsByCreditCard = suggestedReceipts.reduce((acc, receipt) => {
    const cardName = receipt?.creditCardHolder ? receipt?.creditCardHolder : receipt?.creditCard?.name || null;
    const uploadedBy = receipt?.uploadedBy ? receipt?.uploadedBy : null;
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

    if (cardName === 'brian murphy' || cardName === 'tom anthony' || cardName === 'laura murphy') {
      const specificCardHolders = ['brian murphy', 'tom anthony', 'laura murphy'];
      specificCardHolders.forEach((holder) => {
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
      .filter((match) => match && match.scoreTotal >= 0.49)
      .sort((a, b) => b.scoreTotal - a.scoreTotal)
      .slice(0, 3);

    return {
      ...transaction,
      suggestedReceipts: possibleMatches.length > 0 ? possibleMatches : null,
      isDue: (() => {
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();

        // Is today on or after the 5th of the current month?
        //  const isReconciliationPeriodStarted = today.getDate() >= 1;

        //  if (!isReconciliationPeriodStarted) return false;

        const postedDate = new Date(transaction.postedDate);
        const cutoffDate = new Date(currentYear, currentMonth, 5);

        // Is the transaction posted before the 5th of the current month?
        return postedDate < cutoffDate;
      })(),
    };
  });

  return transactionsWithReceipts;
};
