'use client';

import { m } from 'framer-motion';
import Typography from '@mui/material/Typography';
import CompactLayout from 'src/layouts/compact';

import { MotionContainer, varBounce } from 'src/components/animate';
import MotivationIllustration from 'src/assets/illustrations/motivation-illustration';

// ----------------------------------------------------------------------

export default function PendingApproval() {
  return (
    <CompactLayout>
      <MotionContainer>
        <m.div variants={varBounce().in}>
          <Typography variant="h3" sx={{ mb: 2 }}>
            Onboarding Complete!
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <Typography sx={{ color: 'text.secondary' }}>
            You’ve finished all the required onboarding steps. Our team will review your information and get in touch with you shortly
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <MotivationIllustration sx={{ height: 260, my: { xs: 5, sm: 10 } }} />
        </m.div>
      </MotionContainer>
    </CompactLayout>
  );
}
