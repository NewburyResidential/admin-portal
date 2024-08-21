import Iconify from 'src/components/iconify';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';

import { m } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Card } from '@mui/material';

export default function ResourceGroupCard({ label, icon, isAddNew = false, editMode, openDialog }) {
  const router = useRouter();
  const handleEdit = (event) => {
    event.stopPropagation();
    openDialog();
  };

  const handleClick = () => {
    if (isAddNew) {
      openDialog();
      return;
    }
    const formattedLabel = label.replace(/\s+/g, '_').toLowerCase();
    const encodedLabel = encodeURIComponent(formattedLabel);
    router.push(`/dashboard/resources/${encodedLabel}`);
  };

  return (
    <m.div whileHover={{ scale: 0.99, transition: { duration: 0.2 } }}>
      <Card
        sx={{
          backgroundColor: (theme) => isAddNew && (theme.palette.mode === 'light' ? '#F0FFF0' : '#1C352D'),
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          height: '220px',
          width: '220px',
          border: (theme) => (theme.palette.mode === 'light' ? '1px solid #D3D3D3' : `1px solid ${theme.palette.grey[700]}`),
          borderRadius: '12px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          margin: '20px',
          padding: '25px',

          cursor: 'pointer',
        }}
        onClick={handleClick}
      >
        <Typography
          variant="h6"
          sx={{
            margin: '0 0 20px 0',
            textAlign: 'center',
            height: '130px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            fontWeight: '600',
          }}
        >
          {label}
        </Typography>

        <Iconify
          icon={icon}
          sx={{
            width: 100,
            height: '100%',
            color: (theme) => (theme.palette.mode === 'light' ? (isAddNew ? '#556B2F' : '#212B36') : isAddNew ? '#556B2F' : 'grey.500'),
            fontSize: '2.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '25px',
          }}
        />

        {editMode && !isAddNew && (
          <IconButton
            onClick={handleEdit}
            sx={{
              position: 'absolute',
              bottom: '10px',
              right: '10px',
            }}
          >
            <EditIcon />
          </IconButton>
        )}
      </Card>
    </m.div>
  );
}
