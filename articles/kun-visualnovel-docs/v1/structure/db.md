# 数据库字段含义说明

其实我们在后端的 `src/models` 文件夹下对每一个字段都进行了注释，可以清楚的查看

在看文档时，不妨先看看代码，这里照搬一份 `models` 文件夹

## Comment Model

::: details CommentModel
```typescript
const CommentSchema = new mongoose.Schema<CommentAttributes>(
  {
    // 评论的 ID，从 1 开始且要求唯一，在用户发评论时自动增加
    cid: { type: Number, unique: true },
    // 评论所属的回复 ID，标识了这个评论是属于哪个回复的
    rid: { type: Number, required: true },
    // 评论所属的话题 ID，标识了这个评论是哪个话题底下的
    tid: { type: Number, required: true },
    // 评论者的 uid，和用户关联，标识了这是谁发的评论
    c_uid: { type: Number, required: true, ref: 'user' },
    // 被评论者的 uid，和用户关联，标识了这个评论是发给谁的
    to_uid: { type: Number, required: true, ref: 'user' },
    // 评论的内容，纯文字，无富文本
    content: { type: String, default: '' },

    // 评论点赞计数
    likes_count: { type: Number, default: 0 },
    // 评论点踩计数
    dislikes_count: { type: Number, default: 0 },

    // 评论的点赞数组，存放了点赞用户的 uid
    likes: { type: [Number], default: [] },
    // 评论的点踩数，存放了点踩用户的 uid
    dislikes: { type: [Number], default: [] },
  },
  // 时间戳，自动生成
  { timestamps: { createdAt: 'created', updatedAt: 'updated' } }
)

```
:::

## Expenditure Model

::: details ExpenditureModel
```typescript
const ExpenditureSchema = new mongoose.Schema<ExpenditureAttributes>(
  {
    // 支持的 id，从 1 开始，在支出发成的时候自动生成
    eid: { type: Number, unique: true },
    // 支出的原因
    reason: { type: String, default: '' },
    // 支出的时间
    time: { type: Number, default: Date.now() },
    // 支出的金额
    amount: { type: Number, default: 0 },
  },
  // 支出的时间戳，创建时自动生成
  { timestamps: { createdAt: 'created', updatedAt: 'updated' } }
)

```
:::

## Income Model

::: details IncomeModel
```typescript
const IncomeSchema = new mongoose.Schema<IncomeAttributes>(
  {
    // 单条收入的 id，从 1 开始且唯一，在收入创建时自动加一
    iid: { type: Number, unique: true },
    // 收入发生的原因
    reason: { type: String, default: '' },
    // 收入发生的时间
    time: { type: Number, default: Date.now() },
    // 收入发生的金额
    amount: { type: Number, default: 0 },
  },
  // 收入的时间戳，自动生成
  { timestamps: { createdAt: 'created', updatedAt: 'updated' } }
)
```
:::

## Non Moe Model

::: details NonMoeModel
```typescript
const NonMoeSchema = new mongoose.Schema<NonMoeAttributes>(
  {
    // 不萌记录的 ID，从 1 开始，在创建记录的时候自动生成
    nid: { type: Number, unique: true },
    // 用户 ID，这条记录是对谁的记录
    uid: { type: Number, required: true },
    // 用户名
    name: { type: String, require: true },
    // 不萌记录的描述，发生了什么不萌行为
    description: { type: String, required: true },
    // 不萌记录发生的时间
    time: { type: Number, default: Date.now() },
    // 发生不萌行为的后果
    result: { type: String, required: true },
  },
  // 时间戳，自动生成
  { timestamps: { createdAt: 'created', updatedAt: 'updated' } }
)
```
:::

## Reply Model

