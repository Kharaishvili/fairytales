import { Stack } from "expo-router";
import "react-native-reanimated";
import Toast from "react-native-toast-message";
import { toastConfig } from "../components/Toast";

export default function RootLayout() {
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{ presentation: "transparentModal", title: "Modal" }}
        />
        <Stack.Screen name="generate" />
      </Stack>
      <Toast config={toastConfig} />
    </>
  );
}
