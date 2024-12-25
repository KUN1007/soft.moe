# 使用 Cloudflare Workers 实现 B2 私有存储桶文件下载

## 介绍

Cloudflare 的 CDN 是免费的, Cloudflare 的 cache 也是免费的

并且我们知道, B2 的 Object Storage 是一种非常便宜实惠的存储方案, 几乎没有比它更加知名, 可靠性较高, S3 Compatible 的存储方案了。

但是它的缺点是请求次数是需要计费的, 公开的 bucket 很容易被人刷导致产生一笔巨额的存储费用

为了防止被刷 B2 请求次数, 我们可以利用 Cloudflare Workers 实现私有 B2 Bucket 的公开访问, 这样就可以避免被恶意刷取请求次数

Cloudflare Workers 有免费额度, 小规模使用是完全足够的, Pro 也仅需 5$ 费用

## 前提条件

需要一个 Cloudflare 账户和 Backblaze 账户

由于 Cloudflare 免费版的 Cache Limit Size 最大为 500MB, 所以我们要将缓存的文件控制在 500MB 以下

## 操作方式

### 创建一个 Worker

首先打开 Cloudflare Dashboard 的 `Workers & Pages`, 创建一个 Worker

### 获取 Backblaze 的各种密钥

在 Backblaze 的面板点击 `Application Keys`, 然后生成, 配置选用默认的即可

之后生成的各种密钥和 ID 都可以在这里查看, 需要注意的是 `applicationKey` 仅会展示一次

### 创建 Cloudflare API token

因为需要workers来修改规则，重写url，所以需要cloudflare API令牌。

在这里创建好令牌后保存, 这个令牌也仅显示一次

https://dash.cloudflare.com/profile/api-tokens

