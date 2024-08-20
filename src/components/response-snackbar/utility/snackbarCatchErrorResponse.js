import * as Sentry from '@sentry/nextjs';

export default function snackbarCatchErrorResponse(error, errorTitle) {
  const errorName = error?.name || 'Error';
  const errorMessage = error?.message || 'No Summary available';
  const errorStack = error?.stack || 'No stack trace available';
  const errorSummary = `${errorName}: ${errorMessage}`;

  Sentry.captureException(error, {
    level: 'error',
    extra: {
      ErrorTitle: errorTitle,
      Message: errorSummary,
      Stack: errorStack,
    },
  });

  return {
    severity: 'error',
    message: errorTitle,
    infoDialog: {
      summary: errorSummary,
      stack: errorStack,
      isAdmin: true,
    },
  };
}
