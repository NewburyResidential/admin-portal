import { TextField , Box } from '@mui/material';
import { Controller } from 'react-hook-form';
import CalculationButtonGroup from '../rowSubItems/CalculationButtonGroup';


export default function SplitButtons({ totalAmount, control, backgroundColor }) {
  return (
    <Box sx={{ display: 'flex', backgroundColor, pb: 2, pr: 1, gap: 2 }}>
      <Box sx={{ flex: 16 }} />
      <Box sx={{ flex: 3.4, textAlign: 'center' }}>
        <CalculationButtonGroup totalAmount={totalAmount} />
      </Box>
      <Box sx={{ flex: 1.52, textAlign: 'left' }}>
        <Controller
          name="amount"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <Box sx={{ flex: 1.52, textAlign: 'left' }}>
              <TextField
                {...field}
                error={!!error}
                label="Total"
                InputProps={{ style: { maxHeight: '40px', color: error ? '#FB6241' : '#919EAB' }, startAdornment: <span>$</span> }}
                InputLabelProps={{ style: { color: error ? '#FB6241' : '#919EAB' } }}
                onChange={() => {
                  return null;
                }}
              />
            </Box>
          )}
        />
      </Box>
    </Box>
  );
}
