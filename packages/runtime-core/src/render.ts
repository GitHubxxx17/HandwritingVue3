import { ShapeFlags } from "@vue/shared";
import { apiCreateApp } from "./apiCreateApp";
import { createComponentInstance, setupComponent } from "./components";
import { instance, vChildren, vnode } from "../types/global";
import { effect } from "@vue/reactivity";
import { CVnode, TEXT, isSameVNode } from "./vNode";

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
   * 卸载节点
   * @param {vnode} vnode
   */
  function unmount(vnode: vnode) {
    hostRemove(vnode.el);
  }

  /**
   * 合并对比前后虚拟dom并渲染dom节点
   * @param {vnode} n1 之前的虚拟dom
   * @param {vnode} n2 当前的虚拟dom
   * @param {*} container 挂载的容器
   */
  const patch = (
    n1: vnode | null,
    n2: vnode,
    container: any,
    ancher: any = null
  ) => {
    //获取当前vnode标识
    let { shapeFlag, type } = n2;

    if (n1 && !isSameVNode(n1, n2)) {
      //卸载之前的组件并重新挂载最新的
      unmount(n1);
      n1 = null;
    }
    switch (type) {
      case TEXT:
        console.log("文本");
        processText(n1, n2, container);
        break;
      default:
        //如果当前dom为元素
        if (shapeFlag & ShapeFlags.ELEMENT) {
          console.log("元素");
          processElement(n1, n2, container, ancher);
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
  const processElement = (
    n1: vnode | null,
    n2: vnode,
    container: any,
    ancher: any
  ) => {
    if (!n1) {
      //首次挂载元素
      mountElement(n2, container, ancher);
    } else {
      //更新元素
      patchElement(n1, n2, container, ancher);
    }
  };

  /**
   * 对比同一个元素
   * @param {(vnode)} n1
   * @param {vnode} n2
   * @param {*} container
   */
  const patchElement = (n1: vnode, n2: vnode, container: any, ancher: any) => {
    const el = (n2.el = n1.el);
    const oldProps = n1.props;
    const newProps = n2.props;
    //对比props
    patchProps(el, oldProps, newProps);
    //对比children
    patchChildren(n1, n2, el);
  };

  /**
   * 对比props
   * @param {*} el
   * @param {*} oldProps
   * @param {*} newProps
   */
  const patchProps = (el: any, oldProps: any, newProps: any) => {
    if (oldProps != newProps) {
      //遍历新的props并进行更新
      for (let key in newProps) {
        const prev = oldProps[key];
        const next = newProps[key];
        if (prev !== next) {
          hostPatchProp(el, key, prev, next);
        }
      }
    }
    //遍历旧的props并进行删除
    for (let key in oldProps) {
      if (!(key in newProps)) {
        hostPatchProp(el, key, newProps[key], null);
      }
    }
  };

  /**
   * 对比children
   * @param {vnode} n1
   * @param {vnode} n2
   * @param {*} el
   */
  const patchChildren = (n1: vnode, n2: vnode, el: any) => {
    //获取子节点
    const c1 = n1.children;
    const c2 = n2.children;
    //获取节点标识
    const oldShapeFlag = n1.shapeFlag;
    const newShapeFlag = n2.shapeFlag;
    //如果新的子节点是文本节点则全部替换成文本节点
    if (newShapeFlag & ShapeFlags.TEXT_CHILDREN) {
      hostSetElementText(el, c2);
    } else {
      //如果新的节点是数组
      //如果旧节点是数组
      if (oldShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        //如果旧节点是文本节点
        patchKeyedChildren(c1, c2, el);
        console.log(c1, c2);
      } else {
        //删除文本节点
        hostSetText(el, "");
        //挂载新的子节点
        mountChildren(el, c2);
      }
    }
  };

  /**
   * diff算法
   * 对比子节点数组
   * @param {vChildren[]} c1
   * @param {vChildren[]} c2
   * @param {*} el
   */
  const patchKeyedChildren = (c1: any, c2: any, el: any) => {
    let i = 0;
    let e1 = c1.length - 1;
    let e2 = c2.length - 1;
    //sync from start 从开头对比节点
    while (i <= e1 && i <= e2) {
      const n1 = c1[i];
      const n2 = c2[i];
      if (isSameVNode(n1, n2)) {
        patch(n1, n2, el);
      } else {
        break;
      }
      i++;
    }
    //sync from end 从结尾对比节点
    while (i <= e1 && i <= e2) {
      const n1 = c1[e1];
      const n2 = c2[e2];
      if (isSameVNode(n1, n2)) {
        patch(n1, n2, el);
      } else {
        break;
      }
      e1--;
      e2--;
    }

    console.log(i, e1, e2);

    //剩下的情况
    if (i > e1) {
      //旧的数据与新的数据相同且少
      const nextPros = e2 + 1; //插入的位置
      const ancher = nextPros < c2.length ? c2[nextPros].el : null;
      while (i <= e2) {
        patch(null, c2[i++], el, ancher);
      }
    } else if (i > e2) {
      //旧的数据与新的数据相同且多
      while (i <= e1) {
        unmount(c1[i++]);
      }
    } else {
      //处理乱序的情况
      let s1 = i;
      let s2 = i;
      //解决乱序对比问题
      let toBePatched = e2 - s2 + 1;
      let moved = false; //是否移动节点
      let maxNewIndexSoFar = 0; //
      const newIndexToPatchMap = new Array(toBePatched).fill(0);
      //创建映射表
      const keyIndexMap = new Map();
      //用新的乱序数据创建表
      for (let i = s2; i <= e2; i++) {
        const childVnode = c2[i];
        keyIndexMap.set(childVnode.key, i);
      }
      //遍历旧的数据
      for (let i = s1; i <= e1; i++) {
        const oldChildVnode = c1[i];
        let newIndex = keyIndexMap.get(oldChildVnode.key);
        if (newIndex === undefined) {
          //没有的删掉
          unmount(oldChildVnode);
        } else {
          newIndexToPatchMap[newIndex - s2] = i + 1; //不能等于0,否则会被卸载
          if (newIndex >= maxNewIndexSoFar) {
            maxNewIndexSoFar = newIndex;
          } else {
            moved = true;
          }
          //有的添加进去
          patch(oldChildVnode, c2[newIndex], el);
        }
      }

      const increasingNewIndexSequence = moved
        ? getSequence(newIndexToPatchMap)
        : [];
      let j = increasingNewIndexSequence.length - 1;

      //移动节点，添加新增的元素
      for (let i = toBePatched - 1; i >= 0; i--) {
        let currentIndex = i + s2;
        let child = c2[currentIndex];
        let ancher =
          currentIndex + 1 < c2.length ? c2[currentIndex + 1].el : null;
        if (newIndexToPatchMap[i] == 0) {
          patch(null, child, el, ancher);
        } else {
          if (!increasingNewIndexSequence.length) continue;
          if (i != increasingNewIndexSequence[j]) {
            hostInsert(child.el, el, ancher);
          } else {
            j--;
          }
        }
      }
    }
  };

  /**
   * 获取递增子序列的索引数组
   * @param arr - 输入数组
   * @returns 递增子序列的索引数组
   */
  function getSequence(arr: number[]): number[] {
    const previous = arr.slice(); // 用于记录每个位置的前一个位置的索引
    const result = [0]; // 用于记录递增子序列的索引
    let i, j, low, high, mid, current;
    const length = arr.length;

    for (i = 0; i < length; i++) {
      const currentValue = arr[i];
      if (currentValue !== 0) {
        // 如果当前值不为0
        j = result[result.length - 1]; // 获取最后一个递增子序列的索引
        if (arr[j] < currentValue) {
          // 如果最后一个递增子序列的值小于当前值
          previous[i] = j; // 记录当前位置的前一个位置的索引为最后一个递增子序列的索引
          result.push(i); // 将当前位置的索引添加到递增子序列中
          continue; // 跳过本次循环
        }
        low = 0; // 二分查找的起始位置
        high = result.length - 1; // 二分查找的结束位置
        while (low < high) {
          mid = (low + high) >> 1; // 二分查找的中间位置
          if (arr[result[mid]] < currentValue) {
            // 如果中间位置的值小于当前值
            low = mid + 1; // 更新起始位置为中间位置+1
          } else {
            high = mid; // 更新结束位置为中间位置
          }
        }
        if (currentValue < arr[result[low]]) {
          // 如果当前值小于递增子序列中找到的位置的值
          if (low > 0) {
            previous[i] = result[low - 1]; // 记录当前位置的前一个位置的索引为递增子序列中找到位置的前一个位置的索引
          }
          result[low] = i; // 更新递增子序列中找到位置的索引为当前位置的索引
        }
      }
    }

    current = result.length; // 当前递增子序列的长度
    j = result[current - 1]; // 获取最后一个递增子序列的索引
    while (current-- > 0) {
      // 逆序遍历递增子序列的索引数组
      result[current] = j; // 将最后一个递增子序列的索引赋值给当前位置的索引
      j = previous[j]; // 更新最后一个递增子序列的索引为前一个位置的索引
    }

    return result; // 返回递增子序列的索引数组
  }

  /**
   * 挂载元素
   * @param {vnode} vnode
   * @param {*} container
   */
  const mountElement = (vnode: vnode, container: any, ancher: any) => {
    const { props, shapeFlag, type, children } = vnode;
    //创建元素
    let el = (vnode.el = hostCreateElement(type));
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
    hostInsert(el, container, ancher);
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
        let subTree = (instance.subTree = instance.render.call(proxy, proxy));
        console.log(subTree);
        patch(null, subTree, container);
        instance.isMounted = true;
      } else {
        let proxy = instance.proxy;
        let preTree = instance.subTree as vnode;
        let nextTree = (instance.subTree = instance.render.call(proxy, proxy));
        patch(preTree, nextTree, container);
      }
    });
  };

  return {
    createApp: apiCreateApp(render),
  };
}
