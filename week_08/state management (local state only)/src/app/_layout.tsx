import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Available Songs" }} />
      <Stack.Screen name="playlist" options={{ title: "My Playlist" }} />
    </Stack>
  );
}
