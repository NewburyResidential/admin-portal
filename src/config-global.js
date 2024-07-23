const mode = 'production'; // dev | prod

// API ----------------------------------------------------------------------
export const ENTRATA_API = {
  baseUrl: mode === 'production' ? process.env.ENTRATA_BASEURL : process.env.ENTRATA_DEV_BASEURL,
  username: mode === 'production' ? process.env.ENTRATA_USERNAME : process.env.ENTRATA_DEV_USERNAME,
  password: mode === 'production' ? process.env.ENTRATA_PASSWORD : process.env.ENTRATA_DEV_PASSWORD,
};

export const HOST_API = process.env.NEXT_PUBLIC_HOST_API;
export const ASSETS_API = process.env.NEXT_PUBLIC_ASSETS_API;

export const AWS_CONFIG = {
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
};