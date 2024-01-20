# Svelte 教程 Part1 & Part2

晚上两点，开始零基础学习 svelte-kit，看看多久能学完

这个教程似乎有四个部分，前两个是 svelte，后两个是 svelte kit

我现在有基本的 Vue3 和 Nuxt3 基础，开始学习

先参考官方的 `tutorial` 看看怎么玩的，**注意，下面的所有内容全部是看这个教程来的**

https://learn.svelte.dev/tutorial/

emmm，结论是可以花六个小时学完 svelte，这个已经 5000 字了，svelte kit 重新开一篇写

## Part1: Basic Svelte

### 赋值

看样子是和 `React` 差不多的写法

`src={src}` 可以缩写为 `<img {src} alt="{name} dances." />`



### style

这块和 Vue 差不多

Just like in HTML, you can add a `<style>` tag to your component. Let's add some styles to the `<p>` element:

App.svelte

```svelte
<p>This is a paragraph.</p>

<style>
	p {
		color: goldenrod;
		font-family: 'Comic Sans MS', cursive;
		font-size: 2em;
	}
</style>
```



Component 这块似乎所有框架都一样的



### 插入 `HTML`

这个和 Vue 的 `v-html` 差不多，需要注意防 `xss`

Ordinarily, strings are inserted as plain text, meaning that characters like `<` and `>` have no special meaning.

But sometimes you need to render HTML directly into a component. For example, the words you're reading right now exist in a markdown file that gets included on this page as a blob of HTML.

In Svelte, you do this with the special `{@html ...}` tag:

App.svelte

```svelte
<p>{@html string}</p>
```



### 响应式点击

和 Vue 的 `v-on` 差不多

App.svelte

```svelte
<button on:click={increment}>
	Clicked {count}
	{count === 1 ? 'time' : 'times'}
</button>
```



### 计算属性

类似于 `Vue` 的 `computed`

App.svelte

```javascript
let count = 0;
$: doubled = count * 2;
```

不过它这个写法是 `$: `，很特殊，没有见过的写法，官方的描述是

Don't worry if this looks a little alien. It's [valid](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/label) (if unconventional) JavaScript

这个计算属性还可以写出一个语句

App.svelte

```javascript
$: if (count >= 10) {
	alert('count is dangerously high!');
	count = 0;
}
```



### 数据更新

这个看起来还蛮重要的，讲的是 svelte 响应式的实现原理，描述是 `Because Svelte's reactivity is triggered by assignments`。

我的理解是，Svelte的响应性是通过编译时的静态分析实现的。当一个变量被重新赋值时，Svelte会自动重新渲染与该变量相关的DOM部分

并且，Svelte只能检测到顶级变量的赋值操作。如果尝试更新一个对象的属性，而不是对象本身，Svelte可能无法检测到这个变化，比如说

App.svelte

```javascript
const obj = { foo: { bar: 1 } };
const foo = obj.foo;
foo.bar = 2;
```

这样就不行

我熟悉的 Vue，Vue2 是通过 `Object.defineProperty` ，它依赖于 getter 和 setter 函数来跟踪依赖和通知变化，Vue3 是用了一个 ES6 的 `Proxy Object`，这个东东会自动拦截对对象的任何操作，这意味着Vue3可以更直接地跟踪对数组和对象的修改，而不需要额外的赋值操作来触发更新

所以这个响应式的实现还是和 Vue 有区别的

还有一点类似于 fp，因为官网提到

But there's a more idiomatic solution:

App.svelte

```javascript
function addNumber() {
	numbers = [...numbers, numbers.length + 1];
}
```

这看起来是一个 `不改变原对象` 的做法，和 fp 的部分理念一致



### 组件间传递 `props`

svelte 用了一个很奇特的东东 `export let `

Nested.svelte

```svelte
<script>
	export let answer;
</script>
```

这个和 Vue3 中的 `const props = defineProps()` 是差不多的东东，不过不同的是，这个 props 可以直接被父组件和子组件修改，可以理解为双向绑定



