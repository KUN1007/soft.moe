# 更改 GitHub 邮箱后贡献消失

## 描述

今天碰到个尴尬的事，在我把 `GitHub` 里好久没用的老邮箱删掉后发现个人主页贡献全没了

## 分析

`GitHub` 官方文档要求使用 `Git` 提交时用的邮箱必须与 `GitHub` 个人邮箱相同才会显示贡献

## 解决

首先检查机器环境，查看 git 当前的用户邮箱是什么，如果和 `GitHub` 邮箱账户不一样的话就改一下

这样改

```shell
git config --global user.email kun@kungal.com
```

clone 你所有的项目（用原来邮箱提交写的项目）

然后在每个项目文件夹中执行下面的 git 命令

```shell
git filter-branch --env-filter '
OLD_EMAIL="Your old email"
CORRECT_NAME="Your GitHub username"
CORRECT_EMAIL="Your new email"
if [ "$GIT_COMMITTER_EMAIL" = "$OLD_EMAIL" ]
then
    export GIT_COMMITTER_NAME="$CORRECT_NAME"
    export GIT_COMMITTER_EMAIL="$CORRECT_EMAIL"
fi
if [ "$GIT_AUTHOR_EMAIL" = "$OLD_EMAIL" ]
then
    export GIT_AUTHOR_NAME="$CORRECT_NAME"
    export GIT_AUTHOR_EMAIL="$CORRECT_EMAIL"
fi
' --tag-name-filter cat -- --branches --tags
```

然后强制提交就好了

```shell
git push origin --force --all
```

## 报错

```text
warning: unable to access 'node_modules/.pnpm/@wangeditor+upload-image-module@1.0.2_@uppy+core@2.3.4_@uppy+xhr-upload@2.1.3_@wangeditor+bas_nfqjztvpwcpyaamwjs4an2xg3a/node_modules/@wangeditor/upload-image-module/dist/upload-image-module/src/utils/.gitattributes': Filename too long
Enumerating objects: 21146, done.
Counting objects: 100% (21146/21146), done.
Delta compression using up to 16 threads
Compressing objects: 100% (12226/12226), done.
Writing objects: 100% (21146/21146), 81.17 MiB | 197.42 MiB/s, done.
Total 21146 (delta 8197), reused 18972 (delta 7120), pack-reused 0
error: RPC failed; curl 92 HTTP/2 stream 5 was not closed cleanly before end of the underlying stream
send-pack: unexpected disconnect while reading sideband packet
fatal: the remote end hung up unexpectedly
Everything up-to-date
```

这貌似是文件名过长了，输这个就解决了

```shell
git config --system core.longpaths true
```

