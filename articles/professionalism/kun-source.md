# 在遇到自己完全不会的技术栈时应该如何做?

## 背景

~~昨天我想把今年的第一次 commit 献给大红螃蟹~~, 于是打算用 `teloxide` 写一个 Telegram bot

我一点也不会 teloxide，并且几乎不会 Rust

于是我找到了我的好朋友 [yurzhang](https://yurzhang.com) 聊天的过程中，我突然好奇，其他人在遇到自己完全不会的技术栈时，应该如何做呢

出现这个疑问的原因，是因为我总是怀疑自己是错误的，自己的解决方案不是最 elegant 的

## 必要性

我联想到，在实际项目中，人们不可能一开始就把所有的技术栈全部弄透，这显然是 ridiculous 的

但是，我们往往接触到超过自己已学知识的任务，这个时候有良好的查找资料和自学的能力是非常有必要的

## 方法论

首先，碰到一个新的项目时，应该如何做

举例刚才使用 teloxide 写 bot 的例子

### BFS

我的好朋友 [Haruki](https://i.plr.moe) 说过，在碰到问题时首先会尝试 BFS，找到各种有价值的信息，然后在 BFS 的基础上 DFS，发现和这个问题相关的本质原理

对于我来说，当前的 BFS 这一步可以使用 AI 来解决，可以使用带有 Searching 和 Browsing 的 auxiliary AI 来找到广大的资源和解决方案

例如，我们尝试向 Perplexity AI 提问，prompt 大致为

> Tell me some modern tech-stacks and toolchains for rust telegram bot

稍加拓展

> Are there any alternative tech-stacks for xxxxx

再来一点稍微人性化的提示

> A person who prefers simplicity / versatility / ... would choose what technology stack?

等等

经过上面一系列的筛选，最终我们会的得到一个最符合我们项目实际情况的，可靠的选择

这是因为我们已经掌握了目前大部分的常见技术栈，并在这些备择方案中选出了适合我们实际情况的方案

### Official Tutorial

官方文档是最好的入门教程，我原来一直怀疑我是错误的，因为我认识的很多朋友都喜欢看视频学习

但是我发现了一个问题，对于简中环境乃至 ytb 上 common 一点的教程，太过 trivial，废话太多讲的太慢

如果说真的对这个技术栈相关的方面一点都不了解，看官方文档绝对会非常费力，假设现在让我去学 MMA 之类一点不懂的方面，估计我会升天 hhh

但是一旦在某个方面入了门，那么学其它的知识绝对会异常轻松，比如我在有 Nuxt3 基础的情况下，可以在 5 天大致的学一遍 [svelte & sveltekit 的 tutorial](https://learn.svelte.dev/tutorial/)，并且搭一个[网站](https://sticker.kungal.com)出来，然后写一篇[万字的总结](https://soft.moe/technology/frontend/svelte/kun-svelte.html)

官网的教程，非常的准确 intuitive，但是看的时候可能会理解不到位，需要动手操作学习

我的好朋友 yur 说看官方文档的重点就行，感觉项目用得到的就看一下，用不到的就先扔在一边

我觉得他说的非常有道理！因为在看一遍文档就把所有内容都理解！我不是那样的 genius！

在看完文档的 Readme 之后，应该就可以得到一个最 mini 的可以 run 的 program

然后就可以开始看文档了！文档看不懂怎么办？当然是接着往下看啦

### GitHub

gayhub 不愧是世界最大男性交友平台，好东东真不少，但是找到这些好东东需要费点劲

举例，刚才的 teloxide 项目，如果需要一个好的参考项目，应该如何做

这个 demands 显然是 necessary 的，因为一个好的 reference 可以使人少走几倍的弯路（很重要！看烂项目会毁了一个人！）

对于 GitHub 来说，良莠不齐，因为每个人都有每个人的写法，适应情况和个人偏好都是 deference 的

对于其它人来说 works 的项目，自己不一定 works，其它项目的 elegant 也不意味着在自己的项目里也是 elegant 的，这需要强大的 accumulate 和 try

对于 GitHub 来说，它的搜索框有一些神奇的功能，对于 repositories，可以看 [Searching for repositories](https://docs.github.com/en/enterprise-server@3.11/search-github/searching-on-github/searching-for-repositories)

实际情况来讲，在寻找一个 modern proj，比如现在的 teloxide，可以这么搜索

> teloxide stars:>3

然后 Sort by Recently updated，就会神奇的发现！项目代码变的 Modern 了！并且不算太 toy，因为毕竟有几个 star

接着对这些项目进行观摩，取千家之长，即可得到一个不算太 trash 的 proj

### 好的项目如何辨别

其实有一个不算常理的常理，大多数文档和 Readme 是中文写的，而且 star 较少的，一般质量都不会太好，所以小项目看到简中直接略过就好

除此之外，需要注意项目的 update time，之前我们 Sort by Update time 也是这个原因，一个 last updated 显示 5 years 以上的项目我就已经不想看了

再者，需要注意项目的 issues。一个项目，看着其他地方都对，但是 issues 只有几个甚至没有，这种也需要斟酌，因为可能经不起复杂环境的考验，灵车的概率很大

对于 issues 来讲，看着很多的但是 solved 的很少，大多数都是 TODOs 的项目，也要提防

（最后，上面的经验都是让我长过记性吃过亏的）

## Pull request

其实我一直担心我 commit 的都是我自己的项目，实际上自己依然是 newbie 走不出去，因为我没有 pr 过别人的项目，解释不了自己的 level

对于我的好朋友 yur 来说，提 pr 是因为这个项目的 feature cover 不了它的 demands

要想提一个合理的 pr，估计需要看看这个项目的 issues，然后选一些自己可以 hold 住的解决。~~但是，我感觉没人愿意看 issues~~

## 总结

经过一些思考，我明确了我的学习思考方向是正确的，这使得我心里更加踏实了！我非常感谢我的朋友 yurzhang！

不过，我也依旧在怀疑我自己的正确性，如果有更好的思维和建议，或者其它想要表述的方法，欢迎评论！当然，右上角联系我也可以
