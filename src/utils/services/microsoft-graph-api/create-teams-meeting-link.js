'use server';

import axios from 'axios';
import getMicrosoftAccessToken from './get-microsoft-access-token';

export default async function createTeamsMeetingLink({
  subject,
  startDateTime,
  endDateTime
}) {
  try {
    const accessToken = await getMicrosoftAccessToken();
    
    // Create online meeting only (no calendar event)
    const meetingPayload = {
      subject,
      startDateTime,
      endDateTime
    };

    const response = await axios.post(
      'https://graph.microsoft.com/v1.0/me/onlineMeetings',
      meetingPayload,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        }
      }
    );

    return {
      success: true,
      joinUrl: response.data.joinWebUrl,
      conferenceId: response.data.conferenceId,
      meeting: response.data
    };

  } catch (error) {
    console.error('Error creating Teams meeting link:', error);
    return {
      success: false,
      error: error.message
    };
  }
} 