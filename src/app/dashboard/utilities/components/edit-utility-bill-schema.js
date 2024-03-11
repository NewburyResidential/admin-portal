import * as yup from 'yup';
import { parse, isValid } from 'date-fns';

const isValidDate = (value) => {
  const dateFormat = 'MM/dd/yyyy';
  const parsedDate = parse(value, dateFormat, new Date());
  return isValid(parsedDate);
};

export const editUtilityBillSchema = yup.object().shape({
  pk: yup.string().required(),
  sk: yup.string().required(),
  type: yup.string().required(),
  invoiceNumber: yup.string().matches(/^\d+$/, 'Must contain only numbers').required(),
  building: yup.string().matches(/^\d+$/, 'Must contain only numbers').required(),
  unit: yup
    .string()
    .matches(/^\d+$/, 'Must contain only numbers')
    .when('type', {
      is: (type) => type === 'apartment',
      then: () => yup.string().required('Unit is required for apartments'),
      otherwise: () => yup.string().notRequired(),
    }),
  startService: yup.string().required('Start service date is required').test('is-valid-date', 'Invalid start service date', isValidDate),
  endService: yup.string().required('End service date is required').test('is-valid-date', 'Invalid end service date', isValidDate),
  electricAmount: yup
    .string()
    .matches(/^[-]?\d+(\.\d{1,2})?$/, 'Valid number with 2 decimal places')
    .required(),
  gasAmount: yup
    .string()
    .matches(/^[-]?\d+(\.\d{1,2})?$/, 'Valid number with 2 decimal places')
    .required(),
  waterAmount: yup
    .string()
    .matches(/^[-]?\d+(\.\d{1,2})?$/, 'Valid number with 2 decimal places')
    .required(),
  miscellaneousAmount: yup
    .string()
    .matches(/^[-]?\d+(\.\d{1,2})?$/, 'Valid number with 2 decimal places')
    .required(),
  taxAmount: yup
    .string()
    .matches(/^[-]?\d+(\.\d{1,2})?$/, 'Valid number with 2 decimal places')
    .required(),
  totalAmount: yup
    .string()
    .matches(/^[-]?\d+(\.\d{1,2})?$/, 'Valid number with 2 decimal places')
    .required(),
});
