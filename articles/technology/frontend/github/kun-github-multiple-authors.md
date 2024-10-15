# 如何在 Git 提交时创建一个有多个作者的提交

## 目的

![](https://cdn.jsdelivr.net/gh/kun-moe/kun-image@main/blog/202410150503267.png)

官方文档: https://docs.github.com/en/pull-requests/committing-changes-to-your-project/creating-and-editing-commits/creating-a-commit-with-multiple-authors

## 步骤

add all files

``` shell
~ git add .
```

commit

``` shell
~ git commit -m "chore: add workflow typecheck
> 
> Co-authored-by: asukaminato0721 <i@asukaminato.eu.org>"
```

这里尤其要注意, `Co-authored-by` 左右不能有多余的空格, 否则会失效变成这样

![](https://cdn.jsdelivr.net/gh/kun-moe/kun-image@main/blog/202410150506405.png)

最后 push 一下

``` shell
~ git push origin master
```

## 感谢凑妈的指导

感谢我的好朋友[凑妈](https://asukaminato.eu.org/)的指导

肯定还有不对或者尚待改进的地方，欢迎联系我指出我的错误，大家的每一次纠错都是对我的最大帮助，谢谢
