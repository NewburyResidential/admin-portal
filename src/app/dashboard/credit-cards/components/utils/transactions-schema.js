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
    amount: yup.string().required('Amount is required'),
    helper: yup.string().required('Helper is required'),
  })
  .required();

export const transactionsSchema = yup
  .object()
  .shape({
    vendor: yup.object().when('allocations', {
      is: (allocations) =>
        allocations?.some(
          (allocation) => allocation?.asset?.accountingSoftware === 'entrata' || allocation?.asset?.accountingSoftware === 'pre-entrata'
        ),
      then: () =>
        yup
          .object()
          .shape({
            id: yup.string().required(),
          })
          .required('Vendor is required when any asset accountingSoftware is entrata'),
      otherwise: () => yup.object().nullable(),
    }),
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
        message: 'Total amount must equal the sum of asset amounts',
      }),
  })
  .required();
