export default async function getUnapprovedTransactions() {
  const url = 'https://0yxexcpp8f.execute-api.us-east-1.amazonaws.com/unapprovedTransactions';
  const requestOptions = {
    cache: 'no-store',
    next: { tags: ['transactions'] },
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
