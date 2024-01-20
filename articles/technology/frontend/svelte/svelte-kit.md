# Svelte 教程 Part3 & Part4

接着上一篇，刚看完 svelte，顺手学一下 svelte kit，然后搭我的 Galgame 表情包网站

emmm。。现在是十一点，看看什么时候能看完，说实话现在有点累了

还是这个教程，我现在有的是 Nuxt3 的基础

https://learn.svelte.dev/tutorial/introducing-sveltekit

## Part3: Basic SvelteKit

什么是 SvelteKit，简单理解一下就是一个 SSR 的 svelte 框架

SSR 就是服务端渲染，有更良好的首屏加载，更良好的速度，更良好的 SEO，示情况而定



### Routing

#### Pages

SvelteKit uses filesystem-based routing, which means that the *routes* of your app — in other words, what the app should do when a user navigates to a particular URL — are defined by the directories in your codebase.

Every `+page.svelte` file inside `src/routes` creates a page in your app. In this app we currently have one page — `src/routes/+page.svelte`, which maps to `/`. If we navigate to `/about`, we'll see a 404 Not Found error.

上面的解释非常详细，要点有这么几点

* SvelteKit 是基于文件系统的路由
* 使用 +page.svelte 这种方式结合文件夹的名字可以创建路由
* `src/routes/+page.svelte` 这个文件是根路由 `/`

这个和 Nuxt3 一模一样，和 Next 也一样，看来这种框架都是这样的



#### Layout

+layout.svelte 是一个布局组件，里面可以放一个 `<slot/>` 来作为 page 的出口，应用于所有子组件

到目前为止，所有的行为和 Nuxt3 的相似的



#### 路由参数

给路由传一个参数可以这么写，`src/routes/blog/[slug]/+page.svelte`

这个 [slug] 指的是文件夹的命名

注意一点，可以传多个参数，但是参数之间必须要使用至少一个字符分割，比如

[kun]-[yuyu] 就可以，[kun] [yuyu] 就不行



### Loading Data

#### Page Data

这个挺重要的，讲了怎么获取数据

在 `+page.svelte` 的同级可以有一个 `+page.server.ts` 文件，这个文件里面可以写一个函数 `load`，这个 load 将会加载数据，可以是异步的，然后把这些数据交给 `+page.svelte` 来用

src/routes/blog/+page.server.js

```javascript
import { posts } from './data.js';

export function load() {
	return {
		summaries: posts.map((post) => ({
			slug: post.slug,
			title: post.title
		}))
	};
}
```

用的时候

src/routes/blog/+page.svelte

```svelte
<script>
	export let data;
</script>

<h1>blog</h1>

<ul>
	{#each data.summaries as { slug, title }}
		<li><a href="/blog/{slug}">{title}</a></li>
	{/each}
</ul>
```

可以看到这里是用 `export let data;` 来拿到数据的

还有一个错误处理，找不到的话可以` throw error()`

src/routes/blog/[slug]/+page.server.js

```javascript
import { error } from '@sveltejs/kit';
import { posts } from '../data.js';

export function load({ params }) {
	const post = posts.find((post) => post.slug === params.slug);

	if (!post) throw error(404);

	return {
		post
	};
}
```



#### Layout Data

这个讲的是我们可以创建一个 `+layout.server.ts` 文件，和 page 用法差不多，可以写一个 `load` 函数在里面加载数据

用的时候只需要在子组件里面引入然后使用就可以了，语法还是 `export let data;`

`+layout.server.ts` 文件将加载数据一次，这些数据将被其下的任何页面继承

例如 `src/routes/blog/[slug]/+layout.svelte` ，从一篇文章导航到另一篇文章时，只需加载新文章的数据，因为侧边栏数据（data.summaries）保持有效，无需重新加载



### Headers and Cookies

#### Settings headers

可以用这种方式设置单个页面的 header

src/routes/+page.server.js

```javascript
export function load({ setHeaders }) {
	setHeaders({
		'Content-Type': 'text/plain'
	});
}
```



#### Reading and Writing cookies

可以用下面这种方式拿到页面的 cookie

src/routes/+page.server.js

```javascript
export function load({ cookies }) {
	const visited = cookies.get('visited');

	cookies.set('visited', 'true', { path: '/' });

	return {
		visited: visited === 'true'
	};
}
```

看到这里，其实这两个东东都是给 load 函数传了个参数进去而已



### Shared modules

#### The $lib alias

讲的是将一些通用的工具函数都放在项目根目录的 `src/lib` 这个文件夹下，之后要使用到这些工具函数都可以通过 `$lib/` 的路径别名来使用

