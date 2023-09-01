import PropTypes from 'prop-types';
// @mui
import Box from '@mui/material/Box';
//


// ----------------------------------------------------------------------

export default function SingleFilePreview({ imgUrl = '' }) {
  return (
    <Box
      sx={{
        p: 1,
        top: 0,
        left: 0,
        width: 1,
        height: 1,
        position: 'absolute',
      }}
    >
      Replace with Image
    </Box>
  );
}

SingleFilePreview.propTypes = {
  imgUrl: PropTypes.string,
};
