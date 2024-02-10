import * as yup from 'yup';
import Big from 'big.js';

const allocationSchema = yup.object().shape({
  asset: yup.object().required('Asset is required'),
  glAccount: yup.object().required('GL Account is required'),
  amount: yup.string().required('Amount is required'),
  helper: yup.string().required('Helper is required'),
});

const transactionSchema = yup.object().shape({
  checked: yup.boolean(),
  vendor: yup.object().when(['checked', 'allocations'], {
    is: (checked, allocations) => {
      if (checked) {
        return allocations.some((allocation) => allocation?.asset?.accountingSoftware === 'entrata');
      }
      return false;
    },
    then: () => yup.object().required('Vendor is required when any asset accountingSoftware is entrata'),
    otherwise: () => yup.object().nullable(),
  }),

  allocations: yup.array().when('checked', {
    is: true,
    then: () => yup.array().of(allocationSchema).required(),
    otherwise: () => yup.array(),
  }),
  amount: yup.string().test({
    name: 'amount-equals-total',
    test: function amountEqualsTotal(value) {
      const { checked } = this.parent;
      const allocations = this.parent.allocations || [];

      if (checked) {
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
            acc = new Big(NaN);
            return acc;
          }

          return acc;
        }, new Big(0));
        const totalString = total.toString();

        return value === totalString;
      }

      return true;
    },
    message: 'Total amount must equal the sum of asset amounts when checked is true',
  }),
});

export const transactionsSchema = yup.object().shape({
  transactions: yup.array().of(transactionSchema).required(),
  pageSettings: yup
    .object()
    .shape({
      page: yup.number().required(),
      rowsPerPage: yup.number().required(),
    })
    .required(),
});
