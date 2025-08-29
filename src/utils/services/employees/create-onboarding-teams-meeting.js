'use server';

import axios from 'axios';
import getMicrosoftAccessToken from '../microsoft-graph-api/get-microsoft-access-token';
import * as Sentry from '@sentry/nextjs';
import { revalidatePath } from 'next/cache';

export default async function createOnboardingTeamsMeeting({
  subject,
  startDateTime,
  endDateTime,
  attendees = [],
  description = '',
  organizerEmail = 'calendarscheduler@newburyresidential.com',
}) {
  Sentry.setTag('functionName', 'createCalendarEvent');


  try {
    const accessToken = await getMicrosoftAccessToken();

    // Create a regular calendar event (no Teams meeting)
    const eventPayload = {
      subject,
      start: {
        dateTime: startDateTime,
        timeZone: 'America/New_York',
      },
      end: {
        dateTime: endDateTime,
        timeZone: 'America/New_York',
      },
      attendees: attendees.map((email) => ({
        emailAddress: {
          address: email,
          name: email.split('@')[0],
        },
        type: 'required',
      })),
      body: {
        contentType: 'html',
        content: description,
      },
      allowNewTimeProposals: true,
      showAs: 'free',
      responseRequested: true,
      isReminderOn: true,
      reminderMinutesBeforeStart: 30,
    };

    console.log('Creating calendar event with payload:', JSON.stringify(eventPayload, null, 2));

    const response = await axios.post(`https://graph.microsoft.com/v1.0/users/${organizerEmail}/events`, eventPayload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      validateStatus: (status) => true,
    });

    console.log('Event creation response status:', response.status);
    console.log('Event creation response data:', response.data);

    if (response.status !== 201) {
      console.error('Event creation failed:', response.data);
      throw new Error(`Failed to create calendar event: ${response.status} ${response.statusText}`);
    }

    const event = response.data;
     revalidatePath('/dashboard/employees', 'layout');

    return {
      success: true,
      eventId: event.id,
      webLink: event.webLink,
      event: event,
    };
  } catch (error) {
    console.error('Error creating calendar event:', error);
    console.error('Error response data:', error.response?.data);
    Sentry.captureException(error);

    return {
      success: false,
      error: error.message || 'Failed to create calendar event',
    };
  }
}
