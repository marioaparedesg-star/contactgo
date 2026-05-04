import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'net.contactgo.app',
  appName: 'ContactGo',
  webDir: 'out',
  server: {
    url: 'https://contactgo.net',
    cleartext: false
  }
};

export default config;
