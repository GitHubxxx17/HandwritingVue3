export const enum ShapeFlags {
  // 表示组件是一个元素节点
  ELEMENT = 1,
  // 表示组件是一个函数式组件
  FUNCTIONAL_COMPONENT = 1 << 1,
  // 表示组件是一个有状态的组件
  STATEFUL_COMPONENT = 1 << 2,
  // 表示组件的子节点是文本节点
  TEXT_CHILDREN = 1 << 3,
  // 表示组件的子节点是数组
  ARRAY_CHILDREN = 1 << 4,
  // 表示组件的子节点是插槽
  SLOTS_CHILDREN = 1 << 5,
  // 表示组件是一个传送门组件
  TELEPORT = 1 << 6,
  // 表示组件是一个悬挂组件
  SUSPENSE = 1 << 7,
  // 表示组件应该保持活跃状态
  COMPONENT_SHOULD_KEEP_ALIVE = 1 << 8,
  // 表示组件已经保持活跃状态
  COMPONENT_KEPT_ALIVE = 1 << 9,
  // 表示组件是一个组件（有状态组件或函数式组件）
  COMPONENT = ShapeFlags.STATEFUL_COMPONENT | ShapeFlags.FUNCTIONAL_COMPONENT,
}
