'use server';

import axios from 'axios';
import getMicrosoftAccessToken from '../microsoft-graph-api/get-microsoft-access-token';
import * as Sentry from '@sentry/nextjs';
import { revalidatePath } from 'next/cache';

export default async function cancelOnboardingTeamsMeeting({ eventId, organizerEmail = 'Mike@newburyresidential.com' }) {
  Sentry.setTag('functionName', 'cancelCalendarEvent');

  try {
    const accessToken = await getMicrosoftAccessToken();

    console.log('Cancelling calendar event:', { eventId, organizerEmail });

    const response = await axios.delete(`https://graph.microsoft.com/v1.0/users/${organizerEmail}/events/${eventId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      validateStatus: (status) => true,
    });

    console.log('Event cancellation response status:', response.status);
    console.log('Event cancellation response data:', response.data);

    if (response.status !== 204) {
      console.error('Event cancellation failed:', response.data);
      throw new Error(`Failed to cancel calendar event: ${response.status} ${response.statusText}`);
    }

    revalidatePath('/dashboard/employees', 'layout');

    return {
      success: true,
      message: 'Calendar event cancelled successfully',
    };
  } catch (error) {
    console.error('Error cancelling calendar event:', error);
    console.error('Error response data:', error.response?.data);
    Sentry.captureException(error);

    return {
      success: false,
      error: error.message || 'Failed to cancel calendar event',
    };
  }
}
