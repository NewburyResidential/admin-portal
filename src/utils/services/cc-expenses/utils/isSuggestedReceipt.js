import Fuse from 'fuse.js';
import Big from 'big.js';
import { fConvertFromEuropeDate } from 'src/utils/format-time';

function searchFunction(merchantName, receiptName) {
  const fuse = new Fuse([{ name: receiptName }], { keys: ['name'], threshold: 0.5, minMatchCharLength: 3, includeScore: true });
  const results = fuse.search(merchantName);

  if (results.length > 0) {
    const bestMatch = results[0];

    return bestMatch.score;
  }
  return null;
}

export const isSuggestedReceipt = (transaction, receipt) => {
  let isPossibleMatch = false;

  const receiptDate = receipt.transactionDate;
  const receiptMerchant = receipt.merchantName;
  const receiptTotal = receipt.chargedAmount;
  const receiptCreditCardName = receipt.creditCard.name;

  const receiptData = {
    pk: receipt.pk,
    uploadedOn: receipt.uploadedOn,
    modifiedBy: receiptCreditCardName,
    transactionDate: { value: receiptDate, score: 0 },
    merchant: { value: receiptMerchant, score: 0 },
    total: { value: receiptTotal, score: 0 },
    scoreTotal: 0,
    receiptAiSummary: receipt.receiptAiSummary,
    numberOfTimesUsed: receipt.numberOfTimesUsed,
    fileExtension: receipt.fileExtension,
    allocations: receipt.allocations,
    calculationMethod: receipt.calculationMethod,
  };
  if (transaction.transactionDate && receiptDate) {
    console.log('transaction.transactionDate', transaction.transactionDate);
    console.log('receiptDate', receiptDate);
    const convertedTransactionDate = fConvertFromEuropeDate(transaction.transactionDate);

    const newTransactionDate = new Date(convertedTransactionDate);
    const newReceiptDate = new Date(receiptDate);
    const timeDiff = Math.abs(newTransactionDate - newReceiptDate);
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    if (newTransactionDate.toDateString() === newReceiptDate.toDateString()) {
      receiptData.transactionDate.score = 1.0;
      isPossibleMatch = true;
    } else if (daysDiff === 1) {
      receiptData.transactionDate.score = 0.45;
      isPossibleMatch = true;
    }
  }

  if (transaction.amount && receiptTotal) {
    const bigTransactionAmount = new Big(transaction.amount);
    const bigReceiptTotal = new Big(receiptTotal);

    if (bigTransactionAmount.eq(bigReceiptTotal)) {
      receiptData.total.score = 1.0;
      isPossibleMatch = true;
    }
  }

  if ((transaction.merchant || transaction.name) && receiptMerchant) {
    let merchantMatch = false;
    const fuzzyScores = [];

    let transactionMerchantFuzzyMatchScore;
    let transactionNameFuzzyMatchScore;

    if (transaction.merchant) {
      const isTransactionMechantMatch = receiptMerchant.toLowerCase() === transaction?.merchant?.toLowerCase();
      if (isTransactionMechantMatch) {
        merchantMatch = true;
      } else {
        transactionMerchantFuzzyMatchScore = searchFunction(transaction?.merchant, receiptMerchant);
        if (transactionMerchantFuzzyMatchScore) {
          fuzzyScores.push(transactionMerchantFuzzyMatchScore);
        }
      }
    }

    if (transaction.name && !merchantMatch) {
      const isTransactionNameMatch = receiptMerchant.toLowerCase() === transaction?.name?.toLowerCase();
      if (isTransactionNameMatch) {
        merchantMatch = true;
      } else {
        transactionNameFuzzyMatchScore = searchFunction(transaction?.name, receiptMerchant);
        if (transactionNameFuzzyMatchScore) {
          fuzzyScores.push(transactionNameFuzzyMatchScore);
        }
      }
    }

    const lowestFuzzyScore = fuzzyScores.length > 0 ? Math.min(...fuzzyScores) : null;

    if (merchantMatch) {
      receiptData.merchant.score = 1;
      isPossibleMatch = true;
    } else if (lowestFuzzyScore && lowestFuzzyScore < 0.2) {
      receiptData.merchant.score = 0.8;
      isPossibleMatch = true;
    } else if (lowestFuzzyScore && lowestFuzzyScore < 0.7) {
      receiptData.merchant.score = 0.5;
      isPossibleMatch = true;
    }
  }
  if (isPossibleMatch) {
    const weights = {
      date: 0.25,
      amount: 0.45,
      merchant: 0.3,
    };

    receiptData.scoreTotal =
      receiptData.transactionDate.score * weights.date +
      receiptData.total.score * weights.amount +
      receiptData.merchant.score * weights.merchant;

    // Convert scoreTotal (0-1) to percentage (0-100)
    console.log('receiptData.scoreTotal', receiptData.scoreTotal);
    receiptData.receiptPercentTotal = Math.round(receiptData.scoreTotal * 100);

    return receiptData;
  }
  return null;
};
