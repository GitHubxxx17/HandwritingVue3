import { ShapeFlags, isFunction, isObject } from "@vue/shared";
import { instance, vnode } from "../types/global";
import { componentPublicInstance } from "./componentPublicInstance";

export /**
 * 创建组件实例
 * @param {vnode} vnode 虚拟dom
 * @return {instance} 组件实例
 */
const createComponentInstance = (vnode: vnode): instance => {
  //实例对象
  const instance: instance = {
    vnode,
    type: vnode.type,
    props: {}, //组件属性
    attrs: {}, //所有属性
    setupState: {}, //setup返回值
    ctx: {}, //上下文对象
    proxy: {}, //代理
    render: null, //渲染函数
    isMounted: false, //挂载状态
  };
  instance.ctx = { _: instance };
  return instance;
};

export /**
 * 解析数据到组件实例上
 * @param {instance} instance 组件实例
 */
const setupComponent = (instance: instance) => {
  //设置值
  const { props, children } = instance.vnode;
  //根据props解析到组件实例上
  instance.props = props;
  instance.children = children; //插槽
  //看看组件有没有setup
  let shapeFlag = instance.vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT;

  if (shapeFlag) {
    setupStateComponent(instance);
  }
};
//全局实例
export let currentInstance: instance | null;

/**
 * 处理setup函数
 * @param {instance} instance
 */
function setupStateComponent(instance: instance) {
  instance.proxy = new Proxy(instance.ctx, componentPublicInstance as any);
  //获取setup函数
  let component = instance.type;
  let { setup } = component;

  //处理setup的参数
  if (setup) {
    let setupContext = createContext(instance);
    //保存全局实例
    currentInstance = instance;
    let setupResult = setup(instance.props, setupContext);
    currentInstance = null;
    handleSetupResult(instance, setupResult);
  }
  finishComponentSetup(instance);
}

/**
 *  创建上下文对象
 * @param {instance} instance
 * @return {*}
 */
function createContext(instance: instance) {
  return {
    attrs: instance.attrs,
    slots: instance.slots,
    emit: () => {},
    expose: () => {},
  };
}

/**
 *  处理setup的结果
 * @param {instance} instance
 * @param {*} setupResult setup返回结果
 */
function handleSetupResult(instance: instance, setupResult: any) {
  //如果是函数
  if (isFunction(setupResult)) {
    instance.render = setupResult;
    // 如果是对象
  } else if (isObject(setupResult)) {
    instance.setupState = setupResult;
  }
}

/**
 * 处理render函数
 * @param {instance} instance
 */
function finishComponentSetup(instance: instance) {
  let component = instance.type;
  if (!instance.render) {
    if (!component.render && component.template) {
    }
    instance.render = component.render;
  }
}

export const getCurrentInstance = () => {
  return currentInstance;
};

export const setCurrentInstance = (target: instance | null) => {
  currentInstance = target;
};
