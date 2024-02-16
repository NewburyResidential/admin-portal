import * as yup from 'yup';

const dateRegex = /^\d{4}\/\d{2}\/\d{2}$/;

const isValidDate = (value) => {
  if (!dateRegex.test(value)) return false;
  const date = new Date(value);
  return date instanceof Date && !isNaN(date);
};

export const editUtilityBillSchema = yup.object().shape({
  pk: yup.string().required(),
  sk: yup.string().required(),
  accountNumber: yup.string().matches(/^\d+$/, 'Must contain only numbers').required(),
  building: yup.string().matches(/^\d+$/, 'Must contain only numbers').required(),
  unit: yup.string().matches(/^\d+$/, 'Must contain only numbers').required(),
  startService: yup
    .string()
    .required('Start service date is required')
    .matches(dateRegex, 'Start service date must be in YYYY/MM/DD format')
    .test('is-valid-date', 'Invalid start service date', isValidDate),
  endService: yup
    .string()
    .required('End service date is required')
    .matches(dateRegex, 'End service date must be in YYYY/MM/DD format')
    .test('is-valid-date', 'Invalid end service date', isValidDate),
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