这个做法就和一般把 `src` 目录的别名命名为 `@` 或者 `~` 差不多



### Forms

这个单元感觉好灵车。。是我从没写过原生 js 的原因吗

就是举例了一个表单的 CRUD 操作，我要做的是 Galgame 表情包网站，暂时用不到，不细看了



### API Routes

#### GET Handlers

就是创建一个 `server.js` 文件在里面写请求。。。

太 trivial 了。。每个框架都是一样的，我不想看了



### Stores

#### Page

SvelteKit makes three readonly stores available via the `$app/stores` module — `page`, `navigating` and `updated`. The one you'll use most often is [`page`](https://kit.svelte.dev/docs/types#public-types-page), which provides information about the current page:

就是说它提供了这几个页面 store，可以通过这三个东东获取信息

Page 这个东东看起来和 Vue 的 `const route = useRoute()` 一模一样，这个似乎应该叫做页面元信息 hhh



#### Navigating

哇呜。。。一股熟悉的气息扑面而来，这不就是 Nuxt3 的 `NavigateTo('/xxxx')` 吗。。。

Vue3 的话就是 `useRouter().push('/xxxx')`



#### Updated

这个好像没见过，看起来这是用来判断部署后的页面是否更新的，用到了再说，我暂时想不到用它的地方



### Errors and redirects

#### Basics

SvelteKit 可以有两种错误，预期的和预料之外的

预期的就是我知道这里出错，不用 SvelteKit 担心，预料之外的可能就是未捕获的错误，程序会崩溃，这和 NuxtErrorBoundary 有点像，Next 也有这种东东

这个嘛。。。我没用过，~~出错了肯定了用户的问题，刷新一下就好了，咳咳咳~~



#### Error Pages

一般的话错误页面是默认的，但是可以在 `+error.svelte` 这个地方自定义错误界面

这个写法和 Nuxt3 也差不多。。



#### Fallback Errors

如果问题出在根页面，这个错误也是可以自定义的

You can customize the fallback error page. Create a `src/error.html` file:

src/error.html

```markup
<h1>Game over</h1>
<p>Code %sveltekit.status%</p>
<p>%sveltekit.error.message%</p>
```



#### Redirects

重定向路由，这么玩的

src/routes/a/+page.server.js

```javascript
import { redirect } from '@sveltejs/kit';

export function load() {
	throw redirect(307, '/b');
}
```

感觉可以用来鉴权



## Part4: Advanced SvelteKit

### Hooks

#### Handle

哎。。。我感觉又要被介绍一堆渲染 hooks，我看看我猜的对不对

SvelteKit提供了多个钩子——用于拦截和覆盖框架默认行为的方式。

最基本的钩子是 handle，位于 `src/hooks.server.js` 中。它接收一个事件对象和一个解析函数，并返回一个Response。

`resolve` 是魔法发生的地方：SvelteKit 将传入的请求 URL 与应用程序的路由匹配，导入相关的代码（+page.server.js 和 +page.svelte 文件等），加载路由所需的数据，并生成响应

这么玩的

src/hooks.server.js

```javascript
export async function handle({ event, resolve }) {
	if (event.url.pathname === '/ping') {
		return new Response('pong');
	}

	return await resolve(event, {
		transformPageChunk: ({ html }) => html.replace(
			'<body',
			'<body style="color: hotpink"'
		)
	});
}
```



#### The RequestEvent object

噢噢噢噢！刚才我们刚看 Reading and Writing cookies 说过给 `load` 函数传了个参数进去，实际上这个参数对象就叫这个所谓的 `The RequestEvent object`

刚才的 header 和 cookie 只不过是这个对象上面的一些小东东