::: details ReplyModel
```typescript
const ReplySchema = new mongoose.Schema<ReplyAttributes>(
  {
    // 回复的 ID，从 1 开始且唯一，自动生成
    rid: { type: Number, unique: true },
    // 回复所属话题的 ID，标志了该条回复是属于哪个话题的
    tid: { type: Number, required: true },
    // 回复人的 uid，标识了这个回复是谁发的
    r_uid: { type: Number, required: true },
    // 被回复人的 uid，标志了这个回复是回给谁的
    to_uid: { type: Number, required: true },
    // 回复的楼层数，标志了这个回复属于该话题的几楼
    floor: { type: Number, default: 0 },
    // 被回复的人的楼层数，方便点击跳转
    to_floor: { type: Number, default: 0 },
    // 回复的 tag，可选，字符串数组
    tags: { type: [String], default: [] },
    // 回复发布的时间
    time: { type: Number, default: 0 },
    // 回复被再次编辑的时间
    edited: { type: Number, default: 0 },
    // 回复的内容
    content: { type: String, default: '' },
    // 回复被推的时间
    upvote_time: { type: Number, default: 0 },

    // 回复的点赞计数
    likes_count: { type: Number, default: 0 },
    // 回复的评论计数
    comments_count: { type: Number, default: 0 },

    // 回复被推数组，存放了推回复用户的 uid
    upvotes: { type: [Number], default: [] },
    // 回复的点赞数组，存放了点赞用户的 uid
    likes: { type: [Number], default: [] },
    // 回复的点踩数组，存放了点踩用户的 uid
    dislikes: { type: [Number], default: [] },
    // 回复的分享数组，存放了分享用户的 uid
    share: { type: [Number], default: [] },
    // 回复的评论数组，存放了回复底下评论的 uid
    comment: { type: [String], default: [] },
  },
  // 时间戳，自动创建
  { timestamps: { createdAt: 'created', updatedAt: 'updated' } }
)
```
:::

## Tag Model

::: details TagModel
```typescript
const TagSchema = new mongoose.Schema<TagAttributes>(
  {
    // 单个 tag 的 ID，从 1 开始自动递增且唯一
    tag_id: { type: Number, unique: true },
    // tag 所在的话题或者回复的 id
    tid: { type: Number, require: true },
    // tag 所在的回复 id，为 0 的就是楼主话题的 tag
    rid: { type: Number, default: 0 },
    // tag 的名字
    name: { type: String, require: true },
    // tag 所属话题的分类
    category: { type: [String], default: [] },
  },
  // 时间戳，自动生成
  { timestamps: { createdAt: 'created', updatedAt: 'updated' } }
)

```
:::

## Topic Model

::: details TopicModel
```typescript
const TopicSchema = new mongoose.Schema<TopicAttributes>(
  {
    // 话题的 ID，在创建话题的时候自动生成，从 1 开始
    tid: { type: Number, unique: true },
    // 话题的标题
    title: { type: String, required: true },
    // 话题的内容，富文本
    content: { type: String, required: true },
    // 发帖人的 uid
    uid: { type: Number, required: true, ref: 'user' },
    // 话题的 tag，为一个字符串数组
    tags: { type: [String], required: true },
    // 话题的分类，暂时有一个或两个
    category: { type: [String], required: true },
    // 话题发布的时间
    time: { type: Number, default: Date.now() },

    // 话题的热度，有专门的热度计算公式
    popularity: { type: Number, default: 0 },
    // 话题被查看的次数
    views: { type: Number, default: 0 },
    // 话题的评论数
    comments: { type: Number, default: 0 },
    // 话题被推的时间
    upvote_time: { type: Number, default: 0 },

    // 话题的被推计数
    upvotes_count: { type: Number, default: 0 },
    // 话题的回复计数
    replies_count: { type: Number, default: 0 },
    // 话题的点赞计数
    likes_count: { type: Number, default: 0 },
    // 话题的分享计数
    share_count: { type: Number, default: 0 },
    // 话题的被踩计数
    dislikes_count: { type: Number, default: 0 },

    // 话题的被推数组，存放了用户的 uid
    upvotes: { type: [Number], default: [] },
    // 话题下方回复的 ID，存放了回复的 rid
    replies: { type: [Number], default: [] },
    // 话题的点赞数，存放了点赞用户的 uid
    likes: { type: [Number], default: [] },
    // 话题的分享数，存放了分享用户的 uid
    share: { type: [Number], default: [] },
    // 话题的点踩数，存放了点踩用户的 uid
    dislikes: { type: [Number], default: [] },

    // 话题的状态，0 正常，1 封禁, 2 被删除
    status: { type: Number, default: 0 },
    // 话题被再次编辑的时间
    edited: { type: Number, default: 0 },
  },
  // 时间戳，自动生成
  { timestamps: { createdAt: 'created', updatedAt: 'updated' } }
)

```
:::

