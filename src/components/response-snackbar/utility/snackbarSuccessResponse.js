
export default function snackbarSuccessResponse( response, successTitle, data ) {
  
  return {
    severity: 'success',
    message: successTitle,
    infoDialog: {
      stack: JSON.stringify(response, null, 2),
    },
    data,
  };
}
