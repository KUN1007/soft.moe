# localforage / Indexdb

## 介绍

`Indexdb` 是浏览器自带的一个小数据库，本项目中使用了 `localforage` 这个库来更简单的操作它

本项目中使用到 `localforage` 的地方只有缓存图片这个作用

原本我们是将设置面板的 9 张背景图全部在 `localforage` 缓存一份的，但是经过开发团队的商讨，这种做法是不可取的。可以直接设置背景图片的 `max-age` 来控制其缓存时间

所以我们的 `localforage` 只会用于用户自定义背景的实现上

## localforage

`localforage` 的使用在 `src/hooks/useLocalforage.ts` 文件下

它封装了三个基本方法 `saveImage`, `getImage`, `deleteImage`，用于操作图片的 `Blob` 数据

## 使用

用户自定义背景的实现在 `src/components/setting-panel/components/CustomBackground.vue` 上

```typescript
const handleFileChange = async (event: Event) => {
  const input = event.target as HTMLInputElement

  if (!input.files || !input.files[0]) {
    return
  }

  const file = input.files[0]
  await saveImage(file, 'kun-galgame-custom-bg')
  const backgroundImageBlobData = await getImage('kun-galgame-custom-bg')

  if (backgroundImageBlobData) {
    showKUNGalgameBackground.value = 'bg1007'
    showKUNGalgameCustomBackground.value = URL.createObjectURL(
      backgroundImageBlobData
    )
  } else {
    Message('Upload image failed!', '上传图片错误！', 'error')
  }
}
```

它的核心就是使用了 `URL.createObjectURL` 创建了一个基于 `Blob` 对象的图片链接，然后在 `src/layout/KUNGalgameAPP.vue` 中使用了它

需要注意的是，`URL.createObjectURL` 创建的链接在每次浏览器关闭后都会失效，所以需要在下一次加载的时候重新生成链接，请看 `src/layout/KUNGalgameAPP.vue`

```typescript
onMounted(async () => {
  const backgroundImageBlobData = await getImage('kun-galgame-custom-bg')
  if (showKUNGalgameBackground.value === 'bg1007' && backgroundImageBlobData) {
    showKUNGalgameCustomBackground.value = URL.createObjectURL(
      backgroundImageBlobData
    )
  }
  imageURL.value = await getCurrentBackground()
})
```
