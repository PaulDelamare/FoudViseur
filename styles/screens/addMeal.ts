import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, typography, shadows } from '../global/theme';

export const addMealStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
  },
  header: {
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.title,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  searchSection: {
    marginBottom: spacing.lg,
  },
  searchContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  searchInput: {
    flex: 1,
  },
  scanButton: {
    backgroundColor: colors.warning,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    minWidth: 60,
  },
  scanButtonText: {
    color: colors.surface,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  resultsContainer: {
    flex: 1,
    marginBottom: spacing.md,
  },
  resultItem: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: borderRadius.md,
    ...shadows.small,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultInfo: {
    flex: 1,
  },
  resultName: {
    ...typography.bodyMedium,
    color: colors.text,
    marginBottom: 4,
  },
  resultBrand: {
    ...typography.body,
    color: colors.textLight,
    fontSize: 14,
  },
  resultCalories: {
    ...typography.body,
    color: colors.primary,
    fontSize: 14,
    marginTop: 2,
  },
  addButton: {
    backgroundColor: colors.success,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  addButtonText: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: '600',
  },
  selectedMealsContainer: {
    marginBottom: spacing.md,
  },
  selectedMealsTitle: {
    ...typography.subtitle,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  selectedMealItem: {
    backgroundColor: colors.primary + '10',
    padding: spacing.sm,
    marginBottom: spacing.xs,
    borderRadius: borderRadius.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedMealText: {
    ...typography.body,
    color: colors.text,
  },
  removeButton: {
    backgroundColor: colors.danger,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  removeButtonText: {
    color: colors.surface,
    fontSize: 12,
    fontWeight: '600',
  },
  validateButton: {
    backgroundColor: colors.success,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    ...shadows.medium,
  },
  validateButtonText: {
    color: colors.surface,
    ...typography.button,
  },
  loadingText: {
    textAlign: 'center',
    color: colors.textLight,
    ...typography.body,
    marginTop: spacing.md,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.textLight,
    ...typography.body,
    marginTop: spacing.lg,
  },
  autocompleteContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    ...shadows.medium,
    maxHeight: 200,
    zIndex: 1000,
  },
  autocompleteItem: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md, // Plus d'espace vertical pour faciliter le clic
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
    minHeight: 44, // Hauteur minimum pour faciliter le clic
  },
  autocompleteItemPressed: {
    backgroundColor: colors.primary + '10', // Effet visuel au clic
  },
  autocompleteText: {
    ...typography.body,
    color: colors.text,
  },
  searchInputContainer: {
    position: 'relative',
  },
});
