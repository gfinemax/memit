import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.memit.app',
  appName: 'Memit',
  webDir: 'out',
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: "#9b30ff",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
    },
  },
};

export default config;
