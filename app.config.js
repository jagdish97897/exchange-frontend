export default ({ config
}) => ({
  ...config,
  name: "Exchange",
  slug: "Exchange",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/logo-removebg-preview 1.png",
  userInterfaceStyle: "light",
  splash: {
    image: "./assets/images/logo-removebg-preview 1.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  assetBundlePatterns: [
    "**/*"
  ],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.transvuesolution.Exchange"
  },
  android: {
    config: {
      googleMaps: {
        apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY
      },
    },
    permissions: [
      "INTERNET"
    ],
    adaptiveIcon: {
      foregroundImage: "./assets/images/kgv.png",
      backgroundColor: "#ffffff",
    },
    versionCode: 1,
    jsEngine: "jsc",
    plugins: [
      "expo-secure-store"
    ],
    package: "com.transvuesolution.Exchange",
    googleServicesFile: "./google-services (1).json"
  },
  extra: {
    eas: {
      projectId: "33be0800-3595-47aa-bb08-b7308c36d0b2"
    }
  }
});

export const API_END_POINT = 'http://192.168.1.13:8000';
