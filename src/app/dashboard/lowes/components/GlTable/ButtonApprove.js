import { LoadingButton } from '@mui/lab';
import { useWatch, useFormContext } from 'react-hook-form';

export default function ButtonApprove({ loading, uncatalogedItems, handleSubmit }) {
  const { control } = useFormContext();

  const checkedArray = useWatch({
    control,
    name: uncatalogedItems.map((_, index) => `uncatalogedItems[${index}].checked`),
  });

  const selectedItem = checkedArray.reduce((count, currentValue) => {
    return currentValue ? count + 1 : count;
  }, 0);

  const { length } = uncatalogedItems;

  return (
    <LoadingButton
      onClick={handleSubmit}
      variant="contained"
      style={{ marginLeft: '16px', width: '190px' }}
      disabled={selectedItem < 1 || length === 0}
      color="primary"
      loading={loading}
    >
      Add Item{length === 0 ? '' : selectedItem > 1 ? `s (${selectedItem})` : selectedItem > 0 && ` (${selectedItem})`}
    </LoadingButton>
  );
}
