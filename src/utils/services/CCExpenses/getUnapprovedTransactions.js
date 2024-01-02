export default async function getUnapprovedTransactions() {
  const url = 'https://0yxexcpp8f.execute-api.us-east-1.amazonaws.com/unapprovedTransactions';
  const requestOptions = {
    cache: 'no-store', 
    //cache: 'force-cache',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const response = await fetch(url, requestOptions);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data: ', error);
    throw new Error('Failed to get transactions');
  }
}