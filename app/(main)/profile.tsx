import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { SignedIn } from "@clerk/clerk-expo";
import { homeStyles } from "../../styles";
import { useUser } from "@clerk/clerk-react";
import { SignOutButton } from "../../components/signOutButton/SignOutButton";

const profile = () => {
  const { user } = useUser();

  return (
    <View style={homeStyles.container}>
      <SignedIn>
        <View>
          <Text style={homeStyles.welcomeText}>
            Bonjour {user?.emailAddresses[0].emailAddress}
          </Text>
          <SignOutButton />
        </View>
      </SignedIn>
    </View>
  );
};

export default profile;

const styles = StyleSheet.create({});
