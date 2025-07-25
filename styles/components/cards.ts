import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, typography, shadows } from '../global/theme';

export const cardStyles = StyleSheet.create({
  base: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.medium,
  },
  large: {
    padding: spacing.xl,
  },
  marginBottom: {
    marginBottom: spacing.lg,
  },
});
