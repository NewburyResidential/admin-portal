
// API ----------------------------------------------------------------------

export const SUPABASE_API = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL,
  key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
};

export const AZURE_FORM_RECOGNIZER = {
formEndpoint: "https://comparison.cognitiveservices.azure.com/",
formApiKey: process.env.AZURE_FORM_RECOGNIZER_API_KEY,
storageContainer: "consumers-energy-gas-electric",
storageConnectionString: process.env.AZURE_FORM_RECOGNIZER_STORAGE_CONNECTION_STRING,
storageName: process.env.AZURE_FORM_RECOGNIZER_STORAGE_NAME,
storageKey: process.env.AZURE_FORM_RECOGNIZER_STORAGE_KEY,
}

export const HOST_API = process.env.NEXT_PUBLIC_HOST_API;
export const ASSETS_API = process.env.NEXT_PUBLIC_ASSETS_API;
