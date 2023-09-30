import PropTypes from 'prop-types';

import UploadMultiFiles from 'src/components/upload-files/UploadMultiFiles';
import { useSnackbar } from 'src/utils/providers/SnackbarProvider';
import { usePathname } from 'next/navigation';


export default function UploadUtilityBills({ setData }) {
  const pathname = usePathname();
  const modalLink = `${pathname}?utility=consumers`
  const { showResponseSnackbar } = useSnackbar();
  const acceptedFiles = {
    'image/png': ['.jpg', '.jpeg'],
    'application/pdf': ['.pdf'],
  };


  const onUpload = async (files) => {
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('files', file);
      });

      const response = await fetch('/api/formRecognizer', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log(data)
        if (data.results.length !== 0) {
          if (data.errors.length !==0) {
            showResponseSnackbar({ type: 'warning', message: 'Some Files Processed', modalLink});
          } else {
            showResponseSnackbar({ type: 'success', message: 'Files Processed Succesfully', modalLink});
          }
        } else {
          showResponseSnackbar({ type: 'error', message: 'Error Uploading Files', modalLink});
        }
       
       setData(data)
      } else {
        const err = await response.json();
        showResponseSnackbar({ type: 'error', message: 'Error Uploading Files', error: err });
      }
    } catch (err) {
      showResponseSnackbar({ type: 'error', message: 'Error Uploading Files', error: err });
    }
  };

  return <UploadMultiFiles onUpload={onUpload} accept={acceptedFiles} />;
}

UploadUtilityBills.propTypes = {
  setData: PropTypes.func,
};
