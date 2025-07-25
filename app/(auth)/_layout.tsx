import { Redirect, Stack } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

export default function AuthRoutesLayout() {
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    return <Redirect href={"/"} />;
  }

  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false , animation: "slide_from_left",}} />
      <Stack.Screen name="signup" options={{ headerShown: false , animation: "slide_from_right",}} />
    </Stack>
  );
}
