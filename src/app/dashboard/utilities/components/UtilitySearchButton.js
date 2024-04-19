import LoadingButton from '@mui/lab/LoadingButton';
import { useFormStatus } from 'react-dom';

export default function UtilitySearchButton() {
  const { pending } = useFormStatus();
  return (
    <LoadingButton loading={pending} type="submit" variant="contained" sx={{ flexShrink: 0, px: 2 }}>
      Search
    </LoadingButton>
  );
}
