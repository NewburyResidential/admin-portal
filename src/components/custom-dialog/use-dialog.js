import { useCallback, useState } from 'react';

// ----------------------------------------------------------------------

export default function useDialog() {
  const [open, setOpen] = useState(null);

  const handleOpen = useCallback((event) => {
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  return {
    open,
    handleOpen,
    handleClose,
    setOpen,
  };
}
