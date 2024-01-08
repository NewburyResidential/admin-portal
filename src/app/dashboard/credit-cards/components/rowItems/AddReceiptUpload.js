import Box from '@mui/material/Box';
import Iconify from 'src/components/iconify';
import { useFormContext } from 'react-hook-form';


import { uploadS3Image } from 'src/utils/services/receipt-s3-bucket/uploadS3Image';

export default function AddReceiptUpload({ id, transactionIndex, setLoading, hideHover }) {
  const {setValue} = useFormContext();

  const handleFileChange = async (event) => {
    hideHover();
    setLoading(true);
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', id);
      formData.append('bucket', 'admin-portal-receipts');

      try {
        const response = await uploadS3Image(formData);

        if (response) {
          setValue(`transactions[${transactionIndex}].receipt`, response.fileUrl);
          setValue(`transactions[${transactionIndex}].tempPdfReceipt`, response.tempPdfUrl);

        }
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
    setLoading(false);
  };
  return (
    <Box
      onClick={() => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/png, image/jpeg, application/pdf';
        input.onchange = handleFileChange;
        input.click();
      }}
      sx={{
        padding: '20px',
        textAlign: 'center',
        borderRadius: '0 10px 10px 0',
        backgroundColor: '#808080',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        zIndex: 1,
      }}
    >
      <Iconify icon="material-symbols:upload" width={17} />
    </Box>
  );
}
