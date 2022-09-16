const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})
module.exports = {
  outputDir: '../static',
  indexPath: '../templates/index.html',
  assetsDir: 'static/'
}