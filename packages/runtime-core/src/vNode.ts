import { ShapeFlags, isArray, isObject, isString } from "@vue/shared";
import { vnode } from "../types/global";

export /**
 * 创建虚拟dom
 * @param {*} type 组件类型 app
 * @param {*} props 组件配置
 * @param {*} [children=null] 子节点
 * @return {vnode}
 */
const createVNode = (type: any, props: any, children: any = null): vnode => {
  //区分元素和组件
  let shapeFlag = isString(type)
    ? ShapeFlags.ELEMENT
    : isObject(type)
    ? ShapeFlags.STATEFUL_COMPONENT
    : 0;
  //创建vnode
  const vnode: vnode = {
    _v_isVnode: true, //是否为虚拟dom
    type, //组件类型
    props, //组件配置
    children, //子节点
    key: props?.key, //组件标识
    component: {}, //组件
    shapeFlag, //判断组件类型标识
  };
  normalizeChildren(vnode, children);
  return vnode;
};

/**
 * 标识子节点类型
 * @param {vnode} vnode 虚拟dom
 * @param {*} children 子节点
 */
function normalizeChildren(vnode: vnode, children: any) {
  let type = 0;
  if (!children) {
  } else if (isArray(children)) {
    type = ShapeFlags.ARRAY_CHILDREN;
  } else {
    type = ShapeFlags.TEXT_CHILDREN;
  }

  vnode.shapeFlag = vnode.shapeFlag | type;
}

export /**
 * 判断是否为虚拟dom
 * @param {*} vnode
 */
const isVNode = (vnode: any) => vnode._v_isVnode;

//文本节点类型
export const TEXT = Symbol("text");

export /**
 * 创建文本虚拟节点
 * @param {*} child
 * @return {*}  {vnode}
 */
const CVnode = (child: any): vnode => {
  if (isObject(child)) return child;
  return createVNode(TEXT, null, String(child));
};
