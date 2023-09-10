// routes
import { paths } from 'src/routes/paths';

// API ----------------------------------------------------------------------

export const SUPABASE_API = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL,
  key: NEXT_PUBLIC_SUPABASE_ANON_KEY,
};

export const HOST_API = process.env.NEXT_PUBLIC_HOST_API;
export const ASSETS_API = process.env.NEXT_PUBLIC_ASSETS_API;

// ROOT PATH AFTER LOGIN SUCCESSFUL - TODO this does not really belong here
export const PATH_AFTER_LOGIN = paths.dashboard.root; // as '/dashboard'
