import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'topic_manager',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  plugins:{
    GoogleAuth: {
      scopes: ["profile", "email"],
      serverClientId: "728553962733-rlrns4doje1t4rderj11e2v9u72s24jj.apps.googleusercontent.com",
      forceCodeForRefreshToken: true
    }
  }
};

export default config;
