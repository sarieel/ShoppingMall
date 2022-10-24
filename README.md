# shoppingmall

技术栈：vue3、vuex、vue-router、axios、mock、swiper

## 项目介绍
- 关于登录模块
  - 根据 localStorage 中的 token 值判断用户登录状态
  - 使用全局路由守卫 router.beforeEach() 实现未登录状态无法进入订单页的效果
- 关于三级导航组件
  - 进行节流处理，每 50 毫秒切换一次二级导航页面，优化性能
  - 添加移出移入的动画效果
