


async function sendEntrataTransaction(transaction, entrataAllocations, externalId) {
    const entrataBaseUrl = 'https://newburyresidential.entrata.com/api/v1/vendors';
    const username = process.env.USERNAME;
    const password = process.env.PASSWORD;
  
    const postData = await buildEntrataApiPayload(transaction, entrataAllocations, externalId);
  
    try {
      const response = await axios.post(entrataBaseUrl, postData, {
        auth: {
          username,
          password,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error sending Entrata transaction:', error);
      throw error;
    }
  }