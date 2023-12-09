import Box from '@mui/material/Box';
import Iconify from 'src/components/iconify';

export default function AddReceiptUpload({ id, handleReceiptChange }) {
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', 'admin-portal-receipts');

      try {
        const response = await fetch('/api/aws/upload-image-s3', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();
        if (result.fileUrl) {
          handleReceiptChange(id, result.fileUrl);
          console.log(result.fileUrl);
        }
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };
  return (
    <Box
      onClick={() => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/png';
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
