import { createAccount, createUtilityBill } from './config-utilities';
import { fRemoveSpaces } from 'src/utils/format-string';

const modifyBillMonth = (monthYear) => {
  const [month, year] = monthYear.split('/');
  return `${month}/${`20${year}`}`;
};

const modifyServiceDate = (serviceDate) => {
  const parts = serviceDate.split('-');
  return `${parts[0]}/${parts[1]}`;
};

export const convertConsumersGasElectric = (data, invoiceUrl, propertyId = '1166181') => {
  const vendorId = '63374';
  const vendorLocationId = '33957';

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
    vendorId,
    vendorLocationId,
    propertyId,
    invoiceUrl,
    accountNumber: fRemoveSpaces(data.account.value),
    postMonth: modifyBillMonth(data.portion.value),
    invoiceId: data.invoice.value,
    address: data.serviceAddress.value,
    totalSalesTax: data.stateSalesTax.value,
    totalAmount: data.totalEnergyCharges.value,
    accountNumberConfidence: data.account.confidence,
    postMonthConfidence: data.portion.confidence,
    invoiceIdConfidence: data.invoice.confidence,
    addressConfidence: data.serviceAddress.confidence,
    totalSalesTaxConfidence: data.stateSalesTax.confidence,
    totalAmountConfidence: data.totalEnergyCharges.confidence,
    accountNumberPattern: /^\d{12}$/,
    invoiceIdPattern: /^\d+$/,
  });

  if (utilities.electric.exists) {
    account.utilityBills.push(
      createUtilityBill({
        type: utilities.electric.type,
        meterNumber: data.electricServiceMeterNumber.value,
        serviceStart: modifyServiceDate(data.electricServiceBeginningReadDate.value),
        serviceEnd: modifyServiceDate(data.electricServiceEndingReadDate.value),
        amount: data.totalElectric.value,
        meterNumberConfidence: data.electricServiceMeterNumber.confidence,
        serviceStartConfidence: data.electricServiceBeginningReadDate.confidence,
        serviceEndConfidence: data.electricServiceEndingReadDate.confidence,
        amountConfidence: data.totalElectric.confidence,
        meterNumberPattern: /^[0-9]+$/,
      })
    );
  }
  if (utilities.gas.exists) {
    account.utilityBills.push(
      createUtilityBill({
        type: utilities.gas.type,
        meterNumber: data.gasServiceMeterNumber.value,
        serviceStart: modifyServiceDate(data.gasServiceBeginningReadDate.value),
        serviceEnd: modifyServiceDate(data.gasServiceEndingReadDate.value),
        amount: data.totalNaturalGas.value,
        meterNumberConfidence: data.gasServiceMeterNumber.confidence,
        serviceStartConfidence: data.gasServiceBeginningReadDate.confidence,
        serviceEndConfidence: data.gasServiceEndingReadDate.confidence,
        amountConfidence: data.totalNaturalGas.confidence,
        meterNumberPattern: /^[0-9]+$/,
      })
    );
  }

  return account;
};
