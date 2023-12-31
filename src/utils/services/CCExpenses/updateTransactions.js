export default async function updateTransactions(transactionsToUpdate) {
  const url = 'https://0yxexcpp8f.execute-api.us-east-1.amazonaws.com/updateTransactions';
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(transactionsToUpdate),
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
    throw new Error('Failed to update transactions');
  }
}
