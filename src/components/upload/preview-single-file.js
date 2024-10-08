import PropTypes from 'prop-types';

// @mui
import Box from '@mui/material/Box';

// ----------------------------------------------------------------------

//TODO: Addjust styling
export default function SingleFilePreview({ imgUrl = '', isPdf, previewFit }) {


  return (
    <Box
      sx={{
        p: 1,
        top: 0,
        left: 0,
        width: '100%',
        minHeight: '300px',
        height: previewFit === 'full' ? 'auto' : '100%',
        // position: 'absolute',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      {isPdf ? (
        <Box sx={{ width: '100%', height: { lg: '86vh', xs: '50vh' } }}>
          <iframe
            title="file preview"
            src={imgUrl}
            width="100%"
            height="100%" // Explicitly set iframe height to 100%
           />
        </Box>
      ) : (
        <Box
          component="img"
          alt="file preview"
          src={imgUrl}
          sx={{
            maxWidth: '100%',
            maxHeight: '80vh',
            objectFit: previewFit === 'cover' ? 'cover' : 'contain',
            borderRadius: 1,
          }}
        />
      )}
    </Box>
  );
}

SingleFilePreview.propTypes = {
  imgUrl: PropTypes.string,
};
