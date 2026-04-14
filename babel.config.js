module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [], // 깨끗하게 비우거나, plugins 줄 자체를 지워도 됩니다.
  };
};