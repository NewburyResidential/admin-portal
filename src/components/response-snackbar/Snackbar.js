// import { useState, forwardRef } from 'react';
// import { useRouter } from 'next/navigation';

// import Button from '@mui/material/Button';
// import Snackbar from '@mui/material/Snackbar';
// import MuiAlert from '@mui/material/Alert';
// import ErrorDialog from './ErrorDialog';

// //TODO monitor re-renders

// const Alert = forwardRef(function Alert(props, ref) {
//   return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
// });

// export default function ResponseSnackbar({ snackbarConfig, setSnackbarConfig }) {
//   const router = useRouter()

//  const {show, type, message, error, modalLink} = snackbarConfig
//   const [showError, setShowError] = useState(false);

//   const handleCloseSnackbar = (event, reason) => {
//     if (reason === 'clickaway') {
//       return;
//     }
//     setSnackbarConfig((prevConfig) => ({ ...prevConfig, show: false }));
//   };
//   const toggleError = () => {
//     setShowError(prev => !prev)
//   }

//   const handleAction = () => {
//     if (error) {
//       toggleError()
//     } else if (modalLink) {
//       router.push(modalLink)
//     }
//   }

//   return (
//     <>
//       <ErrorDialog open={showError} onClose={toggleError} error={error} />
//       <Snackbar open={show} autoHideDuration={5000} onClose={handleCloseSnackbar}>
//         <Alert
//           action={
//             modalLink || error ? <Button
//               color="inherit"
//               size="small"
//               onClick={handleAction}
//               sx={{ fontWeight: '700' }}
//             >
//               Show
//             </Button> : null}
//           onClose={handleCloseSnackbar}
//           severity={type}
//           sx={{ width: '100%' }}
//         >
//           {message}
//         </Alert>
//       </Snackbar>
//     </>
//   );
// }