## Update Log Model

::: details UpdateLogModel
```typescript
const UpdateLogSchema = new mongoose.Schema<UpdateLogAttributes>(
  {
    // 单个更新日志的 id，唯一，从 1 递增
    upid: { type: Number, unique: true },
    // 更新日志的记录内容
    description: { type: String, required: true, default: '' },
    // 更新的时间
    time: { type: Number, required: false, default: Date.now() },
    // 更新的版本
    version: { type: String, required: false, default: '' },
  },
  // 时间戳，自动生成
  { timestamps: { createdAt: 'created', updatedAt: 'updated' } }
)
```
:::

## User Model

::: details UserModel
```typescript
const UserSchema = new mongoose.Schema<UserAttributes>(
  {
    // 用户 ID，从 1 开始递增且唯一
    uid: { type: Number, unique: true },
    // 用户名，唯一，允许数字字母汉字和 _ ~
    name: { type: String, required: true },
    // 用户邮箱
    email: { type: String, required: true },
    // 用户密码，已加密
    password: { type: String, required: true },
    // 用户的注册 ip，可选
    ip: { type: String, default: '' },
    // 用户头像的图片地址
    avatar: { type: String, default: '' },
    // 用户的角色，游客：0，普通用户：1，管理员：2，超级管理员：3
    roles: { type: Number, default: 1 },
    // 用户的状态，0：正常，1：封禁
    status: { type: Number, default: 0 },
    // 用户的注册时间
    time: { type: Number, default: Date.now() },
    // 用户的萌萌点
    moemoepoint: { type: Number, default: 1007 },
    // 用户的签名
    bio: { type: String, default: '' },
    // 用户的被推数
    upvote: { type: Number, default: 0 },
    // 用户的被赞数
    like: { type: Number, default: 0 },
    // 用户的被踩数
    dislike: { type: Number, default: 0 },
    // 用户今日发表的话题，每日发布上限 萌萌点 / 10 个，12 点重置
    daily_topic_count: { type: Number, default: 0 },

    // 用户的好友计数
    friend_count: { type: Number, default: 0 },
    // 用户关注的用户计数
    followed_count: { type: Number, default: 0 },
    // 用户的关注者计数
    follower_count: { type: Number, default: 0 },
    // 用户发表的话题计数
    topic_count: { type: Number, default: 0 },
    // 用户发表的回复计数
    reply_count: { type: Number, default: 0 },
    // 用户发表的评论计数
    comment_count: { type: Number, default: 0 },

    // 用户的好友数组，存放了用户好友的 uid
    friend: { type: [Number], default: [] },
    // 用户关注的用户
    followed: { type: [Number], default: [] },
    // 用户的关注者
    follower: { type: [Number], default: [] },
    // 用户发表的话题 ID，存放了用户发布话题的 tid
    topic: { type: [Number], default: [] },
    // 用户发表的回复 ID
    reply: { type: [Number], default: [] },
    // 用户发表的评论 ID
    comment: { type: [Number], default: [] },
    // 用户点赞的话题 ID
    like_topic: { type: [Number], default: [] },
    // 用户点踩的话题 ID
    dislike_topic: { type: [Number], default: [] },
    // 用户推的话题 ID
    upvote_topic: { type: [Number], default: [] },
    // 用户回复的话题 ID
    reply_topic: { type: [Number], default: [] },
  },
  // 时间戳，自动生成
  { timestamps: { createdAt: 'created', updatedAt: 'updated' } }
)
```
:::

## 
