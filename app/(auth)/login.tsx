import { useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { authStyles, inputStyles, buttonStyles, cardStyles } from "../../styles";
import { errorStyle } from "../../styles/global/theme";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  useForm,
  Controller,
  SubmitHandler,
  FieldValues,
} from "react-hook-form";

const formSchema = z.object({
  email: z.string({ error: "Email requis" }).email("Format d'email invalide"),
  password: z.string({ error: "Mot de passe requis" }).min(8),
});
type FormValues = z.infer<typeof formSchema>;

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailFocused, setEmailFocused] = React.useState(false);
  const [passwordFocused, setPasswordFocused] = React.useState(false);

  const onSignInPress = async (emailAddress: string, password: string) => {
    if (!isLoaded) return;

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/");
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(formSchema) });

  const processForm: SubmitHandler<FieldValues> = (data) => {
    onSignInPress(data.email, data.password);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View style={authStyles.container}>
        <View style={[cardStyles.base, cardStyles.large]}>
          <Text style={authStyles.title}>Connexion</Text>

          <View style={inputStyles.container}>
            <Controller
              name="email"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  autoCapitalize="none"
                  value={value}
                  placeholder="Entrez votre email"
                  onChangeText={onChange}
                  style={[
                    inputStyles.input,
                    emailFocused && inputStyles.inputFocused,
                  ]}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={onBlur}
                />
              )}
            />
            {errors.email && (
              <Text style={errorStyle}>{errors.email.message}</Text>
            )}
          </View>

          <View style={inputStyles.container}>
            <Controller
              name="password"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  value={value}
                  placeholder="Entrez votre mot de passe"
                  secureTextEntry={true}
                  onChangeText={onChange}
                  style={[
                    inputStyles.input,
                    passwordFocused && inputStyles.inputFocused,
                  ]}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={onBlur}
                />
              )}
            />
            {errors.password && (
              <Text style={errorStyle}>{errors.password.message}</Text>
            )}
          </View>

          <TouchableOpacity
            onPress={handleSubmit(processForm)}
            style={[buttonStyles.base, buttonStyles.primary]}
          >
            <Text style={[buttonStyles.text, buttonStyles.textLarge]}>
              Se connecter
            </Text>
          </TouchableOpacity>

          <View style={authStyles.linkContainer}>
            <Text style={authStyles.linkText}>Pas encore de compte ?</Text>
            <Link href="/signup">
              <Text style={authStyles.link}>S'inscrire</Text>
            </Link>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
