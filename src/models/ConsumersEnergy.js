import { GL_ACCOUNTS, createUtilityBill } from './config-utilities';
import { fConverToNumber } from 'src/utils/format-number';
import { dummyData } from './dumb';

const matchesPattern = (regex, value) => {
  return regex.test(value);
};
const betweenExpectedAmount = (min, max, num) => {
  return num > min && num < max;
};

const modifyBillMonth = (monthYear) => {
  const [month, year] = monthYear.split('/');
  return `${month}/${`20${year}`}`;
};

const modifyServiceDate = (serviceDate) => {
  const parts = serviceDate.split('-');
  return parts[0] + '/' + parts[1];
};

export const convertConsumersGasElectric = (propertyId = '1166181') => {
  const electricExists = Boolean(
    dummyData.electricMeterNumber && dummyData.electricMeterNumber.value
  );
  const gasExists = Boolean(dummyData.gasMeterNumber && dummyData.gasMeterNumber.value);

  const newObject = { confidence: {}, utilityBills: [] };

  newObject.venderId = '63374';
  newObject.venderLocationId = '33957';
  newObject.propertyId = propertyId;

  newObject.invoiceUrl =
    'https://www.consumersenergy.com/-/media/CE/Documents/My-Account/Billing/Consumers-Energy-Bill.pdf';

  newObject.accountNumber = fConverToNumber(dummyData.account.value);
  newObject.confidence.accountNumber = {
    processor: [{ name: 'Account Number', value: dummyData.account.confidence }],
    pattern: matchesPattern(/^\d{12}$/, fConverToNumber(dummyData.account.value)),
  };

  newObject.postMonth = modifyBillMonth(dummyData.billMonth.value);
  newObject.confidence.postMonth = {
    processor: [{ name: 'Bill Month', value: dummyData.billMonth.confidence }],
    pattern: matchesPattern(
      /^(0[1-9]|1[0-2])\/(2\d{3})$/,
      modifyBillMonth(dummyData.billMonth.value)
    ),
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
  if (electricExists) {
    const electricUtility = { confidence: {} };



    electricUtility.type = 'electric';
    electricUtility.confidence.type = {
      processor: [{ name: 'Meter Number', value: dummyData.electricMeterNumber.confidence }],
      pattern: matchesPattern(/^[0-9]+$/, dummyData.electricMeterNumber.value),
    };

    electricUtility.meterNumber = dummyData.electricMeterNumber.value;
    electricUtility.confidence.meterNumber = {
      processor: [{ name: 'Meter Number', value: dummyData.electricMeterNumber.confidence }],
      pattern: matchesPattern(/^[0-9]+$/, dummyData.electricMeterNumber.value),
    };

    electricUtility.serviceStart = modifyServiceDate(dummyData.electricBeginningReadDate.value);
    electricUtility.confidence.serviceStart = {
      processor: [{ name: 'Start Service', value: dummyData.electricBeginningReadDate.confidence }],
      pattern: matchesPattern(
        /^(0[1-9]|1[0-2])\/(0[1-9]|1[0-9]|2[0-9]|3[0-1])$/,
        modifyServiceDate(dummyData.electricBeginningReadDate.value)
      ),
    };

    electricUtility.serviceEnd = modifyServiceDate(dummyData.electricEndingReadDate.value);
    electricUtility.confidence.serviceEnd = {
      processor: [{ name: 'End Service', value: dummyData.electricEndingReadDate.confidence }],
      pattern: matchesPattern(
        /^(0[1-9]|1[0-2])\/(0[1-9]|1[0-9]|2[0-9]|3[0-1])$/,
        modifyServiceDate(dummyData.electricEndingReadDate.value)
      ),
    };

    electricUtility.amount = dummyData.totalElectric.value;
    electricUtility.confidence.amount = {
      processor: [{ name: 'Amount', value: dummyData.totalElectric.confidence }],
      pattern: betweenExpectedAmount(0, 10000, dummyData.totalElectric.value),
    };
    newObject.utilityBills.push(electricUtility);
  }
  if (gasExists) {
    const gasUtility = { confidence: {} };

 

    gasUtility.type = 'gas';
    gasUtility.confidence.type = {
      processor: [{ name: 'Meter Number', value: dummyData.gasMeterNumber.confidence }],
      pattern: matchesPattern(/^[0-9]+$/, dummyData.gasMeterNumber.value),
    };

    gasUtility.meterNumber = dummyData.gasMeterNumber.value;
    gasUtility.confidence.meterNumber = {
      processor: [{ name: 'Meter Number', value: dummyData.gasMeterNumber.confidence }],
      pattern: matchesPattern(/^[0-9]+$/, dummyData.gasMeterNumber.value),
    };

    gasUtility.serviceStart = modifyServiceDate(dummyData.gasBeginningReadDate.value);
    gasUtility.confidence.serviceStart = {
      processor: [{ name: 'Start Service', value: dummyData.gasBeginningReadDate.confidence }],
      pattern: matchesPattern(
        /^(0[1-9]|1[0-2])\/(0[1-9]|1[0-9]|2[0-9]|3[0-1])$/,
        modifyServiceDate(dummyData.gasBeginningReadDate.value)
      ),
    };

    gasUtility.serviceEnd = modifyServiceDate(dummyData.gasEndingReadDate.value);
    gasUtility.confidence.serviceEnd = {
      processor: [{ name: 'End Service', value: dummyData.gasEndingReadDate.confidence }],
      pattern: matchesPattern(
        /^(0[1-9]|1[0-2])\/(0[1-9]|1[0-9]|2[0-9]|3[0-1])$/,
        modifyServiceDate(dummyData.gasEndingReadDate.value)
      ),
    };

    gasUtility.amount = dummyData.totalNaturalGas.value;
    gasUtility.confidence.amount = {
      processor: [{ name: 'Amount', value: dummyData.totalNaturalGas.confidence }],
      pattern: betweenExpectedAmount(0, 10000, dummyData.totalNaturalGas.value),
    };
    newObject.utilityBills.push(gasUtility);
  }
  const e = createUtilityBill({
    type: 'gas',
    meterNumberValue: dummyData.gasMeterNumber.value,
    startServiceValue: modifyServiceDate(dummyData.gasBeginningReadDate.value),
    endServiceValue: modifyServiceDate(dummyData.gasEndingReadDate.value),
    amountValue: dummyData.totalNaturalGas.value,
    meterNumberConfidence: dummyData.gasMeterNumber.confidence,
    startServiceConfidence: dummyData.electricBeginningReadDate.confidence,
    endServiceConfidence: dummyData.gasEndingReadDate.confidence,
    amountConfidence: dummyData.totalNaturalGas.confidence
  });

  console.log(e)
  //console.log(newObject);
  return newObject;
};
