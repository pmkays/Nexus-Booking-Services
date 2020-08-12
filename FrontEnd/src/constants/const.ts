export const DEV_API_URL = process.env.DEV_API_URL as string || '';
export const PROD_API_URL = process.env.PROD_API_URL as string || '';
export const NODE_ENV = process.env.NODE_ENV as string  || 'development';

export const API_URL = NODE_ENV === 'production' ? PROD_API_URL : DEV_API_URL;
