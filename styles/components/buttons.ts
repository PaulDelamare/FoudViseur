import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, typography, shadows } from '../global/theme';

export const buttonStyles = StyleSheet.create({
    base: {
        borderRadius: borderRadius.md,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        alignItems: 'center',
        justifyContent: 'center',
        ...shadows.small,
    },
    primary: {
        backgroundColor: colors.primary,
    },
    danger: {
        backgroundColor: colors.danger,
    },
    large: {
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.md + 2,
        minWidth: 120,
    },
    text: {
        color: colors.surface,
        ...typography.bodyMedium,
        textAlign: 'center',
    },
    textLarge: {
        ...typography.button,
    },
    logout: { color: "red", textAlign: "center", fontWeight: "500" }
});
