'use server';

import axios from 'axios';
import { ENTRATA_API, ENTRATA_API_KEY } from 'src/config-global';

const ENTRATA_BASE_URL = `${ENTRATA_API.baseUrl}/leases`;

async function buildFetch(propertyId) {
  if (!propertyId) {
    throw new Error('propertyId is required to fetch leases.');
  }
  return {
    auth: {
      type: 'apikey',
    },
    requestId: '15',
    method: {
      name: 'getLeases',
      version: 'r2',
      params: {
        // Consider making propertyId dynamic if needed
        propertyId,
        // 4=Current, 5=Notice, 6=Past (Adjust as needed)
        leaseStatusTypeIds: '4, 5, 6',
        // Fetches lease history which might include move-out dates for past leases
        includeLeaseHistory: '1',
      },
    },
  };
}

export default async function getEntrataLeases(accountId) {
  const organizedData = {};

  try {
    const postData = await buildFetch(accountId);

    const response = await axios.post(ENTRATA_BASE_URL, postData, {
      headers: {
        'X-Api-Key': ENTRATA_API_KEY,
        'Content-Type': 'application/json',
      },
    });

    // Check for successful response and expected structure
    if (response.data?.response?.result?.leases?.lease) {
      const leases = response.data.response.result.leases.lease;
      const leaseArray = Array.isArray(leases) ? leases : [leases];

      leaseArray.forEach((lease) => {
        // Safely access nested properties
        const customers = lease.customers?.customer;
        const unitSpaces = lease.unitSpaces?.unitSpace;

        const leaseInfo = {
          leaseId: lease.id,
          moveInDate: lease.moveInDate,
          moveOutDate: lease?.moveOutDate, // Might be undefined
          // Handle case where customer array might be empty or structure varies
          nameFull: customers && customers.length > 0 ? customers[0]?.nameFull : 'No Name',
        };

        const buildingName = lease.buildingName || 'Unknown Building';
        // Handle case where unitSpace array might be empty or structure varies
        const unitSpace = unitSpaces && unitSpaces.length > 0 ? unitSpaces[0]?.unitSpace : 'No Unit Space';

        if (!organizedData[buildingName]) {
          organizedData[buildingName] = {};
        }

        if (!organizedData[buildingName][unitSpace]) {
          organizedData[buildingName][unitSpace] = [];
        }

        organizedData[buildingName][unitSpace].push(leaseInfo);
      });
    } else {
      console.warn('Entrata API response did not contain the expected lease data structure:', response.data);
    }

    // Return the processed object directly, not a string
    return organizedData;
  } catch (error) {
    // Log more specific error details if available
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Error fetching Entrata leases - Status:', error.response.status);
      console.error('Error fetching Entrata leases - Data:', error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Error fetching Entrata leases - No response:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error fetching Entrata leases - Request setup:', error.message);
    }
    // Return an empty object or an error indicator instead of a string
    return { error: 'Failed to fetch Entrata leases.' };
  }
}
