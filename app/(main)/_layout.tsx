import { Link, Redirect, Tabs } from "expo-router";
import { SignedIn, SignedOut, useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, View, Text } from "react-native";
import { buttonStyles, cardStyles, homeStyles } from "styles";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScannedProductProvider } from "contexts/ScannedProductContext";

export default function AuthRoutesLayout() {
  const { isSignedIn } = useAuth();

  if (!isSignedIn) {
    return <Redirect href={"/"} />;
  }

  return (
    <ScannedProductProvider>
      <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
        <View style={{ flex: 1 }}>
          <SignedIn>
          <Tabs>
            <Tabs.Screen
              name="(home)"
              options={{
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="home-outline" color={color} size={size} />
                ),
                title: "Home",
                headerShown: false,
              }}
            />
            <Tabs.Screen
              name="add"
              options={{
                headerShown: false,
                title: "Add",
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="add-outline" color={color} size={size} />
                ),
              }}
            />
            <Tabs.Screen
              name="profile"
              options={{
                headerShown: false,
                title: "Profile",
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="person-outline" color={color} size={size} />
                ),
              }}
            />
          </Tabs>
        </SignedIn>

        <SignedOut>
          <View style={cardStyles.base}>
            <View style={homeStyles.linkContainer}>
              <Link href="/(auth)/sign-in" asChild>
                <TouchableOpacity
                  style={[
                    buttonStyles.base,
                    buttonStyles.primary,
                    buttonStyles.large,
                  ]}
                >
                  <Text style={[buttonStyles.text, buttonStyles.textLarge]}>
                    Se connecter
                  </Text>
                </TouchableOpacity>
              </Link>
              <Link href="/(auth)/sign-up" asChild>
                <TouchableOpacity
                  style={[
                    buttonStyles.base,
                    buttonStyles.primary,
                    buttonStyles.large,
                  ]}
                >
                  <Text style={[buttonStyles.text, buttonStyles.textLarge]}>
                    S'inscrire
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </SignedOut>
      </View>
    </SafeAreaView>
    </ScannedProductProvider>
  );
}
