'use client'; 

import { LoadingButton } from "@mui/lab";
import { useFormStatus } from 'react-dom'

export default function ButtonApprove({haveSelected, selectedTransactions}) {
const { pending } = useFormStatus()

  return (
    <LoadingButton
      variant="contained"
      style={{ marginLeft: '16px', width: '140px' }}
      disabled={!haveSelected}
      type="submit"
      color="primary"
      loading={pending}
    >
      Approve {selectedTransactions > 0 && `(${selectedTransactions})`}
    </LoadingButton>
  );
}
