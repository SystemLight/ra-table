module.exports = function (api) {
  api.assertVersion('^7.15')
  api.cache(true)

  let corejs = {
    version: 3,
    proposals: true
  }

  /**
   * 配置项：https://babel.docschina.org/docs/en/options/
   *
   * 先执行完所有 Plugin，再执行 Preset。
   * 多个 Plugin，按照声明次序顺序执行。
   * 多个 Preset，按照声明次序逆序执行。
   */
  return {
    comments: true,
    presets: [
      [
        '@babel/env',
        {
          debug: false,
          modules: false,
          useBuiltIns: 'usage',
          ignoreBrowserslistConfig: false,
          corejs: corejs
        }
      ],
      '@babel/react'
    ],
    plugins: [
      [
        '@babel/plugin-transform-runtime',
        {
          corejs: corejs
        }
      ]
    ]
  }
}
