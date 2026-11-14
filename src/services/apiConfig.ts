import { Capacitor } from '@capacitor/core';

export const getApiBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim() !== '') {
    return envUrl.replace(/\/$/, '');
  }

  if (Capacitor.isNativePlatform()) {
    return 'https://ais-dev-xdpdxvrqyinvcqzpc7hqeu-80105292363.europe-west2.run.app';
  }

  return '';
};
