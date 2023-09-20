const betweenExpectedAmount = (min, max, num) => num > min && num < max;
const matchesPattern = (regex, value) => regex.test(value);

const createRegexConfidenceObject = (name, pattern, value, confidence) => ({
  processor: { name, value: confidence },
  pattern: matchesPattern(pattern, value),
});
const createBetweenConfidenceObject = (name, isBetween, confidence) => ({
  processor: { name, value: confidence },
  pattern: isBetween,
});

// Create Utilities
const glAccounts = {
  electric: 234232,
  gas: 4235234,
};

const utilityMeterNumberPattern = /^[0-9]+$/;
const utilityServiceDatePatten = /^(0[1-9]|1[0-2])\/(0[1-9]|1[0-9]|2[0-9]|3[0-1])$/;

export const createUtilityBill = ({
  type,
  meterNumberValue,
  startServiceValue, //Expects mm/dd
  endServiceValue, //Expects mm/dd
  amountValue, //Expects a number
  meterNumberPattern = utilityMeterNumberPattern,
  meterNumberConfidence,
  startServiceConfidence,
  endServiceConfidence,
  amountConfidence
}) => ({
  type,
  glAccountId: glAccounts[type],
  meterNumber: meterNumberValue,
  serviceStart: startServiceValue,
  serviceEnd: endServiceValue,
  amount: amountValue,
  confidence: {
    meterNumber: createRegexConfidenceObject('Meter Number', meterNumberPattern, meterNumberValue, meterNumberConfidence),
    serviceStart: createRegexConfidenceObject('Start Service', utilityServiceDatePatten, startServiceValue, startServiceConfidence),
    serviceEnd: createRegexConfidenceObject('End Service', utilityServiceDatePatten, endServiceValue, endServiceConfidence),
    amount: createBetweenConfidenceObject('Amount', betweenExpectedAmount(0, 10000, amountValue), amountConfidence),
    type: createBetweenConfidenceObject('Amount', betweenExpectedAmount(0, 10000, amountValue), amountConfidence),
  },
});
