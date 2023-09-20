import { createAccount, createUtilityBill } from './config-utilities';
import { data } from './dumb';
import { fRemoveSpaces } from 'src/utils/format-string';

const modifyBillMonth = (monthYear) => {
  const [month, year] = monthYear.split('/');
  return `${month}/${`20${year}`}`;
};

const modifyServiceDate = (serviceDate) => {
  const parts = serviceDate.split('-');
  return `${parts[0]}/${parts[1]}`;
};

export const convertConsumersGasElectric = (data, propertyId = '1166181') => {
  const venderId = '63374';
  const venderLocationId = '33957';

  const utilities = {
    gas: {
      exists: Boolean(data.totalNaturalGas && data.totalNaturalGas.value),
      type: 'gas',
    },
    electric: {
      exists: Boolean(data.totalElectric && data.totalElectric.value),
      type: 'electric',
    },
  };

  const account = createAccount({
    venderId,
    venderLocationId,
    propertyId,
    invoiceUrl:
      'https://www.consumersenergy.com/-/media/CE/Documents/My-Account/Billing/Consumers-Energy-Bill.pdf',
    accountNumber: fRemoveSpaces(data.account.value),
    postMonth: modifyBillMonth(data.billMonth.value),
    invoiceId: data.invoice.value,
    address: data.address.value,
    totalSalesTax: data.salesTax.value,
    totalAmount: data.totalAmount.value,
    accountNumberConfidence: data.account.confidence,
    postMonthConfidence: data.billMonth.confidence,
    invoiceIdConfidence: data.invoice.confidence,
    addressConfidence: data.address.confidence,
    totalSalesTaxConfidence: data.salesTax.confidence,
    totalAmountConfidence: data.totalAmount.confidence,
    accountNumberPattern: /^\d{12}$/,
    invoiceIdPattern: /^\d+$/,
  });

  if (utilities.electric.exists) {
    account.utilityBills.push(
      createUtilityBill({
        type: utilities.electric.type,
        meterNumber: data.electricMeterNumber.value,
        serviceStart: modifyServiceDate(data.electricBeginningReadDate.value),
        serviceEnd: modifyServiceDate(data.electricEndingReadDate.value),
        amount: data.totalElectric.value,
        meterNumberConfidence: data.electricMeterNumber.confidence,
        serviceStartConfidence: data.electricBeginningReadDate.confidence,
        serviceEndConfidence: data.electricEndingReadDate.confidence,
        amountConfidence: data.totalElectric.confidence,
        meterNumberPattern: /^[0-9]+$/,
      })
    );
  }
  if (utilities.gas.exists) {
    account.utilityBills.push(
      createUtilityBill({
        type: utilities.gas.type,
        meterNumber: data.gasMeterNumber.value,
        serviceStart: modifyServiceDate(data.gasBeginningReadDate.value),
        serviceEnd: modifyServiceDate(data.gasEndingReadDate.value),
        amount: data.totalNaturalGas.value,
        meterNumberConfidence: data.gasMeterNumber.confidence,
        serviceStartConfidence: data.gasBeginningReadDate.confidence,
        serviceEndConfidence: data.gasEndingReadDate.confidence,
        amountConfidence: data.totalNaturalGas.confidence,
        meterNumberPattern: /^[0-9]+$/,
      })
    );
  }

  console.log(account);
  return account;
};