### 默认值

props 的值可以是子组件有默认的，很好理解



### Spread props

可以使用解构赋值来传递 props，例如

App.svelte

```svelte
<PackageInfo
	name={pkg.name}
	speed={pkg.speed}
	version={pkg.version}
	website={pkg.website}
/>
```

可以写成

App.svelte

```svelte
<PackageInfo {...pkg} />
```



### if 块

类似于 Vue 的 `v-if`，不过 `svelte` 这个语法似乎很特殊，而且比较长，这个写法似乎被叫做 `markup`

```svelte
<script>
	let count = 0;

	function increment() {
		count += 1;
	}
</script>

<button on:click={increment}>
	Clicked {count}
	{count === 1 ? 'time' : 'times'}
</button>

{#if count > 10}
  <p>KUN IS THE CUTEST!</p>
{/if}
```

这个应该看一眼就知道在干什么



### else 块

App.svelte

```svelte
{#if count > 10}
	<p>{count} is greater than 10</p>
{:else}
	<p>{count} is between 0 and 10</p>
{/if}
```

这个也看一眼就知道在干什么



### else if 块

App.svelte

```svelte
{#if count > 10}
	<p>{count} is greater than 10</p>
{:else if count < 5}
	<p>{count} is less than 5</p>
{:else}
	<p>{count} is between 5 and 10</p>
{/if}
```



### each 块

类似于 Vue 的 `v-for`

App.svelte

```svelte
<div>
	{#each colors as color, i}
		<button
			aria-current={selected === color}
			aria-label={color}
			style="background: {color}"
			on:click={() => selected = color}
		>{i + 1}</button>
	{/each}
</div>
```

需要注意的是这个 `colors`，它可以是任何数组之类的东东，而这里的 `i` 是数组的下标，官方的描述是

> The expression (`colors`, in this case) can be any array or array-like object (i.e. it has a `length` property). You can loop over generic iterables with `each [...iterable]`.



### keyed each blocks

主要讲了这么个原理

在Svelte中，`{#each}` 块的默认行为是在修改数组时，在数组的末尾添加和删除元素，并更新任何已更改的值。**这种行为的原因是 Svelte 在处理没有 key 的 `{#each}` 块时，会尽量复用现有的 DOM 节点来提高性能。**

当你从数组中删除一个元素时，Svelte 默认会移除最后一个 DOM 节点，而不是与被删除数组元素对应的 DOM 节点。

然后，它会更新剩余的 DOM 节点以反映数组的新状态。这种行为在某些情况下可能会导致问题。

例如，如果你有一个列表，其中的每个项目都有一个固定的标识符和一些动态内容，当你删除列表中的第一个项目时，你可能会期望第一个 DOM 节点被移除。

但是，如果没有使用 key，Svelte 会移除最后一个 DOM 节点，然后更新剩余节点的动态内容，而不是移除与被删除项目对应的 DOM 节点。

这就是为什么在点击 "Remove first thing" 按钮后，最后一个 `<Thing>` 组件被移除，而不是第一个。

为了解决这个问题，可以为 `{#each}` 块指定一个 key，这样 Svelte 就能知道在组件更新时应该更改哪个 DOM 节点。

这可以通过在 `{#each}` 块中的项目后面添加一个括号内的表达式来实现，例如 `{#each things as thing (thing.id)}`。

在这个例子中，`thing.id`是每个项目的唯一标识符，它告诉Svelte如何在数据变化时正确地更新DOM节点

这个行为和 `v-for` 差不多



### Await 块

这个讲了怎么在 svelte 中使用 promise，优点是不用担心竞态条件和回调地狱

App.svelte

```svelte
{#await promise}
	<p>...waiting</p>
{:then number}
	<p>The number is {number}</p>
{:catch error}
	<p style="color: red">{error.message}</p>
{/await}
```

这个写法比较奇特，如果你确定这个数据必须要获得的话，你可以省略

