import { fConverToNumber } from 'src/utils/format-number';
import { dummyData } from './dumb';

const matchesPattern = (regex, value) => {
  return regex.test(value);
};
const betweenExpectedAmount = (min, max, num) => {
    return num > min && num < max;
  }
const modifyAccountNumber = (accountNumber) => {
  return fConverToNumber(accountNumber);
};
const modifyBillMonth = (monthYear) => {
  const [month, year] = monthYear.split('/');
  return `${month}/${`20${year}`}`;
};
export const convertConsumersGasElectric = () => {
  const newObject = { confidence: {},  };

  newObject.venderId = '63374'
  newObject.venderLocationId = '33957'
  newObject.propertyId = '1166181' // TODO: get from request

  newObject.invoiceUrl = 'https://www.consumersenergy.com/-/media/CE/Documents/My-Account/Billing/Consumers-Energy-Bill.pdf'
  
  newObject.accountNumber = modifyAccountNumber(dummyData.account.value);
  newObject.confidence.accountNumber = {
    processor: [{ name: 'Account Number', value: dummyData.account.confidence }],
    pattern: matchesPattern(/^\d{12}$/, modifyAccountNumber(dummyData.account.value)),
  };

  newObject.postMonth = modifyBillMonth(dummyData.billMonth.value);
  newObject.confidence.postMonth = {
    processor: [{ name: 'Bill Month', value: dummyData.billMonth.confidence }],
    pattern: matchesPattern(/^(0[1-9]|1[0-2])\/(2\d{3})$/, modifyBillMonth(dummyData.billMonth.value)),
  };

  newObject.invoiceId = dummyData.invoice.value;
  newObject.confidence.invoiceId = {
    processor: [{ name: 'Invoice ID', value: dummyData.invoice.confidence }],
    pattern: matchesPattern(/^\d+$/, dummyData.invoice.value),
  };

  newObject.salesTax = dummyData.salesTax.value;
  newObject.confidence.salesTax = {
    processor: [{ name: 'Total Sales Tax', value: dummyData.salesTax.confidence }],
    pattern: betweenExpectedAmount(0, 2000, dummyData.salesTax.value),
  };

  newObject.totalAmount = dummyData.totalAmount.value;
  newObject.confidence.totalAmount = {
    processor: [{ name: 'Total Amount', value: dummyData.totalAmount.confidence }],
    pattern: betweenExpectedAmount(0, 10000, dummyData.totalAmount.value),
  };

  newObject.address = dummyData.address.value;
  newObject.confidence.address = {
    processor: [{ name: 'Address', value: dummyData.address.confidence }],
    pattern: true,
  };

  let utilities = {confidence: {}}

  utilities.type = 'electric'
  newObject.confidence.address = {
    processor: [{ name: 'Address', value: dummyData.address.confidence }],
    pattern: true,
  };
  
console.log(newObject)
  return newObject;
};
