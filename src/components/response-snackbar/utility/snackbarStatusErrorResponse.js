import * as Sentry from '@sentry/nextjs';

export default function snackbarStatusErrorResponse(response, responseStatus, expectedStatus, errorTitle) {
  const errorMessage = `Response Status Not OK: Expected ${expectedStatus}, Received ${responseStatus}`;
  const errorDetail = new Error(`${errorTitle}: ${errorMessage}`);

  Sentry.captureException(errorDetail, {
    level: 'error',
    extra: {
      ErrorTitle: errorTitle,
      Message: errorMessage,
      response,
    },
  });

  return {
    severity: 'error',
    message: errorTitle,
    infoDialog: {
      summary: errorMessage,
      stack: JSON.stringify(response, null, 2),
    },
  };
}
