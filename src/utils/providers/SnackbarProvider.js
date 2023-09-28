import { createContext, useContext, useState, useCallback } from 'react';
import ResponseSnackbar from 'src/components/response-snackbar/Snackbar';

const SnackbarContext = createContext();

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
}

export const SnackbarProvider = ({ children }) => {
  const [snackbarConfig, setSnackbarConfig] = useState({
    show: false,
    type: 'info',
    message: 'issue showing response',
    error: null,
  });

  const showResponseSnackbar = useCallback(({ type, message = '', error = null }) => {
    setSnackbarConfig({ show: true, type, message, error });
  }, []);

  return (
    <SnackbarContext.Provider value={{ showResponseSnackbar }}>
      {children}
      <ResponseSnackbar snackbarConfig={snackbarConfig} setSnackbarConfig={setSnackbarConfig} />
    </SnackbarContext.Provider>
  );
};