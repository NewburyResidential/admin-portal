import { useCallback, useState } from 'react';
import updateAvatar from 'src/utils/services/employees/updateAvatar';

// ----------------------------------------------------------------------

export default function useAvatar() {
  const [open, setOpen] = useState(null);

  const handleOpen = useCallback((event) => {
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const handleUpdate = useCallback(async (pk, url) => {
    await updateAvatar(pk, url);
    setOpen(false);
  }, []);

  return {
    open,
    handleOpen,
    handleClose,
    handleUpdate,
    setOpen,
  };
}
