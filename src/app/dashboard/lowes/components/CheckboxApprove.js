import Checkbox from '@mui/material/Checkbox';
import { useFormContext, Controller } from 'react-hook-form';

export default function CheckboxApprove({ itemIndex }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={`uncatalogItems[${itemIndex}].checked`}
      control={control}
      defaultValue={false}
      render={({ field }) => <Checkbox {...field} checked={field.value} />}
    />
  );
}
