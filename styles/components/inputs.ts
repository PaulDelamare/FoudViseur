import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, typography, shadows } from '../global/theme';

export const inputStyles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md - 2,
    backgroundColor: colors.inputBackground,
    color: colors.text,
    ...typography.body,
  },
  inputFocused: {
    borderColor: colors.borderFocused,
    backgroundColor: colors.surface,
    ...shadows.small,
  },
});
