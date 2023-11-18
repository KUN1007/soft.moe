# 树与图

## 什么是树？

上次说到如果允许某个二叉树之间的节点全部随意连接或者断开，那么这就是一个图。

那么一个全连接、无环、且具有根节点的图就是树。

空图满足树的一切条件，所以空图也是树



## 什么是二分图

性别男女分，允许后宫不允许同性恋就是二分图

[二分图不存在长度为奇数的环](https://oi-wiki.org/graph/bi-graph/)，二分图本质上就是一种不存在奇数环的图

空图依然是二分图



## Q1: 给你一图的 root 节点，判断这个图是否为树

我们只需要判断其是否连通且无环

需要注意的是，树的 `neighbor` 不能是自己的 `parent`, 否则会陷入死循环

```typescript
const isTree = (rootNode: GraphNode | null): boolean => {
  if (!rootNode) {
    // Empty graph is a tree
    return true
  }

  const visited: Set<GraphNode> = new Set()

  const dfs = (node: GraphNode | null, parent: GraphNode | null): boolean => {
    if (!node) {
      return true
    }

    if (visited.has(node)) {
      return false
    }

    visited.add(node)

    for (const neighbor of node.neighbors) {
      if (neighbor !== parent && !dfs(neighbor, node)) {
        return false
      }
    }

    return true
  }

  return dfs(rootNode, null) && visited.size === countNodes(rootNode)
}

const countNodes = (node: GraphNode | null): number => {
  if (!node) {
    return 0
  }

  let count = 1

  for (const neighbor of node.neighbors) {
    count += countNodes(neighbor)
  }

  return count
}
```



## Q2: 给你一个 root 节点，判断是否为二分图

染色法，本质就是判断环是否为奇数

bfs 每一层的颜色不同就是二分图

染成与当前节点不同的颜色，把 0 变成 1，1 变成 0，并将其放入队列中就可以

```typescript
const isBipartite = (rootNode: GraphNode | null): boolean => {
  if (!rootNode) {
    // Empty graph is a bipartite
    return true
  }

  const colors: Map<GraphNode, number> = new Map()
  const queue: GraphNode[] = []

  queue.push(rootNode)
  colors.set(rootNode, 0)

  while (queue.length > 0) {
    const node: GraphNode = queue.shift() as GraphNode
    const currentColor: number = colors.get(node) as number

    for (const neighbor of node.neighbors) {
      if (!colors.has(neighbor)) {
        colors.set(neighbor, 1 - currentColor)
        queue.push(neighbor)
      } else if (colors.get(neighbor) === currentColor) {
        return false
      }
    }
  }

  return true
}
```



## Q3: 什么是欧拉图，什么是哈密顿图



### **欧拉回路**

通过图中每条边恰好一次的回路

### **欧拉图**

具有欧拉回路的图

[一笔画问题](https://zh.wikipedia.org/zh-hans/%E4%B8%80%E7%AC%94%E7%94%BB%E9%97%AE%E9%A2%98)

### 哈密顿通路

哈密顿路径是一条路径，恰好经过图中的每个节点一次且仅一次

与欧拉回路不同的是，这条路径会经过图中的所有节点，但不要求经过每条边。

### 哈密顿图

有哈密顿回路的图

寻找一个图中的哈密顿通路是一个 NP-完全问题

## 感谢真红姐姐的指导

感谢[真红姐姐](https://nkd.red)出题及指导，给我思考问题的机会，[GitHub Repo](https://github.com/KUN1007/shinnku-algorithm)

肯定还有不对或者尚待改进的地方，欢迎联系我指出我的错误，大家的每一次纠错都是对我的最大帮助，谢谢