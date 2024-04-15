import { LoadingButton } from '@mui/lab';
import { useFormStatus } from 'react-dom';
import { useWatch, useFormContext } from 'react-hook-form';

export default function ButtonApprove({ uncatalogedItems }) {
  console.log(uncatalogedItems)
  const { control } = useFormContext();
  const { pending } = useFormStatus();

  const checkedArray = useWatch({
    control,
    name: uncatalogedItems.map((_, index) => `uncatalogedItems[${index}].checked`),
  });

  console.log(checkedArray)

  const selectedItem = checkedArray.reduce((count, currentValue) => {
    return currentValue ? count + 1 : count;
  }, 0);

  const { length } = uncatalogedItems;

  return (
    <LoadingButton
      variant="contained"
      style={{ marginLeft: '16px', width: '140px' }}
      disabled={selectedItem < 1 || length === 0}
      type="submit"
      color="primary"
      loading={pending}
    >
      Approve {length === 0 ? '' : selectedItem > 0 && `(${selectedItem})`}
    </LoadingButton>
  );
}
