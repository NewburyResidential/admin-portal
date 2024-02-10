export default async function getSuggestedReceipts() {
  const url = 'https://0yxexcpp8f.execute-api.us-east-1.amazonaws.com/getSuggestedReceipts';
  const requestOptions = {
    cache: 'no-store',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const response = await fetch(url, requestOptions);
    if (!response.ok) {
      console.error(`HTTP error! Status: ${response.status}`);
      return [];
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data: ', error);
    return [];
  }
}
