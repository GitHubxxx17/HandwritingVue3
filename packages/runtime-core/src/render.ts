import { ShapeFlags } from "@vue/shared";
import { apiCreateApp } from "./apiCreateApp";
import { createComponentInstance, setupComponent } from "./components";
import { instance, vnode } from "../types/global";
import { effect } from "@vue/reactivity";
import { CVnode, TEXT } from "./vNode";

//实现渲染
export function createRender(renderOptionDom: any) {
  // 获取全部的DOM操作
  const {
    insert: hostInsert,
    remove: hostRemove,
    patchProp: hostPatchProp,
    createElement: hostCreateElement,
    createText: hostCreateText,
    createComment: hostCreateComment,
    setText: hostSetText,
    setElementText: hostSetElementText,
  } = renderOptionDom;

  /**
   *  渲染函数
   * @param {vnode} vNode
   * @param {*} container
   */
  const render = (vNode: vnode, container: any) => {
    //组件初始化
    console.log(vNode, container);
    //渲染dom
    patch(null, vNode, container);
  };

  /**
   * 合并对比前后虚拟dom并渲染dom节点
   * @param {vnode} n1 之前的虚拟dom
   * @param {vnode} n2 当前的虚拟dom
   * @param {*} container 挂载的容器
   */
  const patch = (n1: vnode | null, n2: vnode, container: any) => {
    //获取当前vnode标识
    let { shapeFlag, type } = n2;
    switch (type) {
      case TEXT:
        console.log("文本");
        processText(n1, n2, container);
        break;
      default:
        //如果当前dom为元素
        if (shapeFlag & ShapeFlags.ELEMENT) {
          console.log("元素");
          processElement(n1, n2, container);
        } //如果当前dom为组件
        else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          console.log("组件");
          //创建组件
          processComponent(n1, n2, container);
        }
        break;
    }
  };

  /**
   * 创建文本节点
   * @param {(vnode | null)} n1
   * @param {vnode} n2
   * @param {*} container
   */
  const processText = (n1: vnode | null, n2: vnode, container: any) => {
    if (!n1) {
      //创建文本节点并插入
      hostInsert((n2.el = hostCreateText(n2.children)), container);
    } else {
    }
  };

  /**
   * 创建元素
   * @param {vnode | null} n1 之前的虚拟dom
   * @param {vnode} n2 当前的虚拟dom
   * @param {*} container 挂载的容器
   */
  const processElement = (n1: vnode | null, n2: vnode, container: any) => {
    if (!n1) {
      //首次挂载元素
      mountElement(n2, container);
    } else {
      //更新元素
    }
  };

  /**
   * 挂载元素
   * @param {vnode} vnode
   * @param {*} container
   */
  const mountElement = (vnode: vnode, container: any) => {
    const { props, shapeFlag, type, children } = vnode;
    //创建元素
    let el = hostCreateElement(type);
    //添加属性
    if (props) {
      for (let [key, value] of Object.entries(props)) {
        hostPatchProp(el, key, null, value);
      }
    }

    //处理children
    if (children) {
      //如果children为文本
      if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
        //设置文本
        hostSetElementText(el, children);
        //如果children为数组
      } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        mountChildren(el, children);
      }
    }

    //挂载元素
    hostInsert(el, container);
  };

  /**
   * 挂载子节点
   * @param {*} el
   * @param {*} children
   */
  const mountChildren = (el: any, children: any) => {
    for (let i = 0; i < children.length; i++) {
      let child = CVnode(children[i]);
      patch(null, child, el);
    }
  };

  /**
   * 创建组件
   * @param {vnode | null} n1 之前的虚拟dom
   * @param {vnode} n2 当前的虚拟dom
   * @param {*} container 挂载的容器
   */
  const processComponent = (n1: vnode | null, n2: vnode, container: any) => {
    if (!n1) {
      //首次挂载组件
      mountComponent(n2, container);
    } else {
      //更新组件
    }
  };

  /**
   *  挂载组件
   * @param {vnode} InitialVnode 首次vnode
   * @param {*} container 容器
   */
  const mountComponent = (InitialVnode: vnode, container: any) => {
    //创建组件的实例对象
    const instance = (InitialVnode.component =
      createComponentInstance(InitialVnode));
    //解析数据到这个实现对象中
    setupComponent(instance);
    //创建一个effect让render函数执行
    setupRenderEffect(instance, container);
  };

  /**
   *  创建render的effect
   * @param {instance} instance
   */
  const setupRenderEffect = (instance: instance, container: any) => {
    effect(function componentEffect() {
      //首次挂载
      if (!instance.isMounted) {
        let proxy = instance.proxy;
        //执行组件的render，并执行返回的h函数，将h函数返回的vnode保存
        let subTree = instance.render.call(proxy, proxy);
        console.log(subTree);
        patch(null, subTree, container);
      }
    });
  };

  return {
    createApp: apiCreateApp(render),
  };
}
