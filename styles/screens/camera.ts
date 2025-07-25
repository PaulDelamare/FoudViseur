import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, typography } from '../global/theme';

export const cameraStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    camera: {
        flex: 1,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scanArea: {
        width: 300,
        height: 180,
        borderWidth: 2,
        borderColor: colors.primary,
        borderRadius: borderRadius.lg,
        backgroundColor: 'transparent',
    },
    instructionsContainer: {
        position: 'absolute',
        bottom: 200,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    instructionText: {
        ...typography.large,
        color: colors.surface,
        textAlign: 'center',
        marginTop: spacing.lg,
        paddingHorizontal: spacing.lg,
    },
    processingText: {
        ...typography.bodyMedium,
        color: colors.surface,
        textAlign: 'center',
        marginTop: spacing.sm,
    },
    permissionText: {
        ...typography.large,
        color: colors.text,
        textAlign: 'center',
        marginBottom: spacing.lg,
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 50,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    finishButton: {
        backgroundColor: colors.primary,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.md,
    },
    finishButtonText: {
        color: colors.surface,
        ...typography.bodyMedium,
        fontWeight: '600',
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: spacing.md,
        backgroundColor: colors.surface + 'CC',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.md,
    },
    backButtonText: {
        color: colors.text,
        ...typography.bodyMedium,
    }, resultContainer: {
        position: 'absolute',
        bottom: 50,
        left: spacing.md,
        right: spacing.md,
        backgroundColor: colors.surface,
        padding: spacing.md,
        borderRadius: borderRadius.lg,
    },
    resultText: {
        ...typography.bodyMedium,
        color: colors.text,
        textAlign: 'center',
        marginBottom: spacing.sm,
    },
});