```svelte
{#await promise then number}
	<p>The number is {number}</p>
{/await}
```

我们可以这么获取异步数据

```svelte
<script>
  // Import the async function if it's defined in another file
  import { fetchData } from './fetchData.ts';

  // Call the fetchData function and store the result
  let dataPromise = fetchData();
</script>

<!-- Use the #await block to handle the promise -->
{#await dataPromise}
  <p>Loading...</p>
{:then data}
  <!-- Display the fetched data -->
  <p>Data: {data}</p>
{:catch error}
  <!-- Handle any errors that occur during fetching -->
  <p style="color: red">Error: {error.message}</p>
{/await}
```

这带来个问题

> 直接使用 let dataPromise = await fetchData(); 再把 dataPromise 放进页面不行吗？

原因是在Svelte中，如果尝试使用 `let dataPromise = await fetchData();` 这样的方式来获取数据，会遇到一个问题：Svelte的组件脚本在初始化阶段是同步执行的，这意味着不能在这个阶段使用 `await` 关键字，因为 `await` 只能在 `async` 函数中使用

Svelte提供了 `{#await}` 块来处理这个问题。这个特性允许你在模板中直接等待 Promise 的结果，同时提供了处理加载状态和错误的能力。这是一个更加声明式的方式来处理异步数据，使得代码更易于理解和维护

如果仍然想在组件脚本中使用 `await`，可以在 `onMount` 生命周期钩子中使用，因为这个钩子允许你执行异步操作。但是，这样做的话，需要自己处理加载状态和错误，而且不能在模板中直接使用获取到的数据，因为数据在 Promise 解析之前是不可用的



### DOM Events

As we've briefly seen already, you can listen to any DOM event on an element (such as click or [pointermove](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointermove_event)) with the `on:` directive:

App.svelte

```svelte
<div on:pointermove={handleMove}>
	The pointer is at {m.x} x {m.y}
</div>
```

哎。。。我就是官方教程的搬运工



### Inline handlers

You can also declare event handlers inline:

App.svelte

```svelte
<script>
	let m = { x: 0, y: 0 };

	function handleMove(event) {
		m.x = event.clientX;
		m.y = event.clientY;
	}
</script>

<div
	on:pointermove={(e) => {
		m = { x: e.clientX, y: e.clientY };
	}}
>
	The pointer is at {m.x} x {m.y}
</div>
```

可以这么写，svelte 完全不限制这种写法，官网说法是

> In some frameworks you may see recommendations to avoid inline event handlers for performance reasons, particularly inside loops. That advice doesn't apply to Svelte — the compiler will always do the right thing, whichever form you choose.

啊哈哈哈，`some frameworks`，我一眼就看出你是在说 Vue 和 React



### 事件修饰符

DOM event handlers can have *modifiers* that alter their behaviour. For example, a handler with a `once` modifier will only run a single time:

这个 once 应该和 Vue 的 `v-once` 差不多，只运行一次，优化性能用的

App.svelte

```svelte
<button on:click|once={() => alert('clicked')}>
	Click me
</button>
```

The full list of modifiers:

