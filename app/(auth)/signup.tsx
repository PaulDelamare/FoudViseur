import * as React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { authStyles, inputStyles, buttonStyles, cardStyles } from "../../styles";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Controller,
  FieldValues,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { errorStyle } from "../../styles/global/theme";

const formSchema = z.object({
  email: z.string({ error: "Email requis" }).email("Format d'email invalide"),
  password: z
    .string({ error: "Mot de passe requis" })
    .min(8, "Mot de passe trop court"),
});

const formSchemaEmail = z.object({
  code: z
    .string({ error: "Code requis" })
    .min(6, "Code trop court")
    .max(6, "Code trop long"),
});

type FormValues = z.infer<typeof formSchema>;
type FormValuesEmail = z.infer<typeof formSchemaEmail>;

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [emailFocused, setEmailFocused] = React.useState(false);
  const [passwordFocused, setPasswordFocused] = React.useState(false);

  const onSignUpPress = async (emailAddress: string, password: string) => {
    if (!isLoaded) return;

    try {
      await signUp.create({
        emailAddress,
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      setPendingVerification(true);
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const onVerifyPress = async (code: string) => {
    if (!isLoaded) return;

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace("/");
      } else {
        console.error(JSON.stringify(signUpAttempt, null, 2));
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

  const {
    control: controlEmail,
    handleSubmit: handleSubmitEmail,
    formState: { errors: errorsEmail },
  } = useForm<FormValuesEmail>({ resolver: zodResolver(formSchemaEmail) });

  const processForm: SubmitHandler<FieldValues> = (data) => {

    onSignUpPress(data.email, data.password);
  };

  const processFormEmail: SubmitHandler<FieldValues> = (data) => {

    onVerifyPress(data.code);
  };

  if (pendingVerification) {
    return (
      <View style={authStyles.container}>
        <View style={[cardStyles.base, cardStyles.large]}>
          <View style={authStyles.verificationContainer}>
            <Text style={authStyles.verificationTitle}>
              Vérifiez votre email
            </Text>

            <View style={inputStyles.container}>
              <Controller
                name="code"
                control={controlEmail}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    autoCapitalize="none"
                    value={value}
                    placeholder="Code de vérification"
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
              {errorsEmail.code && (
                <Text style={errorStyle}>{errorsEmail.code.message}</Text>
              )}
            </View>
            <TouchableOpacity
              onPress={handleSubmitEmail(processFormEmail)}
              style={[buttonStyles.base, buttonStyles.primary]}
            >
              <Text style={[buttonStyles.text, buttonStyles.textLarge]}>
                Vérifier
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={authStyles.container}>
      <View style={[cardStyles.base, cardStyles.large]}>
        <Text style={authStyles.title}>Inscription</Text>

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
            S'inscrire
          </Text>
        </TouchableOpacity>

        <View style={authStyles.linkContainer}>
          <Text style={authStyles.linkText}>Déjà un compte ?</Text>
          <Link href="/login">
            <Text style={authStyles.link}>Se connecter</Text>
          </Link>
        </View>
      </View>
    </View>
  );
}
