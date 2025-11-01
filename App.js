import React from "react";
import { StatusBar } from "expo-status-bar";
import { AppProvider } from "./src/contexts/AppContext";
import AuthWrapper from "./src/components/AuthWrapper";
import Header from "./src/components/common/Header";

export default function App() {
  return (
    <AppProvider>
      <StatusBar style="light" />
      <AuthWrapper />
    </AppProvider>
  );
}
