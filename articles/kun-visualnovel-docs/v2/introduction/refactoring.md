# 为什么要重构 Vue3 的项目

其实，这已经是第二次重构了

第一次是将纯 HTML 变为 Vue3 项目

本次重构会将原本 Vue3 + Koa 的项目改写为 Nuxt3 的项目，本次重构之后访问 kungal.com 将会默认访问重构项目，原来的项目将会被部署在 v1.kungal.com 上

重构目前来讲只有一个目的，让论坛更好

> 具体有哪里好了？

对我们使用 Nuxt3 来重构 Vue3 项目来讲，有这些好处

## SEO

SEO 是一个网站性能评估的重要指标之一，大部分的网站流量来源也主要是这里，要想把网站做大，给更多人发现，SEO 是必不可少的

### Preview 窗口看不到渲染出的页面

对于原生 Vue 来说，SEO 的支持显然是不够到位的，CSR 会导致我在开发者工具的 Network -> Preview 窗口完全看不到网站的页面。

虽然，仅对于这一点来说，对现代搜索引擎（例如 Google）的 SEO 的影响可能不是那么大，但是某些旧时代搜索引擎依然难以处理由 Javascript 生成的内容

原本的项目是完全依赖于 Javascript 渲染的，仍然可能存在一些抓取和索引的问题

为了保持对这些引擎的兼容，以及最佳的渲染效果，我们采用了 Nuxt3 的 SSR 做法

### Nuxt SEO

Nuxt 作为一个建立在 Vue 之上的全栈框架，有着极佳的 SSR 支持，以及目前最先进的 SEO 设计之一

它的 SEO 可以覆盖到搜索引擎爬取的预览页面，Youtube 的分享界面乃至 Twitter 的 Card，还有页面的 PageMeta 等等多种 SEO 手段

可以说，将项目重构完，这个论坛项目的 SEO 又会吊打一众模板网站了

> 为什么不用 Nextjs？

我们原本的项目是基于 Vue3 的，迁移到 Nuxt3 的重构代价不大（但是也绝对不小），如果迁移到 Nextjs，就需要真正的把项目完全重构了，代价过大

而且，Nuxt 和 Next 这些框架的性能相对而言都是差不多的，这么方便那为什么不用呢

## 首屏加载时间

对于一个论坛来说，我想让用户更快的访问页面是有极大必要的

### 性能测试

原本的 Vue3 项目，性能其实已经足够好了，我们担保它的性能可以吊打众多模板资源站，不信的话可以打开 F12 的 lighthouse 测试一下

其实，我们原本的网站已经把下面的网站性能测评网站全部测试了一遍

[Google PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/)

[Gtmetrix](https://gtmetrix.com/)

[WebPageTest](https://www.webpagetest.org/)

[Pingdom Website Speed Test](https://tools.pingdom.com/)

[YSlow](http://yslow.org/)

[Dareboost](https://www.dareboost.com/)

测试的结果无一例外都是极为优秀

### 测试问题

上面的测试存在一些问题

我们原来的项目，只是在加载的时候放上了 loading 的加载动画，这导致 lighthouse 误认为这就是网站渲染完成的内容，错误的计算了首屏加载时间

我们原来项目的性能，lighthouse 的真正测试，如果移除 loading 动画，第一项性能分只有 56 分左右，这大部分是由于首屏加载和索引时间导致的

所以原来的项目让我们有一种欺骗了测试网站作假的感觉，这次，不一样了，这次是实打实的性能，没有任何虚假

## 路由未开放，重构后完全开放

我们原本的 Vue3 论坛设计为了一个只有登陆才能查看的封闭访问机制

这显然是可以带来一些好处的，例如访问速度，隐私等等

但是，我们的主张是没有门槛。登陆才能看到内容这种事，不符合我们的风格

由于只有登陆才能看到我们网站的内容页面，所以众多性能测试网站（除了 lighthouse）都被重定向到了登陆界面，虽然这也可以反映一定的问题，但是这个性能测试远远不够的，因为它仅测试了登陆界面的性能

原来的网站路由会保持不变，我们要将原来的项目永远保存作为历史记忆

重构之后我们会将论坛全部开放，无需登陆即可访问除了用户个人界面以外的所有内容，这样的网站性能测试，我们认为，所有人都应该信服，这是毫无虚假的

