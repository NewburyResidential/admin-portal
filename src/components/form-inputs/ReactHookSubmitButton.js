import { LoadingButton } from '@mui/lab';
import { useFormStatus } from 'react-dom';

export default function ReactHookSubmitButton({ label = 'Save Changes', ...other }) {
  const { pending } = useFormStatus();
  return (
    <LoadingButton type="submit" variant="contained" loading={pending} {...other}>
      {label}
    </LoadingButton>
  );
}
