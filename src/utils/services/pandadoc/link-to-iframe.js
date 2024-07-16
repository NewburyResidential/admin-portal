'use server';

import * as pd_api from 'pandadoc-node-client';

export default async function createLiveLink() {
  const configuration = pd_api.createConfiguration({
    authMethods: { apiKey: `API-Key ${process.env.PANDADOC_API_KEY}` },
    baseServer: new pd_api.ServerConfiguration('https://api.pandadoc.com', {}),
  });

  const apiInstance = new pd_api.DocumentsApi(configuration);

  const body = {
    id: "3rksHGNA6fjjRDQXo4XAhW",
    documentCreateLinkRequest: {
      recipient: "mikeaxio1@gmail.com",
      lifetime: 7200, // the number of seconds before the link expires
    },
  };

  try {
    const data = await apiInstance.createDocumentLink(body);
    console.log('API called successfully. Returned data:', data);
    return data.id;
  } catch (error) {
    console.error(error);
  }
}
