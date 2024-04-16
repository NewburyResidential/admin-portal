import { LoadingButton } from '@mui/lab';
import { useFormStatus } from 'react-dom';
import { useWatch, useFormContext } from 'react-hook-form';

export default function ButtonApplyGl({ uncatalogedItems, handleSubmit }) {
  const { control, getValues, setValue, setError } = useFormContext();
  const { pending } = useFormStatus();

  const checkedArray = useWatch({
    control,
    name: uncatalogedItems.map((_, index) => `uncatalogedItems[${index}].checked`),
  });

  const selectedItem = checkedArray.reduce((count, currentValue) => {
    return currentValue ? count + 1 : count;
  }, 0);

  const { length } = uncatalogedItems;

  const handleGlSubmit = () => {
    const masterGl = getValues(`masterGlAccount`);
    if (masterGl !== null && masterGl !== undefined && masterGl !== '') {
      const updatedUncatalogedItems = getValues(`uncatalogedItems`);
      updatedUncatalogedItems.forEach((item, index) => {
        if (item.checked) {
          setValue(`uncatalogedItems[${index}].glAccount`, masterGl);
        }
      });
      handleSubmit();
    } else {
      setError('masterGlAccount', {
        type: 'manual',
        message: 'Master GL Account is required or the provided value is invalid.',
      });
    }
  };

  return (
    <LoadingButton
      variant="contained"
      style={{ marginLeft: '16px', width: '190px', marginRight: '14px' }}
      disabled={selectedItem < 1 || length === 0}
      color="warning"
      loading={pending}
      onClick={handleGlSubmit}
    >
      Add With GL
    </LoadingButton>
  );
}
