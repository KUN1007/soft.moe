# 记录一次 mongodb 操作失误导致字段重复的处理过程

## 问题背景

我们开发的论坛在运行测试中发现有不应该重复的用户字段 `name` 和 `email` 重复了，现在要处理这个问题

## 问题原因

这里是当前 `mongoose` 的 `UserModel`

```typescript
const UserSchema = new mongoose.Schema<UserAttributes>(
  {
    uid: { type: Number, unique: true },

    name: { type: String, required: true },

    email: { type: String, required: true },
  },
  { timestamps: { createdAt: 'created', updatedAt: 'updated' } }
)
```

原因是我在删除 `pre-save` 钩子之后忘记给这个 model 加 `unique: true` 了。。然后就导致重复

预期的结果应该是

```typescript
const UserSchema = new mongoose.Schema<UserAttributes>(
  {
    uid: { type: Number, unique: true },

    name: { type: String, required: true, unique: true },

    email: { type: String, required: true, unique: true },
  },
  { timestamps: { createdAt: 'created', updatedAt: 'updated' } }
)
```



## 解决方案

### 1. 停掉生产环境注册

发现这种严重的问题当即就要取消用户的注册功能，防止问题继续出现

### 2. 导入生产环境数据库表，本地测试

先在本地测试成功改好的数据库，再部署，坚决杜绝直接操作生产环境数据库

### 3. 解决完成彻底无误再尝试部署

## 解决步骤

经过我的检测发现，目前仅有两个用户发生了重复现象（应该是注册的时候短时间内点击了多次导致的）

不幸中的万幸是这两位用户都没有发表话题，点赞等互动行为，只需要删除后一个，再把后面用户的 uid 向前移动一位就可以了

~~要是大规模的生产环境，这种情况简直难以想象~~

**找到重复的用户**

```typescript
db.getCollection("users").aggregate([
    { $group: { _id: "$name", count: { $sum: 1 } } },
    { $match: { count: { $gt: 1 } } },
    { $sort: { count: -1 } }
])
```

**删除重复的用户**

```typescript
db.collection.deleteOne({ uid: 504 })
```

**更新之后用户的 `uid`**

```typescript
db.collection.updateMany({ uid: { $gte: 504 }, { $inc: { uid: -1 } })
```

## 好好好，恭喜你看到这里了

上面的做法都是不可取的，不信你试试，~~寄了别怪我~~

最可取的做法应该是把重复用户的 `name` 和 `email` 随便改一个值，然后将这个字段设置为唯一

```typescript
db.getCollection("users").createIndex({ "name": 1 }, { unique: true })
db.getCollection("users").createIndex({ "email": 1 }, { unique: true })
```

测试无误，可以部署了