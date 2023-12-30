'use client';

import { m } from 'framer-motion';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CompactLayout from 'src/layouts/compact';

import { RouterLink } from 'src/routes/components';
import { MotionContainer, varBounce } from 'src/components/animate';
import SeoIllustration from 'src/assets/illustrations/seo-illustration';

// ----------------------------------------------------------------------

export default function View() {
  return (
    <CompactLayout>
      <MotionContainer>
        <m.div variants={varBounce().in}>
          <Typography variant="h3" sx={{ mb: 2 }}>
          Log Out Successful
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <Typography sx={{ color: 'text.secondary' }}>
          You have successfully logged out of your session
            <br />
            and will have restricted access until you sign back in with your Azure Credentials
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <SeoIllustration sx={{ height: 260, my: { xs: 5, sm: 10 } }} />
        </m.div>

        <Button sx={{width: '120px'}} component={RouterLink} href="/auth/login" size="large" variant="contained">
          Sign In 
        </Button>
      </MotionContainer>
    </CompactLayout>
  );
}
