const { getDefaultConfig } = require('@expo/metro-config');
const path = require('path');

module.exports = (() => {
    const config = getDefaultConfig(__dirname);
    
    config.resolver.sourceExts.push('cjs', 'mjs');
    
    // Configuration pour les alias/chemins absolus
    config.resolver.alias = {
        'components': path.resolve(__dirname, 'components'),
        'services': path.resolve(__dirname, 'services'),
        'hooks': path.resolve(__dirname, 'hooks'),
        'styles': path.resolve(__dirname, 'styles'),
        'types': path.resolve(__dirname, 'types'),
        'contexts': path.resolve(__dirname, 'contexts'),
        'assets': path.resolve(__dirname, 'assets'),
    };
    
    return config;
})();
