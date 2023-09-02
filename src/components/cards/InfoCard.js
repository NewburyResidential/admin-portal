import React from 'react'

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import { useTheme } from '@mui/material/styles';
import AnalyticsWidgetSummary from './analytics-widget-summary';


export default function InfoCard() {
  return (
    <>
     <AnalyticsWidgetSummary
            title="Weekly Sales"
            total={714000}
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_bag.png" />}
          />
    </>
  )
}
