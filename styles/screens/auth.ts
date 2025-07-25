import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../global/theme';

export const authStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
    justifyContent: 'center',
  },
  title: {
    ...typography.title,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  linkText: {
    color: colors.textLight,
    ...typography.body,
  },
  link: {
    color: colors.primary,
    ...typography.bodyMedium,
  },
  verificationContainer: {
    alignItems: 'center',
    gap: spacing.lg,
  },
  verificationTitle: {
    ...typography.subtitle,
    color: colors.secondary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
});
