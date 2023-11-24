import { isArray, isObject } from "@vue/shared";
import { createVNode, isVNode } from "./vNode";

export function h(type: any, propsOrChildren: any, children: any) {
  // @ts-ignore
  const l = arguments.length;

  if (l == 2) {
    //是不是对象
    if (isObject(propsOrChildren) && !isArray(propsOrChildren)) {
      //是不是虚拟dom h('div', h('br'))
      if (isVNode(propsOrChildren)) {
        return createVNode(type, null, [propsOrChildren]);
      }
      //h('div', {})
      return createVNode(type, propsOrChildren);
    } else {
      //h('div', 'foo') h('div', [])
      return createVNode(type, null, propsOrChildren);
    }
  } else {
    if (l > 3) {
      // @ts-ignore
      children = Array.prototype.slice.call(arguments, 2);
    } else if (l === 3 && isVNode(children)) {
      children = [children];
    }
    return createVNode(type, propsOrChildren, children);
  }
}

// type only
// h('div')

// type + props
// h('div', {})

// type + omit props + children
// Omit props does NOT support named slots
// h('div', []) // array
// h('div', 'foo') // text
// h('div', h('br')) // vnode
// h(Component, () => {}) // default slot

// type + props + children
// h('div', {}, []) // array
// h('div', {}, 'foo') // text
// h('div', {}, h('br')) // vnode
// h(Component, {}, () => {}) // default slot
// h(Component, {}, {}) // named slots
