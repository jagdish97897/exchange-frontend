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
    package: "com.tsilteam.Exchange"
  },
  extra: {
    eas: {
      projectId: "de3fe3a0-f038-40e2-a3c2-60dfe6a9a9c7"
    }
  }
});

export const API_END_POINT = 'http://192.168.1.7:8000';
