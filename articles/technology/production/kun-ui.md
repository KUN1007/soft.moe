# 对于一次网站 UI 更新的认识



## 描述

关于我写的论坛 [KUN Visual Novel (鲲 Galgame)](https://github.com/KUN1007/kun-galgame-vue)，今天我的好朋友 [Asuka-san](https://asukaminato.eu.org/) 和 [Haruki-san](https://i.plr.moe)，发现了几处不合理的地方，这里作以记录。



我的朋友 Asuka-san 推荐了我一本好书 [Don't Make Me Think (不要让我思考)](https://www.amazon.com/Dont-Make-Think-Revisited-Usability/dp/0321965515) , 这是一本关于 Web 设计方面的书籍，有部分观点很有道理，这里一并说明。



## 有哪些地方是不合理的



### 1. 提示组件的背景颜色较浅

发生这个问题的原因是我应该使用 `--kungalgame-trans-white-2` 的，可是我用了 `--kungalgame-trans-white-5`, 这里属于忘记改了

这里原来的设计是根据 Galgame 对话框的设计来设计文字的阴影，但是 Galgame 的 UI 一般是有背景色的，所以如果文字是白色，并且使用黑色阴影不会看起来很累。

这里由于我的配色 `--kungalgame-trans-white-5` 是半透明的白色 `#ffffff8e`, 于是看起来视觉效果会不好。

现在已经改为  `--kungalgame-trans-white-2` 了, 配合 `backgound-filter: blur(5px);` 观感已经较为不错了。



### 2. Markdown 代码块背景是白色

这里是考虑到美观的问题，因为设计是半透明，并且暖色调，所以深色背景代码块很不好看。

这里设定为白色，不做更改



### 3. 主页总容器 border 颜色过浅

问题描述是 `找不到边界`

经过我的测试，将 border 颜色加深确实会变得更好看直观，将 `--kungalgame-blue-0` 改为 `--kungalgame-blue-4`



### 4. 话题详情界面，回复话题底部的分割线不够明显

出现这个问题的原因是我忘了加了。。。现在已经加上了



### 5. 主页左侧的发布话题按钮过于突兀

问题的描述是 `Confusion Button`

问题的原因是，这一块地方没有东东放了，之后加新功能会更改

初步构思应该是把这个区域重构为竖直分布弹性盒，取消 `grid` 布局



### 6. 页面过挤

这个问题很早就有人说过了，这次又被提出来了

解决方案是将主页单个话题的 `margin` 和 `padding` 都更改 5px -> 7px, 并将左侧 `Aside` 与右侧 `Article` 的距离更改 5px -> 7px

-----

pref: 我发现主页文章背景色是蓝色 (`--kungalgame-trans-blue-0`)，导致所有的话题区分都不是很明显

解决方案是将文章区域背景色取消，然后将单个话题的颜色设置为 `--kungalgame-trans-blue-0`, 我认为这样的视觉效果是值得肯定的



### 7. 配色不好？

配色从 github 搬过来的，哪有不好的说法，反正我觉得很好



### 8. 页面宽度问题

出现这个问题的原因是网站的页面宽度采用的是纯百分比布局

这个问题的常规做法是使用 `vw` 或者 `% + em`, 设计之初我也有考虑过这个做法

但是问题在于有用户偏好宽屏布局 (刚开始做论坛的时候就被指出了)，有用户又偏好黄金比宽度，并且屏幕宽度 1080p, 2k, 4k 之间均有较大的区别，网站采用横向 `工` 字布局，所以限制网站的 `max-width` 是一件不现实的事，所以我们无法使用

* 使用 `vw` 自适应布局
* 使用 `% + em` 获得更好的体验，自适应宽度

发生问题的原因是无论如何设置，都避免不了屏幕宽度的差异问题，1080p 屏幕能看的内容，到 4K 屏幕宽度必定不可能自适应，一定要加限制，部分用户要求 4K 也要全屏，emmm。。。。

于是我设计了调整屏幕宽度的设置，DIY 吧！我们不一样！

-----

BTW，高度必须要固定，不然背景必定出问题

（不是阿 sir，半透明 + 自定义背景图 + 自适应 + 手写 UI 的论坛，这孩子真尽力了，不管审美再怎么好，***换个背景图，那艺术再见***）



### 9. 话题界面推话题的按钮可能造成歧义

这个很久之前有人反映的，原因是我当时还没有写 `Tooltip` 组件，现在有 `Tooltip` 了，加上 `Tooltip` 就能完美解决了



## 关于 `Dont Make Me Think`

花了几分钟浏览了一下，大概讲了这么几件事

* 直观。用户用网站就行了，网站的设计不能让用户思考（困惑），用户的思考只会让用户流失，大概有这么几点吧
  * 显眼。某些内容用户只是浏览而已，而不是阅读
  * 原型、导航、面包屑、配色、测试·····这些东东看的一些别的书都讲过了
* 可用性。任何东东功能是首要，我要能用。
* 简单。

当然，前提是这是一个商业网站，以盈利为目标。



## 其它的某些东东

作为半个产品经理和半个管理者，我深知 `需求` 和 `原型` 的重要性，并且我们需要的是决策和备选方案



这个东东感觉站在管理学的角度可以看看，貌似可以这么分析



> 当老板、产品、设计、程序吵起来的时候，作为一名管理者，您应该如何决策呢？



这个答案留给你吧，毕竟你都看到这里了 hhh