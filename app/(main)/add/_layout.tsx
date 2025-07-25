import { Stack } from "expo-router/stack";

export default function AddLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="camera"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
