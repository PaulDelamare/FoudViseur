import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../global/theme';

export const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  welcomeText: {
    ...typography.bodyMedium,
    color: colors.secondary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  linkContainer: {
    flexDirection: 'column',
    gap: spacing.md,
    alignItems: 'center',
  },
});
