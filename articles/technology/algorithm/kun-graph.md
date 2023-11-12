# Graph (图)

## 什么是图？

如果说允许某个二叉树之间的节点全部随意连接或者断开，那么这就是一个图。



## 什么是 E, V，什么是 G 本身

E: *edges* 

V: *vertices* 

> where *V* is a set whose elements are called *vertices* (singular: vertex), and *E* is a set of paired vertices, whose elements are called *edges* (sometimes *links* or *lines*).

[Graph Wikipedia](https://en.wikipedia.org/wiki/Graph_(discrete_mathematics))



## 为什么 graph 的数据结构是这个样子

```cpp
class Node {
public:
    int val;
    vector<Node*> neighbors;
}
```



它的本质就是一个 Node，这个 Node 周围有与它相同的 Node neighbors，这个  vector<Node*> neighbors 就表示与这个 Node 相邻的其它 Node 的 vector，对于 cpp 来说，它是存储相邻节点的指针

我们可以类比二叉树的数据结构

```cpp
// binary tree
class TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
}

// N-ary tree
class NaryTreeNode {
    int value; 
    vector<NaryTreeNode*> children;
}
```



## 我们还可以知道的是

### 邻接表

邻接表就是把刚才的 Node 的 neighbors 存在一个列表里，然后把这个列表和这个 Node 关联起来，这就是邻接表

### 邻接矩阵

邻接矩阵实质就是一个 `bool[][]`，它做的是把相邻的 Node 在矩阵中的交叉点值设为真，这就是邻接矩阵

### 我们可以比较的是

显然，对于一个邻接矩阵，要查找某两个 Node 是否相邻，只需要判断 `graph[x][y]` 是否为真就可以，速度极快

而，对于一个邻接表，要查找某两个 Node 是否相邻，要遍历其中一个 Node 对应的列表中是否有两外一个 Node 的值，效率上不如邻接矩阵

### 连通图 & 非连通图？

任意两个 Node 之间都存在连接的就是连通图，非则非莲图

### 有向加权图？

上面的实现实际上是个有向图，所谓的权重就是某个 Node 到另外一个 Node 所需的 `代价`，不可到达则代价为 ∞，Node 到本身代价为 0

有向图还有 `入度` 和 `出度` 的概念，就是 a -> b，那么 a 就是 b 的入度，b 就是 a 的出度

实现加权图只需要将刚才的 `bool[][]` 变为 `int[][]` 就可以了，如果这个矩阵某处为 0，那么就代表这两点是不连通的，`graph[x][y]` 就是这两个 Node 之间的 `权重`

### 成环？

有向图中可能存在环，那么对有向图构造一个 Node 的拓扑序列，如果图的所有 Node 都在这个序列中，那么这个图是有向无环图

### 无向图？

把刚才的 `graph[x][y]` 和 `graph[y][x]` 都变为 true 就可以，那么这两个 Node 之间就相互连接了

邻接表表示法也是这样，在对应的 Node 列表里添加其它 Node 就可以

### 如何遍历图？

在上面提到了图就是一个二叉树随意连接的产物，那么我们可以考虑多叉数的遍历

```typescript
const traverse = (treeNode: TreeNode) => {
    if (!TreeNode) {
        return
    }
    
    for (const neighbor of treeNode.children) {
        traverse(neighbor)
    }
}
```

用这个遍历图的话，会产生的问题是产生闭环，可以使用一个 `visited` 数组解决这个问题，在遍历时记录哪个 Node 被访问过了，然后就不用访问了，返回访问其它节点，类似于回溯

```typescript
// dfs
type Graph = Record<string, string[]>
const dfs = (graph: Graph, node: string, visited: Record<string, boolean>) => {
    if (!node || visited[node]) {
        return
    }
    
    visited[node] = true
    
    console.log(node)
    for (const neighbor of graph[node]) {
        dfs(graph, neighbor, visited);
    }
}
```

需要注意的是，这里我们的 console.log 是在 for 循环外部的，这关注的是 Node 的 value 本身，如果将 console.log 放在 for 循环内部，那么这关注的是 Node 的 child，也就是 path 问题，这就变成回溯算法了

bfs 是从起始 Node 开始逐层访问其它相邻节点，本质还是树的问题，可以使用 bfs 求两个 Node 之间的最短路径



## Q1: 已知邻接矩阵，构造图并返回根节点

这个图是一个有向图，没有入度的 Node 就是它的 rootNode

```typescript
class GraphNode {
  val: number
  neighbors: GraphNode[]

  constructor(val?: number, neighbors?: GraphNode[]) {
    this.val = val === undefined ? 0 : val
    this.neighbors = neighbors === undefined ? [] : neighbors
  }
}

class Graph {
  nodes: GraphNode[]

  constructor(adjacencyMatrix: number[][]) {
    const numNodes = adjacencyMatrix.length
    this.nodes = []

    // create node
    for (let i = 0; i < numNodes; i++) {
      this.nodes.push(new GraphNode(i))
    }

    // link node
    for (let i = 0; i < numNodes; i++) {
      for (let j = 0; j < numNodes; j++) {
        if (adjacencyMatrix[i][j] === 1) {
          this.nodes[i].neighbors.push(this.nodes[j])
        }
      }
    }
  }

  findRootNode(): GraphNode | null {
    for (const node of this.nodes) {
      if (this.isRoot(node)) {
        return node
      }
    }
    return null
  }

  isRoot(node: GraphNode): boolean {
    for (const otherNode of this.nodes) {
      if (otherNode.neighbors.includes(node)) {
        return false
      }
    }
    return true
  }
}

const adjacencyMatrix: number[][] = [
  [0, 0, 0, 0],
  [1, 0, 0, 0],
  [0, 1, 0, 0],
  [0, 0, 1, 0],
]

const noRootAdjacencyMatrix: number[][] = [
  [0, 0, 0, 1],
  [1, 0, 0, 0],
  [0, 1, 0, 0],
  [0, 0, 1, 0],
]

const graph = new Graph(adjacencyMatrix)
// const graph = new Graph(noRootAdjacencyMatrix)
const rootNode = graph.findRootNode()

if (rootNode) {
  console.log('Root Node! ', rootNode.val)
} else {
  console.log('No root node! ')
}
```

output

Root Node!  3

No root node! 



## Q2: 根据某个图的根节点构造一个邻接矩阵

我们直接用上面创建好的图

```typescript
const dfsCountNodes = (rootNode: GraphNode) => {
  const visited = new Set<GraphNode>()
  const stack = [rootNode]

  while (stack.length) {
    const currentNode = stack.pop()

    if (!currentNode) {
      break
    }

    visited.add(currentNode)

    for (const neighbor of currentNode.neighbors) {
      if (!visited.has(neighbor)) {
        stack.push(neighbor)
      }
    }
  }

  return visited.size
}

const createAdjacencyMatrix = (rootNode: GraphNode | null): number[][] => {
  if (!rootNode) {
    return []
  }

  // Method1: calculate node sum ,because this.nodes.push(new GraphNode(i))
  // const numNodes = rootNode.val + 1
  const adjacencyMatrix: number[][] = []

  // Method2: calculate node sum
  const numNodes = dfsCountNodes(rootNode)

  // initialize
  for (let i = 0; i < numNodes; i++) {
    adjacencyMatrix.push(Array(numNodes).fill(0))
  }

  const dfs = (node: GraphNode) => {
    for (const neighbor of node.neighbors) {
      adjacencyMatrix[node.val][neighbor.val] = 1
      dfs(neighbor)
    }
  }

  dfs(rootNode)

  return adjacencyMatrix
}

console.table(adjacencyMatrix)
console.table(createAdjacencyMatrix(rootNode))
```

这里我们上面在创造图的时候使用了 this.nodes.push(new GraphNode(i))，因此 root Node 的 val + 1 就是 Node 的总数

倘若我们不使用 i 来作为默认值，使用其他值来作为图的权重，我们可以使用一个 dfs 来计算图的 Node 个数，这是 Method2



## Q3: 求某个图任意两节点的最短距离

这个问题我们可以使用 bfs 处理

为什么 bfs 可以解决最短路径问题？

* bfs 的原理是从 root Node 的层面逐层遍历，逐渐扩散至更远的 Node
* 这种方法意味着，当首次遍历 Node 到达 endNode 时距离是最短的

```typescript
class GraphNode {
  val: number
  neighbors: GraphNode[]

  constructor(val?: number, neighbors?: GraphNode[]) {
    this.val = val === undefined ? 0 : val
    this.neighbors = neighbors === undefined ? [] : neighbors
  }
}

class Graph {
  nodes: GraphNode[]

  constructor(adjacencyMatrix: number[][]) {
    const numNodes = adjacencyMatrix.length
    this.nodes = []

    // create node
    for (let i = 0; i < numNodes; i++) {
      this.nodes.push(new GraphNode(i + 1))
    }

    // link node
    for (let i = 0; i < numNodes; i++) {
      for (let j = 0; j < numNodes; j++) {
        if (adjacencyMatrix[i][j] === 1) {
          this.nodes[i].neighbors.push(this.nodes[j])
        }
      }
    }
  }

  findNodeByValue(value: number): GraphNode | null {
    for (const node of this.nodes) {
      if (node.val === value) {
        return node
      }
    }
    return null
  }
}

const adjacencyMatrix: number[][] = [
  [0, 1, 0, 0],
  [1, 0, 1, 0],
  [1, 1, 0, 0],
  [0, 0, 1, 0],
]

const graph = new Graph(adjacencyMatrix)

const minDistance = (
  startNode: GraphNode | null,
  endNode: GraphNode | null
) => {
  if (!startNode || !endNode) {
    return -1
  }

  if (startNode === endNode) {
    return 0
  }

  const queue = [startNode]
  const visited = new Set<GraphNode>()
  visited.add(startNode)

  let distance = 0

  while (queue.length) {
    const size = queue.length

    for (let i = 0; i < size; i++) {
      const currentNode = queue.shift()

      if (!currentNode) {
        return
      }

      for (const neighbor of currentNode.neighbors) {
        if (neighbor === endNode) {
          return distance + 1
        }

        if (!visited.has(neighbor)) {
          visited.add(neighbor)
          queue.push(neighbor)
        }
      }
    }

    distance++
  }

  return -1
}

const node2 = graph.findNodeByValue(1)
const node1 = graph.findNodeByValue(3)

const distance =
  minDistance(node1, node2) === -1
    ? minDistance(node2, node1)
    : minDistance(node1, node2)

if (distance === -1) {
  console.log('The two nodes are not reachable')
} else {
  console.log(`The shortest distance is: ${distance}`)
}
```



我们还可以用 Dijkstra 等算法实现两点最短路径，它适用于有权重的有向图，它不适用于无向图和无负权的有向图，然而 bfs 是适合无向图的

如果要找出所有 Node 之间的最短路径，我们可以使用 Floyed 算法，它的思想上试探每一个 Node，从任意两个 Node 之间所有可能存在的路径中选出一条最短的路径


## 感谢真红姐姐的指导

感谢[真红姐姐](https://nkd.red)出题及指导，给我思考问题的机会，[GitHub Repo](https://github.com/KUN1007/shinnku-algorithm)

肯定还有不对或者尚待改进的地方，欢迎联系我指出我的错误，大家的每一次纠错都是对我的最大帮助，谢谢
