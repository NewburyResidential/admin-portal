const isNumberInRange = (num, min = 0, max = 10000) => num > min && num < max;
const matchesPattern = (regex, value) => regex.test(value);

const createRegexConfidenceObject = (name, pattern, value, confidence) => ({
  processor: { name, value: confidence },
  pattern: matchesPattern(pattern, value),
});
const createConfidenceObject = (name, boolean, confidence) => ({
  processor: { name, value: confidence },
  pattern: boolean,
});

const glAccounts = {
  electric: 234232,
  gas: 4235234,
};

const postMonthPattern = /^(0[1-9]|1[0-2])\/(2\d{3})$/;
const serviceDatePatten = /^(0[1-9]|1[0-2])\/(0[1-9]|1[0-9]|2[0-9]|3[0-1])$/;

export const createUtilityBill = ({
  type,
  meterNumber,
  serviceStart, // Expects mm/dd
  serviceEnd, // Expects mm/dd
  amount, // Expects a number
  meterNumberConfidence,
  serviceStartConfidence,
  serviceEndConfidence,
  amountConfidence,
  meterNumberPattern,
}) => ({
  type,
  meterNumber,
  serviceStart,
  serviceEnd,
  amount,
  glAccountId: glAccounts[type],
  confidence: {
    meterNumber: createRegexConfidenceObject('Meter Number', meterNumberPattern, meterNumber, meterNumberConfidence),
    serviceStart: createRegexConfidenceObject('Start Service', serviceDatePatten, serviceStart, serviceStartConfidence),
    serviceEnd: createRegexConfidenceObject('End Service', serviceDatePatten, serviceEnd, serviceEndConfidence),
    amount: createConfidenceObject('Amount', isNumberInRange(amount), amountConfidence),
    type: createConfidenceObject('Amount', isNumberInRange(amount), amountConfidence),
  },
});

export const createAccount = ({
    vendorId,
    vendorLocationId,
    propertyId,
    invoiceUrl,
    accountNumber,
    postMonth,
    invoiceId,
    address,
    totalSalesTax,
    totalAmount,
    accountNumberConfidence,
    postMonthConfidence,
    invoiceIdConfidence,
    addressConfidence,
    totalSalesTaxConfidence,
    totalAmountConfidence,
    accountNumberPattern,
    invoiceIdPattern,
  }) => ({
    vendorId,
    vendorLocationId,
    propertyId,
    invoiceUrl,
    accountNumber,
    postMonth,
    invoiceId,
    totalSalesTax,
    totalAmount,
    address,
    utilityBills: [],
    confidence: {
      accountNumber: createRegexConfidenceObject('Account Number', accountNumberPattern, accountNumber, accountNumberConfidence),
      postMonth: createRegexConfidenceObject('Post Month', postMonthPattern, postMonth, postMonthConfidence),
      invoiceId: createRegexConfidenceObject('Invoice ID', invoiceIdPattern, invoiceId, invoiceIdConfidence),
      address: createConfidenceObject('Address', true, address, addressConfidence),
      totalSalesTax: createConfidenceObject('Sales Tax', isNumberInRange(totalSalesTax), totalSalesTaxConfidence),
      totalAmount: createConfidenceObject('Total Amount', isNumberInRange(totalAmount), totalAmountConfidence),

    },
  });
