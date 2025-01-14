import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import ResponseSnackbar from 'src/components/response-snackbar/Snackbar';

const SnackbarContext = createContext();

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
};

export const SnackbarProvider = ({ session, children }) => {
  const isAdmin = session?.user?.roles?.includes('admin') || false;
  const [snackbarConfig, setSnackbarConfig] = useState({
    isAdmin,
    errors: [],
    open: false,
  });

  const showResponseSnackbar = useCallback(
    (data) => {
      let errors = [];
      if (!Array.isArray(data)) {
        errors = [data];
      } else {
        errors = data;
      }

      setSnackbarConfig((prevConfig) => ({
        ...prevConfig,
        errors,
        isAdmin,
        open: true,
      }));
    },
    [isAdmin]
  );

  const value = useMemo(() => ({ showResponseSnackbar }), [showResponseSnackbar]);

  return (
    <SnackbarContext.Provider value={value}>
      {children}
      <ResponseSnackbar snackbarConfig={snackbarConfig} setSnackbarConfig={setSnackbarConfig} />
    </SnackbarContext.Provider>
  );
};
