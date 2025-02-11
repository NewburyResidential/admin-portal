import * as yup from 'yup';
import Big from 'big.js';

const allocationSchema = yup
  .object()
  .shape({
    asset: yup
      .object()
      .shape({
        id: yup.string().required(),
        accountingSoftware: yup.string().required(),
      })
      .required('Asset is required'),
    glAccount: yup
      .object()
      .shape({
        accountId: yup.string().required(),
      })
      .required('GL Account is required'),
    helper: yup.string().required('Helper is required'),
    amount: yup.string().required('Amount is required'),
  })
  .required();

export const receiptSchema = yup
  .object()
  .shape({
    notes: yup.string().trim().nullable(),
    receiptAiSummary: yup.string().trim().nullable(),
    calculationMethod: yup.string().trim().required('Calculation method is required'),
    creditCardHolder: yup
      .object()
      .shape({
        label: yup.string().trim().required('Credit card holder label is required'),
        value: yup.string().trim().required('Credit card holder value is required'),
      })
      .required('Credit card holder is required'),
    merchantName: yup.string().trim().min(1, 'Merchant name cannot be empty').required('Merchant name is required'),
    transactionDate: yup
      .string()
      .required('Date of purchase is required')
      .matches(/^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/, 'Date must be in format MM/DD/YYYY'),
    allocations: yup.array().of(allocationSchema).min(1, 'At least one allocation is required').required(),
    amount: yup
      .string()
      .required('Amount is required')
      .test({
        name: 'amount-equals-total',
        test: function amountEqualsTotal(value) {
          if (!value) return false;
          const allocations = this.parent.allocations || [];
          if (allocations.length === 0) return false;
          if (allocations.length === 1) {
            try {
              const amount = new Big(value);
              return !amount.eq(0);
            } catch (error) {
              return false;
            }
          }

          const total = allocations.reduce((acc, allocation) => {
            const amount = allocation?.amount;
            try {
              const bigAmount = new Big(amount);

              if (acc.eq(0)) {
                acc = bigAmount;
              } else if ((acc.gt(0) && bigAmount.gt(0)) || (acc.lt(0) && bigAmount.lt(0))) {
                acc = acc.plus(bigAmount);
              } else {
                throw new Error('Incompatible amounts');
              }
            } catch (error) {
              return new Big('0');
            }
            return acc;
          }, new Big(0));
          const totalString = total.toString();

          return value === totalString;
        },
        message: 'Each allocation must sum to the total amount',
      }),
  })
  .required();
