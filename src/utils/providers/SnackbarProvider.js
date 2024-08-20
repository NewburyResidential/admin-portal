import { createContext, useContext, useState, useCallback } from 'react';
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
    severity: 'info',
    message: 'issue showing response',
    infoDialog: null,
    modalLink: null,
    open: false,
  });

  const showResponseSnackbar = useCallback(
    ({ severity, message = '', infoDialog = null, modalLink = null }) => {
      setSnackbarConfig((prevConfig) => ({
        ...prevConfig,
        severity,
        message,
        infoDialog,
        modalLink,
        isAdmin,
        open: true,
      }));
    },
    [isAdmin]
  );

  return (
    <SnackbarContext.Provider value={{ showResponseSnackbar }}>
      {children}
      <ResponseSnackbar snackbarConfig={snackbarConfig} setSnackbarConfig={setSnackbarConfig} />
    </SnackbarContext.Provider>
  );
};
