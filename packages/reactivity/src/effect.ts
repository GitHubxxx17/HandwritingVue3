import { isArray, isIntegerKey, isString } from "@vue/shared";
import { TrackOpTypes, TriggerOpTypes } from "./oprations";

let uid = 0; //effect id参数
let activeEffect: any = null; //保存effect函数
let effectStack: Function[] = []; //effect依赖函数栈
/**
 *
 * @param {Function} fn 用户传过来的函数
 * @param {*} options 用户传过来的配置
 * @return {*}
 */
function createReactEffect(fn: Function, options: any) {
  const effect = function reactiveEffect() {
    //保证effect唯一性
    if (!effectStack.includes(effect)) {
      try {
        effectStack.push(effect);
        activeEffect = effect;
        fn(); //执行用户的方法
      } finally {
        effectStack.pop();
        activeEffect = effectStack.at(-1);
      }
    }
  };
  effect.id = uid++; //区别effect
  effect._isEffect = true; //区别effect 是不是响应式的effect
  effect.raw = fn; //保存用户的方法
  effect.options = options; //保存用户的属性
  return effect;
}

/**
 *  返回effect函数
 * @export
 * @param {Function} fn 用户传过来的函数
 * @param {*} [options={}] 用户传过来的配置
 * @return {*}
 */
export function effect(fn: Function, options: any = {}) {
  const effect = createReactEffect(fn, options);
  //是否立即执行
  if (!options.lazy) {
    effect();
  }
  return effect;
}

let targetMap = new WeakMap(); //代理对象结构表
/**
 *  收集依赖
 * @export
 * @param {*} target 目标代理对象
 * @param {TrackOpTypes} type 类型
 * @param {string} key 属性
 */
export function Track(target: any, type: TrackOpTypes, key: string) {
  //没有在effect函数中读取代理对象的属性
  if (activeEffect === undefined) return;
  //获取代理对象属性依赖表
  let depMap = targetMap.get(target);
  if (!depMap) {
    targetMap.set(target, (depMap = new Map()));
  }
  //获取属性对应effect函数集合
  let dep = depMap.get(key);
  if (!dep) {
    depMap.set(key, (dep = new Set()));
  }

  if (!dep.has(activeEffect)) {
    dep.add(activeEffect);
  }
  // console.log(targetMap);
}

/**
 * 触发更新
 * @export
 * @param {object} target 代理对象
 * @param {TriggerOpTypes} type 类型
 * @param {string} [key] 属性
 * @param {unknown} [newValue] 新值
 * @param {unknown} [oldValue] 旧值
 */
export function trigger(
  target: object,
  type: TriggerOpTypes,
  key?: string,
  newValue?: unknown,
  oldValue?: unknown
) {
  console.log(target, type, key, newValue, oldValue, targetMap);

  const depsMap = targetMap.get(target);
  // 判断是否有目标对象
  if (!depsMap) return;
  let effectSet = new Set(); // set去重

  const add = (effectAdd: any) => {
    if (effectAdd) {
      effectAdd.forEach((effect: any) => effectSet.add(effect));
    }
  };

  console.log(depsMap.get(key), effectSet, key === "length" && isArray(target));

  // 处理数组 key === length
  if (key === "length" && isArray(target)) {
    console.log(depsMap, "dep");
    depsMap.forEach((dep: any, key: any) => {
      console.log(key, newValue);
      if (key === "length" || (isString(key) && key >= (newValue as number))) {
        add(dep);
      }
    });
  } else {
    // 可能是对象
    if (key !== undefined) {
      add(depsMap.get(key)); // 获取当前属性的effect
    }
    switch (type) {
      case TriggerOpTypes.ADD:
        if (isArray(target) && isIntegerKey(key!)) {
          add(depsMap.get("length"));
        }
    }
  }
  // // 执行
  // effectSet.forEach((effect: any) => {
  //   if (effect.options.sch) {
  //     effect.options.sch(effect);
  //   } else {
  //     effect();
  //   }
  // });
}
