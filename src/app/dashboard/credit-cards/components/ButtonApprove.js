import { LoadingButton } from '@mui/lab';
import { useFormStatus } from 'react-dom';
import { useWatch, useFormContext } from 'react-hook-form';

export default function ButtonApprove({ transactions }) {
  const { control } = useFormContext();
  const { pending } = useFormStatus();

  const checkedArray = useWatch({
    control,
    name: transactions.map((_, index) => `transactions[${index}].checked`),
  });

  const selectedTransactions = checkedArray.reduce((count, currentValue) => {
    return currentValue ? count + 1 : count;
  }, 0);

  const { length } = transactions;

  return (
    <LoadingButton
      variant="contained"
      style={{ marginLeft: '16px', width: '140px' }}
      disabled={selectedTransactions < 1 || length === 0}
      type="submit"
      color="primary"
      loading={pending}
    >
      Approve {length === 0 ? '' : selectedTransactions > 0 && `(${selectedTransactions})`}
    </LoadingButton>
  );
}
