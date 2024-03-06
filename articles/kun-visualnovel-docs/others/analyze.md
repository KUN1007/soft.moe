# 分析、构思、设计

在决策之前首先我们要根据我们的目标，结合我们的实际情况进行分析，以便写出合理的实现方案

我们可以从以下几个角度考虑一个 Galgame 论坛的实现

## 资金

考虑到我们没有任何收费行为，故而收支均衡只能靠赞助解决，没有赞助的话只能自掏腰包了

我们想保持管理的透明化，所以我们设计了一个收支公示页面，以 USDT 结算

这个公示页面会涵盖我们所有的收入和支出，收入来自于赞助，亏损来源于服务器

它以权责发生制计算资金额，并写明时间和原因，实现透明化

## 团队

任何一个项目，团队的分工协作是少不了的

在项目开始之前，需要考虑到团队的成员构成，以及之后的发展

我们团队的成员来自于各个国家，他们都很喜欢 Visual Novel 的体裁

## 设计

我们的设计原则是

* Simplicity and Clarity
* Visual Hierarchy
* Color Psychology
* Interactive Elements
* User-Centered Design (UCD)
* Don't Make Me Think Principle

这些设计思想由我们共同提出，并会在网站中得到体现

核心就是简单，直观，方便，不会给用户造成困惑

## 实现

建造师建设建筑物需要蓝图，同样我们的论坛建设也需要设计图

关于这个，站在产品经理的角度来讲，一般会有 PRD（产品需求文档）

这里我们没有编写正规的 PRD（~~因为懒，咕咕咕~~），我们使用了一些简单的思维导图做到了这点

[思维导图](https://github.com/KUN1007/kungalgame-pure-css/blob/main/foo/PRD/kungal.com-2.png)

于此同时，我们还有简单的思维文档，可以参考这些原则来做

[docx 文档](https://github.com/KUN1007/kungalgame-pure-css/blob/main/foo/kungalgame/about.docx)

但是这仅仅是一个导图，我们是实现步骤经历了下面几个阶段

### 根据思维导图画出草图

在此过程中我们使用了 Axure RP 9 作为原型设计软件

为什么不用 Figma？

偏好不同。原型设计领域 Axure 是非常可靠的软件

可以在这里看到我们的 Axure 源文件（草图）

[Axure 原型 forum.rp](https://github.com/KUN1007/kungalgame-pure-css/blob/main/foo/draft/forum.rp)

我们全部的草图都在这里

https://github.com/KUN1007/kungalgame-pure-css/tree/main/foo/draft

### 根据草图使用原生 HTML 和 CSS 画出网站

这个阶段的网站是不会动的，它是静态的网页

可以在下面查看我们的网站是如何一步步的调整、修改，直到变成今天这个样子的

[设计历史](https://github.com/KUN1007/kungalgame-pure-css/tree/main/foo/design-history)

### 根据原生 HTML 和 CSS 使用 Vue 框架重构网站前端

这个阶段是把静态的网站变成了动态的，用户点击网站可以发现网站可以点击了，会动了

这个阶段的仓库是 [kun-galgame-vue](https://github.com/KUN1007/kun-galgame-vue)

### 编写网站后端

我们的论坛在编写这个文档的时候，是前后端分离式的架构，在编写完前端之后，还需要编写后端

只有页面的网站是不行的，一个论坛还要保存数据，如何保存数据，保存完时候怎么取到数据，这就是后端

我们编写了网站的后端，这个阶段的仓库是 [kun-galgame-koa](https://github.com/KUN1007/kun-galgame-koa)

### 部署网站

开发完成后需要部署网站，才能让别人访问到网站

### 测试阶段

网站上线之后一定要测试 BUG，在我们编写这些文档的期间，网站就处于上线测试 BUG 的阶段

这个阶段我们发现了很多的问题还有不足，并进行了更正，现在的网站更加的现代化和工整了

### 维护

网站是需要人维护的，因此我们要开发一个后台管理系统

这个后台管理系统的仓库是 [kun-galgame-admin-next](http://github.com/KUN1007/kun-galgame-admin-next)

### 重构

作为一个论坛，浏览器要能搜索到才会有访问量，我们最初选用的前后端分离式架构实现这项工作较为困难

因此我们使用了更加顶层的框架 Nuxt 来重构我们的项目

这个阶段的仓库是 [kun-galgame-nuxt3](https://github.com/KUN1007/kun-galgame-nuxt3)

## 总结

可以看到，经过了一年的各种设计，我们团队总算将这个论坛打磨成型了，这是一件极为不容易的事！
