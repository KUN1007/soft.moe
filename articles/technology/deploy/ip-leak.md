# 网站源站 ip 泄漏怎么办

## 背景需求

我们开发的论坛 [KUN Visual Novel](https://kungal.com) 面临了一次源站 ip 泄漏

原因是我们在使用测试服务器的时候，并未使用 `Cloudflare` 的免费 CDN 掩护，直接将服务器 `ip` 绑定在了域名上

其实在这个时候，某些网站已经将我们的源 ip 记录了下来，在网上可以轻易的检索到

## 源 ip 泄漏的后果

目前能想到的后果就是一攻击必宕机，因为我们只使用了普通的小鸡，没有高防

因此，只要一攻击源 ip，想都不用想，网站必宕机

其实我们早就知道源 ip 泄露了，但是一直没有理会这个问题，因为我们是开源项目，并且分文不收，所以不太可能有人来攻击我们

当然，肯定会有好奇宝宝想试试网站硬不硬，这时候就麻烦了，例如我们刚上线测试的时候就挨过好奇宝宝的 DDoS

## 解决方案

解决方案当然是先更换 ip 了，简单粗暴

首先将服务器停机，更换 ip，然后启动服务器，挂上 `Cloudflare` 的免费 CDN

这样子做就可以了吗？当然不是

对于整个互联网来说，每天都会有人使用大量的人使用服务器**扫描整个公网的 IPV4 地址**

这个后果很直白，只要有人想找到，必然可以找到网站的源 ip

怎么办呢，答案是 `Cloudflare Tunnel`

### 将网站部署到 `Cloudflare Tunnel`

`Cloudflare Tunnel` 可以直接在 `Cloudflare` 和网站的服务器之间建立 `Tunnel`，实现网站服务

这意味着，即使没有公网 `ip`，也能借助 `Cloudflare Tunnel` 实现内网穿透，部署网站

部署过程可以查看 [如何将网站部署到 Cloudflare Tunnel](/technology/deploy/cf-tunnel)

### 更换服务器 SSH 连接的 rsa key

受到我的朋友 [Rikka](https://github.com/hash070) 的指导，他告诉我，即使是更换了服务器源 `ip`，没有更换连接服务器的 rsa key，也有人可以顺着原来的 `rsa public key` 找到服务器的源 ip

（这点我还没有弄懂为什么会泄漏，欢迎指点）

这个时候，重新生成一个 `rsa key`，并将其应用到服务器的 SSH 连接上即可

### 更换 SSH 连接的端口

前面提到了，总会有一些人每天会拿着服务器扫描全网的 IPV4 地址，这意味着，常见的端口显然是需要更改的

比如 SSH 常用的端口 22，最好也更换一下

虽然说是扫描，但是扫描端口也是有代价的，不可能扫描到所有的端口，只可能扫描到部分常用的端口，例如 `22`, `80`, `1080` 这些常见的端口

我们将端口由 `22` 改为 `233`，不是就很好的避免了这个问题了吗，下一次连接的时候，只需要加上 `-p` 参数就可以了
