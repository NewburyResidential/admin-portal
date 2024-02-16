export default async function getUtilityBills() {
  const url = 'https://gpxllcrxmk.execute-api.us-east-1.amazonaws.com/getutilitybills';
  const requestOptions = {
    next: { tags: ['utilities'] },
    cache: 'no-store',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const response = await fetch(url, requestOptions);
    return await response.json();
  } catch (error) {
    console.error('Error fetching data: ', error);
    return [];
  }
}
