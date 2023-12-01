const mode = 'dev'; // dev | prod

// API ----------------------------------------------------------------------

export const SUPABASE_API = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL,
  key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
};

export const AZURE_FORM_RECOGNIZER = {
formEndpoint: "https://document-intelligence-utilities.cognitiveservices.azure.com/",
formApiKey: process.env.AZURE_FORM_RECOGNIZER_API_KEY,
storageContainer: "consumers-energy-gas-electric",
storageConnectionString: process.env.AZURE_FORM_RECOGNIZER_STORAGE_CONNECTION_STRING,
storageName: process.env.AZURE_FORM_RECOGNIZER_STORAGE_NAME,
storageKey: process.env.AZURE_FORM_RECOGNIZER_STORAGE_KEY,
}

export const ENTRATA_API = {
baseUrl: mode === 'production' ? process.env.ENTRATA_BASEURL : process.env.ENTRATA_DEV_BASEURL,
username: mode === 'production' ? process.env.ENTRATA_USERNAME : process.env.ENTRATA_DEV_USERNAME,
password: mode === 'production' ? process.env.ENTRATA_PASSWORD : process.env.ENTRATA_DEV_PASSWORD,

};

export const HOST_API = process.env.NEXT_PUBLIC_HOST_API;
export const ASSETS_API = process.env.NEXT_PUBLIC_ASSETS_API;
