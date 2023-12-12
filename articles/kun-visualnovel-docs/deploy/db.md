# 数据库和缓存的部署和配置（生产环境）

生产环境我们使用了常见的 `Ubuntu`，所以只需要 Google 一下 `How to install mongodb / redis on ubuntu` 就可以了

装好之后可以试着运行以下 `mongosh` 之类的命令看看有无输出，默认情况下 `mongodb` 和 `redis` 都是没有密码的

装好之后应该是和开发环境（假设使用了 Windows / MAC / Archlinux etc...）的行为是相似的，到目前为止我还没有碰到预料之外的行为

`Mongodb` 是没有大小写的要求的，和 `MySQL` 在生产环境下区分大小写是不一样的

`Mongodb` 会自动把集合的名字变为复数，但是不用担心查询，这都是自动的
