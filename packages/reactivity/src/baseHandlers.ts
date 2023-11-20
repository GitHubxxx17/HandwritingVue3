import {
  extend,
  hasOwn,
  haseChange,
  isArray,
  isIntegerKey,
  isObject,
} from "@vue/shared";
import { reactive, readonly } from "./reactive";
import { TrackOpTypes, TriggerOpTypes } from "./oprations";
import { Track, trigger } from "./effect";

/**
 *  创建获取函数
 * @param {boolean} [isReadonly=false] 是否只读
 * @param {boolean} [shallow=false] 是否浅层代理
 */
function createGetter(isReadonly = false, shallow = false) {
  return function get(target: any, key: string, receiver: any) {
    const res = Reflect.get(target, key, receiver);
    // 不是只读
    if (!isReadonly) {
      // 收集依赖 effect
      Track(target, TrackOpTypes.GET, key);
    }
    // 浅层代理
    if (shallow) {
      return res;
    }
    // res是一个对象 递归 懒代理
    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res);
    }
    return res;
  };
}

// set方法
function createSetter(shallow = false) {
  return function set(target: any, key: string, value: any, receiver: any) {
    // 判断是数组还是对象
    // 添加还是修改 (Number(key) < target.length)数组下标和数组长度比较, 小于是修改
    // haskey为false 新增 true修改
    const haskey =
      isArray(target) && isIntegerKey(key)
        ? Number(key) < target.length
        : hasOwn(target, key);
    //获取旧值
    const oldValue = target[key];
    const result = Reflect.set(target, key, value, receiver);

    if (!haskey) {
      // 新增
      trigger(target, TriggerOpTypes.ADD, key, value);
    } else {
      // 修改
      if (haseChange(value, oldValue)) {
        trigger(target, TriggerOpTypes.SET, key, value, oldValue);
      }
    }
    return result;
  };
}

const get = /*#__PURE__*/ createGetter();
const shallowGet = /*#__PURE__*/ createGetter(false, true);
const readonlyGet = /*#__PURE__*/ createGetter(true);
const shallowReadonlyGet = /*#__PURE__*/ createGetter(true, true);

const set = /*#__PURE__*/ createSetter();
const shallowSet = /*#__PURE__*/ createSetter(true);

//代理处理方法配置
export const reactiveHandlers = {
  get,
  set,
};
export const shallowReactiveHandlers = {
  get: shallowGet,
  set: shallowSet,
};

// 进行set方法合并
let readonlyObj = {
  set: (target: any, key: string, value: any) => {
    console.warn(`set ${value} on key ${key} is faild`);
  },
};

export const readonlyHandlers = extend(
  {
    get: readonlyGet,
  },
  readonlyObj
);
export const shallowReadonlyHandlers = extend(
  {
    get: shallowReadonlyGet,
  },
  readonlyObj
);