- `preventDefault` — calls `event.preventDefault()` before running the handler. Useful for client-side form handling, for example.
- `stopPropagation` — calls `event.stopPropagation()`, preventing the event reaching the next element
- `passive` — improves scrolling performance on touch/wheel events (Svelte will add it automatically where it's safe to do so)
- `nonpassive` — explicitly set `passive: false`
- `capture` — fires the handler during the [*capture*](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#event_capture) phase instead of the [*bubbling*](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#event_bubbling) phase
- `once` — remove the handler after the first time it runs
- `self` — only trigger handler if event.target is the element itself
- `trusted` — only trigger handler if `event.isTrusted` is `true`, meaning the event was triggered by a user action rather than because some JavaScript called `element.dispatchEvent(...)`

You can chain modifiers together, e.g. `on:click|once|capture={...}`.

这玩意居然还是链式的，真优雅，感觉比 vue 的 `@click.stop` 什么的好一点



### 事件分发

这个东东类似于 Vue3 中的 defineEmits，看起来也可以用来从子组件中向父组件传递数据

子组件

```svelte
<script>
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	function sayHello() {
		dispatch('message', {
			text: 'Hello!'
		});
	}
</script>
```

父组件

```svelte
<Inner on:message={handleMessage} />
```



### 事件转发

就是讲的是事件在组件间的层层传递，需要做转发，比如说孙组件中有一个事件要爷组件用，那么父组件要对这个事件做转发，方法和孙组件创建事件分发是一样的，都是 `createEventDispatcher`

需要注意的是，它提供了一个简写方式，这个简写方式会转发所有的事件，父组件就不用写那么多代码帮孙组件传数据了

Outer.svelte

```svelte
<script>
	import Inner from './Inner.svelte';
</script>

<Inner on:message/>
```



### DOM 事件转发

直接放代码更好理解

父组件

```svelte
<script>
	import BigRedButton from './BigRedButton.svelte';
	import horn from './horn.mp3';

	const audio = new Audio();
	audio.src = horn;

	function handleClick() {
		audio.load();
		audio.play();
	}
</script>

<BigRedButton on:click={handleClick} />
```

大红按钮子组件

```svelte
<button on:click>
	Push
</button>

<style>
...
</style>
```

只需要在子组件写一个 `<button on:click>` 就能接到父组件传过来的 on:click 了



啊。。。。看到 Parts1 的 binding 了，从两点多熬到快五点了，睡了，争取一天搞定 svelte 和 svelte kit 吧



### Text inputs

绑定一个 input 框的输入可以这么绑定

App.svelte

```svelte
<input bind:value={name}>
```

不使用 on:input，因为太麻烦了



### 数值输入

App.svelte

```svelte
<label>
	<input type="number" bind:value={a} min="0" max="10" />
	<input type="range" bind:value={a} min="0" max="10" />
</label>
```

意思就是 DOM 中的值全部是 string，这里绑定的 type 可以被 svelte 自动转换为 number，更加方便

coerce /kəʊˈɜːs/ 强迫，迫使；胁迫，这里应该是指的强制转换



### Checkbox inputs

这里可以这么绑定，yes 这个变量会变成一个布尔值，这几个的预期都和 Vue 差不多

App.svelte

```svelte
<input type="checkbox" bind:checked={yes}>
```



### Selected Bindings

需要注意的是，在绑定初始化之前（即在组件挂载时发生），selected将为未定义。因此，在模板中在确保已初始化selected的情况下，不应尝试访问selected的属性（如selected.id）



### Group inputs

有多个 input 想要绑定同一个值的时候用，vue 里面没有这个东东

App.svelte

```svelte
<input
	type="radio"
	name="scoops"
	value={number}
	bind:group={scoops}
/>
```



### 多项选择

一个 `<select>` 元素可以有一个 `multiple` 属性，这种情况下它将填充一个数组而不是选择单个值

App.svelte

```svelte
<h2>Flavours</h2>

<select multiple bind:value={flavours}>
	{#each ['cookies and cream', 'mint choc chip', 'raspberry ripple'] as flavour}
		<option>{flavour}</option>
	{/each}
</select>
```



### Textarea

可以省略一下写法

App.svelte

```svelte
<textarea bind:value={value}></textarea>
```

In cases like these, where the names match, we can also use a shorthand form:

App.svelte

```svelte
<textarea bind:value></textarea>
```



### onMount

emmm。。生命周期，Vue3 里面这个叫 onMounted

在组件挂载完毕后执行，和 Vue3 相似



### beforeUpdate and afterUpdate

更新前和更新后执行代码



### tick

这个和 Vue3 的 nextTick 也很像。。作用几乎是一样的

总结一下

Svelte 的生命周期主要包括四个函数：`onMount`、`beforeUpdate`、`afterUpdate` 和 `onDestroy`

这几个看起来都和 Vue 差不多

Svelte 还有一个特殊的生命周期函数 `tick`，它可以在任何时候被调用，除了组件首次初始化时

`tick` 返回一个 promise，该 promise 在任何待处理的状态更新后立即解析

Svelte 的页面渲染主要通过服务器端渲染 (SSR) 和客户端渲染 (CSR) 完成。默认情况下，SvelteKit 会首先在服务器上渲染（或预渲染）任何组件，并将其作为 HTML 发送到客户端。

然后，它会在浏览器中再次渲染组件，使其在一个称为混合的过程中变得交互式

与 Vue3 相比，Svelte 和 Vue3 在生命周期函数上有一些相似之处。

但是，Vue3 的生命周期函数是基于 Vue 的响应式系统，而 Svelte 的生命周期函数是基于 Svelte 的反应性更新模型



### 可写存储 (writable stores)

用在组件之间传数据的，和 Vue 工具链中的 Pinia 用法差不多



### 自动订阅（Auto-subscription）

官方的描述是上面那个 `writable stores` 要是不销毁的话多次创建会造成内存泄漏

一般的做法是使用 `onDestroy` 这个生命周期函数进行销毁，但是太麻烦了

所以 svelte 给了一个简便的办法，只需要在这个 store 前面加上 $ 它就变成自动订阅了

App.svelte

```svelte
<script>
	import { count } from './stores.js';
</script>

<h1>The count is {$count}</h1>
```

需要注意两点

* 这个自动订阅可以在 `<script>` 和 markup 块中不限制的使用
* $ 开头的变量在 svelte 中是不允许自己创建的，这是一个保留字



### 只读存储（readable stores）

readable 的第一个参数是初始值，如果还没有初始值，可以是 null 或 undefined

第二个参数是一个启动函数，该函数接受一个设置回调并返回一个停止函数

当存储首次订阅时调用启动函数，当最后一个订阅者取消订阅时调用停止函数

stores.js

```javascript
export const time = readable(new Date(), function start(set) {
	const interval = setInterval(() => {
		set(new Date());
	}, 1000);

	return function stop() {
		clearInterval(interval);
	};
});
```



### Derived stores

派生存储，可以从一个 store 里面派生出一个新的 store，怎么感觉这很函数式。。因为它是没有副作用的，返回了一个 Monad



### Custom stores

自定义存储，可以在 store 被创建时解构出一个 set 和一个 update 函数，这两个函数可以更新和设置 store 的值

这之后可以自己定义操作这个 store 的函数，在其它地方使用的时候只需要调用就可以， avoid exposing `set` and `update`

stores.js

```javascript
function createCount() {
	const { subscribe, set, update } = writable(0);

	return {
		subscribe,
		increment: () => update((n) => n + 1),
		decrement: () => update((n) => n - 1),
		reset: () => set(0)
	};
}
```



### store binding

可以使用 bind 和 on 来绑定这个 store，玩法很简单

```svelte
<script>
	import { name, greeting } from './stores.js';
</script>

<h1>{$greeting}</h1>
<input bind:value={$name} />

<button on:click={() => $name += '!'}>
	Add exclamation mark!
</button>
```



好，到这里，Svelte 的基础就学完了



## Part2: Advanced Avelte

这部分看起来全部在介绍 Svelte 的各种库

### Motion

介绍了 svelte/motion 这个库的用法，应该是将动作变成流畅的动画的工具



### Transition

介绍了 svelte/transition 这个库的用法，效果似乎和 Vue3 的 Transition 组件差不多



### Animation

介绍了 svelte/transition 这个库的用法，字面意思，用起来看着似乎挺麻烦的



### Actions

tooltip 的案例挺实用的



### Advanced Bindings

这个看起来对于富文本编辑器挺有用，但是这玩意是坑

Elements with a `contenteditable` attribute support `textContent` and `innerHTML` bindings:

App.svelte

```svelte
<div bind:innerHTML={html} contenteditable />
```

each 绑定和媒体绑定用到再看

块级元素也多了几个绑定，可以这么玩

Every block-level element has `clientWidth`, `clientHeight`, `offsetWidth` and `offsetHeight` bindings:

App.svelte

```svelte
<div bind:clientWidth={w} bind:clientHeight={h}>
	<span style="font-size: {size}px" contenteditable>{text}</span>
	<span class="size">{w} x {h}px</span>
</div>
```

this 绑定，用到了再说，不急

绑定组件实例，这个给的案例是一个画板，这个有点用，因为有朋友喜欢你画我猜，到时候说不定用的上



### Classes and styles

这么玩的

App.svelte

```svelte
<button
	class="card {flipped ? 'flipped' : ''}"
	on:click={() => flipped = !flipped}
>
```

它还可以简写，给的示例是一个翻牌，感觉论坛的签到可以用上

App.svelte

```svelte
<button
	class="card"
	class:flipped
	on:click={() => flipped = !flipped}
>
```

style 也可以这么写

App.svelte

```svelte
<button
	class="card"
	style:transform={flipped ? 'rotateY(0)' : ''}
	style:--bg-1="palegoldenrod"
	style:--bg-2="black"
	style:--bg-3="goldenrod"
	on:click={() => flipped = !flipped}
>
```

对于组件的 styles，要是父组件要给子组件传一个 style，可以这么玩

App.svelte

```svelte
<div class="boxes">
	<Box --color="red" />
</div>
```

子组件只需要这么用

Box.svelte

```svelte
<style>
	.box {
		background-color: var(--color, #ddd);
	}
</style>
```



### Component Composition

插槽，用法是 `<solt/>`，和 Vue 一模一样

具名插槽。。。一模一样

slot fallbacks，插槽为空的时候显示，这么玩的，用一个括号括起来就行

Card.svelte

```svelte
<slot name="telephone">
    <i>(telephone)</i>
</slot>
```

插槽传参，和 Vue 差不多

检测插槽内容，这个写法比较特殊，用到再说



### Context (setContext and get Context)

上下文 API 提供了一个组件之间进行“对话”的机制，而无需通过 props 传递数据和函数，或者分发大量事件

案例中是可以把父组件的函数给子组件用，看起来挺有用的



### Special Elements

特殊组件，似乎有一些奇奇怪怪的用法

`<svelte:self>`，允许这个组件递归嵌套自己

`<svelte:component>`，这个组件可以变成任何组件（我去，模仿者）

`<svelte:element>`，这个组件可以变成任何 DOM 元素（我直接 createElement 怎么说）

`<svelte:window>`，window 对象（这个东东似乎是 SSR-friendly 和 Self-clear listener 的）

`<svelte:body>`，好好好，body 也出来了，还有案例里这只猫猫是什么鬼！吓我一跳！

`<svelte:document>`，页面上所有的 Document

`<svelte:head>`，操作 head  的，似乎可以用在 SSR

`<svelte:options>`，指定 svelte 的编译器选项的，我去，这么高级

`<svelte:fragment>`，看起来和 React 的 Fragment 差不多



### Module Context

比较迷，碰到再说

这个 export 倒是挺有用，可以在 `svelte` 文件里面使用其它 `svelte` 文件 `script` 标签里面写的函数，这个和 Vue 不一样了



### Miscellaneous

杂项，可以使用 `{@debug ...}` 这个东东来触发 debug



## 芜湖！Congratulations!

You've now finished the Svelte tutorial and are ready to start building！

The next two parts of the tutorial will focus on SvelteKit, a full-fledged framework for creating apps of all shapes and sizes.

If you're suffering from information overload and aren't ready to go through the SvelteKit tutorial yet, don't worry! You can use your existing Svelte knowledge without learning all of SvelteKit. Just run this in your terminal and follow the prompts...

```bash
npm create svelte@latest
```

...and start editing `src/routes/+page.svelte`. When you're ready, click the link below to continue your journey.

Hooray!