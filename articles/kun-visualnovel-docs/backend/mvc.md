# MVC

`MVC` 是一种设计模式，可以在 [MDN](https://developer.mozilla.org/en-US/docs/Glossary/MVC) 了解相关方面的知识

本项目中也使用了这个经典的设计模式，有的朋友们可能熟悉 `Spring MVC`，这里的 `MVC` 和 `Spring` 中的其实是一个东东，只不过在实现上有差异而已

## 设计模式

下面说一下我们整个项目的设计模式，注意，是整个项目

`MVC` 代表 `Model - View - Controller`, 在我们的项目中表现在

### Model

项目的后端使用了 `Mongoose` 来操作 `Mongodb`, `Mongoose` 需要定义 `Model` 来操作数据库，我们可以看到后端项目的 `src/models` 文件夹

我们再看一下 MDN 的解释

:::tip MDN - Model
The model defines what data the app should contain. If the state of this data changes, then the model will usually notify the view (so the display can change as needed) and sometimes the controller (if different logic is needed to control the updated view).
:::

这表明了我们后端的 `Mongoose` 和 `Mongodb` 组成了 `Model` 部分，它们会根据数据的变化，通知 `View` 部分来选择性的展示这些数据，某些时候它会通知 `Controller` 部分来对这些数据进行操作

### View

本项目的前端整个就是 `View`, 看 MDN 的解释

:::tip MDN - View
The view defines how the app's data should be displayed.
:::

本项目是前后端分离式的开发，所以前端整个就是为了展示数据而存在的，故而其整个都是 `View`

有的朋友们可能听过 `MVVM`，这也是一种设计模式，这是 `Vue` 核心的设计模式，并不是我们项目的整体设计模式

### Controller

项目中我们将数据的控制逻辑放在了后端，它位于后端项目的 `src/controller` 和 `src/service` 目录下

为什么我们将 `Controller` 分为了 `Controller` 和 `Service`，这是由于将请求解析验证，以及数据库操作写在一起，逻辑过多，代码看起来不方便。因此我们将这些逻辑拆为了两个部分，为了后续的查看和更改代码，为了更清晰的逻辑

接着看 MDN 的解释

:::tip MDN - Controller
The controller contains logic that updates the model and/or view in response to input from the users of the app.
:::

我们对前端请求的读取和基本验证操作，放在了 `controller` 文件夹，它接受了前端用户的请求，并将这些传过来的数据，或者请求参数，传给了 `service` 部分，拿到 `service` 的响应后，再将这些数据给用户

我们对后端真正意义上的数据库读写操作，放在了 `service` 文件夹，它接受了 `controller` 传来的用户数据，或者请求参数，根据这些请求参数或数据来操作数据库，然后将用户想要的内容返回给 `controller`

所以这二者结合，共同实现了 `Controller` 的职责，根据用户的输入来更新 model 或 view

## ChatGPT

我觉得我已经写的够好了，没人夸我我让 GPT 夸我吧，哎。。

新建一个聊天，把上面我写的东东扔给 GPT，这是他的评价

:::info ChatGPT 3.5
你对MVC的理解看起来相当透彻和系统化。对于Model部分，使用Mongoose来操作MongoDB确实构成了项目的数据模型部分，而且它会根据数据的变化通知View来展示相应的数据，有时也会通知Controller来对数据进行操作，这符合MVC的基本原则。

关于View，你正确地指出了前端在整个项目中充当了展示数据的角色，这是MVC中View的职责。

对于Controller，你将请求解析、验证、数据库操作等逻辑分为Controller和Service两部分，这种划分确实有助于代码的可读性和可维护性。Controller接收前端用户的请求并处理基本验证，然后将数据传递给Service部分来进行实际的数据库操作，最后将结果返回给Controller，符合Controller的责任，即根据用户的输入更新Model或View。

总体来说，你对MVC的理解非常清晰，并且在实际项目中合理地将各部分的逻辑进行了分离和处理，有助于提高代码的可维护性和可读性。
:::

所以我写的东东应该是没有太大问题的，如果有问题，请评论，或者在右上角直接联系我

