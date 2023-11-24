/** 虚拟节点 */
export type vnode = {
  /** 是否为虚拟dom */
  _v_isVnode: boolean;
  /** 组件类型 */
  type: any;
  /** 组件配置 */
  props: any;
  /** 子节点 */
  children: any;
  /** 组件标识 */
  key: string | number;
  /** 组件 */
  component: any;
  /** 判断组件类型标识 */
  shapeFlag: number;
  /** 元素 */
  el?: any;
};

/** 组件实例 */
export type instance = {
  /* 虚拟节点 */
  vnode: vnode;
  /* 组件类型 */
  type: any;
  /* 组件属性 */
  props: any;
  /* 所有属性 */
  attrs: any;
  /* setup返回值 */
  setupState: any;
  /* 上下文对象 */
  ctx: any;
  /* 代理 */
  proxy: any;
  /* 挂载状态 */
  isMounted: boolean;
  /* 渲染函数 */
  render: any;
  /** 子节点 */
  children?: any;
  /** 插槽 */
  slots?: any;
};
