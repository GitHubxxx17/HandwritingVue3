import { isObject } from "@vue/shared";
import {
  reactiveHandlers,
  shallowReactiveHandlers,
  readonlyHandlers,
  shallowReadonlyHandlers,
} from "./baseHandlers";

//代理映射表
const reactiveMap = new WeakMap();
const readonlyMap = new WeakMap();

export function reactive(target: any) {
  return createReactObj(target, false, reactiveHandlers);
}

export function shallowReactive(target: any) {
  return createReactObj(target, false, shallowReactiveHandlers);
}

export function readonly(target: any) {
  return createReactObj(target, false, readonlyHandlers);
}

export function shallowReadonly(target: any) {
  return createReactObj(target, false, shallowReadonlyHandlers);
}

/**
 * 核心 实现代理
 * @param {*} target 目标
 * @param {boolean} isReadonly 是否只读
 * @param {*} baseHandlers 代理配置
 * @return {*} 代理对象
 */
function createReactObj(target: any, isReadonly: boolean, baseHandlers: any) {
  //判断目标是否为对象
  if (!isObject(target)) {
    return target;
  }
  //代理数据
  const proxyMap = isReadonly ? readonlyMap : reactiveMap;
  //判断该对象是否被代理
  if (proxyMap.has(target)) {
    return proxyMap.get(target);
  }
  //代理对象
  const proxy = new Proxy(target, baseHandlers);
  proxyMap.set(target, proxy);
  return proxy;
}
