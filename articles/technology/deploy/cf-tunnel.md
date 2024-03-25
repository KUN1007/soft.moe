# 如何将网站部署到 Cloudflare Tunnel

## 背景需求

原因是我们开发的论坛 [KUN Visual Novel](https://kungal.com) 发生了一次测试服务器源 ip 泄漏，所以我们需要将网站使用 `Cloudflare Tunnel` 部署，以确保源 `ip` 的安全性

## 下线网站

由于涉及到迁移服务器 `ip`，所以网站下线维护是不可避免的，这里可以参考

[如何临时下线一个网站](/technology/deploy/down)

## 开启 Cloudflare Zero Trust

要使用 `Cloudflare` 的 `Tunnel` 服务，必须要使用 `Zero Trust`，我们直接进入这个页面即可

需要填写必要的信息，我们选择最基础的免费服务即可
