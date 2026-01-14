module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Reanimated должен быть последним
      'react-native-reanimated/plugin',
    ],
  };
};
