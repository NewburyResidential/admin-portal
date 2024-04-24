import { LoadingButton } from '@mui/lab';
import { useWatch, useFormContext } from 'react-hook-form';

export default function ButtonApprove({ loading, invoices, handleSubmit }) {
  const { control } = useFormContext();

  const checkedArray = useWatch({
    control,
    name: invoices.map((_, index) => `invoices[${index}].checked`),
  });

  const selectedItem = checkedArray.reduce((count, currentValue) => {
    return currentValue ? count + 1 : count;
  }, 0);

  const { length } = invoices;

  return (
    <LoadingButton
      onClick={handleSubmit}
      variant="contained"
      style={{ marginLeft: '16px', width: '190px' }}
      disabled={selectedItem < 1 || length === 0}
      color="primary"
      loading={loading}
    >
      {selectedItem < 2 ? 'Pay Invoice' : selectedItem > 1 ? `Group Invoices (${selectedItem})` : selectedItem > 0 && ` (${selectedItem})`}
    </LoadingButton>
  );
}
