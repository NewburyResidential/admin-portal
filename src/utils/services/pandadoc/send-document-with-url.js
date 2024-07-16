'use server';

import * as pd_api from 'pandadoc-node-client';

export default async function sendDocumentWithUrl() {
  const configuration = pd_api.createConfiguration({
    authMethods: { apiKey: `API-Key ${process.env.PANDADOC_API_KEY}` },
    baseServer: new pd_api.ServerConfiguration('https://api.pandadoc.com', {}),
  });

  const apiInstance = new pd_api.DocumentsApi(configuration);
  try {
    let createdDocument = await createDocumentFromPdfUrl(apiInstance);
    console.log('Document was successfully uploaded: %o', createdDocument);
    // we will uncomment the next 3 lines in the following sections
    await ensureDocumentCreated(apiInstance, createdDocument);
    await sendDocument(apiInstance, createdDocument);
    console.log("Document was successfully created and sent to the recipients!");
  } catch (e) {
    if (e instanceof pd_api.ApiException) {
      console.log(e.message);
    } else {
      throw e;
    }
  }
}

// ||||||||||||||||||||||||||||||||||||||

const MAX_CHECK_RETRIES = 5;
const PDF_URL = 'https://cdn2.hubspot.net/hubfs/2127247/public-templates/SamplePandaDocPdf_FieldTags.pdf';

async function sendDocument(apiInstance, document) {
  await apiInstance.sendDocument({
    id: String(document.id),
    documentSendRequest: {
      silent: false,
      subject: "Sent via Node SDK",
      message: "This document was sent via Node SDK example",
    },
  });
}

async function createDocumentFromPdfUrl(apiInstance) {
  console.log(apiInstance);
  const documentCreateRequest = {
    name: 'Sample Document from PDF with Field Tags',
    url: PDF_URL,
    tags: ['tag_1', 'tag_2'],
    recipients: [
      {
        email: 'Mike@newburyresidential.com',
        firstName: 'Josh',
        lastName: 'Ron',
        role: 'user',
        signingOrder: 1,
      },
      // {
      //   email: 'Mike@newburyresidential.com',
      //   firstName: 'John',
      //   lastName: 'Doe',
      //   signingOrder: 2,
      // },
    ],
    fields: {
      name: { value: 'John', role: 'user' },
      like: { value: true, role: 'user' },
    },
    metadata: {
      'salesforce.opportunity_id': '123456',
      my_favorite_pet: 'Panda',
    },
    parseFormFields: false,
  };
  return await apiInstance.createDocument({
    documentCreateRequest: documentCreateRequest,
  });
}

async function ensureDocumentCreated(apiInstance, document) {
  let retries = 0;

  while (retries < MAX_CHECK_RETRIES) {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    retries++;

    let response = await apiInstance.statusDocument({
      id: String(document.id),
    });
    if (response.status === 'document.draft') {
      return;
    }
  }

  throw new Error('The document was not processed yet');
}
