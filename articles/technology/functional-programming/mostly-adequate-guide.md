# Mostly adequate guide to FP 摸鱼笔记

## 介绍

下面的文字都是针对于 [Mostly adequate guide](https://github.com/MostlyAdequate/mostly-adequate-guide) 这本书的一些笔记或者 ~~发电~~

偶然间在 GitHub 主页看见这本书, 就想着学一学, 感觉非常有意思

本书可以在线阅读, 地址为

https://mostly-adequate.gitbook.io/mostly-adequate-guide

为了方便起见, 下面的代码几乎都使用 TypeScript 或者 JavaScript 举例子

## Chapter 01: What Ever Are We Doing?

可变状态（mutable state）

比如使用 let 声明变量, 一般我是一律 const, 除非有时候万不得已

无限制副作用（unrestricted side effects）

暂时不理解, 暂时想的是控制输入流和输出流的属性是否一致

无原则设计（unprincipled design）

项目符合一定的规范不然不好维护

## Chapter 02: First Class Functions

好多废话, 要点就是这样写

``` js
// 如果把这个
httpGet('/post/2', json => renderPost(json));

// 改成这样
httpGet('/post/2', (json, err) => renderPost(json, err));

// 每个地方都改一下很麻烦, 所以要这样
httpGet('/post/2', renderPost);
```

> I must mention that, just like with Object-Oriented code, you must be aware of this coming to bite you in the jugular. If an underlying function uses this and we call it first class, we are subject to this leaky abstraction's wrath.

总之不用 this 就可以, 我的项目里面一个 this 都没有, 全部箭头函数

``` js
const fs = require('fs');

// scary
fs.readFile('freaky_friday.txt', Db.save);

// less so
fs.readFile('freaky_friday.txt', Db.save.bind(Db));
```

## Chapter 03: Pure Happiness with Pure Functions

Pure Happiness 是什么东东, 纯乐观吗

> A pure function is a function that, given the same input, will always return the same output and does not have any observable side effect.

### returns the same output per input every time

纯函数, 相同的输入永远返回相同的输出

``` js
const xs = [1,2,3,4,5];

// pure
xs.slice(0,3); // [1,2,3]

xs.slice(0,3); // [1,2,3]

xs.slice(0,3); // [1,2,3]


// impure
xs.splice(0,3); // [1,2,3]

xs.splice(0,3); // [4,5]

xs.splice(0,3); // []
```

这个意思就是 slice 这个东东用了之后不会改变原数组, splice 用了之后就把原数组改变了

用了莲之后不改变莲的才是 ___ 纯的, 嗯, 纯就是美好

### reliance upon system complexity

纯函数, 不依赖外部变量, 也不改变外部变量

如果把函数看作是一个房子, 莲在房子里是只会被我使用的, 如果放在外边就, 我***

然后我的房子也只和莲有关, 太纯爱了

``` js
// impure
let minimum = 21;
const checkAge = age => age >= minimum;

// pure
const checkAge = (age) => {
  const minimum = 21;
  return age >= minimum;
};
```

总结一下, 函数要用到的变量都往函数里面放, 不要放在外面, 函数也不要依赖外部变量, 自给自足

### Side effect

> A side effect is a change of system state or observable interaction with the outside world that occurs during the calculation of a result.

这个我已经理解的差不多了, 比如说和莲结婚是好事, 但是结婚之后肾开支提高就是坏事

> Any interaction with the world outside of a function is a side effect, which is a fact that may prompt you to suspect the practicality of programming without them. The philosophy of functional programming postulates that side effects are a primary cause of incorrect behavior.

函数式编程的哲学就是, 假定副作用是造成不正确行为的主要原因

但是这并不是说要禁止一切副作用，而是要让它们在可控的范围内运行

### the same output per input

相同的输入, 相同的输出

莲和我住一晚上, 莲还是莲, 不能变成智乃, 嗯

> A function is a special relationship between values: Each of its input values gives back exactly one output value.

这是函数的定义, 每个输入只有一个输出, 不同的输入可以有相同的输出

> Pure functions are mathematical functions and they're what functional programming is all about

纯函数就是数学上的函数, 我们说的函数式编程就是在讲这个

### Cacheable

可缓存性, 纯函数总可以缓存输入

``` js
const memoize = (f) => {
  const cache = {};

  return (...args) => {
    const argStr = JSON.stringify(args);
    cache[argStr] = cache[argStr] || f(...args);
    return cache[argStr];
  };
};

const squareNumber = memoize(x => x * x);

squareNumber(4); // 16

squareNumber(4); // 16, returns cache for input 4

squareNumber(5); // 25

squareNumber(5); // 25, returns cache for input 5
```

哭了, 这函数写的也太巧妙了

可以通过延迟执行的方式把不纯的函数转换为纯函数, 例如

``` js
var pureHttpCall = memoize(function(url, params){
  return function() { return $.getJSON(url, params); }
});
```

### Portable / Self-Documenting

这个 `Self-Documenting` 可以理解为信息可见的, 就是说这个函数使用的变量, 产生的行为都是便于观察到的

``` js
// impure
const signUp = (attrs) => {
  const user = saveUser(attrs);
  welcomeUser(user);
};

// pure
const signUp = (Db, Email, attrs) => () => {
  const user = saveUser(Db, attrs);
  welcomeUser(Email, user);
};
```

这个强调了 signUp 这个函数不会在你不知道的情况下使用 Db, saveUser 也是同理

上面提到了 cognitive load, 这里这个行为也有助于降低认知负担

### serializing

> In a JavaScript setting, portability could mean serializing and sending functions over a socket. It could mean running all our app code in web workers. Portability is a powerful trait.

这句话感觉很难理解, 我认为大概在说这些点

1. 可移植性: 能够将函数序列化并通过网络发送

序列化一般可以用 `JSON.stringify()` 来做到, 或者 `superjson` 之类的东东

但是 JSON 格式只能存储基本数据类型, 函数不是基本类型

可以通过 Function.toString() 来直接传递函数的字符串, 然后传递之后 eval 执行 (怎么听起来这么灵车)

但是如果一个函数不是纯函数, 序列化一个函数之后, 这个函数用到的外部依赖不能被序列化进这个字符串中, 那么这个序列化就是失败的, 也就是说这个函数是无法通过序列化的方式在互联网中传递的, 也是就是降低了可移植性

我不知道这个玩意是不是和 RPC 有关, 但是这辈子我都不会碰 tRPC 了

### Testable

就是说测试的时候不用配一大堆环境, 我平时很少写测试, 不看这个了

### Reasonable

> Many believe the biggest win when working with pure functions is referential transparency. A spot of code is referentially transparent when it can be substituted for its evaluated value without changing the behavior of the program.

这里提到了一个 `referential transparency (引用透明)`, 如果代码可以替换为它执行得到的结果, 而且是在不改变整个程序行为的前提下替换的, 那么这个代码就是引用透明的

``` js
const { Map } = require('immutable');

// Aliases: p = player, a = attacker, t = target
const jobe = Map({ name: 'Jobe', hp: 20, team: 'red' });
const michael = Map({ name: 'Michael', hp: 20, team: 'green' });
const decrementHP = p => p.set('hp', p.get('hp') - 1);
const isSameTeam = (p1, p2) => p1.get('team') === p2.get('team');
const punch = (a, t) => (isSameTeam(a, t) ? t : decrementHP(t));

punch(jobe, michael); // Map({name:'Michael', hp:19, team: 'green'})
```

就是说今年的莲是 C 罩杯, 明年后年的莲也是 C 罩杯, 那么可以把后年的莲拿来今年用, 这是效果相同的

好吧是我太牵强了, 不过我好喜欢莲, 呜呜呜呜呜呜

### equational reasoning

姑且理解为恒等推导, 大概就指的是把上面的函数, 在已知它的运行结果的情况下, 将函数的过程图替换为结果

``` js
const punch = (a, t) => (a.get('team') === t.get('team') ? t : decrementHP(t));

const punch = (a, t) => ('red' === 'green' ? t : decrementHP(t));

const punch = (a, t) => decrementHP(t);
```

花里胡哨的

### Parallel Code

讲的是由于纯函数不依赖外部环境, 所以不会发生任何 race condition

## Chapter 04: Currying

这个东东似乎是被叫做柯里化, 嗯。。。咖喱化？

> The concept is simple: You can call a function with fewer arguments than it expects. It returns a function that takes the remaining arguments.

这里提到柯里化的概念就是

> 用比预期更少的参数来调用它, 然后让它返回一个函数来处理剩下的参数

哭了, 这章的练习题网站直接加载不出来

``` js
// Exercise 1
//==============

var words = split(' ');

// Exercise 1a
//==============

var sentences = map(words);


// Exercise 2
//==============

var filterQs = filter(match(/q/i));


// Exercise 3
//==============
// Use the helper function _keepHighest to refactor max

var _keepHighest = function(x,y){ return x >= y ? x : y; }; // <- leave be

var max = reduce(_keepHighest, -Infinity);


// Bonus 1:
// ============
// wrap array's slice to be functional and curried.
// //[1,2,3].slice(0, 2)
var slice = _.curry(function(start, end, xs){ return xs.slice(start, end); });


// Bonus 2:
// ============
// use slice to define a function "take" that takes n elements. make it curried
var take = slice(0);
```

这里作者说

> Currying is handy and I very much enjoy working with curried functions on a daily basis

我为什么没有这种感觉(?)

## Chapter 05: Coding by Composing

emmm, 姑且理解为组合式代码, Nuxt3 目录里的 `composable` 是不是就是干这个的, Vue3 的 Composition Api 是不是也是这个东东

好吧实际上有点关系也不是, 这里说的是函数的可组合性, 大概就是纯函数可以在保持纯函数的条件下进行组合, 组合后得到的新函数还是纯函数

``` js
const toUpperCase = x => x.toUpperCase();
const exclaim = x => `${x}!`;
const shout = compose(exclaim, toUpperCase);

shout('send in the clowns'); // "SEND IN THE CLOWNS!"
```

高级套娃, 作者写的是函数饲养 (Functional Husbandry), 嗯。。。生孩子！





