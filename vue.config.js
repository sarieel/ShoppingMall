const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  transpileDependencies: true,

  // 关闭语法检查
  lintOnSave: false,

  devServer: {
    proxy: {
      // 匹配所有以'/api'开头的请求路径
      "/api": {
        target: "http://gmall-h5-api.atguigu.cn",
        // 替换请求路径中的'/api'
        // pathRewrite: { "/api": "" },
      },
    },
  },
});
