import Fuse from 'fuse.js';
import Big from 'big.js';

function searchFunction(merchantName, merchantArray) {
  const fuse = new Fuse(merchantArray, { keys: ['name'], threshold: 0.5, minMatchCharLength: 3, includeScore: true });
  const results = fuse.search(merchantName);

  if (results.length > 0) {
    const bestMatch = results[0];

    return bestMatch.score;
  } 
    return null;
  
}

export const isSuggestedReceipt = (transaction, receipt) => {
  let isPossibleMatch = false;

  const receiptData = {
    id: receipt.id,
    modifiedOn: receipt.modifiedOn,
    modifiedBy: receipt.modifiedBy,
    fileName: receipt.fileName,
    objectKey: receipt.objectKey,
    transactionDate: { value: receipt.transactionDate, score: 0 },
    merchant: { value: receipt.merchantArray, score: 0 },
    total: { value: receipt.total, score: 0 },
  };

  if (transaction.transactionDate && receipt.transactionDate) {
    if (transaction.transactionDate === receipt.transactionDate) {
      receiptData.transactionDate.score = 1;
      isPossibleMatch = true;
    }
  }

  if (transaction.amount && receipt.total) {
    const transactionAmount = new Big(transaction.amount);
    const receiptTotal = new Big(receipt.total);

    if (transactionAmount.eq(receiptTotal)) {
      receiptData.total.score = 1;
      isPossibleMatch = true;
    }
  }

  if ((transaction.merchant || transaction.name) && receipt.merchantArray && receipt.merchantArray.length > 0) {
    let merchantMatch = false;
    const fuzzyScores = [];

    let transactionMerchantFuzzyMatchScore;
    let transactionNameFuzzyMatchScore;

    if (transaction.merchant) {
      const isTransactionMechantMatch = receipt.merchantArray.some(
        (merchantName) => transaction.merchant.toLowerCase() === merchantName.toLowerCase()
      );
      if (isTransactionMechantMatch) {
        merchantMatch = true;
      } else {
        transactionMerchantFuzzyMatchScore = searchFunction(transaction.merchant, receipt.merchantArray);
        if (transactionMerchantFuzzyMatchScore) {
          fuzzyScores.push(transactionMerchantFuzzyMatchScore);
        }
      }
    }

    if (transaction.name && !merchantMatch) {
      const isTransactionNameMatch = receipt.merchantArray.some(
        (merchantName) => transaction.name.toLowerCase() === merchantName.toLowerCase()
      );
      if (isTransactionNameMatch) {
        merchantMatch = true;
      } else {
        transactionNameFuzzyMatchScore = searchFunction(transaction.name, receipt.merchantArray);
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
      receiptData.merchant.score = 1;
      isPossibleMatch = true;
    } else if (lowestFuzzyScore && lowestFuzzyScore < 0.7) {
      receiptData.merchant.score = 0.5;
      isPossibleMatch = true;
    }
  }
  if (isPossibleMatch) {
    return receiptData;
  } 
    return null;
  
};
