import { StyleSheet } from 'react-native';

export const colors = {
    primary: '#3498db',
    secondary: '#2c3e50',
    success: '#27ae60',
    danger: '#e74c3c',
    warning: '#f39c12',
    background: '#f8f9fa',
    surface: '#ffffff',
    text: '#2c3e50',
    textLight: '#7f8c8d',
    border: '#e1e5e9',
    borderFocused: '#3498db',
    inputBackground: '#fafbfc',
    shadow: '#000000',
};

export const spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
};

export const borderRadius = {
    sm: 8,
    md: 12,
    lg: 16,
};

export const typography = {
    title: {
        fontSize: 28,
        fontWeight: '700' as const,
    },
    subtitle: {
        fontSize: 24,
        fontWeight: '600' as const,
    },
    body: {
        fontSize: 16,
        fontWeight: '400' as const,
    },
    bodyMedium: {
        fontSize: 16,
        fontWeight: '600' as const,
    },
    large: {
        fontSize: 20,
        fontWeight: '600' as const,
    },
    button: {
        fontSize: 18,
        fontWeight: '600' as const,
    },
};

export const shadows = {
    small: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    medium: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
    },
    large: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 6,
    },
};

export const errorStyle = {
    color: colors.danger,
    fontSize: 14,
    marginTop: spacing.xs,
};