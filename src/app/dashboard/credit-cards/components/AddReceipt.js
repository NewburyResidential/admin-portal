import Box from '@mui/material/Box';
import Iconify from 'src/components/iconify';
import IconButton from '@mui/material/IconButton';

import AddReceiptUpload from './AddReceiptUpload';
import AddReceiptStorage from './AddReceiptStorage';

const showHoverIcons = (itemId) => {
  const splitButtons = document.getElementById(`split-buttons-${itemId}`);
  const addPhoto = document.getElementById(`add-photo-${itemId}`);

  if (splitButtons && addPhoto) {
    splitButtons.style.opacity = '1';
    addPhoto.style.opacity = '0';
  }
};

const hideHoverIcons = (itemId) => {
  const splitButtons = document.getElementById(`split-buttons-${itemId}`);
  const addPhoto = document.getElementById(`add-photo-${itemId}`);

  if (splitButtons && addPhoto) {
    splitButtons.style.opacity = '0';
    addPhoto.style.opacity = '1';
  }
};

export default function AddReceipt({ item, handleReceiptChange }) {
const hasReceipt = item.receipt !== null && item.receipt !== undefined && item.receiptUrl !== '';

  return (
    <Box onMouseEnter={() => showHoverIcons(item.id)} onMouseLeave={() => hideHoverIcons(item.id)}>
      <Box
        id={`split-buttons-${item.id}`}
        sx={{
          maxHeight: '0px',
          display: 'flex',
          justifyContent: 'center',
          opacity: '0',
          transition: 'opacity 0.3s',
        }}
      >
        <AddReceiptStorage />
        <Box
          sx={{
            width: '2px',
          }}
        ></Box>
       <AddReceiptUpload id={item.id} handleReceiptChange={handleReceiptChange} />
      </Box>
      <IconButton id={`add-photo-${item.id}`} disabled={true}>
        {hasReceipt ?  <Iconify icon="carbon:receipt" color="#169B62" width={25} /> : <Iconify icon="material-symbols-light:attach-file-add-rounded" color="#CD5C5C" width={25} />}
      </IconButton>
    </Box>
  );
}
