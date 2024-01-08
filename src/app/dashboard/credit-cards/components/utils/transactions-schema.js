import * as yup from 'yup';

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
          const amount = parseFloat(allocation?.amount);

          if (!Number.isNaN(amount) && amount !== 0) {
            if (acc === 0) {
              acc = amount;
            } else if ((acc > 0 && amount > 0) || (acc < 0 && amount < 0)) {
              acc += amount;
            } else {
              acc = NaN;
              return acc;
            }
          } else {
            acc = NaN;
            return acc;
          }

          return acc;
        }, 0);

        return parseFloat(value) === total;
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
