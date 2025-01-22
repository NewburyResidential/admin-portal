'use server';

import axios from 'axios';

export const throwError = async () => {
  try {
    // Simulate an Axios request
    const response = await axios.get('https://example.com/api/data');

    // Check if the response status is not 200-299
    if (response.status < 200 || response.status >= 300) {
      throw new Error('Axios request failed with status: ');
    }

    // If the response is ok, return the data
    return response.data;
  } catch (error) {
    // Handle the error
    console.error('Axios error:', error);
    throw error; // Re-throw the error to be handled by the caller
  }
};
