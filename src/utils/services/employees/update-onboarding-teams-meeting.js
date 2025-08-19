'use server';

import axios from 'axios';
import getMicrosoftAccessToken from '../microsoft-graph-api/get-microsoft-access-token';
import * as Sentry from '@sentry/nextjs';
import { revalidatePath } from 'next/cache';

export default async function updateOnboardingTeamsMeeting({
  eventId,
  startDateTime,
  endDateTime,
  organizerEmail = 'Mike@newburyresidential.com',
}) {
  Sentry.setTag('functionName', 'updateCalendarEvent');

  try {
    const accessToken = await getMicrosoftAccessToken();

    // Update the calendar event with new date/time
    const updatePayload = {
      start: {
        dateTime: startDateTime,
        timeZone: 'America/New_York',
      },
      end: {
        dateTime: endDateTime,
        timeZone: 'America/New_York',
      },
    };

    console.log('Updating calendar event with payload:', JSON.stringify(updatePayload, null, 2));

    const response = await axios.patch(`https://graph.microsoft.com/v1.0/users/${organizerEmail}/events/${eventId}`, updatePayload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      validateStatus: (status) => true,
    });

    console.log('Event update response status:', response.status);
    console.log('Event update response data:', response.data);

    if (response.status !== 200) {
      console.error('Event update failed:', response.data);
      throw new Error(`Failed to update calendar event: ${response.status} ${response.statusText}`);
    }

    const event = response.data;
    revalidatePath('/dashboard/employees', 'layout');
    
    return {
      success: true,
      eventId: event.id,
      webLink: event.webLink,
      event: event,
      message: 'Calendar event updated successfully',
    };
  } catch (error) {
    console.error('Error updating calendar event:', error);
    console.error('Error response data:', error.response?.data);
    Sentry.captureException(error);

    return {
      success: false,
      error: error.message || 'Failed to update calendar event',
    };
  }
}
