import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import MainNavigator from "./MainNavigator";
import Providers from "./Providers";

export default function App() {
  return (
    <Providers>
      <NavigationContainer>
        <MainNavigator />
      </NavigationContainer>
    </Providers>
  );
}
