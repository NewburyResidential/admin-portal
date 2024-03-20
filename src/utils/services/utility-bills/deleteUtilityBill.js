'use server';

export default async function deleteUtilityBill(utilityKey) {
  const url = 'https://gpxllcrxmk.execute-api.us-east-1.amazonaws.com/deleteutilitybill';
  const requestOptions = {
    method: 'POST',
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(utilityKey),
  };

  try {
    const response = await fetch(url, requestOptions);
    if (response.ok) {
      console.log('response', response);
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error Updating Utility Bill', error);
    return false;
  }
}