- `cookies` — the [cookies API](https://learn.svelte.dev/tutorial/cookies)
- `fetch` — the standard [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API), with additional powers
- `getClientAddress()` — a function to get the client's IP address
- `isDataRequest` — `true` if the browser is requesting data for a page during client-side navigation, `false` if a page/route is being requested directly
- `locals` — a place to put arbitrary data
- `params` — the route parameters
- `request` — the [Request](https://developer.mozilla.org/en-US/docs/Web/API/Request) object
- `route` — an object with an `id` property representing the route that was matched
- `setHeaders(...)` — a function for [setting HTTP headers](https://learn.svelte.dev/tutorial/headers) on the response
- `url` — a [URL](https://developer.mozilla.org/en-US/docs/Web/API/URL) object representing the current request

这个对象上面有个 `local` 属性比较有用，可以存一些自己的数据

src/hooks.server.js

```javascript
export async function handle({ event, resolve }) {
	event.locals.answer = 42;
	return await resolve(event);
}
```



#### handleFetch

刚才的 hook 里面可以写一个 handleFetch 函数，以后用到再说



#### handleError

和上面的 handleFetch 是一样的，也是在那个 `hook.server.js` 里面写的



### Page Options

#### Basics

在数据加载章节中，我们看到了如何从 +page.js、+page.server.js、+layout.js 和 +layout.server.js 文件中导出加载函数。我们还可以从这些模块中导出各种页面选项：

ssr — 页面是否应该进行服务器渲染

csr — 是否加载 SvelteKit 客户端

prerender — 是否在构建时对页面进行预渲染，而不是每次请求时

trailingSlash — 是否在 URL 中去除、添加或忽略尾随斜杠

在接下来的练习中，我们将依次了解这些选项。



#### SSR

可以从 `+page.server.js` 里面使用

src/routes/+page.server.js

```javascript
export const ssr = false;
```

来关闭页面的 SSR



到这里我算看懂了，这个 `+page.server.js` 可以配置各种 `+page.svelte` 的渲染选项，控制页面上的数据

这个行为就像是将每个页面割成了两个部分，一个前端一个后端，前端是 `+page.svelte` 来显示，后端是 `+page.server.js`，同时这个 ”前端“ 的数据还可以由 `+page.ts` 来控制

然后可以在项目的不同地方定义对这些 ”微小的前后端“ 的处理，这些处理都是相对于项目整体的，比如错误处理，通用函数等等

我是这么说，大致是这个意思，但是肯定不标准，不过我想这个基本的架构我是懂了



#### CSR

和上面一样

src/routes/+page.server.js

```javascript
export const csr = false;
```



#### Prerender

预渲染意味着在构建时为页面生成一次HTML，而不是针对每个请求动态生成

优势在于它提供的是提供静态数据，非常快速且便宜

不足之处在于构建过程需要更长时间，并且预渲染的内容只能通过构建和部署应用程序的新版本来更新

使用也是这么使用的

src/routes/+page.server.js

```javascript
export const prerender = true;
```



#### trailingSlash

这个可能会影响 SEO，默认就行，解释是

> Two URLs like `/foo` and `/foo/` might look the same, but they're actually different. A relative URL like `./bar` will resolve to `/bar` in the first case and `/foo/bar` in the second, and search engines will treat them as separate entries, harming your SEO.

改变这个选项只需要

src/routes/always/+page.server.js

```javascript
export const trailingSlash = 'always';
```

谁没事改这个呀。。。



### Link Options

#### Preloading

哦天哪。。。想出这个办法的人真是天才，我来描述一下发生了什么

有时候我们要进入一个页面，这个页面加载的很慢

当我们把鼠标 hover 到一个 a 标签上时，页面就开始加载，而不是在用户 ”将鼠标点击之后“ 页面才开始加载，这会显著提升页面的加载速度（实际上没有变快，但是用户体验变好了）

官方描述是 `but in practice it typically saves 200ms or more.`

只需要在 a 标签上加上这个 `data-sveltekit-preload-data` 就可以开启了

src/routes/+layout.svelte

```svelte
<nav>
	<a href="/slow-a" data-sveltekit-preload-data>slow-a</a>
</nav>
```



#### Reloading the page

默认情况下在 SvelteKit 中使用 a 标签导航是不会刷新页面的，某些特殊情况下想要在导航的时候刷新页面，可以配置

src/routes/+layout.svelte

```svelte
<nav data-sveltekit-reload>
	<a href="/">home</a>
	<a href="/about">about</a>
</nav>
```

这么写的话 a 标签跳转的时候就会刷新了

emmm。。这种情况我还真碰到过，但是对于 SPA 来说，刷新页面是大忌，还好最后解决了



### Advanced routing

#### Optional Parameters

路由可选参数，看起来和 Nuxt3 里面的一模一样。。

使用 `[[param]]` 包裹一下就变成可选路由参数了，使用的时候直接 `params.lang ?? 'en'`



#### Rest Parameters

路由剩余参数，这个 Nuxt3 里面也有，但是我用的不多，用到了再说



#### Param Matchers

路由参数匹配，暂时用不到，用到了再看



#### Router Groups

这个也用不到。。暂时



#### Breaking out of layouts

我去，这个看起来好高级

SvelteKit 是文件系统路由，默认情况下子路径会继承父路径的布局，如果要跳出布局，只需要使用一个 @ 加上要跳到哪个父组件上就可以

for example `+page@b.svelte` would put `/a/b/c` inside `src/routes/a/b/+layout.svelte`, while `+page@a.svelte` would put it inside `src/routes/a/+layout.svelte`.

不能跳出根布局



### Advanced loading

#### Universal load functions

在前面关于加载的部分中，我们使用 +page.server.js 和 +layout.server.js 文件从服务器加载数据。如果您需要直接从数据库获取数据或读取 cookie 等操作，这非常方便。

在进行客户端导航时，有时从服务器加载数据是没有意义的。例如：

* 从外部 API 加载数据

* 如果可用，希望使用内存中的数据

* 希望延迟导航，直到图像已预加载，以避免弹出

* 需要从加载中返回无法序列化的内容（SvelteKit 使用 devalue 将服务器数据转换为 JSON），例如组件或存储

SvelteKit 居然也用 devalue ，Nuxt3 也用的这个东东

这个案例怎么让我想到了 `函数组件` 这种东东



#### Using both load functions

讲的是怎么讲页面上的 `load()` 函数和服务器的 `load()` 函数放在一起使用

这么说可能有点抽象了，我们刚才说了 SvelteKit 大致的构成，这个可以看作是把 ”前端“ 的 ”数据“ 和后端的数据放在一起用了

用到再说



#### Using parent data

+page.svelte 和 +layout.svelte 组件可以访问从它们的父级加载函数返回的所有内容

`src/routes/+layout.server.js`:

src/routes/+layout.server.js

```javascript
export function load() {
	return { a: 1 };
}
```

Then, get that data in `src/routes/sum/+layout.js`:

src/routes/sum/+layout.js

```javascript
export async function load({ parent }) {
	const { a } = await parent();
	return { b: a + 1 };
}
```

用个 `await parent();` 就可以了



#### Invalidation

当用户从一个页面导航到另一个页面时，SvelteKit 会调用 load，但是仅仅在 ”有变化的时候“ 才会调用

我记得最开始理解过 Svelte  的响应式原理，里面提到了赋值，不知道是不是这么判断的

我们可以通过使用 invalidate() 函数手动使其失效来解决这个问题，该函数接受一个 URL 并重新运行依赖于它的任何加载函数
比如说 `invalidate('/api/now')`



#### Custom dependencies

看起来暂时用不到



#### invalidateAll

重新加载当前页面的所有 load 函数

注意，invalidate(() => true) 和 invalidateAll 不同。invalidateAll 会重新运行加载函数，不考虑任何 URL 依赖项，而 invalidate(() => true) 则不会



### Environment variables

#### $env/static/private

在 .env 里面写变量，然后仅能在 `+page.server.js` 的服务端使用

这个和 Nuxt3 差不多



#### $env/dynamic/private

如果在应用程序运行时需要读取环境变量的值，而不是在应用程序构建时，可以使用$env/dynamic/private而不是 $env/static/private



#### $env/static/public

在 .env 里面写的变量加上 `PUBLIC_`，这个前缀就变成公开变量了，可以随意访问

.env

```bash
PUBLIC_THEME_BACKGROUND="steelblue"
PUBLIC_THEME_FOREGROUND="bisque"
```



#### $env/dynamic/publics

同理

原话是，最好使用静态值，但如果必要，我们可以使用动态值



### Conclusion

Congratulations! If you've made it the entire way through this tutorial, you can now consider yourself a Svelte and SvelteKit expert.

You can start building apps on your own machine with the [`create-svelte`](https://www.npmjs.com/package/create-svelte) package:

```bash
npm create svelte@latest
```

Svelte and SvelteKit will continue to evolve, and so will this tutorial. Check back periodically for updates.

To keep up with developments in the Svelte world, join our Discord server at [svelte.dev/chat](https://svelte.dev/chat) and follow [Svelte Society](https://twitter.com/sveltesociety) on Twitter. We're so happy to welcome you to the Svelte community!



---



让我看看啊，我是快 11 点看的 SvelteKit，现在快两点的时候看完了

三个小时就能学完 SvelteKit，加上 Svelte 的六个小时，就是九个小时

那么也就是说，在有 Vue3 和 Nuxt3 的基础下，纯学习九个小时就可以变成 SvelteKit expert，啊哈哈哈

这两篇文章有九千多字，~~我可以说我一天写了个万字长文介绍 Svelte 吧~~

欢迎点击右上角联系我们，[Telegram](https://t.me/kungalgame)

