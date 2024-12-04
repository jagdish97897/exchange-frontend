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
    package: "com.jagdish89.Exchange"
  },
  extra: {
    eas: {
      projectId: "604adac1-b4cb-4fa0-ba1e-ff6433debe69"
    }
  }
});