![](https://cdn.jsdelivr.net/gh/kun-moe/kun-image@main/blog/202412252047763.png)

### 获取域名的区域 ID

点击左边的 `Websites`, 点击要查看的域名, 进入域名的 `Overview` 这个页面

右侧的 `API` 部分下面有一个 `Zone ID`, 这就是我们需要的值

### CNAME 子域名到 Backblaze

配置应该像这样

![](https://cdn.jsdelivr.net/gh/kun-moe/kun-image@main/blog/202412252054638.png)

配置完之后会产生一个 `touchgal-patch.moyu.moe` 的子域名

### 重写 URL 路径

点击 Cloudflare 左侧的 `Rules`, 然后点击 `Transform Rules`, 选择 `Rewrite URL`, 点击 `Create Rule`

这个规则就是将所有 touchgal-image.moyu.moe/* 的请求，转换为 touchgal-image.moyu.moe/file/image/*

![](https://cdn.jsdelivr.net/gh/kun-moe/kun-image@main/blog/202412252115352.png)

编写完之后点击 `Deploy`

### 获取 Ruleset 的 ID 相关信息

返回 Cloudflare Dashboard 首页, 点击 `Manage Account`, 点击 `Audit Log` 即可查看到刚才的改动

点击查看 `Rulesets update` 里的 `New Value:`, 这里就是 CfRuleID

``` json
  "rule_ids": [
    "c35xxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "c72xxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "e85xxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
  ],
```

下面的 `Metadata:` 中的 `id` 字段就是 CfRulesetID

``` json
{
  "cf-ray": "xxxxxxxxxxxxxxxxxx-SEA",
  "id": "7d2xxxxxxxxxxxxxxxxxxxxxxxxxx",
  "kind": "zone",
  "phase": "http_request_transform",
  "zone_name": "moyu.moe"
}
```

::: note

这里有一个坑, Transform Rules 部署完之后有可能需要更改一下才能查到 ID, 如果出现这种情况随便重新编辑一下刚才创建好的 Rule 即可

:::note

### 填写 Worker Secret

点击 Worker & Pages 的 `Settings`, 选择 `Variables and Secrets`, 点击 `Add`, 添加上面代码中用到的各种配置项和密钥

这些参数用来确定 B2 Bucket 的 Region 以及鉴权

下面是一份示例的参数配置, 参数的来源都已在上面写清楚

``` text
// Backblaze 的 applicationKey
Secret    B2AppKey    K002xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

// Backblaze 的存储桶名
Secret    B2BucketName    touchgal

// Backblaze 的 keyID
Secret    B2KeyID    002xxxxxxxxxxxxxxxxx0000000000001

// 创建的 Cloudflare API 令牌
Secret    CfAuthKey    Xab21xxxxxxxxxxxxxxxxxxxxxxxxxxxx

// Cloudflare CNAME 的二级域名, 用于用户访问 Bucket
Secret    CfHostname    touchgal-patch.moyu.moe

// 规则 ID
Secret    CfRuleID    Value encrypted

// 规则集 ID
Secret    CfRulesetID    Value encrypted

// 域名的区域 ID
Secret    CfZoneID    f11xxxxxxxxxxxxxxxxxxxxxxxxxx

```

### 编写代码

然后点击 `Edit Code`, 将下面的代码写入

``` JavaScript
// 对 Worker 请求应用我们编写的函数
addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});
addEventListener("scheduled", (event) => {
  event.waitUntil(updateRule());
});

// 获取 Backblaze 的 token 以访问 Private Bucket
const getB2Token = async () => {
  const res = await fetch(
    "https://api.Backblazeb2.com/b2api/v2/b2_authorize_account",
    {
      headers: {
        Authorization: "Basic " + btoa(B2KeyID + ":" + B2AppKey),
      },
    }
  );
  const data = await res.json();
  return data.authorizationToken;
};

const updateRule = async () => {
  const b2Token = await getB2Token();

  const res = await fetch(
    `https://api.cloudflare.com/client/v4/zones/${CfZoneID}/rulesets/${CfRulesetID}/rules/${CfRuleID}`,
    {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${CfAuthKey}`
      },
      body: 
      `{
        "description": "Kun Visual Novel Patch",
        "action": "rewrite",
        "expression": "(http.host eq \\\"${CfHostname}\\\" and not starts_with(http.request.uri.path, \\\"/file/${B2BucketName}\\\"))",
        "action_parameters": {
          "uri": {
              "path": {
                  "expression": "concat(\\\"/file/${B2BucketName}\\\", http.request.uri.path)"
              },
              "query": {
                  "value": "Authorization=${b2Token}"
              }
          }
        }
      }`,
    }
  );

  const data = await res.text();
  return data;
};

async function handleRequest(request) {
  const data = await updateRule();
  return new Response(data);
}
```

编写完之后点击 Deploy 即可

### 设置定时任务

CFToken 是有时效的, 我们需要一个定时任务来执行这个时间, 触发刷新 Cloudflare Token 的函数

点击 `Workers & Pages` 页面的 `Settings`, 点击 `Trigger Events`, 点击 `Add`, 选择 `Cron Triggers`, 选择 `cron expression`

然后填写 `0 7,19 * * *`, 点击 `add`

这将会在每天早上和晚上 7: 00 刷新 Token

## 移除响应头中的敏感信息

实现了上面的内容之后, 请求这个 URL 会返回带有形如 `X-Bz-Content-Sha1` 这样的字段, 这样别人一看就知道这是使用了 Backblaze

为了避免这一点, 我们可以在响应请求中移除这些字段

点击 `Rules` -> `Transform Rules` -> `Modify Request Header` -> `Create Rule`

![](https://cdn.jsdelivr.net/gh/kun-moe/kun-image@main/blog/202412260017022.png)

点击部署即可

需要注意的是, 有些字母必须要大写, 不然会无效, 直接复制会自动将所有字母转换为小写

## 部署完成后的效果

### workers

访问 workers 的域名, 例如 loli.kungal.workers.dev

应该可以看到类似于这样的结果

``` json
{
  "result": {
    "description": "",
    "id": "xxxxxxxxxxxxxxxxxxxxxxxx",
    "kind": "zone",
    "last_updated": "2024-12-25T13:47:37.566629Z",
    "name": "default",
    "phase": "http_request_transform",
    "rules": [
      {
        ...
      },
    ],
    "version": "241"
  },
  "success": true,
  "errors": [],
  "messages": []
}
```

### 静态资源文件, 例如视频

在请求视频的时候, 刷新页面观察 Cloudflare cache 的命中情况, 应该可以看到 `Cf-Cache-Status` 的值为 `HIT`

这意味着请求已经命中 Cloudflare 的缓存, 无须再请求 Backblaze 了, 达到了防刷请求的效果

### 图片 URL

一个示例的图片 URL 可以是

https://touchgal-image.moyu.moe/user_1/image/1-1735021700481.avif

## 需要避免的问题

### 生命周期

B2 的文件生命周期是个坑, 我完全用不到这个功能, 所以点击建立存储桶之后, 点击 `Lifecycle Settings`, 将它改为 `Keep only the last version`

不过这样改之后, 删除文件到彻底删除还是需要一天的时间

### 删除后依然计费

并且 B2 的文件立即删除仍然会被计费，根据官方工作人员的说法，这应该会计算 1H 的费用

Reddit - https://www.reddit.com/r/Backblaze/comments/ld18d2/confused_about_b2_pricing/

### 计费单位

通常情况下，S3 服务商以 1TB = 1024GB 来计算费用 [1]（如 AWS S3），但是根据 Reddit 老哥的评论，B2 以 1TB = 1000GB 进行计费 [2]

``` text
Minor note, B2 does 1000 not 1024 for all computations. I can’t seem to find the help page but you should include this in your calculation
```

[1] AWS - https://aws.amazon.com/s3/pricing/

[2] Reddit - https://www.reddit.com/r/Backblaze/comments/z0owlq/how_do_i_calculate_b2_costs_if_i_use_encryption/

## 相关的文章

https://nies.live/d/158 - 总结的不错但是少了点东西, 还有 `去除不必要的响应Header` 这部分写错了

https://www.Backblaze.com/cloud-storage/transaction-pricing - B2 云存储事务定价

https://zs.fyi/archives/Backblaze-b2-cloudflare.html - 这个是真的全, 但是它没有提到移除请求头

https://king.freekj.me/article/2024/03/29 - 这个讲的还可以, 但是 `规则ID和规则集ID` 和 `设置定时任务` 这里有问题

https://www.longsays.com/2130.html - 太少
