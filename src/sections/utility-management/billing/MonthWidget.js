import PropTypes from 'prop-types';
// @mui
import { alpha, useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
// theme
import { bgGradient } from 'src/theme/css';
// utils
import { Card } from '@mui/material';
// theme

// ----------------------------------------------------------------------

export default function MonthWidget({
  title,
  subTitle,
  color = 'primary',
  ...other
}) {
  const theme = useTheme();
  const lightMode = theme.palette.mode === 'light';
  return (
    <Card>
    <Stack
      alignItems="center"
      sx={{
        ...bgGradient({
          direction: '135deg',
          startColor: alpha(lightMode ? theme.palette[color].light : theme.palette[color].main, 0.2),
          endColor: alpha(lightMode ? theme.palette[color].main : theme.palette[color].darker, 0.2),
        }),
        py: 2,
        textAlign: 'center',
        color: lightMode ? `${color}.darker` : `${color}.lighter`,
        backgroundColor: lightMode ? 'common.white' : 'common.darker',
      }}
      {...other}
    >
      <Typography variant="h3">{title}</Typography>
      <Typography variant="subtitle2" sx={{ opacity: 0.64 }}>{subTitle}</Typography>
    </Stack>
    </Card>
  );
}

MonthWidget.propTypes = {
  color: PropTypes.string,
  subTitle: PropTypes.string,
  title: PropTypes.string,
};
