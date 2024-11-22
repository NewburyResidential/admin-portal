'use server';

export default async function scrapeLowesItemBySku(item) {
  console.log('scraping item', item);

  setTimeout(async () => {
    const url = 'https://gkteqh3jvj.execute-api.us-east-1.amazonaws.com/getlowesItem';
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    };

    try {
      const response = await fetch(url, requestOptions);
      if (!response.ok) {
        const dat = await response.json();
        console.log("data", dat);
        console.error(`HTTP error! Status: ${response.status}`);
        return;
      }
      const data = await response.json();
      console.log('Data fetched for item', item.productId, data); // Just for logging
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  }, 0); // Run the async code "detached" from the main function

  // Return immediately
  return null;
}
