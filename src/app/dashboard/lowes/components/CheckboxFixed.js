import Checkbox from '@mui/material/Checkbox';
import { useFormContext, Controller } from 'react-hook-form';
import FormControlLabel from '@mui/material/FormControlLabel';

export default function CheckboxFixed({ itemIndex }) {
  const { control } = useFormContext();

  return (
    <FormControlLabel
      onClick={(event) => event.stopPropagation()}
      control={
        <Controller
          name={`uncatalogedItems[${itemIndex}].fixed`}
          control={control}
          defaultValue={false}
          render={({ field }) => (
            <Checkbox
              {...field}
              checked={field.value}
              onClick={(event) => {
                event.stopPropagation();
              }}
            />
          )}
        />
      }
      label="Fixed"
    />
  );
}
