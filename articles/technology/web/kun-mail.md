# 如何给一个网站接入邮箱验证码服务

## 防火墙

成功的最后一步是请求被防火墙拦住了

于是。。。干掉它吧

```bash
sudo iptables -D ufw-user-output -p tcp --dport 25 -j DROP
sudo iptables -D ufw-user-output -p udp --dport 25 -j DROP
```

天那。。终于把邮件发出去了！！！太不容易了！！！

前面的忘了写了，以后有时间补上